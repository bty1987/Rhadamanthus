var decorationOrderDetail = {
	decorationOrderId : null,

	initBaseInfo: initBaseInfo,
	initUplodify: initUploadify,
	customer: {},
	village: {},
	quotationItemListGrid: null,
	quotationItemGridPager: null,
	materialPaymentListGrid: null,
	materialPaymentGridPager: null,

	mediaServer: null,

	quotations: null,
	quotationDetail: null,

	reloadFlag: 0,
	decorationOrderQuotationItemData: [],
	decorationOrderQuotationItemGroupByJob: [],

	btnSaveBaseDecorationOrderInfo: null,
	
	activity: {},
	
	decorationPaymentId: null,
	convertActivityItemId: null,

	validator: {
		houseNumber: {
			type: "v_houseNumber",
			regex: /^D_\d{3}$/g,
			errorMsg: "楼盘名称规则"
		}
	},

	vRepeatFlg: false,
	cRepeatFlg: false,
};

var decorationPayment = {
	postParam: {},

	items: {},
	basePaymentGrid: null,
	otherPaymentGrid: null,
	otherPaymentPager: null,

	editFlag: 0,
};

var bootboxFlag = false;

var approveData = {};

jQuery(function($) {
	
	decorationUtils.init();
	
	decorationOrderDetail.decorationOrderId = decorationOrderPostData.decorationOrderId;
	
	decorationPayment.postParam.decorationOrderId = decorationOrderDetail.decorationOrderId;
	decorationPayment.postParam["decorationPayment.orderId"] = decorationOrderDetail.decorationOrderId;
	
	decorationOrderDetail.btnSaveBaseDecorationOrderInfo = $("#btnSaveBaseDecorationOrderInfo").on("click", saveBaseDecorationOrderInfo);

	decorationOrderDetail.quotationItemListGrid = $("#quotationItemListGrid");
	decorationOrderDetail.quotationItemGridPager = "#quotationItemGridPager";
	decorationOrderDetail.materialPaymentListGrid = $("#materialPaymentListGrid");
	decorationOrderDetail.materialPaymentGridPager = "#materialPaymentGridPager";
	
	decorationOrderDetail.activity.activity = $("#activity").on("change", function(){
		var $this = $(this);
		
		var _things = [];
		var _coupons = [];
		
		var options = {
			"activity.aid": $this.val(),
		}
		
		com.post(api.information.queryActivityItemByAId, options, function(res){
			var _ = res.activityItems;
			
			for(var i=0;i<_.length;i++){
				
				var _activityItem = _[i];
				
				if(_activityItem.type == 0){
					_coupons.push({aiId:_activityItem.aiId, activityItemName:_activityItem.activityItemName + " 金额:" + _activityItem.money});
				}else if(_activityItem.type == 1){
					_things.push({aiId:_activityItem.aiId, activityItemName:_activityItem.activityItemName});
				}
			}
			
			decorationOrderDetail.activity.things.chosen("destroy");
			decorationOrderDetail.activity.things.chosen({width: "216px"});
			decorationOrderDetail.activity.things.bindData(_things, 'aiId', 'activityItemName', false);
			decorationOrderDetail.activity.things.trigger("chosen:updated");
			
			decorationOrderDetail.activity.coupons.chosen("destroy");
			decorationOrderDetail.activity.coupons.chosen({width: "216px", multi_type: "input"});
			decorationOrderDetail.activity.coupons.bindData(_coupons, 'aiId', 'activityItemName', false);
			decorationOrderDetail.activity.coupons.trigger("chosen:updated");
		});
	});
	
	decorationOrderDetail.activity.activityInfo = $("#activityInfo");
	decorationOrderDetail.activity.activity = $("#activity");
	decorationOrderDetail.activity.things = $("#things");
	decorationOrderDetail.activity.coupons = $("#coupons");
	decorationOrderDetail.activity.convertActivityItemName = $("#convertActivityItemName");
	decorationOrderDetail.activity.convertActivityItemMoney = $("#convertActivityItemMoney");
	decorationOrderDetail.activity.activityType = $("#activityType").on("change", function(){
		var $this = $(this);
		
		if($this.val() == 0){
			decorationOrderDetail.activity.couponInfo.css("display", "block");
		}else if($this.val() == 1){
			decorationOrderDetail.activity.couponInfo.css("display", "none");
		}
	});
	decorationOrderDetail.activity.activityItemName = $("#activityItemName");
	decorationOrderDetail.activity.couponInfo = $("#couponInfo");
	decorationOrderDetail.activity.activityItemMoney = $("#activityItemMoney");
	decorationOrderDetail.activity.activityItemNum = $("#activityItemNum");
	
	decorationOrderDetail.activity.things.chosen({width: "216px"});
	decorationOrderDetail.activity.coupons.chosen({width: "216px"});
	
	decorationOrderDetail.activitys = $("#activitys");
	decorationOrderDetail.activityItems = $("#activityItems");

	decorationPayment.decorationPayment = $("#decorationPayment");
	decorationPayment.otherPaymentGrid = $("#otherPaymentTable");
	decorationPayment.otherPaymentPager = "#otherPaymentGridPager";
	decorationPayment.basePaymentGrid = $("#basePaymentTable");

	decorationOrderDetail.printQuotationModal = $("#printQuotationModal");
	decorationOrderDetail.quotationTotalPriceModal = $("#quotationTotalPriceModal");
	decorationOrderDetail.joinDecorationActivityModal = $("#joinDecorationActivityModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	decorationOrderDetail.applyDecorationActivityItemModal = $("#applyDecorationActivityItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	decorationOrderDetail.convertDecorationActivityItemModal = $("#convertDecorationActivityItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	decorationOrderDetail.applySpecialDecorationActivityItemModal = $("#applySpecialDecorationActivityItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	decorationOrderDetail.decorationPaymentModal = $("#decorationPaymentModal");
	decorationOrderDetail.refundDecorationPaymentModal = $("#refundDecorationPaymentModal");

	$("#btnPrintDefaultQuotationInfo").on('click', function(res) {
		decorationOrderDetail.printQuotationModal.modal("show");
	});

	$("#btnSetDecorationPaymentInfo").on('click', function(res) {
		com.clearValidator();

		$("#decorationOrderTotalMoney").val("");
		decorationOrderDetail.quotationTotalPriceModal.modal("show");
	});
	
	$("#btnRebackPayment").on('click', function(res){
		decorationPayment.editFlag = 0;
		com.clearValidator();
		com.post(api.payment.queryDecorationPaymentForBaseAConfirmByOrderId, decorationPayment.postParam, function(res){
			decorationPayment.refundType = [{"key":"", "value":"", "money":0}];
			decorationPayments = res.decorationPayments;
			
			var options = {};
			
			for(var i=0;i<decorationPayments.length;++i){
				
				var _decorationPayment = decorationPayments[i];
				var option = {"key":_decorationPayment.paymentType + "退款", "value":_decorationPayment.paymentType + "退款", "money":_decorationPayment.paymentBlance, "paymentId":_decorationPayment.autoId};
				
				options[_decorationPayment.paymentType] = option;
			}
			
			console.log(options);
			
			if(options["尾款"]){
				decorationPayment.refundType.push(options["尾款"]);
			}else if(options["二期款"]){
				decorationPayment.refundType.push(options["二期款"]);
			}else if(options["首付二期款"]){
				decorationPayment.refundType.push(options["首付二期款"]);
			}else if(options["首付款"]){
				decorationPayment.refundType.push(options["首付款"]);
			}
			
			$("#paymentType").bindData(decorationPayment.refundType, 'key', 'value');

			$("#paymentType").attr("disabled",false);
			$("#paymentType").get(0).selectedIndex = 0;
			$("#referMoney").attr("disabled",false);
			$("#autoId").val("");
			$("#referMoney").val("");
			$("#refundApprove").removeClass("hide");
			$("#changeReason").addClass("v_required");
			$("#refundApproveManSel").addClass("v_required");
			$("#changeReason").val("");
			
			var html1 = '<option value="">&nbsp;</option>';
			$("#approveManSel").html(html1).trigger("chosen:updated");
			
			decorationOrderDetail.refundDecorationPaymentModal.modal("show");
		});
	});
	
	$("#saveGenerateDecorationPaymentBtn").on('click',function(res){
		
		if(com.validate("quotationTotalPriceModal")){
			return;
		}
		
		if(parseFloat($("#decorationOrderTotalMoney").val()) <= 0.0000001){
			bootbox.alert("合同款不能小于1元");
			return;
		}
		
		var options = {
			"decorationPayment.referMoney": $("#decorationOrderTotalMoney").val(),
			"decorationPayment.orderId": decorationOrderDetail.decorationOrderId,
		}
		
		com.post(api.payment.makeDecorationPayment, options, function(res){
			$.jgrid.refreshGrid($("#basePaymentTable"), decorationPayment.postParam);
		});
		
		decorationOrderDetail.quotationTotalPriceModal.modal("hide");
	});
	
	$("#savePaymentBtn").on("click", function(res){
		
		if(com.validate("decorationPaymentModal")){
			return;
		}
		
		var options = {
			"decorationPayment.autoId": decorationOrderDetail.decorationPaymentId,
			"decorationPayment.referMoney": decorationPayment.decorationPayment.val(),
		}
		
		console.log(options);
		
		com.post(api.payment.updateDecorationPaymentForReferMoney, options, function(res){
			
			com.showAlert(com.info, "修改成功");
			
			$.jgrid.refreshGrid(decorationPayment.basePaymentGrid, decorationPayment.postParam);
			$.jgrid.refreshGrid(decorationPayment.otherPaymentGrid, decorationPayment.postParam);
		});
		
		decorationOrderDetail.decorationPaymentModal.modal("hide");
	});
	
	$("#saveRefundMoneyBtn").on('click', function(res){
		
		if(com.validate("refundDecorationPaymentModal")){
			return;
		}
		
		if(decorationPayment.editFlag == 0){
			
			var options = {
				"approval.receiverId": $("#refundApproveManSel").val(),
				"approval.comment": $("#changeReason").val(),
				"approvalDecorationRefund.paymentId": decorationOrderDetail.paymentId,
			}
			
			bootbox.confirm("确认要提交退款申请吗？", function(res) {
				if(res){
					com.post(api.approval.submitApprovalForDecorationRefund, options, function(res){
						com.showAlert(com.info, "操作成功");
						$.jgrid.refreshGrid(decorationPayment.basePaymentGrid, decorationPayment.postParam);
						$.jgrid.refreshGrid(decorationPayment.otherPaymentGrid, decorationPayment.postParam);
					});
				}
				
				decorationOrderDetail.refundDecorationPaymentModal.modal("hide");
			});
		}
	});

	$('#customerInfosBtn').on(ace.click_event, function() {
		if (decorationOrderDetail.showCustomerInfoFlag == undefined || decorationOrderDetail.showCustomerInfoFlag == 0) {
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
	
	$("#submitDecorationActivityBtn").on(ace.click_event, function(){
		
		if(com.validate()){
			return;
		}
		
		var options = {
			"decorationActivity.orderId": decorationOrderDetail.decorationOrderId,
			"decorationActivity.activity.aid": decorationOrderDetail.activity.activityInfo.val(),
		}
		
		com.post(api.decoration.addDecorationActivity, options, function(res){
			
			var decorationActivity = res.decorationActivity;
			
			decorationUtils.addDecorationActivityForDiv(decorationOrderDetail.activitys, decorationActivity, activityBtnMethod);
		});
		
		decorationOrderDetail.joinDecorationActivityModal.modal("hide");
	});
	
	$("#submitDecorationActivityItemBtn").on(ace.click_event, function(){
		
		if(com.validate()){
			return;
		}
		
		if(decorationOrderDetail.activity.things.val() == null && decorationOrderDetail.activity.coupons.val() == null){
			com.showAlert(com.warning, "活动物品或券需要选择才能提交");
			return;
		}
		
		var submitFlag = true;
		
		var orderId = decorationOrderPostData.decorationOrderId
		var activityName = decorationOrderDetail.activity.activity.find("option:selected").text();
		
		var index = 0;
		var options = {
			"approval.receiverId": $("#approveActivityItemManSel").val(),
			"approval.comment": "",
			"approvalActivity.activityId": decorationOrderDetail.activity.activity.val(),
			"approvalActivity.orderId": orderId,
			"approvalActivity.activityName": activityName,
		};
		
		$("[class='search-choice']", $("#things_chosen")).each(function(i, e){
			
			var _ = $(e);
			
			options["approvalActivityItems[" + index + "].orderId"] = orderId;
			options["approvalActivityItems[" + index + "].activityName"] = activityName;
			options["approvalActivityItems[" + index + "].activityItemName"] = _.children('span').text();
			options["approvalActivityItems[" + index + "].type"] = 1;
			options["approvalActivityItems[" + index + "].num"] = 1;
			options["approvalActivityItems[" + index + "].money"] = 0;
			options["approvalActivityItems[" + index + "].content"] = "";
			
			index++;
		});
		
		$("[class='search-choice']", $("#coupons_chosen")).each(function(i, e){
			var _ = $(e);
			
			if(!/^\d+$/.test(_.children('span').children('input').val())){
				com.showAlert(com.warning, "券需要填写数量");
				submitFlag = false;
			}
			
			options["approvalActivityItems[" + index + "].orderId"] = orderId;
			options["approvalActivityItems[" + index + "].activityName"] = activityName;
			options["approvalActivityItems[" + index + "].activityItemName"] = _.children('span').text().split(" ")[0];
			options["approvalActivityItems[" + index + "].type"] = 0;
			options["approvalActivityItems[" + index + "].num"] = _.children('span').children('input').val();
			options["approvalActivityItems[" + index + "].money"] = _.children('span').text().split(" ")[1].split(':')[1];
			options["approvalActivityItems[" + index + "].content"] = "";
			
			index++;
		});
		
		console.log(options);
		
		if(!submitFlag){
			return;
		}
		
		com.post(api.approval.submitApprovalForDecorationActivity, options, function(res){
			com.showAlert(com.info, "提交成功");
		});
		
		decorationOrderDetail.applyDecorationActivityItemModal.modal("hide");
	});
	
	$("#submitSpecialDecorationActivityItemBtn").on(ace.click_event, function(){
		
		if(com.validate()){
			return;
		}
		
		var orderId = decorationOrderDetail.decorationOrderId;
		var type = decorationOrderDetail.activity.activityType.val();
		
		var options = {
			"approval.receiverId": $("#approveSpecialActivityItemManSel").val(),
			"approval.comment": "",
			"approvalActivity.activityId": -1,
			"approvalActivity.orderId": orderId,
			"approvalActivity.activityName": "特批活动物品",
			"approvalActivityItems[0].orderId": orderId,
			"approvalActivityItems[0].activityName": "特批活动物品",
			"approvalActivityItems[0].activityItemName": decorationOrderDetail.activity.activityItemName.val(),
			"approvalActivityItems[0].type": type,
			"approvalActivityItems[0].content": "",
		}
		
		if(type == 0){
			options["approvalActivityItems[0].num"] = decorationOrderDetail.activity.activityItemNum.val();
			options["approvalActivityItems[0].money"] = decorationOrderDetail.activity.activityItemMoney.val();
		}else if(type == 1){
			options["approvalActivityItems[0].num"] = 1;
			options["approvalActivityItems[0].money"] = 0;
		}
		
		console.log(options);
		
		com.post(api.approval.submitApprovalForDecorationActivity, options, function(res){
			com.showAlert(com.info, "提交成功");
		});
		
		decorationOrderDetail.applySpecialDecorationActivityItemModal.modal("hide");
	});
	
	$("#convertDecorationActivityItemBtn").on(ace.click_event, function(){
		
		if(com.validate()){
			return;
		}
		
		var daiId = decorationOrderDetail.convertActivityItemId;
		
		var options = {
			"decorationActivityItem.daiId": daiId,
			"decorationActivityItem.money": decorationOrderDetail.activity.convertActivityItemMoney.val(),
		}
		
		com.post(api.decoration.convertDecorationActivityItem, options, function(res){
			var decorationActivityItem = res.decorationActivityItem;
			
			$("#convert_" + daiId).unbind();
			$("#abate_" + daiId).unbind();
			$("#widgetHeader_" + daiId).addClass("header-color-grey");
			
			decorationUtils.addActivityItemForDiv(decorationOrderDetail.activityItems, decorationActivityItem, uiBtnMethod);
		});
	});

	$.extend(com.validator, decorationOrderDetail.validator);
	
	// ==============customer approve=====================
	$('#customerApproveBtn').on("click", function() {
		com.clearValidator();
		com.clearValidator("#customerPhone", true);

		approveData["customerName"] = $("#customer").val();
		approveData["customerPhone"] = decorationOrderDetail.customer.phone;

		$("#customerName").val($("#customer").val());
		$("#customerPhone").val(decorationOrderDetail.customer.phone).on("blur", function() {
			$this = $(this);
			if ($this.val() == undefined || $this.val().trim() == "") {
				com.clearValidator("#customerPhone", true);
				decorationOrderDetail.cRepeatFlg = false;
				return;
			}
			if ((com.validator.phones.regex).test($this.val())) {
				com.post(api.data.checkCustomerForPhone, {"customer.phone": $this.val()}, function(res) {
					var customerIds = res.customerIds;
					var count = customerIds.length;
					if (count == 1) {
						if (customerIds[0] != decorationOrderDetail.customer.id) {
							com.showTips($this, "该联系方式已存在", true);
							decorationOrderDetail.cRepeatFlg = true;
						} else {
							com.clearValidator("#customerPhone", true);
							decorationOrderDetail.cRepeatFlg = false;
						}

					} else if (count > 1) {
						com.showTips($this, "该联系方式已存在", true);
						decorationOrderDetail.cRepeatFlg = true;
					} else {
						com.clearValidator( "#customerPhone", true);
						decorationOrderDetail.cRepeatFlg = false;
					}
				});
			}
		});
		$("#customerDes").val("");
		$("#approveManSel").html('<option value="">&nbsp;</option>').trigger("chosen:updated");
		$("#customerApproveModal").modal("show");
	});
	
	$("#joinActivityBtn").on("click", function(){
		
		com.post(api.information.queryActivityForValid, {}, function(res){
			var activitys = res.activitys;
			
			var _activitys = [{aid:-1, activityName: ""}];
			
			for(var i=0;i<activitys.length;i++){
				var _activity = activitys[i];
				
				_activitys.push({aid:_activity.aid, activityName:_activity.activityName});
			}
			
			decorationOrderDetail.activity.activityInfo.bindData(_activitys, "aid", "activityName", false);
		});
		
		decorationOrderDetail.joinDecorationActivityModal.modal("show");
		
	});
	
	$("#applyActivityItemBtn").on("click", function(){
		
		decorationOrderDetail.activity.things.chosen("destroy");
		decorationOrderDetail.activity.things.chosen({width: "216px"});
		decorationOrderDetail.activity.things.bindData([{aid:-1, activityName: ""}], "aid", "activityName");
		decorationOrderDetail.activity.things.trigger("chosen:updated");
		
		decorationOrderDetail.activity.coupons.chosen("destroy");
		decorationOrderDetail.activity.coupons.chosen({width: "216px", multi_type: "input"});
		decorationOrderDetail.activity.coupons.bindData([{aid:-1, activityName: ""}], "aid", "activityName");
		decorationOrderDetail.activity.coupons.trigger("chosen:updated");
		
		var options = {
			"decorationActivity.orderId": decorationOrderDetail.decorationOrderId,
		}
		
		com.post(api.decoration.queryDecorationActivityByOrderId, options, function(res){
			
			var decorationActivitys = res.decorationActivitys;
			
			var _activitys = [{aid:-1, activityName: ""}];
			
			for(var i=0;i<decorationActivitys.length;i++){
				var _decorationActivity = decorationActivitys[i];
				
				_activitys.push({aid:_decorationActivity.activity.aid, activityName:_decorationActivity.activity.activityName})
			}
			
			decorationOrderDetail.activity.activity.bindData(_activitys, "aid", "activityName", false);
		}, null, false);
		
		decorationOrderDetail.applyDecorationActivityItemModal.modal("show");
	});
	
	$("#applySpecialActivityItemBtn").on("click", function(){
		
		com.post(api.ds.activityInfo, {}, function(res){
			decorationOrderDetail.activityItemType = res.activityItemType;
			
			decorationOrderDetail.activity.activityType.bindData(decorationOrderDetail.activityItemType, "key", "value");
		});
		
		decorationOrderDetail.activity.couponInfo.css("display", "none");
		
		decorationOrderDetail.applySpecialDecorationActivityItemModal.modal("show");
	});
	
	$("#approveManSel").chosen({
		allow_single_deselect : true
	});
	$("#approveManSel_chosen input").bind("input", function() {
		var pinyinName = $(this).val();
		if ($(this).val() != "") {
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin" : pinyinName, "userApprove.type" : 1}, function(res) {
				if (res.errorCode == 0) {
					var html1 = '<option value="">&nbsp;</option>';
					if (res.autoFillKeyValue != null) {
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

	$("#cApproveSaveBtn").on("click", function() {
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

	// =============village approve================
	$('#villageApproveBtn').on("click", function() {
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

		approveData["villageName"] = decorationOrderDetail.village.villageName;
		approveData["houseNumber"] = decorationOrderDetail.village.houseNumber;

		$("#villageApproveModal").modal("show");
	});
	$("#villageSel").chosen({
		allow_single_deselect : true
	});

	$("#villageSel_chosen input").bind("input", function() {
		var auroFileSearchValue = $("#villageSel_chosen input").val();
		
		if ($("#villageSel_chosen input").val() != "") {
			com.post(api.data.queryVillageForNameByPinyin, {"pinyinName": auroFileSearchValue}, function(res) {
				if (res.errorCode == 0) {
					var html1 = '<option value="">&nbsp;</option>';
					if (res.autoFillKeyValue != null) {
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

	$("#villageSel").on("change", function(e) {
		if ($("#villageSel").val() == null || $("#villageSel").val() == ""){
			return;
		}
		
		com.post(api.data.queryVillageById, {"village.villageId": $("#villageSel").val()}, function(res) {
			$("#houseNumber").val("");
			com.validator.houseNumber["regex"] = eval("/^"+res.village.buildingNameRule.rule+"$/g");
			com.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+res.village.buildingNameRule.ruleContent+")";
			$("#buildingRuleContent").html("说明："+res.village.buildingNameRule.ruleContent+";eg."+res.village.buildingNameRule.ruleExample);
		});
	});
	$("#villageSel_chosen").css("width", "200px");
	
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

	// village approve: approve-man-select
	$("#vApproveManSel").chosen({
		allow_single_deselect : true
	});
	$("#vApproveManSel_chosen input").bind("input", function() {
		var pinyinName = $(this).val();
		if ($(this).val() != "") {
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin" : pinyinName, "userApprove.type" : 2}, function(res) {
				if (res.errorCode == 0) {
					var html1 = '<option value="">&nbsp;</option>';
					if (res.autoFillKeyValue != null) {
						var i = 0;
						for(i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#vApproveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#vApproveManSel_chosen").css("width", "200px");
	
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
		$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
	});
	
	// ---------------------------------扣款审批
	$("#paymentType").on("change", function(res) {
		for (var i=0;i<decorationPayment.refundType.length;++i) {
			if (decorationPayment.refundType[i].key == $(this).val()) {
				break;
			}
		}
		
		$("#referMoney").val(decorationPayment.refundType[i].money);
		
		decorationOrderDetail.paymentId = decorationPayment.refundType[i].paymentId;
		
		if ($(this).val() != '其他退款') {
			$("#referMoney").attr("disabled", true);
		} else {
			$("#referMoney").attr("disabled", false);
		}
	});

	$("#refundApproveManSel").chosen({
		allow_single_deselect : true
	});
	$("#refundApproveManSel_chosen input").bind("input", function() {
		var pinyinName = $(this).val();
		if ($(this).val() != "") {
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin" : pinyinName, "userApprove.type" : 5}, function(res) {
				if (res.errorCode == 0) {
					var html1 = '<option value="">&nbsp;</option>';
					
					if (res.autoFillKeyValue != null) {
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}

					$("#refundApproveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#refundApproveManSel_chosen").css("width", "200px");
	
	$("#approveActivityItemManSel").chosen({
		allow_single_deselect : true
	});
	$("#approveActivityItemManSel_chosen input").bind("input", function() {
		var pinyinName = $(this).val();
		if ($(this).val() != "") {
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin" : pinyinName, "userApprove.type" : 8}, function(res) {
				if (res.errorCode == 0) {
					var html1 = '<option value="">&nbsp;</option>';
					
					if (res.autoFillKeyValue != null) {
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}

					$("#approveActivityItemManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#approveActivityItemManSel_chosen").css("width", "200px");
	
	$("#approveSpecialActivityItemManSel").chosen({
		allow_single_deselect : true
	});
	$("#approveSpecialActivityItemManSel_chosen input").bind("input", function() {
		var pinyinName = $(this).val();
		if ($(this).val() != "") {
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin" : pinyinName, "userApprove.type" : 8}, function(res) {
				if (res.errorCode == 0) {
					var html1 = '<option value="">&nbsp;</option>';
					
					if (res.autoFillKeyValue != null) {
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}

					$("#approveSpecialActivityItemManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#approveSpecialActivityItemManSel_chosen").css("width", "200px");
	
	initBaseInfo();
});

function basePaymentActionFormatter(cellvalue, options, rowObject) {

	if (rowObject.paymentType == "定金") {
		return "";
	}

	if (rowObject.paymentStatus == '未提交') {
		var result = "";
		
		result += '<div class="ui-pg-div btn-group">';
		if(parseFloat(rowObject.referMoney)!=0){
			result += '<button type="button" class="btn btn-minier btn-yellow" onclick="submintPayment(' + rowObject.autoId + ',\'' + rowObject.paymentType + '\');">提交</button>';
		}
		if(rowObject.paymentType != '首付款' && rowObject.paymentType != '首付二期款' && rowObject.paymentType != '二期款' && rowObject.paymentType != '尾款'){
			result += '<button type="button" class="btn btn-minier btn-yellow" onclick="editPayment(' + rowObject.autoId + ', ' + rowObject.referMoney + ');">修改</button>';
		}
		result += '</div>';

		return result;
	} else if (rowObject.paymentStatus == '未付款') {
		var result = "";
		
		result += '<div class="ui-pg-div btn-group">';
		if(rowObject.paymentType != '首付款' && rowObject.paymentType !='首付二期款' && rowObject.paymentType != '二期款' && rowObject.paymentType != '尾款'){
			result += '<button type="button" class="btn btn-minier btn-yellow" onclick="editPayment(' + rowObject.autoId + ', ' + rowObject.referMoney + ');">修改</button>';
		}
		result += '</div>';

		return result;
	} else {
		return "";
	}
}

function otherPaymentActionFormatter(cellvalue, options, rowObject) {
	if (rowObject.paymentStatus == '未提交') {
		var result = "";
		result += '<div class="ui-pg-div btn-group">';
		if(rowObject.paymentType.search('退款')!=-1){
			if(parseFloat(rowObject.referMoney)!=0){
				result += '<button type="button" class="btn btn-minier btn-yellow" onclick="submintPayment(' + rowObject.autoId + ',\'' + rowObject.paymentType + '\');">提交</button>';
			}
		}else if(rowObject.paymentType == '违约金'){
			if(parseFloat(rowObject.referMoney)!=0){
				result += '<button type="button" class="btn btn-minier btn-yellow" onclick="submintPayment(' + rowObject.autoId + ',\'' + rowObject.paymentType + '\');">提交</button>';
			}
		}
		result += '</div>';

		return result;
	}else if(rowObject.paymentStatus == '申请审批' || rowObject.paymentStatus == '审批未通过'){
		var result = "";
		result += '<div class="ui-pg-div btn-group">';
		result += '<button type="button" class="btn btn-minier btn-yellow" onclick="editRefundPayment(' + rowObject.autoId + ',' + rowObject.referMoney + ',\'' + rowObject.paymentType + '\');">修改</button>';
		result += '</div>';

		return result;
	} else {
		return "";
	}
}

function submintPayment(paymentId,paymentType){
	
	if(!bootboxFlag){
		bootboxFlag = true;
		
		bootbox.confirm("确认要提交" + paymentType + "吗？", function(result){
			if(result){
				com.post(api.payment.submitDecorationPayment, {"decorationPayment.autoId":paymentId}, function(res){
					if(res.errorCode == 0){
						$.jgrid.refreshGrid($("#basePaymentTable"), decorationPayment.postParam);
						$.jgrid.refreshGrid(decorationPayment.otherPaymentGrid, decorationPayment.postParam);
						decorationOrderDetail.quotationTotalPriceModal.modal("hide");
					} else {
						bootbox.alert("系统出错");
					}
				});
			}
			bootboxFlag = false;
		});
	}
}

function editPayment(paymentId, oldmoney) {

	com.clearValidator();
	
	decorationOrderDetail.decorationPaymentId = paymentId;
	
	decorationPayment.editFlag = 1;
	decorationPayment.decorationPayment.val(oldmoney);
	
	decorationOrderDetail.decorationPaymentModal.modal("show");
}

function editRefundPayment(paymentId, oldmoney, paymentType) {

	decorationPayment.editFlag = 2;
	com.clearValidator();
	
	com.post(api.payment.queryBaseConfirmDecorationPaymentsByOrderId, decorationPayment.postParam, function(res){
		decorationPayment.refundType = [{"key":"其他退款", "value":"其他退款", "money":""}];
		decorationPayments = res.decorationPayments;
		
		for(var i=0;i<decorationPayments.length;++i){
			var _ = {"key":decorationPayments[i].paymentType+"退款","value":decorationPayments[i].paymentType+"退款","money":decorationPayments[i].paymentBlance};
			decorationPayment.refundType.push(_);
		}
		
		$("#paymentType").bindData(decorationPayment.refundType, 'key', 'value');
		
		$("#refundApprove").removeClass("hide");
		$("#paymentType").attr("disabled",false);
		$("#referMoney").attr("disabled",false);
		$("#changeReason").addClass("v_required");
		$("#refundApproveManSel").addClass("v_required");
		$("#autoId").val(paymentId);
		$("#referMoney").val(oldmoney);
		$("#paymentType").val(paymentType);
		
		if($("#paymentType").val()==null){
			$("#paymentType").prepend("<option value='"+paymentType+"'>"+paymentType+"</option>");
			$("#paymentType").val(paymentType);
		}
		
		$("#paymentType").attr("disabled",true);
		if($("#paymentType").val() != '其他退款'){
			$("#referMoney").attr("disabled",true);
		}else{
			$("#referMoney").attr("disabled",false);
		}
		
		decorationOrderDetail.refundDecorationPaymentModal.modal("show");
	});
}

// -------------------------------------------------------------------------------初始化-
// initWizard------------------
function initWizard() {
	$('#fuelux-wizard').ace_wizard({"status": true}).on('change', function(e, info) {
		
		if (info.step == 2 && info.direction === "previous") {
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide");
		} else {
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		}
		
		if ((info.step == 3 && info.direction === "previous") || (info.step == 1 && info.direction === "next")) {
			loadQuotationDetail(decorationOrderDetail["quotation.autoId"]);
		}

		if ((info.step == 4 && info.direction === "previous") || (info.step == 2 && info.direction === "next")) {
			initDecorationPicture();
			initCADPicture();
		}
		
		if ((info.step == 5 && info.direction === "previous") || (info.step == 3 && info.direction === "next")) {
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}

		if ((info.step == 6 && info.direction === "previous") || (info.step == 4 && info.direction === "next")) {
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, activityBtnMethod, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, uiBtnMethod, decorationOrderDetail.decorationOrderId);
		}
		
		if (info.step == 6 && info.direction === "next") {
			decorationUtils.initOrderBelongInfo(decorationOrderDetail.decorationOrderId);
		}
		
	}).on('finished', function(e) {
		$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
		//$("#drawLineModal").modal("show");
		
	}).on('stepclick', function(e,info){
		
		if(info.step == 1){
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide");
		}else{
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		}
		
		if (info.step == 2) {
			loadQuotationDetail(decorationOrderDetail["quotation.autoId"]);
		} else if (info.step == 3) {
			initDecorationPicture();
			initCADPicture();
		}else if (info.step == 4){
			setTimeout(decorationUtils.materialPaymentListGridInit, 50);
		}else if (info.step == 5) {
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, activityBtnMethod, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, uiBtnMethod, decorationOrderDetail.decorationOrderId);
		}else if(info.step == 7){
			decorationUtils.initOrderBelongInfo(decorationOrderDetail.decorationOrderId);
		}
	}).on('next', function(e, info) {
		if (info.step == 1) {
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide");
		} else {
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		}
	}).on('previous', function(e, info) {
		if (info.step == 1) {
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide");
		} else {
			decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide");
		}
	});
}
// --------------------------------------------------------------------基本信息--------------------------------------------------------------
function initBaseInfo() {
	com.post(api.decoration.queryDecorationOrderForDesignerByOrderId, {"decorationOrder.orderId" : decorationOrderDetail.decorationOrderId}, function(res) {
		decorationOrderDetail.mediaServer = window.mediaServer;
		
		initUploadify();
		
		if(res.decorationOrder.status == "咨询" || res.decorationOrder.status=="量房" || res.decorationOrder.status=="已报价" || res.decorationOrder.status=="定金"){
			$("#houseType").prop("disabled", false);
		}else{
			if (res.decorationOrder.status == "已签约") {
				$("#houseType").prop("disabled", true);
			} else {
				$("#houseType").prop("disabled", false);
			}
		}
		
		$("#orderId").val(res.decorationOrder.orderId);
		$("#customer").val(res.decorationOrder.customer.customerName);
		$("#houseAddr").val(res.decorationOrder.village.villageName + res.decorationOrder.houseNumber);
		$("#designDepartment").val(res.decorationOrder.designDepartment);
		$("#designer").val(res.decorationOrder.designer);
		$("#businessDepartment").val(res.decorationOrder.businessDepartment);
		$("#salesman").val(res.decorationOrder.salesman);
		$("#houseType").val(res.decorationOrder.houseType);
		$("#houseClass").val(res.decorationOrder.houseClass);
		$("#houseArea").val(res.decorationOrder.houseArea);
		$("#freeArea").val(res.decorationOrder.freeArea);
		$("#status").val(res.decorationOrder.status);
		$("#createTime").val(res.decorationOrder.createTime);
		
		$("#backOrderName").val(res.decorationOrder.backOrderName);
		$("#backOrderPhone").val(res.decorationOrder.backOrderPhone);
		$("#backOrderContent").val(res.decorationOrder.backOrderContent);
		
		$("#notSalesmanName").val(res.decorationOrder.notSalesmanName);
		$("#notSalesmanPhone").val(res.decorationOrder.notSalesmanPhone);
		$("#notSalesmanRate").val(res.decorationOrder.notSalesmanRate);
		$("#notSalesmanContent").val(res.decorationOrder.notSalesmanContent);
		
		$("#salesmanType").val(res.decorationOrder.salesmanType);

        $("#houseType").prop("disabled", true);
        $("#houseClass").prop("disabled", true); 
        $("#houseArea").prop("disabled", true);
        $("#freeArea").prop("disabled", true);
        
        decorationOrderDetail.customer.id = res.decorationOrder.customer.id;
		decorationOrderDetail.customer.phone = res.decorationOrder.customer.phone;
		decorationOrderDetail.customer.qq = res.decorationOrder.customer.qq;
		decorationOrderDetail.customer.wechat = res.decorationOrder.customer.wechat;
		decorationOrderDetail.customer.email = res.decorationOrder.customer.email;
		decorationOrderDetail.customer.relationshipType = res.decorationOrder.customer.relationshipType;
		decorationOrderDetail.customer.approveStatus = res.decorationOrder.customer.approveStatus;
		decorationOrderDetail.village.villageId = res.decorationOrder.village.villageId;
		decorationOrderDetail.village.villageName = res.decorationOrder.village.villageName;
		decorationOrderDetail.village.houseNumber = res.decorationOrder.houseNumber;
		decorationOrderDetail.village.ruleExample = res.decorationOrder.village.buildingNameRule.ruleExample;
		decorationOrderDetail.village.ruleContent = res.decorationOrder.village.buildingNameRule.ruleContent;
		decorationOrderDetail.village.rule = res.decorationOrder.village.buildingNameRule.rule;
	});
	
	var options = {
		"quotation.orderId": decorationOrderDetail.decorationOrderId,
	};
	
	//-----初始化报价列表---------------------
	com.post(api.quotation.queryQuotationForDefaultByOrderId, options, function(res){
		if(res.errorCode == 0){
			decorationOrderDetail["quotation.autoId"] = res.quotation.autoId;
		}
	});

	// -----------------------初始化款项信息-----------
	decorationUtils.initBasePayment(decorationPayment.postParam, basePaymentActionFormatter, '#decorationOrderDetailDesignerPageContent');
	decorationUtils.initOtherPayment(decorationPayment.postParam, otherPaymentActionFormatter, '#decorationOrderDetailDesignerPageContent');
	
	if(decorationOrderDetail.firstInit==undefined || decorationOrderDetail.firstInit == true){
		initWizard();
		decorationOrderDetail.firstInit = false;
	}
}

function saveBaseDecorationOrderInfo() {
	if (com.validate("step1")) {
		return;
	}

	var btn = $("#btnSaveBaseDecorationOrderInfo");
	btn.button('loading');

	bootbox.confirm("确定要保存基本信息吗?", function(result) {
		if (result) {
			var options = {
				"decorationOrder.orderId" : decorationOrderDetail.decorationOrderId,
				"decorationOrder.houseType" : $("#houseType").val(),
				"decorationOrder.houseClass" : $("#houseClass").val(),
				"decorationOrder.houseArea" : $("#houseArea").val(),
				"decorationOrder.freeArea" : $("#freeArea").val()
			};

			com.post(api.decoration.changeDecorationOrderForActivity, options, function(res) {
				com.showAlert(com.info, "操作成功");
				initBaseInfo();
				btn.button('reset');
			}, function(res) {
				btn.button('reset');
			});
		} else {
			btn.button('reset');
		}
	});
}

// --------------------------------------------------------------图纸信息-----------------------
function initUploadify() {
	if (decorationOrderDetail.firstInitUploadify != undefined && !decorationOrderDetail.firstInitUploadify) {
		return;
	}

	decorationOrderDetail.firstInitUploadify = false;
	$("#pictureUpload").Huploadify({
		'debug' : false, // 开启调试
		'auto' : true, // 是否自动上传
		'successTimeout' : 150, // 超时时间
		'formData' : { // 附带值
			'uploadType' : 2
		},
		//'swf': "./js/uploadify/uploadify.swf", // flash
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        //'queueID': 'uploadfileQueue', // 文件选择后的容器ID
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': decorationOrderDetail.mediaServer + api.common.uploadImg.url, // 上传处理程序
        //'buttonImage':'upbutton.gif', // 浏览按钮的背景图片路径
        'width':'100', // 浏览按钮的宽度
        'height': '32', // 浏览按钮的高度
        //'expressInstall': 'expressInstall.swf', // expressInstall.swf文件的路径
        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit':'5MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
        	//每次更新上载的文件的进展
            //有时候上传进度什么想自己个性化控制，可以利用这个方法
            //使用方法见官方说明
        }, 'onSelect': function(file){ //选择上传文件后调用
            
        }, 'onSelectError':function(file, errorCode, errorMsg){ // 返回一个错误，选择文件的时候触发
            switch(errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"+$('#pictureUpload').uploadify('settings','queueSizeLimit')+"个文件！");
                    break;
                case -110:
                    alert("文件 ["+file.name+"] 大小超出系统限制的"+$('#pictureUpload').uploadify('settings','fileSizeLimit')+"大小！");
                    break;
                case -120:
                    alert("文件 ["+file.name+"] 大小异常！");
                    break;
                case -130:
                    alert("文件 ["+file.name+"] 类型不正确！");
                    break;
            }
        },
        
        //'onFallback':function(){ // 检测FLASH失败调用
        //    alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
        //},
        'onUploadSuccess':function(file, data, response){ // 上传到服务器，服务器返回相应信息到data里
        	var dateObj = eval("("+data+")");
        	
        	if(dateObj.errorCode == 0){
        		 bootbox.prompt("请输入备注：", function(result) {                
					if(result === null){

					}else{
						var options = {
							"orderDesignPicture.picturePath": dateObj.resUrl,
							"orderDesignPicture.uploadFileName": dateObj.strutsUploadsFileName,
							"orderDesignPicture.pictureContent": result,
							"orderDesignPicture.orderId": decorationOrderDetail.decorationOrderId
						};
						
						com.post(api.decoration.addOrderDesignPicture, options, function(res) {
							if (res.errorCode == 0) {
								com.showAlert(com.info, "操作成功");
								initDecorationPicture();
							} else {
								com.showAlert( com.info, res.errorMsg);
							}
						});
					}
				});
			}else{
				alert(data);
			}
		}
	});

	$("#CADUpload").Huploadify({
		'debug': false, // 开启调试
		'auto': true, // 是否自动上传
		'successTimeout': 150, // 超时时间
		'formData': { // 附带值
			'uploadType':1
		},
		//'swf': "./js/uploadify/uploadify.swf", // flash
        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
        //'queueID': 'uploadfileQueue', // 文件选择后的容器ID
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': decorationOrderDetail.mediaServer + api.common.uploadOther.url, // 上传处理程序
        //'buttonImage': 'upbutton.gif', // 浏览按钮的背景图片路径
        'width': '100', // 浏览按钮的宽度
        'height': '32', // 浏览按钮的高度
        //'expressInstall': 'expressInstall.swf', // expressInstall.swf文件的路径
        'fileTypeDesc': '支持的格式:', //在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts': '*.dwt', // 允许上传的文件后缀
        'fileSizeLimit': '5MB', // 上传文件的大小限制
        'queueSizeLimit': 1, // 上传数量
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
        	//每次更新上载的文件的进展
            //有时候上传进度什么想自己个性化控制，可以利用这个方法
            //使用方法见官方说明
        }, 'onSelect': function(file) { // 选择上传文件后调用
                  
        }, 'onSelectError': function(file, errorCode, errorMsg){ // 返回一个错误，选择文件的时候触发
            switch(errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"+$('#CADUpload').uploadify('settings','queueSizeLimit')+"个文件！");
                    break;
                case -110:
                    alert("文件 ["+file.name+"] 大小超出系统限制的"+$('#CADUpload').uploadify('settings','fileSizeLimit')+"大小！");
                    break;
                case -120:
                    alert("文件 ["+file.name+"] 大小异常！");
                    break;
                case -130:
                    alert("文件 ["+file.name+"] 类型不正确！");
                    break;
            }
        }, 'onFallback': function(){ // 检测FLASH失败调用
            alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
        }, 'onUploadSuccess': function(file, data, response){ //上传到服务器，服务器返回相应信息到data里
        	var dateObj = eval("("+data+")");
        	if(dateObj.errorCode == 0){
        		 bootbox.prompt("请输入备注:", function(result) {                
					if (result === null) {

					} else {
						var options = {
							"orderDesignPicture.picturePath" : dateObj.resUrl,
							"orderDesignPicture.uploadFileName" : dateObj.strutsUploadsFileName,
							"orderDesignPicture.pictureContent" : result,
							"orderDesignPicture.orderId" : decorationOrderDetail.decorationOrderId
						};
						
						com.post(api.decoration.addOrderDesignPictureForCAD, options, function(res) {
							if (res.errorCode == 0) {
								com.showAlert(com.info, "操作成功");
								initCADPicture();
							} else {
								com.showAlert(com.info, res.errorMsg);
							}
						});
					}
				});
			} else {
				alert(data);
			}
		}
	});
}

function initDecorationPicture() {

	com.post(api.decoration.queryOrderDesignPictureByOrderId, {"orderDesignPicture.orderId" : decorationOrderDetail.decorationOrderId}, function(res) {
		var html = "";
		var i = 0;
		if(res.orderDesignPictures!=null && res.orderDesignPictures.length>0){
			for(i=0;i<res.orderDesignPictures.length;++i){
				html+='<li>';
				html+='<a data-rel="colorbox" href="'+decorationOrderDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+res.orderDesignPictures[i].picturePath+'" class="cboxElement" target="_blank">';
				html+='		<img src="'+decorationOrderDetail.mediaServer + api.common.showImg.url + '?imgBasePath='+res.orderDesignPictures[i].picturePath+'&divFlag=1&width=200&height=200" alt="200x200" width="200" height="200">';
				html+='</a>';
				
				html+='<div class="tools tools-top">';
				//html+='		<a href="#"><i class="icon-link"></i></a>';
				html+='		<label>'+res.orderDesignPictures[i].uploadFileName+'</label>';
				html+='		<a href="'+decorationOrderDetail.mediaServer + api.common.downloadFile.url + '?downloadFilePath='+res.orderDesignPictures[i].picturePath+'&fileName='+res.orderDesignPictures[i].uploadFileName+'" target="_blank"><i class="icon-download-alt"></i></a>';
				html+='		<a href="javascript:void(0);" onclick="deleteOrderImg('+res.orderDesignPictures[i].autoId+','+decorationOrderDetail.decorationOrderId+')"><i class="icon-remove red"></i></a>';
				html+='</div>';
				html+='</li>';
			}
			$("#designPictures").html(html);
		} else {
			$("#designPictures").html("");
		}
	});
}

function initCADPicture() {
	com.post(api.decoration.queryOrderDesignPictureForCADByOrderId, {"orderDesignPicture.orderId" : decorationOrderDetail.decorationOrderId}, function(res) {
		var i = 0;
		if(res.orderDesignPictures!=null&& res.orderDesignPictures.length>0){
			var html ="";
			for(i=0;i<res.orderDesignPictures.length;++i){
				html+='<div class="infobox infobox-blue infobox-small infobox-dark">';
				html+='	<div class="infobox-icon">';
				html+=" <a class='icon-download-alt' href='"+decorationOrderDetail.mediaServer + api.common.downloadFile.url + "?downloadFilePath="+res.orderDesignPictures[i].picturePath+"&fileName="+res.orderDesignPictures[i].uploadFileName+"' target='_blank'> <i class=''></i></a>";
				html+='</div>';
	
				html+='	<div class="infobox-data">';
				html+='		<div class="infobox-content">'+res.orderDesignPictures[i].uploadFileName+'</div>';
				//html+='		<div class="infobox-content">$32,000</div>';
				html+='	</div>';
				html+='<a  href="javascript:void(0);" onclick="deleteOrderCAD('+res.orderDesignPictures[i].autoId+','+decorationOrderDetail.decorationOrderId+')" class="badge"><i class="icon-remove red"></i></a>';
				html+='</div>';
			}
			$("#CADProjectPicture").html(html);
		} else {
			$("#CADProjectPicture").html("");
		}
	});
}

function deleteOrderImg(autoId, decorationOrderId) {
	bootbox.confirm("确认要删除吗？", function(res) {
		if (res) {
			var options = {
				"orderDesignPicture.autoId" : autoId,
				"decorationOrderId" : decorationOrderId
			};
			com.post(api.decoration.deleteOrderDesignPictureByIdAndOrderId, options, function(res) {
				if (res.errorCode == 0) {
					com.showAlert(com.info, "操作成功");
					initDecorationPicture();
				} else {
					com.showAlert(com.info, res.errorMsg);
				}
			});
		}
	});
}

function deleteOrderCAD(autoId, decorationOrderId) {
	bootbox.confirm("确认要删除吗？", function(res) {
		if (res) {
			var options = {
				"orderDesignPicture.autoId" : autoId,
				"decorationOrderId" : decorationOrderId
			};
			com.post(api.decoration.deleteOrderDesignPictureByIdAndOrderId, options, function(res) {
				if (res.errorCode == 0) {
					com.showAlert(com.info, "操作成功");
					initCADPicture();
				} else {
					com.showAlert(com.info, res.errorMsg);
				}
			});
		}
	});
}

function downloadFile(picturePath, uploadFileName) {
	window.open(decorationOrderDetail.mediaServer + api.common.downloadFile.url + "?downloadFilePath=" + picturePath + "&fileName=" + uploadFileName);
}

// ------------------------------------------------------------------报价信息----------------------------------------------

function calQuotationDetailSum() {
	var temQuotationDetail = decorationOrderDetail.quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;

	var totalPrice = 0; // 总价
	var normalPrice = 0; // 正常价格
	var discountPrice = 0; // 打折
	var noDiscountTotalPrice = 0; // 不打折
	var carManagePrice = 0; // 车运费
	var managePrice = 0; // 管理费

	var carManageFunctionAreaIndex = -1;
	var manageFunctionAreaIndex = -1;
	var carManageItemIndex = -1;
	var manageItemIndex = -1;

	decorationOrderDetail.quotationDetail.manageRate = 0;
	decorationOrderDetail.quotationDetail.carManageRate = 0;

	for (var i = 0; i < functionAreas.length; ++i) {
		functionAreas[i].sum = 0;
		if (functionAreas[i].functionAreaType == '普通') { // 参与打折
			var sum = 0;
			var preDiscountSum = 0;

			for ( var j = 0; j < functionAreas[i].items.length; j++) {
				functionAreas[i].items[j].discountUnitPrice = Math.round((parseFloat(functionAreas[i].items[j].unitPrice) * decorationOrderDetail.quotationDetail.discount / 10) * 100) / 100;
				functionAreas[i].items[j].sum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice) * decorationOrderDetail.quotationDetail.discount * parseFloat(functionAreas[i].items[j].num) / 10) * 100) / 100;
				sum += functionAreas[i].items[j].sum;
				preDiscountSum += Math.round((parseFloat(functionAreas[i].items[j].unitPrice) * parseFloat(functionAreas[i].items[j].num)) * 100) / 100;
			}

			functionAreas[i].sum = sum;
			normalPrice += preDiscountSum;
			discountPrice += sum;
			totalPrice += sum;
		} else {
			var sum = 0;
			for ( var j = 0; j < functionAreas[i].items.length; j++) {
				if (((functionAreas[i].items[j].itemName.search('车运费') == -1) && (functionAreas[i].items[j].itemName.search('管理费') == -1))) {// 不打折
					functionAreas[i].items[j].sum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice) * parseFloat(functionAreas[i].items[j].num)) * 100) / 100;
					sum += functionAreas[i].items[j].sum;
				} else if ((functionAreas[i].items[j].itemName.search('车运费') != -1)) {
					decorationOrderDetail.quotationDetail.carManageRate = functionAreas[i].items[j].unitPrice;
					carManageFunctionAreaIndex = i;
					carManageItemIndex = j;
				} else if ((functionAreas[i].items[j].itemName.search('管理费') != -1)) {
					functionAreas[i].items[j].unitPrice = parseFloat(functionAreas[i].items[j].unitPrice) + parseFloat(decorationOrderDetail.quotationDetail.notSalesmanRate);
					decorationOrderDetail.quotationDetail.manageRate = functionAreas[i].items[j].unitPrice;
					manageFunctionAreaIndex = i;
					manageItemIndex = j;
				}
				functionAreas[i].items[j].discountUnitPrice = Math.round(parseFloat(functionAreas[i].items[j].unitPrice) * 100) / 100;

			}

			functionAreas[i].sum = sum;
			noDiscountTotalPrice += sum;
			totalPrice += sum;
		}
	}

	var commonPrice = discountPrice + noDiscountTotalPrice;
	var preDiscountCommonPrice = normalPrice + noDiscountTotalPrice;
	
	carManagePrice = Math.round(((preDiscountCommonPrice)*parseFloat(decorationOrderDetail.quotationDetail.carManageRate))*100)/100;
	
//	if( parseFloat(decorationOrderDetail.quotationDetail.limitCarManagePrice) > carManagePrice){
//		carManagePrice =  Math.round(parseFloat(decorationOrderDetail.quotationDetail.limitCarManagePrice)*100)/100;
//	}
	
	if(carManageFunctionAreaIndex!=-1){
		preDiscountCommonPrice += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].sum += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].items[carManageItemIndex].sum = carManagePrice;
		totalPrice += carManagePrice;
	}
	
	managePrice = Math.round(((preDiscountCommonPrice)*parseFloat(decorationOrderDetail.quotationDetail.manageRate))*100)/100;

	if (manageFunctionAreaIndex != -1) {
		functionAreas[manageFunctionAreaIndex].sum += managePrice;
		functionAreas[manageFunctionAreaIndex].items[manageItemIndex].sum = managePrice;
		totalPrice += managePrice;
	}

	var otherItems = temQuotationDetail.otherItems;
	
	for (var i=0;i<otherItems.length;++i) {

		var tem  = 0;
		//0 增项 1 减项 2 漏项 
		//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
		if(otherItems.itemType=='增项'||otherItems.itemType=='扣款' ||otherItems.itemType=='特批'){//增项漏项不打折
			
			tem = Math.round((parseFloat(otherItems[i].unitPrice)*parseFloat(otherItems[i].num))*100)/100;
			otherItems[i].discountUnitPrice = Math.round((parseFloat(otherItems[i].unitPrice)*decorationOrderDetail.quotationDetail.discount)*100)/100;
			otherItems[i].sum = tem;
			
			noDiscountTotalPrice +=tem;
			
			totalPrice+=tem;
			
		}else {//减项
			if((otherItems[i].itemType=='减项' && 
						(otherItems[i].quotationClassificationId == '3'
							|| otherItems[i].quotationClassificationId == '4'
							|| otherItems[i].quotationClassificationId == '5'
						)
					)
				){//减项的一次性包死 综合项目 管理费 不打折
					tem = Math.round((parseFloat(otherItems[i].unitPrice)*parseFloat(otherItems[i].num))*100)/100;
					otherItems[i].discountUnitPrice = Math.round((parseFloat(otherItems[i].unitPrice))*100)/100;
					otherItems[i].sum =tem;
					
					noDiscountTotalPrice +=tem;
					totalPrice+=tem;
				}else{
					tem = Math.round(parseFloat(otherItems[i].unitPrice)*decorationOrderDetail.quotationDetail.discount*parseFloat(otherItems[i].num)/10*100)/100;
					otherItems[i].discountUnitPrice = Math.round((parseFloat(otherItems[i].unitPrice)*decorationOrderDetail.quotationDetail.discount/10)*100)/100;
					otherItems[i].sum = tem;
					
					discountPrice +=tem;
					totalPrice+=tem;
				}
		}

		var j = 0;
		for (j = 0; j < functionAreas.length; ++j) {
			if (functionAreas[j].functionAreaId == otherItems[i].functionAreaId) {
				functionAreas[j].sum += tem;
				break;
			}
		}
	}
	
	temQuotationDetail.totalPrice = Math.round(totalPrice*100)/100;//总价
	temQuotationDetail.discountPrice =  Math.round(discountPrice*100)/100;//打折
	temQuotationDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice*100)/100;//不打折
	temQuotationDetail.carManagePrice =  Math.round(carManagePrice*100)/100;//车运费
	temQuotationDetail.managePrice =  Math.round(managePrice*100)/100;//管理费
	
	temQuotationDetail.userdata = {};
	temQuotationDetail.userdata.num="总价:";
	temQuotationDetail.userdata.sum = Math.round(temQuotationDetail.totalPrice*100)/100;
	
	console.log("cal total:",temQuotationDetail);
}

function initQuotationDetailItem() {
	decorationOrderDetail.decorationOrderQuotationItemData = [];

	var temQuotationDetail = decorationOrderDetail.quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;

	for (var i=0;i<functionAreas.length;++i) {
		for ( var j = 0; j < functionAreas[i].items.length; j++) {
			var item = functionAreas[i].items[j];
			var tem = {};
			tem.itemName = item.itemName;
			tem.itemId = item.itemId;
			tem.functionAreaName = functionAreas[i].functionAreaName;
			tem.workType = item.workType;
			tem.measurementUnit = item.measurementUnit;
			tem.unitPrice = item.unitPrice;
			tem.discountUnitPrice = item.discountUnitPrice;
			tem.num = item.num;
			tem.sum = item.sum;
			tem.quotationItemDes = item.quotationItemDes;
			tem.itemType = item.itemType;

			decorationOrderDetail.decorationOrderQuotationItemData.push(tem);
		}
	}

	var otherItems = temQuotationDetail.otherItems;

	for (var i=0;i<otherItems.length;++i) {
		var item = otherItems[i];
		var tem = {};
		tem.itemName = item.itemName;
		tem.itemId = item.itemId;
		tem.functionAreaName = item.functionAreaName;
		tem.measurementUnit = item.measurementUnit;
		tem.unitPrice = item.unitPrice;
		tem.discountUnitPrice = item.discountUnitPrice;
		tem.num = item.num;
		tem.sum = item.sum;
		tem.quotationItemDes = item.quotationItemDes;
		tem.itemType = item.itemType;
		tem.workType = item.workType;

		decorationOrderDetail.decorationOrderQuotationItemData.push(tem);
	}
}

function loadQuotationDetail(quotationAutoId) {
	
	if(quotationAutoId){
		$("#printProjectBtn").attr('href', api.index.quotationListIndex.url + "?quotationDetail.autoId=" + quotationAutoId + "&type=1");
		$("#printFinanceBtn").attr('href', api.index.quotationListIndex.url + "?quotationDetail.autoId=" + quotationAutoId + "&type=2");
		$("#printCustomerBtn").attr('href', api.index.quotationListIndex.url + "?quotationDetail.autoId=" + quotationAutoId + "&type=3");
		
		com.post(api.quotation.queryQuotationDetailForAllInfoById, {"quotationDetail.autoId": quotationAutoId}, function(res){
			if(res.errorCode == 0){
				decorationOrderDetail.quotationDetail = res.quotationDetail;
				
				calQuotationDetailSum(); //计算总值
				initQuotationDetailItem(); // 初始化 数据initQuotationDetailItem
				decorationUtils.initQuotationDetailItemGroupByJob(decorationOrderDetail.quotationDetail);
				
				$("#showWay").on("change", function() {
					initQuotationDetail();
				});
				
				initQuotationDetail();
			}else{
				bootbox.alert("操作失败");
			}
		});
	}else{
		$("#btnPrintDefaultQuotationInfo").attr("disabled", "disabled");
	}
}

function initQuotationDetail() {

	var _data = decorationOrderDetail.decorationOrderQuotationItemData;
	var _groupField = [ 'functionAreaName' ];
	if ($("#showWay").val() == 0) {
		_data = decorationOrderDetail.decorationOrderQuotationItemData;
		_groupField = [ 'functionAreaName' ];
	} else {
		_data = decorationOrderDetail.decorationOrderQuotationItemGroupByJob;
		_groupField = [ 'workType' ];
	}

	$grid = $('<table id="quotationItemListGrid"></table><div id="quotationItemGridPager"></div>');
	$('#quotationItemListDiv').empty().html($grid);
	$("#quotationItemListGrid").jqGrid({
		data: _data, 
		datatype: "local",
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:['编号', '名称', '功能区', '项目类型', '工种', '单位', '单价', '折后单价', '数量', '总价', '工艺说明'],
		colModel:[
			{name:"itemId"},
			{name:"itemName", width:400, summaryType:'count', summaryTpl:'<b class="blue">共{0}项</b>'},
			{name:'functionAreaName'},
			{name:"itemType"},
			{name:'workType'},
			{name:"measurementUnit"},
			{name:"unitPrice"},
			{name:"discountUnitPrice"},
			{name:"num"},
			{name:"sum", formatter:"number", summaryType:'sum'},
			{name:"quotationItemDes",formatter:quotationItemDesFormatter,unformat:quotationItemDesUnformat}
		], 
		pager: "#quotationItemGridPager" ,
		rowNum:200,
		rowList:[50,100,200],
		grouping: true,
	   	groupingView: {
	   		groupField: _groupField,
	   		groupColumnShow: [true],
	   		groupText: ['<b>{0}</b>'],
	   		groupCollapse : false,
			groupOrder: ['asc'],
			groupSummary: [true],
			showSummaryOnHide: true,
			groupDataSorted: true
	   	},
	   	userData:decorationOrderDetail.quotationDetail.userdata,
	    footerrow: true,
	    userDataOnFooter: true
	});
		
	$("#quotationItemListGrid").navGrid("#quotationItemGridPager", {edit: false, add: false, del: false, search: false});

	$('[data-rel="tooltip"]').tooltip({container:'#decorationOrderDetailDesignerPageContent'});
	$('.ui-widget-content.footrow.footrow-ltr').addClass("red");
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.quotationItemDes+'">工艺</span>';
	html += "<input type='text' class='hide' value='"+rowObject.quotationItemDes+"' />";
	return html;
}

function quotationItemDesUnformat(cellvalue, options, cell) {
	return $('input', cell).val();
}

function activityBtnMethod(uiPgDiv, decorationActivity){
	
	var deleteBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "delete_" + decorationActivity.daId).appendTo(uiPgDiv);
	
	deleteBtn.on("click", function(){
		deleteDecorationActivity(decorationActivity.daId);
	});
}

function uiBtnMethod(uiPgDiv, activityItem){
	
	if(activityItem.type == 1){
		var convertBtn = $("<span></span>").addClass("ui-icon icon-exchange").attr("id", "convert_" + activityItem.daiId).appendTo(uiPgDiv);
	}
	var abateBtn = $("<span></span>").addClass("ui-icon icon-ban-circle red").attr("id", "abate_" + activityItem.daiId).appendTo(uiPgDiv);

	if(activityItem.state == 0){
		if(activityItem.type == 1){
			convertBtn.on("click", function(){
				convertDecorationActivityItem(activityItem);
			});
		}
		
		abateBtn.on("click", function(){
			abateDecorationActivityItem(activityItem.daiId, activityItem.activityItemName);
		})
	}
}

function deleteDecorationActivity(daId){
	
	var options = {
		"decorationActivity.daId": daId,
	}
	
	console.log(options);
	
	com.post(api.decoration.deleteDecorationActivity, options, function(res){
		console.log("dactivity_" + res.decorationActivity.daId);
		console.log($("dactivity_" + res.decorationActivity.daId));
		$("#dactivity_" + res.decorationActivity.daId).remove();
	});
}

function convertDecorationActivityItem(activityItem){
	
	decorationOrderDetail.convertActivityItemId = activityItem.daiId;
	
	decorationOrderDetail.activity.convertActivityItemName.val(activityItem.activityItemName);
	decorationOrderDetail.activity.convertActivityItemMoney.val(0);
	
	decorationOrderDetail.convertDecorationActivityItemModal.modal("show");
}

function abateDecorationActivityItem(daiId, activityItemName){
	
	bootbox.confirm("是否确认失效" + activityItemName + "活动物品?", function(result) {
		if(result){
			
			var options = {
				"decorationActivityItem.daiId": daiId,
			}
			
			com.post(api.decoration.abateDecorationActivityItem, options, function(res){
				
				var daiId = res.decorationActivityItem.daiId;
				
				$("#convert_" + daiId).unbind();
				$("#abate_" + daiId).unbind();
				$("#widgetHeader_" + daiId).addClass("header-color-grey");
			})
		}
	});
}