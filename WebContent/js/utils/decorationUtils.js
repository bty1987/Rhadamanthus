var decorationUtils = {

    initMaterial: function(decorationDetail) {

        var dataPage = params.urlLoadParams.depage;
        var $fanglinMaterial = com.focusPage('#fanglinMaterialPayments' + dataPage).html("");
        var $salesMaterialPayment = com.focusPage('#salesMaterialPayments' + dataPage).html("");
        var $salesResult = com.focusPage('#salesResultList' + dataPage).html("");
        var $oalesResult = com.focusPage('#oalesResultList' + dataPage).html("");
        var $brand = com.focusPage('#materialPaymentBrands' + dataPage).html("");
        var $oalesBrand = com.focusPage('#oalesPaymentBrands' + dataPage).html("");
        var $purCategory = com.focusPage('#materialPurchasedCategory' + dataPage).html("");
        var $unpCategory = com.focusPage('#materialUnpurchasedCategory' + dataPage).html("");

        var $ulfanglin = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($fanglinMaterial);
        var $ulsales = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesMaterialPayment);
        var $uloales = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($oalesResult);
        var $ulsalesResult = null;
        var $ulbrand = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($brand);
        var $uloalesBrand = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($oalesBrand);
        var $purchasedCategory = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($purCategory);
        var $unpurchasedCategory = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($unpCategory);

        var $oalesTotal = 0;
        var $oalesScaleTotal = 0;
        var $total = 0;
        var $coupon = 0;
        var $totalSalesAndMaterial = 0;
        var $totalDeposit = 0;
        var $totalSubsidy = 0;

        var $statues = {};
        var $balanceStatuses = {};
        var $depositpayStatus = {};
        var $fullpayStatus = {};

        var materialPayments = null;
        var salesPayments = null;
        var oaleses = null;

        var purCategory = [];
        var unpCategory = [];

        $statues = constant.sales().sales.status.keys;
        $balanceStatuses = constant.sales().sales.balanceStatus.keys;
        $depositpayStatus = constant.sales().sales.depositpayStatus.keys;
        $fullpayStatus = constant.sales().sales.fullpayStatus.keys;

        com.focusPage("a[name='consumptionDetailsPrint']").click(function() {

            params.decoration.orderId = decorationDetail.orderId;
            com.popup("主材消费明细表", api.index.decorationSales2print.url, null, null, true);
        });

        var displayFunc = (function() {

            var renderList = function(tableId, listData) {

                var $tableWrap = com.focusPage('#' + tableId).empty();
                $ulsalesResult = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesResult);

                if (listData && listData.length) {
                    $.each(listData, function(i, v) {

                        creatLine(v).appendTo($ulsalesResult);
                    });

                    $ulsalesResult.appendTo($tableWrap);
                }
            };

            var creatLine = function(v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.no));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');

                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                var $btnSub = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('子项');

                var propertyArr = [["品类:", v.category, "grey"], ["品牌:", v.brand.name, "grey"], ["定金:", v.depositpay, "blue"], ["补款:", v.fullpay, "blue"], ["总额:", v.total, "blue"], ["当前总额:", v.amount, "blue"], ["优惠券:", salesReceiptMap[v.sid] ? salesReceiptMap[v.sid].coupon : 0, "blue"], ["券信息:", salesReceiptMap[v.sid] ? salesReceiptMap[v.sid].couponInfo : "", "grey"], ["定金状态:", $depositpayStatus[v.depositpayStatus], "red"], ["补款状态:", $fullpayStatus[v.fullpayStatus], "red"], ["状态:", $statues[v.status], "red"], ["结算状态:", $balanceStatuses[v.balanceStatus], "red"], ["类型:", constant.sales().sales.type.keys[v.type], "red"], ["创建时间:", v.createTime, "green "], ["补款时间:", v.fullpayTime, "green "], ["结算时间:", v.balanceTime, "green "], ["完结时间:", v.finishTime, "green "], ["完结人:", v.finisher.currentName, "blue"]];

                // 国补单(type=1)利润=总价-结算值(salesbalance.pbalance,type=0/onetype=0),无购货结算行显示-
                if (v.type == 1) {
                    propertyArr.splice(6, 0, ["利润额:", salesBalanceMap[v.sid] != null ? utils.changeThrDecimal(utils.accSub(v.total, salesBalanceMap[v.sid])) : "-", "blue"]);
                }

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $divBtnWrap.append($btnSub).appendTo($h4);
                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

                $btnSub.click(function() {

                    params.sales.sales = v;
                    params.sales.dompany = "dompany";
                    params.sales.type = decorationDetail.pageType;

                    com.popup4page("#layerPopUp", "/views/sales/salesItem.html", "子项", '', function() {

                        loadSalesResult();
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

        var saleses = [];
        var salesReceiptMap = {};// 销售单收款券:sid -> {coupon, couponInfo},取salesReceipt的券
        var salesBalanceMap = {};// 国补单(type=1)sid -> 购货结算行pbalance,用于计算利润

        com.post(api.payment.querySalesPaymentByOrderId, {
            "salesPayment.sales.orderId": decorationDetail.orderId
        }, function(res) {

            salesPayments = res.salesPayments;
        }, null, false);

        var loadSalesResult = function() {

            com.post(api.sales.querySalesByOrderId, {
                "sales.orderId": decorationDetail.orderId
            }, function(res) {

                saleses = res.saleses;
            }, null, false);

            // 收款券映射,批量收款同一收款单(srId)只计一次
            salesReceiptMap = {};
            var receiptFlags = {};

            if (salesPayments && salesPayments.length) {

                $.each(salesPayments, function(i, v) {

                    if (v.status == constant.payment().salesPayment.STATUS_INIT_INT)
                        return true;

                    var salesReceipt = v.salesReceipt;

                    if (salesReceipt.srId != null && receiptFlags[salesReceipt.srId])
                        return true;
                    receiptFlags[salesReceipt.srId] = true;

                    if (salesReceipt.coupon == null || salesReceipt.coupon == "0")
                        return true;

                    var _coupon = [2, 3, 8].contains(v.type) ? salesReceipt.coupon : -salesReceipt.coupon;

                    if (salesReceiptMap[v.sales.sid]) {
                        salesReceiptMap[v.sales.sid].coupon = utils.changeThrDecimal(utils.accAdd(salesReceiptMap[v.sales.sid].coupon, _coupon));
                        salesReceiptMap[v.sales.sid].couponInfo += " " + salesReceipt.couponInfo.split('#').join(' ');
                    } else {
                        salesReceiptMap[v.sales.sid] = {
                            "coupon": utils.changeThrDecimal(_coupon),
                            "couponInfo": salesReceipt.couponInfo.split('#').join(' ')
                        };
                    }
                });
            }

            salesBalanceMap = {};

            var sids = [];

            saleses && $.each(saleses, function(i, v) {

                if (v.type == 1) {
                    sids.push(v.sid);
                }
            });

            if (sids.length) {

                var options = {
                    "salesBalance.sales.orderId": decorationDetail.orderId,
                    "salesBalance.type": 0,
                    "salesBalance.onetype": 0
                };

                $.each(sids, function(i, sid) {
                    options["sid[" + i + "]"] = sid;
                });

                com.post(api.sales.querySalesBalanceByOrderId, options, function(res) {

                    $.each(res.salesBalances, function(i, v) {
                        salesBalanceMap[v.sales.sid] = v.pbalance;
                    });
                }, null, false);
            }

            saleses.length == 0 ? noData("salesResultList" + dataPage) : displayFunc.init('salesResultList' + dataPage + '', saleses);
        };

        loadSalesResult();

        com.post(api.sales.queryOalesByOrderId, {
            "oales.decoration.orderId": decorationDetail.orderId
        }, function(res) {

            oaleses = res.oaleses;
        }, null, false);

        if (oaleses && oaleses.length) {
            $.each(oaleses, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.no));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [["品类:", v.category, "grey"], ["品牌:", v.brand, "grey"], ["总额:", v.total, "blue"], ["利润额:", v.profit, "blue"], ["类型:", constant.sales().oales.type.keys[v.type], "red"], ["计入配比:", constant.sales().oales.isScale.keys[v.isScale], "red"], ["计入积分:", constant.sales().oales.isActivity.keys[v.isActivity], "red"], ["复核时间:", v.checkTime, "green"], ["备注:", v.comment, "grey"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                // 已购品牌汇总
                if (v.status == constant.sales().oales.STATUS_INVALID_INI) {
                    $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock).appendTo($uloales);
                    return true;
                }

                if (purCategory.indexOf(v.category) == -1) {
                    purCategory.push(v.category);
                }

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock).appendTo($uloales);

                // 退货(type=1)取负,购货(type=0)为正,品牌金额按类型加减
                var _refer = v.type == constant.sales().oales.TYPE_REFUND_INT ? -v.total : v.total;

                var $oalesBrands = com.focusPage("[name='" + v.brand + "_o']");

                if ($oalesBrands.length > 0) {

                    var $oalesBrand = com.focusPage($oalesBrands[0]);
                    var $brandTotal = com.focusPage($oalesBrand.find("[name='total']")[0]);

                    var _value = parseFloat($brandTotal.attr('value'));
                    var _total = utils.changeThrDecimal(_value + _refer);

                    $brandTotal.attr("value", _total);
                    $brandTotal.html(_total);

                    $oalesTotal = utils.changeThrDecimal($oalesTotal + _refer);
                    if (v.isScale == 0) {
                        $oalesScaleTotal = utils.changeThrDecimal($oalesScaleTotal + _refer);
                    }

                } else {

                    var $liLine_2 = $('<li></li>').addClass('item-orange clearfix').attr("name", v.brand + "_o");
                    var $h4_2 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.brand));
                    var $ulProperty_2 = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    $('<b></b>').html(v.category).addClass("grey").appendTo($('<strong></strong>').html("品类:").appendTo($('<li></li>').appendTo($ulProperty_2)));
                    $('<b></b>').html(v.brand).addClass("grey").appendTo($('<strong></strong>').html("品牌:").appendTo($('<li></li>').appendTo($ulProperty_2)));
                    $('<b></b>').html(constant.sales().oales.atttype.keys[v.atttype]).addClass("red").appendTo($('<strong></strong>').html("类型:").appendTo($('<li></li>').appendTo($ulProperty_2)));
                    $('<b></b>').attr("name", "total").attr("value", _refer).html(_refer).addClass("blue").appendTo($('<strong></strong>').html("金额:").appendTo($('<li></li>').appendTo($ulProperty_2)));
                    $('<b></b>').html(constant.data().brand.atttype.keys[v.branding.atttype]).addClass("red").appendTo($('<strong></strong>').html("类型:").appendTo($('<li></li>').appendTo($ulProperty_2)));

                    $liLine_2.append($h4_2).append($ulProperty_2).appendTo($uloalesBrand);

                    $oalesTotal = utils.changeThrDecimal($oalesTotal + _refer);
                    if (v.isScale == 0) {
                        $oalesScaleTotal = utils.changeThrDecimal($oalesScaleTotal + _refer);
                    }
                }
            });
        }

        com.post(api.payment.queryMaterialPaymentByOrderId, {
            "materialPayment.material.orderId": decorationDetail.orderId
        }, function(res) {

            materialPayments = res.materialPayments;
        }, null, false);

        if (materialPayments && materialPayments.length) {
            $.each(materialPayments, function(i, v) {

                if (v.paymentStatus == 0)
                    return true;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.material.no + " " + constant.payment().materialPayment.paymentType.keys[v.paymentType]));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [["品类:", v.category, "grey"], ["品牌:", v.brand, "grey"], ["应收额:", v.referMoney, "blue"], ["实收额:", v.referMoney, "blue"], ["收款时间:", v.collectTime, "green"], ["状态:", materialUtils.paymentStatusInit(v.paymentStatus), "red"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var styleArr = [];

                v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
                v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for ( var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
                    }

                    return info;
                })(v.bank, v.bankInfo), "grey"]) : true;
                v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "grey"]) : true;
                v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "grey"]) : true;
                v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "grey"]) : true;
                v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "grey"]) : true;
                v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "grey"]) : true;

                $.each(styleArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulStyle);
                });

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock).appendTo($ulfanglin);

                var $materialBrands = com.focusPage("[name='" + v.brand + "_m']");

                if (![2, 7].contains(v.paymentType) && v.paymentStatus == 2) {
                    var $totalMaterial = [4, 5, 6].contains(v.paymentType) ? -v.referMoney : v.referMoney;
                    $totalSalesAndMaterial = utils.changeThrDecimal($totalSalesAndMaterial + $totalMaterial)
                }

                if (v.paymentType == 2) {
                    $totalDeposit = utils.changeThrDecimal($totalDeposit + v.referMoney)
                }

                if ($materialBrands.length > 0) {

                    var $materialBrand = com.focusPage($materialBrands[0]);
                    var $brandTotal = com.focusPage($materialBrand.find("[name='total']")[0]);
                    var $brandCoupon = com.focusPage($materialBrand.find("[name='coupon']")[0]);

                    var _value = parseFloat($brandTotal.attr('value'));
                    var _refer = [2, 3, 8].contains(v.paymentType) ? v.referMoney : -v.referMoney;
                    var _total = utils.changeThrDecimal(_value + _refer);
                    var _coupon = [2, 3, 8].contains(v.paymentType) ? v.coupon : -v.coupon;

                    $brandTotal.attr("value", _total);
                    $brandTotal.html(_total);

                    var _couponTotal = utils.changeThrDecimal(parseFloat($brandCoupon.attr('value')) + _coupon);
                    $brandCoupon.attr("value", _couponTotal);
                    $brandCoupon.html(_couponTotal);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);

                } else {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix').attr("name", v.brand + "_m");
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.brand));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var _refer = [2, 3, 8].contains(v.paymentType) ? v.referMoney : -v.referMoney;
                    var _coupon = [2, 3, 8].contains(v.paymentType) ? v.coupon : -v.coupon;

                    $('<b></b>').html(v.category).addClass("grey").appendTo($('<strong></strong>').html("品类:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').html(v.brand).addClass("grey").appendTo($('<strong></strong>').html("品牌:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').attr("name", "total").attr("value", _refer).html(_refer).addClass("blue").appendTo($('<strong></strong>').html("金额:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').attr("name", "coupon").attr("value", _coupon).html(_coupon).addClass("blue").appendTo($('<strong></strong>').html("优惠券:").appendTo($('<li></li>').appendTo($ulProperty)));

                    $liLine.append($h4).append($ulProperty).appendTo($ulbrand);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                }
            });
        }

        com.post(api.data.queryCategory, {}, function(res) {

            $.each(res.categorys, function(index, value) {

                if (value.type == 0)
                    return;

                if (unpCategory.indexOf(value.name) == -1 && (value.name) != "") {
                    unpCategory.push(value.name);
                }
            });
        }, null, false);

        if (salesPayments && salesPayments.length) {

            $.each(salesPayments, function(i, v) {

                var salesReceipt = v.salesReceipt;

                if (v.status == constant.payment().salesPayment.STATUS_INIT_INT)
                    return true;
                if (v.sales.type == 1) {
                    v.sales.brand.name = v.sales.brand.name + '(补贴)';
                }

                if (purCategory.indexOf(v.sales.category) == -1) {
                    purCategory.push(v.sales.category);
                }

                if (unpCategory.indexOf(v.sales.category) != -1 && unpCategory.splice(unpCategory.indexOf(v.sales.category), 1))
                    ;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.sales.no + " " + constant.payment().materialPayment.paymentType.keys[v.type]));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [["品类:", v.sales.category, "grey"], ["品牌:", v.sales.brand.name, "grey"], ["应收额:", v.referMoney, "blue"], ["实收额:", v.referMoney, "blue"], ["收款时间:", salesReceipt.collectTime, "green "], ["状态:", materialUtils.paymentStatusInit(v.status), "red"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var styleArr = [];

                salesReceipt.cash != null && salesReceipt.cash != "0" ? styleArr.push(["现金:", salesReceipt.cash, "blue"]) : true;
                salesReceipt.bank != null && salesReceipt.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for ( var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
                    }

                    return info;
                })(salesReceipt.bank, salesReceipt.bankInfo), "grey"]) : true;
                salesReceipt.checkv != null && salesReceipt.checkv != "0" ? styleArr.push(["转账:", salesReceipt.checkv, "grey"]) : true;
                salesReceipt.installment != null && salesReceipt.installment != "0" ? styleArr.push(["分期:", salesReceipt.installment, "grey"]) : true;
                salesReceipt.accounts != null && salesReceipt.accounts != "0" ? styleArr.push(["对公帐户:", salesReceipt.accounts, "grey"]) : true;
                salesReceipt.advance != null && salesReceipt.advance != "0" ? styleArr.push(["预付款:", salesReceipt.advance, "grey"]) : true;
                salesReceipt.coupon != null && salesReceipt.coupon != "0" ? styleArr.push(["优惠券:", salesReceipt.coupon + salesReceipt.couponInfo.split('#').join(' '), "grey"]) : true;

                $.each(styleArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulStyle);
                });

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock).appendTo($ulsales);

                if (v.sales.type == 1 && v.sales.balanceStatus == 3) {
                    $totalSubsidy = utils.changeThrDecimal($totalSubsidy + ([4, 5, 6].contains(v.type) ? -v.referMoney : v.referMoney));
                }

                if (v.sales.type == 1 && v.sales.balanceStatus != 3) {
                    return true;
                }

                var $salesBrands = com.focusPage("[name='" + v.sales.brand.name + "_s']");

                if (![2, 7].contains(v.type) && v.status == 2) {
                    var $totalSales = [4, 5, 6].contains(v.type) ? -v.referMoney : v.referMoney;
                    $totalSalesAndMaterial = utils.changeThrDecimal($totalSalesAndMaterial + $totalSales);
                }

                if (v.type == 2) {
                    $totalDeposit = utils.changeThrDecimal($totalDeposit + v.referMoney);
                }

                if ($salesBrands.length > 0) {

                    var $salesBrand = com.focusPage($salesBrands[0]);
                    var $brandTotal = com.focusPage($salesBrand.find("[name='total']")[0]);
                    var $brandCoupon = com.focusPage($salesBrand.find("[name='coupon']")[0]);

                    var _value = parseFloat($brandTotal.attr('value'));
                    var _refer = [2, 3, 8].contains(v.type) ? v.referMoney : -v.referMoney;
                    var _total = utils.changeThrDecimal(_value + _refer);
                    var _coupon = [2, 3, 8].contains(v.type) ? salesReceipt.coupon : -salesReceipt.coupon;

                    $brandTotal.attr("value", _total);
                    $brandTotal.html(_total);

                    var _couponTotal = utils.changeThrDecimal(parseFloat($brandCoupon.attr('value')) + _coupon);
                    $brandCoupon.attr("value", _couponTotal);
                    $brandCoupon.html(_couponTotal);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                } else {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix').attr("name", v.sales.brand.name + "_s");
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.sales.brand.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var _refer = [2, 3, 8].contains(v.type) ? v.referMoney : -v.referMoney;
                    var _coupon = [2, 3, 8].contains(v.type) ? salesReceipt.coupon : -salesReceipt.coupon;

                    $('<b></b>').html(v.sales.category).addClass("grey").appendTo($('<strong></strong>').html("品类:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').html(v.sales.brand.name).addClass("grey").appendTo($('<strong></strong>').html("品牌:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').attr("name", "total").attr("value", _refer).html(_refer).addClass("blue").appendTo($('<strong></strong>').html("金额:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').attr("name", "coupon").attr("value", _coupon).html(_coupon).addClass("blue").appendTo($('<strong></strong>').html("优惠券:").appendTo($('<li></li>').appendTo($ulProperty)));

                    $liLine.append($h4).append($ulProperty).appendTo($ulbrand);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                }
            });
        }

        // 品牌汇总券为0不显示(品牌行增量累加,循环结束后统一清理)
        $.each($ulbrand.children('li'), function(index, li) {

            var $couponB = com.focusPage(li).find("[name='coupon']");

            if ($couponB.length > 0 && parseFloat($couponB.attr('value')) == 0) {
                $couponB.closest('li').remove();
            }
        });

        purCategory.length == 0 ? noData("materialPurchasedCategory" + dataPage) : drawLineCategory(purCategory, $purchasedCategory);
        drawLineCategory(unpCategory, $unpurchasedCategory);

        var material = {
            "total": $total,
            "coupon": $coupon
        };

        if ($ulfanglin.children("li").length == 0 && $ulsales.children("li").length == 0 && $ulsalesResult == null) {
            noData("fanglinMaterialPayments" + dataPage);
            noData("salesMaterialPayments" + dataPage);
            noData("salesResultList" + dataPage);
            noData("materialPaymentBrands" + dataPage);
        } else if ($ulfanglin.children("li").length != 0 && $ulsales.children("li").length == 0 && $ulsalesResult != null) {
            noData("salesMaterialPayments" + dataPage);
            totalData();
        } else if ($ulfanglin.children("li").length != 0 && $ulsales.children("li").length == 0 && $ulsalesResult == null) {
            noData("salesMaterialPayments" + dataPage);
            noData("salesResultList" + dataPage);
            totalData();
        } else if ($ulfanglin.children("li").length == 0 && $ulsales.children("li").length != 0 && $ulsalesResult != null) {
            noData("fanglinMaterialPayments" + dataPage);
            totalData();
        } else {
            totalData();
        }

        if ($uloales.children("li").length == 0) {
            noData("oalesResultList" + dataPage);
            noData("oalesPaymentBrands" + dataPage);
        } else {
            oalesTotalData();
        }

        decorationDetail.materialTotal = $total;

        function noData(div) {

            var $resultList = com.focusPage('#' + div).html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
        }

        function totalData() {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');

            var $h4 = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("总金额:" + utils.changeThrDecimal($total + $oalesScaleTotal)));
            var $salesTotalH4 = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("场内总额:" + $total));
            var $couponPrice = $coupon != 0 ? $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("优惠券:" + $coupon)) : null;
            var $TotalNetReceiptsTotalPrice = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("场内实收总额:" + $totalSalesAndMaterial));
            var $TotalDepositPrice = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("定金总额:" + ($totalDeposit)));
            var $oalesH4 = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("外销总额:" + $oalesTotal));
            var $oalesScaleH4 = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("外销实收总额:" + $oalesScaleTotal));
            var $subsidy = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("补贴总额:" + $totalSubsidy));

            $liLine.append($h4).append($salesTotalH4).append($couponPrice).append($TotalNetReceiptsTotalPrice).append($TotalDepositPrice).append($oalesH4).append($oalesScaleH4).append($subsidy).appendTo($ulbrand);
        }

        function oalesTotalData() {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $oalesH4 = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("外销总额:" + $oalesTotal));
            var $oalesScaleH4 = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("外销实收总额:" + $oalesScaleTotal));

            $liLine.append($oalesH4).append($oalesScaleH4).appendTo($uloalesBrand);
        }

        function drawLineCategory(list, div) {

            $.each(list, function(index, value) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix col-md-4');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>')).html(value);
                $liLine.append($h4).appendTo(div);
            });
        }
        return material;
    },

    decorationActivityInfo: function(orderId, activitys, wizard) {

        var uiBtnMethod = wizard["activityBtnMethod"];

        var options = {
            "decorationActivity.orderId": orderId,
        };

        activitys.html('');

        com.post(api.decoration.queryDecorationActivityByOrderId, options, function(res) {

            var decorationActivitys = res.decorationActivitys;
            for ( var i = 0; i < decorationActivitys.length; i++) {
                decorationUtils.addDecorationActivityForDiv(activitys, decorationActivitys[i], uiBtnMethod);
            }
        });
    },

    addDecorationActivityForDiv: function(_activitys, _decorationActivity, uiBtnMethod, couponCut, thingCut) {

        var pricingSpan = $("<div></div>").addClass("col-md-4").css("margin", "5px 0px").attr("id", "dactivity_" + _decorationActivity.daId).prependTo(_activitys);
        var widgetBox = $("<div class='module_activity_border'></div>").appendTo(pricingSpan);

        var widgetHeader = $("<div></div>").attr("id", "widgetHeader_" + _decorationActivity.daId).appendTo(widgetBox);
        var widgetHeaderH5 = $("<h4></h4>").addClass("bigger lighter").css("padding-left", "12px").text(_decorationActivity.activity.name).appendTo(widgetHeader);

        var widgetBody = $("<div></div>").appendTo(widgetBox);
        var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
        var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);

        var stateLi = $("<li></li>").appendTo(ul);
        var stateState = $("<strong></strong>").text("状态:").appendTo(stateLi);
        var stateSpan = $("<span></span>").addClass("red").attr("id", "state_" + _decorationActivity.daId).text(constant.decoration().decorationActivity.status.keys[_decorationActivity.status]).appendTo(stateLi);

        var uiPgDiv = $("<div></div>").addClass("ui-pg-div").css("padding-left", "8px").css("padding-bottom", "10px").appendTo(widgetBody);

        com.focusPage("#dactivity_" + _decorationActivity.daId).attr("status", _decorationActivity.status);

        if (uiBtnMethod) {

            if (uiBtnMethod == "activityBtnMethod") {
                var deleteBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("删除").css("margin", "0px 3px").attr("id", "delete_" + _decorationActivity.daId).appendTo(uiPgDiv);

                deleteBtn.on("click", function() {

                    if (com.focusPage("#dactivity_" + _decorationActivity.daId).attr("status") == 0) {
                        com.post(api.decoration.deleteDecorationActivity, {
                            "decorationActivity.daId": _decorationActivity.daId
                        }, function(res) {

                            com.focusPage("#dactivity_" + res.decorationActivity.daId).remove();
                        });
                    }
                });

            } else {
                uiBtnMethod(uiPgDiv, _decorationActivity);
            }
        }
    },

    decorationActivityItemInfo: function(orderId, infopack, itempack, config, wizard) {

        var uiBtnMethod = wizard["uiBtnMethod"];

        com.post(api.decoration.queryDecorationActivityItem, {
            "decoration.orderId": orderId
        }, function(res) {

            var decorationActivityItems = res.decorationActivityItems;

            var couponCut = 0;
            var thingCut = 0;

            itempack.html("");

            if (wizard.btnSend == "btnSend") {
                com.focusPage("#btnNotice").removeClass("hide");
                com.focusPage("#btnNoticeQRCode").removeClass("hide");
            }

            for ( var i = 0; i < decorationActivityItems.length; i++) { // 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 补款

                var item = decorationActivityItems[i];

                // 只显示线下活动（atttype=0）的数据到装修活动物品区域
                if (item.atttype != 0) {
                    continue;
                }

                if (item.type == 0 && [0, 2, 4, 5, 6].indexOf(item.state) != -1 && item.isPrefor == 0) {// 0卷
                    couponCut = utils.accAdd(couponCut, utils.accMul(item.money, item.num));
                } else if (item.type == 1 && [0, 2, 4, 5, 6].indexOf(item.state) != -1 && item.isPrefor == 0) {// 物品
                    thingCut = utils.accAdd(thingCut, utils.accMul(item.money, item.num));
                }

                decorationUtils.addActivityItemForDiv(itempack, item, uiBtnMethod, config, wizard.content, null, null);
            }

            infopack.html("");

            var couponCutSpan = $("<div></div>").attr("id", "_couponCut").addClass("col-md-4").css("border-left", "1px solid rgb(227, 227, 227)").append($("<h5></h5>").addClass("bigger-110 center").text("券优惠"), $("<h2></h2>").addClass("oid bigger center").append($("<b></b>").addClass("blue").html(couponCut))).appendTo(infopack);
            var thingCutSpan = $("<div></div>").attr("id", "_thingCut").addClass("col-md-4").css("border-left", "1px solid rgb(227, 227, 227)").append($("<h5></h5>").addClass("bigger-110 center").text("物品优惠"), $("<h2></h2>").addClass("oid bigger center").append($("<b></b>").addClass("blue").html(thingCut))).appendTo(infopack);
            var detailSpan = $("<div></div>").attr("id", "_detail").addClass("col-md-4").css("border-left", "1px solid rgb(227, 227, 227)").append($("<h5></h5>").addClass("bigger-110 center").text("优惠总额"), $("<h2></h2>").addClass("oid bigger center").append($("<b></b>").addClass("blue").html(utils.accAdd(couponCut, thingCut)))).appendTo(infopack);

        });
    },

    addActivityItemForDiv: function(itempack, _activityItem, uiBtnMethod, config, nodeContent, uniqueId) {

        if (_activityItem.state == 1)
            return false;

        var pricingSpan = $("<div></div>").addClass("col-md-6").css("margin", "5px 0px").attr("id", "pricing_" + _activityItem.daiId).prependTo(itempack);
        var widgetBox = $("<div></div>").appendTo(pricingSpan);
        var total = [0, 2, 4, 5, 6].indexOf(_activityItem.state) != -1 ? utils.accMul(_activityItem.money, _activityItem.num) : 0;

        var widgetBody = $("<ul class='item-list fl-table-list ui-sortable'></ul>").attr("data-type", _activityItem.type).attr("data-total", total).appendTo(widgetBox);
        var widgetMain = $('<li class="item-orange clearfix"></li>').appendTo(widgetBody);

        var widgetHeader = $("<h3 class='oid'></h3>").attr("id", "widgetHeader_" + _activityItem.daiId).appendTo(widgetMain);

        var title = $('<small class="blue"></small>').text(_activityItem.activityItemName);

        var $span = $('<span></span>').addClass('lbl blue bigger-150');
        var $label = $('<label></label>');
        var $input = $('<input></input>').attr({
            "type": "checkbox",
            "name": "daiIds",
            "class": "ace ace-checkbox-2"
        }).val(_activityItem.daiId);

        widgetHeader.append($label.append($input).append($span)).append(title);

        var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);

        var nameLi = $("<li></li>").appendTo(ul);
        var typeLi = $("<strong></strong>").text("类型:").appendTo(nameLi);
        var typeSpan = $("<span></span>").attr("id", "type_" + _activityItem.daiId).attr("type", _activityItem.type).text(config.types[_activityItem.type]).appendTo(nameLi);
        var $stateTypeLi = $("<li></li>").appendTo(ul);
        var $stateTypeStrong = $("<strong></strong>").text("办理类型:").appendTo($stateTypeLi);
        var $stateTypeSpan = $("<span></span>").addClass("red").attr("id", "stateType_" + _activityItem.daiId).text(config.stateTypes[_activityItem.stateType]).appendTo($stateTypeLi);
        var stateLi = $("<li></li>").appendTo(ul);
        var stateState = $("<strong></strong>").text("办理状态:").appendTo(stateLi);
        var stateSpan = $("<span></span>").addClass("red").attr("id", "state_" + _activityItem.daiId).text(config.states[_activityItem.state]).appendTo(stateLi);
        var moneyLi = $("<li></li>").appendTo(ul);
        var moneyState = $("<strong></strong>").text("金额:").appendTo(moneyLi);
        var moneySpan = $("<span></span>").addClass("blue").attr("id", "money_" + _activityItem.daiId).text(_activityItem.money).appendTo(moneyLi);
        var numLi = $("<li></li>").appendTo(ul);
        var numState = $("<strong></strong>").text("数量:").appendTo(numLi);
        var numSpan = $("<span></span>").addClass("blue").attr("id", "num_" + _activityItem.daiId).text(_activityItem.num).appendTo(numLi);
        var totalLi = $("<li></li>").appendTo(ul);
        var totalState = $("<strong></strong>").text("合计:").appendTo(totalLi);
        var totalSpan = $("<span></span>").addClass("blue").attr("id", "total_" + _activityItem.daiId).text(utils.accMul(_activityItem.money, _activityItem.num)).appendTo(totalLi);
        var createTimeLi = $("<li></li>").appendTo(ul);
        var createTimeState = $("<strong></strong>").text("创建时间: ").appendTo(createTimeLi);
        var createTimeSpan = $("<span></span>").addClass("green").text(_activityItem.createTime).appendTo(createTimeLi);

        if (nodeContent == "content") {
            var isStockLi = $("<li></li>").appendTo(ul);
            var isStockState = $("<strong></strong>").text("是否计入库存:").appendTo(isStockLi);
            var isStockSpan = $("<span></span>").addClass("red").attr("id", "isStock_" + _activityItem.daiId).text(config.isStatus[_activityItem.isStock]).appendTo(isStockLi);
            var isPreforLi = $("<li></li>").appendTo(ul);
            var isPreforState = $("<strong></strong>").text("是否计入业绩:").appendTo(isPreforLi);
            var isPreforSpan = $("<span></span>").addClass("red").attr("id", "isPrefor_" + _activityItem.daiId).attr("isPrefor", _activityItem.isPrefor).text(config.isStatus[_activityItem.isPrefor]).appendTo(isPreforLi);
            var isPaymentLi = $("<li></li>").appendTo(ul);
            var isPaymentState = $("<strong></strong>").text("是否计入金额:").appendTo(isPaymentLi);
            var isPaymentSpan = $("<span></span>").addClass("red").attr("id", "isPayment_" + _activityItem.daiId).text(config.isStatus[_activityItem.isPayment]).appendTo(isPaymentLi);
            var isAffirmLi = $("<li></li>").appendTo(ul);
            var isAffirmState = $("<strong></strong>").text("是否确认:").appendTo(isAffirmLi);
            var isAffirmSpan = $("<span></span>").addClass("red").attr("id", "isAffirm" + _activityItem.daiId).text(config.isAffirms[_activityItem.isAffirm]).appendTo(isAffirmLi);
            var receiveTimeLi = $("<li></li>").appendTo(ul);
            var receiveTimeState = $("<strong></strong>").text("首次操作时间:").appendTo(receiveTimeLi);
            var receiveTimeSpan = $("<span></span>").addClass("green").text(com.checkNull(_activityItem.receiveTime)).appendTo(receiveTimeLi);
            var refundTimeLi = $("<li></li>").appendTo(ul);
            var refundTimeState = $("<strong></strong>").text("二次操作时间:").appendTo(refundTimeLi);
            var refundTimeSpan = $("<span></span>").addClass("green").text(com.checkNull(_activityItem.refundTime)).appendTo(refundTimeLi);
            var affirmTimeLi = $("<li></li>").appendTo(ul);
            var affirmTimeState = $("<strong></strong>").text("首次确认时间:").appendTo(affirmTimeLi);
            var affirmTimeSpan = $("<span></span>").addClass("green").text(com.checkNull(_activityItem.affirmTime)).appendTo(affirmTimeLi);
            var checkTimeLi = $("<li></li>").appendTo(ul);
            var checkTimeState = $("<strong></strong>").text("二次确认时间:").appendTo(checkTimeLi);
            var checkTimeSpan = $("<span></span>").addClass("green").text(com.checkNull(_activityItem.checkTime)).appendTo(checkTimeLi);

        }

        var contentLi = $("<li></li>").appendTo(ul);
        var contentState = $("<strong></strong>").text("备注:").appendTo(contentLi);
        var contentSpan = $("<span></span>").addClass("blue").attr("id", "content_" + _activityItem.daiId).text(com.checkNull(_activityItem.content)).appendTo(contentLi);
        var commentLi = $("<li></li>").appendTo(ul);
        var commentState = $("<strong></strong>").text("说明:").appendTo(commentLi);
        var commentSpan = $("<span></span>").addClass("blue").attr("id", "comment_" + _activityItem.daiId).text(com.checkNull(_activityItem.comment)).appendTo(commentLi);

        var uiPgDiv = $("<div></div>").addClass("ui-pg-div").css("padding-left", "8px").css("padding-bottom", "10px").appendTo(widgetMain);

        if (uiBtnMethod != null) {

            if (uiBtnMethod == "uiBtnMethod") {


                var decorationActivityRecordBtn = $("<a></a>").addClass("btn btn-minier btn-pink").html("记录").css("margin", "0px 3px").appendTo(uiPgDiv);

                decorationActivityRecordBtn.on("click", function() {

                    params.decoration.decorationActivityItem = _activityItem;

                    com.popup4page("#decorationActivityRecordPopUp", "/views/decoration/decorationActivityRecord.html", "记录");

                });

                // 核销功能仅对会员活动物品（atttype=1）可用，装修活动物品（atttype=0）不可使用
                if (_activityItem.atttype == 1) {
                    var consumeBtn = $("<a></a>").addClass("btn btn-minier btn-primary").html("核销").css("margin", "0px 3px").attr("id", "consume_" + _activityItem.daiId).appendTo(uiPgDiv);

                    consumeBtn.on("click", function() {

                        com.showConfirm("是否确认核销" + _activityItem.activityItemName + "活动物品?", function() {

                            com.post(api.decoration.consumeDecorationActivityItem, {
                                "decorationActivityItem.daiId": _activityItem.daiId
                            }, function(res) {

                                com.showAlert(com.info, "核销成功");

                                decorationUtils.countTatol(res.decorationActivityItem.daiId);

                                com.focusPage("#state_" + res.decorationActivityItem.daiId).text("核销");
                            });
                        });
                    });
                }

                // 如果有 uniqueId（格式：doid-doid），显示"推荐"按钮
                if (uniqueId) {
                    var ids = uniqueId.split('-');
                    if (ids.length === 2 && ids[0] && ids[1]) {
                        var referInfoBtn = $("<a></a>").addClass("btn btn-minier btn-info")
                            .html("<i class='icon-info-sign'></i> 推荐")
                            .css("margin", "0px 3px")
                            .appendTo(uiPgDiv);

                        // 点击按钮弹窗显示推荐信息
                        referInfoBtn.on("click", (function(doid1, doid2) {
                            return function() {
                                // 显示加载提示
                                var loadingIndex = com.showLoading('正在查询推荐信息...');

                                // 并行查询两个装修单
                                var queryCount = 0;
                                var referDecoration = null;
                                var referredDecoration = null;

                                // 查询推荐人订单
                                com.post(api.decoration.queryDecorationByDoid, {
                                    "decoration.doid": parseInt(doid1)
                                }, function(res1) {
                                    if (res1.decoration) {
                                        referDecoration = res1.decoration;
                                    }
                                    queryCount++;
                                    checkAndShow();
                                }, function(err1) {
                                    queryCount++;
                                    checkAndShow();
                                });

                                // 查询被推荐人订单
                                com.post(api.decoration.queryDecorationByDoid, {
                                    "decoration.doid": parseInt(doid2)
                                }, function(res2) {
                                    if (res2.decoration) {
                                        referredDecoration = res2.decoration;
                                    }
                                    queryCount++;
                                    checkAndShow();
                                }, function(err2) {
                                    queryCount++;
                                    checkAndShow();
                                });

                                // 检查是否两个查询都完成，然后显示弹窗
                                function checkAndShow() {
                                    if (queryCount === 2) {
                                        // 关闭加载提示
                                        layer.close(loadingIndex);

                                        // 构建弹窗内容
                                        var content = "<div style='line-height: 2; padding: 10px;'>";

                                        if (referDecoration) {
                                            content += "<div style='margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #667eea;'>";
                                            content += "<h4 style='color: #667eea; margin: 0 0 10px 0;'><i class='icon-arrow-up'></i> 推荐人订单</h4>";
                                            content += "<p style='margin: 5px 0;'><strong>订单号：</strong>" + referDecoration.orderId + "</p>";
                                            content += "<p style='margin: 5px 0;'><strong>客户：</strong>" + (referDecoration.customer ? referDecoration.customer.name : '无') + "</p>";
                                            content += "<p style='margin: 5px 0;'><strong>楼盘：</strong>" + (referDecoration.house && referDecoration.house.village ? referDecoration.house.village.name : '无') + "</p>";
                                            content += "<p style='margin: 5px 0;'><strong>房号：</strong>" + (referDecoration.house ? referDecoration.house.houseNumber || '' : '无') + "</p>";
                                            content += "</div>";
                                        } else {
                                            content += "<div style='margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #999;'>";
                                            content += "<h4 style='color: #999; margin: 0 0 10px 0;'><i class='icon-arrow-up'></i> 推荐人订单</h4>";
                                            content += "<p style='margin: 5px 0; color: #999;'>未找到订单信息（doid: " + doid1 + "）</p>";
                                            content += "</div>";
                                        }

                                        if (referredDecoration) {
                                            content += "<div style='padding-top: 10px;'>";
                                            content += "<h4 style='color: #f5576c; margin: 0 0 10px 0;'><i class='icon-arrow-down'></i> 被推荐人订单</h4>";
                                            content += "<p style='margin: 5px 0;'><strong>订单号：</strong>" + referredDecoration.orderId + "</p>";
                                            content += "<p style='margin: 5px 0;'><strong>客户：</strong>" + (referredDecoration.customer ? referredDecoration.customer.name : '无') + "</p>";
                                            content += "<p style='margin: 5px 0;'><strong>楼盘：</strong>" + (referredDecoration.house && referredDecoration.house.village ? referredDecoration.house.village.name : '无') + "</p>";
                                            content += "<p style='margin: 5px 0;'><strong>房号：</strong>" + (referredDecoration.house ? referredDecoration.house.houseNumber || '' : '无') + "</p>";
                                            content += "</div>";
                                        } else {
                                            content += "<div style='padding-top: 10px;'>";
                                            content += "<h4 style='color: #999; margin: 0 0 10px 0;'><i class='icon-arrow-down'></i> 被推荐人订单</h4>";
                                            content += "<p style='margin: 5px 0; color: #999;'>未找到订单信息（doid: " + doid2 + "）</p>";
                                            content += "</div>";
                                        }

                                        content += "</div>";

                                        // 使用 com.showInfo 显示弹窗
                                        com.showInfo("<i class='icon-link blue'></i> 推荐订单详情", content);
                                    }
                                }
                            };
                        })(ids[0], ids[1]));
                    }
                }
            } else {
                uiBtnMethod(uiPgDiv, _activityItem);
            }
        }
    },

    salesActivityItemInfo: function(orderId, itempack, config, wizard) {

        com.post(api.sales.querySalesActivityItem, {
            "orderId": orderId
        }, function(res) {

            var salesActivityItems = res.salesActivityItems;

            itempack.html("");

            for ( var i = 0; i < salesActivityItems.length; i++) {
                var item = salesActivityItems[i];

                var pricingSpan = $("<div></div>").addClass("col-md-6").css("margin", "5px 0px").attr("id", "pricing_" + item.saiid).prependTo(itempack);
                var widgetBox = $("<div></div>").appendTo(pricingSpan);
                var total = [0, 2, 4, 5, 6].indexOf(item.state) != -1 ? utils.accMul(item.money, item.num) : 0;

                var widgetBody = $("<div class='module_activity_border'></div>").attr("data-type", item.type).attr("data-total", total).appendTo(widgetBox);
                var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);

                var widgetHeader = $("<div></div>").addClass("").attr("id", "widgetHeader_" + item.saiid).appendTo(widgetMain);
                var widgetHeaderH5 = $("<h4></h4>").addClass("bigger lighter").css("padding-left", "12px").appendTo(widgetHeader).text(item.name);

                var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);

                var nameLi = $("<li></li>").appendTo(ul);
                var activityLi = $("<strong></strong>").text("活动名:").appendTo(nameLi);
                var activitySpan = $("<span></span>").attr("id", "type_" + item.saiid).text(item.activity).appendTo(nameLi);
                var activityNameLi = $("<li></li>").appendTo(ul);
                var typeLi = $("<strong></strong>").text("类型:").appendTo(activityNameLi);
                var typeSpan = $("<span></span>").attr("id", "type_" + item.saiid).text(config.salesActivityItemType[item.type]).appendTo(activityNameLi);
                var stateLi = $("<li></li>").appendTo(ul);
                var stateState = $("<strong></strong>").text("状态:").appendTo(stateLi);
                var stateSpan = $("<span></span>").addClass("red").attr("id", "stateType_" + item.saiid).text(config.salesActivityItemState[item.state]).appendTo(stateLi);
                var moneyLi = $("<li></li>").appendTo(ul);
                var moneyState = $("<strong></strong>").text("金额:").appendTo(moneyLi);
                var moneySpan = $("<span></span>").addClass("blue").attr("id", "money_" + item.saiid).text(item.money).appendTo(moneyLi);
                var numLi = $("<li></li>").appendTo(ul);
                var numState = $("<strong></strong>").text("数量:").appendTo(numLi);
                var numSpan = $("<span></span>").addClass("blue").attr("id", "money_" + item.saiid).text(item.num).appendTo(numLi);
                var totalLi = $("<li></li>").appendTo(ul);
                var totalState = $("<strong></strong>").text("合计:").appendTo(totalLi);
                var totalSpan = $("<span></span>").addClass("blue").attr("id", "total_" + item.saiid).text(utils.accMul(item.money, item.num)).appendTo(totalLi);
                var createTimeLi = $("<li></li>").appendTo(ul);
                var createTimeState = $("<strong></strong>").text("创建时间:").appendTo(createTimeLi);
                var createTimeSpan = $("<span></span>").addClass("green").attr("id", "createTime_" + item.saiid).text(com.checkNull(item.createTime)).appendTo(createTimeLi);
                var operateTimeLi = $("<li></li>").appendTo(ul);
                var operateTimeState = $("<strong></strong>").text("首次操作时间:").appendTo(operateTimeLi);
                var operateTimeSpan = $("<span></span>").addClass("green").attr("id", "operateTime_" + item.saiid).text(com.checkNull(item.operateTime)).appendTo(operateTimeLi);
                var refundTimeLi = $("<li></li>").appendTo(ul);
                var refundTimeState = $("<strong></strong>").text("二次操作时间:").appendTo(refundTimeLi);
                var refundTimeSpan = $("<span></span>").addClass("green").attr("id", "refundTime_" + item.saiid).text(com.checkNull(item.refundTime)).appendTo(refundTimeLi);
                var affirmTimeLi = $("<li></li>").appendTo(ul);
                var affirmTimeState = $("<strong></strong>").text("首次确认时间:").appendTo(affirmTimeLi);
                var affirmTimeSpan = $("<span></span>").addClass("green").attr("id", "affirmTime_" + item.saiid).text(com.checkNull(item.affirmTime)).appendTo(affirmTimeLi);
                var checkTimeLi = $("<li></li>").appendTo(ul);
                var checkTimeState = $("<strong></strong>").text("二次确认时间:").appendTo(checkTimeLi);
                var checkTimeSpan = $("<span></span>").addClass("green").attr("id", "checkTime_" + item.saiid).text(com.checkNull(item.checkTime)).appendTo(checkTimeLi);
                var contentLi = $("<li></li>").appendTo(ul);
                var contentState = $("<strong></strong>").text("备注:").appendTo(contentLi);
                var contentSpan = $("<span></span>").addClass("blue").attr("id", "content_" + item.saiid).text(com.checkNull(item.content)).appendTo(contentLi);
                var commentLi = $("<li></li>").appendTo(ul);
                var commentState = $("<strong></strong>").text("说明:").appendTo(commentLi);
                var commentSpan = $("<span></span>").addClass("blue").attr("id", "comment_" + item.saiid).text(com.checkNull(item.comment)).appendTo(commentLi);

                var uiPgDiv = $("<div></div>").addClass("ui-pg-div").css("padding-left", "8px").css("padding-bottom", "10px").appendTo(widgetBody);
            }
        });
    },

    memberActivityItemInfo: function(orderId, itempack, config, wizard) {

        var uiBtnMethod = wizard["uiBtnMethod"];

        com.post(api.decoration.queryDecorationActivityItem, {
            "decoration.orderId": orderId
        }, function(res) {

            var decorationActivityItems = res.decorationActivityItems;

            itempack.html("");

            // 直接渲染活动物品，传递 uniqueId 参数
            for (var i = 0; i < decorationActivityItems.length; i++) {
                var item = decorationActivityItems[i];

                // 只显示线上活动（atttype=1）的数据到会员活动物品区域
                if (item.atttype != 1) {
                    continue;
                }

                // 直接传递 uniqueId，不提前查询数据
                decorationUtils.addActivityItemForDiv(itempack, item, uiBtnMethod, config, wizard.content, item.uniqueId);
            }
        });
    },

    initAdvancePayment: function(orederId, wizard) {

        if (wizard.advance != "advance") {

            com.focusPage('#advancePayment').html("");
        }
    },

    initPayment: function(decorationDetail, isDesign) {

        var totalMoney = 0;
        var receiveMoney = 0;
        var addMoney = 0;
        var reduceMoney = 0;
        var paymentStatusArray = ["未付款", "已付款", "已确认", "审批中", "历史"];

        var $base = com.focusPage("#basePaymentDiv").html("");
        var $other = com.focusPage("#otherPaymentDiv").html("");

        var $baseul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($base);
        var $otherul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($other);

        var materialAdvance = 0;
        // 通过装修单号获取预付款金额
        com.post(api.payment.queryAdvancePaymentByOrderId, {
            "advancePayment.decoration.orderId": decorationDetail.orderId
        }, function(res) {

            com.focusPage("#balanceAdvance").text(res.balanceAdvance);
            com.focusPage("#materialAdvance").text(res.materialAdvance);

            materialAdvance = res.materialAdvance;
        }, null, false);

        var decorationPayments = [];

        // 通过装修单号获取装修款项信息
        com.post(api.payment.queryDecorationPaymentByOrderId, {
            "decorationPayment.decoration.orderId": decorationDetail.orderId
        }, function(res) {

            decorationPayments = res.decorationPayments;
        }, null, false);

        if (decorationPayments && decorationPayments.length) {

            var sortPayments = decorationPayments.sort(function(a, b) {

                return a.sort - b.sort;
            });

            $.each(sortPayments, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix').attr("id", "decorationPayment_" + v.dpid);
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.paymentType));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [["应收额:", v.referMoney, "grey"], ["收款时间:", v.collectTime, "grey"], ["状态:", paymentStatusArray[v.paymentStatus], "red"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var styleArr = [];

                v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
                v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for ( var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
                    }

                    return info;
                })(v.bank, v.bankInfo), "grey"]) : true;
                v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", v.checkv, "grey"]) : true;
                v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "grey"]) : true;
                v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "grey"]) : true;
                v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "grey"]) : true;
                v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "grey"]) : true;

                $.each(styleArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulStyle);
                });

                var $paymentType = v.paymentType;
                var $paymentStatus = v.paymentStatus;

                var $refundBtn = $('<a></a>').addClass('btn btn-minier btn-danger').html('退款');

                $refundBtn.click(function() {

                    approvalUtils.initqueryApprovalUser("refundApproveManSel", 5);
                    com.focusPage('#autoId').val(v.dpid);
                    com.focusPage('#referMoney').val(v.referMoney);
                    decorationDetail.refundDecorationPaymentModal.modal("show");
                });

                var $deleteBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("删除").css("margin", "0px 3px");

                $deleteBtn.on("click", function() {

                    com.showConfirm("确定要删除款项", function() {

                        com.post(api.payment.deleteDecorationPayment, {
                            "decorationPayment.dpid": v.dpid
                        }, function(res) {

                            com.showAlert(com.info, "操作成功");
                            com.focusPage("#decorationPayment_" + res.decorationPayment.dpid).remove();
                        });

                    });

                });

                var $btnSettle = $("<a></a>").addClass("btn btn-minier btn-primary").html("落款").css("margin", "0px 3px");

                $btnSettle.on("click", function() {

                    com.showConfirm("是否确认落款，落款将直接使用预付款余额抵扣：" + v.referMoney + "元", function() {

                        var options = {
                            "decorationPayment.dpid": v.dpid,
                            "decorationPayment.advanceType": 1,
                            "decorationPayment.decoration.orderId": decorationDetail.orderId,
                            "decorationPayment.comment": ""
                        };

                        com.post(api.payment.settleDecorationPayment, options, function(res) {

                            com.showAlert(com.info, "落款成功，请打印收据。");
                            decorationUtils.initPayment(decorationDetail, isDesign);
                        });
                    });
                });

                if (isDesign) {
                    if (v.paymentStatus == 2 && v.oneType == 0) {
                        if (v.twoType != 2) {
                            $divBtnWrap.append($refundBtn);
                        }
                    }
                }

                if ((v.twoType == 0 || v.twoType == 3) && v.paymentStatus == 0) {
                    $divBtnWrap.append($deleteBtn);
                }

                if (v.paymentStatus == 0 && v.oneType == 0) {
                    $divBtnWrap.append($btnSettle);
                }

                $divBtnWrap.appendTo($h4);

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

                if (v.oneType == 0 && (v.twoType == 0 || v.twoType == 1)) {
                    $liLine.appendTo($baseul);
                    if (v.twoType == 1) {
                        totalMoney += v.referMoney;
                        if ($paymentStatus == 2) {
                            receiveMoney += v.referMoney;
                        }
                    }
                } else {
                    $liLine.appendTo($otherul);
                    if ($paymentStatus == 2) {
                        if (v.twoType == 2) {
                            if (v.oneType == 0) {
                                addMoney += v.referMoney;
                            }
                            if (v.oneType == 1) {
                                reduceMoney += v.referMoney;
                            }
                        }
                    }
                }
            });
        }

        if ($baseul.html() == "") {
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($("#basePaymentDiv").html(''));
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无基本款项数据').appendTo($mesg);
        }

        if ($otherul.html() == "") {
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($("#otherPaymentDiv").html(''));
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无其他款项数据').appendTo($mesg);
        }

        if (com.focusPage('#payedMoney')) {
            com.focusPage('#payedMoney').remove();
        }

        com.focusPage('#projectTotal').html(receiveMoney);
        var projectPercent = totalMoney == 0 ? 0 : utils.accMul(utils.changeThrDecimal(utils.accDiv(receiveMoney, totalMoney)), 100);
        com.focusPage('#projectPercent').html(projectPercent > 100 ? 100 : projectPercent + "%");
        com.focusPage('#addTotal').html(addMoney);
        com.focusPage('#reduceTotal').html(reduceMoney);

        var predisPrice = 0;

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": decorationDetail.orderId
        }, function(res) {

            if (res.quotation.qid) {
                var quotation = res.quotation;
                predisPrice = utils.accAdd(predisPrice, utils.accAdd(quotation.undisPrice, utils.accAdd(quotation.disPrice, utils.accAdd(quotation.trafficPrice, quotation.managePrice))));
            }
        }, null, false);

        var materialAmount = 0;
        com.post(api.payment.amountSalesPayment, {
            "salesPayment.sales.orderId": decorationDetail.orderId
        }, function(res) {

            materialAmount = res.amount;
        }, null, false);

        com.focusPage('#materialAmount').html(materialAmount);
        com.focusPage('#materialRate').html(predisPrice == 0 ? 0 : utils.accMul(utils.changeThrDecimal(utils.accDiv(utils.accAdd(materialAmount, materialAdvance), predisPrice)), 100) + "%");
    },

    initServicePayment: function(decoration) {

        var mainDiv = com.focusPage('#preparePayment');

        var serviceHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("服务款")));
        var serviceBody = $("<div></div>").addClass('widget-body');

        serviceBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
        mainDiv.append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceHeader, serviceBody)));

        com.post(api.payment.queryServicePaymentByOrderId, {
            "servicePayment.decoration.orderId": decoration.orderId
        }, function(res) {

            drawList(res.servicePayments);
        });

        function drawList(data) {

            var $tableWrap = com.focusPage('#hoServiceMoney');
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            $.each(data, function(i, v) {

                var serviceReceipt = v.serviceReceipt;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.type == 0 ? "收款" : "退款"));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [["预付款金额:", v.advanceMoney, "grey"], ["服务费:", v.serviceMoney, "grey"], ["收款时间:", v.createTime, "grey"], ["状态:", v.status == 0 ? "初始" : (v.status == 1 ? "已收款" : "已确认"), "red"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var styleArr = [];

                serviceReceipt.cash != null && serviceReceipt.cash != "0" ? styleArr.push(["现金:", serviceReceipt.cash, "grey"]) : true;
                serviceReceipt.bank != null && serviceReceipt.bank != "0" ? styleArr.push(["银行:", (function(bank, bankInfo) {

                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for ( var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        info += decorationUtils.bankInfo[_i[0]] + " " + _i[1] + ", ";
                    }

                    return info;
                })(serviceReceipt.bank, serviceReceipt.bankInfo), "grey"]) : true;
                serviceReceipt.checkv != null && serviceReceipt.checkv != "0" ? styleArr.push(["转账:", serviceReceipt.checkv, "grey"]) : true;
                serviceReceipt.installment != null && serviceReceipt.installment != "0" ? styleArr.push(["分期:", serviceReceipt.installment, "grey"]) : true;
                serviceReceipt.accounts != null && serviceReceipt.accounts != "0" ? styleArr.push(["对公帐户:", serviceReceipt.accounts, "grey"]) : true;
                serviceReceipt.advance != null && serviceReceipt.advance != "0" ? styleArr.push(["预付款:", serviceReceipt.advance, "grey"]) : true;
                serviceReceipt.coupon != null && serviceReceipt.coupon != "0" ? styleArr.push(["优惠券:", serviceReceipt.coupon + serviceReceipt.couponInfo.split('#').join(' '), "grey"]) : true;

                $.each(styleArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulStyle);
                });

                $liLine.append($h4).append($ulProperty).append($ulStyle);
                $liLine.appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        }
    },

    initDecorationMidpack: function(decoration, wizard) {

        var mainDiv = com.focusPage('#preparePayment').html("");

        var midpackDiv = $("<div></div>").appendTo(mainDiv);
        var midpackHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').attr('id', 'name').html(decoration.typeness[decoration.orderTypeness])));
        var midpackBody = $("<div></div>").addClass('widget-body');
        var midpackTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        midpackBody.append($("<div></div>").addClass('widget-body-inner').append(midpackTable.append(this.createDivForPayment("col-md-4", "折前总价", "quotationPrice", true), this.createDivForPayment("col-md-4", "工程总额", "projectPrice", true), this.createDivForPayment("col-md-4", "管理费", "managePrice", false), this.createDivForPayment("col-md-4", "主材总额", "materialPrice", true), this.createDivForPayment("col-md-4", "实收主材额", "materialPaidup", true), this.createDivForPayment("col-md-4", "主材额百分比", "materialPercent", false), this.createDivForPayment("col-md-4", "服务费", "servicePrice", true), this.createDivForPayment("col-md-4", "实收服务费", "servicePaidup", true), this.createDivForPayment("col-md-4", "服务费百分比", "servicePercent", false), this.createDivForPayment("col-md-4", "外销总额", "amountOales", true), this.createDivForPayment("col-md-4", "主材总比例", "oalesPercent", false))));
        midpackDiv.append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(midpackHeader, midpackBody)))

        var quotation = {};
        var midpack = {};
        var oales = {
            "amount": 0
        }

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": decoration.orderId,
        }, function(res) {

            if (res.quotation)
                quotation = res.quotation;
        }, null, false);

        if (!quotation.qid)
            return false;

        com.post(api.decoration.queryDecorationMidpack, {
            "decorationMidpack.decoration.orderId": decoration.orderId
        }, function(res) {

            if (res.decorationMidpack)
                midpack = res.decorationMidpack;
        }, null, false);

        com.post(api.sales.amountOales, {
            "oales.decoration.orderId": decoration.orderId
        }, function(res) {

            if (res.amount)
                oales.amount = res.amount;
        }, null, false);

        var managePrice = quotation.managePrice * (quotation.manageDiscount == 1 ? quotation.discount / 10 : 1);
        var taxPrice = quotation.taxPrice;

        if (quotation.taxDiscount == 1) {
            taxPrice = quotation.taxPrice * (quotation.manageDiscount == 1 ? quotation.discount / 10 : 1);
        }

        var mantaxPrice = (quotation.taxDiscount == 1 ? utils.accAdd(managePrice, taxPrice) : managePrice);

        var beforeTotal = quotation.disPrice + quotation.undisPrice + quotation.trafficPrice + quotation.managePrice + quotation.taxPrice;
        var projectPrice = quotation.disPrice * quotation.discount / 10 + quotation.undisPrice + quotation.trafficPrice + managePrice + taxPrice;

        projectPrice = quotation.disPrice + quotation.undisPrice + quotation.trafficPrice;

        com.focusPage('#quotationPrice').html(utils.changeTwoDecimal(com.checkNull(beforeTotal, 0)));
        com.focusPage('#projectPrice').html(utils.changeTwoDecimal(com.checkNull(projectPrice, 0)));
        com.focusPage('#managePrice').html(utils.changeTwoDecimal(com.checkNull(quotation.taxDiscount == 1 ? utils.accAdd(quotation.managePrice, quotation.taxPrice) : quotation.managePrice, 0)));

        com.focusPage('#materialPrice').html(com.checkNull(midpack.materialPrice, 0));// 主材总额
        com.focusPage('#materialPaidup').html(com.checkNull(midpack.materialPaidup, 0));// 实收主材额
        com.focusPage('#servicePrice').html(com.checkNull(midpack.servicePrice, 0));
        com.focusPage('#servicePaidup').html(com.checkNull(midpack.servicePaidup, 0));

        com.focusPage('#amountOales').html(com.checkNull(oales.amount, 0));

        if (midpack.materialPrice == null || midpack.materialPrice == 0) {
            com.focusPage('#materialPercent').html(0);
        } else {
            var materialPercent = utils.accMul(utils.changeThrDecimal(com.checkNull(midpack.materialPaidup / midpack.materialPrice, 0)), 100);
            com.focusPage('#materialPercent').html((materialPercent > 100 ? 100 : materialPercent) + "%");
        }

        if (midpack.servicePrice == null || midpack.servicePrice == 0) {
            com.focusPage('#servicePercent').html(0);
        } else {
            var servicePercent = utils.accMul(utils.changeThrDecimal(com.checkNull(midpack.servicePaidup / midpack.servicePrice, 0)), 100);
            com.focusPage('#servicePercent').html((servicePercent > 100 ? 100 : servicePercent) + "%");
        }

        if (midpack.materialPrice == null || midpack.materialPrice == 0) {
            com.focusPage('#oalesPercent').html(0);
        } else {
            var oalesPercent = utils.accMul(utils.changeThrDecimal(com.checkNull((midpack.materialPaidup + oales.amount) / midpack.materialPrice, 0)), 100);
            com.focusPage('#oalesPercent').html((oalesPercent > 100 ? 100 : oalesPercent) + "%");
        }
    },

    initDecorationInclusive: function(decoration, wizard) {

        var mainDiv = com.focusPage('#preparePayment').html("");

        var inclusiveDiv = $("<div></div>").addClass('row');
        var inclusiveHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("全包-款项信息")));
        var inclusiveBody = $("<div></div>").addClass('widget-body');
        var inclusiveTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        var serviceBody = $("<div></div>").addClass('widget-body');

        inclusiveBody.append($("<div></div>").addClass('widget-body-inner').append(inclusiveTable.append(this.createDivForPayment("col-md-2", "合同金额", "contractPrice", true), this.createDivForPayment("col-md-2", "工程总额", "projectPrice", true), this.createDivForPayment("col-md-2", "工程增项", "cdiff", true), this.createDivForPayment("col-md-2", "主材增项", "mdiff", true), this.createDivForPayment("col-md-2", "管理费", "managePrice", false), this.createDivForPayment("col-md-2", "实收主材额", "materialPaidup", true))));
        serviceBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
        inclusiveDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(inclusiveHeader, inclusiveBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(inclusiveDiv);
        $('<div></div>').addClass('hr col-md-12').prependTo(inclusiveDiv);
        inclusiveDiv.appendTo(mainDiv);

        var quotation = {};
        var inclusive = {};

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": decoration.orderId,
        }, function(res) {

            if (res.quotation)
                quotation = res.quotation;
        }, null, false);

        if (!quotation.qid)
            return false;

        com.post(api.decoration.queryDecorationInclusive, {
            "decorationInclusive.decoration.orderId": decoration.orderId
        }, function(res) {

            if (res.decorationInclusive)
                inclusive = res.decorationInclusive;
        }, null, false);

        var managePrice = quotation.managePrice * (quotation.manageDiscount == 1 ? quotation.discount / 10 : 1);
        var taxPrice = quotation.taxPrice;

        if (quotation.taxDiscount == 1) {
            taxPrice = quotation.taxPrice * (quotation.manageDiscount == 1 ? quotation.discount / 10 : 1);
        }

        var mantaxPrice = (quotation.taxDiscount == 1 ? utils.accAdd(managePrice, taxPrice) : managePrice);

        var beforeTotal = quotation.disPrice + quotation.undisPrice + quotation.trafficPrice + quotation.managePrice + quotation.taxPrice;
        var projectPrice = quotation.disPrice * quotation.discount / 10 + quotation.undisPrice + quotation.trafficPrice + managePrice + taxPrice;

        com.focusPage('#quotationPrice').html(utils.changeTwoDecimal(com.checkNull(beforeTotal, 0)));
        com.focusPage('#projectPrice').html(utils.changeTwoDecimal(com.checkNull(projectPrice, 0)));
        com.focusPage('#managePrice').html(utils.changeTwoDecimal(com.checkNull(quotation.managePrice, 0)));

        com.focusPage('#contractPrice').html(utils.changeTwoDecimal(com.checkNull(inclusive.contractPrice, 0)));
        com.focusPage('#cdiff').html(utils.changeTwoDecimal(com.checkNull(inclusive.cdiff, 0)));
        com.focusPage('#mdiff').html(utils.changeTwoDecimal(com.checkNull(inclusive.mdiff, 0)));
        com.focusPage('#materialPaidup').html(utils.changeTwoDecimal(com.checkNull(inclusive.materialPaidup, 0)));
    },

    initDecorationHolonomy: function(decoration, wizard) {

        var mainDiv = com.focusPage('#preparePayment').html("");

        var holonomyDiv = $("<div></div>").appendTo(mainDiv);
        var holonomyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').attr('id', 'name').html(decoration.typeness[decoration.orderTypeness])));
        var holonomyBody = $("<div></div>").addClass('widget-body');
        var holonomyTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        holonomyBody.append($("<div></div>").addClass('widget-body-inner').append(holonomyTable.append(this.createDivForPayment("col-md-4", "折前总价", "quotationPrice", true), this.createDivForPayment("col-md-4", "工程总额", "projectPrice", true), this.createDivForPayment("col-md-4", "管理费", "managePrice", false), this.createDivForPayment("col-md-4", "主材总额", "materialPrice", true), this.createDivForPayment("col-md-4", "实收主材额", "materialPaidup", true), this.createDivForPayment("col-md-4", "主材额百分比", "materialPercent", false), this.createDivForPayment("col-md-4", "服务费", "servicePrice", true), this.createDivForPayment("col-md-4", "实收服务费", "servicePaidup", true), this.createDivForPayment("col-md-4", "服务费百分比", "servicePercent", false), this.createDivForPayment("col-md-4", "外销总额", "amountOales", true), this.createDivForPayment("col-md-4", "主材总比例", "oalesPercent", false))));
        holonomyDiv.append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(holonomyHeader, holonomyBody)))

        var quotation = {};
        var holonomy = {};
        var oales = {
            "amount": 0
        }

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": decoration.orderId,
        }, function(res) {

            if (res.quotation)
                quotation = res.quotation;
        }, null, false);

        if (!quotation.qid)
            return false;

        com.post(api.decoration.queryDecorationHolonomy, {
            "decorationHolonomy.decoration.orderId": decoration.orderId
        }, function(res) {

            if (res.decorationHolonomy)
                holonomy = res.decorationHolonomy;
        }, null, false);

        com.post(api.sales.amountOales, {
            "oales.decoration.orderId": decoration.orderId
        }, function(res) {

            if (res.amount)
                oales.amount = res.amount;
        }, null, false);

        var managePrice = quotation.managePrice * (quotation.manageDiscount == 1 ? quotation.discount / 10 : 1);
        var taxPrice = quotation.taxPrice;

        if (quotation.taxDiscount == 1) {
            taxPrice = quotation.taxPrice * (quotation.manageDiscount == 1 ? quotation.discount / 10 : 1);
        }

        var mantaxPrice = (quotation.taxDiscount == 1 ? utils.accAdd(managePrice, taxPrice) : managePrice);
        var basePrice = (quotation.basePrice && quotation.basePrice != 0) ? quotation.basePrice : holonomy.discountBase;

        var basePrice = quotation.undisPrice + quotation.disPrice + quotation.trafficPrice;
        var beforeTotal = quotation.disPrice + quotation.undisPrice + quotation.trafficPrice + quotation.managePrice + quotation.taxPrice;
        var projectPrice = (basePrice - (basePrice % basePrice)) * (quotation.discount / 10) + (basePrice % basePrice) + managePrice + taxPrice;

        projectPrice = quotation.disPrice + quotation.undisPrice + quotation.trafficPrice;

        com.focusPage('#quotationPrice').html(utils.changeTwoDecimal(com.checkNull(beforeTotal, 0)));
        com.focusPage('#projectPrice').html(utils.changeTwoDecimal(com.checkNull(projectPrice, 0)));
        com.focusPage('#managePrice').html(utils.changeTwoDecimal(com.checkNull(quotation.taxDiscount == 1 ? utils.accAdd(quotation.managePrice, quotation.taxPrice) : quotation.managePrice, 0)));

        com.focusPage('#materialPrice').html(utils.changeTwoDecimal(com.checkNull(holonomy.materialPrice, 0)));
        com.focusPage('#servicePrice').html(utils.changeTwoDecimal(com.checkNull(holonomy.servicePrice, 0)));
        com.focusPage('#materialPaidup').html(utils.changeTwoDecimal(com.checkNull(holonomy.materialPaidup, 0)));
        com.focusPage('#servicePaidup').html(utils.changeTwoDecimal(com.checkNull(holonomy.servicePaidup, 0)));

        com.focusPage('#amountOales').html(com.checkNull(oales.amount, 0));

        if (holonomy.materialPrice == null || holonomy.materialPrice == 0) {
            com.focusPage('#materialPercent').html(0);
        } else {
            var materialPercent = utils.accMul(utils.changeThrDecimal(com.checkNull(holonomy.materialPaidup / holonomy.materialPrice, 0)), 100);
            com.focusPage('#materialPercent').html((materialPercent > 100 ? 100 : materialPercent) + "%");
        }

        if (holonomy.servicePrice == null || holonomy.servicePrice == 0) {
            com.focusPage('#servicePercent').html(0);
        } else {
            var servicePercent = utils.accMul(utils.changeThrDecimal(com.checkNull(holonomy.servicePaidup / holonomy.servicePrice, 0)), 100);
            com.focusPage('#servicePercent').html((servicePercent > 100 ? 100 : servicePercent) + "%");
        }

        if (holonomy.materialPrice == null || holonomy.materialPrice == 0) {
            com.focusPage('#oalesPercent').html(0);
        } else {
            var oalesPercent = utils.accMul(utils.changeThrDecimal(com.checkNull((holonomy.materialPaidup + oales.amount) / holonomy.materialPrice, 0)), 100);
            com.focusPage('#oalesPercent').html((oalesPercent > 100 ? 100 : oalesPercent) + "%");
        }
    },

    initDecorationBelong: function(orderId, status) {

        var $design, $salesman, $designul, $salesmanul;

        if (status == 0) {
            $design = com.focusPage("#belongDesignInfo").html('');
            $salesman = com.focusPage("#belongSalesmanInfo").html('');

            $designul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($design);
            $salesmanul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesman);

        } else {
            $design = com.focusPage("#loseBelongDesignInfo").html('');
            $salesman = com.focusPage("#loseBelongSalesmanInfo").html('');

            $designul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($design);
            $salesmanul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesman);

        }

        var decorationBelongs = null;

        com.post(api.decoration.queryDecorationBelong, {
            "decorationBelong.orderId": orderId,
            "decorationBelong.status": status
        }, function(res) {

            decorationBelongs = res.decorationBelongs;
        }, null, false);

        if (decorationBelongs && decorationBelongs.length) {
            $.each(decorationBelongs, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.belonger.currentName));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [["员工号:", v.belonger.userId, "grey"], ["所属部门:", v.department.name, "grey"], ["所属大区:", v.region.name, "grey"], ["分配比例:", v.rate, "grey"], ["默认:", v.defaultFlag == 1 ? '是' : '否', "grey"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

                v.type == 0 ? $liLine.appendTo($designul) : $liLine.appendTo($salesmanul);
            });
        }
    },

    loadHuploadify: function(eId, ename, fileType, multi, callback, btnstyle) {

        var limit = 5;

        if (["selfieBlock", "drawingBlock", "photoBlock", "file720Block"].indexOf(eId) != -1) {
            limit = 1;
        }

        com.uploadify("#" + eId, ename, api.common.uploadImg, ('btn ' + btnstyle ? btnstyle : "btn-success"), fileType, {
            'uploadType': 2
        }, limit, function(data) {

            callback(data);
        });

    },

    addDecorationPicture: function(data, type, eId) {

        if (data.errorCode == 0) {

            var options = {
                "decorationPicture.path": data.resUrl,
                "decorationPicture.name": data.strutsUploadsFileName,
                "decorationPicture.content": "",
                "decorationPicture.orderId": params.decoration.orderId,
                "decorationPicture.type": type,
                "decorationPicture.filesize": data.filesize,
            };

            com.post(api.decoration.addDecorationPicture, options, function(res) {

                if (type == 0) {
                    decorationUtils.addCAD(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 1) {
                    decorationUtils.addPicture(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 2) {
                    decorationUtils.addPicture(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 3) {
                    decorationUtils.addPicture(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 4) {
                    decorationUtils.addPicture(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 5) {
                    decorationUtils.addPicture(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 11) {
                    decorationUtils.addPicture(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 21) {
                    decorationUtils.addPicture(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 31) {
                    decorationUtils.addPicture(com.focusPage("#" + eId), res.decorationPicture);
                } else if (type == 41) {
                    decorationUtils.addCAD(com.focusPage("#" + eId), res.decorationPicture);
                }
            });
        } else {
            com.showAlert(com.error, data.errorMsg);
        }
    },

    initDecorationPicture: function(designId, pictureId, cadId, contractId, originalId, agreeId, designContractPictureId, selfieId, drawingId, liveId, panoramaId, orderId) {

        var $desgin = com.focusPage("#" + designId).html("");
        var $picture = com.focusPage("#" + pictureId).html("");
        var $contract = com.focusPage("#" + contractId).html("");
        var $cad = com.focusPage("#" + cadId).html("");
        var $original = com.focusPage("#" + originalId).html("");
        var $agree = com.focusPage("#" + agreeId).html("");
        var $contractPicture = com.focusPage("#" + designContractPictureId).html("");
        var $selfie = com.focusPage("#" + selfieId).html("");
        var $drawing = com.focusPage("#" + drawingId).html("");
        var $live = com.focusPage("#" + liveId).html("");
        var $panorama = com.focusPage("#" + panoramaId).html("");

        com.post(api.decoration.queryDecorationPictureByOrderId, {
            "decorationPicture.orderId": orderId
        }, function(res) {

            var decorationPictures = res.decorationPictures;
            var length = decorationPictures.length;

            for ( var i = 0; i < length; i++) {

                var decorationPicture = decorationPictures[i];

                if (decorationPicture.type == 0) {
                    decorationUtils.addCAD($cad, decorationPicture);
                } else if (decorationPicture.type == 1) {
                    decorationUtils.addPicture($desgin, decorationPicture);
                } else if (decorationPicture.type == 2) {
                    decorationUtils.addPicture($picture, decorationPicture);
                } else if (decorationPicture.type == 3) {
                    decorationUtils.addPicture($contract, decorationPicture);
                } else if (decorationPicture.type == 4) {
                    decorationUtils.addPicture($original, decorationPicture);
                } else if (decorationPicture.type == 5) {
                    decorationUtils.addPicture($contractPicture, decorationPicture);
                } else if (decorationPicture.type == 11) {
                    decorationUtils.addPicture($selfie, decorationPicture);
                } else if (decorationPicture.type == 21) {
                    decorationUtils.addPicture($drawing, decorationPicture);
                } else if (decorationPicture.type == 31) {
                    decorationUtils.addPicture($live, decorationPicture);
                } else if (decorationPicture.type == 41) {
                    decorationUtils.addCAD($panorama, decorationPicture);
                }
            }

            com.popup4photos("#OriginalPicture");
            com.popup4photos("#designPictures");
            com.popup4photos("#projectPictures");
            com.popup4photos("#ContractPictures");
            com.popup4photos("#CADProjectPicture");
            com.popup4photos("#designContractPicture");
            com.popup4photos("#selfiePicture");
            com.popup4photos("#drawingPicture");
            com.popup4photos("#livePicture");
            com.popup4photos("#720Files");
        });

        com.post(api.decoration.queryDecorationContractByOrderId, {
            "decorationContract.orderId": orderId
        }, function(res) {

            $.each(res.decorationContracts, function(i, v) {

                if (v.ishow == 0)
                    decorationUtils.addContract($agree, v);
            });
        });

        com.focusPage("#confirmDesign").on('click', function() {

            com.showConfirm("是否发送客户确认合同方案", function() {

                com.post(api.decoration.sendDecorationInfoForConfirm, {
                    "decorationInfo.orderId": orderId,
                    "decorationInfo.sourceStatus": 1
                }, function() {

                    com.showAlert(com.info, "发送成功");
                });
            });
        });

        com.focusPage("#confirmPricture").on('click', function() {

            com.showConfirm("是否发送客户确认放线方案", function() {

                com.post(api.decoration.sendDecorationInfoForConfirm, {
                    "decorationInfo.orderId": orderId,
                    "decorationInfo.sourceStatus": 2
                }, function() {

                    com.showAlert(com.info, "发送成功");
                });
            });
        });

        com.focusPage("#checkOriginalBtn").on('click', function() {

            var constructionInfo = null

            com.post(api.construction.queryConstructionInfoByOrderId, {
                "constructionInfo.orderId": orderId
            }, function(res) {

                constructionInfo = res.constructionInfo;
            }, null, false);

            if (!constructionInfo || !constructionInfo.ciid) {
                com.showAlert(com.warning, "工程信息不存在");
                return false;
            }

            com.showConfirm("确认量房已验证", function() {

                var option = {
                    "constructionInfo.ciid": constructionInfo.ciid,
                    "constructionInfo.isCheck": 2,
                };

                com.post(api.construction.checkConstructionInfo, option, function(res) {

                    com.showAlert(com.info, "操作成功");
                });
            });
        });

    },

    addPicture: function(e, i) {

        var size = 200;

        if ([11, 21, 31].indexOf(i.type) != -1) {
            size = 150;

            var firstLiId = e.find('li').first().attr('id');
            var totalLiCount = e.find('li').length;

            if (totalLiCount > 0) {

                var dpId = firstLiId.split("_")[1];

                com.post(api.decoration.deleteDecorationPicture, {
                    "decorationPicture.dpId": dpId
                }, function(res) {

                    com.focusPage("#imgLi_" + dpId).remove();
                });
            }

        }

        var $li = $('<li></li>').attr("id", "imgLi_" + i.dpId).appendTo(e);
        var $img = $('<img></img>').attr('width', size).attr('height', size);
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').append($img).appendTo($li);

        com.showImg($img, i.path, size, size, i.name);

        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(i.name).appendTo($nameHolder);
        var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(i.uploadTime).appendTo($timeHolder);

        // 为合同方案图片(type=1)添加状态文字显示
        if (i.type == 1) {
            // 使用常量获取状态文字
            var statusConfig = constant.decoration().decorationPicture.status;
            var statusText = statusConfig.keys[i.status] || '未知';
            var statusClass = '';

            switch (i.status) {
                case 0:
                    statusClass = 'label-grey';
                    break;
                case 1:
                    statusClass = 'label-success';
                    break;
                case 4:
                    statusClass = 'label-primary';
                    break;
                default:
                    statusClass = 'label-default';
            }

            var $statusHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
            var $statusInfo = $('<span></span>').addClass('label ' + statusClass + ' arrowed').text(statusText).appendTo($statusHolder);
        }

        var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
        var $toolLabel = $('<label></label>').appendTo($tools);
        var $downA = $('<a></a>').addClass("icon-download-alt").appendTo($tools);

        // 为 type=1 (合同方案) 图片添加批量选择复选框
        if (i.type == 1) {
            var $checkbox = $('<input type="checkbox">')
                .addClass('picture-checkbox')
                .attr('data-dpid', i.dpId)
                .attr('data-orderid', i.orderId)
                .css({
                    'position': 'absolute',
                    'top': '5px',
                    'left': '5px',
                    'z-index': '10',
                    'width': '18px',
                    'height': '18px'
                })
                .appendTo($li);
        }

        var $delA = $('<a></a>').addClass("icon-remove").appendTo($tools);

        $delA.click(function() {

            com.post(api.decoration.deleteDecorationPicture, {
                "decorationPicture.dpId": i.dpId
            }, function(res) {

                com.focusPage("#imgLi_" + res.decorationPicture.dpId).remove();

            });
        });

        com.downloadFile($downA, i.path, i.name);

        com.popup4photos("#OriginalPicture");
        com.popup4photos("#designPictures");
        com.popup4photos("#projectPictures");
        com.popup4photos("#ContractPictures");
        com.popup4photos("#CADProjectPicture");
        com.popup4photos("#designContractPicture");
        com.popup4photos("#selfiePicture");
        com.popup4photos("#drawingPicture");
        com.popup4photos("#livePicture");
        com.popup4photos("#720Files");
    },

    addCAD: function(e, i) {

        if (i.type == 41) {

            var firstLiId = e.find('div').first().attr('id');
            var totalLiCount = e.find('div').length;

            if (totalLiCount > 0) {

                var dpId = firstLiId.split("_")[1];

                com.post(api.decoration.deleteDecorationPicture, {
                    "decorationPicture.dpId": dpId
                }, function(res) {

                    com.focusPage("#cad_" + dpId).remove();
                });
            }

        }

        var $name = i.name;

        var $infobox = $('<div></div>').addClass('infobox infobox-blue infobox-dark').attr("id", "cad_" + i.dpId).appendTo(e);
        var $infoboxIcon = $('<div></div>').addClass('infobox-icon').appendTo($infobox);
        var $downIcon = $('<a></a>').addClass('icon-download-alt').appendTo($infoboxIcon);

        com.downloadFile($downIcon, i.path, new Date().getTime() + '.' + $name.split('.')[1]);

        var $infoboxData = $('<div></div>').addClass('infobox-data').appendTo($infobox);
        var $infoboxLeft = $('<div></div>').css('float', 'left').appendTo($infoboxData);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text($name.split('.')[0].substr(0, 8) + '.' + $name.split('.')[1]).appendTo($infoboxLeft);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.uploadTime).appendTo($infoboxLeft);

        var $delA = $('<a></a>').addClass("icon-remove").css({
            'float': 'right',
            'font-size': '22px',
            'color': 'white'
        }).appendTo($infoboxData);

        $downIcon.click(function() {

            com.post(api.decoration.downloadDecorationPicture, {
                "decorationPicture.dpId": i.dpId
            }, function(res) {

            });
        });

        $delA.click(function() {

            com.post(api.decoration.deleteDecorationPicture, {
                "decorationPicture.dpId": i.dpId
            }, function(res) {

                com.focusPage("#cad_" + res.decorationPicture.dpId).remove();
            });
        });
    },

    addContract: function(e, i) {

        var $name = i.name;

        var $infobox = $('<div></div>').addClass('infobox infobox-blue infobox-dark').attr("id", "contract_" + i.dcid).appendTo(e);

        var $infoboxData = $('<div></div>').addClass('infobox-data').appendTo($infobox);
        var $infoboxLeft = $('<div></div>').css('float', 'left').appendTo($infoboxData);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.name).appendTo($infoboxLeft);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.createTime).appendTo($infoboxLeft);
        
        $infobox.click(function() {
            
            if (params.urlLoadParams.depage == "designer" || params.urlLoadParams.depage == "plan")
                return false;

            com.post(api.decoration.viewDecorationContract, {
                "decorationContract.dcid": i.dcid
            }, function(res) {

                com.popup4frame("合同查看", res.redirect);
            });
        });
    },

    initConstructionScheduleInfo: function() {

        // ⚠️ 本方法为死代码(无调用方), 其依赖的 scheduleInfos 数组是写死的 9 项,
        // 无法覆盖生产 sort 取值(0-25)且各公司不同, 已废弃。
        // 节点中文名应通过 res.constructionSchedule.node.name 获取。

        var options = {};

        options["constructionSchedule.orderId"] = orderId.decoration.orderId;

        com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function(res) {

            for ( var qualityName in decorationUtils.qualityIds) {
                com.focusPage("#" + qualityName + "QualityId").val(res.constructionSchedule[qualityName + "QualityName"]);
            }

            com.focusPage("#schedule").val(decorationUtils.scheduleInfos[parseInt(res.constructionSchedule.schedule)]);
        });
    },

    initBaseInfo: function(orderId, $api, callback) {

        com.post($api, {
            "decoration.orderId": orderId
        }, function(res) {

            callback(res.decoration);
        }, null, false);

    },

    initAccount: function(orderId, accountFlg) {

        var $metaData = com.focusPage('#accountPayment').html('');

        com.post(api.decoration.queryDecorationAccount, {
            "decorationAccount.orderId": orderId
        }, function(res) {

            res = res.decorationAccount;

            if (accountFlg) {
                $metaData.html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($metaData);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                $mesg.append($('<span></span>').text('无可用数据提供'));
            } else {

                function createDivForAccount(inclass, string, id, isleft) {

                    return $("<div></div>").addClass(inclass).css(isleft ? {
                        "border-left": "solid 1px #e3e3e3",
                        "margin-top": "15px"
                    } : {
                        "border-left": "solid 1px #e3e3e3",
                        "border-right": "solid 1px #e3e3e3",
                        "margin-top": "15px"
                    }).append($("<h5></h5>").addClass('bigger-110 center').html(string)).append($("<h2></h2>").addClass('oid bigger  center').append($('<b></b>').addClass('blue').attr('id', id).html(0)));
                }

                function deployAccount(id, title, content) {

                    var accountDiv = $("<div id=" + id + "></div>").addClass('row');
                    var accountHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html(title)));
                    var accountBody = $("<div></div>").addClass('widget-body');
                    var accountTable = $("<div></div>").addClass('clearfix').css({
                        "margin-top": "15px",
                        "margin-bottom": "15px"
                    });
                    accountBody.append($("<div></div>").addClass('widget-body-inner').append(accountTable));

                    $.each(content, function(i, v) {

                        createDivForAccount(v[0], v[1], v[2], v[3]).appendTo(accountTable);
                    });

                    accountDiv.append($("<div></div>").addClass('widget-container-span col-md-12').append($("<div></div>").addClass('widget-box transparent').append(accountHeader, accountBody)));

                    $('<div></div>').addClass('hr col-md-12').appendTo(accountDiv);
                    $('<div></div>').addClass('hr col-md-12').prependTo(accountDiv);

                    return accountDiv;
                }

                com.focusPage("#accountPayment").append(deployAccount("account", "决算信息", [

                ["col-md-4", "主材配比", "maching", true], ["col-md-4", "折扣", "discount", true], ["col-md-4", "工程总额", "projectPrice_account", false], ["col-md-4", "主材总额", "materialPrice_account", true], ["col-md-4", "服务费比例", "serviceRate", true], ["col-md-4", "服务费", "servicePrice_account", false]]));

                com.focusPage('#maching').html((utils.changeTwoDecimal(com.checkNull(res.matching * 100, 0)) + "%"));
                com.focusPage('#discount').html(com.checkNull(res.discount, 0));
                com.focusPage('#projectPrice_account').html(com.checkNull(res.projectPrice, 0));
                com.focusPage('#materialPrice_account').html(com.checkNull(res.materialPrice, 0));
                com.focusPage('#serviceRate').html(utils.changeTwoDecimal(com.checkNull(res.serviceRate * 100, 0)) + "%");
                com.focusPage('#servicePrice_account').html(com.checkNull(res.servicePrice, 0));
            }

        });
    },

    initService: function(decorationDetail, orderId) {

        var $service = com.focusPage("#serviceInfo").html('');

        var $serviceul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($service);

        var serviceInfo = null;

        com.post(api.decoration.queryDecorationServiceByOrderId, {
            "decorationService.orderId": orderId
        }, function(res) {

            decorationServices = res.decorationServices;
        }, null, false);

        if (decorationServices && decorationServices.length) {
            $.each(decorationServices, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').addClass('blue').html(v.name));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                var $updateBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').html('完成');

                var propertyArr = [["装修单号:", v.orderId, "grey"], ["详述:", v.detail, "grey"], ["操作人:", v.operater.currentName, "grey"], ["操作时间:", v.operateTime, "green"], ["状态:", constant.decoration().decorationService.status.keys[v.status], "red"], ["备注:", v.comment, "grey"]];

                $updateBtn.click(function() {

                    decorationDetail.dsid = v.dsid;
                    com.cleanItems(decorationDetail.serviceItems);
                    decorationDetail.serviceModal.modal("show");
                });

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                if (v.status == constant.decoration().decorationService.STATUS_INIT_INT) {
                    $divBtnWrap.append($updateBtn);
                    $divBtnWrap.appendTo($h4);
                }

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

                $liLine.appendTo($serviceul);
            });
        } else {
            var $metaData = com.focusPage('#serviceInfo').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($metaData);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            $mesg.append($('<span></span>').text('无可用数据提供'));
        }
    },

    // 服务团队成员类型文案: 优先取 communion.constant(decoration.decorationUser.type), SQL未配置或历史NULL值时回退硬编码
    userTypeText: function(type) {

        var fallback = { 0: '业务', 1: '装饰', 2: '服务', 3: '合同', 4: '销售', 99: '其他' };

        var key = type == null ? 99 : type;

        var enumNode = constant.decoration().decorationUser.type;

        if (enumNode && enumNode.keys && enumNode.keys[key] != undefined) {
            return enumNode.keys[key];
        }

        return fallback[key] || '其他';
    },

    // 服务团队角色建议: content 字典化(communion.constant decoration.decorationUser.contentRole)驱动 datalist;
    // SQL 未配置时静默跳过(自由输入不受影响), 已填充过则跳过
    fillContentRoleOptions: function(datalistId) {

        var $datalist = com.focusPage("#" + (datalistId || "duContentOptions"));

        if ($datalist.length == 0 || $datalist.children().length > 0) return;

        var roleNode = constant.decoration().decorationUser.contentRole;

        if (!roleNode || !roleNode.datas || roleNode.datas.length == 0) return;

        $.each(roleNode.datas, function(i, v) {
            $('<option></option>').attr("value", v.value).appendTo($datalist);
        });
    },

    initUsers: function(decorationDetail, orderId) {

        var $users = com.focusPage("#usersInfo").html('');

        var decorationUsers = null;

        setTimeout(function() {

            pageList(1, 10);
        }, 500);

        function pageList(page, rows) {

            var option = {
                "paging.page": page,
                "paging.rows": rows,
                "decorationUser.orderId": orderId
            };

            com.post(api.decoration.queryDecorationUser, option, function(res) {

                createComLine(res.decorationUsers);
                if (page < res.paging.totalPage)
                    setTimeout(function() {

                        pageList(page + 1, rows);
                    }, 500);
                else
                    return;

            }, null, false);

        }

        function createComLine(decorationUsers) {

            if (decorationUsers && decorationUsers.length) {
                $.each(decorationUsers, function(i, v) {

                    decorationUtils.addDecorationUser(decorationDetail, $users, v);
                });
            } else {
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($users);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                $mesg.append($('<span></span>').text('无可用数据提供'));
            }
        }

    },

    // 显示头像
    addDecorationUser: function(decorationDetail, e, i) {

        var userBase = i.user;

        var $li = $('<li></li>').attr("id", "du_" + i.duid).appendTo(e);

        var $img = $('<img></img>');
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').css({
            'width': "180px",
            'height': "180px"
        }).append($img).appendTo($li);

        if (userBase.userPhoto != "" && userBase.userPhoto != null && userBase.userPhoto != undefined) {
            com.showImg($img, userBase.userPhoto, 180, 180, userBase.currentName);
        }
        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $isShowHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $isShowInfo = $('<span></span>').addClass('label label-info arrowed').text(constant.decoration().decorationUser.isShow.keys[i.isShow]).appendTo($isShowHolder);
        var $isPayHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $isPayInfo = $('<span></span>').addClass('label label-danger arrowed').text(constant.decoration().decorationUser.isPay.keys[i.isPay]).appendTo($isPayHolder);
        var $isNameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $isNameInfo = $('<span></span>').addClass('label label-info arrowed').text(userBase.currentName + " " + userBase.duty.name).appendTo($isNameHolder);
        var $isContentHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $isContentInfo = $('<span></span>').addClass('label label-danger arrowed').attr("id", "duCon_" + i.duid).text(i.content ? i.content : "待说明").appendTo($isContentHolder);
        var $isTypeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $isTypeInfo = $('<span></span>').addClass('label label-purple arrowed').attr("id", "duType_" + i.duid).text(decorationUtils.userTypeText(i.type)).appendTo($isTypeHolder);

        var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
        var $toolLabel = $('<label></label>').appendTo($tools);
        var $btnCon = $('<a></a>').addClass("icon-pencil").appendTo($tools);
        var $btnIss = $('<a></a>').addClass("icon-eye-open").appendTo($tools);
        var $btnIsp = $('<a></a>').addClass("icon-money").appendTo($tools);
        var $btnDel = $('<a></a>').addClass("icon-remove").appendTo($tools);

        $btnCon.click(function() {

            com.focusPage("#duUser").val(userBase.currentName + "-" + userBase.duty.name).attr("readonly", "readonly");
            com.focusPage("#duContent").val($isContentInfo.text());
            com.focusPage("#duType").val(i.type == null ? '99' : String(i.type)).attr("disabled", "disabled");
            decorationUtils.fillContentRoleOptions('duContentOptions');
            decorationDetail.decorationUser.duid = i.duid;
            decorationDetail.decorationUser.status = 1;
            decorationDetail.decorationUserModal.modal("show");

        });

        $btnIss.click(function() {

            com.showConfirm("确定要修改显示信息吗?", function() {

                com.post(api.decoration.updateDecorationUser, {
                    "decorationUser.duid": i.duid,
                    "decorationUser.isShow": i.isShow == constant.decoration().decorationUser.ISSHOW_HIDE_INT ? constant.decoration().decorationUser.ISSHOW_SHOW_INT : constant.decoration().decorationUser.ISSHOW_HIDE_INT
                }, function(res) {

                    com.showAlert(com.info, "操作成功");
                    $isShowInfo.text(constant.decoration().decorationUser.isShow.keys[res.decorationUser.isShow])
                });
            })
        });

        $btnIsp.click(function() {

            com.showConfirm("确定要修改薪资信息吗?", function() {

                com.post(api.decoration.updateDecorationUser, {
                    "decorationUser.duid": i.duid,
                    "decorationUser.isPay": i.isPay == constant.decoration().decorationUser.ISSPAY_UNPAID_INT ? constant.decoration().decorationUser.ISSPAY_PAID_INT : constant.decoration().decorationUser.ISSPAY_UNPAID_INT
                }, function(res) {

                    com.showAlert(com.info, "操作成功");
                    $isPayInfo.text(constant.decoration().decorationUser.isPay.keys[res.decorationUser.isPay])
                });
            })
        });

        $btnDel.click(function() {

            com.showConfirm("确定要删除装修人员信息吗?", function() {

                com.post(api.decoration.deleteDecorationUser, {
                    "decorationUser.duid": i.duid
                }, function(res) {

                    com.showAlert(com.info, "操作成功");
                    com.focusPage("#du_" + res.decorationUser.duid).remove();
                });
            })

        });

    },

    initAddreduce: function(orderId, type) {

        var $resList = com.focusPage('#resLists').html('');

        var $table = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').css('padding-top', '30px');

        var $aiA = $('<button id="push"><i class="icon-envelope bigger-120"></i>推送</button>').addClass('btn btn-xs btn-success pull-right');
        var $aiB = $('<button id="print" style="margin: 0 6px" ><i class="icon-print bigger-120"></i>打印</button>').addClass('btn btn-xs btn-info pull-right');

        $resList.append($aiA).append($aiB).append($table);

        var discount = null;
        var qid = null;
        var versionid = null;

        com.post(api.quotation.queryAddReduceByOrderId, {
            'addReduce.orderId': orderId
        }, function(data) {

            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                "quotation.orderId": orderId,
                "quotation.type": type
            }, function(res) {

                discount = res.quotation.discount;
                qid = res.quotation.qid;
                versionid = res.quotation.versionId;
            }, null, false);

            if (data.addReduces && data.addReduces.length) {
                $.each(data.addReduces, function(i, v) {

                    var typeDict = {
                        "0": "增项",
                        "1": "减项",
                        "2": "漏项"
                    };
                    var statusDict = {
                        "0": "未提交",
                        "1": "未付款",
                        "2": "已付款",
                        "3": "已确认"
                    };
                    var type = {
                        "0": "标准",
                        "1": "系统",
                        "2": "自定义",
                        "3": "报价减",
                        "4": "增项减",
                        "5": "扩展减",
                    };
                    var $li = $('<li style="margin-bottom: 0px;"></li>').addClass('widget-box  collapsed item-orange clearfix');

                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
                    var $ulProperty = $('<ul style="margin-bottom: 10px;"></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons widget-toolbar no-border');

                    var $a = $('<a href="#" data-action="collapse"></a>').append($('<i class="icon-chevron-down"></i>'));

                    var $wbody = $('<div style="border: 0px solid transparent;"></div>').addClass('widget-body');
                    var $winner = $('<div style="display: block;"></div>').addClass('widget-body-inner');

                    var $label = $('<label></label>');
                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "arids",
                        "class": "ace ace-checkbox-2"
                    }).val(v.arId);
                    var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.content);

                    var propertyArr = [["总价:", v.total, "red"], ["类别:", typeDict[v.type + ''], "red"], ["状态:", statusDict[v.status], "red"], ["添加时间:", v.createTime, "red"], ["折扣:", discount, "red"], ];

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
                    var $uul = $('<table></table>').addClass('table').attr("style", "margin-bottom: 0px").appendTo($winner).appendTo($wbody);
                    var $thead = $('<thead><tr><th>序号</th><th>工程预算量</th><th>名称</th><th>类型</th><th>工种</th><th>功能区</th><th>单位</th><th>单价</th><th>是否配比</th><th>总价</th></tr></thead>');

                    var $tbody = $('<tbody></tbody>');

                    $label.append($input).append($span).appendTo($h3);
                    $uul.append($thead).append($tbody);

                    com.post(api.quotation.queryAddReduceItemByAddReduceId, {
                        "addReduce.arId": v.arId
                    }, function(ress) {

                        if (ress.addReduceItems && ress.addReduceItems.length) {
                            $.each(ress.addReduceItems, function(j, r) {

                                var index = j + 1;
                                var $tr = $('<tr><th scope="row">' + index + '</th><th>' + r.num + '</th><th>' + r.itemName + '</th><th>' + (type[r.type]) + '</th>' + '<th>' + r.workType + '</th><th>' + (r.quotationFunctionAreaName ? r.quotationFunctionAreaName : "---") + '</th>' + '<th>' + r.measurementUnit + '</th><th>' + r.unitPrice + '</th><th>' + (r.unitPrice + '</th><th>' + r.discount == 0 ? "不打折(配比)" : r.discount == 1 ? "打折(配比)" : r.discount == 2 ? "不打折(非配比)" : "打折(非配比)") + '</th><th>' + (Math.round((r.unitPrice) * (r.num))) + '</th></tr>');

                                $tbody.append($tr);
                            });
                        }
                    });
                    $divBtnWrap.append($a).appendTo($h3);

                    $li.append($h3).append($ulProperty).append($wbody);

                    $table.append($li);
                });

                // 打印按钮
                com.focusPage('#print').click(function() {

                    var $inputs = com.focusPage('input[name="arids"]:checked');

                    var _addReduceIds = [];

                    if (!$inputs.length)
                        return false;

                    $.each($inputs, function(i, v) {

                        _addReduceIds.push(parseInt($(v).val()));
                    });

                    params.quotation.arids = _addReduceIds;

                    com.popup("增减项打印", api.index.addReduceOutputIndex.url, null, null, true);
                });

                // 推送按钮
                com.focusPage('#push').click(function() {

                    var $inputs = com.focusPage('input[name="arids"]:checked');
                    var arid = $inputs.val();

                    if (!$inputs.length)
                        return false;

                    $.each($inputs, function(i, v) {

                        var $v = $(v);

                        if ($v.val()) {
                            if ($inputs.val() != $v.val()) {
                                arid += "," + $v.val();
                            }
                        }
                    });

                    var options = {
                        "addReduce.content": arid,
                        "addReduce.orderId": orderId
                    };

                    com.showConfirm("是否推送通知", function() {

                        com.post(api.quotation.sendAddReduce, options, function(res) {

                            com.showAlert(com.info, "操作成功");
                            searcher.doSearch();
                        });
                    });

                });

            } else {

                $resList.html('');

                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resList);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);

                $mesg.append($('<span></span>').text('无可用数据提供'));
            }
        });
    },
    createDivForPayment: function(inclass, string, id, isleft) {

        return $("<div></div>").addClass(inclass).css(isleft ? {
            "border-left": "solid 1px #e3e3e3",
        } : {
            "border-left": "solid 1px #e3e3e3",
            "border-right": "solid 1px #e3e3e3",
        }).append($("<h5></h5>").addClass('bigger-110 center').html(string)).append($("<h2></h2>").addClass('oid bigger  center').append($('<b></b>').addClass('blue').attr('id', id).html(0)));
    },
    init: function() {

        com.post(api.data.queryReceiptType, {}, function(res) {

            decorationUtils.qualityIds = {
                "supervisor": "",
                "chan": "",
                "putline": "",
                "waterwayCircuitPower": "",
                "bricklay": "",
                "carpent": "",
                "oil": "",
                "cleaning": ""
            };
            decorationUtils.scheduleInfos = ["铲大白", "放线", "水力电", "瓦工", "地面找平", "木工", "油工", "水电验收", "保洁"];

            decorationUtils.cashInfo = {};
            decorationUtils.bankInfo = {};
            decorationUtils.checkBankInfo = {};
            decorationUtils.accountsInfo = {};

            $.each(res.receiptTypes, function(i, v) {

                if (v.type == 1) {
                    decorationUtils.cashInfo[v.no] = v.name;
                } else if (v.type == 2) {
                    decorationUtils.bankInfo[v.no] = v.name;
                } else if (v.type == 3) {
                    decorationUtils.checkBankInfo[v.no] = v.name;
                } else if (v.type == 4) {
                    decorationUtils.accountsInfo[v.no] = v.name;
                }
            });
        }, null, false);
    },
    createCounpon: function(ulId, typeId, stateTypeId, valId) {

        var $li = $("<li></li>").css({
            "background-color": "#91b8d0",
            "margin-bottom": "5px",
            "margin-right": "5px"
        }).appendTo(com.focusPage("#" + ulId));
        var $type = com.focusPage("#" + typeId).val();
        var $stateType = com.focusPage("#" + stateTypeId).val();
        var $coupon = com.focusPage("#" + valId).val();
        var $stateTypeText = com.focusPage("#" + stateTypeId).find("option:selected").text();

        var $span = $("<span></span>").css({
            'color': '#fff'
        }).attr('typeName', $type).attr('value', $stateType).attr('num', $coupon).attr('asid', com.focusPage("#" + typeId).attr('data-typeahead-key')).html($type).appendTo($li);
        var $spanOne = $("<span></span>").css({
            'color': '#fff',
            'margin': '0 5px'
        }).html("办理类型 :" + $stateTypeText).appendTo($span);
        var $spanTwo = $("<span></span>").css({
            'color': '#fff',
            'margin': '0 5px'
        }).html("数量 :" + $coupon).appendTo($spanOne);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({
            'color': '#d15b47'
        }).appendTo($li);
        $a.click(function() {

            $li.remove();
        });
    },

    countTatol: function(daiId) {

        var total = com.focusPage("#total_" + daiId).text();
        var coupon = com.focusPage("#_couponCut strong").text();
        var thing = com.focusPage("#_thingCut strong").text();
        var type = com.focusPage("#type_" + daiId).attr("type");
        var isPrefor = com.focusPage("#isPrefor_" + daiId).attr("isPrefor");

        if (type == 0 && isPrefor == 0) {
            coupon = utils.accSub(coupon, total);
        }
        if (type == 1 && isPrefor == 0) {
            thing = utils.accSub(thing, total);
        }

        com.focusPage("#_couponCut strong").html(coupon);
        com.focusPage("#_thingCut strong").html(thing);
        com.focusPage("#_detail strong").html(utils.accAdd(coupon, thing));
    },

    initQuotationPrint: function(wizard) {

        var quotationId = quotationUtils.quotationDetail.quotation.qid;
        var status = quotationUtils.quotationDetail.quotation.status;

        $("#printProjectBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 1;
            params.quotation.subtype = [-2];
            params.quotation.showType = {
                itemtype: 7
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printFinanceBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 2;
            params.quotation.subtype = [-2];
            params.quotation.showType = {
                itemtype: 7,
                "showStandardPrice": true
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printCostBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 6;
            params.quotation.subtype = [-2];
            params.quotation.showType = {
                itemtype: 8,
                notManagementArea: "生成项目"
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printCustomerBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 3;
            params.quotation.subtype = [-2];
            params.quotation.showType = {
                itemtype: 7
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printEngineeringBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 3;
            params.quotation.subtype = [1];
            params.quotation.showType = {
                itemtype: 7
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printMaterialBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 3;
            params.quotation.subtype = [2];
            params.quotation.showType = {
                itemtype: 7
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printWorkBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 4;
            params.quotation.subtype = [-2];
            params.quotation.showType = {
                itemtype: 7
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printQuoteItemBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 2;
            params.quotation.subtype = [1];
            params.quotation.showType = {
                itemtype: 1,
                notManagementArea: "生成项目"
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printExtensionItemBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 2;
            params.quotation.subtype = [1];
            params.quotation.showType = {
                itemtype: 2
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printAddReduceItemBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 2;
            params.quotation.subtype = [1];
            params.quotation.showType = {
                itemtype: 4
            };
            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        $("#printNormriceSBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 1;
            params.quotation.subtype = [1];
            params.quotation.showType = {
                itemtype: 4
            };
            params.quotation.workType = com.focusPage("#quotationCNSelect", "#printQuotationCNModal").val();
            com.popup("打印报价", "/views/quotation/normriceOutput.html", null, null, !!status);
        });

        $("#printNormriceWBtn").click(function() {

            params.quotation.quotationId = quotationId;
            params.quotation.type = 2;
            params.quotation.subtype = [1];
            params.quotation.showType = {
                itemtype: 4
            };
            params.quotation.workType = com.focusPage("#quotationCNSelect", "#printQuotationCNModal").val();
            com.popup("打印报价", "/views/quotation/normriceOutput.html", null, null, !!status);
        });

        $("#quotationType").click(function() {

            var layout = com.focusPage('input[name="layout"]:checked', '#printQuotationModal');
            com.focusPage('input[name="type"]:checked', '#printQuotationModal #types').prop("checked", false);
            com.focusPage('input[name="itemtype"]:checked', '#printQuotationModal #itemtypes').prop("checked", false);

            // 工种合并选项仅在 layout=4(工种) 时显示, 切换时恢复默认勾选
            var $workTypeMergeGroup = com.focusPage('#workTypeMergeGroup', '#printQuotationModal');
            if (layout.val() == 4) {
                $workTypeMergeGroup.show();
                com.focusPage('input[name="workTypeMerge"]', '#printQuotationModal').prop("checked", true);
            } else {
                $workTypeMergeGroup.hide();
            }

            if (layout.val() == 1) {
                com.focusPage('input[value="1"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="2"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="1"]', '#printQuotationModal #itemtypes').prop("checked", true);
            } else if (layout.val() == 2 || layout.val() == 3) {
                com.focusPage('input[value="1"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="2"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="8"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="16"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="0"]', '#printQuotationModal #itemtypes').prop("checked", true);
                com.focusPage('input[value="1"]', '#printQuotationModal #itemtypes').prop("checked", true);
            } else if (layout.val() == 4) {
                // 工种类: 内容默认勾选 基础(1)/成本(8)/管理(16), 种类默认勾选 管理(0)/工程(1)
                com.focusPage('input[value="1"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="8"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="16"]', '#printQuotationModal #types').prop("checked", true);
                com.focusPage('input[value="0"]', '#printQuotationModal #itemtypes').prop("checked", true);
                com.focusPage('input[value="1"]', '#printQuotationModal #itemtypes').prop("checked", true);
            }

        });

        $("#printingBtn").click(function() {

            var printConf = {
                "quotationId": quotationId,
                "layout": com.focusPage('input[name="layout"]:checked', '#printQuotationModal').val(),
                "type": 0,
                "itemtype": [],
                "calType": com.focusPage('input[name="calType"]:checked', '#printQuotationModal').val(),
                "workType": "",
                "merge": com.focusPage('input[name="workTypeMerge"]:checked', '#printQuotationModal').length > 0
            };

            var $types = com.focusPage('input[name="type"]:checked', '#printQuotationModal #types');
            var $itemtypes = com.focusPage('input[name="itemtype"]:checked', '#printQuotationModal #itemtypes');

            $.each($types, function(i, v) {

                var $input = $(v);
                printConf["type"] = parseInt(printConf["type"]) + parseInt($input.attr('value'));
            });

            $.each($itemtypes, function(i, v) {

                printConf["itemtype"].push(parseInt($(v).attr('value')));
            });

            params.quotation.quotation = {
                "printConf": printConf
            };
            
            var $show = wizard.opt == null ? [] : wizard.opt.btn == null ? [] : wizard.opt.btn;

            status = $show.includes("quotationIsPrint") ? true : false

            com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, !!status);
        });

        com.focusPage("#savePreferBtn").on("click", function() {

            if (com.validate('quotationPreferModal')) {
                return false;
            }

            var decoration = quotationUtils.quotationDetail.quotation.decoration;
            var quotation = quotationUtils.quotationDetail.quotation;
            var quotationPrefer = quotationUtils.quotationDetail.quotationPrefer;
            var extensionManagePrice = quotationUtils.quotationDetail.extensionManagePrice;

            var preferPrice = com.focusPage('#prefer').val();
            var managePrefer = com.focusPage('#manage').val();
            var advancePrefer = com.focusPage('#advance').val();
            var preferDiscount = quotationPrefer.discount ? quotationPrefer.discount : 0;
            var preferManageDiscount = quotationPrefer.manageDiscount ? quotationPrefer.manageDiscount : 0;
            var quoteArea = quotationPrefer.quoteArea ? quotationPrefer.quoteArea : 0;
            var quotePrice = quotationPrefer.quotePrice ? quotationPrefer.quotePrice : 0;

            var _discount = 0, _discountValue = 0;
            var _managePrice = utils.changeThrDecimal(utils.accAdd(quotation.managePrice, extensionManagePrice));
            var _manageDiscount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_managePrice, managePrefer), _managePrice));
            var _totalPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(quotation.undisPrice, quotation.disPrice), quotePrice), quotation.trafficPrice));

            var protation = {
                "quotePrice": 1,
                "preferPrice": 0,
                "managePrice": 0,
                "manageProfit": 0,
                "activityPrice": 0,
                "activityProfit": 0
            };

            com.post(api.quotation.queryProtationForDefaultByOrderId, {
                "protation.orderId": decoration.orderId
            }, function(res) {

                if (res.protation.pid)
                    protation = res.protation;
            }, null, false);

            if (decoration.type == constant.decoration().decoration.TYPE_INCLUSIVE_INT) {

                _preferPrice = quotationPrefer.quotePrice;

                _discount = utils.changeThrDecimal(utils.accDiv(utils.accSub(quotationPrefer.quotePrice, preferPrice), quotationPrefer.quotePrice));
                _discountValue = utils.changeThrDecimal(utils.accDiv(utils.accSub(protation.quotePrice, protation.preferPrice), protation.quotePrice));

                _manageDiscount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_managePrice, managePrefer), _managePrice));
                _manageDiscountValue = utils.changeThrDecimal(utils.accDiv(utils.accSub(protation.managePrice, protation.manageProfit), protation.managePrice));
            } else {

                _preferPrice = _totalPrice;

                _discount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_totalPrice, preferPrice), _totalPrice));
                _discountValue = quotation.discount;

                _manageDiscount = utils.changeThrDecimal(utils.accDiv(utils.accSub(_managePrice, managePrefer), _managePrice));
                _manageDiscountValue = quotation.discount;
            }

            _discount = _discount < 0 ? 0 : _discount > 1 ? 1 : _discount;
            _discountValue = _discountValue < 0 ? 0 : _discountValue > 1 ? 1 : _discountValue;

            _manageDiscount = _manageDiscount < 0 ? 0 : _manageDiscount > 1 ? 1 : _manageDiscount;
            _manageDiscountValue = _manageDiscountValue < 0 ? 0 : _manageDiscountValue > 1 ? 1 : _manageDiscountValue;

            if (_preferPrice < preferPrice) {
                com.showAlert(com.warning, "优惠金额不合理");
                return false;
            }

            if (_discount < _discountValue) {
                com.showAlert(com.warning, "优惠金额不合理");
                return false;
            }

            if (_managePrice < managePrefer) {
                com.showAlert(com.warning, "管理优惠不能大于管理费");
                return false;
            }

            if (_manageDiscount < _manageDiscountValue) {
                com.showAlert(com.warning, "管理费优惠金额不合理");
                return false;
            }

            var totalPrice = 0, dtaxPrice = 0, taxPrice = 0;
            var discount = utils.accDiv(quotation.discount, 10);
            var manageDiscount = quotation.manageDiscount == constant.data().quotationVersion.MANAGE_DISCOUNT_INT ? discount : 1;
            var trafficDiscount = quotation.trafficDiscount == constant.data().quotationVersion.TRAFFIC_DISCOUNT_INT ? discount : 1;
            var dmanagePrice = utils.accMul(quotation.managePrice, manageDiscount);
            var dtrafficPrice = utils.accMul(quotation.trafficPrice, trafficDiscount);
            var notSalesmanRate = quotation.decoration.notSalesmanRate;

            // 活动加价(加入报价单价) / 活动优惠(作为扣减项), 来自 protation
            var activityPrice = com.checkNull(protation.activityPrice, 0);
            var activityProfit = com.checkNull(protation.activityProfit, 0);
            var _quotePrice = utils.accAdd(quotePrice, activityPrice);

            if (quotation.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT) { // 管理税金
                taxPrice = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(quotation.disPrice, quotation.undisPrice), _quotePrice), quotation.trafficPrice), preferPrice), managePrefer), advancePrefer), activityProfit), quotation.taxRate));
                dtaxPrice = utils.changeThrDecimal(utils.accMul(taxPrice, manageDiscount));
            }

            if (quotation.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT) { // 总额税金
                taxPrice = utils.changeThrDecimal(utils.accMul(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(quotation.disPrice, quotation.undisPrice), _quotePrice), quotation.trafficPrice), quotation.managePrice), preferPrice), managePrefer), advancePrefer), activityProfit), quotation.taxRate));
                dtaxPrice = taxPrice;
            }

            if (quotation.basePrice && quotation.basePrice != 0) {

                var total = utils.accAdd(utils.accAdd(utils.accAdd(quotation.disPrice, quotation.undisPrice), _quotePrice), quotation.trafficPrice);
                var remainder = total % quotation.basePrice;
                totalPrice = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total, remainder), discount), remainder), dmanagePrice), dtaxPrice), preferPrice), managePrefer), advancePrefer), activityProfit));
            } else {

                totalPrice = utils.changeThrDecimal(utils.accSub(utils.accSub(utils.accSub(utils.accSub(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(quotation.disPrice, discount), quotation.undisPrice), _quotePrice), dtrafficPrice), dmanagePrice), dtaxPrice), preferPrice), managePrefer), advancePrefer), activityProfit));
            }

            totalPrice = utils.accAdd(totalPrice, !(notSalesmanRate > 0 && notSalesmanRate < 1) ? notSalesmanRate : 0);

            var params = {
                "quotation.qid": quotation.qid,
                "quotation.totalPrice": totalPrice,
                "quotation.taxPrice": taxPrice,
                "quotationPrefer.qid": quotation.qid,
                "quotationPrefer.preferPrice": preferPrice,
                "quotationPrefer.managePrefer": managePrefer,
                "quotationPrefer.advancePrefer": advancePrefer,
            };

            if (parseFloat(advancePrefer) > quotationPrefer.advancePrefer && parseFloat(advancePrefer) > protation.advanceProfit) {
                com.focusPage('#approveModal').modal("show");
                decorationUtils.initApproval(params);
                return false;
            }

            com.post(api.quotation.updateQuotationPrefer, params, function(res) {

                quotationPrefer.preferPrice = preferPrice;
                quotationPrefer.managePrefer = managePrefer;
                quotationPrefer.advancePrefer = advancePrefer;

                quotation.taxPrice = taxPrice;
                quotation.totalPrice = totalPrice;

                var $quotation = quotationUtils.quotationDetail.quotation;
                var $quotationPrefer = quotationUtils.quotationDetail.quotationPrefer;
                var $extensionTotalPrice = quotationUtils.quotationDetail.extensionTotalPrice;
                var $extensionTaxPrice = quotationUtils.quotationDetail.extensionTaxPrice;

                var $totalPrices = utils.changeThrDecimal(utils.accAdd(com.checkNull(quotation.totalPrice, 0), $extensionTotalPrice));
                var $taxPrices = utils.changeThrDecimal(utils.accAdd(com.checkNull(quotation.taxPrice, 0), $extensionTaxPrice));

                com.focusPage('#taxPrice', '#quotationSummary').html($taxPrices);
                com.focusPage('#totalPrice', '#quotationSummary').html($totalPrices);

                com.focusPage('#preferPrice', '#quotationSummary').html(com.checkNull(quotationPrefer.preferPrice, 0));
                com.focusPage('#managePrefer', '#quotationSummary').html(com.checkNull(quotationPrefer.managePrefer, 0));
                com.focusPage('#advancePrefer', '#quotationSummary').html(com.checkNull(quotationPrefer.advancePrefer, 0));

                com.focusPage('#totalPrice', '#ribbonSubset').html("总额: " + com.checkNull(quotation.totalPrice, 0));
                com.focusPage('#totalPrice', '#workTypeSubset').html(com.checkNull(quotation.totalPrice, 0));

                com.focusPage("#quotationPreferModal").modal("hide");
            });
        });
    },

    initApproval: function(param) {

        var quotation = quotationUtils.quotationDetail.quotation;
        var quotationPrefer = quotationUtils.quotationDetail.quotationPrefer;

        com.focusPage("#submitApproveBtn").on("click", function() {

            if (com.validate("approveModal")) {
                return false;
            }

            var receiverId = com.focusPage("#approveManSel", "#approveModal").find('input:checked').attr('userid');

            if (receiverId == null || receiverId == "") {
                com.showAlert(com.error, "请选择审批人!");
                return false;
            }

            var params = {
                "approval.receiver.userId": receiverId,
                "approval.comment": com.focusPage("#changeReason", "#approveModal").val(),
                "approvalQuotationPrefer.qid": quotation.qid,
                "approvalQuotationPrefer.qpid": quotationPrefer.qpid,
                "approvalQuotationPrefer.ppid": quotationPrefer.presignProduce.ppid,
                "approvalQuotationPrefer.preferPrice": param["quotationPrefer.preferPrice"],
                "approvalQuotationPrefer.managePrefer": param["quotationPrefer.managePrefer"],
                "approvalQuotationPrefer.advancePrefer": param["quotationPrefer.advancePrefer"],
                "approvalQuotationPrefer.taxPrice": param["quotation.taxPrice"],
                "approvalQuotationPrefer.totalPrice": param["quotation.totalPrice"],
            };

            com.post(api.approval.submitApprovalForQuotationPrefer, params, function(res) {

                com.showAlert(com.info, "操作成功");

                com.focusPage("#approveModal").modal("hide");
                com.focusPage("#quotationPreferModal").modal("hide");
            });
        });
    },

    initPresignPrint: function() {

        $("#prinPresignBtn").click(function() {

            var printConf = {
                "type": 0
            };

            var types = com.focusPage('input[name="type"]:checked', '#printPresignModal #types');

            $.each(types, function(i, v) {

                printConf["type"] = parseInt(printConf["type"]) + parseInt($(v).attr('value'));
            });

            params.quotation.protation = {
                "printConf": printConf
            };

            com.popup("打印预签", api.index.protationOutputIndex.url, null, null, true);
        });
    }
}
