$(function ($) {
    
    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    printer = parent.printer;
    
    var params = {
        serverPath : window.server,
        authentication : parent.params.authentication,
        params : parent.params,
        amountInTotal:0,
        numberOfCases:0,
        designer:null,//设计师
        supervisor:null//监理
    };
    
    var trList = $("#reslist");
    var querySalesItemBySid = api.sales.querySalesItemBySid;
    
    com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId" : params.params.data.orderId}, function(res){
        var decorationInfo = res.decoration;
        params.designer = decorationInfo.designer.currentName == null ? "" : decorationInfo.designer.currentName;
        params.supervisor = decorationInfo.supervisor.currentName == null ? "" : decorationInfo.supervisor.currentName;
    },null, false);
    
    printer.name = "salesPaymentForDeposit";
    printer.args = {
        "orderId": params.params.data.orderId,
        "orderAddr": params.params.data.house.village.name + " " + params.params.data.house.houseNumber,
        "designer": params.designer,
        "supervisor": params.supervisor,
        "salesNo": params.params.data.no,
        "brand": params.params.data.brand,
        "createTime": params.params.data.createTime,
        "referMoney": utils.changeThrDecimal(params.params.data.depositpay),
        "capitalize": utils.getCNMoney(utils.changeThrDecimal(params.params.data.depositpay)),
        "salesItems": []
    };

    com.post(querySalesItemBySid, {
        'sales.sid':params.params.salesSid
    }, function (data) {
        var tr1 = createList(data.salesItems);
        tr1.appendTo(trList);
    }, null, false);

    function createList(data) {

        var moneryName = "实收定金";
        var netReceipts = utils.changeThrDecimal(params.params.data.depositpay);

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:40px;">主材代购确认单</caption>').appendTo(table);

        var tr1 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td1 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("装修单号").appendTo(tr1);
        var td2 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.orderId).appendTo(tr1);
        var td3 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("楼盘地址").appendTo(tr1);
        var td4 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.house.village.name + " " + params.params.data.house.houseNumber).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td5 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("设计师").appendTo(tr2);
        var td6 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.designer).appendTo(tr2);
        var td7 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("监理").appendTo(tr2);
        var td8 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.supervisor).appendTo(tr2);

        var tr3 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td9 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("销售单号").appendTo(tr3);
        var td10 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.no).appendTo(tr3);
        var td11 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("品牌").appendTo(tr3);
        var td12 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.brand).appendTo(tr3);

        var tr4 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td13 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("开票日期").appendTo(tr4);
        var td14 = $('<td colspan="4" style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text(params.params.data.createTime).appendTo(tr4);

        if(params.params.flag == "fullPay"){
            moneryName = "实收金额";
            netReceipts = utils.changeThrDecimal(params.params.data.fullpay);
            var tr5 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
            var td15 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("商品名称").appendTo(tr5);
            var td16 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text("规格").appendTo(tr5);
            var td18 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text("数量").appendTo(tr5);
            var td19 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("售价").appendTo(tr5);
            var td20 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>-->').text("总价").appendTo(tr5);

            var propertyArr = [];
            $.each(data, function (i, v) {
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
                    "total":v.total
                });
            });

            printer.name = "salesPaymentForFullpay";
            printer.args.referMoney = utils.changeThrDecimal(params.params.data.fullpay);
            printer.args.capitalize = utils.getCNMoney(utils.changeThrDecimal(params.params.data.fullpay));
            
            $.each(propertyArr, function (index, value) {
                var tr = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>');
                $.each(value, function (j, k) {
                    var $td = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').html(k);
                    $td.appendTo(tr);
                });
                tr.appendTo(table);
            });
        }

        var tr6 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td22 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text(moneryName).appendTo(tr6);
        var td23 = $('<td colspan="4" style="border: 1px solid;height: 54px;text-align: center;"></td>').text(netReceipts).appendTo(tr6);

        var tr7 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td24 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("大写").appendTo(tr7);
        var td25 = $('<td colspan="4" style="border: 1px solid;height: 54px;text-align: center;"></td>').text(utils.getCNMoney(netReceipts)).appendTo(tr7);

        var tr8 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td26 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("客户确认").appendTo(tr8);
        var td27 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>').text("").appendTo(tr8);
        var td28 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("客户电话").appendTo(tr8);
        var td29 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("").appendTo(tr8);

        var tr9 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td30 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("销售经手人").appendTo(tr9);
        var td31 = $('<td colspan="2" style="border: 1px solid;height: 54px;text-align: center;"></td>').text("").appendTo(tr9);
        var td32 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("品牌服务电话").appendTo(tr9);
        var td33 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("").appendTo(tr9);

        var tr10 = $('<tr style="border: 1px solid;height: 54px;text-align: center;"></tr>').appendTo(table);
        var td34 = $('<td style="border: 1px solid;height: 54px;text-align: center;"></td>').text("客户须知").appendTo(tr10);
        var td35 = $('<td colspan="4" style="border: 1px solid;height: 54px;text-align: center;"></td>').text("").appendTo(tr10);

        return div;
    }
});

