/** app/js/data/brandProduct.js —— 品牌产品（增删查）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'workNum', title: '工种数', width: 90 }, { field: 'comment', title: '备注', minWidth: 140 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.bpid); });
    function bid() { return $('#searchBid').val() || 0; }
    function query() { app.post(api.data.queryBrandProduct, { 'brandProduct.bid': bid() }, function (res) { table.reload('resultTable', { data: res.brandProducts || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); $('#formBid').val(bid()); state.editIndex = layer.open({ type: 1, title: '添加产品', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; app.post(api.data.addBrandProduct, { 'brandProduct.bid': $('#formBid').val(), 'brandProduct.name': $('#editForm [name="name"]').val(), 'brandProduct.workNum': $('#editForm [name="workNum"]').val(), 'brandProduct.comment': $('#editForm [name="comment"]').val() }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteBrandProduct, { 'brandProduct.bpid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
