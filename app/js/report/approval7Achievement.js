/** app/js/report/approval7Achievement.js —— 审批业绩报表（年/月/类型 分组） */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    laydate.render({ elem: '#year', type: 'year', format: 'yyyy' });
    laydate.render({ elem: '#month', type: 'month', format: 'yyyy-MM' });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '序号', width: 60, fixed: 'left' },
            { field: 'date', title: '日期', width: 150, templet: function (d) { return d.year + '年' + d.month + '月业绩'; } },
            { field: 'type', title: '状态', width: 110 },
            { field: 'cs0', title: '总数', width: 100 },
            { field: 'cs1', title: '创建数量', width: 110 },
            { field: 'cs2', title: '未处理数量', width: 110 },
            { field: 'cs3', title: '通过数量', width: 110 },
            { field: 'cs4', title: '驳回数量', width: 110 }
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
        app.post(api.report.queryApproval7Achievement, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
    }
    query(1);
});
});
