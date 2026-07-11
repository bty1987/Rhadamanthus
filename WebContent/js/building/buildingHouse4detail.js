jQuery(function($) {

    var buildingHouseDetail = {
        buildingHouseDetails: {},

        btns: {

            saveBtn: com.focusPage("#saveBtn"),
            backBtn: com.focusPage("#backBtn"),
            houseBtn: com.focusPage("#houseBtn"),
            cancelBtn: com.focusPage("#cancelBtn")
        },

        items: {

            customerId: com.focusPage("#customerId"),
            customerPhone: com.focusPage("#customerPhone"),
            no: com.focusPage("#no"),
            houseNumber: com.focusPage("#houseNumber"),
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
            comment: com.focusPage("#comment")
        },

        houseItems: {

            village: com.focusPage("#village"),
            no: com.focusPage("#no"),
            houseNumber: com.focusPage("#houseNumber"),
            type: com.focusPage("#type"),
            buildArea: com.focusPage("#buildArea"),
            maxFloor: com.focusPage("#maxFloor"),
            through: com.focusPage("#through"),
            houseType: com.focusPage("#houseType"),
            orientation: com.focusPage("#orientation"),
            feature: com.focusPage("#feature"),
            waterVapour: com.focusPage("#waterVapour"),
            parlourType: com.focusPage("#parlourType"),
            heatingType: com.focusPage("#heatingType")
        },

        relationshipType: [],
        hsType: [],
        discussType: [],
        decorateDegree: [],
        elevator: [],
        onlyHousing: [],
        allowLoan: [],
        beingLoan: [],
        sourceType: [],
        houseType: [],
        through: [],
        orientation: [],
        waterVapour: [],
        parlourType: [],
        heatingType: [],
        rentType: [],

        editFlg: false,
        buildingJson: null,

        currentHsid: params.building.buildingHouse.hsid,
        buildingHousePage: params.building.page,
        currentHsStatus: params.building.buildingHouse.status
    };

    com.datetime(buildingHouseDetail.items.documentsDate);
    com.datetime(buildingHouseDetail.items.decorateTime);

    buildingHouseDetail.btns.saveBtn.on("click", updateBuildingHouse);
    buildingHouseDetail.btns.houseBtn.on("click", function() {

        com.focusPage("#houseData").toggle();
    });

    var tag_input = com.focusPage("#indoores");

    tag_input.tag({
        placeholder: tag_input.attr('placeholder'),
        isStaticResource: false,
        flsource: {
            url: null,
            postData: {},
            resultList: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value",
            isResultTypeMap: true
        // 是否是key - value 形式的列表
        }
    });

    buildingHouseDetail.housingGrade = constant.building().buildingCustomer.grade.keys;

    buildingHouseDetail.items.housingGrade.bindData(constant.building().buildingCustomer.grade.datas, "key", "value", false);

    buildingHouseDetail.history = constant.building().buildingHouse.history.keys;

    buildingHouseDetail.items.history.bindData(constant.building().buildingHouse.history.datas, "key", "value", false);

    com.focusPage('#backBtn').on(ace.click_event, function() {

        switch (buildingHouseDetail.buildingHousePage) {
            case "pool":
                com.switchPage(api.index.buildingHousePool.url);
                break;
        }
    });

    buildingHouseDetail.items.discussType.bindData(constant.building().buildingHouse.discussType.datas, "key", "value");
    buildingHouseDetail.items.decorateDegree.bindData(constant.building().buildingHouse.decorateDegree.datas, "key", "value");
    buildingHouseDetail.items.elevator.bindData(constant.building().buildingHouse.elevator.datas, "key", "value");
    buildingHouseDetail.items.onlyHousing.bindData(constant.building().buildingHouse.onlyHousing.datas, "key", "value");
    buildingHouseDetail.items.allowLoan.bindData(constant.building().buildingHouse.allowLoan.datas, "key", "value");
    buildingHouseDetail.items.beingLoan.bindData(constant.building().buildingHouse.beingLoan.datas, "key", "value");
    buildingHouseDetail.items.sourceType.bindData(constant.building().buildingHouse.sourceType.datas, "key", "value");
    buildingHouseDetail.items.allowLoan.bindData(constant.building().buildingHouse.allowLoan.datas, "key", "value");
    buildingHouseDetail.items.beingLoan.bindData(constant.building().buildingHouse.beingLoan.datas, "key", "value");
    buildingHouseDetail.items.rentType.bindData(constant.building().buildingHouse.rentType.datas, "key", "value");

    $.each(constant.building().buildingHouse.type.datas, function(i, va) {

        buildingHouseDetail.hsType[va.key] = va.value;
    });
    $.each(constant.building().house.houseType.datas, function(i, val) {

        buildingHouseDetail.houseType[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.discussType.datas, function(i, val) {

        buildingHouseDetail.discussType[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.decorateDegree.datas, function(i, val) {

        buildingHouseDetail.decorateDegree[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.elevator.datas, function(i, val) {

        buildingHouseDetail.elevator[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.onlyHousing.datas, function(i, val) {

        buildingHouseDetail.onlyHousing[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.sourceType.datas, function(i, va) {

        buildingHouseDetail.sourceType[va.key] = va.value;
    });
    $.each(constant.building().house.waterVapour.datas, function(i, val) {

        buildingHouseDetail.waterVapour[val.key] = val.value;
    });
    $.each(constant.building().house.parlourType.datas, function(i, val) {

        buildingHouseDetail.parlourType[val.key] = val.value;
    });
    $.each(constant.building().house.heatingType.datas, function(i, val) {

        buildingHouseDetail.heatingType[val.key] = val.value;
    });
    $.each(constant.building().house.through.datas, function(i, val) {

        buildingHouseDetail.through[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.allowLoan.datas, function(i, val) {

        buildingHouseDetail.allowLoan[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.beingLoan.datas, function(i, val) {

        buildingHouseDetail.beingLoan[val.key] = val.value;
    });
    $.each(constant.building().house.orientation.datas, function(i, v) {

        buildingHouseDetail.orientation[v.key] = v.value;
    });
    $.each(constant.building().buildingHouse.rentType.datas, function(i, v) {

        buildingHouseDetail.rentType[v.key] = v.value;
    });

    $.each(constant.customer().customer.relationshipType.datas, function(i, val) {

        buildingHouseDetail.relationshipType[val.key] = val.value;
    });

    // 查询房源信息
    com.post(api.building.queryBuildingHouseByHsid, {
        "buildingHouse.hsid": buildingHouseDetail.currentHsid
    }, function(res) {

        bindBuildingHouseData(res.buildingHouse);
        bindHouseData(res.buildingHouse.house);
    }, null, false);

    // 编辑
    function updateBuildingHouse() {

        if (buildingHouseDetail.currentHsStatus != 3) {
            com.showAlert(com.warning, "只有已通过房源可以修改房源信息");
            return false;
        }

        if (com.validate("buildingHouseDatailPageContent")) {
            return false;
        }

        var options = {};
        options["buildingHouse.hsid"] = buildingHouseDetail.currentHsid;
        options["buildingHouse.keyer.userId"] = buildingHouseDetail.items.keyerId.val();
        options["buildingHouse.sourceType"] = buildingHouseDetail.items.sourceType.val();
        options["buildingHouse.deedNum"] = buildingHouseDetail.items.deedNum.val();
        options["buildingHouse.deedValue"] = buildingHouseDetail.items.deedValue.val();
        options["buildingHouse.unitPrice"] = buildingHouseDetail.items.unitPrice.val();
        options["buildingHouse.totalPrice"] = buildingHouseDetail.items.totalPrice.val();
        options["buildingHouse.decorateTime"] = buildingHouseDetail.items.decorateTime.val();
        options["buildingHouse.decorateDegree"] = buildingHouseDetail.items.decorateDegree.val();
        options["buildingHouse.discussType"] = buildingHouseDetail.items.discussType.val();
        options["buildingHouse.rentType"] = buildingHouseDetail.items.rentType.val();
        options["buildingHouse.indoores"] = buildingHouseDetail.items.indoores.val();
        options["buildingHouse.history"] = buildingHouseDetail.items.history.val();
        options["buildingHouse.propertyFee"] = buildingHouseDetail.items.propertyFee.val();
        options["buildingHouse.elevator"] = buildingHouseDetail.items.elevator.val();
        options["buildingHouse.onlyHousing"] = buildingHouseDetail.items.onlyHousing.val();
        options["buildingHouse.documentsDate"] = buildingHouseDetail.items.documentsDate.val();
        options["buildingHouse.allowLoan"] = buildingHouseDetail.items.allowLoan.val();
        options["buildingHouse.beingLoan"] = buildingHouseDetail.items.beingLoan.val();
        options["buildingHouse.checkingTime"] = buildingHouseDetail.items.checkingTime.val();
        options["buildingHouse.housingGrade"] = buildingHouseDetail.items.housingGrade.val();
        options["buildingHouse.comment"] = buildingHouseDetail.items.comment.val();

        com.post(api.building.updateBuildingHouse, options, function(res) {

            com.showAlert(com.info, "成功修改房源信息");
        }, function(data) {

            com.showAlert(com.error, data.errorMsg);
        });

    }

    function bindHouseData(houses) {

        buildingHouseDetail.houseItems.village.val(houses.village.name);
        buildingHouseDetail.houseItems.no.val(houses.village.name + " " + houses.houseNumber);
        buildingHouseDetail.houseItems.type.val(buildingHouseDetail.houseType[houses.type]);
        buildingHouseDetail.houseItems.buildArea.val(houses.buildArea);
        buildingHouseDetail.houseItems.maxFloor.val(houses.maxFloor);
        buildingHouseDetail.houseItems.feature.val(houses.feature);
        buildingHouseDetail.houseItems.through.val(buildingHouseDetail.through[houses.through]);
        buildingHouseDetail.houseItems.houseType.val(houses.houseType);
        buildingHouseDetail.houseItems.orientation.val(buildingHouseDetail.orientation[houses.orientation]);
        buildingHouseDetail.houseItems.waterVapour.val(buildingHouseDetail.waterVapour[houses.waterVapour]);
        buildingHouseDetail.houseItems.parlourType.val(buildingHouseDetail.parlourType[houses.parlourType]);
        buildingHouseDetail.houseItems.heatingType.val(buildingHouseDetail.heatingType[houses.heatingType]);
    }

    function bindBuildingHouseData(buildingHouses) {

        var _tag = com.focusPage('#indoores').data('tag');

        if (_tag) {
            while (_tag.values.length > 0) {
                _tag.remove(0)
            }

            if (buildingHouses.indoores && buildingHouses.indoores != "") {
                var hsindoores = buildingHouses.indoores.split(",");
                if (hsindoores.length) {
                    $.each(hsindoores, function(i, v) {

                        _tag.fladd(v, v);
                    });
                }
            }
        }

        buildingHouseDetail.items.hsType.val(buildingHouseDetail.hsType[buildingHouses.type]);
        buildingHouseDetail.items.customerId.val(buildingHouses.customer.name);
        buildingHouseDetail.items.customerPhone.val(buildingHouses.customer.phone);
        if (buildingHouses.followUser.userName != null) {
            buildingHouseDetail.items.followId.val(buildingHouses.followUser.userName);
        }
        if (buildingHouses.keyer.userName != null) {
            buildingHouseDetail.items.keyerId.val(buildingHouses.keyer.userName);
        }
        buildingHouseDetail.items.sourceType.val(buildingHouses.sourceType);
        buildingHouseDetail.items.customerId.val(buildingHouses.customer.name);
        buildingHouseDetail.items.deedNum.val(buildingHouses.deedNum);
        buildingHouseDetail.items.deedValue.val(buildingHouses.deedValue);
        buildingHouseDetail.items.unitPrice.val(buildingHouses.unitPrice);
        buildingHouseDetail.items.totalPrice.val(buildingHouses.totalPrice);
        buildingHouseDetail.items.decorateTime.val(buildingHouses.decorateTime);
        buildingHouseDetail.items.decorateDegree.val(buildingHouses.decorateDegree);
        buildingHouseDetail.items.discussType.val(buildingHouses.discussType);
        buildingHouseDetail.items.rentType.val(buildingHouses.rentType);
        buildingHouseDetail.items.history.val(buildingHouses.history);
        buildingHouseDetail.items.propertyFee.val(buildingHouses.propertyFee);
        buildingHouseDetail.items.elevator.val(buildingHouses.elevator);
        buildingHouseDetail.items.onlyHousing.val(buildingHouses.onlyHousing);
        buildingHouseDetail.items.documentsDate.val(buildingHouses.documentsDate);
        buildingHouseDetail.items.allowLoan.val(buildingHouses.allowLoan);
        buildingHouseDetail.items.beingLoan.val(buildingHouses.beingLoan);
        buildingHouseDetail.items.checkingTime.val(buildingHouses.checkingTime);
        buildingHouseDetail.items.housingGrade.val(buildingHouses.housingGrade);
        buildingHouseDetail.items.comment.val(buildingHouses.comment);
    }
});
