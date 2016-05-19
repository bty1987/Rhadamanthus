var workerBaseSalary = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerBaseSalaryItems: {},
	
	workTypeData: [{"key":"铲大白", "value":"铲大白"}, {"key":"放线", "value":"放线"}, {"key":"水工", "value":"水工"}, {"key":"力工", "value":"力工"}, {"key":"电工", "value":"电工"}, {"key":"瓦工", "value":"瓦工"}, {"key":"木工", "value":"木工"}, {"key":"油工", "value":"油工"}, {"key":"保洁", "value":"保洁"}],
	statusData:[{"key":"0", "value":"初始"}, {"key":"1", "value":"通过"}, {"key":"2", "value":"确认"}, {"key":"3", "value":"已发"}, {"key":"4", "value":"已发"}],
	
	statusTypeData: {"0":"初始", "1":"通过", "2":"确认", "3":"已发", "4":"撤销"},
	
	editFlag: false,
	commitFlag: false,
};

var workerBaseSalaryPostData = {};

var autoFillList = [];
var autoFillNameList = [];

jQuery(function($) {
	$('#fl-statement').statement("工人工资", "订单工人工资列表");
	
	workerBaseSalary.listGrid = $("#listGrid");
	workerBaseSalary.gridPager = "#gridPager";
	workerBaseSalary.saveBtn = $("#saveBtn");
	workerBaseSalary.cancelBtn = $("#cancelBtn");
	workerBaseSalary.modal = $("#baseSalaryModal").on('show.bs.modal',function(e){
		com.clearValidator();
		workerBaseSalary.commitFlag = false;
	});
	
	workerBaseSalary.workerBaseSalaryItems.workType = $("#workType");
	workerBaseSalary.workerBaseSalaryItems.base = $("#base");
	workerBaseSalary.workerBaseSalaryItems.userName = $("#userName").typeahead({
		reverseFlag: false,
	    source: function (query, process) {
	        var options = {"materialModel.materialModelName": query};
	        
	        if(typeof this.options.url !== "string"){
	        	com.showAlert(com.error, "the autoFillText has no any url.");
	        }
	        
	        com.post("", options, function(data){
	        	var _autoFillList = data.autoFillList;
	        	
	        	autoFillList = [];
        		autoFillNameList = [];
        		
        		for(var i=0;i<_autoFillList.length;i++){
        			autoFillList[i] = _autoFillList[i].value;
        			autoFillNameList[i] = _autoFillList[i].key;
        		}
	        	process(autoFillList);
	        });
	    },
	    matcher: function (item) {
	        return true;
	    }
	}).attr("autocomplete", "off").on("change", function(){
		
		var userId = autoFillList.indexOf($(this).val());
		
		if(userId){
			workerBaseSalaryPostData["workerBaseSalary.userId"] = userId;
			workerBaseSalaryPostData["workerBaseSalary.userName"] = $(this).val();
			
			workerBaseSalary.commitFlag = true;
		}else{
			return false;
		}
	}).on("keydown", function(){
		workerBaseSalary.commitFlag = false;
	});
	
	var workerBaseSalarySearchOpts = {
		url: api.salary.pageWorkerBaseSalaryForPass,
		listgrid: workerBaseSalary.listGrid,
		postParmas: {"paging.rows":10, "paging.page":1},
		items: [
	        {label:"订单编号",id:"orderIdSearch",name:"orderId",type:"text", op:"eq"},
	        {label:"工人编号",id:"userIdSearch",name:"userId",type:"text", op:"eq"},
	        {label:"工人姓名",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
	        {label:"状态",id:"statusSearch",name:"status",type:"select", op:"eq"},
	        {label:"工种",id:"workeTypeSearch",name:"workTypeId",type:"select", op:"eq"},
		]
	};
	$("#searchDiv").flSearch(workerBaseSalarySearchOpts);
	
	com.post(api.ds.workType, {}, function(res){
		var workType = res.workType;
		$("#workeTypeSearch").bindData(workType, "key", "value", true);
	});
	
	$("#statusSearch").bindData(workerBaseSalary.statusData, "key", "value", false);
	
	workerBaseSalary.listGrid.jqGrid({
		url: api.salary.pageWorkerBaseSalary.url,
		postData: workerBaseSalaryPostData,
		colNames:['wbsId', 'wsId', 'userId', '姓名', '工种', '时间', '基本工资', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'wbsId', hidden:true},
			{name:'wsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'workType'},
			{name:'createTime'},
			{name:'base'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', formatter: actionInit}
		],
		pager: workerBaseSalary.gridPager,
		caption: "订单工人工资列表"
	});
	
	workerBaseSalary.listGrid.navGrid(workerBaseSalary.gridPager, {edit:false,add:false,del:false,search:false,refresh: false,view: false},{},{},{}, $.jgrid.searchFunc($(this)));
});

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "pass"){
		var row = workerBaseSalary.listGrid.jqGrid("getRowData", options.rowId);
		result += '<span class="label label-success arrowed">';
		result += workerBaseSalary.statusTypeData[row.status.toString()];
		result += '</span>';
	}else{
		result += '<span class="label label-success arrowed">';
		result += workerBaseSalary.statusTypeData[rowdata.status];
		result += '</span>';
	}
	
	return result;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	if(rowdata.status == 1){
		result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-success" onclick="confirmWorderBaseSalary(' + options.rowId + ');">确认</button>';
		result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-danger" onclick="cancelWorderBaseSalary(' + options.rowId + ');">撤销</button>';
	}
	if(cellvalue == "pass"){
		result = "";
	}
	return result;
}

function confirmWorderBaseSalary(rowId){
	
	var row = workerBaseSalary.listGrid.jqGrid("getRowData", rowId);
	
	var options = {};
	options["workerBaseSalary.wbsId"] = row.wbsId;
	
	com.post(api.salary.confirmWorkerBaseSalary, options, function(){
		workerBaseSalary.listGrid.setCell(rowId, "status", "2");
		workerBaseSalary.listGrid.setCell(rowId, "statusShow", "pass");
		workerBaseSalary.listGrid.setCell(rowId, "action", "pass");
	});
}

function cancelWorderBaseSalary(rowId){
var row = workerBaseSalary.listGrid.jqGrid("getRowData", rowId);
	
	var options = {};
	options["workerBaseSalary.wbsId"] = row.wbsId;
	
	com.post(api.salary.cancelWorkerBaseSalaryToInit, options, function(){
		workerBaseSalary.listGrid.setCell(rowId, "status", "4");
		workerBaseSalary.listGrid.setCell(rowId, "statusShow", "pass");
		workerBaseSalary.listGrid.setCell(rowId, "action", "pass");
	});
}
