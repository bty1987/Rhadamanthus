
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
		validator: {},
		cardType: ["身份证", "军官证", "护照"],
		grade: ["A", "B", "C", "D"],
		buildingJson:null,
		repeatFlg: null,
		cardFlag: false,
		repeatCustomerFlg: false,
		customerRepeatFlg: false,
	};

	createCustomerSource.customerItems.gender = $("#gender").switchBtn("gender");

	var tag_input = $("#conditions");
	var tag_inputTwo = $("#intention");

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
			isResultTypeMap : false, //是否是key - value 形式的列表
		},
	});

	$("#cardType").bindData(createCustomerSource.cardType);
	$("#grade").bindData(createCustomerSource.grade);

	com.initChosen('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value").on("change", function(e){
		if($(this).val() == "" || $("#customerId").val() == "") {
			com.clearValidator("#customerId", true);
			createCustomerSource.repeatCustomerFlg = false;
			return;
		}
	});

	createCustomerSource.saveBtn = $("#saveBtn").on("click", addCustomerSource);
	createCustomerSource.cancelBtn = $("#cancelBtn").on("click", deleteDate);
	createCustomerSource.createCustomerSaveBtn = $("#createCustomerSaveBtn").on("click", createCustomer);

	createCustomerSource.items.customerId= $("#customerId");
	createCustomerSource.items.csType = $("#csType");
	createCustomerSource.items.purpose = $("#purpose");
	createCustomerSource.items.intention = $("#intention");
	createCustomerSource.items.priceLow = $("#priceLow");
	createCustomerSource.items.priceHigh = $("#priceHigh");
	createCustomerSource.items.areaLow = $("#areaLow");
	createCustomerSource.items.areaHigh = $("#areaHigh");
	createCustomerSource.items.familyType = $("#familyType");
	createCustomerSource.items.orientation = $("#orientation");
	createCustomerSource.items.conditions = $("#conditions");
	createCustomerSource.items.grade = $("#grade");
	createCustomerSource.items.comment = $("#comment");

	createCustomerSource.customerItems.customerName = $("#customerName");
	createCustomerSource.customerItems.cardType = $("#cardType");
	createCustomerSource.customerItems.cardNum = $("#cardNum");
	createCustomerSource.customerItems.gender = $("#gender");
	createCustomerSource.customerItems.qq = $("#qq");
	createCustomerSource.customerItems.wechat = $("#wechat");
	createCustomerSource.customerItems.email = $("#email");
	createCustomerSource.customerItems.relationshipType = $("#relationshipType");
	createCustomerSource.customerItems.address = $("#address");
	createCustomerSource.customerItems.phone = $("#phone");

	createCustomerSource.modal = $("#createCustomerSource");
	createCustomerSource.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	$.extend(com.validator, createCustomerSource.validator);

	com.post(api.ds.building, {}, function(res){
		createCustomerSource.items.orientation.bindData(res.orientation,"key", "value");
		createCustomerSource.items.csType.bindData(res.csType,"key", "value");
	}, null, false);

	com.post(api.ds.data, {}, function(res){
		createCustomerSource.customerItems.relationshipType.bindData(res.relationshipType, "key", "value");
	});

	$("#customerId").on("change", function(){
		deleteCsDate();
	});

	//检查电话号是否已存在
	createCustomerSource.customerItems.phone = $("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showPopover($("#phone"),{errorMsg: "电话号码不能为空"}, "right"), createCustomerSource.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			createCustomerSource.customerRepeatFlg = true;
			com.showPopover($("#phone"),{errorMsg: "电话号码已存在"}, "right");

		}, function(res){
			createCustomerSource.customerRepeatFlg = false;
			$("#phone").css("border", "1px solid #d5d5d5").popover("destroy");
		});
	});

	$('#fl-statement').statement("客源", "创建客源");

	//创建客户模态框
	$("#createCustomer").click(function(){
		com.cleanItems(createCustomerSource.customerItems);
		$("#customerModal").modal("show");
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
				com.showPopover($("#phone"),{errorMsg: "电话号码已存在"}, "right");
			}
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

			$("#customerId").html('<option value="'+ res.customer.cid + '">'+res.customer.name + '-' + res.customer.phone + '</option>');
			$("#customerId").trigger("chosen:updated");

			$("#customerModal").modal("hide");

		}, function(e){
			com.showAlert(com.warning, "客户电话已存在！");
		}, false);
	}

	//编辑OR添加
	function addCustomerSource(){
		var priceHigh = createCustomerSource.items.priceHigh.val();
		var priceLow = createCustomerSource.items.priceLow.val();
		var areaHigh = createCustomerSource.items.areaHigh.val();
		var areaLow = createCustomerSource.items.areaLow.val();

		if(parseInt(priceHigh) < parseInt(priceLow) || parseInt(priceHigh) == parseInt(priceLow)){
			$("#priceHigh").removeClass("v_required");
			com.showPopover($("#priceHigh"),{errorMsg: "请填写可接受的最高价格！"}, "right");
			createCustomerSource.priceFlag = true;
		}else{
			$("#priceHigh").addClass("v_required");
			$("#priceHigh").css("border", "1px solid #d5d5d5").popover("destroy");
			createCustomerSource.priceFlag = false;
		}

		if(parseInt(areaHigh) < parseInt(areaLow) || parseInt(areaHigh) == parseInt(areaLow)){
			$("#areaHigh").removeClass("v_required");
			com.showPopover($("#areaHigh"),{errorMsg: "请填写需求面积的最大值！"}, "right");
			createCustomerSource.areaFlag = true;
		}else{
			$("#areaHigh").addClass("v_required");
			$("#areaHigh").css("border", "1px solid #d5d5d5").popover("destroy");
			createCustomerSource.areaFlag = false;
		}

		if(com.validate() || createCustomerSource.repeatFlg || createCustomerSource.areaFlag || createCustomerSource.priceFlag){
			return;
		}

		var options = {};

		options["customerSource.customer.cid"] = createCustomerSource.items.customerId.val();
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
			com.showAlert(com.info, "客源创建成功！");
			deleteDate();
		});

	}

	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				createCustomerSource.cardFlag = true;
				com.showPopover(cardParam,{errorMsg: "请输入正确的证件号码！"}, "right");
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
		com.updateChosen("customerId", "", "");
		com.cleanItems(createCustomerSource.items);
		com.cleanItems(createCustomerSource.customerItems);
		$(".tag").remove();
		com.clearValidator();
	}

	function deleteCsDate(){
		$(".tag").remove();
		createCustomerSource.items.purpose.val("");
		createCustomerSource.items.priceLow.val("");
		createCustomerSource.items.priceHigh.val("");
		createCustomerSource.items.areaLow.val("");
		createCustomerSource.items.areaHigh.val("");
		createCustomerSource.items.familyType.val("");
		createCustomerSource.items.orientation.val(0);
		createCustomerSource.items.grade.val("A");
		createCustomerSource.items.comment.val("");
	}

});
