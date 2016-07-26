var receipt = {
	pageCount:5,
	tableList:[],
	
	paymentTypeData: {"2":"定金", "3":"补款", "5":"补款退款"},
};

params.server = window.server;
params.authentication = window.authentication;

jQuery(function($) {
	var args = window.location.search.substr(1);
	
	var url = '';
	var ename = '';
	var type = '';
	
	if(args.indexOf('type=1') != -1){
		url = api.material.queryMaterialSubOrderByMsoId;
		ename = 'materialSubOrderItems';
		type = 1;
	}else if(args.indexOf('type=2') != -1){
		url = api.material.queryMaterialSubOrderRefundByMsoIdAIdent;
		ename = 'materialSubOrderRefunds';
		type = 2;
	}
	
	url.url = url.url + "?" + args;
	
	com.post(url, {}, function(res){
		var materialSubOrder = res.materialSubOrder;
		var materialSubOrderItems = res[ename];
		
		var commonInfo = {};
		
		commonInfo["materialOrderNo"] = materialSubOrder["msoNo"];
		commonInfo["customerName"] = materialSubOrder["customerName"];
		commonInfo["orderAddr"] = materialSubOrder["orderAddr"];
		commonInfo["salesmanName"] = materialSubOrder["salesmanName"];
		commonInfo["materialerName"] = materialSubOrder["materialerName"];
		commonInfo["depositPayment"] = materialSubOrder["depositPayment"];
		commonInfo["fullPayment"] =materialSubOrder["fullPayment"];
		commonInfo["maling"] =  utils.accAdd(parseFloat(materialSubOrder["maling"]), parseFloat(materialSubOrder["venderMaling"]));
		commonInfo["total"] = materialSubOrder["total"];
		
		createReceiptTable(commonInfo, materialSubOrderItems, type);
	});
});

function createReceiptTable(commonInfo, itemInfo, type){
	
	var total = 0;
	var refundTotal = 0;
	
	var packageNames = [];
	
	var center = $("<center></center>").appendTo("#materialSubOrderReceipt");
	
	var noTable = $('<table style="width: 80%; border-collapse:collapse;"></table>').appendTo(center);
	var noTr = $('<tr></tr>').appendTo(noTable);
	var noTd = $('<td colspan="8"></td>').appendTo(noTr);
	
	var receiptTable = $('<table border="1" style="width: 80%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
	var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
	var headReceiptTd = $('<td colspan="8"></td>').appendTo(headReceiptTr);
	var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
	var headReceiptH2 = $('<h2></h2>').text("主材型号明细信息").appendTo(headReceiptDiv);
	
	var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
	var noReceiptTd = $('<td colspan="3"></td>').text('订单编号: ' + commonInfo["materialOrderNo"]).appendTo(orderReceiptTr);
	var addrReceiptTd = $('<td colspan="5"></td>').text('客户地址: ' + commonInfo["orderAddr"]).appendTo(orderReceiptTr);
	
	var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
	var customerReceiptTd = $('<td colspan="2"></td>').text('客 户 名: ' + commonInfo["customerName"]).appendTo(presonReceiptTr);
	var designerReceiptTd = $('<td colspan="3"></td>').text('业 务 员: ' +commonInfo["salesmanName"]).appendTo(presonReceiptTr);
	var materialReceiptTd = $('<td colspan="3"></td>').text('主材导购: ' + commonInfo["materialerName"]).appendTo(presonReceiptTr);
	
	var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
	var materialPackageNameTd = $('<td style="text-align: center;"></td>').html('<strong>套餐名称</strong>').appendTo(receReceiptTr);
	var materialModelNameTd = $('<td style="text-align: center;"></td>').html('<strong>型号名称</strong>').appendTo(receReceiptTr);
	var materialTypeNameTd = $('<td style="text-align: center;"></td>').html('<strong>品类</strong>').appendTo(receReceiptTr);
	var materialBrandNameTd = $('<td style="text-align: center;"></td>').html('<strong>品牌</strong>').appendTo(receReceiptTr);
	var measurementUnitNameTd = $('<td style="text-align: center;"></td>').html('<strong>单位</strong>').appendTo(receReceiptTr);
	var priceTd = $('<td style="text-align: center;"></td>').html('<strong>售价</strong>').appendTo(receReceiptTr);
	var numTd = $('<td style="text-align: center;"></td>').html('<strong>数量</strong>').appendTo(receReceiptTr);
	var totalTd = $('<td style="text-align: center;"></td>').html('<strong>总价</strong>').appendTo(receReceiptTr);
	
	for(var i=0;i<itemInfo.length;i++){
		var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var packageNameTd = $('<td style="text-align: center;"></td>').html(itemInfo[i].packageName == '' ? "-" : itemInfo[i].packageName).appendTo(receReceiptTr);
		var modelNameTd = $('<td style="text-align: center;"></td>').html(itemInfo[i].materialModelName).appendTo(receReceiptTr);
		var typeNameTd = $('<td style="text-align: center;"></td>').html(itemInfo[i].materialTypeName).appendTo(receReceiptTr);
		var brandNameTd = $('<td style="text-align: center;"></td>').html(itemInfo[i].materialBrandName).appendTo(receReceiptTr);
		var measurementUnitNameTd = $('<td style="text-align: center;"></td>').html(itemInfo[i].measurementUnitName).appendTo(receReceiptTr);
		var priceTd = $('<td style="text-align: center;"></td>').html("-").appendTo(receReceiptTr);
		var numTd = $('<td style="text-align: center;"></td>').html(itemInfo[i].num).appendTo(receReceiptTr);
		var totalTd = $('<td style="text-align: center;"></td>').html("-").appendTo(receReceiptTr);
		
		var packageName = itemInfo[i].packageName;
		
		if(packageName == "" || (packageName != "") && packageNames.indexOf(packageName) == -1){
			total = utils.accAdd(total, itemInfo[i].total);
			packageNames.push(packageName);
		}
		
		if(type == 2){
			refundTotal = utils.accAdd(refundTotal, itemInfo[i].total)
		}
	}
	
	if(type == 1){
		var depositPaymentTr = $('<tr></tr>').appendTo(receiptTable);
		var depositPaymentTd = $('<td></td>').text('定金').appendTo(depositPaymentTr);
		var depositPaymentCapitalTd = $('<td colspan=2></td>').text('人民币大写:'+utils.getCNMoney(commonInfo["depositPayment"])).appendTo(depositPaymentTr);
		var depositPaymentValTd = $('<td></td>').text('¥'+commonInfo["depositPayment"]).appendTo(depositPaymentTr);
		var emptyTd = $('<td colspan=4></td>').appendTo(depositPaymentTr);
		
		var fullPaymentTr = $('<tr></tr>').appendTo(receiptTable);
		var fullPaymentTd = $('<td></td>').text('补款: ').appendTo(fullPaymentTr);
		var fullPaymentCapitalTd = $('<td colspan=2></td>').text('人民币大写:'+utils.getCNMoney(commonInfo["fullPayment"])).appendTo(fullPaymentTr);
		var fullPaymentValTd = $('<td></td>').text('¥'+commonInfo["fullPayment"]).appendTo(fullPaymentTr);
		var emptyTd = $('<td colspan=4></td>').appendTo(fullPaymentTr);
		
		var malingTr = $('<tr></tr>').appendTo(receiptTable);
		var malingTd = $('<td></td>').text('抹零: ').appendTo(malingTr);
		var malingCapitalTd = $('<td colspan=2></td>').text('人民币大写:'+utils.getCNMoney(commonInfo["maling"])).appendTo(malingTr);
		var malingValTd = $('<td></td>').text('¥'+commonInfo["maling"]).appendTo(malingTr);
		var emptyTd = $('<td colspan=4></td>').appendTo(malingTr);
		
		total = commonInfo["total"];
	}
	
	var totalTr = $('<tr></tr>').appendTo(receiptTable);
	var totalTd = $('<td></td>').text('总价: ').appendTo(totalTr);
	var totalCapitalTd = $('<td colspan=2></td>').text('人民币大写:'+utils.getCNMoney(total)).appendTo(totalTr);
	var totalValTd = $('<td></td>').text('¥'+total).appendTo(totalTr);
	var emptyTd = $('<td colspan=4></td>').appendTo(totalTr);
	
	if(type == 2){
		var refundTotalTr = $('<tr></tr>').appendTo(receiptTable);
		var totalTd = $('<td></td>').text('退款总价: ').appendTo(refundTotalTr);
		var totalCapitalTd = $('<td colspan=2></td>').text('人民币大写:'+utils.getCNMoney(total)).appendTo(refundTotalTr);
		var totalValTd = $('<td></td>').text('¥'+total).appendTo(refundTotalTr);
		var emptyTd = $('<td colspan=4></td>').appendTo(refundTotalTr);
	}
	
}
