
var decorationOrderDetail = {
	decorationOrderId:null,
	orderType:"",

	type:{
		"半包":0,
		"全包":1,
		"半价":2,
	},

	decorationOrder: {},
	customer:{},
	village:{},
	
	quotationDetail:{},
	
	btnSaveBaseDecorationOrderInfo:null,
	
	validator: {
		houseNumber: {
			type: "v_houseNumber", 
			regex: /^D_\d{3}$/g,
			errorMsg: "楼盘名称规则"
		}
	},
	
	items: {},
	
	vRepeatFlg: false,
	cRepeatFlg: false
};

jQuery(function($) {
	
	var decorationPayment = {
		postParam:{},
		
		items:{},
		
		editFlag:0,
	};

	decorationOrderDetail.items.orderId = $("#orderId");
	decorationOrderDetail.items.customer = $("#customer");
	decorationOrderDetail.items.houseAddr = $("#houseAddr");
	decorationOrderDetail.items.designer = $("#designer");
	decorationOrderDetail.items.salesman = $("#salesman");
	decorationOrderDetail.items.designDepartment = $("#designDepartment");
	decorationOrderDetail.items.businessDepartment = $("#businessDepartment");
	
	decorationOrderDetail.items.houseArea = $("#houseArea");
	decorationOrderDetail.items.freeArea = $("#freeArea");
	decorationOrderDetail.items.status = $("#status");
	decorationOrderDetail.items.createTime = $("#createTime");
	
	decorationOrderDetail.items.houseType = $('#houseType');
	decorationOrderDetail.items.houseClass = $('#houseClass');
	decorationOrderDetail.items.orderType = $('#orderType');
	
	decorationOrderDetail.items.backOrderName = $('#backOrderName');
	decorationOrderDetail.items.backOrderPhone = $('#backOrderPhone');
	decorationOrderDetail.items.backOrderContent = $('#backOrderContent');
	
	decorationOrderDetail.items.notSalesmanName = $('#notSalesmanName');
	decorationOrderDetail.items.notSalesmanPhone = $('#notSalesmanPhone');
	decorationOrderDetail.items.notSalesmanRate = $('#notSalesmanRate');
	decorationOrderDetail.items.notSalesmanContent = $('#notSalesmanContent');
	
	decorationOrderDetail.items.salesmanType = $('#salesmanType');
	
	decorationUtils.init();
	
	decorationOrderDetail.decorationOrderId = params.decorationOrderId;
	decorationOrderDetail.orderType = params.type;

	decorationPayment.postParam.decorationOrderId = decorationOrderDetail.decorationOrderId;
	decorationPayment.postParam["decorationPayment.orderId"] = decorationOrderDetail.decorationOrderId;
	
	decorationOrderDetail.btnSaveBaseDecorationOrderInfo = $("#btnSaveBaseDecorationOrderInfo").on("click", saveBaseDecorationOrderInfo);
	
	decorationOrderDetail.printQuotationModal = $("#printQuotationModal");
	
	decorationOrderDetail.activitys = $("#activitys");
	decorationOrderDetail.activityItems = $("#activityItems");
	
	com.post(api.ds.decorationInfo, {}, function(res){
		decorationOrderDetail.items.orderType.bindData(res.type, 'key', 'value');
		decorationOrderDetail.items.houseType.bindData(res.houseType, 'key', 'value');
		decorationOrderDetail.items.houseClass.bindData(res.houseClass, 'key', 'value');
	}, null, false);
	
	$("#btnPrintDefaultQuotationInfo").on('click',function(res){
		decorationOrderDetail.printQuotationModal.modal("show");
	});
	
	// com.initChosen('vApproveManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type" : 2}, "autoFillKeyValue", "key", "value");
	// com.initChosen('approveManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type" : 1}, "autoFillKeyValue", "key", "value");
	com.initChosen('villageSel', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", 'key', 'value').on('change', function(e){
		if($("#villageSel").val() == null||$("#villageSel").val() == "") return;
		
		com.post(api.data.queryVillageById, {"village.villageId": $("#villageSel").val()}, function(res){
			$("#houseNumber").val("");
			com.validator.houseNumber["regex"] = eval("/^"+res.village.buildingNameRule.rule+"$/g");
			com.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+res.village.buildingNameRule.ruleContent+")";
			$("#buildingRuleContent").html("说明："+res.village.buildingNameRule.ruleContent+";eg."+res.village.buildingNameRule.ruleExample);
		});
	});

	if(decorationOrderDetail.orderType == decorationOrderDetail.type["半价"]){
		decorationUtils.initDecorationHolonomy('step5',decorationOrderDetail.decorationOrderId);
	}

	$('#customerInfosBtn').on(ace.click_event, function(){
		if(decorationOrderDetail.showCustomerInfoFlag==undefined || decorationOrderDetail.showCustomerInfoFlag==0 ){
			$.gritter.add({
				title: '客户敏感信息',
				text: '邮箱 :'+decorationOrderDetail.customer.email+'<br /> QQ:'+decorationOrderDetail.customer.qq+'<br /> 微信:'+decorationOrderDetail.customer.wechat+'<br />  电话 :'+decorationOrderDetail.customer.phone+'<br />  客户类型:'+decorationOrderDetail.customer.relationshipType+'<br /> ',
				class_name: 'gritter-info gritter-center gritter-light',
				after_close: function(e, manual_close){
					decorationOrderDetail.showCustomerInfoFlag = 0;
				}
			});
			decorationOrderDetail.showCustomerInfoFlag = 1;
		}

		return false;
	});
	
	$.extend(com.validator, decorationOrderDetail.validator);
	
	$('#customerApproveBtn').on("click", function(){
		com.clearValidator();
		com.clearValidator("#customerPhone", true);
		
		$("#customerName").val($("#customer").val());
		$("#customerPhone").val(decorationOrderDetail.customer.phone).on("blur",function(){
			$this = $(this);
			if($this.val() == undefined || $this.val().trim() == ""){
				com.clearValidator("#customerPhone", true);
				decorationOrderDetail.cRepeatFlg = false;
				return;
			}
			if((com.validator.phones.regex).test($this.val())){
				com.post(api.data.checkCustomerForPhone, {"customer.phone":$this.val()}, function(res){
					var customerIds = res.customerIds;
					var count = customerIds.length;
					if(count == 1){
						if(customerIds[0] != decorationOrderDetail.customer.id){
							com.showTips($this, "该联系方式已存在", true);
							decorationOrderDetail.cRepeatFlg = true;
						}else{
							com.clearValidator("#customerPhone", true);
							decorationOrderDetail.cRepeatFlg = false;
						}
							
					}else if(count > 1){
						com.showTips($this, "该联系方式已存在", true);
						decorationOrderDetail.cRepeatFlg = true;
					}else{
						com.clearValidator("#customerPhone", true);
						decorationOrderDetail.cRepeatFlg = false;
					}
				});
			}
		});
		
		$("#customerDes").val("");

		approvalUtils.initqueryApprovalUser("approveManSel",1);
		
		$("#customerApproveModal").modal("show");
	});
	
	$("#cApproveSaveBtn").on("click", function(){
		
		if (com.validate('customerApproveModal') || decorationOrderDetail.cRepeatFlg){
			return;
		}

		var receiverId = $("#approveManSel").find('input:checked').attr('userid');

		if(receiverId == null || receiverId == ""){
			com.showAlert(com.error,"请选择审批人!");
			return;
		}
		
		var options = {
			"approval.receiverId": receiverId,
			"approval.comment": $("#customerDes").val(),
			"approvalCustomer.customerId": decorationOrderDetail.customer.id,
			"approvalCustomer.newCustomerName": $("#customerName").val(),
			"approvalCustomer.newCustomerPhone": $("#customerPhone").val(),
		}
		
		com.post(api.approval.submitApprovalForCustomer, options, function(res){
			com.showAlert(com.info, "操作成功");
		})
		
		$("#customerApproveModal").modal("hide");
	});
	
	$('#villageApproveBtn').on("click", function(){
		com.clearValidator();
		com.clearValidator("#houseNumber", true);

		
		$("#houseNumber").val(decorationOrderDetail.village.houseNumber);
		
		com.validator.houseNumber["regex"] = eval("/^"+decorationOrderDetail.village.rule+"$/g");
		com.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+decorationOrderDetail.village.ruleContent+")";
		
		$("#buildingRuleContent").text("说明："+decorationOrderDetail.village.ruleContent+";eg."+decorationOrderDetail.village.ruleExample);
		$("#villageDes").val("");
		approvalUtils.initqueryApprovalUser("vApproveManSel",2);
		$("#villageApproveModal").modal("show");
	});
	
	//village house number
	$("#houseNumber").on("blur",function(e){
		if($(this).val() == "" || $("#villageSel").val()==""){
			return;
		}
		
		com.post(api.decoration.queryDecorationOrderByVillageIdAHouseNumber, {"decorationOrder.village.villageId":$("#villageSel").val(),"decorationOrder.houseNumber":$("#houseNumber").val()}, function(res){
			if(res.decorationOrder&&res.decorationOrder.orderId){
					com.showTips($("#houseNumber"), "订单已存在：订单号："+res.decorationOrder.orderId+" 订单所属设计师:"+res.decorationOrder.designer, true);
					decorationOrderDetail.vRepeatFlg = true;
			}else{
				com.clearValidator("#houseNumber", true);
				decorationOrderDetail.vRepeatFlg = false;
			}
		});
	});
	
	$("#vApproveSaveBtn").on("click", function(){
		
		if(com.validate('villageApproveModal')|| decorationOrderDetail.vRepeatFlg){
			return;
		}

		var receiverId = $("#vApproveManSel").find('input:checked').attr('userid');

		if(receiverId == null || receiverId == ""){
			com.showAlert(com.error,"请选择审批人!");
			return;
		}
		var reg = new RegExp("\\s");
		var houseNumber = $("#houseNumber").val().substr(1).match(reg);

		if(houseNumber != null ){
			com.showAlert(com.error,"楼牌号不允许存在空格");
			return;
		}
		
		var options = {
			"approval.receiverId": receiverId,
			"approval.comment": $("#villageDes").val(),
			"approvalVillage.orderId": $("#orderId").val(),
			"approvalVillage.newVillageId": $("#villageSel").val(),
			"approvalVillage.newHouseNumber": $("#houseNumber").val(),
		}
		
		com.post(api.approval.submitApprovalForVillage, options, function(res){
			com.showAlert(com.info, "操作成功");
		});
		
		$("#villageApproveModal").modal("hide");
	});
	
	$('#btnBack').on(ace.click_event, function(){
		com.switchPage(api.index.decorationOrderAdvanceIndex.url);
	});
	
	initWizard();
	
	decorationUtils.initBaseInfo(decorationOrderDetail.decorationOrderId, api.decoration.queryDecorationOrderForCommonByOrderId, function(decorationOrder){
		
		var statuses = ["咨询", "量房", "已报价", "定金"];
		
		if(statuses.indexOf(decorationOrder.status)){
			decorationOrderDetail.items.houseType.prop("disabled", false);
		}else{
			decorationOrder.status == "已签约" ? decorationOrderDetail.items.houseType.prop("disabled", true) : decorationOrderDetail.items.houseType.prop("disabled", false);
		}
		
		decorationOrderDetail.items.orderId.val(decorationOrder.orderId);
		decorationOrderDetail.items.customer.val(decorationOrder.customer.customerName);
		decorationOrderDetail.items.houseAddr.val(decorationOrder.village.villageName + decorationOrder.houseNumber);
		decorationOrderDetail.items.designDepartment.val(decorationOrder.designDepartment);
		decorationOrderDetail.items.designer.val(decorationOrder.designer);
		decorationOrderDetail.items.businessDepartment.val(decorationOrder.businessDepartment);
		decorationOrderDetail.items.salesman.val(decorationOrder.salesman);
		decorationOrderDetail.items.orderType.val(decorationOrder.type);
		decorationOrderDetail.items.houseType.val(decorationOrder.houseType);
		decorationOrderDetail.items.houseClass.val(decorationOrder.houseClass);
		decorationOrderDetail.items.houseArea.val(decorationOrder.houseArea);
		decorationOrderDetail.items.freeArea.val(decorationOrder.freeArea);
		decorationOrderDetail.items.status.val(decorationOrder.status);
		decorationOrderDetail.items.createTime.val(decorationOrder.createTime);
		
		decorationOrderDetail.items.backOrderName.val(decorationOrder.backOrderName);
		decorationOrderDetail.items.backOrderPhone.val(decorationOrder.backOrderPhone);
		decorationOrderDetail.items.backOrderContent.val(decorationOrder.backOrderContent);
		
		decorationOrderDetail.items.notSalesmanName.val(decorationOrder.notSalesmanName);
		decorationOrderDetail.items.notSalesmanPhone.val(decorationOrder.notSalesmanPhone);
		decorationOrderDetail.items.notSalesmanRate.val(decorationOrder.notSalesmanRate);
		decorationOrderDetail.items.notSalesmanContent.val(decorationOrder.notSalesmanContent);
		
		decorationOrderDetail.items.salesmanType.val(decorationOrder.salesmanType);
		
        decorationOrderDetail.customer.id = decorationOrder.customer.id;
		decorationOrderDetail.customer.phone = decorationOrder.customer.phone;
		decorationOrderDetail.customer.qq = decorationOrder.customer.qq;
		decorationOrderDetail.customer.wechat = decorationOrder.customer.wechat;
		decorationOrderDetail.customer.email = decorationOrder.customer.email;
		decorationOrderDetail.customer.relationshipType = decorationOrder.customer.relationshipType;
		decorationOrderDetail.customer.approveStatus = decorationOrder.customer.approveStatus;

		decorationOrderDetail.village.villageId = decorationOrder.village.villageId;
		decorationOrderDetail.village.villageName = decorationOrder.village.villageName;
		decorationOrderDetail.village.houseNumber = decorationOrder.houseNumber;
		decorationOrderDetail.village.ruleExample = decorationOrder.village.buildingNameRule.ruleExample;
		decorationOrderDetail.village.ruleContent = decorationOrder.village.buildingNameRule.ruleContent;
		decorationOrderDetail.village.rule = decorationOrder.village.buildingNameRule.rule;
		
		decorationOrderDetail.decorationOrder.type = decorationOrder.type;
	});
	
	decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, null, null, null);
});

function initWizard(){
	$('#fuelux-wizard').ace_wizard({"status":true}).on('change' , function(e, info){
		
		var curstep = 0;
		
		info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;
		
		curstep == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		
		if(curstep == 2){
			quotationUtils.loadQuotationDetail();
		}else if(curstep == 3){
			decorationUtils.initMaterial(decorationOrderDetail.decorationOrderId);
		}else if(curstep == 4){
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
		}else if(curstep == 6){
			decorationUtils.initDecorationBelong(decorationOrderDetail.decorationOrderId);
		}
		
	}).on('finished', function(e) {
		com.switchPage(api.index.decorationOrderAdvanceIndex.url);
	}).on('stepclick', function(e,info){
		
		info.step == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		
		if(info.step == 2){
			quotationUtils.loadQuotationDetail();
		}else if(info.step == 3){
			decorationUtils.initMaterial(decorationOrderDetail.decorationOrderId);
		}else if(info.step == 4){
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
		}else if(info.step == 6){
			decorationUtils.initDecorationBelong(decorationOrderDetail.decorationOrderId);
		}
	}).on('next', function(e, info){
		info.step == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
	}).on('previous', function(e, info){
		info.step == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
	});
}

function saveBaseDecorationOrderInfo(){
	if(com.validate("step1")){
		return;
	}
	
	bootbox.confirm("确定要保存基本信息吗?", function(result) {
		if(result) {
			var options = {
				"decorationOrder.orderId": decorationOrderDetail.decorationOrderId,
				"decorationOrder.type": decorationOrderDetail.items.orderType.val(),
				"decorationOrder.houseType": decorationOrderDetail.items.houseType.val(),
				"decorationOrder.houseClass": decorationOrderDetail.items.houseClass.val(),
				"decorationOrder.houseArea": decorationOrderDetail.items.houseArea.val(),
				"decorationOrder.freeArea": decorationOrderDetail.items.freeArea.val(),
				"decorationOrder.notSalesmanRate": decorationOrderDetail.items.notSalesmanRate.val(),
				"decorationOrder.notSalesmanName": decorationOrderDetail.items.notSalesmanName.val(),
				"decorationOrder.notSalesmanPhone": decorationOrderDetail.items.notSalesmanPhone.val(),
				"decorationOrder.notSalesmanContent": decorationOrderDetail.items.notSalesmanContent.val(),
			};
			
			com.post(api.decoration.changeDecorationOrderForAdvance, options, function(){
				com.showAlert(com.info, "操作成功");
			});
		}
	});
}

function downloadFile(picturePath,uploadFileName){
	window.open(config.media + api.common.downloadFile.url + "?downloadFilePath="+picturePath+"&fileName="+uploadFileName);
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.quotationItemDes+'">工艺</span>';
	html += "<input type='text' class='hide' value='"+rowObject.quotationItemDes+"' />";
	return html;
}
