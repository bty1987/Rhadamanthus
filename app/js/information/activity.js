/** app/js/information/activity.js —— 活动管理（列表 + 添加/编辑 + 启用/禁用 + 设为默认）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    var TYPE_MAP = { 0: '满赠', 1: '满返', 2: '满抵' };
    var ATTTYPE_MAP = { 0: '活动', 1: '奖品' };
    function stB(d) { return '<span class="layui-badge ' + (d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray') + '">' + (d.status == 0 ? '有效' : '无效') + '<\/span>'; }
    function defB(d) { return '<span class="layui-badge ' + (d.defaults == 1 ? 'layui-bg-orange' : 'layui-bg-gray') + '">' + (d.defaults == 1 ? '默认' : '标准') + '<\/span>'; }

    laydate.render({ elem: '#startTime' });
    laydate.render({ elem: '#endTime' });

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '活动名', minWidth: 160 },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
                { field: 'startTime', title: '开始时间', width: 120, templet: function (d) { return (d.startTime || '').substring(0, 10); } },
                { field: 'endTime', title: '结束时间', width: 120, templet: function (d) { return (d.endTime || '').substring(0, 10); } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'atttype', title: '活动类型', width: 100, templet: function (d) { return ATTTYPE_MAP[d.atttype] || '---'; } },
                { field: 'multiple', title: '倍数', width: 90, align: 'right' },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { field: 'defaults', title: '默认', width: 90, templet: defB },
                { title: '操作', width: 320, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'default') setDefault(obj.data.aid);
            else if (obj.event === 'enable') updateStatus(obj.data.aid, 0);
            else if (obj.event === 'disable') updateStatus(obj.data.aid, 1);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageActivity, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.aid;
            $('#editForm [name="aid"]').val(d.aid);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="startTime"]').val((d.startTime || '').substring(0, 10));
            $('#editForm [name="endTime"]').val((d.endTime || '').substring(0, 10));
            $('#editForm [name="type"]').val(d.type);
            $('#editForm [name="atttype"]').val(d.atttype);
            $('#editForm [name="multiple"]').val(d.multiple);
            $('#editForm [name="validays"]').val(d.validays);
            $('#editForm [name="exchange"]').val(d.exchange);
            $('#editForm [name="content"]').val(d.content);
            form.render('select');
        } else { form.render('select'); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑活动' : '添加活动', content: $('#editBox'), area: ['600px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        if ($('#editForm [name="startTime"]').val() > $('#editForm [name="endTime"]').val()) { app.showAlert(app.warning, '开始时间不能大于结束时间'); return; }
        var opt = {
            'activity.name': $('#editForm [name="name"]').val(),
            'activity.startTime': $('#editForm [name="startTime"]').val(),
            'activity.endTime': $('#editForm [name="endTime"]').val() + ' 23:59:59',
            'activity.type': $('#editForm [name="type"]').val(),
            'activity.atttype': $('#editForm [name="atttype"]').val(),
            'activity.multiple': $('#editForm [name="multiple"]').val(),
            'activity.validays': $('#editForm [name="validays"]').val(),
            'activity.exchange': $('#editForm [name="exchange"]').val(),
            'activity.content': $('#editForm [name="content"]').val(),
            'activity.paytype': 0
        };
        var apiDef; if (state.editId) { opt['activity.aid'] = state.editId; apiDef = api.information.updateActivity; } else { apiDef = api.information.addActivity; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function updateStatus(aid, status) { app.showConfirm(status == 0 ? '确认启用？' : '确认禁用？', function () { app.post(api.information.updateActivityForStatus, { 'activity.aid': aid, 'activity.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(state.page); }); }); }
    function setDefault(aid) { app.post(api.information.updateActivityForDefault, { 'activity.aid': aid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
