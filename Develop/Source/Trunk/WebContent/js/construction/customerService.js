var customerService = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	customerServiceItems: {},
	
	editFlag: false
};

var customerServicePostData = {};

jQuery(function($) {
	$('#fl-statement').statement("客服控制", "订单信息列表");
	
	customerService.listGrid = $("#listGrid");
	customerService.gridPager = "#gridPager";
	customerService.saveBtn = $("#saveBtn").on("click", saveData);
	customerService.cancelBtn = $("#cancelBtn");
	
	constructionUtils.createDecorationOrderCondition(customerService.listGrid, api.construction.pageDecorationOrderForConstructionSchedule.url, "customerServiceSearchDiv", {}, "customerServicePostData", 79);
	
	customerService.listGrid.jqGrid({		
		url: api.construction.pageDecorationOrderForConstructionSchedule.url,
		postData: params["customerServicePostData"],
		colNames:['编号', '楼盘名', '客户电话', '设计部门', '设计师', '监理', '总价', '折扣', '面积', '进度', '工程状态', '操作'],
		colModel:[
		    {name:'orderId'},
			{name:'villageName', width:300, jsonmap:'village.villageName', formatter: villageInit},
			{name:'customerPhone', jsonmap:'customer.phone'},
			{name:'designDepartment'},
			{name:'designer', width:80},
			{name:'supervisor', width:80},
			{name:'orderTotalPrice', width:80},
			{name:'discount', width:80},
			{name:'houseArea', width:80},
			{name:'schedule', formatter: constructionUtils.scheduleInit},
			{name:'projectStatus', hidden:true},
			{name:'action', width: 200, sortable: false, editable: false, formatter: actionInit}
		],
		pager : customerService.gridPager,
		caption: "订单信息列表",
		gridComplete: function(){
			var _postData = $(this).getGridParam("postData");
			var _param = params["customerServicePostData"] ? params["customerServicePostData"] : {};
			
			_param["paging.page"] = _postData["paging.page"];
			_param["paging.rows"] = _postData["paging.rows"];
			
			params["customerServicePostData"] = _param;
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
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewCustomerServiceDetailIndex(\'' + rowdata.orderId  + '\');">查看</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-success" onclick="viewCustomerServiceComplaintIndex(\'' + rowdata.orderId + '\', \'' + rowdata.customer.customerName + '\');">投诉</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier " onclick="viewCustomerServiceGuaranteeIndex(\'' + rowdata.orderId + '\', \'' + rowdata.customer.customerName + '\');">保修</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-danger" onclick="viewCustomerServiceBackVisitIndex(\'' + rowdata.orderId + '\', \'' + rowdata.village.villageName + '\', \'' + rowdata.customer.customerName + '\');">回访</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	
}

function viewCustomerServiceDetailIndex(orderId){
	customerServicePostData["constructionSchedule.orderId"] = orderId;
	$("#customerServicePageContent").load(api.index.customerServiceDetailIndex.url);
}

function viewCustomerServiceComplaintIndex(orderId, customerName){
	customerServicePostData["customerServiceComplaint.orderId"] = orderId;
	customerServicePostData["customerServiceComplaint.customerName"] = customerName;
	$("#customerServicePageContent").load(api.index.customerServiceComplaintIndex.url);
}

function viewCustomerServiceGuaranteeIndex(orderId, customerName){
	customerServicePostData["customerServiceGuarantee.orderId"] = orderId;
	customerServicePostData["customerServiceGuarantee.customerName"] = customerName;
	$("#customerServicePageContent").load(api.index.customerServiceGuaranteeIndex.url);
}

function viewCustomerServiceBackVisitIndex(orderId, orderAddr, customerName){
	customerServicePostData["customerServiceBackVisit.orderId"] = orderId;
	customerServicePostData["customerServiceBackVisit.orderAddr"] = orderAddr;
	customerServicePostData["customerServiceBackVisit.customerName"] = customerName;
	$("#customerServicePageContent").load(api.index.customerServiceBackVisitIndex.url);
}
