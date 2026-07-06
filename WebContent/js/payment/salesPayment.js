$(function() {

    var salesPayment = {
        htmlName: "sales",
        depage: params['urlLoadParams'].depage,
        type: params['urlLoadParams'].paytype,
        profit: params['urlLoadParams'].profit,
        pageFlag: params['urlLoadParams'].depage + params['urlLoadParams'].paytype,
        paytypes: [],
        paymentStatusArray: constant.payment().salesPayment.status.keys,
        payment: null,

        items: {
            cashCheckbox: com.focusPage("#cashCheckbox", "#salesPayment"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#salesPayment"),
            checkvCheckbox: com.focusPage("#checkvCheckbox", "#salesPayment"),
            advanceCheckbox: com.focusPage("#advanceCheckbox", "#salesPayment"),
            couponCheckbox: com.focusPage("#couponCheckbox", "#salesPayment"),

            historyDiv: com.focusPage("#historyDiv", "#salesPayment"),
            historyData: com.focusPage("#historyData", "#salesPayment"),
            cashDiv: com.focusPage("#cashDiv", "#salesPayment"),
            checkvDiv: com.focusPage("#checkvDiv", "#salesPayment"),
            advanceDiv: com.focusPage("#advanceDiv", "#salesPayment"),

            cash: com.focusPage("#cash", "#salesPayment"),
            cashInfo: com.focusPage("#cashInfo", "#salesPayment"),

            bankName: com.focusPage("#bankName", "#salesPayment"),
            bank: com.focusPage("#bank", "#salesPayment"),
            posway: com.focusPage("#posway", "#salesPayment"),

            recharge: com.focusPage("#recharge", "#salesPayment"),
            advance: com.focusPage("#advance", "#salesPayment"),
            advanceType: com.focusPage("#advanceType", "#salesPayment"),

            couponType: com.focusPage("#couponType", "#salesPayment"),
            couponVal: com.focusPage("#couponVal", "#salesPayment"),

            posDiv: com.focusPage("#posDiv", "#salesPayment"),
            posGroup: com.focusPage("#posGroup", "#salesPayment"),
            bankDiv: com.focusPage("#bankDiv", "#salesPayment"),
            bankGroup: com.focusPage("#bankGroup", "#salesPayment"),
            checkvGroup: com.focusPage("#checkvGroup", "#salesPayment"),
            couponDiv: com.focusPage("#couponDiv", "#salesPayment"),
            couponInputs: com.focusPage("#couponInputs", "#salesPayment"),
            couponGroup: com.focusPage("#couponGroup", "#salesPayment"),

            referMoney: com.focusPage("#referMoney", "#salesPayment"),
            comment: com.focusPage("#collectDes", "#salesPayment"),

            myModalLabel: com.focusPage("#myModalLabel", "#salesPayment")
        },

        btns: {
            collectBtn: com.focusPage("#collectBtn", "#salesPayment"),
            refundBtn: com.focusPage("#refundBtn", "#salesPayment"),

            checkvAdd: com.focusPage("#checkvAdd", "#salesPayment"),
            couponAdd: com.focusPage("#couponAdd", "#salesPayment"),
            createPaytran: com.focusPage("#createPaytran", "#salesPayment")
        },

        modals: {
            collectModal: com.focusPage("#collectModal", "#salesPayment"),
            alipayCodepayModal: com.focusPage("#salesAlipayCodeQrcodeModal")
        },

        cash: [],
        bank: [],
        checkv: [],
        accounts: [],
        couponType: [],
        posValues: {},

        cashUtil: [],
        bankUtil: [],
        checkvUtil: [],

        cashInfo: {},
        bankInfo: {},
        checkvInfo: {},
        accountsInfo: {},
        couponTypeData: {},

        bankGrade: [],
        checkvGrade: [],

        conditions: [],
        extraParams: {},
        functions: [],
        spids: [],
        isCollects: false,
        salesPaymentTypeData: constant.payment().materialPayment.paymentType.keys,
        decorationType: constant.decoration().decoration.typeness.datas,
        pageConfig: {},
        typeNo: 3,
        atttype: 1,
        collectType: [constant.payment().materialPayment.PAYMENTTYPE_TYPE_DEPOSIT_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_FULL_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_DEPOSIT_NOTREFUND_INT],
        refundType: [constant.payment().materialPayment.PAYMENTTYPE_TYPE_REJECT_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_FULL_REFUND_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_COUPON_REFUND_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT],
        isAffirms: constant.payment.decorationPayment.isAffirm.keys,
        decoration: {}
    };

    // 隐藏触发
    salesPayment.modals.collectModal.on('hide.bs.modal', function() {

        salesPayment.bankGrade = [];
        salesPayment.checkvGrade = [];
        salesPayment.spids = [];

        salesPayment.items.posGroup.html("");
        salesPayment.items.bankGroup.removeClass('hide');
        salesPayment.items.checkvGroup.html("");
        salesPayment.items.couponGroup.html("");
        salesPayment.items.historyData.html("");
        salesPayment.items.comment.removeAttr("disabled");

        salesPayment.items.bankName.removeClass("v_required v_typeahead");
        salesPayment.items.bank.removeClass("v_required v_float_3");

        salesPayment.isCollects = false;
        salesPayment.payment = null;

        com.closeTip();
        com.cleanItems(salesPayment.items);
    });

    salesPayment.items.posway.bindData(constant.payment().receiptType.posway.datas, "key", "value");

    // checkbox选中时联动
    com.focusPage("#collectModal :checkbox", "#salesPayment").on("change", function() {

        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#salesPayment");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    // 绑定收款单位的基础信息
    paymentUtils.getReceiptType(salesPayment);

    // 转账方式(银行)
    salesPayment.btns.checkvAdd.click(function() {

        paymentUtils.addBank(salesPayment);
        return false;
    });

    salesPayment.items.advanceType.bindData([{
        "key": "3",
        "value": "主材预付款"
    }], 'key', 'value');

    salesPayment.btns.collectBtn.bindClick(collect, 3000);
    salesPayment.btns.refundBtn.bindClick(collect, 3000);

    salesPayment.btns.createPaytran.unbind().click(function() {

        paymentUtils.pushPos(salesPayment, salesPayment.payment.sales.orderId);

        return false;
    });

    salesPayment.btns.couponAdd.unbind().click(function() {

        if (com.validate("couponInputs", "#salesPayment"))
            return false;

        paymentUtils.addCounpon();
    });

    // 不同页面的不同参数
    salesPayment.pageConfig = paymentUtils.getConfig(salesPayment.type, 8);

    function collectSalesPaymentLine(v) {

        if (salesPayment.collectType.contains(v.type))
            paymentUtils.showPos(salesPayment, {
                "paytran.orderId": v.sales.orderId,
                "paytran.atttype": salesPayment.atttype
            }, [0, 1]);
        initCollect(v, false);
        salesPayment.modals.collectModal.attr({
            'spid': v.spid,
            'sid': v.sales.sid
        });
    }
    function settleSalesPaymentLine(v) {

        com.showConfirm("是否确认落款, 落款将直接使用主材预付款余额抵扣：" + v.referMoney + "元", function() {

            com.post(api.payment.settleSalesPayment, {
                "salesPayment.spid": v.spid,
                "salesPayment.advanceType": 3,
                "salesPayment.sales.orderId": v.sales.orderId
            }, function(res) {

                com.showAlert(com.info, "落款成功。");
                searcher.doSearch();
            });
        });
    }
    function withdrawSalesPaymentLine(v) {

        com.showConfirm("是否确认撤款, 撤款将退回主材预付款余额：" + v.referMoney + "元", function() {

            com.post(api.payment.withdrawSalesPayment, {
                "salesPayment.spid": v.spid,
                "salesPayment.sales.orderId": v.sales.orderId
            }, function(res) {

                com.showAlert(com.info, "撤款成功。");
                searcher.doSearch();
            });
        });
    }
    function checkSalesPaymentLine(v) {

        com.showConfirm("是否验证收款信息?", function(result) {

            com.post(api.payment.checkPaytran, {
                "paytran.pid": v.spid,
                "paytran.type": constant.payment().receipt.PAYMENTTYPE_SALES_INT,
                "paytran.atttype": constant.payment().paytran.ATTTYPE_MATERIAL_INT
            }, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "验证成功");
            });
        });
    }
    function codeSalesPaymentLine(v) {

        com.focusPage("#salesCodeQrcodeModal").html("");
        paymentUtils.initQrcode("salesPayment", "salesCodeQrcodeModal");
        paymentUtils.showQRCode("salesPaymentqrcode", "http://fanglin.vip/wx/wxpay?orderId=" + v.sales.orderId + "&paymentType=3" + "&pid=" + v.spid + "&atttype=1", "salesCodeQrcodeModal");
    }
    function alipaySalesPaymentLine(v) {

        var paytranId = 0;
        var paytranMoney = v.referMoney;
        com.post(api.payment.queryPaytran, {
            "paytran.pid": v.spid,
            "paytran.type": 3,
            "paytran.orderId": v.sales.orderId
        }, function(res) {

            $.each(res.paytrans, function(i, pt) {

                if (pt.status == 0) {
                    paytranId = pt.ptid;
                    paytranMoney = pt.money;
                    return false;
                }
            });
        }, null, false);
        if (paytranMoney != v.referMoney) {
            com.showAlert(com.error, "金额不正确.");
            return false;
        }
        com.post(api.payment.alipay, {
            "wxpay.paymentOrderId": v.sales.orderId,
            "wxpay.paymentType": 3,
            "wxpay.paymentAttrType": 1,
            "wxpay.paymentMoney": paytranMoney,
            "wxpay.userId": "alipay",
            "wxpay.paymentid": v.spid,
            "wxpay.paymentptid": paytranId,
            "wxpay.unionId": v.sales.customer.cid
        }, function(data) {

            salesPayment.modals.alipayCodepayModal.html("");
            com.popup("二维收款", data.wxpay.url + "&mchNo=" + data.wxpay.mchNo + "&bizId=" + data.wxpay.bizId + "&isShort=true", null, null, false);
        }, null, false);
    }
    function posPushSalesPaymentLine(v) {

        var bankVal = com.typeahead(salesPayment.htmlName + "paytranBankName");
        var bankDiv = com.focusPage("#" + salesPayment.htmlName + "paytranBankName");
        if (bankVal == "" || bankDiv.val() == "") {
            com.showAlert(com.warning, "请使用匹配数据.");
            return false;
        }
        com.post(api.payment.addPaytran, {
            "paytran.orderId": v.sales.orderId,
            "paytran.pid": v.spid,
            "paytran.type": constant.payment().receipt.PAYMENTTYPE_SALES_INT,
            "paytran.atttype": constant.payment().paytran.ATTTYPE_MATERIAL_INT,
            "paytran.no": com.typeahead(bankDiv),
            "paytran.sn": salesPayment.posValues[bankVal].value,
            "paytran.money": v.referMoney,
            "paytran.way": 0
        }, function(res) {

            com.post(api.payment.posPay, {
                "paytran.ptid": res.paytran.ptid,
                "paytran.way": 1
            }, function(res) {

                com.showAlert(com.info, "推送成功");
            });
        });
    }

    var lineprops = (function() {

        var lineprops = [{
            type: "checkbox",
            name: "spids",
            clazz: "ace ace-checkbox-2",
            show: function() {

                return salesPayment.pageConfig.pageBtn.contains("batchCollect") || salesPayment.pageConfig.pageBtn.contains("selectall");
            },
            attrs: function(v) {

                return {
                    "data-sid": v.sales.sid,
                    "data-spid": v.spid,
                    "data-orderid": v.sales.orderId,
                    "data-refermoney": v.referMoney,
                    "data-type": v.type,
                    "data-grade": v.sales.grade,
                    "data-status": v.status
                };
            }
        }]
            .concat(paymentUtils.getPropertyLineprops(salesPayment, salesPayment.paymentStatusArray));

        if (salesPayment.pageConfig.pageBtn.contains("payway")) {
            lineprops.push({
                field: "payway",
                name: "收款方式",
                type: "custom",
                prop: function(v) {

                    return paymentUtils.getHistoryText(salesPayment, v.salesReceipt);
                },
                render: function($liLine, v) {

                    paymentUtils.drawHistoryData(salesPayment, v.salesReceipt, $liLine, "");
                }
            });
        }

        return lineprops;
    })();

    var linebtns = (function() {

        return {
            decorationInfo: {
                name: "装修单",
                clazz: "btn-yellow",
                show: function() {

                    return salesPayment.pageConfig.pageBtn.contains("decorationInfo");
                },
                handle: function(v, btn) {

                    tools.decoration.info(btn, v.sales.orderId);
                }
            },
            salesInfo: {
                name: "销售单",
                clazz: "btn-warning",
                show: function() {

                    return salesPayment.pageConfig.pageBtn.contains("salesInfo");
                },
                handle: function(v, btn) {

                    tools.sales.info(btn, v.sales.sid);
                }
            },
            posPush: {
                name: "推送",
                clazz: "btn-danger",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && salesPayment.collectType.indexOf(v.type) != -1 && salesPayment.pageConfig.pageBtn.contains("posPush");
                },
                handle: posPushSalesPaymentLine
            },
            collect: {
                name: function(v) {

                    return salesPayment.collectType.indexOf(v.type) != -1 ? "收款" : "退款";
                },
                clazz: function(v) {

                    return salesPayment.collectType.indexOf(v.type) != -1 ? "btn-info" : "btn-danger";
                },
                show: function() {

                    return salesPayment.pageConfig.pageBtn.contains("collect");
                },
                handle: collectSalesPaymentLine
            },
            settle: {
                name: "落款",
                clazz: "btn-primary",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && salesPayment.collectType.indexOf(v.type) != -1 && salesPayment.pageConfig.pageBtn.contains("settle");
                },
                handle: settleSalesPaymentLine
            },
            withdraw: {
                name: "撤款",
                clazz: "btn-warning",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_CONFIRM_INT && salesPayment.collectType.indexOf(v.type) != -1 && salesPayment.pageConfig.pageBtn.contains("withdraw");
                },
                handle: withdrawSalesPaymentLine
            },
            print: {
                name: "打印",
                clazz: "btn-info",
                show: function(v) {

                    return v.status != constant.payment().materialPayment.STATUS_INIT_INT && salesPayment.pageConfig.pageBtn.contains("print");
                },
                handle: printPayment
            },
            update: {
                name: "更新",
                clazz: "btn-success",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_COLLECT_INT && salesPayment.pageConfig.pageBtn.contains("update");
                },
                handle: function(v) {

                    v.referMoney = utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(v.salesReceipt.cash, v.salesReceipt.bank), v.salesReceipt.checkv), v.salesReceipt.coupon), v.salesReceipt.advance);
                    initUpdate(v);
                }
            },
            collectCode: {
                name: "收款码",
                clazz: "btn-success",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && salesPayment.collectType.indexOf(v.type) != -1 && salesPayment.pageConfig.pageBtn.contains("collectCode");
                },
                handle: codeSalesPaymentLine
            },
            alipayCollectCode: {
                name: "二维收款",
                clazz: "btn-info",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && salesPayment.collectType.indexOf(v.type) != -1 && salesPayment.pageConfig.pageBtn.contains("alipayCollectCode");
                },
                handle: alipaySalesPaymentLine
            },
            codePush: {
                name: "微信推送",
                clazz: "btn-pink",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && salesPayment.collectType.indexOf(v.type) != -1 && salesPayment.pageConfig.pageBtn.contains("codePush");
                },
                handle: function(v) {

                    com.showConfirm("是否发送付款通知", function() {

                        com.post(api.payment.sendSalesPayment, {
                            "salesPayment.spid": v.spid
                        }, function(res) {

                            com.showAlert(com.info, "发送成功");
                        });
                    });
                }
            },
            check: {
                name: "验证",
                clazz: "btn-orange",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && salesPayment.collectType.indexOf(v.type) != -1 && salesPayment.pageConfig.pageBtn.contains("check");
                },
                handle: checkSalesPaymentLine
            },
            kingdee: {
                name: "同步金蝶",
                clazz: "btn-yellow",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_CONFIRM_INT && salesPayment.pageConfig.pageBtn.contains("toKingdee");
                },
                handle: function(v) {

                    kingdeeUtils.salesPayment(v, salesPayment.htmlName);
                }
            },
            customerPush: {
                name: "客户推送",
                clazz: "btn-warning",
                show: function(v) {

                    return v.isAffirm == constant.payment().decorationPayment.ISAFFIRM_INIT_SHORT && salesPayment.pageConfig.pageBtn.contains("customerPush");
                },
                handle: function(v) {

                    com.showConfirm("是否推送给客户", function() {

                        com.post(api.payment.pushSalesPayment, {
                            "salesPayment.spid": v.spid
                        }, function(res) {

                            com.showAlert(com.info, "发送成功");
                        });
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var btnParams = [];
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        $('<span></span>').text('批量收款').appendTo($adda);
        var $showa = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-calculator bigger-110').appendTo($showa);
        $('<span></span>').text('合计').appendTo($showa);
        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);
        var $confirma = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-money bigger-110').appendTo($confirma);
        $('<span></span>').text('批量确认').appendTo($confirma);
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        $('<span></span>').text('导出').appendTo($impa);
        if (salesPayment.pageConfig.pageBtn.contains("batchCollect"))
            btnParams.push($adda);
        if (salesPayment.pageConfig.pageBtn.contains("count"))
            btnParams.push($showa);
        if (salesPayment.pageConfig.pageBtn.contains("selectall"))
            btnParams.push($checka);
        if (salesPayment.pageConfig.pageBtn.contains("confirms"))
            btnParams.push($confirma);
        if (salesPayment.pageConfig.pageBtn.contains("export"))
            btnParams.push($impa);
        return btnParams;
    })();

    var searcher = new Searcher();

    var extraParams = ["collect", "confirm"].contains(salesPayment.type) ? {
        "companyType": salesPayment.depage
    } : {
        "companyType": salesPayment.depage ? "sales." + salesPayment.depage : null
    };

    if (salesPayment.pageConfig.statusExtraParam != null && salesPayment.pageConfig.statusExtraParam.length > 0) {
        extraParams["salesPayment.status"] = salesPayment.pageConfig.statusExtraParam[0];
    }

    if (salesPayment.pageConfig.typeExtraParam != null && salesPayment.pageConfig.typeExtraParam.length > 0) {
        extraParams["salesPayment.types"] = "[" + salesPayment.pageConfig.typeExtraParam.toString() + "]";
    }

    searcher.set("condList", "pagenation", "resultList", salesPayment.pageConfig.apiPage, extraParams, salesPayment.pageConfig.condArr, "salesPaymentPostData" + salesPayment.pageFlag, null, false, buttons);
    searcher.line(function(v) {

        return salesPayment.salesPaymentTypeData[v.type];
    }, lineprops, linebtns).render();

    // 要在searcher后面
    paymentUtils.pushPosBank(salesPayment.type == "common", salesPayment.bankUtil, com.focusPage("#condList", "#salesPaymentList"), salesPayment.htmlName);

    // 初始化模态框
    function initCollect(payment, isCollects) {

        com.cleanItems(salesPayment.items);

        salesPayment.items.historyDiv.hide();

        salesPayment.payment = payment;

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": payment.sales.orderId
        }, function(res) {

            salesPayment.decoration = res.decoration;

            if (!salesPayment.profit)
                salesPayment.decoration.bompany = null;
        }, null, false);

        // 绑定收款单位的基础信息
        paymentUtils.getReceiptType(salesPayment);

        salesPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
        salesPayment.items.comment.removeAttr("disabled");

        var type = salesPayment.refundType.contains(payment.type) ? 1 : 0; // 0: 收款类型 , 1: 退款类型

        if (salesPayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(salesPayment);

        if (salesPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(salesPayment, type);

        if (salesPayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(salesPayment);

        if (salesPayment.pageConfig.paytypes.contains("advance"))
            paymentUtils.initAdvance(salesPayment, type, {
                "advancePayment.decoration.orderId": payment.sales.orderId
            }, "materialAdvance");

        if (salesPayment.pageConfig.paytypes.contains("coupon"))
            paymentUtils.initCoupon(salesPayment, 0);

        if (isCollects)
            salesPayment.items.couponCheckbox.parent().addClass("hide");

        com.selectTypeahead("cashInfo", salesPayment.cashUtil, "key", "value", null); // 现金方式

        com.selectTypeahead("couponType", salesPayment.couponType, 'no', 'name'); // 优惠券

        // 根据销售单等级获取收据类型等级
        // var grade = payment.sales.grade == "B" ? "B" : "";
        var grade = payment.sales.grade == "C" ? "" : payment.sales.grade;

        // 根据等级在数组中筛选出符合要求的用于显示
        paymentUtils.initBankGrade(salesPayment, grade); // 刷卡&银行

        if (type == 1) {// 退款

            com.focusPage("#myModalLabel").text("退款信息");

            salesPayment.btns.collectBtn.addClass("hide");
            salesPayment.btns.refundBtn.removeClass("hide");
        } else {

            isCollects ? com.focusPage("#myModalLabel").html("批量付款信息") : com.focusPage("#myModalLabel").html("付款信息");

            salesPayment.btns.collectBtn.removeClass("hide");
            salesPayment.btns.refundBtn.addClass("hide");
        }

        salesPayment.modals.collectModal.modal("show");

        // 是批量收款
        salesPayment.isCollects = isCollects;
    }

    // 更新
    function initUpdate(payment) {

        com.cleanItems(salesPayment.items);

        com.focusPage("#myModalLabel").text("更新款项信息");

        salesPayment.items.historyDiv.show();

        salesPayment.payment = payment;

        salesPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
        salesPayment.items.comment.val(payment.salesReceipt.comment).attr("disabled", "disabled");

        if (salesPayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(salesPayment);
        if (salesPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(salesPayment, 1);
        if (salesPayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(salesPayment);
        if (salesPayment.pageConfig.paytypes.contains("advance"))
            paymentUtils.initAdvance(salesPayment, 2, {
                "advancePayment.decoration.orderId": payment.sales.orderId
            }, "materialAdvance");
        if (salesPayment.pageConfig.paytypes.contains("coupon"))
            paymentUtils.initCoupon(salesPayment, 1);

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": payment.sales.orderId
        }, function(res) {

            salesPayment.decoration = res.decoration;

            if (!salesPayment.profit)
                salesPayment.decoration.bompany = null;
        }, null, false);

        // 绑定收款单位的基础信息
        paymentUtils.getReceiptType(salesPayment);

        com.selectTypeahead("cashInfo", salesPayment.cashUtil, "key", "value", null); // 现金方式

        com.selectTypeahead("couponType", salesPayment.couponType, 'no', 'name'); // 优惠券

        // var grade = payment.sales.grade == "B" ? "B" : "";
        var grade = payment.sales.grade == "C" ? "" : payment.sales.grade;

        paymentUtils.initBankGrade(salesPayment, grade);

        // 历史收款信息
        paymentUtils.drawHistoryData(salesPayment, payment.salesReceipt, salesPayment.items.historyData, "update");

        salesPayment.btns.refundBtn.addClass("hide");

        salesPayment.modals.collectModal.modal("show");
    }

    // 收款
    function collect() {

        if (com.validate("collectModal", "#salesPayment"))
            return false;

        var url = "";
        var options = {
            "salesReceipt.comment": salesPayment.items.comment.val()
        };

        var realPayment = 0;
        var realMoney = 0;
        var referPayment = salesPayment.items.referMoney.val();
        var type = 0;

        var payment = salesPayment.payment;

        if (salesPayment.collectType.contains(payment.type) && payment.status == 0) {
            url = api.payment.collectSalesPayment;

            // 批量收款参数
            if (salesPayment.isCollects) {
                url = api.payment.collectSalesPayments;

                if (salesPayment.spids.length > 0) {
                    $.each(salesPayment.spids, function(i, v) {

                        options["spids[" + i + "]"] = v;
                    });
                }

                options["salesPayment.sales.sid"] = payment.sales.sid;
            }

            if (salesPayment.profit)
                options["salesPayment.bompany"] = salesPayment.decoration.bompany;

        } else if (salesPayment.refundType.contains(payment.type) && payment.status == 0) {
            url = api.payment.refundSalesPayment;
            type = 1;
        } else if (payment.status == constant.payment().materialPayment.STATUS_COLLECT_INT) {
            url = api.payment.updateSalesPayment;
            type = 2;
        }

        var cash = paymentUtils.paramCash(salesPayment, "salesReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(cash));
        realMoney = utils.accAdd(realMoney, parseFloat(cash));

        var bank = paymentUtils.paramBank(salesPayment, salesPayment.payment.salesReceipt, "salesReceipt", options, type);

        if (bank < 0) {
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(bank));
        realMoney = utils.accAdd(realMoney, parseFloat(bank));

        var checkv = paymentUtils.paramCheckv(salesPayment, "salesReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(checkv));
        realMoney = utils.accAdd(realMoney, parseFloat(checkv));

        var advance = paymentUtils.paramAdvance(salesPayment, salesPayment.payment.salesReceipt, "salesReceipt", options, "advance", type);

        if (advance < 0) {
            com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(advance));

        var coupon = paymentUtils.paramCoupon(salesPayment, salesPayment.payment.salesReceipt, "salesReceipt", options, type);

        realPayment = utils.accAdd(realPayment, parseFloat(coupon));

        if (referPayment != realPayment) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if ($.isEmptyObject(options)) {
            com.showAlert(com.warning, "无收款方式信息");
            return false;
        }

        options["salesPayment.spid"] = payment.spid;
        options["salesPayment.referMoney"] = referPayment;
        options["salesReceipt.referMoney"] = referPayment;
        options["salesReceipt.realMoney"] = realMoney;

        com.post(url, options, function(res) {

            searcher.doSearch();
            salesPayment.modals.collectModal.modal("hide");
            com.showAlert(com.info, "操作成功")
        });
    }

    // 批量收款
    com.focusPage('a[name="collects"]', '#pagenation').click(function() {

        var $inputs = com.focusPage('input[name="spids"]:checked', '#resultList');

        if (!$inputs.length)
            return false;

        var _orderId = "";
        var _grade = "";
        var sumMoney = 0;
        var flag = false;
        salesPayment.spids = [];

        $.each($inputs, function(i, v) {

            var $input = $(v);

            if (i == 0) {
                _orderId = $input.attr("data-orderid");
                _grade = $input.attr("data-grade");
            }

            if (salesPayment.refundType.contains(parseInt($input.attr("data-type")))) {
                flag = true;
                com.showAlert(com.warning, "批量收款不支持退款");
                return false;
            }

            if ($input.attr("data-orderid") != _orderId) {
                flag = true;
                com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
                return false;
            }

            if ($input.attr('data-grade') != _grade) {
                flag = true;
                com.showAlert(com.warning, "批量收款不支持不同销售单类型之间的操作.");
                return false;
            }

            sumMoney = utils.accAdd(sumMoney, parseFloat($input.attr("data-refermoney")));
            salesPayment.spids.push($input.attr("data-spid"));
        });

        if (flag)
            return false;

        var payment = $($inputs[0]).data();

        salesPayment.payment = {
            "spid": payment.spid,
            "referMoney": sumMoney,
            "type": payment.type,
            "status": payment.status
        };

        salesPayment.payment.sales = {
            "sid": payment.sid,
            "orderId": payment.orderid,
            "grade": payment.grade
        };

        if (salesPayment.collectType.contains(payment.type))
            paymentUtils.showPos(salesPayment, {
                "paytran.orderId": payment.orderid,
                "paytran.atttype": salesPayment.atttype
            }, [0, 1]);

        initCollect(salesPayment.payment, true);
    });

    // 合计
    com.focusPage('a[name="showTotal"]', '#pagenation').click(function() {

        var $total = 0;
        var $inputs = com.focusPage('input[name="spids"]:checked');

        if ($inputs.length == 0)
            return false;

        $.each($inputs, function(i, v) {

            var $that = $(v);
            var $type = parseInt($that.attr('data-type'));
            var $referMoney = $that.attr('data-refermoney');

            if (salesPayment.refundType.indexOf($type) != -1) {
                $total = utils.accSub($total, $referMoney);
            } else {
                $total = utils.accAdd($total, $referMoney);
            }
        });

        com.showAlert(com.info, '<h3>合计金额: ' + $total + '</h3>');
    });

    // 全选
    com.focusPage('a[name="checks"]', '#pagenation').click(function() {

        paymentUtils.checkAll();
    });

    // 批量确认
    com.focusPage('a[name="confirms"]', '#pagenation').click(function() {

        var $inputs = com.focusPage('input[name="spids"]:checked', '#resultList');

        if (!$inputs.length)
            return false;

        var option = {};

        $.each($inputs, function(index, value) {

            option["spids[" + index + "]"] = $(value).attr("data-spid");
        });

        com.showConfirm('确定要将符合条件的所有收款项目,置为已确认状态吗?', function(index, layero) {

            com.post(api.payment.confirmSalesPayment, option, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, '确认成功');
            })
        }, null);
    });

    // 导出
    com.focusPage('a[name="import"]', '#pagenation').click(function() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 3000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.payment.pageSalesPayment, $.extend({}, params["salesPaymentPostData" + salesPayment.pageFlag], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["装修单号", "sales.orderId"], ["销售单号", "sales.no"], ['楼盘地址', ['sales.house.village.cityProper.city.name', 'sales.house.village.cityProper.name', 'sales.house.village.name', 'sales.house.houseNumber']], ['品牌', 'sales.brand.name'], ['应收金额', 'referMoney'], ['收款人', 'salesReceipt.collecter.currentName'], ['收款时间', 'salesReceipt.collectTime'], ['类型', 'type'], ['状态', 'status'], ['备注', 'salesReceipt.comment'], ['现金', 'salesReceipt.cash'], ['刷卡', ['salesReceipt.bank', 'salesReceipt.bankInfo']], ['银行', ['salesReceipt.checkv', 'salesReceipt.checkvBank']], ['分期', ['salesReceipt.installment', 'salesReceipt.installBank']], ['对公', ['salesReceipt.accounts', 'salesReceipt.accountsBank']], ['预付款', 'salesReceipt.advance'], ['券', ['salesReceipt.coupon', 'salesReceipt.couponInfo']]],
                list: res.paging.data
            }, function(v) {

                v.salesReceipt.collecter = v.salesReceipt.collecter == null ? {
                    "salesReceipt.collecter": ""
                } : v.salesReceipt.collecter;
                if (v.salesReceipt.bank != null && v.salesReceipt.bank != 0) {
                    v.salesReceipt.bankInfo = paymentUtils.splitBankInfo('', v.salesReceipt.bankInfo, salesPayment.bankInfo, true);
                }

                if (v.salesReceipt.checkv != null && v.salesReceipt.checkv != 0) {
                    var checkBankInfoStr = v.salesReceipt.checkvBank;
                    if (checkBankInfoStr.indexOf("#") != -1) {
                        v.salesReceipt.checkvBank = paymentUtils.splitBankInfo('', v.salesReceipt.checkvBank, salesPayment.checkvInfo, true);
                    } else {
                        v.salesReceipt.checkvBank = v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? salesPayment.checkvInfo[v.salesReceipt.checkvBank] : '';
                    }
                }

                if (v.salesReceipt.coupon != null && v.salesReceipt.coupon != 0) {
                    var $couponInfo = ' ';
                    var _info = v.salesReceipt.couponInfo.split('#');
                    for ( var i = 1; i < _info.length - 1; i++) {
                        var _i = _info[i].split(':');
                        $couponInfo += salesPayment.couponTypeData[_i[0]][1] + " " + _i[1] + ", ";
                    }

                    v.salesReceipt.couponInfo = $couponInfo;
                }

                v.salesReceipt.installBank = v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? salesPayment.bankInfo[v.salesReceipt.installBank] : '';
                v.salesReceipt.accountsBank = v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? salesPayment.accountsInfo[v.salesReceipt.accountsBank] : '';

                v.type = salesPayment.salesPaymentTypeData[v.type];
                v.status = v.status == 1 ? '已付款' : '已确认';
            });
        });
    });

    // 打印
    function printPayment(salesPayment) {

        params.payment.srId = salesPayment.salesReceipt.srId;
        params.payment.cid = salesPayment.sales.customer.cid;

        com.popup("专用收款收据__装修单号: " + salesPayment.sales.orderId, api.index.salesPaymentReceiptIndex.url, function() {

            parent.layer.getFrameIndex(window.name);
        }, null, true);
    }

});