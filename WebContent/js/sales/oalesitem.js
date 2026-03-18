jQuery(function($) {

    var oalesitem = {

        // 页面参数
        oid: null  // 外销单ID
    };

    // 从URL参数获取外销单ID
    var urlParams = com.getUrlParams();
    if (urlParams.oid) {
        oalesitem.oid = urlParams.oid;
    } else if (params.urlLoadParams && params.urlLoadParams.oid) {
        oalesitem.oid = params.urlLoadParams.oid;
    }

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

    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(conditions);
    searcher.param(options);

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

});
