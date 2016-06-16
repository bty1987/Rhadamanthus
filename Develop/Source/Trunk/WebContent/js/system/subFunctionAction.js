var subFunctionAction = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	subFunctionActionItems:{},
	
	postParam: {},
	
	editFlg: false,
	repeatFlg: false,
	
	moduleList: [],
	moduleKey: "moduleId",
	moduleValue: "moduleName",
		
	functionList:[],
	functionKey:"functionId",
	functionValue:"functionName",
	
	subFunctionList:[],
	subFunctionKey:"subFunctionId",
	subFunctionValue:"subFunctionName"
};

jQuery(function($) {
	subFunctionAction.listgrid = $("#listgrid");
	subFunctionAction.gridPager = "#gridPager";
	subFunctionAction.saveBtn = $("#saveBtn").on("click", saveData);
	subFunctionAction.cancelBtn = $("#cancelBtn");
	subFunctionAction.modal = $("#subFunctionActionModal");
	subFunctionAction.subFunctionActionItems.subFunctionId=$("#subFunctionId");
	subFunctionAction.subFunctionActionItems.defaultFlag = $("#defaultFlag");
	subFunctionAction.subFunctionActionItems.defaultFlag.switchBtn();
	subFunctionAction.subFunctionActionItems.defaultFlag.click(function(e){
		subFunctionAction.subFunctionActionItems.defaultFlag.value = subFunctionAction.subFunctionActionItems.defaultFlag.value == 0 ? 1 : 0;
	});
	
	subFunctionAction.subFunctionActionItems.moduleId=$("#moduleId").on("change",function(){
		$this = $(this);
		bindFunction($this.val());
	});
	
	subFunctionAction.subFunctionActionItems.functionId=$("#functionId").on("change",function(){
		$this = $(this);
		bindSubFunction($this.val());
	});
	
	subFunctionAction.subFunctionActionItems.actionId = $("#actionId");
	subFunctionAction.subFunctionActionItems.actionDes = $("#actionDes");
	
	subFunctionAction.subFunctionActionItems.actionName = $("#actionName").on("blur",function(){
		$this = $(this);
		com.post(api.system.querySubFunctionActionByName, {"subFunctionActions.actionName":$this.val()}, function(res){
			if(res.subFunctionAction&&res.subFunctionAction.actionName){
				if((subFunctionAction.editFlg && res.subFunctionAction.actionId != subFunctionAction.subFunctionActionItems.actionId.val()) || !subFunctionAction.editFlg){
					com.showTips($this, "action名称已存在", true);
					subFunctionAction.repeatFlg = true;
				}
			}else{
				com.clearValidator("#actionName", true);
				subFunctionAction.repeatFlg = false;
			}
		});
	});
	
	subFunctionAction.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#actionName", true);
	});
	$.extend(com.validator, subFunctionAction.validator);
	
	var searchOpts = {
			url: api.system.pageSubFunctionAction,
			postParmas: {"paging.rows":10, "paging.page":1},
			listgrid: subFunctionAction.listgrid,
			items: [
			    {label:"子功能名称",id:"subFunctionNameSearch",name:"subFunctionName", type:'text'}
			]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	initializeListgrid();
});

function bindModule(moduleId,functionId,subFunctionId){
	com.post(api.system.queryModule, {}, function(res){
		subFunctionAction.moduleList = res.moduleList;
		subFunctionAction.subFunctionActionItems.moduleId.bindData(subFunctionAction.moduleList, subFunctionAction.moduleKey, subFunctionAction.moduleValue, false);
		
		if(typeof(moduleId) == "undefined" || moduleId==null){
			subFunctionAction.subFunctionActionItems.moduleId.get(0).selectedIndex = 0;
		}else{
			subFunctionAction.subFunctionActionItems.moduleId.val(moduleId);
		}
		
		bindFunction(subFunctionAction.subFunctionActionItems.moduleId.val(),functionId, subFunctionId);
	});
}

function bindFunction(moduleId,functionId,subFunctionId){
	com.post(api.system.queryFunctionByModuleId, {"function.module.moduleId":moduleId}, function(res){
		subFunctionAction.functionList = res.functionList;
		subFunctionAction.subFunctionActionItems.functionId.bindData(subFunctionAction.functionList, subFunctionAction.functionKey, subFunctionAction.functionValue);
		
		if(typeof(functionId) == "undefined" || functionId==null){
			subFunctionAction.subFunctionActionItems.functionId.get(0).selectedIndex = 0;
		}else{
			subFunctionAction.subFunctionActionItems.functionId.val(functionId);
		}
		
		bindSubFunction(subFunctionAction.subFunctionActionItems.functionId.val(),subFunctionId);
	});
}

function bindSubFunction(functionId,subFunctionId){
	com.post(api.system.querySubFunctionByFunctionId, {"subFunction.function.functionId":functionId}, function(res){
		subFunctionAction.subFunctionList = res.subFunctionList;
		subFunctionAction.subFunctionActionItems.subFunctionId.bindData(subFunctionAction.subFunctionList, subFunctionAction.subFunctionKey, subFunctionAction.subFunctionValue);
		if(typeof(subFunctionId) == "undefined" || subFunctionId==null){
			subFunctionAction.subFunctionActionItems.subFunctionId.get(0).selectedIndex = 0;
		}else{
			subFunctionAction.subFunctionActionItems.subFunctionId.val(subFunctionId);
		}
		
	});
}

function initializeListgrid(){
	subFunctionAction.listgrid.jqGrid({	
		url: api.system.pageSubFunctionAction.url,
		postData: {},
		colNames:['action编号',  '所属模块', '所属模块Id','所属功能','所属功能Id','所属子功能','所属子功能Id','action名称',"默认权限",'描述'],
		colModel:[
			{name:'actionId', hidden:true},
			{name:'moduleName',jsonmap:'subFunction.function.module.moduleName'} ,
			{name:'moduleId',jsonmap:'subFunction.function.module.moduleId', hidden:true} ,
			{name:'functionName',jsonmap:'subFunction.function.functionName'} ,
			{name:'functionId',jsonmap:'subFunction.function.functionId', hidden:true} ,
			{name:'subFunctionName',jsonmap:'subFunction.subFunctionName'} ,
			{name:'subFunctionId',jsonmap:'subFunction.subFunctionId', hidden:true} ,
			{name:'actionName'},
			{name:"defaultFlag",formatter:defaultFlagFormat,unformat:defaultFlagUnFormat},
			{name:'actionDes'}
			
		], 
		pager : subFunctionAction.gridPager,
		caption: "action列表"
	});

	subFunctionAction.listgrid.navGrid(subFunctionAction.gridPager, {edit:false,add:false,del:true,search:false,searchicon : 'icon-search orange', refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(subFunctionAction.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			subFunctionAction.editFlg = true;
			var num = subFunctionAction.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(subFunctionAction.listgrid.attr("id"));
				return;
			}
			var row = subFunctionAction.listgrid.jqGrid("getRowData", num);
			bindModule(row.moduleId,row.functionId,row.subFunctionId);
			subFunctionAction.subFunctionActionItems.actionId.val(row.actionId);
			subFunctionAction.subFunctionActionItems.actionName.val(row.actionName);
			subFunctionAction.subFunctionActionItems.actionDes.val(row.actionDes);
			subFunctionAction.subFunctionActionItems.moduleId.val(row.moduleId);
			subFunctionAction.subFunctionActionItems.functionId.val(row.functionId);
			subFunctionAction.subFunctionActionItems.subFunctionId.val(row.subFunctionId);
			
			if(subFunctionAction.subFunctionActionItems.defaultFlag.value == undefined){
				if(row.defaultFlag == 1){
					subFunctionAction.subFunctionActionItems.defaultFlag.click();
				}
				subFunctionAction.subFunctionActionItems.defaultFlag.value = row.defaultFlag;
			}else{
				if(subFunctionAction.subFunctionActionItems.defaultFlag.value != row.defaultFlag){
					subFunctionAction.subFunctionActionItems.defaultFlag.click();
				}
				subFunctionAction.subFunctionActionItems.defaultFlag.value = row.defaultFlag;
			}
			
			subFunctionAction.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(subFunctionAction.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			subFunctionAction.editFlg = false;
			com.cleanItems(subFunctionAction.subFunctionActionItems);
			if(subFunctionAction.subFunctionActionItems.defaultFlag.value == undefined){
				subFunctionAction.subFunctionActionItems.defaultFlag.value = 0;
			}else{
				if(subFunctionAction.subFunctionActionItems.defaultFlag.value == 1){
					subFunctionAction.subFunctionActionItems.defaultFlag.click();
				}
				subFunctionAction.subFunctionActionItems.defaultFlag.value = 0;
			}
			bindModule();			
			subFunctionAction.modal.modal("show");   
		},
		position: 'first'
	});
}

function defaultFlagFormat( cellvalue, options, rowObject ){  
	if(cellvalue == 1){
		return '是 <input type="text" value="1" class="hidden" />  ';
	}
    return '否<input type="text" value="0" class="hidden" />';  
}  

function defaultFlagUnFormat( cellvalue, options, cell){  
	return $('input', cell).val();
}  

function removeRow(params, rowNums){

	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["actionIds["+i+"]"] = row.actionId;
	}
	
	com.post(api.system.deleteSubFunctionAction, options, successCallback);
	
	$("#eData").trigger("click");
}

function saveData(){
	
	if(com.validate() || subFunctionAction.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		'subFunctionActions.actionName': subFunctionAction.subFunctionActionItems.actionName.val(),
		'subFunctionActions.actionDes': subFunctionAction.subFunctionActionItems.actionDes.val(),
		'subFunctionActions.subFunction.subFunctionId':subFunctionAction.subFunctionActionItems.subFunctionId.val(),
		'subFunctionActions.defaultFlag': subFunctionAction.subFunctionActionItems.defaultFlag.value,
	};
	
	if(subFunctionAction.editFlg){
		url = api.system.updateSubFunctionAction;
		options['subFunctionActions.actionId'] = subFunctionAction.subFunctionActionItems.actionId.val();
	}else{
		url = api.system.addSubFunctionAction;
	}
	
	com.post(url, options, successCallback);
	
	subFunctionAction.modal.modal("hide");   
}
function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(subFunctionAction.listgrid, subFunctionAction.postParam);
}
