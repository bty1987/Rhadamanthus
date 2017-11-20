
jQuery(function($) {
	
	var decorationActivity = {};
	var decorationActivityPostData = {};
	
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

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-yellow').html('活动物品');

            var propertyArr = [
                ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
                ["客户名:", v.customer.customerName, "grey"],
                ["设计师:", v.designer, "grey"],
                ["业务员:", v.salesman, "grey"],
                ["面积:", v.houseArea, "blue"],
                ["状态:", v.status, "red"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnLook).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnLook.click(function(){
            	viewDecorationActivityItem(v.orderId);
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
	
	var _condArr = ['orderId', 'village', 'houseNumber', 'houseArea', 'customerPhone', 'designer', 'salesman','orderType','salesmanType','designerRegionId','designerDepartmentId','salesmanRegionId','salesmanDepartmentId','createTimeDateRange','signTimeDateRange'];

	_condArr.push('houseClass');
	_condArr.push('status');
	
	var searcher = new Searcher();

	searcher.init( _condArr, "condList", api.decoration.pageDecorationOrderForCommon, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationActivityPostData");
	
	function viewDecorationActivityItem(decorationOrderId){
		params.decorationOrderId = decorationOrderId;
		com.switchPage(api.index.decorationActivityItemIndex.url);
	}
	
});


