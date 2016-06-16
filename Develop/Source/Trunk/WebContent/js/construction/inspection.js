var inspection = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	inspectionItems: {},
	
	editFlag: false
};

var inspectionPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("巡检控制", "订单信息列表");
	
	inspection.listGrid = $("#listGrid");
	inspection.gridPager = "#gridPager";
	inspection.inspectionInfoListGrid = $("#inspectionInfoListGrid");
	inspection.inspectionInfoGridPager = $("#inspectionInfoGridPager");
	inspection.saveBtn = $("#saveBtn").on("click", saveData);
	inspection.cancelBtn = $("#cancelBtn");
	
	constructionUtils.createDecorationOrderCondition(inspection.listGrid, api.construction.pageDecorationOrderForConstructionSchedule.url, "inspectionSearchDiv", {}, "inspectionPostData", 123);
	
	inspection.listGrid.jqGrid({		
		url: api.construction.pageDecorationOrderForConstructionSchedule.url,
		postData: params["inspectionPostData"],
		colNames:['编号', '楼盘名', '设计部门', '设计师', '监理', '面积', '进度', '工程状态', '操作'],
		colModel:[
		    {name:'orderId'},
			{name:'villageName', width:300, jsonmap:'village.villageName', formatter: villageInit},
			{name:'designDepartment'},
			{name:'designer', width:80},
			{name:'supervisor', width:80},
			{name:'houseArea', width:80},
			{name:'schedule', formatter: constructionUtils.scheduleInit},
			{name:'projectStatus', hidden:true},
			{name:'action', sortable: false, editable: false, formatter: actionInit}
		],
		pager : inspection.gridPager,
		caption: "订单信息列表",
		gridComplete: function(){
			var _postData = $(this).getGridParam("postData");
			var _param = params["inspectionPostData"] ? params["inspectionPostData"] : {};
			
			_param["paging.page"] = _postData["paging.page"];
			_param["paging.rows"] = _postData["paging.rows"];
			
			params["inspectionPostData"] = _param;
		}
	});
});

function villageInit(cellvalue, options, rowdata){
	var html = rowdata.village.villageName + ' ' + rowdata.houseNumber;
	return html;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewRecord(\'' + rowdata.orderId + '\', \'' + rowdata.village.villageName + '\');">记录</button>';
	// result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-danger" onclick="viewDeduction(' + rowdata.orderId + ', \'' + rowdata.village.villageName + '\');">扣款</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	
}

function viewRecord(orderId, orderAddr){
	inspectionPostData["inspectionRecord.orderId"] = orderId;
	inspectionPostData["inspectionRecord.orderAddr"] = orderAddr;
	$("#inspectionPageContent").load(api.index.inspectionRecordIndex.url);
}

function viewDeduction(orderId, orderAddr){
	inspectionPostData["inspectionDeduction.orderId"] = orderId;
	inspectionPostData["inspectionDeduction.orderAddr"] = orderAddr;
	$("#inspectionPageContent").load(api.index.inspectionDeductionIndex.url);
}
