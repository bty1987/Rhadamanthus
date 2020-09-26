$(function () {
    
    var decorationDetail = {
        decorationOrderId: null,

        orderType: {},
        typeness: {},
        orderTypeness: params.typeness,

        basicsItems: {
            foldFrontTotal: com.focusPage("#foldFrontTotal"),
            foldFrontFee: com.focusPage("#foldFrontFee"),
            managePrice: com.focusPage("#managePrice"),
            basdiscount: com.focusPage("#basdiscount")
        },
        contractItems: {
            signPrice: com.focusPage("#signPrice"),
            coupon: com.focusPage("#coupon"),
            servicePrice: com.focusPage("#servicePrice"),
            servicePaidup: com.focusPage("#servicePaidup"),
            signFactPrice: com.focusPage("#signFactPrice"),
            mm: com.focusPage("#mm")
        },
        materialItems: {
            materialRatio: com.focusPage("#materialRatio"),
            materialTotal: com.focusPage("#materialTotal"),
            materialCoupon: com.focusPage("#materialCoupon"),
            materialFactPrice: com.focusPage("#materialFactPrice")
        },
        AddReduceItems: {
            addFoldFrontTotal: com.focusPage("#addFoldFrontTotal"),
            addManagePrice: com.focusPage("#addManagePrice"),
            addMatch: com.focusPage("#addMatch"),
            addUncalPrice: com.focusPage("#addUncalPrice"),
            addDone: com.focusPage("#addDone"),
            minusFoldFrontTotal: com.focusPage("#minusFoldFrontTotal"),
            minusManagePrice: com.focusPage("#minusManagePrice"),
            minusMatch: com.focusPage("#minusMatch"),
            minusUncalPrice: com.focusPage("#minusUncalPrice"),
            minusDone: com.focusPage("#minusDone")
        },
        advanceItems: {
            contractAdvance: com.focusPage("#contractAdvance"),
            constructionAdvance: com.focusPage("#constructionAdvance"),
            materialAdvance: com.focusPage("#materialAdvance"),
            zhenglinAdvance: com.focusPage("#zhenglinAdvance")
        },
        accountItems: {
            direct: com.focusPage("#direct"),
            beforeTotal: com.focusPage("#beforeTotal"),
            management: com.focusPage("#management"),
            flowerRatio: com.focusPage("#flowerRatio"),
            materialAccount: com.focusPage("#materialAccount"),
            accountForehead: com.focusPage("#accountForehead"),
            accountServicePrice: com.focusPage("#accountServicePrice"),
            balanceSum: com.focusPage("#balanceSum"),
            difference: com.focusPage("#difference"),
            superRatio: com.focusPage("#superRatio")
        },
        items: {
            discountName: com.focusPage("#discountName"),
            decorationType: com.focusPage("#decorationType"),
            accountType: com.focusPage("#accountType"),
            calDiscountPrice: com.focusPage("#calDiscountPrice"),
            preferences: com.focusPage("#preferences"),
            internalCoupon: com.focusPage("#internalCoupon"),
            fulldel: com.focusPage("#fulldel"),
            cashback: com.focusPage("#cashback"),
            matching: com.focusPage("#matching").switchBtn("isOrNotType"),
            fueluxWizard: com.focusPage('#fuelux-wizard'),
            materialBrand: com.focusPage("#materialBrand"),
            tabContent: com.focusPage(".tab-content"),
            fanglinMaterialPayment: com.focusPage("#fanglinMaterialPayment"),
            salesMaterialPayment: com.focusPage("#salesMaterialPayment"),
            otherPaymentType: com.focusPage("#otherPaymentType"),
            
            comment: com.focusPage("#comment")
        },
        btns: {
            btnBack: com.focusPage('#btnBack'),
            calculateBtn: com.focusPage("#calculateBtn"),
            updateBtn: com.focusPage("#update_btn"),
            submission: com.focusPage("#submission"),
            print: com.focusPage("#print").hide()
        }
    };

    var decoration;

    decorationDetail.decorationOrderId = params.decorationOrderId;

    var accountBasic = {
            
        machingType: [],
            
        dd: 0,
            
        undisPrice: 0,
        disPrice: 0,
        trafficPrice: 0,
        managePrice: 0,
        materialRatio: 0,
        servicePaidup: 0,

        contractPrice: 0,
        couponCut: 0,
        factPrice: 0,
        servicePrice: 0,
        
        addPredisPrice: 0,
        addManagePrice: 0,
        addCalPrice: 0,
        addUncalPrice: 0,
        addTotalPrice: 0,
        
        reducePredisPrice: 0,
        reduceManagePrice: 0,
        reduceCalPrice: 0,
        reduceUncalPrice: 0,
        reduceTotalPrice: 0,
        reduceDisPrice : 0,
        reduceUndisPrice : 0,

        accountForehead: 0,
        balanceSum: 0,
        difference: 0,
        superRatio: 0,

        name: "",
        discount: 0,
        base: 0,
        material: 0,
        service: 0,
        
        cal: false,
        
        isPrint: false
    };

    $.each(params.viewNode, function (i, v) {
        v.type == "account" && v.opt != null && $.each(v.opt.btn, function (j, x) {
                switch (x) {
                    case "accountPrint":
                        decorationDetail.btns.print.show();
                        break;
                    case "btnAccountPrint":
                        accountBasic.isPrint = true;
                        break;
                }
        });
    });

    decorationDetail.btns.btnBack.on("click", function () {
        //com.switchPage(params.historyPage);
    });
    
    decorationDetail.accountItems.materialAccount.blur(function(){
        accountBasic.materialAccount = $(this).val();
    });

    initTab();
    decorationUtils.init();
    var material = decorationUtils.initMaterial(decorationDetail);

    initWizard(decorationDetail.discount, decorationDetail);
    
    
    setTimeout(function () {
        quotationUtils.loadQuotationDetail();
    }, 500);

    //初始向导
    function initWizard(discount, decorationDetail) {
        decorationDetail.items.fueluxWizard.ace_wizard({"status": true}).on('change', function (e, info) {

            var curstep = 0;

            info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;
            if (curstep == 1) {
                decorationUtils.initMaterial(decorationDetail);
            } else if (curstep == 2) {
                
            }
        }).on('finished', function (e) {
            com.switchPage(params.historyPage);
        }).on('stepclick', function (e, info) {

            if (info.step == 1) {
                decorationUtils.initMaterial(decorationDetail);
            } else if (info.step == 2) {

            }
        }).on('next', function (e, info) {
        }).on('previous', function (e, info) {
        });
    }

    function initTab(){
        var dataPage = params.urlLoadParams.depage;
        var fanglinMaterial = $('<div></div>').addClass('tab-pane in active').attr('id', 'fanglinMaterialPayments' + dataPage).attr('style', 'margin-left: -12px;');
        var salesMaterial = $('<div></div>').addClass('tab-pane').attr('id', 'salesMaterialPayments' + dataPage).attr('style', 'margin-left: -12px;');
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

    com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": decorationDetail.decorationOrderId}, function (res) {
        
        accountBasic.contractAdvance = res.balanceAdvance;
        accountBasic.materialAdvance = res.materialAdvance;
        
        decorationDetail.advanceItems.contractAdvance.text(res.balanceAdvance);
        decorationDetail.advanceItems.constructionAdvance.text(res.projectAdvance);
        decorationDetail.advanceItems.materialAdvance.text(res.materialAdvance);
        decorationDetail.advanceItems.zhenglinAdvance.text(res.zaterialAdvance);
    });
    
    com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": decorationDetail.decorationOrderId}, function(res){
        var quotation = res.quotation;
        
        accountBasic.undisPrice = quotation.undisPrice;
        accountBasic.disPrice = quotation.disPrice;
        accountBasic.trafficPrice = quotation.trafficPrice;
        accountBasic.managePrice = quotation.managePrice;
        
        accountBasic.foldFrontTotal = Math.round(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.managePrice);
        accountBasic.foldFrontFee = Math.round(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice);

        decorationDetail.basicsItems.foldFrontTotal.html(accountBasic.foldFrontTotal);
        decorationDetail.basicsItems.foldFrontFee.html(accountBasic.foldFrontFee);
        decorationDetail.basicsItems.managePrice.html(Math.round(accountBasic.managePrice));

        decorationDetail.contractItems.mm.html(utils.changeThrDecimal(decorationDetail.materialItems.materialRatio.text() / decorationDetail.basicsItems.foldFrontTotal.text()));
    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": decorationDetail.decorationOrderId}, function (res) {
         
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
        
    }, null, false);
    
    com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decoration.orderId": decorationDetail.decorationOrderId}, function (res) {

        var decorationHolonomy = res.decorationHolonomy;

        accountBasic.servicePrice = decorationHolonomy.servicePrice;
        accountBasic.materialRatio = decorationHolonomy.materialPrice;
        accountBasic.servicePaidup = decorationHolonomy.servicePaidup;
        
        accountBasic.servicePrice = com.checkNull(Math.round(accountBasic.servicePrice), 0);
        accountBasic.materialRatio = com.checkNull(Math.round(accountBasic.materialRatio), 0);
        accountBasic.servicePaidup = com.checkNull(Math.round(accountBasic.servicePaidup), 0);

        decorationDetail.contractItems.servicePrice.html(accountBasic.servicePrice);
        decorationDetail.materialItems.materialRatio.html(accountBasic.materialRatio);
        decorationDetail.contractItems.servicePaidup.html(accountBasic.servicePaidup);

    }, null, false);

    com.post(api.addReduce.queryAddReduceByOrderId, {"addReduce.orderId": params.decorationOrderId}, function (res) {
        var addReduces = res.addReduces;

        $.each(addReduces,function (i, v) {
            
            if([2, 3].indexOf(v.status) == -1) return true;

            if(v.type == 0){                        //0增项 1减项

                accountBasic.addPredisPrice = utils.accAdd(accountBasic.addPredisPrice, utils.accAdd(v.undisPrice, v.disPrice));
                accountBasic.addManagePrice = utils.accAdd(accountBasic.addManagePrice, v.managePrice);
                accountBasic.addCalPrice = utils.accAdd(accountBasic.addCalPrice, v.calPrice);
                accountBasic.addUncalPrice = utils.accAdd(accountBasic.addUncalPrice, v.uncalPrice);
                accountBasic.addTotalPrice = utils.accAdd(accountBasic.addTotalPrice, v.total);
            }else{
                
                accountBasic.reducePredisPrice = utils.accAdd(accountBasic.reducePredisPrice, utils.accAdd(v.undisPrice, v.disPrice));
                accountBasic.reduceManagePrice = utils.accAdd(accountBasic.reduceManagePrice, v.managePrice);
                accountBasic.reduceCalPrice = utils.accAdd(accountBasic.reduceCalPrice, v.calPrice);
                accountBasic.reduceUncalPrice = utils.accAdd(accountBasic.reduceUncalPrice, v.uncalPrice);
                accountBasic.reduceTotalPrice = utils.accAdd(accountBasic.reduceTotalPrice, v.total);
                accountBasic.reduceDisPrice = utils.accAdd(accountBasic.reduceDisPrice, v.disPrice);
                accountBasic.reduceUndisPrice = utils.accAdd(accountBasic.reduceUndisPrice, v.undisPrice);
            }
        });

        decorationDetail.AddReduceItems.addFoldFrontTotal.html(Math.round(accountBasic.addPredisPrice));
        decorationDetail.AddReduceItems.addManagePrice.html(Math.round(accountBasic.addManagePrice));
        decorationDetail.AddReduceItems.addMatch.html(Math.round(accountBasic.addCalPrice));
        decorationDetail.AddReduceItems.addUncalPrice.html(Math.round(accountBasic.addUncalPrice));
        decorationDetail.AddReduceItems.addDone.html(Math.round(accountBasic.addTotalPrice));

        decorationDetail.AddReduceItems.minusFoldFrontTotal.html(Math.round(accountBasic.reducePredisPrice));
        decorationDetail.AddReduceItems.minusManagePrice.html(Math.round(accountBasic.reduceManagePrice));
        decorationDetail.AddReduceItems.minusMatch.html(Math.round(accountBasic.reduceCalPrice));
        decorationDetail.AddReduceItems.minusUncalPrice.html(Math.round(accountBasic.reduceUncalPrice));
        decorationDetail.AddReduceItems.minusDone.html(Math.round(accountBasic.reduceTotalPrice));

    }, null, false);

    com.post(api.ds.decoration, {}, function (res) {
        $.each(res.typeness, function(i, v){
            decorationDetail.orderType[v.key] = v.value;
            decorationDetail.typeness["typeness[" + i + "]"] = v.key;
        });
    });

    com.post(api.data.queryDecorationMatching, decorationDetail.typeness, function (res) {

        $.each(res.decorationMatchings, function(i, v){

            if ((v['vision'] & 8) != 8) return;

            accountBasic.machingType.push(v);
        });

        decorationDetail.items.otherPaymentType.bindData(accountBasic.machingType, "dmid", "name", true);

    }, null, false);
    
    com.post(api.decoration.queryDecorationAccount, {"decorationAccount.orderId": decorationDetail.decorationOrderId}, function(res){
        
        var decorationAccount = res.decorationAccount;
        
        if(!decorationAccount.daid) return false;
        
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

    decorationDetail.btns.calculateBtn.click(function () {

        if (com.validate('controls')) return false;

        decorationDetail.btns.updateBtn.removeAttr("disabled");
        decorationDetail.btns.submission.removeAttr("disabled");

        accountBasic.dd = decorationDetail.items.calDiscountPrice.val();
        accountBasic.discount = decorationDetail.items.calDiscountPrice.val();
        
        if(!decorationDetail.items.calDiscountPrice.val()) return false;

        accountSuper();
    });

    decorationDetail.items.matching.click(function () {

        accountBasic.cal = decorationDetail.items.matching.prop("checked");
    });

    decorationDetail.items.otherPaymentType.on("change", function () {

        var that = $(this);
        
        var config = {};

        $.each(accountBasic.machingType, function (i, v) {
            if(that.val() == v.dmid) config = v;
        });

        accountBasic.cal = decorationDetail.items.matching.prop("checked");

        $.extend(accountBasic, config);

        config.type == 0 ? decorationDetail.items.calDiscountPrice.removeAttr("readonly").val(com.checkNull(accountBasic.dd, 0)) : decorationDetail.items.calDiscountPrice.attr("readonly", "readonly").val(accountBasic.discount);

        return false;
    });

    decorationDetail.btns.print.click(function(){
        
        accountBasic.preferences = decorationDetail.items.preferences.val() ? decorationDetail.items.preferences.val() : 0;
        accountBasic.internalCoupon = decorationDetail.items.internalCoupon.val() ? decorationDetail.items.internalCoupon.val() : 0;
        accountBasic.fulldel = decorationDetail.items.fulldel.val() ? decorationDetail.items.fulldel.val() : 0;
        accountBasic.cashback = decorationDetail.items.cashback.val() ? decorationDetail.items.cashback.val() : 0;

        params["decoration"] = decoration;
        params["accountBasic"] = accountBasic;
        params["orderTypeness"] = decorationDetail.orderType;

        com.popup("打印决算信息", api.index.decorationAccountOutputIndex.url, null, null, accountBasic.isPrint);
    });

    decorationDetail.btns.updateBtn.click(function () {

        com.showConfirm("确定要更新决算信息吗?", function () {

            var option = {
                "decorationAccount.orderId": params.decorationOrderId,
                "decorationAccount.name": accountBasic.name,
                "decorationAccount.type": accountBasic.type,
                "decorationAccount.typeness": accountBasic.typeness,
                "decorationAccount.arcal": accountBasic.cal ? 0: 1,
                "decorationAccount.matching": accountBasic.material,
                "decorationAccount.discount": accountBasic.discount,
                "decorationAccount.discountBase": accountBasic.base,
                "decorationAccount.serviceRate": accountBasic.service,
                "decorationAccount.materialPrice": accountBasic.materialAccount,
                "decorationAccount.servicePrice": accountBasic.accountServicePrice,
                "decorationAccount.difference": accountBasic.balanceSum,
                "decorationAccount.coupon": accountBasic.preferences,
                "decorationAccount.internal": accountBasic.internalCoupon,
                "decorationAccount.fulldel": accountBasic.fulldel,
                "decorationAccount.cashback": accountBasic.cashback,
                
                "decorationAccount.comment": decorationDetail.items.comment.val()
            };

            com.post(api.decoration.updateDecorationAccount, option, function (res) {
                com.showAlert(com.info, "更新保存成功");
               
                accountBasic.isPrint = true;
            });

        });
    });

    decorationDetail.btns.submission.click(function () {

        if (com.validate('controls')) return false;

        com.showConfirm("确定锁定新决算信息吗?", function () {
           com.post(api.decoration.makeDecorationAccount, {"decorationAccount.orderId": params.decorationOrderId}, function (res) {
                com.showAlert(com.info, "锁定成功");
            });
        });
    });
    
    function accountSuper(){

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
        
        var contartval = 0, _ = 0, service = 0, sub = 0, direct = 0, beforeTotal = 0, management = 0, materialAccount = 0;

        var flag = accountBasic.cal && accountBasic.type == 2 ? 1 : 0;

        if([0, 1].indexOf(accountBasic.type) != -1){

            contartval = accountBasic.disPrice * accountBasic.dd / 10 + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.managePrice;

            beforeTotal = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice;

            direct = beforeTotal + accountBasic.managePrice;

            management = accountBasic.managePrice;

            sub = contartval + service - accountBasic.factPrice - accountBasic.servicePaidup + accountBasic.reduceDisPrice * (accountBasic.discount / 10) + accountBasic.reduceUndisPrice + Math.round(accountBasic.reduceManagePrice) - Math.round(accountBasic.reduceTotalPrice) - decorationDetail.items.preferences.val() - decorationDetail.items.internalCoupon.val() - decorationDetail.items.fulldel.val() - decorationDetail.items.cashback.val();
            
        }

        if (accountBasic.type == 2) {

            _ = accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag;

            contartval = (_ - (_) % accountBasic.base) * (accountBasic.discount / 10) + (_) % accountBasic.base + accountBasic.managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;

            service = (_  + accountBasic.managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag) * accountBasic.material * accountBasic.service;

            direct = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.managePrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;

            beforeTotal = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag;

            management = accountBasic.managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;
            
            sub = contartval + service - accountBasic.factPrice - accountBasic.servicePaidup - accountBasic.addTotalPrice * flag + accountBasic.reduceTotalPrice * flag + accountBasic.addUncalPrice * flag  - decorationDetail.items.preferences.val() - decorationDetail.items.internalCoupon.val() - decorationDetail.items.fulldel.val() - decorationDetail.items.cashback.val();
        }
        
        materialAccount = direct * accountBasic.material;
        
        accountBasic.direct = Math.round(direct);
        accountBasic.beforeTotal = Math.round(beforeTotal);
        accountBasic.management = Math.round(management);
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
    }

});