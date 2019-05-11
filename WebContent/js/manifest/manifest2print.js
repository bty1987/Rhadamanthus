jQuery(function($) {

    var params = {};
    api = parent.api;
    config = parent.config ;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    params = parent.params;

    params.server = window.server;
    params.authentication = parent.params.authentication;
    
    var mid = params["manifest.mid"];
    
    var manifestTypes = [''];
    var commonInfo = {};
    
    com.post(api.ds.manifest, {}, function(res){
        $.each(res.manifestType, function(i, e){
        	manifestTypes.push(e.value);
        });
    }, null, false);

    com.post(api.inventory.queryManifestByMid, {"manifest.mid": mid}, function(res){
        var manifest = res.manifest;

        commonInfo["mid"] = manifest.mid;
        commonInfo["code"] = manifest.code;
        commonInfo["createTime"] = manifest.createTime;
        commonInfo["creater"] = manifest.creater.userName;
        commonInfo["manifestTime"] = manifest.manifestTime;
        commonInfo["total"] = manifest.total;
        commonInfo["status"] = manifest.status;
        commonInfo["type"] = manifest.type;

    }, null, false);
    
    com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": mid}, function(res){
        createReceiptTable(commonInfo, res.manifestItems);
    }, null, false);

    function createReceiptTable(commonInfo, itemInfo, type){

        var total = 0;
        var refundTotal = 0;

        var packageNames = [];

        var type = manifestTypes[commonInfo.type];

        var status;
        (commonInfo.status == 0) && (status = "初始");
        (commonInfo.status == 1) && (status = "已确认");

        var center = $("<center></center>").appendTo($("#manifestPrint"));

        var noTable = $('<table style="width: 80%; border-collapse:collapse;"></table>').appendTo(center);
        var noTr = $('<tr></tr>').appendTo(noTable);
        var noTd = $('<td colspan="11"></td>').appendTo(noTr);

        var receiptTable = $('<table border="1" style="width: 80%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
        var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
        var headReceiptTd = $('<td colspan="11"></td>').appendTo(headReceiptTr);
        var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
        var headReceiptH2 = $('<h2></h2>').text("货单明细信息").appendTo(headReceiptDiv);

        var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var codeTd = $('<td colspan="5" style="height: 30px;padding-left: 10px;"></td>').text('货单编号: ' + commonInfo.code);
        var createTimeTd = $('<td colspan="2" style="padding-left: 10px;"></td>').text('创建时间: ' + commonInfo.createTime);
        var manifestTimeTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('货单时间: ' + commonInfo.manifestTime);
        orderReceiptTr.append(codeTd).append(createTimeTd).append(manifestTimeTd);

        var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var createrTd = $('<td colspan="5" style="height: 30px;padding-left: 10px;"></td>').text('创 建 人: ' + commonInfo.creater);
        var designerReceiptTd = $('<td colspan="2" id="manifestType" style="padding-left: 10px;"></td>').text('货单类型: ' + type);
        var statusTd = $('<td colspan="4" style="padding-left: 10px;"></td>').text('状   态: ' + status);
        presonReceiptTr.append(createrTd).append(designerReceiptTd).append(statusTd);

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var goodsNoTd = $('<td style="text-align: center;height: 30px;"></td>').html('<strong>商品编号</strong>').appendTo(receReceiptTr);
        var goodsNameTd = $('<td style="text-align: center;"></td>').html('<strong>商品名</strong>').appendTo(receReceiptTr);
        var measurementUnitTd = $('<td style="text-align: center;"></td>').html('<strong>单位</strong>').appendTo(receReceiptTr);
        var colorTd = $('<td style="text-align: center;"></td>').html('<strong>颜色</strong>').appendTo(receReceiptTr);
        var measurementUnitNameTd = $('<td style="text-align: center;"></td>').html('<strong>规格</strong>').appendTo(receReceiptTr);
        var instorehouseNameTd = $('<td style="text-align: center;"></td>').html('<strong>进货仓库</strong>').appendTo(receReceiptTr);
        var outstorehouseNameTd = $('<td style="text-align: center;"></td>').html('<strong>出货仓库</strong>').appendTo(receReceiptTr);
        var pieceNumTd = $('<td style="text-align: center;"></td>').html('<strong>件数</strong>').appendTo(receReceiptTr);
        var inpriceTd = $('<td style="text-align: center;"></td>').html('<strong>入库价</strong>').appendTo(receReceiptTr);
        var outpriceTd = $('<td style="text-align: center;"></td>').html('<strong>出库价</strong>').appendTo(receReceiptTr);
        var numTd = $('<td style="text-align: center;"></td>').html('<strong>数量</strong>').appendTo(receReceiptTr);

        $.each(itemInfo,function(i,v){
            var instorehouseName = v.instorehouse.name == null ? "---" : v.instorehouse.name;
            var outstorehouseName = v.outstorehouse.name == null ? "---" : v.outstorehouse.name;

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var goodsNoTd = $('<td style="text-align: center;height: 40px;"></td>').html(v.goods.no).appendTo(receReceiptTr);
            var goodsNameTd = $('<td style="text-align: center;"></td>').html(v.goods.name).appendTo(receReceiptTr);
            var measurementUnitTd = $('<td style="text-align: center;"></td>').html(v.goods.measurementUnit).appendTo(receReceiptTr);
            var colorTd = $('<td style="text-align: center;"></td>').html(v.color.name).appendTo(receReceiptTr);
            var measurementUnitNameTd = $('<td style="text-align: center;"></td>').html(v.format.info).appendTo(receReceiptTr);
            var instorehouseNameTd = $('<td style="text-align: center;"></td>').html(instorehouseName).appendTo(receReceiptTr);
            var outstorehouseNameTd = $('<td style="text-align: center;"></td>').html(outstorehouseName).appendTo(receReceiptTr);
            var pieceNumTd = $('<td style="text-align: center;"></td>').html(v.goods.pieceNum).appendTo(receReceiptTr);
            var inpriceTd = $('<td style="text-align: center;"></td>').html(v.inprice).appendTo(receReceiptTr);
            var outpriceTd = $('<td style="text-align: center;"></td>').html(v.outprice).appendTo(receReceiptTr);
            var numTd = $('<td style="text-align: center;"></td>').html(v.surplus).appendTo(receReceiptTr);
        });

    }
});
