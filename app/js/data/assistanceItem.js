/** app/js/data/assistanceItem.js —— 帮助项目（增删改查，关联 assistance aid）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null, editId: null };
    var F = ['aiid','title','content'];
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'title', title: '标题', minWidth: 200 }, { field: 'content', title: '内容', minWidth: 300 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    function aid() { return $('#searchAid').val() || 0; }
    function query() { app.post(api.data.queryAssistanceItem, { 'assistance.aid': aid() }, function (res) { table.reload('resultTable', { data: res.assistanceItems || [] }); }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.aiid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } state.editIndex = layer.open({ type: 1, title: d ? '编辑项目' : '添加项目', content: $('#editBox'), area: ['600px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'assistance.aid': aid(), 'assistanceItem.title': $('#editForm [name="title"]').val(), 'assistanceItem.content': $('#editForm [name="content"]').val() }; var ad; if (state.editId) { o['assistanceItem.aiid'] = state.editId; ad = api.data.updateAssistanceItem; } else { ad = api.data.addAssistanceItem; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
