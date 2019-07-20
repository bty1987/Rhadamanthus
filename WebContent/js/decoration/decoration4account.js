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

        items: {},
    };

    decorationDetail.decorationOrderId = params.decorationOrderId;

    decorationDetail.accountModal = com.focusPage("#applyDecorationAccount");
    decorationDetail.items.maching = com.focusPage("#maching");
    decorationDetail.items.discount = com.focusPage("#discount");
    decorationDetail.items.projectPrice = com.focusPage("#projectPrice");
    decorationDetail.items.serviceRate = com.focusPage("#serviceRate");
    decorationDetail.items.materialPrice = com.focusPage("#materialPrice");
    decorationDetail.items.accountType = com.focusPage("#accountType");
    decorationDetail.items.TotalPrice = com.focusPage("#TotalPrice");

    decorationDetail.items.calDiscountPrice = com.focusPage("#calDiscountPrice");

    com.focusPage("#matching").switchBtn("isOrNotType");

    var accountBasic = {
            
        machingType: [],
            
        discount: 0,
            
        undisPrice: 0,
        disPrice: 0,
        trafficPrice: 0,
        managePrice: 0,
        
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
        
        dd: 0,
        db: 0,
        mm: 0,
        sr: 0,
        
        cal: false
    };

    com.focusPage('#btnBack').on(ace.click_event, function () {
        com.switchPage(params.historyPage);
    });

    initTab();
    decorationUtils.init();
    decorationUtils.initMaterial(decorationDetail);

    initWizard(decorationDetail.discount, decorationDetail);
    
    
    setTimeout(function () {
        quotationUtils.loadQuotationDetail();
    }, 500);

    //初始向导
    function initWizard(discount, decorationDetail) {
        com.focusPage('#fuelux-wizard').ace_wizard({"status": true}).on('change', function (e, info) {

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

    com.focusPage("#submitDecorationAccountBtn").click(function () {
        saveDecorationAccount();
    });
    
    function initTab(){
    	var dataPage = params.urlLoadParams.depage;
        var fanglinMaterial = $('<div></div>').addClass('tab-pane in active').attr('id', 'fanglinMaterialPayments' + dataPage).attr('style', 'margin-left: -12px;');
        var salesMaterial = $('<div></div>').addClass('tab-pane').attr('id', 'salesMaterialPayments' + dataPage).attr('style', 'margin-left: -12px;');
        var materialBrand = $('<div></div>').addClass('widget-body-inner').attr('id', 'materialPaymentBrands' + dataPage);
        
        com.focusPage("#materialBrand").append(materialBrand);
        com.focusPage(".tab-content").append(fanglinMaterial).append(salesMaterial);
        
        com.focusPage("#fanglinMaterialPayment").attr("href", "#fanglinMaterialPayments" + dataPage);
        com.focusPage("#salesMaterialPayment").attr("href", "#salesMaterialPayments" + dataPage);
    }
	
    function saveDecorationAccount() {
        
        if (com.validate("applyDecorationAccount")) {
            return false;
        }

        var options = {
            "decorationAccount.orderId": params.decorationOrderId,
            "decorationAccount.type": decorationDetail.items.accountType.val(),
            "decorationAccount.maching": decorationDetail.items.maching.val(),
            "decorationAccount.projectPrice": decorationDetail.items.projectPrice.val(),
            "decorationAccount.discount": decorationDetail.items.discount.val(),
            "decorationAccount.serviceRate": decorationDetail.items.serviceRate.val(),
            "decorationAccount.materialPrice":decorationDetail.items.materialPrice.val(),
            "decorationAccount.projectBase" : decorationDetail.items.TotalPrice.val()
        };

        com.post(api.decoration.makeDecorationAccount, options, function (res) {
            com.showAlert(com.info, "操作成功");
            decorationDetail.accountFlag = true;
            com.cleanItems(decorationDetail.items);
            decorationDetail.accountModal.modal("hide");
            com.focusPage("button[name='makeAccount']").addClass("hide");
        });
    }
    
    com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": decorationDetail.decorationOrderId}, function(res){
        var quotation = res.quotation;
        
        accountBasic.undisPrice = quotation.undisPrice;
        accountBasic.disPrice = quotation.disPrice;
        accountBasic.trafficPrice = quotation.trafficPrice;
        accountBasic.managePrice = quotation.managePrice;
        
        com.focusPage('#foldFront_total').html(utils.changeTwoDecimal(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.managePrice));
        com.focusPage('#foldFront_fee').html(utils.changeTwoDecimal(accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice));
        com.focusPage('#managePrice').html(utils.changeTwoDecimal(accountBasic.managePrice));
    });

    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": decorationDetail.decorationOrderId}, function (res) {
    	 
    	var decoration = res.decoration;
    	
    	accountBasic.discount = decoration.discount;
        accountBasic.contracePrice = decoration.orderTotalPrice;
        accountBasic.couponCut = decoration.couponCut;
        accountBasic.factPrice = decoration.factPrice;
         
        com.focusPage("#signPrice").html(com.checkNull(accountBasic.contracePrice, 0));
        com.focusPage("#coupon").html(com.checkNull(accountBasic.couponCut, 0));
        com.focusPage("#signFactPrice").html(com.checkNull(accountBasic.factPrice, 0));
        com.focusPage("#basdiscount").html(com.checkNull(accountBasic.discount, 0));
    	
    }, null, false);
    
    com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decoration.orderId": decorationDetail.decorationOrderId}, function (res) {
        
        accountBasic.servicePrice = res.decorationHolonomy.servicePrice;
       
        com.focusPage("#servicePrice").html(com.checkNull(accountBasic.servicePrice, 0));

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
            }
        });

        com.focusPage("#addFoldFront_total").html(accountBasic.addPredisPrice);
        com.focusPage("#addManagePrice").html(accountBasic.addManagePrice);
        com.focusPage("#addMatch").html(accountBasic.addCalPrice);
        com.focusPage("#addUncalPrice").html(accountBasic.addUncalPrice);
        
        com.focusPage("#minusFoldFront_total").html(accountBasic.reducePredisPrice);
        com.focusPage("#minusManagePrice").html(accountBasic.reduceManagePrice);
        com.focusPage("#minusMatch").html(accountBasic.reduceCalPrice);
        com.focusPage("#minusUncalPrice").html(accountBasic.reduceUncalPrice);

    }, null, false);
    
    accountBasic.machingType.push({id: "-1", n: "半包", dt: 0, db: 0, dd: 0, mm: 0, sr: 0});

    com.post(api.decoration.queryDecorationConfig, {}, function (res) {
        
        accountBasic.machingType = accountBasic.machingType.concat(res.config.machingType);
        
        com.focusPage("#otherPaymentType").bindData(accountBasic.machingType, "id", "n", true);

    }, null, false);
    
    com.focusPage("#calculateBtn").click(function () {
        accountBasic.discount = decorationDetail.items.calDiscountPrice.val();
        if(!decorationDetail.items.calDiscountPrice.val()) return false;

        accountSuper()
    });
    
    com.focusPage("#matching").click(function () {

        accountBasic.cal = com.focusPage("#matching").prop("checked");
    });
    
    com.focusPage("#otherPaymentType").on("change", function () {

        var that = $(this);
        
        var config = {};

        $.each(accountBasic.machingType, function (i, v) {
            if(that.val() == v.id) config = v;

        });

        accountBasic.cal = com.focusPage("#matching").prop("checked");

        $.extend(accountBasic, config);

        that.val() == -1 ? decorationDetail.items.calDiscountPrice.removeAttr("readonly").val(com.checkNull(accountBasic.discount, 0)) : decorationDetail.items.calDiscountPrice.attr("readonly", "readonly").val(accountBasic.dd);

        return false;
    });
    
    function accountSuper(){

        //决算合同额(算配比) = (折前直接费 + 增项配比总额 - 减项配比总额 - (折前直接费 + 增项配比总额 - 减项配比总额) % 基数) * 折扣 + 折前直接费 + 增项配比总额 - 减项配比总额 % 基数 + 管理费 + 增项管理费 - 减项管理费
        //
        // 决算合同额(非配比) = (折前直接费 - 折前直接费 % 基数) * 折扣 + 折前直接费 % 基数 + 管理费
        //
        // 决算服务费(算配比) = (折前直接费 + 增项配比总额 - 减项配比总额 + 管理费 + 增项管理费 - 减项管理费) * 主材配比 * 服务费比例
        //
        // 决算服务费(非配比) = (折前直接费 + 管理费) * 主材配比 * 服务费比例
        //
        // 差额(算配比) = 决算合同额 + 决算服务费 - 合同实收 - 合同服务 - 增项实收 + 减项实收 + 增项非配比总额 - 减项非配比总额
        //
        // 差额(非配比) = 决算合同额 + 决算服务费 - 合同实收 - 合同服务

        var contartval = 0, _ = 0, service = 0, sub = 0;

        var flag = accountBasic.cal && ["2", "3", "4"].indexOf(accountBasic.dt) != -1 ? 1 : 0;

        if([0, 1].indexOf(accountBasic.dt) != -1){

            contartval = accountBasic.disPrice * accountBasic.discount / 10 + accountBasic.undisPrice + accountBasic.trafficPrice + accountBasic.managePrice;
        }else{

            _ = accountBasic.undisPrice + accountBasic.disPrice + accountBasic.trafficPrice + accountBasic.addCalPrice * flag - accountBasic.reduceCalPrice * flag;

            contartval = (_ - (_) % accountBasic.db) * (accountBasic.dd / 10) + (_) % accountBasic.db + accountBasic.managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag;

            service = (_  + accountBasic.managePrice + accountBasic.addManagePrice * flag - accountBasic.reduceManagePrice * flag) * accountBasic.mm * accountBasic.sr;
        }

        sub = contartval + service - accountBasic.factPrice - accountBasic.servicePrice - accountBasic.addTotalPrice * flag + accountBasic.reduceTotalPrice * flag + accountBasic.addUncalPrice * flag - accountBasic.reduceUncalPrice * flag;

        com.focusPage("#accountForehead").html(utils.changeTwoDecimal(contartval));
        com.focusPage("#accountServicePrice").html(utils.changeTwoDecimal(service));
        com.focusPage("#balanceSum").html(utils.changeTwoDecimal(sub));
    }

});