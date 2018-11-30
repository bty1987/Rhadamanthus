
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
	};
	
	city.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	city.cancelBtn = com.focusPage("#cancelBtn");
	
	city.cityItems.no = com.focusPage("#cityId");
	city.cityItems.name = com.focusPage("#cityName");
	city.cityItems.regionSel = com.focusPage("#regionSel");
	
	city.modal = com.focusPage("#cityModal");
	
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
            
            var propertyArr = [
               ["编号:", v.no, "grey"],
               ["所属大区:", v.region.name, "grey"],
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
            	editCity(v.cid, v.no, v.name, v.region.rid);
            });
            
            $btnDel.click(function(){
            	deleteCity(v.cid);
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
	
	searcher.init(["cityName", "region"], "condList", api.system.pageCity, function(data){
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
	
	function editCity(cid, no, name, regionId){
		com.clearValidator();
		com.clearValidator("#cityId", true);
		
		editFlg = true;
		
		city.cityItems.cid = cid;
		city.cityItems.no.val(no).prop("disabled", true).css("display", "block");
		city.cityItems.name.val(name);
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
		
		if(com.validate() || city.repeatFlg){
			return;
		}
		
		var url;
		var options = {
			'city.cid': city.cityItems.cid,
			'city.no': city.cityItems.no.val(),
			'city.name': city.cityItems.name.val(),
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
	
});
