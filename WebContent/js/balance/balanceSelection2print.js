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
        var td1 = $('<td colspan="4" style="border: 1px solid;"></td>').text("供应商名称：" + brand.name).appendTo(tr1);
        var td2 = $('<td colspan="4" style="border: 1px solid;"></td>').text("负责对账员：" + creater.userName).appendTo(tr1);
        var td3 = $('<td colspan="5" style="border: 1px solid;"></td>').text("单号：" + balanceSelection.name).appendTo(tr1);
        var tr2 = $('<tr colspan="6" style="border: 1px solid;height: 60px;text-align: center; font-size: 7px;"></tr>').appendTo(table);

        var td37 = $('<td colspan="13" style="border: 1px solid;"></td>').appendTo(tr2);
        var span1 = $('<span></span>').text("首先感谢贵公司对我司的支持！为明确双方往来款项的准确清晰，" +
            "特将贵公司与我司往来账款明细列出，如以下交易无误、核对相符，请在“数据核对无误”处盖章并签字确认，" +
            "本次账单厂商结算额为：人民币").appendTo(td37);
        var span2 = $('<span></span>').attr("id", "totalPos").text("").appendTo(span1);
        var span3 = $('<span></span>').text(")").appendTo(span1);

        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(table);
        var td4 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("序号").appendTo(tr3);
        var td5 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("收入日期").appendTo(tr3);
        var td6 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("供应商名称").appendTo(tr3);
        var td7 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("装修单号").appendTo(tr3);
        var td8 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("楼盘地址").appendTo(tr3);
        var td9 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("设计师").appendTo(tr3);
        var td10 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("功能区").appendTo(tr3);
        var td11 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("拆单量").appendTo(tr3);
        var td12 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("退货量").appendTo(tr3);
        var td13 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("实用量").appendTo(tr3);
        var td14 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("销售金额（厂商结算额）").appendTo(tr3);
        var td15 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("结算额").appendTo(tr3);
        var td16 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("备注").appendTo(tr3);
        return table;
    }

    function createComLine(items) {

        $.each(items, function(i, v) {

            var postprice = v.selectionItem.postprice;
            var utility = utils.accSub(parseFloat(v.selectionItem.num), parseFloat(v.selectionItem.refnum));
            var num = [2, 4].indexOf(v.selectionItem.type) != -1 ? -utility : utility;
            var balanceAmount = utils.accMul(parseFloat(num), parseFloat(v.selectionItem.postprice));

            var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(tabody);
            var td17 = $('<td style="border: 1px solid;"></td>').text(serNum + 1).appendTo(tr4);
            var td18 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.createTime).appendTo(tr4);
            var td19 = $('<td style="border: 1px solid;"></td>').text(brand.name).appendTo(tr4);
            var td20 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.decoration.orderId).appendTo(tr4);
            var td21 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.decoration.house.village.name + " " + v.selectionItem.decoration.house.houseNumber).appendTo(tr4);
            var td22 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.decoration.designer.currentName).appendTo(tr4);
            var td23 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.areaName).appendTo(tr4);
            var td24 = $('<td style="border: 1px solid;"></td>').text(num).appendTo(tr4);
            var td25 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.refnum).appendTo(tr4);
            var td26 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(utility)).appendTo(tr4);
            var td27 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(postprice)).appendTo(tr4);
            var td28 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(balanceAmount)).appendTo(tr4);
            var td29 = $('<td style="border: 1px solid;"></td>').text(v.selectionItem.comment == null ? " " : v.selectionItem.comment).appendTo(tr4);

            options.totalNum = utils.accAdd(options.totalNum, num);// 合计拆单量
            options.totalRefnum = utils.accAdd(options.totalRefnum, v.selectionItem.refnum);// 合计退货量
            options.totalUtility = utils.accAdd(options.totalUtility, utility);// 合计实用量
            options.totalPostpricet = utils.accAdd(options.totalPostpricet, postprice);// 合计结算额
            options.totalSettlementAmount = utils.accAdd(options.totalSettlementAmount, balanceAmount);// 合计结算总额

            serNum = serNum+1;
        });
    }

    function createComFooter() {

        $("#totalPos").text(utils.getCNMoney(utils.changeThrDecimal(options.totalPostpricet)) + "(￥"+ Math.round(options.totalPostpricet));

        var tr5 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 6px;"></tr>').appendTo(tabody);
        var td30 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td31 = $('<td style="border: 1px solid;"></td>').text("合计").appendTo(tr5);
        var td32 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td33 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td34 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td35 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td36 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
        var td37 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalNum)).appendTo(tr5);
        var td38 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalRefnum)).appendTo(tr5);
        var td39 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalUtility)).appendTo(tr5);
        var td40 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalPostpricet)).appendTo(tr5);
        var td41 = $('<td style="border: 1px solid;"></td>').text(utils.changeThrDecimal(options.totalSettlementAmount)).appendTo(tr5);
        var td42 = $('<td style="border: 1px solid;"></td>').text("").appendTo(tr5);
    }

});

