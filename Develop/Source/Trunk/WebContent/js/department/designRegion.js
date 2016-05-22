var dRegion = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {
		'filters[0].field': 'type',
		'filters[0].data': com.deptType.designRegion,
		'filters[0].op': 'eq'
	},
	
	validator: {
		designRegion: {
			type: "v_designRegion", 
			regex: /^FL_DR_\d{2}$/g, 
			errorMsg: "请以FL_DR_作为前缀 , 之后以两位数字组成(如FL_DR_01)."
		}
	},
	repeatFlg: false,
	
	regionList: [],
	regionKey: "deptId",
	regionValue: "deptName"
};

jQuery(function($) {

	dRegion.listgrid = $("#listgrid");
	dRegion.gridPager = "#gridPager";
	dRegion.saveBtn = $("#saveBtn").on("click", saveData);
	dRegion.cancelBtn = $("#cancelBtn");
	
	dRegion.items.designRegionId = $("#designRegionId").on("blur",function(){
		$this = $(this);
		
		if($this.val() == undefined || $this.val().trim() == ""){
			return;
		}
		
		com.post(api.department.queryDepartmentById, {"dept.deptId": $this.val()}, function(res){
			if(res.dept){
				com.showTips($this, "该设计大区编号已存在", true);
				dRegion.repeatFlg = true;
			}else{
				com.clearValidator("#designRegionId", true);
				dRegion.repeatFlg = false;
			}
		});
	});
	dRegion.items.designRegionName = $("#designRegionName");
	dRegion.items.designRegionDes = $("#designRegionDes");
	
	dRegion.modal = $("#designRegionModal");
	dRegion.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#designRegionId", true);
	});
	$.extend(com.validator, dRegion.validator);
	
	var searchOpts = {
		url: api.department.pageDepartment,
		postParmas: dRegion.postParam,
		listgrid: dRegion.listgrid,
		items: [{label:"设计大区名称",id:"designRegionNameSearch",name:"deptName", type:'text'}]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	initializeListgrid();
	
});

function initializeListgrid(){
	dRegion.listgrid.jqGrid({		
		url: api.department.pageDepartment.url,
		postData: dRegion.postParam,
		colNames: ['设计大区编号', '设计大区名称', '创建时间', '描述'],
		colModel: [
			{name:'deptId'},
			{name:'deptName'},
			{name:'createTime'},
			{name:'des'}
		], 
		pager : dRegion.gridPager,
		caption: "设计大区列表"
	});

	dRegion.listgrid.navGrid(dRegion.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(dRegion.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			var row = $.jgrid.getRowData.call(dRegion.listgrid, "deptId");
			
			if(row == undefined){
				return;
			}
			
			dRegion.items.designRegionId.val(row.deptId).prop("disabled", true).css("display", "block");
			dRegion.items.designRegionName.val(row.deptName);
			dRegion.items.createTime = row.createTime;
			dRegion.items.designRegionDes.val(row.des);
			dRegion.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(dRegion.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(dRegion.items);
			dRegion.items.designRegionId.prop("disabled", false).css("display", "none");
			dRegion.modal.modal("show");   
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
	if(com.validate() || dRegion.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		'dept.ident': 12,
		'dept.deptName': dRegion.items.designRegionName.val(),
		'dept.type': com.deptType.designRegion,
		'dept.des': dRegion.items.designRegionDes.val()
	};
	
	if(editFlg){
		url = api.department.updateDepartment;
		options['dept.deptId'] = dRegion.items.designRegionId.val();
		options['dept.createTime'] = dRegion.items.createTime;
	}else{
		url = api.department.addDepartment;
		options['dept.deptId'] = "DR_";
		options['dept.company'] = config.company;
	}
	
	com.post(url, options, successCallback);
	
	dRegion.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(dRegion.listgrid, dRegion.postParam);
}
