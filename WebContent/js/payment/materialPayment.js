var materialPayment = {

	paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"],

	materialPaymentTypeData: {},
	materialPaymentRevTypeData: {},

	couponType: {},
	couponTypeData: {},

	customerId: null,

	bankDataList: [],

	saveBtn: null,
	cancelBtn: null,

	baseModal: null,
	refundModal: null,
	materialPaymentItems: {},

	items: {},

	editFlg: false,
	historyFlag: false,
	batchFlag: true,

	queryUrl: null,

	validator: {
		price: {
			type: "v_price",
			regex: /^[0-9]+\.{0,1}[0-9]{0,2}$/g,
			errorMsg: "价格内容输入错误."
		},
	},
};

var materialPaymentPostData = {};

jQuery(function($) {

	materialPayment.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	materialPayment.saveBtn = $("#saveBtn").bindClick(payment);
	materialPayment.saveBtn = $("#saveRefundBtn").bindClick(refund);
	materialPayment.cancelBtn = $("#cancelBtn").on("click", function(){
		materialPayment.historyFlag = false;
	});

	materialPayment.refundModal = $("#refundModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});

    materialPayment.items.cashCheckbox = $("#cashCheckbox");
    materialPayment.items.bankCheckbox = $("#bankCheckbox");
    materialPayment.items.checkvCheckbox = $("#checkvCheckbox");
    materialPayment.items.installmentCheckbox = $("#installmentCheckbox");
    materialPayment.items.accountsCheckbox = $("#accountsCheckbox");
    materialPayment.items.couponCheckbox = $("#couponCheckbox");
    materialPayment.items.advanceCheckbox = $("#advanceCheckbox");
	materialPayment.items.couponType = $("#couponType");

	com.post(api.common.queryReceiptType, {}, function(res){

		materialPayment.cash = [];
		materialPayment.bank = [];
		materialPayment.checkBank = [];
		materialPayment.accounts = [];
		materialPayment.couponType = [];

		materialPayment.cashInfo = {};
		materialPayment.bankInfo = {};
		materialPayment.checkBankInfo = {};
		materialPayment.accountsInfo = {};
		materialPayment.couponTypeData = {};

		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				materialPayment.cash.push(v);
				materialPayment.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				materialPayment.bank.push(v);
				materialPayment.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				materialPayment.checkBank.push(v);
				materialPayment.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				materialPayment.accounts.push(v);
				materialPayment.accountsInfo[v.no] = v.name;
			}else if(v.type == 5){
				materialPayment.couponType.push(v);
				materialPayment.couponTypeData[v.no] = [v.no, v.name];
			}
		});

		$("#cashInfo").bindData(materialPayment.cash, 'no', 'name');
		$("#refundCashInfo").bindData(materialPayment.cash, 'no', 'name');

		$("#installmentBank").bindData(materialPayment.bank, 'no', 'name');
		$("#refundBank").bindData(materialPayment.bank, 'no', 'name');

		$("#checkvBank").bindData(materialPayment.checkBank, 'no', 'name');

		$("#accountsBank").bindData(materialPayment.accounts, 'no', 'name');

		$("#couponType").bindData(materialPayment.couponType, 'no', 'name');
		$("#couponType").trigger("chosen:updated");

		$("#refundCouponType").bindData(materialPayment.couponType, 'no', 'name');
		$("#refundCouponType").trigger("chosen:updated");
	}, null, false);

	$.extend(com.validator, materialPayment.validator);

	$("#history").removeClass("active");

    $("#baseItemModal :checkbox").on("change", function(){
        $(this).prop("checked") ? $("[referCheckbox="+this.id+"]").show()  : $("[referCheckbox="+this.id+"]").hide()
    });

	com.post(api.ds.payment, {}, function(res){
		$("#advanceType").bindData(res.advanceType, 'key', 'value');

		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialPayment.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialPayment.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}
	}, null, false);

	$("#couponType").chosen({width: "216px", multi_type: "input"});
	$("#refundCouponType").chosen({width: "216px", multi_type: "input"});

	$("#bankAdd").click(function(){

		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;

		addBankDiv(nextNum);
		$(this).attr("num", nextNum);

		return false;
	});

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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier');

            var propertyArr = [
               ["订单号:",  v.material.orderId, "grey"],
               ["主材号:", v.material.no, "grey"],
               ["楼盘地址:", v.material.house.village.name +''+ v.material.house.houseNumber, "grey"],
               ["客户:", v.material.customer.name, "grey"],
               ["品牌:", v.brand, "grey"],
               ["操作人:", v.creater.currentName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            var propertyArr = [
               ["订单号:", v.material.orderId, "grey"],
               ["主材号:", v.material.no, "grey"],
               ["楼盘地址:", v.material.house.village.name +''+ v.material.house.houseNumber, "grey"],
               ["客户:", v.material.customer.name, "grey"],
               ["品牌:", v.brand, "grey"],
               ["操作人:", v.creater.currentName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collecter.currentName, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus == 1 ? '待确认' : '已确认', "red"],
               ["备注:", v.comment, "grey"],
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
				"paymentType": v.paymentType,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl');

            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var styleArr = [];

			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo){
				  var info = bank + ", ";
				  var _s = bankInfo.split('#');
				  for(var i=1;i<_s.length-1;i++){
				    var _i = _s[i].split('|');
				    info += materialPayment.bankInfo[_i[0]] + " " + _i[1] + ", ";
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

			$label.append($input).append($span);
			$h3.append($('<small></small>').addClass('blue').html(materialPayment.materialPaymentTypeData[v.paymentType]));

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $liLine.append($h3).append($ulProperty).append($ulStyle);

			var mrId = v.mrId;

			$btnPrint.click(function(){
				if(v.collecter.userId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配，不能打印");
					return false;
				}else{
					params.mrId = mrId;
					params.decorationOrderMOrderId = v.material.orderId;
					params.decorationReceiptDrId = v.drId;
					com.popup("专用收款收据__订单编号：" + v.material.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true)
				}

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

	$('a[name="showTotal"]', '#pagenation').click(function(){

		var $total = 0;

		var $inputs = $('input[name="mpIds"]:checked');

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

	$('a[name="collects"]', '#pagenation').click(function(){

		com.cleanItems(materialPayment.items);

		$("#des").val("");

		$("#saveBtn").removeClass("hide");
		$("#saveRefundBtn").addClass("hide");

		var $inputs = $('input[name="mpIds"]:checked');

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
				"mpId": $input.attr("mpid"),
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
				$("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
				$("#zaterialAdvance").val(res.zaterialAdvance).attr("readonly", "readonly");
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

		$("#sumMoney").val(sumMoney);
		$("#sumMoneyShow").html(sumMoney);

		if(_paymentTypeFlag != 0){
			_paymentTypeFlag != 1 ? _paymentTypeFlag != 2 ? com.showAlert(com.warning, "批量收款只能选择相同类型的收款项") : com.showAlert(com.warning, "批量收款只能选择相同类型的收款项") : com.showAlert(com.warning, "批量收款不支持不同订单间的操作");
			return false;
		}

		if(sumMoney >= 0){
			initBaseModal();

			$("#referMoney").val(sumMoney).attr("disabled", "disabled");
			$("#couponCheckbox").attr("disabled", "disabled");

			materialPayment.baseModal.modal("show");
		}else{
			com.showAlert(com.warning, "退款不支持批量操作!");
		}
    });

	$('a[name="import"]', '#hpagenation').click(function () {

    	if($('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

    	if($('span[name="totalRecords"]').text() > 1000){
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
					['券', ['coupon', 'couponInfo']],
				],
				list: res.paging.data,
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

				v.checkvBank = v.checkv != null && v.checkv != "0" ? materialPayment.checkBankInfo[v.checkvBank] : '';
				v.installmentBank = v.installment != null && v.installment != "0" ? materialPayment.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? materialPayment.accountsInfo[v.accountsBank] : '';

				v.paymentType = materialPayment.materialPaymentTypeData[v.paymentType];
				v.paymentStatus = v.paymentStatus == 1 ? '待确认' : '已确认';
			});
		});
    });

	function dialogPayment(payment){

        com.cleanItems(materialPayment.items);

		materialPaymentPostData.orderId = payment.material.orderId;
		materialPaymentPostData.customerId = payment.material.customer.cid;

		if([1, 2, 3].indexOf(payment.paymentType) != -1){
			initBaseModal();
			$("#des").val("");
			$("#myModalLabel").text("付款信息");
			$("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
            $('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
			$("#saveBtn").removeClass("hide");
			$("#saveRefundBtn").addClass("hide");

		}else if([4, 5, 6, 7].indexOf(payment.paymentType) != -1){
			initBaseModal();
			$("#des").val("");
			$("#myModalLabel").text("退款信息");
			$("#referMoney").val(payment.referMoney).attr("disabled", "disabled");
			$('#advanceCheckbox').parents('.inline').css('cssText','display:none!important');
			$("#saveBtn").addClass("hide");
			$("#saveRefundBtn").removeClass("hide");
		}

        com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": materialPaymentPostData.customerId},function(res){
            $("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
            $("#zaterialAdvance").val(res.zaterialAdvance).attr("readonly", "readonly");
        },null,false);

		materialPaymentPostData.paymentInfo = [payment];

		materialPayment.editFlg =  false;
	}

	function initBaseModal(){

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

			$(_checkboxId).removeAttr("checked").removeAttr("disabled");

			$(_inputId).val("");
			$(_selectId).val("");

			if(_name == "coupon"){
				$("#couponType").chosen("destroy");
				$("#couponType").chosen({width: "216px", multi_type: "input"});
				$("#couponType").bindData(materialPayment.couponType, 'no', 'name');
				$("#couponType").trigger("chosen:updated");
			}else if(_name == "bank"){
				$("#bankDivGroup").html("");
				$("#bankAdd").attr("num", 0);
			}
		}

		$("des").val("");

		$("#checkvBank option:first").prop("selected", 'selected');
		$("#installmentBank option:first").prop("selected", 'selected');
		$("#accountsBank option:first").prop("selected", 'selected');

		materialPayment.items.couponType.chosen("destroy");
		materialPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
		materialPayment.items.couponType.bindData(materialPayment.couponType, 'no', 'name');
		materialPayment.items.couponType.trigger("chosen:updated");

		materialPayment.baseModal.modal("show");
	}

	function addBankDiv(index){

		var d = new Date();
		var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

		var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));

		var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
		var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(materialPayment.bank, 'no', 'name').appendTo(bankNameDiv);
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
		var bankMoneyInput = $('<input></input>').addClass("col-sm-6 v_required v_float").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_"+index).appendTo(bankMoneyDiv);

		var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDiv);
		var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankDateInput = $('<input></input>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);

		var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankDiv);
		var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
		var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
		var bankTimeInput =  $('<input></input>').addClass('col-sm-6 v_time v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);

	}

	function payment(){

		if(com.validate()){
			return;
		}

		var url = "";
		var options = {};
		var args = {};
		var referPayment = $("#referMoney").val();
		var realPayment = 0;
		var couponCount = 0;

		var resMrIdIndex = "";

		var mpIds = "";
		var _paymentInfo = "#paymentInfo";

		$(_paymentInfo).text("");

		for(var i=0;i<materialPayment.paymentModelNameData.length;i++){

			var _paymentName = materialPayment.paymentModelNameData[i];
			var _checkboxId = "#" + _paymentName + "Checkbox";
			var _inputId = _paymentName;
			var _selectId = "";

			 if(_paymentName == "coupon" || _paymentName == "advance"){
				_selectId = _paymentName + "Type";
			 }else if(_paymentName != "bank"){
				_selectId = _paymentName + "Bank";
			 }else{
				_selectId = _paymentName + "Name";
			 }

			$(_checkboxId).on("change", function(){
				$(_paymentInfo).text("");
			});

			$("#"+_selectId).on("change", function(){
				$(_paymentInfo).text("");
			});

			$("#"+_paymentName).on("keydown", function(){
				$(_paymentInfo).text("");
			});

			if($(_checkboxId).prop("checked")){

				var _payment = 0;

				if(_paymentName == "cash"){
					args["cash"] = $("#cash").val();
					args["cashInfo"] = $("#cashInfo").val();

					_payment = $("#cash").val();
				}else if(_paymentName == "bank"){
					var _bank = 0;
					var _bankInfo = "#";

					var bankAdd = $("#bankAdd");
					var num = parseInt(bankAdd.attr("num"));
					for(var j=0;j<num;j++){
						var index = j + 1;
						var bankName = $("#bankName_"+index).val();
						var bankMoney = $("#bank_"+index).val();
						var bankDate = $("#bankDate_"+index).val();
						var bankTime = $("#bankTime_"+index).val();

						_bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

						_bank = utils.accAdd(parseFloat(bankMoney), _bank);
					}

					args["bank"] = _bank;
					args["bankInfo"] = _bankInfo;

					_payment = _bank;
				}else if(_paymentName == "coupon"){
					var _coupon = 0;
					var _couponInfo = "#";

					$("[class='search-choice']", $("#couponType_chosen")).each(function(i, e){

						var _ = $(e);

						_couponVal = _.children('span').children('input').val();
						_coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
						_couponInfo += _.children('span').text() + ":" + _couponVal + "#";

						couponCount++;
					});

					args["coupon"] = _coupon;
					args["couponInfo"] = _couponInfo;

					_payment = _coupon;
				}else{
					args[_inputId] = $("#" + _inputId).val();
					_payment = $("#" + _inputId).val();
				}

				if($(_checkboxId).attr("select") == "1"){
					args[_selectId] = $("#" + _selectId).val();
				}

				realPayment = utils.accAdd(realPayment, parseFloat(_payment));
			}
		}

		if(referPayment != realPayment){
			com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
			return false;
		}

		if($("#advanceCheckbox").prop("checked")){
			var _advance = 0;
			var advanceType = $("#advanceType").val();

			if(advanceType == 1){
				_advance = parseFloat($("#materialAdvance").val());
			}else if(advanceType == 2){
				_advance = parseFloat($("#zaterialAdvance").val());
			}

			if(_advance > 0 && _advance < parseFloat($("#advance").val())){
				com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
				return false;
			}
		}

		if($.isEmptyObject(args)){
			com.showAlert(com.warning, "无收款方式信息");
			return false;
		}

		url = api.payment.collectMaterialPayments;

		$.each(materialPaymentPostData.paymentInfo, function(i, v){
			options["materialPayments["+i+"].mpId"] = v.mpId;
		});

		for(var arg in args){
			options["materialReceipt."+arg] = args[arg];
		}

		options["materialReceipt.comment"] = $("#des").val();

		resMrIdIndex = "materialReceipt";

		options["material.orderId"] = materialPaymentPostData.orderId;

		com.post(url, options, function(result){

			searcher.doSearch();

			materialPayment.historyFlag = false;

			var mrId = result.materialReceipt.mrId;

			bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
				if(result){
					params.mrId = mrId;
					params.decorationOrderMOrderId = materialPaymentPostData.orderId;
					com.popup("专用收款收据__订单编号:" + materialPaymentPostData.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true)
				}
			});
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
		var referPayment = $("#referMoney").val();
		var realPayment = 0;
		var couponCount = 0;
		var _paymentInfo = "#paymentInfo";

		$(_paymentInfo).text("");

		for(var i=0;i<materialPayment.paymentModelNameData.length;i++){

			var _paymentName = materialPayment.paymentModelNameData[i];
			var _checkboxId = "#" + _paymentName + "Checkbox";
			var _inputId = _paymentName;
			var _selectId = "";

			if(_paymentName == "coupon" || _paymentName == "advance"){
				_selectId = _paymentName + "Type";
			}else if(_paymentName != "bank"){
				_selectId = _paymentName + "Bank";
			}else{
				_selectId = _paymentName + "Name";
			}

			$(_checkboxId).on("change", function(){
				$(_paymentInfo).text("");
			});

			$("#"+_selectId).on("change", function(){
				$(_paymentInfo).text("");
			});

			$("#"+_paymentName).on("keydown", function(){
				$(_paymentInfo).text("");
			});

			if($(_checkboxId).prop("checked")){

				var _payment = 0;

				if(_paymentName == "cash"){
					args["cash"] = $("#cash").val();
					args["cashInfo"] = $("#cashInfo").val();

					_payment = $("#cash").val();
				}else if(_paymentName == "bank"){
					var _bank = 0;
					var _bankInfo = "#";

					var bankAdd = $("#bankAdd");
					var num = parseInt(bankAdd.attr("num"));
					for(var j=0;j<num;j++){
						var index = j + 1;
						var bankName = $("#bankName_"+index).val();
						var bankMoney = $("#bank_"+index).val();
						var bankDate = $("#bankDate_"+index).val();
						var bankTime = $("#bankTime_"+index).val();

						_bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

						_bank = utils.accAdd(parseFloat(bankMoney), _bank);
					}

					args["bank"] = _bank;
					args["bankInfo"] = _bankInfo;

					_payment = _bank;
				}else if(_paymentName == "coupon"){
					var _coupon = 0;
					var _couponInfo = "#";

					$("[class='search-choice']", $("#couponType_chosen")).each(function(i, e){

						var _ = $(e);

						_couponVal = _.children('span').children('input').val();
						_coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
						_couponInfo += _.children('span').text() + ":" + _couponVal + "#";

						couponCount++;
					});

					args["coupon"] = _coupon;
					args["couponInfo"] = _couponInfo;

					_payment = _coupon;
				}else{
					args[_inputId] = $("#" + _inputId).val();
					_payment = $("#" + _inputId).val();
				}

				if($(_checkboxId).attr("select") == "1"){
					args[_selectId] = $("#" + _selectId).val();
				}

				realPayment = utils.accAdd(realPayment, parseFloat(_payment));
			}
		}

		if(referPayment != realPayment){
			com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
			return false;
		}

		if($.isEmptyObject(args)){
			com.showAlert(com.warning, "无收款方式信息");
			return false;
		}

		url = api.payment.collectMaterialPaymentForRefund;

		var _info = materialPaymentPostData.paymentInfo[0];

		options["materialPayment.mpId"] = _info.mpId;
		options["materialPayment.msoId"] = _info.msoId;

		for(var arg in args){
			options["materialPayment."+arg] = args[arg];
		}

		options["materialPayment.comment"] = $("#des").val();

		options["material.orderId"] = materialPaymentPostData.orderId;

		com.post(url, options, function(res){

			searcher.doSearch();

			materialPayment.historyFlag = false;

			var mrId = res.materialPayment.mrId;

			bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
				if(result){
					params.mrId = mrId;
					params.decorationOrderMOrderId = materialPaymentPostData.orderId;
					com.popup("专用收款收据__订单编号:" + materialPaymentPostData.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true);
				}
			});
		});

		materialPayment.baseModal.modal("hide");

		materialPaymentPostData.paymentInfo = []
	}
});
