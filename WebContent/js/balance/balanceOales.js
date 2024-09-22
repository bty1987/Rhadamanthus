jQuery(function($) {

    var balanceOales = {

        boid: null,
        btns: {
            createBalanceSelectionBtn: com.focusPage("#createBalanceOalesBtn").on("click", saveData),
            withdrawBtn: com.focusPage("#withdrawBtn").on("click", saveDate)
        },

        modals: {
            createBalanceOalesModal: com.focusPage("#createBalanceOalesModal"),
            renewal: com.focusPage("#renewal")
        },

        items: {
            name: com.focusPage("#balanceOalesName"),
            updateName: com.focusPage("#updateName")
        },

        status: {}
    };

    var seacher = new Searcher();

    seacher.base("bocondList", "bopagenation", "boresultList", api.balance.pageBalanceOales);

    seacher.condition(["balance-balanceSelse-name", "balance-balanceSelse-status", "balance-balanceSelse-grade", "balance-balanceSelse-createTime", "balance-balanceSelse-creater", "balance-balanceSelse-lockTime"]);

    seacher.button([{
        id: "createBalanceOales",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    seacher.history("balanceOalesPostData");

    var lineprops = [{
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
        name: "汇总",
        clazz: "btn-purple",
        handle: function(v) {

            com.post(api.balance.amountBalanceOales, {
                "balanceOales.boid": v.boid
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

            params.balance.boid = v.boid;

            com.popup4page("#stockRecordPopUp", api.index.balanceOalesItemIndex.url, "外销单");

            return false;
        }
    }, {
        name: "更新",
        clazz: "btn-info",
        handle: function(v) {

            balanceOales.boid = v.boid;
            balanceOales.items.updateName.val(v.name);
            balanceOales.modals.renewal.modal("show");

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
                "balanceOales.boid": v.boid
            };

            com.post(api.balance.balanceBalanceOales, options, function() {

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

            com.post(api.balance.deleteBalanceOales, {
                "balanceOales.boid": v.boid
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

            com.post(api.balance.lockBalanceOales, {
                "balanceOales.boid": v.boid
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

            com.post(api.balance.unlockBalanceOales, {
                "balanceOales.boid": v.boid
            }, function() {

                com.showAlert(com.info, "解锁成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_UNLOCK_INT);
        }
    }];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#createBalanceOales').on("click", function() {

        com.cleanItems(balanceOales.items);
        balanceOales.modals.createBalanceOalesModal.modal("show");
    });

    function saveData() {

        if (com.validate('createBalanceOalesModal'))
            return false;

        var options = {
            "balanceOales.name": balanceOales.items.name.val(),
            "balanceOales.grade": $('input[name="grade"]:checked').val()
        };

        com.post(api.balance.createBalanceOales, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceOales.modals.createBalanceOalesModal.modal("hide");
    }

    function saveDate() {

        if (com.validate('renewal'))
            return false;

        var options = {
            "balanceOales.boid": balanceOales.boid,
            "balanceOales.name": balanceOales.items.updateName.val(),
        };

        com.post(api.balance.updateBalanceOales, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceOales.modals.renewal.modal("hide");
    }

});
