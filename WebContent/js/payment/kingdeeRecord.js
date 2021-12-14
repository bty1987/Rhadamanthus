jQuery(function ($) {

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.payment.pageKingdeeRecord);

    searcher.condition(["payment-kingdee-orderId", "payment-createTime"]);

    searcher.history("kingdeeRecordPostData");

    var lineprops = [
        {fieId:"rtid",name: "收据ID", prop: "rtid", clazz:"green"},
        {fieId: "type", name: "款项类型", prop: "type", clazz: "red"},
        {fieId: "createTime", name: "创建时间", prop: "createTime", clazz: "green"},
        {fieId: "message", name: "错误信息", prop: "message", clazz: "grey"}
    ];

    searcher.line("orderId", lineprops, []).render();

});
