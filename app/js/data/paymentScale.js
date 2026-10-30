/** app/js/data/paymentScale.js —— 付款比例（CRUD + 状态 + 删除）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    var F = ['name','typeness','dbid','atttype','comment'];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '款项名称', minWidth: 160 }, { field: 'typeness', title: '类型', width: 100 }, { field: 'atttype', title: '属性类型', width: 100 }, { field: 'comment', title: '说明', minWidth: 200 }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'enable') updSt(obj.data.psid, 0); else if (obj.event === 'disable') updSt(obj.data.psid, 1); else if (obj.event === 'del') doDel(obj.data.psid); });
    function query() { app.post(api.data.queryPaymentScale, {}, function (res) { table.reload('resultTable', { data: res.paymentScales || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加付款比例', content: $('#editBox'), area: ['520px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = {}; F.forEach(function (k) { o['paymentScale.' + k] = $('#editForm [name="' + k + '"]').val(); }); app.post(api.data.addPaymentScale, o, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function updSt(id, s) { app.post(api.data.updatePaymentScaleForStatus, { 'paymentScale.psid': id, 'paymentScale.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deletePaymentScale, { 'paymentScale.psid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
