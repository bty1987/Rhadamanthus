$(function() {

    var statement = {
        type: constant.payment().statement.type.keys,
        status: constant.payment().statement.status.keys
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.payment.pageStatement);

    searcher.condition(["payment-statement-custNo", "payment-statement-payTime", "payment-statement-type", "payment-statement-status"]);

    searcher.history("statementPostData");

    var lineprops = [{
        fieId: "orderNo",
        name: "订单号",
        prop: "orderNo",
        clazz: "blue"
    }, {
        fieId: "price",
        name: "金额",
        prop: "price",
        clazz: "blue"
    }, {
        fieId: "fee",
        name: "手续费",
        prop: "fee",
        clazz: "blue"
    }, {
        fieId: "rate",
        name: "费率",
        prop: "rate",
        clazz: "blue"
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "payTime",
        name: "付款时间",
        prop: "payTime",
        clazz: "green"
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: statement.type
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: statement.status
    }];

    searcher.line("custNo", lineprops, []).render();

});
