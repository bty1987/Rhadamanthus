var payment = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	cashOutModal: null,
	items: {},
	
	temp: [],
	
	updateFlag: false,
};

var paymentPostData = {};

jQuery(function($) {
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
	
	com.post(api.common.queryReceiptType, {}, function(res){
		
		payment.cash = [];
		payment.bank = [];
		payment.checkBank = [];
		payment.accounts = [];
		
		payment.cashInfo = {};
		payment.bankInfo = {};
		payment.checkBankInfo = {};
		payment.accountsInfo = {};
		
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				payment.cash.push(v);
				payment.cashInfo[v.key] = v.name;
			}else if(v.type == 2){
				payment.bank.push(v);
				payment.bankInfo[v.key] = v.name;
			}else if(v.type == 3){
				payment.checkBank.push(v);
				payment.checkBankInfo[v.key] = v.name;
			}else if(v.type == 4){
				payment.accounts.push(v);
				payment.accountsInfo[v.key] = v.name;
			}
		});
		
		$("#cashInfo").bindData(payment.cash, 'key', 'name');
		
		$("#installmentBankName").bindData(payment.bank, 'key', 'name');
		$("#refundBankName").bindData(payment.bank, 'key', 'name');
		
		$("#checkvBankName").bindData(payment.checkBank, 'key', 'name');
		
		$(".bankSel").bindData(payment.bank, 'key', 'name');
		
		$("#accountsBankName").bindData(payment.accounts, 'key', 'name');
	}, null, false);
	
	$("#bankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		addBankDiv(nextNum);
		$(this).attr("num", nextNum);
		
		return false;
	});
	
	$("#paymentHistoryList").removeClass("active");
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.customer.customerId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier btn-primary').html('收款');
            var $btnCashout = $('<a></a>').addClass('btn btn-minier btn-yellow').html('提款');
            var $btnConvert = $('<a></a>').addClass('btn btn-minier btn-purple').html('转换');
            
            var propertyArr = [
               ["客户:", v.customer.customerName, "grey"],
               ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
               ["设计师:", v.designer, "grey"],
               ["合同余额:", v.customer.balance, "grey"],
               ["工程余额:", v.customer.projectBalance, "grey"],
               ["主材余额:", v.customer.materialBalance, "grey"],
               ["正林余额:", v.customer.zhenglinBalance, "grey"],
            ];
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
           
            $divBtnWrap.append($btnCollect).append($btnCashout).appendTo($h3);
           
            $liLine.append($h3).append($ulProperty);
            
            $btnCollect.click(function(){
            	showPaymentModal(v);
            });
            
            $btnCashout.click(function(){
            	showCashOutModal(v);
            });
            
            $btnConvert.click(function(){
            	showConvertPaymentModal(v);
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
	
	searcher.init(["orderId", "customerId", "customerPhone", "village", "houseNumber", "designer"], "condList", api.decoration.pageDecorationOrderForGeneral, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "paymentPostData");
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.customer.customerId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
            
            var propertyArr = [
               ["客户:", v.customer.customerName, "grey"],
               ["收款类型:", v.type, "grey"],
               ["预付款类型:", v.paymentType, "grey"],
               ["操作金额:", v.recharge, "grey"],
               ["余额:", v.balance, "grey"],
               ["收款人:", v.collectUser.userName, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.status, "red"],
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
            	printPayment(v.paymentId);
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
	
	hsearcher.init(["orderId", "customerId", "customerPhone", "village", "houseNumber", "designer", "collectTimeDateRange"], "hcondList", api.payment.pagePaymentForHistory, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hpaymentPostData");
	
	function showPaymentModal(v){
		
		paymentPostData["orderId"] = v.orderId;
		
		payment.updateFlag = false;
		
		$("#bankDivGroup").html("");
		$("#bankAdd").attr("num", 0);
		
		com.cleanItems(payment.items);
		
		payment.modal.modal("show");
		
		$("#paymentTypeDiv").css("display", "inline");
		
		payment.temp = v;
	}
	
	function showCashOutModal(v){
		
		paymentPostData["orderId"] = v.orderId;
		
		$("#outPaymentInfo").text("");
		$("#refund").val("");
		
		$("#refundCash").prop("checked", true);
		$("#refundBankCardDiv").hide();
		$("#refundPaymentTypeSel").find("option:first").prop("selected", true);
		$("#refundPaymentTypeSel").on("change", function(){
			if($(this).val() == "合同预付款"){
				$("#refundSum").val(v.customer.balance);
			}else if($(this).val() == "主材预付款"){
				$("#refundSum").val(v.customer.materialBalance);
			}else if($(this).val() == "工程预付款"){
				$("#refundSum").val(v.customer.projectBalance);
			}else if($(this).val() == "正林预付款"){
				$("#refundSum").val(v.customer.zhenglinBalance);
			}
		}).trigger("change");
		$("#cashOutModal").modal("show");
		
		payment.temp = v;
	}
	
	function showConvertPaymentModal(v){
		
		paymentPostData["orderId"] = v.orderId;
		paymentPostData["convertCustomerAutoId"] = v.id;
		
		com.clearValidator();
		
		$('#convertMsg').text("");
		$("#convertCash").val("");
		$("#convertLeftSel option:first").prop("selected", true);
		$("#convertRightSel option:eq(1)").prop("selected", true);
		
		$(".convertTypeSel").on("change", function(){
			$this = $(this);
			if($this.val() == "合同预付款"){
				$this.next().text(v.customer.balance+"元");
			}else if($this.val() == "主材预付款"){
				$this.next().text(v.customer.materialBalance+"元");
			}else if($this.val() == "工程预付款"){
				$this.next().text(v.customer.projectBalance+"元");
			}else if($this.val() == "正林预付款"){
				$this.next().text(v.customer.zhenglinBalance+"元");
			}
		}).trigger("change");
		
		$("#convertModal").modal("show");
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
			"payment.customer.id": payment.temp.customer.id,
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
			searcher.doSearch();
		});
		$("#cashOutModal").modal("hide");
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
			searcher.doSearch();
		});
		
		$("#convertModal").modal("hide");
	}
	
	function printPayment(paymentId){
		
		var url = api.index.paymentReceiptIndex.url + "?payment.paymentId=" + paymentId;
		window.open(url);
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
			
			options["payment.customer.id"] = payment.temp.customer.id;
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
			
			searcher.doSearch();
			
			if(!payment.updateFlag){
				searcher.doSearch();
				
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
		
		console.log(payment.bank);
		
		var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
		var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(payment.bank, 'key', 'name').appendTo(bankNameDiv);
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
	
});

