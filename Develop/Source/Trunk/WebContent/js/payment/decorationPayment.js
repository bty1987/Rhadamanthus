var decorationPayment = {
	listGrid: null,
	gridPager: null,
	
	listDecorationPaymentHistoryGrid: null,
	gridDecorationPaymentHistoryPager: null,
	
	paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"],
	
	couponType: {},
	couponTypeData: {},
	
	orderPaymentId:null,
	addOrReduceDetailListGrid:null,
	addOrReduceDetailGridPager:null,
	
	saveBtn: null,
	cancellBtn: null,
	
	baseModal: null,
	addOrReduceModal:null,
	refundModal:null,
	decorationPaymentItems: {},
	addReduceDetail:null,
	
	items: {},
	
	editFlg:false,
	historyFlag: false,
	batchFlag: true,
	historyFlag: false,
	
	bankList:null,
	accountsList: [],
	
	paymentType:"增项款",
	orderId:null,
	discount:10,
};

var decorationPaymentPostData = {};

jQuery(function($) {
	
	decorationPayment.listGrid = $("#listGrid");
	decorationPayment.gridPager = "#gridPager";
	decorationPayment.baseModal = $("#baseItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#advancePayment", true);
	});
	
	decorationPayment.listDecorationPaymentHistoryGrid = $("#listDecorationPaymentHistoryGrid");
	decorationPayment.gridDecorationPaymentHistoryPager = "#gridDecorationPaymentHistoryPager";
	
	decorationPayment.refundModal = $("#refundModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	decorationPayment.addReduceDetail = $("#addReduceDetail").on('show.bs.modal', function(e){		
	});
	
	decorationPayment.addOrReduceDetailListGrid =$("#addOrReduceDetailListGrid");
	decorationPayment.addOrReduceDetailGridPager="#addOrReduceDetailGridPager";
	
	decorationPayment.items.couponType = $("#couponType");
	
	$("#collectBtn").on('click', payment);
	$("#saveRefundBtn").on('click', refund);
	
	var searchOpts = {
		url: api.payment.pageDecorationPaymentForCommit,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: decorationPayment.listGrid,
		items: [
	        {label:"订单编号",id:"searchOrderId",name:"orderId", type:'text', op:"eq"},
	        {label:"设计师",id:"searchDesigner",name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
	        {label:"客户电话",id:"searchPhone",name:"customerPhone",type:"text"},
	        {label:"楼盘",id:"searchVillage",name:"village",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号",id:"searchHouseNum",name:"houseNumber",type:"text"},
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	var searchHistoryOpts = {
		url: api.payment.pageDecorationPaymentForHistory.url,
		postParmas: {"paging.rows":20, "paging.page":1},
		listgrid: decorationPayment.listDecorationPaymentHistoryGrid,
		items: [
	        {label:"订单编号",id:"searchHistoryOrderId",name:"orderId", type:'text', op:"eq"},
	        {label:"设计师",id:"searchHistoryDesigner",name:"designer",type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty,postData:{"duty":"设计师"}},
	        {label:"客户电话",id:"searchHistoryPhone",name:"customerPhone",type:"text"},
	        {label:"楼盘",id:"searchHistoryVillage",name:"village",type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号",id:"searchHistoryHouseNum",name:"houseNumber",type:"text"},
		    {label:"收款时间", id:"paymentHistoryCollectTimeSearch", name:"collectTime",type:"dateRangePicker",op:"between"}
		]
	};	
	$("#searchDecorationPaymentHistoryDiv").flSearch(searchHistoryOpts);
	
	$("#refundBankCard").on("click",function(e) {
		$("#refundCashInfoDiv").addClass("hide");
		
		$("#refundBankCardDiv").removeClass("hide");
		$("#refundBankName").addClass("v_required");
		$("#refundBankName").get(0).selectedIndex = 0;
	});
	
	$("#refundCash").on("click",function(e) {
		$("#refundCashInfoDiv").removeClass("hide");
		
		$("#refundBankCardDiv").addClass("hide");
		$("#refundBankName").removeClass("v_required");
	});
	
	for(var i=0;i<decorationPayment.paymentModelNameData.length;i++){
		$("#" + decorationPayment.paymentModelNameData[i] + "Checkbox").on("click",function(e) {
			var _name = $(this).attr("key");
			var _checkboxId = "#" + _name + "Checkbox";
			var _divId = "#" + _name + "Div";
			
			if($(_checkboxId).attr("checked") != "checked"){
				$(_divId).removeClass("hide");
				$(_checkboxId).attr("checked","checked");
				
				if(_name == "advance"){
					var row = -1;
					if($("#decorationPaymentList").hasClass("active")){
						var nums = decorationPayment.listGrid.jqGrid("getGridParam", "selarrrow");
						row = decorationPayment.listGrid.jqGrid('getRowData', nums[0]);
					}else if($("#history").hasClass("active")){
						var nums = decorationPayment.listDecorationPaymentHistoryGrid.jqGrid("getGridParam", "selarrrow");
						row = decorationPayment.listDecorationPaymentHistoryGrid.jqGrid('getRowData', nums[0]);
					}
					
					com.post(api.data.queryCustomerForAdvanceByCustomerId, {"customer.customerId": decorationPaymentPostData.customerId},function(res){
						$("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
						$("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
					});
				}
			}else{
				$(_divId).addClass("hide");
				$(_checkboxId).removeAttr("checked","checked");
			}
		});
	}
	
	$("#advanceType").bindData([{"key":"1", "value":"合同"}, {"key":"2", "value":"工程"}], 'key', 'value');
	
	$("#couponType").chosen({width: "216px", multi_type: "input"});
	$("#refundCouponType").chosen({width: "216px", multi_type: "input"});
	
	com.post(api.common.queryReceiptType, {}, function(res){
		
		decorationPayment.cash = [];
		decorationPayment.bank = [];
		decorationPayment.checkBank = [];
		decorationPayment.accounts = [];
		decorationPayment.couponType = [];
		
		decorationPayment.cashInfo = {};
		decorationPayment.bankInfo = {};
		decorationPayment.checkBankInfo = {};
		decorationPayment.accountsInfo = {};
		decorationPayment.couponTypeData = {};
		
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				decorationPayment.cash.push(v);
				decorationPayment.cashInfo[v.key] = v.name;
			}else if(v.type == 2){
				decorationPayment.bank.push(v);
				decorationPayment.bankInfo[v.key] = v.name;
			}else if(v.type == 3){
				decorationPayment.checkBank.push(v);
				decorationPayment.checkBankInfo[v.key] = v.name;
			}else if(v.type == 4){
				decorationPayment.accounts.push(v);
				decorationPayment.accountsInfo[v.key] = v.name;
			}else if(v.type == 5){
				decorationPayment.couponType.push(v);
				decorationPayment.couponTypeData[v.key] = [v.key, v.name];
			}
		});
		
		$("#cashInfo").bindData(decorationPayment.cash, 'key', 'name');
		$("#refundCashInfo").bindData(decorationPayment.cash, 'key', 'name');
		
		$("#installmentBankName").bindData(decorationPayment.bank, 'key', 'name');
		$("#refundBankName").bindData(decorationPayment.bank, 'key', 'name');
		
		$("#checkvBankName").bindData(decorationPayment.checkBank, 'key', 'name');
		
		$("#accountsBankName").bindData(decorationPayment.accounts, 'key', 'name');
		
		$("#couponType").bindData(decorationPayment.couponType, 'key', 'key');
		$("#couponType").trigger("chosen:updated");
		
		$("#refundCouponType").bindData(decorationPayment.couponType, 'key', 'key');
		$("#refundCouponType").trigger("chosen:updated");
	});
	
	$("#bankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		addBankDiv(nextNum);
		$(this).attr("num", nextNum);
		
		return false;
	});
	
	initDecorationPaymentList();
	initDecorationPaymentHistoryList();
	
	$("#history").removeClass("active");
});

function initDecorationPaymentList(){
	decorationPayment.listGrid.jqGrid({
		url: api.payment.pageDecorationPaymentForCommit.url,
		postData: {"filters[0].field":"orderId", "filters[0].op":"eq", "filters[0].data":"null"},
		colNames:['编号', '订单编号', '楼盘地址', '收款类型', '客户名', '客户编号', '设计师', '设计师部门', '应收金额', '操作', 'cityP'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'autoId', hidden:true},
		    {name:'orderId'},
		    {name:'village', jsonmap:'village', width:300, formatter: villageInit},
		    {name:'paymentType'},
			{name:'customer'},
			{name:'customerId', hidden:true},
			{name:'designer'},
			{name:'designerDepartment'},
			{name:'referMoney'},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit},
			{name:"cityProper", hidden:true}
		], 
		rowNum:20,
		sortable:false,
		pager: decorationPayment.gridPager,
		onSelectRow:jqgridSelectRow,
		onSelectAll:jqgridSelectRow,
		caption: "汇总收款金额：<span id='sumMoneyShow'>0</span><input class='hide' id='sumMoney' value='0'>元"
	});
	
	decorationPayment.listGrid.navGrid(decorationPayment.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function initDecorationPaymentHistoryList(){
	decorationPayment.listDecorationPaymentHistoryGrid.jqGrid({		
		url: api.payment.pageDecorationPaymentForHistory.url,
		colNames:['编号', '收据编号', '订单编号', '楼盘地址', '收款类型', '客户编号', '客户名', '设计师', '设计师部门', '应收款', '现金', '现金信息', '刷卡', '刷卡信息', '转账', '转账银行', '分期', '分期银行', '对公', '对公银行', '预付款', '代金券', '券信息', '收款人', '收款时间', 'collectDes', '状态', '收款信息'],
		colModel:[
		    {name:'autoId', hidden:true},
		    {name:'drId', hidden:true},
		    {name:'orderId'},
		    {name:'village', jsonmap:'village', width:400, formatter: villageInit},
		    {name:'paymentType'},
		    {name:'customerId', hidden:true},
			{name:'customer'},
			{name:'designer'},
			{name:'designerDepartment'},
			{name:'referMoney'},
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
			{name:'coupon', hidden:true},
			{name:'couponInfo', hidden:true},
			{name:'collectUser'},
			{name:'collectTime', width: 250},
			{name:'des',hidden:true},
			{name:'paymentStatus'},
			{name:'info', formatter:paymentInfoInit},
		], 
		rowNum:20,
		sortable:false,
		pager : decorationPayment.gridDecorationPaymentHistoryPager,
		caption: "",
		gridComplete: function(){
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#decorationPaymentContent'});
		}
	});

	decorationPayment.listDecorationPaymentHistoryGrid.navGrid(decorationPayment.gridDecorationPaymentHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(decorationPayment.gridDecorationPaymentHistoryPager, { 
		caption:"",
		buttonicon: 'icon-print blue',
		onClickButton: function(){
			var nums = decorationPayment.listDecorationPaymentHistoryGrid.jqGrid("getGridParam","selarrrow");
			if(nums == null){
				$.jgrid.showSelectInfo(decorationPayment.listDecorationPaymentHistoryGrid.attr("id"));
				return;
			}
			var row = decorationPayment.listDecorationPaymentHistoryGrid.jqGrid('getRowData', nums[0]);
			var orderId = row.orderId;
			var args = "";
			var drId = row.drId;
			
			for(var i=0;i<nums.length;i++){
				row = decorationPayment.listDecorationPaymentHistoryGrid.jqGrid('getRowData', nums[i]);
				
				if(row.orderId != orderId){
					bootbox.alert("存在不同订单编号");
					return;
				}
				
				if(row.drId != drId){
					bootbox.alert("存在不同收据信息");
					return;
				}
				
				args += "&decorationReceipt.drId=" + drId;
			}
				
			var url = api.index.decorationPaymentReceiptIndex.url + "?decorationOrder.orderId=" + orderId + "&decorationPayment.orderId=" + orderId + args;
			window.open(url);
		},
		position: 'first'
	}).navButtonAdd(decorationPayment.gridDecorationPaymentHistoryPager, {
		title:"编辑",
		caption: "",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			var num =decorationPayment.listDecorationPaymentHistoryGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(decorationPayment.listDecorationPaymentHistoryGrid.attr("id"));
				return;
			}
			
			var row = decorationPayment.listDecorationPaymentHistoryGrid.jqGrid("getRowData", num);
			
			if(row.paymentStatus == '已确认'){
				bootbox.alert("不可修改已确认的收款项");
				return;
			}
			decorationPayment.orderId = row.orderId;
			$("#referMoney").val(row.referMoney);
			
			decorationPayment.editFlg = true;
			
			var paymentType = row.paymentType;
			
			if(paymentType.search('退款') == -1 && paymentType != "减项款"){
				initBaseModal();
				
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
					$("#couponType").bindData(decorationPayment.couponType, 'key', 'value');
					$("#couponType").trigger("chosen:updated");
					
					var couponInfo = row.couponInfo;
					var couponInfos = couponInfo.split("#");
					
					for(var i=0;i<couponInfos.length;i++){
						var _info = couponInfos[i].split(":");
						if(_info.length == 2){
							var key = _info[0];
							var value = _info[1];
							
							$("[value='"+decorationPayment.couponTypeData[key][0]+"']", $("#couponType")).attr("multikey", value).attr("selected", "selected");
							$("#couponType").trigger("chosen:updated");
						}
					}
				}
				if(row.advance != 0){
					$("#advanceDiv").removeClass("hide");
					$("#advance").val(row.advance).attr("readonly", "readonly");
					
					com.post(api.data.queryCustomerForAdvanceByCustomerId, {"customer.customerId": row.customerId},function(res){
						$("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
						$("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
					});
				}
				
				$("#advanceCheckbox").prop("checked", "checked").attr("disabled", "disabled");
				
				decorationPayment.baseModal.modal("show");
			}else{
				$("#refundId").val(row.autoId);
				if(row.cash!='0'){
					$("#refundCash").trigger("click");
					$("#refundSum").val(row.cash);
				}else if(row.bank != '0'){
					$("#refundBankCard").trigger("click");
					$("#refundBankName").val(row.bankInfo);
					$("#refundSum").val(row.bank);
				}
				
				if(row.coupon != 0){
					
					$("#refundCouponType").chosen("destroy");
					$("#refundCouponType").chosen({width: "216px", multi_type: "input"});
					$("#refundCouponType").bindData(decorationPayment.couponType, 'key', 'value');
					$("#refundCouponType").trigger("chosen:updated");
					
					var couponInfo = row.couponInfo;
					var couponInfos = couponInfo.split("#");
					
					for(var i=0;i<couponInfos.length;i++){
						var _info = couponInfos[i].split(":");
						if(_info.length == 2){
							var key = _info[0];
							var value = _info[1];
							
							$("[value='"+decorationPayment.couponTypeData[key][0]+"']", $("#refundCouponType")).attr("multikey", value).attr("selected", "selected");
							$("#refundCouponType").trigger("chosen:updated");
						}
					}
				}
				
				$("#refundReferMoney").val(row.referMoney);
				$("#refundContent").val(row.des);
				
				decorationPayment.historyFlag = true;
				
				$("#refundModal").modal("show");
			};
		},
		position: 'first',
	});
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	if(cellvalue == "paymentCommit"){
		result = "已收";
		return result;
	}
	
	var paymentButtonPreInfo = '<button class="btn btn-minier ';
	var paymentButtonMidInfo = '" onclick="dialogPayment(\'' + options.rowId + '\', \'' + rowdata.autoId + '\', \'' + rowdata.paymentType + '\', \'' + rowdata.customerId + '\'\, \'' + rowdata.orderId + '\');">';
	var paymentButtonPostInfo = '</button>';
	
	var addOrReduceInfo = '<button class="btn btn-minier btn-primary" onclick="addReduceDetail(\'' + rowdata.autoId + '\',\'' + rowdata.paymentType + '\',\'' + rowdata.orderId + '\');">查看明细</button>';
	
	var paymentButtonName = "收款";
	var paymentButtonColor = "btn-primary";
	
	var addOrReduceFlag = false;
	
	result += '<div class="ui-pg-div btn-group">';
	
	if(rowdata.paymentType.search('退款') != -1){
		paymentButtonName = "退款";
		paymentButtonColor = "btn-danger";
	}else if(rowdata.paymentType == "减项款"){
		paymentButtonName = "减项款";
		paymentButtonColor = "btn-danger";
		addOrReduceFlag = true;
	}else if(rowdata.paymentType == "增项款"){
		addOrReduceFlag = true;
	}
	
	result += paymentButtonPreInfo + paymentButtonColor + paymentButtonMidInfo + paymentButtonName + paymentButtonPostInfo;
	
	if(addOrReduceFlag){
		result += addOrReduceInfo;
	}
	
	result += '</div>';
	
	return result;
}

function dialogPayment(rowId, autoId, paymentType, customerId, orderId){
	
	var paymentInfo = decorationPayment.listGrid.jqGrid('getRowData', rowId);
	
	$("#paymentInfo").text("");
	
	if(paymentType.search('退款') != -1 || paymentType == "减项款"){ // 退款
		initRefundModal();
		$("#refundSum").val(paymentInfo.referMoney).attr("disabled", "disabled");
		$("#refundCouponDiv").addClass("hide");
		
		decorationPayment.refundModal.modal("show");
	}else{ // 定金 , 设计费 , 首付款 , 首付二期款 , 二期款 , 尾款
		initBaseModal();
		$("#referMoney").val(paymentInfo.referMoney).attr("disabled", "disabled");
		
		decorationPaymentPostData.orderId = orderId;
		decorationPaymentPostData.customerId = customerId;
		
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
//			decorationPayment.items.couponType.chosen("destroy");
//			decorationPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
//			decorationPayment.items.couponType.bindData(couponInfos, 'key', 'value');
//			decorationPayment.items.couponType.trigger("chosen:updated");
//		});
		
		decorationPayment.items.couponType.chosen("destroy");
		decorationPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
		decorationPayment.items.couponType.bindData(decorationPayment.couponType, 'key', 'name');
		decorationPayment.items.couponType.trigger("chosen:updated");
		
		decorationPayment.baseModal.modal("show");
	}
	
	decorationPayment.editFlg =  false;
	decorationPayment.historyFlag = false;
}

function actionInitHistory(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-primary" onclick="printReceipt(\''+rowdata.decorationPaymentId+'\','+rowdata.paymentTypeId+');">打印票据</button>';
	result += '</div>';
	
	return result;
}

function villageInit(cellvalue, options, rowdata){
	var html = rowdata.cityProper+rowdata.village + ''+rowdata.houseNumber;
	return html;
}

function paymentInfoInit(cellvalue, options, rowdata){
	
	var info = "";
	
	if(rowdata.cash != null && rowdata.cash != "0"){
		info += "现金: " + rowdata.cash + " " + decorationPayment.cashInfo[rowdata.cashInfo] + ", ";
	}
	if(rowdata.cash != null && rowdata.bank != "0"){
		
		info += "刷卡: " + rowdata.bank + " ";
		
		var _s = rowdata.bankInfo.split('#');
		
		for(var i=1;i<_s.length-1;i++){
			
			var _i = _s[i].split('|');
			
			info += decorationPayment.bankInfo[_i[0]] + " " + _i[1] + ", ";
		}
	}
	if(rowdata.checkv != null && rowdata.checkv != "0"){
		info += "转账: " + rowdata.checkv + " " + decorationPayment.checkBankInfo[rowdata.checkvBankName] + ", ";
	}
	if(rowdata.installment != null && rowdata.installment != "0"){
		info += "分期: " + rowdata.installment + " " + decorationPayment.bankInfo[rowdata.installmentBankName] + ", ";
	}
	if(rowdata.accounts != null && rowdata.accounts != "0"){
		info += "对公帐户: " + rowdata.accounts + " " + decorationPayment.accountsInfo[rowdata.accountsBankName] + ", ";
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

function printReceipt(decorationPaymentId,paymentTypeId){
	
}

function initRefundModal(){
	
	$("#refundCash").attr("checked","checked");
	
	$("#refundCashInfo").removeClass("hide");
	
	$("#refundBankCardDiv").addClass("hide");
	$("#refundBankCard").removeAttr("checked","checked");
	$("#refundBankName").removeClass("v_required");
	
	$("#refundSum").val("");
	$("#refundBankName").get(0).selectedIndex=0;
	$("#refundContent").val("");
	
	$("#refundCouponType").chosen("destroy");
	$("#refundCouponType").chosen({width: "216px", multi_type: "input"});
	$("#refundCouponType").bindData(decorationPayment.couponType, 'key', 'value');
	$("#refundCouponType").trigger("chosen:updated");
}

function initBaseModal(){
	for(var i=0;i<decorationPayment.paymentModelNameData.length;i++){
		var _name = decorationPayment.paymentModelNameData[i];
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
		
		if(_name == "bank"){
			$("#bankDivGroup").html("");
			$("#bankAdd").attr("num", 0);
		}
	}
	
	$("#des").val("");
}

function addBankDiv(index){
	
	var d = new Date();
	var currentData = d.getFullYear() + "-" + (d.getMonth().toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();
	
	var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));
	
	var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
	var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
	var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(decorationPayment.bank, 'key', 'name').appendTo(bankNameDiv);
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
	
}

function jqgridSelectRow(){
	var nums = decorationPayment.listGrid.jqGrid("getGridParam","selarrrow");

	var sumMoney = 0;
	for(var i = 0; i< nums.length; i++){
		var row = decorationPayment.listGrid.jqGrid('getRowData', nums[i]);
		if(row.paymentType.search('退款') != -1 || row.paymentType == "减项款"){
			sumMoney -= parseFloat(row.referMoney);
		}else{
			sumMoney += parseFloat(row.referMoney);
		}
	}
	$("#sumMoney").val(sumMoney);
	$("#sumMoneyShow").html(sumMoney);
}

//------------------------------------增减项详细------------------------------
function addReduceDetail(decorationPaymentId, paymentType, orderId){
	
	decorationPayment.orderPaymentId = decorationPaymentId;
	decorationPayment.paymentType =paymentType;
	decorationPayment.orderId = orderId;
	decorationPayment.addReduceDetail.modal("show");
	
	var options = {
		"quotation.orderId": orderId,
		"addReduce.dpId": decorationPaymentId,
	};
	
	com.post(api.addReduce.queryAddReduceByDecorationPaymentId, options, function(res){
//		initAddOrReduceDetailListGrid();
		
		var quotationItemSeacher = new Searcher();
		quotationItemSeacher.init([], "condList", api.addReduce.queryAddReduceItemByAddReduceId,  function(data){
			var $tableWrap = $('#resultList').empty();
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
			
			console.log(data)

			if(data && data.length){
				$.each(data, function(i, v){
					var $liLine = createAddReduceItem(v);
					$liLine.appendTo($ul);
				});
				$ul.appendTo($tableWrap);
			}
		}, "pagenation", "decorationPaymentAddReduceDetailPostData", {"addReduce.arId": res.addReduce.arId}, true, "addReduceItems");
	});
}

function createAddReduceItem(v){
	var $liLine = $('<li></li>').addClass('item-blue clearfix');
	var $h3 = $('<h3></h3>').addClass('oid').css({"margin-bottom" : 0});

	var $label = $('<label></label>');
	var $span = $('<span></span>').addClass('lbl');

	var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

	var propertyArr = [
		["单位:", v.measurementUnit, "grey"],
		["单价:", v.unitPrice, "grey"],
		["工程量:", v.num, "grey"],
		["类型:", v.type, "grey"],
	];

	$.each(propertyArr, function (index,value) {
		var $liProperty = $('<li></li>');
		$('<strong></strong>').html(value[0]).appendTo($liProperty);
		$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
		$liProperty.appendTo($ulProperty);
	});

	$label.append($span).appendTo($h3);
	$h3.append($('<small></small>').addClass('blue').html(' ' + v.itemName));
	$liLine.append($h3).append($ulProperty);

	$input.change(function(){
		var $this = $(this);
		quote.recordQuots($this, $(this).is(':checked'));
	});

	return $liLine;
}
	if(com.validate()){
		return;
	}
	
	var url = "";
	var options = {};
	var args = {};
	var referPayment = $("#referMoney").val();
	var realPayment = 0;
	
	var autoIds = "";
	var orderId = "";
	var _paymentInfo = "#paymentInfo";
	var couponCount = 0;
	
	$(_paymentInfo).text("");
	
	for(var i=0;i<decorationPayment.paymentModelNameData.length;i++){
		
		var _paymentName = decorationPayment.paymentModelNameData[i];
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
				
				$("[class='search-choice']", $("#couponType_chosen")).each(function(i,e){
					
					var _ = $(e);
					
					_couponVal = $(e).children('span').children('input').val();
					_coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
					_couponInfo += $(e).children('span').text()+":"+_couponVal+"#";
					
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
				args[_inputId] = $("#"+_inputId).val();
				_payment = $("#"+_inputId).val();
			}
			
			if($(_checkboxId).attr("select") == "1"){
				args[_selectId] = $("#"+_selectId).val();
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
			_advance = parseFloat($("#balanceAdvance").val());
		}else if(advanceType == 2){
			_advance = parseFloat($("#projectAdvance").val());
		}
		
		if(_advance > 0 && _advance < parseFloat($("#advance").val())){
			$("#paymentInfo").text("预付款金额大于当前客户预付款余额!");
			return false;
		}
	}
	
	var _rowIds;
	var _listGrid;
	
	if(!decorationPayment.historyFlag){
		_rowIds = decorationPayment.listGrid.jqGrid('getGridParam', 'selarrrow');
		_listGrid = decorationPayment.listGrid;
	}else{
		_rowIds = decorationPayment.listDecorationPaymentHistoryGrid.jqGrid('getGridParam','selarrrow');
		_listGrid = decorationPayment.listDecorationPaymentHistoryGrid;
	}
	
	if(_rowIds.length == 1){
		console.log("rowids is 1");
		if(decorationPayment.historyFlag){
			url = api.payment.updateDecorationPayment;
		}else{
			url = api.payment.collectDecorationPayment;
		}
		var _info = _listGrid.jqGrid('getRowData', _rowIds[0]);
		for(var arg in args){
			options["decorationPayment."+arg] = args[arg];
		}
		orderId = _info.orderId;
		autoIds += "&paymentIds["+0+"]="+_info.autoId;
		
		options["decorationPayment.autoId"] = _info.autoId;
		options["decorationPayment.des"] = $("#collectDes").val();
	}else{
		url = api.payment.collectDecorationPayment;
		for(var i=0;i<_rowIds.length;i++){
			var _rowId = _rowIds[i];
			var _info = _listGrid.jqGrid('getRowData', _rowId);
			var _referMoney = parseFloat(_info.referMoney);
			
			if(_info.action.indexOf("已收") != -1){
				continue;
			}
			
			orderId = _info.orderId;
			
			options["decorationPayments["+i+"].autoId"] = _info.autoId;
			autoIds += "&paymentIds["+i+"]=" + _info.autoId;
			
		}
	}
	
	console.log(options);
	
	com.post(url, options, function(result){
		
		if(result.errorCode == 1){
			$("#paymentInfo").text(result.errorMsg);
			return false;
		}
		
		com.showAlert(com.info, "收款成功!");
		if(!decorationPayment.historyFlag){
			for(var i=0;i<_rowIds.length;i++){
				decorationPayment.listGrid.setCell(_rowIds[i], "action", "paymentCommit");
			}
		}else{
			for(var j=0;j<_rowIds.length;j++){
				for(var i=0;i<decorationPayment.paymentModelNameData.length;i++){
					
					var _bankName = "";
					var _paymentName = decorationPayment.paymentModelNameData[i];
					
					if(_paymentName == "cash"){
						continue;
					}
					
					_listGrid.setCell(_rowIds[j], _paymentName, result["decorationPayment"][_paymentName]);
					
					if(_paymentName == "coupon"){
						_bankName = _paymentName + "Type";
					}else if(_paymentName != "bank"){
						_bankName = _paymentName + "BankName";
					}else{
						_bankName = _paymentName + "Name";
					}
					_listGrid.setCell(_rowIds[j], _bankName, result["decorationPayment"][_bankName]);
				}
			}
		}
		
		decorationPayment.historyFlag = false;
		
		decorationPayment.baseModal.modal("hide");
		
		var args = "&decorationReceipt.drId=" + result.decorationPayment.drId;
		
		bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
			if(result){
				var url = api.index.decorationPaymentReceiptIndex.url + "?decorationOrder.orderId=" + orderId + "&decorationPayment.orderId=" + orderId + "" + args;
				window.open(url);
			}
		});
	}, function(result){
		$("#paymentInfo").text(result);
//		var row = materialPayment.listGrid.jqGrid('getRowData', 1);
//		com.post(api.payment.queryCustomerForAdvanceByCustomerId, {"materialPayment.customerId":row.customerId}, function(res){
//			$("#advanceBalance").val(res.money).attr("readonly", "readonly");
//		});
	});
}

function refund(){
	console.log("refund");
	
	if(com.validate()){
		return;
	}
	
	var url = api.payment.refundDecorationPayment.url;
	var options = {};
	var type = "";
	var referPayment = $("#sumMoneyShow").text();
	var refundSum = $("#refundSum").val();
	
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
		console.log("当前实收款项总数与应收款项不等,请核实再进行提交!");
	}
	
	if($("#refundCash").prop("checked")){
		type = "cash";
	}else{
		type = "bank";
	}
	
	var _rowIds;
	var _listGrid;
	
	if(!decorationPayment.historyFlag){
		url = api.payment.refundDecorationPayment;
		_rowIds = decorationPayment.listGrid.jqGrid('getGridParam', 'selarrrow');
		_listGrid = decorationPayment.listGrid;
	}else{
		url = api.payment.updateDecorationPayment;
		_rowIds = decorationPayment.listDecorationPaymentHistoryGrid.jqGrid('getGridParam', 'selarrrow');
		_listGrid = decorationPayment.listDecorationPaymentHistoryGrid;
	}
	
	if(_rowIds.length > 2){
		com.showAlert(com.error, "退款失败,不能批量进行退款!");
		decorationPayment.refundModal.modal("hide");
		return false;
	}
	
	var _info = _listGrid.jqGrid('getRowData', _rowIds[0]);
	
	if((_info.action != null || _info.action != undefined) && _info.action.indexOf("已收") != -1){
		com.showAlert(com.error, "退款失败,当前退款已经完成不能重复进行退款动作!");
		decorationPayment.refundModal.modal("hide");
		return false;
	}
	
	var referMoney = _info.referMoney;
	
	options["decorationPayment.autoId"] = _info.autoId;
	
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
		
		options["decorationPayment.coupon"] = _coupon;
		options["decorationPayment.couponInfo"] = _couponInfo;
		referMoney = utils.accSub(referMoney, _coupon);
	}
	
	if(referMoney > 0){
		if(type == "cash"){
			options["decorationPayment.cash"] = referMoney;
			options["decorationPayment.cashInfo"] = $("#refundCashInfo").val();
		}else{
			var _ = new Date();
			var currentDate = _.getFullYear() + "-" + (_.getMonth() + 1) + "-" + _.getDate() + " " + _.getHours() + ":" + _.getMinutes() + ":" + _.getSeconds();
			
			options["decorationPayment.bank"] = referMoney;
			options["decorationPayment.bankInfo"] = $("#refundBankName").val();
			options["decorationPayment.bankInfo"] = "#" + $("#refundBankName").val() + "|" + referMoney + "|" + currentDate + "#"
		}
	}
	
	options["decorationPayment.des"] = $("#refundContent").val();
	
	console.log(options);
	
	com.post(url, options, function(result){
		com.showAlert(com.info, "退款成功!");
		for(var i=0;i<_rowIds.length;i++){
			_listGrid.setCell(_rowIds[i], "action", "paymentCommit");
		}
		decorationPayment.refundModal.modal("hide");
	}, function(result){
		com.showAlert(com.error, result);
		decorationPayment.refundModal.modal("hide");
	});
}
