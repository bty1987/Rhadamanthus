
jQuery(function($) {
	
	var decorationBelong = {
		decorationOrderStatus: {}
	};
	
	com.post(api.ds.decoration, {}, function (res) {
		$.each(res.decorationOrderStatus, function(i,v){
			decorationBelong.decorationOrderStatus[v.key] = v.value;
		})
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-success').html('查看');
            var $btnDesign = $('<a></a>').addClass('btn btn-minier btn-yellow').html('设计');
            var $btnSalesman = $('<a></a>').addClass('btn btn-minier btn-primary').html('业务');

            var propertyArr = [
                ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                ["客户名:", v.customer.name, "grey"],
                ["设计部:", v.designer.dept.deptName, "grey"],
                ["设计师:", v.designer.currentName, "grey"],
                ["业务部:", v.salesman.dept.deptName, "grey"],
                ["业务员:", v.salesman.currentName, "grey"],
                ["面积:", v.house.buildArea, "blue"],
                ["合同报价:", v.orderTotalPrice, "blue"],
                ["量房时间:", v.measureTime, "green"],
                ["类型:", v.type == 0 ? '半包' : (v.type == 1 ? '全包' : '半价'), "red"],
                ["状态:", decorationBelong.decorationOrderStatus[v.status], "red"]
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
            	viewdecorationBelongDetail(v.orderId);
            });
            
            $btnDesign.click(function(){
            	changedecorationBelongDesigner(v.orderId);
            });
            
            $btnSalesman.click(function(){
            	changedecorationBelongBussiness(v.orderId);
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
	
	var _condArr = ['orderId', 'village', 'houseNumber', 'houseArea', 'designer', 'salesman','orderType','salesmanType'];
	
	var searcher = new Searcher();

	searcher.init( _condArr, "condList", api.decoration.pageDecorationForBelong, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationBelongPostData");
	
	function viewdecorationBelongDetail(decorationOrderId){
		params.orderId = decorationOrderId;
		com.switchPage(api.index.decorationBelongInfoIndex.url);
	}

	function changedecorationBelongDesigner(decorationOrderId){
		params.orderId = decorationOrderId;
		params.orderBelongType = 0;
		com.switchPage(api.index.decorationBelongDetailIndex.url);
	}

	function changedecorationBelongBussiness(decorationOrderId){
		params.orderId = decorationOrderId;
		params.orderBelongType = 1;
		com.switchPage(api.index.decorationBelongDetailIndex.url);
	}
	
});

