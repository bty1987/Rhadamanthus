var printContract = {
};

jQuery(function($) {
	
	params.server = window.server;
	params.authentication = window.authentication;
	
	$('.companyFullName').text(config.companyFullName);
	
	var orderId = "";
	var args = window.location.search.substr(1).split('&');
	
	$.each(args, function(i, v){
		if(v.indexOf('time=') != -1){
			params.loginTime = v.substring(v.indexOf('time=')).split('=')[1];
		}else if(v.indexOf("decorationContract.orderId") != -1){
			orderId = args[i].split('=')[1];
		}
	});
	
	com.post(api.decoration.generateDecorationContract, {"decorationContract.orderId": orderId}, function(res) {
		if (res.decorationContract == null) {
			$(".WordSection1").html("");
			alert("还没有填写合同信息");
			return;
		}
		
		if (res.decorationContract.quotationDetail == null) {
			$(".WordSection1").html("");
			alert("当前订单没有报价信息");
			return;
		}
		
		if(parseFloat(res.decorationContract.quotationDetail.orderTotalPrice) == 0){
			$(".WordSection1").html("");
			alert("当前订单没有总价信息");
			return;
		}
		
		$(".WordSection1").css("display", "block");
		
		var orderTotalMoney = parseFloat(res.decorationContract.quotationDetail.orderTotalPrice);
		var tem = orderTotalMoney - parseFloat(res.decorationContract.quotationDetail.totalPrice);

		if (res.decorationContract.signTime != null && res.decorationContract.signTime != "") {
			var signSplit = res.decorationContract.signTime.split('-');

			$("#signYear").html(signSplit[0]);
			$("#signYear1").html(signSplit[0]);
			$("#signMonth").html(signSplit[1]);
			$("#signMonth1").html(signSplit[1]);
			$("#signDay").html(signSplit[2]);
			$("#signDay1").html(signSplit[2]);
		}

		if (res.decorationContract.startTime != null && res.decorationContract.startTime != "") {
			var startSplit = res.decorationContract.startTime.split('-');

			$("#startYear").html(startSplit[0]);
			$("#startMonth").html(startSplit[1]);
			$("#startDay").html(startSplit[2]);
		}

		if (res.decorationContract.endTime != null && res.decorationContract.endTime != "") {
			var endSplit = res.decorationContract.endTime.split('-');

			$("#endYear").html(endSplit[0]);
			$("#endMonth").html(endSplit[1]);
			$("#endDay").html(endSplit[2]);
		}

		$("#contractCode").html(res.decorationContract.contractCode);
		$("#contractCode1").html(res.decorationContract.contractCode);
		$("#workingDuration").html(res.decorationContract.workingDuration);
		if (res.decorationContract.additionalInfo == null || res.decorationContract.additionalInfo.trim() == "" || res.decorationContract.additionalInfo.trim() == "<br>") {
			$("#additionalInfo").html("&nbsp;无");
		} else {
			$("#additionalInfo").html(res.decorationContract.additionalInfo);
		}

		if (res.decorationContract.quotationDetail.houseType == '现房') {
			$("#fourPayment").attr("style", "display: none;");
			$("#threePayment").attr("style", "");

			$("#firstRate1").html(parseFloat(res.decorationContract.quotationDetail.firstRate) + parseFloat(res.decorationContract.quotationDetail.firstSecondRate));
			$("#secondRate1").html(res.decorationContract.quotationDetail.secondRate);
			$("#lastRate1").html(res.decorationContract.quotationDetail.lastRate);
			var firstPayment = Math.ceil((orderTotalMoney * ((parseFloat(res.decorationContract.quotationDetail.firstRate) + parseFloat(res.decorationContract.quotationDetail.firstSecondRate)) / 100)) / 100) * 100;
			var secondPayment = Math.ceil((orderTotalMoney * ((parseFloat(res.decorationContract.quotationDetail.secondRate)) / 100)) / 100) * 100;
			var lastPayment = Math.round(orderTotalMoney - firstPayment - secondPayment);

			$("#firstPayment1").html(firstPayment);
			$("#secondPayment1").html(secondPayment);
			$("#lastPayment1").html(lastPayment);
		} else {
			$("#threePayment").attr("style", "display: none;");
			$("#firstRate").html(res.decorationContract.quotationDetail.firstRate);
			$("#firstSecondRate").html(res.decorationContract.quotationDetail.firstSecondRate);
			$("#secondRate").html(	res.decorationContract.quotationDetail.secondRate);
			$("#lastRate").html(	res.decorationContract.quotationDetail.lastRate);

			$("#firstRate1").html(parseFloat(res.decorationContract.quotationDetail.firstRate) + parseFloat(res.decorationContract.quotationDetail.firstSecondRate));
			$("#secondRate1").html(res.decorationContract.quotationDetail.secondRate);
			$("#lastRate1").html(res.decorationContract.quotationDetail.lastRate);
			var firstPayment = Math.ceil((orderTotalMoney * ((parseFloat(res.decorationContract.quotationDetail.firstRate)) / 100)) / 100) * 100;
			var firstSecondPayment = Math.ceil((orderTotalMoney * ((parseFloat(res.decorationContract.quotationDetail.firstSecondRate)) / 100)) / 100) * 100;
			var secondPayment = Math.ceil((orderTotalMoney * ((parseFloat(res.decorationContract.quotationDetail.secondRate)) / 100)) / 100) * 100;
			var lastPayment = Math.round(orderTotalMoney - firstPayment - secondPayment - firstSecondPayment);

			$("#firstPayment").html(firstPayment);
			$("#firstSecondPayment").html(firstSecondPayment);
			$("#secondPayment").html(secondPayment);
			$("#lastPayment").html(lastPayment);

			$("#fourPayment").attr("style", "");
		}

		$("#orderTotalPrice").html(	res.decorationContract.quotationDetail.orderTotalPrice);

		var totalCN = utils.getCNMoney(res.decorationContract.quotationDetail.orderTotalPrice);
		
		$("#orderTotalPriceCN").html(totalCN);
		$("#disgner").html(res.decorationContract.quotationDetail.designer);
		$("#disgnerPhone").html(res.decorationContract.quotationDetail.designerPhone);
		$("#houseAddr").html(res.decorationContract.quotationDetail.village.cityProper.city.cityName
								+ res.decorationContract.quotationDetail.village.cityProper.cityProperName
								+ res.decorationContract.quotationDetail.village.villageName
								+ res.decorationContract.quotationDetail.houseNumber);
		$("#houseArea").html(res.decorationContract.quotationDetail.houseArea);
		$("#freeArea").html(res.decorationContract.quotationDetail.freeArea);
		$("#totalArea").html(parseFloat(res.decorationContract.quotationDetail.houseArea) + parseFloat(res.decorationContract.quotationDetail.freeArea));

	});

});


