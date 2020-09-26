/**
 * Created by Administrator on 2016/10/7.
 */
$(function(){

	var displayFunc  = (function(){
		
        var renderList = function(tableId,listData){
        	
            var $tableWrap = com.focusPage('#' + tableId);
            
            if(listData && listData.length){
            	
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                
                $tableWrap.append($ulTitle).append($ulData);
                
                $.each(listData,function(i, v){
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };
        
        var createTableTitle = function(){
        	
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col14');
            
            var titleName = '创建人,创建时间,仓库,商品编号,商品名称,条形码,品类,品牌,颜色,规格,单位,数量,件数,盈亏';
            
            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });
            
            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);
            
            return $ulTitle;
        };
        
        var creatLine = function(i, v, lastFlag){
        	
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col14');
            
            var propertyArr = [
                [v.creater.userName ? v.creater.userName : "---" , 'grey'],
                [v.createTime , 'green'],
                [v.storehouse.name , 'grey'],
                [v.goods.no , 'blue'],
                [v.goods.name , 'grey'],
                [v.goods.barcode , 'blue'],
                [v.goods.category , 'grey'],
                [v.goods.brand , 'grey'],
                [v.color.name , 'grey'],
                [v.format.info , 'grey'],
                [v.goods.measurementUnit , 'grey'],
                [v.num , 'blue'],
                [v.goods.pieceNum , 'blue'],
                [v.type == 0 ? "盘盈" : "盘亏" , 'red']
            ];
            
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });
            
            var $cellOption = $('<div></div>').addClass('cell option');
            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            
            $btnGroup.append($btnUl).appendTo($cellOption);
            $liLine.append($indexWrap).append($contentWrap);
            
            return $liLine;

        };
        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();
	
    var checkListSeacher = new Searcher();
    
    checkListSeacher.init( ["inventory-storehouse-name", "inventory-goods-goodsName","inventory-brand-name"], "condList", api.inventory.pageCheckList, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "checkListPostData", null, false, null, null, 'resultList');
});
