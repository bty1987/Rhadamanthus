jQuery(function ($) {
    var params = {};
    var receipt = {
        onePageCount: 5,
        payments: [],
        receipts: [],
        order: null,
        bankInfo: {},
        checkBankInfo: {},
        receiptsNum:0
    };

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
    com.post(queryDecorationForCommonByOrderId, {"decoration.orderId": params.decorationOrderOrderId}, function (res) {
        receipt.order = res.decoration;
        //装修单信息
    }, null, false);

    var queryDecorationPaymentForNotInitByDrId = api.payment.queryDecorationPaymentForNotInitByDrId;

    com.post(queryDecorationPaymentForNotInitByDrId, {"decorationReceipt.drId": params.decorationReceiptDrId}, function (res) {
        var payments = res.decorationPayments;

        for (var i = 0; i < payments.length; i++) {
            var payment = payments[i];

            receipt.payments.push({"paymentType": payment.paymentType, "referMoney": payment.referMoney});
        }

    }, null, false);

    var queryDecoraionReceiptByDrId = api.payment.queryDecoraionReceiptByDrId;

    com.post(queryDecoraionReceiptByDrId, {"decorationReceipt.drId": params.decorationReceiptDrId}, function (res) {

        var decorationReceiptDes = "";

        var decorationReceipt = res.decorationReceipt;

        if (parseFloat(decorationReceipt.cash) != 0) {
            var tem = {
                "paymentId": decorationReceipt.drId,
                "collectTime": decorationReceipt.collectTime,
                "collectUser": decorationReceipt.collectUserName,
                "paymentType": decorationReceipt.paymentType,
                "money": parseFloat(decorationReceipt.cash),
                "paymentWay": "现金"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum  =  receipt.receiptsNum + 1;
        }
        if (parseFloat(decorationReceipt.bank) != 0) {
            var bankParams = getBankInfo(decorationReceipt.bankInfo, 0, null, receipt.receiptsNum, receipt.bankInfo, null);
            var tem = {
                "paymentId": decorationReceipt.drId,
                "collectTime": decorationReceipt.collectTime,
                "collectUser": decorationReceipt.collectUserName,
                "paymentType": decorationReceipt.paymentType,
                "money": parseFloat(decorationReceipt.bank),
                "bankInfo": bankParams[0],
                "paymentWay": "刷卡"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum  =  bankParams[1] + 1;
        }
        if (parseFloat(decorationReceipt.checkv) != 0) {
            var checkvParams = getBankInfo(decorationReceipt.checkvBank, 1, parseFloat(decorationReceipt.checkv), receipt.receiptsNum, null, receipt.checkBankInfo);
            var tem = {
                "paymentId": decorationReceipt.drId,
                "collectTime": decorationReceipt.collectTime,
                "collectUser": decorationReceipt.collectUserName,
                "paymentType": decorationReceipt.paymentType,
                "money": parseFloat(decorationReceipt.checkv),
                "bankInfo": checkvParams[0],
                "paymentWay": "转账"
            };
            receipt.receipts.push(tem);
            receipt.receiptsNum  =  checkvParams[1] +1;
        }
        if (parseFloat(decorationReceipt.coupon) != 0) {
            var tem = {
                "paymentId": decorationReceipt.drId,
                "collectTime": decorationReceipt.collectTime,
                "collectUser": decorationReceipt.collectUserName,
                "paymentType": decorationReceipt.paymentType,
                "money": parseFloat(decorationReceipt.coupon),
                "paymentWay": "优惠券"
            };
            receipt.receiptsNum  =  receipt.receiptsNum +1;
            receipt.receipts.push(tem);
        }
        if (parseFloat(decorationReceipt.advance) != 0) {
            var tem = {
                "paymentId": decorationReceipt.drId,
                "collectTime": decorationReceipt.collectTime,
                "collectUser": decorationReceipt.collectUserName,
                "paymentType": decorationReceipt.paymentType,
                "money": parseFloat(decorationReceipt.advance),
                "paymentWay": "预付款"
            };
            receipt.receiptsNum  =  receipt.receiptsNum +1;
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
    }

    function generateOneReceipt() {
        var num = receipt.receipts.length;
        var count = 0;
        if (num % receipt.onePageCount == 0) {
            count = Math.floor(num / receipt.onePageCount);
        } else {
            count = Math.floor(num / receipt.onePageCount) + 1;
        }

        var decorationPaymentReceipt = $("#decorationPaymentReceipt");

        for (var i = 0; i < count; ++i) {
            var start = i * receipt.onePageCount;
            var first = receipt.receipts[start];
            var No = utils.padLeft(first.paymentId, 11);
            var supervisor = "";

            if (i != 0) {
                var pageNext = $("<div></div>").addClass("PageNext").appendTo(decorationPaymentReceipt);
            }

            if (receipt.order.supervisor != null) {
                supervisor = receipt.order.supervisor;
            }

            var center = $("<center></center>").appendTo(decorationPaymentReceipt);
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
            var bankReceiptTd = $('<td style="width: 35%"></td>').text('').appendTo(orderReceiptTr);

            var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var addrReceiptTd = $('<td colspan="2"></td>').text('客户地址: ' + receipt.order.house.village.name + receipt.order.house.houseNumber).appendTo(presonReceiptTr);
            var supervisorNameTd = $('<td style="width: 30%"  colspan=2></td>').text('收款日期: ' + first.collectTime).appendTo(presonReceiptTr);
            var designerReceiptTd = $('<td style="width: 35%"></td>').text('监 理: ' + (supervisor.currentName == null ? "-" : supervisor.currentName)).appendTo(presonReceiptTr);

            var sumMoney = 0;

            var recePaymentTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoPaymentTd = $('<td style="width: 35%; text-align: center;" rowspan="' + (receipt.payments.length + 1) + '" colspan=2></td>').html("<strong>收款信息</strong>").appendTo(recePaymentTr);
            var balancePaymentTd = $('<td style="width: 30%; text-align: center;" colspan=2></td>').html('<strong>收款类型</strong>').appendTo(recePaymentTr);
            var amountPaymentTd = $('<td style="width: 35%; text-align: center;"></td>').html('<strong>收款金额(元)</strong>').appendTo(recePaymentTr);

            for (var i = 0; i < receipt.payments.length; i++) {
                var paymentInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                var paymentTypeReceiptTd = $('<td style="width: 30%; text-align: center;" colspan=2></td>').text(receipt.payments[i].paymentType).appendTo(paymentInfoReceiptTr);
                var paymentMoneyReceiptTd = $('<td style="width: 35%; text-align: center;" ></td>').text(receipt.payments[i].referMoney).appendTo(paymentInfoReceiptTr);
            }

            var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
            var typeInfoReceiptTd = $('<td style="width: 35%; text-align: center;" rowspan="' + ( receipt.receiptsNum  + 1) + '" colspan=2></td>').html("<strong>收据信息</strong>").appendTo(receReceiptTr);
            var balanceReceiptTd = $('<td style="width: 30%; text-align: center;" colspan=2></td>').html('<strong>结算方式</strong>').appendTo(receReceiptTr);
            var amountReceiptTd = $('<td style="width: 35%; text-align: center;" ></td>').html('<strong>收款金额(元)</strong>').appendTo(receReceiptTr);

            for (; start < (i + 1) * receipt.onePageCount && start < num; ++start) {
                if (receipt.receipts[start].paymentWay.indexOf("预付款") == -1 && receipt.receipts[start].paymentWay.indexOf("优惠券") == -1) {
                    sumMoney += receipt.receipts[start].money;
                }
                if (receipt.receipts[start].paymentWay == "刷卡"|| receipt.receipts[start].paymentWay == "转账" ) {
                    var receInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                    var bankInfoReceiptTd = $('<td style="width: 20%; text-align: center;" rowspan="' + (receipt.receipts[start].bankInfo.length+1) + '"></td>').text(receipt.receipts[start].paymentWay).appendTo(receInfoReceiptTr);

                    for (var i = 0; i < receipt.receipts[start].bankInfo.length; i++) {
                        var bankTr = $('<tr></tr>').appendTo(receiptTable);
                        var balanceInfoReceiptTd = $('<td style="width: 15%; text-align: center;"></td>').text(receipt.receipts[start].bankInfo[i].key).appendTo(bankTr);
                        var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.receipts[start].bankInfo[i].value).appendTo(bankTr);
                    }
                }else{
                	var commonInfoReceiptTr = $('<tr></tr>').appendTo(receiptTable);
                	var balanceInfoReceiptTd = $('<td style="width: 30%; text-align: center;"  colspan=2></td>').text(receipt.receipts[start].paymentWay).appendTo(commonInfoReceiptTr);
                	var amountInfoReceiptTd = $('<td style="width: 35%; text-align: center;"></td>').text(receipt.receipts[start].money).appendTo(commonInfoReceiptTr);
                }
            }
			var moneyReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			var renReceiptTd = $('<td colspan="4"></td>').text('人民币大写: ' + utils.getCNMoney(sumMoney)).appendTo(moneyReceiptTr);
			var renMoneyReceiptTd = $('<td></td>').text('实收: ¥' + sumMoney).appendTo(moneyReceiptTr);

			var summaryReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			var summaryReceiptTd = $('<td colspan="5"></td>').appendTo(summaryReceiptTr);
			var summaryReceiptDiv = $('<div style="text-align: right; padding-right: 150px;"></div>').appendTo(summaryReceiptTd);
			var receReceiptSpan = $('<span></span>').text('收款人: ' + receipt.decorationReceipt.collecter.currentName + "  ").appendTo(summaryReceiptDiv);
			var cashierReceiptSpan = $('<span></span>').text(' 交款人: ').appendTo(summaryReceiptDiv);

			var addrReceiptTr = $('<tr></tr>').appendTo(receiptTable);
			var collectDesTd = $('<td colspan="5"></td>').text('备注: ' + receipt.order.decorationReceiptDes).appendTo(addrReceiptTr);
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



