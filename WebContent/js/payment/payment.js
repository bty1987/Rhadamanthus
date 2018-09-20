
jQuery(function($) {
	var payment = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		cashOutModal: null,
		items: {},
		paymentTypes:null,
		temp: [],
		typeData: [],
		paymentTypeData: [],
		statusData: []
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

	com.post(api.ds.payment, {}, function(res){
		$.each(res.type, function (i,v) {
			payment.typeData[v.key] = v.value;
		});

		$.each(res.paymentType, function (i,v) {
			payment.paymentTypeData[v.key] = v.value;
		});

		$.each(res.status, function (i,v) {
			payment.statusData[v.key] = v.value;
		});
	}, null, false);
	
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.customer.no));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').attr("id",v.orderId+"ul");
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier btn-primary').html('收款');
            var $btnCashout = $('<a></a>').addClass('btn btn-minier btn-yellow').html('提款');
			var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-danger').html('余额');

            var propertyArr = [
               ["客户:", v.customer.name, "grey"],
               ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
               ["设计师:", v.designer.currentName, "grey"]
            ];
            
            $.each(propertyArr, function (index,value) {
            	var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
           
            $divBtnWrap.append($btnCollect).append($btnCashout).append($btnBalance).appendTo($h3);
           
            $liLine.append($h3).append($ulProperty);
            
            $btnCollect.click(function(){
            	v.paymentType="收款";
				payment.typeUpdate = 1;
            	showPaymentModal(v);
            });
            
            $btnCashout.click(function(){
				v.paymentType="提款";
				payment.typeUpdate = 2;
				com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": v.customer.cid}, function(res){
					showPaymentModal(v,res);
				});
            });

			$btnBalance.click(function(){
				com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": v.customer.cid}, function(res){
					if($("#"+v.orderId+"contractBalance").length>0){
						$("#"+v.orderId+"contractBalance").html(res.balanceAdvance);
						$("#"+v.orderId+"projectBalance").html(res.projectAdvance);
						$("#"+v.orderId+"materialBalance").html(res.materialAdvance);
						$("#"+v.orderId+"zaterialBalance").html(res.zaterialAdvance);
					}else{
						paymentUl(v,res);
					}
				});
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

	function paymentUl(v,res) {
		ul = $("#"+v.orderId+"ul");
		paymentBalance(ul,"合同预付款 ",res.balanceAdvance,"blue",v.orderId+"contractBalance");
		paymentBalance(ul,"工程预付款 ",res.projectAdvance,"blue",v.orderId+"projectBalance");
		paymentBalance(ul,"主材预付款 ",res.materialAdvance,"blue",v.orderId+"materialBalance");
		paymentBalance(ul,"正林预付款 ",res.zaterialAdvance,"blue",v.orderId+"zaterialBalance");
	}
	
	function paymentBalance($ulProperty,key,value,cls,id) {
		var $liProperty = $('<li></li>');
		$('<strong></strong>').html(key).appendTo($liProperty);
		$('<b></b>').html(value).attr("id",id).addClass(cls).appendTo($liProperty);
		$liProperty.appendTo($ulProperty);
	}
	
	var searcher = new Searcher();
	
	searcher.init(["orderId", "village", "houseNumber", "designer"], "condList", api.decoration.pageDecorationForGeneral, function(data){
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.customer.no));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
			var $btnUpdateP = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');
            
            var propertyArr = [
               ["客户:", v.customer.name, "grey"],
               ["收款类型:", payment.typeData[v.type], "red"],
               ["预付款类型:", payment.paymentTypeData[v.paymentType], "red"],
               ["操作金额:", v.recharge, "blue"],
               ["余额:", v.balance, "blue"],
               ["收款人:", v.collectUser.userName, "grey"],
               ["收款时间:", v.collectTime, "green"],
               ["状态:", payment.statusData[v.status], "red"],
               ["备注:", v.comment, "grey"]
            ];
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            var styleArr = [];
			
			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo){
				  var info = bank + ", ";
				  var _s = bankInfo.split('#');
				  for(var i=1;i<_s.length-1;i++){
				    var _i = _s[i].split('|');
				    info += payment.bankInfo[_i[0]] + " " + _i[1] + ", ";
				  }
				  
				  return info
			})(v.bank, v.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "blue"]) : true;
			v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "blue"]) : true;
			v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "blue"]) : true;
			v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "blue"]) : true;
			v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;
			
			$.each(styleArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulStyle);
			});
           
            $divBtnWrap.append($btnPrint).appendTo($h3);

			if(v.status == 2){
				$divBtnWrap.append($btnPrint).appendTo($h3);
			}else if(v.status == 1){
				$divBtnWrap.append($btnPrint).append($btnUpdateP).appendTo($h3);
			}
           
            $liLine.append($h3).append($ulProperty).append($ulStyle);
            
			$btnPrint.click(function(){
				if(v.collectUser.userId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配，不能打印");
					return false;
				}else{
					params.paymentPaymentId = v.pid;
					com.popup("专用收款收据__装修单号:" + v.orderId  ,api.index.paymentReceiptIndex.url ,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true)
				}
			});

			$btnUpdateP.click(function(){
				payment.typeUpdate = 3;
				dialogPaymentUpdate(v);
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
	
	hsearcher.init(["orderId", "advancePaymentcollectTime"], "hcondList", api.payment.pagePaymentForHistory, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hpaymentPostData", null, false, null, function(){
    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);
    	
    	return [$impa];
    }, "hresultList");

	function showPaymentModal(v,res){
		$("#historyUpdateP").addClass("hide");
		$("#paymentTypeSel").removeAttr("disabled");
		$("#des").removeAttr("disabled");

		if(v.paymentType.search('收款') != -1 || v.paymentType=="收款"){
			$("#myModalLabel").text("收款信息");
			$("#paymentMethod").text("付款方式");
			$("#refundSumBalanceDiv").addClass("hide");
			$("#refundSumWithdrawDiv").addClass("hide");
			$("#collectBtn").text("收款");
			$("#cashInfo").find("option:first").prop("selected", true);
			$("#checkvBankName").find("option:first").prop("selected", true);
			$("#installmentBankName").find("option:first").prop("selected", true);
			$("#accountsBankName").find("option:first").prop("selected", true);
			payment.paymentTypes = v.paymentType;
		}else{
			$("#myModalLabel").text("提现信息");
			$("#paymentMethod").text("提现方式");
			$("#refund").val("");
			$("#refundSumBalanceDiv").removeClass("hide");
			$("#refundSumWithdrawDiv").removeClass("hide");
			$("#paymentTypeSel").find("option:first").prop("selected", true);
			$("#cashInfo").find("option:first").prop("selected", true);
			$("#checkvBankName").find("option:first").prop("selected", true);
			$("#installmentBankName").find("option:first").prop("selected", true);
			$("#accountsBankName").find("option:first").prop("selected", true);
			$("#paymentTypeSel").on("change", function(){
				if($(this).val() == 0){
					$("#refundSum").val(res.balanceAdvance);
				}else if($(this).val() == 1){
					$("#refundSum").val(res.projectAdvance);
				}else if($(this).val() == 2){
					$("#refundSum").val(res.materialAdvance);
				}else if($(this).val() == 3){
					$("#refundSum").val(res.zaterialAdvance);
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
	
	function dialogPaymentUpdate(v) {
		$("#myModalLabel").text("收款信息");
		$("#paymentMethod").text("付款方式");
		$("#historyUpdateP").removeClass("hide");
		$("#collectBtn").text("收款");
		$("#refundSumBalanceDiv").addClass("hide");
		$("#refundSumWithdrawDiv").addClass("hide");

		$("#cashInfo").find("option:first").prop("selected", true);
		$("#checkvBankName").find("option:first").prop("selected", true);
		$("#installmentBankName").find("option:first").prop("selected", true);
		$("#accountsBankName").find("option:first").prop("selected", true);

		params.orderId = v.orderId;
		payment.paymentTypes = null;

		$("#bankDivGroup").html("");
		$("#bankAdd").attr("num", 0);

		com.cleanItems(payment.items);

		payment.modal.modal("show");

		$("#paymentTypeDiv").css("display", "inline");
		$("#des").val(v.comment);
		$("#des").attr("disabled","disabled");
		$("#paymentTypeSel").attr("disabled","disabled");

		//历史收款信息
		$("#cashHistoryP").text("现金： "+com.checkNull(payment.cashInfo[v.cashInfo],"")+" "+com.checkNull(v.cash,"无"));
		var info = "";
		var _s = v.bankInfo.split('#');
		for(var i=1;i<_s.length-1;i++){
			var _i = _s[i].split('|');
			info += payment.bankInfo[_i[0]] + " " + _i[1] + " ";
		}
		$("#bankHistoryP").text("银行卡： "+com.checkNull(v.bank,"无") + " "+com.checkNull(info,""));
		$("#checkvHistoryP").text("转账： "+com.checkNull(payment.checkBankInfo[v.checkvBank],"")+" "+com.checkNull(v.checkv,"无"));
		$("#installmentHistoryP").text("分期： "+com.checkNull(payment.bankInfo[v.installmentBank],"")+" "+com.checkNull(v.installment,"无"));
		$("#accountsHistoryP").text("对公账户： "+com.checkNull(payment.accountsInfo[v.accountsBank],"")+" "+com.checkNull(v.accounts,"无"));

		payment.temp = v;
		payment.historyPayment = utils.accAdd(utils.accAdd(utils.accAdd(v.cash,v.bank),utils.accAdd(v.checkv,v.installment)),v.accounts);
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

		options["payment.customer.cid"] = payment.temp.customer.cid;
		options["payment.balance"] = payment.temp.balance;
		options["payment.paymentType"] = $("#paymentTypeSel").val();
		options["payment.orderId"] = params.orderId;

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
			options["payment.checkvBank"] = $("#checkvBankName").val().trim();
			
			total = utils.accAdd(parseFloat($("#checkv").val()), total);
		}

		if($("#installmentCheckbox").prop("checked")){
			options["payment.installment"] = $("#installment").val().trim();
			options["payment.installmentBank"] = $("#installmentBankName").val().trim();
			
			total = utils.accAdd(parseFloat($("#installment").val()), total);
		}

		if($("#accountsCheckbox").prop("checked")){
			options["payment.accounts"] = $("#accounts").val().trim();
			options["payment.accountsBank"] = $("#accountsBankName").val().trim();
			
			total = utils.accAdd(parseFloat($("#accounts").val()), total);
		}

		if(payment.typeUpdate == 1 && payment.paymentTypes == "收款"){
			url = api.payment.collectPayment;
			options["payment.type"] = 1; //收款
			options["payment.comment"] = $("#des").val().trim();
			options["payment.uniqueid"] = new Date().getTime();
			if(parseFloat(total) <= 0){
				com.showAlert(com.warning, "收款金额需要大于零!");
				return false;
			}
		}else if(payment.typeUpdate == 2){
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
			options["payment.type"] = 0;
			options["payment.comment"] = $("#des").val().trim();
			options["payment.uniqueid"] = new Date().getTime();

		}else if(payment.typeUpdate == 3){
			if(parseFloat(total) <= 0){
				$("#paymentInfo").text("提款金额需要大于零!");
				return false;
			}

			if(parseFloat(total) != parseFloat(payment.historyPayment)){
				$("#paymentInfo").text("当前更新款项金额与原收款金额不等,请核实再进行提交!!");
				return false;
			}

			url = api.payment.updatePayment;
			options["payment.pid"] = payment.temp.pid;
		}

		com.post(url, options, function(res){
			hsearcher.doSearch();

			com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": res.payment.customer.cid}, function(resBalance){
				if($("#"+params.orderId+"contractBalance").length>0){
					$("#"+params.orderId+"contractBalance").html(resBalance.balanceAdvance);
					$("#"+params.orderId+"projectBalance").html(resBalance.projectAdvance);
					$("#"+params.orderId+"materialBalance").html(resBalance.materialAdvance);
					$("#"+params.orderId+"zaterialBalance").html(resBalance.zaterialAdvance);
				}else{
					paymentUl(params,resBalance);
				}
			});

			if(payment.paymentTypes != null){
				if(payment.paymentTypes.search('收款') != -1 || payment.paymentTypes == "收款" && payment.typeUpdate == 1){
					bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
						if(result){
							params.paymentPaymentId = res.payment.pid;
							com.popup("专用收款收据__装修单号:" + res.payment.orderId  ,api.index.paymentReceiptIndex.url,function () {
								parent.layer.getFrameIndex(window.name);
							},null,true)
						}
					});
				}
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
		var bankMoneyInput = $('<input/>').addClass("col-sm-6 v_required v_float").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_"+index).appendTo(bankMoneyDiv);
		
		var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDiv);
		var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankDateInput = $('<input/>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);
		
		var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankDiv);
		var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
		var bankTimeInput =  $('<input/>').addClass('col-sm-6 v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);
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
					['收款人', 'collectUser.currentName'],
					['收款时间', 'collectTime'],
					['状态', 'status'],
					['备注', 'comment'],
					['现金', 'cash'],
					['银行', ['bank', 'bankInfo']],
					['转账', ['checkv', 'checkvBank']],
					['分期', ['installment', 'installmentBank']],
					['对公', ['accounts', 'accountsBank']]
				],
				list: res.paging.data
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
				
				v.checkvBank = v.checkv != null && v.checkv != "0" ? payment.checkBankInfo[v.checkvBank] : '';
				v.installmentBank = v.installment != null && v.installment != "0" ? payment.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? payment.accountsInfo[v.accountsBank] : '';
				v.type = v.type != null ? payment.typeData[v.type] : v.type;
				v.paymentType = v.paymentType != null ? payment.paymentTypeData[v.paymentType] : v.paymentType;
				v.status = v.status != null ? payment.statusData[v.status] : v.status;
			});
		});
    });
});
