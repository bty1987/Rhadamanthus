$(function () {

	var refund = {
	    sid: params.sid
	};
	
	com.post(api.inventory.queryRefundsItemBySid,{"refunds.sid": refund.sid},function (data) {
        initList(data.refundsItems);
    });

    var initList = function(listData) {
        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(v.salesItem.goods.name + ' '+v.salesItem.goods.no);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var propertyArr = [
                    ["商品品类:", v.salesItem.goods.category, "grey"],
                    ["商品颜色:", v.salesItem.color.name, "grey"],
                    ["商品规格:", v.salesItem.format.info, "grey"],
                    ["售价:", v.salesItem.selling, "blue"],
                    ["折扣价:", v.salesItem.disPrice, "blue"],
                    ["折让价:", v.salesItem.price, "blue"],
                    ["数量:", v.num, "blue"],
                    ["总价:", v.total, "blue"],
                    ["原结算方式:", v.salesItem.rawCtype==0?"底价":"点位", "red"],
                    ["原结算值:", v.salesItem.rawCvalue, "blue"],
                    ["结算方式:", v.salesItem.ctype==0?"底价":"点位", "red"],
                    ["结算值:", v.salesItem.cvalue, "blue"],
                    ["备注:", v.salesItem.comment, "grey"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                $small.appendTo($h3);
                $btnDiv.appendTo($h3);
            });
            $ul.appendTo($tableWrap);
        }
    };
});