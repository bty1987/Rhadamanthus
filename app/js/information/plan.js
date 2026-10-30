/** app/js/information/plan.js —— 计划任务（列表 + 创建 + 取消 + 下载 + 日志）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    var STATUS_MAP = { 0: '初始化', 1: '成功', 2: '失败', 3: '执行中', 4: '已取消' };
    function stB(d) {
        var cls = d.status == 1 ? 'layui-bg-green' : d.status == 2 ? 'layui-bg-red' : d.status == 4 ? 'layui-bg-gray' : 'layui-bg-blue';
        return '<span class="layui-badge ' + cls + '">' + (STATUS_MAP[d.status] || '---') + '<\/span>';
    }

    laydate.render({ elem: '#executeDate' });
    laydate.render({ elem: '#executeTime', type: 'time' });

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'task', title: '任务', minWidth: 150, templet: function (d) { return d.task ? d.task.name : ''; } },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? d.creater.userName : ''; } },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'args', title: '参数', minWidth: 160 },
                { field: 'executeTime', title: '执行时间', width: 130 },
                { field: 'schedule', title: '进度', width: 90 },
                { field: 'status', title: '状态', width: 100, templet: stB },
                { field: 'info', title: '结果信息', minWidth: 200 },
                { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'download') download(obj.data);
            else if (obj.event === 'log') logView(obj.data);
            else if (obj.event === 'cancel') cancel(obj.data);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pagePlan, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '创建计划', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var date = $('#editForm [name="executeDate"]').val();
        var time = $('#editForm [name="executeTime"]').val();
        if (!date || !time) { app.showAlert(app.warning, '请填写执行时间'); return; }
        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);
        app.post(api.information.createPlan, {
            'plan.task.keyWord': $('#editForm [name="keyWord"]').val(),
            'plan.args': $('#editForm [name="args"]').val(),
            'plan.executeTime': executeTime
        }, function () { app.showAlert(app.success, '计划创建成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function cancel(row) {
        app.showConfirm('是否确认撤销计划？', function () {
            app.post(api.information.cancelPlan, { 'plan.pid': row.pid }, function () { query(state.page); });
        });
    }
    function download(row) { if (row.resultFilepath) window.open(app.config.media + row.resultFilepath); }
    function logView(row) { if (row.infoFilepath) window.open(app.config.media + row.infoFilepath); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
