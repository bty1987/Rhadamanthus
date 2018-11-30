
jQuery(function($) {
	var servicePaymentCheck = {};

	com.focusPage("#servicePaymentHistoryList").removeClass("active");

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == "0" ? "收款" : (v.type == "1" ? "退款" : "")));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

			var propertyArr = [
				["订单号:", v.decoration.orderId, "blue"],
				["楼盘地址:", v.decoration.house.village.name + ''+v.decoration.house.houseNumber, "grey"],
				["客户:", v.decoration.customer.name, "grey"],
				["设计师:", v.decoration.designer.currentName, "grey"],
				["设计部:", v.decoration.designer.dept.name, "grey"],
				["预付款金额:", v.advanceMoney, "blue"],
				["服务费:", v.serviceMoney, "blue"],
				["收款人:", v.serviceReceipt.collecter.currentName, "grey"],
				["收款时间:", v.serviceReceipt.collectTime, "green"],
				["状态:", v.status == "1" ? "已付款" : "", "red"],
				["备注:", v.comment, "grey"]
			];

			var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "spids",
				"class": "ace ace-checkbox-2",
				"spId": v.spid
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
				com.focusPage('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		};
	})();
	
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
				servicePaymentCheck.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				servicePaymentCheck.bank.push(v);
				servicePaymentCheck.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				servicePaymentCheck.checkBank.push(v);
				servicePaymentCheck.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				servicePaymentCheck.accounts.push(v);
				servicePaymentCheck.accountsInfo[v.no] = v.name;
			}
		});
	}, null, false);

	var searcher = new Searcher();

	searcher.init(["orderId", "paymentDesigner", "paymentVillage", "collectTimeDateRange"], "condList", api.payment.pageServicePaymentForCollect, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "pageServicePaymentForCollectPostData", null, false, null, function(){
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('批量确认').appendTo($adda);

		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		return [$adda, $impa];
	},"resultList");

	com.focusPage('a[name="import"]', '#pagenation').click(function () {
		if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

		if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}

		com.post(api.payment.pageServicePaymentForCollect, $.extend({}, params.pageServicePaymentForCollectPostData, {"paging.noPage": 1}), function(res){
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
					['状态', 'status == "1" ? "已付款" : ""'],
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
						$info += servicePaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
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
							$checkvInfo += servicePaymentCheck.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.serviceReceipt.checkvBank = $checkvInfo;
					}else{
						v.serviceReceipt.checkvBank = v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? servicePaymentCheck.checkBankInfo[v.serviceReceipt.checkvBank] : '';
					}
				}

				v.serviceReceipt.installBank = v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? servicePaymentCheck.bankInfo[v.serviceReceipt.installBank] : '';
				v.serviceReceipt.accountsBank = v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? servicePaymentCheck.accountsInfo[v.serviceReceipt.accountsBank] : '';
			});
		});
	});

	//服务款已确认信息查询
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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == "0" ? "收款" : (v.type == "1" ? "退款" : "")));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			var $btnPrint = $('<a></a>').addClass('btn btn-minier');

			var propertyArr = [
				["订单号:", v.decoration.orderId, "blue"],
				["楼盘地址:", v.decoration.house.village.name + ''+v.decoration.house.houseNumber, "grey"],
				["客户:", v.decoration.customer.name, "grey"],
				["设计师:", v.decoration.designer.currentName, "grey"],
				["设计部:", v.decoration.designer.dept.name, "grey"],
				["预付款金额:", v.advanceMoney, "blue"],
				["服务费:", v.serviceMoney, "blue"],
				["收款人:", v.serviceReceipt.collecter.currentName, "grey"],
				["收款时间:", v.serviceReceipt.collectTime, "green"],
				["确认人:", v.serviceReceipt.confirmer.currentName, "grey"],
				["确认时间:", v.serviceReceipt.confirmTime, "green"],
				["状态:", v.status == "2" ? "已确认" : "", "red"],
				["备注:", v.comment, "grey"]
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
				com.focusPage('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		};
	})();

	//查询服务款已确认信息
	var hsearcher = new Searcher();

	hsearcher.init(["orderId", "paymentDesigner", "paymentVillage", "collectTimeDateRange"], "hcondList", api.payment.pageServicePaymentForConfirm, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "servicePaymentForConfirmPostData", null, false, null, function(){}, "hresultList");

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

		bootbox.confirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			if(result) {
				com.post(api.payment.confirmServicePayment, options, function(res){
					searcher.doSearch();
				});
			}
		});
	});

	com.focusPage('a[name="import"]', '#pagenation').click(function () {
		if (com.focusPage('span[name="totalRecords"]').text() == 0) {
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

		if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
	});
});