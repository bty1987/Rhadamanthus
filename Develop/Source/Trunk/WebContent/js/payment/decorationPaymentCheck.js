var decorationPaymentCheck = {
	saveBtn: null,
	cancellBtn: null,
	
	baseModal: null,
	refundModal:null,
	decorationPaymentCheckItems: {},
	
	editFlg:false,
	
	editFlag:0
};

jQuery(function($) {
	
	com.post(api.common.queryReceiptType, {}, function(res){
		
		decorationPaymentCheck.cashInfo = {};
		decorationPaymentCheck.bankInfo = {};
		decorationPaymentCheck.checkBankInfo = {};
		decorationPaymentCheck.accountsInfo = {};
		decorationPaymentCheck.couponTypeData = {};
		
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				decorationPaymentCheck.cashInfo[v.key] = v.name;
			}else if(v.type == 2){
				decorationPaymentCheck.bankInfo[v.key] = v.name;
			}else if(v.type == 3){
				decorationPaymentCheck.checkBankInfo[v.key] = v.name;
			}else if(v.type == 4){
				decorationPaymentCheck.accountsInfo[v.key] = v.name;
			}else if(v.type == 5){
				decorationPaymentCheck.couponTypeData[v.key] = [v.key, v.name];
			}
		});
	}, null, false);

	decorationPaymentCheck.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#advancePayment", true);
	});
	
	decorationPaymentCheck.refundModal = $("#refundModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	
	decorationPaymentCheck.refundModal = $("#refundModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});
	
	decorationPaymentCheck.addOrReduceDetailModal=$("#addOrReduceDetailModal");
	
	$("#decorationPaymentHistoryList").removeClass("active");
	
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
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
               ["订单号:", v.orderId, "grey"],
               ["楼盘地址:", v.village + ''+v.houseNumber, "grey"],
               ["客户:", v.customer, "grey"],
               ["设计师:", v.designer, "grey"],
               ["设计部:", v.designerDepartment, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collectUser, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus, "red"],
               ["备注:", v.des, "grey"],
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "dpIds",
				"class": "ace ace-checkbox-2",
				"dpId": v.autoId,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.paymentType);
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            $label.append($input).append($span).appendTo($h3);
            
            var styleArr = [];
			
			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo){
				  var info = bank + ", ";
				  var _s = bankInfo.split('#');
				  for(var i=1;i<_s.length-1;i++){
				    var _i = _s[i].split('|');
				    info += decorationPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
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
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["orderId", "designer", "village", "houseNumber", "collectTimeDateRange"], "condList", api.payment.pageDecorationPaymentForCollect, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationPaymentCheckPostData", null, false, null, function(){
		
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.paymentType));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
               ["订单号:", v.orderId, "grey"],
               ["楼盘地址:", v.village + ''+v.houseNumber, "grey"],
               ["客户:", v.customer, "grey"],
               ["设计师:", v.designer, "grey"],
               ["设计部:", v.designerDepartment, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collectUser, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus, "red"],
               ["备注:", v.des, "grey"],
            ];
            
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
				    info += decorationPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
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
           
            $liLine.append($h3).append($ulProperty).append($ulStyle);
            
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
	
	hsearcher.init(["orderId", "designer", "village", "houseNumber", "collectTimeDateRange"], "hcondList", api.payment.pageDecorationPaymentForConfirm, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hdecorationPaymentCheckPostData", null, false, null, null, "hresultList");
	
	$('a[name="confirms"]', '#pagenation').click(function(){
		
		bootbox.confirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			if(result) {
				
				var options = {};
				var $inputs = $('input[name="dpIds"]:checked');
				
				$.each($inputs, function(i, v){
					options["paymentIds["+i+"]"] = $(v).attr('dpId');
				});
				
				com.post(api.payment.confirmDecorationPayment, options, function(res){
					searcher.doSearch();
					hsearcher.doSearch();
				});
			}
		});
	});
	
	$('a[name="import"]', '#pagenation').click(function () {
    	
    	if($('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
    	
    	if($('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		
		com.post(api.payment.pageDecorationPaymentForCollect, $.extend({}, params.decorationPaymentCheckPostData, {"paging.noPage": 1}), function(res){
			
			$.exceler({
				column : [
					["订单号","orderId"],
					['楼盘地址',['village', 'houseNumber']],
					['客户','customer'],
					['设计师','designer'],
					['设计部','designerDepartment'],
					['应收金额', 'referMoney'],
					['收款人', 'collectUser'],
					['收款时间', 'collectTime'],
					['类型', 'paymentType'],
					['状态', 'paymentStatus'],
					['备注', 'des'],
					['现金', 'cash'],
					['银行', ['bank', 'bankInfo']],
					['转账', ['checkv', 'checkvBankName']],
					['分期', ['installment', 'installmentBankName']],
					['对公', ['accounts', 'accountsBankName']],
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
					    $info += decorationPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
					  }
					  
					  v.bankInfo = $info;
				}
				
				v.checkvBankName = v.checkv != null && v.checkv != "0" ? decorationPaymentCheck.checkBankInfo[v.checkvBankName] : '';
				v.installmentBankName = v.installment != null && v.installment != "0" ? decorationPaymentCheck.bankInfo[v.installmentBankName] : '';
				v.accountsBankName = v.accounts != null && v.accounts != "0" ? decorationPaymentCheck.accountsInfo[v.accountsBankName] : '';
			});
		});
    });
	
});

