/** app/js/sales/sales4payment.js —— 销售收款记录
 * 上下文：app.params.sales.sales = {sid,...}, app.params.sales.type = "sales"|"balance"
 * paymentType: 2=定金/3=补款/5=补款退/7=定金退/8=不退 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var ctx = (app.params.sales && app.params.sales.sales) || {};
    var sType = (app.params.sales && app.params.sales.type) || 'sales';
    var state = { returnIndex: null, curSid: null };
    var PAY = { 2: '定金', 3: '补款', 5: '补款退', 7: '定金退', 8: '不退' };
    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'type', title: '类型', width: 100, templet: function (d) { return PAY[d.type] != null ? PAY[d.type] : '-'; } },
                { field: 'no', title: '销售单号', width: 140, templet: function (d) { return (d.sales && d.sales.no) || '-'; } },
                { field: 'category', title: '品类', width: 110, templet: function (d) { return (d.sales && d.sales.category) || '-'; } },
                { field: 'brand', title: '品牌', width: 130, templet: function (d) { return (d.sales && d.sales.brand && d.sales.brand.name) || '-'; } },
                { field: 'referMoney', title: '应收额', width: 110, templet: function (d) { return app.formatMoney(d.referMoney); } },
                { field: 'cash', title: '现金', width: 90, templet: function (d) { return fmtMoney(d.salesReceipt, 'cash'); } },
                { field: 'bank', title: '银行', width: 90, templet: function (d) { return fmtMoney(d.salesReceipt, 'bank'); } },
                { field: 'checkv', title: '转账', width: 90, templet: function (d) { return fmtMoney(d.salesReceipt, 'checkv'); } },
                { field: 'accounts', title: '对公', width: 90, templet: function (d) { return fmtMoney(d.salesReceipt, 'accounts'); } },
                { field: 'advance', title: '预付款', width: 90, templet: function (d) { return fmtMoney(d.salesReceipt, 'advance'); } },
                { field: 'collectTime', title: '收款时间', width: 170, templet: function (d) { return (d.salesReceipt && d.salesReceipt.collectTime) || ''; } },
                { field: 'confirmTime', title: '确认时间', width: 170, templet: function (d) { return (d.salesReceipt && d.salesReceipt.confirmTime) || ''; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = d.status == 0 ? '初始' : d.status == 1 ? '待确认' : '已确认'; var c = d.status == 2 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-orange' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { title: '操作', width: 170, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'refund') openRefund(obj.data);
            else if (obj.event === 'settle') doSettle(obj.data);
        });
    }
    function fmtMoney(r, k) { return (r && r[k] != null && r[k] != '0') ? app.formatMoney(r[k]) : '-'; }
    function query() {
        if (!ctx.sid) { app.showAlert(app.warning, '缺少销售单参数'); return; }
        app.post(api.payment.querySalesPaymentBySid, { 'salesPayment.sales.sid': ctx.sid }, function (res) {
            table.reload('resultTable', { data: res.salesPayments || [] });
        });
    }
    function openRefund(v) {
        state.curSid = v.sales ? v.sales.sid : ctx.sid;
        $('#returnTotal').val(v.referMoney);
        $('#approver').val(''); $('#comment').val('');
        state.returnIndex = layer.open({ type: 1, title: '撤款信息', content: $('#returnBox'), area: ['480px', 'auto'] });
    }
    function doRefundSubmit() {
        var uid = $.trim($('#approver').val());
        if (!uid) { app.showAlert(app.warning, '请填写审批人 userId'); return; }
        app.post(api.approval.submitApprovalForSalesDayment, {
            'approval.receiver.userId': uid,
            'approval.comment': $('#comment').val(),
            'approvalSalesDayment.sid': state.curSid
        }, function () {
            app.showAlert(app.success, '操作成功'); layer.close(state.returnIndex); state.returnIndex = null;
        });
    }
    function doSettle(v) {
        app.showConfirm('是否确认落款，落款将直接使用主材预付款余额抵扣：' + v.referMoney + '元', function () {
            app.post(api.payment.settleSalesPayment, { 'salesPayment.spid': v.spid, 'salesPayment.advanceType': 3, 'salesPayment.sales.orderId': v.sales ? v.sales.orderId : '' }, function () {
                app.showAlert(app.success, '落款成功'); query();
            });
        });
    }
    $('#btnApproveSave').on('click', doRefundSubmit);
    $('#btnApproveCancel').on('click', function () { layer.close(state.returnIndex); state.returnIndex = null; });
});
}); // end app.ready
