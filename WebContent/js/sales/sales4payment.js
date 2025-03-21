jQuery(function() {

    var salesPaymentForStatus = {
        cash: [],
        bank: [],
        checkBank: [],
        accounts: [],
        couponType: [],
        cashInfo: {},
        bankInfo: {},
        checkBankInfo: {},
        accountsInfo: {},
        couponTypeData: {},
        salesCollectionPostData: {}
    };

    var salesPayment = {
        items: {
            returnTotal: com.focusPage("#returnTotal"),
            approver: com.focusPage("#salesItemDetialapprover"),
            comment: com.focusPage("#comment")
        },
        btns: {
            approverSaveBtn: com.focusPage("#approverSaveBtn"),
            approverCancelBtn: com.focusPage("#approverCancelBtn")
        },
        options: {},

        sid: params.sales.sales.sid,

        type: params.sales.type,
    };

    com.focusPage('#fl-statement').statement("销售单", "收款");

    salesPaymentForStatus.salesCollectionPostData["salesPayment.sales.sid"] = params.sales.sales.sid;

    com.post(api.data.queryReceiptType, {}, function(res) {

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == constant.data().receiptType.TYPE_CASH_INT) {
                salesPaymentForStatus.cash.push(v);
                salesPaymentForStatus.cashInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_CARD_INT) {
                salesPaymentForStatus.bank.push(v);
                salesPaymentForStatus.bankInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_BANK_INT) {
                salesPaymentForStatus.checkBank.push(v);
                salesPaymentForStatus.checkBankInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_PUBLIC_INT) {
                salesPaymentForStatus.accounts.push(v);
                salesPaymentForStatus.accountsInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_COUPON_INT) {
                salesPaymentForStatus.couponType.push(v);
                salesPaymentForStatus.couponTypeData[v.no] = [v.no, v.name];
            }
        });

    }, null, false);

    com.post(api.payment.querySalesPaymentBySid, {
        "salesPayment.sales.sid": salesPayment.sid
    }, function(listData) {

        if (listData.salesPayments.length == 0) {
            emptyData("resultLists");
        } else {
            createLine('resultLists', listData);
        }
    });

    function createLine(tableId, listData) {

        var $tableWrap = com.focusPage('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (listData && listData.salesPayments.length) {
            $.each(listData.salesPayments, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange  clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(constant.payment().materialPayment.paymentType.keys[v.type]);
                var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');

                var $btnRetrun = $('<a></a>').addClass('btn btn-minier btn-danger').html('退款');

                var propertyArr = [["销售单号: ", v.sales.no, "blue"], ["品类: ", v.sales.category, "grey"], ["品牌: ", v.sales.brand.name, "grey"], ["应收额: ", v.referMoney, "blue"], ["收款时间: ", v.salesReceipt.collectTime, "grey"], ["确认时间: ", v.salesReceipt.confirmTime, "grey"], ["状态: ", v.status == 0 ? '初始' : v.status == 1 ? '待确认' : '已确认', "red"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var addPropertyArr = [];
                v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? addPropertyArr.push(["现金:", v.salesReceipt.cash, "blue"]) : true;
                v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? addPropertyArr.push(["银行信息: ", (function(bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for ( var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", ";
                    }
                    return info;
                })(v.salesReceipt.bank, v.salesReceipt.bankInfo), "blue"]) : true;
                v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? addPropertyArr.push(["转账:", v.salesReceipt.checkv, "blue"]) : true;
                v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? addPropertyArr.push(["分期:", v.salesReceipt.installment, "blue"]) : true;
                v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? addPropertyArr.push(["对公帐户:", v.salesReceipt.accounts, "blue"]) : true;
                v.salesReceipt.advance != null && v.salesReceipt.advance != "0" ? addPropertyArr.push(["预付款:", v.salesReceipt.advance, "blue"]) : true;
                v.salesReceipt.coupon != null && v.salesReceipt.coupon != "0" ? addPropertyArr.push(["优惠券:", v.salesReceipt.coupon + v.salesReceipt.couponInfo.split('#').join(' '), "blue"]) : true;

                $.each(addPropertyArr, function(index, value) {

                    var $liPropertys = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liPropertys);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPropertys);
                    $liPropertys.appendTo($ulProperty);
                });

                $btnDiv.append($btnRetrun);

                if (v.type == 8 && salesPayment.type != "balance") {
                    $h3.append($small).append($btnDiv);
                } else {
                    $h3.append($small);
                }

                $liLine.append($h3).append($ulProperty).appendTo($ul);

                $btnRetrun.click(function() {

                    salesPayment.sid = v.sales.sid;

                    com.popup4mini("#miniPopUp", "#layerReturn", "退款信息", "", function() {

                        com.clearValidator();
                        closeReturnlayer();
                        salesPayment.items.approver.empty();
                    }, function() {

                        salesPayment.items.returnTotal.val(v.referMoney);
                        approvalUtils.initqueryApprovalUser("salesItemDetialapprover", 18);
                    });

                });

            });
            $ul.appendTo($tableWrap);
        }
    }

    salesPayment.btns.approverSaveBtn.click(function() {

        if (com.validate('miniPopUp', 'right')) {
            return false;
        }
        var radios = com.focusPage("#salesItemDetialapprover").find('input:checked').attr('userid');
        if (radios == null || radios == "") {
            com.showAlert(com.warning, "请选择审批人");
            return false;
        }

        var comment = $("#comment").val();

        var options = {
            "approval.receiver.userId": com.focusPage("#salesItemDetialapprover").find('input:checked').attr('userid'),
            "approval.comment": comment,
            "approvalSalesDayment.sid": salesPayment.sid
        };

        com.post(api.approval.submitApprovalForSalesDayment, $.extend(options, salesPayment.options), function() {

            returnlayer();
            salesPayment.items.approver.empty();
            com.showAlert(com.info, "操作成功");
            com.closePopup(com.focusPage("#approverSaveBtn"));
        });
    });

    salesPayment.btns.approverCancelBtn.click(function() {

        com.clearValidator();
        closeReturnlayer();
        com.closePopup(com.focusPage("#approverCancelBtn"));
        salesPayment.items.approver.empty();
    });

    function returnlayer() {

        salesPayment.items.comment.val("");
        salesPayment.items.approver.val("");
    }

    function closeReturnlayer() {

        salesPayment.items.returnTotal.val("");
        salesPayment.items.comment.val("");
    }

    function emptyData(id) {

        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }
});
