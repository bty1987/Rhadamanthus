var qualityTesting = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	qualityTestingItems: {},
	
	editFlag: false
};

var qualityTestingPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("质检控制", "订单信息列表");
	
	qualityTesting.listGrid = $("#listGrid");
	qualityTesting.gridPager = "#gridPager";
	qualityTesting.saveBtn = $("#saveBtn").on("click", saveData);
	qualityTesting.cancelBtn = $("#cancelBtn");
	qualityTesting.modal = $("#qualityTestingModal");
	
	if(!params["qualityTestingPostData"]){
		params["qualityTestingPostData"] = {
			"filters[0].data": "notAllocationed",
			"filters[0].field": "allocationWorkerFlag",
			"filters[0].op": "cn",
		};
	}
	
	constructionUtils.createDecorationOrderCondition(qualityTesting.listGrid, api.construction.pageDecorationOrderForQualityByUserId.url, "qualityTestingSearchDiv", {}, "qualityTestingPostData", 187);
	
	qualityTesting.listGrid.jqGrid({	
		url: api.construction.pageDecorationOrderForQualityByUserId.url,
		postData: params["qualityTestingPostData"],
		colNames:['编号', '楼盘名', '设计师', '监理', '面积', '进度', '操作'],
		colModel:[
		    {name:'orderId'},
			{name:'villageName', width:400, jsonmap:'village.villageName', formatter: villageInit},
			{name:'designer', width:60},
			{name:'supervisor', width:60},
			{name:'houseArea', width:60},
			{name:'schedule', formatter: constructionUtils.scheduleInit},
			{name:'action', sortable: false, editable: false, formatter: actionInit}
		],
		pager : qualityTesting.gridPager,
		caption: "订单信息列表",
		gridComplete: function(){
			var _postData = $(this).getGridParam("postData");
			var _param = params["qualityTestingPostData"] ? params["qualityTestingPostData"] : {};
			
			_param["paging.page"] = _postData["paging.page"];
			_param["paging.rows"] = _postData["paging.rows"];
			
			params["qualityTestingPostData"] = _param;
		}
	});
	
	$('.date-picker').datepicker({autoclose:true});
	$('[data-rel=popover]').popover({html:true});
});

function villageInit(cellvalue, options, rowdata){
	var html = rowdata.village.villageName + ' '+rowdata.houseNumber;
	return html;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewQualityTestingDetailIndex(\'' + rowdata.orderId + '\');">查看</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-danger" onclick="viewQualityTestingRecord(\'' + rowdata.orderId + '\', \'' + rowdata.village.villageName + '\');">记录</button>';
	result += '</div>';
	
	return result;
}

function scheduleInit(cellvalue, options, rowdata){
	var result = '';
	result += '<div class="progress" style="margin-bottom: 0px;" data-percent="力工">';
	
	if(cellvalue == 1){
		result += '<div style="width: 10%;" class="progress-bar progress-bar-success"></div>';
		result += '<div style="width: 10%;" class="progress-bar progress-bar-warning"></div>';
		result += '<div style="width: 10%;" class="progress-bar progress-bar-danger"></div>';
	}
	
	result += '</div>';
	
	return result;
}

function saveData(){
	
}

function viewQualityTestingDetailIndex(orderId){
	qualityTestingPostData["constructionSchedule.orderId"] = orderId;
	$("#qualityTestingPageContent").load(api.index.qualityTestingDetailIndex.url);
}

function viewQualityTestingRecord(orderId, orderAddr){
	qualityTestingPostData["qualityTestingRecord.orderId"] = orderId;
	qualityTestingPostData["qualityTestingRecord.orderAddr"] = orderAddr;
	$("#qualityTestingPageContent").load(api.index.qualityTestingRecordIndex.url);
}
