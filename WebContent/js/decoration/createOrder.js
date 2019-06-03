
jQuery(function($) {

	var orderEntry = {
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		backVisitItems: {},
		orderItems: {},
		relationshipType: ["普通客户", "企业高端客户", "企业关系客户", "领导关系客户", "员工关系"],
		validator: {
			houseNumber: {
				type: "v_houseNumber",
				regex: /^D_\d{3}$/g,
				errorMsg: "楼盘名称规则"
			}
		},

		repeatFlg: false,
		repeatCustomerFlg: false,
		editFlag: false,
		customerRepeatFlg: false,
		customerItems: {},
		houseItems: {},
		houseFlag:false,
		valideteresult: null
	};

	orderEntry.orderItems.decorationFlag = com.focusPage("#decorationFlag");
	orderEntry.orderItems.materialOrderFlag = com.focusPage("#materialOrderFlag");
	orderEntry.orderItems.customerId = com.focusPage("#customerId");
	orderEntry.orderItems.villageId = com.focusPage("#villageId");
	orderEntry.orderItems.orderType = com.focusPage("#orderType");
	orderEntry.orderItems.orderGrade = com.focusPage("#orderGrade");
	orderEntry.orderItems.houseNumber = com.focusPage("#houseNumber");
	orderEntry.orderItems.houseType = com.focusPage("#houseType");
	orderEntry.orderItems.houseClass = com.focusPage("#houseClass");
	orderEntry.orderItems.apartmentType = com.focusPage("#apartmentType");
	orderEntry.orderItems.houseArea = com.focusPage("#houseArea");
	orderEntry.orderItems.designerId = com.focusPage("#designerId");
	orderEntry.orderItems.salesmanId = com.focusPage("#salesmanId");
	orderEntry.orderItems.salesmanType = com.focusPage("#salesmanType");
	orderEntry.orderItems.notSalesmanName = com.focusPage("#notSalesmanName");
	orderEntry.orderItems.notSalesmanRate = com.focusPage("#notSalesmanRate");
	orderEntry.orderItems.notSalesmanPhone = com.focusPage("#notSalesmanPhone");
	orderEntry.orderItems.notSalesmanContent = com.focusPage("#notSalesmanContent");
	orderEntry.orderItems.backOrderName = com.focusPage("#backOrderName");
	orderEntry.orderItems.backOrderPhone = com.focusPage("#backOrderPhone");
	orderEntry.orderItems.backOrderContent = com.focusPage("#backOrderContent");
	orderEntry.orderItems.status = com.focusPage("#status");
	orderEntry.orderItems.quoterId = com.focusPage("#quoterId");
	orderEntry.orderItems.escorterId = com.focusPage("#escorterId");
	orderEntry.saveBtn = com.focusPage("#saveBtn").on("click", createOrder);
	orderEntry.cancelBtn = com.focusPage("#cancelBtn").on("click", initCreate);

	orderEntry.customerItems.customerName = com.focusPage("#customerName");

	orderEntry.customerItems.gender = com.focusPage("#gender").switchBtn("gender");
	orderEntry.customerItems.identity = com.focusPage("#identity");
	orderEntry.customerItems.officer = com.focusPage("#officer");
	orderEntry.customerItems.passport = com.focusPage("#passport");
	orderEntry.customerItems.phone = com.focusPage("#phone").on("blur", function () {
		$this = $(this);

		checkPhone($this);
	});
	orderEntry.customerItems.qq = com.focusPage("#qq");
	orderEntry.customerItems.wechat = com.focusPage("#wechat");
	orderEntry.customerItems.email = com.focusPage("#email");
	orderEntry.customerItems.address = com.focusPage("#address");
	orderEntry.customerItems.relationshipType = com.focusPage("#relationshipType");
	orderEntry.customerItems.relationshipType.bindData(orderEntry.relationshipType, "key", "value", false);

	orderEntry.houseItems.no = com.focusPage("#no");
	orderEntry.houseItems.type = com.focusPage("#type");
	orderEntry.houseItems.buildArea = com.focusPage("#buildArea");
	orderEntry.houseItems.maxFloor = com.focusPage("#maxFloor");
	orderEntry.houseItems.through = com.focusPage("#through");
	orderEntry.houseItems.houseTypeOne = com.focusPage("#houseTypeOne");
	orderEntry.houseItems.houseTypeTwo = com.focusPage("#houseTypeTwo");
	orderEntry.houseItems.houseTypeThr = com.focusPage("#houseTypeThr");
	orderEntry.houseItems.houseTypeFour = com.focusPage("#houseTypeFour");
	orderEntry.houseItems.orientation = com.focusPage("#orientation");
	orderEntry.houseItems.feature = com.focusPage("#feature");
	orderEntry.houseItems.waterVapour = com.focusPage("#waterVapour");
	orderEntry.houseItems.parlourType = com.focusPage("#parlourType");
	orderEntry.houseItems.heatingType = com.focusPage("#heatingType");
	orderEntry.houseItems.rule = com.focusPage("#rule");
	orderEntry.houseItems.errMsg = com.focusPage("#errMsg");

    com.initTypeahead('no', api.data.queryVillageForNameByPinyin,"pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, key, value){

        deleteVillageData("no");

        com.post(api.data.queryVillageById, {"village.no": key}, function (res) {
            orderEntry.houseItems.rule.html("推荐楼牌号规则：" + (res.village.rule ? res.village.rule : "暂无推荐规则"));
        }, function(){
            com.show(com.warning, "楼盘信息不存在");
            key = "", value = "";
        }, false);

        return value;
    });

	orderEntry.houseItems.built = com.focusPage("#built").on("blur", function (e) {
		deleteVillageData("built",orderEntry.houseItems);
	});

	orderEntry.houseItems.unit = com.focusPage("#unit").on("blur", function (e) {
		deleteVillageData("unit",orderEntry.houseItems);
	});

	orderEntry.houseItems.floor = com.focusPage("#floor").on("blur", function (e) {
		deleteVillageData("floor",orderEntry.houseItems);
	});

	orderEntry.houseItems.door = com.focusPage("#door").on("blur", function (e) {
		validatehouse();
	});
	orderEntry.houseItems.builtrule = com.focusPage("#builtrule").on("change", function (e) {
		validatehouse();
	});
	orderEntry.houseItems.unitrule = com.focusPage("#unitrule").on("change", function (e) {
		validatehouse();
	});
	orderEntry.houseItems.floorrule = com.focusPage("#floorrule").on("change", function (e) {
		validatehouse();
	});
	orderEntry.houseItems.doorrule = com.focusPage("#doorrule").on("change", function (e) {
		validatehouse();
	});

	$.extend(com.validator, orderEntry.validator);

	com.post(api.ds.decoration, {}, function (res) {
		orderEntry.salesmanType = res.salesmanType;
		orderEntry.orderItems.salesmanType.bindData(orderEntry.salesmanType, 'key', 'value');

		orderEntry.orderItems.orderType.bindData(res.type, 'key', 'value');

		orderEntry.houseType = res.houseType;
		orderEntry.orderItems.houseType.bindData(orderEntry.houseType, 'key', 'value');

		orderEntry.status = res.status;
		orderEntry.orderItems.status.bindData(orderEntry.status, 'key', 'value');

		orderEntry.houseClass = res.houseClass;
		orderEntry.orderItems.houseClass.bindData(orderEntry.houseClass, 'key', 'value');

        orderEntry.orderGrade = res.orderGrade;
        orderEntry.orderItems.orderGrade.bindData(orderEntry.orderGrade, 'key', 'value');
	});
	
	com.initTypeahead('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value", function(list, key, value){
	    
	    
	    com.post(api.decoration.queryDecorationByCustomerId, {"decoration.customer.cid": key}, function (res) {
            if (res.decorations && res.decorations.length > 0) {

                var decoration = res.decorations[0];

                com.showTip(com.focusPage("#customerId"), "订单已存在.订单号:" + decoration.orderId + ",订单所属设计师:" + decoration.designer.currentName, "left");
                orderEntry.repeatCustomerFlg = true;
                
                key = "" , value = "";
            } else {
                com.clearValidator("#customerId", true);
                orderEntry.repeatCustomerFlg = false;
            }
        }, null, false);
	    
	    return value;
	});

	com.initTypeahead('villageId', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");

	com.initTypeahead('designerId', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, "autoFillKeyValue", "key", "value");
	com.initTypeahead('salesmanId', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, "autoFillKeyValue", "key", "value");
	com.initTypeahead('quoterId', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, "autoFillKeyValue", "key", "value");
	com.initTypeahead('escorterId', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, "autoFillKeyValue", "key", "value");

	com.initTypeahead('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");


	com.focusPage("#houseNumber").on("blur", function (e) {
		if ($(this).val() == "" || com.focusPage("#villageId").val() == "") {
			return;
		}

		var housePostData = {
			"house.village.no": orderEntry.orderItems.villageId.val(),
			"house.houseNumber": orderEntry.orderItems.houseNumber.val(),
			"house.status": 0
		};

		com.post(api.data.queryHouseByNoAHnum, housePostData, function (res) {
			com.post(api.decoration.checkDecoration, {"filters[0].data": res.house.hid,"filters[0].field": "houseId","filters[0].op": "eq","filters[1].data": "4","filters[1].field": "status","filters[1].op": "ne","filters[2].data": "7","filters[2].field": "status","filters[2].op": "ne","filters[3].data": "5","filters[3].field": "status","filters[3].op": "ne"}, function (des) {
				if (des.decoration && des.decoration.orderId) {
					com.showTips($("#houseNumber"), "订单已存在：订单号：" + des.decoration.orderId + " 订单所属设计师:" + des.decoration.designer.currentName, true);
					orderEntry.repeatFlg = true;
				} else {
                    com.showConfirm("已有该房产信息，是否绑定?", function () {
						orderEntry.houseItems.hid = res.house.hid;
						orderEntry.repeatFlg = false;
						orderEntry.orderItems.houseArea.val(res.house.buildArea);
						orderEntry.orderItems.apartmentType.val(res.house.houseType);
                        com.showAlert(com.info, "绑定成功")
					}, function () {
                        com.focusPage("#houseModal").modal("show");
                    });
				}
			}, null, false);

		}, function () {
			com.showAlert(com.warning, "房产不存在，请创建房产");
			clearHouse();
			com.clearValidator("#houseNumber", true);
			com.updateTypeahead('no', orderEntry.orderItems.villageId.val(), com.focusPage("#villageId" + " option:selected").text());
			orderEntry.houseItems.no.trigger("change");
			com.focusPage("#houseModal").modal("show");
		}, false);

	});

	com.focusPage('#fl-statement').statement("装修单", "录入订单");

	com.post(api.ds.building, {}, function (res) {
		orderEntry.houseItems.type.bindData(res.houseType, "key", "value");
		orderEntry.houseItems.through.bindData(res.through, "key", "value");
		orderEntry.houseItems.orientation.bindData(res.orientation, "key", "value");
		orderEntry.houseItems.waterVapour.bindData(res.waterVapour, "key", "value");
		orderEntry.houseItems.parlourType.bindData(res.parlourType, "key", "value");
		orderEntry.houseItems.heatingType.bindData(res.heatingType, "key", "value");
		orderEntry.houseItems.builtrule.bindData(res.buildrule, "key", "value");
		orderEntry.houseItems.unitrule.bindData(res.buildrule, "key", "value");
		orderEntry.houseItems.floorrule.bindData(res.buildrule, "key", "value");
		orderEntry.houseItems.doorrule.bindData(res.buildrule, "key", "value");
	}, null, false);

	com.focusPage("#createCustomerSaveBtn").on("click", createCustomer);

	com.focusPage("#createCustomer").on("click", function () {
		clearCustomer();
		com.focusPage("#customerModal").modal("show");
	});

	com.focusPage("#createHouse").on("click", function () {
		clearHouse();
		com.focusPage("#houseModal").modal("show");
	});

	com.focusPage("#cancelHouselBtn").on("click", function () {
		clearHouse();
		com.focusPage("#houseModal").modal("hide");
	});

	com.focusPage("#saveHouseBtn").on("click", function () {

		if (com.validate("houseModal")) {
			return;
		}

		if(orderEntry.houseFlag){
			validatehouse();
			return;
		}else{
			saveHouse();
		}

	});

	com.focusPage("#decorationFlag").on("click", function (res) {
		if (com.focusPage("#decorationFlag").is(":checked") == true) {
			com.focusPage("#designerId").addClass("v_required");
			com.focusPage("#salesmanId").addClass("v_required");

			com.focusPage(".material").removeClass("hide");
		} else {
			com.focusPage("#designerId").removeClass("v_required");
			com.focusPage("#salesmanId").removeClass("v_required");

			com.focusPage(".material").addClass("hide");
		}
	});

	com.focusPage("#materialOrderFlag").on("click", function (res) {
		if (com.focusPage("#decorationFlag").is(":checked") != true && com.focusPage("#materialOrderFlag").is(":checked") == true) {
			com.focusPage("#designerId").removeClass("v_required");
			com.focusPage("#salesmanId").removeClass("v_required");

			com.focusPage(".material").addClass("hide");
		} else {
			com.focusPage("#designerId").addClass("v_required");
			com.focusPage("#salesmanId").addClass("v_required");

			com.focusPage(".material").removeClass("hide");
		}
	});

	function createOrder() {

		var btn = com.focusPage("#saveBtn");

		var options = {
			"decoration.customer.cid": com.typeahead("customerId"),
			"decoration.houseType": orderEntry.orderItems.houseType.val(),
			"decoration.houseClass": orderEntry.orderItems.houseClass.val(),
			"decoration.designer.userId": com.typeahead("designerId"),
			"decoration.salesman.userId": com.typeahead("salesmanId"),
			"decoration.salesmanType": orderEntry.orderItems.salesmanType.val(),
			"decorationInfo.notSalesmanName": orderEntry.orderItems.notSalesmanName.val(),
			"decoration.notSalesmanRate": orderEntry.orderItems.notSalesmanRate.val(),
			"decorationInfo.notSalesmanPhone": orderEntry.orderItems.notSalesmanPhone.val(),
			"decorationInfo.notSalesmanContent": orderEntry.orderItems.notSalesmanContent.val(),
			"decorationInfo.backOrderName": orderEntry.orderItems.backOrderName.val(),
			"decorationInfo.backOrderPhone": orderEntry.orderItems.backOrderPhone.val(),
			"decorationInfo.backOrderContent": orderEntry.orderItems.backOrderContent.val(),
			"decoration.resourceType": orderEntry.orderItems.status.val(),
			"decoration.approveStatus": 0,
			"decoration.type": orderEntry.orderItems.orderType.val(),
			"decoration.quoter.userId": com.typeahead("quoterId"),
			"decoration.escorter.userId": com.typeahead("escorterId"),
			"decoration.house.hid": orderEntry.houseItems.hid,
			"decoration.grade": orderEntry.orderItems.orderGrade.val()
		};

		if (com.validate('createOrder') || orderEntry.repeatFlg || orderEntry.repeatCustomerFlg)
			return;

		if (orderEntry.houseItems.hid == null) {
			com.showAlert(com.error, "房产信息未填写");
			return;
		}


		if ((1 - parseFloat(com.focusPage("#notSalesmanRate").val()) < 0.0000001) && parseFloat(com.focusPage("#notSalesmanRate").val()) > -0.0000001) {
            com.showAlert(com.warning, "非业务提点必须大于0小于1");
			return;
		}

		btn.button('loading');
		com.post(api.decoration.createDecoration, options, function () {
			com.showAlert(com.info, "操作成功");
			initCreate();

			btn.button('reset');
		}, function () {
			btn.button('reset');
		});
	}

	function initCreate() {
	    
	    com.cleanTypeahead("customerId");
	    
		orderEntry.orderItems.decorationFlag.attr("checked", "checked");
		orderEntry.orderItems.materialOrderFlag.removeAttr("checked");
		orderEntry.orderItems.villageId.get(0).selectedIndex = 0;
		orderEntry.orderItems.houseNumber.val("");
		orderEntry.orderItems.houseType.get(0).selectedIndex = 0;
		orderEntry.orderItems.houseClass.get(0).selectedIndex = 0;
		orderEntry.orderItems.apartmentType.val("");
		orderEntry.orderItems.houseArea.val("");
		orderEntry.orderItems.designerId.get(0).selectedIndex = 0;
		orderEntry.orderItems.salesmanId.get(0).selectedIndex = 0;
		orderEntry.orderItems.salesmanType.get(0).selectedIndex = 0;
		orderEntry.orderItems.notSalesmanName.val("");
		orderEntry.orderItems.notSalesmanRate.val("0");
		orderEntry.orderItems.notSalesmanPhone.val("");
		orderEntry.orderItems.notSalesmanContent.val("");
		orderEntry.orderItems.backOrderName.val("");
		orderEntry.orderItems.backOrderPhone.val("");
		orderEntry.orderItems.backOrderContent.val("");
		orderEntry.orderItems.status.get(0).selectedIndex = 0;

		com.cleanTypeahead("villageId");
		com.cleanTypeahead("designerId");
		com.cleanTypeahead("salesmanId");
        com.cleanTypeahead("quoterId");
        com.cleanTypeahead("escorterId");

		com.focusPage(".chosen-single span").html("");

		com.clearValidator("#houseNumber", true);
		com.clearValidator();

		orderEntry.repeatFlg = false;
		orderEntry.repeatCustomerFlg = false;
	}

	function saveHouse() {

		var btn = com.focusPage("#saveHouseBtn");
		var houseOptions = {};

		if (com.validate("houseModal", "top") || orderEntry.houseItems.no.val() == "") return;

		if(orderEntry.houseFlag){
			validatehouse();
			return;
		}
		houseOptions["house.village.no"] = com.typeahead("no");
		houseOptions["house.built"] = orderEntry.houseItems.built.val();
		houseOptions["house.unit"] = orderEntry.houseItems.unit.val();
		houseOptions["house.floor"] = orderEntry.houseItems.floor.val();
		houseOptions["house.door"] = orderEntry.houseItems.door.val();
		houseOptions["house.type"] = orderEntry.houseItems.type.val();
		houseOptions["house.buildArea"] = utils.changeThrDecimal(orderEntry.houseItems.buildArea.val());
		houseOptions["house.maxFloor"] = orderEntry.houseItems.maxFloor.val();
		houseOptions["house.through"] = orderEntry.houseItems.through.val();
		houseOptions["house.roomNum"] = orderEntry.houseItems.houseTypeOne.val();
		houseOptions["house.orientation"] = orderEntry.houseItems.orientation.val();
		houseOptions["house.feature"] = orderEntry.houseItems.feature.val();
		houseOptions["house.waterVapour"] = orderEntry.houseItems.waterVapour.val();
		houseOptions["house.parlourType"] = orderEntry.houseItems.parlourType.val();
		houseOptions["house.heatingType"] = orderEntry.houseItems.heatingType.val();

		var url = api.data.addHouse;
		houseOptions["house.status"] = 0;
		houseOptions["house.houseNumber"] = orderEntry.houseItems.houseNumber;
		houseOptions["house.village.no"] = com.typeahead("no");
		houseOptions["house.houseType"] = orderEntry.houseItems.houseTypeOne.val() + "室" + orderEntry.houseItems.houseTypeTwo.val() + "厅" + orderEntry.houseItems.houseTypeThr.val() + "厨" + orderEntry.houseItems.houseTypeFour.val() + "卫";

		btn.button('loading');

		com.post(url, houseOptions, function (res) {
			com.showAlert(com.info, "操作成功");
			com.updateTypeahead('villageId', orderEntry.houseItems.no.val(), orderEntry.houseItems.no.val());
			orderEntry.orderItems.houseNumber.val(orderEntry.houseItems.houseNumber);
			orderEntry.houseItems.hid = res.house.hid;
			orderEntry.orderItems.houseArea.val(res.house.buildArea);
			orderEntry.orderItems.apartmentType.val(res.house.houseType);
			clearHouse();
			btn.button('reset');

			com.focusPage("#houseModal").modal("hide");

		}, function (e) {
			com.showAlert(com.error, e.errorMsg);
			btn.button('reset');
		});
	}

	function clearHouse() {
		orderEntry.houseItems.rule.html("");
		orderEntry.houseItems.no.prop("disabled", false);
		orderEntry.houseItems.no.get(0).selectedIndex = 0;
		com.cleanItems(orderEntry.houseItems);
		com.cleanTypeahead("no");
		com.clearValidator();
		com.focusPage("#errMsg").css("border", "0px");
	}

	function createCustomer() {

		regcard(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, orderEntry.customerItems.identity);
		regcard(/^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/, orderEntry.customerItems.officer);

		if (com.validate("customerModal") || orderEntry.customerRepeatFlg) {
			return;
		}

		var url;
		var options = {
			"customer.name": orderEntry.customerItems.customerName.val(),
			"customer.gender": com.genderType[orderEntry.customerItems.gender.prop("checked")],
			"customer.phone": orderEntry.customerItems.phone.val(),
			"customer.identity": orderEntry.customerItems.identity.val(),
			"customer.officer": orderEntry.customerItems.officer.val(),
			"customer.passport": orderEntry.customerItems.passport.val(),
			"customer.qq": orderEntry.customerItems.qq.val(),
			"customer.wechat": orderEntry.customerItems.wechat.val(),
			"customer.email": orderEntry.customerItems.email.val(),
			"customer.relationshipType": orderEntry.customerItems.relationshipType.val(),
			"customer.address": orderEntry.customerItems.address.val()
		};


		url = api.data.addCustomer;

		com.post(url, options, function (res) {
			com.showAlert(com.info, "创建用户成功");
			
			com.updateTypeahead('customerId', res.customer.cid, res.customer.name + '-' + res.customer.phone)

			com.focusPage("#customerModal").modal("hide");
		}, function (e) {
			com.showAlert(com.error, e.errorMsg);
		}, false);
	}

	function clearCustomer() {
		orderEntry.customerItems.customerName.val("");
		orderEntry.customerItems.gender.get(0).selectedIndex = 0;
		orderEntry.customerItems.identity.val("");
		orderEntry.customerItems.officer.val("");
		orderEntry.customerItems.passport.val("");
		orderEntry.customerItems.phone.val("");
		orderEntry.customerItems.qq.val("");
		orderEntry.customerItems.wechat.val("");
		orderEntry.customerItems.email.val("");
		orderEntry.customerItems.address.val("");
		orderEntry.customerItems.relationshipType.get(0).selectedIndex = 0;

		com.clearValidator();

	}

	function regcard(reg, id) {

		if (id.val() != "") {
			if (reg.test(id.val()) == false) {
				com.showPopover(id, {errorMsg: "请输入正确的证件号!!"}, "right");
			} else {
				id.css("border", "1px solid #d5d5d5").popover("destroy");
			}
		} else {
			id.css("border", "1px solid #d5d5d5").popover("destroy");
		}

	}

	function checkPhone($id) {

        var reg = /^((1[0-9]{10})|(0[0-9]{10}))((#((1[0-9]{10})|(0[0-9]{10})))){0,4}$/;
        if ($id.val() == "" || $id.val() == 0) {
            orderEntry.customerRepeatFlg = true;
            com.showPopover($id, {errorMsg: "电话号码不能为空"}, "bottom");
        } else {
            if (reg.test($id.val()) == false) {
                orderEntry.customerRepeatFlg = true;
                com.showPopover($id, {errorMsg: "请输入正确的手机号或固定电话!!"}, "bottom");

            } else {
                com.post(api.data.checkCustomerForPhone, {
                    "customerPhone.cid": null,
                    "customerPhone.phone": $id.val(),
                    "customerPhone.status": null
                }, function (res) {
                    orderEntry.customerRepeatFlg = false;
                    $id.css("border", "1px solid #d5d5d5").popover("destroy");
                }, function (res) {
                    orderEntry.customerRepeatFlg = true;
                    com.showPopover($id, {errorMsg: "电话信息已存在"}, "bottom");
                }, false);

            }
        }
    }

	function validatehouse(no, houseNumber) {

		orderEntry.valideteresult = houseUtils.anytimevalidate(orderEntry.houseItems, null, true);

		if (orderEntry.valideteresult.prehouse != undefined) {
			orderEntry.houseFlag = orderEntry.valideteresult.prehouse.Flag;
		}
		orderEntry.houseItems.houseNumber = orderEntry.valideteresult.houseNumber;
	}


	function deleteVillageData(paramFlag,items) {
		switch (paramFlag) {
			case "built":
				orderEntry.houseItems.unit.val("");
				orderEntry.houseItems.floor.val("");
				orderEntry.houseItems.door.val("");
				break;
			case "unit":
				orderEntry.houseItems.floor.val("");
				orderEntry.houseItems.door.val("");
				break;
			case "floor":
				orderEntry.houseItems.door.val("");
				break;
			case "no":
				orderEntry.houseItems.built.val("");
				orderEntry.houseItems.unit.val("");
				orderEntry.houseItems.floor.val("");
				orderEntry.houseItems.door.val("");
				orderEntry.houseItems.builtrule.get(0).selectedIndex = 0;
				orderEntry.houseItems.unitrule.get(0).selectedIndex = 0;
				orderEntry.houseItems.floorrule.get(0).selectedIndex = 0;
				orderEntry.houseItems.doorrule.get(0).selectedIndex = 0;
				com.focusPage("#door").css("border", "1px solid #d5d5d5").popover("destroy");
				com.focusPage("#errMsg").popover("destroy");
				break;
		}
	}



});
