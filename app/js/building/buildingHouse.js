/** app/js/building/buildingHouse.js —— 房源管理（列表 + 添加/编辑 + 认领 + 状态）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '编号', width: 120 },
                { field: 'house', title: '楼盘', minWidth: 140, templet: function (d) { return d.house ? d.house.name : ''; } },
                { field: 'type', title: '类型', width: 80 },
                { field: 'totalPrice', title: '总价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.totalPrice); } },
                { field: 'discussType', title: '议价', width: 80 },
                { field: 'decorateDegree', title: '装修', width: 80 },
                { field: 'status', title: '状态', width: 80, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">在售</span>' : '<span class="layui-badge layui-bg-gray">已停</span>'; } },
                { title: '操作', width: 210, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'take') takeHouse(obj.data.hsid);
            else if (obj.event === 'disable') updateStatus(obj.data.hsid, 1);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.building.pageBuildingHouse, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.hsid; ['hsid','no','type','totalPrice','discussType','decorateDegree'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑房源' : '添加房源', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'buildingHouse.no': $('#editForm [name="no"]').val(), 'buildingHouse.type': $('#editForm [name="type"]').val(), 'buildingHouse.totalPrice': $('#editForm [name="totalPrice"]').val(), 'buildingHouse.discussType': $('#editForm [name="discussType"]').val(), 'buildingHouse.decorateDegree': $('#editForm [name="decorateDegree"]').val() };
        var apiDef; if (state.editId) { opt['buildingHouse.hsid'] = state.editId; apiDef = api.building.updateBuildingHouse; } else { apiDef = api.building.addBuildingHouse; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function takeHouse(hsid) { app.showConfirm('确认认领该房源？', function () { app.post(api.building.takeBuildingHouse, { 'buildingHouse.hsid': hsid }, function () { app.showAlert(app.success, '认领成功'); query(state.page); }); }); }
    function updateStatus(hsid, status) { app.post(api.building.updateBuildingHouseForStatus, { 'buildingHouse.hsid': hsid, 'buildingHouse.status': status }, function () { app.showAlert(app.success, '已停售'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
