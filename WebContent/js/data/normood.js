$(function() {
    // 定额商品
    var normood = {
        qiid : params.qiid,
        items: {
            goodsName: com.focusPage('#goodsName'),
            num: com.focusPage('#num')
        },
        modals: {
            addNormoodModal: com.focusPage('#addNormoodModal')
        },
        btns: {
            addNormoodBtn: com.focusPage('#addNormoodBtn'),
            normoodBackBtn: com.focusPage('#normoodBackBtn'),
            addNormoodItemBtn: com.focusPage('#addNormoodItemBtn')
        },
    };

    normood.btns.addNormoodItemBtn.bindClick(saveData);

    normood.btns.normoodBackBtn.click(function() {
        com.closePopup();
    });

    normood.modals.addNormoodModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        com.cleanTypeahead("goodsName");
        com.cleanItems(normood.items);
    });

    com.initTypeahead('goodsName', api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", null);

    var displayFunc  = (function(){

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.goods.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

            var propertyArr = [
                ["商品编号:", v.goods.no, "blue"],
                ["商品品牌: ", v.goods.brand, "blue"],
                ["商品品类: ", v.goods.category, "blue"],
                ["使用数量: ", v.num, "blue"],
                ["状态: ", v.status == 0 ? "有效":"无效", "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function() {
                com.post(api.data.deleteNormood, {"normood.ngid": v.ngid}, function(e) {
                    com.showAlert(com.info, "操作成功");
                    $liLine.remove();
                });
            });

            return $liLine;
        };

        return {
            init : function(){
                com.post(api.data.queryNormoodByQiid, {"normood.quotationItem.qiId": normood.qiid}, function(res){
                    com.focusPage('#normoodResultList').html(null);
                    renderList('normoodResultList', res.normoods);
                });
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    displayFunc.init();

    normood.btns.addNormoodBtn.click(function(e){
        normood.modals.addNormoodModal.modal("show");
    });

    function saveData() {
        if (com.validate('addNormoodModal')) {
            return false;
        }

        var gid = com.typeahead("goodsName");

        if (!gid) {
            com.showAlert(com.error, "数据绑定失败");
            normood.modals.addNormoodModal.modal("hide");
            return false;
        }

        var option = {
            "normood.goods.gid": gid,
            "normood.num": normood.items.num.val(),
            "normood.quotationItem.qiId": normood.qiid
        };

        com.post(api.data.addNormood, option, function(e){
            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            normood.modals.addNormoodModal.modal("hide");
        });
    }
});
