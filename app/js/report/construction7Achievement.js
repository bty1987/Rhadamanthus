/** app/js/report/construction7Achievement.js —— 施工业绩报表（年/月 分组，各工种节点数） */
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
            { field: 'cs0', title: '未开工数', width: 100 },
            { field: 'cs1', title: '开工数', width: 100 },
            { field: 'cs2', title: '完工数', width: 100 },
            { field: 'cs3', title: '砌墙', width: 90 },
            { field: 'cs4', title: '铲大白', width: 90 },
            { field: 'cs5', title: '放线', width: 90 },
            { field: 'cs6', title: '水暖', width: 90 },
            { field: 'cs7', title: '力工', width: 90 },
            { field: 'cs8', title: '电工', width: 90 },
            { field: 'cs9', title: '瓦工', width: 90 },
            { field: 'cs10', title: '地面找平', width: 100 },
            { field: 'cs11', title: '木工', width: 90 },
            { field: 'cs12', title: '油工', width: 90 },
            { field: 'cs13', title: '水电验收', width: 100 },
            { field: 'cs14', title: '保洁', width: 90 }
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
        app.post(api.report.queryConstruction7Achievement, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
    }
    query(1);
});
});
