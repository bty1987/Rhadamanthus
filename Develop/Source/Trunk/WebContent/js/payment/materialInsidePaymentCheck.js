var materialInsidePaymentCheck = {
	listMaterialPaymentHistoryGrid: null,
	gridMaterialInsidePaymentHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	
	baseModal: null,
	addOrReduceModal:null,
	refundModal:null,
	materialInsidePaymentCheckItems: {},
	
	materialPaymentTypeData: {"1":"预付款", "2":"定金", "3":"补款", "4":"退款"},
	materialPaymentRevTypeData: {"预付款":"1", "定金":"2", "补款":"3", "退款":"4"},
	
	editFlg:false,
	queryUrl:null
	
};

jQuery(function($) {
	materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid = $("#listMaterialInsidePaymentHistoryGrid");
	materialInsidePaymentCheck.gridMaterialInsidePaymentHistoryPager = "#gridMaterialInsidePaymentHistoryPager";
	var searchHistoryOpts = {
		url: api.payment.pageMaterialInsidePaymentForNotInit.url,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid,
		items: [
			{label:"楼盘地址",id:"orderAddrSearch",name:"orderAddr", type:'text'},
			{label:"业务员",id:"salesmanSearch",name:"salesman", type:'text'},
		]
	};
	$("#searchMaterialInsidePaymentHistoryDiv").flSearch(searchHistoryOpts);

	initMaterialInsidePaymentHistoryList();
});

function initMaterialInsidePaymentHistoryList(){
	materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid.jqGrid({		
		url: api.payment.pageMaterialInsidePaymentForNotInit.url,
		colNames:['编号', '客户Id', '客户名', '楼盘名', '收款类型Id', '现金', '刷卡', '刷卡银行', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '收款人', '收款时间', '状态名称', '状态'],
		colModel:[
		    {name:'mipId', hidden:true},
		    {name:'customerId', hidden:true},
			{name:'customerName'},
			{name:'orderAddr'},
			{name:'paymentType',hidden:true},
			{name:'cash'},
			{name:'bank'},
			{name:'bankName', formatter: bankNameInit},
			{name:'checkv'},
			{name:'checkvBankName', formatter: bankNameInit},
			{name:'installment'},
			{name:'installmentBankName', formatter: bankNameInit},
			{name:'accounts'},
			{name:'accountsBankName', formatter: bankNameInit},
			{name:'collectUserName'},
			{name:'collectTime'},
			{name:'paymentStatusName', formatter: paymentStatusInit, unformat:unformatStatus},
			{name:'paymentStatus', hidden:true}
		], 
		sortable:false,
		pager : materialInsidePaymentCheck.gridMaterialInsidePaymentHistoryPager,
		caption: ""
	});

	materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid.navGrid(materialInsidePaymentCheck.gridMaterialInsidePaymentHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialInsidePaymentCheck.gridMaterialInsidePaymentHistoryPager, {
		caption:"导出",
		buttonicon: 'icon-download blue',
		onClickButton: function(){    
			com.showAlert(com.info, "导出");
		},
		position: 'first'
	}).navButtonAdd(materialInsidePaymentCheck.gridMaterialInsidePaymentHistoryPager, {
		caption:"确认",
		buttonicon: 'icon-ok blue',
		onClickButton: function(){
			
			var num = materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid.jqGrid('getGridParam','selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid.attr("id"));
				return false;
			}else{
				bootbox.confirm("确定要将符合条件的所有收款项目，置为已确认状态吗?", function(result) {
					if(result) {
						var _rowIds = materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid.jqGrid('getGridParam','selarrrow');
						var options = {};
						
						for(var i=0;i<_rowIds.length;i++){
							_rowInfo = materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid.jqGrid("getRowData", _rowIds[i]);
							options["mipIds[" + i + "]"] = _rowInfo.mipId;
						}
						
						com.post(api.payment.confirmMaterialInsidePayment, options, function(result){
							com.showAlert(com.info, "确认成功!");
							for(var i=0;i<_rowIds.length;i++){
								materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid.setCell(_rowIds[i], "paymentStatus", 2);
								materialInsidePaymentCheck.listMaterialInsidePaymentHistoryGrid.setCell(_rowIds[i], "paymentStatusName", "已确认");
							}
						}, function(result){
							com.showAlert(com.error, "确认失败!");
						});
					}
				});
			}
		},
		position: 'first'
	});
}

function paymentTypeInit(cellvalue, options, rowdata){
	return '<span class="label label-info">' + materialInsidePaymentCheck.materialPaymentTypeData[rowdata.paymentType];
}

function statusInit(cellvalue, options, rowdata){
	var result = '';
	if(cellvalue==1){
		result += '已确认';
	}else{
		result += '待确认';
	}
	return result;
}

function paymentStatusInit(cellvalue, options, rowdata){
	var result = '';
	if(rowdata.paymentStatus == "1" || rowdata.paymentStatus == 1){
		result += '待确认';
	}else{
		result += '已确认';
	}
	return result;
}

function unformatStatus(cellvalue, options, cell){
	if(cellvalue=="已确认"){
		return 1;
	}else{
		return 0;
	}
}

function bankNameInit(cellvalue, options, rowdata){
	console.log("bankNameInit");
	
	if(cellvalue == ""){
		return "-";
	}else{
		return cellvalue;
	}
}