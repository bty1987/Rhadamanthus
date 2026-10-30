/** app/js/quotation/normoodOutput.js —— 打印定额材料单
 *  上下文：app.params.quotation = { quotationId, orderId, subtype（位标志）, type, workType, orderType, showType }。
 *  报价需锁定（status=1）；按 subtype 装载 报价/扩展/增减/定额项 定额 → quotationNormoodProcessing 归并 → 打印表。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var subtype = qctx.subtype != null ? qctx.subtype : 15;
    var detail = { quotation: null };

    if (!qctx.quotationId) return;

    app.post(api.quotation.queryQuotationById, { 'quotation.qid': qctx.quotationId }, function (res) {
        detail.quotation = res.quotation;
    }, null, false);

    if (!detail.quotation || detail.quotation.status != 1) {
        app.showAlert(app.warning, '报价未锁定');
        setTimeout(function () { app.closePopup(); }, 3000);
        return;
    }

    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': qctx.orderId }, function (res) {
        detail.quotation.decoration = res.decoration;
    }, null, false);

    var quotationFunctionAreas = [], extensions = [], addreduces = [], normoods = [];
    if ((subtype & 1) == 1) {
        app.post(api.quotation.queryQuotationNormood, { 'quotation.qid': qctx.quotationId }, function (res) { quotationFunctionAreas = res.quotationFunctionAreas || []; }, null, false);
    }
    if ((subtype & 2) == 2) {
        app.post(api.quotation.queryExtensionNormood, { 'extension.orderId': qctx.orderId }, function (res) { extensions = res.extensions || []; }, null, false);
    }
    if ((subtype & 4) == 4) {
        app.post(api.quotation.queryAddReduceNormood, { 'addReduce.orderId': qctx.orderId }, function (res) { addreduces = res.addReduces || []; }, null, false);
    }
    if ((subtype & 8) == 8) {
        app.post(api.quotation.queryNormoodItem, { 'normoodItem.qid': qctx.quotationId }, function (res) { normoods = res.normoodItems || []; }, null, false);
    }

    qc.quotationNormoodProcessing(detail, quotationFunctionAreas, extensions, addreduces, normoods);

    var companyCtx = qc.ctx('company') || {};
    var company = companyCtx.name || '';
    var d = detail.quotation.decoration || {};
    var house = d.house || {};

    function printHeader(headStr) {
        return '<table style="font-size:14px" width="100%" border="0" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr><td colspan="8" style="font-size:20px" align="center"><b>' + headStr + '<\/b><\/td><\/tr>'
            + '<tr><td colspan="8" height="10"><\/td><\/tr>'
            + '<tr><td colspan="3" width="40%">客户姓名: ' + (d.customer ? d.customer.name : '') + '<\/td>'
            + '<td colspan="3" width="40%">装修单号: ' + detail.quotation.orderId + '<\/td>'
            + '<td colspan="2" width="20%">设 计 师: ' + (d.designer ? d.designer.currentName : '') + '<\/td><\/tr>'
            + '<tr><td colspan="3" width="40%">签约店面: ' + (d.designer && d.designer.dept ? d.designer.dept.name : '') + '<\/td>'
            + '<td colspan="3" width="40%">工程地址: ' + ((house.village ? house.village.name : '') + ' ' + (house.houseNumber || '')) + '<\/td>'
            + '<td colspan="2" width="20%">房屋面积: ' + (house.buildArea != null ? house.buildArea : '') + '<\/td><\/tr>'
            + '<tr><td colspan="8" height="10"><\/td><\/tr><\/tbody><\/table>';
    }

    function printNormood() {
        var index = 0;
        var h = '<table style="font-size:12px" width="100%" border="1" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr><td width="8%" align="center">序号</td><td width="25%" align="center">商品名称</td>'
            + '<td width="15%" align="center">定额上限</td><td width="10%" align="center">定额单位</td>'
            + '<td width="15%" align="center">库房上限</td><td width="10%" align="center">库房单位</td><\/tr>';
        $.each(detail.quotationFunctionAreaItemAs || {}, function (nid, v) {
            h += '<tr><td width="8%" align="center">' + (++index) + '<\/td>'
                + '<td width="25%" align="center">' + (v.noods ? v.noods.name : '') + '<\/td>'
                + '<td width="15%" align="center">' + v.normnum + '<\/td>'
                + '<td width="10%" align="center">' + (v.normunit || '') + '<\/td>'
                + '<td width="15%" align="center">' + v.storenum + '<\/td>'
                + '<td width="10%" align="center">' + (v.storeunit || '') + '<\/td><\/tr>';
        });
        h += '<tr><td height="12" colspan="6"><\/td><\/tr><\/tbody><\/table>';
        h += '<table style="font-size:12px" width="100%" border="0" cellpadding="1" cellspacing="0"><tbody><tr><td height="10"><\/td><\/tr>'
            + '<tr><td><b>&nbsp;甲方签字:<\/b><\/td><td><b>监理签字:<\/b><\/td><td><b>质检签字:<\/b><\/td><td><b>日期:<\/b><\/td><\/tr><\/tbody><\/table>';
        return h;
    }

    $('#quotationList').html(printHeader(company + '定额工费项目单') + printNormood());
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
