var duty = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	
	deptType: ["行政部", "财务部"],
	postParam: {
		'dept.type': '职能部',
	},
	
	validator: {
		dutyDept: {
			type: "v_dutyDept", 
			regex: /^FL_ZD_\d{2}$/g, 
			errorMsg: "请以FL_ZD_作为前缀 , 之后以两位数字组成(如FL_ZD_01)."
		}
	},
};

jQuery(function($) {

	duty.saveBtn = $("#saveBtn").on("click", saveData);
	duty.cancelBtn = $("#cancelBtn");
	
	duty.items.dutyDeptId = $("#dutyDeptId");
	duty.items.dutyDeptName = $("#dutyDeptName");
	duty.items.typeSel = $("#typeSel").bindData(duty.deptType, "", "", false);
	duty.items.cityProperSel = $("#cityProperSel");
	duty.items.citySel = $("#citySel").on("change",function(e, callback){
		bindCityProper($(this).val(), duty.items.cityProperSel, false, callback);
	});
	
	duty.items.regionSel = $("#regionSel").on("change",function(e, callback){
		bindCity($(this).val(), duty.items.citySel, false, callback);
	});
	
	duty.items.des = $("#des");
	duty.modal = $("#dutyDeptModal");
	duty.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#dutyDeptId", true);
	});
	
	$.extend(com.validator, duty.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		duty.regionList = res.regionList;
		duty.items.regionSel.bindData(res.regionList, "regionId", "regionName", false).trigger("change");
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
            	editDept(v.deptId, v.deptName, v.cityProper.city.region.regionId, v.cityProper.city.cityId, v.cityProper.cityProperId, v.des);
            });
            
            $btnDel.click(function(){
            	deleteDept(v.deptId);
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
	
	searcher.init(["deptName"], "condList", api.department.pageDepartment, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "dutyDeptPostData", duty.postParam, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addDept').css('margin', '5px 5px 0 0');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addDept"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(duty.items);
		
		duty.items.dutyDeptId.prop("disabled", false).css("display", "none");
		duty.items.regionSel.trigger("change");
		
		duty.modal.modal("show");   
    });
	
	function editDept(deptId, deptName, regionId, cityId, cityProperId, contractPrefix, des){
		editFlg = true;
		
		duty.items.dutyDeptId.val(deptId).prop("disabled", true).css("display", "block");
		duty.items.dutyDeptName.val(deptName);
		duty.items.regionSel.val(regionId);
		
		$.when(
			com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){}), 
			com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){})
		).done(function(city, cityProper){
			duty.items.citySel.bindData(city.cityList, "cityId", "cityName", false);
			duty.items.cityProperSel.bindData(cityProper.cityProperList, "cityProperId", "cityProperName", false);
			duty.items.citySel.val(cityId);
			duty.items.cityProperSel.val(cityProperId);
		}).fail(function(){
			console.log("queryCityByRegionId and queryCityPropersByCityId fail....");
		});
		
		duty.items.des.val(des);
		
		duty.modal.modal("show");
	}
	
	function deleteDept(deptId){
		var options = {
			"deptIds[0]": deptId
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
			'dept.ident': 18,
			'dept.deptName': duty.items.dutyDeptName.val(),
			'dept.cityProper.cityProperId': duty.items.cityProperSel.val(),
			'dept.type': com.deptType.dutyDept,
			'dept.subType': duty.items.typeSel.val(),
			'dept.des': duty.items.des.val()
		};
		
		if(editFlg){
			url = api.department.updateDepartment;
			options['dept.deptId'] = duty.items.dutyDeptId.val();
		}else{
			url = api.department.addDepartment;
			options['dept.deptId'] = "ZD_";
			options['dept.company'] = config.company;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		duty.modal.modal("hide");   
	}
	
	function bindCityProper(cityId, $cityProperObj, flag, callback){
		if(cityId != ""){
			com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){
				$cityProperObj.bindData(res.cityProperList, "cityProperId", "cityProperName", flag);
				if(callback) callback();
			});
		}else{
			$cityProperObj.bindData([], "", "", flag);
		}
	}

	function bindCity(regionId, $cityObj, flag, callback){
		if(regionId != ""){
			com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){
				$cityObj.bindData(res.cityList, "cityId", "cityName", flag).trigger("change", callback); //when edit we set cityProperId
			});
		}else{
			$cityObj.bindData([], "", "", flag);
		}
	}
	
});
