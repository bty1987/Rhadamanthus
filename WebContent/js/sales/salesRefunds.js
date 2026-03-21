jQuery(function($) {

    var refunds = {
        rid: null,
        sid: null,
    };

    var conditions = ['sales-no', 'sales-category-name', 'sales-brand', 'sales-status', 'sales-isAffirm', 'sales-affirmTime', 'sales-refunds-status', 'sales-refunds-ifAffirm', 'sales-refunds-affirmTime'];

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.sales.pageSalesRefunds);
    searcher.condition(conditions);
    searcher.history("refundsPostData");

    var lineprops = [{
        field: "category",
        name: "商品品类",
        prop: "sales.category",
        clazz: "grey"
    }, {
        field: "brand",
        name: "商品品牌",
        prop: "sales.brand.name",
        clazz: "grey"
    }, {
        field: "total",
        name: "退款总额",
        prop: "total",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.sales().refunds.type.keys,
    }, {
        field: "sales.isAffirm",
        name: "购货确认",
        prop: "sales.isAffirm",
        clazz: "red",
        dataset: constant.sales().sales.isAffirm.keys,
    }, {
        field: "sales.affirmTime",
        name: "购货确认时间",
        prop: "sales.affirmTime",
        clazz: "green"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.sales().refunds.status.keys,
    }, {
        field: "isAffirm",
        name: "退货确认",
        prop: "isAffirm",
        clazz: "red",
        dataset: constant.sales().sales.isAffirm.keys,
    }, {
        field: "affirmTime",
        name: "退货确认时间",
        prop: "affirmTime",
        clazz: "green"
    }, {
        fieId: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey",
    }];

    var linebtns = [{
        name: "打印",
        clazz: "btn-pink",
        handle: function(v) {

            refundsPrint(v);
        },
    }, {
        name: "退货",
        clazz: "btn-danger",
        handle: function(v) {

            salesRefunds(v);
        },
    }, {
        name: "推送",
        clazz: "btn-danger",
        handle: function(v) {

            sendSalesRefund(v);
        }
    }, {
        name: "确认",
        clazz: "btn-danger",
        handle: function(v) {

            affirmSalesRefund(v);

        }
    }];

    searcher.line("sales.no", lineprops, linebtns).render();

    function refundsPrint(v) {

        params.sales.sales = v.sales
        params.sales.refunds = v;
        params.sales.flag = "refund";

        com.popup("销售退货单:" + v.sales.orderId, api.index.salesRefundsPrintIndex.url, function() {

            parent.layer.getFrameIndex(window.name);
        }, null, true);
    }

    function salesRefunds(v) {

        params.sales.sales = v.sales;
        params.rid = v.rid;
        params.flag = "refunds"
        com.popup4page("#layerPopUp", "views/sales/salesRefundsItem.html", "退货");
    }

    function sendSalesRefund(v) {

        var options = {
            "refunds.rid": v.rid,
        };

        com.post(api.sales.sendSalesRefunds, options, function() {

            com.showAlert(com.info, "推送成功");
        });
    }

    function affirmSalesRefund(v) {

        var options = {
            "refunds.rid": v.rid,
            "refunds.sales.customer.cid": v.sales.customer.cid,
        };

        com.post(api.sales.affirmSalesRefunds, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

});
