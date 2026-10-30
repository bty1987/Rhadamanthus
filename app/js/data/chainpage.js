/** app/js/data/chainpage.js —— 外链管理（增删查）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'url', title: '地址', minWidth: 260 }, { field: 'comment', title: '说明', minWidth: 200 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.cpid); });
    function query() { app.post(api.data.queryChainPage, {}, function (res) { table.reload('resultTable', { data: res.chainPages || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); form.render(); state.editIndex = layer.open({ type: 1, title: '添加外链', content: $('#editBox'), area: ['520px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; app.post(api.data.addChainPage, { 'chainPage.name': $('#editForm [name="name"]').val(), 'chainPage.url': $('#editForm [name="url"]').val(), 'chainPage.comment': $('#editForm [name="comment"]').val(), 'chainPage.companymark': $('#editForm [name="companymark"]').prop('checked') ? 0 : 1 }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteChainPage, { 'chainPage.cpid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
