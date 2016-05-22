var printContract = {
};

jQuery(function($) {
	
	params.hostServer = window.hostServer;
	
	var orderId = "";
	var args = window.location.search.substr(1).split('&');
	
	for(var i=0;i<args.length;i++){
		if(args[i].indexOf("orderId") != -1){
			orderId = args[i].split('=')[1];
		}
	}
	
	com.post(api.decoration.generateDecorationContract, {"decorationContract.orderId": orderId}, function(res) {
		
		var decorationContract = res.decorationContract;
		
		if (decorationContract.autoId == null) {
			$(".WordSection1").html("");
			alert("没有填写合同信息");
			return;
		}
		
		if (decorationContract.quotationDetail == null) {
			$(".WordSection1").html("");
			alert("订单没有报价信息");
			return;
		}
		
		var quotationDetail = decorationContract.quotationDetail;
		
		if(parseFloat(quotationDetail.orderTotalPrice) == 0){
			$(".WordSection1").html("");
			alert("订单没有总价信息");
			return;
		}
		
		var payments = decorationContract.payments;
		
		var firstPayment = parseFloat(payments["首付款"]);
		var firstSecondPayment = payments["首付二期款"] ? parseFloat(payments["首付二期款"]) : 0;;
		var secondPayment = parseFloat(payments["二期款"]);
		var lastPayment = parseFloat(payments["尾款"]);
		
		var _orderTotalPrice = firstPayment + firstSecondPayment + secondPayment + lastPayment;
		
//		if(decorationContract.orderTotalPrice != quotationDetail.totalPrice){
//			$(".WordSection1").html("");
//			alert("合同总额不等于报价总额");
//			return;
//		}
		
//		if(decorationContract.orderTotalPrice != _orderTotalPrice){
//			$(".WordSection1").html("");
//			alert("合同总额不等于款项总额");
//			return;
//		}
		
		if(quotationDetail.houseType == '现房' && firstSecondPayment > 0 || quotationDetail.houseType == '期房' && firstSecondPayment == 0){
			$(".WordSection1").html("");
			alert("房屋类型和款项类型不匹配");
			return;
		}
		
		$(".WordSection1").css("display", "block");
		
		var orderTotalMoney = parseFloat(quotationDetail.orderTotalPrice);

		if (decorationContract.signTime != null && decorationContract.signTime != "") {
			var signSplit = decorationContract.signTime.split('-');

			$("#signYear").html(signSplit[0]);
			$("#signYear1").html(signSplit[0]);
			$("#signMonth").html(signSplit[1]);
			$("#signMonth1").html(signSplit[1]);
			$("#signDay").html(signSplit[2]);
			$("#signDay1").html(signSplit[2]);
		}

		if (decorationContract.startTime != null && decorationContract.startTime != "") {
			var startSplit = decorationContract.startTime.split('-');

			$("#startYear").html(startSplit[0]);
			$("#startMonth").html(startSplit[1]);
			$("#startDay").html(startSplit[2]);
		}

		if (decorationContract.endTime != null && decorationContract.endTime != "") {
			var endSplit = decorationContract.endTime.split('-');

			$("#endYear").html(endSplit[0]);
			$("#endMonth").html(endSplit[1]);
			$("#endDay").html(endSplit[2]);
		}

		$("#contractCode").html(decorationContract.contractCode);
		$("#contractCode1").html(decorationContract.contractCode);
		$("#workingDuration").html(decorationContract.workingDuration);
		
		if (decorationContract.additionalInfo == null || decorationContract.additionalInfo.trim() == "" || decorationContract.additionalInfo.trim() == "<br>") {
			$("#additionalInfo").html("&nbsp;无");
		} else {
			$("#additionalInfo").html(decorationContract.additionalInfo);
		}
		
		if (quotationDetail.houseType == '现房') {
			$("#threePayment").css("display", "block");
			$("#fourPayment").css("display", "none");

			$("#firstRate1").html(parseFloat(quotationDetail.firstRate) + parseFloat(quotationDetail.firstSecondRate));
			$("#secondRate1").html(quotationDetail.secondRate);
			$("#lastRate1").html(quotationDetail.lastRate);

			$("#firstPayment1").html(payments["首付款"]);
			$("#secondPayment1").html(payments["二期款"]);
			$("#lastPayment1").html(payments["尾款"]);
		} else {
			$("#threePayment").css("display", "none");
			$("#fourPayment").css("display", "block");
			
			$("#firstRate").html(quotationDetail.firstRate);
			$("#firstSecondRate").html(quotationDetail.firstSecondRate);
			$("#secondRate").html(	quotationDetail.secondRate);
			$("#lastRate").html(	quotationDetail.lastRate);

			$("#firstRate1").html(parseFloat(quotationDetail.firstRate) + parseFloat(quotationDetail.firstSecondRate));
			$("#secondRate1").html(quotationDetail.secondRate);
			$("#lastRate1").html(quotationDetail.lastRate);

			$("#firstPayment").html(payments["首付款"]);
			$("#firstSecondPayment").html(payments["首付二期款"]);
			$("#secondPayment").html(payments["二期款"]);
			$("#lastPayment").html(payments["尾款"]);

			$("#fourPayment").attr("style", "");
		}

		$("#orderTotalPrice").html(	quotationDetail.orderTotalPrice);

		var totalCN = utils.getCNMoney(quotationDetail.orderTotalPrice);
		$("#orderTotalPriceCN").html(totalCN);
		$("#disgner").html(quotationDetail.designer);
		$("#disgnerPhone").html(quotationDetail.designerPhone);
		$("#houseAddr").html(quotationDetail.village.cityProper.city.cityName + quotationDetail.village.cityProper.cityProperName + quotationDetail.village.villageName + quotationDetail.houseNumber);
		$("#houseArea").html(quotationDetail.houseArea);
		$("#freeArea").html(quotationDetail.freeArea);
		$("#totalArea").html(parseFloat(quotationDetail.houseArea) + parseFloat(quotationDetail.freeArea));
	});
});
