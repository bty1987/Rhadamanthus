$(function ($) {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    
    var printer = {
        name : null,
        args : {}
    }
    
    var vticket = params.vticket;
    var vawards = params.vawards;
    
    var trList = $("#reslist");

    printer.name = "vaward";
    printer.args = {
        "title" : "2020盛饰中国",
        "no": vticket.tno,
        "address": vticket.address,
        "belonger": vticket.belonger ? vticket.belonger.currentName : "",
        "items": vawards,
    };
    
    createList(printer.args).appendTo(trList);
    
    function createList(data) {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:25px;">2020盛饰中国</caption>').appendTo(table);

        var tr1 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td1 = $('<td style="border: 1px solid;"></td>').text("票号").appendTo(tr1);
        var td2 = $('<td colspan="2" style="border: 1px solid;"></td>').text(data.no).appendTo(tr1);
        var td3 = $('<td style="border: 1px solid;"></td>').text("归属人").appendTo(tr1);
        var td4 = $('<td colspan="2" style="border: 1px solid;"></td>').text(data.belonger).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td5 = $('<td style="border: 1px solid;"></td>').text("楼盘地址").appendTo(tr2);
        var td6 = $('<td colspan="2" style="border: 1px solid;"></td>').text(data.address).appendTo(tr2);
        var td7 = $('<td style="border: 1px solid;"></td>').text("活动名称").appendTo(tr2);
        var td8 = $('<td colspan="2" style="border: 1px solid;"></td>').text(data.title).appendTo(tr2);
        
        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td5 = $('<td colspan="2" style="border: 1px solid;"></td>').text("名称").appendTo(tr3);
        var td7 = $('<td colspan="2" style="border: 1px solid;"></td>').text("单位").appendTo(tr3);
        var td9 = $('<td colspan="2" style="border: 1px solid;"></td>').text("数量").appendTo(tr3);
        
        for(var i=0;i<data.items.length;i++){
            var item = data.items[i];
            
            var tr = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
            var td5 = $('<td colspan="2" style="border: 1px solid;"></td>').text(item.name).appendTo(tr);
            var td7 = $('<td colspan="2" style="border: 1px solid;"></td>').text(item.unit).appendTo(tr);
            var td9 = $('<td colspan="2" style="border: 1px solid;"></td>').text(item.num).appendTo(tr);
        }

        var tr10 = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td34 = $('<td style="border: 1px solid;"></td>').text("客户签字").appendTo(tr10);
        var td35 = $('<td colspan="5" style="border: 1px solid;"></td>').text("").appendTo(tr10);

        return div;
    }
});

