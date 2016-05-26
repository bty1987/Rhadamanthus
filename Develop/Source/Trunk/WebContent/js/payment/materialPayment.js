var materialPayment = {
	listGrid: null,
	gridPager: null,
	
	listMaterialPaymentHistoryGrid: null,
	gridMaterialPaymentHistoryPager: null,
	
	paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"],
	
	materialPaymentTypeData: {},
	materialPaymentRevTypeData: {},
	
	couponType: {},
	couponTypeData: {},
	
	customerId: null,
	
	bankDataList: [],
	
	saveBtn: null,
	cancelBtn: null,
	
	baseModal: null,
	addOrReduceModal: null,
	refundModal: null,
	materialPaymentItems: {},
	
	items: {},
	
	editFlg: false,
	historyFlag: false,
	batchFlag: true,
	
	queryUrl: null,
	
	validator: {
		price: {
			type: "v_price",
			regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
			errorMsg: "价格内容输入错误错误."
		},
	},
};

var materialPaymentPostData = {};

jQuery(function($) {
	
	materialPayment.listGrid = $("#listGrid");
	materialPayment.gridPager = "#gridPager";
	materialPayment.paymentInfo = $("#paymentInfo");
	materialPayment.refundInfo = $("#refundInfo");
	materialPayment.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		materialPayment.paymentInfo.html("");
		com.clearValidator();
	});
	materialPayment.saveBtn = $("#saveBtn").on("click", payment);
	materialPayment.saveBtn = $("#saveRefundBtn").on("click", refund);
	materialPayment.cancelBtn = $("#cancelBtn").on("click", function(){
		materialPayment.paymentInfo.html("");
		materialPayment.historyFlag = false;
	});
	
	materialPayment.listMaterialPaymentHistoryGrid = $("#listMaterialPaymentHistoryGrid");
	materialPayment.gridMaterialPaymentHistoryPager = "#gridMaterialPaymentHistoryPager";
	
	materialPayment.refundModal = $("#refundModal").on('show.bs.modal', function(e){
		materialPayment.refundInfo.html("");
		com.clearValidator();
	});
	
	materialPayment.items.couponType = $("#couponType");
	
	$.extend(com.validator, materialPayment.validator);
	
	var searchOpts = {
		url: api.payment.pageMaterialPaymentBySubOrder,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: materialPayment.listGrid,
		items: [
	        {label:"装修订单号",id:"orderIdSearch",name:"orderId", type:'text', op:"eq"},
	        {label:"主材订单号",id:"orderIdSearch",name:"msoNo", type:'text', op:"eq"},
	        {label:"楼盘地址",id:"orderAddrSearch",name:"orderAddr",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"设计师",id:"designerNameSearch",name:"salesmanName",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"设计师"}},
			{label:"业务员",id:"salesmanNameSearch",name:"salesmanName",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":""}},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	var searchHistoryOpts = {
		url: api.payment.pageMaterialPaymentForNotInitBySubOrder.url,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: materialPayment.listMaterialPaymentHistoryGrid,
		items: [
			{label:"装修订单号", id:"orderIdSearch", name:"orderId", type:'text', op:"eq"},
			{label:"主材订单号", id:"msoNoSearch", name:"msoNo", type:'text', op:"eq"},
			{label:"楼盘地址" ,id:"searchVillage", name:"orderAddr", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
			{label:"设计师", id:"searchHistoryDesigner", name:"designerName", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
			{label:"收款时间", id:"collectTimeSearch", name:"collectTime", type:"dateRangePicker", op:"between"}
		]
	};
	$("#searchMaterialPaymentHistoryDiv").flSearch(searchHistoryOpts);

	$("#refundBankCard").on("click",function(e) {
		$("#refundBankCardDiv").removeClass("hide");
		$("#refundBankName").addClass("v_required");
		
		$("#refundCashInfoDiv").addClass("hide");
		$("#refundCashInfo").removeClass("v_required");
	});
	
	$("#refundCash").on("click",function(e) {
		$("#refundBankCardDiv").addClass("hide");
		$("#refundBankName").removeClass("v_required");
		
		$("#refundCashInfoDiv").removeClass("hide");
		$("#refundCashInfo").addClass("v_required");
	});
	
	for(var i=0;i<materialPayment.paymentModelNameData.length;i++){
		$("#" + materialPayment.paymentModelNameData[i] + "Checkbox").on("click",function(e) {
			var _name = $(this).attr("key");
			var _checkboxId = "#" + _name + "Checkbox";
			var _divId = "#" + _name + "Div";
			
			if($(_checkboxId).attr("checked") != "checked"){
				$(_divId).removeClass("hide");
				$(_checkboxId).attr("checked","checked");
				
				if(_name == "advance"){
					var row = -1;
					if($("#materialPaymentList").hasClass("active")){
						row = materialPayment.listGrid.jqGrid('getRowData', 1);
					}else if($("#history").hasClass("active")){
						row = materialPayment.listMaterialPaymentHistoryGrid.jqGrid('getRowData', 1);
					}
					
					com.post(api.data.queryCustomerForAdvanceByCustomerId, {"customer.customerId": materialPaymentPostData.customerId},function(res){
						$("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
						$("#zaterialAdvance").val(res.zaterialAdvance).attr("readonly", "readonly");
					});
				}
			}else{
				$(_divId).addClass("hide");
				$(_checkboxId).removeAttr("checked","checked");
			}
		});
	}
	
	com.post(api.ds.materialInfo, {}, function(res){
		$("#advanceType").bindData(res.advanceType, 'key', 'value');
		
		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialPayment.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialPayment.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}
	});
	
	$("#couponType").chosen({width: "216px", multi_type: "input"});
	$("#refundCouponType").chosen({width: "216px", multi_type: "input"});
	
	com.post(api.common.queryReceiptType, {}, function(res){
		
		materialPayment.cash = [];
		materialPayment.bank = [];
		materialPayment.checkBank = [];
		materialPayment.accounts = [];
		materialPayment.couponType = [];
		
		materialPayment.cashInfo = {};
		materialPayment.bankInfo = {};
		materialPayment.checkBankInfo = {};
		materialPayment.accountsInfo = {};
		materialPayment.couponTypeData = {};
		
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				materialPayment.cash.push(v);
				materialPayment.cashInfo[v.key] = v.name;
			}else if(v.type == 2){
				materialPayment.bank.push(v);
				materialPayment.bankInfo[v.key] = v.name;
			}else if(v.type == 3){
				materialPayment.checkBank.push(v);
				materialPayment.checkBankInfo[v.key] = v.name;
			}else if(v.type == 4){
				materialPayment.accounts.push(v);
				materialPayment.accountsInfo[v.key] = v.name;
			}else if(v.type == 5){
				materialPayment.couponType.push(v);
				materialPayment.couponTypeData[v.key] = [v.key, v.name];
			}
		});
		
		$("#cashInfo").bindData(materialPayment.cash, 'key', 'name');
		$("#refundCashInfo").bindData(materialPayment.cash, 'key', 'name');
		
		$("#installmentBankName").bindData(materialPayment.bank, 'key', 'name');
		$("#refundBankName").bindData(materialPayment.bank, 'key', 'name');
		
		$("#checkvBankName").bindData(materialPayment.checkBank, 'key', 'name');
		
		$("#accountsBankName").bindData(materialPayment.accounts, 'key', 'name');
		
		$("#couponType").bindData(materialPayment.couponType, 'key', 'name');
		$("#couponType").trigger("chosen:updated");
		
		$("#refundCouponType").bindData(materialPayment.couponType, 'key', 'name');
		$("#refundCouponType").trigger("chosen:updated");
	});
	
	$("#bankAdd").click(function(){
		
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		
		addBankDiv(nextNum);
		$(this).attr("num", nextNum);
		
		return false;
	});
	
	initMaterialPaymentList();
	initMaterialPaymentHistoryList();
	
	$("#history").removeClass("active");
});

function initMaterialPaymentList(){
	materialPayment.listGrid.jqGrid({		
		url: api.payment.pageMaterialPaymentBySubOrder.url,
		colNames:['编号', 'msoId', '订单编号', '订单编号', '收款类型', '收款类型Id', '客户Id', '客户名', '楼盘名', '品类', '品牌', '操作人', '应收金额', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'mpId', hidden:true},
		    {name:'msoId', hidden:true},
		    {name:'orderId'},
		    {name:'msoNo'},
		    {name:'paymentTypeName', formatter: paymentTypeInit},
		    {name:'paymentType', hidden:true},
		    {name:'customerId', hidden:true},
			{name:'customerName', width:80},
			{name:'orderAddr', width:300},
			{name:'materialType', hidden:true},
			{name:'materialBrand'},
			{name:'createUserName', width:80},
			{name:'referMoney'},
			{name:'action', sortable: false, editable: false, formatter: actionInit}
		], 
		rowNum:20,
		sortable:false,
		onSelectRow: jqgridSelectRow,
		onSelectAll: jqgridSelectRow,
		pager: materialPayment.gridPager,
		caption: "汇总收款金额：<span id='sumMoneyShow'>0</span><input class='hide' id='sumMoney' value='0'>元"
	});

	materialPayment.listGrid.navGrid(materialPayment.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialPayment.gridPager, {
		caption:"",
		buttonicon: 'icon-money blue',
		title: "批量收款",
		onClickButton: function(){
			
			$("#paymentInfo").text("");
			
			var nums = materialPayment.listGrid.jqGrid("getGridParam", "selarrrow");
			
			if(nums == 0){
				$.jgrid.showSelectInfo(materialPayment.listGrid.attr("id"));
				return false;
			}
			
			var _orderId = "";
			var _paymentType = 0;
			var _paymentTypeFlag = false;
			var customerId = "";
			
			var sumMoney = 0;
			for(var i = 0; i< nums.length; i++){
				var row = materialPayment.listGrid.jqGrid('getRowData', nums[i]);
				
				if(_orderId == ""){
					_orderId = row.orderId;
				}else {
					if(_orderId != row.orderId){
						com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
						return false;
					}
				}
				
				if(customerId == ""){
					customerId = row.customerId;
				}else{
					if(customerId != row.customerId){
						com.showAlert(com.warning, "批量收款不支持不同客户间的操作.");
						return false;
					}
				}
				
				materialPaymentPostData.orderId = _orderId;
				materialPaymentPostData.customerId = customerId;
				
				if(row.action.indexOf("已收") != -1){
					com.showAlert(com.warning, "当前批量收款选项存在已收条目!");
					return ; 
				}
				
				if(_paymentType == 0){
					_paymentType = row.paymentType;
				}
				
				if(row.paymentType == 4 || row.paymentType == 5 || row.paymentType == 6 || row.paymentType == 7){
					sumMoney = utils.accSub(sumMoney, parseFloat(row.referMoney));
					if(_paymentType != 4 || _paymentType != 5 || _paymentType != 6){
						_paymentTypeFlag = true;
					}
				}else{
					sumMoney = utils.accAdd(sumMoney, parseFloat(row.referMoney));
					if(_paymentType == 4 || _paymentType == 5 || _paymentType == 6 || row.paymentType == 7){
						_paymentTypeFlag = true;
					}
				}
			}
			$("#sumMoney").val(sumMoney);
			$("#sumMoneyShow").html(sumMoney);
			
			if(_paymentTypeFlag){
				com.showAlert(com.warning, "批量收款只能选择相同类型的收款项!");
				return false;
			}
			
			materialPayment.orderId = _orderId;
			
			if(sumMoney >= 0){
				initBaseModal();
				
				$("#referMoney").val(sumMoney).attr("disabled", "disabled");
				$("#couponCheckbox").attr("disabled", "disabled");
				
				materialPayment.baseModal.modal("show");
			}else{
//				initRefundModal();
//				$("#refundSum").val(Math.abs(sumMoney)).attr("disabled", "disabled");
//				materialPayment.refundModal.modal("show");
				
				com.showAlert(com.warning, "退款不支持批量操作!");
			}
		},
		position: 'first'
	});
}

function initMaterialPaymentHistoryList(){
	materialPayment.listMaterialPaymentHistoryGrid.jqGrid({		
		url: api.payment.pageMaterialPaymentForNotInitBySubOrder.url,
		colNames:['编号', '收据编号', '订单编号', '主材订单编号', '收款类型', '客户ID', '客户名', '楼盘名', '收款类型Id', '应收款', '品牌', '现金', '现金类型', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '预付款类型', '优惠券', '券类型', '券信息', '收款人', '收款时间', '状态名称', '状态', '备注', '收款信息', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'mpId', hidden:true},
		    {name:'mrId', hidden:true},
		    {name:'orderId'},
		    {name:'msoNo'},
		    {name:'paymentTypeName', formatter: paymentTypeInit},
		    {name:'customerId', hidden:true},
			{name:'customerName'},
			{name:'orderAddr', width:300},
			{name:'paymentType', hidden:true},
			{name:'referMoney'},
			{name:'materialBrand'},
			{name:'cash', hidden:true},
			{name:'cashInfo', hidden:true},
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
			{name:'paymentStatusName', formatter: paymentStatusInit, unformat:unformatStatus},
			{name:'paymentStatus', hidden:true},
			{name:'des', hidden:true},
			{name:'info', formatter:paymentInfoInit},
			{name:'action', formatter: actionInitHistory, hidden:true}
		], 
		rowNum:20,
		sortable:false,
		pager : materialPayment.gridMaterialPaymentHistoryPager,
		caption: "",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialPaymentContent'});
		}
	});

	materialPayment.listMaterialPaymentHistoryGrid.navGrid(materialPayment.gridMaterialPaymentHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(materialPayment.gridMaterialPaymentHistoryPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    

			var num = materialPayment.listMaterialPaymentHistoryGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(materialPayment.listMaterialPaymentHistoryGrid.attr("id"));
				return;
			}
			var row = materialPayment.listMaterialPaymentHistoryGrid.jqGrid("getRowData", num);
			
			if(row.paymentStatus != "1" || row.paymentStatus != 1){
				com.showAlert(com.warning, "该收款已确认不可修改");
				return ;
			}
			materialPayment.editFlg =  true;
			
			if(row.paymentType == 4 || row.paymentType == 5 || row.paymentType == 6 || row.paymentType == 7){
				initRefundModal();
				
				$("#refundContent").val(row.des);
				
				if(row.cash != 0){
					$("#refundSum").val(row.cash).attr("readonly", "readonly");
					$("#refundCashInfo").val(row.cashInfo);
				}else{
					$("#refundBankCardDiv").removeClass("hide");
					$("#refundBankCard").prop("checked","checked");
					
					$("#refundBankName").val(row.bankInfo);
					$("#refundSum").val(row.bank).attr("readonly", "readonly");
				}
				if(row.coupon != 0){
					
					$("#refundCouponType").chosen("destroy");
					$("#refundCouponType").chosen({width: "216px", multi_type: "input"});
					$("#refundCouponType").bindData(materialPayment.couponType, 'key', 'value');
					$("#refundCouponType").trigger("chosen:updated");
					
					var couponInfo = row.couponInfo;
					var couponInfos = couponInfo.split("#");
					
					for(var i=0;i<couponInfos.length;i++){
						var _info = couponInfos[i].split(":");
						if(_info.length == 2){
							var key = _info[0];
							var value = _info[1];
							
							var _couponType = $("#refundCouponType");
							
							$("[value='"+materialPayment.couponTypeData[key][0]+"']", _couponType).attr("multikey", value).attr("selected", "selected");
							$("#refundCouponType").trigger("chosen:updated");
						}
					}
				}
				
				com.post(api.payment.queryMaterialPaymentForCouponByMsoId, {"materialPayment.msoId":row.msoId}, function(res){
					$("#coupon").val(res.materialPayment.coupon);
				});
				
				materialPayment.historyFlag = true;
				
				materialPayment.refundModal.modal("show");
			}else{
				initBaseModal();
				
				$("#referMoney").val(row.referMoney).attr("readonly", "readonly");
				$("#des").val(row.des);
				
				if(row.cash != 0){
					$("#cashDiv").removeClass("hide");
					$("#cashCheckbox").prop("checked", "checked");
					$("#cash").val(row.cash);
					$("#cashInfo").val(row.cashInfo);
				}
				if(row.bank != 0){
					$("#bankDiv").removeClass("hide");
					$("#bankCheckbox").prop("checked","checked");
					$("#bank").val(row.bank);
					
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
							}
						}
					}
					
					$("#bankAdd").attr("num", bankDivNum);
				}
				if(row.installment!=0){
					$("#installmentDiv").removeClass("hide");
					$("#installmentCheckbox").prop("checked","checked");
					$("#installment").val(row.installment);
					$("#installmentBankName").val(row.installmentBankName);
				}
				if(row.checkv != 0){
					$("#checkvDiv").removeClass("hide");
					$("#checkvCheckbox").prop("checked","checked");
					$("#checkv").val(row.checkv);
					$("#checkvBankName").val(row.checkvBankName);
				}
				if(row.accounts != 0){
					$("#accountsDiv").removeClass("hide");
					$("#accountsCheckbox").prop("checked","checked");
					$("#accounts").val(row.accounts);
					$("#accountsBankName").val(row.accountsBankName);
				}
				if(row.coupon != 0){
					$("#couponDiv").removeClass("hide");
					$("#couponCheckbox").prop("checked","checked");
					
					$("#couponType").chosen("destroy");
					$("#couponType").chosen({width: "216px", multi_type: "input"});
					$("#couponType").bindData(materialPayment.couponType, 'key', 'value');
					$("#couponType").trigger("chosen:updated");
					
					var couponInfo = row.couponInfo;
					var couponInfos = couponInfo.split("#");
					
					for(var i=0;i<couponInfos.length;i++){
						var _info = couponInfos[i].split(":");
						if(_info.length == 2){
							var key = _info[0];
							var value = _info[1];
							
							var _couponType = $("#couponType");
							
							$("[value='"+materialPayment.couponTypeData[key][0]+"']", _couponType).attr("multikey", value).attr("selected", "selected");
							$("#couponType").trigger("chosen:updated");
						}
					}
				}
				if(row.advance != 0){
					$("#advanceDiv").removeClass("hide");
					$("#advanceCheckbox").prop("checked","checked").attr("disabled", "disabled");
					
					$("#materialAdvance").css("display", "none");
					$("#zaterialAdvance").css("display", "none");
					
					$("#advance").val(row.advance).attr("readonly", "readonly");
				}
				
				materialPayment.baseModal.modal("show");
				materialPayment.historyFlag = true;
			}
		},
		position: 'first'
	}).navButtonAdd(materialPayment.gridMaterialPaymentHistoryPager, { 
		caption:"",
		buttonicon: 'icon-print blue',
		onClickButton: function(){
			var nums = materialPayment.listMaterialPaymentHistoryGrid.jqGrid("getGridParam","selarrrow");
			if(nums == null || nums == 0){
				$.jgrid.showSelectInfo(materialPayment.listMaterialPaymentHistoryGrid.attr("id"));
				return;
			}
			
			var row = materialPayment.listMaterialPaymentHistoryGrid.jqGrid('getRowData', nums[0]);
			var collector = row.collectUserName;
			var orderId = row.orderId;
			var paymentType = row.paymentType;
			var paymentTypeFlag = "collect";
			var _mrId = row.mrId;
			
			if(paymentType == 4 || row.paymentType == 5 || row.paymentType == 6 || row.paymentType == 7){
				paymentTypeFlag = "refund";
			}
			
			for(var i = 0; i< nums.length; i++){
				
				var _paymentTypeFlag = "";
				
				row = materialPayment.listMaterialPaymentHistoryGrid.jqGrid('getRowData', nums[i]);
				
				if(row.collectUserName != collector){
					com.showAlert(com.warning, "存在不同收款人");
					return;
				}
				
				if(row.orderId != orderId){
					com.showAlert(com.warning, "存在不同订单编号");
					return;
				}
				
				if(row.mrId != _mrId){
					com.showAlert(com.warning, "存在不同收据信息");
					return;
				}
				
				if(row.paymentType == 4 || row.paymentType == 5 || row.paymentType == 6 || row.paymentType == 7){
					_paymentTypeFlag = "refund";
				}else{
					_paymentTypeFlag = "collect";
				}
				
				if(_paymentTypeFlag != paymentTypeFlag){
					com.showAlert(com.warning, "存在不同收款类型");
					return;
				}
			}
			
			var url = api.index.materialPaymentReceiptIndex.url + "?orderId=" + orderId + "&materialReceipt.mrId=" + _mrId;
			window.open(url);
		},
		position: 'first'
	});
}

function paymentTypeInit(cellvalue, options, rowdata){
	return '<span class="label label-info">' + materialPayment.materialPaymentTypeData[rowdata.paymentType];
}

function actionInit(cellvalue, options, rowdata){
	
	console.log("actionInit");
	
	var result = '';
	
	if(cellvalue == "paymentCommit"){
		result = "已收";
		return result;
	}
	
	result += '<div class="ui-pg-div btn-group">';
	
	if(rowdata.paymentType == 4 || rowdata.paymentType == 5 || rowdata.paymentType == 6 || rowdata.paymentType == 7){
		result += '<button class="btn btn-minier btn-danger" onclick="dialogPayment(' + options.rowId + ',\'' + rowdata.mpId + '\',\'' + rowdata.paymentType + "\',\'" + rowdata.customerId + '\', \'' + rowdata.orderId + '\');">退款</button>';
	}else{
		result += '<button class="btn btn-minier btn-primary" onclick="dialogPayment(' + options.rowId + ',\'' + rowdata.mpId + '\',\'' + rowdata.paymentType + "\',\'" + rowdata.customerId + '\', \'' + rowdata.orderId + '\');">收款</button>';
	}
	result += '</div>';
	
	return result;
}

function couponTypeInit(cellvalue, options, rowdata){
	
	materialPayment.couponType[cellvalue];
	for(var type in materialPayment.couponType){
		if(cellvalue == materialPayment.couponType[type]["key"]){
			return materialPayment.couponType[type]["value"];
		}
	}
	
	return "-";
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
	result += '<button class="btn btn-minier btn-primary" onclick="printReceipt(\'' + rowdata.materialPaymentId + '\',' + rowdata.paymentType + ');">打印收据</button>';
	result += '</div>';
	
	return result;
}

function paymentInfoInit(cellvalue, options, rowdata){
	
	if(cellvalue != undefined){
		rowdata = cellvalue;
	}
	
	var info = "";
	
	if(rowdata.cash != null && rowdata.cash != "0"){
		info += "现金: " + rowdata.cash + " " + materialPayment.cashInfo[rowdata.cashInfo] + ", ";
	}
	if(rowdata.bank != null && rowdata.bank != "0"){
		
		info += "刷卡: " + rowdata.bank + " ";
		
		var _s = rowdata.bankInfo.split('#');
		
		for(var i=1;i<_s.length-1;i++){
			
			var _i = _s[i].split('|');
			
			info += materialPayment.bankInfo[_i[0]] + " " + _i[1] + ", ";
		}
	}
	if(rowdata.checkv != null && rowdata.checkv != "0"){
		info += "转账: " + rowdata.checkv + " " + materialPayment.checkBankInfo[rowdata.checkvBankName] + ", ";
	}
	if(rowdata.installment != null && rowdata.installment != "0"){
		info += "分期: " + rowdata.installment + " " + materialPayment.bankInfo[rowdata.installmentBankName] + ", ";
	}
	if(rowdata.accounts != null && rowdata.accounts != "0"){
		info += "对公帐户: " + rowdata.accounts + " " + materialPayment.accountsInfo[rowdata.accountsBankName] + ", ";
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

function dialogPayment(rowId, mpId, paymentType, customerId, orderId){
	
	var paymentInfo = materialPayment.listGrid.jqGrid('getRowData', rowId);
	
	$("#paymentInfo").text("");
	
	if(paymentType == 1 || paymentType == 2 || paymentType == 3){ // 预付款、订金、全款
		initBaseModal();
		$("#referMoney").val(paymentInfo.referMoney).attr("disabled", "disabled");
		
		materialPaymentPostData.orderId = orderId;
		materialPaymentPostData.customerId = customerId;
		
		var options = {
			"decorationOrder.orderId": orderId,
		}
		
//		com.post(api.decoration.queryDecorationActivityItemForCouponAVaildByOrderId, options, function(res){
//			var decorationActivityItems = res.decorationActivityItems;
//			
//			var couponInfos = [];
//			
//			for(var i=0;i<decorationActivityItems.length;i++){
//				
//				var _ = decorationActivityItems[i];
//				
//				couponInfos.push({"key": _.daiId, "value":_.activityItemName + ",金额:" + _.money + ",数量:" + _.num});
//			}
//			
//			materialPayment.items.couponType.chosen("destroy");
//			materialPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
//			materialPayment.items.couponType.bindData(couponInfos, 'key', 'value');
//			materialPayment.items.couponType.trigger("chosen:updated");
//		});
		
		materialPayment.items.couponType.chosen("destroy");
		materialPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
		materialPayment.items.couponType.bindData(materialPayment.couponType, 'key', 'name');
		materialPayment.items.couponType.trigger("chosen:updated");
		
		materialPayment.baseModal.modal("show");
	}else if(paymentType == 4 || paymentType == 5 || paymentType == 6 || paymentType == 7){ // 退款
		initRefundModal();
		$("#refundSum").val(paymentInfo.referMoney).attr("disabled", "disabled");
		$("#refundCouponDiv").addClass("hide");
		
		com.post(api.payment.queryMaterialPaymentForCouponByMsoId, {"materialPayment.msoId":paymentInfo.msoId}, function(res){
			if(res.coupon != 0){
				$("#refundCouponDiv").removeClass("hide");
				$("#couponValue").attr("disabled", "disabled");
				$("#couponValue").val(res.materialPayment.coupon);
			}
		});		
		
		materialPayment.refundModal.modal("show");
	}
	
	materialPayment.editFlg =  false;
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
	var couponCount = 0;
	
	var resMrIdIndex = "";
	
	var mpIds = "";
	var _paymentInfo = "#paymentInfo";
	
	$(_paymentInfo).text("");
	
	for(var i=0;i<materialPayment.paymentModelNameData.length;i++){
		
		var _paymentName = materialPayment.paymentModelNameData[i];
		var _checkboxId = "#" + _paymentName + "Checkbox";
		var _inputId = _paymentName;
		var _selectId = "";
		
		 if(_paymentName == "coupon" || _paymentName == "advance"){
			_selectId = _paymentName + "Type";
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
		
		if($(_checkboxId).prop("checked")){
			
			var _payment = 0;
			
			if(_paymentName == "cash"){
				args["cash"] = $("#cash").val();
				args["cashInfo"] = $("#cashInfo").val();
				
				_payment = $("#cash").val();
			}else if(_paymentName == "bank"){
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
				
				args["bank"] = _bank;
				args["bankInfo"] = _bankInfo;
				
				_payment = _bank;
			}else if(_paymentName == "coupon"){
				var _coupon = 0;
				var _couponInfo = "#";
				
				$("[class='search-choice']", $("#couponType_chosen")).each(function(i, e){
					
					var _ = $(e);
					
					_couponVal = _.children('span').children('input').val();
					_coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
					_couponInfo += _.children('span').text() + ":" + _couponVal + "#";
					
//					options["decorationActivityItems[" + couponCount + "].daiId"] = $(e).attr("index");
//					options["decorationActivityItems[" + couponCount + "].num"] = _.children('span').children('input').val();
					
//					var num = _.children('span').children('input').val();
//					var money = _.children('span').text().split(",")[1].split(':')[1]
					
//					_coupon = utils.accAdd(parseFloat(_coupon), utils.accMul(parseFloat(num), parseFloat(money)));
					
					couponCount++;
				});
				
				args["coupon"] = _coupon;
				args["couponInfo"] = _couponInfo;
				
				_payment = _coupon;
			}else{
				args[_inputId] = $("#" + _inputId).val();
				_payment = $("#" + _inputId).val();
			}
			
			if($(_checkboxId).attr("select") == "1"){
				args[_selectId] = $("#" + _selectId).val();
			}
			
			realPayment = utils.accAdd(realPayment, parseFloat(_payment));
		}
	}
	
	console.log(args);
	
	if(referPayment != realPayment){
		$("#paymentInfo").text("当前实收款项总数与应收款项不等,请核实再进行提交!");
		return false;
	}
	
	if($("#advanceCheckbox").prop("checked")){
		var _advance = 0;
		var advanceType = $("#advanceType").val();
		
		if(advanceType == 1){
			_advance = parseFloat($("#materialAdvance").val());
		}else if(advanceType == 2){
			_advance = parseFloat($("#zaterialAdvance").val());
		}
		
		if(_advance > 0 && _advance < parseFloat($("#advance").val())){
			$("#paymentInfo").text("预付款金额大于当前客户预付款余额!");
			return false;
		}
	}
	
	var _rowIds;
	var _listGrid;
	
	if(!materialPayment.historyFlag){
		_rowIds = materialPayment.listGrid.jqGrid('getGridParam', 'selarrrow');
		_listGrid = materialPayment.listGrid;
	}else{
		_rowIds = materialPayment.listMaterialPaymentHistoryGrid.jqGrid('getGridParam', 'selarrrow');
		_listGrid = materialPayment.listMaterialPaymentHistoryGrid;
	}
	
	if(_rowIds.length == 1){
		console.log("rowids is 1");
		if(materialPayment.historyFlag){
			url = api.payment.updateMaterialPayment;
		}else{
			url = api.payment.collectMaterialPayment;
		}
		var _info = _listGrid.jqGrid('getRowData', _rowIds[0]);
		for(var arg in args){
			options["materialPayment."+arg] = args[arg];
		}
		
		options["materialPayment.mpId"] = _info.mpId;
		options["materialPayment.des"] = $("#des").val();
		
		resMrIdIndex = "materialPayment";
	}else{
		url = api.payment.collectMaterialPayments;
		for(var i=0;i<_rowIds.length;i++){
			var _rowId = _rowIds[i];
			var _info = _listGrid.jqGrid('getRowData', _rowId);
			var _referMoney = parseFloat(_info.referMoney);
			
			if(_info.action.indexOf("已收") != -1){
				continue;
			}
			
			options["materialPayments["+i+"].mpId"] = _info.mpId;
		}
		
		for(var arg in args){
			options["materialReceipt."+arg] = args[arg];
		}
		
		resMrIdIndex = "materialReceipt";
	}
	
	options["materialSubOrder.orderId"] = materialPayment.orderId;
	
	console.log(options);
	
	com.post(url, options, function(result){
		
		if(result.errorCode == 1){
			$("#paymentInfo").text(result.errorMsg);
			return false;
		}
		
		com.showAlert(com.info, "收款成功!");
		if(!materialPayment.historyFlag){
			for(var i=0;i<_rowIds.length;i++){
				materialPayment.listGrid.setCell(_rowIds[i], "action", "paymentCommit");
			}
		}else{
			for(var j=0;j<_rowIds.length;j++){
				for(var i=0;i<materialPayment.paymentModelNameData.length;i++){
					
					var _bankName = "";
					var _paymentName = materialPayment.paymentModelNameData[i];
					
					var _materialPayment = result["materialPayment"];
					
					_listGrid.setCell(_rowIds[j], _paymentName, _materialPayment[_paymentName]);
					
					if(_paymentName == "coupon" || _paymentName == "bank"){
						_bankName = _paymentName + "Info";
					}else{
						_bankName = _paymentName + "BankName";
					}
					_listGrid.setCell(_rowIds[j], _bankName, _materialPayment[_bankName]);
				}
				
				_listGrid.setCell(_rowIds[j], "des", _materialPayment["des"]);
				_listGrid.setCell(_rowIds[j], "info", _materialPayment);
			}
			
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialPaymentContent'});
		}
		materialPayment.historyFlag = false;
		materialPayment.baseModal.modal("hide");
		
		var mrId = "&materialReceipt.mrId=" + result[resMrIdIndex].mrId;
		
		bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
			if(result){
				var url = api.index.materialPaymentReceiptIndex.url + "?orderId=" + mrId;
				window.open(url);
			}
		});
	}, function(result){
		$("#paymentInfo").text(result);
//		var row = materialPayment.listGrid.jqGrid('getRowData', 1);
//		com.post(api.data.queryCustomerForAdvanceByCustomerId, {"materialPayment.customerId":row.customerId}, function(res){
//			$("#advanceBalance").val(res.money).attr("readonly", "readonly");
//		});
	});
}

function refund(){
	console.log("refund");
	
	if(com.validate()){
		return;
	}
	
	var url = "";
	var options = {};
	var type = "";
	var referPayment = $("#sumMoneyShow").text();
	var refundSum = $("#refundSum").val();
	var mpIds = "";
	
	$("#refundCoupon").on("keydown", function(){
		$("#refundInfo").text("");
	});
	
	$("#refundCash").on("change", function(){
		$("#refundInfo").text("");
	});
	
	$("#refundBankCard").on("change", function(){
		$("#refundInfo").text("");
	});
	
	if(refundSum != Math.abs(referPayment)){
		com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
	}
	
	if($("#refundCash").prop("checked")){
		type = "cash";
	}else{
		type = "bank";
	}
	
	var _rowIds;
	var _listGrid;
	
	if(!materialPayment.historyFlag){
		url = api.payment.collectMaterialRefundPayment;
		_rowIds = materialPayment.listGrid.jqGrid('getGridParam','selarrrow');
		_listGrid = materialPayment.listGrid;
	}else{
		url = api.payment.updateMaterialPayment;
		_rowIds = materialPayment.listMaterialPaymentHistoryGrid.jqGrid('getGridParam','selarrrow');
		_listGrid = materialPayment.listMaterialPaymentHistoryGrid;
	}
	
	if(_rowIds.length > 2){
		com.showAlert(com.error, "退款失败,不能批量进行退款动作!");
		materialPayment.refundModal.modal("hide");
		return false;
	}
	
	var _info = _listGrid.jqGrid('getRowData', _rowIds[0]);
	
	if(_info.action.indexOf("已收") != -1){
		com.showAlert(com.error, "退款失败,当前退款已经完成不能重复进行退款动作!");
		materialPayment.refundModal.modal("hide");
		return false;
	}
	
	var referMoney = _info.referMoney;
	
	options["materialPayment.mpId"] = _info.mpId;
	options["materialPayment.msoId"] = _info.msoId;
	
	mpIds += "&mpIds["+0+"]="+_info.mpId;
	
	var _coupon = 0;
	var _couponInfo = "#";
	
	$("[class='search-choice']", $("#refundCouponType_chosen")).each(function(i,e){
		_couponVal = $(e).children('span').children('input').val();
		_coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
		_couponInfo += $(e).children('span').text()+":"+_couponVal+"#";
	});
	
	if(_coupon > 0){
		if(_coupon > referMoney){
			com.showAlert(com.error, "全退款不能操作退款金额");
			return false;
		}
		
		options["materialPayment.coupon"] = _coupon;
		options["materialPayment.couponInfo"] = _couponInfo;
		referMoney = utils.accSub(referMoney, _coupon);
	}
	
	if(referMoney > 0){
		if(type == "cash"){
			options["materialPayment.cash"] = referMoney;
			options["materialPayment.cashInfo"] = $("#refundCashInfo").val();
			options["materialPayment.bank"] = 0;
			options["materialPayment.bankInfo"] = "";
		}else{
			options["materialPayment.cash"] = 0;
			options["materialPayment.cashInfo"] = "";
			options["materialPayment.bank"] = referMoney;
			options["materialPayment.bankInfo"] = $("#refundBankName").val();
		}
	}
	
	options["materialPayment.des"] = $("#refundContent").val();
	
	console.log(options);
	
	com.post(url, options, function(result){
		com.showAlert(com.info, "退款成功!");
		
		var _materialPayment = result.materialPayment;
		
		if(!materialPayment.historyFlag){
			
			for(var i=0;i<_rowIds.length;i++){
				materialPayment.listGrid.setCell(_rowIds[i], "action", "paymentCommit");
			}
			
			bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
				if(result){
					var url = api.index.materialPaymentReceiptIndex.url + "?orderId=" + "&materialReceipt.mrId=" + _materialPayment.mrId;;
					window.open(url);
				}
			});
		}else{
			for(var i=0;i<_rowIds.length;i++){
				materialPayment.listMaterialPaymentHistoryGrid.setCell(_rowIds[i], "cash", _materialPayment.cash);
				materialPayment.listMaterialPaymentHistoryGrid.setCell(_rowIds[i], "cashInfo", _materialPayment.cashInfo);
				materialPayment.listMaterialPaymentHistoryGrid.setCell(_rowIds[i], "bank", _materialPayment.bank);
				materialPayment.listMaterialPaymentHistoryGrid.setCell(_rowIds[i], "bankInfo", _materialPayment.bankInfo);
				materialPayment.listMaterialPaymentHistoryGrid.setCell(_rowIds[i], "info", _materialPayment);
			}
			
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialPaymentContent'});
		}
		
		materialPayment.refundModal.modal("hide");
	}, function(result){
		com.showAlert(com.error, result);
		materialPayment.refundModal.modal("hide");
	});
}

function initRefundModal(){
	$("#refundBankCardDiv").addClass("hide");
	$("#refundBankCard").removeAttr("checked","checked");
	$("#refundBankName").removeClass("v_required");
	$("#refundCash").attr("checked","checked");
	
	$("#refundSum").val("");
	$("#refundBankName").val("");
	$("#refundContent").val("");
	
	$("#refundCouponType").chosen("destroy");
	$("#refundCouponType").chosen({width: "216px", multi_type: "input"});
	$("#refundCouponType").bindData(materialPayment.couponType, 'key', 'value');
	$("#refundCouponType").trigger("chosen:updated");
}

function initBaseModal(){
	console.log("initBaseModal");
	
	for(var i=0;i<materialPayment.paymentModelNameData.length;i++){
		var _name = materialPayment.paymentModelNameData[i];
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
		$(_checkboxId).removeAttr("checked").removeAttr("disabled");
		
		$(_inputId).val("");
		$(_selectId).val("");
		
		if(_name == "coupon"){
			$("#couponType").chosen("destroy");
			$("#couponType").chosen({width: "216px", multi_type: "input"});
			$("#couponType").bindData(materialPayment.couponType, 'key', 'value');
			$("#couponType").trigger("chosen:updated");
		}else if(_name == "bank"){
			$("#bankDivGroup").html("");
			$("#bankAdd").attr("num", 0);
		}
	}
	
	$("des").val("");
}

function addBankDiv(index){
	
	var d = new Date();
	var currentData = d.getFullYear() + "-" + (d.getMonth().toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();
	
	var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));
	
	var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
	var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
	var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(materialPayment.bank, 'key', 'name').appendTo(bankNameDiv);
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
	var bankTimeInput =  $('<input></input>').addClass('col-sm-6 v_time v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);
	
//	bankTimeInput.timepicker({minuteStep: 1, showSeconds: true, showMeridian: false});
}

function jqgridSelectRow(){
	
	console.log("jqgridSelectRow");
	
	var nums = materialPayment.listGrid.jqGrid("getGridParam","selarrrow");

	var sumMoney = 0;
	for(var i = 0; i< nums.length; i++){
		var row = materialPayment.listGrid.jqGrid('getRowData', nums[i]);
		if(row.paymentType == 4 || row.paymentType == 5 || row.paymentType == 6 || row.paymentType == 7){
			sumMoney = utils.accSub(sumMoney, parseFloat(row.referMoney));
		}else{
			sumMoney = utils.accAdd(sumMoney, parseFloat(row.referMoney));
		}
	}
	$("#sumMoney").val(sumMoney);
	$("#sumMoneyShow").html(sumMoney);
}
