$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;

    var options = {
        totalIncome: 0,
        totalRelief: 0,
        totalDiscount: 0,
        totalSalesAmount: 0,
        totalCost: 0,
        totalPayable: 0,
        totalSettlementProfit: 0,
        totalCompanyProfit: 0,
        totalService: 0
    };

    var serNum = 0;
    var balanceSales = {};
    var brand = {};
    var creater = {};
    var trList = $("#reslist");

    com.post(api.balance.queryBalanceSalesByBsid, {"balanceSales.bsid": params.balance.bsid}, function(res) {

        balanceSales = res.balanceSales;
        brand = balanceSales.brand;
        creater = balanceSales.creater;
    }, null, false);

    var table;
    var tabody = $('<tbody> </tbody>');

    setTimeout(function() {

        table = createHeader().appendTo(trList);
        pageList(1, 50);
        tabody.appendTo(table);

     }, 500);

    var index = 0;
    function pageList(page, rows) {

        var option = {
            "paging.page": page,
            "paging.rows": rows,
            "balanceSales.bsid": params.balance.bsid
        };

        com.post(api.balance.pageBalanceSalesBalance, option, function(res) {

            createLine(res.paging.data);
            if (page < res.paging.totalPage) setTimeout(function() {pageList(page+1, rows);}, 500);
            else createFooter();

        }, null, false);
    };

    if (params.balance.type == 1) {

        createHeader = createComHeader;
        createLine = createComLine;
        createFooter = createComFooter;
    } else {

        createHeader = createPreHeader;
        createLine = createPreLine;
        createFooter = createPreFooter;
    }

    function createComHeader() {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:20px;">供应商对账单</caption>').appendTo(table);

        var tr1 = $('<tr style="font-size: 7px;"></tr>').appendTo(table);
        var td1 = $('<td colspan="4" style="border: 1px solid;"></td>').text("供应商名称：" + brand.name).appendTo(tr1);
        var td2 = $('<td colspan="3" style="border: 1px solid;"></td>').text("负责对账员：" + creater.userName).appendTo(tr1);
        var td3 = $('<td colspan="5" style="border: 1px solid;"></td>').text("单号：" + balanceSales.name).appendTo(tr1);
        var tr2 = $('<tr colspan="11" style="border: 1px solid;height: 60px;text-align: center; font-size: 7px;"></tr>').appendTo(table);

        var td37 = $('<td colspan="11" style="border: 1px solid;"></td>').appendTo(tr2);
        var span1 = $('<span></span>').text("首先感谢贵公司对我司的支持！为明确双方往来款项的准确清晰，" +
            "特将贵公司与我司往来账款明细列出，如以下交易无误、核对相符，请在“数据核对无误”处盖章并签字确认，" +
            "本次账单代收款的金额为：人民币").appendTo(td37);
        var span2 = $('<span></span>').attr("id", "totalInc").text("").appendTo(span1);
        var span3 = $('<span></span>').text(")，本次账单服务费的金额为：人民币").appendTo(span1);
        var span4 = $('<span></span>').attr("id", "totalSer").text("").appendTo(span1);
        var span5 = $('<span></span>').text(")，本次账单差额的金额为：人民币").appendTo(span1);
        var span6 = $('<span></span>').attr("id", "totalPay").text("").appendTo(span1);
        var span7 = $('<span></span>').text(")").appendTo(span1);

        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(table);
        var td4 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("序号").appendTo(tr3);
        var td5 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("收入日期").appendTo(tr3);
        var td6 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("供应商名称").appendTo(tr3);
        var td7 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("装修单号").appendTo(tr3);
        var td8 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("楼盘地址").appendTo(tr3);
        var td9 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("销售收入（实收金额）").appendTo(tr3);
        var td10 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("销售金额（厂商结算额）").appendTo(tr3);
        var td11 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("销售成本（厂商结款额）").appendTo(tr3);
        var td12 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("厂商抹零").appendTo(tr3);
        var td13 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("应付账款").appendTo(tr3);
        var td14 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("服务费金额").appendTo(tr3);
        var td15 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("备注").appendTo(tr3);
        return table;
    }

    function createComLine(items) {

        $.each(items, function(i, v) {
            
            var oneType = v.salesBalance.onetype;
            var Type = v.salesBalance.type;
            
            var salesRevenue = 0;
            var salesAmount = 0;
            var accountsPayable = 0;
            var venderMaling = (v.salesBalance && v.salesBalance.sales && v.salesBalance.sales.venderMaling) ? Math.round(v.salesBalance.sales.venderMaling) : 0;
            var allowance = (v.salesBalance && v.salesBalance.allowance) ? v.salesBalance.allowance : 0;

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

            var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(tabody);
            var td15 = $('<td style="border: 1px solid;"></td>').text(serNum + 1).appendTo(tr4);
            var td16 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.createTime).appendTo(tr4);
            var td17 = $('<td style="border: 1px solid;"></td>').text(brand.name).appendTo(tr4);
            var td18 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.sales.orderId).appendTo(tr4);
            var td19 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.sales.house.village.name + " " + v.salesBalance.sales.house.houseNumber).appendTo(tr4);
            var td20 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(salesRevenue)).appendTo(tr4);
            var td21 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(salesAmount)).appendTo(tr4);
            var td22 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.pbalance).appendTo(tr4);
            var td29 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(venderMaling)).appendTo(tr4);
            var td24 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(accountsPayable)).appendTo(tr4);
            var td25 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(utils.accSub(salesRevenue, accountsPayable))).appendTo(tr4);
            var td26 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.comment).appendTo(tr4);

            options.totalIncome = utils.accAdd(options.totalIncome, salesRevenue);// 合计销售收入
            options.totalSalesAmount = utils.accAdd(options.totalSalesAmount, salesAmount);// 合计销售金额
            options.totalCost = utils.accAdd(options.totalCost, v.salesBalance.pbalance);// 合计销售成本金额
            options.totalDiscount = utils.accAdd(options.totalDiscount, allowance);// 合计折扣/抹零金额
            options.totalPayable = utils.accAdd(options.totalPayable, accountsPayable);// 合计应付账款
            options.totalRelief = utils.accAdd(options.totalRelief, venderMaling);// 合计供应商减免金额
            options.totalService = utils.accAdd(options.totalService, utils.accSub(utils.changeThrDecimal(salesRevenue), utils.changeThrDecimal(accountsPayable)));
            
            serNum = serNum+1;
        });
    }

    function createComFooter() {

        $("#totalInc").text(utils.getCNMoney(utils.changeThrDecimal(options.totalIncome)) + "(￥" + utils.changeThrDecimal(options.totalIncome));
        $("#totalSer").text(utils.getCNMoney(utils.changeThrDecimal(options.totalService)) + "(￥" + utils.changeThrDecimal(options.totalService));
        $("#totalPay").text(utils.getCNMoney(utils.changeThrDecimal(options.totalPayable)) + "(￥" + utils.changeThrDecimal(options.totalPayable));

        var tr5 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 6px;"></tr>').appendTo(tabody);
        var td26 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td27 = $('<td style="border: 1px solid;"></td>').text("合计").appendTo(tr5);
        var td28 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td29 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td30 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td31 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalIncome)).appendTo(tr5);
        var td32 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalSalesAmount)).appendTo(tr5);
        var td33 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalCost)).appendTo(tr5);
        var td46 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalRelief)).appendTo(tr5);
        var td35 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalPayable)).appendTo(tr5);
        var td36 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalService)).appendTo(tr5);
        var td37 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
    }

    function createPreHeader() {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:20px;">'+params.company.name+'主材销售分析明细表</caption>').appendTo(table);

        var tr1 = $('<tr style="font-size: 7px;"></tr>').appendTo(table);
        var td1 = $('<td colspan="4" style="border: 1px solid;"></td>').text("供应商名称: " + brand.name).appendTo(tr1);
        var td2 = $('<td colspan="4" style="border: 1px solid;"></td>').text("单号: " + balanceSales.name).appendTo(tr1);
        var td3 = $('<td colspan="4" style="border: 1px solid;"></td>').text("制表: " + creater.userName).appendTo(tr1);
        var td4 = $('<td colspan="5" style="border: 1px solid;"></td>').text("单位: 人民币元").appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 20px;text-align: center;font-size: 7px;"></tr>').appendTo(table);
        var td5 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("序号").appendTo(tr2);
        var td6 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("销售日期").appendTo(tr2);
        var td7 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("装修单号").appendTo(tr2);
        var td8 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("楼盘地址").appendTo(tr2);
        var td9 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("销售收入").appendTo(tr2);
        var td10 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("供应商减免").appendTo(tr2);
        var td11 = $('<td colspan="2" style="border: 1px solid;"></td>').text("主材打折").appendTo(tr2);
        var td12 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("销售金额").appendTo(tr2);
        var td13 = $('<td colspan="2" style="border: 1px solid;"></td>').text("销售成本").appendTo(tr2);
        var td14 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("应付账款").appendTo(tr2);
        var td15 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("结算利润").appendTo(tr2);
        var td16 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("结利占比").appendTo(tr2);
        var td17 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("公司利润").appendTo(tr2);
        var td18 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("公利占比").appendTo(tr2);
        var td19 = $('<td rowspan="2" style="border: 1px solid;"></td>').text("备注").appendTo(tr2);

        var tr3 = $('<tr style="border: 1px solid;height: 20px;text-align: center;font-size: 7px;"></tr>').appendTo(table);
        var td20 = $('<td style="border: 1px solid;"></td>').text("金额").appendTo(tr3);
        var td21 = $('<td style="border: 1px solid;"></td>').text("占比").appendTo(tr3);
        var td22 = $('<td style="border: 1px solid;"></td>').text("金额").appendTo(tr3);
        var td23 = $('<td style="border: 1px solid;"></td>').text("占比").appendTo(tr3);

        return table;
    }

    function createPreLine(items) {

        $.each(items, function(i, v) {

            var oneType = v.salesBalance.onetype;
            var Type = v.salesBalance.type;
            var salesRevenue = 0;
            var salesAmount = 0;
            var accountsPayable = 0;
            var venderMaling = (v.salesBalance && v.salesBalance.sales && v.salesBalance.sales.venderMaling) ? Math.round(v.salesBalance.sales.venderMaling) : 0;
            var allowance = (v.salesBalance && v.salesBalance.allowance) ? v.salesBalance.allowance : 0;

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

            index = index + 1;
            
            var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center;font-size: 5px;"></tr>').appendTo(tabody);
            var td24 = $('<td style="border: 1px solid;"></td>').text(index).appendTo(tr4);
            var td25 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.createTime).appendTo(tr4);
            var td26 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.sales.orderId).appendTo(tr4);
            var td27 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.sales.house.village.name + " " + v.salesBalance.sales.house.houseNumber).appendTo(tr4);
            var td28 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(salesRevenue)).appendTo(tr4);
            var td29 = $('<td style="border: 1px solid;"></td>').text(venderMaling).appendTo(tr4);
            var td30 = $('<td style="border: 1px solid;"></td>').text(allowance).appendTo(tr4);
            var td31 = $('<td style="border: 1px solid;"></td>').text(salesAmount == 0 ? 0 : utils.changeTwoDecimal(utils.accMul(utils.accSub(1, utils.accDiv(allowance, salesAmount)), 100)) + "%").appendTo(tr4);
            var td32 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(salesAmount)).appendTo(tr4);
            var td33 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.pbalance).appendTo(tr4);
            var td34 = $('<td style="border: 1px solid;"></td>').text(salesAmount == 0 ? 0 : utils.changeTwoDecimal(utils.accMul(utils.accDiv(v.salesBalance.pbalance, salesAmount), 100)) + "%").appendTo(tr4);
            var td35 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(accountsPayable)).appendTo(tr4);
            var td36 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(utils.accSub(salesAmount, v.salesBalance.pbalance))).appendTo(tr4);
            var td37 = $('<td style="border: 1px solid;"></td>').text(salesAmount == 0 ? 0 : utils.changeTwoDecimal(utils.accMul(utils.accDiv(utils.accSub(salesAmount, v.salesBalance.pbalance), salesAmount), 100)) + "%").appendTo(tr4);
            var td38 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(utils.accSub(salesRevenue, accountsPayable))).appendTo(tr4);
            var td39 = $('<td style="border: 1px solid;"></td>').text(salesAmount == 0 ? 0 : utils.changeTwoDecimal(utils.accMul(utils.accDiv(utils.accSub(salesRevenue, accountsPayable), utils.accAdd(salesRevenue, venderMaling)), 100)) + "%").appendTo(tr4);
            var td40 = $('<td style="border: 1px solid;"></td>').text(v.salesBalance.comment).appendTo(tr4);

            options.totalIncome = utils.accAdd(options.totalIncome, salesRevenue);// 合计销售收入
            options.totalRelief = utils.accAdd(options.totalRelief, venderMaling);// 合计供应商减免金额
            options.totalDiscount = utils.accAdd(options.totalDiscount, allowance);// 合计折扣/抹零金额
            options.totalSalesAmount = utils.accAdd(options.totalSalesAmount, salesAmount);// 合计销售金额
            options.totalCost = utils.accAdd(options.totalCost, v.salesBalance.pbalance);// 合计销售成本金额
            options.totalPayable = utils.accAdd(options.totalPayable, accountsPayable);// 合计应付账款
            options.totalSettlementProfit = utils.accAdd(options.totalSettlementProfit, utils.accSub(salesAmount, v.salesBalance.pbalance));//合计结算利润
            options.totalCompanyProfit = utils.accAdd(options.totalCompanyProfit, utils.accSub(salesRevenue, accountsPayable));//合计公司利润
        });
    }

    function createPreFooter() {

        var tr5 = $('<tr style="border: 1px solid;height: 25px;text-align: center;font-size: 6px;"></tr>').appendTo(tabody);
        var td41 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td42 = $('<td style="border: 1px solid;"></td>').text("合计").appendTo(tr5);
        var td43 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td44 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td45 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalIncome)).appendTo(tr5);
        var td46 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalRelief)).appendTo(tr5);
        var td47 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalDiscount)).appendTo(tr5);
        var td48 = $('<td style="border: 1px solid;"></td>').text(utils.changeTwoDecimal(utils.accMul(utils.accSub(1, utils.accDiv(options.totalDiscount, options.totalSalesAmount)), 100)) + "%").appendTo(tr5);
        var td49 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalSalesAmount)).appendTo(tr5);
        var td50 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalCost)).appendTo(tr5);
        var td51 = $('<td style="border: 1px solid;"></td>').text(utils.changeTwoDecimal(utils.accMul(utils.accDiv(options.totalCost, options.totalSalesAmount), 100)) + "%").appendTo(tr5);
        var td52 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalPayable)).appendTo(tr5);
        var td53 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalSettlementProfit)).appendTo(tr5);
        var td54 = $('<td style="border: 1px solid;"></td>').text(utils.changeTwoDecimal(utils.accMul(utils.accDiv(options.totalSettlementProfit, options.totalSalesAmount), 100)) + "%").appendTo(tr5);
        var td55 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalCompanyProfit)).appendTo(tr5);
        var td56 = $('<td style="border: 1px solid;"></td>').text(utils.changeTwoDecimal(utils.accMul(utils.accDiv(options.totalCompanyProfit, utils.accAdd(options.totalIncome, options.totalRelief)), 100)) + "%").appendTo(tr5);
        var td57 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);

    }

});

