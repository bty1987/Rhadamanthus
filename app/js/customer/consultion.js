/** app/js/customer/consultion.js —— 客户咨询（旧 consultion.js → layui）
 *  列表：pageConsultion（decoration.orderId eq 检索）→ 咨询内容/装修单号/编号/创建人。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0 };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'comment', title: '咨询内容', minWidth: 260 },
            { field: 'decoration', title: '装修单号', width: 130, templet: function (d) { return d.decoration && d.decoration.orderId ? d.decoration.orderId : '无'; } },
            { field: 'no', title: '编号', width: 130 },
            { field: 'creater', title: '创建人', width: 120, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } }
        ]]
    });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageConsultion, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
