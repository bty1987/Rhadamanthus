/** app/js/manifest/purchaseBalance2balance.js —— 采购结算（结算记录列表 + 添加/编辑/状态）
 *  对齐旧 WebContent/js/manifest/purchaseBalance2balance.js。状态：0初始 1已付款。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var pid = getQueryParam('pid');
    var purchaseBalanceStatus = getQueryParam('balanceStatus');
    var editIndex = null;
    if (!pid) { app.showAlert(app.warning, '缺少 pid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '采购结算' }]);

    function stB(d) { return d.status == 0 ? '<span class="layui-badge layui-bg-orange">初始<\/span>' : '<span class="layui-badge layui-bg-green">已付款<\/span>'; }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? d.creater.userName : ''; } },
            { field: 'balance', title: '结算值', width: 120, align: 'right' },
            { field: 'status', title: '状态', width: 90, templet: stB },
            { field: 'comment', title: '说明', minWidth: 140 },
            { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) {
        var e = obj.event, d = obj.data;
        if (e === 'edit') openEdit(d);
        else if (e === 'pay') {
            app.showConfirm('确定要修改为已付款状态?', function () {
                app.post(api.inventory.updatePurchaseBalanceForStatus, { 'purchaseBalance.pbid': d.pbid, 'purchaseBalance.status': d.status }, function () { query(); });
            });
        }
    });

    function query() {
        app.post(api.inventory.queryPurchaseBalanceByPid, { 'purchaseBalance.pid': pid }, function (res) {
            table.reload('resultTable', { data: res.purchaseBalances || [] });
        });
    }
    query();

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset();
        if (d) { $('#editForm [name="pbid"]').val(d.pbid); $('#editForm [name="balance"]').val(d.balance); $('#editForm [name="comment"]').val(d.comment || ''); }
        editIndex = layer.open({ type: 1, title: d ? '编辑' : '添加', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        var pbid = $('#editForm [name="pbid"]').val();
        var opt = { 'purchaseBalance.balance': $('#editForm [name="balance"]').val(), 'purchaseBalance.comment': $('#editForm [name="comment"]').val() };
        var def;
        if (pbid) { opt['purchaseBalance.pbid'] = pbid; def = api.inventory.updatePurchaseBalance; }
        else { opt['purchaseBalance.pid'] = pid; def = api.inventory.addPurchaseBalance; }
        app.post(def, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(editIndex); editIndex = null; query(); });
    });
    $('#btnCancel').on('click', function () { layer.close(editIndex); editIndex = null; });
    $('#btnAdd').on('click', function () { if (purchaseBalanceStatus == 2) { app.showAlert(app.warning, '采购单已完结'); return; } openEdit(null); });
    $('#btnBack').on('click', function () { history.back(); });
    form.render();

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
