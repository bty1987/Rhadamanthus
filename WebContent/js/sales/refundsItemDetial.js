

$(function () {

	var sid = params.sid

    $('#backBtn').click(function () {
        com.switchPage(api.index.querySalesIndex.url);
    });

    var initList = function(listData) {
        var $tableWrap = $('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').css({"color":"grey","font-weight":"bold"}).html(v.salesItem.goods.name + ' '+v.salesItem.goods.no);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var propertyArr = [
                    ["商品品类:", v.salesItem.goods.category, "grey"],
                    ["商品颜色:", v.salesItem.color.name, "grey"],
                    ["商品规格:", v.salesItem.format.info, "grey"],
                    ["售价:", v.salesItem.selling, "grey"],
                    ["折扣价:", v.salesItem.disPrice, "grey"],
                    ["折让价:", v.salesItem.price, "grey"],
                    ["数量:", v.num, "grey"],
                    ["总价:", v.total, "grey"],
                    ["原结算方式:", v.salesItem.rawCtype==0?"底价":"点位", "grey"],
                    ["原结算值:", v.salesItem.rawCvalue, "grey"],
                    ["结算方式:", v.salesItem.ctype==0?"底价":"点位", "grey"],
                    ["结算值:", v.salesItem.cvalue, "grey"],
                    ["备注:", v.salesItem.comment, "grey"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).css({color:value[2]}).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                $btnDiv.appendTo($h3);



            });

            $ul.appendTo($tableWrap);
        }
    };

    querySalesItemBySid(sid);

    function querySalesItemBySid(sid) {
        com.post(api.inventory.queryRefundsItemBySid,{"refunds.sid":sid},function (data) {
            initList(data.refundsItems);
        },function (e) {
            com.showAlert(com.error,e.errorMsg);
        },false)
    }



})