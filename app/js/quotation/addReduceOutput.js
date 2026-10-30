/** app/js/quotation/addReduceOutput.js —— 打印增减项
 *  上下文：app.params.quotation = { orderId, arids:[...] }。
 *  装载 queryDecorationForCommonByOrderId / queryQuotationForDefaultByOrderId / queryAddReduceByOrderId；
 *  打折口径：item.discount∈{1,3} 按 增减折扣(0 取报价折扣)/10；type=4 增项中报价项数量冲抵 reduceNums。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var orderId = qctx.orderId;
    var arids = qctx.arids || [];
    var decoration = null, quotation = null;
    var items = {};
    var reduceNums = {};

    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) { decoration = res.decoration; }, null, false);
    app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) { quotation = res.quotation; }, null, false);
    app.post(api.quotation.queryAddReduceByOrderId, { 'addReduce.orderId': orderId }, function (result) {
        $.each(result.addReduces || [], function (i, v) {
            if (arids.indexOf(v.arId) == -1) return true;

            var manageTotal = v.manageDiscount == 1 ? u.changeThrDecimal(u.accMul(v.managePrice, u.accDiv(v.discount == 0 ? quotation.discount : v.discount, 10))) : v.managePrice;
            var taxTotal = v.manageDiscount == 1 ? u.changeThrDecimal(u.accMul(v.taxPrice, u.accDiv(v.discount == 0 ? quotation.discount : v.discount, 10))) : v.taxPrice;

            items[v.arId] = [
                { itemName: '管理费', quotationFunctionAreaName: '-', measurementUnit: '-', num: '-', unitPrice: '-', total: manageTotal, type: v.type },
                { itemName: '税金', quotationFunctionAreaName: '-', measurementUnit: '-', num: '-', unitPrice: '-', total: taxTotal, type: v.type }
            ];

            var addReduceItems = qc.sortQuo(v.addReduceItems || []);
            var quotationDiscount = u.accDiv(v.discount == 0 ? quotation.discount : v.discount, 10);

            addReduceItems = addReduceItems.slice().reverse();
            $.each(addReduceItems, function (j, it) {
                if (it.type == 4) {
                    if (reduceNums[it.quoteItemId]) reduceNums[it.quoteItemId] = u.changeThrDecimal(u.accAdd(reduceNums[it.quoteItemId], it.num));
                    else reduceNums[it.quoteItemId] = it.num;
                }
                var discount = ([1, 3].indexOf(it.discount) != -1) ? quotationDiscount : 1;
                it.discountPrice = u.accMul(it.unitPrice, discount);
                it.total = u.changeThrDecimal(u.accMul(it.num, it.discountPrice));
                items[v.arId].unshift(it);
            });
        });
    }, null, false);

    // 渲染
    if (decoration) {
        $('#orderId').html('装修单号: ' + decoration.orderId);
        $('#orderAddr').html('楼盘地址: ' + (decoration.house ? (decoration.house.village.name + ' ' + decoration.house.houseNumber) : '-'));
        $('#supervisor').html('监理: ' + (decoration.supervisor && decoration.supervisor.currentName != null ? decoration.supervisor.currentName : '-'));
        $('#designer').html('设计师: ' + (decoration.designer && decoration.designer.currentName != null ? decoration.designer.currentName : '-'));
    }

    var addReduceTotalPrice = 0;
    var html = '';
    $.each(items, function (arId, addReduceItems) {
        var addReduceType = addReduceItems[addReduceItems.length - 1].type;
        var typeName = addReduceType == 1 ? '减项' : '增项';
        var addReduceTotal = 0;
        var index = 1;
        html += typeName;
        html += '<table width="100%" border="1" cellpadding="1" cellspacing="0" style="font-size:14px"><tbody>'
            + '<tr align="center"><td width="5%">序号</td><td width="40%">项目名称</td><td width="14%">功能区</td>'
            + '<td width="10%">单位</td><td width="8%">数量</td><td width="10%">单价</td><td width="13%">金额</td></tr>';
        $.each(addReduceItems, function (j, it) {
            if (reduceNums[it.ariId]) {
                it.num = u.changeThrDecimal(u.accAdd(it.num, reduceNums[it.ariId]));
                it.total = u.changeThrDecimal(u.accMul(it.num, it.discountPrice != null ? it.discountPrice : it.unitPrice));
            }
            html += '<tr align="center"><td>' + (index++) + '<\/td><td>' + it.itemName + '<\/td>'
                + '<td>' + (it.quotationFunctionAreaName || '-') + '<\/td><td>' + (it.measurementUnit || '-') + '<\/td>'
                + '<td>' + it.num + '<\/td><td>' + it.unitPrice + '<\/td><td>' + it.total + '<\/td><\/tr>';
            addReduceTotal = u.changeThrDecimal(u.accAdd(it.total, addReduceTotal));
        });
        html += '<\/tbody><\/table>';
        html += typeName + '金额: ' + addReduceTotal + '元<hr><p><\/p>';
        addReduceTotalPrice = u.changeThrDecimal(u.accAdd(addReduceType == 1 ? -addReduceTotal : addReduceTotal, addReduceTotalPrice));
    });
    $('#content').html(html);
    $('#labSumMoney').html('工程最终增减合计金额: ' + addReduceTotalPrice + '元');

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
