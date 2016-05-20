var order = {
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

jQuery(function($) {
	order.listGrid = $("#listGrid");
	order.gridPager = "#gridPager";
	
	var orderSearchOpts = {
		url: api.decoration.pageDecorationOrderForBelong,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: order.listGrid,
		items: [
	        {label:"订单编号", id:"searchOrderId", name:"orderId", type:'text'},
	        {label:"楼盘", id:"searchVillage", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号", id:"searchHouseNum", name:"houseNumber", type:"text"},
	        {label:"客户电话", id:"searchPhone", name:"customerPhone", type:"text"},
	        {label:"面积", id:"searchHouseArea", name:"houseArea", type:"text", op:"eq"},
	        {label:"业务员", id:"searchSalesman", name:"salesman", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":""}},
	        {label:"设计师", id:"searchDesigner", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}}
	    ]
	};
	$("#orderSearchDiv").flSearch(orderSearchOpts);
	
	initDecorationOrderList();
});

//---------------------------------------------------------------------------init begin ---------------------------------------------------------

function initDecorationOrderList(){
	order.listGrid.jqGrid({		
		url: api.decoration.pageDecorationOrderForBelong.url,
		postData: {"filters[0].field":"orderId","filters[0].op":"eq","filters[0].data":"null"},
		colNames:['订单编号', '楼盘地址', '客户名', '设计部', '设计师', '业务部', '业务员', '面积', '合同报价', '量房时间', '订单状态', 'desigerChangeApproval','salesmanChangeApproval','操作','houseNumber','cityP'],
		colModel:[
		    {name:'orderId',width: 80},
			{name:'villageName',jsonmap:'village.villageName',formatter: villageInit,width: 210},
			{name:'customerName',jsonmap:'customer.customerName',width: 50},
			{name:'designDepartment',width: 100},
			{name:'designer',width: 50},
			{name:'businessDepartment',width: 100},
			{name:'salesman',width: 50},
			{name:'houseArea',width: 50},
			{name:'orderTotalPrice',width: 50},
			{name:'createTime',width: 80},
			{name:'status',width: 50},
			{name:'desigerChangeApproval',hidden:true},
			{name:"salesmanChangeApproval",hidden:true},
			{name:'action',jsonmap:'status', width: 180, sortable: false, editable: false, formatter: actionInit, width: 80},
			{name:"houseNumber",hidden:true},
			{name:"cityProperName",jsonmap:"village.cityProper.cityProperName",hidden:true}
		], 
		pager : order.gridPager,
		caption: "装修订单信息列表"
	});

	order.listGrid.navGrid(order.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}, $.jgrid.searchFunc($(this))
	);
}
function villageInit(cellvalue, options, rowdata){
	
	var html = rowdata.village.cityProper.cityProperName+rowdata.village.villageName + ' '+rowdata.houseNumber;
	return html;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	result += '<div class="ui-pg-div btn-group">';
	result += '<button  type="button" class="btn btn-minier btn-success" onclick="viewDecorationOrderBelongDetail('+rowdata.orderId+');">查看归属</button>';
	result += '<button type="button"  class="btn btn-minier btn-yellow" onclick="changeDecorationOrderBelongDesigner('+rowdata.orderId+');">归属设计</button>';
	result += '<button  type="button" class="btn btn-minier btn-primary" onclick="changeDecorationOrderBelongBussiness('+rowdata.orderId+');">归属业务</button>';
	
	result += '</div>';
	
	return result;
}

function viewDecorationOrderBelongDetail(decorationOrderId){
	$("#fl-container").load(api.index.decorationOrderBelongInfoViewIndex.url, {}, function(){
		params["orderId"] = decorationOrderId;
	});
}

function changeDecorationOrderBelongDesigner(decorationOrderId){
	$("#fl-container").load(api.index.decorationOrderBelongDetailIndex.url, {}, function(){
		params["orderId"] = decorationOrderId;
		params["orderBelongType"] = "设计";
	});
}

function changeDecorationOrderBelongBussiness(decorationOrderId){
	$("#fl-container").load(api.index.decorationOrderBelongDetailIndex.url, {}, function(){
		params["orderId"] = decorationOrderId;
		params["orderBelongType"] = "业务";
	});
}

function successCallback(){
	order.listGrid.trigger("reloadGrid");
}

function failCallback(){
	
}

function cleanItems(){
	
}
