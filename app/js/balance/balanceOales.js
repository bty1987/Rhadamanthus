/** app/js/balance/balanceOales.js —— 结算外销单
 * balanceOales.status 复用 balanceSales.status：0初始/1锁定/3结算(ENABLE_CHECK)。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, createIndex: null, updateIndex: null };
    var STATUS = { 0: '初始', 1: '锁定', 3: '结算' };
    var STATUS_INIT = 0, STATUS_UNLOCK = 1;
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', width: 160 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status >= 3 ? 'layui-bg-green' : d.status == 0 ? 'layui-bg-gray' : 'layui-bg-blue'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'grade', title: '等级', width: 80 },
                { field: 'profit', title: '利润', width: 110, templet: function (d) { return app.formatMoney(d.profit); } },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return (d.creater && d.creater.userName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'balancer', title: '结算人', width: 100, templet: function (d) { return (d.balancer && d.balancer.userName) || '-'; } },
                { field: 'balanceTime', title: '结算时间', width: 170 },
                { field: 'lockTime', title: '锁定时间', width: 170 },
                { title: '操作', width: 540, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'amount') doAmount(v);
            else if (ev === 'detail') goDetail(v);
            else if (ev === 'update') openUpdate(v);
            else if (ev === 'balance') doBalance(v);
            else if (ev === 'delete') doDelete(v);
            else if (ev === 'lock') doLock(v);
            else if (ev === 'unlock') doUnlock(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.balance.pageBalanceOales, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function doAmount(v) {
        if (v.status == STATUS_UNLOCK) return;
        app.post(api.balance.amountBalanceOales, { 'balanceOales.boid': v.boid }, function () { app.showAlert(app.success, '汇总成功'); query(state.page); });
    }
    function goDetail(v) {
        app.params.balance = { boid: v.boid };
        app.popup(api.index.balanceOalesItemIndex.url, '外销单明细 - ' + v.name, null, { area: ['95%', '85%'], end: function () { query(state.page); } });
    }
    function openUpdate(v) {
        if (v.status != STATUS_INIT) return;
        app.clearValidator();
        $('#updateForm [name="boid"]').val(v.boid);
        $('#updateForm [name="name"]').val(v.name);
        state.updateIndex = layer.open({ type: 1, title: '更新名称 - ' + v.name, content: $('#updateBox'), area: ['480px', 'auto'] });
    }
    function doUpdate() {
        if (app.validate('updateForm')) return;
        app.post(api.balance.updateBalanceOales, { 'balanceOales.boid': $('#updateForm [name="boid"]').val(), 'balanceOales.name': $('#updateForm [name="name"]').val() }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.updateIndex); state.updateIndex = null; query(state.page); });
    }
    function doBalance(v) {
        if (v.status != STATUS_UNLOCK) return;
        app.showConfirm('确定结算？', function () {
            app.post(api.balance.balanceBalanceOales, { 'balanceOales.boid': v.boid }, function () { app.showAlert(app.success, '结算成功'); query(state.page); });
        });
    }
    function doDelete(v) {
        if (v.status != STATUS_INIT) return;
        app.showConfirm('确定删除？', function () {
            app.post(api.balance.deleteBalanceOales, { 'balanceOales.boid': v.boid }, function () { app.showAlert(app.success, '删除成功'); query(state.page); });
        });
    }
    function doLock(v) {
        if (v.status != STATUS_INIT) return;
        app.post(api.balance.lockBalanceOales, { 'balanceOales.boid': v.boid }, function () { app.showAlert(app.success, '锁定成功'); query(state.page); });
    }
    function doUnlock(v) {
        if (v.status != STATUS_UNLOCK) return;
        app.post(api.balance.unlockBalanceOales, { 'balanceOales.boid': v.boid }, function () { app.showAlert(app.success, '解锁成功'); query(state.page); });
    }

    function openCreate() {
        app.clearValidator();
        $('#createForm')[0].reset();
        form.render('radio');
        state.createIndex = layer.open({ type: 1, title: '创建结算外销单', content: $('#createBox'), area: ['500px', 'auto'] });
    }
    function doCreate() {
        if (app.validate('createForm')) return;
        var grade = $('#createForm [name="grade"]:checked').val();
        if (!grade) { app.showAlert(app.warning, '请选择等级'); return; }
        app.post(api.balance.createBalanceOales, {
            'balanceOales.name': $('#createForm [name="name"]').val(),
            'balanceOales.grade': grade
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.createIndex); state.createIndex = null; query(state.page); });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnCreate').on('click', openCreate);
    $('#btnCreateConfirm').on('click', doCreate);
    $('#btnCreateCancel').on('click', function () { layer.close(state.createIndex); state.createIndex = null; });
    $('#btnUpdateConfirm').on('click', doUpdate);
    $('#btnUpdateCancel').on('click', function () { layer.close(state.updateIndex); state.updateIndex = null; });
});
}); // end app.ready
