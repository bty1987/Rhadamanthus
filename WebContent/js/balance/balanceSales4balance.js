jQuery(function($) {

    var balanceSales4balance = {

        bsid: null,
        btns: {},

        modals: {},

        items: {},

        status: {},
    };

    var seacher = new Searcher();

    seacher.base("bscondList1", "bspagenation1", "bsresultList1", api.balance.pageBalanceSalesForBalance);

    seacher.condition(["balance-balanceSelse-balance-no", "balance-balanceSelse-balance-type", "balance-balanceSelse-balance-status", "balance-balanceSelse-brand"]);

    seacher.history("balanceSalesPostData");

    var lineprops = [{
        fieId: "balance.belonger.userName",
        name: "归属人",
        prop: "balance.belonger.userName",
        clazz: "grey"
    }, {
        fieId: "balance.creater.userName",
        name: "创建人",
        prop: "balance.creater.userName",
        clazz: "grey"
    }, {
        fieId: "balance.createTime",
        name: "创建时间",
        prop: "balance.createTime",
        clazz: "green",
    }, {
        fieId: "balance.amount",
        name: "金额",
        prop: "balance.amount",
        clazz: "blue"
    }, {
        fieId: "balance.cutpay",
        name: "扣款总额",
        prop: "balance.cutpay",
        clazz: "blue"
    }, {
        fieId: "balance.type",
        name: "类型",
        prop: "balance.type",
        clazz: "red",
        dataset: constant.balance().balance.type.keys
    }, {
        fieId: "balance.status",
        name: "状态",
        prop: "balance.status",
        clazz: "red",
        dataset: constant.balance().balance.status.keys
    }, {
        type: "newline"
    }, {
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "brand.name",
        name: "品牌名",
        prop: "brand.name",
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.balance().balanceSales.status.keys
    }, {
        fieId: "grade",
        name: "等级",
        prop: "grade",
        clazz: "red"
    }, {
        fieId: "income",
        name: "收入",
        prop: "income",
        clazz: "blue"
    }, {
        fieId: "cost",
        name: "成本",
        prop: "cost",
        clazz: "blue"
    }, {
        fieId: "payment",
        name: "应付",
        prop: "payment",
        clazz: "blue"
    }, {
        fieId: "profit",
        name: "利润",
        prop: "profit",
        clazz: "blue"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.userName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "balancer",
        name: "结算人",
        prop: "balancer.userName",
        clazz: "grey"
    }, {
        field: "balanceTime",
        name: "结算时间",
        prop: "balanceTime",
        clazz: "green"
    }];

    var linebtus = [{
        name: "结算销售",
        clazz: "btn-inverse",
        handle: function(v) {

            params.balance.bid = v.balance.bid;

            com.popup4page("#stockRecordPopUp", api.index.balanceSalesIndex.url, "销售单");
        }
    }, {
        name: "结算扣款",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance = v.balance;
            params.balance.bid = v.balance.bid;
            params.balance.uid = v.balance.belonger.uid;
            com.popup4page("#stockRecordPopUp", api.index.balanceCutpayIndex.url, "结算扣款");
        }
    },];

    seacher.line("balance.no", lineprops, linebtus).render();

});
