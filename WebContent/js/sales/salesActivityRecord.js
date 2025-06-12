$(function() {

    var salesActivityRecord = {

        salesActivityItem: params.sales.salesActivityItem,

        items: {},

        modals: {},

        btns: {},
    };

    var searcher = new Searcher();

    searcher.set("salesRecordCondList", "salesRecordPagenation", "salesRecordResultList", api.sales.querySalesActivityRecord, {
        "salesActivityRecord.salesActivityItem.saiid": salesActivityRecord.salesActivityItem.saiid
    }, null, null, "salesActivityRecords", true);

    var props = [{
        field: "operate.currentName",
        name: "操作人",
        prop: "operate.userName",
        clazz: "grey"
    }, {
        field: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        dataset: constant.sales().salesActivityItem.state.keys,
        clazz: "red"
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    var btns = [];

    searcher.line("operate.currentName", props, btns).render();
});