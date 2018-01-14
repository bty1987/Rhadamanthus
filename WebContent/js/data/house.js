$(function() {

    var house = {
        houseType:[],
        orientation:[],
        waterVapour:[],
        parlourType:[],
        heatingType:[],
        through:[],
        status:[],
        saveBtn: null,
        cancellBtn: null,
        modal: null,
        items: {},
        editFlag: false,
        repeatFlg: false,
        houseFlag:false,
        validator: {
            houseNumber: {
                type: "",
                regex: "",
                errorMsg: ""
            }
        },
        nameRuleList: {},
        rulefill: null,
        rulenum:[],
        humFlag:true,
        houseNumber:null,
    };

    house.items.no = $("#no").on("change",function(e){
        deleteVillageData("no");
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
        if(document.getElementById("door").attributes["readonly"] != undefined){
            return ;
        }
        buildruleval();
        if($("#no").val() == "" ){
            com.showPopover($("#no"),{errorMsg: "请先选择楼盘!"}, "right");
        }else{
            $("#no").css("border", "1px solid #d5d5d5").popover("destroy")
        }

        //合成楼牌号
        house.rulenum=[house.items.built.val().trim(),house.items.unit.val().trim(),house.items.floor.val().trim(),house.items.door.val().trim()];
        house.houseNumber = house.rulefill;
        $.each(house.rulenum,function(i,val){
            house.houseNumber = changetohousenum (house.houseNumber,val) ;
        })
        //验证楼牌号是否符合正则
       houseNumbervali(house.houseNumber,house.validator.houseNumber.regex,house.validator.houseNumber.errorMsg)
       //验证房产是否存在
        validatehouse(house.items.no.val(),house.houseNumber)
    });

    house.items.buildingRuleContent=$("#buildingRuleContent");

    house.items.nameRuleSel =$("#nameRuleSel");

    com.post(api.common.queryBuildingNameRule, {}, function(res) {
        house.items.nameRuleList = res.buildingNameRules;
        house.items.nameRuleSel.bindData(house.items.nameRuleList, "id", "ruleContent", !1);
    });
    house.items.nameRuleSel.on("change", function(e){
        buildruleval()
        deleteVillageData("no");
    })

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

    house.items.saveHouseBtn = $("#saveHouseBtn").on("click", saveHouse);
    house.items.cancelHouselBtn = $("#cancelHouselBtn").on("click", inithouse);

    com.post(api.ds.building, {}, function(res){
        house.items.type.bindData(res.houseType,"key", "value");
        house.items.through.bindData(res.through,"key", "value");
        house.items.orientation.bindData(res.orientation,"key", "value");
        house.items.waterVapour.bindData(res.waterVapour,"key", "value");
        house.items.parlourType.bindData(res.parlourType,"key", "value");
        house.items.heatingType.bindData(res.heatingType,"key", "value");

       $.each(res.houseType,function (i,v) {
         house.houseType[i] = v.value;//房产类型
        });
        $.each(res.orientation,function (i,va) {
            house.orientation[i] = va.value;//房屋朝向
        });
        $.each(res.waterVapour,function (i,val) {
            house.waterVapour[i] = val.value;//水气设施
        });
        $.each(res.parlourType,function (i,val) {
            house.parlourType[i] = val.value;//客厅类型
        });
        $.each(res.heatingType,function (i,val) {
            house.heatingType[i] = val.value;//供暖类型
        });
        $.each(res.through,function (i,val) {
            house.through[i] = val.value;//是否越层
        });
        $.each(res.status,function (i,k) {
            house.status[i] = k.value;
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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.village.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');

            var propertyArr = [
                ["楼牌号:", v.houseNumber, "grey"],
                ["房产类型:", house.houseType[v.type], "grey"],
                ["建筑面积:", v.buildArea, "grey"],
                ["最高楼层:", v.maxFloor, "grey"],
                ["是否越层:", house.through[v.through], "grey"],
                ["户型:",  v.houseType, "grey"],
                ["房屋朝向:",  house.orientation[v.orientation], "grey"],
                ["三不:", v.feature, "grey"],
                ["水气设施:", house.waterVapour[v.waterVapour], "grey"],
                ["客厅类型:",house.parlourType[v.parlourType], "grey"],
                ["供暖类型:", house.heatingType[v.heatingType], "grey"],
                ["状态:",  house.status[v.status], "grey"]
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
    }, "pagenation", "villagePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addHouse').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //添加按钮
    $('a[name="addHouse"]','#pagenation').click(function(){
        house.editFlag = false;
        inithouse();
        buildruleval()
        addTypeclass()
        $("#buildingRuleContent").css({"display":"block"});
        $("#rulename").css({"display":"block"});
        $("#ohousetype").css({"display":"none"});

        house.items.no.prop("disabled", false);
        house.items.cancelHouselBtn.prop("disabled", false)
        house.modal.modal("show");
        $("#errMsg").css("border","0px");
    });

    //编辑按钮
     function editHouse(b) {
         inithouse()

         house.editFlag = true;
         house.humFlag = true;
         house.houseFlag = false;

         house.modal.modal("show");
         removeTypeclass()
         $("#buildingRuleContent").css({"display":"none"});
         $("#rulename").css({"display":"none"});
         $("#ohousetype").css({"display":"block"});

         house.items.cancelHouselBtn.prop("disabled", true);
         house.items.no.prop("disabled", true);
         com.updateChosen('no',b.village.no,b.village.name);

         house.items.hid = b.hid;
         house.houseNumber = b.houseNumber;
         house.items.built.val(b.built).attr("readonly","readonly");
         house.items.unit .val(b.unit).attr("readonly","readonly");
         house.items.floor.val(b.floor).attr("readonly","readonly");
         house.items.door .val(b.door).attr("readonly","readonly");
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

        if(com.validate(null,"top") || house.items.no.val()== "" ||  !house.humFlag ||house.houseFlag){

          if(document.getElementById("door").attributes["readonly"] == undefined){
                houseNumbervali(house.houseNumber,house.validator.houseNumber.regex,house.validator.houseNumber.errorMsg)
                validatehouse(house.items.no.val(),house.houseNumber)
            }

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
            houseOptions["house.status"] =  0;
            houseOptions["house.houseNumber"] =house.houseNumber;
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

        house.items.nameRuleSel.get(0).selectedIndex = 0;
        house.items.nameRuleSel.trigger("change");
        house.items.no.prop("disabled", false);
        house.items.no.get(0).selectedIndex = 0;
        house.items.type.get(0).selectedIndex = 0;
        house.items.buildArea.val("");
        house.items.maxFloor.val("");
        house.items.through.get(0).selectedIndex = 0;
        house.items.houseTypeOne.val("");
        house.items.houseTypeTwo.val("");
        house.items.houseTypeThr.val("");
        house.items.houseTypeFour.val("");
        house.items.orientation.get(0).selectedIndex = 0;
        house.items.feature.val("");
        house.items.waterVapour.get(0).selectedIndex = 0;
        house.items.parlourType.get(0).selectedIndex = 0;
        house.items.heatingType.get(0).selectedIndex = 0;
        house.repeatFlg= false;
        house.items.built.val("").removeAttr("readonly","readonly");
        house.items.unit .val("").removeAttr("readonly","readonly");
        house.items.floor.val("").removeAttr("readonly","readonly");
        house.items.door .val("").removeAttr("readonly","readonly");
        com.updateChosen("no", '', '');
        com.clearValidator();
      $("#errMsg").css("border","0px");

    }
//rulefill改为楼牌号
    function changetohousenum( temp,arr){
        var str =temp;
        if(arr.trim() != "" && arr.trim() != "0" ){
            if(temp.indexOf("{}") != -1){
                var num=temp.indexOf("{}");
                str=temp.substring(0,num)+ arr +temp.substring(num+2);
            }
            else{
                str =str+"-"+arr;
            }
        }
        return str;
    }
//验证房产是否存在
    function validatehouse(no,houseNumber){
        if( no== "" || houseNumber == ""){
            house.houseFlag =true;
            return;
        }
        var options = {
            "house.village.no": no,
            "house.houseNumber": houseNumber,
            "house.status" : null,
        };

        com.post(api.data.queryHouseByNoAHnum, options, function(res){
            house.houseFlag =true
            com.showPopover($("#door"),{errorMsg: "该房产已存在"}, "top");
        }, function(res){
            house.houseFlag =false
            $("#door").css("border", "1px solid #d5d5d5").popover("destroy")
        }, false);

    }
//楼牌号数据规则的限定
    function buildruleval(){

            com.post(api.common.queryBuildingNameRuleById, {"buildingNameRule.id":house.items.nameRuleSel.val()}, function(res){

                house.validator.houseNumber["regex"] = eval("/^"+res.buildingNameRule.rule+"$/g");
                house.validator.houseNumber["errorMsg"] =  "楼盘名称规则("+res.buildingNameRule.ruleContent+")";

                $("#buildingRuleContent").html("说明："+res.buildingNameRule.ruleContent+";eg."+res.buildingNameRule.ruleExample+"空出来的输入框添0");
                house.rulefill=res.buildingNameRule.rulefill
            }, null, false);
    }
//验证楼牌号的是否符合正则
    function houseNumbervali(houseNumber,regex,errorMsg){
        if (new RegExp(regex).test(houseNumber)) {
            $("#errMsg").popover("destroy")
            house.humFlag =true
        }else{
            house.humFlag =false
            $("#errMsg").focus().select();
            $("#errMsg").removeAttr("data-placement").attr({
                "data-rel":"popover",
                "data-placement": "right",
                "data-content": errorMsg
            }).removeAttr("data-toggle").popover('show');

        }
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
                $("#door").css("border", "1px solid #d5d5d5").popover("destroy");
                $("#errMsg").popover("destroy");
                break;
        }
    }

})