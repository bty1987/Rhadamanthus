var workerSalary = {
	listGrid: null,
	gridPager: null,
	
	payoffListGrid: null,
	payoffGridPager: null,
	
	unpayoffListGrid: null,
	unpayoffGridPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerSalaryItems: {},
	
	statusTypeData: {"0":"初始", "1":"已发", "2":"未发"},
	
	queryUrl:null,
	queryPayoffUrl:null,
	
	editFlg: false
};

jQuery(function($) {
	workerSalary.modal = $("#paySalaryModal");
	
	workerSalary.listGrid = $("#listGrid");
	workerSalary.gridPager = "#gridPager";
	
	workerSalary.payoffListGrid = $("#payoffListGrid");
	workerSalary.payoffGridPager = "#payoffGridPager";
	
	workerSalary.unpayoffListGrid = $("#unpayoffListGrid");
	workerSalary.unpayoffGridPager = "#unpayoffGridPager";

	initPaySalaryList();
	initPaySalaryPayoffList();
	initPaySalaryUnPayoffList();
	
	var searchOpts = {
		url: api.salary.pageWorkerSalaryForInit,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: workerSalary.listGrid,
		items: [
	        {label:"员工编号",id:"userIdSearch",name:"userId", type:'text'},
	        {label:"工种",id:"workerTypeSearch",name:"workTypeId",type:"select",op:"eq"}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	var searchPayoffOpts = {
		url: api.salary.pageWorkerSalaryForPayOff.url,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: workerSalary.payoffListGrid,
		items: [
	        {label:"员工编号",id:"userIdPayoffSearch",name:"userId", type:'text'},
	        {label:"工种",id:"workerTypePayoffSearch",name:"workTypeId",type:"select",op:"eq"}
		]
	};
	$("#payoffSearchDiv").flSearch(searchPayoffOpts);
	
	var searchUnPayoffOpts = {
		url: api.salary.pageWorkerSalaryForUnPayOff.url,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: workerSalary.unpayoffListGrid,
		items: [
	        {label:"员工编号",id:"userIdUnPayoffSearch",name:"userId", type:'text'},
	        {label:"工种",id:"workerTypeUnPayoffSearch",name:"workTypeId",type:"select",op:"eq"}
		]
	};
	$("#unpayoffSearchDiv").flSearch(searchUnPayoffOpts);
	
	com.post(api.ds.workType, {}, function(res){
		
		var workType = res.workType;
		
		$("#workerTypeSearch").bindData(workType, "key", "value", true);
		$("#workerTypePayoffSearch").bindData(workType, "key", "value", true);
		$("#workerTypeUnPayoffSearch").bindData(workType, "key", "value", true);
	});
	
	$("#searchDiv > .fl_search").append('<button id="payoff" class="btn btn-sm btn-danger" style="padding-left:15px;">工人工资结算</button>');
	$("#payoff").on("click", function(){
		bootbox.confirm("当前操作系统将针对当前没有结算的工资进行结算 , 是否提交完成工人工资结算", function(result) {
			if(result){
				com.post(api.salary.payWorkerSalary, {}, function(result){
					com.showAlert(com.info, "工资结算成功!");
					workerSalary.listGrid.trigger("reloadGrid");
					workerSalary.payoffListGrid.trigger("reloadGrid");
				}, function(result){
					com.showAlert(com.error, "工资结算失败!");
				});
			}
		});
	});

	$("#workerSalaryPayoff").removeClass("active");
	$("#workerSalaryUnPayoff").removeClass("active");
});

function initPaySalaryList(){
	workerSalary.listGrid.jqGrid({		
		url: api.salary.pageWorkerSalaryForInit.url,
		colNames:['wsId', 'userId', '姓名', '工种Id', '工种', '起始时间', '结束时间', '基本工资', '扣款', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'wsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'workTypeId', hidden:true},
			{name:'workType'},
			{name:'createTime'},
			{name:'endTime', hidden:true},
			{name:'base'},
			{name:'deduct'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', hidden:true, formatter: actionPayInit}
		], 
		sortable:false,
		pager : workerSalary.gridPager,
		caption: ""
	});

	workerSalary.listGrid.navGrid(workerSalary.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function initPaySalaryPayoffList(){
	workerSalary.payoffListGrid.jqGrid({		
		url: api.salary.pageWorkerSalaryForPayOff.url,
		colNames:['wsId', 'userId', '姓名', '工种Id', '工种', '起始时间', '结束时间', '基本工资', '扣款', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'wsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'workTypeId', hidden:true},
			{name:'workType'},
			{name:'createTime'},
			{name:'endTime'},
			{name:'base'},
			{name:'deduct'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', formatter: actionPayInit}
		], 
		sortable:false,
		pager : workerSalary.payoffGridPager,
		caption: ""
	});

	workerSalary.payoffListGrid.navGrid(workerSalary.payoffGridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function initPaySalaryUnPayoffList(){
	workerSalary.unpayoffListGrid.jqGrid({		
		url: api.salary.pageWorkerSalaryForUnPayOff.url,
		colNames:['wsId', 'userId', '姓名', '工种Id', '工种', '起始时间', '结束时间', '基本工资', '扣款', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'wsId', hidden:true},
			{name:'userId', hidden:true},
			{name:'userName'},
			{name:'workTypeId', hidden:true},
			{name:'workType'},
			{name:'createTime'},
			{name:'endTime'},
			{name:'base'},
			{name:'deduct'},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', formatter: actionUnPayInit}
		], 
		sortable:false,
		pager : workerSalary.unpayoffGridPager,
		caption: ""
	});

	workerSalary.unpayoffListGrid.navGrid(workerSalary.unpayoffGridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="" class="btn btn-minier btn-yellow" onclick="paySalary(\''+cellvalue+'\');">发放工资</button>';
	result += '</div>';
	
	return result;
}

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "pass"){
		var row = workerSalary.listGrid.jqGrid("getRowData", options.rowId);
		result += '<span class="label label-success arrowed">';
		result += workerSalary.statusTypeData[row.status.toString()];
		result += '</span>';
	}else{
		result += '<span class="label label-success arrowed">';
		result += workerSalary.statusTypeData[rowdata.status];
		result += '</span>';
	}
	
	return result;
}

function actionPayInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="" class="btn btn-minier btn-yellow" onclick="unpaySalary(\'' + options.rowId + '\', \'' + rowdata.wsId + '\');">未发</button>';
	result += '</div>';
	
	return result;
}

function actionUnPayInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="" class="btn btn-minier btn-yellow" onclick="paySalary(\'' + options.rowId + '\', \'' + rowdata.wsId + '\');">已发</button>';
	result += '</div>';
	
	return result;
}

function paySalary(rowId, wsId){
	
	var options = {};
	options["workerSalary.wsId"] = wsId;
	
	com.post(api.salary.payoffWorkerSalary, options, function(res){
		workerSalary.unpayoffListGrid.jqGrid("delRowData", rowId);
	});
}

function unpaySalary(rowId, wsId){
	
	var options = {};
	options["workerSalary.wsId"] = wsId;
	
	com.post(api.salary.unPayoffWorkerSalary, options, function(res){
		workerSalary.payoffListGrid.jqGrid("delRowData", rowId);
	});
}
