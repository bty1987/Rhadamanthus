
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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');

            var titleName = '商品编号,商品名称,商品类别,品牌,单位,颜色,规格,供应商,采购单价,件数,剩余数量,数量';

            $.each(titleName.split(','), function (i, v) {
                $('<div></div>').addClass('cell').html(v).appendTo($contentWrap);
            });

            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag){

            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col11');

            var propertyArr = [
                [v.goods.no, 'blue'],
                [v.goods.name, 'grey'],
                [v.goods.category, 'grey'],
                [v.goods.brand, 'grey'],
                [v.goods.measurementUnit, 'grey'],
                [v.color.name, 'grey'],
                [v.format.info,  'grey'],
                [v.unitPrice, 'blue'],
                [v.surplus, 'blue'],
                [v.goods.pieceNum, 'blue'],
                [v.num,'blue']
            ];

            $.each(propertyArr, function (i, v) {
                $('<div></div>').addClass('cell ' + v[1]).html(v[0]).appendTo($contentWrap);
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
        }
    })();
    
    var pid = params["purchase.pid"];
    
    com.post(api.inventory.queryPurchaseItemByPid, {"purchase.pid": pid}, function(res){
        displayFunc.init('resultList1', res.purchaseItems);
    });
    
    com.focusPage("#exportBtn").click(function(){
    	com.post(api.inventory.queryPurchaseItemByPid, {"purchase.pid": pid}, function (res) {

            $.exceler({
                column: [
                    ['商品编号', 'goods.gid'],
                    ['商品型号', 'goods.no'],
                    ['商品名称', 'goods.name'],
                    ['商品类别', 'goods.category'],
                    ['品牌', 'goods.brand'],
                    ['单位', 'goods.measurementUnit'],
                    ['颜色', 'color.name'],
                    ['规格', 'format.info'],
                    ['采购单价', 'unitPrice'],
                    ['数量', 'num'],
                    ['件数', 'goods.pieceNum'],
                    ['剩余数量', 'surplus']
                ],
                list: res.purchaseItems
            });
        });
    });
    
    com.focusPage("#cancelBtn").click(function () {
        layer.closeAll();
    });
    
});



