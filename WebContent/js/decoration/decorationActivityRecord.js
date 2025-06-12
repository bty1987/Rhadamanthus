$(function() {

    var decorationActivityRecord = {

        decorationActivityItem: params.decoration.decorationActivityItem,

        items: {},

        modals: {},

        btns: {},
    };

    var searcher = new Searcher();

    searcher.set("activityRecordCondList", "activityRecordPagenation", "activityRecordResultList", api.decoration.queryDecorationActivityRecord, {
        "decorationActivityRecord.decorationActivityItem.daiId": decorationActivityRecord.decorationActivityItem.daiId
    }, null, null, "decorationActivityRecords", true);

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
        dataset: constant.decoration().decorationActivityItem.status.keys,
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