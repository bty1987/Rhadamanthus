/** app/js/quotation/normtimeOutput.js —— 打印定额工时单
 *  上下文：app.params.quotation = { quotationId, orderId, subtype, workType }。
 *  报价锁定校验；按 subtype 装载 报价/扩展/增减/定额项 工时 → quotationNormtimeProcessing 按施工节点分组 → 打印。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var subtype = qctx.subtype != null ? qctx.subtype : 15;
    var workType = qctx.workType;
    var detail = { quotation: null };

    if (!qctx.quotationId) return;

    app.post(api.quotation.queryQuotationById, { 'quotation.qid': qctx.quotationId }, function (res) { detail.quotation = res.quotation; }, null, false);
    if (!detail.quotation || detail.quotation.status != 1) {
        app.showAlert(app.warning, '报价未锁定');
        setTimeout(function () { app.closePopup(); }, 3000);
        return;
    }
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': qctx.orderId }, function (res) { detail.quotation.decoration = res.decoration; }, null, false);

    var quotationFunctionAreas = [], extensions = [], addreduces = [], normtimeItems = [];
    if ((subtype & 1) == 1) {
        app.post(api.quotation.queryQuotationNormtime, { 'quotation.qid': qctx.quotationId }, function (res) { quotationFunctionAreas = res.quotationFunctionAreas || []; }, null, false);
    }
    if ((subtype & 2) == 2) {
        app.post(api.quotation.queryExtensionNormtime, { 'extension.orderId': qctx.orderId }, function (res) { extensions = res.extensions || []; }, null, false);
    }
    if ((subtype & 4) == 4) {
        app.post(api.quotation.queryAddReduceNormtime, { 'addReduce.orderId': qctx.orderId }, function (res) { addreduces = res.addReduces || []; }, null, false);
    }
    if ((subtype & 8) == 8) {
        app.post(api.quotation.queryNormtimeItem, { 'normtimeItem.qid': qctx.quotationId }, function (res) { normtimeItems = res.normtimeItems || []; }, null, false);
    }

    qc.quotationNormtimeProcessing(detail, quotationFunctionAreas, extensions, addreduces);

    var companyCtx = qc.ctx('company') || {};
    var company = companyCtx.name || '';
    var d = detail.quotation.decoration || {};
    var house = d.house || {};
    var CNTYPES = { 1: '报价项', 2: '拓展项', 3: '增减项' };

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

    var grandTotal = 0;
    function printNormtime() {
        var h = '<table style="font-size:12px" width="100%" border="1" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr><td width="8%" align="center">序号</td><td width="12%" align="center">功能区</td>'
            + '<td width="22%" align="center">项目名称</td><td width="9%" align="center">项目单位</td>'
            + '<td width="9%" align="center">工程量</td><td width="9%" align="center">转换量</td>'
            + '<td width="9%" align="center">工日</td><td width="8%" align="center">工时总额</td><\/tr>';
        var index = 0;
        $.each(detail.quotationFunctionAreaItemMs || {}, function (i, v) {
            var cninfo = i.split('-');
            var cnname = cninfo[1], cntype = cninfo[2];
            if (workType && workType !== '' && cnname != workType) return true;
            var itemIndex = 0, rows = '';
            $.each(v, function (j, qv) {
                var num = parseFloat(qv.normtime.trannum == '0' ? 1 : qv.initNum);
                var trannum = parseFloat(qv.normtime.trannum == '0' ? 1 : qv.normtime.trannum);
                var workdays = parseFloat(qv.normtime.workdays);
                var total = u.changeThrDecimal(u.accMul(u.accMul(trannum, u.accMul(num, workdays)), qv.atttype == 0 || qv.normtime.atttype == 0 ? 1 : -1));
                grandTotal = u.accAdd(grandTotal, total);
                rows += '<tr><td width="8%" align="center">' + (itemIndex + 1) + '<\/td>'
                    + '<td width="12%" align="center">' + (qv.quotationFunctionAreaName || '') + '<\/td>'
                    + '<td width="22%" align="center">' + qv.itemName + '(' + (CNTYPES[cntype] || '') + ')<\/td>'
                    + '<td width="9%" align="center">' + (qv.measurementUnit || '') + '<\/td>'
                    + '<td width="9%" align="center">' + qv.initNum + '<\/td>'
                    + '<td width="9%" align="center">' + qv.normtime.trannum + '<\/td>'
                    + '<td width="9%" align="center">' + qv.normtime.workdays + '<\/td>'
                    + '<td width="8%" align="center">' + total + '<\/td><\/tr>';
                itemIndex++;
            });
            if (!itemIndex) return true;
            h += '<tr bgcolor="#CCCCCC"><td align="center">' + (index + 1) + '<\/td><td colspan="7" align="left">' + cnname + '<\/td><\/tr>' + rows;
            index++;
        });

        if ((subtype & 8) == 8 && normtimeItems.length) {
            var addIdx = 0;
            h += '<tr bgcolor="#CCCCCC"><td align="center">' + (index + 1) + '<\/td><td colspan="7" align="left">定额工时项<\/td><\/tr>';
            $.each(normtimeItems, function (j, qv) {
                var num = parseFloat(qv.trannum == '0' ? 1 : qv.num);
                var trannum = parseFloat(qv.trannum == '0' ? 1 : qv.trannum);
                var total = u.changeThrDecimal(u.accMul(u.accMul(trannum, u.accMul(num, qv.workdays)), qv.atttype == 0 ? 1 : -1));
                grandTotal = u.accAdd(grandTotal, total);
                h += '<tr><td align="center">' + (addIdx + 1) + '<\/td><td align="center">-<\/td>'
                    + '<td align="center">' + qv.name + '(定额项)<\/td><td align="center">-<\/td>'
                    + '<td align="center">' + qv.num + '<\/td><td align="center">' + qv.trannum + '<\/td>'
                    + '<td align="center">' + qv.workdays + '<\/td><td align="center">' + total + '<\/td><\/tr>';
                addIdx++;
            });
        }

        h += '<tr><td height="12" colspan="8"><\/td><\/tr>'
            + '<tr><td colspan="6"><\/td><td align="center">总额</td><td align="center">' + u.changeThrDecimal(grandTotal) + '<\/td><\/tr>'
            + '<\/tbody><\/table>';
        h += '<table style="font-size:12px" width="100%" border="0" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr><td><b>&nbsp;甲方签字:<\/b><\/td><td><b>监理签字:<\/b><\/td><td><b>质检签字:<\/b><\/td><td><b>日期:<\/b><\/td><\/tr><\/tbody><\/table>';
        return h;
    }

    $('#quotationList').html(printHeader(company + '定额工时项目单') + printNormtime());
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
