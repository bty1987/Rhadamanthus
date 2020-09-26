
function printHeader(headStr){

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

function printNormrice(schedule){
    
    var index = 0;
    var contentHtml = '';
    
    var normtotal = 0;

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="8%" align="center">序号</td>';
    contentHtml += '<td width="12%" align="center">商品编号</td>';
    contentHtml += '<td width="20%" align="center">项目名称</td>';
    contentHtml += '<td width="9%" align="center">项目单位</td>';
    contentHtml += '<td width="9%" align="center">工程量</td>';
    contentHtml += '<td width="9%" align="center">单位</td>';
    contentHtml += '<td width="9%" align="center">工费单价</td>';
    contentHtml += '<td width="8%" align="center">定额总额</td>';
    contentHtml += '<td width="8%" align="center">变更量</td>';
    contentHtml += '<td width="8%" align="center">变更总额</td>';
    contentHtml += '</tr>';
    contentHtml += '</tbody></table>';

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemMs;
    
    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody>';

    $.each(quotationFunctionAreas, function (i, v){
        
        var itemIndex = 0;
        
        var cnid = i.split('-')[0];
        var cnname = i.split('-')[1];
        
        if(cnid != schedule) return true;
        
        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td colspan="1">';
        contentHtml += '<div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
        contentHtml += '<td colspan="10">';
        contentHtml += '<div align="left">' + i.split('-')[1] + '';
        contentHtml += '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function (j, qv){
            
            var num = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.initNum);
            var trannum = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.normrice.trannum);
            var salary = parseFloat(qv.normrice.salary);
            
            var normrice = utils.accMul(num, utils.accMul(trannum, salary));
            
            normtotal = utils.accAdd(normtotal, normrice);
            
            contentHtml += '<tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="8%" align="center">' + (itemIndex+1) + '</td>';
            contentHtml += '<td width="12%" align="center">' + qv.quotationFunctionAreaName + '</td>';
            contentHtml += '<td width="20%" align="center">' + qv.itemName + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.measurementUnit + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.initNum + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.normrice.unit + '</td>';
            contentHtml += '<td width="9%" align="center">' + salary + '</td>';
            contentHtml += '<td width="8%" align="center">' + normrice + '</td>';
            contentHtml += '<td width="8%" align="center"></td>';
            contentHtml += '<td width="8%" align="left"></td>';
            contentHtml += '</tr>';
            
            itemIndex++;
        });
        
        index++;
    });
    
    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td height="12" colspan="10" width="8%" align="center"></td>';
    contentHtml += '</tr>';
            
    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td colspan="8" width="8%" align="center"></td>';
    contentHtml += '<td width="8%" align="center">定额总额</td>';
    contentHtml += '<td width="8%" align="center">' + utils.changeTwoDecimal(normtotal) + '</td>';
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
	config = parent.config ;
	server = parent.server;
	utils = parent.utils;
	com = parent.com;
	company = parent.company;
	params = parent.params;

	quotationUtils.quotationDetail = {};
	var url = api.quotation.queryQuotationById;

	com.post(url, {"quotation.qid": params.quotationId}, function(res){
		quotationUtils.quotationDetail.quotation = res.quotation;
	}, null, false);

	com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": params.decorationOrderId}, function(res){
		quotationUtils.quotationDetail.quotation.decoration = res.decoration;
	}, null, false);

	com.post(api.quotation.queryQuotationNormrice, {"quotation.qid": params.quotationId}, function(res){
	    quotationUtils.quotationNormriceProcessing(res.quotationFunctionAreas);
	}, null, false);

	generatePrintPage(params.type, params.subtype, params.workType, params.company.name, params.orderType, params.showType);

});

function generatePrintPage(type, subtype, workType, company, orderType, showType){
    
    var html = "";

    html += printHeader(company + "定额工费项目单");
    html += printNormrice(workType);

	$("#quotationList").html(html);
}


