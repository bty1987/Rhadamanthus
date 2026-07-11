jQuery(function($) {

    var buildingHouse = {

        btns: {

            deployedBtn: com.focusPage("#deployedBtn"),
            bsaveBtn: com.focusPage("#bsaveBtn"),
            bcancelBtn: com.focusPage("#bcancelBtn")

        },

        buildingHouses: {},
        hsid: null,
        csid: null,
        buildingHouseId: null,
        houseId: null,
        buildItems: [],
        hsType: [],
        houseType: [],
        decorateDegree: [],
        discussType: [],
        orientation: [],
        payType: [],
        balanceStatus: [],
        rentType: [],
        repeatFlg: null,
        validator: null
    };

    $.each(constant.building().buildingHouse.type.datas, function(i, va) {

        buildingHouse.hsType[va.key] = va.value;
    });
    $.each(constant.building().house.houseType.datas, function(i, va) {

        buildingHouse.houseType[va.key] = va.value;
    });
    $.each(constant.building().buildingHouse.discussType.datas, function(i, val) {

        buildingHouse.discussType[val.key] = val.value;
    });
    $.each(constant.building().buildingHouse.decorateDegree.datas, function(i, val) {

        buildingHouse.decorateDegree[val.key] = val.value;
    });
    $.each(constant.building().house.orientation.datas, function(i, v) {

        buildingHouse.orientation[v.key] = v.value;
    });
    $.each(constant.building().buildingHouse.rentType.datas, function(i, v) {

        buildingHouse.rentType[v.key] = v.value;
    });

    var lineprops = (function() {

        return [{
            field: "type",
            name: "房源类型",
            prop: function(v) { return buildingHouse.hsType[v.type]; },
            clazz: "red"
        }, {
            field: "house.type",
            name: "房屋类型",
            prop: function(v) { return buildingHouse.houseType[v.house.type]; },
            clazz: "red"
        }, {
            field: "house.village.name",
            name: "楼盘地址",
            prop: "house.village.name",
            clazz: "grey"
        }, {
            field: "house.buildArea",
            name: "面积",
            prop: function(v) { return v.house.buildArea + "平"; },
            clazz: "blue"
        }, {
            field: "totalPrice",
            name: "总价",
            prop: function(v) { return toMoney(v.totalPrice) + "元"; },
            clazz: "blue"
        }, {
            field: "decorateDegree",
            name: "装修程度",
            prop: function(v) { return buildingHouse.decorateDegree[v.decorateDegree]; },
            clazz: "grey"
        }, {
            field: "house.houseType",
            name: "户型",
            prop: "house.houseType",
            clazz: "grey"
        }, {
            field: "house.orientation",
            name: "房屋朝向",
            prop: function(v) { return buildingHouse.orientation[v.house.orientation]; },
            clazz: "grey"
        }, {
            field: "discussType",
            name: "商议类型",
            prop: function(v) { return buildingHouse.discussType[v.discussType]; },
            clazz: "red"
        }, {
            field: "rentType",
            name: "交租方式",
            prop: function(v) { return buildingHouse.rentType[v.rentType]; },
            clazz: "grey"
        }, {
            field: "housingGrade",
            name: "房源等级",
            prop: "housingGrade",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            view: {
                name: "查看",
                clazz: "btn-yellow",
                handle: function(v) {
                    params.building.buildingHouse = v;
                    params.building.manageFlag = false;
                    params.build.page = "query";

                    com.popup4page("#stockRecordPopUp", api.index.buildingHouseDetail.url, "查看");
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.building.pageBuildingHouse, {
        "filters[0].field": "status",
        "filters[0].data": 3,
        "filters[0].op": "eq"
    }, ["building-buildingHouse-no", "building-houseType", "building-buildingHouse-type", "building-village", "building-Area", "building-totalPrice", "building-roomNum", "building-orientation", "building-decorateDegree", "building-allowLoan", "building-housingGrade", "building-rentType"], "buildingHouseQueryPostData", null, false, null);
    searcher.line("no", lineprops, linebtns).render();

    // 转换金额
    function toMoney(num) {

        num = num.toFixed(2);
        num = parseFloat(num);
        num = num.toLocaleString();
        return num;
    }
});
