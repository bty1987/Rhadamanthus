/** app/js/salary/withhold.js —— 扣款管理（列表查询）
 *  对齐旧 WebContent/js/salary/withhold.js。
 *  pagetype=belong 时按当前登录用户过滤，隐藏姓名/操作人/操作时间列。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, belong: false };

    var TYPE_MAP = { 0: '标准', 1: '装修款' };
    var STATUS_MAP = { 0: '初始' };
    var belongUserId = (app.params.userInfo && app.params.userInfo.user) ? app.params.userInfo.user.userId : '';

    laydate.render({ elem: '#createTime', range: '~' });

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'user', title: '姓名', width: 110, hide: state.belong, templet: function (d) { return d.user ? (d.user.currentName || '') : ''; } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'money', title: '操作金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'operater', title: '操作人', width: 110, hide: state.belong, templet: function (d) { return d.operater ? (d.operater.currentName || '') : ''; } },
                { field: 'operateTime', title: '操作时间', width: 170, hide: state.belong },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return '<span class="layui-badge layui-bg-gray">' + (STATUS_MAP[d.status] || '---') + '<\/span>'; } },
                { field: 'comment', title: '说明', minWidth: 160 } ]] });
    }

    function buildFilters() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val()); if (!v) return;
            p['filters[' + c + '].field'] = $(this).attr('name');
            p['filters[' + c + '].data'] = v;
            p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn';
            c++;
        });
        return p;
    }
    function query(page) {
        state.page = page || 1;
        var opt = $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows });
        if (state.belong && belongUserId) opt['withhold.user.userId'] = belongUserId;
        app.post(api.salary.pageWithhold, opt, function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }
    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
