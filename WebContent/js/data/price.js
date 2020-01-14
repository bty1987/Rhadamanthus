
$(function () {

    var goods = {
    	gid: params["goods.gid"]
    };
    
    com.post(api.data.queryPriceByGid, {"price.gid": goods.gid}, function (res) {
        displayFunc.init('resultListPrice', res.prices);
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);

                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html(
                $('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass(
                'line-wrap  content col5');

            var titleName = '价格说明,进价,售价,结算类型,结算值';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col5');

            var propertyArr = [
                // v.gid,
                [v.name,'grey'],
                [v.purchase,'blue'],
                [v.selling,'blue'],
                [v.ctype == "0" ? "底价" : "点位",'red'],
                [v.cvalue,'blue']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell '+ v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $cellOption = $('<div></div>').addClass('cell option');

            $liLine.append($indexWrap).append($contentWrap);

            return $liLine;

        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

});
