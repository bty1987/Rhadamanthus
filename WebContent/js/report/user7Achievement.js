$(function() {

    var searcher = new Searcher();

    searcher.base("condList", "user7Achievement", "resultList", api.report.queryUser7Achievement);

    searcher.condition(["report-user-year", "report-user-month"]);

    searcher.history("user7AchievementPostData");

    var lineprops = [{
        field: "index",
        name: "",
        prop: "",
        type: "numbers",
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
        name: "总数",
        prop: "cs0",
        clazz: "grey"
    }, {
        field: "cs1",
        name: "在职总数",
        prop: "cs1",
        clazz: "grey"
    }, {
        field: "cs2",
        name: "离职总数",
        prop: "cs2",
        clazz: "grey"
    }, {
        field: "cs3",
        name: "入职人数",
        prop: "cs3",
        clazz: "grey"
    }, {
        field: "cs4",
        name: "离职人数",
        prop: "cs4",
        clazz: "grey"
    }, {
        field: "cs5",
        name: "调职人数",
        prop: "cs5",
        clazz: "grey"
    }, ];

    var linebtns = [];

    searcher.table(lineprops, linebtns);

    searcher.render();

    com.datetime(com.focusPage("[name='report-user-year']"), "year");
    com.datetime(com.focusPage("[name='report-user-month']"), "month");

});
