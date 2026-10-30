/** app/js/payment/decorationPaymentReceipt.js —— 装修款收款收据（弹窗打印子页）
 *  上下文：app.params.payment = { orderId, drId, profit? }。
 *  数据源：queryDecorationPaymentForNotInitByDrId（多笔款项）+ queryDecoraionReceiptByDrId（通道明细）+ decoration common + company。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var ctx = app.params.payment || {};
    if (!ctx.drId) { $('#receipt').html('<p style="text-align:center;">缺少收据信息</p>'); return; }
    var company = {};
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': ctx.orderId }, function (dr) {
        var dec = dr.decoration || {};
        var cid = ctx.profit == null ? dec.dompany : dec.bompany;
        app.post(api.system.queryCompanyByCid, { 'company.cid': cid }, function (cr) { company = cr.company || {}; }, function () {});
        app.post(api.payment.queryDecorationPaymentForNotInitByDrId, { 'decorationReceipt.drId': ctx.drId }, function (res) {
            var payments = res.decorationPayments || [];
            app.post(api.payment.queryDecoraionReceiptByDrId, { 'decorationReceipt.drId': ctx.drId }, function (rr) {
                render(payments, rr.decorationReceipt || {}, dec);
            });
        });
    });
    function render(payments, receipt, dec) {
        var addr = dec && dec.house ? ((dec.house.village ? (dec.house.village.name + ' ') : '') + dec.house.houseNumber) : '';
        var items = []; var total = 0;
        [['cash', '现金'], ['bank', '刷卡'], ['checkv', '银行'], ['installment', '分期'], ['accounts', '对公'], ['advance', '预付款'], ['coupon', '优惠券']].forEach(function (p) {
            var v = parseFloat(receipt[p[0]]) || 0;
            if (v != 0) { items.push({ way: p[1], money: v }); total = app.utils.accAdd(total, v); }
        });
        var cn = app.utils.getCNMoney ? app.utils.getCNMoney(total) : '';
        var receiptNo = ('0000000000' + ctx.drId).slice(-10);
        var h = '<center><table style="width:90%;border-collapse:collapse;" border="0" cellpadding="0" cellspacing="0">'
            + '<tr><td colspan="4" style="text-align:center;"><span style="float:left;">编号:' + receiptNo + '<\/span><h2>' + (company.name || '') + '收款收据<\/h2><\/td><\/tr>'
            + '<tr><td colspan="2">客户名: ' + (payments[0] && payments[0].decoration && payments[0].decoration.customer ? payments[0].decoration.customer.name : '') + '<\/td><td colspan="2">收款日期: ' + (receipt.collectTime || '') + '<\/td><\/tr>'
            + '<tr><td colspan="2">装修单号: ' + (dec.orderId || ctx.orderId || '') + '<\/td><td colspan="2">楼盘: ' + addr + '<\/td><\/tr>'
            + '<tr style="background:#f2f2f2;"><td style="text-align:center;width:25%;">款项<\/td><td style="text-align:center;">应收<\/td><td style="text-align:center;">结算方式<\/td><td style="text-align:center;">实收<\/td><\/tr>';
        payments.forEach(function (p) { h += '<tr><td style="text-align:center;">' + (p.paymentType || '') + '<\/td><td style="text-align:center;">' + app.formatMoney(p.referMoney) + '<\/td><td style="text-align:center;" colspan="2"><\/td><\/tr>'; });
        items.forEach(function (it) { h += '<tr><td style="text-align:center;"><\/td><td style="text-align:center;"><\/td><td style="text-align:center;">' + it.way + '<\/td><td style="text-align:center;">' + app.formatMoney(it.money) + '<\/td><\/tr>'; });
        h += '<tr><td colspan="3">人民币大写: ' + cn + '<\/td><td>实收: ¥' + app.formatMoney(total) + '<\/td><\/tr>'
            + '<tr><td colspan="4" style="text-align:right;padding-right:40px;">收款人: ' + (receipt.collecter ? receipt.collecter.currentName : '') + ' 交款人:<\/td><\/tr><\/table><\/center>';
        $('#receipt').html(h);
    }
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
