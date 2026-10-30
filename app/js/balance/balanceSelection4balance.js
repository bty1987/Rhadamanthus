/** app/js/balance/balanceSelection4balance.js —— 结算选材单→结算/付款工作台
 * 查 status=3 的结算选材单。行操作：结算/付款/结算选材/结算扣款。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, balanceIndex: null, curBalance: null };
    var STATUS_ENABLE_CHECK = 3;
    var ISPAY_NOTPAY = 0;
    var TYPE = { 1: '应付款', 2: '应收款' };
    var STATUS = { 0: '初始', 1: '结算', 2: '付款' };
    var SALE_STATUS = { 0: '初始', 1: '锁定', 2: '待审', 3: '审核' };
    initTable(); query(1);
    app.post(api.balance.queryBalanceAccountForTeller, {}, function (res) {
        app.bindData($('#balanceForm [name="cccount"]'), res.balanceAccountes || [], 'baid', 'name');
        form.render('select');
    });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'balance', title: '结算单号', width: 140, templet: function (d) { return (d.balance && d.balance.no != '0000000000') ? d.balance.no : '-'; } },
                { field: 'balance.belonger', title: '归属人', width: 100, templet: function (d) { return (d.balance && d.balance.belonger && d.balance.belonger.userName) || '-'; } },
                { field: 'balance.creater', title: '创建人', width: 100, templet: function (d) { return (d.balance && d.balance.creater && d.balance.creater.userName) || '-'; } },
                { field: 'balance.createTime', title: '创建时间', width: 170, templet: function (d) { return (d.balance && d.balance.createTime) || '-'; } },
                { field: 'balance.amount', title: '金额', width: 110, templet: function (d) { return app.formatMoney(d.balance && d.balance.amount); } },
                { field: 'balance.cutpay', title: '扣款总额', width: 110, templet: function (d) { return app.formatMoney(d.balance && d.balance.cutpay); } },
                { field: 'balance.type', title: '类型', width: 90, templet: function (d) { return (d.balance && TYPE[d.balance.type] != null) ? TYPE[d.balance.type] : '-'; } },
                { field: 'balance.status', title: '状态', width: 90, templet: function (d) { var s = d.balance && STATUS[d.balance.status] != null ? STATUS[d.balance.status] : '-'; var c = d.balance && d.balance.status >= 2 ? 'layui-bg-green' : d.balance && d.balance.status == 1 ? 'layui-bg-blue' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'balance.isPay', title: '付款标识', width: 90, templet: function (d) { var ip = d.balance ? d.balance.isPay : null; var s = ip == 0 ? '未付款' : ip == 1 ? '已付款' : '-'; var c = ip == 1 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'brand', title: '品牌', width: 130, templet: function (d) { return (d.brand && d.brand.name) || '-'; } },
                { field: 'saleStatus', title: '选材单状态', width: 100, templet: function (d) { return SALE_STATUS[d.status] != null ? SALE_STATUS[d.status] : '-'; } },
                { field: 'grade', title: '等级', width: 80 },
                { field: 'income', title: '收入', width: 110, templet: function (d) { return app.formatMoney(d.income); } },
                { field: 'payment', title: '应付', width: 110, templet: function (d) { return app.formatMoney(d.payment); } },
                { field: 'profit', title: '利润', width: 110, templet: function (d) { return app.formatMoney(d.profit); } },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return (d.creater && d.creater.userName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'balancer', title: '结算人', width: 100, templet: function (d) { return (d.balancer && d.balancer.userName) || '-'; } },
                { field: 'balanceTime', title: '结算时间', width: 170 },
                { field: 'payeder', title: '付款人', width: 100, templet: function (d) { return (d.balance && d.balance.payeder && d.balance.payeder.userName) || '-'; } },
                { field: 'payedTime', title: '付款时间', width: 170, templet: function (d) { return (d.balance && d.balance.payedTime) || '-'; } },
                { title: '操作', width: 380, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'balance') openBalance(v);
            else if (ev === 'payed') doPayed(v);
            else if (ev === 'selection') goSelection(v);
            else if (ev === 'cutpay') goCutpay(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.balance.pageBalanceSelectionForBalance, $.extend({}, bF(), { 'balanceSelection.status': STATUS_ENABLE_CHECK, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openBalance(v) {
        if (!v.balance || !v.balance.belonger) { app.showAlert(app.warning, '缺少归属人信息'); return; }
        state.curBalance = v.balance;
        app.clearValidator();
        app.post(api.balance.queryBalanceAccount, { 'balanceAccount.belonger.uid': v.balance.belonger.uid }, function (res) {
            app.bindData($('#balanceForm [name="bccount"]'), res.balanceAccountes || [], 'baid', 'name');
            form.render('select');
            state.balanceIndex = layer.open({ type: 1, title: '结算 - ' + (v.balance.no || ''), content: $('#balanceBox'), area: ['480px', 'auto'] });
        });
    }
    function doBalance() {
        if (app.validate('balanceForm')) return;
        var opt = {
            'balance.bid': state.curBalance.bid,
            'balanceAccountes[0].money': state.curBalance.surplus,
            'balanceAccountes[0].baid': $('#balanceForm [name="bccount"]').val(),
            'balanceAccountes[1].money': state.curBalance.surplus,
            'balanceAccountes[1].baid': $('#balanceForm [name="cccount"]').val()
        };
        app.post(api.balance.balanceBalance, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.balanceIndex); state.balanceIndex = null; query(state.page); });
    }

    function doPayed(v) {
        if (!(v.balance && v.balance.isPay == ISPAY_NOTPAY && v.balance.bid != 0)) return;
        app.post(api.balance.payedBalance, { 'balances[0].bid': v.balance.bid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }
    function doPayedBatch() {
        var checks = table.checkStatus('resultTable').data;
        var bids = [];
        $.each(checks, function (i, v) { if (v.balance && v.balance.isPay == ISPAY_NOTPAY && v.balance.bid != 0) bids.push(v.balance.bid); });
        if (!bids.length) { app.showAlert(app.warning, '请选择需要进行付款的结算单'); return; }
        var opt = {};
        $.each(bids, function (i, bid) { opt['balances[' + i + '].bid'] = bid; });
        app.post(api.balance.payedBalance, opt, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }
    function doCheckAll() { $('.layui-table-tool [lay-filter="layTableAllChoose"]').click(); }
    function goSelection(v) {
        app.params.balance = { bid: v.balance ? v.balance.bid : null };
        app.popup(api.index.balanceSelectionIndex.url, '选材单', null, { area: ['95%', '85%'], end: function () { query(state.page); } });
    }
    function goCutpay(v) {
        if (!(v.balance && v.balance.belonger && v.balance.belonger.uid)) return;
        app.params.balance = { bid: v.balance.bid, uid: v.balance.belonger.uid, balance: v.balance };
        app.popup(api.index.balanceCutpayIndex.url + '?depage=balance', '结算扣款', null, { area: ['95%', '85%'], end: function () { query(state.page); } });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnCheckAll').on('click', doCheckAll);
    $('#btnPayed').on('click', doPayedBatch);
    $('#btnBalanceConfirm').on('click', doBalance);
    $('#btnBalanceCancel').on('click', function () { layer.close(state.balanceIndex); state.balanceIndex = null; });
});
}); // end app.ready
