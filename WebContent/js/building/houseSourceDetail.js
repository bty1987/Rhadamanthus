jQuery(function($) {

    var houseSourceDetail = {
        houseSourceDetails: {},

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

        currentHsid: params.building.houseSource.hsid,
        houseSourcePage: params.building.page,
        currentHsStatus: params.building.houseSource.status
    };

    com.datetime(houseSourceDetail.items.documentsDate);
    com.datetime(houseSourceDetail.items.decorateTime);

    houseSourceDetail.btns.saveBtn.on("click", updateHouseSource);
    houseSourceDetail.btns.houseBtn.on("click", function() {

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

    com.post(api.ds.building, {}, function(res) {

        houseSourceDetail.housingGrade = res.grade.split("key", "value");

        houseSourceDetail.items.housingGrade.bindData(res.grade, "key", "value", false);
    });

    com.post(api.ds.building, {}, function(res) {

        houseSourceDetail.history = res.history.split("key", "value");

        houseSourceDetail.items.history.bindData(res.history, "key", "value", false);
    });

    com.focusPage('#backBtn').on(ace.click_event, function() {

        switch (houseSourceDetail.houseSourcePage) {
            case "pool":
                com.switchPage(api.index.houseSourcePool.url);
                break;
        }
    });

    com.post(api.ds.building, {}, function(res) {

        houseSourceDetail.items.discussType.bindData(res.discussType, "key", "value");
        houseSourceDetail.items.decorateDegree.bindData(res.decorateDegree, "key", "value");
        houseSourceDetail.items.elevator.bindData(res.elevator, "key", "value");
        houseSourceDetail.items.onlyHousing.bindData(res.onlyHousing, "key", "value");
        houseSourceDetail.items.allowLoan.bindData(res.allowLoan, "key", "value");
        houseSourceDetail.items.beingLoan.bindData(res.beingLoan, "key", "value");
        houseSourceDetail.items.sourceType.bindData(res.sourceType, "key", "value");
        houseSourceDetail.items.allowLoan.bindData(res.allowLoan, "key", "value");
        houseSourceDetail.items.beingLoan.bindData(res.beingLoan, "key", "value");
        houseSourceDetail.items.rentType.bindData(res.rentType, "key", "value");

        $.each(res.hsType, function(i, va) {

            houseSourceDetail.hsType[va.key] = va.value;
        });
        $.each(res.houseType, function(i, val) {

            houseSourceDetail.houseType[val.key] = val.value;
        });
        $.each(res.discussType, function(i, val) {

            houseSourceDetail.discussType[val.key] = val.value;
        });
        $.each(res.decorateDegree, function(i, val) {

            houseSourceDetail.decorateDegree[val.key] = val.value;
        });
        $.each(res.elevator, function(i, val) {

            houseSourceDetail.elevator[val.key] = val.value;
        });
        $.each(res.onlyHousing, function(i, val) {

            houseSourceDetail.onlyHousing[val.key] = val.value;
        });
        $.each(res.sourceType, function(i, va) {

            houseSourceDetail.sourceType[va.key] = va.value;
        });
        $.each(res.waterVapour, function(i, val) {

            houseSourceDetail.waterVapour[val.key] = val.value;
        });
        $.each(res.parlourType, function(i, val) {

            houseSourceDetail.parlourType[val.key] = val.value;
        });
        $.each(res.heatingType, function(i, val) {

            houseSourceDetail.heatingType[val.key] = val.value;
        });
        $.each(res.through, function(i, val) {

            houseSourceDetail.through[val.key] = val.value;
        });
        $.each(res.allowLoan, function(i, val) {

            houseSourceDetail.allowLoan[val.key] = val.value;
        });
        $.each(res.beingLoan, function(i, val) {

            houseSourceDetail.beingLoan[val.key] = val.value;
        });
        $.each(res.orientation, function(i, v) {

            houseSourceDetail.orientation[v.key] = v.value;
        });
        $.each(res.rentType, function(i, v) {

            houseSourceDetail.rentType[v.key] = v.value;
        });

    }, null, false);

    com.post(api.ds.data, {}, function(data) {

        $.each(data.relationshipType, function(i, val) {

            houseSourceDetail.relationshipType[i] = val.value;
        });
    }, null, false);

    // 查询房源信息
    com.post(api.building.queryHouseSourceByHsid, {
        "houseSource.hsid": houseSourceDetail.currentHsid
    }, function(res) {

        bindHouseSourceData(res.houseSource);
        bindHouseData(res.houseSource.house);
    }, null, false);

    // 编辑
    function updateHouseSource() {

        if (houseSourceDetail.currentHsStatus != 3) {
            com.showAlert(com.warning, "只有已通过房源可以修改房源信息");
            return false;
        }

        if (com.validate("houseSourceDatailPageContent")) {
            return false;
        }

        var options = {};
        options["houseSource.hsid"] = houseSourceDetail.currentHsid;
        options["houseSource.keyer.userId"] = houseSourceDetail.items.keyerId.val();
        options["houseSource.sourceType"] = houseSourceDetail.items.sourceType.val();
        options["houseSource.deedNum"] = houseSourceDetail.items.deedNum.val();
        options["houseSource.deedValue"] = houseSourceDetail.items.deedValue.val();
        options["houseSource.unitPrice"] = houseSourceDetail.items.unitPrice.val();
        options["houseSource.totalPrice"] = houseSourceDetail.items.totalPrice.val();
        options["houseSource.decorateTime"] = houseSourceDetail.items.decorateTime.val();
        options["houseSource.decorateDegree"] = houseSourceDetail.items.decorateDegree.val();
        options["houseSource.discussType"] = houseSourceDetail.items.discussType.val();
        options["houseSource.rentType"] = houseSourceDetail.items.rentType.val();
        options["houseSource.indoores"] = houseSourceDetail.items.indoores.val();
        options["houseSource.history"] = houseSourceDetail.items.history.val();
        options["houseSource.propertyFee"] = houseSourceDetail.items.propertyFee.val();
        options["houseSource.elevator"] = houseSourceDetail.items.elevator.val();
        options["houseSource.onlyHousing"] = houseSourceDetail.items.onlyHousing.val();
        options["houseSource.documentsDate"] = houseSourceDetail.items.documentsDate.val();
        options["houseSource.allowLoan"] = houseSourceDetail.items.allowLoan.val();
        options["houseSource.beingLoan"] = houseSourceDetail.items.beingLoan.val();
        options["houseSource.checkingTime"] = houseSourceDetail.items.checkingTime.val();
        options["houseSource.housingGrade"] = houseSourceDetail.items.housingGrade.val();
        options["houseSource.comment"] = houseSourceDetail.items.comment.val();

        com.post(api.building.updateHouseSource, options, function(res) {

            com.showAlert(com.info, "成功修改房源信息");
        }, function(data) {

            com.showAlert(com.error, data.errorMsg);
        });

    }

    function bindHouseData(houses) {

        houseSourceDetail.houseItems.village.val(houses.village.name);
        houseSourceDetail.houseItems.no.val(houses.village.name + " " + houses.houseNumber);
        houseSourceDetail.houseItems.type.val(houseSourceDetail.houseType[houses.type]);
        houseSourceDetail.houseItems.buildArea.val(houses.buildArea);
        houseSourceDetail.houseItems.maxFloor.val(houses.maxFloor);
        houseSourceDetail.houseItems.feature.val(houses.feature);
        houseSourceDetail.houseItems.through.val(houseSourceDetail.through[houses.through]);
        houseSourceDetail.houseItems.houseType.val(houses.houseType);
        houseSourceDetail.houseItems.orientation.val(houseSourceDetail.orientation[houses.orientation]);
        houseSourceDetail.houseItems.waterVapour.val(houseSourceDetail.waterVapour[houses.waterVapour]);
        houseSourceDetail.houseItems.parlourType.val(houseSourceDetail.parlourType[houses.parlourType]);
        houseSourceDetail.houseItems.heatingType.val(houseSourceDetail.heatingType[houses.heatingType]);
    }

    function bindHouseSourceData(houseSources) {

        var _tag = com.focusPage('#indoores').data('tag');

        if (_tag) {
            while (_tag.values.length > 0) {
                _tag.remove(0)
            }

            if (houseSources.indoores && houseSources.indoores != "") {
                var hsindoores = houseSources.indoores.split(",");
                if (hsindoores.length) {
                    $.each(hsindoores, function(i, v) {

                        _tag.fladd(v, v);
                    });
                }
            }
        }

        houseSourceDetail.items.hsType.val(houseSourceDetail.hsType[houseSources.type]);
        houseSourceDetail.items.customerId.val(houseSources.customer.name);
        houseSourceDetail.items.customerPhone.val(houseSources.customer.phone);
        if (houseSources.followUser.userName != null) {
            houseSourceDetail.items.followId.val(houseSources.followUser.userName);
        }
        if (houseSources.keyer.userName != null) {
            houseSourceDetail.items.keyerId.val(houseSources.keyer.userName);
        }
        houseSourceDetail.items.sourceType.val(houseSources.sourceType);
        houseSourceDetail.items.customerId.val(houseSources.customer.name);
        houseSourceDetail.items.deedNum.val(houseSources.deedNum);
        houseSourceDetail.items.deedValue.val(houseSources.deedValue);
        houseSourceDetail.items.unitPrice.val(houseSources.unitPrice);
        houseSourceDetail.items.totalPrice.val(houseSources.totalPrice);
        houseSourceDetail.items.decorateTime.val(houseSources.decorateTime);
        houseSourceDetail.items.decorateDegree.val(houseSources.decorateDegree);
        houseSourceDetail.items.discussType.val(houseSources.discussType);
        houseSourceDetail.items.rentType.val(houseSources.rentType);
        houseSourceDetail.items.history.val(houseSources.history);
        houseSourceDetail.items.propertyFee.val(houseSources.propertyFee);
        houseSourceDetail.items.elevator.val(houseSources.elevator);
        houseSourceDetail.items.onlyHousing.val(houseSources.onlyHousing);
        houseSourceDetail.items.documentsDate.val(houseSources.documentsDate);
        houseSourceDetail.items.allowLoan.val(houseSources.allowLoan);
        houseSourceDetail.items.beingLoan.val(houseSources.beingLoan);
        houseSourceDetail.items.checkingTime.val(houseSources.checkingTime);
        houseSourceDetail.items.housingGrade.val(houseSources.housingGrade);
        houseSourceDetail.items.comment.val(houseSources.comment);
    }
});
