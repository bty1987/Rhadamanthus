/** app/js/decoration/decorationSales2print.js —— 主材消费明细打印
 *  上下文：app.params.decoration = { orderId }。
 *  数据：装修单（queryDecorationForCommonByOrderId）+ 配比（queryDecorationHolonomy）+ 主材预付款
 *  （queryAdvancePaymentByOrderId）+ 销售款（querySalesPaymentByOrderId），按品牌分组合计。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var ctx = app.params.decoration || {};
    var orderId = ctx.orderId;
    var TYPENESS = decorationCommon.ENUM.typeness;
    var decoration = {}, holonomy = {}, materialBalance = 0;
    var rows = {};   // bid → {category, brand, total}
    var total = 0;

    if (!orderId) { $('#mainTable').html('<tr><td>缺少订单上下文<\/td><\/tr>'); return; }

    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) { decoration = res.decoration || {}; }, null, false);
    app.post(api.decoration.queryDecorationHolonomy, { 'decorationHolonomy.decoration.orderId': orderId }, function (res) { holonomy = res.decorationHolonomy || {}; }, null, false);
    app.post(api.payment.queryAdvancePaymentByOrderId, { 'advancePayment.decoration.orderId': orderId }, function (res) { materialBalance = res.materialAdvance; }, null, false);

    var h = decoration.house || {};
    function td(t) { return '<td>' + (t == null ? '' : t) + '<\/td>'; }
    var html = '';
    html += '<tr>' + td('客户姓名：' + ((decoration.customer && decoration.customer.name) || '')) + td('装修单号：' + orderId)
        + td('楼盘地址：' + ((h.village && h.village.name) || '') + ' ' + (h.houseNumber || '')) + '<\/tr>';
    html += '<tr>' + td('订单类型：' + (TYPENESS[decoration.typeness] || '')) + td('设计师：' + ((decoration.designer && decoration.designer.currentName) || ''))
        + td('设计部：' + (decoration.designer && decoration.designer.dept ? decoration.designer.dept.name : '')) + '<\/tr>';
    html += '<tr>' + td('配比金额：' + (holonomy.materialPrice != null ? app.formatMoney(holonomy.materialPrice) : '0'))
        + td('主材预付款余额：' + app.formatMoney(materialBalance)) + td('合计消费金额：<b id="sumTotal">0<\/b>') + '<\/tr>';
    html += '<tr>' + td('序号') + td('品类') + td('品牌') + td('金额') + '<\/tr>';
    $('#mainTable').html(html);

    app.post(api.payment.querySalesPaymentByOrderId, { 'salesPayment.sales.orderId': orderId }, function (res) {
        var items = res.salesPayments || [];
        $.each(items, function (i, v) {
            if (v.status == 0) return;                       // 未付款跳过
            var bid = v.sales && v.sales.brand ? v.sales.brand.bid : '';
            var refer = [2, 3, 8].indexOf(v.type) != -1 ? v.referMoney : -v.referMoney;
            if (rows[bid]) { rows[bid].total = app.utils.changeThrDecimal(app.utils.accAdd(rows[bid].total, refer)); }
            else {
                rows[bid] = { category: v.sales.category, brand: v.sales.brand ? v.sales.brand.name : '', total: refer };
            }
            total = app.utils.changeThrDecimal(app.utils.accAdd(total, refer));
        });
        var idx = 0, body = '';
        $.each(rows, function (bid, r) {
            idx++;
            body += '<tr>' + td(idx) + td(r.category) + td(r.brand) + td(r.total) + '<\/tr>';
        });
        $('#mainTable').append(body);
        $('#sumTotal').text(total);
        $('#suffix').text('此表格为入驻我司展馆的商家自行和客户交易的主材款项明细，方便客户查询。我司提供展馆会展服务，款项由我司代收代付，不参与具体主材销售。实际交易双方为展馆内商家和客户，发票开具由商家开给客户。');
    }, null, false);

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
