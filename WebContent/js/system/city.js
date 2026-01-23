
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
    var multiMarker = null;
    var mpstyle = null;

    city.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    city.cancelBtn = com.focusPage("#cancelBtn");
    city.saveMapBtn = com.focusPage("#saveMapBtn").on("click", saveMap);
    
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
    function createMap(lng, lat) {
        var center = new TMap.LatLng(41.810947, 123.38497);
        var mp = new TMap.Map("mapContainer", {
            enableMapClick: false,
            minZoom: 11,
            maxZoom: 20,
            center: center,
        });

        var mapc = com.focusPage("#mapContainer");
        mapc.find("canvas").css("height", mapc.height());

        return mp;
    }

    function showInfo(e) {
        if (!com.focusPage('#mapContainer').hasClass('changing-point')) {
            return false;
        }

        clearMultiMarker();

        var vill = city.currentVill;
        var name = vill.name;
        var x = vill.x;
        var y = vill.y;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        var latlng = new TMap.LatLng(e.point.lat, e.point.lng);

        if (!mpstyle) {
            mpstyle = new TMap.MarkerStyle({
                "width": 25,
                "height": 35,
                "anchor": {
                    x: 16,
                    y: 32
                }
            });
        }

        if (!multiMarker) {
            multiMarker = new TMap.MultiMarker({
                map: mp,
                styles: {
                    "myStyle": mpstyle
                },
                geometries: []
            });
        }

        multiMarker.setGeometries([{
            "id": "1",
            "styleId": 'myStyle',
            "position": latlng,
            "properties": {
                "title": name
            }
        }]);

        city.currentVill.tempPoint = {
            x: e.point.lng,
            y: e.point.lat
        }
    }

    // 重选位置点击
    com.focusPage('[name="resetPositionBtn"]').click(function () {
        com.focusPage('#mapContainer').addClass('changing-point');
        clearMultiMarker();
    });

    // 重新加载地图
    com.focusPage('[name="resetMapBtn"]').click(function () {
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
        city.mapItems.no.val(vill.no);
        city.mapItems.name.val(vill.name);

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
        if (com.focusPage("#mapContainer>canvas").length == 0) {
            mp = createMap();
        }

        if (!mpstyle) {
            mpstyle = new TMap.MarkerStyle({
                "width": 25,
                "height": 35,
                "anchor": {
                    x: 16,
                    y: 32
                }
            });
        }

        var vill = city.currentVill;
        var name = vill.name;
        var x = vill.x / 1000000;
        var y = vill.y / 1000000;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        if (x && y) {
            var latlng = new TMap.LatLng(y, x);

            mp.setCenter(latlng);

            if (!multiMarker) {
                multiMarker = new TMap.MultiMarker({
                    map: mp,
                    styles: {
                        "myStyle": mpstyle
                    },
                    geometries: []
                });
            }

            multiMarker.setGeometries([{
                "id": "1",
                "styleId": 'myStyle',
                "position": latlng,
                "properties": {
                    "title": name
                }
            }]);
        }
    }

    // 清除标记点
    function clearMultiMarker() {
        if (!mp)
            return false;

        if (!multiMarker)
            return false;

        var geos = multiMarker.getGeometries();

        $.each(geos, function(i, v) {
            multiMarker.remove([v.id])
        });
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

    // webapi - 调用后台接口进行定位
    function getPlace(cityName){
        console.log('开始定位城市: ' + cityName);

        // 调用后台接口进行定位
        com.post(api.system.locateCity, {
            "city.cid": city.currentVill.cid
        }, function(res) {

            com.showAlert(com.info, '定位成功');

            // 使用接口返回的城市信息(包含更新后的坐标)
            city.currentVill = res.city;

            var x = res.city.x / 1000000;
            var y = res.city.y / 1000000;

            city.currentVill.tempPoint = {
                x: x,
                y: y
            };

            // 重新绘制地图
            if (com.focusPage("#mapContainer>canvas").length == 0) {
                mp = createMap();
            }

            var latlng = new TMap.LatLng(y, x);
            mp.setCenter(latlng);

            // 添加标记点
            if (!mpstyle) {
                mpstyle = new TMap.MarkerStyle({
                    "width": 25,
                    "height": 35,
                    "anchor": {
                        x: 16,
                        y: 32
                    }
                });
            }

            if (!multiMarker) {
                multiMarker = new TMap.MultiMarker({
                    map: mp,
                    styles: {
                        "myStyle": mpstyle
                    },
                    geometries: []
                });
            }

            multiMarker.setGeometries([{
                "id": "1",
                "styleId": 'myStyle',
                "position": latlng,
                "properties": {
                    "title": cityName
                }
            }]);

        }, function(err) {
            com.showAlert(com.error, '定位失败: ' + err.errorMsg);
        });
    }
    
});
