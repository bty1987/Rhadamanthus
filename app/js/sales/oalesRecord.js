/** app/js/sales/oalesRecord.js —— 外销单操作记录（列表）
 * 上下文：app.params.sales.oales = {oid} */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var ctx = (app.params.sales && app.params.sales.oales) || {};
    // oalesRecord.type 操作类型：0创建/1提交/2确认/3审核/4完成/5取消/6驳回
    var TYPE = { 0: '创建', 1: '提交', 2: '确认', 3: '审核', 4: '完成', 5: '取消', 6: '驳回' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'operateTime', title: '操作时间', width: 170 },
                { field: 'type', title: '操作类型', width: 110, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '未知'; } },
                { field: 'comment', title: '操作说明', minWidth: 200 },
                { field: 'operate', title: '操作人', width: 130, templet: function (d) { return (d.operate && d.operate.currentName) || '-'; } },
                { field: 'beforeStatus', title: '操作前状态', width: 110, templet: function (d) { return (d.beforeStatus == null || d.beforeStatus === undefined) ? '-' : d.beforeStatus; } },
                { field: 'afterStatus', title: '操作后状态', width: 110, templet: function (d) { return (d.afterStatus == null || d.afterStatus === undefined) ? '-' : d.afterStatus; } } ]] });
    }
    function query(pg) {
        state.page = pg || 1;
        if (!ctx.oid) { app.showAlert(app.error, '缺少外销单ID参数'); return; }
        app.post(api.sales.pageOalesRecord, $.extend({}, { 'oid': ctx.oid, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
});
}); // end app.ready
