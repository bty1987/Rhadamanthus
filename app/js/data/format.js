/** app/js/data/format.js —— 规格管理（CRUD + 状态切换）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    function stBadge(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '规格名', minWidth: 180 }, { field: 'status', title: '状态', width: 90, templet: stBadge }, { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'enable') updSt(obj.data.fid, 0); else if (obj.event === 'disable') updSt(obj.data.fid, 1); });
    function query() { app.post(api.data.queryFormatByGid, {}, function (res) { table.reload('resultTable', { data: res.formats || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加规格', content: $('#editBox'), area: ['420px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; app.post(api.data.addFormat, { 'format.name': $('#editForm [name="name"]').val() }, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function updSt(fid, s) { app.post(api.data.updateFormatForStatus, { 'format.fid': fid, 'format.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(); }); }
    query();
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
