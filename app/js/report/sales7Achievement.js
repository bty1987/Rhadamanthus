/** app/js/report/sales7Achievement.js —— 销售业绩报表（分区/年月 分组）
 * cs1 定金总额 / cs2 补款总额 / cs5 退货总额 / cs7 结算总额 为金额（已由 tranargs ÷1000 转元）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    laydate.render({ elem: '#year', type: 'year', format: 'yyyy' });
    laydate.render({ elem: '#month', type: 'month', format: 'yyyy-MM' });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '序号', width: 60, fixed: 'left' },
            { field: 'department', title: '分区编号', width: 110, fixed: 'left', templet: function (d) { return (d.department && d.department.no) || '-'; } },
            { field: 'department', title: '分区', width: 120, fixed: 'left', templet: function (d) { return (d.department && d.department.name) || '-'; } },
            { field: 'date', title: '日期', width: 150, templet: function (d) { return d.year + '年' + d.month + '月业绩'; } },
            { field: 'cs0', title: '销售单数', width: 100 },
            { field: 'cs1', title: '定金总额', width: 120, templet: function (d) { return app.formatMoney(d.cs1); } },
            { field: 'cs2', title: '补款总额', width: 120, templet: function (d) { return app.formatMoney(d.cs2); } },
            { field: 'cs3', title: '补款单数', width: 100 },
            { field: 'cs4', title: '退货单数', width: 100 },
            { field: 'cs5', title: '退货总额', width: 120, templet: function (d) { return app.formatMoney(d.cs5); } },
            { field: 'cs6', title: '结算单数', width: 100 },
            { field: 'cs7', title: '结算总额', width: 120, templet: function (d) { return app.formatMoney(d.cs7); } }
        ]]
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });

    function bF() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val()); if (!v) return; var n = $(this).attr('name');
            p['filters[' + c + '].field'] = n; p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = 'eq'; c++;
        });
        return p;
    }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.report.querySales7Achievement, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
    }
    query(1);
});
});
