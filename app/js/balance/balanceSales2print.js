/** app/js/balance/balanceSales2print.js —— 结算销售单打印（明细表/利润表）
 * 上下文：app.params.balance.{bsid,type}: type=1明细表/2利润表。
 * 销售收入/销售金额/应付账款按 onetype/type 计算（对齐旧 calcSalesBalance）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var ctx = app.params.balance || {};
    var bsid = ctx.bsid || '', ptype = ctx.type || 1;
    var company = app.params.company || {};
    var balanceSales = {}, brand = {}, creater = {};
    var totals = { income: 0, salesAmount: 0, cost: 0, discount: 0, payable: 0, relief: 0, service: 0, settlementProfit: 0, companyProfit: 0 };
    var idx = 0;
    if (!bsid) { $('#report').html('<p style="text-align:center;">缺少结算单信息</p>'); return; }
    app.post(api.balance.queryBalanceSalesByBsid, { 'balanceSales.bsid': bsid }, function (res) {
        balanceSales = res.balanceSales || {}; brand = balanceSales.brand || {}; creater = balanceSales.creater || {};
        loadPage(1);
    });

    function loadPage(page) {
        app.post(api.balance.pageBalanceSalesBalance, { 'paging.page': page, 'paging.rows': 50, 'balanceSalesBalance.bsid': bsid }, function (res) {
            var data = (res.paging && res.paging.data) || [];
            if (page == 1) {
                if (ptype == 2) renderProfitHeader();
                else renderDetailHeader();
            }
            $.each(data, function (i, v) { ptype == 2 ? renderProfitLine(v) : renderDetailLine(v); });
            if (page < (res.paging && res.paging.totalPage || 1)) loadPage(page + 1);
            else { ptype == 2 ? renderProfitFooter() : renderDetailFooter(); }
        });
    }

    // 计算单笔销售金额/应付账款等（与老版 calcSalesBalance 对齐）
    function calc(v) {
        var oneType = v.salesBalance.onetype, type = v.salesBalance.type;
        var salesRevenue = 0, salesAmount = 0, accountsPayable = 0;
        var venderMaling = (v.salesBalance && v.salesBalance.sales && v.salesBalance.sales.venderMaling) ? Math.round(v.salesBalance.sales.venderMaling) : 0;
        var allowance = (v.salesBalance && v.salesBalance.allowance) ? v.salesBalance.allowance : 0;
        if (oneType == 0) {
            if (type == 3) { venderMaling = 0; allowance = 0; salesRevenue = v.salesBalance.sales.depositpay; salesAmount = app.utils.accAdd(salesRevenue, app.utils.accAdd(venderMaling, allowance)); accountsPayable = app.utils.accSub(v.salesBalance.pbalance, venderMaling); }
            else { salesRevenue = app.utils.accAdd(v.salesBalance.sales.depositpay, v.salesBalance.sales.fullpay); salesAmount = app.utils.accAdd(salesRevenue, app.utils.accAdd(venderMaling, allowance)); accountsPayable = app.utils.accSub(v.salesBalance.pbalance, venderMaling); }
        } else if (oneType == 1) {
            venderMaling = 0; salesRevenue = v.salesBalance.total; salesAmount = app.utils.accAdd(v.salesBalance.total, allowance); accountsPayable = v.salesBalance.pbalance; venderMaling = -venderMaling;
        } else if (oneType == 2 || oneType == 3) {
            salesRevenue = v.salesBalance.total; salesAmount = app.utils.accAdd(app.utils.accSub(v.salesBalance.total, venderMaling), allowance); accountsPayable = app.utils.accAdd(v.salesBalance.pbalance, venderMaling); venderMaling = -venderMaling;
        }
        var rate = v.salesBalance.rate || 1;
        return {
            venderMaling: app.utils.changeThrDecimal(venderMaling),
            allowance: app.utils.changeThrDecimal(app.utils.accMul(allowance, rate)),
            salesRevenue: app.utils.changeThrDecimal(app.utils.accMul(salesRevenue, rate)),
            salesAmount: app.utils.changeThrDecimal(app.utils.accMul(salesAmount, rate)),
            accountsPayable: app.utils.changeThrDecimal(app.utils.accMul(accountsPayable, rate)),
            pbalance: v.salesBalance.pbalance
        };
    }

    function renderDetailHeader() {
        var h = '<center><table style="width:90%;border-collapse:collapse;" border="1" cellpadding="0" cellspacing="0">'
            + '<caption style="line-height:50px;font-size:20px;font-weight:bold;">供应商对账单<\/caption>'
            + '<tr><td colspan="3" style="text-align:left;font-size:12px;">供应商名称：' + (brand.name || '') + '<\/td><td colspan="3" style="text-align:left;font-size:12px;">负责对账员：' + (creater.userName || '') + '<\/td><td colspan="3" style="text-align:left;font-size:12px;">单号：' + (balanceSales.name || '') + '<\/td><td colspan="3" style="text-align:left;font-size:12px;">公司名称：' + (company.fullname || '') + '<\/td><\/tr>'
            + '<tr style="text-align:center;font-weight:bold;"><td>序号<\/td><td>收入日期<\/td><td>供应商名称<\/td><td>装修单号<\/td><td>楼盘地址<\/td><td>销售收入<\/td><td>销售金额<\/td><td>销售成本<\/td><td>厂商抹零<\/td><td>应付账款<\/td><td>服务费<\/td><td>备注<\/td><\/tr>';
        $('#report').html(h);
    }
    function renderDetailLine(v) {
        var c = calc(v); idx++;
        totals.income = app.utils.accAdd(totals.income, c.salesRevenue);
        totals.salesAmount = app.utils.accAdd(totals.salesAmount, c.salesAmount);
        totals.cost = app.utils.accAdd(totals.cost, c.pbalance);
        totals.discount = app.utils.accAdd(totals.discount, c.allowance);
        totals.payable = app.utils.accAdd(totals.payable, c.accountsPayable);
        totals.relief = app.utils.accAdd(totals.relief, c.venderMaling);
        totals.service = app.utils.accAdd(totals.service, app.utils.accSub(c.salesRevenue, c.accountsPayable));
        var addr = (v.salesBalance.sales.house && v.salesBalance.sales.house.village ? v.salesBalance.sales.house.village.name : '') + ' ' + (v.salesBalance.sales.house ? v.salesBalance.sales.house.houseNumber : '');
        var row = '<tr style="text-align:center;font-size:11px;"><td>' + idx + '<\/td><td>' + (v.salesBalance.createTime || '') + '<\/td><td>' + (brand.name || '') + '<\/td><td>' + (v.salesBalance.sales.orderId || '') + '<\/td><td>' + addr + '<\/td><td>' + app.formatMoney(c.salesRevenue) + '<\/td><td>' + app.formatMoney(c.salesAmount) + '<\/td><td>' + app.formatMoney(c.pbalance) + '<\/td><td>' + app.formatMoney(c.venderMaling) + '<\/td><td>' + app.formatMoney(c.accountsPayable) + '<\/td><td>' + app.formatMoney(app.utils.accSub(c.salesRevenue, c.accountsPayable)) + '<\/td><td>' + (v.salesBalance.comment || '') + '<\/td><\/tr>';
        $('#report').append(row);
    }
    function renderDetailFooter() {
        $('#report').append('<tr style="text-align:center;font-weight:bold;font-size:11px;"><td><\/td><td>合计<\/td><td><\/td><td><\/td><td><\/td><td>' + app.formatMoney(totals.income) + '<\/td><td>' + app.formatMoney(totals.salesAmount) + '<\/td><td>' + app.formatMoney(totals.cost) + '<\/td><td>' + app.formatMoney(totals.relief) + '<\/td><td>' + app.formatMoney(totals.payable) + '<\/td><td>' + app.formatMoney(totals.service) + '<\/td><td><\/td><\/tr>');
        $('#report').append('<\/table><\/center>');
    }

    function renderProfitHeader() {
        var h = '<center><table style="width:90%;border-collapse:collapse;" border="1" cellpadding="0" cellspacing="0">'
            + '<caption style="line-height:50px;font-size:20px;font-weight:bold;">' + (company.fullname || '') + '主材销售分析明细表<\/caption>'
            + '<tr><td colspan="4" style="text-align:left;font-size:12px;">供应商名称: ' + (brand.name || '') + '<\/td><td colspan="4" style="text-align:left;font-size:12px;">单号: ' + (balanceSales.name || '') + '<\/td><td colspan="4" style="text-align:left;font-size:12px;">制表: ' + (creater.userName || '') + '<\/td><td colspan="5" style="text-align:left;font-size:12px;">单位: 人民币元<\/td><\/tr>'
            + '<tr style="text-align:center;font-weight:bold;"><td rowspan="2">序号<\/td><td rowspan="2">销售日期<\/td><td rowspan="2">装修单号<\/td><td rowspan="2">楼盘地址<\/td><td rowspan="2">销售收入<\/td><td rowspan="2">供应商减免<\/td><td colspan="2">主材打折<\/td><td rowspan="2">销售金额<\/td><td colspan="2">销售成本<\/td><td rowspan="2">应付账款<\/td><td rowspan="2">结算利润<\/td><td rowspan="2">结利占比<\/td><td rowspan="2">公司利润<\/td><td rowspan="2">公利占比<\/td><td rowspan="2">备注<\/td><\/tr>'
            + '<tr style="text-align:center;font-weight:bold;"><td>金额<\/td><td>占比<\/td><td>金额<\/td><td>占比<\/td><\/tr>';
        $('#report').html(h);
    }
    function renderProfitLine(v) {
        var c = calc(v); idx++;
        totals.income = app.utils.accAdd(totals.income, c.salesRevenue);
        totals.relief = app.utils.accAdd(totals.relief, c.venderMaling);
        totals.discount = app.utils.accAdd(totals.discount, c.allowance);
        totals.salesAmount = app.utils.accAdd(totals.salesAmount, c.salesAmount);
        totals.cost = app.utils.accAdd(totals.cost, c.pbalance);
        totals.payable = app.utils.accAdd(totals.payable, c.accountsPayable);
        var settlementProfit = app.utils.accSub(c.salesAmount, c.pbalance);
        var companyProfit = app.utils.accSub(c.salesRevenue, c.accountsPayable);
        totals.settlementProfit = app.utils.accAdd(totals.settlementProfit, settlementProfit);
        totals.companyProfit = app.utils.accAdd(totals.companyProfit, companyProfit);
        var addr = (v.salesBalance.sales.house && v.salesBalance.sales.house.village ? v.salesBalance.sales.house.village.name : '') + ' ' + (v.salesBalance.sales.house ? v.salesBalance.sales.house.houseNumber : '');
        var allowPct = c.salesAmount == 0 ? '0%' : (app.utils.changeTwoDecimal(app.utils.accMul(app.utils.accSub(1, app.utils.accDiv(c.allowance, c.salesAmount)), 100)) + '%');
        var costPct = c.salesAmount == 0 ? '0%' : (app.utils.changeTwoDecimal(app.utils.accMul(app.utils.accDiv(c.pbalance, c.salesAmount), 100)) + '%');
        var settlementPct = c.salesAmount == 0 ? '0%' : (app.utils.changeTwoDecimal(app.utils.accMul(app.utils.accDiv(settlementProfit, c.salesAmount), 100)) + '%');
        var companyPct = (app.utils.accAdd(c.salesRevenue, c.venderMaling)) == 0 ? '0%' : (app.utils.changeTwoDecimal(app.utils.accMul(app.utils.accDiv(companyProfit, app.utils.accAdd(c.salesRevenue, c.venderMaling)), 100)) + '%');
        var row = '<tr style="text-align:center;font-size:10px;"><td>' + idx + '<\/td><td>' + (v.salesBalance.createTime || '') + '<\/td><td>' + (v.salesBalance.sales.orderId || '') + '<\/td><td>' + addr + '<\/td><td>' + app.formatMoney(c.salesRevenue) + '<\/td><td>' + app.formatMoney(c.venderMaling) + '<\/td><td>' + app.formatMoney(c.allowance) + '<\/td><td>' + allowPct + '<\/td><td>' + app.formatMoney(c.salesAmount) + '<\/td><td>' + app.formatMoney(c.pbalance) + '<\/td><td>' + costPct + '<\/td><td>' + app.formatMoney(c.accountsPayable) + '<\/td><td>' + app.formatMoney(settlementProfit) + '<\/td><td>' + settlementPct + '<\/td><td>' + app.formatMoney(companyProfit) + '<\/td><td>' + companyPct + '<\/td><td>' + (v.salesBalance.comment || '') + '<\/td><\/tr>';
        $('#report').append(row);
    }
    function renderProfitFooter() {
        var allowPct = totals.salesAmount == 0 ? '0%' : (app.utils.changeTwoDecimal(app.utils.accMul(app.utils.accSub(1, app.utils.accDiv(totals.discount, totals.salesAmount)), 100)) + '%');
        var costPct = totals.salesAmount == 0 ? '0%' : (app.utils.changeTwoDecimal(app.utils.accMul(app.utils.accDiv(totals.cost, totals.salesAmount), 100)) + '%');
        var settlementPct = totals.salesAmount == 0 ? '0%' : (app.utils.changeTwoDecimal(app.utils.accMul(app.utils.accDiv(totals.settlementProfit, totals.salesAmount), 100)) + '%');
        var companyPct = (app.utils.accAdd(totals.income, totals.relief)) == 0 ? '0%' : (app.utils.changeTwoDecimal(app.utils.accMul(app.utils.accDiv(totals.companyProfit, app.utils.accAdd(totals.income, totals.relief)), 100)) + '%');
        $('#report').append('<tr style="text-align:center;font-weight:bold;font-size:11px;"><td><\/td><td>合计<\/td><td><\/td><td><\/td><td>' + app.formatMoney(totals.income) + '<\/td><td>' + app.formatMoney(totals.relief) + '<\/td><td>' + app.formatMoney(totals.discount) + '<\/td><td>' + allowPct + '<\/td><td>' + app.formatMoney(totals.salesAmount) + '<\/td><td>' + app.formatMoney(totals.cost) + '<\/td><td>' + costPct + '<\/td><td>' + app.formatMoney(totals.payable) + '<\/td><td>' + app.formatMoney(totals.settlementProfit) + '<\/td><td>' + settlementPct + '<\/td><td>' + app.formatMoney(totals.companyProfit) + '<\/td><td>' + companyPct + '<\/td><td><\/td><\/tr>');
        $('#report').append('<\/table><\/center>');
    }

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
