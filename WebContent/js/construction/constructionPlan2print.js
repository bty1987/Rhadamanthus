$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;

    var construction = params.construction;
    var trList = $("#reslist");
    var table;
    var tabody = $('<tbody> </tbody>');

    setTimeout(function() {

        table = createComHeader().appendTo(trList);
        pageList(1, 50);
        tabody.appendTo(table);

     }, 500);

    function pageList(page, rows) {

        com.post(api.construction.queryConstructionPlanByOrderId, {"constructionPlan.orderId": construction.decoration.orderId}, function(res) {

            createComLine(res.constructionPlans);
            createComFooter();
        }, null, false);

    };

    function createComHeader() {

         var div = $('<div align="center" class="col-xs-12"></div>');
         var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">').appendTo(div);
         var caption = $('<caption style="line-height: 65px;font-size:20px;">工程施工进度计划表</caption>').appendTo(table);

         var tr1 = $('<tr style="font-size: 6px;"></tr>').appendTo(table);
         var td2 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text("订单编号").appendTo(tr1);
         var td3 = $('<td colspan="2" style="border: 1px solid;"></td>').text(construction.decoration.orderId).appendTo(tr1);
         var td4 = $('<td colspan="1" style="border: 1px solid;"></td>').text("施工地址:" + " " + construction.decoration.house.village.name + " " + construction.decoration.house.houseNumber).appendTo(tr1);
         var td5 = $('<td colspan="1" style="border: 1px solid;"></td>').text("房屋面积:" + " " + construction.decoration.house.buildArea).appendTo(tr1);

         var tr2 = $('<tr style="border: 1px solid;height: 25px; font-size: 7px;"></tr>').appendTo(table);
         var td6 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text("预计开工日期").appendTo(tr2);
         var td7 = $('<td colspan="2" style="border: 1px solid;"></td>').text(construction.drawlineTime).appendTo(tr2);
         var td8 = $('<td colspan="2" style="border: 1px solid;"></td>').text("交付监理:" + " " + construction.decoration.supervisor.userName).appendTo(tr2);

         var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(table);
         var td9 = $('<td colspan="1" style="border: 1px solid;"></td>').text("任务描述").appendTo(tr3);
         var td10 = $('<td colspan="1" style="border: 1px solid;"></td>').text("开始日期").appendTo(tr3);
         var td11 = $('<td colspan="1" style="border: 1px solid;"></td>').text("结束日期").appendTo(tr3);
         var td12 = $('<td colspan="2" style="border: 1px solid;"></td>').text("工程预备项目").appendTo(tr3);

         return table;
    }

    function createComLine(items) {

        $.each(items, function(i, v) {

            if (v.cpid != null){

                var tr4 = $('<tr style="border: 1px solid;height: 25px; font-size: 7px;"></tr>').appendTo(tabody);
                var td13 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(v.name).appendTo(tr4);
                var td14 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(v.startTime).appendTo(tr4);
                var td15 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(v.endTime).appendTo(tr4);
                var td16 = $('<td colspan="2" style="border: 1px solid;"></td>').text(v.comment).appendTo(tr4);
             }

         });
    }

    function createComFooter() {

        var tr5 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td17 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text("施工周期").appendTo(tr5);
        var td18 = $('<td colspan="4" style="border: 1px solid;"></td>').text("合同决定施工周期:" + " " + "①平层120m²以内为90天" + " " + "②平层120m²-150m²为120天" + " " + "③平层150m²-200m²为150天" + " " + "④平层200m²-350m²为180天" + " " + "⑤阁楼、地下室、别墅类为210天。以上工期均不包含休息日及法定假日。").appendTo(tr5);

        var tr6 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td19 = $('<td rowspan="4" style="border: 1px solid;text-align: center;"></td>').text("无法开工原因").appendTo(tr6);
        var td20 = $('<td colspan="4" style="border: 1px solid;"></td>').text("客户原因:" + " " + "客户没时间改日期,无法交底").appendTo(tr6);

        var tr7 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td21 = $('<td colspan="4" style="border: 1px solid;"></td>').text("方案原因:" + " " + "1.橱柜无图纸" + " " + "2.现场方案改动大" + " " + "3.燃气热水器无图纸" + " " + "4.软水、中央净水无图纸").appendTo(tr7);

        var tr8 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td22 = $('<td colspan="4" style="border: 1px solid;"></td>').text("现场原因:" + " " + "1.土建、砌筑未完工" + " " + "2.门窗未封" + " " + "3.现场拆改未完工" + " " + "4.老房原始墙面空鼓").appendTo(tr8);

        var tr9 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td23 = $('<td colspan="4" style="border: 1px solid;"></td>').text("客观原因:" + " " + "周末、节假日园区不让施工").appendTo(tr9);

    }

});

