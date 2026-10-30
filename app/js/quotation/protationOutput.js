/** app/js/quotation/protationOutput.js —— 打印预签
 *  装载 queryProtationByPid / queryProtationItemByPid / queryPresignProduceByPpid；
 *  printConf.type 位标志：1 管理费 2 赋能金额 4 标配外金额 8 个性化 16 减项金额。
 *  上下文：app.params.quotation.{ protationId, protation.printConf }，app.params.company.drganization.name。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var companyCtx = qc.ctx('company') || {};
    var protation = null, protationItems = null, presignProduce = null;
    var printType = (qctx.protation && qctx.protation.printConf) ? (qctx.protation.printConf.type || 31) : 31;

    var pid = qctx.protationId;
    if (pid == null) return;

    app.post(api.quotation.queryProtationByPid, { 'protation.pid': pid }, function (res) { protation = res.protation; }, null, false);
    app.post(api.quotation.queryProtationItemByPid, { 'protationItem.pid': pid }, function (res) { protationItems = res.protationItems || []; }, null, false);
    app.post(api.quotation.queryPresignProduceByPpid, { 'presignProduce.ppid': protation.ppid }, function (res) { presignProduce = res.presignProduce; }, null, false);

    function printHeader(headStr) {
        return '<table style="font-size:14px" width="100%" border="0" cellpadding="1" cellspacing="0"><tbody>'
            + '<tr bgcolor="#FFFFFF"><td colspan="8" style="font-size:18px" align="center"><b>' + headStr + '<\/b><\/td><\/tr>'
            + '<tr bgcolor="#FFFFFF"><td colspan="8" height="10"><\/td><\/tr><\/tbody><\/table>';
    }

    function printProjectTable(type) {
        var p = protation;
        var h = '<table style="font-size:12px" width="100%" border="1" cellpadding="1" cellspacing="0"><tbody>';
        h += '<tr><td colspan="4" style="font-size:15px;font-weight:bold;" align="center">' + (presignProduce ? presignProduce.name : '') + '<\/td><\/tr>';
        h += '<tr style="font-weight:bold;"><td width="5%" align="center">项目</td><td colspan="2" width="5%" align="center">计价面积</td><td width="5%" align="center">金额</td><\/tr>';
        h += '<tr><td width="5%" align="center">' + p.name + '<\/td><td colspan="2" width="5%" align="center">' + p.quoteArea + '<\/td><td width="5%" align="center"><\/td><\/tr>';
        h += '<tr><td colspan="4" style="font-size:15px;font-weight:bold;" align="center">标配产品<\/td><\/tr>';
        h += '<tr style="font-weight:bold;"><td width="5%" align="center">项目</td><td colspan="2" width="5%" align="center">数量</td><td width="5%" align="center">金额</td><\/tr>';
        h += '<tr><td width="5%" align="center">标配产品<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + u.changeThrDecimal(u.accAdd(p.quotePrice, p.activityPrice)) + '<\/td><\/tr>';
        h += '<tr><td width="5%" align="center">优惠金额<\/td><td colspan="2" width="5%" align="center"><\/td><td width="5%" align="center">' + p.preferPrice + '<\/td><\/tr>';
        h += '<tr><td width="5%" align="center">管理费收取比例<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + p.manageRate + '<\/td><\/tr>';
        h += '<tr><td width="5%" align="center">管理费<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + ((type & 1) == 1 ? p.managePrice : '') + '<\/td><\/tr>';
        h += '<tr><td width="5%" align="center">税金<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + p.taxPrice + '<\/td><\/tr>';
        h += '<tr><td width="5%" align="center">管理优惠<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + p.manageProfit + '<\/td><\/tr>';
        h += '<tr><td width="5%" align="center">活动优惠<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + p.activityProfit + '<\/td><\/tr>';
        if (p.advanceProfit != 0) {
            h += '<tr><td width="5%" align="center">特殊优惠<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + p.advanceProfit + '<\/td><\/tr>';
        }
        return h;
    }

    function addtionTable(type) {
        var h = '<tr><td colspan="4" style="font-size:15px;font-weight:bold;" align="center">赋能产品<\/td><\/tr>';
        h += '<tr style="font-weight:bold;"><td width="5%" align="center">项目</td><td colspan="2" width="5%" align="center">数量</td><td width="5%" align="center">金额</td><\/tr>';
        $.each(protationItems, function (i, qv) {
            var price = qv.areaCale == 0 ? u.changeThrDecimal(u.accMul(qv.price, qv.num)) : u.changeThrDecimal(u.accMul(u.accMul(qv.price, qv.num), protation.quoteArea));
            if (qv.type == 7 || qv.type == 8) {
                h += '<tr><td width="5%" align="center">' + qv.name + '<\/td><td colspan="2" width="5%" align="center">' + qv.num + '<\/td><td width="5%" align="center">' + ((type & 2) == 2 ? price : '') + '<\/td><\/tr>';
            }
        });
        return h;
    }

    function optionalTable(type) {
        var h = '<tr><td colspan="4" style="font-size:15px;font-weight:bold;" align="center">标配外功能区<\/td><\/tr>';
        h += '<tr style="font-weight:bold;"><td width="5%" align="center">项目</td><td width="2%" align="center">基础量</td><td width="3%" align="center">数量</td><td width="5%" align="center">金额</td><\/tr>';
        $.each(protationItems, function (i, qv) {
            var price = qv.areaCale == 0 ? u.changeThrDecimal(u.accMul(qv.price, u.accSub(qv.num, qv.basicNum))) : u.changeThrDecimal(u.accMul(u.accMul(qv.price, u.accSub(qv.num, qv.basicNum)), protation.quoteArea));
            if (qv.type == 0) {
                h += '<tr><td width="5%" align="center">' + qv.name + '<\/td><td width="5%" align="center">' + qv.basicNum + '<\/td><td width="5%" align="center">' + qv.num + '<\/td><td width="5%" align="center">' + ((type & 4) == 4 ? price : '') + '<\/td><\/tr>';
            }
        });
        return h;
    }

    function customTable(type) {
        var h = '<tr><td colspan="4" style="font-size:15px;font-weight:bold;" align="center">个性化产品<\/td><\/tr>';
        h += '<tr style="font-weight:bold;"><td width="5%" align="center">项目</td><td colspan="2" width="5%" align="center">数量</td><td width="5%" align="center">金额</td><\/tr>';
        h += '<tr><td width="5%" align="center">工程个性化预收<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + ((type & 8) == 8 ? protation.adddPrice : '') + '<\/td><\/tr>';
        h += '<tr><td width="5%" align="center">主材个性化预收<\/td><td colspan="2" width="5%" align="center">1<\/td><td width="5%" align="center">' + ((type & 8) == 8 ? protation.addmPrice : '') + '<\/td><\/tr>';
        return h;
    }

    function subtractTable(type) {
        var h = '<tr><td colspan="4" style="font-size:15px;font-weight:bold;" align="center">标配产品减项<\/td><\/tr>';
        h += '<tr style="font-weight:bold;"><td width="5%" align="center">项目</td><td colspan="2" width="5%" align="center">数量</td><td width="5%" align="center">金额</td><\/tr>';
        $.each(protationItems, function (i, qv) {
            var price = qv.areaCale == 0 ? u.changeThrDecimal(u.accMul(qv.price, qv.num)) : u.changeThrDecimal(u.accMul(u.accMul(qv.price, qv.num), protation.quoteArea));
            if (qv.type == 5 || qv.type == 6 || qv.type == 11) {
                h += '<tr><td width="5%" align="center">' + qv.name + '<\/td><td colspan="2" width="5%" align="center">' + u.accSub(0, qv.num) + '<\/td><td width="5%" align="center">' + ((type & 16) == 16 ? price : '') + '<\/td><\/tr>';
            }
        });
        h += '<tr><td width="5%" style="font-size:15px;font-weight:bold;" align="center">合计(不含税)<\/td><td colspan="3" width="5%" align="center">' + u.changeThrDecimal(u.accSub(protation.totalPrice, protation.taxPrice)) + '<\/td><\/tr>';
        h += '<tr><td width="5%" style="font-size:15px;font-weight:bold;" align="center">税金<\/td><td colspan="3" width="5%" align="center">' + protation.taxPrice + '<\/td><\/tr>';
        h += '<tr><td width="5%" style="font-size:15px;font-weight:bold;" align="center">预签合计(含税)<\/td><td colspan="3" width="5%" align="center">' + protation.totalPrice + '<\/td><\/tr>';
        h += '<\/tbody><\/table>';
        return h;
    }

    var company = companyCtx.drganization ? companyCtx.drganization.name : (companyCtx.name || '');
    var html = printHeader(company + '家装项目预签单')
        + printProjectTable(printType)
        + addtionTable(printType)
        + optionalTable(printType)
        + customTable(printType)
        + subtractTable(printType);
    $('#protationLits').html(html);

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
