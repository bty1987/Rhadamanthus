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

    decorationActivityRecord.addActivityRecordModal = com.focusPage("#addActivityRecordModal");

    // 手动创建流水记录(类型可选, 仅作记录不改变物品状态)
    com.focusPage("#addActivityRecordBtn").on("click", function() {

        // bindData重拉选项即自动重置选中(recordType为普通select, 非typeahead组件)
        com.focusPage("#recordType").bindData(constant.decoration().decorationActivityItem.status.keys, "key", "value");
        com.focusPage("#recordComment").val("");

        decorationActivityRecord.addActivityRecordModal.modal("show");
    });

    com.focusPage("#submitActivityRecordBtn").on("click", function() {

        if (com.validate("addActivityRecordModal")) {
            return;
        }

        com.post(api.decoration.addDecorationActivityRecord, {
            "decorationActivityRecord.daid": decorationActivityRecord.decorationActivityItem.aid,
            "decorationActivityRecord.decorationActivityItem.daiId": decorationActivityRecord.decorationActivityItem.daiId,
            "decorationActivityRecord.type": com.focusPage("#recordType").val(),
            "decorationActivityRecord.comment": com.focusPage("#recordComment").val()
        }, function(res) {

            com.showAlert(com.info, "创建成功");
            decorationActivityRecord.addActivityRecordModal.modal("hide");
            searcher.doSearch();
        });
    });
});