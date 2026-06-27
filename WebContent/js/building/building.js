
jQuery(function($) {
    
	var buildingPayType;
	var building = {
		
		btns:{
			saveBtn: com.focusPage("#saveBtn"),
			cancelBtn: com.focusPage("#cancelBtn"),
			deployedBtn: com.focusPage("#deployedBtn"),
			createCustomerSaveBtn: com.focusPage("#createCustomerSaveBtn")
		},
		modals:{
			buildingModal: com.focusPage("#buildingModal"),
			customerModal: com.focusPage("#customerModal")
		},
		items: {
			hsNo: com.focusPage("#hsNo"),
			csNo: com.focusPage("#csNo"),
			hsAUser: com.focusPage("#hsAUser"),
			csAUser: com.focusPage("#csAUser"),
			signingTime: com.focusPage("#signingTime"),
			tradePrice: com.focusPage("#tradePrice"),
			downpayment: com.focusPage("#downpayment"),
			loanPrice: com.focusPage("#loanPrice"),
			payType: com.focusPage("#payType"),
			payTypes: com.focusPage("#payTypes"),
			balanceStatus: com.focusPage("#balanceStatus")
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

		bid: null,
		hsid: null,
		csid: null,
		payType: [],
		balanceStatus: [],
		editFlag: false,
		hsFlag: false,
		csFlag: false,
		cardFlag: false,
		customerRepeatFlg: false,
		repeatFlg: false

	};

	building.btns.saveBtn.on("click", saveData);
	building.btns.cancelBtn.on("click", deleteData);
	building.btns.deployedBtn.on("click", updatePayTypeFun);
	building.btns.createCustomerSaveBtn.on("click", createCustomer);

	building.customerItems.gender.switchBtn("gender");

	building.modals.buildingModal.on("hide.bs.modal", function(){

		com.cleanItems(building.items);
		com.cleanTypeahead("hsAUser");
		com.cleanTypeahead("csAUser");
		com.closeTip();
	});

	building.modals.customerModal.on("hide.bs.modal", function(){

		com.cleanItems(building.customerItems);
		com.closeTip();
	});

	com.datetime(building.items.signingTime);
	
	com.initTypeahead('hsAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
	com.initTypeahead('csAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");

	com.post(api.ds.building, {}, function (res) {
		building.cardType = res.cardType.split("key", "value");

		building.customerItems.cardType.bindData(res.cardType, "key", "value", false);
	});

	com.post(api.ds.building, {}, function(res){
		building.items.payType.bindData(res.payType,"key", "value");
		building.items.balanceStatus.bindData(res.balanceStatus,"key", "value");
		building.items.payTypes.bindData(res.payType,"key", "value");

		$.each(res.payType, function (i,v) {
			building.payType[i] = v.value;
		});

		$.each(res.balanceStatus, function (i,v) {
			building.balanceStatus[i] = v.value;
		});

	}, null, false);

	com.post(api.ds.data, {}, function(res){
		var relationshipTypes = res.relationshipType;
		if(relationshipTypes && relationshipTypes.length){
			$.each(relationshipTypes, function(i, v){
				$('<option></option>').attr("value" , v.key).html(v.value).appendTo(com.focusPage("#relationshipType"));
			});
		}
	});

	com.focusPage("#hsNo").on("blur", function(){
		com.post(api.building.queryBuildingHouseByNo, {"buildingHouse.no" : building.items.hsNo.val()}, function(res){
			if(res.buildingHouse.status != 3){
				building.dataFlag = true;
				com.showTip(com.focusPage("#hsNo"), "房源已签约或失效", "right");
			}else{
				building.dataFlag = false;
				building.hsid = res.buildingHouse.hsid;
			}
		}, function(data){
			building.dataFlag = true;
			com.showTip(com.focusPage("#hsNo"), "请正确输入房源编号", "right");
		}, false);
	});

	com.focusPage("#csNo").on("blur", function(){
		com.post(api.building.queryBuildingCustomerByNo, {"buildingCustomer.no" : building.items.csNo.val()}, function(res){
			if(res.buildingCustomer.status != 0){
				building.dataFlag = true;
				com.showTip(com.focusPage("#csNo"), "客源已签约或失效", "right");
			}else{
				building.dataFlag = false;
				building.csid = res.buildingCustomer.csid;
			}
		}, function(data){
			building.dataFlag = true;
			com.showTip(com.focusPage("#csNo"), "请正确输入客源编号", "right");
		}, false);
	});

	// 检查电话号是否已存在
	building.customerItems.phone = com.focusPage("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showTip(com.focusPage("#phone"), "电话号码不能为空", "right"), building.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			building.customerRepeatFlg = false;
		}, function(res){
			building.customerRepeatFlg = true;
			com.showTip(com.focusPage("#phone"), "电话号码已存在", "right");
		});
	});

	function buildBuildingLineprops() {

		return [{
			field: "buildingHouse.house",
			name: "楼盘地址",
			prop: function(v) { return v.buildingHouse.house.village.name + " " + v.buildingHouse.house.houseNumber; },
			clazz: "grey"
		}, {
			field: "buildingHouse.customer.name",
			name: "房源所属人",
			prop: "buildingHouse.customer.name",
			clazz: "grey"
		}, {
			field: "buildingCustomer.customer.name",
			name: "客源姓名",
			prop: "buildingCustomer.customer.name",
			clazz: "grey"
		}, {
			field: "buildingHouseAgent.name",
			name: "房源代理人",
			prop: "buildingHouseAgent.name",
			clazz: "grey"
		}, {
			field: "buildingCustomerAgent.name",
			name: "客源代理人",
			prop: "buildingCustomerAgent.name",
			clazz: "grey"
		}, {
			field: "signingTime",
			name: "签约时间",
			prop: "signingTime",
			clazz: "green"
		}, {
			field: "tradePrice",
			name: "成交价格",
			prop: "tradePrice",
			clazz: "blue"
		}, {
			field: "downpayment",
			name: "首付款",
			prop: "downpayment",
			clazz: "blue"
		}, {
			field: "loanPrice",
			name: "贷款金额",
			prop: "loanPrice",
			clazz: "blue"
		}, {
			field: "payType",
			name: "支付方式",
			prop: function(v) { return building.payType[v.payType]; },
			clazz: "grey"
		}, {
			field: "balanceStatus",
			name: "结算状态",
			prop: function(v) { return building.balanceStatus[v.balanceStatus]; },
			clazz: "red"
		}];
	}

	function buildBuildingLinebtns() {

		return {
			view: {
				name: "查看",
				clazz: "btn-yellow",
				handle: function(v) {
					buildingDetail(v);
				}
			},
			type: {
				name: "更改支付方式",
				clazz: "btn-success",
				handle: function(v) {
					updatePayType(v.bid);
				}
			},
			money: {
				name: "生成款项",
				clazz: "btn-warning",
				handle: function(v) {
					// 还没写
				}
			},
			end: {
				name: "合同终止",
				clazz: "btn-inverse",
				handle: function(v) {
					buildingEnd(v.bid);
				}
			}
		};
	}

	function buildBuildingButtons() {

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addBuilding').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		var $addb = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'createAuser').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($addb);
		var $addspan = $('<span></span>').text('创建代理人').appendTo($addb);

		return [$adda, $addb];
	}

	var searcher = new Searcher();

	searcher.set("condList", "pagenation", "resultList", api.building.pageBuilding, null, ["buildingNo"], "buildingPostData", null, false, buildBuildingButtons);
	searcher.line("no", buildBuildingLineprops(), buildBuildingLinebtns()).render();

	// 添加
	com.focusPage('a[name="addBuilding"]', '#pagenation').click(function(){
		deleteData();
		building.modals.buildingModal.modal("show");
	});

	// 创建代理人
	com.focusPage('a[name="createAuser"]', '#pagenation').click(function(){
		com.cleanItems(building.customerItems);
		building.modals.customerModal.modal("show");
	});

	function buildingDetail(v){
		
		params.building.building = v;
		
		com.popup4page("#stockRecordPopUp", api.index.buildingSchedule.url,"查看");
	}

	function updatePayType(bid){
	    
		building.bid = bid;
		
		com.post(api.building.queryBuildingByBid, {"building.bid" : bid}, function(res){
			buildingPayType = res.building.payType;
			building.items.payTypes.val(res.building.payType);
		}, null, false);
		
		com.focusPage("#buildingPayTypeModal").modal("show");
	}

	// 没想到合适的地方 所以在页面上没有体现
	function updateBuilding(buildingId, cvalue){
	    
		var options = {};
		
		options["building.bid"] = buildingId;
		options["building.balanceStatus"] = cvalue;

		com.post(api.building.updateBuildingForBalanceStatus(), options);
	}

	function saveData(){

		if(com.validate("buildingModal") || building.dataFlag){
			return;
		}

		var options = {
			'building.buildingHouse.hsid': building.hsid,
			'building.buildingCustomer.csid': building.csid,
			'building.buildingHouseAgent.cid': com.typeahead("hsAUser"),
			'building.buildingCustomerAgent.cid': com.typeahead("csAUser"),
			'building.signingTime': building.items.signingTime.val(),
			'building.tradePrice': building.items.tradePrice.val(),
			'building.downpayment': building.items.downpayment.val(),
			'building.loanPrice': building.items.loanPrice.val(),
			'building.payType': building.items.payType.val(),
			'building.balanceStatus': building.items.balanceStatus.val()
		};

		com.post(api.building.bindBuilding, options, function(res){
			com.showAlert(com.info, "成功创建房产单");

			searcher.doSearch();
		});

		building.modals.buildingModal.modal("show");
	}

	// 更改支付方式
	function updatePayTypeFun(){
	    
		if(buildingPayType == com.focusPage("#payTypes").val()){
			com.showAlert(com.warning, "两次支付方式不能相同");
			return false;
		}

		var options = {
			'building.bid': building.bid,
			'building.payType': building.items.payTypes.val()
		};

		com.post(api.building.resetBuildingSchedule, options, function(res){
			searcher.doSearch();
		});

		com.focusPage("#buildingPayTypeModal").modal("hide");
	}

	// 合同终止
	function buildingEnd(bid){
		// 因为涉及到款项(中介费和贷款服务费),所以还没有写
	}

	// 创建客户
	function createCustomer(){

		if(building.customerItems.cardType.val() == "身份证"){
			regCard(building.customerItems.cardNum, /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
		}else if(building.customerItems.cardType.val() == "军官证"){
			regCard(building.customerItems.cardNum, /^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/);
		}

		if(com.validate("customerModal") || building.customerRepeatFlg || building.cardFlag){
		    
			if(building.customerRepeatFlg){
				com.showTip(com.focusPage("#phone"), "电话号码已存在", "right");
			}
			
			return false;
		}

		var customerOptions = {};

		customerOptions["customer.name"] =  building.customerItems.customerName.val();
		customerOptions["customer.gender"] = com.genderType[building.customerItems.gender.prop("checked")];
		customerOptions["customer.qq"] = building.customerItems.qq.val();
		customerOptions["customer.wechat"] = building.customerItems.wechat.val();
		customerOptions["customer.email"] = building.customerItems.email.val();
		customerOptions["customer.relationshipType"] = building.customerItems.relationshipType.val();
		customerOptions["customer.address"] =  building.customerItems.address.val();
		customerOptions["customer.phone"] =  building.customerItems.phone.val();

		com.post(api.data.addCustomer, customerOptions, function(res){
			com.showAlert(com.info, "创建用户成功");
			com.focusPage("#customerModal").modal("hide");
		}, function(e){
			com.showAlert(com.warning, "客户电话已存在");
		}, false);
	}

	// 验证证件号
	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				building.cardFlag = true;
				com.showTip(cardParam, "请输入正确的证件号码", "right");
			}else{
				building.cardFlag = false;
			}
		}else{
			building.cardFlag = false;
		}
	}

	function deleteData(){
	    
	    com.clearValidator("buildingModal");
	    com.cleanTypeahead("hsAUser");
	    com.cleanTypeahead("csAUser");
		com.cleanItems(building.items);
	}
});
