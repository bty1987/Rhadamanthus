$(function() {

    var decorationDetail = {
        orderId: null,

        orderType: {},
        typeness: {},

        orderTypeness: params.decoration.typeness,

        protationItems: {
            name: com.focusPage("#protationName", "#decorationAccountContent"),
            quotePrice: com.focusPage("#quotePrice", "#decorationAccountContent"),
            preferPrice: com.focusPage("#preferPrice", "#decorationAccountContent"),
            managePrice: com.focusPage("#protationManagePrice", "#decorationAccountContent"),
            buildArea: com.focusPage("#buildArea", "#decorationAccountContent"),
            totalPrice: com.focusPage("#totalPrice", "#decorationAccountContent"),
            precontractPrice: com.focusPage("#precontractPrice", "#decorationAccountContent"),
        },
        basicsItems: {
            name: com.focusPage("#quotationName", "#decorationAccountContent"),
            foldFrontTotal: com.focusPage("#foldFrontTotal", "#decorationAccountContent"),
            foldFrontFee: com.focusPage("#foldFrontFee", "#decorationAccountContent"),
            managePrice: com.focusPage("#managePrice", "#decorationAccountContent"),
            basdiscount: com.focusPage("#basdiscount", "#decorationAccountContent"),
            disPrice: com.focusPage("#disPrice", "#decorationAccountContent"),
            undisPrice: com.focusPage("#undisPrice", "#decorationAccountContent"),
            taxPrice: com.focusPage("#taxPriceB", "#decorationAccountContent"),
        },
        extensionItems: {
            addFoldFrontTotal: com.focusPage("#addExtensionItemFoldFrontTotal", "#decorationAccountContent"),
            addManagePrice: com.focusPage("#addExtensionItemManagePrice", "#decorationAccountContent"),
            addTotal: com.focusPage("#addExtensionItemTotalPrice", "#decorationAccountContent"),
            minusFoldFrontTotal: com.focusPage("#minusExtensionItemFoldFrontTotal", "#decorationAccountContent"),
            minusManagePrice: com.focusPage("#minusExtensionItemManagePrice", "#decorationAccountContent"),
            minusTotal: com.focusPage("#minusExtensionItemTotalPrice", "#decorationAccountContent"),
        },
        contractItems: {
            signPrice: com.focusPage("#signPrice", "#decorationAccountContent"),
            coupon: com.focusPage("#coupon", "#decorationAccountContent"),
            servicePrice: com.focusPage("#servicePrice", "#decorationAccountContent"),
            servicePaidup: com.focusPage("#servicePaidup", "#decorationAccountContent"),
            signFactPrice: com.focusPage("#signFactPrice", "#decorationAccountContent"),
            mm: com.focusPage("#mm", "#decorationAccountContent")
        },
        materialItems: {
            materialRatio: com.focusPage("#materialRatio", "#decorationAccountContent"),
            materialTotal: com.focusPage("#materialTotal", "#decorationAccountContent"),
            materialCoupon: com.focusPage("#materialCoupon", "#decorationAccountContent"),
            materialFactPrice: com.focusPage("#materialFactPrice", "#decorationAccountContent")
        },
        addReduceItems: {
            addFoldFrontTotal: com.focusPage("#addFoldFrontTotal", "#decorationAccountContent"),
            addManagePrice: com.focusPage("#addManagePrice", "#decorationAccountContent"),
            addMatch: com.focusPage("#addMatch", "#decorationAccountContent"),
            addUncalPrice: com.focusPage("#addUncalPrice", "#decorationAccountContent"),
            addDone: com.focusPage("#addDone", "#decorationAccountContent"),
            addTaxPrice: com.focusPage("#addTaxPrice", "#decorationAccountContent"),
            addTotal: com.focusPage("#addTotal", "#decorationAccountContent"),
            minusFoldFrontTotal: com.focusPage("#minusFoldFrontTotal", "#decorationAccountContent"),
            minusManagePrice: com.focusPage("#minusManagePrice", "#decorationAccountContent"),
            minusMatch: com.focusPage("#minusMatch", "#decorationAccountContent"),
            minusUncalPrice: com.focusPage("#minusUncalPrice", "#decorationAccountContent"),
            minusDone: com.focusPage("#minusDone", "#decorationAccountContent"),
            minusTaxPrice: com.focusPage("#reduceTaxPrice", "#decorationAccountContent"),
            minusTotal: com.focusPage("#reduceTotal", "#decorationAccountContent"),
            asDifference: com.focusPage("#asDifference", "#decorationAccountContent"),
        },
        advanceItems: {
            contractAdvance: com.focusPage("#contractAdvance", "#decorationAccountContent"),
            constructionAdvance: com.focusPage("#constructionAdvance", "#decorationAccountContent"),
            materialAdvance: com.focusPage("#materialAdvance", "#decorationAccountContent"),
            zhenglinAdvance: com.focusPage("#zhenglinAdvance", "#decorationAccountContent")
        },
        accountItems: {
            direct: com.focusPage("#direct", "#decorationAccountContent"),
            beforeTotal: com.focusPage("#beforeTotal", "#decorationAccountContent"),
            management: com.focusPage("#management", "#decorationAccountContent"),
            flowerRatio: com.focusPage("#flowerRatio", "#decorationAccountContent"),
            materialAccount: com.focusPage("#materialAccount", "#decorationAccountContent"),
            accountForehead: com.focusPage("#accountForehead", "#decorationAccountContent"),
            accountServicePrice: com.focusPage("#accountServicePrice", "#decorationAccountContent"),
            balanceSum: com.focusPage("#balanceSum", "#decorationAccountContent"),
            difference: com.focusPage("#difference", "#decorationAccountContent"),
            superRatio: com.focusPage("#superRatio", "#decorationAccountContent"),
            taxPrice: com.focusPage("#taxPriceA", "#decorationAccountContent")
        },
        items: {
            discountName: com.focusPage("#discountName", "#decorationAccountContent"),
            decorationType: com.focusPage("#decorationType", "#decorationAccountContent"),
            accountType: com.focusPage("#accountType", "#decorationAccountContent"),
            calDiscountPrice: com.focusPage("#calDiscountPrice", "#decorationAccountContent"),
            preferences: com.focusPage("#preferences", "#decorationAccountContent"),
            internalCoupon: com.focusPage("#internalCoupon", "#decorationAccountContent"),
            fulldel: com.focusPage("#fulldel", "#decorationAccountContent"),
            cashback: com.focusPage("#cashback", "#decorationAccountContent"),
            matching: com.focusPage("#matching").switchBtn("isOrNotType", "#decorationAccountContent"),
            fueluxWizard: com.focusPage('#fuelux-wizard', "#decorationAccountContent"),
            materialBrand: com.focusPage("#materialBrand", "#decorationAccountContent"),
            tabContent: com.focusPage(".tab-content", "#decorationAccountContent"),
            fanglinMaterialPayment: com.focusPage("#fanglinMaterialPayment", "#decorationAccountContent"),
            salesMaterialPayment: com.focusPage("#salesMaterialPayment", "#decorationAccountContent"),
            otherPaymentType: com.focusPage("#otherPaymentType", "#decorationAccountContent"),

            comment: com.focusPage("#comment", "#decorationAccountContent")
        },
        btns: {
            printBtn: com.focusPage("#printBtn", "#decorationAccountContent").hide(),
            sendBtn: com.focusPage("#sendBtn", "#decorationAccountContent"),
            updateBtn: com.focusPage("#updateBtn", "#decorationAccountContent"),
            submission: com.focusPage("#submission", "#decorationAccountContent"),
            btnBack: com.focusPage('#btnBack', "#decorationAccountContent"),
            calculateBtn: com.focusPage("#calculateBtn", "#decorationAccountContent"),
            noticeQRCodeBtn: com.focusPage("#noticeQRCodeBtn", "#decorationAccountContent"),
            addReduceItemsBtn: com.focusPage("#addReduceItemsBtn", "#decorationAccountContent"),
            addConstructionItemsBtn: com.focusPage("#addConstructionItemsBtn", "#decorationAccountContent"),
            addMaterialItemsBtn: com.focusPage("#addMaterialItemsBtn", "#decorationAccountContent")

        },
        modal: {
            QRcodeModal: com.focusPage("#QRcodeModal")
        }
    };

    var decoration;

    decorationDetail.orderId = params.decoration.orderId;

    var accountBasic = {

        machingType: [],

        daid: "",

        dd: 0,

        undisPrice: 0,
        taxPrice: 0,
        disPrice: 0,
        trafficPrice: 0,
        managePrice: 0,
        taxPrice: 0,
        materialRatio: 0,
        servicePaidup: 0,
        quoManageRate: 0,

        managePredisPrice: 0,
        taxPredisPrice: 0,

        contractPrice: 0,
        couponCut: 0,
        factPrice: 0,
        servicePrice: 0,

        addPredisPrice: 0,
        addPredisManagePrice: 0,
        addManagePrice: 0,
        addCalPrice: 0,
        addUncalPrice: 0,
        addTotalPrice: 0,
        addDisPrice: 0,
        addUndisPrice: 0,
        addPredisTaxPrice: 0,
        addTaxPrice: 0,

        reducePredisPrice: 0,
        reducePredisManagePrice: 0,
        reduceManagePrice: 0,
        reduceCalPrice: 0,
        reduceUncalPrice: 0,
        reduceTotalPrice: 0,
        reduceDisPrice: 0,
        reduceUndisPrice: 0,
        reducePredisTaxPrice: 0,
        reduceTaxPrice: 0,
        asDifference: 0,

        addConstructionPredisPrice: 0,
        addConstructionPredisManagePrice: 0,
        addConstructionManagePrice: 0,
        addConstructionCalPrice: 0,
        addConstructionUncalPrice: 0,
        addConstructionTotalPrice: 0,
        addConstructionDisPrice: 0,
        addConstructionUndisPrice: 0,
        addConstructionPredisTaxPrice: 0,
        addConstructionTaxPrice: 0,

        reduceConstructionPredisPrice: 0,
        reduceConstructionPredisManagePrice: 0,
        reduceConstructionManagePrice: 0,
        reduceConstructionCalPrice: 0,
        reduceConstructionUncalPrice: 0,
        reduceConstructionTotalPrice: 0,
        reduceConstructionDisPrice: 0,
        reduceConstructionUndisPrice: 0,
        reduceConstructionPredisTaxPrice: 0,
        reduceConstructionTaxPrice: 0,
        constructionAsDifference: 0,

        addMaterialPredisPrice: 0,
        addMaterialPredisManagePrice: 0,
        addMaterialManagePrice: 0,
        addMaterialCalPrice: 0,
        addMaterialUncalPrice: 0,
        addMaterialTotalPrice: 0,
        addMaterialDisPrice: 0,
        addMaterialUndisPrice: 0,
        addMaterialPredisTaxPrice: 0,
        addMaterialTaxPrice: 0,

        reduceMaterialPredisPrice: 0,
        reduceMaterialPredisManagePrice: 0,
        reduceMaterialManagePrice: 0,
        reduceMaterialCalPrice: 0,
        reduceMaterialUncalPrice: 0,
        reduceMaterialTotalPrice: 0,
        reduceMaterialDisPrice: 0,
        reduceMaterialUndisPrice: 0,
        reduceMaterialPredisTaxPrice: 0,
        reduceMaterialTaxPrice: 0,
        materialAsDifference: 0,

        accountForehead: 0,
        balanceSum: 0,
        difference: 0,
        superRatio: 0,

        name: "",
        discount: 0,
        taxRate: 0,// 税金比例(配比)
        taxDiscount: 0,// 税金折扣(是否打折)
        base: 0,
        material: 0,
        service: 0,
        discount: 0,

        cal: false,

        isPrint: false
    };

    $.each(params.decoration.viewNode, function(i, v) {

        v.type == "account" && v.opt != null && $.each(v.opt.btn, function(j, x) {

            switch (x) {
                case "accountPrint":
                    decorationDetail.btns.printBtn.show();
                    break;
                case "btnAccountPrint":
                    accountBasic.isPrint = true;
                    break;
            }
        });
    });

    decorationDetail.btns.btnBack.on("click", function() {

        com.switchPage(params.historyPage);
    });

    decorationDetail.accountItems.materialAccount.blur(function() {

        accountBasic.materialAccount = $(this).val();
    });

    initTab();
    decorationUtils.init();
    var material = decorationUtils.initMaterial(decorationDetail);

    initWizard(decorationDetail.discount, decorationDetail);

    setTimeout(function() {

        quotationUtils.loadQuotationDetail();
    }, 500);

    // 初始向导
    function initWizard(discount, decorationDetail) {

        decorationDetail.items.fueluxWizard.ace_wizard({
            "status": true
        }).on('change', function(e, info) {

            var curstep = 0;

            info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;
            if (curstep == 1) {
                decorationUtils.initMaterial(decorationDetail);
            } else if (curstep == 2) {

            }
        }).on('finished', function(e) {

            com.switchPage(params.historyPage);
        }).on('stepclick', function(e, info) {

            if (info.step == 1) {
                decorationUtils.initMaterial(decorationDetail);
            } else if (info.step == 2) {

            }
        }).on('next', function(e, info) {

        }).on('previous', function(e, info) {

        });
    }

    function initTab() {

        var dataPage = params.urlLoadParams.depage;
        var fanglinMaterial = $('<div></div>').addClass('tab-pane').attr('id', 'fanglinMaterialPayments' + dataPage).attr('style', 'margin-left: -12px;');
        var salesMaterial = $('<div></div>').addClass('tab-pane in active').attr('id', 'salesMaterialPayments' + dataPage).attr('style', 'margin-left: -12px;');
        var materialBrand = $('<div></div>').addClass('widget-body-inner').attr('id', 'materialPaymentBrands' + dataPage);

        decorationDetail.items.materialBrand.append(materialBrand);
        decorationDetail.items.tabContent.append(fanglinMaterial).append(salesMaterial);

        decorationDetail.items.fanglinMaterialPayment.attr("href", "#fanglinMaterialPayments" + dataPage);
        decorationDetail.items.salesMaterialPayment.attr("href", "#salesMaterialPayments" + dataPage);
    }

    accountBasic.materialTotal = material.total;
    accountBasic.materialCoupon = material.coupon;
    accountBasic.materialFactPrice = utils.accSub(material.total, material.coupon);

    decorationDetail.materialItems.materialTotal.html(accountBasic.materialTotal);
    decorationDetail.materialItems.materialCoupon.html(accountBasic.materialCoupon);
    decorationDetail.materialItems.materialFactPrice.html(accountBasic.materialFactPrice);

    com.post(api.payment.queryAdvancePaymentByOrderId, {
        "advancePayment.decoration.orderId": decorationDetail.orderId
    }, function(res) {

        accountBasic.contractAdvance = res.balanceAdvance;
        accountBasic.materialAdvance = res.materialAdvance;

        decorationDetail.advanceItems.contractAdvance.text(res.balanceAdvance);
        decorationDetail.advanceItems.constructionAdvance.text(res.projectAdvance);
        decorationDetail.advanceItems.materialAdvance.text(res.materialAdvance);
        decorationDetail.advanceItems.zhenglinAdvance.text(res.zaterialAdvance);
    });

    com.post(api.quotation.queryProtationForDefaultByOrderId, {
        "protation.orderId": decorationDetail.orderId
    }, function(res) {

        protation = res.protation;

        if (protation.name != null) {
            decorationDetail.protationItems.name.html("预签(" + protation.name + ")");
        }

        decorationDetail.protationItems.quotePrice.html(com.checkNull(protation.quotePrice, 0));
        decorationDetail.protationItems.preferPrice.html(com.checkNull(protation.preferPrice, 0));
        decorationDetail.protationItems.managePrice.html(com.checkNull(protation.managePrice, 0));
        decorationDetail.protationItems.totalPrice.html(com.checkNull(protation.totalPrice, 0));

    }, null, false);

    com.post(api.quotation.queryQuotationForDefaultByOrderId, {
        "quotation.orderId": decorationDetail.orderId,
    }, function(res) {

        var quotation = res.quotation;

        accountBasic.undisPrice = quotation.undisPrice;
        accountBasic.disPrice = quotation.disPrice;
        accountBasic.trafficPrice = quotation.trafficPrice;
        accountBasic.managePrice = quotation.managePrice;
        accountBasic.taxPrice = quotation.taxPrice;
        accountBasic.taxRate = quotation.taxRate;
        accountBasic.taxDiscount = quotation.taxDiscount;
        accountBasic.discount = quotation.discount;
        accountBasic.quoManageRate = quotation.manageRate;

        accountBasic.foldFrontTotal = Math.round(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.managePrice + accountBasic.taxPrice);
        accountBasic.foldFrontFee = Math.round(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice);

        if (quotation.version.name != null) {
            decorationDetail.basicsItems.name.html("报价(" + quotation.version.name + ")");
        }

        decorationDetail.basicsItems.foldFrontTotal.html(accountBasic.foldFrontTotal);
        decorationDetail.basicsItems.foldFrontFee.html(accountBasic.foldFrontFee);

        decorationDetail.basicsItems.disPrice.html(accountBasic.disPrice);
        decorationDetail.basicsItems.undisPrice.html(accountBasic.undisPrice);

        var _managePrice = quotation.managePrice * (quotation.manageDiscount == 1 ? quotation.discount / 10 : 1);
        var _taxPrice = quotation.taxPrice;

        if (quotation.taxDiscount == 1) {
            _taxPrice = quotation.taxPrice * (quotation.manageDiscount == 1 ? quotation.discount / 10 : 1);
        }

        accountBasic.managePredisPrice = utils.changeThrDecimal(_managePrice);
        accountBasic.taxPredisPrice = utils.changeThrDecimal(_taxPrice);

        decorationDetail.basicsItems.managePrice.html(accountBasic.managePredisPrice);
        decorationDetail.basicsItems.taxPrice.html(accountBasic.taxPredisPrice);

        decorationDetail.contractItems.mm.html(utils.changeThrDecimal(decorationDetail.materialItems.materialRatio.text() / decorationDetail.basicsItems.foldFrontTotal.text()));
    }, null, false);

    com.post(api.quotation.queryExtensionByOrderId, {
        "extension.orderId": decorationDetail.orderId,
    }, function(res) {

        var extensions = res.extensions;

        var $addFoldFrontTotal = 0, $minusFoldFrontTotal = 0, $addManagePrice = 0, $minusManagePrice = 0, $addTotal = 0, $minusTotal = 0;

        if (extensions != null && extensions.length != 0) {

            for ( var i = 0; i < extensions.length; i++) {

                var extension = extensions[i];
                var extensionItems = extension.extensionItems;

                if (extensionItems == null || extensionItems.length == 0)
                    continue;

                for ( var j = 0; j < extensionItems.length; j++) {

                    var extensionItem = extensionItems[j];

                    var _unitPrice = parseFloat(extensionItem.unitPrice);
                    var _num = parseFloat(extensionItem.num);
                    var _discount = parseInt(extensionItem.discount);
                    var _total = utils.accMul(_unitPrice, _num);

                    if ([0, 1, 5].indexOf(extensionItem.type) != -1) {
                        $addFoldFrontTotal = utils.accAdd($addFoldFrontTotal, _discount == constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT ? _total : 0);
                        $addManagePrice = utils.accAdd($addManagePrice, utils.accMul(_total, accountBasic.quoManageRate));
                        $addTotal = utils.accAdd($addTotal, utils.accMul(_discount == constant.quotation().extensionItem.DISCOUMNT_DISCOUMNT_INT ? utils.accDiv(accountBasic.discount, 10) : 1, _total));

                    } else if ([2, 3, 4].indexOf(extensionItem.type) != -1) {
                        $minusFoldFrontTotal = utils.accAdd($minusFoldFrontTotal, _discount == constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT ? _total : 0);
                        $minusManagePrice = utils.accAdd($minusManagePrice, utils.accMul(_total, accountBasic.quoManageRate));
                        $minusTotal = utils.accAdd($minusTotal, utils.accMul(_discount == constant.quotation().extensionItem.DISCOUMNT_DISCOUMNT_INT ? utils.accDiv(accountBasic.discount, 10) : 1, _total));
                    }
                }

                if (extension.type == 0) {

                    if (extension.manageDiscount == constant.quotation().extension.MANAGEDISCOUNT_DISCOUNT_INT) {
                        $addManagePrice = utils.changeTwoDecimal(utils.accMul(utils.accDiv(accountBasic.discount, 10), $addManagePrice));
                    } else {
                        $addManagePrice = utils.changeTwoDecimal($addManagePrice);
                    }

                    if (extension.managePrice != 0 && accountBasic.quoManageRate != 0) {
                        $addTotal = utils.changeThrDecimal(utils.accAdd($addTotal, $addManagePrice));
                    } else {
                        $addTotal = utils.changeThrDecimal($addTotal);
                        $addManagePrice = 0;
                    }

                } else if (extension.type == 1) {

                    if (extension.manageDiscount == constant.quotation().extension.MANAGEDISCOUNT_DISCOUNT_INT) {
                        $minusManagePrice = utils.changeTwoDecimal(utils.accMul(utils.accDiv(accountBasic.discount, 10), $minusManagePrice));
                    } else {
                        $minusManagePrice = utils.changeTwoDecimal($minusManagePrice);
                    }

                    if (extension.managePrice != 0 && accountBasic.quoManageRate != 0) {
                        $minusTotal = utils.changeThrDecimal(utils.accAdd($minusTotal, $minusManagePrice));
                    } else {
                        $minusTotal = utils.changeThrDecimal($minusTotal);
                        $minusManagePrice = 0;
                    }
                }
            }
        }

        decorationDetail.extensionItems.addFoldFrontTotal.html(com.checkNull($addFoldFrontTotal, 0));
        decorationDetail.extensionItems.addManagePrice.html(com.checkNull($addManagePrice, 0));
        decorationDetail.extensionItems.addTotal.html(com.checkNull($addTotal, 0));
        decorationDetail.extensionItems.minusFoldFrontTotal.html(com.checkNull($minusFoldFrontTotal, 0));
        decorationDetail.extensionItems.minusManagePrice.html(com.checkNull($minusManagePrice, 0));
        decorationDetail.extensionItems.minusTotal.html(com.checkNull($minusTotal, 0));
    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": decorationDetail.orderId
    }, function(res) {

        decoration = res.decoration;

        accountBasic.dd = decoration.discount;
        accountBasic.contracePrice = decoration.orderTotalPrice;
        accountBasic.couponCut = decoration.couponCut;
        accountBasic.factPrice = decoration.factPrice;

        accountBasic.signPrice = com.checkNull(Math.round(accountBasic.contracePrice), 0);
        accountBasic.coupon = com.checkNull(Math.round(accountBasic.couponCut), 0);
        accountBasic.signFactPrice = com.checkNull(Math.round(accountBasic.factPrice), 0);
        accountBasic.basdiscount = com.checkNull(accountBasic.dd, 0);

        decorationDetail.contractItems.signPrice.html(accountBasic.signPrice);
        decorationDetail.contractItems.coupon.html(accountBasic.coupon);
        decorationDetail.contractItems.signFactPrice.html(accountBasic.signFactPrice);
        decorationDetail.basicsItems.basdiscount.html(accountBasic.basdiscount);

        decorationDetail.protationItems.buildArea.html(com.checkNull(decoration.house.buildArea, 0));
        decorationDetail.protationItems.precontractPrice.html(com.checkNull(decoration.precontractPrice, 0));

    }, null, false);

    com.post(api.decoration.queryDecorationHolonomy, {
        "decorationHolonomy.decoration.orderId": decorationDetail.orderId
    }, function(res) {

        var decorationHolonomy = res.decorationHolonomy;

        accountBasic.servicePrice = decorationHolonomy.servicePrice;
        accountBasic.materialRatio = decorationHolonomy.materialPrice;
        accountBasic.servicePaidup = decorationHolonomy.servicePaidup;
        accountBasic.taxDiscount = decorationHolonomy.taxDiscount;

        accountBasic.servicePrice = com.checkNull(Math.round(accountBasic.servicePrice), 0);
        accountBasic.materialRatio = com.checkNull(Math.round(accountBasic.materialRatio), 0);
        accountBasic.servicePaidup = com.checkNull(Math.round(accountBasic.servicePaidup), 0);

        decorationDetail.contractItems.servicePrice.html(accountBasic.servicePrice);
        decorationDetail.materialItems.materialRatio.html(accountBasic.materialRatio);
        decorationDetail.contractItems.servicePaidup.html(accountBasic.servicePaidup);

    }, null, false);

    com.post(api.addReduce.queryAddReduceByOrderId, {
        "addReduce.orderId": decorationDetail.orderId
    }, function(res) {

        var addReduces = res.addReduces;

        $.each(addReduces, function(i, v) {

            if ([0].indexOf(v.paytype) == -1) // 付款类型验证
                return true;

            if ([2, 3].indexOf(v.status) == -1) // 状态验证
                return true;

            if ([3].indexOf(v.schedule) == -1) // 工程状态验证
                return true;

            if (v.type == 0) { // 增项

                accountBasic.addPredisPrice = utils.accAdd(accountBasic.addPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                accountBasic.addPredisManagePrice = utils.accAdd(accountBasic.addPredisManagePrice, v.managePrice);
                accountBasic.addManagePrice = utils.accAdd(accountBasic.addManagePrice, v.manageDiscount == 1 ? utils.accMul(v.managePrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.managePrice);// 增项管理费
                accountBasic.addCalPrice = utils.accAdd(accountBasic.addCalPrice, v.calPrice);
                accountBasic.addUncalPrice = utils.accAdd(accountBasic.addUncalPrice, v.uncalPrice);
                accountBasic.addTotalPrice = utils.accAdd(accountBasic.addTotalPrice, v.total);
                accountBasic.addDisPrice = utils.accAdd(accountBasic.addDisPrice, v.disPrice);
                accountBasic.addUndisPrice = utils.accAdd(accountBasic.addUndisPrice, v.undisPrice);
                accountBasic.addPredisTaxPrice = utils.accAdd(accountBasic.addPredisTaxPrice, v.taxPrice);
                accountBasic.addTaxPrice = utils.accAdd(accountBasic.addTaxPrice, v.taxDiscount == 1 ? v.manageDiscount == 1 ? utils.accMul(v.taxPrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.taxPrice : v.taxDiscount == 2 ? v.taxPrice : 0);// 增项税金

                accountBasic.asDifference = utils.accAdd(accountBasic.asDifference, accountBasic.addDisPrice * (accountBasic.dd / 10) + accountBasic.addUndisPrice + Math.round(accountBasic.addManagePrice) - Math.round(accountBasic.addTotalPrice));

                if (v.atttype == 0) {
                    accountBasic.addConstructionPredisPrice = utils.accAdd(accountBasic.addConstructionPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                    accountBasic.addConstructionPredisManagePrice = utils.accAdd(accountBasic.addConstructionPredisManagePrice, v.managePrice);
                    accountBasic.addConstructionManagePrice = utils.accAdd(accountBasic.addConstructionManagePrice, v.manageDiscount == 1 ? utils.accMul(v.managePrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.managePrice);// 增项管理费
                    accountBasic.addConstructionCalPrice = utils.accAdd(accountBasic.addConstructionCalPrice, v.calPrice);
                    accountBasic.addConstructionUncalPrice = utils.accAdd(accountBasic.addConstructionUncalPrice, v.uncalPrice);
                    accountBasic.addConstructionTotalPrice = utils.accAdd(accountBasic.addConstructionTotalPrice, v.total);
                    accountBasic.addConstructionDisPrice = utils.accAdd(accountBasic.addConstructionDisPrice, v.disPrice);
                    accountBasic.addConstructionUndisPrice = utils.accAdd(accountBasic.addConstructionUndisPrice, v.undisPrice);
                    accountBasic.addConstructionPredisTaxPrice = utils.accAdd(accountBasic.addConstructionPredisTaxPrice, v.taxPrice);
                    accountBasic.addConstructionTaxPrice = utils.accAdd(accountBasic.addConstructionTaxPrice, v.taxDiscount == 1 ? v.manageDiscount == 1 ? utils.accMul(v.taxPrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.taxPrice : v.taxDiscount == 2 ? v.taxPrice : 0);// 增项税金

                    accountBasic.constructionAsDifference = utils.accAdd(accountBasic.constructionAsDifference, accountBasic.addConstructionDisPrice * (accountBasic.dd / 10) + accountBasic.addConstructionUndisPrice + Math.round(accountBasic.addConstructionManagePrice) - Math.round(accountBasic.addConstructionTotalPrice));

                } else if (v.atttype == 1) {
                    accountBasic.addMaterialPredisPrice = utils.accAdd(accountBasic.addMaterialPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                    accountBasic.addMaterialPredisManagePrice = utils.accAdd(accountBasic.addMaterialPredisManagePrice, v.managePrice);
                    accountBasic.addMaterialManagePrice = utils.accAdd(accountBasic.addMaterialManagePrice, v.manageDiscount == 1 ? utils.accMul(v.managePrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.managePrice);// 增项管理费
                    accountBasic.addMaterialCalPrice = utils.accAdd(accountBasic.addMaterialCalPrice, v.calPrice);
                    accountBasic.addMaterialUncalPrice = utils.accAdd(accountBasic.addMaterialUncalPrice, v.uncalPrice);
                    accountBasic.addMaterialTotalPrice = utils.accAdd(accountBasic.addMaterialTotalPrice, v.total);
                    accountBasic.addMaterialDisPrice = utils.accAdd(accountBasic.addMaterialDisPrice, v.disPrice);
                    accountBasic.addMaterialUndisPrice = utils.accAdd(accountBasic.addMaterialUndisPrice, v.undisPrice);
                    accountBasic.addMaterialPredisTaxPrice = utils.accAdd(accountBasic.addMaterialPredisTaxPrice, v.taxPrice);
                    accountBasic.addMaterialTaxPrice = utils.accAdd(accountBasic.addMaterialTaxPrice, v.taxDiscount == 1 ? v.manageDiscount == 1 ? utils.accMul(v.taxPrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.taxPrice : v.taxDiscount == 2 ? v.taxPrice : 0);// 增项税金

                    accountBasic.materialAsDifference = utils.accAdd(accountBasic.materialAsDifference, accountBasic.addMaterialDisPrice * (accountBasic.dd / 10) + accountBasic.addMaterialUndisPrice + Math.round(accountBasic.addMaterialManagePrice) - Math.round(accountBasic.addMaterialTotalPrice));

                }

            } else if (v.type == 1) { // 减项

                accountBasic.reducePredisPrice = utils.accAdd(accountBasic.reducePredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                accountBasic.reducePredisManagePrice = utils.accAdd(accountBasic.reducePredisManagePrice, v.managePrice);
                accountBasic.reduceManagePrice = utils.accAdd(accountBasic.reduceManagePrice, v.manageDiscount == 1 ? utils.accMul(v.managePrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.managePrice);// 减项管理费
                accountBasic.reduceCalPrice = utils.accAdd(accountBasic.reduceCalPrice, v.calPrice);
                accountBasic.reduceUncalPrice = utils.accAdd(accountBasic.reduceUncalPrice, v.uncalPrice);
                accountBasic.reduceTotalPrice = utils.accAdd(accountBasic.reduceTotalPrice, v.total);
                accountBasic.reduceDisPrice = utils.accAdd(accountBasic.reduceDisPrice, v.disPrice);
                accountBasic.reduceUndisPrice = utils.accAdd(accountBasic.reduceUndisPrice, v.undisPrice);
                accountBasic.reducePredisTaxPrice = utils.accAdd(accountBasic.reducePredisTaxPrice, v.taxPrice);
                accountBasic.reduceTaxPrice = utils.accAdd(accountBasic.reduceTaxPrice, v.taxDiscount == 1 ? v.manageDiscount == 1 ? utils.accMul(v.taxPrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.taxPrice : v.taxDiscount == 2 ? v.taxPrice : 0);// 减项税金

                accountBasic.asDifference = utils.accAdd(accountBasic.asDifference, accountBasic.reduceDisPrice * (accountBasic.dd / 10) + accountBasic.reduceUndisPrice + Math.round(accountBasic.reduceManagePrice) - Math.round(accountBasic.reduceTotalPrice));

                if (v.atttype == 0) {
                    accountBasic.reduceConstructionPredisPrice = utils.accAdd(accountBasic.reduceConstructionPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                    accountBasic.reduceConstructionPredisManagePrice = utils.accAdd(accountBasic.reduceConstructionPredisManagePrice, v.managePrice);
                    accountBasic.reduceConstructionManagePrice = utils.accAdd(accountBasic.reduceConstructionManagePrice, v.manageDiscount == 1 ? utils.accMul(v.managePrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.managePrice);// 减项管理费
                    accountBasic.reduceConstructionCalPrice = utils.accAdd(accountBasic.reduceConstructionCalPrice, v.calPrice);
                    accountBasic.reduceConstructionUncalPrice = utils.accAdd(accountBasic.reduceConstructionUncalPrice, v.uncalPrice);
                    accountBasic.reduceConstructionTotalPrice = utils.accAdd(accountBasic.reduceConstructionTotalPrice, v.total);
                    accountBasic.reduceConstructionDisPrice = utils.accAdd(accountBasic.reduceConstructionDisPrice, v.disPrice);
                    accountBasic.reduceConstructionUndisPrice = utils.accAdd(accountBasic.reduceConstructionUndisPrice, v.undisPrice);
                    accountBasic.reduceConstructionPredisTaxPrice = utils.accAdd(accountBasic.reduceConstructionPredisTaxPrice, v.taxPrice);
                    accountBasic.reduceConstructionTaxPrice = utils.accAdd(accountBasic.reduceConstructionTaxPrice, v.taxDiscount == 1 ? v.manageDiscount == 1 ? utils.accMul(v.taxPrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.taxPrice : v.taxDiscount == 2 ? v.taxPrice : 0);// 减项税金

                    accountBasic.constructionAsDifference = utils.accAdd(accountBasic.constructionAsDifference, accountBasic.reduceConstructionDisPrice * (accountBasic.dd / 10) + accountBasic.reduceConstructionUndisPrice + Math.round(accountBasic.reduceConstructionManagePrice) - Math.round(accountBasic.reduceConstructionTotalPrice));

                } else if (v.atttype == 1) {
                    accountBasic.reduceMaterialPredisPrice = utils.accAdd(accountBasic.reduceMaterialPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                    accountBasic.reduceMaterialPredisManagePrice = utils.accAdd(accountBasic.reduceMaterialPredisManagePrice, v.managePrice);
                    accountBasic.reduceMaterialManagePrice = utils.accAdd(accountBasic.reduceMaterialManagePrice, v.manageDiscount == 1 ? utils.accMul(v.managePrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.managePrice);// 减项管理费
                    accountBasic.reduceMaterialCalPrice = utils.accAdd(accountBasic.reduceMaterialCalPrice, v.calPrice);
                    accountBasic.reduceMaterialUncalPrice = utils.accAdd(accountBasic.reduceMaterialUncalPrice, v.uncalPrice);
                    accountBasic.reduceMaterialTotalPrice = utils.accAdd(accountBasic.reduceMaterialTotalPrice, v.total);
                    accountBasic.reduceMaterialDisPrice = utils.accAdd(accountBasic.reduceMaterialDisPrice, v.disPrice);
                    accountBasic.reduceMaterialUndisPrice = utils.accAdd(accountBasic.reduceMaterialUndisPrice, v.undisPrice);
                    accountBasic.reduceMaterialPredisTaxPrice = utils.accAdd(accountBasic.reduceMaterialPredisTaxPrice, v.taxPrice);
                    accountBasic.reduceMaterialTaxPrice = utils.accAdd(accountBasic.reduceMaterialTaxPrice, v.taxDiscount == 1 ? v.manageDiscount == 1 ? utils.accMul(v.taxPrice, v.discount == 0 ? utils.accDiv(accountBasic.discount, 10) : utils.accDiv(v.discount, 10)) : v.taxPrice : v.taxDiscount == 2 ? v.taxPrice : 0);// 减项税金

                    accountBasic.materialAsDifference = utils.accAdd(accountBasic.materialAsDifference, accountBasic.reduceMaterialDisPrice * (accountBasic.dd / 10) + accountBasic.reduceMaterialUndisPrice + Math.round(accountBasic.reduceMaterialManagePrice) - Math.round(accountBasic.reduceMaterialTotalPrice));

                }
            }

        });

        addReduceItems(1);

    }, null, false);

    decorationDetail.orderType = constant.decoration().decoration.typeness.keys;

    $.each(constant.decoration().decoration.typeness.datas, function(i, v) {

        decorationDetail.typeness["typeness[" + i + "]"] = v.key;
    });

    com.post(api.data.queryDecorationMatching, decorationDetail.typeness, function(res) {

        $.each(res.decorationMatchings, function(i, v) {

            if ((v['vision'] & 8) != 8)
                return;

            accountBasic.machingType.push(v);
        });

        decorationDetail.items.otherPaymentType.bindData(accountBasic.machingType, "dmid", "name", true);

    }, null, false);

    com.post(api.decoration.queryDecorationAccount, {
        "decorationAccount.orderId": decorationDetail.orderId
    }, function(res) {

        var decorationAccount = res.decorationAccount;

        if (!decorationAccount.daid)
            return false;

        accountBasic.daid = decorationAccount.daid;

        accountBasic.dd = decorationAccount.discount;

        accountBasic.type = decorationAccount.type;
        accountBasic.typeness = decorationAccount.typeness;
        accountBasic.base = decorationAccount.discountBase;
        accountBasic.discount = decorationAccount.discount;
        accountBasic.material = decorationAccount.matching;
        accountBasic.service = decorationAccount.serviceRate;

        accountBasic.cal = (decorationAccount.arcal == 0);

        decorationDetail.items.discountName.val(decorationAccount.name);
        decorationDetail.items.decorationType.val(decorationDetail.orderType[decorationDetail.orderTypeness]);
        decorationDetail.items.accountType.val(decorationDetail.orderType[decorationAccount.typeness]);
        decorationDetail.items.preferences.val(decorationAccount.coupon);
        decorationDetail.items.internalCoupon.val(decorationAccount.internal);
        decorationDetail.items.fulldel.val(decorationAccount.fulldel);
        decorationDetail.items.cashback.val(decorationAccount.cashback);

        decorationDetail.items.comment.val(decorationAccount.comment);

        accountSuper();

        decorationDetail.accountItems.materialAccount.val(decorationAccount.materialPrice);

    }, null, false);

    decorationDetail.btns.calculateBtn.click(function() {

        if (com.validate('controls'))
            return false;

        decorationDetail.btns.updateBtn.removeAttr("disabled");
        decorationDetail.btns.submission.removeAttr("disabled");

        accountBasic.dd = decorationDetail.items.calDiscountPrice.val();
        accountBasic.discount = decorationDetail.items.calDiscountPrice.val();

        if (!decorationDetail.items.calDiscountPrice.val())
            return false;

        accountSuper();
    });

    decorationDetail.items.matching.click(function() {

        accountBasic.cal = decorationDetail.items.matching.prop("checked");
    });

    decorationDetail.items.otherPaymentType.on("change", function() {

        var that = $(this);

        var config = {};

        $.each(accountBasic.machingType, function(i, v) {

            if (that.val() == v.dmid)
                config = v;
        });

        accountBasic.cal = decorationDetail.items.matching.prop("checked");

        accountBasic.taxDiscount = config.taxDiscount;

        $.extend(accountBasic, config);

        config.type == 0 ? decorationDetail.items.calDiscountPrice.removeAttr("readonly").val(com.checkNull(accountBasic.dd, 0)) : decorationDetail.items.calDiscountPrice.attr("readonly", "readonly").val(accountBasic.discount);

        return false;
    });

    decorationDetail.btns.printBtn.click(function() {

        accountBasic.preferences = decorationDetail.items.preferences.val() ? decorationDetail.items.preferences.val() : 0;
        accountBasic.internalCoupon = decorationDetail.items.internalCoupon.val() ? decorationDetail.items.internalCoupon.val() : 0;
        accountBasic.fulldel = decorationDetail.items.fulldel.val() ? decorationDetail.items.fulldel.val() : 0;
        accountBasic.cashback = decorationDetail.items.cashback.val() ? decorationDetail.items.cashback.val() : 0;

        params.decoration.decoration = decoration;
        params.decoration.accountBasic = accountBasic;
        params.decoration.orderTypeness = decorationDetail.orderType;

        com.popup("打印决算信息", api.index.decorationAccountOutputIndex.url, null, null, accountBasic.isPrint);
    });

    decorationDetail.btns.sendBtn.click(function() {

        com.showConfirm("确定要向客户推送决算信息吗?", function() {

            var option = {
                "decorationAccount.orderId": decorationDetail.orderId
            };

            com.post(api.decoration.sendDecorationAccount, option, function(res) {

                com.showAlert(com.info, "操作成功");
            });

        });
    });

    decorationDetail.btns.updateBtn.click(function() {

        com.showConfirm("确定要更新决算信息吗?", function() {

            var option = {
                "decorationAccount.orderId": decorationDetail.orderId,
                "decorationAccount.name": accountBasic.name,
                "decorationAccount.type": accountBasic.type,
                "decorationAccount.typeness": accountBasic.typeness,
                "decorationAccount.arcal": accountBasic.cal ? 0 : 1,
                "decorationAccount.matching": accountBasic.material,
                "decorationAccount.discount": accountBasic.discount,
                "decorationAccount.discountBase": accountBasic.base,
                "decorationAccount.serviceRate": accountBasic.service,
                "decorationAccount.materialPrice": accountBasic.materialAccount,
                "decorationAccount.servicePrice": accountBasic.accountServicePrice,
                "decorationAccount.paidupMatching": accountBasic.flowerRatio,
                "decorationAccount.difference": accountBasic.balanceSum,
                "decorationAccount.coupon": accountBasic.preferences,
                "decorationAccount.internal": accountBasic.internalCoupon,
                "decorationAccount.fulldel": accountBasic.fulldel,
                "decorationAccount.cashback": accountBasic.cashback,

                "decorationAccount.comment": decorationDetail.items.comment.val()
            };

            com.post(api.decoration.updateDecorationAccount, option, function(res) {

                com.showAlert(com.info, "更新保存成功");

                accountBasic.isPrint = true;
            });

        });
    });

    decorationDetail.btns.submission.click(function() {

        if (com.validate('controls'))
            return false;

        com.showConfirm("确定锁定新决算信息吗?", function() {

            com.post(api.decoration.makeDecorationAccount, {
                "decorationAccount.orderId": decorationDetail.orderId,
                "approve": "agree"
            }, function(res) {

                com.showAlert(com.info, "锁定成功");
            });
        });
    });

    decorationDetail.btns.noticeQRCodeBtn.click(function() {

        com.focusPage('#QRcode').html("");

        var daid = accountBasic.daid;

        com.focusPage('#QRcode').qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: " http://fanglin.vip/wx/account?orderId=" + decorationDetail.orderId + "&daid=" + daid

        });

        decorationDetail.modal.QRcodeModal.modal('show');
    });

    decorationDetail.btns.addReduceItemsBtn.click(function() {

        addReduceItems(1);
    });

    decorationDetail.btns.addConstructionItemsBtn.click(function() {

        addReduceItems(2);
    });

    decorationDetail.btns.addMaterialItemsBtn.click(function() {

        addReduceItems(3);
    });

    function addReduceItems(type) {

        if (type == 1) {
            decorationDetail.addReduceItems.addFoldFrontTotal.html(Math.round(accountBasic.addPredisPrice));
            decorationDetail.addReduceItems.addManagePrice.html(Math.round(accountBasic.addManagePrice));
            decorationDetail.addReduceItems.addMatch.html(Math.round(accountBasic.addCalPrice));
            decorationDetail.addReduceItems.addUncalPrice.html(Math.round(accountBasic.addUncalPrice));
            decorationDetail.addReduceItems.addDone.html(Math.round(accountBasic.addTotalPrice));
            decorationDetail.addReduceItems.addTaxPrice.html(Math.round(accountBasic.addTaxPrice));
            decorationDetail.addReduceItems.addTotal.html(Math.round(accountBasic.addTotalPrice));

            decorationDetail.addReduceItems.minusFoldFrontTotal.html(Math.round(accountBasic.reducePredisPrice));
            decorationDetail.addReduceItems.minusManagePrice.html(Math.round(accountBasic.reduceManagePrice));
            decorationDetail.addReduceItems.minusMatch.html(Math.round(accountBasic.reduceCalPrice));
            decorationDetail.addReduceItems.minusUncalPrice.html(Math.round(accountBasic.reduceUncalPrice));
            decorationDetail.addReduceItems.minusDone.html(Math.round(accountBasic.reduceTotalPrice));
            decorationDetail.addReduceItems.minusTaxPrice.html(Math.round(accountBasic.reduceTaxPrice));
            decorationDetail.addReduceItems.minusTotal.html(Math.round(accountBasic.reduceTotalPrice));

            decorationDetail.addReduceItems.asDifference.html(Math.round(accountBasic.asDifference));
        } else if (type == 2) {
            decorationDetail.addReduceItems.addFoldFrontTotal.html(Math.round(accountBasic.addConstructionPredisPrice));
            decorationDetail.addReduceItems.addManagePrice.html(Math.round(accountBasic.addConstructionManagePrice));
            decorationDetail.addReduceItems.addMatch.html(Math.round(accountBasic.addConstructionCalPrice));
            decorationDetail.addReduceItems.addUncalPrice.html(Math.round(accountBasic.addConstructionUncalPrice));
            decorationDetail.addReduceItems.addDone.html(Math.round(accountBasic.addConstructionTotalPrice));
            decorationDetail.addReduceItems.addTaxPrice.html(Math.round(accountBasic.addConstructionTaxPrice));
            decorationDetail.addReduceItems.addTotal.html(Math.round(accountBasic.addConstructionTotalPrice));

            decorationDetail.addReduceItems.minusFoldFrontTotal.html(Math.round(accountBasic.reduceConstructionPredisPrice));
            decorationDetail.addReduceItems.minusManagePrice.html(Math.round(accountBasic.reduceConstructionManagePrice));
            decorationDetail.addReduceItems.minusMatch.html(Math.round(accountBasic.reduceConstructionCalPrice));
            decorationDetail.addReduceItems.minusUncalPrice.html(Math.round(accountBasic.reduceConstructionUncalPrice));
            decorationDetail.addReduceItems.minusDone.html(Math.round(accountBasic.reduceConstructionTotalPrice));
            decorationDetail.addReduceItems.minusTaxPrice.html(Math.round(accountBasic.reduceConstructionTaxPrice));
            decorationDetail.addReduceItems.minusTotal.html(Math.round(accountBasic.reduceConstructionTotalPrice));

            decorationDetail.addReduceItems.asDifference.html(Math.round(accountBasic.constructionAsDifference));
        } else if (type == 3) {
            decorationDetail.addReduceItems.addFoldFrontTotal.html(Math.round(accountBasic.addMaterialPredisPrice));
            decorationDetail.addReduceItems.addManagePrice.html(Math.round(accountBasic.addMaterialManagePrice));
            decorationDetail.addReduceItems.addMatch.html(Math.round(accountBasic.addMaterialCalPrice));
            decorationDetail.addReduceItems.addUncalPrice.html(Math.round(accountBasic.addMaterialUncalPrice));
            decorationDetail.addReduceItems.addDone.html(Math.round(accountBasic.addMaterialTotalPrice));
            decorationDetail.addReduceItems.addTaxPrice.html(Math.round(accountBasic.addMaterialTaxPrice));
            decorationDetail.addReduceItems.addTotal.html(Math.round(accountBasic.addMaterialTotalPrice));

            decorationDetail.addReduceItems.minusFoldFrontTotal.html(Math.round(accountBasic.reduceMaterialPredisPrice));
            decorationDetail.addReduceItems.minusManagePrice.html(Math.round(accountBasic.reduceMaterialManagePrice));
            decorationDetail.addReduceItems.minusMatch.html(Math.round(accountBasic.reduceMaterialCalPrice));
            decorationDetail.addReduceItems.minusUncalPrice.html(Math.round(accountBasic.reduceMaterialUncalPrice));
            decorationDetail.addReduceItems.minusDone.html(Math.round(accountBasic.reduceMaterialTotalPrice));
            decorationDetail.addReduceItems.minusTaxPrice.html(Math.round(accountBasic.reduceMaterialTaxPrice));
            decorationDetail.addReduceItems.minusTotal.html(Math.round(accountBasic.reduceMaterialTotalPrice));

            decorationDetail.addReduceItems.asDifference.html(Math.round(accountBasic.materialAsDifference));
        }
    }

    function accountSuper() {

        // 决算直接费(算配比) = 打折总额 + 不打折总额 + 车运费 + 管理费 + 增项配比总额 - 减项配比总额 + 增项管理费 - 减项管理费
        //
        // 决算直接费(非配比) = 打折总额 + 不打折总额 + 车运费 + 管理费
        //
        // 决算折前总额(算配比) = 打折总额 + 不打折总额 + 车运费 + 增项配比总额 - 减项配比总额
        //
        // 决算折前总额(非配比) = 打折总额 + 不打折总额 + 车运费
        //
        // 决算管理费(算配比) = 管理费 + 增项管理费 - 减项管理费
        //
        // 决算管理费(非配比) = 管理费
        //
        // 决算主材额 = 决算折前总额 * 主材配比

        // 决算合同额(算配比) = (折前直接费 + 增项配比总额 - 减项配比总额 - (折前直接费 + 增项配比总额 - 减项配比总额) % 基数) * 折扣 + (折前直接费 + 增项配比总额 - 减项配比总额) % 基数 + 管理费 + 增项管理费 - 减项管理费
        //
        // 决算合同额(非配比) = (折前直接费 - 折前直接费 % 基数) * 折扣 + 折前直接费 % 基数 + 管理费
        //
        // 决算服务费(算配比) = (折前直接费 + 增项配比总额 - 减项配比总额 + 管理费 + 增项管理费 - 减项管理费) * 主材配比 * 服务费比例
        //
        // 决算服务费(非配比) = (折前直接费 + 管理费) * 主材配比 * 服务费比例
        //
        // 差额(算配比) = 决算合同额 + 决算服务费 - 合同实收 - 已收服务费 - 增项实收 + 减项实收 + 增项非配比总额 - 优惠券 - 满送 - 返现
        //
        // 差额(非配比) = 决算合同额 + 决算服务费 - 合同实收 - 已收服务费 - 优惠券 - 满送 - 返现
        //
        // 金额差 = 实收额 - 决算主材额
        //
        // 超配比 = (实收额 - 决算主材额) / 决算主材额

        var contartval = 0, _ = 0, service = 0, sub = 0, direct = 0, beforeTotal = 0, management = 0, taxment = 0, materialAccount = 0, _managePrice = 0, _taxPrice = 0;

        var flag = accountBasic.cal && accountBasic.type == 2 ? 1 : 0;

        beforeTotal = accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag;

        _managePrice = accountBasic.managePrice * (accountBasic.manageDiscount == 1 ? accountBasic.discount / 10 : 1);

        if (accountBasic.taxDiscount == 1) {
            _taxPrice = accountBasic.taxPrice * (accountBasic.manageDiscount == 1 ? accountBasic.discount / 10 : 1);
        }

        if (accountBasic.taxDiscount == 2) {
            _taxPrice = accountBasic.taxPrice;
        }

        if ([0, 1].indexOf(accountBasic.type) != -1) { // 半包/整装
            contartval = accountBasic.disPrice * accountBasic.dd / 10 + accountBasic.undisPrice + accountBasic.trafficPrice + _managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag + _taxPrice + accountBasic.addTaxPrice * flag - accountBasic.reduceTaxPrice * flag;
        }

        if (accountBasic.type == 2) { // 满减
            contartval = (beforeTotal - (beforeTotal) % accountBasic.base) * (accountBasic.discount / 10) + (beforeTotal) % accountBasic.base + _managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag + _taxPrice + accountBasic.addTaxPrice * flag - accountBasic.reduceTaxPrice * flag;
        }

        service = (beforeTotal + accountBasic.managePrice + accountBasic.addPredisManagePrice * flag - accountBasic.reducePredisManagePrice * flag + accountBasic.taxPrice + accountBasic.addPredisTaxPrice * flag - accountBasic.reducePredisTaxPrice * flag) * accountBasic.material * accountBasic.service;

        direct = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag + accountBasic.managePrice + accountBasic.addPredisManagePrice * flag - accountBasic.reducePredisManagePrice * flag + accountBasic.taxPrice + accountBasic.addPredisTaxPrice * flag - accountBasic.reducePredisTaxPrice * flag;

        management = _managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;

        taxment = Math.round(_taxPrice + accountBasic.addTaxPrice * flag - accountBasic.reduceTaxPrice * flag);

        sub = contartval + service - accountBasic.factPrice - accountBasic.servicePaidup - accountBasic.addTotalPrice * flag + accountBasic.reduceTotalPrice * flag - decorationDetail.items.preferences.val() - decorationDetail.items.internalCoupon.val() - decorationDetail.items.fulldel.val() - decorationDetail.items.cashback.val();

        materialAccount = direct * accountBasic.material;

        accountBasic.direct = Math.round(direct);
        accountBasic.beforeTotal = Math.round(beforeTotal);
        accountBasic.management = Math.round(management);
        accountBasic.taxment = Math.round(taxment);
        accountBasic.flowerRatio = utils.changeThrDecimal(accountBasic.materialTotal / accountBasic.direct);

        accountBasic.materialAccount = Math.round(materialAccount);

        accountBasic.accountForehead = Math.round(contartval);
        accountBasic.accountServicePrice = Math.round(service);
        accountBasic.balanceSum = Math.round(sub);

        accountBasic.difference = Math.round(accountBasic.materialFactPrice - accountBasic.materialAccount);
        accountBasic.superRatio = accountBasic.materialAccount == null || accountBasic.materialAccount == 0 ? 0 : utils.changeThrDecimal(accountBasic.difference / accountBasic.materialAccount);

        accountBasic.preferences = decorationDetail.items.preferences.val() ? decorationDetail.items.preferences.val() : 0;
        accountBasic.internalCoupon = decorationDetail.items.internalCoupon.val() ? decorationDetail.items.internalCoupon.val() : 0;
        accountBasic.fulldel = decorationDetail.items.fulldel.val() ? decorationDetail.items.fulldel.val() : 0;
        accountBasic.cashback = decorationDetail.items.cashback.val() ? decorationDetail.items.cashback.val() : 0;

        decorationDetail.accountItems.accountForehead.html(accountBasic.accountForehead);
        decorationDetail.accountItems.accountServicePrice.html(accountBasic.accountServicePrice);
        decorationDetail.accountItems.balanceSum.html(accountBasic.balanceSum);

        decorationDetail.accountItems.direct.html(accountBasic.direct);
        decorationDetail.accountItems.beforeTotal.html(accountBasic.beforeTotal);
        decorationDetail.accountItems.management.html(accountBasic.management);
        decorationDetail.accountItems.materialAccount.val(accountBasic.materialAccount);

        decorationDetail.accountItems.flowerRatio.html(accountBasic.flowerRatio);
        decorationDetail.accountItems.difference.html(accountBasic.difference);
        decorationDetail.accountItems.superRatio.html(accountBasic.superRatio);
        decorationDetail.accountItems.taxPrice.html(Math.round(taxment));
    }

});