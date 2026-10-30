/** app/js/data/cormrice.js —— 公共项工费（增删查，关联 quotationCtem qcid）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    var F = ['cnid','unit','trannum','salary'];
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'constructionNode', title: '节点', width: 140, templet: function (d) { return d.constructionNode ? d.constructionNode.name : ''; } }, { field: 'unit', title: '单位', width: 80 }, { field: 'trannum', title: '转换量', width: 100 }, { field: 'salary', title: '工费', width: 100, templet: function (d) { return app.formatMoney(d.salary); } }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.cpid); });
    function qcid() { return $('#searchQcid').val() || 0; }
    function query() { app.post(api.data.queryCormriceByQcid, { 'cormrice.quotationCtem.qcid': qcid() }, function (res) { table.reload('resultTable', { data: res.cormrices || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'cormrice.quotationCtem.qcid': qcid(), 'cormrice.constructionNode.cnid': $('#editForm [name="cnid"]').val() }; ['unit','trannum','salary'].forEach(function (k) { o['cormrice.' + k] = $('#editForm [name="' + k + '"]').val(); }); app.post(api.data.addCormrice, o, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteCormrice, { 'cormrice.cpid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
