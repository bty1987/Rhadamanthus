
$(function(){
    var awardRecord = {
        awardRecordItems:{},
        editFlg: false,
        repeatFlg: false
    };

    var displayFunc  = (function(){
        /*表格样式*/
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

        /*表格头*/
        var createTableTitle = function(){
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');
            var titleName ='奖品,类型,数量,总价,单价,提交人,时间,说明';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);

            return $ulTitle;
        };
        /*表格体*/
        var creatLine = function (i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col8');
            var type = {
                "0": "入库",
                "1": "出库",
                "2": "盘盈",
                "3": "盘亏"
            };

                var propertyArr = [
                    [v.awardStock.name,'grey'],
                    [type[v.type],'grey'],
                    [v.num,'grey'],
                    [v.totalPrice,'grey'],
                    [v.unitPrice, 'grey'],
                    [v.creater.currentName,'grey'],
                    [v.operateTime,'red'],
                    [v.content,'grey']
                ];
                $liLine.append($indexWrap);
                $.each(propertyArr, function (i, v) {
                    var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                    $cell.appendTo($contentWrap);
                });
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

    var awardRecordSeacher = new Searcher();
    awardRecordSeacher.init(["StockDate","StockName"], "condList", api.information.pageAwardRecord, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "pageAwardRecordPostData", {"awardRecord.awardStock.asid":""}, false, null, function() {
    },'resultList');

});


