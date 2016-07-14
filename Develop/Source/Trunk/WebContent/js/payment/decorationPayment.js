
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
	};
	
	decorationPayment.baseModal = $("#baseItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#advancePayment", true);
	});
	
	decorationPayment.refundModal = $("#refundModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	decorationPayment.addReduceDetail = $("#addReduceDetail");
	
	decorationPayment.items.couponType = $("#couponType");
	
	$("#collectBtn").on('click', payment);
	$("#saveRefundBtn").on('click', refund);
	
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

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            
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
            	printPayment(v.drId, v.orderId);
            });
            
            $btnEdit.click(function(){
            	editPayment(v);
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
	
	hsearcher.init(["orderId", "designer", "customerPhone", "village", "houseNumber", "collectTimeDateRange"], "hcondList", api.payment.pageDecorationPaymentForHistory, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hdecorationPaymentPostData", null, false, null, null, "hresultList");
	
	function dialogPayment(payment){
		
		decorationPaymentPostData.paymentInfo = payment;
		
		$("#paymentInfo").text("");
		
		if(payment.paymentType.search('退款') != -1 || payment.paymentType == "减项款"){ // 退款
			initRefundModal();
			$("#refundSum").val(payment.referMoney).attr("disabled", "disabled");
			$("#refundCouponDiv").addClass("hide");
			
			decorationPayment.refundModal.modal("show");
		}else{ // 定金 , 设计费 , 首付款 , 首付二期款 , 二期款 , 尾款
			initBaseModal();
			$("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			
			decorationPaymentPostData.orderId = payment.orderId;
			decorationPaymentPostData.customerId = payment.customerId;
			
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
//				decorationPayment.items.couponType.chosen("destroy");
//				decorationPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
//				decorationPayment.items.couponType.bindData(couponInfos, 'key', 'value');
//				decorationPayment.items.couponType.trigger("chosen:updated");
//			});
			
			decorationPayment.items.couponType.chosen("destroy");
			decorationPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
			decorationPayment.items.couponType.bindData(decorationPayment.couponType, 'key', 'name');
			decorationPayment.items.couponType.trigger("chosen:updated");
			
			decorationPayment.baseModal.modal("show");
		}
		
		decorationPayment.editFlg =  false;
		decorationPayment.historyFlag = false;
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
	
	function editPayment(row){
		
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
		}
	}
	
	function printPayment(drId, orderId){
		var url = api.index.decorationPaymentReceiptIndex.url + "?decorationOrder.orderId=" + orderId + "&decorationPayment.orderId=" + orderId + "&decorationReceipt.drId=" + drId;
		window.open(url);    
    };
    
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

    //------------------------------------增减项详细------------------------------
    function addReduceDetail(decorationPaymentId, paymentType, orderId){
    	
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
    			
    			console.log(data)

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
    	
    	var _info = decorationPaymentPostData.paymentInfo;
    	
		if(decorationPayment.historyFlag){
			url = api.payment.updateDecorationPayment;
		}else{
			url = api.payment.collectDecorationPayment;
		}
		
		for(var arg in args){
			options["decorationPayment."+arg] = args[arg];
		}
		orderId = _info.orderId;
		autoIds += "&paymentIds["+0+"]="+_info.autoId;
		
		options["decorationPayment.autoId"] = _info.autoId;
		options["decorationPayment.des"] = $("#collectDes").val();
    	
    	console.log(options);
    	
    	com.post(url, options, function(result){
    		
    		decorationPayment.historyFlag = false;
    		
    		searcher.doSearch();
    		
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
//    		var row = materialPayment.listGrid.jqGrid('getRowData', 1);
//    		com.post(api.payment.queryCustomerForAdvanceByCustomerId, {"materialPayment.customerId":row.customerId}, function(res){
//    			$("#advanceBalance").val(res.money).attr("readonly", "readonly");
//    		});
    	});
    	
    	decorationPaymentPostData.paymentInfo = null;
    }

    function refund(){
    	console.log("refund");
    	
    	if(com.validate()){
    		return;
    	}
    	
    	var url = api.payment.refundDecorationPayment;
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
    	
    	var _info = decorationPaymentPostData.paymentInfo;
    	
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
    		searcher.doSearch();
    	});
    	
    	decorationPayment.refundModal.modal("hide");
    	
    	decorationPaymentPostData.paymentInfo = null;
    }
	
	$("#history").removeClass("active");
});

