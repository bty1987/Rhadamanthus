var decorationOrderPostData = {};

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

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnAgreement = $('<a></a>').addClass('btn btn-minier').html('合同');

            var propertyArr = [
                ["楼盘地址:", v.village.villageName + ' ' + v.houseNumber, "grey"],
                ["客户名:", v.customer.customerName, "grey"],
                ["设计部:", v.designDepartment, "grey"],
                ["设计师:", v.designer, "grey"],
                ["业务部:", v.businessDepartment, "grey"],
                ["业务员:", v.salesman, "grey"],
                ["面积:", v.houseArea, "blue"],
                ["合同报价:", v.orderTotalPrice, "blue"],
                ["折扣:", v.discount, "blue"],
                ["量房时间:", v.createTime, "grey"],
                ["签单时间:", v.contractTime, "grey"],
                ["类型:", v.type == 0 ? '半包' : (v.type == 1 ? '全包' : '半价'), "red"],
                ["状态:", v.status, "red"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

			$divBtnWrap.append($btnLook);
			  
            if(v.status == "已签约" || v.status == "已完工"){//判断的条件是ListData中的status,所以取v.status
                	
            	$divBtnWrap.append($btnAgreement);
            }

	    	$divBtnWrap.appendTo($h3);
	    	
            $liLine.append($h3).append($ulProperty);
         
            //查看按钮点击事件
            $btnLook.click(function(){
            	viewDecorationOrderDetail(v.orderId, v.type);
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
        };
    })();

    var _condArr = ['orderId','village','houseNumber','houseArea','customerPhone','designer','salesman','designerRegionId','designerDepartmentId','salesmanRegionId','salesmanDepartmentId', 'createTimeDateRange','signTimeDateRange','houseClass','status','orderType','salesmanType'];

    var searcher = new Searcher();
    searcher.init( _condArr, "condList", api.decoration.pageDecorationOrderForDesigner, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "DecorationOrderApprovePostData");
	
	//查看
    function viewDecorationOrderDetail(decorationOrderId,type) {
    	decorationOrderPostData.decorationOrderId = decorationOrderId;
        decorationOrderPostData.type = type;
        com.switchPage(api.index.decorationOrderApproveDetailIndex.url);
    } 
});
    

