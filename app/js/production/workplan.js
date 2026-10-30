/** app/js/production/workplan.js —— 工序计划（CRUD + 启用/禁用 + 查看工序）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var workshops = [];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    function wsName(d) { return d.workshop ? d.workshop.name : ''; }
    initTable(); loadOpts(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'workshop', title: '车间', width: 140, templet: wsName }, { field: 'comment', title: '说明', minWidth: 160 }, { field: 'status', title: '状态', width: 90, templet: stB }, { title: '操作', width: 240, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'status') toggleStatus(obj.data);
            else if (obj.event === 'flow') viewFlow(obj.data);
        });
    }
    function loadOpts() {
        app.post(api.production.queryWorkshop, {}, function (res) { workshops = res.workshops || []; renderSelect('#selWorkshop', workshops, 'wsid', 'name'); });
    }
    function renderSelect(sel, list, k, v) { var $s = $(sel); $s.empty().append('<option value="">请选择</option>'); (list || []).forEach(function (it) { $s.append('<option value="' + it[k] + '">' + (it[v] || '') + '</option>'); }); form.render('select'); }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageWorkplan, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.wpid; $('#editForm [name="wpid"]').val(d.wpid); $('#editForm [name="name"]').val(d.name); $('#editForm [name="comment"]').val(d.comment); if (d.workshop) $('#selWorkshop').val(d.workshop.wsid); form.render('select'); }
        else { form.render('select'); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑工序计划' : '添加工序计划', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = { 'workplan.name': $('#editForm [name="name"]').val(), 'workplan.comment': $('#editForm [name="comment"]').val(), 'workplan.workshop.wsid': $('#editForm [name="workshop"]').val() };
        var ad;
        if (state.editId) { o['workplan.wpid'] = state.editId; ad = api.production.updateWorkplan; } else { ad = api.production.addWorkplan; }
        app.post(ad, o, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function toggleStatus(d) {
        var nv = d.status == 0 ? 1 : 0, txt = nv == 0 ? '启用' : '禁用';
        app.showConfirm('确定' + txt + '该工序计划?', function () {
            app.post(api.production.updateWorkplanForStatus, { 'workplan.wpid': d.wpid, 'workplan.status': nv }, function () { app.showAlert(app.success, '已' + txt); query(state.page); });
        });
    }
    function viewFlow(d) { app.params.productionWorkplan = { wpid: d.wpid, name: d.name }; app.popup('views/production/workflow2check.html', '工序-' + d.name, null, { area: ['800px', '600px'] }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
