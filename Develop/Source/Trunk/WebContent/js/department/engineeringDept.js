var engineering = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	repeatFlg: false,
	postParam: {
		'dept.type': '工程部',
	},
	
	validator: {
		engineeringDept: {
			type: "v_engineeringDept", 
			regex: /^FL_ED_\d{2}$/g, 
			errorMsg: "请以FL_ED_作为前缀 , 之后以两位数字组成(如FL_ED_01)."
		}
	},
};

jQuery(function($) {

	engineering.saveBtn = $("#saveBtn").on("click", saveData);
	engineering.cancelBtn = $("#cancelBtn");
	
	engineering.items.engineeringDeptId = $("#engineeringDeptId");
	engineering.items.engineeringDeptName = $("#engineeringDeptName");
	engineering.items.typeSel = $("#typeSel").bindData([com.deptType.qualityDept, com.deptType.supervisionDept], "", "", false);
	engineering.items.cityProperSel = $("#cityProperSel");
	engineering.items.citySel = $("#citySel").on("change",function(e, callback){
		bindCityProper($(this).val(), engineering.items.cityProperSel, false, callback);
	});
	engineering.items.regionSel = $("#regionSel").on("change",function(e, callback){
		bindCity($(this).val(), engineering.items.citySel, false, callback);
	});
	engineering.items.des = $("#des");
	
	engineering.modal = $("#engineeringDeptModal");
	engineering.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#engineeringDeptId", true);
	});
	
	$.extend(com.validator, engineering.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		engineering.items.regionSel.bindData(res.regionList, "regionId", "regionName", false).trigger("change");
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
	}, "pagenation", "engineeringDeptPostData", engineering.postParam, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addDept').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addDept"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(engineering.items);
		
		engineering.items.engineeringDeptId.prop("disabled", false).css("display", "none");
		engineering.items.regionSel.trigger("change");
		
		engineering.modal.modal("show");   
    });
	
	function editDept(deptId, deptName, regionId, cityId, cityProperId, contractPrefix, des){
		editFlg = true;
		
		engineering.items.engineeringDeptId.val(deptId).prop("disabled", true).css("display", "block");
		engineering.items.engineeringDeptName.val(deptName);
		engineering.items.regionSel.val(regionId);
		
		$.when(
			com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){}), 
			com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){})
		).done(function(city, cityProper){
			engineering.items.citySel.bindData(city.cityList, "cityId", "cityName", false);
			engineering.items.cityProperSel.bindData(cityProper.cityProperList, "cityProperId", "cityProperName", false);
			engineering.items.citySel.val(cityId);
			engineering.items.cityProperSel.val(cityProperId);
		}).fail(function(){
			console.log("queryCitysByRegionId and queryCityPropersByCityId fail....");
		});
		
		engineering.items.des.val(des);
		engineering.modal.modal("show");
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
			'dept.ident': 17,
			'dept.deptName': engineering.items.engineeringDeptName.val(),
			'dept.cityProper.cityProperId': engineering.items.cityProperSel.val(),
			'dept.type': com.deptType.engineeringDept,
			'dept.subType': engineering.items.typeSel.val(),
			'dept.des': engineering.items.des.val()
		};
		
		if(editFlg){
			url = api.department.updateDepartment;
			options['dept.deptId'] = engineering.items.engineeringDeptId.val();
		}else{
			url = api.department.addDepartment;
			options['dept.deptId'] = "ED_";
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		engineering.modal.modal("hide");   
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
