/** app/js/salary/workerSalary4query.js —— 工费查询结果（按 userId + 时间范围分页查询）
 *  对齐旧 WebContent/js/salary/workerSalary4query.js。
 *  URL 参数：userId / startTime(yyyy-MM) → 调 pageWorkerSalaryByUserId 显示该用户该月工费列表。
 *  说明：旧版从 viewPopUp 的 data-* 属性读取上下文；新版统一从 location.search 解析。 */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    var statusMap = {};
    var ctx = parseQuery();
    app.post(api.ds.salary, {}, function (res) { statusMap = kvToMap(res.status); initTable(); query(1); });

    function parseQuery() {
        var qs = location.search.substring(1), o = {};
        if (!qs) return o;
        $.each(qs.split('&'), function (i, kv) {
            var p = kv.split('=');
            o[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
        });
        return o;
    }
    function kvToMap(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i].value; return m; }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'salary', title: '薪资', width: 130, align: 'right', templet: function (d) { return app.formatMoney(d.salary); } },
                { field: 'status', title: '状态', width: 110, templet: function (d) { return '<span class="layui-badge layui-bg-gray">' + (statusMap[d.status] || '---') + '<\/span>'; } },
                { field: 'createTime', title: '创建时间', width: 180 },
                { field: 'comment', title: '备注', minWidth: 160 } ]] });
    }

    function buildFilters() {
        var p = {}, c = 0;
        if (ctx.userId) { p['filters[' + c + '].field'] = 'userId'; p['filters[' + c + '].data'] = ctx.userId; p['filters[' + c + '].op'] = 'eq'; c++; }
        if (ctx.startTime) {
            var ym = ctx.startTime;
            p['filters[' + c + '].field'] = 'startTime'; p['filters[' + c + '].data'] = ym + '-01 00:00:00'; p['filters[' + c + '].op'] = 'eq'; c++;
            p['filters[' + c + '].field'] = 'endTime'; p['filters[' + c + '].data'] = ym + '-28 23:59:59'; p['filters[' + c + '].op'] = 'eq'; c++;
        }
        return p;
    }
    function query(page) {
        state.page = page || 1;
        app.post(api.salary.pageWorkerSalaryByUserId, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }
    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
    }
});
}); // end app.ready
