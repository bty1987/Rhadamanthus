var servicePaymentCheck = {


	paymentModelNameData: ["cash", "bank", "checkv", "installment", "accounts"],

	moreMsg:{},

	orderPaymentId:null,

	saveBtn: null,
	cancellBtn: null,

	baseModal: null,
	refundModal:null,
	decorationPaymentCheckItems: {},

	editFlg:false,

	bankList:null,
	accountsList: [],

	editFlag:0

};

$("#servicePaymentHistoryList").removeClass("active");

jQuery(function($) {

	//服务款未确认信息查询
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

			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == "0" ? "收款" : (v.type == "1" ? "退款" : "")));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

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

			var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "spids",
				"class": "ace ace-checkbox-2",
				"spId": v.spid,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150');

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$label.append($input).append($span).prependTo($h3);

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

	//查询付款银行信息
	com.post(api.common.queryReceiptType, {}, function(res){

		servicePaymentCheck.cash = [];
		servicePaymentCheck.bank = [];
		servicePaymentCheck.checkBank = [];
		servicePaymentCheck.accounts = [];

		servicePaymentCheck.cashInfo = {};
		servicePaymentCheck.bankInfo = {};
		servicePaymentCheck.checkBankInfo = {};
		servicePaymentCheck.accountsInfo = {};

		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				servicePaymentCheck.cash.push(v);
				servicePaymentCheck.cashInfo[v.key] = v.name;
			}else if(v.type == 2){
				servicePaymentCheck.bank.push(v);
				servicePaymentCheck.bankInfo[v.key] = v.name;
			}else if(v.type == 3){
				servicePaymentCheck.checkBank.push(v);
				servicePaymentCheck.checkBankInfo[v.key] = v.name;
			}else if(v.type == 4){
				servicePaymentCheck.accounts.push(v);
				servicePaymentCheck.accountsInfo[v.key] = v.name;
			}
		});

		$("#cashInfo").bindData(servicePaymentCheck.cash, 'key', 'name');

		$("#installmentBankName").bindData(servicePaymentCheck.bank, 'key', 'name');

		$("#checkvBankName").bindData(servicePaymentCheck.checkBank, 'key', 'name');

		$("#accountsBankName").bindData(servicePaymentCheck.accounts, 'key', 'name');
	}, null, false);

	//查询服务款未确认信息
	var searcher = new Searcher();

	searcher.init(["orderId", "designer", "village", "collectTimeDateRange"], "condList", api.payment.pageServicePaymentForCollect, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "pageServicePaymentForCollectData", null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('批量确认').appendTo($adda);

		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		return [$adda, $impa];
	},"resultList");

	$('a[name="import"]', '#pagenation').click(function () {

		if($('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

		if($('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}

		com.post(api.payment.pageServicePaymentForCollect, $.extend({}, params.pageServicePaymentForCollectData, {"paging.noPage": 1}), function(res){

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
						$info += servicePaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
					}

					v.serviceReceipt.bankInfo = $info;
				}
				v.serviceReceipt.checkvBank = v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? servicePaymentCheck.checkBankInfo[v.serviceReceipt.checkvBank] : '';
				v.serviceReceipt.installBank = v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? servicePaymentCheck.bankInfo[v.serviceReceipt.installBank] : '';
				v.serviceReceipt.accountsBank = v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? servicePaymentCheck.accountsInfo[v.serviceReceipt.accountsBank] : '';
			});
		});
	});

	//服务款已确认信息查询
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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == "0" ? "收款" : (v.type == "1" ? "退款" : "")));
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
				["确认人:", v.confirmerName, "grey"],
				["确认时间:", v.confirmTime, "grey"],
				["状态:", v.status == "2" ? "已确认" : "", "red"],
				["备注:", v.des, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});



			$btnPrint.text('打印').addClass("btn btn-minier btn-primary");

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

	//查询服务款已确认信息
	var hsearcher = new Searcher();

	hsearcher.init(["orderId", "designer", "village", "collectTimeDateRange"], "hcondList", api.payment.pageServicePaymentForConfirm, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "servicePaymentForConfirmPostData", null, false, null, function(){}, "hresultList");

	$('a[name="confirms"]', '#pagenation').click(function(){

		var options = {};
		var $inputs = $('input[name="spids"]:checked');

		$.each($inputs, function(i, v){
			options["spIds["+i+"]"] = $(v).attr('spid');
		});

		if($inputs.length == 0){
			com.showAlert(com.warning, "当前未选择要确认的服务款项信息");
			return false;
		}

		bootbox.confirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			if(result) {
				com.post(api.payment.confirmServicePayment, options, function(res){
					searcher.doSearch();
				});
			}
		});
	});

	$('a[name="import"]', '#pagenation').click(function () {

		if ($('span[name="totalRecords"]').text() == 0) {
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

		if ($('span[name="totalRecords"]').text() > 1000) {
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
	});

});