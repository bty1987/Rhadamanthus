$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;

    var options = {
        total: 0,
    };

    var balance = params.balance;
    var trList = $("#reslist");
    var table;
    var tabody = $('<tbody> </tbody>');

    setTimeout(function() {
        table = createComHeader().appendTo(trList);
        pageList(1, 50);
        tabody.appendTo(table);

     }, 500);

    function pageList(page, rows) {

        com.post(api.balance.queryBalanceCutpay, {"balanceCutpay.balance.bid": balance.bid}, function(res) {
            createComLine(res.balanceCutpays);
            createComFooter();
        }, null, false);

    };

    function createComHeader() {
         var div = $('<div align="center" class="col-xs-12"></div>');
         var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">').appendTo(div);
         var caption = $('<caption style="line-height: 65px;font-size:20px;">供应商费用扣款明细确认表</caption>').appendTo(table);

         var tr1 = $('<tr style="font-size: 6px;text-align: left;"></tr>').appendTo(table);
         var td2 = $('<td colspan="5" style="border: 1px solid;"></td>').text("结算单金额：" + balance.surplus).appendTo(tr1);

         var tr2 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(table);
         var td3 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("").appendTo(tr2);
         var td4 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("金额").appendTo(tr2);
         var td5 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("已扣").appendTo(tr2);
         var td6 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("余额").appendTo(tr2);
         var td7 = $('<td rowspan="1" style="border: 1px solid;"></td>').text("本期扣款额").appendTo(tr2);

         return table;
    }

    function createComLine(items) {
        $.each(items, function(i, v) {
            console.log(v.dccount)

            if (v.dccount.bdid != null){
                var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(tabody);
                var td8 = $('<td style="border: 1px solid;"></td>').text(v.dccount.name).appendTo(tr3);
                var td9 = $('<td style="border: 1px solid;"></td>').text(v.dccount.cutpay).appendTo(tr3);
                var td10 = $('<td style="border: 1px solid;"></td>').text(utils.accSub(v.dccount.cutpay, v.dccount.surplus)).appendTo(tr3);
                var td11 = $('<td style="border: 1px solid;"></td>').text(v.dccount.surplus).appendTo(tr3);
                var td12 = $('<td style="border: 1px solid;"></td>').text(v.money).appendTo(tr3);

                options.total = utils.accAdd(options.total, v.money);// 合计扣款
             }

         });
    }

    function createComFooter() {

        var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 6px;"></tr>').appendTo(tabody);
        var td13 = $('<td colspan="4" style="border: 1px solid;"></td>').text("").appendTo(tr4);
        var td14 = $('<td style="border: 1px solid;"></td>').text("合计扣款：" + utils.changeThrDecimal(options.total)).appendTo(tr4);

        var tr5 = $('<tr style="height: 25px;text-align: right; font-size: 6px;"></tr>').appendTo(tabody);
        var td16 = $('<td rowspan="1"></td>').text("").appendTo(tr5);

        var tr6 = $('<tr style="height: 25px;text-align: right; font-size: 6px;"></tr>').appendTo(tabody);
        var td17 = $('<td colspan="4"></td>').text("厂商数据核对无误盖章(签字)").appendTo(tr6);

        var tr7 = $('<tr style="height: 25px;text-align: right; font-size: 6px;"></tr>').appendTo(tabody);
        var td18 = $('<td rowspan="1"></td>').text("").appendTo(tr7);

        var tr8 = $('<tr style="height: 25px;text-align: right; font-size: 6px;"></tr>').appendTo(tabody);
        var td19 = $('<td colspan="4"></td>').text("").appendTo(tr8);
        var td20 = $('<td style="text-align: center;"></td>').text("______年______月______日").appendTo(tr8);
    }

});

