var decorationUtils = {
	initMaterial: function (orderId) {

		var $material = $('#materialPayment').html("");
		var $brand = $('#materialPaymentBrand').html("");

		var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($material);
		var $ulbrand = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($brand);

		var $total = 0;
		var materialPayments = null;

		com.post(api.payment.queryMaterialPaymentByOrderId, {"materialPayment.orderId": orderId}, function (res) {
			materialPayments = res.materialPayments;
		}, null, false);

		if (materialPayments && materialPayments.length) {
			$.each(materialPayments, function (i, v) {

				if (v.paymentStatus == 0) return true;

				var $liLine = $('<li></li>').addClass('item-orange clearfix');
				var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.msoNo + " " + materialUtils.materialPaymentTypeData[v.paymentType]));
				var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
				var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

				var propertyArr = [
					["品类:", v.materialType, "grey"],
					["品牌:", v.materialBrand, "grey"],
					["应收额:", v.referMoney, "grey"],
					["实收额:", v.realMoney, "grey"],
					["收款时间:", v.collectTime, "grey"],
					["状态:", materialUtils.paymentStatusInit(v.paymentStatus), "red"]
				];

				$.each(propertyArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulProperty);
				});

				var styleArr = [];

				v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
				v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
					var info = bank + ", ";
					var _s = bankInfo.split('#');
					for (var i = 1; i < _s.length - 1; i++) {
						var _i = _s[i].split('|');
						info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
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

				$liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock).appendTo($ul);

				var $materialBrands = $("[name='" + v.materialBrand + "']");

				if ($materialBrands.length > 0) {

					var $materialBrand = $($materialBrands[0]);
					var $brandTotal = $($materialBrand.find("[name='total']")[0]);

					var _value = parseFloat($brandTotal.attr('value'));
					var _refer = [2, 3].contains(v.paymentType) ? v.referMoney : -v.referMoney;
					var _total = utils.changeThrDecimal(_value + _refer);

					$brandTotal.attr("value", _total);
					$brandTotal.html(_total);

					$total = utils.changeThrDecimal($total + _refer);
				} else {
					var $liLine = $('<li></li>').addClass('item-orange clearfix').attr("name", v.materialBrand);
					var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.materialBrand));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

					var _refer = [2, 3].contains(v.paymentType) ? v.referMoney : -v.referMoney;

					$('<b></b>').html(v.materialType).addClass("grey").appendTo($('<strong></strong>').html("品类:").appendTo($('<li></li>').appendTo($ulProperty)));
					$('<b></b>').html(v.materialBrand).addClass("grey").appendTo($('<strong></strong>').html("品牌:").appendTo($('<li></li>').appendTo($ulProperty)));
					$('<b></b>').attr("name", "total").attr("value", _refer).html(_refer).addClass("grey").appendTo($('<strong></strong>').html("金额:").appendTo($('<li></li>').appendTo($ulProperty)));

					$liLine.append($h4).append($ulProperty).appendTo($ulbrand);

					$total = utils.changeThrDecimal($total + _refer);
				}
			});
		}

		if ($ul.children("li").length == 0) {
			var $resultList = $('#materialPayment').html('');
			var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
			var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
			var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);

			var $resultList = $('#materialPaymentBrand').html('');
			var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
			var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
			var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
		} else {
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h4 = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("总金额:" + $total));

			$liLine.append($h4).appendTo($ulbrand);
		}
		decorationOrderDetail.materialTotal = $total;

	}, decorationActivityInfo: function (activitys, uiBtnMethod, orderId) {

		var options = {
			"decorationActivity.orderId": orderId,
		}

		activitys.html('');

		com.post(api.decoration.queryDecorationActivityByOrderId, options, function (res) {
			var decorationActivitys = res.decorationActivitys;

			for (var i = 0; i < decorationActivitys.length; i++) {
				decorationUtils.addDecorationActivityForDiv(activitys, decorationActivitys[i], uiBtnMethod);
			}
		});

	}, addDecorationActivityForDiv: function (_activitys, _decorationActivity, uiBtnMethod) {

		var pricingSpan = $("<div></div>").addClass("pricing-span").css("margin-right", "10px").attr("id", "dactivity_" + _decorationActivity.daId).prependTo(_activitys);
		var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);

		var widgetHeader = $("<div></div>").addClass("widget-header").addClass("header-color-pink").attr("id", "widgetHeader_" + _decorationActivity.daId).appendTo(widgetBox);
		var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").text("活动").appendTo(widgetHeader);

		var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
		var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
		var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);
		var nameLi = $("<li></li>").appendTo(ul);
		var nameSpan = $("<span></span>").text(_decorationActivity.activity.activityName).appendTo(nameLi);

		var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);

		if (uiBtnMethod != null) {
			uiBtnMethod(uiPgDiv, _decorationActivity);
		}

	}, decorationActivityItemInfo: function (activityItems, uiBtnMethod, orderId) {

		var options = {
			"decorationOrder.orderId": orderId,
		}

		activityItems.html("");

		com.post(api.decoration.queryDecorationActivityItem, options, function (res) {
			var decorationActivityItems = res.decorationActivityItems;

			for (var i = 0; i < decorationActivityItems.length; i++) {
				decorationUtils.addActivityItemForDiv(activityItems, decorationActivityItems[i], uiBtnMethod);
			}
		});
	}, addActivityItemForDiv: function (_activityItems, _activityItem, uiBtnMethod) {

		var pricingSpan = $("<div></div>").addClass("pricing-span").css("margin-right", "10px").attr("id", "pricing_" + _activityItem.daiId).prependTo(_activityItems);
		var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);

		var widgetHeader = $("<div></div>").addClass("widget-header").attr("id", "widgetHeader_" + _activityItem.daiId).appendTo(widgetBox);
		var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").appendTo(widgetHeader);

		if (_activityItem.type == 0) {
			widgetHeaderH5.text("券");
		} else if (_activityItem.type == 1) {
			widgetHeaderH5.text("物品");
		}

		if (_activityItem.state == 0) {
			if (_activityItem.type == 0) {
				widgetHeader.addClass("header-color-blue");
			} else if (_activityItem.type == 1) {
				widgetHeader.addClass("header-color-green");
			}
		} else if (_activityItem.state == 1) {
			widgetHeader.addClass("header-color-grey");
		} else if (_activityItem.state == 2) {
			widgetHeader.addClass("header-color-orange");
		}

		var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
		var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
		var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);
		var nameLi = $("<li></li>").appendTo(ul);
		var nameSpan = $("<span></span>").attr("id", "activityItemName_" + _activityItem.daiId).text(_activityItem.activityItemName).appendTo(nameLi);
		var moneyLi = $("<li></li>").text("金额:").appendTo(ul);
		var moneySpan = $("<span></span>").attr("id", "money_" + _activityItem.daiId).text(_activityItem.money).appendTo(moneyLi);
		var numLi = $("<li></li>").text("数量:").appendTo(ul);
		var numSpan = $("<span></span>").attr("id", "money_" + _activityItem.daiId).text(_activityItem.num).appendTo(numLi);

		var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);

		if (uiBtnMethod != null) {
			uiBtnMethod(uiPgDiv, _activityItem);
		}
	}, initPayment: function (orderId, editFunc, submitFunc, refundFunc) {

		var baseTypes = ["定金", "设计费", "首付款", "首付二期款", "二期款", "尾款"];
		var totalMoney = 0;
		var receiveMoney = 0;
		var addMoney = 0;
		var reduceMoney = 0;

		var $base = $("#basePaymentDiv").html("");
		var $other = $("#otherPaymentDiv").html("");
		var $mainDiv = $("#basePaymentDiv").parent().parent().parent().parent('.row');

		var $baseul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($base);
		var $otherul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($other);

		var decorationPayments = null;

		com.post(api.payment.queryAdvancePaymentByOrderId, {"decorationOrder.orderId": orderId}, function (res) {
			$("#balanceAdvance").text(res.balanceAdvance);
			$("#projectAdvance").text(res.projectAdvance);
			$("#materialAdvance").text(res.materialAdvance);
			$("#zaterialAdvance").text(res.zaterialAdvance);
		});

		com.post(api.payment.queryDecorationPaymentByOrderId, {"decorationPayment.orderId": orderId}, function (res) {
			decorationPayments = res.decorationPayments;
		}, null, false);

		if (decorationPayments && decorationPayments.length) {
			$.each(decorationPayments, function (i, v) {
				var $liLine = $('<li></li>').addClass('item-orange clearfix');
				var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.paymentType));
				var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
				var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

				var propertyArr = [
					["应收额:", v.referMoney, "grey"],
					["实收额:", v.realMoney, "grey"],
					["收款时间:", v.collectTime, "grey"],
					["状态:", v.paymentStatus, "red"]
				];

				$.each(propertyArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulProperty);
				});

				var styleArr = [];

				v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
				v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
					var info = bank + ", ";
					var _s = bankInfo.split('#');
					for (var i = 1; i < _s.length - 1; i++) {
						var _i = _s[i].split('|');
						info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
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

				var $paymentType = v.paymentType;
				var $paymentStatus = v.paymentStatus;

				var $btnEdit = editFunc ? $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑').click(function () {
					editFunc(v.autoId, v.referMoney);
				}) : $('<a></a>');

				var $btnSubmit = submitFunc ? $('<a></a>').addClass('btn btn-minier btn-primary').html('提交').click(function () {
					submitFunc(v.autoId, $paymentType);
				}) : $('<a></a>');

				var $btnRefund = refundFunc ? $('<a></a>').addClass('btn btn-minier btn-danger').html('编辑').click(function () {
					refundFunc(v.autoId, v.referMoney, $paymentType);
				}) : $('<a></a>');

				if ($paymentType != "定金") {
					if ($paymentStatus == '未提交') {
						$paymentType == "设计费" ? $divBtnWrap.append($btnEdit).append($btnSubmit) : true;
						baseTypes.indexOf($paymentType) != -1 ? $divBtnWrap.append($btnSubmit) : true;
						v.paymentType.search('退款') != -1 || v.paymentType == '违约金' ? $divBtnWrap.append($btnSubmit) : true;
					} else if ($paymentStatus == '未付款') {
						$paymentType == "设计费" ? $divBtnWrap.append($btnEdit) : true;
					} else if ($paymentStatus == '申请审批' || $paymentStatus == '审批未通过') {
						baseTypes.indexOf($paymentType) == -1 ? $divBtnWrap.append($btnRefund) : true;
					}
				}

				$divBtnWrap.appendTo($h4);

				$liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

				if (baseTypes.indexOf($paymentType) != -1){
					$liLine.appendTo($baseul);
					if($paymentType != "定金" && $paymentType != "设计费"){
						totalMoney += v.referMoney;
						if($paymentStatus == '已确认'){

								receiveMoney += v.realMoney;
						}
					}
				}else {
					$liLine.appendTo($otherul);
					if($paymentStatus == '已确认'){
						if($paymentType == '增项款'){
							addMoney += v.realMoney;
						}else if($paymentType == '减项款'){
							reduceMoney += v.referMoney;
						}
					}

				}
			});
		}

		var paymentDiv = $("<div></div>").addClass('row').attr('id','payedMoney');
		var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("已收款项信息")));
		var paymentBody = $("<div></div>").addClass('widget-body');
		var paymentTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

		paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "已收工程款总额", "projectTotal", true)).append(this.createDivForHolonomy("col-md-3", "已收工程款百分比", "projectPercent", true)).append(this.createDivForHolonomy("col-md-3", "增项款总额", "addTotal", true)).append(this.createDivForHolonomy("col-md-3", "减项款总额", "reduceTotal", false))));
		paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
		$('<div></div>').addClass('hr col-md-12').prependTo(paymentDiv);
		$('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
		if ($('#payedMoney')){
			$('#payedMoney').remove();
		}
		$mainDiv.after(paymentDiv);

		$('#projectTotal').html(receiveMoney);
		var projectPercent = totalMoney == 0? 0: utils.accMul(utils.changeThrDecimal(utils.accDiv(receiveMoney, totalMoney)), 100);
		$('#projectPercent').html(projectPercent > 100 ? 100 : projectPercent + "%");
		$('#addTotal').html(addMoney);
		$('#reduceTotal').html(reduceMoney);

	},initDecorationInclusive: function (divid, orederId) {
	var mainDiv = $('#' + divid);
	$('#preparePayment').remove();

	var paymentDiv = $("<div></div>").addClass('row');
	var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("预付款项信息")));
	var paymentBody = $("<div></div>").addClass('widget-body');
	var paymentTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

	var inclusiveDiv = $("<div></div>").addClass('row');
	var inclusiveHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("全包·款项信息")));
	var inclusiveBody = $("<div></div>").addClass('widget-body');
	var inclusiveTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

	var serviceMoneyBody = $("<div></div>").addClass('widget-body');

	paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "合同预付款", "balanceAdvance", true)).append(this.createDivForHolonomy("col-md-3", "工程预付款", "projectAdvance", true)).append(this.createDivForHolonomy("col-md-3", "主材预付款", "materialAdvance", true)).append(this.createDivForHolonomy("col-md-3", "正林预付款", "zaterialAdvance", false))));
	paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
	$('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
	paymentDiv.prependTo(mainDiv);

	inclusiveBody.append($("<div></div>").addClass('widget-body-inner').append(inclusiveTable.append(this.createDivForHolonomy("col-md-2", "合同金额", "contractPrice", true), this.createDivForHolonomy("col-md-2", "工程总额", "projectPrice", true), this.createDivForHolonomy("col-md-2", "工程增项", "cdiff", true),
		this.createDivForHolonomy("col-md-2", "主材增项", "mdiff", true), this.createDivForHolonomy("col-md-2", "管理费", "managePrice", false), this.createDivForHolonomy("col-md-2", "实收主材额", "materialPaidup", true))));
	serviceMoneyBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
	inclusiveDiv.append($("<div></div>").addClass('widget-container-span col-md-12').append($("<div></div>").addClass('widget-box transparent').append(inclusiveHeader, inclusiveBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceMoneyBody)));
	$('<div></div>').addClass('hr col-md-12').appendTo(inclusiveDiv);
	$('<div></div>').addClass('hr col-md-12').prependTo(inclusiveDiv);
	inclusiveDiv.appendTo(mainDiv);

	com.post(api.decoration.queryDecorationInclusive, {"decorationInclusive.decorationOrder.orderId": orederId}, function (res) {

		res = res.decorationInclusive;

		$('#contractPrice').html(checkNull(res.contractPrice));
		$('#projectPrice').html(checkNull(res.projectPrice));
		$('#cdiff').html(checkNull(res.cdiff));
		$('#mdiff').html(checkNull(res.mdiff));
		$('#managePrice').html(checkNull(res.managePrice));
		$('#materialPaidup').html(checkNull(res.materialPaidup));

	});

	function checkNull(num) {
		return num == null ? 0 : num;
	}
}, initDecorationBelong: function (orderId) {

		var $design = $("#belongDesignInfo").html('');
		var $salesman = $("#belongSalesmanInfo").html('');

		var $designul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($design);
		var $salesmanul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesman);

		var decorationBelongs = null;

		com.post(api.decoration.queryDecorationBelongByOrderId, {"decorationBelong.orderId": orderId}, function (res) {
			decorationBelongs = res.decorationBelongs;
		}, null, false);

		if (decorationBelongs && decorationBelongs.length) {
			$.each(decorationBelongs, function (i, v) {
				var $liLine = $('<li></li>').addClass('item-orange clearfix');
				var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.belongUser));
				var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
				var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

				var propertyArr = [
					["员工号:", v.belongUserId, "grey"],
					["所属部门:", v.belongDept, "grey"],
					["所属大区:", v.belongRegion, "grey"],
					["分配比例:", v.belongRate, "grey"],
					["默认:", v.defaultFlag, "grey"]
				];

				$.each(propertyArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulProperty);
				});

				$liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

				v.belongType == "设计" ? $liLine.appendTo($designul) : $liLine.appendTo($salesmanul);
			});
		}
	}, loadHuploadify: function (eId, ename, fileType, multi, callback, btnstyle) {

		$("#" + eId).Huploadify({
			'debug': false, // 开启调试
			'auto': true, // 是否自动上传
			'successTimeout': 150, // 超时时间
			'formData': { // 附带值
				'uploadType': 2
			},
			'buttonClass': 'btn ' + btnstyle ? btnstyle : "btn-success",
			'buttonText': ename,
			'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
			'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
			'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
			'width': '100', // 浏览按钮的宽度
			'height': '32', // 浏览按钮的高度
			'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
			'fileTypeExts': fileType, // 允许上传的文件后缀
			'fileSizeLimit': '5MB', // 上传文件的大小限制
			'multi': multi,
			'queueSizeLimit': 5, // 上传数量
			'onUploadSuccess': function (file, data, response) { // 上传到服务器,服务器返回相应信息到data里
				callback(data);
			}
		});

	}, addDecorationPicture: function (data, type, eId) {

		var dateObj = eval("(" + data + ")");

		if (dateObj.errorCode == 0) {

			var options = {
				"decorationPicture.path": dateObj.resUrl,
				"decorationPicture.name": dateObj.strutsUploadsFileName,
				"decorationPicture.content": "",
				"decorationPicture.orderId": decorationOrderDetail.decorationOrderId,
				"decorationPicture.type": type
			};

			com.post(api.decoration.addDecorationPicture, options, function (res) {
				if (type == 0) {
					decorationUtils.addCAD($("#" + eId), res.decorationPicture);
				} else if (type == 1) {
					decorationUtils.addPicture($("#" + eId), res.decorationPicture);
				} else if (type == 2) {
					decorationUtils.addPicture($("#" + eId), res.decorationPicture);
				}
			});
		} else {
			com.showAlert(com.error, dateObj.errorMsg);
		}
	}, initDecorationPicture: function (designId, pictureId, cadId, orderId, dFlag) {

		var $desgin = $("#" + designId).html("");
		var $picture = $("#" + pictureId).html("");
		var $cad = $("#" + cadId).html("");

		com.post(api.decoration.queryDecorationPictureByOrderId, {"decorationPicture.orderId": orderId}, function (res) {
			var decorationPictures = res.decorationPictures;
			var decorationPictureLength = decorationPictures.length;

			for (var i = 0; i < decorationPictureLength; i++) {
				var decorationPicture = decorationPictures[i];

				if (decorationPicture.type == 0) {
					decorationUtils.addCAD($cad, decorationPicture);
				} else if (decorationPicture.type == 1) {
					decorationUtils.addPicture($desgin, decorationPicture, dFlag);
				} else if (decorationPicture.type == 2) {
					decorationUtils.addPicture($picture, decorationPicture, dFlag);
				}
			}

			$('.ace-thumbnails [data-rel="colorbox"]').colorbox({
				reposition: true,
				scalePhotos: true,
				scrolling: false,
				previous: '<i class="icon-arrow-left"></i>',
				next: '<i class="icon-arrow-right"></i>',
				close: '&times;',
				current: '{current} of {total}',
				maxWidth: '100%',
				maxHeight: '100%'
			});
		});
	}, addPicture: function (e, i, dFlag) {
		var $li = $('<li></li>').attr("id", "imgLi_" + i.dpId).appendTo(e);
		var $img = $('<img></img>').attr('width', 200).attr('height', 200);
		var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg($img, i.path, 200, 200, '200x200')).attr('target', '_blank').append($img).appendTo($li);

		var $tags = $('<div></div>').addClass('tags').appendTo($li);
		var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
		var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(i.name).appendTo($nameHolder);
		var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
		var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(i.uploadTime).appendTo($timeHolder);

		var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
		var $toolLabel = $('<label></label>').appendTo($tools);
		var $downA = $('<a></a>').addClass("icon-download-alt").appendTo($tools);

		if (dFlag) {
			var $delA = $('<a></a>').addClass("icon-remove").appendTo($tools);

			$delA.click(function () {
				com.post(api.decoration.deleteDecorationPicture, {"decorationPicture.dpId": i.dpId}, function (res) {
					$("#imgLi_" + res.decorationPicture.dpId).remove();
				})
			});
		}

		com.downloadFile($downA, i.path, i.name);

	}, addCAD: function (e, i) {

		var $name = i.name;

		var $infobox = $('<div></div>').addClass('infobox infobox-blue infobox-dark').appendTo(e);
		var $infoboxIcon = $('<div></div>').addClass('infobox-icon').appendTo($infobox);
		var $downIcon = $('<a></a>').addClass('icon-download-alt').appendTo($infoboxIcon);

		com.downloadFile($downIcon, i.path, $name);

		var $infoboxData = $('<div></div>').addClass('infobox-data').appendTo($infobox);
		var $infoboxContent = $('<div></div>').addClass('infobox-content').text($name.split('.')[0].substr(0, 8) + '.' + $name.split('.')[1]).appendTo($infoboxData);
		var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.uploadTime).appendTo($infoboxData);

	}, initConstructionScheduleInfo: function () {

		var options = {};
		options["constructionSchedule.orderId"] = decorationOrderDetail.decorationOrderId;

		com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function (res) {
			for (var qualityName in decorationUtils.qualityIds) {
				$("#" + qualityName + "QualityId").val(res.constructionSchedule[qualityName + "QualityName"]);
			}

			$("#schedule").val(decorationUtils.scheduleInfos[parseInt(res.constructionSchedule.schedule)]);
		});
	}, initBaseInfo: function (orderId, $api, callback) {

		com.post($api, {"decorationOrder.orderId": orderId}, function (res) {
			callback(res.decorationOrder);
		}, null, false);

	}, initDecorationHolonomy: function (divid, orederId) {
		var mainDiv = $('#' + divid);
		$('#preparePayment').remove();

		var paymentDiv = $("<div></div>").addClass('row');
		var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("预付款项信息")));
		var paymentBody = $("<div></div>").addClass('widget-body');
		var paymentTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

		var holonomyDiv = $("<div></div>").addClass('row');
		var holonomyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("半价款项信息")));
		var holonomyBody = $("<div></div>").addClass('widget-body');
		var holonomyTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

		var serviceMoneyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("服务款项信息")));
		var serviceMoneyBody = $("<div></div>").addClass('widget-body');

		paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "合同预付款", "balanceAdvance", true)).append(this.createDivForHolonomy("col-md-3", "工程预付款", "projectAdvance", true)).append(this.createDivForHolonomy("col-md-3", "主材预付款", "materialAdvance", true)).append(this.createDivForHolonomy("col-md-3", "正林预付款", "zaterialAdvance", false))));
		paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
		$('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
		paymentDiv.prependTo(mainDiv);

		holonomyBody.append($("<div></div>").addClass('widget-body-inner').append(holonomyTable.append(this.createDivForHolonomy("col-md-4", "折前总价", "quotationPrice", true), this.createDivForHolonomy("col-md-4", "工程总额", "projectPrice", true), this.createDivForHolonomy("col-md-4", "管理费", "managePrice", false),
			this.createDivForHolonomy("col-md-4", "主材总额", "materialPrice", true), this.createDivForHolonomy("col-md-4", "实收主材额", "materialPaidup", true), this.createDivForHolonomy("col-md-4", "主材额百分比", "materialPercent", false),
			this.createDivForHolonomy("col-md-4", "服务费", "servicePrice", true), this.createDivForHolonomy("col-md-4", "实收服务费", "servicePaidup", true), this.createDivForHolonomy("col-md-4", "服务费百分比", "servicePercent", false))));
		serviceMoneyBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
		holonomyDiv.append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(holonomyHeader, holonomyBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceMoneyHeader, serviceMoneyBody)));
		$('<div></div>').addClass('hr col-md-12').appendTo(holonomyDiv);
		$('<div></div>').addClass('hr col-md-12').prependTo(holonomyDiv);
		holonomyDiv.appendTo(mainDiv);

		com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decorationOrder.orderId": orederId}, function (res) {

			res = res.decorationHolonomy;

			$('#projectPrice').html(checkNull(res.projectPrice + res.managePrice));
			$('#managePrice').html(checkNull(res.managePrice));
			$('#materialPrice').html(checkNull(res.materialPrice));
			$('#servicePrice').html(checkNull(res.servicePrice));
			$('#materialPaidup').html(checkNull(res.materialPaidup));
			$('#servicePaidup').html(checkNull(res.servicePaidup));

			if(res.managePrice == null){
				$('#quotationPrice').html(0);
			}else {
				$('#quotationPrice').html(checkNull(Math.ceil(utils.changeThrDecimal(utils.accAdd(utils.accDiv(checkNull(res.projectPrice), utils.accDiv(checkNull(res.discount), 10)), res.managePrice)))));
			}

			if(res.materialPrice == null){
				$('#materialPercent').html(0);
			}else {
				var materialPercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(checkNull(res.materialPaidup), res.materialPrice)), 100);
				$('#materialPercent').html(checkNull(materialPercent > 100 ? 100 : materialPercent) + "%");
			}

			if(res.servicePrice == null){
				$('#servicePercent').html(0);
			}else {
				var servicePercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(checkNull(res.servicePaidup), res.servicePrice)), 100);
				$('#servicePercent').html(checkNull(servicePercent > 100 ? 100 : servicePercent) + "%");
			}

		});

		com.post(api.payment.queryServicePaymentByOrderId, {"servicePayment.decorationOrder.orderId": orederId}, function (res) {
			drawList(res.servicePayments);
		})

		function drawList(data) {
			var $tableWrap = $('#hoServiceMoney');
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
			$.each(data, function (i, v) {
				var serviceReceipt = v.serviceReceipt;

				var $liLine = $('<li></li>').addClass('item-orange clearfix');
				var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.type == 0 ? "收款" : "退款"));
				var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
				var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');


				var propertyArr = [
					["预付款金额:", v.advanceMoney, "grey"],
					["服务费:", v.serviceMoney, "grey"],
					["收款时间:", v.createTime, "grey"],
					["状态:", v.status == 0 ? "初始" : (v.status == 1 ? "已收款" : "已确认"), "red"]
				];

				$.each(propertyArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulProperty);
				});

				var styleArr = [];

				serviceReceipt.cash != null && serviceReceipt.cash != "0" ? styleArr.push(["现金:", serviceReceipt.cash, "grey"]) : true;
				serviceReceipt.bank != null && serviceReceipt.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
					var info = bank + ", ";
					var _s = bankInfo.split('#');
					for (var i = 1; i < _s.length - 1; i++) {
						var _i = _s[i].split('|');
						info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
					}

					return info
				})(serviceReceipt.bank, serviceReceipt.bankInfo), "grey"]) : true;
				serviceReceipt.checkv != null && serviceReceipt.checkv != "0" ? styleArr.push(["转账:", serviceReceipt.checkv, "grey"]) : true;
				serviceReceipt.installment != null && serviceReceipt.installment != "0" ? styleArr.push(["分期:", serviceReceipt.installment, "grey"]) : true;
				serviceReceipt.accounts != null && serviceReceipt.accounts != "0" ? styleArr.push(["对公帐户:", serviceReceipt.accounts, "grey"]) : true;
				serviceReceipt.advance != null && serviceReceipt.advance != "0" ? styleArr.push(["预付款:", serviceReceipt.advance, "grey"]) : true;
				serviceReceipt.coupon != null && serviceReceipt.coupon != "0" ? styleArr.push(["优惠券:", serviceReceipt.coupon + serviceReceipt.couponInfo.split('#').join(' '), "grey"]) : true;

				$.each(styleArr, function (index, value) {
					var $liProperty = $('<li></li>');
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulStyle);
				});

				$liLine.append($h4).append($ulProperty).append($ulStyle);
				$liLine.appendTo($ul);
			});


			$ul.appendTo($tableWrap);
		}

		function checkNull(num) {
			return num == null ? 0 : num;
		}
	}, createDivForHolonomy: function(inclass, string, id, isleft) {
		return $("<div></div>").addClass(inclass).css(isleft ? {"border-left": "solid 1px #e3e3e3", "margin-top": "15px"}: {"border-left": "solid 1px #e3e3e3", "border-right": "solid 1px #e3e3e3", "margin-top": "15px"}).append($("<h5></h5>").addClass('bigger-110 center').html(string)).append($("<h2></h2>").addClass('oid bigger  center').append($('<b></b>').addClass('blue').attr('id', id).html(0)));
	}, init: function(){
		
		com.post(api.common.queryReceiptType, {}, function(res){
			
			decorationUtils.qualityIds = {"supervisor":"", "chan":"", "putline":"", "waterwayCircuitPower":"", "bricklay":"", "carpent":"", "oil":"", "cleaning":""};
			decorationUtils.scheduleInfos = ["铲大白", "放线", "水力电", "瓦工", "地面找平", "木工", "油工", "水电验收", "保洁"];
			
			decorationUtils.cashInfo = {};
			decorationUtils.bankInfo = {};
			decorationUtils.checkBankInfo = {};
			decorationUtils.accountsInfo = {};
			
			$.each(res.receiptTypes, function(i, v){
				if(v.type == 1){
					decorationUtils.cashInfo[v.key] = v.name;
				}else if(v.type == 2){
					decorationUtils.bankInfo[v.key] = v.name;
				}else if(v.type == 3){
					decorationUtils.checkBankInfo[v.key] = v.name;
				}else if(v.type == 4){
					decorationUtils.accountsInfo[v.key] = v.name;
				}
			});
		}, null, false);
	}
}

