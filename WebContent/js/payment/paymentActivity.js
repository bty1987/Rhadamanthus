$(function() {

    var paymentActivity = {
        types: constant.payment().receipt.paymentType.keys
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.payment.pagePaymentActivity);

    searcher.condition(["payment-orderId", "payment-paymentActivity-type", "payment-createTime"]);

    searcher.history("paymentActivityPostData");

    var lineprops = [{
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: paymentActivity.types
    }, {
        fieId: "activityName",
        name: "活动名称",
        prop: "activity.name",
        clazz: "grey"
    }, {
        fieId: "realMoney",
        name: "实付额",
        prop: "realMoney",
        clazz: "blue"
    }, {
        fieId: "multiple",
        name: "倍数",
        prop: "multiple",
        clazz: "blue"
    }, {
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    searcher.line("orderId", lineprops, []).render();

});
