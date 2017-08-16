
jQuery(function($) {
	
	var material = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		items:{},
		
		editFlg: false,
		postParam: {
			'dept.type': '主材部',
		},
		
		validator: {
			materialDept: {
				type: "v_materialDept", 
				regex: /^FL_MD_\d{2}$/g, 
				errorMsg: "请以FL_MD_作为前缀 , 之后以两位数字组成(如FL_MD_01)."
			}
		},
		repeatFlg: false,
	};

	material.saveBtn = $("#saveBtn").on("click", saveData);
	material.cancelBtn = $("#cancelBtn");
	material.items.materialDeptId = $("#materialDeptId");
	material.items.materialDeptName = $("#materialDeptName");
	material.items.cityProperSel = $("#cityProperSel");
	material.items.citySel = $("#citySel").on("change",function(e, callback){
		bindCityProper($(this).val(), material.items.cityProperSel, false, callback);
	});
	material.items.regionSel = $("#regionSel").on("change",function(e, callback){
		bindCity($(this).val(), material.items.citySel, false, callback);
	});
	material.items.des = $("#des");
	
	material.modal = $("#materialDeptModal");
	material.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#materialDeptId", true);
	});
	
	$.extend(com.validator, material.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		material.items.regionSel.bindData(res.regionList, "regionId", "regionName", false).trigger("change");
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
			var $btnDel = $('<input />').attr("type","checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? false : true);
			var $btnSpan = $('<span></span>').addClass("lbl status-lbl");
            
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

            $divBtnWrap.append($btnEdit).append($btnDel).append($btnSpan).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
            	editDept(v.deptId, v.deptName, v.cityProper.city.region.regionId, v.cityProper.city.cityId, v.cityProper.cityProperId, v.des);
            });
            
            $btnDel.click(function(){
				var cvalue = $btnDel.prop("checked");
				if(cvalue){
					cvalue = 1;
				}else{
					cvalue = 0;
				}
            	updateDept(v.deptId, cvalue);
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
	}, "pagenation", "materialDeptPostData", material.postParam, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addDept').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addDept"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(material.items);
		
		material.items.materialDeptId.prop("disabled", false).css("display", "none");
		material.items.regionSel.trigger("change");
		
		material.modal.modal("show");
    });
	
	function editDept(deptId, deptName, regionId, cityId, cityProperId, des){
		editFlg = true;
		
		material.items.materialDeptId.val(deptId).prop("disabled", true).css("display", "block");
		material.items.materialDeptName.val(deptName);
		material.items.regionSel.val(regionId);
		
		$.when(
			com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){}), 
			com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){})
		).done(function(city, cityProper){
			material.items.citySel.bindData(city.cityList, "cityId", "cityName", false);
			material.items.cityProperSel.bindData(cityProper.cityProperList, "cityProperId", "cityProperName", false);
			material.items.citySel.val(cityId);
			material.items.cityProperSel.val(cityProperId);
		}).fail(function(){
			console.log("queryCitysByRegionId and queryCityPropersByCityId fail....");
		});
		
		material.items.des.val(des);
		
		material.modal.modal("show");
	}
	
	function updateDept(deptId, cvalue){

		var options = {};
		options["dept.deptId"] = deptId;
		options["dept.status"] = cvalue;

		com.post(api.department.updateDepartmentForStatus, options, function(res){
			searcher.doSearch();
		});
	}
	
	function saveData(){
		if(com.validate()){
			return;
		}
		
		var url;
		var options = {
			'dept.ident': 16,
			'dept.deptName': material.items.materialDeptName.val(),
			'dept.cityProper.cityProperId': material.items.cityProperSel.val(),
			'dept.type': com.deptType.materialDept,
			'dept.des': material.items.des.val()
		};
		
		if(editFlg){
			url = api.department.updateDepartment;
			options['dept.deptId'] = material.items.materialDeptId.val();
		}else{
			url = api.department.addDepartment;
			options['dept.deptId'] = "MD_";
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		material.modal.modal("hide");   
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
			com.post(api.system.queryCityByRegionId, {"city.region.regionId":regionId}, function(res){
				$cityObj.bindData(res.cityList, "cityId", "cityName", flag).trigger("change", callback); //when edit we set cityProperId
			});
		}else{
			$cityObj.bindData([], "", "", flag);
		}
	}
	
});
