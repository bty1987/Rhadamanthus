/** app/js/production/workshop.js —— 工序组/车间（CRUD + 启用/禁用 + 查看）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 200 }, { field: 'status', title: '状态', width: 100, templet: stB }, { title: '操作', width: 240, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'status') toggleStatus(obj.data);
            else if (obj.event === 'view') viewDetail(obj.data);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageWorkshop, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.wsid; $('#editForm [name="wsid"]').val(d.wsid); $('#editForm [name="name"]').val(d.name); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑工序组' : '添加工序组', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = { 'workshop.name': $('#editForm [name="name"]').val() };
        var ad;
        if (state.editId) { o['workshop.wsid'] = state.editId; ad = api.production.updateWorkshop; } else { ad = api.production.addWorkshop; }
        app.post(ad, o, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function toggleStatus(d) {
        var nv = d.status == 0 ? 1 : 0, txt = nv == 0 ? '启用' : '禁用';
        app.showConfirm('确定' + txt + '该工序组?', function () {
            app.post(api.production.updateWorkshopForStatus, { 'workshop.wsid': d.wsid, 'workshop.status': nv }, function () { app.showAlert(app.success, '已' + txt); query(state.page); });
        });
    }
    function viewDetail(d) { app.params.productionWorkshop = { wsid: d.wsid, name: d.name }; app.popup('views/production/workshop4view.html', '工序组-' + d.name, null, { area: ['700px', '500px'] }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
