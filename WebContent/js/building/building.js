
jQuery(function($) {

	var buildingPayType;
	var building = {
		bid: null,
		saveBtn: null,
		cancelBtn: null,
		deployedBtn: null,
		createCustomerSaveBtn: null,
		modal: null,
		items: {},
		customerItems: {},
		hsid: null,
		csid: null,
		payType: [],
		balanceStatus: [],
		editFlag: false,
		hsFlag: false,
		csFlag: false,
		cardFlag: false,
		customerRepeatFlg: false,
		repeatFlg: false,
		cardType: ["身份证", "军官证", "护照"],
	};

	building.saveBtn = $("#saveBtn").on("click", saveData);
	building.cancelBtn = $("#cancelBtn").on("click", deleteData);
	building.deployedBtn = $("#deployedBtn").unbind("click").on("click", updatePayTypeFun);
	building.createCustomerSaveBtn = $("#createCustomerSaveBtn").on("click", createCustomer);

	$("#cardType").bindData(building.cardType);
	$("#grade").bindData(building.grade);

	building.items.hsNo = $("#hsNo");
	building.items.csNo = $("#csNo");
	building.items.hsAUser = $("#hsAUser");
	building.items.csAUser = $("#csAUser");
	building.items.signingTime = $("#signingTime");
	building.items.tradePrice = $("#tradePrice");
	building.items.downpayment = $("#downpayment");
	building.items.loanPrice = $("#loanPrice");
	building.items.payType = $("#payType");
	building.items.balanceStatus = $("#balanceStatus");

	building.customerItems.customerName = $("#customerName");
	building.customerItems.cardType = $("#cardType");
	building.customerItems.cardNum = $("#cardNum");
	building.customerItems.gender = $("#gender");
	building.customerItems.qq = $("#qq");
	building.customerItems.wechat = $("#wechat");
	building.customerItems.email = $("#email");
	building.customerItems.relationshipType = $("#relationshipType");
	building.customerItems.address = $("#address");
	building.customerItems.phone = $("#phone");

	//修改支付状态用的
	building.items.payTypes = $("#payTypes");

	building.customerItems.gender = $("#gender").switchBtn("gender");

	$(".date-picker").datepicker({autoclose: !0}).on("show",function() {
		setTimeout(function() {
			$(".dropdown-menu").css("z-index", 1060)
		},0)
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
				$('<option></option>').attr("value" , v.key).html(v.value).appendTo($("#relationshipType"));
			});
		}
	});

	building.modal = $("#buildingModal");

	$("#hsNo").on("blur", function(){
		com.post(api.building.queryHouseSourceByNo, {"houseSource.no" : building.items.hsNo.val()}, function(res){
			if(res.houseSource.status != 0){
				building.dataFlag = true;
				com.showPopover($("#hsNo"),{errorMsg: "房源已签约或失效！"}, "right");
			}else{
				building.dataFlag = false;
				building.hsid = res.houseSource.hsid;
				$("#hsNo").css("border", "1px solid #d5d5d5").popover("destroy");
			}
		}, function(data){
			com.showPopover($("#hsNo"),{errorMsg: "请正确输入房源编号！"}, "right");
			building.dataFlag = true;
		}, false);
	});

	$("#csNo").on("blur", function(){
		com.post(api.building.queryCustomerSourceByNo, {"customerSource.no" : building.items.csNo.val()}, function(res){
			if(res.customerSource.status != 0){
				building.dataFlag = true;
				com.showPopover($("#csNo"),{errorMsg: "客源已签约或失效！"}, "right");
			}else{
				building.dataFlag = false;
				building.csid = res.customerSource.csid;
				$("#csNo").css("border", "1px solid #d5d5d5").popover("destroy");
			}
		}, function(data){
			com.showPopover($("#csNo"),{errorMsg: "请正确输入客源编号！"}, "right");
			building.dataFlag = true;
		}, false);
	});

	//检查电话号是否已存在
	building.customerItems.phone = $("#phone").on("blur", function(){
		$this = $(this);
		void 0 == $this.val() || "" == $this.val().trim() ? (com.showPopover($("#phone"),{errorMsg: "电话号码不能为空"}, "right"), building.repeatFlg = false) : com.post(api.data.checkCustomerForPhone, {
			"customerPhone.phone": $this.val(),
			"customerPhone.status": 0
		}, function(res) {
			building.customerRepeatFlg = false;
			$("#phone").css("border", "1px solid #d5d5d5").popover("destroy");
		}, function(res){
			building.customerRepeatFlg = true;
			com.showPopover($("#phone"),{errorMsg: "电话号码已存在"}, "right");
		});
	});

	$.extend(com.validator, building.validator);

	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = creatLine(v);

					$liLine.appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var creatLine = function(v){

			var that = this;
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("查看");
			var $btnType= $('<a></a>').addClass('btn btn-minier btn-success').html("更改支付方式");
			var $btnMoney= $('<a></a>').addClass('btn btn-minier btn-warning').html("生成款项");
			var $btnEnd= $('<a></a>').addClass('btn btn-minier btn-inverse').html("合同终止");

			var propertyArr = [
				["楼盘地址:", v.houseSource.house.village.name + " " + v.houseSource.house.houseNumber , "grey"],
				["房源所属人:", v.houseSource.customer.name, "grey"],
				["客源姓名:", v.customerSource.customer.name, "grey"],
				["房源代理人:", v.houseSourceAgent.name, "grey"],
				["客源代理人:", v.customerSourceAgent.name, "grey"],
				["签约时间:", v.signingTime, "green"],
				["成交价格:", v.tradePrice, "blue"],
				["首付款:", v.downpayment, "blue"],
				["贷款金额:", v.loanPrice, "blue"],
				["支付方式:", building.payType[v.payType], "grey"],
				["结算状态:", building.balanceStatus[v.balanceStatus], "red"]
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnView).append($btnType).append($btnMoney).append($btnEnd).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			$btnView.click(function(){
				buildingDetail(v.bid, v.payType);
			});

			//更改支付方式
			$btnType.unbind("click");
			$btnType.click(function(){
				//这里目前关于支付方式更改是涉及到的贷款服务费没有处理，页面用该有一个生成款项的入口
				updatePayType(v.bid);
			});

			//生成款项
			$btnMoney.click(function(){
				//还没写
			});

			//合同终止
			$btnEnd.click(function(){
				//这里应该弹出退款框，合同终止的情况下将中介费，贷款服务费退还
				buildingEnd(v.bid);
			});

			return $liLine;
		};

		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		}
	})();

	var searcher = new Searcher();

	searcher.init(["buildingNo"], "condList", api.building.pageBuilding, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "buildingPostData",null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addBuilding').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		var $addb = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'createAuser').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($addb);
		var $addspan = $('<span></span>').text('创建代理人').appendTo($addb);

		return [$adda, $addb];
	});

	//添加
	$('a[name="addBuilding"]', '#pagenation').click(function(){
		deleteData();
		com.initChosen('hsAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
		com.initChosen('csAUser', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value");
		$("#buildingModal").modal("show");
	});

	//创建代理人
	$('a[name="createAuser"]', '#pagenation').click(function(){
		com.cleanItems(building.customerItems);
		$("#customerModal").modal("show");
	});

	function buildingDetail(buildingId, type){
		params.bid = buildingId;
		params.type = type;
		com.switchPage(api.index.buildingSchedule.url);
	}

	function updatePayType(bid){
		//这里目前有一个问题，就是款项，如果是全款转贷款，或者贷款转全款的时候，涉及到的贷款服务费的问题
		building.bid = bid;
		com.post(api.building.queryBuildingByBid, {"building.bid" : bid}, function(res){
			buildingPayType = res.building.payType;
			building.items.payTypes.val(res.building.payType);
		}, null, false);
		$("#buildingPayTypeModal").modal("show");
	}

	//没想到合适的地方  所以在页面上没有体现
	function updateBuilding(buildingId, cvalue){
		var options = {};
		options["building.bid"] = buildingId;
		options["building.balanceStatus"] = cvalue;

		com.post(api.building.updateBuildingForBalanceStatus(), options, function(res){

		});
	}

	function saveData(){
		if(com.validate() || building.dataFlag){
			return;
		}

		var options = {
			'building.houseSource.hsid': building.hsid,
			'building.customerSource.csid': building.csid,
			'building.houseSourceAgent.cid': building.items.hsAUser.val(),
			'building.customerSourceAgent.cid': building.items.csAUser.val(),
			'building.signingTime': building.items.signingTime.val(),
			'building.tradePrice': building.items.tradePrice.val(),
			'building.downpayment': building.items.downpayment.val(),
			'building.loanPrice': building.items.loanPrice.val(),
			'building.payType': building.items.payType.val(),
			'building.balanceStatus': building.items.balanceStatus.val(),
		};

		com.post(api.building.bindBuilding, options, function(res){
			com.showAlert(com.info, "成功创建房产单！");
			searcher.doSearch();
		});

		$("#buildingModal").modal("hide");
	}

	//更改支付方式
	function updatePayTypeFun(){
		if(buildingPayType == $("#payTypes").val()){
			com.showAlert(com.warning, "两次支付方式不能相同！");
			return;
		}

		var options = {
			'building.bid': building.bid,
			'building.payType': building.items.payTypes.val(),
		};

		com.post(api.building.resetBuildingSchedule, options, function(res){
			searcher.doSearch();
		});

		$("#buildingPayTypeModal").modal("hide");
	}

	//合同终止
	function buildingEnd(bid){
		//因为涉及到款项(中介费和贷款服务费)，所以还没有写
	}

	//创建客户
	function createCustomer(){

		if(building.customerItems.cardType.val() == "身份证"){
			regCard(building.customerItems.cardNum, /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
		}else if(building.customerItems.cardType.val() == "军官证"){
			regCard(building.customerItems.cardNum, /^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/);
		}

		if(com.validate("customerModal") || building.customerRepeatFlg || building.cardFlag){
			if(building.customerRepeatFlg){
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
			$("#customerModal").modal("hide");
		}, function(e){
			com.showAlert(com.warning, "客户电话已存在！");
		}, false);
	}

	//验证证件号
	function regCard(cardParam, reg){
		if( cardParam.val() != "" ){
			if(reg.test(cardParam.val()) == false){
				building.cardFlag = true;
				com.showPopover(cardParam,{errorMsg: "请输入正确的证件号码！"}, "right");
			}else{
				building.cardFlag = false;
				cardParam.css("border", "1px solid #d5d5d5").popover("destroy")
			}
		}else{
			building.cardFlag = false;
			cardParam.css("border", "1px solid #d5d5d5").popover("destroy")
		}
	}

	function deleteData(){
		com.clearValidator("buildingModal");
		com.updateChosen('hsAUser', "", "");
		com.updateChosen('csAUser', "", "");
		com.cleanItems(building.items);
	}
});
