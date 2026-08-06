jQuery(function($) {

    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    _params = parent.params;
    constant = parent.constant;

    var commonInfo = {};

    commonInfo["aid"] = _params.manifest.accessories.aid;
    commonInfo["no"] = _params.manifest.accessories.no
    commonInfo["orderId"] = _params.manifest.accessories.orderId
    commonInfo["createTime"] = _params.manifest.accessories.createTime || "";
    commonInfo["creater"] = _params.manifest.accessories.creater
    commonInfo["manifestTime"] = _params.manifest.accessories.manifestTime || "";
    commonInfo["printnum"] = _params.manifest.accessories.printnum

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": commonInfo["orderId"]
    }, function(data) {
        commonInfo["address"] = data.decoration.house.village.name + " " + data.decoration.house.houseNumber;
        commonInfo["supervisor"] = data.decoration.supervisor.userName == null ? "---" : data.decoration.supervisor.userName;
        commonInfo["dept"] = data.decoration.supervisor.dept.name == null ? "---" : data.decoration.supervisor.dept.name;
        commonInfo["phone"] = data.decoration.supervisor.phone == null ? "---" : data.decoration.supervisor.phone;
    }, null, false);

    if (_params.manifest.accessories.status == constant.inventory().accessories.STATUS_ADVANCE_INT) {
        com.post(api.inventory.queryAccessoriesItemByAid, {
            "accessoriesItem.aid": _params.manifest.accessories.aid
        }, function(res) {
            createReceiptTable(commonInfo, res.accessoriesItems)
        });
    } else {

        var options = {
            "accessoriesManifest.accessories.aid": _params.manifest.accessories.aid,
            "accessoriesManifest.manifest.type": 7
        };

        com.post(api.inventory.queryManifestByAid, options, function(res) {

            var manifest = res.manifests;

            $.each(manifest, function(i, v) {
                commonInfo["mno"] = v.code;
                com.post(api.inventory.queryManifestItemByMid, {
                    "manifest.mid": v.mid
                }, function(res) {
                    createReceiptTable(commonInfo, res.manifestItems);
                }, null, false);
            });
        }, null, false);
    }

    function createReceiptTable(commonInfo, itemInfo) {

        var center = $("<center></center>").appendTo($("#accessoriesPrint"));

        var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
        var noTr = $('<tr></tr>').appendTo(noTable);
        var noTd = $('<td colspan="12"></td>').appendTo(noTr);

        var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
        var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
        var headReceiptTd = $('<td colspan="12"></td>').appendTo(headReceiptTr);
        var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
        var headReceiptH2 = $('<h2></h2>').text(_params.company.name + "辅料单信息").appendTo(headReceiptDiv);

        var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var anoTd = $('<td colspan="4" style="padding-left: 10px;font"></td>').text('辅料单号: ' + commonInfo["no"]);
        var createrTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('装修单号: ' + commonInfo["orderId"]);
        var codeTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('货单号: ' + commonInfo["mno"]);

        var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var totalTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('地   址: ' + commonInfo["address"]);
        var createTimeTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('创建时间: ' + commonInfo["createTime"]);
        var createTimeTd2 = $('<td colspan="8" style="padding-left: 10px;"></td>').text('创建时间: ' + commonInfo["createTime"]);
        var manifestTimeTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('货单时间: ' + commonInfo["manifestTime"]);

        var totalReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var statusTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('监   理: ' + commonInfo["supervisor"]);
        var deptTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('部   门: ' + commonInfo["dept"]);
        var phoneTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('电   话: ' + commonInfo["phone"]);

        var msgReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var designerReceiptTd = $('<td colspan="12" style="padding-left: 10px;"></td>').text('创  建  人: ' + commonInfo["creater"].currentName);
        var createTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('创  建  人: ' + commonInfo["creater"].currentName);

        if (_params.manifest.accessories.status == constant.inventory().accessories.STATUS_ADVANCE_INT) {
            orderReceiptTr.append(anoTd).append(createrTd).append(totalTd);
            presonReceiptTr.append(statusTd).append(deptTd).append(phoneTd);
            msgReceiptTr.append(createTd).append(createTimeTd2);
        } else {
            orderReceiptTr.append(anoTd).append(createrTd).append(codeTd);
            presonReceiptTr.append(totalTd).append(createTimeTd).append(manifestTimeTd);
            totalReceiptTr.append(statusTd).append(deptTd).append(phoneTd);
            msgReceiptTr.append(designerReceiptTd);
        }

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var goodsNoTd = $('<td style="text-align: center;" colspan="2"></td>').html('<strong>商品编号</strong>').appendTo(receReceiptTr);
        var goodsNameTd = $('<td style="text-align: center;" colspan="2"></td>').html('<strong>出货仓库</strong>').appendTo(receReceiptTr);
        var measurementUnitTd = $('<td style="text-align: center;" colspan="4"></td>').html('<strong>商品名</strong>').appendTo(receReceiptTr);
        var outstorehouseNameTd = $('<td style="text-align: center;" colspan="2"></td>').html('<strong>单位</strong>').appendTo(receReceiptTr);
        var numTd = $('<td style="text-align: center;" colspan="2"></td>').html('<strong>数量</strong>').appendTo(receReceiptTr);

        $.each(itemInfo, function(i, v) {

            var outstorehouseName;

            if (_params.manifest.accessories.status == constant.inventory().accessories.STATUS_ADVANCE_INT) {
                outstorehouseName = "---";
            } else {
                outstorehouseName = v.outstorehouse.name == null ? "---" : v.outstorehouse.name;
            }

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var goodsNoTd = $('<td style="text-align: center;" colspan="2"></td>').html(v.goods.no).appendTo(receReceiptTr);
            var goodsNameTd = $('<td style="text-align: center;" colspan="2"></td>').html(outstorehouseName).appendTo(receReceiptTr);
            var measurementUnitTd = $('<td style="text-align: center;" colspan="4"></td>').html(v.goods.name).appendTo(receReceiptTr);
            var outstorehouseNameTd = $('<td style="text-align: center;" colspan="2"></td>').html(v.goods.measurementUnit).appendTo(receReceiptTr);
            var numTd = $('<td style="text-align: center;" colspan="2"></td>').html(v.surplus).appendTo(receReceiptTr);
        });

        var tableInfo = $('<tr></tr>').appendTo(receiptTable);
        var printer = $('<td colspan="4" style="padding-left: 10px;font"></td>').text('打印人: ' + _params.userInfo.user.currentName);
        var printerName = $('<td colspan="4" style="padding-left: 10px;font"></td>').text('打印时间: ' + new Date().toLocaleString());
        var printNum = $('<td colspan="4" style="padding-left: 10px;font" id="printNum"></td>').text('打印次数: ' + commonInfo["printnum"]);
        tableInfo.append(printer).append(printerName).append(printNum);

        var headReceiptTr1 = $('<tr></tr>').appendTo(receiptTable);
        var headReceiptTd1 = $('<td colspan="12"></td>').appendTo(headReceiptTr1);
        var headReceiptDiv1 = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd1);
        var headReceiptH21 = $('<span style="margin-left: 70%;"></span>').text("领取人:").appendTo(headReceiptDiv1);

    }
});
