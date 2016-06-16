var materialPaymentCheck = {
	
	listMaterialPaymentGrid: null,
	gridMaterialPaymentPager: null,
	
	listMaterialPaymentHistoryGrid: null,
	gridMaterialPaymentHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	
	baseModal: null,
	addOrReduceModal:null,
	refundModal:null,
	materialPaymentCheckItems: {},
	
	materialPaymentTypeData: {},
	materialPaymentRevTypeData: {},
	
	ouponType: {},
	
	editFlg:false,
	queryUrl:null
	
};

jQuery(function($) {
	materialPaymentCheck.listMaterialPaymentGrid = $("#listMaterialPaymentGrid");
	materialPaymentCheck.gridMaterialPaymentPager = "#gridMaterialPaymentPager";
	
	materialPaymentCheck.listMaterialPaymentHistoryGrid = $("#listMaterialPaymentHistoryGrid");
	materialPaymentCheck.gridMaterialPaymentHistoryPager = "#gridMaterialPaymentHistoryPager";
	
	com.post(api.ds.bankType, {}, function(res){
		materialPaymentCheck.cashInfo = res.cashInfo;
		materialPaymentCheck.bankInfo = res.bankInfo;
		materialPaymentCheck.checkBankInfo = res.checkBankInfo;
		materialPaymentCheck.accountsInfo = res.accountsInfo;
	});
	
	com.post(api.ds.materialInfo, {}, function(res){
		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialPaymentCheck.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialPaymentCheck.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}
	});
	
	var searchOpts = {
		url: api.payment.pageMaterialPaymentForCollectBySubOrder,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialPaymentCheck.listMaterialPaymentGrid,
		items: [
			{label:"装修订单号", id:"orderIdSearch", name:"orderId", type:'text', op:"eq"},
			{label:"主材订单号", id:"orderIdSearch", name:"msoNo", type:'text', op:"eq"},
			{label:"楼盘地址", id:"orderAddrSearch", name:"orderAddr", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"设计师", id:"designerNameSearch", name:"salesmanName", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
			{label:"业务员", id:"salesmanNameSearch", name:"salesmanName", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":""}},
			{label:"收款时间", id:"collectTimeDateRange", name:"collectTime", type:"dateRangePicker", op:"between"},
		]
	};
	$("#searchMaterialPaymentDiv").flSearch(searchOpts);
	
	var searchHisroryOpts = {
			url: api.payment.pageMaterialPaymentForConfirmBySubOrder.url,
			postParmas: {"paging.rows":10, "paging.page":1},
			listgrid: materialPaymentCheck.listMaterialPaymentHistoryGrid,
			items: [
				{label:"装修订单号", id:"orderIdSearch", name:"orderId", type:'text', op:"eq"},
				{label:"主材订单号", id:"orderIdSearch", name:"msoNo", type:'text', op:"eq"},
				{label:"楼盘地址", id:"orderAddrSearch", name:"orderAddr", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
				{label:"设计师", id:"designerNameSearch", name:"salesmanName", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
				{label:"业务员", id:"salesmanNameSearch", name:"salesmanName", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":""}},
			]
	};
	$("#searchMaterialPaymentHistoryDiv").flSearch(searchHisroryOpts);
	
	com.post(api.ds.couponType, {}, function(res){
		materialPaymentCheck.couponType = res.couponTypes;
		$("#couponType").bindData(res.couponTypes, 'key', 'value');
	});

	initMaterialPaymentList();
	initMaterialPaymentHistoryList();
	
	$("#materialPaymentHistoryList").removeClass("active");
});

function initMaterialPaymentList(){
	materialPaymentCheck.listMaterialPaymentGrid.jqGrid({		
		url: api.payment.pageMaterialPaymentForCollectBySubOrder.url,
		multiboxonly: true,
		forceFit: false,
		colNames:['编号', '订单编号', '主材编号', '收款类型', '楼盘名', '客户名', '收款类型Id', '应收款', '品牌', '现金', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '预付款类型', '优惠券', '券类型', '收款人', '收款时间', '状态名称', '状态', '收款信息'],
		colModel:[
		    {name:'mpId', hidden:true},
		    {name:'orderId'},
		    {name:'msoNo'},
		    {name:'paymentTypeName', formatter: paymentTypeInit},
		    {name:'orderAddr', width:300},
			{name:'customerName'},
			{name:'paymentType',hidden:true},
			{name:'referMoney', width:80},
			{name:'materialBrand', width:80},
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
			{name:'couponInfo', hidden:true},
			{name:'collectUserName'},
			{name:'collectTime'},
			{name:'paymentStatusName', formatter: paymentStatusInit, unformat:unformatStatus},
			{name:'paymentStatus', hidden:true},
			{name:'info', formatter:paymentInfoInit},
		], 
		sortable:false,
		pager : materialPaymentCheck.gridMaterialPaymentPager,
		caption: "",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialPaymentContent'});
		}
	});

	materialPaymentCheck.listMaterialPaymentGrid.navGrid(materialPaymentCheck.gridMaterialPaymentPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialPaymentCheck.gridMaterialPaymentPager, { //edit
		caption:"确认",
		title: "确认收款",
		buttonicon: 'icon-ok blue',
		onClickButton: function(){
			
			var num = materialPaymentCheck.listMaterialPaymentGrid.jqGrid('getGridParam','selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(materialPaymentCheck.listMaterialPaymentGrid.attr("id"));
				return false;
			}else{
				bootbox.confirm("确定要将符合条件的所有收款项目，置为已确认状态吗?", function(result) {
					if(result) {
						var _rowIds = materialPaymentCheck.listMaterialPaymentGrid.jqGrid('getGridParam','selarrrow');
						var options = {};
						
						for(var i=0;i<_rowIds.length;i++){
							_rowInfo = materialPaymentCheck.listMaterialPaymentGrid.jqGrid("getRowData", _rowIds[i]);
							options["mpIds[" + i + "]"] = _rowInfo.mpId;
						}
						
						com.post(api.payment.confirmMaterialPayment, options, function(result){
							com.showAlert(com.info, "确认成功!");
							for(var i=0;i<_rowIds.length;i++){
								materialPaymentCheck.listMaterialPaymentGrid.setCell(_rowIds[i], "paymentStatus", 2);
								materialPaymentCheck.listMaterialPaymentGrid.setCell(_rowIds[i], "paymentStatusName", "已确认");
							}
						});
					}
				});
			}
		},
		position: 'first'
	});
}

function initMaterialPaymentHistoryList(){
	materialPaymentCheck.listMaterialPaymentHistoryGrid.jqGrid({		
		url: api.payment.pageMaterialPaymentForConfirmBySubOrder.url,
		colNames:['编号', '订单编号', '主材编号', '收款类型', '楼盘名', '客户名', '收款类型Id', '应收款', '品牌', '现金', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '预付款类型', '优惠券', '券类型', '收款人', '收款时间', '确认人', '确认时间', '状态名称', '状态', '收款信息'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'mpId', hidden:true},
		    {name:'orderId'},
		    {name:'msoNo'},
		    {name:'paymentTypeName', width:100, formatter: paymentTypeInit},
		    {name:'orderAddr', width:300},
			{name:'customerName', width:80},
			{name:'paymentType',hidden:true},
			{name:'referMoney', width:80},
			{name:'materialBrand', width:80},
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
			{name:'couponInfo', hidden:true},
			{name:'collectUserName', width:80},
			{name:'collectTime'},
			{name:'confirmUserName', width:80},
			{name:'confirmTime'},
			{name:'paymentStatusName', width:80, formatter: paymentStatusInit, unformat:unformatStatus},
			{name:'paymentStatus', hidden:true},
			{name:'info', formatter:paymentInfoInit},
		], 
		sortable:false,
		pager : materialPaymentCheck.gridMaterialPaymentHistoryPager,
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialPaymentContent'});
		}
	});

	materialPaymentCheck.listMaterialPaymentHistoryGrid.navGrid(materialPaymentCheck.gridMaterialPaymentHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function paymentTypeInit(cellvalue, options, rowdata){
	return '<span class="label label-info">' + materialPaymentCheck.materialPaymentTypeData[rowdata.paymentType];
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

function paymentInfoInit(cellvalue, options, rowdata){
	
	var info = "";
	
	if(rowdata.cash != null && rowdata.cash != "0"){
		info += "现金: " + rowdata.cash + " " + materialPaymentCheck.cashInfo[rowdata.cashInfo] + ", ";
	}
	if(rowdata.bank != null && rowdata.bank != "0"){
		
		info += "刷卡: " + rowdata.bank + " ";
		
		var _s = rowdata.bankInfo.split('#');
		
		for(var i=1;i<_s.length-1;i++){
			
			var _i = _s[i].split('|');
			
			info += materialPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
		}
	}
	if(rowdata.checkv != null && rowdata.checkv != "0"){
		info += "转账: " + rowdata.checkv + " " + materialPaymentCheck.checkBankInfo[rowdata.checkvBankName] + ", ";
	}
	if(rowdata.installment != null && rowdata.installment != "0"){
		info += "分期: " + rowdata.installment + " " + materialPaymentCheck.bankInfo[rowdata.installmentBankName] + ", ";
	}
	if(rowdata.accounts != null && rowdata.accounts != "0"){
		info += "对公帐户: " + rowdata.accounts + " " + materialPaymentCheck.accountsInfo[rowdata.accountsBankName] + ", ";
	}
	if(rowdata.advance != null && rowdata.advance != "0"){
		info += "预付款: " + rowdata.advance + ", ";
	}
	if(rowdata.coupon != null && rowdata.coupon != "0"){
		info += "券: " + rowdata.coupon + " " + rowdata.couponInfo + ", ";
	}
	if(rowdata.des != null && rowdata.des != ""){
		info += "描述: " + rowdata.des + ", ";
	}
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+info.substring(0, info.length-2)+'">信息</span>';
	html += "<input type='text' class='hide' value='"+info.substring(0, info.length-2)+"' />";
	return html;
}

function unformatStatus(cellvalue, options, cell){
	if(cellvalue=="已确认"){
		return 1;
	}else{
		return 0;
	}
}

function bankNameInit(cellvalue, options, rowdata){
	if(cellvalue == ""){
		return "-";
	}else{
		return cellvalue;
	}
}