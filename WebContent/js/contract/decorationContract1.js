jQuery(function($) {

	var params = {};
	api = parent.api;
	config = parent.config ;
	server = parent.server;
	utils = parent.utils;
	com = parent.com;
	
	params.server = window.server;
	params.authentication = parent.params.authentication;
	
	$('.companyFullName').text(parent.params.company.fullname);
	$('.companyAddr').text(parent.params.company.address);
	$('.legalPerson').text(parent.params.company.corporation);
	params = parent.params;

	var orderId = params.orderId;

	var decoration;
	var decorationContract;
	
	com.post(api.decoration.generateDecorationContract, {"decorationContract.orderId": orderId}, function(res) {
		decorationContract = res.decorationContract;
	}, null, false);
	
	com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": orderId}, function(res){
		decoration = res.decoration;
	}, null, false);
	
	if (decorationContract.autoId == null) {
		$(".WordSection1").html("");
		alert("没有填写合同信息");
		return;
	}
	
	var quotationDetail = decorationContract.quotationDetail;
	
	if(parseFloat(decoration.orderTotalPrice) == 0){
		$(".WordSection1").html("");
		alert("订单没有总价信息");
		return;
	}

	var payments = decorationContract.payments;
	var payFlag = false;
	var baseStatus = ["未付款", "已付款", "已确认", "申请审批"];
	var typeCounts = 0;

	$.each(payments,function (i,v) {
		if(baseStatus.indexOf(v.paymentStatus) !=-1){
			payFlag = true;
		}
		typeCounts += 1;
		switch (v.sort){
			case 1:
				$("#firstPayment").text(v.referMoney);
				$("#firstPayment1").text(v.referMoney);
				break;
			case 2:
				$("#firstSecondPayment").text(v.referMoney);
				$("#secondPayment1").text(v.referMoney);
				break;
			case 3:
				$("#secondPayment").text(v.referMoney);
				$("#lastPayment1").text(v.referMoney);
				break;
			case 4:
				$("#lastPayment").text(v.referMoney);
				break;
		}

	});

	if(!payFlag){
		$(".WordSection1").html("");
		alert("无款项交付");
		return;
	}
	
	$(".WordSection1").css("display", "block");
	
	var orderTotalMoney = parseFloat(decoration.orderTotalPrice);

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

	if (typeCounts == 3) {
		$("#threePayment").css("display", "block");
		$("#fourPayment").css("display", "none");
	} else if (typeCounts == 4){
		$("#threePayment").css("display", "none");
		$("#fourPayment").css("display", "block");
		$("#fourPayment").attr("style", "");
	} else {
		$(".WordSection1").html("");
		alert("款项数量有误!");
	}

	$("#orderTotalPrice").html(	decoration.orderTotalPrice);

	var totalCN = utils.getCNMoney(decoration.orderTotalPrice);
	$("#orderTotalPriceCN").html(totalCN);
	$("#disgner").html(decoration.designer);
	$("#disgnerPhone").html(decoration.designerPhone);
	$("#houseAddr").html(decoration.house.village.cityProper.name + decoration.house.village.name + decoration.house.houseNumber);
	$("#houseArea").html(decoration.houseArea);
	$("#freeArea").html(decoration.freeArea);
	$("#totalArea").html(parseFloat(decoration.houseArea) + parseFloat(decoration.freeArea));
	
});
