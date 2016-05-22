var payment = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	cashOutModal: null,
	items: {},
	postParams: {
		"paging.rows":10, 
		"paging.page":1,
	},
	
	listgridHistory: null,
	gridPagerHistory: null,
	
	temp: [],
	
	bankDataList: [],
	accountsList: [],
	
	hSaveBtn: null,
	hCancellBtn: null,
	hModal: null,
	hItems: {},
	
	updateFlag: false,
};

var paymentPostData = {};

var history = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	items: {}
};

jQuery(function($) {
	payment.listgrid = $("#listgrid");
	payment.gridPager = "#gridPager";
	payment.saveBtn = $("#collectBtn").on("click", saveData);
	payment.cancelBtn = $("#cancelBtn");
	payment.modal = $("#paymentModal").on('show.bs.modal',function(e){
		com.clearValidator();
		$('.payWayError').hide();
		
		$("#paymentInfo").text("");
	});
	
	payment.items.cashCheckbox = $("#cashCheckbox");
	payment.items.bankCheckbox = $("#bankCheckbox");
	payment.items.checkvCheckbox = $("#checkvCheckbox");
	payment.items.installmentCheckbox = $("#installmentCheckbox");
	payment.items.accountsCheckbox = $("#accountsCheckbox");
	
	payment.items.cash = $("#cash");
	payment.items.checkv = $("#checkv");
	payment.items.checkvBankName = $("#checkvBankName");
	payment.items.installment = $("#installment");
	payment.items.installmentBankName = $("#installmentBankName");
	payment.items.accounts = $("#accounts");
	payment.items.accountsBankName = $("#accountsBankName");
	payment.items.paymentTypeSel = $("#paymentTypeSel");
	payment.items.des = $("#des");
	
	$("#paymentModal :checkbox").on("change", function(){
		$(this).prop("checked") ? $("[referCheckbox="+this.id+"]").show() : $("[referCheckbox="+this.id+"]").hide();
	});
	
	$("#refundCash").prop("checked", true);
	$("#cashOutModal input[name='refundType']").on("click", function(){
		if($(this).val() == 0){
			$("#refundBankCardDiv").hide();
		}else{
			$("#refundBankCardDiv").show();
		}
	});
	
	$("#cashOut_collectBtn").on("click", cashOut);
	$("#convertBtn").on("click", convertCach);
	
	var searchOpts = {
		url: api.decoration.pageDecorationOrderForGeneral,
		postParmas: payment.postParams,
		listgrid: payment.listgrid,
		items: [
	        {label:"订单编号",id:"orderIdSearch", name:'orderId', op:"eq", type:'text'},
	        {label:"客户编号",id:"customerIdSearch", name:'customerId', op:"eq", type:'text'},
	        {label:"客户电话", id:"phoneSearch", name:"customerPhone", type:"text"},
	        {label:"楼盘地址",id:"searchVillage",name:"village",type:"autoFillPinyinText",url:api.data.queryVillageForNameByPinyin},
	        {label:"设计师",id:"designerSearch",name:"designer",type:"autoFillPinyinText",url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}}
	    ]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	initializeListgrid();
	
	payment.listgridHistory = $("#listgridHistory");
	payment.gridPagerHistory = "#gridPagerHistory";
	
	var searchHistoryOpts = {
		postParmas: payment.postParams,
		listgrid: payment.listgridHistory,
		items: [
	        {label:"客户编号",id:"customerIdSearch", name:'customerId', op:"eq", type:'text'}, 
	        {label:"客户姓名", id:"customerNameSearch", name:"customerName", type:'autoFillPinyinText', url:api.data.queryCustomerForName},
	        {label:"客户电话", id:"phoneSearch", name:"customerPhone", type:"text"},
	        {label:"收款时间", id:"dateRangeSearch", name:"collectTimeDateRange",type:"dateRangePicker"}
	    ]
	};
	$("#searchHistoryDiv").flSearch(searchHistoryOpts);
	
	initializeListgridHistory();
	$("#paymentHistoryList").removeClass("active");
	
	$("#history").on("shown.bs.tab", function(e){
		payment.listgridHistory.trigger("reloadGrid", payment.postParams);
	});
	
	com.post(api.ds.bankType, {}, function(res){
		
		payment.cashInfo = res.cashInfo;
		payment.bank = res.bank;
		payment.bankInfo = res.bankInfo;
		payment.checkBankInfo = res.checkBankInfo;
		payment.accountsInfo = res.accountsInfo;
		
		payment.checkBank = res.checkBank;
		
		$("#cashInfo").bindData(res.cash, 'key', 'value');
		
		$("#installmentBankName").bindData(res.bank, 'key', 'value');
		$("#refundBankName").bindData(res.bank, 'key', 'value');
		
		$("#checkvBankName").bindData(res.checkBank, 'key', 'value');
		
		$(".bankSel").bindData(res.bank, 'key', 'value');
		
		$("#accountsBankName").bindData(res.accounts, 'key', 'value');
	});
	
	$("#bankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		addBankDiv(nextNum);
		$(this).attr("num", nextNum);
		
		return false;
	});
});

function initializeListgrid(){
	payment.listgrid.jqGrid({		
		url: api.decoration.pageDecorationOrderForGeneral.url,
		postData: payment.postParams,
		colNames:['id', '订单编号', '客户编号', '客户姓名', '楼盘地址', '设计师', '主材预付款余额', '合同预付款余额', '工程预付款余额', '正林预付款余额', "操作"],
		colModel:[
		    {name:'id', jsonmap:'customer.id', hidden:true},
		    {name:'orderId', hidden:true},
		    {name:'customerId', jsonmap:'customer.customerId', formatter: formatCustomerId},
			{name:'customerName', jsonmap:'customer.customerName'},
			{name:'houseNumber', formatter: villageAddr, width: 300},
			{name:'designer', width:80},
			{name:'materialBalance', jsonmap:'customer.materialBalance'},
			{name:'balance', jsonmap:'customer.balance'},
			{name:'projectBalance', jsonmap:'customer.projectBalance'},
			{name:'zhenglinBalance', jsonmap:'customer.zhenglinBalance'},
			{name:'action', formatter: actionInit}
		], 
		rowNum:10,
		pager : payment.gridPager,
		caption: "预付款信息列表"
	});
};

function initializeListgridHistory(){
	payment.listgridHistory.jqGrid({		
		url: api.payment.pagePaymentForHistory.url,
		postData: payment.postParams,
		colNames:['预付款编号', '客户ID', '客户编号', '客户名称', '收款类型', '预付款类型', '操作金额', '余额', '现金', '刷卡金额', '刷卡银行', '转账金额', '转账银行', '分期金额', '分期银行', '对公金额', '对公银行', '收款人', '收款时间', '状态', '描述', "信息"],
		colModel:[
		    {name:'paymentId', hidden:true},
		    {name:'customerIdDB', jsonmap:"customer.id", hidden: true},
		    {name:'customerId', jsonmap:"customer.customerId", formatter: formatCustomerId},
		    {name:'customerName', width:80, jsonmap: "customer.customerName"},
		    {name:'type'},
		    {name:'paymentType'},
		    {name:"recharge"},
			{name:'balance'}, // 余额为收款前的余额, 如果余额显示为收款后的余额, 需要放开
			{name:'cash', hidden:true},
			{name:'bank', hidden:true},
			{name:'bankInfo', hidden:true},
			{name:'checkv', hidden:true},
			{name:'checkvBankName', hidden:true},
			{name:'installmentBankName', hidden:true},
			{name:'installment', hidden:true},
			{name:'accountsBankName', hidden:true},
			{name:'accounts', hidden:true},
			{name:'collectUserName', jsonmap:"collectUser.userName"},
			{name:'collectTime'},
			{name:'status', width:80},
			{name:'des', hidden:true},
			{name:'info', formatter: paymentInfoInit}
		], 
		rowNum:10,
		pager : payment.gridPagerHistory,
		caption: "",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#paymentHistoryList'});
		}
	});

	payment.listgridHistory.navGrid(payment.gridPagerHistory, {edit: false, add: false, del: false, search: false, refresh: false, view: false}, {}, {}, {}).navButtonAdd(payment.gridPagerHistory, { 
		caption:"",
		buttonicon: 'icon-print blue',
		onClickButton: function(){
			var nums = payment.listgridHistory.jqGrid("getGridParam", "selarrrow");
			
			if(nums.length == 0){
				com.showAlert(com.warning, "请选择需要打印的信息");
				return;
			}
			
			if(nums.length > 1){
				com.showAlert(com.warning, "只能打印一条信息");
				return;
			}
			
			var row = payment.listgridHistory.jqGrid('getRowData', nums[0]);
			
			var url = api.index.paymentReceiptIndex.url + "?payment.paymentId=" + row.paymentId;
			window.open(url);
		},
		position: 'first'
	}).navButtonAdd(payment.gridPagerHistory, {
		title:"编辑",
		caption: "",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			var row = $.jgrid.getRowData.call(payment.listgridHistory, "paymentId");
			
			var total = 0;
			
			if(row == undefined) return;
			
			if(row.type=="预付款转出" || row.type=="预付款转入"){
				com.showAlert(com.info, "该收款类型不能被编辑.");
				return;
			}
			
			if(row.status == "已付款"){
				$(".historyEditItem").prop("disabled", false);
			}else{
				$(".historyEditItem").prop("disabled", true);
			}
			
			payment.items.paymentId = row.paymentId;
			payment.items.recharge = row.recharge;
			
			if(parseFloat(row.cash) != 0){
				payment.items.cashCheckbox.prop("checked", true).trigger("change");
				payment.items.cash.val(row.cash);
				
				total = utils.accAdd(parseFloat(row.cash), total);
			}
			
			if(parseFloat(row.bank) != 0){
				payment.items.bankCheckbox.prop("checked", true).trigger("change");
				
				$("#bankDivGroup").html("");
				$("#bankAdd").attr("num", 0);
				
				var bankInfo = row.bankInfo;
				var bankInfos = bankInfo.split('#');
				
				var index = 1;
				var bankDivNum = 0;
				
				for(var i=0;i<bankInfos.length;i++){
					var _info = bankInfos[i];
					if(_info){
						var _infos = _info.split('|');
						if(_infos.length == 3){
							var bankName = _infos[0];
							var bankMoney = _infos[1];
							var bankDate = _infos[2].split(' ')[0];
							var bankTime = _infos[2].split(' ')[1];
							
							addBankDiv(index);
							$('#bankName_'+index).val(bankName);
							$('#bank_'+index).val(bankMoney);
							$('#bankDate_'+index).val(bankDate);
							$('#bankTime_'+index).val(bankTime);
							
							index ++;
							bankDivNum++;
							
							total = utils.accAdd(parseFloat(bankMoney), total);
						}
					}
				}
				
				$("#bankAdd").attr("num", bankDivNum)
			}
			
			if(parseFloat(row.checkv) != 0){
				payment.items.checkvCheckbox.prop("checked", true).trigger("change");
				payment.items.checkv.val(row.checkv);
				payment.items.checkvBankName.val(row.checkvBankName);
				
				total = utils.accAdd(parseFloat(row.checkv), total);
			}
			
			if(parseFloat(row.installment) != 0){
				payment.items.installmentCheckbox.prop("checked", true).trigger("change");
				payment.items.installment.val(row.installment);
				payment.items.installmentBankName.val(row.installmentBankName);
				
				total = utils.accAdd(parseFloat(row.installment), total);
			}
			
			if(parseFloat(row.accounts) != 0){
				payment.items.accountsCheckbox.prop("checked", true).trigger("change");
				payment.items.accounts.val(row.accounts);
				payment.items.accountsBankName.val(row.accountsBankName);
				
				total = utils.accAdd(parseFloat(row.accounts), total);
			}
			
			payment.items.des.val(row.des);
			
			payment.temp.paymentId = row.paymentId;
			payment.temp.total = total;
			payment.updateFlag = true;
			
			$("#paymentTypeDiv").css("display", "none");
			
			payment.modal.modal("show");
		},
		position: 'first'
	});
}

function formatCustomerId(cellValue, options, row){
	return utils.padLeft(cellValue, 9);
}

function villageAddr(cellValue, options, row){
	return row.village.villageName + " " + row.houseNumber;
}

function actionInit(cellvalue, options, row){
	
	var result = "";
	
	var rowId = options.rowId;
	
	result += '<button class="btn btn-minier btn-primary" onclick="showPaymentModal(\'' + rowId + '\',\'' + row.orderId + '\');">收款</button>';
	result += '<button class="btn btn-minier btn-yellow" onclick="showCashOutModal(\'' + rowId + '\',\'' + row.orderId + '\');">提现</button>';
//	result += '<button class="btn btn-minier btn-purple" onclick="showConvertPaymentModal(\'' + rowId + '\',\'' + row.orderId + '\');">转换</button>';
	
	return result;
}

function paymentInfoInit(cellvalue, options, rowdata){
	
	var info = "";
	
	if(rowdata.recharge != null && rowdata.recharge != "0"){
		info += "转换款: " + rowdata.recharge + ", ";
	}
	if(rowdata.cash != null && rowdata.cash != "0"){
		info += "现金: " + rowdata.cash + " " + payment.cashInfo[rowdata.cashInfo] + ", ";
	}
	if(rowdata.bank != null && rowdata.bank != "0"){
		
		info += "刷卡: " + rowdata.bank + " ";
		
		var _s = rowdata.bankInfo.split('#');
		
		for(var i=1;i<_s.length-1;i++){
			
			var _i = _s[i].split('|');
			
			info += payment.bankInfo[_i[0]] + " " + _i[1] + ", ";
		}
	}
	if(rowdata.checkv != null && rowdata.checkv != "0"){
		info += "转账: " + rowdata.checkv + " " + payment.checkBankInfo[rowdata.checkvBankName] + ", ";
	}
	if(rowdata.installment != null && rowdata.installment != "0"){
		info += "分期: " + rowdata.installment + " " + payment.bankInfo[rowdata.installmentBankName] + ", ";
	}
	if(rowdata.accounts != null && rowdata.accounts != "0"){
		info += "对公帐户: " + rowdata.accounts + " " + payment.accountsInfo[rowdata.accountsBankName] + ", ";
	}
	if(rowdata.des != null && rowdata.des != ""){
		info += "描述: " + rowdata.des + ", ";
	}
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+info.substring(0, info.length-2)+'">信息</span>';
	html += "<input type='text' class='hide' value='"+info.substring(0, info.length-2)+"' />";
	return html;
}

function showPaymentModal(rowId, orderId){
	
	paymentPostData["orderId"] = orderId;
	
	var rowInfo = payment.listgrid.jqGrid('getRowData', rowId);
	
	payment.updateFlag = false;
	
	$("#bankDivGroup").html("");
	$("#bankAdd").attr("num", 0);
	
	com.cleanItems(payment.items);
	
	payment.items.checkvBankName.bindData(payment.checkBank, 'key', 'value');
	
	payment.modal.modal("show");
	
	$("#paymentTypeDiv").css("display", "inline");
	
	paymentTemp(rowInfo);
}

function showCashOutModal(rowId, orderId){
	
	paymentPostData["orderId"] = orderId;
	
	$("#outPaymentInfo").text("");
	$("#refund").val("");
	
	var rowInfo = payment.listgrid.jqGrid('getRowData', rowId);
	
	var balance = rowInfo.balance;
	var projectBalance = rowInfo.projectBalance;
	var materialBalance = rowInfo.materialBalance;
	var zhenglinBalance = rowInfo.zhenglinBalance;
		
	$("#refundCash").prop("checked", true);
	$("#refundBankCardDiv").hide();
	$("#refundPaymentTypeSel").find("option:first").prop("selected", true);
	$("#refundPaymentTypeSel").on("change", function(){
		if($(this).val() == "合同预付款"){
			$("#refundSum").val(balance);
		}else if($(this).val() == "主材预付款"){
			$("#refundSum").val(materialBalance);
		}else if($(this).val() == "工程预付款"){
			$("#refundSum").val(projectBalance);
		}else if($(this).val() == "正林预付款"){
			$("#refundSum").val(zhenglinBalance);
		}
	}).trigger("change");
	$("#cashOutModal").modal("show");
	
	paymentTemp(rowInfo);
}

function showConvertPaymentModal(rowId, orderId){
	
	var rowInfo = payment.listgrid.jqGrid('getRowData', rowId);
	
	paymentPostData["orderId"] = orderId;
	paymentPostData["convertCustomerAutoId"] = rowInfo.id;
	
	var balance = rowInfo.balance;
	var projectBalance = rowInfo.projectBalance;
	var materialBalance = rowInfo.materialBalance;
	var zhenglinBalance = rowInfo.zhenglinBalance;
	
	com.clearValidator();
	
	$('#convertMsg').text("");
	$("#convertCash").val("");
	$("#convertLeftSel option:first").prop("selected", true);
	$("#convertRightSel option:eq(1)").prop("selected", true);
	
	$(".convertTypeSel").on("change", function(){
		$this = $(this);
		if($this.val() == "合同预付款"){
			$this.next().text(balance+"元");
		}else if($this.val() == "主材预付款"){
			$this.next().text(materialBalance+"元");
		}else if($this.val() == "工程预付款"){
			$this.next().text(projectBalance+"元");
		}else if($this.val() == "正林预付款"){
			$this.next().text(zhenglinBalance+"元");
		}
	}).trigger("change");
	
	$("#convertModal").modal("show");
}

function convertCach(){
	
	if(com.validate()){
		return;
	}
	
	var convertMsg = "";
	var convertLeftType = $("#convertLeftSel").val();
	var convertRightType = $("#convertRightSel").val();
	var convertLeftCash = parseFloat($("#convertLeftSel").next().text());
	var convertCash = $("#convertCash").val();
	
	if(convertLeftType == convertRightType){
		convertMsg = "相同预付款类型不能进行转换.";
	}else if(convertLeftCash < convertCash){
		convertMsg = $("#convertLeftSel").val()+"转换金额不足";
	}
	
	if(convertMsg != ""){
		$('#convertMsg').text(convertMsg);
		return;
	}
	
	var options = {
		"payment.orderId": paymentPostData["orderId"],
		"payment.customer.id": paymentPostData["convertCustomerAutoId"],
		"convertLeftType": convertLeftType,
		"convertRightType": convertRightType,
		"convertCash": convertCash
	};
	
	com.post(api.payment.convertPayment, options, function(){
		com.showAlert(com.info, "操作成功");
		payment.listgrid.trigger("reloadGrid", payment.postParams);
	});
	
	$("#convertModal").modal("hide");
}

function paymentTemp(rowInfo){
	
	payment.temp = {};
	payment.temp.customer_id = rowInfo.id;
	payment.temp.customerId = rowInfo.customerId;
	payment.temp.balance = rowInfo.balance;
	payment.temp.projectBalance = rowInfo.projectBalance;
	payment.temp.materialBalance = rowInfo.materialBalance;
	payment.temp.zhenglinBalance = rowInfo.zhenglinBalance;
	payment.temp.customerName = rowInfo.customerName;
}

function cashOut(){
	
	var refund = $("#refund").val();
	var refundSum = $("#refundSum").val();
	
	if(parseFloat(refund) <= 0){
		$("#outPaymentInfo").text("提款金额需要大于零!");
		return false;
	}
	
	if(parseFloat(refundSum) < parseFloat(refund)){
		$("#outPaymentInfo").text("提款金额不能大于余额!");
		return false;
	}
	
	var options = {
		"payment.customer.id": payment.temp.customer_id,
		"payment.orderId": paymentPostData["orderId"],
		"payment.balance": payment.temp.balance,
		"payment.paymentType": $("#refundPaymentTypeSel").val(),
		"payment.des":$("#outDes").val(),
		"payment.type": "提现",
	};
	
	if($("#refundCash").prop("checked")){
		options["payment.cash"] = $("#refund").val().trim();
	}
	
	if($("#refundBankCard").prop("checked")){
		options["payment.bank"] = $("#refund").val().trim();
		options["payment.bankInfo"] = $("#refundBankName").val().trim();
	}
	
	com.post(api.payment.withdrawPayment, options, function(){
		com.showAlert(com.info, "操作成功");
		payment.listgrid.trigger("reloadGrid", payment.postParams);
	});
	$("#cashOutModal").modal("hide");
}

function saveData(){
	$('.payWayError').hide();
	
	if(com.validate()){
		return;
	}
	
	if($(".pay_way input:checkbox:checked").length == 0){
		$('.payWayError').show();
		return; 
	}
	
	var url = "";
	var total = 0;
	var options = {};
	
	if(!payment.updateFlag){
		url = api.payment.collectPayment;
		
		options["payment.customer.id"] = payment.temp.customer_id;
		options["payment.balance"] = payment.temp.balance;
		options["payment.type"] = "收款";
		options["payment.paymentType"] = $("#paymentTypeSel").val();
	}else{
		url = api.payment.updatePayment;
		
		options["payment.paymentId"] = payment.temp.paymentId;
	}
	
	options["payment.orderId"] = paymentPostData["orderId"];
	options["payment.des"] = $("#des").val().trim();
	
	if($("#cashCheckbox").prop("checked")){
		options["payment.cash"] = $("#cash").val().trim();
		options["payment.cashInfo"] = $("#cashInfo").val().trim();
		
		total = utils.accAdd(parseFloat($("#cash").val()), total);
	}
	if($("#bankCheckbox").prop("checked")){
		var _bank = 0;
		var _bankInfo = "#";
		
		var bankAdd = $("#bankAdd");
		var num = parseInt(bankAdd.attr("num"));
		for(var j=0;j<num;j++){
			var index = j + 1;
			var bankName = $("#bankName_"+index).val();
			var bankMoney = $("#bank_"+index).val();
			var bankDate = $("#bankDate_"+index).val();
			var bankTime = $("#bankTime_"+index).val();
			
			_bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";
			
			_bank = utils.accAdd(parseFloat(bankMoney), _bank);
			
		}
		
		total = utils.accAdd(_bank, total);
		
		options["payment.bank"] = _bank;
		options["payment.bankInfo"] = _bankInfo;
	}
	if($("#checkvCheckbox").prop("checked")){
		options["payment.checkv"] = $("#checkv").val().trim();
		options["payment.checkvBankName"] = $("#checkvBankName").val().trim();
		
		total = utils.accAdd(parseFloat($("#checkv").val()), total);
	}
	if($("#installmentCheckbox").prop("checked")){
		options["payment.installment"] = $("#installment").val().trim();
		options["payment.installmentBankName"] = $("#installmentBankName").val().trim();
		
		total = utils.accAdd(parseFloat($("#installment").val()), total);
	}
	if($("#accountsCheckbox").prop("checked")){
		options["payment.accounts"] = $("#accounts").val().trim();
		options["payment.accountsBankName"] = $("#accountsBankName").val().trim();
		
		total = utils.accAdd(parseFloat($("#accounts").val()), total);
	}
	
	if(payment.updateFlag && total != payment.temp.total){
		$("#paymentInfo").text("修改金额不等于原金额"+payment.temp.total+"!");
		return false;
	}
	
	if(parseFloat(total) <= 0){
		com.showAlert(com.warning, "收款金额需要大于零!");
		return false;
	}
	
	com.post(url, options, function(res){
		com.showAlert(com.info, "操作成功");
		if(payment.updateFlag){
			payment.listgridHistory.trigger("reloadGrid", payment.postParams);
		}else{
			payment.listgrid.trigger("reloadGrid", payment.postParams);
			
			bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
				if(result){
					var url = api.index.paymentReceiptIndex.url + "?payment.paymentId=" + res.payment.paymentId;
					window.open(url);
				}
			});
		}
	});
	
	payment.modal.modal("hide");
}

function addBankDiv(index){
	
	var d = new Date();
	var currentData = d.getFullYear() + "-" + (d.getMonth().toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();
	
	var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));
	
	var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
	var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
	var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(payment.bank, 'key', 'value').appendTo(bankNameDiv);
	var bankDelDiv = $('<div></div>').addClass('col-sm-1').appendTo(bankDiv);
	var bankDelBtn = $('<button></button>').addClass('btn btn-minier btn-danger pull-right inline').text("删除").attr("id", "bankDel_"+index).attr("index", index).appendTo(bankDelDiv).click(function(){
		$("#bankDiv_"+$(this).attr("index")).remove();
		var bankAdd = $("#bankAdd");
		var num = bankAdd.attr("num");
		bankAdd.attr("num", parseInt(num)-1);
		return false;
	});
	
	var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankDiv);
	var bankMoneyDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
	var bankMoneyInput = $('<input></input>').addClass("col-sm-6 v_required v_price").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_"+index).appendTo(bankMoneyDiv);
	
	var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDiv);
	var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
	var bankDateInput = $('<input></input>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);
	
	var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankDiv);
	var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
	var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
	var bankTimeInput =  $('<input></input>').addClass('col-sm-6 v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);
	
}
