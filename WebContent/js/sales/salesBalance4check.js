$(function() {

    var salesBalance = {

        balanceType: {},
        status: {},
        salesPaymentForStatus: {},
        salesPaymentType: {},
        oneType: {},
        balanceSaleses: {},

        items: {
            balanceSales: com.focusPage("#balanceSales"),
        },

        modals: {
            balanceSalesModal: com.focusPage("#balanceSalesModal"),
        },

        btns: {
            balanceSalesBtn: com.focusPage("#balanceSalesBtn", "#balanceSalesModal"),
        },

    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);

    salesBalance.btns.balanceSalesBtn.click(balanceSales);

    com.post(api.data.queryReceiptType, {}, function(res) {

        salesBalance.salesPaymentForStatus.cash = [];
        salesBalance.salesPaymentForStatus.bank = [];
        salesBalance.salesPaymentForStatus.checkBank = [];
        salesBalance.salesPaymentForStatus.accounts = [];
        salesBalance.salesPaymentForStatus.couponType = [];

        salesBalance.salesPaymentForStatus.cashInfo = {};
        salesBalance.salesPaymentForStatus.bankInfo = {};
        salesBalance.salesPaymentForStatus.checkBankInfo = {};
        salesBalance.salesPaymentForStatus.accountsInfo = {};
        salesBalance.salesPaymentForStatus.couponTypeData = {};

        $.each(res.receiptTypes, function(i, v) {

            if (v.type == constant.data().receiptType.TYPE_CASH_INT) {
                salesBalance.salesPaymentForStatus.cash.push(v);
                salesBalance.salesPaymentForStatus.cashInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_BANK_INT) {
                salesBalance.salesPaymentForStatus.bank.push(v);
                salesBalance.salesPaymentForStatus.bankInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_CHECK_INT) {
                salesBalance.salesPaymentForStatus.checkBank.push(v);
                salesBalance.salesPaymentForStatus.checkBankInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_ACCOUNT_INT) {
                salesBalance.salesPaymentForStatus.accounts.push(v);
                salesBalance.salesPaymentForStatus.accountsInfo[v.no] = v.name;
            } else if (v.type == constant.data().receiptType.TYPE_COUPON_INT) {
                salesBalance.salesPaymentForStatus.couponType.push(v);
                salesBalance.salesPaymentForStatus.couponTypeData[v.no] = [v.no, v.name];
            }
        });

    }, null, false);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $ulCheck = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnPayment = $('<a></a>').addClass('btn btn-minier btn-danger').html('款项');
                    var $btnBalanceItem = $('<a></a>').addClass('btn btn-minier btn-pink').html('子项');

                    var coupon = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.coupon;
                    var maling = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.maling;
                    var venderMaling = v.onetype == constant.sales().salesBalance.ONETYPE_REFUND_INT ? constant.sales().salesBalance.ONETYPE_INIT_INT : v.sales.venderMaling;
                    var propertyArr = [];
                    var styleArr = [];
                    var checkArr = [];
                    var realSalesTotal = utils.changeThrDecimal(v.total - v.sales.venderMaling - v.sales.maling - v.sales.coupon);
                    var accountPay = utils.changeThrDecimal(v.vbalance - v.sales.venderMaling);
                    $.each(pageConfig.propertyArr, function(pi, pv) {

                        switch (pv) {
                            case "orderId":
                                propertyArr.push(["装修单号:", v.sales.orderId, "blue", tools.decoration.info, v.sales.orderId]);
                                break;
                            case "address":
                                propertyArr.push(["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"]);
                                break;
                            case "salesman":
                                propertyArr.push(["渠道:", v.salesman.currentName, "grey", tools.personel.info, v.salesman.userId]);
                                break;
                            case "dept":
                                propertyArr.push(["归属部门:", v.dept.name, "grey", tools.department.info, v.dept.did]);
                                break;
                            case "region":
                                propertyArr.push(["归属大区:", v.region.name, "grey", tools.department.info, v.region.did]);
                                break;
                            case "instorer":
                                propertyArr.push(["驻店:", v.sales.instorer.currentName, "grey", tools.personel.info, v.sales.instorer.userId]);
                                break;
                            case "brand":
                                propertyArr.push(["品牌:", v.sales.brand, "grey", tools.brand.info, v.sales.bid]);
                                break;
                            case "depositpay":
                                propertyArr.push(["定金:", v.sales.depositpay, "blue"]);
                                break;
                            case "fullpay":
                                propertyArr.push(["补款:", v.sales.fullpay, "blue"]);
                                break;
                            case "prevalue":
                                propertyArr.push(["预结值:", v.balance, "blue"]);
                                break;
                            case "precreater":
                                propertyArr.push(["预结人:", v.creater.currentName, "grey", tools.personel.info, v.creater.userId]);
                                break;
                            case "pbalance":
                                propertyArr.push(["结算值:", v.pbalance, "blue"]);
                                break;
                            case "balanceTime":
                                propertyArr.push(["结算时间:", v.postTime, "green"]);
                                break;
                            case "poster":
                                propertyArr.push(["结算人:", v.poster.currentName, "grey", tools.personel.info, v.poster.userId]);
                                break;
                            case "vbalance":
                                propertyArr.push(["厂结值:", v.vbalance, "blue"]);
                                break;
                            case "grade":
                                propertyArr.push(["等级:", v.sales.grade, "red"]);
                                break;
                            case "maling":
                                propertyArr.push(["抹零:", maling, "blue"]);
                                break;
                            case "venderMaling":
                                checkArr.push(["厂商抹零:", venderMaling, "green"]);
                                break;
                            case "coupon":
                                propertyArr.push(["券值:", coupon, "blue"]);
                                break;
                            case "couponInfo":
                                propertyArr.push(["券信息:", v.sales.couponInfo, "grey"]);
                                break;
                            case "type":
                                propertyArr.push(["类型:", constant.sales().salesBalance.type.keys[v.type], "red"]);
                                break;
                            case "allowance":
                                styleArr.push(["补贴:", v.allowance, "blue"]);
                                break;
                            case "salesBananceCoupon":
                                styleArr.push(["结算券值:", v.coupon, "blue"]);
                                break;
                            case "total":
                                styleArr.push(["总价:", v.total, "blue"]);
                                break;
                            case "preCreateTime":
                                styleArr.push(["预结时间:", v.createTime, "green"]);
                                break;
                            case "venderTime":
                                styleArr.push(["厂结时间:", v.venderTime, "green"]);
                                break;
                            case "oneType":
                                styleArr.push(["一类:", constant.sales().salesBalance.onetype.keys[v.onetype], "red"]);
                                break;
                            case "status":
                                styleArr.push(["状态:", constant.sales().salesBalance.status.keys[v.status], "red"]);
                                break;
                            case "realSalesTotal":
                                checkArr.push(["实际销售额:", realSalesTotal, "blue"]);
                                break;
                            case "salesvtotal":
                                checkArr.push(["销售收入厂商结算额:", v.total, "blue"]);
                                break;
                            case "salesvpay":
                                checkArr.push(["销售成本厂商借款额:", v.vbalance, "green"]);
                                break;
                            case "accountPay":
                                checkArr.push(["应付账款:", accountPay, "red"]);
                                break;
                        }
                    });

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });
                    var _label = $('<label></label>');
                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "sbids",
                        "class": "",
                        "data-sbid": v.sbid,
                        "data-status": v.status,
                        "data-vbalance": v.vbalance,
                        "data-pbalance": v.pbalance,
                        "data-bid": v.sales.bid,
                        "data-onetype": v.onetype,
                        "data-type": v.type,
                        "data-depositpay": v.sales.depositpay,
                        "data-fullpay": v.sales.fullpay,
                        "data-total": v.total,
                        "data-allowance": v.allowance,
                        "data-venderMaling": v.sales.venderMaling
                    }).addClass('ace ace-checkbox-2');
                    var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.sales.no);
                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>').appendTo($ulProperty);

                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                        if (value.length == 5) {
                            $liProperty.click(function() {

                                value[3]($liProperty, value[4]);

                            }).css("cursor", "pointer");
                        }
                    });

                    $.each(styleArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulStyle);
                    });

                    $.each(checkArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulCheck);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty).append($ulStyle).append($ulCheck);
                    $.each(pageConfig.pageBtn, function(k, b) {

                        switch (b) {
                            case "sub":
                                $btnDiv.append($btnBalanceItem);
                                break;
                            case "payment":
                                $btnDiv.append($btnPayment);
                                break;
                        }
                    });
                    $label.appendTo($h3);
                    $btnDiv.appendTo($h3);

                    $btnPayment.click(function(e) {

                        params.sales.sales = v.sales;
                        params.sales.type = "balance";

                        com.popup4page("#viewPopUp", "views/sales/sales4payment.html", "收款");
                    });

                    $btnBalanceItem.click(function(e) {

                        params.sales.sales = v.sales;
                        params.sales.salesBalance = v;

                        com.popup4page("#viewPopUp", "views/sales/salesItem4balance.html", "子项");
                    });

                });

                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(pageConfig.condArr, 'condList', pageConfig.apiPage, function(data) {

        displayFunc.init('resultList', data);

    }, 'pagenation', "salesBalanceCheckPostData", null, false, null, function() {

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        var $checkspan = $('<span></span>').text('全选').appendTo($checka);

        var $balanceEnd = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'balanceEnd').css("margin", "0px 3px");
        var $balanceiEnd = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($balanceEnd);
        var $balancespanEnd = $('<span></span>').text('对账').appendTo($balanceEnd);

        $checka.click(function() {

            checkAll();
        });

        $balanceEnd.click(function() {

            salesBalance.modals.balanceSalesModal.modal("show");
        });

        return [$checka, $balanceEnd];

    }, 'resultList');

    com.initTypeahead("balanceSales", api.balance.queryBalanceSales, "balanceSales.name", {}, "balanceSaleses", "bsid", function(v) {

        return v["name"] + " " + v["grade"]
    });

    // 收款显示
    function viewSalesPaymentLine(tableId, listData) {

        var $tableWrap = com.focusPage('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (listData && listData.salesPayments.length) {
            $.each(listData.salesPayments, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(constant.payment().materialPayment.paymentType.keys[v.type]);
                var propertyArr = [["销售单号:", v.sales.no, "blue"], ["品类:", v.sales.category, "grey"], ["品牌:", v.sales.brand, "grey"], ["应收额:", v.referMoney, "blue"], ["收款时间:", v.salesReceipt.collectTime, "green"], ["确认时间:", v.salesReceipt.confirmTime, "green"], ["状态:", v.status == 0 ? '初始' : v.status == 1 ? '待确认' : '已确认', "red"]];
                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var addPropertyArr = [];

                v.salesReceipt.cash != null && v.salesReceipt.cash != "0" ? addPropertyArr.push(["现金:", v.salesReceipt.cash, "blue"]) : true;
                v.salesReceipt.bank != null && v.salesReceipt.bank != "0" ? addPropertyArr.push(["银行信息:", (function(bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for ( var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += salesBalance.salesPaymentForStatus.bankInfo[_i[0]] + " " + _i[1] + ", ";
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

                $small.appendTo($h3);
                $liLine.append($h3).append($ulProperty).appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        }
    }

    // 子项显示
    var salesBalanceItemList = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');
            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue').html(v.salesItem.goods.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var propertyArr = [["商品品类:", v.salesItem.goods.category, "grey", "category"], ["商品颜色:", v.salesItem.color.name, "grey", "color"], ["商品规格:", v.salesItem.format.info, "grey", "format"], ["售价:", v.salesItem.selling, "blue", "selling"], ["折扣价:", v.salesItem.disPrice, "blue", "disPrice"], ["折让价:", v.salesItem.price, "blue", "price"], ["数量:", v.num, "blue", "num"], ["总价:", v.total, "blue", "total"], ["结算方式:", v.ctype == 0 ? "底价" : "点位", "red", "ctype"], ["结算值:", v.cvalue, "blue", "cvalue"], ["备注:", v.salesItem.comment, "grey", "comment"]];

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>').css({
                            "border-bottom": "0px"
                        });
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $small.appendTo($h3);
                    $btnDiv.appendTo($h3);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                });

                $ul.appendTo($tableWrap);
            }
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();

    function checkAll() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    }

    function balanceSales() {

        if (com.validate('balanceSalesModal'))
            return false;

        var options = {};
        var balanceSales = {};
        var index = 0;

        var income = 0;
        var cost = 0;
        var payment = 0;
        var profit = 0;

        var inputs = com.focusPage('input[name="sbids"]:checked', '#resultList');
        var bsid = com.typeahead("balanceSales");

        if (!inputs.length) {
            com.showAlert(com.warning, "请选择结算单");
            return false;
        }
        com.post(api.balance.countBalanceSalesBalance, {
            "balanceSales.bsid": bsid
        }, function(res) {

            count = res.count;
        }, null, false);

        if (count + inputs.length > 500) {
            com.showAlert(com.warning, "数据量过大");
            return false;
        }

        com.post(api.balance.queryBalanceSalesByBsid, {
            "balanceSales.bsid": bsid
        }, function(res) {

            balanceSales = res.balanceSales;
        }, null, false);

        var brand = balanceSales.brand;

        for ( var i = 0; i < inputs.length; i++) {

            var input = $(inputs[i]);
            var status = input.attr("data-status");
            var bid = input.attr('data-bid');
            var sbid = input.attr('data-sbid');
            var pbalance = input.attr('data-pbalance');
            var oneType = input.attr('data-onetype');
            var type = input.attr('data-type');
            var venderMaling = Math.round(input.attr('data-venderMaling'));
            var depositpay = input.attr('data-depositpay');
            var fullpay = input.attr('data-fullpay');
            var total = input.attr('data-total');
            var _income = 0;
            var _payment = 0;

            if (oneType == constant.sales().salesBalance.ONETYPE_INIT_INT) {
                if (type == 3) {
                    venderMaling = 0;
                    _income = depositpay;
                    _payment = utils.accSub(pbalance, venderMaling);
                } else {
                    _income = utils.accAdd(depositpay, fullpay);
                    _payment = utils.accSub(pbalance, venderMaling);
                }
            }
            if (oneType == constant.sales().salesBalance.ONETYPE_REFUND_INT) {
                _income = total;
                _payment = pbalance;
            }
            if (oneType == constant.sales().salesBalance.ONETYPE_ALLBACK_INT || oneType == constant.sales().salesBalance.ONETYPE_DBACKORDER_INT) {
                _income = total;
                _payment = utils.accAdd(pbalance, venderMaling);
            }

            var _profit = utils.accSub(_income, _payment);

            income = utils.accAdd(income, _income);
            cost = utils.accAdd(cost, pbalance);
            payment = utils.accAdd(payment, _payment);
            profit = utils.accAdd(profit, _profit);

            if (status != constant.sales().salesBalance.STATUS_BALANCE_INT) {
                com.showAlert(com.warning, "请选择结算状态的结算单");
                return false;
            }

            options["balanceSalesBalances[" + index + "].salesBalance.sbid"] = sbid;
            index += 1;
        }

        if (!options)
            return false;

        options["balanceSales.bsid"] = bsid;

        options["balanceSales.income"] = utils.accAdd(income, balanceSales.income);
        options["balanceSales.cost"] = utils.accAdd(cost, balanceSales.cost);
        options["balanceSales.payment"] = utils.accAdd(payment, balanceSales.payment);
        options["balanceSales.profit"] = utils.accAdd(profit, balanceSales.profit);

        if (options["balanceSales.payment"] > 1000000) {
            com.showAlert(com.warning, "结算总额过大");
            return false;
        }

        com.post(api.balance.submitBalanceSales, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }

});