
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
	};
	
	cityProper.saveBtn = $("#saveBtn").on("click", saveData);
	cityProper.cancelBtn = $("#cancelBtn");
	
	cityProper.items.cityProperId = $("#cityProperId");
	cityProper.items.cityProperName = $("#cityProperName");
	cityProper.items.citySel =$("#citySel");
	cityProper.items.regionSel=$("#regionSel").on("change", function(e, callback){
		com.post(api.system.queryCityByRegionId, {"city.region.regionId":$(this).val()}, function(res){
			cityProper.items.citySel.bindData(res.cityList, "cityId", "cityName", false);
			if(callback) callback();
		});
	});
	
	cityProper.modal = $("#cityProperModal");
	cityProper.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#cityProperId", true);
	});
	$.extend(com.validator, cityProper.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		cityProper.items.regionSel.bindData(res.regionList, "regionId", "regionName", false).trigger("change");
	});
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.cityProperName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
            
            var propertyArr = [
               ["编号:", v.cityProperId, "grey"],
               ["所属大区:", v.city.region.regionName, "grey"],
               ["所属城市:", v.city.cityName, "grey"],
           ];
            
           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
            	editCityProper(v.cityProperId, v.cityProperName, v.city.region.regionId, v.city.cityId);
            });
            
            $btnDel.click(function(){
            	deleteCityProper(v.cityProperId);
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
	
	var searcher = new Searcher();
	
	searcher.init(["cityProperName", "region", "city"], "condList", api.system.pageCityProper, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "cityProperPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCityProper').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
		
	$('a[name="addCityProper"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(cityProper.items);
		
		cityProper.items.cityProperId.prop("disabled", false).css("display", "none");
		cityProper.items.regionSel.trigger("change");
		
		cityProper.modal.modal("show");   
    });
	
	function editCityProper(cityProperId, cityProperName, regionId, cityId){
		
		editFlg = true;
		
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
			"cityProperIds[0]": cityProperId,
		};
		
		com.post(api.system.deleteCityProper, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
		
		if(com.validate()){
			return;
		}
		
		var url;
		var options = {
			'cityProper.cityProperId': cityProper.items.cityProperId.val(),
			'cityProper.cityProperName': cityProper.items.cityProperName.val(),
			'cityProper.city.cityId': cityProper.items.citySel.val()
		};
		
		if(editFlg){
			url = api.system.updateCityProper;
		}else{
			url = api.system.addCityProper;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		cityProper.modal.modal("hide");   
	}
	
});
