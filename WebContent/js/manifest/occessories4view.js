$(function () {

    var oid = params["occessoriesItem.oid"];

    com.post(api.inventory.queryOccessoriesItemByAid, {"occessoriesItem.oid": oid}, function (res) {
        renderList('resultList1', res.occessoriesItems);
    });

    var renderList = function (tableId, listData) {

        // var $div = $('<div></div>').addClass('fl_search clearfix').css('font-size', '16px').html("单号：" + v.code + " 辅料单");
        var $tableWrap = com.focusPage('#' + tableId);

        if (listData && listData.length) {

            var $ulTitle = createTableTitle();
            var $ulData = $('<ul></ul>').addClass('flex-table');
            $tableWrap.append($ulTitle).append($ulData);

            $.each(listData, function (i, v) {
                var $liLine = creatLine(i, v, i == listData.length - 1);
                $liLine.appendTo($ulTitle);

                return $liLine;
            });
        }
    };


    var createTableTitle = function () {

        var $ulTitle = $('<ul></ul>').addClass('flex-table');
        var $liTitle = $('<li></li>').addClass('line table-title');

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
        var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

        var titleName = '商品编号,名称,品类,品牌,单位,件数,数量';

        $.each(titleName.split(','), function (i, v) {
            $('<div></div>').addClass('cell').html(v).appendTo($contentWrap);
        });

        $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);

        return $ulTitle;
    };

    var creatLine = function (i, v, lastFlag) {

        var $liLine = $('<li></li>').addClass('line');

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
        var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

        var propertyArr = [
            [v.goods.no, 'blue'],
            [v.goods.name, 'grey'],
            [v.goods.category, 'grey'],
            [v.goods.brand, 'grey'],
            [v.goods.measurementUnit, 'grey'],
            [v.goods.pieceNum, 'blue'],
            [v.num, 'blue']
        ];

        $.each(propertyArr, function (i, v) {
            var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
            $cell.appendTo($contentWrap);
        });

        $liLine.append($indexWrap).append($contentWrap);

        return $liLine;
    };

    com.focusPage("#cancelBtn").click(function () {
        com.closePopup();
    });

});
