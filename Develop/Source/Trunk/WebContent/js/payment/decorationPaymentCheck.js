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
	decorationPaymentCheck.listDecorationPaymentGrid = $("#listDecorationPaymentGrid");
	decorationPaymentCheck.gridDecorationPaymentPager = "#gridDecorationPaymentPager";
	
	decorationPaymentCheck.listDecorationPaymentHistoryGrid = $("#listDecorationPaymentHistoryGrid");
	decorationPaymentCheck.gridDecorationPaymentHistoryPager = "#gridDecorationPaymentHistoryPager";
	
	com.post(api.ds.bankType, {}, function(res){
		decorationPaymentCheck.cashInfo = res.cashInfo;
		decorationPaymentCheck.bankInfo = res.bankInfo;
		decorationPaymentCheck.checkBankInfo = res.checkBankInfo;
		decorationPaymentCheck.accountsInfo = res.accountsInfo;
	});
	
	decorationPaymentCheck.baseModal = $("#baseItemModal").on('show.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#advancePayment", true);
	});
	
	decorationPaymentCheck.refundModal = $("#refundModal").on('show.bs.modal', function(e){
		com.clearValidator();
	});
	
	var searchOpts = {
		url: api.payment.pageDecorationPaymentForCollect,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: decorationPaymentCheck.listDecorationPaymentGrid,
		items: [
	        {label:"订单编号", id:"searchOrderId", name:"orderId", type:'text', op:"eq"},
	        {label:"楼盘", id:"searchVillage", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号", id:"searchHouseNum", name:"houseNumber", type:"text"},
	        {label:"设计师", id:"searchDesigner", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
		]
	};
	$("#searchDecorationPaymentDiv").flSearch(searchOpts);
	
	var searchHistoryOpts = {
		url: api.payment.pageDecorationPaymentForConfirm.url,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: decorationPaymentCheck.listDecorationPaymentHistoryGrid,
		items: [
	        {label:"订单编号", id:"searchOrderId", name:"orderId", type:'text', op:"eq"},
	        {label:"楼盘", id:"searchVillage", name:"village", type:"autoFillPinyinText", url:api.data.queryVillageForNameByPinyin},
	        {label:"楼号", id:"searchHouseNum", name:"houseNumber", type:"text"},
	        {label:"设计师", id:"searchDesigner", name:"designer", type:"autoFillPinyinText", url:api.personel.queryUserForNameByDuty, postData:{"duty":"设计师"}},
		]
	};
	$("#searchDecorationPaymentHistoryDiv").flSearch(searchHistoryOpts);
	
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
               ["应收金额:", v.referMoney, "grey"],
               ["收款人:", v.collectUser, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus, "red"],
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "dpIds",
				"class": "ace ace-checkbox-2",
				"dpId": v.autoId,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl');
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            $label.append($input).append($span).appendTo($h3);
			$h3.append($('<small></small>').addClass('blue').html(v.paymentType));
            
            var styleArr = [];
			
			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行卡:", v.bank, "grey"]) : true;
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
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css('margin-top', '7px').css('margin-right', '7px');
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
               ["应收金额:", v.referMoney, "red"],
               ["收款人:", v.collectUser, "grey"],
               ["收款时间:", v.collectTime, "grey"],
               ["状态:", v.paymentStatus, "red"],
            ];
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            var styleArr = [];
			
			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行卡:", v.bank, "grey"]) : true;
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
	}, "hpagenation", "hdecorationPaymentCheckPostData");
	
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
	
});

