
jQuery(function($) {
    var receipt = {
        paymentTypeData: {},
        advanceTypeData: {"0":"-"},
        commonInfo: {},
        paymentItems: [],
        receiptItems: [],
        bankInfo: {},
        checkBankInfo: {},
        receiptsNum:0
    };

    var params = {};
    api = parent.api;
    config = parent.config ;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;

    params.serverPath = window.server;
    params.authentication = parent.params.authentication;
    params = parent.params;

    com.post(api.common.queryReceiptType, {}, function (res) {
        $.each(res.receiptTypes, function (i, v) {
            if (v.type == 2) {
                receipt.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                receipt.checkBankInfo[v.no] = v.name;
            }
        });

    }, null, false);

    var querySalesPaymentForNotInitBySrId = api.payment.querySalesPaymentForNotInitBySrId;

    com.post(api.ds.payment, {}, function(res){
        for(var i=0;i<res.advanceTypeForSalesMaterial.length;i++){
            var type = res.advanceTypeForSalesMaterial[i];
            receipt.advanceTypeData[type.key] = type.value;
        }

        for(var i=0;i<res.materialPaymentType.length;i++){
            var paymentType = res.materialPaymentType[i];
            receipt.paymentTypeData[paymentType.key] = paymentType.value;
        }

    }, null, false);

    com.post(querySalesPaymentForNotInitBySrId, {"salesReceipt.srId":params.salesReceiptSrId}, function(res){
        var salesPayments = res.salesPayments;
        var commonInfo = {};
        var paymentItems = [];
        var salesBrand = "";
        var salesPaymentDes = "";

        for(var i=0;i<salesPayments.length;i++){
            var salesPayment = salesPayments[i];
            salesBrand = salesPayment.sales.brand;

            commonInfo["orderId"] = salesPayment.sales.orderId;
            commonInfo["no"] = salesPayment.sales.no;
            commonInfo["orderAddr"] = salesPayment.sales.house.village.cityProper.city.name + ' ' + salesPayment.sales.house.village.cityProper.name + ' ' + salesPayment.sales.house.village.name + " " + salesPayment.sales.house.houseNumber;
            commonInfo["customerName"] = salesPayment.sales.customer.name;
            commonInfo["salesmanName"] = salesPayment.sales.salesman.currentName;
            commonInfo["departmentName"] = salesPayment.sales.dept.name;

            commonInfo["collectUserName"] = salesPayment.salesReceipt.collecterName;
            commonInfo["collectTime"] = salesPayment.salesReceipt.collectTime;

            receipt.paymentItems.push({"paymentType": receipt.paymentTypeData[salesPayment.type], "money": salesPayment.referMoney, "salesBrand": salesBrand});
        }

        if(salesPayment.salesReceipt.comment && salesPayment.salesReceipt.comment != ""){
            salesPaymentDes = salesPayment.salesReceipt.comment
        }

        commonInfo["salesPaymentDes"] = salesPaymentDes;

        receipt.commonInfo = commonInfo;

    }, null ,false);

    var querysalesReceiptBySrId = api.payment.querySalesReceiptBySrId;

    com.post(querysalesReceiptBySrId, {"salesReceipt.srId":params.salesReceiptSrId}, function(res){
        var salesReceipt = res.salesReceipt;

        receipt.salesReceipt = res.salesReceipt;

        if(parseFloat(salesReceipt.cash) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.cash),
                "paymentWay":"现金"
            };
            receipt.receiptItems.push(tem);
            receipt.receiptsNum  =  receipt.receiptsNum +1;
        }

        if(parseFloat(salesReceipt.bank) != 0){
            var bankParams = getBankInfo(salesReceipt.bankInfo, 0, null, receipt.receiptsNum, receipt.bankInfo, null);
            var tem = {
                "bankInfo": bankParams[0],
                "money":parseFloat(salesReceipt.bank),
                "paymentWay":"刷卡"
            };
            receipt.receiptItems.push(tem);
            receipt.receiptsNum  =  bankParams[1] + 1;
        }

        if(parseFloat(salesReceipt.checkv) != 0){
            var checkvParams = getBankInfo(salesReceipt.checkvBank, 1, parseFloat(salesReceipt.checkv), receipt.receiptsNum, null, receipt.checkBankInfo);
            var tem = {
                "bankInfo": checkvParams[0],
                "money":parseFloat(salesReceipt.checkv),
                "paymentWay":"转账"
            };
            receipt.receiptItems.push(tem);
            receipt.receiptsNum  =  checkvParams[1] + 1;
        }

        if(parseFloat(salesReceipt.coupon) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.coupon),
                "paymentWay":"优惠券"
            };
            receipt.receiptsNum  =  receipt.receiptsNum +1;
            receipt.receiptItems.push(tem);
        }

        if(parseFloat(salesReceipt.advance) != 0){
            var tem = {
                "money":parseFloat(salesReceipt.advance),
                "paymentWay":receipt.advanceTypeData[salesReceipt.advanceType] + " 预付款"
            };
            receipt.receiptItems.push(tem);
            receipt.receiptsNum  =  receipt.receiptsNum +1;
        }

    }, null, false);

    if(receipt.paymentItems.length > 0){
        createReceiptTable();
    }

    function createReceiptTable(){
        var commonInfo = receipt.commonInfo;
        var paymentItems = receipt.paymentItems;
        var receiptItems = receipt.receiptItems;

        var center = $("<center></center>").appendTo("#salesPaymentReceipt");

        var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
        var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
        var headReceiptTd = $('<td colspan="5"></td>').appendTo(headReceiptTr);
        var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
        var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(parent.params.company.name + "代收款收据").appendTo(headReceiptDiv);

        var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var noReceiptTd = $('<td style="width: 25%" colspan="2"></td>').text('装修单号: ' + commonInfo["orderId"]).appendTo(orderReceiptTr);
        var addrReceiptTd = $('<td style="width: 40%" colspan="2"></td>').text('客户地址: ' + commonInfo["orderAddr"]).appendTo(orderReceiptTr);
        var timeReceiptTd = $('<td style="width: 35%" colspan="2"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(orderReceiptTr);

        var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);

        var balancePaymentTd = $('<td style="width: 10%; text-align: center;" rowspan=' + (paymentItems.length+1) + '></td>').html('<strong>收款信息</strong>').appendTo(recePaymentTr);
        var typePaymentTd = $('<td style="width: 15%; text-align: center;"></td>').html('<strong>品牌</strong>').appendTo(recePaymentTr);
        var typePaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
        var amountPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

        var total = 0;

        for(var j=0;j<paymentItems.length;j++){
            var paymentItem = paymentItems[j];

            var receInfoPaymentTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 15%; text-align: center;"></td>').text(paymentItem["salesBrand"]).appendTo(receInfoPaymentTr);
            var typeInfoPaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').text(paymentItem["paymentType"]).appendTo(receInfoPaymentTr);
            var amountInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(paymentItem["money"]).appendTo(receInfoPaymentTr);
        }

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);

        var balanceReceiptTd = $('<td style="width: 25%; text-align: center;" rowspan=' + (receipt.receiptsNum  + 1) + ' colspan=2></td>').html('<strong>收据信息</strong>').appendTo(receReceiptTr);
        var typeReceiptTd = $('<td style="width: 40%; text-align: center;"  colspan=2></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
        var amountReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

        for(var i=0;i<receiptItems.length;i++){
            var receiptItem = receiptItems[i];

            if (receiptItems[i].paymentWay == "刷卡"|| receiptItems[i].paymentWay == "转账" ) {
                var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var bankInfoReceiptTd = $('<td style="width: 12%; text-align: center;" rowspan="' + (receiptItems[i].bankInfo.length+1) + '"></td>').text(receiptItems[i].paymentWay).appendTo(receInfoReceiptTr);

                for (var j = 0; j < receiptItems[i].bankInfo.length; j++) {
                    var bankTr = $('<tr></tr>').appendTo(receiptTable);
                    var balanceInfoReceiptTd = $('<td style="width: 28%; text-align: center;"></td>').text(receiptItems[i].bankInfo[j].key).appendTo(bankTr);
                    var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItems[i].bankInfo[j].value).appendTo(bankTr);
                }
            }else{
                var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var typeInfoPaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').text(receiptItem["paymentWay"]).appendTo(receInfoReceiptTr);
                var amountInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItem["money"]).appendTo(receInfoReceiptTr);
            }

            if(receiptItem["paymentWay"].indexOf("预付款") == -1 && receiptItem["paymentWay"].indexOf("优惠券") == -1){
                total += parseFloat(receiptItem["money"]);
            }
        }

        var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var renReceiptTd = $('<td colspan="4"></td>').text('人民币大写: ' + utils.getCNMoney(total)).appendTo(moneyReceiptTr);
        var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + total).appendTo(moneyReceiptTr);

        var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var summaryReceiptTd = $('<td colspan="5"></td>').appendTo(summaryReceiptTr);
        var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
        var receReceiptSpan = $('<span></span>').text('收款人:' + receipt.salesReceipt.collecter.currentName).appendTo(summaryReceiptDiv);
        var cashierReceiptSpan = $('<span></span>').text( '    交款人:').appendTo(summaryReceiptDiv);
    }

    function getBankInfo(bankInfoString, type, money, receiptsNumParams, bankInfo, checkBankInfo) {
        var bankinfo = [];
        var receiptsNum = receiptsNumParams;

        if(bankInfoString.indexOf("#") != -1){
            var stringSrray = bankInfoString.split('#');
            for (var i = 1; i < stringSrray.length - 1; i++) {

                if (stringSrray[i].length != 0) {
                    var _i = stringSrray[i].split('|');
                    if (type == 0) {
                        bankinfo.push({"key": bankInfo[_i[0]], "value": _i[1]});
                    } else if (type == 1) {
                        bankinfo.push({"key": checkBankInfo[_i[0]], "value": _i[1]});
                    }
                    receiptsNum = receiptsNum + 1;
                }
            }
        }else{
            if(bankInfoString != "" && type == 1){
                bankinfo.push({"key": checkBankInfo[bankInfoString], "value": money});
                receiptsNum = receiptsNumParams + 1;
            }
        }

        return [bankinfo, receiptsNum];

    }
});
