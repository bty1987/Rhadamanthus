var bRegion = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {
		'filters[0].field': 'type',
		'filters[0].data': com.deptType.businessRegion,
		'filters[0].op': 'eq'
	},
	
	validator: {
		businessRegion: {
			type: "v_businessRegion", 
			regex: /^FL_BR_\d{2}$/g, 
			errorMsg: "请以FL_BR_作为前缀 , 之后以两位数字组成(如FL_BR_01)."
		}
	},
	repeatFlg: false,
	
	regionList: [],
	regionKey: "deptId",
	regionValue: "deptName"
};

jQuery(function($) {
	
	bRegion.listgrid = $("#listgrid");
	bRegion.gridPager = "#gridPager";
	bRegion.saveBtn = $("#saveBtn").on("click", saveData);
	bRegion.cancelBtn = $("#cancelBtn");
	
	bRegion.items.businessRegionId = $("#businessRegionId").on("blur",function(){
		$this = $(this);
		if($this.val() == undefined || $this.val().trim() == "")
			return;
		com.post(api.department.queryDepartmentById, {"dept.deptId":$this.val()}, function(res){
			if(res.dept){
				com.showTips($this, "该业务大区编号已存在", true);
				bRegion.repeatFlg = true;
			}else{
				com.clearValidator("#businessRegionId", true);
				bRegion.repeatFlg = false;
			}
		});
	});;
	bRegion.items.businessRegionName = $("#businessRegionName");
	bRegion.items.businessRegionDes = $("#businessRegionDes");
	
	bRegion.modal = $("#businessRegionModal");
	bRegion.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#businessRegionId", true);
	});
	$.extend(com.validator, bRegion.validator);
	
	var searchOpts = {
		url: api.department.pageDepartment,
		postParmas: bRegion.postParam,
		listgrid: bRegion.listgrid,
		items: [{label:"业务大区名称",id:"businessRegionNameSearch",name:"deptName", type:'text'}]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	initializeListgrid();
});

function initializeListgrid(){
	bRegion.listgrid.jqGrid({		
		url: api.department.pageDepartment.url,
		postData: bRegion.postParam,
		colNames: ['业务大区编号', '业务大区名称', '创建时间', '描述'],
		colModel: [
			{name:'deptId'},
			{name:'deptName'},
			{name:'createTime'},
			{name:'des'}
		], 
		pager: bRegion.gridPager,
		caption: "业务大区列表"
	});

	bRegion.listgrid.navGrid(bRegion.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(bRegion.gridPager, {
		caption: "",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			var row = $.jgrid.getRowData.call(bRegion.listgrid, "deptId");
			
			if(row == undefined){
				return;
			}
			
			bRegion.items.businessRegionId.val(row.deptId).prop("disabled", true).css("display", "block");
			bRegion.items.businessRegionName.val(row.deptName);
			bRegion.items.createTime = row.createTime;
			bRegion.items.businessRegionDes.val(row.des);
			bRegion.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(bRegion.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(bRegion.items);
			bRegion.items.businessRegionId.prop("disabled", false).css("display", "none");
			bRegion.modal.modal("show");   
		},
		position: 'first'
	});
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["deptIds["+i+"]"] = row.deptId;
	}
	com.post(api.department.deleteDepartment, options, successCallback);
	$("#eData").trigger("click");
}

function saveData(){
	if(com.validate() || bRegion.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		'dept.ident': 14,
		'dept.deptName': bRegion.items.businessRegionName.val(),
		'dept.type': com.deptType.businessRegion,
		'dept.des': bRegion.items.businessRegionDes.val()
	};
	
	if(editFlg){
		url = api.department.updateDepartment;
		options['dept.deptId'] = bRegion.items.businessRegionId.val();
		options['dept.createTime'] = bRegion.items.createTime;
	}else{
		url = api.department.addDepartment;
		options['dept.deptId'] = "BR_";
		options['dept.company'] = config.company;
	}
	
	com.post(url, options, successCallback);
	
	bRegion.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(bRegion.listgrid, bRegion.postParam);
}
