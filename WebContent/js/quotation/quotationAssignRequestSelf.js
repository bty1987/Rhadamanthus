$(function() {

    // ==================== 初始化 Searcher ====================

    var searcher = new Searcher();

    // 基础配置：使用 Self 接口（后端自动注入当前用户userId）
    searcher.base("condList", "pagenation", "resultList",
        api.quotation.pageQuotationAssignRequestSelf
    );

    // 查询条件：只保留状态和装修单号（公司由后端自动注入）
    searcher.condition([
        "quotation-assign-request-status",
        "quotation-assign-request-orderId"
    ]);

    // 无顶部按钮（只读查看）
    searcher.button([]);

    // 列表行配置（简化版，只展示关键信息）
    var lineprops = [{
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue"
    }, {
        field: "company",
        name: "公司",
        prop: function(v) {
            return v.company ? v.company.name : "未知";
        },
        clazz: "grey"
    }, {
        field: "department",
        name: "部门",
        prop: function(v) {
            return v.department ? v.department.name : "所有部门";
        },
        clazz: "grey"
    }, {
        field: "decorationType",
        name: "装修类型",
        prop: function(v) {
            return v.decorationType == 1 ? "半包" : "整装";
        },
        clazz: "red"
    }, {
        field: "priority",
        name: "优先级",
        prop: function(v) {
            var priorityMap = { 1: "最高", 3: "高", 5: "普通", 7: "低", 9: "最低" };
            return priorityMap[v.priority] || "未知";
        },
        clazz: "red"
    }, {
        field: "status",
        name: "状态",
        prop: function(v) {
            var statusMap = { 1: "待分配", 2: "已分配", 3: "已完成" };
            return statusMap[v.status] || "未知";
        },
        clazz: "red"
    }, {
        field: "requestUser",
        name: "请求人",
        prop: function(v) {
            return v.requestUser ? v.requestUser.currentName : "未知";
        },
        clazz: "grey"
    }, {
        field: "assignTime",
        name: "分配时间",
        prop: function(v) {
            return v.assignTime || "-";
        },
        clazz: "green"
    }];

    // 无行按钮（只读查看）
    var linebtns = [];

    // 渲染列表
    searcher.line("orderId", lineprops, linebtns).render();
})
