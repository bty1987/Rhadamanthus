
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

    var lineprops = (function() {

        return [{
            field: "province",
            name: "省份",
            prop: "province",
            clazz: "grey"
        }, {
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "grey"
        }, {
            field: "region.name",
            name: "所属大区",
            prop: "region.name",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    editCity(v.cid, v.no, v.name, v.province, v.region.rid);
                }
            },
            del: {
                name: "删除",
                clazz: "btn-success",
                handle: function(v) {
                    deleteCity(v.cid);
                }
            },
            position: {
                name: "位置",
                clazz: "btn-warning",
                handle: function(v) {
                    editPosition(v);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCity').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.system.pageCity, null, ["system-city-name", "system-region"], "cityPostData", null, false, buildCityButtons);
    searcher.line("name", lineprops, linebtns).render();
    
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
    
    
    // 创建地图标记样式（复用逻辑）
    function createMarkerStyle() {
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
        return mpstyle;
    }

    // 创建多点标记（复用逻辑）
    function createMultiMarker() {
        if (!multiMarker) {
            multiMarker = new TMap.MultiMarker({
                map: mp,
                styles: {
                    "myStyle": createMarkerStyle()
                },
                geometries: []
            });
        }
        return multiMarker;
    }

    // 在地图上添加标记点
    function addMarker(latlng, title) {
        createMultiMarker().setGeometries([{
            "id": "1",
            "styleId": 'myStyle',
            "position": latlng,
            "properties": {
                "title": title
            }
        }]);
    }

    // 初始化地图 创建地图函数
    function createMap(lng, lat) {
        // 使用传入的经纬度，如果没有则使用默认坐标（沈阳）
        var center = new TMap.LatLng(lat || 41.810947, lng || 123.38497);
        var mp = new TMap.Map("mapContainer", {
            enableMapClick: true,  // 改为true以支持点击事件
            minZoom: 11,
            maxZoom: 20,
            center: center,
        });

        var mapc = com.focusPage("#mapContainer");
        mapc.find("canvas").css("height", mapc.height());

        return mp;
    }

    // 处理地图点击事件 - 重选位置
    function showInfo(e) {
        if (!com.focusPage('#mapContainer').hasClass('changing-point')) {
            return false;
        }

        clearMultiMarker();

        var vill = city.currentVill;
        var latlng = new TMap.LatLng(e.latLng.lat, e.latLng.lng);

        // 使用复用的标记点添加函数
        addMarker(latlng, vill.name);

        // 保存临时坐标
        city.currentVill.tempPoint = {
            x: e.latLng.lng,
            y: e.latLng.lat
        };
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

    // 绘制地图并显示城市位置
    function drawMap() {
        if (com.focusPage("#mapContainer>canvas").length == 0) {
            mp = createMap();

            // 绑定地图点击事件，支持重选位置功能
            mp.on("click", function(e) {
                showInfo(e);
            });
        }

        var vill = city.currentVill;
        var x = vill.x / 1000000;
        var y = vill.y / 1000000;

        // 更精确的空值判断（允许坐标为0）
        var hasValidCoords = (x !== undefined && x !== null && !isNaN(x) &&
                              y !== undefined && y !== null && !isNaN(y));

        if (hasValidCoords && x !== 0 && y !== 0) {
            var latlng = new TMap.LatLng(y, x);
            mp.setCenter(latlng);
            // 使用复用的标记点添加函数
            addMarker(latlng, vill.name);
        }
    }

    // 清除标记点
    function clearMultiMarker() {
        if (!mp || !multiMarker) {
            return;
        }

        var geos = multiMarker.getGeometries();

        $.each(geos, function(i, v) {
            multiMarker.remove([v.id])
        });
    }

    // webapi - 调用后台接口进行定位
    function getPlace(cityName){
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

                // 绑定地图点击事件
                mp.on("click", function(e) {
                    showInfo(e);
                });
            }

            var latlng = new TMap.LatLng(y, x);
            mp.setCenter(latlng);

            // 使用复用的标记点添加函数
            addMarker(latlng, cityName);

        }, function(err) {
            com.showAlert(com.error, '定位失败: ' + err.errorMsg);
        });
    }

});
