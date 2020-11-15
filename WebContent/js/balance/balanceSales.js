$(function (){

    var balanceSales={

        bid : params.bid,

        types : {},
        onetypes : {},
        statues : {}

    };

    com.post(api.ds.balance, {}, function(res){

        balanceSales.types = res.isBalanceSalesType.split("key", "value");
        balanceSales.onetypes = res.isBalanceSalesNoeType.split("key", "value");
        balanceSales.statues = res.isBalanceSalesStatus.split("key", "value");

    });

    var initList = function (v) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list').appendTo($tableWrap);

        if(!v.length){
            var $resultList = com.focusPage("#list").addClass('dz-default dz-message').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;

        }else if (v) {

            $.each(v,function (i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix').appendTo($ul);
                
                var $h3 = $('<h3></h3>').addClass('oid').appendTo($liLine);
                var $title = $('<small></small>').addClass('blue').html(' ' + v.sales.no).appendTo($h3);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);

                var propertyArr = [
                    ["装修单号:", v.sales.orderId, "blue"],
                    ["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber,"grey"],
                    ["品类:",v.sales.category, "grey" ],
                    ["品牌:",v.sales.brand, "grey" ],
                    ["类型:", balanceSales.types[v.type], "red"],
                    ["结算值:", v.pbalance, "blue"],
                    ["一类:", balanceSales.onetypes[v.onetype], "red"],
                    ["状态:", balanceSales.statues[v.status], "red"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });
                
                var $ulDetail = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);
                
                var detailArr = [
                   ["销售收入: ", v.total - v.sales.venderMaling - v.sales.maling - v.sales.coupon, "blue"],
                   ["供应商减免金额: ", v.sales.venderMaling, "blue"],
                   ["折扣/抹零金额: ",v.allowance, "blue" ],
                   ["销售金额: ",v.total + v.sales.venderMaling + v.allowance, "blue" ],
                   ["销售成本: ", v.total + v.sales.venderMaling + v.allowance - v.balance, "blue"],
                   ["销售成本比例: ", (v.total + v.sales.venderMaling + v.allowance - v.balance) / (v.total + v.sales.venderMaling + v.allowance), "blue"],
                   ["应付账款: ", v.total + v.allowance - v.balance, "blue"],
                   ["结算利润: ", v.balance, "blue"],
                   ["公司利润: ", v.balance - v.allowance, "blue"],
               ];
                
                $.each(detailArr, function (index, value) {
                    var $liProperty = $('<li></li>').appendTo($ulDetail);
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                });

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
