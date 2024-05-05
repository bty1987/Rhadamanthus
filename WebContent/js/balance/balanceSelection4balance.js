jQuery(function($) {

    var balanceSelection4balance = {

        bsid: null,
        btns: {},

        modals: {},

        items: {},

        status: {}
    };

    var seacher = new Searcher();

    seacher.base("bscondList1", "bspagenation1", "bsresultList1", api.balance.pageBalanceSelectionForBalance);

    seacher.condition(["balance-balanceSelection-balance-no", "balance-balanceSelection-balance-type", "balance-balanceSelection-balance-status", "balance-balanceSelection-brand", "balance-balanceSelection-balance-isPay"]);

    seacher.history("balanceSelectionPostData");

    var lineprops = [{
        fieId: "balance.belonger.userName",
        name: "归属人",
        prop: "balance.belonger.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.balance.belonger.userId);
        }
    }, {
        fieId: "balance.creater.userName",
        name: "创建人",
        prop: "balance.creater.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.balance.creater.userId);
        }
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
        fieId: "balance.isPay",
        name: "付款标识",
        prop: "balance.isPay",
        clazz: "red",
        dataset: constant.balance().balance.isPay.keys
    }, {
        type: "newline"
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
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "balancer",
        name: "结算人",
        prop: "balancer.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.balancer.userId);
        }
    }, {
        field: "balanceTime",
        name: "结算时间",
        prop: "balanceTime",
        clazz: "green"
    }, {
        field: "lockTime",
        name: "锁定时间",
        prop: "lockTime",
        clazz: "green"
    }];

    var linebtus = [{
        name: "付款",
        clazz: "btn-warning",
        handle: function(v) {

            com.post(api.balance.payedBalance, {
                "balance.bid": v.balance.bid
            }, function() {

                com.showAlert(com.info, "操作成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.balance.isPay == constant.balance().balance.ISPAY_NOTPAY_INT && v.balance.bid != 0);
        }
    }, {
        name: "结算选材",
        clazz: "btn-inverse",
        handle: function(v) {

            params.balance.bid = v.balance.bid;

            com.popup4page("#stockRecordPopUp", api.index.balanceSelectionIndex.url, "选材单");
        }
    }, {
        name: "结算扣款",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance = v.balance;
            params.balance.bid = v.balance.bid;
            params.balance.uid = v.balance.belonger.uid;
            com.popup4page("#stockRecordPopUp", api.index.balanceCutpayIndex.url, "结算扣款");
        },
        show: function(v) {

            return (v.balance.belonger.uid != null);
        }
    }];

    seacher.line("balance.no", lineprops, linebtus).render();

});
