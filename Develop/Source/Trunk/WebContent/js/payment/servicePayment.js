
var servicePaymentPostData = {};

jQuery(function($) {

	var servicePayment = {

		paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts"],

		moreMsg:{},

		orderPaymentId:null,

		saveBtn: null,
		cancellBtn: null,

		baseModal: null,
		addOrReduceModal:null,
		refundModal:null,
		servicePaymentItems: {},
		addReduceDetail:null,

		items: {},

		editFlg:false,
		batchFlag: true,

		bankList:null,
		accountsList: [],

		paymentType:"增项款",
		orderId:null,
	};

    servicePayment.items.cashCheckbox = $("#cashCheckbox");
    servicePayment.items.bankCheckbox = $("#bankCheckbox");
    servicePayment.items.checkvCheckbox = $("#checkvCheckbox");
    servicePayment.items.installmentCheckbox = $("#installmentCheckbox");
    servicePayment.items.accountsCheckbox = $("#accountsCheckbox");

	//收款弹窗
	servicePayment.baseModal = $("#baseItemModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});

	$("#refundBankCard").on("click",function(e) {
		$("#refundCashInfoDiv").addClass("hide");

		$("#refundBankCardDiv").removeClass("hide");
		$("#refundBankName").addClass("v_required");
		$("#refundBankName").get(0).selectedIndex = 0;
	});

	$("#refundCash").on("click",function(e) {
		$("#refundCashInfoDiv").removeClass("hide");

		$("#refundBankCardDiv").addClass("hide");
		$("#refundBankName").removeClass("v_required");
	});

	/*for(var i=0;i<servicePayment.paymentModelNameData.length;i++){
		$("#" + servicePayment.paymentModelNameData[i] + "Checkbox").on("click",function(e) {
			var _name = $(this).attr("key");
			var _checkboxId = "#" + _name + "Checkbox";
			var _divId = "#" + _name + "Div";

			if($(_checkboxId).attr("checked") != "checked"){
				$(_divId).removeClass("hide");
				$(_checkboxId).attr("checked","checked");

				if(_name == "advance"){
					com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.customerId": servicePaymentPostData.customerId},function(res){
						$("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
						$("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
					});
				}
			}else{
				$(_divId).addClass("hide");
				$(_checkboxId).removeAttr("checked","checked");
			}
		});
	}*/

    $("#baseItemModal :checkbox").on("change", function(){
        $(this).prop("checked") ? $("[referCheckbox="+this.id+"]").show() : $("[referCheckbox="+this.id+"]").hide()
    });

	//查询付款银行信息
	com.post(api.common.queryReceiptType, {}, function(res){

		servicePayment.cash = [];
		servicePayment.bank = [];
		servicePayment.checkBank = [];
		servicePayment.accounts = [];

		servicePayment.cashInfo = {};
		servicePayment.bankInfo = {};
		servicePayment.checkBankInfo = {};
		servicePayment.accountsInfo = {};

		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				servicePayment.cash.push(v);
				servicePayment.cashInfo[v.key] = v.name;
			}else if(v.type == 2){
				servicePayment.bank.push(v);
				servicePayment.bankInfo[v.key] = v.name;
			}else if(v.type == 3){
				servicePayment.checkBank.push(v);
				servicePayment.checkBankInfo[v.key] = v.name;
			}else if(v.type == 4){
				servicePayment.accounts.push(v);
				servicePayment.accountsInfo[v.key] = v.name;
			}
		});

		$("#cashInfo").bindData(servicePayment.cash, 'key', 'name');

		$("#installmentBankName").bindData(servicePayment.bank, 'key', 'name');

		$("#checkvBankName").bindData(servicePayment.checkBank, 'key', 'name');

		$("#accountsBankName").bindData(servicePayment.accounts, 'key', 'name');
	}, null, false);

	//添加银行卡
	$("#bankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		addBankDiv(nextNum);
		$(this).attr("num", nextNum);

		return false;
	});

	//服务款半价信息
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

			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html('服务款'));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnCollect = $('<a></a>').addClass('btn btn-minier');
			var $btnService = $('<a></a>').addClass('btn btn-minier');
            var $btnRefunds = $('<a></a>').addClass('btn btn-minier');

			var propertyArr = [
				["订单号:", v.decorationOrder.orderId, "grey"],
				["楼盘地址:", v.decorationOrder.village.villageName + ''+v.decorationOrder.houseNumber, "grey"],
				["客户:", v.decorationOrder.customer.customerName, "grey"],
				["设计师:", v.decorationOrder.designer, "grey"],
				["设计部:", v.decorationOrder.designDepartment, "grey"],
				["主材金额:", v.materialPrice, "blue"],
				["服务费:", v.servicePrice, "blue"],
				["工程造价:", v.projectPrice, "blue"],
				["管理费:", v.managePrice, "blue"],
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
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		};
	})();

	//查询服务款半价信息
	var searcher = new Searcher();

	searcher.init(["orderId", "designer", "village"], "condList", api.decoration.pageDecorationHolonomy, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationHolonomyPostData");


    //服务款服务款已收款信息
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

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html('服务款'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier');

            var propertyArr = [
                ["订单号:", v.decorationOrder.orderId, "grey"],
                ["楼盘地址:", v.decorationOrder.village.villageName + ''+v.decorationOrder.houseNumber, "grey"],
                ["客户:", v.decorationOrder.customer.customerName, "grey"],
                ["设计师:", v.decorationOrder.designer, "grey"],
                ["设计部:", v.decorationOrder.designDepartment, "grey"],
                ["应收金额:", v.advanceMoney, "blue"],
                ["服务费:", v.serviceMoney, "blue"],
                ["收款人:", v.collecter.currentName, "grey"],
                ["收款时间:", v.collcetTime, "grey"],
                ["状态:", v.status == "1" ? "已收款" : "", "red"],
                ["备注:", v.des, "grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $btnPrint.text('打印').addClass("btn btn-minier btn-primary");

			$btnPrint.click(function(){
				if(v.collecter.userId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配，不能打印");
					return false;
				}else{
					com.popup("专用收款收据__订单编号:" + v.decorationOrder.orderId  ,api.index.servicePaymentReceiptIndex.url + "?decorationOrder.orderId=" + v.decorationOrder.orderId + "&servicePayment.orderId=" + v.decorationOrder.orderId + "&serviceReceipt.srId=" + v.serviceReceipt.srId + "&time=" + parent.params.loginTime,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true)
				}
			});

            $liLine.append($h3).append($ulProperty);

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
        };
    })();

    //查询服务款已收款信息
    var hsearcher = new Searcher();

    hsearcher.init(["orderId", "designer", "village", "collectTimeDateRange"], "hcondList", api.payment.pageServicePaymentForCollect, function(data){
    	hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "servicePaymentPostData", null, false, null, function(){
		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		return [$impa];
	}, "hresultList");

	$('a[name="import"]', '#hpagenation').click(function () {

	 if($('span[name="totalRecords"]').text() == 0){
	 com.showAlert(com.warning, "请通过条件进行查询");
	 return false;
	 }

	 if($('span[name="totalRecords"]').text() > 1000){
	 com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
	 return false;
	 }

	 com.post(api.payment.pageServicePaymentForCollect, $.extend({}, params.servicePaymentPostData, {"paging.noPage": 1}), function(res){

		 $.exceler({
			 column : [
				 ["订单号","decorationOrder.orderId"],
				 ['楼盘地址',['decorationOrder.village.villageName', 'decorationOrder.houseNumber']],
				 ['客户','decorationOrder.customer.customerName'],
				 ['设计师','decorationOrder.designer'],
				 ['设计部','decorationOrder.designDepartment'],
				 ['应收金额', 'advanceMoney'],
				 ['服务费', 'serviceMoney'],
				 ['收款人', 'collecter.currentName'],
				 ['收款时间', 'collcetTime'],
				 ['状态', 'status == "1" ? "已收款" : ""'],
				 ['备注', 'des'],
				 ['现金', 'serviceReceipt.cash'],
				 ['银行', ['serviceReceipt.bank', 'serviceReceipt.bankInfo']],
				 ['转账', ['serviceReceipt.checkv', 'serviceReceipt.checkvBank']],
				 ['分期', ['serviceReceipt.installment', 'serviceReceipt.installBank']],
				 ['对公', ['serviceReceipt.accounts', 'serviceReceipt.accountsBank']],
				 ],
				 	list: res.paging.data,
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
				 v.serviceReceipt.checkvBank = v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? servicePayment.checkBankInfo[v.serviceReceipt.checkvBank] : '';
				 v.serviceReceipt.installBank = v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? servicePayment.bankInfo[v.serviceReceipt.installBank] : '';
				 v.serviceReceipt.accountsBank = v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? servicePayment.accountsInfo[v.serviceReceipt.accountsBank] : '';
			 });
		 });
	 });

	function initBaseModal(){

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

			//$(_divId).addClass("hide");
			$(_checkboxId).removeAttr("checked").removeAttr("disabled");

			$(_inputId).val("");

			if(_name == "bank"){
				$("#bankDivGroup").html("");
				$("#bankAdd").attr("num", 0);
			}
		}

		$("#collectDes").val("");
        $("#referMoney").removeAttr("readonly");
	}

	//收款弹窗
	function dialogPayment(v){

        com.cleanItems(servicePayment.items);

		initBaseModal();
        if(servicePayment.baseModal.attr("ChargeType")==1){
			$("#myModalLabel").text("付款信息");
			$("#collectBtn").text("收款");
			$("#serviceMoney").css("display","none");
            $("#referMoney").val("");
            $("#collectDes").val("");
        }else if(servicePayment.baseModal.attr("ChargeType")==2){
			$("#myModalLabel").text("付款信息");
			$("#collectBtn").text("收款");
			$("#serviceMoney").css("display","block");
			$("#sMoney").val(v.servicePrice - v.servicePaidup);
			$("#sMoney").attr("readonly","readonly");
			$("#referMoney").val("");
			$("#collectDes").val("");
        }else if(servicePayment.baseModal.attr("ChargeType")==3){
            $("#myModalLabel").text("退款信息");
            $("#collectBtn").text("退款");
			$("#serviceMoney").css("display","none");
            $("#referMoney").val(v.servicePaidup);
            $("#referMoney").attr("readonly","readonly");
			$("#collectDes").val("");
        }

		servicePayment.baseModal.modal("show");

		servicePayment.moreMsg[0]=$.extend({},v);

	}

	$("#collectBtn").bindClick(payment);

    //收款触发事件
	function payment(){
		var v = servicePayment.moreMsg[0];

		var referMoney = $("#referMoney").val();
		var des = $("#collectDes").val();

        var cash = $("#cash").val();
        var cashbInfo = $("#cashInfo").val();

        var bankAdd = $("#bankAdd");
        var _bank = 0;
        var _bankInfo = "#";
        var num = parseInt(bankAdd.attr("num"));
        for (var j = 0; j < num; j++) {
            var index = j + 1;
            var bankName = $("#bankName_" + index).val();
            var bankMoney = $("#bank_" + index).val();
            var bankDate = $("#bankDate_" + index).val();
            var bankTime = $("#bankTime_" + index).val();

            _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

            _bank = utils.accAdd(parseFloat(bankMoney), _bank);
        }

        var bank = _bank;
        var bankInfo = _bankInfo;
        var checkv = $("#checkv").val();
        var checkvBank = $("#checkvBankName").val();
        var installment = $("#installment").val();
        var installmentBank = $("#installmentBankName").val();
        var accounts = $("#accounts").val();
        var accountsBank = $("#accountsBankName").val();

        //累计叠加金额,与总金额对比是否相等
        var realMoney = parseFloat(cash != "" ? cash : 0) + parseFloat(bank != "" ? bank : 0) + parseFloat(checkv != "" ? checkv : 0) + parseFloat(installment != "" ? installment : 0) + parseFloat(accounts != "" ? accounts : 0);

        if (referMoney != realMoney) {
            com.showAlert(com.error, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

		if(servicePayment.baseModal.attr("ChargeType")==2) {
			var sMoney = $("#sMoney").val();
			if (realMoney > sMoney) {
				com.showAlert(com.error, "当前所收服务费多于剩余服务费,不能收款!");
				return false;
			}
		}

		var option = {

			"servicePayment.decorationOrder.orderId" : v.decorationOrder.orderId,
			"servicePayment.referMoney" : referMoney,
			"servicePayment.des" : des,

            "serviceReceipt.cash" : cash,
            "serviceReceipt.cashInfo" : cashbInfo,
            "serviceReceipt.bank" : bank,
            "serviceReceipt.bankInfo" : bankInfo,
            "serviceReceipt.checkv" : checkv,
            "serviceReceipt.checkvBank" : checkvBank,
            "serviceReceipt.installment" : installment,
            "serviceReceipt.installBank" : installmentBank,
            "serviceReceipt.accounts" : accounts,
            "serviceReceipt.accountsBank" : accountsBank,
			"serviceReceipt.des" : des,

            "advanceReceipt.cash" : cash,
            "advanceReceipt.cashInfo" : cashbInfo,
            "advanceReceipt.bank" : bank,
            "advanceReceipt.bankInfo" : bankInfo,
            "advanceReceipt.checkv" : checkv,
            "advanceReceipt.checkvBankName" : checkvBank,
            "advanceReceipt.installment" : installment,
            "advanceReceipt.installmentBankName" : installmentBank,
            "advanceReceipt.accounts" : accounts,
            "advanceReceipt.accountsBankName" : accountsBank,
			"advanceReceipt.des" : des,

		};

		var option2 = {

			"servicePayment.decorationOrder.orderId" : v.decorationOrder.orderId,
			"servicePayment.referMoney" : referMoney,
			"servicePayment.des" : des,

			"serviceReceipt.cash" : cash,
			"serviceReceipt.cashInfo" : cashbInfo,
			"serviceReceipt.bank" : bank,
			"serviceReceipt.bankInfo" : bankInfo,
			"serviceReceipt.checkv" : checkv,
			"serviceReceipt.checkvBank" : checkvBank,
			"serviceReceipt.installment" : installment,
			"serviceReceipt.installBank" : installmentBank,
			"serviceReceipt.accounts" : accounts,
			"serviceReceipt.accountsBank" : accountsBank,
			"serviceReceipt.des" : des,

		};

		//应收款验证只能输入数字
		var reg = /^[0-9]*$/;
		if(reg.test($("#referMoney").val()) != true){
			com.showAlert(com.error, "应收款只能为数字");
			return false;
		}
		if($("#referMoney").val() == null || $("#referMoney").val() == ""){
            com.showAlert(com.error, "应收款不能为空");
            return false;
        }

		if(servicePayment.baseModal.attr("ChargeType")==1){
			com.post(api.payment.collectServicePayment, option, function () {
				searcher.doSearch();
				com.showAlert(com.info, "收款成功");
				servicePayment.baseModal.modal("hide");
			}, function () {
				searcher.doSearch();
				com.showAlert(com.error, "收款失败");
				servicePayment.baseModal.modal("hide");
			});
		}else if(servicePayment.baseModal.attr("ChargeType")==2){
			com.post(api.payment.collectServicePaymentForService, option2, function () {
				searcher.doSearch();
				com.showAlert(com.info, "收款成功");
				servicePayment.baseModal.modal("hide");
			}, function () {
				searcher.doSearch();
				com.showAlert(com.error, "收款失败");
				servicePayment.baseModal.modal("hide");
			});
		}else if(servicePayment.baseModal.attr("ChargeType")==3){
            com.post(api.payment.refundServicePaymentForService, option2, function () {
                searcher.doSearch();
                com.showAlert(com.info, "退款成功");
                servicePayment.baseModal.modal("hide");
            }, function () {
                searcher.doSearch();
                com.showAlert(com.error, "退款失败");
                servicePayment.baseModal.modal("hide");
            });
        }



	}

	//添加银行卡
	function addBankDiv(index){

		var d = new Date();
		var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

		var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));

		var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
		var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(servicePayment.bank, 'key', 'name').appendTo(bankNameDiv);
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
		var bankMoneyInput = $('<input></input>').addClass("col-sm-6 v_required v_price").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_"+index).appendTo(bankMoneyDiv);

		var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDiv);
		var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankDateInput = $('<input></input>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);

		var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankDiv);
		var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
		var bankTimeInput =  $('<input></input>').addClass('col-sm-6 v_time v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);

	}

	$("#history").removeClass("active");
});

