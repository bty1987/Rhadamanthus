var materialInsidePayment = {
	listGrid: null,
	gridPager: null,
	
	listMaterialInsidePaymentHistoryGrid: null,
	gridMaterialInsidePaymentHistoryPager: null,
	
	paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts"],
	
	materialInsidePaymentTypeData: {"1":"预付款", "2":"定金", "3":"补款", "4":"退款"},
	materialInsidePaymentRevTypeData: {"预付款":"1", "定金":"2", "补款":"3", "退款":"4"},
	
	saveBtn: null,
	cancelBtn: null,
	
	baseModal: null,
	addOrReduceModal: null,
	refundModal: null,
	materialInsidePaymentItems: {},
	
	editFlg: false,
	historyFlag: false,
	batchFlag: true,
	
	queryUrl: null
	
};

jQuery(function($) {
	
	materialInsidePayment.listGrid = $("#listGrid");
	materialInsidePayment.gridPager = "#gridPager";
	materialInsidePayment.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	materialInsidePayment.saveBtn = $("#saveBtn").on("click", payment);
	materialInsidePayment.cancelBtn = $("#cancelBtn").on("click", function(){
		materialInsidePayment.historyFlag = false;
	});
	
	materialInsidePayment.listMaterialInsidePaymentHistoryGrid = $("#listMaterialInsidePaymentHistoryGrid");
	materialInsidePayment.gridMaterialInsidePaymentHistoryPager = "#gridMaterialInsidePaymentHistoryPager";
	
	var searchOpts = {
		url: api.payment.pageMaterialInsidePaymentForInit,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: materialInsidePayment.listGrid,
		items: [
	        {label:"楼盘地址",id:"searchVillage",name:"village",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"设计师",id:"searchHistoryDesigner",name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"设计师"}},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	var searchHistoryOpts = {
		url: api.payment.pageMaterialInsidePaymentForNotInit.url,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: materialInsidePayment.listMaterialInsidePaymentHistoryGrid,
		items: [
			{label:"楼盘地址",id:"searchVillage",name:"village",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"设计师",id:"searchHistoryDesigner",name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty., postData:{"duty":"设计师"}},
		]
	};
	$("#searchMaterialInsidePaymentHistoryDiv").flSearch(searchHistoryOpts);

	$("#refundBankCard").on("click",function(e) {
		$("#refundBankCardDiv").removeClass("hide");
		$("#refundBankName").addClass("v_required");
	});
	
	$("#refundCash").on("click",function(e) {
		$("#refundBankCardDiv").addClass("hide");
		$("#refundBankName").removeClass("v_required");
	});
	
	for(var i=0;i<materialInsidePayment.paymentModelNameData.length;i++){
		$("#" + materialInsidePayment.paymentModelNameData[i] + "Checkbox").on("click",function(e) {
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
		$("#bankName").bindData(res.bank, 'key', 'value');
		$("#checkvBankName").bindData(res.bank, 'key', 'value');
		$("#installmentBankName").bindData(res.bank, 'key', 'value');
		$("#refundBankName").bindData(res.bank, 'key', 'value');
	});
	
	com.post(api.ds.accountType, {"timestamp": new Date().getTime()}, function(res){
		$("#accountsBankName").bindData(res.accountList, 'key', 'value');
	});
	
	initMaterialInsidePaymentList();
	initMaterialInsidePaymentHistoryList();
	
	$("#history").removeClass("active");
});

function initMaterialInsidePaymentList(){
	materialInsidePayment.listGrid.jqGrid({		
		url: api.payment.pageMaterialInsidePaymentForInit.url,
		colNames:['mipId', '编号', '楼盘名', '客户Id', '客户名', '品类', '品牌', '应收金额', '操作'],
		colModel:[
		    {name:'mipId', hidden:true},
		    {name:'miId', hidden:true},
		    {name:'orderAddr'},
		    {name:'customerId', hidden:true},
			{name:'customerName'},
			{name:'materialTypeName'},
			{name:'materialBrandName'},
			{name:'referMoney'},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		rowNum:20,
		sortable:false,
		onSelectRow: jqgridSelectRow,
		onSelectAll: jqgridSelectRow,
		pager: materialInsidePayment.gridPager,
		caption: "汇总收款金额：<span id='sumMoneyShow'>0</span><input class='hide' id='sumMoney' value='0'>元"
	});

	materialInsidePayment.listGrid.navGrid(materialInsidePayment.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initMaterialInsidePaymentHistoryList(){
	materialInsidePayment.listMaterialInsidePaymentHistoryGrid.jqGrid({		
		url: api.payment.pageMaterialInsidePaymentForNotInit.url,
		colNames:['mipId', '编号', '楼盘地址', '客户Id', '客户名', '现金', '刷卡', '刷卡银行', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '收款人', '收款时间', '应收款项', '状态名称', '状态', '备注', '操作'],
		colModel:[
		    {name:'mipId', hidden:true},
		    {name:'miId', hidden:true},
		    {name:'orderAddr'},
		    {name:'customerId', hidden:true},
			{name:'customerName'},
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
			{name:'referMoney', hidden:true},
			{name:'paymentStatusName', formatter: paymentStatusInit, unformat:unformatStatus},
			{name:'paymentStatus', hidden:true},
			{name:'des', hidden:true},
			{name:'action', formatter: actionInitHistory, hidden:true}
		], 
		rowNum:20,
		sortable:false,
		pager : materialInsidePayment.gridMaterialInsidePaymentHistoryPager,
		caption: ""
		
	});

	materialInsidePayment.listMaterialInsidePaymentHistoryGrid.navGrid(materialInsidePayment.gridMaterialInsidePaymentHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function paymentTypeInit(cellvalue, options, rowdata){
	return '<span class="label label-info">' + materialInsidePayment.materialInsidePaymentTypeData[rowdata.paymentType];
}

function actionInit(cellvalue, options, rowdata){
	
	console.log("actionInit");
	
	var result = '';
	
	if(cellvalue == "paymentCommit"){
		result = "已收";
		return result;
	}
	
	result += '<div class="ui-pg-div btn-group">';
	
	if(rowdata.paymentType == 4){
		result += '<button class="btn btn-minier btn-danger" onclick="dialogPayment(' + options.rowId + ',' + rowdata.mipId + ',' + rowdata.paymentType + ');">退款</button>';
	}else{
		result += '<button class="btn btn-minier btn-primary" onclick="dialogPayment(' + options.rowId + ',' + rowdata.mipId+','+rowdata.paymentType+');">收款</button>';
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

function actionInitHistory(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-primary" onclick="printReceipt(\''+rowdata.materialInsidePaymentId+'\','+rowdata.paymentType+');">打印收据</button>';
	result += '</div>';
	
	return result;
}

function dialogPayment(rowId, mipId, paymentType){
	
	var paymentInfo = materialInsidePayment.listGrid.jqGrid('getRowData', rowId);
	
	$("#paymentInfo").text("");
	
	initBaseModal();
	$("#referMoney").val(paymentInfo.referMoney).attr("disabled", "disabled");
	materialInsidePayment.baseModal.modal("show");
	materialInsidePayment.editFlg =  false;
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
	
	var mipIds = "";
	
	for(var i=0;i<materialInsidePayment.paymentModelNameData.length;i++){
		
		var _paymentName = materialInsidePayment.paymentModelNameData[i];
		var _checkboxId = "#" + _paymentName + "Checkbox";
		var _inputId = _paymentName;
		var _selectId = "";
		
		var _paymentInfo = "#paymentInfo";
		
		if(_paymentName != "bank"){
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
	
	if(!materialInsidePayment.historyFlag){
		_rowIds = materialInsidePayment.listGrid.jqGrid('getGridParam','selarrrow');
		_listGrid = materialInsidePayment.listGrid;
	}else{
		_rowIds = materialInsidePayment.listMaterialInsidePaymentHistoryGrid.jqGrid('getGridParam','selarrrow');
		_listGrid = materialInsidePayment.listMaterialInsidePaymentHistoryGrid;
	}
	
	if(_rowIds.length == 1){
		console.log("rowids is 1");
		if(materialInsidePayment.historyFlag){
			url = api.payment.updateMaterialInsidePayment;
		}else{
			url = api.payment.collectMaterialInsidePayment;
		}
		var _info = _listGrid.jqGrid('getRowData', _rowIds[0]);
		for(var arg in args){
			options["materialInsidePayment."+arg] = args[arg];
		}
		options["materialInsidePayment.mipId"] = _info.mipId;
		mipIds+="&mipIds["+0+"]="+_info.mipId;
	}else{
		url = api.payment.collectMaterialInsidePayment;
		for(var i=0;i<_rowIds.length;i++){
			var _rowId = _rowIds[i];
			var _info = _listGrid.jqGrid('getRowData', _rowId);
			var _referMoney = parseFloat(_info.referMoney);
			
			if(_info.action.indexOf("已收") != -1){
				continue;
			}
			
			options["materialInsidePayments["+i+"].mipId"] = _info.mipId;
			mipIds+="&mipIds["+i+"]="+_info.mipId;
			
			for(var j=0;j<materialInsidePayment.paymentModelNameData.length;j++){
				var _epayment = parseFloat(args[materialInsidePayment.paymentModelNameData[j]]);
				if(_epayment > 0){
					if(_referMoney <= _epayment){
						options["materialInsidePayments["+i+"]."+materialInsidePayment.paymentModelNameData[j]] = _referMoney;
						args[materialInsidePayment.paymentModelNameData[j]] = _epayment - _referMoney;
						
						if($("#"+materialInsidePayment.paymentModelNameData[j]+"Name").val() && $("#"+materialInsidePayment.paymentModelNameData[j]+"Name").val() != ""){
							options["materialInsidePayments["+i+"]."+materialInsidePayment.paymentModelNameData[j]+"Name"] = $("#"+materialInsidePayment.paymentModelNameData[j]+"Name").val();
						}
						if($("#"+materialInsidePayment.paymentModelNameData[j]+"BankName").val() && $("#"+materialInsidePayment.paymentModelNameData[j]+"BankName").val() != ""){
							options["materialInsidePayments["+i+"]."+materialInsidePayment.paymentModelNameData[j]+"BankName"] = $("#"+materialInsidePayment.paymentModelNameData[j]+"BankName").val();
						}
						
						break;
					}else{
						options["materialInsidePayments["+i+"]."+materialInsidePayment.paymentModelNameData[j]] = _epayment;
						args[materialInsidePayment.paymentModelNameData[j]] = 0;
						_referMoney = _referMoney - _epayment;
						
						if($("#"+materialInsidePayment.paymentModelNameData[j]+"Name").val() && $("#"+materialInsidePayment.paymentModelNameData[j]+"Name").val() != ""){
							options["materialInsidePayments["+i+"]."+materialInsidePayment.paymentModelNameData[j]+"Name"] = $("#"+materialInsidePayment.paymentModelNameData[j]+"Name").val();
						}
						if($("#"+materialInsidePayment.paymentModelNameData[j]+"BankName").val() && $("#"+materialInsidePayment.paymentModelNameData[j]+"BankName").val() != ""){
							options["materialInsidePayments["+i+"]."+materialInsidePayment.paymentModelNameData[j]+"BankName"] = $("#"+materialInsidePayment.paymentModelNameData[j]+"BankName").val();
						}
					}
				}
			}
		}
	}
	
	console.log(options);
	
	com.post(url, options, function(result){
		
		console.log(result.errorCode);
		if(result.errorCode == 1){
			$("#paymentInfo").text(result.errorMsg);
			return false;
		}
		
		com.showAlert(com.info, "收款成功!");
		if(!materialInsidePayment.historyFlag){
			for(var i=0;i<_rowIds.length;i++){
				materialInsidePayment.listGrid.setCell(_rowIds[i], "action", "paymentCommit");
			}
		}else{
			for(var j=0;j<_rowIds.length;j++){
				for(var i=0;i<materialInsidePayment.paymentModelNameData.length;i++){
					
					var _bankName = "";
					var _paymentName = materialInsidePayment.paymentModelNameData[i];
					
					if(_paymentName == "cash"){
						continue;
					}
					
					_listGrid.setCell(_rowIds[j], _paymentName, result["materialInsidePayment"][_paymentName]);
					
					if(_paymentName != "bank"){
						_bankName = _paymentName + "BankName";
					}else{
						_bankName = _paymentName + "Name";
					}
					_listGrid.setCell(_rowIds[j], _bankName, result["materialInsidePayment"][_bankName]);
				}
			}
		}
		materialInsidePayment.historyFlag = false;
		materialInsidePayment.baseModal.modal("hide");
		
		bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
			if(result){
				var url = "receiptMaterialInsidePaymentIndex.do" + "?orderId=" + mipIds;
				window.open(url);
			}
		});
	}, function(result){
		$("#paymentInfo").text(result);
	});
}

function refund(){
	console.log("refund");
	
	if(com.validate()){
		return;
	}
	
	var url = "collectMaterialInsidePayments.do";
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
	
	var rowIds = materialInsidePayment.listGrid.jqGrid('getGridParam','selarrrow');
	for(var i=0;i<rowIds.length;i++){
		var _info = materialInsidePayment.listGrid.jqGrid('getRowData', rowIds[i]);
		
		if(_info.action.indexOf("已收") != -1){
			continue;
		}
		
		options["materialInsidePayments[" + i + "].mipId"] = _info.mipId;
		
		if(type == "cash"){
			options["materialInsidePayments[" + i + "].cash"] = _info.referMoney;
		}else{
			options["materialInsidePayments[" + i + "].bank"] = _info.referMoney;
			options["materialInsidePayments[" + i + "].bankName"] = $("#refundBankName").val();
		}
	}
	
	console.log(options);
	
	com.post(url, options, function(result){
		com.showAlert(com.info, "收款成功!");
		for(var i=0;i<rowIds.length;i++){
			materialInsidePayment.listGrid.setCell(rowIds[i], "action", "paymentCommit");
		}
		materialInsidePayment.refundModal.modal("hide");
	}, function(result){
		com.showAlert(com.error, "收款失败!");
	});
}

function printReceipt(materialInsidePaymentId,paymentType){
	if(paymentType == 1 || paymentType == 2 || paymentType == 3){//预付款、订金、补款
		alert("收据打印");
	}else if(paymentType == 4){//退款
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
	
	for(var i=0;i<materialInsidePayment.paymentModelNameData.length;i++){
		var _name = materialInsidePayment.paymentModelNameData[i];
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

function jqgridSelectRow(){
	var nums = materialInsidePayment.listGrid.jqGrid("getGridParam","selarrrow");

	var sumMoney = 0;
	for(var i = 0; i< nums.length; i++){
		var row = materialInsidePayment.listGrid.jqGrid('getRowData', nums[i]);
		if(row.paymentType == 4){
			sumMoney -= parseFloat(row.referMoney);
		}else{
			sumMoney += parseFloat(row.referMoney);
		}
	}
	$("#sumMoney").val(sumMoney);
	$("#sumMoneyShow").html(sumMoney);
}

