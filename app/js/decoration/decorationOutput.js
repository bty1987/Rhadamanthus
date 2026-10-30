/** app/js/decoration/decorationOutput.js —— 决算打印（弹窗子页）
 *  上下文：app.params.decoration = { decoration, orderId, accountForehead, balanceSum }。
 *  数据：参与活动（queryDecorationActivityByOrderId）+ 工程验收（construction.queryAcceptance）。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var ctx = app.params.decoration || {};
    var decoration = ctx.decoration || {};
    var orderId = ctx.orderId || decoration.orderId;
    var activityName = '', drawTime = '';

    if (!orderId) { $('#manifestPrint').html('<p>缺少订单上下文<\/p>'); return; }

    app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': orderId }, function (res) {
        var list = res.decorationActivitys || [];
        if (list.length) activityName = list[0].activity.name;
    }, null, false);
    app.post(api.construction.queryAcceptance, { 'acceptance.orderId': orderId }, function (res) {
        drawTime = res.acceptance ? res.acceptance.acceptanceTime : '';
    }, null, false);

    var h = decoration.house || {}, v = decoration.house ? (decoration.house.village || {}) : {};
    function city() { return v.cityProper && v.cityProper.city ? v.cityProper.city.name + ' ' : ''; }
    function td(t) { return '<td style="padding-left:10px;">' + (t == null ? '' : t) + '<\/td>'; }
    function label(t) { return '<td style="padding-left:10px;font-weight:bold;">' + t + '<\/td>'; }

    var html = '<div align="center" style="font-size:20px;font-weight:bold;line-height:50px;">决算打印<\/div>';
    html += '<table class="print-table">';
    html += '<tr>' + label('签单日期') + td((decoration.contractTime || '').substring(0, 10)) + label('参与活动') + td(activityName)
        + label('监理') + td(decoration.supervisor && decoration.supervisor.currentName ? decoration.supervisor.currentName : '暂无')
        + label('面积') + td(h.buildArea) + '<\/tr>';
    html += '<tr>' + label('装修单号') + td(orderId) + label('楼盘地址') + td(city() + (v.cityProper ? v.cityProper.name + ' ' : '') + (v.name || '') + ' ' + (h.houseNumber || ''))
        + label('设计部门') + td(decoration.designer && decoration.designer.dept ? decoration.designer.dept.name : '')
        + label('工程验收日期') + td(drawTime || '暂无') + '<\/tr>';
    html += '<tr>' + label('客户姓名') + td(decoration.customer ? decoration.customer.name : '') + label('客户电话') + td(decoration.customer ? decoration.customer.phone : '')
        + label('设计师') + td(decoration.designer ? decoration.designer.currentName : '') + '<\/tr>';
    html += '<tr>' + label('决算合同额') + '<td colspan="7">' + (ctx.accountForehead != null ? ctx.accountForehead : '') + '<\/td><\/tr>';
    html += '<tr>' + label('决算差额') + '<td colspan="7">' + (ctx.balanceSum != null ? ctx.balanceSum : '') + '<\/td><\/tr>';
    html += '<tr>' + label('备注') + '<td colspan="7" style="height:80px;">1.该决算需在工程总验收后，并且主材确认无退货<hr>2.若决算差额低于10元，则以0元进行处理<\/td><\/tr>';
    html += '<\/table>';
    $('#manifestPrint').html(html);

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
