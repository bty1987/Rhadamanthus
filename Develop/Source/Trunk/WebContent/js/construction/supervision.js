var supervision = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	supervisionItems: {},
	
	editFlag: false
};

var supervisionPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("监理控制", "订单信息列表");
	
	supervision.listGrid = $("#listGrid");
	supervision.gridPager = "#gridPager";
	supervision.saveBtn = $("#saveBtn").on("click", saveData);
	supervision.cancelBtn = $("#cancelBtn");
	
	constructionUtils.createDecorationOrderCondition(supervision.listGrid, api.construction.pageDecorationOrderForSupervisionByUserId.url, "supervisionSearchDiv", {}, "supervisionPostData", 591);
	
	supervision.listGrid.jqGrid({
		url: api.construction.pageDecorationOrderForSupervisionByUserId.url,
		postData: params["supervisionPostData"],
		colNames:['编号', '楼盘名', '设计师', '监理', '总价', '折扣', '面积', '进度', '工程状态', '操作'],
		colModel:[
		    {name:'orderId'},
			{name:'villageName', width:400, jsonmap:'village.villageName', formatter: villageInit},
			{name:'designer', width:60},
			{name:'supervisor', width:60},
			{name:'orderTotalPrice', width:100},
			{name:'discount', width:60},
			{name:'houseArea', width:60},
			{name:'schedule', formatter: constructionUtils.scheduleInit},
			{name:'projectStatus', hidden:true},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		],
		rowList:[5,10,15],
		pager: supervision.gridPager,
		caption: "订单信息列表",
		gridComplete: function(){
			var _postData = $(this).getGridParam("postData");
			var _param = params["supervisionPostData"] ? params["supervisionPostData"] : {};
			
			_param["paging.page"] = _postData["paging.page"];
			_param["paging.rows"] = _postData["paging.rows"];
			
			params["supervisionPostData"] = _param;
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
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewSupervisionDetail(\'' + rowdata.orderId + '\');">查看</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-primary" onclick="viewAddReduceIndex(\'' + rowdata.orderId + '\');">增减项</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier " onclick="viewReworkIndex(\'' + rowdata.orderId + '\');">返工</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	
}

function viewSupervisionDetail(orderId){
	supervisionPostData["constructionSchedule.orderId"] = orderId;
	$("#supervisionPageContent").load(api.index.supervisionDetailIndex.url);
}

function viewAddReduceIndex(orderId){
	supervisionPostData["addReduce.orderId"] = orderId;
	$("#supervisionPageContent").load(api.index.supervisionAddReduceIndex.url);
}

function viewReworkIndex(orderId){
	supervisionPostData["rework.orderId"] = orderId;
	$("#supervisionPageContent").load(api.index.supervisionReworkIndex.url);
}

