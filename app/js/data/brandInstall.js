/** app/js/data/brandInstall.js —— 品牌安装（增删查）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'workNum', title: '工种数', width: 90 }, { field: 'comment', title: '备注', minWidth: 140 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') app.showConfirm('确认删除？', function () { app.post(api.data.deleteBrandInstall, { 'brandInstall.biid': obj.data.biid }, function () { app.showAlert(app.success, '已删除'); query(); }); }); });
    function bid() { return $('#searchBid').val() || 0; }
    function query() { app.post(api.data.queryBrandInstall, { 'brandInstall.bid': bid() }, function (res) { table.reload('resultTable', { data: res.brandInstalls || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); $('#formBid').val(bid()); state.editIndex = layer.open({ type: 1, title: '添加安装', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; app.post(api.data.addBrandInstall, { 'brandInstall.bid': $('#formBid').val(), 'brandInstall.name': $('#editForm [name="name"]').val(), 'brandInstall.workNum': $('#editForm [name="workNum"]').val(), 'brandInstall.comment': $('#editForm [name="comment"]').val() }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    query();
    $('#btnSearch').on('click', query); $('#btnAdd').on('click', openAdd); $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
