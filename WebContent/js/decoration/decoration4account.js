$(function () {
    
    var decorationDetail = {
        decorationOrderId: null,
        type: {
            0: "半包",
            1: "全包",
            2: "半价",
            3: "满减",
            4: "减上捡"
        },
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
            balanceSum: com.focusPage("#balanceSum")
        },
        items: {
            calDiscountPrice: com.focusPage("#calDiscountPrice"),
            preferences: com.focusPage("#preferences"),
            fulldel: com.focusPage("#fulldel"),
            cashback: com.focusPage("#cashback"),
            matching: com.focusPage("#matching").switchBtn("isOrNotType"),
            fueluxWizard: com.focusPage('#fuelux-wizard'),
            materialBrand: com.focusPage("#materialBrand"),
            tabContent: com.focusPage(".tab-content"),
            fanglinMaterialPayment: com.focusPage("#fanglinMaterialPayment"),
            salesMaterialPayment: com.focusPage("#salesMaterialPayment"),
            otherPaymentType: com.focusPage("#otherPaymentType")
        },
        btns: {
            btnBack: com.focusPage('#btnBack'),
            calculateBtn: com.focusPage("#calculateBtn"),
            submission: com.focusPage("#submission"),
            print: com.focusPage("#print")
        }
    };
    var decoration;

    decorationDetail.decorationOrderId = params.decorationOrderId;

    var accountBasic = {
            
        machingType: [],
            
        discount: 0,
            
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

        dd: 0,
        db: 0,
        mm: 0,
        sr: 0,
        
        cal: false
    };

    decorationDetail.btns.btnBack.on(ace.click_event, function () {
        com.switchPage(params.historyPage);
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

    decorationDetail.materialItems.materialTotal.html(material.total);
    decorationDetail.materialItems.materialCoupon.html(material.coupon);
    decorationDetail.materialItems.materialFactPrice.html(utils.accSub(material.total, material.coupon));

    com.post(api.payment.queryAdvancePaymentByOrderId, {"decoration.orderId": decorationDetail.decorationOrderId}, function (res) {
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

        decorationDetail.basicsItems.foldFrontTotal.html(Math.round(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.managePrice));
        decorationDetail.basicsItems.foldFrontFee.html(Math.round(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice));
        decorationDetail.basicsItems.managePrice.html(Math.round(accountBasic.managePrice));

        decorationDetail.contractItems.mm.html(utils.changeThrDecimal(decorationDetail.materialItems.materialRatio.text() / decorationDetail.basicsItems.foldFrontTotal.text()));
    });

    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": decorationDetail.decorationOrderId}, function (res) {
    	 
    	decoration = res.decoration;
    	
    	accountBasic.discount = decoration.discount;
        accountBasic.contracePrice = decoration.orderTotalPrice;
        accountBasic.couponCut = decoration.couponCut;
        accountBasic.factPrice = decoration.factPrice;

        decorationDetail.contractItems.signPrice.html(com.checkNull(Math.round(accountBasic.contracePrice), 0));
        decorationDetail.contractItems.coupon.html(com.checkNull(Math.round(accountBasic.couponCut), 0));
        decorationDetail.contractItems.signFactPrice.html(com.checkNull(Math.round(accountBasic.factPrice), 0));
        decorationDetail.basicsItems.basdiscount.html(com.checkNull(accountBasic.discount, 0));
    	
    }, null, false);
    
    com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decoration.orderId": decorationDetail.decorationOrderId}, function (res) {

        var decorationHolonomy = res.decorationHolonomy;

        accountBasic.servicePrice = decorationHolonomy.servicePrice;
        accountBasic.materialRatio = decorationHolonomy.materialPrice;
        accountBasic.servicePaidup = decorationHolonomy.servicePaidup;

        decorationDetail.contractItems.servicePrice.html(com.checkNull(Math.round(accountBasic.servicePrice), 0));
        decorationDetail.materialItems.materialRatio.html(com.checkNull(Math.round(accountBasic.materialRatio), 0));
        decorationDetail.contractItems.servicePaidup.html(com.checkNull(Math.round(accountBasic.servicePaidup), 0));

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
    
    accountBasic.machingType.push({id: "-1", n: "半包", dt: 0, db: 0, dd: 0, mm: 0, sr: 0});

    com.post(api.decoration.queryDecorationConfig, {}, function (res) {
        
        accountBasic.machingType = accountBasic.machingType.concat(res.config.machingType);

        decorationDetail.items.otherPaymentType.bindData(accountBasic.machingType, "id", "n", true);

    }, null, false);

    decorationDetail.btns.calculateBtn.click(function () {

        if (com.validate('controls')) return false;

        decorationDetail.btns.submission.removeAttr("disabled");

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
            if(that.val() == v.id) config = v;

        });

        accountBasic.cal = decorationDetail.items.matching.prop("checked");

        $.extend(accountBasic, config);

        that.val() == -1 ? decorationDetail.items.calDiscountPrice.removeAttr("readonly").val(com.checkNull(accountBasic.discount, 0)) : decorationDetail.items.calDiscountPrice.attr("readonly", "readonly").val(accountBasic.dd);

        return false;
    });

    decorationDetail.btns.print.click(function(){

        params["decoration"] = decoration;
        params["accountForehead"] = accountBasic.accountForehead;
        params["balanceSum"] = accountBasic.balanceSum;

        com.popup("打印决算信息", api.index.decorationOutputIndex.url, null, null, true);
    });

    decorationDetail.btns.submission.click(function () {

        if (com.validate('controls')) return false;
        com.showConfirm("确定要提交决算信息吗?", function () {

            var option = {
                "decorationAccount.orderId": params.decorationOrderId,
                "decorationAccount.type": decorationDetail.items.otherPaymentType.val(),
                "decorationAccount.arcal": accountBasic.cal ? 0: 1,
                "decorationAccount.matching": accountBasic.mm,
                "decorationAccount.discount": decorationDetail.items.calDiscountPrice.val(),
                "decorationAccount.discountBase": accountBasic.db,
                "decorationAccount.serviceRate": accountBasic.sr,
                "decorationAccount.materialPrice": decorationDetail.materialItems.materialTotal.text(),
                "decorationAccount.servicePrice": decorationDetail.accountItems.accountServicePrice.text(),
                "decorationAccount.difference": decorationDetail.accountItems.balanceSum.text(),
                "decorationAccount.coupon": decorationDetail.items.preferences.val(),
                "decorationAccount.fulldel": decorationDetail.items.fulldel.val(),
                "decorationAccount.cashback": decorationDetail.items.cashback.val()
            };

            com.post(api.decoration.makeDecorationAccount, option, function (res) {
                com.showAlert(com.info, "提交成功");
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

        var contartval = 0, _ = 0, service = 0, sub = 0, direct = 0, beforeTotal = 0, management = 0, materialAccount = 0;

        var flag = accountBasic.cal && ["2", "3", "4"].indexOf(accountBasic.dt) != -1 ? 1 : 0;

        if([0, 1].indexOf(accountBasic.dt) != -1){

            contartval = accountBasic.disPrice * accountBasic.discount / 10 + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.managePrice;

            beforeTotal = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice;

            direct = beforeTotal + accountBasic.managePrice;

            management = accountBasic.managePrice;

            sub = contartval + service - accountBasic.factPrice - accountBasic.servicePaidup - accountBasic.reduceDisPrice * (decorationDetail.items.calDiscountPrice.val() / 10) + accountBasic.reduceUndisPrice + Math.round(accountBasic.reduceManagePrice) - Math.round(accountBasic.reduceTotalPrice) - decorationDetail.items.preferences.val() - decorationDetail.items.fulldel.val() - decorationDetail.items.cashback.val();
        }else{

            _ = accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag;

            contartval = (_ - (_) % accountBasic.db) * (accountBasic.dd / 10) + (_) % accountBasic.db + accountBasic.managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;

            service = (_  + accountBasic.managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag) * accountBasic.mm * accountBasic.sr;

            direct = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.managePrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;

            beforeTotal = accountBasic.disPrice + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag;

            management = accountBasic.managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;
            
            sub = contartval + service - accountBasic.factPrice - accountBasic.servicePaidup - accountBasic.addTotalPrice * flag + accountBasic.reduceTotalPrice * flag + accountBasic.addUncalPrice * flag  - decorationDetail.items.preferences.val() - decorationDetail.items.fulldel.val() - decorationDetail.items.cashback.val();
        }

        materialAccount = direct * accountBasic.mm;

        decorationDetail.accountItems.accountForehead.html(Math.round(contartval));
        decorationDetail.accountItems.accountServicePrice.html(Math.round(service));
        decorationDetail.accountItems.balanceSum.html(Math.round(sub));

        decorationDetail.accountItems.direct.html(Math.round(direct));
        decorationDetail.accountItems.beforeTotal.html(Math.round(beforeTotal));
        decorationDetail.accountItems.management.html(Math.round(management));
        decorationDetail.accountItems.materialAccount.html(Math.round(materialAccount));

        accountBasic.accountForehead = Math.round(contartval);
        accountBasic.balanceSum = Math.round(sub);
        
        decorationDetail.accountItems.flowerRatio.html(utils.changeTwoDecimal(decorationDetail.materialItems.materialTotal.text() / decorationDetail.accountItems.direct.text()));
    }

});