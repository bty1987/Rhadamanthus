$(function() {

    var balanceSalesBalance = {

        bsid: params.balance.bsid,

        types: {},
        onetypes: {},
        statues: {},
        balanceSales: null
    };

    com.focusPage('#fl-statement').statement("结算销售", "明细");

    balanceSalesBalance.types = constant.sales().salesBalance.type.keys;
    balanceSalesBalance.statues = constant.sales().salesBalance.status.keys;

    com.post(api.balance.queryBalanceSalesByBsid, {
        "balanceSales.bsid": balanceSalesBalance.bsid
    }, function(res) {

        balanceSales = res.balanceSales;
        balanceSalesBalance.balanceSales = res.balanceSales;
    }, null, false);

    function calcSalesBalance(v) {

        var oneType = v.salesBalance.onetype;
        var Type = v.salesBalance.type;

        var salesRevenue = 0;
        var salesAmount = 0;
        var accountsPayable = 0;
        var comProfits = 0;

        var venderMaling = (v.salesBalance && v.salesBalance.sales && v.salesBalance.sales.venderMaling) ? Math.round(v.salesBalance.sales.venderMaling) : 0;
        var allowance = (v.salesBalance && v.salesBalance.allowance) ? v.salesBalance.allowance : 0;

        if (oneType == constant.sales().salesBalance.ONETYPE_INIT_INT) {

            if (Type == constant.sales().salesBalance.TYPE_DEPOSITPAY_INT) {

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

            comProfits = utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accAdd(salesRevenue, venderMaling));
        }

        if (oneType == constant.sales().salesBalance.ONETYPE_REFUND_INT) {

            venderMaling = 0;
            salesRevenue = v.salesBalance.total;
            salesAmount = utils.accAdd(v.salesBalance.total, allowance);
            accountsPayable = v.salesBalance.pbalance;
            comProfits = utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accSub(salesRevenue, venderMaling));
        }

        if (oneType == constant.sales().salesBalance.ONETYPE_ALLBACK_INT || oneType == constant.sales().salesBalance.ONETYPE_DBACKORDER_INT) {

            salesRevenue = v.salesBalance.total;
            salesAmount = utils.accAdd(utils.accSub(v.salesBalance.total, venderMaling), allowance);
            accountsPayable = utils.accAdd(v.salesBalance.pbalance, venderMaling);
            comProfits = utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accSub(salesRevenue, venderMaling));
        }

        return {
            venderMaling: venderMaling,
            allowance: allowance,
            salesRevenue: salesRevenue,
            salesAmount: salesAmount,
            accountsPayable: accountsPayable,
            comProfits: comProfits
        };
    }

    var lineprops = (function() {

        return [{
            type: "checkbox",
            field: "bsbid",
            name: "多选",
            prop: "bsbid",
            clazz: "ace ace-checkbox-2"
        }, {
            field: "salesBalance.sales.orderId",
            name: "装修单号",
            prop: "salesBalance.sales.orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.salesBalance.sales.orderId);
            }
        }, {
            field: "salesBalance.sales.house",
            name: "楼盘地址",
            prop: function(v) { return v.salesBalance.sales.house.village.name + " " + v.salesBalance.sales.house.houseNumber; },
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.salesBalance.sales.house.hid);
            }
        }, {
            field: "salesBalance.sales.category",
            name: "品类",
            prop: "salesBalance.sales.category",
            clazz: "grey"
        }, {
            field: "salesBalance.sales.brand.name",
            name: "品牌",
            prop: "salesBalance.sales.brand.name",
            clazz: "grey"
        }, {
            field: "salesBalance.type",
            name: "类型",
            prop: function(v) { return balanceSalesBalance.types[v.salesBalance.type]; },
            clazz: "red"
        }, {
            field: "salesBalance.pbalance",
            name: "结算值",
            prop: "salesBalance.pbalance",
            clazz: "blue"
        }, {
            field: "salesBalance.onetype",
            name: "一类",
            prop: function(v) { return constant.sales().salesBalance.onetype.keys[v.salesBalance.onetype]; },
            clazz: "red"
        }, {
            field: "salesBalance.status",
            name: "状态",
            prop: function(v) { return constant.sales().salesBalance.status.keys[v.salesBalance.status]; },
            clazz: "red"
        }, {
            type: "newline"
        }, {
            field: "venderMaling",
            name: "供应商减免金额",
            prop: function(v) { return calcSalesBalance(v).venderMaling; },
            clazz: "blue"
        }, {
            field: "allowance",
            name: "折扣/抹零金额",
            prop: function(v) { return calcSalesBalance(v).allowance; },
            clazz: "blue"
        }, {
            field: "salesRevenue",
            name: "销售收入",
            prop: function(v) { return utils.changeThrDecimal(calcSalesBalance(v).salesRevenue); },
            clazz: "blue"
        }, {
            field: "salesAmount",
            name: "销售金额",
            prop: function(v) { return utils.changeThrDecimal(calcSalesBalance(v).salesAmount); },
            clazz: "blue"
        }, {
            field: "salesBalance.pbalance",
            name: "销售成本",
            prop: "salesBalance.pbalance",
            clazz: "blue"
        }, {
            field: "accountsPayable",
            name: "应付账款",
            prop: function(v) { return utils.changeThrDecimal(calcSalesBalance(v).accountsPayable); },
            clazz: "blue"
        }, {
            field: "settlementProfit",
            name: "结算利润",
            prop: function(v) {
                var c = calcSalesBalance(v);
                return utils.changeThrDecimal(utils.accSub(c.salesAmount, v.salesBalance.pbalance));
            },
            clazz: "blue"
        }, {
            field: "corporateProfits",
            name: "公司利润",
            prop: function(v) {
                var c = calcSalesBalance(v);
                return utils.changeThrDecimal(utils.accSub(c.salesRevenue, c.accountsPayable));
            },
            clazz: "blue"
        }, {
            field: "salesBalance.createTime",
            name: "收款时间",
            prop: "salesBalance.createTime",
            clazz: "green"
        }, {
            field: "salesCostRatio",
            name: "销售成本比例",
            prop: function(v) {
                var c = calcSalesBalance(v);
                return c.salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(v.salesBalance.pbalance, c.salesAmount));
            },
            clazz: "blue"
        }, {
            field: "proportionOfSettlementProfit",
            name: "结算利润占比",
            prop: function(v) {
                var c = calcSalesBalance(v);
                return c.salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(c.salesAmount, v.salesBalance.pbalance), c.salesAmount));
            },
            clazz: "blue"
        }, {
            field: "comProfits",
            name: "公司利润占比",
            prop: function(v) { return utils.changeThrDecimal(calcSalesBalance(v).comProfits); },
            clazz: "blue"
        }, {
            field: "discountProportionOfMainMaterials",
            name: "主材打折占比",
            prop: function(v) {
                var c = calcSalesBalance(v);
                return c.salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accSub(1, utils.accDiv(c.allowance, c.salesAmount)));
            },
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        var showUnbound = function(v) {
            return balanceSalesBalance.balanceSales.status == constant.balance().balanceSales.STATUS_INIT_INT;
        };

        return {
            unbound: {
                name: "解绑",
                clazz: "btn-yellow",
                show: showUnbound,
                handle: function(v) {
                    com.showConfirm("确定解除绑定", function() {

                        var options = {};
                        var balanceSales = {};
                        var bsbid = v.bsbid;

                        options["balanceSales.bsid"] = balanceSalesBalance.bsid;

                        com.post(api.balance.queryBalanceSalesByBsid, {
                            "balanceSales.bsid": balanceSalesBalance.bsid
                        }, function(res) {

                            balanceSales = res.balanceSales;
                        }, null, false);

                        var c = calcSalesBalance(v);

                        options["balanceSales.income"] = utils.accSub(balanceSales.income, c.salesRevenue);
                        options["balanceSales.cost"] = utils.accSub(balanceSales.cost, v.salesBalance.pbalance);
                        options["balanceSales.payment"] = utils.accSub(balanceSales.payment, c.accountsPayable);
                        options["balanceSales.profit"] = utils.accSub(balanceSales.profit, utils.accSub(c.salesRevenue, c.accountsPayable));

                        options["balanceSalesBalances[0].bsbid"] = bsbid;

                        com.post(api.balance.unbindBalanceSales, options, function(res) {

                            com.showAlert(com.info, "操作成功");
                            searcher.doSearch();
                        });
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addBalance').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('明细打印').appendTo($adda);

        var $profitPrint = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'profitPrint').css("margin", "0px 3px");
        var $profitPrinti = $('<i></i>').addClass('icon-plus bigger-110').appendTo($profitPrint);
        var $profitPrintBtn = $('<span></span>').text('利润打印').appendTo($profitPrint);

        var $export = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-plus bigger-110').appendTo($export);
        var $exportBtn = $('<span></span>').text('导出').appendTo($export);

        var $checka = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').attr('name', 'checks').css("margin", "0px 3px");
        var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        var $checkspan = $('<span></span>').text('全选').appendTo($checka);

        var $unbinda = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'checks').css("margin", "0px 3px");
        var $unbindi = $('<i></i>').addClass('icon-check bigger-110').appendTo($unbinda);
        var $unbindspan = $('<span></span>').text('解绑').appendTo($unbinda);

        if (balanceSalesBalance.balanceSales.status != constant.balance().balanceSales.STATUS_INIT_INT) {

            $checka.hide();
            $unbinda.hide();
        }

        $profitPrintBtn.click(function() {

            params.balance.bsid = balanceSalesBalance.bsid;
            params.balance.type = 2;

            com.popup("利润表", api.index.balanceSales2print.url, null, null, true);
        });

        $adda.click(function() {

            params.balance.bsid = balanceSalesBalance.bsid;
            params.balance.type = 1;

            com.popup("明细表", api.index.balanceSales2print.url, null, null, true);
        });

        $checka.click(function() {

            checkAll();
        });

        $export.click(function() {

            exports();
        });

        $unbinda.click(function() {

            unbind();
        });

        if (balanceSales.status == constant.balance().balanceSales.STATUS_INIT_INT || params['urlLoadParams'].depage == 'material') {

            $adda.hide();
            $profitPrint.hide();
        }

        return [$adda, $profitPrint, $export, $checka, $unbinda];
    })();

    var searcher = new Searcher();

    searcher.set("bsbcondList", "bsbpagenation", "bsbresultList", api.balance.pageBalanceSalesBalance, {
        "balanceSalesBalance.bsid": balanceSalesBalance.bsid
    }, ["balance-salesBalance-sales-orderId"], "balanceSalesBalancePostData", null, false, buildBalanceSalesBalanceButtons);
    searcher.line("salesBalance.sales.no", lineprops, linebtns).render();

    function exports1() {

        if (com.focusPage('#bsbpagenation>span[name="totalRecords"]', "#bsbpagenation").text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.balance.pageBalanceSalesBalance, $.extend({}, params[history], {
            "paging.noPage": 1,
            "balanceSalesBalance.bsid": balanceSalesBalance.bsid
        }), function(res) {

            $.exceler({
                column: [['销售单号', 'salesBalance.sales.no'], ['装修单号', 'salesBalance.sales.orderId'], ['楼盘地址', 'address'], ['品类', 'salesBalance.sales.category'], ['品牌', 'salesBalance.sales.brand.name'], ['类型', 'salesBalance.type'], ['结算值', 'salesBalance.pbalance'], ['一类', 'salesBalance.onetype'], ['状态', 'salesBalance.status'], ['供应商减免金额', 'venderMaling'], ['折扣/抹零金额', 'salesBalance.allowance'], ['销售收入', 'salesRevenue'], ['销售金额', 'salesAmount'], ['销售成本', 'salesBalance.pbalance'], ['应付账款', 'accountsPayable'], ['结算利润', 'settlementProfit'], ['公司利润', 'corporateProfits'], ['收款时间', 'salesBalance.createTime'], ['销售成本比例', 'salesCostRatio'], ['结算利润占比', 'proportionOfSettlementProfit'], ['公司利润占比', 'comProfits'], ['主材打折占比', 'discountProportionOfMainMaterials']],
                list: res.paging.data,
            }, function(v) {

                var oneType = v.salesBalance.onetype;
                var Type = v.salesBalance.type;

                var salesRevenue = 0;
                var salesAmount = 0;
                var accountsPayable = 0;

                var venderMaling = (v.salesBalance && v.salesBalance.sales && v.salesBalance.sales.venderMaling) ? Math.round(v.salesBalance.sales.venderMaling) : 0;
                var allowance = (v.salesBalance && v.salesBalance.allowance) ? v.salesBalance.allowance : 0;

                v.address = v.salesBalance.sales.house.village.name + " " + v.salesBalance.sales.house.houseNumber;
                v.salesBalance.status = constant.balance().balanceSales.status.keys[v.salesBalance.status];
                v.venderMaling = venderMaling;

                if (oneType == constant.sales().salesBalance.ONETYPE_INIT_INT) {

                    if (Type == constant.sales().salesBalance.TYPE_DEPOSITPAY_INT) {

                        venderMaling = 0;
                        allowance = 0;
                        salesRevenue = v.salesBalance.sales.depositpay;
                        salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                        accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);

                        v.salesRevenue = utils.changeThrDecimal(salesRevenue);
                        v.salesAmount = utils.changeThrDecimal(salesAmount);
                        v.accountsPayable = utils.changeThrDecimal(accountsPayable);
                    } else {

                        salesRevenue = utils.accAdd(v.salesBalance.sales.depositpay, v.salesBalance.sales.fullpay);
                        salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                        accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);

                        v.salesRevenue = utils.changeThrDecimal(salesRevenue);
                        v.salesAmount = utils.changeThrDecimal(salesAmount);
                        v.accountsPayable = utils.changeThrDecimal(accountsPayable);
                    }

                    v.venderMaling = utils.changeThrDecimal(venderMaling);
                    v.comProfits = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accAdd(salesRevenue, venderMaling)));
                }

                if (oneType == constant.sales().salesBalance.ONETYPE_REFUND_INT) {

                    venderMaling = 0;
                    salesRevenue = v.salesBalance.total;
                    salesAmount = utils.accAdd(v.salesBalance.total, allowance);
                    accountsPayable = v.salesBalance.pbalance;

                    v.salesRevenue = utils.changeThrDecimal(salesRevenue);
                    v.salesAmount = utils.changeThrDecimal(salesAmount);
                    v.accountsPayable = utils.changeThrDecimal(accountsPayable);
                    v.venderMaling = utils.changeThrDecimal(venderMaling);

                    v.comProfits = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accSub(salesRevenue, venderMaling)));
                }

                if (oneType == constant.sales().salesBalance.ONETYPE_ALLBACK_INT || oneType == constant.sales().salesBalance.ONETYPE_DBACKORDER_INT) {

                    salesRevenue = v.salesBalance.total;
                    salesAmount = utils.accAdd(utils.accSub(v.salesBalance.total, venderMaling), allowance);
                    accountsPayable = utils.accAdd(v.salesBalance.pbalance, venderMaling);

                    v.salesRevenue = utils.changeThrDecimal(salesRevenue);
                    v.salesAmount = utils.changeThrDecimal(salesAmount);
                    v.accountsPayable = utils.changeThrDecimal(accountsPayable);
                    v.venderMaling = utils.changeThrDecimal(-venderMaling);

                    v.comProfits = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accSub(salesRevenue, venderMaling)));
                }

                v.salesBalance.onetype = constant.sales().salesBalance.onetype.keys[v.salesBalance.onetype];
                v.salesBalance.type = balanceSalesBalance.types[v.salesBalance.type];
                v.settlementProfit = utils.changeThrDecimal(utils.accSub(salesAmount, v.salesBalance.pbalance));
                v.corporateProfits = utils.changeThrDecimal(utils.accSub(salesRevenue, accountsPayable));
                v.salesCostRatio = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(v.salesBalance.pbalance, salesAmount));
                v.proportionOfSettlementProfit = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(salesAmount, v.salesBalance.pbalance), salesAmount));
                v.discountProportionOfMainMaterials = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accSub(1, utils.accDiv(allowance, salesAmount)));
            });
        });
    }

    function exports() {

        if (com.focusPage('#bsbpagenation>span[name="totalRecords"]', "#bsbpagenation").text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.balance.pageBalanceSalesBalance, $.extend({}, params[history], {
            "paging.noPage": 1,
            "balanceSalesBalance.bsid": balanceSalesBalance.bsid
        }), function(res) {

            $.exceler({
                column: [//
                ['销售单号', 'salesBalance.sales.no'], //
                ['装修单号', 'salesBalance.sales.orderId'], //
                ['楼盘地址', 'address'], //
                ['品类', 'salesBalance.sales.category'], // 
                ['品牌', 'salesBalance.sales.brand.name'], //
                ['类型', 'salesBalance.type'], //
                ['结算值', 'salesBalance.pbalance'], //
                ['一类', 'salesBalance.onetype'], //
                ['状态', 'salesBalance.status'], //
                ['供应商减免金额', 'venderMaling'], //
                ['折扣/抹零金额', 'salesBalance.allowance'], //
                ['销售收入', 'salesRevenue'], //
                ['销售金额', 'salesAmount'], //
                ['销售成本', 'salesBalance.pbalance'], //
                ['应付账款', 'accountsPayable'], //
                ['结算利润', 'settlementProfit'], //
                ['公司利润', 'corporateProfits'], //
                ['收款时间', 'salesBalance.createTime'], //
                ['销售成本比例', 'salesCostRatio'], // 
                ['结算利润占比', 'proportionOfSettlementProfit'], //
                ['公司利润占比', 'comProfits'], //
                ['主材打折占比', 'discountProportionOfMainMaterials']//
                ],
                list: res.paging.data,
            }, function(v) {

                var oneType = v.salesBalance.onetype;
                var Type = v.salesBalance.type;

                var salesRevenue = 0;
                var salesAmount = 0;
                var accountsPayable = 0;

                var venderMaling = (v.salesBalance && v.salesBalance.sales && v.salesBalance.sales.venderMaling) ? Math.round(v.salesBalance.sales.venderMaling) : 0;
                var allowance = (v.salesBalance && v.salesBalance.allowance) ? v.salesBalance.allowance : 0;

                v.address = v.salesBalance.sales.house.village.name + " " + v.salesBalance.sales.house.houseNumber;
                v.salesBalance.status = constant.balance().balanceSales.status.keys[v.salesBalance.status];
                v.venderMaling = venderMaling;

                if (oneType == constant.sales().salesBalance.ONETYPE_INIT_INT) {

                    if (Type == constant.sales().salesBalance.TYPE_DEPOSITPAY_INT) {

                        venderMaling = 0;
                        allowance = 0;
                        salesRevenue = v.salesBalance.sales.depositpay;
                        salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                        accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);

                        v.salesRevenue = utils.changeThrDecimal(salesRevenue);
                        v.salesAmount = utils.changeThrDecimal(salesAmount);
                        v.accountsPayable = utils.changeThrDecimal(accountsPayable);
                    } else {

                        salesRevenue = utils.accAdd(v.salesBalance.sales.depositpay, v.salesBalance.sales.fullpay);
                        salesAmount = utils.accAdd(salesRevenue, utils.accAdd(venderMaling, allowance));
                        accountsPayable = utils.accSub(v.salesBalance.pbalance, venderMaling);

                        v.salesRevenue = utils.changeThrDecimal(salesRevenue);
                        v.salesAmount = utils.changeThrDecimal(salesAmount);
                        v.accountsPayable = utils.changeThrDecimal(accountsPayable);
                    }

                    v.venderMaling = utils.changeThrDecimal(venderMaling);
                    v.comProfits = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accAdd(salesRevenue, venderMaling)));
                }

                if (oneType == constant.sales().salesBalance.ONETYPE_REFUND_INT) {

                    venderMaling = 0;
                    salesRevenue = v.salesBalance.total;
                    salesAmount = utils.accAdd(v.salesBalance.total, allowance);
                    accountsPayable = v.salesBalance.pbalance;

                    v.salesRevenue = utils.changeThrDecimal(salesRevenue);
                    v.salesAmount = utils.changeThrDecimal(salesAmount);
                    v.accountsPayable = utils.changeThrDecimal(accountsPayable);
                    v.venderMaling = utils.changeThrDecimal(venderMaling);

                    v.comProfits = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accSub(salesRevenue, venderMaling)));
                }

                if (oneType == constant.sales().salesBalance.ONETYPE_ALLBACK_INT || oneType == constant.sales().salesBalance.ONETYPE_DBACKORDER_INT) {

                    salesRevenue = v.salesBalance.total;
                    salesAmount = utils.accAdd(utils.accSub(v.salesBalance.total, venderMaling), allowance);
                    accountsPayable = utils.accAdd(v.salesBalance.pbalance, venderMaling);

                    v.salesRevenue = utils.changeThrDecimal(salesRevenue);
                    v.salesAmount = utils.changeThrDecimal(salesAmount);
                    v.accountsPayable = utils.changeThrDecimal(accountsPayable);
                    v.venderMaling = utils.changeThrDecimal(-venderMaling);

                    v.comProfits = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accSub(salesRevenue, venderMaling)));
                }

                v.salesBalance.onetype = constant.sales().salesBalance.onetype.keys[v.salesBalance.onetype];
                v.salesBalance.type = balanceSalesBalance.types[v.salesBalance.type];
                v.settlementProfit = utils.changeThrDecimal(utils.accSub(salesAmount, v.salesBalance.pbalance));
                v.corporateProfits = utils.changeThrDecimal(utils.accSub(salesRevenue, accountsPayable));
                v.salesCostRatio = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(v.salesBalance.pbalance, salesAmount));
                v.proportionOfSettlementProfit = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accSub(salesAmount, v.salesBalance.pbalance), salesAmount));
                v.discountProportionOfMainMaterials = salesAmount == 0 ? 0 : utils.changeThrDecimal(utils.accSub(1, utils.accDiv(allowance, salesAmount)));
            });
        });
    }

    function checkAll() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
        console.log(balanceSalesBalance.selectList)
    }

    function unbind() {

        var $inputs = com.focusPage('input[type="checkbox"]:checked');

        if (!$inputs.length) {
            com.showAlert(com.warning, "请选择需要解绑数据");
            return false;
        }

        var options = {};

        $.each($inputs, function(i, v) {

            var $input = $(v);

            options["balanceSalesBalances[" + i + "].bsbid"] = $input.attr('bsbid');;
        });

        options["balanceSales.bsid"] = balanceSalesBalance.bsid;

        com.post(api.balance.unbindBalanceSales, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            balanceSalesBalance.selectList = [];
        });
    }
});
