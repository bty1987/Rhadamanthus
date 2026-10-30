/** app/js/data/price.js —— 价格管理（增删查 + 状态，关联 goods gid）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    var F = ['name','purchase','selling','confine','ctype','cvalue','type'];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '说明', minWidth: 160 }, { field: 'purchase', title: '控价', width: 90, templet: function (d) { return app.formatMoney(d.purchase); } }, { field: 'selling', title: '售价', width: 90, templet: function (d) { return app.formatMoney(d.selling); } }, { field: 'confine', title: '限价', width: 90, templet: function (d) { return app.formatMoney(d.confine); } }, { field: 'ctype', title: '结算类型', width: 90, templet: function (d) { return d.ctype == '0' ? '底价' : '点位'; } }, { field: 'cvalue', title: '结算值', width: 90 }, { field: 'type', title: '类型', width: 80, templet: function (d) { return d.type == '0' ? '正价' : '特价'; } }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.pid); else if (obj.event === 'enable') updSt(obj.data.pid, 0); else if (obj.event === 'disable') updSt(obj.data.pid, 1); });
    function gid() { return $('#searchGid').val() || 0; }
    function query() { app.post(api.data.queryPriceByGid, { 'price.gid': gid() }, function (res) { table.reload('resultTable', { data: res.prices || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); form.render('select'); state.editIndex = layer.open({ type: 1, title: '添加价格', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'price.gid': gid() }; F.forEach(function (k) { o['price.' + k] = $('#editForm [name="' + k + '"]').val(); }); app.post(api.data.addPrice, o, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deletePrice, { 'price.pid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    function updSt(id, s) { app.post(api.data.updatePriceForStatus, { 'price.pid': id, 'price.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
