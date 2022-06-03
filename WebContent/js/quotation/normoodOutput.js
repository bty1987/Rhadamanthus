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
    headHtml += '<td colspan="3" width="40%">客户姓名: ' + decoration.customer.name + '</td>';
    headHtml += '<td colspan="3" width="40%">装修单号: ' + quotation.orderId + '</td>';
    headHtml += '<td colspan="2" width="20%">设 计 师: ' + decoration.designer.currentName + '</td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="3" width="40%">签约店面: ' + decoration.designer.dept.name + '</td>';
    headHtml += '<td colspan="3" width="40%">工程地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber + '</td>';
    headHtml += '<td colspan="2" width="20%">房屋面积: ' + decoration.house.buildArea + '</td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="8" height="10"></td>';
    headHtml += '</tr>';
    headHtml += '</tbody></table>';

    return headHtml;
}

function printNormood() {

    var index = 0;
    var contentHtml = '';

    var normtotal = 0;

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="8%" align="center">序号</td>';
    contentHtml += '<td width="17%" align="center">商品编号</td>';
    contentHtml += '<td width="25%" align="center">商品名称</td>';
    contentHtml += '<td width="15%" align="center">定额上限</td>';
    contentHtml += '<td width="10%" align="center">定额单位</td>';
    contentHtml += '<td width="15%" align="center">库房上限</td>';
    contentHtml += '<td width="10%" align="center">库房单位</td>';
    contentHtml += '</tr>';
    contentHtml += '</tbody></table>';

    var normoods = quotationUtils.quotationDetail.quotationFunctionAreaItemAs;

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody>';

    $.each(normoods, function(j, v) {

        contentHtml += '<tr bgcolor="#FFFFFF">';
        contentHtml += '<td width="8%" align="center">' + (index + 1) + '</td>';
        contentHtml += '<td width="17%" align="center">' + v.goods.no + '</td>';
        contentHtml += '<td width="25%" align="center">' + v.goods.name + '</td>';
        contentHtml += '<td width="15%" align="center">' + v.normnum + '</td>';
        contentHtml += '<td width="10%" align="center">' + v.normunit + '</td>';
        contentHtml += '<td width="15%" align="center">' + v.storenum + '</td>';
        contentHtml += '<td width="10%" align="center">' + v.storeunit + '</td>';
        contentHtml += '</tr>';

        index++;
    });

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td height="12" colspan="12" width="8%" align="center"></td>';
    contentHtml += '</tr>';

    contentHtml += '</tbody>';
    contentHtml += '</table>';

    contentHtml += '<table style="font-size: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody>';
    contentHtml += '<tr>';
    contentHtml += '<td height="10"></td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td><b>&nbsp;甲方签字:</b></td>';
    contentHtml += '<td><b>监理签字:</b></td>';
    contentHtml += '<td><b>质检签字:</b></td>';
    contentHtml += '<td><b>日期:</b></td>';
    contentHtml += '</tr><tr>';
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
        com.post(api.quotation.queryQuotationNormood, {
            "quotation.qid": params.quotation.quotationId
        }, function(res) {

            quotationFunctionAreas = res.quotationFunctionAreas;
        }, null, false);
    }

    var extensions = [];

    if ((params.quotation.subtype & 2) == 2) {
        com.post(api.quotation.queryExtensionNormood, {
            "extension.orderId": params.quotation.orderId
        }, function(res) {

            extensions = res.extensions;
        }, null, false);
    }

    var addreduces = [];

    if ((params.quotation.subtype & 4) == 4) {
        com.post(api.quotation.queryAddReduceNormood, {
            "addReduce.orderId": params.quotation.orderId
        }, function(res) {

            addreduces = res.addReduces;
        }, null, false);
    }

    var normoods = [];

    if ((params.quotation.subtype & 8) == 8) {

        com.post(api.quotation.queryNormoodItem, {
            "normoodItem.qid": params.quotation.quotationId
        }, function(res) {

            normoods = res.normoodItems;
        }, null, false);
    }

    quotationUtils.quotationNormoodProcessing(quotationFunctionAreas, extensions, addreduces, normoods);

    generatePrintPage(params.quotation.type, params.quotation.subtype, params.quotation.workType, params.company.name, params.quotation.orderType, params.quotation.showType);

});

function generatePrintPage(type, subtype, workType, company, orderType, showType) {

    var html = "";

    html += printHeader(company + "定额工费项目单");
    html += printNormood();

    $("#quotationList").html(html);
}
