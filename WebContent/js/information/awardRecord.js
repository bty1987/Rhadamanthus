
$(function(){

    var awardRecord = {
        type : {},
        subtype : {},
        onetype : {},

        awardRecordItems:{},
        editFlg: false,
        repeatFlg: false
    };

    com.post(api.ds.information, {}, function(res){

        awardRecord.type = res.StockType.split("key" ,"value");
        awardRecord.onetype = res.awardStockOneType.split("key" ,"value");
        awardRecord.subtype = res.awardRecordSubtype.split("key" ,"value");

    }, null, false);
    
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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');
            var titleName ='奖品,类型,子类,一类,数量,总价,单价,提交人,时间,说明';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col10');

            var propertyArr = [
                [v.awardStock.name,'grey'],
                [awardRecord.type[v.type],'grey'],
                [awardRecord.subtype[v.subtype],'grey'],
                [awardRecord.onetype[v.onetype] , 'grey'],
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
    awardRecordSeacher.init(["stockDate", "stockName", "StockType", "awardRecordSubtypes", "awardStockOneType"], "condList", api.information.pageAwardRecord, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "pageAwardRecordPostData", {"awardRecord.awardStock.asid":""}, false, null, function() {
    },'resultList');

});


