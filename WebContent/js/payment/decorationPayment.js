jQuery(function($) {
	var decorationPaymentPostData = {};
	var decorationPayment = {
		paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"],
		couponType: {},
		couponTypeData: {},
		orderPaymentId: null,
		baseModal: null,
		refundDecorationPaymentModal: null,
		addReduceDetail: null,
		paymentId: null,
		items: {},
		editFlg: false,
		paymentType: "增项款",
		orderId: null
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
		$("#refundBank").addClass("v_required");
		$("#refundBank").get(0).selectedIndex = 0;
	});

	$("#refundCash").on("click",function(e) {
		$("#refundCashInfoDiv").removeClass("hide");
		$("#refundBankCardDiv").addClass("hide");
		$("#refundBank").removeClass("v_required");
	});

    $("#baseItemModal :checkbox").on("change", function(){
        $(this).prop("checked") ? $("[referCheckbox="+this.id+"]").show() : $("[referCheckbox="+this.id+"]").hide()
    });

	$("#advanceType").bindData([{"key":"1", "value":"合同"}, {"key":"2", "value":"工程"}], 'key', 'value');
	
	$("#couponType").chosen({width: "216px", multi_type: "input"});
	$("#refundCouponType").chosen({width: "216px", multi_type: "input"});

	//绑定收款单位的基础信息
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
				decorationPayment.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				decorationPayment.bank.push(v);
				decorationPayment.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				decorationPayment.checkBank.push(v);
				decorationPayment.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				decorationPayment.accounts.push(v);
				decorationPayment.accountsInfo[v.no] = v.name;
			}else if(v.type == 5){
				decorationPayment.couponType.push(v);
				decorationPayment.couponTypeData[v.no] = [v.no, v.name];
			}
		});

		$("#cashInfo").bindData(decorationPayment.cash, 'no', 'name');

		$("#installmentBank").bindData(decorationPayment.bank, 'no', 'name');

		$("#checkvBank").bindData(decorationPayment.checkBank, 'no', 'name');

		$("#accountsBank").bindData(decorationPayment.accounts, 'no', 'name');

		$("#couponType").bindData(decorationPayment.couponType, 'no', 'no');
		$("#couponType").trigger("chosen:updated");
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.paymentType));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnCollect = $('<a></a>').addClass('btn btn-minier');
            var $btnDetail = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看明细');
            
            var propertyArr = [
               ["订单号:", v.decoration.orderId, "blue"],
               ["楼盘地址:", v.decoration.house.village.name + ''+v.decoration.house.houseNumber, "grey"],
               ["客户:", v.decoration.customer.name, "grey"],
               ["设计师:", v.decoration.designer.currentName, "grey"],
               ["设计部:", v.decoration.designer.dept.deptName, "grey"],
               ["应收金额:", v.referMoney, "blue"]
            ];
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
           
            $divBtnWrap.append($btnCollect).appendTo($h3);

			if(v.oneType == 0){
				if(v.twoType == 2){
					$btnCollect.text('增项款').addClass("btn-info");
					$divBtnWrap.append($btnDetail);
				}else{
					$btnCollect.text('收款').addClass("btn-info");
				}
			}else if(v.oneType == 1){
				if(v.twoType == 2 && v.paymentType == "减项款"){
					$btnCollect.text('减项款').addClass("btn-danger");
					$divBtnWrap.append($btnDetail);
				}else{
					$btnCollect.text('退款').addClass("btn-danger");
				}
			}
            
            $liLine.append($h3).append($ulProperty);

			//退款、增减项款、收款点击显示模态框
            $btnCollect.click(function(){
				decorationPayment.typeUpdate = 1;
            	dialogPayment(v);
            });

			//查看明细(只有增减项有)
            $btnDetail.click(function(){
            	addReduceDetail(v.dpid, v.paymentType, v.decoration.orderId);
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
	
	searcher.init(["orderId", "paymentDesigner", "paymentVillage", "houseNumber"], "condList", api.payment.pageDecorationPaymentForCommit, function(data){
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.paymentType));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			var $btnRefund = $('<a></a>').addClass('btn btn-minier btn-danger').html('退款');
            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
			var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

            var propertyArr = [
               ["订单号:", v.decoration.orderId, "blue"],
               ["楼盘地址:", v.decoration.house.village.name +''+ v.decoration.house.houseNumber, "grey"],
               ["客户:", v.decoration.customer.name, "grey"],
               ["设计师:", v.decoration.designer.currentName, "grey"],
               ["设计部:", v.decoration.designer.dept.deptName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collecter.currentName, "grey"],
               ["收款时间:", v.collectTime, "green"],
               ["状态:", v.paymentStatus, "red"],
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
				    info += decorationPayment.bankInfo[_i[0]] + " " + _i[1] + ", ";
				  }
				  
				  return info;
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

			if(v.paymentStatus == "已确认" && v.oneType == 0){
				$divBtnWrap.append($btnPrint);
				if(v.twoType != 2){
					$divBtnWrap.append($btnRefund);
				}
				$divBtnWrap.appendTo($h3);
			}else if(v.oneType == 1 || v.oneType == 2){ //退款或者历史
				$divBtnWrap.append($btnPrint).appendTo($h3);
			}else{
				$divBtnWrap.append($btnPrint).append($btnUpdate).appendTo($h3);
			}

            $liLine.append($h3).append($ulProperty).append($ulStyle);

			$btnRefund.click(function(){
				$("#changeReason").val("");
				decorationPayment.paymentId = v.dpid;
				approvalUtils.initqueryApprovalUser("refundApproveManSel", 5);
				$("#referMoneyApproval").val(v.referMoney);
				decorationPayment.refundDecorationPaymentModal.modal("show");
			});
            
            $btnPrint.click(function(){
				if(v.collecter.userId != params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配，不能打印");
					return false;
				}else{
					params.decorationOrderOrderId = v.decoration.orderId;
					params.decorationPaymentOrderId = v.decoration.orderId;
					params.decorationReceiptDrId = v.drId;
					com.popup("专用收款收据__装修单号:" + v.decoration.orderId  ,api.index.decorationPaymentReceiptIndex.url,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true);
				}
            });
			$btnUpdate.click(function(){
				decorationPayment.typeUpdate = 2;
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
			"approval.receiver.userId": receiverId,
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
	
	hsearcher.init(["orderId", "paymentDesigner", "paymentVillage", "houseNumber", "collectTimeDateRange"], "hcondList", api.payment.pageDecorationPaymentForHistory, function(data){
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
		$("#couponDiv div.form-group").removeClass("hide");
		$("#historyUpdate").addClass("hide");
		$("#advanceType").removeAttr("disabled");
		$("#collectDes").removeAttr("disabled");
		$("#advance").removeAttr("readonly");
		$('.couponBlue').remove();
		$("#cashInfo").find("option:first").prop("selected", true);
		$("#checkvBank").find("option:first").prop("selected", true);
		$("#installmentBank").find("option:first").prop("selected", true);
		$("#accountsBank").find("option:first").prop("selected", true);

		if(payment.oneType == 1){// 退款
			initBaseModal();
			$("#myModalPayLabel").text("退款信息");
			$("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			$('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
			decorationPaymentPostData.orderId = payment.decoration.orderId;
			decorationPaymentPostData.customerId = payment.decoration.customer.cid;
            $("#collectBtn").addClass("hide");
            $("#saveRefundBtn").removeClass("hide");
		}else{
			initBaseModal();
			$("#myModalPayLabel").text("付款信息");
			$("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
            $('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
			decorationPaymentPostData.orderId = payment.decoration.orderId;
			decorationPaymentPostData.customerId = payment.decoration.customer.cid;
            $("#collectBtn").removeClass("hide");
            $("#saveRefundBtn").addClass("hide");
		}

        com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": decorationPaymentPostData.customerId},function(res){
            $("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
            $("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
        });

		decorationPayment.editFlg =  false;
	}

	function dialogPaymentUpdate(payment){
		decorationPaymentPostData.paymentInfo = payment;
		decorationPaymentPostData.orderId = payment.decoration.orderId;
		decorationPaymentPostData.customerId = payment.decoration.customer.cid;

		com.cleanItems(decorationPayment.items);

		$("#historyUpdate").removeClass("hide");
		$("#saveRefundBtn").addClass("hide");
		$("#collectBtn").removeClass("hide");

		$("#cashInfo").find("option:first").prop("selected", true);
		$("#checkvBank").find("option:first").prop("selected", true);
		$("#installmentBank").find("option:first").prop("selected", true);
		$("#accountsBank").find("option:first").prop("selected", true);

		initBaseModal();
		$("#advanceCheckbox").attr("disabled","disabled");
		$("#couponCheckbox").attr("disabled","disabled");

		if(payment.advance!="" && payment.advance!=null && payment.advance!=0){
			$("#advanceCheckbox").removeAttr("disabled");
			$("#advanceCheckbox").trigger("click");
		}

		if(payment.coupon!="" && payment.coupon!=null && payment.coupon!=0){
			$("#couponCheckbox").removeAttr("disabled");
			$("#couponCheckbox").trigger("click");
		}

		$("#advanceCheckbox").attr("disabled","disabled");
		$("#couponCheckbox").attr("disabled","disabled");
		$("#advanceType").attr("disabled","disabled");

		$("#referMoney").val(payment.referMoney);
		$("#collectDes").val(payment.comment);
		$("#collectDes").attr("disabled","disabled");

		//历史收款信息
		$("#cashHistory").text("现金： "+com.checkNull(decorationPayment.cashInfo[payment.cashInfo],"")+" "+com.checkNull(payment.cash,"无"));
		var info = "";
		var _s = payment.bankInfo.split('#');
		for(var i=1;i<_s.length-1;i++){
			var _i = _s[i].split('|');
			info += decorationPayment.bankInfo[_i[0]] + " " + _i[1] + " ";
		}
		$("#bankHistory").text("银行卡： "+com.checkNull(payment.bank,"无") + " "+com.checkNull(info,""));
		$("#checkvHistory").text("转账： "+com.checkNull(decorationPayment.checkBankInfo[payment.checkvBank],"")+" "+com.checkNull(payment.checkv,"无"));
		$("#installmentHistory").text("分期： "+com.checkNull(decorationPayment.bankInfo[payment.installmentBank],"")+" "+com.checkNull(payment.installment,"无"));
		$("#accountsHistory").text("对公账户： "+com.checkNull(decorationPayment.accountsInfo[payment.accountsBank],"")+" "+com.checkNull(payment.accounts,"无"));

		//预付款
		com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": decorationPaymentPostData.customerId},function(res){
			$("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
			$("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
		});
		$("#advance").val(payment.advance);
		$("#advance").attr("readonly","readonly");

		//券信息
		var couponInfoList = {};
		var couponInfoAll = "";
		couponInfoAll = payment.couponInfo.substring(1,payment.couponInfo.length-1);
		couponInfoList = couponInfoAll.split("#");
		$('.couponBlue').remove();

		$("#couponDiv div.form-group").addClass("hide");

		decorationPayment.couponUpdate = payment.coupon;

		$.each(couponInfoList,function (i,v) {
			var $couponSpan = $('<span></span>').addClass('blue couponBlue').text(v).css({"font-size":"14px","margin-left":"20px"});
			$("#couponDiv").append($couponSpan);
		});

		$("#saveRefundBtn").addClass("hide");

	}
	
	function initBaseModal(){
		for(var i=0;i<decorationPayment.paymentModelNameData.length;i++){
			var _name = decorationPayment.paymentModelNameData[i];
			var _checkboxId = "#" + _name + "Checkbox";
			var _divId = "#" + _name + "Div";
			var _inputId = "#" + _name;
			var _selectId = "";
			if(_name != "bank"){
				_selectId = "#"+ _name + "Bank";
			}else{
				_selectId = "#" + _name + "Name";
			}
			
			$(_checkboxId).removeAttr("checked").removeAttr("disabled");
			
			$(_inputId).val("");
			$(_selectId).val("");
			
			if(_name == "bank"){
				$("#bankDivGroup").html("");
				$("#bankAdd").attr("num", 0);
			}
		}
		
		$("#collectDes").val("");

		$("#checkvBank option:first").prop("selected", 'selected');
		$("#installmentBank option:first").prop("selected", 'selected');
		$("#accountsBank option:first").prop("selected", 'selected');

		decorationPayment.items.couponType.chosen("destroy");
		decorationPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
		decorationPayment.items.couponType.bindData(decorationPayment.couponType, 'no', 'name');
		decorationPayment.items.couponType.trigger("chosen:updated");
		decorationPayment.baseModal.modal("show");
	}
	
    function addBankDiv(index){
    	var d = new Date();
    	var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();
    	
    	var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));
    	
    	var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
    	var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
    	var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(decorationPayment.bank, 'no', 'name').appendTo(bankNameDiv);
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
    	var bankTimeInput =  $('<input/>').addClass('col-sm-6 v_time v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);
    }

	//增减项详细信息
    function addReduceDetail(decorationPaymentId, paymentType, orderId){
        com.cleanItems(decorationPayment.items);
    	
    	decorationPayment.orderPaymentId = decorationPaymentId;
    	decorationPayment.paymentType = paymentType;
    	decorationPayment.orderId = orderId;
    	decorationPayment.addReduceDetail.modal("show");
    	
    	var options = {
    		"quotation.orderId": orderId,
    		"addReduce.dpId": decorationPaymentId
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
    		["类型:", v.type, "grey"]
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
    	var dpids = "";
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
    			_selectId = _paymentName + "Bank";
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
    				
					if(decorationPayment.typeUpdate == 1){
						args["coupon"] = _coupon;
						_payment = _coupon;
					}else{
						args["coupon"] = decorationPayment.couponUpdate;
						_payment = decorationPayment.couponUpdate;
					}
    				args["couponInfo"] = _couponInfo;
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

		if(decorationPayment.typeUpdate == 1){
			url = api.payment.collectDecorationPayment;
			options["decorationPayment.comment"] = $("#collectDes").val();
		}else{
			url = api.payment.updateDecorationPayment;
		}

		for(var arg in args){
			options["decorationPayment."+arg] = args[arg];
		}

		orderId = _info.decoration.orderId;
		dpids += "&paymentIds["+0+"]="+_info.dpid;
		
		options["decorationPayment.dpid"] = _info.dpid;

    	com.post(url, options, function(result){
    		searcher.doSearch();
			hsearcher.doSearch();
    		decorationPayment.baseModal.modal("hide");
    		
    		var argsDrId = result.decorationPayment.drId;

			decorationPaymentPostData.paymentInfo = null;

			if(decorationPayment.typeUpdate == 1){
				bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
					if(result){
						params.decorationOrderOrderId = orderId;
						params.decorationPaymentOrderId = orderId;
						params.decorationReceiptDrId = argsDrId;
						com.popup("专用收款收据__装修单号:" + orderId  ,api.index.decorationPaymentReceiptIndex.url,function () {
							parent.layer.getFrameIndex(window.name);
						},null,true);
					}
				});
			}
    	});
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
		var dpids = "";
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
				_selectId = _paymentName + "Bank";
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

		url = api.payment.refundDecorationPayment;

		for(var arg in args){
			options["decorationPayment."+arg] = args[arg];
		}
		orderId = _info.decoration.orderId;
		dpids += "&paymentIds["+0+"]="+_info.dpid;

		options["decorationPayment.dpid"] = _info.dpid;
		options["decorationPayment.comment"] = $("#collectDes").val();

		com.post(url, options, function(result){
			searcher.doSearch();
			decorationPayment.baseModal.modal("hide");
			var argsDrId = result.decorationPayment.drId;

			bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {

				if(result){
					params.decorationOrderOrderId = orderId;
					params.decorationPaymentOrderId = orderId;
					params.decorationReceiptDrId = argsDrId;
					com.popup("专用收款收据__装修单号:" + orderId  ,api.index.decorationPaymentReceiptIndex.url,function () {
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
					["订单号","decoration.orderId"],
					['楼盘地址',['decoration.house.village.name', 'decoration.house.houseNumber']],
					['客户','decoration.customer.name'],
					['设计师','decoration.designer.currentName'],
					['设计部','decoration.designer.dept.deptName'],
					['应收金额', 'referMoney'],
					['收款人', 'collecter.currentName'],
					['收款时间', 'collectTime'],
					['类型', 'paymentType'],
					['状态', 'paymentStatus'],
					['备注', 'comment'],
					['现金', 'cash'],
					['银行', ['bank', 'bankInfo']],
					['转账', ['checkv', 'checkvBank']],
					['分期', ['installment', 'installmentBank']],
					['对公', ['accounts', 'accountsBank']],
					['预付款', 'advance'],
					['券', ['coupon', 'couponInfo']]
				],
				list: res.paging.data
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
				
				v.checkvBank = v.checkv != null && v.checkv != "0" ? decorationPayment.checkBankInfo[v.checkvBank] : '';
				v.installmentBank = v.installment != null && v.installment != "0" ? decorationPayment.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? decorationPayment.accountsInfo[v.accountsBank] : '';
			});
		});
    });
	
	$("#history").removeClass("active");
});

