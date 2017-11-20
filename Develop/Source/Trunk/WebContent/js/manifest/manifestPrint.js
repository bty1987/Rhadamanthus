jQuery(function($) {
    Api().init('../../js/api/');

    params.server = window.server;
    params.authentication = parent.params.authentication;

    var args = window.location.search.substr(1);//mid=21

    var itemUrl = '';
    var ename = '';

    //if(args.indexOf('mid=') != -1){
    //    itemUrl = api.inventory.queryManifestItemByMId;
        //ename = 'manifestItems';
    //}

    if(args.indexOf('time=') != -1){
        params.loginTime = args.substring(args.indexOf('time=')).split('=')[1];
    }

    var url = api.inventory.queryManifestByMId;
    url.url = url.url + "?" + args;

    com.post(url, {}, function(res){
        var manifest = res.manifest;

        var commonInfo = {};

        commonInfo["mid"] = manifest.mid;
        commonInfo["code"] = manifest.code;
        commonInfo["createTime"] = manifest.createTime;
        commonInfo["createUser"] = manifest.createUser.userName;
        commonInfo["manifestTime"] = manifest.manifestTime;
        commonInfo["total"] = manifest.total;
        commonInfo["status"] = manifest.status;
        commonInfo["type"] = manifest.type;
        //itemUrl.url = itemUrl.url + "?" + ename + ".msoId=" + materialSubOrder.msoId;
        com.post(api.inventory.queryManifestItemByMId, {"manifest.mid":manifest.mid}, function(res){
            createReceiptTable(commonInfo, res.manifestItems);
        }, null, false);
    });

    function createReceiptTable(commonInfo, itemInfo, type){

        var total = 0;
        var refundTotal = 0;

        var packageNames = [];

        var type;
        (commonInfo.type == 1) && (type = "进货");
        (commonInfo.type == 2) && (type = "进退");
        (commonInfo.type == 3) && (type = "出货");
        (commonInfo.type == 4) && (type = "出返");
        (commonInfo.type == 5) && (type = "调拨");
        (commonInfo.type == 6) && (type = "采购");
        (commonInfo.type == 7) && (type = "辅料");
        (commonInfo.type == 8) && (type = "套合");
        (commonInfo.type == 9) && (type = "套拆");

        var status;
        (commonInfo.status == 0) && (status = "初始");
        (commonInfo.status == 1) && (status = "已确认");

        var center = $("<center></center>").appendTo("#manifestPrint");

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
        var createUserTd = $('<td colspan="5" style="height: 30px;padding-left: 10px;"></td>').text('创 建 人: ' + commonInfo.createUser);
        var designerReceiptTd = $('<td colspan="6" id="manifestType" style="padding-left: 10px;"></td>').text('货单类型: ' + type);
        presonReceiptTr.append(createUserTd).append(designerReceiptTd);

        var totalReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var totalTd = $('<td colspan="5" style="height: 30px;padding-left: 10px;"></td>').text('总金额: ' + commonInfo.total + '元');
        var statusTd = $('<td colspan="6" style="padding-left: 10px;"></td>').text('状   态: ' + status);
        totalReceiptTr.append(totalTd).append(statusTd);

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var goodsNoTd = $('<td style="text-align: center;height: 30px;"></td>').html('<strong>商品编号</strong>').appendTo(receReceiptTr);
        var goodsNameTd = $('<td style="text-align: center;"></td>').html('<strong>商品名</strong>').appendTo(receReceiptTr);
        var measurementUnitTd = $('<td style="text-align: center;"></td>').html('<strong>单位</strong>').appendTo(receReceiptTr);
        var colorTd = $('<td style="text-align: center;"></td>').html('<strong>颜色</strong>').appendTo(receReceiptTr);
        var measurementUnitNameTd = $('<td style="text-align: center;"></td>').html('<strong>规格</strong>').appendTo(receReceiptTr);
        var instorehouseNameTd = $('<td style="text-align: center;"></td>').html('<strong>进货仓库</strong>').appendTo(receReceiptTr);
        var outstorehouseNameTd = $('<td style="text-align: center;"></td>').html('<strong>出货仓库</strong>').appendTo(receReceiptTr);
        var numTd = $('<td style="text-align: center;"></td>').html('<strong>数量</strong>').appendTo(receReceiptTr);
        var pieceNumTd = $('<td style="text-align: center;"></td>').html('<strong>件数</strong>').appendTo(receReceiptTr);
        var unitPriceTd = $('<td style="text-align: center;"></td>').html('<strong>采购价</strong>').appendTo(receReceiptTr);
        var commentTd = $('<td style="text-align: center;"></td>').html('<strong>备注</strong>').appendTo(receReceiptTr);

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
            var numTd = $('<td style="text-align: center;"></td>').html(v.num).appendTo(receReceiptTr);
            var pieceNumTd = $('<td style="text-align: center;"></td>').html(v.goods.pieceNum).appendTo(receReceiptTr);
            var unitPriceTd = $('<td style="text-align: center;"></td>').html(v.unitPrice).appendTo(receReceiptTr);
            var commentTd = $('<td style="text-align: center;"></td>').html(v.comment).appendTo(receReceiptTr);
        });

    }
});
