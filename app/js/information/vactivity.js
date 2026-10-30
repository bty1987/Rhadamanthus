/** app/js/information/vactivity.js —— 大活动（列表 + 启用/禁用）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    function stB(d) { return '<span class="layui-badge ' + (d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray') + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', minWidth: 200 },
                { field: 'status', title: '状态', width: 100, templet: stB },
                { title: '操作', width: 200, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'enable') updateStatus(obj.data.vaid, 0);
            else if (obj.event === 'disable') updateStatus(obj.data.vaid, 1);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageVactivity, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function updateStatus(vaid, status) {
        app.showConfirm(status == 0 ? '确认启用？' : '确认禁用？', function () {
            app.post(api.information.updateVactivityForStatus, { 'vactivity.vaid': vaid, 'vactivity.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启动' : '已禁用'); query(state.page); });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
