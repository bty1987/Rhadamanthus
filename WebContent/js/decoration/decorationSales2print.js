$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;

    var index = 0;
    var $total = 0;
    var $totalSalesAndMaterial = 0;
    var $totalDeposit = 0;

    var decoration = {};
    var orderType = {};
    var decorationHolonomy = {};
    var materialBalance;
    var brandName = [];

    var trList = $("#reslist");

    // 装修单信息
    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": params.decoration.orderId
    }, function(res) {

        decoration = res.decoration;
    }, null, false);

    // 订单类型
    com.post(api.ds.decoration, {}, function(res) {

        orderType = res.typeness.split("key", "value");
    }, null, false);

    // 配比金额(主材总额)
    com.post(api.decoration.queryDecorationHolonomy, {
        "decorationHolonomy.decoration.orderId": params.decoration.orderId
    }, function(res) {

        decorationHolonomy = res.decorationHolonomy;
    }, null, false);

    // 主材预付款
    com.post(api.payment.queryAdvancePaymentByOrderId, {
        "advancePayment.decoration.orderId": params.decoration.orderId
    }, function(res) {

        materialBalance = res.materialAdvance;
    }, null, false);

    var table = createHeader().appendTo(trList);

    var purCategory = [];
    var unpCategory = [];

    com.post(api.payment.querySalesPaymentByOrderId, {
        "salesPayment.sales.orderId": params.decoration.orderId
    }, function(res) {

        createLine(res.salesPayments);
        createFooter();
    }, null, false);

    com.post(api.data.queryCategory, {}, function(res) {

        $.each(res.categorys, function(index, value) {

            if (value.type == 0)
                return;

            if (unpCategory.indexOf(value.name) == -1 && (value.name) != "") {
                unpCategory.push(value.name);
            }
        });
    }, null, false);

    function createHeader() {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:25px;">' + params.company.name + '主材消费明细</caption>').appendTo(table);

        var tr1 = $('<tr></tr>').appendTo(table);
        var td1 = $('<td colspan="2" style="border: 1px solid;"></td>').text("客户姓名：" + decoration.customer.name).appendTo(tr1);
        var td2 = $('<td colspan="2" style="border: 1px solid;"></td>').text("装修单号：" + decoration.orderId).appendTo(tr1);
        var td3 = $('<td colspan="2" style="border: 1px solid;"></td>').text("楼盘地址：" + decoration.house.village.name + " " + decoration.house.houseNumber).appendTo(tr1);

        var tr2 = $('<tr></tr>').appendTo(table);
        var td4 = $('<td colspan="2" id="orderType" style="border: 1px solid;"></td>').text("订单类型：" + orderType[decoration.typeness]).appendTo(tr2);
        var td5 = $('<td colspan="2" style="border: 1px solid;"></td>').text("设计师：" + decoration.designer.currentName).appendTo(tr2);
        var td6 = $('<td colspan="2" style="border: 1px solid;"></td>').text("设计部：" + decoration.designer.dept.name).appendTo(tr2);

        var tr3 = $('<tr></tr>').appendTo(table);
        var td7 = $('<td colspan="2" style="border: 1px solid;"></td>').text(decorationHolonomy.materialPrice == null ? "配比金额：0" : "配比金额：" + decorationHolonomy.materialPrice).appendTo(tr3);
        var td8 = $('<td colspan="2" style="border: 1px solid;"></td>').text("主材预付款余额：" + materialBalance).appendTo(tr3);
        var td9 = $('<td colspan="2" id = "tr3_total" style="border: 1px solid;"></td>').appendTo(tr3);

        var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td10 = $('<td style="border: 1px solid;"></td>').text("序号").appendTo(tr4);
        var td11 = $('<td colspan="2" style="border: 1px solid;"></td>').text("品类").appendTo(tr4);
        var td12 = $('<td colspan="2" style="border: 1px solid;"></td>').text("品牌").appendTo(tr4);
        var td13 = $('<td style="border: 1px solid;"></td>').text("金额").appendTo(tr4);

        return table;
    }

    function createLine(items) {

        if (items && items.length) {
            $.each(items, function(i, v) {

                var salesReceipt = v.salesReceipt;

                if (v.status == 0)
                    return true;

                if (purCategory.indexOf(v.sales.category) == -1) {
                    purCategory.push(v.sales.category);
                };

                if (unpCategory.indexOf(v.sales.category) != -1 && unpCategory.splice(unpCategory.indexOf(v.sales.category), 1))
                    ;

                var $salesBrands = com.focusPage("[name='" + v.sales.brand + "']");

                if (![2, 7].indexOf(v.type) != -1 && v.status == 2) {
                    var $totalSales = [4, 5, 6].indexOf(v.type) != -1 ? -v.referMoney : v.referMoney;
                    $totalSalesAndMaterial = utils.changeThrDecimal($totalSalesAndMaterial + $totalSales);
                }

                if (v.type == 2) {
                    $totalDeposit = utils.changeThrDecimal($totalDeposit + v.referMoney);
                }

                if (brandName.indexOf(v.sales.brand) != -1) {

                    var $salesBrand = com.focusPage($salesBrands[0]);
                    var $brandTotal = com.focusPage($salesBrand.find("[name='total']")[0]);

                    var _value = parseFloat($brandTotal.attr('value'));
                    var _refer = [2, 3, 8].indexOf(v.type) != -1 ? v.referMoney : -v.referMoney;

                    var arrGet = $.inArray(v.sales.brand, brandName) + 1;

                    $("#tr5_refer" + arrGet + "").attr("value", _value);
                    $("#tr5_refer" + arrGet + "").text(_value);

                    $total = utils.changeThrDecimal($total + _refer);
                } else {

                    index = index + 1;
                    var _refer = [2, 3, 8].indexOf(v.type) != -1 ? v.referMoney : -v.referMoney;

                    var tr5 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
                    var td14 = $('<td style="border: 1px solid;"></td>').text(index).appendTo(tr5);
                    var td15 = $('<td colspan="2" style="border: 1px solid;"></td>').text(v.sales.category).appendTo(tr5);
                    var td16 = $('<td colspan="2" style="border: 1px solid;"></td>').text(v.sales.brand).appendTo(tr5);
                    var td17 = $('<td id="tr5_refer' + index + '" style="border: 1px solid;"></td>').attr("value", _refer).text(_refer).appendTo(tr5);
                    brandName.push(v.sales.brand);
                    $total = utils.changeThrDecimal($total + _refer);
                }

            });
        }
    }

    function createFooter() {

        var tr6 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td18 = $('<td rowspan="3" style="border: 1px solid;"></td>').text("备注说明").appendTo(tr6);
        var td19 = $('<td colspan="5" style="border: 1px none;border-right:1px solid;"></td>').text("1、此表格为客户在我公司消费的主材款项明细，方便客户查询。").appendTo(tr6);

        var tr7 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td20 = $('<td colspan="5" style="border: 1px none;border-right:1px solid;"></td>').text("2、此表格数据为导出打印即时数据，如后期款项发生变化以当时数据为准。").appendTo(tr7);

        var tr8 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td21 = $('<td colspan="5" style="border: 1px solid;border-top:1px none;"></td>').text("3、此数据为系统数据，可能会有延迟，如有任何疑问联系销售管家进行核实。").appendTo(tr8);

        $("#tr3_total").text("合计消费金额：" + $total);
    }

});