
jQuery(function($) {
	var materialPaymentPostData = {};
	var materialPayment = {
		paymentModelNameData: ["cash", "bank", "checkv", "advance", "coupon"],
		materialPaymentTypeData: {},
		materialPaymentRevTypeData: {},
		couponType: {},
		couponTypeData: {},
		customerId: null,
		saveBtn: null,
		cancelBtn: null,
		baseModal: null,
		refundModal: null,
		items: {},
		editFlg: false,
		historyFlag: false,
		validator: {
			price: {
				type: "v_price",
				regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
				errorMsg: "价格内容输入错误."
			}
		},
		bankNums:[],
		checkvNums: []
	};

	materialPayment.baseModal = com.focusPage("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
		com.focusPage("#paymentInfo").val("");
	});
	materialPayment.saveBtn = com.focusPage("#saveBtn").bindClick(payment);
	materialPayment.saveBtn = com.focusPage("#saveRefundBtn").bindClick(refund);
	materialPayment.cancelBtn = com.focusPage("#cancelBtn").on("click", function(){
		materialPayment.historyFlag = false;
	});

	materialPayment.refundModal = com.focusPage("#refundModal").on('show.bs.modal', function(e){
		com.clearValidator();
		com.focusPage("#paymentInfo").val("");
	});

    materialPayment.items.cashCheckbox = com.focusPage("#cashCheckbox");
    materialPayment.items.bankCheckbox = com.focusPage("#bankCheckbox");
    materialPayment.items.checkvCheckbox = com.focusPage("#checkvCheckbox");
    materialPayment.items.couponCheckbox = com.focusPage("#couponCheckbox");
    materialPayment.items.advanceCheckbox = com.focusPage("#advanceCheckbox");
	materialPayment.items.couponType = com.focusPage("#couponType");

	materialPayment.cash = [];
	materialPayment.bank = [];
	materialPayment.bankUtil = [];
	materialPayment.checkBank = [];
	materialPayment.accounts = [];
	materialPayment.couponType = [];

	materialPayment.cashUtil = [];
	materialPayment.bankUtil = [];
	materialPayment.checkBankUtil = [];

	materialPayment.cashInfo = {};
	materialPayment.bankInfo = {};
	materialPayment.checkBankInfo = {};
	materialPayment.accountsInfo = {};
	materialPayment.couponTypeData = {};

	com.post(api.common.queryReceiptType, {}, function(res){
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				materialPayment.cash.push(v);
				materialPayment.cashUtil.push({"key":v.no,"value":v.name});
				materialPayment.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				materialPayment.bank.push(v);
				materialPayment.bankUtil.push({"key":v.no,"value":v.name});
				materialPayment.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				materialPayment.checkBank.push(v);
				materialPayment.checkBankUtil.push({"key":v.no,"value":v.name});
				materialPayment.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				materialPayment.accounts.push(v);
				materialPayment.accountsInfo[v.no] = v.name;
			}else if(v.type == 5){
				materialPayment.couponType.push(v);
				materialPayment.couponTypeData[v.no] = [v.no, v.name];
			}
		});
	}, null, false);

	paymentUtils.dynamicChosen('baseItemModal',"materialcashInfo",materialPayment.cashUtil,"key","value");

	com.focusPage("#couponType").bindData(materialPayment.couponType, 'no', 'name');
	com.focusPage("#couponType").trigger("chosen:updated");

	$.extend(com.validator, materialPayment.validator);

	com.focusPage("#historyMaterial").removeClass("active");

    com.focusPage("#baseItemModal :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show()  : com.focusPage("[referCheckbox="+this.id+"]").hide()
    });

	com.post(api.ds.payment, {}, function(res){
		com.focusPage("#advanceType").bindData(res.advanceType, 'key', 'value');

		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialPayment.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialPayment.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}
	}, null, false);

	com.focusPage("#couponType").chosen({width: "216px", multi_type: "input"});
	com.focusPage("#refundCouponType").chosen({width: "216px", multi_type: "input"});

	com.focusPage("#materialbankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);

		paymentUtils.addBankUtil(maxNum, "bankDiv", "#materialbankDivGroup", materialPayment.bankNums, materialPayment.bankUtil, "material");

		return false;
	});

	com.focusPage("#materialcheckvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "checkvDiv", "#materialcheckvDivGroup", materialPayment.checkvNums, materialPayment.checkBankUtil, "material");
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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier');

            var propertyArr = [
               ["订单号:",  v.material.orderId, "blue"],
               ["主材号:", v.material.no, "blue"],
               ["楼盘地址:", v.material.house.village.name +''+ v.material.house.houseNumber, "grey"],
               ["客户:", v.material.customer.name, "grey"],
               ["品牌:", v.brand, "grey"],
               ["操作人:", v.creater.currentName, "grey"],
               ["应收金额:", v.referMoney, "blue"]
            ];

            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "mpIds",
				"class": "ace ace-checkbox-2",
				"mpId": v.mpId,
				"orderId": v.material.orderId,
				"referMoney": v.referMoney,
				"customerId": v.material.customer.cid,
				"paymentType": v.paymentType
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(materialPayment.materialPaymentTypeData[v.paymentType]);

            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $label.append($input).append($span).appendTo($h3);

            $divBtnWrap.append($btnCollect).appendTo($h3);

            if([4, 5, 6, 7].indexOf(v.paymentType) != -1){
        		$btnCollect.text('退款').addClass("btn-danger");
        	}else{
        		$btnCollect.text('收款').addClass("btn-info");
        	}

            $liLine.append($h3).append($ulProperty);

            $btnCollect.click(function(){
				materialPayment.typeUpdate = 1;
            	dialogPayment(v);
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

	searcher.init(["orderId", "msoNo", "paymentMsoDesigner", "paymentOrderAddr"], "condList", api.payment.pageMaterialPaymentForInit, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialPaymentPostData", null, false, null, function(){
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('批量收款').appendTo($adda);

    	var $showa = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px");
    	var $showi = $('<i></i>').addClass('icon-calculator bigger-110').appendTo($showa);
    	var $showspan = $('<span></span>').text('合计').appendTo($showa);

    	return [$adda, $showa];
	});

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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
			var $btnUpdateM = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            var propertyArr = [
               ["订单号:", v.material.orderId, "blue"],
               ["主材号:", v.material.no, "blue"],
               ["楼盘地址:", v.material.house.village.name +''+ v.material.house.houseNumber, "grey"],
               ["客户:", v.material.customer.name, "grey"],
               ["品牌:", v.brand, "grey"],
               ["操作人:", v.creater.currentName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collecter.currentName, "grey"],
               ["收款时间:", v.collectTime, "green"],
               ["状态:", v.paymentStatus == 1 ? '已付款' : '已确认', "red"],
               ["备注:", v.comment, "grey"]
            ];

            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "hmpIds",
				"class": "ace ace-checkbox-2",
				"mpId": v.mpId,
				"mrId": v.mrId,
				"orderId": v.material.orderId,
				"referMoney": v.referMoney,
				"customerId": v.material.customer.cid,
				"paymentType": v.paymentType
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl');

            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var styleArr = [];

			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, materialPayment.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", paymentUtils.splitBankInfo(v.checkv, v.checkvBank, materialPayment.checkBankInfo), "blue"]) : true;
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

			$label.append($input).append($span);
			$h3.append($('<small></small>').addClass('blue').html(materialPayment.materialPaymentTypeData[v.paymentType]));

            $divBtnWrap.append($btnPrint).appendTo($h3);

			if(v.paymentStatus == 2){
				$divBtnWrap.append($btnPrint).appendTo($h3);
			}else if(v.paymentStatus == 1){
				$divBtnWrap.append($btnPrint).append($btnUpdateM).appendTo($h3);
			}

            $liLine.append($h3).append($ulProperty).append($ulStyle);

			var mrId = v.mrId;

			$btnPrint.click(function(){
				if(v.collecter.userId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配, 不能打印");
					return false;
				}else{
					params.mrId = mrId;
					params.decorationOrderMOrderId = v.material.orderId;
					params.decorationReceiptDrId = v.drId;
					com.popup("专用收款收据__装修单号: " + v.material.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true)
				}
			});

			$btnUpdateM.click(function(){
				materialPayment.typeUpdate = 2;
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

	hsearcher.init(["orderId", "msoNo", "paymentMsoDesigner", "paymentOrderAddr", "collectTimeDateRange"], "hcondList", api.payment.pageMaterialPaymentForNotInit, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hmaterialPaymentPostData", null, false, null, function(){
    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);

    	return [$impa];
    }, "hresultList");

	com.focusPage('a[name="showTotal"]', '#pagenation').click(function(){
		var $total = 0;
		var $inputs = com.focusPage('input[name="mpIds"]:checked');

		$inputs.length && ($.each($inputs, function(i, v){
			var $that = $(v);
			var $type = parseInt($that.attr('paymenttype'));
			var $referMoney = $that.attr('referMoney');

			if([4, 5, 6, 7].indexOf($type) != -1){
				$total = utils.accSub($total, $referMoney);
			}else{
				$total = utils.accAdd($total, $referMoney);
			}
		}), com.showInfo('<h3>合计金额: ' + $total + '</h3>'));

	});

	com.focusPage('a[name="collects"]', '#pagenation').click(function(){
		com.cleanItems(materialPayment.items);
        materialPayment.typeUpdate = 1;

		com.focusPage("#des").val("");
		com.focusPage("#des").removeAttr("disabled");
		com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
		com.focusPage("#advance").removeAttr("readonly");

		com.focusPage("#saveBtn").removeClass("hide");
		com.focusPage("#saveRefundBtn").addClass("hide");
        com.focusPage("#historyUpdateM").addClass("hide");

		var $inputs = com.focusPage('input[name="mpIds"]:checked');

		if(!$inputs.length) return;

		var _orderId = "";
		var _paymentType = 0;
		var _paymentTypeFlag = 0;
		var customerId = "";
		var flags = [];
		var flag = 0;

		var sumMoney = 0;

		materialPaymentPostData.paymentInfo = [];

		$.each($inputs, function(i, v){
			var $input = $(v);

			var row = {
				"orderId": $input.attr("orderid"),
				"customerId": $input.attr("customerid"),
				"paymentType": $input.attr("paymenttype"),
				"referMoney": $input.attr("refermoney"),
				"mpId": $input.attr("mpid")
			};
			flags.push(row.paymentType);

			if(_orderId == ""){
				_orderId = row.orderId;
			}else {
				if(_orderId != row.orderId){
					com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
					_paymentTypeFlag = 1;
				}
			}

			if(customerId == ""){
				customerId = row.customerId;
			}else{
				if(customerId != row.customerId){
					com.showAlert(com.warning, "批量收款不支持不同客户间的操作.");
					_paymentTypeFlag = 2;
				}
			}

			materialPaymentPostData.orderId = _orderId;
			materialPaymentPostData.customerId = customerId;

			if(_paymentType == 0){
				_paymentType = row.paymentType;
			}

			if([4, 5, 6, 7].indexOf(row.paymentType) != -1){
				sumMoney = utils.accSub(sumMoney, parseFloat(row.referMoney));
				if([4, 5, 6, 7].indexOf(_paymentType) == -1){
					_paymentTypeFlag = 3;
				}
			}else{
				sumMoney = utils.accAdd(sumMoney, parseFloat(row.referMoney));
				if([4, 5, 6, 7].indexOf(_paymentType) != -1){
					_paymentTypeFlag = 3;
				}
			}

			materialPaymentPostData.paymentInfo.push(row);

			com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": materialPaymentPostData.customerId},function(res){
				com.focusPage("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
				com.focusPage("#zaterialAdvance").val(res.zaterialAdvance).attr("readonly", "readonly");
			},null,false);
		});

		$.each(flags, function (i, v) {
			if (["4", "5", "6", "7"].indexOf(v) != -1) {
				flag = 1;
			}
		});

		if (flag == 1) {
			com.showAlert(com.warning, "批量收款不支持退款");
			return false;
		}

		com.focusPage("#sumMoney").val(sumMoney);
		com.focusPage("#sumMoneyShow").html(sumMoney);

		if(_paymentTypeFlag != 0){
			_paymentTypeFlag != 1 ? _paymentTypeFlag != 2 ? com.showAlert(com.warning, "批量收款只能选择相同类型的收款项") : com.showAlert(com.warning, "批量收款只能选择相同类型的收款项") : com.showAlert(com.warning, "批量收款不支持不同订单间的操作");
			return false;
		}

		if(sumMoney >= 0){
			initBaseModal();

			com.focusPage("#referMoney").val(sumMoney).attr("disabled", "disabled");
			com.focusPage("#couponCheckbox").attr("disabled", "disabled");

			materialPayment.baseModal.modal("show");
		}else{
			com.showAlert(com.warning, "退款不支持批量操作!");
		}
    });

	com.focusPage('a[name="import"]', '#hpagenation').click(function () {
    	if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

    	if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}

		com.post(api.payment.pageMaterialPaymentForNotInit, $.extend({}, params.hmaterialPaymentPostData, {"paging.noPage": 1}), function(res){
			$.exceler({
				column : [
					["订单号","material.orderId"],
					["主材号","material.no"],
					['楼盘地址',['material.house.village.name', 'material.house.houseNumber']],
					['品牌','brand'],
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
					    $info += materialPayment.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
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
							$checkvInfo += materialPayment.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.checkvBank = $checkvInfo;
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? materialPayment.checkBankInfo[v.checkvBank] : '';
					}
				}

				v.installmentBank = v.installment != null && v.installment != "0" ? materialPayment.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? materialPayment.accountsInfo[v.accountsBank] : '';

				v.paymentType = materialPayment.materialPaymentTypeData[v.paymentType];
				v.paymentStatus = v.paymentStatus == 1 ? '已付款' : '已确认';
			});
		});
    });

	function dialogPayment(payment){
        com.cleanItems(materialPayment.items);

		materialPaymentPostData.orderId = payment.material.orderId;
		materialPaymentPostData.customerId = payment.material.customer.cid;
		com.focusPage("#historyUpdateM").addClass("hide");
		com.focusPage("#advance").removeAttr("readonly");
		com.focusPage("#des").removeAttr("disabled");
		com.focusPage("#des").val("");

		if([1, 2, 3].indexOf(payment.paymentType) != -1){
			initBaseModal();
			com.focusPage("#myModalLabel").text("付款信息");
			com.focusPage("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
			com.focusPage("#saveBtn").removeClass("hide");
			com.focusPage("#saveRefundBtn").addClass("hide");


		}else if([4, 5, 6, 7].indexOf(payment.paymentType) != -1){
			initBaseModal();
			com.focusPage("#myModalLabel").text("退款信息");
			com.focusPage("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
			com.focusPage("#saveBtn").addClass("hide");
			com.focusPage("#saveRefundBtn").removeClass("hide");
		}

        com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": materialPaymentPostData.customerId},function(res){
            com.focusPage("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
            com.focusPage("#zaterialAdvance").val(res.zaterialAdvance).attr("readonly", "readonly");
        },null,false);

		materialPaymentPostData.paymentInfo = [payment];

		materialPayment.editFlg =  false;
	}

	function dialogPaymentUpdate(payment){
		materialPaymentPostData.orderId = payment.material.orderId;
		materialPaymentPostData.customerId = payment.material.customer.cid;

		com.cleanItems(materialPayment.items);

		com.focusPage("#historyUpdateM").removeClass("hide");
		com.focusPage("#saveRefundBtn").addClass("hide");
		com.focusPage("#saveBtn").removeClass("hide");
		initBaseModal();
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
		com.focusPage("#referMoney").attr("disabled","disabled");

		com.focusPage("#des").val(payment.comment);
		com.focusPage("#des").attr("disabled","disabled");

		//历史收款信息
		com.focusPage("#cashHistoryM").text("现金: "+com.checkNull(materialPayment.cashInfo[payment.cashInfo],"")+" "+com.checkNull(payment.cash,"无"));
		com.focusPage("#bankHistoryM").text("银行卡: "+ (payment.bank == 0 ? "无" : paymentUtils.splitBankInfo(payment.bank, payment.bankInfo, materialPayment.bankInfo)));
		com.focusPage("#checkvHistoryM").text("转账: "+ (payment.checkv == 0 ? "无" : paymentUtils.splitBankInfo(payment.checkv, payment.checkvBank, materialPayment.checkBankInfo)));
		com.focusPage("#installmentHistoryM").text("分期: "+com.checkNull(materialPayment.bankInfo[payment.installmentBank],"")+" "+com.checkNull(payment.installment,"无"));
		com.focusPage("#accountsHistoryM").text("对公账户: "+com.checkNull(materialPayment.accountsInfo[payment.accountsBank],"")+" "+com.checkNull(payment.accounts,"无"));

		materialPayment.historyMaterialPayment = utils.accAdd(utils.accAdd(utils.accAdd(payment.cash, payment.bank), utils.accAdd(payment.checkv,payment.coupon)), payment.advance);

		com.focusPage("#referMoney").val(materialPayment.historyMaterialPayment);

		//预付款
		com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": materialPaymentPostData.customerId},function(res){
			com.focusPage("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
			com.focusPage("#zaterialAdvance").val(res.zaterialAdvance).attr("readonly", "readonly");
		},null,false);

		materialPaymentPostData.paymentInfo = [payment];
		com.focusPage("#advance").val(payment.advance);
		com.focusPage("#advance").attr("readonly","readonly");

		//券信息
		var couponInfoList = {};
		var couponInfoAll = "";
		couponInfoAll = payment.couponInfo.substring(1,payment.couponInfo.length-1);
		couponInfoList = couponInfoAll.split("#");
		com.focusPage('.couponBlue').remove();

		com.focusPage("#couponDiv div.form-group").addClass("hide");

		materialPayment.couponUpdate = payment.coupon;

		$.each(couponInfoList,function (i,v) {
			var $couponSpan = $('<span></span>').addClass('blue couponBlue').text(v).css({"font-size":"14px","margin-left":"20px"});
			com.focusPage("#couponDiv").append($couponSpan);
		});
	}

	function initBaseModal(){
		com.focusPage("#couponDiv div.form-group").removeClass("hide");
		com.focusPage('.couponBlue').remove();

		materialPayment.bankNums = [];
		materialPayment.checkvNums = [];

		for(var i=0;i<materialPayment.paymentModelNameData.length;i++){
			var _name = materialPayment.paymentModelNameData[i];
			var _checkboxId = "#" + _name + "Checkbox";
			var _divId = "#" + _name + "Div";
			var _inputId = "#" + _name;
			var _selectId = "";
			if(_name != "bank"){
				_selectId = "#"+ _name + "Bank";
			}else{
				_selectId = "#" + _name + "Name";
			}

			com.focusPage(_checkboxId).removeAttr("checked").removeAttr("disabled");

			com.focusPage(_inputId).val("");
			com.focusPage(_selectId).val("");

			if(_name == "coupon"){
				com.focusPage("#couponType").chosen("destroy");
				com.focusPage("#couponType").chosen({width: "216px", multi_type: "input"});
				com.focusPage("#couponType").bindData(materialPayment.couponType, 'no', 'name');
				com.focusPage("#couponType").trigger("chosen:updated");
			}else if(_name == "bank"){
				com.focusPage("#materialbankDivGroup").html("");
				com.focusPage("#materialbankAdd").attr("num", 0).attr("maxnum", 0);
			}else if(_name == "checkv"){
				com.focusPage("#materialcheckvDivGroup").html("");
				com.focusPage("#materialcheckvAdd").attr("num", 0).attr("maxnum", 0);
			}
		}

		com.focusPage("des").val("");

		paymentUtils.EmptyChosen('materialcashInfo');
		paymentUtils.EmptyChosen('materialcheckvBank');

		materialPayment.items.couponType.chosen("destroy");
		materialPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
		materialPayment.items.couponType.bindData(materialPayment.couponType, 'no', 'name');
		materialPayment.items.couponType.trigger("chosen:updated");

		materialPayment.baseModal.modal("show");
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
		var couponCount = 0;

		var resMrIdIndex = "";

		var mpIds = "";
		
		var _paymentInfo = "#paymentInfo";

		com.focusPage(_paymentInfo).text("");

		var returnParams = paymentUtils.getBankInfoParams(materialPayment.paymentModelNameData, "material", materialPayment.bankNums, materialPayment.checkvNums, couponCount, materialPayment.typeUpdate,  materialPayment.couponUpdate, _paymentInfo);

		var realPayment = returnParams[0];
		var args = returnParams[1];

		if(referPayment != realPayment){
			com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
			return false;
		}

		if(com.focusPage("#advanceCheckbox").prop("checked")){
			var _advance = 0;
			var advanceType = com.focusPage("#advanceType").val();

			if(advanceType == 1){
				_advance = parseFloat(com.focusPage("#materialAdvance").val());
			}else if(advanceType == 2){
				_advance = parseFloat(com.focusPage("#zaterialAdvance").val());
			}

			if(_advance > 0 && _advance < parseFloat(com.focusPage("#advance").val())){
				com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
				return false;
			}
		}

		if($.isEmptyObject(args)){
			com.showAlert(com.warning, "无收款方式信息");
			return false;
		}

		if(materialPayment.typeUpdate == 1){
			url = api.payment.collectMaterialPayments;
			$.each(materialPaymentPostData.paymentInfo, function(i, v){
				options["materialPayments["+i+"].mpId"] = v.mpId;
			});
			options["materialReceipt.comment"] = com.focusPage("#des").val();
		}else{
			url = api.payment.updateMaterialPayment;
			$.each(materialPaymentPostData.paymentInfo, function(i, v){
				options["materialPayment.mpId"] = v.mpId;
			});
		}

		for(var arg in args){
			options["materialReceipt."+arg] = args[arg];
		}

		resMrIdIndex = "materialReceipt";

		options["material.orderId"] = materialPaymentPostData.orderId;

		com.post(url, options, function(result){
			searcher.doSearch();
			hsearcher.doSearch();
			materialPayment.historyFlag = false;

			if(materialPayment.typeUpdate == 1){
				var mrId = result.materialReceipt.mrId;
				bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
					if(result){
						params.mrId = mrId;
						params.decorationOrderMOrderId = materialPaymentPostData.orderId;
						com.popup("专用收款收据__装修单号:" + materialPaymentPostData.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
							parent.layer.getFrameIndex(window.name);
						},null,true)
					}
				});
			}
		});

		materialPayment.baseModal.modal("hide");

		materialPaymentPostData.paymentInfo = []
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
		var couponCount = 0;
		
		var _paymentInfo = "#paymentInfo";

		com.focusPage(_paymentInfo).text("");

		var returnParams = paymentUtils.getBankInfoParams(materialPayment.paymentModelNameData, "material", materialPayment.bankNums, materialPayment.checkvNums, couponCount, materialPayment.typeUpdate,  0, _paymentInfo);

		var realPayment = returnParams[0];
		var args = returnParams[1];

		if(referPayment != realPayment){
			com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
			return false;
		}

		if($.isEmptyObject(args)){
			com.showAlert(com.warning, "无收款方式信息");
			return false;
		}

		url = api.payment.refundMaterialPayment;

		var _info = materialPaymentPostData.paymentInfo[0];

		options["materialPayment.mpId"] = _info.mpId;
		options["materialPayment.msoId"] = _info.msoId;

		for(var arg in args){
			options["materialPayment."+arg] = args[arg];
		}

		options["materialPayment.comment"] = com.focusPage("#des").val();

		options["material.orderId"] = materialPaymentPostData.orderId;

		com.post(url, options, function(res){
			searcher.doSearch();
			materialPayment.historyFlag = false;
			var mrId = res.materialPayment.mrId;

			bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
				if(result){
					params.mrId = mrId;
					params.decorationOrderMOrderId = materialPaymentPostData.orderId;
					com.popup("专用收款收据__装修单号:" + materialPaymentPostData.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true);
				}
			});
		});

		materialPayment.baseModal.modal("hide");

		materialPaymentPostData.paymentInfo = []
	}
});
