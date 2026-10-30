/** app/js/data/aoodsCost.js —— 辅料成本（增删查，关联 aoods aid）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'constructionCost', title: '工费', minWidth: 160, templet: function (d) { return d.constructionCost ? d.constructionCost.name : ''; } }, { field: 'numLimit', title: '数量上限', width: 120 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.acid); });
    function aid() { return $('#searchAid').val() || 0; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageAoodsCost, { 'aoodsCost.aoods.aid': aid(), 'paging.page': state.page, 'paging.rows': state.rows }, function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openAdd() { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加成本', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; app.post(api.data.addAoodsCost, { 'aoodsCost.aoods.aid': aid(), 'aoodsCost.constructionCost.ccid': $('#editForm [name="ccid"]').val(), 'aoodsCost.numLimit': $('#editForm [name="numLimit"]').val() }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteAoodsCost, { 'aoodsCost.acid': id }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); }); }
    query(1);
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
