$(function() {

    // ==================== 页面元素声明 ====================

    var searcher = new Searcher();

    searcher.base("condListQuotationAssignUserRuleItem", "pagenationQuotationAssignUserRuleItem", "resultListQuotationAssignUserRuleItem", api.quotation.queryQuotationAssignUserRuleItem);

    searcher.param({
        "quotationAssignUserRuleItem.qaurid": params.quotationAssignUserRule.qaurid
    });

    searcher.result("quotationAssignUserRuleItems").isPage(false);

    searcher.button([]);

    searcher.history("quotationAssignUserRuleItemPostData");

    // ==================== 列表行配置 ====================

    var lineprops = [{
        field: "company.name",
        name: "公司",
        prop: "company.name",
        clazz: "grey"
    }, {
        field: "department.name",
        name: "部门",
        prop: "department.name",
        clazz: "grey"
    }, {
        field: "supportedType",
        name: "支持类型",
        prop: "supportedType",
        clazz: "red",
        dataset: {
            "-1": "通用",
            "0": "半包",
            "1": "整装"
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "updateTime",
        name: "更新时间",
        prop: "updateTime",
        clazz: "green"
    }];

    var linebtns = [];

    searcher.line("department.name", lineprops, linebtns).render();

    com.focusPage("#resultListQuotationAssignUserRuleItem").find("div.action-buttons").find("a.btn-yellow").hide();

});
