$(function() {

    var cormrice = {
        qcid: params.data.quotationCtem.qcid,
        items: {
            constructionNode: com.focusPage('#constructionNode', "#addCormriceModal"),
            unit: com.focusPage('#unit', "#addCormriceModal"),
            trannum: com.focusPage('#trannum', "#addCormriceModal"),
            salary: com.focusPage('#salary', "#addCormriceModal")
        },
        modals: {
            addCormriceModal: com.focusPage('#addCormriceModal')
        },
        btns: {
            addCormriceBtn: com.focusPage('#addCormriceBtn'),
            addCormriceItemBtn: com.focusPage('#addCormriceItemBtn'),
            cormriceBackBtn: com.focusPage('#cormriceBackBtn'),
        },
    };

    cormrice.btns.addCormriceItemBtn.bindClick(saveData);

    cormrice.btns.cormriceBackBtn.click(function() {

        com.closePopup();
    });

    cormrice.modals.addCormriceModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("constructionNode");
        com.cleanItems(cormrice.items);
    });

    com.post(api.data.queryMeasurementUnit, {}, function(res) {

        cormrice.items.unit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        cormrice.items.constructionNode.bindData(res.constructionNodes, "cnid", "name");
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

            var propertyArr = [["公共项单位: ", v.quotationCtem.unit.name, "gray"], ["定额单位: ", v.unit, "gray"], ["转换量: ", v.trannum, "blue"], ["工费: ", v.salary, "blue"], ["状态: ", constant.data().cormrice.status.keys[v.status], "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.click(function() {

                com.post(api.data.deleteCormrice, {
                    "cormrice.cpid": v.cpid
                }, function(e) {

                    com.showAlert(com.info, "操作成功");
                    $liLine.remove();
                });
            });

            return $liLine;
        };

        return {
            init: function() {

                com.post(api.data.queryCormriceByQcid, {
                    "cormrice.quotationCtem.qcid": cormrice.qcid
                }, function(res) {

                    com.focusPage('#cormriceResultList').html(null);
                    renderList('cormriceResultList', res.cormrices);
                });
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    displayFunc.init();

    cormrice.btns.addCormriceBtn.click(function(e) {

        cormrice.modals.addCormriceModal.modal("show");
    });

    function saveData() {

        if (com.validate('addCormriceModal')) {
            return false;
        }

        var option = {
            "cormrice.constructionNode.cnid": cormrice.items.constructionNode.val(),
            "cormrice.unit": cormrice.items.unit.val(),
            "cormrice.trannum": cormrice.items.trannum.val(),
            "cormrice.salary": cormrice.items.salary.val(),
            "cormrice.quotationCtem.qcid": cormrice.qcid
        };

        com.post(api.data.addCormrice, option, function(e) {

            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            cormrice.modals.addCormriceModal.modal("hide");
        });
    }
});