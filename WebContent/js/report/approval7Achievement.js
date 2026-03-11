$(function() {

    var approval7Achievement = {

        type: constant.approval().approval.type.datas,
    };

    var searcher = new Searcher();

    searcher.base("condList", "approval7Achievement", "resultList", api.report.queryApproval7Achievement);

    searcher.condition(["report-approval-year", "report-approval-month", "report-approval-type"]);

    searcher.history("approval7AchievementPostData");

    var lineprops = [{
        field: "index",
        name: "",
        prop: "",
        type: "numbers",
        fixed: "left"
    },{
        field: "date",
        name: "日期",
        prop: function(v) {

            return (v.year + "年" + v.month + "月业绩");
        },
        clazz: "grey"
    },{
        field: "type",
        name: "状态",
        prop: "type",
        clazz: "red",
        dataset: approval7Achievement.type
    },{
        field: "cs0",
        name: "总数",
        prop: "cs0",
        clazz: "grey"
    }, {
        field: "cs1",
        name: "创建数量",
        prop: "cs1",
        clazz: "grey"
    }, {
        field: "cs2",
        name: "未处理数量",
        prop: "cs2",
        clazz: "grey"
    }, {
        field: "cs3",
        name: "通过数量",
        prop: "cs3",
        clazz: "grey"
    }, {
        field: "cs4",
        name: "驳回数量",
        prop: "cs4",
        clazz: "grey"
    }, ];

    var linebtns = [];

    searcher.table(lineprops, linebtns);

    searcher.render();

    com.datetime(com.focusPage("[name='report-approval-year']"), "year");
    com.datetime(com.focusPage("[name='report-approval-month']"), "month");

});
