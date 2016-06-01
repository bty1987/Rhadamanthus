var decorationOrderPostData = {};//页面跳转保存参数  跳转页面后  之前页面$(function()中定义的东西就没有了

$(function(){

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

            var $btnRevie = $('<a></a>').addClass('btn btn-minier btn-success').html('回访');
           
            var propertyArr = [
                ["订单编号:", v.orderId, "grey"],
                ["楼盘地址:", v.village.villageName, "grey"],
                ["客户名:", v.customer.customerName, "grey"],
                ["余额:", v.customer.balance, "grey"],
                ["设计部:", v.designDepartment, "grey"],
                ["设计师:", v.designer, "grey"],
                ["业务部:", v.businessDepartment, "grey"],
                ["业务员:", v.salesman, "grey"],
                ["面积:", v.houseArea, "grey"],
                ["合同报价:", v.orderTotalPrice, "grey"],
                ["折扣:", v.discount, "grey"],
                ["量房时间:", v.createTime, "grey"],
                ["签单时间:", v.contractTime, "grey"],
                ["状态:", v.status, "grey"],
            ];


            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnRevie);
   
	    	$divBtnWrap.appendTo($h3);
	    	
            $liLine.append($h3).append($ulProperty);
            
          //回访按钮的点击事件
			$btnRevie.click(function(){
				viewDecorationOrderBackVisitIndex(v.orderId);
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
 
   var decorationOrderSalesmanSeacher = new Searcher();
   
   decorationOrderSalesmanSeacher.init( _condArr, "condList", api.decoration.pageDecorationOrderForCommon, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "DecorationOrderSalesmanPostData");

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
	
    order.saveBtn = $("#saveBtn").on("click", saveData);
    order.cancelBtn = $("#cancelBtn");
    order.decorationOrderModal = $("#decorationOrderModal");
    order.agreementModal = $("#agreementModal");
    order.refundContractModal = $("#refundContractModal");
    order.customerInfoModal = $("#customerInfoModal");
    decorationUtils.createDecorationOrderCondition(order.listGrid, api.decoration.pageDecorationOrderForSalesman.url, "orderSearchDiv", {}, "");
	    
    $("#refundContractBtn").on("click",
    function() {
        if (!com.validate("refundContractModal")) {
            var b = {
                "decorationOrder.orderId": decorationOrderPostData["decorationOrder.orderId"],
                refundValue: $("#refundValue").val(),
                paymentValue: order.paymentValue
            };
            com.post(api.decoration.terminalDecorationOrder, b,
            function(d) {
                com.showAlert(com.info, "\u7533\u8bf7\u6210\u529f");
                $("#" + decorationOrderPostData["decorationOrder.rowId"] + "_terminalBtn").css("display", "none")
            });
            order.refundContractModal.modal("hide")
        }
    });
    $("#customerInfoBtn").on("click", function() {
        if (!com.validate()) {
            var b = decorationOrderPostData["customer.customerId"],
            d = !1,
            c = {
                "customer.id": b,
                "customer.customerName": $("#customerName").val(),
                "customer.phone": $("#phone").val(),
                "decorationContract.quotationDetail.customer.customerName": $("#customerName").val(),
                "decorationContract.quotationDetail.customer.phone": $("#phone").val(),
                "decorationContract.quotationDetail.orderId": decorationOrderPostData["decorationOrder.orderId"]
            };
            com.post(api.data.checkCustomerForPhone, {
                "customer.phone": $("#phone").val()
            },
            function(c) {
                c = c.customerIds;
                0 != c.length && a.each(c,
                function(a, c) {
                    c != b && (d = !0)
                })
            },
            null, !1);
            if (d) return com.showAlert(com.error, "\u5ba2\u6237\u7535\u8bdd\u5df2\u7ecf\u5b58\u5728"),
            !1;
            com.post(api.data.updateCustomer, c,
            function(a) {
                0 == a.errorCode ? com.post(api.decoration.signDecorationContract, c,
                function(a) {
                    com.showAlert(com.info, "\u64cd\u4f5c\u6210\u529f");
                    order.listGrid.trigger("reloadGrid")
                },
                null, !1) : com.showAlert(com.error, a.errorMsg)
            },
            null, !1);
            order.customerInfoModal.modal("hide")
        }
    });
    
    $(".date-picker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: !0,
        todayBtn: !0,
        todayHighlight: !0
    }).next().on(ace.click_event,
	    function() {
	        a(this).prev().focus()
	    });
    
    $(".date-picker").datepicker({
        format: "yyyy-mm-dd",
        autoclose: !0,
        todayBtn: !0,
        todayHighlight: !0
    }).next().on(ace.click_event,
	    function() {
	        a(this).prev().focus()
    })

   function saveData() {
	    var a = {
	        "customer.customerName": order.orderItems.customerName.val(),
	        "customer.gender": order.orderItems.gender.value,
	        "customer.phone": order.orderItems.phone.val(),
	        "customer.qq": order.orderItems.qq.val(),
	        "customer.wechat": order.orderItems.wechat.val(),
	        "customer.email": order.orderItems.email.val(),
	        "customer.address": order.orderItems.address.val(),
	        "customer.relationshipType": order.orderItems.relationshipType.val()
	    };
	    com.post(order.editFlg ? order.editUrl: order.addUrl, a, successCallback, failCallback);
	    order.modal.modal("hide")
	 }
   
    function viewDecorationOrderBackVisitIndex(decorationOrderId) { 
    	decorationOrderPostData["decorationOrderId"] = decorationOrderId;
		params.historyOrderPage = api.index.decorationOrderDesignerIndex.url;
		$("#decorationOrderPageContent").load(api.index.backVisitIndex.url);
    }
  
    function successCallback() {
	   decorationOrderSalesmanSeacher.doSearch();
    }
    
});
