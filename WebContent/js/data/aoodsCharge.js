$(function() {

    var aoodsCharge = {
        aid: params.data.aoods.aid,
        acid: null, // 编辑时使用
        keyword: null,

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
            editSort: com.focusPage("#editSort", "#editAoodsCharge"),

            executeDateCharge: com.focusPage("#executeDateCharge", "#importChargeModal"),
            executeTimeCharge: com.focusPage("#executeTimeCharge", "#importChargeModal"),
            chargeFilePath: com.focusPage("#chargeFilePath")
        },

        btns: {
            backBtn: com.focusPage('#backBtn'),
            addBtn: com.focusPage('#addBtn'),
            confirmBtn: com.focusPage('#confirmBtn'),
            editConfirmBtn: com.focusPage('#editConfirmBtn'),
            importChargeBtn: com.focusPage('#importChargeBtn'),
            importChargeConfirmBtn: com.focusPage('#importChargeConfirmBtn')
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["费用名称: ", v.name, "grey"],
                ["价格: ", v.price, "blue"],
                ["浮动额: ", v.surplus, "blue"],
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
                    searcher.doSearch();
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

    var searcher = new Searcher();

    searcher.init(null, "condListCharge", api.data.pageAoodsCharge, function(data) {
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

    // 导入按钮
    aoodsCharge.btns.importChargeBtn.click(function() {
        aoodsCharge.items.executeDateCharge.val('');
        aoodsCharge.items.executeTimeCharge.val('');
        aoodsCharge.items.chargeFilePath.val('');
        com.popup4model('#importChargeModal', '导入辅材费用');
    });

    // 设置日期时间选择器
    com.datetime(aoodsCharge.items.executeDateCharge, 'date', false);
    com.datetime(aoodsCharge.items.executeTimeCharge, 'time', false);

    // 文件上传
    com.uploadify('#chargeFileUpload', '上传文件', api.common.uploadFile, 'btn btn-success', '*.xls;*.xlsx', {}, 1, function(data) {
        aoodsCharge.items.chargeFilePath.val(data.resUrl);
    });

    // 导入确认按钮
    aoodsCharge.btns.importChargeConfirmBtn.click(function() {
        importAoodsCharge();
    });

    // 保存数据
    function saveData() {
        
        if (com.validate('addAoodsCharge', 'right')) {
            return false;
        }

        var options = {
            "aoodsCharge.aoods.aid": aoodsCharge.aid,
            "aoodsCharge.name": com.focusPage("#name", "#addAoodsCharge").val(),
            "aoodsCharge.price": com.focusPage("#price", "#addAoodsCharge").val()|| 0,
            "aoodsCharge.surplus": com.focusPage("#surplus", "#addAoodsCharge").val() || 0,
            "aoodsCharge.type": com.focusPage("#type", "#addAoodsCharge").val(),
            "aoodsCharge.status": com.focusPage("#status", "#addAoodsCharge").val(),
            "aoodsCharge.sort": com.focusPage("#sort", "#addAoodsCharge").val() || 0
        };
        
        console.log(aoodsCharge.items.name)
        
        console.log(options)
        
        com.post(api.data.addAoodsCharge, options, function() {
            com.showAlert(com.info, "添加成功");
            com.closePopup(com.focusPage("#confirmBtn", "#miniPopUp"));
            searcher.doSearch();
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
            "aoodsCharge.name": com.focusPage("#name", "#addAoodsCharge").val(),
            "aoodsCharge.price": com.focusPage("#price", "#addAoodsCharge").val()|| 0,
            "aoodsCharge.surplus": com.focusPage("#surplus", "#addAoodsCharge").val() || 0,
            "aoodsCharge.type": com.focusPage("#type", "#addAoodsCharge").val(),
            "aoodsCharge.status": com.focusPage("#status", "#addAoodsCharge").val(),
            "aoodsCharge.sort": com.focusPage("#sort", "#addAoodsCharge").val() || 0
        };

        com.post(api.data.updateAoodsCharge, options, function() {
            com.showAlert(com.info, "更新成功");
            com.closePopup(com.focusPage("#editConfirmBtn", "#miniPopUp"));
            searcher.doSearch();
        });
    }

    function importAoodsCharge() {

        var filePath = aoodsCharge.items.chargeFilePath.val();

        if (filePath == null || filePath == '') {
            com.showAlert(com.warning, '上传文件不能为空');
            return false;
        }

        var args = filePath + ',' + aoodsCharge.aid;

        var date = aoodsCharge.items.executeDateCharge.val();
        var time = aoodsCharge.items.executeTimeCharge.val();

        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = date + ' ' + time;
        var checkTime = new Date(times);

        if (!planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, '执行时间请大于当前时间' + config.planTimeLimit + '分钟');
            return false;
        }

        var options = {
            'plan.task.keyWord': 'import_aoodscharge',
            'plan.executeTime': executeTime,
            'plan.args': args
        };

        com.post(api.information.createPlan, options, function(res) {
            com.showAlert(com.info, '计划创建成功');
            com.closePopup();
        });
    }

});
