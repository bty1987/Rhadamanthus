/** app/js/system/city.js —— 城市管理（CRUD + 删除 + 大区关联）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    // 加载大区下拉
    app.post(api.system.queryRegion, {}, function (res) {
        var regions = res.regions || [];
        var html = '<option value="">请选择大区</option>';
        $.each(regions, function (i, r) { html += '<option value="' + r.rid + '">' + r.name + '</option>'; });
        $('#regionSel').html(html); form.render('select');
    });

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '编号', width: 100 }, { field: 'name', title: '城市', minWidth: 140 }, { field: 'province', title: '省份', width: 120 }, { field: 'region', title: '大区', width: 120, templet: function (d) { return d.region ? d.region.name : ''; } }, { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'del') doDelete(obj.data.cid); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.system.pageCity, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.cid; $('#editForm [name="cid"]').val(d.cid); $('#editForm [name="no"]').val(d.no); $('#editForm [name="name"]').val(d.name); $('#editForm [name="province"]').val(d.province || ''); if (d.region) $('#editForm [name="rid"]').val(d.region.rid); }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑城市' : '添加城市', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() { if (app.validate('editForm')) return; var opt = { 'city.no': $('#editForm [name="no"]').val(), 'city.name': $('#editForm [name="name"]').val(), 'city.province': $('#editForm [name="province"]').val(), 'city.region.rid': $('#editForm [name="rid"]').val() }; var apiDef; if (state.editId) { opt['city.cid'] = state.editId; apiDef = api.system.updateCity; } else { apiDef = api.system.addCity; } app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function doDelete(cid) { app.showConfirm('确认删除？', function () { app.post(api.system.deleteCity, { 'city.cid': cid }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
