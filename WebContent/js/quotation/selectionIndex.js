$(function() {

    var selection = {

        items: {},

        modals: {},

        btns: {},

        datasets: {

            status: {},

            decorationStatus: {},

        },
    }

    var cardbtns = [{
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.orderId = v.decoration.orderId;
            params.quotation.quotation = v;

            params.historyPage = api.index.selectionIndex.url;

            com.switchPage(api.index.selectionPartIndex.url);
        }
    }];

    var searcher = new Searcher();

    com.focusPage("#selectionIndexPageContent").removeClass("page-content");

    searcher.base("condList", "pagenation", "resultList", api.quotation.pageSelection);
    searcher.condition(["quotation-selection-decoration-orderId", "quotation-selection-decoration-village", "quotation-selection-decoration-designer", "quotation-selection-decoration-salesman", "quotation-selection-decoration-status", "quotation-selection-status", "quotation-selection-createTime", "quotation-selection-affirmTime", "quotation-selection-isAffirm"]);
    searcher.history("selectionPostData");

    var selecprops = [{
        field: "decoration.orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue"
    }, {
        field: "name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "name",
        name: "客户名",
        prop: "decoration.customer.name",
        clazz: "grey"
    }, {
        field: "currentName",
        name: "设计师",
        prop: "decoration.designer.currentName",
        clazz: "grey"
    }, {
        field: "currentName",
        name: "业务员",
        prop: "decoration.salesman.currentName",
        clazz: "grey"
    }, {
        field: "buildArea",
        name: "面积",
        prop: "decoration.house.buildArea",
        clazz: "blue"
    }, {
        field: "decoration.status",
        name: "订单状态",
        prop: "decoration.status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red"
    }, {
        type: "newline"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "affirmTime",
        name: "确认时间",
        prop: "affirmTime",
        clazz: "green"
    }, {
        field: "creater.currentName",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "total",
        name: "总额",
        prop: "total",
        clazz: "blue"
    }, {
        field: "quotationTotal",
        name: "报价总额",
        prop: "quotationTotal",
        clazz: "blue"
    }, {
        field: "extensionAddTotal",
        name: "拓展增总额",
        prop: "extensionAddTotal",
        clazz: "blue"
    }, {
        field: "extensionReduceTotal",
        name: "拓展减总额",
        prop: "extensionReduceTotal",
        clazz: "blue"
    }, {
        field: "addReduceAddTotal",
        name: "增减增总额",
        prop: "addReduceAddTotal",
        clazz: "blue"
    }, {
        field: "addReduceMinusTotal",
        name: "增减减总额",
        prop: "addReduceMinusTotal",
        clazz: "blue"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: constant.quotation().selection.status.keys,
        clazz: "red"
    }, {
        field: "isAffirm",
        name: "客户确认",
        prop: "isAffirm",
        dataset: constant.quotation().selection.isAffirm.keys,
        clazz: "red"
    }];

    searcher.line("decoration.orderId", selecprops, cardbtns).render();

});