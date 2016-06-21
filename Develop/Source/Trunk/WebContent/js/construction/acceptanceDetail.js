var acceptanceDetail = {
	
	ratyLength: 22,
	
	baseInfos: [
        "orderId", "customer", "orderAddr", "designer", "supervisName", "contractCode", 
        "waterwayQualityName", "circuitQualityName", "bricklayQualityName", "carpentQualityName", "oilQualityName",
        "waterwayWorkerName", "circuitWorkerName", "bricklayWorkerName", "carpentWorkerName", "oilWorkerName"
	], ratyIds: [
		"waterwayQuality", "waterwayServer", "waterwayHygiene", 
		"circuitQuality", "circuitServer", "circuitHygiene",
		"bricklayQuality", "bricklayServer", "bricklayHygiene",
		"carpentQuality", "carpentServer", "carpentHygiene",
		"oilQuality", "oilServer", "oilHygiene",
		"supervisQuality", "supervisServer", "supervisHygiene",
		"materialQuality", "materialServer",
		"multiple", "internal",
	], desIds: [
		"waterwayDes", "circuitDes", "bricklayDes", "carpentDes", "oilDes", "supervisDes", "materialDes", 
		"question", "propose", "acceptanceTime",
	],
	         
	options: {},
};

jQuery(function($) {
	
	com.post(api.construction.queryAcceptance, acceptancePostData, function(res){
		
		var acceptanceInfo = res.acceptance;
		
		acceptanceDetail.options["acceptance.actId"] = acceptanceInfo.actId;
		
		for(var i=0;i<acceptanceDetail.baseInfos.length;i++){
			infoName = acceptanceDetail.baseInfos[i]
			$("#"+infoName).val(acceptanceInfo[infoName]);
		}
		
		for(var i=1;i<=acceptanceDetail.ratyLength;i++){
			$('#raty' + i).raty({
				path: './assets/images/',
				number: 4,
				start: acceptanceInfo[acceptanceDetail.ratyIds[i-1]],
			});
		};
		
		for(var i=0;i<acceptanceDetail.desIds.length;i++){
			var desId = acceptanceDetail.desIds[i];
			if(acceptanceInfo[desId]){
				$("#"+desId).val(acceptanceInfo[desId]);
			}
		}
	});
	
	$("#saveBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		for(var i=1;i<=acceptanceDetail.ratyLength;i++){
			acceptanceDetail.options["acceptance." + acceptanceDetail.ratyIds[i-1]] = $("#raty" + i + "-score").attr("value");
		};
		
		for(var i=0;i<acceptanceDetail.desIds.length;i++){
			var desId = acceptanceDetail.desIds[i];
			if($("#"+desId).val()){
				acceptanceDetail.options["acceptance." + desId] = $("#"+desId).val();
			}else{
				acceptanceDetail.options["acceptance." + desId] = "";
			}
		}
		
		acceptanceDetail.options["acceptance.orderId"] = acceptancePostData["acceptance.orderId"];
		
		com.post(api.construction.updateAcceptance, acceptanceDetail.options, function(res){
			com.showAlert(com.info, "提交成功!");
		});
	});
	
	$('.date-picker').datepicker({autoclose:true});
	
	$("#backBtn").click(function(){
		com.switchPage(api.index.acceptanceIndex.url);
	});
	
});