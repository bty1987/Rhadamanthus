
var decorationOrderDetail = {
	decorationOrderId : null,
	orderType:"",

	type:{
		"半包":0,
		"全包":1,
		"半价":2,
	},

	decorationOrder: {},
	customer: {},
	village: {},
	versionId: "",
	notSalesmanRate: "",
	materialPaymentListGrid: null,
	materialPaymentGridPager: null,

	quotations: null,
	quotationDetail: {},

	reloadFlag: 0,

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

	editFlag: 0,
};

var bootboxFlag = false;

var approveData = {};

jQuery(function($) {

	decorationUtils.init();
	
	decorationOrderDetail.decorationOrderId = decorationOrderPostData.decorationOrderId;
	decorationOrderDetail.orderType = decorationOrderPostData.orderType;
	decorationOrderDetail.versionId = decorationOrderPostData.versionId;
	decorationOrderDetail.notSalesmanRate = decorationOrderPostData.notSalesmanRate;

	decorationPayment.postParam.decorationOrderId = decorationOrderDetail.decorationOrderId;
	decorationPayment.postParam["decorationPayment.orderId"] = decorationOrderDetail.decorationOrderId;
	
	decorationOrderDetail.btnSaveBaseDecorationOrderInfo = $("#btnSaveBaseDecorationOrderInfo").on("click", saveBaseDecorationOrderInfo);

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
		
		$this.val() == 0 ? decorationOrderDetail.activity.couponInfo.css("display", "block") : decorationOrderDetail.activity.couponInfo.css("display", "none");
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
	
	decorationOrderDetail.otherPaymentType = $("#otherPaymentType");
	decorationOrderDetail.otherPayment = $("#otherPayment");

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
	decorationOrderDetail.otherPaymentModal = $("#otherPaymentModal");
	
	com.initChosen('refundApproveManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type" : 5}, "autoFillKeyValue", "key", "value");
	com.initChosen('approveActivityItemManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type" : 8}, "autoFillKeyValue", "key", "value");
	com.initChosen('approveSpecialActivityItemManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type" : 8}, "autoFillKeyValue", "key", "value");
	com.initChosen('approveManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type" : 1}, "autoFillKeyValue", "key", "value");
	com.initChosen('vApproveManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type" : 2}, "autoFillKeyValue", "key", "value");
	com.initChosen('villageSel', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", 'key', 'value').on('change', function(e){
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
	com.post(api.ds.decorationInfo,{},function (res) {
		$('#houseClass').bindData(res.houseClass,"key","value");

	});

	if(decorationOrderDetail.orderType == decorationOrderDetail.type["半价"]){
		decorationUtils.initDecorationHolonomy('step6',decorationOrderDetail.decorationOrderId);
	}


	$("#btnPrintDefaultQuotationInfo").on('click', function(res) {
		decorationOrderDetail.printQuotationModal.modal("show");
	});

	$("#btnSetDecorationPaymentInfo").on('click', function(res) {
		com.clearValidator();

		com.post(api.ds.decorationInfo,{},function (res) {
			$('#decorationOrderDiscount').bindData(res.machingType,"key","value");

		});

		$("#decorationOrderTotalMoney").val("");
		
		if(decorationOrderDetail.orderType == decorationOrderDetail.type["半价"]){
			$('#forDiscount').removeClass('hide');
		}

		decorationOrderDetail.quotationTotalPriceModal.modal("show");
		
	});
	
	$("#btnRebackPayment").on('click', function(res){
		decorationPayment.editFlag = 0;
		com.clearValidator();
		com.post(api.payment.queryDecorationPaymentForBaseByOrderId, decorationPayment.postParam, function(res){
			decorationPayment.refundType = [{"key":"", "value":"", "money":0}];
			decorationPayments = res.decorationPayments;

			var options = {};
			
			for(var i=0;i<decorationPayments.length;++i){
				
				var _decorationPayment = decorationPayments[i];
				
				if(_decorationPayment.paymentStatus != "已确认") continue;
				
				var option = {"key":_decorationPayment.paymentType + "退款", "value":_decorationPayment.paymentType + "退款", "money":_decorationPayment.paymentBlance, "paymentId":_decorationPayment.autoId};
				
				options[_decorationPayment.paymentType] = option;
			}

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
			
			com.updateChosen('approveManSel', '', '');
			
			decorationOrderDetail.refundDecorationPaymentModal.modal("show");
		});
	});
	
	$("#btnOtherPayment").on('click', function(res){
		com.clearValidator();
		
		com.post(api.ds.decorationInfo, {}, function(res){
			decorationOrderDetail.otherPaymentType.bindData(res.paymentType, "key", "value", false);
		});
		
		decorationOrderDetail.otherPaymentModal.modal("show");
	});
	
	$("#saveGenerateDecorationPaymentBtn").bindClick(function(res){

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

		if(decorationOrderDetail.orderType == decorationOrderDetail.type["半价"]){

			var manageRate = 0;

			com.post(api.quotation.queryQuotationVersionByVersionId,{ "quotationVersion.versionId": decorationOrderDetail.versionId},function (res) {
				manageRate = res.quotationVersion.manageRate;
			},null,false);

			var maching = $('#decorationOrderDiscount').val();
			var discout = $('#decorationOrderDiscount').find("option:selected").text();
			var projectPrice = Math.ceil(parseFloat($("#decorationOrderTotalMoney").val()));
			var serviceRate = config.serviceRate;

			options = {
				"decorationHolonomy.decorationOrder.orderId": decorationOrderDetail.decorationOrderId,
				"decorationHolonomy.maching": maching,
				"decorationHolonomy.discount": discout,
				"decorationHolonomy.projectPrice": projectPrice,
				"decorationHolonomy.manageRate": parseFloat(manageRate) + parseFloat(decorationOrderDetail.notSalesmanRate),
				"decorationHolonomy.serviceRate": serviceRate,
				"decorationHolonomy.status": 0
			};

			com.post(api.decoration.makeDecorationHolonomy,options,function (res) {
				com.showAlert(com.info,"保存成功");

				res = res.decorationHolonomy;
				$('#projectPrice').html(res.projectPrice + res.managePrice);
				$('#managePrice').html(res.managePrice);
				$('#materialPrice').html(res.materialPrice);
				$('#servicePrice').html(res.servicePrice);

				decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, editPayment, submintPayment, editRefundPayment);

			},function (e) {
				com.showAlert(com.error,e.errorMsg);
			})

		}else {
			com.post(api.payment.makeDecorationPayment, options, function(res){
				decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, editPayment, submintPayment, editRefundPayment);
			});
		}

		
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
		
		com.post(api.payment.updateDecorationPaymentForReferMoney, options, function(res){
			decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, editPayment, submintPayment, editRefundPayment);
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
						decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, editPayment, submintPayment, editRefundPayment);
					});
				}
				
				decorationOrderDetail.refundDecorationPaymentModal.modal("hide");
			});
		}
	});
	
	$("#saveOtherPaymentBtn").on("click", function(res){
		if(com.validate("otherPaymentModal")){
			return;
		}
		
		var options = {
			"decorationPayment.orderId": decorationOrderDetail.decorationOrderId,
			"decorationPayment.paymentType": decorationOrderDetail.otherPaymentType.val(),
			"decorationPayment.referMoney": decorationOrderDetail.otherPayment.val()
		}
		
		com.post(api.payment.addDecorationPayment, options, function(res){
			
			decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, editPayment, submintPayment, editRefundPayment);
			
			decorationOrderDetail.otherPaymentModal.modal("hide");
		})
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
		
		com.updateChosen('approveManSel', '', '');
		
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
		
		$("#houseNumber").val(decorationOrderDetail.village.houseNumber);
		
		com.updateChosen('villageSel', decorationOrderDetail.village.villageId, decorationOrderDetail.village.villageName);
		com.updateChosen('vApproveManSel', '', '');
		
		com.validator.houseNumber["regex"] = eval("/^"+decorationOrderDetail.village.rule+"$/g");
		com.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+decorationOrderDetail.village.ruleContent+")";
		
		$("#buildingRuleContent").text("说明："+decorationOrderDetail.village.ruleContent+";eg."+decorationOrderDetail.village.ruleExample);
		$("#villageDes").val("");
		
		

		approveData["villageName"] = decorationOrderDetail.village.villageName;
		approveData["houseNumber"] = decorationOrderDetail.village.houseNumber;

		$("#villageApproveModal").modal("show");
	});
	
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
		com.switchPage(api.index.decorationOrderDesignerIndex.url);
	});
	
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

	initWizard();
	
	decorationUtils.initBaseInfo(decorationOrderDetail.decorationOrderId, api.decoration.queryDecorationOrderForDesignerByOrderId, function(decorationOrder){
		
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
		$("#houseType").val(decorationOrder.houseType).prop("disabled", true);
		$("#houseClass").val(decorationOrder.houseClass).prop("disabled", true);
		$("#houseArea").val(decorationOrder.houseArea).prop("disabled", true);
		$("#freeArea").val(decorationOrder.freeArea).prop("disabled", true);
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
		
		decorationOrderDetail.decorationOrder.type = decorationOrder.type;
	});
	
	decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, editPayment, submintPayment, editRefundPayment);
	
	decorationUtils.loadHuploadify("designPictureUpload", "上传效果图", "*.jpg;*.jpge;*.gif;*.png", true, function(data){
		decorationUtils.addDecorationPicture(data, 1, "designPictures");
	}, "btn btn-success");
	
	decorationUtils.loadHuploadify("projectPictureUpload", "上传工程图", "*.jpg;*.jpge;*.gif;*.png", true, function(data){
		decorationUtils.addDecorationPicture(data, 2, "projectPictures");
	}, "btn btn-primary");
	
	decorationUtils.loadHuploadify("CADUpload", "上传工程文件", "*.dwg;*.dwt", false, function(data){
		decorationUtils.addDecorationPicture(data, 0, "CADProjectPicture");
	}, "btn btn-warning");
});

function submintPayment(paymentId, paymentType){
	
	bootbox.confirm("确认要提交" + paymentType + "吗？", function(result){
		if(result){
			com.post(api.payment.submitDecorationPayment, {"decorationPayment.autoId":paymentId}, function(res){
				decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, editPayment, submintPayment, editRefundPayment);
			});
		}
	});
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
		
		if($("#paymentType").val() == null){
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

function initWizard() {
	$('#fuelux-wizard').ace_wizard({"status": true}).on('change', function(e, info) {
		
		var curstep = 0;
		
		info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;
		
		curstep == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide")
		
		if (curstep == 2) {
			decorationUtils.loadQuotationDetail();
		} else if (curstep == 3) {
			decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", decorationOrderDetail.decorationOrderId);
		}else if (curstep == 4){
			decorationUtils.initMaterial(decorationOrderDetail.decorationOrderId);
		}else if (curstep == 5) {
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, activityBtnMethod, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, uiBtnMethod, decorationOrderDetail.decorationOrderId);
		}else if(curstep == 7){
			decorationUtils.initDecorationBelong(decorationOrderDetail.decorationOrderId);
		}
	}).on('finished', function(e) {
		com.switchPage(api.index.decorationOrderDesignerIndex.url);
	}).on('stepclick', function(e,info){
		
		info.step == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide")
		
		if (info.step == 2) {
			decorationUtils.loadQuotationDetail();
		} else if (info.step == 3) {
			decorationUtils.initDecorationPicture("designPictures", "projectPictures", "CADProjectPicture", decorationOrderDetail.decorationOrderId);
		}else if (info.step == 4){
			decorationUtils.initMaterial(decorationOrderDetail.decorationOrderId);
		}else if (info.step == 5) {
			decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, activityBtnMethod, decorationOrderDetail.decorationOrderId);
			decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, uiBtnMethod, decorationOrderDetail.decorationOrderId);
		}else if(info.step == 7){
			decorationUtils.initDecorationBelong(decorationOrderDetail.decorationOrderId);
		}
	}).on('next', function(e, info) {
		info.step == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide")
	}).on('previous', function(e, info) {
		info.step == 1 ? decorationOrderDetail.btnSaveBaseDecorationOrderInfo.removeClass("hide") : decorationOrderDetail.btnSaveBaseDecorationOrderInfo.addClass("hide")
	});
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

			com.post(api.decoration.changeDecorationOrderForAdvance, options, function(res) {
				com.showAlert(com.info, "操作成功");
				btn.button('reset');
			}, function(res) {
				btn.button('reset');
			});
		} else {
			btn.button('reset');
		}
	});
}

function downloadFile(picturePath, uploadFileName) {
	window.open(config.media + api.common.downloadFile.url + "?downloadFilePath=" + picturePath + "&fileName=" + uploadFileName);
}

function quotationItemDesFormatter(cellvalue, options, rowObject){
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="right" title="'+rowObject.quotationItemDes+'">工艺</span>';
	html += "<input type='text' class='hide' value='"+rowObject.quotationItemDes+"' />";
	return html;
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
		});
	}
}

function deleteDecorationActivity(daId){
	
	var options = {
		"decorationActivity.daId": daId,
	}
	
	com.post(api.decoration.deleteDecorationActivity, options, function(res){
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


