/** app/js/customer/customerSourceRecord.js —— 客户来源记录（旧 customerSourceRecord.js → layui）
 *  上下文：app.params.customer.customerSource.csid；urlLoadParams.type==0 时只看 type=0 的记录。
 *  列表：pageCustomerSourceRecord → 记录内容/操作人/记录时间。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var ctx = customerCommon.ctx('customer');
    var pageType = customerCommon.ctx('urlLoadParams').type;
    var csid = ctx.customerSource ? ctx.customerSource.csid : ctx.csid;
    var state = { page: 1, rows: 10, total: 0 };

    if (csid == null || csid === '') { app.showAlert(app.warning, '缺少客户来源上下文'); return; }

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'comment', title: '记录内容', minWidth: 260 },
            { field: 'operater', title: '操作人', width: 130, templet: function (d) { return d.operater ? (d.operater.userName || '') : ''; } },
            { field: 'operatTime', title: '记录时间', width: 170 }
        ]]
    });

    function query(pg) {
        state.page = pg || 1;
        var params = {
            'customerSourceRecord.csid': csid,
            'paging.page': state.page,
            'paging.rows': state.rows
        };
        if (pageType == '0' || pageType === 0) params['customerSourceRecord.type'] = pageType;
        app.post(api.customer.pageCustomerSourceRecord, params, function (res) {
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
});
}); // end app.ready
