
jQuery(function($) {
    
	var createHouseSource = {

		btns: {
			
			saveBtn: com.focusPage("#saveBtn"),
			cancelBtn: com.focusPage("#cancelBtn"),
			deployedBtn: com.focusPage("#deployedBtn"),
			createCustomerSaveBtn: com.focusPage("#createCustomerSaveBtn")
			
		},

		modals: {

			customerModal: com.focusPage("#customerModal")

		},

		items: {
			
			customerId: com.focusPage("#customerId"),
			hsType: com.focusPage("#hsType"),
			sourceType: com.focusPage("#sourceType"),
			deedNum: com.focusPage("#deedNum"),
			deedValue: com.focusPage("#deedValue"),
			unitPrice: com.focusPage("#unitPrice"),
			totalPrice: com.focusPage("#totalPrice"),
			decorateTime: com.focusPage("#decorateTime"),
			decorateDegree: com.focusPage("#decorateDegree"),
			discussType: com.focusPage("#discussType"),
			rentType: com.focusPage("#rentType"),
			indoores: com.focusPage("#indoores"),
			history: com.focusPage("#history"),
			propertyFee: com.focusPage("#propertyFee"),
			elevator: com.focusPage("#elevator"),
			onlyHousing: com.focusPage("#onlyHousing"),
			documentsDate: com.focusPage("#documentsDate"),
			allowLoan: com.focusPage("#allowLoan"),
			beingLoan: com.focusPage("#beingLoan"),
			checkingTime: com.focusPage("#checkingTime"),
			followId: com.focusPage("#followId"),
			keyerId: com.focusPage("#keyerId"),
			housingGrade: com.focusPage("#housingGrade"),
			comment: com.focusPage("#comment"),
			gender: com.focusPage("#gender")
			
		},
		
		customerItems: {
			
			customerName: com.focusPage("#customerName"),
			cardType: com.focusPage("#cardType"),
			cardNum: com.focusPage("#cardNum"),
			gender: com.focusPage("#gender"),
			qq: com.focusPage("#qq"),
			wechat: com.focusPage("#wechat"),
			email: com.focusPage("#email"),
			relationshipType: com.focusPage("#relationshipType"),
			address: com.focusPage("#address"),
			phone: com.focusPage("#phone")
			
		},

		houseItems: {

			villageId: com.focusPage("#villageId"),
			rule: com.focusPage("#rule"),
			built: com.focusPage("#built"),
			unit: com.focusPage("#unit"),
			floor: com.focusPage("#floor"),
			door: com.focusPage("#door"),
			builtrule: com.focusPage("#builtrule"),
			unitrule: com.focusPage("#unitrule"),
			floorrule: com.focusPage("#floorrule"),
			doorrule: com.focusPage("#doorrule"),
			type: com.focusPage("#type"),
			buildArea: com.focusPage("#buildArea"),
			maxFloor: com.focusPage("#maxFloor"),
			through: com.focusPage("#through"),
			houseTypeOne: com.focusPage("#houseTypeOne"),
			houseTypeTwo: com.focusPage("#houseTypeTwo"),
			houseTypeThr: com.focusPage("#houseTypeThr"),
			houseTypeFour: com.focusPage("#houseTypeFour"),
			orientation: com.focusPage("#orientation"),
			feature: com.focusPage("#feature"),
			waterVapour: com.focusPage("#waterVapour"),
			parlourType: com.focusPage("#parlourType"),
			heatingType: com.focusPage("#heatingType"),
			oldhousetype: com.focusPage("#oldhousetype")
			
		},

		houseSources: {},
		modal: null,
		nameRuleList: [],
		rulenum: [],
		valideteresult: {},
		rulefill: null,

		editFlg: false,
		houseSourceId: null,
		customerId: null,
		houseNumber: null,
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

	com.datetime(createHouseSource.items.decorateTime);
	com.datetime(createHouseSource.items.documentsDate);
	com.datetime(createHouseSource.items.checkingTime);

	createHouseSource.modals.customerModal.on("hide.bs.modal", function(){

		com.cleanItems(createHouseSource.customerItems);
		com.closeTip();
	});

	createHouseSource.items.gender.switchBtn("gender");
	createHouseSource.btns.saveBtn.bindClick(addHouseSource);
	createHouseSource.btns.cancelBtn.on("click", deleteDate);
	createHouseSource.btns.createCustomerSaveBtn.on("click", createCustomer);

	com.post(api.ds.building, {}, function (res) {
		createHouseSource.history = res.history.split("key", "value");

		createHouseSource.items.history.bindData(res.history, "key", "value", false);
	});

	com.post(api.ds.building, {}, function (res) {
		createHouseSource.cardType = res.cardType;

		createHouseSource.customerItems.cardType.bindData(res.cardType, "key", "value", false);
	});

	com.post(api.ds.building, {}, function (res) {
		createHouseSource.housingGrade = res.grade.split("key", "value");

		createHouseSource.items.housingGrade.bindData(res.grade, "key", "value", false);
	});

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

        com.post(api.data.queryVillageByVid, {"village.no" : key}, function(res){
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

	// 检查电话号是否已存在
	createHouseSource.customerItems.phone = com.focusPage("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showTip(com.focusPage("#phone"), "电话号码不能为空", "right"), createHouseSource.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			createHouseSource.customerRepeatFlg = false;
		}, function(res){
			createHouseSource.customerRepeatFlg = true;
			com.showTip(com.focusPage("#phone"), "电话号码已存在", "right");
		});
	});

	// 填写单价
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

	// 创建客户
	com.focusPage("#createCustomer").click(function(){
		createHouseSource.modals.customerModal.modal("show");
	});

	// 编辑OR添加
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

	// 创建客户
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

			createHouseSource.modals.customerModal.modal("hide");

		}, function(e){
			com.showAlert(com.warning, "客户电话已存在");
		}, false);
	}

	// 清除数据
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
		
	}

	// 删除房产数据
	function deleteHouseData(){
	    
		com.focusPage("#ohousetype").css("display", "none");
		com.focusPage("#nhousetype").removeAttr("style");
		com.focusPage(".tag").remove();
		
		com.cleanItems(createHouseSource.houseItems);
	}

	// 检查房产以及房源是否存在
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
				// 绑定房产数据
				bindHouseData(houses);
				houseItemsReadOnlyFlag(true);
			}, function(res){
				createHouseSource.houseFlag = false;
				com.showTip(com.focusPage("#door"), "该房源已存在", "bottom");
			}, false);
		}else{
			createHouseSource.houseFlag = true;
			// deleteHouseData();
			houseItemsReadOnlyFlag(false);
		}
	}

	// 绑定房产数据
	function bindHouseData(houses){
	    
	    com.updateTypeahead("villageId", houses.village.no, houses.village.name);
	    
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

	// 验证证件号码
	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				createHouseSource.cardFlag = true;
				com.showTip(cardParam, "请输入正确的证件号码", "right");
			}else{
				createHouseSource.cardFlag = false;
			}
		}else{
			createHouseSource.cardFlag = false;
		}
	}

	// 删除楼牌号数据
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

		var validateresult={};

		if(createHouseSource.houseItems.villageId.val() == "" ){
			com.showTip(createHouseSource.houseItems.no, "请先选择楼盘!", "right");
		}

		validateresult.rulenum = [
			createHouseSource.houseItems.built.val().trim().toUpperCase(), createHouseSource.houseItems.builtrule.val(),
			createHouseSource.houseItems.unit.val().trim().toUpperCase(), createHouseSource.houseItems.unitrule .val(),
			createHouseSource.houseItems.floor.val().trim().toUpperCase(), createHouseSource.houseItems.floorrule.val(),
			createHouseSource.houseItems.door.val().trim().toUpperCase(), createHouseSource.houseItems.doorrule.val()];

		validateresult.houseNumber =houseUtils.creatHouseNumber(validateresult.rulenum);

		validateresult.prehouse = houseUtils.validatehouse(com.typeahead("villageId"),validateresult.houseNumber,null,createHouseSource.houseItems.errMsg,false);

		createHouseSource.valideteresult = validateresult;

		if(createHouseSource.valideteresult.prehouse != undefined){
			createHouseSource.HFlag = createHouseSource.valideteresult.prehouse.Flag;
		}

		createHouseSource.houseNumber = createHouseSource.valideteresult.houseNumber;
	}

});
