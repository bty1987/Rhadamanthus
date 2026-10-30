/** app/js/quotation/quotationDetail.js —— 报价详情（只读）
 *  装载：quotationCommon.loadQuotationDetail（默认报价 + prefer + decoration + 功能区 + 增减 + 扩展 + 预签）
 *  + statisticalQuotationItem + initQuotationDetailItem（折扣单价/总额/工种归并）+ quotationCalculator（工程额）。
 *  分组视图：按功能区（itemCs）/ 按工种（itemWs）。 */
app.ready(function () {
layui.use(['element', 'jquery'], function () {
    var $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var orderId = qctx.orderId;
    var orderType = qctx.orderType;

    var detail = qc.loadQuotationDetail(orderId, orderType);
    if (!detail) return;

    $('#orderIdLabel').text(' - ' + orderId);
    var quotation = detail.quotation, prefer = detail.quotationPrefer || {};
    var quotePrice = u.accAdd(qc.checkNull(prefer.quotePrice), qc.checkNull(prefer.activityPrice));
    var totalPrices = u.changeThrDecimal(u.accAdd(qc.checkNull(quotation.totalPrice), detail.extensionTotalPrice));
    var managePrices = u.changeThrDecimal(u.accAdd(qc.checkNull(quotation.managePrice), detail.extensionManagePrice));
    var taxPrices = u.changeThrDecimal(u.accAdd(qc.checkNull(quotation.taxPrice), detail.extensionTaxPrice));

    $('#quotePrice').text(qc.money(quotePrice));
    $('#quoteArea').text(qc.money(quotation.decoration && quotation.decoration.house ? qc.checkNull(quotation.decoration.house.innerArea) : '-'));
    $('#preferPrice').text(qc.money(qc.checkNull(prefer.preferPrice)));
    $('#discount').text(qc.checkNull(quotation.discount));
    $('#managePrice').text(qc.money(managePrices));
    $('#managePrefer').text(qc.money(qc.checkNull(prefer.managePrefer)));
    $('#advancePrefer').text(qc.money(qc.checkNull(prefer.advancePrefer)));
    $('#activityProfit').text(qc.money(qc.checkNull(prefer.activityProfit)));
    $('#taxPrice').text(qc.money(taxPrices));
    $('#totalPrice').text(qc.money(totalPrices));

    function renderGroups(container, groups, titleFn) {
        var html = '';
        $.each(groups || {}, function (key, items) {
            var dcpts = 0;
            html += '<div class="layui-card" style="margin-bottom:10px;"><div class="layui-card-header"><b>' + titleFn(key) + '<\/b>'
                + '<span style="float:right;">总额: <span class="groupTotal">0<\/span><\/span><\/div>'
                + '<div class="layui-card-body" style="padding:5px;"><table class="layui-table" lay-size="sm"><thead><tr>'
                + '<th>#</th><th>工程量</th><th>名称</th><th>类型</th><th>单位</th><th>工种</th><th>单价</th><th>折扣价</th><th>总额</th>'
                + '<\/tr><\/thead><tbody>';
            $.each(items, function (j, qv) {
                var _total = (qv.suptype == 1 && qv.type == 4) ? 0 : qv.total;
                var _unitPrice = (qv.suptype == 1 && qv.type == 4) ? 0 : qv.unitPrice;
                dcpts = u.accAdd(dcpts, qv.quotationTotalPrice != null ? qv.quotationTotalPrice : 0);
                html += '<tr><td>' + (j + 1) + '<\/td><td>' + qv.num + '<\/td><td>' + (qv.itemName || '') + '<\/td>'
                    + '<td>' + (qv.typestr || '-') + '<\/td><td>' + (qv.measurementUnit || '') + '<\/td><td>' + (qv.workType || '') + '<\/td>'
                    + '<td>' + qc.money(_unitPrice) + '<\/td><td>' + qc.money(qv.dcp) + '<\/td><td>' + qc.money(qv.dcpt) + '<\/td><\/tr>';
            });
            html += '<\/tbody><\/table><\/div><\/div>';
            html = html.replace('<span class="groupTotal">0<\/span>', '<span class="groupTotal">' + u.changeTwoDecimal(dcpts) + '<\/span>');
        });
        $(container).html(html || '<p style="color:#999;padding:20px;">暂无数据<\/p>');
    }

    renderGroups('#byArea', detail.quotationFunctionAreaItemCs, function (key) { return key.split('-')[1] || key; });
    renderGroups('#byWorkType', detail.quotationFunctionAreaItemWs, function (key) { return (key.split('-')[1] || key); });

    // 工程额（折扣 + 基数）
    var calced = qc.quotationCalculator(detail, quotation.discount, quotation.basePrice);
    $('#totalPrice').after(' ｜ 工程额:' + qc.money(calced));

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.quotationIndex.url); });
});
}); // end app.ready
