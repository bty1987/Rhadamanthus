jQuery(function($) {

    var balanceOales4balance = {

        boid: null,
        btns: {},

        modals: {},

        items: {},

        status: {}
    };

    var seacher = new Searcher();

    seacher.base("bocondList1", "bopagenation1", "boresultList1", api.balance.pageBalanceOalesForBalance);

    seacher.condition(["balance-oales-balance-no", "balance-oales-balance-type", "balance-oales-balance-status", "balance-selection-balance-isPay"]);

    seacher.history("balanceOales4balancePostData");

    seacher.button([{
        id: "checkAll",
        name: "全选",
        clazz: "btn-pink",
        icon: "icon-plus"
    }, {
        id: "payedBalance",
        name: "付款",
        clazz: "btn-yellow",
        icon: "icon-check"
    }]);

    var lineprops = [{
        field: "balance.bid",
        type: "checkbox",
        name: "balanceId",
        prop: "balance.bid",
        show: function(v) {

            return (v.balance.isPay == constant.balance().balance.ISPAY_NOTPAY_INT && v.balance.bid != 0);
        }
    }, {
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
        fieId: "profit",
        name: "利润",
        prop: "profit",
        clazz: "blue",
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
                "balances[0].bid": v.balance.bid
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
        name: "结算外销",
        clazz: "btn-inverse",
        handle: function(v) {

            params.balance.bid = v.balance.bid;

            com.popup4page("#stockRecordPopUp", api.index.balanceOalesIndex.url, "外销单");
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

    com.focusPage('#payedBalance').on("click", function() {

        var $inputs = com.focusPage('input[type="checkbox"]:checked');

        if (!$inputs.length) {
            com.showAlert(com.warning, "请选择需要进行付款的结算单");
            return false;
        }

        var option = {};

        $.each($inputs, function(i, v) {

            var $input = $(v);

            if ($input.attr('balance.bid') != 0) {

                option["balances[" + i + "].bid"] = $input.attr('balance.bid');
            }

        });

        com.post(api.balance.payedBalance, option, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });
    });

    com.focusPage('#checkAll').on("click", function() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    });

});
