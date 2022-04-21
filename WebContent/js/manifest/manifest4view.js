
$(function(){
	
    var mid =  params.manifest.mid;
    
    com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": mid}, function(res){
        displayFunc.init('resultList1',res.manifestItems);
    });
	
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

            var titleName = '商品编号,商品名,单位,颜色,规格,进货仓库,出货仓库,件数,入库价,出库价,数量,备注';

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');
            
            var propertyArr = [
                [v.goods.no, 'blue'],
                [v.goods.name, 'grey'],
                [v.goods.measurementUnit, 'grey'],
                [v.color.name, 'grey'],
                [v.format.info, 'grey'],
                [v.instorehouse.name, 'grey'],
                [v.outstorehouse.name, 'grey'],
                [v.goods.pieceNum, 'blue'],
                [v.inprice, 'blue'],
                [v.outprice, 'blue'],
                [v.surplus, 'blue'],
                [v.comment, 'grey']
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
        }
    })();
    
    com.focusPage("#cancelBtn").click(function () {
        com.closePopup();
    });

});
