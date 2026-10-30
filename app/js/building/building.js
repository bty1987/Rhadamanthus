/** app/js/building/building.js —— 楼盘管理（列表 + 结算状态切换）*/
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    function balBadge(d) { var cls = d.balanceStatus == 0 ? 'layui-bg-gray' : 'layui-bg-green'; var txt = d.balanceStatus == 0 ? '未结算' : '已结算'; return '<span class="layui-badge ' + cls + '">' + txt + '<\/span>'; }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'bid', title: '楼盘ID', width: 90 },
                { field: 'name', title: '楼盘名', minWidth: 160, templet: function (d) { return d.name || d.bid; } },
                { field: 'payType', title: '付款类型', width: 110 },
                { field: 'balanceStatus', title: '结算状态', width: 100, templet: balBadge },
                { title: '操作', width: 200, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'balance') updateBalance(obj.data.bid, 1);
            else if (obj.event === 'unbalance') updateBalance(obj.data.bid, 0);
        });
    }
    function query(page) { state.page = page || 1; app.post(api.building.pageBuilding, { 'paging.page': state.page, 'paging.rows': state.rows }, function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function updateBalance(bid, status) { app.showConfirm(status == 1 ? '确认结算？' : '确认取消结算？', function () { app.post(api.building.updateBuildingForBalanceStatus, { 'building.bid': bid, 'building.balanceStatus': status }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
});
}); // end app.ready
