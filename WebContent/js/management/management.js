
jQuery(function($) {
	
	var management = {
		
		items: [],
			
		decorationTimeTypeMap: [{"key":"1", "value":"录入时间"}, {"key":"2", "value":"签单时间"}, {"key": 3, "value": "预签时间"}],
		decorationStatusMap: [],
		decorationPaymentTypeMap: [{"key":"首付款", "value":"首付款"}, {"key":"首付二期款", "value":"首付二期款"}, {"key":"二期款", "value":"二期款"}, {"key":"尾款", "value":"尾款"}, ],
		decorationPaymentRefundMap: [{"key":"设计费", "value":"设计费"}, {"key":"定金", "value":"定金"}, ],
		materialPaymentTypeMap: [{"key":"2", "value":"定金"}, {"key":"3", "value":"补款"},{"key":"4", "value":"退款"}, {"key":"5", "value":"补款退款"},{"key":"6", "value":"券退款"},],
	};
	
	management.items.oldOrderId = com.focusPage("#oldOrderId");
	management.items.newOrderId = com.focusPage("#newOrderId");
	
	management.items.orderIdForTime = com.focusPage("#orderIdForTime");
	management.items.orderDate = com.focusPage("#orderDate");
	management.items.orderTime = com.focusPage("#orderTime");
	
	management.items.orderIdForVersionId = com.focusPage("#orderIdForVersionId");
	management.items.versionId = com.focusPage("#versionId");
	
	management.items.orderIdOfDecorationGrade = com.focusPage("#orderIdOfDecorationGrade");
	
	management.items.orderIdForStatus = com.focusPage("#orderIdForStatus");
	
	management.items.orderIdPaymentForTime = com.focusPage("#orderIdPaymentForTime");
	management.items.orderPaymentDate = com.focusPage("#orderPaymentDate");
	management.items.orderPaymentTime = com.focusPage("#orderPaymentTime");
	
	management.items.refundOrderId = com.focusPage("#refundOrderId");
	
	management.items.msoNo = com.focusPage("#msoNo");
	management.items.orderIdForOrderId = com.focusPage("#orderIdForOrderId");
	
	management.items.msoNoForTime = com.focusPage("#msoNoForTime");
	management.items.materialPaymentDate = com.focusPage("#materialPaymentDate");
	management.items.materialPaymentTime = com.focusPage("#materialPaymentTime");
	
	management.items.orderIdForQuotationTime = com.focusPage("#orderIdForQuotationTime");
	
	management.items.quotationFunctionItemForManageRate = com.focusPage("#quotationFunctionItemForManageRate");
	management.items.quotationNames = com.focusPage("#quotationNames");
	management.items.manageRate = com.focusPage("#manageRate");
	
	management.items.dateRange = com.focusPage("#dateRange");
	
	management.items.contractTimeRange = com.focusPage("#contractTimeRange");

	management.items.paymentTimeRange = com.focusPage("#paymentTimeRange");

	management.items.quotationForOrderId = com.focusPage("#quotationForOrderId");
	management.items.quotationData = com.focusPage("#quotationData");
	management.items.quotationStatus = com.focusPage("#quotationStatus");
	
	management.items.changeSalesNo = com.focusPage("#changeSalesNo");

	management.decorationForOrderIdModal = com.focusPage("#decorationForOrderIdModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.decorationForTimeModal = com.focusPage("#decorationForTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.decorationForVersionIdModal = com.focusPage("#decorationForVersionIdModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.decorationForStatusModal = com.focusPage("#decorationForStatusModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.decorationPaymentForTimeModal = com.focusPage("#decorationPaymentForTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.refundOrderPaymentByOrderModal = com.focusPage("#refundOrderPaymentByOrderModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.MaterialForOrderIdModal = com.focusPage("#MaterialForOrderIdModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.materialPaymentForTimeModal = com.focusPage("#materialPaymentForTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.subDecorationForQuotationTimeModal = com.focusPage("#subDecorationForQuotationTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.updateQuotationFunctionItemForManageRateModal = com.focusPage("#updateQuotationFunctionItemForManageRateModal").on('show.bs.modal', function(e){
		management.items.quotationNames.bindData([], 'qid', 'quotationName');

		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.exportMaterialPaymentModal = com.focusPage("#exportMaterialPaymentModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.exportDecorationForContractTimeModal = com.focusPage("#exportDecorationForContractTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});

	management.exportDecorationPaymentForContractTimeModal = com.focusPage("#exportDecorationPaymentForContractTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});

	management.updateQuotationForStatusModal = com.focusPage("#updateQuotationForStatusModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.changeDecorationForGradeModal = com.focusPage("#changeDecorationForGradeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.changeSalesForGradeModal = com.focusPage("#changeSalesForGradeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	com.focusPage(".date-picker-date").datepicker({autoclose:true});
	com.focusPage(".maskInput").mask('99:99:99');
	com.focusPage('#dateRange').daterangepicker(com.dateramgepickerdefault);
	com.focusPage('#contractTimeRange').daterangepicker(com.dateramgepickerdefault);
	com.focusPage('#paymentTimeRange').daterangepicker(com.dateramgepickerdefault);
	com.focusPage(".daterangepicker").css("z-index", 1100);
	
	com.focusPage('#quotationFunctionItemForManageRate').on("blur", function(){
		
		var options = {
			"quotation.orderId": $(this).val(),
		}
		
		com.post(api.quotation.queryQuotationByOrderId, options, function(res){
			com.focusPage("#quotationNames").bindData(res.quotations, 'qid', 'quotationName');
		});
	});

	com.focusPage('#quotationForOrderId').on("blur", function(){

		var options = {
			"quotation.orderId": $(this).val(),
		}

		com.post(api.quotation.queryQuotationByOrderId, options, function(res){
			com.focusPage("#quotationData").bindData(res.quotations, 'qid', 'quotationName');
		});
	});
	
	com.focusPage("#changeDecorationForOrderId").click(function(){
		management.decorationForOrderIdModal.modal("show");
	});
	
	com.focusPage("#changeDecorationForGrade").click(function(){
		management.changeDecorationForGradeModal.modal("show");
	});
	
	com.focusPage("#changeDecorationForTime").click(function(){
		
		com.focusPage("#timeType").bindData(management.decorationTimeTypeMap, 'key', 'value');
		
		management.decorationForTimeModal.modal("show");
	});
	
	com.focusPage("#changeDecorationForVersionId").click(function(){
		
		com.post(api.quotation.queryQuotationVersion, {}, function(res){
			com.focusPage("#versionId").bindData(res.quotationVersions, 'no', 'name');
		});
		
		management.decorationForVersionIdModal.modal("show");
	});
	
	com.focusPage("#changeDecorationForStatus").click(function(){
		
		com.post(api.ds.decoration,{},function (res) {
			com.focusPage("#orderStatus").bindData(res.decorationOrderStatus, 'key', 'value');
		});
		
		management.decorationForStatusModal.modal("show");
	});
	
	com.focusPage("#changeDecorationPyamentForTime").click(function(){
		
		com.focusPage("#orderPaymentType").bindData(management.decorationPaymentTypeMap, 'key', 'value');
		
		management.decorationPaymentForTimeModal.modal("show");
	});
	
	// com.focusPage("#refundOrderForOrderId").click(function(){
	//
	// 	com.focusPage("#refundOrderPaymentType").bindData(management.decorationPaymentRefundMap, 'key', 'value');
	//
	// 	management.refundOrderPaymentByOrderModal.modal("show");
	// });
	
	com.focusPage("#changeMaterialForOrderId").click(function(){
		
		management.MaterialForOrderIdModal.modal("show");
	});
	
	com.focusPage("#changeMaterialPyamentForTime").click(function(){
		
		com.focusPage("#materialPaymentType").bindData(management.materialPaymentTypeMap, 'key', 'value');
		
		management.materialPaymentForTimeModal.modal("show");
	});
	
	com.focusPage("#subDecorationForQuotationTime").click(function(){
		
		management.subDecorationForQuotationTimeModal.modal("show");
	});
	
	com.focusPage("#updateQuotationFunctionItemForManageRate").click(function(){
		
		management.updateQuotationFunctionItemForManageRateModal.modal("show");
	});
	
	com.focusPage("#changeSalesForGrade").click(function(){
		
		management.changeSalesForGradeModal.modal("show");
	});
	
	com.focusPage("#exportMaterialPayment").click(function(){
		
		management.exportMaterialPaymentModal.modal("show");
	});
	
	com.focusPage("#exportDecorationForContractTime").click(function(){
		
		management.exportDecorationForContractTimeModal.modal("show");
	});

	com.focusPage("#exportDecorationPaymentForContractTime").click(function(){

		management.exportDecorationPaymentForContractTimeModal.modal("show");
	});

	com.focusPage("#updateQuotationForStatus").click(function(){

		management.updateQuotationForStatusModal.modal("show");
	});
	
	com.focusPage("#saveOrderIdBtn").click(function(){

		if(com.validate()){
			return;
		}

		var options = {
			"decoration.orderId": com.focusPage("#oldOrderId").val(),
			"decorationId": com.focusPage("#newOrderId").val(),
		};

		com.post(api.decoration.changeDecorationForOrderId, options, function(res){
			com.showAlert(com.info, "操作成功");
		});

		management.decorationForOrderIdModal.modal("hide");
	});
	
	com.focusPage("#saveOrderDateBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decoration.orderId": com.focusPage("#orderIdForTime").val(),
			"timeType": com.focusPage("#timeType").val(),
			"dateTime": com.focusPage("#orderDate").val() + " " + com.focusPage("#orderTime").val(),
		};
		
		com.post(api.decoration.changeDecorationForTime, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationForTimeModal.modal("hide");
	});
	
	com.focusPage("#saveVersionIdBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decoration.orderId": com.focusPage("#orderIdForVersionId").val(),
			"decoration.version.no": com.focusPage("#versionId").val(),
		};
		
		com.post(api.decoration.changeDecorationForVersionId, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationForVersionIdModal.modal("hide");
	});
	
	com.focusPage("#saveOrderPaymentDateBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationPayment.decoration.orderId": com.focusPage("#orderIdPaymentForTime").val(),
			"decorationPayment.paymentType": com.focusPage("#orderPaymentType").val(),
			"dateTime": com.focusPage("#orderPaymentDate").val() + " " + com.focusPage("#orderPaymentTime").val(),
		};
		
		com.post(api.common.changeDecorationPaymentForTime, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationPaymentForTimeModal.modal("hide");
	});
	
	com.focusPage("#refundOrderPaymentBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationPayment.decortion.orderId": com.focusPage("#refundOrderId").val(),
			"decorationPayment.paymentType": com.focusPage("#refundOrderPaymentType").val(),
		};
		
		com.post(api.payment.refundDecorationPayment, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.refundOrderPaymentByOrderModal.modal("hide");
	});
	
	com.focusPage("#saveMaterialOrderIdBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"material.no": com.focusPage("#msoNo").val(),
			"material.orderId": com.focusPage("#orderIdForOrderId").val(),
		};
		
		com.post(api.common.changeMaterialForOrderId, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.MaterialForOrderIdModal.modal("hide");
	});
	
	com.focusPage("#changeDecorationGradeBtn").click(function(){
		
		if(com.validate("orderIdOfDecorationGrade")){
			return;
		}
		
		var options = {
			"decoration.orderId": com.focusPage("#orderIdOfDecorationGrade").val(),
			"decoration.grade": com.focusPage("#decorationGrade").val()
		}
		
		var decoration = null;
		
		com.post(api.decoration.queryDecorationForCommonByOrderId, options, function(res){
			decoration = res.decoration;
		}, null, false);
		
		if(decoration != null){
			
			options["decoration.houseType"] = decoration.houseType;
			options["decoration.houseClass"] = decoration.houseClass;
			options["decoration.type"] = decoration.type;
			
			com.post(api.decoration.changeDecorationForAdvance, options, function(res){
				com.showAlert(com.info, "操作成功");
			}, null, false);
		}else{
			com.showAlert(com.warning, "装修单不存在");
		}
		
		management.changeDecorationForGradeModal.modal("hide");
	});
	
	com.focusPage("#saveStatusBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decoration.orderId": com.focusPage("#orderIdForStatus").val(),
			"decoration.status": com.focusPage("#orderStatus").val(),
		};
		
		com.post(api.decoration.changeDecorationForStatus, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationForStatusModal.modal("hide");
	});
	
	com.focusPage("#saveMaterialPaymentDateBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"materialPayment.material.no": com.focusPage("#msoNoForTime").val(),
			"materialPayment.paymentType": com.focusPage("#materialPaymentType").val(),
			"dateTime": com.focusPage("#materialPaymentDate").val() + " " + com.focusPage("#materialPaymentTime").val(),
		};
		
		com.post(api.common.changeMaterialPaymentForTime, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.materialPaymentForTimeModal.modal("hide");
	});
	
	com.focusPage("#saveDecorationForQuotationTimeBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decoration.orderId": com.focusPage("#orderIdForQuotationTime").val(),
		};
		
		com.post(api.decoration.subDecorationForQuotationTime, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.subDecorationForQuotationTimeModal.modal("hide");
	});
	
	com.focusPage("#saveQuotationFunctionItemForManageRateBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"quotation.qid": management.items.quotationNames.val(),
			"quotationFunctionAreaItem.type": 3,
			"quotationFunctionAreaItem.unitPrice": management.items.manageRate.val(),
		};
		
		com.post(api.common.updateQuotationFunctionAreaItemByQuotationIdAType, options, function(res){
			com.showAlert(com.info, "操作成功");
		});

		management.updateQuotationFunctionItemForManageRateModal.modal("hide");
	});

	com.focusPage("#saveQuotationStatusBtn").click(function(){
		if(com.validate()){
			return;
		}

		var options = {
			"quotation.qid": management.items.quotationData.val(),
			"quotation.status":management.items.quotationStatus.val(),
		};

		com.post(api.quotation.updateQuotationForStatus, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		management.items.quotationData.html("");
		management.updateQuotationForStatusModal.modal("hide");

	});
	
	com.focusPage("#changeSalesGradeBtn").click(function(){
		
		if(com.validate("changeSalesNo")){
			return;
		}
		
		var options = {
			"sales.no": com.focusPage("#changeSalesNo").val(),
			"sales.grade": com.focusPage("#salesGrade").val()
		}
		
		var sales = null;
		
		com.post(api.inventory.querySalesByNo, options, function(res){
			sales = res.sales;
		}, null, false);
		
		if(sales != null){
			
			options["sales.sid"] = sales.sid;
			
			com.post(api.inventory.updateSales, options, function(res){
				com.showAlert(com.info, "操作成功");
			}, null, false);
		}else{
			com.showAlert(com.warning, "销售单不存在");
		}
		
		management.changeSalesForGradeModal.modal("hide");
	});
	
	com.focusPage("#exportMaterialPaymentBtn").click(function(){
		if(com.validate()){
			return;
		}
		
		var url = api.common.exportMaterialPayment.url + "?filters[0].data=" + com.focusPage("#dateRange").val() + "&filters[0].field=collectTime&filters[0].op=between&filters[1].field=paymentStatus&filters[1].data=0&filters[1].op=ne";
		
		window.open(decodeURI(url));
	});
	
	com.focusPage("#exportDecorationForContractTimeBtn").click(function(){
		if(com.validate()){
			return;
		}
		
		var url = api.decoration.exportDecorationByContractTime.url + "?filters[0].data=" + com.focusPage("#contractTimeRange").val() + "&filters[0].field=signTimeDateRange&filters[0].op=between&filters[1].field=status&filters[1].data=已签约&filters[1].op=eq";
		
		window.open(decodeURI(url));
	});

	com.focusPage("#exportDecorationPaymentForContractTimeBtn").click(function(){
		if(com.validate()){
			return;
		}

		var url = api.payment.exportDecorationPayment.url + "?filters[0].data=" + com.focusPage("#paymentTimeRange").val() + "&filters[0].field=collectTime&filters[0].op=between";

		window.open(decodeURI(url));
	});
	
	com.focusPage("#updateFR").bindClick(function(){
		
		if(params.userInfo.user.userId != 'FL-06189'){
			com.showAlert(com.error, "无操作权限");
			
			return false;
		}

		com.post({url: "HASIPHXW.do", server: "communion"}, {});
	});
});
