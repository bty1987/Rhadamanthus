
jQuery(function($) {

	var materialPayment = {
		htmlName: "material",
		type: params['urlLoadParams'].paytype,
		paytypes: [],
		paymentStatusArray: constant.payment().materialPayment.status.keys,
		payment: null,

		items: {
			cashCheckbox: com.focusPage("#cashCheckbox", "#materialPayment"),
			bankCheckbox: com.focusPage("#bankCheckbox", "#materialPayment"),
			checkvCheckbox: com.focusPage("#checkvCheckbox", "#materialPayment"),
			advanceCheckbox: com.focusPage("#advanceCheckbox", "#materialPayment"),
			couponCheckbox: com.focusPage("#couponCheckbox", "#materialPayment"),

			historyDiv: com.focusPage("#historyDiv", "#materialPayment"),
			historyData: com.focusPage("#historyData", "#materialPayment"),
			cashDiv: com.focusPage("#cashDiv", "#materialPayment"),
			checkvDiv: com.focusPage("#checkvDiv", "#materialPayment"),
			advanceDiv: com.focusPage("#advanceDiv", "#materialPayment"),

			cash: com.focusPage("#cash", "#materialPayment"),
			cashInfo: com.focusPage("#cashInfo", "#materialPayment"),

			bankName: com.focusPage("#bankName", "#materialPayment"),
			bank: com.focusPage("#bank", "#materialPayment"),
			posway: com.focusPage("#posway", "#materialPayment"),

			recharge: com.focusPage("#recharge", "#materialPayment"),
			advance: com.focusPage("#advance", "#materialPayment"),
			advanceType: com.focusPage("#advanceType", "#materialPayment"),

			couponType: com.focusPage("#couponType", "#materialPayment"),
			couponVal: com.focusPage("#couponVal", "#materialPayment"),

			posDiv: com.focusPage("#posDiv", "#materialPayment"),
			posGroup: com.focusPage("#posGroup", "#materialPayment"),
			bankDiv: com.focusPage("#bankDiv", "#materialPayment"),
			bankGroup: com.focusPage("#bankGroup", "#materialPayment"),
			checkvGroup: com.focusPage("#checkvGroup", "#materialPayment"),
			couponDiv: com.focusPage("#couponDiv", "#materialPayment"),
			couponInputs: com.focusPage("#couponInputs", "#materialPayment"),
			couponGroup: com.focusPage("#couponGroup", "#materialPayment"),

			referMoney: com.focusPage("#referMoney", "#materialPayment"),
			comment: com.focusPage("#commen", "#materialPayment"),

			myModalLabel: com.focusPage("#myModalLabel", "#materialPayment")
		},

		btns: {
			collectBtn: com.focusPage("#collectBtn", "#materialPayment"),
			refundBtn: com.focusPage("#refundBtn", "#materialPayment"),

			checkvAdd: com.focusPage("#checkvAdd", "#materialPayment"),
			couponAdd: com.focusPage("#couponAdd", "#materialPayment"),
			createPaytran: com.focusPage("#createPaytran", "#materialPayment")
		},

		modals: {
			collectModal: com.focusPage("#collectModal", "#materialPayment"),
			refundBtn: com.focusPage("#refundBtn", "#materialPayment")

		},

		cash: [],
		bank: [],
		checkv: [],
		accounts: [],
		couponType: [],
		posValues: {},

		cashUtil: [],
		bankUtil: [],
		checkvUtil: [],

		cashInfo: {},
		bankInfo: {},
		checkvInfo: {},
		accountsInfo: {},
		couponTypeData: {},

		bankGrade: [],
		checkvGrade: [],

		conditions: [],
		extraParams: {},
		functions: [],
		mpids: [],
		isCollects: false,
		materialPaymentTypeData: constant.payment().materialPayment.paymentType.keys,
		decorationType: constant.decoration().decoration.typeness.datas,
		pageConfig: {},
		typeNo: 2,
		atttype: 1,
		collectType: [constant.payment().materialPayment.PAYMENTTYPE_TYPE_DEPOSIT_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_FULL_INT],
		refundType:[constant.payment().materialPayment.PAYMENTTYPE_TYPE_REJECT_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_FULL_REFUND_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_COUPON_REFUND_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT],
		decoration: {}
	};

	// 隐藏触发
	materialPayment.modals.collectModal.on('hide.bs.modal', function () {

		materialPayment.bankGrade = [];
		materialPayment.checkvGrade = [];
		materialPayment.mpids = [];

		materialPayment.items.posGroup.html("");
		materialPayment.items.bankGroup.removeClass('hide');
		materialPayment.items.checkvGroup.html("");
		materialPayment.items.couponGroup.html("");
		materialPayment.items.historyData.html("");
		materialPayment.items.comment.removeAttr("disabled");

		materialPayment.isCollects = false;
		materialPayment.payment = null;

		materialPayment.items.bankName.removeClass("v_required v_typeahead");
		materialPayment.items.bank.removeClass("v_required v_float_3");

		com.closeTip();
		com.cleanItems(materialPayment.items);
	});

	materialPayment.items.advanceType.bindData(constant.payment().materialPayment.advanceType.datas, 'key', 'value');
	materialPayment.items.posway.bindData(constant.payment().receiptType.posway.datas, "key", "value");

	// checkbox选中时联动
	com.focusPage("#collectModal :checkbox", "#materialPayment").on("change", function(){
		var that = $(this);
		var checked = that.prop("checked");
		var id = that.attr("id");

		var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#materialPayment");

		checked ? boxdiv.show() : boxdiv.hide();
	});

	paymentUtils.getReceiptType(materialPayment);

	// 转账方式(银行)
	materialPayment.btns.checkvAdd.click(function(){
		paymentUtils.addBank(materialPayment);
		return false;
	});

	materialPayment.btns.collectBtn.bindClick(collect);

	materialPayment.btns.refundBtn.bindClick(collect);

	materialPayment.btns.createPaytran.unbind().click(function(){
		paymentUtils.pushPos(materialPayment, materialPayment.payment.material.orderId);
		return false;
	});

	materialPayment.btns.couponAdd.unbind().click(function(){

		if(com.validate("couponInputs", "#materialPayment")) return false;

		paymentUtils.addCounpon();
	});

	// 不同页面的不同参数
	materialPayment.pageConfig = paymentUtils.getConfig(materialPayment.type, 4);

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

			var $btnDecoration = $('<a></a>').addClass('btn btn-minier btn-yellow').html("装修单");
			var $btnCollect = $('<a></a>').addClass('btn btn-minier').html('收款');
			var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
			var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

			var propertyArr = paymentUtils.getPropertyArr(materialPayment, v, v.material, materialPayment.paymentStatusArray);

            var $label = $('<label></label>');
			var $input = $('<input>').attr({"type": "checkbox", "name": "mpIds"}).addClass('ace ace-checkbox-2');
			$input.attr({"data-mpid": v.mpId, "data-orderid": v.material.orderId, "data-customerid": v.material.customer.cid, "data-refermoney": v.referMoney, "data-paymenttype": v.paymentType, "data-grade": v.material.grade, "data-paymentstatus": v.paymentStatus});

			if(materialPayment.pageConfig.pageBtn.contains("batchCollect") || materialPayment.pageConfig.pageBtn.contains("selectall")) $input.appendTo($label);

			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(materialPayment.materialPaymentTypeData[v.paymentType]);

			$label.append($span).appendTo($h3);

            $.each(propertyArr, function (index,value) {
            	var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

				if (value[3]) {
					$b.click(function() {
						value[3]($b);
					});
				}

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);
			$liLine.append($h3).append($ulProperty);

			if ([2, 3].indexOf(v.paymentType) != -1) $btnCollect.text('收款').addClass("btn-info");
			if ([4, 5, 6, 7].indexOf(v.paymentType) != -1) $btnCollect.text('退款').addClass("btn-danger");

			if(materialPayment.pageConfig.pageBtn.contains("payway")) paymentUtils.drawHistoryData(materialPayment, v, $liLine, "");

			if (materialPayment.pageConfig.pageBtn.contains("decorationInfo")) $divBtnWrap.append($btnDecoration);
			if(materialPayment.pageConfig.pageBtn.contains("collect")) $divBtnWrap.append($btnCollect);
			if(v.paymentStatus != constant.payment().materialPayment.STATUS_INIT_INT && materialPayment.pageConfig.pageBtn.contains("print")) $divBtnWrap.append($btnPrint);
			if(v.paymentStatus == constant.payment().materialPayment.STATUS_COLLECT_INT && materialPayment.pageConfig.pageBtn.contains("update")) $divBtnWrap.append($btnUpdate);

			// 收款
            $btnCollect.click(function(){

				if(materialPayment.collectType.contains(v.paymentType)) paymentUtils.showPos(materialPayment, {"paytran.orderId": v.material.orderId, "paytran.atttype": materialPayment.atttype}, [0, 1]);

				initCollect(v, false);

            });

			// 显示装修单信息
			$btnDecoration.click(function(){
				tools.decoration.info($(this), v.material.orderId);
			});

			// 打印
			$btnPrint.click(function(){
				params.payment.mrId = v.mrId;
				params.payment.orderId = v.material.orderId;
				params.payment.cid = v.material.customer.cid;
				com.popup("专用收款收据__装修单号: " + v.material.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
					parent.layer.getFrameIndex(window.name);
				},null,true)
			});

			// 更新
			$btnUpdate.click(function(){

				// 应对批量收款的情况
				var referMoney = utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(v.cash, v.bank), v.checkv), v.coupon), v.advance);
				v.referMoney = referMoney;

				initUpdate(v);

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

	var extraParams = {};
	if (materialPayment.pageConfig.statusExtraParam != null && materialPayment.pageConfig.statusExtraParam.length > 0) {
		extraParams["materialPayment.paymentStatus"] = materialPayment.pageConfig.statusExtraParam[0];
	}

	if (materialPayment.pageConfig.typeExtraParam != null && materialPayment.pageConfig.typeExtraParam.length > 0) {
		extraParams["materialPayment.paymentTypes"] = "["+materialPayment.pageConfig.typeExtraParam.toString()+"]";
	}

	searcher.init(materialPayment.pageConfig.condArr, "condList", materialPayment.pageConfig.apiPage, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialPaymentPostData"+materialPayment.type, extraParams, false, null, function(){
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('批量收款').appendTo($adda);

    	var $showa = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px");
    	var $showi = $('<i></i>').addClass('icon-calculator bigger-110').appendTo($showa);
    	var $showspan = $('<span></span>').text('合计').appendTo($showa);

		var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
		var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
		var $checkspan = $('<span></span>').text('全选').appendTo($checka);

		var $confirma = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
		var $confirmi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($confirma);
		var $confirmspan = $('<span></span>').text('批量确认').appendTo($confirma);

		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		var btnParams = [];

		if(materialPayment.pageConfig.pageBtn.contains("batchCollect")) btnParams.push($adda);
		if(materialPayment.pageConfig.pageBtn.contains("count")) btnParams.push($showa);
		if(materialPayment.pageConfig.pageBtn.contains("selectall")) btnParams.push($checka);
		if(materialPayment.pageConfig.pageBtn.contains("confirms")) btnParams.push($confirma);
		if(materialPayment.pageConfig.pageBtn.contains("export")) btnParams.push($impa);

		return btnParams;

	}, 'resultList');

	// 初始化模态框
	function initCollect(payment, isCollects){

		com.cleanItems(materialPayment.items);

		materialPayment.items.historyDiv.hide();

		materialPayment.payment = payment;

		// 查询装修单信息
		com.post(api.decoration.queryDecorationForCommonByOrderId, {
			"decoration.orderId": payment.material.orderId
		}, function(res) {

			materialPayment.decoration = res.decoration;
		}, null, false);

		paymentUtils.getReceiptType(materialPayment);

		materialPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
		materialPayment.items.comment.removeAttr("disabled");

		var type = materialPayment.refundType.contains(payment.paymentType) ? 1 : 0; // 0:收款类型1:退款类型

		if(materialPayment.pageConfig.paytypes.contains("cash")) paymentUtils.initCash(materialPayment);
		if(materialPayment.pageConfig.paytypes.contains("bank")) paymentUtils.initBank(materialPayment, type);
		if(materialPayment.pageConfig.paytypes.contains("checkv")) paymentUtils.initCheckv(materialPayment);
		if(materialPayment.pageConfig.paytypes.contains("advance")) paymentUtils.initAdvance(materialPayment, type, {"advancePayment.decoration.orderId": payment.material.orderId}, "materialAdvance");
		if(materialPayment.pageConfig.paytypes.contains("coupon")) paymentUtils.initCoupon(materialPayment, 0);
		if (isCollects) materialPayment.items.couponCheckbox.parent().addClass("hide");

		com.selectTypeahead("cashInfo", materialPayment.cashUtil, "key", "value", null); // 现金

		com.selectTypeahead("couponType", materialPayment.couponType, 'no', 'name'); // 优惠券

		// 根据装修单等级获取收据类型等级
		var grade = payment.material.grade == "B" ? "B" : "";

		// 根据等级在数组中筛选出符合要求的用于显示
		paymentUtils.initBankGrade(materialPayment, grade); // 刷卡&银行

		if(type == 1){// 退款

			materialPayment.items.myModalLabel.text("退款信息");

			materialPayment.btns.collectBtn.addClass("hide");
			materialPayment.btns.refundBtn.removeClass("hide");
		}else{

			isCollects ? materialPayment.items.myModalLabel.html("批量付款信息") : materialPayment.items.myModalLabel.html("付款信息");

			materialPayment.btns.collectBtn.removeClass("hide");
			materialPayment.btns.refundBtn.addClass("hide");
		}

		materialPayment.modals.collectModal.modal("show");

		// 是批量收款
		materialPayment.isCollects = isCollects;
	}

	// 更新
	function initUpdate(payment){

		com.cleanItems(materialPayment.items);

		materialPayment.items.myModalLabel.text("更新款项信息");

		materialPayment.items.historyDiv.show();

		materialPayment.payment = payment;

		materialPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
		materialPayment.items.comment.val(payment.comment).attr("disabled", "disabled");

		if(materialPayment.pageConfig.paytypes.contains("cash")) paymentUtils.initCash(materialPayment);
		if(materialPayment.pageConfig.paytypes.contains("bank")) paymentUtils.initBank(materialPayment, 1);
		if(materialPayment.pageConfig.paytypes.contains("checkv")) paymentUtils.initCheckv(materialPayment);
		if(materialPayment.pageConfig.paytypes.contains("advance")) paymentUtils.initAdvance(materialPayment, 2, {"advancePayment.decoration.orderId": payment.material.orderId}, "materialAdvance");
		if(materialPayment.pageConfig.paytypes.contains("coupon")) paymentUtils.initCoupon(materialPayment, 1);

		// 查询装修单信息
		com.post(api.decoration.queryDecorationForCommonByOrderId, {
			"decoration.orderId": payment.material.orderId
		}, function(res) {

			materialPayment.decoration = res.decoration;
		}, null, false);

		paymentUtils.getReceiptType(materialPayment);

		com.selectTypeahead("cashInfo", materialPayment.cashUtil, "key", "value", null); // 现金

		com.selectTypeahead("couponType", materialPayment.couponType, 'no', 'name'); // 优惠券

		var grade = payment.material.grade == "B" ? "B" : "";

		paymentUtils.initBankGrade(materialPayment, grade);

		// 历史收款信息
		paymentUtils.drawHistoryData(materialPayment, payment, materialPayment.items.historyData, "update");

		materialPayment.btns.refundBtn.addClass("hide");

		materialPayment.modals.collectModal.modal("show");
	}

	// 收款
	function collect(){

		if (com.validate("collectModal", "#materialPayment")) return false;

		var url = "";
		var options = {
			"materialPayment.comment": materialPayment.items.comment.val()
		};

		var realPayment = 0;
		var realMoney = 0;
		var referPayment = materialPayment.items.referMoney.val();
		var type = 0;
		var isCollects = materialPayment.isCollects;

		var payment = materialPayment.payment;

		if(materialPayment.collectType.contains(payment.paymentType) && payment.paymentStatus == 0){
			url =  api.payment.collectMaterialPayment;
			objectName = "materialPayment";

			// 批量收款参数
			if (materialPayment.isCollects)  {
				url =  api.payment.collectMaterialPayments;
				objectName = "materialReceipt";
				options["material.orderId"] = payment.material.orderId;
				options["materialReceipt.comment"] = materialPayment.items.comment.val();

				if(materialPayment.mpids.length > 0){
					$.each(materialPayment.mpids, function (i, v) {
						options["materialPayments["+i+"].mpId"] = v;
					});
				}
			}

		}else if(materialPayment.refundType.contains(payment.paymentType) && payment.paymentStatus == 0){
			url = api.payment.refundMaterialPayment;
			objectName = "materialPayment";
			type = 1;
		}else if(payment.paymentStatus == 1){
			url = api.payment.updateMaterialPayment;
			objectName = "materialReceipt";
			type = 2;
		}

		var cash = paymentUtils.paramCash(materialPayment, objectName, options);

		realPayment = utils.accAdd(realPayment, parseFloat(cash));
		realMoney = utils.accAdd(realMoney, parseFloat(cash));

		var bank = paymentUtils.paramBank(materialPayment, materialPayment.payment, objectName, options, type);

		if(bank < 0){
			com.showAlert(com.warning, "存在未处理POS收款");
			return false;
		}

		realPayment = utils.accAdd(realPayment, parseFloat(bank));
		realMoney = utils.accAdd(realMoney, parseFloat(bank));

		var checkv = paymentUtils.paramCheckv(materialPayment, objectName, options);

		realPayment = utils.accAdd(realPayment, parseFloat(checkv));
		realMoney = utils.accAdd(realMoney, parseFloat(checkv));

		var advance = paymentUtils.paramAdvance(materialPayment, materialPayment.payment, objectName, options, "advance", type);

		if(advance < 0){
			com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
			return false;
		}

		realPayment = utils.accAdd(realPayment, parseFloat(advance));

		var coupon = paymentUtils.paramCoupon(materialPayment, materialPayment.payment, objectName, options, type);

		realPayment = utils.accAdd(realPayment, parseFloat(coupon));

		if(referPayment != realPayment){
			com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
			return false;
		}

		if($.isEmptyObject(options)){
			com.showAlert(com.warning, "无收款方式信息");
			return false;
		}

		options["materialPayment.mpId"] = payment.mpId;
		options[objectName + ".realMoney"] = realMoney;

		com.post(url, options, function(res){
			searcher.doSearch();
			materialPayment.modals.collectModal.modal("hide");

			com.showConfirm("是否需要打印当前收款对应的收据信息?", function(result) {
				params.payment.mrId = isCollects ? res.materialReceipt.mrId : res.materialPayment.mrId;
				params.payment.orderId = payment.material.orderId;
				params.payment.cid = payment.material.customer.cid;
				com.popup("专用收款收据__装修单号:" + payment.material.orderId, api.index.materialPaymentReceiptIndex.url, function () {
					parent.layer.getFrameIndex(window.name);
				},null,true);
			});
		});
	}

	// 批量收款
	com.focusPage('a[name="collects"]', '#pagenation').click(function () {

		var $inputs = com.focusPage('input[name="mpIds"]:checked', '#resultList');

		if (!$inputs.length) return;

		var _orderId = "";
		var _customerId = "";
		var _grade = "";
		var sumMoney = 0;
		var flag = false;
		materialPayment.mpids = [];

		$.each($inputs, function (i, v) {
			var $input = $(v);

			if (i == 0) {
				_orderId = $input.attr("data-orderid");
				_customerId = $input.attr("data-customerid");
				_grade = $input.attr("data-grade");
			}

			if (materialPayment.refundType.contains(parseInt($input.attr("data-paymenttype")))) {
				flag = true;
				com.showAlert(com.warning, "批量收款不支持退款");
				return false;
			}

			if ($input.attr("data-orderid") != _orderId) {
				flag = true;
				com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
				return false;
			}

			if ($input.attr("data-customerid") != _customerId) {
				flag = true;
				com.showAlert(com.warning, "批量收款不支持不同客户间的操作.");
				return false;
			}

			if($input.attr('data-grade') != _grade){
				flag = true;
				com.showAlert(com.warning, "批量收款不支持不同主材单类型之间的操作.");
				return false;
			}

			sumMoney = utils.accAdd(sumMoney, parseFloat($input.attr("data-refermoney")));
			materialPayment.mpids.push($input.attr("data-mpid"));
		});

		if (flag) return;

		var payment = $($inputs[0]).data();
		materialPayment.payment = {"mpid": payment.mpid, "referMoney": sumMoney, "paymentType": payment.paymenttype, "paymentStatus": payment.paymentstatus};
		materialPayment.payment.material = {"orderId": payment.orderid, "grade": payment.grade};

		if(materialPayment.collectType.contains(payment.paymenttype)) paymentUtils.showPos(materialPayment, {"paytran.orderId": payment.orderid, "paytran.atttype": materialPayment.atttype}, [0, 1]);

		initCollect(materialPayment.payment, true);
	});

	// 合计
	com.focusPage('a[name="showTotal"]', '#pagenation').click(function () {
		var $total = 0;
		var $inputs = com.focusPage('input[name="mpIds"]:checked');

		$inputs.length && ($.each($inputs, function (i, v) {
			var $that = $(v);
			var $type = parseInt($that.attr('data-paymentType'));
			var $referMoney = $that.attr('data-refermoney');

			if (materialPayment.refundType.indexOf($type) != -1) {
				$total = utils.accSub($total, $referMoney);
			} else {
				$total = utils.accAdd($total, $referMoney);
			}
		}), com.showAlert(com.info, '<h3>合计金额: ' + $total + '</h3>'));
	});

	// 全选
	com.focusPage('a[name="checks"]', '#pagenation').click(function(){
		paymentUtils.checkAll();
	});

	// 批量确认
	com.focusPage('a[name="confirms"]', '#pagenation').click(function(){
		var options = {};
		var $inputs = com.focusPage('input[name="mpIds"]:checked');

		$.each($inputs, function(i, v){
			var $input = $(v);
			options["mpIds["+i+"]"] = $input.attr('data-mpid');
		});

		if($inputs.length == 0){
			com.showAlert(com.warning, "当前未选择要确认的主材款项信息");
			return false;
		}

		com.showConfirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			com.post(api.payment.confirmMaterialPayment, options, function(res){
				searcher.doSearch();
				com.showAlert(com.info, "确认成功")
			});
		});
	});

	// 导出
	com.focusPage('a[name="import"]', '#pagenation').click(function () {
		if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

		if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}

		com.post(api.payment.pageMaterialPayment, $.extend({}, params["materialPaymentPostData"+materialPayment.type], {"paging.noPage": 1}), function(res){
			$.exceler({
				column : [
					["装修单号","material.orderId"],
					["主材号","material.no"],
					['楼盘地址',['material.house.village.cityProper.city.name', 'material.house.village.cityProper.name', 'material.house.village.name', 'material.house.houseNumber']],
					['品牌','brand'],
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
				v.collecter = v.collecter == null ? {"collecter" : ""} : v.collecter;
				if(v.bank != null && v.bank != 0){
					v.bankInfo = paymentUtils.splitBankInfo('', v.bankInfo, materialPayment.bankInfo, true);
				}

				if(v.checkv != null && v.checkv != 0){
					var checkvInfoStr = v.checkvBank;
					if(checkvInfoStr.indexOf("#") != -1){
						v.checkvBank = paymentUtils.splitBankInfo('', v.checkvBank, materialPayment.checkvInfo, true);
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? materialPayment.checkvInfo[v.checkvBank] : '';
					}
				}

				if(v.coupon != null && v.coupon != 0){
					var $couponInfo = ' ';
					var _info = v.couponInfo.split('#');
					for(var i=1;i<_info.length-1;i++){
						var _i = _info[i].split(':');
						$couponInfo += materialPayment.couponTypeData[_i[0]][1] + " " + _i[1] + ", ";
					}

					v.couponInfo = $couponInfo;
				}

				v.installmentBank = v.installment != null && v.installment != "0" ? materialPayment.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? materialPayment.accountsInfo[v.accountsBank] : '';

				v.paymentType = materialPayment.materialPaymentTypeData[v.paymentType];
				v.paymentStatus = v.paymentStatus == constant.payment().materialPayment.STATUS_COLLECT_INT ? '已付款' : '已确认';
			});
		});
	});

});
