
jQuery(function($) {
	var receipt = {
		htmlName: "material",
		paymentTypeData: parent.constant.payment().materialPayment.paymentType.keys,
		advanceTypeData: parent.constant.payment().materialPayment.advanceType.keys,
		commonInfo: {},
		paymentItems: [],
		receiptItems: [],
		bankInfo: {},
		checkBankInfo: {},
		receiptsNum:0,
		receiptNo: "",
		organization: "",
		url: parent.api.index.materialPaymentReceiptIndex.url
	};

	api = parent.api;
	config = parent.config ;
	server = parent.server;
	utils = parent.utils;
	com = parent.com;
	printer = parent.printer;

	params = parent.params;

	var queryDecorationForCommonByOrderId = api.decoration.queryDecorationForCommonByOrderId;
	var queryMaterialPaymentForNotInitByMrId = api.payment.queryMaterialPaymentForNotInitByMrId;

	var atttype = null;

	com.post(queryDecorationForCommonByOrderId, {"decoration.orderId":params.payment.orderId}, function(res){
		var decorationOrder = res.decoration;
		var commonInfo = {};

		atttype = decorationOrder.typeness;

		commonInfo["orderId"] = decorationOrder.orderId;
		commonInfo["orderAddr"] = decorationOrder.house.village.cityProper.city.name + ' ' + decorationOrder.house.village.cityProper.name + ' ' + decorationOrder.house.village.name + " " + decorationOrder.house.houseNumber;
		commonInfo["customerName"] = decorationOrder.customer.name;
		commonInfo["salesmanName"] = decorationOrder.designer.currentName;
		commonInfo["supervisorName"] = decorationOrder.supervisor.currentName == null ? "" : decorationOrder.supervisor.currentName;
		commonInfo["supervisorPhone"] = decorationOrder.supervisor.phone == null ? "" : decorationOrder.supervisor.phone;
		commonInfo["departmentName"] = decorationOrder.designer.dept.name;

		commonInfo["total"] = 0.0;

		receipt.commonInfo = commonInfo;

		com.post(api.system.queryCompanyByCid, {
			"company.cid": res.decoration.bompany
		}, function(data) {

			receipt.organization = data.company.srganization.name;
		}, null, false);

	}, null, false);

	// 按装修单业务类型过滤收据类型(通用-1+对应typeness), 装修单同步查询先行
	com.post(api.data.queryReceiptType, {"receiptType.atttype": atttype}, function (res) {
		$.each(res.receiptTypes, function (i, v) {
			if (v.type == parent.constant.data().receiptType.TYPE_CARD_INT) {
				receipt.bankInfo[v.no] = v.name;
			} else if (v.type == parent.constant.data().receiptType.TYPE_BANK_INT) {
				receipt.checkBankInfo[v.no] = v.name;
			}
		});
	}, null, false);

	com.post(queryMaterialPaymentForNotInitByMrId, {"materialReceipt.mrId":params.payment.mrId}, function(res){
		var materialPayments = res.materialPayments;
		var materialBrand = "";
		var materialPaymentDes = "";
		
		for(var i=0;i<materialPayments.length;i++){
			var materialPayment = materialPayments[i];
			materialBrand = materialPayment.brand;

			receipt.commonInfo["collectUserName"] = materialPayment.collecter.currentName;
			receipt.commonInfo["collectTime"] = materialPayment.collectTime;
			
			receipt.paymentItems.push({"paymentType": receipt.paymentTypeData[materialPayment.paymentType], "money": materialPayment.referMoney, "materialBrand": materialBrand, "salesBrand": materialBrand});
		}

		if(materialPayment.comment && materialPayment.comment != ""){
			materialPaymentDes = materialPayment.comment
		}
		
		receipt.commonInfo["materialPaymentDes"] = materialPaymentDes;

	}, null ,false);
	
	var queryMaterialReceiptByMrId = api.payment.queryMaterialReceiptByMrId;

	com.post(queryMaterialReceiptByMrId, {"materialReceipt.mrId":params.payment.mrId}, function(res){
		var materialReceipt = res.materialReceipt;
		if(parseFloat(materialReceipt.cash) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.cash),
				"paymentWay":"现金"
			};
			receipt.receiptItems.push(tem);
			receipt.receiptsNum  =  receipt.receiptsNum +1;
			receipt.commonInfo.total += parseFloat(materialReceipt.cash);
		}
		
		if(parseFloat(materialReceipt.bank) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.bank),
				"paymentWay":"刷卡"
			};
			receipt.receiptItems.push(tem);
			receipt.receiptsNum  =  receipt.receiptsNum +1;
			receipt.commonInfo.total += parseFloat(materialReceipt.bank);
		}
		
		if(parseFloat(materialReceipt.checkv) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.checkv),
				"paymentWay":"银行"
			};
			receipt.receiptItems.push(tem);
			receipt.receiptsNum  =  receipt.receiptsNum +1;
			receipt.commonInfo.total += parseFloat(materialReceipt.checkv);
		}

		if(parseFloat(materialReceipt.coupon) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.coupon),
				"paymentWay":"优惠券"
			};
			receipt.receiptItems.push(tem);
			receipt.receiptsNum  =  receipt.receiptsNum +1;
		}
		
		if(parseFloat(materialReceipt.advance) != 0){
			var tem = {
				"money":parseFloat(materialReceipt.advance),
				"paymentWay":receipt.advanceTypeData[materialReceipt.advanceType] + " 预付款"
			};
			receipt.receiptItems.push(tem);
			receipt.receiptsNum  =  receipt.receiptsNum +1;
		}
		
	}, null, false);

	if(receipt.paymentItems.length > 0){
		createReceiptTable();

		printer.name = "payment";
		printer.args = {
			"title": receipt.organization +"专用收据",
			"orderId": receipt.commonInfo["orderId"],
			"orderAddr": receipt.commonInfo["orderAddr"],
			"collectTime": receipt.commonInfo["collectTime"],
			"collecter": receipt.commonInfo["collectUserName"],
			"referMoney": receipt.commonInfo.total,
			"capitalize": utils.getCNMoney(receipt.commonInfo.total),
			"payments": receipt.paymentItems,
			"receipts": receipt.receiptItems
		};
	}

	paymentUtils.initSignet(receipt.htmlName);
	paymentUtils.initQrcode(receipt.htmlName, receipt.htmlName+"paymentContractQrcodeModal");
	paymentUtils.bindSignet($("#" + receipt.htmlName + "signets"));
	paymentUtils.showContractBtn(params.payment.mrId, 2, printer.args, receipt.commonInfo.customerName, receipt);

	function createReceiptTable(){
		var commonInfo = receipt.commonInfo;
		var paymentItems = receipt.paymentItems;
		var receiptItems = receipt.receiptItems;
		var center = $("<center></center>").appendTo("#materialPaymentReceipt");

		var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
		var noTr = $('<tr></tr>').appendTo(noTable);
		var noTd = $('<td colspan="5"></td>').appendTo(noTr);
		var headReceiptDiv = $('<div style="text-align: center; background-color:#ffffff"></div>').appendTo(center);
		receipt.receiptNo = (Array(10).join(0)+params.payment.mrId).slice(-10);
		var spanNo = $('<span style="float: left;"></span>').html("编号:"+receipt.receiptNo).appendTo(headReceiptDiv);
		var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(receipt.organization + "代收款收据").appendTo(headReceiptDiv);

		var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);

		var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var noReceiptTd = $('<td style="width: 25%" colspan=2></td>').text('装修单号: ' + commonInfo["orderId"]).appendTo(orderReceiptTr);
		var addrReceiptTd = $('<td style="width: 40%" colspan="2"></td>').text('客户地址: ' + commonInfo["orderAddr"]).appendTo(orderReceiptTr);
		var timeReceiptTd = $('<td style="width: 35%" colspan="2"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(orderReceiptTr);

		var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);

		var balancePaymentTd = $('<td style="width: 10%; text-align: center;" rowspan=' + (paymentItems.length+1) + '></td>').html('<strong>收款信息</strong>').appendTo(recePaymentTr);
		var typePaymentTd = $('<td style="width: 15%; text-align: center;"></td>').html('<strong>品牌</strong>').appendTo(recePaymentTr);
		var typePaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
		var amountPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

		for(var j=0;j<paymentItems.length;j++){
			var paymentItem = paymentItems[j];

			var receInfoPaymentTr = $('<tr></tr>').appendTo(receiptTable);
			var typeInfoPaymentTd = $('<td style="width: 15%; text-align: center;"></td>').text(paymentItem["materialBrand"]).appendTo(receInfoPaymentTr);
			var typeInfoPaymentTd = $('<td style="width: 30%; text-align: center;" colspan="2"></td>').text(paymentItem["paymentType"]).appendTo(receInfoPaymentTr);
			var amountInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(paymentItem["money"]).appendTo(receInfoPaymentTr);
		}

		var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);

		var balanceReceiptTd = $('<td style="width: 25%; text-align: center;" rowspan=' + ( receipt.receiptsNum + 1) + ' colspan=2></td>').html('<strong>收据信息</strong>').appendTo(receReceiptTr);
		var typeReceiptTd = $('<td style="width: 40%; text-align: center;" colspan=2></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
		var amountReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

		var drawpaymentWay = "";
		for(var i=0;i<receiptItems.length;i++){
			var receiptItem = receiptItems[i];

			var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			var typeInfoPaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').text(receiptItem["paymentWay"]).appendTo(receInfoReceiptTr);
			var amountInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItem["money"]).appendTo(receInfoReceiptTr);
		}

		var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var renReceiptTd = $('<td colspan="4"></td>').text('人民币大写: ' + utils.getCNMoney(receipt.commonInfo.total)).appendTo(moneyReceiptTr);
		var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + receipt.commonInfo.total).appendTo(moneyReceiptTr);

		var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
		var summaryReceiptTd = $('<td colspan="5"></td>').appendTo(summaryReceiptTr);
		var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
		var receReceiptSpan = $('<span></span>').text('收款人:' + commonInfo["collectUserName"]).appendTo(summaryReceiptDiv);
		var cashierReceiptSpan = $('<span></span>').text(' 交款人:').appendTo(summaryReceiptDiv);
	}
});
