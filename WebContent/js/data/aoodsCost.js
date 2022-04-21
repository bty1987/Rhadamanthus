$(function() {

    var aoodsCost = {
        aid: params.data.aoods.aid,

        btns: {
            backBtn: com.focusPage('#backBtn'),
            addBtn: com.focusPage('#addBtn'),
            confirmBtn: com.focusPage('#confirmBtn')
        }
    };

    aoodsCost.btns.backBtn.click(function() {
        com.closePopup();
    });

    com.post(api.data.queryConstructionCost, {}, function(res) {
        com.focusPage('select[name="constructionCost"]').bindData(res.constructionCostVOs, 'ccid', 'name', true);
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.aoods.goods.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-yellow').html('删除');

            var propertyArr = [
            // ["工程成本: ", v.constructionCost.name, "grey"],
            ["起始面积: ", v.constructionCost.areaLeft, "blue"], ["终止面积: ", v.constructionCost.areaRight, "blue"], ["辅料额: ", v.constructionCost.accessory, "blue"], ["状态: ", v.constructionCost.status == 0 ? "启用" : "禁用", "red"], ["排序: ", v.constructionCost.sort, "blue"], ["数量上限: ", v.numLimit, "blue"], ];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function() {
                com.post(api.data.deleteAoodsCost, {
                    "aoodsCost.acid": v.acid
                }, function() {
                    com.showAlert(com.info, "操作成功");
                    costsearcher.doSearch();
                })
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {
                return creatLine(v);
            }
        }
    })();

    var costsearcher = new Searcher();

    costsearcher.init(null, "condListCost", api.data.pageAoodsCost, function(data) {
        displayFunc.init('resultListCost', data);
    }, "pagenationCost", "aoodsCostPostData", {
        "aoodsCost.aoods.aid": aoodsCost.aid,
    }, false, null, null, "resultListCost");

    aoodsCost.btns.addBtn.click(function() {
        com.popup4mini('#miniPopUp', '#addAoodsCost', "添加");
    });

    aoodsCost.btns.confirmBtn.click(function() {
        savaData();
    });

    function savaData() {

        if (com.validate('formAoodsCost', 'right')) { return false }

        var aid = aoodsCost.aid;
        var ccid = com.focusPage("#constructionCost").val();
        var numLimit = com.focusPage("#numLimit").val();

        var options = {
            "aoodsCost.aoods.aid": aid,
            "aoodsCost.constructionCost.ccid": ccid,
            "aoodsCost.numLimit": numLimit,
        };

        com.post(api.data.addAoodsCost, options, function() {
            com.showAlert(com.info, "操作成功");
            com.closePopup(com.focusPage("#confirmBtn", "#miniPopUp"));
            costsearcher.doSearch();
        });
    }

})();