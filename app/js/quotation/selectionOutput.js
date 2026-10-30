/** app/js/quotation/selectionOutput.js —— 打印选材明细
 *  上下文：app.params.quotation = { orderId }（+ selection 附加头信息）。
 *  装载：装修单/选材项/默认报价/报价功能区/扩展项/增减项，按 areaName 分组打印；
 *  减类（2/4/32/34）数量取负；报价项/扩展项名称按 quoteId 回填。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var orderId = qctx.orderId;
    var decoration = {}, selectionItems = [], quotation = null;
    var quotationFunctionAreaItems = {}, extensionItems = {}, addReduceItems = {};

    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) { decoration = res.decoration; }, null, false);
    app.post(api.quotation.querySelectionItemByOrderId, { 'selectionItem.decoration.orderId': orderId }, function (res) { selectionItems = res.selectionItems || []; }, null, false);
    app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
        quotation = res.quotation;
        if (!quotation || !quotation.qid) return;
        app.post(api.quotation.queryQuotationFunctionAreaByQuotationId, { 'quotation.qid': quotation.qid }, function (r) {
            $.each(r.quotationFunctionAreas || [], function (i, a) {
                $.each(a.quotationFunctionAreaItems || [], function (j, it) { quotationFunctionAreaItems[it.qfaiId] = it; });
            });
        }, null, false);
    }, null, false);
    app.post(api.quotation.queryExtensionByOrderId, { 'extension.orderId': orderId }, function (res) {
        $.each(res.extensions || [], function (i, e) {
            $.each(e.extensionItems || [], function (j, it) { extensionItems[it.eiid] = it; });
        });
    }, null, false);
    app.post(api.quotation.queryAddReduceByOrderId, { 'addReduce.orderId': orderId }, function (res) {
        $.each(res.addReduces || [], function (i, a) {
            $.each(a.addReduceItems || [], function (j, it) { addReduceItems[it.ariId] = it; });
        });
    }, null, false);

    var selection = qctx.selection || {};
    var house = decoration.house || {};

    var E_ISAFFIRM = { 0: '未确认', 1: '客户确认' };

    var h = '<table style="font-size:14px" width="100%" border="0" cellpadding="1" cellspacing="0"><tbody>'
        + '<tr><td colspan="8" style="font-size:20px" align="center"><b>选材明细列表<\/b><\/td><\/tr>'
        + '<tr><td colspan="8" height="10"><\/td><\/tr>'
        + '<tr><td width="33%">装修单号: ' + orderId + '<\/td>'
        + '<td width="33%">楼盘地址: ' + ((house.village ? house.village.name : '') + ' ' + (house.houseNumber || '')) + '<\/td>'
        + '<td width="33%">客户姓名: ' + (decoration.customer ? decoration.customer.name : '') + '<\/td><\/tr>'
        + '<tr><td width="33%">设计师: ' + (decoration.designer ? decoration.designer.currentName : '') + '<\/td>'
        + '<td width="33%">预算员: ' + (decoration.quoter ? decoration.quoter.currentName : ' ') + '<\/td>'
        + '<td width="33%">主材员: ' + (decoration.materialer ? decoration.materialer.currentName : ' ') + '<\/td><\/tr>'
        + '<tr><td width="33%">确认状态: ' + (E_ISAFFIRM[selection.isAffirm] != null ? E_ISAFFIRM[selection.isAffirm] : '') + '<\/td>'
        + '<td width="33%">确认时间: ' + (selection.affirmTime != null ? selection.affirmTime : '') + '<\/td><\/tr>'
        + '<tr><td colspan="8" height="10"><\/td><\/tr><\/tbody><\/table>';

    var body = '<table style="font-size:12px" width="100%" border="1" cellpadding="1" cellspacing="0"><tbody>'
        + '<tr><td width="4%" align="center">序号</td><td width="6%" align="center">图片</td>'
        + '<td width="16%" align="center">报价项</td><td width="9%" align="center">品牌</td>'
        + '<td width="8%" align="center">类型</td><td width="14%" align="center">型号</td>'
        + '<td width="5%" align="center">单位</td><td width="5%" align="center">数量</td>'
        + '<td width="17%" align="center">备注</td><\/tr>';

    var selections = {};
    $.each(selectionItems, function (i, si) {
        if (!selections[si.areaName]) selections[si.areaName] = [];
        selections[si.areaName].push(si);
    });
    var index = 1;
    $.each(selections, function (areaName, items) {
        body += '<tr bgcolor="#CCCCCC"><td align="center">' + (index++) + '<\/td><td colspan="8" align="left">' + areaName + '<\/td><\/tr>';
        $.each(items, function (j, v) {
            var num = [2, 4, 32, 34].indexOf(v.type) != -1 ? -v.num : v.num;
            var itemName = '';
            if ([0, 30].indexOf(v.type) != -1 && quotationFunctionAreaItems[v.quoteId]) itemName = quotationFunctionAreaItems[v.quoteId].itemName;
            if ([1, 2, 31, 32].indexOf(v.type) != -1 && extensionItems[v.quoteId]) itemName = extensionItems[v.quoteId].itemName;
            if ([3, 4, 33, 34].indexOf(v.type) != -1 && addReduceItems[v.quoteId]) itemName = addReduceItems[v.quoteId].itemName;
            var g = v.goods || {};
            body += '<tr>'
                + '<td align="center">' + (j + 1) + '<\/td>'
                + '<td align="center">' + (g.path ? '<img src="' + app.config.media + g.path + '" width="40" height="40">' : '-') + '<\/td>'
                + '<td align="center">' + (itemName || (v.soods && v.soods.goods ? v.soods.goods.name : g.name || '')) + '<\/td>'
                + '<td align="center">' + (g.brand || '') + '<\/td>'
                + '<td align="center">' + (quotationCommon.ENUM.selectionItemType[v.type] != null ? quotationCommon.ENUM.selectionItemType[v.type] : v.type) + '<\/td>'
                + '<td align="center">' + (g.model || '') + '<\/td>'
                + '<td align="center">' + (g.measurementUnit || '') + '<\/td>'
                + '<td align="center">' + num + '<\/td>'
                + '<td align="center">' + (v.comment || '') + '<\/td><\/tr>';
        });
    });
    body += '<\/tbody><\/table>';

    $('#content').html(h + body);
    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
