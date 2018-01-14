
jQuery(function($) {

	var createHouseSource = {
		houseSources: {},
		saveBtn: null,
		cancelBtn: null,
		deployedBtn: null,
		createCustomerSaveBtn: null,
		modal: null,
		nameRuleList: [],
		rulenum: [],
		rulefill: null,
		items: {},
		editFlg: false,
		houseItems: {},
		customerItems: {},
		houseSourceId: null,
		customerId: null,
		houseNumber: null,
		housingGrade: ["A", "B", "C", "D"],
		cardType: ["身份证", "军官证", "护照"],
		history: ["正常", "特殊"],
		houseId: null,
		buildingJson:null,
		repeatFlg: false,
		editFlag: false,
		houseFlag:false,
		humFlag:true,
		repeatCustomerFlg: false,
		cardFlag: false,
		validator: {
			houseNumber: {
				type: "v_houseNumber",
				regex: /^D_\d{3}$/g,
				errorMsg: "楼盘名称规则"
			},
		},
	};

	$.extend(com.validator, createHouseSource.validator);

	var tag_input = $("#indoores");
	var tag_inputTwo = $("#feature");

	tag_input.tag({
		placeholder:tag_input.attr('placeholder'),
		isStaticResource : false,
		flsource: {
			url : null,
			postData : {},
			resultList : "autoFillKeyValue",
			keyPath : "key",
			valuePath : "value",
			isResultTypeMap : true, //是否是key - value 形式的列表
		},
	});

	tag_inputTwo.tag({
		placeholder:tag_input.attr('placeholder'),
		isStaticResource : false,
		flsource: {
			url : null,
			postData : {},
			resultList : "autoFillKeyValue",
			keyPath : "key",
			valuePath : "value",
			isResultTypeMap : true, //是否是key - value 形式的列表
		},
	});

	$("#history").bindData(createHouseSource.history);
	$("#cardType").bindData(createHouseSource.cardType);
	$("#housingGrade").bindData(createHouseSource.housingGrade);

	$(".date-picker").datepicker({autoclose: !0}).on("show",function() {
		setTimeout(function() {
			$(".dropdown-menu").css("z-index", 1060)
		},0)
	}).next().on(ace.click_event,function() {
		a(this).prev().focus()
	});

	createHouseSource.modal = $("#createHouseSource");
	createHouseSource.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	createHouseSource.items.gender = $("#gender").switchBtn("gender");

	createHouseSource.saveBtn = $("#saveBtn").on("click", addHouseSource);
	createHouseSource.cancelBtn = $("#cancelBtn").on("click", deleteDate);
	createHouseSource.createCustomerSaveBtn = $("#createCustomerSaveBtn").on("click", createCustomer);

	createHouseSource.items.customerId = $("#customerId");
	createHouseSource.items.hsType = $("#hsType");
	createHouseSource.items.sourceType = $("#sourceType");
	createHouseSource.items.deedNum = $("#deedNum");
	createHouseSource.items.deedValue = $("#deedValue");
	createHouseSource.items.unitPrice = $("#unitPrice");
	createHouseSource.items.totalPrice = $("#totalPrice");
	createHouseSource.items.decorateTime = $("#decorateTime");
	createHouseSource.items.decorateDegree = $("#decorateDegree");
	createHouseSource.items.discussType = $("#discussType");
	createHouseSource.items.rentType = $("#rentType");
	createHouseSource.items.indoores = $("#indoores");
	createHouseSource.items.history = $("#history");
	createHouseSource.items.propertyFee = $("#propertyFee");
	createHouseSource.items.elevator = $("#elevator");
	createHouseSource.items.onlyHousing = $("#onlyHousing");
	createHouseSource.items.documentsDate = $("#documentsDate");
	createHouseSource.items.allowLoan = $("#allowLoan");
	createHouseSource.items.beingLoan = $("#beingLoan");
	createHouseSource.items.checkingTime = $("#checkingTime");
	createHouseSource.items.followId = $("#followId");
	createHouseSource.items.housingGrade = $("#housingGrade");
	createHouseSource.items.comment = $("#comment");

	createHouseSource.customerItems.customerName = $("#customerName");
	createHouseSource.customerItems.cardType = $("#cardType");
	createHouseSource.customerItems.cardNum = $("#cardNum");
	createHouseSource.customerItems.gender = $("#gender");
	createHouseSource.customerItems.qq = $("#qq");
	createHouseSource.customerItems.wechat = $("#wechat");
	createHouseSource.customerItems.email = $("#email");
	createHouseSource.customerItems.relationshipType = $("#relationshipType");
	createHouseSource.customerItems.address = $("#address");
	createHouseSource.customerItems.phone = $("#phone");

	createHouseSource.houseItems.no = $("#no");
	createHouseSource.houseItems.nameRuleSel = $("#nameRuleSel").on("change", function(e){
		buildruleval();
	});
	createHouseSource.houseItems.buildingRuleContent = $("#buildingRuleContent");
	createHouseSource.houseItems.built = $("#built");
	createHouseSource.houseItems.unit = $("#unit");
	createHouseSource.houseItems.floor = $("#floor");
	createHouseSource.houseItems.door = $("#door");
	createHouseSource.houseItems.type = $("#type");
	createHouseSource.houseItems.buildArea = $("#buildArea");
	createHouseSource.houseItems.maxFloor = $("#maxFloor");
	createHouseSource.houseItems.through = $("#through");
	createHouseSource.houseItems.houseTypeOne = $("#houseTypeOne");
	createHouseSource.houseItems.houseTypeTwo = $("#houseTypeTwo");
	createHouseSource.houseItems.houseTypeThr = $("#houseTypeThr");
	createHouseSource.houseItems.houseTypeFour= $("#houseTypeFour");
	createHouseSource.houseItems.orientation = $("#orientation");
	createHouseSource.houseItems.feature = $("#feature");
	createHouseSource.houseItems.waterVapour = $("#waterVapour");
	createHouseSource.houseItems.parlourType = $("#parlourType");
	createHouseSource.houseItems.heatingType = $("#heatingType");
	createHouseSource.houseItems.oldhousetype = $("#oldhousetype");

	//楼号规则
	buildruleval();
	com.post(api.common.queryBuildingNameRule, {}, function(res) {
		createHouseSource.nameRuleList = res.buildingNameRules;
		createHouseSource.houseItems.nameRuleSel.bindData(res.buildingNameRules, "id", "ruleContent", !1).trigger("change");
	}, null, false);

	com.post(api.ds.building, {}, function(res){
		createHouseSource.items.hsType.bindData(res.hsType, "key", "value");
		createHouseSource.items.discussType.bindData(res.discussType, "key", "value");
		createHouseSource.items.decorateDegree.bindData(res.decorateDegree, "key", "value");
		createHouseSource.items.elevator.bindData(res.elevator, "key", "value");
		createHouseSource.items.onlyHousing.bindData(res.onlyHousing, "key", "value");
		createHouseSource.items.allowLoan.bindData(res.allowLoan, "key", "value");
		createHouseSource.items.beingLoan.bindData(res.beingLoan, "key", "value");
		createHouseSource.items.sourceType.bindData(res.sourceType, "key", "value");
		createHouseSource.items.allowLoan.bindData(res.allowLoan, "key", "value");
		createHouseSource.items.beingLoan.bindData(res.beingLoan, "key", "value");
		createHouseSource.items.rentType.bindData(res.rentType, "key", "value");

		createHouseSource.houseItems.orientation.bindData(res.orientation, "key", "value");
		createHouseSource.houseItems.type.bindData(res.houseType, "key", "value");
		createHouseSource.houseItems.waterVapour.bindData(res.waterVapour, "key", "value");
		createHouseSource.houseItems.heatingType.bindData(res.heatingType, "key", "value");
		createHouseSource.houseItems.through.bindData(res.through, "key", "value");
		createHouseSource.houseItems.parlourType.bindData(res.parlourType, "key", "value");
	}, null, false);

	com.post(api.ds.data, {}, function(res){
		createHouseSource.customerItems.relationshipType.bindData(res.relationshipType, "key", "value");
	}, null, false);

	com.initChosen('followId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty": ""}, "autoFillKeyValue", "key", "value");
	com.initChosen('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value").on("change", function(e){
		if($(this).val() == "" || $("#customerId").val() == "") {
			com.clearValidator("#customerId", true);
			createHouseSource.repeatCustomerFlg = false;
			return;
		}
	});

	com.initChosen('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value").on("change", function(e){
		if($("#no").val() == null || $("#no").val() == ""){
			return;
		}
	});

	//清空数据
	createHouseSource.houseItems.no = $("#no").on("change",function(e){
		deleteVillageData("no");
		deleteVillageData("nameRuleSel");
		houseItemsReadOnlyFlag(false);
	});
	createHouseSource.houseItems.nameRuleSel = $("#nameRuleSel").on("change",function(e){
		deleteVillageData("nameRuleSel");
		houseItemsReadOnlyFlag(false);
	});
	createHouseSource.houseItems.built = $("#built").on("change",function(e){
		deleteVillageData("built");
		houseItemsReadOnlyFlag(false);
	});
	createHouseSource.houseItems.unit = $("#unit").on("change",function(e){
		deleteVillageData("unit");
		houseItemsReadOnlyFlag(false);
	});
	createHouseSource.houseItems.floor = $("#floor").on("change",function(e){
		deleteVillageData("floor");
		houseItemsReadOnlyFlag(false);
	});

	//判断房源是否存在  房产存在的情况下自动添加房产信息
	createHouseSource.houseItems.door = $("#door").on("blur", function(e){

		buildruleval();

		if($("#no").val() == ""){
			com.showPopover($("#no"),{errorMsg: "请填写楼盘名！"}, "right");
			createHouseSource.houseItems.door.val("");
		}else{
			$("#no").css("border", "1px solid #d5d5d5").popover("destroy");
		}

		if($(this).val() == "" || $("#no").val() == ""){
			return;
		}

		//合成楼牌号
		createHouseSource.rulenum = [createHouseSource.houseItems.built.val(), createHouseSource.houseItems.unit.val(), createHouseSource.houseItems.floor.val(), createHouseSource.houseItems.door.val()];
		var houseNumber = createHouseSource.rulefill;

		$.each(createHouseSource.rulenum, function(i,val){
			houseNumber = changetohousenum(houseNumber, val) ;
			createHouseSource.houseNumber = houseNumber;
		}, null, false);

		//验证楼牌号是否符合正则
		createHouseSource.humFlag = houseNumbervali(houseNumber,createHouseSource.validator.houseNumber.regex,createHouseSource.validator.houseNumber.errorMsg);

		var options = {
			"house.village.no": $("#no").val(),
			"house.houseNumber": houseNumber,
			"house.status": 0,
		};

		com.post(api.data.queryHouseByNoAHnum, options, function(res){
			var houses = res.house;
			createHouseSource.houseId = houses.hid;

			var hsOptions = {
				"houseSource.house.hid": res.house.hid,
				"houseSource.type": $("#hsType").val(),
			};

			com.post(api.building.checkHouseSource, hsOptions, function(data){
				createHouseSource.houseFlag = false;
				com.showPopover($("#door"),{errorMsg: "该房源已存在"}, "right");
			}, function(res){
				createHouseSource.houseFlag = false;
				//绑定房产数据
				bindHouseData(houses);
				houseItemsReadOnlyFlag(true);
				$("#door").css("border", "1px solid #d5d5d5").popover("destroy");
			}, false);

		}, function(e){
			createHouseSource.houseFlag = true;
			deleteHouseData();
			houseItemsReadOnlyFlag(false);
			$("#door").css("border", "1px solid #d5d5d5").popover("destroy");
		}, false);
	});

	//检查电话号是否已存在
	createHouseSource.customerItems.phone = $("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showPopover($("#phone"),{errorMsg: "电话号码不能为空"}, "right"), createHouseSource.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			createHouseSource.customerRepeatFlg = true;
			com.showPopover($("#phone"),{errorMsg: "电话号码已存在"}, "right");

		}, function(res){
			createHouseSource.customerRepeatFlg = false;
			$("#phone").css("border", "1px solid #d5d5d5").popover("destroy")
		});
	});

	//填写单价
	$("#totalPrice").on("blur", function(){
		if($("#buildArea").val() == ""){
			return;
		}
		createHouseSource.items.unitPrice.val(utils.accDiv($("#totalPrice").val(), $("#buildArea").val()));
	});

	$("#buildArea").on("blur", function(){
		if($("#totalPrice").val() == ""){
			return;
		}
		createHouseSource.items.unitPrice.val(utils.accDiv($("#totalPrice").val(), $("#buildArea").val()));
	});

	$('#fl-statement').statement("房源", "创建房源");

	//创建客户
	$("#createCustomer").click(function(){
		com.cleanItems(createHouseSource.customerItems);
		$("#customerModal").modal("show");
	});

	//编辑OR添加
	function addHouseSource(){

		if(com.validate() || createHouseSource.repeatFlg || !createHouseSource.humFlag){
			houseNumbervali(createHouseSource.houseNumber,createHouseSource.validator.houseNumber.regex,createHouseSource.validator.houseNumber.errorMsg);
			return;
		}
		var options = {};
		var houseOptions = {};

		options["houseSource.type"] = createHouseSource.items.hsType.val();
		options["houseSource.sourceType"] = createHouseSource.items.sourceType.val();
		options["houseSource.customer.cid"] = createHouseSource.items.customerId.val();
		options["houseSource.deedNum"] = createHouseSource.items.deedNum.val();
		options["houseSource.deedValue"] = createHouseSource.items.deedValue.val();
		options["houseSource.unitPrice"] = createHouseSource.items.unitPrice.val();
		options["houseSource.totalPrice"] = createHouseSource.items.totalPrice.val();
		options["houseSource.decorateTime"] = createHouseSource.items.decorateTime.val();
		options["houseSource.decorateDegree"] = createHouseSource.items.decorateDegree.val();
		options["houseSource.discussType"] = createHouseSource.items.discussType.val();
		options["houseSource.rentType"] = createHouseSource.items.rentType.val();
		options["houseSource.indoores"] = createHouseSource.items.indoores.val();
		options["houseSource.history"] = createHouseSource.items.history.val();
		options["houseSource.propertyFee"] = createHouseSource.items.propertyFee.val();
		options["houseSource.elevator"] = createHouseSource.items.elevator.val();
		options["houseSource.onlyHousing"] = createHouseSource.items.onlyHousing.val();
		options["houseSource.documentsDate"] = createHouseSource.items.documentsDate.val();
		options["houseSource.allowLoan"] = createHouseSource.items.allowLoan.val();
		options["houseSource.beingLoan"] = createHouseSource.items.beingLoan.val();
		options["houseSource.checkingTime"] = createHouseSource.items.checkingTime.val();
		options["houseSource.followUser.userId"] = createHouseSource.items.followId.val();
		options["houseSource.housingGrade"] = createHouseSource.items.housingGrade.val();
		options["houseSource.comment"] = createHouseSource.items.comment.val();

		houseOptions["house.village.no"] =  createHouseSource.houseItems.no.val();
		houseOptions["house.houseNumber"] = createHouseSource.houseNumber;
		houseOptions["house.built"] = createHouseSource.houseItems.built.val();
		houseOptions["house.unit"] = createHouseSource.houseItems.unit.val();
		houseOptions["house.floor"] = createHouseSource.houseItems.floor.val();
		houseOptions["house.door"] = createHouseSource.houseItems.door.val();
		houseOptions["house.type"] = createHouseSource.houseItems.type.val();
		houseOptions["house.buildArea"] = utils.changeThrDecimal(createHouseSource.houseItems.buildArea.val());
		houseOptions["house.maxFloor"] = createHouseSource.houseItems.maxFloor.val();
		houseOptions["house.through"] = createHouseSource.houseItems.through.val();
		houseOptions["house.roomNum"] =  createHouseSource.houseItems.houseTypeOne.val();
		houseOptions["house.houseType"] =  createHouseSource.houseItems.houseTypeOne.val() + "室" + createHouseSource.houseItems.houseTypeTwo.val() + "厅" + createHouseSource.houseItems.houseTypeThr.val() + "厨" + createHouseSource.houseItems.houseTypeFour.val() + "卫";
		houseOptions["house.orientation"] = createHouseSource.houseItems.orientation.val();
		houseOptions["house.feature"] = createHouseSource.houseItems.feature.val();
		houseOptions["house.waterVapour"] = createHouseSource.houseItems.waterVapour.val();
		houseOptions["house.parlourType"] =  createHouseSource.houseItems.parlourType.val();
		houseOptions["house.heatingType"] =  createHouseSource.houseItems.heatingType.val();
		houseOptions["house.status"] =  0;

		options["houseSource.type"] = createHouseSource.items.hsType.val();

		if(createHouseSource.houseFlag){
			com.post(api.data.addHouse, houseOptions, function(res){
				options["houseSource.house.hid"] = res.house.hid;
			}, function(e){
				com.showAlert(com.error, "房产已存在！");
			}, false);
		}else{
			options["houseSource.house.hid"]= createHouseSource.houseId;
		}

		com.post(api.building.addHouseSource, options, function(res){
			com.showAlert(com.info, "房源创建成功！");
			deleteDate();
		});

	}

	//创建客户
	function createCustomer(){

		if(createHouseSource.customerItems.cardType.val() == "身份证"){
			regCard(createHouseSource.customerItems.cardNum, /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
		}else if(createHouseSource.customerItems.cardType.val() == "军官证"){
			regCard(createHouseSource.customerItems.cardNum, /^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/);
		}

		if(com.validate("customerModal") || createHouseSource.customerRepeatFlg || createHouseSource.cardFlag){
			return;
		}

		var customerOptions = {};
		switch($("#cardType").val())
		{
			case "身份证":
				customerOptions["customer.identity"]  = $("#cardNum").val();
				break;
			case "军官证":
				customerOptions["customer.officer"] = $("#cardNum").val();
				break;
			case "护照":
				customerOptions["customer.passport"] = $("#cardNum").val();
				break;
		}

		customerOptions["customer.name"] =  createHouseSource.customerItems.customerName.val();
		customerOptions["customer.gender"] = com.genderType[createHouseSource.customerItems.gender.prop("checked")];
		customerOptions["customer.qq"] = createHouseSource.customerItems.qq.val();
		customerOptions["customer.wechat"] = createHouseSource.customerItems.wechat.val();
		customerOptions["customer.email"] = createHouseSource.customerItems.email.val();
		customerOptions["customer.relationshipType"] = createHouseSource.customerItems.relationshipType.val();
		customerOptions["customer.address"] =  createHouseSource.customerItems.address.val();
		customerOptions["customer.phone"] =  createHouseSource.customerItems.phone.val();

		com.post(api.data.addCustomer, customerOptions, function(res){
			com.showAlert(com.info, "创建用户成功");
			createHouseSource.customerId = res.customer.cid;

			$("#customerId").html('<option value="'+res.customer.cid+'">'+res.customer.name+'-'+res.customer.phone+'</option>');
			$("#customerId").trigger("chosen:updated");

			$("#customerModal").modal("hide");

		}, function(e){
			com.showAlert(com.warning, "客户电话已存在！");
		}, false);
	}

	//清除数据
	function deleteDate(){
		houseItemsReadOnlyFlag(false);
		com.updateChosen("customerId", "", "");
		com.updateChosen("no", "", "");
		com.updateChosen("followId", "", "");

		$(".tag").remove();
		createHouseSource.houseItems.buildingRuleContent.html("");
		createHouseSource.validator.houseNumber.type="v_houseNumber";
		createHouseSource.validator.houseNumber.regex="";
		createHouseSource.validator.houseNumber.errorMsg="";
		$("#ohousetype").css("display", "none");
		$("#nhousetype").removeAttr("style");
		com.cleanItems(createHouseSource.items);
		com.cleanItems(createHouseSource.houseItems);
		com.cleanItems(createHouseSource.customerItems);
		com.clearValidator();
	}

	//删除房产数据
	function deleteHouseData(){
		$("#ohousetype").css("display", "none");
		$("#nhousetype").removeAttr("style");
		$(".tag").remove();

		createHouseSource.houseItems.houseTypeOne.val("");
		createHouseSource.houseItems.houseTypeTwo.val("");
		createHouseSource.houseItems.houseTypeThr.val("");
		createHouseSource.houseItems.houseTypeFour.val("");
		createHouseSource.houseItems.type.val(0);
		createHouseSource.houseItems.buildArea.val("");
		createHouseSource.houseItems.maxFloor.val("");
		createHouseSource.houseItems.through.val(0);
		createHouseSource.houseItems.orientation.val(0);
		createHouseSource.houseItems.feature.val("");
		createHouseSource.houseItems.waterVapour.val(0);
		createHouseSource.houseItems.parlourType.val(0);
		createHouseSource.houseItems.heatingType.val(0);
	}

	function bindHouseData(houses){
		com.updateChosen("no", houses.village.no, houses.village.name);
		$("#nhousetype").css("display", "none");
		$("#ohousetype").removeAttr("style");
		createHouseSource.houseItems.type.val(houses.type);
		createHouseSource.houseItems.buildArea.val(houses.buildArea);
		createHouseSource.houseItems.maxFloor.val(houses.maxFloor);
		createHouseSource.houseItems.through.val(houses.through);
		createHouseSource.houseItems.oldhousetype.val(houses.houseType);
		createHouseSource.houseItems.orientation.val(houses.orientation);
		createHouseSource.houseItems.feature.val(houses.feature);
		createHouseSource.houseItems.waterVapour.val(houses.waterVapour);
		createHouseSource.houseItems.parlourType.val(houses.parlourType);
		createHouseSource.houseItems.heatingType.val(houses.heatingType);
	}

	//楼牌号数据规则的限定
	function buildruleval(){
		if(createHouseSource.houseItems.nameRuleSel.val() == null || createHouseSource.houseItems.nameRuleSel.val() == ""){
			return;
		}

		com.post(api.common.queryBuildingNameRuleById, {"buildingNameRule.id":createHouseSource.houseItems.nameRuleSel.val()}, function(res){

			createHouseSource.validator.houseNumber["regex"] = eval("/^" + res.buildingNameRule.rule+"$/g");
			createHouseSource.validator.houseNumber["errorMsg"] = "楼盘名称规则(" + res.buildingNameRule.ruleContent+")";

			$("#buildingRuleContent").html("说明："+ res.buildingNameRule.ruleContent + ";eg." + res.buildingNameRule.ruleExample);
			createHouseSource.rulefill = res.buildingNameRule.rulefill
		}, null, false);
	}

	//rulefill改为楼牌号
	function changetohousenum(temp, arr){
		var str = temp;
		if(arr != "" && arr != "0" ){
			if(temp.indexOf("{}") != -1){
				var num = temp.indexOf("{}");
				str = temp.substring(0, num) + arr + temp.substring(num + 2);
			}else{
				str = str + "-" + arr;
			}
		}
		return str;
	}

	//验证楼牌号的是否符合正则
	function houseNumbervali(houseNumber, regex, errorMsg){
		var re = new RegExp(regex);
		if (re.test(houseNumber)) {
			$("#built").css("border", "1px solid #d5d5d5").popover("destroy")
			return true;
		}else{
			com.showPopover($("#built"),{errorMsg: errorMsg}, "top");
			return false;
		}
	}

	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				createHouseSource.cardFlag = true;
				com.showPopover(cardParam,{errorMsg: "请输入正确的证件号码！"}, "right");
			}else{
				createHouseSource.cardFlag = false;
				cardParam.css("border", "1px solid #d5d5d5").popover("destroy")
			}
		}else{
			createHouseSource.cardFlag = false;
			cardParam.css("border", "1px solid #d5d5d5").popover("destroy")
		}
	}

	//删除数据
	function deleteVillageData(paramFlag){
		switch(paramFlag)
		{
			case "built":
				createHouseSource.houseItems.unit.val("");
				createHouseSource.houseItems.floor.val("");
				createHouseSource.houseItems.door.val("");
				break;
			case "unit":
				createHouseSource.houseItems.floor.val("");
				createHouseSource.houseItems.door.val("");
				break;
			case "floor":
				createHouseSource.houseItems.door.val("");
				break;
			case "nameRuleSel":
				createHouseSource.houseItems.built.val("");
				createHouseSource.houseItems.unit.val("");
				createHouseSource.houseItems.floor.val("");
				createHouseSource.houseItems.door.val("");
				$("#door").css("border", "1px solid #d5d5d5").popover("destroy");
				$("#built").popover("destroy");
				break;
			case "no":
				deleteHouseData();
				break;
		}
	}

	function houseItemsReadOnlyFlag(flag){
		if(!flag){
			$("#ohousetype").css("display", "none");
			$("#nhousetype").removeAttr("style");
		}

		createHouseSource.houseItems.type.prop("disabled", flag);
		createHouseSource.houseItems.maxFloor.prop("readonly", flag);
		createHouseSource.houseItems.buildArea.prop("readonly", flag);
		createHouseSource.houseItems.orientation.prop("disabled", flag);
		createHouseSource.houseItems.through.prop("disabled", flag);
		createHouseSource.houseItems.parlourType.prop("disabled", flag);
		createHouseSource.houseItems.heatingType.prop("disabled", flag);
		createHouseSource.houseItems.waterVapour.prop("disabled", flag);
		createHouseSource.houseItems.feature.prop("disabled", flag);
	}

});
