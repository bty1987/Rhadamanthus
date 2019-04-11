
jQuery(function($) {
	var servicePaymentPostData = {};
	var servicePayment = {
		paymentModelNameData: ["cash", "bank", "checkv"],
		moreMsg: {},
		baseModal: null,
		items: {},
		orderId: null,
		bankNums: [],
		checkvNums: [],
		spid: null,
		pid: null
	};

    servicePayment.items.cashCheckbox = com.focusPage("#cashCheckbox");
    servicePayment.items.bankCheckbox = com.focusPage("#bankCheckbox");
    servicePayment.items.checkvCheckbox = com.focusPage("#checkvCheckbox");

	servicePayment.baseModal = com.focusPage("#baseItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});

	//隐藏触发
	com.focusPage("#baseItemModal").on('hidden.bs.modal', function () {
		servicePayment.bankUtilForGrade = [];
		servicePayment.checkBankUtilForGrade = [];
	});

	com.focusPage("#refundBankCard").on("click",function(e) {
		com.focusPage("#refundCashInfoDiv").addClass("hide");

		com.focusPage("#refundBankCardDiv").removeClass("hide");
		com.focusPage("#refundBankName").addClass("v_required");
		com.focusPage("#refundBankName").get(0).selectedIndex = 0;
	});

	com.focusPage("#refundCash").on("click",function(e) {
		com.focusPage("#refundCashInfoDiv").removeClass("hide");

		com.focusPage("#refundBankCardDiv").addClass("hide");
		com.focusPage("#refundBankName").removeClass("v_required");
	});

    com.focusPage("#baseItemModal :checkbox").on("change", function(){
        $(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide()
    });

	servicePayment.cash = [];
	servicePayment.bank = [];
	servicePayment.bankUtil = [];
	servicePayment.checkBank = [];
	servicePayment.accounts = [];

	servicePayment.cashUtil = [];
	servicePayment.bankUtil = [];
	servicePayment.checkBankUtil = [];

	servicePayment.bankUtilForGrade = [];
	servicePayment.checkBankUtilForGrade = [];

	servicePayment.cashInfo = {};
	servicePayment.bankInfo = {};
	servicePayment.checkBankInfo = {};
	servicePayment.accountsInfo = {};

	com.post(api.common.queryReceiptType, {}, function(res){
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				servicePayment.cash.push(v);
				servicePayment.cashUtil.push({"key":v.no,"value":v.name});
				servicePayment.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				servicePayment.bank.push(v);
				servicePayment.bankUtil.push({"key":v.no,"value":v.name});
				servicePayment.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				servicePayment.checkBank.push(v);
				servicePayment.checkBankUtil.push({"key":v.no,"value":v.name});
				servicePayment.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				servicePayment.accounts.push(v);
				servicePayment.accountsInfo[v.no] = v.name;
			}
		});
	}, null, false);


	paymentUtils.dynamicChosen('baseItemModal',"servicecashInfo",servicePayment.cashUtil,"key","value");

	com.focusPage("#servicebankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "bankDiv", "#servicebankDivGroup", servicePayment.bankNums, servicePayment.bankUtilForGrade, "service");

		return false;
	});

	com.focusPage("#servicecheckvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "checkvDiv", "#servicecheckvDivGroup", servicePayment.checkvNums, servicePayment.checkBankUtilForGrade, "service");

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html('服务款'));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnCollect = $('<a></a>').addClass('btn btn-minier');
			var $btnService = $('<a></a>').addClass('btn btn-minier');
            var $btnRefunds = $('<a></a>').addClass('btn btn-minier');

			var propertyArr = [
				["订单号:", v.decoration.orderId, "blue"],
				["楼盘地址:", v.decoration.house.village.name + ''+v.decoration.house.houseNumber, "grey"],
				["客户:", v.decoration.customer.name, "grey"],
				["设计师:", v.decoration.designer.currentName, "grey"],
				["设计部:", v.decoration.designer.dept.name, "grey"],
				["等级:", v.decoration.grade, "red"],
				["主材金额:", v.materialPrice, "blue"],
				["服务费:", v.servicePrice, "blue"],
				["工程造价:", v.projectPrice, "blue"],
				["管理费:", v.managePrice, "blue"]
			];
            var money = v.servicePrice - v.servicePaidup;
			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnCollect).append($btnService).append($btnRefunds).appendTo($h3);

			$btnCollect.text('收款').addClass("btn btn-minier btn-primary");
			$btnService.text('服务费').addClass("btn btn-minier btn-success");
            $btnRefunds.text('服务费退款').addClass("btn btn-minier btn-warning");

			$liLine.append($h3).append($ulProperty);

			$btnCollect.click(function(){
				servicePayment.baseModal.attr("ChargeType","1");
				dialogPayment(v);
			});

			$btnService.click(function(){
			    if(money <= 0){
                    com.showAlert(com.error, "当前服务费已交满,不能重复交款!");
                    return false;
                }
				servicePayment.baseModal.attr("ChargeType","2");
				dialogPayment(v);
			});

            $btnRefunds.click(function(){
                if(v.servicePaidup == 0){
                    com.showAlert(com.error, "当前服务费未交,不能退款!");
                    return false;
                }
                servicePayment.baseModal.attr("ChargeType","3");
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
		};
	})();

	var searcher = new Searcher();

	searcher.init(["orderId", "paymentDesigner", "village"], "condList", api.decoration.pageDecorationHolonomy, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationHolonomyPostData");


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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == 0 ? '收款' : '退款'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier');

            var propertyArr = [
                ["订单号:", v.decoration.orderId, "blue"],
                ["楼盘地址:", v.decoration.house.village.name + ''+v.decoration.house.houseNumber, "grey"],
                ["客户:", v.decoration.customer.name, "grey"],
                ["设计师:", v.decoration.designer.currentName, "grey"],
                ["设计部:", v.decoration.designer.dept.name, "grey"],
				["等级:", v.decoration.grade, "red"],
                ["预付款金额:", v.advanceMoney, "blue"],
                ["服务费:", v.serviceMoney, "blue"],
                ["收款人:", v.serviceReceipt.collecter.currentName, "grey"],
                ["收款时间:", v.serviceReceipt.collectTime, "green"],
                ["状态:", v.status == "1" ? "已付款" : "已确认", "red"],
                ["备注:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

			//详情显示
			var styleArr = [];

			v.serviceReceipt.cash != null && v.serviceReceipt.cash != "0" ? styleArr.push(["现金:", v.serviceReceipt.cash, "blue"]) : true;
			v.serviceReceipt.bank != null && v.serviceReceipt.bank != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.serviceReceipt.bank, v.serviceReceipt.bankInfo, servicePayment.bankInfo), "blue"]) : true;
			v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? styleArr.push(["转账:", paymentUtils.splitBankInfo(v.serviceReceipt.checkv, v.serviceReceipt.checkvBank, servicePayment.checkBankInfo), "blue"]) : true;
			v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? styleArr.push(["分期:", v.serviceReceipt.installment, "blue"]) : true;
			v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? styleArr.push(["对公帐户:", v.serviceReceipt.accounts, "blue"]) : true;

			$.each(styleArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulStyle);
			});

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $btnPrint.text('打印').addClass("btn btn-minier btn-primary");

			$btnPrint.click(function(){
				if(v.serviceReceipt.collecter.userId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配, 不能打印");
					return false;
				}else{
					params.decorationOrderSOrderId = v.decoration.orderId;
					params.servicePaymentSOrderId = v.decoration.orderId;
					params.serviceReceiptSrId = v.serviceReceipt.srId;
					com.popup("专用收款收据__装修单号:" + v.decoration.orderId, api.index.servicePaymentReceiptIndex.url ,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true)
				}
			});

			var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

			if(v.status == 1){
				$divBtnWrap.append($btnUpdate);
			}

			$btnUpdate.click(function(){
				servicePayment.baseModal.attr("ChargeType","4");
				servicePayment.spid = v.spid;
				servicePayment.pid = v.pid;
				dialogPayment(v);
			});

            $liLine.append($h3).append($ulProperty).append($ulStyle);

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

    var hsearcher = new Searcher();

    hsearcher.init(["orderId", "paymentDesigner", "paymentVillage", "collectTimeDateRange"], "hcondList", api.payment.pageServicePaymentForHistory, function(data){

		hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "servicePaymentPostData", null, false, null, function(){
		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		return [$impa];
	}, "hresultList");

	com.focusPage('a[name="import"]', '#hpagenation').click(function () {

	 if(com.focusPage('span[name="totalRecords"]').text() == 0){
		 com.showAlert(com.warning, "请通过条件进行查询");
		 return false;
	 }

	 if(com.focusPage('span[name="totalRecords"]').text() > 1000){
		 com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
		 return false;
	 }

	 com.post(api.payment.pageServicePaymentForHistory, $.extend({}, params.servicePaymentPostData, {"paging.noPage": 1}), function(res){
		 $.exceler({
			 column : [
				 ["订单号","decoration.orderId"],
				 ['楼盘地址',['decoration.house.village.name', 'decoration.house.houseNumber']],
				 ['客户','decoration.customer.name'],
				 ['设计师','decoration.designer.currentName'],
				 ['设计部','decoration.designer.dept.name'],
				 ['预付款金额', 'advanceMoney'],
				 ['服务费', 'serviceMoney'],
				 ['收款人', 'serviceReceipt.collecter.currentName'],
				 ['收款时间', 'serviceReceipt.collectTime'],
				 ['状态', 'status == "1" ? "已付款" : "已确认"'],
				 ['备注', 'comment'],
				 ['现金', 'serviceReceipt.cash'],
				 ['银行', ['serviceReceipt.bank', 'serviceReceipt.bankInfo']],
				 ['转账', ['serviceReceipt.checkv', 'serviceReceipt.checkvBank']],
				 ['分期', ['serviceReceipt.installment', 'serviceReceipt.installBank']],
				 ['对公', ['serviceReceipt.accounts', 'serviceReceipt.accountsBank']]
				 ],
				 	list: res.paging.data
				 }, function(v){
			 			if(v.serviceReceipt.bank != null && v.serviceReceipt.bank != 0){
							 var $info = ' ';
							 var _s = v.serviceReceipt.bankInfo.split('#');
							 for(var i=1;i<_s.length-1;i++){
								 var _i = _s[i].split('|');
								 $info += servicePayment.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
							 }

				 			v.serviceReceipt.bankInfo = $info;
				 		}

						 if(v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != 0){
							 var checkBankInfoStr = v.serviceReceipt.checkvBank;
							 if(checkBankInfoStr.indexOf("#") != -1){
								 var $checkvInfo = ' ';
								 var _c = v.serviceReceipt.checkvBank.split('#');
								 for(var i=1;i<_c.length-1;i++){
									 var _i = _c[i].split('|');
									 $checkvInfo += servicePayment.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
								 }

								 v.serviceReceipt.checkvBank = $checkvInfo;
							 }else{
								 v.serviceReceipt.checkvBank = v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? servicePayment.checkBankInfo[v.serviceReceipt.checkvBank] : '';
							 }

						 }

				 v.serviceReceipt.installBank = v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? servicePayment.bankInfo[v.serviceReceipt.installBank] : '';
				 v.serviceReceipt.accountsBank = v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? servicePayment.accountsInfo[v.serviceReceipt.accountsBank] : '';
			 });
		 });
	 });

	function initBaseModal(v){
		com.focusPage("#historyUpdateS").addClass("hide");
		for(var i = 0; i<servicePayment.paymentModelNameData.length; i++){
			var _name = servicePayment.paymentModelNameData[i];
			var _checkboxId = "#" + _name + "Checkbox";
			var _divId = "#" + _name + "Div";
			var _inputId = "#" + _name;
			var _selectId = "";
			if(_name != "bank"){
				_selectId = "#"+ _name + "BankName";
			}else{
				_selectId = "#" + _name + "Name";
			}

			com.focusPage(_checkboxId).removeAttr("checked").removeAttr("disabled");

			com.focusPage(_inputId).val("");

			if(_name == "bank"){
				com.focusPage("#servicebankDivGroup").html("");
				com.focusPage("#servicebankAdd").attr("num", 0).attr("maxnum",0);
			}

			if(_name == "checkv"){
				com.focusPage("#servicecheckvDivGroup").html("");
				com.focusPage("#servicecheckvAdd").attr("num", 0).attr("maxnum",0);
			}
		}

		servicePayment.bankNums=[];
		servicePayment.checkvNums=[];

		com.focusPage("#collectDes").val("").removeAttr("readonly");
        com.focusPage("#referMoney").removeAttr("readonly");

		paymentUtils.EmptyChosen('servicecashInfo');

		//根据装修单等级获取收据类型等级
		var gradeParam;
		if(v.decoration.grade == "A" || v.decoration.grade == "C"){
			gradeParam = "A";
		}else{
			gradeParam = "";
		}

		// 根据等级在数组中筛选出符合要求的用于显示
		var returnGradeParams = paymentUtils.getValueForGrade(servicePayment.bank, servicePayment.checkBank, gradeParam);
		servicePayment.bankUtilForGrade = returnGradeParams[0];
		servicePayment.checkBankUtilForGrade = returnGradeParams[1];
	}

	function dialogPayment(v){
        com.cleanItems(servicePayment.items);

		initBaseModal(v);
        if(servicePayment.baseModal.attr("ChargeType")==1){
			com.focusPage("#myModalLabel").text("付款信息");
			com.focusPage("#collectBtn").text("收款");
			com.focusPage("#serviceMoney").css("display","none");
            com.focusPage("#referMoney").val("");
            com.focusPage("#collectDes").val("");
        }else if(servicePayment.baseModal.attr("ChargeType")==2){
			com.focusPage("#myModalLabel").text("付款信息");
			com.focusPage("#collectBtn").text("收款");
			com.focusPage("#serviceMoney").css("display","block");
			com.focusPage("#sMoney").val(v.servicePrice - v.servicePaidup);
			com.focusPage("#sMoney").attr("readonly","readonly");
			com.focusPage("#referMoney").val("");
			com.focusPage("#collectDes").val("");
        }else if(servicePayment.baseModal.attr("ChargeType")==3){
            com.focusPage("#myModalLabel").text("退款信息");
            com.focusPage("#collectBtn").text("退款");
			com.focusPage("#serviceMoney").css("display","none");
            com.focusPage("#referMoney").val(v.servicePaidup);
            com.focusPage("#referMoney").attr("readonly","readonly");
			com.focusPage("#collectDes").val("");
        }else if(servicePayment.baseModal.attr("ChargeType")==4){
			com.focusPage("#historyUpdateS").removeClass("hide");
			com.focusPage("#myModalLabel").text("更新付款信息");
			com.focusPage("#collectBtn").text("收款");
			com.focusPage("#serviceMoney").css("display","none");
			com.focusPage("#referMoney").val(v.serviceMoney+ v.advanceMoney).attr("readonly", "readonly");
			com.focusPage("#collectDes").val(v.comment).attr("readonly", "readonly");

			//历史收款信息
			com.focusPage("#cashHistoryS").text("现金: "+com.checkNull(servicePayment.cashInfo[v.serviceReceipt.cashInfo],"")+" "+com.checkNull(v.serviceReceipt.cash,"无"));
			com.focusPage("#bankHistoryS").text("银行卡: " + (v.serviceReceipt.bank == 0 ? "无" : paymentUtils.splitBankInfo(v.serviceReceipt.bank, v.serviceReceipt.bankInfo, servicePayment.bankInfo)));
			com.focusPage("#checkvHistoryS").text("转账: " + (v.serviceReceipt.checkv == 0 ? "无" : paymentUtils.splitBankInfo(v.serviceReceipt.checkv, v.serviceReceipt.checkvBank, servicePayment.checkBankInfo)));
			com.focusPage("#installmentHistoryS").text("分期: "+com.checkNull(servicePayment.bankInfo[v.serviceReceipt.installmentBank],"")+" "+com.checkNull(v.serviceReceipt.installment,"无"));
			com.focusPage("#accountsHistoryS").text("对公账户: "+com.checkNull(servicePayment.accountsInfo[v.serviceReceipt.accountsBank],"")+" "+com.checkNull(v.serviceReceipt.accounts,"无"));

		}

		servicePayment.baseModal.modal("show");

		servicePayment.moreMsg[0]=$.extend({},v);
	}

	com.focusPage("#collectBtn").bindClick(payment);

	function payment(){
		if(com.validate()){
			return;
		}

		var v = servicePayment.moreMsg[0];
		var referMoney = com.focusPage("#referMoney").val();
		var des = com.focusPage("#collectDes").val();

		var cash = 0;
		var cashbInfo = "";
		var bank = 0;
		var bankInfo = "";
		var checkv = 0;
		var checkvBank = "";

		if(com.focusPage("#cashCheckbox").prop("checked")){
			cash = com.focusPage("#cash").val();
			cashbInfo = com.focusPage("#servicecashInfo").val();
		}

		if(com.focusPage("#bankCheckbox").prop("checked")){
			var aboutBankParams = paymentUtils.returnBankParams(servicePayment.bankNums, "servicebank");
			bank = aboutBankParams[0];
			bankInfo = aboutBankParams[1];
		}

		if(com.focusPage("#checkvCheckbox").prop("checked")){
			var aboutChenckvParams = paymentUtils.returnBankParams(servicePayment.checkvNums, "servicecheckv");
			checkv = aboutChenckvParams[0];
			checkvBank = aboutChenckvParams[1];
		}

		var realMoney = utils.accAdd(utils.accAdd(cash, bank), checkv);

        if (referMoney != realMoney) {
            com.showAlert(com.error, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

		if(servicePayment.baseModal.attr("ChargeType")==2) {
			var sMoney = com.focusPage("#sMoney").val();
			if (realMoney > sMoney) {
				com.showAlert(com.error, "当前所收服务费多于剩余服务费,不能收款!");
				return false;
			}
		}

		var option = {
			"servicePayment.decoration.orderId" : v.decoration.orderId,
			"servicePayment.referMoney" : referMoney,
			"servicePayment.comment" : des,

            "serviceReceipt.cash" : cash,
            "serviceReceipt.cashInfo" : cashbInfo,
            "serviceReceipt.bank" : bank,
            "serviceReceipt.bankInfo" : bankInfo,
            "serviceReceipt.checkv" : checkv,
            "serviceReceipt.checkvBank" : checkvBank,
			"serviceReceipt.comment" : des
		};

		var reg = /^[0-9]*$/;
		if(reg.test(com.focusPage("#referMoney").val()) != true){
			com.showAlert(com.error, "应收款只能为数字");
			return false;
		}
		if(com.focusPage("#referMoney").val() == null || com.focusPage("#referMoney").val() == ""){
            com.showAlert(com.error, "应收款不能为空");
            return false;
        }

		var currentUrl;
		var currentOption;
		var successMessage;
		var failMessage;

		if(servicePayment.baseModal.attr("ChargeType")==1){
			currentUrl = api.payment.collectServicePayment;
			currentOption = option;
			successMessage = "收款成功";
			failMessage = "收款失败";
		}else if(servicePayment.baseModal.attr("ChargeType")==2){
			currentUrl = api.payment.collectServicePaymentForService;
			currentOption = option;
			successMessage = "收款成功";
			failMessage = "收款失败";
		}else if(servicePayment.baseModal.attr("ChargeType")==3){
			currentUrl = api.payment.refundServicePaymentForService;
			currentOption = option;
			successMessage = "退款成功";
			failMessage = "退款失败";
		}else if(servicePayment.baseModal.attr("ChargeType")==4){
			currentUrl = api.payment.updateServicePayment;
			currentOption = option;
			currentOption["servicePayment.spid"] = servicePayment.spid;
			currentOption["servicePayment.pid"] = servicePayment.pid;
			successMessage = "更新成功";
			failMessage = "更新失败";
		}

		com.post(currentUrl, currentOption, function () {
			searcher.doSearch();
			if(servicePayment.baseModal.attr("ChargeType")==4) {
				hsearcher.doSearch();
			}
			com.showAlert(com.info, successMessage);
			servicePayment.baseModal.modal("hide");
		}, function () {
			searcher.doSearch();
			com.showAlert(com.error, failMessage);
			servicePayment.baseModal.modal("hide");
		});
	}

	com.focusPage("#historyService").removeClass("active");
});

