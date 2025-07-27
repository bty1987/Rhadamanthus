jQuery(function($) {

    var searcher = new Searcher();

    searcher.base("recordCondLists", "recordPagenations", "recordResultLists", api.construction.queryConstructionRecordByOrderId);
    searcher.isPage(true).result("constructionRecords");
    searcher.param({
        "constructionRecord.orderId": params.orderId
    });

    var lineprops = [{
        fieId: "orderId",
        name: "装修单",
        prop: "orderId",
        clazz: "grey"
    }, {
        fieId: "operater.currentName",
        name: "操作人",
        prop: "operater.currentName",
        clazz: "grey"
    }, {
        fieId: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "grey"
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }, ];

    var linebtns = [];

    searcher.line("operater.currentName", lineprops, linebtns).render();

});
