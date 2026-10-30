/** app/js/manifest/purchaseBalance.js —— 采购结算单（列表 + 查看/结算/完结）
 *  对齐旧 WebContent/js/manifest/purchaseBalance.js。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var statusMap = {}, balanceStatusMap = {};

    app.post(api.ds.manifest, {}, function (res) {
        var ps = res.purchaseStatus || [], pbs = res.purchaseBalanceStatus || [];
        for (var i = 0; i < ps.length; i++) { statusMap[ps[i].key] = ps[i].value; }
        for (var j = 0; j < pbs.length; j++) { balanceStatusMap[pbs[j].key] = pbs[j].value; }
        initTable(); query(1);
    });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '采购单号', width: 140 },
                { field: 'user', title: '创建人', width: 100, templet: function (d) { return d.user ? d.user.userName : ''; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'balanceTime', title: '结算时间', width: 120 },
                { field: 'deliveryTime', title: '交期时间', width: 120 },
                { field: 'status', title: '入库状态', width: 100, templet: function (d) { return statusMap[String(d.status)] || '---'; } },
                { field: 'balanceStatus', title: '结算状态', width: 100, templet: function (d) { return balanceStatusMap[String(d.balanceStatus)] || '---'; } },
                { field: 'comment', title: '说明', minWidth: 140 },
                { title: '操作', width: 260, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'view') app.switchPage('purchase4view.html?pid=' + d.pid);
            else if (e === 'balance') app.switchPage('purchaseBalance2balance.html?pid=' + d.pid + '&balanceStatus=' + d.balanceStatus);
            else if (e === 'finish') {
                if (d.balanceStatus == 2) { app.showAlert(app.warning, '采购单已完结'); return; }
                app.showConfirm('确认完结采购单?', function () {
                    app.post(api.inventory.updatePurchaseForBalanceStatus, { 'purchase.pid': d.pid, 'purchase.balanceStatus': 2 }, function () { query(state.page); });
                });
            }
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.inventory.pagePurchase, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    form.render();
});
}); // end app.ready
