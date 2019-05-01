jQuery(function ($) {

    var _params = {};
    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    _params = parent.params;

    _params.server = window.server;
    _params.authentication = parent.params.authentication;

    com.post(api.inventory.queryManifestByAid, {"accessories.aid": _params["accessories.aid"]}, function (res) {

        var manifest = res.manifest;

        var commonInfo = {};

        commonInfo["aid"] = _params["accessories.aid"];
        commonInfo["no"] = _params["accessories.no"];
        commonInfo["orderId"] = _params["accessories.orderId"];
        commonInfo["createTime"] = _params["accessories.createTime"];
        commonInfo["creater"] = _params["accessories.creater"];
        commonInfo["manifestTime"] = _params["accessories.manifestTime"];

        com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": commonInfo["orderId"]}, function (data) {
            commonInfo["address"] = data.decoration.house.village.name + " " + data.decoration.house.houseNumber;
            commonInfo["supervisor"] = data.decoration.supervisor.userName == null?"---":data.decoration.supervisor.userName;
        }, null, false)

        com.post(api.inventory.queryManifestItemByMid, {"manifest.mid":manifest.mid}, function(res){
            createReceiptTable(commonInfo, res.manifestItems);
        }, null, false);

    }, null, false);

    function createReceiptTable(commonInfo, itemInfo) {


        var center = $("<center></center>").appendTo($("#accessoriesPrint"));

        var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
        var noTr = $('<tr></tr>').appendTo(noTable);
        var noTd = $('<td colspan="11"></td>').appendTo(noTr);

        var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
        var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
        var headReceiptTd = $('<td colspan="11"></td>').appendTo(headReceiptTr);
        var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
        var headReceiptH2 = $('<h2></h2>').text("辅料单信息").appendTo(headReceiptDiv);

        var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var codeTd = $('<td colspan="5" style="padding-left: 10px;font"></td>').text('货单号: ' + commonInfo["no"]);
        var createTimeTd = $('<td colspan="2" style="padding-left: 10px;"></td>').text('创建时间: ' + commonInfo["createTime"]);
        var manifestTimeTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('货单时间: ' + commonInfo["manifestTime"]);
        orderReceiptTr.append(codeTd).append(createTimeTd).append(manifestTimeTd);

        var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var createrTd = $('<td colspan="5" style="padding-left: 10px;"></td>').text('装修单号: ' + commonInfo["orderId"]);
        var designerReceiptTd = $('<td colspan="6" id="manifestType" style="padding-left: 10px;"></td>').text('创  建  人: ' + commonInfo["creater"]);
        presonReceiptTr.append(createrTd).append(designerReceiptTd);

        var totalReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var totalTd = $('<td colspan="5" style="padding-left: 10px;"></td>').text('地   址: ' + commonInfo["address"]);
        var statusTd = $('<td colspan="6" style="padding-left: 10px;"></td>').text('监   理: ' + commonInfo["supervisor"]);
        totalReceiptTr.append(totalTd).append(statusTd);

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var goodsNoTd = $('<td style="text-align: center;" colspan="1"></td>').html('<strong>商品编号</strong>').appendTo(receReceiptTr);
        var goodsNameTd = $('<td style="text-align: center;" colspan="1"></td>').html('<strong>出货仓库</strong>').appendTo(receReceiptTr);
        var measurementUnitTd = $('<td style="text-align: center;" colspan="7"></td>').html('<strong>商品名</strong>').appendTo(receReceiptTr);
        var outstorehouseNameTd = $('<td style="text-align: center;" colspan="1"></td>').html('<strong>单位</strong>').appendTo(receReceiptTr);
        var numTd = $('<td style="text-align: center;" colspan="1"></td>').html('<strong>数量</strong>').appendTo(receReceiptTr);



        $.each(itemInfo, function (i, v) {

            var outstorehouseName = v.outstorehouse.name == null ? "---" : v.outstorehouse.name;

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var goodsNoTd = $('<td style="text-align: center;" colspan="1"></td>').html(v.goods.no).appendTo(receReceiptTr);
            var goodsNameTd = $('<td style="text-align: center;" colspan="1"></td>').html(outstorehouseName).appendTo(receReceiptTr);
            var measurementUnitTd = $('<td style="text-align: center;" colspan="7"></td>').html(v.goods.name).appendTo(receReceiptTr);
            var outstorehouseNameTd = $('<td style="text-align: center;" colspan="1"></td>').html(v.goods.measurementUnit).appendTo(receReceiptTr);
            var numTd = $('<td style="text-align: center;" colspan="1"></td>').html(v.num).appendTo(receReceiptTr);
        });

        var headReceiptTr1 = $('<tr></tr>').appendTo(receiptTable);
        var headReceiptTd1 = $('<td colspan="11"></td>').appendTo(headReceiptTr1);
        var headReceiptDiv1 = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd1);
        var headReceiptH21 = $('<span style="margin-left: 70%;"></span>').text("领取人:").appendTo(headReceiptDiv1);

    }
});
