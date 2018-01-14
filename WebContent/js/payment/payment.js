
jQuery(function($) {
	
	var payment = {
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		cashOutModal: null,
		items: {},
		paymentTypes:null,
		temp: [],
		
	};
	
	payment.saveBtn = $("#collectBtn").bindClick(saveData);
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
				payment.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				payment.bank.push(v);
				payment.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				payment.checkBank.push(v);
				payment.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				payment.accounts.push(v);
				payment.accountsInfo[v.no] = v.name;
			}
		});
		
		$("#cashInfo").bindData(payment.cash, 'no', 'name');
		$("#installmentBankName").bindData(payment.bank, 'no', 'name');
		$("#refundBankName").bindData(payment.bank, 'no', 'name');
		$("#checkvBankName").bindData(payment.checkBank, 'no', 'name');
		
		$("#accountsBankName").bindData(payment.accounts, 'no', 'name');
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

            var propertyArr = [
               ["客户:", v.customer.customerName, "grey"],
               ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
               ["设计师:", v.designer, "grey"],
               ["合同余额:", v.customer.balance == null ? '0' : v.customer.balance, "blue"],
               ["工程余额:", v.customer.projectBalance == null ? '0' : v.customer.projectBalance, "blue"],
               ["主材余额:", v.customer.materialBalance == null ? '0' : v.customer.materialBalance, "blue"],
               ["正林余额:", v.customer.zhenglinBalance == null ? '0' : v.customer.zhenglinBalance, "blue"]
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
            	v.paymentType="收款";
            	showPaymentModal(v);
            });
            
            $btnCashout.click(function(){
				v.paymentType="提款";
				showPaymentModal(v);
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
	
	searcher.init(["orderId", "customerId", "customerPhone", "village", "houseNumber", "designer"], "condList", api.decoration.pageDecorationOrderForAdvance, function(data){
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
               ["操作金额:", v.recharge, "blue"],
               ["余额:", v.balance, "blue"],
               ["收款人:", v.collectUser.userName, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.status, "red"],
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
				    info += payment.bankInfo[_i[0]] + " " + _i[1] + ", ";
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
				if(v.collectUser.userId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配，不能打印");
					return false;
				}else{
					com.popup("专用收款收据__订单编号:" + v.orderId  ,api.index.paymentReceiptIndex.url + "?payment.paymentId=" + v.paymentId + "&time=" + parent.params.loginTime,function () {
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
	
	var hsearcher = new Searcher();
	
	hsearcher.init(["orderId", "customerId", "customerPhone", "advancePaymentcollectTime"], "hcondList", api.payment.pagePaymentForHistory, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hpaymentPostData", null, false, null, function(){
    	
    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);
    	
    	return [$impa];
    }, "hresultList");
	
	function showPaymentModal(v){

		if(v.paymentType.search('收款') != -1 || v.paymentType=="收款"){
			$("#myModalLabel").text("收款信息");
			$("#paymentMethod").text("付款方式");
			$("#refundSumBalanceDiv").addClass("hide");
			$("#refundSumWithdrawDiv").addClass("hide");
			$("#collectBtn").text("收款");
			payment.paymentTypes = v.paymentType;
		}else{
			$("#myModalLabel").text("提现信息");
			$("#paymentMethod").text("提现方式");
			$("#refund").val("");
			$("#refundSumBalanceDiv").removeClass("hide");
			$("#refundSumWithdrawDiv").removeClass("hide");
			$("#paymentTypeSel").find("option:first").prop("selected", true);
			$("#paymentTypeSel").on("change", function(){
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
			$("#collectBtn").text("提现");
			payment.paymentTypes = v.paymentType;
		}

		params.orderId = v.orderId;
		
		$("#bankDivGroup").html("");
		$("#bankAdd").attr("num", 0);
		
		com.cleanItems(payment.items);
		
		payment.modal.modal("show");
		
		$("#paymentTypeDiv").css("display", "inline");
		
		payment.temp = v;
	}
	
	function saveData(){

		$('.payWayError').hide();
		
		if(com.validate("paymentModal")){
			return;
		}
		
		if($(".pay_way input:checkbox:checked").length == 0){
			$('.payWayError').show();
			return; 
		}
		
		var url = "";
		var total = 0;
		var options = {};

		options["payment.customer.id"] = payment.temp.customer.id;
		options["payment.balance"] = payment.temp.balance;
		options["payment.paymentType"] = $("#paymentTypeSel").val();
		options["payment.orderId"] = params.orderId;
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

		if(payment.paymentTypes.search('收款') != -1 || payment.paymentTypes == "收款"){
			url = api.payment.collectPayment;
			options["payment.type"] = "收款";
			if(parseFloat(total) <= 0){
				com.showAlert(com.warning, "收款金额需要大于零!");
				return false;
			}
		}else{
			var refund = $("#refund").val();
			var refundSum = $("#refundSum").val();

			if(parseFloat(refund) <= 0){
				$("#paymentInfo").text("提款金额需要大于零!");
				return false;
			}

			if(parseFloat(refundSum) < parseFloat(refund)){
				$("#paymentInfo").text("提款金额不能大于余额!");
				return false;
			}
			if(parseFloat(total)!=parseFloat(refund)){
				$("#paymentInfo").text("当前提款项总数与提款金额不等,请核实再进行提交!!");
				return false;
			}
			url = api.payment.withdrawPayment;
			options["payment.type"] = "提款";
		}
		
		com.post(url, options, function(res){

			searcher.doSearch();

			if(payment.paymentTypes.search('收款') != -1 || payment.paymentTypes == "收款"){
				bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
					if(result){
						com.popup("专用收款收据__订单编号:" + res.payment.orderId  ,api.index.paymentReceiptIndex.url + "?payment.paymentId=" + res.payment.paymentId + "&time=" + parent.params.loginTime,function () {
							parent.layer.getFrameIndex(window.name);
						},null,true)
					}
				});
			}

		});
		
		payment.modal.modal("hide");
	}

	function addBankDiv(index){
		
		var d = new Date();
		var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();
		
		var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));
		
		var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
		var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(payment.bank, 'no', 'name').appendTo(bankNameDiv);
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
		var bankMoneyInput = $('<input></input>').addClass("col-sm-6 v_required v_float").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_"+index).appendTo(bankMoneyDiv);
		
		var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDiv);
		var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankDateInput = $('<input></input>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);
		
		var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankDiv);
		var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
		var bankTimeInput =  $('<input></input>').addClass('col-sm-6 v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);
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
		
		com.post(api.payment.pagePaymentForHistory, $.extend({}, params.hpaymentPostData, {"paging.noPage": 1}), function(res){
			
			$.exceler({
				column : [
					["订单号","orderId"],
					['收款类型','type'],
					['预付款类型','paymentType'],
					['操作金额','recharge'],
					['收款人', 'collectUserName'],
					['收款时间', 'collectTime'],
					['状态', 'status'],
					['备注', 'des'],
					['现金', 'cash'],
					['银行', ['bank', 'bankInfo']],
					['转账', ['checkv', 'checkvBankName']],
					['分期', ['installment', 'installmentBankName']],
					['对公', ['accounts', 'accountsBankName']],
				],
				list: res.paging.data,
			}, function(v){
				if(v.bank != null && v.bank != 0){
					var $info = ' ';
					var _s = v.bankInfo.split('#');
					for(var i=1;i<_s.length-1;i++){
					    var _i = _s[i].split('|');
					    $info += payment.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
					}
					  
					v.bankInfo = $info;
				}
				
				v.checkvBankName = v.checkv != null && v.checkv != "0" ? payment.checkBankInfo[v.checkvBankName] : '';
				v.installmentBankName = v.installment != null && v.installment != "0" ? payment.bankInfo[v.installmentBankName] : '';
				v.accountsBankName = v.accounts != null && v.accounts != "0" ? payment.accountsInfo[v.accountsBankName] : '';
			});
		});
    });
	
});
