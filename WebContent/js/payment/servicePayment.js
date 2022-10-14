jQuery(function($) {
	var servicePayment = {
		htmlName: "service",
		type: params['urlLoadParams'].paytype,
		paytypes: [],
		paymentStatusArray: constant.payment.materialPayment.status.keys,
		payment: null,

		items: {
			cashCheckbox: com.focusPage("#cashCheckbox", "#servicePayment"),
			bankCheckbox: com.focusPage("#bankCheckbox", "#servicePayment"),
			checkvCheckbox: com.focusPage("#checkvCheckbox", "#servicePayment"),
			advanceCheckbox: com.focusPage("#advanceCheckbox", "#servicePayment"),

			historyDiv: com.focusPage("#historyDiv", "#servicePayment"),
			historyData: com.focusPage("#historyData", "#servicePayment"),
			cashDiv: com.focusPage("#cashDiv", "#servicePayment"),
			checkvDiv: com.focusPage("#checkvDiv", "#servicePayment"),
			advanceDiv: com.focusPage("#advanceDiv", "#servicePayment"),

			cash: com.focusPage("#cash", "#servicePayment"),
			cashInfo: com.focusPage("#cashInfo", "#servicePayment"),

			bankName: com.focusPage("#bankName", "#servicePayment"),
			bank: com.focusPage("#bank", "#servicePayment"),
			posway: com.focusPage("#posway", "#servicePayment"),

			posDiv: com.focusPage("#posDiv", "#servicePayment"),
			posGroup: com.focusPage("#posGroup", "#servicePayment"),
			bankDiv: com.focusPage("#bankDiv", "#servicePayment"),
			bankGroup: com.focusPage("#bankGroup", "#servicePayment"),
			checkvGroup: com.focusPage("#checkvGroup", "#servicePayment"),

			recharge: com.focusPage("#recharge", "#servicePayment"),
			advance: com.focusPage("#advance", "#servicePayment"),
			advanceType: com.focusPage("#advanceType", "#servicePayment"),

			comment: com.focusPage("#comment", "#servicePayment"),
			referMoney: com.focusPage("#referMoney", "#servicePayment"),
			serviceMoneyDiv: com.focusPage("#serviceMoneyDiv", "#servicePayment"),
			serviceMoney: com.focusPage("#serviceMoney", "#servicePayment"),

			myModalLabel: com.focusPage("#myModalLabel", "#servicePayment")
		},

		btns: {
			collectBtn: com.focusPage("#collectBtn", "#servicePayment"),

			checkvAdd: com.focusPage("#checkvAdd", "#servicePayment"),
			couponAdd: com.focusPage("#couponAdd", "#servicePayment"),
			createPaytran: com.focusPage("#createPaytran", "#servicePayment")
		},

		modals: {
			collectModal: com.focusPage("#collectModal", "#servicePayment")
		},

		cash: [],
		bank: [],
		checkv: [],
		accounts: [],
		posValues: {},

		cashUtil: [],
		bankUtil: [],
		checkvUtil: [],

		cashInfo: {},
		bankInfo: {},
		checkvInfo: {},
		accountsInfo: {},

		bankGrade: [],
		checkvGrade: [],

		conditions: [],
		extraParams: {},
		functions: [],
		isCollect: "",
		pageConfig: {},
		typeNo: 4,
		atttype: 0
	};

	//隐藏触发
	servicePayment.modals.collectModal.on('hide.bs.modal', function () {
		servicePayment.bankGrade = [];
		servicePayment.checkvGrade = [];

		servicePayment.items.posGroup.html("");
		servicePayment.items.bankGroup.removeClass('hide');
		servicePayment.items.checkvGroup.html("");
		servicePayment.items.historyData.html("");

		servicePayment.items.bankName.removeClass("v_required v_typeahead");
		servicePayment.items.bank.removeClass("v_required v_float_3");

		servicePayment.payment = null;

		com.closeTip();
	});

	servicePayment.items.posway.bindData(constant.payment.receiptType.posway.datas, "key", "value");

	com.focusPage("#collectModal :checkbox", "#servicePayment").on("change", function(){

		var that = $(this);
		var checked = that.prop("checked");
		var id = that.attr("id");

		var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#servicePayment");

		checked ? boxdiv.show() : boxdiv.hide();
	});

	paymentUtils.getReceiptType(servicePayment);

	com.selectTypeahead("cashInfo", servicePayment.cashUtil, "key", "value", null);

	//转账方式(银行)
	servicePayment.btns.checkvAdd.click(function(){
		paymentUtils.addBank(servicePayment);
		return false;
	});

	servicePayment.items.advanceType.bindData([{"key":"1", "value":"合同"}], 'key', 'value');

	servicePayment.btns.collectBtn.bindClick(collect);

	servicePayment.btns.createPaytran.unbind().click(function(){
		paymentUtils.pushPos(servicePayment, servicePayment.payment.decoration.orderId);
		return false;
	});

	//不同页面的不同参数
	servicePayment.pageConfig = paymentUtils.getConfig(servicePayment.type, 16);

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
			var $label = $('<label></label>').appendTo($h3);

			var $input = $('<input>').attr({"type": "checkbox", "name": "spids", "class": "ace ace-checkbox-2", "spid": v.spid}).val(v.arId);
			if (servicePayment.pageConfig.pageBtn.contains("selectall")) $input.appendTo($label);

			var $span = $('<span></span>').addClass('lbl blue bigger-150').html('服务款').appendTo($label);
			if (!(["common", "pos"].contains(servicePayment.type))) $span.html(v.type == constant.payment.servicePayment.TYPE_COLLECT_INT ? '收款' : '退款');
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnService = $('<a></a>').addClass('btn btn-minier btn-success').html("服务费");
            var $btnRefunds = $('<a></a>').addClass('btn btn-minier btn-warning').html("服务费退款");

			var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-primary').html("打印");
			var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

			var propertyArr = paymentUtils.getPropertyArr(servicePayment, v, v.decoration, servicePayment.paymentStatusArray);

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.appendTo($h3);
			$liLine.append($h3).append($ulProperty);

			if(servicePayment.pageConfig.pageBtn.contains("payway")) paymentUtils.drawHistoryData(servicePayment, v.serviceReceipt, $liLine, "");

			if (servicePayment.pageConfig.pageBtn.contains("serviceCollect")) $divBtnWrap.append($btnService);
			if (servicePayment.pageConfig.pageBtn.contains("serviceRefund")) $divBtnWrap.append($btnRefunds);
			if (v.status != constant.payment.materialPayment.STATUS_INIT_INT && servicePayment.pageConfig.pageBtn.contains("print")) $divBtnWrap.append($btnPrint);
			if (v.status == constant.payment.materialPayment.STATUS_COLLECT_INT && servicePayment.pageConfig.pageBtn.contains("update")) $divBtnWrap.append($btnUpdate);

			//服务费收款
			$btnService.click(function(){
				servicePayment.isCollect = 1;
				var money = utils.accSub(v.servicePrice, v.servicePaidup);

			    if(money <= 0){
                    com.showAlert(com.error, "当前服务费已交满,不能重复交款!");
                    return false;
                }
				paymentUtils.showPos(servicePayment, {"paytran.orderId": v.decoration.orderId, "paytran.atttype": servicePayment.atttype}, [0, 1]);
				initCollect(v);
			});

			//退款
            $btnRefunds.click(function(){
				servicePayment.isCollect = 2;
                if(v.servicePaidup == 0){
                    com.showAlert(com.error, "当前服务费未交,不能退款!");
                    return false;
                }
				initCollect(v);
            });

			//更新
			$btnUpdate.click(function(){
				servicePayment.isCollect = 3;

				initUpdate(v);
			});

			//打印
			$btnPrint.click(function(){
				params.payment.orderId = v.decoration.orderId;
				params.payment.serId = v.serviceReceipt.srId;
				params.payment.cid = v.decoration.customer.cid;
				com.popup("专用收款收据__装修单号:" + v.decoration.orderId, api.index.servicePaymentReceiptIndex.url, function () {
					parent.layer.getFrameIndex(window.name);
				},null,true)
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
		};
	})();

	var searcher = new Searcher();

	var extraParams = {};
	if (servicePayment.pageConfig.statusExtraParam != null && servicePayment.pageConfig.statusExtraParam.length > 0) {
		extraParams["servicePayment.status"] = servicePayment.pageConfig.statusExtraParam[0];
	}

	searcher.init(servicePayment.pageConfig.condArr, "condList", servicePayment.pageConfig.apiPage, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "servicePaymentPostData"+servicePayment.type, extraParams, false, null, function(){

		var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
		var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
		var $checkspan = $('<span></span>').text('全选').appendTo($checka);

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('批量确认').appendTo($adda);

		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		var btnParams = [];

		if(servicePayment.pageConfig.pageBtn.contains("selectall")) btnParams.push($checka);
		if(servicePayment.pageConfig.pageBtn.contains("confirms")) btnParams.push($adda);
		if(servicePayment.pageConfig.pageBtn.contains("export")) btnParams.push($impa);

		return btnParams;

	}, "resultList");

	function initCollect(payment){

		com.cleanItems(servicePayment.items);

		servicePayment.items.historyDiv.hide();

		servicePayment.payment = payment;

		servicePayment.items.comment.html("");

		servicePayment.isCollect == 2 ? servicePayment.items.myModalLabel.html("退款信息") : servicePayment.items.myModalLabel.html("付款信息");
		servicePayment.isCollect == 2 ? servicePayment.btns.collectBtn.html("退款") : servicePayment.btns.collectBtn.html("收款");
		servicePayment.isCollect == 2 ? servicePayment.items.referMoney.val(payment.servicePaidup).attr("readonly","readonly") : servicePayment.items.referMoney.html("").removeAttr("readonly");
		servicePayment.isCollect == 1 ? servicePayment.items.serviceMoneyDiv.show() : servicePayment.items.serviceMoneyDiv.hide();
		servicePayment.isCollect == 1 ? servicePayment.items.serviceMoney.val(utils.accSub(payment.servicePrice, payment.servicePaidup)).attr("readonly","readonly") : "";

		var type = servicePayment.isCollect == 3 ? 2 : servicePayment.isCollect == 2 ?  1 : 0; // 0: 收款类型 , 1: 退款类型

		if(servicePayment.pageConfig.paytypes.contains("cash")) paymentUtils.initCash(servicePayment);
		if(servicePayment.pageConfig.paytypes.contains("bank")) paymentUtils.initBank(servicePayment, type);
		if(servicePayment.pageConfig.paytypes.contains("checkv")) paymentUtils.initCheckv(servicePayment);
		if(servicePayment.pageConfig.paytypes.contains("advance")) paymentUtils.initAdvance(servicePayment, type, {"advancePayment.decoration.orderId": payment.decoration.orderId}, "balanceAdvance");

		//根据装修单等级获取收据类型等级
		var grade = ["A", "C"].contains(payment.decoration.grade) ? "A" : "";

		// 根据等级在数组中筛选出符合要求的用于显示
		paymentUtils.initBankGrade(servicePayment, grade);

		servicePayment.modals.collectModal.modal("show");

	}

	//更新
	function initUpdate(v){

		com.cleanItems(servicePayment.items);

		servicePayment.items.myModalLabel.html("更新付款信息");
		servicePayment.btns.collectBtn.html("收款");
		servicePayment.items.serviceMoneyDiv.hide();
		servicePayment.items.referMoney.val(v.serviceMoney+ v.advanceMoney).attr("readonly", "readonly");
		servicePayment.items.comment.val(v.comment).attr("readonly", "readonly");

		servicePayment.items.historyDiv.show();

		servicePayment.payment = v;

		if(servicePayment.pageConfig.paytypes.contains("cash")) paymentUtils.initCash(servicePayment);
		if(servicePayment.pageConfig.paytypes.contains("bank")) paymentUtils.initBank(servicePayment, 1);
		if(servicePayment.pageConfig.paytypes.contains("checkv")) paymentUtils.initCheckv(servicePayment);

		//根据装修单等级获取收据类型等级
		var grade = ["A", "C"].contains(v.decoration.grade) ? "A" : "";

		// 根据等级在数组中筛选出符合要求的用于显示
		paymentUtils.initBankGrade(servicePayment, grade);

		//历史收款信息
		paymentUtils.drawHistoryData(servicePayment, v.serviceReceipt, servicePayment.items.historyData, "update");

		servicePayment.modals.collectModal.modal("show");
	}

	//收款
	function collect(){

		if (com.validate("collectModal", "#servicePayment")) return false;

		var url = "";
		var realPayment = 0;
		var referMoney = servicePayment.items.referMoney.val();
		var comment =  servicePayment.items.comment.val();
		var type;

		var payment = servicePayment.payment;

		var options = {
			"servicePayment.decoration.orderId" : payment.decoration.orderId,
			"servicePayment.referMoney" : referMoney,
			"servicePayment.comment" : comment,
			"serviceReceipt.comment" : comment
		};

		if(servicePayment.isCollect == 1){
			url = api.payment.collectServicePaymentForService;
			type = 0;
		}else if(servicePayment.isCollect == 2){
			url = api.payment.refundServicePaymentForService;
			type = 1;
		}else if(servicePayment.isCollect == 3){
			url = api.payment.updateServicePayment;
			options["servicePayment.spid"] = payment.spid;
			options["servicePayment.pid"] = payment.pid;
			type = 2;
		}

		//计算总额
		var cash = paymentUtils.paramCash(servicePayment, "serviceReceipt", options);

		realPayment = utils.accAdd(realPayment, parseFloat(cash));

		var bank = paymentUtils.paramBank(servicePayment, servicePayment.payment.serviceReceipt, "serviceReceipt", options, type);

		if(bank < 0){
			com.showAlert(com.warning, "存在未处理POS收款");
			return false;
		}

		realPayment = utils.accAdd(realPayment, parseFloat(bank));

		var checkv = paymentUtils.paramCheckv(servicePayment, "serviceReceipt", options);

		realPayment = utils.accAdd(realPayment, parseFloat(checkv));

		var advance = paymentUtils.paramAdvance(servicePayment, servicePayment.payment.serviceReceipt, "serviceReceipt", options, "advance", type);

		if(advance < 0){
			com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
			return false;
		}

		realPayment = utils.accAdd(realPayment, parseFloat(advance));

		if (referMoney != realPayment) {
			com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
			return false;
		}

		if(servicePayment.isCollect == 1) {
			var serviceMoney = servicePayment.items.serviceMoney.val();
			if (realPayment > serviceMoney) {
				com.showAlert(com.error, "当前所收服务费多于剩余服务费,不能收款!");
				return false;
			}
		}

		com.post(url, options, function () {
			searcher.doSearch();
			servicePayment.modals.collectModal.modal("hide");
		});

	}

	//全选
	com.focusPage('a[name="checks"]', '#pagenation').click(function(){
		paymentUtils.checkAll();
	});

	//批量确认
	com.focusPage('a[name="confirms"]', '#pagenation').click(function(){
		var options = {};
		var $inputs = com.focusPage('input[name="spids"]:checked');

		$.each($inputs, function(i, v){
			options["spIds["+i+"]"] = $(v).attr('spid');
		});

		if($inputs.length == 0){
			com.showAlert(com.warning, "当前未选择要确认的服务款项信息");
			return false;
		}

		com.showConfirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			com.post(api.payment.confirmServicePayment, options, function(res){
				searcher.doSearch();
				com.showAlert(com.info, "确认成功")
			});
		});
	});

	//导出
	com.focusPage('a[name="import"]', '#pagenation').click(function () {

		if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

		if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}

		com.post(api.payment.pageServicePayment, $.extend({}, params["servicePaymentPostData"+servicePayment.type], {"paging.noPage": 1}), function(res){
			$.exceler({
				column : [
					["装修单号","decoration.orderId"],
					['楼盘地址',['decoration.house.village.cityProper.city.name', 'decoration.house.village.cityProper.name', 'decoration.house.village.name', 'decoration.house.houseNumber']],
					['客户','decoration.customer.name'],
					['设计师','decoration.designer.currentName'],
					['设计部','decoration.designer.dept.name'],
					['预付款金额', 'advanceMoney'],
					['服务费', 'serviceMoney'],
					['收款人', 'serviceReceipt.collecter.currentName'],
					['收款时间', 'serviceReceipt.collectTime'],
					['类型', 'type'],
					['状态', 'status'],
					['备注', 'comment'],
					['现金', 'serviceReceipt.cash'],
					['刷卡', ['serviceReceipt.bank', 'serviceReceipt.bankInfo']],
					['银行', ['serviceReceipt.checkv', 'serviceReceipt.checkvBank']],
					['分期', ['serviceReceipt.installment', 'serviceReceipt.installBank']],
					['对公', ['serviceReceipt.accounts', 'serviceReceipt.accountsBank']],
					['预付款', 'serviceReceipt.advance']
				],
				list: res.paging.data
			}, function(v){
				if(v.serviceReceipt.bank != null && v.serviceReceipt.bank != 0){
					v.serviceReceipt.bankInfo = paymentUtils.splitBankInfo('', v.serviceReceipt.bankInfo, servicePayment.bankInfo, true);
				}

				if(v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != 0){
					var checkvInfoStr = v.serviceReceipt.checkvBank;
					if(checkvInfoStr.indexOf("#") != -1){
						v.serviceReceipt.checkvBank = paymentUtils.splitBankInfo('', v.serviceReceipt.checkvBank, servicePayment.checkvInfo, true);
					}else{
						v.serviceReceipt.checkvBank = v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? servicePayment.checkvInfo[v.serviceReceipt.checkvBank] : '';
					}

				}

				v.serviceReceipt.installBank = v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? servicePayment.bankInfo[v.serviceReceipt.installBank] : '';
				v.serviceReceipt.accountsBank = v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? servicePayment.accountsInfo[v.serviceReceipt.accountsBank] : '';
				v.type = v.type == "0" ? "收款" : "退款";
				v.status = v.status == "1" ? "已付款" : "已确认";
			});
		});
	});
});

