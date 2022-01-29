jQuery(function ($) {
    var receipt = {
        onePageCount: 5,
        payments: [],
        receipts: [],
        order: null,
        bankInfo: {},
        checkBankInfo: {},
        receiptsNum: 0,
        total: 0.0,
        cash: 0,
        checkBankInfoNum: 0
    };

    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    printer = parent.printer;

    params = parent.params;

    $("#servicePdfBtn").click(function(){
        var target = $("#servicePaymentReceipt")[0]; //避免生成的PDF页面底部出现黑色背景
        paymentUtils.makeContract(target, params.serviceReceiptSrId, receipt.order.orderId, 4);
    });

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
                "money": parseFloat(serviceReceipt.cash),
                "paymentWay": "现金"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
            receipt.total += parseFloat(serviceReceipt.cash);
            receipt.cash = serviceReceipt.cash;
        }

        if (parseFloat(serviceReceipt.bank) != 0) {
            var bankParams = getBankInfo(serviceReceipt.bankInfo, 0, null, receipt.receiptsNum, receipt.bankInfo, null, receipt.receipts);
            receipt.receiptsNum = bankParams;
            receipt.total += parseFloat(serviceReceipt.bank);
        }

        if (parseFloat(serviceReceipt.checkv) != 0) {
            var checkvParams = getBankInfo(serviceReceipt.checkvBank, 1, parseFloat(serviceReceipt.checkv), receipt.receiptsNum, null, receipt.checkBankInfo, receipt.receipts);
            receipt.receiptsNum = checkvParams;
            receipt.total += parseFloat(serviceReceipt.checkv);
        }

        if (serviceReceipt.des && serviceReceipt.des != "") {
            serviceReceiptDes += serviceReceipt.des + " ";
        }

        receipt.order.serviceReceiptDes = serviceReceiptDes;
        receipt.serviceReceipt = res.serviceReceipt;
    }, null, false);

    if (receipt.payments.length != 0 && receipt.receipts.length != 0) {
        generateOneReceipt();

        printer.name = "payment";
        printer.args = {
            "title": params.company.drganization.name +"收款收据",
            "orderId": receipt.order.orderId,
            "orderAddr": receipt.order.house.village.cityProper.city.name + ' ' + receipt.order.house.village.cityProper.name + ' ' + receipt.order.house.village.name + receipt.order.house.houseNumber,
            "collectTime": receipt.serviceReceipt.collectTime,
            "collecter": receipt.serviceReceipt.collecter.currentName,
            "referMoney": receipt.total,
            "capitalize": utils.getCNMoney(receipt.total),
            "payments": [{"paymentType": "预付款", "money": receipt.payments[0].advanceMoney}, {"paymentType": "服务费", "money": receipt.payments[0].serviceMoney}],
            "receipts": receipt.receipts
        };
    }

    function generateOneReceipt() {
        var num = receipt.receipts.length;
        var count = 0;
        var bankRowspan = 1;
        var receiptRowspan = 1;

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
            var headReceiptDiv = $('<div style="text-align: center; background-color:#ffffff"></div>').appendTo(center);
            var no = (Array(10).join(0)+params.serviceReceiptSrId).slice(-10);
            var spanNo = $('<span style="float: left;"></span>').html("编号:"+no).appendTo(headReceiptDiv);
            var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(parent.params.company.drganization.name + "收款收据").appendTo(headReceiptDiv);

            var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);

            var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var noReceiptTd = $('<td style="width: 25%"></td>').text('装修单号: ' + receipt.order.orderId).appendTo(orderReceiptTr);
            var addrReceiptTd = $('<td style="width: 40%" colspan="2"></td>').text('客户地址: ' + receipt.order.house.village.cityProper.city.name + ' ' + receipt.order.house.village.cityProper.name + ' ' + receipt.order.house.village.name + receipt.order.house.houseNumber).appendTo(orderReceiptTr);
            var customerReceiptTd = $('<td style="width: 35%" colspan="2"></td>').html('收款日期: ' + receipt.serviceReceipt.collectTime).appendTo(orderReceiptTr);

            var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 25%; text-align: center;" rowspan="4"></td>').html("<strong>收款信息</strong>").appendTo(recePaymentTr);
            var balancePaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
            var amountPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

            var receReceiptTrAdvanceMoney = $('<tr></tr>').appendTo(receiptTable);
            var advanceMoneyText = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('预付款').appendTo(receReceiptTrAdvanceMoney);
            var advanecMoney = $('<td style="width: 35%; text-align: center;"></td>').html(receipt.payments[0].advanceMoney).appendTo(receReceiptTrAdvanceMoney);

            var receReceiptTrServiceMoney = $('<tr></tr>').appendTo(receiptTable);
            var serviceMoneyText = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('服务费').appendTo(receReceiptTrServiceMoney);
            var serviceMoney = $('<td style="width: 35%; text-align: center;"></td>').html(receipt.payments[0].serviceMoney).appendTo(receReceiptTrServiceMoney);

            for (var j = 0; j < receipt.payments.length; j++) {
                var paymentInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var paymentTypeReceiptTd = $('<td style="width: 12%; text-align: center;" colspan="2"></td>').text(receipt.payments[j].paymentType).appendTo(paymentInfoReceiptTr);
                var paymentMoneyReceiptTd = $('<td style="width: 28%; text-align: center;"></td>').text(receipt.payments[j].referMoney).appendTo(paymentInfoReceiptTr);
            }

            var receiptRowspan = paymentUtils.getReceiptRowspan(receipt, i, receiptRowspan);

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoReceiptTd = $('<td style="width: 25%; text-align: center;" rowspan="' + (utils.accAdd(receiptRowspan, 1)) + '"></td>').html("<strong>收据信息</strong>").appendTo(receReceiptTr);
            var balanceReceiptTd = $('<td style="width: 40%; text-align: center;" colspan=2></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
            var amountReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

            var drawpaymentWay = "";
            for (; start < (i + 1) * receipt.onePageCount && start < num; ++start) {
                if (receipt.receipts[start].paymentWay == "刷卡" || receipt.receipts[start].paymentWay == "银行") {
                    var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var newRowspan = paymentUtils.getBankRowspan(receipt, i, start, bankRowspan);
                    var bankInfoReceiptTd = $('<td style="width: 12%; text-align: center;" rowspan="' + newRowspan + '"></td>').text(receipt.receipts[start].paymentWay);

                    if(drawpaymentWay != receipt.receipts[start].paymentWay){
                        bankInfoReceiptTd.appendTo(receInfoReceiptTr);
                        drawpaymentWay =receipt.receipts[start].paymentWay;
                    }

                    var balanceInfoReceiptTd = $('<td style="width: 28%; text-align: center;"></td>').text(receipt.receipts[start].bankInfo).appendTo(receInfoReceiptTr);
                    var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.receipts[start].money).appendTo(receInfoReceiptTr);
                } else {
                    var commonInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var balanceInfoReceiptTd = $('<td style="width: 40%; text-align: center;"  colspan=2></td>').text(receipt.receipts[start].paymentWay).appendTo(commonInfoReceiptTr);
                    var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.receipts[start].money).appendTo(commonInfoReceiptTr);
                }

            }

            var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var renReceiptTd = $('<td colspan="3"></td>').text('人民币大写: ' + utils.getCNMoney(receipt.total)).appendTo(moneyReceiptTr);
            var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + receipt.total).appendTo(moneyReceiptTr);

            var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var summaryReceiptTd = $('<td colspan="5"></td>').appendTo(summaryReceiptTr);
            var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
            var receReceiptSpan = $('<span></span>').text('收款人: ' + receipt.serviceReceipt.collecter.currentName + "  ").appendTo(summaryReceiptDiv);
            var cashierReceiptSpan = $('<span></span>').text(' 交款人: ').appendTo(summaryReceiptDiv);
        }
    }

    function getBankInfo(bankInfoString, type, money, receiptsNumParams, bankInfo, checkBankInfo, receipts) {
        var receiptsNum = receiptsNumParams;

        if(bankInfoString.indexOf("#") != -1){
            var stringSrray = bankInfoString.split('#');

            for (var i = 1; i < stringSrray.length - 1; i++) {
                var bankinfo = {};
                if (stringSrray[i].length != 0) {
                    var _i = stringSrray[i].split('|');

                    if (type == 0) {
                        bankinfo = {
                            "money": parseFloat(_i[1]),
                            "bankInfo": bankInfo[_i[0]],
                            "paymentWay": "刷卡",
                            "bankInfoNum": stringSrray.length-2
                        };
                        receipt.checkBankInfoNum = stringSrray.length-2;
                    } else if (type == 1) {
                        bankinfo = {
                            "money": parseFloat(_i[1]),
                            "bankInfo": checkBankInfo[_i[0]],
                            "paymentWay": "银行",
                            "bankInfoNum": stringSrray.length-2
                        };
                    }
                    receiptsNum = receiptsNum + 1;
                    receipts.push(bankinfo);
                }
            }
        }else{
            if(bankInfoString != "" && type == 1){
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

