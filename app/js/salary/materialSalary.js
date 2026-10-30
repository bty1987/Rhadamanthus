/** app/js/salary/materialSalary.js —— 主材薪资（列表查询）
 *  对齐旧 WebContent/js/salary/materialSalary.js。
 *  pagetype=belong 时按当前登录用户过滤，隐藏归属人列。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, belong: false };

    var STAGE_MAP = { 0: '全部', 1: '首提', 2: '中提', 3: '尾提' };
    var belongUserId = (app.params.userInfo && app.params.userInfo.user) ? app.params.userInfo.user.userId : '';

    laydate.render({ elem: '#createTime', range: '~' });

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'orderId', title: '装修单号', width: 120, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
                { field: 'no', title: '销售单号', width: 130, templet: function (d) { return d.sales ? (d.sales.no || '') : ''; } },
                { field: 'village', title: '楼盘', width: 110, templet: function (d) { return (d.decoration && d.decoration.house && d.decoration.house.village) ? (d.decoration.house.village.name || '') : ''; } },
                { field: 'houseNumber', title: '楼号', width: 100, templet: function (d) { return (d.decoration && d.decoration.house) ? (d.decoration.house.houseNumber || '') : ''; } },
                { field: 'category', title: '品类', width: 110, templet: function (d) { return d.sales ? (d.sales.category || '') : ''; } },
                { field: 'brand', title: '品牌', width: 110, templet: function (d) { return d.sales ? (d.sales.brand || '') : ''; } },
                { field: 'belonger', title: '归属人', width: 110, hide: state.belong, templet: function (d) { return d.belonger ? (d.belonger.currentName || '') : ''; } },
                { field: 'period', title: '账期', width: 100 },
                { field: 'money', title: '金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'rate', title: '比例', width: 90 },
                { field: 'stage', title: '阶段', width: 90, templet: function (d) { return '<span class="layui-badge layui-bg-blue">' + (STAGE_MAP[d.stage] || '---') + '<\/span>'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'comment', title: '备注', minWidth: 140 } ]] });
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
        if (state.belong && belongUserId) opt['materialSalary.belonger.userId'] = belongUserId;
        app.post(api.salary.pageMaterialSalary, opt, function (res) {
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
