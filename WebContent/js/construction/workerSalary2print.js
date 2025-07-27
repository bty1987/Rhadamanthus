$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;
    constant = parent.constant;
    var construction = params.construction;
    var salaryStatus = {};
    var type = {};
    var oneType = {};
    var twoType = {};
    var trList = $("#reslist");
    var table;
    var tabody = $('<tbody> </tbody>');
    setTimeout(function() {

        table = createHeader().appendTo(trList);
        pageList(1, 50);
        tabody.appendTo(table);

    }, 500);

    com.post(api.ds.salary, {}, function(data) {

        var twotypes = [];

        $.each(data.SalaryTwoType, function(i, v) {

            if (v.status != 0)
                return true;
            twotypes.push(v);
        });

        salaryStatus = data.status.split("key", "value");
        type = data.type.split("id", "name");
        oneType = data.oneType.split("id", "name");
        twoType = data.SalaryTwoType.split("key", "name");
       

    }, null, false);

    function pageList(page, rows) {
    	
        com.post(api.salary.queryWorkerSalaryByOrderId, {
            "workerSalary.decoration.orderId": construction.decoration.orderId
        }, function(res) {

            createLine(res.workerSalarys);

        }, null, false);

    }

    function createHeader() {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:20px;">工人工费表</caption>').appendTo(table);

        var tr1 = $('<tr style="font-size: 6px;"></tr>').appendTo(table);
        var td2 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("订单编号").appendTo(tr1);
        var td3 = $('<td colspan="3" style="border: 1px solid;"></td>').text(construction.decoration.orderId).appendTo(tr1);
        var td4 = $('<td colspan="1" style="border: 1px solid; width: 160px;text-align: center;"></td>').text("施工地址").appendTo(tr1);
        var td5 = $('<td colspan="3" style="border: 1px solid; width: 160px;"></td>').text(com.checkNull(construction.decoration.house.village.name, "") + " " + com.checkNull(construction.decoration.house.houseNumber, "")).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 25px; font-size: 7px;"></tr>').appendTo(table);
        var td6 = $('<td colspan="1" style="border: 1px solid; height: 25px; text-align: center;"></td>').text("交付监理").appendTo(tr2);
        var td7 = $('<td colspan="3" style="border: 1px solid;"></td>').text(com.checkNull(construction.decoration.supervisor.userName, "")).appendTo(tr2);
        var td8 = $('<td colspan="1" style="border: 1px solid; width: 160px;text-align: center;"></td>').text("房屋面积").appendTo(tr2);
        var td9 = $('<td colspan="3" style="border: 1px solid; width: 160px;"></td>').text(com.checkNull(construction.decoration.house.buildArea, "")).appendTo(tr2);

        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 7px;"></tr>').appendTo(table);
        var td10 = $('<td colspan="1" style="border: 1px solid;"></td>').text("工人名").appendTo(tr3);
        var td11 = $('<td colspan="1" style="border: 1px solid;"></td>').text("工种").appendTo(tr3);
        var td12 = $('<td colspan="1" style="border: 1px solid;"></td>').text("工程节点").appendTo(tr3);
        var td13 = $('<td colspan="1" style="border: 1px solid;"></td>').text("类型").appendTo(tr3);
        var td14 = $('<td colspan="1" style="border: 1px solid;"></td>').text("一类").appendTo(tr3);
        var td15 = $('<td colspan="1" style="border: 1px solid;"></td>').text("二类").appendTo(tr3);
        var td16 = $('<td colspan="1" style="border: 1px solid;"></td>').text("状态").appendTo(tr3);
        var td17 = $('<td colspan="1" style="border: 1px solid; width: 160px;"></td>').text("创建时间").appendTo(tr3);
        
        return table;
    }

    function createLine(items) {

        $.each(items, function(i, v) {

            if (v.wsid == null)
                return true;

            var tr4 = $('<tr style="border: 1px solid;height: 25px; font-size: 7px;"></tr>').appendTo(tabody);
            var td18 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.user.currentName, "")).appendTo(tr4);
            var td19 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(com.checkNull(v.user.duty.name, "")).appendTo(tr4);  
            var td20 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(constant.decoration().decoration.projectStatus.keys[v.cnid]).appendTo(tr4);
            var td21 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(type[v.type]).appendTo(tr4);
            var td22 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(oneType[v.onetype]).appendTo(tr4);
            var td23 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(twoType[v.twotype]).appendTo(tr4);
            var td24 = $('<td colspan="1" style="border: 1px solid;text-align: center;"></td>').text(salaryStatus[v.status]).appendTo(tr4);
            var td25 = $('<td colspan="1" style="border: 1px solid;text-align: center; width: 160px;"></td>').text(com.checkNull(v.createTime, "")).appendTo(tr4);
        });
    }

});
