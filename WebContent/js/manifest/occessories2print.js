$(function () {
    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;
    constant = parent.constant;
    var data = params.manifest.occessories;
    var trList = $("#reslist");
    com.post(api.inventory.queryOccessoriesItemByOid, {"occessoriesItem.oid": data.oid}, function (res) {
        createList(res.occessoriesItems).appendTo(trList);
    });

    function createList(items) {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table id="oneTable" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);

        var caption = $('<tr style="border: 1px solid;height: 85px; text-align: center; font-size: 25px;font-weight:bolder;"></tr>').appendTo(table);
        var td20 = $('<td colspan="5"></td>').text(params.company.name + "装饰外购辅料单").appendTo(caption);

        var $imgDiv = $('<td colspan="1"></td>').appendTo(caption);
        $imgDiv.qrcode({
            render: "canvas",
            width: 75,
            height: 75,
            text: "http://www.fanglin.vip/wx/occessories?oid=" + data.oid
        });

        var tr1 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td7 = $('<td style="border: 1px solid;"></td>').text("装修单号").appendTo(tr1);
        var td8 = $('<td style="border: 1px solid;"></td>').text(data.decoration.orderId).appendTo(tr1);
        var td1 = $('<td style="border: 1px solid;"></td>').text("楼盘地址").appendTo(tr1);
        var td2 = $('<td style="border: 1px solid;"></td>').text(data.decoration.house.village.name + " " + data.decoration.house.houseNumber).appendTo(tr1);
        var td3 = $('<td style="border: 1px solid;"></td>').text("监理").appendTo(tr1);
        var td4 = $('<td style="border: 1px solid;"></td>').text(data.supervisor.currentName).appendTo(tr1);

        var tr2 = $('<tr style="border: 1px solid;height: 25px;text-align: center; font-size: 15px;"></tr>').appendTo(table);
        var td5 = $('<td style="border: 1px solid;"></td>').text("供应商").appendTo(tr2);
        var td6 = $('<td style="border: 1px solid;"></td>').text(data.supplier.currentName).appendTo(tr2);

        var td9 = $('<td style="border: 1px solid;"></td>').text("可进园区").appendTo(tr2);
        var td10 = $('<td style="border: 1px solid;"></td>').text(constant.inventory().occessories.isEnter.keys[data.isEnter]).appendTo(tr2);
        var td11 = $('<td style="border: 1px solid;"></td>').text("有无电梯").appendTo(tr2);
        var td12 = $('<td style="border: 1px solid;"></td>').text(constant.inventory().occessories.isLift.keys[data.isLift]).appendTo(tr2);

        var tr3 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;"></tr>').appendTo(table);
        var td13 = $('<td style="border: 1px solid;"></td>').text("创建时间").appendTo(tr3);
        var td14 = $('<td colspan="5" style="border: 1px solid;"></td>').text(data.createTime).appendTo(tr3);


        var tr4 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;"></tr>').appendTo(table);
        var td17 = $('<td colspan="2" style="border: 1px solid;"></td>').text("项目").appendTo(tr4);
        var td18 = $('<td colspan="2" style="border: 1px solid;"></td>').text("单位").appendTo(tr4);
        var td19 = $('<td colspan="2" style="border: 1px solid;"></td>').text("数量").appendTo(tr4);
        var propertyArr = [];
        $.each(items, function (i, v) {
            propertyArr.push([v.goods.name, v.goods.measurementUnit, v.num]);
        });

        $.each(propertyArr, function (index, value) {

            var tr = $('<tr style="border: 1px solid;height: 25px;text-align: center;"></tr>').appendTo(table);
            $.each(value, function (j, k) {

                $('<td colspan="2" style="border: 1px solid;"></td>').html(k).appendTo(tr);
            });
        });
        var tr5 = $('<tr style="border: 1px solid;height: 25px;text-align: center;  font-size: 15px;"></tr>').appendTo(table);

        var td15 = $('<td style="border: 1px solid;"></td>').text("备注").appendTo(tr5);
        var td16 = $('<td colspan="5" style="border: 1px solid;"></td>').text(data.comment).appendTo(tr5);

        return div;
    }


});
