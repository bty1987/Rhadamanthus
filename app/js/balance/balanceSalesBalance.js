/** app/js/balance/balanceSalesBalance.js —— 结算销售明细（弹窗子页）
 * 上下文：app.params.balance.bsid
 * 销售/退货/全退/退单的 onetype/type 不同算法（calcSalesBalance）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var bsid = (app.params.balance && app.params.balance.bsid) || '';
    var state = { page: 1, rows: 10, total: 0 };
    var balanceSales = {};
    var STATUS_INIT = 0;
    var TYPE = { 0: '定金', 1: '补款', 2: '全款', 3: '定金退', 4: '退款', 5: '全退', 6: '退货单', 7: '补款退', 8: '其他' };
    var ONETYPE = { 0: '销售', 1: '退货', 2: '全退', 3: '退单' };
    var SBSTATUS = { 0: '初始', 1: '结算' };
    if (bsid) {
        app.post(api.balance.queryBalanceSalesByBsid, { 'balanceSales.bsid': bsid }, function (res) { balanceSales = res.balanceSales || {}; });
    }
    initTable(); query(1);

    function calc(v) {
        var oneType = v.salesBalance.onetype, type = v.salesBalance.type;
        var salesRevenue = 0, salesAmount = 0, accountsPayable = 0;
        var venderMaling = (v.salesBalance && v.salesBalance.sales && v.salesBalance.sales.venderMaling) ? Math.round(v.salesBalance.sales.venderMaling) : 0;
        var allowance = (v.salesBalance && v.salesBalance.allowance) ? v.salesBalance.allowance : 0;
        if (oneType == 0) {
            if (type == 0) { venderMaling = 0; allowance = 0; salesRevenue = v.salesBalance.sales.depositpay; salesAmount = app.utils.accAdd(salesRevenue, app.utils.accAdd(venderMaling, allowance)); accountsPayable = app.utils.accSub(v.salesBalance.pbalance, venderMaling); }
            else { salesRevenue = app.utils.accAdd(v.salesBalance.sales.depositpay, v.salesBalance.sales.fullpay); salesAmount = app.utils.accAdd(salesRevenue, app.utils.accAdd(venderMaling, allowance)); accountsPayable = app.utils.accSub(v.salesBalance.pbalance, venderMaling); }
        } else if (oneType == 1) {
            venderMaling = 0; salesRevenue = v.salesBalance.total; salesAmount = app.utils.accAdd(v.salesBalance.total, allowance); accountsPayable = v.salesBalance.pbalance; venderMaling = -venderMaling;
        } else if (oneType == 2 || oneType == 3) {
            salesRevenue = v.salesBalance.total; salesAmount = app.utils.accAdd(app.utils.accSub(v.salesBalance.total, venderMaling), allowance); accountsPayable = app.utils.accAdd(v.salesBalance.pbalance, venderMaling); venderMaling = -venderMaling;
        }
        return { venderMaling: venderMaling, allowance: allowance, salesRevenue: salesRevenue, salesAmount: salesAmount, accountsPayable: accountsPayable };
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'salesBalance.sales.no', title: '销售单号', width: 140, templet: function (d) { return (d.salesBalance && d.salesBalance.sales && d.salesBalance.sales.no) || '-'; } },
                { field: 'orderId', title: '装修单号', width: 140, templet: function (d) { return (d.salesBalance && d.salesBalance.sales && d.salesBalance.sales.orderId) || '-'; } },
                { field: 'address', title: '楼盘地址', width: 200, templet: function (d) { var s = d.salesBalance && d.salesBalance.sales; return s && s.house ? ((s.house.village ? s.house.village.name : '') + ' ' + (s.house.houseNumber || '')) : '-'; } },
                { field: 'category', title: '品类', width: 110, templet: function (d) { return (d.salesBalance && d.salesBalance.sales && d.salesBalance.sales.category) || '-'; } },
                { field: 'brand', title: '品牌', width: 130, templet: function (d) { return (d.salesBalance && d.salesBalance.sales && d.salesBalance.sales.brand && d.salesBalance.sales.brand.name) || '-'; } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[(d.salesBalance && d.salesBalance.type) != null ? d.salesBalance.type : -1] || '-'; } },
                { field: 'pbalance', title: '结算值', width: 110, templet: function (d) { return app.formatMoney(d.salesBalance && d.salesBalance.pbalance); } },
                { field: 'onetype', title: '一类', width: 80, templet: function (d) { return ONETYPE[(d.salesBalance && d.salesBalance.onetype) != null ? d.salesBalance.onetype : -1] || '-'; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return SBSTATUS[(d.salesBalance && d.salesBalance.status) != null ? d.salesBalance.status : -1] || '-'; } },
                { field: 'venderMaling', title: '供应商减免', width: 110, templet: function (d) { return app.formatMoney(calc(d).venderMaling); } },
                { field: 'allowance', title: '折扣/抹零', width: 110, templet: function (d) { return app.formatMoney(calc(d).allowance); } },
                { field: 'salesRevenue', title: '销售收入', width: 110, templet: function (d) { return app.formatMoney(calc(d).salesRevenue); } },
                { field: 'salesAmount', title: '销售金额', width: 110, templet: function (d) { return app.formatMoney(calc(d).salesAmount); } },
                { field: 'pbalanceCost', title: '销售成本', width: 110, templet: function (d) { return app.formatMoney(d.salesBalance && d.salesBalance.pbalance); } },
                { field: 'accountsPayable', title: '应付账款', width: 110, templet: function (d) { return app.formatMoney(calc(d).accountsPayable); } },
                { field: 'settlementProfit', title: '结算利润', width: 110, templet: function (d) { var c = calc(d); return app.formatMoney(app.utils.accSub(c.salesAmount, d.salesBalance.pbalance)); } },
                { field: 'corporateProfits', title: '公司利润', width: 110, templet: function (d) { var c = calc(d); return app.formatMoney(app.utils.accSub(c.salesRevenue, c.accountsPayable)); } },
                { field: 'createTime', title: '收款时间', width: 170, templet: function (d) { return (d.salesBalance && d.salesBalance.createTime) || '-'; } } ]] });
    }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.balance.pageBalanceSalesBalance, { 'balanceSalesBalance.bsid': bsid, 'paging.page': state.page, 'paging.rows': state.rows }, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function doUnbindRow(v) {
        if (balanceSales.status != STATUS_INIT) return;
        app.showConfirm('确定解除绑定？', function () {
            var c = calc(v);
            app.post(api.balance.unbindBalanceSales, {
                'balanceSales.bsid': bsid,
                'balanceSales.income': app.utils.accSub(balanceSales.income, c.salesRevenue),
                'balanceSales.cost': app.utils.accSub(balanceSales.cost, v.salesBalance.pbalance),
                'balanceSales.payment': app.utils.accSub(balanceSales.payment, c.accountsPayable),
                'balanceSales.profit': app.utils.accSub(balanceSales.profit, app.utils.accSub(c.salesRevenue, c.accountsPayable)),
                'balanceSalesBalances[0].bsbid': v.bsbid
            }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
    function doUnbindBatch() {
        if (balanceSales.status != STATUS_INIT) { app.showAlert(app.warning, '当前状态不可解绑'); return; }
        var checks = table.checkStatus('resultTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请选择需要解绑数据'); return; }
        var opt = { 'balanceSales.bsid': bsid, 'balanceSales.income': balanceSales.income, 'balanceSales.cost': 0, 'balanceSales.payment': 0, 'balanceSales.profit': balanceSales.profit };
        $.each(checks, function (i, v) { opt['balanceSalesBalances[' + i + '].bsbid'] = v.bsbid; });
        app.post(api.balance.unbindBalanceSales, opt, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }
    function doPrint(type) {
        app.params.balance = { bsid: bsid, type: type };
        app.popup(api.index.balanceSales2print.url, type == 1 ? '明细表' : '利润表', null, { area: ['95%', '85%'] });
    }
    function doCheckAll() { $('.layui-table-tool [lay-filter="layTableAllChoose"]').click(); }
    function doExport() {
        if (state.total > 2000) { app.showAlert(app.warning, '查询结果大于阀值，不能完成导出动作'); return; }
        app.post(api.balance.pageBalanceSalesBalance, { 'balanceSalesBalance.bsid': bsid, 'paging.page': 1, 'paging.rows': 2000, 'paging.noPage': 1 }, function (res) {
            var rows = (res.paging && res.paging.data) || [];
            $.each(rows, function (i, v) {
                var c = calc(v);
                v.venderMaling = c.venderMaling; v.allowance = c.allowance;
                v.salesRevenue = c.salesRevenue; v.salesAmount = c.salesAmount; v.accountsPayable = c.accountsPayable;
                v.settlementProfit = app.utils.accSub(c.salesAmount, v.salesBalance.pbalance);
                v.corporateProfits = app.utils.accSub(c.salesRevenue, c.accountsPayable);
            });
            app.exporter && app.exporter(rows, '结算销售明细');
        });
    }

    $('#btnDetailPrint').on('click', function () { doPrint(1); });
    $('#btnProfitPrint').on('click', function () { doPrint(2); });
    $('#btnExport').on('click', doExport);
    $('#btnCheckAll').on('click', doCheckAll);
    $('#btnUnbind').on('click', doUnbindBatch);
});
}); // end app.ready
