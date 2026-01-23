
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
	var multiMarker = null;
	var mpstyle = null;

	cityProper.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	cityProper.cancelBtn = com.focusPage("#cancelBtn");
	cityProper.saveMapBtn = com.focusPage("#saveMapBtn").on("click", saveMap);
	
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

		var vill = cityProper.currentVill;
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

		cityProper.currentVill.tempPoint = {
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
		cityProper.mapItems.no.val(vill.no);
		cityProper.mapItems.name.val(vill.name);

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

		var vill = cityProper.currentVill;
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

                b.bindData(res.cityPropers, cityProper.cityProperKey, cityProper.cityProperValue, d);
                c && c()
            }) : b.bindData([], "", "", d)
    }

	// webapi - 调用后台接口进行定位
	function getPlace(cityProperName){
		console.log('开始定位城区: ' + cityProperName);

		// 调用后台接口进行定位
		com.post(api.system.locateCityProper, {
			"cityProper.cpid": cityProper.currentVill.cpid
		}, function(res) {

			com.showAlert(com.info, '定位成功');

			// 使用接口返回的城区信息(包含更新后的坐标)
			cityProper.currentVill = res.cityProper;

			var x = res.cityProper.x / 1000000;
			var y = res.cityProper.y / 1000000;

			cityProper.currentVill.tempPoint = {
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
					"title": cityProperName
				}
			}]);

		}, function(err) {
			com.showAlert(com.error, '定位失败: ' + err.errorMsg);
		});
	}
	
});
