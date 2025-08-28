jQuery(function($) {

    var receipt = {
        htmlName: "oales",
        paymentTypeData: parent.constant.payment().oalesPayment.type.keys,
        decorationTypeData: parent.constant.decoration().decoration.typeness.datas,
        commonInfo: {},
        paymentItems: [],
        receiptItems: [],
        bankInfo: {},
        checkBankInfo: {},
        receiptsNum: 0,
        receiptNo: "",
        organization: "",
        url: parent.api.index.oalesPaymentReceiptIndex.url
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
    
    var receiptTitle = null;

    com.post(api.payment.queryOalesPaymentForNotInitByOrid, {"oalesReceipt.orid": params.payment.orId}, function(res) {

        var oalesPayments = res.oalesPayments;
        var commonInfo = {};
        var paymentItems = [];
        var oalesBrand = "";
        var oalesPaymentDes = "";

        for ( var i = 0; i < oalesPayments.length; i++) {

            var oalesPayment = oalesPayments[i];

            if(oalesPayment.oales.grade == "A") receiptTitle = "装修材料明细单";

            oalesBrand = oalesPayment.oales.brand;

            commonInfo["orderId"] = oalesPayment.orderId;
            commonInfo["no"] = oalesPayment.oales.no;
            commonInfo["orderAddr"] = oalesPayment.oales.decoration.house.village.cityProper.city.name + ' ' + oalesPayment.oales.decoration.house.village.cityProper.name + ' ' + oalesPayment.oales.decoration.house.village.name + " " + oalesPayment.oales.decoration.house.houseNumber;
            commonInfo["customerName"] = oalesPayment.oales.decoration.customer.name;
            commonInfo["departmentName"] = oalesPayment.oales.dept.name;

            commonInfo["collectUserName"] = oalesPayment.oalesReceipt.collecterName;
            commonInfo["collectTime"] = oalesPayment.oalesReceipt.collectTime;

            receipt.paymentItems.push({
                "paymentType": receipt.paymentTypeData[oalesPayment.type],
                "money": oalesPayment.referMoney,
                "oalesBrand": oalesBrand
            });

            commonInfo["total"] = 0.0;
        }

        if (oalesPayment.oalesReceipt.comment && oalesPayment.oalesReceipt.comment != "") {
            oalesPaymentDes = oalesPayment.oalesReceipt.comment
        }

        commonInfo["oalesPaymentDes"] = oalesPaymentDes;

        receipt.commonInfo = commonInfo;

    }, null, false);

    var queryoalesReceiptByOrId = api.payment.queryOalesReceiptByOrId;
    com.post(queryoalesReceiptByOrId, {"oalesReceipt.orid": params.payment.orId}, function(res) {

        var oalesReceipt = res.oalesReceipt;

        receipt.oalesReceipt = res.oalesReceipt;

        if (parseFloat(oalesReceipt.cash) != 0) {
            var tem = {
                "money": parseFloat(oalesReceipt.cash),
                "paymentWay": "现金"
            };
            receipt.receiptItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;

            receipt.commonInfo.total += parseFloat(oalesReceipt.cash);
        }

        if (parseFloat(oalesReceipt.bank) != 0) {
            var tem = {
                "money": parseFloat(oalesReceipt.bank),
                "paymentWay": "刷卡"
            };
            receipt.receiptItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;

            receipt.commonInfo.total += parseFloat(oalesReceipt.bank);
        }

        if (parseFloat(oalesReceipt.checkv) != 0) {
            var tem = {
                "money": parseFloat(oalesReceipt.checkv),
                "paymentWay": "银行"
            };
            receipt.receiptItems.push(tem);
            receipt.receiptsNum = receipt.receiptsNum + 1;

            receipt.commonInfo.total += parseFloat(oalesReceipt.checkv);
        }

    }, null, false);

    com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId": receipt.commonInfo.orderId}, function(res) {

        receipt.commonInfo.decorationType = res.decoration.typeness;

        com.post(api.system.queryCompanyByCid, {
            "company.cid": res.decoration.bompany
        }, function(data) {

            receipt.organization = data.company.srganization.name;
        }, null, false);

    }, null, false);

    if (receipt.paymentItems.length > 0) {
        createReceiptTable();

        printer.name = "oalesPayment";
        printer.args = {
            "title": receiptTitle ? receiptTitle : (receipt.organization + "代收款收据"),
            "orderId": receipt.commonInfo.orderId,
            "decorationType": receipt.commonInfo.decorationType,
            "orderAddr": receipt.commonInfo.orderAddr,
            "collectTime": receipt.commonInfo.collectTime,
            "referMoney": utils.changeThrDecimal(receipt.commonInfo.total),
            "capitalize": utils.getCNMoney(utils.changeThrDecimal(receipt.commonInfo.total)),
            "payments": receipt.paymentItems,
            "receipts": receipt.receiptItems,
            "collecter": receipt.oalesReceipt.collecter.currentName
        };
    }

    paymentUtils.initSignet(receipt.htmlName);
    paymentUtils.initQrcode(receipt.htmlName, receipt.htmlName+"paymentContractQrcodeModal");
    paymentUtils.bindSignet($("#" + receipt.htmlName + "signets"));
    paymentUtils.showContractBtn(params.payment.orId, 65, printer.args, receipt.commonInfo.customerName, receipt);

    function createReceiptTable() {

        var commonInfo = receipt.commonInfo;
        var paymentItems = receipt.paymentItems;
        var receiptItems = receipt.receiptItems;

        var center = $("<center></center>").appendTo("#oalesPaymentReceipt");

        var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0">').appendTo(center);
        var headReceiptTr = $('<tr style="border:1px solid #fff; background:white; border-bottom-color:#000;"></tr>').appendTo(receiptTable);
        var headReceiptTd = $('<td colspan="5"></td>').appendTo(headReceiptTr);
        var headReceiptDiv = $('<div style="text-align: center;"></div>').appendTo(headReceiptTd);
        receipt.receiptNo = (Array(10).join(0) + params.payment.orId).slice(-10);
        var spanNo = $('<span style="float: left;"></span>').html("编号:" + receipt.receiptNo).appendTo(headReceiptDiv);
        var headReceiptH2 = $('<h2 style="margin: 1px"></h2>').text(receiptTitle ? receiptTitle : (receipt.organization + "代收款收据")).appendTo(headReceiptDiv);

        var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var noReceiptTd = $('<td style="width: 15%"></td>').text('装修单号: ' + commonInfo["orderId"]).appendTo(orderReceiptTr);
        var noReceiptTd = $('<td style="width: 10%"></td>').text('装修单类型: ' + receipt.decorationTypeData[commonInfo["decorationType"]].value).appendTo(orderReceiptTr);
        var addrReceiptTd = $('<td style="width: 40%" colspan="2"></td>').text('客户地址: ' + commonInfo["orderAddr"]).appendTo(orderReceiptTr);
        var timeReceiptTd = $('<td style="width: 35%" colspan="2"></td>').text('收款日期: ' + commonInfo["collectTime"]).appendTo(orderReceiptTr);

        var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);

        var balancePaymentTd = $('<td style="width: 10%; text-align: center;" rowspan=' + (paymentItems.length + 1) + '></td>').html('<strong>收款信息</strong>').appendTo(recePaymentTr);
        var typePaymentTd = $('<td style="width: 15%; text-align: center;"></td>').html('<strong>品牌</strong>').appendTo(recePaymentTr);
        var typePaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
        var amountPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

        for ( var j = 0; j < paymentItems.length; j++) {
            var paymentItem = paymentItems[j];

            var receInfoPaymentTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 15%; text-align: center;"></td>').text(paymentItem["oalesBrand"]).appendTo(receInfoPaymentTr);
            var typeInfoPaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').text(paymentItem["paymentType"]).appendTo(receInfoPaymentTr);
            var amountInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(paymentItem["money"]).appendTo(receInfoPaymentTr);
        }

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);

        var balanceReceiptTd = $('<td style="width: 25%; text-align: center;" rowspan=' + (receipt.receiptsNum + 1) + ' colspan=2></td>').html('<strong>收据信息</strong>').appendTo(receReceiptTr);
        var typeReceiptTd = $('<td style="width: 40%; text-align: center;"  colspan=2></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
        var amountReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

        var drawpaymentWay = "";

        for ( var i = 0; i < receiptItems.length; i++) {
            var receiptItem = receiptItems[i];

            var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 40%; text-align: center;" colspan="2"></td>').text(receiptItem["paymentWay"]).appendTo(receInfoReceiptTr);
            var amountInfoPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').text(receiptItem["money"]).appendTo(receInfoReceiptTr);

        }

        var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var renReceiptTd = $('<td colspan="4"></td>').text('人民币大写: ' + utils.getCNMoney(receipt.commonInfo.total)).appendTo(moneyReceiptTr);
        var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + receipt.commonInfo.total).appendTo(moneyReceiptTr);

        var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var summaryReceiptTd = $('<td colspan="5"></td>').appendTo(summaryReceiptTr);
        var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
        var receReceiptSpan = $('<span></span>').text('收款人:' + receipt.oalesReceipt.collecter.currentName).appendTo(summaryReceiptDiv);
        var cashierReceiptSpan = $('<span></span>').text('    交款人:').appendTo(summaryReceiptDiv);
    }
});
