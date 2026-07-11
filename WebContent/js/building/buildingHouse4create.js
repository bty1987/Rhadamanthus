
jQuery(function($) {
    
	var buildingHouse = {

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

		buildingHouses: {},
		modal: null,
		nameRuleList: [],
		rulenum: [],
		valideteresult: {},
		rulefill: null,

		editFlg: false,
		buildingHouseId: null,
		customerId: null,
		houseNumber: null,
		houseId: null,
		buildingJson:null,
		repeatFlg: false,
		HFlag: false,
		houseFlag: false,
		repeatCustomerFlg: false,
		cardFlag: false,
		isAddBuildingHouse: true
	};

	com.focusPage('#fl-statement').statement("房源", "创建房源");

	com.datetime(buildingHouse.items.decorateTime);
	com.datetime(buildingHouse.items.documentsDate);
	com.datetime(buildingHouse.items.checkingTime);

	buildingHouse.modals.customerModal.on("hide.bs.modal", function(){

		com.cleanItems(buildingHouse.customerItems);
		com.closeTip();
	});

	buildingHouse.items.gender.switchBtn("gender");
	buildingHouse.btns.saveBtn.bindClick(addBuildingHouse);
	buildingHouse.btns.cancelBtn.on("click", deleteDate);
	buildingHouse.btns.createCustomerSaveBtn.on("click", createCustomer);

	buildingHouse.history = constant.building().buildingHouse.history.keys;

	buildingHouse.items.history.bindData(constant.building().buildingHouse.history.datas, "key", "value", false);

	buildingHouse.cardType = constant.building().building.cardType.datas;

	buildingHouse.customerItems.cardType.bindData(constant.building().building.cardType.datas, "key", "value", false);

	buildingHouse.housingGrade = constant.building().buildingCustomer.grade.keys;

	buildingHouse.items.housingGrade.bindData(constant.building().buildingCustomer.grade.datas, "key", "value", false);

	buildingHouse.items.hsType.bindData(constant.building().buildingHouse.type.datas, "key", "value");
	buildingHouse.items.discussType.bindData(constant.building().buildingHouse.discussType.datas, "key", "value");
	buildingHouse.items.decorateDegree.bindData(constant.building().buildingHouse.decorateDegree.datas, "key", "value");
	buildingHouse.items.elevator.bindData(constant.building().buildingHouse.elevator.datas, "key", "value");
	buildingHouse.items.onlyHousing.bindData(constant.building().buildingHouse.onlyHousing.datas, "key", "value");
	buildingHouse.items.allowLoan.bindData(constant.building().buildingHouse.allowLoan.datas, "key", "value");
	buildingHouse.items.beingLoan.bindData(constant.building().buildingHouse.beingLoan.datas, "key", "value");
	buildingHouse.items.sourceType.bindData(constant.building().buildingHouse.sourceType.datas, "key", "value");
	buildingHouse.items.allowLoan.bindData(constant.building().buildingHouse.allowLoan.datas, "key", "value");
	buildingHouse.items.beingLoan.bindData(constant.building().buildingHouse.beingLoan.datas, "key", "value");
	buildingHouse.items.rentType.bindData(constant.building().buildingHouse.rentType.datas, "key", "value");

	buildingHouse.houseItems.orientation.bindData(constant.building().house.orientation.datas, "key", "value");
	buildingHouse.houseItems.type.bindData(constant.building().house.houseType.datas, "key", "value");
	buildingHouse.houseItems.waterVapour.bindData(constant.building().house.waterVapour.datas, "key", "value");
	buildingHouse.houseItems.heatingType.bindData(constant.building().house.heatingType.datas, "key", "value");
	buildingHouse.houseItems.through.bindData(constant.building().house.through.datas, "key", "value");
	buildingHouse.houseItems.parlourType.bindData(constant.building().house.parlourType.datas, "key", "value");
	buildingHouse.houseItems.builtrule.bindData(constant.building().building.buildrule.datas,"key", "value");
	buildingHouse.houseItems.unitrule.bindData(constant.building().building.buildrule.datas,"key", "value");
	buildingHouse.houseItems.floorrule.bindData(constant.building().building.buildrule.datas,"key", "value");
	buildingHouse.houseItems.doorrule.bindData(constant.building().building.buildrule.datas,"key", "value");

	buildingHouse.customerItems.relationshipType.bindData(constant.customer().customer.relationshipType.datas, "key", "value");

	com.initTypeahead('followId', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name":"", "user.status":0}, "autoFillKeyValue", "key", "value");
	com.initTypeahead('keyerId', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name":"", "user.status":0}, "autoFillKeyValue", "key", "value");
	com.initTypeahead('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
	com.initTypeahead('villageId', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, key, value){
	    houseItemsReadOnlyFlag(false);

        com.post(api.data.queryVillageByVid, {"village.no" : key}, function(res){
            buildingHouse.houseItems.rule.html("推荐楼牌号规则: " + res.village.rule ? res.village.rule :"暂无推荐规则");
        }, null, false);
        
        return value;
	});

	buildingHouse.houseItems.built = com.focusPage("#built").on("change", function(e){
		deleteVillageData("built");
		houseItemsReadOnlyFlag(false);
	});
	buildingHouse.houseItems.unit = com.focusPage("#unit").on("change", function(e){
		deleteVillageData("unit");
		houseItemsReadOnlyFlag(false);
	});
	buildingHouse.houseItems.floor = com.focusPage("#floor").on("change", function(e){
		deleteVillageData("floor");
		houseItemsReadOnlyFlag(false);
	});

	buildingHouse.houseItems.builtrule.on("change", function(e){
		checkHouseAndBuildingHouse("builtrule");
	});
	buildingHouse.houseItems.unitrule.on("change", function(e){
		checkHouseAndBuildingHouse("unitrule");
	});
	buildingHouse.houseItems.floorrule.on("change",function(e){
		checkHouseAndBuildingHouse("floorrule");
	});
	buildingHouse.houseItems.doorrule.on("change",function(e){
		checkHouseAndBuildingHouse("doorrule");
	});

	buildingHouse.items.hsType.on("change", function(e){
		checkHouseAndBuildingHouse("hsType");
	});

	buildingHouse.houseItems.door = com.focusPage("#door").on("blur", function(e){
		checkHouseAndBuildingHouse("door");
	});

	// 检查电话号是否已存在
	buildingHouse.customerItems.phone = com.focusPage("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showTip(com.focusPage("#phone"), "电话号码不能为空", "right"), buildingHouse.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			buildingHouse.customerRepeatFlg = false;
		}, function(res){
			buildingHouse.customerRepeatFlg = true;
			com.showTip(com.focusPage("#phone"), "电话号码已存在", "right");
		});
	});

	// 填写单价
	com.focusPage("#totalPrice").on("blur", function(){
		if(com.focusPage("#buildArea").val() == ""){
			return;
		}
		buildingHouse.items.unitPrice.val(utils.accDiv(com.focusPage("#totalPrice").val(), com.focusPage("#buildArea").val()));
	});

	com.focusPage("#buildArea").on("blur", function(){
		if(com.focusPage("#totalPrice").val() == ""){
			return;
		}
		buildingHouse.items.unitPrice.val(utils.accDiv(com.focusPage("#totalPrice").val(), com.focusPage("#buildArea").val()));
	});

	// 创建客户
	com.focusPage("#createCustomer").click(function(){
		buildingHouse.modals.customerModal.modal("show");
	});

	// 编辑OR添加
	function addBuildingHouse(){

		if(com.validate("createHouseRow") || buildingHouse.repeatFlg){
			return false;
		}
		var options = {};
		var houseOptions = {};
		
		options["buildingHouse.type"] = buildingHouse.items.hsType.val();
		options["buildingHouse.sourceType"] = buildingHouse.items.sourceType.val();
		options["buildingHouse.customer.cid"] = com.typeahead("customerId");
		options["buildingHouse.deedNum"] = buildingHouse.items.deedNum.val();
		options["buildingHouse.deedValue"] = buildingHouse.items.deedValue.val();
		options["buildingHouse.unitPrice"] = buildingHouse.items.unitPrice.val();
		options["buildingHouse.totalPrice"] = buildingHouse.items.totalPrice.val();
		options["buildingHouse.decorateTime"] = buildingHouse.items.decorateTime.val();
		options["buildingHouse.decorateDegree"] = buildingHouse.items.decorateDegree.val();
		options["buildingHouse.discussType"] = buildingHouse.items.discussType.val();
		options["buildingHouse.rentType"] = buildingHouse.items.rentType.val();
		options["buildingHouse.indoores"] = buildingHouse.items.indoores.val();
		options["buildingHouse.history"] = buildingHouse.items.history.val();
		options["buildingHouse.propertyFee"] = buildingHouse.items.propertyFee.val();
		options["buildingHouse.elevator"] = buildingHouse.items.elevator.val();
		options["buildingHouse.onlyHousing"] = buildingHouse.items.onlyHousing.val();
		options["buildingHouse.documentsDate"] = buildingHouse.items.documentsDate.val();
		options["buildingHouse.allowLoan"] = buildingHouse.items.allowLoan.val();
		options["buildingHouse.beingLoan"] = buildingHouse.items.beingLoan.val();
		options["buildingHouse.checkingTime"] = buildingHouse.items.checkingTime.val();
		options["buildingHouse.followUser.userId"] = com.typeahead("followId");
		options["buildingHouse.keyer.userId"] = com.typeahead("keyerId");
		options["buildingHouse.housingGrade"] = buildingHouse.items.housingGrade.val();
		options["buildingHouse.comment"] = buildingHouse.items.comment.val();

		houseOptions["house.village.no"] =  com.typeahead("villageId");
		houseOptions["house.houseNumber"] = buildingHouse.houseNumber;
		houseOptions["house.built"] = buildingHouse.houseItems.built.val();
		houseOptions["house.unit"] = buildingHouse.houseItems.unit.val();
		houseOptions["house.floor"] = buildingHouse.houseItems.floor.val();
		houseOptions["house.door"] = buildingHouse.houseItems.door.val();
		houseOptions["house.type"] = buildingHouse.houseItems.type.val();
		houseOptions["house.buildArea"] = utils.changeThrDecimal(buildingHouse.houseItems.buildArea.val());
		houseOptions["house.maxFloor"] = buildingHouse.houseItems.maxFloor.val();
		houseOptions["house.through"] = buildingHouse.houseItems.through.val();
		houseOptions["house.roomNum"] =  buildingHouse.houseItems.houseTypeOne.val();
		houseOptions["house.houseType"] =  buildingHouse.houseItems.houseTypeOne.val() + "室" + buildingHouse.houseItems.houseTypeTwo.val() + "厅" + buildingHouse.houseItems.houseTypeThr.val() + "厨" + buildingHouse.houseItems.houseTypeFour.val() + "卫";
		houseOptions["house.orientation"] = buildingHouse.houseItems.orientation.val();
		houseOptions["house.feature"] = buildingHouse.houseItems.feature.val();
		houseOptions["house.waterVapour"] = buildingHouse.houseItems.waterVapour.val();
		houseOptions["house.parlourType"] =  buildingHouse.houseItems.parlourType.val();
		houseOptions["house.heatingType"] =  buildingHouse.houseItems.heatingType.val();
		houseOptions["house.status"] =  0;

		if(buildingHouse.houseFlag){
			com.post(api.data.addHouse, houseOptions, function(res){
				options["buildingHouse.house.hid"] = res.house.hid;
				buildingHouse.isAddBuildingHouse == true;
			}, function(e){
				buildingHouse.isAddBuildingHouse == false;
				com.showAlert(com.error, "房产已存在");
			}, false);
		}else{
			options["buildingHouse.house.hid"]= buildingHouse.houseId;
		}

		if(buildingHouse.isAddBuildingHouse){
			com.post(api.building.addBuildingHouse, options, function(res){
				com.showAlert(com.info, "房源创建成功");
				deleteDate();
			});
		}
	}

	// 创建客户
	function createCustomer(){

		if(buildingHouse.customerItems.cardType.val() == "身份证"){
			regCard(buildingHouse.customerItems.cardNum, /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
		}else if(buildingHouse.customerItems.cardType.val() == "军官证"){
			regCard(buildingHouse.customerItems.cardNum, /^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/);
		}

		if(com.validate("customerModal") || buildingHouse.customerRepeatFlg || buildingHouse.cardFlag){
			return;
		}

		var customerOptions = {};

		customerOptions["customer.name"] =  buildingHouse.customerItems.customerName.val();
		customerOptions["customer.gender"] = com.genderType[buildingHouse.customerItems.gender.prop("checked")];
		customerOptions["customer.qq"] = buildingHouse.customerItems.qq.val();
		customerOptions["customer.wechat"] = buildingHouse.customerItems.wechat.val();
		customerOptions["customer.email"] = buildingHouse.customerItems.email.val();
		customerOptions["customer.relationshipType"] = buildingHouse.customerItems.relationshipType.val();
		customerOptions["customer.address"] =  buildingHouse.customerItems.address.val();
		customerOptions["customer.phone"] =  buildingHouse.customerItems.phone.val();

		com.post(api.data.addCustomer, customerOptions, function(res){
			com.showAlert(com.info, "创建用户成功");
			buildingHouse.customerId = res.customer.cid;

			buildingHouse.modals.customerModal.modal("hide");

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
		buildingHouse.houseItems.rule.html("");
		com.focusPage("#ohousetype").css("display", "none");
		com.focusPage("#nhousetype").removeAttr("style");

		com.cleanItems(buildingHouse.items);
		com.cleanItems(buildingHouse.houseItems);
		com.cleanItems(buildingHouse.customerItems);
		
	}

	// 删除房产数据
	function deleteHouseData(){
	    
		com.focusPage("#ohousetype").css("display", "none");
		com.focusPage("#nhousetype").removeAttr("style");
		com.focusPage(".tag").remove();
		
		com.cleanItems(buildingHouse.houseItems);
	}

	// 检查房产以及房源是否存在
	function checkHouseAndBuildingHouse(inputId){
		validatehouse();

		if(buildingHouse.HFlag){
			var houses = buildingHouse.valideteresult.prehouse.house;
			buildingHouse.houseId = houses.hid;

			var hsOptions = {
				"buildingHouse.house.hid": houses.hid,
				"buildingHouse.type": buildingHouse.items.hsType.val()
			};

			com.post(api.building.checkBuildingHouse, hsOptions, function(data){
				buildingHouse.houseFlag = false;
				// 绑定房产数据
				bindHouseData(houses);
				houseItemsReadOnlyFlag(true);
			}, function(res){
				buildingHouse.houseFlag = false;
				com.showTip(com.focusPage("#door"), "该房源已存在", "bottom");
			}, false);
		}else{
			buildingHouse.houseFlag = true;
			// deleteHouseData();
			houseItemsReadOnlyFlag(false);
		}
	}

	// 绑定房产数据
	function bindHouseData(houses){
	    
	    com.updateTypeahead("villageId", houses.village.no, houses.village.name);
	    
		com.focusPage("#nhousetype").css("display", "none");
		com.focusPage("#ohousetype").removeAttr("style");
		
		buildingHouse.houseItems.type.val(houses.type);
		buildingHouse.houseItems.buildArea.val(houses.buildArea);
		buildingHouse.houseItems.maxFloor.val(houses.maxFloor);
		buildingHouse.houseItems.through.val(houses.through);
		buildingHouse.houseItems.oldhousetype.val(houses.houseType);
		buildingHouse.houseItems.orientation.val(houses.orientation);
		buildingHouse.houseItems.feature.val(houses.feature);
		buildingHouse.houseItems.waterVapour.val(houses.waterVapour);
		buildingHouse.houseItems.parlourType.val(houses.parlourType);
		buildingHouse.houseItems.heatingType.val(houses.heatingType);
	}

	// 验证证件号码
	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				buildingHouse.cardFlag = true;
				com.showTip(cardParam, "请输入正确的证件号码", "right");
			}else{
				buildingHouse.cardFlag = false;
			}
		}else{
			buildingHouse.cardFlag = false;
		}
	}

	// 删除楼牌号数据
	function deleteVillageData(paramFlag){
		switch(paramFlag)
		{
			case "built":
				buildingHouse.houseItems.unit.val("");
				buildingHouse.houseItems.floor.val("");
				buildingHouse.houseItems.door.val("");
				break;
			case "unit":
				buildingHouse.houseItems.floor.val("");
				buildingHouse.houseItems.door.val("");
				break;
			case "floor":
				buildingHouse.houseItems.door.val("");
				break;
			case "no":
				buildingHouse.houseItems.built.val("");
				buildingHouse.houseItems.unit.val("");
				buildingHouse.houseItems.floor.val("");
				buildingHouse.houseItems.door.val("");
				buildingHouse.houseItems.builtrule.get(0).selectedIndex = 0;
				buildingHouse.houseItems.unitrule.get(0).selectedIndex = 0;
				buildingHouse.houseItems.floorrule.get(0).selectedIndex = 0;
				buildingHouse.houseItems.doorrule.get(0).selectedIndex = 0;
				deleteHouseData();
				break;
		}
	}

	function houseItemsReadOnlyFlag(flag){
		if(!flag){
			com.focusPage("#ohousetype").css("display", "none");
			com.focusPage("#nhousetype").removeAttr("style");
		}

		buildingHouse.houseItems.type.prop("disabled", flag);
		buildingHouse.houseItems.maxFloor.prop("readonly", flag);
		buildingHouse.houseItems.buildArea.prop("readonly", flag);
		buildingHouse.houseItems.orientation.prop("disabled", flag);
		buildingHouse.houseItems.through.prop("disabled", flag);
		buildingHouse.houseItems.parlourType.prop("disabled", flag);
		buildingHouse.houseItems.heatingType.prop("disabled", flag);
		buildingHouse.houseItems.waterVapour.prop("disabled", flag);
		buildingHouse.houseItems.feature.prop("disabled", flag);
	}

	function  validatehouse(){

		var validateresult={};

		if(buildingHouse.houseItems.villageId.val() == "" ){
			com.showTip(buildingHouse.houseItems.no, "请先选择楼盘!", "right");
		}

		validateresult.rulenum = [
			buildingHouse.houseItems.built.val().trim().toUpperCase(), buildingHouse.houseItems.builtrule.val(),
			buildingHouse.houseItems.unit.val().trim().toUpperCase(), buildingHouse.houseItems.unitrule .val(),
			buildingHouse.houseItems.floor.val().trim().toUpperCase(), buildingHouse.houseItems.floorrule.val(),
			buildingHouse.houseItems.door.val().trim().toUpperCase(), buildingHouse.houseItems.doorrule.val()];

		validateresult.houseNumber =houseUtils.creatHouseNumber(validateresult.rulenum);

		validateresult.prehouse = houseUtils.validatehouse(com.typeahead("villageId"),validateresult.houseNumber,null,buildingHouse.houseItems.errMsg,false);

		buildingHouse.valideteresult = validateresult;

		if(buildingHouse.valideteresult.prehouse != undefined){
			buildingHouse.HFlag = buildingHouse.valideteresult.prehouse.Flag;
		}

		buildingHouse.houseNumber = buildingHouse.valideteresult.houseNumber;
	}

});
