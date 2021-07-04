$(function() {
    
    var normrice = {
        qiid: params.qiid,
        items: {
            constructionNode: com.focusPage('#constructionNode', "#addNormriceModal"),
            unit: com.focusPage('#unit', "#addNormriceModal"),
            trannum: com.focusPage('#trannum', "#addNormriceModal"),
            salary: com.focusPage('#salary', "#addNormriceModal")
        },
        modals: {
            addNormriceModal: com.focusPage('#addNormriceModal')
        },
        btns: {
            addNormriceBtn: com.focusPage('#addNormriceBtn'),
            addNormriceItemBtn: com.focusPage('#addNormriceItemBtn'),
            normriceBackBtn: com.focusPage('#normriceBackBtn'),
        },
    };

    normrice.btns.addNormriceItemBtn.bindClick(saveData);

    normrice.btns.normriceBackBtn.click(function() {
        com.closePopup();
    });

    normrice.modals.addNormriceModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        com.cleanTypeahead("constructionNode");
        com.cleanItems(normrice.items);
    });
    
    com.post(api.data.queryMeasurementUnit, {}, function (res) {
        normrice.items.unit.bindData(res.measurementUnits, "name", "name");
    });
    
    com.post(api.data.queryConstructionNode, {}, function (res) {
        normrice.items.constructionNode.bindData(res.constructionNodes, "cnid", "name");
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.constructionNode.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

            var propertyArr = [
                ["报价单位: ", v.quotationItem.measurementUnit, "gray"],
                ["定额单位: ", v.unit, "gray"],
                ["转换量: ", v.trannum, "blue"],
                ["工费: ", v.salary, "blue"],
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
                com.post(api.data.deleteNormrice, {"normrice.npid": v.npid}, function(e) {
                    com.showAlert(com.info, "操作成功");
                    $liLine.remove();
                });
            });

            return $liLine;
        };

        return {
            init : function(){
                com.post(api.data.queryNormriceByQiid, {"normrice.quotationItem.qiid": normrice.qiid}, function(res){
                    com.focusPage('#normriceResultList').html(null);
                    renderList('normriceResultList', res.normrices);
                });
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    displayFunc.init();

    normrice.btns.addNormriceBtn.click(function(e){
        normrice.modals.addNormriceModal.modal("show");
    });

    function saveData(){
        
        if (com.validate('addNormriceModal')) {
            return false;
        }

        var option = {
            "normrice.constructionNode.cnid": normrice.items.constructionNode.val(),
            "normrice.unit": normrice.items.unit.val(),
            "normrice.trannum": normrice.items.trannum.val(),
            "normrice.salary": normrice.items.salary.val(),
            "normrice.quotationItem.qiid": normrice.qiid
        };

        com.post(api.data.addNormrice, option, function(e){
            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            normrice.modals.addNormriceModal.modal("hide");
        });
    }
});