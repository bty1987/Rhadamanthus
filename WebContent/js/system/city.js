
jQuery(function($) {
    
    var city = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        cityItems:{},
        
        editFlg: false,
        
        validator: {
            city: {
                type: "v_city", 
                regex: /^C_\d{2}$/g, 
                errorMsg: "请以C_作为前缀 , 之后以两位数字组成(如C_01)."
            }
        },
        repeatFlg: false,
        
        mapItems: {
            no: com.focusPage("#mapForm [name='no']"),
            name: com.focusPage('#mapForm [name="name"]'),
            city: com.focusPage('#city')
        },
        
        mapModal: com.focusPage('#mapModal').on("hide.bs.modal", function (a) {
            com.focusPage('#mapContainer').removeClass('changing-point');
        }).on("shown.bs.modal", drawMap)
    };
    
    var mp;
    
    city.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    city.cancelBtn = com.focusPage("#cancelBtn");
    saveMapBtn: com.focusPage("#saveMapBtn").on("click", saveMap);
    
    city.cityItems.no = com.focusPage("#cityId");
    city.cityItems.name = com.focusPage("#cityName");
    city.cityItems.province = com.focusPage("#cityProvince");
    city.cityItems.regionSel = com.focusPage("#regionSel");
    
    city.modal = com.focusPage("#cityModal");
    
    city.modal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.closeTip();
    });
    
    $.extend(com.validator, city.validator);
    
    com.post(api.system.queryRegion, {}, function(res){
        city.cityItems.regionSel.bindData(res.regions, "rid", "name");
    });
    
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
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
            
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');
            var $btnPosition = $('<a></a>').addClass('btn btn-minier btn-warning').html('位置');
            
            var propertyArr = [
               ["省份:", v.province, "grey"],
               ["编号:", v.no, "grey"],
               ["所属大区:", v.region.name, "grey"],
           ];

           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($btnEdit).append($btnDel).append($btnPosition).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
                editCity(v.cid, v.no, v.name, v.province, v.region.rid);
            });
            
            $btnDel.click(function(){
                deleteCity(v.cid);
            });
            
            $btnPosition.click(function () {
                editPosition(v);
            });
            
            return $liLine;
        };
      
        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
    
    var searcher = new Searcher();
    
    searcher.init(["system-city-name", "system-region"], "condList", api.system.pageCity, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "cityPostData", null, false, null, function(){
        
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCity').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        
        return [$adda];
    });
    
    com.focusPage('[name="addCity"]', com.focusPage('#pagenation')).click(function(){
        
        editFlg = false;
        
        com.cleanItems(city.cityItems);
        
        city.cityItems.no.prop("disabled", false).css("display", "none");
        city.cityItems.regionSel.find("option:first").prop("selected", true);   
        
        city.modal.modal("show");   
    });
    
    function editCity(cid, no, name, province, regionId){
        com.clearValidator();
        com.clearValidator("#cityId", true);
        
        editFlg = true;
        
        city.cityItems.cid = cid;
        city.cityItems.no.val(no).prop("disabled", true).css("display", "block");
        city.cityItems.name.val(name);
        city.cityItems.province.val(province);
        city.cityItems.regionSel.val(regionId);
        
        city.modal.modal("show");
    }
    
    function deleteCity(cityId){
        var options = {
            "cids[0]": cityId,
        };
        com.post(api.system.deleteCity, options, function(res){
            searcher.doSearch();
        });
    }

    function saveData(){

        if(com.validate("cityModal") || city.repeatFlg){
            return false;
        }

        var url;
        var options = {
            'city.cid': city.cityItems.cid,
            'city.no': city.cityItems.no.val(),
            'city.name': city.cityItems.name.val(),
            'city.province': city.cityItems.province.val(),
            'city.region.rid': city.cityItems.regionSel.val()
        };
        
        if(editFlg){
            url = api.system.updateCity;
        }else{
            url = api.system.addCity;
        }

        com.post(url, options, function(res){

            searcher.doSearch();
        });
        
        city.modal.modal("hide");   
    }
    
    
    // 初始化地图 创建地图函数
    // var mp = createMap();

    function createMap(lng, lat) {
        var mp = new BMap.Map("mapContainer", {enableMapClick: false, minZoom: 11, maxZoom: 20}); // 在百度地图容器中创建一个地图
        mp.centerAndZoom(new BMap.Point(123.38497, 41.810947), 15); // 设定地图中心和坐标并将地图显示在地图容器中
        mp.setMapStyle({style: 'light'});
        mp.enableKeyboard();
        mp.enableScrollWheelZoom(true);

        mp.addEventListener("click", showInfo);

        return mp;
    }

    function showInfo(e) {
        if (!com.focusPage('#mapContainer').hasClass('changing-point')) {
            return;
        }

        mp.clearOverlays();

        var vill = city.currentVill;
        var name = vill.name;
        var x = vill.x;
        var y = vill.y;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        var mytext = new ComplexCustomOverlay(new BMap.Point(e.point.lng, e.point.lat), name, comment); // 控制标注地址和备注信息

        mp.addOverlay(mytext);

        city.currentVill.tempPoint = {
            x: e.point.lng,
            y: e.point.lat
        }
    }

    // 自定义覆盖物
    function ComplexCustomOverlay(point, text, mouseoverText) {
        this._point = point;
        this._text = text;
        this._mouseoverText = mouseoverText;
    }

    // 标记点提示框样式
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map;

        // 定位点
        var circle = document.createElement('section');
        circle.setAttribute('class', 'position-mark');

        this._circle = circle;

        mp.getPanes().labelPane.appendChild(circle);

        // 文字描述
        var div = this._div = document.createElement("div");
        div.setAttribute('class', 'txt');
        // div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat); //堆叠顺序

        var span = this._span = document.createElement("span");
        div.appendChild(span);
        span.innerHTML = this._text;
        var that = this;
        /*
         * div.onclick = function(){ window.open('html/1.html'); //跳转定向 };
         */

        // 箭头边框
        var arrowBorder = this._arrow = document.createElement("div");
        arrowBorder.setAttribute('class', 'arrow-border');
        div.appendChild(arrowBorder);

        // 提示框下面的小三角和提示框横向位置
        var arrow = this._arrow = document.createElement("div");
        arrow.setAttribute('class', 'arrow');
        div.appendChild(arrow);

        circle.appendChild(div);
        return circle;// 当调用map.removeOverlay或者map.clearOverlays方法时,API会自动将initialize方法返回的DOM元素进行移除.
    };

    ComplexCustomOverlay.prototype.draw = function () {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);

        this._circle.style.top = pixel.y - 5 + 'px';
        this._circle.style.left = pixel.x - 5 + 'px';
    };

    // 重选位置点击
    com.focusPage('[name="resetPositionBtn"]').click(function () {
        com.focusPage('#mapContainer').addClass('changing-point');
        mp.clearOverlays();
    });

    // 重新加载地图
    com.focusPage('[name="resetMapBtn"]').click(function () {
        // mp.reset();
        drawMap();
    });

    // 确认位置
    com.focusPage("#placeBtn").click(function(){
        getPlace(com.focusPage("#name").val());
    });

    // 保存位置
    function saveMap() {

        var params = {
            'city.cid': city.currentVill.cid,
            'city.x': city.currentVill.tempPoint.x * 1000000,
            'city.y': city.currentVill.tempPoint.y * 1000000
        };
        
        com.post(api.system.updateCityForPosition, params, function (res) {
            city.mapModal.modal('hide');
            searcher.doSearch();
        }, null);
    }

    // 编辑位置
    function editPosition(vill) {
        // 初始化地图 创建地图函数
        mp = createMap();

        city.mapItems.no.val(vill.no);
        city.mapItems.name.val(vill.name);

        mp && mp.clearOverlays();

        city.mapModal.modal("show");

        city.currentVill = vill;

        var x = vill.x / 1000000;
        var y = vill.y / 1000000;

        city.currentVill.tempPoint = {
            x: x,
            y: y
        };
    }

    function drawMap() {
        mp = createMap();
        var vill = city.currentVill;
        var name = vill.name;
        var x = vill.x / 1000000;
        var y = vill.y / 1000000;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        if (x && y) {
            var mytext = new ComplexCustomOverlay(new BMap.Point(x, y), name, comment); // 控制标注地址和备注信息
            mp.addOverlay(mytext);
            // mp.panTo(mytext);
            mp.setCenter(new BMap.Point(x, y));
        }
    }

    function bindCityProper(a, b, d, c) {
        "" != a ? com.post(api.system.queryCityProperByCid, {
                "cityProper.city.cid": a
            },
            function (res) {

                b.bindData(res.cityPropers, city.cityProperKey, city.cityProperValue, d);
                c && c()
            }) : b.bindData([], "", "", d)
    }

    // webapi
    function getPlace(villageName){
        $.ajax({
            url: "http://api.map.baidu.com/place/v2/search?query=" + villageName + "&region=" + city + "&output=json&ak=LRGsFoxg2Z21c9on5s5YhBQ9zeewZGw8",
            type: "GET",
            dataType: "JSONP",
            success: function(data){
                var lng;
                var lat;
                var placeFlag;

                if(data.results.length > 0 && data.results[0].location != undefined){
                    lng = data.results[0].location.lng;
                    lat = data.results[0].location.lat;
                    placeFlag = true;
                }else{
                    lng = 123.38497;
                    lat = 41.810947;
                    placeFlag = false;
                }

                city.currentVill.tempPoint.x = lng;
                city.currentVill.tempPoint.y = lat;

                mp = createMap();
                mp = new BMap.Map("mapContainer", {enableMapClick: false, minZoom: 11, maxZoom: 20}); // 在百度地图容器中创建一个地图
                mp.centerAndZoom(new BMap.Point(lng, lat), 15); // 设定地图中心和坐标并将地图显示在地图容器中
                mp.setMapStyle({style: 'light'});
                mp.enableKeyboard();
                mp.enableScrollWheelZoom(true);

                if(placeFlag){
                    var newPoint = new BMap.Point(lng, lat);
                    var marker2 = new ComplexCustomOverlay(newPoint, villageName); // 控制标注地址和备注信息
                    mp.addOverlay(marker2);
                    mp.setCenter(newPoint);
                }

            }
        })
    }
    
});
