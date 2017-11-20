
jQuery(function($) {
	
	var orderEntry = {
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		backVisitItems: {},
		orderItems:{},
		relationshipType: ["普通客户", "企业高端客户", "企业关系客户", "领导关系客户", "员工关系"],
		validator: {
			houseNumber: {
				type: "v_houseNumber", 
				regex: /^D_\d{3}$/g,
				errorMsg: "楼盘名称规则"
			}
		},
		
		repeatFlg:false,
		repeatCustomerFlg:false,
		editFlag: false,
		customerRepeatFlg: false,
		items: {}
	};
	
	orderEntry.orderItems.decorationOrderFlag = $("#decorationOrderFlag");
	orderEntry.orderItems.materialOrderFlag = $("#materialOrderFlag");
	orderEntry.orderItems.customerId = $("#customerId");
	orderEntry.orderItems.villageId = $("#villageId");
	orderEntry.orderItems.orderType = $("#orderType");
	orderEntry.orderItems.houseNumber = $("#houseNumber");
	orderEntry.orderItems.houseType = $("#houseType");
	orderEntry.orderItems.houseClass = $("#houseClass");
	orderEntry.orderItems.apartmentType = $("#apartmentType");
	orderEntry.orderItems.houseArea = $("#houseArea");
	orderEntry.orderItems.designerId = $("#designerId");
	orderEntry.orderItems.salesmanId = $("#salesmanId");
	orderEntry.orderItems.salesmanType = $("#salesmanType");
	orderEntry.orderItems.notSalesmanName = $("#notSalesmanName");
	orderEntry.orderItems.notSalesmanRate = $("#notSalesmanRate");
	orderEntry.orderItems.notSalesmanPhone = $("#notSalesmanPhone");
	orderEntry.orderItems.notSalesmanContent = $("#notSalesmanContent");
	orderEntry.orderItems.backOrderName = $("#backOrderName");
	orderEntry.orderItems.backOrderPhone = $("#backOrderPhone");
	orderEntry.orderItems.backOrderContent = $("#backOrderContent");
	orderEntry.orderItems.status = $("#status");
	orderEntry.orderItems.quoterId = $("#quoterId");
	orderEntry.orderItems.escorterId = $("#escorterId");
	orderEntry.saveBtn = $("#saveBtn").on("click", createOrder);
	orderEntry.cancelBtn = $("#cancelBtn").on("click", initCreate);
	
	$.extend(com.validator, orderEntry.validator);
	
	com.post(api.ds.decoration, {}, function(res){
		orderEntry.salesmanType = res.salesmanType;
		orderEntry.orderItems.salesmanType.bindData(orderEntry.salesmanType, 'key', 'value');
		
		orderEntry.orderItems.orderType.bindData(res.type, 'key', 'value');
		
		orderEntry.houseType = res.houseType;
		orderEntry.orderItems.houseType.bindData(orderEntry.houseType, 'key', 'value');
		
		orderEntry.status = res.status;
		orderEntry.orderItems.status.bindData(orderEntry.status, 'key', 'value');
		
		orderEntry.houseClass = res.houseClass;
		orderEntry.orderItems.houseClass.bindData(orderEntry.houseClass, 'key', 'value');
	});
	
	com.initChosen('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value").on("change", function(e){
		if($(this).val() == "" || $("#customerId").val() == "") {
			com.clearValidator("#customerId", true);
			orderEntry.repeatCustomerFlg = false;
			return;
		}
		com.post(api.decoration.queryDecorationOrderByCustomerId, {"decorationOrder.customer.id":$("#customerId").val()}, function(res){
			if(res.decorationOrders && res.decorationOrders.length > 0){
				
				var decorationOrder = res.decorationOrders[0];
				
				com.showTips($("#customerId"), "订单已存在.订单号:" + decorationOrder.orderId + ",订单所属设计师:" + decorationOrder.designer, true);
				orderEntry.repeatCustomerFlg = true;
			}else{
				com.clearValidator("#customerId", true);
				orderEntry.repeatCustomerFlg = false;
			}
		}, null, false);
	});
	
	com.initChosen('villageId', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value").on("change", function(e){
		if($("#villageId").val() == null || $("#villageId").val() == ""){
			return;
		}
		
		com.post(api.data.queryVillageById, {"village.villageId":$("#villageId").val()}, function(res){
			$("#houseNumber").val("");
			
			orderEntry.validator.houseNumber["regex"] = eval("/^"+res.village.buildingNameRule.rule+"$/g");
			orderEntry.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+res.village.buildingNameRule.ruleContent+")";
			
			$("#buildingRuleContent").html("说明："+res.village.buildingNameRule.ruleContent+";eg."+res.village.buildingNameRule.ruleExample);
		}, null, false);
	});
	
	com.initChosen('designerId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");
	com.initChosen('salesmanId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");
	com.initChosen('quoterId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");
	com.initChosen('escorterId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");

	$("#houseNumber").on("blur", function(e){
		if($(this).val() == "" || $("#villageId").val() == ""){
			return;
		}
		
		var options = {
			"decorationOrder.village.villageId": $("#villageId").val(),
			"decorationOrder.houseNumber": $("#houseNumber").val(),
		}
		
		com.post(api.decoration.queryDecorationOrderByVillageIdAHouseNumber, options, function(res){
			if(res.decorationOrder&&res.decorationOrder.orderId){
				com.showTips($("#houseNumber"), "订单已存在：订单号："+res.decorationOrder.orderId+" 订单所属设计师:"+res.decorationOrder.designer, true);
				orderEntry.repeatFlg = true;
			}else{
				com.clearValidator("#houseNumber", true);
				orderEntry.repeatFlg = false;
			}
		}, null, false);
	});
	
	$('#fl-statement').statement("订单管理", "录入订单");
	
	orderEntry.items.customerName = $("#customerName");
	orderEntry.items.gender = $("#gender").switchBtn("gender");
	orderEntry.items.phone = $("#phone").on("blur",function(){
		$this = $(this);
		
		if($this.val() == undefined || $this.val().trim() == ""){
			com.clearValidator("#phone", true);
			orderEntry.customerRepeatFlg = false;
			return;
		}
		
		if((com.validator.phones.regex).test($this.val())){
			com.post(api.data.checkCustomerForPhone, {"customer.phone":$this.val()}, function(res){
				if(res.customerIds.length > 0){
					com.showTips($this, "该联系方式已存在", true);
					orderEntry.customerRepeatFlg = true;
				}else{
					com.clearValidator("#phone", true);
					orderEntry.customerRepeatFlg = false;
				}
			}, null, false);
		}
	});
	orderEntry.items.qq = $("#qq");
	orderEntry.items.wechat = $("#wechat");
	orderEntry.items.email = $("#email");
	orderEntry.items.address = $("#address");
	orderEntry.items.relationshipType = $("#relationshipType");
	orderEntry.items.relationshipType.bindData(orderEntry.relationshipType);
	
	$("#createCustomerSaveBtn").on("click", createCustomer);
	$("#customerModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#phone", true);
	});
	
	$("#createCustomer").on("click", function(){
		com.cleanItems(orderEntry.items);
		$("#customerModal").modal("show");
	});
	
	$("#decorationOrderFlag").on("click", function(res){
		if($("#decorationOrderFlag").is(":checked") == true){
			$("#designerId").addClass("v_required");
			$("#salesmanId").addClass("v_required");
			
			$(".material").removeClass("hide");
		}else{
			$("#designerId").removeClass("v_required");
			$("#salesmanId").removeClass("v_required");
			
			$(".material").addClass("hide");
		}
	});
	
	$("#materialOrderFlag").on("click", function(res){
		if($("#decorationOrderFlag").is(":checked") != true && $("#materialOrderFlag").is(":checked") == true){
			$("#designerId").removeClass("v_required");
			$("#salesmanId").removeClass("v_required");
			
			$(".material").addClass("hide");
		}else{
			$("#designerId").addClass("v_required");
			$("#salesmanId").addClass("v_required");
			
			$(".material").removeClass("hide");
		}
	});
	
	function createOrder(){
		
		var btn = $(this);
		
		var options = {
			"decorationOrder.customer.id": orderEntry.orderItems.customerId.val(),
			"decorationOrder.village.villageId": orderEntry.orderItems.villageId.val(),
			"decorationOrder.houseNumber": orderEntry.orderItems.houseNumber.val(),
			"decorationOrder.houseType": orderEntry.orderItems.houseType.val(),
			"decorationOrder.houseClass": orderEntry.orderItems.houseClass.val(),
			"decorationOrder.apartmentType": orderEntry.orderItems.apartmentType.val(),
			"decorationOrder.houseArea": orderEntry.orderItems.houseArea.val(),
			"decorationOrder.designerId": orderEntry.orderItems.designerId.val(),
			"decorationOrder.salesmanId": orderEntry.orderItems.salesmanId.val(),
			"decorationOrder.salesmanType": orderEntry.orderItems.salesmanType.val(),
			"decorationOrder.notSalesmanName": orderEntry.orderItems.notSalesmanName.val(),
			"decorationOrder.notSalesmanRate": orderEntry.orderItems.notSalesmanRate.val(),
			"decorationOrder.notSalesmanPhone": orderEntry.orderItems.notSalesmanPhone.val(),
			"decorationOrder.notSalesmanContent": orderEntry.orderItems.notSalesmanContent.val(),
			"decorationOrder.backOrderName": orderEntry.orderItems.backOrderName.val(),
			"decorationOrder.backOrderPhone": orderEntry.orderItems.backOrderPhone.val(),
			"decorationOrder.backOrderContent": orderEntry.orderItems.backOrderContent.val(),
			"decorationOrder.resourceType": orderEntry.orderItems.status.val(),
			"decorationOrder.approveStatus": 0,
			"decorationOrder.type": orderEntry.orderItems.orderType.val(),
			"decorationOrder.quoterId": orderEntry.orderItems.quoterId.val(),
			"decorationOrder.escorterId": orderEntry.orderItems.escorterId.val()
		};
		
		if(com.validate('createOrder') || orderEntry.repeatFlg || orderEntry.repeatCustomerFlg)
			return;
		
		if((1 - parseFloat($("#notSalesmanRate").val()) < 0.0000001) && parseFloat($("#notSalesmanRate").val()) > -0.0000001){
			bootbox.alert("非业务提点必须大于0小于1");
			return;
		}
		
		btn.button('loading');
		
		com.post(api.decoration.createDecorationOrder, options, function(){
			com.showAlert(com.info, "操作成功");
			initCreate();
			
			btn.button('reset');
		}, function(){
			btn.button('reset');
		});
	}

	function createOrderSuccess(){
		com.showAlert(com.info, "操作成功");
		initCreate();
	}

	function initCreate(){
		orderEntry.orderItems.decorationOrderFlag.attr("checked","checked");
		orderEntry.orderItems.materialOrderFlag.removeAttr("checked");
		orderEntry.orderItems.customerId.get(0).selectedIndex = 0;
		orderEntry.orderItems.villageId.get(0).selectedIndex = 0;
		orderEntry.orderItems.houseNumber.val("");
		orderEntry.orderItems.houseType.get(0).selectedIndex = 0;
		orderEntry.orderItems.houseClass.get(0).selectedIndex = 0;
		orderEntry.orderItems.apartmentType.get(0).selectedIndex = 0;
		orderEntry.orderItems.houseArea.val("");
		orderEntry.orderItems.designerId.get(0).selectedIndex = 0;
		orderEntry.orderItems.salesmanId.get(0).selectedIndex = 0;
		orderEntry.orderItems.salesmanType.get(0).selectedIndex = 0;
		orderEntry.orderItems.notSalesmanName.val("");
		orderEntry.orderItems.notSalesmanRate.val("0");
		orderEntry.orderItems.notSalesmanPhone.val("");
		orderEntry.orderItems.notSalesmanContent.val("");
		orderEntry.orderItems.backOrderName.val("");
		orderEntry.orderItems.backOrderPhone.val("");
		orderEntry.orderItems.backOrderContent.val("");
		orderEntry.orderItems.status.val("");
		
		com.updateChosen("customerId", '', '');
		com.updateChosen("villageId", '', '');
		com.updateChosen("designerId", '', '');
		com.updateChosen("salesmanId", '', '');
		
		$(".chosen-single span").html("");
		
		com.clearValidator("#houseNumber", true);
		com.clearValidator("#customerId", true);
		com.clearValidator();
		
		orderEntry.repeatFlg = false;
		orderEntry.repeatCustomerFlg = false;
	}

	function createCustomer(){
		
		if(com.validate("customerModal") || orderEntry.customerRepeatFlg){
			return;
		}
		
		var options = {
			"customer.customerName": orderEntry.items.customerName.val(),
			"customer.gender": com.genderType[orderEntry.items.gender.prop("checked")],
			"customer.phone": orderEntry.items.phone.val(),
			"customer.qq": orderEntry.items.qq.val(),
			"customer.wechat": orderEntry.items.wechat.val(),
			"customer.email": orderEntry.items.email.val(),
			"customer.relationshipType": orderEntry.items.relationshipType.val(),
			"customer.address": orderEntry.items.address.val(),
			"customer.approveStatus": 0
		};
		
		com.post(api.data.addCustomer, options, function(res){
			com.showAlert(com.info, "创建用户成功");
			
			$("#customerId").html('<option value="'+res.customer.id+'">'+res.customer.customerName+'-'+res.customer.phone+'</option>');
			$("#customerId").trigger("chosen:updated");
			
			$("#customerModal").modal("hide");
		}, function(e){
			com.showAlert(com.error, e.errorMsg);
		}, false);
	}

});
