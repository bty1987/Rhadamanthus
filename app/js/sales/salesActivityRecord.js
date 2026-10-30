/** app/js/sales/salesActivityRecord.js —— 销售活动项操作记录（列表）
 * 上下文：app.params.sales.salesActivityItem = {saiid} */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var ctx = (app.params.sales && app.params.sales.salesActivityItem) || {};
    // salesActivityItem.state: 0待领取/1已领取/2已发放/3已使用/4已退款/5已作废
    var STATE = { 0: '待领取', 1: '已领取', 2: '已发放', 3: '已使用', 4: '已退款', 5: '已作废', 6: '升级', 7: '消耗', 8: '折扣' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'operate', title: '操作人', width: 140, templet: function (d) { return (d.operate && d.operate.currentName) || '-'; } },
                { field: 'operateTime', title: '操作时间', width: 170 },
                { field: 'type', title: '类型', width: 110, templet: function (d) { return STATE[d.type] != null ? STATE[d.type] : ('类型' + d.type); } },
                { field: 'comment', title: '说明', minWidth: 200 } ]] });
    }
    function query(pg) {
        state.page = pg || 1;
        if (!ctx.saiid) { app.showAlert(app.warning, '缺少活动项参数'); return; }
        app.post(api.sales.querySalesActivityRecord, $.extend({}, { 'salesActivityRecord.salesActivityItem.saiid': ctx.saiid, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var list = (res.salesActivityRecords || []);
            table.reload('resultTable', { data: list });
            state.total = list.length; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
});
}); // end app.ready
