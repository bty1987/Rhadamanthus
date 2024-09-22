jQuery(function ($) {

    var kingdeeRecord = {
        paymentInfoDiv: com.focusPage("#paymentInfoRow"),
        atttypes: constant.payment().receipt.paymentType.keys,
        modals: {
            paymentInfoModal:  com.focusPage("#paymentInfoModal", "#kingdeeRecord")
        },

        advanceTypeData: constant.payment().advancePayment.type.keys,
        advancePaymentTypeData: constant.payment().advancePayment.paymentType.keys,
        advanceStatusData: constant.payment().payment.status.keys,

        decorationPaymentStatusArray: constant.payment().decorationPayment.paymentStatus.keys,

        salesPaymentTypeData: constant.payment().materialPayment.paymentType.keys,
        salesPaymentStatusArray: constant.payment().salesPayment.status.keys,

        servicePaymentTypeData: constant.payment().servicePayment.type.keys,
        servicePaymentStatusArray: constant.payment().servicePayment.status.keys
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.payment.pageKingdeeRecord);

    searcher.condition(["payment-kingdee-orderId", "payment-createTime"]);

    searcher.history("kingdeeRecordPostData");

    var lineprops = [{
        fieId:"rtid",
        name: "收据ID",
        prop: "rtid",
        clazz:"green"
    },{
        fieId: "atttype",
        name: "属性类型",
        prop: "atttype",
        clazz: "red",
        dataset: kingdeeRecord.atttypes
    },{
        fieId: "type",
        name: "款项类型",
        prop: "type",
        clazz: "red",
        show: function(v) {
            if (v.atttype == 0) v.type = v.type == 0 ? "合同预付款" : "主材预付款";

            return v.type;
        }
    },{
        fieId: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    },{
        fieId: "message",
        name: "错误信息",
        prop: "message",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "款项信息",
        clazz: "btn-info",
        handle: function(v) {

            var payment = queryPaymentInfo(v);

            kingdeeRecord.modals.paymentInfoModal.modal("show");

            return false;
        },
        show: function(v) {

            return v.atttype != -1 && v.rtid > 0;
        }
    }];

    searcher.line("orderId", lineprops, linebtns).render();

    function queryPaymentInfo(v) {
        switch (v.atttype) {
            case constant.payment().receipt.PAYMENTTYPE_ADVANCE_INT:

                com.post(api.payment.queryPaymentByArid, {"payment.arId": v.rtid}, function (res) {
                    var payment = res.payment;

                    kingdeeRecord.paymentInfoDiv.html("");

                    drawingDiv("装修单号", payment.decoration.orderId);
                    drawingDiv("收款类型", kingdeeRecord.advanceTypeData[payment.type]);
                    drawingDiv(kingdeeRecord.advancePaymentTypeData[payment.paymentType], payment.recharge);

                    receiptInfo(payment);
                    userInfo(payment.collectUser.currentName, payment.collectTime, payment.confirmUser.currentName, payment.confirmTime);
                });

                break;
            case constant.payment().receipt.PAYMENTTYPE_DECORATION_INT:

                com.post(api.payment.queryDecorationPaymentForNotInitByDrId, {"decorationReceipt.drId": v.rtid}, function (res) {
                    var decorationPayment = res.decorationPayments[0];

                    kingdeeRecord.paymentInfoDiv.html("");

                    drawingDiv("装修单号", decorationPayment.decoration.orderId);
                    drawingDiv(decorationPayment.paymentType, decorationPayment.referMoney);

                    receiptInfo(decorationPayment);
                    userInfo(decorationPayment.collecter.currentName, decorationPayment.collectTime, decorationPayment.confirmer.currentName, decorationPayment.confirmTime);
                });

                break;
            case constant.payment().receipt.PAYMENTTYPE_SALES_INT:

                com.post(api.payment.querySalesPaymentForNotInitBySrid, {"salesReceipt.srId": v.rtid}, function (res) {
                    var salesPayments = res.salesPayments;
                    var salesPayment = salesPayments[0];

                    kingdeeRecord.paymentInfoDiv.html("");

                    $.each(salesPayments, function(i, salesPayment) {

                        var $div = $('<div></div>').addClass("form-group col-sm-12").appendTo(kingdeeRecord.paymentInfoDiv);
                        var $spanNo = $('<span></span>').addClass("col-sm-4").attr("type", "text").html(salesPayment.sales.no).appendTo($div);
                        var $spanType = $('<span></span>').addClass("col-sm-4").attr("type", "text").html(kingdeeRecord.salesPaymentTypeData[salesPayment.type]).appendTo($div);
                        var $spanMoney = $('<span></span>').addClass("col-sm-4").attr("type", "text").html(salesPayment.referMoney).appendTo($div);

                    });

                    $('<hr>').appendTo(kingdeeRecord.paymentInfoDiv);

                    drawingDiv("装修单号", salesPayment.sales.orderId);
                    receiptInfo(salesPayment.salesReceipt);

                    var receipt = salesPayment.salesReceipt;
                    userInfo(receipt.collecter.currentName, receipt.collectTime, receipt.confirmer.currentName, receipt.confirmTime);

                });

                break;
            case constant.payment().receipt.PAYMENTTYPE_SERVICE_INT:

                com.post(api.payment.queryServicePaymentForNotInitBySrId, {"serviceReceipt.srId": v.rtid}, function (res) {
                    var servicePayment = res.servicePayments[0];

                    var receipt = servicePayment.serviceReceipt;

                    kingdeeRecord.paymentInfoDiv.html("");

                    drawingDiv("装修单号", servicePayment.decoration.orderId);
                    drawingDiv("服务费"+kingdeeRecord.servicePaymentTypeData[servicePayment.type], servicePayment.serviceMoney);

                    receiptInfo(servicePayment.serviceReceipt);
                    userInfo(receipt.collecter.currentName, receipt.collectTime, receipt.confirmer.currentName, receipt.confirmTime);
                });

                break;
        }
    }

    function receiptInfo(payment) {
        if (payment.cash > 0) drawingDiv("现金", payment.cash);
        if (payment.bank > 0) drawingDiv("银行", payment.bank);
        if (payment.checkv > 0) drawingDiv("刷卡", payment.checkv);
        if (payment.advance > 0) drawingDiv("预付款", payment.advance);
        if (payment.coupon > 0) drawingDiv("优惠券", payment.coupon);
    }

    function userInfo(collecter, collectTime, confirmer, confirmTime) {
        drawingDiv("收款人", collecter);
        drawingDiv("收款时间", collectTime);
        drawingDiv("确认人", confirmer);
        drawingDiv("确认时间", confirmTime);
    }

    function drawingDiv(key, value) {
        var $div = $('<div></div>').addClass("form-group col-sm-12").appendTo(kingdeeRecord.paymentInfoDiv);
        var $labal = $('<label></label>').addClass("col-sm-4 control-label no-padding-right").html(key).appendTo($div);
        var $span = $('<span></span>').addClass("col-sm-8").attr("type", "text").html(value).appendTo($div);
    }

});
