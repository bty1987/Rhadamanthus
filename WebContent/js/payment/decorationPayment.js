jQuery(function($) {

    var decorationPayment = {

        paymentId: null,
        htmlName: "",

        type: params['urlLoadParams'].paytype,
        profit: params['urlLoadParams'].profit,

        paytypes: [],
        paymentStatusArray: constant.payment().decorationPayment.paymentStatus.keys,

        payment: null,

        items: {
            cashCheckbox: com.focusPage("#cashCheckbox", "#decorationPayment"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#decorationPayment"),
            checkvCheckbox: com.focusPage("#checkvCheckbox", "#decorationPayment"),
            advanceCheckbox: com.focusPage("#advanceCheckbox", "#decorationPayment"),
            couponCheckbox: com.focusPage("#couponCheckbox", "#decorationPayment"),

            historyDiv: com.focusPage("#historyDiv", "#decorationPayment"),
            historyData: com.focusPage("#historyData", "#decorationPayment"),
            cashDiv: com.focusPage("#cashDiv", "#decorationPayment"),
            checkvDiv: com.focusPage("#checkvDiv", "#decorationPayment"),
            advanceDiv: com.focusPage("#advanceDiv", "#decorationPayment"),

            refundMoney: com.focusPage("#refundMoney", "#decorationPayment"),
            comment: com.focusPage("#comment", "#decorationPayment"),

            cash: com.focusPage("#cash", "#decorationPayment"),
            cashInfo: com.focusPage("#cashInfo", "#decorationPayment"),

            bankName: com.focusPage("#bankName", "#decorationPayment"),
            bank: com.focusPage("#bank", "#decorationPayment"),
            posway: com.focusPage("#posway", "#decorationPayment"),

            recharge: com.focusPage("#recharge", "#decorationPayment"),
            advance: com.focusPage("#advance", "#decorationPayment"),
            advanceType: com.focusPage("#advanceType", "#decorationPayment"),

            couponType: com.focusPage("#couponType", "#decorationPayment"),
            couponVal: com.focusPage("#couponVal", "#decorationPayment"),

            posDiv: com.focusPage("#posDiv", "#decorationPayment"),
            posGroup: com.focusPage("#posGroup", "#decorationPayment"),
            bankDiv: com.focusPage("#bankDiv", "#decorationPayment"),
            bankGroup: com.focusPage("#bankGroup", "#decorationPayment"),
            checkvGroup: com.focusPage("#checkvGroup", "#decorationPayment"),
            couponDiv: com.focusPage("#couponDiv", "#decorationPayment"),
            couponInputs: com.focusPage("#couponInputs", "#decorationPayment"),
            couponGroup: com.focusPage("#couponGroup", "#decorationPayment"),
            withholdGroup: com.focusPage("#withholdGroup", "#decorationPayment"),

            referMoney: com.focusPage("#referMoney", "#decorationPayment"),
            changeReason: com.focusPage("#changeReason", "#decorationPayment")
        },

        withholdItems: {
            user: com.focusPage("#user", "#decorationPayment"),
            money: com.focusPage("#money", "#decorationPayment"),
            comment: com.focusPage("#remark", "#decorationPayment")
        },

        btns: {
            collectBtn: com.focusPage("#collectBtn", "#decorationPayment"),
            refundBtn: com.focusPage("#refundBtn", "#decorationPayment"),
            approveBtn: com.focusPage("#approveBtn", "#decorationPayment"),

            checkvAdd: com.focusPage("#checkvAdd", "#decorationPayment"),
            couponAdd: com.focusPage("#couponAdd", "#decorationPayment"),
            createPaytran: com.focusPage("#createPaytran", "#decorationPayment"),
            withhold: com.focusPage("#withhold", "#decorationPayment")
        },

        modals: {
            approveModal: com.focusPage("#approveModal", "#decorationPayment"),
            collectModal: com.focusPage("#collectModal", "#decorationPayment"),
            addReduceModal: com.focusPage("#addReduceModal", "#decorationPayment"),
            withholdModal: com.focusPage("#withholdModal", "#decorationPayment"),
            codepayModal: com.focusPage("#decorationCodeQrcodeModal"),
            alipayCodepayModal: com.focusPage("#decorationAlipayCodeQrcodeModal")
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
        addReduceItemType: constant.quotation().addReduceItem.type.keys,

        withholdType: [],

        conditions: [],
        extraParams: {},
        functions: [],
        pageConfig: {},
        typeNo: 1,
        atttype: 0,
        isAffirms: constant.payment.decorationPayment.isAffirm.keys,
        decoration: {}
    };

    // 隐藏触发
    decorationPayment.modals.collectModal.on('hide.bs.modal', function() {

        decorationPayment.bankGrade = [];
        decorationPayment.checkvGrade = [];

        decorationPayment.items.posGroup.html("");
        decorationPayment.items.bankGroup.removeClass('hide');
        decorationPayment.items.checkvGroup.html("");
        decorationPayment.items.couponGroup.html("");
        decorationPayment.items.historyData.html("");

        decorationPayment.items.bankName.removeClass("v_required v_typeahead");
        decorationPayment.items.bank.removeClass("v_required v_float_3");

        decorationPayment.payment = null;

        com.closeTip();
    });

    decorationPayment.modals.approveModal.on('hide.bs.modal', function() {

        com.closeTip();
    });

    decorationPayment.modals.withholdModal.on('hide.bs.modal', function() {

        com.closeTip();
        com.cleanItems(decorationPayment.withholdItems);
        decorationPayment.items.withholdGroup.html("");

        decorationPayment.payment = null;
    });

    decorationPayment.items.posway.bindData(constant.payment().receiptType.posway.datas, "key", "value");

    com.post(api.ds.salary, {}, function(res) {

        $.each(res.withholdType, function(i, v) {

            decorationPayment.withholdType[v.key] = v.value;
        });
    }, null, false);

    com.focusPage("#collectModal :checkbox", "#decorationPayment").on("change", function() {

        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#decorationPayment");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    // 绑定收款单位的基础信息
    paymentUtils.getReceiptType(decorationPayment);

    // 转账方式(银行)
    decorationPayment.btns.checkvAdd.click(function() {

        paymentUtils.addBank(decorationPayment);
        return false;
    });

    decorationPayment.items.advanceType.bindData([{
        "key": "1",
        "value": "合同"
    }], 'key', 'value');

    decorationPayment.btns.collectBtn.bindClick(collect, 3000);

    decorationPayment.btns.refundBtn.bindClick(collect, 3000);

    decorationPayment.btns.createPaytran.unbind().click(function() {

        paymentUtils.pushPos(decorationPayment, decorationPayment.payment.decoration.orderId);
        return false;
    });

    decorationPayment.btns.couponAdd.unbind().click(function() {

        if (com.validate("couponInputs", "#decorationPayment"))
            return false;

        paymentUtils.addCounpon();
    });

    // 不同页面的不同参数
    decorationPayment.pageConfig = paymentUtils.getConfig(decorationPayment.type, 2);

    // 扣款人
    com.initTypeahead('user', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'userBases', 'uid', 'currentName', null);

    function decorationCollectName(v) {

        if (v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && v.twoType == constant.payment().decorationPayment.TWOTYPE_ADD_REDUCE_INT)
            return "增项款";
        if (v.oneType == constant.payment().decorationPayment.ONETYPE_REFUND_INT && v.twoType == constant.payment().decorationPayment.TWOTYPE_ADD_REDUCE_INT)
            return "减项款";
        return v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT ? "收款" : "退款";
    }
    function posPushDecorationPaymentLine(v) {

        var bankVal = com.typeahead(decorationPayment.htmlName + "paytranBankName");
        var bankDiv = com.focusPage("#" + decorationPayment.htmlName + "paytranBankName");
        if (bankVal == "" || bankDiv.val() == "") {
            com.showAlert(com.warning, "请使用匹配数据.");
            return false;
        }
        com.post(api.payment.addPaytran, {
            "paytran.orderId": v.decoration.orderId,
            "paytran.pid": v.dpid,
            "paytran.type": constant.payment().receipt.PAYMENTTYPE_DECORATION_INT,
            "paytran.atttype": constant.payment().paytran.ATTTYPE_DECORATION_INT,
            "paytran.no": com.typeahead(bankDiv),
            "paytran.sn": decorationPayment.posValues[bankVal].value,
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
    function codepayDecorationPaymentLine(v) {

        com.post(api.payment.codepay, {
            "paytran.orderId": v.decoration.orderId,
            "paytran.pid": v.dpid,
            "paytran.type": constant.payment().receipt.PAYMENTTYPE_DECORATION_INT,
            "paytran.atttype": constant.payment().paytran.ATTTYPE_DECORATION_INT,
            "paytran.money": v.referMoney,
            "paytran.way": 3
        }, function(res) {

            decorationPayment.modals.codepayModal.html("");
            paymentUtils.initQrcode("decorationPayment", "decorationCodeQrcodeModal");
            paymentUtils.showQRCode("decorationPaymentqrcode", res.paytran.rstcode, "decorationCodeQrcodeModal");
        });
    }
    function codeDecorationPaymentLine(v) {

        decorationPayment.modals.codepayModal.html("");
        paymentUtils.initQrcode("decorationPayment", "decorationCodeQrcodeModal");
        paymentUtils.showQRCode("decorationPaymentqrcode", "http://fanglin.vip/wx/wxpay?orderId=" + v.decoration.orderId + "&paymentType=1" + "&pid=" + v.dpid + "&atttype=0", "decorationCodeQrcodeModal");
    }
    function alipayDecorationPaymentLine(v) {

        var paytranId = 0;
        var paytranMoney = v.referMoney;
        com.post(api.payment.queryPaytran, {
            "paytran.pid": v.dpid,
            "paytran.type": 1,
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
        if (paytranMoney != v.referMoney) {
            com.showAlert(com.error, "金额不正确.");
            return false;
        }
        com.post(api.payment.alipay, {
            "wxpay.paymentOrderId": v.decoration.orderId,
            "wxpay.paymentType": 1,
            "wxpay.paymentAttrType": 0,
            "wxpay.paymentMoney": paytranMoney,
            "wxpay.userId": "alipay",
            "wxpay.paymentid": v.dpid,
            "wxpay.paymentptid": paytranId,
            "wxpay.unionId": v.decoration.customer.cid
        }, function(data) {

            decorationPayment.modals.alipayCodepayModal.html("");
            com.popup("二维收款", data.wxpay.url + "&mchNo=" + data.wxpay.mchNo + "&bizId=" + data.wxpay.bizId + "&isShort=true", null, null, false);
        }, null, false);
    }
    var lineprops = (function() {

        var lineprops = [{
            type: "checkbox",
            name: "dpIds",
            clazz: "ace ace-checkbox-2",
            value: function(v) {

                return v.arId;
            },
            show: function() {

                return decorationPayment.pageConfig.pageBtn.contains("selectall");
            },
            attrs: function(v) {

                return {
                    "dpId": v.dpid
                };
            }
        }]
            .concat(paymentUtils.getPropertyLineprops(decorationPayment, decorationPayment.paymentStatusArray));

        if (decorationPayment.pageConfig.pageBtn.contains("payway")) {
            lineprops.push({
                field: "payway",
                name: "收款方式",
                type: "custom",
                prop: function(v) {

                    return paymentUtils.getHistoryText(decorationPayment, v);
                },
                render: function($liLine, v) {

                    paymentUtils.drawHistoryData(decorationPayment, v, $liLine, "");
                }
            });
        }

        return lineprops;
    })();

    var linebtns = (function() {

        return {
            addreduce: {
                name: "增减明细",
                clazz: "btn-yellow hide",
                show: function(v) {

                    return v.twoType == constant.payment().decorationPayment.TWOTYPE_ADD_REDUCE_INT && decorationPayment.pageConfig.pageBtn.contains("addreduce");
                },
                handle: function(v) {

                    addReduceDetail(v.dpid, v.decoration.orderId);
                }
            },
            posPush: {
                name: "推送",
                clazz: "btn-danger",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("posPush");
                },
                handle: posPushDecorationPaymentLine
            },
            codepay: {
                name: "POS扫码",
                clazz: "btn-inverse",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("posPush");
                },
                handle: codepayDecorationPaymentLine
            },
            collect: {
                name: decorationCollectName,
                clazz: function(v) {

                    return v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT ? "btn-info" : "btn-danger";
                },
                show: function() {

                    return decorationPayment.pageConfig.pageBtn.contains("collect");
                },
                handle: function(v) {

                    decorationPayment.typeUpdate = 1;
                    if (v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT)
                        paymentUtils.showPos(decorationPayment, {
                            "paytran.orderId": v.decoration.orderId,
                            "paytran.atttype": decorationPayment.atttype
                        }, [0, 1]);
                    initCollect(v);
                }
            },
            settle: {
                name: "落款",
                clazz: "btn-primary",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("settle");
                },
                handle: function(v) {

                    com.showConfirm("是否确认落款, 落款将直接使用预付款余额抵扣：" + v.referMoney + "元", function() {

                        com.post(api.payment.settleDecorationPayment, {
                            "decorationPayment.dpid": v.dpid,
                            "decorationPayment.advanceType": 1,
                            "decorationPayment.decoration.orderId": v.decoration.orderId,
                            "decorationPayment.comment": ""
                        }, function(res) {

                            com.showAlert(com.info, "落款成功, 请打印收据。");
                            searcher.doSearch();
                        });
                    });
                }
            },
            withdraw: {
                name: "撤款",
                clazz: "btn-warning",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_CONFIRM_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("withdraw");
                },
                handle: function(v) {

                    com.showConfirm("是否确认撤款, 撤款将退回预付款余额：" + v.referMoney + "元", function() {

                        com.post(api.payment.withdrawDecorationPayment, {
                            "decorationPayment.dpid": v.dpid,
                            "decorationPayment.decoration.orderId": v.decoration.orderId
                        }, function(res) {

                            com.showAlert(com.info, "撤款成功。");
                            searcher.doSearch();
                        });
                    });
                }
            },
            print: {
                name: "打印",
                clazz: "btn-info",
                show: function(v) {

                    return v.paymentStatus != constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT && decorationPayment.pageConfig.pageBtn.contains("print");
                },
                handle: function(v) {

                    params.payment.orderId = v.decoration.orderId;
                    params.payment.drId = v.drId;
                    params.payment.cid = v.decoration.customer.cid;
                    com.popup("专用收款收据__装修单号:" + v.decoration.orderId, api.index.decorationPaymentReceiptIndex.url, function() {

                        parent.layer.getFrameIndex(window.name);
                    }, null, true);
                }
            },
            update: {
                name: "更新",
                clazz: "btn-success",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_PAY_INT && decorationPayment.pageConfig.pageBtn.contains("update");
                },
                handle: function(v) {

                    decorationPayment.payment = v;
                    initUpdate(v);
                }
            },
            refund: {
                name: "退款",
                clazz: "btn-danger",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_CONFIRM_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && v.twoType != constant.payment().decorationPayment.TWOTYPE_ADD_REDUCE_INT && decorationPayment.pageConfig.pageBtn.contains("refund");
                },
                handle: function(v) {

                    com.cleanItems(decorationPayment.items);
                    decorationPayment.paymentId = v.dpid;
                    approvalUtils.initqueryApprovalUser("approver", 5);
                    decorationPayment.items.refundMoney.val(v.referMoney);
                    decorationPayment.modals.approveModal.modal("show");
                }
            },
            withhold: {
                name: "扣款",
                clazz: "btn-danger",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_CONFIRM_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("withhold");
                },
                handle: function(v) {

                    decorationPayment.payment = v;
                    com.post(api.salary.queryWithhold, {
                        "withhold.ident": v.dpid,
                        "withhold.type": 1
                    }, function(res) {

                        $.each(res.withholds, function(i, withhold) {

                            drawWithholdRecord(withhold);
                        });
                        decorationPayment.modals.withholdModal.modal("show");
                    });
                }
            },
            collectCode: {
                name: "收款码",
                clazz: "btn-success",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("collectCode");
                },
                handle: codeDecorationPaymentLine
            },
            alipayCollectCode: {
                name: "二维收款",
                clazz: "btn-info",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("alipayCollectCode");
                },
                handle: alipayDecorationPaymentLine
            },
            codePush: {
                name: "微信推送",
                clazz: "btn-pink",
                show: function(v) {

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("codePush");
                },
                handle: function(v) {

                    com.showConfirm("是否发送付款通知", function() {

                        com.post(api.payment.sendDecorationPayment, {
                            "decorationPayment.dpid": v.dpid
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

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT && v.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && decorationPayment.pageConfig.pageBtn.contains("check");
                },
                handle: function(v) {

                    com.showConfirm("是否验证收款信息?", function(result) {

                        com.post(api.payment.checkPaytran, {
                            "paytran.pid": v.dpid,
                            "paytran.type": constant.payment().receipt.PAYMENTTYPE_DECORATION_INT,
                            "paytran.atttype": constant.payment().paytran.ATTTYPE_DECORATION_INT
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

                    return v.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_CONFIRM_INT && decorationPayment.pageConfig.pageBtn.contains("toKingdee");
                },
                handle: function(v) {

                    kingdeeUtils.payment(v, decorationPayment.htmlName);
                }
            },
            customerPush: {
                name: "客户推送",
                clazz: "btn-warning",
                show: function(v) {

                    return v.isAffirm == constant.payment().decorationPayment.ISAFFIRM_INIT_SHORT && decorationPayment.pageConfig.pageBtn.contains("customerPush");
                },
                handle: function(v) {

                    com.showConfirm("是否推送给客户", function() {

                        com.post(api.payment.pushDecorationPayment, {
                            "decorationPayment.dpid": v.dpid
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
        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        $('<span></span>').text('批量确认').appendTo($adda);
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        $('<span></span>').text('导出').appendTo($impa);
        if (decorationPayment.pageConfig.pageBtn.contains("selectall"))
            btnParams.push($checka);
        if (decorationPayment.pageConfig.pageBtn.contains("confirms"))
            btnParams.push($adda);
        if (decorationPayment.pageConfig.pageBtn.contains("export"))
            btnParams.push($impa);
        return btnParams;
    })();

    var searcher = new Searcher();

    var extraParams = {};
    if (decorationPayment.pageConfig.statusExtraParam != null && decorationPayment.pageConfig.statusExtraParam.length > 0) {
        extraParams["decorationPayment.paymentStatus"] = decorationPayment.pageConfig.statusExtraParam[0];
    }

    if (decorationPayment.pageConfig.typeExtraParam != null && decorationPayment.pageConfig.typeExtraParam.length > 0) {
        extraParams["decorationPayment.oneType"] = decorationPayment.pageConfig.typeExtraParam[0];
    }

    searcher.set("condList", "pagenation", "resultList", decorationPayment.pageConfig.apiPage, extraParams, decorationPayment.pageConfig.condArr, "decorationPaymentPostData" + decorationPayment.type, null, false, buttons);
    searcher.line("paymentType", lineprops, linebtns).render();

    // 要在searcher后面
    paymentUtils.pushPosBank(decorationPayment.type == "common", decorationPayment.bankUtil, com.focusPage("#condList", "#decorationPaymentList"), decorationPayment.htmlName);

    // 退款审批
    decorationPayment.btns.approveBtn.on('click', function() {

        if (com.validate("approveModal", "#decorationPayment")) {
            return false;
        }

        var receiverId = com.focusPage("#approver", "#decorationPayment").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return false;
        }

        var options = {
            "approval.receiver.userId": receiverId,
            "approval.comment": decorationPayment.items.changeReason.val(),
            "approvalDecorationRefund.paymentId": decorationPayment.paymentId
        };

        com.showConfirm("确认要提交退款申请吗?", function(res) {

            com.post(api.approval.submitApprovalForDecorationRefund, options, function(res) {

                com.showAlert(com.info, "提交成功");
                searcher.doSearch();
            });

            decorationPayment.modals.approveModal.modal("hide");
        });
    });

    // 增减项详细信息
    function addReduceDetail(decorationPaymentId, orderId) {

        com.cleanItems(decorationPayment.items);

        var options = {
            "quotation.orderId": orderId,
            "addReduce.dpId": decorationPaymentId
        };

        com.post(api.quotation.queryAddReduceByDecorationPaymentId, options, function(res) {

            var quotationItemSeacher = new Searcher();

            quotationItemSeacher.init([], "acondList", api.quotation.queryAddReduceItemByAddReduceId, function(data) {

                var $tableWrap = com.focusPage('#aresultList').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($tableWrap);

                if (data && data.length) {
                    $.each(data, function(i, v) {

                        createAddReduceItem(v).appendTo($ul);
                    });
                }
            }, "pagenation", "", {
                "addReduce.arId": res.addReduce.arId
            }, true, "addReduceItems", null, 'aresultList');
        });

        decorationPayment.modals.addReduceModal.modal("show");
    }

    function createAddReduceItem(v) {

        var $liLine = $('<li></li>').addClass('item-blue clearfix');
        var $h3 = $('<h3></h3>').addClass('oid');
        var $label = $('<label></label>');
        var $span = $('<span></span>').addClass('lbl');
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

        var propertyArr = [["单位:", v.measurementUnit, "grey"], ["单价:", v.unitPrice, "grey"], ["工程量:", v.num, "grey"], ["类型:", decorationPayment.addReduceItemType[v.type], "grey"]];

        $.each(propertyArr, function(index, value) {

            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $label.append($span).appendTo($h3);
        $h3.append($('<small></small>').addClass('blue').html(v.itemName));
        $liLine.append($h3).append($ulProperty);

        return $liLine;
    }

    // 扣款
    decorationPayment.btns.withhold.click(function() {

        if (com.validate("withholdModal"))
            return false;

        var options = {
            "withhold.orderId": decorationPayment.payment.decoration.orderId,
            "withhold.ident": decorationPayment.payment.dpid,
            "withhold.type": 1,
            "withhold.user.uid": com.typeahead("user"),
            "withhold.money": decorationPayment.withholdItems.money.val(),
            "withhold.comment": decorationPayment.withholdItems.comment.val()
        };

        com.post(api.salary.addWithhold, options, function(res) {

            res.withhold.money = decorationPayment.withholdItems.money.val();
            res.withhold.user.currentName = decorationPayment.withholdItems.user.val();
            res.withhold.createTime = res.withhold.operateTime = com.currentTime();
            res.withhold.operater = {
                "currentName": params.userInfo.user.currentName
            };

            drawWithholdRecord(res.withhold);

            com.cleanItems(decorationPayment.withholdItems);

        });
    });

    // 画扣款记录
    function drawWithholdRecord(withhold) {

        var $liLine = $('<li></li>').addClass('item-orange clearfix ').css({
            "list-style": "none"
        });
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

        var optionArr = [["扣款人:", withhold.user.currentName, "grey"], ["扣款类型:", decorationPayment.withholdType[withhold.type], "red"], ["装修单号:", withhold.orderId, "blue"], ["扣款金额:", withhold.money, "blue"], ["创建时间:", withhold.createTime, "green"], ["操作人:", withhold.operater.currentName, "grey"], ["操作时间:", withhold.operateTime, "green"], ["扣款说明:", withhold.comment, "grey"]];

        $.each(optionArr, function(index, value) {

            var $Lics = $('<li></li>').css("margin", "5px 0");
            $('<strong></strong>').html(value[0]).appendTo($Lics);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($Lics);
            $Lics.appendTo($ulProperty);
        });

        $liLine.append($ulProperty).appendTo(decorationPayment.items.withholdGroup);
    }

    // 装修款初始化模态框
    function initCollect(payment) {

        com.cleanItems(decorationPayment.items);

        decorationPayment.items.historyDiv.hide();

        decorationPayment.payment = payment;

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": payment.decoration.orderId
        }, function(res) {

            decorationPayment.decoration = res.decoration;

            if (!decorationPayment.profit)
                decorationPayment.decoration.bompany = null;
        }, null, false);

        // 绑定收款单位的基础信息
        paymentUtils.getReceiptType(decorationPayment);

        decorationPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
        decorationPayment.items.comment.removeAttr("disabled");

        var type = payment.oneType == constant.payment().decorationPayment.ONETYPE_REFUND_INT ? constant.payment().decorationPayment.ONETYPE_REFUND_INT : constant.payment().decorationPayment.ONETYPE_ADD_INT; // 0: 收款类型 , 1: 退款类型

        if (decorationPayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(decorationPayment);
        if (decorationPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(decorationPayment, type);
        if (decorationPayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(decorationPayment);
        if (decorationPayment.pageConfig.paytypes.contains("advance"))
            paymentUtils.initAdvance(decorationPayment, type, {
                "advancePayment.decoration.orderId": payment.decoration.orderId
            }, "balanceAdvance");
        if (decorationPayment.pageConfig.paytypes.contains("coupon"))
            paymentUtils.initCoupon(decorationPayment, 0);

        // 现金方式
        com.selectTypeahead("cashInfo", decorationPayment.cashUtil, "key", "value", null);

        // 优惠券方式
        com.selectTypeahead("couponType", decorationPayment.couponType, 'no', 'name');

        // 根据装修单等级获取收据类型等级
        var grade = ["A", "C"].contains(payment.decoration.grade) ? "A" : "";

        // 根据等级在数组中筛选出符合要求的用于显示 刷卡&银行
        paymentUtils.initBankGrade(decorationPayment, grade);

        if (type == constant.payment().decorationPayment.ONETYPE_REFUND_INT) {// 退款

            com.focusPage("#myModalPayLabel").text("退款信息");

            decorationPayment.btns.collectBtn.addClass("hide");
            decorationPayment.btns.refundBtn.removeClass("hide");
        } else {

            com.focusPage("#myModalPayLabel").text("付款信息");

            decorationPayment.btns.collectBtn.removeClass("hide");
            decorationPayment.btns.refundBtn.addClass("hide");
        }

        decorationPayment.modals.collectModal.modal("show");
    }

    // 装修款更新
    function initUpdate(payment) {

        com.cleanItems(decorationPayment.items);

        decorationPayment.items.historyDiv.show();

        decorationPayment.payment = payment;

        decorationPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
        decorationPayment.items.comment.val(payment.collectDes).removeAttr("disabled");

        if (decorationPayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(decorationPayment);
        if (decorationPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(decorationPayment, 1);
        if (decorationPayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(decorationPayment);
        if (decorationPayment.pageConfig.paytypes.contains("advance"))
            paymentUtils.initAdvance(decorationPayment, 2, {
                "advancePayment.decoration.orderId": payment.decoration.orderId
            }, "balanceAdvance");
        if (decorationPayment.pageConfig.paytypes.contains("coupon"))
            paymentUtils.initCoupon(decorationPayment, 1);

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": payment.decoration.orderId
        }, function(res) {

            decorationPayment.decoration = res.decoration;
        }, null, false);

        // 绑定收款单位的基础信息
        paymentUtils.getReceiptType(decorationPayment);

        // 现金方式
        com.selectTypeahead("cashInfo", decorationPayment.cashUtil, "key", "value", null);

        // 优惠券方式
        com.selectTypeahead("couponType", decorationPayment.couponType, 'no', 'name');

        var grade = ["A", "C"].contains(payment.decoration.grade) ? "A" : "";

        paymentUtils.initBankGrade(decorationPayment, grade);

        // 历史收款信息
        paymentUtils.drawHistoryData(decorationPayment, payment, decorationPayment.items.historyData, "update");

        decorationPayment.btns.refundBtn.addClass("hide");

        decorationPayment.modals.collectModal.modal("show");
    }

    // 装修款收款
    function collect() {

        if (com.validate("collectModal", "#decorationPayment")) {
            return false;
        }

        var url = "";
        var options = {};

        var realPayment = 0;
        var referPayment = decorationPayment.items.referMoney.val();
        var comment = decorationPayment.items.comment.val();
        var type = 0;

        var payment = decorationPayment.payment;

        if (payment.oneType == constant.payment().decorationPayment.ONETYPE_ADD_INT && payment.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT) {
            url = api.payment.collectDecorationPayment;
            options["decorationPayment.comment"] = comment;
        } else if (payment.oneType == constant.payment().decorationPayment.ONETYPE_REFUND_INT && payment.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_UNPAY_INT) {
            url = api.payment.refundDecorationPayment;
            options["decorationPayment.comment"] = comment;
            type = 1;
        } else if (payment.oneType != constant.payment().decorationPayment.ONETYPE_HISTORY_INT && payment.paymentStatus == constant.payment().decorationPayment.PAYMENTSTATUS_PAY_INT) {
            url = api.payment.updateDecorationPayment;
            type = 2;
        }

        var cash = paymentUtils.paramCash(decorationPayment, "decorationPayment", options);

        realPayment = utils.accAdd(realPayment, parseFloat(cash));

        var bank = paymentUtils.paramBank(decorationPayment, decorationPayment.payment, "decorationPayment", options, type);

        if (bank < 0) {
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(bank));

        var checkv = paymentUtils.paramCheckv(decorationPayment, "decorationPayment", options);

        realPayment = utils.accAdd(realPayment, parseFloat(checkv));

        var advance = paymentUtils.paramAdvance(decorationPayment, decorationPayment.payment, "decorationPayment", options, "advance", type);

        if (advance < 0) {
            com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(advance));

        var coupon = paymentUtils.paramCoupon(decorationPayment, decorationPayment.payment, "decorationPayment", options, type);

        realPayment = utils.accAdd(realPayment, parseFloat(coupon));

        if (referPayment != realPayment) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if ($.isEmptyObject(options)) {
            com.showAlert(com.warning, "无收款方式信息");
            return false;
        }

        var orderId = payment.decoration.orderId;

        options["decorationPayment.dpid"] = payment.dpid;

        com.post(url, options, function(res) {

            searcher.doSearch();
            decorationPayment.modals.collectModal.modal("hide");

            var drId = res.decorationPayment.drId;

            if (decorationPayment.typeUpdate == 1) {
                com.showConfirm("是否需要打印当前收款对应的收据信息?", function(result) {

                    params.payment.orderId = orderId;
                    params.payment.drId = drId;
                    params.payment.cid = payment.decoration.customer.cid;
                    params.payment.profit = decorationPayment.profit;

                    com.popup("专用收款收据__装修单号:" + orderId, api.index.decorationPaymentReceiptIndex.url, null, null, true);
                });
            }
        }, null, false);

        com.post(api.payment.confirmDecorationPayment, {
            "paymentIds[0]": payment.dpid
        }, function(res) {

        });
    }

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

        com.post(api.payment.pageDecorationPayment, $.extend({}, params["decorationPaymentPostData" + decorationPayment.type], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["装修单号", "decoration.orderId"], ['楼盘地址', ['decoration.house.village.cityProper.city.name', 'decoration.house.village.cityProper.name', 'decoration.house.village.name', 'decoration.house.houseNumber']], ['客户', 'decoration.customer.name'], ['设计师', 'decoration.designer.currentName'], ['设计部', 'decoration.designer.dept.name'], ['应收金额', 'referMoney'], ['收款人', 'collecter.currentName'], ['收款时间', 'collectTime'], ['类型', 'paymentType'], ['状态', 'paymentStatus'], ['备注', 'comment'], ['现金', 'cash'], ['刷卡', ['bank', 'bankInfo']], ['银行', ['checkv', 'checkvBank']], ['分期', ['installment', 'installmentBank']], ['对公', ['accounts', 'accountsBank']], ['预付款', 'advance'], ['券', ['coupon', 'couponInfo']]],
                list: res.paging.data
            }, function(v) {

                v.collecter = v.collecter == null ? {
                    "collecter": ""
                } : v.collecter;

                if (v.bank != null && v.bank != 0) {
                    v.bankInfo = paymentUtils.splitBankInfo('', v.bankInfo, decorationPayment.bankInfo, true);
                }

                if (v.checkv != null && v.checkv != 0) {
                    var checkBankInfoStr = v.checkvBank;
                    if (checkBankInfoStr.indexOf("#") != -1) {
                        v.checkvBank = paymentUtils.splitBankInfo('', v.checkvBank, decorationPayment.checkvInfo, true);
                    } else {
                        v.checkvBank = v.checkv != null && v.checkv != "0" ? decorationPayment.checkvInfo[v.checkvBank] : '';
                    }
                }

                if (v.coupon != null && v.coupon != 0) {
                    var $couponInfo = ' ';
                    var _info = v.couponInfo.split('#');
                    for ( var i = 1; i < _info.length - 1; i++) {
                        var _i = _info[i].split(':');
                        $couponInfo += decorationPayment.couponTypeData[_i[0]][1] + " " + _i[1] + ", ";
                    }

                    v.couponInfo = $couponInfo;
                }

                v.installmentBank = v.installment != null && v.installment != "0" ? decorationPayment.bankInfo[v.installmentBank] : '';
                v.accountsBank = v.accounts != null && v.accounts != "0" ? decorationPayment.accountsInfo[v.accountsBank] : '';
                v.paymentStatus = decorationPayment.paymentStatusArray[v.paymentStatus];
            });
        });
    });

    // 全选
    com.focusPage('a[name="checks"]', '#pagenation').click(function() {

        paymentUtils.checkAll();
    });

    // 批量确认
    com.focusPage('a[name="confirms"]', '#pagenation').click(function() {

        var options = {};
        var $inputs = com.focusPage('input[name="dpIds"]:checked');

        $.each($inputs, function(i, v) {

            options["paymentIds[" + i + "]"] = $(v).attr('dpId');
        });

        if ($inputs.length == 0) {
            com.showAlert(com.warning, "当前未选择要确认的装修款项信息");
            return false;
        }

        com.showConfirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {

            com.post(api.payment.confirmDecorationPayment, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "确认成功")
            });
        });
    });
});
