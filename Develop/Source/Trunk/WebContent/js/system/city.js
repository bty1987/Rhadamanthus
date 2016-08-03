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
};

jQuery(function($) {
	
	city.saveBtn = $("#saveBtn").on("click", saveData);
	city.cancelBtn = $("#cancelBtn");
	
	city.cityItems.cityId = $("#cityId");
	city.cityItems.cityName = $("#cityName");
	city.cityItems.regionSel = $("#regionSel");
	
	city.modal = $("#cityModal");
	
	$.extend(com.validator, city.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		city.cityItems.regionSel.bindData(res.regionList, "regionId", "regionName");
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.cityName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
            
            var propertyArr = [
               ["编号:", v.cityId, "grey"],
               ["所属大区:", v.region.regionName, "grey"],
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
            	editCity(v.cityId, v.cityName, v.region.regionId);
            });
            
            $btnDel.click(function(){
            	deleteCity(v.cityId);
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
	
	searcher.init(["cityName", "region"], "condList", api.system.pageCity, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "cityPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCity').css('margin', '5px 5px 0 0');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addCity"]', '#pagenation').click(function(){
		
		editFlg = false;
		
		com.cleanItems(city.cityItems);
		
		city.cityItems.cityId.prop("disabled", false).css("display", "none");
		city.cityItems.regionSel.find("option:first").prop("selected", true);	
		
		city.modal.modal("show");   
    });
	
	function editCity(cityId, cityName, regionId){
		com.clearValidator();
		com.clearValidator("#cityId", true);
		
		editFlg = true;
		
		city.cityItems.cityId.val(cityId).prop("disabled", true).css("display", "block");
		city.cityItems.cityName.val(cityName);
		city.cityItems.regionSel.val(regionId);
		
		city.modal.modal("show");
	}
	
	function deleteCity(cityId){
		var options = {
			"cityIds[0]": cityId,
		};
		com.post(api.system.deleteCityByIds, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
		
		if(com.validate() || city.repeatFlg){
			return;
		}
		
		var url;
		var options = {
			'city.cityId': city.cityItems.cityId.val(),
			'city.cityName': city.cityItems.cityName.val(),
			'city.region.regionId': city.cityItems.regionSel.val()
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
	
});
