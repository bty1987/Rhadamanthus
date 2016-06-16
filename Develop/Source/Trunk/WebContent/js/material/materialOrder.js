var materialOrder = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderItems: {},
	
	msoId: null,
	saleType: null,
	
	editFlag: false
};

var materialOrderPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材订单", "订单信息列表");
	
	materialOrder.listGrid = $("#listGrid");
	materialOrder.gridPager = "#gridPager";
	materialOrder.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrder.cancelBtn = $("#cancelBtn");
	
	var materialOrderSearchOpts = {
		url: api.decoration.pageDecorationOrderForMaterial,
		postDataName: "materialOrderPostData",
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialOrder.listGrid,
		items: [
	        {label:"订单号", id:"orderId", name:"orderId", type:"text", op:"eq"},
	        {label:"楼盘地址", id:"village", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号", id:"houseNum",name:"houseNumber",type:"text"},
	        {label:"联系方式", id:"phone", name:"customerPhone", type:"text"},
	        {label:"设计师", id:"designer", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
	        {label:"业务员", id:"salesman", name:"salesman", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"业务员"}},
		]
	};
	$("#materialOrderSearchDiv").flSearch(materialOrderSearchOpts);
	
	materialOrder.listGrid.jqGrid({
		url: api.decoration.pageDecorationOrderForMaterial.url,
		postData: params["materialOrderPostData"],
		colNames:['编号', '楼盘名', '楼盘名', '客户Id', '客户名', '设计部门', '设计师', '设计师', '监理', '面积', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'orderId'},
		    {name:"villageName", jsonmap:'village.villageName', hidden:true},
			{name:'houseNumber', width:300},
			{name:'customerId', jsonmap:'customer.customerId', hidden:true},
			{name:'customerName', jsonmap:'customer.customerName'},
			{name:'designDepartment'},
			{name:'designerId', hidden:true},
			{name:'designer'},
			{name:'supervisor'},
			{name:'houseArea'},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		pager : materialOrder.gridPager,
		caption: "订单信息列表"
	});
});

function saveData(){
	
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewMaterialSubOrderIndex(\'' + rowdata.orderId + '\', \'' + rowdata.customer.customerId + '\', \'' + rowdata.customer.customerName + '\', \'' + rowdata.houseNumber + '\', \'' + rowdata.designerId + '\', \'' + rowdata.designer + '\');">子订单</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-primary" onclick="viewMaterialSaleOrderIndex(\'' + rowdata.orderId + '\', \'' + rowdata.customer.customerId + '\', \'' + rowdata.customer.customerName + '\', \'' + rowdata.houseNumber + '\', \'' + rowdata.designerId + '\', \'' + rowdata.designer + '\');">销售订单</button>';
	
	result += '</div>';
	
	return result;
}

function viewMaterialSubOrderIndex(orderId, customerId, customerName, orderAddr, designerId, designerName){
	materialOrderPostData["materialOrder.orderId"] = orderId;
	materialOrderPostData["materialOrder.customerId"] = customerId;
	materialOrderPostData["materialOrder.customerName"] = customerName;
	materialOrderPostData["materialOrder.orderAddr"] = orderAddr;
	materialOrderPostData["materialOrder.designerId"] = designerId;
	materialOrderPostData["materialOrder.designerName"] = designerName;
	
	$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
}

function viewMaterialSaleOrderIndex(orderId, customerId, customerName, orderAddr, designerId, designerName){
	materialOrderPostData["materialOrder.orderId"] = orderId;
	materialOrderPostData["materialOrder.customerId"] = customerId;
	materialOrderPostData["materialOrder.customerName"] = customerName;
	materialOrderPostData["materialOrder.orderAddr"] = orderAddr;
	materialOrderPostData["materialOrder.designerId"] = designerId;
	materialOrderPostData["materialOrder.designerName"] = designerName;
	
	materialOrder.saleType = "sale";
	
	$("#materialOrderPageContent").load(api.index.materialSaleOrderIndex.url);
}
