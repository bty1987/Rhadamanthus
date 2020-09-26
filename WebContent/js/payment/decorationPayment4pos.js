jQuery(function($) {
	var decorationPaymentPostData = {};
	var decorationPayment = {
		paymentModelNameData: ["bank", "advance"],
		orderPaymentId: null,
		paymentId: null,
		items: {
			bankCheckbox: com.focusPage("#bankCheckbox"),
			advanceCheckbox: com.focusPage("#advanceCheckbox"),
			advanceType: com.focusPage("#advanceType"),
			advance: com.focusPage("#advance")
		},
		editFlg: false,
		paymentType: "增项款",
		orderId: null,
		paymentStatusArray: ["未付款", "已付款", "已确认", "审批中", "历史"],
		htmlName: "decorationPos",
		modelId: "baseItemModal",
		modals: {
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
		com.focusPage("#decorationPosposDivGroup").html("");
		com.focusPage("#decorationPosbankDivGroup").html("");
		com.cleanItems(decorationPayment.items);
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
		var searcher = {"doSearch": getDecorationPaymentForOrderId};
		paymentUtils.payment(decorationPayment, decorationPaymentPostData, searcher);
	});

	com.focusPage("#baseItemModal :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
		if($(this).prop("checked") && this.id == "bankCheckbox"){
			com.focusPage("#decorationPosbankDivGroup").html("");
			paymentUtils.addBankPosUtil("#decorationPosbankDivGroup", decorationPayment.bankUtilForGrade, decorationPayment);
		}
	});

	com.focusPage("#advanceType").bindData([{"key":"1", "value":"合同"}], 'key', 'value');

	//绑定收款单位的基础信息
	paymentUtils.getReceiptType(decorationPayment);

	com.focusPage("#historyDecorationListPos").removeClass("active");
	
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
			}
            
            $liLine.append($h3).append($ulProperty);

			//收款点击显示模态框
            $btnCollect.click(function(){
				decorationPayment.typeUpdate = 1;
				if(v.oneType == 0){
					com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": v.decoration.orderId}, function(res){
						$.each(res.pointofsaleses, function(i, value){
							if(value.status == 0 || value.status == 1) {
								paymentUtils.addPos(value, decorationPayment.htmlName);
								com.focusPage("#bankCheckbox").prop("checked", true);
								com.focusPage("#posDiv").prop("style", "display: block");
								com.focusPage("#bankDiv").prop("style", "display: block");
							}
						});
						res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#decorationPosbankDivGroup", decorationPayment.bankUtilForGrade, decorationPayment) : "";
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

	//画页面的过滤条件
	paymentUtils.drawFilter(com.focusPage("#condList"), [{"labelVal":"装修单号", "inputId":"filterOrderId"}], getDecorationPaymentForOrderId);

	//页面初始查询
	getDecorationPaymentForOrderId();

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.paymentType));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');

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

			$divBtnWrap.appendTo($h3);
			$liLine.append($h3).append($ulProperty).append($ulStyle);

			$btnPrint.click(function(){
				params.decorationOrderOrderId = v.decoration.orderId;
				params.decorationPaymentOrderId = v.decoration.orderId;
				params.decorationReceiptDrId = v.drId;
				com.popup("专用收款收据__装修单号:" + v.decoration.orderId  ,api.index.decorationPaymentReceiptIndex.url,function () {
					parent.layer.getFrameIndex(window.name);
				},null,true);
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

	hsearcher.init(["payment-orderId"], "hcondList", api.payment.pageDecorationPaymentForHistory, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hdecorationPaymentPostDataPos", null, false, null, null, "hresultList");

	function dialogPayment(payment){
		decorationPaymentPostData.paymentInfo = payment;
        com.cleanItems(decorationPayment.items);

		com.focusPage("#collectDes").val("");
		com.focusPage("#advanceType").removeAttr("disabled");
		com.focusPage("#collectDes").removeAttr("disabled");
		com.focusPage("#advance").removeAttr("readonly");

		if(payment.oneType == 0){
			paymentUtils.initBaseModal(payment, decorationPayment);
			com.focusPage("#myModalPayLabel").text("付款信息");
			com.focusPage("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
			decorationPaymentPostData.orderId = payment.decoration.orderId;
			com.focusPage("#collectBtn").removeClass("hide");
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

	//查询装修款
	function getDecorationPaymentForOrderId(){
		var decorationPaymentOption = {
			"decorationPayment.decoration.orderId" : com.focusPage("#filterOrderId").val(),
			"decorationPayment.oneType" : 0,
			"decorationPayment.paymentStatus" : 0
		};

		com.post(api.payment.queryDecorationPaymentByOrderId, decorationPaymentOption, function(res){
			var data = res.decorationPayments;
			data != null && data.length > 0 ? displayFunc.init('resultList', data) : paymentUtils.emptyData(com.focusPage("#resultList"));
		});
	}
});

