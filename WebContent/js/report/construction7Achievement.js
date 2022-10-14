$(function() {

    var searcher = new Searcher();

    searcher.base("condList", "construction7Achievement", "resultList", api.report.queryConstruction7Achievement);

    searcher.condition(["report-construction-year", "report-construction-month"]);

    searcher.history("construction7AchievementPostData");

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
        name: "未开工数",
        prop: "cs0",
        clazz: "grey"
    }, {
        field: "cs1",
        name: "开工数",
        prop: "cs1",
        clazz: "grey"
    }, {
        field: "cs2",
        name: "完工数",
        prop: "cs2",
        clazz: "grey"
    }, {
        field: "cs3",
        name: "砌墙",
        prop: "cs3",
        clazz: "grey"
    }, {
        field: "cs4",
        name: "铲大白",
        prop: "cs4",
        clazz: "grey"
    }, {
        field: "cs5",
        name: "放线",
        prop: "cs5",
        clazz: "grey"
    }, {
        field: "cs6",
        name: "水暖",
        prop: "cs6",
        clazz: "grey"
    }, {
        field: "cs7",
        name: "力工",
        prop: "cs7",
        clazz: "grey"
    }, {
        field: "cs8",
        name: "电工",
        prop: "cs8",
        clazz: "grey"
    }, {
        field: "cs9",
        name: "瓦工",
        prop: "cs9",
        clazz: "grey"
    }, {
        field: "cs10",
        name: "地面找平",
        prop: "cs10",
        clazz: "grey"
    }, {
        field: "cs11",
        name: "木工",
        prop: "cs11",
        clazz: "grey"
    }, {
        field: "cs12",
        name: "油工",
        prop: "cs12",
        clazz: "grey"
    }, {
        field: "cs13",
        name: "水电验收",
        prop: "cs13",
        clazz: "grey"
    }, {
        field: "cs14",
        name: "保洁",
        prop: "cs14",
        clazz: "grey"
    }, ];

    var linebtns = [];

    searcher.table(lineprops, linebtns);

    searcher.render();

    com.datetime(com.focusPage("[name='report-construction-year']"), "year");
    com.datetime(com.focusPage("[name='report-construction-month']"), "month");

});
