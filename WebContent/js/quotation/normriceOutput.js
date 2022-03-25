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

function printNormrice(schedule) {

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

function printAdditem(schedule) {

    var contentHtml = '';

    contentHtml += '<tr bgcolor="#CCCCCC">';
    contentHtml += '<td colspan="1">';
    contentHtml += '<div align="center">' + utils.getBigNumber(2) + '</div></td>';
    contentHtml += '<td colspan="8">';
    contentHtml += '<div align="left">附加项';
    contentHtml += '</div>';
    contentHtml += '</td>';
    contentHtml += '</tr>';

    itemIndex = 0;
    total = 0;

    com.post(api.data.queryAdditem, {
        "additem.constructionNode.sort": schedule
    }, function(res) {

        $.each(res.additems, function(i, v) {

            contentHtml += '<tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="8%" align="center"></td>';
            contentHtml += '<td width="12%" align="center"></td>';
            contentHtml += '<td width="20%" align="center">' + v.name + '</td>';
            contentHtml += '<td width="9%" align="center"></td>';
            contentHtml += '<td width="9%" align="center"></td>';
            contentHtml += '<td width="9%" align="center"></td>';
            contentHtml += '<td width="9%" align="center"></td>';
            contentHtml += '<td width="8%" align="center"></td>';
            contentHtml += '</tr>';

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
    contentHtml += '<td width="8%" align="center">0</td>';
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

    quotationUtils.quotationDetail = {};
    var url = api.quotation.queryQuotationById;

    com.post(url, {
        "quotation.qid": params.quotationId
    }, function(res) {
        quotationUtils.quotationDetail.quotation = res.quotation;
    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": params.decorationOrderId
    }, function(res) {
        quotationUtils.quotationDetail.quotation.decoration = res.decoration;
    }, null, false);

    var quotationFunctionAreas = [];

    if ((params.subtype & 1) == 1) {
        com.post(api.quotation.queryQuotationNormrice, {
            "quotation.qid": params.quotationId
        }, function(res) {
            quotationFunctionAreas = res.quotationFunctionAreas;
        }, null, false);
    }

    var extensions = [];

    if ((params.subtype & 2) == 2) {
        com.post(api.quotation.queryExtensionNormrice, {
            "extension.orderId": params.decorationOrderId
        }, function(res) {
            extensions = res.extensions;
        }, null, false);
    }

    var addreduces = [];

    if ((params.subtype & 4) == 4) {
        com.post(api.quotation.queryAddReduceNormrice, {
            "addReduce.orderId": params.decorationOrderId
        }, function(res) {
            addreduces = res.addReduces;
        }, null, false);
    }

    quotationUtils.quotationNormriceProcessing(quotationFunctionAreas, extensions, addreduces);

    generatePrintPage(params.type, params.subtype, params.workType, params.company.name, params.orderType, params.showType);

});

function generatePrintPage(type, subtype, workType, company, orderType, showType) {

    var html = "";

    if (type == 1) {
        html += printHeader(company + "定额工费项目单");
        html += printNormrice(workType);
    }
    else if (type == 2) {
        html += printHeader(company + "定额工费项目单");
        html += printNormriceForWorker(workType);
    }

    if ((subtype & 8) == 8) {
        html += printAdditem(workType);
    }

    html += printFooter();

    $("#quotationList").html(html);
}
