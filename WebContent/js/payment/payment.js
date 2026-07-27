jQuery(function($) {

    var payment = {
        htmlName: "payment",
        depage: params['urlLoadParams'].depage,
        type: params['urlLoadParams'].paytype,
        profit: params['urlLoadParams'].profit,
        paytypes: [],
        payment: null,
        items: {
            checkbox: com.focusPage("#checkbox", "#payment"),
            cashCheckbox: com.focusPage("#cashCheckbox", "#payment"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#payment"),
            checkvCheckbox: com.focusPage("#checkvCheckbox", "#payment"),

            historyDiv: com.focusPage("#historyDiv", "#payment"),
            historyData: com.focusPage("#historyData", "#payment"),
            cashDiv: com.focusPage("#cashDiv", "#payment"),
            checkvDiv: com.focusPage("#checkvDiv", "#payment"),

            cash: com.focusPage("#cash", "#payment"),
            cashInfo: com.focusPage("#cashInfo", "#payment"),

            bankName: com.focusPage("#bankName", "#payment"),
            bank: com.focusPage("#bank", "#payment"),
            posway: com.focusPage("#posway", "#payment"),

            posDiv: com.focusPage("#posDiv", "#payment"),
            posGroup: com.focusPage("#posGroup", "#payment"),
            bankDiv: com.focusPage("#bankDiv", "#payment"),
            bankGroup: com.focusPage("#bankGroup", "#payment"),
            checkvGroup: com.focusPage("#checkvGroup", "#payment"),

            advanceType: com.focusPage("#advanceType", "#payment"),
            balanceDiv: com.focusPage("#balanceDiv", "#payment"),
            balance: com.focusPage("#balance", "#payment"),
            withdrawDiv: com.focusPage("#withdrawDiv", "#payment"),
            withdraw: com.focusPage("#withdraw", "#payment"),
            des: com.focusPage("#des", "#payment"),

            myModalLabel: com.focusPage("#myModalLabel", "#payment"),
            paymentMethod: com.focusPage("#paymentMethod", "#payment"),

            withdrawBalance: com.focusPage("#withdrawBalance", "#payment"),
            withdrawAmount: com.focusPage("#withdrawAmount", "#payment"),
            withdrawComment: com.focusPage("#withdrawComment", "#payment"),
            withdrawApprover: com.focusPage("#withdrawApprover", "#payment"),
            withdrawApprovalComment: com.focusPage("#withdrawApprovalComment", "#payment")
        },

        createItems: {
            orderId: com.focusPage("#decorationOrderId", "#payment")
        },

        createCollectPaymentItems: {
            collect_orderId: com.focusPage("#collect_orderId", "#payment"),
            collect_advance_type: com.focusPage("#collect_advance_type", "#payment"),
            collect_money: com.focusPage("#collect_money", "#payment")
        },

        btns: {
            collectBtn: com.focusPage("#collectBtn", "#payment"),
            createBtn: com.focusPage("#createBtn", "#payment"),
            confirmBtn: com.focusPage("#confirmBtn", "#payment"),
            approveWithdrawBtn: com.focusPage("#approveWithdrawBtn", "#payment"),

            checkvAdd: com.focusPage("#checkvAdd", "#payment"),
            createPaytran: com.focusPage("#createPaytran", "#payment")
        },

        modals: {
            collectModal: com.focusPage("#collectModal", "#payment"),
            createModal: com.focusPage("#createPaymentModal", "#payment"),
            createCollectPaymentModal: com.focusPage("#createCollectPaymentModal", "#payment"),
            approveWithdrawModal: com.focusPage("#approveWithdrawModal", "#payment"),
            collectCodeQrcodeModal: com.focusPage("#collectCodeQrcodeModal").prop("id", params['urlLoadParams'].paytype + "collectCodeQrcodeModal"),
            alipayCodepayModal: com.focusPage("#alipayCodeQrcodeModal")
        },

        cash: [],
        bank: [],
        checkv: [],
        accounts: [],
        posValues: {},

        cashUtil: [],
        bankUtil: [],
        checkvUtil: [],

        cashInfo: {},
        bankInfo: {},
        checkvInfo: {},
        accountsInfo: {},

        bankGrade: [],
        checkvGrade: [],

        url: "",
        conditions: [],
        extraParams: {},
        functions: [],
        decorationType: constant.decoration().decoration.typeness.datas,

        typeData: constant.payment().advancePayment.type.keys,
        paymentTypeData: constant.payment().advancePayment.paymentType.keys,
        statusData: constant.payment().payment.status.keys,
        typeUpdate: "",
        currentOrderId: "",
        currentWithdrawType: 0,
        advancePayment: null,
        pageConfig: {},
        typeNo: 0,
        atttype: 0,
        decoration: {}
    };

    // 隐藏触发
    payment.modals.collectModal.on('hide.bs.modal', function() {

        payment.bankGrade = [];
        payment.checkvGrade = [];

        payment.items.posGroup.html("");
        payment.items.bankGroup.removeClass('hide');
        payment.items.checkvGroup.html("");
        payment.items.historyData.html("");

        payment.items.bankName.removeClass("v_required v_typeahead");
        payment.items.bank.removeClass("v_required v_float_3");

        payment.payment = null;
        payment.atttype = 0;

        com.closeTip();
        com.cleanItems(payment.items);
    });

    payment.items.posway.bindData(constant.payment().receiptType.posway.datas, "key", "value");

    com.focusPage("#collectModal :checkbox", "#payment").on("change", function() {

        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#payment");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    // info信息是分页显示信息的, util是下拉框信息
    paymentUtils.getReceiptType(payment);

    // 转账方式(银行)
    payment.btns.checkvAdd.click(function() {

        paymentUtils.addBank(payment);
        return false;
    });

    payment.btns.collectBtn.bindClick(collect, 3000);

    // 审批提款提交
    payment.btns.approveWithdrawBtn.on('click', function() {

        var $btn = $(this);

        // 防重复点击:提交期间置灰 3 秒,期间再点不触发请求。
        if ($btn.hasClass('disabled') || $btn.attr('disabled')) {
            return false;
        }
        $btn.button('loading');

        setTimeout(function() {
            $btn.button('reset');
        }, 3000);

        if (com.validate("approveWithdrawModal", "#payment")) {
            return false;
        }

        var receiverId = com.focusPage("#withdrawApprover", "#payment").find('input:checked').attr('userid');
        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return false;
        }

        var withdrawAmount = parseFloat(payment.items.withdrawAmount.val());
        var balanceAmount = parseFloat(payment.items.withdrawBalance.val());

        if (withdrawAmount <= 0) {
            com.showAlert(com.warning, "提现金额需要大于零!");
            return false;
        }

        if (withdrawAmount > balanceAmount) {
            com.showAlert(com.warning, "提现金额不能大于余额!");
            return false;
        }

        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": payment.items.withdrawApprovalComment.val(),
            "approvalPaymentWithdraw.orderId": payment.currentOrderId,
            "approvalPaymentWithdraw.paymentType": payment.currentWithdrawType,
            "approvalPaymentWithdraw.amount": withdrawAmount,
            "approvalPaymentWithdraw.comment": payment.items.withdrawComment.val()
        };

        com.showConfirm("确认要提交审批提款申请吗?", function(res) {

            com.post(api.approval.submitApprovalForPaymentWithdraw, options, function(res) {

                com.showAlert(com.info, "提交成功");
                searcher.doSearch();
                payment.modals.approveWithdrawModal.modal("hide");
            });
        });
    });

    payment.btns.createPaytran.unbind().click(function() {

        paymentUtils.pushPos(payment, payment.payment.orderId);
        return false;
    });

    payment.btns.createBtn.bindClick(function() {

        if (com.validate("createPaymentModal"))
            return;

        var url = api.payment.addAdvancePayment;
        var createOptions = {
            "advancePayment.decoration.orderId": payment.createItems.orderId.val()
        };

        com.post(url, createOptions, function(res) {

            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
            payment.modals.createModal.modal("hide");
        });
    }, 3000);

    payment.btns.confirmBtn.bindClick(function() {

        if (com.validate("createCollectPaymentModal"))
            return;

        var url = api.payment.addPayment;
        var options = {
            "payment.orderId": payment.createCollectPaymentItems.collect_orderId.val(),
            "payment.paymentType": payment.createCollectPaymentItems.collect_advance_type.val(),
            "payment.recharge": payment.createCollectPaymentItems.collect_money.val()
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
            payment.modals.createCollectPaymentModal.modal("hide");
        });
    }, 3000);

    // 切换合同和主材预付款
    payment.items.advanceType.on("change", function() {

        payment.bankGrade = [];
        payment.checkvGrade = [];

        payment.items.bankCheckbox.prop("checked", false);
        payment.items.posDiv.hide();
        payment.items.bankDiv.hide();
        payment.items.checkvGroup.html("");
        com.cleanTypeahead(payment.items.bankName);
        payment.items.bank.val("");

        var currentGrade = payment.modals.collectModal.attr("grade");
        getReceiptTypeForGrade(payment.items.advanceType.val(), currentGrade);
        payment.items.bankName.data('typeahead').options.list = payment.bankGrade;

        if (payment.items.advanceType.val() == '0') {
            payment.atttype = 0;
        } else {
            payment.atttype = 1;
        }

        // 转换款
        payment.items.posGroup.html("");
        paymentUtils.showPos(payment, {
            "paytran.orderId": payment.currentOrderId,
            "paytran.atttype": payment.atttype
        }, [0, 1]);
    });

    // 不同页面的不同参数
    payment.pageConfig = paymentUtils.getConfig(payment.type, 1);

    function posPushPaymentLine(v) {

        var bankVal = com.typeahead(payment.htmlName + "paytranBankName");
        var bankDiv = com.focusPage("#" + payment.htmlName + "paytranBankName");
        if (bankVal == "" || bankDiv.val() == "") {
            com.showAlert(com.warning, "请使用匹配数据.");
            return false;
        }
        com.post(api.payment.addPaytran, {
            "paytran.orderId": v.decoration.orderId,
            "paytran.pid": v.pid,
            "paytran.type": constant.payment().receipt.PAYMENTTYPE_ADVANCE_INT,
            "paytran.atttype": constant.payment().paytran.ATTTYPE_DECORATION_INT,
            "paytran.no": com.typeahead(bankDiv),
            "paytran.sn": payment.posValues[bankVal].value,
            "paytran.money": v.recharge,
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
            name: "pids",
            clazz: "ace ace-checkbox-2",
            show: function() {

                return payment.pageConfig.pageBtn.contains("selectall");
            },
            attrs: function(v) {

                return {
                    "pid": v.pid,
                    "paymenttype": v.paymentType,
                    "arid": v.arId,
                    "collecttype": v.type,
                    "comment": v.comment,
                    "customerid": v.decoration.customer.cid,
                    "orderid": v.decoration.orderId,
                    "grade": v.decoration.grade,
                    "villagename": v.decoration.house.village.name,
                    "housenumber": v.decoration.house.houseNumber,
                    "cash": v.cash,
                    "cashinfo": v.cashInfo,
                    "bank": v.bank,
                    "bankinfo": v.bankInfo,
                    "checkv": v.checkv,
                    "checkvbank": v.checkvBank,
                    "collectTime": v.collectTime
                };
            }
        }]
            .concat(paymentUtils.getPropertyLineprops(payment, payment.statusData));

        if (payment.pageConfig.pageBtn.contains("payway")) {
            lineprops.push({
                field: "payway",
                name: "收款方式",
                type: "custom",
                prop: function(v) {

                    return paymentUtils.getHistoryText(payment, v);
                },
                render: function($liLine, v) {

                    paymentUtils.drawHistoryData(payment, v, $liLine, "");
                }
            });
        }

        return lineprops;
    })();

    var linebtns = (function() {

        return {
            posPush: {
                name: "推送",
                clazz: "btn-danger",
                show: function(v) {

                    return v.status == constant.payment().payment.STATUS_INIT_INT && v.type == constant.payment().advancePayment.TYPE_COLLECTION_INT && payment.pageConfig.pageBtn.contains("posPush");
                },
                handle: posPushPaymentLine
            },
            collect: {
                name: "收款",
                clazz: "btn-primary",
                show: function() {

                    return payment.pageConfig.pageBtn.contains("collect");
                },
                handle: function(v) {

                    v.decoration.paymentType = "收款";
                    payment.typeUpdate = 0;
                    payment.currentOrderId = v.decoration.orderId;
                    paymentUtils.showPos(payment, {
                        "paytran.orderId": v.decoration.orderId,
                        "paytran.atttype": payment.atttype
                    }, [0, 1]);
                    initCollect(v.decoration);
                }
            },
            withdraw: {
                name: "提款",
                clazz: "btn-warning",
                show: function() {

                    return payment.pageConfig.pageBtn.contains("withdraw");
                },
                handle: function(v) {

                    v.decoration.paymentType = "提款";
                    payment.typeUpdate = 1;
                    com.post(api.payment.queryAdvancePaymentByOrderId, {
                        "advancePayment.decoration.orderId": v.decoration.orderId
                    }, function(res) {

                        initCollect(v.decoration, res);
                    });
                }
            },
            approveWithdrawBalance: {
                name: "合同额提现",
                clazz: "btn-inverse",
                show: function() {

                    return payment.pageConfig.pageBtn.contains("approveWithdrawBalance");
                },
                handle: function(v) {

                    com.cleanItems([payment.items.withdrawAmount, payment.items.withdrawComment, payment.items.withdrawApprovalComment]);
                    payment.currentOrderId = v.decoration.orderId;
                    payment.currentWithdrawType = 0;
                    com.focusPage("#approveWithdrawTitle", "#payment").html("合同额提现审批");
                    com.post(api.payment.queryAdvancePaymentByOrderId, {
                        "advancePayment.decoration.orderId": v.decoration.orderId
                    }, function(res) {

                        payment.advancePayment = res;
                        payment.items.withdrawBalance.val(res.balanceAdvance);
                    });
                    approvalUtils.initqueryApprovalUser("withdrawApprover", 26);
                    payment.modals.approveWithdrawModal.modal("show");
                }
            },
            approveWithdrawMaterial: {
                name: "主材额提现",
                clazz: "btn-purple",
                show: function() {

                    return payment.pageConfig.pageBtn.contains("approveWithdrawMaterial");
                },
                handle: function(v) {

                    com.cleanItems([payment.items.withdrawAmount, payment.items.withdrawComment, payment.items.withdrawApprovalComment]);
                    payment.currentOrderId = v.decoration.orderId;
                    payment.currentWithdrawType = 2;
                    com.focusPage("#approveWithdrawTitle", "#payment").html("主材额提现审批");
                    com.post(api.payment.queryAdvancePaymentByOrderId, {
                        "advancePayment.decoration.orderId": v.decoration.orderId
                    }, function(res) {

                        payment.advancePayment = res;
                        payment.items.withdrawBalance.val(res.materialAdvance);
                    });
                    approvalUtils.initqueryApprovalUser("withdrawApprover", 26);
                    payment.modals.approveWithdrawModal.modal("show");
                }
            },
            decorationInfo: {
                name: "装修单",
                clazz: "btn-yellow",
                show: function(v) {

                    return v.status != constant.payment().payment.STATUS_INIT_INT && payment.pageConfig.pageBtn.contains("decorationInfo");
                },
                handle: function(v, btn) {

                    tools.decoration.info(btn, v.decoration.orderId);
                }
            },
            print: {
                name: "打印",
                clazz: "btn-info",
                show: function(v) {

                    return v.status != constant.payment().payment.STATUS_INIT_INT && payment.pageConfig.pageBtn.contains("print");
                },
                handle: function(v) {

                    params.payment.pid = v.pid;
                    params.payment.orderId = v.decoration.orderId;
                    params.payment.cid = v.customer.cid;
                    params.payment.profit = payment.profit;
                    com.popup("专用收款收据__装修单号:" + v.decoration.orderId, api.index.paymentReceiptIndex.url, function() {

                        parent.layer.getFrameIndex(window.name);
                    }, null, true);
                }
            },
            update: {
                name: "更新",
                clazz: "btn-success",
                show: function(v) {

                    return v.status == constant.payment().payment.STATUS_PAID_INT && v.type != constant.payment().advancePayment.TYPE_PAYED_INT && v.transfer == 0 && payment.pageConfig.pageBtn.contains("update");
                },
                handle: function(v) {

                    payment.typeUpdate = 2;
                    v.grade = "allGrade";
                    initUpdate(v);
                }
            },
            collectCode: {
                name: "收款码",
                clazz: "btn-success",
                show: function(v) {

                    return v.status == constant.payment().payment.STATUS_INIT_INT && v.type == constant.payment().advancePayment.TYPE_COLLECTION_INT && payment.pageConfig.pageBtn.contains("collectCode");
                },
                handle: function(v) {

                    com.focusPage("#" + payment.type + "collectCodeQrcodeModal").html("");
                    paymentUtils.initQrcode("collect", payment.type + "collectCodeQrcodeModal");
                    var atttype = v.paymentType == 2 ? constant.payment().paytran.ATTTYPE_MATERIAL_INT : constant.payment().paytran.ATTTYPE_DECORATION_INT;
                    paymentUtils.showQRCode("collectqrcode", "http://fanglin.vip/wx/wxpay?orderId=" + v.decoration.orderId + "&paymentType=0" + "&pid=" + v.pid + "&atttype=" + atttype, payment.type + "collectCodeQrcodeModal");
                }
            },
            alipayCollectCode: {
                name: "二维收款",
                clazz: "btn-info",
                show: function(v) {

                    return v.status == constant.payment().payment.STATUS_INIT_INT && v.type == constant.payment().advancePayment.TYPE_COLLECTION_INT && payment.pageConfig.pageBtn.contains("alipayCollectCode");
                },
                handle: function(v) {

                    var paytranId = 0;
                    var paytranMoney = v.recharge;
                    com.post(api.payment.queryPaytran, {
                        "paytran.pid": v.pid,
                        "paytran.type": 0,
                        "paytran.orderId": v.decoration.orderId
                    }, function(res) {

                        $.each(res.paytrans, function(i, pt) {

                            if (pt.status == constant.payment().paytran.STATUS_INIT_INT) {
                                paytranId = pt.ptid;
                                paytranMoney = pt.money;
                                return false;
                            }
                        });
                    }, null, false);
                    if (paytranMoney != v.recharge) {
                        com.showAlert(com.error, "金额不正确.");
                        return false;
                    }
                    com.post(api.payment.alipay, {
                        "wxpay.paymentOrderId": v.decoration.orderId,
                        "wxpay.paymentType": 0,
                        "wxpay.paymentAttrType": v.paymentType == 2 ? 1 : 0,
                        "wxpay.paymentMoney": paytranMoney,
                        "wxpay.userId": "alipay",
                        "wxpay.paymentid": v.pid,
                        "wxpay.paymentptid": paytranId,
                        "wxpay.unionId": v.decoration.customer.cid
                    }, function(data) {

                        payment.modals.alipayCodepayModal.html("");
                        com.popup("二维收款", data.wxpay.url + "&mchNo=" + data.wxpay.mchNo + "&bizId=" + data.wxpay.bizId + "&isShort=true", null, null, false);
                    }, null, false);
                }
            },
            codePush: {
                name: "微信推送",
                clazz: "btn-pink",
                show: function(v) {

                    return v.status == constant.payment().payment.STATUS_INIT_INT && v.type == constant.payment().advancePayment.TYPE_COLLECTION_INT && payment.pageConfig.pageBtn.contains("codePush");
                },
                handle: function(v) {

                    com.showConfirm("是否发送付款通知", function() {

                        com.post(api.payment.sendPayment, {
                            "payment.pid": v.pid
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

                    return v.status == constant.payment().payment.STATUS_INIT_INT && v.type == constant.payment().advancePayment.TYPE_COLLECTION_INT && payment.pageConfig.pageBtn.contains("check");
                },
                handle: function(v) {

                    com.showConfirm("是否验证收款信息?", function(result) {

                        com.post(api.payment.checkPaytran, {
                            "paytran.pid": v.pid,
                            "paytran.type": constant.payment().receipt.PAYMENTTYPE_ADVANCE_INT,
                            "paytran.atttype": v.paymentType == 2 ? constant.payment().paytran.ATTTYPE_MATERIAL_INT : constant.payment().paytran.ATTTYPE_DECORATION_INT
                        }, function(res) {

                            searcher.doSearch();
                            com.showAlert(com.info, "验证成功");
                        });
                    });
                }
            },
            kingdee: {
                name: "同步金蝶",
                clazz: "btn-yellow",
                show: function(v) {

                    return v.status == constant.payment().payment.STATUS_CONFIRMED_INT && payment.pageConfig.pageBtn.contains("toKingdee");
                },
                handle: function(v) {

                    kingdeeUtils.payment(v, payment.htmlName);
                }
            }
        };
    })();

    var buttons = (function() {

        var btnParams = [];
        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'createAdvance').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('创建账户').appendTo($adda);
        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);
        var $confirma = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($confirma);
        $('<span></span>').text('批量确认').appendTo($confirma);
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        $('<span></span>').text('导出').appendTo($impa);
        var $collecta = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'createPayment').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($collecta);
        $('<span></span>').text('生成预付款').appendTo($collecta);
        if (payment.pageConfig.pageBtn.contains("createAdvance"))
            btnParams.push($adda);
        if (payment.pageConfig.pageBtn.contains("selectall"))
            btnParams.push($checka);
        if (payment.pageConfig.pageBtn.contains("confirms"))
            btnParams.push($confirma);
        if (payment.pageConfig.pageBtn.contains("export"))
            btnParams.push($impa);
        if (payment.pageConfig.pageBtn.contains("createPayment"))
            btnParams.push($collecta);
        return btnParams;
    })();

    var searcher = new Searcher();

    var extraParams = {};
    if (payment.pageConfig.statusExtraParam != null && payment.pageConfig.statusExtraParam.length > 0) {
        extraParams["payment.status"] = payment.pageConfig.statusExtraParam[0];
    }

    if (payment.pageConfig.typeExtraParam != null && payment.pageConfig.typeExtraParam.length > 0) {
        extraParams["payment.type"] = payment.pageConfig.typeExtraParam[0];
    }

    if (payment.depage != null && payment.depage != "") {
        extraParams["payment.company"] = payment.depage;
    }

    searcher.set("condList", "pagenation", "resultList", payment.pageConfig.apiPage, extraParams, payment.pageConfig.condArr, "paymentPostData" + payment.type, null, false, buttons);
    searcher.line(function(v) {

        return v.decoration ? v.decoration.orderId : v.orderId;
    }, lineprops, linebtns).render();

    // 要在searcher后面
    paymentUtils.pushPosBank(payment.type == "check", payment.bankUtil, com.focusPage("#condList", "#paymentList"), payment.htmlName);

    function initCollect(decoration, res) {

        payment.items.historyDiv.hide();
        payment.items.advanceType.removeAttr("disabled");
        payment.items.des.removeAttr("disabled");

        payment.payment = decoration;

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": decoration.orderId
        }, function(res) {

            payment.decoration = res.decoration;

            if (!payment.profit)
                payment.decoration.bompany = null;
        }, null, false);

        // info信息是分页显示信息的, util是下拉框信息
        paymentUtils.getReceiptType(payment);

        payment.items.myModalLabel.text(decoration.paymentType + "信息");
        payment.items.paymentMethod.text(decoration.paymentType + "方式");
        payment.btns.collectBtn.text(decoration.paymentType);
        // payment.paymentTypes = v.paymentType;

        if (payment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(payment);
        if (payment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(payment, payment.typeUpdate);
        if (payment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(payment);

        com.selectTypeahead("cashInfo", payment.cashUtil, "key", "value", null); // 现金方式

        // 根据等级在数组中筛选出符合要求的用于显示
        getReceiptTypeForGrade(0, decoration.grade);

        payment.modals.collectModal.attr("grade", decoration.grade); // 刷卡&银行

        if (decoration.paymentType == "收款") {
            payment.items.balanceDiv.hide();
            payment.items.withdrawDiv.hide();
        } else {
            payment.items.balanceDiv.show();
            payment.items.withdrawDiv.show();
            payment.items.advanceType.on("change", function() {

                if ($(this).val() == 0) {
                    payment.items.balance.val(res.balanceAdvance);
                } else if ($(this).val() == 2) {
                    payment.items.balance.val(res.materialAdvance);
                }
            }).trigger("change");
        }

        payment.modals.collectModal.modal("show");

    }

    // 更新
    function initUpdate(v) {

        com.cleanItems(payment.items);

        payment.items.myModalLabel.text("更新款项信息");

        payment.items.historyDiv.show();

        payment.payment = v;

        payment.items.balanceDiv.hide();
        payment.items.withdrawDiv.hide();
        payment.items.advanceType.val(v.paymentType);
        payment.items.advanceType.attr("disabled", "disabled");
        payment.items.des.val(v.comment).attr("disabled", "disabled");

        if (payment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(payment);
        if (payment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(payment, 1);
        if (payment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(payment);

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": v.decoration.orderId
        }, function(res) {

            payment.decoration = res.decoration;
        }, null, false);

        paymentUtils.getReceiptType(payment);

        com.selectTypeahead("cashInfo", payment.cashUtil, "key", "value", null); // 现金方式

        getReceiptTypeForGrade(0, v.grade);

        // 历史收款信息
        paymentUtils.drawHistoryData(payment, payment.payment, payment.items.historyData, "update");

        payment.modals.collectModal.modal("show");
    }

    // 收款
    function collect() {

        if (com.validate("collectModal", "#decorationPayment")) {
            return false;
        }

        var url = "";
        var realPayment = 0;
        var options = {};
        var ptids = {};

        options["payment.customer.cid"] = payment.payment.customer.cid;
        options["payment.paymentType"] = payment.items.advanceType.val();
        options["payment.orderId"] = payment.payment.orderId;

        var decorationOrPayment = payment.payment;

        // 计算总额
        var cash = paymentUtils.paramCash(payment, "payment", options);

        realPayment = utils.accAdd(realPayment, parseFloat(cash));

        var bank = paymentUtils.paramBank(payment, payment.payment, "payment", options, payment.typeUpdate);

        if (bank < 0) {
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(bank));

        var checkv = paymentUtils.paramCheckv(payment, "payment", options);

        realPayment = utils.accAdd(realPayment, parseFloat(checkv));

        if ($.isEmptyObject(options)) {
            com.showAlert(com.warning, "无收款方式信息");
            return false;
        }

        options["payment.realMoney"] = realPayment;

        if (payment.typeUpdate == 0) {

            if (parseFloat(realPayment) <= 0) {
                com.showAlert(com.warning, "收款金额需要大于零!");
                return false;
            }

            url = api.payment.collectPayment;

            options["payment.type"] = 1; // 收款
            options["payment.comment"] = payment.items.des.val().trim();
            options["payment.uniqueid"] = new Date().getTime();

            $.extend(options, {}, ptids);

        } else if (payment.typeUpdate == 1) {

            var balance = payment.items.balance.val(); // 余额
            var withdraw = payment.items.withdraw.val(); // 提现余额

            if (parseFloat(withdraw) <= 0) {
                com.showAlert(com.warning, "提款金额需要大于零!");
                return false;
            }

            if (parseFloat(balance) < parseFloat(withdraw)) {
                com.showAlert(com.warning, "提款金额不能大于余额!");
                return false;
            }

            if (parseFloat(realPayment) != parseFloat(withdraw)) {
                com.showAlert(com.warning, "当前提款项总数与提款金额不等,请核实再进行提交!");
                return false;
            }

            url = api.payment.withdrawPayment;
            options["payment.type"] = 0;
            options["payment.comment"] = payment.items.des.val().trim();
            options["payment.uniqueid"] = new Date().getTime();

        } else if (payment.typeUpdate == 2) {
            var historyRealPayment = utils.accAdd(utils.accAdd(decorationOrPayment.cash, decorationOrPayment.bank), decorationOrPayment.checkv);

            if (parseFloat(realPayment) != parseFloat(historyRealPayment)) {
                com.showAlert(com.warning, "当前更新款项金额与原收款金额不等,请核实再进行提交!");
                return false;
            }

            url = api.payment.updatePayment;
            options["payment.pid"] = decorationOrPayment.pid;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
            payment.modals.collectModal.modal("hide");

            if (decorationOrPayment.paymentType && decorationOrPayment.paymentType == "收款") {
                com.showConfirm("是否需要打印当前收款对应的收据信息?", function(result) {

                    params.payment.pid = res.payment.pid;
                    params.payment.orderId = res.payment.orderId;
                    params.payment.cid = res.payment.customer.cid;
                    com.popup("专用收款收据__装修单号:" + res.payment.orderId, api.index.paymentReceiptIndex.url, function() {

                        parent.layer.getFrameIndex(window.name);
                    }, null, true)
                });
            }
        });

    }

    // 创建预付款账户
    com.focusPage('a[name="createAdvance"]', '#pagenation').click(function() {

        com.cleanItems(payment.createItems);
        payment.modals.createModal.modal("show");
    });

    // 生成预付款
    com.focusPage('a[name="createPayment"]', '#pagenation').click(function() {

        com.cleanItems(payment.createCollectPaymentItems);
        payment.modals.createCollectPaymentModal.modal("show");
    });

    // 全选
    com.focusPage('a[name="checks"]', '#pagenation').click(function() {

        paymentUtils.checkAll();
    });

    // 批量确认
    com.focusPage('a[name="confirms"]', '#pagenation').click(function() {

        var options = {};
        var $inputs = com.focusPage('input[name="pids"]:checked');
        var kingdeePayments = [];

        $.each($inputs, function(i, v) {

            options["paymentIds[" + i + "]"] = $(v).attr('pid');

            var kingdeePayment = {
                "paymentType": $(v).attr('paymentType'),
                "arId": $(v).attr('arid'),
                "type": $(v).attr('collecttype'),
                "comment": $(v).attr('comment'),
                "cash": $(v).attr('cash'),
                "cashInfo": $(v).attr('cashinfo'),
                "bank": $(v).attr('bank'),
                "bankInfo": $(v).attr('bankinfo'),
                "checkv": $(v).attr('checkv'),
                "checkvBank": $(v).attr('checkvbank'),
                "collectTime": $(v).attr('collecttime'),
                "decoration": {
                    "customer": {
                        "cid": $(v).attr('customerid')
                    },
                    "orderId": $(v).attr('orderid'),
                    "grade": $(v).attr('grade'),
                    "house": {
                        "village": {
                            "name": $(v).attr('villagename')
                        },
                        "houseNumber": $(v).attr('housenumber')
                    }
                }
            };

            kingdeePayments.push(kingdeePayment);
        });

        if ($inputs.length == 0) {
            com.showAlert(com.warning, "当前未选择要确认的预付款项信息");
            return false;
        }

        com.showConfirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {

            com.post(api.payment.confirmPayment, options, function(res) {

                searcher.doSearch();

                // 同步金蝶
                // $.each(kingdeePayments, function(i, v){
                // kingdeeUtils.payment(v, payment.htmlName);
                // });

                com.showAlert(com.info, "确认成功");
            });
        });
    });

    // 导出
    com.focusPage('a[name="import"]', '#pagenation').click(function() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.payment.pagePayment, $.extend({}, params["paymentPostData" + payment.type], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["装修单号", "decoration.orderId"], ['收款类型', 'type'], ['预付款类型', 'paymentType'], ['操作金额', 'recharge'], ['收款人', 'collectUser.currentName'], ['收款时间', 'collectTime'], ['状态', 'status'], ['备注', 'comment'], ['现金', 'cash'], ['刷卡', ['bank', 'bankInfo']], ['银行', ['checkv', 'checkvBank']], ['分期', ['installment', 'installmentBank']], ['对公', ['accounts', 'accountsBank']], ['预付款转换', 'transfer']],
                list: res.paging.data
            }, function(v) {

                v.collectUser = v.collectUser == null ? {
                    "collectUser": ""
                } : v.collectUser;
                if (v.bank != null && v.bank != 0) {
                    v.bankInfo = paymentUtils.splitBankInfo('', v.bankInfo, payment.bankInfo, true);
                }

                if (v.checkv != null && v.checkv != 0) {
                    var checkvInfoStr = v.checkvBank;
                    if (checkvInfoStr.indexOf("#") != -1) {
                        v.checkvBank = paymentUtils.splitBankInfo('', v.checkvBank, payment.checkvInfo, true);
                    } else {
                        v.checkvBank = v.checkv != null && v.checkv != "0" ? payment.checkvInfo[v.checkvBank] : '';
                    }
                }

                v.installmentBank = v.installment != null && v.installment != "0" ? payment.bankInfo[v.installmentBank] : '';
                v.accountsBank = v.accounts != null && v.accounts != "0" ? payment.accountsInfo[v.accountsBank] : '';
                v.type = v.type != null ? payment.typeData[v.type] : v.type;
                v.paymentType = v.paymentType != null ? payment.paymentTypeData[v.paymentType] : v.paymentType;
                v.status = v.status != null ? payment.statusData[v.status] : v.status;
            });
        });
    });

    function getReceiptTypeForGrade(paymentType, decorationGrade) {

        var gradeParam;

        if (decorationGrade == "allGrade") {
            payment.bankGrade = payment.bankUtil;
            payment.checkvGrade = payment.checkvUtil;
        } else {
            if (paymentType == constant.payment().advancePayment.PAYMENTTYPE_BALANCE_INT) {
                if (decorationGrade == "A" || decorationGrade == "C") {
                    gradeParam = "A";
                } else {
                    gradeParam = "";
                }
            } else if (paymentType == constant.payment().advancePayment.PAYMENTTYPE_MATERIAL_INT) {
                if (decorationGrade == "C") {
                    gradeParam = "B";
                } else {
                    gradeParam = "";
                }
            }

            paymentUtils.initBankGrade(payment, gradeParam);
        }
    }
});
