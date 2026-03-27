$(function () {
    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;
    constant = parent.constant;
    var data = params.manifest.occessories;
    var trList = $("#reslist");

    // 需要查询完整的外辅单数据（包含费用明细）
    com.post(api.inventory.queryOccessoriesByOid, {"occessories.oid": data.oid}, function (res) {
        createList(res.occessories).appendTo(trList);
    });

    function createList(occessories) {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table id="oneTable" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);

        var caption = $('<tr style="border: 1px solid;height: 85px; text-align: center; font-size: 25px;font-weight:bolder;"></tr>').appendTo(table);
        var td20 = $('<td colspan="5"></td>').text(params.company.name + "装饰外购辅料单").appendTo(caption);

        var $imgDiv = $('<td colspan="1"></td>').appendTo(caption);
        $imgDiv.qrcode({
            render: "canvas",
            width: 75,
            height: 75,
            text: "http://www.fanglin.vip/wx/occessories?oid=" + occessories.oid
        });

        var tr1 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td7 = $('<td style="border: 1px solid;"></td>').text("装修单号").appendTo(tr1);
        var td8 = $('<td style="border: 1px solid;"></td>').text(occessories.decoration.orderId).appendTo(tr1);
        var td1 = $('<td style="border: 1px solid;"></td>').text("楼盘地址").appendTo(tr1);
        var td2 = $('<td style="border: 1px solid;"></td>').text(occessories.decoration.house.village.name + " " + occessories.decoration.house.houseNumber).appendTo(tr1);
        var td3 = $('<td style="border: 1px solid;"></td>').text("监理").appendTo(tr1);
        var td4 = $('<td style="border: 1px solid;"></td>').text(occessories.supervisor.currentName).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td5 = $('<td style="border: 1px solid;"></td>').text("供应商").appendTo(tr2);
        var td6 = $('<td style="border: 1px solid;"></td>').text(occessories.supplier.currentName).appendTo(tr2);

        var td9 = $('<td style="border: 1px solid;"></td>').text("可进园区").appendTo(tr2);
        var td10 = $('<td style="border: 1px solid;"></td>').text(constant.inventory().occessories.isEnter.keys[occessories.isEnter]).appendTo(tr2);
        var td11 = $('<td style="border: 1px solid;"></td>').text("有无电梯").appendTo(tr2);
        var td12 = $('<td style="border: 1px solid;"></td>').text(constant.inventory().occessories.isLift.keys[occessories.isLift]).appendTo(tr2);

        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;"></tr>').appendTo(table);
        var td13 = $('<td style="border: 1px solid;"></td>').text("创建时间").appendTo(tr3);
        var td14 = $('<td colspan="5" style="border: 1px solid;"></td>').text(occessories.createTime).appendTo(tr3);


        var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;"></tr>').appendTo(table);
        $('<td colspan="2" style="border: 1px solid;"></td>').text("项目").appendTo(tr4);
        $('<td colspan="1" style="border: 1px solid;"></td>').text("单位").appendTo(tr4);
        $('<td colspan="1" style="border: 1px solid;"></td>').text("数量").appendTo(tr4);
        $('<td colspan="1" style="border: 1px solid;"></td>').text("费用明细").appendTo(tr4);

        // 遍历外辅项
        $.each(occessories.occessoriesItems, function (i, item) {
            // 外辅项数据行
            var tr = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
            $('<td colspan="2" style="border: 1px solid;"></td>').html(item.goods.name).appendTo(tr);
            $('<td colspan="1" style="border: 1px solid;"></td>').html(item.goods.measurementUnit).appendTo(tr);
            $('<td colspan="1" style="border: 1px solid;"></td>').html(item.num).appendTo(tr);
            $('<td colspan="1" style="border: 1px solid;"></td>').html("").appendTo(tr);

            // 费用明细行
            if (item.occessoriesCharges && item.occessoriesCharges.length > 0) {
                $.each(item.occessoriesCharges, function (j, charge) {
                    var chargeTr = $('<tr style="border: 1px solid;height: 25px;text-align: center;background-color:#f9f9f9;"></tr>').appendTo(table);
                    $('<td colspan="2" style="border: 1px solid;padding-left:30px;"></td>').html("　└ " + charge.name).appendTo(chargeTr);
                    $('<td colspan="1" style="border: 1px solid;"></td>').html("").appendTo(chargeTr);
                    $('<td colspan="1" style="border: 1px solid;"></td>').html(charge.num).appendTo(chargeTr);
                    $('<td colspan="1" style="border: 1px solid;"></td>').html(((charge.price * charge.num) / 1000).toFixed(2) + " 元").appendTo(chargeTr);
                });
            }
        });

        // 添加费用汇总行
        var trTotal = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;font-weight:bold;"></tr>').appendTo(table);
        $('<td colspan="4" style="border: 1px solid;"></td>').text("总费用").appendTo(trTotal);
        $('<td colspan="2" style="border: 1px solid;"></td>').text((occessories.charge / 1000).toFixed(2) + " 元").appendTo(trTotal);

        // 添加备注行
        var tr5 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;"></tr>').appendTo(table);

        var td15 = $('<td style="border: 1px solid;"></td>').text("备注").appendTo(tr5);
        var td16 = $('<td colspan="5" style="border: 1px solid;"></td>').text(occessories.comment).appendTo(tr5);

        return div;
    }


});
