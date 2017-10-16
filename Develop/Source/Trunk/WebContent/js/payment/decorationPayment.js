
var decorationPaymentPostData = {};

jQuery(function($) {

	var decorationPayment = {
			
		paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"],
		
		couponType: {},
		couponTypeData: {},
		
		orderPaymentId:null,
		
		saveBtn: null,
		cancellBtn: null,
		
		baseModal: null,
		addOrReduceModal:null,
		refundModal:null,
		refundDecorationPaymentModal:null,
		decorationPaymentItems: {},
		addReduceDetail:null,
		paymentId:null,
		
		items: {},
		
		editFlg:false,
		batchFlag: true,
		
		bankList:null,
		accountsList: [],
		
		paymentType:"增项款",
		orderId:null,
	};

    decorationPayment.items.cashCheckbox = $("#cashCheckbox");
    decorationPayment.items.bankCheckbox = $("#bankCheckbox");
    decorationPayment.items.checkvCheckbox = $("#checkvCheckbox");
    decorationPayment.items.installmentCheckbox = $("#installmentCheckbox");
    decorationPayment.items.accountsCheckbox = $("#accountsCheckbox");
    decorationPayment.items.advanceCheckbox = $("#advanceCheckbox");
    decorationPayment.items.couponCheckbox = $("#couponCheckbox");

	decorationPayment.refundDecorationPaymentModal = $("#refundDecorationPaymentModal");

	decorationPayment.baseModal = $("#baseItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#advancePayment", true);
	});
	
	decorationPayment.addReduceDetail = $("#addReduceDetail");
	
	decorationPayment.items.couponType = $("#couponType");
	
	$("#collectBtn").bindClick(payment);
	$("#saveRefundBtn").bindClick(refund);
	
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

	/*for(var i=0;i<decorationPayment.paymentModelNameData.length;i++){
		$("#" + decorationPayment.paymentModelNameData[i] + "Checkbox").on("click",function(e) {
			var _name = $(this).attr("key");
			var _checkboxId = "#" + _name + "Checkbox";
			var _divId = "#" + _name + "Div";
			
			if($(_checkboxId).attr("checked") != "checked"){
				$(_divId).removeClass("hide");
				$(_checkboxId).attr("checked","checked");
				
				if(_name == "advance"){
					com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.customerId": decorationPaymentPostData.customerId},function(res){
						$("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
						$("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
					});
				}
			}else{
				$(_divId).addClass("hide");
				$(_checkboxId).removeAttr("checked","checked");
			}
		});
	}*/
    $("#baseItemModal :checkbox").on("change", function(){
        $(this).prop("checked") ? $("[referCheckbox="+this.id+"]").show() : $("[referCheckbox="+this.id+"]").hide()
    });

	
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
	}, null,false);

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.paymentType));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier');
            var $btnDetail = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看明细');
            
            var propertyArr = [
               ["订单号:", v.orderId, "grey"],
               ["楼盘地址:", v.village + ''+v.houseNumber, "grey"],
               ["客户:", v.customer, "grey"],
               ["设计师:", v.designer, "grey"],
               ["设计部:", v.designerDepartment, "grey"],
               ["应收金额:", v.referMoney, "blue"],
            ];
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
           
            $divBtnWrap.append($btnCollect).appendTo($h3);
           
            if(v.paymentType.search('退款') != -1){
        		$btnCollect.text('退款').addClass("btn-danger");
        	}else if(v.paymentType == "减项款"){
        		$btnCollect.text('减项款').addClass("btn-danger");
        		$divBtnWrap.append($btnDetail);
        	}else if(v.paymentType == "增项款"){
        		$btnCollect.text('增项款').addClass("btn-info");
        		$divBtnWrap.append($btnDetail);
        	}else{
        		$btnCollect.text('收款').addClass("btn-info");
        	}
            
            $liLine.append($h3).append($ulProperty);
            
            $btnCollect.click(function(){
            	dialogPayment(v);
            });
            
            $btnDetail.click(function(){
            	addReduceDetail(v.autoId, v.paymentType, v.orderId);
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
	
	searcher.init(["orderId", "designer", "customerPhone", "village", "houseNumber"], "condList", api.payment.pageDecorationPaymentForCommit, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationPaymentPostData");
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.paymentType));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			var $btnRefund = $('<a></a>').addClass('btn btn-minier btn-danger').html('退款');
            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');

            var propertyArr = [
               ["订单号:", v.orderId, "grey"],
               ["楼盘地址:", v.village + ''+v.houseNumber, "grey"],
               ["客户:", v.customer, "grey"],
               ["设计师:", v.designer, "grey"],
               ["设计部:", v.designerDepartment, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collectUser, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus, "red"],
               ["备注:", v.des, "grey"],
            ];
            
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
				    info += decorationPayment.bankInfo[_i[0]] + " " + _i[1] + ", ";
				  }
				  
				  return info;
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

			if(v.paymentStatus == "已确认" && v.oneType == 0){
				$divBtnWrap.append($btnPrint).append($btnRefund).appendTo($h3);
			}else{
				$divBtnWrap.append($btnPrint).appendTo($h3);
			}

           
            $liLine.append($h3).append($ulProperty).append($ulStyle);

			$btnRefund.click(function(){
				decorationPayment.paymentId = v.autoId;
				approvalUtils.initqueryApprovalUser("refundApproveManSel",5);
				$("#referMoneyApproval").val(v.referMoney);
				decorationPayment.refundDecorationPaymentModal.modal("show");
			});
            
            $btnPrint.click(function(){
				if(v.collectUserId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配，不能打印");
					return false;
				}else{
					com.popup("专用收款收据__订单编号:" + v.orderId  ,api.index.decorationPaymentReceiptIndex.url + "?decorationOrder.orderId=" + v.orderId + "&decorationPayment.orderId=" + v.orderId + "&decorationReceipt.drId=" + v.drId + "&time=" + parent.params.loginTime,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true)
				}


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

	$("#saveRefundMoneyBtn").on('click', function(){

		if(com.validate("refundDecorationPaymentModal")){
			return;
		}

		var receiverId = $("#refundApproveManSel").find('input:checked').attr('userid');

		if(receiverId == null || receiverId == ""){
			com.showAlert(com.error,"请选择审批人!");
			return;
		}

		var options = {
			"approval.receiverId": receiverId,
			"approval.comment": $("#changeReason").val(),
			"approvalDecorationRefund.paymentId": decorationPayment.paymentId,
		};

		bootbox.confirm("确认要提交退款申请吗?", function(res) {
			if(res){
				com.post(api.approval.submitApprovalForDecorationRefund, options, function(res){
					com.showAlert(com.info, "提交成功");
				});
			}

			decorationPayment.refundDecorationPaymentModal.modal("hide");
		});


	});
	
	var hsearcher = new Searcher();
	
	hsearcher.init(["orderId", "designer", "customerPhone", "village", "houseNumber", "collectTimeDateRange"], "hcondList", api.payment.pageDecorationPaymentForHistory, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hdecorationPaymentPostData", null, false, null, function(){
    	
    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);
    	
    	return [$impa];
    }, "hresultList");
	
	function dialogPayment(payment){
		
		decorationPaymentPostData.paymentInfo = payment;

        com.cleanItems(decorationPayment.items);
		
		$("#paymentInfo").text("");
		$("#collectDes").val("");
		
		if(payment.paymentType.search('退款') != -1 || payment.paymentType == "减项款"){ // 退款
			initBaseModal();
			$("#myModalPayLabel").text("退款信息");
			$("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			$('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
			decorationPaymentPostData.orderId = payment.orderId;
			decorationPaymentPostData.customerId = payment.customerId;
            $("#collectBtn").addClass("hide");
            $("#saveRefundBtn").removeClass("hide");

		}else{
			initBaseModal();
			$("#myModalPayLabel").text("付款信息");
			$("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
            $('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
			decorationPaymentPostData.orderId = payment.orderId;
			decorationPaymentPostData.customerId = payment.customerId;
            $("#collectBtn").removeClass("hide");
            $("#saveRefundBtn").addClass("hide");
		}

        com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.customerId": decorationPaymentPostData.customerId},function(res){
            $("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
            $("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
        });

		decorationPayment.editFlg =  false;
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
			
			//$(_divId).addClass("hide");
			$(_checkboxId).removeAttr("checked").removeAttr("disabled");
			
			$(_inputId).val("");
			$(_selectId).val("");
			
			if(_name == "bank"){
				$("#bankDivGroup").html("");
				$("#bankAdd").attr("num", 0);
			}
		}
		
		$("#collectDes").val("");


		$("#checkvBankName option:first").prop("selected", 'selected');
		$("#installmentBankName option:first").prop("selected", 'selected');
		$("#accountsBankName option:first").prop("selected", 'selected');

		decorationPayment.items.couponType.chosen("destroy");
		decorationPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
		decorationPayment.items.couponType.bindData(decorationPayment.couponType, 'key', 'name');
		decorationPayment.items.couponType.trigger("chosen:updated");
		decorationPayment.baseModal.modal("show");
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

    function addReduceDetail(decorationPaymentId, paymentType, orderId){

        com.cleanItems(decorationPayment.items);
    	
    	decorationPayment.orderPaymentId = decorationPaymentId;
    	decorationPayment.paymentType = paymentType;
    	decorationPayment.orderId = orderId;
    	decorationPayment.addReduceDetail.modal("show");
    	
    	var options = {
    		"quotation.orderId": orderId,
    		"addReduce.dpId": decorationPaymentId,
    	};
    	
    	com.post(api.addReduce.queryAddReduceByDecorationPaymentId, options, function(res){
    		
    		var quotationItemSeacher = new Searcher();
    		quotationItemSeacher.init([], "acondList", api.addReduce.queryAddReduceItemByAddReduceId,  function(data){
    			var $tableWrap = $('#aresultList').empty();
    			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
    			
    			if(data && data.length){
    				$.each(data, function(i, v){
    					var $liLine = createAddReduceItem(v);
    					$liLine.appendTo($ul);
    				});
    				$ul.appendTo($tableWrap);
    			}
    		}, "pagenation", "decorationPaymentAddReduceDetailPostData", {"addReduce.arId": res.addReduce.arId}, true, "addReduceItems", null, 'aresultList');
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

    	return $liLine;
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
    					
//    					options["decorationActivityItems[" + couponCount + "].daiId"] = $(e).attr("index");
//    					options["decorationActivityItems[" + couponCount + "].num"] = _.children('span').children('input').val();
    					
//    					var num = _.children('span').children('input').val();
//    					var money = _.children('span').text().split(",")[1].split(':')[1]
    					
//    					_coupon = utils.accAdd(parseFloat(_coupon), utils.accMul(parseFloat(num), parseFloat(money)));
    					
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
    	
    	if($.isEmptyObject(args)){
			com.showAlert(com.warning, "无收款方式信息");
			return false;
		}
    	
    	var _info = decorationPaymentPostData.paymentInfo;
    	
		url = api.payment.collectDecorationPayment;
		
		for(var arg in args){
			options["decorationPayment."+arg] = args[arg];
		}
		orderId = _info.orderId;
		autoIds += "&paymentIds["+0+"]="+_info.autoId;
		
		options["decorationPayment.autoId"] = _info.autoId;
		options["decorationPayment.des"] = $("#collectDes").val();
    	
    	com.post(url, options, function(result){
    		
    		searcher.doSearch();
    		
    		decorationPayment.baseModal.modal("hide");
    		
    		var args = "&decorationReceipt.drId=" + result.decorationPayment.drId;
    		
    		bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
    			if(result){
					com.popup("专用收款收据__订单编号:" + orderId  ,api.index.decorationPaymentReceiptIndex.url + "?decorationOrder.orderId=" + orderId + "&decorationPayment.orderId=" + orderId + "" + args + "&time=" + parent.params.loginTime,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true);
    			}
    		});
    	});

    	decorationPaymentPostData.paymentInfo = null;
    }

    function refund(){
    	
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

        if(referPayment != realPayment){
            $("#paymentInfo").text("当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }


        if($.isEmptyObject(args)){
            com.showAlert(com.warning, "无退款方式信息");
            return false;
        }

        var _info = decorationPaymentPostData.paymentInfo;

        url = api.payment.collectDecorationPaymentForRefund;

        for(var arg in args){
            options["decorationPayment."+arg] = args[arg];
        }
        orderId = _info.orderId;
        autoIds += "&paymentIds["+0+"]="+_info.autoId;

        options["decorationPayment.autoId"] = _info.autoId;
        options["decorationPayment.des"] = $("#collectDes").val();

        com.post(url, options, function(result){

            searcher.doSearch();

            decorationPayment.baseModal.modal("hide");

            var args = "&decorationReceipt.drId=" + result.decorationPayment.drId;

            bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
                if(result){
                    com.popup("专用收款收据__订单编号:" + orderId  ,api.index.decorationPaymentReceiptIndex.url + "?decorationOrder.orderId=" + orderId + "&decorationPayment.orderId=" + orderId + "" + args + "&time=" + parent.params.loginTime,function () {
                        parent.layer.getFrameIndex(window.name);
                    },null,true);
                }
            });
        });

        decorationPaymentPostData.paymentInfo = null;
    }
    
    $('a[name="import"]', '#hpagenation').click(function () {
    	
    	if($('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
    	
    	if($('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		
		com.post(api.payment.pageDecorationPaymentForHistory, $.extend({}, params.hdecorationPaymentPostData, {"paging.noPage": 1}), function(res){
			
			$.exceler({
				column : [
					["订单号","orderId"],
					['楼盘地址',['village', 'houseNumber']],
					['客户','customer'],
					['设计师','designer'],
					['设计部','designerDepartment'],
					['应收金额', 'referMoney'],
					['收款人', 'collectUser'],
					['收款时间', 'collectTime'],
					['类型', 'paymentType'],
					['状态', 'paymentStatus'],
					['备注', 'des'],
					['现金', 'cash'],
					['银行', ['bank', 'bankInfo']],
					['转账', ['checkv', 'checkvBankName']],
					['分期', ['installment', 'installmentBankName']],
					['对公', ['accounts', 'accountsBankName']],
					['预付款', 'advance'],
					['券', ['coupon', 'couponInfo']],
				],
				list: res.paging.data,
			}, function(v){
				if(v.bank != null && v.bank != 0){
					  var $info = ' ';
					  var _s = v.bankInfo.split('#');
					  for(var i=1;i<_s.length-1;i++){
					    var _i = _s[i].split('|');
					    $info += decorationPayment.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
					  }
					  
					  v.bankInfo = $info;
				}
				
				v.checkvBankName = v.checkv != null && v.checkv != "0" ? decorationPayment.checkBankInfo[v.checkvBankName] : '';
				v.installmentBankName = v.installment != null && v.installment != "0" ? decorationPayment.bankInfo[v.installmentBankName] : '';
				v.accountsBankName = v.accounts != null && v.accounts != "0" ? decorationPayment.accountsInfo[v.accountsBankName] : '';
			});
		});
    });
	
	$("#history").removeClass("active");
});

