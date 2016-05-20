var materialSubOrderCollection = {
	listGrid: null,
	gridPager: null,
	
	materialPaymentTypeData: {"1":"预付款", "2":"定金", "3":"补款", "4":"退款", "5":"补款退款", "6":"券退款"},
	materialPaymentRevTypeData: {"预付款":"1", "定金":"2", "补款":"3", "退款":"4", "补款退款":"5", "券退款":"6"},
	
	bankType: {},
	couponType: {},
	accountsType:{},
	
	saveBtn: null,
	cancelBtn: null,
	
	baseModal: null,
	addOrReduceModal: null,
	refundModal: null,
	materialSubOrderCollectionItems: {},
	
	editFlg: false,
	historyFlag: false,
	batchFlag: true,
	
	queryUrl: null,
};

var materialSubOrderCollectionPostData = {};

jQuery(function($) {
	
	materialSubOrderCollection.listGrid = $("#listGrid");
	materialSubOrderCollection.gridPager = "#gridPager";
	
	materialSubOrderCollectionPostData["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
	
	com.post(api.ds.bankType, {}, function(res){
		materialSubOrderCollection.bank = res.bank;
		
		$("#bankName").bindData(res.bank, 'key', 'value');
		$("#checkvBankName").bindData(res.bank, 'key', 'value');
		$("#installmentBankName").bindData(res.bank, 'key', 'value');
		$("#accountsBankName").bindData(res.bank, 'key', 'value');
		$("#refundBankName").bindData(res.bank, 'key', 'value');
	});
	
	com.post(api.ds.materialInfo, {}, function(res){
		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialSubOrderCollection.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialSubOrderCollection.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}
	});
	
	com.post(api.ds.accountType, {"timestamp": new Date().getTime()}, function(res){
		materialSubOrderCollection.accountList = res.accountList;
		$("#accountsBankName").bindData(materialSubOrderCollection.accountList, 'key', 'value');
	});
	
	com.post(api.ds.couponType, {}, function(res){
		materialSubOrderCollection.couponType = res.couponTypes;
		$("#couponType").bindData(res.couponTypes, 'key', 'value');
	});
	
	initMaterialSubOrderCollectionList();
});

function initMaterialSubOrderCollectionList(){
	materialSubOrderCollection.listGrid.jqGrid({		
		url: api.payment.pageMaterialPaymentByMsoId.url,
		postData: materialSubOrderCollectionPostData,
		colNames:['编号', '订单编号', '收款类型', '收款类型Id', '应收款', '现金', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '预付款类型', '优惠券', '券类型', '券信息', '收款人', '收款时间', '状态名称', '状态', '备注', '收款信息'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'mpId', hidden:true},
		    {name:'msoNo'},
		    {name:'paymentTypeName', formatter: paymentTypeInit},
			{name:'paymentType', hidden:true},
			{name:'referMoney'},
			{name:'cash', hidden:true},
			{name:'bank', hidden:true},
			{name:'bankInfo', hidden:true},
			{name:'checkv', hidden:true},
			{name:'checkvBankName', hidden:true},
			{name:'installment', hidden:true},
			{name:'installmentBankName', hidden:true},
			{name:'accounts', hidden:true},
			{name:'accountsBankName', hidden:true},
			{name:'advance', hidden:true},
			{name:'advanceType', hidden:true},
			{name:'coupon', hidden:true},
			{name:'couponType', hidden:true},
			{name:'couponInfo', hidden:true},
			{name:'collectUserName'},
			{name:'collectTime'},
			{name:'paymentStatusName', formatter: paymentStatusInit, unformat: unformatStatus},
			{name:'paymentStatus', hidden:true},
			{name:'des', hidden:true},
			{name:'info', formatter:infoInit},
		], 
		rowNum:20,
		sortable:false,
		pager : materialSubOrderCollection.gridPager,
		caption: "子订单收款信息",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialSubOrderCollectionContent'});
		}
	});

	materialSubOrderCollection.listGrid.navGrid(materialSubOrderCollection.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialSubOrderCollection.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
		},
		position: "first",
	});
}

function paymentTypeInit(cellvalue, options, rowdata){
	return '<span class="label label-info">' + materialSubOrderCollection.materialPaymentTypeData[rowdata.paymentType];
}

function paymentStatusInit(cellvalue, options, rowdata){
	var result = '';
	if(rowdata.paymentStatus == "1" || rowdata.paymentStatus == 1){
		result += '待确认';
	}else if(rowdata.paymentStatus == "0" || rowdata.paymentStatus == 0){
		result += '待收款';
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

function infoInit(cellvalue, options, rowdata){
	
	var info = "";
	
	if(rowdata.cash != "0"){
		info += "现金: " + rowdata.cash + ", ";
	}
	if(rowdata.bank != "0"){
		info += "刷卡: " + rowdata.bank + " " + rowdata.bankInfo + ", ";
	}
	if(rowdata.checkv != "0"){
		info += "转账: " + rowdata.checkv + " " + rowdata.checkvBankName + ", ";
	}
	if(rowdata.installment != "0"){
		info += "分期: " + rowdata.installment + " " + rowdata.installmentBankName + ", ";
	}
	if(rowdata.accounts != "0"){
		info += "对公帐户: " + rowdata.accounts + " " + rowdata.accountsBankName + ", ";
	}
	if(rowdata.advance != "0"){
		info += "预付款: " + rowdata.advance + " " + rowdata.advanceType + ", ";
	}
	if(rowdata.coupon != "0"){
		info += "券: " + rowdata.coupon + " " + rowdata.couponInfo + ", ";
	}
	if(rowdata.des != null && rowdata.des != ""){
		info += "描述: " + rowdata.des + ", ";
	}
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+info.substring(0, info.length-2)+'">信息</span>';
	html += "<input type='text' class='hide' value='"+info.substring(0, info.length-2)+"' />";
	return html;
}