$(function() {

    var normood = {
        qiid : params.qiid,
        items: {
            goodsName: com.focusPage('#goodsName', "#addNormoodModal"),
            normunit: com.focusPage('#normunit', "#addNormoodModal"),
            normnum: com.focusPage('#normnum', "#addNormoodModal"),
            storeunit: com.focusPage('#storeunit', "#addNormoodModal"),
            storenum: com.focusPage('#storenum', "#addNormoodModal")
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

    com.initTypeahead('goodsName', api.data.queryAoodsByName, "aoods.goods.name", {}, "aoodes", "gid", "name", null);
    
    com.post(api.common.queryMeasurementUnit, {}, function (res) {
        normood.items.normunit.bindData(res.measurementUnits, "name", "name");
    });
    
    com.post(api.common.queryMeasurementUnit, {}, function (res) {
        normood.items.storeunit.bindData(res.measurementUnits, "name", "name");
    });
    
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
                ["编号:", v.goods.no, "blue"],
                ["品牌: ", v.goods.brand, "gray"],
                ["品类: ", v.goods.category, "gray"],
                ["商品单位: ", v.goods.measurementUnit, "gray"],
                ["报价单位: ", v.quotationItem.measurementUnit, "gray"],
                ["定额单位: ", v.normunit, "gray"],
                ["定额数量: ", v.normnum, "blue"],
                ["库房单位: ", v.storeunit, "gray"],
                ["库房数量: ", v.storenum, "blue"],
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
                com.post(api.data.queryNormoodByQiid, {"normood.quotationItem.qiid": normood.qiid}, function(res){
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
            "normood.normunit": normood.items.normunit.val(),
            "normood.normnum": normood.items.normnum.val(),
            "normood.storeunit": normood.items.storeunit.val(),
            "normood.storenum": normood.items.storenum.val(),
            "normood.quotationItem.qiid": normood.qiid
        };

        com.post(api.data.addNormood, option, function(e){
            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            normood.modals.addNormoodModal.modal("hide");
        });
    }
});
