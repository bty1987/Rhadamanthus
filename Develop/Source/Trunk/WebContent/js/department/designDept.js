var designDept = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {
		'filters[0].field': 'type',
		'filters[0].data': com.deptType.designDept,
		'filters[0].op': 'eq'
	},
	
	validator: {
		designDept: {
			type: "v_designDept", 
			regex: /^FL_DD_\d{2}$/g, 
			errorMsg: "请以FL_DD_作为前缀 , 之后以两位数字组成(如FL_DD_01)."
		}
	},
	repeatFlg: false,
	
	designRegionList: {},
	designRegionKey: "deptId",
	designRegionValue: "deptName",
	
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
	
	designDept.listgrid = $("#listgrid");
	designDept.gridPager = "#gridPager";
	designDept.saveBtn = $("#saveBtn").on("click", saveData);
	designDept.cancelBtn = $("#cancelBtn");
	
	var searchOpts = {
		url: api.department.pageDepartment,
		postParmas: designDept.postParam,
		listgrid: designDept.listgrid,
		items: [{label:"设计部门名称",id:"designDeptNameSearch",name:"deptName", type:'text'}]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	
	designDept.items.designDeptId = $("#designDeptId").on("blur",function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.department.queryDepartmentById, {"dept.deptId": $this.val()}, function(res){
			if(res.dept){
				com.showTips($this, "该设计部门编号已存在", true);
				designDept.repeatFlg = true;
			}else{
				com.clearValidator("#designDeptId", true);
				designDept.repeatFlg = false;
			}
		});
	});
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
		designDept.regionList = res.regionList;
		designDept.items.regionSel.bindData(designDept.regionList, designDept.regionKey, designDept.regionValue, false).trigger("change");
	});
	
	com.post(api.department.queryDepartment, {'dept.type': com.deptType.designRegion}, function(res){
		designDept.designRegionList = res.deptList;
		designDept.items.designRegionSel.bindData(designDept.designRegionList, designDept.designRegionKey, designDept.designRegionValue, false);
	});
	
	initializeListgrid();
});

function bindCityProper(cityId, $cityProperObj, flag, callback){
	if(cityId != ""){
		com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){
			$cityProperObj.bindData(res.cityProperList, designDept.cityProperKey, designDept.cityProperValue, flag);
			if(callback) callback();
		});
	}else{
		$cityProperObj.bindData([], "", "", flag);
	}
}
function bindCity(regionId, $cityObj, flag, callback){
	if(regionId!=""){
		com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){
			$cityObj.bindData(res.cityList, designDept.cityKey, designDept.cityValue, flag).trigger("change", callback); //when edit we set cityProperId
		});
	}else{
		$cityObj.bindData([], "", "", flag);
	}
}

function initializeListgrid(){
	designDept.listgrid.jqGrid({		
		url: api.department.pageDepartment.url,
		postData: designDept.postParam,
		colNames:['设计部门编号', '设计部门名称', '所属设计大区', '所属大区', '所属城市', '所属城区', '合同号前缀', '创建时间', '描述'],
		colModel:[
			{name:'deptId'},
			{name:'deptName'},
			{name:'fatherDeptName', jsonmap:'fatherDept.deptName'},
			{name:'regionName', jsonmap:'cityProper.city.region.regionName'},
			{name:'cityName', jsonmap:'cityProper.city.cityName'},
			{name:'cityProperName', jsonmap:'cityProper.cityProperName'},
			{name:'contractPrefix'},
			{name:'createTime'},
			{name:'des'}
		], 
		pager : designDept.gridPager,
		caption: "设计部门列表"
	});

	designDept.listgrid.navGrid(designDept.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false},{},{},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(designDept.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			
			var row = $.jgrid.getRowData.call(designDept.listgrid, "deptId");
			
			if(row == undefined){
				return;
			}
			
			designDept.items.designDeptId.val(row.deptId).prop("disabled", true).css("display", "block");
			designDept.items.designDeptName.val(row.deptName);
			designDept.items.designRegionSel.val(row.fatherDept.deptId);
			designDept.items.regionSel.val(row.cityProper.city.region.regionId);
			
			$.when(
				com.post(api.system.queryCityByRegionId, {"city.region.regionId":row.cityProper.city.region.regionId}), 
				com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": row.cityProper.city.cityId})
			).done(function(city, cityProper){
					designDept.items.citySel.bindData(city.cityList, designDept.cityKey, designDept.cityValue, false);
					designDept.items.cityProperSel.bindData(cityProper.cityProperList, designDept.cityProperKey, designDept.cityProperValue, false);
					designDept.items.citySel.val(row.cityProper.city.cityId);
					designDept.items.cityProperSel.val(row.cityProper.cityProperId);
			}).fail(function(){
				console.log("queryCityByRegionId and queryCityPropersByCityId fail....");
			});
			
			designDept.items.contractPrefix.val(row.contractPrefix);
			designDept.items.createTime = row.createTime;
			designDept.items.des.val(row.des);
			designDept.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(designDept.gridPager, { //add
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(designDept.items);
			designDept.items.designDeptId.prop("disabled", false).css("display", "none");
			designDept.items.regionSel.trigger("change");
			designDept.modal.modal("show");   
		},
		position: 'first'
	});
}

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0; i<nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["deptIds["+i+"]"] = row.deptId;
	}
	
	com.post(api.department.deleteDepartment, options, successCallback);
	
	$("#eData").trigger("click");
}
function saveData(){
	if(com.validate() || designDept.repeatFlg){
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
		options['dept.createTime'] = designDept.items.createTime;
	}else{
		url = api.department.addDepartment;
		options['dept.deptId'] = "DD_";
		options['dept.company'] = config.company;
	}
	
	com.post(url, options, successCallback);
	
	designDept.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(designDept.listgrid, designDept.postParam);
}
