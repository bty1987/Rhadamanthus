jQuery(function($) {

    var receipt = {
        htmlName: "",
        onePageCount: 5,
        payments: [],
        receipts: [],
        order: null,
        bankInfo: {},
        checkBankInfo: {},
        receiptsNum: 0,
        total: 0.0,
        cash: 0,
        checkBankInfoNum: 0,
        receiptNo: "",
        organization: "",
        url: parent.api.index.decorationPaymentReceiptIndex.url
    };

    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    printer = parent.printer;

    params = parent.params;

    com.post(api.data.queryReceiptType, {}, function(res) {

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == parent.constant.data().receiptType.TYPE_CARD_INT) {
                receipt.bankInfo[v.no] = v.name;
            } else if (v.type == parent.constant.data().receiptType.TYPE_BANK_INT) {
                receipt.checkBankInfo[v.no] = v.name;
            }
        });
    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": params.payment.orderId}, function(res) {
        receipt.order = res.decoration;

        com.post(api.system.queryCompanyByCid, {
            "company.cid": res.decoration.bompany
        }, function(data) {

            receipt.organization = data.company.drganization.name;
        }, null, false);

    }, null, false);

    com.post(api.payment.queryDecorationPaymentForNotInitByDrId, {"decorationReceipt.drId": params.payment.drId}, function(res) {
        var payments = res.decorationPayments;

        for ( var i = 0; i < payments.length; i++) {
            var payment = payments[i];

            receipt.payments.push({
                "paymentType": payment.paymentType,
                "money": payment.referMoney
            });
        }
    }, null, false);

    com.post(api.payment.queryDecoraionReceiptByDrId, {"decorationReceipt.drId": params.payment.drId}, function(res) {

        var decorationReceiptDes = "";

        var decorationReceipt = res.decorationReceipt;

        if (parseFloat(decorationReceipt.cash) != 0) {
            var tem = {
                "money": parseFloat(decorationReceipt.cash),
                "paymentWay": "现金"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
            receipt.total += parseFloat(decorationReceipt.cash);
            receipt.cash = decorationReceipt.cash;
        }
        if (parseFloat(decorationReceipt.bank) != 0) {
            var tem = {
                "money": parseFloat(decorationReceipt.bank),
                "paymentWay": "刷卡"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
            receipt.total += parseFloat(decorationReceipt.bank);
        }
        if (parseFloat(decorationReceipt.checkv) != 0) {
            var tem = {
                "money": parseFloat(decorationReceipt.checkv),
                "paymentWay": "银行"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;
            receipt.total += parseFloat(decorationReceipt.checkv);
        }
        if (parseFloat(decorationReceipt.coupon) != 0) {
            var tem = {
                "money": parseFloat(decorationReceipt.coupon),
                "paymentWay": "优惠券"
            };
            receipt.receiptsNum = receipt.receiptsNum + 1;
            receipt.receipts.push(tem);
        }
        if (parseFloat(decorationReceipt.advance) != 0) {
            var tem = {
                "money": parseFloat(decorationReceipt.advance),
                "paymentWay": "预付款"
            };
            receipt.receiptsNum = receipt.receiptsNum + 1;
            receipt.receipts.push(tem);
        }

        if (decorationReceipt.comment && decorationReceipt.comment != "") {
            decorationReceiptDes += decorationReceipt.comment + " ";
        }

        receipt.order.decorationReceiptDes = decorationReceiptDes;
        receipt.decorationReceipt = res.decorationReceipt;
    }, null, false);

    if (receipt.payments.length != 0 && receipt.receipts.length != 0) {
        generateOneReceipt();

        printer.name = "payment";
        printer.args = {
            "title": receipt.organization + "收款收据",
            "orderId": receipt.order.orderId,
            "orderAddr": receipt.order.house.village.cityProper.city.name + ' ' + receipt.order.house.village.cityProper.name + ' ' + receipt.order.house.village.name + receipt.order.house.houseNumber,
            "collectTime": receipt.decorationReceipt.collectTime,
            "collecter": receipt.decorationReceipt.collecter.currentName,
            "referMoney": receipt.total,
            "capitalize": utils.getCNMoney(receipt.total),
            "payments": receipt.payments,
            "receipts": receipt.receipts
        };
    }

    paymentUtils.initSignet(receipt.htmlName);
    paymentUtils.initQrcode(receipt.htmlName, receipt.htmlName+"paymentContractQrcodeModal");
    paymentUtils.bindSignet($("#" + receipt.htmlName + "signets"));
    paymentUtils.showContractBtn(params.payment.drId, 1, printer.args, receipt.order.customer.name, receipt);

    function generateOneReceipt() {

        var num = receipt.receipts.length;
        var receiptRowspan = 1;
        var count = 0;
        if (num % receipt.onePageCount == 0) {
            count = Math.floor(num / receipt.onePageCount);
        } else {
            count = Math.floor(num / receipt.onePageCount) + 1;
        }

        var decorationPaymentReceipt = $("#decorationPaymentReceipt");

        for ( var i = 0; i < count; ++i) {
            var start = i * receipt.onePageCount;
            var supervisor = "";

            if (i != 0) {
                var pageNext = $("<div></div>").addClass("PageNext").appendTo(decorationPaymentReceipt);
            }

            if (receipt.order.supervisor != null) {
                supervisor = receipt.order.supervisor;
            }

            var center = $("<center></center>").appendTo(decorationPaymentReceipt);
            var headReceiptDiv = $('<div style="text-align: center; background-color:#ffffff"></div>').appendTo(center);
            receipt.receiptNo = (Array(10).join(0) + params.payment.drId).slice(-10);
            var spanNo = $('<span style="float: left;"></span>').html("编号:" + receipt.receiptNo).appendTo(headReceiptDiv);
            var headReceiptH2 = $('<h3 class="col-md-12" style="font-weight: bold;"></h3>').text(receipt.organization + "收款收据").appendTo(headReceiptDiv);

            var receiptTable = $('<table border="1" style="width: 100%; height: 200px; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);

            var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var noReceiptTd = $('<td style="width: 25%"></td>').text('装修单号: ' + receipt.order.orderId).appendTo(orderReceiptTr);
            var addrReceiptTd = $('<td style="width: 40%" colspan="2"></td>').text('客户地址: ' + receipt.order.house.village.cityProper.city.name + ' ' + receipt.order.house.village.cityProper.name + ' ' + receipt.order.house.village.name + receipt.order.house.houseNumber).appendTo(orderReceiptTr);
            var timeReceiptTd = $('<td style="width: 35%" colspan="2"></td>').html('收款日期: ' + receipt.decorationReceipt.collectTime).appendTo(orderReceiptTr);

            var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 25%; text-align: center;" rowspan="' + (receipt.payments.length + 1) + '" ></td>').html("<strong>收款信息</strong>").appendTo(recePaymentTr);
            var balancePaymentTd = $('<td style="width: 40%; text-align: center;" colspan=2></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
            var amountPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

            for ( var j = 0; j < receipt.payments.length; j++) {
                var paymentInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var paymentTypeReceiptTd = $('<td style="width: 30%; text-align: center;" colspan=2></td>').text(receipt.payments[j].paymentType).appendTo(paymentInfoReceiptTr);
                var paymentMoneyReceiptTd = $('<td style="width: 35%; text-align: center;" ></td>').text(receipt.payments[j].money).appendTo(paymentInfoReceiptTr);
            }

            var receiptRowspan = paymentUtils.getReceiptRowspan(receipt, i, receiptRowspan);

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoReceiptTd = $('<td style="width: 25%; text-align: center;" rowspan="' + (utils.accAdd(receiptRowspan, 1)) + '"</td>').html("<strong>收据信息</strong>").appendTo(receReceiptTr);
            var balanceReceiptTd = $('<td style="width: 40%; text-align: center;" colspan=2></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
            var amountReceiptTd = $('<td style="width: 35%; text-align: center;" ></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

            var drawpaymentWay = "";

            for (; start < (i + 1) * receipt.onePageCount && start < num; ++start) {
                var commonInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var balanceInfoReceiptTd = $('<td style="width: 40%; text-align: center;"  colspan=2></td>').text(receipt.receipts[start].paymentWay).appendTo(commonInfoReceiptTr);
                var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.receipts[start].money).appendTo(commonInfoReceiptTr);
            }
            var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var renReceiptTd = $('<td colspan="3"></td>').text('人民币大写: ' + utils.getCNMoney(receipt.total)).appendTo(moneyReceiptTr);
            var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + receipt.total).appendTo(moneyReceiptTr);

            var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var summaryReceiptTd = $('<td colspan="5"></td>').appendTo(summaryReceiptTr);
            var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
            var receReceiptSpan = $('<span></span>').text('收款人: ' + receipt.decorationReceipt.collecter.currentName + "  ").appendTo(summaryReceiptDiv);
            var cashierReceiptSpan = $('<span></span>').text(' 交款人: ').appendTo(summaryReceiptDiv);
        }
    }
});
