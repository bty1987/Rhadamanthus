var materialPaymentCheck = {
	
	saveBtn: null,
	cancellBtn: null,
	
	baseModal: null,
	addOrReduceModal:null,
	refundModal:null,
	materialPaymentCheckItems: {},
	
	materialPaymentTypeData: {},
	materialPaymentRevTypeData: {},
	
	ouponType: {},
	
	editFlg:false,
	queryUrl:null
	
};

jQuery(function($) {
	
	com.post(api.common.queryReceiptType, {}, function(res){
		
		materialPaymentCheck.cash = [];
		materialPaymentCheck.bank = [];
		materialPaymentCheck.checkBank = [];
		materialPaymentCheck.accounts = [];
		materialPaymentCheck.couponType = [];
		
		materialPaymentCheck.cashInfo = {};
		materialPaymentCheck.bankInfo = {};
		materialPaymentCheck.checkBankInfo = {};
		materialPaymentCheck.accountsInfo = {};
		materialPaymentCheck.couponTypeData = {};
		
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				materialPaymentCheck.cash.push(v);
				materialPaymentCheck.cashInfo[v.key] = v.name;
			}else if(v.type == 2){
				materialPaymentCheck.bank.push(v);
				materialPaymentCheck.bankInfo[v.key] = v.name;
			}else if(v.type == 3){
				materialPaymentCheck.checkBank.push(v);
				materialPaymentCheck.checkBankInfo[v.key] = v.name;
			}else if(v.type == 4){
				materialPaymentCheck.accounts.push(v);
				materialPaymentCheck.accountsInfo[v.key] = v.name;
			}else if(v.type == 5){
				materialPaymentCheck.couponType.push(v);
				materialPaymentCheck.couponTypeData[v.key] = [v.key, v.name];
			}
		});
	}, null, false);
	
	com.post(api.ds.materialInfo, {}, function(res){
		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialPaymentCheck.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialPaymentCheck.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}
	}, null, false);
	
	com.post(api.ds.couponType, {}, function(res){
		materialPaymentCheck.couponType = res.couponTypes;
		$("#couponType").bindData(res.couponTypes, 'key', 'value');
	});

	$("#materialPaymentHistoryList").removeClass("active");
	
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
               ["主材号:", v.msoNo, "grey"],
               ["楼盘地址:", v.orderAddr, "grey"],
               ["客户:", v.customerName, "grey"],
               ["品牌:", v.materialBrand, "grey"],
               ["操作人:", v.createUserName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collectUserName, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus == 1 ? '待确认' : '已确认', "red"],
               ["备注:", v.des, "grey"],
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "mpIds",
				"class": "ace ace-checkbox-2",
				"mpId": v.mpId,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(materialPaymentCheck.materialPaymentTypeData[v.paymentType]);
            
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
				    info += materialPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
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
            
            $label.append($input).append($span).appendTo($h3);
           
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
	
	var searcher = new Searcher();
	
	searcher.init(["orderId", "msoNo", "designer", "customerPhone", "orderAddr", "collectTimeDateRange"], "condList", api.payment.pageMaterialPaymentForCollectBySubOrder, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialPaymentCheckPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('批量确认').appendTo($adda);
    	
    	return [$adda];
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
               ["订单号:", v.orderId, "grey"],
               ["主材号:", v.msoNo, "grey"],
               ["楼盘地址:", v.orderAddr, "grey"],
               ["客户:", v.customerName, "grey"],
               ["品牌:", v.materialBrand, "grey"],
               ["操作人:", v.createUserName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collectUserName, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus == 1 ? '待确认' : '已确认', "red"],
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
				    info += materialPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", ";
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
			
			$h3.append($('<small></small>').addClass('blue').html(materialPaymentCheck.materialPaymentTypeData[v.paymentType]));
           
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
	
	hsearcher.init(["orderId", "msoNo", "designer", "customerPhone", "orderAddr", "collectTimeDateRange"], "hcondList", api.payment.pageMaterialPaymentForConfirmBySubOrder, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hmaterialPaymentCheckPostData", null, false, null, null, "hresultList");
	
	
	$('a[name="confirms"]', '#pagenation').click(function(){
		
		bootbox.confirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			if(result) {
				
				var options = {};
				
				var $inputs = $('input[name="mpIds"]:checked');
				
				$.each($inputs, function(i, v){
					var $input = $(v);
					
					options["mpIds["+i+"]"] = $input.attr('mpId');
				});
				
				com.post(api.payment.confirmMaterialPayment, options, function(res){
					searcher.doSearch();
					hsearcher.doSearch();
				});
			}
		});
		
	});
	
});
