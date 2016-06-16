var materialSubOrder = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialSubOrderItems: {},
	
	materialSubOrderPaymentTypeNameData: {"advance":"1", "deposit":"2", "full":"3", "fullRefund":"5"},
	
	materialSaleOrderTypeData: {"1":"普通", "2":"员工自购", "3":"老总关系"},
	materialSaleOrderStatusData: {"0":"初始", "2":"退货", "3":"预结算", "4":"结算"},
	materialSaleOrderPaymentStatusData: {"0":"初始", "1":"预付款", "2":"定金", "3":"补款", "5":"补款退款"},
	materialSaleOrderDeliveryStatusData: {"0":"未送货", "1":"已送货"},
	materialSubOrderPaymentStatusData: {"1": "提交", "2":"已收", "3":"已确认", "4":"审批中"},
	
	editFlag: false,
	repeatFlg: false,
};

var materialSubOrderPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材子订单", "订单信息列表");
	
	materialSubOrder.listGrid = $("#listGrid");
	materialSubOrder.gridPager = "#gridPager";
	materialSubOrder.saveBtn = $("#saveBtn").on("click", saveData);
	materialSubOrder.cancelBtn = $("#cancelBtn");
	
	materialSubOrder.materialSubOrderMoneyModal = $("#materialSubOrderMoneyModal");
	materialSubOrder.approvalMaterialFullPaymentModal = $("#approvalMaterialFullPaymentModal");
	
	materialSubOrder.materialSubOrderItems.realAdvancePayment = $("#realAdvancePayment");
	materialSubOrder.materialSubOrderItems.advancePayment = $("#advancePayment");
	materialSubOrder.materialSubOrderItems.realDepositPayment = $("#realDepositPayment");
	materialSubOrder.materialSubOrderItems.depositPayment = $("#depositPayment");
	materialSubOrder.materialSubOrderItems.fullPayment = $("#fullPayment");
	materialSubOrder.materialSubOrderItems.realFullPayment = $("#realFullPayment");
	materialSubOrder.materialSubOrderItems.couponValue = $("#couponValue");
	materialSubOrder.materialSubOrderItems.total = $("#total");
	materialSubOrder.materialSubOrderItems.maling = $("#maling");
	materialSubOrder.materialSubOrderItems.coupon = $("#coupon");
	
	materialSubOrder.materialSubOrderItems.depositPaymentBtn = $("#depositPaymentBtn");
	materialSubOrder.materialSubOrderItems.depositCancelBtn = $("#depositCancelBtn");
	materialSubOrder.materialSubOrderItems.depositRefundBtn = $("#depositRefundBtn");
	materialSubOrder.materialSubOrderItems.fullPaymentBtn = $("#fullPaymentBtn");
	materialSubOrder.materialSubOrderItems.fullCancelBtn = $("#fullCancelBtn");
	materialSubOrder.materialSubOrderItems.fullRefundBtn = $("#fullRefundBtn");
	materialSubOrder.materialSubOrderItems.couponBtn = $("#couponBtn");
	materialSubOrder.materialSubOrderItems.couponCommitBtn = $("#couponCommitBtn");
	materialSubOrder.materialSubOrderItems.couponRefundBtn = $("#couponRefundBtn");
	materialSubOrder.materialSubOrderItems.couponCancelBtn = $("#couponCancelBtn");
	materialSubOrder.materialSubOrderItems.malingBtn = $("#malingBtn");
	
	materialSubOrder.materialSubOrderItems.depositPaymentInfo = $("#depositPaymentInfo");
	materialSubOrder.materialSubOrderItems.fullPaymentInfo = $("#fullPaymentInfo");
	materialSubOrder.materialSubOrderItems.couponInfo = $("#couponInfo");
	materialSubOrder.materialSubOrderItems.malingInfo = $("#malingInfo");
	
	materialSubOrderPostData["materialSubOrder.orderId"] = materialOrderPostData["materialOrder.orderId"];
	materialSubOrderPostData["materialSubOrder.customerId"] = materialOrderPostData["materialOrder.customerId"];
	materialSubOrderPostData["materialSubOrder.customerName"] = materialOrderPostData["materialOrder.customerName"];
	materialSubOrderPostData["materialSubOrder.designerId"] = materialOrderPostData["materialOrder.designerId"];
	materialSubOrderPostData["materialSubOrder.designerName"] = materialOrderPostData["materialOrder.designerName"];
	
	com.post(api.ds.couponType, {}, function(res){
		materialSubOrder.couponType = res.materialCouponTypes;
		$("#couponType").bindData(materialSubOrder.couponType, 'key', 'value', false);
	});
	
	$("#approveManSel").chosen({
		allow_single_deselect : true
	});
	$("#approveManSel_chosen input").bind("input", function() {
		var pinyinName = $(this).val();
		if ($(this).val() != "") {
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin" : pinyinName, "userApprove.type" : 9}, function(res) {
				if (res.errorCode == 0) {
					var html1 = '<option value="">&nbsp;</option>';
					if (res.autoFillKeyValue != null) {
						var i = 0;
						for(i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#approveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#approveManSel_chosen").css("width", "200px");
	
	materialSubOrder.approveSaveBtn = $("#approveSaveBtn").on("click", function(){
		
		if(com.validate('approvalMaterialFullPaymentModal')){
			return;
		}
		
		var options = {
			"approval.receiverId": $("#approveManSel").val(),
			"approval.comment": "",
			"approvalMaterialFullPayment.msoId": materialSubOrderPostData["approvalMaterialFullPayemnt.msoId"],
			"approvalMaterialFullPayment.referMoney": materialSubOrderPostData["approvalMaterialFullPayment.referMoney"],
		}
		
		com.post(api.approval.submitApprovalForMaterialFullPayment, options);
		
		materialSubOrder.approvalMaterialFullPaymentModal.modal("hide");
	});
	
	var subOrderSearchOpts = {
		url: null,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialSubOrder.orderListGrid,
		items: [
	        {label:"设计师",id:"designerName",name:"designerName", type:'text'},
	        {label:"楼盘",id:"village",name:"village",type:"text",op:"eq"}
		]
	};
	$("#orderSearchDiv").flSearch(subOrderSearchOpts);
	
	materialSubOrder.listGrid.jqGrid({		
		url: api.material.pageMaterialSubOrderByUserId.url,
		postData: {"materialSubOrder.orderId":materialOrderPostData["materialOrder.orderId"]},
		colNames:['msoId', '编号', '客户Id', '客户名称', '品类', '品牌', '类型', '总价', '状态', '预付款', '应收预付款', '预付款状态', '定金', '定金状态', '补款', '补款状态', '其他状态', '抹零', '厂商抹零', '券值', '券信息', '券信息', '备注', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'msoId', hidden:true},
		    {name:'msoNo', width: 200},
			{name:'customerId', hidden:true},
			{name:'customerName', hidden:true},
			{name:'materialType', hidden:true},
			{name:'materialBrand'},
			{name:'msoType', width: 100, formatter: msoTypeInit, align:"center"},
			{name:'total'},
			{name:'status', formatter: statusInit, hidden:true},
			{name:'advancePayment', hidden:true},
			{name:'realAdvancePayment', hidden:true},
			{name:'advanceStatus', hidden:true},
			{name:'depositPayment', width: 90},
			{name:'depositStatus', hidden:true},
			{name:'fullPayment', width: 90},
			{name:'fullStatus', hidden:true},
			{name:'otherStatus', hidden:true},
			{name:'maling', width: 90},
			{name:'venderMaling', width: 90},
			{name:'coupon', width: 90},
			{name:'couponInfoShow', width: 120, align:"center", formatter: couponInfoInit},
			{name:'couponInfo', hidden:true},
			{name:'des', formatter: desInit, align:"center"},
			{name:'action', width: 280, align:"center", sortable: false, editable: false, formatter: actionInit}
		], 
		pager : materialSubOrder.gridPager,
		caption: "订单信息列表  本页总额:<span id='showTotal'></span>",
		gridComplete: function(){
			
			var showTotal = 0.0;
			var _listGrid = $(this);
			var rowNum = parseInt(_listGrid.getGridParam("reccount"));
			
			for(var i=1;i<=rowNum;i++){
				showTotal = utils.accAdd(parseFloat(showTotal), parseFloat(_listGrid.getRowData(i).total));
			}
			
			$("#showTotal").text(Math.round(showTotal, 2));
			
			$('[data-rel="tooltip"]').tooltip('destroy').tooltip({container:'#materialSubOrderPageContent'});
		}
	});
	
	materialSubOrder.listGrid.navGrid(materialSubOrder.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}
	).navButtonAdd(materialSubOrder.gridPager, {
		caption: "",
		buttonicon: "icon-mail-forward",
		title: "返回",
		onClickButton: function(){
			$(".tooltip").remove();
			$("#fl-container").load(api.index.materialOrderIndex.url);
		},
		position: "first",
	});
});

function couponInfoInit(cellvalue, options, rowdata){
	
	var couponInfo = "";
	
	if(cellvalue){
		couponInfo = cellvalue;
	}else{
		couponInfo = rowdata.couponInfo;
	}
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+couponInfo+'">券信息</span>';
	html += "<input type='text' class='hide' value='"+couponInfo+"' />";
	return html;
}

function desInit(cellvalue, options, rowdata){
	var des = rowdata.des;
	
	var html = '<span class="btn btn-minier" data-rel="tooltip" data-placement="left" title="'+des+'">备注</span>';
	html += "<input type='text' class='hide' value='"+des+"' />";
	return html;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	var materialSubOrderDelFlag = "";
	var materialSubOrderAddFlag = "";
	var materialSubOrderMendFlag = "";
	
	var rowId = options.rowId;
	
	if(rowdata.depositStatus != "0" || rowdata.fullStatus != "0"){
		materialSubOrderDelFlag = "disabled='true'";
	}
	
	if(rowdata.fullStatus != "0"){
		materialSubOrderAddFlag = "disabled='true'";
	}
	
	if(rowdata.fullStatus != "3" || (rowdata.otherStatus & 2) != 2){
		materialSubOrderMendFlag = "disabled='true'";
	}
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="' + rowId + '_viewMaterialSubOrderAdd" class="btn btn-minier btn-inverse" ' + materialSubOrderAddFlag + ' onclick="viewMaterialSubOrderAddIndex(\'' + rowId + '\');">添项</button>';
	result += '<button id="viewMateriSubOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewMaterialSubOrderDetailIndex(\'' + rowId + '\', \'' + rowdata.depositStatus + '\', \'' + rowdata.fullStatus + '\');">子项</button>';
	result += '<button id="' + rowId + '_dialogMaterialOrderPayment" class="btn btn-minier btn-primary" onclick="dialogMaterialSubOrderMoney(' + rowId + ');">款项</button>';
	result += '<button id="collectMaterialSubOrder" class="btn btn-minier btn-info" onclick="viewMaterialSubOrderCollection(\'' + rowdata.msoId + '\');">收款</button>';
	result += '<button id="viewMaterialSubOrderMend" class="btn btn-minier btn-yellow" ' + materialSubOrderMendFlag + ' onclick="viewMaterialSubOrderMendIndex(\'' + rowId + '\', \'' + rowdata.msoId + '\');">补货</button>';
	result += '<button id="viewMaterialSubOrderRefund" class="btn btn-minier btn-danger" onclick="viewMaterialSubOrderRefundIndex(\'' + rowdata.msoId + '\');">退货</button>';
	result += '<button id="viewMaterialSubOrderRefund" class="btn btn-minier btn-grey" onclick="deliverMaterialSubOrder(\'' + rowdata.msoId + '\');">送货</button>';
	result += '<button id="receiptMaterialSubOrder" class="btn btn-minier btn-success" onclick="receiptMaterialSubOrder(\'' + rowdata.msoId + '\');">打印</button>';
	result += '<button id="' + rowId + '_deleteMaterialSubOrder" class="btn btn-minier btn-danger" ' + materialSubOrderDelFlag + ' onclick="deleteMaterialSubOrder(\'' + rowId + '\', \'' + rowdata.msoId + '\');">删除</button>';
	result += '</div>';
	
	return result;
}

function msoTypeInit(cellvalue, options, rowdata){
	return '<span class="label label-info">' + materialSubOrder.materialSaleOrderTypeData[cellvalue];
}

function statusInit(cellvalue, options, rowdata){
	return '<span class="label label-info">' + materialSubOrder.materialSaleOrderStatusData[cellvalue] + "</span>";
}

function saveData(){
	
}

function viewMaterialSubOrderAddIndex(rowId){
	
	var rowInfo = materialSubOrder.listGrid.jqGrid('getRowData', rowId);
	
	materialSubOrderPostData["materialSubOrder.msoId"] = rowInfo["msoId"];
	materialSubOrderPostData["materialSubOrder.materialBrand"] = rowInfo["materialBrand"];
	
	$("#materialSubOrderPageContent").load(api.index.materialSubOrderAddIndex.url);
}

function viewMaterialSubOrderDetailIndex(rowId, depositStatus, fullStatus){
	
	var rowInfo = materialSubOrder.listGrid.jqGrid('getRowData', rowId);
	
	materialSubOrderPostData["materialSubOrder.msoId"] = rowInfo["msoId"];
	materialSubOrderPostData["materialSubOrder.msoNo"] = rowInfo["msoNo"];
	materialSubOrderPostData["materialSubOrder.depositStatus"] = rowInfo["depositStatus"];
	materialSubOrderPostData["materialSubOrder.fullStatus"] = rowInfo["fullStatus"];
	materialSubOrderPostData["materialSubOrder.customerId"] = rowInfo["customerId"];
	materialSubOrderPostData["materialSubOrder.customerName"] = rowInfo["customerName"];
	materialSubOrderPostData["materialSubOrder.materialBrand"] = rowInfo["materialBrand"];
	materialSubOrderPostData["materialSubOrder.maling"] = rowInfo["maling"];
	materialSubOrderPostData["materialSubOrder.venderMaling"] = rowInfo["venderMaling"];
	
	$("#materialSubOrderPageContent").load(api.index.materialSubOrderDetailIndex.url);
}

function viewMaterialSubOrderMendIndex(rowId, msoId){
	
	var rowInfo = materialSubOrder.listGrid.jqGrid('getRowData', rowId);
	
	materialSubOrderPostData["materialSubOrder.customerId"] = rowInfo["customerId"];
	materialSubOrderPostData["materialSubOrder.customerName"] = rowInfo["customerName"];
	materialSubOrderPostData["materialSubOrder.orderId"] = materialOrderPostData["materialOrder.orderId"];
	materialSubOrderPostData["materialSubOrder.designerId"] = materialOrderPostData["materialOrder.designerId"];
	materialSubOrderPostData["materialSubOrder.designerName"] = materialOrderPostData["materialOrder.designerName"];
	
	materialOrder.msoId = msoId;
	materialOrder.saleType = "mend";
	
	$("#materialSubOrderPageContent").load(api.index.materialSaleOrderIndex.url);
}

function viewMaterialSubOrderRefundIndex(msoId){
	materialSubOrderPostData["materialSubOrder.msoId"] = msoId;
	$("#materialSubOrderPageContent").load(api.index.materialOrderRefundIndex.url);
}

function dialogMaterialSubOrderMoney(rowId){
	
	var options = materialSubOrder.listGrid.jqGrid('getRowData', rowId);
	
	var total = options.total;
	
	materialSubOrderPostData["materialSubOrder.rowId"] = rowId;
	
	materialSubOrderPostData["materialSubOrder.msoId"] = options.msoId;
	materialSubOrderPostData["materialSubOrder.orderId"] = options.orderId;
	materialSubOrderPostData["materialSubOrder.orderAddr"] = options.orderAddr;
	materialSubOrderPostData["materialSubOrder.materialType"] = options.materialType;
	materialSubOrderPostData["materialSubOrder.materialBrand"] = options.materialBrand;
	
	materialSubOrder.materialSubOrderItems.realDepositPayment.val(options.depositPayment);
	materialSubOrder.materialSubOrderItems.realFullPayment.val(options.fullPayment);
	
	for(var name in materialSubOrder.materialSubOrderPaymentTypeNameData){
		$("#"+name+"Payment").val("").removeAttr("readonly");
		$("#"+name+"CancelBtn").css("display", "none").unbind("click");
		$("#"+name+"PaymentInfo").css("display", "none").html("");
		$("#"+name+"PaymentBtn").css("display", "none").unbind("click");
		$("#"+name+"RefundBtn").css("display", "none").unbind("click");
	}
	
	materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "none");
	
	var depositStatus = options["depositStatus"];
	var depositPayment = options["depositPayment"];
	var fullStatus = options["fullStatus"];
	var fullPayment = options["fullPayment"];
	var otherStatus = options["otherStatus"];
	var total = options["total"];
	var maling = options["maling"];
	var venderMaling = options["venderMaling"];
	var coupon = options["coupon"];
	
	materialSubOrderPostData["materialSubOrder.depositStatus"] = depositStatus;
	materialSubOrderPostData["materialSubOrder.fullStatus"] = fullStatus;
	materialSubOrderPostData["materialSubOrder.otherStatus"] = otherStatus;
	
	materialSubOrder.materialSubOrderItems.depositPaymentBtn.unbind("click").on("click", function(){
		
		$("#paymentInfo").html("");
		
		var args = {};
		var url = api.payment.addMaterialPayment;
		var key = $(this).attr("key");
		var paymentType = materialSubOrder.materialSubOrderPaymentTypeNameData[key];
		
		var fullPayment = materialSubOrder.materialSubOrderItems.fullPayment.val();
		
		args["materialPayment.msoId"] = options.msoId;
		args["materialPayment.orderId"] = materialSubOrderPostData["materialSubOrder.orderId"];
		args["materialPayment.customerId"] = materialSubOrderPostData["materialSubOrder.customerId"];
		args["materialPayment.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
		args["materialPayment.materialType"] = materialSubOrderPostData["materialSubOrder.materialType"];
		args["materialPayment.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
		args["materialPayment.paymentType"] = paymentType;
		args["materialPayment.referMoney"] = $("#"+key+"Payment").val();
		
		if(args["materialPayment.referMoney"] == 0){
			$("#paymentInfo").html("<h5>定金款项提交不能为0或者空 !</h5>");
			
			com.showAlert(com.warning, "定金款项提交不能为0或者空");
			
			return false;
		}
		
		var btn = $(this).button("loading");
		
		com.post(url, args, function(result){
			materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.depositPaymentInfo.css("display", "inline").text(materialSubOrder.materialSubOrderPaymentStatusData[1]);
			materialSubOrder.materialSubOrderItems.depositPayment.val(result.materialPayment.referMoney).attr("readonly", "readonly");
			materialSubOrder.materialSubOrderItems.realDepositPayment.val(result.materialPayment.referMoney);
			
			materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], key + "Payment", result.materialPayment.referMoney);
			materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], key + "Status", 1);
			
			materialSubOrderPostData["materialSubOrder.depositStatus"] = 1;
			
			var _fullPayment = materialSubOrder.materialSubOrderItems.fullPayment.val();
			var _caclFullPayment = utils.accSub(parseFloat(_fullPayment), parseFloat(result.materialPayment.referMoney));
			materialSubOrder.materialSubOrderItems.fullPayment.val(_caclFullPayment);
			
			$("#"+rowId+"_deleteMaterialSubOrder").attr("disabled", true);
			
			if(_caclFullPayment < 0){
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
//				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "inline");
			}else{
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
//				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
			}
			
			materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "inline");
			
			btn.button("reset");
		}, function(result){
			btn.button("reset");
		});
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.depositCancelBtn.unbind("click").on("click", function(){
		
		$("#paymentInfo").html("");
		
		var options = {};
		options["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
		options["materialPayment.paymentType"] = 2;
		options["materialPayment.paymentStatus"] = depositStatus;
		
		var btn = $(this).button("loading");
		
		com.post(api.payment.cancelMaterialPayment, options, function(result){
			
			if(result.materialPayment.paymentStatus == 0){
				
				var _depositPayment = materialSubOrder.materialSubOrderItems.depositPayment.val();
				var _fullPayment = materialSubOrder.materialSubOrderItems.fullPayment.val();
			
				materialSubOrder.materialSubOrderItems.fullPayment.val(utils.accAdd(parseFloat(_depositPayment), parseFloat(_fullPayment)));
				
				materialSubOrder.materialSubOrderItems.depositPayment.removeAttr("readonly").val("0");
				materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.depositPaymentInfo.css("display", "none").text("");
				materialSubOrder.materialSubOrderItems.realDepositPayment.val(0);
				
				materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "depositStatus", 0);
				materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "depositPayment", 0);
				
				materialSubOrderPostData["materialSubOrder.depositStatus"] = 0;
				
				$("#"+rowId+"_deleteMaterialSubOrder").attr("disabled", false);
				
				materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
			}
			
			btn.button("reset");
		}, function(result){
			btn.button("reset");
		});
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.depositRefundBtn.unbind("click").on("click", function(){
		
		$("#paymentInfo").html("");
		
		var options = {};
		options["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
		options["materialPayment.paymentType"] = 2;
		
		var btn = $(this).button("loading");
		
		bootbox.confirm("是否需要进行定金退款动作?", function(result) {
			if(result){
				com.post(api.payment.refundMaterialPayment, options, function(result){
					
					var _depositPayment = materialSubOrder.materialSubOrderItems.depositPayment.val();
					var _fullPayment = materialSubOrder.materialSubOrderItems.fullPayment.val();
				
					materialSubOrder.materialSubOrderItems.fullPayment.val(utils.accAdd(parseFloat(_depositPayment), parseFloat(_fullPayment)));
					
					materialSubOrder.materialSubOrderItems.depositPayment.removeAttr("readonly").val("0");
					materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "none");
					materialSubOrder.materialSubOrderItems.depositPaymentInfo.css("display", "none").text("");
					materialSubOrder.materialSubOrderItems.realDepositPayment.val(0);
					
					materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "depositStatus", 0);
					materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "depositPayment", 0);
					
					materialSubOrderPostData["materialSubOrder.depositStatus"] = 0;
					
					materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
					materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "none");
					materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
					materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
					
					btn.button("reset");
				}, function(result){
					btn.button("reset");
				});
			}else{
				btn.button("reset");
			}
		});
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.fullPaymentBtn.unbind("click").on("click", function(){
		
		$("#paymentInfo").html("");
		
		var args = {};
		var url = api.payment.addMaterialPayment;
		var key = $(this).attr("key");
		var paymentType = materialSubOrder.materialSubOrderPaymentTypeNameData[key];
		
		if((materialSubOrderPostData["materialSubOrder.otherStatus"] & 1) == 1){
			
			materialSubOrderPostData["approvalMaterialFullPayemnt.msoId"] = options.msoId;
			materialSubOrderPostData["approvalMaterialFullPayment.referMoney"] = $("#"+key+"Payment").val();
			
			materialSubOrder.materialSubOrderMoneyModal.modal("hide");
			materialSubOrder.approvalMaterialFullPaymentModal.modal("show");
		}else{
			args["materialPayment.msoId"] = options.msoId;
			args["materialPayment.orderId"] = materialSubOrderPostData["materialSubOrder.orderId"];
			args["materialPayment.customerId"] = materialSubOrderPostData["materialSubOrder.customerId"];
			args["materialPayment.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
			args["materialPayment.materialType"] = materialSubOrderPostData["materialSubOrder.materialType"];
			args["materialPayment.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
			args["materialPayment.paymentType"] = paymentType;
			args["materialPayment.referMoney"] = $("#"+key+"Payment").val();
			
			var btn = $(this).button("loading");
			
			com.post(url, args, function(result){
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.fullPaymentInfo.text(materialSubOrder.materialSubOrderPaymentStatusData[1]).css("display", "inline");
				materialSubOrder.materialSubOrderItems.fullPayment.val(result.materialPayment.referMoney).attr("readonly", "readonly");
				materialSubOrder.materialSubOrderItems.realFullPayment.val(result.materialPayment.referMoney);
				
				materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], key+"Payment", result.materialPayment.referMoney);
				materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], key+"Status", 1);
				
				materialSubOrderPostData["materialSubOrder.fullStatus"] = 1;
				
				materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "none");
				
				if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 0){
					materialSubOrder.materialSubOrderItems.depositPayment.attr("readonly", "readonly");
					materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "none");
					materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "none");
				}
				
				materialSubOrder.materialSubOrderItems.couponBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.couponInfo.css("display", "none");
				
				materialSubOrder.materialSubOrderItems.malingBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
				
				materialSubOrder.materialSubOrderItems.fullCancelBtn.css("display", "inline");
				
				$("#"+rowId+"_viewMaterialSubOrderAdd").attr("disabled", true);
				
				btn.button("reset");
			}, function(result){
				btn.button("reset");
			});
		}
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.fullRefundBtn.unbind("click").on("click", function(){
		$("#paymentInfo").html("");
		
		var args = {};
		var url = api.payment.addMaterialPayment;
		var key = $(this).attr("key");
		var paymentType = materialSubOrder.materialSubOrderPaymentTypeNameData[key];
		
		args["materialPayment.msoId"] = options.msoId;
		args["materialPayment.orderId"] = materialSubOrderPostData["materialSubOrder.orderId"];
		args["materialPayment.customerId"] = materialSubOrderPostData["materialSubOrder.customerId"];
		args["materialPayment.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
		args["materialPayment.materialType"] = materialSubOrderPostData["materialSubOrder.materialType"];
		args["materialPayment.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
		args["materialPayment.paymentType"] = paymentType;
		args["materialPayment.referMoney"] = Math.abs(materialSubOrder.materialSubOrderItems.fullPayment.val());
		
		var btn = $(this).button("loading");
		
		com.post(url, args, function(result){
			materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.fullPaymentInfo.text(materialSubOrder.materialSubOrderPaymentStatusData[1]).css("display", "inline");
			materialSubOrder.materialSubOrderItems.fullPayment.val(-result.materialPayment.referMoney).attr("readonly", "readonly");
			materialSubOrder.materialSubOrderItems.realFullPayment.val(-result.materialPayment.referMoney);
			
			materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "fullPayment", -result.materialPayment.referMoney);
			materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "fullStatus", 1);
			
			materialSubOrderPostData["materialSubOrder.fullStatus"] = 1;
			
			materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "none");
			
			if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 0){
				materialSubOrder.materialSubOrderItems.depositPayment.attr("readonly", "readonly");
				materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "none");
			}
			
			materialSubOrder.materialSubOrderItems.couponBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.couponInfo.css("display", "none");
			
			materialSubOrder.materialSubOrderItems.malingBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
			
			materialSubOrder.materialSubOrderItems.fullCancelBtn.css("display", "inline");
			
			$("#"+rowId+"_viewMaterialSubOrderAdd").attr("disabled", true);
			
			btn.button("reset");
		}, function(result){
			btn.button("reset");
		});
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.fullCancelBtn.unbind("click").on("click", function(){
		
		$("#paymentInfo").html("");
		
		var options = {};
		options["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
		
		var fullPayment = materialSubOrder.materialSubOrderItems.fullPayment.val();
		
		if(parseFloat(fullPayment) < 0){
			options["materialPayment.paymentType"] = 5;
		}else{
			options["materialPayment.paymentType"] = 3;
		}
		options["materialPayment.paymentStatus"] = fullStatus;
		
		var btn = $(this).button("loading");
		
		com.post(api.payment.cancelMaterialPayment, options, function(result){
			
			if(result.materialPayment.paymentStatus == 0){
				materialSubOrder.materialSubOrderItems.fullCancelBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.fullPaymentInfo.css("display", "none").text("");
				materialSubOrder.materialSubOrderItems.realFullPayment.val(result.materialPayment.referMoney);
				
				materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "fullStatus", 0);
				materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "fullPayment", 0);
				
				materialSubOrderPostData["materialSubOrder.fullStatus"] = 0;
				
				if(materialSubOrder.materialSubOrderItems.fullPayment.val() < 0){
					materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
					materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "inline");
				}else{
					materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
					materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
				}
				
				if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 1){
					materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "inline");
				}else if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 0){
					materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
					materialSubOrder.materialSubOrderItems.depositPayment.removeAttr("readonly");
				}else if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 2){
					materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "inline"); // inline
				}
				
				materialSubOrder.materialSubOrderItems.couponBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.couponInfo.css("display", "none");
				
				materialSubOrder.materialSubOrderItems.malingBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
				
				$("#"+rowId+"_viewMaterialSubOrderAdd").attr("disabled", false);
			}
			
			btn.button("reset");
		}, function(result){
			btn.button("reset");
		});
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.couponBtn.unbind("click").click(function(){
		
		materialSubOrderPostData["couponCommitType"] = 1;
		
		materialSubOrder.materialSubOrderItems.couponBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.couponInfo.css("display", "inline");
		materialSubOrder.materialSubOrderItems.couponValue.val(0);
		
		$(this).css("display", "none");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.couponRefundBtn.click(function(){
		
		materialSubOrderPostData["couponCommitType"] = 2;
		
		materialSubOrder.materialSubOrderItems.couponBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.couponInfo.css("display", "inline");
		materialSubOrder.materialSubOrderItems.couponValue.val(0);
		
		$(this).css("display", "none");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.couponCommitBtn.unbind("click").click(function(){
		
		var url = "";
		var couponValue = materialSubOrder.materialSubOrderItems.couponValue.val();
		var couponType = $("#couponType").val();
		
		var options = {
			"materialSubOrder.msoId": materialSubOrderPostData["materialSubOrder.msoId"],
			"materialSubOrder.coupon": couponValue,
			"materialSubOrder.couponInfo": "#" + couponType + ":" + couponValue + "#",
		};
		
		if(!/^[0-9]+(\.[0-9]{1,2})?$/.test(couponValue) || parseFloat(couponValue) < 0){
			
			com.showAlert(com.error, "券金额格式错误");
			
			return false;
		}
		
		if(materialSubOrderPostData["couponCommitType"] == 1){
			url = api.material.updateMaterialSubOrderForCoupon;
		}else if(materialSubOrderPostData["couponCommitType"] == 2){
			url = api.payment.refundMaterialPaymentForCoupon;
		}
		
		var btn = $(this).button("loading");
		
		com.post(url, options, function(res){
			
			var originalCouponValue = materialSubOrder.materialSubOrderItems.coupon.val();
			var fullPaymentValue = materialSubOrder.materialSubOrderItems.fullPayment.val();
			
			materialSubOrder.materialSubOrderItems.coupon.val(couponValue);
			materialSubOrder.materialSubOrderItems.fullPayment.val(utils.accSub(utils.accAdd(fullPaymentValue, originalCouponValue), couponValue));
			
			if(materialSubOrderPostData["materialSubOrder.fullStatus"] == 0){
				materialSubOrder.materialSubOrderItems.couponBtn.css("display", "inline");
			}else{
				if(materialSubOrder.materialSubOrderItems.coupon.val() == 0){
					materialSubOrder.materialSubOrderItems.couponRefundBtn.css("display", "inline");
				}else{
					materialSubOrder.materialSubOrderItems.couponRefundBtn.css("display", "none");
				}
			}
			
			materialSubOrder.materialSubOrderItems.couponInfo.css("display", "none");
			
			materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "coupon", couponValue);
			materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "couponInfoShow", res.materialSubOrder.couponInfo);
			
			$('[data-rel="tooltip"]').tooltip('destroy');
			$('[data-rel=tooltip]').tooltip({container:'#materialSubOrderPageContent'});
			
			com.showAlert(com.info, "券信息修改成功");
		});
		
		btn.button("reset");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.couponCancelBtn.unbind("click").click(function(){
		
		if(materialSubOrderPostData["materialSubOrder.fullStatus"] == 0){
			materialSubOrder.materialSubOrderItems.couponBtn.css("display", "inline");
		}else{
			if(materialSubOrder.materialSubOrderItems.coupon.val() == 0){
				materialSubOrder.materialSubOrderItems.couponRefundBtn.css("display", "inline");
			}else{
				materialSubOrder.materialSubOrderItems.couponRefundBtn.css("display", "none");
			}
		}
		
		materialSubOrder.materialSubOrderItems.couponInfo.css("display", "none");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.malingBtn.unbind("click").click(function(){
		
		materialSubOrder.materialSubOrderItems.malingBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.malingInfo.css("display", "inline");
		$("#malingValue").val(0);
		
		return false;
	});
	
	$("#malingCommitBtn").click(function(){
		
		var malingValue = $("#malingValue").val();
		
		var options = {
			"materialSubOrder.msoId": materialSubOrderPostData["materialSubOrder.msoId"],
			"materialSubOrder.maling": 0,
			"materialSubOrder.venderMaling": malingValue,
		};
		
		if(!/^[0-9]+(\.[0-9]{1,2})?$/.test(malingValue)){
			
			com.showAlert(com.error, "券金额格式错误");
			
			return false;
		}
		
		var btn = $(this).button("loading");
		
		com.post(api.material.updateMaterialSubOrderForMaling, options, function(){
			
			var originalMalingValue = materialSubOrder.materialSubOrderItems.maling.val();
			var fullPaymentValue = utils.accSub(utils.accAdd(materialSubOrder.materialSubOrderItems.fullPayment.val(), originalMalingValue), malingValue)
			
			materialSubOrder.materialSubOrderItems.maling.val(malingValue);
			materialSubOrder.materialSubOrderItems.fullPayment.val(fullPaymentValue);
			
			materialSubOrder.materialSubOrderItems.malingBtn.css("display", "inline");
			materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
			
			if(fullPaymentValue >= 0){
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
			}else{
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "inline");
			}
			
			materialSubOrder.listGrid.setCell(materialSubOrderPostData["materialSubOrder.rowId"], "maling", malingValue);
			
			com.showAlert(com.info, "券信息修改成功");
		});
		
		btn.button("reset");
		
		return false;
	});
	
	$("#malingCancelBtn").click(function(){
		
		materialSubOrder.materialSubOrderItems.malingBtn.css("display", "inline");
		materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.total.val(total);
	
	if(materialSubOrderPostData["materialSubOrder.fullStatus"] == 0){
		if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 0){
			materialSubOrder.materialSubOrderItems.depositPayment.val(depositPayment);
			materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.depositPaymentInfo.css("display", "none").text("");
			materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
			materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "none");
		}else{
			if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 1 && materialSubOrderPostData["materialSubOrder.fullStatus"] == 0){
				materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "inline");
			}
			
			if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 2 && materialSubOrderPostData["materialSubOrder.fullStatus"] == 0){
				materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "inline"); // inline
			}
			
			materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.depositPaymentInfo.text(materialSubOrder.materialSubOrderPaymentStatusData[depositStatus]).css("display", "inline");
			materialSubOrder.materialSubOrderItems.depositPayment.val(depositPayment).attr("readonly", "readonly");
		}
	}else{
		materialSubOrder.materialSubOrderItems.depositPayment.val(depositPayment);
		materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "none");
		
		if(materialSubOrderPostData["materialSubOrder.depositStatus"] == 0){
			materialSubOrder.materialSubOrderItems.depositPaymentInfo.css("display", "none").text("");
		}else{
			materialSubOrder.materialSubOrderItems.depositPaymentInfo.text(materialSubOrder.materialSubOrderPaymentStatusData[depositStatus]).css("display", "inline");
		}
	}
	
	if(materialSubOrderPostData["materialSubOrder.fullStatus"] == 0){
		materialSubOrder.materialSubOrderItems.fullCancelBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.fullPaymentInfo.css("display", "none").text("");
		
		$("#"+rowId+"_viewMaterialSubOrderAdd").attr("disabled", false);
		
		var _fullPayment = utils.accSub(utils.accSub(utils.accSub(total, depositPayment), utils.accAdd(maling, venderMaling)), coupon);
		
		materialSubOrder.materialSubOrderItems.fullPayment.val(_fullPayment).attr("readonly", "readonly");
		
		if(_fullPayment < 0){
			if(depositStatus == 2 || depositStatus == 3){
				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "inline");
			}
			materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
		}else{
			materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
			materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
		}
		
		if(total > 0){
//			materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
			materialSubOrder.materialSubOrderItems.couponBtn.css("display", "inline");	
			materialSubOrder.materialSubOrderItems.malingBtn.css("display", "inline");
		}else{
//			materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.couponBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.malingBtn.css("display", "none");
		}
		
		materialSubOrder.materialSubOrderItems.couponRefundBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.couponInfo.css("display", "none");
		
		materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
	}else{
		if(materialSubOrderPostData["materialSubOrder.fullStatus"] == 1){
			materialSubOrder.materialSubOrderItems.fullCancelBtn.css("display", "inline");
		}
		
		if(coupon == 0 && materialSubOrderPostData["materialSubOrder.fullStatus"] > 1){
			materialSubOrder.materialSubOrderItems.couponRefundBtn.css("display", "inline");
		}else{
			materialSubOrder.materialSubOrderItems.couponRefundBtn.css("display", "none");
		}
		
		$("#"+rowId+"_viewMaterialSubOrderAdd").attr("disabled", true);
		
		materialSubOrder.materialSubOrderItems.depositPayment.attr("readonly", "readonly");
		materialSubOrder.materialSubOrderItems.fullPayment.val(utils.accSub(utils.accSub(utils.accSub(total, depositPayment), utils.accAdd(maling, venderMaling)), coupon)).attr("readonly", "readonly");
		
		materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.fullPaymentInfo.text(materialSubOrder.materialSubOrderPaymentStatusData[materialSubOrderPostData["materialSubOrder.fullStatus"]]).css("display", "inline");
		
		materialSubOrder.materialSubOrderItems.couponBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.couponInfo.css("display", "none");
		
		materialSubOrder.materialSubOrderItems.malingBtn.css("display", "none");
		materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
	}
	
	materialSubOrder.materialSubOrderItems.maling.val(utils.accAdd(maling, venderMaling));
	materialSubOrder.materialSubOrderItems.coupon.val(coupon);
	
	materialSubOrder.materialSubOrderMoneyModal.modal("show");
}

function initCancelBtn(name){
	$("#"+name+"CancelBtn").css("display", "inline").on("click", function(){
		
		var options = {};
		options["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
		options["materialPayment.paymentType"] = name == "full" ? 2 : 1;
		
		com.post(api.payment.cancelMaterialPayment, args, function(result){
			$("#"+name+"CancelBtn").css("display", "none");
			if(name == "full" && options["materialPayment.depositStatus"] == 1){
				initCancelBtn("deposit");
			}
		});
		
		return false;
	});
}

function lockPaymentInput(rowId){
	
	var options = materialSubOrder.listGrid.jqGrid('getRowData', rowId);
	
	for(var paymentName in materialSubOrder.materialSubOrderPaymentTypeNameData){
		
		var status = options[paymentName+"Status"];
		
		if(status && status != 0){
			$("#"+paymentName+"PaymentInfo").text(materialSubOrder.materialSubOrderPaymentStatusData[status]);
			$("#"+paymentName+"PaymentInfo").css("display", "inline");
		}
		
		if(rowId != undefined && rowId != 0){
			$("#"+paymentName+"Payment").val(options[paymentName+"Payment"]);
		}
		
		$("#"+paymentName+"Payment").attr("readonly", "readonly");
		$("#"+paymentName+"PaymentBtn").css("display", "none");
	}
}

function receiptMaterialSubOrder(msoId){
	var url = api.index.materialSubOrderReceipt.url + "?type=1&materialSubOrder.msoId=" + msoId;
	window.open(url);
}

function deliverMaterialSubOrder(msoId){
	
	var options = {
		"materialSubOrder.msoId": msoId,
	}
	
	com.post(api.material.deliverMaterialSubOrder, options);
}

function deleteMaterialSubOrder(rowId, msoId){
	
	var options = {};
	
	options["materialSubOrder.msoId"] = msoId;
	
	com.post(api.material.deleteMaterialSubOrder, options, function(res){
		materialSubOrder.listGrid.delRowData(rowId);
	});
}

function viewMaterialSubOrderCollection(msoId){
	materialSubOrderPostData["materialSubOrder.msoId"] = msoId;
	$("#materialSubOrderPageContent").load(api.index.materialSubOrderCollectionIndex.url);
}
