
jQuery(function($) {
	var createCustomerSource = {
		customerId: null,
		saveBtn: null,
		cancelBtn: null,
		createCustomerSaveBtn: null,
		modal: null,
		items: {},
		priceFlag: false,
		areaFlag: false,
		customerItems: {},
		cardType: ["身份证", "军官证", "护照"],
		grade: ["A", "B", "C", "D"],
		buildingJson:null,
		repeatFlg: null,
		cardFlag: false,
		repeatCustomerFlg: false,
		customerRepeatFlg: false
	};

	createCustomerSource.customerItems.gender = com.focusPage("#gender").switchBtn("gender");
	
	com.initTag("conditions");
    com.initTag("intention");

	com.focusPage("#cardType").bindData(createCustomerSource.cardType);
	com.focusPage("#grade").bindData(createCustomerSource.grade);
	
	com.initTypeahead('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value", function(list, key, value){
	    com.cleanItems(createCustomerSource.items);
	    
	    return value;
	});

	createCustomerSource.saveBtn = com.focusPage("#saveBtn").on("click", addCustomerSource);
	createCustomerSource.cancelBtn = com.focusPage("#cancelBtn").on("click", deleteDate);
	createCustomerSource.createCustomerSaveBtn = com.focusPage("#createCustomerSaveBtn").on("click", createCustomer);

	createCustomerSource.items.customerId= com.focusPage("#customerId");
	createCustomerSource.items.csType = com.focusPage("#csType");
	createCustomerSource.items.purpose = com.focusPage("#purpose");
	createCustomerSource.items.intention = com.focusPage("#intention");
	createCustomerSource.items.priceLow = com.focusPage("#priceLow");
	createCustomerSource.items.priceHigh = com.focusPage("#priceHigh");
	createCustomerSource.items.areaLow = com.focusPage("#areaLow");
	createCustomerSource.items.areaHigh = com.focusPage("#areaHigh");
	createCustomerSource.items.familyType = com.focusPage("#familyType");
	createCustomerSource.items.orientation = com.focusPage("#orientation");
	createCustomerSource.items.conditions = com.focusPage("#conditions");
	createCustomerSource.items.grade = com.focusPage("#grade");
	createCustomerSource.items.comment = com.focusPage("#comment");

	createCustomerSource.customerItems.customerName = com.focusPage("#customerName");
	createCustomerSource.customerItems.cardType = com.focusPage("#cardType");
	createCustomerSource.customerItems.cardNum = com.focusPage("#cardNum");
	createCustomerSource.customerItems.gender = com.focusPage("#gender");
	createCustomerSource.customerItems.qq = com.focusPage("#qq");
	createCustomerSource.customerItems.wechat = com.focusPage("#wechat");
	createCustomerSource.customerItems.email = com.focusPage("#email");
	createCustomerSource.customerItems.relationshipType = com.focusPage("#relationshipType");
	createCustomerSource.customerItems.address = com.focusPage("#address");
	createCustomerSource.customerItems.phone = com.focusPage("#phone");

	createCustomerSource.modal = com.focusPage("#createCustomerSource");
	createCustomerSource.modal.on('show.bs.modal',function(e){
		com.clearValidator();
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
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showPopover(com.focusPage("#phone"),{errorMsg: "电话号码不能为空"}, "right"), createCustomerSource.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			createCustomerSource.customerRepeatFlg = false;
			com.focusPage("#phone").css("border", "1px solid #d5d5d5").popover("destroy");

		}, function(res){
			createCustomerSource.customerRepeatFlg = true;
			com.showPopover(com.focusPage("#phone"),{errorMsg: "电话号码已存在"}, "right");
		});
	});

	com.focusPage('#fl-statement').statement("客源", "创建客源");

	//创建客户模态框
	com.focusPage("#createCustomer").click(function(){
		com.cleanItems(createCustomerSource.customerItems);
		com.focusPage("#customerModal").modal("show");
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
				com.showPopover(com.focusPage("#phone"),{errorMsg: "电话号码已存在"}, "right");
			}
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

			com.focusPage("#customerModal").modal("hide");

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
			com.showPopover(com.focusPage("#priceHigh"),{errorMsg: "请填写可接受的最高价格"}, "right");
			createCustomerSource.priceFlag = true;
		}else{
			com.focusPage("#priceHigh").addClass("v_required");
			com.focusPage("#priceHigh").css("border", "1px solid #d5d5d5").popover("destroy");
			createCustomerSource.priceFlag = false;
		}

		if(parseInt(areaHigh) < parseInt(areaLow) || parseInt(areaHigh) == parseInt(areaLow)){
			com.focusPage("#areaHigh").removeClass("v_required");
			com.showPopover(com.focusPage("#areaHigh"),{errorMsg: "请填写需求面积的最大值"}, "right");
			createCustomerSource.areaFlag = true;
		}else{
			com.focusPage("#areaHigh").addClass("v_required");
			com.focusPage("#areaHigh").css("border", "1px solid #d5d5d5").popover("destroy");
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
				com.showPopover(cardParam,{errorMsg: "请输入正确的证件号码"}, "right");
			}else{
				createCustomerSource.cardFlag = false;
				cardParam.css("border", "1px solid #d5d5d5").popover("destroy")
			}
		}else{
			createCustomerSource.cardFlag = false;
			cardParam.css("border", "1px solid #d5d5d5").popover("destroy")
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
