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

    oalesPayment.btns.collectBtn.bindClick(collect);
    oalesPayment.btns.refundBtn.bindClick(collect);

    oalesPayment.btns.createPaytran.unbind().click(function() {

        paymentUtils.pushPos(oalesPayment, oalesPayment.payment.orderId);
        return false;
    });

    // 不同页面的不同参数
    oalesPayment.pageConfig = paymentUtils.getConfig(oalesPayment.type, 65);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPosPush = $('<a></a>').addClass('btn btn-minier btn-danger').html('推送');
            var $btnCode = $('<a></a>').addClass('btn btn-minier btn-success').html('收款码');
            var $btnCol = $('<a></a>').addClass('btn btn-minier').html('');
            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-pink').html('打印');
            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

            var propertyArr = paymentUtils.getPropertyArr(oalesPayment, v, v.oales.decoration, oalesPayment.paymentStatusArray);

            var _label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "opids"
            }).addClass('ace ace-checkbox-2');
            $input.attr({
                "data-opid": v.opid,
                "data-mno": v.mno,
                "data-orderid": v.orderId,
                "data-refermoney": v.referMoney,
                "data-type": v.type,
                "data-status": v.status
            });

            if (oalesPayment.pageConfig.pageBtn.contains("batchCollect") || oalesPayment.pageConfig.pageBtn.contains("selectall"))
                $input.appendTo(_label);

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(oalesPayment.paymentType[v.type]);

            _label.append(_span).appendTo($h3);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {
                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            if (v.type == 0)
                $btnCol.text('收款').addClass("btn-info");
            if (v.type == 1)
                $btnCol.text('退款').addClass("btn-danger");

            if (oalesPayment.pageConfig.pageBtn.contains("payway"))
                paymentUtils.drawHistoryData(oalesPayment, v, $liLine, "");

            if (v.status == 0 && oalesPayment.pageConfig.pageBtn.contains("collect"))
                $divBtnWrap.append($btnCol);
            if (v.status != 0 && oalesPayment.pageConfig.pageBtn.contains("print"))
                $divBtnWrap.append($btnPrint);
            if (v.status == constant.payment().materialPayment.STATUS_COLLECT_INT && oalesPayment.pageConfig.pageBtn.contains("update"))
                $divBtnWrap.append($btnUpdate);
            if (v.type == 0 && v.status == constant.payment().materialPayment.STATUS_INIT_INT && oalesPayment.pageConfig.pageBtn.contains("posPush"))
                $divBtnWrap.append($btnPosPush);
            if (v.type == 0 && v.status == constant.payment().materialPayment.STATUS_INIT_INT && oalesPayment.pageConfig.pageBtn.contains("collectCode"))
                $divBtnWrap.append($btnCode);

            // 收款
            $btnCol.click(function() {

                oalesPayment.opids.push(v.opid);
                initCollect(v, false);
            });

            // 打印
            $btnPrint.click(function() {

                params.payment.orId = v.oalesReceipt.orid;
                params.payment.cid = v.oales.decoration.customer.cid;

                com.popup("专用收款收据__装修单号: " + v.orderId, api.index.oalesPaymentReceiptIndex.url, function() {

                    parent.layer.getFrameIndex(window.name);
                }, null, true);
            });

            // 更新
            $btnUpdate.click(function() {

                // 应对批量收款的情况
                var referMoney = utils.accAdd(utils.accAdd(v.oalesReceipt.cash, v.oalesReceipt.bank), v.oalesReceipt.checkv);
                v.referMoney = referMoney;

                initUpdate(v);

            });

            // 二维码
            $btnCode.click(function() {

                com.focusPage("#oalesCodeQrcodeModal").html("");
                paymentUtils.initQrcode("oalesPayment", "oalesCodeQrcodeModal"); // 收款码
                paymentUtils.showQRCode("oalesPaymentqrcode", "http://fanglin.vip/wx/wxpay?orderId=" + v.orderId + "&paymentType=3" + "&pid=" + v.opid + "&atttype=1", "oalesCodeQrcodeModal");
            });

            // pos推送
            $btnPosPush.click(function() {

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
                    "paytran.sn": oalesPayment.posValues[bankVal].value, // 收据类型中pos的value值
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
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    var extraParams = {};
    if (oalesPayment.pageConfig.statusExtraParam != null && oalesPayment.pageConfig.statusExtraParam.length > 0) {
        extraParams["oalesPayment.status"] = oalesPayment.pageConfig.statusExtraParam[0];
    }

    searcher.init(oalesPayment.pageConfig.condArr, "condList", oalesPayment.pageConfig.apiPage, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "oalesPaymentPostData" + oalesPayment.type, extraParams, false, null, function() {

        var $batch = $('<a></a>').addClass('btn btn-minier pull-left btn-primary').attr('id', 'collects').css("margin", "0px 3px");
        var $batchi = $('<i></i>').addClass('icon-money bigger-110').appendTo($batch);
        var $batchspan = $('<span></span>').text('批量收款').appendTo($batch);

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        var $checkspan = $('<span></span>').text('全选').appendTo($checka);

        var $confirma = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
        var $confirmi = $('<i></i>').addClass('icon-money bigger-110').appendTo($confirma);
        var $confirmspan = $('<span></span>').text('批量确认').appendTo($confirma);

        var btnParams = [];

        if (oalesPayment.pageConfig.pageBtn.contains("batchCollect"))
            btnParams.push($batch);
        if (oalesPayment.pageConfig.pageBtn.contains("selectall"))
            btnParams.push($checka);
        if (oalesPayment.pageConfig.pageBtn.contains("confirms"))
            btnParams.push($confirma);

        return btnParams;

    }, 'resultList');

    // 要在searcher后面
    paymentUtils.pushPosBank(oalesPayment.type == "common", oalesPayment.bankUtil, com.focusPage("#condList", "#oalesPaymentList"), oalesPayment.htmlName);

    // 初始化模态框
    function initCollect(payment, isCollects) {

        com.cleanItems(oalesPayment.items);

        oalesPayment.items.historyDiv.hide();

        oalesPayment.payment = payment;

        var orderId = payment.oales.orderId ? payment.oales.orderId : payment.oales.decoration.orderId;

        //查询装修单信息
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": orderId
        }, function(res) {

            oalesPayment.decoration = res.decoration;
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

        var grade = ["A", "C"].contains(payment.oales.decoration.grade) ? "A" : "";

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

        if (payment.type == 0 && payment.status == 0) {
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
            
            if(oalesPayment.profit) options["oalesPayment.bompany"] = oalesPayment.decoration.bompany;

        } else if (payment.type == 1 && payment.status == 0) {
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
            
            if(!oalesPayment.profit) oalesPayment.decoration.bompany = null;
        }, null, false);

        com.focusPage("#myModalLabels").html("付款信息");

        // 绑定收款单位的基础信息
        paymentUtils.getReceiptType(oalesPayment);

        com.selectTypeahead("cashInfo", oalesPayment.cashUtil, "key", "value", null); // 现金方式

        // var grade = payment.sales.grade == "B" ? "B" : "";
        var grade = payment.oales.grade == "C" ? "" : payment.oales.grade;

        paymentUtils.initBankGrade(oalesPayment, grade);

        // 历史收款信息
        paymentUtils.drawHistoryData(oalesPayment, payment.oalesReceipt, oalesPayment.items.historyData, "update");

        oalesPayment.btns.refundBtn.addClass("hide");

        oalesPayment.modals.collectModal.modal("show");
    }

});
