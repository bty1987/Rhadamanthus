
$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.villageName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPosition = $('<a></a>').addClass('btn btn-minier btn-warning').html('位置');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["楼盘编号:", v.villageId, "grey"],
                ["所在城市:", v.cityProper.city.cityName, "grey"],
                ["所在城区:", v.cityProper.cityProperName, "grey"],
                ["开发商:", v.developer ? v.developer : "-", "grey"],
                ["售楼电话:", v.salesPhone ? v.salesPhone : "-", "grey"],
                ["交房时间:", v.deliveryTime, "grey"],
                ["楼号规则:", v.buildingNameRule.ruleContent, "grey"],
                ["说明:", v.villageContent, "grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnPosition).append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                editVillage(v);
            });

            $btnPosition.click(function(){
                editPosition(v);
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.villageId, 0, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.villageId, 1,function(){$statusSwitch.prop("checked")}));
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

    var _condArr = ['villageName', 'cityId'];

    var searcher = new Searcher();
    searcher.init( _condArr, "condList", api.data.pageVillage, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "villagePostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });

    var village = {
        saveBtn: $("#saveBtn").on("click", saveData),
        cancellBtn: $("#cancelBtn"),

        saveMapBtn : $("#saveMapBtn").on("click", saveMap),
        modal: $("#villageModal").on("show.bs.modal",function(a) {
            com.clearValidator();
            com.clearValidator("#villageId", !0)
        }),
        mapModal : $('#mapModal').on("hide.bs.modal",function(a) {
            $('#mapContainer').removeClass('changing-point');
        }).on("shown.bs.modal", drawMap),

        mapItems: {
            villageId : $("#mapForm [name='villageId']"),
            villageName : $('#mapForm [name="villageName"]'),
        },
        items: {

            villageId : $("#villageId").blur(function() {
                $this = $(this);
                void 0 != $this.val() && "" != $this.val().trim() && com.post(api.data.queryVillageById, {
                        "village.villageId": $this.val()
                    },
                    function(a) {
                        0 < a.village.vId ? (com.showTips($this, "\u8be5\u697c\u76d8\u7f16\u53f7\u5df2\u7ecf\u5b58\u5728", !0), village.repeatFlg = !0) : (com.clearValidator("#villageId", !0), village.repeatFlg = !1)
                    })
            }),
            nameRuleSel : $("#nameRuleSel"),
            villageName : $("#villageName"),
            cityProperSel : $("#cityProperSel"),
            citySel : $("#citySel").on("change",function(b, c) {
                bindCityProper($(this).val(), village.items.cityProperSel, !1, c)
            }),
            developer : $("#developer"),
            salesPhone : $("#salesPhone"),
            deliveryTime : $("#deliveryTime"),
            villageContent : $("#villageContent")

        },
        validator: {
            villageId: {
                type: "v_villageId",
                regex: /^P_\d{4}$/g,
                errorMsg: "\u8bf7\u4ee5P_\u4f5c\u4e3a\u524d\u7f00 , \u4e4b\u540e\u4ee5\u56db\u4f4d\u6570\u5b57\u7ec4\u6210(\u5982P_0001)."
            }
        },
        editFlag: !1,
        repeatFlg: !1,
        cityList: {},
        cityKey: "cityId",
        cityValue: "cityName",
        cityProperList: {},
        cityProperKey: "cityProperId",
        cityProperValue: "cityProperName",
        nameRuleList: {},
        nameRuleKey: "id",
        nameRuleValue: "ruleContent"
    };
    $.extend(com.validator, village.validator);
    com.post(api.system.queryCity, {},function(a) {
        village.cityList = a.cityList;
        village.items.citySel.bindData(village.cityList, village.cityKey, village.cityValue, !1).trigger("change")
    });
    com.post(api.common.queryBuildingNameRule, {}, function(a) {
        village.nameRuleList = a.buildingNameRules;
        village.items.nameRuleSel.bindData(village.nameRuleList, village.nameRuleKey, village.nameRuleValue, !1).trigger("change")
    });

    //初始化地图 创建地图函数

    var mp = createMap();

    function createMap(){
        var mp = new BMap.Map("mapContainer", {enableMapClick:false,minZoom:11,maxZoom:20}); // 在百度地图容器中创建一个地图
        mp.centerAndZoom(new BMap.Point(123.38497,41.810947), 15); // 设定地图中心和坐标并将地图显示在地图容器中
        mp.setMapStyle({style:'light'});
        mp.enableKeyboard();
        mp.enableScrollWheelZoom(true);

        mp.addEventListener("click", showInfo);

        return mp;
    }

    function showInfo(e){

        if(!$('#mapContainer').hasClass('changing-point')){return;}

        mp.clearOverlays();

        var vill = village.currentVill;
        var villageName = vill.villageName;
        var x = vill.x;
        var y = vill.y;
        var count = vill.count;
        var comment = villageName + "已完成订单" + count + "套";

        var mytext = new ComplexCustomOverlay(new BMap.Point(e.point.lng, e.point.lat), villageName, comment); //控制标注地址和备注信息

        mp.addOverlay(mytext);

        village.currentVill.tempPoint = {
            x : e.point.lng,
            y : e.point.lat
        }
    }

    //自定义覆盖物
    function ComplexCustomOverlay(point, text, mouseoverText){
        this._point = point;
        this._text = text;
        this._mouseoverText = mouseoverText;
    }

    //标记点提示框样式
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map){
        this._map = map;

        //定位点
        var circle = document.createElement('section');
        circle.setAttribute('class' ,'position-mark') ;

        this._circle = circle;

        mp.getPanes().labelPane.appendChild(circle);

        //文字描述
        var div = this._div = document.createElement("div");
        div.setAttribute('class', 'txt');
        //div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat); //堆叠顺序

        var span = this._span = document.createElement("span");
        div.appendChild(span);
        span.innerHTML = this._text;
        var that = this;
        /*div.onclick = function(){
            window.open('html/1.html');    //跳转定向
        };*/

        //箭头边框
        var arrowBorder = this._arrow = document.createElement("div");
        arrowBorder.setAttribute('class', 'arrow-border');
        div.appendChild(arrowBorder);

        //提示框下面的小三角和提示框横向位置
        var arrow = this._arrow = document.createElement("div");
        arrow.setAttribute('class', 'arrow');
        div.appendChild(arrow);

        circle.appendChild(div);
        return circle;//当调用map.removeOverlay或者map.clearOverlays方法时，API会自动将initialize方法返回的DOM元素进行移除。
    };

    ComplexCustomOverlay.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);

        this._circle.style.top = pixel.y - 5 + 'px';
        this._circle.style.left = pixel.x - 5 + 'px';
    };

    //重选位置点击
    $('[name="resetPositionBtn"]').click(function(){
        $('#mapContainer').addClass('changing-point');
        mp.clearOverlays();
    });

    //重新加载地图
    $('[name="resetMapBtn"]').click(function(){
        //mp.reset();
        drawMap();
    });

    $(".date-picker").datepicker({autoclose: !0}).next().on(ace.click_event,function() {
        $(this).prev().focus()
    });

    //添加按钮
    $('a[name="addVillage"]','#pagenation').click(function(){
        village.editFlag = !1;
        com.cleanItems(village.items);
        village.items.villageId.css("display", "none");
        village.items.citySel.trigger("change");
        village.modal.modal("show")
    });

    //保存位置
    function saveMap(){

        var params = {
            'village.villageId' :  village.currentVill.villageId,
            'village.x' : village.currentVill.tempPoint.x,
            'village.y' : village.currentVill.tempPoint.y,
        };

        com.post(api.data.updateVillageForPosition , params, function(res){
            village.mapModal.modal('hide');
            searcher.doSearch();
        },null);
    };

    //保存
    function saveData()  {
    	
    	if (com.validate() || village.repeatFlg){
    		return false;
    	}
    	
        var a = {
            "village.villageId": village.items.villageId.val(),
            "village.villageName": village.items.villageName.val(),
            "village.cityProper.cityProperId": village.items.cityProperSel.val(),
            "village.buildingNameRule.id": village.items.nameRuleSel.val(),
            "village.developer": village.items.developer.val(),
            "village.salesPhone": village.items.salesPhone.val(),
            "village.deliveryTime": "" == village.items.deliveryTime.val() ? void 0 : village.items.deliveryTime.val(),
            "village.villageContent": village.items.villageContent.val()
        };
        
        com.post(village.editFlg ? api.data.updateVillage: api.data.addVillage, a, function(res){
        	searcher.doSearch();
        });
        
        village.modal.modal("hide");
    }

    //编辑位置
    function editPosition(vill){

        village.mapItems.villageId.val(vill.villageId);
        village.mapItems.villageName.val(vill.villageName);

        mp && mp.clearOverlays();

        village.mapModal.modal("show");

        village.currentVill = vill;

        var x = vill.x;
        var y = vill.y;

        village.currentVill.tempPoint = {
            x : x,
            y : y
        };
    }

    function drawMap(){
        mp = createMap();
        var vill = village.currentVill;
        var villageName = vill.villageName;
        var x = vill.x;
        var y = vill.y;
        var count = vill.count;
        var comment = villageName + "已完成订单" + count + "套";

        if(x && y){
            var mytext = new ComplexCustomOverlay(new BMap.Point(x, y), villageName, comment); //控制标注地址和备注信息

            mp.addOverlay(mytext);
            //mp.panTo(mytext);
            mp.setCenter(new BMap.Point(x, y));
        }

    }

    //编辑按钮
    function editVillage(b) {

        village.editFlg = !0;
        village.items.villageId.val(b.villageId).prop("disabled", !0).css("display", "block");
        village.items.villageName.val(b.villageName);
        village.items.citySel.val(b.cityProper.city.cityId).trigger("change",
            function() {
                village.items.cityProperSel.val(b.cityProper.cityProperId)
            });
        village.items.nameRuleSel.val(b.buildingNameRule.id).trigger("change");
        village.items.developer.val(b.developer);
        village.items.salesPhone.val(b.salesPhone);
        village.items.deliveryTime.val(b.deliveryTime);
        village.items.villageContent.val(b.villageContent);
        village.modal.modal("show")
    }

    function bindCityProper(a, b, d, c) {
        "" != a ? com.post(api.system.queryCityProperByCityId, {
                "cityProper.city.cityId": a
            },
            function(a) {
                b.bindData(a.cityProperList, village.cityProperKey, village.cityProperValue, d);
                c && c()
            }) : b.bindData([], "", "", d)
    }

    //启用禁用功能
    function updateStatus(id, status, failcallBack){
        com.post(api.data.updateVillageForStatus, {"village.villageId" : id, "village.status" : status}, function(){

        },function(){
            failcallBack && failcallBack();
        });
    }

});

