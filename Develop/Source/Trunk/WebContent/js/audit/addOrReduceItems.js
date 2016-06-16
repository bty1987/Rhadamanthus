var addOrReduce = {
	decorationOrderId:null,
	initAddOrReduceList: initAddOrReduceList,
	
	typeDict : {"0":"增项", "1":"减项", "2":"漏项"},
	typeList : [{"key":"0","value":"增项"}, {"key":"1","value":"减项"},{"key":"2","value":"漏项"}],
	statusDict : {"0":"未提交", "1":"未付款","2":"已付款","3":"已确认"},
	
	listgrid: null,
	gridPager: null
};

jQuery(function($) {
	
	addOrReduce.decorationOrderId = params.orderId;
	
	addOrReduce.listgrid = $("#listgrid");
	addOrReduce.gridPager = "#gridPager";
	
	initAddOrReduceList();
});

function initAddOrReduceList(){
	
	var searchOpts = {
		url: api.addReduce.pageAddReduceByOrderId,
		postParmas: {"paging.rows":10, "paging.page":1,"addReduce.orderId":addOrReduce.decorationOrderId},
		listgrid: addOrReduce.listgrid,
		items: [
	        {label:"类型", id:"searchAddReduceType", name:"addReduceType", type:"select", op:"eq"}
        ]
	};
	$("#addOrReduceSearchDiv").flSearch(searchOpts);
	$("#searchAddReduceType").bindData(addOrReduce.typeList, 'key', 'value', true);
	
	addOrReduce.listgrid.jqGrid({
		url: api.addReduce.pageAddReduceByOrderId.url,
		postData: {"addReduce.orderId":addOrReduce.decorationOrderId},
		colNames:['id', '说明', '总价', '类别', '状态', '添加时间', '操作','orderPaymentId'],
		colModel:[
		    {name:'arId', hidden:true},
		    {name:'addReduceDes'},
			{name:'addReduceTotal'},
			{name:'addReduceType', formatter: typeFormat},
			{name:'addReduceStatus', formatter: statusFormat},
			{name:'createTime'},
			{name:'action', formatter: actionInit},
			{name:'orderPaymentId',hidden:true}
		], 
		pager : addOrReduce.gridPager,
		caption: "增减项信息列表"
	});
	
	addOrReduce.listgrid.navGrid(addOrReduce.gridPager, {edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}).navButtonAdd(addOrReduce.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.decorationOrderAuditIndex.url);
		},
		position: "first"
	});
}

function statusFormat(cellvalue, options, row){
	return addOrReduce.statusDict[cellvalue];
}
function typeFormat(cellvalue, options, row){
	return addOrReduce.typeDict[cellvalue];
}

function actionInit(cellvalue, options, row){
	var result = '';
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-yellow" onclick="viewDetailAddOrReduce(\''+row.orderPaymentId+'\', \''+row.orderId+'\');">查看</button>';
	
	if(row.addReduceType == 0 && row.addReduceStatus != 2){
		result += '<button class="btn btn-minier btn-danger" onclick="addReduceTypeModify('+row.arId+', 2);">漏项</button>';
	}else if(row.addReduceType == 2){
		result += '<button class="btn btn-minier btn-danger" onclick="addReduceTypeModify('+row.arId+', 0);">增项</button>';
	}
	result += '</div>';
	
	return result;
}

function addReduceTypeModify(id, type){
	com.post(api.addReduce.updateAddReduce, {"addReduce.arId":id, "addReduce.addReduceType": type},function(res){
		$.jgrid.refreshGrid(addOrReduce.listgrid, {"addReduce.orderId":addOrReduce.decorationOrderId});
	});
}

function viewDetailAddOrReduce(orderPaymentId, orderId){
	addOrReduce.orderPaymentId = orderPaymentId;
	
	$("#addOrReduceDetailModal").modal("show");
	
	com.post(api.audit.queryBudgetAuditItemByOrderId, {"orderAudit.orderId":orderId}, function(res){
		addOrReduce.discount = res.quotation.discount;
		initAddOrReduceDetailListGrid();
	});
}

function initAddOrReduceDetailListGrid(){
	
	$("#addOrReduceItemDiv").html("");
	$("#addOrReduceItemDiv").html('<table id="addOrReduceItemList"></table> <div id="addOrReduceItemListGridPager"></div> '); 
	
	$("#addOrReduceItemList").jqGrid({	
		url: api.decoration.pageAddOrReduceItemByPaymentId.url,
		postData: {'addReduce.orderPaymentId':addOrReduce.orderPaymentId},
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:[ '名称' , '功能区', '单位' , '单价','数量', '总价','arId','itemType'],
		colModel:[
			{name:"itemName"},
			{name:"quotationFunctionAreaName"},
			{name:"measurementUnit"},
			{name:"discountUnitPrice",formatter:discountUnitPriceFormatter},
			{name:"num"},
			{name:"sumMoney",formatter:sumMoneyFormatter},
			{name:"arId",hidden:true},
			{name:"itemType",hidden:true}
		],
		grouping: true,
	   	groupingView : {
	   		groupField : ['quotationFunctionAreaName'],
	   		groupColumnShow : [true],
	   		groupText : ['<b>{0}</b>'],
	   		groupCollapse : false,
			groupOrder: ['asc'],
			groupSummary : [false],
			showSummaryOnHide: false,
			groupDataSorted : false
	   	},
		autowidth:false,
		width:'535',
		pager : "#addOrReduceItemListGridPager",
		caption: ""
	});
}

function discountUnitPriceFormatter(cellvalue, options, rowObject){
	// 0 增项 1 减项 2 漏项 
	// 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
	// 增项漏项不打折 系统定义报价项目不打折
	if(rowObject.itemType != '3'){ // 打折
		return Math.round(parseFloat(rowObject.unitPrice)*parseFloat(addOrReduce.discount)/10*100)/100;
	}else{
		return Math.round(parseFloat(rowObject.unitPrice)*100)/100; // 不打折
	}
}
function sumMoneyFormatter(cellvalue, options, rowObject){
	if(rowObject.itemType != '3'){
		return  Math.round(parseFloat(rowObject.unitPrice)*parseFloat(addOrReduce.discount)*parseFloat(rowObject.num)/10*100)/100;
	}else {
		return Math.round(parseFloat(rowObject.unitPrice)*parseFloat(rowObject.num)*100)/100;//不打折
	}
}
