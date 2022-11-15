jQuery(function($) {

    var balanceSales = {

        bsid: null,
        btns: {
            createBalanceSalesBtn: com.focusPage("#createBalanceSalesBtn").on("click", saveData),
            withdrawBtn: com.focusPage("#withdrawBtn").on("click", saveDate),
        },

        modals: {
            createBalanceSalesModal: com.focusPage("#createBalanceSalesModal"),
            renewal: com.focusPage("#renewal"),

        },

        items: {
            name: com.focusPage("#BalanceSalesName"),
            brand: com.focusPage("#brand"),
            updateName: com.focusPage("#updata"),
        },

        status: {},
    };

    com.initTypeahead("brand", api.data.queryBrandByPinyin, "pinyinName", {}, "brands", "bid", "name", null);

    var seacher = new Searcher();

    seacher.base("bscondList", "bspagenation", "bsresultList", api.balance.pageBalanceSales);

    seacher.condition(["balance-balanceSelse-name", "balance-balanceSelse-status", "balance-balanceSelse-brand", "balance-balanceSelse-grade", "balance-balanceSelse-createTime", "balance-balanceSelse-creater"]);

    seacher.button([{
        id: "createBalanceSales",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    seacher.history("balanceSalesPostData");

    var lineprops = [{
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
    }, ];

    var linebtus = [{
        name: "明细",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance.bsid = v.bsid;

            com.popup4page("#stockRecordPopUp", api.index.balanceSalesBalanceIndex.url, "销售单");

            return false;
        }
    }, {
        name: "更新",
        clazz: "btn-info",
        handle: function(v) {

            balanceSales.bsid = v.bsid;
            balanceSales.items.name.val(v.name);
            balanceSales.modals.renewal.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "结算",
        clazz: "btn-danger",
        handle: function(v) {

            var options = {
                "balanceSales.bsid": v.bsid,
                "balanceSales.payment": v.grade == "A" ? v.income : v.payment
            };

            com.post(api.balance.balanceBalanceSales, options, function() {

                com.showAlert(com.info, "结算成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_UNLOCK_INT);
        }
    }, {
        name: "锁定",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.balance.lockBalanceSales, {
                "balanceSales.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "锁定成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "解锁",
        clazz: "btn-inverse",
        handle: function(v) {

            com.post(api.balance.unlockBalanceSales, {
                "balanceSales.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "解锁成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_UNLOCK_INT);
        }
    }, {
        name: "明细打印",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance.bsid = v.bsid;
            params.balance.type = 1;

            com.popup("明细表", api.index.balanceSales2print.url, null, null, true);

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "利润打印",
        clazz: "btn-success",
        handle: function(v) {

            params.balance.bsid = v.bsid;
            params.balance.type = 2;

            com.popup("利润表", api.index.balanceSales2print.url, null, null, true);

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, ];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#createBalanceSales').on("click", function() {

        balanceSales.modals.createBalanceSalesModal.modal("show");
    });

    function saveData() {

        if (com.validate('createBalanceSalesModal'))
            return false;

        var options = {
            "balanceSales.name": balanceSales.items.name.val(),
            "balanceSales.brand.bid": com.typeahead("brand"),
            "balanceSales.grade": $('input[name="grade"]:checked').val(),
        };

        com.post(api.balance.createBalanceSales, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceSales.modals.createBalanceSalesModal.modal("hide");
    }

    function saveDate() {

        if (com.validate('renewal'))
            return false;

        var options = {
            "balanceSales.bsid": balanceSales.bsid,
            "balanceSales.name": balanceSales.items.updateName.val(),
        };

        com.post(api.balance.updateBalanceSales, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceSales.modals.renewal.modal("hide");
    }

});
