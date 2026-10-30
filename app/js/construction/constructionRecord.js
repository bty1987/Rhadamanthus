/** app/js/construction/constructionRecord.js —— 工程操作记录（只读列表）
 *  上下文：app.params.orderId。queryConstructionRecordByOrderId（分页，result=constructionRecords）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var pageConfig = constructionCommon.getPageConfig('constructionRecord');
    var state = { page: 1, rows: 10, total: 0 };
    var orderId = app.params.orderId;

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单', width: 150 },
            { field: 'operater', title: '操作人', width: 160, templet: function (d) { return d.operater ? d.operater.currentName : ''; } },
            { field: 'operateTime', title: '操作时间', width: 200 },
            { field: 'comment', title: '说明', minWidth: 300 } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(pageConfig.apiPage || api.construction.queryConstructionRecordByOrderId, $.extend({ 'constructionRecord.orderId': orderId, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
