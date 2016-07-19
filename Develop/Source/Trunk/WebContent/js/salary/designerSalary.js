var designerSalary = {
	listGrid: null,
	gridPager: null,
	
	listPayoffGrid: null,
	gridPayoffPager: null,
	
	listUnPayoffGrid: null,
	gridUnPayoffPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	designerSalaryItems: {},
	
	statusTypeData: {"0":"初始", "1":"已发", "2":"未发"},
	
	queryUrl:null,
	queryPayoffUrl:null,
	
	editFlg: false
};

jQuery(function($) {
	designerSalary.modal = $("#paySalaryModal");
	designerSalary.listGrid = $("#listGrid");
	designerSalary.gridPager = "#gridPager";
	
	designerSalary.listPayoffGrid = $("#listPayoffGrid");
	designerSalary.gridPayoffPager = "#gridPayoffPager";
	
	designerSalary.listUnPayoffGrid = $("#listUnPayoffGrid");
	designerSalary.gridUnPayoffPager = "#gridUnPayoffPager";

	initSalaryList();
	initSalaryPayoffList();
	initSalaryUnPayoffList();
	
	var searchOpts = {
		url: api.salary.pageDesignerSalaryForInit,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerSalary.listGrid,
		items: [
	        {label:"设计师编号",id:"userIdSearch",name:"userId", type:'text'},
	        {label:"设计师名称",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$("#searchDiv > .fl_search").append('<button id="payoff" class="btn btn-sm btn-danger" style="padding-left:15px;">设计师工资结算</button>');
	$("#payoff").on("click", function(){
		bootbox.confirm("当前操作系统将针对当前没有结算的工资进行结算 , 是否提交完成设计师工资结算", function(result) {
			if(result){
				com.post(api.salary.payDesignerSalary, {}, function(result){
					com.showAlert(com.info, "工资结算成功!");
					designerSalary.listGrid.trigger("reloadGrid");
					designerSalary.listPayoffGrid.trigger("reloadGrid");
				}, function(result){
					com.showAlert(com.error, "工资结算失败!");
				});
			}
		});
	});
	
	var searchPayoffOpts = {
		url: api.salary.pageDesignerSalaryForPayOff.url,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerSalary.listPayoffGrid,
		items: [
			{label:"设计师编号",id:"userIdSearch",name:"userId", type:'text'},
			{label:"设计师名称",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
		]
	};
	$("#searchPayoffDiv").flSearch(searchPayoffOpts);
	
	var searchUnPayoffOpts = {
		url: api.salary.pageDesignerSalaryForUnPayOff.url,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: designerSalary.listUnPayoffGrid,
		items: [
			{label:"设计师编号",id:"userIdSearch",name:"userId", type:'text'},
			{label:"设计师名称",id:"userNameSearch",name:"userName", type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName, op:"eq"},
		]
	};
	$("#searchUnPayoffDiv").flSearch(searchUnPayoffOpts);

	$("#designerSalaryPayoff").removeClass("active");
	$("#designerSalaryUnPayoff").removeClass("active");
	
});
function initSalaryList(){
	designerSalary.listGrid.jqGrid({
		url: api.salary.pageDesignerSalaryForInit.url,
		colNames:['dsId', '编号', '姓名', '起始时间', '结束时间', '主材', '扣款', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'dsId', hidden:true},
			{name:'userId'},
			{name:'userName'},
			{name:'createTime'},
			{name:'endTime', hidden:true},
			{name:"material"},
			{name:"deduct"},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', hidden:true, formatter: actionInit}
		],
		sortable:false,
		pager : designerSalary.gridPager,
		caption: ""
		
	});

	designerSalary.listGrid.navGrid(designerSalary.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function initSalaryPayoffList(){
	designerSalary.listPayoffGrid.jqGrid({		
		url: api.salary.pageDesignerSalaryForPayOff.url,
		colNames:['dsId', '编号', '姓名', '起始时间', '结束时间', '主材', '扣款', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'dsId', hidden:true},
			{name:'userId'},
			{name:'userName'},
			{name:'createTime'},
			{name:'endTime'},
			{name:"material"},
			{name:"deduct"},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', formatter: actionPayInit}
		],
		sortable:false,
		pager : designerSalary.gridPayoffPager,
		caption: ""
	});

	designerSalary.listPayoffGrid.navGrid(designerSalary.gridPayoffPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function initSalaryUnPayoffList(){
	designerSalary.listUnPayoffGrid.jqGrid({		
		url: api.salary.pageDesignerSalaryForUnPayOff.url,
		colNames:['dsId', '编号', '姓名', '起始时间', '结束时间', '主材', '扣款', '状态', '状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
			{name:'dsId', hidden:true},
			{name:'userId'},
			{name:'userName'},
			{name:'createTime'},
			{name:'endTime'},
			{name:"material"},
			{name:"deduct"},
			{name:'status', hidden:true},
			{name:'statusShow', formatter: statusInit},
			{name:'action', formatter: actionUnPayInit}
		],
		sortable:false,
		pager : designerSalary.gridUnPayoffPager,
		caption: ""
	});

	designerSalary.listUnPayoffGrid.navGrid(designerSalary.gridUnPayoffPager,
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

function actionPayInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="" class="btn btn-minier btn-yellow" onclick="unpaySalary(\'' + options.rowId + '\', \'' + rowdata.dsId + '\');">未发</button>';
	result += '</div>';
	
	return result;
}

function actionUnPayInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="" class="btn btn-minier btn-yellow" onclick="paySalary(\'' + options.rowId + '\', \'' + rowdata.dsId + '\');">已发</button>';
	result += '</div>';
	
	return result;
}

function statusInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "pass"){
		var row = designerSalary.listGrid.jqGrid("getRowData", options.rowId);
		result += '<span class="label label-success arrowed">';
		result += designerSalary.statusTypeData[row.status.toString()];
		result += '</span>';
	}else{
		result += '<span class="label label-success arrowed">';
		result += designerSalary.statusTypeData[rowdata.status];
		result += '</span>';
	}
	
	return result;
}

function paySalary(rowId, dsId){
	
	var options = {};
	options["designerSalary.dsId"] = dsId;
	
	com.post(api.salary.payoffDesignerSalary, options, function(res){
		designerSalary.listUnPayoffGrid.jqGrid("delRowData", rowId);
	}, null, false);
}

function unpaySalary(rowId, dsId){
	
	var options = {};
	options["designerSalary.dsId"] = dsId;
	
	com.post(api.salary.unpayoffDesignerSalary, options, function(res){
		designerSalary.listPayoffGrid.jqGrid("delRowData", rowId);
	}, null, false);
}