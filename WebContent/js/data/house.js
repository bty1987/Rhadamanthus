$(function() {

    var house = {
        houseType:[],
        orientation:[],
        waterVapour:[],
        parlourType:[],
        heatingType:[],
        through:[],
        saveHouseBtn: null,
        cancelHouselBtn: null,
        modal: null,
        items: {},
        houseFlag:false,
        editFlag: false,
        valideteresult :null
    };

    house.items.no = $("#no").on("change",function(e){
        deleteVillageData("no");
        com.post(api.data.queryVillageById, {"village.no" : house.items.no.val()},function(res){
            house.items.rule.html("推荐楼牌号规则："+(res.village.rule ? res.village.rule :"暂无推荐规则") );
        },null,false)
    });

    house.items.built = $("#built").on("change",function(e){
        deleteVillageData("built");
    });
    house.items.unit = $("#unit").on("change",function(e){
        deleteVillageData("unit");
    });
    house.items.floor = $("#floor").on("change",function(e){
        deleteVillageData("floor");
    });

   house.items.door = $("#door").on("blur", function(e){
       validatehouse()
    });
    house.items.rule = $("#rule");
    house.items.oldhouseNumber = $("#oldhouseNumber");
    house.items.type = $("#type");
    house.items.buildArea = $("#buildArea");
    house.items.maxFloor = $("#maxFloor");
    house.items.through = $("#through");
    house.items.oldhousetype=$("#oldhousetype")
    house.items.houseTypeOne = $("#houseTypeOne");
    house.items.houseTypeTwo = $("#houseTypeTwo");
    house.items.houseTypeThr = $("#houseTypeThr");
    house.items.houseTypeFour = $("#houseTypeFour");
    house.items.orientation = $("#orientation");
    house.items.feature = $("#feature");
    house.items.waterVapour = $("#waterVapour");
    house.items.parlourType = $("#parlourType");
    house.items.heatingType = $("#heatingType");
    house.items.errMsg = $("#errMsg");

    house.saveHouseBtn = $("#saveHouseBtn").on("click", saveHouse);
    house.cancelHouselBtn = $("#cancelHouselBtn").on("click", inithouse);
    house.items.builtrule = $("#builtrule");
    house.items.unitrule = $("#unitrule");
    house.items.floorrule = $("#floorrule");
    house.items.doorrule = $("#doorrule");

    house.items.builtrule.on("change",function(e){
        validatehouse()
    });
    house.items.unitrule.on("change",function(e){
        validatehouse()
    });
    house.items.floorrule.on("change",function(e){
        validatehouse()
    });
    house.items.doorrule.on("blur",function(e){
        validatehouse()
    });


    com.post(api.ds.building, {}, function(res){
        house.items.type.bindData(res.houseType,"key", "value");
        house.items.through.bindData(res.through,"key", "value");
        house.items.orientation.bindData(res.orientation,"key", "value");
        house.items.waterVapour.bindData(res.waterVapour,"key", "value");
        house.items.parlourType.bindData(res.parlourType,"key", "value");
        house.items.heatingType.bindData(res.heatingType,"key", "value");
        house.items.builtrule.bindData(res.buildrule,"key", "value");
        house.items.unitrule.bindData(res.buildrule,"key", "value");
        house.items.floorrule.bindData(res.buildrule,"key", "value");
        house.items.doorrule.bindData(res.buildrule,"key", "value");

       $.each(res.houseType,function (i,val) {
         house.houseType[val.key] = val.value;//房产类型
        });
        $.each(res.orientation,function (i,val) {
            house.orientation[val.key] = val.value;//房屋朝向
        });
        $.each(res.waterVapour,function (i,val) {
            house.waterVapour[val.key] = val.value;//水气设施
        });
        $.each(res.parlourType,function (i,val) {
            house.parlourType[val.key] = val.value;//客厅类型
        });
        $.each(res.heatingType,function (i,val) {
            house.heatingType[val.key] = val.value;//供暖类型
        });
        $.each(res.through,function (i,val) {
            house.through[val.key] = val.value;//是否越层
        });

    },null,false);

    $.extend(com.validator, house.validator);

    house.modal=$("#houseModal").on("show.bs.modal",function(a) {
        com.clearValidator();
    });

    com.initChosen('no', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
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
                ["最高楼层:", v.maxFloor, "blue"],
                ["是否越层:", house.through[v.through], "grey"],
                ["户型:",  v.houseType, "grey"],
                ["房屋朝向:",  house.orientation[v.orientation], "grey"],
                ["三不:", v.feature, "grey"],
                ["水气设施:", house.waterVapour[v.waterVapour], "grey"],
                ["客厅类型:",house.parlourType[v.parlourType], "red"],
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
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var _condArr = ['villageName','houseNumber','buildingArea','waterVapour','orientation','parlourType','heatingType','houseType','through','roomNum'];

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
    $('a[name="addHouse"]','#pagenation').click(function(){
        house.editFlag = false;
        inithouse();
        addTypeclass()
        $("#ohousetype").css({"display":"none"});
        $("#ohouseNumber").css({"display":"none"});
        $("#nhouseNumber").css({"display":"block"});

        house.items.no.prop("disabled", false);
        house.cancelHouselBtn.prop("disabled", false)
        house.modal.modal("show");
        $("#errMsg").css("border","0px");
    });

    //编辑按钮
     function editHouse(b) {
         inithouse()
         house.editFlag = true;
         house.houseFlag = false;

         house.modal.modal("show");
         removeTypeclass()
         $("#nhouseNumber").css({"display":"none"});
         $("#ohousetype").css({"display":"block"});
         $("#ohouseNumber").css({"display":"block"});
         house.cancelHouselBtn.prop("disabled", true);
         house.items.no.prop("disabled", true);
         com.updateChosen('no',b.village.no,b.village.name);

         house.items.hid = b.hid;
         house.items.houseNumber = b.houseNumber;
         house.items.oldhouseNumber.val(b.houseNumber);
         house.items.type.val(b.type);
         house.items.buildArea.val(b.buildArea);
         house.items.maxFloor.val(b.maxFloor);
         house.items.through.val(b.through);
         house.items.oldhousetype.val(b.houseType)
         house.items.orientation.val(b.orientation);
         house.items.feature.val(b.feature);
         house.items.waterVapour.val(b.waterVapour);
         house.items.parlourType.val(b.parlourType);
         house.items.heatingType.val(b.heatingType);
         $("#errMsg").css("border","0px");
     }
//保存
    function saveHouse(){
//增加验证,或是取消验证v_required v_number

        if(house.editFlag &&(house.items.houseTypeOne.val() != "" || house.items.houseTypeTwo.val() != "" || house.items.houseTypeThr.val() != "" || house.items.houseTypeFour.val() != "")) {
            addTypeclass()
        }else if(house.editFlag &&(house.items.houseTypeOne.val() == "" && house.items.houseTypeTwo.val() == "" && house.items.houseTypeThr.val() == "" && house.items.houseTypeFour.val() == "") ){
            removeTypeclass()
        }

        if(com.validate(null,"right") ||house.houseFlag ){
            validatehouse()
            return;
        }

        var btn = $(this);
        var houseOptions = {}

        houseOptions["house.village.no"] = house.items.no.val();
        houseOptions["house.built"] = house.items.built.val().trim();
        houseOptions["house.unit"] = house.items.unit .val().trim();
        houseOptions["house.floor"] = house.items.floor.val().trim();
        houseOptions["house.door"] = house.items.door.val().trim();
        houseOptions["house.type"] = house.items.type.val();
        houseOptions["house.buildArea"] = utils.changeThrDecimal(house.items.buildArea.val());
        houseOptions["house.maxFloor"] = house.items.maxFloor.val();
        houseOptions["house.through"] = house.items.through.val();
        houseOptions["house.orientation"] =house.items.orientation.val();
        houseOptions["house.feature"] = house.items.feature.val();
        houseOptions["house.waterVapour"] = house.items.waterVapour.val();
        houseOptions["house.parlourType"] =  house.items.parlourType.val();
        houseOptions["house.heatingType"] =  house.items.heatingType.val();

        var url;

        if(house.editFlag){
            url = api.data.updateHouse;
            houseOptions['house.hid'] = house.items.hid;

            if (house.items.houseTypeOne.val() == "" && house.items.houseTypeTwo.val() == "" && house.items.houseTypeThr.val() == "" && house.items.houseTypeFour.val() == "") {
                houseOptions["house.houseType"] = house.items.oldhousetype.val();
            }
            else if (house.items.houseTypeOne.val() != "" || house.items.houseTypeTwo.val() != "" || house.items.houseTypeThr.val() != "" || house.items.houseTypeFour.val() != "") {
                houseOptions["house.roomNum"] =  house.items.houseTypeOne.val();
                houseOptions["house.houseType"] = house.items.houseTypeOne.val() + "室" + house.items.houseTypeTwo.val() + "厅" +  house.items.houseTypeThr.val() + "厨" + house.items.houseTypeFour.val()+"卫";
            }

        }else {
            url = api.data.addHouse;
            houseOptions["house.houseNumber"] =house.items.houseNumber;
            houseOptions["house.village.no"] = house.items.no.val();
            houseOptions["house.roomNum"] =  house.items.houseTypeOne.val();
            houseOptions["house.houseType"] = house.items.houseTypeOne.val() + "室" + house.items.houseTypeTwo.val() + "厅" +  house.items.houseTypeThr.val() + "厨" + house.items.houseTypeFour.val()+"卫";
        }
        btn.button('loading');

         com.post(url,houseOptions, function(){
         com.showAlert(com.info, "操作成功");

         btn.button('reset');
         house.modal.modal("hide");
         inithouse();
         searcher.doSearch();

         }, function(){
         btn.button('reset');
         });
    }
//清空
  function inithouse(){
        house.items.rule.html("");
        house.items.no.prop("disabled", false);
        house.items.no.get(0).selectedIndex = 0;

        com.cleanItems( house.items)
        house.items.built.val("").removeAttr("readonly","readonly");
        house.items.unit .val("").removeAttr("readonly","readonly");
        house.items.floor.val("").removeAttr("readonly","readonly");
        house.items.door .val("").removeAttr("readonly","readonly");
        com.updateChosen("no", '', '');
        com.clearValidator();
      $("#errMsg").css("border","0px");

    }

    function removeTypeclass(){
        house.items.houseTypeOne.removeClass("v_required v_number");
        house.items.houseTypeTwo.removeClass("v_required v_number");
        house.items.houseTypeThr.removeClass("v_required v_number");
        house.items.houseTypeFour.removeClass("v_required v_number");
    }
    function addTypeclass(){
        house.items.houseTypeOne.addClass("v_required v_number");
        house.items.houseTypeTwo.addClass("v_required v_number");
        house.items.houseTypeThr.addClass("v_required v_number");
        house.items.houseTypeFour.addClass("v_required v_number");

    }

    function deleteVillageData(paramFlag){
        switch(paramFlag)
        {
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
                $("#door").css("border", "1px solid #d5d5d5").popover("destroy");
                $("#errMsg").popover("destroy");
                break;
        }
    }

     function  validatehouse(){

         house.valideteresult = houseUtils.anytimevalidate(house.items,null,true)
         
         if(house.valideteresult.prehouse != undefined){
             house.houseFlag = house.valideteresult.prehouse.Flag
         }
         house.items.houseNumber = house.valideteresult.houseNumber;
     }


})