/** app/js/data/village4rule.js —— 楼盘规则（增删查，关联 village）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'content', title: '规则', minWidth: 240 }, { field: 'price', title: '价格', width: 120, templet: function (d) { return app.formatMoney(d.price); } }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.vrid); });
    function vid() { return $('#searchVid').val() || 0; }
    function query() { app.post(api.data.queryVillageRule, { 'villageRule.vid': vid() }, function (res) { table.reload('resultTable', { data: res.villageRules || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加规则', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; app.post(api.data.addVillageRule, { 'villageRule.vid': vid(), 'villageRule.content': $('#editForm [name="content"]').val(), 'villageRule.price': $('#editForm [name="price"]').val() }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteVillageRule, { 'villageRule.vrid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
