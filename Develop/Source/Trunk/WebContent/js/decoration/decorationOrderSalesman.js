var decorationOrderPostData = {};//页面跳转保存参数  跳转页面后  之前页面$(function()中定义的东西就没有了

$(function(){
	
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
                ["状态:", v.status, "red"],
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
 
   var searcher = new Searcher();
   
   searcher.init( _condArr, "condList", api.decoration.pageDecorationOrderForSalesman, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "decorationOrderSalesmanPostData", null, false, null, function(){
    	
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
		
		com.post(api.decoration.pageDecorationOrderForSalesman, $.extend({}, params.decorationOrderSalesmanPostData, {"paging.noPage": 1}), function(res){
			
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
					['合同报价', 'orderTotalPrice'],
					['量房时间', 'createTime'],
					['签单时间', 'contractTime'],
					['状态', 'status'],
				],
				list: res.paging.data,
			});
		});
   });

    order.decorationOrderModal = $("#decorationOrderModal");
    order.agreementModal = $("#agreementModal");
    order.refundContractModal = $("#refundContractModal");
    order.customerInfoModal = $("#customerInfoModal");
	    
    function viewDecorationOrderBackVisitIndex(decorationOrderId) { 
    	decorationOrderPostData["decorationOrderId"] = decorationOrderId;
		params.historyOrderPage = api.index.decorationOrderSalesmanIndex.url;
		$("#decorationOrderPageContent").load(api.index.backVisitIndex.url);
    }
  
    function successCallback() {
	   searcher.doSearch();
    }
    
});
