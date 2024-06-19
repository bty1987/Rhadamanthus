
jQuery(function($) {
	var buildingCustomer = {

		btns: {

			saveBtn: com.focusPage("#saveBtn"),
			cancelBtn: com.focusPage("#cancelBtn"),
			createCustomerSaveBtn : com.focusPage("#createCustomerSaveBtn")

		},

		modals: {

			customerModal: com.focusPage("#customerModal")

		},

		items: {

			customerId: com.focusPage("#customerId"),
			csType: com.focusPage("#csType"),
			purpose: com.focusPage("#purpose"),
			intention: com.focusPage("#intention"),
			priceLow: com.focusPage("#priceLow"),
			priceHigh: com.focusPage("#priceHigh"),
			areaLow: com.focusPage("#areaLow"),
			areaHigh: com.focusPage("#areaHigh"),
			familyType: com.focusPage("#familyType"),
			orientation: com.focusPage("#orientation"),
			conditions: com.focusPage("#conditions"),
			grade: com.focusPage("#grade"),
			comment: com.focusPage("#comment")
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

		customerId: null,
		priceFlag: false,
		areaFlag: false,
		buildingJson:null,
		repeatFlg: null,
		cardFlag: false,
		repeatCustomerFlg: false,
		customerRepeatFlg: false
	};

	buildingCustomer.customerItems.gender.switchBtn("gender");

	buildingCustomer.modals.customerModal.on("hide.bs.modal", function(){

		com.cleanItems(buildingCustomer.customerItems);
		com.cleanTypeahead("customerId");
		com.closeTip();
	});

	com.initTypeahead('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value", function(list, key, value){

	    return value;
	});

	buildingCustomer.btns.saveBtn.on("click", addBuildingCustomer);
	buildingCustomer.btns.cancelBtn.on("click", deleteDate);
	buildingCustomer.btns.createCustomerSaveBtn.on("click", createCustomer);

	buildingCustomer.modal = com.focusPage("#buildingCustomer");
	buildingCustomer.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	com.post(api.ds.building, {}, function (res) {
		buildingCustomer.cardType = res.cardType.split("key", "value");

		buildingCustomer.customerItems.cardType.bindData(res.cardType, "key", "value", false);
	});

	com.post(api.ds.building, {}, function (res) {
		buildingCustomer.grade = res.grade.split("key", "value");

		buildingCustomer.items.grade.bindData(res.grade, "key", "value", false);
	});

	com.post(api.ds.building, {}, function(res){
		buildingCustomer.items.orientation.bindData(res.orientation,"key", "value");
		buildingCustomer.items.csType.bindData(res.csType,"key", "value");
	}, null, false);

	com.post(api.ds.data, {}, function(res){
		buildingCustomer.customerItems.relationshipType.bindData(res.relationshipType, "key", "value");
	});

	// 检查电话号是否已存在
	buildingCustomer.customerItems.phone = com.focusPage("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showTip(com.focusPage("#phone"), "电话号码不能为空", "right"), buildingCustomer.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			buildingCustomer.customerRepeatFlg = false;

		}, function(res){
			buildingCustomer.customerRepeatFlg = true;
			com.showTip(com.focusPage("#phone"), "电话号码已存在", "right");
		});
	});

	com.focusPage('#fl-statement').statement("客源", "创建客源");

	// 创建客户模态框
	com.focusPage("#createCustomer").click(function(){
		com.cleanItems(buildingCustomer.customerItems);
		buildingCustomer.modals.customerModal.modal("show");
	});

	// 创建客户
	function createCustomer(){

		if(buildingCustomer.customerItems.cardType.val() == "身份证"){
			regCard(buildingCustomer.customerItems.cardNum, /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
		}else if(buildingCustomer.customerItems.cardType.val() == "军官证"){
			regCard(buildingCustomer.customerItems.cardNum, /^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/);
		}

		if(com.validate("customerModal") || buildingCustomer.customerRepeatFlg || buildingCustomer.cardFlag){
			if(buildingCustomer.customerRepeatFlg){
				com.showTip(com.focusPage("#phone"), "电话号码已存在", "right");
			}
			return;
		}

		var customerOptions = {};

		customerOptions["customer.name"] =  buildingCustomer.customerItems.customerName.val();
		customerOptions["customer.gender"] = com.genderType[buildingCustomer.customerItems.gender.prop("checked")];
		customerOptions["customer.qq"] = buildingCustomer.customerItems.qq.val();
		customerOptions["customer.wechat"] = buildingCustomer.customerItems.wechat.val();
		customerOptions["customer.email"] = buildingCustomer.customerItems.email.val();
		customerOptions["customer.relationshipType"] = buildingCustomer.customerItems.relationshipType.val();
		customerOptions["customer.address"] =  buildingCustomer.customerItems.address.val();
		customerOptions["customer.phone"] =  buildingCustomer.customerItems.phone.val();

		com.post(api.data.addCustomer, customerOptions, function(res){
			com.showAlert(com.info, "创建用户成功");
			buildingCustomer.customerId = res.customer.cid;

			buildingCustomer.modals.customerModal.modal("show");

		}, function(e){
			com.showAlert(com.warning, "客户电话已存在");
		}, false);
	}

	// 编辑OR添加
	function addBuildingCustomer(){
		var priceHigh = buildingCustomer.items.priceHigh.val();
		var priceLow = buildingCustomer.items.priceLow.val();
		var areaHigh = buildingCustomer.items.areaHigh.val();
		var areaLow = buildingCustomer.items.areaLow.val();

		if(parseInt(priceHigh) < parseInt(priceLow) || parseInt(priceHigh) == parseInt(priceLow)){
			com.focusPage("#priceHigh").removeClass("v_required");
			com.showTip(com.focusPage("#priceHigh"), "请填写可接受的最高价格", "right");
			buildingCustomer.priceFlag = true;
		}else{
			com.focusPage("#priceHigh").addClass("v_required");
			buildingCustomer.priceFlag = false;
		}

		if(parseInt(areaHigh) < parseInt(areaLow) || parseInt(areaHigh) == parseInt(areaLow)){
			com.focusPage("#areaHigh").removeClass("v_required");
			com.showTip(com.focusPage("#areaHigh"), "请填写需求面积的最大值", "right");
			buildingCustomer.areaFlag = true;
		}else{
			com.focusPage("#areaHigh").addClass("v_required");
			buildingCustomer.areaFlag = false;
		}

		if(com.validate("createCustomerRow") || buildingCustomer.repeatFlg || buildingCustomer.areaFlag || buildingCustomer.priceFlag){
			return false;
		}

		var options = {};

		options["buildingCustomer.customer.cid"] = com.typeahead("customerId");
		options["buildingCustomer.type"] = buildingCustomer.items.csType.val();
		options["buildingCustomer.purpose"] = buildingCustomer.items.purpose.val();
		options["buildingCustomer.intention"] = buildingCustomer.items.intention.val();
		options["buildingCustomer.price"] = buildingCustomer.items.priceLow.val() + "," + buildingCustomer.items.priceHigh.val();
		options["buildingCustomer.area"] = buildingCustomer.items.areaLow.val() + "," + buildingCustomer.items.areaHigh.val();
		options["buildingCustomer.familyType"] = buildingCustomer.items.familyType.val();
		options["buildingCustomer.orientation"] = buildingCustomer.items.orientation.val();
		options["buildingCustomer.conditions"] = buildingCustomer.items.conditions.val();
		options["buildingCustomer.grade"] = buildingCustomer.items.grade.val();
		options["buildingCustomer.comment"] = buildingCustomer.items.comment.val();

		com.post(api.building.addBuildingCustomer, options, function(res){
			com.showAlert(com.info, "客源创建成功");
			deleteDate();
		});

	}

	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				buildingCustomer.cardFlag = true;
				com.showTip(cardParam, "请输入正确的证件号码", "right");
			}else{
				buildingCustomer.cardFlag = false;
			}
		}else{
			buildingCustomer.cardFlag = false;
		}
	}

	// 清除数据
	function deleteDate(){
	    
	    com.cleanTypeahead("customerId");
	    
		com.cleanItems(buildingCustomer.items);
		com.cleanItems(buildingCustomer.customerItems);
		com.focusPage(".tag").remove();
		com.clearValidator();
	}

});
