jQuery(function($) {

    var orderEntry = {

        type: {},
        relationshipType: ["普通客户", "企业高端客户", "企业关系客户", "领导关系客户", "员工关系"],

        repeatFlg: false,
        decorationFlag: false,
        customerFlag: false,
        houseFlag: false,

        orderItems: {},
        customerItems: {},
        houseItems: {},
        decorationBusitypes: [],
        decorationAtttypes: [],

        btns: {
            saveBtn: null,
            cancellBtn: null,
        },

        maketype: params.urlLoadParams.maketype,
    };

    orderEntry.orderItems.customerId = com.focusPage("#customerId");
    orderEntry.orderItems.villageId = com.focusPage("#villageId");
    orderEntry.orderItems.orderType = com.focusPage("#orderType");
    orderEntry.orderItems.orderGrade = com.focusPage("#orderGrade");
    orderEntry.orderItems.houseNumber = com.focusPage("#houseNumber");
    orderEntry.orderItems.houseType = com.focusPage("#houseType");
    orderEntry.orderItems.houseClass = com.focusPage("#houseClass");
    orderEntry.orderItems.apartmentType = com.focusPage("#apartmentType");
    orderEntry.orderItems.houseArea = com.focusPage("#houseArea");
    orderEntry.orderItems.houseFreeArea = com.focusPage("#houseFreeArea");
    orderEntry.orderItems.houseInnerArea = com.focusPage("#houseInnerArea");
    orderEntry.orderItems.houseTotalArea = com.focusPage("#houseTotalArea");
    orderEntry.orderItems.designerId = com.focusPage("#designerId");
    orderEntry.orderItems.salesmanId = com.focusPage("#salesmanId");
    orderEntry.orderItems.busitype = com.focusPage("#busitype");
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

    orderEntry.btns.saveBtn = com.focusPage("#saveBtn").on("click", createOrder);
    orderEntry.btns.cancelBtn = com.focusPage("#cancelBtn").on("click", initCreate);

    orderEntry.customerItems.customerName = com.focusPage("#customerName");

    orderEntry.customerItems.gender = com.focusPage("#gender").switchBtn("gender");
    orderEntry.customerItems.identity = com.focusPage("#identity");
    orderEntry.customerItems.officer = com.focusPage("#officer");
    orderEntry.customerItems.passport = com.focusPage("#passport");
    orderEntry.customerItems.phone = com.focusPage("#phone").on("blur", function() {

        checkPhone($(this));
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
    orderEntry.houseItems.freeArea = com.focusPage("#freeArea");
    orderEntry.houseItems.innerArea = com.focusPage("#innerArea");
    orderEntry.houseItems.totalArea = com.focusPage("#totalArea");
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

    com.initTypeahead('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, key, value) {

        deleteVillageData("no");

        com.post(api.data.queryVillageByVid, {
            "village.no": key
        }, function(res) {

            orderEntry.houseItems.rule.html("推荐楼牌号规则：" + (res.village.rule ? res.village.rule : "暂无推荐规则"));
        }, function() {

            com.show(com.warning, "楼盘信息不存在");
            key = "", value = "";
        }, false);

        return value;
    });

    orderEntry.houseItems.built = com.focusPage("#built").on("blur", function(e) {

        deleteVillageData("built", orderEntry.houseItems);
    });

    orderEntry.houseItems.unit = com.focusPage("#unit").on("blur", function(e) {

        deleteVillageData("unit", orderEntry.houseItems);
    });

    orderEntry.houseItems.floor = com.focusPage("#floor").on("blur", function(e) {

        deleteVillageData("floor", orderEntry.houseItems);
    });

    orderEntry.houseItems.door = com.focusPage("#door").on("blur", function(e) {

        valiDateHouse();
    });
    orderEntry.houseItems.builtrule = com.focusPage("#builtrule").on("change", function(e) {

        valiDateHouse();
    });
    orderEntry.houseItems.unitrule = com.focusPage("#unitrule").on("change", function(e) {

        valiDateHouse();
    });
    orderEntry.houseItems.floorrule = com.focusPage("#floorrule").on("change", function(e) {

        valiDateHouse();
    });
    orderEntry.houseItems.doorrule = com.focusPage("#doorrule").on("change", function(e) {

        valiDateHouse();
    });

    com.focusPage("#customerModal").on('hide.bs.modal', function(e) {

        com.cleanItems(orderEntry.customerItems);
        com.closeTip();
    });

    com.focusPage("#houseModal").on('hide.bs.modal', function(e) {

        com.cleanItems(orderEntry.houseItems);
        com.closeTip();
    });

    $.extend(com.validator, orderEntry.validator);

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        $.each(res.decorationBusitypes, function(intex, value) {

            if (value.status == 0) {
                orderEntry.decorationBusitypes.push(value);
            }
        });
        orderEntry.orderItems.busitype.bindData(orderEntry.decorationBusitypes, "dbid", "name");
    });

    com.post(api.data.queryDecorationAtttype, {}, function(res) {

        $.each(res.decorationAtttypes, function(i, v) {

            if (v.status == 0) {
                orderEntry.type[v.key] = v.type;
                orderEntry.decorationAtttypes.push(v);
            }
        });
        orderEntry.orderItems.orderType.bindData(orderEntry.decorationAtttypes, 'key', 'name', "请选择");
    });

    orderEntry.orderItems.houseType.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    orderEntry.orderItems.status.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');
    orderEntry.orderItems.houseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    orderEntry.orderItems.orderGrade.bindData(constant.decoration().decoration.grade.datas, 'key', 'value');

    com.initTypeahead('customerId', api.data.queryCustomerForName, "pinyinName", {}, "autoFillCustomer", "key", "value", function(list, key, value) {

        com.post(api.decoration.queryDecorationByCustomerId, {
            "decoration.customer.cid": key
        }, function(res) {

            if (orderEntry.maketype == "advance") {
                com.clearValidator("#customerId", true);
                orderEntry.decorationFlag = false;
            } else if (res.decorations && res.decorations.length > 0) {

                var decoration = res.decorations[0];

                com.showTip(com.focusPage("#customerId"), "装修单已存在.装修单号:" + decoration.orderId + ",所属设计师:" + decoration.designer.currentName, "left");
                orderEntry.decorationFlag = true;

                key = "", value = "";
            } else {
                com.clearValidator("#customerId", true);
                orderEntry.decorationFlag = false;
            }
        }, null, false);

        return value;
    });

    com.initTypeahead('villageId', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");

    com.initTypeahead('designerId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('salesmanId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('quoterId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");
    com.initTypeahead('escorterId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    com.initTypeahead('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");

    orderEntry.orderItems.houseNumber.on("blur", function(e) {

        if ($(this).val() == "" || com.focusPage("#villageId").val() == "") {
            return;
        }

        var housePostData = {
            "house.village.no": com.typeahead("villageId"),
            "house.houseNumber": orderEntry.orderItems.houseNumber.val(),
            "house.status": 0
        };

        com.post(api.data.queryHouseByNoAHnum, housePostData, function(res) {

            com.post(api.decoration.checkDecoration, {
                "decoration.house.hid": res.house.hid
            }, function(des) {

                if (des.decoration && des.decoration.orderId) {
                    com.showTip(orderEntry.orderItems.houseNumber, "装修单已存在.", "right");
                    orderEntry.repeatFlg = true;
                } else {
                    com.showConfirm("已有该房产信息,是否绑定?", function() {

                        orderEntry.houseItems.hid = res.house.hid;
                        orderEntry.repeatFlg = false;
                        orderEntry.orderItems.houseArea.val(res.house.buildArea);
                        orderEntry.orderItems.houseFreeArea.val(res.house.freeArea);
                        orderEntry.orderItems.houseInnerArea.val(res.house.innerArea);
                        orderEntry.orderItems.houseTotalArea.val(res.house.totalArea);
                        orderEntry.orderItems.apartmentType.val(res.house.houseType);
                        com.showAlert(com.info, "绑定成功");
                    }, function() {

                        com.focusPage("#houseModal").modal("show");
                    });
                }
            }, null, false);

        }, function() {

            com.showAlert(com.warning, "房产不存在，请创建房产");
            clearHouse();
            com.clearValidator("#houseNumber", true);
            com.updateTypeahead('no', orderEntry.orderItems.villageId.val(), com.focusPage("#villageId" + " option:selected").text());
            orderEntry.houseItems.no.trigger("change");
            com.focusPage("#houseModal").modal("show");
        }, false);

    });

    com.focusPage('#fl-statement').statement("装修单", "录入订单");

    com.post(api.ds.building, {}, function(res) {

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

    com.focusPage("#createCustomer").on("click", function() {

        com.cleanItems(orderEntry.customerItems);

        com.clearValidator();
        com.focusPage("#customerModal").modal("show");
    });

    com.focusPage("#createHouse").on("click", function() {

        clearHouse();
        orderEntry.houseItems.buildArea.val(0);
        orderEntry.houseItems.freeArea.val(0);
        orderEntry.houseItems.innerArea.val(0);
        orderEntry.houseItems.totalArea.val(0);
        com.focusPage("#houseModal").modal("show");
    });

    com.focusPage("#cancelHouselBtn").on("click", function() {

        clearHouse();
        com.focusPage("#houseModal").modal("hide");
    });

    com.focusPage("#buildArea,#freeArea,#innerArea,#totalArea").on("blur", function() {

        orderEntry.houseItems.totalArea.val(orderEntry.houseItems.buildArea.val() * 1 + orderEntry.houseItems.freeArea.val() * 1);
    });

    com.focusPage("#saveHouseBtn").on("click", function() {

        if (com.validate("houseModal")) {
            return;
        }

        if (orderEntry.houseFlag) {
            valiDateHouse();
            return;
        } else {
            saveHouse();
        }

    });

    com.focusPage("#notSalesmanRateComment").on("click", function() {

        com.showTip($(this), "支持提点(0-1)比例以及提成(大于1)金额");
    });

    function createOrder() {

        var btn = com.focusPage("#saveBtn");

        var url = api.decoration.createDecoration;

        if (orderEntry.maketype && orderEntry.maketype == "advance") {
            url = api.decoration.createDecorationForAdvance;
        }

        var options = {
            "decoration.customer.cid": com.typeahead("customerId"),
            "decoration.houseType": orderEntry.orderItems.houseType.val(),
            "decoration.houseClass": orderEntry.orderItems.houseClass.val(),
            "decoration.designer.userId": com.typeahead("designerId"),
            "decoration.salesman.userId": com.typeahead("salesmanId"),
            "decoration.busitype": orderEntry.orderItems.busitype.val(),
            "decorationInfo.notSalesmanName": orderEntry.orderItems.notSalesmanName.val(),
            "decoration.notSalesmanRate": orderEntry.orderItems.notSalesmanRate.val(),
            "decorationInfo.notSalesmanPhone": orderEntry.orderItems.notSalesmanPhone.val(),
            "decorationInfo.notSalesmanContent": orderEntry.orderItems.notSalesmanContent.val(),
            "decorationInfo.backOrderName": orderEntry.orderItems.backOrderName.val(),
            "decorationInfo.backOrderPhone": orderEntry.orderItems.backOrderPhone.val(),
            "decorationInfo.backOrderContent": orderEntry.orderItems.backOrderContent.val(),
            "decoration.resourceType": orderEntry.orderItems.status.val(),
            "decoration.approveStatus": 0,
            "decoration.type": orderEntry.type[orderEntry.orderItems.orderType.val()],
            "decoration.typeness": orderEntry.orderItems.orderType.val(),
            "decoration.quoter.userId": com.typeahead("quoterId"),
            "decoration.escorter.userId": com.typeahead("escorterId"),
            "decoration.house.hid": orderEntry.houseItems.hid,
            "decoration.grade": orderEntry.orderItems.orderGrade.val()
        };

        if (com.validate('createOrder') || orderEntry.repeatFlg || orderEntry.decorationFlag)
            return;

        if (orderEntry.houseItems.hid == null) {
            com.showAlert(com.error, "房产信息未填写");
            return;
        }

        btn.button('loading');
        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            initCreate();

            btn.button('reset');
        }, function(e) {

            com.showAlert(com.error, e.errorMsg);
            btn.button('reset');
        });
    }

    function initCreate() {

        com.cleanItems(orderEntry.orderItems);

        orderEntry.orderItems.notSalesmanRate.val("0");

        com.cleanTypeahead("villageId");
        com.cleanTypeahead("designerId");
        com.cleanTypeahead("salesmanId");
        com.cleanTypeahead("quoterId");
        com.cleanTypeahead("escorterId");
        com.cleanTypeahead("customerId");

        com.focusPage(".chosen-single span").html("");

        com.clearValidator("#houseNumber", true);
        com.clearValidator();

        orderEntry.repeatFlg = false;
        orderEntry.decorationFlag = false;
    }

    function saveHouse() {

        var btn = com.focusPage("#saveHouseBtn");
        var houseOptions = {};

        if (com.validate("houseModal", "top") || orderEntry.houseItems.no.val() == "")
            return;

        if (orderEntry.houseFlag) {
            valiDateHouse();
            return;
        }
        houseOptions["house.village.no"] = com.typeahead("no");
        houseOptions["house.built"] = orderEntry.houseItems.built.val();
        houseOptions["house.unit"] = orderEntry.houseItems.unit.val();
        houseOptions["house.floor"] = orderEntry.houseItems.floor.val();
        houseOptions["house.door"] = orderEntry.houseItems.door.val();
        houseOptions["house.type"] = orderEntry.houseItems.type.val();
        houseOptions["house.buildArea"] = utils.changeThrDecimal(orderEntry.houseItems.buildArea.val());
        houseOptions["house.freeArea"] = utils.changeThrDecimal(orderEntry.houseItems.freeArea.val());
        houseOptions["house.innerArea"] = utils.changeThrDecimal(orderEntry.houseItems.innerArea.val());
        houseOptions["house.totalArea"] = utils.changeThrDecimal(orderEntry.houseItems.totalArea.val());
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

        com.post(url, houseOptions, function(res) {

            com.showAlert(com.info, "操作成功");
            com.updateTypeahead('villageId', orderEntry.houseItems.no.val(), orderEntry.houseItems.no.val());
            orderEntry.orderItems.houseNumber.val(orderEntry.houseItems.houseNumber);
            orderEntry.houseItems.hid = res.house.hid;
            orderEntry.orderItems.houseArea.val(res.house.buildArea);
            orderEntry.orderItems.houseFreeArea.val(res.house.freeArea);
            orderEntry.orderItems.houseInnerArea.val(res.house.innerArea);
            orderEntry.orderItems.houseTotalArea.val(res.house.totalArea);
            orderEntry.orderItems.apartmentType.val(res.house.houseType);
            clearHouse();
            btn.button('reset');

            com.focusPage("#houseModal").modal("hide");

        }, function(e) {

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
    }

    function createCustomer() {

        if (com.validate("customerModal") || orderEntry.customerFlag) {
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

        com.post(url, options, function(res) {

            com.showAlert(com.info, "创建用户成功");

            com.updateTypeahead('customerId', res.customer.cid, res.customer.name + '-' + res.customer.phone);

            com.focusPage("#customerModal").modal("hide");
        }, function(e) {

            com.showAlert(com.error, e.errorMsg);
        }, false);
    }

    function checkPhone($id) {

        if ($id.val() == "") {
            orderEntry.customerFlag = true;
        } else {
            com.post(api.data.checkCustomerForPhone, {
                "customerPhone.cid": null,
                "customerPhone.phone": $id.val(),
                "customerPhone.status": null
            }, function(res) {

                orderEntry.customerFlag = false;
            }, function(res) {

                orderEntry.customerFlag = true;
                com.showTip($id, "电话信息已存在", "bottom");
            }, false);

        }
    }

    function valiDateHouse(no, houseNumber) {

        var flag = houseUtils.anytimevalidate(orderEntry.houseItems, null, true);

        if (flag.prehouse != undefined) {
            orderEntry.houseFlag = flag.prehouse.Flag;
        }

        orderEntry.houseItems.houseNumber = flag.houseNumber;
    }

    function deleteVillageData(paramFlag, items) {

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
                break;
        }
    }

});
