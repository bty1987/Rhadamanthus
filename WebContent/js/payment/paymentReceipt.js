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

    com.post(api.data.queryReceiptType, {}, function(res) {

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == parent.constant.data().receiptType.TYPE_CARD_INT) {
                receipt.bankInfo[v.no] = v.name;
            } else if (v.type == parent.constant.data().receiptType.TYPE_BANK_INT) {
                receipt.checkBankInfo[v.no] = v.name;
            }
        });
    }, null, false);

    params = parent.params;

    var queryPaymentByPaymentId = api.payment.queryPaymentByPaymentId;
    var queryDecorationForCommonByOrderId = api.decoration.queryDecorationForCommonByOrderId;

    var orderInfo = null;
    var commonInfo = {};
    var orderId = params.payment.orderId;
    var addr = "";
    var arid = "";

    com.post(queryPaymentByPaymentId, {"payment.pid": params.payment.pid}, function(res) {

        var payment = res.payment;
        arid = payment.arId;
        var decorationCommon = null;
        var drganization = null;
        var srganization = null;

        if (!payment.pid) {
            return;
        }

        com.post(queryDecorationForCommonByOrderId, {"decoration.orderId": orderId}, function(data) {
            decorationCommon = data.decoration;

            com.post(api.system.queryCompanyByCid, {
                "company.cid": params.payment.profit == null ? res.decoration.dompany : res.decoration.bompany
            }, function(data) {

                drganization = data.company.drganization;
                srganization = data.company.srganization;
            }, null, false);

        }, null, false);

        if (payment.paymentType == parent.constant.payment().advancePayment.PAYMENTTYPE_BALANCE_INT) {
            receipt.organizationName = drganization.name + "收款收据";
            receipt.organization = drganization.name;
        } else if (payment.paymentType == parent.constant.payment().advancePayment.PAYMENTTYPE_MATERIAL_INT) {
            receipt.organizationName = srganization.name + "代收款收据";
            receipt.organization = srganization.name;
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
            var tem = {
                "money": parseFloat(payment.bank),
                "paymentWay": "刷卡"
            };

            paymentItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
            commonInfo.total += parseFloat(payment.bank);
        }

        if (parseFloat(payment.checkv) != 0) {
            var tem = {
                "money": parseFloat(payment.checkv),
                "paymentWay": "银行"
            };

            paymentItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
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

        createReceiptTable(commonInfo, receipt.receipts, decorationCommon, getPaymentType(payment.paymentType));

        printer.name = "payment";
        printer.args = {
            "title": receipt.organizationName,
            "orderId": orderId,
            "orderAddr": addr,
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

    paymentUtils.initSignet(receipt.htmlName);
    paymentUtils.initQrcode(receipt.htmlName, receipt.htmlName+"paymentContractQrcodeModal");
    paymentUtils.bindSignet($("#" + receipt.htmlName + "signets"));
    paymentUtils.showContractBtn(arid, 0, printer.args, commonInfo.customerName, receipt);

    function createReceiptTable(commonInfo, paymentInfo, decoration, currentPaymentType) {

        var num = paymentInfo.length;
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

            var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var noReceiptTd = $('<td style="width: 25%" colspan="2"></td>').text('装修单号: ' + decoration.orderId).appendTo(orderReceiptTr);
            addr = decoration.house.village.cityProper.city.name + ' ' + decoration.house.village.cityProper.name + ' ' + decoration.house.village.name + ' ' + decoration.house.houseNumber;
            var timeReceiptTd = $('<td colspan="3" style="width: 33%"></td>').text('楼盘: ' + addr).appendTo(orderReceiptTr);

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeReceiptTd = $('<td style="width: 25%; text-align: center;" ></td>').html('<strong>收款类型</strong>').appendTo(receReceiptTr);
            var balanceReceiptTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
            var amountReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

            var drawpaymentWay = "";

            for (; start < (i + 1) * receipt.onePageCount && start < num; ++start) {

                var receiptItems = paymentInfo[start];

                var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var typeInfoReceiptTd = $('<td style="width: 25%; text-align: center;"></td>').text(currentPaymentType).appendTo(receInfoReceiptTr);

                var balanceInfoReceiptTd = $('<td style="width: 40%; text-align: center;" colspan="2" ></td>').text(receiptItems["paymentWay"]).appendTo(receInfoReceiptTr);
                var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItems["money"]).appendTo(receInfoReceiptTr);

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
            case parent.constant.payment().advancePayment.PAYMENTTYPE_BALANCE_INT:
                newPaymentType = "合同预付款";
                break;
            case parent.constant.payment().advancePayment.PAYMENTTYPE_MATERIAL_INT:
                newPaymentType = "主材预付款";
                break;
        }

        return newPaymentType;
    }
});
