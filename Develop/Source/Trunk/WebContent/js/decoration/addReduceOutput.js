
jQuery(function($) {
	
	var addReduceDetail = {
		addReduceDetails: null,
		addItems: [],
		reduceItems: [],
	};
	
	Api().init('../../js/api/');
    
    params.server = window.server;
	params.authentication = window.authentication;
	
	var p = window.location.search.substr(1);
	
	if(p.indexOf('time=') != -1){
		params.loginTime = p.substring(p.indexOf('time=')).split('=')[1];
	}
	
	var url = api.quotation.queryQuotationForDefaultByOrderId;
	url.url = url.url + "?" + p;
	
	com.post(url, {}, function(res){
		addReduceDetail.quotation = res.quotation;
	}, null ,false);
	
	url = api.addReduce.queryAddReduceItemByAddReduceIds;
	url.url = url.url + "?" + p;
	
	com.post(url, {}, function(res){
		addReduceDetail.addReduceItems = res.addReduceItems;
	}, null, false);
	
	calAddReduceSum();
	generatePrintPage();
	
	function printHeader(headStr){
		return headHtml;
	}
	
	function calAddReduceSum(){
		
		var addReduceItems = addReduceDetail.addReduceItems;
		var addReduceItemLength = addReduceItems.length;
		
		var discount = addReduceDetail.quotation.discount;
		
		var sumAdd = 0;
		var sumReduce = 0;
		
		for(var i=0;i<addReduceItemLength;i++){
			
			var addReduceItem = addReduceItems[i];
			
			var _u = Math.round(parseFloat(addReduceItem.unitPrice) * (addReduceItem.discount == 0 ? 1 : utils.accDiv(discount, 10)) * 100) / 100;
			var _t = Math.round(_u * parseFloat(addReduceItem.num) * 100) / 100;
			
			addReduceItem.unitPrice = _u;
			addReduceItem.total = _t;
			
			if(addReduceItem.type == 0 || addReduceItem.type == 2){ // 增项
				sumAdd = utils.accAdd(sumAdd, _t);
				
				addReduceDetail.addItems.push(addReduceItem);
			}else{ // 减项
				sumReduce = utils.accAdd(sumReduce, _t);
				
				addReduceDetail.reduceItems.push(addReduceItem);
			}
		}
		
		addReduceDetail.sumAdd = sumAdd;
		addReduceDetail.sumReduce = sumReduce;
	}

	function generateAddReduceItem(name, addReduceItems, total, html){
		
		var html = "";
		
		html += name;
		html += '<table width="100%" border="1" cellpadding="1" cellspacing="0" style="FONT-SIZE: 14px">';
		html += '<tbody><tr bgcolor="#FFFFFF" align="center">';
		html += '<td width="40%">项目名称</td>';
		html += '<td width="14%">功能区</td>';
		html += '<td width="10%">单位</td>';
		html += '<td width="13%">数量</td>';
		html += '<td width="13%">单价</td>';
		html += '<td width="10%">金额</td>';
		html += '</tr>';
		
		var itemLength = addReduceItems.length;
		
		for(var i=0;i<itemLength;i++){
			var item = addReduceItems[i];
			
			html += '<tr align="center">';
			html += '<td>'+item.itemName+'</td>';
			html += '<td>'+item.quotationFunctionAreaName+'</td>';
			html += '<td>'+item.measurementUnit+'</td>';
			html += '<td>'+item.num+'</td>';
			html += '<td>'+item.unitPrice+'</td>';
			html += '<td>'+item.total+'</td>';
			html += '</tr>';
		}
		
		html += '</tbody></table>';
		html += name + '金额:' + Math.round(total * 100) / 100 + '元';
		html += '<hr><p>';
		
		return html;
	}

	function generatePrintPage(){
		html = "";
		
		$("#orderId").html("订单编号:" + addReduceDetail.quotation.orderId);
		$("#orderAddr").html("楼盘地址:" + addReduceDetail.quotation.orderAddr);
		$("#supervisor").html("监理:" + addReduceDetail.quotation.supervisorName);
		$("#designer").html("设计师:" + addReduceDetail.quotation.designerName);
		$("#labSumMoney").html("工程最终增减合计金额:" + Math.round(utils.accSub(addReduceDetail.sumAdd, addReduceDetail.sumReduce) * 100) / 100 + "元");
		
		if(addReduceDetail.sumAdd > 0){
			html += generateAddReduceItem("工程增项", addReduceDetail.addItems, addReduceDetail.sumAdd);
		}
		
		if(addReduceDetail.sumReduce > 0){
			html += generateAddReduceItem("工程减项", addReduceDetail.reduceItems, addReduceDetail.sumReduce);
		}
		
		$("#content").html(html);
	}
	
});

