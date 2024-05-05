jQuery(function($) {

    var balanceSelection = {

        bsid: null,
        btns: {
            createBalanceSelectionBtn: com.focusPage("#createBalanceSelectionBtn").on("click", saveData),
            withdrawBtn: com.focusPage("#withdrawBtn").on("click", saveDate)
        },

        modals: {
            createBalanceSelectionModal: com.focusPage("#createBalanceSelectionModal"),
            renewal: com.focusPage("#renewal")
        },

        items: {
            name: com.focusPage("#balanceSelectionName"),
            brand: com.focusPage("#brand"),
            updateName: com.focusPage("#updata")
        },

        status: {}
    };

    com.initTypeahead("brand", api.data.queryBrandByPinyin, "brand.pinyin", {}, "brands", "bid", "name", null);

    var seacher = new Searcher();

    seacher.base("bscondList", "bspagenation", "bsresultList", api.balance.pageBalanceSelection);

    seacher.condition(["balance-balanceSelse-name", "balance-balanceSelse-status", "balance-balanceSelse-brand", "balance-balanceSelse-grade", "balance-balanceSelse-createTime", "balance-balanceSelse-creater", "balance-balanceSelse-lockTime"]);

    seacher.button([{
        id: "createBalanceSelection",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    seacher.history("balanceSelectionPostData");

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
        clazz: "blue",
    }, {
        fieId: "cost",
        name: "成本",
        prop: "cost",
        clazz: "blue",
    }, {
        fieId: "payment",
        name: "应付",
        prop: "payment",
        clazz: "blue",
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
        name: "汇总",
        clazz: "btn-purple",
        handle: function(v) {

            com.post(api.balance.amountBalanceSelection, {
                "balanceSelection.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "汇总成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSales.STATUS_UNLOCK_INT);
        }
    }, {
        name: "明细",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance = v;
            params.balance.bsid = v.bsid;

            com.popup4page("#stockRecordPopUp", api.index.balanceSelectionItemIndex.url, "选材项");

            return false;
        }
    }, {
        name: "更新",
        clazz: "btn-info",
        handle: function(v) {

            balanceSelection.bsid = v.bsid;
            balanceSelection.items.updateName.val(v.name);
            balanceSelection.modals.renewal.modal("show");

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
                "balanceSelection.bsid": v.bsid,
                "balanceSelection.payment": v.grade == "A" ? v.income : v.payment
            };

            com.post(api.balance.balanceBalanceSelection, options, function() {

                com.showAlert(com.info, "结算成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_UNLOCK_INT);
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.balance.deleteBalanceSelection, {
                "balanceSelection.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "删除成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }, {
        name: "锁定",
        clazz: "btn-success",
        handle: function(v) {

            com.post(api.balance.lockBalanceSelection, {
                "balanceSelection.bsid": v.bsid
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

            com.post(api.balance.unlockBalanceSelection, {
                "balanceSelection.bsid": v.bsid
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
        name: "打印",
        clazz: "btn-yellow",
        handle: function(v) {

            params.balance.bsid = v.bsid;
            params.balance.type = 1;

            com.popup("明细表", api.index.balanceSelection2print.url, null, null, true);

            return false;
        },
        show: function(v) {

            return (v.status != constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#createBalanceSelection').on("click", function() {

        balanceSelection.modals.createBalanceSelectionModal.modal("show");
    });

    function saveData() {

        if (com.validate('createBalanceSelectionModal'))
            return false;

        var options = {
            "balanceSelection.name": balanceSelection.items.name.val(),
            "balanceSelection.brand.bid": com.typeahead("brand"),
            "balanceSelection.grade": $('input[name="grade"]:checked').val(),
        };

        com.post(api.balance.createBalanceSelection, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceSelection.modals.createBalanceSelectionModal.modal("hide");
    }

    function saveDate() {

        if (com.validate('renewal'))
            return false;

        var options = {
            "balanceSelection.bsid": balanceSelection.bsid,
            "balanceSelection.name": balanceSelection.items.updateName.val(),
        };

        com.post(api.balance.updateBalanceSelection, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceSelection.modals.renewal.modal("hide");
    }

});
