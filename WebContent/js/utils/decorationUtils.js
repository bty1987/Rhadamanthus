var decorationUtils = {

    initMaterial: function(decorationDetail) {
        var dataPage = params.urlLoadParams.depage;
        var $fanglinMaterial = com.focusPage('#fanglinMaterialPayments' + dataPage).html("");
        var $salesMaterialPayment = com.focusPage('#salesMaterialPayments' + dataPage).html("");
        var $salesResult = com.focusPage('#salesResultList' + dataPage).html("");
        var $brand = com.focusPage('#materialPaymentBrands' + dataPage).html("");
        var $purCategory = com.focusPage('#materialPurchasedCategory' + dataPage).html("");
        var $unpCategory = com.focusPage('#materialUnpurchasedCategory' + dataPage).html("");

        var $ulfanglin = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($fanglinMaterial);
        var $ulsales = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesMaterialPayment);
        var $ulsalesResult = null;
        var $ulbrand = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($brand);
        var $purchasedCategory = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($purCategory);
        var $unpurchasedCategory = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($unpCategory);

        var $total = 0;
        var $coupon = 0;
        var $totalSalesAndMaterial = 0;
        var $totalDeposit = 0;

        var $statues = {};
        var $balanceStatuses = {};
        var $depositpayStatus = {};
        var $fullpayStatus = {};

        var materialPayments = null;
        var salesPayments = null;

        com.post(api.ds.sales, {}, function(res) {
            $statues = res.statues.split("key", "value");
            $balanceStatuses = res.balanceStatuses.split("key", "value");
            $depositpayStatus = res.depositpayStatus.split("key", "value");
            $fullpayStatus = res.fullpayStatus.split("key", "value");
        }, null, false);

        com.focusPage("a[name='consumptionDetailsPrint']").click(function() {
            params.decorationOrderId = decorationDetail.decorationOrderId;
            com.popup("主材消费明细表", api.index.decorationSales2print.url, null, null, true);
        });

        var displayFunc = (function() {

            var renderList = function(tableId, listData) {

                var $tableWrap = com.focusPage('#' + tableId).empty();
                $ulsalesResult = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesResult);

                if (listData && listData.length) {
                    $.each(listData, function(i, v) {
                        var $liLine = creatLine(v);

                        $liLine.appendTo($ulsalesResult);
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

                var propertyArr = [["品类:", v.category, "grey"], ["品牌:", v.brand, "grey"], ["定金:", v.depositpay, "blue"], ["补款:", v.fullpay, "blue"], ["总额:", v.total, "blue"], ["当前总额:", v.amount, "blue"], ["定金状态:", $depositpayStatus[v.depositpayStatus], "red"], ["补款状态:", $fullpayStatus[v.fullpayStatus], "red"], ["状态:", $statues[v.status], "red"], ["结算状态:", $balanceStatuses[v.balanceStatus], "red"], ["创建时间:", v.createTime, "green "], ["补款时间:", v.fullpayTime, "green "], ["结算时间:", v.balanceTime, "green "], ["完结时间:", v.finishTime, "green "], ["完结人:", v.finisher.currentName, "blue"]];

                $.each(propertyArr, function(index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $divBtnWrap.append($btnSub).appendTo($h4);
                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

                $btnSub.click(function() {
                    params["sid"] = v.sid;
                    params["dompany"] = "dompany";
                    com.popup4page("#layerPopUp", "/views/sales/salesItem.html", "子项", '', function() {
                        seacher.doSearch();
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

        var seacher = new Searcher();

        seacher.init(null, "condList", api.sales.pageSalesByOrderId, function(data) {
            displayFunc.init('salesResultList' + dataPage + '', data);
            // 分页显示/隐藏
            $("#pagenation").removeClass("hidden");
            $("a[href=#salesResultList" + dataPage + "]").click(function() {
                if (data != null) {
                    $("#pagenation").removeClass("hidden");
                }
            });
            $("a[href=#fanglinMaterialPayments" + dataPage + "]").click(function() {
                $("#pagenation").addClass("hidden");
            });
            $("a[href=#salesMaterialPayments" + dataPage + "]").click(function() {
                $("#pagenation").addClass("hidden");
            });
        }, "pagenation", 'salesResultList' + dataPage + 'PostData', {
            "sales.orderId": decorationDetail.decorationOrderId
        });

        var oearcher = new Searcher();

        oearcher.base(null, null, 'oalesResultList' + dataPage + '', api.sales.queryOalesByOrderId);
        oearcher.param({
            "oales.decoration.orderId": decorationDetail.decorationOrderId
        });
        oearcher.result("oaleses").isPage(true);

        var lineprops = [{
            field: "brand",
            name: "品牌",
            prop: "brand",
            clazz: "grey"
        }, {
            field: "category",
            name: "品类",
            prop: "category",
            clazz: "grey"
        }, {
            field: "total",
            name: "总额",
            prop: "total",
            clazz: "blue"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];

        oearcher.line("no", lineprops, []).render();

        com.post(api.payment.queryMaterialPaymentByOrderId, {
            "materialPayment.material.orderId": decorationDetail.decorationOrderId
        }, function(res) {
            materialPayments = res.materialPayments;
        }, null, false);

        if (materialPayments && materialPayments.length) {
            $.each(materialPayments, function(i, v) {

                if (v.paymentStatus == 0)
                    return true;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.material.no + " " + materialUtils.materialPaymentTypeData[v.paymentType]));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [["品类:", v.category, "grey"], ["品牌:", v.brand, "grey"], ["应收额:", v.referMoney, "grey"], ["实收额:", v.referMoney, "grey"], ["收款时间:", v.collectTime, "grey"], ["状态:", materialUtils.paymentStatusInit(v.paymentStatus), "red"]];

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

                var $materialBrands = com.focusPage("[name='" + v.brand + "']");

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

                    var _value = parseFloat($brandTotal.attr('value'));
                    var _refer = [2, 3, 8].contains(v.paymentType) ? v.referMoney : -v.referMoney;
                    var _total = utils.changeThrDecimal(_value + _refer);
                    var _coupon = [2, 3, 8].contains(v.paymentType) ? v.coupon : -v.coupon;

                    $brandTotal.attr("value", _total);
                    $brandTotal.html(_total);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);

                } else {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix').attr("name", v.brand);
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.brand));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var _refer = [2, 3, 8].contains(v.paymentType) ? v.referMoney : -v.referMoney;
                    var _coupon = [2, 3, 8].contains(v.paymentType) ? v.coupon : -v.coupon;

                    $('<b></b>').html(v.category).addClass("grey").appendTo($('<strong></strong>').html("品类:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').html(v.brand).addClass("grey").appendTo($('<strong></strong>').html("品牌:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').attr("name", "total").attr("value", _refer).html(_refer).addClass("grey").appendTo($('<strong></strong>').html("金额:").appendTo($('<li></li>').appendTo($ulProperty)));

                    $liLine.append($h4).append($ulProperty).appendTo($ulbrand);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                }
            });
        }

        var purCategory = [];
        var unpCategory = [];

        com.post(api.payment.querySalesPaymentByOrderId, {
            "salesPayment.sales.orderId": decorationDetail.decorationOrderId
        }, function(res) {
            salesPayments = res.salesPayments;
        }, null, false);

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

                if (v.status == 0)
                    return true;

                if (purCategory.indexOf(v.sales.category) == -1) {
                    purCategory.push(v.sales.category);
                };

                if (unpCategory.indexOf(v.sales.category) != -1 && unpCategory.splice(unpCategory.indexOf(v.sales.category), 1))
                    ;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.sales.no + " " + materialUtils.materialPaymentTypeData[v.type]));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [["品类:", v.sales.category, "grey"], ["品牌:", v.sales.brand, "grey"], ["应收额:", v.referMoney, "blue"], ["实收额:", v.referMoney, "blue"], ["收款时间:", salesReceipt.collectTime, "green "], ["状态:", materialUtils.paymentStatusInit(v.status), "red"]];

                $.each(propertyArr, function(index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var styleArr = [];

                salesReceipt.cash != null && salesReceipt.cash != "0" ? styleArr.push(["现金:", salesReceipt.cash, "grey"]) : true;
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

                var $salesBrands = com.focusPage("[name='" + v.sales.brand + "']");

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

                    var _value = parseFloat($brandTotal.attr('value'));
                    var _refer = [2, 3, 8].contains(v.type) ? v.referMoney : -v.referMoney;
                    var _total = utils.changeThrDecimal(_value + _refer);
                    var _coupon = [2, 3, 8].contains(v.type) ? salesReceipt.coupon : -salesReceipt.coupon;

                    $brandTotal.attr("value", _total);
                    $brandTotal.html(_total);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                } else {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix').attr("name", v.sales.brand);
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.sales.brand));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var _refer = [2, 3, 8].contains(v.type) ? v.referMoney : -v.referMoney;
                    var _coupon = [2, 3, 8].contains(v.type) ? salesReceipt.coupon : -salesReceipt.coupon;

                    $('<b></b>').html(v.sales.category).addClass("grey").appendTo($('<strong></strong>').html("品类:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').html(v.sales.brand).addClass("grey").appendTo($('<strong></strong>').html("品牌:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').attr("name", "total").attr("value", _refer).html(_refer).addClass("grey").appendTo($('<strong></strong>').html("金额:").appendTo($('<li></li>').appendTo($ulProperty)));

                    $liLine.append($h4).append($ulProperty).appendTo($ulbrand);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                }
            });
        }

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
            noData("oalesResultList" + dataPage);
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

        decorationDetail.materialTotal = $total;

        function noData(div) {
            var $resultList = com.focusPage('#' + div).html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
        }

        function totalData() {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h4 = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("总金额:" + $total));
            var $couponPrice = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("优惠券:" + $coupon));
            var $TotalPrice = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("实收额:" + ($total - $coupon)));
            var $TotalNetReceiptsTotalPrice = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("实收全款额:" + $totalSalesAndMaterial));
            var $TotalDepositPrice = $('<h4></h4>').addClass('oid blue').append($('<b></b>').html("定金总额:" + ($totalDeposit)));

            $liLine.append($h4).append($couponPrice).append($TotalPrice).append($TotalNetReceiptsTotalPrice).append($TotalDepositPrice).appendTo($ulbrand);
        }

        function drawLineCategory(list, div) {
            $.each(list, function(index, value) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix col-md-4');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>')).html(value);
                $liLine.append($h4).appendTo(div);
            });
        }
        return material
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
        var stateSpan = $("<span></span>").addClass("red").attr("id", "state_" + _decorationActivity.daId).text(_decorationActivity.status == 0 ? "初始" : "锁定").appendTo(stateLi);

        var uiPgDiv = $("<div></div>").addClass("ui-pg-div").css("padding-left", "8px").css("padding-bottom", "10px").appendTo(widgetBody);

        com.focusPage("#dactivity_" + _decorationActivity.daId).attr("status", _decorationActivity.status);

        if (uiBtnMethod != null) {
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
    decorationActivityInfo: function(activitys, uiBtnMethod, orderId) {

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
    decorationActivityItemInfo: function(infopack, itempack, uiBtnMethod, orderId, config) {

        com.post(api.decoration.queryDecorationActivityItem, {
            "decoration.orderId": orderId
        }, function(res) {

            var decorationActivityItems = res.decorationActivityItems;

            var couponCut = 0;
            var thingCut = 0;

            itempack.html("");

            for ( var i = 0; i < decorationActivityItems.length; i++) { // 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 补款

                var item = decorationActivityItems[i];

                if (item.type == 0 && [0, 2, 4, 5, 6].indexOf(item.state) != -1 && item.isPrefor == 0) {// 0卷
                    couponCut = utils.accAdd(couponCut, utils.accMul(item.money, item.num));
                } else if (item.type == 1 && [0, 2, 4, 5, 6].indexOf(item.state) != -1 && item.isPrefor == 0) {// 物品
                    thingCut = utils.accAdd(thingCut, utils.accMul(item.money, item.num));
                }

                decorationUtils.addActivityItemForDiv(itempack, item, uiBtnMethod, config);
            }

            infopack.html("");

            var couponCutSpan = $("<div></div>").attr("id", "_couponCut").addClass("col-sm-4").append($("<h4></h4>").html("券优惠:").append($('<strong></strong>').addClass("red").html(couponCut))).appendTo(infopack);
            var thingCutSpan = $("<div></div>").attr("id", "_thingCut").addClass("col-sm-4").append($("<h4></h4>").html("物品优惠:").append($('<strong></strong>').addClass("red").html(thingCut))).appendTo(infopack);
            var detailSpan = $("<div></div>").attr("id", "_detail").addClass("col-sm-4").append($("<h4></h4>").html("优惠总额:").append($('<strong></strong>').addClass("red").html(utils.accAdd(couponCut, thingCut)))).appendTo(infopack);

        });
    },
    addActivityItemForDiv: function(itempack, _activityItem, uiBtnMethod, config) {

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
            "type" : "checkbox",
            "name" : "daiIds",
            "class" : "ace ace-checkbox-2"
        }).val(_activityItem.daiId);
        
        widgetHeader.append($label.append($input).append($span)).append(title);

        var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);

        var nameLi = $("<li></li>").appendTo(ul);
        var typeLi = $("<strong></strong>").text("类型:").appendTo(nameLi);
        var typeSpan = $("<span></span>").attr("id", "type_" + _activityItem.daiId).text(config.types[_activityItem.type]).appendTo(nameLi);
        var $stateTypeLi = $("<li></li>").appendTo(ul);
        var $stateTypeStrong = $("<strong></strong>").text("状态类型:").appendTo($stateTypeLi);
        var $stateTypeSpan = $("<span></span>").addClass("red").attr("id", "stateType_" + _activityItem.daiId).text(config.stateTypes[_activityItem.stateType]).appendTo($stateTypeLi);
        var stateLi = $("<li></li>").appendTo(ul);
        var stateState = $("<strong></strong>").text("状态:").appendTo(stateLi);
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

        if (config.isStatus != null) {
            var isStockLi = $("<li></li>").appendTo(ul);
            var isStockState = $("<strong></strong>").text("是否计入库存:").appendTo(isStockLi);
            var isStockSpan = $("<span></span>").addClass("red").attr("id", "isStock_" + _activityItem.daiId).text(config.isStatus[_activityItem.isStock]).appendTo(isStockLi);
            var isPreforLi = $("<li></li>").appendTo(ul);
            var isPreforState = $("<strong></strong>").text("是否计入业绩:").appendTo(isPreforLi);
            var isPreforSpan = $("<span></span>").addClass("red").attr("id", "isPrefor_" + _activityItem.daiId).text(config.isStatus[_activityItem.isPrefor]).appendTo(isPreforLi);
            var isPaymentLi = $("<li></li>").appendTo(ul);
            var isPaymentState = $("<strong></strong>").text("是否计入金额:").appendTo(isPaymentLi);
            var isPaymentSpan = $("<span></span>").addClass("red").attr("id", "isPayment_" + _activityItem.daiId).text(config.isStatus[_activityItem.isPayment]).appendTo(isPaymentLi);
        }

        if (config.isAffirms != null) {
        	var isAffirmLi = $("<li></li>").appendTo(ul);
            var isAffirmState = $("<strong></strong>").text("是否确认:").appendTo(isAffirmLi);
            var isAffirmSpan = $("<span></span>").addClass("red").attr("id", "isAffirm" + _activityItem.daiId).text(config.isAffirms[_activityItem.isAffirm]).appendTo(isAffirmLi);
        }

        var uiPgDiv = $("<div></div>").addClass("ui-pg-div").css("padding-left", "8px").css("padding-bottom", "10px").appendTo(widgetMain);

        if (uiBtnMethod != null) {
            if (uiBtnMethod == "uiBtnMethod") {
                var abateBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "0px 3px").attr("id", "abate_" + _activityItem.daiId).appendTo(uiPgDiv);

                abateBtn.on("click", function() {

                    com.showConfirm("是否确认失效" + _activityItem.activityItemName + "活动物品?", function() {

                        com.post(api.decoration.abateDecorationActivityItem, {
                            "decorationActivityItem.daiId": _activityItem.daiId
                        }, function(res) {
                            com.showAlert(com.info, "操作成功");

                            decorationUtils.countTatol(res.decorationActivityItem.daiId);

                            com.focusPage("#pricing_" + res.decorationActivityItem.daiId).remove();
                        });
                    });
                });
            } else {
                uiBtnMethod(uiPgDiv, _activityItem);
            }
        }
    },
    initPresignDetail: function(orderId) {// 预签信息
        var presignItemListDiv = $("#presignItemListDiv").html("");
        var protation = null;

        com.post(api.quotation.queryProtationForDefaultByOrderId, {
            "protation.orderId": orderId
        }, function(res) {
            protation = res.protation;
        }, null, false);

        if (protation.pid == null)
            return false;

        params.protationId = protation.pid;

        var protationFunctionAreas = [{
            "pfaid": 1,
            "name": "基础",
            "functionAreaOrder": 1,
            "functionAreaType": 0,
            "type": 0,
            total: 0,
            index: 1,
            "protationFunctionAreaItems": [],
        }, {
            "pfaid": 2,
            "name": "标配",
            "functionAreaOrder": 2,
            "functionAreaType": 0,
            "type": 1,
            total: 0,
            index: 2,
            "protationFunctionAreaItems": [],
        }, {
            "pfaid": 3,
            "name": "个性",
            "functionAreaOrder": 3,
            "functionAreaType": 0,
            "type": 2,
            total: 0,
            index: 3,
            "protationFunctionAreaItems": [],
        }, {
            "pfaid": 4,
            "name": "减项",
            "functionAreaOrder": 4,
            "functionAreaType": 0,
            "type": 3,
            total: 0,
            index: 4,
            "protationFunctionAreaItems": [],
        }];

        com.post(api.quotation.queryProtationItemByPid, {
            "protationItem.pid": protation.pid
        }, function(res) {
            $.each(res.protationItems, function(i, v) {
                var type = (v.type + v.type % 2) / 2;
                protationFunctionAreas[type].protationFunctionAreaItems.push(v);
            });
        }, null, false);

        $.each(protationFunctionAreas, function(i, v) {

            var $domain, $dhead, $dname, $dbody, $dbodyInner, $list;

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            });
            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h4></h4>').append($('<strong></strong>').html(v.name));

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list');

            $dhead.append($dname);
            $dbodyInner.append($list).appendTo($dbody);
            $domain.append($dhead).append($dbody);

            $.each(v.protationFunctionAreaItems, function(j, qv) {

                var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content);
                var _num = qv.num;
                var _unitPrice = qv.price;
                var _total = 0;

                var _typeName = "-";

                if (qv.type == 0) {
                    _typeName = "信息";
                    _total = utils.changeThrDecimal(utils.accMul(_unitPrice, utils.accSub(_num, qv.basicNum)));
                }
                if (qv.type == 1 || qv.type == 2) { // 基础工程
                    _typeName = "基础";
                }
                if (qv.type == 3 || qv.type == 4) { // 个性
                    _typeName = "个性";
                    _total = utils.changeThrDecimal(utils.accMul(_unitPrice, _num));
                }
                if (qv.type == 5 || qv.type == 6) { // 增主材
                    _typeName = "减项";
                    _total = utils.changeThrDecimal(utils.accMul(_unitPrice, _num));
                }

                var _lineSet = [["line", j + 1, ["data-areaType", qv.areaType]], // 编号
                ["formula", qv.num ? qv.num : "0"], // 公式
                ["num", qv.num, ["data-subtype", qv.subtype]], // 数量
                ["name", qv.name, ["data-piid", qv.piid]], // 预签名称
                ["type", _typeName, ["data-type", qv.type]], ["unit", qv.basicNum], // 单位
                ["worktype", qv.workType], // 工种
                ["price unitprice", _unitPrice], // 单价
                ["price discountprice", _unitPrice, ["data-discount", 0]], // 折扣后的价格 将折扣存入
                ["price totalprice-discount", _total], // 根据类型计算(数量*折扣)
                ];

                $.each(_lineSet, function(i, v) {

                    var $cell = $('<div></div>').addClass('cell ' + v[0]);
                    var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);

                    if (v[2]) {
                        $cell.attr(v[2][0], v[2][1]);
                    }

                    $cell.append($cellWrap).appendTo($item);
                });
                $item.appendTo($list);
            });

            $domain.appendTo(presignItemListDiv);
        });

        var $show = params.viewNode[1].opt == null ? [] : params.viewNode[1].opt.show == null ? [] : params.viewNode[1].opt.show;

        if ($show.includes("totalPrice")) {
            var amount = 0;

            com.post(api.decoration.amountDecorationActivity, {
                "decorationActivity.orderId": orderId,
                "decorationActivityItem.daiid": 0
            }, function(res) {
                amount = res.decorationActivity.amount;
            }, null, false);

            var profit = utils.changeThrDecimal(utils.accSub(1.0, utils.accDiv(protation.totalCost, utils.accSub(protation.totalPrice, amount))));

            $domain = $('<div></div>').addClass('widget-box transparent').css({
                "margin-bottom": "20px"
            }).appendTo(presignItemListDiv);
            $dhead = $('<div></div>').addClass('widget-header').appendTo($domain);
            $dname = $('<h4></h4>').append($('<strong></strong>').css('color', '#E2737D').html("总额: " + protation.totalPrice + " 成本: " + protation.totalCost + " 利润: " + profit)).appendTo($dhead);
        }

    },
    decorationSalesActivityItemInfo: function(itempack, orderId, uiBtnMethod, config) {

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

                var uiPgDiv = $("<div></div>").addClass("ui-pg-div").css("padding-left", "8px").css("padding-bottom", "10px").appendTo(widgetBody);

            }

        });

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
            "advancePayment.decoration.orderId": decorationDetail.decorationOrderId
        }, function(res) {
            com.focusPage("#balanceAdvance").text(res.balanceAdvance);
            com.focusPage("#projectAdvance").text(res.projectAdvance);
            com.focusPage("#materialAdvance").text(res.materialAdvance);
            com.focusPage("#zaterialAdvance").text(res.zaterialAdvance);

            materialAdvance = res.materialAdvance;
        }, null, false);

        var decorationPayments = [];
        // 通过装修单号获取装修款项信息
        com.post(api.payment.queryDecorationPaymentByOrderId, {
            "decorationPayment.decoration.orderId": decorationDetail.decorationOrderId
        }, function(res) {
            decorationPayments = res.decorationPayments;
        }, null, false);

        if (decorationPayments && decorationPayments.length) {

            var sortPayments = decorationPayments.sort(function(a, b) {
                return a.sort - b.sort;
            });

            $.each(sortPayments, function(i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
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

                if (isDesign) {
                    if (v.paymentStatus == 2 && v.oneType == 0) {
                        if (v.twoType != 2) {
                            $divBtnWrap.append($refundBtn);
                        }
                    }
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
            "quotation.orderId": decorationDetail.decorationOrderId
        }, function(res) {
            if (res.quotation.qid) {
                var quotation = res.quotation;
                predisPrice = utils.accAdd(predisPrice, utils.accAdd(quotation.undisPrice, utils.accAdd(quotation.disPrice, utils.accAdd(quotation.trafficPrice, quotation.managePrice))));
            }
        }, null, false);

        var materialAmount = 0;
        com.post(api.payment.amountSalesPayment, {
            "salesPayment.sales.orderId": decorationDetail.decorationOrderId
        }, function(res) {
            materialAmount = res.amount;
        }, null, false);

        com.focusPage('#materialAmount').html(materialAmount);
        com.focusPage('#materialRate').html(predisPrice == 0 ? 0 : utils.accMul(utils.changeThrDecimal(utils.accDiv(utils.accAdd(materialAmount, materialAdvance), predisPrice)), 100) + "%");

    },
    initDecorationMidpack: function(orederId) {
        var mainDiv = com.focusPage('#preparePayment').parent();
        com.focusPage('#preparePayment').remove();

        var paymentDiv = $("<div></div>").addClass('row');
        var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("预付款项信息")));
        var paymentBody = $("<div></div>").addClass('widget-body');
        var paymentTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        var inclusiveDiv = $("<div></div>").addClass('row');
        var inclusiveHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("半包-款项信息")));
        var inclusiveBody = $("<div></div>").addClass('widget-body');
        var inclusiveTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        var serviceMoneyBody = $("<div></div>").addClass('widget-body');

        paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "合同预付款", "balanceAdvance", true)).append(this.createDivForHolonomy("col-md-3", "工程预付款", "projectAdvance", true)).append(this.createDivForHolonomy("col-md-3", "主材预付款", "materialAdvance", true)).append(this.createDivForHolonomy("col-md-3", "正林预付款", "zaterialAdvance", false))));
        paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
        paymentDiv.prependTo(mainDiv);

        inclusiveBody.append($("<div></div>").addClass('widget-body-inner').append(inclusiveTable.append(this.createDivForHolonomy("col-md-3", "主材额", "materialPrice", true), this.createDivForHolonomy("col-md-3", "主材实付额", "materialPaidup", true), this.createDivForHolonomy("col-md-3", "服务费", "servicePrice", true), this.createDivForHolonomy("col-md-3", "服务实付费", "servicePaidup", false))));
        serviceMoneyBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
        inclusiveDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(inclusiveHeader, inclusiveBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceMoneyBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(inclusiveDiv);
        $('<div></div>').addClass('hr col-md-12').prependTo(inclusiveDiv);
        inclusiveDiv.appendTo(mainDiv);

        com.post(api.decoration.queryDecorationMidpack, {
            "decorationMidpack.decoration.orderId": orederId
        }, function(res) {

            res = res.decorationMidpack;

            com.focusPage('#materialPrice ').html(com.checkNull(res.materialPrice, 0));
            com.focusPage('#materialPaidup ').html(com.checkNull(res.materialPaidup, 0));
            com.focusPage('#servicePrice').html(com.checkNull(res.servicePrice, 0));
            com.focusPage('#servicePaidup').html(com.checkNull(res.servicePaidup, 0));
        });

    },
    initDecorationInclusive: function(orederId) {
        var mainDiv = com.focusPage('#preparePayment').parent();
        com.focusPage('#preparePayment').remove();

        var paymentDiv = $("<div></div>").addClass('row');
        var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("预付款项信息")));
        var paymentBody = $("<div></div>").addClass('widget-body');
        var paymentTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        var inclusiveDiv = $("<div></div>").addClass('row');
        var inclusiveHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("全包-款项信息")));
        var inclusiveBody = $("<div></div>").addClass('widget-body');
        var inclusiveTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        var serviceMoneyBody = $("<div></div>").addClass('widget-body');

        paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "合同预付款", "balanceAdvance", true)).append(this.createDivForHolonomy("col-md-3", "工程预付款", "projectAdvance", true)).append(this.createDivForHolonomy("col-md-3", "主材预付款", "materialAdvance", true)).append(this.createDivForHolonomy("col-md-3", "正林预付款", "zaterialAdvance", false))));
        paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
        paymentDiv.prependTo(mainDiv);

        inclusiveBody.append($("<div></div>").addClass('widget-body-inner').append(inclusiveTable.append(this.createDivForHolonomy("col-md-2", "合同金额", "contractPrice", true), this.createDivForHolonomy("col-md-2", "工程总额", "projectPrice", true), this.createDivForHolonomy("col-md-2", "工程增项", "cdiff", true), this.createDivForHolonomy("col-md-2", "主材增项", "mdiff", true), this.createDivForHolonomy("col-md-2", "管理费", "managePrice", false), this.createDivForHolonomy("col-md-2", "实收主材额", "materialPaidup", true))));
        serviceMoneyBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
        inclusiveDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(inclusiveHeader, inclusiveBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceMoneyBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(inclusiveDiv);
        $('<div></div>').addClass('hr col-md-12').prependTo(inclusiveDiv);
        inclusiveDiv.appendTo(mainDiv);

        com.post(api.decoration.queryDecorationInclusive, {
            "decorationInclusive.decoration.orderId": orederId
        }, function(res) {

            res = res.decorationInclusive;

            if (res && res.length) {
                com.focusPage('#contractPrice').html(com.checkNull(res.contractPrice, 0));
                com.focusPage('#projectPrice').html(com.checkNull(res.projectPrice, 0));
                com.focusPage('#cdiff').html(com.checkNull(res.cdiff, 0));
                com.focusPage('#mdiff').html(com.checkNull(res.mdiff, 0));
                com.focusPage('#managePrice').html(com.checkNull(res.managePrice, 0));
                com.focusPage('#materialPaidup').html(com.checkNull(res.materialPaidup, 0));
            }
        });

    },
    initDecorationBelong: function(orderId) {

        var $design = com.focusPage("#belongDesignInfo").html('');
        var $salesman = com.focusPage("#belongSalesmanInfo").html('');

        var $designul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($design);
        var $salesmanul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesman);

        var decorationBelongs = null;

        com.post(api.decoration.queryDecorationBelongByOrderId, {
            "decorationBelong.orderId": orderId
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

        com.uploadify("#" + eId, ename, api.common.uploadImg, ('btn ' + btnstyle ? btnstyle : "btn-success"), fileType, {
            'uploadType': 2
        }, 5, function(data) {
            callback(data);
        });

    },
    addDecorationPicture: function(data, type, eId) {

        if (data.errorCode == 0) {

            var options = {
                "decorationPicture.path": data.resUrl,
                "decorationPicture.name": data.strutsUploadsFileName,
                "decorationPicture.content": "",
                "decorationPicture.orderId": params.decorationOrderId,
                "decorationPicture.type": type
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
                }
            });
        } else {
            com.showAlert(com.error, data.errorMsg);
        }
    },
    initDecorationPicture: function(designId, pictureId, cadId, contractId, originalId, agreeId, orderId) {

        var $desgin = com.focusPage("#" + designId).html("");
        var $picture = com.focusPage("#" + pictureId).html("");
        var $contract = com.focusPage("#" + contractId).html("");
        var $cad = com.focusPage("#" + cadId).html("");
        var $original = com.focusPage("#" + originalId).html("");
        var $agree = com.focusPage("#" + agreeId).html("");

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
                }
            }

            com.popup4photos("#OriginalPicture");
            com.popup4photos("#designPictures");
            com.popup4photos("#projectPictures");
            com.popup4photos("#ContractPictures");
            com.popup4photos("#CADProjectPicture");
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

    },
    addPicture: function(e, i) {
        var $li = $('<li></li>').attr("id", "imgLi_" + i.dpId).appendTo(e);
        var $img = $('<img></img>').attr('width', 200).attr('height', 200);
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').append($img).appendTo($li);

        com.showImg($img, i.path, 200, 200, i.name);

        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(i.name).appendTo($nameHolder);
        var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(i.uploadTime).appendTo($timeHolder);

        var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
        var $toolLabel = $('<label></label>').appendTo($tools);
        var $downA = $('<a></a>').addClass("icon-download-alt").appendTo($tools);

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

    },
    addCAD: function(e, i) {

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
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.contract.name).appendTo($infoboxLeft);
        var $infoboxContent = $('<div></div>').addClass('infobox-content').text(i.createTime).appendTo($infoboxLeft);

        $infobox.click(function() {

            com.post(api.decoration.viewDecorationContract, {
                "decorationContract.dcid": i.dcid
            }, function(res) {
                com.popup4frame("合同查看", res.redirect);
            });
        });

    },
    initConstructionScheduleInfo: function() {

        var options = {};
        options["constructionSchedule.orderId"] = params.decorationOrderId;

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
    initDecorationHolonomy: function(orederId) {
        var mainDiv = com.focusPage('#preparePayment').parent();
        com.focusPage('#preparePayment').remove();

        var paymentDiv = $("<div></div>").addClass('row');
        var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("预付款项信息")));
        var paymentBody = $("<div></div>").addClass('widget-body');
        var paymentTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        var holonomyDiv = $("<div></div>").addClass('row');
        var holonomyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("半价/满减款项信息")));
        var holonomyBody = $("<div></div>").addClass('widget-body');
        var holonomyTable = $("<div></div>").addClass('clearfix').css({
            "margin-top": "15px",
            "margin-bottom": "15px"
        });

        var serviceMoneyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("服务款项信息")));
        var serviceMoneyBody = $("<div></div>").addClass('widget-body');

        paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "合同预付款", "balanceAdvance", true)).append(this.createDivForHolonomy("col-md-3", "工程预付款", "projectAdvance", true)).append(this.createDivForHolonomy("col-md-3", "主材预付款", "materialAdvance", true)).append(this.createDivForHolonomy("col-md-3", "正林预付款", "zaterialAdvance", false))));
        paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
        paymentDiv.prependTo(mainDiv);

        holonomyBody.append($("<div></div>").addClass('widget-body-inner').append(holonomyTable.append(this.createDivForHolonomy("col-md-4", "折前总价", "quotationPrice", true), this.createDivForHolonomy("col-md-4", "工程总额", "projectPrice", true), this.createDivForHolonomy("col-md-4", "管理费", "managePrice", false), this.createDivForHolonomy("col-md-4", "主材总额", "materialPrice", true), this.createDivForHolonomy("col-md-4", "实收主材额", "materialPaidup", true), this.createDivForHolonomy("col-md-4", "主材额百分比", "materialPercent", false), this.createDivForHolonomy("col-md-4", "服务费", "servicePrice", true), this.createDivForHolonomy("col-md-4", "实收服务费", "servicePaidup", true), this.createDivForHolonomy("col-md-4", "服务费百分比", "servicePercent", false))));
        serviceMoneyBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
        holonomyDiv.append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(holonomyHeader, holonomyBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceMoneyHeader, serviceMoneyBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(holonomyDiv);
        $('<div></div>').addClass('hr col-md-12').prependTo(holonomyDiv);
        holonomyDiv.appendTo(mainDiv);

        com.post(api.decoration.queryDecorationHolonomy, {
            "decorationHolonomy.decoration.orderId": orederId
        }, function(res) {

            res = res.decorationHolonomy;

            com.focusPage('#projectPrice').html(com.checkNull(res.projectPrice + res.managePrice), 0);
            com.focusPage('#managePrice').html(com.checkNull(res.managePrice), 0);
            com.focusPage('#materialPrice').html(com.checkNull(res.materialPrice), 0);
            com.focusPage('#servicePrice').html(com.checkNull(res.servicePrice), 0);
            com.focusPage('#materialPaidup').html(com.checkNull(res.materialPaidup), 0);
            com.focusPage('#servicePaidup').html(com.checkNull(res.servicePaidup), 0);

            if (res.managePrice == null) {
                com.focusPage('#quotationPrice').html(0);
            } else {
                com.focusPage('#quotationPrice').html(utils.changeTwoDecimal(res.projectBase));
            }

            if (res.materialPrice == null) {
                com.focusPage('#materialPercent').html(0);
            } else {
                var materialPercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(com.checkNull(res.materialPaidup, 0), res.materialPrice)), 100);
                com.focusPage('#materialPercent').html(com.checkNull(materialPercent > 100 ? 100 : materialPercent, 0) + "%");
            }

            if (res.servicePrice == null) {
                com.focusPage('#servicePercent').html(0);
            } else {
                var servicePercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(com.checkNull(res.servicePaidup, 0), res.servicePrice)), 100);
                com.focusPage('#servicePercent').html(com.checkNull(servicePercent > 100 ? 100 : servicePercent, 0) + "%");
            }

        });

        com.post(api.payment.queryServicePaymentByOrderId, {
            "servicePayment.decoration.orderId": orederId
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
                com.focusPage('#servicePrice_account').html(com.checkNull(res.servicePrice), 0);
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

                var propertyArr = [["装修单号:", v.orderId, "grey"], ["详述:", v.detail, "grey"], ["操作人:", v.operater.currentName, "grey"], ["操作时间:", v.operateTime, "green"], ["状态:", v.status == 0 ? '初始' : '完成', "red"], ["备注:", v.comment, "grey"]];

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

                if (v.status == 0) {
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
    initAddreduce: function(orderId, type) {

        var $resList = com.focusPage('#resLists').html('');
        var $table = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').css('padding-top', '30px');
        var $div = $('<div></div>').addClass('col-md-11');
        var $ai = $('<button id="print"><i class="icon-print bigger-120"></i>打印</button>').addClass('btn btn-info');

        $resList.append($div).append($ai).append($table);
        var discount = null;
        var qid = null;
        var versionid = null;

        com.post(api.addReduce.queryAddReduceByOrderId, {
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
                        "0": "普通",
                        "1": "系统",
                        "2": "自定义",
                        "3": "报价中",
                        "4": "增项"
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

                    com.post(api.addReduce.queryAddReduceItemByAddReduceId, {
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
                    var url = api.index.addReduceOutputIndex.url;
                    var _addReduceIds = [];
                    if (!$inputs.length)
                        return;
                    $.each($inputs, function(i, v) {
                        _addReduceIds.push(parseInt($(v).val()));
                    });
                    params.addReduceIds = _addReduceIds;
                    com.popup("增减项打印", url, null, null, true);
                });

            } else {
                $resList.html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resList);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                $mesg.append($('<span></span>').text('无可用数据提供'));
            }
        });
    },
    createDivForHolonomy: function(inclass, string, id, isleft) {
        return $("<div></div>").addClass(inclass).css(isleft ? {
            "border-left": "solid 1px #e3e3e3",
        } : {
            "border-left": "solid 1px #e3e3e3",
            "border-right": "solid 1px #e3e3e3",
        }).append($("<h5></h5>").addClass('bigger-110 center').html(string)).append($("<h2></h2>").addClass('oid bigger  center').append($('<b></b>').addClass('blue').attr('id', id).html(0)));
    },
    init: function() {

        com.post(api.common.queryReceiptType, {}, function(res) {

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
        }).html("状态类型 :" + $stateTypeText).appendTo($span);
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

        com.focusPage("#pricing_" + daiId + " .module_activity_border").data("total", 0);
        var coupon = 0;
        var thing = 0;

        $.each(com.focusPage(".module_activity_border"), function(i, e) {
            var _ = $(e);
            if (_.data().type == 0) {
                coupon += _.data().total;
            } else if (_.data().type == 1) {
                thing += _.data().total
            }

        });
        com.focusPage("#_couponCut strong").html(coupon);
        com.focusPage("#_thingCut strong").html(thing);
        com.focusPage("#_detail strong").html(utils.accAdd(coupon, thing));

    }
};