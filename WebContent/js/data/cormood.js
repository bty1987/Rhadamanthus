$(function() {

    var cormood = {
        qfid: params.data.quotationFormat != null ? params.data.quotationFormat.qfid : 0,
        items: {
            noodsName: com.focusPage('#noodsName', "#addCormoodModal"),
            normunit: com.focusPage('#normunit', "#addCormoodModal"),
            normnum: com.focusPage('#normnum', "#addCormoodModal"),
            storeunit: com.focusPage('#storeunit', "#addCormoodModal"),
            storenum: com.focusPage('#storenum', "#addCormoodModal"),
            price: com.focusPage('#price', "#addCormoodModal")
        },
        modals: {
            addCormoodModal: com.focusPage('#addCormoodModal')
        },
        btns: {
            addCormoodBtn: com.focusPage('#addCormoodBtn'),
            addCormoodItemBtn: com.focusPage('#addCormoodItemBtn'),
            cormoodBackBtn: com.focusPage('#cormoodBackBtn'),
        },
    };

    cormood.btns.addCormoodItemBtn.bindClick(saveData);

    cormood.btns.cormoodBackBtn.click(function() {

        com.closePopup();
    });

    cormood.modals.addCormoodModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("noodsName");
        com.cleanItems(cormood.items);
    });

    com.initTypeahead(cormood.items.noodsName, api.data.queryNoodsByName, "noods.name", {}, "noodes", "nid", "name", null);

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        cormood.items.normunit.bindData(res.measurementUnits, "name", "name");
        cormood.items.storeunit.bindData(res.measurementUnits, "name", "name");
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

            var propertyArr = [["定额单位: ", v.normunit, "gray"], ["定额数量: ", v.normnum, "blue"], ["库房单位: ", v.storeunit, "gray"], ["库房数量: ", v.storenum, "blue"], ["价格: ", v.price, "blue"], ["状态: ", v.status == 0 ? "有效" : "无效", "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function() {

                com.post(api.data.deleteCormood, {
                    "cormood.cgid": v.cgid
                }, function(e) {

                    com.showAlert(com.info, "操作成功");
                    $liLine.remove();
                });
            });

            return $liLine;
        };

        return {
            init: function() {

                com.post(api.data.queryCormoodByQfid, {
                    "cormood.qfid": cormood.qfid
                }, function(res) {

                    com.focusPage('#cormoodResultList').html(null);
                    renderList('cormoodResultList', res.cormoods);
                });
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    displayFunc.init();

    cormood.btns.addCormoodBtn.click(function(e) {

        cormood.modals.addCormoodModal.modal("show");
    });

    function saveData() {

        if (com.validate('addCormoodModal')) {
            return false;
        }

        var option = {
            "cormood.noods.nid": com.typeahead(cormood.items.noodsName),
            "cormood.name": cormood.items.noodsName.val(),
            "cormood.normunit": cormood.items.normunit.val(),
            "cormood.normnum": cormood.items.normnum.val(),
            "cormood.storeunit": cormood.items.storeunit.val(),
            "cormood.storenum": cormood.items.storenum.val(),
            "cormood.price": cormood.items.price.val(),
            "cormood.qfid": cormood.qfid
        };

        com.post(api.data.addCormood, option, function(e) {

            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            cormood.modals.addCormoodModal.modal("hide");
        });
    }
});
