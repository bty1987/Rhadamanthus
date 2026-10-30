/** app/js/data/brand4balance.js —— 品牌结算（增删查，关联 brand bid）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    var F = ['name','ctype','cvalue','comment'];
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'ctype', title: '结算类型', width: 100, templet: function (d) { return d.ctype == 0 ? '底价' : '点位'; } }, { field: 'cvalue', title: '结算值', width: 100 }, { field: 'comment', title: '说明', minWidth: 200 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.bbid); });
    function bid() { return $('#searchBid').val() || 0; }
    function query() { app.post(api.data.queryBrandBalance, { 'brandBalance.bid': bid() }, function (res) { table.reload('resultTable', { data: res.brandBalances || [] }); }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); form.render('select'); state.editIndex = layer.open({ type: 1, title: '添加结算', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'brandBalance.bid': bid() }; F.forEach(function (k) { o['brandBalance.' + k] = $('#editForm [name="' + k + '"]').val(); }); app.post(api.data.addBrandBalance, o, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteBrandBalance, { 'brandBalance.bbid': id }, function () { app.showAlert(app.success, '已删除'); query(); }); }); }
    query();
    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
