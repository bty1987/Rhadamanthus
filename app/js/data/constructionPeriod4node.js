/** app/js/data/constructionPeriod4node.js —— 工期节点配置（增删查，按 cpid）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'period', title: '工期', width: 100 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.cpnid); });
    function cpid() { return $('#searchCpid').val() || 0; }
    function query() { app.post(api.data.queryConstructionPeriodNodeByCpid, { 'constructionPeriodNode.cpid': cpid() }, function (res) { table.reload('resultTable', { data: res.constructionPeriodNodes || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加节点', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; app.post(api.data.addConstructionPeriodNode, { 'constructionPeriodNode.cpid': cpid(), 'constructionPeriodNode.constructionNode.cnid': $('#editForm [name="cnid"]').val(), 'constructionPeriodNode.name': $('#editForm [name="name"]').val(), 'constructionPeriodNode.period': $('#editForm [name="period"]').val() }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteConstructionPeriodNodeByCpnid, { 'constructionPeriodNode.cpnid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
