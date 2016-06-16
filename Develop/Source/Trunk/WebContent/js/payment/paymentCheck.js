var paymentCheck = {
	listgrid: null,
	gridPager: null,
	postParams: {"paging.rows":10, "paging.page":1},
};

jQuery(function($) {
	
	paymentCheck.listgrid = $("#listgrid");
	paymentCheck.gridPager = "#gridPager";
	
	com.post(api.ds.bankType, {}, function(res){
		
		paymentCheck.cashInfo = res.cashInfo;
		paymentCheck.bankInfo = res.bankInfo;
		paymentCheck.checkBankInfo = res.checkBankInfo;
		paymentCheck.accountsInfo = res.accountsInfo;
	});
	
	var searchOpts = {
		url: api.payment.pagePaymentForHistory,
		postParmas: paymentCheck.postParams,
		listgrid: paymentCheck.listgrid,
		items: [
	        {label:"客户编号",id:"customerIdSearch", name:'customerId', type:'text'}, 
	        {label:"客户姓名", id:"customerNameSearch", name:"customerName", type:'autoFillPinyinText', url:api.data.queryCustomerForName},
	        {label:"客户电话", id:"phoneSearch", name:"customerPhone", type:"text"},
	        {label:"收款时间", id:"dateRangeSearch", name:"collectTimeDateRange",type:"dateRangePicker"}
	    ]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	initializeListgrid();
});

function initializeListgrid(){
	paymentCheck.listgrid.jqGrid({		
		url: api.payment.pagePaymentForHistory.url,
		postData: paymentCheck.postParams,
		colNames:['预付款编号', '客户ID', '客户编号', '客户名称', '收款类型', '预付款类型', '操作金额', '当前余额', '现金', '刷卡金额', '刷卡银行', '转账金额', '转账银行', '分期金额', '分期银行', '对公金额', '对公银行', '收款人', '收款时间', '状态', '描述', "转换款", '信息'],
		colModel:[
		    {name:'paymentId', hidden:true},
		    {name:'customerIdDB', jsonmap:"customer.id", hidden: true},
		    {name:'customerId', jsonmap:"customer.customerId", formatter: formatCustomerId},
		    {name:'customerName', jsonmap: "customer.customerName"},
		    {name:'type'},
		    {name:'paymentType'},
		    {name:"recharge"},
			{name:'balance'},
			{name:'cash', hidden:true},
			{name:'bank', hidden:true},
			{name:'bankInfo', hidden:true},
			{name:'checkv', hidden:true},
			{name:'checkvBankName', hidden:true},
			{name:'installment', hidden:true},
			{name:'installmentBankName', hidden:true},
			{name:'accounts', hidden:true},
			{name:'accountsBankName', hidden:true},
			{name:'collectUserName',jsonmap:"collectUser.userName"},
			{name:'collectTime', width: 250},
			{name:'status'},
			{name:'des', hidden:true},
			{name:"recharge", hidden:true},
			{name:'info', formatter:paymentInfoInit},
		], 
		rowNum:10,
		pager : paymentCheck.gridPager,
		caption: "预付款确认信息列表",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#paymentCheck'});
		}
	});
	
	paymentCheck.listgrid.navGrid(paymentCheck.gridPager, {edit: false, add: false, del: false, search: false, refresh: false, view: false}, 
		{}, {}, {}
	).navButtonAdd(paymentCheck.gridPager, {
		title:"确认",
		caption: "",
		buttonicon: 'icon-ok blue',
		onClickButton: function(){    
			var nums = paymentCheck.listgrid.jqGrid("getGridParam","selarrrow");
			if(nums == null || nums.length==0){
				$.jgrid.showSelectInfo(paymentCheck.listgrid.attr("id"));
				return;
			}
			bootbox.confirm("确定要将符合条件的所有收款项目，置为已确认状态吗?", function(result) {
				if(result) {
					var options = {'status': '已确认'};
					for(var i = 0; i< nums.length; i++){
						var row = paymentCheck.listgrid.jqGrid("getRowData", nums[i]);
						options["paymentIds["+i+"]"] = row.paymentId;
					}	
					com.post(api.payment.confirmPayment, options, successCallback);
				}
			});
		},
		position: 'first'
	});
};

function formatCustomerId(cellValue, options, row){
	return utils.padLeft(cellValue, 9);
}

function paymentInfoInit(cellvalue, options, rowdata){
	
	var info = "";
	
	if(rowdata.recharge != null && rowdata.recharge != "0"){
		info += "转换款: " + rowdata.recharge + ", ";
	}
	if(rowdata.cash != null && rowdata.cash != "0"){
		info += "现金: " + rowdata.cash + " " + paymentCheck.cashInfo[rowdata.cashInfo] + ", ";
	}
	if(rowdata.bank != null && rowdata.bank != "0"){
		
		info += "刷卡: " + rowdata.bank + " ";
		
		var _s = rowdata.bankInfo.split('#');
		
		for(var i=1;i<_s.length-1;i++){
			
			var _i = _s[i].split('|');
			
			info += paymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
		}
	}
	if(rowdata.checkv != null && rowdata.checkv != "0"){
		info += "转账: " + rowdata.checkv + " " + paymentCheck.checkBankInfo[rowdata.checkvBankName] + ", ";
	}
	if(rowdata.installment != null && rowdata.installment != "0"){
		info += "分期: " + rowdata.installment + " " + paymentCheck.bankInfo[rowdata.installmentBankName] + ", ";
	}
	if(rowdata.accounts != null && rowdata.accounts != "0"){
		info += "对公帐户: " + rowdata.accounts + " " + paymentCheck.accountsInfo[rowdata.accountsBankName] + ", ";
	}
	if(rowdata.des != null && rowdata.des != ""){
		info += "描述: " + rowdata.des + ", ";
	}
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+info.substring(0, info.length-2)+'">信息</span>';
	html += "<input type='text' class='hide' value='"+info.substring(0, info.length-2)+"' />";
	return html;
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	paymentCheck.listgrid.trigger("reloadGrid", paymentCheck.postParams);
}