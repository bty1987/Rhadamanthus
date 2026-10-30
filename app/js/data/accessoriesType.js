/** app/js/data/accessoriesType.js —— 辅料品类（CRUD + 状态）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['atid','name','workTypeId','type','sort','comment'];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'workType', title: '工种', width: 120, templet: function (d) { return d.workType ? d.workType.name : ''; } }, { field: 'type', title: '类型', width: 80, templet: function (d) { return d.type == 0 ? '普通' : '分类'; } }, { field: 'sort', title: '排序', width: 70 }, { field: 'comment', title: '备注', minWidth: 160 }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.atid, 0); else if (obj.event === 'disable') updSt(obj.data.atid, 1); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageAccessoriesType, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.atid; $('#editForm [name="atid"]').val(d.atid); $('#editForm [name="name"]').val(d.name || ''); $('#editForm [name="workTypeId"]').val(d.workType ? d.workType.id : ''); $('#editForm [name="type"]').val(d.type != null ? d.type : ''); $('#editForm [name="sort"]').val(d.sort != null ? d.sort : ''); $('#editForm [name="comment"]').val(d.comment || ''); } form.render('select'); state.editIndex = layer.open({ type: 1, title: d ? '编辑品类' : '添加品类', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'accessoriesType.name': $('#editForm [name="name"]').val(), 'accessoriesType.workType.id': $('#editForm [name="workTypeId"]').val(), 'accessoriesType.type': $('#editForm [name="type"]').val(), 'accessoriesType.sort': $('#editForm [name="sort"]').val(), 'accessoriesType.comment': $('#editForm [name="comment"]').val() }; var ad; if (state.editId) { o['accessoriesType.atid'] = state.editId; ad = api.data.updateAccessoriesType; } else { ad = api.data.addAccessoriesType; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function updSt(id, s) { app.post(api.data.updateAccessoriesTypeForStatus, { 'accessoriesType.atid': id, 'accessoriesType.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
