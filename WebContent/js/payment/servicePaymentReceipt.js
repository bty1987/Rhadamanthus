jQuery(function ($) {
    var receipt = {
        onePageCount: 5,
        payments: [],
        receipts: [],
        order: null,
        bankInfo: {},
        checkBankInfo: {},
        receiptsNum: 0
    };

    var params = {};
    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;

    params.server = window.server;
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

    var queryDecorationForCommonByOrderId = api.decoration.queryDecorationForCommonByOrderId;

    com.post(queryDecorationForCommonByOrderId, {"decoration.orderId": params.decorationOrderSOrderId}, function (res) {
        receipt.order = res.decoration;
    }, null, false);

    var queryServicePaymentForNotInitBySrId = api.payment.queryServicePaymentForNotInitBySrId;

    com.post(queryServicePaymentForNotInitBySrId, {"serviceReceipt.srId": params.serviceReceiptSrId}, function (res) {
        var payments = res.servicePayments;

        for (var i = 0; i < payments.length; i++) {
            var payment = payments[i];
            receipt.payments.push({
                "status": payment.status,
                "serviceMoney": payment.serviceMoney,
                "advanceMoney": payment.advanceMoney
            });
        }
    }, null, false);

    var queryServiceReceiptBySrId = api.payment.queryServiceReceiptBySrId;

    com.post(queryServiceReceiptBySrId, {"serviceReceipt.srId": params.serviceReceiptSrId}, function (res) {
        var serviceReceiptDes = "";

        var serviceReceipt = res.serviceReceipt;

        if (parseFloat(serviceReceipt.cash) != 0) {
            var tem = {
                "paymentId": serviceReceipt.srId,
                "collectTime": serviceReceipt.collectTime,
                "collectUser": serviceReceipt.collecterName,
                "money": parseFloat(serviceReceipt.cash),
                "paymentWay": "现金"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
        }

        if (parseFloat(serviceReceipt.bank) != 0) {
            var bankParams = getBankInfo(serviceReceipt.bankInfo, 0, null, receipt.receiptsNum, receipt.bankInfo, null);
            var tem = {
                "paymentId": serviceReceipt.srId,
                "collectTime": serviceReceipt.collectTime,
                "collectUser": serviceReceipt.collecterName,
                "money": parseFloat(serviceReceipt.bank),
                "bankInfo": bankParams[0],
                "paymentWay": "刷卡"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum = bankParams[1] + 1;
        }

        if (parseFloat(serviceReceipt.checkv) != 0) {
            var checkvParams = getBankInfo(serviceReceipt.checkvBank, 1, parseFloat(serviceReceipt.checkv), receipt.receiptsNum, null, receipt.checkBankInfo);
            var tem = {
                "paymentId": serviceReceipt.srId,
                "collectTime": serviceReceipt.collectTime,
                "collectUser": serviceReceipt.collecterName,
                "money": parseFloat(serviceReceipt.checkv),
                "bankInfo": checkvParams[0],
                "paymentWay": "转账"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum = checkvParams[1] + 1;
        }

        if (serviceReceipt.des && serviceReceipt.des != "") {
            serviceReceiptDes += serviceReceipt.des + " ";
        }

        receipt.order.serviceReceiptDes = serviceReceiptDes;
        receipt.serviceReceipt = res.serviceReceipt;
    }, null, false);

    if (receipt.payments.length != 0 && receipt.receipts.length != 0) {
        generateOneReceipt();
    }

    function generateOneReceipt() {
        var num = receipt.receipts.length;
        var count = 0;

        if (num % receipt.onePageCount == 0) {
            count = Math.floor(num / receipt.onePageCount);
        } else {
            count = Math.floor(num / receipt.onePageCount) + 1;
        }

        var servicePaymentReceipt = $("#servicePaymentReceipt");

        for (var i = 0; i < count; ++i) {
            var start = i * receipt.onePageCount;
            var first = receipt.receipts[start];
            var No = utils.padLeft(first.paymentId, 11);
            var supervisor = "";

            if (i != 0) {
                var pageNext = $("<div></div>").addClass("PageNext").appendTo(servicePaymentReceipt);
            }

            if (receipt.order.supervisor != null) {
                supervisor = receipt.order.supervisor;
            }

            var center = $("<center></center>").appendTo(servicePaymentReceipt);
            var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
            var noTr = $('<tr></tr>').appendTo(noTable);
            var noTd = $('<td colspan="4"></td>').appendTo(noTr);
            var noDiv = $('<div id="no" style="text-align: right; padding-right: 150px;"></div>').text("NO: " + No).appendTo(noTd);
            var headReceiptDiv = $('<div style="text-align: center; background-color:#ffffff"></div>').appendTo(center);
            var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(parent.params.company.name + "专用收款收据").appendTo(headReceiptDiv);

            var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);

            var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var noReceiptTd = $('<td style="width: 15%"></td>').text('装修单号: ' + receipt.order.orderId).appendTo(orderReceiptTr);
            var timeReceiptTd = $('<td style="width: 20%"></td>').text('合同编号: ' + receipt.order.contractCode).appendTo(orderReceiptTr);
            var customerReceiptTd = $('<td style="width: 20%" colspan="2"></td>').html('设 计 师: ' + receipt.order.designer.currentName + "-" + receipt.order.designer.dept.name).appendTo(orderReceiptTr);
            //var designerReceiptTd = $('<td style="width: 10%"></td>').text('').appendTo(orderReceiptTr);
            var designerReceiptTd = $('<td style="width: 35%"></td>').text('').appendTo(orderReceiptTr);


            var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var addrReceiptTd = $('<td style="width: 35%" colspan="2"></td>').text('客户地址: ' + receipt.order.house.village.name + receipt.order.house.houseNumber).appendTo(presonReceiptTr);
            var supervisorNameTd = $('<td style="width: 30%" colspan="2"></td>').text('收款日期: ' + first.collectTime).appendTo(presonReceiptTr);
            var designerReceiptTd = $('<td style="width: 35%"></td>').text('监 理: ' + (supervisor.currentName == null ? "-" : supervisor.currentName)).appendTo(presonReceiptTr);

            var sumMoney = 0;

            var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 35%; text-align: center;" rowspan="4"  colspan="2"></td>').html("<strong>收款信息</strong>").appendTo(recePaymentTr);
            var balancePaymentTd = $('<td style="width: 30%; text-align: center;" colspan="2"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
            var amountPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

            var receReceiptTrAdvanceMoney = $('<tr></tr>').appendTo(receiptTable);
            var advanceMoneyText = $('<td style="width: 17%; text-align: center;" colspan="2"></td>').html('预付款').appendTo(receReceiptTrAdvanceMoney);
            var advanecMoney = $('<td style="width: 15%; text-align: center;"></td>').html(receipt.payments[0].advanceMoney).appendTo(receReceiptTrAdvanceMoney);

            var receReceiptTrServiceMoney = $('<tr></tr>').appendTo(receiptTable);
            var serviceMoneyText = $('<td style="width: 18%; text-align: center;" colspan="2"></td>').html('服务费').appendTo(receReceiptTrServiceMoney);
            var serviceMoney = $('<td style="width: 15%; text-align: center;"></td>').html(receipt.payments[0].serviceMoney).appendTo(receReceiptTrServiceMoney);

            for (var i = 0; i < receipt.payments.length; i++) {
                var paymentInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var paymentTypeReceiptTd = $('<td style="width: 30%; text-align: center;" colspan="2"></td>').text(receipt.payments[i].paymentType).appendTo(paymentInfoReceiptTr);
                var paymentMoneyReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.payments[i].referMoney).appendTo(paymentInfoReceiptTr);
            }

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoReceiptTd = $('<td style="width: 20%; text-align: center;" rowspan="' + ( receipt.receiptsNum + 1) + '" colspan=2></td>').html("<strong>收据信息</strong>").appendTo(receReceiptTr);
            var balanceReceiptTd = $('<td style="width: 35%; text-align: center;" colspan=2></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
            var amountReceiptTd = $('<td style="width: 30%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

            for (; start < (i + 1) * receipt.onePageCount && start < num; ++start) {
                if (receipt.receipts[start].paymentWay.indexOf("预付款") == -1) {
                    sumMoney += receipt.receipts[start].money;
                }
                if (receipt.receipts[start].paymentWay == "刷卡" || receipt.receipts[start].paymentWay == "转账") {
                    var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var bankInfoReceiptTd = $('<td style="width: 20%; text-align: center;" rowspan="' + (receipt.receipts[start].bankInfo.length + 1) + '"></td>').text(receipt.receipts[start].paymentWay).appendTo(receInfoReceiptTr);

                    for (var i = 0; i < receipt.receipts[start].bankInfo.length; i++) {
                        var bankTr = $('<tr></tr>').appendTo(receiptTable);
                        var balanceInfoReceiptTd = $('<td style="width: 15%; text-align: center;"></td>').text(receipt.receipts[start].bankInfo[i].key).appendTo(bankTr);
                        var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.receipts[start].bankInfo[i].value).appendTo(bankTr);
                    }
                } else {
                    var commonInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var balanceInfoReceiptTd = $('<td style="width: 30%; text-align: center;"  colspan=2></td>').text(receipt.receipts[start].paymentWay).appendTo(commonInfoReceiptTr);
                    var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.receipts[start].money).appendTo(commonInfoReceiptTr);
                }

            }

            var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var renReceiptTd = $('<td colspan="2"></td>').text('人民币大写: ' + utils.getCNMoney(sumMoney)).appendTo(moneyReceiptTr);
            var renMoneyReceiptTd = $('<td colspan=3></td>').text('实收: ¥' + sumMoney).appendTo(moneyReceiptTr);

            var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var summaryReceiptTd = $('<td colspan="5"></td>').appendTo(summaryReceiptTr);
            var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
            var receReceiptSpan = $('<span></span>').text('收款人: ' + receipt.serviceReceipt.collecter.currentName + "  ").appendTo(summaryReceiptDiv);
            var cashierReceiptSpan = $('<span></span>').text(' 交款人: ').appendTo(summaryReceiptDiv);

            var addrReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var collectDesTd = $('<td colspan="5"></td>').text('备注: ' + receipt.serviceReceipt.comment).appendTo(addrReceiptTr);
        }
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

