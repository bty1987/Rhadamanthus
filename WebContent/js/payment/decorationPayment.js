jQuery(function($) {
	var decorationPaymentPostData = {};
	var decorationPayment = {
		paymentModelNameData: ["cash", "bank", "checkv", "advance", "coupon"],
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
		orderId: null,
		bankNums: [],
		checkvNums: [],
		paymentStatusArray: ["未付款", "已付款", "已确认", "审批中", "历史"]
	};

    decorationPayment.items.cashCheckbox = com.focusPage("#cashCheckbox");
    decorationPayment.items.bankCheckbox = com.focusPage("#bankCheckbox");
    decorationPayment.items.checkvCheckbox = com.focusPage("#checkvCheckbox");
    decorationPayment.items.advanceCheckbox = com.focusPage("#advanceCheckbox");
    decorationPayment.items.couponCheckbox = com.focusPage("#couponCheckbox");

	decorationPayment.refundDecorationPaymentModal = com.focusPage("#refundDecorationPaymentModal");

	decorationPayment.baseModal = com.focusPage("#baseItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#advancePayment", true);
		com.focusPage("#cash").val("");
		com.focusPage("#advance").val("");
	});

	//隐藏触发
	com.focusPage("#baseItemModal").on('hidden.bs.modal', function () {
		decorationPayment.bankUtilForGrade = [];
		decorationPayment.checkBankUtilForGrade = [];
	});
	
	decorationPayment.addReduceDetail = com.focusPage("#addReduceDetail");
	
	decorationPayment.items.couponType = com.focusPage("#couponType");

	com.focusPage("#collectBtn").bindClick(payment);
	com.focusPage("#saveRefundBtn").bindClick(refund);

	com.focusPage("#refundBankCard").on("click",function(e) {
		com.focusPage("#refundCashInfoDiv").addClass("hide");
		com.focusPage("#refundBankCardDiv").removeClass("hide");
		com.focusPage("#refundBank").addClass("v_required");
		com.focusPage("#refundBank").get(0).selectedIndex = 0;
	});

	com.focusPage("#refundCash").on("click",function(e) {
		com.focusPage("#refundCashInfoDiv").removeClass("hide");
		com.focusPage("#refundBankCardDiv").addClass("hide");
		com.focusPage("#refundBank").removeClass("v_required");
	});

	com.focusPage("#baseItemModal :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide()
    });

	com.focusPage("#advanceType").bindData([{"key":"1", "value":"合同"}, {"key":"2", "value":"工程"}], 'key', 'value');

	com.focusPage("#couponType").chosen({width: "216px", multi_type: "input"});
	com.focusPage("#refundCouponType").chosen({width: "216px", multi_type: "input"});

	decorationPayment.cash = [];
	decorationPayment.bank = [];
	decorationPayment.checkBank = [];
	decorationPayment.accounts = [];
	decorationPayment.couponType = [];

	decorationPayment.cashUtil = [];
	decorationPayment.bankUtil = [];
	decorationPayment.checkBankUtil = [];

	decorationPayment.bankUtilForGrade = [];
	decorationPayment.checkBankUtilForGrade = [];

	decorationPayment.cashInfo = {};
	decorationPayment.bankInfo = {};
	decorationPayment.checkBankInfo = {};
	decorationPayment.accountsInfo = {};
	decorationPayment.couponTypeData = {};

	//绑定收款单位的基础信息
	com.post(api.common.queryReceiptType, {}, function(res){
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				decorationPayment.cash.push(v);
				decorationPayment.cashUtil.push({"key":v.no,"value":v.name});
				decorationPayment.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				decorationPayment.bank.push(v);
				decorationPayment.bankUtil.push({"key":v.no,"value":v.name});
				decorationPayment.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				decorationPayment.checkBank.push(v);
				decorationPayment.checkBankUtil.push({"key":v.no,"value":v.name});
				decorationPayment.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				decorationPayment.accounts.push(v);
				decorationPayment.accountsInfo[v.no] = v.name;
			}else if(v.type == 5){
				decorationPayment.couponType.push(v);
				decorationPayment.couponTypeData[v.no] = [v.no, v.name];
			}
		});

	}, null,false);

	//现金方式
	paymentUtils.dynamicChosen('baseItemModal', "cashInfo", decorationPayment.cashUtil, "key", "value");

	com.focusPage("#couponType").bindData(decorationPayment.couponType, 'no', 'no');
	com.focusPage("#couponType").trigger("chosen:updated");

	//刷卡方式
	com.focusPage("#bankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "bankDiv", "#bankDivGroup", decorationPayment.bankNums, decorationPayment.bankUtilForGrade, "decoration");
		return false;
	});

	//转账方式
	com.focusPage("#checkvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "checkvDiv", "#checkvDivGroup", decorationPayment.checkvNums, decorationPayment.checkBankUtilForGrade, "decoration");
		return false;
	});
	
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
                ["设计部:", v.decoration.designer.dept.name, "grey"],
				["等级:", v.decoration.grade, "red"],
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

			//退款 增减项款 收款点击显示模态框
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
				com.focusPage('#' + tableId).html(null);
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
                ["设计部:", v.decoration.designer.dept.name, "grey"],
				["等级:", v.decoration.grade, "red"],
                ["应收金额:", v.referMoney, "blue"],
                ["收款人:", v.collecter.currentName, "grey"],
                ["收款时间:", v.collectTime, "green"],
                ["状态:", decorationPayment.paymentStatusArray[v.paymentStatus], "red"],
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
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, decorationPayment.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", paymentUtils.splitBankInfo(v.checkv, v.checkvBank, decorationPayment.checkBankInfo), "blue"]) : true;
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

			$divBtnWrap.append($btnPrint);

			if(v.paymentStatus == 2 && v.oneType == 0 && v.twoType != 2){
				$divBtnWrap.append($btnRefund);
			}else if(v.paymentStatus == 1){
				$divBtnWrap.append($btnUpdate);
			}

			$divBtnWrap.appendTo($h3);
            $liLine.append($h3).append($ulProperty).append($ulStyle);

			$btnRefund.click(function(){
				com.focusPage("#changeReason").val("");
				decorationPayment.paymentId = v.dpid;
				approvalUtils.initqueryApprovalUser("refundApproveManSel", 5);
				com.focusPage("#referMoneyApproval").val(v.referMoney);
				decorationPayment.refundDecorationPaymentModal.modal("show");
			});
            
            $btnPrint.click(function(){
				if(v.collecter.userId != params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配, 不能打印");
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
				com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

	com.focusPage("#saveRefundMoneyBtn").on('click', function(){
		if(com.validate("refundDecorationPaymentModal")){
			return;
		}

		var receiverId = com.focusPage("#refundApproveManSel").find('input:checked').attr('userid');

		if(receiverId == null || receiverId == ""){
			com.showAlert(com.error,"请选择审批人!");
			return;
		}

		var options = {
			"approval.receiver.userId": receiverId,
			"approval.comment": com.focusPage("#changeReason").val(),
			"approvalDecorationRefund.paymentId": decorationPayment.paymentId
		};

		bootbox.confirm("确认要提交退款申请吗?", function(res) {
			if(res){
				com.post(api.approval.submitApprovalForDecorationRefund, options, function(res){
					com.showAlert(com.info, "提交成功");
					hsearcher.doSearch();
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

		com.focusPage("#paymentInfo").text("");
		com.focusPage("#collectDes").val("");
		com.focusPage("#couponDiv div.form-group").removeClass("hide");
		com.focusPage("#historyUpdate").addClass("hide");
		com.focusPage("#advanceType").removeAttr("disabled");
		com.focusPage("#collectDes").removeAttr("disabled");
		com.focusPage("#advance").removeAttr("readonly");
		com.focusPage('.couponBlue').remove();

		paymentUtils.EmptyChosen('cashInfo');

		if(payment.oneType == 1){// 退款
			initBaseModal(payment);
			com.focusPage("#myModalPayLabel").text("退款信息");
			com.focusPage("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
			decorationPaymentPostData.orderId = payment.decoration.orderId;
			decorationPaymentPostData.customerId = payment.decoration.customer.cid;
			com.focusPage("#collectBtn").addClass("hide");
			com.focusPage("#saveRefundBtn").removeClass("hide");
		}else{
			initBaseModal(payment);
			com.focusPage("#myModalPayLabel").text("付款信息");
			com.focusPage("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
			decorationPaymentPostData.orderId = payment.decoration.orderId;
			decorationPaymentPostData.customerId = payment.decoration.customer.cid;
			com.focusPage("#collectBtn").removeClass("hide");
			com.focusPage("#saveRefundBtn").addClass("hide");
		}

        com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": decorationPaymentPostData.customerId},function(res){
			com.focusPage("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
			com.focusPage("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
        });

		decorationPayment.editFlg =  false;
	}

	function dialogPaymentUpdate(payment){
		decorationPaymentPostData.paymentInfo = payment;
		decorationPaymentPostData.orderId = payment.decoration.orderId;
		decorationPaymentPostData.customerId = payment.decoration.customer.cid;

		com.cleanItems(decorationPayment.items);

		com.focusPage("#historyUpdate").removeClass("hide");
		com.focusPage("#saveRefundBtn").addClass("hide");
		com.focusPage("#collectBtn").removeClass("hide");
		paymentUtils.EmptyChosen('cashInfo');

		initBaseModal(payment);
		com.focusPage("#advanceCheckbox").attr("disabled","disabled");
		com.focusPage("#couponCheckbox").attr("disabled","disabled");

		if(payment.advance!="" && payment.advance!=null && payment.advance!=0){
			com.focusPage("#advanceCheckbox").removeAttr("disabled");
			com.focusPage("#advanceCheckbox").trigger("click");
		}

		if(payment.coupon!="" && payment.coupon!=null && payment.coupon!=0){
			com.focusPage("#couponCheckbox").removeAttr("disabled");
			com.focusPage("#couponCheckbox").trigger("click");
		}

		com.focusPage("#advanceCheckbox").attr("disabled","disabled");
		com.focusPage("#couponCheckbox").attr("disabled","disabled");
		com.focusPage("#advanceType").attr("disabled","disabled");

		com.focusPage("#referMoney").val(payment.referMoney);
		com.focusPage("#collectDes").val(payment.comment);
		com.focusPage("#collectDes").attr("disabled","disabled");

		//历史收款信息
		com.focusPage("#cashHistory").text("现金: "+com.checkNull(decorationPayment.cashInfo[payment.cashInfo],"")+" "+com.checkNull(payment.cash,"无"));
		com.focusPage("#bankHistory").text("银行卡: " + (payment.bank == 0 ? "无" : paymentUtils.splitBankInfo(payment.bank, payment.bankInfo, decorationPayment.bankInfo)));
		com.focusPage("#checkvHistory").text("转账: " + (payment.checkv == 0 ? "无" : paymentUtils.splitBankInfo(payment.checkv, payment.checkvBank, decorationPayment.checkBankInfo)));
		com.focusPage("#installmentHistory").text("分期: "+com.checkNull(decorationPayment.bankInfo[payment.installmentBank],"")+" "+com.checkNull(payment.installment,"无"));
		com.focusPage("#accountsHistory").text("对公账户: "+com.checkNull(decorationPayment.accountsInfo[payment.accountsBank],"")+" "+com.checkNull(payment.accounts,"无"));

		//预付款
		com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": decorationPaymentPostData.customerId},function(res){
			com.focusPage("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
			com.focusPage("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
		});
		com.focusPage("#advance").val(payment.advance);
		com.focusPage("#advance").attr("readonly","readonly");

		//券信息
		var couponInfoList = {};
		var couponInfoAll = "";
		couponInfoAll = payment.couponInfo.substring(1,payment.couponInfo.length-1);
		couponInfoList = couponInfoAll.split("#");
		com.focusPage('.couponBlue').remove();

		com.focusPage("#couponDiv div.form-group").addClass("hide");

		decorationPayment.couponUpdate = payment.coupon;

		$.each(couponInfoList,function (i,v) {
			var $couponSpan = $('<span></span>').addClass('blue couponBlue').text(v).css({"font-size":"14px","margin-left":"20px"});
			com.focusPage("#couponDiv").append($couponSpan);
		});

		com.focusPage("#saveRefundBtn").addClass("hide");

	}

	//初始化收退款模态框
	function initBaseModal(payment){
		for(var i=0;i<decorationPayment.paymentModelNameData.length;i++){
			var _name = decorationPayment.paymentModelNameData[i];
			var _checkboxId = "#" + _name + "Checkbox";

			com.focusPage(_checkboxId).removeAttr("checked").removeAttr("disabled");

			if(_name == "bank"){
				com.focusPage("#bankDivGroup").html("");
				com.focusPage("#bankAdd").attr("num", 0).attr("maxnum",0);
			}else if(_name == "checkv"){
				com.focusPage("#checkvDivGroup").html("");
				com.focusPage("#checkvAdd").attr("num", 0).attr("maxnum",0);
			}
		}

		com.focusPage("#collectDes").val("");

		paymentUtils.EmptyChosen('cashInfo');
		paymentUtils.EmptyChosen('checkvBank');

		decorationPayment.bankNums = [];
		decorationPayment.checkvNums = [];

		decorationPayment.items.couponType.chosen("destroy");
		decorationPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
		decorationPayment.items.couponType.bindData(decorationPayment.couponType, 'no', 'name');
		decorationPayment.items.couponType.trigger("chosen:updated");

		//根据装修单等级获取收据类型等级
		var gradeParam;
		if(payment.decoration.grade == "A" || payment.decoration.grade == "C"){
			gradeParam = "A";
		}else{
			gradeParam = "";
		}

		// 根据等级在数组中筛选出符合要求的用于显示
		var returnGradeParams = paymentUtils.getValueForGrade(decorationPayment.bank, decorationPayment.checkBank, gradeParam);
		decorationPayment.bankUtilForGrade = returnGradeParams[0];
		decorationPayment.checkBankUtilForGrade = returnGradeParams[1];

		decorationPayment.baseModal.modal("show");
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
    			var $tableWrap = com.focusPage('#aresultList').empty();
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
    	var referPayment = com.focusPage("#referMoney").val();
    	var realPayment = 0;
    	var dpids = "";
    	var orderId = "";
		var _paymentInfo = "#paymentInfo";
		var couponCount = 0;

		com.focusPage(_paymentInfo).text("");

		var returnParams = paymentUtils.getBankInfoParams(decorationPayment.paymentModelNameData, "", decorationPayment.bankNums, decorationPayment.checkvNums, couponCount, decorationPayment.typeUpdate, decorationPayment.couponUpdate,  _paymentInfo);

		var realPayment = returnParams[0];
		var args = returnParams[1];

    	if(referPayment != realPayment){
			com.focusPage("#paymentInfo").text("当前实收款项总数与应收款项不等,请核实再进行提交!");
    		return false;
    	}
    	
    	if(com.focusPage("#advanceCheckbox").prop("checked")){
    		var _advance = 0;
    		var advanceType = com.focusPage("#advanceType").val();
    		
    		if(advanceType == 1){
    			_advance = parseFloat(com.focusPage("#balanceAdvance").val());
    		}else if(advanceType == 2){
    			_advance = parseFloat(com.focusPage("#projectAdvance").val());
    		}
    		
    		if(_advance > 0 && _advance < parseFloat(com.focusPage("#advance").val())){
				com.focusPage("#paymentInfo").text("预付款金额大于当前客户预付款余额!");
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
			options["decorationPayment.comment"] = com.focusPage("#collectDes").val();
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
		var referPayment = com.focusPage("#referMoney").val();
		var realPayment = 0;
		var dpids = "";
		var orderId = "";
		var _paymentInfo = "#paymentInfo";
		var couponCount = 0;

		com.focusPage(_paymentInfo).text("");

		var returnParams = paymentUtils.getBankInfoParams(decorationPayment.paymentModelNameData, "", decorationPayment.bankNums, decorationPayment.checkvNums, couponCount, decorationPayment.typeUpdate,  0, _paymentInfo);

		var realPayment = returnParams[0];
		var args = returnParams[1];

		if(referPayment != realPayment){
			com.focusPage("#paymentInfo").text("当前实收款项总数与应收款项不等,请核实再进行提交!");
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
		options["decorationPayment.comment"] = com.focusPage("#collectDes").val();

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

	com.focusPage('a[name="import"]', '#hpagenation').click(function () {
    	if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

    	if(com.focusPage('span[name="totalRecords"]').text() > 1000){
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
					['设计部','decoration.designer.dept.name'],
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

				if(v.checkv != null && v.checkv != 0){
					var checkBankInfoStr = v.checkvBank;
					if(checkBankInfoStr.indexOf("#") != -1){
						var $checkvInfo = ' ';
						var _c = v.checkvBank.split('#');
						for(var i=1;i<_c.length-1;i++){
							var _i = _c[i].split('|');
							$checkvInfo += decorationPayment.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.checkvBank = $checkvInfo;
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? decorationPayment.checkBankInfo[v.checkvBank] : '';
					}
				}

				v.installmentBank = v.installment != null && v.installment != "0" ? decorationPayment.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? decorationPayment.accountsInfo[v.accountsBank] : '';
				v.paymentStatus = decorationPayment.paymentStatusArray[v.paymentStatus];
			});
		});
    });

	com.focusPage("#historyDecoration").removeClass("active");
});

