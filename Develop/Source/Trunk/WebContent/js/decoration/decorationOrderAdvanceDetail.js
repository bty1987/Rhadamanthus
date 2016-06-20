var decorationOrderDetail = {
	decorationOrderId:null,
	
	customer:{},
	village:{},
	materialPaymentListGrid: null,
	materialPaymentGridPager: null,
	
	quotationDetail:{},
	
	btnSaveBaseDecorationOrderInfo:null,
	
	validator: {
		houseNumber: {
			type: "v_houseNumber", 
			regex: /^D_\d{3}$/g,
			errorMsg: "楼盘名称规则"
		}
	},
	
	vRepeatFlg: false,
	cRepeatFlg: false
};

var decorationPayment = {
	postParam:{},
	
	items:{},
	basePaymentGrid:null,
	otherPaymentGrid:null,
	otherPaymentPager:null,
	
	editFlag:0,
};

var materialSubOrderItemData = {};

jQuery(function($) {
	
	decorationUtils.init();
	
	decorationOrderDetail.decorationOrderId = decorationOrderPostData.decorationOrderId;
	
	decorationPayment.postParam.decorationOrderId = decorationOrderDetail.decorationOrderId;
	decorationPayment.postParam["decorationPayment.orderId"] = decorationOrderDetail.decorationOrderId;
	
	decorationOrderDetail.btnSaveBaseDecorationOrderInfo = $("#btnSaveBaseDecorationOrderInfo").on("click", saveBaseDecorationOrderInfo);
	
	decorationOrderDetail.materialPaymentListGrid = $("#materialPaymentListGrid");
	decorationOrderDetail.materialPaymentGridPager = "#materialPaymentGridPager";

	decorationPayment.otherPaymentGrid=$("#otherPaymentTable");
	decorationPayment.otherPaymentPager="#otherPaymentGridPager";
	decorationPayment.basePaymentGrid = $("#basePaymentTable");
	
	decorationOrderDetail.printQuotationModal = $("#printQuotationModal");
	
	decorationOrderDetail.activitys = $("#activitys");
	decorationOrderDetail.activityItems = $("#activityItems");
	
	$("#btnPrintDefaultQuotationInfo").on('click',function(res){
		decorationOrderDetail.printQuotationModal.modal("show");
	});
	
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
	//==============customer approve=====================
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
		$("#approveManSel").html('<option value="">&nbsp;</option>').trigger("chosen:updated");
		$("#customerApproveModal").modal("show");
	});
	
	$("#approveManSel").chosen({allow_single_deselect: true}); 
	$("#approveManSel_chosen input").bind("input", function(){
		var pinyinName = $(this).val();
		if($(this).val() != ""){
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin": pinyinName, "userApprove.type": 1}, function(res){
				if(res.errorCode == 0){
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillKeyValue!=null){
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
						
					}
					$("#approveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#approveManSel_chosen").css("width", "200px");
	
	$("#cApproveSaveBtn").on("click", function(){
		
		if (com.validate('customerApproveModal')){
			return;
		}
		
		var options = {
			"approval.receiverId": $("#approveManSel").val(),
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
		$("#villageSel").html('<option value="'+decorationOrderDetail.village.villageId+'">'+decorationOrderDetail.village.villageName+'</option>');
		$("#villageSel").trigger("chosen:updated");
		$("#houseNumber").val(decorationOrderDetail.village.houseNumber);
		
		com.validator.houseNumber["regex"] = eval("/^"+decorationOrderDetail.village.rule+"$/g");
		com.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+decorationOrderDetail.village.ruleContent+")";
		
		$("#buildingRuleContent").text("说明："+decorationOrderDetail.village.ruleContent+";eg."+decorationOrderDetail.village.ruleExample);
		$("#villageDes").val("");
		$("#vApproveManSel").html('<option value="">&nbsp;</option>').trigger("chosen:updated");
		$("#villageApproveModal").modal("show");
	});
	
	$("#villageSel").chosen({allow_single_deselect: true}); 
	$("#villageSel_chosen input").bind("input", function(){
		var auroFileSearchValue = $("#villageSel_chosen input").val();
		if($("#villageSel_chosen input").val() != ""){
			com.post(api.data.queryVillageForNameByPinyin, {"pinyinName":auroFileSearchValue},function(res){
				if(res.errorCode == 0){
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillKeyValue!=null){
						var i = 0;
						for(i=0;i<res.autoFillList.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#villageSel").html(html1);
					$("#villageSel").trigger("chosen:updated");
				}
			});
		}
	});
	
	$("#villageSel").on("change",function(e){
		if($("#villageSel").val() == null||$("#villageSel").val() == "") return;
		com.post(api.data.queryVillageById, {"village.villageId": $("#villageSel").val()}, function(res){
			$("#houseNumber").val("");
			com.validator.houseNumber["regex"] = eval("/^"+res.village.buildingNameRule.rule+"$/g");
			com.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+res.village.buildingNameRule.ruleContent+")";
			$("#buildingRuleContent").html("说明："+res.village.buildingNameRule.ruleContent+";eg."+res.village.buildingNameRule.ruleExample);
		});
	});
	$("#villageSel_chosen").css("width", "200px");
	
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
	
	//village approve: approve-man-select
	$("#vApproveManSel").chosen({allow_single_deselect: true}); 
	$("#vApproveManSel_chosen input").bind("input", function(){
		var pinyinName = $(this).val();
		if($(this).val() != ""){
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin": pinyinName, "userApprove.type": 2}, function(res){
				if(res.errorCode == 0){
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillKeyValue!=null){
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#vApproveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#vApproveManSel_chosen").css("width", "200px");
	
	//village approve modal save button
	$("#vApproveSaveBtn").on("click", function(){
		
		if(com.validate('villageApproveModal')|| decorationOrderDetail.vRepeatFlg){
			return;
		}
			
		var options = {
			"approval.receiverId": $("#vApproveManSel").val(),
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
		$("#fl-container").load(api.index.decorationOrderAdvanceIndex.url);
	});
	
	initWizard();
	
	decorationUtils.initBaseInfo(decorationOrderDetail.decorationOrderId, function(decorationOrder){
		
		var statuses = ["咨询", "量房", "已报价", "定金"];
		
		if(statuses.indexOf(decorationOrder.status)){
			$("#houseType").prop("disabled", false);
		}else{
			decorationOrder.status == "已签约" ? $("#houseType").prop("disabled", true) : $("#houseType").prop("disabled", false);
		}
		
		$("#orderId").val(decorationOrder.orderId);
		$("#customer").val(decorationOrder.customer.customerName);
		$("#houseAddr").val(decorationOrder.village.villageName + decorationOrder.houseNumber);
		$("#designDepartment").val(decorationOrder.designDepartment);
		$("#designer").val(decorationOrder.designer);
		$("#businessDepartment").val(decorationOrder.businessDepartment);
		$("#salesman").val(decorationOrder.salesman);
		$("#houseType").val(decorationOrder.houseType);
		$("#houseClass").val(decorationOrder.houseClass);
		$("#houseArea").val(decorationOrder.houseArea);
		$("#freeArea").val(decorationOrder.freeArea);
		$("#status").val(decorationOrder.status);
		$("#createTime").val(decorationOrder.createTime);
		
		$("#backOrderName").val(decorationOrder.backOrderName);
		$("#backOrderPhone").val(decorationOrder.backOrderPhone);
		$("#backOrderContent").val(decorationOrder.backOrderContent);
		
		$("#notSalesmanName").val(decorationOrder.notSalesmanName);
		$("#notSalesmanPhone").val(decorationOrder.notSalesmanPhone);
		$("#notSalesmanRate").val(decorationOrder.notSalesmanRate);
		$("#notSalesmanContent").val(decorationOrder.notSalesmanContent);
		
		$("#salesmanType").val(decorationOrder.salesmanType);
		
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
	});
	
	decorationUtils.initBasePayment(decorationPayment.postParam, null, "#decorationOrderDetailSalesmanPageContent");
	decorationUtils.initOtherPayment(decorationPayment.postParam, null, "#decorationOrderDetailSalesmanPageContent");
});

function initWizard(){
	$('#fuelux-wizard').ace_wizard({"status":true}).on('change' , function(e, info){
		
		var curstep = 0;
		
		info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;
		
		curstep == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		
		if(curstep == 2){
			decorationUtils.loadQuotationDetail();
		}else if(curstep == 3){
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}else if(curstep == 4){
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
		}else if(curstep == 6){
			decorationUtils.initOrderBelongInfo(decorationOrderDetail.decorationOrderId);
		}
		
	}).on('finished', function(e) {
		$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
	}).on('stepclick', function(e,info){
		
		info.step == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		
		if(info.step == 2){
			decorationUtils.loadQuotationDetail();
		}else if(info.step == 3){
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}else if(info.step == 4){
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
		}else if(info.step == 6){
			decorationUtils.initOrderBelongInfo(decorationOrderDetail.decorationOrderId);
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
				"decorationOrder.houseType": $("#houseType").val(),
				"decorationOrder.houseClass": $("#houseClass").val(),
				"decorationOrder.houseArea": $("#houseArea").val(),
				"decorationOrder.freeArea": $("#freeArea").val(),
				"decorationOrder.notSalesmanRate": $("#notSalesmanRate").val(),
				"decorationOrder.notSalesmanName": $("#notSalesmanName").val(),
				"decorationOrder.notSalesmanPhone": $("#notSalesmanPhone").val(),
				"decorationOrder.notSalesmanContent": $("#notSalesmanContent").val(),
			};
			
			com.post(api.decoration.changeDecorationOrderForActivity, options, function(){
				com.showAlert(com.info, "操作成功");
				initBaseInfo();
			});
		}
	});
}

function downloadFile(picturePath,uploadFileName){
	window.open(decorationOrderDetail.mediaServer + api.common.downloadFile.url + "?downloadFilePath="+picturePath+"&fileName="+uploadFileName);
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.quotationItemDes+'">工艺</span>';
	html += "<input type='text' class='hide' value='"+rowObject.quotationItemDes+"' />";
	return html;
}
