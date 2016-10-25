var decorationOrderPostData = {};//页面跳转保存参数  跳转页面后  之前页面$(function()中定义的东西就没有了

$(function(){
	
	var decorationOrderAdvance = {
		items: {},
	};
	
	decorationOrderAdvance.items.customerName = $('#customerName');
	decorationOrderAdvance.items.phone = $('#phone');

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-primary').html('废单');
            var $btnSign = $('<a></a>').addClass('btn btn-minier').html('签订合同');
            var $btnTerminal = $('<a></a>').addClass('btn btn-minier btn-purple').html('合同终止');
            var $btnResign = $('<a></a>').addClass('btn btn-minier').html('重签合同');

            var propertyArr = [
                ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
                ["客户名:", v.customer.customerName, "grey"],
                ["余额:", v.customer.balance, "blue"],
                ["设计部:", v.designDepartment, "grey"],
                ["设计师:", v.designer, "grey"],
                ["业务部:", v.businessDepartment, "grey"],
                ["业务员:", v.salesman, "grey"],
                ["面积:", v.houseArea, "blue"],
                ["合同报价:", v.orderTotalPrice, "blue"],
                ["折扣:", v.discount, "blue"],
                ["量房时间:", v.createTime, "grey"],
                ["签单时间:", v.contractTime, "grey"],
                ["类型:", v.type == 0 ? '半包' : '全包', "red"],
                ["状态:", v.status, "red"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnLook);
            
            if(v.status != "已签约" && v.status != "合同终止" && v.status != "废单"){
            	$divBtnWrap.append($btnDelete);
    	    }
            
            if(v.status == "定金" || v.status == "重签合同"){
            	$divBtnWrap.append($btnSign);
	    	}
	    	
	    	if(v.status == "已签约"){
	    		$divBtnWrap.append($btnTerminal);
	            $divBtnWrap.append($btnResign);
	    	}
              
	    	$divBtnWrap.appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            //废单按钮的点击事件
            $btnDelete.click(function(){
            	obsoleteOrder(v.orderId);
            });
            
            //查看按钮点击事件
            $btnLook.click(function(){
            	viewDecorationOrderDetail(v.orderId);
            });
            
            //签订合同按钮点击事件
            $btnSign.click(function(){
            	signOrder(v.orderId,v.customer.id);
            });
            
           //合同终止按钮点击事件
            $btnTerminal.click(function(){
            	terminalOrder(v.orderId);
            });
            
           //重签合同按钮点击事件
            $btnResign.click(function(){
            	resignOrder(v.orderId);
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

	var _condArr = ['orderId','village','houseNumber','houseArea','customerPhone','designer','salesman','designerRegionId','designerDepartmentId','salesmanRegionId','salesmanDepartmentId', 'createTimeDateRange','signTimeDateRange','houseClass','status'];
	
	var searcher = new Searcher();
	searcher.init( _condArr, "condList", api.decoration.pageDecorationOrderForCommon, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "decorationOrderAdvancePostData", null, false, null, function(){
    	
    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);
    	
    	return [$impa];
    });
	
	$('a[name="import"]', '#pagenation').click(function(){
		
		if($('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
		
		if($('span[name="totalRecords"]').text() > 200){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		
		com.post(api.decoration.pageDecorationOrderForCommon, $.extend({}, params.decorationOrderAdvancePostData, {"paging.noPage": 1}), function(res){
			
			$.exceler({
				column : [
					["订单编号","orderId"],
					['楼盘地址',['village.villageName', 'houseNumber']],
					['客户名','customer.customerName'],
					['设计部','designDepartment'],
					['设计师', 'designer'],
					['业务部', 'businessDepartment'],
					['业务员', 'salesman'],
					['面积', 'houseArea'],
					['折扣', 'discount'],
					['合同报价', 'orderTotalPrice'],
					['量房时间', 'createTime'],
					['签单时间', 'contractTime'],
					['状态', 'status'],
				],
				list: res.paging.data,
			});
		});
    });

	//定义全局变量  json
	var order = {
	    listGrid: null,
	    gridPager: null,
	    saveBtn: null,
	    cancellBtn: null,
	    modal: null,
	    orderItems: {},
	    orderStatus: [],
	    businessDepartments: [],
	    postParam: {},
	    editFlag: !1
		},
		contract = {
			decorationOrderId: null
		};
	  
		//给全局变量赋值（主要操作是制定页面标签）
	    order.saveBtn = $("#saveBtn").on("click", saveData);
	    order.cancelBtn = $("#cancelBtn");
	    order.decorationOrderModal = $("#decorationOrderModal");
	    order.agreementModal = $("#agreementModal");
	    order.refundContractModal = $("#refundContractModal");
	    order.customerInfoModal = $("#customerInfoModal");
	    
	    $("#refundContractBtn").on("click", function(){
			if(com.validate("refundContractModal")){
				return;
			}
			
			var options = {
				"decorationOrder.orderId": decorationOrderPostData["decorationOrder.orderId"],
				"refundValue": $("#refundValue").val(),
				"paymentValue": order.paymentValue,
			};
			
			com.post(api.decoration.terminalDecorationOrder, options, function(res){
				com.showAlert(com.info, "申请成功");
				
				$("#" + decorationOrderPostData["decorationOrder.rowId"] + "_terminalBtn").css("display", "none");
			});
			
			order.refundContractModal.modal("hide");	
		});
	    
	    $("#customerInfoBtn").on("click", function() {
	    	if(com.validate()){
				return;
			}

			var cId = decorationOrderPostData["customer.customerId"];
			var flag = false;
			var options = {
				"customer.id": cId,
				"customer.customerName": $("#customerName").val(),
				"customer.phone": $("#phone").val(),
				"decorationContract.orderId": decorationOrderPostData["decorationOrder.orderId"],
			}
			
			com.post(api.data.checkCustomerForPhone, {"customer.phone": $("#phone").val()}, function(res){
				
				var cIds = res.customerIds;
				
				if(cIds.length != 0){
					$.each(cIds, function(i, v){
						if(v != cId){
							flag = true;
						}
					});
				}
				
			}, null, false);
			
			if(flag){
				com.showAlert(com.error, "客户电话已经存在");
				return false;
			}
			
			com.post(api.decoration.signDecorationContract, options, function(res){
				if(res.errorCode == 0){
					com.post(api.data.updateCustomer, options, function(res){
						com.showAlert(com.info, "操作成功");
						searcher.doSearch();
					}, null, false);
				}else{
					com.showAlert(com.error, res.errorMsg);
				}
			}, null, false);
			
			order.customerInfoModal.modal("hide");
	    });
	    
	    $('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
			$(this).prev().focus();
		});
	    
	    $('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
			$(this).prev().focus();
		});
	    
	    function saveData(){
	    	
	    	var url;
	    	var options = {
	    		"customer.customerName": order.orderItems.customerName.val(),
	    		"customer.gender": order.orderItems.gender.value,
	    		"customer.phone": order.orderItems.phone.val(),
	    		"customer.qq": order.orderItems.qq.val(),
	    		"customer.wechat": order.orderItems.wechat.val(),
	    		"customer.email": order.orderItems.email.val(),
	    		"customer.address": order.orderItems.address.val(),
	    		"customer.relationshipType": order.orderItems.relationshipType.val()
	    	};
	    	
	    	if(order.editFlg){
	    		url = order.editUrl;
	    	}else{
	    		url = order.addUrl;
	    	}
	    	
	    	com.post(url, options, successCallback, failCallback);
	    	
	    	order.modal.modal("hide");
	    }
   
	    //废单
	    function obsoleteOrder(orderId){
	    	decorationOrderPostData["decorationOrder.orderId"] = orderId;
	    	
	    	bootbox.confirm("确认要废单吗?", function(result){
	    		if(result){
	    			com.post(api.decoration.obsoleteDecorationOrder, {"decorationOrder.orderId":orderId}, function(res){
	    				com.showAlert(com.info, "操作成功");
	    				successCallback();
	    			});
	    		}
	    	});
	    }
    
	    function viewDecorationOrderDetail(decorationOrderId){
	    	decorationOrderPostData.decorationOrderId = decorationOrderId;
	    	com.switchPage(api.index.decorationOrderAdvanceDetailIndex.url);
	    }
	    
	    function signOrder(orderId, customerId){
	    	decorationOrderPostData["decorationOrder.orderId"] = orderId;
	    	decorationOrderPostData["customer.customerId"] = customerId;
	    	
	    	com.cleanItems(decorationOrderAdvance.items);
	    	
	    	order.customerInfoModal.modal("show");
	    }
	    
	    function terminalOrder(decorationOrderId, rowId){
	    	
	    	decorationOrderPostData["decorationOrder.orderId"] = decorationOrderId;
	    	decorationOrderPostData["decorationOrder.rowId"] = rowId;
	    	
	    	com.post(api.payment.queryDecorationPaymentForBaseByOrderId, {"decorationPayment.orderId":decorationOrderId}, function(res){

	    		var refundValue = 0;
	    		var decorationPaymentInfo = "";
	    		var decorationPayments = res.decorationPayments;
	    		
	    		for(var i=0;i<decorationPayments.length;i++){
	    			
	    			var decorationPayment = decorationPayments[i];
	    			var paymentType = decorationPayment.paymentType;
	    			var paymentStatus = decorationPayment.paymentStatus;
	    			var referMoney = decorationPayment.referMoney;
	    			
	    			if(paymentStatus == "已付款" || paymentStatus == "已确认"){
	    				decorationPaymentInfo += paymentType + ":" + referMoney + "<br/>";
	    				refundValue = utils.accAdd(refundValue, referMoney);
	    			}
	    		}
	    		
	    		if(decorationPaymentInfo == ""){
	    			decorationPaymentInfo == "无付款信息";
	    		}
	    		
	    		$("#decorationPaymentInfo").html(decorationPaymentInfo);
	    		$("#refundValue").val(refundValue);
	    		$("#paymentValue").val(refundValue);
	    		order.paymentValue = refundValue;
	    		
	    		com.clearValidator();
	    		
	    		order.refundContractModal.modal("show");	
	    	});
	    }
	    
	      //重签合同
	     function resignOrder(decorationOrderId, rowId){ 
	    	decorationOrderPostData["decorationOrder.orderId"] = decorationOrderId;
	    	decorationOrderPostData["decorationOrder.rowId"] = rowId;
	    	
	    	bootbox.confirm("确认要重签合同吗?", function(result){
	    		if(result){
	    			com.post(api.decoration.resignDecorationContract, {"decorationContract.orderId": decorationOrderId}, function(res){
	    				com.showAlert(com.info, "操作成功");
	    				successCallback();
	    			});
	    		}
	    	});
	    }
	    
        function successCallback() {
    	   searcher.doSearch();
    }
    
});
