jQuery(function ($) {
    var params = {};
    var receipt = {
        bankInfo: {},
        checkBankInfo: {},
        receiptsNum: 0
    };
    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;

    com.post(api.common.queryReceiptType, {}, function (res) {
        $.each(res.receiptTypes, function (i, v) {
            if (v.type == 2) {
                receipt.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                receipt.checkBankInfo[v.no] = v.name;
            }
        });
    }, null, false);

    params.server = window.server;
    params.authentication = parent.params.authentication;
    params = parent.params;

    var queryPaymentByPaymentId = api.payment.queryPaymentByPaymentId;
    var queryDecorationByCustomerId = api.decoration.queryDecorationByCustomerId;

    var orderInfo = null;
    var commonInfo = {};
    var paymentInfo = [];

    com.post(queryPaymentByPaymentId, {"payment.pid": params.paymentPaymentId}, function (res) {
        var payment = res.payment;

        if (!payment.pid) {
            return;
        }

        commonInfo["customerName"] = payment.customer.name;
        commonInfo["collectUserName"] = payment.collectUser.currentName;
        commonInfo["collectTime"] = payment.collectTime;

        orderInfo = res.payment.orders;

        var paymentItems = [];

        if (parseFloat(payment.cash) != 0) {
            var tem = {
                "paymentType": getPaymentType(payment.paymentType),
                "money": parseFloat(payment.cash),
                "paymentWay": "现金"
            };
            paymentItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
        }

        if (parseFloat(payment.bank) != 0) {
            var bankParams = getBankInfo(payment.bankInfo, 0, null, receipt.receiptsNum, receipt.bankInfo, null);
            var tem = {
                "paymentType": getPaymentType(payment.paymentType),
                "money": parseFloat(payment.bank),
                "bankInfo": bankParams[0],
                "paymentWay": "刷卡"
            };
            paymentItems.push(tem);
            receipt.receiptsNum = bankParams[1] + 1;
        }

        if (parseFloat(payment.checkv) != 0) {
            var checkvParams = getBankInfo(payment.checkvBank, 1, parseFloat(payment.checkv), receipt.receiptsNum, null, receipt.checkBankInfo);
            var tem = {
                "paymentType": getPaymentType(payment.paymentType),
                "money": parseFloat(payment.checkv),
                "bankInfo": checkvParams[0],
                "paymentWay": "转账"
            };
            paymentItems.push(tem);
            receipt.receiptsNum = checkvParams[1] + 1;
        }

        if (parseFloat(payment.transfer) != 0) {
            var tem = {
                "paymentType": getPaymentType(payment.paymentType),
                "money": parseFloat(payment.transfer),
                "paymentWay": "预付款转换"
            };
            paymentItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
        }

        commonInfo["comment"] = payment.comment;

        var _items = [];

        for (var i = 0; i < paymentItems.length; i++) {
            if (_items.length >= 5) {
                paymentInfo.push(_items);
                _items = [];
            }

            _items.push(paymentItems[i]);
        }

        if (_items.length != 0) {
            paymentInfo.push(_items);
        }

        com.post(queryDecorationByCustomerId, {"decoration.customer.no": res.payment.customer.no}, function (data) {
            createReceiptTable(commonInfo, paymentInfo, data.decorations);
        }, null, false);
    }, null, false);

    function createReceiptTable(commonInfo, paymentInfo, orderInfo) {

        for (var i = 0; i < paymentInfo.length; i++) {
            var center = $("<center></center>").appendTo("#paymentReceipt");

            if (i != 0) {
                pageNext = $('<div class="PageNext"></div>');
                pageNext.appendTo(center);
            }

            var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
            var noTr = $('<tr></tr>').appendTo(noTable);
            var noTd = $('<td colspan="3"></td>').appendTo(noTr);
            var headReceiptDiv = $('<div style="text-align: center; background-color:#ffffff"></div>').appendTo(center);
            var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(parent.params.company.name + "专用收据").appendTo(headReceiptDiv);

            var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);

            var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var customerReceiptTd = $('<td style="width: 25%" colspan="2"></td>').text('客 户 名: ' + commonInfo["customerName"]).appendTo(presonReceiptTr);
            var timeReceiptTd = $('<td colspan="3"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(presonReceiptTr);

            for (var k = 0; k < orderInfo.length; k++) {
                var $order = orderInfo[k];

                var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var noReceiptTd = $('<td style="width: 25%" colspan="2"></td>').text('装修单号: ' + $order.orderId).appendTo(orderReceiptTr);
                var timeReceiptTd = $('<td colspan="3" style="width: 33%"></td>').text('楼盘: ' + $order.house.village.name + ' ' + $order.house.houseNumber).appendTo(orderReceiptTr);
                var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            }

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeReceiptTd = $('<td style="width: 25%; text-align: center;" ></td>').html('<strong>收款类型</strong>').appendTo(receReceiptTr);
            var balanceReceiptTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
            var amountReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

            var total = 0;

            for (var j = 0; j < paymentInfo[i].length; j++) {
                var receiptItems = paymentInfo[i][j];
                if (receiptItems["paymentWay"] == "刷卡" || receiptItems["paymentWay"] == "转账") {
                    var InfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var typeInfoReceiptTd = $('<td style="width: 25%; text-align: center;" rowspan="' + (receiptItems.bankInfo.length + 1) + '"></td>').text(receiptItems["paymentType"]).appendTo(InfoReceiptTr);
                    var bankInfoReceiptTd = $('<td style="width: 12%; text-align: center;" rowspan="' + (receiptItems.bankInfo.length + 1) + '"></td>').text(receiptItems.paymentWay).appendTo(InfoReceiptTr);

                    for (var k = 0; k < receiptItems.bankInfo.length; k++) {
                        var bankTr = $('<tr></tr>').appendTo(receiptTable);
                        var balanceInfoReceiptTd = $('<td style="width: 28%; text-align: center;"></td>').text(receiptItems["bankInfo"][k].key).appendTo(bankTr);
                        var amountInfoReceiptTd = $('<td style="width: 40%; text-align: center;"></td>').text(receiptItems["bankInfo"][k].value).appendTo(bankTr);
                    }
                } else {
                    var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var typeInfoReceiptTd = $('<td style="width: 25%; text-align: center;"></td>').text(receiptItems["paymentType"]).appendTo(receInfoReceiptTr);

                    var balanceInfoReceiptTd = $('<td style="width: 40%; text-align: center;"colspan="2" ></td>').text(receiptItems["paymentWay"]).appendTo(receInfoReceiptTr);
                    var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItems["money"]).appendTo(receInfoReceiptTr);

                }
                if (paymentInfo[i][j]["paymentWay"].indexOf("预付款") == -1) {
                    total += parseFloat(paymentInfo[i][j]["money"]);
                }
            }

            var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var renReceiptTd = $('<td colspan="3"></td>').text('人民币大写: ' + utils.getCNMoney(total)).appendTo(moneyReceiptTr);
            var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + total).appendTo(moneyReceiptTr);

            var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var summaryReceiptTd = $('<td colspan="4"></td>').appendTo(summaryReceiptTr);
            var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
            var receReceiptSpan = $('<span></span>').text('收款人:' + commonInfo["collectUserName"]).appendTo(summaryReceiptDiv);
            var cashierReceiptSpan = $('<span></span>').text(' 交款人:').appendTo(summaryReceiptDiv);

        }
    }

    function getPaymentType(type) {
        var newPaymentType;
        switch (type) {
            case 0:
                newPaymentType = "合同预付款";
                break;
            case 1:
                newPaymentType = "工程预付款";
                break;
            case 2:
                newPaymentType = "主材预付款";
                break;
            case 3:
                newPaymentType = "正林预付款";
                break;
        }

        return newPaymentType;
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
