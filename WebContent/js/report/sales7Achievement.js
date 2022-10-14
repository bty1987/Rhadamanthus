$(function() {

    var searcher = new Searcher();

    searcher.base("condList", "sales7Achievement", "resultList", api.report.querySales7Achievement);

    searcher.condition(["report-sales-year", "report-sales-month"]);

    searcher.history("sales7AchievementPostData");

    var lineprops = [{
        field: "index",
        name: "",
        prop: "",
        type: "numbers",
        fixed: "left"
    }, {
        field: "department.no",
        name: "分区编号",
        prop: "department.no",
        clazz: "grey",
        fixed: "left"
    }, {
        field: "department.name",
        name: "分区",
        prop: "department.name",
        clazz: "grey",
        fixed: "left"
    }, {
        field: "date",
        name: "日期",
        prop: function(v) {

            return (v.year + "年" + v.month + "月业绩");
        },
        clazz: "grey"
    }, {
        field: "cs0",
        name: "销售单数",
        prop: "cs0",
        clazz: "grey"
    }, {
        field: "cs1",
        name: "定金总额",
        prop: "cs1",
        clazz: "grey"
    }, {
        field: "cs2",
        name: "补款总额",
        prop: "cs2",
        clazz: "grey"
    }, {
        field: "cs3",
        name: "补款单数",
        prop: "cs3",
        clazz: "grey"
    }, {
        field: "cs4",
        name: "退货单数",
        prop: "cs4",
        clazz: "grey"
    }, {
        field: "cs5",
        name: "退货总额",
        prop: "cs5",
        clazz: "grey"
    }, {
        field: "cs6",
        name: "结算单数",
        prop: "cs6",
        clazz: "grey"
    }, {
        field: "cs7",
        name: "结算总额",
        prop: "cs7",
        clazz: "grey"
    }, ];

    var linebtns = [];

    searcher.table(lineprops, linebtns);

    searcher.render();

    com.datetime(com.focusPage("[name='report-sales-year']"), "year");
    com.datetime(com.focusPage("[name='report-sales-month']"), "month");

});
