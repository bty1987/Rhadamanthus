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
		statusData: [],
		bankNums: [],
		checkvNums: []
	};
	
	payment.saveBtn = com.focusPage("#collectBtn").bindClick(saveData);
	payment.cancelBtn = com.focusPage("#cancelBtn");
	payment.modal = com.focusPage("#paymentModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.focusPage('.payWayError').hide();
		com.focusPage("#paymentInfo").text("");
	});

	payment.items.cashCheckbox = com.focusPage("#cashCheckbox");
	payment.items.bankCheckbox = com.focusPage("#bankCheckbox");
	payment.items.checkvCheckbox = com.focusPage("#checkvCheckbox");
	
	payment.items.cash = com.focusPage("#cash");
	payment.items.paymentTypeSel = com.focusPage("#paymentTypeSel");
	payment.items.des = com.focusPage("#des");

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
	
	com.focusPage("#paymentModal :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
	});
	
	com.focusPage("#refundCash").prop("checked", true);
	com.focusPage("#cashOutModal input[name='refundType']").on("click", function(){
		if($(this).val() == 0){
			com.focusPage("#refundBankCardDiv").hide();
		}else{
			com.focusPage("#refundBankCardDiv").show();
		}
	});

	payment.cash = [];
	payment.bank = [];
	payment.bankUtil = [];
	payment.checkBank = [];
	payment.accounts = [];

	payment.cashUtil = [];
	payment.bankUtil = [];
	payment.checkBankUtil = [];

	payment.cashInfo = {};
	payment.bankInfo = {};
	payment.checkBankInfo = {};
	payment.accountsInfo = {};

	com.post(api.common.queryReceiptType, {}, function(res){
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				payment.cash.push(v);
				payment.cashUtil.push({"key":v.no,"value":v.name});
				payment.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				payment.bank.push(v);
				payment.bankUtil.push({"key":v.no,"value":v.name});
				payment.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				payment.checkBank.push(v);
				payment.checkBankUtil.push({"key":v.no,"value":v.name});
				payment.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				payment.accounts.push(v);
				payment.accountsInfo[v.no] = v.name;
			}
		});
	}, null, false);

	paymentUtils.dynamicChosen('paymentModal',"paymentcashInfo",payment.cashUtil,"key","value");

	com.focusPage("#paymentbankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "bankDiv", "#paymentbankDivGroup", payment.bankNums, payment.bankUtil, "payment");

		return false;
	});

	com.focusPage("#paymentcheckvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "checkvDiv", "#paymentcheckvDivGroup", payment.checkvNums, payment.checkBankUtil, "payment");

		return false;
	});
	
	com.focusPage("#paymentHistoryList").removeClass("active");
	
	var displayFunc  = (function(){
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
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
					if(com.focusPage("#"+v.orderId+"contractBalance").length>0){
						com.focusPage("#"+v.orderId+"contractBalance").html(res.balanceAdvance);
						com.focusPage("#"+v.orderId+"projectBalance").html(res.projectAdvance);
						com.focusPage("#"+v.orderId+"materialBalance").html(res.materialAdvance);
						com.focusPage("#"+v.orderId+"zaterialBalance").html(res.zaterialAdvance);
					}else{
						paymentUl(v,res);
					}
				});
			});

            return $liLine;
        };
      
        return {
            init : function(tableId,listData){
				com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

	function paymentUl(v,res) {
		ul = com.focusPage("#"+v.orderId+"ul");
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
            var $tableWrap = com.focusPage('#' + tableId);
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
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, payment.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", paymentUtils.splitBankInfo(v.checkv, v.checkvBank, payment.checkBankInfo), "blue"]) : true;
			v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "blue"]) : true;
			v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "blue"]) : true;
			v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "blue"]) : true;
			v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;
			v.transfer != null && v.transfer != "0" ? styleArr.push(["预付款转换:", v.transfer, "blue"]) : true;
			
			$.each(styleArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulStyle);
			});
           
            $divBtnWrap.append($btnPrint).appendTo($h3);

			if(v.status == 1 && v.type != 2 && v.transfer == 0){
				$divBtnWrap.append($btnUpdateP).appendTo($h3);
			}
           
            $liLine.append($h3).append($ulProperty).append($ulStyle);
            
			$btnPrint.click(function(){
				if(v.collectUser.userId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配, 不能打印");
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
				com.focusPage('#' + tableId).html(null);
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
		payment.bankNums=[];
		payment.checkvNums=[];
		com.focusPage("#historyUpdateP").addClass("hide");
		com.focusPage("#paymentTypeSel").removeAttr("disabled");
		com.focusPage("#des").removeAttr("disabled");

		paymentUtils.EmptyChosen('paymentcashInfo');

		if(v.paymentType.search('收款') != -1 || v.paymentType=="收款"){
			com.focusPage("#myModalLabel").text("收款信息");
			com.focusPage("#paymentMethod").text("付款方式");
			com.focusPage("#refundSumBalanceDiv").addClass("hide");
			com.focusPage("#refundSumWithdrawDiv").addClass("hide");
			com.focusPage("#collectBtn").text("收款");
			payment.paymentTypes = v.paymentType;
		}else{
			com.focusPage("#myModalLabel").text("提现信息");
			com.focusPage("#paymentMethod").text("提现方式");
			com.focusPage("#refund").val("");
			com.focusPage("#refundSumBalanceDiv").removeClass("hide");
			com.focusPage("#refundSumWithdrawDiv").removeClass("hide");
			com.focusPage("#paymentTypeSel").find("option:first").prop("selected", true);
			com.focusPage("#paymentTypeSel").on("change", function(){
				if($(this).val() == 0){
					com.focusPage("#refundSum").val(res.balanceAdvance);
				}else if($(this).val() == 1){
					com.focusPage("#refundSum").val(res.projectAdvance);
				}else if($(this).val() == 2){
					com.focusPage("#refundSum").val(res.materialAdvance);
				}else if($(this).val() == 3){
					com.focusPage("#refundSum").val(res.zaterialAdvance);
				}
			}).trigger("change");
			com.focusPage("#collectBtn").text("提现");
			payment.paymentTypes = v.paymentType;
		}

		params.orderId = v.orderId;
		
		com.focusPage("#paymentbankDivGroup").html("");
		com.focusPage("#paymentbankAdd").attr("num", 0).attr("maxnum",0);

		com.focusPage("#paymentcheckvDivGroup").html("");
		com.focusPage("#paymentcheckvAdd").attr("num", 0).attr("maxnum",0);
		
		com.cleanItems(payment.items);
		payment.modal.modal("show");
		
		com.focusPage("#paymentTypeDiv").css("display", "inline");
		
		payment.temp = v;
	}
	
	function dialogPaymentUpdate(v) {
		payment.bankNums=[];
		payment.checkvNums=[];

		com.focusPage("#myModalLabel").text("收款信息");
		com.focusPage("#paymentMethod").text("付款方式");
		com.focusPage("#historyUpdateP").removeClass("hide");
		com.focusPage("#collectBtn").text("收款");
		com.focusPage("#refundSumBalanceDiv").addClass("hide");
		com.focusPage("#refundSumWithdrawDiv").addClass("hide");

		params.orderId = v.orderId;
		payment.paymentTypes = null;

		com.focusPage("#paymentbankDivGroup").html("");
		com.focusPage("#paymentbankAdd").attr("num", 0).attr("maxnum",0);

		com.focusPage("#paymentcheckvDivGroup").html("");
		com.focusPage("#paymentcheckvAdd").attr("num", 0).attr("maxnum",0);

		com.cleanItems(payment.items);

		paymentUtils.EmptyChosen('paymentcashInfo');
		payment.modal.modal("show");

		com.focusPage("#paymentTypeDiv").css("display", "inline");
		com.focusPage("#des").val(v.comment);
		com.focusPage("#des").attr("disabled","disabled");
		com.focusPage("#paymentTypeSel").attr("disabled","disabled");

		//历史收款信息
		com.focusPage("#cashHistoryP").text("现金: "+com.checkNull(payment.cashInfo[v.cashInfo],"")+" "+com.checkNull(v.cash,"无"));
		com.focusPage("#bankHistoryP").text("银行卡: " + (v.bank == 0 ? "无" : paymentUtils.splitBankInfo(v.bank, v.bankInfo, payment.bankInfo)));
		com.focusPage("#checkvHistoryP").text("转账: " + (v.checkv == 0 ? "无" : paymentUtils.splitBankInfo(v.checkv, v.checkvBank, payment.checkBankInfo)));
		com.focusPage("#installmentHistoryP").text("分期: "+com.checkNull(payment.bankInfo[v.installmentBank],"")+" "+com.checkNull(v.installment,"无"));
		com.focusPage("#accountsHistoryP").text("对公账户: "+com.checkNull(payment.accountsInfo[v.accountsBank],"")+" "+com.checkNull(v.accounts,"无"));

		payment.temp = v;
		payment.historyPayment = utils.accAdd(utils.accAdd(v.cash,v.bank),v.checkv);
	}
	
	function saveData(){
		com.focusPage('.payWayError').hide();
		
		if(com.validate("paymentModal")){
			return;
		}
		
		if(com.focusPage(".pay_way input:checkbox:checked").length == 0){
			com.focusPage('.payWayError').show();
			return; 
		}
		
		var url = "";
		var total = 0;
		var options = {};

		options["payment.customer.cid"] = payment.temp.customer.cid;
		options["payment.balance"] = payment.temp.balance;
		options["payment.paymentType"] = com.focusPage("#paymentTypeSel").val();
		options["payment.orderId"] = params.orderId;

		if(com.focusPage("#cashCheckbox").prop("checked")){
			options["payment.cash"] = com.focusPage("#cash").val().trim();
			options["payment.cashInfo"] = com.focusPage("#paymentcashInfo").val().trim();
			
			total = utils.accAdd(parseFloat(com.focusPage("#cash").val()), total);
		}

		if(com.focusPage("#bankCheckbox").prop("checked")){
			var bankParams = paymentUtils.returnBankParams(payment.bankNums, "paymentbank");

			total = utils.accAdd(bankParams[0], total);
			
			options["payment.bank"] = bankParams[0];
			options["payment.bankInfo"] = bankParams[1];
		}

		if(com.focusPage("#checkvCheckbox").prop("checked")){
			var checkvParams = paymentUtils.returnBankParams(payment.checkvNums, "paymentcheckv");

			total = utils.accAdd(checkvParams[0], total);

			options["payment.checkv"] = checkvParams[0];
			options["payment.checkvBank"] = checkvParams[1];
		}

		if(payment.typeUpdate == 1 && payment.paymentTypes == "收款"){
			url = api.payment.collectPayment;
			options["payment.type"] = 1; //收款
			options["payment.comment"] = com.focusPage("#des").val().trim();
			options["payment.uniqueid"] = new Date().getTime();
			if(parseFloat(total) <= 0){
				com.showAlert(com.warning, "收款金额需要大于零!");
				return false;
			}
		}else if(payment.typeUpdate == 2){
			var refund = com.focusPage("#refund").val();
			var refundSum = com.focusPage("#refundSum").val();

			if(parseFloat(refund) <= 0){
				com.focusPage("#paymentInfo").text("提款金额需要大于零!");
				return false;
			}

			if(parseFloat(refundSum) < parseFloat(refund)){
				com.focusPage("#paymentInfo").text("提款金额不能大于余额!");
				return false;
			}
			if(parseFloat(total)!=parseFloat(refund)){
				com.focusPage("#paymentInfo").text("当前提款项总数与提款金额不等,请核实再进行提交!!");
				return false;
			}

			url = api.payment.withdrawPayment;
			options["payment.type"] = 0;
			options["payment.comment"] = com.focusPage("#des").val().trim();
			options["payment.uniqueid"] = new Date().getTime();

		}else if(payment.typeUpdate == 3){
			if(parseFloat(total) <= 0){
				com.focusPage("#paymentInfo").text("提款金额需要大于零!");
				return false;
			}

			if(parseFloat(total) != parseFloat(payment.historyPayment)){
				com.focusPage("#paymentInfo").text("当前更新款项金额与原收款金额不等,请核实再进行提交!!");
				return false;
			}

			url = api.payment.updatePayment;
			options["payment.pid"] = payment.temp.pid;
		}

		com.post(url, options, function(res){
			hsearcher.doSearch();

			com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": res.payment.customer.cid}, function(resBalance){
				if(com.focusPage("#"+params.orderId+"contractBalance").length>0){
					com.focusPage("#"+params.orderId+"contractBalance").html(resBalance.balanceAdvance);
					com.focusPage("#"+params.orderId+"projectBalance").html(resBalance.projectAdvance);
					com.focusPage("#"+params.orderId+"materialBalance").html(resBalance.materialAdvance);
					com.focusPage("#"+params.orderId+"zaterialBalance").html(resBalance.zaterialAdvance);
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

	com.focusPage('a[name="import"]', '#hpagenation').click(function () {
    	if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
    	
    	if(com.focusPage('span[name="totalRecords"]').text() > 1000){
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

				if(v.checkv != null && v.checkv != 0){
					var checkBankInfoStr = v.checkvBank;
					if(checkBankInfoStr.indexOf("#") != -1){
						var $checkvInfo = ' ';
						var _c = v.checkvBank.split('#');
						for(var i=1;i<_c.length-1;i++){
							var _i = _c[i].split('|');
							$checkvInfo += payment.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.checkvBank = $checkvInfo;
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? payment.checkBankInfo[v.checkvBank] : '';
					}
				}
				
				v.installmentBank = v.installment != null && v.installment != "0" ? payment.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? payment.accountsInfo[v.accountsBank] : '';
				v.type = v.type != null ? payment.typeData[v.type] : v.type;
				v.paymentType = v.paymentType != null ? payment.paymentTypeData[v.paymentType] : v.paymentType;
				v.status = v.status != null ? payment.statusData[v.status] : v.status;
			});
		});
    });
});
