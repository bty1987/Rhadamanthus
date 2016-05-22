var budgetOrder = {
	listgrid: null,
	gridPager: null,
	postParam: {"paging.rows":10, "paging.page":1, "flag": 1},
	items: {},
};

jQuery(function($) {
	budgetOrder.listgrid = $("#listgrid");
	budgetOrder.gridPager = "#gridPager";
	
	var orderSearchOpts = {
		url: api.decoration.pageDecorationOrderForPutline,
		postParmas: budgetOrder.postParam,
		listgrid: budgetOrder.listgrid,
		items: [
	        {label:"订单编号", id:"searchOrder", name:"orderId", type:"text"},
	        {label:"设计分区", id:"searchDesignRegion", name:"userDesignRegion", type:"select"},
	        {label:"设计部", id:"searchDesignDept", name:"designDepartmentId", type:"select"},
	        {label:"设计师", id:"searchDesigner", name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
	        {label:"监理", id:"searchSupervisor", name:"supervisor",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"监理"}},
	        {label:"放线时间", id:"putlineTimeRangeSearch", name:"putlineTimeDateRange", type:"dateRangePicker"}
		]
	};
	$("#orderSearchDiv").flSearch(orderSearchOpts);
	
	com.post(api.department.queryDepartment, {"dept.type": "设计大区"}, function(res){
		$("#searchDesignRegion").bindData(res.deptList, 'deptId', 'deptName', true);
	});
	
	com.post(api.department.queryDepartment, {"dept.type": "设计部"}, function(res){
		$("#searchDesignDept").bindData(res.deptList, 'deptId', 'deptName', true);
	});
	
	initDecorationOrderList();
	
});
	
function initDecorationOrderList(){
	budgetOrder.listgrid.jqGrid({		
		url: api.decoration.pageDecorationOrderForPutline.url,
		postData: budgetOrder.postParam,
		colNames:['订单编号', '设计大区', '设计部', '设计师', '业务部', '业务员', '监理', '面积', '合同报价', '量房时间', '订单状态', '操作','houseNumber'],
		colModel:[
		    {name:'orderId'},
		    {name:'designRegion'},
			{name:'designDepartment'},
			{name:'designer'},
			{name:'businessDepartment'},
			{name:'salesman'},
			{name:'supervisor'},
			{name:'houseArea'},
			{name:'orderTotalPrice'},
			{name:'createTime'},
			{name:'status'},
			{name:'action',jsonmap:'status', width: 180, sortable: false, editable: false, formatter: actionInit},
			{name:"houseNumber",hidden:true}
		], 
		pager : budgetOrder.gridPager,
		caption: "装修订单信息列表"
	});
}
function villageInit(cellvalue, options, row){
	
	return row.village.villageName + ' '+row.houseNumber;
}

function actionInit(cellvalue, options, row){
	var result = '';
	result += '<div class="ui-pg-div btn-group">';
	result += '<button type="button" id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewDetail('+row.orderId+');">查看</button>';
	result += '<button type="button" class="btn btn-minier btn-purple" onclick="viewAddOrReduceIndex('+row.orderId+');">增减项</button>';
	result += '<button type="button" class="btn btn-minier btn-primary" onclick="budgetAuditIndex('+row.orderId+');">审计</button>';
	result += '<button type="button" class="btn btn-minier btn-danger" onclick="chargebackIndex('+row.orderId+');">扣款</button>';
	result += '</div>';
	
	return result;
}

function viewDetail(orderId){
	$("#fl-container").load(api.index.decorationOrderDetailAuditIndex.url, {}, function(){
		params["orderId"] = orderId;
	});
}

function viewAddOrReduceIndex(orderId){
	$("#fl-container").load(api.index.budgetAddOrReduceItemIndex.url, {}, function(){
		params["orderId"] = orderId;
	});
}

function budgetAuditIndex(orderId){
	$("#fl-container").load(api.index.auditIndex.url, {}, function(){
		params["orderId"] = orderId;
	});
}

function chargebackIndex(orderId){
	$("#fl-container").load(api.index.chargebackIndex.url, {}, function(){
		params["orderId"] = orderId;
		
		chargeback.orderId = orderId;
		chargeback.initChargebackList();
	});
}
