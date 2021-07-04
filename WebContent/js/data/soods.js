$(function () {

    var soods = {
        gid: null,
        items: {
            name: com.focusPage("#name"),
            quote: com.focusPage("#quote"),
            num: com.focusPage("#num"),
        },
        submitBtn: com.focusPage("#submitBtn")
    };

    com.initTypeahead("name", api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function (list, k, v) {
        $.each(list, function (index, val) {
            if (val.gid == k) {
                soods.gid = k;
            }
        });

        return v;
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.goods.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
                ["品牌: ", v.goods.brand, "grey"],
                ["品类: ", v.goods.category, "grey"],
                ["单位: ", v.goods.measurementUnit, "red"],
                ["结算价: ", v.selling, "blue"],
                ["数量: ", v.num, "blue"],
                ["状态: ", v.status == 0 ? "有效" : "无效", "red"],
                ["报价名称: ", v.quotationItem.name, "grey"],
                ["报价版本: ", v.quotationItem.version.no, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

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

    var searcher = new Searcher();
    var condCodeArrs = ["data-soods-name", "data-soods-category", "data-soods-brand", "data-soods-quotation-version", "data-soods-quotation-item-name","data-soods-quotation-smallcategory"];

    searcher.init(condCodeArrs, "condList", api.data.pageSoods, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "soodsPostData", null, false, null, function () {});

})();