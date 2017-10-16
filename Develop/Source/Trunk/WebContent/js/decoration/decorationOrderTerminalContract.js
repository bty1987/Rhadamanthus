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
	
	order.agreementModal = $("#agreementModal");
	
	var orderSearchOpts = {
		url: api.decoration.pageDecorationOrderForCommon,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: order.listGrid,
		items: [
	        {label:"订单编号", id:"searchOrderId", name:"orderId", type:'text'},
	        {label:"楼盘", id:"searchVillage", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号", id:"searchHouseNum", name:"houseNumber", type:"text"},
	        {label:"客户电话", id:"searchPhone", name:"customerPhone", type:"text"},
	        {label:"面积", id:"searchHouseArea", name:"houseArea", type:"text",op:"eq"},
	        {label:"业务员", id:"searchSalesman", name:"salesman", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":""}},
	        {label:"设计师", id:"searchDesigner", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}}
		]
	};
	$("#orderSearchDiv").flSearch(orderSearchOpts);
	
	com.post(api.ds.decoration, {}, function(res){
		order.houseClass = res.houseClass;
		$("#searchHouseClass").bindData(order.houseClass, 'key', 'value', true);
	});
	
	initDecorationOrderList();
	
});

function initDecorationOrderList(){
	order.listGrid.jqGrid({		
		url: api.decoration.pageDecorationOrderForCommon.url,
		colNames:['订单编号', '楼盘地址', '客户名', '余额','设计部', '设计师', '业务部', '业务员', '面积', '合同报价', '量房时间', '订单状态', '操作','houseNumber','cityP'],
		colModel:[
		    {name:'orderId',width: 80},
			{name:'villageName',jsonmap:'village.villageName',formatter: villageInit,width: 190},
			//{name:'houseClass',width: 50},
			{name:'customerName',jsonmap:'customer.customerName',width: 50},
			{name:'balance',jsonmap:'customer.balance',width: 50},
			{name:'designDepartment',width: 100},
			{name:'designer',width: 50},
			{name:'businessDepartment',width: 100},
			{name:'salesman',width: 50},
			{name:'houseArea',width: 50},
			{name:'orderTotalPrice',width: 50},
			{name:'createTime',width: 100},
			{name:'status',width: 50},
			{name:'action',jsonmap:'status', width: 80, sortable: false, editable: false, formatter: actionInit},
			{name:"houseNumber",hidden:true},
			{name:"cityProperName",jsonmap:"village.cityProper.cityProperName",hidden:true}
		], 
		pager : order.gridPager,
		caption: "装修订单信息列表"
	});

	order.listGrid.navGrid(order.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	result += '<div class="ui-pg-div btn-group">';
	result += '<button type="button" id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="terminalContract('+rowdata.orderId+');">终止合同</button>';
	
	result += '</div>';
	
	return result;
}


function villageInit(cellvalue, options, rowdata){
	
	var html = rowdata.village.cityProper.cityProperName+rowdata.village.villageName + ' '+rowdata.houseNumber;
	return html;
}

function terminalContract(decorationOrderId){
	bootbox.confirm("确认要终止合同吗?",function(res){
	});
}


function modalAgreementModal(decorationOrderId){
	
	contract.decorationOrderId = decorationOrderId;
	
	com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){
		
		var decorationContract = res.decorationContract;
		
		if(decorationContract == null || decorationContract.autoId == null){
			$("#printContractBtn").attr("disabled",true);
		}else{
			$("#printContractBtn").attr("disabled",false).attr('href', '/views/contract/' + decorationContract.templateHtml + "?decorationContract.orderId=" + contract.decorationOrderId);
		}
		
		order.agreementModal.modal("show");
	});
}
function successCallback(){
	order.listGrid.trigger("reloadGrid");
}

function failCallback(){
	
}

function cleanItems(){
	
}
