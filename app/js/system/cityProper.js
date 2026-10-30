/** app/js/system/cityProper.js —— 区域管理（CRUD + 删除 + 城市关联）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    // 加载城市下拉
    app.post(api.system.queryCity, {}, function (res) {
        var cities = res.citys || res.cities || [];
        var html = '<option value="">请选择城市</option>';
        $.each(cities, function (i, c) { html += '<option value="' + c.cid + '">' + c.name + '</option>'; });
        $('#citySel').html(html); form.render('select');
    });

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '编号', width: 100 }, { field: 'name', title: '区域', minWidth: 140 }, { field: 'city', title: '所属城市', width: 140, templet: function (d) { return d.city ? d.city.name : ''; } }, { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'del') doDelete(obj.data.cpid); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.system.pageCityProper, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.cpid; $('#editForm [name="cpid"]').val(d.cpid); $('#editForm [name="no"]').val(d.no); $('#editForm [name="name"]').val(d.name); if (d.city) $('#editForm [name="cid"]').val(d.city.cid); }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑区域' : '添加区域', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() { if (app.validate('editForm')) return; var opt = { 'cityProper.no': $('#editForm [name="no"]').val(), 'cityProper.name': $('#editForm [name="name"]').val(), 'cityProper.city.cid': $('#editForm [name="cid"]').val() }; var apiDef; if (state.editId) { opt['cityProper.cpid'] = state.editId; apiDef = api.system.updateCityProper; } else { apiDef = api.system.addCityProper; } app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function doDelete(cpid) { app.showConfirm('确认删除？', function () { app.post(api.system.deleteCityProper, { 'cityProper.cpid': cpid }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
