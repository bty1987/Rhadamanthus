var receipt = {
	pageCount:5,
	tableList:[],
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


	var queryPaymentByPaymentId = api.payment.queryPaymentByPaymentId;

	var queryDecorationByCustomerId = api.decoration.queryDecorationByCustomerId;
	
	var orderInfo = null;
	var commonInfo = {};
	var paymentInfo = [];
	
	com.post(queryPaymentByPaymentId, {"payment.pid": params.paymentPaymentId}, function(res){

		var payment = res.payment;
		
		if(!payment.pid){
			return;
		}
		
		commonInfo["customerName"] = payment.customer.name;
		commonInfo["collectUserName"] = payment.collectUser.currentName;
		commonInfo["collectTime"] = payment.collectTime;
		
		orderInfo = res.payment.orders;


		var paymentItems = [];
		
		if(parseFloat(payment.cash) != 0){
			var tem = {
				"paymentType":payment.paymentType,
				"money":parseFloat(payment.cash),
				"paymentWay":"现金"
			};
			paymentItems.push(tem);
		}
		
		if(parseFloat(payment.bank) != 0){
			var tem = {
				"paymentType":payment.paymentType,
				"money":parseFloat(payment.bank),
				"paymentWay":"刷卡"
			};
			paymentItems.push(tem);
		}
		
		if(parseFloat(payment.checkv) != 0){
			var tem = {
				"paymentType":payment.paymentType,
				"money":parseFloat(payment.checkv),
				"paymentWay":"转账"
			};
			paymentItems.push(tem);
		}
		
		if(parseFloat(payment.accounts) != 0){
			var tem = {
				"paymentType":payment.paymentType,
				"money":parseFloat(payment.accounts),
				"paymentWay":"对公账户"
			};
			paymentItems.push(tem);
		}
		
		if(parseFloat(payment.installment) != 0){
			var tem = {
				"paymentType":payment.paymentType,
				"money":parseFloat(payment.installment),
				"paymentWay":"分期"
			};
			paymentItems.push(tem);
		}
		
		commonInfo["comment"] = payment.comment;
		
		var _items = [];
		
		for(var i=0;i<paymentItems.length;i++){
			
			if(_items.length >= 5){
				paymentInfo.push(_items);
				_items = [];
			}
			
			_items.push(paymentItems[i]);
		}
		
		if(_items.length != 0){
			paymentInfo.push(_items);
		}

		com.post(queryDecorationByCustomerId, {"decoration.customer.no":res.payment.customer.no}, function(data){
			createReceiptTable(commonInfo, paymentInfo, data.decorations);
		}, null, false);
	}, null, false);
});

function createReceiptTable(commonInfo, paymentInfo, orderInfo){
	
	for(var i=0;i<paymentInfo.length;i++){
		
		var center = $("<center></center>").appendTo("#paymentReceipt");
		
		if(i!=0){
			pageNext = $('<div class="PageNext"></div>');
			pageNext.appendTo(center);
		}
		
		var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
		var noTr = $('<tr></tr>').appendTo(noTable);
		var noTd = $('<td colspan="3"></td>').appendTo(noTr);
		var headReceiptDiv = $('<div style="text-align: center; background-color:#ffffff"></div>').appendTo(center);
		var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(parent.params.company.name + "专用收款收据").appendTo(headReceiptDiv);
		
		var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);

		var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var customerReceiptTd = $('<td style="width: 33%"></td>').text('客 户 名: ' + commonInfo["customerName"]).appendTo(presonReceiptTr);
		var timeReceiptTd = $('<td colspan="2"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(presonReceiptTr);

		for(var k=0;k<orderInfo.length;k++){
			
			var $order = orderInfo[k];

			var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			var noReceiptTd = $('<td style="width: 33%"></td>').text('订单编号: ' + $order.orderId).appendTo(orderReceiptTr);
			var timeReceiptTd = $('<td colspan="2" style="width: 33%"></td>').text('楼盘: ' + $order.house.village.name + ' ' + $order.house.houseNumber).appendTo(orderReceiptTr);
			var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			var designerNameTd = $('<td style="width: 33%"></td>').html('设计师:' + $order.designer.currentName + "-" + $order.designer.dept.deptName + " " + $order.designer.phone).appendTo(orderReceiptTr);
			var salesmanNameTd = $('<td style="width: 33%"></td>').html('').appendTo(orderReceiptTr);
			var supervisorNameTd = $('<td style="width: 33%"></td>').html('监理: ' + ($order.supervisor.currentName == null ? "" : $order.supervisor.currentName) + "-" + ($order.supervisor.phone == null ? "" : $order.supervisor.phone)).appendTo(orderReceiptTr);
		}
		
		var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var typeReceiptTd = $('<td style="width: 33%; text-align: center;"></td>').html('<strong>收款类型</strong>').appendTo(receReceiptTr);
		var amountReceiptTd = $('<td style="width: 33%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);
		var balanceReceiptTd = $('<td style="width: 33%; text-align: center;"></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
		
		var total = 0;
		
		for(var j=0;j<paymentInfo[i].length;j++){
			var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			var typeInfoReceiptTd = $('<td style="width: 33%; text-align: center;"></td>').text(paymentInfo[i][j]["paymentType"]).appendTo(receInfoReceiptTr);
			var amountInfoReceiptTd = $('<td style="width: 33%; text-align: center;"></td>').text(paymentInfo[i][j]["money"]).appendTo(receInfoReceiptTr);
			var balanceInfoReceiptTd = $('<td style="width: 33%; text-align: center;"></td>').text(paymentInfo[i][j]["paymentWay"]).appendTo(receInfoReceiptTr);
			
			if(paymentInfo[i][j]["paymentWay"].indexOf("预付款") == -1){
				total += parseFloat(paymentInfo[i][j]["money"]);
			}
		}
		
		var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var renReceiptTd = $('<td colspan="2"></td>').text('人民币大写: ' + utils.getCNMoney(total)).appendTo(moneyReceiptTr);
		var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + total).appendTo(moneyReceiptTr);
		
		var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);;
		var summaryReceiptTd = $('<td colspan="3"></td>').appendTo(summaryReceiptTr);
		var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
		var receReceiptSpan = $('<span></span>').text('收款人:' + commonInfo["collectUserName"]).appendTo(summaryReceiptDiv);
		var cashierReceiptSpan = $('<span></span>').text(' 交款人:').appendTo(summaryReceiptDiv);
		
		var desTr = $('<tr></tr>').appendTo(receiptTable);
		var desTd = $('<td colspan="3"></td>').text('备注: ' + commonInfo["comment"]).appendTo(desTr);

	}
}
