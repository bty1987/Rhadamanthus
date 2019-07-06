
jQuery(function($) {
	var createCustomerSource = {

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

	createCustomerSource.customerItems.gender.switchBtn("gender");

	createCustomerSource.modals.customerModal.on("hide.bs.modal", function(){

		com.cleanItems(createCustomerSource.customerItems);
		com.cleanTypeahead("customerId");
		com.closeTip();
	});

	com.initTypeahead('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value", function(list, key, value){

	    return value;
	});

	createCustomerSource.btns.saveBtn.on("click", addCustomerSource);
	createCustomerSource.btns.cancelBtn.on("click", deleteDate);
	createCustomerSource.btns.createCustomerSaveBtn.on("click", createCustomer);

	createCustomerSource.modal = com.focusPage("#createCustomerSource");
	createCustomerSource.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	com.post(api.ds.building, {}, function (res) {
		createCustomerSource.cardType = res.cardType.split("key", "value");

		createCustomerSource.customerItems.cardType.bindData(res.cardType, "key", "value", false);
	});

	com.post(api.ds.building, {}, function (res) {
		createCustomerSource.grade = res.grade.split("key", "value");

		createCustomerSource.items.grade.bindData(res.grade, "key", "value", false);
	});

	com.post(api.ds.building, {}, function(res){
		createCustomerSource.items.orientation.bindData(res.orientation,"key", "value");
		createCustomerSource.items.csType.bindData(res.csType,"key", "value");
	}, null, false);

	com.post(api.ds.data, {}, function(res){
		createCustomerSource.customerItems.relationshipType.bindData(res.relationshipType, "key", "value");
	});

	//检查电话号是否已存在
	createCustomerSource.customerItems.phone = com.focusPage("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showTip(com.focusPage("#phone"), "电话号码不能为空", "right"), createCustomerSource.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			createCustomerSource.customerRepeatFlg = false;

		}, function(res){
			createCustomerSource.customerRepeatFlg = true;
			com.showTip(com.focusPage("#phone"), "电话号码已存在", "right");
		});
	});

	com.focusPage('#fl-statement').statement("客源", "创建客源");

	//创建客户模态框
	com.focusPage("#createCustomer").click(function(){
		com.cleanItems(createCustomerSource.customerItems);
		createCustomerSource.modals.customerModal.modal("show");
	});

	//创建客户
	function createCustomer(){

		if(createCustomerSource.customerItems.cardType.val() == "身份证"){
			regCard(createCustomerSource.customerItems.cardNum, /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
		}else if(createCustomerSource.customerItems.cardType.val() == "军官证"){
			regCard(createCustomerSource.customerItems.cardNum, /^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/);
		}

		if(com.validate("customerModal") || createCustomerSource.customerRepeatFlg || createCustomerSource.cardFlag){
			if(createCustomerSource.customerRepeatFlg){
				com.showTip(com.focusPage("#phone"), "电话号码已存在", "right");
			}
			return;
		}

		var customerOptions = {};

		customerOptions["customer.name"] =  createCustomerSource.customerItems.customerName.val();
		customerOptions["customer.gender"] = com.genderType[createCustomerSource.customerItems.gender.prop("checked")];
		customerOptions["customer.qq"] = createCustomerSource.customerItems.qq.val();
		customerOptions["customer.wechat"] = createCustomerSource.customerItems.wechat.val();
		customerOptions["customer.email"] = createCustomerSource.customerItems.email.val();
		customerOptions["customer.relationshipType"] = createCustomerSource.customerItems.relationshipType.val();
		customerOptions["customer.address"] =  createCustomerSource.customerItems.address.val();
		customerOptions["customer.phone"] =  createCustomerSource.customerItems.phone.val();

		com.post(api.data.addCustomer, customerOptions, function(res){
			com.showAlert(com.info, "创建用户成功");
			createCustomerSource.customerId = res.customer.cid;

			createCustomerSource.modals.customerModal.modal("show");

		}, function(e){
			com.showAlert(com.warning, "客户电话已存在");
		}, false);
	}

	//编辑OR添加
	function addCustomerSource(){
		var priceHigh = createCustomerSource.items.priceHigh.val();
		var priceLow = createCustomerSource.items.priceLow.val();
		var areaHigh = createCustomerSource.items.areaHigh.val();
		var areaLow = createCustomerSource.items.areaLow.val();

		if(parseInt(priceHigh) < parseInt(priceLow) || parseInt(priceHigh) == parseInt(priceLow)){
			com.focusPage("#priceHigh").removeClass("v_required");
			com.showTip(com.focusPage("#priceHigh"), "请填写可接受的最高价格", "right");
			createCustomerSource.priceFlag = true;
		}else{
			com.focusPage("#priceHigh").addClass("v_required");
			createCustomerSource.priceFlag = false;
		}

		if(parseInt(areaHigh) < parseInt(areaLow) || parseInt(areaHigh) == parseInt(areaLow)){
			com.focusPage("#areaHigh").removeClass("v_required");
			com.showTip(com.focusPage("#areaHigh"), "请填写需求面积的最大值", "right");
			createCustomerSource.areaFlag = true;
		}else{
			com.focusPage("#areaHigh").addClass("v_required");
			createCustomerSource.areaFlag = false;
		}

		if(com.validate("createCustomerRow") || createCustomerSource.repeatFlg || createCustomerSource.areaFlag || createCustomerSource.priceFlag){
			return false;
		}

		var options = {};

		options["customerSource.customer.cid"] = com.typeahead("customerId");
		options["customerSource.type"] = createCustomerSource.items.csType.val();
		options["customerSource.purpose"] = createCustomerSource.items.purpose.val();
		options["customerSource.intention"] = createCustomerSource.items.intention.val();
		options["customerSource.price"] = createCustomerSource.items.priceLow.val() + "," + createCustomerSource.items.priceHigh.val();
		options["customerSource.area"] = createCustomerSource.items.areaLow.val() + "," + createCustomerSource.items.areaHigh.val();
		options["customerSource.familyType"] = createCustomerSource.items.familyType.val();
		options["customerSource.orientation"] = createCustomerSource.items.orientation.val();
		options["customerSource.conditions"] = createCustomerSource.items.conditions.val();
		options["customerSource.grade"] = createCustomerSource.items.grade.val();
		options["customerSource.comment"] = createCustomerSource.items.comment.val();

		com.post(api.building.addCustomerSource, options, function(res){
			com.showAlert(com.info, "客源创建成功");
			deleteDate();
		});

	}

	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				createCustomerSource.cardFlag = true;
				com.showTip(cardParam, "请输入正确的证件号码", "right");
			}else{
				createCustomerSource.cardFlag = false;
			}
		}else{
			createCustomerSource.cardFlag = false;
		}
	}

	//清除数据
	function deleteDate(){
	    
	    com.cleanTypeahead("customerId");
	    
		com.cleanItems(createCustomerSource.items);
		com.cleanItems(createCustomerSource.customerItems);
		com.focusPage(".tag").remove();
		com.clearValidator();
	}

});
