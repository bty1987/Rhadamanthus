jQuery(function($) {

    var oalesPayment = {
        htmlName: "oales",
        type: params['urlLoadParams'].paytype,
        paytypes: [],
        paymentStatusArray: constant.payment().oalesPayment.status.keys,
        payment: null,

        items: {
            cashCheckbox: com.focusPage("#cashCheckbox", "#oalesPayment"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#oalesPayment"),
            checkvCheckbox: com.focusPage("#checkvCheckbox", "#oalesPayment"),

            cashDiv: com.focusPage("#cashDiv", "#oalesPayment"),
            cash: com.focusPage("#cash", "#oalesPayment"),
            cashInfo: com.focusPage("#cashInfo", "#oalesPayment"),

            bankName: com.focusPage("#bankName", "#oalesPayment"),
            bank: com.focusPage("#bank", "#oalesPayment"),
            posway: com.focusPage("#posway", "#oalesPayment"),

            couponType: com.focusPage("#couponType", "#oalesPayment"),
            couponVal: com.focusPage("#couponVal", "#oalesPayment"),

            historyDiv: com.focusPage("#historyDiv", "#oalesPayment"),
            historyData: com.focusPage("#historyData", "#oalesPayment"),
            posDiv: com.focusPage("#posDiv", "#oalesPayment"),
            posGroup: com.focusPage("#posGroup", "#oalesPayment"),
            bankDiv: com.focusPage("#bankDiv", "#oalesPayment"),
            bankGroup: com.focusPage("#bankGroup", "#oalesPayment"),
            checkvGroup: com.focusPage("#checkvGroup", "#oalesPayment"),

            referMoney: com.focusPage("#referMoney", "#oalesPayment"),
            comment: com.focusPage("#collectDes", "#oalesPayment"),
            collectDes: com.focusPage("#collectDes", "#oalesPayment")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#oalesPayment"),
            refundBtn: com.focusPage("#refundBtn", "#oalesPayment"),
            collectBtn: com.focusPage("#collectBtn", "#oalesPayment"),
            checkvAdd: com.focusPage("#checkvAdd", "#oalesPayment"),
            createPaytran: com.focusPage("#createPaytran", "#oalesPayment")
        },

        modals: {
            createModal: com.focusPage("#createModal", "#oalesPayment"),
            collectModal: com.focusPage("#collectModal", "#oalesPayment")
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
        accountsInfo: {},
        checkvInfo: {},
        couponTypeData: {},

        bankGrade: [],
        checkvGrade: [],

        conditions: [],
        extraParams: {},
        functions: [],
        opids: [],
        isCollects: false,

        paymentType: constant.payment().oalesPayment.type.keys,
        collectType: [constant.payment().materialPayment.PAYMENTTYPE_TYPE_DEPOSIT_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_FULL_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_DEPOSIT_NOTREFUND_INT],
        refundType: [constant.payment().materialPayment.PAYMENTTYPE_TYPE_REJECT_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_FULL_REFUND_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_COUPON_REFUND_INT, constant.payment().materialPayment.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT],
        isAffirms: constant.payment.decorationPayment.isAffirm.keys,
        pageConfig: {},
        typeNo: 5,
        atttype: 1,
        decoration: {}
    };

    // 隐藏触发
    oalesPayment.modals.collectModal.on("hide.bs.modal", function() {

        oalesPayment.bankGrade = [];
        oalesPayment.checkvGrade = [];
        oalesPayment.opids = [];

        oalesPayment.items.posGroup.html("");
        oalesPayment.items.bankGroup.removeClass('hide');
        oalesPayment.items.checkvGroup.html("");
        oalesPayment.items.historyData.html("");
        oalesPayment.items.bankName.removeClass("v_required v_typeahead");
        oalesPayment.items.bank.removeClass("v_required v_float_3");

        oalesPayment.isCollects = false;
        oalesPayment.payment = null;

        com.closeTip();
        com.cleanItems(oalesPayment.items);
    });

    oalesPayment.items.posway.bindData(constant.payment().receiptType.posway.datas, "key", "value");

    // checkbox选中时联动
    com.focusPage("#collectModal :checkbox", "#oalesPayment").on("change", function() {

        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#oalesPayment");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    // 绑定收款单位的基础信息
    paymentUtils.getReceiptType(oalesPayment);

    // 转账方式(银行)
    oalesPayment.btns.checkvAdd.click(function() {

        paymentUtils.addBank(oalesPayment);
        return false;
    });

    com.post(api.data.queryReceiptType, {}, function(res) {

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == constant.data().receiptType.TYPE_CARD_INT) {
                if (v.status == constant.data().receiptType.STATUS_ENABLE_INT) {
                    oalesPayment.bank.push(v);
                    oalesPayment.posValues[v.no] = v;
                    oalesPayment.bankUtil.push({
                        "key": v.no,
                        "value": v.name
                    });

                }
                oalesPayment.bankInfo[v.no] = v.name;
            }
        });
    }, null, false);

    com.initTypeahead('brand', api.data.queryBrandByPinyin, "brand.pinyin", {}, "brands", "name", "name", null);
    com.selectTypeahead("bankName", oalesPayment.bankUtil, "key", "value", null);


    // 防重复提交: 点击即禁用, 覆盖com.post同接口5秒节流窗口(6s)后恢复
    var guard = function($btn, handler) {

        return function() {

            if ($btn.data("submitting"))
                return;

            $btn.data("submitting", true).prop("disabled", true).addClass("disabled");

            try {
                handler();
            } finally {
                setTimeout(function() {
                    $btn.data("submitting", false).prop("disabled", false).removeClass("disabled");
                }, 6000);
            }
        };
    };
	oalesPayment.btns.collectBtn.on("click", guard(oalesPayment.btns.collectBtn, collect));
	oalesPayment.btns.refundBtn.on("click", guard(oalesPayment.btns.refundBtn, collect));

    oalesPayment.btns.createPaytran.unbind().click(function() {

        paymentUtils.pushPos(oalesPayment, oalesPayment.payment.orderId);
        return false;
    });

    // 不同页面的不同参数
    oalesPayment.pageConfig = paymentUtils.getConfig(oalesPayment.type, 65);

    function collectOalesPaymentLine(v) {

        oalesPayment.opids.push(v.opid);
        initCollect(v, false);
    }

    function printOalesPaymentLine(v) {

        params.payment.orId = v.oalesReceipt.orid;
        params.payment.cid = v.oales.decoration.customer.cid;

        com.popup("专用收款收据__装修单号: " + v.orderId, api.index.oalesPaymentReceiptIndex.url, function() {

            parent.layer.getFrameIndex(window.name);
        }, null, true);
    }

    function updateOalesPaymentLine(v) {

        var referMoney = utils.accAdd(utils.accAdd(v.oalesReceipt.cash, v.oalesReceipt.bank), v.oalesReceipt.checkv);
        v.referMoney = referMoney;

        initUpdate(v);
    }

    function codeOalesPaymentLine(v) {

        com.focusPage("#oalesCodeQrcodeModal").html("");
        paymentUtils.initQrcode("oalesPayment", "oalesCodeQrcodeModal");
        paymentUtils.showQRCode("oalesPaymentqrcode", "http://fanglin.vip/wx/wxpay?orderId=" + v.orderId + "&paymentType=3" + "&pid=" + v.opid + "&atttype=1", "oalesCodeQrcodeModal");
    }

    function posPushOalesPaymentLine(v) {

        var bankVal = com.typeahead(oalesPayment.htmlName + "paytranBankName");
        var bankDiv = com.focusPage("#" + oalesPayment.htmlName + "paytranBankName");

        if (bankVal == "" || bankDiv.val() == "") {
            com.showAlert(com.warning, "请使用匹配数据.");
            return false;
        }

        var options = {
            "paytran.orderId": v.orderId,
            "paytran.pid": v.opid,
            "paytran.type": constant.payment().receipt.PAYMENTTYPE_SALES_INT,
            "paytran.atttype": constant.payment().paytran.ATTTYPE_MATERIAL_INT,
            "paytran.no": com.typeahead(bankDiv),
            "paytran.sn": oalesPayment.posValues[bankVal].value,
            "paytran.money": v.referMoney,
            "paytran.way": 0
        };

        com.post(api.payment.addPaytran, options, function(res) {

            var sendOption = {
                "paytran.ptid": res.paytran.ptid,
                "paytran.way": 1
            };

            com.post(api.payment.posPay, sendOption, function(res) {

                com.showAlert(com.info, "推送成功");
            });
        });
    }

    var lineprops = (function() {

        var lineprops = [{
            type: "checkbox",
            name: "opids",
            clazz: "ace ace-checkbox-2",
            show: function() {

                return oalesPayment.pageConfig.pageBtn.contains("batchCollect") || oalesPayment.pageConfig.pageBtn.contains("selectall");
            },
            attrs: function(v) {

                return {
                    "data-opid": v.opid,
                    "data-mno": v.mno,
                    "data-orderid": v.orderId,
                    "data-refermoney": v.referMoney,
                    "data-type": v.type,
                    "data-status": v.status
                };
            }
        }]
            .concat(paymentUtils.getPropertyLineprops(oalesPayment, oalesPayment.paymentStatusArray));

        if (oalesPayment.pageConfig.pageBtn.contains("payway")) {
            lineprops.push({
                field: "payway",
                name: "收款方式",
                type: "custom",
                prop: function(v) {

                    return paymentUtils.getHistoryText(oalesPayment, v.oalesReceipt);
                },
                render: function($liLine, v) {

                    paymentUtils.drawHistoryData(oalesPayment, v.oalesReceipt, $liLine, "");
                }
            });
        }

        return lineprops;
    })();

    var linebtns = (function() {

        return {
            collect: {
                name: function(v) {

                    return v.type == 0 ? "收款" : "退款";
                },
                clazz: function(v) {

                    return v.type == 0 ? "btn-info" : "btn-danger";
                },
                show: function(v) {

                    return v.status == constant.payment().oalesPayment.STATUS_INIT_INT && oalesPayment.pageConfig.pageBtn.contains("collect");
                },
                handle: collectOalesPaymentLine
            },
            print: {
                name: "打印",
                clazz: "btn-pink",
                show: function(v) {

                    return v.status != 0 && oalesPayment.pageConfig.pageBtn.contains("print");
                },
                handle: printOalesPaymentLine
            },
            update: {
                name: "更新",
                clazz: "btn-success",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_COLLECT_INT && oalesPayment.pageConfig.pageBtn.contains("update");
                },
                handle: updateOalesPaymentLine
            },
            posPush: {
                name: "推送",
                clazz: "btn-danger",
                show: function(v) {

                    return v.type == 0 && v.status == constant.payment().materialPayment.STATUS_INIT_INT && oalesPayment.pageConfig.pageBtn.contains("posPush");
                },
                handle: posPushOalesPaymentLine
            },
            collectCode: {
                name: "收款码",
                clazz: "btn-success",
                show: function(v) {

                    return v.type == 0 && v.status == constant.payment().materialPayment.STATUS_INIT_INT && oalesPayment.pageConfig.pageBtn.contains("collectCode");
                },
                handle: codeOalesPaymentLine
            }
        };
    })();

    var buttons = (function() {

        var $batch = $('<a></a>').addClass('btn btn-minier pull-left btn-primary').attr('id', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-money bigger-110').appendTo($batch);
        $('<span></span>').text('批量收款').appendTo($batch);

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);

        var $confirma = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-money bigger-110').appendTo($confirma);
        $('<span></span>').text('批量确认').appendTo($confirma);

        var btnParams = [];

        if (oalesPayment.pageConfig.pageBtn.contains("batchCollect"))
            btnParams.push($batch);
        if (oalesPayment.pageConfig.pageBtn.contains("selectall"))
            btnParams.push($checka);
        if (oalesPayment.pageConfig.pageBtn.contains("confirms"))
            btnParams.push($confirma);

        return btnParams;
    })();

    var searcher = new Searcher();

    var extraParams = {};
    if (oalesPayment.pageConfig.statusExtraParam != null && oalesPayment.pageConfig.statusExtraParam.length > 0) {
        extraParams["oalesPayment.status"] = oalesPayment.pageConfig.statusExtraParam[0];
    }

    searcher.set("condList", "pagenation", "resultList", oalesPayment.pageConfig.apiPage, extraParams, oalesPayment.pageConfig.condArr, "oalesPaymentPostData" + oalesPayment.type, null, false, buttons);
    searcher.line(function(v) {

        return oalesPayment.paymentType[v.type];
    }, lineprops, linebtns).render();

    // 要在searcher后面
    paymentUtils.pushPosBank(oalesPayment.type == "common", oalesPayment.bankUtil, com.focusPage("#condList", "#oalesPaymentList"), oalesPayment.htmlName);

    // 初始化模态框
    function initCollect(payment, isCollects) {

        com.cleanItems(oalesPayment.items);

        oalesPayment.items.historyDiv.hide();

        oalesPayment.payment = payment;

        var orderId = payment.oales.orderId ? payment.oales.orderId : payment.oales.decoration.orderId;

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": orderId
        }, function(res) {

            oalesPayment.decoration = res.decoration;

            if (!oalesPayment.profit)
                oalesPayment.decoration.bompany = null;
        }, null, false);

        // 绑定收款单位的基础信息
        paymentUtils.getReceiptType(oalesPayment);

        paymentUtils.showPos(oalesPayment, {
            "paytran.orderId": payment.orderId,
            "paytran.atttype": oalesPayment.atttype
        }, [0, 1]);

        oalesPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");

        if (oalesPayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(oalesPayment);
        if (payment.type == 1 && oalesPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(oalesPayment, 1);
        if (payment.type == 0 && oalesPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(oalesPayment, 0);
        if (oalesPayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(oalesPayment);

        com.selectTypeahead("cashInfo", oalesPayment.cashUtil, "key", "value", null); // 现金方式

        // var grade = ["A", "C"].contains(payment.oales.decoration.grade) ? "A" : "";
        var grade = "B";

        // 根据等级在数组中筛选出符合要求的用于显示
        paymentUtils.initBankGrade(oalesPayment, grade); // 刷卡&银行

        if (payment.type == 1) {// 退款

            com.focusPage("#myModalLabels").text("退款信息");

            oalesPayment.btns.collectBtn.addClass("hide");
            oalesPayment.btns.refundBtn.removeClass("hide");
        } else {

            com.focusPage("#myModalLabels").html("付款信息");

            oalesPayment.btns.collectBtn.removeClass("hide");
            oalesPayment.btns.refundBtn.addClass("hide");
        }

        oalesPayment.modals.collectModal.modal("show");

        // 是批量收款
        oalesPayment.isCollects = isCollects;
    }

    // 收款
    function collect() {

        if (com.validate('collectModal')) {
            return false;
        }

        var url = "";
        var options = {
            "oalesReceipt.comment": oalesPayment.items.collectDes.val()
        };

        var realPayment = 0;
        var realMoney = 0;
        var referPayment = oalesPayment.items.referMoney.val();
        var type = 0;

        var payment = oalesPayment.payment;

        if (payment.type == 0 && payment.status == constant.payment().payment.STATUS_INIT_INT) {
            url = api.payment.collectOalesPayment;

            // 批量收款参数
            if (oalesPayment.isCollects) {
                url = api.payment.collectOalesPayment;

                if (oalesPayment.opids.length > 0) {
                    $.each(oalesPayment.opids, function(i, v) {

                        options["opids[" + i + "]"] = v;
                    });
                }

                options["oalesPayment.oales.oid"] = payment.oales.oid;
            }

            if (oalesPayment.profit)
                options["oalesPayment.bompany"] = oalesPayment.decoration.bompany;

        } else if (payment.type == 1 && payment.status == constant.payment().payment.STATUS_INIT_INT) {
            url = api.payment.refundOalesPayment;
            type = 1;
        } else if (payment.status == constant.payment().materialPayment.STATUS_COLLECT_INT) {
            url = api.payment.updateOalesPayment;
            type = 2;
        }

        var cash = paymentUtils.paramCash(oalesPayment, "oalesReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(cash));
        realMoney = utils.accAdd(realMoney, parseFloat(cash));

        var bank = paymentUtils.paramBank(oalesPayment, oalesPayment.payment.oalesReceipt, "oalesReceipt", options, type);

        if (bank < 0) {
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(bank));
        realMoney = utils.accAdd(realMoney, parseFloat(bank));

        var checkv = paymentUtils.paramCheckv(oalesPayment, "oalesReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(checkv));
        realMoney = utils.accAdd(realMoney, parseFloat(checkv));

        if (referPayment != realPayment) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if ($.isEmptyObject(options)) {
            com.showAlert(com.warning, "无收款方式信息");
            return false;
        }

        options["oalesPayment.opid"] = payment.opid;
        options["oalesReceipt.realMoney"] = realMoney;

        com.post(url, options, function(res) {

            searcher.doSearch();
            oalesPayment.modals.collectModal.modal("hide");
            com.showAlert(com.info, "操作成功")
        });

    }

    // 全选
    com.focusPage('a[name="checks"]', '#pagenation').click(function() {

        paymentUtils.checkAll();
    });

    // 批量确认
    com.focusPage('a[name="confirms"]', '#pagenation').click(function() {

        var $inputs = com.focusPage('input[name="opids"]:checked', '#resultList');

        if (!$inputs.length)
            return false;

        var option = {};

        $.each($inputs, function(index, value) {

            option["opids[" + index + "]"] = $(value).attr("data-opid");
        });

        com.showConfirm('确定要将符合条件的所有收款项目,置为已确认状态吗?', function(index, layero) {

            com.post(api.payment.confirmOalesPayment, option, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, '确认成功');
            })
        }, null);
    });

    // 更新
    function initUpdate(payment) {

        com.cleanItems(oalesPayment.items);

        com.focusPage("#myModalLabel").text("更新款项信息");

        oalesPayment.items.historyDiv.show();

        oalesPayment.payment = payment;

        oalesPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
        oalesPayment.items.comment.val(payment.oalesReceipt.comment).attr("disabled", "disabled");

        if (oalesPayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(oalesPayment);
        if (oalesPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(oalesPayment, 1);
        if (oalesPayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(oalesPayment);

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": payment.orderId
        }, function(res) {

            oalesPayment.decoration = res.decoration;

            if (!oalesPayment.profit)
                oalesPayment.decoration.bompany = null;
        }, null, false);

        com.focusPage("#myModalLabels").html("付款信息");

        // 绑定收款单位的基础信息
        paymentUtils.getReceiptType(oalesPayment);

        com.selectTypeahead("cashInfo", oalesPayment.cashUtil, "key", "value", null); // 现金方式

        // var grade = payment.sales.grade == "B" ? "B" : "";
        // var grade = payment.oales.grade == "C" ? "" : payment.oales.grade;
        var grade = "B";

        paymentUtils.initBankGrade(oalesPayment, grade);

        // 历史收款信息
        paymentUtils.drawHistoryData(oalesPayment, payment.oalesReceipt, oalesPayment.items.historyData, "update");

        oalesPayment.btns.refundBtn.addClass("hide");

        oalesPayment.modals.collectModal.modal("show");
    }

});
