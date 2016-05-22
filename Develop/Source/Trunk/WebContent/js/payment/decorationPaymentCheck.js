var decorationPaymentCheck = {
	listDecorationPaymentGrid: null,
	gridDecorationPaymentPager: null,
	
	listDecorationPaymentHistoryGrid: null,
	gridDecorationPaymentHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	
	baseModal: null,
	addOrReduceModal:null,
	refundModal:null,
	decorationPaymentCheckItems: {},
	
	editFlg:false,
	bankList:null,
	orderId:null,
	historyPostParam:{},
	
	editFlag:0
};

jQuery(function($) {
	decorationPaymentCheck.listDecorationPaymentGrid = $("#listDecorationPaymentGrid");
	decorationPaymentCheck.gridDecorationPaymentPager = "#gridDecorationPaymentPager";
	
	decorationPaymentCheck.listDecorationPaymentHistoryGrid = $("#listDecorationPaymentHistoryGrid");
	decorationPaymentCheck.gridDecorationPaymentHistoryPager = "#gridDecorationPaymentHistoryPager";
	
	com.post(api.ds.bankType, {}, function(res){
		decorationPaymentCheck.cashInfo = res.cashInfo;
		decorationPaymentCheck.bankInfo = res.bankInfo;
		decorationPaymentCheck.checkBankInfo = res.checkBankInfo;
		decorationPaymentCheck.accountsInfo = res.accountsInfo;
	});
	
	decorationPaymentCheck.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#advancePayment", true);
	});
	
	decorationPaymentCheck.refundModal = $("#refundModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	
	var searchOpts = {
		url: api.payment.pageDecorationPaymentForCollect,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: decorationPaymentCheck.listDecorationPaymentGrid,
		items: [
	        {label:"订单编号", id:"searchOrderId", name:"orderId", type:'text', op:"eq"},
	        {label:"楼盘", id:"searchVillage", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号", id:"searchHouseNum", name:"houseNumber", type:"text"},
	        {label:"设计师", id:"searchDesigner", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
		]
	};
	$("#searchDecorationPaymentDiv").flSearch(searchOpts);
	
	var searchHistoryOpts = {
		url: api.payment.pageDecorationPaymentForConfirm.url,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: decorationPaymentCheck.listDecorationPaymentHistoryGrid,
		items: [
	        {label:"订单编号", id:"searchOrderId", name:"orderId", type:'text', op:"eq"},
	        {label:"楼盘", id:"searchVillage", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号", id:"searchHouseNum", name:"houseNumber", type:"text"},
	        {label:"设计师", id:"searchDesigner", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
		]
	};
	$("#searchDecorationPaymentHistoryDiv").flSearch(searchHistoryOpts);
	
	decorationPaymentCheck.refundModal = $("#refundModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	decorationPaymentCheck.addOrReduceDetailModal=$("#addOrReduceDetailModal").on('show.bs.modal',function(e){});
	
	decorationPaymentCheck.addOrReduceDetailListGrid =$("#addOrReduceDetailListGrid");
	decorationPaymentCheck.addOrReduceDetailGridPager="#addOrReduceDetailGridPager";
	
	initDecorationPaymentList();
	initDecorationPaymentHistoryList();
	
	$("#decorationPaymentHistoryList").removeClass("active");
});

function initDecorationPaymentList(){
	decorationPaymentCheck.listDecorationPaymentGrid.jqGrid({		
		url: api.payment.pageDecorationPaymentForCollect.url,
		colNames:['编号', '订单编号', '收款类型', '楼盘', '楼号', '楼盘地址', '客户名', '设计师', '应收款', '现金', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '代金券', '券信息', '收款人', '收款时间', 'collectDes', '状态', '收款信息'],
		colModel:[
		    {name:'autoId',hidden:true},
		    {name:'orderId'},
		    {name:'paymentType', width:80},
		    {name:'village', hidden:true},
		    {name:'houseNumber', hidden:true},
		    {name:'orderAddr', width:200, formatter:orderAddrInit},
			{name:'customer', width:80},
			{name:'designer', width:80},
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
			{name:'coupon', hidden:true},
			{name:'couponInfo', hidden:true},
			{name:'collectUser', width:80},
			{name:'collectTime'},
			{name:'des',hidden:true},
			{name:'paymentStatus', width:80},
			{name:'info', formatter:paymentInfoInit},
		], 
		rowNum:100,
		rowList:[50,100,200],
		sortable:false,
		pager : decorationPaymentCheck.gridDecorationPaymentPager,
		caption: "",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#decorationPaymentContent'});
		}
	});

	decorationPaymentCheck.listDecorationPaymentGrid.navGrid(decorationPaymentCheck.gridDecorationPaymentPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(decorationPaymentCheck.gridDecorationPaymentPager, {
		title:"确认",
		caption: "",
		buttonicon: 'icon-ok blue',
		onClickButton: function(){    

			var nums = decorationPaymentCheck.listDecorationPaymentGrid.jqGrid("getGridParam","selarrrow");
			
			if(nums == null || nums.length == 0){
				$.jgrid.showSelectInfo(decorationPaymentCheck.listDecorationPaymentGrid.attr("id"));
				return;
			}
			
			bootbox.confirm("确定要将符合条件的所有收款项目，置为已确认状态吗?", function(result) {
				if(result) {
					var options = {};
					for(var i=0;i<nums.length; i++){
						var row = decorationPaymentCheck.listDecorationPaymentGrid.jqGrid("getRowData", nums[i]);
						options["paymentIds["+i+"]"] = row.autoId;
					}	
					com.post(api.payment.confirmDecorationPayment, options, function(res){
						$.jgrid.refreshGrid(decorationPaymentCheck.listDecorationPaymentGrid);
						$.jgrid.refreshGrid(decorationPaymentCheck.listDecorationPaymentHistoryGrid);
						
						$("#fl_btn_searchDecorationPaymentDiv").trigger("click");
						
						com.showAlert(com.info, "操作成功");
					});
				}
			});
		},
		position: 'first'
	});
}

function initDecorationPaymentHistoryList(){
	decorationPaymentCheck.listDecorationPaymentHistoryGrid.jqGrid({		
		url: api.payment.pageDecorationPaymentForConfirm.url,
		colNames:['编号', '订单编号', '收款类型', '楼盘', '楼号', '楼盘地址', '客户名', '设计师', '应收款', '现金', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '代金券', '券信息', '收款人', '收款时间', '确认人', '确认时间', 'collectDes', '状态', '收款信息'],
		colModel:[
		    {name:'autoId', hidden:true},
		    {name:'orderId'},
		    {name:'paymentType', width:80},
		    {name:'village', hidden:true},
		    {name:'houseNumber', hidden:true},
		    {name:'orderAddr', width:200, formatter:orderAddrInit},
			{name:'customer', width:80},
			{name:'designer', width:80},
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
			{name:'coupon', hidden:true},
			{name:'couponInfo', hidden:true},
			{name:'collectUser', width:80},
			{name:'collectTime'},
			{name:'confirmUser', width:80},
			{name:'confirmTime'},
			{name:'des',hidden:true},
			{name:'paymentStatus', width:80},
			{name:'info', formatter:paymentInfoInit},
		],
		rowNum:100,
		rowList:[50,100,200],
		sortable:false,
		pager : decorationPaymentCheck.gridDecorationPaymentHistoryPager,
		caption: "",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#decorationPaymentContent'});
		}
	});

	decorationPaymentCheck.listDecorationPaymentHistoryGrid.navGrid(decorationPaymentCheck.gridDecorationPaymentHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(decorationPaymentCheck.gridDecorationPaymentHistoryPager, {
		title:"导出",
		caption: "",
		buttonicon: 'icon-download-alt blue',
		onClickButton: function(){    
			var parm = "";
			var _param = $.flSearch._initParams($("#searchDecorationPaymentHistoryDiv"));
			
			for(var k in _param){
				if(k.indexOf("filters") != -1){
					parm += "&" + k + "=" + _param[k];
				}
			}
			
			if(parm == ""){
				com.showAlert(com.warning, "请输入条件,避免数据量过大导致问题!");
				return false;
			}
			
			window.open(decodeURI(api.payment.exportDecorationPayments.url + "?a=1" + parm));
		},
		position: 'first'
	});
}

function paymentInfoInit(cellvalue, options, rowdata){
	
	var info = "";
	
	if(rowdata.cash != null && rowdata.cash != "0"){
		info += "现金: " + rowdata.cash + " " + decorationPaymentCheck.cashInfo[rowdata.cashInfo] + ", ";
	}
	if(rowdata.bank != null && rowdata.bank != "0"){
		
		info += "刷卡: " + rowdata.bank + " ";
		
		var _s = rowdata.bankInfo.split('#');
		
		for(var i=1;i<_s.length-1;i++){
			
			var _i = _s[i].split('|');
			
			info += decorationPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
		}
	}
	if(rowdata.checkv != null && rowdata.checkv != "0"){
		info += "转账: " + rowdata.checkv + " " + decorationPaymentCheck.checkBankInfo[rowdata.checkvBankName] + ", ";
	}
	if(rowdata.installment != null && rowdata.installment != "0"){
		info += "分期: " + rowdata.installment + " " + decorationPaymentCheck.bankInfo[rowdata.installmentBankName] + ", ";
	}
	if(rowdata.accounts != null && rowdata.accounts != "0"){
		info += "对公帐户: " + rowdata.accounts + " " + decorationPaymentCheck.accountsInfo[rowdata.accountsBankName] + ", ";
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

function orderAddrInit(cellvalue, options, rowdata){
	return rowdata.village + " " + rowdata.houseNumber;
}