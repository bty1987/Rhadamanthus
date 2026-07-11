jQuery(function($) {

    var chart = {

        items: {},

        modals: {},

        btns: {},

        dataset: {},

    }

    chart.dataset.type = constant.data().chart.type.keys;
    chart.dataset.level = constant.data().chart.level.keys;

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageChart);

    searcher.condition(["data-chart-no", "data-chart-name", "data-chart-type", "data-chart-level"]);

    searcher.history("brandPostData");

    var lineprops = [{
        fieId: "no",
        name: "编号",
        prop: "no",
        clazz: "grey"
    }, {
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "api",
        name: "接口",
        prop: "api",
        clazz: "grey"
    }, {
        fieId: "method",
        name: "方法",
        prop: "method",
        clazz: "grey"
    }, {
        fieId: "param",
        name: "参数",
        prop: "param",
        clazz: "grey"
    }, {
        fieId: "style",
        name: "样式",
        prop: "style",
        clazz: "grey"
    }, {
        fieId: "clazz",
        name: "类型",
        prop: "clazz",
        clazz: "red"
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: chart.dataset.type
    }, {
        fieId: "sort",
        name: "排序",
        prop: "sort",
        clazz: "blue"
    }, {
        fieId: "level",
        name: "等级",
        prop: "level",
        clazz: "grey",
        dataset: chart.dataset.level
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [];

    searcher.line("name", lineprops, linebtns).render();

});
