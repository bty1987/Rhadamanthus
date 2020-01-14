$(function (){

    var balanceSales={

        bid : params.bid,
    };

    var initList = function (v) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if(!v.length){
            var $resultList = com.focusPage("#list").addClass('dz-default dz-message').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;

        }else if (v) {

            $.each(v,function (i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(' ' + v.sales.no);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [
                    ["装修单号:", v.sales.orderId, "blue"],
                    ["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber,"grey"],
                    ["品类:",v.sales.category, "grey" ],
                    ["品牌:",v.sales.brand, "grey" ],
                    ["类型:", v.type == 0 ? "购货" : v.type == 1 ? "预结算退货" : "结算退货", "red"],
                    ["结算值:", v.pbalance, "blue"],
                    ["一类:", v.onetype == 0 ? "购货" : v.onetype == 1 ? "退货" : v.onetype == 2 ? "全退" : "倒单", "red"],
                    ["状态:", v.status == 0 ? "预结算" : v.status == 1 ? "厂商结算" : "结算", "red"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                $h3.append($title);
                $ul.appendTo($tableWrap);
            })
        }
    };

    queryBalanceSalesForSales(balanceSales.bid);

    function queryBalanceSalesForSales(bid) {

        com.post(api.balance.queryBalanceSalesForSales, {"balanceSales.balance.bid": bid}, function (data) {

            initList(data.salesBalances);

        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

});
