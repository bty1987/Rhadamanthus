/** app/js/building/buildingCustomer.js —— 房源客户（列表 + 编辑 + 状态）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    initTable(); query(1);

    function statusBadge(d) { var cls = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; var txt = d.status == 0 ? '启用' : '禁用'; return '<span class="layui-badge ' + cls + '">' + txt + '<\/span>'; }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '编号', width: 110 },
                { field: 'type', title: '类型', width: 80 },
                { field: 'familyType', title: '家庭', width: 80 },
                { field: 'orientation', title: '朝向', width: 80 },
                { field: 'grade', title: '等级', width: 80 },
                { field: 'intention', title: '意向', width: 90 },
                { field: 'area', title: '面积', width: 80 },
                { field: 'comment', title: '备注', minWidth: 140 },
                { field: 'status', title: '状态', width: 80, templet: statusBadge },
                { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updateStatus(obj.data.csid, 0); else if (obj.event === 'disable') updateStatus(obj.data.csid, 1); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.building.pageBuildingCustomer, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.csid; ['csid','no','type','familyType','orientation','grade','intention','area','comment'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑客户' : '添加客户', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'buildingCustomer.no': $('#editForm [name="no"]').val(), 'buildingCustomer.type': $('#editForm [name="type"]').val(), 'buildingCustomer.familyType': $('#editForm [name="familyType"]').val(), 'buildingCustomer.orientation': $('#editForm [name="orientation"]').val(), 'buildingCustomer.grade': $('#editForm [name="grade"]').val(), 'buildingCustomer.intention': $('#editForm [name="intention"]').val(), 'buildingCustomer.area': $('#editForm [name="area"]').val(), 'buildingCustomer.comment': $('#editForm [name="comment"]').val() };
        var apiDef; if (state.editId) { opt['buildingCustomer.csid'] = state.editId; apiDef = api.building.updateBuildingCustomer; } else { apiDef = api.building.addBuildingCustomer; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function updateStatus(csid, status) { app.post(api.building.updateBuildingCustomerForStatus, { 'buildingCustomer.csid': csid, 'buildingCustomer.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
