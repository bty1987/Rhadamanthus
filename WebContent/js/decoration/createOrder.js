
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
		customerItems: {},
		houseItems: {}
	};
	
	orderEntry.orderItems.decorationFlag = $("#decorationFlag");
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

	orderEntry.customerItems.customerName = $("#customerName");
	orderEntry.customerItems.gender = $("#gender").switchBtn("gender");
	orderEntry.customerItems.identity = $("#identity");
	orderEntry.customerItems.officer = $("#officer");
	orderEntry.customerItems.passport = $("#passport");
	orderEntry.customerItems.phone = $("#phone").on("blur",function(){
		$this = $(this);

		checkPhone($this)
	});
	orderEntry.customerItems.qq = $("#qq");
	orderEntry.customerItems.wechat = $("#wechat");
	orderEntry.customerItems.email = $("#email");
	orderEntry.customerItems.address = $("#address");
	orderEntry.customerItems.relationshipType = $("#relationshipType");
	orderEntry.customerItems.relationshipType.bindData(orderEntry.relationshipType);

	orderEntry.houseItems.no = $("#no");
	orderEntry.houseItems.nameRuleSel = $("#nameRuleSel");
	orderEntry.houseItems.type = $("#type");
	orderEntry.houseItems.buildArea = $("#buildArea");
	orderEntry.houseItems.maxFloor = $("#maxFloor");
	orderEntry.houseItems.through = $("#through");
	orderEntry.houseItems.houseTypeOne = $("#houseTypeOne");
	orderEntry.houseItems.houseTypeTwo = $("#houseTypeTwo");
	orderEntry.houseItems.houseTypeThr = $("#houseTypeThr");
	orderEntry.houseItems.houseTypeFour = $("#houseTypeFour");
	orderEntry.houseItems.orientation = $("#orientation");
	orderEntry.houseItems.feature = $("#feature");
	orderEntry.houseItems.waterVapour = $("#waterVapour");
	orderEntry.houseItems.parlourType = $("#parlourType");
	orderEntry.houseItems.heatingType = $("#heatingType");

	orderEntry.houseItems.nameRuleSel.on('change',function () {
		buildruleval()
		orderEntry.houseItems.built.val("");
		orderEntry.houseItems.unit.val("");
		orderEntry.houseItems.floor.val("");
		orderEntry.houseItems.door.val("");
	});

	orderEntry.houseItems.no.on('change',function () {
		orderEntry.houseItems.built.val("");
		orderEntry.houseItems.unit.val("");
		orderEntry.houseItems.floor.val("");
		orderEntry.houseItems.door.val("");
	});

	orderEntry.houseItems.built = $("#built").on("blur", function(e){

		orderEntry.houseItems.unit.val("");
		orderEntry.houseItems.floor.val("");
		orderEntry.houseItems.door.val("");

	});

	orderEntry.houseItems.unit = $("#unit").on("blur", function(e){

		orderEntry.houseItems.floor.val("");
		orderEntry.houseItems.door.val("");

	});

	orderEntry.houseItems.floor = $("#floor").on("blur", function(e){

		orderEntry.houseItems.door.val("");

	});

	orderEntry.houseItems.door = $("#door").on("blur", function(e){

		buildruleval();
		if($("#no").val() == "" ){
			com.showPopover($("#no"),{errorMsg: "请先选择楼盘"}, "right");
			orderEntry.houseItems.built.val("");
			orderEntry.houseItems.unit.val("");
			orderEntry.houseItems.floor.val("");
			orderEntry.houseItems.door.val("");
		}else{
			$("#no").css("border", "1px solid #d5d5d5").popover("destroy")
		}

		//合成楼牌号
		orderEntry.houseItems.rulenum=[orderEntry.houseItems.built.val(),orderEntry.houseItems.unit.val(),orderEntry.houseItems.floor.val(),orderEntry.houseItems.door.val()];
		orderEntry.houseItems.buildName = orderEntry.houseItems.rulefill;
		$.each(orderEntry.houseItems.rulenum,function(i,val){
			orderEntry.houseItems.buildName = changetohousenum (orderEntry.houseItems.buildName,val) ;
		})
		//验证楼牌号是否符合正则
		if(!houseNumbervali( orderEntry.houseItems.buildName, orderEntry.houseItems.regex, orderEntry.houseItems.errorMsg)) return;
		//验证房产是否存在
		if(!validatehouse(orderEntry.houseItems.no.val(),orderEntry.houseItems.buildName)) return;
	});
	
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

		com.post(api.decoration.queryDecorationByCustomerId, {"decoration.customer.cid":$("#customerId").val()}, function(res){
			if(res.decorations && res.decorations.length > 0){

				var decoration = res.decorations[0];

				com.showTips($("#customerId"), "订单已存在.订单号:" + decoration.orderId + ",订单所属设计师:" + decoration.designer.currentName, true);
				orderEntry.repeatCustomerFlg = true;
			}else{
				com.clearValidator("#customerId", true);
				orderEntry.repeatCustomerFlg = false;
			}
		}, null, false);
	});
	
	com.initChosen('villageId', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value")
	
	com.initChosen('designerId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");
	com.initChosen('salesmanId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");
	com.initChosen('quoterId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");
	com.initChosen('escorterId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");

	com.initChosen('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value")


	$("#houseNumber").on("blur", function(e){
		if($(this).val() == "" || $("#villageId").val() == ""){
			return;
		}

		var housePostData = {
			"house.village.no": orderEntry.orderItems.villageId.val(),
			"house.houseNumber": orderEntry.orderItems.houseNumber.val(),
			"house.status": 0}

		com.post(api.data.queryHouseByNoAHnum,housePostData,function (res) {
			com.post(api.decoration.checkDecoration, {"filters[0].data":res.house.hid,"filters[0].field":"houseId","filters[0].op":"eq"}, function(des){
				if(des.decoration&&des.decoration.orderId){
					com.showTips($("#houseNumber"), "订单已存在：订单号："+des.decoration.orderId+" 订单所属设计师:"+des.decoration.designer.currentName, true);
					orderEntry.repeatFlg = true;
				}else{
					bootbox.confirm("已有该房产信息，是否绑定？", function(yes) {
						if(yes){
							orderEntry.houseItems.hid = res.house.hid;
							orderEntry.repeatFlg = false;
							orderEntry.orderItems.houseArea.val(res.house.buildArea)
							orderEntry.orderItems.apartmentType.val(res.house.houseType)
						}else {
							$("#houseModal").modal("show");
						}
					});
				}
			}, null, false);

		},function () {
			com.showAlert(com.warning,"房产不存在，请创建房产");
			clearHouse();
			com.clearValidator("#houseNumber", true);
			com.updateChosen('no',orderEntry.orderItems.villageId.val(),$("#villageId"+" option:selected").text())
			$("#houseModal").modal("show");
		},false);

	});
	
	$('#fl-statement').statement("订单管理", "录入订单");
	


	com.post(api.common.queryBuildingNameRule, {}, function(res) {
		orderEntry.houseItems.nameRuleList = res.buildingNameRules;
		orderEntry.houseItems.nameRuleSel.bindData(orderEntry.houseItems.nameRuleList, "id", "ruleContent")
	});

	com.post(api.ds.building, {}, function(res){
		orderEntry.houseItems.type.bindData(res.houseType,"key", "value");
		orderEntry.houseItems.through.bindData(res.through,"key", "value");
		orderEntry.houseItems.orientation.bindData(res.orientation,"key", "value");
		orderEntry.houseItems.waterVapour.bindData(res.waterVapour,"key", "value");
		orderEntry.houseItems.parlourType.bindData(res.parlourType,"key", "value");
		orderEntry.houseItems.heatingType.bindData(res.heatingType,"key", "value");
	},null,false);

	$("#createCustomerSaveBtn").on("click", createCustomer);
	
	$("#createCustomer").on("click", function(){
		clearCustomer()
		$("#customerModal").modal("show");
	});

	$("#createHouse").on("click", function(){
		clearHouse();
		$("#houseModal").modal("show");
	});

	$("#cancelHouselBtn").on("click", function(){
		clearHouse();
		$("#houseModal").modal("hide");
	});

	$("#saveHouseBtn").on("click", function(){

		if(com.validate("houseModal")){
			return;
		}

		
		if(houseNumbervali(orderEntry.houseItems.buildName,orderEntry.houseItems.regex,orderEntry.houseItems.errorMsg)){
			$("#built").css("border", "1px solid #d5d5d5").popover("destroy");
			saveHouse();
		}else {
			return;
		}

	});

	$("#decorationFlag").on("click", function(res){
		if($("#decorationFlag").is(":checked") == true){
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
		if($("#decorationFlag").is(":checked") != true && $("#materialOrderFlag").is(":checked") == true){
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
		
		var btn = $("#saveBtn");
		
		var options = {
			"decoration.customer.cid": orderEntry.orderItems.customerId.val(),
			"decoration.houseType": orderEntry.orderItems.houseType.val(),
			"decoration.houseClass": orderEntry.orderItems.houseClass.val(),
			"decoration.apartmentType": orderEntry.orderItems.apartmentType.val(),
			"decoration.houseArea": orderEntry.orderItems.houseArea.val(),
			"decoration.designer.userId": orderEntry.orderItems.designerId.val(),
			"decoration.salesman.userId": orderEntry.orderItems.salesmanId.val(),
			"decoration.salesmanType": orderEntry.orderItems.salesmanType.val(),
			"decorationInfo.notSalesmanName": orderEntry.orderItems.notSalesmanName.val(),
			"decoration.notSalesmanRate": orderEntry.orderItems.notSalesmanRate.val(),
			"decorationInfo.notSalesmanPhone": orderEntry.orderItems.notSalesmanPhone.val(),
			"decorationInfo.notSalesmanContent": orderEntry.orderItems.notSalesmanContent.val(),
			"decorationInfo.backOrderName": orderEntry.orderItems.backOrderName.val(),
			"decorationInfo.backOrderPhone": orderEntry.orderItems.backOrderPhone.val(),
			"decorationInfo.backOrderContent": orderEntry.orderItems.backOrderContent.val(),
			"decoration.resourceType": orderEntry.orderItems.status.val(),
			"decoration.approveStatus": 0,
			"decoration.type": orderEntry.orderItems.orderType.val(),
			"decoration.quoter.userId": orderEntry.orderItems.quoterId.val(),
			"decoration.escorter.userId": orderEntry.orderItems.escorterId.val(),
			"decoration.house.hid": orderEntry.houseItems.hid
		};

		if(com.validate('createOrder') || orderEntry.repeatFlg || orderEntry.repeatCustomerFlg)
			return;

		if(orderEntry.houseItems.hid == null){
			com.showAlert(com.error,"房产信息未填写！");
			return;
		}


		if((1 - parseFloat($("#notSalesmanRate").val()) < 0.0000001) && parseFloat($("#notSalesmanRate").val()) > -0.0000001){
			bootbox.alert("非业务提点必须大于0小于1");
			return;
		}

		btn.button('loading');

		com.post(api.decoration.createDecoration, options, function(){
			com.showAlert(com.info, "操作成功");
			initCreate();
			
			btn.button('reset');
		}, function(){
			btn.button('reset');
		});
	}

	function initCreate(){
		orderEntry.orderItems.decorationFlag.attr("checked","checked");
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

	function saveHouse(){
		
		var btn = $("#saveHouseBtn");
		var houseOptions = {}

		if(com.validate("houseModal","top") || orderEntry.houseItems.no.val()== "") return;
		if(!houseNumbervali(orderEntry.houseItems.buildName,orderEntry.houseItems.regex,orderEntry.houseItems.errorMsg)) return;

		if(validatehouse(orderEntry.houseItems.no.val(),orderEntry.houseItems.buildName)) return;

		houseOptions["house.village.no"] = orderEntry.houseItems.no.val();
		houseOptions["house.built"] = orderEntry.houseItems.built.val();
		houseOptions["house.unit"] = orderEntry.houseItems.unit .val();
		houseOptions["house.floor"] = orderEntry.houseItems.floor.val();
		houseOptions["house.door"] = orderEntry.houseItems.door.val();
		houseOptions["house.type"] = orderEntry.houseItems.type.val();
		houseOptions["house.buildArea"] = utils.changeThrDecimal(orderEntry.houseItems.buildArea.val());
		houseOptions["house.maxFloor"] = orderEntry.houseItems.maxFloor.val();
		houseOptions["house.through"] = orderEntry.houseItems.through.val();
		houseOptions["house.roomNum"] =  orderEntry.houseItems.houseTypeOne.val();
		houseOptions["house.orientation"] =orderEntry.houseItems.orientation.val();
		houseOptions["house.feature"] = orderEntry.houseItems.feature.val();
		houseOptions["house.waterVapour"] = orderEntry.houseItems.waterVapour.val();
		houseOptions["house.parlourType"] =  orderEntry.houseItems.parlourType.val();
		houseOptions["house.heatingType"] =  orderEntry.houseItems.heatingType.val();

		var	url = api.data.addHouse;
		houseOptions["house.status"] =  0;
		houseOptions["house.houseNumber"] = orderEntry.houseItems.buildName;
		houseOptions["house.village.no"] = orderEntry.houseItems.no.val();
		houseOptions["house.houseType"] = orderEntry.houseItems.houseTypeOne.val() + "室" + orderEntry.houseItems.houseTypeTwo.val() + "厅" +  orderEntry.houseItems.houseTypeThr.val() + "厨" + orderEntry.houseItems.houseTypeFour.val()+"卫";

		btn.button('loading');

		com.post(url,houseOptions, function(res){
			com.showAlert(com.info, "操作成功");
			com.updateChosen('villageId', orderEntry.houseItems.no.val(),$("#no"+" option:selected").text());
			orderEntry.orderItems.houseNumber.val(orderEntry.houseItems.buildName);
			orderEntry.houseItems.hid = res.house.hid;
			orderEntry.orderItems.houseArea.val(res.house.buildArea)
			orderEntry.orderItems.apartmentType.val(res.house.houseType);
			clearHouse();
			btn.button('reset');

			$("#houseModal").modal("hide");

		}, function(e){
			com.showAlert(com.error,e.errorMsg);
			btn.button('reset');
		});
	}

	function clearHouse(){

		orderEntry.houseItems.nameRuleSel.get(0).selectedIndex = 0;
		orderEntry.houseItems.nameRuleSel.trigger("change");

		orderEntry.houseItems.no.prop("disabled", false);
		orderEntry.houseItems.no.get(0).selectedIndex = 0;
		orderEntry.houseItems.type.get(0).selectedIndex = 0;
		orderEntry.houseItems.buildArea.val("");
		orderEntry.houseItems.maxFloor.val("");
		orderEntry.houseItems.through.get(0).selectedIndex = 0;
		orderEntry.houseItems.houseTypeOne.val("");
		orderEntry.houseItems.houseTypeTwo.val("");
		orderEntry.houseItems.houseTypeThr.val("");
		orderEntry.houseItems.houseTypeFour.val("");
		orderEntry.houseItems.orientation.get(0).selectedIndex = 0;
		orderEntry.houseItems.feature.val("");
		orderEntry.houseItems.waterVapour.get(0).selectedIndex = 0;
		orderEntry.houseItems.parlourType.get(0).selectedIndex = 0;
		orderEntry.houseItems.heatingType.get(0).selectedIndex = 0;
		orderEntry.houseItems.built.val("");
		orderEntry.houseItems.unit.val("");
		orderEntry.houseItems.floor.val("");
		orderEntry.houseItems.door.val("");

		orderEntry.houseItems.regex="";
		orderEntry.houseItems.errorMsg="";
		$("#errMsg").css("border","0px");
		com.updateChosen("no", '', '');
		com.clearValidator();

	}

	function createCustomer(){

		regcard(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,orderEntry.customerItems.identity)
		regcard(/^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/,orderEntry.customerItems.officer)

		if(com.validate("customerModal")|| orderEntry.customerRepeatFlg){
			return;
		}

		var url;
		var options = {
			"customer.name": orderEntry.customerItems.customerName.val(),
			"customer.gender": com.genderType[orderEntry.customerItems.gender.prop("checked")],
			"customer.phone": orderEntry.customerItems.phone.val(),
			"customer.identity":orderEntry.customerItems.identity.val(),
			"customer.officer":orderEntry.customerItems.officer.val(),
			"customer.passport":orderEntry.customerItems.passport.val() ,
			"customer.qq": orderEntry.customerItems.qq.val(),
			"customer.wechat": orderEntry.customerItems.wechat.val(),
			"customer.email": orderEntry.customerItems.email.val(),
			"customer.relationshipType": orderEntry.customerItems.relationshipType.val(),
			"customer.address": orderEntry.customerItems.address.val()
		};


		url = api.data.addCustomer;

		com.post(url, options, function(res){
			com.showAlert(com.info, "创建用户成功");

			$("#customerId").html('<option value="'+res.customer.cid+'">'+res.customer.name+'-'+res.customer.phone+'</option>');
			$("#customerId").trigger("chosen:updated");

			$("#customerModal").modal("hide");
		}, function(e){
			com.showAlert(com.error, e.errorMsg);
		}, false);
	}

	function clearCustomer(){
		orderEntry.customerItems.customerName.val("");
		orderEntry.customerItems.gender.get(0).selectedIndex = 0
		orderEntry.customerItems.identity.val("");
		orderEntry.customerItems.officer.val("");
		orderEntry.customerItems.passport.val("");
		orderEntry.customerItems.phone.val("");
		orderEntry.customerItems.qq.val("");
		orderEntry.customerItems.wechat.val("");
		orderEntry.customerItems.email.val("");
		orderEntry.customerItems.address.val("");
		orderEntry.customerItems.relationshipType.get(0).selectedIndex = 0

		com.clearValidator();

	}

	function regcard(reg,id){

		if( id.val() != "" ){
			if(reg.test(id.val()) == false)
			{
				com.showPopover(id,{errorMsg: "请输入正确的证件号!!"}, "right");
			}else{
				id.css("border", "1px solid #d5d5d5").popover("destroy")
			}
		}else{
			id.css("border", "1px solid #d5d5d5").popover("destroy")
		}

	}

	function checkPhone($id) {
		var reg = /^((1[3|4|5|7|8][0-9]{9})|(0[0-9]{10}))((#((1[3|4|5|7|8][0-9]{9})|(0[0-9]{10})))){0,4}$/;
		if ($id.val() == "" || $id.val() == 0) {
			orderEntry.customerRepeatFlg = true
			com.showPopover($id, {errorMsg: "电话号码不能为空"}, "right")
		} else {
			if (reg.test($id.val()) == false) {
				orderEntry.customerRepeatFlg = true
				com.showPopover($id, {errorMsg: "请输入正确的手机号或固定电话!!"}, "right");
			} else {
				com.post(api.data.checkCustomerForPhone, {
					"customerPhone.phone": $id.val(),
					"customerPhone.status": 0
				}, function(res) {
					orderEntry.customerRepeatFlg = true
					com.showPopover($id,{errorMsg: "电话号码已存在"}, "right");
				}, function(res){
					orderEntry.customerRepeatFlg = false
					$id.css("border", "1px solid #d5d5d5").popover("destroy")

				},false);

			}
		}
	}

	function houseNumbervali(houseNumber,regex,errorMsg){

		if (new RegExp(regex).test(houseNumber)) {
			$("#errMsg").popover("destroy")

			return true
		}else{
			$("#errMsg").focus().select();
			$("#errMsg").removeAttr("data-placement").attr({
				"data-rel":"popover",
				"data-placement": "right",
				"data-content": errorMsg
			}).removeAttr("data-toggle").popover('show');

			return false

		}
	}

	function buildruleval(){

		com.post(api.common.queryBuildingNameRuleById, {"buildingNameRule.id":orderEntry.houseItems.nameRuleSel.val()}, function(res){

			orderEntry.houseItems.regex = eval("/^"+res.buildingNameRule.rule+"$/g");
			orderEntry.houseItems.errorMsg =  "楼盘名称规则("+res.buildingNameRule.ruleContent+")";

			$("#buildingRuleContent").html("说明："+res.buildingNameRule.ruleContent+";eg."+res.buildingNameRule.ruleExample+"空出来的输入框添0");
			orderEntry.houseItems.rulefill=res.buildingNameRule.rulefill
		}, null, false);
	}

	function changetohousenum( temp,arr){
		var str =temp;
		if(arr.trim() != "" && arr.trim() != "0" ){
			if(temp.indexOf("{}") != -1){
				var num=temp.indexOf("{}");
				str=temp.substring(0,num)+ arr +temp.substring(num+2);
			}
			else{
				str =str+"-"+arr;
			}
		}
		return str;
	}

	function validatehouse(no,houseNumber){

		if( no== "" || houseNumber == ""){
			return;
		}
		var options = {
			"house.village.no": no,
			"house.houseNumber": houseNumber,
			"house.status" : null,
		}

		com.post(api.data.queryHouseByNoAHnum, options, function(res){
			com.showPopover($("#door"),{errorMsg: "该房产已存在"}, "top");
			return true;
		}, function(res){
			$("#door").css("border", "1px solid #d5d5d5").popover("destroy")
			return false;
		}, false);

	}


});
