/** app/js/building/buildingNode.js —— 施工节点（CRUD + 状态切换）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '节点名', minWidth: 180 }, { field: 'type', title: '类型', width: 100 }, { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>'; } }, { title: '操作', width: 240, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updateStatus(obj.data.bnid, 0); else if (obj.event === 'disable') updateStatus(obj.data.bnid, 1); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.building.pageBuildingNode, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.bnid; $('#editForm [name="bnid"]').val(d.bnid); $('#editForm [name="name"]').val(d.name); $('#editForm [name="type"]').val(d.type); } state.editIndex = layer.open({ type: 1, title: d ? '编辑节点' : '添加节点', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } }); }
    function doSave() { if (app.validate('editForm')) return; var opt = { 'buildingNode.name': $('#editForm [name="name"]').val(), 'buildingNode.type': $('#editForm [name="type"]').val() }; var apiDef; if (state.editId) { opt['buildingNode.bnid'] = state.editId; apiDef = api.building.updateBuildingNode; } else { apiDef = api.building.addBuildingNode; } app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function updateStatus(bnid, status) { app.post(api.building.updateBuildingNodeForStatus, { 'buildingNode.bnid': bnid, 'buildingNode.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
