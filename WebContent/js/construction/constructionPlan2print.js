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
    var startTime = new Date(construction.drawlineTime);
    var totalDay = 0;
    setTimeout(function() {

        table = createHeader().appendTo(trList);
        pageList(1, 50);
        tabody.appendTo(table);

    }, 500);

    function pageList(page, rows) {

        com.post(api.construction.queryConstructionPlanByOrderId, {
            "constructionPlan.orderId": construction.decoration.orderId
        }, function(res) {

            createLine(res.constructionPlans);
            createFooter();
            updateTotalDay();
        }, null, false);

    }

    function createHeader() {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:20px;">工程施工进度计划表</caption>').appendTo(table);

        var tr1 = $('<tr style="font-size: 6px;"></tr>').appendTo(table);
        var td2 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("订单编号").appendTo(tr1);
        var td3 = $('<td colspan="7" style="border: 1px solid;"></td>').text(construction.decoration.orderId).appendTo(tr1);
        var td4 = $('<td colspan="6" style="border: 1px solid;"></td>').text("施工地址:" + " " + construction.decoration.house.village.name + " " + construction.decoration.house.houseNumber).appendTo(tr1);
        var td5 = $('<td colspan="6" style="border: 1px solid;"></td>').text("房屋面积:" + " " + com.checkNull(construction.decoration.house.buildArea, "")).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 25px; font-size: 7px;"></tr>').appendTo(table);
        var td6 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text("预计开工日期").appendTo(tr2);
        var td7 = $('<td colspan="7" style="border: 1px solid;"></td>').text(construction.drawlineTime).appendTo(tr2);
        var td8 = $('<td colspan="6" style="border: 1px solid;"></td>').text("交付监理:" + " " + com.checkNull(construction.decoration.supervisor.userName, "")).appendTo(tr2);
        var td81 = $('<td colspan="6" style="border: 1px solid;" class="total-day-cell"></td>').text("工程总天数:" + " " + totalDay).appendTo(tr2);

        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(table);
        var td9 = $('<td colspan="1" style="border: 1px solid;"></td>').text("施工节点").appendTo(tr3);
        var td91 = $('<td colspan="1" style="border: 1px solid;"></td>').text("施工项目").appendTo(tr3);
        var td10 = $('<td colspan="1" style="border: 1px solid;"></td>').text("工程开始日期").appendTo(tr3);
        var td11 = $('<td colspan="1" style="border: 1px solid;"></td>').text("工程结束日期").appendTo(tr3);
        var td111 = $('<td colspan="1" style="border: 1px solid;"></td>').text("工程天数").appendTo(tr3);
        var td112 = $('<td colspan="1" style="border: 1px solid;"></td>').text("主材天数").appendTo(tr3);
        var td1142 = $('<td colspan="1" style="border: 1px solid;"></td>').text("进场周期").appendTo(tr3);
        var td141 = $('<td colspan="1" style="border: 1px solid;"></td>').text("配套主材").appendTo(tr3);

        var td14 = $('<td colspan="6" style="border: 1px solid;"></td>').text("内容").appendTo(tr3);
        var td15 = $('<td colspan="6" style="border: 1px solid;"></td>').text("备注").appendTo(tr3);

        return table;
    }

    function mergePhaseCells(tbody) {

        var prevPhase = null;
        var startRow = null;
        var rowspan = 1;

        $(tbody).find('tr').each(function(index) {

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

        totalDay = 0;

        $.each(items, function(i, v) {

            if (v.cpid == null)
                return true;

            totalDay += v.comnum;
            totalDay += v.connum;

            var tr4 = $('<tr style="border: 1px solid;height: 25px; font-size: 7px;"></tr>').appendTo(tabody);
            var td16 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.phase, "")).appendTo(tr4);
            var td161 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.name, "")).appendTo(tr4);
            var td17 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.dateFormat(startTime, "yyyy-MM-dd")).appendTo(tr4);

            startTime.setDate(startTime.getDate() + v.connum);

            var td18 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.dateFormat(startTime, "yyyy-MM-dd")).appendTo(tr4);
            var td181 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.connum, "")).appendTo(tr4);

            startTime.setDate(startTime.getDate() + v.comnum);

            var td182 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.comnum, "")).appendTo(tr4);
            var td191 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.period, "")).appendTo(tr4);
            var td192 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.material, "")).appendTo(tr4);

            var td21 = $('<td colspan="6" style="border: 1px solid;"></td>').text(com.checkNull(v.content, "")).appendTo(tr4);
            var td22 = $('<td colspan="6" style="border: 1px solid;"></td>').text(com.checkNull(v.comment, "")).appendTo(tr4);

        });
        mergePhaseCells(tabody);
    }

    function updateTotalDay() {

        $('.total-day-cell').text("工程总天数:" + " " + totalDay);
    }

    function createFooter() {

        var tr5 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td17 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text("施工周期").appendTo(tr5);
        var td18 = $('<td colspan="19" style="border: 1px solid;"></td>').text("合同决定施工周期:" + " " + "①平层120m²以内为90天" + " " + "②平层120m²-150m²为120天" + " " + "③平层150m²-200m²为150天" + " " + "④平层200m²-350m²为180天" + " " + "⑤阁楼、地下室、别墅类为210天。以上工期均不包含休息日及法定假日。").appendTo(tr5);

        var tr6 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td19 = $('<td rowspan="4" colspan="1" style="border: 1px solid;text-align: center;"></td>').text("无法开工原因").appendTo(tr6);
        var td20 = $('<td colspan="16" style="border: 1px solid;"></td>').text("客户原因:" + " " + "客户没时间改日期,无法交底").appendTo(tr6);

        var tr7 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td21 = $('<td colspan="20" style="border: 1px solid;"></td>').text("方案原因:" + " " + "1.橱柜无图纸" + " " + "2.现场方案改动大" + " " + "3.燃气热水器无图纸" + " " + "4.软水、中央净水无图纸").appendTo(tr7);

        var tr8 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td22 = $('<td colspan="20" style="border: 1px solid;"></td>').text("现场原因:" + " " + "1.土建、砌筑未完工" + " " + "2.门窗未封" + " " + "3.现场拆改未完工" + " " + "4.老房原始墙面空鼓").appendTo(tr8);

        var tr9 = $('<tr style="border: 1px solid;height: 25px; font-size: 6px;"></tr>').appendTo(tabody);
        var td23 = $('<td colspan="20" style="border: 1px solid;"></td>').text("客观原因:" + " " + "周末、节假日园区不让施工").appendTo(tr9);

    }

});
