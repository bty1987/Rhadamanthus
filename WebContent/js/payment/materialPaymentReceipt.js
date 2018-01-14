var receipt = {
	pageCount:5,
	tableList:[],
	
	paymentTypeData: {},
	advanceTypeData: {"0":"-"},
	
	commonInfo: {},
	paymentItems: [],
	receiptItems: [],
};

jQuery(function($) {

	var params = {};
	api = parent.api;
	config = parent.config ;
	server = parent.server;
	utils = parent.utils;
	com = parent.com;
	$ = parent.$;

	params.server = window.server;
	params.authentication = parent.params.authentication;
	params = parent.params;


	var queryDecorationForCommonByOrderId = api.decoration.queryDecorationForCommonByOrderId;

	var queryMaterialPaymentForNotInitByMrId = api.payment.queryMaterialPaymentForNotInitByMrId;

	com.post(api.ds.payment, {}, function(res){
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
	
	com.post(queryDecorationForCommonByOrderId, {"decoration.orderId":params.decorationOrderMOrderId}, function(res){

		var decorationOrder = res.decoration;
		var commonInfo = {};
		
		commonInfo["orderId"] = decorationOrder.orderId;
		commonInfo["orderAddr"] = decorationOrder.house.village.name + " " + decorationOrder.house.houseNumber;
		commonInfo["customerName"] = decorationOrder.customer.name;
		commonInfo["salesmanName"] = decorationOrder.designer.currentName;
		commonInfo["supervisorName"] = decorationOrder.supervisor.currentName == null ? "" : decorationOrder.supervisor.currentName;
		commonInfo["supervisorPhone"] = decorationOrder.supervisor.phone == null ? "" : decorationOrder.supervisor.phone;
		commonInfo["departmentName"] = decorationOrder.designer.dept.deptName;

		receipt.commonInfo = commonInfo;

	}, null, false);
	
	com.post(queryMaterialPaymentForNotInitByMrId, {"materialReceipt.mrId":params.mrId}, function(res){

		var materialPayments = res.materialPayments;
		var paymentItems = [];
		var materialBrand = "";
		var materialPaymentDes = "";
		
		for(var i=0;i<materialPayments.length;i++){
			
			var materialPayment = materialPayments[i];
			
			materialBrand = materialPayment.brand;

			receipt.commonInfo["collectUserName"] = materialPayment.collecter.currentName;
			receipt.commonInfo["collectTime"] = materialPayment.collectTime;
			
			receipt.paymentItems.push({"paymentType": receipt.paymentTypeData[materialPayment.paymentType], "money": materialPayment.referMoney, "materialBrand": materialPayment.materialBrand});
			
			if(materialPayment.comment && materialPayment.comment != ""){
				materialPaymentDes += materialPayment.comment + " "
			}
		}
		
		receipt.commonInfo["materialPaymentDes"] = materialPaymentDes;

	}, null ,false);
	
	var queryMaterialReceiptByMrId = api.payment.queryMaterialReceiptByMrId;

	com.post(queryMaterialReceiptByMrId, {"materialReceipt.mrId":params.mrId}, function(res){
		
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
	
	if(receipt.paymentItems.length > 0){
		createReceiptTable();
	}
	
});

function createReceiptTable(){
	
	var commonInfo = receipt.commonInfo;
	var paymentItems = receipt.paymentItems;
	var receiptItems = receipt.receiptItems;

	var center = $("<center></center>").appendTo("#materialPaymentReceipt");
	
	var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
	var noTr = $('<tr></tr>').appendTo(noTable);
	var noTd = $('<td colspan="4"></td>').appendTo(noTr);
	var headReceiptDiv = $('<div style="text-align: center; background-color:#ffffff"></div>').appendTo(center);
	var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(parent.params.company.name + "专用收据").appendTo(headReceiptDiv);
	
	var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);

	
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
