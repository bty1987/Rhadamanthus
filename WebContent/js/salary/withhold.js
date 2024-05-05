jQuery(function($) {

    var withhold = {

        pageType: params.urlLoadParams.pagetype
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.salary.pageWithhold);

    searcher.condition(["salary-user", "salary-orderId", "salary-withhold-type", "salary-withhold-status", "salary-createTime", "salary-operateTime"]);

    if (withhold.pageType == "belong") {
        searcher.param({
            "withhold.user.userId": params.userInfo.user.userId,
        });
    }

    var lineprops = [{
        field: "user",
        name: "姓名",
        prop: "user.currentName",
        clazz: "grey",
        show: function(v) {

            return withhold.pageType != "belong";
        }
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.salary().withhold.type.keys,
    }, {
        field: "money",
        name: "操作金额",
        prop: "money",
        clazz: "blue"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "operater",
        name: "操作人",
        prop: "operater.currentName",
        clazz: "grey",
        show: function(v) {

            return withhold.pageType != "belong";
        }
    }, {
        field: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green",
        show: function(v) {

            return withhold.pageType != "belong";
        }
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.salary().withhold.status.keys,
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }, ];

    var linebtns = [];

    searcher.line(function(v) {

        return (v.comment == null ? "" : v.comment) + " " + v.money;
    }, lineprops, linebtns);

    searcher.render();
})