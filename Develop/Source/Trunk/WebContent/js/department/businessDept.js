var businessDept = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {
		'dept.type': '业务部',
	},
	
	validator: {
		businessDept: {
			type: "v_businessDept", 
			regex: /^FL_BD_\d{2}$/g, 
			errorMsg: "请以FL_BD_作为前缀 , 之后以两位数字组成(如FL_BD_01)."
		}
	},
};

jQuery(function($) {
	
	businessDept.saveBtn = $("#saveBtn").on("click", saveData);
	businessDept.cancelBtn = $("#cancelBtn");
	
	businessDept.items.businessDeptId = $("#businessDeptId");
	businessDept.items.businessDeptName = $("#businessDeptName");
	businessDept.items.businessRegionSel = $("#businessRegionSel");
	businessDept.items.cityProperSel = $("#cityProperSel");
	businessDept.items.citySel = $("#citySel").on("change",function(e, callback){
		bindCityProper($(this).val(), businessDept.items.cityProperSel, false, callback);
	});
	businessDept.items.regionSel = $("#regionSel").on("change",function(e, callback){
		bindCity($(this).val(), businessDept.items.citySel, false, callback);
	});
	businessDept.items.des = $("#des");
	
	businessDept.modal = $("#businessDeptModal");
	businessDept.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#businessDeptId", true);
	});
	$.extend(com.validator, businessDept.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		businessDept.items.regionSel.bindData(res.regionList, "regionId", "regionName", false).trigger("change");
	});
	
	com.post(api.department.queryDepartment, {'dept.type': com.deptType.businessRegion}, function(res){
		businessDept.items.businessRegionSel.bindData(res.deptList, "deptId", "deptName", false);
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.deptName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
            
            var propertyArr = [
               ["编号:", v.deptId, "grey"],
               ["所属分区:", v.fatherDept.deptName, "grey"],
               ["大区:", v.cityProper.city.region.regionName, "grey"],
               ["城市:", v.cityProper.city.cityName, "grey"],
               ["城区:", v.cityProper.cityProperName, "grey"],
               ["创建时间:", v.createTime, "grey"],
               ["描述:", v.des, "grey"],
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
            	editBusinessDept(v.deptId, v.deptName, v.fatherDept.deptId, v.cityProper.city.region.regionId, v.cityProper.city.cityId, v.cityProper.cityProperId, v.des);
            });
            
            $btnDel.click(function(){
            	deleteBusinessDept(v.deptId);
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
	
	console.log(businessDept.postParam);
	
	var searcher = new Searcher();
	
	searcher.init(["deptName"], "condList", api.department.pageDepartment, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "designDeptPostData", businessDept.postParam, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addBusinessDept').css('margin-top', '7px').css('margin-right', '7px');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addBusinessDept"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(businessDept.items);
		
		businessDept.items.businessDeptId.prop("disabled", false).css("display", "none");
		businessDept.items.regionSel.trigger("change");
		
		businessDept.modal.modal("show");    
    });
	
	function editBusinessDept(deptId, deptName, fatherDeptId, regionId, cityId, cityProperId, des){
		
		editFlg = true;
		
		businessDept.items.businessDeptId.val(deptId).prop("disabled", true).css("display", "block");
		businessDept.items.businessDeptName.val(deptName);
		businessDept.items.businessRegionSel.val(fatherDeptId);
		businessDept.items.regionSel.val(regionId);
		
		$.when(
			com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}), 
			com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId})
		).done(function(city, cityProper){
			businessDept.items.citySel.bindData(city.cityList, "cityId", "cityName", false);
			businessDept.items.cityProperSel.bindData(cityProper.cityProperList, "cityProperId", "cityProperName", false);
			businessDept.items.citySel.val(cityId);
			businessDept.items.cityProperSel.val(cityProperId);
		}).fail(function(){
			console.log("queryCityByRegionId and queryCityPropersByCityId fail....");
		});
		
		businessDept.items.des.val(des);
		
		businessDept.modal.modal("show");
	}
	
	function deleteBusinessDept(deptId){
		
		var options = {
			"deptIds[0]": deptId,
		};
		
		com.post(api.department.deleteDepartment, options, function(res){
			searcher.doSearch();
		});
	}
	
	function saveData(){
		if(com.validate()){
			return;
		}
		
		var url;
		var options = {
			'dept.ident': 15,
			'dept.deptName': businessDept.items.businessDeptName.val(),
			'dept.fatherDept.deptId': businessDept.items.businessRegionSel.val(),
			'dept.cityProper.cityProperId': businessDept.items.cityProperSel.val(),
			'dept.type': com.deptType.businessDept,
			'dept.des': businessDept.items.des.val(),
		};
		
		if(editFlg){
			url = api.department.updateDepartment;
			options['dept.deptId'] = businessDept.items.businessDeptId.val();
		}else{
			url = api.department.addDepartment;
			options['dept.deptId'] = "BD_";
			options['dept.company'] = config.company;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		businessDept.modal.modal("hide");   
	}
	
	function bindCityProper(cityId, $cityProperObj, flag, callback){
		if(cityId != ""){
			com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){
				$cityProperObj.bindData(res.cityProperList, "cityProperId", "cityProperName", flag);
				
				if(callback){
					callback();
				}
			});
		}else{
			$cityProperObj.bindData([], "", "", flag);
		}
	}

	function bindCity(regionId, $cityObj, flag, callback){
		if(regionId!=""){
			com.post(api.system.queryCityByRegionId, {"city.region.regionId":regionId}, function(res){
				$cityObj.bindData(res.cityList, "cityId", "cityName", flag).trigger("change", callback); //when edit we set cityProperId
			});
		}else{
			$cityObj.bindData([], "", "", flag);
		}
	}
	
});
