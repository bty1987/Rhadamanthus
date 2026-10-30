/** app/js/payment/activityPaymentReceipt.js —— 活动款专用收据（弹窗打印子页）
 *  上下文：app.params.payment = { activityPayment: { arid } }。
 *  数据源：queryActivityPaymentByArid（活动款明细）+ queryActivityReceiptByArid（通道明细）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var ctx = app.params.payment || {};
    var arid = ctx.activityPayment ? ctx.activityPayment.arid : ctx.arid;
    if (!arid) { $('#receipt').html('<p style="text-align:center;">缺少收据信息</p>'); return; }
    app.post(api.payment.queryActivityPaymentByArid, { 'activityPayment.activityReceipt.arid': arid }, function (res) {
        var payments = res.activityPayments || [];
        app.post(api.payment.queryActivityReceiptByArid, { 'activityReceipt.arid': arid }, function (rr) {
            render(payments, rr.activityReceipt || {});
        });
    });
    function render(payments, receipt) {
        var items = []; var total = 0;
        [['cash', '现金'], ['bank', '刷卡'], ['coupon', '券']].forEach(function (p) {
            var v = parseFloat(receipt[p[0]]) || 0;
            if (v != 0) { items.push({ way: p[1], money: v }); total = app.utils.accAdd(total, v); }
        });
        var cn = app.utils.getCNMoney ? app.utils.getCNMoney(total) : '';
        var receiptNo = ('0000000000' + arid).slice(-10);
        var first = payments[0] || {};
        var h = '<center><table style="width:90%;border-collapse:collapse;" border="0" cellpadding="0" cellspacing="0">'
            + '<tr><td colspan="4" style="text-align:center;"><span style="float:left;">编号:' + receiptNo + '<\/span><h2>专用收据<\/h2><\/td><\/tr>'
            + '<tr><td colspan="2">会员号: ' + (first.mno || '') + '<\/td><td colspan="2">收款日期: ' + (receipt.collectTime || '') + '<\/td><\/tr>'
            + '<tr><td colspan="2">订单号: ' + (first.orderId || '') + '<\/td><td colspan="2">品牌: ' + (first.brand || '') + '<\/td><\/tr>'
            + '<tr style="background:#f2f2f2;"><td style="text-align:center;width:25%;">类型<\/td><td style="text-align:center;">应收<\/td><td style="text-align:center;">结算方式<\/td><td style="text-align:center;">实收<\/td><\/tr>';
        payments.forEach(function (p) {
            h += '<tr><td style="text-align:center;">' + ({ 0: '定金', 1: '补款', 2: '全额' }[p.type] || '') + '<\/td><td style="text-align:center;">' + app.formatMoney(p.money) + '<\/td><td style="text-align:center;" colspan="2"><\/td><\/tr>';
        });
        items.forEach(function (it) { h += '<tr><td colspan="2"><\/td><td style="text-align:center;">' + it.way + '<\/td><td style="text-align:center;">' + app.formatMoney(it.money) + '<\/td><\/tr>'; });
        h += '<tr><td colspan="3">人民币大写: ' + cn + '<\/td><td>实收: ¥' + app.formatMoney(total) + '<\/td><\/tr>'
            + '<tr><td colspan="4" style="text-align:right;padding-right:40px;">收款人: ' + (receipt.collecter ? receipt.collecter.currentName : '') + ' 交款人:<\/td><\/tr><\/table><\/center>';
        $('#receipt').html(h);
    }
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
