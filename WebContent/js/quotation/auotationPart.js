/**
 * 决算报价(auotationPart) —— 报价+扩展+增减 按功能区归组的决算明细弹窗
 *
 * 零后台: 全部数据走既有查询接口, 归档走既有 decorationaccount / decorationaccountitem 双写
 * 计算公式与决算计算页 decoration4account.js accountSuper() 逐条对齐(方案见 docs/01-方案设计/决算报价方案设计.md)
 *
 * 口径(与决算计算页一致):
 * - 增减单决算口径: paytype=0(现金) 且 status∈{2,3}(已付款/已确认), 其余单在明细中标"不计入"
 * - 扩展单仅展示 + 计入"折前总额全(directC)", 不进决算主公式
 * - 金额单位: api tranargs 已换算为元, 页面内部一律 utils.acc*
 */
jQuery(function($) {

    var auotation = {

        orderId: params.decoration.orderId || params.quotation.orderId,

        quotation: null,
        decoration: null,
        protation: null,

        functionAreas: [],
        addReduces: [],
        extensions: [],

        machingType: [],

        materialTotal: 0,
        materialCoupon: 0,

        basic: {
            daid: 0,
            name: "",
            type: -1,
            typeness: -1,

            dd: 0,
            discount: 0,
            base: 0,

            undisPrice: 0,
            disPrice: 0,
            trafficPrice: 0,
            managePrice: 0,
            taxPrice: 0,
            taxRate: 0,
            taxDiscount: 0,
            manageDiscount: 0,
            quoManageRate: 0,
            totalPrice: 0,
            foldFrontTotal: 0,
            foldFrontFee: 0,
            managePredisPrice: 0,
            taxPredisPrice: 0,

            material: 0,
            service: 0,
            materialRatio: 0,
            servicePrice: 0,
            servicePaidup: 0,
            materialFactPrice: 0,

            contractPrice: 0,
            couponCut: 0,
            factPrice: 0,

            signFactDone: 0,
            signFactOwing: 0,

            oalesTotal: 0,
            oalesScaleTotal: 0,

            contractAdvance: 0,
            projectAdvance: 0,
            materialAdvance: 0,
            zhenglinAdvance: 0,

            // 扩展汇总(决算计算页 extensionItems 同款)
            addFoldFrontTotal: 0,
            minusFoldFrontTotal: 0,
            addExtManagePrice: 0,
            minusExtManagePrice: 0,
            addExtTotal: 0,
            minusExtTotal: 0,

            // 增减汇总(决算计算页 queryAddReduce 同款, 全量族)
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

            // 决算配置(来自决算记录)
            materialAccount: 0,
            materialAccountManual: false,
            cal: false,

            preferences: 0,
            internalCoupon: 0,
            fulldel: 0,
            cashback: 0,

            // 决算输出
            direct: 0,
            beforeTotal: 0,
            management: 0,
            taxment: 0,
            accountForehead: 0,
            accountServicePrice: 0,
            flowerRatio: 0,
            flowerOalesRatio: 0,
            difference: 0,
            superRatio: 0,
            balanceSum: 0,
            directC: 0,
            fullPayment: 0
        },

        items: {
            orderNo: com.focusPage("#auOrderNo", "#auotationPartContent"),
            address: com.focusPage("#auAddress", "#auotationPartContent"),
            versionName: com.focusPage("#auVersionName", "#auotationPartContent"),
            buildArea: com.focusPage("#auBuildArea", "#auotationPartContent"),
            orderDiscount: com.focusPage("#auOrderDiscount", "#auotationPartContent"),
            typenessName: com.focusPage("#auTypenessName", "#auotationPartContent"),
            quotePrice: com.focusPage("#auQuotePrice", "#auotationPartContent"),
            preferPrice: com.focusPage("#auPreferPrice", "#auotationPartContent"),
            accountStatus: com.focusPage("#auAccountStatus", "#auotationPartContent"),
            accountName: com.focusPage("#auAccountName", "#auotationPartContent"),

            beforeTotal: com.focusPage("#auBeforeTotal", "#auotationPartContent"),
            direct: com.focusPage("#auDirect", "#auotationPartContent"),
            accountForehead: com.focusPage("#auAccountForehead", "#auotationPartContent"),
            accountServicePrice: com.focusPage("#auAccountServicePrice", "#auotationPartContent"),
            materialAccountShow: com.focusPage("#auMaterialAccountShow", "#auotationPartContent"),
            difference: com.focusPage("#auDifference", "#auotationPartContent"),
            balanceSum: com.focusPage("#auBalanceSum", "#auotationPartContent"),
            fullPayment: com.focusPage("#auFullPayment", "#auotationPartContent"),
            directC: com.focusPage("#auDirectC", "#auotationPartContent"),

            summaryZone: com.focusPage("#auSummaryZone", "#auotationPartContent"),

            foldFrontTotalPrice: com.focusPage("#auFoldFrontTotalPrice", "#auotationPartContent"),
            foldFrontTotal: com.focusPage("#auFoldFrontTotal", "#auotationPartContent"),
            foldFrontFee: com.focusPage("#auFoldFrontFee", "#auotationPartContent"),
            disPrice: com.focusPage("#auDisPrice", "#auotationPartContent"),
            undisPrice: com.focusPage("#auUndisPrice", "#auotationPartContent"),
            trafficPrice: com.focusPage("#auTrafficPrice", "#auotationPartContent"),
            managePrice: com.focusPage("#auManagePrice", "#auotationPartContent"),
            taxPriceB: com.focusPage("#auTaxPriceB", "#auotationPartContent"),

            addExtensionItemFoldFrontTotal: com.focusPage("#auAddExtensionItemFoldFrontTotal", "#auotationPartContent"),
            addExtensionItemManagePrice: com.focusPage("#auAddExtensionItemManagePrice", "#auotationPartContent"),
            addExtensionItemTotalPrice: com.focusPage("#auAddExtensionItemTotalPrice", "#auotationPartContent"),
            minusExtensionItemFoldFrontTotal: com.focusPage("#auMinusExtensionItemFoldFrontTotal", "#auotationPartContent"),
            minusExtensionItemManagePrice: com.focusPage("#auMinusExtensionItemManagePrice", "#auotationPartContent"),
            minusExtensionItemTotalPrice: com.focusPage("#auMinusExtensionItemTotalPrice", "#auotationPartContent"),

            management: com.focusPage("#auManagement", "#auotationPartContent"),
            taxPriceA: com.focusPage("#auTaxPriceA", "#auotationPartContent"),
            flowerRatio: com.focusPage("#auFlowerRatio", "#auotationPartContent"),
            flowerOalesRatio: com.focusPage("#auFlowerOalesRatio", "#auotationPartContent"),
            superRatio: com.focusPage("#auSuperRatio", "#auotationPartContent"),

            addFoldFrontTotal: com.focusPage("#auAddFoldFrontTotal", "#auotationPartContent"),
            addManagePrice: com.focusPage("#auAddManagePrice", "#auotationPartContent"),
            addMatch: com.focusPage("#auAddMatch", "#auotationPartContent"),
            addUncalPrice: com.focusPage("#auAddUncalPrice", "#auotationPartContent"),
            addTaxPrice: com.focusPage("#auAddTaxPrice", "#auotationPartContent"),
            addTotal: com.focusPage("#auAddTotal", "#auotationPartContent"),
            addDone: com.focusPage("#auAddDone", "#auotationPartContent"),
            addOwing: com.focusPage("#auAddOwing", "#auotationPartContent"),
            minusFoldFrontTotal: com.focusPage("#auMinusFoldFrontTotal", "#auotationPartContent"),
            minusManagePrice: com.focusPage("#auMinusManagePrice", "#auotationPartContent"),
            minusMatch: com.focusPage("#auMinusMatch", "#auotationPartContent"),
            minusUncalPrice: com.focusPage("#auMinusUncalPrice", "#auotationPartContent"),
            minusTaxPrice: com.focusPage("#auMinusTaxPrice", "#auotationPartContent"),
            minusTotal: com.focusPage("#auMinusTotal", "#auotationPartContent"),
            minusDone: com.focusPage("#auMinusDone", "#auotationPartContent"),
            minusOwing: com.focusPage("#auMinusOwing", "#auotationPartContent"),
            asDifference: com.focusPage("#auAsDifference", "#auotationPartContent"),

            calDiscountPrice: com.focusPage("#auCalDiscountPrice", "#auotationPartContent"),
            matching: com.focusPage("#auMatching", "#auotationPartContent"),
            otherPaymentType: com.focusPage("#auOtherPaymentType", "#auotationPartContent"),
            preferences: com.focusPage("#auPreferences", "#auotationPartContent"),
            internalCoupon: com.focusPage("#auInternalCoupon", "#auotationPartContent"),
            fulldel: com.focusPage("#auFulldel", "#auotationPartContent"),
            cashback: com.focusPage("#auCashback", "#auotationPartContent"),
            materialAccount: com.focusPage("#auMaterialAccount", "#auotationPartContent"),
            comment: com.focusPage("#auComment", "#auotationPartContent"),

            functionAreaList: com.focusPage("#auFunctionAreaList", "#auotationPartContent"),

            addReduceAccountModal: com.focusPage("#auAddReduceAccountModal", "#auotationPartContent"),
            arAccountName: com.focusPage("#auArAccountName", "#auotationPartContent"),
            arAccountDiscount: com.focusPage("#auArAccountDiscount", "#auotationPartContent"),
            arAccountManageDiscount: com.focusPage("#auArAccountManageDiscount", "#auotationPartContent"),
            arAccountTaxDiscount: com.focusPage("#auArAccountTaxDiscount", "#auotationPartContent"),

            calcTraceZone: com.focusPage("#auCalcTraceZone", "#auotationPartContent"),
            calcTraceList: com.focusPage("#auCalcTraceList", "#auotationPartContent")
        },

        btns: {
            updateBtn: com.focusPage("#auUpdateBtn", "#auotationPartContent"),
            refreshBtn: com.focusPage("#auRefreshBtn", "#auotationPartContent"),
            calculateBtn: com.focusPage("#auCalculateBtn", "#auotationPartContent"),
            summaryToggleBtn: com.focusPage("#auSummaryToggleBtn", "#auotationPartContent"),
            arSaveAccountBtn: com.focusPage("#auArSaveAccountBtn", "#auotationPartContent"),
            calcTraceToggleBtn: com.focusPage("#auCalcTraceToggleBtn", "#auotationPartContent")
        }
    };

    initLoad();

    function initLoad() {

        resetBasic();

        if (!auotation.orderId) {
            com.showAlert(com.warning, "缺少装修单信息, 请从决算计算页进入");
            return false;
        }

        // 预付款
        com.post(api.payment.queryAdvancePaymentByOrderId, {
            "advancePayment.decoration.orderId": auotation.orderId
        }, function(res) {

            auotation.basic.contractAdvance = res.balanceAdvance || 0;
            auotation.basic.projectAdvance = res.projectAdvance || 0;
            auotation.basic.materialAdvance = res.materialAdvance || 0;
            auotation.basic.zhenglinAdvance = res.zaterialAdvance || 0;
        }, null, false);

        // 预签(仅信息条展示)
        com.post(api.quotation.queryProtationForDefaultByOrderId, {
            "protation.orderId": auotation.orderId
        }, function(res) {

            auotation.protation = res.protation || {};

            auotation.items.quotePrice.html(com.checkNull(auotation.protation.quotePrice, 0));
            auotation.items.preferPrice.html(com.checkNull(auotation.protation.preferPrice, 0));
        }, null, false);

        // 报价(决算公式基五项)
        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": auotation.orderId
        }, function(res) {

            auotation.quotation = res.quotation;

            var basic = auotation.basic;

            basic.undisPrice = auotation.quotation.undisPrice;
            basic.disPrice = auotation.quotation.disPrice;
            basic.trafficPrice = auotation.quotation.trafficPrice;
            basic.managePrice = auotation.quotation.managePrice;
            basic.taxPrice = auotation.quotation.taxPrice;
            basic.taxRate = auotation.quotation.taxRate;
            basic.taxDiscount = auotation.quotation.taxDiscount;
            basic.discount = auotation.quotation.discount;
            basic.quoManageRate = auotation.quotation.manageRate;
            basic.totalPrice = auotation.quotation.totalPrice;

            // 折前总价/折前直接费(决算计算页 L426-427 同款)
            basic.foldFrontTotal = Math.round(basic.undisPrice + basic.disPrice + basic.trafficPrice + basic.managePrice + basic.taxPrice);
            basic.foldFrontFee = Math.round(basic.undisPrice + basic.disPrice + basic.trafficPrice);

            // 管理费/税金折算(决算计算页 L440-448 同款)
            var _managePrice = auotation.quotation.managePrice * (auotation.quotation.manageDiscount == 1 ? auotation.quotation.discount / 10 : 1);
            var _taxPrice = auotation.quotation.taxPrice;

            if (auotation.quotation.taxDiscount == 1) {
                _taxPrice = auotation.quotation.taxPrice * (auotation.quotation.manageDiscount == 1 ? auotation.quotation.discount / 10 : 1);
            }

            basic.managePredisPrice = utils.changeThrDecimal(_managePrice);
            basic.taxPredisPrice = utils.changeThrDecimal(_taxPrice);

            auotation.items.versionName.html(com.checkNull(auotation.quotation.version.name, "-"));
        }, null, false);

        if (!auotation.quotation || !auotation.quotation.qid) {
            com.showAlert(com.warning, "默认报价不存在");
            return false;
        }

        // 报价功能区+报价项(返回自带 items)
        com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {
            "quotation.qid": auotation.quotation.qid
        }, function(res) {

            auotation.functionAreas = res.quotationFunctionAreas || [];
        }, null, false);

        // 扩展单(仅展示 + 折前总额全)
        com.post(api.quotation.queryExtensionByOrderId, {
            "extension.orderId": auotation.orderId
        }, function(res) {

            auotation.extensions = res.extensions;
        }, null, false);

        // 装修单(折扣/合同额/优惠券/合同实收)
        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": auotation.orderId
        }, function(res) {

            auotation.decoration = res.decoration;

            var basic = auotation.basic;

            basic.dd = auotation.decoration.discount;
            basic.contractPrice = auotation.decoration.orderTotalPrice;
            basic.couponCut = auotation.decoration.couponCut;
            basic.factPrice = auotation.decoration.factPrice;

            auotation.items.orderNo.html(auotation.orderId);

            var _house = auotation.decoration.house || {};
            var _village = _house.village ? _house.village.name : "-";

            auotation.items.address.html(com.checkNull(_village, "-") + " " + com.checkNull(_house.houseNumber, ""));
            auotation.items.buildArea.html(com.checkNull(_house.buildArea, 0));
            auotation.items.orderDiscount.html(com.checkNull(auotation.decoration.discount, 0));
            auotation.items.typenessName.html(constant.decoration().decoration.typeness.keys[auotation.decoration.typeness] || "-");

            auotation.items.preferences.val(auotation.decoration.couponCut);
        }, null, false);

        // 服务费/配比(半包/满减, 与决算计算页 L567-622 同款)
        if (auotation.decoration.type == 0) {

            com.post(api.decoration.queryDecorationMidpack, {
                "decorationMidpack.decoration.orderId": auotation.orderId
            }, function(res) {

                var midpack = res.decorationMidpack;

                if (!midpack || !midpack.dmid)
                    return false;

                auotation.basic.servicePrice = midpack.servicePrice;
                auotation.basic.servicePaidup = midpack.servicePaidup;
                auotation.basic.materialRatio = 0;
            }, null, false);
        }

        if (auotation.decoration.type == 1) {

            auotation.basic.servicePrice = 0;
            auotation.basic.servicePaidup = 0;
            auotation.basic.materialRatio = 0;
        }

        if (auotation.decoration.type == 2) {

            com.post(api.decoration.queryDecorationHolonomy, {
                "decorationHolonomy.decoration.orderId": auotation.orderId
            }, function(res) {

                var decorationHolonomy = res.decorationHolonomy;

                if (!decorationHolonomy || !decorationHolonomy.dhid)
                    return false;

                auotation.basic.servicePrice = decorationHolonomy.servicePrice;
                auotation.basic.materialRatio = decorationHolonomy.materialPrice;
                auotation.basic.servicePaidup = decorationHolonomy.servicePaidup;
                auotation.basic.taxDiscount = decorationHolonomy.taxDiscount;
            }, null, false);
        }

        // 合同已收/未收
        com.post(api.payment.queryDecorationPaymentByOrderId, {
            "decorationPayment.decoration.orderId": auotation.orderId,
            "decorationPayment.oneType": 0
        }, function(res) {

            $.each(res.decorationPayments, function(i, v) {

                if (v.twoType == 1 && v.paymentStatus == 0) {
                    auotation.basic.signFactOwing = utils.accAdd(auotation.basic.signFactOwing, v.referMoney);
                } else if (v.twoType == 1 && v.paymentStatus != 0) {
                    auotation.basic.signFactDone = utils.accAdd(auotation.basic.signFactDone, v.referMoney);
                }
            });
        }, null, false);

        // 外销
        com.post(api.sales.queryOalesByOrderId, {
            "oales.decoration.orderId": auotation.orderId
        }, function(res) {

            $.each(res.oaleses, function(i, v) {

                // 驳回/废单不计入外销总额(决算计算页 L655 同款)
                if (v.status == constant.sales().oales.STATUS_REJECT_INT || v.status == constant.sales().oales.STATUS_INVALID_INI) return;

                auotation.basic.oalesTotal = utils.accAdd(auotation.basic.oalesTotal, v.total);
            });
        }, null, false);

        // 仅汇总需配比(isScale=0)的外销单金额
        com.post(api.sales.amountOales, {
            "oales.decoration.orderId": auotation.orderId,
            "oales.isScale": 0
        }, function(res) {

            auotation.basic.oalesScaleTotal = res.amount || 0;
        }, null, false);

        // 主材实收(合计口径与 decorationUtils.initMaterial 一致: 主材收款+销售收款, type∈{2,3,8}为收, {4,5,6}为退)
        var _materialTotal = 0, _materialCoupon = 0;

        com.post(api.payment.queryMaterialPaymentByOrderId, {
            "materialPayment.material.orderId": auotation.orderId
        }, function(res) {

            $.each(res.materialPayments || [], function(i, v) {

                if (v.paymentStatus == 0)
                    return true;

                var _refer = [2, 3, 8].indexOf(v.paymentType) != -1 ? v.referMoney : -v.referMoney;
                var _coupon = [2, 3, 8].indexOf(v.paymentType) != -1 ? (v.coupon || 0) : -(v.coupon || 0);

                _materialTotal = utils.changeThrDecimal(utils.accAdd(_materialTotal, _refer));
                _materialCoupon = utils.changeThrDecimal(utils.accAdd(_materialCoupon, _coupon));
            });
        }, null, false);

        com.post(api.payment.querySalesPaymentByOrderId, {
            "salesPayment.sales.orderId": auotation.orderId
        }, function(res) {

            $.each(res.salesPayments || [], function(i, v) {

                if (v.status == constant.payment().salesPayment.STATUS_INIT_INT)
                    return true;

                // 国补单未结算不参与合计(initMaterial L500-502 同款)
                if (v.sales.type == 1 && v.sales.balanceStatus != 3)
                    return true;

                var salesReceipt = v.salesReceipt || {};
                var _refer = [2, 3, 8].indexOf(v.type) != -1 ? v.referMoney : -v.referMoney;
                var _coupon = [2, 3, 8].indexOf(v.type) != -1 ? (salesReceipt.coupon || 0) : -(salesReceipt.coupon || 0);

                _materialTotal = utils.changeThrDecimal(utils.accAdd(_materialTotal, _refer));
                _materialCoupon = utils.changeThrDecimal(utils.accAdd(_materialCoupon, _coupon));
            });
        }, null, false);

        auotation.materialTotal = _materialTotal;
        auotation.materialCoupon = _materialCoupon;
        auotation.basic.materialFactPrice = utils.accSub(_materialTotal, _materialCoupon);

        // 扩展汇总
        sumExtension();

        // 增减汇总(决算口径)
        queryAddReduce();

        // 配比方案库
        loadDecorationMatching();

        // 决算记录
        com.post(api.decoration.queryDecorationAccount, {
            "decorationAccount.orderId": auotation.orderId
        }, function(res) {

            auotation.account = res.decorationAccount;

            if (!applyAccount(auotation.account)) {

                // 未建档: 只读展示 + 重算预览, 保存置灰
                auotation.items.accountStatus.html("未建档").removeClass("blue").addClass("red");
                auotation.items.accountName.html("-");
                auotation.btns.updateBtn.attr("disabled", "disabled");

                accountSuper();
            }
        }, null, false);

        renderSummary();
        renderFunctionAreas();

        return true;
    }

    function resetBasic() {

        auotation.basic.daid = 0;
        auotation.basic.name = "";
        auotation.basic.type = -1;
        auotation.basic.typeness = -1;
        auotation.basic.dd = 0;
        auotation.basic.discount = 0;
        auotation.basic.base = 0;
        auotation.basic.taxDiscount = 0;
        auotation.basic.manageDiscount = 0;
        auotation.basic.material = 0;
        auotation.basic.service = 0;
        auotation.basic.materialRatio = 0;
        auotation.basic.servicePrice = 0;
        auotation.basic.servicePaidup = 0;
        auotation.basic.materialFactPrice = 0;
        auotation.basic.contractPrice = 0;
        auotation.basic.couponCut = 0;
        auotation.basic.factPrice = 0;
        auotation.basic.signFactDone = 0;
        auotation.basic.signFactOwing = 0;
        auotation.basic.oalesTotal = 0;
        auotation.basic.oalesScaleTotal = 0;
        auotation.basic.contractAdvance = 0;
        auotation.basic.projectAdvance = 0;
        auotation.basic.materialAdvance = 0;
        auotation.basic.zhenglinAdvance = 0;
        auotation.basic.addFoldFrontTotal = 0;
        auotation.basic.minusFoldFrontTotal = 0;
        auotation.basic.addExtManagePrice = 0;
        auotation.basic.minusExtManagePrice = 0;
        auotation.basic.addExtTotal = 0;
        auotation.basic.minusExtTotal = 0;
        auotation.basic.materialAccount = 0;
        auotation.basic.materialAccountManual = false;
        auotation.basic.cal = false;
        auotation.basic.preferences = 0;
        auotation.basic.internalCoupon = 0;
        auotation.basic.fulldel = 0;
        auotation.basic.cashback = 0;

        auotation.account = null;
        auotation.materialTotal = 0;
        auotation.materialCoupon = 0;

        // 页面级增减计入配比选择(arId -> true/false, 默认计入; 仅重算模拟不写库)
        auotation.arFlagMap = {};

        auotation.items.calDiscountPrice.val("").removeAttr("readonly");
        auotation.items.matching.prop("checked", false);
        auotation.items.preferences.val(0);
        auotation.items.internalCoupon.val(0);
        auotation.items.fulldel.val(0);
        auotation.items.cashback.val(0);
        auotation.items.materialAccount.val(0);
        auotation.items.comment.val("");
        auotation.items.otherPaymentType.val("");
    }

    /**
     * 扩展汇总 —— 移植 decoration4account.js queryExtensionByOrderId 块(L456-537), 逐行对齐
     */
    function sumExtension() {

        var extensions = auotation.extensions;
        var basic = auotation.basic;

        var addFoldFrontTotal = 0, minusFoldFrontTotal = 0, addManagePrice = 0, minusManagePrice = 0, addTotal = 0, minusTotal = 0;

        if (extensions != null && extensions.length != 0) {

            for (var i = 0; i < extensions.length; i++) {

                var extension = extensions[i];
                var extensionItems = extension.extensionItems;

                if (extensionItems == null || extensionItems.length == 0)
                    continue;

                for (var j = 0; j < extensionItems.length; j++) {

                    var extensionItem = extensionItems[j];

                    var _unitPrice = parseFloat(extensionItem.unitPrice);
                    var _num = parseFloat(extensionItem.num);
                    var _discount = parseInt(extensionItem.discount);
                    var _total = utils.accMul(_unitPrice, _num);

                    if ([0, 1, 5].indexOf(extensionItem.type) != -1) {
                        addFoldFrontTotal = utils.accAdd(addFoldFrontTotal, _discount == constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT ? _total : 0);
                        addManagePrice = utils.accAdd(addManagePrice, utils.accMul(_total, basic.quoManageRate));
                        addTotal = utils.accAdd(addTotal, utils.accMul(_discount == constant.quotation().extensionItem.DISCOUMNT_DISCOUMNT_INT ? utils.accDiv(basic.discount, 10) : 1, _total));

                    } else if ([2, 3, 4].indexOf(extensionItem.type) != -1) {
                        minusFoldFrontTotal = utils.accAdd(minusFoldFrontTotal, _discount == constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT ? _total : 0);
                        minusManagePrice = utils.accAdd(minusManagePrice, utils.accMul(_total, basic.quoManageRate));
                        minusTotal = utils.accAdd(minusTotal, utils.accMul(_discount == constant.quotation().extensionItem.DISCOUMNT_DISCOUMNT_INT ? utils.accDiv(basic.discount, 10) : 1, _total));
                    }
                }

                if (extension.type == 0) {

                    if (extension.manageDiscount == constant.quotation().extension.MANAGEDISCOUNT_DISCOUNT_INT) {
                        addManagePrice = utils.changeTwoDecimal(utils.accMul(utils.accDiv(basic.discount, 10), addManagePrice));
                    } else {
                        addManagePrice = utils.changeTwoDecimal(addManagePrice);
                    }

                    if (extension.managePrice != 0 && basic.quoManageRate != 0) {
                        addTotal = utils.changeThrDecimal(utils.accAdd(addTotal, addManagePrice));
                    } else {
                        addTotal = utils.changeThrDecimal(addTotal);
                        addManagePrice = 0;
                    }

                } else if (extension.type == 1) {

                    if (extension.manageDiscount == constant.quotation().extension.MANAGEDISCOUNT_DISCOUNT_INT) {
                        minusManagePrice = utils.changeTwoDecimal(utils.accMul(utils.accDiv(basic.discount, 10), minusManagePrice));
                    } else {
                        minusManagePrice = utils.changeTwoDecimal(minusManagePrice);
                    }

                    if (extension.managePrice != 0 && basic.quoManageRate != 0) {
                        minusTotal = utils.changeThrDecimal(utils.accAdd(minusTotal, minusManagePrice));
                    } else {
                        minusTotal = utils.changeThrDecimal(minusTotal);
                        minusManagePrice = 0;
                    }
                }
            }
        }

        basic.addFoldFrontTotal = addFoldFrontTotal;
        basic.minusFoldFrontTotal = minusFoldFrontTotal;
        basic.addExtManagePrice = addManagePrice;
        basic.minusExtManagePrice = minusManagePrice;
        basic.addExtTotal = addTotal;
        basic.minusExtTotal = minusTotal;
    }

    /**
     * 增减汇总 —— 移植 decoration4account.js queryAddReduce(L1179-1338)
     * 决算口径: paytype=0 且 status∈{2,3}; accountDiscount 回退链; item 级折扣归属
     */
    function queryAddReduce() {

        var basic = auotation.basic;

        var addPredisPrice = 0, addPredisManagePrice = 0, addManagePrice = 0, addCalPrice = 0, addUncalPrice = 0, addTotalPrice = 0, addDone = 0, addOwing = 0, addDisPrice = 0, addUndisPrice = 0, addPredisTaxPrice = 0, addTaxPrice = 0,
            reducePredisPrice = 0, reducePredisManagePrice = 0, reduceManagePrice = 0, reduceCalPrice = 0, reduceUncalPrice = 0, reduceTotalPrice = 0, reduceDone = 0, reduceOwing = 0, reduceDisPrice = 0, reduceUndisPrice = 0, reducePredisTaxPrice = 0, reduceTaxPrice = 0, asDifference = 0,
            addDisCalPrice = 0, addUndisCalPrice = 0, reduceDisCalPrice = 0, reduceUndisCalPrice = 0;

        com.post(api.quotation.queryAddReduceByOrderId, {
            "addReduce.orderId": auotation.orderId
        }, function(res) {

            var addReduces = res.addReduces;

            auotation.addReduces = addReduces;

            $.each(addReduces, function(i, v) {

                if ([0].indexOf(v.paytype) == -1) // 付款类型验证
                    return true;

                if ([2, 3].indexOf(v.status) == -1) // 状态验证
                    return true;

                var accountDiscount = v.accountDiscount == 0 ? (v.discount == 0 ? basic.discount : v.discount) : v.accountDiscount;
                var accountManageDiscount = v.accountManageDiscount == 0 ? (v.manageDiscount == 0 ? basic.manageDiscount : v.manageDiscount) : v.accountManageDiscount;
                var accountTaxDiscount = v.accountTaxDiscount == 0 ? (v.taxDiscount == 0 ? basic.taxDiscount : v.taxDiscount) : v.accountTaxDiscount;

                var managePrice = accountManageDiscount == 1 ? utils.accMul(v.managePrice, utils.accDiv(accountDiscount, 10)) : v.managePrice;
                var taxPrice = accountTaxDiscount == 1 ? utils.accMul(v.taxPrice, utils.accDiv(accountDiscount, 10)) : v.taxPrice;
                var totalPrice = utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(v.calPrice, utils.accDiv(accountDiscount, 10)), v.uncalPrice), managePrice), taxPrice);

                // 页面级"计入配比"选择(拍板 2026-11-14: 仅页面重算模拟, 不修改任何数据, 刷新/重开恢复默认计入)
                var _inFlag = auotation.arFlagMap[v.arId] !== false;

                if (v.type == 0) { // 增项

                    // 已收/未收是收付事实, 不受页面配比选择影响
                    addDone = utils.accAdd(addDone, v.status == constant.quotation().addreduce.STATUS_PAYED_INT || v.status == constant.quotation().addreduce.STATUS_CONFIRMED_INT ? v.total : 0);
                    addOwing = utils.accAdd(addOwing, v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT ? v.total : 0);

                    if (_inFlag) {

                        addPredisPrice = utils.accAdd(addPredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                        addPredisManagePrice = utils.accAdd(addPredisManagePrice, v.managePrice);
                        addManagePrice = utils.accAdd(addManagePrice, managePrice);
                        addCalPrice = utils.accAdd(addCalPrice, v.calPrice);
                        addUncalPrice = utils.accAdd(addUncalPrice, v.uncalPrice);
                        addTotalPrice = utils.accAdd(addTotalPrice, v.total);
                        addDisPrice = utils.accAdd(addDisPrice, v.disPrice);
                        addUndisPrice = utils.accAdd(addUndisPrice, v.undisPrice);
                        addPredisTaxPrice = utils.accAdd(addPredisTaxPrice, v.taxPrice);
                        addTaxPrice = utils.accAdd(addTaxPrice, taxPrice);

                        asDifference = utils.accAdd(asDifference, addDisPrice * (basic.dd / 10) + addUndisPrice + Math.round(addManagePrice) - Math.round(addTotalPrice));
                    }

                } else if (v.type == 1) { // 减项

                    reduceDone = utils.accAdd(reduceDone, v.status == constant.quotation().addreduce.STATUS_PAYED_INT || v.status == constant.quotation().addreduce.STATUS_CONFIRMED_INT ? v.total : 0);
                    reduceOwing = utils.accAdd(reduceOwing, v.status == constant.quotation().addreduce.STATUS_UNSUBMIT_INT || v.status == constant.quotation().addreduce.STATUS_SUBMIT_INT ? v.total : 0);

                    if (_inFlag) {

                        reducePredisPrice = utils.accAdd(reducePredisPrice, utils.accAdd(v.undisPrice, utils.accAdd(v.disPrice, utils.accAdd(v.managePrice, v.taxPrice))));
                        reducePredisManagePrice = utils.accAdd(reducePredisManagePrice, v.managePrice);
                        reduceManagePrice = utils.accAdd(reduceManagePrice, managePrice);
                        reduceCalPrice = utils.accAdd(reduceCalPrice, v.calPrice);
                        reduceUncalPrice = utils.accAdd(reduceUncalPrice, v.uncalPrice);
                        reduceTotalPrice = utils.accAdd(reduceTotalPrice, v.total);
                        reduceDisPrice = utils.accAdd(reduceDisPrice, v.disPrice);
                        reduceUndisPrice = utils.accAdd(reduceUndisPrice, v.undisPrice);
                        reducePredisTaxPrice = utils.accAdd(reducePredisTaxPrice, v.taxPrice);
                        reduceTaxPrice = utils.accAdd(reduceTaxPrice, taxPrice);

                        asDifference = utils.accAdd(asDifference, reduceDisPrice * (basic.dd / 10) + reduceUndisPrice + Math.round(reduceManagePrice) - Math.round(reduceTotalPrice));
                    }
                }

                // item 级折扣归属(打折/不打折配比, 不计配比的单不进池)
                $.each(v.addReduceItems, function(i, aritem) {

                    if (!_inFlag)
                        return true;

                    if (v.type == 0 && aritem.discount == 1) {
                        addDisCalPrice = utils.accAdd(addDisCalPrice, utils.accMul(aritem.unitPrice, aritem.num));
                    } else if (v.type == 0 && aritem.discount == 0) {
                        addUndisCalPrice = utils.accAdd(addUndisCalPrice, utils.accMul(aritem.unitPrice, aritem.num));
                    } else if (v.type == 1 && aritem.discount == 1) {
                        reduceDisCalPrice = utils.accAdd(reduceDisCalPrice, utils.accMul(aritem.unitPrice, aritem.num));
                    } else if (v.type == 1 && aritem.discount == 0) {
                        reduceUndisCalPrice = utils.accAdd(reduceUndisCalPrice, utils.accMul(aritem.unitPrice, aritem.num));
                    }
                });
            });

            basic.addPredisPrice = addPredisPrice;
            basic.addPredisManagePrice = addPredisManagePrice;
            basic.addManagePrice = addManagePrice;
            basic.addCalPrice = addCalPrice;
            basic.addUncalPrice = addUncalPrice;
            basic.addDisCalPrice = addDisCalPrice;
            basic.addUndisCalPrice = addUndisCalPrice;
            basic.addTotalPrice = addTotalPrice;
            basic.addDone = addDone;
            basic.addOwing = addOwing;
            basic.addDisPrice = addDisPrice;
            basic.addUndisPrice = addUndisPrice;
            basic.addPredisTaxPrice = addPredisTaxPrice;
            basic.addTaxPrice = addTaxPrice;

            basic.reducePredisPrice = reducePredisPrice;
            basic.reducePredisManagePrice = reducePredisManagePrice;
            basic.reduceManagePrice = reduceManagePrice;
            basic.reduceCalPrice = reduceCalPrice;
            basic.reduceUncalPrice = reduceUncalPrice;
            basic.reduceDisCalPrice = reduceDisCalPrice;
            basic.reduceUndisCalPrice = reduceUndisCalPrice;
            basic.reduceTotalPrice = reduceTotalPrice;
            basic.reduceDone = reduceDone;
            basic.reduceOwing = reduceOwing;
            basic.reduceDisPrice = reduceDisPrice;
            basic.reduceUndisPrice = reduceUndisPrice;
            basic.reducePredisTaxPrice = reducePredisTaxPrice;
            basic.reduceTaxPrice = reduceTaxPrice;
            basic.asDifference = asDifference;

        }, null, false);
    }

    /**
     * 配比方案库(vision&8 过滤, 与决算计算页 L684-696 同款)
     */
    function loadDecorationMatching() {

        var typenessParams = {};

        $.each(constant.decoration().decoration.typeness.datas, function(i, v) {
            typenessParams["typeness[" + i + "]"] = v.key;
        });

        com.post(api.data.queryDecorationMatching, typenessParams, function(res) {

            $.each(res.decorationMatchings, function(i, v) {

                if ((v['vision'] & 8) != 8)
                    return;

                auotation.machingType.push(v);
            });

            auotation.items.otherPaymentType.bindData(auotation.machingType, "dmid", "name", true);
        }, null, false);
    }

    /**
     * 决算金额计算 —— 移植 decoration4account.js accountSuper(L1405-1531), 公式逐条对齐
     */
    function accountSuper() {

        var basic = auotation.basic;

        var contartval = 0, service = 0, sub = 0, direct = 0, beforeTotal = 0, management = 0, taxment = 0, materialAccount = 0, _managePrice = 0, _taxPrice = 0;

        var flag = basic.cal ? 1 : 0;

        if (auotation.items.calDiscountPrice.val()) {
            basic.dd = auotation.items.calDiscountPrice.val();
            basic.discount = auotation.items.calDiscountPrice.val();
        }

        // 决算直接费 = 打折总额 + 不打折总额 + 车运费 + 增项配比总额×flag - 减项配比总额×flag
        beforeTotal = parseFloat(basic.undisPrice) + parseFloat(basic.disPrice) + parseFloat(basic.trafficPrice) + parseFloat(basic.addCalPrice) * flag - parseFloat(basic.reduceCalPrice) * flag;

        _managePrice = basic.managePrice * (basic.manageDiscount == 1 ? basic.discount / 10 : 1);

        if (basic.taxDiscount == 1) {
            _taxPrice = basic.taxPrice * (basic.manageDiscount == 1 ? basic.discount / 10 : 1);
        }

        if (basic.taxDiscount == 2) {
            _taxPrice = basic.taxPrice * (basic.manageDiscount == 1 ? basic.discount / 10 : 1);
        }

        // 公式分支按装修单类型判断(拍板 2026-11-12: 不走决算记录 type): {0,1}=折扣式, 2=满减基数取模式
        var _decorationType = auotation.decoration ? auotation.decoration.type : -1;

        if ([0, 1].indexOf(_decorationType) != -1) { // 半包/整装
            contartval = (basic.disPrice + basic.addDisCalPrice * flag - basic.reduceDisCalPrice * flag) * basic.dd / 10
                + (basic.undisPrice + basic.addUndisCalPrice * flag - basic.reduceUndisCalPrice * flag)
                + basic.trafficPrice + _managePrice + basic.addManagePrice * flag - basic.reduceManagePrice * flag
                + _taxPrice + basic.addTaxPrice * flag - basic.reduceTaxPrice * flag;
        }

        if (_decorationType == 2 && basic.base > 0) { // 满减(折扣基数须已维护, 未维护时合同额按0展示)
            contartval = (beforeTotal - (beforeTotal) % basic.base) * (basic.discount / 10) + (beforeTotal) % basic.base
                + _managePrice + basic.addManagePrice * flag - basic.reduceManagePrice * flag
                + _taxPrice + basic.addTaxPrice * flag - basic.reduceTaxPrice * flag;
        }

        service = (beforeTotal + basic.managePrice + basic.addPredisManagePrice * flag - basic.reducePredisManagePrice * flag
            + basic.taxPrice + basic.addPredisTaxPrice * flag - basic.reducePredisTaxPrice * flag) * basic.material * basic.service;

        direct = basic.disPrice + basic.undisPrice + basic.trafficPrice + basic.addCalPrice * flag - basic.reduceCalPrice * flag
            + basic.managePrice + basic.addPredisManagePrice * flag - basic.reducePredisManagePrice * flag
            + basic.taxPrice + basic.addPredisTaxPrice * flag - basic.reducePredisTaxPrice * flag;

        management = _managePrice + basic.addManagePrice * flag - basic.reduceManagePrice * flag;

        taxment = Math.round(_taxPrice + basic.addTaxPrice * flag - basic.reduceTaxPrice * flag);

        sub = contartval + service - basic.factPrice - basic.servicePaidup
            - basic.addTotalPrice * flag + basic.reduceTotalPrice * flag + basic.addUncalPrice * flag
            - (auotation.items.preferences.val() ? auotation.items.preferences.val() : 0)
            - (auotation.items.internalCoupon.val() ? auotation.items.internalCoupon.val() : 0)
            - (auotation.items.fulldel.val() ? auotation.items.fulldel.val() : 0)
            - (auotation.items.cashback.val() ? auotation.items.cashback.val() : 0);

        materialAccount = direct * basic.material;

        basic.direct = Math.round(direct);
        basic.beforeTotal = Math.round(beforeTotal);
        basic.management = Math.round(management);
        basic.taxment = Math.round(taxment);
        basic.flowerRatio = direct == 0 ? 0 : utils.changeThrDecimal(auotation.materialTotal / direct);
        basic.flowerOalesRatio = direct == 0 ? 0 : utils.changeThrDecimal(utils.accDiv(utils.accAdd(basic.oalesScaleTotal, auotation.materialTotal), direct));
        basic.directC = Math.round(basic.foldFrontTotal + basic.addFoldFrontTotal - basic.minusFoldFrontTotal + basic.addPredisPrice - basic.reducePredisPrice);
        basic.fullPayment = Math.round(basic.signFactOwing + basic.addOwing - basic.reduceOwing);

        // 已有决算记录或手动维护决算主材额时, 使用输入值而非计算值(L1493-1497 同款)
        if (basic.daid || basic.materialAccountManual) {
            basic.materialAccount = parseFloat(auotation.items.materialAccount.val()) || basic.materialAccount || 0;
        } else {
            basic.materialAccount = Math.round(materialAccount);
        }

        basic.accountForehead = Math.round(contartval);
        basic.accountServicePrice = Math.round(service);
        basic.balanceSum = Math.round(sub);

        basic.difference = Math.round(basic.materialFactPrice - basic.materialAccount);
        basic.superRatio = basic.materialAccount == null || basic.materialAccount == 0 ? 0 : utils.changeThrDecimal(basic.difference / basic.materialAccount);

        basic.preferences = auotation.items.preferences.val() ? auotation.items.preferences.val() : 0;
        basic.internalCoupon = auotation.items.internalCoupon.val() ? auotation.items.internalCoupon.val() : 0;
        basic.fulldel = auotation.items.fulldel.val() ? auotation.items.fulldel.val() : 0;
        basic.cashback = auotation.items.cashback.val() ? auotation.items.cashback.val() : 0;

        // 计算过程推导串(拍板 2026-11-12: 折叠面板展示公式+参与数值, 纯展示, 不参与落库)
        buildCalcTrace(flag, _managePrice, _taxPrice, beforeTotal);

        renderAccountOutputs();
    }

    function fmtMoney(v) {
        return Math.round(parseFloat(v) || 0);
    }

    /**
     * 计算过程面板 —— 每个决算指标一行: 公式(代入实际数值) | 结果 | 落库字段
     * 差值计算按拍板体现主材金额与优惠值的参与: 差额行含优惠四项, 金额差行含主材金额
     */
    function buildCalcTrace(flag, _managePrice, _taxPrice, beforeTotal) {

        var basic = auotation.basic;
        var trace = [];

        var _branchType = auotation.decoration ? auotation.decoration.type : -1;
        var _branchName = (_branchType == 2 ? "满减式" : "折扣式") + "(装修单类型" + (_branchType == -1 ? "-" : _branchType) + (_branchType == 2 ? ", 基数" + fmtMoney(basic.base) : "") + ")";

        trace.push({
            name: "决算直接费",
            formula: "打折项 " + fmtMoney(basic.disPrice) + " + 不打折项 " + fmtMoney(basic.undisPrice) + " + 车运费 " + fmtMoney(basic.trafficPrice)
                + " + 增项配比 " + fmtMoney(basic.addCalPrice) + "×flag(" + flag + ") − 减项配比 " + fmtMoney(basic.reduceCalPrice) + "×flag(" + flag + ")",
            result: basic.beforeTotal,
            field: "projectBase"
        });

        trace.push({
            name: "决算折前总额",
            formula: "打折项 " + fmtMoney(basic.disPrice) + " + 不打折项 " + fmtMoney(basic.undisPrice) + " + 车运费 " + fmtMoney(basic.trafficPrice)
                + " + 增项配比 " + fmtMoney(basic.addCalPrice) + "×flag(" + flag + ") − 减项配比 " + fmtMoney(basic.reduceCalPrice) + "×flag(" + flag + ")"
                + " + 管理费 " + fmtMoney(basic.managePrice) + " + 增项管理费 " + fmtMoney(basic.addPredisManagePrice) + "×flag(" + flag + ") − 减项管理费 " + fmtMoney(basic.reducePredisManagePrice) + "×flag(" + flag + ")"
                + " + 税金 " + fmtMoney(basic.taxPrice) + " + 增项税金 " + fmtMoney(basic.addPredisTaxPrice) + "×flag(" + flag + ") − 减项税金 " + fmtMoney(basic.reducePredisTaxPrice) + "×flag(" + flag + ")",
            result: basic.direct,
            field: "projectPrice(保存时)"
        });

        trace.push({
            name: "决算管理费",
            formula: "管理费折算 " + fmtMoney(_managePrice) + "(管理费 " + fmtMoney(basic.managePrice) + (basic.manageDiscount == 1 ? "×折扣/10" : ", 不参与折扣") + ")"
                + " + 增项管理费 " + fmtMoney(basic.addManagePrice) + "×flag(" + flag + ") − 减项管理费 " + fmtMoney(basic.reduceManagePrice) + "×flag(" + flag + ")",
            result: basic.management,
            field: "—(仅展示)"
        });

        trace.push({
            name: "决算税金",
            formula: "税金折算 " + fmtMoney(_taxPrice) + "(税金 " + fmtMoney(basic.taxPrice) + (basic.taxDiscount == 1 || basic.taxDiscount == 2 ? "×折扣/10" : ", 不参与折扣") + ")"
                + " + 增项税金 " + fmtMoney(basic.addTaxPrice) + "×flag(" + flag + ") − 减项税金 " + fmtMoney(basic.reduceTaxPrice) + "×flag(" + flag + ")",
            result: basic.taxment,
            field: "—(仅展示)"
        });

        if (_branchType == 2 && basic.base > 0) {

            trace.push({
                name: "决算合同额(" + _branchName + ")",
                formula: "(决算直接费 " + fmtMoney(beforeTotal) + " − 直接费%基数 " + fmtMoney(beforeTotal % basic.base) + ")×折扣 " + basic.discount + "/10 + 直接费%基数 " + fmtMoney(beforeTotal % basic.base)
                    + " + 管理费折算 " + fmtMoney(_managePrice) + " + 增项管理费 " + fmtMoney(basic.addManagePrice) + "×flag(" + flag + ") − 减项管理费 " + fmtMoney(basic.reduceManagePrice) + "×flag(" + flag + ")"
                    + " + 税金折算 " + fmtMoney(_taxPrice) + " + 增项税金 " + fmtMoney(basic.addTaxPrice) + "×flag(" + flag + ") − 减项税金 " + fmtMoney(basic.reduceTaxPrice) + "×flag(" + flag + ")",
                result: basic.accountForehead,
                field: "—(仅展示)"
            });

        } else {

            trace.push({
                name: "决算合同额(" + _branchName + ")",
                formula: "(打折项 " + fmtMoney(basic.disPrice) + " + 增项打折配比 " + fmtMoney(basic.addDisCalPrice) + "×flag(" + flag + ") − 减项打折配比 " + fmtMoney(basic.reduceDisCalPrice) + "×flag(" + flag + "))×折扣 " + basic.dd + "/10"
                    + " + 不打折项 " + fmtMoney(basic.undisPrice) + " + 增项不打折配比 " + fmtMoney(basic.addUndisCalPrice) + "×flag(" + flag + ") − 减项不打折配比 " + fmtMoney(basic.reduceUndisCalPrice) + "×flag(" + flag + ")"
                    + " + 车运费 " + fmtMoney(basic.trafficPrice)
                    + " + 管理费折算 " + fmtMoney(_managePrice) + " + 增项管理费 " + fmtMoney(basic.addManagePrice) + "×flag(" + flag + ") − 减项管理费 " + fmtMoney(basic.reduceManagePrice) + "×flag(" + flag + ")"
                    + " + 税金折算 " + fmtMoney(_taxPrice) + " + 增项税金 " + fmtMoney(basic.addTaxPrice) + "×flag(" + flag + ") − 减项税金 " + fmtMoney(basic.reduceTaxPrice) + "×flag(" + flag + ")",
                result: basic.accountForehead,
                field: "—(仅展示)"
            });
        }

        trace.push({
            name: "决算服务费",
            formula: "(决算直接费 " + fmtMoney(beforeTotal)
                + " + 管理费 " + fmtMoney(basic.managePrice) + " + 增项管理费 " + fmtMoney(basic.addPredisManagePrice) + "×flag(" + flag + ") − 减项管理费 " + fmtMoney(basic.reducePredisManagePrice) + "×flag(" + flag + ")"
                + " + 税金 " + fmtMoney(basic.taxPrice) + " + 增项税金 " + fmtMoney(basic.addPredisTaxPrice) + "×flag(" + flag + ") − 减项税金 " + fmtMoney(basic.reducePredisTaxPrice) + "×flag(" + flag + ")"
                + ")×主材配比 " + basic.material + "×服务费比例 " + basic.service,
            result: basic.accountServicePrice,
            field: "servicePrice"
        });

        var _materialAccountCalc = Math.round(basic.direct * basic.material);

        trace.push({
            name: "决算主材额" + ((basic.daid || basic.materialAccountManual) ? "(手动输入)" : ""),
            formula: (basic.daid || basic.materialAccountManual)
                ? "手动输入 " + fmtMoney(basic.materialAccount) + "(公式值: 决算折前总额 " + fmtMoney(basic.direct) + "×主材配比 " + basic.material + " = " + _materialAccountCalc + ", 不采用)"
                : "决算折前总额 " + fmtMoney(basic.direct) + "×主材配比 " + basic.material,
            result: basic.materialAccount,
            field: "materialPrice"
        });

        trace.push({
            name: "差额(不含预付款)",
            formula: "决算合同额 " + fmtMoney(basic.accountForehead) + " + 决算服务费 " + fmtMoney(basic.accountServicePrice)
                + " − 合同实收 " + fmtMoney(basic.factPrice) + " − 已收服务费 " + fmtMoney(basic.servicePaidup)
                + " − 增项总额 " + fmtMoney(basic.addTotalPrice) + "×flag(" + flag + ") + 减项总额 " + fmtMoney(basic.reduceTotalPrice) + "×flag(" + flag + ") + 增项非配比 " + fmtMoney(basic.addUncalPrice) + "×flag(" + flag + ")"
                + " − 优惠券 " + fmtMoney(basic.preferences) + " − 内部优惠券 " + fmtMoney(basic.internalCoupon) + " − 满送 " + fmtMoney(basic.fulldel) + " − 返现 " + fmtMoney(basic.cashback),
            result: basic.balanceSum,
            field: "difference"
        });

        trace.push({
            name: "金额差",
            formula: "主材实收额 " + fmtMoney(basic.materialFactPrice) + " − 决算主材额 " + fmtMoney(basic.materialAccount),
            result: basic.difference,
            field: "—(仅展示)"
        });

        trace.push({
            name: "超配比",
            formula: "金额差 " + fmtMoney(basic.difference) + " ÷ 决算主材额 " + fmtMoney(basic.materialAccount),
            result: basic.superRatio,
            field: "—(仅展示)"
        });

        trace.push({
            name: "决算实花配比",
            formula: "主材实收合计 " + fmtMoney(auotation.materialTotal) + " ÷ 决算折前总额 " + fmtMoney(basic.direct),
            result: basic.flowerRatio,
            field: "paidupMatching"
        });

        trace.push({
            name: "实花配比含外销",
            formula: "(外销配比总额 " + fmtMoney(basic.oalesScaleTotal) + " + 主材实收合计 " + fmtMoney(auotation.materialTotal) + ") ÷ 决算折前总额 " + fmtMoney(basic.direct),
            result: basic.flowerOalesRatio,
            field: "—(仅展示)"
        });

        trace.push({
            name: "折前总额全",
            formula: "报价折前总价 " + fmtMoney(basic.foldFrontTotal) + " + 增项折前(扩展) " + fmtMoney(basic.addFoldFrontTotal) + " − 减项折前(扩展) " + fmtMoney(basic.minusFoldFrontTotal)
                + " + 增项折前(增减) " + fmtMoney(basic.addPredisPrice) + " − 减项折前(增减) " + fmtMoney(basic.reducePredisPrice),
            result: basic.directC,
            field: "—(仅展示)"
        });

        trace.push({
            name: "应补款",
            formula: "合同未收 " + fmtMoney(basic.signFactOwing) + " + 增项未收 " + fmtMoney(basic.addOwing) + " − 减项未收 " + fmtMoney(basic.reduceOwing),
            result: basic.fullPayment,
            field: "—(仅展示)"
        });

        renderCalcTrace(trace);
    }

    function renderCalcTrace(trace) {

        var $tbody = auotation.items.calcTraceList.html("");

        $.each(trace || [], function(i, t) {

            var $tr = $('<tr></tr>');

            $('<td></td>').html(t.name).appendTo($tr);
            $('<td></td>').html('<small>' + t.formula + '</small>').appendTo($tr);
            $('<td></td>').html('<b class="blue">' + t.result + '</b>').appendTo($tr);
            $('<td></td>').html('<small>' + t.field + '</small>').appendTo($tr);

            $tbody.append($tr);
        });
    }

    function renderAccountOutputs() {

        var basic = auotation.basic;

        auotation.items.beforeTotal.html(basic.beforeTotal);
        auotation.items.direct.html(basic.direct);
        auotation.items.accountForehead.html(basic.accountForehead);
        auotation.items.accountServicePrice.html(basic.accountServicePrice);
        auotation.items.materialAccountShow.html(Math.round(basic.materialAccount));
        auotation.items.difference.html(basic.difference);
        auotation.items.balanceSum.html(basic.balanceSum);
        auotation.items.fullPayment.html(basic.fullPayment);
        auotation.items.directC.html(basic.directC);

        auotation.items.management.html(basic.management);
        auotation.items.taxPriceA.html(basic.taxment);
        auotation.items.flowerRatio.html(basic.flowerRatio);
        auotation.items.flowerOalesRatio.html(basic.flowerOalesRatio);
        auotation.items.superRatio.html(basic.superRatio);

        // 主材额输入: 已有决算记录或手动维护时不覆盖输入值(L1519-1521 同款)
        if (!auotation.basic.daid && !auotation.basic.materialAccountManual) {
            auotation.items.materialAccount.val(basic.materialAccount);
        }
    }

    function renderSummary() {

        var basic = auotation.basic;

        auotation.items.foldFrontTotalPrice.html(basic.totalPrice);
        auotation.items.foldFrontTotal.html(basic.foldFrontTotal);
        auotation.items.foldFrontFee.html(basic.foldFrontFee);
        auotation.items.disPrice.html(basic.disPrice);
        auotation.items.undisPrice.html(basic.undisPrice);
        auotation.items.trafficPrice.html(basic.trafficPrice);
        auotation.items.managePrice.html(basic.managePredisPrice);
        auotation.items.taxPriceB.html(basic.taxPredisPrice);

        auotation.items.addExtensionItemFoldFrontTotal.html(com.checkNull(basic.addFoldFrontTotal, 0));
        auotation.items.addExtensionItemManagePrice.html(com.checkNull(basic.addExtManagePrice, 0));
        auotation.items.addExtensionItemTotalPrice.html(com.checkNull(basic.addExtTotal, 0));
        auotation.items.minusExtensionItemFoldFrontTotal.html(com.checkNull(basic.minusFoldFrontTotal, 0));
        auotation.items.minusExtensionItemManagePrice.html(com.checkNull(basic.minusExtManagePrice, 0));
        auotation.items.minusExtensionItemTotalPrice.html(com.checkNull(basic.minusExtTotal, 0));

        auotation.items.addFoldFrontTotal.html(Math.round(basic.addPredisPrice));
        auotation.items.addManagePrice.html(Math.round(basic.addManagePrice));
        auotation.items.addMatch.html(Math.round(basic.addCalPrice));
        auotation.items.addUncalPrice.html(Math.round(basic.addUncalPrice));
        auotation.items.addTaxPrice.html(Math.round(basic.addTaxPrice));
        auotation.items.addTotal.html(Math.round(basic.addTotalPrice));
        auotation.items.addDone.html(Math.round(basic.addDone));
        auotation.items.addOwing.html(Math.round(basic.addOwing));

        auotation.items.minusFoldFrontTotal.html(Math.round(basic.reducePredisPrice));
        auotation.items.minusManagePrice.html(Math.round(basic.reduceManagePrice));
        auotation.items.minusMatch.html(Math.round(basic.reduceCalPrice));
        auotation.items.minusUncalPrice.html(Math.round(basic.reduceUncalPrice));
        auotation.items.minusTaxPrice.html(Math.round(basic.reduceTaxPrice));
        auotation.items.minusTotal.html(Math.round(basic.reduceTotalPrice));
        auotation.items.minusDone.html(Math.round(basic.reduceDone));
        auotation.items.minusOwing.html(Math.round(basic.reduceOwing));

        auotation.items.asDifference.html(Math.round(basic.asDifference));
    }

    /**
     * 功能区归组 —— 归组思想参照 quotationUtils.statisticalQuotationItem(L438/L497-503),
     * 键 = qfaId-功能区名; 无归属进"-扩展项目"/"-增减项目"桶; 行渲染为本页自有口径(来源标签+计入标记)
     */
    function collectAreas() {

        var areaOrder = [];
        var areaMap = {};

        function getArea(key, name, order) {

            if (!areaMap[key]) {
                areaMap[key] = {
                    key: key,
                    name: name,
                    order: order || "",
                    rows: [],
                    total: 0
                };
                areaOrder.push(areaMap[key]);
            }

            return areaMap[key];
        }

        // 报价项(量=initNum, 与 quotationUtils 明细口径一致)
        $.each(auotation.functionAreas, function(i, fa) {

            var area = getArea(fa.qfaId + '-' + fa.functionAreaName, fa.functionAreaName, fa.functionAreaOrder);

            $.each(fa.quotationFunctionAreaItems || [], function(j, item) {

                if (item.type == 4) // 忽略项不展示
                    return true;

                var discountLabel = "-";
                if (item.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_NODISCOUNT_INT) {
                    discountLabel = "打折"; // 归打折项桶(quotationUtils L134 同款)
                } else if (item.discount == constant.quotation().quotationFunctionAreaItem.DISCOUNT_DISCOUNT_INT) {
                    discountLabel = "不打折";
                }

                area.rows.push({
                    subtype: 0,
                    name: item.itemName,
                    unit: item.measurementUnit,
                    num: item.initNum,
                    unitPrice: item.unitPrice,
                    discountLabel: discountLabel,
                    source: "报价",
                    state: "",
                    content: ""
                });
            });
        });

        // 扩展项(减项单价取负, quotationUtils L472 口径)
        $.each(auotation.extensions, function(i, ext) {

            $.each(ext.extensionItems || [], function(j, item) {

                var _add = [0, 1, 5].indexOf(item.type) != -1;
                var _sub = [2, 3, 4].indexOf(item.type) != -1;

                if (!_add && !_sub)
                    return true;

                var key = item.quotationFunctionAreaId != null ? (item.quotationFunctionAreaId + '-' + item.quotationFunctionAreaName) : null;
                var area = key != null ? getArea(key, item.quotationFunctionAreaName) : getArea('-2-扩展项目', '-扩展项目');

                var discountLabel = "-";
                if (item.discount == constant.quotation().extensionItem.DISCOUMNT_DISCOUMNT_INT) {
                    discountLabel = "打折";
                } else if (item.discount == constant.quotation().extensionItem.DISCOUMNT_NODISCOUMNT_INT) {
                    discountLabel = "不打折";
                }

                area.rows.push({
                    subtype: 1,
                    name: item.itemName,
                    unit: item.measurementUnit,
                    num: item.num,
                    unitPrice: _sub ? -item.unitPrice : item.unitPrice,
                    discountLabel: discountLabel,
                    source: "扩展",
                    state: "",
                    content: ext.eid != null ? ("扩展单#" + ext.eid) : ""
                });
            });
        });

        // 增减项(减单行取负; 计入标记 = paytype=0 且 status∈{2,3})
        $.each(auotation.addReduces, function(i, v) {

            var inAccount = [0].indexOf(v.paytype) != -1 && [2, 3].indexOf(v.status) != -1;
            var stateName = inAccount ? "计入" : "不计入(未付款)";

            $.each(v.addReduceItems || [], function(j, item) {

                var key = item.quotationFunctionAreaId != null ? (item.quotationFunctionAreaId + '-' + item.quotationFunctionAreaName) : null;
                var area = key != null ? getArea(key, item.quotationFunctionAreaName) : getArea('-3-增减项目', '-增减项目');

                var sign = v.type == 1 ? -1 : 1;

                area.rows.push({
                    subtype: 2,
                    name: item.itemName,
                    unit: item.measurementUnit,
                    num: item.num,
                    unitPrice: utils.accMul(item.unitPrice, sign),
                    discountLabel: item.discount == 1 ? "打折" : (item.discount == 0 ? "不打折" : "-"),
                    source: v.type == 0 ? "增减-增" : (v.type == 1 ? "增减-减" : "增减-漏"),
                    state: stateName,
                    arId: v.arId,
                    content: "增减单#" + v.arId
                });
            });
        });

        // 区合计(折前) + 区内排序(报价→扩展→增减)
        $.each(areaOrder, function(i, area) {

            var total = 0;

            $.each(area.rows, function(j, r) {
                total = utils.accAdd(total, utils.accMul(r.unitPrice, r.num));
            });

            area.total = total;
            area.rows.sort(function(a, b) {
                return a.subtype - b.subtype;
            });
        });

        return areaOrder;
    }

    function renderFunctionAreas() {

        var areas = collectAreas();
        var $list = auotation.items.functionAreaList.html("");

        $.each(areas, function(i, area) {

            // 区头结构对齐 quotationPart painter.createdomain: h5(em序号 + strong区名) + widget-toolbar 右侧信息
            var $box = $('<div></div>').addClass('widget-box transparent').css('margin-bottom', '20px');

            var $header = $('<div></div>').addClass('widget-header').append(
                $('<h5></h5>')
                    .append($('<em></em>').text(area.order))
                    .append('  ')
                    .append($('<strong></strong>').html(area.name))
            );

            var $toolbar = $('<div></div>').addClass('widget-toolbar no-border');

            // 区折前合计为展示口径(公式输入以左栏汇总区为准)
            $toolbar.append($('<span></span>').addClass('bigger-110')
                .html('区折前合计: <b class="blue">' + Math.round(area.total) + '</b>'));

            var $body = $('<div></div>').addClass('widget-body').append(
                $('<div></div>').addClass('widget-body-inner').css('padding', '5px 10px').append(renderAreaTable(area))
            );

            $header.append($toolbar);
            $box.append($header).append($body).appendTo($list);
        });

        if (areas.length == 0) {
            $('<h5></h5>').addClass('bigger-110 center grey').html('无可展示明细').appendTo($list);
        }
    }

    function renderAreaTable(area) {

        // fl-quo flex 网格(与 quotationPart 明细同构, 全局 clear.css), 列宽补充见页面 <style>
        var $list = $('<ul></ul>').addClass('fl-quo-list');

        var _headerSet = [["name", "名称"], ["unit", "单位"], ["num", "量"], ["price", "单价"], ["au-subtotal", "小计"], ["au-discount", "折扣"], ["au-source", "来源"], ["au-state", "状态/单号"]];

        var $headerItem = $('<li></li>').addClass('fl-quo-item au-header');

        $.each(_headerSet, function(i, v) {

            $('<div></div>').addClass('cell ' + v[0]).append($('<span></span>').addClass('cell-wrap').text(v[1])).appendTo($headerItem);
        });

        $list.append($headerItem);

        // ACE label 底色区分来源: 报价灰/扩展蓝/增减-增绿/增减-减橙/增减-漏红
        var _sourceLabels = {
            "报价": "",
            "扩展": "label-info",
            "增减-增": "label-success",
            "增减-减": "label-warning",
            "增减-漏": "label-danger"
        };

        $.each(area.rows, function(i, r) {

            var _total = utils.accMul(r.unitPrice, r.num);

            var _cells = [
                ["name", com.checkNull(r.name, '-')],
                ["unit", com.checkNull(r.unit, '-')],
                ["num", r.num],
                ["price", r.unitPrice],
                ["au-subtotal", '<b class="blue">' + Math.round(_total) + '</b>'],
                ["au-discount", r.discountLabel]
            ];

            if (_sourceLabels[r.source] == "") {
                _cells.push(["au-source", r.source]);
            } else {
                _cells.push(["au-source", '<span class="label ' + _sourceLabels[r.source] + '">' + r.source + '</span>']);
            }

            // 增减行: 计入配比标签(口径内可点击, 页面级重算模拟不写库) + 单号(短格式防串行) + 折扣维护入口
            if (r.subtype == 2) {

                var _outOfScope = r.state.indexOf("不计入") == 0;
                var _inFlag = auotation.arFlagMap[r.arId] !== false;

                var _stateHtml = _outOfScope
                    ? '<span class="label label-default">不计入</span>'
                    : (_inFlag ? '<span class="label label-success">计入配比</span>' : '<span class="label label-warning">不计配比</span>');

                var $stateLabel = $(_stateHtml);

                if (!_outOfScope) {

                    $stateLabel.css('cursor', 'pointer').attr('title', '点击切换是否计入配比(仅页面重算模拟, 不修改增减单数据; 刷新后恢复)').click(function() {

                        auotation.arFlagMap[r.arId] = _inFlag ? false : true;

                        queryAddReduce();
                        renderSummary();
                        accountSuper();
                        renderFunctionAreas();
                    });
                }

                var $stateWrap = $('<span></span>').addClass('cell-wrap')
                    .append($stateLabel)
                    .append($('<span class="grey" style="padding-left: 5px;"></span>').html('#' + r.arId));

                var $arBtn = $('<button></button>').addClass('btn btn-minier btn-yellow').html('折扣').css('margin-left', '5px')
                    .click(function() {

                        openArAccountModal(r.arId);
                    });

                var $stateCell = $('<div></div>').addClass('cell au-state').append($stateWrap).append($arBtn);

                var $li = $('<li></li>').addClass('fl-quo-item');

                $.each(_cells, function(j, c) {

                    var $cell = $('<div></div>').addClass('cell ' + c[0]).append($('<span></span>').addClass('cell-wrap').html(c[1]));

                    $li.append($cell);
                });

                $li.append($stateCell).appendTo($list);

            } else {

                _cells.push(["au-state", com.checkNull(r.content, '-')]);

                var $li = $('<li></li>').addClass('fl-quo-item');

                $.each(_cells, function(j, c) {

                    var $cell = $('<div></div>').addClass('cell ' + c[0]).append($('<span></span>').addClass('cell-wrap').html(c[1]));

                    $li.append($cell);
                });

                $li.appendTo($list);
            }
        });

        return $list;
    }

    /**
     * 决算记录回填 —— 移植 decoration4account.js applyDecorationAccount(L741-790)
     */
    function findMatchingConfig(decorationAccount) {

        var config = null;

        $.each(auotation.machingType, function(i, v) {

            if (decorationAccount.name == v.name && decorationAccount.typeness == v.typeness) {
                config = v;
                return false;
            }
        });

        if (config) return config;

        $.each(auotation.machingType, function(i, v) {

            if (decorationAccount.typeness == v.typeness && decorationAccount.matching == v.matching && decorationAccount.serviceRate == v.serviceRate) {
                config = v;
                return false;
            }
        });

        if (config) return config;

        $.each(auotation.machingType, function(i, v) {

            if (decorationAccount.typeness == v.typeness) {
                config = v;
                return false;
            }
        });

        return config;
    }

    function applyAccount(decorationAccount) {

        if (!decorationAccount || !decorationAccount.daid) return false;

        var config = findMatchingConfig(decorationAccount);

        if (config && config.dmid) {
            $.extend(auotation.basic, config);
            auotation.items.otherPaymentType.val(config.dmid);
        }

        var basic = auotation.basic;

        basic.daid = decorationAccount.daid;
        basic.name = decorationAccount.name;
        basic.dd = decorationAccount.discount;
        basic.type = decorationAccount.type;
        basic.typeness = decorationAccount.typeness;
        basic.base = decorationAccount.discountBase;
        basic.discount = decorationAccount.discount;
        basic.material = decorationAccount.matching;
        basic.service = decorationAccount.serviceRate;
        basic.materialAccount = decorationAccount.materialPrice;
        basic.materialAccountManual = true;
        basic.accountServicePrice = decorationAccount.servicePrice;
        basic.flowerRatio = decorationAccount.paidupMatching;
        basic.balanceSum = decorationAccount.difference;
        basic.preferences = decorationAccount.coupon || 0;
        basic.internalCoupon = decorationAccount.internal || 0;
        basic.fulldel = decorationAccount.fulldel || 0;
        basic.cashback = decorationAccount.cashback || 0;
        basic.cal = (decorationAccount.arcal == 0);

        auotation.items.accountStatus.html("已建档(daid: " + decorationAccount.daid + ")").removeClass("red").addClass("blue");
        auotation.items.accountName.html(com.checkNull(decorationAccount.name, "-"));
        auotation.items.calDiscountPrice.val(decorationAccount.discount);
        auotation.items.matching.prop("checked", basic.cal);
        auotation.items.preferences.val(basic.preferences);
        auotation.items.internalCoupon.val(basic.internalCoupon);
        auotation.items.fulldel.val(basic.fulldel);
        auotation.items.cashback.val(basic.cashback);
        auotation.items.comment.val(decorationAccount.comment);
        auotation.items.materialAccount.val(decorationAccount.materialPrice);

        accountSuper();
        auotation.btns.updateBtn.removeAttr("disabled");

        return true;
    }

    /**
     * 保存决算 —— 双写: 主记录(updateDecorationAccount 19字段) + 明细快照(updateDecorationAccountItem type0-9)
     * 与决算计算页 saveDecorationAccount(L969-990) 同款链路
     */
    function saveAccount() {

        accountSuper();

        com.post(api.decoration.updateDecorationAccount, collectOption(), function(res) {

            com.post(api.decoration.queryDecorationAccount, {
                "decorationAccount.orderId": auotation.orderId
            }, function(rs) {

                applyAccount(rs.decorationAccount);

                saveAccountItems(function() {

                    com.showAlert(com.info, "更新保存成功");
                });
            }, null, false);
        });
    }

    function collectOption() {

        var basic = auotation.basic;

        basic.materialAccount = parseFloat(auotation.items.materialAccount.val()) || basic.materialAccount || 0;
        basic.preferences = auotation.items.preferences.val() ? auotation.items.preferences.val() : 0;
        basic.internalCoupon = auotation.items.internalCoupon.val() ? auotation.items.internalCoupon.val() : 0;
        basic.fulldel = auotation.items.fulldel.val() ? auotation.items.fulldel.val() : 0;
        basic.cashback = auotation.items.cashback.val() ? auotation.items.cashback.val() : 0;

        var projectPrice = basic.direct || 0;
        var projectBase = basic.beforeTotal || 0;

        return {
            "decorationAccount.orderId": auotation.orderId,
            "decorationAccount.name": basic.name,
            "decorationAccount.type": basic.type,
            "decorationAccount.typeness": basic.typeness,
            "decorationAccount.arcal": basic.cal ? 0 : 1,
            "decorationAccount.matching": basic.material,
            "decorationAccount.discount": basic.discount,
            "decorationAccount.discountBase": basic.base,
            "decorationAccount.serviceRate": basic.service,
            "decorationAccount.materialPrice": basic.materialAccount,
            "decorationAccount.servicePrice": basic.accountServicePrice,
            "decorationAccount.projectPrice": projectPrice,
            "decorationAccount.projectBase": projectBase,
            "decorationAccount.paidupMatching": basic.flowerRatio,
            "decorationAccount.difference": basic.balanceSum,
            "decorationAccount.coupon": basic.preferences,
            "decorationAccount.internal": basic.internalCoupon,
            "decorationAccount.fulldel": basic.fulldel,
            "decorationAccount.cashback": basic.cashback,
            "decorationAccount.comment": auotation.items.comment.val()
        };
    }

    /**
     * 明细快照 —— type 0-8 与决算计算页 buildDecorationAccountItems(L861-938) 同款,
     * 新增 type=9 功能区明细行(subtype 0报价/1扩展/2增减, content=功能区名|来源|状态|单号)
     */
    function buildAccountItems() {

        var basic = auotation.basic;
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

        addItem(0, 0, "起报价", com.checkNull(auotation.protation.quotePrice, 0), 0, com.checkNull(auotation.protation.quotePrice, 0));
        addItem(0, 1, "优惠价", com.checkNull(auotation.protation.preferPrice, 0), 0, com.checkNull(auotation.protation.preferPrice, 0));
        addItem(0, 2, "管理费", com.checkNull(auotation.protation.managePrice, 0), 0, com.checkNull(auotation.protation.managePrice, 0));
        addItem(0, 3, "面积", com.checkNull((auotation.decoration.house || {}).buildArea, 0), 0, com.checkNull((auotation.decoration.house || {}).buildArea, 0));
        addItem(0, 4, "总价", com.checkNull(auotation.protation.totalPrice, 0), 0, com.checkNull(auotation.protation.totalPrice, 0));
        addItem(0, 5, "合同额", com.checkNull(auotation.decoration.precontractPrice, 0), 0, com.checkNull(auotation.decoration.precontractPrice, 0));

        addItem(1, 0, "报价总额", basic.totalPrice, 0, basic.totalPrice);
        addItem(1, 1, "折前总价", basic.foldFrontTotal, 0, basic.foldFrontTotal);
        addItem(1, 2, "折前直接费", basic.foldFrontFee, 0, basic.foldFrontFee);
        addItem(1, 3, "管理费", basic.managePredisPrice, 0, basic.managePredisPrice);
        addItem(1, 4, "折扣", 0, basic.dd, basic.dd);
        addItem(1, 5, "打折项总额", basic.disPrice, 0, basic.disPrice);
        addItem(1, 6, "不打折项总额", basic.undisPrice, 0, basic.undisPrice);
        addItem(1, 7, "税金", basic.taxPredisPrice, 0, basic.taxPredisPrice);

        addItem(2, 0, "增项折前总价", basic.addFoldFrontTotal, 0, basic.addFoldFrontTotal);
        addItem(2, 1, "增项管理费", basic.addExtManagePrice, 0, basic.addExtManagePrice);
        addItem(2, 2, "增项总额", basic.addExtTotal, 0, basic.addExtTotal);
        addItem(2, 3, "减项折前总价", basic.minusFoldFrontTotal, 0, basic.minusFoldFrontTotal);
        addItem(2, 4, "减项管理费", basic.minusExtManagePrice, 0, basic.minusExtManagePrice);
        addItem(2, 5, "减项总额", basic.minusExtTotal, 0, basic.minusExtTotal);

        addItem(3, 0, "合同额", Math.round(basic.contractPrice), 0, Math.round(basic.contractPrice));
        addItem(3, 1, "优惠券", Math.round(basic.couponCut), 0, Math.round(basic.couponCut));
        addItem(3, 2, "服务费", Math.round(basic.servicePrice), 0, Math.round(basic.servicePrice));
        addItem(3, 3, "已收服务费", Math.round(basic.servicePaidup), 0, Math.round(basic.servicePaidup));
        addItem(3, 4, "合同已收", Math.round(basic.signFactDone), 0, Math.round(basic.signFactDone));
        addItem(3, 5, "合同未收", Math.round(basic.signFactOwing), 0, Math.round(basic.signFactOwing));
        addItem(3, 6, "合同实收", Math.round(basic.factPrice), 0, Math.round(basic.factPrice));
        addItem(3, 7, "主材配比", 0, basic.materialRatio > 0 && basic.foldFrontTotal > 0 ? utils.changeThrDecimal(basic.materialRatio / basic.foldFrontTotal) : 0, "主材配比");

        addItem(4, 0, "配比总额", basic.materialRatio, 0, basic.materialRatio);
        addItem(4, 1, "总金额", auotation.materialTotal, 0, auotation.materialTotal);
        addItem(4, 2, "优惠券", auotation.materialCoupon, 0, auotation.materialCoupon);
        addItem(4, 3, "实收额", basic.materialFactPrice, 0, basic.materialFactPrice);

        addItem(5, 0, "外销总金额", basic.oalesTotal, 0, basic.oalesTotal);
        addItem(5, 1, "外销主材总额", utils.accAdd(basic.oalesTotal, auotation.materialTotal), 0, utils.accAdd(basic.oalesTotal, auotation.materialTotal));
        addItem(5, 2, "外销配比总额", basic.oalesScaleTotal, 0, basic.oalesScaleTotal);

        addItem(6, 0, "增项折前总价", Math.round(basic.addPredisPrice), 0, Math.round(basic.addPredisPrice));
        addItem(6, 1, "增项管理费", Math.round(basic.addManagePrice), 0, Math.round(basic.addManagePrice));
        addItem(6, 2, "增项配比总额", Math.round(basic.addCalPrice), 0, Math.round(basic.addCalPrice));
        addItem(6, 3, "增项非配比总额", Math.round(basic.addUncalPrice), 0, Math.round(basic.addUncalPrice));
        addItem(6, 4, "增项税金总额", Math.round(basic.addTaxPrice), 0, Math.round(basic.addTaxPrice));
        addItem(6, 5, "增项总额", Math.round(basic.addTotalPrice), 0, Math.round(basic.addTotalPrice));
        addItem(6, 6, "减项折前总价", Math.round(basic.reducePredisPrice), 0, Math.round(basic.reducePredisPrice));
        addItem(6, 7, "减项管理费", Math.round(basic.reduceManagePrice), 0, Math.round(basic.reduceManagePrice));
        addItem(6, 8, "减项配比总额", Math.round(basic.reduceCalPrice), 0, Math.round(basic.reduceCalPrice));
        addItem(6, 9, "减项非配比总额", Math.round(basic.reduceUncalPrice), 0, Math.round(basic.reduceUncalPrice));
        addItem(6, 10, "减项税金总额", Math.round(basic.reduceTaxPrice), 0, Math.round(basic.reduceTaxPrice));
        addItem(6, 11, "减项总额", Math.round(basic.reduceTotalPrice), 0, Math.round(basic.reduceTotalPrice));
        addItem(6, 12, "增减项差额", Math.round(basic.asDifference), 0, Math.round(basic.asDifference));

        addItem(7, 0, "合同预付款", basic.contractAdvance, 0, basic.contractAdvance);
        addItem(7, 1, "工程预付款", basic.projectAdvance, 0, basic.projectAdvance);
        addItem(7, 2, "主材预付款", basic.materialAdvance, 0, basic.materialAdvance);
        addItem(7, 3, "正林预付款", basic.zhenglinAdvance, 0, basic.zhenglinAdvance);

        addItem(8, 0, "决算折前总额", basic.direct, 0, basic.direct);
        addItem(8, 1, "决算直接费", basic.beforeTotal, 0, basic.beforeTotal);
        addItem(8, 2, "决算管理费", basic.management, 0, basic.management);
        addItem(8, 3, "决算实花配比", 0, basic.flowerRatio, basic.flowerRatio);
        addItem(8, 4, "决算主材额", basic.materialAccount, 0, basic.materialAccount);
        addItem(8, 5, "决算合同额", basic.accountForehead, 0, basic.accountForehead);
        addItem(8, 6, "决算服务费", basic.accountServicePrice, 0, basic.accountServicePrice);
        addItem(8, 7, "决算实花配比含外销", 0, basic.flowerOalesRatio, basic.flowerOalesRatio);
        addItem(8, 8, "金额差", basic.difference, 0, basic.difference);
        addItem(8, 9, "超配比", 0, basic.superRatio, basic.superRatio);
        addItem(8, 10, "税金", basic.taxment, 0, basic.taxment);
        addItem(8, 11, "差额不含预付款", basic.balanceSum, 0, basic.balanceSum);
        addItem(8, 12, "决算折前总额全", basic.directC, 0, basic.directC);
        addItem(8, 13, "应补款", basic.fullPayment, 0, basic.fullPayment);
        addItem(8, 14, "优惠券", basic.preferences, 0, basic.preferences);
        addItem(8, 15, "内部优惠券", basic.internalCoupon, 0, basic.internalCoupon);
        addItem(8, 16, "满送", basic.fulldel, 0, basic.fulldel);
        addItem(8, 17, "返现", basic.cashback, 0, basic.cashback);

        // type=9 功能区明细行
        $.each(collectAreas(), function(i, area) {

            $.each(area.rows, function(j, r) {

                var _total = utils.accMul(r.unitPrice, r.num);
                var _state = r.source.indexOf("增减") == 0 ? ("|" + r.state) : "";

                addItem(9, r.subtype, r.name, Math.round(_total), 0, area.name + "|" + r.source + _state + (r.content ? "|" + r.content : ""));
            });
        });

        return items;
    }

    function saveAccountItems(callback) {

        var items = buildAccountItems();
        var options = {
            "decorationAccountItem.orderId": auotation.orderId,
            "decorationAccountItem.daid": auotation.basic.daid
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

    // ==================== 事件 ====================

    // 计算按钮(重算折扣)
    auotation.btns.calculateBtn.click(function() {

        if (!auotation.items.calDiscountPrice.val())
            return false;

        auotation.basic.dd = auotation.items.calDiscountPrice.val();
        auotation.basic.discount = auotation.items.calDiscountPrice.val();

        accountSuper();
    });

    // 算/不算配比
    auotation.items.matching.click(function() {

        auotation.basic.cal = auotation.items.matching.prop("checked");

        accountSuper();
    });

    // 业务类型(配比方案)切换 —— 移植 otherPaymentType change(L1022-1065)
    auotation.items.otherPaymentType.on("change", function() {

        var that = $(this);
        var config = {};

        $.each(auotation.machingType, function(i, v) {

            if (that.val() == v.dmid)
                config = v;
        });

        auotation.basic.cal = auotation.items.matching.prop("checked");
        auotation.basic.taxDiscount = config.taxDiscount;

        $.extend(auotation.basic, config);

        if (config.typeness == params.decoration.typeness) {
            auotation.items.calDiscountPrice.val(auotation.quotation.discount);
            auotation.basic.discount = auotation.quotation.discount;
        } else {
            auotation.items.calDiscountPrice.val(com.checkNull(config.discount, 0));
            auotation.basic.discount = config.discount;
        }

        auotation.basic.dd = auotation.basic.discount;
        auotation.basic.name = config.name;
        auotation.basic.typeness = config.typeness;
        auotation.items.accountName.html(com.checkNull(config.name, "-"));

        if (config.discountType == constant.data().decorationMatching.DISCOUNTTYPE_ONLY_INT) {
            auotation.items.calDiscountPrice.attr("readonly", "readonly");
        } else {
            auotation.items.calDiscountPrice.removeAttr("readonly");
        }

        accountSuper();

        return false;
    });

    // 优惠四项
    auotation.items.preferences.add(auotation.items.internalCoupon).add(auotation.items.fulldel).add(auotation.items.cashback).blur(function() {

        accountSuper();
    });

    // 决算主材额(手动维护优先)
    auotation.items.materialAccount.blur(function() {

        auotation.basic.materialAccount = parseFloat($(this).val()) || 0;
        auotation.basic.materialAccountManual = true;

        accountSuper();
    });

    // 保存决算
    auotation.btns.updateBtn.click(function() {

        if (!auotation.account || !auotation.account.daid) {
            com.showAlert(com.warning, "请先在决算计算页生成决算记录");
            return false;
        }

        com.showConfirm("确定要更新决算信息吗? 将覆盖现有决算记录与明细快照", function() {

            saveAccount();
        });
    });

    // 刷新
    auotation.btns.refreshBtn.click(function() {

        initLoad();
    });

    // 汇总折叠
    auotation.btns.summaryToggleBtn.click(function() {

        auotation.items.summaryZone.toggle(200);

        var _show = auotation.items.summaryZone.is(":visible");

        $(this).html(_show ? "收起汇总" : "展开汇总");
    });

    // 计算过程折叠
    auotation.btns.calcTraceToggleBtn.click(function() {

        auotation.items.calcTraceZone.toggle(200);

        var _show = auotation.items.calcTraceZone.is(":visible");

        $(this).html(_show ? "收起计算过程" : "展开计算过程");
    });

    // ==================== 增减单决算折扣维护 ====================
    // 入口=增减行"折扣"按钮, 走既有 updateAddReduceForAccount(增减单明细弹窗"决算"按钮同款接口);
    // accountDiscount 存 0 表示未维护(计算时回退单级/全单折扣), 开关勾选=1(参与决算折扣折算)

    var arAccount = {
        arid: null
    };

    function openArAccountModal(arid) {

        var _target = null;

        $.each(auotation.addReduces, function(i, v) {

            if (v.arId == arid) {
                _target = v;
                return false;
            }
        });

        if (!_target) {
            com.showAlert(com.warning, "增减单数据不存在");
            return false;
        }

        arAccount.arid = arid;

        auotation.items.arAccountName.html("增减单#" + arid + " " + (_target.type == 0 ? "增项" : _target.type == 1 ? "减项" : "漏项"));
        auotation.items.arAccountDiscount.val(com.checkNull(_target.accountDiscount, 0));
        auotation.items.arAccountManageDiscount.prop("checked", _target.accountManageDiscount == 1);
        auotation.items.arAccountTaxDiscount.prop("checked", _target.accountTaxDiscount == 1);

        auotation.items.addReduceAccountModal.modal("show");

        return true;
    }

    auotation.btns.arSaveAccountBtn.click(function() {

        if (com.validate("auAddReduceAccountModal"))
            return false;

        com.showConfirm("确定更新该增减单的决算折扣吗?", function() {

            var options = {
                "addReduce.arId": arAccount.arid,
                "addReduce.orderId": auotation.orderId,
                "addReduce.accountDiscount": auotation.items.arAccountDiscount.val(),
                "addReduce.accountManageDiscount": auotation.items.arAccountManageDiscount.prop("checked") ? 1 : 0,
                "addReduce.accountTaxDiscount": auotation.items.arAccountTaxDiscount.prop("checked") ? 1 : 0
            };

            com.post(api.quotation.updateAddReduceForAccount, options, function(res) {

                com.showAlert(com.info, "操作成功");
                auotation.items.addReduceAccountModal.modal("hide");

                // 单级折扣已变: 重算增减汇总并联动刷新
                queryAddReduce();
                renderSummary();
                accountSuper();
                renderFunctionAreas();
            });
        });
    });

});
