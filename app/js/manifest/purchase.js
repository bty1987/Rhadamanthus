/** app/js/manifest/purchase.js —— 采购单管理（列表 + 查看/修改/入库 + 批量入库）
 *  对齐旧 WebContent/js/manifest/purchase.js。枚举来自 api.ds.manifest（purchaseStatus/purchaseBalanceStatus）。 */
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

    function stB(d) { return statusMap[String(d.status)] || '---'; }
    function bsB(d) { return balanceStatusMap[String(d.balanceStatus)] || '---'; }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox' },
                { field: 'no', title: '采购单号', width: 140 },
                { field: 'user', title: '创建人', width: 100, templet: function (d) { return d.user ? d.user.userName : ''; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'balanceTime', title: '结算时间', width: 120 },
                { field: 'deliveryTime', title: '交期时间', width: 120 },
                { field: 'status', title: '入库状态', width: 100, templet: stB },
                { field: 'balanceStatus', title: '结算状态', width: 100, templet: bsB },
                { field: 'comment', title: '说明', minWidth: 140 },
                { title: '操作', width: 240, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'view') app.switchPage('purchase4view.html?pid=' + d.pid);
            else if (e === 'edit') { if (d.status != 0) { app.showAlert(app.warning, '采购单状态不可操作'); return; } app.switchPage('purchase2edit.html?pid=' + d.pid); }
            else if (e === 'in') app.switchPage('purchase2in.html?pid=' + d.pid);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.inventory.pagePurchase, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    $('#btnBatchin').on('click', function () {
        var rows = table.checkStatus('resultTable').data || [];
        if (!rows.length) { app.showAlert(app.warning, '请选择采购单'); return; }
        var pids = [];
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].status != 0) { app.showAlert(app.warning, '采购单状态不可操作'); return; }
            pids.push(rows[i].pid);
        }
        app.switchPage('purchase2batchin.html?pids=' + pids.join(','));
    });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    form.render();
});
}); // end app.ready
