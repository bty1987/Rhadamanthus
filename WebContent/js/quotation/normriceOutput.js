var NORMRICE_ITEM_STATUS_CONFIRMED_INT = 2;

var ADDREDUCE_TYPE_ADD_INT = 0;
var ADDREDUCE_PAYTYPE_PAY_INT = 0;
var ADDREDUCE_STATUS_PAYED_INT = 2;
var ADDREDUCE_STATUS_CONFIRMED_INT = 3;
var ADDREDUCE_ISSALARY_MARKED_INT = 1;

function printHeader(headStr) {

    var quotation = quotationUtils.quotationDetail.quotation;
    var decoration = quotation.decoration;

    var headHtml = "";

    headHtml += '<table style="font-size: 14px" width="100%" bgcolor="#000000" border="0" cellpadding="1" cellspacing="0">';
    headHtml += '<tbody><tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="8" style="font-size: 20px" align="center"> <b>' + headStr + '</b></td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="8" height="10"></td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="3" width="40%">监理姓名: ' + decoration.supervisor.currentName + '</td>';
    headHtml += '<td colspan="3" width="40%">装修单号: ' + quotation.orderId + '</td>';
    headHtml += '<td colspan="2" width="20%">工程地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber + '</td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="3" width="40%">房屋面积: ' + decoration.house.buildArea + '</td>';
    headHtml += '<td colspan="3" width="40%">工人姓名: </td>';
    headHtml += '<td colspan="2" width="20%">工人工号: </td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="2" width="40%">定额工费: (小写) _______________________</td>';
    headHtml += '<td colspan="6" width="60%">(大写)________万________仟________佰________拾________元</td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="3" width="40%">监理签字: </td>';
    headHtml += '<td colspan="3" width="40%"></td>';
    headHtml += '<td colspan="2" width="20%">质检签字:</td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="8" height="10"></td>';
    headHtml += '</tr>';
    headHtml += '</tbody></table>';

    return headHtml;
}

function addPrintAmount(amountInfo, amount) {

    if (!amountInfo)
        return;

    amountInfo.total = utils.accAdd(amountInfo.total || 0, amount || 0);
}

function printNormrice(schedule, amountInfo) {

    var index = 0;
    var contentHtml = '';

    var normtotal = 0;

    var cntypes = {
        "1": "报价项",
        "2": "拓展项",
        "3": "增减项",
        "4": "打包项"
    }

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="8%" align="center">序号</td>';
    contentHtml += '<td width="12%" align="center">功能区</td>';
    contentHtml += '<td width="20%" align="center">项目名称</td>';
    contentHtml += '<td width="9%" align="center">项目单位</td>';
    contentHtml += '<td width="9%" align="center">工程量</td>';
    contentHtml += '<td width="9%" align="center">单位</td>';
    contentHtml += '<td width="9%" align="center">工费单价</td>';
    contentHtml += '<td width="8%" align="center">定额总额</td>';
    contentHtml += '</tr>';
    contentHtml += '</tbody></table>';

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemMs;

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody>';

    $.each(quotationFunctionAreas, function(i, v) {

        var itemIndex = 0;

        var cninfo = i.split('-');

        var cnid = cninfo[0];
        var cnname = cninfo[1];
        var cntype = cninfo[2];

        if (cnid != schedule)
            return true;

        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td colspan="1">';
        contentHtml += '<div align="center">' + utils.getBigNumber(index + 1) + '</div></td>';
        contentHtml += '<td colspan="8">';
        contentHtml += '<div align="left">' + cnname;
        contentHtml += '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function(j, qv) {

            var num = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.initNum);
            var trannum = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.normrice.trannum);
            var salary = parseFloat(qv.normrice.salary);

            var normrice = utils.accMul(num, utils.accMul(trannum, salary));

            normtotal = utils.accAdd(normtotal, normrice);

            contentHtml += '<tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="8%" align="center">' + (itemIndex + 1) + '</td>';
            contentHtml += '<td width="12%" align="center">' + qv.quotationFunctionAreaName + '</td>';
            contentHtml += '<td width="20%" align="center">' + qv.itemName + "(" + cntypes[cntype] + ")" + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.measurementUnit + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.initNum + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.normrice.unit + '</td>';
            contentHtml += '<td width="9%" align="center">' + salary + '</td>';
            contentHtml += '<td width="8%" align="center">' + normrice + '</td>';
            contentHtml += '</tr>';

            itemIndex++;
        });

        index++;
    });

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td height="12" colspan="8" width="8%" align="center"></td>';
    contentHtml += '</tr>';

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="8%" align="center"></td>';
    contentHtml += '<td width="12%" align="center"></td>';
    contentHtml += '<td width="20%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center">总额</td>';
    contentHtml += '<td width="8%" align="center">' + normtotal + '</td>';
    contentHtml += '</tr>';

    addPrintAmount(amountInfo, normtotal);

    return contentHtml;
}

function printNormriceForWorker(schedule) {

    var index = 0;
    var contentHtml = '';

    var normtotal = 0;

    var cntypes = {
        "1": "报价项",
        "2": "拓展项",
        "3": "增减项",
        "4": "打包项"
    }

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="8%" align="center">序号</td>';
    contentHtml += '<td width="12%" align="center">功能区</td>';
    contentHtml += '<td width="20%" align="center">项目名称</td>';
    contentHtml += '<td width="10%" align="center">单位</td>';
    contentHtml += '<td width="10%" align="center">定额单位</td>';
    contentHtml += '<td width="10%" align="center">定额单价</td>';
    contentHtml += '<td width="10%" align="center">工程量</td>';
    contentHtml += '<td width="10%" align="center">总额</td>';
    contentHtml += '</tr>';
    contentHtml += '</tbody></table>';

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemMs;

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody>';

    $.each(quotationFunctionAreas, function(i, v) {

        var itemIndex = 0;

        var cninfo = i.split('-');

        var cnid = cninfo[0];
        var cnname = cninfo[1];
        var cntype = cninfo[2];

        if (cnid != schedule)
            return true;

        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td colspan="1">';
        contentHtml += '<div align="center">' + utils.getBigNumber(index + 1) + '</div></td>';
        contentHtml += '<td colspan="10">';
        contentHtml += '<div align="left">' + cnname;
        contentHtml += '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function(j, qv) {

            var num = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.initNum);
            var trannum = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.normrice.trannum);
            var salary = parseFloat(qv.normrice.salary);

            var normrice = utils.accMul(num, utils.accMul(trannum, salary));

            normtotal = utils.accAdd(normtotal, normrice);

            contentHtml += '<tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="8%" align="center">' + (itemIndex + 1) + '</td>';
            contentHtml += '<td width="12%" align="center">' + qv.quotationFunctionAreaName + '</td>';
            contentHtml += '<td width="20%" align="center">' + qv.itemName + "(" + cntypes[cntype] + ")" + '</td>';
            contentHtml += '<td width="10%" align="center">' + qv.measurementUnit + '</td>';
            contentHtml += '<td width="10%" align="center">' + qv.normrice.unit + '</td>';
            contentHtml += '<td width="10%" align="center">' + salary + '</td>';
            contentHtml += '<td width="10%" align="center"></td>';
            contentHtml += '<td width="10%" align="center"></td>';
            contentHtml += '</tr>';

            itemIndex++;
        });

        index++;
    });

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td height="12" colspan="10" width="8%" align="center"></td>';
    contentHtml += '</tr>';

    return contentHtml;
}

function printNromadd(schedule, amountInfo) {

    var contentHtml = '';

    contentHtml += '<tr bgcolor="#CCCCCC">';
    contentHtml += '<td colspan="1">';
    contentHtml += '<div align="center">' + utils.getBigNumber(2) + '</div></td>';
    contentHtml += '<td colspan="8">';
    contentHtml += '<div align="left">附加项';
    contentHtml += '</div>';
    contentHtml += '</td>';
    contentHtml += '</tr>';

    var itemIndex = 0;
    var total = 0;

    com.post(api.quotation.queryNormriceItemByType, {
        "normriceItem.qid": params.quotation.quotationId,
        "normriceItem.type": 3
    }, function(res) {

        $.each(res.normriceItems, function(i, v) {

            if (v.status != NORMRICE_ITEM_STATUS_CONFIRMED_INT)
                return true;

            if (v.constructionNode.cnid != schedule)
                return true;

            var trannum = parseFloat(v.trannum == '0' ? 1 : v.trannum);
            var salary = parseFloat(v.salary);

            var normrice = utils.accMul(v.num, utils.accMul(trannum, salary));

            total = utils.accAdd(total, normrice);

            contentHtml += '<tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="8%" align="center">' + (itemIndex + 1) + '</td>';
            contentHtml += '<td width="12%" align="center">附加</td>';
            contentHtml += '<td width="20%" align="center">' + v.name + '</td>';
            contentHtml += '<td width="9%" align="center">' + v.unit + '</td>';
            contentHtml += '<td width="9%" align="center">' + v.num + '</td>';
            contentHtml += '<td width="9%" align="center">' + v.unit + '</td>';
            contentHtml += '<td width="9%" align="center">' + v.salary + '</td>';
            contentHtml += '<td width="8%" align="center">' + normrice + '</td>';
            contentHtml += '</tr>';

            itemIndex++;
        });
    }, null, false);

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td height="12" colspan="10" width="8%" align="center"></td>';
    contentHtml += '</tr>';

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="8%" align="center"></td>';
    contentHtml += '<td width="12%" align="center"></td>';
    contentHtml += '<td width="20%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center">总额</td>';
    contentHtml += '<td width="8%" align="center">' + total + '</td>';
    contentHtml += '</tr>';

    addPrintAmount(amountInfo, total);

    return contentHtml;
}

function printAllTotal(amountInfo) {

    var contentHtml = '';

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td height="12" colspan="8" width="8%" align="center"></td>';
    contentHtml += '</tr>';

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="8%" align="center"></td>';
    contentHtml += '<td width="12%" align="center"></td>';
    contentHtml += '<td width="20%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center"></td>';
    contentHtml += '<td width="9%" align="center">所有项目总额</td>';
    contentHtml += '<td width="8%" align="center">' + (amountInfo.total || 0) + '</td>';
    contentHtml += '</tr>';

    return contentHtml;
}

function printFooter() {

    var contentHtml = '';

    contentHtml += '</tbody>';
    contentHtml += '</table>';

    contentHtml += '<table style="font-size: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody>';
    contentHtml += '<tr>';
    contentHtml += '<td height="10"></td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '</tr></tbody></table>';

    return contentHtml;
}

jQuery(function($) {

    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    company = parent.company;
    params = parent.params;
    constant = parent.constant;

    quotationUtils.quotationDetail = {};
    var url = api.quotation.queryQuotationById;

    com.post(url, {
        "quotation.qid": params.quotation.quotationId
    }, function(res) {

        quotationUtils.quotationDetail.quotation = res.quotation;
    }, null, false);

    if (quotationUtils.quotationDetail.quotation.status != 1) {

        com.showAlert(com.warning, "报价未锁定");
        setTimeout(function() {

            com.closePopup();
        }, 3000);

        return false;
    }

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": params.quotation.orderId
    }, function(res) {

        quotationUtils.quotationDetail.quotation.decoration = res.decoration;
    }, null, false);

    var quotationFunctionAreas = [];

    if ((params.quotation.subtype & 1) == 1) {
        com.post(api.quotation.queryQuotationNormrice, {
            "quotation.qid": params.quotation.quotationId
        }, function(res) {

            quotationFunctionAreas = res.quotationFunctionAreas;
        }, null, false);
    }

    var extensions = [];

    if ((params.quotation.subtype & 2) == 2) {
        com.post(api.quotation.queryExtensionNormrice, {
            "extension.orderId": params.quotation.orderId
        }, function(res) {

            extensions = res.extensions;
        }, null, false);
    }

    var addreduces = [];

    if ((params.quotation.subtype & 4) == 4) {

        var options = {
            "addReduce.orderId": params.quotation.orderId,
            "addReduce.status": 0
        };

        com.post(api.quotation.queryAddReduceNormrice, options, function(res) {

            addreduces = [];

            $.each(res.addReduces, function(i, v) {

                // 需付款增项: 已付款/已确认 或 已标识工费(isSalary)才显示并累计, 未付款未标识的不打印
                if (params.quotation.pageType == null && v.type == ADDREDUCE_TYPE_ADD_INT && v.paytype == ADDREDUCE_PAYTYPE_PAY_INT && v.status != ADDREDUCE_STATUS_PAYED_INT && v.status != ADDREDUCE_STATUS_CONFIRMED_INT && v.isSalary != ADDREDUCE_ISSALARY_MARKED_INT) return true;

                addreduces.push(v);
            });
        }, null, false);
    }

    quotationUtils.quotationNormriceProcessing(quotationFunctionAreas, extensions, addreduces);

    generatePrintPage(params.quotation.type, params.quotation.subtype, params.quotation.workType, params.company.name, params.quotation.orderType, params.quotation.showType);

});

function generatePrintPage(type, subtype, workType, company, orderType, showType) {

    var html = "";
    var amountInfo = {
        total: 0
    };

    if (type == 1) {
        html += printHeader(company + "定额工费项目单");
        html += printNormrice(workType, amountInfo);
    } else if (type == 2) {
        html += printHeader(company + "定额工费项目单");
        html += printNormriceForWorker(workType);
    }

    if ((subtype & 8) == 8) {
        html += printNromadd(workType, amountInfo);
    }

    if (type == 1) {
        html += printAllTotal(amountInfo);
    }

    html += printFooter();

    $("#quotationList").html(html);
}
