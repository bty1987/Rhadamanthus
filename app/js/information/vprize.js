/** app/js/information/vprize.js —— 大活动奖品（列表 + 添加/编辑）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    function stB(d) { return '<span class="layui-badge ' + (d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray') + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }

    loadVactivity();
    initTable(); query(1);
    function loadVactivity() {
        app.post(api.information.queryVactivity, {}, function (res) {
            var html = '<option value="">请选择活动</option>';
            $.each(res.vactivitys || [], function (i, v) { html += '<option value="' + v.vaid + '">' + v.name + '</option>'; });
            $('#vaid').html(html); form.render('select');
        }, null, false);
    }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', minWidth: 180 },
                { field: 'price', title: '价格', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'unit', title: '单位', width: 90 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageVprize, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.vpid;
            $('#editForm [name="vpid"]').val(d.vpid);
            $('#editForm [name="vaid"]').val(d.vaid);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="price"]').val(d.price);
            $('#editForm [name="unit"]').val(d.unit);
            form.render('select');
        } else { form.render('select'); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑奖品' : '添加奖品', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'vprize.vaid': $('#editForm [name="vaid"]').val(),
            'vprize.name': $('#editForm [name="name"]').val(),
            'vprize.price': $('#editForm [name="price"]').val(),
            'vprize.unit': $('#editForm [name="unit"]').val()
        };
        var apiDef; if (state.editId) { opt['vprize.vpid'] = state.editId; apiDef = api.information.updateVprize; } else { apiDef = api.information.addVprize; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
