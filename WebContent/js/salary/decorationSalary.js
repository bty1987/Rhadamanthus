$(function() {

    var decorationSalary = {
        pageType: params.urlLoadParams.pagetype,
        type: constant.salary().decorationSalary.type.keys,
        atttype: constant.salary().decorationSalary.atttype.keys,
        stage: constant.salary().decorationSalary.stage.keys,
        status: constant.salary().decorationSalary.status.keys
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.salary.pageDecorationSalary);
    searcher.condition(["salary-decoraitonSalary-orderId", "salary-decoraitonSalary-belonger", "salary-decoraitonSalary-type", "salary-decoraitonSalary-atttype", "salary-decoraitonSalary-stage", "salary-decoraitonSalary-createTime", ]);
    searcher.history("decorationSalary" + params.urlLoadParams.pagetype + "PostData");

    if (decorationSalary.pageType == "belong") {
        searcher.param({
            "decorationSalary.belonger.userId": params.userInfo.user.userId,
        });
    }

    var lineprops = [{
        field: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue",
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
        field: "typeness",
        name: "类型",
        prop: "decoration.typeness",
        dataset: constant.decoration().decoration.typeness.keys,
        clazz: "red"
    }, {
        field: "status",
        name: "状态",
        prop: "decoration.status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red"
    }, {
        field: "contractPrice",
        name: "签单额",
        prop: "decoration.orderTotalPrice",
        clazz: "blue"
    }, {
        field: "factPrice",
        name: "实收额",
        prop: "decoration.factPrice",
        clazz: "blue"
    }, {
        field: "couponCut",
        name: "券优惠",
        prop: "decoration.couponCut",
        clazz: "blue"
    }, {
        field: "thingCut",
        name: "物品优惠",
        prop: "decoration.thingCut",
        clazz: "blue"
    }, {
        type: "newline"
    }, {
        field: "belonger",
        name: "归属人",
        prop: "belonger.userName",
        clazz: "grey",
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green",
    }, {
        field: "period",
        name: "账期",
        prop: "period",
        clazz: "blue"
    }, {
        field: "money",
        name: "金额",
        prop: "money",
        clazz: "blue",
    }, {
        field: "rate",
        name: "比例",
        prop: "rate",
        clazz: "blue",
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        dataset: decorationSalary.type,
        clazz: "red",
    }, {
        field: "atttype",
        name: "业务类型",
        prop: "atttype",
        dataset: decorationSalary.atttype,
        clazz: "red",
    }, {
        field: "stage",
        name: "阶段",
        prop: "stage",
        dataset: decorationSalary.stage,
        clazz: "red"
    }, {
        field: "level",
        name: "等级",
        prop: "level",
        clazz: "red",
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: decorationSalary.status,
        clazz: "red",
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey",
    }];

    searcher.line(function(v) {

        return decorationSalary.atttype[v.atttype] + " " + decorationSalary.stage[v.stage] + " " + v.money;
    }, lineprops, []).render();

});