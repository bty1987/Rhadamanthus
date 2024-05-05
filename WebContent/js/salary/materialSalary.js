jQuery(function($) {

    var materialSalary = {

        pageType: params.urlLoadParams.pagetype
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.salary.pageMaterialSalary);

    searcher.condition(["salary-materialSalary-orderId", "salary-materialSalary-sales-no", "salary-materialSalary-belonger", "salary-materialSalary-stage", "salary-materialSalary-createTime"]);

    searcher.history("materialSalary" + params.urlLoadParams.pagetype + "PostData");

    if (materialSalary.pageType == "belong") {
        searcher.param({
            "materialSalary.belonger.userId": params.userInfo.user.userId,
        });
    }

    var lineprops = [{
        field: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue"
    }, {
        field: "sales.no",
        name: "销售单号",
        prop: "sales.no",
        clazz: "blue"
    }, {
        field: "village.name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "house.houseNumber",
        name: "楼盘",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "category",
        name: "品类",
        prop: "sales.category",
        clazz: "grey"
    }, {
        field: "brand",
        name: "品牌",
        prop: "sales.brand",
        clazz: "grey"
    }, {
        type: "newline"
    }, {
        field: "belonger",
        name: "归属人",
        prop: "belonger.currentName",
        clazz: "grey"
    }, {
        field: "period",
        name: "账期",
        prop: "period",
        clazz: "grey"
    }, {
        field: "money",
        name: "金额 ",
        prop: "money",
        clazz: "blue"
    }, {
        field: "rate",
        name: "比例 ",
        prop: "rate",
        clazz: "blue"
    }, {
        field: "stage",
        name: "阶段",
        prop: "stage",
        clazz: "red",
        dataset: constant.salary().materialSalary.stage.keys,
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }, ];

    var linebtns = [];

    searcher.line(function(v) {

        return constant.salary().materialSalary.stage.keys[v.stage] + " " + v.money;
    }, lineprops, linebtns);

    searcher.render();

});
