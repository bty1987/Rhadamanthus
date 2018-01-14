
jQuery(function($) {

	var customerSource = {
		saveBtn: null,
		cancelBtn: null,
		bsaveBtn: null,
		modal: null,
		items: {},
		hsid: null,
		csid: null,
		csStatus: null,
		buildItems: {},
		orientation: [],
		payType: [],
		balanceStatus: [],
		csType: [],
		editFlg: false,
		customerItems: {},
		cardType: ["身份证", "军官证", "护照"],
		grade: ["A", "B", "C", "D"],
		buildingJson:null,
		priceFlg: false,
		areaFlg: false,
		editFlag: false,
		dataFlag: false,
		validator: {},
	};

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
			isResultTypeMap : true, //是否是key - value 形式的列表
		},
	});

	$(".date-picker").datepicker({autoclose: !0}).on("show",function() {
		setTimeout(function() {
			$(".dropdown-menu").css("z-index", 1060)
		},0)
	}).next().on(ace.click_event,function() {
		a(this).prev().focus()
	});

	$("#cardType").bindData(customerSource.cardType);
	$("#grade").bindData(customerSource.grade);

	customerSource.items.gender = $("#gender").switchBtn("gender");

	customerSource.saveBtn = $("#saveBtn").on("click", updateCustomerSource);
	customerSource.cancelBtn = $("#cancelBtn").on("click", deleteDate);
	customerSource.bsaveBtn = $("#bsaveBtn").on("click", saveBuildingData);

	customerSource.items.csType = $("#csType");
	customerSource.items.purpose = $("#purpose");
	customerSource.items.intention = $("#intention");
	customerSource.items.priceLow = $("#priceLow");
	customerSource.items.priceHigh = $("#priceHigh");
	customerSource.items.areaLow = $("#areaLow");
	customerSource.items.areaHigh = $("#areaHigh");
	customerSource.items.familyType = $("#familyType");
	customerSource.items.orientation = $("#orientation");
	customerSource.items.conditions = $("#conditions");
	customerSource.items.grade = $("#grade");
	customerSource.items.comment = $("#comment");

	customerSource.customerItems.customerName = $("#customerName");
	customerSource.customerItems.cardType = $("#cardType");
	customerSource.customerItems.cardNum = $("#cardNum");
	customerSource.customerItems.gender = $("#gender");
	customerSource.customerItems.qq = $("#qq");
	customerSource.customerItems.wechat = $("#wechat");
	customerSource.customerItems.email = $("#email");
	customerSource.customerItems.relationshipType = $("#relationshipType");
	customerSource.customerItems.address = $("#address");
	customerSource.customerItems.phone = $("#phone");

	customerSource.buildItems.hsNo = $("#hsNo");
	customerSource.buildItems.csNo = $("#csNo");
	customerSource.buildItems.hsAUser = $("#hsAUser");
	customerSource.buildItems.csAUser = $("#csAUser");
	customerSource.buildItems.signingTime = $("#signingTime");
	customerSource.buildItems.tradePrice = $("#tradePrice");
	customerSource.buildItems.downpayment = $("#downpayment");
	customerSource.buildItems.loanPrice = $("#loanPrice");
	customerSource.buildItems.payType = $("#payType");
	customerSource.buildItems.balanceStatus = $("#balanceStatus");

	com.post(api.ds.building, {}, function(res){
		customerSource.items.orientation.bindData(res.orientation,"key", "value");
		customerSource.items.csType.bindData(res.csType,"key", "value");
		customerSource.buildItems.payType.bindData(res.payType,"key", "value");
		customerSource.buildItems.balanceStatus.bindData(res.balanceStatus,"key", "value");

		$.each(res.orientation, function (i,v) {
			customerSource.orientation[v.key] = v.value;
		});
		$.each(res.csType, function (i,v) {
			customerSource.csType[v.key] = v.value;
		});
		$.each(res.payType, function (i,v) {
			customerSource.payType[v.key] = v.value;
		});
		$.each(res.balanceStatus, function (i,v) {
			customerSource.balanceStatus[v.key] = v.value;
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

	$("#hsNo").on("blur", function(){
		com.post(api.building.queryHouseSourceByNo, {"houseSource.no" : customerSource.buildItems.hsNo.val()}, function(res){
			if(res.houseSource.status != 0){
				customerSource.dataFlag = true;
				com.showPopover($("#hsNo"),{errorMsg: "房源已签约或失效！"}, "right");
			}else{
				customerSource.dataFlag = false;
				customerSource.hsid = res.houseSource.hsid;
				$("#hsNo").css("border", "1px solid #d5d5d5").popover("destroy");
			}
		}, function(data){
			com.showPopover($("#hsNo"),{errorMsg: "请正确输入房源编号！"}, "right");
			customerSource.dataFlag = true;
		}, false);
	});

	customerSource.modal = $("#customerSourceModal");
	customerSource.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	$.extend(com.validator, customerSource.validator);

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
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnView = $('<a></a>').addClass('btn btn-minier btn-primary').html("编辑");
			var $btnBind = $('<a></a>').addClass('btn btn-minier btn-yellow').html("绑定房源");
			var $btnStatus = $('<input />').attr("type","checkbox").addClass('ace ace-switch ace-switch-5').prop("id", v.csid).attr("checked", v.status == 0 ? true : false);
			var $btnSpan = $('<span></span>').addClass("lbl status-lbl");
			var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-inverse').html("跟进记录");

			var propertyArr = [
				["客户名:", v.customer.name, "grey"],
				["联系电话:", v.customer.phone, "grey"],
				["客户类型:", customerSource.csType[v.type], "grey"],
				["目的:", v.purpose, "blue"],
				["需求总价:", v.price, "blue"],
				["需求面积:", v.area, "blue"],
				["需求户型:", v.familyType + "室", "blue"],
				["朝向:", customerSource.orientation[v.orientation], "blue"],
				["意向备注:", v.conditions, "blue"],
				["客户等级:", v.grade, "red"],
				["备注:", v.comment, "red"]
			];

			$.each(propertyArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnView).append($btnBind).append($btnRecord).append($btnStatus).append($btnSpan).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			//启用禁用
			$btnStatus.click(function(){
				var cvalue = $btnStatus.prop("checked");
				if(cvalue){
					cvalue = 0;
				}else{
					cvalue = 1;
				}

				if(cvalue == 0){
					$("#" + v.csid).attr("checked", false);
					updateCustomerSourceStatus(v.csid, cvalue);
				}else if(cvalue == 1){
					updateCustomerSourceStatus(v.csid, cvalue);
				}
			});

			//编辑
			$btnView.click(function(){
				customerSource.editFlag = true;
				customerSource["customerSource.csid"] = v.csid;
				customerSource.csStatus = v.status;

				$("#cancelBtn").css("display", "none");

				//绑定数据
				com.post(api.building.queryCustomerSourceByCsid, {"customerSource.csid": v.csid}, function(res){
					var customerSources = res.customerSource;
					customerSource.items.csType.prop("disabled", true);

					customerSource.items.csType.val(customerSources.type);
					customerSource.items.purpose.val(customerSources.purpose);
					var _tagOne = $('#intention').data('tag');

					if(_tagOne){
						while(_tagOne.values.length > 0){
							_tagOne.remove(0)
						}
						if(customerSources.intention && customerSources.intention != ""){
							var intentionList = customerSources.intention.split(",");
							if(intentionList.length){
								$.each(intentionList, function(i, v){
									_tagOne.fladd(v, v);
								});
							}
						}
					}
					customerSource.items.priceLow.val(customerSources.price.split(",")[0]);
					customerSource.items.priceHigh.val(customerSources.price.split(",")[1]);
					customerSource.items.areaLow.val(customerSources.area.split(",")[0]);
					customerSource.items.areaHigh.val(customerSources.area.split(",")[1]);
					customerSource.items.familyType.val(customerSources.familyType);
					customerSource.items.orientation.val(customerSources.orientation);
					var _tag = $('#conditions').data('tag');

					if(_tag){
						while(_tag.values.length > 0){
							_tag.remove(0)
						}

						if(customerSources.conditions && customerSources.conditions != ""){
							var conditionList = customerSources.conditions.split(",");
							if(conditionList.length){
								$.each(conditionList, function(i, v){
									_tag.fladd(v, v);
								});
							}
						}
					}
					customerSource.items.grade.val(customerSources.grade);
					customerSource.items.comment.val(customerSources.comment);

					customerSource.customerItems.customerName.val(customerSources.customer.name);
					//证件类型需要判断
					if(customerSources.customer.identity != null && customerSources.customer.identity != ""){
						customerSource.customerItems.cardType.val("身份证");
						customerSource.customerItems.cardNum.val(customerSources.customer.identity);
					}else if(customerSources.customer.officer != null && customerSources.customer.officer != ""){
						customerSource.customerItems.cardType.val("军官证");
						customerSource.customerItems.cardNum.val(customerSources.customer.officer);
					}else if(customerSources.customer.passport != null && customerSources.customer.passport != ""){
						customerSource.customerItems.cardType.val("护照");
						customerSource.customerItems.cardNum.val(customerSources.customer.passport);
					}

					if(customerSources.customer.gender == "女"){
						customerSource.customerItems.gender.prop("checked", true);
					}

					if(customerSources.customer.gender == "男"){
						customerSource.customerItems.gender.prop("checked", false);
					}

					customerSource.customerItems.qq.val(customerSources.customer.qq);
					customerSource.customerItems.wechat.val(customerSources.customer.wechat);
					customerSource.customerItems.email.val(customerSources.customer.email);
					customerSource.customerItems.relationshipType.val(customerSources.customer.relationshipType);
					customerSource.customerItems.address.val(customerSources.customer.address);
					customerSource.customerItems.phone.val(customerSources.customer.phone);
				}, null, false);

				readOnlyCustomerFlag(true);

				$("#customerSourceModal").modal("show");
			});

			//绑定房源
			$btnBind.click(function(){
				if(v.status != 0){
					com.showAlert(com.warning, "当前客源已签约或已失效，不能绑定房源！");
					return;
				}
				deleteData();
				customerSource.buildItems.csNo.val(v.no);
				customerSource.csid = v.csid;
				customerSource.buildItems.csNo.prop("readOnly", true);
				com.initChosen('hsAUser', api.data.queryCustomerForName, "customer.name", {}, "autoFillCustomer", "key", "value");
				com.initChosen('csAUser', api.data.queryCustomerForName, "customer.name", {}, "autoFillCustomer", "key", "value");
				$("#buildingModal").modal("show");
			});

			//跟进记录
			$btnRecord.click(function(){
				params.flag = false;
				params.csid = v.csid;
				params.csNo = v.no;
				com.switchPage(api.index.buildingRecord.url);
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

	searcher.init(["customerNo", "b_custumerName"], "condList", api.building.pageCustomerSource, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "customerSourcePostData",null, false, null, null);

	//编辑OR添加
	function updateCustomerSource(){
		if(customerSource.csStatus != 0){
			com.showAlert(com.warning, "当前客源已签约或已失效，不能修改客源信息！");
			return;
		}
		var priceHigh = customerSource.items.priceHigh.val();
		var priceLow = customerSource.items.priceLow.val();
		var areaHigh = customerSource.items.areaHigh.val();
		var areaLow = customerSource.items.areaLow.val();

		if(parseInt(priceHigh) < parseInt(priceLow) || parseInt(priceHigh) == parseInt(priceLow)){
			$("#priceHigh").removeClass("v_required");
			com.showPopover($("#priceHigh"),{errorMsg: "请填写可接受的最高价格！"}, "right");
			customerSource.priceFlg = true;
		}else{
			$("#priceHigh").addClass("v_required");
			$("#priceHigh").css("border", "1px solid #d5d5d5").popover("destroy");
			customerSource.priceFlg = false;
		}

		if(parseInt(areaHigh) < parseInt(areaLow) || parseInt(areaHigh) == parseInt(areaLow)){
			$("#areaHigh").removeClass("v_required");
			com.showPopover($("#areaHigh"),{errorMsg: "请填写需求面积的最大值！"}, "right");
			customerSource.areaFlg = true;
		}else{
			$("#areaHigh").addClass("v_required");
			$("#areaHigh").css("border", "1px solid #d5d5d5").popover("destroy");
			customerSource.areaFlg = false;
		}

		if(com.validate() || customerSource.priceFlg || customerSource.areaFlg){
			return;
		}

		var options = {};
		options["customerSource.purpose"] = customerSource.items.purpose.val();
		options["customerSource.intention"] = customerSource.items.intention.val();
		options["customerSource.price"] = customerSource.items.priceLow.val() + "," + customerSource.items.priceHigh.val();
		options["customerSource.area"] = customerSource.items.areaLow.val() + "," + customerSource.items.areaHigh.val();
		options["customerSource.familyType"] = customerSource.items.familyType.val();
		options["customerSource.orientation"] = customerSource.items.orientation.val();
		options["customerSource.conditions"] = customerSource.items.conditions.val();
		options["customerSource.grade"] = customerSource.items.grade.val();
		options["customerSource.comment"] = customerSource.items.comment.val();
		options["customerSource.csid"] = customerSource["customerSource.csid"];

		com.post(api.building.updateCustomerSource, options, function(res){
			searcher.doSearch();
		});

		$("#customerSourceModal").modal("hide");
	}

	//清楚数据
	function deleteDate(){
		com.cleanItems(customerSource.items);
		com.cleanItems(customerSource.customerItems);
	}

	function updateCustomerSourceStatus(csid, cvalue){
		var options = {};
		options["customerSource.csid"] = csid;
		options["customerSource.status"] = cvalue;

		com.post(api.building.updateCustomerSourceForStatus, options, function(res){
			$("#" + csid).attr("checked", true);
			searcher.doSearch();
		});
	}

	function readOnlyCustomerFlag(flag){
		customerSource.customerItems.customerName.prop("readonly", flag);
		customerSource.customerItems.cardType.prop("disabled", flag);
		customerSource.customerItems.cardNum.prop("readonly", flag);
		customerSource.customerItems.gender.prop("disabled", flag);
		customerSource.customerItems.qq.prop("readonly", flag);
		customerSource.customerItems.wechat.prop("readonly", flag);
		customerSource.customerItems.email.prop("readonly", flag);
		customerSource.customerItems.relationshipType.prop("disabled", flag);
		customerSource.customerItems.address.prop("disabled", flag);
		customerSource.customerItems.phone.prop("readonly", flag);
	}

	//绑定客源，创建房产单
	function saveBuildingData(){
		if(com.validate() || customerSource.dataFlag){
			return;
		}

		var options = {
			'building.houseSource.hsid': customerSource.hsid,
			'building.customerSource.csid': customerSource.csid,
			'building.houseSourceAgent.cid': customerSource.buildItems.hsAUser.val(),
			'building.customerSourceAgent.cid': customerSource.buildItems.csAUser.val(),
			'building.signingTime': customerSource.buildItems.signingTime.val(),
			'building.tradePrice': customerSource.buildItems.tradePrice.val(),
			'building.downpayment': customerSource.buildItems.downpayment.val(),
			'building.loanPrice': customerSource.buildItems.loanPrice.val(),
			'building.payType': customerSource.buildItems.payType.val(),
			'building.balanceStatus': customerSource.buildItems.balanceStatus.val(),
		};

		com.post(api.building.bindBuilding, options, function(res){
			com.showAlert(com.info, "成功绑定房源！");
			searcher.doSearch();
		});

		$("#buildingModal").modal("hide");
	}

	//删除房产单数据
	function deleteData(){
		com.clearValidator("buildingModal");
		com.updateChosen('hsAUser', "", "");
		com.updateChosen('csAUser', "", "");
		com.cleanItems(customerSource.buildItems);
	}
});
