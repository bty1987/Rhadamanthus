/** app/js/sales/salesBalance4check.js —— 销售结算单审核
 * type 决定接口：check/supplier/pompany/dompany。提交到 balance 模块。
 * salesBalance.status: 0初始/1预结/2厂商结算/3平台结算/4已结算；
 * onetype: 0销售/1退货；verifyStatus/confirmStatus/deliverStatus 来自 ds。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || 'check';
    var state = { page: 1, rows: 10, total: 0, balanceIndex: null };
    var listApi = api.sales.pageSalesBalanceForCheck;
    if (pageType == 'supplier') listApi = api.sales.pageSalesBalanceForSupplier;
    else if (pageType == 'pompany') listApi = api.sales.pageSalesBalanceForPompany;
    else if (pageType == 'dompany') listApi = api.sales.pageSalesBalanceForDompany;
    var STATUS = { 0: '初始', 1: '预结', 2: '厂商结算', 3: '平台结算', 4: '已结算' };
    var ONETYPE = { 0: '销售', 1: '退货' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'sales', title: '销售单号', width: 140, templet: function (d) { return (d.sales && d.sales.no) || '-'; } },
                { field: 'orderId', title: '装修单号', width: 140, templet: function (d) { return (d.sales && d.sales.orderId) || '-'; } },
                { field: 'brand', title: '品牌', width: 130, templet: function (d) { return (d.sales && d.sales.brand && d.sales.brand.name) || '-'; } },
                { field: 'category', title: '品类', width: 110, templet: function (d) { return (d.sales && d.sales.category) || '-'; } },
                { field: 'onetype', title: '类型', width: 80, templet: function (d) { return ONETYPE[d.onetype] != null ? ONETYPE[d.onetype] : '-'; } },
                { field: 'balance', title: '结算额', width: 110, templet: function (d) { return app.formatMoney(d.balance); } },
                { field: 'difference', title: '差额', width: 100, templet: function (d) { return app.formatMoney(d.difference); } },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'allowance', title: '折让', width: 100, templet: function (d) { return app.formatMoney(d.allowance); } },
                { field: 'vbalance', title: '厂商结算', width: 110, templet: function (d) { return app.formatMoney(d.vbalance); } },
                { field: 'pbalance', title: '平台结算', width: 110, templet: function (d) { return app.formatMoney(d.pbalance); } },
                { field: 'coupon', title: '券', width: 90, templet: function (d) { return app.formatMoney(d.coupon); } },
                { field: 'rate', title: '系数', width: 90 },
                { field: 'status', title: '状态', width: 100, templet: function (d) { return STATUS[d.status] != null ? STATUS[d.status] : '-'; } },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'detail') openDetail(obj.data); });
        table.on('checkbox(resultTable)', function (obj) {});
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openDetail(v) {
        app.params.sales = { salesBalance: { sbid: v.sbid }, sales: { sid: v.sales ? v.sales.sid : null } };
        app.popup('/views/sales/salesItem4balance.html', '结算单明细 ' + (v.sales ? v.sales.no : ''), null, { area: ['90%', '80%'] });
    }
    function openBalance() {
        var checks = table.checkStatus('resultTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请选择结算单'); return; }
        $('#balanceSales').val('');
        state.balanceIndex = layer.open({ type: 1, title: '提交到结算单', content: $('#balanceBox'), area: ['480px', 'auto'] });
    }
    function doBalance() {
        if (app.validate('balanceForm')) return;
        var bsid = $('#balanceSales').val();
        var checks = table.checkStatus('resultTable').data;
        var count = 0;
        app.post(api.balance.countBalanceSalesBalance, { 'balanceSales.bsid': bsid }, function (res) {
            count = res.count || 0;
            if (count + checks.length > 500) { app.showAlert(app.warning, '数据量过大'); return; }
            var opt = { 'balanceSales.bsid': bsid };
            $.each(checks, function (i, v) { opt['balanceSalesBalances[' + i + '].salesBalance.sbid'] = v.sbid; });
            app.post(api.balance.submitBalanceSales, opt, function () {
                app.showAlert(app.success, '操作成功'); layer.close(state.balanceIndex); state.balanceIndex = null; query(state.page);
            });
        }, function () {
            var opt = { 'balanceSales.bsid': bsid };
            $.each(checks, function (i, v) { opt['balanceSalesBalances[' + i + '].salesBalance.sbid'] = v.sbid; });
            app.post(api.balance.submitBalanceSales, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.balanceIndex); state.balanceIndex = null; query(state.page); });
        });
    }
    function selectAll() {
        var cache = layui.table.cache.resultTable || [];
        // 切换全选
        $('.layui-table-body input[type="checkbox"]').each(function () { this.click(); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSelectAll').on('click', selectAll);
    $('#btnBalance').on('click', doBalance);
    $('#btnBalanceCancel').on('click', function () { layer.close(state.balanceIndex); state.balanceIndex = null; });
    // 顶部按钮触发"提交到结算单"
    $('#btnSelectAll').after('<button type="button" class="layui-btn layui-btn-normal" id="btnSubmitBalance" style="margin-left:8px;"><i class="layui-icon layui-icon-ok"></i>提交到结算单</button>');
    $('#btnSubmitBalance').on('click', openBalance);
});
}); // end app.ready
