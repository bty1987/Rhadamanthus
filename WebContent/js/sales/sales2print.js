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
        supervisor: null,// 监理
    };
    var data = params.sales.sales;


    var trList = $("#reslist");


    var querySalesItemBySid = api.sales.querySalesItemBySid;

    com.post(api.decoration.queryDecorationByOrderId, {
        "decorationOrderId": data.orderId
    }, function (res) {

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
    }, function (data) {

        createList(data.salesItems).appendTo(trList);
    }, null, false);

    function createList(items) {

        var moneryName = "实收定金";
        var netReceipts = utils.changeThrDecimal(data.depositpay);

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:25px; font-weight:bolder">商品销售单</caption>').appendTo(table);

        var tr1 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td1 = $('<td style="border: 1px solid;"></td>').text("装修单号").appendTo(tr1);
        var td2 = $('<td style="border: 1px solid;"></td>').text(data.orderId).appendTo(tr1);
        var td3 = $('<td style="border: 1px solid;"></td>').text("楼盘地址").appendTo(tr1);
        var td4 = $('<td style="border: 1px solid;"></td>').text(data.house.village.name + " " + data.house.houseNumber).appendTo(tr1);
        var td5 = $('<td style="border: 1px solid;"></td>').text("渠道").appendTo(tr1);
        var td6 = $('<td style="border: 1px solid;"></td>').text(data.salesman.currentName).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td7 = $('<td style="border: 1px solid;"></td>').text("监理").appendTo(tr2);
        var td8 = $('<td style="border: 1px solid;"></td>').text(options.supervisor).appendTo(tr2);
        var td9 = $('<td style="border: 1px solid;"></td>').text("销售单号").appendTo(tr2);
        var td10 = $('<td style="border: 1px solid;"></td>').text(data.no).appendTo(tr2);
        var td11 = $('<td style="border: 1px solid;"></td>').text("品牌").appendTo(tr2);
        var td12 = $('<td style="border: 1px solid;"></td>').text(data.brand).appendTo(tr2);
        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;"></tr>').appendTo(table);
        var td13 = $('<td style="border: 1px solid;"></td>').text("开单日期").appendTo(tr3);
        var td14 = $('<td colspan="5" style="border: 1px solid;"></td>').text(data.createTime).appendTo(tr3);


        if (params.sales.flag == "fullPay") {

            printer.args.title = params.company.fullname + "主材代购确认单";

            moneryName = "实收金额";
            netReceipts = utils.changeThrDecimal(data.fullpay);
            var tr5 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;"></tr>').appendTo(table);
            var td15 = $('<td style="border: 1px solid;"></td>').text("商品名称").appendTo(tr5);
            var td16 = $('<td style="border: 1px solid;"></td>').text("规格").appendTo(tr5);
            var td18 = $('<td style="border: 1px solid;"></td>').text("数量").appendTo(tr5);
            var td19 = $('<td style="border: 1px solid;"></td>').text("售价").appendTo(tr5);
            var td20 = $('<td style="border: 1px solid;"></td>').text("总价").appendTo(tr5);
            var td20 = $('<td style="border: 1px solid;"></td>').text("商品备注").appendTo(tr5);
            var propertyArr = [];
            $.each(items, function (i, v) {
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

            $.each(propertyArr, function (index, value) {

                var tr = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
                $.each(value, function (j, k) {

                    $('<td style="border: 1px solid;"></td>').html(k).appendTo(tr);
                });
            });
        }

        var tr6 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td22 = $('<td style="border: 1px solid;"></td>').text(moneryName).appendTo(tr6);
        var td23 = $('<td colspan="5" style="border: 1px solid;"></td>').text(netReceipts).appendTo(tr6);

        var tr7 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td24 = $('<td style="border: 1px solid;"></td>').text("大写").appendTo(tr7);
        var td25 = $('<td colspan="5" style="border: 1px solid;"></td>').text(utils.getCNMoney(netReceipts)).appendTo(tr7);

        var tr8 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td26 = $('<td style="border: 1px solid;"></td>').text("购货方姓名").appendTo(tr8);
        var td27 = $('<td style="border: 1px solid;"></td>').text(data.customer.name).appendTo(tr8);
        var td26 = $('<td style="border: 1px solid;"></td>').text("购货方签字").appendTo(tr8);
        var td27 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr8);
        var td28 = $('<td style="border: 1px solid;"></td>').text("购货方电话").appendTo(tr8);
        var td29 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr8);

        var tr9 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td30 = $('<td style="border: 1px solid;"></td>').text("供货方签字").appendTo(tr9);
        var td31 = $('<td colspan="2" style="border: 1px solid;"></td>').text("").appendTo(tr9);
        var td32 = $('<td style="border: 1px solid;"></td>').text("供货方电话").appendTo(tr9);
        var td33 = $('<td colspan="2" style="border: 1px solid;"></td>').text(data.instorer.phone).appendTo(tr9);


        var tr11 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td36 = $('<td style="border: 1px solid;"></td>').text("备注").appendTo(tr11);

        var option = {"brand.bid": data.bid};
        com.post(api.data.queryBrandByBid, option, function (v) {
            var td37 = $('<td colspan="5" style="border: 1px solid;"></td>').text(data.comment + v.brand.comment).appendTo(tr11);

        });
        var tr18 = $('<tr style="border: 1px solid; height: 45px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td44 = $('<td colspan="6" style="font-size:20px;"></td>').text("购货方须知").appendTo(tr18);

        var tr19 = $('<tr style="border: 1px solid; text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td37 = $('<td colspan="6" style="border: 1px solid;"></td>').appendTo(tr19);

        var div2 = $('<div></div>').appendTo(td37);
        var tr12 = $('<tr style="height: 25px; text-align: left; font-size: 15px;"></tr>').appendTo(div2);
        var td38 = $('<td colspan="6" style="margin-left: 50px"></td>').text(
            "1、所退回商品不得影响二次销售（未拆封、未使用、未损坏）。订货（非畅销产品单独订货）下料（方案确定无异议产品下料生产）产品非质量问题不退不换。"
        ).appendTo(tr12);
        var tr13 = $('<tr style="height: 25px; text-align: left;"></tr>').appendTo(div2);
        var td39 = $('<td colspan="6" style="margin-left: 50px"></td>').text(
            "2、符合退货规定的商品，如未送货安装，但已经发生物流、仓储、测量、设计等费用的，退货时需从已交款项中扣除；如已送货上门、已验收的商品发生退货时，产生的费用由购货方负责。"
        ).appendTo(tr13);
        var tr14 = $('<tr style="height: 25px; text-align: left;"></tr>').appendTo(div2);
        var td40 = $('<td colspan="6" style="margin-left: 50px"></td>').text(
            "3、购货方在退货时，此单据以及机打收据退回。"
        ).appendTo(tr14);
        var tr15 = $('<tr style="height: 25px; text-align: left;"></tr>').appendTo(div2);
        var td41 = $('<td colspan="6" style="margin-left: 50px"></td>').text(
            "4、本销售单为方便购货方与供货方开展商品交易所订立的合同，买卖合同主体为购货方和供货方。"
        ).appendTo(tr15);
        var tr16 = $('<tr style="height: 25px; text-align: left;"></tr>').appendTo(div2);
        var td42 = $('<td colspan="6" style="margin-left: 50px"></td>').text(
            "5、购货方和供货方已获悉并保证遵守本销售单各项约定，购货方无正当理由不得任意解除合同，不得拒绝接收货物。"
        ).appendTo(tr16);
        var tr17 = $('<tr style="height: 25px; text-align: left;"></tr>').appendTo(div2);
        var td43 = $('<td colspan="6" style="margin-left: 50px"></td>').text(
            "6、三环内送货免费（不包含无电梯上楼费、倒料费）超出费用另收。 "
        ).appendTo(tr17);


        return div;
    }
});
