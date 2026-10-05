/** app/js/quotation/normriceOutput.js —— 打印定额工费单
 *  上下文：app.params.quotation = { quotationId, orderId, subtype, type, workType }。
 *  报价锁定校验；按 subtype 装载报价/扩展/增减/定额项工费 → quotationNormriceProcessing 按施工节点分组 → 打印。 */
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

    // 节点工费保底额(÷1000经tranargs换算,0=无保底;定额低于保底额时,总额按保底托底并打保底标识)
    var salaryFloor = 0;
    if (workType) {
        app.post(api.data.queryConstructionNodeByCnid, { 'constructionNode.cnid': workType }, function (res) {
            salaryFloor = (res.constructionNode && res.constructionNode.salaryFloor) || 0;
        }, null, false);
    }

    var quotationFunctionAreas = [], extensions = [], addreduces = [], normriceItems = [];
    if ((subtype & 1) == 1) {
        app.post(api.quotation.queryQuotationNormrice, { 'quotation.qid': qctx.quotationId }, function (res) { quotationFunctionAreas = res.quotationFunctionAreas || []; }, null, false);
    }
    if ((subtype & 2) == 2) {
        app.post(api.quotation.queryExtensionNormrice, { 'extension.orderId': qctx.orderId }, function (res) { extensions = res.extensions || []; }, null, false);
    }
    if ((subtype & 4) == 4) {
        app.post(api.quotation.queryAddReduceNormrice, { 'addReduce.orderId': qctx.orderId }, function (res) { addreduces = res.addReduces || []; }, null, false);
    }
    if ((subtype & 8) == 8) {
        app.post(api.quotation.queryNormriceItemByType, { 'normriceItem.qid': qctx.quotationId, 'normriceItem.type': 3 }, function (res) {
            // 定额附加项并入（以 normriceItems 形式追加为独立节点组）
            normriceItems = res.normriceItems || [];
        }, null, false);
    }

    qc.quotationNormriceProcessing(detail, quotationFunctionAreas, extensions, addreduces);

    var companyCtx = qc.ctx('company') || {};
    var company = companyCtx.name || '';
    var d = detail.quotation.decoration || {};
    var house = d.house || {};
    var CNTYPES = { 1: '报价项', 2: '拓展项', 3: '增减项', 4: '打包项' };

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
    function printNormrice() {
        var h = '<table style="font-size:12px" width="100%" border="1" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr><td width="8%" align="center">序号</td><td width="12%" align="center">功能区</td>'
            + '<td width="20%" align="center">项目名称</td><td width="9%" align="center">项目单位</td>'
            + '<td width="9%" align="center">工程量</td><td width="9%" align="center">单位</td>'
            + '<td width="9%" align="center">工费单价</td><td width="8%" align="center">定额总额</td><\/tr>';
        var index = 0;
        $.each(detail.quotationFunctionAreaItemMs || {}, function (i, v) {
            var cninfo = i.split('-');
            var cnid = cninfo[0], cnname = cninfo[1], cntype = cninfo[2];
            if (workType && workType !== '' && cnid != workType) return true;
            var itemIndex = 0;
            var nodeTotal = 0;
            var rows = '';
            $.each(v, function (j, qv) {
                var num = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.initNum);
                var trannum = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.normrice.trannum);
                var salary = parseFloat(qv.normrice.salary);
                var normrice = u.accMul(num, u.accMul(trannum, salary));
                nodeTotal = u.accAdd(nodeTotal, normrice);
                rows += '<tr><td width="8%" align="center">' + (itemIndex + 1) + '<\/td>'
                    + '<td width="12%" align="center">' + (qv.quotationFunctionAreaName || '') + '<\/td>'
                    + '<td width="20%" align="center">' + qv.itemName + '(' + (CNTYPES[cntype] || '') + ')<\/td>'
                    + '<td width="9%" align="center">' + (qv.measurementUnit || '') + '<\/td>'
                    + '<td width="9%" align="center">' + qv.initNum + '<\/td>'
                    + '<td width="9%" align="center">' + (qv.normrice.unit || '') + '<\/td>'
                    + '<td width="9%" align="center">' + salary + '<\/td>'
                    + '<td width="8%" align="center">' + normrice + '<\/td><\/tr>';
                itemIndex++;
            });
            if (!itemIndex) return true;
            h += '<tr bgcolor="#CCCCCC"><td align="center">' + (index + 1) + '<\/td><td colspan="7" align="left">' + cnname + '<\/td><\/tr>' + rows;
            grandTotal = u.accAdd(grandTotal, nodeTotal);
            index++;
        });

        // 定额附加项（subtype & 8）
        if ((subtype & 8) == 8 && normriceItems.length) {
            var addIdx = 0;
            h += '<tr bgcolor="#CCCCCC"><td align="center">' + (index + 1) + '<\/td><td colspan="7" align="left">附加项<\/td><\/tr>';
            $.each(normriceItems, function (j, qv) {
                var total = u.changeThrDecimal(u.accMul(u.accMul(qv.num, qv.salary), qv.atttype == 0 ? 1 : -1));
                grandTotal = u.accAdd(grandTotal, total);
                h += '<tr><td align="center">' + (addIdx + 1) + '<\/td><td align="center">-<\/td>'
                    + '<td align="center">' + qv.name + '(定额项)<\/td><td align="center">-<\/td>'
                    + '<td align="center">' + qv.num + '<\/td><td align="center">' + (qv.unit || '-') + '<\/td>'
                    + '<td align="center">' + qv.salary + '<\/td><td align="center">' + total + '<\/td><\/tr>';
                addIdx++;
            });
        }

        // 定额总额低于保底额:总额按保底托底,打印附保底标识
        var isFloor = false;
        if (salaryFloor > 0 && salaryFloor > grandTotal) {
            grandTotal = salaryFloor;
            isFloor = true;
        }

        h += '<tr><td height="12" colspan="8"><\/td><\/tr>'
            + '<tr><td colspan="6"><\/td><td align="center">' + (isFloor ? '保底工费总额' : '总额') + '<\/td><td align="center">' + u.changeThrDecimal(grandTotal) + '<\/td><\/tr>'
            + '<\/tbody><\/table>';
        h += '<table style="font-size:12px" width="100%" border="0" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr><td><b>&nbsp;甲方签字:<\/b><\/td><td><b>监理签字:<\/b><\/td><td><b>质检签字:<\/b><\/td><td><b>日期:<\/b><\/td><\/tr><\/tbody><\/table>';
        return h;
    }

    $('#quotationList').html(printHeader(company + '定额工费项目单') + printNormrice());
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
