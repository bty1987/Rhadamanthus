$(function() {

    var norm = {

        items: {},

        modals: {},

        btns: {},

        datasets: {

            decorationStatus: {},

        },
    }

    com.post(api.ds.decoration, {}, function(res) {

        norm.datasets.decorationStatus = res.decorationOrderStatus.split("key", "value");

    }, null, false);

    var cardbtns = [{
        name: "查看",
        clazz: "btn-success",
        handle: function(v) {

            params.quotation.orderId = v.decoration.orderId;
            params.quotation.quotation = v;

            params.historyPage = api.index.normIndex.url;

            com.switchPage(api.index.normPart.url);
        }
    }];

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.quotation.pageNormtion);
    searcher.condition(["quotation-norm-decoration-orderId", "quotation-norm-decoration-village", "quotation-norm-decoration-designer", "quotation-norm-decoration-salesman", "quotation-norm-decoration-status", "quotation-norm-createTime"]);

    var normprops = [{
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
        dataset: norm.datasets.decorationStatus,
        clazz: "red"
    }, {
        type: "newline"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "creater.currentName",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "moodTotal",
        name: "材料总额",
        prop: "moodTotal",
        clazz: "blue"
    }, {
        field: "moodPrintNum",
        name: "材料打印次数",
        prop: "moodPrintNum",
        clazz: "blue"
    }, {
        field: "mricePriceNum",
        name: "工费打印次数",
        prop: "mricePriceNum",
        clazz: "blue"
    }];

    searcher.line("decoration.orderId", normprops, cardbtns).render();

});