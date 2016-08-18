var paymentCheck = {
	postParams: {"paging.rows":10, "paging.page":1},
};

jQuery(function($) {
	
	com.post(api.common.queryReceiptType, {}, function(res){
		
		paymentCheck.cash = [];
		paymentCheck.bank = [];
		paymentCheck.checkBank = [];
		paymentCheck.accounts = [];
		paymentCheck.bankInfo = {};
		
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				paymentCheck.cash.push(v);
			}else if(v.type == 2){
				paymentCheck.bank.push(v);
				paymentCheck.bankInfo[v.key] = v.name;
			}else if(v.type == 3){
				paymentCheck.checkBank.push(v);
			}else if(v.type == 4){
				paymentCheck.accounts.push(v);
			}
		});
	}, null, false);
	
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
               ["客户:", v.customer.customerName, "grey"],
               ["收款类型:", v.type, "grey"],
               ["预付款类型:", v.paymentType, "grey"],
               ["操作金额:", v.recharge, "blue"],
               ["余额:", v.balance, "blue"],
               ["收款人:", v.collectUser.userName, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.status, "red"],
               ["备注:", v.des, "grey"],
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "pIds",
				"class": "ace ace-checkbox-2",
				"pId": v.paymentId,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.customer.customerId);
            
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
				    info += paymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
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
	
	searcher.init(["orderId", "customerId", "customerPhone", "village", "houseNumber", "designer", "collectTimeDateRange"], "condList", api.payment.pagePaymentForHistory, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "paymentCheckCheckPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('批量确认').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="confirms"]', '#pagenation').click(function(){
		
		bootbox.confirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			if(result) {
				
				var options = {};
				var $inputs = $('input[name="pIds"]:checked');
				
				$.each($inputs, function(i, v){
					options["paymentIds["+i+"]"] = $(v).attr('pId');
				});
				
				com.post(api.payment.confirmPayment, options, function(res){
					searcher.doSearch();
				});
			}
		});
	});
	
});
