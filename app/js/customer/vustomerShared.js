/** app/js/customer/vustomerShared.js —— 共享客户（旧 vustomerShared.js → layui）
 *  列表：pageVustomerForCommunion（name eq）；行操作：认领 takeVustomer。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0 };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'phone', title: '电话', width: 130 },
            { field: 'name', title: '客户名称', minWidth: 110 },
            { field: 'address', title: '客户地址', minWidth: 180 },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'referrer', title: '推荐人', width: 100 },
            { field: 'referphone', title: '推荐人电话', width: 120 },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'contractPrice', title: '合同额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.contractPrice); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.vustomerStatus, d.status); } },
            { field: 'comment', title: '说明', minWidth: 140 },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'claim') {
            app.showConfirm('是否确认领取客户', function () {
                app.post(api.customer.takeVustomer, { 'vustomer.vid': obj.data.vid }, function () {
                    app.showAlert(app.success, '领取成功');
                    query(state.page);
                });
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="claim">认领</button>'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageVustomerForCommunion, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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
