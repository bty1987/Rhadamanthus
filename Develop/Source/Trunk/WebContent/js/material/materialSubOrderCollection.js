var materialSubOrderCollection = {
	
	materialPaymentTypeData: {"1":"预付款", "2":"定金", "3":"补款", "4":"退款", "5":"补款退款", "6":"券退款"},
	materialPaymentRevTypeData: {"预付款":"1", "定金":"2", "补款":"3", "退款":"4", "补款退款":"5", "券退款":"6"},
	
	bankType: {},
	couponType: {},
	accountsType:{},
	
	saveBtn: null,
	cancelBtn: null,
	
	baseModal: null,
	addOrReduceModal: null,
	refundModal: null,
	materialSubOrderCollectionItems: {},
	
	editFlg: false,
	historyFlag: false,
	batchFlag: true,
	
	queryUrl: null,
};

var materialSubOrderCollectionPostData = {};

jQuery(function($) {
	
	materialSubOrderCollectionPostData["materialPayment.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
	
	com.post(api.common.queryReceiptType, {}, function(res){
		
		materialSubOrderCollection.cash = [];
		materialSubOrderCollection.bank = [];
		materialSubOrderCollection.checkBank = [];
		materialSubOrderCollection.accounts = [];
		materialSubOrderCollection.couponType = [];
		
		$.each(res.receiptTypes, function(i, v){
			if(v.type == 1){
				materialSubOrderCollection.cash.push(v);
			}else if(v.type == 2){
				materialSubOrderCollection.bank.push(v);
			}else if(v.type == 3){
				materialSubOrderCollection.checkBank.push(v);
			}else if(v.type == 4){
				materialSubOrderCollection.accounts.push(v);
			}else if(v.type == 5){
				materialSubOrderCollection.couponType.push(v);
			}
		});
		
		$("#bankName").bindData(materialSubOrderCollection.bank, 'key', 'value');
		$("#checkvBankName").bindData(materialSubOrderCollection.bank, 'key', 'value');
		$("#installmentBankName").bindData(materialSubOrderCollection.bank, 'key', 'value');
		$("#accountsBankName").bindData(materialSubOrderCollection.bank, 'key', 'value');
		$("#refundBankName").bindData(materialSubOrderCollection.bank, 'key', 'value');
		$("#accountsBankName").bindData(materialSubOrderCollection.accounts, 'key', 'value');
		$("#couponType").bindData(materialSubOrderCollection.couponType, 'key', 'value');
	});
	
	com.post(api.ds.materialInfo, {}, function(res){
		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialSubOrderCollection.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialSubOrderCollection.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}
	});
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').html(materialSubOrderCollection.materialPaymentTypeData[v.paymentType]));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

					var propertyArr = [
					    ["编号:", v.msoNo, "grey"],
						["品类:", v.materialType, "grey"],
						["品牌:", v.materialBrand, "grey"],
						["应收额:", v.referMoney, "grey"],
						["实收额:", v.realMoney, "grey"],
						["收款时间:", v.collectTime, "grey"],
						["状态:", v.paymentStatus == 0 ? '待收款' : v.paymentStatus == 1 ? '待确认' : '已确认', "red"]
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
						    info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
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
					
					$liLine.append($h3).append($ulProperty).append($ulStyle).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		}
		
		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();
	
	var searcher = new Searcher();
	
	searcher.init([], "condList", api.payment.queryMaterialPaymentByMsoId, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", null, materialSubOrderCollectionPostData, true, "materialPayments");
	
	$('#back').click(function(){
		$(".tooltip").remove();
		$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
	});
	
});

