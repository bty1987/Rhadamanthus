
jQuery(function($) {
	var payment = {
		typeData: [],
		paymentTypeData: [],
		statusData: []
	};

	var paymentCheck = {};

	com.post(api.common.queryReceiptType, {}, function(res){
		paymentCheck.cash = [];
		paymentCheck.bank = [];
		paymentCheck.checkBank = [];
		paymentCheck.accounts = [];

		paymentCheck.cashInfo = {};
		paymentCheck.bankInfo = {};
		paymentCheck.checkBankInfo = {};
		paymentCheck.accountsInfo = {};

		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				paymentCheck.cash.push(v);
				paymentCheck.cashInfo[v.no] = v.name;
			}else if(v.type == 2){
				paymentCheck.bank.push(v);
				paymentCheck.bankInfo[v.no] = v.name;
			}else if(v.type == 3){
				paymentCheck.checkBank.push(v);
				paymentCheck.checkBankInfo[v.no] = v.name;
			}else if(v.type == 4){
				paymentCheck.accounts.push(v);
				paymentCheck.accountsInfo[v.no] = v.name;
			}
		});
	}, null, false);

	com.focusPage("#paymentHistoryTab").removeClass("active");

	com.post(api.ds.payment, {}, function(res){
		$.each(res.type, function (i,v) {
			payment.typeData[v.key] = v.value;
		});

		$.each(res.paymentType, function (i,v) {
			payment.paymentTypeData[v.key] = v.value;
		});

		$.each(res.status, function (i,v) {
			payment.statusData[v.key] = v.value;
		});
	}, null, false);
	
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
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
               ["客户:", v.customer.name, "grey"],
               ["收款类型:", payment.typeData[v.type], "red"],
               ["预付款类型:", payment.paymentTypeData[v.paymentType], "red"],
               ["操作金额:", v.recharge, "blue"],
               ["余额:", v.balance, "blue"],
               ["收款人:", v.collectUser.currentName, "grey"],
               ["收款时间:", v.collectTime, "green"],
               ["状态:", payment.statusData[v.status], "red"],
               ["备注:", v.comment, "grey"]
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "pIds",
				"class": "ace ace-checkbox-2",
				"pId": v.pid
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.customer.no);
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            $label.append($input).append($span).appendTo($h3);
            
            var styleArr = [];
			
			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo){
				  var info = bank + ", ";
				  var _s = bankInfo.split('#');
				  for(var i=1;i<_s.length-1;i++){
				    var _i = _s[i].split('|');
				    info += paymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
				  }
				  
				  return info;
			})(v.bank, v.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "blue"]) : true;
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
        }
    })();
	
	var searcher = new Searcher();

	searcher.init(["orderId", "advancePaymentcollectTime"], "condList", api.payment.pagePaymentForCollect, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "paymentCheckCheckPostData", null, false, null, function(){
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('批量确认').appendTo($adda);

    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);

    	return [$adda, $impa];
	});

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.customer.no));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var propertyArr = [
				["客户:", v.customer.name, "grey"],
				["收款类型:", payment.typeData[v.type], "red"],
				["预付款类型:", payment.paymentTypeData[v.paymentType], "red"],
				["操作金额:", v.recharge, "blue"],
				["余额:", v.balance, "blue"],
				["收款人:", v.collectUser.currentName, "grey"],
				["收款时间:", v.collectTime, "green"],
				["确认人:", v.confirmUser.currentName, "grey"],
				["确认时间:", v.confirmTime, "green"],
				["状态:", payment.statusData[v.status], "red"],
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
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo){
				var info = bank + ", ";
				var _s = bankInfo.split('#');
				for(var i=1;i<_s.length-1;i++){
					var _i = _s[i].split('|');
					info += paymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
				}

				return info;
			})(v.bank, v.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "blue"]) : true;
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
		}
	})();

	var hsearcher = new Searcher();
	hsearcher.init(["orderId", "advancePaymentcollectTime"], "hcondList", api.payment.pagePaymentForConfirm, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hpaymentCheckCheckPostData", null, false, null, null, "hresultList");

	com.focusPage('a[name="confirms"]', '#pagenation').click(function(){
		var options = {};
		var $inputs = com.focusPage('input[name="pIds"]:checked');

		$.each($inputs, function(i, v){
			options["paymentIds["+i+"]"] = $(v).attr('pId');
		});

		if($inputs.length == 0){
			com.showAlert(com.warning, "当前未选择要确认的预付款项信息");
			return false;
		}
		
		bootbox.confirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			if(result) {
				com.post(api.payment.confirmPayment, options, function(res){
					searcher.doSearch();
				});
			}
		});
	});

	com.focusPage('a[name="import"]', '#pagenation').click(function () {
    	if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
    	
    	if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		
		com.post(api.payment.pagePaymentForCollect, $.extend({}, params.paymentCheckCheckPostData, {"paging.noPage": 1}), function(res){
			$.exceler({
				column : [
					["订单号","orderId"],
					['收款类型','type'],
					['预付款类型','paymentType'],
					['操作金额','balance'],
					['收款人', 'collectUser.currentName'],
					['收款时间', 'collectTime'],
					['状态', 'status'],
					['备注', 'comment'],
					['现金', 'cash'],
					['银行', ['bank', 'bankInfo']],
					['转账', ['checkv', 'checkvBank']],
					['分期', ['installment', 'installmentBank']],
					['对公', ['accounts', 'accountsBank']]
				],
				list: res.paging.data
			}, function(v){
				if(v.bank != null && v.bank != 0){
					var $info = ' ';
					var _s = v.bankInfo.split('#');
					for(var i=1;i<_s.length-1;i++){
						var _i = _s[i].split('|');
						$info += paymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
					}
					
					v.bankInfo = $info;
				}

				if(v.checkv != null && v.checkv != 0){
					var checkBankInfoStr = v.checkvBank;
					if(checkBankInfoStr.indexOf("#") != -1){
						var $checkvInfo = ' ';
						var _c = v.checkvBank.split('#');
						for(var i=1;i<_c.length-1;i++){
							var _i = _c[i].split('|');
							$checkvInfo += paymentCheck.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.checkvBank = $checkvInfo;
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? paymentCheck.checkBankInfo[v.checkvBank] : '';
					}
				}
				
				v.installmentBank = v.installment != null && v.installment != "0" ? paymentCheck.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? paymentCheck.accountsInfo[v.accountsBank] : '';
				v.type = v.type != null ? payment.typeData[v.type] : v.type;
				v.paymentType = v.paymentType != null ? payment.paymentTypeData[v.paymentType] : v.paymentType;
				v.status = v.status != null ? payment.statusData[v.status] : v.status;
			});
		});
    });
});
