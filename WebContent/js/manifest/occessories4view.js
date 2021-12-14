$(function () {

    var oid = params["occessoriesItem.oid"];
    var status = params["occessories.status"];

    Refresh();

    withdrawBtn = com.focusPage("#withdrawBtn").on("click", saveDate);
    

    var renderList = function (tableId, listData) {

        // var $div = $('<div></div>').addClass('fl_search clearfix').css('font-size', '16px').html("单号：" + v.code + " 辅料单");
        var $tableWrap = com.focusPage('#' + tableId);
        $tableWrap.html("");

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

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
        var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

        var titleName = '商品编号,名称,品类,品牌,单位,件数,数量,退货数量';

        $.each(titleName.split(','), function (i, v) {
            var $cell = $('<div></div>').addClass('cell').html(v);
            $cell.appendTo($contentWrap);
        });
    if (status != 0){
        var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>退货</div>').addClass('cell option'));

        $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);
    };
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
            [v.num, 'blue'],
            [v.refnum,'blue']
        ];

        $.each(propertyArr, function (i, v) {
            var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
            $cell.appendTo($contentWrap);
        });
    if (status !=0){

        var $optionWrap = $('<div></div>').addClass('line-wrap action');
        var $cellOption = $('<div></div>').addClass('cell option').appendTo($optionWrap);
        var $btnGroup = $('<div></div>').addClass('btn-group');
        var $btn = $('<button></button>').addClass('btn btn-info').append('退货');

        $btnGroup.append($btn).appendTo($cellOption);
        $liLine.append($indexWrap).append($contentWrap).append($optionWrap);
    }else {
        $liLine.append($indexWrap).append($contentWrap);
    }

    if (status!=0) {
        $btn.click(function () {
            params["occessoriesItem.oiid"] = v.oiid;
            com.focusPage("#renewal").modal("show")

        });
    }

        return $liLine;
    };

    com.focusPage("#cancelBtn").click(function () {
        com.closePopup();
    });

    function saveDate() {
        if (com.validate('renewal')) return false;
        var  options = {
            "occessoriesItem.oiid": params["occessoriesItem.oiid"],
            "occessoriesItem.refnum" : com.focusPage("#updata").val(),
            "occessoriesItem.oid": oid,

        };
        com.post(api.inventory.refundOccessoriesItem, options, function () {
            com.showAlert(com.info, "操作成功");
            com.focusPage("#renewal").modal("hide");
            Refresh();
        });
        
    }
    function Refresh() {
        com.post(api.inventory.queryOccessoriesItemByAid, {"occessoriesItem.oid": oid}, function (res) {
            renderList('resultList1', res.occessoriesItems);
        });
    }

});
