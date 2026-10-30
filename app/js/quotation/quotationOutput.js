/** app/js/quotation/quotationOutput.js —— 打印报价
 *  上下文：app.params.quotation = { orderId, quotationId, type(位标志), subtype, workType, orderType, showType }。
 *  装载 queryQuotationById + queryQuotationPrefer + decoration + 功能区/增减/扩展/预签 →
 *  statisticalQuotationItem + initQuotationDetailItem（showType 位标志）→ 分组打印 + quotationCalculator 总额。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var orderId = qctx.orderId;
    var quotationId = qctx.quotationId;
    var showType = qctx.showType != null ? qctx.showType : (qctx.type != null ? qctx.type : 31);
    var subtype = qctx.subtype != null ? qctx.subtype : 15;
    var workType = qctx.workType;

    if (!quotationId || !orderId) return;

    var detail = qc.loadQuotationDetail(orderId, qctx.orderType);
    if (!detail) return;
    var quotation = detail.quotation;
    var prefer = detail.quotationPrefer || {};
    var decoration = quotation.decoration || {};
    var house = decoration.house || {};

    var companyCtx = qc.ctx('company') || {};
    var company = companyCtx.name || '';

    var h = '<table style="font-size:14px" width="100%" border="0" cellpadding="1" cellspacing="0"><tbody>'
        + '<tr><td colspan="8" style="font-size:20px" align="center"><b>' + company + '家装项目报价单<\/b><\/td><\/tr>'
        + '<tr><td colspan="8" height="10"><\/td><\/tr>'
        + '<tr><td colspan="3" width="40%">客户姓名: ' + (decoration.customer ? decoration.customer.name : '') + '<\/td>'
        + '<td colspan="3" width="40%">装修单号: ' + orderId + '<\/td>'
        + '<td colspan="2" width="20%">设 计 师: ' + (decoration.designer ? decoration.designer.currentName : '') + '<\/td><\/tr>'
        + '<tr><td colspan="3" width="40%">签约店面: ' + (decoration.designer && decoration.designer.dept ? decoration.designer.dept.name : '') + '<\/td>'
        + '<td colspan="3" width="40%">工程地址: ' + ((house.village ? house.village.name : '') + ' ' + (house.houseNumber || '')) + '<\/td>'
        + '<td colspan="2" width="20%">房屋面积: ' + (house.buildArea != null ? house.buildArea : '') + '<\/td><\/tr>'
        + '<tr><td colspan="3">报价版本: ' + (quotation.version ? quotation.version.name : '') + '<\/td>'
        + '<td colspan="3">折扣: ' + quotation.discount + '<\/td>'
        + '<td colspan="2">计价面积: ' + (house.innerArea != null ? house.innerArea : '') + '<\/td><\/tr>'
        + '<tr><td colspan="3">优惠额: ' + qc.money(qc.checkNull(prefer.preferPrice)) + '<\/td>'
        + '<td colspan="3">管理优惠: ' + qc.money(qc.checkNull(prefer.managePrefer)) + '<\/td>'
        + '<td colspan="2">特殊优惠: ' + qc.money(qc.checkNull(prefer.advancePrefer)) + '<\/td><\/tr>'
        + '<tr><td colspan="8" height="10"><\/td><\/tr><\/tbody><\/table>';

    var totalAll = 0;
    var body = '';
    $.each(detail.quotationFunctionAreaItemCs || {}, function (key, items) {
        var areaName = key.split('-')[1] || key;
        if (workType && workType !== '' && areaName != workType) return true;
        var dcpts = 0;
        var rows = '';
        $.each(items, function (j, qv) {
            var _total = (qv.suptype == 1 && qv.type == 4) ? 0 : qv.total;
            var _unitPrice = (qv.suptype == 1 && qv.type == 4) ? 0 : qv.unitPrice;
            dcpts = u.accAdd(dcpts, qv.quotationTotalPrice != null ? qv.quotationTotalPrice : 0);
            rows += '<tr><td align="center">' + (j + 1) + '<\/td><td align="center">' + qv.num + '<\/td>'
                + '<td align="center">' + (qv.itemName || '') + '<\/td><td align="center">' + (qv.typestr || '-') + '<\/td>'
                + '<td align="center">' + (qv.measurementUnit || '') + '<\/td><td align="center">' + (qv.workType || '') + '<\/td>'
                + '<td align="center">' + qc.money(_unitPrice) + '<\/td><td align="center">' + qc.money(qv.dcp) + '<\/td>'
                + '<td align="center">' + qc.money(_total) + '<\/td><\/tr>';
        });
        body += '<table style="font-size:12px" width="100%" border="1" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr bgcolor="#CCCCCC"><td colspan="9" align="left"><b>' + areaName + ' — 总额: ' + u.changeTwoDecimal(dcpts) + '<\/b><\/td><\/tr>'
            + '<tr><td width="5%" align="center">序号</td><td width="8%" align="center">工程量</td><td width="20%" align="center">名称</td>'
            + '<td width="7%" align="center">类型</td><td width="6%" align="center">单位</td><td width="8%" align="center">工种</td>'
            + '<td width="10%" align="center">单价</td><td width="10%" align="center">折扣单价</td><td width="10%" align="center">总额</td><\/tr>'
            + rows + '<\/tbody><\/table>';
        totalAll = u.accAdd(totalAll, dcpts);
    });

    var calced = qc.quotationCalculator(detail, quotation.discount, quotation.basePrice);
    body += '<table style="font-size:14px" width="100%" border="1" cellpadding="1" cellspacing="0"><tbody>'
        + '<tr><td align="right"><b>合计: ' + qc.money(totalAll) + ' ｜ 工程额: ' + qc.money(calced) + ' ｜ 报价总额: ' + qc.money(quotation.totalPrice) + '<\/b><\/td><\/tr><\/tbody><\/table>';
    body += '<table style="font-size:12px" width="100%" border="0" cellpadding="1" cellspacing="0"><tbody>'
        + '<tr><td><b>&nbsp;甲方签字:<\/b><\/td><td><b>设计师签字:<\/b><\/td><td><b>预算员签字:<\/b><\/td><td><b>日期:<\/b><\/td><\/tr><\/tbody><\/table>';

    $('#content').html(h + body);
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
