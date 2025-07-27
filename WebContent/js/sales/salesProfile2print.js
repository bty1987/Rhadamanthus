$(function () {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;
    constant = parent.constant;

    var salesProfile = params.salesProfile;

    var sid = params.sid;
    var trList = $("#reslist");
    var table;
    var tabody = $('<tbody> </tbody>');
    var arrayValue = [];

    setTimeout(function () {

        table = createHeader().appendTo(trList);
        pageList(1, 50);
        tabody.appendTo(table);
        updateTotalDay();
    }, 500);

    function pageList(page, rows) {

        com.post(api.sales.querySalesProfileByOrderId, {
            "salesProfile.orderId": salesProfile.orderId
        }, function (res) {

            createLine(res.salesProfile.items);

        }, null, false);
    }

    function createHeader() {

        var printSales = null;

        com.post(api.sales.querySalesBySid, {
            "sales.sid": sid
        }, function (res) {

            printSales = res.sales;

        }, null, false);

        var decorationInfo = null;

        com.post(api.decoration.queryDecorationByOrderId, {
            "decorationOrderId": salesProfile.orderId
        }, function (res) {

            decorationInfo = res.decoration;
        }, null, false);

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:20px;">销售单品牌满意度表</caption>').appendTo(table);

        var tr1 = $('<tr style="font-size: 6px;"></tr>').appendTo(table);
        var td2 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("订单编号").appendTo(tr1);
        var td3 = $('<td colspan="1" style="border: 1px solid; text-align: center;"></td>').text(salesProfile.orderId).appendTo(tr1);
        var td4 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("楼盘").appendTo(tr1);
        var td3 = $('<td colspan="1" style="border: 1px solid; text-align: center;"></td>').text(printSales.house.village.name + " " + printSales.house.houseNumber).appendTo(tr1);

        var tr2 = $('<tr style="font-size: 6px;"></tr>').appendTo(table);
        var td5 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("设计师").appendTo(tr2);
        var td6 = $('<td colspan="1" style="border: 1px solid; text-align: center;"></td>').text(decorationInfo.designer.currentName == null ? "无" : decorationInfo.designer.currentName).appendTo(tr2);
        var td7 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("签单日期").appendTo(tr2);
        var td8 = $('<td colspan="1" style="border: 1px solid; text-align: center;"></td>').text(decorationInfo.status == constant.decoration().decoration.STATUS_PROSIGN_INT ? decorationInfo.precontractTime : decorationInfo.contractTime).appendTo(tr2);

        var tr4 = $('<tr style="font-size: 6px;"></tr>').appendTo(table);
        var td9 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("创建时间").appendTo(tr4);
        var td10 = $('<td colspan="1" style="border: 1px solid; text-align: center;"></td>').text(decorationInfo.createTime).appendTo(tr4);
        var td9 = $('<td colspan="2" style="border: 1px solid; height: 25px; text-align: center;"></td>').appendTo(tr4);



        var tr3 = $('<tr style="font-size: 6px;"></tr>').appendTo(table);
        var td5 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("品牌").appendTo(tr3);
        var td6 = $('<td colspan="1" style="border: 1px solid; text-align: center;"></td>').text("评分").appendTo(tr3);
        var td7 = $('<td colspan="2" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("备注说明").appendTo(tr3);

        return table;
    }

    function mergePhaseCells(tbody) {

        var prevPhase = null;
        var startRow = null;
        var rowspan = 1;

        $(tbody).find('tr').each(function (index) {

            var currentCell = $(this).find('td').eq(0); // phase列是第0列
            var currentPhase = currentCell.text().trim();

            if (currentPhase === prevPhase) {
                rowspan++;
                $(startRow).attr('rowspan', rowspan);
                currentCell.remove();
            } else {
                prevPhase = currentPhase;
                startRow = currentCell;
                rowspan = 1;
            }
        });
    }

    function createLine(items) {

        $.each(items, function (i, v) {

            if (v.spiid == null)
                return true;
            if (v.type === 0) {

            } else if (v.type === 2) {
                var tr4 = $('<tr style="border: 1px solid;height: 25px; font-size: 7px;"></tr>').appendTo(tabody);
                var td16 = $('<td colspan="1"   style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.name, "")).appendTo(tr4);
                var td161 = $('<td colspan="1"   style="border: 1px solid;text-align: center;"></td>').appendTo(tr4);

                $.each(v.options, function (i, n) {

                    if (n.checked === 0) {
                        $('<span style="text-align: center;"></span>').text(com.checkNull(n.title, "")).appendTo(td161);
                    }

                });

                var td162 = $('<td colspan="2" id="td' + i + '" style="border: 1px solid;text-align: center;"></td>').appendTo(tr4);

            } else if (v.type === 1) {
                arrayValue.push(com.checkNull(v.content, ""));
            }

            mergePhaseCells(tabody);
        });

    }

    function updateTotalDay() {

        var $tdElements = $('td[id^="td"]');

        $tdElements.each(function (index) {
            var $td = $(this);
            $td.text(arrayValue[index] || '');
        });

    }

});
