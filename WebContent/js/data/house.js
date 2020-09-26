$(function () {

    var house = {
        items: {
            no : com.focusPage("#no"),
            rule : com.focusPage("#rule"),
            oldhouseNumber : com.focusPage("#oldhouseNumber"),
            type : com.focusPage("#type"),
            buildArea : com.focusPage("#buildArea"),
            freeArea : com.focusPage("#freeArea"),
            innerArea : com.focusPage("#innerArea"),
            maxFloor : com.focusPage("#maxFloor"),
            through : com.focusPage("#through"),
            oldhousetype : com.focusPage("#oldhousetype"),
            houseTypeOne : com.focusPage("#houseTypeOne"),
            houseTypeTwo : com.focusPage("#houseTypeTwo"),
            houseTypeThr : com.focusPage("#houseTypeThr"),
            houseTypeFour : com.focusPage("#houseTypeFour"),
            orientation : com.focusPage("#orientation"),
            feature : com.focusPage("#feature"),
            waterVapour : com.focusPage("#waterVapour"),
            parlourType : com.focusPage("#parlourType"),
            heatingType : com.focusPage("#heatingType"),
            builtrule : com.focusPage("#builtrule"),
            unitrule : com.focusPage("#unitrule"),
            floorrule : com.focusPage("#floorrule"),
            doorrule : com.focusPage("#doorrule"),

        },
        modal : {
            houseModal : com.focusPage("#houseModal")
        },
        saveHouseBtn : com.focusPage("#saveHouseBtn"),
        cancelHouselBtn : com.focusPage("#cancelHouselBtn"),
        houseType: {},
        orientation: {},
        waterVapour: {},
        parlourType: {},
        heatingType: {},
        through: {},
        houseFlag: false,
        editFlag: false,
        valideteresult: null
    };

    house.saveHouseBtn.bindClick(saveHouse);
    house.cancelHouselBtn.bindClick(deleteDate);

    house.modal.houseModal.on("hide.bs.modal", function (a) {
        com.clearValidator();
        com.cleanItems(house.items);
    });

    house.items.built = com.focusPage("#built").on("change", function (e) {
        deleteVillageData("built");
    });
    house.items.unit = com.focusPage("#unit").on("change", function (e) {
        deleteVillageData("unit");
    });
    house.items.floor = com.focusPage("#floor").on("change", function (e) {
        deleteVillageData("floor");
    });

    house.items.door = com.focusPage("#door").on("blur", function (e) {
        validatehouse()
    });

    house.items.builtrule.on("change", function (e) {
        validatehouse()
    });
    house.items.unitrule.on("change", function (e) {
        validatehouse()
    });
    house.items.floorrule.on("change", function (e) {
        validatehouse()
    });
    house.items.doorrule.on("blur", function (e) {
        validatehouse()
    });

    com.post(api.ds.building, {}, function (res) {
        house.items.type.bindData(res.houseType, "key", "value");
        house.items.through.bindData(res.through, "key", "value");
        house.items.orientation.bindData(res.orientation, "key", "value");
        house.items.waterVapour.bindData(res.waterVapour, "key", "value");
        house.items.parlourType.bindData(res.parlourType, "key", "value");
        house.items.heatingType.bindData(res.heatingType, "key", "value");
        house.items.builtrule.bindData(res.buildrule, "key", "value");
        house.items.unitrule.bindData(res.buildrule, "key", "value");
        house.items.floorrule.bindData(res.buildrule, "key", "value");
        house.items.doorrule.bindData(res.buildrule, "key", "value");

        house.houseType = res.houseType.split("key", "value");//房产类型
        house.orientation = res.orientation.split("key", "value");//房屋朝向
        house.waterVapour = res.waterVapour.split("key", "value");//水气设施
        house.parlourType = res.parlourType.split("key", "value");//客厅类型
        house.heatingType = res.heatingType.split("key", "value");//供暖类型
        house.through = res.through.split("key", "value");//是否越层

    }, null, false);

    $.extend(com.validator, house.validator);

    com.initTypeahead('no', api.data.queryVillageForNameByPinyin,"pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, key, value){

        deleteVillageData("no");

        com.post(api.data.queryVillageById, {"village.no": key}, function (res) {
            house.items.rule.html("推荐楼牌号规则: " + (res.village.rule ? res.village.rule : "暂无推荐规则"));
        }, function(){
            com.show(com.warning, "楼盘信息不存在");
            key = "", value = "";
        }, false);

        return value;
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.village.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier  btn-yellow').html('编辑');

            var propertyArr = [
                ["楼牌号:", v.houseNumber, "grey"],
                ["房产类型:", house.houseType[v.type], "red"],
                ["建筑面积:", v.buildArea, "blue"],
                ["赠送面积:", v.freeArea , "blue"],
                ["套内面积:", v.innerArea , "blue"],
                ["总面积:", v.totalArea , "blue"],
                ["最高楼层:", v.maxFloor, "blue"],
                ["是否越层:", house.through[v.through], "grey"],
                ["户型:", v.houseType, "grey"],
                ["房屋朝向:", house.orientation[v.orientation], "grey"],
                ["三不:", v.feature, "grey"],
                ["水气设施:", house.waterVapour[v.waterVapour], "grey"],
                ["客厅类型:", house.parlourType[v.parlourType], "red"],
                ["供暖类型:", house.heatingType[v.heatingType], "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                editHouse(v);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var _condArr = ['data-village-name', 'building-houseNumber', 'building-area', 'building-waterVapour', 'building-orientation', 'building-parlourType', 'building-heatingType', 'building-houseType', 'building-through', 'building-roomNum'];

    var searcher = new Searcher();

    searcher.init(_condArr, "condList", api.data.pageHouse, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "housePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addHouse').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //添加按钮
    $('a[name="addHouse"]', com.focusPage('#pagenation')).click(function () {

        house.editFlag = false;

        inithouse();

        com.focusPage("#ohousetype").css({"display": "none"});
        com.focusPage("#ohouseNumber").css({"display": "none"});
        com.focusPage("#nhouseNumber").css({"display": "block"});

        house.items.no.prop("disabled", false);
        house.cancelHouselBtn.prop("disabled", false);

        com.cleanTypeahead('no');

        house.modal.houseModal.modal("show");
    });

    //编辑按钮
    function editHouse(b) {

        inithouse();

        house.editFlag = true;
        house.houseFlag = false;

        com.focusPage("#ohousetype").css({"display": "block"});
        com.focusPage("#ohouseNumber").css({"display": "block"});
        com.focusPage("#nhouseNumber").css({"display": "none"});

        house.cancelHouselBtn.prop("disabled", true);
        house.items.no.prop("disabled", true);

        com.updateTypeahead('no', b.village.no, b.village.name);

        house.items.hid = b.hid;
        house.items.houseNumber = b.houseNumber;
        house.items.oldhouseNumber.val(b.houseNumber);
        house.items.type.val(b.type);
        house.items.buildArea.val(b.buildArea);
        house.items.freeArea.val(b.freeArea);
        house.items.innerArea.val(b.innerArea);
        house.items.maxFloor.val(b.maxFloor);
        house.items.through.val(b.through);
        house.items.oldhousetype.val(b.houseType)
        house.items.orientation.val(b.orientation);
        house.items.feature.val(b.feature);
        house.items.waterVapour.val(b.waterVapour);
        house.items.parlourType.val(b.parlourType);
        house.items.heatingType.val(b.heatingType);

        house.modal.houseModal.modal("show");
    }

    function saveHouse() {

        if (com.validate("houseModal", "right")) {
            return false;
        }

        var options = {}

        options["house.built"] = house.items.built.val().trim();
        options["house.unit"] = house.items.unit.val().trim();
        options["house.floor"] = house.items.floor.val().trim();
        options["house.door"] = house.items.door.val().trim();
        options["house.type"] = house.items.type.val();
        options["house.buildArea"] = utils.changeThrDecimal(house.items.buildArea.val());
        options["house.freeArea"] = utils.changeThrDecimal(house.items.freeArea.val());
        options["house.innerArea"] = utils.changeThrDecimal(house.items.innerArea.val());
        options["house.totalArea"] = utils.changeThrDecimal(utils.accAdd(house.items.buildArea.val(), house.items.freeArea.val()));
        options["house.maxFloor"] = house.items.maxFloor.val();
        options["house.through"] = house.items.through.val();
        options["house.orientation"] = house.items.orientation.val();
        options["house.feature"] = house.items.feature.val();
        options["house.waterVapour"] = house.items.waterVapour.val();
        options["house.parlourType"] = house.items.parlourType.val();
        options["house.heatingType"] = house.items.heatingType.val();

        var url = api.data.updateHouse;

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

        com.post(url, options, function () {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            house.modal.houseModal.modal("hide");
        });
    }

    function inithouse() {

        house.items.rule.html("");

        com.clearValidator();
        com.cleanItems(house.items)

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

        house.valideteresult = houseUtils.anytimevalidate(house.items, null, true)

        if (house.valideteresult.prehouse != undefined) {
            house.houseFlag = house.valideteresult.prehouse.Flag
        }
        house.items.houseNumber = house.valideteresult.houseNumber;
    }

})