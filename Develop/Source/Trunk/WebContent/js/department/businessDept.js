var businessDept = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {
		'filters[0].field': 'type',
		'filters[0].data': com.deptType.businessDept,
		'filters[0].op': 'eq'
	},
	
	validator: {
		businessDept: {
			type: "v_businessDept", 
			regex: /^FL_BD_\d{2}$/g, 
			errorMsg: "请以FL_BD_作为前缀 , 之后以两位数字组成(如FL_BD_01)."
		}
	},
	
	repeatFlg: false,
	
	businessRegionList: {},
	businessRegionKey: "deptId",
	businessRegionValue: "deptName",
	
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
	
	businessDept.listgrid = $("#listgrid");
	businessDept.gridPager = "#gridPager";
	businessDept.saveBtn = $("#saveBtn").on("click", saveData);
	businessDept.cancelBtn = $("#cancelBtn");
	
	var searchOpts = {
		url: api.department.pageDepartment,
		postParmas: businessDept.postParam,
		listgrid: businessDept.listgrid,
		items: [
		    {label:"业务部门名称", id:"businessDeptNameSearch", name:"deptName", type:'text'}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	businessDept.items.businessDeptId = $("#businessDeptId").on("blur",function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.department.queryDepartmentById, {"dept.deptId":$this.val()}, function(res){
			if(res.dept){
				com.showTips($this, "该业务部门编号已存在", true);
				businessDept.repeatFlg = true;
			}else{
				com.clearValidator("#businessDeptId", true);
				businessDept.repeatFlg = false;
			}
		});
	});
	
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
		businessDept.regionList = res.regionList;
		businessDept.items.regionSel.bindData(businessDept.regionList, businessDept.regionKey, businessDept.regionValue, false).trigger("change");
	});
	
	com.post(api.department.queryDepartment, {'dept.type': com.deptType.businessRegion}, function(res){
		businessDept.businessRegionList = res.deptList;
		businessDept.items.businessRegionSel.bindData(businessDept.businessRegionList, businessDept.businessRegionKey, businessDept.businessRegionValue, false);
	});
	
	initializeListgrid();
});

function bindCityProper(cityId, $cityProperObj, flag, callback){
	if(cityId != ""){
		com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){
			$cityProperObj.bindData(res.cityProperList, businessDept.cityProperKey, businessDept.cityProperValue, flag);
			
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
			$cityObj.bindData(res.cityList, businessDept.cityKey, businessDept.cityValue, flag).trigger("change", callback); //when edit we set cityProperId
		});
	}else{
		$cityObj.bindData([], "", "", flag);
	}
}

function initializeListgrid(){
	businessDept.listgrid.jqGrid({		
		url: api.department.pageDepartment.url,
		postData: businessDept.postParam,
		colNames:['业务部门编号', '业务部门名称', '所属业务大区', '所属大区', '所属城市', '所属城区', '创建时间', '描述'],
		colModel:[
			{name:'deptId'},
			{name:'deptName'},
			{name:'fatherDeptName', jsonmap:'fatherDept.deptName'},
			{name:'regionName', jsonmap:'cityProper.city.region.regionName'},
			{name:'cityName', jsonmap:'cityProper.city.cityName'},
			{name:'cityProperName', jsonmap:'cityProper.cityProperName'},
			{name:'createTime'},
			{name:'des'}
		], 
		pager : businessDept.gridPager,
		caption: "业务部门列表"
	});

	businessDept.listgrid.navGrid(businessDept.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(businessDept.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			var row = $.jgrid.getRowData.call(businessDept.listgrid, "deptId");
			
			if(row == undefined){
				return;
			}
			
			businessDept.items.businessDeptId.val(row.deptId).prop("disabled", true).css("display", "block");
			businessDept.items.businessDeptName.val(row.deptName);
			businessDept.items.businessRegionSel.val(row.fatherDept.deptId);
			businessDept.items.regionSel.val(row.cityProper.city.region.regionId);
			
			$.when(
				com.post(api.system.queryCityByRegionId, {"city.region.regionId": row.cityProper.city.region.regionId}), 
				com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": row.cityProper.city.cityId})
			).done(function(city, cityProper){
				businessDept.items.citySel.bindData(city.cityList, businessDept.cityKey, businessDept.cityValue, false);
				businessDept.items.cityProperSel.bindData(cityProper.cityProperList, businessDept.cityProperKey, businessDept.cityProperValue, false);
				businessDept.items.citySel.val(row.cityProper.city.cityId);
				businessDept.items.cityProperSel.val(row.cityProper.cityProperId);
			}).fail(function(){
				console.log("queryCityByRegionId and queryCityPropersByCityId fail....");
			});
			
			businessDept.items.createTime = row.createTime;
			businessDept.items.des.val(row.des);
			businessDept.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(businessDept.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			
			com.cleanItems(businessDept.items);
			
			businessDept.items.businessDeptId.prop("disabled", false).css("display", "none");
			businessDept.items.regionSel.trigger("change");
			businessDept.modal.modal("show");   
		},
		position: 'first'
	});
}

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["deptIds["+i+"]"] = row.deptId;
	}
	
	com.post(api.department.deleteDepartment, options, successCallback);
	
	$("#eData").trigger("click");
}

function saveData(){
	if(com.validate() || businessDept.repeatFlg){
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
		options['dept.createTime'] = businessDept.items.createTime;
	}else{
		url = api.department.addDepartment;
		options['dept.deptId'] = "BD_";
		options['dept.company'] = config.company;
	}
	
	com.post(url, options, successCallback);
	
	businessDept.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(businessDept.listgrid, businessDept.postParam);
}
