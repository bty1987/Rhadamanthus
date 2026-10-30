/** app/js/payment/paymentReceipt.js —— 预付款专用收款收据（弹窗打印子页）
 *  上下文：app.params.payment = { pid, orderId, cid, profit? }。
 *  paymentType: 1=合同预付款（公司收款收据）, 2=主材预付款（公司代收款收据）。
 *  通道：cash/bank/checkv/transfer（>0 才显示一行）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var ctx = app.params.payment || {};
    if (!ctx.pid) { $('#receipt').html('<p style="text-align:center;">缺少收款信息</p>'); return; }
    var PAYMENT_TYPE = { 1: '合同预付款', 2: '主材预付款' };
    var company = { drganization: { name: '' }, srganization: { name: '' } };
    app.post(api.payment.queryPaymentByPaymentId, { 'payment.pid': ctx.pid }, function (res) {
        var payment = res.payment || {};
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': ctx.orderId }, function (dr) {
            var dec = dr.decoration || {};
            var cid = ctx.profit == null ? dec.dompany : dec.bompany;
            app.post(api.system.queryCompanyByCid, { 'company.cid': cid }, function (cr) {
                company = cr.company || company;
                render(payment, dec);
            }, function () { render(payment, dec); });
        }, function () { render(payment, {}); });
    });
    function render(payment, dec) {
        var orgName = payment.paymentType == 1 ? (company.drganization.name + '收款收据') : (company.srganization.name + '代收款收据');
        var addr = dec && dec.house ? ((dec.house.village ? (dec.house.village.name + ' ') : '') + dec.house.houseNumber) : '';
        var items = [];
        var total = 0;
        [['cash', '现金'], ['bank', '刷卡'], ['checkv', '银行'], ['transfer', '预付款转换']].forEach(function (p) {
            var v = parseFloat(payment[p[0]]) || 0;
            if (v != 0) { items.push({ way: p[1], money: v }); total = app.utils.accAdd(total, v); }
        });
        var receiptNo = ('0000000000' + payment.arId).slice(-10);
        var cn = app.utils.getCNMoney ? app.utils.getCNMoney(total) : '';
        var h = '<center><table style="width:90%;border-collapse:collapse;" border="0" cellpadding="0" cellspacing="0">'
            + '<tr><td colspan="4" style="text-align:center;"><span style="float:left;">编号:' + receiptNo + '<\/span><h2>' + orgName + '<\/h2><\/td><\/tr>'
            + '<tr><td colspan="2">客户名: ' + (payment.customer ? payment.customer.name : '') + '<\/td><td colspan="2">收款日期: ' + (payment.collectTime || '') + '<\/td><\/tr>'
            + '<tr><td colspan="2">装修单号: ' + (dec.orderId || ctx.orderId || '') + '<\/td><td colspan="2">楼盘: ' + addr + '<\/td><\/tr>'
            + '<tr style="background:#f2f2f2;"><td style="text-align:center;width:25%;">收款类型<\/td><td style="text-align:center;" colspan="2">结算方式<\/td><td style="text-align:center;">收款金额(元)<\/td><\/tr>';
        items.forEach(function (it) {
            h += '<tr><td style="text-align:center;">' + (PAYMENT_TYPE[payment.paymentType] || '') + '<\/td><td style="text-align:center;" colspan="2">' + it.way + '<\/td><td style="text-align:center;">' + app.formatMoney(it.money) + '<\/td><\/tr>';
        });
        h += '<tr><td colspan="3">人民币大写: ' + cn + '<\/td><td>实收: ¥' + app.formatMoney(total) + '<\/td><\/tr>'
            + '<tr><td colspan="4" style="text-align:right;padding-right:40px;">收款人: ' + (payment.collectUser ? payment.collectUser.currentName : '') + ' 交款人:<\/td><\/tr>'
            + '<\/table><\/center>';
        $('#receipt').html(h);
    }
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
