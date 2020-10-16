jQuery(function($) {
	var decorationPaymentPostData = {};
	var decorationPayment = {
		paymentModelNameData: ["cash", "bank", "checkv", "advance", "coupon"],
		orderPaymentId: null,
		paymentId: null,
		items: {
			cashCheckbox: com.focusPage("#cashCheckbox"),
			bankCheckbox: com.focusPage("#bankCheckbox"),
			checkvCheckbox: com.focusPage("#checkvCheckbox"),
			advanceCheckbox: com.focusPage("#advanceCheckbox"),
			couponCheckbox: com.focusPage("#couponCheckbox"),
			advanceType: com.focusPage("#advanceType"),
			couponType: com.focusPage("#couponType"),
			couponVal: com.focusPage("#couponVal"),
			cash: com.focusPage("#cash"),
			advance: com.focusPage("#advance")
		},
		editFlg: false,
		paymentType: "增项款",
		orderId: null,
		checkvNums: [],
		paymentStatusArray: ["未付款", "已付款", "已确认", "审批中", "历史"],
		htmlName: "",
		modelId: "baseItemModal",
		modals: {
			refundDecorationPaymentModal: com.focusPage("#refundDecorationPaymentModal"),
			baseModal: com.focusPage("#baseItemModal"),
			addReduceDetail: com.focusPage("#addReduceDetail")
		},

		cash: [],
		bank: [],
		checkBank: [],
		accounts: [],
		couponType: [],
		posValues: {},

		cashUtil: [],
		bankUtil: [],
		checkBankUtil: [],

		cashInfo: {},
		bankInfo: {},
		checkBankInfo: {},
		accountsInfo: {},
		couponTypeData: {},

		bankUtilForGrade: [],
		checkBankUtilForGrade: [],
		addReduceItemType: [],

		mno: null,
		_posway: [],
		pointofsalesType: 1
	};

	//隐藏触发
	decorationPayment.modals.baseModal.on('hide.bs.modal', function () {
		decorationPayment.bankUtilForGrade = [];
		decorationPayment.checkBankUtilForGrade = [];
		com.focusPage("#couponUl").html("");
		com.focusPage("#posDivGroup").html("");
		com.focusPage("#bankDivGroup").html("");
		com.closeTip();
	});

	decorationPayment.modals.refundDecorationPaymentModal.on('hide.bs.modal', function () {
		com.closeTip();
	});

	com.post(api.ds.quotation, {}, function(res){
		$.each(res.addReduceItemType, function (i, v) {
			decorationPayment.addReduceItemType[v.key] = v.value;
		});
	});

	com.post(api.ds.payment, {}, function(res){
		$.each(res.posway, function (i, v) {
			decorationPayment._posway.push(v);
		});
	});

	com.focusPage("#collectBtn").bindClick(function(){
		paymentUtils.payment(decorationPayment, decorationPaymentPostData, searcher, hsearcher);
	});

	com.focusPage("#saveRefundBtn").bindClick(refund);

	com.focusPage("#baseItemModal :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
		if($(this).prop("checked") && this.id == "bankCheckbox"){
			com.focusPage("#bankDivGroup").html("");
			paymentUtils.addBankPosUtil("#bankDivGroup", decorationPayment.bankUtilForGrade, decorationPayment);
		}
	});

	com.focusPage("#advanceType").bindData([{"key":"1", "value":"合同"}], 'key', 'value');

	//绑定收款单位的基础信息
	paymentUtils.getReceiptType(decorationPayment);

	//现金方式
	com.selectTypeahead("cashInfo", decorationPayment.cashUtil, "key", "value", null);

	//优惠券方式
	com.selectTypeahead("couponType", decorationPayment.couponType, 'no', 'name');

	com.focusPage("#couponAdd").unbind().click(function(){
		if(com.validate("couponInputs")){
			return;
		}

		paymentUtils.createCounpon();

		com.focusPage("#couponType").val('');
	});

	//转账方式(银行)
	com.focusPage("#checkvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "checkvDiv", "#checkvDivGroup", decorationPayment.checkvNums, decorationPayment.checkBankUtilForGrade, decorationPayment);
		return false;
	});

	com.focusPage("#historyDecoration").removeClass("active");
	
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
                ["楼盘地址:", v.decoration.house.village.cityProper.city.name + ' ' + v.decoration.house.village.cityProper.name + ' ' + v.decoration.house.village.name + ' '+ v.decoration.house.houseNumber, "grey"],
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
				if(v.oneType == 0){
					com.post(api.payment.queryPointofsales, {"pointofsales.pid": v.decoration.orderId}, function(res){
						$.each(res.pointofsaleses, function(i, value){
							if(value.status == 0 || value.status == 1) {
								paymentUtils.addPos(value, decorationPayment.htmlName);
								com.focusPage("#bankCheckbox").prop("checked", true);
								com.focusPage("#posDiv").prop("style", "display: block");
								com.focusPage("#bankDiv").prop("style", "display: block");
							}
						});
						res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#bankDivGroup", decorationPayment.bankUtilForGrade, decorationPayment) : "";
					});
				}
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
	
	searcher.init(["payment-orderId", "payment-designer", "payment-village", "payment-houseNumber"], "condList", api.payment.pageDecorationPaymentForCommit, function(data){
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
                ["楼盘地址:", v.decoration.house.village.cityProper.city.name + ' ' + v.decoration.house.village.cityProper.name + ' ' + v.decoration.house.village.name +' '+ v.decoration.house.houseNumber, "grey"],
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
			v.bank != null && v.bank != "0" ? styleArr.push(["刷卡:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, decorationPayment.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.checkv, v.checkvBank, decorationPayment.checkBankInfo), "blue"]) : true;
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
				decorationPayment.modals.refundDecorationPaymentModal.modal("show");
			});
            
            $btnPrint.click(function(){
				params.decorationOrderOrderId = v.decoration.orderId;
				params.decorationPaymentOrderId = v.decoration.orderId;
				params.decorationReceiptDrId = v.drId;
				com.popup("专用收款收据__装修单号:" + v.decoration.orderId  ,api.index.decorationPaymentReceiptIndex.url,function () {
					parent.layer.getFrameIndex(window.name);
				},null,true);
            });
			$btnUpdate.click(function(){
				decorationPayment.typeUpdate = 2;
				var updateReturnParams = paymentUtils.dialogPaymentUpdate(v, decorationPayment);
				decorationPaymentPostData.paymentInfo = updateReturnParams[0];
				decorationPaymentPostData.orderId = updateReturnParams[1];
				decorationPayment.couponUpdate = updateReturnParams[3];

				com.post(api.payment.queryPointofsales, {"pointofsales.pid": v.decoration.orderId, "pointofsales.rid": v.drId}, function(res){
					$.each(res.pointofsaleses, function(i, value){
						if(value.status == 4) {
							paymentUtils.addPos(value, decorationPayment.htmlName);
							com.focusPage("#bankCheckbox").prop("checked", true);
							com.focusPage("#posDiv").prop("style", "display: block");
							com.focusPage("#bankDiv").prop("style", "display: block");
						}
					});
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

		com.showConfirm("确认要提交退款申请吗?", function(res) {
			com.post(api.approval.submitApprovalForDecorationRefund, options, function(res){
				com.showAlert(com.info, "提交成功");
				hsearcher.doSearch();
			});

			decorationPayment.modals.refundDecorationPaymentModal.modal("hide");
		});
	});
	
	var hsearcher = new Searcher();
	
	hsearcher.init(["payment-orderId", "payment-designer", "payment-village", "payment-houseNumber", "payment-collectTime"], "hcondList", api.payment.pageDecorationPaymentForHistory, function(data){
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

		com.focusPage("#collectDes").val("");
		com.focusPage("#couponDiv div.form-group").removeClass("hide");
		com.focusPage("#historyUpdate").addClass("hide");
		com.focusPage("#advanceType").removeAttr("disabled");
		com.focusPage("#collectDes").removeAttr("disabled");
		com.focusPage("#advance").removeAttr("readonly");
		com.focusPage('.couponBlue').remove();

		com.cleanTypeahead('cashInfo');

		if(payment.oneType == 1){// 退款
			paymentUtils.initBaseModal(payment, decorationPayment);

			//退款时不能使用刷卡方式 init中会重置状态 这个必须放到initBaseModal方法后
			com.focusPage("#bankCheckbox").attr("disabled","disabled");

			com.focusPage("#myModalPayLabel").text("退款信息");
			com.focusPage("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
			decorationPaymentPostData.orderId = payment.decoration.orderId;
			com.focusPage("#collectBtn").addClass("hide");
			com.focusPage("#saveRefundBtn").removeClass("hide");
		}else{
			paymentUtils.initBaseModal(payment, decorationPayment);
			com.focusPage("#myModalPayLabel").text("付款信息");
			com.focusPage("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
			decorationPaymentPostData.orderId = payment.decoration.orderId;
			com.focusPage("#collectBtn").removeClass("hide");
			com.focusPage("#saveRefundBtn").addClass("hide");
		}

        com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": decorationPaymentPostData.orderId},function(res){
			com.focusPage("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
        });

		decorationPayment.editFlg =  false;

		decorationPayment.mno = payment.decoration.orderId;
	}

	//增减项详细信息
    function addReduceDetail(decorationPaymentId, paymentType, orderId){
        com.cleanItems(decorationPayment.items);
    	
    	decorationPayment.orderPaymentId = decorationPaymentId;
    	decorationPayment.paymentType = paymentType;
    	decorationPayment.orderId = orderId;
    	decorationPayment.modals.addReduceDetail.modal("show");
    	
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
    		["类型:", decorationPayment.addReduceItemType[v.type], "grey"]
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

	function refund(){
		if(com.validate('baseItemModal')){
			return;
		}

		var url = "";
		var options = {};
		var args = {};
		var referPayment = com.focusPage("#referMoney").val();
		var realPayment = 0;
		var dpids = "";
		var orderId = "";
		var couponCount = 0;

		var returnParams = paymentUtils.getBankInfoParams(decorationPayment.paymentModelNameData, "", decorationPayment.checkvNums, couponCount, decorationPayment.typeUpdate, 0);

		var realPayment = returnParams[0];
		var args = returnParams[1];

		if(referPayment != realPayment){
			com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
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
			decorationPayment.modals.baseModal.modal("hide");
			var argsDrId = result.decorationPayment.drId;

			com.showConfirm("是否需要打印当前收款对应的收据信息?", function(result) {
				params.decorationOrderOrderId = orderId;
				params.decorationPaymentOrderId = orderId;
				params.decorationReceiptDrId = argsDrId;
				com.popup("专用收款收据__装修单号:" + orderId  ,api.index.decorationPaymentReceiptIndex.url,function () {
					parent.layer.getFrameIndex(window.name);
				},null,true);
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
					['楼盘地址',['decoration.house.village.cityProper.city.name', 'decoration.house.village.cityProper.name', 'decoration.house.village.name', 'decoration.house.houseNumber']],
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
					['刷卡', ['bank', 'bankInfo']],
					['银行', ['checkv', 'checkvBank']],
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
});

