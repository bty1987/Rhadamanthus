$(function() {

    var refund = {
        rid: params.rid,
        flag: params.flag,
        sid: params.sales.sales.sid,
        sales: params.sales.sales,
        refundType: constant.sales().refunds.type.keys,
    };
    com.focusPage('#fl-statement').statement("销售单", "退货");

    com.post(api.sales.querySalesRefundsBySid, {
        "refunds.sales.sid": refund.sid
    }, function(res) {

        var $list = [];
        var $tableWrap = com.focusPage('#fl-statement');
        var $div = $('<div></div>').attr("id", "listItems").addClass('col-xs-12');
        var $ul;

        $.each(res.refundses, function(i, v) {
            if ($list.indexOf(v.rid) == -1) {
                $list.push(v.rid);
                $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list').attr("id", v.rid).css("margin-bottom", "20px");
            }
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $small = $('<small></small>').addClass('blue').html(refund.sales.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

            var $print = $('<a></a>').addClass('btn btn-minier btn-pink').attr("id", v.rid).attr("type", constant.sales().refunds.type.keys[v.type]).attr("createTime", v.createTime).attr('total', v.total).html('打印').appendTo($btnDiv);

            var propertyArr = [["商品品类:", refund.sales.category, "grey"], ["商品品牌:", refund.sales.brand.name, "grey", tools.brand.info, refund.sales.bid], ["退款总额:", v.total, "blue"], ["类型:", constant.sales().refunds.type.keys[v.type], "red"], ["创建人:", v.creater.currentName, "grey", tools.personel.info, v.creater.userId], ["创建时间:", v.createTime, "green"], ["备注:", v.comment, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>').appendTo($ulProperty);

                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                if (value.length == 5) {
                    $liProperty.click(function() {

                        value[3]($liProperty, value[4]);

                    }).css("cursor", "pointer");
                }
            });

            $liLine.appendTo($ul);
            $liLine.append($h3).append($ulProperty);
            $small.appendTo($h3);
            $btnDiv.appendTo($h3);
            $ul.appendTo($div);

            $print.click(function() {

                params.sales.sales = refund.sales;
                params.sales.refunds = v;
                params.sales.flag = "refund";
                
                com.popup("销售退货单:" + refund.sales.orderId, api.index.salesRefundsPrintIndex.url, function() {

                    parent.layer.getFrameIndex(window.name);
                }, null, true);
            });
        });

        $div.appendTo($tableWrap);

    }, null, false);


    if (refund.flag == "refunds"){
        url = api.sales.querySalesRefundsItemByRid
        options = {"refunds.rid": refund.rid}
    }else if (refund.flag == "sales"){
        var url = api.sales.querySalesRefundsItemBySid
        var options = {"refunds.sales.sid": refund.sid}
    }

    com.post(url, options, function(data) {

        if (data.refundsItems.length == 0) {
            emptyData("list");
        } else {
            initList(data.refundsItems);
        }
    });

    var initList = function(listData) {

        if (listData && listData.length) {
            $.each(listData, function(i, v) {

                var rid = v.rid;
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(v.salesItem.goods.name + ' ' + v.salesItem.goods.no);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var propertyArr = [["商品品类:", v.salesItem.goods.category, "grey"], ["商品颜色:", v.salesItem.color.name, "grey"], ["商品规格:", v.salesItem.format.info, "grey"], ["售价:", v.salesItem.selling, "blue"], ["折扣价:", v.salesItem.disPrice, "blue"], ["折让价:", v.salesItem.price, "blue"], ["数量:", v.num, "blue"], ["总价:", v.total, "blue"], ["原结算方式:", v.salesItem.rawCtype == 0 ? "底价" : "点位", "red"], ["原结算值:", v.salesItem.rawCvalue, "blue"], ["结算方式:", v.salesItem.ctype == 0 ? "底价" : "点位", "red"], ["结算值:", v.salesItem.cvalue, "blue"], ["备注:", v.salesItem.comment, "grey"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.append($h3).append($ulProperty);
                $small.appendTo($h3);
                $btnDiv.appendTo($h3);
                $liLine.appendTo(com.focusPage("#" + rid));
            });
        }
    };

    function emptyData(id) {

        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }
});