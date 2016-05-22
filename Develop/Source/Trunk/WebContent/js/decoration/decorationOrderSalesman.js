var order = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	orderItems: {},
	
	orderStatus: [],
	businessDepartments:[],
	postParam:{},
	
	editFlag: false
};

var contract={
	decorationOrderId:null,
};

var decorationOrderPostData = {};

jQuery(function($) {
	order.listGrid = $("#listGrid");
	order.gridPager = "#gridPager";
	order.saveBtn = $("#saveBtn").on("click", saveData);
	order.cancelBtn = $("#cancelBtn");
	order.decorationOrderModal = $("#decorationOrderModal");
	order.agreementModal = $("#agreementModal");
	order.refundContractModal = $("#refundContractModal");
	order.customerInfoModal = $("#customerInfoModal");
	
	decorationUtils.createDecorationOrderCondition(order.listGrid, api.decoration.pageDecorationOrderForSalesman.url, "orderSearchDiv", {}, "");
	
	initDecorationOrderList();
	
	$("#refundContractBtn").on("click", function(){
		if(com.validate("refundContractModal")){
			return;
		}
		
		var options = {
			"decorationOrder.orderId": decorationOrderPostData["decorationOrder.orderId"],
			"refundValue": $("#refundValue").val(),
			"paymentValue": order.paymentValue,
		};
		
		com.post(api.decoration.terminalDecorationOrder, options, function(res){
			com.showAlert(com.info, "申请成功");
			
			$("#" + decorationOrderPostData["decorationOrder.rowId"] + "_terminalBtn").css("display", "none");
		});
		
		order.refundContractModal.modal("hide");	
	});
	
	$("#customerInfoBtn").on("click", function(){
		
		if(com.validate()){
			return;
		}

		var cId = decorationOrderPostData["customer.customerId"];
		var flag = false;
		var options = {
			"customer.id": cId,
			"customer.customerName": $("#customerName").val(),
			"customer.phone": $("#phone").val(),
			"decorationContract.quotationDetail.customer.customerName": $("#customerName").val(),
			"decorationContract.quotationDetail.customer.phone": $("#phone").val(),
			"decorationContract.quotationDetail.orderId": decorationOrderPostData["decorationOrder.orderId"],
		}
		
		com.post(api.data.checkCustomerForPhone, {"customer.phone": $("#phone").val()}, function(res){
			
			var cIds = res.customerIds;
			
			if(cIds.length != 0){
				$.each(cIds, function(i, v){
					if(v != cId){
						flag = true;
					}
				});
			}
			
		}, null, false);
		
		if(flag){
			com.showAlert(com.error, "客户电话已经存在");
			return false;
		}
		
		com.post(api.data.updateCustomer, options, function(res){
			
			if(res.errorCode == 0){
				com.post(api.decoration.signDecorationContract, options, function(res){
					
					com.showAlert(com.info, "操作成功");
					
					order.listGrid.trigger("reloadGrid");
				}, null, false);
			}else{
				com.showAlert(com.error, res.errorMsg);
			}
		}, null, false);
		
		order.customerInfoModal.modal("hide");
	});
	
	$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	
	initializeContent();
	
	$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
});

function initializeContent(){
	$('#additionalInfo').ace_wysiwyg({
		toolbar:['font', null, 'fontSize', null, {name:'bold', className:'btn-info'}, {name:'italic', className:'btn-info'}, {name:'strikethrough', className:'btn-info'},
			{name:'underline', className:'btn-info'}, null,{name:'insertunorderedlist', className:'btn-success'},{name:'insertorderedlist', className:'btn-success'},
			{name:'outdent', className:'btn-purple'},{name:'indent', className:'btn-purple'},null,{name:'justifyleft', className:'btn-primary'},
			{name:'justifycenter', className:'btn-primary'},{name:'justifyright', className:'btn-primary'},{name:'justifyfull', className:'btn-inverse'}, null,
			null, null, null, null, null,'foreColor', null, {name:'undo', className:'btn-grey'},
			{name:'redo', className:'btn-grey'}],
		'wysiwyg': {fileUploadError: showErrorAlert}
	}).prev().addClass('wysiwyg-style2');
	
	if (typeof jQuery.ui !== 'undefined' && /applewebkit/.test(navigator.userAgent.toLowerCase())) {
		var lastResizableImg = null;
		function destroyResizable() {
			if(lastResizableImg == null){
				return;
			}
			
			lastResizableImg.resizable( "destroy" );
			lastResizableImg.removeData('resizable');
			lastResizableImg = null;
		}
		var enableImageResize = function() {
			$('.wysiwyg-editor').on('mousedown', function(e) {
				var target = $(e.target);
				if(e.target instanceof HTMLImageElement) {
					if(!target.data('resizable')) {
						target.resizable({
							aspectRatio: e.target.width / e.target.height
						});
						target.data('resizable', true);
						
						if(lastResizableImg != null) {
							lastResizableImg.resizable( "destroy" );
							lastResizableImg.removeData('resizable');
						}
						lastResizableImg = target;
					}
				}
			}).on('click', function(e) {
				if( lastResizableImg != null && !(e.target instanceof HTMLImageElement) ) {
					destroyResizable();
				}
			}).on('keydown', function() {
				destroyResizable();
			});
	    };
	    
		enableImageResize();
	}
}

function showErrorAlert (reason, detail) {
	var msg = '';
	
	if (reason === 'unsupported-file-type') {
		msg = "Unsupported format " +detail; 
	}else{
		console.log("error uploading file", reason, detail);
	}
	
	$('<div class="alert"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
}

function initDecorationOrderList(){
	order.listGrid.jqGrid({		
		url: api.decoration.pageDecorationOrderForCommon.url,
		postData: {"filters[0].field":"orderId","filters[0].op":"eq","filters[0].data":"null"},
		colNames:['订单编号', '楼盘地址', '客户名', '余额','设计部', '设计师', '业务部', '业务员', '面积', '合同报价', '折扣', '量房时间', '签单时间', '状态', '操作', 'houseNumber', 'cityP'],
		colModel:[
		    {name:'orderId', width: 70},
			{name:'villageName', jsonmap:'village.villageName', formatter: villageInit, width: 180},
			{name:'customerName', jsonmap:'customer.customerName', width: 50},
			{name:'balance', jsonmap:'customer.balance', width: 35},
			{name:'designDepartment', width: 70},
			{name:'designer', width: 50},
			{name:'businessDepartment', width: 70},
			{name:'salesman', width: 50},
			{name:'houseArea', width: 50},
			{name:'orderTotalPrice', width: 50},
			{name:'discount', width: 35},
			{name:'createTime', width: 70},
			{name:'contractTime', width: 70},
			{name:'status', width: 50},
			{name:'action', jsonmap:'status', width: 100, sortable: false, editable: false, formatter: actionInit},
			{name:"houseNumber", hidden:true},
			{name:"cityProperName", jsonmap:"village.cityProper.cityProperName", hidden:true}
		], 
		pager : order.gridPager,
		caption: "装修订单信息列表"
	});

	order.listGrid.navGrid(order.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	);
}

function villageInit(cellvalue, options, rowdata){
	return rowdata.village.cityProper.cityProperName + rowdata.village.villageName + ' ' + rowdata.houseNumber;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button type="button" id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewDecorationOrderDetail('+rowdata.orderId+');">查看</button>';
	
	if(cellvalue != "已签约" && cellvalue != "合同终止" && cellvalue != "废单"){
		result += '<button  type="button" class="btn btn-minier btn-primary" onclick="obsoleteOrder('+rowdata.orderId+');">废单</button>';
	}
	
	if(cellvalue == "定金" || cellvalue == '重签合同'){
		result += '<button type="button" class="btn btn-minier" onclick="signOrder(\'' + rowdata.orderId + '\',' + rowdata.customer.id + ');">签订合同</button>';
	}
	
	if(cellvalue == "已签约"){
		result += '<button id="' + options.rowId + '_terminalBtn" type="button" class="btn btn-minier btn-purple" onclick="terminalOrder(\''+rowdata.orderId+'\', ' + options.rowId + ');">合同终止</button>';
		result += '<button id="' + options.rowId + '_terminalBtn" type="button" class="btn btn-minier btn-danger" onclick="resignOrder(\''+rowdata.orderId+'\', ' + options.rowId + ');">重签合同</button>';
	}
	
	result += '</div>';
	
	return result;
}

function terminalOrder(decorationOrderId, rowId){
	
	decorationOrderPostData["decorationOrder.orderId"] = decorationOrderId;
	decorationOrderPostData["decorationOrder.rowId"] = rowId;
	
	com.post(api.payment.queryDecorationPaymentForBaseByOrderId, {"decorationPayment.orderId":decorationOrderId}, function(res){

		var refundValue = 0;
		var decorationPaymentInfo = "";
		var decorationPayments = res.decorationPayments;
		
		for(var i=0;i<decorationPayments.length;i++){
			
			var decorationPayment = decorationPayments[i];
			var paymentType = decorationPayment.paymentType;
			var paymentStatus = decorationPayment.paymentStatus;
			var referMoney = decorationPayment.referMoney;
			
			if(paymentStatus == "已付款" || paymentStatus == "已确认"){
				decorationPaymentInfo += paymentType + ":" + referMoney + "<br/>";
				refundValue = utils.accAdd(refundValue, referMoney);
			}
		}
		
		if(decorationPaymentInfo == ""){
			decorationPaymentInfo == "无付款信息";
		}
		
		$("#decorationPaymentInfo").html(decorationPaymentInfo);
		$("#refundValue").val(refundValue);
		$("#paymentValue").val(refundValue);
		order.paymentValue = refundValue;
		
		com.clearValidator();
		
		order.refundContractModal.modal("show");	
	});
}

function resignOrder(decorationOrderId, rowId){
	decorationOrderPostData["decorationOrder.orderId"] = decorationOrderId;
	decorationOrderPostData["decorationOrder.rowId"] = rowId;
	
	bootbox.confirm("确认要重签合同吗?", function(result){
		if(result){
			com.post(api.decoration.resignDecorationContract, {"decorationContract.quotationDetail.orderId": decorationOrderId}, function(res){
				com.showAlert(com.info, "操作成功");
				successCallback();
			});
		}
	});
}
	
function obsoleteOrder(orderId){
	decorationOrderPostData["decorationOrder.orderId"] = orderId;
	
	bootbox.confirm("确认要废单吗?", function(result){
		if(result){
			com.post(api.decoration.obsoleteDecorationOrder, {"decorationOrder.orderId":orderId}, function(res){
				com.showAlert(com.info, "操作成功");
				successCallback();
			});
		}
	});
}

function signOrder(orderId, customerId){
	
	decorationOrderPostData["decorationOrder.orderId"] = orderId;
	decorationOrderPostData["customer.customerId"] = customerId;
	
//	bootbox.confirm("确认要将订单置为合同已签订吗？",function(result){
//		if(result){
//			com.post(api.decoration.signDecorationContract.url, {"decorationContract.quotationDetail.orderId":orderId}, function(res){
//				if(res.errorCode == 0){
//					com.showAlert(com.info, "签订成功");
//					successCallback();
//				}
//			});
//		}
//	});
	
	order.customerInfoModal.modal("show");
}

function viewDecorationOrderDetail(decorationOrderId){
	$("#fl-container").load(api.index.decorationOrderDetailSalesmanIndex.url, {}, function(){
		decorationOrderPostData["decorationOrderId"] = decorationOrderId;
	});
}

function saveData(){
	
	var url;
	var options = {
		"customer.customerName": order.orderItems.customerName.val(),
		"customer.gender": order.orderItems.gender.value,
		"customer.phone": order.orderItems.phone.val(),
		"customer.qq": order.orderItems.qq.val(),
		"customer.wechat": order.orderItems.wechat.val(),
		"customer.email": order.orderItems.email.val(),
		"customer.address": order.orderItems.address.val(),
		"customer.relationshipType": order.orderItems.relationshipType.val()
	};
	
	
	if(order.editFlg){
		url = order.editUrl;
	}else{
		url = order.addUrl;
	}
	
	com.post(url, options, successCallback, failCallback);
	
	order.modal.modal("hide");
}

function successCallback(){
	order.listGrid.trigger("reloadGrid");
}

function failCallback(){
	
}

function cleanItems(){
	
}
;