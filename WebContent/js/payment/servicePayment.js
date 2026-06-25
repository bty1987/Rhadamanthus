jQuery(function($) {

    var servicePayment = {
        htmlName: "service",
        type: params['urlLoadParams'].paytype,
        paytypes: [],
        paymentStatusArray: constant.payment().servicePayment.status.keys,
        payment: null,

        items: {
            cashCheckbox: com.focusPage("#cashCheckbox", "#servicePayment"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#servicePayment"),
            checkvCheckbox: com.focusPage("#checkvCheckbox", "#servicePayment"),
            advanceCheckbox: com.focusPage("#advanceCheckbox", "#servicePayment"),

            historyDiv: com.focusPage("#historyDiv", "#servicePayment"),
            historyData: com.focusPage("#historyData", "#servicePayment"),
            cashDiv: com.focusPage("#cashDiv", "#servicePayment"),
            checkvDiv: com.focusPage("#checkvDiv", "#servicePayment"),
            advanceDiv: com.focusPage("#advanceDiv", "#servicePayment"),

            cash: com.focusPage("#cash", "#servicePayment"),
            cashInfo: com.focusPage("#cashInfo", "#servicePayment"),

            bankName: com.focusPage("#bankName", "#servicePayment"),
            bank: com.focusPage("#bank", "#servicePayment"),
            posway: com.focusPage("#posway", "#servicePayment"),

            posDiv: com.focusPage("#posDiv", "#servicePayment"),
            posGroup: com.focusPage("#posGroup", "#servicePayment"),
            bankDiv: com.focusPage("#bankDiv", "#servicePayment"),
            bankGroup: com.focusPage("#bankGroup", "#servicePayment"),
            checkvGroup: com.focusPage("#checkvGroup", "#servicePayment"),

            recharge: com.focusPage("#recharge", "#servicePayment"),
            advance: com.focusPage("#advance", "#servicePayment"),
            advanceType: com.focusPage("#advanceType", "#servicePayment"),

            comment: com.focusPage("#comment", "#servicePayment"),
            referMoney: com.focusPage("#referMoney", "#servicePayment"),
            serviceMoneyDiv: com.focusPage("#serviceMoneyDiv", "#servicePayment"),
            serviceMoney: com.focusPage("#serviceMoney", "#servicePayment"),

            myModalLabel: com.focusPage("#myModalLabel", "#servicePayment"),

            orderId: com.focusPage("#orderId", "#servicePayment"),
            collectMoney: com.focusPage("#collectMoney", "#servicePayment")
        },

        btns: {
            collectBtn: com.focusPage("#collectBtn", "#servicePayment"),
            createBtn: com.focusPage("#createBtn", "#servicePayment"),

            checkvAdd: com.focusPage("#checkvAdd", "#servicePayment"),
            couponAdd: com.focusPage("#couponAdd", "#servicePayment"),
            createPaytran: com.focusPage("#createPaytran", "#servicePayment")
        },

        modals: {
            collectModal: com.focusPage("#collectModal", "#servicePayment"),
            createServicetModal: com.focusPage("#createServicetModal", "#servicePayment"),
            serviceCollectQrcodeModal: com.focusPage("#serviceCollectQrcodeModal").prop("id", params['urlLoadParams'].paytype + "serviceCollectQrcodeModal"),
            alipayCodepayModal: com.focusPage("#serviceAlipayCodeQrcodeModal")
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

        conditions: [],
        extraParams: {},
        functions: [],
        isCollect: "",
        pageConfig: {},
        typeNo: 4,
        atttype: 0,
        decoration: {}
    };

    // 隐藏触发
    servicePayment.modals.collectModal.on('hide.bs.modal', function() {

        servicePayment.bankGrade = [];
        servicePayment.checkvGrade = [];

        servicePayment.items.posGroup.html("");
        servicePayment.items.bankGroup.removeClass('hide');
        servicePayment.items.checkvGroup.html("");
        servicePayment.items.historyData.html("");

        servicePayment.items.bankName.removeClass("v_required v_typeahead");
        servicePayment.items.bank.removeClass("v_required v_float_3");

        servicePayment.payment = null;

        com.closeTip();
    });

    servicePayment.modals.createServicetModal.on('hide.bs.modal', function() {

        com.cleanItems(servicePayment.items);
        com.closeTip();
    });

    servicePayment.items.posway.bindData(constant.payment().receiptType.posway.datas, "key", "value");

    com.focusPage("#collectModal :checkbox", "#servicePayment").on("change", function() {

        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#servicePayment");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    paymentUtils.getReceiptType(servicePayment);

    // 转账方式(银行)
    servicePayment.btns.checkvAdd.click(function() {

        paymentUtils.addBank(servicePayment);
        return false;
    });

    servicePayment.items.advanceType.bindData([{
        "key": "1",
        "value": "合同"
    }], 'key', 'value');

    servicePayment.btns.collectBtn.bindClick(collect);

    servicePayment.btns.createBtn.bindClick(createService);

    servicePayment.btns.createPaytran.unbind().click(function() {

        paymentUtils.pushPos(servicePayment, servicePayment.payment.decoration.orderId);
        return false;
    });

    // 不同页面的不同参数
    servicePayment.pageConfig = paymentUtils.getConfig(servicePayment.type, 16);

    function posPushServicePaymentLine(v) {

        var bankVal = com.typeahead(servicePayment.htmlName + "paytranBankName");
        var bankDiv = com.focusPage("#" + servicePayment.htmlName + "paytranBankName");

        if (bankVal == "" || bankDiv.val() == "") {
            com.showAlert(com.warning, "请使用匹配数据.");
            return false;
        }

        var options = {
            "paytran.orderId": v.decoration.orderId,
            "paytran.pid": v.spid,
            "paytran.type": constant.payment().receipt.PAYMENTTYPE_SERVICE_INT,
            "paytran.atttype": constant.payment().paytran.ATTTYPE_DECORATION_INT,
            "paytran.no": com.typeahead(bankDiv),
            "paytran.sn": servicePayment.posValues[bankVal].value,
            "paytran.money": v.serviceMoney,
            "paytran.way": 0
        };

        com.post(api.payment.addPaytran, options, function(res) {

            com.post(api.payment.posPay, {
                "paytran.ptid": res.paytran.ptid,
                "paytran.way": 1
            }, function(res) {

                com.showAlert(com.info, "推送成功");
            });
        });
    }

    function codeServicePaymentLine(v) {

        com.focusPage("#" + servicePayment.type + "serviceCollectQrcodeModal").html("");
        paymentUtils.initQrcode("collect", servicePayment.type + "serviceCollectQrcodeModal");
        paymentUtils.showQRCode("collectqrcode", "http://fanglin.vip/wx/wxpay?orderId=" + v.decoration.orderId + "&paymentType=4" + "&pid=" + v.spid + "&atttype=0", servicePayment.type + "serviceCollectQrcodeModal");
    }

    function alipayServicePaymentLine(v) {

        var paytranId = 0;
        var paytranMoney = v.serviceMoney;

        com.post(api.payment.queryPaytran, {
            "paytran.pid": v.spid,
            "paytran.type": 4,
            "paytran.orderId": v.decoration.orderId
        }, function(res) {

            $.each(res.paytrans, function(i, pt) {

                if (pt.status == 0) {
                    paytranId = pt.ptid;
                    paytranMoney = pt.money;
                    return false;
                }
            });
        }, null, false);

        if (paytranMoney != v.serviceMoney) {
            com.showAlert(com.error, "金额不正确.");
            return false;
        }

        com.post(api.payment.alipay, {
            "wxpay.paymentOrderId": v.decoration.orderId,
            "wxpay.paymentType": 4,
            "wxpay.paymentAttrType": 0,
            "wxpay.paymentMoney": paytranMoney,
            "wxpay.userId": "alipay",
            "wxpay.paymentid": v.spid,
            "wxpay.paymentptid": paytranId,
            "wxpay.unionId": v.decoration.customer.cid
        }, function(data) {

            servicePayment.modals.alipayCodepayModal.html("");
            com.popup("二维收款", data.wxpay.url + "&mchNo=" + data.wxpay.mchNo + "&bizId=" + data.wxpay.bizId + "&isShort=true", null, null, false);
        }, null, false);
    }

    function buildServiceLineprops() {

        var lineprops = [{
            type: "checkbox",
            name: "spids",
            clazz: "ace ace-checkbox-2",
            value: function(v) {

                return v.arId;
            },
            show: function() {

                return servicePayment.pageConfig.pageBtn.contains("selectall");
            },
            attrs: function(v) {

                return {
                    "spid": v.spid
                };
            }
        }]
            .concat(paymentUtils.getPropertyLineprops(servicePayment, servicePayment.paymentStatusArray));

        if (servicePayment.pageConfig.pageBtn.contains("payway")) {
            lineprops.push({
                field: "payway",
                name: "收款方式",
                type: "custom",
                prop: function(v) {

                    return paymentUtils.getHistoryText(servicePayment, v);
                },
                render: function($liLine, v) {

                    paymentUtils.drawHistoryData(servicePayment, v, $liLine, "");
                }
            });
        }

        return lineprops;
    }

    function buildServiceLinebtns() {

        return {
            posPush: {
                name: "推送",
                clazz: "btn-danger",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && servicePayment.pageConfig.pageBtn.contains("posPush");
                },
                handle: posPushServicePaymentLine
            },
            collectCode: {
                name: "收款码",
                clazz: "btn-success",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && servicePayment.pageConfig.pageBtn.contains("collectCode");
                },
                handle: codeServicePaymentLine
            },
            alipayCollectCode: {
                name: "二维收款",
                clazz: "btn-info",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && servicePayment.pageConfig.pageBtn.contains("alipayCollectCode");
                },
                handle: alipayServicePaymentLine
            },
            codePush: {
                name: "微信推送",
                clazz: "btn-pink",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_INIT_INT && servicePayment.pageConfig.pageBtn.contains("codePush");
                },
                handle: function(v) {

                    com.showConfirm("是否发送付款通知", function() {

                        com.post(api.payment.sendServicePayment, {
                            "servicePayment.spid": v.spid
                        }, function(res) {

                            com.showAlert(com.info, "发送成功");
                        });
                    });
                }
            },
            serviceCollect: {
                name: "服务费",
                clazz: "btn-success",
                show: function() {

                    return servicePayment.pageConfig.pageBtn.contains("serviceCollect");
                },
                handle: function(v) {

                    servicePayment.isCollect = 1;
                    if (utils.accSub(v.servicePrice, v.servicePaidup) <= 0) {
                        com.showAlert(com.error, "当前服务费已交满,不能重复交款!");
                        return false;
                    }
                    paymentUtils.showPos(servicePayment, {
                        "paytran.orderId": v.decoration.orderId,
                        "paytran.atttype": servicePayment.atttype
                    }, [0, 1]);
                    initCollect(v);
                }
            },
            serviceRefund: {
                name: "服务费退款",
                clazz: "btn-warning",
                show: function() {

                    return servicePayment.pageConfig.pageBtn.contains("serviceRefund");
                },
                handle: function(v) {

                    servicePayment.isCollect = 2;
                    if (v.servicePaidup == 0) {
                        com.showAlert(com.error, "当前服务费未交,不能退款!");
                        return false;
                    }
                    initCollect(v);
                }
            },
            print: {
                name: "打印",
                clazz: "btn-primary",
                show: function(v) {

                    return v.status != constant.payment().materialPayment.STATUS_INIT_INT && servicePayment.pageConfig.pageBtn.contains("print");
                },
                handle: function(v) {

                    params.payment.orderId = v.decoration.orderId;
                    params.payment.serId = v.serviceReceipt.srId;
                    params.payment.cid = v.decoration.customer.cid;
                    com.popup("专用收款收据__装修单号:" + v.decoration.orderId, api.index.servicePaymentReceiptIndex.url, function() {

                        parent.layer.getFrameIndex(window.name);
                    }, null, true);
                }
            },
            update: {
                name: "更新",
                clazz: "btn-success",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_COLLECT_INT && servicePayment.pageConfig.pageBtn.contains("update");
                },
                handle: function(v) {

                    servicePayment.isCollect = 3;
                    initUpdate(v);
                }
            },
            kingdee: {
                name: "同步金蝶",
                clazz: "btn-yellow",
                show: function(v) {

                    return v.status == constant.payment().materialPayment.STATUS_CONFIRM_INT && servicePayment.pageConfig.pageBtn.contains("toKingdee");
                },
                handle: function(v) {

                    kingdeeUtils.payment(v, servicePayment.htmlName);
                }
            }
        };
    }

    function buildServiceButtons() {

        var $createa = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'createService').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($createa);
        $('<span></span>').text('生成服务费').appendTo($createa);
        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        $('<span></span>').text('全选').appendTo($checka);
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        $('<span></span>').text('批量确认').appendTo($adda);
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        $('<span></span>').text('导出').appendTo($impa);

        var btnParams = [];
        if (servicePayment.pageConfig.pageBtn.contains("createService"))
            btnParams.push($createa);
        if (servicePayment.pageConfig.pageBtn.contains("selectall"))
            btnParams.push($checka);
        if (servicePayment.pageConfig.pageBtn.contains("confirms"))
            btnParams.push($adda);
        if (servicePayment.pageConfig.pageBtn.contains("export"))
            btnParams.push($impa);
        return btnParams;
    }

    var searcher = new Searcher();

    var extraParams = {};
    if (servicePayment.pageConfig.statusExtraParam != null && servicePayment.pageConfig.statusExtraParam.length > 0) {
        extraParams["servicePayment.status"] = servicePayment.pageConfig.statusExtraParam[0];
    }

    searcher.set("condList", "pagenation", "resultList", servicePayment.pageConfig.apiPage, extraParams, servicePayment.pageConfig.condArr, "servicePaymentPostData" + servicePayment.type, null, false, buildServiceButtons);
    searcher.line(function(v) {

        return ["common", "pos"].contains(servicePayment.type) ? "服务款" : (v.type == constant.payment().servicePayment.TYPE_COLLECT_INT ? "收款" : "退款");
    }, buildServiceLineprops(), buildServiceLinebtns()).render();

    // 要在searcher后面
    paymentUtils.pushPosBank(servicePayment.type == "create", servicePayment.bankUtil, com.focusPage("#condList", "#servicePaymentList"), servicePayment.htmlName);

    function initCollect(payment) {

        com.cleanItems(servicePayment.items);

        servicePayment.items.historyDiv.hide();

        servicePayment.payment = payment;

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": payment.decoration.orderId
        }, function(res) {

            servicePayment.decoration = res.decoration;
        }, null, false);

        paymentUtils.getReceiptType(servicePayment);

        servicePayment.items.comment.html("");

        servicePayment.isCollect == 2 ? servicePayment.items.myModalLabel.html("退款信息") : servicePayment.items.myModalLabel.html("付款信息");
        servicePayment.isCollect == 2 ? servicePayment.btns.collectBtn.html("退款") : servicePayment.btns.collectBtn.html("收款");
        servicePayment.isCollect == 2 ? servicePayment.items.referMoney.val(payment.servicePaidup).attr("readonly", "readonly") : servicePayment.items.referMoney.html("").removeAttr("readonly");
        servicePayment.isCollect == 1 ? servicePayment.items.serviceMoneyDiv.show() : servicePayment.items.serviceMoneyDiv.hide();
        servicePayment.isCollect == 1 ? servicePayment.items.serviceMoney.val(utils.accSub(payment.servicePrice, payment.servicePaidup)).attr("readonly", "readonly") : "";

        var type = servicePayment.isCollect == 3 ? 2 : servicePayment.isCollect == 2 ? 1 : 0; // 0: 收款类型 , 1: 退款类型

        if (servicePayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(servicePayment);
        if (servicePayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(servicePayment, type);
        if (servicePayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(servicePayment);
        if (servicePayment.pageConfig.paytypes.contains("advance"))
            paymentUtils.initAdvance(servicePayment, type, {
                "advancePayment.decoration.orderId": payment.decoration.orderId
            }, "balanceAdvance");

        com.selectTypeahead("cashInfo", servicePayment.cashUtil, "key", "value", null); // 现金

        // 根据装修单等级获取收据类型等级
        var grade = ["A", "C"].contains(payment.decoration.grade) ? "A" : "";

        // 根据等级在数组中筛选出符合要求的用于显示
        paymentUtils.initBankGrade(servicePayment, grade); // 刷卡&银行

        servicePayment.modals.collectModal.modal("show");

    }

    // 更新
    function initUpdate(v) {

        com.cleanItems(servicePayment.items);

        servicePayment.items.myModalLabel.html("更新付款信息");
        servicePayment.btns.collectBtn.html("收款");
        servicePayment.items.serviceMoneyDiv.hide();
        servicePayment.items.referMoney.val(v.serviceMoney + v.advanceMoney).attr("readonly", "readonly");
        servicePayment.items.comment.val(v.comment).attr("readonly", "readonly");

        servicePayment.items.historyDiv.show();

        servicePayment.payment = v;

        if (servicePayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(servicePayment);
        if (servicePayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(servicePayment, 1);
        if (servicePayment.pageConfig.paytypes.contains("checkv"))
            paymentUtils.initCheckv(servicePayment);

        // 查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": v.decoration.orderId
        }, function(res) {

            servicePayment.decoration = res.decoration;
        }, null, false);

        paymentUtils.getReceiptType(servicePayment);

        com.selectTypeahead("cashInfo", servicePayment.cashUtil, "key", "value", null); // 现金

        // 根据装修单等级获取收据类型等级
        var grade = ["A", "C"].contains(v.decoration.grade) ? "A" : "";

        // 根据等级在数组中筛选出符合要求的用于显示
        paymentUtils.initBankGrade(servicePayment, grade);

        // 历史收款信息
        paymentUtils.drawHistoryData(servicePayment, v.serviceReceipt, servicePayment.items.historyData, "update");

        servicePayment.modals.collectModal.modal("show");
    }

    // 生成服务费
    function createService() {

        if (com.validate("createServicetModal", "#servicePayment"))
            return false;

        var options = {
            "servicePayment.decoration.orderId": servicePayment.items.orderId.val(),
            "servicePayment.referMoney": servicePayment.items.collectMoney.val()
        };

        com.post(api.payment.makeServicePayment, options, function(res) {

            com.showAlert(com.info, "创建成功");
            searcher.doSearch();
            servicePayment.modals.createServicetModal.modal("hide");
        })
    }

    // 收款
    function collect() {

        if (com.validate("collectModal", "#servicePayment"))
            return false;

        var url = "";
        var realPayment = 0;
        var realMoney = 0;
        var referMoney = servicePayment.items.referMoney.val();
        var comment = servicePayment.items.comment.val();
        var type;

        var payment = servicePayment.payment;

        var options = {
            "servicePayment.decoration.orderId": payment.decoration.orderId,
            "servicePayment.referMoney": referMoney,
            "servicePayment.comment": comment,
            "serviceReceipt.comment": comment
        };

        if (servicePayment.isCollect == 1) {
            url = api.payment.collectServicePaymentForService;
            type = 0;
        } else if (servicePayment.isCollect == 2) {
            url = api.payment.refundServicePaymentForService;
            type = 1;
        } else if (servicePayment.isCollect == 3) {
            url = api.payment.updateServicePayment;
            options["servicePayment.spid"] = payment.spid;
            options["servicePayment.pid"] = payment.pid;
            type = 2;
        }

        // 计算总额
        var cash = paymentUtils.paramCash(servicePayment, "serviceReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(cash));
        realMoney = utils.accAdd(realMoney, parseFloat(cash));

        var bank = paymentUtils.paramBank(servicePayment, servicePayment.payment.serviceReceipt, "serviceReceipt", options, type);

        if (bank < 0) {
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(bank));
        realMoney = utils.accAdd(realMoney, parseFloat(bank));

        var checkv = paymentUtils.paramCheckv(servicePayment, "serviceReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(checkv));
        realMoney = utils.accAdd(realMoney, parseFloat(checkv));

        var advance = paymentUtils.paramAdvance(servicePayment, servicePayment.payment.serviceReceipt, "serviceReceipt", options, "advance", type);

        if (advance < 0) {
            com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(advance));

        if (referMoney != realPayment) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if (servicePayment.isCollect == 1) {
            var serviceMoney = servicePayment.items.serviceMoney.val();
            if (realPayment > serviceMoney) {
                com.showAlert(com.error, "当前所收服务费多于剩余服务费,不能收款!");
                return false;
            }
        }

        options["serviceReceipt.realMoney"] = realMoney;
        com.post(url, options, function() {

            searcher.doSearch();
            servicePayment.modals.collectModal.modal("hide");
        });

    }

    // 生成服务费
    com.focusPage('a[name="createService"]', '#pagenation').click(function() {

        servicePayment.modals.createServicetModal.modal("show");
    });

    // 全选
    com.focusPage('a[name="checks"]', '#pagenation').click(function() {

        paymentUtils.checkAll();
    });

    // 批量确认
    com.focusPage('a[name="confirms"]', '#pagenation').click(function() {

        var options = {};
        var $inputs = com.focusPage('input[name="spids"]:checked');

        $.each($inputs, function(i, v) {

            options["spIds[" + i + "]"] = $(v).attr('spid');
        });

        if ($inputs.length == 0) {
            com.showAlert(com.warning, "当前未选择要确认的服务款项信息");
            return false;
        }

        com.showConfirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {

            com.post(api.payment.confirmServicePayment, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "确认成功")
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

        com.post(api.payment.pageServicePayment, $.extend({}, params["servicePaymentPostData" + servicePayment.type], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["装修单号", "decoration.orderId"], ['楼盘地址', ['decoration.house.village.cityProper.city.name', 'decoration.house.village.cityProper.name', 'decoration.house.village.name', 'decoration.house.houseNumber']], ['客户', 'decoration.customer.name'], ['设计师', 'decoration.designer.currentName'], ['设计部', 'decoration.designer.dept.name'], ['预付款金额', 'advanceMoney'], ['服务费', 'serviceMoney'], ['收款人', 'serviceReceipt.collecter.currentName'], ['收款时间', 'serviceReceipt.collectTime'], ['类型', 'type'], ['状态', 'status'], ['备注', 'comment'], ['现金', 'serviceReceipt.cash'], ['刷卡', ['serviceReceipt.bank', 'serviceReceipt.bankInfo']], ['银行', ['serviceReceipt.checkv', 'serviceReceipt.checkvBank']], ['分期', ['serviceReceipt.installment', 'serviceReceipt.installBank']], ['对公', ['serviceReceipt.accounts', 'serviceReceipt.accountsBank']], ['预付款', 'serviceReceipt.advance']],
                list: res.paging.data
            }, function(v) {

                if (v.serviceReceipt.bank != null && v.serviceReceipt.bank != 0) {
                    v.serviceReceipt.bankInfo = paymentUtils.splitBankInfo('', v.serviceReceipt.bankInfo, servicePayment.bankInfo, true);
                }

                if (v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != 0) {
                    var checkvInfoStr = v.serviceReceipt.checkvBank;
                    if (checkvInfoStr.indexOf("#") != -1) {
                        v.serviceReceipt.checkvBank = paymentUtils.splitBankInfo('', v.serviceReceipt.checkvBank, servicePayment.checkvInfo, true);
                    } else {
                        v.serviceReceipt.checkvBank = v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? servicePayment.checkvInfo[v.serviceReceipt.checkvBank] : '';
                    }

                }

                v.serviceReceipt.installBank = v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? servicePayment.bankInfo[v.serviceReceipt.installBank] : '';
                v.serviceReceipt.accountsBank = v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? servicePayment.accountsInfo[v.serviceReceipt.accountsBank] : '';
                v.type = v.type == "0" ? "收款" : "退款";
                v.status = v.status == "1" ? "已付款" : "已确认";
            });
        });
    });
});
