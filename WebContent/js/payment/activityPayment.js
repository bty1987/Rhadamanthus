jQuery(function($) {

    var activityPayment = {
        htmlName: "activity",
        type: params['urlLoadParams'].paytype,
        paytypes: [],
        paymentStatusArray: constant.payment().activityPayment.status.keys,
        payment: null,

        items: {
            cashCheckbox: com.focusPage("#cashCheckbox", "#activityPayment"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#activityPayment"),
            couponCheckbox: com.focusPage("#couponCheckbox", "#activityPayment"),

            cashDiv: com.focusPage("#cashDiv", "#activityPayment"),
            cash: com.focusPage("#cash", "#activityPayment"),

            bankName: com.focusPage("#bankName", "#activityPayment"),
            bank: com.focusPage("#bank", "#activityPayment"),
            posway: com.focusPage("#posway", "#activityPayment"),

            couponType: com.focusPage("#couponType", "#activityPayment"),
            couponVal: com.focusPage("#couponVal", "#activityPayment"),

            posDiv: com.focusPage("#posDiv", "#activityPayment"),
            posGroup: com.focusPage("#posGroup", "#activityPayment"),
            bankDiv: com.focusPage("#bankDiv", "#activityPayment"),
            bankGroup: com.focusPage("#bankGroup", "#activityPayment"),
            couponDiv: com.focusPage("#couponDiv", "#activityPayment"),
            couponInputs: com.focusPage("#couponInputs", "#activityPayment"),
            couponGroup: com.focusPage("#couponGroup", "#activityPayment"),

            referMoney: com.focusPage("#referMoney", "#activityPayment"),
            collectDes: com.focusPage("#collectDes", "#activityPayment")
        },

        creareItems: {
            mno: com.focusPage('#mno', "#activityPayment"),
            orderId: com.focusPage('#orderId', "#activityPayment"),
            type: com.focusPage('#type', "#activityPayment"),
            brand: com.focusPage('#brand', "#activityPayment"),
            money: com.focusPage('#money', "#activityPayment"),
            comment: com.focusPage("#comment", "#activityPayment")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#activityPayment"),
            collectBtn: com.focusPage("#collectBtn", "#activityPayment"),

            couponAdd: com.focusPage("#couponAdd", "#activityPayment"),
            createPaytran: com.focusPage("#createPaytran", "#activityPayment")
        },

        modals: {
            createModal: com.focusPage("#createModal", "#activityPayment"),
            collectModal: com.focusPage("#collectModal", "#activityPayment")
        },

        cash: [],
        bank: [],
        couponType: [],
        posValues: {},

        cashUtil: [],
        bankUtil: [],

        bankInfo: {},
        couponTypeData: {},

        conditions: [],
        extraParams: {},
        functions: [],
        apids: [],
        isCollects: false,

        activityCouponType: constant.payment().activityPayment.activityCouponType.datas,
        paymentType: constant.payment().activityPayment.paymentType.keys,
        pageConfig: {},
        typeNo: 5,
        atttype: 0
    };

    // 隐藏触发
    activityPayment.modals.createModal.on("hide.bs.modal", function() {

        com.closeTip();
        com.cleanTypeahead("brand");
        com.cleanItems(activityPayment.creareItems);
        activityPayment.creareItems.brand.attr('readonly', "readonly").removeClass('v_typeahead');
    });

    activityPayment.modals.collectModal.on('hide.bs.modal', function() {

        activityPayment.items.posGroup.html("");
        activityPayment.items.bankGroup.removeClass('hide');

        activityPayment.isCollects = false;
        activityPayment.payment = null;
        activityPayment.apids = [];

        com.closeTip();
        com.cleanItems(activityPayment.items);

        activityPayment.items.bankName.removeClass("v_required v_typeahead");
        activityPayment.items.bank.removeClass("v_required v_float_3");
    });

    activityPayment.creareItems.type.bindData(constant.payment().activityPayment.paymentType.datas, "key", "value", false);
    activityPayment.items.posway.bindData(constant.payment().receiptType.posway.datas, "key", "value");
    com.focusPage("#cashInfo", "#activityPayment").bindData(constant.payment().activityPayment.ways.datas, "key", "value", false);

    $.each(activityPayment.activityCouponType, function(i, v) {

        activityPayment.couponTypeData[v.key] = [v.key, v.value];
    });

    // checkbox选中时联动
    com.focusPage("#collectModal :checkbox", "#activityPayment").on("change", function() {

        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#activityPayment");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    com.post(api.data.queryReceiptType, {}, function(res) {

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == constant.data().receiptType.TYPE_CARD_INT) {
                if (v.status == constant.data().receiptType.STATUS_ENABLE_INT) {
                    activityPayment.bank.push(v);
                    activityPayment.posValues[v.no] = v;
                    activityPayment.bankUtil.push({
                        "key": v.no,
                        "value": v.name
                    });
                }
                activityPayment.bankInfo[v.no] = v.name;
            }
        });
    }, null, false);

    com.initTypeahead('brand', api.data.queryBrandByPinyin, "brand.pinyin", {}, "brands", "name", "name", null);
    com.selectTypeahead("couponType", activityPayment.activityCouponType, 'key', 'value', null);
    com.selectTypeahead("bankName", activityPayment.bankUtil, "key", "value", null);


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
	activityPayment.btns.collectBtn.on("click", guard(activityPayment.btns.collectBtn, collect));
	activityPayment.btns.saveBtn.on("click", guard(activityPayment.btns.saveBtn, create));

    activityPayment.btns.createPaytran.unbind().click(function() {

        paymentUtils.pushPos(activityPayment, activityPayment.payment.mno);
        return false;
    });

    activityPayment.btns.couponAdd.unbind().click(function() {

        if (com.validate("couponInputs", "#activityPayment"))
            return false;

        paymentUtils.addCounpon();
    });

    // 不同页面的不同参数
    activityPayment.pageConfig = paymentUtils.getConfig(activityPayment.type, 32);

    var lineprops = (function() {

        var lineprops = [{
            type: "checkbox",
            name: "apids",
            clazz: "ace ace-checkbox-2",
            show: function() {

                return activityPayment.pageConfig.pageBtn.contains("batchCollect");
            },
            attrs: function(v) {

                return {
                    "data-apid": v.apid,
                    "data-mno": v.mno,
                    "data-orderid": v.orderId,
                    "data-money": v.money,
                    "data-status": v.status
                };
            }
        }]
            .concat(paymentUtils.getPropertyLineprops(activityPayment, activityPayment.paymentStatusArray));

        if (activityPayment.pageConfig.pageBtn.contains("payway")) {
            lineprops.push({
                field: "payway",
                name: "收款方式",
                type: "custom",
                prop: function(v) {

                    return paymentUtils.getHistoryText(activityPayment, v);
                },
                render: function($liLine, v) {

                    paymentUtils.drawHistoryData(activityPayment, v, $liLine, "");
                }
            });
        }

        return lineprops;
    })();

    var linebtns = (function() {

        return {
            collect: {
                name: "收款",
                clazz: "btn-info",
                show: function(v) {

                    return v.status == constant.payment().activityPayment.STATUS_INIT_INT && activityPayment.pageConfig.pageBtn.contains("collect");
                },
                handle: function(v) {

                    activityPayment.apids.push(v.apid);
                    initCollect(v, false);
                }
            },
            print: {
                name: "打印",
                clazz: "btn-pink",
                show: function(v) {

                    return v.status != 0 && activityPayment.pageConfig.pageBtn.contains("print");
                },
                handle: function(v) {

                    params.payment.activityPayment = v;
                    com.popup("专用收款收据__会员编号:" + v.mno, api.index.activityPaymentReceiptIndex.url, function() {

                        parent.layer.getFrameIndex(window.name);
                    }, null, true);
                }
            }
        };
    })();

    var buttons = (function() {

        var $batch = $('<a></a>').addClass('btn btn-minier pull-left btn-primary').attr('id', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-money bigger-110').appendTo($batch);
        $('<span></span>').text('批量收款').appendTo($batch);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'createActivityPayment').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        var btnParams = [];

        if (activityPayment.pageConfig.pageBtn.contains("batchCollect"))
            btnParams.push($batch);
        if (activityPayment.pageConfig.pageBtn.contains("add"))
            btnParams.push($adda);

        return btnParams;
    })();

    var searcher = new Searcher();

    var extraParams = {};
    if (activityPayment.pageConfig.statusExtraParam != null && activityPayment.pageConfig.statusExtraParam.length > 0) {
        extraParams["activityPayment.status"] = activityPayment.pageConfig.statusExtraParam[0];
    }

    searcher.set("condList", "pagenation", "resultList", activityPayment.pageConfig.apiPage, extraParams, activityPayment.pageConfig.condArr, "activityPaymentPostData" + activityPayment.type, null, false, buttons);
    searcher.line(function(v) {

        return activityPayment.paymentType[v.type];
    }, lineprops, linebtns).render();

    // 添加活动款
    function create() {

        if (com.validate('createModal'))
            return false;

        var brand = activityPayment.creareItems.brand.val();

        var options = {
            'activityPayment.mno': activityPayment.creareItems.mno.val(),
            'activityPayment.orderId': activityPayment.creareItems.orderId.val(),
            'activityPayment.type': activityPayment.creareItems.type.val(),
            'activityPayment.category': brand.split("-")[1],
            'activityPayment.brand': brand.split("-")[0],
            'activityPayment.money': activityPayment.creareItems.money.val(),
            'activityPayment.comment': activityPayment.creareItems.comment.val()
        };

        com.post(api.payment.createActivityPayment, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        activityPayment.modals.createModal.modal("hide");
    }

    // 初始化模态框
    function initCollect(payment, isCollects) {

        activityPayment.payment = payment;

        paymentUtils.showPos(activityPayment, {
            "paytran.orderId": payment.mno,
            "paytran.type": 5,
            "paytran.atttype": activityPayment.atttype
        }, [0, 1]);

        activityPayment.items.referMoney.val(payment.money).attr("disabled", "disabled");

        if (activityPayment.pageConfig.paytypes.contains("cash"))
            paymentUtils.initCash(activityPayment);
        if (activityPayment.pageConfig.paytypes.contains("bank"))
            paymentUtils.initBank(activityPayment, 0);
        if (activityPayment.pageConfig.paytypes.contains("coupon"))
            paymentUtils.initCoupon(activityPayment, 0);

        activityPayment.modals.collectModal.modal("show");

        // 是批量收款
        activityPayment.isCollects = isCollects;
    }

    // 收款
    function collect() {

        if (com.validate('collectModal')) {
            return false;
        }

        var options = {
            "activityReceipt.comment": activityPayment.items.collectDes.val()
        };
        var realPayment = 0;
        var referMoney = parseFloat(activityPayment.items.referMoney.val());

        var cash = paymentUtils.paramCash(activityPayment, "activityReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(cash));

        var bank = paymentUtils.paramBank(activityPayment, activityPayment.payment, "activityReceipt", options, 0);

        if (bank < 0) {
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(bank));

        var coupon = paymentUtils.paramCoupon(activityPayment, activityPayment.payment, "activityReceipt", options, 0);

        realPayment = utils.accAdd(realPayment, parseFloat(coupon));

        if (referMoney != realPayment) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        $.each(activityPayment.apids, function(i, v) {

            options["activityPayments[" + i + "].apid"] = v;
        });

        com.post(api.payment.collectActivityPayment, options, function() {

            searcher.doSearch();
            com.showAlert(com.info, "收款成功");
            activityPayment.modals.collectModal.modal("hide");
        });
    }

    // 添加
    com.focusPage('#createActivityPayment', '#pagenation').click(function() {

        activityPayment.modals.createModal.modal("show");
    });

    // 批量收款
    com.focusPage("#collects", "#pagenation").click(function() {

        var $inputs = com.focusPage('input[name="apids"]:checked', '#resultList');

        var referMoney = 0;
        var orderId = "";
        var flag = false;

        if (!$inputs.length) {
            com.showAlert(com.warning, "请选择结算款项");
            return false;
        }

        $.each($inputs, function(i, v) {

            var $input = $(v);

            if (i == 0) {
                orderId = $input.attr("data-orderid")
            }

            if ($input.attr("data-orderid") != orderId) {
                flag = true;
                com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
                return false;
            }

            referMoney += parseFloat($input.attr("data-money"));
            activityPayment.apids.push($input.attr("data-apid"));

        });

        if (flag)
            return;

        var payment = $($inputs[0]).data();
        activityPayment.payment = {
            "apid": payment.apid,
            "mno": payment.mno,
            "orderId": payment.orderid,
            "money": referMoney,
            "status": payment.status
        };

        initCollect(activityPayment.payment, true);

    });

    activityPayment.creareItems.type.on('change', function() {

        var way = activityPayment.creareItems.type.val();

        if (way == constant.payment().activityPayment.PAYMENTTYPE_DECORATIONPAYMENT_INT || way == constant.payment().activityPayment.PAYMENTTYPE_DECORATIONPAYMENT_DEPOSIT_INT) {
            activityPayment.creareItems.brand.attr('readonly', "readonly").removeClass('v_typeahead');
            com.updateTypeahead("brand", "", "");
        } else if (way == constant.payment().activityPayment.PAYMENTTYPE_MATERIALPAYMENT_INT || way == constant.payment().activityPayment.PAYMENTTYPE_MATERIALPAYMENT_DEPOSIT_INT) {
            activityPayment.creareItems.brand.removeAttr('readonly').addClass('v_typeahead');
        }
    });

});
