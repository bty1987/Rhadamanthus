var materialOutsidePayment = {
	listGrid: null,
	gridPager: null,
	
	listMaterialOutsidePaymentHistoryGrid: null,
	gridMaterialOutsidePaymentHistoryPager: null,
	
	paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts"],
	
	saveBtn: null,
	cancelBtn: null,
	
	baseModal: null,
	addOrReduceModal: null,
	refundModal: null,
	materialOutsidePaymentItems: {},
	
	editFlg: false,
	historyFlag: false,
	batchFlag: true,
	
	queryUrl: null
};

jQuery(function($) {
	
	materialOutsidePayment.listGrid = $("#listGrid");
	materialOutsidePayment.gridPager = "#gridPager";
	materialOutsidePayment.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	materialOutsidePayment.saveBtn = $("#saveBtn").on("click", payment);
	materialOutsidePayment.cancelBtn = $("#cancelBtn").on("click", function(){
		materialOutsidePayment.historyFlag = false;
	});
	
	materialOutsidePayment.listMaterialOutsidePaymentHistoryGrid = $("#listMaterialOutsidePaymentHistoryGrid");
	materialOutsidePayment.gridMaterialOutsidePaymentHistoryPager = "#gridMaterialOutsidePaymentHistoryPager";
	
	var searchOpts = {
		url: api.payment.pageMaterialOutsidePaymentForInit.url,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: materialOutsidePayment.listGrid,
		items: [
		    {label:"订单号",id:"orderIdSearch",name:"orderId", type:'text'},
	        {label:"楼盘地址", id:"searchOrderAddr", name:"orderAddr", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin, op:"cn"},
			{label:"业务员", id:"searchSalesman", name:"salesmanName", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{}},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	var searchHistoryOpts = {
		url: api.payment.pageMaterialOutsidePaymentForNotInit.url,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: materialOutsidePayment.listMaterialOutsidePaymentHistoryGrid,
		items: [
		    {label:"订单号",id:"orderIdSearch",name:"orderId", type:'text'},
			{label:"楼盘地址",id:"searchHistoryOrderAddr", name:"orderAddr", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"业务员",id:"searchHistorySalesman", name:"salesmanName", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{}},
		]
	};
	$("#searchMaterialOutsidePaymentHistoryDiv").flSearch(searchHistoryOpts);

	$("#refundBankCard").on("click",function(e) {
		$("#refundBankCardDiv").removeClass("hide");
		$("#refundBankName").addClass("v_required");
	});
	
	$("#refundCash").on("click",function(e) {
		$("#refundBankCardDiv").addClass("hide");
		$("#refundBankName").removeClass("v_required");
	});
	
	for(var i=0;i<materialOutsidePayment.paymentModelNameData.length;i++){
		$("#" + materialOutsidePayment.paymentModelNameData[i] + "Checkbox").on("click",function(e) {
			var _name = $(this).attr("key");
			var _checkboxId = "#" + _name + "Checkbox";
			var _divId = "#" + _name + "Div";
			if($(_checkboxId).attr("checked") != "checked"){
				$(_divId).removeClass("hide");
				$(_checkboxId).attr("checked","checked");
			}else{
				$(_divId).addClass("hide");
				$(_checkboxId).removeAttr("checked","checked");
			}
		});
	}
	
	com.post(api.ds.bankType, {}, function(res){
		
		materialOutsidePayment.cashInfo = res.cashInfo;
		materialOutsidePayment.bankInfo = res.bankInfo;
		materialOutsidePayment.checkBankInfo = res.checkBankInfo;
		materialOutsidePayment.accountsInfo = res.accountsInfo;
		
		$("#cashInfo").bindData(res.cash, 'key', 'value');
		$("#bankName").bindData(res.bank, 'key', 'value');
		$("#checkvBankName").bindData(res.checkBank, 'key', 'value');
		$("#installmentBankName").bindData(res.bank, 'key', 'value');
		$("#accountsBankName").bindData(res.accounts, 'key', 'value');
		$("#refundBankName").bindData(res.bank, 'key', 'value');
	});
	
	com.post(api.ds.accountType, {"timestamp": new Date().getTime()}, function(res){
		$("#accountsBankName").bindData(res.accountList, 'key', 'value');
	});
	
	initMaterialOutsidePaymentList();
	initMaterialOutsidePaymentHistoryList();
	
	$("#history").removeClass("active");
});

function initMaterialOutsidePaymentList(){
	materialOutsidePayment.listGrid.jqGrid({		
		url: api.payment.pageMaterialOutsidePaymentForInit.url,
		colNames:['mopId', '订单号', '编号', '楼盘名', '客户Id', '客户名', '品类', '品牌', '类型', '应收金额', '操作'],
		colModel:[
		    {name:'mopId', hidden:true},
		    {name:'moId', hidden:true},
		    {name:'orderId'},
		    {name:'orderAddr'},
		    {name:'customerId', hidden:true},
			{name:'customerName'},
			{name:'materialTypeName'},
			{name:'materialBrandName'},
			{name:'paymentType', hidden:true},
			{name:'referMoney'},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		rowNum:20,
		sortable:false,
		pager: materialOutsidePayment.gridPager,
		caption: "主材场外收款"
	});

	materialOutsidePayment.listGrid.navGrid(materialOutsidePayment.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initMaterialOutsidePaymentHistoryList(){
	materialOutsidePayment.listMaterialOutsidePaymentHistoryGrid.jqGrid({		
		url: api.payment.pageMaterialOutsidePaymentForNotInit.url,
		colNames:['mopId', 'moId', '订单号', '楼盘地址', '客户Id', '客户名', '现金', '现金类型', '刷卡', '刷卡银行', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '收款人', '收款时间', '应收款项', '状态名称', '状态', '备注', '信息', '操作'], 
		colModel:[
		    {name:'mopId', hidden:true},
		    {name:'moId', hidden:true},
		    {name:'orderId'},
		    {name:'orderAddr'},
		    {name:'customerId', hidden:true},
			{name:'customerName'},
			{name:'cash', hidden:true},
			{name:'cashInfo', hidden:true},
			{name:'bank', hidden:true},
			{name:'bankName', formatter: bankNameInit, hidden:true},
			{name:'checkv', hidden:true},
			{name:'checkvBankName', formatter: bankNameInit, hidden:true},
			{name:'installment', hidden:true},
			{name:'installmentBankName', formatter: bankNameInit, hidden:true},
			{name:'accounts', hidden:true},
			{name:'accountsBankName', formatter: bankNameInit, hidden:true},
			{name:'collectUserName'},
			{name:'collectTime'},
			{name:'referMoney', hidden:true},
			{name:'paymentStatusName', formatter: paymentStatusInit, unformat:unformatStatus, hidden:true},
			{name:'paymentStatus', hidden:true},
			{name:'des', hidden:true},
			{name:'info', formatter:paymentInfoInit},
			{name:'action', formatter: actionInitHistory, hidden:true}
		], 
		rowNum:20,
		sortable:false,
		pager : materialOutsidePayment.gridMaterialOutsidePaymentHistoryPager,
		caption: "",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialOutsidePaymentContent'});
		}
	});

	materialOutsidePayment.listMaterialOutsidePaymentHistoryGrid.navGrid(materialOutsidePayment.gridMaterialOutsidePaymentHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function actionInit(cellvalue, options, rowdata){
	
	console.log("actionInit");
	
	var result = '';
	
	if(cellvalue == "paymentCommit"){
		result = "已收";
		return result;
	}
	
	result += '<div class="ui-pg-div btn-group">';
	
	if(rowdata.paymentType == 1){
		result += '<button class="btn btn-minier btn-danger" onclick="dialogPayment(' + options.rowId + ',' + rowdata.mopId + ',' + rowdata.paymentType + ');">退款</button>';
	}else{
		result += '<button class="btn btn-minier btn-primary" onclick="dialogPayment(' + options.rowId + ',' + rowdata.mopId+','+rowdata.paymentType+');">收款</button>';
	}
	result += '</div>';
	
	return result;
}

function bankNameInit(cellvalue, options, rowdata){
	console.log("bankNameInit");
	
	if(cellvalue == ""){
		return "-";
	}else{
		return cellvalue;
	}
}

function paymentStatusInit(cellvalue, options, rowdata){
	var result = '';
	if(rowdata.paymentStatus == "1" || rowdata.paymentStatus == 1){
		result += '已收款';
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

function actionInitHistory(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-primary" onclick="printReceipt(\''+rowdata.materialOutsidePaymentId+'\','+rowdata.paymentType+');">打印收据</button>';
	result += '</div>';
	
	return result;
}

function paymentInfoInit(cellvalue, options, rowdata){
	
	if(cellvalue != undefined){
		rowdata = cellvalue;
	}
	
	var info = "";
	
	if(rowdata.cash != null && rowdata.cash != "0"){
		info += "现金: " + rowdata.cash + " " + materialOutsidePayment.cashInfo[rowdata.cashInfo] + ", ";
	}
	if(rowdata.bank != null && rowdata.bank != "0"){
		
		info += "刷卡: " + rowdata.bank + " ";
	}
	if(rowdata.checkv != null && rowdata.checkv != "0"){
		info += "转账: " + rowdata.checkv + " " + materialOutsidePayment.checkBankInfo[rowdata.checkvBankName] + ", ";
	}
	if(rowdata.installment != null && rowdata.installment != "0"){
		info += "分期: " + rowdata.installment + " " + materialOutsidePayment.bankInfo[rowdata.installmentBankName] + ", ";
	}
	if(rowdata.accounts != null && rowdata.accounts != "0"){
		info += "对公帐户: " + rowdata.accounts + " " + materialOutsidePayment.accountsInfo[rowdata.accountsBankName] + ", ";
	}
	if(rowdata.des != null && rowdata.des != ""){
		info += "描述: " + rowdata.des + ", ";
	}
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+info.substring(0, info.length-2)+'">信息</span>';
	html += "<input type='text' class='hide' value='"+info.substring(0, info.length-2)+"' />";
	return html;
}

function dialogPayment(rowId, mopId, paymentType){
	
	var paymentInfo = materialOutsidePayment.listGrid.jqGrid('getRowData', rowId);
	
	$("#paymentInfo").text("");
	
	initBaseModal();
	
	materialOutsidePayment.mopId = mopId;
	
	$("#referMoney").val(paymentInfo.referMoney).attr("disabled", "disabled");
	
	materialOutsidePayment.baseModal.modal("show");
	
	materialOutsidePayment.editFlg =  false;
}

function payment(){
	console.log("payment");
	
	if(com.validate()){
		return;
	}
	
	var url = "";
	var options = {};
	var args = {};
	var referPayment = $("#referMoney").val();
	var realPayment = 0;
	
	for(var i=0;i<materialOutsidePayment.paymentModelNameData.length;i++){
		
		var _paymentName = materialOutsidePayment.paymentModelNameData[i];
		var _checkboxId = "#" + _paymentName + "Checkbox";
		var _inputId = _paymentName;
		var _selectId = "";
		
		var _paymentInfo = "#paymentInfo";

		if(_paymentName == "cash"){
			_selectId = "cashInfo";
		}else if(_paymentName != "bank"){
			_selectId = _paymentName + "BankName";
		}else{
			_selectId = _paymentName + "Name";
		}
		 
		$(_checkboxId).on("change", function(){
			$(_paymentInfo).text("");
		});
		
		$("#"+_selectId).on("change", function(){
			$(_paymentInfo).text("");
		});
		
		$("#"+_paymentName).on("keydown", function(){
			$(_paymentInfo).text("");
		});
		
		if($(_checkboxId).attr("checked") == "checked"){
			realPayment += parseInt($("#"+_inputId).val());
			
			args[_inputId] = $("#"+_inputId).val();
			if($(_checkboxId).attr("select") == "1"){
				args[_selectId] = $("#"+_selectId).val();
			}
		}
	}
	
	if(referPayment != realPayment){
		$("#paymentInfo").text("当前实收款项总数与应收款项不等,请核实再进行提交!");
		return false;
	}
	
	var _rowIds;
	var _listGrid;
	
	if(!materialOutsidePayment.historyFlag){
		_rowIds = materialOutsidePayment.listGrid.jqGrid('getGridParam','selarrrow');
		_listGrid = materialOutsidePayment.listGrid;
	}else{
		_rowIds = materialOutsidePayment.listMaterialOutsidePaymentHistoryGrid.jqGrid('getGridParam','selarrrow');
		_listGrid = materialOutsidePayment.listMaterialOutsidePaymentHistoryGrid;
	}
	
	if(materialOutsidePayment.historyFlag){
		url = api.payment.updateMaterialOutsidePayment;
	}else{
		url = api.payment.collectMaterialOutsidePayment;
	}
	
	for(var arg in args){
		options["materialOutsidePayment."+arg] = args[arg];
	}
	
	options["materialOutsidePayment.mopId"] = materialOutsidePayment.mopId;
	
	console.log(options);
	
	com.post(url, options, function(result){
		
		if(result.errorCode == 1){
			$("#paymentInfo").text(result.errorMsg);
			return false;
		}
		
		com.showAlert(com.info, "收款成功!");
		
		if(!materialOutsidePayment.historyFlag){
			for(var i=0;i<_rowIds.length;i++){
				materialOutsidePayment.listGrid.setCell(_rowIds[i], "action", "paymentCommit");
			}
		}else{
			for(var j=0;j<_rowIds.length;j++){
				for(var i=0;i<materialOutsidePayment.paymentModelNameData.length;i++){
					
					var _bankName = "";
					var _paymentName = materialOutsidePayment.paymentModelNameData[i];
					
					if(_paymentName == "cash"){
						continue;
					}
					
					_listGrid.setCell(_rowIds[j], _paymentName, result["materialOutsidePayment"][_paymentName]);
					
					if(_paymentName != "bank"){
						_bankName = _paymentName + "BankName";
					}else{
						_bankName = _paymentName + "Name";
					}
					_listGrid.setCell(_rowIds[j], _bankName, result["materialOutsidePayment"][_bankName]);
				}
			}
		}
		
		materialOutsidePayment.historyFlag = false;
		
		materialOutsidePayment.baseModal.modal("hide");
		
//		bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
//			if(result){
//				var url = "receiptMaterialOutsidePaymentIndex.do" + "?orderId=" + mipIds;
//				window.open(url);
//			}
//		});
	}, function(result){
		$("#paymentInfo").text(result);
	});
}

function refund(){
	console.log("refund");
	
	if(com.validate()){
		return;
	}
	
	var url = "collectMaterialOutsidePayments.do";
	var options = {};
	var type = "";
	var referPayment = $("#sumMoneyShow").text();
	var refundSum = $("#refundSum").val();
	
	if(refundSum != Math.abs(referPayment)){
		com.showAlert(com.warning ,"当前实收款项总数与应收款项不等,请核实再进行提交!");
	}
	
	if($("#refundCash").prop("checked")){
		type = "cash";
	}else{
		type = "bank";
	}
	
	var rowIds = materialOutsidePayment.listGrid.jqGrid('getGridParam','selarrrow');
	for(var i=0;i<rowIds.length;i++){
		var _info = materialOutsidePayment.listGrid.jqGrid('getRowData', rowIds[i]);
		
		if(_info.action.indexOf("已收") != -1){
			continue;
		}
		
		options["materialOutsidePayments[" + i + "].mipId"] = _info.mipId;
		
		if(type == "cash"){
			options["materialOutsidePayments[" + i + "].cash"] = _info.referMoney;
		}else{
			options["materialOutsidePayments[" + i + "].bank"] = _info.referMoney;
			options["materialOutsidePayments[" + i + "].bankName"] = $("#refundBankName").val();
		}
	}
	
	com.post(url, options, function(result){
		com.showAlert(com.info, "收款成功!");
		for(var i=0;i<rowIds.length;i++){
			materialOutsidePayment.listGrid.setCell(rowIds[i], "action", "paymentCommit");
		}
		materialOutsidePayment.refundModal.modal("hide");
	}, function(result){
		com.showAlert(com.error, "收款失败!");
	});
}

function printReceipt(materialOutsidePaymentId,paymentType){
	if(paymentType == 0){//预付款、订金、补款
		alert("收据打印");
	}else if(paymentType == 1){//退款
		alert("退款打印");
	}
}

function initRefundModal(){
	$("#refundBankCardDiv").addClass("hide");
	$("#refundBankCard").removeAttr("checked","checked");
	$("#refundBankName").removeClass("v_required");
	$("#refundCash").attr("checked","checked");
	
	$("#refundSum").val("");
	$("#refundBankName").val("");
}

function initBaseModal(){
	console.log("initBaseModal");
	
	for(var i=0;i<materialOutsidePayment.paymentModelNameData.length;i++){
		var _name = materialOutsidePayment.paymentModelNameData[i];
		var _checkboxId = "#" + _name + "Checkbox";
		var _divId = "#" + _name + "Div";
		var _inputId = "#" + _name;
		var _selectId = "";
		if(_name != "bank"){
			_selectId = "#"+ _name + "BankName";
		}else{
			_selectId = "#" + _name + "Name";
		}
		
		$(_divId).addClass("hide");
		$(_checkboxId).removeAttr("checked","checked");
		
		$(_inputId).val("");
		$(_selectId).val("");
	}
	
}
