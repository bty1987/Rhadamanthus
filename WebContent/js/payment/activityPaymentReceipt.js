
jQuery(function($) {
    
    var receipt = {
        pageCount:5,
        tableList:[],
        args:null,

        paymentTypeData: parent.constant.payment().activityPayment.paymentType.keys,
        advanceTypeData: {"0":"-"},

        commonInfo: {},
        paymentItems: [],
        receiptItems: []
    };
    
    api = parent.api;
    config = parent.config ;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    params = parent.params;

    var queryActivityPaymentByArid = api.payment.queryActivityPaymentByArid;

    com.post(queryActivityPaymentByArid, {"activityPayment.activityReceipt.arid":params.payment.activityPayment.arid}, function(res){

        var activityPayments = res.activityPayments;

        var commonInfo = {};

        var paymentItems = [];
        var activityPaymentBrand = "";
        var activityPaymentDes = "";

        for(var i=0;i<activityPayments.length;i++){

            var activityPayment = activityPayments[i];
            activityPaymentBrand = activityPayment.brand;

            commonInfo["orderId"] = activityPayment.orderId;
            commonInfo["mno"] = activityPayment.mno;
            commonInfo["collectUserName"] = activityPayment.collecter.currentName;
            commonInfo["collectTime"] = activityPayment.collectTime;

            receipt.paymentItems.push({"paymentType": receipt.paymentTypeData[activityPayment.type], "money": activityPayment.money, "activityPaymentBrand": activityPaymentBrand});

        }

        if(activityPayment.comment && activityPayment.comment != ""){
            activityPaymentDes = activityPayment.comment;
        }

        commonInfo["activityPaymentDes"] = activityPaymentDes;

        receipt.commonInfo = commonInfo;

    }, null ,false);

    var queryactivityReceiptByArid = api.payment.queryActivityReceiptByArid;

    com.post(queryactivityReceiptByArid, {"activityReceipt.arid":params.payment.activityPayment.arid}, function(res){

        var activityReceipt = res.activityReceipt;

        receipt.activityReceipt = res.activityReceipt;

        if(parseFloat(activityReceipt.cash) != 0){
            var tem = {
                "money":parseFloat(activityReceipt.cash),
                "paymentWay":"现金"
            };
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(activityReceipt.bank) != 0){
            var tem = {
                "money":parseFloat(activityReceipt.bank),
                "paymentWay":"刷卡"
            };
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(activityReceipt.coupon)!=0){
            var tem={
                "money":parseFloat(activityReceipt.coupon),
                "paymentWay":"优惠券"
            };
            receipt.receiptItems.push(tem);
        }

    }, null, false);

    if(receipt.paymentItems.length > 0){
        createReceiptTable();
    }
    
    function createReceiptTable(){

        var commonInfo = receipt.commonInfo;
        var paymentItems = receipt.paymentItems;
        var receiptItems = receipt.receiptItems;

        var srId = parent.params.payment.activityPayment.arid;
        var noInit = "000000000000"+srId;

        var no = noInit.substring(srId.length, noInit.length);


        var center = $("<center></center>").appendTo("#activityPaymentReceipt");

        var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
        var noTr = $('<tr></tr>').appendTo(noTable);
        var noTd = $('<td colspan="4" style="text-align: right;padding-right: 10px;font-family: 微软雅黑;"></td>').html("NO:"+no).appendTo(noTr);

        var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
        var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
        var headReceiptTd = $('<td colspan="4"></td>').appendTo(headReceiptTr);
        var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
        var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(parent.params.company.name + "专用收据").appendTo(headReceiptDiv);

        var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var timeReceiptTd = $('<td colspan="2" style="width: 25%"></td>').text('会员号: ' + commonInfo["mno"]).appendTo(presonReceiptTr);
        var addrReceiptTd = $('<td colspan="2"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(presonReceiptTr);

        var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);

        var balancePaymentTd = $('<td style="width: 15%; text-align: center;" rowspan=' + (paymentItems.length+1) + '></td>').html('<strong>收款信息</strong>').appendTo(recePaymentTr);
        var typePaymentTd = $('<td style="width: 20%; text-align: center;"></td>').html('<strong>品牌</strong>').appendTo(recePaymentTr);
        var typePaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
        var amountPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

        var total = 0;

        for(var j=0;j<paymentItems.length;j++){

            var paymentItem = paymentItems[j];

            var receInfoPaymentTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 20%; text-align: center;"></td>').text(paymentItem["activityPaymentBrand"]?paymentItem["activityPaymentBrand"]:"---").appendTo(receInfoPaymentTr);
            var typeInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(paymentItem["paymentType"]).appendTo(receInfoPaymentTr);
            var amountInfoPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').text(paymentItem["money"]).appendTo(receInfoPaymentTr);
        }

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);

        var balanceReceiptTd = $('<td style="width: 15%; text-align: center;" rowspan=' + (receiptItems.length+1) + ' colspan=2></td>').html('<strong>收据信息</strong>').appendTo(receReceiptTr);
        var typeReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
        var amountReceiptTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

        for(var i=0;i<receiptItems.length;i++){

            var receiptItem = receiptItems[i];

            var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItem["paymentWay"]).appendTo(receInfoReceiptTr);
            var amountInfoPaymentTd = $('<td style="width: 30%; text-align: center;"></td>').text(receiptItem["money"]).appendTo(receInfoReceiptTr);

            if(receiptItem["paymentWay"].indexOf("预付款") == -1){
                total += parseFloat(receiptItem["money"]);
            }
        }

        var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var renReceiptTd = $('<td colspan="2"></td>').text('人民币大写: ' + utils.getCNMoney(total)).appendTo(moneyReceiptTr);
        var renMoneyReceiptTd = $('<td colspan="2"></td>').text('实收: ¥' + total).appendTo(moneyReceiptTr);

        var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var summaryReceiptTd = $('<td colspan="4"></td>').appendTo(summaryReceiptTr);
        var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
        var receReceiptSpan = $('<span></span>').text('收款人:' + receipt.activityReceipt.collecter.currentName).appendTo(summaryReceiptDiv);
        // var cashierReceiptSpan = $('<span></span>').text(' 交款人:').appendTo(summaryReceiptDiv);

        var addrReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var paymentDesTd = $('<td colspan="4"></td>').text('备注: ' + commonInfo["activityPaymentDes"]).appendTo(addrReceiptTr);

    }


});

