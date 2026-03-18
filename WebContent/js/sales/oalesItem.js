jQuery(function($) {

    var oalesitem = {

        oid: params.sales.oales.oid
    // 外销单ID
    };

    // 如果没有外销单ID，提示错误
    if (!oalesitem.oid) {
        com.showAlert(com.error, '缺少外销单ID参数');
        return;
    }

    var url = api.sales.pageOalesItem;
    var conditions = [];
    var options = {
        "oalesItem.oid": oalesitem.oid
    };

    var searcher = new Searcher();

    searcher.base("oalesItemCondList", "oalesItemPagenation", "oalesItemResultList", url);
    searcher.condition(conditions);
    searcher.param(options);

    // 添加创建外销项按钮
    searcher.button([{
        id: "oalesItemAddBtn",
        name: "创建外销项",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        field: "oiid",
        type: "checkbox",
        name: "oalesItemId",
        prop: "oiid"
    }, {
        field: "name",
        name: "商品名称",
        prop: "name",
        clazz: "blue"
    }, {
        field: "format",
        name: "规格",
        prop: "format",
        clazz: "grey"
    }, {
        field: "color",
        name: "颜色",
        prop: "color",
        clazz: "grey"
    }, {
        field: "model",
        name: "型号",
        prop: "model",
        clazz: "grey"
    }, {
        field: "price",
        name: "价格（元）",
        prop: "price",
        clazz: "blue",
        format: function(v) {

            return com.formatMoney(v / 1000, 3);
        }
    }, {
        field: "num",
        name: "数量",
        prop: "num",
        clazz: "grey"
    }, {
        field: "total",
        name: "小计（元）",
        prop: "total",
        clazz: "blue",
        format: function(v) {

            return com.formatMoney(v / 1000, 3);
        }
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm('确认删除该外销项吗？', function() {

                com.post(api.sales.deleteOalesItem, {
                    'oalesItem.oiid': v.oiid
                }, function(res) {

                    com.showAlert(com.info, '删除成功');
                    searcher.doSearch();
                });
            });
        },
        show: function(v) {

            return true;
        }
    }];

    searcher.line("no", lineprops, linebtns).render();

    // 创建外销项按钮点击事件
    com.focusPage('#oalesItemAddBtn', '#oalesItemPagenation').on('click', function() {

        // 清空表单
        com.focusPage('#oalesItemForm')[0].reset();
        com.clearValidator();

        // 显示弹窗
        com.focusPage('#oalesItemModal').modal('show');
    });

    // 保存按钮点击事件
    com.focusPage('#oalesItemSaveBtn').on('click', function() {

        // 表单验证
        if (com.validate('oalesItemModal')) {
            return false;
        }

        // 收集表单数据
        var formData = {
            'oalesItem.oales.oid': oalesitem.oid,
            'oalesItem.name': com.focusPage('#oalesItemName').val(),
            'oalesItem.format': com.focusPage('#oalesItemFormat').val(),
            'oalesItem.color': com.focusPage('#oalesItemColor').val(),
            'oalesItem.model': com.focusPage('#oalesItemModel').val(),
            'oalesItem.price': com.focusPage('#oalesItemPrice').val(),
            'oalesItem.num': com.focusPage('#oalesItemNum').val(),
            'oalesItem.comment': com.focusPage('#oalesItemComment').val()
        };

        com.showLoading('正在保存...');

        com.post(api.sales.addOalesItem, formData, function(res) {

            com.hideLoading();
            com.showAlert(com.info, '创建成功');

            // 关闭弹窗
            com.focusPage('#oalesItemModal').modal('hide');

            // 刷新列表
            searcher.doSearch();
        }, function(res) {

            com.hideLoading();
            com.showAlert(com.error, res.errorMsg || '创建失败');
        });
    });

    // 弹窗关闭时清空表单
    com.focusPage('#oalesItemModal').on('hide.bs.modal', function() {

        com.focusPage('#oalesItemForm')[0].reset();
        com.clearValidator();
    });

});
