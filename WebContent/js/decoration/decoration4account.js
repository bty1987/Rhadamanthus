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
            foldFrontTotalPrice: com.focusPage("#foldFrontTotalPrice", "#decorationAccountContent"),
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
            signFactDone: com.focusPage("#signFactDone", "#decorationAccountContent"),
            signFactOwing: com.focusPage("#signFactOwing", "#decorationAccountContent"),
            signFactPrice: com.focusPage("#signFactPrice", "#decorationAccountContent"),
            mm: com.focusPage("#mm", "#decorationAccountContent")
        },
        materialItems: {
            materialRatio: com.focusPage("#materialRatio", "#decorationAccountContent"),
            materialTotal: com.focusPage("#materialTotal", "#decorationAccountContent"),
            materialCoupon: com.focusPage("#materialCoupon", "#decorationAccountContent"),
            materialFactPrice: com.focusPage("#materialFactPrice", "#decorationAccountContent")
        },
        oalesItems: {
            oalesTotal: com.focusPage("#oalesTotal", "#decorationAccountContent"),
            oalesMaterialTotal: com.focusPage("#oalesMaterialTotal", "#decorationAccountContent"),
            oalesScaleTotal: com.focusPage("#oalesScaleTotal", "#decorationAccountContent"),
        },
        addReduceItems: {
            addFoldFrontTotal: com.focusPage("#addFoldFrontTotal", "#decorationAccountContent"),
            addManagePrice: com.focusPage("#addManagePrice", "#decorationAccountContent"),
            addMatch: com.focusPage("#addMatch", "#decorationAccountContent"),
            addUncalPrice: com.focusPage("#addUncalPrice", "#decorationAccountContent"),
            addDone: com.focusPage("#addDone", "#decorationAccountContent"),
            addOwing: com.focusPage("#addOwing", "#decorationAccountContent"),
            addTaxPrice: com.focusPage("#addTaxPrice", "#decorationAccountContent"),
            addTotal: com.focusPage("#addTotal", "#decorationAccountContent"),
            minusFoldFrontTotal: com.focusPage("#minusFoldFrontTotal", "#decorationAccountContent"),
            minusManagePrice: com.focusPage("#minusManagePrice", "#decorationAccountContent"),
            minusMatch: com.focusPage("#minusMatch", "#decorationAccountContent"),
            minusUncalPrice: com.focusPage("#minusUncalPrice", "#decorationAccountContent"),
            minusDone: com.focusPage("#minusDone", "#decorationAccountContent"),
            minusOwing: com.focusPage("#minusOwing", "#decorationAccountContent"),
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
            flowerOalesRatio: com.focusPage("#flowerOalesRatio", "#decorationAccountContent"),
            difference: com.focusPage("#difference", "#decorationAccountContent"),
            superRatio: com.focusPage("#superRatio", "#decorationAccountContent"),
            taxPrice: com.focusPage("#taxPriceA", "#decorationAccountContent"),
            balanceSum: com.focusPage("#balanceSum", "#decorationAccountContent"),
            directC: com.focusPage("#directC", "#decorationAccountContent"),
            fullPayment: com.focusPage("#fullPayment", "#decorationAccountContent"),
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
            accountCalculatorBtn: com.focusPage("#accountCalculatorBtn", "#decorationAccountContent"),
            calculateBtn: com.focusPage("#calculateBtn", "#decorationAccountContent"),
            noticeQRCodeBtn: com.focusPage("#noticeQRCodeBtn", "#decorationAccountContent"),
            addReduceItemsBtn: com.focusPage("#addReduceItemsBtn", "#decorationAccountContent"),
            addConstructionItemsBtn: com.focusPage("#addConstructionItemsBtn", "#decorationAccountContent"),
            addMaterialItemsBtn: com.focusPage("#addMaterialItemsBtn", "#decorationAccountContent"),
            addReduceIndexBtn: com.focusPage("#addReduceIndexBtn", "#decorationAccountContent"),

        },
        modal: {
            QRcodeModal: com.focusPage("#QRcodeModal"),
            accountCalculatorModal: com.focusPage("#accountCalculatorModal")
        }
    };

    var decoration;
    var quotation;

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
        signFactDone: 0,
        signFactOwing: 0,
        quoManageRate: 0,

        managePredisPrice: 0,
        taxPredisPrice: 0,

        contractPrice: 0,
        couponCut: 0,
        factPrice: 0,
        servicePrice: 0,

        oalesTotal: 0,
        oalesMaterialTotal: 0,
        oalesScaleTotal: 0,

        addPredisPrice: 0,
        addPredisManagePrice: 0,
        addManagePrice: 0,
        addCalPrice: 0,
        addUncalPrice: 0,
        addDisCalPrice: 0,
        addUndisCalPrice: 0,
        addTotalPrice: 0,
        addDone: 0,
        addOwing: 0,
        addDisPrice: 0,
        addUndisPrice: 0,
        addPredisTaxPrice: 0,
        addTaxPrice: 0,

        reducePredisPrice: 0,
        reducePredisManagePrice: 0,
        reduceManagePrice: 0,
        reduceCalPrice: 0,
        reduceUncalPrice: 0,
        reduceDisCalPrice: 0,
        reduceUndisCalPrice: 0,
        reduceTotalPrice: 0,
        reduceDone: 0,
        reduceOwing: 0,
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
        addConstructionDone: 0,
        addConstructionOwing: 0,
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
        reduceConstructionDone: 0,
        reduceConstructionOwing: 0,
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
        addMaterialDone: 0,
        addMaterialOwing: 0,
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
        reduceMaterialDone: 0,
        reduceMaterialOwing: 0,
        reduceMaterialDisPrice: 0,
        reduceMaterialUndisPrice: 0,
        reduceMaterialPredisTaxPrice: 0,
        reduceMaterialTaxPrice: 0,
        materialAsDifference: 0,

        accountForehead: 0,
        balanceSum: 0,
        difference: 0,
        superRatio: 0,
        materialAccountManual: false,

        name: "",
        discount: 0,
        taxRate: 0,// 税金比例(配比)
        taxDiscount: 0,// 税金折扣(是否打折)
        base: 0,
        material: 0,
        service: 0,
        discount: 0,

        addFoldFrontTotal: 0,
        minusFoldFrontTotal: 0,

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

        accountBasic.materialAccount = parseFloat($(this).val()) || 0;
        accountBasic.materialAccountManual = true;
        accountSuper();
        enableAccountBtns();
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

        quotation = res.quotation;

        accountBasic.undisPrice = quotation.undisPrice;
        accountBasic.disPrice = quotation.disPrice;
        accountBasic.trafficPrice = quotation.trafficPrice;
        accountBasic.managePrice = quotation.managePrice;
        accountBasic.taxPrice = quotation.taxPrice;
        accountBasic.taxRate = quotation.taxRate;
        accountBasic.taxDiscount = quotation.taxDiscount;
        accountBasic.discount = quotation.discount;
        accountBasic.quoManageRate = quotation.manageRate;
        accountBasic.totalPrice = quotation.totalPrice;

        accountBasic.foldFrontTotal = Math.round(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.managePrice + accountBasic.taxPrice);
        accountBasic.foldFrontFee = Math.round(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice);

        if (quotation.version.name != null) {
            decorationDetail.basicsItems.name.html("报价(" + quotation.version.name + ")");
        }

        decorationDetail.basicsItems.foldFrontTotalPrice.html(accountBasic.totalPrice);
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

        accountBasic.addFoldFrontTotal = $addFoldFrontTotal;
        accountBasic.minusFoldFrontTotal = $minusFoldFrontTotal;

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
        
        decorationDetail.items.preferences.val(decoration.couponCut);

    }, null, false);

    if (decoration.type == 0) {
        com.post(api.decoration.queryDecorationMidpack, {
            "decorationMidpack.decoration.orderId": decorationDetail.orderId
        }, function(res) {

            var midpack = res.decorationMidpack;

            if (!midpack || !midpack.dmid)
                return false;

            accountBasic.servicePrice = midpack.servicePrice;
            accountBasic.servicePaidup = midpack.servicePaidup;

            accountBasic.servicePrice = com.checkNull(Math.round(accountBasic.servicePrice), 0);
            accountBasic.servicePaidup = com.checkNull(Math.round(accountBasic.servicePaidup), 0);

            decorationDetail.contractItems.servicePrice.html(accountBasic.servicePrice);
            decorationDetail.materialItems.materialRatio.html(0);
            decorationDetail.contractItems.servicePaidup.html(accountBasic.servicePaidup);

        }, null, false);
    }

    if (decoration.type == 1) {

        decorationDetail.contractItems.servicePrice.html(0);
        decorationDetail.materialItems.materialRatio.html(0);
        decorationDetail.contractItems.servicePaidup.html(0);

    }

    if (decoration.type == 2) {
        com.post(api.decoration.queryDecorationHolonomy, {
            "decorationHolonomy.decoration.orderId": decorationDetail.orderId
        }, function(res) {

            var decorationHolonomy = res.decorationHolonomy;

            if (!decorationHolonomy || !decorationHolonomy.dhid)
                return false;

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
    }

    com.post(api.payment.queryDecorationPaymentByOrderId, {
        "decorationPayment.decoration.orderId": decorationDetail.orderId,
        "decorationPayment.oneType": 0,
    }, function(res) {

        var decorationPayments = res.decorationPayments;

        $.each(decorationPayments, function(i, v) {

            if (v.twoType == 1 && v.paymentStatus == 0) {
                accountBasic.signFactOwing = utils.accAdd(accountBasic.signFactOwing, v.referMoney);
            } else if (v.twoType == 1 && v.paymentStatus != 0) {
                accountBasic.signFactDone = utils.accAdd(accountBasic.signFactDone, v.referMoney);
            }

        });

    }, null, false);

    decorationDetail.contractItems.signFactDone.html(accountBasic.signFactDone);
    decorationDetail.contractItems.signFactOwing.html(accountBasic.signFactOwing);

    com.post(api.sales.queryOalesByOrderId, {
        "oales.decoration.orderId": decorationDetail.orderId
    }, function(res) {

        oaleses = res.oaleses;

        $.each(oaleses, function(i, v) {

            accountBasic.oalesTotal = utils.accAdd(accountBasic.oalesTotal, v.total);
        });

    }, null, false);

    // 仅汇总需配比(isScale=0)的外销单金额, 用于决算实花配比(含外销)计算
    com.post(api.sales.amountOales, {
        "oales.decoration.orderId": decorationDetail.orderId,
        "oales.isScale": 0
    }, function(res) {

        accountBasic.oalesScaleTotal = res.amount || 0;
    }, null, false);

    decorationDetail.oalesItems.oalesTotal.html(accountBasic.oalesTotal);
    decorationDetail.oalesItems.oalesMaterialTotal.html(utils.accAdd(accountBasic.oalesTotal, accountBasic.materialTotal));
    decorationDetail.oalesItems.oalesScaleTotal.html(accountBasic.oalesScaleTotal);

    queryAddReduce();

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

    queryDecorationAccount();

    function enableAccountBtns() {

        decorationDetail.btns.updateBtn.removeAttr("disabled");
        decorationDetail.btns.submission.removeAttr("disabled");
    }

    function findMatchingConfig(decorationAccount) {

        var config = null;

        $.each(accountBasic.machingType, function(i, v) {

            if (decorationAccount.name == v.name && decorationAccount.typeness == v.typeness) {
                config = v;
                return false;
            }
        });

        if (config) return config;

        $.each(accountBasic.machingType, function(i, v) {

            if (decorationAccount.typeness == v.typeness && decorationAccount.matching == v.matching && decorationAccount.serviceRate == v.serviceRate) {
                config = v;
                return false;
            }
        });

        if (config) return config;

        $.each(accountBasic.machingType, function(i, v) {

            if (decorationAccount.typeness == v.typeness) {
                config = v;
                return false;
            }
        });

        return config;
    }

    function applyDecorationAccount(decorationAccount) {

        if (!decorationAccount || !decorationAccount.daid) return false;

        var config = findMatchingConfig(decorationAccount);

        if (config && config.dmid) {
            $.extend(accountBasic, config);
            decorationDetail.items.otherPaymentType.val(config.dmid);
        }

        accountBasic.daid = decorationAccount.daid;
        accountBasic.name = decorationAccount.name;
        accountBasic.dd = decorationAccount.discount;
        accountBasic.type = decorationAccount.type;
        accountBasic.typeness = decorationAccount.typeness;
        accountBasic.base = decorationAccount.discountBase;
        accountBasic.discount = decorationAccount.discount;
        accountBasic.material = decorationAccount.matching;
        accountBasic.service = decorationAccount.serviceRate;
        accountBasic.materialAccount = decorationAccount.materialPrice;
        accountBasic.materialAccountManual = true;
        accountBasic.accountServicePrice = decorationAccount.servicePrice;
        accountBasic.projectPrice = decorationAccount.projectPrice;
        accountBasic.projectBase = decorationAccount.projectBase;
        accountBasic.flowerRatio = decorationAccount.paidupMatching;
        accountBasic.balanceSum = decorationAccount.difference;
        accountBasic.preferences = decorationAccount.coupon || 0;
        accountBasic.internalCoupon = decorationAccount.internal || 0;
        accountBasic.fulldel = decorationAccount.fulldel || 0;
        accountBasic.cashback = decorationAccount.cashback || 0;
        accountBasic.cal = (decorationAccount.arcal == 0);

        decorationDetail.items.discountName.val(decorationAccount.name);
        decorationDetail.items.decorationType.val(decorationDetail.orderType[decorationDetail.orderTypeness]);
        decorationDetail.items.accountType.val(decorationDetail.orderType[decorationAccount.typeness]);
        decorationDetail.items.calDiscountPrice.val(decorationAccount.discount);
        decorationDetail.items.matching.prop("checked", accountBasic.cal);
        decorationDetail.items.preferences.val(accountBasic.preferences);
        decorationDetail.items.internalCoupon.val(accountBasic.internalCoupon);
        decorationDetail.items.fulldel.val(accountBasic.fulldel);
        decorationDetail.items.cashback.val(accountBasic.cashback);
        decorationDetail.items.comment.val(decorationAccount.comment);
        decorationDetail.accountItems.materialAccount.val(decorationAccount.materialPrice);

        accountSuper();
        enableAccountBtns();

        return true;
    }

    function queryDecorationAccount(callback) {

        com.post(api.decoration.queryDecorationAccount, {
            "decorationAccount.orderId": decorationDetail.orderId
        }, function(res) {

            var decorationAccount = res.decorationAccount;

            if (!applyDecorationAccount(decorationAccount)) return false;

            if (callback) callback(decorationAccount);
        }, null, false);
    }

    function collectDecorationAccountOption() {

        accountBasic.materialAccount = parseFloat(decorationDetail.accountItems.materialAccount.val()) || accountBasic.materialAccount || 0;
        accountBasic.preferences = decorationDetail.items.preferences.val() ? decorationDetail.items.preferences.val() : 0;
        accountBasic.internalCoupon = decorationDetail.items.internalCoupon.val() ? decorationDetail.items.internalCoupon.val() : 0;
        accountBasic.fulldel = decorationDetail.items.fulldel.val() ? decorationDetail.items.fulldel.val() : 0;
        accountBasic.cashback = decorationDetail.items.cashback.val() ? decorationDetail.items.cashback.val() : 0;
        accountBasic.projectPrice = accountBasic.direct || 0;
        accountBasic.projectBase = accountBasic.beforeTotal || 0;

        return {
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
            "decorationAccount.projectPrice": accountBasic.projectPrice,
            "decorationAccount.projectBase": accountBasic.projectBase,
            "decorationAccount.paidupMatching": accountBasic.flowerRatio,
            "decorationAccount.difference": accountBasic.balanceSum,
            "decorationAccount.coupon": accountBasic.preferences,
            "decorationAccount.internal": accountBasic.internalCoupon,
            "decorationAccount.fulldel": accountBasic.fulldel,
            "decorationAccount.cashback": accountBasic.cashback,
            "decorationAccount.comment": decorationDetail.items.comment.val()
        };
    }

    function buildDecorationAccountItems() {

        var items = [];
        var sort = 0;

        function addItem(type, subtype, name, money, rate, content) {

            items.push({
                type: type,
                subtype: subtype,
                name: name,
                sourceType: type,
                sourceId: 0,
                money: parseFloat(money) || 0,
                rate: parseFloat(rate) || 0,
                sort: sort++,
                content: content == null ? "" : String(content),
                comment: ""
            });
        }

        addItem(0, 0, "起报价", decorationDetail.protationItems.quotePrice.text(), 0, decorationDetail.protationItems.quotePrice.text());
        addItem(0, 1, "优惠价", decorationDetail.protationItems.preferPrice.text(), 0, decorationDetail.protationItems.preferPrice.text());
        addItem(0, 2, "管理费", decorationDetail.protationItems.managePrice.text(), 0, decorationDetail.protationItems.managePrice.text());
        addItem(0, 3, "面积", decorationDetail.protationItems.buildArea.text(), 0, decorationDetail.protationItems.buildArea.text());
        addItem(0, 4, "总价", decorationDetail.protationItems.totalPrice.text(), 0, decorationDetail.protationItems.totalPrice.text());
        addItem(0, 5, "合同额", decorationDetail.protationItems.precontractPrice.text(), 0, decorationDetail.protationItems.precontractPrice.text());

        addItem(1, 0, "报价总额", decorationDetail.basicsItems.foldFrontTotalPrice.text(), 0, decorationDetail.basicsItems.foldFrontTotalPrice.text());
        addItem(1, 1, "折前总价", decorationDetail.basicsItems.foldFrontTotal.text(), 0, decorationDetail.basicsItems.foldFrontTotal.text());
        addItem(1, 2, "折前直接费", decorationDetail.basicsItems.foldFrontFee.text(), 0, decorationDetail.basicsItems.foldFrontFee.text());
        addItem(1, 3, "管理费", decorationDetail.basicsItems.managePrice.text(), 0, decorationDetail.basicsItems.managePrice.text());
        addItem(1, 4, "折扣", 0, decorationDetail.basicsItems.basdiscount.text(), decorationDetail.basicsItems.basdiscount.text());
        addItem(1, 5, "打折项总额", decorationDetail.basicsItems.disPrice.text(), 0, decorationDetail.basicsItems.disPrice.text());
        addItem(1, 6, "不打折项总额", decorationDetail.basicsItems.undisPrice.text(), 0, decorationDetail.basicsItems.undisPrice.text());
        addItem(1, 7, "税金", decorationDetail.basicsItems.taxPrice.text(), 0, decorationDetail.basicsItems.taxPrice.text());

        addItem(2, 0, "增项折前总价", decorationDetail.extensionItems.addFoldFrontTotal.text(), 0, decorationDetail.extensionItems.addFoldFrontTotal.text());
        addItem(2, 1, "增项管理费", decorationDetail.extensionItems.addManagePrice.text(), 0, decorationDetail.extensionItems.addManagePrice.text());
        addItem(2, 2, "增项总额", decorationDetail.extensionItems.addTotal.text(), 0, decorationDetail.extensionItems.addTotal.text());
        addItem(2, 3, "减项折前总价", decorationDetail.extensionItems.minusFoldFrontTotal.text(), 0, decorationDetail.extensionItems.minusFoldFrontTotal.text());
        addItem(2, 4, "减项管理费", decorationDetail.extensionItems.minusManagePrice.text(), 0, decorationDetail.extensionItems.minusManagePrice.text());
        addItem(2, 5, "减项总额", decorationDetail.extensionItems.minusTotal.text(), 0, decorationDetail.extensionItems.minusTotal.text());

        addItem(3, 0, "合同额", decorationDetail.contractItems.signPrice.text(), 0, decorationDetail.contractItems.signPrice.text());
        addItem(3, 1, "优惠券", decorationDetail.contractItems.coupon.text(), 0, decorationDetail.contractItems.coupon.text());
        addItem(3, 2, "服务费", decorationDetail.contractItems.servicePrice.text(), 0, decorationDetail.contractItems.servicePrice.text());
        addItem(3, 3, "已收服务费", decorationDetail.contractItems.servicePaidup.text(), 0, decorationDetail.contractItems.servicePaidup.text());
        addItem(3, 4, "合同已收", decorationDetail.contractItems.signFactDone.text(), 0, decorationDetail.contractItems.signFactDone.text());
        addItem(3, 5, "合同未收", decorationDetail.contractItems.signFactOwing.text(), 0, decorationDetail.contractItems.signFactOwing.text());
        addItem(3, 6, "合同实收", decorationDetail.contractItems.signFactPrice.text(), 0, decorationDetail.contractItems.signFactPrice.text());
        addItem(3, 7, "主材配比", 0, decorationDetail.contractItems.mm.text(), decorationDetail.contractItems.mm.text());

        addItem(4, 0, "配比总额", decorationDetail.materialItems.materialRatio.text(), 0, decorationDetail.materialItems.materialRatio.text());
        addItem(4, 1, "总金额", decorationDetail.materialItems.materialTotal.text(), 0, decorationDetail.materialItems.materialTotal.text());
        addItem(4, 2, "优惠券", decorationDetail.materialItems.materialCoupon.text(), 0, decorationDetail.materialItems.materialCoupon.text());
        addItem(4, 3, "实收额", decorationDetail.materialItems.materialFactPrice.text(), 0, decorationDetail.materialItems.materialFactPrice.text());

        addItem(5, 0, "外销总金额", decorationDetail.oalesItems.oalesTotal.text(), 0, decorationDetail.oalesItems.oalesTotal.text());
        addItem(5, 1, "外销主材总额", decorationDetail.oalesItems.oalesMaterialTotal.text(), 0, decorationDetail.oalesItems.oalesMaterialTotal.text());
        addItem(5, 2, "外销配比总额", decorationDetail.oalesItems.oalesScaleTotal.text(), 0, decorationDetail.oalesItems.oalesScaleTotal.text());

        addItem(6, 0, "增项折前总价", decorationDetail.addReduceItems.addFoldFrontTotal.text(), 0, decorationDetail.addReduceItems.addFoldFrontTotal.text());
        addItem(6, 1, "增项管理费", decorationDetail.addReduceItems.addManagePrice.text(), 0, decorationDetail.addReduceItems.addManagePrice.text());
        addItem(6, 2, "增项配比总额", decorationDetail.addReduceItems.addMatch.text(), 0, decorationDetail.addReduceItems.addMatch.text());
        addItem(6, 3, "增项非配比总额", decorationDetail.addReduceItems.addUncalPrice.text(), 0, decorationDetail.addReduceItems.addUncalPrice.text());
        addItem(6, 4, "增项税金总额", decorationDetail.addReduceItems.addTaxPrice.text(), 0, decorationDetail.addReduceItems.addTaxPrice.text());
        addItem(6, 5, "增项总额", decorationDetail.addReduceItems.addTotal.text(), 0, decorationDetail.addReduceItems.addTotal.text());
        addItem(6, 6, "减项折前总价", decorationDetail.addReduceItems.minusFoldFrontTotal.text(), 0, decorationDetail.addReduceItems.minusFoldFrontTotal.text());
        addItem(6, 7, "减项管理费", decorationDetail.addReduceItems.minusManagePrice.text(), 0, decorationDetail.addReduceItems.minusManagePrice.text());
        addItem(6, 8, "减项配比总额", decorationDetail.addReduceItems.minusMatch.text(), 0, decorationDetail.addReduceItems.minusMatch.text());
        addItem(6, 9, "减项非配比总额", decorationDetail.addReduceItems.minusUncalPrice.text(), 0, decorationDetail.addReduceItems.minusUncalPrice.text());
        addItem(6, 10, "减项税金总额", decorationDetail.addReduceItems.minusTaxPrice.text(), 0, decorationDetail.addReduceItems.minusTaxPrice.text());
        addItem(6, 11, "减项总额", decorationDetail.addReduceItems.minusTotal.text(), 0, decorationDetail.addReduceItems.minusTotal.text());
        addItem(6, 12, "增减项差额", decorationDetail.addReduceItems.asDifference.text(), 0, decorationDetail.addReduceItems.asDifference.text());

        addItem(7, 0, "合同预付款", decorationDetail.advanceItems.contractAdvance.text(), 0, decorationDetail.advanceItems.contractAdvance.text());
        addItem(7, 1, "工程预付款", decorationDetail.advanceItems.constructionAdvance.text(), 0, decorationDetail.advanceItems.constructionAdvance.text());
        addItem(7, 2, "主材预付款", decorationDetail.advanceItems.materialAdvance.text(), 0, decorationDetail.advanceItems.materialAdvance.text());
        addItem(7, 3, "正林预付款", decorationDetail.advanceItems.zhenglinAdvance.text(), 0, decorationDetail.advanceItems.zhenglinAdvance.text());

        addItem(8, 0, "决算折前总额", decorationDetail.accountItems.direct.text(), 0, decorationDetail.accountItems.direct.text());
        addItem(8, 1, "决算直接费", decorationDetail.accountItems.beforeTotal.text(), 0, decorationDetail.accountItems.beforeTotal.text());
        addItem(8, 2, "决算管理费", decorationDetail.accountItems.management.text(), 0, decorationDetail.accountItems.management.text());
        addItem(8, 3, "决算实花配比", 0, decorationDetail.accountItems.flowerRatio.text(), decorationDetail.accountItems.flowerRatio.text());
        addItem(8, 4, "决算主材额", decorationDetail.accountItems.materialAccount.val(), 0, decorationDetail.accountItems.materialAccount.val());
        addItem(8, 5, "决算合同额", decorationDetail.accountItems.accountForehead.text(), 0, decorationDetail.accountItems.accountForehead.text());
        addItem(8, 6, "决算服务费", decorationDetail.accountItems.accountServicePrice.text(), 0, decorationDetail.accountItems.accountServicePrice.text());
        addItem(8, 7, "决算实花配比含外销", 0, decorationDetail.accountItems.flowerOalesRatio.text(), decorationDetail.accountItems.flowerOalesRatio.text());
        addItem(8, 8, "金额差", decorationDetail.accountItems.difference.text(), 0, decorationDetail.accountItems.difference.text());
        addItem(8, 9, "超配比", 0, decorationDetail.accountItems.superRatio.text(), decorationDetail.accountItems.superRatio.text());
        addItem(8, 10, "税金", decorationDetail.accountItems.taxPrice.text(), 0, decorationDetail.accountItems.taxPrice.text());
        addItem(8, 11, "差额不含预付款", decorationDetail.accountItems.balanceSum.text(), 0, decorationDetail.accountItems.balanceSum.text());
        addItem(8, 12, "决算折前总额全", decorationDetail.accountItems.directC.text(), 0, decorationDetail.accountItems.directC.text());
        addItem(8, 13, "应补款", decorationDetail.accountItems.fullPayment.text(), 0, decorationDetail.accountItems.fullPayment.text());
        addItem(8, 14, "优惠券", decorationDetail.items.preferences.val(), 0, decorationDetail.items.preferences.val());
        addItem(8, 15, "内部优惠券", decorationDetail.items.internalCoupon.val(), 0, decorationDetail.items.internalCoupon.val());
        addItem(8, 16, "满送", decorationDetail.items.fulldel.val(), 0, decorationDetail.items.fulldel.val());
        addItem(8, 17, "返现", decorationDetail.items.cashback.val(), 0, decorationDetail.items.cashback.val());

        return items;
    }

    function saveDecorationAccountItems(callback) {

        var items = buildDecorationAccountItems();
        var options = {
            "decorationAccountItem.orderId": decorationDetail.orderId,
            "decorationAccountItem.daid": accountBasic.daid
        };

        $.each(items, function(i, item) {
            options["decorationAccountItems[" + i + "].type"] = item.type;
            options["decorationAccountItems[" + i + "].subtype"] = item.subtype;
            options["decorationAccountItems[" + i + "].name"] = item.name;
            options["decorationAccountItems[" + i + "].sourceType"] = item.sourceType;
            options["decorationAccountItems[" + i + "].sourceId"] = item.sourceId;
            options["decorationAccountItems[" + i + "].money"] = item.money;
            options["decorationAccountItems[" + i + "].rate"] = item.rate;
            options["decorationAccountItems[" + i + "].sort"] = item.sort;
            options["decorationAccountItems[" + i + "].content"] = item.content;
            options["decorationAccountItems[" + i + "].comment"] = item.comment;
        });

        com.post(api.decoration.updateDecorationAccountItem, options, function() {
            if (callback) callback();
        });
    }

    function saveDecorationAccount(showMessage, callback) {

        if (com.validate('controls')) return false;

        accountSuper();

        com.post(api.decoration.updateDecorationAccount, collectDecorationAccountOption(), function(res) {

            accountBasic.isPrint = true;

            queryDecorationAccount(function() {

                saveDecorationAccountItems(function() {

                    if (showMessage) com.showAlert(com.info, "更新保存成功");
                    if (callback) callback();
                });
            });
        });

        return true;
    }

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
        accountSuper();
        enableAccountBtns();
    });

    decorationDetail.items.preferences.add(decorationDetail.items.internalCoupon).add(decorationDetail.items.fulldel).add(decorationDetail.items.cashback).blur(function() {

        accountSuper();
        enableAccountBtns();
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

        if (config.typeness == decorationDetail.orderTypeness) {
            decorationDetail.items.calDiscountPrice.val(quotation.discount);
            accountBasic.discount = quotation.discount;
        } else {
            decorationDetail.items.calDiscountPrice.val(com.checkNull(config.discount, 0));
            accountBasic.discount = config.discount;
        }

        accountBasic.dd = accountBasic.discount;
        accountBasic.name = config.name;
        accountBasic.typeness = config.typeness;

        decorationDetail.items.discountName.val(config.name);
        decorationDetail.items.decorationType.val(decorationDetail.orderType[decorationDetail.orderTypeness]);
        decorationDetail.items.accountType.val(decorationDetail.orderType[config.typeness]);

        if (config.discountType == constant.data().decorationMatching.DISCOUNTTYPE_ONLY_INT) {
            decorationDetail.items.calDiscountPrice.attr("readonly", "readonly");
        } else {
            decorationDetail.items.calDiscountPrice.removeAttr("readonly");
        }

        enableAccountBtns();

        return false;
    });

    decorationDetail.btns.printBtn.click(function() {

        accountBasic.preferences = decorationDetail.items.preferences.val() ? decorationDetail.items.preferences.val() : 0;
        accountBasic.internalCoupon = decorationDetail.items.internalCoupon.val() ? decorationDetail.items.internalCoupon.val() : 0;
        accountBasic.fulldel = decorationDetail.items.fulldel.val() ? decorationDetail.items.fulldel.val() : 0;
        accountBasic.cashback = decorationDetail.items.cashback.val() ? decorationDetail.items.cashback.val() : 0;
        accountBasic.oalesOutput = com.focusPage('input[id="oalesOutput"]:checked').val();
        accountBasic.printConf = {
            "oalesOutput": com.focusPage('input[id="oalesOutput"]:checked').val(),
            "accountOutput": com.focusPage('input[id="accountOutput"]:checked').val(),
            "contractOutput": com.focusPage('input[id="contractOutput"]:checked').val(),
            "protationOutput": com.focusPage('input[id="protationOutput"]:checked').val(),
            "addOutput": com.focusPage('input[id="addOutput"]:checked').val(),
            "extensionOutput": com.focusPage('input[id="extensionOutput"]:checked').val(),
            "signFactOutput": com.focusPage('input[id="signFactOutput"]:checked').val(),
            "materialOutput": com.focusPage('input[id="materialOutput"]:checked').val(),
            "addReduceOutput": com.focusPage('input[id="addReduceOutput"]:checked').val(),
        };

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

            saveDecorationAccount(true);
        });
    });

    decorationDetail.btns.submission.click(function() {

        if (com.validate('controls'))
            return false;

        com.showConfirm("确定锁定新决算信息吗?", function() {

            saveDecorationAccount(false, function() {

                com.post(api.decoration.makeDecorationAccount, {
                    "decorationAccount.orderId": decorationDetail.orderId,
                    "approve": "agree"
                }, function(res) {

                    com.showAlert(com.info, "锁定成功");
                });
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

    decorationDetail.btns.addReduceIndexBtn.click(function() {

        params.urlLoadParams.type = "account";

        com.popup4page("#layerPopUp", "/views/quotation/addReduceIndex.html?pageType=account", "明细", null, function() {

            queryAddReduce();
        });
    });

    function queryAddReduce() {

        accountBasic.addPredisPrice = 0, accountBasic.addPredisManagePrice = 0, accountBasic.addManagePrice = 0, accountBasic.addCalPrice = 0, accountBasic.addUncalPrice = 0, accountBasic.addTotalPrice = 0, accountBasic.addDone = 0, accountBasic.addOwing = 0, accountBasic.addDisPrice = 0, accountBasic.addUndisPrice = 0, accountBasic.addPredisTaxPrice = 0, accountBasic.addTaxPrice = 0,

        accountBasic.reducePredisPrice = 0, accountBasic.reducePredisManagePrice = 0, accountBasic.reduceManagePrice = 0, accountBasic.reduceCalPrice = 0, accountBasic.reduceUncalPrice = 0, accountBasic.reduceTotalPrice = 0, accountBasic.reduceDone = 0, accountBasic.reduceOwing = 0, accountBasic.reduceDisPrice = 0, accountBasic.reduceUndisPrice = 0, accountBasic.reducePredisTaxPrice = 0, accountBasic.reduceTaxPrice = 0, accountBasic.asDifference = 0,

        accountBasic.addConstructionPredisPrice = 0, accountBasic.addConstructionPredisManagePrice = 0, accountBasic.addConstructionManagePrice = 0, accountBasic.addConstructionCalPrice = 0, accountBasic.addConstructionUncalPrice = 0, accountBasic.addConstructionTotalPrice = 0, accountBasic.addConstructionDone = 0, accountBasic.addConstructionOwing = 0, accountBasic.addConstructionDisPrice = 0, accountBasic.addConstructionUndisPrice = 0, accountBasic.addConstructionPredisTaxPrice = 0, accountBasic.addConstructionTaxPrice = 0,

        accountBasic.reduceConstructionPredisPrice = 0, accountBasic.reduceConstructionPredisManagePrice = 0, accountBasic.reduceConstructionManagePrice = 0, accountBasic.reduceConstructionCalPrice = 0, accountBasic.reduceConstructionUncalPrice = 0, accountBasic.reduceConstructionTotalPrice = 0, accountBasic.reduceConstructionDone = 0, accountBasic.reduceConstructionOwing = 0, accountBasic.reduceConstructionDisPrice = 0, accountBasic.reduceConstructionUndisPrice = 0, accountBasic.reduceConstructionPredisTaxPrice = 0, accountBasic.reduceConstructionTaxPrice = 0, accountBasic.constructionAsDifference = 0,

        accountBasic.addMaterialPredisPrice = 0, accountBasic.addMaterialPredisManagePrice = 0, accountBasic.addMaterialManagePrice = 0, accountBasic.addMaterialCalPrice = 0, accountBasic.addMaterialUncalPrice = 0, accountBasic.addMaterialTotalPrice = 0, accountBasic.addMaterialDone = 0, accountBasic.addMaterialOwing = 0, accountBasic.addMaterialDisPrice = 0, accountBasic.addMaterialUndisPrice = 0, accountBasic.addMaterialPredisTaxPrice = 0, accountBasic.addMaterialTaxPrice = 0,

        accountBasic.reduceMaterialPredisPrice = 0, accountBasic.reduceMaterialPredisManagePrice = 0, accountBasic.reduceMaterialManagePrice = 0, accountBasic.reduceMaterialCalPrice = 0, accountBasic.reduceMaterialUncalPrice = 0, accountBasic.reduceMaterialTotalPrice = 0, accountBasic.reduceMaterialDone = 0, accountBasic.reduceMaterialOwing = 0, accountBasic.reduceMaterialDisPrice = 0, accountBasic.reduceMaterialUndisPrice = 0, accountBasic.reduceMaterialPredisTaxPrice = 0, accountBasic.reduceMaterialTaxPrice = 0, accountBasic.materialAsDifference = 0,
        
        accountBasic.addDisCalPrice = 0, accountBasic.addUndisCalPrice = 0, accountBasic.reduceDisCalPrice = 0, accountBasic.reduceUndisCalPrice = 0,

        com.post(api.quotation.queryAddReduceByOrderId, {
            "addReduce.orderId": decorationDetail.orderId
        }, function(res) {

            var addReduces = res.addReduces;

            $.each(addReduces, function(i, v) {

                if ([0].indexOf(v.paytype) == -1) // 付款类型验证
                    return true;

                if ([2, 3].indexOf(v.status) == -1) // 状态验证
                    return true;

                var accountDiscount = v.accountDiscount == 0 ? (v.discount == 0 ? accountBasic.discount : v.discount) : v.accountDiscount;
                var accountManageDiscount = v.accountManageDiscount == 0 ? (v.manageDiscount == 0 ? accountBasic.manageDiscount : v.manageDiscount) : v.accountManageDiscount;
                var accountTaxDiscount = v.accountTaxDiscount == 0 ? (v.taxDiscount == 0 ? accountBasic.taxDiscount : v.taxDiscount) : v.accountTaxDiscount;

                var managePrice = accountManageDiscount == 1 ? utils.accMul(v.managePrice, utils.accDiv(accountDiscount, 10)) : v.managePrice;
                var taxPrice = accountTaxDiscount == 1 ? utils.accMul(v.taxPrice, utils.accDiv(accountDiscount, 10)) : v.taxPrice;
                var totalPrice = utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(v.calPrice, utils.accDiv(accountDiscount, 10)), v.uncalPrice), managePrice), taxPrice);

                if (v.type == 0) { // 增项

                    accountBasic.addPredisPrice = utils.accAdd(accountBasic.addPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                    accountBasic.addPredisManagePrice = utils.accAdd(accountBasic.addPredisManagePrice, v.managePrice);
                    accountBasic.addManagePrice = utils.accAdd(accountBasic.addManagePrice, managePrice);// 增项管理费
                    accountBasic.addCalPrice = utils.accAdd(accountBasic.addCalPrice, v.calPrice);
                    accountBasic.addUncalPrice = utils.accAdd(accountBasic.addUncalPrice, v.uncalPrice);
                    accountBasic.addTotalPrice = utils.accAdd(accountBasic.addTotalPrice, v.total);
                    accountBasic.addDisPrice = utils.accAdd(accountBasic.addDisPrice, v.disPrice);
                    accountBasic.addUndisPrice = utils.accAdd(accountBasic.addUndisPrice, v.undisPrice);
                    accountBasic.addPredisTaxPrice = utils.accAdd(accountBasic.addPredisTaxPrice, v.taxPrice);
                    accountBasic.addTaxPrice = utils.accAdd(accountBasic.addTaxPrice, taxPrice);// 增项税金
                    accountBasic.addDone = utils.accAdd(accountBasic.addDone, v.status == constant.quotation().addreduce.STATUS_PAYED_INT || v.status == constant.quotation().addreduce.STATUS_CONFIRMED_INT ? v.total : 0);
                    accountBasic.addOwing = utils.accAdd(accountBasic.addOwing, v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT ? v.total : 0);

                    accountBasic.asDifference = utils.accAdd(accountBasic.asDifference, accountBasic.addDisPrice * (accountBasic.dd / 10) + accountBasic.addUndisPrice + Math.round(accountBasic.addManagePrice) - Math.round(accountBasic.addTotalPrice));

                    if (v.atttype == 0) {
                        accountBasic.addConstructionPredisPrice = utils.accAdd(accountBasic.addConstructionPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                        accountBasic.addConstructionPredisManagePrice = utils.accAdd(accountBasic.addConstructionPredisManagePrice, v.managePrice);
                        accountBasic.addConstructionManagePrice = utils.accAdd(accountBasic.addConstructionManagePrice, managePrice);// 增项管理费
                        accountBasic.addConstructionCalPrice = utils.accAdd(accountBasic.addConstructionCalPrice, v.calPrice);
                        accountBasic.addConstructionUncalPrice = utils.accAdd(accountBasic.addConstructionUncalPrice, v.uncalPrice);
                        accountBasic.addConstructionTotalPrice = utils.accAdd(accountBasic.addConstructionTotalPrice, totalPrice);
                        accountBasic.addConstructionDisPrice = utils.accAdd(accountBasic.addConstructionDisPrice, v.disPrice);
                        accountBasic.addConstructionUndisPrice = utils.accAdd(accountBasic.addConstructionUndisPrice, v.undisPrice);
                        accountBasic.addConstructionPredisTaxPrice = utils.accAdd(accountBasic.addConstructionPredisTaxPrice, v.taxPrice);
                        accountBasic.addConstructionTaxPrice = utils.accAdd(accountBasic.addConstructionTaxPrice, taxPrice);// 增项税金
                        accountBasic.addConstructionOwing = utils.accAdd(accountBasic.addConstructionOwing, v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT ? v.total : 0);
                        accountBasic.addConstructionDone = utils.accAdd(accountBasic.addConstructionDone, v.status == constant.quotation().addreduce.STATUS_PAYED_INT || v.status == constant.quotation().addreduce.STATUS_CONFIRMED_INT ? v.total : 0);

                        accountBasic.constructionAsDifference = utils.accAdd(accountBasic.constructionAsDifference, accountBasic.addConstructionDisPrice * (accountBasic.dd / 10) + accountBasic.addConstructionUndisPrice + Math.round(accountBasic.addConstructionManagePrice) - Math.round(accountBasic.addConstructionTotalPrice));

                    } else if (v.atttype == 1) {
                        accountBasic.addMaterialPredisPrice = utils.accAdd(accountBasic.addMaterialPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                        accountBasic.addMaterialPredisManagePrice = utils.accAdd(accountBasic.addMaterialPredisManagePrice, v.managePrice);
                        accountBasic.addMaterialManagePrice = utils.accAdd(accountBasic.addMaterialManagePrice, managePrice);// 增项管理费
                        accountBasic.addMaterialCalPrice = utils.accAdd(accountBasic.addMaterialCalPrice, v.calPrice);
                        accountBasic.addMaterialUncalPrice = utils.accAdd(accountBasic.addMaterialUncalPrice, v.uncalPrice);
                        accountBasic.addMaterialTotalPrice = utils.accAdd(accountBasic.addMaterialTotalPrice, totalPrice);
                        accountBasic.addMaterialDisPrice = utils.accAdd(accountBasic.addMaterialDisPrice, v.disPrice);
                        accountBasic.addMaterialUndisPrice = utils.accAdd(accountBasic.addMaterialUndisPrice, v.undisPrice);
                        accountBasic.addMaterialPredisTaxPrice = utils.accAdd(accountBasic.addMaterialPredisTaxPrice, v.taxPrice);
                        accountBasic.addMaterialTaxPrice = utils.accAdd(accountBasic.addMaterialTaxPrice, taxPrice);// 增项税金
                        accountBasic.addMaterialDone = utils.accAdd(accountBasic.addMaterialDone, v.status == constant.quotation().addreduce.STATUS_PAYED_INT || v.status == constant.quotation().addreduce.STATUS_CONFIRMED_INT ? v.total : 0);
                        accountBasic.addMaterialOwing = utils.accAdd(accountBasic.addMaterialOwing, v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT ? v.total : 0);

                        accountBasic.materialAsDifference = utils.accAdd(accountBasic.materialAsDifference, accountBasic.addMaterialDisPrice * (accountBasic.dd / 10) + accountBasic.addMaterialUndisPrice + Math.round(accountBasic.addMaterialManagePrice) - Math.round(accountBasic.addMaterialTotalPrice));

                    }

                } else if (v.type == 1) { // 减项

                    accountBasic.reducePredisPrice = utils.accAdd(accountBasic.reducePredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                    accountBasic.reducePredisManagePrice = utils.accAdd(accountBasic.reducePredisManagePrice, v.managePrice);
                    accountBasic.reduceManagePrice = utils.accAdd(accountBasic.reduceManagePrice, managePrice);// 减项管理费
                    accountBasic.reduceCalPrice = utils.accAdd(accountBasic.reduceCalPrice, v.calPrice);
                    accountBasic.reduceUncalPrice = utils.accAdd(accountBasic.reduceUncalPrice, v.uncalPrice);
                    accountBasic.reduceTotalPrice = utils.accAdd(accountBasic.reduceTotalPrice, v.total);
                    accountBasic.reduceDisPrice = utils.accAdd(accountBasic.reduceDisPrice, v.disPrice);
                    accountBasic.reduceUndisPrice = utils.accAdd(accountBasic.reduceUndisPrice, v.undisPrice);
                    accountBasic.reducePredisTaxPrice = utils.accAdd(accountBasic.reducePredisTaxPrice, v.taxPrice);
                    accountBasic.reduceTaxPrice = utils.accAdd(accountBasic.reduceTaxPrice, taxPrice);// 减项税金
                    accountBasic.reduceDone = utils.accAdd(accountBasic.reduceDone, v.status == constant.quotation().addreduce.STATUS_PAYED_INT || v.status == constant.quotation().addreduce.STATUS_CONFIRMED_INT ? v.total : 0);
                    accountBasic.reduceOwing = utils.accAdd(accountBasic.reduceOwing, v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT ? v.total : 0);

                    accountBasic.asDifference = utils.accAdd(accountBasic.asDifference, accountBasic.reduceDisPrice * (accountBasic.dd / 10) + accountBasic.reduceUndisPrice + Math.round(accountBasic.reduceManagePrice) - Math.round(accountBasic.reduceTotalPrice));

                    if (v.atttype == 0) {
                        accountBasic.reduceConstructionPredisPrice = utils.accAdd(accountBasic.reduceConstructionPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                        accountBasic.reduceConstructionPredisManagePrice = utils.accAdd(accountBasic.reduceConstructionPredisManagePrice, v.managePrice);
                        accountBasic.reduceConstructionManagePrice = utils.accAdd(accountBasic.reduceConstructionManagePrice, managePrice);// 减项管理费
                        accountBasic.reduceConstructionCalPrice = utils.accAdd(accountBasic.reduceConstructionCalPrice, v.calPrice);
                        accountBasic.reduceConstructionUncalPrice = utils.accAdd(accountBasic.reduceConstructionUncalPrice, v.uncalPrice);
                        accountBasic.reduceConstructionTotalPrice = utils.accAdd(accountBasic.reduceConstructionTotalPrice, totalPrice);
                        accountBasic.reduceConstructionDisPrice = utils.accAdd(accountBasic.reduceConstructionDisPrice, v.disPrice);
                        accountBasic.reduceConstructionUndisPrice = utils.accAdd(accountBasic.reduceConstructionUndisPrice, v.undisPrice);
                        accountBasic.reduceConstructionPredisTaxPrice = utils.accAdd(accountBasic.reduceConstructionPredisTaxPrice, v.taxPrice);
                        accountBasic.reduceConstructionTaxPrice = utils.accAdd(accountBasic.reduceConstructionTaxPrice, taxPrice);// 减项税金
                        accountBasic.reduceConstructionDone = utils.accAdd(accountBasic.reduceConstructionDone, v.status == constant.quotation().addreduce.STATUS_PAYED_INT || v.status == constant.quotation().addreduce.STATUS_CONFIRMED_INT ? v.total : 0);
                        accountBasic.reduceConstructionOwing = utils.accAdd(accountBasic.reduceConstructionOwing, v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT ? v.total : 0);

                        accountBasic.constructionAsDifference = utils.accAdd(accountBasic.constructionAsDifference, accountBasic.reduceConstructionDisPrice * (accountBasic.dd / 10) + accountBasic.reduceConstructionUndisPrice + Math.round(accountBasic.reduceConstructionManagePrice) - Math.round(accountBasic.reduceConstructionTotalPrice));

                    } else if (v.atttype == 1) {
                        accountBasic.reduceMaterialPredisPrice = utils.accAdd(accountBasic.reduceMaterialPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                        accountBasic.reduceMaterialPredisManagePrice = utils.accAdd(accountBasic.reduceMaterialPredisManagePrice, v.managePrice);
                        accountBasic.reduceMaterialManagePrice = utils.accAdd(accountBasic.reduceMaterialManagePrice, managePrice);// 减项管理费
                        accountBasic.reduceMaterialCalPrice = utils.accAdd(accountBasic.reduceMaterialCalPrice, v.calPrice);
                        accountBasic.reduceMaterialUncalPrice = utils.accAdd(accountBasic.reduceMaterialUncalPrice, v.uncalPrice);
                        accountBasic.reduceMaterialTotalPrice = utils.accAdd(accountBasic.reduceMaterialTotalPrice, totalPrice);
                        accountBasic.reduceMaterialDisPrice = utils.accAdd(accountBasic.reduceMaterialDisPrice, v.disPrice);
                        accountBasic.reduceMaterialUndisPrice = utils.accAdd(accountBasic.reduceMaterialUndisPrice, v.undisPrice);
                        accountBasic.reduceMaterialPredisTaxPrice = utils.accAdd(accountBasic.reduceMaterialPredisTaxPrice, v.taxPrice);
                        accountBasic.reduceMaterialTaxPrice = utils.accAdd(accountBasic.reduceMaterialTaxPrice, taxPrice);// 减项税金
                        accountBasic.reduceMaterialDone = utils.accAdd(accountBasic.reduceMaterialDone, v.status == constant.quotation().addreduce.STATUS_PAYED_INT || v.status == constant.quotation().addreduce.STATUS_CONFIRMED_INT ? v.total : 0);
                        accountBasic.reduceMaterialOwing = utils.accAdd(accountBasic.reduceMaterialOwing, v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT ? v.total : 0);

                        accountBasic.materialAsDifference = utils.accAdd(accountBasic.materialAsDifference, accountBasic.reduceMaterialDisPrice * (accountBasic.dd / 10) + accountBasic.reduceMaterialUndisPrice + Math.round(accountBasic.reduceMaterialManagePrice) - Math.round(accountBasic.reduceMaterialTotalPrice));

                    }
                }

                $.each(v.addReduceItems, function(i, aritem){

                    if(v.type == 0 && aritem.discount == 1){
                        accountBasic.addDisCalPrice = utils.accAdd(accountBasic.addDisCalPrice, utils.accMul(aritem.unitPrice, aritem.num));
                    }else if(v.type == 0 && aritem.discount == 0){
                        accountBasic.addUndisCalPrice = utils.accAdd(accountBasic.addUndisCalPrice, utils.accMul(aritem.unitPrice, aritem.num));
                    }else if(v.type == 1 && aritem.discount == 1){
                        accountBasic.reduceDisCalPrice = utils.accAdd(accountBasic.reduceDisCalPrice, utils.accMul(aritem.unitPrice, aritem.num));
                    }else if(v.type == 1 && aritem.discount == 0){
                        accountBasic.reduceUndisCalPrice = utils.accAdd(accountBasic.reduceUndisCalPrice, utils.accMul(aritem.unitPrice, aritem.num));
                    }
                })

            });

            addReduceItems(1);

        }, null, false);
    }

    function addReduceItems(type) {

        if (type == 1) {
            decorationDetail.addReduceItems.addFoldFrontTotal.html(Math.round(accountBasic.addPredisPrice));
            decorationDetail.addReduceItems.addManagePrice.html(Math.round(accountBasic.addManagePrice));
            decorationDetail.addReduceItems.addMatch.html(Math.round(accountBasic.addCalPrice));
            decorationDetail.addReduceItems.addUncalPrice.html(Math.round(accountBasic.addUncalPrice));
            decorationDetail.addReduceItems.addDone.html(Math.round(accountBasic.addDone));
            decorationDetail.addReduceItems.addOwing.html(Math.round(accountBasic.addOwing));
            decorationDetail.addReduceItems.addTaxPrice.html(Math.round(accountBasic.addTaxPrice));
            decorationDetail.addReduceItems.addTotal.html(Math.round(accountBasic.addTotalPrice));

            decorationDetail.addReduceItems.minusFoldFrontTotal.html(Math.round(accountBasic.reducePredisPrice));
            decorationDetail.addReduceItems.minusManagePrice.html(Math.round(accountBasic.reduceManagePrice));
            decorationDetail.addReduceItems.minusMatch.html(Math.round(accountBasic.reduceCalPrice));
            decorationDetail.addReduceItems.minusUncalPrice.html(Math.round(accountBasic.reduceUncalPrice));
            decorationDetail.addReduceItems.minusDone.html(Math.round(accountBasic.reduceDone));
            decorationDetail.addReduceItems.minusOwing.html(Math.round(accountBasic.reduceOwing));
            decorationDetail.addReduceItems.minusTaxPrice.html(Math.round(accountBasic.reduceTaxPrice));
            decorationDetail.addReduceItems.minusTotal.html(Math.round(accountBasic.reduceTotalPrice));

            decorationDetail.addReduceItems.asDifference.html(Math.round(accountBasic.asDifference));
        } else if (type == 2) {
            decorationDetail.addReduceItems.addFoldFrontTotal.html(Math.round(accountBasic.addConstructionPredisPrice));
            decorationDetail.addReduceItems.addManagePrice.html(Math.round(accountBasic.addConstructionManagePrice));
            decorationDetail.addReduceItems.addMatch.html(Math.round(accountBasic.addConstructionCalPrice));
            decorationDetail.addReduceItems.addUncalPrice.html(Math.round(accountBasic.addConstructionUncalPrice));
            decorationDetail.addReduceItems.addDone.html(Math.round(accountBasic.addConstructionDone));
            decorationDetail.addReduceItems.addOwing.html(Math.round(accountBasic.addConstructionOwing));
            decorationDetail.addReduceItems.addTaxPrice.html(Math.round(accountBasic.addConstructionTaxPrice));
            decorationDetail.addReduceItems.addTotal.html(Math.round(accountBasic.addConstructionTotalPrice));

            decorationDetail.addReduceItems.minusFoldFrontTotal.html(Math.round(accountBasic.reduceConstructionPredisPrice));
            decorationDetail.addReduceItems.minusManagePrice.html(Math.round(accountBasic.reduceConstructionManagePrice));
            decorationDetail.addReduceItems.minusMatch.html(Math.round(accountBasic.reduceConstructionCalPrice));
            decorationDetail.addReduceItems.minusUncalPrice.html(Math.round(accountBasic.reduceConstructionUncalPrice));
            decorationDetail.addReduceItems.minusDone.html(Math.round(accountBasic.reduceConstructionDone));
            decorationDetail.addReduceItems.minusOwing.html(Math.round(accountBasic.reduceConstructionOwing));
            decorationDetail.addReduceItems.minusTaxPrice.html(Math.round(accountBasic.reduceConstructionTaxPrice));
            decorationDetail.addReduceItems.minusTotal.html(Math.round(accountBasic.reduceConstructionTotalPrice));

            decorationDetail.addReduceItems.asDifference.html(Math.round(accountBasic.constructionAsDifference));
        } else if (type == 3) {
            decorationDetail.addReduceItems.addFoldFrontTotal.html(Math.round(accountBasic.addMaterialPredisPrice));
            decorationDetail.addReduceItems.addManagePrice.html(Math.round(accountBasic.addMaterialManagePrice));
            decorationDetail.addReduceItems.addMatch.html(Math.round(accountBasic.addMaterialCalPrice));
            decorationDetail.addReduceItems.addUncalPrice.html(Math.round(accountBasic.addMaterialUncalPrice));
            decorationDetail.addReduceItems.addDone.html(Math.round(accountBasic.addMaterialDone));
            decorationDetail.addReduceItems.addOwing.html(Math.round(accountBasic.addMaterialOwing));
            decorationDetail.addReduceItems.addTaxPrice.html(Math.round(accountBasic.addMaterialTaxPrice));
            decorationDetail.addReduceItems.addTotal.html(Math.round(accountBasic.addMaterialTotalPrice));

            decorationDetail.addReduceItems.minusFoldFrontTotal.html(Math.round(accountBasic.reduceMaterialPredisPrice));
            decorationDetail.addReduceItems.minusManagePrice.html(Math.round(accountBasic.reduceMaterialManagePrice));
            decorationDetail.addReduceItems.minusMatch.html(Math.round(accountBasic.reduceMaterialCalPrice));
            decorationDetail.addReduceItems.minusUncalPrice.html(Math.round(accountBasic.reduceMaterialUncalPrice));
            decorationDetail.addReduceItems.minusDone.html(Math.round(accountBasic.reduceMaterialDone));
            decorationDetail.addReduceItems.minusOwing.html(Math.round(accountBasic.reduceMaterialOwing));
            decorationDetail.addReduceItems.minusTaxPrice.html(Math.round(accountBasic.reduceMaterialTaxPrice));
            decorationDetail.addReduceItems.minusTotal.html(Math.round(accountBasic.reduceMaterialTotalPrice));

            decorationDetail.addReduceItems.asDifference.html(Math.round(accountBasic.materialAsDifference));
        }
    }

    function accountSuper() {

        // 决算直接费(算配比) = 打折总额 + 不打折总额 + 车运费 + 增项配比总额 - 减项配比总额
        //
        // 决算直接费(非配比) = 打折总额 + 不打折总额 + 车运费
        //
        // 决算折前总额(算配比) = 打折总额 + 不打折总额 + 车运费 + 管理费 + 增项配比总额 - 减项配比总额 + 增项管理费 - 减项管理费 + 增项税金 - 减项税金
        //
        // 决算折前总额(非配比) = 打折总额 + 不打折总额 + 车运费 + 管理费
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
        // 差额(算配比) = 决算合同额 + 决算服务费 - 合同实收 - 已收服务费 - 增项实收 + 减项实收 + 增项非配比总额 - 优惠 - 满送 - 返现
        //
        // 差额(非配比) = 决算合同额 + 决算服务费 - 合同实收 - 已收服务费 - 优惠 - 满送 - 返现
        //
        // 金额差 = 实收额 - 决算主材额
        //
        // 超配比 = (实收额 - 决算主材额) / 决算主材额

        var contartval = 0, _ = 0, service = 0, sub = 0, direct = 0, beforeTotal = 0, management = 0, taxment = 0, materialAccount = 0, _managePrice = 0, _taxPrice = 0;

        var flag = accountBasic.cal ? 1 : 0;

        if (decorationDetail.items.calDiscountPrice.val()) {
            accountBasic.dd = decorationDetail.items.calDiscountPrice.val();
            accountBasic.discount = decorationDetail.items.calDiscountPrice.val();
        }

        beforeTotal = accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag;
        console.log(beforeTotal + "=" + accountBasic.undisPrice + "+" + accountBasic.disPrice + "+" + accountBasic.trafficPrice + "+" + (accountBasic.addCalPrice * flag) + "-" + (accountBasic.reduceCalPrice * flag));

        _managePrice = accountBasic.managePrice * (accountBasic.manageDiscount == 1 ? accountBasic.discount / 10 : 1);

        if (accountBasic.taxDiscount == 1) {
            _taxPrice = accountBasic.taxPrice * (accountBasic.manageDiscount == 1 ? accountBasic.discount / 10 : 1);
        }

        if (accountBasic.taxDiscount == 2) {
            _taxPrice = accountBasic.taxPrice * (accountBasic.manageDiscount == 1 ? accountBasic.discount / 10 : 1);
        }
        
        if ([0, 1].indexOf(accountBasic.type) != -1) { // 半包/整装
            contartval = (accountBasic.disPrice + accountBasic.addDisCalPrice * flag - accountBasic.reduceDisCalPrice * flag) * accountBasic.dd / 10 + (accountBasic.undisPrice + accountBasic.addUndisCalPrice * flag - accountBasic.reduceUndisCalPrice * flag) + accountBasic.trafficPrice + _managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag + _taxPrice + accountBasic.addTaxPrice * flag - accountBasic.reduceTaxPrice * flag;
            console.log(contartval + "=(" + accountBasic.disPrice + "+" + accountBasic.addDisCalPrice * flag + "-" + accountBasic.reduceDisCalPrice * flag + ")*(" + accountBasic.dd + "/" + 10 + ")+(" + accountBasic.undisPrice + "+" + accountBasic.addUndisCalPrice * flag + "-" + accountBasic.reduceUndisCalPrice * flag + ")+" + accountBasic.trafficPrice + "+" + _managePrice + "+" + (accountBasic.addManagePrice * flag) + "-" + (accountBasic.reduceManagePrice * flag) + "+" + _taxPrice + "+" + (accountBasic.addTaxPrice * flag) + "-" + (accountBasic.reduceTaxPrice * flag));
        }

        if (accountBasic.type == 2) { // 满减
            contartval = (beforeTotal - (beforeTotal) % accountBasic.base) * (accountBasic.discount / 10) + (beforeTotal) % accountBasic.base + _managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag + _taxPrice + accountBasic.addTaxPrice * flag - accountBasic.reduceTaxPrice * flag;
            console.log(contartval + "=(" + (beforeTotal + "-" + (beforeTotal) + "%" + accountBasic.base) + ")*(" + (accountBasic.discount + "/" + 10) + ")+(" + (beforeTotal) + "%" + accountBasic.base + ")+" + _managePrice + "+" + (accountBasic.addManagePrice * flag) + "-" + (accountBasic.reduceManagePrice * flag) + "+" + _taxPrice + "+" + (accountBasic.addTaxPrice * flag) + "-" + (accountBasic.reduceTaxPrice * flag));
        }

        service = (beforeTotal + accountBasic.managePrice + accountBasic.addPredisManagePrice * flag - accountBasic.reducePredisManagePrice * flag + accountBasic.taxPrice + accountBasic.addPredisTaxPrice * flag - accountBasic.reducePredisTaxPrice * flag) * accountBasic.material * accountBasic.service;

        direct = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag + accountBasic.managePrice + accountBasic.addPredisManagePrice * flag - accountBasic.reducePredisManagePrice * flag + accountBasic.taxPrice + accountBasic.addPredisTaxPrice * flag - accountBasic.reducePredisTaxPrice * flag;

        management = _managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;

        taxment = Math.round(_taxPrice + accountBasic.addTaxPrice * flag - accountBasic.reduceTaxPrice * flag);

        sub = contartval + service - accountBasic.factPrice - accountBasic.servicePaidup - accountBasic.addTotalPrice * flag + accountBasic.reduceTotalPrice * flag + accountBasic.addUncalPrice * flag - decorationDetail.items.preferences.val() - decorationDetail.items.internalCoupon.val() - decorationDetail.items.fulldel.val() - decorationDetail.items.cashback.val();

        console.log(sub + "=" + contartval + "+" + service + "-" + accountBasic.factPrice + "-" + accountBasic.servicePaidup + "-" + (accountBasic.addTotalPrice * flag) + "+" + (accountBasic.reduceTotalPrice * flag) + "+" + (accountBasic.addUncalPrice * flag) + "-" + decorationDetail.items.preferences.val() + "-" + decorationDetail.items.internalCoupon.val() + "-" + decorationDetail.items.fulldel.val() + "-" + decorationDetail.items.cashback.val());

        materialAccount = direct * accountBasic.material;

        accountBasic.direct = Math.round(direct);
        accountBasic.beforeTotal = Math.round(beforeTotal);
        accountBasic.management = Math.round(management);
        accountBasic.taxment = Math.round(taxment);
        accountBasic.flowerRatio = utils.changeThrDecimal(accountBasic.materialTotal / accountBasic.direct);
        accountBasic.flowerOalesRatio = utils.changeThrDecimal(utils.accDiv(utils.accAdd(accountBasic.oalesScaleTotal, accountBasic.materialTotal), accountBasic.direct));
        accountBasic.directC = Math.round(accountBasic.foldFrontTotal + accountBasic.addFoldFrontTotal - accountBasic.minusFoldFrontTotal + accountBasic.addPredisPrice - accountBasic.reducePredisPrice);
        accountBasic.fullPayment = Math.round(accountBasic.signFactOwing + accountBasic.addOwing - accountBasic.reduceOwing);

        // 当已有决算记录或手动维护决算主材额时,使用输入值而非计算值
        if (accountBasic.daid || accountBasic.materialAccountManual) {
            accountBasic.materialAccount = parseFloat(decorationDetail.accountItems.materialAccount.val()) || accountBasic.materialAccount || 0;
        } else {
            accountBasic.materialAccount = Math.round(materialAccount);
        }

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
        // 当已有决算记录或手动维护决算主材额时,不覆盖输入值
        if (!accountBasic.daid && !accountBasic.materialAccountManual) {
            decorationDetail.accountItems.materialAccount.val(accountBasic.materialAccount);
        }

        decorationDetail.accountItems.flowerRatio.html(accountBasic.flowerRatio);
        decorationDetail.accountItems.flowerOalesRatio.html(accountBasic.flowerOalesRatio);
        decorationDetail.accountItems.difference.html(accountBasic.difference);
        decorationDetail.accountItems.superRatio.html(accountBasic.superRatio);
        decorationDetail.accountItems.taxPrice.html(Math.round(taxment));

        decorationDetail.accountItems.directC.html(accountBasic.directC);
        decorationDetail.accountItems.fullPayment.html(accountBasic.fullPayment);
    }

    // ==================== 决算计算器功能 ====================

    // 打开决算计算器弹窗
    decorationDetail.btns.accountCalculatorBtn.on("click", function() {
        openAccountCalculator();
    });

    // 决算计算器相关变量
    var accountCalculatorData = {
        selectedScheme: null,  // 选中的方案
        busitypes: [],          // 业务类型列表
        schemes: []            // 计算方案列表
    };

    /**
     * 打开决算计算器弹窗
     */
    function openAccountCalculator() {
        // 初始化顶部字段值
        accountCalculatorData.selectedScheme = null;
        $('#calcMaterialAccount').val(decorationDetail.accountItems.materialAccount.val() || accountBasic.materialAccount || 0);
        $('#calcPreferences').val(decorationDetail.items.preferences.val() || 0);
        $('#calcInternalCoupon').val(decorationDetail.items.internalCoupon.val() || 0);
        $('#calcFulldel').val(decorationDetail.items.fulldel.val() || 0);
        $('#calcCashback').val(decorationDetail.items.cashback.val() || 0);

        // 清空方案列表
        $('#accountSchemesList').empty();

        // 加载业务类型数据
        loadBusitypesAndCalculate();

        // 显示弹窗
        decorationDetail.modal.accountCalculatorModal.modal('show');
    }

    /**
     * 加载业务类型数据并计算方案
     */
    function loadBusitypesAndCalculate() {
        // 使用已加载的 decorationMatchings 数据
        accountCalculatorData.busitypes = accountBasic.machingType || [];

        // 生成计算方案（每个业务类型生成两条：配比/非配比）
        generateAccountSchemes();
    }

    /**
     * 生成决算计算方案
     */
    function generateAccountSchemes() {
        accountCalculatorData.schemes = [];

        $.each(accountCalculatorData.busitypes, function(i, busitype) {
            // 为每个业务类型生成两个方案：配比计算和非配比计算
            accountCalculatorData.schemes.push({
                schemeId: 'scheme_' + i + '_1',
                busitype: busitype,
                calcType: 1,  // 1 = 算配比
                calcTypeName: '算配比',
                results: {}
            });

            accountCalculatorData.schemes.push({
                schemeId: 'scheme_' + i + '_0',
                busitype: busitype,
                calcType: 0,  // 0 = 不算配比
                calcTypeName: '不算配比',
                results: {}
            });
        });

        // 计算所有方案的结果
        calculateAllSchemes();

        // 渲染方案列表
        renderSchemeList();
    }

    /**
     * 计算所有方案的结果
     */
    function calculateAllSchemes() {
        var materialAccount = parseFloat($('#calcMaterialAccount').val()) || 0;
        var preferences = parseFloat($('#calcPreferences').val()) || 0;
        var internalCoupon = parseFloat($('#calcInternalCoupon').val()) || 0;
        var fulldel = parseFloat($('#calcFulldel').val()) || 0;
        var cashback = parseFloat($('#calcCashback').val()) || 0;

        $.each(accountCalculatorData.schemes, function(i, scheme) {
            scheme.results = calculateSchemeResult(scheme, materialAccount, preferences, internalCoupon, fulldel, cashback);
        });
    }

    /**
     * 计算单个方案的结果（参考 accountSuper 函数逻辑）
     */
    function calculateSchemeResult(scheme, materialAccount, preferences, internalCoupon, fulldel, cashback) {
        var busitype = scheme.busitype;
        // 字段映射：decorationMatchings 使用 typeness，计算逻辑使用 type
        busitype.type = busitype.typeness;

        var flag = scheme.calcType;  // 1 = 算配比, 0 = 不算配比

        var contartval = 0, service = 0, sub = 0, direct = 0, beforeTotal = 0, management = 0, taxment = 0;

        // 使用业务类型的配置，添加默认值保护
        var discount = busitype.discount || accountBasic.discount || 10;
        var base = busitype.base || accountBasic.base || 1;
        var material = busitype.matching || accountBasic.material || 0;
        var serviceRate = busitype.serviceRate || accountBasic.service || 0;
        var managePrice = accountBasic.managePrice || 0;
        var taxPrice = accountBasic.taxPrice || 0;

        console.log('初始值 - discount:', discount, 'base:', base, 'material:', material, 'serviceRate:', serviceRate);

        // 确保数值是数字类型
        discount = parseFloat(discount) || 10;
        base = parseFloat(base) || 1;
        material = parseFloat(material) || 0;
        serviceRate = parseFloat(serviceRate) || 0;
        managePrice = parseFloat(managePrice) || 0;
        taxPrice = parseFloat(taxPrice) || 0;

        console.log('转换后 - discount:', discount, 'base:', base, 'material:', material, 'serviceRate:', serviceRate);

        var _managePrice = managePrice * (busitype.manageDiscount == 1 ? discount / 10 : 1);
        var _taxPrice = taxPrice;

        if (busitype.taxDiscount == 1) {
            _taxPrice = taxPrice * (busitype.manageDiscount == 1 ? discount / 10 : 1);
        }

        if (busitype.taxDiscount == 2) {
            _taxPrice = taxPrice * (busitype.manageDiscount == 1 ? discount / 10 : 1);
        }

        beforeTotal = (accountBasic.undisPrice || 0) + (accountBasic.disPrice || 0) + (accountBasic.trafficPrice || 0) + (accountBasic.addCalPrice || 0) * flag - (accountBasic.reduceCalPrice || 0) * flag;

        // 根据类型计算合同额
        if ([0, 1].indexOf(busitype.type) != -1) {
            contartval = (accountBasic.disPrice + (accountBasic.addDisCalPrice || 0) * flag - (accountBasic.reduceDisCalPrice || 0) * flag) * discount / 10
                       + (accountBasic.undisPrice + (accountBasic.addUndisCalPrice || 0) * flag - (accountBasic.reduceUndisCalPrice || 0) * flag)
                       + accountBasic.trafficPrice + _managePrice + (accountBasic.addManagePrice || 0) * flag - (accountBasic.reduceManagePrice || 0) * flag
                       + _taxPrice + (accountBasic.addTaxPrice || 0) * flag - (accountBasic.reduceTaxPrice || 0) * flag;
        }

        if (busitype.type == 2) {
            contartval = (beforeTotal - beforeTotal % base) * (discount / 10) + beforeTotal % base + _managePrice
                       + (accountBasic.addManagePrice || 0) * flag - (accountBasic.reduceManagePrice || 0) * flag
                       + _taxPrice + (accountBasic.addTaxPrice || 0) * flag - (accountBasic.reduceTaxPrice || 0) * flag;
        }

        service = (beforeTotal + managePrice + (accountBasic.addPredisManagePrice || 0) * flag - (accountBasic.reducePredisManagePrice || 0) * flag + taxPrice + (accountBasic.addPredisTaxPrice || 0) * flag - (accountBasic.reducePredisTaxPrice || 0) * flag) * material * serviceRate;

        direct = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice + (accountBasic.addCalPrice || 0) * flag - (accountBasic.reduceCalPrice || 0) * flag
               + managePrice + (accountBasic.addPredisManagePrice || 0) * flag - (accountBasic.reducePredisManagePrice || 0) * flag
               + taxPrice + (accountBasic.addPredisTaxPrice || 0) * flag - (accountBasic.reducePredisTaxPrice || 0) * flag;

        management = _managePrice + (accountBasic.addManagePrice || 0) * flag - (accountBasic.reduceManagePrice || 0) * flag;
        taxment = Math.round(_taxPrice + (accountBasic.addTaxPrice || 0) * flag - (accountBasic.reduceTaxPrice || 0) * flag);

        sub = contartval + service - (accountBasic.factPrice || 0) - (accountBasic.servicePaidup || 0) - (accountBasic.addTotalPrice || 0) * flag + (accountBasic.reduceTotalPrice || 0) * flag + (accountBasic.addUncalPrice || 0) * flag - preferences - internalCoupon - fulldel - cashback;

        console.log('计算结果 - contartval:', contartval, 'service:', service, 'direct:', direct, 'sub:', sub);

        var accountForehead = Math.round(contartval);
        var accountServicePrice = Math.round(service);
        var balanceSum = Math.round(sub);
        var flowerRatio = 0;
        if (direct > 0) {
            flowerRatio = utils.changeThrDecimal((accountBasic.materialTotal || 0) / direct);
        }
        var difference = Math.round((accountBasic.materialFactPrice || 0) - materialAccount);
        var superRatio = 0;
        if (materialAccount > 0) {
            superRatio = utils.changeThrDecimal(difference / materialAccount);
        }

        return {
            discount: discount || 0,  // 添加折扣字段
            direct: Math.round(direct) || 0,
            beforeTotal: Math.round(beforeTotal) || 0,
            management: Math.round(management) || 0,
            taxPrice: Math.round(taxment) || 0,
            accountForehead: accountForehead || 0,
            accountServicePrice: accountServicePrice || 0,
            balanceSum: balanceSum || 0,
            flowerRatio: flowerRatio || 0,
            difference: difference || 0,
            superRatio: superRatio || 0,
            fullPayment: Math.round((accountBasic.signFactOwing || 0) + (accountBasic.addOwing || 0) - (accountBasic.reduceOwing || 0)) || 0
        };
    }

    /**
     * 渲染方案列表（使用独立样式类）
     */
    function renderSchemeList() {
        if (accountCalculatorData.schemes.length === 0) {
            $('#accountSchemesList').html('<div class="col-md-12 text-center">暂无方案数据</div>');
            return;
        }

        // 定义要显示的字段及其列类型
        var fields = [
            { key: 'discount', label: '折扣', type: 'normal' },
            { key: 'direct', label: '决算折前总额', type: 'normal' },
            { key: 'beforeTotal', label: '决算直接费', type: 'normal' },
            { key: 'management', label: '决算管理费', type: 'normal' },
            { key: 'taxPrice', label: '税金', type: 'normal' },
            { key: 'accountForehead', label: '决算合同额', type: 'normal' },
            { key: 'accountServicePrice', label: '决算服务费', type: 'normal' },
            { key: 'balanceSum', label: '差额', type: 'normal' },
            { key: 'flowerRatio', label: '决算实花配比', type: 'normal' },
            { key: 'superRatio', label: '超配比', type: 'normal' },
            { key: 'fullPayment', label: '应补款', type: 'normal' }
        ];

        var container = $('<div></div>').addClass('col-md-12');
        var calculator = $('<div></div>').addClass('account-calc-container').appendTo(container);

        // 第一行：表头（字段名称）
        var headerRow = $('<div></div>').addClass('account-calc-row account-calc-header');
        headerRow.append(createCalculatorCell('业务类型', 'wide', true));
        headerRow.append(createCalculatorCell('是否计入配比', 'small', true));
        $.each(fields, function(i, field) {
            headerRow.append(createCalculatorCell(field.label, field.type, true));
        });
        headerRow.append(createCalculatorCell('操作', 'action', true));
        headerRow.appendTo(calculator);

        // 每个方案一行
        $.each(accountCalculatorData.schemes, function(i, scheme) {
            var r = scheme.results;
            var busitype = scheme.busitype;

            var dataRow = $('<div></div>').addClass('account-calc-row').attr('data-scheme-id', scheme.schemeId);

            // 业务类型列
            dataRow.append(createCalculatorCell(busitype.name, 'wide', false));

            // 是否计入配比列
            var matchingText = scheme.calcType == 1 ? '是' : '否';
            dataRow.append(createCalculatorCell(matchingText, 'small', false));

            // 各字段数据列
            $.each(fields, function(j, field) {
                dataRow.append(createCalculatorCell(r[field.key], field.type, false));
            });

            // 操作按钮列
            var actionCell = $('<div></div>').addClass('account-calc-cell action');
            var btn = $('<button></button>').addClass('btn btn-xs btn-primary selectSchemeBtn')
                .attr('data-scheme-id', scheme.schemeId)
                .text('确认');
            actionCell.append(btn);
            dataRow.append(actionCell);

            dataRow.appendTo(calculator);
        });

        $('#accountSchemesList').html(container);

        // 绑定方案选择/确认事件
        $('.account-calc-row[data-scheme-id]').on('click', function() {
            chooseScheme($(this).data('scheme-id'));
        });

        $('.selectSchemeBtn').on('click', function(e) {
            e.stopPropagation();
            var schemeId = $(this).data('scheme-id');
            chooseScheme(schemeId);
            selectScheme(schemeId);
        });
    }

    /**
     * 创建计算器单元格（使用独立样式类）
     */
    function createCalculatorCell(text, type, isHeader) {
        var cell = $('<div></div>').addClass('account-calc-cell ' + type);

        if (isHeader) {
            // 表头：居中对齐
            cell.html(text);
        } else {
            // 数据行
            if (type === 'normal') {
                // 数值列：右对齐，蓝色
                cell.html('<span class="blue">' + text + '</span>').css('text-align', 'right');
            } else if (type === 'wide') {
                // 业务类型：左对齐
                cell.html(text);
            } else {
                // 其他列：居中对齐
                cell.html(text);
            }
        }

        return cell;
    }

    /**
     * 标记选中方案
     */
    function chooseScheme(schemeId) {

        var scheme = null;

        $.each(accountCalculatorData.schemes, function(i, s) {
            if (s.schemeId === schemeId) {
                scheme = s;
                return false;
            }
        });

        if (!scheme) return null;

        accountCalculatorData.selectedScheme = scheme;
        $('.account-calc-row[data-scheme-id]').removeClass('alert-info');
        $('.account-calc-row[data-scheme-id="' + schemeId + '"]').addClass('alert-info');

        return scheme;
    }

    /**
     * 选中方案并应用
     */
    function selectScheme(schemeId) {
        var scheme = chooseScheme(schemeId);

        if (!scheme) return;

        // 回填数据到功能模块
        var busitype = scheme.busitype;
        // 字段映射：decorationMatchings 使用 typeness，匹配逻辑使用 type
        busitype.type = busitype.typeness;
        busitype.dbid = busitype.dmid;

        // 简化匹配逻辑：直接遍历所有 machingType 找到第一个
        var config = null;
        var matchedBy = '';

        // 优先通过 dbid 匹配
        if (busitype.dbid) {
            $.each(accountBasic.machingType, function(i, v) {
                if (busitype.dbid == v.dmid) {
                    config = v;
                    matchedBy = 'dbid';
                    return false;
                }
            });
        }

        // 如果没找到，通过 type 匹配 typeness
        if (!config && busitype.type !== undefined) {
            $.each(accountBasic.machingType, function(i, v) {
                if (busitype.type == v.typeness) {
                    config = v;
                    matchedBy = 'type';
                    return false;
                }
            });
        }

        // 如果还是没找到，使用第一个 machingType
        if (!config && accountBasic.machingType.length > 0) {
            config = accountBasic.machingType[0];
            matchedBy = 'first';
        }

        if (!config || !config.dmid) {
            com.showAlert(com.warning, '未找到有效的配置信息');
            return;
        }

        // 设置下拉框并触发 change 事件
        decorationDetail.items.otherPaymentType.val(config.dmid);
        decorationDetail.items.otherPaymentType.trigger('change');

        // 更新增减配比状态
        if (scheme.calcType == 1) {
            decorationDetail.items.matching.prop('checked', true);
        } else {
            decorationDetail.items.matching.prop('checked', false);
        }
        accountBasic.cal = scheme.calcType == 1;

        // 填充只读字段
        if (busitype.name) {
            decorationDetail.items.discountName.val(busitype.name);
            accountBasic.name = busitype.name;
        }

        if (busitype.typeness !== undefined) {
            var accountTypeText = decorationDetail.orderType[busitype.typeness] || '';
            decorationDetail.items.accountType.val(accountTypeText);
        }

        // 更新优惠字段
        accountBasic.materialAccount = parseFloat($('#calcMaterialAccount').val()) || 0;
        accountBasic.materialAccountManual = true;
        decorationDetail.accountItems.materialAccount.val(accountBasic.materialAccount);
        decorationDetail.items.preferences.val($('#calcPreferences').val() || 0);
        decorationDetail.items.internalCoupon.val($('#calcInternalCoupon').val() || 0);
        decorationDetail.items.fulldel.val($('#calcFulldel').val() || 0);
        decorationDetail.items.cashback.val($('#calcCashback').val() || 0);

        // 重新计算
        accountSuper();

        // 启用按钮
        decorationDetail.btns.updateBtn.removeAttr("disabled");
        decorationDetail.btns.submission.removeAttr("disabled");

        // 关闭弹窗
        decorationDetail.modal.accountCalculatorModal.modal('hide');

        com.showAlert(com.info, '已选择方案：' + busitype.name + ' - ' + scheme.calcTypeName);
    }

    // 重新计算全部按钮事件
    $('#recalculateAllBtn').on('click', function() {
        calculateAllSchemes();
        renderSchemeList();
    });

    // 确认选择按钮事件（底部按钮）
    $('#selectSchemeBtn').on('click', function() {
        if (accountCalculatorData.selectedScheme) {
            selectScheme(accountCalculatorData.selectedScheme.schemeId);
        } else {
            com.showAlert(com.warning, '请先选择一个方案');
        }
    });

});