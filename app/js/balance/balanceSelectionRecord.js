/** app/js/balance/balanceSelectionRecord.js —— 结算选材记录（弹窗子页，只读列表）
 * 上下文：app.params.balance.bsid */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var bsid = (app.params.balance && app.params.balance.bsid) || '';
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '初始', 1: '锁定', 2: '待审', 3: '审核' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'operater', title: '操作人', width: 120, templet: function (d) { return (d.operater && d.operater.userName) || '-'; } },
                { field: 'operateTime', title: '操作时间', width: 180 },
                { field: 'type', title: '类型', width: 100, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
                { field: 'comment', title: '说明', minWidth: 200 } ]] });
    }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.balance.queryBalanceSelectionRecord, { 'balanceSelectionRecord.balanceSelection.bsid': bsid, 'paging.page': state.page, 'paging.rows': state.rows }, function (res) {
            var arr = res.balanceSelectionRecords || (res.paging && res.paging.data) || [];
            table.reload('resultTable', { data: arr });
            state.total = (res.paging && res.paging.totalRecords) || arr.length;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
});
}); // end app.ready
