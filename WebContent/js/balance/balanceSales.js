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

        depage: params['urlLoadParams'].depage,
    };

    com.initTypeahead("brand", api.data.queryBrandByPinyin, "brand.pinyin", {}, "brands", "bid", "name", null);

    var seacher = new Searcher();

    seacher.base("bscondList", "bspagenation", "bsresultList", api.balance.pageBalanceSales);

    seacher.condition(["balance-balanceSelse-balance-no", "balance-balanceSelse-name", "balance-balanceSelse-status", "balance-balanceSelse-brand", "balance-balanceSelse-grade", "balance-balanceSelse-createTime", "balance-balanceSelse-creater", "balance-balanceSelse-lockTime"]);

    seacher.button([{
        id: "createBalanceSales",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    seacher.history("balanceSalesPostData");

    var lineprops = [{
        fieId: "balance.no",
        name: "结算单号",
        prop: "balance.no",
        clazz: "blue",
        show: function(v) {

            return (v.balance.no != "0000000000");
        }
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

            com.post(api.balance.amountBalanceSales, {
                "balanceSales.bsid": v.bsid
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
        name: "同步金蝶",
        clazz: "btn-inverse",
        handle: function(v) {

            kingdee(v);
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_ENABLE_CHECK_INT) && balanceSales.depage == null;
        }
    }, {
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
            balanceSales.items.updateName.val(v.name);
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

            return (v.status != constant.balance().balanceSales.STATUS_INIT_INT) && balanceSales.depage == null;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.balance.deleteBalanceSales, {
                "balanceSales.bsid": v.bsid
            }, function() {

                com.showAlert(com.info, "删除成功");
                seacher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return (v.status == constant.balance().balanceSales.STATUS_INIT_INT);
        }
    }];

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

    function kingdee(v) {

        var balanceSales = {
            bsid: 0,
            creater: {
                userId: null
            },
            balanceTime: null,
            grade: null,
            brand: {
                kino: null,
                supplier: {
                    oldUserId: null
                }
            },
            name: null,
            payment: 0,
            income: 0,
            paymentOrg: null,
            items: []
        };

        com.post(api.balance.queryBalanceSalesByBsid, {
            "balanceSales.bsid": v.bsid
        }, function(res) {

            balanceSales.bsid = res.balanceSales.bsid;
            balanceSales.creater.userId = res.balanceSales.creater.userId;
            balanceSales.balanceTime = res.balanceSales.balanceTime;
            balanceSales.grade = res.balanceSales.grade;
            balanceSales.brand.kino = res.balanceSales.brand.kino;
            balanceSales.brand.supplier.oldUserId = res.balanceSales.brand.supplier != null ? res.balanceSales.brand.supplier.oldUserId : "";
            balanceSales.name = res.balanceSales.name;
            balanceSales.payment = res.balanceSales.payment;
            balanceSales.income = res.balanceSales.income;
            balanceSales.paymentOrg = params.company.srganization.no;
        }, null, false);

        com.post(api.balance.pageBalanceSalesBalance, {
            "paging.noPage": 1,
            "balanceSales.bsid": v.bsid
        }, function(res) {

            $.each(res.paging.data, function(i, v) {

                var oneType = v.salesBalance.onetype;
                var Type = v.salesBalance.type;
                var salesRevenue = null;
                var salesAmount = null;
                var accountsPayable = null;
                var venderMaling = Math.round(v.salesBalance.sales.venderMaling);
                var allowance = Math.round(v.salesBalance.allowance);

                if (oneType == 0) {

                    if (Type == 3) {

                        venderMaling = 0;
                        allowance = 0;
                        salesRevenue = v.salesBalance.sales.depositpay;
                        salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                        accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);
                    } else {

                        salesRevenue = utils.accAdd(v.salesBalance.sales.depositpay, v.salesBalance.sales.fullpay);
                        salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                        accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);
                    }
                }

                if (oneType == 1) {

                    venderMaling = 0;
                    salesRevenue = v.salesBalance.total;
                    salesAmount = utils.accAdd(v.salesBalance.total, allowance);
                    accountsPayable = v.salesBalance.pbalance;
                    venderMaling = (-venderMaling);
                }

                if (oneType == 2 || oneType == 3) {

                    salesRevenue = v.salesBalance.total;
                    salesAmount = utils.accAdd(utils.accSub(v.salesBalance.total, venderMaling), allowance);
                    accountsPayable = utils.accAdd(v.salesBalance.pbalance, venderMaling);
                    venderMaling = (-venderMaling);
                }

                var salesRev = utils.changeThrDecimal(salesRevenue);
                var serMoney = utils.accSub(utils.changeThrDecimal(salesRevenue), utils.changeThrDecimal(accountsPayable));

                var types = [constant.sales().salesBalance.TYPE_PREBALANCEREFUNDS_INT, constant.sales().salesBalance.TYPE_BALANCEREFUNDS_INT];
                var coupon = null;

                if (types.indexOf(v.salesBalance.type) != -1) {
                    coupon = -v.salesBalance.coupon;
                } else {
                    coupon = v.salesBalance.coupon;
                }

                var item = {
                    salesRevenue: salesRev,
                    serviceMoney: serMoney,
                    orderId: v.salesBalance.sales.orderId,
                    no: v.salesBalance.sales.no,
                    coupon: coupon,
                    address: v.salesBalance.sales.house.village.name + " " + v.salesBalance.sales.house.houseNumber
                };
                balanceSales.items.push(item);
            });

        }, null, false);

        kingdeeUtils.balance(balanceSales);
    }
});
