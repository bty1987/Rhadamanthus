/** app/js/payment/statement.js —— 对账单（第三方支付对账流水，只读列表）
 *  筛选：custNo / type / status / payTime。列：订单号/金额/手续费/费率/创建时间/付款时间/类型/状态。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '支付宝', 1: '微信', 2: '银联' };
    var STATUS = { 0: '待处理', 1: '成功', 2: '失败' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 1 ? 'layui-bg-green' : d.status == 2 ? 'layui-bg-red' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    laydate.render({ elem: '#payTime' });
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'orderNo', title: '订单号', width: 200 }, { field: 'price', title: '金额', width: 110, templet: function (d) { return app.formatMoney(d.price); } }, { field: 'fee', title: '手续费', width: 100, templet: function (d) { return app.formatMoney(d.fee); } }, { field: 'rate', title: '费率', width: 90 }, { field: 'createTime', title: '创建时间', width: 170 }, { field: 'payTime', title: '付款时间', width: 170 }, { field: 'type', title: '类型', width: 90, templet: tpB }, { field: 'status', title: '状态', width: 90, templet: stB } ]] });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageStatement, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
