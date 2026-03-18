jQuery(function($) {

    var oalesrecord = {

        // 页面参数
        oid: null  // 外销单ID
    };

    // 从URL参数获取外销单ID
    var urlParams = com.getUrlParams();
    if (urlParams.oid) {
        oalesrecord.oid = urlParams.oid;
    } else if (params.urlLoadParams && params.urlLoadParams.oid) {
        oalesrecord.oid = params.urlLoadParams.oid;
    }

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

    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(conditions);
    searcher.param(options);

    // 操作类型映射
    var typeMap = {
        1: "新增",
        2: "更新",
        3: "提交",
        4: "取消",
        5: "确认",
        6: "驳回",
        7: "复核",
        8: "完结",
        9: "废单",
        10: "退款",
        11: "删除",
        12: "活动",
        13: "添加支付",
        14: "更新支付",
        15: "删除支付"
    };

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
            return typeMap[v] || "未知";
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
