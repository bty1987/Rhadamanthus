var decorationOrderBelong = {};

jQuery(function($) {
	
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

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-success').html('查看');
            var $btnDesign = $('<a></a>').addClass('btn btn-minier btn-yellow').html('设计');
            var $btnSalesman = $('<a></a>').addClass('btn btn-minier btn-primary').html('业务');

            var propertyArr = [
                ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
                ["客户名:", v.customer.customerName, "grey"],
                ["设计部:", v.designDepartment, "grey"],
                ["设计师:", v.designer, "grey"],
                ["业务部:", v.businessDepartment, "grey"],
                ["业务员:", v.salesman, "grey"],
                ["面积:", v.houseArea, "blue"],
                ["合同报价:", v.orderTotalPrice, "blue"],
                ["量房时间:", v.createTime, "grey"],
                ["类型:", v.type == 0 ? '半包' : (v.type == 1 ? '全包' : '半价'), "red"],
                ["状态:", v.status, "red"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnLook).append($btnDesign).append($btnSalesman).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnLook.click(function(){
            	viewDecorationOrderBelongDetail(v.orderId);
            });
            
            $btnDesign.click(function(){
            	changeDecorationOrderBelongDesigner(v.orderId);
            });
            
            $btnSalesman.click(function(){
            	changeDecorationOrderBelongBussiness(v.orderId);
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
	
	var _condArr = ['orderId', 'village', 'houseNumber', 'houseArea', 'customerPhone', 'designer', 'salesman'];
	
	var searcher = new Searcher();

	searcher.init( _condArr, "condList", api.decoration.pageDecorationOrderForBelong, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationOrderBelongPostData");
	
});

function viewDecorationOrderBelongDetail(decorationOrderId){
	params.orderId = decorationOrderId;
	com.switchPage(api.index.decorationOrderBelongInfoIndex.url);
}

function changeDecorationOrderBelongDesigner(decorationOrderId){
	params.orderId = decorationOrderId;
	params.orderBelongType = "设计";
	com.switchPage(api.index.decorationOrderBelongDetailIndex.url);
}

function changeDecorationOrderBelongBussiness(decorationOrderId){
	params.orderId = decorationOrderId;
	params.orderBelongType = "业务";
	com.switchPage(api.index.decorationOrderBelongDetailIndex.url);
}

