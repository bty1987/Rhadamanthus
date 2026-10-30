/** app/js/production/quoteType.js —— 报价类型（CRUD + 启用/禁用）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'qtid', title: '编号', width: 100 }, { field: 'name', title: '报价类型', minWidth: 200 }, { field: 'status', title: '状态', width: 100, templet: stB }, { title: '操作', width: 200, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'status') toggleStatus(obj.data);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageQuoteType, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.qtid; $('#editForm [name="qtid"]').val(d.qtid); $('#editForm [name="name"]').val(d.name); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑报价类型' : '添加报价类型', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = { 'quoteType.name': $('#editForm [name="name"]').val() };
        var ad;
        if (state.editId) { o['quoteType.qtid'] = state.editId; ad = api.production.updateQuoteType; } else { ad = api.production.addQuoteType; }
        app.post(ad, o, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function toggleStatus(d) {
        var nv = d.status == 0 ? 1 : 0, txt = nv == 0 ? '启用' : '禁用';
        app.showConfirm('确定' + txt + '该报价类型?', function () {
            app.post(api.production.updateQuoteTypeForStatus, { 'quoteType.qtid': d.qtid, 'quoteType.status': nv }, function () { app.showAlert(app.success, '已' + txt); query(state.page); });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
