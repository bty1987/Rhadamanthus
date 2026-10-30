/** app/js/data/normpackItem.js —— 定额包项目（增删查，关联 npid）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    var F = ['name','normunit','normnum','storeunit','storenum','price'];
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'normunit', title: '定额单位', width: 100 }, { field: 'normnum', title: '定额数量', width: 100 }, { field: 'storeunit', title: '库房单位', width: 100 }, { field: 'storenum', title: '库房数量', width: 100 }, { field: 'price', title: '价格', width: 100, templet: function (d) { return app.formatMoney(d.price); } }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.npiid); });
    function npid() { return $('#searchNpid').val() || 0; }
    function query() { app.post(api.data.queryNormpackItem, { 'normpackItem.npid': npid() }, function (res) { table.reload('resultTable', { data: res.normpackItems || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加项目', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'normpackItem.npid': npid() }; F.forEach(function (k) { o['normpackItem.' + k] = $('#editForm [name="' + k + '"]').val(); }); app.post(api.data.addNormpackItem, o, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteNormpackItem, { 'normpackItem.npiid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
