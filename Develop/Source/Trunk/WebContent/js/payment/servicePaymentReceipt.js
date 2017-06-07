var receipt = {
	onePageCount: 5,
	payments: [],
	receipts: [],
	order: null,
};

jQuery(function($) {
	Api().init('../../js/api/');
	params.server = window.server;
	params.authentication = window.authentication;
	
	var p = window.location.search.substr(1);
	var a = p.split("&");
	
	if(p.indexOf('time=') != -1){
		params.loginTime = p.substring(p.indexOf('time=')).split('=')[1];
	}
	
	var queryDecorationOrderForCommonByOrderId = api.decoration.queryDecorationOrderForCommonByOrderId;
	
	queryDecorationOrderForCommonByOrderId.url = queryDecorationOrderForCommonByOrderId.url + "?" + p;

	com.post(queryDecorationOrderForCommonByOrderId, {}, function(res){
		receipt.order = res.decorationOrder;
	}, null, false);
	
	var queryServicePaymentForNotInitBySrId = api.payment.queryServicePaymentForNotInitBySrId;

	queryServicePaymentForNotInitBySrId.url = queryServicePaymentForNotInitBySrId.url + "?" + p;
	
	com.post(queryServicePaymentForNotInitBySrId, {}, function(res){
		var payments = res.servicePayments;

		for(var i=0;i<payments.length;i++){
			var payment = payments[i];

			receipt.payments.push({"status": payment.status, "serviceMoney": payment.serviceMoney,"advanceMoney": payment.advanceMoney});
		}
		
	}, null, false);
	
	var queryServiceReceiptBySrId = api.payment.queryServiceReceiptBySrId;

	queryServiceReceiptBySrId.url = queryServiceReceiptBySrId.url + "?" + p;
	
	com.post(queryServiceReceiptBySrId, {}, function(res){
		
		var serviceReceiptDes = "";

		var serviceReceipt = res.serviceReceipt;
		
		if(parseFloat(serviceReceipt.cash)!=0){
			var tem = {
				"paymentId":serviceReceipt.srId,
				"collectTime":serviceReceipt.collectTime,
				"collectUser":serviceReceipt.collecterName,
				"money":parseFloat(serviceReceipt.cash),
				"paymentWay":"现金"
			};
			receipt.receipts.push(tem);
		}
		if(parseFloat(serviceReceipt.bank)!=0){
			var tem = {
				"paymentId":serviceReceipt.srId,
				"collectTime":serviceReceipt.collectTime,
				"collectUser":serviceReceipt.collecterName,
				"money":parseFloat(serviceReceipt.bank),
				"paymentWay":"刷卡"
			};
			receipt.receipts.push(tem);
		}
		if(parseFloat(serviceReceipt.checkv)!=0){
			var tem = {
				"paymentId":serviceReceipt.srId,
				"collectTime":serviceReceipt.collectTime,
				"collectUser":serviceReceipt.collecterName,
				"money":parseFloat(serviceReceipt.checkv),
				"paymentWay":"转账"
			};
			receipt.receipts.push(tem);
		}
		if(parseFloat(serviceReceipt.installment)!=0){
			var tem = {
				"paymentId":serviceReceipt.srId,
				"collectTime":serviceReceipt.collectTime,
				"collectUser":serviceReceipt.collecterName,
				"money":parseFloat(serviceReceipt.installment),
				"paymentWay":"分期"
			};
			receipt.receipts.push(tem);
		}
		if(parseFloat(serviceReceipt.accounts)!=0){
			var tem = {
				"paymentId":serviceReceipt.srId,
				"collectTime":serviceReceipt.collectTime,
				"collectUser":serviceReceipt.collecterName,
				"money":parseFloat(serviceReceipt.accounts),
				"paymentWay":"对公账户"
			};
			receipt.receipts.push(tem);
		}
		
		if(serviceReceipt.des && serviceReceipt.des != ""){
			serviceReceiptDes += serviceReceipt.des + " ";
		}
		
		receipt.order.serviceReceiptDes = serviceReceiptDes;
	}, null, false);
	
	if(receipt.payments.length != 0 && receipt.receipts.length != 0){
		generateOneReceipt();
	}
});

function generateOneReceipt(){

	var num = receipt.receipts.length;
	var count = 0;
	
	if(num%receipt.onePageCount == 0){
		count = Math.floor(num / receipt.onePageCount);
	}else{
		count = Math.floor(num / receipt.onePageCount)+1;
	}
	
	var decorationPaymentReceipt = $("#decorationPaymentReceipt");
	
	for(var i=0;i<count;++i){
		
		var start = i*receipt.onePageCount;
		var first  = receipt.receipts[start];
		var No = utils.padLeft(first.paymentId,11);
		var supervisor = "";
		
		if(i != 0){
			var pageNext = $("#<div></div>").addClass("PageNext").appendTo(decorationPaymentReceipt);
		}
		
		if(receipt.order.supervisor != null){
			supervisor = receipt.order.supervisor;
		}
		
		var center = $("<center></center>").appendTo(decorationPaymentReceipt)
		
		var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
		var noTr = $('<tr></tr>').appendTo(noTable);
		var noTd = $('<td colspan="4"></td>').appendTo(noTr);
		var noDiv = $('<div id="no" style="text-align: right; padding-right: 150px;"></div>').text("NO: " + No).appendTo(noTd);
		
		var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
		var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
		var headReceiptTd = $('<td colspan="4"></td>').appendTo(headReceiptTr);
		var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
		var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(config.companyName + "专用收款收据").appendTo(headReceiptDiv);
		
		var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var noReceiptTd = $('<td style="width: 15%"></td>').text('订单编号: ' + receipt.order.orderId).appendTo(orderReceiptTr);
		var timeReceiptTd = $('<td style="width: 20%"></td>').text('合同编号: ' + receipt.order.contractCode).appendTo(orderReceiptTr);
		var customerReceiptTd = $('<td style="width: 35%"></td>').html('设 计 师: ' + receipt.order.designer + "-" + receipt.order.designDepartment).appendTo(orderReceiptTr);
		var designerReceiptTd = $('<td style="width: 30%"></td>').text('').appendTo(orderReceiptTr);
		
		
		var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var addrReceiptTd = $('<td colspan="2"></td>').text('客户地址: ' + receipt.order.village.villageName + receipt.order.houseNumber).appendTo(presonReceiptTr);
		var supervisorNameTd = $('<td style="width: 35%"></td>').text('收款日期: ' + first.collectTime).appendTo(presonReceiptTr);
		var designerReceiptTd = $('<td style="width: 30%"></td>').text('监 理: ' + supervisor).appendTo(presonReceiptTr);
		
		var sumMoney = 0;

		var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);
		var typeInfoPaymentTd = $('<td style="width: 20%; text-align: center;" rowspan="4"  colspan="2"></td>').html("<strong>收款信息</strong>").appendTo(recePaymentTr);
		var balancePaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
		var amountPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

		var receReceiptTrAdvanceMoney = $('<tr></tr>').appendTo(receiptTable);
		var advanceMoneyText = $('<td style="width: 17%; text-align: center;"></td>').html('预付款').appendTo(receReceiptTrAdvanceMoney);
		var advanecMoney= $('<td style="width: 15%; text-align: center;"></td>').html(receipt.payments[0].advanceMoney).appendTo(receReceiptTrAdvanceMoney);

		var receReceiptTrServiceMoney = $('<tr></tr>').appendTo(receiptTable);
		var serviceMoneyText = $('<td style="width: 18%; text-align: center;"></td>').html('服务费').appendTo(receReceiptTrServiceMoney);
		var serviceMoney= $('<td style="width: 15%; text-align: center;"></td>').html(receipt.payments[0].serviceMoney).appendTo(receReceiptTrServiceMoney);
		
		for(var i=0;i<receipt.payments.length;i++){
			
			var paymentInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			
			var paymentTypeReceiptTd = $('<td style="width: 30%; text-align: center;"></td>').text(receipt.payments[i].paymentType).appendTo(paymentInfoReceiptTr);
			var paymentMoneyReceiptTd = $('<td style="width: 30%; text-align: center;"></td>').text(receipt.payments[i].referMoney).appendTo(paymentInfoReceiptTr);
		}
		
		var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var typeInfoReceiptTd = $('<td style="width: 20%; text-align: center;" rowspan="' + (num+1) + '" colspan=2></td>').html("<strong>收据信息</strong>").appendTo(receReceiptTr);
		var balanceReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
		var amountReceiptTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

		for(;start<(i+1)*receipt.onePageCount&&start<num;++start){
			
			if(receipt.receipts[start].paymentWay.indexOf("预付款") == -1){
				sumMoney += receipt.receipts[start].money;
			}
			
			var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			
			var balanceInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.receipts[start].paymentWay).appendTo(receInfoReceiptTr);
			var amountInfoReceiptTd = $('<td style="width: 30%; text-align: center;"></td>').text(receipt.receipts[start].money).appendTo(receInfoReceiptTr);
		}
		
		var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var renReceiptTd = $('<td colspan="3"></td>').text('人民币大写: ' + utils.getCNMoney(sumMoney)).appendTo(moneyReceiptTr);
		var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + sumMoney).appendTo(moneyReceiptTr);
		
		var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);;
		var summaryReceiptTd = $('<td colspan="4"></td>').appendTo(summaryReceiptTr);
		var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
		var receReceiptSpan = $('<span></span>').text('收款人: ' + first.collectUser + "  ").appendTo(summaryReceiptDiv);
		var cashierReceiptSpan = $('<span></span>').text(' 交款人: ').appendTo(summaryReceiptDiv);
		
		var addrReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var collectDesTd = $('<td colspan="4"></td>').text('备注: ' + receipt.order.serviceReceiptDes).appendTo(addrReceiptTr);
	}
}

