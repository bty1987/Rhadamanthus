/** app/js/material/materialCollection.js —— 主材收款记录（按 mid 列出款项记录，只读）*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var sub = app.params.materialSubOrder || {};
    var PT = { 1: '预付款', 2: '定金', 3: '补款', 5: '补款退款' };
    function ptB(d) { return PT[d.paymentType] || '-'; }
    function stB(d) { var s = d.paymentStatus == 0 ? '待收款' : d.paymentStatus == 1 ? '待确认' : '已确认'; var c = d.paymentStatus == 2 ? 'layui-bg-green' : 'layui-bg-orange'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'paymentType', title: '类型', width: 100, templet: ptB },
                { field: 'material.no', title: '主材单号', width: 140, templet: function (d) { return d.material ? d.material.no : ''; } },
                { field: 'category', title: '品类', width: 120 },
                { field: 'brand', title: '品牌', width: 140 },
                { field: 'referMoney', title: '应收额', width: 100, templet: function (d) { return app.formatMoney(d.referMoney); } },
                { field: 'cash', title: '现金', width: 90, templet: function (d) { return app.formatMoney(d.cash); } },
                { field: 'bank', title: '银行', width: 90, templet: function (d) { return app.formatMoney(d.bank); } },
                { field: 'checkv', title: '转账', width: 90, templet: function (d) { return app.formatMoney(d.checkv); } },
                { field: 'installment', title: '分期', width: 90, templet: function (d) { return app.formatMoney(d.installment); } },
                { field: 'accounts', title: '对公', width: 90, templet: function (d) { return app.formatMoney(d.accounts); } },
                { field: 'advance', title: '预付款', width: 90, templet: function (d) { return app.formatMoney(d.advance); } },
                { field: 'coupon', title: '券', width: 90, templet: function (d) { return app.formatMoney(d.coupon); } },
                { field: 'collectTime', title: '收款时间', width: 160 },
                { field: 'paymentStatus', title: '状态', width: 90, templet: stB }
            ]]
        });
    }
    function query() {
        if (!sub.msoId) { app.showAlert(app.warning, '缺少订单上下文'); return; }
        app.post(api.payment.queryMaterialPaymentByMid, { 'materialPayment.material.mid': sub.msoId }, function (res) { table.reload('resultTable', { data: res.materialPayments || [] }); });
    }
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.materialIndex.url); });
});
}); // end app.ready
