var receipt = {
	pageCount:5,
	tableList:[],
	
	paymentTypeData: {},
	advanceTypeData: {"0":"-"},
	
	commonInfo: {},
	paymentItems: [],
	receiptItems: [],
};

params.hostServer = window.hostServer;

jQuery(function($) {
	var args = window.location.search.substr(1);
	
	var queryMaterialPaymentForNotInitByMrId = api.payment.queryMaterialPaymentForNotInitByMrId;
	queryMaterialPaymentForNotInitByMrId.url = queryMaterialPaymentForNotInitByMrId.url + "?" + args;
	
	com.post(api.ds.materialInfo, {}, function(res){
		$("#advanceType").bindData(res.advanceType, 'key', 'value');
		
		for(var i=0;i<res.advanceType.length;i++){
			var type = res.advanceType[i];
			receipt.advanceTypeData[type.key] = type.value;
		}
		
		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			receipt.paymentTypeData[paymentType.key] = paymentType.value;
		}
	}, null, false);
	
	com.post(queryMaterialPaymentForNotInitByMrId, {}, function(res){
		var materialSubOrder = res.materialSubOrder;
		var materialPayments = res.materialPayments;
		
		var commonInfo = {};
		
		commonInfo["orderId"] = materialSubOrder["orderId"];
		commonInfo["orderAddr"] = materialSubOrder["orderAddr"];
		commonInfo["customerName"] = materialSubOrder["customerName"];
		commonInfo["salesmanName"] = materialSubOrder["salesmanName"];
		commonInfo["supervisorName"] = materialSubOrder["supervisorName"];
		commonInfo["supervisorPhone"] = materialSubOrder["supervisorPhone"];
		commonInfo["departmentName"] = materialSubOrder["departmentName"];
		
		var paymentItems = [];
		var materialBrand = "";
		var materialPaymentDes = "";
		
		for(var i=0;i<materialPayments.length;i++){
			
			var materialPayment = materialPayments[i];
			
			materialBrand = materialPayment.materialBrand;
			
			commonInfo["collectUserName"] = materialPayment.collectUserName;
			commonInfo["collectTime"] = materialPayment.collectTime;
			
			receipt.paymentItems.push({"paymentType": receipt.paymentTypeData[materialPayment.paymentType], "money": materialPayment.referMoney, "materialBrand": materialPayment.materialBrand});
			
			if(materialPayment.des && materialPayment.des != ""){
				materialPaymentDes += materialPayment.des + " "
			}
		}
		
		commonInfo["materialPaymentDes"] = materialPaymentDes;
		
		receipt.commonInfo = commonInfo;
	}, null ,false);
	
	var queryMaterialReceiptByMrId = api.payment.queryMaterialReceiptByMrId;
	queryMaterialReceiptByMrId.url = queryMaterialReceiptByMrId.url + "?" + args;
	
	com.post(queryMaterialReceiptByMrId, {}, function(res){
		
		var materialReceipt = res.materialReceipt;
		
		if(parseFloat(materialReceipt.cash) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.cash),
				"paymentWay":"现金",
			};
			receipt.receiptItems.push(tem);
		}
		
		if(parseFloat(materialReceipt.bank) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.bank),
				"paymentWay":"刷卡",
			};
			receipt.receiptItems.push(tem);
		}
		
		if(parseFloat(materialReceipt.checkv) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.checkv),
				"paymentWay":"转账",
			};
			receipt.receiptItems.push(tem);
		}
		
		if(parseFloat(materialReceipt.installment) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.installment),
				"paymentWay":"分期",
			};
			receipt.receiptItems.push(tem);
		}
		
		if(parseFloat(materialReceipt.accounts) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.accounts),
				"paymentWay":"对公账户",
			};
			receipt.receiptItems.push(tem);
		}
		
		if(parseFloat(materialReceipt.coupon) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.coupon),
				"paymentWay":"优惠券",
			};
			receipt.receiptItems.push(tem);
		}
		
		if(parseFloat(materialReceipt.advance) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.advance),
				"paymentWay":receipt.advanceTypeData[materialReceipt.advanceType] + " 预付款",
			};
			receipt.receiptItems.push(tem);
		}
		
	}, null, false);
	
	console.log(receipt);
	
	if(receipt.paymentItems.length > 0){
		createReceiptTable();
	}
	
});

function createReceiptTable(){
	
	var commonInfo = receipt.commonInfo;
	var paymentItems = receipt.paymentItems;
	var receiptItems = receipt.receiptItems;
	
	console.log(paymentItems);
	
	var center = $("<center></center>").appendTo("#materialPaymentReceipt");
	
	var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
	var noTr = $('<tr></tr>').appendTo(noTable);
	var noTd = $('<td colspan="4"></td>').appendTo(noTr);
	
	var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
	var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
	var headReceiptTd = $('<td colspan="4"></td>').appendTo(headReceiptTr);
	var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
	var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text("方林装饰专用收据").appendTo(headReceiptDiv);
	
	var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
	var noReceiptTd = $('<td style="width: 15%"></td>').text('订单编号: ' + commonInfo["orderId"]).appendTo(orderReceiptTr);
	var customerReceiptTd = $('<td style="width: 20%"></td>').text('客户名: ' + commonInfo["customerName"]).appendTo(orderReceiptTr);
	var designerReceiptTd = $('<td style="width: 35%"></td>').text('设计师: ' + commonInfo["salesmanName"] + "-" + commonInfo["departmentName"]).appendTo(orderReceiptTr);
	var supervisorNameTd = $('<td style="width: 30%"></td>').text('监 理: ' + commonInfo["supervisorName"] + "-" + commonInfo["supervisorPhone"]).appendTo(orderReceiptTr);
	
	var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
	var timeReceiptTd = $('<td colspan="2" style="width: 25%"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(presonReceiptTr);
	var addrReceiptTd = $('<td colspan="2"></td>').text('客户地址: ' + commonInfo["orderAddr"]).appendTo(presonReceiptTr);
	
	var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);
	
	var balancePaymentTd = $('<td style="width: 15%; text-align: center;" rowspan=' + (paymentItems.length+1) + '></td>').html('<strong>收款信息</strong>').appendTo(recePaymentTr);
	var typePaymentTd = $('<td style="width: 20%; text-align: center;"></td>').html('<strong>品牌</strong>').appendTo(recePaymentTr);
	var typePaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
	var amountPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);
	
	var total = 0;
	
	for(var j=0;j<paymentItems.length;j++){
		
		var paymentItem = paymentItems[j];
		
		var receInfoPaymentTr = $('<tr></tr>').appendTo(receiptTable);
		var typeInfoPaymentTd = $('<td style="width: 20%; text-align: center;"></td>').text(paymentItem["materialBrand"]).appendTo(receInfoPaymentTr);
		var typeInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(paymentItem["paymentType"]).appendTo(receInfoPaymentTr);
		var amountInfoPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').text(paymentItem["money"]).appendTo(receInfoPaymentTr);
	}
	
	var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
	
	var balanceReceiptTd = $('<td style="width: 15%; text-align: center;" rowspan=' + (receiptItems.length+1) + ' colspan=2></td>').html('<strong>收据信息</strong>').appendTo(receReceiptTr);
	var typeReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
	var amountReceiptTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);
	
	for(var i=0;i<receiptItems.length;i++){
		
		var receiptItem = receiptItems[i];
		
		var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var typeInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItem["paymentWay"]).appendTo(receInfoReceiptTr);
		var amountInfoPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').text(receiptItem["money"]).appendTo(receInfoReceiptTr);
		
		if(receiptItem["paymentWay"].indexOf("预付款") == -1){
			total += parseFloat(receiptItem["money"]);
		}
	}
	
	var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
	var renReceiptTd = $('<td colspan="2"></td>').text('人民币大写: ' + utils.getCNMoney(total)).appendTo(moneyReceiptTr);
	var renMoneyReceiptTd = $('<td colspan="2"></td>').text('实收: ¥' + total).appendTo(moneyReceiptTr);
	
	var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);;
	var summaryReceiptTd = $('<td colspan="4"></td>').appendTo(summaryReceiptTr);
	var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
	var receReceiptSpan = $('<span></span>').text('收款人:' + commonInfo["collectUserName"]).appendTo(summaryReceiptDiv);
	var cashierReceiptSpan = $('<span></span>').text(' 交款人:').appendTo(summaryReceiptDiv);
	
	var addrReceiptTr = $('<tr></tr>').appendTo(receiptTable);
	var paymentDesTd = $('<td colspan="4"></td>').text('备注: ' + commonInfo["materialPaymentDes"]).appendTo(addrReceiptTr);
		
}
