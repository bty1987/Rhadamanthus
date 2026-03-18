jQuery(function($) {

    var oalesrecord = {

        oid: params.sales.oales.oid  // 外销单ID
    };

    // 如果没有外销单ID，提示错误
    if (!oalesrecord.oid) {
        com.showAlert(com.error, '缺少外销单ID参数');
        return;
    }

    var url = api.sales.pageOalesRecord;
    var conditions = [];
    var options = {
        "oid": oalesrecord.oid
    };

    var searcher = new Searcher();

    searcher.base("oalesRecordCondList", "oalesRecordPagenation", "oalesRecordResultList", url);
    searcher.condition(conditions);
    searcher.param(options);

    var lineprops = [{
        field: "orid",
        type: "checkbox",
        name: "oalesRecordId",
        prop: "orid"
    }, {
        field: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "grey"
    }, {
        field: "type",
        name: "操作类型",
        prop: "type",
        clazz: "blue",
        format: function(v) {
            return constant.sales().oalesRecord.type.keys[v.type] || "未知";
        }
    }, {
        field: "comment",
        name: "操作说明",
        prop: "comment",
        clazz: "grey"
    }, {
        field: "operate",
        name: "操作人",
        prop: "operate.currentName",
        clazz: "grey"
    }, {
        field: "beforeStatus",
        name: "操作前状态",
        prop: "beforeStatus",
        clazz: "red",
        show: function(v) {
            return v.beforeStatus != null && v.beforeStatus !== undefined;
        }
    }, {
        field: "afterStatus",
        name: "操作后状态",
        prop: "afterStatus",
        clazz: "green",
        show: function(v) {
            return v.afterStatus != null && v.afterStatus !== undefined;
        }
    }];

    var linebtns = [];

    searcher.line("no", lineprops, linebtns).render();

});
