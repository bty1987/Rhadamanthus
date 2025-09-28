
jQuery(function($) {
	
	var cityProper = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		items:{},
		
		postParam: {},
		
		validator: {
			cityProper: {
				type: "v_cityProper", 
				regex: /^R_\d{2}$/g, 
				errorMsg: "请以R_作为前缀 , 之后以两位数字组成(如R_01)."
			}
		},
		
		editFlg: false,
		repeatFlg: false,
		
		regionList: [],
		regionKey: "regionId",
		regionValue: "regionName",
		
		cityList:[],
		
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
	
	cityProper.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	cityProper.cancelBtn = com.focusPage("#cancelBtn");
	saveMapBtn: com.focusPage("#saveMapBtn").on("click", saveMap);
	
	cityProper.items.cityProperId = com.focusPage("#cityProperId");
	cityProper.items.cityProperName = com.focusPage("#cityProperName");
	cityProper.items.citySel =com.focusPage("#citySel");
	cityProper.items.regionSel=com.focusPage("#regionSel").on("change", function(e, callback){
		com.post(api.system.queryCityByRid, {"city.region.rid":$(this).val()}, function(res){
			cityProper.items.citySel.bindData(res.citys, "cid", "name", false);
			if(callback) callback();
		});
	});
	
	cityProper.modal = com.focusPage("#cityProperModal");
	cityProper.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#cityProperId", true);
	});
	$.extend(com.validator, cityProper.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		cityProper.items.regionSel.bindData(res.regions, "rid", "name", false).trigger("change");
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

            var $btnPartner = $('<a></a>').addClass('btn btn-minier btn-warning').html('合作');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');
            var $btnPosition = $('<a></a>').addClass('btn btn-minier btn-warning').html('位置');
            
            var propertyArr = [
               ["编号:", v.no, "grey"],
               ["所属大区:", v.city.region.name, "grey"],
               ["所属城市:", v.city.name, "grey"],
           ];
            
           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($btnPartner).append($btnEdit).append($btnDel).append($btnPosition).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnPartner.click(function() {

                params.system.cpid = v.cpid;

                com.popup4page("#cityProperPartnerPopUp", api.index.cityProperPartnerIndex.url, "合作");
            });

            $btnEdit.click(function(){
            	editCityProper(v.cpid, v.no, v.name, v.city.region.rid, v.city.cid);
            });
            
            $btnDel.click(function(){
            	deleteCityProper(v.cpid);
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
        };
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["system-cityProper-name", "system-region", "system-city"], "condList", api.system.pageCityProper, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "cityProperPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCityProper').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
		
	com.focusPage('[name="addCityProper"]', com.focusPage('#pagenation')).click(function(){
		editFlg = false;
		
		com.cleanItems(cityProper.items);
		
		cityProper.items.cityProperId.prop("disabled", false).css("display", "none");
		cityProper.items.regionSel.trigger("change");
		
		cityProper.modal.modal("show");   
    });
	
	function editCityProper(cpid, cityProperId, cityProperName, regionId, cityId){
		
		editFlg = true;
		cityProper.items.cpid = cpid;
		
		cityProper.items.cityProperId.prop("disabled", true).css("display", "block");
		
		cityProper.items.cityProperId.val(cityProperId);
		cityProper.items.cityProperName.val(cityProperName);
		cityProper.items.regionSel.val(regionId).trigger("change", function(){
			cityProper.items.citySel.val(cityId);
		});
		cityProper.modal.modal("show");
	}
	
	function deleteCityProper(cityProperId){
		
		var options = {
			"cpids[0]": cityProperId,
		};
		
		com.post(api.system.deleteCityProper, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
		
		if(com.validate("cityProperModal")){
			return false;
		}
		
		var url;
		var options = {
			'cityProper.no': cityProper.items.cityProperId.val(),
			'cityProper.name': cityProper.items.cityProperName.val(),
			'cityProper.city.cid' : cityProper.items.citySel.val()
		};
	
		if(editFlg){
			url = api.system.updateCityProper,
			options['cityProper.cpid']= cityProper.items.cpid;
		}else{
			url = api.system.addCityProper;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		cityProper.modal.modal("hide");   
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

        var vill = cityProper.currentVill;
        var name = vill.name;
        var x = vill.x;
        var y = vill.y;
        var count = vill.count;
        var comment = name + "已完成订单" + count + "套";

        var mytext = new ComplexCustomOverlay(new BMap.Point(e.point.lng, e.point.lat), name, comment); // 控制标注地址和备注信息

        mp.addOverlay(mytext);

        cityProper.currentVill.tempPoint = {
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
            'cityProper.cpid': cityProper.currentVill.cpid,
            'cityProper.x': cityProper.currentVill.tempPoint.x * 1000000,
            'cityProper.y': cityProper.currentVill.tempPoint.y * 1000000
        };
        
        com.post(api.system.updateCityProperForPosition, params, function (res) {
            cityProper.mapModal.modal('hide');
            searcher.doSearch();
        }, null);
    }

    // 编辑位置
    function editPosition(vill) {
        // 初始化地图 创建地图函数
        mp = createMap();

        cityProper.mapItems.no.val(vill.no);
        cityProper.mapItems.name.val(vill.name);

        mp && mp.clearOverlays();

        cityProper.mapModal.modal("show");

        cityProper.currentVill = vill;

        var x = vill.x / 1000000;
        var y = vill.y / 1000000;

        cityProper.currentVill.tempPoint = {
            x: x,
            y: y
        };
    }

    function drawMap() {
        mp = createMap();
        var vill = cityProper.currentVill;
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

                b.bindData(res.cityPropers, cityProper.cityProperKey, cityProper.cityProperValue, d);
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

                cityProper.currentVill.tempPoint.x = lng;
                cityProper.currentVill.tempPoint.y = lat;

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
