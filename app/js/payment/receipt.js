/** app/js/payment/receipt.js —— 收据流水
 *  列表（pageReceipt）+ 导出（createPlan，task=export_payment_receipt，需执行时间）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var PTYPE = { 0: '合同预付款', 1: '主材预付款', 2: '装修款', 3: '销售款', 4: '服务款', 5: '活动款', 6: '外销款' };
    var RTYPE = { 0: '现金', 1: '刷卡', 2: '银行', 3: '分期', 4: '对公', 5: '预付款', 6: '券' };
    function ptB(d) { return PTYPE[d.paymentType] || '-'; }
    function rtB(d) { return RTYPE[d.receiptType] || '-'; }
    function tpB(d) { var s = d.type == 0 ? '收款' : '退款'; var c = d.type == 0 ? 'layui-bg-green' : 'layui-bg-red'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    laydate.render({ elem: '#collectTime' });
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'orderId', title: '装修单号', width: 160 }, { field: 'type', title: '类型', width: 80, templet: tpB }, { field: 'paymentType', title: '款项类型', width: 110, templet: ptB }, { field: 'paymentName', title: '款项名称', width: 140 }, { field: 'receiptType', title: '收据类型', width: 100, templet: rtB }, { field: 'name', title: '名称', width: 140, templet: function (d) { return d.name || '无'; } }, { field: 'money', title: '金额', width: 110, templet: function (d) { return app.formatMoney(d.money); } }, { field: 'collectTime', title: '收款时间', width: 170 } ]] });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageReceipt, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
