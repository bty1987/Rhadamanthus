/** app/js/data/decorationMeasureRuleItem.js —— 测量规则项（增删查，关联 drid）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    var F = ['name','value'];
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 200 }, { field: 'value', title: '值', width: 160 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.driid); });
    function drid() { return $('#searchDrid').val() || 0; }
    function query() { app.post(api.data.queryDecorationMeasureRuleItem, { 'decorationMeasureRuleItem.drid': drid() }, function (res) { table.reload('resultTable', { data: res.decorationMeasureRuleItems || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'decorationMeasureRuleItem.drid': drid() }; F.forEach(function (k) { o['decorationMeasureRuleItem.' + k] = $('#editForm [name="' + k + '"]').val(); }); app.post(api.data.addDecorationMeasureRuleItem, o, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteDecorationMeasureRuleItem, { 'decorationMeasureRuleItem.driid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
