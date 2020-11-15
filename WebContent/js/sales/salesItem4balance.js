$(function () {

    var salesItem = {
        sbid: params['sbid'],
    };
    
    com.focusPage('#fl-statement').statement("销售单", "销售项");

    function initList(tableId, listData) {
        var $tableWrap = com.focusPage('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');//.addClass('siid')
                var $small = $('<small></small>').addClass('blue').html(v.salesItem.goods.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var propertyArr = [
                    ["商品品类:", v.salesItem.goods.category, "grey", "category"],
                    ["商品颜色:", v.salesItem.color.name, "grey", "color"],
                    ["商品规格:", v.salesItem.format.info, "grey", "format"],
                    ["售价:", v.salesItem.selling, "blue", "selling"],
                    ["折扣价:", v.salesItem.disPrice, "blue", "disPrice"],
                    ["折让价:", v.salesItem.price, "blue", "price"],
                    ["数量:", v.num, "blue", "num"],
                    ["总价:", v.total, "blue", "total"],
                    ["结算方式:", v.ctype == 0 ? "底价" : "点位", "red", "ctype"],
                    ["结算值:", v.cvalue, "blue", "cvalue"],
                    ["备注:", v.salesItem.comment, "grey", "comment"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                    $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $small.appendTo($h3);
                $btnDiv.appendTo($h3);
                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
            });

            $ul.appendTo($tableWrap);
        }
    };
    
    com.post(api.sales.querySalesBalanceItemBySbid, {"salesBalance.sbid": salesItem.sbid}, function (res) {
        
        com.focusPage("#resultListItem").empty();
        
        if (res.salesBalanceItems.length == 0) {
            emptyData("resultListItem");
        } else {
            initList("resultListItem", res.salesBalanceItems);
        }
    });
    
    function emptyData(id) {
        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }
   
});