
var materialSubOrderPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材子订单", "订单信息列表");
	
	var materialSubOrder = {
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
	materialSubOrder.materialSubOrderItems.couponType = $("#couponType");
	materialSubOrder.materialSubOrderItems.total = $("#total");
	materialSubOrder.materialSubOrderItems.maling = $("#maling");
	materialSubOrder.materialSubOrderItems.malingValue = $("#malingValue");
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
	materialSubOrder.materialSubOrderItems.malingCommitBtn = $("#malingCommitBtn");
	materialSubOrder.materialSubOrderItems.malingCancelBtn = $("#malingCancelBtn");
	
	materialSubOrder.materialSubOrderItems.depositPaymentInfo = $("#depositPaymentInfo");
	materialSubOrder.materialSubOrderItems.fullPaymentInfo = $("#fullPaymentInfo");
	materialSubOrder.materialSubOrderItems.couponInfo = $("#couponInfo");
	materialSubOrder.materialSubOrderItems.malingInfo = $("#malingInfo");
	
	materialSubOrderPostData["materialSubOrder.orderId"] = params.orderId;
	materialSubOrderPostData["materialSubOrder.customerId"] = params.customerId;
	materialSubOrderPostData["materialSubOrder.customerName"] = params.customerName;
	materialSubOrderPostData["materialSubOrder.designerId"] = params.designerId;
	materialSubOrderPostData["materialSubOrder.designerName"] = params.designerName;
	
	com.post(api.ds.couponType, {}, function(res){
		materialSubOrder.couponType = res.materialCouponTypes;
		$("#couponType").bindData(materialSubOrder.couponType, 'key', 'value', false);
	}, null, false);
	
	com.post(api.ds.materialInfo, {}, function(res){
		console.log(res);
		materialSubOrder.materialStatus = res.materialStatus;
	}, null, false);
	
	console.log(materialSubOrder.materialStatus);
	
	com.initChosen('approveManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"userApprove.type" : 9}, "autoFillKeyValue", "key", "value");
	
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
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.msoNo));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var $btnAdd = $('<a></a>').addClass('btn btn-minier btn-inverse').html('添项');
					var $btnSub = $('<a></a>').addClass('btn btn-minier btn-purple').html('子项');
					var $btnMoney = $('<a></a>').addClass('btn btn-minier btn-primary').html('款项');
					var $btnCollect = $('<a></a>').addClass('btn btn-minier btn-info').html('收款');
					var $btnMend = $('<a></a>').addClass('btn btn-minier btn-yellow').html('补货');
					var $btnRefund = $('<a></a>').addClass('btn btn-minier btn-danger').html('退货');
					var $btnSend = $('<a></a>').addClass('btn btn-minier btn-grey').html('送货');
					var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-success').html('打印');
					var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
					
					var propertyArr = [
						["品类:", v.materialType, "grey"],
						["品牌:", v.materialBrand, "grey"],
						["类型:", materialSubOrder.materialSaleOrderTypeData[v.msoType], "red"],
						["总价:", v.total, "blue"],
						["定金:", v.depositPayment, "blue"],
						["补款:", v.fullPayment, "blue"],
						["抹零:", v.maling, "green"],
						["厂商抹零:", v.venderMaling, "green"],
						["券额:", v.coupon, "green"],
						["券信息:", v.couponInfo, "grey"],
						["状态:", materialSubOrder.materialStatus[v.status], "red"],
						["备注:", v.des, "grey"],
					];
					
					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});
					
					$btnAdd.click(function(){
						viewMaterialSubOrderAddIndex(v);
					});
					
					$btnSub.click(function(){
						viewMaterialSubOrderDetailIndex(v);
					});
					
					$btnMoney.click(function(){
						dialogMaterialSubOrderMoney(v);
					});
					
					$btnCollect.click(function(){
						viewMaterialSubOrderCollection(v.msoId);
					});
					
					$btnMend.click(function(){
						viewMaterialSubOrderMendIndex(v);
					});
					
					$btnRefund.click(function(){
						viewMaterialSubOrderRefundIndex(v.msoId);
					});
					
					$btnSend.click(function(){
						deliverMaterialSubOrder(v.msoId);
					});
					
					$btnPrint.click(function(){
						receiptMaterialSubOrder(v.msoId);
					});
					
					$btnDel.click(function(){
						deleteMaterialSubOrder(v.msoId);
					});
					
					if([0, 1, 2, 3, 4, 5].indexOf(v.status) != -1){
						v.fullStatus == 0 && $divBtnWrap.append($btnAdd);
						(v.fullStatus == 3 || v.otherStatus & 2 == 2) && $divBtnWrap.append($btnMend);
						
						$divBtnWrap.append($btnSub).append($btnMoney).append($btnCollect).append($btnRefund).append($btnSend).append($btnPrint).appendTo($h3);
					}else{
						$divBtnWrap.append($btnSub).append($btnCollect).append($btnRefund).appendTo($h3);
					}
					
					$liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		}
		
		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();
	
	var searcher = new Searcher();
	
	searcher.init([], "condList", api.material.pageMaterialSubOrderByUserId, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialSubOrderPostData", {"materialSubOrder.orderId":params.orderId}, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'back').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('返回').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="back"]', '#pagenation').click(function(){
		$(".tooltip").remove();
		com.switchPage(api.index.materialOrderIndex.url);
	});
	
	function viewMaterialSubOrderAddIndex(v){
		
		materialSubOrderPostData["materialSubOrder.msoId"] = v.msoId;
		materialSubOrderPostData["materialSubOrder.materialBrand"] = v.materialBrand;
		
		params.historyOrderPage = api.index.materialSubOrderIndex.url;
		
		com.switchPage(api.index.materialSubOrderAddIndex.url);
	}
	
	function viewMaterialSubOrderDetailIndex(v){
		
		materialSubOrderPostData["materialSubOrder.msoId"] = v.msoId;
		materialSubOrderPostData["materialSubOrder.msoNo"] = v.msoNo;
		materialSubOrderPostData["materialSubOrder.depositStatus"] = v.depositStatus;
		materialSubOrderPostData["materialSubOrder.fullStatus"] = v.fullStatus;
		materialSubOrderPostData["materialSubOrder.customerId"] = v.customerId;
		materialSubOrderPostData["materialSubOrder.customerName"] = v.customerName;
		materialSubOrderPostData["materialSubOrder.materialBrand"] = v.materialBrand;
		materialSubOrderPostData["materialSubOrder.maling"] = v.maling;
		materialSubOrderPostData["materialSubOrder.venderMaling"] = v.venderMaling;
		
		com.switchPage(api.index.materialSubOrderDetailIndex.url);
	}
	
	function dialogMaterialSubOrderMoney(v){
		
		var total = v.total;
		
		materialSubOrderPostData["materialSubOrder.msoId"] = v.msoId;
		materialSubOrderPostData["materialSubOrder.orderId"] = v.orderId;
		materialSubOrderPostData["materialSubOrder.orderAddr"] = v.orderAddr;
		materialSubOrderPostData["materialSubOrder.materialType"] = v.materialType;
		materialSubOrderPostData["materialSubOrder.materialBrand"] = v.materialBrand;
		
		materialSubOrder.materialSubOrderItems.realDepositPayment.val(v.depositPayment);
		materialSubOrder.materialSubOrderItems.realFullPayment.val(v.fullPayment);
		
		for(var name in materialSubOrder.materialSubOrderPaymentTypeNameData){
			$("#" + name + "Payment").val("").removeAttr("readonly");
			$("#" + name + "CancelBtn").css("display", "none");
			$("#" + name + "PaymentInfo").css("display", "none").html("");
			$("#" + name + "PaymentBtn").css("display", "none");
			$("#" + name + "RefundBtn").css("display", "none");
		}
		
		materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "none");
		
		var depositStatus = v.depositStatus;
		var depositPayment = v.depositPayment;
		var fullStatus = v.fullStatus;
		var fullPayment = v.fullPayment;
		var otherStatus = v.otherStatus;
		var total = v.total;
		var maling = v.maling;
		var venderMaling = v.venderMaling;
		var coupon = v.coupon;
		
		materialSubOrderPostData["materialSubOrder.depositStatus"] = depositStatus;
		materialSubOrderPostData["materialSubOrder.fullStatus"] = fullStatus;
		materialSubOrderPostData["materialSubOrder.otherStatus"] = otherStatus;
		
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
//				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.couponBtn.css("display", "inline");	
				materialSubOrder.materialSubOrderItems.malingBtn.css("display", "inline");
			}else{
//				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
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
	
	function viewMaterialSubOrderCollection(msoId){
		params.historyPage = api.index.materialSubOrderIndex.url;
		materialSubOrderPostData["materialSubOrder.msoId"] = msoId;
		com.switchPage(api.index.materialSubOrderCollectionIndex.url);
	}
	
	function viewMaterialSubOrderMendIndex(v){
		
		materialSubOrderPostData["materialSubOrder.customerId"] = v.customerId;
		materialSubOrderPostData["materialSubOrder.customerName"] = v.customerName;
		materialSubOrderPostData["materialSubOrder.orderId"] = params.orderId;
		materialSubOrderPostData["materialSubOrder.designerId"] = params.designerId;
		materialSubOrderPostData["materialSubOrder.designerName"] = params.designerName;
		
		params.msoId = v.msoId;
		params.saleType = "mend";
		
		params.historyOrderPage = api.index.materialSubOrderIndex.url;
		
		com.switchPage(api.index.materialSaleOrderIndex.url);
	}
	
	function viewMaterialSubOrderRefundIndex(msoId){
		materialSubOrderPostData["materialSubOrder.msoId"] = msoId;
		
		com.switchPage(api.index.materialSubOrderRefundIndex.url);
	}
	
	function deliverMaterialSubOrder(msoId){
		com.post(api.material.deliverMaterialSubOrder, {"materialSubOrder.msoId": msoId});
	}
	
	function receiptMaterialSubOrder(msoId){
		var url = api.index.materialSubOrderReceipt.url + "?type=1&materialSubOrder.msoId=" + msoId + "&time=" + params.loginTime;
		window.open(url);
	}
	
	function deleteMaterialSubOrder(msoId){
		com.post(api.material.deleteMaterialSubOrder, {"materialSubOrder.msoId": msoId}, function(res){
			searcher.doSearch();
		});
	}
	
	materialSubOrder.materialSubOrderItems.depositPaymentBtn.unbind("click").on("click", function(){
		
		var args = {};
		
		var fullPayment = materialSubOrder.materialSubOrderItems.fullPayment.val();
		
		args["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
		args["materialPayment.orderId"] = materialSubOrderPostData["materialSubOrder.orderId"];
		args["materialPayment.customerId"] = materialSubOrderPostData["materialSubOrder.customerId"];
		args["materialPayment.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
		args["materialPayment.materialType"] = materialSubOrderPostData["materialSubOrder.materialType"];
		args["materialPayment.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
		args["materialPayment.paymentType"] = 2; // 定金
		args["materialPayment.referMoney"] = materialSubOrder.materialSubOrderItems.depositPayment.val();
		
		
		if(args["materialPayment.referMoney"] == 0){
			com.showAlert(com.warning, "定金款项提交不能为0或者空");
			return false;
		}
		
		var btn = $(this).button("loading");
		
		com.post(api.payment.addMaterialPayment, args, function(result){
			materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.depositPaymentInfo.css("display", "inline").text(materialSubOrder.materialSubOrderPaymentStatusData[1]);
			materialSubOrder.materialSubOrderItems.depositPayment.val(result.materialPayment.referMoney).attr("readonly", "readonly");
			materialSubOrder.materialSubOrderItems.realDepositPayment.val(result.materialPayment.referMoney);
			
			materialSubOrderPostData["materialSubOrder.depositStatus"] = 1;
			
			var _fullPayment = materialSubOrder.materialSubOrderItems.fullPayment.val();
			var _caclFullPayment = utils.accSub(parseFloat(_fullPayment), parseFloat(result.materialPayment.referMoney));
			materialSubOrder.materialSubOrderItems.fullPayment.val(_caclFullPayment);
			
			if(_caclFullPayment < 0){
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
			}else{
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
			}
			
			materialSubOrder.materialSubOrderItems.depositCancelBtn.css("display", "inline");
			
			searcher.doSearch();
		}, null, false);
		
		btn.button("reset");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.depositCancelBtn.unbind("click").on("click", function(){
		
		var options = {};
		options["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
		options["materialPayment.paymentType"] = 2;
		
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
				
				materialSubOrderPostData["materialSubOrder.depositStatus"] = 0;
				
				materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
				
				searcher.doSearch();
			}
		}, null, false);
		
		btn.button("reset");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.depositRefundBtn.unbind("click").on("click", function(){
		
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
					
					materialSubOrderPostData["materialSubOrder.depositStatus"] = 0;
					
					materialSubOrder.materialSubOrderItems.depositPaymentBtn.css("display", "inline");
					materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "none");
					materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "inline");
					materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
					
					searcher.doSearch();
				}, null, false);
			}
		});
		
		btn.button("reset");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.fullPaymentBtn.unbind("click").on("click", function(){
		
		var args = {};
		var url = api.payment.addMaterialPayment;
		var key = $(this).attr("key");
		
		if((materialSubOrderPostData["materialSubOrder.otherStatus"] & 1) == 1){
			
			materialSubOrderPostData["approvalMaterialFullPayemnt.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
			materialSubOrderPostData["approvalMaterialFullPayment.referMoney"] = materialSubOrder.materialSubOrderItems.fullPayment.val();
			
			com.updateChosen('approveManSel', '', '');
			
			materialSubOrder.materialSubOrderMoneyModal.modal("hide");
			materialSubOrder.approvalMaterialFullPaymentModal.modal("show");
		}else{
			args["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
			args["materialPayment.orderId"] = materialSubOrderPostData["materialSubOrder.orderId"];
			args["materialPayment.customerId"] = materialSubOrderPostData["materialSubOrder.customerId"];
			args["materialPayment.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
			args["materialPayment.materialType"] = materialSubOrderPostData["materialSubOrder.materialType"];
			args["materialPayment.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
			args["materialPayment.paymentType"] = 3; // 补款
			args["materialPayment.referMoney"] = materialSubOrder.materialSubOrderItems.fullPayment.val();
			
			var btn = $(this).button("loading");
			
			com.post(url, args, function(result){
				materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.fullPaymentInfo.text(materialSubOrder.materialSubOrderPaymentStatusData[1]).css("display", "inline");
				materialSubOrder.materialSubOrderItems.fullPayment.val(result.materialPayment.referMoney).attr("readonly", "readonly");
				materialSubOrder.materialSubOrderItems.realFullPayment.val(result.materialPayment.referMoney);
				
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
				
				searcher.doSearch();
			}, null, false);
			
			btn.button("reset");
		}
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.fullRefundBtn.unbind("click").on("click", function(){
		
		var args = {};
		
		args["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
		args["materialPayment.orderId"] = materialSubOrderPostData["materialSubOrder.orderId"];
		args["materialPayment.customerId"] = materialSubOrderPostData["materialSubOrder.customerId"];
		args["materialPayment.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
		args["materialPayment.materialType"] = materialSubOrderPostData["materialSubOrder.materialType"];
		args["materialPayment.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
		args["materialPayment.paymentType"] = 5; // 补款退款
		args["materialPayment.referMoney"] = Math.abs(materialSubOrder.materialSubOrderItems.fullPayment.val());
		
		var btn = $(this).button("loading");
		
		com.post(api.payment.addMaterialPayment, args, function(result){
			materialSubOrder.materialSubOrderItems.fullPaymentBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.fullRefundBtn.css("display", "none");
			materialSubOrder.materialSubOrderItems.fullPaymentInfo.text(materialSubOrder.materialSubOrderPaymentStatusData[1]).css("display", "inline");
			materialSubOrder.materialSubOrderItems.fullPayment.val(-result.materialPayment.referMoney).attr("readonly", "readonly");
			materialSubOrder.materialSubOrderItems.realFullPayment.val(-result.materialPayment.referMoney);
			
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
			
			searcher.doSearch();
		}, null, false);
		
		btn.button("reset");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.fullCancelBtn.unbind("click").on("click", function(){
		
		var options = {};
		
		options["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
		
		var fullPayment = materialSubOrder.materialSubOrderItems.fullPayment.val();
		
		if(parseFloat(fullPayment) < 0){
			options["materialPayment.paymentType"] = 5;
		}else{
			options["materialPayment.paymentType"] = 3;
		}
		options["materialPayment.paymentStatus"] = materialSubOrderPostData["materialSubOrder.fullStatus"];
		
		var btn = $(this).button("loading");
		
		com.post(api.payment.cancelMaterialPayment, options, function(result){
			
			if(result.materialPayment.paymentStatus == 0){
				materialSubOrder.materialSubOrderItems.fullCancelBtn.css("display", "none");
				materialSubOrder.materialSubOrderItems.fullPaymentInfo.css("display", "none").text("");
				materialSubOrder.materialSubOrderItems.realFullPayment.val(result.materialPayment.referMoney);
				
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
					materialSubOrder.materialSubOrderItems.depositRefundBtn.css("display", "inline");
				}
				
				materialSubOrder.materialSubOrderItems.couponBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.couponInfo.css("display", "none");
				
				materialSubOrder.materialSubOrderItems.malingBtn.css("display", "inline");
				materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
			}
			
			searcher.doSearch();
		}, null, false);
		
		btn.button("reset");
		
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
		var couponType = materialSubOrder.materialSubOrderItems.couponType.val();
		
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
			
			searcher.doSearch();
		}, null, false);
		
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
		materialSubOrder.materialSubOrderItems.malingValue.val(0);
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.malingCommitBtn.click(function(){
		
		var malingValue = materialSubOrder.materialSubOrderItems.malingValue.val();
		
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
			
			searcher.doSearch();
		});
		
		btn.button("reset");
		
		return false;
	});
	
	materialSubOrder.materialSubOrderItems.malingCancelBtn.click(function(){
		
		materialSubOrder.materialSubOrderItems.malingBtn.css("display", "inline");
		materialSubOrder.materialSubOrderItems.malingInfo.css("display", "none");
		
		return false;
	});
	
});

