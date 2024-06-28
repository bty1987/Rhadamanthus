$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;

    var options = {
        amountInTotal: 0,
        numberOfCases: 0,
        designer: null, // 设计师
        supervisor: null,// 监理
    };
    var data = params.sales.sales;

    var trList = $("#reslist");

    var querySalesItemBySid = api.sales.querySalesItemBySid;

    com.post(api.decoration.queryDecorationByOrderId, {
        "decorationOrderId": data.orderId
    }, function(res) {

        var decorationInfo = res.decoration;
        options.designer = decorationInfo.designer.currentName == null ? "" : decorationInfo.designer.currentName;
        options.supervisor = decorationInfo.supervisor.currentName == null ? "" : decorationInfo.supervisor.currentName;
    }, null, false);

    printer.name = "salesPaymentForDeposit";
    printer.args = {
        "orderId": data.orderId,
        "orderAddr": data.house.village.name + " " + data.house.houseNumber,
        "designer": options.designer,
        "supervisor": options.supervisor,
        "salesNo": data.no,
        "brand": data.brand,
        "createTime": data.createTime,
        "referMoney": utils.changeThrDecimal(data.depositpay),
        "capitalize": utils.getCNMoney(utils.changeThrDecimal(data.depositpay)),
        "salesItems": [],
        "title": params.company.fullname + "主材代购确认单-定金"
    };

    com.post(querySalesItemBySid, {
        'sales.sid': params.sales.sales.sid
    }, function(data) {

        createList(data.salesItems).appendTo(trList);
    }, null, false);

    function createList(items) {

        var moneryName = "实收定金";
        var netReceipts = utils.changeThrDecimal(data.depositpay);

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:23px; font-weight:bolder">商品销售单</caption>').appendTo(table);

        var tr28 = $('<tr style="height: 70px;"></tr>').appendTo(table);
        var td55 = $('<td rowspan="3"></td>').appendTo(tr28);
        var img = $('<img/>').appendTo(td55);
        com.showImg(img, data.supplier.userPhoto, 150, 150, '');
        var tr1 = $('<tr style="height: 25px;text-align: right; font-size: 13px;"></tr>').appendTo(table);
        var td1 = $('<td colspan="6"></td>').text("销售单号: ").appendTo(tr1);
        var td2 = $('<td style="border-bottom: 1px solid #3F3F3F; text-align: center;" ></td>').text(data.no).appendTo(tr1);
        var tr2 = $('<tr style="height: 25px;text-align: right; font-size: 13px;"></tr>').appendTo(table);
        var td3 = $('<td  colspan="6"></td>').text("开单日期: ").appendTo(tr2);
        var td4 = $('<td style="border-bottom: 1px solid #3F3F3F" ></td>').text("").appendTo(tr2);

        var tr26 = $('<tr style="height: 25px;"></tr>').appendTo(table);

        var tr3 = $('<tr style="height: 30px; text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td9 = $('<td></td>').text("供货方:").appendTo(tr3);
        var td10 = $('<td colspan="3" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.supplier.currentName).appendTo(tr3);
        var td11 = $('<td></td>').text("装修单号: ").appendTo(tr3);
        var td12 = $('<td colspan="3" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.orderId).appendTo(tr3);

        var tr4 = $('<tr style="height: 30px;text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td5 = $('<td></td>').text("客户确认时间: ").appendTo(tr4);
        var td6 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').text(data.affirmTime).appendTo(tr4);
        var td56 = $('<td></td>').text("客户电话: ").appendTo(tr4);
        var td57 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').text(data.phone).appendTo(tr4);

        var td13 = $('<td></td>').text("品牌: ").appendTo(tr4);
        var td14 = $('<td  colspan="3" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.brand).appendTo(tr4);

        var tr5 = $('<tr style="height: 30px;text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td15 = $('<td></td>').text("楼盘地址: ").appendTo(tr5);
        var td16 = $('<td colspan="3" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.house.village.name + " " + data.house.houseNumber).appendTo(tr5);
        var td17 = $('<td></td>').text("供货方授权代表: ").appendTo(tr5);
        var tr27 = $('<tr style="height: 30px;"></tr>').appendTo(table);

        var tr6 = $('<tr style="height: 20px; text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td21 = $('<td colspan="8" ></td>').text("为了购货方的合法权益得到有效保障,请详细阅读本单据购货方须知,并确认单据内各项购物内容。").appendTo(tr6);
        var tr7 = $('<tr style="height: 20px; text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td22 = $('<td colspan="8" ></td>').text("一经签字确认,将视同购货方对本单据所有内容均表示同意。").appendTo(tr7);

        if (params.sales.flag == "fullPay") {

            printer.args.title = params.company.fullname + "主材代购确认单";

            moneryName = "实收金额";
            netReceipts = utils.changeThrDecimal(data.fullpay);
            var tr8 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 13px;"></tr>').appendTo(table);

            var td24 = $('<td colspan="3" style="border: 1px solid;"></td>').text("商品名称").appendTo(tr8);
            var td25 = $('<td style="border: 1px solid;"></td>').text("规格").appendTo(tr8);
            var td26 = $('<td style="border: 1px solid;"></td>').text("数量").appendTo(tr8);
            var td27 = $('<td style="border: 1px solid;"></td>').text("单价").appendTo(tr8);
            var td28 = $('<td style="border: 1px solid;"></td>').text("总价").appendTo(tr8);
            var td29 = $('<td style="border: 1px solid;"></td>').text("商品备注").appendTo(tr8);
            var propertyArr = [];
            $.each(items, function(i, v) {

                propertyArr.push([v.goods.name, v.format.info, v.num, v.price, v.total, v.comment]);

                printer.args.salesItems.push({
                    "name": v.goods.name,
                    "num": v.num,
                    "price": v.price,
                    "unit": v.goods.measurementUnit,
                    "total": v.total,
                    "comment": v.comment
                });
            });

            printer.name = "salesPaymentForFullpay";
            printer.args.referMoney = utils.changeThrDecimal(data.fullpay);
            printer.args.capitalize = utils.getCNMoney(utils.changeThrDecimal(data.fullpay));

            $.each(propertyArr, function(index, value) {

                var tr = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
                $.each(value, function(j, k) {

                    if (j == 0) {
                        $('<td colspan="3" style="border: 1px solid;"></td>').html(k).appendTo(tr);
                    } else {
                        $('<td style="border: 1px solid;"></td>').html(k).appendTo(tr);
                    }
                });
            });
        }

        var tr9 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td30 = $('<td style="border: 1px solid;"></td>').text(moneryName).appendTo(tr9);
        var td36 = $('<td style="border: 1px solid;"></td>').text("大写:").appendTo(tr9);
        var td31 = $('<td colspan="3" style="border: 1px solid;"></td>').text(utils.getCNMoney(netReceipts)).appendTo(tr9);
        var td32 = $('<td style="border: 1px solid;"></td>').text("小写:").appendTo(tr9);
        var td33   = $('<td colspan="2" style="border: 1px solid;"></td>').text(netReceipts).appendTo(tr9);

        var tr10 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td34 = $('<td style="border: 1px solid;"></td>').text("温馨提示").appendTo(tr10);
        var td35 = $('<td colspan= "7" style="border: 1px solid;"></td>').text(data.comment).appendTo(tr10);

        var tr18 = $('<tr style="border: 1px solid; height: 45px;text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td44 = $('<td colspan="8" style="font-size:13px;"></td>').text("购货方须知").appendTo(tr18);

        var tr19 = $('<tr style="border: 1px solid; text-align: center; font-size: 13px;"></tr>').appendTo(table);
        var td37 = $('<td colspan="8" style="border: 1px solid;"></td>').appendTo(tr19);

        var div2 = $('<div></div>').appendTo(td37);

        com.post(api.data.queryTalking, {
            "types[0]": 6
        }, function(v) {

            var talkings = v.talkings

            if (!talkings || talkings.length == 0)
                return false;

            $.each(talkings, function(i, v) {

                if (!v.content)
                    return true;

                var tr = $('<tr style="text-align: left; font-size: 10px;"></tr>').appendTo(div2);
                var td = $('<td colspan="8" style="margin-left: 50px"></td>').html(v.content).appendTo(tr);
            });
        });

        var tr23 = $('<tr style="border: 1px solid; text-align: center; font-size: 10px;"></tr>').appendTo(table);
        var td48 = $('<td style="border: 1px solid;"></td>').text("特殊说明:").appendTo(tr23);
        var option = {
            "brand.bid": data.bid
        };
        com.post(api.data.queryBrandByBid, option, function(v) {

            var td49 = $('<td colspan="7" style="border: 1px solid;"></td>').text(v.brand.comment).appendTo(tr23);
            var td18 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').text(v.brand.agentName).appendTo(tr5);
            var td19 = $('<td></td>').text("电话: ").appendTo(tr5);
            var td20 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').text(v.brand.agentPhone).appendTo(tr5);

        });
        console.log(data)
        var tr25 = $('<tr style="height: 25px;"></tr>').appendTo(table);
        var tr24 = $('<tr style="height: 40px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td49 = $('<td ></td>').text("品牌开单人:").appendTo(tr24);
        var td50 = $('<td colspan="2" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.instorer.currentName).appendTo(tr24);
        var td51 = $('<td ></td>').text("品牌开单人电话:").appendTo(tr24);
        var td52 = $('<td colspan="2" style="border-bottom: 1px solid #3F3F3F"></td>').text(data.instorer.phone).appendTo(tr24);
        var td53 = $('<td ></td>').text("供货方授权代表签字:").appendTo(tr24);
        var td54 = $('<td style="border-bottom: 1px solid #3F3F3F"></td>').text("").appendTo(tr24);

        return div;
    }
});
