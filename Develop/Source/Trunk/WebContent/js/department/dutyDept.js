var duty = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	repeatFlg: false,
	postParam: {},
	deptType: ["行政部", "财务部"],
	postParam: {
		'filters[0].field': 'type',
		'filters[0].data': com.deptType.dutyDept,
		'filters[0].op': 'eq'
	},
	
	validator: {
		dutyDept: {
			type: "v_dutyDept", 
			regex: /^FL_ZD_\d{2}$/g, 
			errorMsg: "请以FL_ZD_作为前缀 , 之后以两位数字组成(如FL_ZD_01)."
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

	duty.listgrid = $("#listgrid");
	duty.gridPager = "#gridPager";
	duty.saveBtn = $("#saveBtn").on("click", saveData);
	duty.cancelBtn = $("#cancelBtn");
	var searchOpts = {
		url: api.department.pageDepartment,
		postParmas: duty.postParam,
		listgrid: duty.listgrid,
		items: [{label:"部门名称",id:"dutyDeptNameSearch",name:"deptName", type:'text'}]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	duty.items.dutyDeptId = $("#dutyDeptId").on("blur",function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.department.queryDepartmentById, {"dept.deptId": $this.val()}, function(res){
			if(res.dept){
				com.showTips($this, "该部门编号已存在", true);
				duty.repeatFlg = true;
			}else{
				com.clearValidator("#dutyDeptId", true);
				duty.repeatFlg = false;
			}
		});
	});
	duty.items.dutyDeptName = $("#dutyDeptName");
	duty.items.typeSel = $("#typeSel").bindData([com.deptType.adminDept, com.deptType.financeDept], "", "", false);
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
		duty.items.regionSel.bindData(duty.regionList, duty.regionKey, duty.regionValue, false).trigger("change");
	});
	
	initializeListgrid();
});

function bindCityProper(cityId, $cityProperObj, flag, callback){
	if(cityId != ""){
		com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){
			$cityProperObj.bindData(res.cityProperList, duty.cityProperKey, duty.cityProperValue, flag);
			if(callback) callback();
		});
	}else{
		$cityProperObj.bindData([], "", "", flag);
	}
}

function bindCity(regionId, $cityObj, flag, callback){
	if(regionId != ""){
		com.post(api.system.queryCityByRegionId, {"city.region.regionId": regionId}, function(res){
			$cityObj.bindData(res.cityList, duty.cityKey, duty.cityValue, flag).trigger("change", callback); //when edit we set cityProperId
		});
	}else{
		$cityObj.bindData([], "", "", flag);
	}
}

function initializeListgrid(){
	duty.listgrid.jqGrid({		
		url: api.department.pageDepartment.url,
		postData: duty.postParam,
		colNames:['部门编号', '部门名称', '部门类型', '所属大区', '所属城市', '所属城区', '创建时间', '描述'],
		colModel:[
			{name:'deptId'},
			{name:'deptName'},
			{name:'subType'},
			{name:'regionName', jsonmap:'cityProper.city.region.regionName'},
			{name:'cityName', jsonmap:'cityProper.city.cityName'},
			{name:'cityProperName', jsonmap:'cityProper.cityProperName'},
			{name:'createTime'},
			{name:'des'}
		], 
		pager : duty.gridPager,
		caption: "职能部门列表"
	});

	duty.listgrid.navGrid(duty.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(duty.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			var row = $.jgrid.getRowData.call(duty.listgrid, "deptId");
			
			if(row == undefined){
				return;
			}
			
			duty.items.dutyDeptId.val(row.deptId).prop("disabled", true).css("display", "block");
			duty.items.dutyDeptName.val(row.deptName);
			duty.items.typeSel.val(row.subType);
			duty.items.regionSel.val(row.cityProper.city.region.regionId);
			
			$.when(
				com.post(api.system.queryCityByRegionId, {"city.region.regionId":row.cityProper.city.region.regionId}), 
				com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": row.cityProper.city.cityId})
			).done(function(city, cityProper){
				duty.items.citySel.bindData(city.cityList, duty.cityKey, duty.cityValue, false);
				duty.items.cityProperSel.bindData(cityProper.cityProperList, duty.cityProperKey, duty.cityProperValue, false);
				duty.items.citySel.val(row.cityProper.city.cityId);
				duty.items.cityProperSel.val(row.cityProper.cityProperId);
			}).fail(function(){
				console.log("queryCityByRegionId and queryCityPropersByCityId fail....");
			});
			duty.items.createTime = row.createTime;
			duty.items.des.val(row.des);
			duty.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(duty.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(duty.items);
			duty.items.dutyDeptId.prop("disabled", false).css("display", "none");
			duty.items.regionSel.trigger("change");
			duty.modal.modal("show");   
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
	if(com.validate() || duty.repeatFlg){
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
		options['dept.createTime'] = duty.items.createTime;
	}else{
		url = api.department.addDepartment;
		options['dept.deptId'] = "ZD_";
		options['dept.company'] = config.company;
	}
	
	com.post(url, options, successCallback);
	
	duty.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(duty.listgrid, duty.postParam);
}
