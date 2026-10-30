/** app/js/balance/balance.js —— 结算单（主页）
 * balance.type: 1应付款/2应收款；balance.status: 0初始/1结算/2付款；balance.isPay: 0未付款/1已付款。
 * 行操作：出纳(pay)→balance2account / 结算(balance)→balance2balance（或弹窗内填两账户）/ 结算明细/扣款/分摊。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, selectList: [], addIndex: null, balanceIndex: null, curBalance: null };
    var TYPE = { 1: '应付款', 2: '应收款' };
    var STATUS = { 0: '初始', 1: '结算', 2: '付款' };
    var ISPAY = { 0: '未付款', 1: '已付款' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'no', title: '结算单号', width: 160 },
                { field: 'belonger', title: '归属人', width: 100, templet: function (d) { return (d.belonger && d.belonger.userName) || '-'; } },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return (d.creater && d.creater.userName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'balancer', title: '结算人', width: 100, templet: function (d) { return (d.balancer && d.balancer.userName) || '-'; } },
                { field: 'balanceTime', title: '结算时间', width: 170 },
                { field: 'payeder', title: '付款人', width: 100, templet: function (d) { return (d.payeder && d.payeder.userName) || '-'; } },
                { field: 'payedTime', title: '付款时间', width: 170 },
                { field: 'amount', title: '金额', width: 110, templet: function (d) { return app.formatMoney(d.amount); } },
                { field: 'cutpay', title: '扣款总额', width: 110, templet: function (d) { return app.formatMoney(d.cutpay); } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status >= 2 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-blue' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'isPay', title: '付款标识', width: 90, templet: function (d) { var s = ISPAY[d.isPay] != null ? ISPAY[d.isPay] : '-'; var c = d.isPay == 1 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { title: '操作', width: 460, toolbar: '#rowToolbar' } ]] });
        table.on('checkbox(resultTable)', function (obj) {
            var bid = String(obj.data.bid);
            if (obj.checked) { if (state.selectList.indexOf(bid) == -1) state.selectList.push(bid); }
            else { var i = state.selectList.indexOf(bid); if (i != -1) state.selectList.splice(i, 1); }
        });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'pay') goAccount(v);
            else if (ev === 'balance') goBalance(v);
            else if (ev === 'detail') goDetail(v);
            else if (ev === 'cutpay') goCutpay(v);
            else if (ev === 'apport') goApport(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; var n = $(this).attr('name'); p['filters[' + c + '].field'] = n; p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'eq'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        state.selectList = [];
        app.post(api.balance.pageBalance, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function goAccount(v) {
        app.params.balance = { bid: v.bid, uid: v.belonger ? v.belonger.uid : null, surplus: v.surplus };
        app.popup(api.index.balance2accountIndex.url, '出纳 - ' + v.no, null, { area: ['90%', '70%'], end: function () { query(state.page); } });
    }
    function goBalance(v) {
        app.params.balance = { bid: v.bid, uid: v.belonger ? v.belonger.uid : null, surplus: v.surplus, no: v.no };
        app.popup(api.index.balance2balanceIndex.url, '结算 - ' + v.no, null, { area: ['90%', '70%'], end: function () { query(state.page); } });
    }
    function goDetail(v) {
        app.params.balance = { bid: v.bid };
        app.popup(api.index.balanceDetailIndex.url, '结算明细 - ' + v.no, null, { area: ['80%', '70%'] });
    }
    function goCutpay(v) {
        app.params.balance = { bid: v.bid, uid: v.belonger ? v.belonger.uid : null, balance: v };
        app.popup(api.index.balanceCutpayIndex.url + '?depage=balance', '结算扣款 - ' + v.no, null, { area: ['95%', '85%'], end: function () { query(state.page); } });
    }
    function goApport(v) {
        app.params.balance = { bid: v.bid };
        app.popup(api.index.balanceApportIndex.url, '分摊明细 - ' + v.no, null, { area: ['80%', '70%'] });
    }

    function openAdd() {
        app.clearValidator();
        $('#addForm')[0].reset();
        $('#addForm [name="belongerUserId"]').val('');
        state.addIndex = layer.open({ type: 1, title: '新增结算单', content: $('#addBox'), area: ['480px', 'auto'] });
    }
    function doAdd() {
        if (app.validate('addForm')) return;
        if (!$('#addForm [name="belongerUserId"]').val()) { app.showAlert(app.warning, '请选择归属人'); return; }
        app.post(api.balance.addBalance, {
            'balance.belonger.userId': $('#addForm [name="belongerUserId"]').val(),
            'balance.amount': $('#addForm [name="amount"]').val(),
            'balance.type': $('#addForm [name="type"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.addIndex); state.addIndex = null; query(state.page); });
    }

    function doPayed() {
        if (state.selectList.length == 0) { app.showAlert(app.warning, '请选择需要进行付款的结算单'); return; }
        var opt = {};
        $.each(state.selectList, function (i, bid) { opt['balances[' + i + '].bid'] = bid; });
        app.post(api.balance.payedBalance, opt, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }

    // 归属人拼音搜索（简化版：输入 userId 直接填）
    $('#belongerName').on('input', function () {
        var kw = $.trim($(this).val());
        if (/^\d+$/.test(kw)) { $('#addForm [name="belongerUserId"]').val(kw); }
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnAddConfirm').on('click', doAdd);
    $('#btnAddCancel').on('click', function () { layer.close(state.addIndex); state.addIndex = null; });
    $('#btnPayed').on('click', doPayed);
    $('#btnBalanceConfirm').on('click', doBalance);
    $('#btnBalanceCancel').on('click', function () { layer.close(state.balanceIndex); state.balanceIndex = null; });

    function doBalance() {
        if (app.validate('balanceForm')) return;
        var baid0 = $('#bccount').val(), baid1 = $('#cccount').val();
        if (!baid0 || !baid1) { app.showAlert(app.warning, '请选择账户'); return; }
        var opt = {
            'balance.bid': state.curBalance.bid,
            'balanceAccountes[0].money': state.curBalance.surplus,
            'balanceAccountes[0].baid': baid0,
            'balanceAccountes[1].money': state.curBalance.surplus,
            'balanceAccountes[1].baid': baid1
        };
        app.post(api.balance.balanceBalance, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.balanceIndex); state.balanceIndex = null; query(state.page); });
    }
});
}); // end app.ready
