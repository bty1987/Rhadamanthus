var engineering = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	repeatFlg: false,
	postParam: {
		'filters[0].field': 'type',
		'filters[0].data': com.deptType.engineeringDept,
		'filters[0].op': 'eq'
	},
	
	validator: {
		engineeringDept: {
			type: "v_engineeringDept", 
			regex: /^FL_ED_\d{2}$/g, 
			errorMsg: "请以FL_ED_作为前缀 , 之后以两位数字组成(如FL_ED_01)."
		}
	},
	
	regionList: {},
	regionKey: "regionId",
	regionValue: "regionName",
	
	cityList:{},
	cityKey: "cityId",
	cityValue: "cityName",
	
	cityProperList:{},
	cityProperKey: "cityProperId",
	cityProperValue: "cityProperName"
};

jQuery(function($) {

	engineering.listgrid = $("#listgrid");
	engineering.gridPager = "#gridPager";
	engineering.saveBtn = $("#saveBtn").on("click", saveData);
	engineering.cancelBtn = $("#cancelBtn");
	
	var searchOpts = {
		url: api.department.pageDepartment,
		postParmas: engineering.postParam,
		listgrid: engineering.listgrid,
		items: [{label:"部门名称",id:"engineeringDeptNameSearch",name:"deptName", type:'text'}]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	engineering.items.engineeringDeptId = $("#engineeringDeptId").on("blur",function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.department.queryDepartmentById, {"dept.deptId":$this.val()}, function(res){
			if(res.dept){
				com.showTips($this, "该部门编号已存在", true);
				engineering.repeatFlg = true;
			}else{
				com.clearValidator("#engineeringDeptId", true);
				engineering.repeatFlg = false;
			}
		});
	});
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
		engineering.regionList = res.regionList;
		engineering.items.regionSel.bindData(engineering.regionList, engineering.regionKey, engineering.regionValue, false).trigger("change");
	});
	
	initializeListgrid();
});

function bindCityProper(cityId, $cityProperObj, flag, callback){
	if(cityId != ""){
		com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){
			$cityProperObj.bindData(res.cityProperList, engineering.cityProperKey, engineering.cityProperValue, flag);
			if(callback) callback();
		});
	}else{
		$cityProperObj.bindData([], "", "", flag);
	}
}

function bindCity(regionId, $cityObj, flag, callback){
	if(regionId != ""){
		com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){
			$cityObj.bindData(res.cityList, engineering.cityKey, engineering.cityValue, flag).trigger("change", callback); //when edit we set cityProperId
		});
	}else{
		$cityObj.bindData([], "", "", flag);
	}
}

function initializeListgrid(){
	engineering.listgrid.jqGrid({		
		url: api.department.pageDepartment.url,
		postData: engineering.postParam,
		colNames: ['部门编号', '部门名称', '部门类型', '所属大区', '所属城市', '所属城区', '创建时间', '描述'],
		colModel: [
			{name: 'deptId'},
			{name: 'deptName'},
			{name: 'subType'},
			{name: 'regionName', jsonmap:'cityProper.city.region.regionName'},
			{name: 'cityName', jsonmap:'cityProper.city.cityName'},
			{name: 'cityProperName', jsonmap:'cityProper.cityProperName'},
			{name: 'createTime'},
			{name: 'des'}
		], 
		pager: engineering.gridPager,
		caption: "工程部门列表"
	});

	engineering.listgrid.navGrid(engineering.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(engineering.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			
			var row = $.jgrid.getRowData.call(engineering.listgrid, "deptId");
			
			if(row == undefined){
				return;
			}
			
			engineering.items.engineeringDeptId.val(row.deptId).prop("disabled", true).css("display", "block");
			engineering.items.engineeringDeptName.val(row.deptName);
			engineering.items.typeSel.val(row.subType);
			engineering.items.regionSel.val(row.cityProper.city.region.regionId);
			
			$.when(com.post(api.system.queryCityByRegionId, {"city.region.regionId":row.cityProper.city.region.regionId}), 
					
			com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": row.cityProper.city.cityId})).done(function(city, cityProper){
				engineering.items.citySel.bindData(city.cityList, engineering.cityKey, engineering.cityValue, false);
				engineering.items.cityProperSel.bindData(cityProper.cityProperList, engineering.cityProperKey, engineering.cityProperValue, false);
				engineering.items.citySel.val(row.cityProper.city.cityId);
				engineering.items.cityProperSel.val(row.cityProper.cityProperId);
			}).fail(function(){
				console.log("queryCitysByRegionId and queryCityPropersByCityId fail....");
			});
			
			engineering.items.createTime = row.createTime;
			engineering.items.des.val(row.des);
			engineering.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(engineering.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(engineering.items);
			engineering.items.engineeringDeptId.prop("disabled", false).css("display", "none");
			engineering.items.regionSel.trigger("change");
			engineering.modal.modal("show");   
		},
		position: 'first'
	});
}

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["deptIds["+i+"]"] = row.deptId;
	}
	
	com.post(api.department.deleteDepartment, options, successCallback);
	
	$("#eData").trigger("click");
}

function saveData(){
	if(com.validate() || engineering.repeatFlg){
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
		options['dept.createTime'] = engineering.items.createTime;
	}else{
		url = api.department.addDepartment;
		options['dept.deptId'] = "ED_";
		options['dept.company'] = config.company;
	}
	
	com.post(url, options, successCallback);
	
	engineering.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(engineering.listgrid, engineering.postParam);
}
