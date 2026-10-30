/** app/js/payment/payment2print.js —— 款项明细打印（弹窗打印子页）
 *  上下文：app.params.printConf = { decoration, ptype:[], rtype:[] }。
 *  按 ptype 拉取 预付款/装修款/销售款/服务款，按 rtype 过滤通道，汇总 工程/主材/退款 总额。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var conf = app.params.printConf || {};
    var dec = conf.decoration || {};
    var ptype = conf.ptype || [];
    var rtype = conf.rtype || [];
    var idx = 0;
    var sums = { project: 0, material: 0, refund: 0 };
    var WAY = { cash: '现金', bank: '刷卡', checkv: '银行', installment: '分期', accounts: '对公', advance: '预付款', coupon: '券' };
    function header() {
        return '<table style="font-size:14px;width:100%;border-collapse:collapse;" border="0" cellpadding="1" cellspacing="0">'
            + '<tr><td colspan="8" style="font-size:20px;text-align:center;"><b>收款明细表<\/b><\/td><\/tr>'
            + '<tr><td colspan="4">客户姓名: ' + (dec.customer ? dec.customer.name : '') + '<\/td><td colspan="4">装修单号: ' + (dec.orderId || '') + '<\/td><\/tr>'
            + '<tr><td colspan="4">楼盘地址: ' + (dec.house && dec.house.village ? dec.house.village.name : '') + '<\/td><td colspan="4">设计师: ' + (dec.designer ? dec.designer.currentName : '') + '<\/td><\/tr>'
            + '<\/table>';
    }
    function tableOpen() {
        return '<table style="font-size:12px;width:100%;border-collapse:collapse;border:1px solid #000;" border="1" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr style="background:#f2f2f2;"><td style="width:5%;text-align:center;"><strong>序号<\/strong><\/td><td style="width:20%;text-align:center;"><strong>收款类型<\/strong><\/td><td style="width:10%;text-align:center;"><strong>收款金额<\/strong><\/td><td style="width:10%;text-align:center;"><strong>结算方式<\/strong><\/td><td style="width:20%;text-align:center;"><strong>收款时间<\/strong><\/td><\/tr>';
    }
    function line(typeName, money, way, time) { idx++; return '<tr><td style="text-align:center;">' + idx + '<\/td><td>' + typeName + '<\/td><td>' + app.formatMoney(money) + '<\/td><td>' + way + '<\/td><td>' + (time || '') + '<\/td><\/tr>'; }
    function foot() {
        return '<table style="font-size:14px;width:100%;border-collapse:collapse;border:1px solid #000;" border="1" cellpadding="1" cellspacing="0">'
            + '<tr><td><strong>工程收款总额: ¥' + app.formatMoney(sums.project) + '<\/strong><\/td><\/tr>'
            + '<tr><td><strong>主材收款总额: ¥' + app.formatMoney(sums.material) + '<\/strong><\/td><\/tr>'
            + '<tr><td><strong>退款总额: ¥' + app.formatMoney(sums.refund) + '<\/strong><\/td><\/tr><\/table>';
    }
    function pushChannels(v, prefix) {
        var rows = ''; var any = false;
        var order = ['cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'];
        var rmap = { cash: 1, bank: 2, checkv: 3, installment: 4, accounts: 5, advance: 6, coupon: 7 };
        order.forEach(function (k) {
            var mv = parseFloat(v[prefix ? (prefix + k) : k]) || 0;
            if (mv > 0 && rtype.indexOf(String(rmap[k])) >= 0) { rows += line(v._typeName, mv, WAY[k], v.collectTime || (v._receipt ? v._receipt.collectTime : '')); any = true; }
        });
        return { rows: rows, any: any };
    }
    var html = header() + tableOpen();
    var pending = 0; var done = 0;
    function maybeClose() { done++; if (done == pending) { html += '<\/tbody><\/table>' + foot(); $('#receiptList').html(html); } }
    if (ptype.indexOf('0') >= 0) { pending++; app.post(api.payment.pagePayment, { 'paging.noPage': 1, 'filters[0].field': 'decoration.orderId', 'filters[0].data': dec.orderId, 'filters[0].op': 'eq', 'filters[1].field': 'status', 'filters[1].data': 0, 'filters[1].op': 'ne' }, function (res) {
        var APT = { 1: '合同额', 2: '主材额' }; var AT = { 0: '提款', 1: '收款' };
        (res.paging.data || []).forEach(function (v) { v._typeName = (APT[v.paymentType] || '') + ' ' + (AT[v.type] || ''); var r = pushChannels(v, ''); html += r.rows; if (v.type == 1 && v.paymentType == 1) sums.project = app.utils.accAdd(sums.project, parseFloat(v.cash) + parseFloat(v.bank) + parseFloat(v.checkv)); if (v.type == 1 && v.paymentType == 2) sums.material = app.utils.accAdd(sums.material, parseFloat(v.cash) + parseFloat(v.bank) + parseFloat(v.checkv)); if (v.type == 0) sums.refund = app.utils.accAdd(sums.refund, parseFloat(v.cash) + parseFloat(v.bank) + parseFloat(v.checkv)); });
        maybeClose();
    }); }
    if (ptype.indexOf('1') >= 0) { pending++; app.post(api.payment.pageDecorationPayment, { 'paging.noPage': 1, 'filters[0].field': 'decoration.orderId', 'filters[0].data': dec.orderId, 'filters[0].op': 'eq' }, function (res) {
        (res.paging.data || []).forEach(function (v) { if (v.paymentStatus == 0) return; v._typeName = v.paymentType; var r = pushChannels(v, ''); html += r.rows; if (v.oneType == 0) sums.project = app.utils.accAdd(sums.project, parseFloat(v.referMoney)); else sums.refund = app.utils.accAdd(sums.refund, parseFloat(v.referMoney)); });
        maybeClose();
    }); }
    if (ptype.indexOf('3') >= 0) { pending++; app.post(api.payment.pageSalesPayment, { 'paging.noPage': 1, 'filters[0].field': 'sales.orderId', 'filters[0].data': dec.orderId, 'filters[0].op': 'eq' }, function (res) {
        (res.paging.data || []).forEach(function (v) { v._typeName = (v.sales ? v.sales.no : '') + ' ' + ({ 0: '定金', 1: '补款', 2: '全额' }[v.type] || ''); v._receipt = v.salesReceipt || {}; var r = pushChannels(v, 'salesReceipt.'); html += r.rows; sums.material = app.utils.accAdd(sums.material, parseFloat(v.referMoney)); });
        maybeClose();
    }); }
    if (ptype.indexOf('4') >= 0) { pending++; app.post(api.payment.pageServicePayment, { 'paging.noPage': 1, 'filters[0].field': 'decoration.orderId', 'filters[0].data': dec.orderId, 'filters[0].op': 'eq' }, function (res) {
        (res.paging.data || []).forEach(function (v) { v._typeName = ({ 0: '服务费', 1: '预付款' }[v.type] || ''); v._receipt = v.serviceReceipt || {}; var r = pushChannels(v, 'serviceReceipt.'); html += r.rows; sums.project = app.utils.accAdd(sums.project, parseFloat(v.serviceMoney)); });
        maybeClose();
    }); }
    if (pending === 0) { html += '<\/tbody><\/table>' + foot(); $('#receiptList').html(html); }
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
