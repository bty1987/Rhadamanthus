/** app/js/balance/balanceAccount.js —— 结算账户
 * balanceAccount.type: 0结算/1出纳；balanceAccount.status: 0启用/1禁用。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, addIndex: null, addrIndex: null, withdrawIndex: null };
    var TYPE = { 0: '结算', 1: '出纳' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', width: 160 },
                { field: 'address', title: '地址', width: 200 },
                { field: 'phone', title: '电话', width: 130 },
                { field: 'bank', title: '银行', width: 140 },
                { field: 'bankno', title: '卡号', width: 180 },
                { field: 'belonger', title: '归属人', width: 100, templet: function (d) { return (d.belonger && d.belonger.currentName) || '-'; } },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'referMoney', title: '应付额', width: 110, templet: function (d) { return app.formatMoney(d.referMoney); } },
                { field: 'realMoney', title: '实付额', width: 110, templet: function (d) { return app.formatMoney(d.realMoney); } },
                { field: 'surplus', title: '余额', width: 110, templet: function (d) { return app.formatMoney(d.surplus); } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = d.status == 0 ? '启用' : '禁用'; var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { title: '操作', width: 180, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'status') doStatus(v);
            else if (ev === 'withdraw') openWithdraw(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'eq'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.balance.pageBalanceAccount, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openAdd() { app.clearValidator(); $('#addForm')[0].reset(); state.addIndex = layer.open({ type: 1, title: '添加账户', content: $('#addBox'), area: ['480px', 'auto'] }); }
    function doAdd() {
        if (app.validate('addForm')) return;
        app.post(api.balance.addBalanceAccount, {
            'balanceAccount.belonger.userId': $('#addForm [name="belonger"]').val(),
            'balanceAccount.name': $('#addForm [name="name"]').val(),
            'balanceAccount.type': $('#addForm [name="type"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.addIndex); state.addIndex = null; query(state.page); });
    }

    function openAddr(type) { app.clearValidator(); $('#addrForm')[0].reset(); $('#addrForm [name="atype"]').val(type); state.addrIndex = layer.open({ type: 1, title: type == 0 ? '添加结算账户' : '添加出纳账户', content: $('#addrBox'), area: ['500px', 'auto'] }); }
    function doAddr() {
        if (app.validate('addrForm')) return;
        var atype = $('#addrForm [name="atype"]').val();
        app.post(api.balance.addBalanceAccount, {
            'balanceAccount.belonger.userId': $('#addrForm [name="belonger"]').val(),
            'balanceAccount.name': $('#addrForm [name="name"]').val(),
            'balanceAccount.type': atype,
            'balanceAccount.phone': $('#addrForm [name="phone"]').val(),
            'balanceAccount.address': $('#addrForm [name="address"]').val(),
            'balanceAccount.bank': $('#addrForm [name="bank"]').val(),
            'balanceAccount.bankno': $('#addrForm [name="bankno"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.addrIndex); state.addrIndex = null; query(state.page); });
    }

    function doStatus(v) {
        var ns = v.status == 0 ? 1 : 0;
        app.post(api.balance.updateBalanceAccountForStatus, { 'balanceAccount.baid': v.baid, 'balanceAccount.status': ns }, function () {
            app.showAlert(app.success, ns == 0 ? '已启用' : '已禁用'); query(state.page);
        });
    }

    function openWithdraw(v) {
        app.clearValidator();
        $('#withdrawForm [name="baid"]').val(v.baid);
        $('#withdrawForm [name="money"]').val('');
        state.withdrawIndex = layer.open({ type: 1, title: '提款 - ' + v.name, content: $('#withdrawBox'), area: ['480px', 'auto'] });
    }
    function doWithdraw() {
        if (app.validate('withdrawForm')) return;
        app.post(api.balance.withdrawBalanceAccount, {
            'balanceAccount.baid': $('#withdrawForm [name="baid"]').val(),
            'balanceAccount.money': $('#withdrawForm [name="money"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.withdrawIndex); state.withdrawIndex = null; query(state.page); });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnAddConfirm').on('click', doAdd);
    $('#btnAddCancel').on('click', function () { layer.close(state.addIndex); state.addIndex = null; });
    $('#btnAddBccount').on('click', function () { openAddr(0); });
    $('#btnAddCccount').on('click', function () { openAddr(1); });
    $('#btnAddrConfirm').on('click', doAddr);
    $('#btnAddrCancel').on('click', function () { layer.close(state.addrIndex); state.addrIndex = null; });
    $('#btnWithdrawConfirm').on('click', doWithdraw);
    $('#btnWithdrawCancel').on('click', function () { layer.close(state.withdrawIndex); state.withdrawIndex = null; });
});
}); // end app.ready
