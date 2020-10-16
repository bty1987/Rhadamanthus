
jQuery(function($) {
	var materialPaymentPostData = {};
	var materialPayment = {
		paymentModelNameData: ["bank", "advance"],
		materialPaymentTypeData: {},
		materialPaymentRevTypeData: {},
		customerId: null,
		saveBtn: com.focusPage("#saveBtn"),
		cancelBtn: com.focusPage("#cancelBtn"),
		items: {
			bankCheckbox: com.focusPage("#bankCheckbox"),
			advanceCheckbox: com.focusPage("#advanceCheckbox"),
			advanceType: com.focusPage("#advanceType")
		},
		editFlg: false,
		historyFlag: false,
		checkvNums: [],
		decorationType: [],
		htmlName: "materialPos",
		modelId: "baseItemModal",
		modals: {
			baseModal: com.focusPage("#baseItemModal")
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

		mno: null,
		_posway: [],
		pointofsalesType: 2
	};

	//隐藏触发
	materialPayment.modals.baseModal.on('hide.bs.modal', function () {
		materialPayment.bankUtilForGrade = [];
		materialPayment.checkBankUtilForGrade = [];
		com.focusPage("#materialPosposDivGroup").html("");
		com.focusPage("#materialPosbankDivGroup").html("");
		com.focusPage("#bankCheckbox").removeAttr("disabled");
		com.closeTip();
	});

	materialPayment.saveBtn.bindClick(function(){
		var searcher = {"doSearch" : getMaterialPayment};
		paymentUtils.materialPayment( materialPayment, materialPaymentPostData, searcher);
	});
	materialPayment.cancelBtn.on("click", function(){
		materialPayment.historyFlag = false;
	});

	paymentUtils.getReceiptType(materialPayment);

    com.focusPage("#baseItemModal :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show()  : com.focusPage("[referCheckbox="+this.id+"]").hide()
		if($(this).prop("checked") && this.id == "bankCheckbox"){
			com.focusPage("#materialPosbankDivGroup").html("");
			paymentUtils.addBankPosUtil("#materialPosbankDivGroup", materialPayment.bankUtilForGrade, materialPayment);
		}
	});

	com.post(api.ds.payment, {}, function(res){
		com.focusPage("#advanceType").bindData(res.advanceType, 'key', 'value');

		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialPayment.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialPayment.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}

		$.each(res.posway, function (i, v) {
			materialPayment._posway.push(v);
		});
	}, null, false);

	com.post(api.ds.decoration, {}, function(res){
		materialPayment.decorationType = res.typeness;
	}, null, false);

	com.focusPage("#historyMaterialPaymentPosList").removeClass("active");

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

			var $btnDecoration = $('<a></a>').addClass('btn btn-minier btn-yellow').html("装修单信息");
            var $btnCollect = $('<a></a>').addClass('btn btn-minier');

            var propertyArr = [
               ["订单号:",  v.material.orderId, "blue"],
               ["主材号:", v.material.no, "blue"],
               ["楼盘地址:", v.material.house.village.cityProper.city.name + ' ' + v.material.house.village.cityProper.name + ' ' + v.material.house.village.name + ' ' + v.material.house.houseNumber, "grey"],
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
				"paymentType": v.paymentType,
				"grade": v.material.grade
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(materialPayment.materialPaymentTypeData[v.paymentType]);

            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $label.append($input).append($span).appendTo($h3);

            $divBtnWrap.append($btnDecoration).append($btnCollect).appendTo($h3);

            if([4, 5, 6, 7].indexOf(v.paymentType) == -1){
        		$btnCollect.text('收款').addClass("btn-info");
        	}

            $liLine.append($h3).append($ulProperty);

            $btnCollect.click(function(){
				materialPayment.typeUpdate = 1;
            	dialogPayment(v);
            });

			//显示装修单信息
			$btnDecoration.click(function(){
				paymentUtils.decorationInfoShow(v.material.orderId, materialPayment.decorationType);
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

	//画页面的过滤条件
	paymentUtils.drawFilter(com.focusPage("#condList"), [{"labelVal":"装修单号", "inputId":"materialFilterOrderId"}, {"labelVal":"主材号", "inputId":"materialFilterNo"}], getMaterialPayment);

	//页面初始查询
	getMaterialPayment();

	//批量收款
	var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px").appendTo(com.focusPage("#pagenation"));
	var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
	var $addspan = $('<span></span>').text('批量收款').appendTo($adda);

	com.focusPage('a[name="collects"]', '#pagenation').click(function(){
		com.cleanItems(materialPayment.items);
		materialPayment.typeUpdate = 1;

		com.focusPage("#des").val("");
		com.focusPage("#des").removeAttr("disabled");
		com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
		com.focusPage("#advance").removeAttr("readonly");

		com.focusPage("#saveBtn").removeClass("hide");
		com.focusPage("#historyUpdateM").addClass("hide");

		var $inputs = com.focusPage('input[name="mpIds"]:checked');

		if(!$inputs.length) return;

		var _orderId = "";
		var _paymentType = 0;
		var _paymentTypeFlag = 0;
		var customerId = "";
		var flags = [];
		var flag = 0;
		var gradeArray = [];

		var sumMoney = 0;

		materialPaymentPostData.paymentInfo = [];

		$.each($inputs, function(i, v){
			var $input = $(v);

			var row = {
				"orderId": $input.attr("orderid"),
				"customerId": $input.attr("customerid"),
				"paymentType": $input.attr("paymenttype"),
				"referMoney": $input.attr("refermoney"),
				"mpId": $input.attr("mpid"),
				"grade": $input.attr("grade")
			};
			flags.push(row.paymentType);
			gradeArray.indexOf(row.grade) == 0 ? gradeArray : gradeArray.push(row.grade);

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

			com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": materialPaymentPostData.orderId},function(res){
				com.focusPage("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
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

		if(gradeArray.length > 1){
			com.showAlert(com.warning, "批量收款不支持不同主材单类型之间的操作.");
			return false;
		}

		if(sumMoney >= 0){
			paymentUtils.materialInitBaseModal(gradeArray[0], materialPayment);

			com.focusPage("#referMoney").val(sumMoney).attr("disabled", "disabled");

			//显示pos 以及mno赋值
			materialPayment.mno = _orderId;

			com.post(api.payment.queryPointofsales, {"pointofsales.pid": _orderId}, function(res){
				$.each(res.pointofsaleses, function(i, value){
					if(value.status == 0 || value.status == 1) {
						paymentUtils.addPos(value, materialPayment.htmlName);
						com.focusPage("#bankCheckbox").prop("checked", true);
						com.focusPage("#posDiv").prop("style", "display: block");
						com.focusPage("#bankDiv").prop("style", "display: block");
					}
				});
				res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#materialPosbankDivGroup", materialPayment.bankUtilForGrade, materialPayment) : "";
			});

			materialPayment.modals.baseModal.modal("show");
		}else{
			com.showAlert(com.warning, "退款不支持批量操作!");
		}
	});
	//合计
	var $showa = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px").appendTo(com.focusPage("#pagenation"));
	var $showi = $('<i></i>').addClass('icon-calculator bigger-110').appendTo($showa);
	var $showspan = $('<span></span>').text('合计').appendTo($showa);

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
		}), com.showAlert(com.info, '<h3>合计金额: ' + $total + '</h3>'));

	});

	//历史收款
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

			var $decorationInfoBtn =  $('<a></a>').addClass('btn btn-minier btn-yellow').html('装修单信息');
			var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');

			var propertyArr = [
				["订单号:", v.material.orderId, "blue"],
				["主材号:", v.material.no, "blue"],
				["楼盘地址:", v.material.house.village.cityProper.city.name + ' ' + v.material.house.village.cityProper.name + ' ' + v.material.house.village.name + ' ' + v.material.house.houseNumber, "grey"],
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
			v.bank != null && v.bank != "0" ? styleArr.push(["刷卡:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, materialPayment.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.checkv, v.checkvBank, materialPayment.checkBankInfo), "blue"]) : true;
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

			$divBtnWrap.append($decorationInfoBtn).append($btnPrint).appendTo($h3);

			$liLine.append($h3).append($ulProperty).append($ulStyle);

			var mrId = v.mrId;

			$btnPrint.click(function(){
				params.mrId = mrId;
				params.decorationOrderMOrderId = v.material.orderId;
				params.decorationReceiptDrId = v.drId;
				com.popup("专用收款收据__装修单号: " + v.material.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
					parent.layer.getFrameIndex(window.name);
				},null,true)
			});

			//显示装修单信息
			$decorationInfoBtn.click(function(res){
				paymentUtils.decorationInfoShow(v.material.orderId, materialPayment.decorationType);
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

	hsearcher.init(["payment-orderId", "payment-material-no"], "hcondList", api.payment.pageMaterialPaymentForNotInit, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hmaterialPaymentPostDataPos", null, false, null, null, "hresultList");

	function dialogPayment(payment){
        com.cleanItems(materialPayment.items);

		materialPaymentPostData.orderId = payment.material.orderId;
		com.focusPage("#advance").removeAttr("readonly");
		com.focusPage("#des").removeAttr("disabled");
		com.focusPage("#des").val("");

		if([1, 2, 3].indexOf(payment.paymentType) != -1){
			paymentUtils.materialInitBaseModal(payment.material.grade, materialPayment);
			com.focusPage("#myModalLabel").text("付款信息");
			com.focusPage("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
			com.focusPage("#saveBtn").removeClass("hide");

			materialPayment.mno = payment.material.orderId;

			com.post(api.payment.queryPointofsales, {"pointofsales.pid": payment.material.orderId}, function(res){
				$.each(res.pointofsaleses, function(i, value){
					if(value.status == 0 || value.status == 1) {
						paymentUtils.addPos(value, materialPayment.htmlName);
						com.focusPage("#bankCheckbox").prop("checked", true);
						com.focusPage("#posDiv").prop("style", "display: block");
						com.focusPage("#bankDiv").prop("style", "display: block");
					}
				});
				res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#materialPosbankDivGroup", materialPayment.bankUtilForGrade, materialPayment) : "";
			});
		}

        com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": materialPaymentPostData.orderId},function(res){
            com.focusPage("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
        },null,false);

		materialPaymentPostData.paymentInfo = [payment];

		materialPayment.editFlg =  false;
	}

	//获取主材款
	function getMaterialPayment(){
		var materialPaymentOptions = {
			"materialPayment.material.orderId" : com.focusPage("#materialFilterOrderId").val(),
			"materialPayment.material.no" : com.focusPage("#materialFilterNo").val(),
			"materialPayment.paymentStatus" : 0,
			"filters[0].field": "paymentType",
			"filters[0].data": "[2, 3]",
			"filters[0].op": "in"
		};

		com.post(api.payment.queryMaterialPaymentByOrderId, materialPaymentOptions, function(res){
			var data = res.materialPayments;
			data != null && data.length > 0 ? displayFunc.init('resultList', data) : paymentUtils.emptyData(com.focusPage("#resultList"));
		});
	}
});
