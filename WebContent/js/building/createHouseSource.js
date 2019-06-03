
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
		valideteresult: {},
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
		HFlag: false,
		houseFlag: false,
		repeatCustomerFlg: false,
		cardFlag: false,
		isAddHouseSource: true
	};
	
	com.focusPage('#fl-statement').statement("房源", "创建房源");

	com.initTag("indoores");
	com.initTag("feature");

	com.focusPage("#history").bindData(createHouseSource.history);
	com.focusPage("#cardType").bindData(createHouseSource.cardType);
	com.focusPage("#housingGrade").bindData(createHouseSource.housingGrade);

	com.focusPage(".date-picker").datepicker({autoclose: !0}).on("show",function() {
		setTimeout(function() {
			com.focusPage(".dropdown-menu").css("z-index", 1060)
		}, 0)
	}).next().on(ace.click_event,function() {
		a(this).prev().focus()
	});

	createHouseSource.modal = com.focusPage("#createHouseSource");
	createHouseSource.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	createHouseSource.items.gender = com.focusPage("#gender").switchBtn("gender");

	createHouseSource.saveBtn = com.focusPage("#saveBtn").bindClick(addHouseSource);
	createHouseSource.cancelBtn = com.focusPage("#cancelBtn").on("click", deleteDate);
	createHouseSource.createCustomerSaveBtn = com.focusPage("#createCustomerSaveBtn").on("click", createCustomer);

	createHouseSource.items.customerId = com.focusPage("#customerId");
	createHouseSource.items.hsType = com.focusPage("#hsType");
	createHouseSource.items.sourceType = com.focusPage("#sourceType");
	createHouseSource.items.deedNum = com.focusPage("#deedNum");
	createHouseSource.items.deedValue = com.focusPage("#deedValue");
	createHouseSource.items.unitPrice = com.focusPage("#unitPrice");
	createHouseSource.items.totalPrice = com.focusPage("#totalPrice");
	createHouseSource.items.decorateTime = com.focusPage("#decorateTime");
	createHouseSource.items.decorateDegree = com.focusPage("#decorateDegree");
	createHouseSource.items.discussType = com.focusPage("#discussType");
	createHouseSource.items.rentType = com.focusPage("#rentType");
	createHouseSource.items.indoores = com.focusPage("#indoores");
	createHouseSource.items.history = com.focusPage("#history");
	createHouseSource.items.propertyFee = com.focusPage("#propertyFee");
	createHouseSource.items.elevator = com.focusPage("#elevator");
	createHouseSource.items.onlyHousing = com.focusPage("#onlyHousing");
	createHouseSource.items.documentsDate = com.focusPage("#documentsDate");
	createHouseSource.items.allowLoan = com.focusPage("#allowLoan");
	createHouseSource.items.beingLoan = com.focusPage("#beingLoan");
	createHouseSource.items.checkingTime = com.focusPage("#checkingTime");
	createHouseSource.items.followId = com.focusPage("#followId");
	createHouseSource.items.keyerId = com.focusPage("#keyerId");
	createHouseSource.items.housingGrade = com.focusPage("#housingGrade");
	createHouseSource.items.comment = com.focusPage("#comment");

	createHouseSource.customerItems.customerName = com.focusPage("#customerName");
	createHouseSource.customerItems.cardType = com.focusPage("#cardType");
	createHouseSource.customerItems.cardNum = com.focusPage("#cardNum");
	createHouseSource.customerItems.gender = com.focusPage("#gender");
	createHouseSource.customerItems.qq = com.focusPage("#qq");
	createHouseSource.customerItems.wechat = com.focusPage("#wechat");
	createHouseSource.customerItems.email = com.focusPage("#email");
	createHouseSource.customerItems.relationshipType = com.focusPage("#relationshipType");
	createHouseSource.customerItems.address = com.focusPage("#address");
	createHouseSource.customerItems.phone = com.focusPage("#phone");

	createHouseSource.houseItems.no = com.focusPage("#no");
	createHouseSource.houseItems.rule = com.focusPage("#rule");
	createHouseSource.houseItems.built = com.focusPage("#built");
	createHouseSource.houseItems.unit = com.focusPage("#unit");
	createHouseSource.houseItems.floor = com.focusPage("#floor");
	createHouseSource.houseItems.door = com.focusPage("#door");
	createHouseSource.houseItems.builtrule = com.focusPage("#builtrule");
	createHouseSource.houseItems.unitrule = com.focusPage("#unitrule");
	createHouseSource.houseItems.floorrule = com.focusPage("#floorrule");
	createHouseSource.houseItems.doorrule = com.focusPage("#doorrule");
	createHouseSource.houseItems.type = com.focusPage("#type");
	createHouseSource.houseItems.buildArea = com.focusPage("#buildArea");
	createHouseSource.houseItems.maxFloor = com.focusPage("#maxFloor");
	createHouseSource.houseItems.through = com.focusPage("#through");
	createHouseSource.houseItems.houseTypeOne = com.focusPage("#houseTypeOne");
	createHouseSource.houseItems.houseTypeTwo = com.focusPage("#houseTypeTwo");
	createHouseSource.houseItems.houseTypeThr = com.focusPage("#houseTypeThr");
	createHouseSource.houseItems.houseTypeFour= com.focusPage("#houseTypeFour");
	createHouseSource.houseItems.orientation = com.focusPage("#orientation");
	createHouseSource.houseItems.feature = com.focusPage("#feature");
	createHouseSource.houseItems.waterVapour = com.focusPage("#waterVapour");
	createHouseSource.houseItems.parlourType = com.focusPage("#parlourType");
	createHouseSource.houseItems.heatingType = com.focusPage("#heatingType");
	createHouseSource.houseItems.oldhousetype = com.focusPage("#oldhousetype");

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
		createHouseSource.houseItems.builtrule.bindData(res.buildrule,"key", "value");
		createHouseSource.houseItems.unitrule.bindData(res.buildrule,"key", "value");
		createHouseSource.houseItems.floorrule.bindData(res.buildrule,"key", "value");
		createHouseSource.houseItems.doorrule.bindData(res.buildrule,"key", "value");
	}, null, false);

	com.post(api.ds.data, {}, function(res){
		createHouseSource.customerItems.relationshipType.bindData(res.relationshipType, "key", "value");
	}, null, false);

	com.initTypeahead('followId', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name":"", "user.status":0}, "autoFillKeyValue", "key", "value");
	com.initTypeahead('keyerId', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name":"", "user.status":0}, "autoFillKeyValue", "key", "value");
	com.initTypeahead('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
	com.initTypeahead('villageId', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, key, value){
	    houseItemsReadOnlyFlag(false);

        com.post(api.data.queryVillageById, {"village.no" : key}, function(res){
            createHouseSource.houseItems.rule.html("推荐楼牌号规则: " + res.village.rule ? res.village.rule :"暂无推荐规则");
        }, null, false);
        
        return value;
	});

	createHouseSource.houseItems.built = com.focusPage("#built").on("change", function(e){
		deleteVillageData("built");
		houseItemsReadOnlyFlag(false);
	});
	createHouseSource.houseItems.unit = com.focusPage("#unit").on("change", function(e){
		deleteVillageData("unit");
		houseItemsReadOnlyFlag(false);
	});
	createHouseSource.houseItems.floor = com.focusPage("#floor").on("change", function(e){
		deleteVillageData("floor");
		houseItemsReadOnlyFlag(false);
	});

	createHouseSource.houseItems.builtrule.on("change", function(e){
		checkHouseAndHouseSource("builtrule");
	});
	createHouseSource.houseItems.unitrule.on("change", function(e){
		checkHouseAndHouseSource("unitrule");
	});
	createHouseSource.houseItems.floorrule.on("change",function(e){
		checkHouseAndHouseSource("floorrule");
	});
	createHouseSource.houseItems.doorrule.on("change",function(e){
		checkHouseAndHouseSource("doorrule");
	});

	createHouseSource.items.hsType.on("change", function(e){
		checkHouseAndHouseSource("hsType");
	});

	createHouseSource.houseItems.door = com.focusPage("#door").on("blur", function(e){
		checkHouseAndHouseSource("door");
	});

	//检查电话号是否已存在
	createHouseSource.customerItems.phone = com.focusPage("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showPopover(com.focusPage("#phone"),{errorMsg: "电话号码不能为空"}, "right"), createHouseSource.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			createHouseSource.customerRepeatFlg = true;
			com.showPopover(com.focusPage("#phone"),{errorMsg: "电话号码已存在"}, "right");

		}, function(res){
			createHouseSource.customerRepeatFlg = false;
			com.focusPage("#phone").css("border", "1px solid #d5d5d5").popover("destroy")
		});
	});

	//填写单价
	com.focusPage("#totalPrice").on("blur", function(){
		if(com.focusPage("#buildArea").val() == ""){
			return;
		}
		createHouseSource.items.unitPrice.val(utils.accDiv(com.focusPage("#totalPrice").val(), com.focusPage("#buildArea").val()));
	});

	com.focusPage("#buildArea").on("blur", function(){
		if(com.focusPage("#totalPrice").val() == ""){
			return;
		}
		createHouseSource.items.unitPrice.val(utils.accDiv(com.focusPage("#totalPrice").val(), com.focusPage("#buildArea").val()));
	});

	//创建客户
	com.focusPage("#createCustomer").click(function(){
		com.cleanItems(createHouseSource.customerItems);
		com.focusPage("#customerModal").modal("show");
	});

	//编辑OR添加
	function addHouseSource(){

		if(com.validate("createHouseRow") || createHouseSource.repeatFlg){
			return false;
		}
		var options = {};
		var houseOptions = {};
		
		options["houseSource.type"] = createHouseSource.items.hsType.val();
		options["houseSource.sourceType"] = createHouseSource.items.sourceType.val();
		options["houseSource.customer.cid"] = com.typeahead("customerId");
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
		options["houseSource.followUser.userId"] = com.typeahead("followId");
		options["houseSource.keyer.userId"] = com.typeahead("keyerId");
		options["houseSource.housingGrade"] = createHouseSource.items.housingGrade.val();
		options["houseSource.comment"] = createHouseSource.items.comment.val();

		houseOptions["house.village.no"] =  com.typeahead("villageId");
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

		if(createHouseSource.houseFlag){
			com.post(api.data.addHouse, houseOptions, function(res){
				options["houseSource.house.hid"] = res.house.hid;
				createHouseSource.isAddHouseSource == true;
			}, function(e){
				createHouseSource.isAddHouseSource == false;
				com.showAlert(com.error, "房产已存在");
			}, false);
		}else{
			options["houseSource.house.hid"]= createHouseSource.houseId;
		}

		if(createHouseSource.isAddHouseSource){
			com.post(api.building.addHouseSource, options, function(res){
				com.showAlert(com.info, "房源创建成功");
				deleteDate();
			});
		}
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
		switch(com.focusPage("#cardType").val())
		{
			case "身份证":
				customerOptions["customer.identity"]  = com.focusPage("#cardNum").val();
				break;
			case "军官证":
				customerOptions["customer.officer"] = com.focusPage("#cardNum").val();
				break;
			case "护照":
				customerOptions["customer.passport"] = com.focusPage("#cardNum").val();
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

			com.focusPage("#customerModal").modal("hide");

		}, function(e){
			com.showAlert(com.warning, "客户电话已存在");
		}, false);
	}

	//清除数据
	function deleteDate(){
	    
		houseItemsReadOnlyFlag(false);
		
		com.cleanTypeahead("followId");
        com.cleanTypeahead("keyerId");
		com.cleanTypeahead("customerId");
		com.cleanTypeahead("villageId");
		
		com.focusPage(".tag").remove();
		createHouseSource.houseItems.rule.html("");
		com.focusPage("#ohousetype").css("display", "none");
		com.focusPage("#nhousetype").removeAttr("style");
		
		com.cleanItems(createHouseSource.items);
		com.cleanItems(createHouseSource.houseItems);
		com.cleanItems(createHouseSource.customerItems);
		
		com.clearValidator();
	}

	//删除房产数据
	function deleteHouseData(){
	    
		com.focusPage("#ohousetype").css("display", "none");
		com.focusPage("#nhousetype").removeAttr("style");
		com.focusPage(".tag").remove();
		
		com.cleanItems(createHouseSource.houseItems);
	}

	//检查房产以及房源是否存在
	function checkHouseAndHouseSource(inputId){
		validatehouse();

		if(createHouseSource.HFlag){
			var houses = createHouseSource.valideteresult.prehouse.house;
			createHouseSource.houseId = houses.hid;

			var hsOptions = {
				"houseSource.house.hid": houses.hid,
				"houseSource.type": createHouseSource.items.hsType.val()
			};

			com.post(api.building.checkHouseSource, hsOptions, function(data){
				createHouseSource.houseFlag = false;
				com.showPopover(com.focusPage("#door"),{errorMsg: "该房源已存在"}, "bottom");
			}, function(res){
				createHouseSource.houseFlag = false;
				//绑定房产数据
				bindHouseData(houses);
				houseItemsReadOnlyFlag(true);
				com.focusPage("#door").css("border", "1px solid #d5d5d5").popover("destroy");
			}, false);
		}else{
			createHouseSource.houseFlag = true;
			//deleteHouseData();
			houseItemsReadOnlyFlag(false);
			com.focusPage("#" + inputId).css("border", "1px solid #d5d5d5").popover("destroy");
		}
	}

	//绑定房产数据
	function bindHouseData(houses){
	    
	    com.updateTypeahead("no", houses.village.no, houses.village.name);
	    
		com.focusPage("#nhousetype").css("display", "none");
		com.focusPage("#ohousetype").removeAttr("style");
		
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

	//验证证件号码
	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				createHouseSource.cardFlag = true;
				com.showPopover(cardParam,{errorMsg: "请输入正确的证件号码"}, "right");
			}else{
				createHouseSource.cardFlag = false;
				cardParam.css("border", "1px solid #d5d5d5").popover("destroy")
			}
		}else{
			createHouseSource.cardFlag = false;
			cardParam.css("border", "1px solid #d5d5d5").popover("destroy")
		}
	}

	//删除楼牌号数据
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
			case "no":
				createHouseSource.houseItems.built.val("");
				createHouseSource.houseItems.unit.val("");
				createHouseSource.houseItems.floor.val("");
				createHouseSource.houseItems.door.val("");
				createHouseSource.houseItems.builtrule.get(0).selectedIndex = 0;
				createHouseSource.houseItems.unitrule.get(0).selectedIndex = 0;
				createHouseSource.houseItems.floorrule.get(0).selectedIndex = 0;
				createHouseSource.houseItems.doorrule.get(0).selectedIndex = 0;
				com.focusPage("#door").popover("destroy");
				deleteHouseData();
				break;
		}
	}

	function houseItemsReadOnlyFlag(flag){
		if(!flag){
			com.focusPage("#ohousetype").css("display", "none");
			com.focusPage("#nhousetype").removeAttr("style");
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

	function  validatehouse(){
		createHouseSource.valideteresult = houseUtils.anytimevalidate(createHouseSource.houseItems, null, false);

		if(createHouseSource.valideteresult.prehouse != undefined){
			createHouseSource.HFlag = createHouseSource.valideteresult.prehouse.Flag;
		}

		createHouseSource.houseNumber = createHouseSource.valideteresult.houseNumber;
	}

});
