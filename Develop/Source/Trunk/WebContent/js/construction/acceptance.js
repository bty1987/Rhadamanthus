var acceptance = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	acceptanceItems: {},
	
	editFlag: false
};

var acceptancePostData = {};

jQuery(function($) {
	$('#fl-statement').statement("工程验收", "订单信息列表");
	
	acceptance.listGrid = $("#listGrid");
	acceptance.gridPager = "#gridPager";
	acceptance.saveBtn = $("#saveBtn").on("click", saveData);
	acceptance.cancelBtn = $("#cancelBtn");
	
	if(!params["acceptancePostData"]){
		params["acceptancePostData"] = {
			"filters[0].data": "notAcceptanced",
			"filters[0].field": "acceptanceFlag",
			"filters[0].op": "cn",
		};
	}
	
	constructionUtils.createDecorationOrderCondition(acceptance.listGrid, api.construction.pageDecorationOrderForAcceptance.url, "acceptanceSearchDiv", {}, "acceptancePostData", 295);
	
	acceptance.listGrid.jqGrid({
		url: api.construction.pageDecorationOrderForAcceptance.url,
		postData: params["acceptancePostData"],
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
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		],
		pager : acceptance.gridPager,
		caption: "订单信息列表",
		gridComplete: function(){
			var _postData = $(this).getGridParam("postData");
			var _param = params["acceptancePostData"] ? params["acceptancePostData"] : {};
			
			_param["paging.page"] = _postData["paging.page"];
			_param["paging.rows"] = _postData["paging.rows"];
			
			params["acceptancePostData"] = _param;
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
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewAcceptanceDetailIndex(\'' + rowdata.orderId + '\');">验收</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	
}

function viewAcceptanceDetailIndex(orderId){
	acceptancePostData["acceptance.orderId"] = orderId;
	$("#acceptancePageContent").load(api.index.acceptanceDetailIndex.url);
}
