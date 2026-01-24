$(function() {

    var house = {

        modals: {
            houseModal: com.focusPage("#houseModal"),
            decorationModal: com.focusPage("#decorationModal"),
        },
        items: {
            no: com.focusPage("#no", "#houseModal"),
            rule: com.focusPage("#rule", "#houseModal"),
            oldhouseNumber: com.focusPage("#oldhouseNumber", "#houseModal"),
            type: com.focusPage("#type", "#houseModal"),
            buildArea: com.focusPage("#buildArea", "#houseModal"),
            freeArea: com.focusPage("#freeArea", "#houseModal"),
            innerArea: com.focusPage("#innerArea", "#houseModal"),
            maxFloor: com.focusPage("#maxFloor", "#houseModal"),
            through: com.focusPage("#through", "#houseModal"),
            oldhousetype: com.focusPage("#oldhousetype", "#houseModal"),
            houseTypeOne: com.focusPage("#houseTypeOne", "#houseModal"),
            houseTypeTwo: com.focusPage("#houseTypeTwo", "#houseModal"),
            houseTypeThr: com.focusPage("#houseTypeThr", "#houseModal"),
            houseTypeFour: com.focusPage("#houseTypeFour", "#houseModal"),
            orientation: com.focusPage("#orientation", "#houseModal"),
            feature: com.focusPage("#feature", "#houseModal"),
            waterVapour: com.focusPage("#waterVapour", "#houseModal"),
            parlourType: com.focusPage("#parlourType", "#houseModal"),
            heatingType: com.focusPage("#heatingType", "#houseModal"),
            islift: com.focusPage("#islift", "#houseModal"),
            builtrule: com.focusPage("#builtrule", "#houseModal"),
            unitrule: com.focusPage("#unitrule", "#houseModal"),
            floorrule: com.focusPage("#floorrule", "#houseModal"),
            doorrule: com.focusPage("#doorrule", "#houseModal"),

            decorations: com.focusPage("#decorationList", "#decorationModal"),
        },
        btns: {
            saveHouseBtn: com.focusPage("#saveHouseBtn").on("click", saveHouse)
        },

        cancelHouselBtn: com.focusPage("#cancelHouselBtn"),
        houseType: {},
        orientation: {},
        waterVapour: {},
        parlourType: {},
        heatingType: {},
        through: {},
        houseFlag: false,
        editFlag: false,

        valideteresult: null,

        pageType: params.urlLoadParams.type,

    };

    house.cancelHouselBtn.bindClick(deleteDate);
    house.items.built = com.focusPage("#built").on("change", function(e) {

        deleteVillageData("built");
    });
    house.items.unit = com.focusPage("#unit").on("change", function(e) {

        deleteVillageData("unit");
    });
    house.items.floor = com.focusPage("#floor").on("change", function(e) {

        deleteVillageData("floor");
    });

    house.items.door = com.focusPage("#door").on("blur", function(e) {

        validatehouse()
    });

    house.items.builtrule.on("change", function(e) {

        validatehouse()
    });
    house.items.unitrule.on("change", function(e) {

        validatehouse()
    });
    house.items.floorrule.on("change", function(e) {

        validatehouse()
    });
    house.items.doorrule.on("blur", function(e) {

        validatehouse()
    });

    com.post(api.ds.building, {}, function(res) {

        house.items.type.bindData(res.houseType, "key", "value");
        house.items.through.bindData(res.through, "key", "value");
        house.items.orientation.bindData(res.orientation, "key", "value");
        house.items.waterVapour.bindData(res.waterVapour, "key", "value");
        house.items.parlourType.bindData(res.parlourType, "key", "value");
        house.items.heatingType.bindData(res.heatingType, "key", "value");
        house.items.islift.bindData(res.elevator, "key", "value");
        house.items.builtrule.bindData(res.buildrule, "key", "value");
        house.items.unitrule.bindData(res.buildrule, "key", "value");
        house.items.floorrule.bindData(res.buildrule, "key", "value");
        house.items.doorrule.bindData(res.buildrule, "key", "value");

        house.type = res.houseType.split("key", "value");
        house.houseType = res.houseType.split("key", "value");// 房产类型
        house.orientation = res.orientation.split("key", "value");// 房屋朝向
        house.waterVapour = res.waterVapour.split("key", "value");// 水气设施
        house.parlourType = res.parlourType.split("key", "value");// 客厅类型
        house.heatingType = res.heatingType.split("key", "value");// 供暖类型
        house.through = res.through.split("key", "value");// 是否越层
        house.elevator = res.elevator.split("key", "value");// 有无电梯
    }, null, false);

    com.initTypeahead('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, key, value) {

        deleteVillageData("no");

        com.post(api.data.queryVillageByVid, {
            "village.no": key
        }, function(res) {

            house.items.rule.html("推荐楼牌号规则: " + (res.village.rule ? res.village.rule : "暂无推荐规则"));
        }, function() {

            com.show(com.warning, "楼盘信息不存在");
            key = "", value = "";
        }, false);
        return value;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageHouse);

    searcher.condition(['data-village-name', 'building-houseNumber', 'building-area', 'building-waterVapour', 'building-orientation', 'building-parlourType', 'building-heatingType', 'building-houseType', 'building-through', 'building-roomNum']);

    if (house.pageType == "common") {
        searcher.button([{
            id: "addHouse",
            name: "添加",
            clazz: "btn btn-minier btn-primary pull-left",
            icon: "icon-plus bigger-110"
        }])
    }

    searcher.history("housePostData");
    var propertyArr = [{
        fieId: "houseNumber",
        name: "楼牌号",
        prop: "houseNumber",
        clazz: "grey"
    }, {
        fieId: "type",
        name: "房产类型",
        prop: "type",
        clazz: "red",
        dataset: house.type
    }, {
        fieId: "buildArea",
        name: "建筑面积",
        prop: "buildArea",
        clazz: "blue"
    }, {
        fieId: "freeArea",
        name: "赠送面积",
        prop: "freeArea",
        clazz: "blue",
        show: function(res){
            return false;
        }
    }, {
        fieId: "innerArea",
        name: "计价面积",
        prop: "innerArea",
        clazz: "blue"
    }, {
        field: "totalArea",
        name: "总面积",
        prop: "totalArea",
        clazz: "blue",
        show: function(res){
            return false;
        }
    }, {
        fieId: "maxFloor",
        name: "最高楼层",
        prop: "maxFloor",
        clazz: "blue"
    }, {
        fieId: "through",
        name: "是否越层",
        prop: "through",
        clazz: "grey",
        dataset: house.through
    }, {
        fieId: "houseType",
        name: "户型",
        prop: "houseType",
        clazz: "grey"
    }, {
        fieId: "orientation",
        name: "房屋朝向",
        prop: "orientation",
        clazz: "grey",
        dataset: house.orientation
    }, {
        fieId: "feature",
        name: "三不",
        prop: "feature",
        clazz: "grey"
    }, {
        field: "waterVapour",
        name: "水气设施",
        prop: "waterVapour",
        clazz: "grey",
        dataset: house.waterVapour
    }, {
        field: "parlourType",
        name: "客厅类型",
        prop: "parlourType",
        clazz: "red",
        dataset: house.parlourType
    }, {
        field: "heatingType",
        name: "供暖类型",
        prop: "heatingType",
        clazz: "red",
        dataset: house.heatingType
    }, {
        field: "isLift",
        name: "有无电梯",
        prop: "isLift",
        clazz: "red",
        dataset: house.elevator
    }, ];
    
    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(b) {

            inithouse();
            
            house.editFlag = true;
            house.houseFlag = false;
            
            com.focusPage("#ohousetype").css({
                "display": "block"
            });
            com.focusPage("#ohouseNumber").css({
                "display": "block"
            });
            com.focusPage("#nhouseNumber").css({
                "display": "none"
            });
            
            house.cancelHouselBtn.prop("disabled", true);
            house.items.no.prop("disabled", true);
            com.updateTypeahead('no', b.village.no, b.village.name);
            
            house.items.hid = b.hid;
            house.items.houseNumber = b.houseNumber;
            house.items.oldhouseNumber.val(b.houseNumber);
            house.items.type.val(b.type);
            house.items.buildArea.val(b.buildArea);
            house.items.innerArea.val(b.innerArea);
            house.items.maxFloor.val(b.maxFloor);
            house.items.through.val(b.through);
            house.items.oldhousetype.val(b.houseType);
            house.items.orientation.val(b.orientation);
            house.items.feature.val(b.feature);
            house.items.waterVapour.val(b.waterVapour);
            house.items.parlourType.val(b.parlourType);
            house.items.heatingType.val(b.heatingType);
            house.items.islift.val(b.isLift);

            house.modals.houseModal.modal("show");

            return false;
        },
        show: function(v) {

            return house.pageType == "common";
        }
    }, {
        name: "装修单",
        clazz: "btn-info",
        handle: function(v) {

            decoration(v);
        }
    }];
    
    searcher.line("village.name", propertyArr, linebtns).render();
    
    com.focusPage('#addHouse', '#pagenation').on("click", function() {

        house.editFlag = false;
        inithouse();

        com.focusPage("#ohousetype").css({
            "display": "none"
        });
        com.focusPage("#ohouseNumber").css({
            "display": "none"
        });
        com.focusPage("#nhouseNumber").css({
            "display": "block"
        });

        house.items.no.prop("disabled", false);
        house.cancelHouselBtn.prop("disabled", false);

        com.cleanTypeahead('no');
        house.modals.houseModal.modal("show");
    });

    function saveHouse() {

        if (com.validate("houseModal", "right")) {
            return false;
        }
        var options = {};

        options["house.built"] = house.items.built.val().trim();
        options["house.unit"] = house.items.unit.val().trim();
        options["house.floor"] = house.items.floor.val().trim();
        options["house.door"] = house.items.door.val().trim();
        options["house.type"] = house.items.type.val();
        options["house.maxFloor"] = house.items.maxFloor.val();
        options["house.through"] = house.items.through.val();
        options["house.orientation"] = house.items.orientation.val();
        options["house.feature"] = house.items.feature.val();
        options["house.waterVapour"] = house.items.waterVapour.val();
        options["house.parlourType"] = house.items.parlourType.val();
        options["house.heatingType"] = house.items.heatingType.val();
        options["house.isLift"] = house.items.islift.val();

        if (house.editFlag) {
            url = api.data.updateHouse;
            options['house.hid'] = house.items.hid;

            if (house.items.houseTypeOne.val() == "" && house.items.houseTypeTwo.val() == "" && house.items.houseTypeThr.val() == "" && house.items.houseTypeFour.val() == "") {
                options["house.houseType"] = house.items.oldhousetype.val();
            } else if (house.items.houseTypeOne.val() != "" || house.items.houseTypeTwo.val() != "" || house.items.houseTypeThr.val() != "" || house.items.houseTypeFour.val() != "") {
                options["house.roomNum"] = house.items.houseTypeOne.val();
                options["house.houseType"] = house.items.houseTypeOne.val() + "室" + house.items.houseTypeTwo.val() + "厅" + house.items.houseTypeThr.val() + "厨" + house.items.houseTypeFour.val() + "卫";
            }

        } else {
            url = api.data.addHouse;
            options["house.village.no"] = com.typeahead("no");
            options["house.houseNumber"] = house.items.houseNumber;
            options["house.roomNum"] = house.items.houseTypeOne.val();
            options["house.houseType"] = house.items.houseTypeOne.val() + "室" + house.items.houseTypeTwo.val() + "厅" + house.items.houseTypeThr.val() + "厨" + house.items.houseTypeFour.val() + "卫";
        }
        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            house.modals.houseModal.modal("hide");
        });
    }
    function inithouse() {

        house.items.rule.html("");

        com.clearValidator();
        com.cleanItems(house.items);
        com.cleanTypeahead("no");
        
        house.items.built.removeAttr("readonly", "readonly");
        house.items.unit.removeAttr("readonly", "readonly");
        house.items.floor.removeAttr("readonly", "readonly");
        house.items.door.removeAttr("readonly", "readonly");
    }
    function deleteVillageData(paramFlag) {

        switch (paramFlag) {
            case "built":
                house.items.unit.val("");
                house.items.floor.val("");
                house.items.door.val("");
                break;
            case "unit":
                house.items.floor.val("");
                house.items.door.val("");
                break;
            case "floor":
                house.items.door.val("");
                break;
            case "no":
                house.items.built.val("");
                house.items.unit.val("");
                house.items.floor.val("");
                house.items.door.val("");
                house.items.builtrule.get(0).selectedIndex = 0;
                house.items.unitrule.get(0).selectedIndex = 0;
                house.items.floorrule.get(0).selectedIndex = 0;
                house.items.doorrule.get(0).selectedIndex = 0;
                com.focusPage("#door").css("border", "1px solid #d5d5d5").popover("destroy");
                break;
        }
    }

    function deleteDate() {

        com.cleanTypeahead("no");
        com.cleanItems(house.items);
        com.clearValidator();
    }

    function validatehouse() {

        house.valideteresult = houseUtils.anytimevalidate(house.items, null, true);

        if (house.valideteresult.prehouse != undefined) {
            house.houseFlag = house.valideteresult.prehouse.Flag
        }

        house.items.houseNumber = house.valideteresult.houseNumber;
    }

    function decoration(v) {

        var options = {
            "decoration.house.hid": v.hid,
        };

        var decoration = null;

        com.post(api.decoration.checkDecoration, options, function(res) {

            if (res.decoration.orderId)
                decoration = res.decoration;
        }, null, false);

        if (!decoration) {
            com.showAlert(com.warning, "房产未绑定装修单");
            return false;
        }

        com.post(api.system.queryCompanyByCid, {
            "company.cid": decoration.dompany
        }, function(res) {

            decoration.company = res.company.name;
        }, null, false);

        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo(house.items.decorations.html(""));

        createDecorationItem(decoration).appendTo($ul);

        house.modals.decorationModal.modal("show");
    }

    function createDecorationItem(v) {

        var $liLine = $('<li></li>').addClass('item-blue clearfix');
        var $h3 = $('<h3></h3>').addClass('oid');
        var $label = $('<label></label>');
        var $span = $('<span></span>').addClass('lbl');
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

        var propertyArr = [["装修单号:", v.orderId, "grey"], ["楼盘:", v.house.village.name, "grey"], ["楼号:", v.house.houseNumber, "grey"], ["公司:", v.company, "grey"]];

        $.each(propertyArr, function(index, value) {

            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $label.append($span).appendTo($h3);
        $h3.append($('<small></small>').addClass('blue').html(v.orderId));
        $liLine.append($h3).append($ulProperty);

        return $liLine;
    }
});