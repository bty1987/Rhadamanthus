$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;
    var options = {
        amountInTotal: 0,
        numberOfCases: 0,
        salesman: null,// 渠道
        supervisor: null,
    };
    var data = params.sales.sales;
    var refunds = params.sales.refunds;

    var trList = $("#refundsReslist");

    com.post(api.decoration.queryDecorationByOrderId, {
        "decorationOrderId": data.orderId
    }, function(res) {

        var decorationInfo = res.decoration;
        options.salesman = decorationInfo.salesman.currentName == null ? "" : decorationInfo.salesman.currentName;
        options.supervisor = decorationInfo.supervisor.currentName == null ? "" : decorationInfo.supervisor.currentName;
    }, null, false);

    printer.name = "salesPaymentForRefund";
    printer.args = {
        "orderId": data.orderId,
        "orderAddr": data.house.village.name + " " + data.house.houseNumber,
        "salesman": options.salesman,
        "supervisor": options.supervisor,
        "salesNo": data.no,
        "brand": data.brand,
        "createTime": data.createTime,
        "salesItems": [],
        "title": params.company.fullname + "主材代购退货单",
        "type": data.type
    };
    com.post(api.sales.querySalesRefundsItemBySid, {
        'refunds.sales.sid': data.sid
    }, function(data) {

        createList(data.refundsItems).appendTo(trList);
    }, null, false);

    function createList(items) {

        var div = $('<div align="center" class="col-xs-12"></div>');

        var img = $('<img/>').css("position", "absolute").css("top", "50px").css("left", "50px").appendTo(div);
        com.showImg(img, data.supplier.userPhoto, 200, 200, '');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:23px; font-weight:bolder"></caption>').html((printer.args.type == 1 ? "补贴" : "") + "商品退货单").appendTo(table);

        var tr28 = $('<tr style="height: 20px;"></tr>').appendTo(table);
        var td55 = $('<td rowspan="4"></td>').appendTo(tr28);

        var tr1 = $('<tr style="height: 25px;text-align: right; font-size: 13px;"></tr>').appendTo(table);
        var td1 = $('<td colspan="6"></td>').text("销售单号: ").appendTo(tr1);
        var td2 = $('<td style="border-bottom: 1px solid #3F3F3F; text-align: center;"></td>').text(data.no).appendTo(tr1);
        var tr2 = $('<tr style="height: 25px;text-align: right; font-size: 13px;"></tr>').appendTo(table);
        var td3 = $('<td  colspan="6"></td>').text("退货类型: ").appendTo(tr2);
        var td4 = $('<td style="border-bottom: 1px solid #3F3F3F; text-align: center;"></td>').text(parent.constant.sales().refunds.type.keys[refunds.type]).appendTo(tr2);
        var tr2 = $('<tr style="height: 25px;text-align: right; font-size: 13px;"></tr>').appendTo(table);
        var td3 = $('<td  colspan="6"></td>').text("退单日期: ").appendTo(tr2);
        var td4 = $('<td style="border-bottom: 1px solid #3F3F3F; text-align: center;"></td>').text(refunds.createTime).appendTo(tr2);

        var tr26 = $('<tr style="height: 25px;"></tr>').appendTo(table);

        var tr3 = $('<tr style="height: 30px; text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td9 = $('<td></td>').text("供货方:").appendTo(tr3);
        var td10 = $('<td colspan="3" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.supplier.currentName).appendTo(tr3);
        var td11 = $('<td></td>').text("装修单号: ").appendTo(tr3);
        var td12 = $('<td colspan="3" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.orderId).appendTo(tr3);

        var tr4 = $('<tr style="height: 30px;text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td5 = $('<td></td>').text("客户确认时间: ").appendTo(tr4);
        var td6 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').text(data.affirmTime == null ? "" : data.affirmTime).appendTo(tr4);
        var td56 = $('<td></td>').text("客户电话: ").appendTo(tr4);
        var td57 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').appendTo(tr4);

        var td13 = $('<td></td>').text("品牌: ").appendTo(tr4);
        var td14 = $('<td  colspan="3" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.brand).appendTo(tr4);

        var tr5 = $('<tr style="height: 30px;text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td15 = $('<td></td>').text("楼盘地址: ").appendTo(tr5);
        var td16 = $('<td colspan="3" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.house.village.name + " " + data.house.houseNumber).appendTo(tr5);
        var td17 = $('<td></td>').text("供货方授权代表: ").appendTo(tr5);
        var tr27 = $('<tr style="height: 30px;"></tr>').appendTo(table);

        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);


        if (params.sales.flag == "refund") {

            var tr6 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size:13px; "></tr>').appendTo(table);
            var td17 = $('<td colspan="2" style="border: 1px solid;"></td>').text("商品名称").appendTo(tr6);
            var td18 = $('<td colspan="2" style="border: 1px solid;"></td>').text("规格").appendTo(tr6);
            var td19 = $('<td style="border: 1px solid;"></td>').text("数量").appendTo(tr6);
            var td20 = $('<td style="border: 1px solid;"></td>').text("售价").appendTo(tr6);
            var td21 = $('<td style="border: 1px solid;"></td>').text("总价").appendTo(tr6);

            var propertyArr = [];
            var total = 0;
            $.each(items, function(i, v) {

                if (v.rid != refunds.rid)
                    return true;

                propertyArr.push([v.salesItem.goods.name, v.salesItem.format.info, v.num, v.salesItem.price, v.total]);

                total = utils.accAdd(total, v.total);
                printer.args.salesItems.push({
                    "name": v.salesItem.goods.name,
                    "num": v.num,
                    "unit": v.salesItem.goods.measurementUnit,
                    "price": v.salesItem.price,
                    "total": v.total,
                    "comment": v.salesItem.comment
                });

            });
            $.each(propertyArr, function(index, value) {

                var tr = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size:13px; "></tr>');
                $.each(value, function(j, k) {
                    
                    if (j == 0 || j == 1) {
                        $('<td colspan="2" style="border: 1px solid;"></td>').html(k).appendTo(tr);
                    } else {
                        $('<td style="border: 1px solid;"></td>').html(k).appendTo(tr);
                    }
                });
                tr.appendTo(table);
            });
        }
        
        if (params.sales.flag == "deposit") {
            total = params.sales.sales.depositpay
        }
        
        var tr8 = $('<tr style="border: 1px solid;height: 25px; text-align: center; font-size:13px; "></tr>').appendTo(table);
        var td27 = $('<td style="border: 1px solid;"></td>').text("退款金额").appendTo(tr8);
        var td28 = $('<td colspan="1" style="border: 1px solid;"></td>').text("大写: " + utils.getCNMoney(Math.round(utils.changeThrDecimal(total)))).appendTo(tr8);
        var td25 = $('<td style="border: 1px solid;"></td>').text("退款金额").appendTo(tr8);
        var td26 = $('<td colspan="1" style="border: 1px solid;"></td>').text(Math.round(utils.changeThrDecimal(total))).appendTo(tr8);

        
        var tr13 = $('<tr style="border: 1px solid;height: 25px; text-align: center; font-size:13px; "></tr>').appendTo(table);
        var td40 = $('<td style="border: 1px solid;"></td>').text("购货方签字:").appendTo(tr13);
        var td44 = $('<td colspan="4" style="border: 1px solid;padding-left:75px"></td>').appendTo(tr13);

        var tr14 = $('<tr style="border: 1px solid;height: 25px; text-align: center; font-size:13px; "></tr>').appendTo(table);
        var td41 = $('<td style="border: 1px solid;"></td>').text("供货方签字:").appendTo(tr14);
        var td45 = $('<td colspan="4" style="border: 1px solid;padding-left:75px"></td>').appendTo(tr14);

        var tr15 = $('<tr style="border: 1px solid;height: 25px; text-align: center; font-size:13px; "></tr>').appendTo(table);
        var td42 = $('<td style="border: 1px solid;"></td>').text("备注: ").appendTo(tr15);
        
        if (params.sales.flag == "refund") {
            var td43 = $('<td colspan="6" style="border: 1px solid;padding-left:75px"></td>').text(refunds.comment).appendTo(tr15);
        }
        
        var tr23 = $('<tr style="border: 1px solid; text-align: center; font-size: 10px;"></tr>').appendTo(table);

        com.post(api.data.queryBrandByBid, {
            "brand.bid": data.bid
        }, function(v) {

            var td49 = $('<td colspan="7" style="border: 1px solid;"></td>').text(v.brand.comment == null ? "" : v.brand.comment);
            var td18 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').text(v.brand.agentName == null ? "" : v.brand.agentName).appendTo(tr5);
            var td19 = $('<td></td>').text("电话: ").appendTo(tr5);
            var td20 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').text(v.brand.agentPhone == null ? "" : v.brand.agentPhone).appendTo(tr5);
        });
        
        var tr25 = $('<tr style="height: 25px;"></tr>').appendTo(table);
        var tr24 = $('<tr style="height: 40px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td49 = $('<td ></td>').text("品牌开单人:").appendTo(tr24);
        var td50 = $('<td colspan="2" style="border-bottom: 1px solid #3F3F3F"></td>').appendTo(tr24);
        var td51 = $('<td ></td>').text("品牌开单人电话:").appendTo(tr24);
        var td52 = $('<td colspan="2" style="border-bottom: 1px solid #3F3F3F"></td>').appendTo(tr24);


        return div;
    }
});