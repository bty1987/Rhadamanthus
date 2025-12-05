function printHeader(headStr) {

    var headHtml = "";

    headHtml += '<table style="font-size: 14px" width="100%" border="0" cellpadding="1" cellspacing="0">';
    headHtml += '<tbody><tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="8" style="font-size: 18px" align="center"> <b>' + headStr + '</b></td>';
    headHtml += '</tr>';
    headHtml += '<tr bgcolor="#FFFFFF">';
    headHtml += '<td colspan="8" height="10"></td>';
    headHtml += '</tr>';
    headHtml += '</tbody></table>';

    return headHtml;
}

function printProjectTable(type) {

    var contentHtml = '';
    var _quoteArea = protation.protation.quoteArea;
    var _quotePrice = protation.protation.quotePrice;
    var _manageRate = protation.protation.manageRate;
    var _accdPrice = protation.protation.accdPrice;
    var _accmPrice = protation.protation.accmPrice;
    var _manageProfit = protation.protation.manageProfit;
    var _advanceProfit = protation.protation.advanceProfit;
    var _managePrice = protation.protation.managePrice;
    var _taxPrice = protation.protation.taxPrice;
    var _preferPrice = protation.protation.preferPrice;
    var _subdPrice = protation.protation.subdPrice;
    var _submPrice = protation.protation.submPrice;
    var _subcPrice = protation.protation.subcPrice;

    contentHtml += '<table style="font-size: 12px" width="100%" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody><tr>';
    contentHtml += '<td colspan="4" style="font-size: 15px; font-weight: bold;" align="center">' + presignProduce.name + '</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr style="font-weight: bold;">';
    contentHtml += '<td width="5%" align="center">项目</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">计价面积</td>';
    contentHtml += '<td width="5%" align="center">金额</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">' + protation.protation.name + '</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">' + _quoteArea + '</td>';
    contentHtml += '<td width="5%" align="center">' + utils.changeThrDecimal(utils.accAdd(utils.accMul(_quotePrice, utils.accAdd(1, _manageRate)), utils.accAdd(_accdPrice, _accmPrice))) + '</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td colspan="4" style="font-size: 15px; font-weight: bold;" align="center">标配产品</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr style="font-weight: bold;">';
    contentHtml += '<td width="5%" align="center">项目</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">数量</td>';
    contentHtml += '<td width="5%" align="center">金额</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">标配产品</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">1</td>';
    contentHtml += '<td width="5%" align="center">' + _quotePrice + '</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">优惠金额</td>';
    contentHtml += '<td colspan="2" width="5%" align="center"></td>';
    contentHtml += '<td width="5%" align="center">' + _preferPrice + '</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">管理费收取比例</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">1</td>';
    contentHtml += '<td width="5%" align="center">' + _manageRate + '</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">管理费</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">1</td>';
    contentHtml += '<td width="5%" align="center">' + ((type & 1) == 1 ? _managePrice : '') + '</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">税金</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">1</td>';
    contentHtml += '<td width="5%" align="center">' + _taxPrice + '</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">管理优惠</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">1</td>';
    contentHtml += '<td width="5%" align="center">' + _manageProfit + '</td>';
    contentHtml += '</tr>';
    
    if(_advanceProfit != 0){
        contentHtml += '<tr>';
        contentHtml += '<td width="5%" align="center">特殊优惠</td>';
        contentHtml += '<td colspan="2" width="5%" align="center">1</td>';
        contentHtml += '<td width="5%" align="center">' + _advanceProfit + '</td>';
        contentHtml += '</tr>';
    }
    
    return contentHtml;
}

function addtionTable(type) {

    var index = 0;
    var contentHtml = '';
    var price = 0;

    contentHtml += '<tr>';
    contentHtml += '<td colspan="4" style="font-size: 15px; font-weight: bold;" align="center">赋能产品</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr style="font-weight: bold;">';
    contentHtml += '<td width="5%" align="center">项目</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">数量</td>';
    contentHtml += '<td width="5%" align="center">金额</td>';
    contentHtml += '</tr>';

    $.each(protationItems, function(i, qv) {

        price = qv.areaCale == constant.data().presignItem.AREACALE_NUMBER_INT ? utils.changeThrDecimal(utils.accMul(qv.price, qv.num)) : utils.changeThrDecimal(utils.accMul(utils.accMul(qv.price, qv.num), protation.protation.quoteArea));

        if (qv.type == constant.quotation().protationItem.TYPE_ACCWORK_INT || qv.type == constant.quotation().protationItem.TYPE_ACCMAIN_INT) {
            contentHtml += '<tr>';
            contentHtml += '<td width="5%" align="center">' + qv.name + '</td>';
            contentHtml += '<td colspan="2" width="5%" align="center">' + qv.num + '</td>';
            contentHtml += '<td width="5%" align="center">' + ((type & 2) == 2 ? price : '') + '</td>';
            contentHtml += '</tr>';
        }

        index++;
    });

    return contentHtml;
}

function optionalTable(type) {

    var index = 0;
    var contentHtml = '';
    var price = 0;

    contentHtml += '<tr>';
    contentHtml += '<td colspan="4" style="font-size: 15px; font-weight: bold;" align="center">标配外功能区</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr style="font-weight: bold;">';
    contentHtml += '<td width="5%" align="center">项目</td>';
    contentHtml += '<td width="2%" align="center">基础量</td>';
    contentHtml += '<td width="3%" align="center">数量</td>';
    contentHtml += '<td width="5%" align="center">金额</td>';
    contentHtml += '</tr>';

    $.each(protationItems, function(i, qv) {

        price = qv.areaCale == constant.data().presignItem.AREACALE_NUMBER_INT ? utils.changeThrDecimal(utils.accMul(qv.price, utils.accSub(qv.num, qv.basicNum))) : utils.changeThrDecimal(utils.accMul(utils.accMul(qv.price, utils.accSub(qv.num, qv.basicNum)), protation.protation.quoteArea));

        if (qv.type == constant.quotation().protationItem.TYPE_BASE_INT) {
            contentHtml += '<tr>';
            contentHtml += '<td width="5%" align="center">' + qv.name + '</td>';
            contentHtml += '<td width="5%" align="center">' + qv.basicNum + '</td>';
            contentHtml += '<td width="5%" align="center">' + qv.num + '</td>';
            contentHtml += '<td width="5%" align="center">' + ((type & 4) == 4 ? price : '') + '</td>';
            contentHtml += '</tr>';
        }

        index++;
    });

    return contentHtml;
}

function customTable(type) {

    var contentHtml = '';

    contentHtml += '<tr>';
    contentHtml += '<td  colspan="4" style="font-size: 15px; font-weight: bold;" align="center">个性化产品</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr style="font-weight: bold">';
    contentHtml += '<td width="5%" align="center">项目</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">数量</td>';
    contentHtml += '<td width="5%" align="center">金额</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">工程个性化预收</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">1</td>';
    contentHtml += '<td width="5%" align="center">' + ((type & 8) == 8 ? protation.protation.adddPrice : '') + '</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr>';
    contentHtml += '<td width="5%" align="center">主材个性化预收</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">1</td>';
    contentHtml += '<td width="5%" align="center">' + ((type & 8) == 8 ? protation.protation.addmPrice : '') + '</td>';
    contentHtml += '</tr>';
    
    return contentHtml;
}

function subtractTable(type) {

    var index = 0;
    var contentHtml = '';
    var price = 0;

    contentHtml += '<tr>';
    contentHtml += '<td colspan="4" style="font-size: 15px; font-weight: bold;" align="center">标配产品减项</td>';
    contentHtml += '</tr>';
    contentHtml += '<tr style="font-weight: bold;">';
    contentHtml += '<td width="5%" align="center">项目</td>';
    contentHtml += '<td colspan="2" width="5%" align="center">数量</td>';
    contentHtml += '<td width="5%" align="center">金额</td>';
    contentHtml += '</tr>';

    $.each(protationItems, function(i, qv) {

        price = qv.areaCale == constant.data().presignItem.AREACALE_NUMBER_INT ? utils.changeThrDecimal(utils.accMul(qv.price, qv.num)) : utils.changeThrDecimal(utils.accMul(utils.accMul(qv.price, qv.num), protation.protation.quoteArea));

        if (qv.type == constant.quotation().protationItem.TYPE_CUTWORK_INT || qv.type == constant.quotation().protationItem.TYPE_CUTMAIN_INT || qv.type == constant.quotation().protationItem.TYPE_CUTCURRENT_INT) {
            contentHtml += '<tr>';
            contentHtml += '<td width="5%" align="center">' + qv.name + '</td>';
            contentHtml += '<td colspan="2" width="5%" align="center">' + utils.accSub(0, qv.num) + '</td>';
            contentHtml += '<td width="5%" align="center">' + ((type & 16) == 16 ? price : '') + '</td>';
            contentHtml += '</tr>';
        }

        index++;
    });

    contentHtml += '<tr>';
    contentHtml += '<td width="5%" style="font-size: 15px;font-weight: bold;" align="center">预签计价合计</td>';
    contentHtml += '<td colspan="3" width="5%" align="center">' + protation.protation.totalPrice + '</td>';
    contentHtml += '</tr>';
    contentHtml += '</tbody></table>';

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

    pid = params.quotation.protationId;

    if (pid == null)
        return false;

    protation = null;
    protationItems = null;
    presignProduce = null;

    quotationUtils.quotationDetail = {};

    com.post(api.quotation.queryProtationByPid, {
        "protation.pid": pid
    }, function(res) {

        protation = res;
    }, null, false);

    com.post(api.quotation.queryProtationItemByPid, {
        "protationItem.pid": pid
    }, function(res) {

        protationItems = res.protationItems;
    }, null, false);

    com.post(api.quotation.queryPresignProduceByPpid, {
        "presignProduce.ppid": protation.protation.ppid
    }, function(res) {

        presignProduce = res.presignProduce;
    }, null, false);

    generatePrintPage(params.company.drganization.name, params.quotation.protation.printConf.type);

});

function generatePrintPage(company, type) {

    var html = "";

    html += printHeader(company + "家装项目预签单");
    html += printProjectTable(type);
    html += addtionTable(type);
    html += optionalTable(type);
    html += customTable(type);
    html += subtractTable(type);

    $("#protationLits").html(html);
}