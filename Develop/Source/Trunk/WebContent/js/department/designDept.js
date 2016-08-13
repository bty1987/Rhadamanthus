var designDept = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	
	postParam: {
		'dept.type': '设计部',
	},
	
	validator: {
		designDept: {
			type: "v_designDept", 
			regex: /^FL_DD_\d{2}$/g, 
			errorMsg: "请以FL_DD_作为前缀 , 之后以两位数字组成(如FL_DD_01)."
		}
	},
};

jQuery(function($) {
	
	designDept.saveBtn = $("#saveBtn").on("click", saveData);
	designDept.cancelBtn = $("#cancelBtn");
	
	designDept.items.designDeptId = $("#designDeptId");
	designDept.items.designDeptName = $("#designDeptName");
	designDept.items.designRegionSel = $("#designRegionSel");
	designDept.items.cityProperSel = $("#cityProperSel");
	designDept.items.citySel = $("#citySel").on("change",function(e, callback){
		bindCityProper($(this).val(), designDept.items.cityProperSel, false, callback);
	});
	designDept.items.regionSel = $("#regionSel").on("change",function(e, callback){
		bindCity($(this).val(), designDept.items.citySel, false, callback);
	});
	designDept.items.contractPrefix = $("#contractPrefix");
	designDept.items.des = $("#des");
	
	designDept.modal = $("#designDeptModal");
	designDept.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#designDeptId", true);
	});
	$.extend(com.validator, designDept.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		designDept.items.regionSel.bindData(res.regionList, "regionId", "regionName", false).trigger("change");
	});
	
	com.post(api.department.queryDepartment, {'dept.type': "设计大区"}, function(res){
		designDept.items.designRegionSel.bindData(res.deptList, "deptId", "deptName", false);
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
               ["合同前缀:", v.contractPrefix, "grey"],
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
            	editDept(v.deptId, v.deptName, v.fatherDept.deptId, v.cityProper.city.region.regionId, v.cityProper.city.cityId, v.cityProper.cityProperId, v.contractPrefix, v.des);
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
	}, "pagenation", "designDeptPostData", designDept.postParam, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addDept').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addDept"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(designDept.items);
		
		designDept.items.designDeptId.prop("disabled", false).css("display", "none");
		designDept.items.regionSel.trigger("change");
		
		designDept.modal.modal("show");   
    });
	
	function editDept(deptId, deptName, fatherDeptId, regionId, cityId, cityProperId, contractPrefix, des){
		editFlg = true;
		
		designDept.items.designDeptId.val(deptId).prop("disabled", true).css("display", "block");
		designDept.items.designDeptName.val(deptName);
		designDept.items.designRegionSel.val(fatherDeptId);
		designDept.items.regionSel.val(regionId);
		
		$.when(
			com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){}), 
			com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){})
		).done(function(city, cityProper){
			designDept.items.citySel.bindData(city.cityList, "cityId", "cityName", false);
			designDept.items.cityProperSel.bindData(cityProper.cityProperList, "cityProperId", "cityProperName", false);
			designDept.items.citySel.val(cityId);
			designDept.items.cityProperSel.val(cityProperId);
		}).fail(function(){
			console.log("queryCityByRegionId and queryCityPropersByCityId fail....");
		});
		
		designDept.items.contractPrefix.val(contractPrefix);
		designDept.items.des.val(des);
		
		designDept.modal.modal("show");
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
			'dept.ident': 13,
			'dept.deptName': designDept.items.designDeptName.val(),
			'dept.fatherDept.deptId': designDept.items.designRegionSel.val(),
			'dept.cityProper.cityProperId': designDept.items.cityProperSel.val(),
			'dept.type': com.deptType.designDept,
			'dept.contractPrefix': designDept.items.contractPrefix.val(),
			'dept.des': designDept.items.des.val()
		};
		
		if(editFlg){
			url = api.department.updateDepartment;
			options['dept.deptId'] = designDept.items.designDeptId.val();
		}else{
			url = api.department.addDepartment;
			options['dept.deptId'] = "DD_";
			options['dept.company'] = config.company;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		designDept.modal.modal("hide");   
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
		if(regionId!=""){
			com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){
				$cityObj.bindData(res.cityList, "cityId", "cityName", flag).trigger("change", callback);
			});
		}else{
			$cityObj.bindData([], "", "", flag);
		}
	}
	
});


