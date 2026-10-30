/** app/js/decoration/decorationAccountOutput.js —— 决算单打印（弹窗子页）
 *  上下文：app.params.decoration = { decoration, accountBasic, orderTypeness }。
 *  版式：decoration.type==1（整装）输出 合同/预付款/决算；否则输出 基础报价/合同/主材/增减/预付款/决算/优惠。
 *  数据：参与活动 + 工程验收 + 备注话术（data.queryTalking types=7）。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var ctx = app.params.decoration || {};
    var decoration = ctx.decoration || {};
    var b = ctx.accountBasic || {};
    var TYPENESS = decorationCommon.ENUM.typeness;
    var activityName = '', drawTime = '';

    if (!decoration.orderId) { $('#manifestPrint').html('<p>缺少订单上下文<\/p>'); return; }

    app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': decoration.orderId }, function (res) {
        var list = res.decorationActivitys || [];
        if (list.length) activityName = list[0].activity.name;
    }, null, false);
    app.post(api.construction.queryAcceptance, { 'acceptance.orderId': decoration.orderId }, function (res) {
        drawTime = res.acceptance ? res.acceptance.acceptanceTime : '';
    }, null, false);

    var h = decoration.house || {}, v = h.village || {};
    function city() { return v.cityProper && v.cityProper.city ? v.cityProper.city.name + ' ' : ''; }
    function td(t, cs) { return '<td colspan="' + (cs || 1) + '">' + (t == null ? '' : t) + '<\/td>'; }
    function lb(t, cs) { return '<td colspan="' + (cs || 1) + '" style="font-weight:bold;">' + t + '<\/td>'; }
    function head(t) { return '<tr><td colspan="12" class="tdHead">' + t + '<\/td><\/tr>'; }
    function pair(l1, v1, l2, v2, l3, v3, l4, v4, cs) { return '<tr>' + lb(l1, cs) + td(v1, cs) + lb(l2, cs) + td(v2, cs) + lb(l3, cs) + td(v3, cs) + lb(l4, cs) + td(v4, cs) + '<\/tr>'; }

    $('#titleArea').text((TYPENESS[decoration.typeness] || '') + '更' + (TYPENESS[b.typeness] || '') + '增减' + (b.cal ? '计' : '不计') + '配比');

    var html = '<table class="print-table">';
    html += '<tr>' + lb('签单日期') + td((decoration.contractTime || '').substring(0, 10)) + lb('参与活动') + td(activityName)
        + lb('监理') + td(decoration.supervisor && decoration.supervisor.currentName ? decoration.supervisor.currentName : '暂无')
        + lb('面积') + td(h.buildArea) + '<\/tr>';
    html += '<tr>' + lb('装修单号') + td(decoration.orderId) + lb('楼盘地址') + td(city() + (v.cityProper ? v.cityProper.name + ' ' : '') + (v.name || '') + ' ' + (h.houseNumber || ''))
        + lb('设计师') + td(decoration.designer ? decoration.designer.currentName : '') + lb('设计部门') + td(decoration.designer && decoration.designer.dept ? decoration.designer.dept.name : '') + '<\/tr>';
    if (decoration.type == 1) {
        html += '<tr>' + lb('客户姓名') + td(decoration.customer ? decoration.customer.name : '') + '<td colspan="6"><\/td><\/tr>';
    } else {
        html += '<tr>' + lb('客户姓名') + td(decoration.customer ? decoration.customer.name : '') + lb('客户电话') + td(decoration.customer ? decoration.customer.phone : '')
            + lb('工程验收日期') + td(drawTime || '暂无') + '<td colspan="2"><\/td><\/tr>';
    }
    html += '<\/table><div style="height:8px;"><\/div><table class="print-table">';

    if (decoration.type == 1) {
        // —— 整装版式 ——
        html += head('合同');
        html += pair('合同款待收', b.signFactOwing, '增项待收', b.addOwing, '减项待退', b.reduceOwing, '', '', 2);
        html += head('预付款');
        html += pair('合同预付款', b.contractAdvance, '主材预付款', b.materialAdvance, '', '', '', '', 3);
        html += head('决算');
        html += '<tr>' + lb('应补款', 6) + td(b.fullPayment, 6) + '<\/tr>';
    } else {
        // —— 半包版式 ——
        html += head('基础报价');
        html += '<tr>' + lb('折前总价', 3) + lb('折前直接费', 2) + lb('管理费', 2) + lb('税金', 2) + lb('折扣', 3) + '<\/tr>';
        html += '<tr>' + td(b.foldFrontTotal, 3) + td(b.foldFrontFee, 2) + td(b.managePredisPrice, 2) + td(b.taxPredisPrice, 2) + td(b.discount, 3) + '<\/tr>';
        html += head('合同');
        html += '<tr>' + lb('合同额', 2) + lb('优惠券', 2) + lb('服务费', 2) + lb('已收服务费', 2) + lb('合同实收', 2) + lb('主材配比', 2) + '<\/tr>';
        html += '<tr>' + td(b.signPrice, 2) + td(b.coupon, 2) + td(b.servicePrice, 2) + td(b.servicePaidup, 2) + td(b.signFactPrice, 2) + td(b.material, 2) + '<\/tr>';
        html += head('主材');
        html += pair('配比总额', b.materialRatio, '总金额', b.materialTotal, '优惠券', b.materialCoupon, '实收额', b.materialFactPrice, 3);
        if (b.oalesOutput) {
            html += head('外销');
            html += pair('外销总金额', b.oalesTotal, '外销主材总额', app.utils.accAdd(b.oalesTotal, b.materialTotal), '', '', '', '', 3);
        }
        html += head('增减');
        html += pair('增项已收', b.addDone, '减项已退（折后价）', b.reduceDone, '', '', '', '', 3);
        html += head('预付款');
        html += pair('合同预付款', b.contractAdvance, '主材预付款', b.materialAdvance, '', '', '', '', 3);
        html += head('决算');
        html += '<tr>' + lb('决算折前总额（含减项折前价）', 2) + lb('决算直接费', 2) + lb('决算管理费', 2) + lb('决算税金', 2) + lb(b.oalesOutput ? '决算实花配比（含外销）' : '决算实花配比', 2) + lb(' ', 2) + '<\/tr>';
        html += '<tr>' + td(b.direct || 0, 2) + td(b.beforeTotal || 0, 2) + td(b.management || 0, 2) + td(b.taxment || 0, 2) + td(b.oalesOutput ? (b.flowerOalesRatio || 0) : (b.flowerRatio || 0), 2) + td('', 2) + '<\/tr>';
        html += pair('决算主材额', b.materialAccount || 0, '决算合同额', b.accountForehead || 0, '决算服务费', b.accountServicePrice || 0, '差额', b.balanceSum || 0, 3);
        html += pair('决算类型', TYPENESS[b.typeness] || '', '增减是否计入配比', b.cal ? '是' : '否', '', '', '', '', 3);
        html += head('优惠');
        html += pair('优惠券', b.preferences, '满减', b.fulldel, '返现', b.cashback, '', '', 2);
    }
    html += '<\/table>';
    $('#manifestPrint').html(html);

    // 持卡信息
    var talkHtml = '<table class="print-table">';
    talkHtml += '<tr>' + lb('开户行省份') + td('', 7) + '<\/tr>';
    talkHtml += '<tr>' + lb('开户行城市') + td('', 7) + '<\/tr>';
    talkHtml += '<tr>' + lb('开户行网点') + td(decoration.customer ? (decoration.customer.companyBank || ' ') : ' ', 7) + '<\/tr>';
    talkHtml += '<tr>' + lb('持卡人姓名') + td(decoration.customer ? decoration.customer.name : '', 7) + '<\/tr>';
    talkHtml += '<tr>' + lb('持卡人电话') + td('', 7) + '<\/tr>';
    talkHtml += '<tr>' + lb('银行卡号') + td(decoration.customer ? (decoration.customer.companyBankno || ' ') : ' ', 7) + '<\/tr>';
    talkHtml += '<\/table>';
    // 签字区
    talkHtml += '<div style="height:8px;"><\/div><table class="print-table">';
    if (decoration.type == 1) {
        talkHtml += '<tr>' + lb('设计师签字') + td('') + lb('日期') + td('') + lb('客户签字', 1) + td('', 3) + '<\/tr>';
        talkHtml += '<tr>' + lb('设计部经理签字') + td('') + lb('日期') + td('') + '<\/tr>';
    } else {
        talkHtml += '<tr>' + lb('主材管家签字') + td('') + lb('日期') + td('') + '<\/tr>';
        talkHtml += '<tr>' + lb('设计师签字') + td('') + lb('设计经理签字') + td('') + '<\/tr>';
        talkHtml += '<tr>' + lb('客户签字') + td('') + lb('日期') + td('') + '<\/tr>';
    }
    talkHtml += '<\/table>';
    $('#talk').before(talkHtml);
    $('#talk').remove();

    // 备注话术（data.queryTalking types=7）
    app.post(api.data.queryTalking, { 'types[0]': 7 }, function (res) {
        var talkings = res.talkings || [];
        if (!talkings.length) return;
        var t = '<table class="print-table" style="margin-top:8px;">';
        $.each(talkings, function (i, v) {
            if (!v.content) return;
            t += '<tr>' + (i == 0 ? '<td rowspan="' + talkings.length + '" style="height:80px;font-weight:bold;">备注<\/td>' : '') + '<td colspan="7">' + v.content + '<\/td><\/tr>';
        });
        t += '<\/table>';
        $('#manifestPrint').after(t);
    });

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
