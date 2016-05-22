var material = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {
		'filters[0].field': 'type',
		'filters[0].data': com.deptType.materialDept,
		'filters[0].op': 'eq'
	},
	
	validator: {
		materialDept: {
			type: "v_materialDept", 
			regex: /^FL_MD_\d{2}$/g, 
			errorMsg: "请以FL_MD_作为前缀 , 之后以两位数字组成(如FL_MD_01)."
		}
	},
	repeatFlg: false,
	
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

	material.listgrid = $("#listgrid");
	material.gridPager = "#gridPager";
	material.saveBtn = $("#saveBtn").on("click", saveData);
	material.cancelBtn = $("#cancelBtn");
	var searchOpts = {
		url: api.department.pageDepartment,
		postParmas: material.postParam,
		listgrid: material.listgrid,
		items: [{label:"主材部门名称",id:"materialDeptNameSearch",name:"deptName", type:'text'}]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	material.items.materialDeptId = $("#materialDeptId").on("blur",function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.department.queryDepartmentById, {"dept.deptId":$this.val()}, function(res){
			if(res.dept){
				com.showTips($this, "该主材部门编号已存在", true);
				material.repeatFlg = true;
			}else{
				com.clearValidator("#materialDeptId", true);
				material.repeatFlg = false;
			}
		});
	});
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
		material.regionList = res.regionList;
		material.items.regionSel.bindData(material.regionList, material.regionKey, material.regionValue, false).trigger("change");
	});
	
	initializeListgrid();
});

function bindCityProper(cityId, $cityProperObj, flag, callback){
	if(cityId != ""){
		com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){
			$cityProperObj.bindData(res.cityProperList, material.cityProperKey, material.cityProperValue, flag);
			if(callback) callback();
		});
	}else{
		$cityProperObj.bindData([], "", "", flag);
	}
}

function bindCity(regionId, $cityObj, flag, callback){
	if(regionId != ""){
		com.post(api.system.queryCityByRegionId, {"city.region.regionId":regionId}, function(res){
			$cityObj.bindData(res.cityList, material.cityKey, material.cityValue, flag).trigger("change", callback); //when edit we set cityProperId
		});
	}else{
		$cityObj.bindData([], "", "", flag);
	}
}

function initializeListgrid(){
	material.listgrid.jqGrid({		
		url: api.department.pageDepartment.url,
		postData: material.postParam,
		colNames:['主材部门编号', '主材部门名称', '所属大区', '所属城市', '所属城区', '创建时间', '描述'],
		colModel:[
			{name:'deptId'},
			{name:'deptName'},
			{name:'regionName', jsonmap:'cityProper.city.region.regionName'},
			{name:'cityName', jsonmap:'cityProper.city.cityName'},
			{name:'cityProperName', jsonmap:'cityProper.cityProperName'},
			{name:'createTime'},
			{name:'des'}
		], 
		pager : material.gridPager,
		caption: "主材部门列表"
	});

	material.listgrid.navGrid(material.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(material.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			
			var row = $.jgrid.getRowData.call(material.listgrid, "deptId");
			
			if(row == undefined){
				return;
			}
			
			material.items.materialDeptId.val(row.deptId).prop("disabled", true).css("display", "block");
			material.items.materialDeptName.val(row.deptName);
			material.items.regionSel.val(row.cityProper.city.region.regionId);
			
			$.when(
				com.post(api.system.queryCityByRegionId, {"city.region.regionId":row.cityProper.city.region.regionId}), 
				com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": row.cityProper.city.cityId})
			).done(function(city, cityProper){
				material.items.citySel.bindData(city.cityList, material.cityKey, material.cityValue, false);
				material.items.cityProperSel.bindData(cityProper.cityProperList, material.cityProperKey, material.cityProperValue, false);
				material.items.citySel.val(row.cityProper.city.cityId);
				material.items.cityProperSel.val(row.cityProper.cityProperId);
			}).fail(function(){
				console.log("queryCitysByRegionId and queryCityPropersByCityId fail....");
			});
			
			material.items.createTime = row.createTime;
			material.items.des.val(row.des);
			material.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(material.gridPager, { //add
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(material.items);
			material.items.materialDeptId.prop("disabled", false).css("display", "none");
			material.items.regionSel.trigger("change");
			material.modal.modal("show");   
		},
		position: 'first'
	});
}

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0; i<nums.length;i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["deptIds["+i+"]"] = row.deptId;
	}
	
	com.post(api.department.deleteDepartment, options, successCallback);
	
	$("#eData").trigger("click");
}

function saveData(){
	if(com.validate() || material.repeatFlg){
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
		options['dept.createTime'] = material.items.createTime;
	}else{
		url = api.department.addDepartment;
		options['dept.deptId'] = "MD_";
		options['dept.company'] = config.company;
	}
	
	com.post(url, options, successCallback);
	
	material.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(material.listgrid, material.postParam);
}
