var decorationActivity = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	orderItems: {},
	
	orderStatus: [],
	businessDepartments:[],
	postParam:{},
	
	editFlag: false
};

var decorationActivityPostData = {};

jQuery(function($) {
	decorationActivity.listGrid = $("#listGrid");
	decorationActivity.gridPager = "#gridPager";
	
	decorationActivity.agreementModal = $("#agreementModal");
	
	decorationUtils.createDecorationOrderCondition(decorationActivity.listGrid, api.decoration.pageDecorationOrderForCommon.url, "orderSearchDiv", {}, "");
	
	initDecorationOrderList();
});

function initDecorationOrderList(){
	decorationActivity.listGrid.jqGrid({		
		url: api.decoration.pageDecorationOrderForCommon.url,
		postData: {},
		colNames:['订单编号', '楼盘地址', '客户名', '设计师', '业务员', '面积', '状态', '操作'], 
		colModel:[
		    {name:'orderId', width: 70},
			{name:'villageName', jsonmap:'village.villageName', formatter: villageInit, width: 150},
			{name:'customerName', jsonmap:'customer.customerName', width: 50},
			{name:'designer'},
			{name:'salesman'},
			{name:'houseArea', width: 50},
			{name:'status', width: 50},
			{name:'action', jsonmap:'status', sortable: false, editable: false, formatter: actionInit},
		], 
		pager : decorationActivity.gridPager,
		caption: "订单信息"
	});

	decorationActivity.listGrid.navGrid(decorationActivity.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	result += '<div class="ui-pg-div btn-group">';
	result += '<button type="button" id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewDecorationActivityItem(\'' + rowdata.orderId + '\');">活动物品</button>';
	result += '</div>';
	
	return result;
}

function villageInit(cellvalue, options, rowdata){
	
	var html = rowdata.village.cityProper.cityProperName+rowdata.village.villageName + ' '+rowdata.houseNumber;
	
	return html;
}

function viewDecorationActivityItem(decorationOrderId){
	
	decorationActivityPostData["decorationOrderId"] = decorationOrderId;
	
	$("#fl-container").load(api.index.decorationActivityItemIndex.url);
}

function successCallback(){
	decorationActivity.listGrid.trigger("reloadGrid");
}

function failCallback(){
	
}

function cleanItems(){
	
}
