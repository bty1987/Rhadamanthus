
jQuery(function($) {
	
	var materialOutsidePayment = {
			
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
	
	materialOutsidePayment.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	materialOutsidePayment.saveBtn = $("#saveBtn").on("click", payment);
	materialOutsidePayment.cancelBtn = $("#cancelBtn").on("click", function(){
		materialOutsidePayment.historyFlag = false;
	});
	
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
	
	com.post(api.common.queryReceiptType, {}, function(res){
		
		materialOutsidePayment.cash = [];
		materialOutsidePayment.bank = [];
		materialOutsidePayment.checkBank = [];
		materialOutsidePayment.accounts = [];
		
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				materialOutsidePayment.cash.push(v);
			}else if(v.type == 2){
				materialOutsidePayment.bank.push(v);
			}else if(v.type == 3){
				materialOutsidePayment.checkBank.push(v);
			}else if(v.type == 4){
				materialOutsidePayment.accounts.push(v);
			}
		});
		
		$("#cashInfo").bindData(materialOutsidePayment.cashInfo, 'key', 'value');
		$("#bankName").bindData(materialOutsidePayment.bankInfo, 'key', 'value');
		$("#checkvBankName").bindData(materialOutsidePayment.checkBankInfo, 'key', 'value');
		$("#installmentBankName").bindData(materialOutsidePayment.bankInfo, 'key', 'value');
		$("#accountsBankName").bindData(materialOutsidePayment.accountsInfo, 'key', 'value');
		$("#refundBankName").bindData(materialOutsidePayment.bankInfo, 'key', 'value');
	});
	
	$("#history").removeClass("active");
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier');
            
            var propertyArr = [
               ["楼盘地址:", v.orderAddr, "grey"],
               ["客户:", v.customerName, "grey"],
               ["品类:", v.materialTypeName, "grey"],
               ["品牌:", v.materialBrandName, "grey"],
               ["类型:", v.paymentType, "grey"],
               ["应收金额:", v.referMoney, "red"],
            ];
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            $divBtnWrap.append($btnCollect).appendTo($h3);
           
            if(v.paymentType == 1){
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
	
	searcher.init(["orderId", "orderAddr"], "condList", api.payment.pageMaterialOutsidePaymentForInit, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialOutsidePaymentPostData");
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
            
            var propertyArr = [
               ["楼盘地址:", v.orderAddr, "grey"],
               ["客户:", v.customerName, "grey"],
               ["品类:", v.materialTypeName, "grey"],
               ["品牌:", v.materialBrandName, "grey"],
               ["类型:", v.paymentType, "grey"],
               ["应收金额:", v.referMoney, "red"],
               ["收款人:", v.collectUser, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus == 1 ? '待确认' : '已确认', "red"],
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
				    info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
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
	
	hsearcher.init(["orderId", "orderAddr"], "hcondList", api.payment.pageMaterialOutsidePaymentForNotInit, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hmaterialOutsidePaymentPostData");
	
	function dialogPayment(v){
		
		$("#paymentInfo").text("");
		
		initBaseModal();
		
		materialOutsidePayment.mopId = v.mopId;
		
		$("#referMoney").val(v.referMoney).attr("disabled", "disabled");
		
		materialOutsidePayment.baseModal.modal("show");
		
		materialOutsidePayment.editFlg =  false;
	}
	
	function initRefundModal(){
		$("#refundBankCardDiv").addClass("hide");
		$("#refundBankCard").removeAttr("checked","checked");
		$("#refundBankName").removeClass("v_required");
		$("#refundCash").attr("checked","checked");
		
		$("#refundSum").val("");
		$("#refundBankName").val("");
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
		
		com.post(url, options, function(result){
			
			searcher.doSearch();
			hsearcher.doSearch();
			
			materialOutsidePayment.historyFlag = false;
			
			materialOutsidePayment.baseModal.modal("hide");
			
//			bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
//				if(result){
//					var url = "receiptMaterialOutsidePaymentIndex.do" + "?orderId=" + mipIds;
//					window.open(url);
//				}
//			});
		}, function(result){
			$("#paymentInfo").text(result);
		});
	}

	function refund(){
		
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
			searcher.doSearch();
			hsearcher.doSearch();
		});
		
		materialOutsidePayment.refundModal.modal("hide");
	}

	function initBaseModal(){
		
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
	
});

