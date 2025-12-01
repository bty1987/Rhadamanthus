$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;

    var options = {
        totalPostpricet: 0,
        totalSettlementAmount: 0,
        totalNum: 0,
        totalRefnum: 0,
        totalUtility: 0
    };

    var serNum = 0;
    var balanceSelection = {};
    var brand = {};
    var creater = {};
    var trList = $("#reslist");

    com.post(api.balance.queryBalanceSelectionByBsid, {"balanceSelection.bsid": params.balance.bsid}, function(res) {

        balanceSelection = res.balanceSelection;
        brand = balanceSelection.brand;
        creater = balanceSelection.creater;
    }, null, false);

    var table;
    var tabody = $('<tbody> </tbody>');

    setTimeout(function() {

        table = createHeader().appendTo(trList);
        pageList(1, 50);
        tabody.appendTo(table);

     }, 500);

    var index = 0;
    function pageList(page, rows) {

        var option = {
            "paging.page": page,
            "paging.rows": rows,
            "balanceSelection.bsid": params.balance.bsid
        };

        com.post(api.balance.pageBalanceSelectionItem, option, function(res) {

            createLine(res.paging.data);
            if (page < res.paging.totalPage) setTimeout(function() {pageList(page+1, rows);}, 500);
            else createFooter();

        }, null, false);
    };

    if (params.balance.type == 1) {

        createHeader = createComHeader;
        createLine = createComLine;
        createFooter = createComFooter;
    }

    function createComHeader() {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:20px;">供应商对账单</caption>').appendTo(table);

        var tr1 = $('<tr style="font-size: 7px;"></tr>').appendTo(table);
        var td1 = $('<td colspan="7" style="border: 1px solid;"></td>').text("供应商名称: " + brand.name).appendTo(tr1);
        var td2 = $('<td colspan="7" style="border: 1px solid;"></td>').text("负责对账员: " + creater.userName).appendTo(tr1);
        var td3 = $('<td colspan="7" style="border: 1px solid;"></td>').text("单号: " + balanceSelection.name).appendTo(tr1);
        var tr2 = $('<tr colspan="21" style="border: 1px solid;height: 60px;text-align: center; font-size: 7px;"></tr>').appendTo(table);

        var td37 = $('<td colspan="21" style="border: 1px solid;"></td>').appendTo(tr2);
        var span1 = $('<span></span>').text("首先感谢贵公司对我司的支持！为明确双方往来款项的准确清晰，" +
            "特将贵公司与我司往来账款明细列出，如以下交易无误、核对相符，请在“数据核对无误”处盖章并签字确认，" +
            "本次账单厂商结算额为: 人民币").appendTo(td37);
        var span2 = $('<span></span>').attr("id", "totalPos").text("").appendTo(span1);
        var span3 = $('<span></span>').text(")").appendTo(span1);

        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(table);
        var td4 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("品牌").appendTo(tr3);
        var td5 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("订单编号").appendTo(tr3);
        var td6 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("地址").appendTo(tr3);
        var td7 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("户型").appendTo(tr3);
        var td8 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("功能区").appendTo(tr3);
        var td9 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("品类").appendTo(tr3);
        var td10 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("一级类别").appendTo(tr3);
        var td11 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("二级类别").appendTo(tr3);
        var td12 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("三级类别").appendTo(tr3);
        var td13 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("型号").appendTo(tr3);
        var td14 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("颜色").appendTo(tr3);
        var td15 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("规格").appendTo(tr3);
        var td16 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("单位").appendTo(tr3);
        var td17 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("数量").appendTo(tr3);
        var td18 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("单价=战盟价格").appendTo(tr3);
        var td19 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("结算值").appendTo(tr3);
        var td20 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("合计金额").appendTo(tr3);
        var td21 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("备注").appendTo(tr3);
        var td22 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("面积").appendTo(tr3);
        var td23 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("标配/升级").appendTo(tr3);
        return table;
    }

    function createComLine(items) {

        $.each(items, function(i, v) {

            var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(tabody);
            var td24 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.goods.brand).appendTo(tr4);
            var td25 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.decoration.orderId).appendTo(tr4);
            var td26 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.decoration.house.village.name + " " + v.selectionItem.decoration.house.houseNumber).appendTo(tr4);
            var td27 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.decoration.house.houseType).appendTo(tr4);
            var td28 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.areaName).appendTo(tr4);
            var td29 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.goods.category).appendTo(tr4);
            var td30 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.goods.onekind.name).appendTo(tr4);
            var td31 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.goods.twokind.name).appendTo(tr4);
            var td32 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.goods.thrkind.name).appendTo(tr4);
            var td33 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.goods.name).appendTo(tr4);
            var td34 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr4);
            var td35 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr4);
            var td36 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.goods.measurementUnit).appendTo(tr4);
            var td37 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)))).appendTo(tr4);
            var td38 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.postprice).appendTo(tr4);
            var td39 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(utils.accMul(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.postprice)))).appendTo(tr4);
            var td40 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(utils.accMul(utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum)), parseFloat(v.selectionItem.postprice)))).appendTo(tr4);
            var td41 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.comment).appendTo(tr4);
            var td42 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.decoration.house.innerArea).appendTo(tr4);
            var td43 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr4);

        });
    }

    function createComFooter() {
    }

});

