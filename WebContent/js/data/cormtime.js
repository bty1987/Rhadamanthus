$(function() {

    var cormtime = {
        qfid: params.data.quotationFormat != null ? params.data.quotationFormat.qfid : 0,
        items: {
            constructionNode: com.focusPage('#constructionNode', "#addCormtimeModal"),
            unit: com.focusPage('#unit', "#addCormtimeModal"),
            trannum: com.focusPage('#trannum', "#addCormtimeModal"),
            workdays: com.focusPage('#workdays', "#addCormtimeModal")
        },
        modals: {
            addCormtimeModal: com.focusPage('#addCormtimeModal')
        },
        btns: {
            addCormtimeBtn: com.focusPage('#addCormtimeBtn'),
            addCormtimeItemBtn: com.focusPage('#addCormtimeItemBtn'),
            cormtimeBackBtn: com.focusPage('#cormtimeBackBtn'),
        },
    };

    cormtime.btns.addCormtimeItemBtn.bindClick(saveData);

    cormtime.btns.cormtimeBackBtn.click(function() {

        com.closePopup();
    });

    cormtime.modals.addCormtimeModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("constructionNode");
        com.cleanItems(cormtime.items);
    });

    com.post(api.data.queryMeasurementUnit, {}, function(res) {

        cormtime.items.unit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        cormtime.items.constructionNode.bindData(res.constructionNodes, "cnid", "name");
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.constructionNode.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

            var propertyArr = [["定额单位: ", v.unit, "gray"], ["转换量: ", v.trannum, "blue"], ["工时(天): ", v.workdays, "blue"], ["状态: ", v.status == 0 ? "有效" : "无效", "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function() {

                com.post(api.data.deleteCormtime, {
                    "cormtime.ctid": v.ctid
                }, function(e) {

                    com.showAlert(com.info, "操作成功");
                    $liLine.remove();
                });
            });

            return $liLine;
        };

        return {
            init: function() {

                com.post(api.data.queryCormtimeByQfid, {
                    "cormtime.qfid": cormtime.qfid
                }, function(res) {

                    com.focusPage('#cormtimeResultList').html(null);
                    renderList('cormtimeResultList', res.cormtimes);
                });
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    displayFunc.init();

    cormtime.btns.addCormtimeBtn.click(function(e) {

        cormtime.modals.addCormtimeModal.modal("show");
    });

    function saveData() {

        if (com.validate('addCormtimeModal')) {
            return false;
        }

        var option = {
            "cormtime.constructionNode.cnid": cormtime.items.constructionNode.val(),
            "cormtime.unit": cormtime.items.unit.val(),
            "cormtime.trannum": cormtime.items.trannum.val(),
            "cormtime.workdays": cormtime.items.workdays.val(),
            "cormtime.qfid": cormtime.qfid
        };

        com.post(api.data.addCormtime, option, function(e) {

            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            cormtime.modals.addCormtimeModal.modal("hide");
        });
    }
});
