var management = {
		
	items: [],
		
	decorationOrderTimeTypeMap: [{"key":"1", "value":"录入时间"}, {"key":"2", "value":"签单时间"}, ],
	decorationOrderStatusMap: [{"key":"咨询", "value":"咨询"}, {"key":"量房", "value":"量房"}, {"key":"已报价", "value":"已报价"}, {"key":"定金", "value":"定金"}, {"key":"已签约", "value":"已签约"}, {"key":"废单", "value":"废单"}, {"key":"已完工", "value":"已完工"}, {"key":"合同终止", "value":"合同终止"}, ],
	decorationPaymentTypeMap: [{"key":"首付款", "value":"首付款"}, {"key":"首付二期款", "value":"首付二期款"}, {"key":"二期款", "value":"二期款"}, {"key":"尾款", "value":"尾款"}, ],
	decorationPaymentRefundMap: [{"key":"设计费", "value":"设计费"}, {"key":"定金", "value":"定金"}, ],
	materialPaymentTypeMap: [{"key":"2", "value":"定金"}, {"key":"3", "value":"补款"},{"key":"4", "value":"退款"}, {"key":"5", "value":"补款退款"},{"key":"6", "value":"券退款"},],
};

jQuery(function($) {
	
	management.items.oldOrderId = $("#oldOrderId");
	management.items.newOrderId = $("#newOrderId");
	
	management.items.orderIdForTime = $("#orderIdForTime");
	management.items.orderDate = $("#orderDate");
	management.items.orderTime = $("#orderTime");
	
	management.items.orderIdForVersionId = $("#orderIdForVersionId");
	management.items.versionId = $("#versionId");
	
	management.items.orderIdForStatus = $("#orderIdForStatus");
	
	management.items.orderIdPaymentForTime = $("#orderIdPaymentForTime");
	management.items.orderPaymentDate = $("#orderPaymentDate");
	management.items.orderPaymentTime = $("#orderPaymentTime");
	
	management.items.refundOrderId = $("#refundOrderId");
	
	management.items.msoNo = $("#msoNo");
	management.items.orderIdForOrderId = $("#orderIdForOrderId");
	
	management.items.msoNoForTime = $("#msoNoForTime");
	management.items.materialPaymentDate = $("#materialPaymentDate");
	management.items.materialPaymentTime = $("#materialPaymentTime");
	
	management.items.orderIdForQuotationTime = $("#orderIdForQuotationTime");
	
	management.items.quotationFunctionItemForManageRate = $("#quotationFunctionItemForManageRate");
	management.items.quotationNames = $("#quotationNames");
	management.items.manageRate = $("#manageRate");
	
	management.items.dateRange = $("#dateRange");
	
	management.items.contractTimeRange = $("#contractTimeRange");

	management.items.paymentTimeRange = $("#paymentTimeRange");

	management.decorationOrderForOrderIdModal = $("#decorationOrderForOrderIdModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.decorationOrderForTimeModal = $("#decorationOrderForTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.decorationOrderForVersionIdModal = $("#decorationOrderForVersionIdModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.decorationOrderForStatusModal = $("#decorationOrderForStatusModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.decorationPaymentForTimeModal = $("#decorationPaymentForTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.refundOrderPaymentByOrderModal = $("#refundOrderPaymentByOrderModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.materialSubOrderForOrderIdModal = $("#materialSubOrderForOrderIdModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.materialPaymentForTimeModal = $("#materialPaymentForTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.subDecorationOrderForQuotationTimeModal = $("#subDecorationOrderForQuotationTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.updateQuotationFunctionItemForManageRateModal = $("#updateQuotationFunctionItemForManageRateModal").on('show.bs.modal', function(e){
		management.items.quotationNames.bindData([], 'qid', 'quotationName');
		
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.exportMaterialPaymentModal = $("#exportMaterialPaymentModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	management.exportDecorationOrderForContractTimeModal = $("#exportDecorationOrderForContractTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});

	management.exportDecorationPaymentForContractTimeModal = $("#exportDecorationPaymentForContractTimeModal").on('show.bs.modal', function(e){
		com.cleanItems(management.items);
		com.clearValidator();
	});
	
	$(".date-picker-date").datepicker({autoclose:true});
	$(".maskInput").mask('99:99:99');
	$('#dateRange').daterangepicker(com.dateramgepickerdefault);
	$('#contractTimeRange').daterangepicker(com.dateramgepickerdefault);
	$('#paymentTimeRange').daterangepicker(com.dateramgepickerdefault);
	$(".daterangepicker").css("z-index", 1100);
	
	$('#quotationFunctionItemForManageRate').on("blur", function(){
		
		var options = {
			"quotation.orderId": $(this).val(),
		}
		
		com.post(api.quotation.queryQuotationByOrderId, options, function(res){
			$("#quotationNames").bindData(res.quotations, 'qid', 'quotationName');
		});
	});
	
	$("#changeDecorationOrderForOrderId").click(function(){
		management.decorationOrderForOrderIdModal.modal("show");
	});
	
	$("#changeDecorationOrderForTime").click(function(){
		
		$("#timeType").bindData(management.decorationOrderTimeTypeMap, 'key', 'value');
		
		management.decorationOrderForTimeModal.modal("show");
	});
	
	$("#changeDecorationOrderForVersionId").click(function(){
		
		com.post(api.quotation.queryQuotationVersion, {}, function(res){
			$("#versionId").bindData(res.quotationVersions, 'versionId', 'versionId');
		});
		
		management.decorationOrderForVersionIdModal.modal("show");
	});
	
	$("#changeDecorationOrderForStatus").click(function(){
		
		$("#orderStatus").bindData(management.decorationOrderStatusMap, 'key', 'value');
		
		management.decorationOrderForStatusModal.modal("show");
	});
	
	$("#changeDecorationPyamentForTime").click(function(){
		
		$("#orderPaymentType").bindData(management.decorationPaymentTypeMap, 'key', 'value');
		
		management.decorationPaymentForTimeModal.modal("show");
	});
	
	$("#refundOrderForOrderId").click(function(){
		
		$("#refundOrderPaymentType").bindData(management.decorationPaymentRefundMap, 'key', 'value');
		
		management.refundOrderPaymentByOrderModal.modal("show");
	});
	
	$("#changeMaterialSubOrderForOrderId").click(function(){
		
		management.materialSubOrderForOrderIdModal.modal("show");
	});
	
	$("#changeMaterialPyamentForTime").click(function(){
		
		$("#materialPaymentType").bindData(management.materialPaymentTypeMap, 'key', 'value');
		
		management.materialPaymentForTimeModal.modal("show");
	});
	
	$("#subDecorationOrderForQuotationTime").click(function(){
		
		management.subDecorationOrderForQuotationTimeModal.modal("show");
	});
	
	$("#updateQuotationFunctionItemForManageRate").click(function(){
		
		management.updateQuotationFunctionItemForManageRateModal.modal("show");
	});
	
	$("#exportMaterialPayment").click(function(){
		
		management.exportMaterialPaymentModal.modal("show");
	});
	
	$("#exportDecorationOrderForContractTime").click(function(){
		
		management.exportDecorationOrderForContractTimeModal.modal("show");
	});

	$("#exportDecorationPaymentForContractTime").click(function(){

		management.exportDecorationPaymentForContractTimeModal.modal("show");
	});
	
	$("#saveOrderIdBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationOrder.orderId": $("#oldOrderId").val(),
			"decorationOrderId": $("#newOrderId").val(),
		};
		
		com.post(api.common.changeDecorationOrderForOrderId, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationOrderForOrderIdModal.modal("hide");
	});
	
	$("#saveOrderDateBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationOrder.orderId": $("#orderIdForTime").val(),
			"timeType": $("#timeType").val(),
			"dateTime": $("#orderDate").val() + " " + $("#orderTime").val(),
		};
		
		com.post(api.common.changeDecorationOrderForTime, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationOrderForTimeModal.modal("hide");
	});
	
	$("#saveVersionIdBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationOrder.orderId": $("#orderIdForVersionId").val(),
			"decorationOrder.versionId": $("#versionId").val(),
		};
		
		com.post(api.common.changeDecorationOrderForVersionId, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationOrderForVersionIdModal.modal("hide");
	});
	
	$("#saveOrderPaymentDateBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationPayment.orderId": $("#orderIdPaymentForTime").val(),
			"decorationPayment.paymentType": $("#orderPaymentType").val(),
			"dateTime": $("#orderPaymentDate").val() + " " + $("#orderPaymentTime").val(),
		};
		
		com.post(api.common.changeDecorationPaymentForTime, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationPaymentForTimeModal.modal("hide");
	});
	
	$("#refundOrderPaymentBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationPayment.orderId": $("#refundOrderId").val(),
			"decorationPayment.paymentType": $("#refundOrderPaymentType").val(),
		};
		
		com.post(api.common.refundDecorationPaymentForManage, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.refundOrderPaymentByOrderModal.modal("hide");
	});
	
	$("#saveMaterialSubOrderOrderIdBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"materialSubOrder.msoNo": $("#msoNo").val(),
			"materialSubOrder.orderId": $("#orderIdForOrderId").val(),
		};
		
		com.post(api.common.changeMaterialSubOrderForOrderId, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.materialSubOrderForOrderIdModal.modal("hide");
	});
	
	$("#saveStatusBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationOrder.orderId": $("#orderIdForStatus").val(),
			"decorationOrder.status": $("#orderStatus").val(),
		};
		
		com.post(api.common.changeDecorationOrderForStatus, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.decorationOrderForStatusModal.modal("hide");
	});
	
	$("#saveMaterialPaymentDateBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"materialPayment.msoNo": $("#msoNoForTime").val(),
			"materialPayment.paymentType": $("#materialPaymentType").val(),
			"dateTime": $("#materialPaymentDate").val() + " " + $("#materialPaymentTime").val(),
		};
		
		com.post(api.common.changeMaterialPaymentForTime, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.materialPaymentForTimeModal.modal("hide");
	});
	
	$("#saveDecorationOrderForQuotationTimeBtn").click(function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationOrder.orderId": $("#orderIdForQuotationTime").val(),
		};
		
		com.post(api.common.subDecorationOrderForQuotationTime, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		management.subDecorationOrderForQuotationTimeModal.modal("hide");
	});
	
	$("#saveQuotationFunctionItemForManageRateBtn").click(function(){
		
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
	
	$("#exportMaterialPaymentBtn").click(function(){
		if(com.validate()){
			return;
		}
		
		var url = api.common.exportMaterialPayment.url + "?filters[0].data=" + $("#dateRange").val() + "&filters[0].field=collectTime&filters[0].op=between&filters[1].field=paymentStatus&filters[1].data=0&filters[1].op=ne";
		
		window.open(decodeURI(url));
	});
	
	$("#exportDecorationOrderForContractTimeBtn").click(function(){
		if(com.validate()){
			return;
		}
		
		var url = api.decoration.exportDecorationorderByContractTime.url + "?filters[0].data=" + $("#contractTimeRange").val() + "&filters[0].field=signTimeDateRange&filters[0].op=between&filters[1].field=status&filters[1].data=已签约&filters[1].op=eq";
		
		window.open(decodeURI(url));
	});

	$("#exportDecorationPaymentForContractTimeBtn").click(function(){
		if(com.validate()){
			return;
		}

		var url = api.payment.exportDecorationPayment.url + "?filters[0].data=" + $("#paymentTimeRange").val() + "&filters[0].field=collectTime&filters[0].op=between";

		window.open(decodeURI(url));
	});
});
