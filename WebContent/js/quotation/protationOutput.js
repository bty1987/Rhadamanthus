function printHeader(headStr){
	
	var headHtml = "";
	headHtml += '<table style="font-size: 14px" width="100%" bgcolor="#000000" border="0" cellpadding="1" cellspacing="0">';
	headHtml += '<tbody><tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" style="font-size: 20px" align="center"> <b>' + headStr + '</b></td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" height="10"></td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="3" width="40%">装修单号: ' + params.decorationOrderId + '</td>';
	headHtml += '<td colspan="3" width="40%">起报价: ' + protation.protation.quotePrice + '</td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="3" width="40%">计价单价: ' + protation.protation.unitPrice + '</td>';
	headHtml += '<td colspan="3" width="40%">优惠价: ' + protation.protation.preferPrice + '</td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" height="10"></td>';
	headHtml += '</tr>';
	headHtml += '</tbody></table>';
	
	return headHtml;
}

function printProjectTable() {

	var index = 0;
	var contentHtml = '';
	var protations = protationsa;
	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
	contentHtml += '<td width="4%" align="center">序号</td>';
	contentHtml += '<td width="7%" align="center">编号</td>';
	contentHtml += '<td width="18%" align="center">项目名称</td>';
	contentHtml += '<td width="5%" align="center">数量</td>';
	contentHtml += '<td width="5%" align="center">单价</td>';
	contentHtml += '</tr>';
	contentHtml += '</tbody></table>';


	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';
	$.each(protations, function (i, qv){
		contentHtml += '<tr bgcolor="#FFFFFF">';
		contentHtml += '<td width="4%" align="center">' + (index+1) + '</td>';
		contentHtml += '<td width="7%" align="center">' + qv.piid + '</td>';
		contentHtml += '<td width="18%" align="left">' + qv.name + '</td>';
		contentHtml += '<td width="5%" align="center">' + qv.num + '</td>';
		contentHtml += '<td width="5%" align="center">' + qv.price + '</td>';
		contentHtml += '</tr>';
		index++;
	});

	contentHtml += '<tr bgcolor="#FFFFFF">';
	contentHtml += '<td colspan="12" align="left">装修单预签总价:' + protation.protation.totalPrice + '元</td>';
	contentHtml += '</tr>';

	contentHtml += '</tbody>';
	contentHtml += '</table>';

	contentHtml += '<table style="font-size: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';
	contentHtml += '<tr>';
	contentHtml += '<td height="10"></td>';
	contentHtml += '</tr>';
	contentHtml += '<tr>';
	contentHtml += '<td><b>&nbsp;客户签字:</b></td>';
	contentHtml += '<td><b>设计师签字:</b></td>';
	contentHtml += '<td><b>项目经理签字:</b></td>';
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
	pid = params.protationId
	protation = null;
	protationsa = null;
	quotationUtils.quotationDetail = {};
	var url = api.quotation.queryProtationByPid;
	com.post(api.quotation.queryProtationByPid, {"protation.pid": pid}, function(res){
		protation = res;
	}, null, false);
	
	com.post(api.quotation.queryProtationItemByPid, {"protationItem.pid": pid}, function(res){
	    protationsa = res.protationItems;
	}, null, false);
	generatePrintPage();
	
})

function generatePrintPage(){
	var html = "";

	html += printHeader("装修单预签");
	html += printProjectTable();
	$("#protationLits").html(html)
}