jQuery(function($) {

    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    params = parent.params;
    constant = parent.constant;

    var accessoriesInfo = {};

    accessoriesInfo["aid"] = params.manifest.accessories.aid || "";
    accessoriesInfo["no"] = params.manifest.accessories.no || "";
    accessoriesInfo["orderId"] = params.manifest.accessories.orderId || "";
    accessoriesInfo["createTime"] = params.manifest.accessories.createTime || "";
    accessoriesInfo["creater"] = params.manifest.accessories.creater;
    accessoriesInfo["printnum"] = params.manifest.accessories.printnum || "";

    var STATUS_ADVANCE = constant.inventory().accessories.STATUS_ADVANCE_INT;
    var isAdvance = params.manifest.accessories.status == STATUS_ADVANCE;

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": accessoriesInfo["orderId"]
    }, function(data) {
        accessoriesInfo["address"] = data.decoration.house.village.name + " " + data.decoration.house.houseNumber;
        accessoriesInfo["supervisor"] = data.decoration.supervisor.userName == null ? "---" : data.decoration.supervisor.userName;
        accessoriesInfo["dept"] = data.decoration.supervisor.dept.name == null ? "---" : data.decoration.supervisor.dept.name;
        accessoriesInfo["phone"] = data.decoration.supervisor.phone == null ? "---" : data.decoration.supervisor.phone;
    }, null, false);

    // 费用明细(照外辅打印: 按项aiid分组挂子行, tranargs已折元; 合计仅累计配送项费用, 在明细回调中计算)
    var chargeMap = {};

    com.post(api.inventory.queryAccessoriesCharge, {
        "accessoriesCharge.accessories.aid": accessoriesInfo["aid"]
    }, function(chargeRes) {

        if (chargeRes.accessoriesCharges && chargeRes.accessoriesCharges.length > 0) {
            $.each(chargeRes.accessoriesCharges, function(i, charge) {

                var aiid = charge.accessoriesItem && charge.accessoriesItem.aiid ? charge.accessoriesItem.aiid : charge.aiid;

                if (aiid) {
                    var aiidKey = String(aiid);
                    if (!chargeMap[aiidKey]) chargeMap[aiidKey] = [];
                    chargeMap[aiidKey].push(charge);
                }
            });
        }
    }, null, false);

    // 打印口径=辅料单(2026-11-18): 明细统一取辅料单项显示全部项目(2026-11-19 用户拍板删除配送标识过滤, 存量项deliveryFlag全0过滤即空表);
    // 数量: 预出=待出库量surplus, 出货/到货=已出库量num-surplus; 费用合计=整单全部项费用
    com.post(api.inventory.queryAccessoriesItemByAid, {
        "accessoriesItem.aid": params.manifest.accessories.aid
    }, function(res) {

        var items = res.accessoriesItems || [];

        var chargeTotalAmount = 0;

        $.each(items, function(i, v) {
            $.each(chargeMap[String(v.aiid)] || [], function(j, charge) {
                chargeTotalAmount += utils.accAdd(charge.price || 0, charge.surplus || 0) * (charge.num || 0);
            });
        });

        createReceiptTable(accessoriesInfo, items, chargeTotalAmount);
    }, null, false);

    function createReceiptTable(accessoriesInfo, itemInfo, chargeTotalAmount) {

        var center = $("<center></center>").appendTo($("#accessoriesPrint"));

        var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
        var noTr = $('<tr></tr>').appendTo(noTable);
        var noTd = $('<td colspan="12"></td>').appendTo(noTr);

        var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
        // 表头标题行+二维码(照外辅打印, 扫码打开微信端辅料单信息页)
        var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
        var headReceiptTd = $('<td colspan="10"></td>').appendTo(headReceiptTr);
        var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
        var headReceiptH2 = $('<h2></h2>').text(params.company.name + "辅料单信息").appendTo(headReceiptDiv);
        var qrcodeTd = $('<td colspan="2" style="width:85px;"></td>').appendTo(headReceiptTr);
        qrcodeTd.qrcode({
            render: "canvas",
            width: 75,
            height: 75,
            text: "http://www.fanglin.vip/wx/accessories?aid=" + accessoriesInfo["aid"]
        });

        var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var anoTd = $('<td colspan="4" style="padding-left: 10px;font"></td>').text('辅料单号: ' + accessoriesInfo["no"]);
        var createrTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('装修单号: ' + accessoriesInfo["orderId"]);
        var totalTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('地   址: ' + accessoriesInfo["address"]);

        var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var statusTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('监   理: ' + accessoriesInfo["supervisor"]);
        var deptTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('部   门: ' + accessoriesInfo["dept"]);
        var phoneTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('电   话: ' + accessoriesInfo["phone"]);

        var msgReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var createrName = accessoriesInfo["creater"] && accessoriesInfo["creater"].currentName ? accessoriesInfo["creater"].currentName : "";
        var createTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('创  建  人: ' + createrName);
        var createTimeTd2 = $('<td colspan="8" style="padding-left: 10px;"></td>').text('创建时间: ' + accessoriesInfo["createTime"]);

        orderReceiptTr.append(anoTd).append(createrTd).append(totalTd);
        presonReceiptTr.append(statusTd).append(deptTd).append(phoneTd);
        msgReceiptTr.append(createTd).append(createTimeTd2);

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var goodsNoTd = $('<td style="text-align: center;" colspan="2"></td>').html('<strong>商品编号</strong>').appendTo(receReceiptTr);
        var outstorehouseTd = $('<td style="text-align: center;" colspan="2"></td>').html('<strong>出货仓库</strong>').appendTo(receReceiptTr);
        var goodsNameTd = $('<td style="text-align: center;" colspan="4"></td>').html('<strong>商品名</strong>').appendTo(receReceiptTr);
        var measurementUnitTd = $('<td style="text-align: center;" colspan="2"></td>').html('<strong>单位</strong>').appendTo(receReceiptTr);
        var numTd = $('<td style="text-align: center;" colspan="2"></td>').html('<strong>数量</strong>').appendTo(receReceiptTr);

        $.each(itemInfo, function(i, v) {

            var itemNum = isAdvance ? (v.surplus == null ? 0 : v.surplus) : ((v.num == null ? 0 : v.num) - (v.surplus == null ? 0 : v.surplus));

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var goodsNoTd = $('<td style="text-align: center;" colspan="2"></td>').html(v.goods.no).appendTo(receReceiptTr);
            var outstorehouseTd = $('<td style="text-align: center;" colspan="2"></td>').html("---").appendTo(receReceiptTr);
            var goodsNameTd = $('<td style="text-align: center;" colspan="4"></td>').html(v.goods.name).appendTo(receReceiptTr);
            var measurementUnitTd = $('<td style="text-align: center;" colspan="2"></td>').html(v.goods.measurementUnit).appendTo(receReceiptTr);
            var numTd = $('<td style="text-align: center;" colspan="2"></td>').html(itemNum).appendTo(receReceiptTr);

            // 费用子行(照外辅: 按 aiid 挂在明细行下, tranargs已折元)
            var charges = chargeMap[String(v.aiid)] || [];
            $.each(charges, function(j, charge) {

                var price = charge.price || 0;
                var surplus = charge.surplus || 0;

                var chargeTr = $('<tr style="text-align: center;background-color:#f9f9f9;"></tr>').appendTo(receiptTable);
                $('<td colspan="6" style="padding-left:30px;"></td>').html("　└ " + charge.name).appendTo(chargeTr);
                $('<td colspan="4"></td>').html("单价" + price.toFixed(3) + "元 浮动" + surplus.toFixed(3) + "元").appendTo(chargeTr);
                $('<td colspan="2"></td>').html(charge.num).appendTo(chargeTr);
            });
        });

        // 费用合计行
        var chargeTotalTr = $('<tr></tr>').appendTo(receiptTable);
        var chargeTotalTd = $('<td colspan="8" style="text-align: right;padding-right:10px;"></td>').html('<strong>费用合计（元）</strong>').appendTo(chargeTotalTr);
        var chargeTotalTd2 = $('<td colspan="4" style="text-align: center;"></td>').html('<strong>' + chargeTotalAmount.toFixed(3) + '</strong>').appendTo(chargeTotalTr);

        var tableInfo = $('<tr></tr>').appendTo(receiptTable);
        var printer = $('<td colspan="4" style="padding-left: 10px;font"></td>').text('打印人: ' + params.userInfo.user.currentName);
        var printerName = $('<td colspan="4" style="padding-left: 10px;font"></td>').text('打印时间: ' + new Date().toLocaleString());
        var printNum = $('<td colspan="4" style="padding-left: 10px;font" id="printNum"></td>').text('打印次数: ' + accessoriesInfo["printnum"]);
        tableInfo.append(printer).append(printerName).append(printNum);

        var headReceiptTr1 = $('<tr></tr>').appendTo(receiptTable);
        var headReceiptTd1 = $('<td colspan="12"></td>').appendTo(headReceiptTr1);
        var headReceiptDiv1 = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd1);
        var headReceiptH21 = $('<span style="margin-left: 70%;"></span>').text("领取人:").appendTo(headReceiptDiv1);

    }
});
