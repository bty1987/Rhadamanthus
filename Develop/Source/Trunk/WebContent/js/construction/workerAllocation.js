var workerAllocation = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	workerAllocationItems: {},
	
	editFlag: false
};

var workerAllocationPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("监理控制", "订单信息列表");
	
	workerAllocation.listGrid = $("#listGrid");
	workerAllocation.gridPager = "#gridPager";
	workerAllocation.saveBtn = $("#saveBtn").on("click", saveData);
	workerAllocation.cancelBtn = $("#cancelBtn");
	
	constructionUtils.createDecorationOrderCondition(workerAllocation.listGrid, api.construction.pageDecorationOrderForSupervisionByUserId.url, "searchDiv", {}, "workerAllocationPostData", 75);
	
	workerAllocation.listGrid.jqGrid({		
		url: api.construction.pageDecorationOrderForSupervisionByUserId.url,
		postData: params["workerAllocationPostData"],
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
		pager : workerAllocation.gridPager,
		caption: "订单信息列表",
		gridComplete: function(){
			var _postData = $(this).getGridParam("postData");
			var _param = params["workerAllocationPostData"] ? params["workerAllocationPostData"] : {};
			
			_param["paging.page"] = _postData["paging.page"];
			_param["paging.rows"] = _postData["paging.rows"];
			
			params["workerAllocationPostData"] = _param;
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
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewworkerAllocationDetail(\'' + rowdata.orderId + '\');">查看</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	
}

function viewworkerAllocationDetail(orderId){
	workerAllocationPostData["constructionSchedule.orderId"] = orderId;
	$("#workerAllocationPageContent").load(api.index.workerAllocationDetailIndex.url);
}

