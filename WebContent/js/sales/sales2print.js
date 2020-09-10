$(function () {
    
    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;
    
    var options = {
        amountInTotal: 0,
        numberOfCases: 0,
        designer: null, // 设计师
        supervisor: null // 监理
    };
    var data = params.data;
    
    var trList = $("#reslist");
    
    var querySalesItemBySid = api.sales.querySalesItemBySid;

    com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId" : data.orderId}, function(res){
        var decorationInfo = res.decoration;
        options.designer = decorationInfo.designer.currentName == null ? "" : decorationInfo.designer.currentName;
        options.supervisor = decorationInfo.supervisor.currentName == null ? "" : decorationInfo.supervisor.currentName;
    },null, false);
    
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
        "title" : params.company.fullname + "主材代购确认单-定金"
    };
    
    com.post(querySalesItemBySid, {'sales.sid':params.salesSid}, function (data) {
        createList(data.salesItems).appendTo(trList);
    }, null, false);

    function createList(items) {

        var moneryName = "实收定金";
        var netReceipts = utils.changeThrDecimal(data.depositpay);

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:25px;">主材代购确认单</caption>').appendTo(table);

        var tr1 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td1 = $('<td style="border: 1px solid;"></td>').text("装修单号").appendTo(tr1);
        var td2 = $('<td colspan="2" style="border: 1px solid;"></td>').text(data.orderId).appendTo(tr1);
        var td3 = $('<td style="border: 1px solid;"></td>').text("楼盘地址").appendTo(tr1);
        var td4 = $('<td style="border: 1px solid;"></td>').text(data.house.village.name + " " + data.house.houseNumber).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td5 = $('<td style="border: 1px solid;"></td>').text("设计师").appendTo(tr2);
        var td6 = $('<td colspan="2" style="border: 1px solid;"></td>').text(options.designer).appendTo(tr2);
        var td7 = $('<td style="border: 1px solid;"></td>').text("监理").appendTo(tr2);
        var td8 = $('<td style="border: 1px solid;"></td>').text(options.supervisor).appendTo(tr2);

        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td9 = $('<td style="border: 1px solid;"></td>').text("销售单号").appendTo(tr3);
        var td10 = $('<td colspan="2" style="border: 1px solid;"></td>').text(data.no).appendTo(tr3);
        var td11 = $('<td style="border: 1px solid;"></td>').text("品牌").appendTo(tr3);
        var td12 = $('<td style="border: 1px solid;"></td>').text(data.brand).appendTo(tr3);

        var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td13 = $('<td style="border: 1px solid;"></td>').text("开票日期").appendTo(tr4);
        var td14 = $('<td colspan="4" style="border: 1px solid;"></td>').text(data.createTime).appendTo(tr4);

        if(params.flag == "fullPay"){

            printer.args.title = params.company.fullname + "主材代购确认单";

            moneryName = "实收金额";
            netReceipts = utils.changeThrDecimal(data.fullpay);
            var tr5 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
            var td15 = $('<td style="border: 1px solid;"></td>').text("商品名称").appendTo(tr5);
            var td16 = $('<td style="border: 1px solid;"></td>').text("规格").appendTo(tr5);
            var td18 = $('<td style="border: 1px solid;"></td>').text("数量").appendTo(tr5);
            var td19 = $('<td style="border: 1px solid;"></td>').text("售价").appendTo(tr5);
            var td20 = $('<td style="border: 1px solid;"></td>').text("总价").appendTo(tr5);

            var propertyArr = [];
            $.each(items, function (i, v) {
                propertyArr.push([
                    v.goods.name,
                    v.format.info,
                    v.num,
                    v.price,
                    v.total
                ]);

                printer.args.salesItems.push({
                    "name":v.goods.name,
                    "num":v.num,
                    "price":v.price,
                    "unit" :  v.goods.measurementUnit,
                    "total":v.total,
                    "comment" : v.comment
                });
            });

            printer.name = "salesPaymentForFullpay";
            printer.args.referMoney = utils.changeThrDecimal(data.fullpay);
            printer.args.capitalize = utils.getCNMoney(utils.changeThrDecimal(data.fullpay));

            $.each(propertyArr, function (index, value) {
                var tr = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
                $.each(value, function (j, k) {
                    $('<td style="border: 1px solid;"></td>').html(k).appendTo(tr);
                });
            });
        }

        var tr6 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td22 = $('<td style="border: 1px solid;"></td>').text(moneryName).appendTo(tr6);
        var td23 = $('<td colspan="4" style="border: 1px solid;"></td>').text(netReceipts).appendTo(tr6);

        var tr7 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td24 = $('<td style="border: 1px solid;"></td>').text("大写").appendTo(tr7);
        var td25 = $('<td colspan="4" style="border: 1px solid;"></td>').text(utils.getCNMoney(netReceipts)).appendTo(tr7);

        var tr8 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td26 = $('<td style="border: 1px solid;"></td>').text("客户确认").appendTo(tr8);
        var td27 = $('<td colspan="2" style="border: 1px solid;"></td>').text("").appendTo(tr8);
        var td28 = $('<td style="border: 1px solid;"></td>').text("客户电话").appendTo(tr8);
        var td29 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr8);

        var tr9 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td30 = $('<td style="border: 1px solid;"></td>').text("销售经手人").appendTo(tr9);
        var td31 = $('<td colspan="2" style="border: 1px solid;"></td>').text("").appendTo(tr9);
        var td32 = $('<td style="border: 1px solid;"></td>').text("品牌服务电话").appendTo(tr9);
        var td33 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr9);

        var tr10 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td34 = $('<td style="border: 1px solid;"></td>').text("客户须知").appendTo(tr10);
        var td35 = $('<td colspan="4" style="border: 1px solid;"></td>').text("").appendTo(tr10);

        return div;
    }
});

