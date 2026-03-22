$(function() {

    var aoodsCharge = {
        aid: params.data.aoods.aid,
        acid: null, // 编辑时使用

        items: {
            name: com.focusPage("#name", "#addAoodsCharge"),
            price: com.focusPage("#price", "#addAoodsCharge"),
            surplus: com.focusPage("#surplus", "#addAoodsCharge"),
            type: com.focusPage("#type", "#addAoodsCharge"),
            status: com.focusPage("#status", "#addAoodsCharge"),
            sort: com.focusPage("#sort", "#addAoodsCharge"),

            editName: com.focusPage("#editName", "#editAoodsCharge"),
            editPrice: com.focusPage("#editPrice", "#editAoodsCharge"),
            editSurplus: com.focusPage("#editSurplus", "#editAoodsCharge"),
            editType: com.focusPage("#editType", "#editAoodsCharge"),
            editStatus: com.focusPage("#editStatus", "#editAoodsCharge"),
            editSort: com.focusPage("#editSort", "#editAoodsCharge")
        },

        btns: {
            backBtn: com.focusPage('#backBtn'),
            addBtn: com.focusPage('#addBtn'),
            confirmBtn: com.focusPage('#confirmBtn'),
            editConfirmBtn: com.focusPage('#editConfirmBtn')
        }
    };

    // 绑定常量数据到下拉框
    aoodsCharge.items.type.bindData(constant.data.aoodsCharge.type.datas, "key", "value");
    aoodsCharge.items.status.bindData(constant.data.aoodsCharge.status.datas, "key", "value");
    aoodsCharge.items.editType.bindData(constant.data.aoodsCharge.type.datas, "key", "value");
    aoodsCharge.items.editStatus.bindData(constant.data.aoodsCharge.status.datas, "key", "value");

    aoodsCharge.btns.backBtn.click(function() {
        com.closePopup();
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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["费用名称: ", v.name, "grey"],
                ["价格: ", (v.price / 1000).toFixed(3), "blue"],
                ["浮动额: ", (v.surplus / 1000).toFixed(3), "blue"],
                ["费用类型: ", constant.data.aoodsCharge.type.keys[v.type], "red"],
                ["状态: ", constant.data.aoodsCharge.status.keys[v.status], "red"],
                ["排序: ", v.sort, "blue"]
            ];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            // 编辑按钮
            $btnEdit.click(function() {
                editData(v);
            });

            // 删除按钮
            $btnDel.click(function() {
                com.post(api.data.deleteAoodsCharge, {
                    "aoodsCharge.acid": v.acid
                }, function() {
                    com.showAlert(com.info, "删除成功");
                    chargesearcher.doSearch();
                });
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

    var chargesearcher = new Searcher();

    chargesearcher.init(null, "condListCharge", api.data.pageAoodsCharge, function(data) {
        displayFunc.init('resultListCharge', data);
    }, "pagenationCharge", "aoodsChargePostData", {
        "aoodsCharge.aoods.aid": aoodsCharge.aid
    }, false, null, null, "resultListCharge");

    // 添加按钮
    aoodsCharge.btns.addBtn.click(function() {
        // 清空表单
        aoodsCharge.items.name.val('');
        aoodsCharge.items.price.val('');
        aoodsCharge.items.surplus.val('');
        aoodsCharge.items.type.val('0');
        aoodsCharge.items.status.val('0');
        aoodsCharge.items.sort.val('0');

        com.popup4mini('#miniPopUp', '#addAoodsCharge', "添加辅材费用");
    });

    // 添加确认按钮
    aoodsCharge.btns.confirmBtn.click(function() {
        saveData();
    });

    // 编辑确认按钮
    aoodsCharge.btns.editConfirmBtn.click(function() {
        updateData();
    });

    // 保存数据
    function saveData() {
        if (com.validate('formAoodsCharge', 'right')) {
            return false;
        }

        var options = {
            "aoodsCharge.aoods.aid": aoodsCharge.aid,
            "aoodsCharge.name": aoodsCharge.items.name.val(),
            "aoodsCharge.price": aoodsCharge.items.price.val(),
            "aoodsCharge.surplus": aoodsCharge.items.surplus.val() || 0,
            "aoodsCharge.type": aoodsCharge.items.type.val(),
            "aoodsCharge.status": aoodsCharge.items.status.val(),
            "aoodsCharge.sort": aoodsCharge.items.sort.val() || 0
        };

        com.post(api.data.addAoodsCharge, options, function() {
            com.showAlert(com.info, "添加成功");
            com.closePopup(com.focusPage("#confirmBtn", "#miniPopUp"));
            chargesearcher.doSearch();
        });
    }

    // 编辑数据
    function editData(v) {
        aoodsCharge.acid = v.acid;

        // 填充表单
        aoodsCharge.items.editName.val(v.name);
        aoodsCharge.items.editPrice.val((v.price / 1000).toFixed(3));
        aoodsCharge.items.editSurplus.val((v.surplus / 1000).toFixed(3));
        aoodsCharge.items.editType.val(v.type);
        aoodsCharge.items.editStatus.val(v.status);
        aoodsCharge.items.editSort.val(v.sort);

        com.popup4mini('#miniPopUp', '#editAoodsCharge', "编辑辅材费用");
    }

    // 更新数据
    function updateData() {
        if (com.validate('editFormAoodsCharge', 'right')) {
            return false;
        }

        var options = {
            "aoodsCharge.acid": aoodsCharge.acid,
            "aoodsCharge.name": aoodsCharge.items.editName.val(),
            "aoodsCharge.price": aoodsCharge.items.editPrice.val(),
            "aoodsCharge.surplus": aoodsCharge.items.editSurplus.val() || 0,
            "aoodsCharge.type": aoodsCharge.items.editType.val(),
            "aoodsCharge.status": aoodsCharge.items.editStatus.val(),
            "aoodsCharge.sort": aoodsCharge.items.editSort.val() || 0
        };

        com.post(api.data.updateAoodsCharge, options, function() {
            com.showAlert(com.info, "更新成功");
            com.closePopup(com.focusPage("#editConfirmBtn", "#miniPopUp"));
            chargesearcher.doSearch();
        });
    }

})();
