/** app/js/sales/salesRefunds.js —— 销售退货单（列表 + 打印/退货/推送/确认）
 * refunds.type: 0全部退/1部分退；refunds.status: 0初始/1已推送/2已确认；
 * sales.isAffirm: 0否/1是/2审批中 */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '全部退', 1: '部分退' };
    var STATUS = { 0: '初始', 1: '已推送', 2: '已确认' };
    var AFFIRM = { 0: '否', 1: '是', 2: '审批中' };
    function stB(d) { var s = STATUS[d.status] != null ? STATUS[d.status] : ('状态' + d.status); var c = d.status == 2 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-blue' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    function afB(d, v) { var val = v == null ? d : v; var s = AFFIRM[val] != null ? AFFIRM[val] : '-'; return s; }
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'sales', title: '销售单号', width: 140, templet: function (d) { return (d.sales && d.sales.no) || '-'; } },
                { field: 'category', title: '品类', width: 120, templet: function (d) { return (d.sales && d.sales.category) || '-'; } },
                { field: 'brand', title: '品牌', width: 140, templet: function (d) { return (d.sales && d.sales.brand && d.sales.brand.name) || '-'; } },
                { field: 'total', title: '退款总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
                { field: 'isAffirmSales', title: '购货确认', width: 100, templet: function (d) { return (d.sales && AFFIRM[d.sales.isAffirm] != null) ? AFFIRM[d.sales.isAffirm] : '-'; } },
                { field: 'affirmTime', title: '购货确认时间', width: 170, templet: function (d) { return (d.sales && d.sales.affirmTime) || ''; } },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { field: 'rIsAffirm', title: '退货确认', width: 100, templet: function (d) { return AFFIRM[d.isAffirm] != null ? AFFIRM[d.isAffirm] : '-'; } },
                { field: 'rAffirmTime', title: '退货确认时间', width: 170 },
                { field: 'affirmer', title: '确认人', width: 110, templet: function (d) { return (d.affirmer && d.affirmer.currentName) || '-'; } },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 260, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'print') doPrint(v);
            else if (ev === 'refunds') doRefunds(v);
            else if (ev === 'send') doSend(v);
            else if (ev === 'affirm') doAffirm(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.sales.pageSalesRefunds, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function doPrint(v) {
        app.params.sales.sales = v.sales; app.params.sales.refunds = v; app.params.sales.flag = 'refund';
        app.popup(api.index.salesRefundsPrintIndex.url, '销售退货单:' + (v.sales ? v.sales.orderId : ''), null, { area: ['900px', '600px'] });
    }
    function doRefunds(v) {
        app.params.sales.sales = v.sales; app.params.rid = v.rid; app.params.flag = 'refunds';
        app.popup(api.index.refundsItemDetialIndex.url, '退货', null, { area: ['90%', '80%'] });
    }
    function doSend(v) {
        app.post(api.sales.sendSalesRefunds, { 'refunds.rid': v.rid }, function () { app.showAlert(app.success, '推送成功'); });
    }
    function doAffirm(v) {
        app.post(api.sales.affirmSalesRefunds, { 'refunds.rid': v.rid, 'refunds.sales.customer.cid': v.sales && v.sales.customer ? v.sales.customer.cid : '' }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
});
}); // end app.ready
