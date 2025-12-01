var paymentUtils = {

    initCash: function(payment) {

        payment.items.cashCheckbox.parent().removeClass("hide");

        com.cleanTypeahead(payment.items.cashInfo);

    },
    paramCash: function(payment, name, options) {

        var flag = payment.items.cashCheckbox.prop("checked");

        if (!flag)
            return 0;

        var cash = payment.items.cash.val();

        options[name + ".cash"] = cash;
        options[name + ".cashInfo"] = com.typeahead(payment.items.cashInfo);

        return cash;
    },
    initBank: function(payment, type) {

        payment.items.bankCheckbox.parent().removeClass("hide").children(':first').removeAttr("disabled");

        if (type == 1)
            payment.items.bankCheckbox.attr("disabled", "disabled");

        if (type == 2)
            payment.items.bankCheckbox.attr("disabled", "disabled");

        com.selectTypeahead(payment.items.bankName, payment.bankGrade, "key", "value", null);

    },
    paramBank: function(payment, receipt, name, options, type) {

        if (type == 1)
            return 0; // 0: 收款 , 1: 退款 , 2: 更新

        if (type == 2) {

            options[name + ".bank"] = receipt.bank;

            return receipt.bank;
        }

        var flag = payment.items.bankCheckbox.prop("checked");

        if (!flag)
            return 0;

        var positems = com.focusPage(".positem", payment.items.posGroup);

        if (positems.length == 0)
            return 0;

        var bank = 0;
        var bankInfo = "#";

        for ( var i = 0; i < positems.length; i++) {

            var data = $(positems[i]).data();

            if (data.status == 0)
                return -1;

            bankInfo += data.no + "|" + data.money + "|" + data.createtime + "|" + data.ptid + "#";

            bank = utils.accAdd(parseFloat(data.money), bank);

            options["ptids[" + i + "]"] = data.ptid;
        }

        options[name + ".bank"] = bank;
        options[name + ".bankInfo"] = bankInfo;

        return bank;
    },
    initCheckv: function(payment) {

        payment.items.checkvCheckbox.parent().removeClass("hide");

    },
    paramCheckv: function(payment, name, options) {

        var flag = payment.items.checkvCheckbox.prop("checked");

        if (!flag)
            return 0;

        var banks = com.focusPage(".checkvDiv", payment.items.checkvGroup);

        if (banks.length == 0)
            return 0;

        var bank = 0;
        var bankInfo = "#";

        $.each(banks, function(i, e) {

            var info = $(e);

            var name = com.typeahead(info.find(".bank"));
            var money = info.find(".money").val();
            var date = info.find(".date").val();
            var time = info.find(".time").val();

            bankInfo += name + "|" + money + "|" + date + " " + time + "#";

            bank = utils.accAdd(parseFloat(money), bank);
        });

        options[name + ".checkv"] = bank;
        options[name + ".checkvBank"] = bankInfo;

        return bank;
    },
    initAdvance: function(payment, type, options, balanceType) {

        payment.items.advanceCheckbox.parent().removeClass("hide").children(':first').removeAttr("disabled");

        // 款项历史时
        if (type == 2) {
            payment.items.advanceCheckbox.attr("disabled", "disabled");
            return false;
        }

        com.post(api.payment.queryAdvancePaymentByOrderId, options, function(res) {

            payment.items.recharge.val(res[balanceType]).attr("readonly", "readonly");
        });

    },
    paramAdvance: function(payment, receipt, name, options, advanceType, type) {

        // if(type == 1) return 0; // 0: 收款 , 1: 退款 , 2: 更新

        if (type == 2) {

            options[name + ".advance"] = receipt.advance;

            return receipt.advance;
        }

        var flag = payment.items.advanceCheckbox.prop("checked");

        if (!flag)
            return 0;

        var recharge = parseFloat(payment.items.recharge.val());
        var advance = parseFloat(payment.items.advance.val());
        var advanceType = payment.items.advanceType.val();

        if (type == 0 && recharge > 0 && recharge < advance)
            return -1;

        options[name + ".advanceType"] = advanceType;
        options[name + ".advance"] = advance;

        return advance;
    },
    initCoupon: function(payment, type) {

        payment.items.couponCheckbox.parent().removeClass("hide").children(':first').removeAttr("disabled");

        payment.items.couponGroup.html("");

        if (type == 1)
            payment.items.couponCheckbox.attr("disabled", "disabled");

        if (type == 2)
            payment.items.couponCheckbox.attr("disabled", "disabled");

    },
    paramCoupon: function(payment, receipt, name, options, type) {

        // 0: 收款 , 1: 退款 , 2: 更新
        if (type == 2) {

            options[name + ".coupon"] = receipt.coupon;

            return receipt.coupon;
        }

        var flag = payment.items.couponCheckbox.prop("checked");

        if (!flag)
            return 0;

        var coupon = 0;
        var couponInfo = "#";

        var coupons = com.focusPage("li", payment.items.couponGroup);

        if (coupons.length == 0)
            return 0;

        $.each(coupons, function(i, e) {

            var info = $(e).children("span");

            var name = info.attr("typeName");
            var money = info.attr("money");

            coupon = utils.accAdd(coupon, parseFloat(money));
            couponInfo += name + ":" + money + "#";
        });

        options[name + ".coupon"] = coupon;
        options[name + ".couponInfo"] = couponInfo;

        return coupon;
    },

    addBank: function(payment) {

        var d = new Date();

        var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

        var bankDiv = $('<div></div>').addClass("checkvDiv").appendTo(payment.items.checkvGroup);

        var bankNameDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankNameDiv_);
        var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankNameDiv_);
        var bankNameSelect = $('<input/>').addClass('col-xs-10 col-sm-6 v_typeahead v_required bank').attr({
            'type': 'text',
            'data-toggle': 'popover',
            'data-trigger': 'manual',
            'data-placement': 'bottom'
        }).appendTo(bankNameDiv);
        var bankDelDiv = $('<div></div>').addClass('col-sm-1').appendTo(bankNameDiv_);
        var bankDelBtn = $('<button></button>').addClass('btn btn-minier btn-danger pull-right inline').text("删除").appendTo(bankDelDiv).click(function() {

            $(this).parents(".checkvDiv").remove();
            return false;
        });

        var bankMoneyDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankMoneyDiv_);
        var bankMoneyDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankMoneyDiv_);
        var bankMoneyInput = $('<input/>').addClass("col-sm-6 v_required v_float_3 money").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").appendTo(bankMoneyDiv);

        var bankDateDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDateDiv_);
        var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDateDiv_);
        var bankDateInput = $('<input/>').addClass("date-picker-date col-sm-6 v_required date").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("data-date-format", "yyyy-mm-dd").val(currentData).appendTo(bankDateDiv);
        com.datetime(bankDateInput);

        var bankTimeDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankTimeDiv_);
        var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankTimeDiv_);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput = $('<input/>').addClass('timepicker col-sm-6 v_required time').attr("type", "text").appendTo(bankTimePicker);
        com.datetime(bankTimeInput, "time");

        com.selectTypeahead(bankNameSelect, payment.checkvGrade, "key", "value", null);
    },

    showPos: function(payment, options, status) {

        com.post(api.payment.queryPaytran, options, function(res) {

            $.each(res.paytrans, function(i, v) {

                if (status.indexOf(v.status) < 0)
                    return true;

                if (payment.htmlName != "proxy" && v.pid != 0)
                    return true;

                paymentUtils.addPos(payment, v);
            });
        });
    },
    pushPos: function(payment, orderId) {

        payment.items.bankName.addClass("v_required v_typeahead");
        payment.items.bank.addClass("v_required v_float_3");

        if (com.validate("bankGroup"))
            return false;

        // 转换款使用之后会更新成是哪个类型的款项使用的
        var options = {
            "paytran.type": payment.typeNo,
            "paytran.atttype": payment.atttype,
            "paytran.no": com.typeahead(payment.items.bankName),
            "paytran.sn": payment.posValues[com.typeahead(payment.items.bankName)].value, // 收据类型中pos的value值
            "paytran.money": payment.items.bank.val(),
            "paytran.way": 0
        };

        if (payment.htmlName != "proxy") {
            if (!orderId) {
                com.showAlert(com.warning, "无款项信息");
                return false;
            }

            options["paytran.orderId"] = orderId;
        } else {
            options["paytran.pid"] = payment.payment.ppid;
        }

        com.post(api.payment.addPaytran, options, function(res) {

            res.paytran.status = 0;
            paymentUtils.addPos(payment, res.paytran);
        });

        payment.items.bankName.removeClass("v_required v_typeahead");
        payment.items.bank.removeClass("v_required v_float_3");
    },

    addPos: function(payment, v) {

        if (v.status == 2 || v.status == 3)
            return false;

        var posDivGroup = payment.items.posGroup;

        var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix positem").attr("id", "pos" + v.ptid).appendTo(posDivGroup);
        var liname = $("<li></li>").append($("<strong></strong>").text("名称:")).append($("<b></b>").addClass("grey").text(v.no)).appendTo(ul);
        var limoney = $("<li></li>").append($("<strong></strong>").text("金额:")).append($("<b></b>").addClass("blue").text(v.money)).appendTo(ul);

        ul.attr({
            "data-ptid": v.ptid,
            "data-type": v.type,
            "data-no": v.no,
            "data-money": v.money,
            "data-createTime": v.createTime,
            "data-status": v.status
        });

        if (v.status == 1 || v.status == 4) {
            $("<li></li>").append($("<strong></strong>").text("时间:")).append($("<b></b>").addClass("blue").text(v.createTime)).appendTo(ul);
            $("<li></li>").append($("<strong></strong>").text("状态:")).append($("<b></b>").addClass("red").text("已付款")).appendTo(ul);
            return false;
        }

        var btns = $("<li></li>").attr("id", "posbtns" + v.ptid).appendTo(ul);
        var send = $("<button></button>").addClass("btn btn-minier btn-warning pull-right inline hide").text("POS推送").attr("id", "possend" + v.ptid);
        var wechatSend = $("<button></button>").addClass("btn btn-minier btn-success pull-right inline hide").text("微信推送").attr("id", "wechatSend" + v.ptid);
        var collectCode = $("<button></button>").addClass("btn btn-minier btn-purple pull-right inline hide").text("收款码").attr("id", "collectCode" + v.ptid);
        var check = $("<button></button>").addClass("btn btn-minier btn-orange pull-right inline").text("验证").attr("id", "poscheck" + v.ptid);
        var cancel = $("<button></button>").addClass("btn btn-minier btn-danger pull-right inline hide").text("撤销").attr("id", "poscancel" + v.ptid);

        btns.append(send).append(wechatSend).append(check).append(cancel);

        send.click(function() {

            var sendOption = {
                "paytran.ptid": v.ptid,
                "paytran.way": payment.items.posway.val()
            };

            com.post(api.payment.posPay, sendOption, function(res) {

                com.showAlert(com.info, "推送成功");
            });

            return false;
        });

        wechatSend.click(function() {

            com.showConfirm("是否发送付款通知", function() {

                com.post(api.payment.sendPaytran, {
                    "paytran.ptid": v.ptid
                }, function(res) {

                    com.showAlert(com.info, "发送成功");
                });
            });

            return false;
        });

        collectCode.click(function() {

            return false;
        });

        check.click(function() {

            com.post(api.payment.checkPaytran, {
                "paytran.ptid": v.ptid
            }, function(res) {

                var paytran = res.paytran;

                var ptid = paytran.ptid;
                var posul = com.focusPage("#pos" + ptid);

                if (paytran.status == 0)
                    return false;

                if (paytran.status != 1) {
                    posul.remove();
                    com.showAlert(com.error, "POS支付失败");
                }

                posul.data().status = paytran.status;
                posul.data().createtime = paytran.createTime;
                posul.attr({
                    "data-status": paytran.status,
                    "data-createtime": paytran.createTime
                });

                $("<li></li>").append($("<strong></strong>").text("时间:")).append($("<b></b>").addClass("blue").text(paytran.createTime)).appendTo(posul);
                $("<li></li>").append($("<strong></strong>").text("状态:")).append($("<b></b>").addClass("red").text("已付款")).appendTo(posul);

                com.focusPage("#posbtns" + ptid).remove();
            });

            return false;
        });

        cancel.click(function() {

            com.post(api.payment.cancelPaytran, {
                "paytran.ptid": v.ptid
            }, function(res) {

                com.focusPage("#pos" + res.paytran.ptid).remove();
            });

            return false;
        });
    },

    // 创建优惠券
    addCounpon: function() {

        var $li = $("<li></li>").css({
            "background-color": "#91b8d0",
            "margin-bottom": "5px",
            "margin-right": "5px"
        }).appendTo(com.focusPage("#couponGroup"));
        var typeVal = com.typeahead("couponType", "", false);
        var couponName = com.typeahead("couponType", "", true);
        var couponMoney = com.focusPage("#couponVal").val();
        var $span = $("<span></span>").css({
            'color': '#fff'
        }).attr('typeName', typeVal).attr('money', couponMoney).html(couponName).appendTo($li);
        var $spanTwo = $("<span></span>").css({
            'font-size': '16px',
            'color': '#fff',
            'margin': '0 5px'
        }).html(couponMoney).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({
            'color': '#d15b47'
        }).appendTo($li);
        $a.click(function() {

            $li.remove();
        });
    },

    splitBankInfo: function(bank, bankInfo, bankArray, flag) {

        var info = bank + ", ";
        if (bankInfo.indexOf("#") != -1) {
            var _s = bankInfo.split('#');
            for ( var i = 1; i < utils.accSub(_s.length, 1); i++) {
                var _i = _s[i].split('|');
                info += (bankArray && bankArray[_i[0]] == null ? "无匹配" : bankArray[_i[0]]) + " " + _i[1] + ", ";

                if (flag) {
                    info += _i[2] + ", ";
                }
            }
        } else {
            info += bankArray[bankInfo] + " " + bank;
        }
        return info;
    },

    splitCoupon: function(coupon, couponInfo, couponArray) {

        var _info = coupon + ", ";
        if (couponInfo.indexOf("#") != -1) {
            var _s = couponInfo.split('#');
            for ( var i = 1; i < utils.accSub(_s.length, 1); i++) {
                var _i = _s[i].split(':');
                _info += (couponArray && couponArray[_i[0]] ? couponArray[_i[0]][1] : "无匹配") + " " + _i[1] + ", ";
            }
        }
        return _info;
    },

    // 通过grade筛选符合条件的参数
    initBankGrade: function(payment, grade) {

        payment.bankGrade = [];
        payment.checkvGrade = [];

        $.each(payment.bank, function(i, v) {

            if (v.grade != grade)
                return true;
            payment.bankGrade.push({
                "key": v.no,
                "value": v.name
            });
        });

        $.each(payment.checkv, function(i, v) {

            if (v.grade != grade)
                return true;
            payment.checkvGrade.push({
                "key": v.no,
                "value": v.name
            });
        });

        com.resetTypeahead(payment.items.bankName, payment.bankGrade)
    },

    // 获取收款类型的基础信息 info信息是分页显示信息的, util和cash,bank,checkv是下拉框信息(下拉框不显示禁用)
    getReceiptType: function(payment) {
        payment.cash = [];
        payment.bank = [];
        payment.checkv = [];
        payment.accounts = [];
        payment.couponType = [];
        payment.posValues = [];

        payment.cashUtil = [];
        payment.bankUtil = [];
        payment.checkvUtil = [];

        payment.cashInfo = [];
        payment.bankInfo = [];
        payment.checkvInfo = [];
        payment.accountsInfo = [];
        payment.couponTypeData = [];

        var notCouponPageName = ["payment", "paymentCheck", "service", "serviceCheck", "paymentPos", "servicePos", "proxy"];
        var noAccountsPageName = ["proxy"];

        var queryOptions = {};

        if (payment.decoration && payment.decoration.bompany) {
            queryOptions["receiptType.bompany"] = payment.decoration.bompany
        }

        com.post(api.data.queryReceiptType, queryOptions, function(res) {

            $.each(res.receiptTypes, function(i, v) {

                if (v.type == 1) {
                    if (v.status == 1) {
                        payment.cash.push(v);
                        payment.cashUtil.push({
                            "key": v.no,
                            "value": v.name
                        });
                    }
                    payment.cashInfo[v.no] = v.name;
                } else if (v.type == 2) {
                    if (v.status == 1) {
                        payment.bank.push(v);
                        payment.posValues[v.no] = v;
                        payment.bankUtil.push({
                            "key": v.no,
                            "value": v.name
                        });
                    }
                    payment.bankInfo[v.no] = v.name;
                } else if (v.type == 3) {
                    if (v.status == 1) {
                        payment.checkv.push(v);
                        payment.checkvUtil.push({
                            "key": v.no,
                            "value": v.name
                        });
                    }
                    payment.checkvInfo[v.no] = v.name;
                } else if (v.type == 4) {
                    if (!(noAccountsPageName.contains(payment.htmlName))) {
                        payment.accounts.push(v);
                        payment.accountsInfo[v.no] = v.name;
                    }
                }

                if (!(notCouponPageName.contains(payment.htmlName))) {
                    if (v.type == 5) {
                        payment.couponType.push(v);
                        payment.couponTypeData[v.no] = [v.no, v.name];
                    }
                }
            });
        }, null, false);
    },

    // 全选
    checkAll: function() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    },

    emptyData: function(pagenation) {

        var $resultList = pagenation.html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    },

    drawHistoryData: function(paymentPageData, payment, div, type) {

        var styleArr = [];

        payment.cash != null && payment.cash != "0" ? styleArr.push(["现金:", payment.cash + " " + (paymentPageData.cashInfo ? paymentPageData.cashInfo[payment.cashInfo] == null ? "无匹配" : paymentPageData.cashInfo[payment.cashInfo] : ""), "blue"]) : true;
        payment.bank != null && payment.bank != "0" ? styleArr.push(["刷卡:", paymentUtils.splitBankInfo(payment.bank, payment.bankInfo, paymentPageData.bankInfo), "blue"]) : true;
        payment.checkv != null && payment.checkv != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(payment.checkv, payment.checkvBank, paymentPageData.checkvInfo), "blue"]) : true;
        payment.installment != null && payment.installment != "0" ? styleArr.push(["分期:", payment.installment, "blue"]) : true;
        payment.accounts != null && payment.accounts != "0" ? styleArr.push(["对公帐户:", payment.accounts, "blue"]) : true;
        payment.advance != null && payment.advance != "0" ? styleArr.push(["预付款:", payment.advance, "blue"]) : true;
        payment.coupon != null && payment.coupon != "0" ? styleArr.push(["优惠券:", paymentUtils.splitCoupon(payment.coupon, payment.couponInfo, paymentPageData.couponTypeData), "blue"]) : true;
        payment.transfer != null && payment.transfer != "0" ? styleArr.push(["预付款转换:", payment.transfer, "blue"]) : true;

        var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo(div);

        if (type == "update")
            $ulStyle.removeClass("fl-inline-list");

        $.each(styleArr, function(index, value) {

            var $liProperty = $('<li></li>');
            var $strong = $('<strong></strong>').html(value[0]).appendTo($liProperty);
            if (type == "update")
                $strong.addClass(value[2]);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulStyle);
        });

    },

    getConfig: function(page, type) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subtype) {

            var prop = props.shift();
            if (props.length != 0) {
                if (!o[prop])
                    o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }

            if (subtype == 0) {
                o[prop] = value;
            } else if (subtype == 1 && !o[prop]) {
                o[prop] = [value];
            } else if (subtype == 1 && o[prop]) {
                o[prop].push(value);
            }
        }

        function getApi(o, props) {

            var prop = props.shift();

            if (props.length == 0) {
                return o[prop];
            } else if (o[prop]) {
                return getApi(o[prop], props);
            }
            return "";
        }

        com.post(api.right.queryPaymentFunctionRight, {
            "paymentFunctionRight.name": page,
            "paymentFunctionRight.type": type
        }, function(res) {

            var rights = res.paymentFunctionRights.sort(function(a, b) {

                return a.paymentFunction.sort - b.paymentFunction.sort;
            });

            $.each(rights, function(i, v) {

                var data = v.paymentFunction;

                if (data.type == 1)
                    data.value = getApi({
                        "api": api
                    }, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
            });
        }, null, false);

        return pageConfig;
    },

    getPropertyArr: function(payment, v, decoration, statusArr) {

        var propertyArr = [];
        $.each(payment.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "mno":
                    propertyArr.push(["会员号:", v.mno, "grey"]);
                    break;
                case "orderId":
                    var orderId = decoration.orderId ? decoration.orderId : "无";
                    propertyArr.push(["装修单号:", orderId, "blue", function(btn) {

                        tools.decoration.info(btn, orderId);
                    }]);
                    break;
                case "materialNo":
                    propertyArr.push(["主材号:", decoration.no, "blue"]);
                    break;
                case "salesNo":
                    propertyArr.push(["销售单号:", decoration.no, "blue", function(btn) {

                        tools.sales.info(btn, decoration.sid);
                    }]);
                    break;
                case "customerName":
                    propertyArr.push(["客户:", decoration.customer.name, "grey", function(btn) {

                        tools.customer.info(btn, decoration.customer.cid);
                    }]);
                    break;
                case "address":
                    propertyArr.push(["地址:", v.address, "grey"]);
                    break;
                case "village":
                    propertyArr.push(["楼盘:", decoration.house.village.name, "grey", function(btn) {

                        tools.village.info(btn, decoration.house.village.no);
                    }]);
                    break;
                case "house":
                    propertyArr.push(["楼号:", decoration.house.houseNumber, "grey", function(btn) {

                        tools.house.info(btn, decoration.house.hid);
                    }]);
                    break;
                case "designerName":
                    propertyArr.push(["设计师:", decoration.designer.currentName, "grey", function(btn) {

                        tools.personel.info(btn, decoration.designer.userId);
                    }]);
                    break;
                case "designDepartment":
                    propertyArr.push(["设计部:", decoration.designer.dept.name, "grey", function(btn) {

                        tools.department.info(btn, decoration.designer.dept.did);
                    }]);
                    break;
                case "grade":
                    propertyArr.push(["等级:", decoration.grade, "red"]);
                    break;
                case "salesGrade":
                    propertyArr.push(["销售单等级:", decoration.grade, "red"]);
                    break;
                case "creater":
                    propertyArr.push(["创建人:", v.creater.currentName, "grey", function(btn) {

                        tools.personel.info(btn, v.creater.userId);
                    }]);
                    break;
                case "createTime":
                    propertyArr.push(["创建时间:", v.createTime, "green"]);
                    break;
                case "type":
                    propertyArr.push(["类型:", payment.paymentType[v.type], "red"]);
                    break;
                case "category":
                    propertyArr.push(["品类:", v.category == null || v.category == "" ? "---" : v.category, "grey"]);
                    break;
                case "brand":
                    var brand = payment.htmlName == "sales" ? decoration.brand.name : v.brand;
                    propertyArr.push(["品牌:", brand == null || brand == "" ? "---" : brand, "grey"]);
                    break;
                case "referMoney":
                    var referMoney = payment.htmlName == "activity" ? v.money : v.referMoney;
                    propertyArr.push(["应收金额:", referMoney, "blue"]);
                    break;
                case "contractBalance":
                    propertyArr.push(["合同预付款:", v.balance, "blue"]);
                    break;
                case "materialBalance":
                    propertyArr.push(["主材预付款:", v.materialBalance, "blue"]);
                    break;
                case "collectType":
                    propertyArr.push(["收款类型:", payment.typeData[v.type], "red"]);
                    break;
                case "paymentTypeData":
                    propertyArr.push(["预付款类型:", payment.paymentTypeData[v.paymentType], "red"]);
                    break;
                case "recharge":
                    propertyArr.push(["操作金额:", v.recharge, "blue"]);
                    break;
                case "balance":
                    if(v.status == 0) break;
                    propertyArr.push(["余额:", v.balance, "blue"]);
                    break;
                case "materialPrice":
                    if(v.status == 0) break;
                    propertyArr.push(["主材金额:", v.materialPrice, "blue"]);
                    break;
                case "advanceMoney":
                    if(v.status == 0) break;
                    propertyArr.push(["预付款金额:", v.advanceMoney, "blue"]);
                    break;
                case "servicePrice":
                    var servicePrice = ["common", "pos"].contains(payment.type) ? v.servicePrice : v.serviceMoney;
                    propertyArr.push(["服务费:", servicePrice, "blue"]);
                    break;
                case "projectPrice":
                    propertyArr.push(["工程造价:", v.projectPrice, "blue"]);
                    break;
                case "managePrice":
                    propertyArr.push(["管理费:", v.managePrice, "blue"]);
                    break;
                case "collectUser":
                    var obj = ["sales", "service", "proxy", "oales"].contains(payment.htmlName) ? v[payment.htmlName + "Receipt"] : v;
                    var collecter = ["payment"].contains(payment.htmlName) ? obj.collectUser : obj.collecter;
                    propertyArr.push(["收款人:", collecter != null ? collecter.currentName : "暂无", "grey", function(btn) {

                        tools.personel.info(btn, collecter.userId);
                    }]);
                    break;
                case "collectTime":
                    var obj = ["sales", "service", "proxy", "oales"].contains(payment.htmlName) ? v[payment.htmlName + "Receipt"] : v;
                    propertyArr.push(["收款时间:", obj.collectTime, "green"]);
                    break;
                case "confirmUser":
                    var obj = ["sales", "service", "proxy", "oales"].contains(payment.htmlName) ? v[payment.htmlName + "Receipt"] : v;
                    var confirmer = ["payment"].contains(payment.htmlName) ? obj.confirmUser : obj.confirmer;
                    propertyArr.push(["确认人:", confirmer != null && confirmer.currentName != null ? confirmer.currentName : "暂无", "grey", function(btn) {

                        tools.personel.info(btn, confirmer.userId);
                    }]);
                    break;
                case "confirmTime":
                    var obj = ["sales", "service", "proxy", "oales"].contains(payment.htmlName) ? v[payment.htmlName + "Receipt"] : v;
                    propertyArr.push(["确认时间:", obj.confirmTime, "green"]);
                    break;
                case "isAffirm":
                    propertyArr.push(["客户确认:", payment.isAffirms[v.isAffirm], "red"]);
                    break;
                case "affirmTime":
                    propertyArr.push(["客户确认时间:", com.checkNull(v.affirmTime, "暂无"), "green"]);
                    break;
                case "sales-isAffirm":
                    propertyArr.push(["销售确认:", payment.isAffirms[v.sales.isAffirm], "red"]);
                    break;
                case "sales-affirmTime":
                    propertyArr.push(["销售确认时间:", com.checkNull(v.sales.affirmTime, "暂无"), "green"]);
                    break;
                case "salesRefunds-isAffirm":
                    if(v.salesRefunds == null) break;
                    propertyArr.push(["退货确认:", payment.isAffirms[v.salesRefunds.isAffirm], "red"]);
                    break;
                case "salesRefunds-affirmTime":
                    if(v.salesRefunds == null) break;
                    propertyArr.push(["退货确认时间:", com.checkNull(v.salesRefunds.affirmTime, "暂无"), "green"]);
                    break;
                case "status":
                    var status = ["payment", "sales", "service", "activity", "proxy", "oales"].contains(payment.htmlName) ? statusArr[v.status] : statusArr[v.paymentStatus];
                    propertyArr.push(["状态:", status, "red"]);
                    break;
                case "comment":
                    var obj = ["sales", "proxy", "oales"].contains(payment.htmlName) ? v[payment.htmlName + "Receipt"] : v;
                    propertyArr.push(["备注:", obj.comment, "grey"]);
                    break;
                case "salesDept":
                    propertyArr.push(["渠道部门:", decoration.dept.name, "grey", function(btn) {

                        tools.department.info(btn, decoration.dept.did);
                    }]);
                    break;
                case "title":
                    propertyArr.push(["标题:", v.title, "grey"]);
                    break;
                case "name":
                    propertyArr.push(["姓名:", v.name, "grey"]);
                    break;
                case "phone":
                    propertyArr.push(["电话:", v.phone.substring(0, 3) + "****" + v.phone.substr(v.phone.length - 4), "grey"]);
                    break;
                case "realMoney":
                    var obj = ["sales", "service", "oales"].contains(payment.htmlName) ? v[payment.htmlName + "Receipt"] : v;
                    propertyArr.push(["实收额:", obj.realMoney, "blue"]);
                    break;
                case "isexpire":
                    propertyArr.push(["过期标识:", payment.isexpires[v.isexpire], "red"]);
                    break;
            }
        });
        return propertyArr;
    },

    // 获取验证码
    getCode: function($id, wallet, phone) {

        paymentUtils.setTime($id, wallet.countdown);
        $.ajax({
            url: 'https://www.fanglinserver.com/queryVode + phone=' + phone,
            type: "POST",
            dataType: "json",
            success: function(data) {

                wallet.phoneCode = data;
            }
        });
    },

    // 倒计时
    setTime: function($id, countdown) {

        if (countdown == 0) {
            com.focusPage($id).removeAttr("disabled");
            com.focusPage($id).html("获取验证码");
            countdown = 60;
        } else {
            com.focusPage($id).attr("disabled", true);
            com.focusPage($id).html("重新发送(" + countdown + ")");
            countdown--;
            setTimeout(function() {

                paymentUtils.setTime($id, countdown)
            }, 1000)
        }
    },

    dataURLtoFile: function(dataUrl, fileName) {

        var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, {
            type: mime
        });
    },

    showContractBtn: function(rtid, paymentType, pdfoptions, customerName, receipt) {

        var paymentContract = null;
        var htmlFlag = receipt.htmlName;

        $("#" + htmlFlag + "signBtns button").hide();

        var options = {
            "paymentContract.rtid": rtid,
            "paymentContract.paymentType": paymentType
        };

        com.post(api.payment.queryPaymentContract, options, function(res) {

            paymentContract = res.paymentContract;
        }, function() {

        }, false);

        if (!paymentContract) {
            $("#" + htmlFlag + "createSign").show().unbind("click").click(function() {

                paymentUtils.makeContract(rtid, paymentType, pdfoptions, customerName, receipt);
            });
        } else if (paymentContract && paymentContract.status == 0) {
            $("#" + htmlFlag + "customerSign").show().unbind("click").click(function() {

                paymentUtils.customerSign(paymentContract, params.payment.cid, pdfoptions.orderId, receipt.url);
            });
            $("#" + htmlFlag + "companySign").show().unbind("click").click(function() {

                $("#" + htmlFlag + "paymentContractModal").modal("show");
            });
            $("#" + htmlFlag + "customerSignCode").show().unbind("click").click(function() {

                paymentUtils.customerSignCode(paymentContract, htmlFlag);
            });
            $("#" + htmlFlag + "customerSignSend").show().unbind("click").click(function() {

                paymentUtils.customerSignSend(paymentContract);
            });

            $("#" + htmlFlag + "companySignBtn").unbind("click").click(function() {

                paymentUtils.companySign(paymentContract, $("#" + htmlFlag + "signets").val());
                $("#" + htmlFlag + "paymentContractModal").modal("hide");
            });
        }
    },

    customerSign: function(paymentContract, customerId, orderId, url) {

        com.post(api.payment.signPaymentContractForCustomer, {
            "paymentContract.pcid": paymentContract.pcid,
            "customer.cid": customerId
        }, function(res) {

            com.closePopup();
            com.popup4frame("客户签", res.redirect, null, function() {

                com.popup("专用收款收据__装修单号:" + orderId, url, function() {

                }, null, true);
            });
        });
    },

    companySign: function(paymentContract, signId) {

        com.post(api.payment.signPaymentContractForCompany, {
            "paymentContract.pcid": paymentContract.pcid,
            "signet.sid": signId
        });
    },

    customerSignCode: function(paymentContract, htmlName) {

        paymentUtils.showQRCode(htmlName + "qrcode", "http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?dcid=" + paymentContract.pcid + "&type=2&module=payment", htmlName + "paymentContractQrcodeModal");
    },

    customerSignSend: function(paymentContract) {

        com.showConfirm("是否发送签订通知", function() {

            com.post(api.payment.sendPaymentContract, {
                "paymentContract.pcid": paymentContract.pcid,
                "paymentContract.type": 2
            }, function(res) {

                com.showAlert(com.info, "发送成功");
            });
        });
    },

    bindSignet: function(id) {

        com.post(api.data.querySignet, {
            "signet.type": 1
        }, function(res) {

            var signets = res.signets;

            if (signets.length == 0)
                return;

            for ( var i = 0; i < signets.length; i++) {
                var item = signets[i];
                $("<option value=" + item["sid"] + ">" + item["name"] + "</option>").appendTo(id);
            }
        });
    },

    showQRCode: function(id, url, modal) {

        $("#" + id).html("").qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: url
        });
        $("#" + id).css({
            "text-align": "center",
            "padding-top": "10px"
        });
        $("#" + modal).modal('show');
    },
    getReceiptRowspan: function(receipt, i, receiptRowspan) {

        var receiptSubRowspan = utils.accSub(receipt.receiptsNum, utils.accMul(receipt.onePageCount, i));
        receiptRowspan = receiptSubRowspan > receipt.onePageCount ? receipt.onePageCount : receiptSubRowspan;
        return receiptRowspan;
    },
    getBankRowspan: function(receipt, i, start, bankRowspan) {

        var paymentWay = receipt.receipts[start].paymentWay;

        var cashAndCheck = 0;
        cashAndCheck = parseFloat(receipt.cash) > 0 ? utils.accAdd(cashAndCheck, 1) : cashAndCheck;
        cashAndCheck = paymentWay == "银行" && receipt.checkBankInfoNum > 0 ? utils.accAdd(cashAndCheck, receipt.checkBankInfoNum) : cashAndCheck;
        var surplusCheckvCount = utils.accSub(cashAndCheck, utils.accMul(i, receipt.onePageCount));// 剩下要画的刷卡数

        if (surplusCheckvCount > 0) {
            var currentDrawBankCount = utils.accSub(receipt.onePageCount, surplusCheckvCount); // 当前页剩余的可以画银行的条数
            bankRowspan = receipt.receipts[start].bankInfoNum > currentDrawBankCount ? currentDrawBankCount : receipt.receipts[start].bankInfoNum;
        } else {
            var amount = utils.accMul(i, receipt.onePageCount);
            var drawBankCount = Math.abs(utils.accSub(amount, cashAndCheck)); // 已经画过的银行条数

            var bankSubRowspan = utils.accSub(receipt.receipts[start].bankInfoNum, drawBankCount); // 要画的当前页条数
            bankRowspan = bankSubRowspan > receipt.onePageCount ? receipt.onePageCount : bankSubRowspan;
        }

        return bankRowspan;
    },

    makeContract: function(rtid, paymentType, options, customerName, receipt) {

        var date = new Date();
        options["customerName"] = customerName;
        options["receiptNo"] = receipt.receiptNo;
        options["path"] = "/views/contract/receipTemplate.html";
        options["organization"] = receipt.organization;
        options["contractTime"] = date.getFullYear() + "年" + utils.accAdd(date.getMonth(), 1) + "月" + date.getDate() + "日";

        var data = JSON.stringify(options);

        com._post_(api.home.library, {
            "api": "contract.contract.receipt",
            "receipt": data,
            "redis": 0
        }, function(res) {

            if (res.code == 0) {

                var contractOptions = {
                    "paymentContract.rtid": rtid,
                    "paymentContract.orderId": options["orderId"],
                    "paymentContract.paymentType": paymentType,
                    "paymentContract.viewpdf": "http://www.fanglinserver.com/" + res.resUrl
                };

                com.post(api.payment.addPaymentContract, contractOptions, function(data) {

                    paymentUtils.showContractBtn(rtid, paymentType, options, customerName, receipt);
                    com.showAlert(com.info, "操作成功")
                })
            } else {
                com.showAlert(com.error, res.msg);
            }
        });
    },

    initSignet: function(htmlName) {

        com.initForm($("#" + htmlName + "paymentContractModal"), "印章", [{
            "id": htmlName + "signets",
            "type": "select",
            "clazz": "",
            "name": "选择印章:",
            "validator": "v_required"
        }], [{
            "id": htmlName + "companySignBtn",
            "clazz": "btn btn-primary",
            "name": "提交"
        }]);
    },

    initQrcode: function(htmlName, id) {

        com.initForm($("#" + id), "二维码", [{
            "id": htmlName + "qrcode",
            "type": "div",
            "clazz": "qrcode"
        }], []);
    },

    pushPosBank: function(flag, bankUtil, id, html) {

        var $span = $('<span></span>').addClass('fl-filter-inline pull-right');
        var $label = $('<label></label>').html("默认方式:");
        var $input = $('<input/>').prop("id", html + "paytranBankName").attr({
            "type": "text",
            "data-type": "autofill",
            "autocomplete": "off"
        });
        $span.append($label).append($input);

        if (flag)
            $span.appendTo(id);

        com.selectTypeahead($input, bankUtil, "key", "value", null);
    }
};
