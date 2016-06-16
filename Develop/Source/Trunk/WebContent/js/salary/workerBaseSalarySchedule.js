var workerSalary = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerSalaryItems: {},
	
	editFlag: false
};

var workerSalaryPostData = {};

var scheduleInfos = {"铲大白":[10, "progress-bar-primary"], "放线":[10, "progress-bar-warning"], "水电力":[10, "progress-bar-danger"], "瓦工":[15, "progress-bar-inverse"], "木工":[20, "progress-bar-purple"], "油工":[20, "progress-bar-pink"], "保洁":[15, "progress-bar-success"]};

jQuery(function($) {
	$('#fl-statement').statement("工人工资", "订单信息列表");
	
	workerSalary.listGrid = $("#listGrid");
	workerSalary.gridPager = "#gridPager";
	workerSalary.saveBtn = $("#saveBtn").on("click", saveData);
	workerSalary.cancelBtn = $("#cancelBtn");
	
	constructionUtils.createDecorationOrderCondition(workerSalary.listGrid, api.construction.pageDecorationOrderForConstructionScheduleByPlace.url, "searchDiv", {}, "workerBaseSalaryPostData", 15);
	
	workerSalary.listGrid.jqGrid({		
		url: api.construction.pageDecorationOrderForConstructionScheduleByPlace.url,
		postData: params["workerBaseSalaryPostData"],
		colNames:['编号', '楼盘地址', '设计师', '监理', '面积', '进度', '工程状态', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'orderId'},
			{name:'villageName', width:300, jsonmap:'village.villageName', formatter: villageInit},
			{name:'designer', width:80},
			{name:'supervisor', width:80},
			{name:'houseArea', width:80},
			{name:'schedule', formatter: constructionUtils.scheduleInit},
			{name:'projectStatus', hidden:true},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		pager: workerSalary.gridPager,
		caption: "订单信息列表"
	});
});

function villageInit(cellvalue, options, rowdata){
	var html = rowdata.village.villageName + ' ' + rowdata.houseNumber;
	return html;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-success" onclick="viewWorkerSalaryDetail(' + rowdata.orderId + ');">基本</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-danger" onclick="viewWorkerDeductDetail(' + rowdata.orderId + ');">扣款</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	
}

function viewWorkerSalaryDetail(orderId){
	workerSalaryPostData["workerSalary.orderId"] = orderId;
	$("#workerSalaryPageContent").load(api.index.workerBaseSalaryScheduleDetailIndex.url);
}

function viewWorkerDeductDetail(orderId){
	workerSalaryPostData["workerSalary.orderId"] = orderId;
	$("#workerSalaryPageContent").load(api.index.workerDeductSalaryScheduleDetailIndex.url);
}
