$(function () {
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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var titleName = '奖品,类型,数量,总价,单价,提交人,时间,说明';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');
            var type = {
                "0": "入库",
                "1": "出库",
                "2": "盘盈",
                "3": "盘亏"
            };
            var propertyArr = [
                [v.awardStock.name],
                [type[v.type]],
                [v.num],
                [v.totalPrice],
                [v.unitPrice],
                [v.creater.currentName],
                [v.operateTime],
                [v.content]
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            $btnGroup
                .append($btnUl)
                .appendTo($cellOption);
            $liLine.append($indexWrap)
                .append($contentWrap);
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
    var $popup = com.focusPage('#stockRecordPopUp');

    var opt = {
        "awardRecord.awardStock.asId":$popup.attr("data-asid")

    };

    var stockRecordSeacher = new Searcher();
    stockRecordSeacher.init([], null, api.information.pageAwardRecord, function (data) {
        displayFunc.init('resultListas', data);
    }, "pagenationas", "pageStockRecordPostData", opt, false, null);
    //弹出内容许些样式
    com.focusPage('#resultListas').css({'width': '96%', 'margin': '0 auto'});

});