jQuery(function($) {

    var receipt = {
        htmlName: "advance",
        onePageCount: 5,
        bankInfo: {},
        checkBankInfo: {},
        receiptsNum: 0,
        organizationName: "",
        cash: 0,
        checkBankInfoNum: 0,
        receiptNo: "",
        organization: "",
        url: parent.api.index.paymentReceiptIndex.url
    };
    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    printer = parent.printer;

    com.post(api.common.queryReceiptType, {}, function(res) {

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == 2) {
                receipt.bankInfo[v.no] = v.name;
            } else if (v.type == 3) {
                receipt.checkBankInfo[v.no] = v.name;
            }
        });
    }, null, false);

    params = parent.params;

    var queryPaymentByPaymentId = api.payment.queryPaymentByPaymentId;
    var queryDecorationByCustomerId = api.decoration.queryDecorationByCustomerId;

    var orderInfo = null;
    var commonInfo = {};
    var orderIds = "";
    var addrs = "";
    var arid = "";

    com.post(queryPaymentByPaymentId, {"payment.pid": params.payment.pid}, function(res) {

        var payment = res.payment;
        arid = payment.arId;

        if (!payment.pid) {
            return;
        }

        if (payment.paymentType == 0) {
            receipt.organizationName = parent.params.company.drganization.name + "收款收据";
            receipt.organization = parent.params.company.drganization.name;
        } else if (payment.paymentType == 2) {
            receipt.organizationName = parent.params.company.srganization.name + "代收款收据";
            receipt.organization = parent.params.company.srganization.name;
        }

        commonInfo["customerName"] = payment.customer.name;
        commonInfo["collectUserName"] = payment.collectUser.currentName;
        commonInfo["collectTime"] = payment.collectTime;
        commonInfo["total"] = 0.0;

        orderInfo = res.payment.orders;

        var paymentItems = [];

        if (parseFloat(payment.cash) != 0) {
            var tem = {
                "money": parseFloat(payment.cash),
                "paymentWay": "现金"
            };
            paymentItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
            commonInfo.total += parseFloat(payment.cash);
            receipt.cash = payment.cash;
        }

        if (parseFloat(payment.bank) != 0) {
            var bankParams = getBankInfo(payment.bankInfo, 0, null, receipt.receiptsNum, receipt.bankInfo, null, paymentItems);
            receipt.receiptsNum = bankParams;
            commonInfo.total += parseFloat(payment.bank);
        }

        if (parseFloat(payment.checkv) != 0) {
            var checkvParams = getBankInfo(payment.checkvBank, 1, parseFloat(payment.checkv), receipt.receiptsNum, null, receipt.checkBankInfo, paymentItems);
            receipt.receiptsNum = checkvParams;
            commonInfo.total += parseFloat(payment.checkv);
        }

        if (parseFloat(payment.transfer) != 0) {
            var tem = {
                "money": parseFloat(payment.transfer),
                "paymentWay": "预付款转换"
            };
            paymentItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
        }

        commonInfo["comment"] = payment.comment;
        receipt.receipts = paymentItems;

        var _items = [];

        com.post(queryDecorationByCustomerId, {"decoration.customer.no": res.payment.customer.no}, function(data) {

            createReceiptTable(commonInfo, receipt.receipts, data.decorations, getPaymentType(payment.paymentType));

            printer.name = "payment";
            printer.args = {
                "title": receipt.organizationName,
                "orderId": orderIds,
                "orderAddr": addrs,
                "collectTime": commonInfo["collectTime"],
                "collecter": commonInfo["collectUserName"],
                "referMoney": commonInfo["total"],
                "capitalize": utils.getCNMoney(commonInfo["total"]),
                "payments": [{
                    "paymentType": getPaymentType(payment.paymentType),
                    "money": payment.recharge
                }],
                "receipts": paymentItems
            };
        }, null, false);
    }, null, false);

    paymentUtils.initSignet(receipt.htmlName);
    paymentUtils.initQrcode(receipt.htmlName);
    paymentUtils.bindSignet($("#" + receipt.htmlName + "signets"));
    paymentUtils.showContractBtn(arid, 0, printer.args, commonInfo.customerName, receipt);

    function createReceiptTable(commonInfo, paymentInfo, orderInfo, currentPaymentType) {

        var num = paymentInfo.length;
        var bankRowspan = 1;
        var count = 0;
        if (num % receipt.onePageCount == 0) {
            count = Math.floor(num / receipt.onePageCount);
        } else {
            count = Math.floor(num / receipt.onePageCount) + 1;
        }

        for ( var i = 0; i < count; i++) {
            var start = i * receipt.onePageCount;
            var center = $("<center></center>").appendTo("#paymentReceipt");

            if (i != 0) {
                pageNext = $('<div class="PageNext"></div>');
                pageNext.appendTo(center);
            }

            var noTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
            var noTr = $('<tr></tr>').appendTo(noTable);
            var noTd = $('<td colspan="3"></td>').appendTo(noTr);
            var headReceiptDiv = $('<div style="text-align: center; background-color:#ffffff"></div>').appendTo(center);
            receipt.receiptNo = (Array(10).join(0) + arid).slice(-10);
            var spanNo = $('<span style="float: left;"></span>').html("编号:" + receipt.receiptNo).appendTo(headReceiptDiv);
            var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(receipt.organizationName).appendTo(headReceiptDiv);

            var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);

            var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var customerReceiptTd = $('<td style="width: 25%" colspan="2"></td>').text('客 户 名: ' + commonInfo["customerName"]).appendTo(presonReceiptTr);
            var timeReceiptTd = $('<td colspan="3"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(presonReceiptTr);

            for ( var k = 0; k < orderInfo.length; k++) {
                var $order = orderInfo[k];

                var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var noReceiptTd = $('<td style="width: 25%" colspan="2"></td>').text('装修单号: ' + $order.orderId).appendTo(orderReceiptTr);
                var addr = $order.house.village.cityProper.city.name + ' ' + $order.house.village.cityProper.name + ' ' + $order.house.village.name + ' ' + $order.house.houseNumber;
                var timeReceiptTd = $('<td colspan="3" style="width: 33%"></td>').text('楼盘: ' + addr).appendTo(orderReceiptTr);
                var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);

                orderIds = orderIds + $order.orderId;
                addrs = addrs + addr;

                if (k != orderInfo.length - 1) {
                    orderIds = orderIds + "/";
                    addrs = addrs + "/";
                }
            }

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeReceiptTd = $('<td style="width: 25%; text-align: center;" ></td>').html('<strong>收款类型</strong>').appendTo(receReceiptTr);
            var balanceReceiptTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
            var amountReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

            var drawpaymentWay = "";

            for (; start < (i + 1) * receipt.onePageCount && start < num; ++start) {

                var receiptItems = paymentInfo[start];

                if (receiptItems["paymentWay"] == "刷卡" || receiptItems["paymentWay"] == "银行") {
                    var bankRowspan = paymentUtils.getBankRowspan(receipt, i, start, bankRowspan);
                    var InfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var typeInfoReceiptTd = $('<td style="width: 25%; text-align: center;" rowspan="' + bankRowspan + '"></td>').text(currentPaymentType);
                    var bankInfoReceiptTd = $('<td style="width: 12%; text-align: center;" rowspan="' + bankRowspan + '"></td>').text(receiptItems.paymentWay);

                    if (drawpaymentWay != receiptItems["paymentWay"]) {
                        typeInfoReceiptTd.appendTo(InfoReceiptTr);
                        bankInfoReceiptTd.appendTo(InfoReceiptTr);
                        drawpaymentWay = receiptItems["paymentWay"];
                    }

                    var balanceInfoReceiptTd = $('<td style="width: 28%; text-align: center;"></td>').text(receiptItems["bankInfo"]).appendTo(InfoReceiptTr);
                    var amountInfoReceiptTd = $('<td style="width: 40%; text-align: center;"></td>').text(receiptItems["money"]).appendTo(InfoReceiptTr);
                } else {
                    var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var typeInfoReceiptTd = $('<td style="width: 25%; text-align: center;"></td>').text(currentPaymentType).appendTo(receInfoReceiptTr);

                    var balanceInfoReceiptTd = $('<td style="width: 40%; text-align: center;" colspan="2" ></td>').text(receiptItems["paymentWay"]).appendTo(receInfoReceiptTr);
                    var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItems["money"]).appendTo(receInfoReceiptTr);

                }
            }

            var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var renReceiptTd = $('<td colspan="3"></td>').text('人民币大写: ' + utils.getCNMoney(commonInfo["total"])).appendTo(moneyReceiptTr);
            var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + commonInfo["total"]).appendTo(moneyReceiptTr);

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

    function getBankInfo(bankInfoString, type, money, receiptsNumParams, bankInfo, checkBankInfo, receipts) {

        var receiptsNum = receiptsNumParams;

        if (bankInfoString.indexOf("#") != -1) {
            var stringSrray = bankInfoString.split('#');

            for ( var i = 1; i < stringSrray.length - 1; i++) {
                var bankinfo = {};
                if (stringSrray[i].length != 0) {
                    var _i = stringSrray[i].split('|');

                    if (type == 0) {
                        bankinfo = {
                            "money": parseFloat(_i[1]),
                            "bankInfo": bankInfo[_i[0]],
                            "paymentWay": "刷卡",
                            "bankInfoNum": stringSrray.length - 2
                        };
                        receipt.checkBankInfoNum = stringSrray.length - 2;
                    } else if (type == 1) {
                        bankinfo = {
                            "money": parseFloat(_i[1]),
                            "bankInfo": checkBankInfo[_i[0]],
                            "paymentWay": "银行",
                            "bankInfoNum": stringSrray.length - 2
                        };
                    }
                    receiptsNum = receiptsNum + 1;
                    receipts.push(bankinfo);
                }
            }
        } else {
            if (bankInfoString != "" && type == 1) {
                var bankinfo = {
                    "money": parseFloat(money),
                    "bankInfo": checkBankInfo[bankInfoString],
                    "paymentWay": "银行"
                };
                receiptsNum = receiptsNumParams + 1;
                receipts.push(bankinfo);
            }
        }

        return receiptsNum;

    }
});
