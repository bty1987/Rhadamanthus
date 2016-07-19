var materialPayment = {
	
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
	
	materialPayment.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	materialPayment.saveBtn = $("#saveBtn").on("click", payment);
	materialPayment.saveBtn = $("#saveRefundBtn").on("click", refund);
	materialPayment.cancelBtn = $("#cancelBtn").on("click", function(){
		materialPayment.historyFlag = false;
	});
	
	materialPayment.refundModal = $("#refundModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	
	materialPayment.items.couponType = $("#couponType");
	
	$.extend(com.validator, materialPayment.validator);
	
	$("#history").removeClass("active");
	
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
	
	var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){ 
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
        	
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier');
            
            var propertyArr = [
               ["订单号:", v.orderId, "grey"],
               ["主材号:", v.msoNo, "grey"],
               ["楼盘地址:", v.orderAddr, "grey"],
               ["客户:", v.customerName, "grey"],
               ["品牌:", v.materialBrand, "grey"],
               ["操作人:", v.createUserName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "mpIds",
				"class": "ace ace-checkbox-2",
				"mpId": v.mpId,
				"orderId": v.orderId,
				"referMoney": v.referMoney,
				"customerId": v.customerId,
				"paymentType": v.paymentType,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl');
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            $label.append($input).append($span).appendTo($h3);
			$h3.append($('<small></small>').addClass('blue').html(materialPayment.materialPaymentTypeData[v.paymentType]));
           
            $divBtnWrap.append($btnCollect).appendTo($h3);
            
            if([4, 5, 6, 7].indexOf(v.paymentType) != -1){
        		$btnCollect.text('退款').addClass("btn-danger");
        	}else{
        		$btnCollect.text('收款').addClass("btn-info");
        	}
            
            $liLine.append($h3).append($ulProperty);
            
            $btnCollect.click(function(){
            	dialogPayment(v);
            });
            
            return $liLine;
        };
      
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["orderId", "msoNo", "designer", "customerPhone", "orderAddr"], "condList", api.payment.pageMaterialPaymentBySubOrder, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialPaymentPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css('margin-top', '7px').css('margin-right', '7px');
    	var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('批量收款').appendTo($adda);
    	
    	return [$adda];
	});
	
	var hdisplayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){ 
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
        	
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            
            var propertyArr = [
               ["订单号:", v.orderId, "grey"],
               ["主材号:", v.msoNo, "grey"],
               ["楼盘地址:", v.orderAddr, "grey"],
               ["客户:", v.customerName, "grey"],
               ["品牌:", v.materialBrand, "grey"],
               ["操作人:", v.createUserName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collectUser, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus == 1 ? '待确认' : '已确认', "red"],
               ["备注:", v.des, "grey"],
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "hmpIds",
				"class": "ace ace-checkbox-2",
				"mpId": v.mpId,
				"mrId": v.mrId,
				"orderId": v.orderId,
				"referMoney": v.referMoney,
				"customerId": v.customerId,
				"paymentType": v.paymentType,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl');
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            var styleArr = [];
			
			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo){
				  var info = bank + ", ";
				  var _s = bankInfo.split('#');
				  for(var i=1;i<_s.length-1;i++){
				    var _i = _s[i].split('|');
				    info += materialPayment.bankInfo[_i[0]] + " " + _i[1] + ", ";
				  }
				  
				  return info
			})(v.bank, v.bankInfo), "grey"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "grey"]) : true;
			v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "grey"]) : true;
			v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "grey"]) : true;
			v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "grey"]) : true;
			v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "grey"]) : true;
			
			$.each(styleArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulStyle);
			});
			
			$label.append($input).append($span);
			$h3.append($('<small></small>').addClass('blue').html(materialPayment.materialPaymentTypeData[v.paymentType]));
           
            $divBtnWrap.append($btnPrint).appendTo($h3);
           
            $liLine.append($h3).append($ulProperty).append($ulStyle);
            
            $btnPrint.click(function(){
            	printPayment(v.mrId, v.orderId);
            });
            
            return $liLine;
        };
      
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();
	
	var hsearcher = new Searcher();
	
	hsearcher.init(["orderId", "msoNo", "designer", "customerPhone", "orderAddr", "collectTimeDateRange"], "hcondList", api.payment.pageMaterialPaymentForNotInitBySubOrder, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hmaterialPaymentPostData", null, false, null, null, "hresultList");
	
	$('a[name="collects"]', '#pagenation').click(function(){
		
		var $inputs = $('input[name="mpIds"]:checked');
		
		if(!$inputs.length) return;
		
		var _orderId = "";
		var _paymentType = 0;
		var _paymentTypeFlag = 0;
		var customerId = "";
		
		var sumMoney = 0;
		
		materialPaymentPostData.paymentInfo = [];
		
		$.each($inputs, function(i, v){
			
			var $input = $(v);
			
			var row = {
				"orderId": $input.attr("orderid"),
				"customerId": $input.attr("customerid"),
				"paymentType": $input.attr("paymenttype"),
				"referMoney": $input.attr("refermoney"),
				"mpId": $input.attr("mpid"),
			}
			
			if(_orderId == ""){
				_orderId = row.orderId;
			}else {
				if(_orderId != row.orderId){
					com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
					_paymentTypeFlag = 1;
				}
			}
			
			if(customerId == ""){
				customerId = row.customerId;
			}else{
				if(customerId != row.customerId){
					com.showAlert(com.warning, "批量收款不支持不同客户间的操作.");
					_paymentTypeFlag = 2;
				}
			}
			
			materialPaymentPostData.orderId = _orderId;
			materialPaymentPostData.customerId = customerId;
			
			if(_paymentType == 0){
				_paymentType = row.paymentType;
			}
			
			if([4, 5, 6, 7].indexOf(row.paymentType) != -1){
				sumMoney = utils.accSub(sumMoney, parseFloat(row.referMoney));
				if([4, 5, 6, 7].indexOf(_paymentType) == -1){
					_paymentTypeFlag = 3;
				}
			}else{
				sumMoney = utils.accAdd(sumMoney, parseFloat(row.referMoney));
				if([4, 5, 6, 7].indexOf(_paymentType) != -1){
					_paymentTypeFlag = 3;
				}
			}
			
//			if(row.paymentType == 4 || row.paymentType == 5 || row.paymentType == 6 || row.paymentType == 7){
//				sumMoney = utils.accSub(sumMoney, parseFloat(row.referMoney));
//				if(_paymentType != 4 || _paymentType != 5 || _paymentType != 6){
//					_paymentTypeFlag = true;
//				}
//			}else{
//				sumMoney = utils.accAdd(sumMoney, parseFloat(row.referMoney));
//				if(_paymentType == 4 || _paymentType == 5 || _paymentType == 6 || row.paymentType == 7){
//					_paymentTypeFlag = true;
//				}
//			}
			
			materialPaymentPostData.paymentInfo.push(row);
		});
		
		$("#sumMoney").val(sumMoney);
		$("#sumMoneyShow").html(sumMoney);
		
		if(_paymentTypeFlag != 0){
			_paymentTypeFlag != 1 ? _paymentTypeFlag != 2 ? com.showAlert(com.warning, "批量收款只能选择相同类型的收款项") : com.showAlert(com.warning, "批量收款只能选择相同类型的收款项") : com.showAlert(com.warning, "批量收款不支持不同订单间的操作");
			return false;
		}
		
		if(sumMoney >= 0){
			initBaseModal();
			
			$("#referMoney").val(sumMoney).attr("disabled", "disabled");
			$("#couponCheckbox").attr("disabled", "disabled");
			
			materialPayment.baseModal.modal("show");
		}else{
			com.showAlert(com.warning, "退款不支持批量操作!");
		}
    });
	
	function dialogPayment(payment){
		
		if([1, 2, 3].indexOf(payment.paymentType) != -1){ // 预付款、订金、全款
			initBaseModal();
			$("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			
			materialPaymentPostData.orderId = payment.orderId;
			materialPaymentPostData.customerId = payment.customerId;
			
			var options = {
				"decorationOrder.orderId": payment.orderId,
			}
			
//			com.post(api.decoration.queryDecorationActivityItemForCouponAVaildByOrderId, options, function(res){
//				var decorationActivityItems = res.decorationActivityItems;
//				
//				var couponInfos = [];
//				
//				for(var i=0;i<decorationActivityItems.length;i++){
//					
//					var _ = decorationActivityItems[i];
//					
//					couponInfos.push({"key": _.daiId, "value":_.activityItemName + ",金额:" + _.money + ",数量:" + _.num});
//				}
//				
//				materialPayment.items.couponType.chosen("destroy");
//				materialPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
//				materialPayment.items.couponType.bindData(couponInfos, 'key', 'value');
//				materialPayment.items.couponType.trigger("chosen:updated");
//			});
			
			materialPayment.items.couponType.chosen("destroy");
			materialPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
			materialPayment.items.couponType.bindData(materialPayment.couponType, 'key', 'name');
			materialPayment.items.couponType.trigger("chosen:updated");
			
			materialPayment.baseModal.modal("show");
		}else if([4, 5, 6, 7].indexOf(payment.paymentType) != -1){ // 退款
			initRefundModal();
			$("#refundSum").val(payment.referMoney).attr("disabled", "disabled");
			$("#refundCouponDiv").addClass("hide");
			
			com.post(api.payment.queryMaterialPaymentForCouponByMsoId, {"materialPayment.msoId":payment.msoId}, function(res){
				if(res.coupon != 0){
					$("#refundCouponDiv").removeClass("hide");
					$("#couponValue").attr("disabled", "disabled");
					$("#couponValue").val(res.materialPayment.coupon);
				}
			});		
			
			materialPayment.refundModal.modal("show");
		}
		
		materialPaymentPostData.paymentInfo = [payment];
		
		materialPayment.editFlg =  false;
	}
	
	function printPayment(mrId, orderId){
		var url = api.index.materialPaymentReceiptIndex.url + "?orderId=" + orderId + "&materialReceipt.mrId=" + mrId;
		window.open(url);
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
		
//		bankTimeInput.timepicker({minuteStep: 1, showSeconds: true, showMeridian: false});
	}
	
	function payment(){
		
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
						
//						options["decorationActivityItems[" + couponCount + "].daiId"] = $(e).attr("index");
//						options["decorationActivityItems[" + couponCount + "].num"] = _.children('span').children('input').val();
						
//						var num = _.children('span').children('input').val();
//						var money = _.children('span').text().split(",")[1].split(':')[1]
						
//						_coupon = utils.accAdd(parseFloat(_coupon), utils.accMul(parseFloat(num), parseFloat(money)));
						
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
		
		if(referPayment != realPayment){
			com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
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
				com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
				return false;
			}
		}
		
		url = api.payment.collectMaterialPayments;
		
		$.each(materialPaymentPostData.paymentInfo, function(i, v){
			options["materialPayments["+i+"].mpId"] = v.mpId;
		})
		
		for(var arg in args){
			options["materialReceipt."+arg] = args[arg];
		}
		
		resMrIdIndex = "materialReceipt";
		
		options["materialSubOrder.orderId"] = materialPaymentPostData.orderId;
		
		com.post(url, options, function(result){
			
			searcher.doSearch();
			
			materialPayment.historyFlag = false;
			
			var mrId = "&materialReceipt.mrId=" + result.materialReceipt.mrId;
			
			bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
				if(result){
					var url = api.index.materialPaymentReceiptIndex.url + "?orderId=" + mrId;
					window.open(url);
				}
			});
		});
		
		materialPayment.baseModal.modal("hide");
		
		materialPaymentPostData.paymentInfo = []
	}

	function refund(){
		
		if(com.validate()){
			return;
		}
		
		var url = "";
		var options = {};
		var type = "";
		var referPayment = $("#sumMoneyShow").text();
		var refundSum = $("#refundSum").val();
		var mpIds = "";
		
		if($("#refundCash").prop("checked")){
			type = "cash";
		}else{
			type = "bank";
		}
		
		url = api.payment.collectMaterialRefundPayment;
		
		var _info = materialPaymentPostData.paymentInfo[0];
		
		var referMoney = _info.referMoney;
		
		options["materialPayment.mpId"] = _info.mpId;
		options["materialPayment.msoId"] = _info.msoId;
		
		mpIds += "&mpIds[0]="+_info.mpId;
		
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
		
		com.post(url, options, function(result){
			searcher.doSearch();
		});
		
		materialPayment.refundModal.modal("hide");
		
		materialPaymentPostData.paymentInfo = []
	}
});
