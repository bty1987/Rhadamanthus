$(function () {

    var renderList = function (tableId, v, listData) {

        var $div = $('<div></div>').addClass('fl_search clearfix').css('font-size', '16px').html("单号：" + v.code + " 辅料单");
        var $tableWrap = com.focusPage('#' + tableId);

        if (listData && listData.length) {

            var $ulTitle = createTableTitle();
            var $ulData = $('<ul></ul>').addClass('flex-table');
            $tableWrap.append($div).append($ulTitle).append($ulData);

            $.each(listData, function (i, v) {
                var $liLine = creatLine(i, v, i == listData.length - 1);
                $liLine.appendTo($ulTitle);

                return $liLine;
            });
        }
    };

    var refundList = function (tableId, v, listData) {

        var $div = $('<div></div>').addClass('fl_search clearfix').css('font-size', '16px').html("单号：" + v.code + " 辅退单");
        var $tableWrap = com.focusPage('#' + tableId);

        if (listData && listData.length) {

            var $ulTitle = createTableTitle();
            var $ulData = $('<ul></ul>').addClass('flex-table');
            $tableWrap.append($div).append($ulTitle).append($ulData);

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
        var $contentWrap = $('<div></div>').addClass('line-wrap  content col13');

        var titleName = '商品编号,名称,品类,品牌,单位,颜色,规格,进货仓库,出货仓库,件数,入库价,出库价,数量';

        $.each(titleName.split(','), function (i, v) {
            $('<div></div>').addClass('cell').html(v).appendTo($contentWrap);
        });

        $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);

        return $ulTitle;
    };

    var creatLine = function (i, v, lastFlag) {

        var $liLine = $('<li></li>').addClass('line');

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
        var $contentWrap = $('<div></div>').addClass('line-wrap  content col13');

        var propertyArr = [
            [v.goods.no, 'blue'],
            [v.goods.name, 'grey'],
            [v.goods.category, 'grey'],
            [v.goods.brand, 'grey'],
            [v.goods.measurementUnit, 'grey'],
            [v.color.name, 'grey'],
            [v.format.info, 'grey'],
            [v.instorehouse.name, 'grey'],
            [v.outstorehouse.name, 'grey'],
            [v.goods.pieceNum, 'blue'],
            [v.inprice, 'blue'],
            [v.outprice, 'blue'],
            [v.num, 'blue']
        ];

        $.each(propertyArr, function (i, v) {
            var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
            $cell.appendTo($contentWrap);
        });

        $liLine.append($indexWrap).append($contentWrap);

        return $liLine;
    };

    var options = {
        "accessoriesManifest.accessories.aid": params["accessories.aid"],
        "accessoriesManifest.manifest.type": null
    };

    com.post(api.inventory.queryManifestByAid, options, function (res) {
        $.each(res.manifests, function (i, v) {
            if (v.type == 7) {
                com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": v.mid}, function (res) {
                    renderList('resultList1', v, res.manifestItems);
                });
            } else {
                com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": v.mid}, function (res) {
                    refundList('resultList2', v, res.manifestItems);
                });
            }
        })
    }, null, false);

});