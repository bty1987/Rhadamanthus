$(function () {
    var accountType = {};
    var serviceRates = 0;
    var decorationDetail = {
        decorationOrderId: null,
        orderType: "",
        type: {
            0: "半包",
            1: "全包",
            2: "半价",
            3: "满减"
        },

        decoration: {},
        customer: {},
        village: {},

        quotationDetail: {},

        btnSaveBasedecorationInfo: null,

        validator: {
            houseNumber: {
                type: "v_houseNumber",
                regex: /^D_\d{3}$/g,
                errorMsg: "楼盘名称规则"
            }
        },

        items: {},

        vRepeatFlg: false,
        cRepeatFlg: false,
        accountFlag: false
    };

    decorationDetail.discount = 10;

    decorationDetail.decorationOrderId = params.decorationOrderId;
    decorationDetail.orderType = params.type;
    decorationDetail.orderStatus = params.status;

    decorationDetail.accountModal = com.focusPage("#applyDecorationAccount");
    decorationDetail.items.maching = com.focusPage("#maching");
    decorationDetail.items.discount = com.focusPage("#discount");
    decorationDetail.items.projectPrice = com.focusPage("#projectPrice");
    decorationDetail.items.serviceRate = com.focusPage("#serviceRate");
    decorationDetail.items.materialPrice = com.focusPage("#materialPrice");
    decorationDetail.items.accountType = com.focusPage("#accountType");
    decorationDetail.items.TotalPrice = com.focusPage("#TotalPrice");

    com.focusPage('#btnBack').on(ace.click_event, function () {
        com.switchPage(params.historyPage);
    });

    decorationUtils.init();
    decorationUtils.initMaterial(decorationDetail);

    initWizard(decorationDetail.discount, decorationDetail);

    setTimeout(function () {
        quotationUtils.loadQuotationDetail();
    }, 500);

    com.post(api.ds.decoration, {}, function(res){
        com.focusPage("#accountType").bindData(res.orderType, "key", "value");
        $.each(res.orderType,function (i,val) {
            accountType[val.key] = val.value;
        });
    }, null, false);

    //初始向导
    function initWizard(discount, decorationDetail) {
        com.focusPage('#fuelux-wizard').ace_wizard({"status": true}).on('change', function (e, info) {

            var curstep = 0;

            info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;

            if (curstep == 1) {
                quotationUtils.loadQuotationDetail();
            } else if (curstep == 2) {
                decorationUtils.initMaterial(decorationDetail);
            } else if (curstep == 3) {
                com.focusPage('#step3').empty();
                drawBase("step3", decorationDetail);
                drawTable(discount);
            }
        }).on('finished', function (e) {
            com.switchPage(params.historyPage);
        }).on('stepclick', function (e, info) {

            if (info.step == 1) {
                quotationUtils.loadQuotationDetail();
            } else if (info.step == 2) {
                decorationUtils.initMaterial(decorationDetail);
            } else if (info.step == 3) {
                com.focusPage('#step3').empty();
                drawBase("step3", decorationDetail);
                drawTable(discount);
                if(decorationDetail.accountFlag){
                    com.focusPage("button[name='makeAccount']").addClass("hide");
                    showDecorationAccount();
                }
            }
        }).on('next', function (e, info) {
        }).on('previous', function (e, info) {
        });
    }

    //画表
    function drawTable(discount) {
        var machingType = {};
        var decorationDetail = quotationUtils.quotationDetail;
        var quotation = decorationDetail.quotation;
        var payed = utils.changeTwoDecimal(com.focusPage('#materialPaidup').text() + com.focusPage('#servicePaidup').text());

        //半价
        com.post(api.decoration.queryDecorationConfig, {}, function (res) {
            machingType = res.config.machingType;
        }, null, false);

        var partCanDiscount = utils.changeTwoDecimal(decorationDetail.quotationUndisPrice + decorationDetail.minusQuoUndisPrice);
        var partNotDiscount = utils.changeTwoDecimal(decorationDetail.quotationTotalPrice + decorationDetail.addReduceTotal + decorationDetail.minusQuoTotalPrice + decorationDetail.minusAddReduceTotal + decorationDetail.minusExtensionTotalPrice + decorationDetail.extensionItemTotalPrice);
        var holonomyCanDiscount = utils.changeTwoDecimal(decorationDetail.quotationUndisPrice + decorationDetail.minusQuoUndisPrice + decorationDetail.quotationTotalPrice + decorationDetail.addReduceTotal + decorationDetail.minusQuoTotalPrice + decorationDetail.minusAddReduceTotal);
        var holonomyNotDiscount = utils.changeTwoDecimal(decorationDetail.minusExtensionTotalPrice + decorationDetail.extensionItemTotalPrice);


        var partTotal = utils.changeTwoDecimal(quotationUtils.quotationTotal());  // 折前总价
        var discountTotal = utils.changeTwoDecimal(quotationUtils.quotationCalculator(discount, 0));
        var transfee = utils.changeTwoDecimal(quotation.trafficPrice); // 车运费
        var managefee = utils.changeTwoDecimal(quotation.managePrice); // 管理费
        var table = $('<div></div>').html(null).addClass("fl-quo-cal");

        var divItem1 = $('<div></div>').addClass('fl-quo-cal-item');

        divItem1.append(createCalItem("基础", 'normal border-right alert-info'), createCalItem("", 'normal border-left-right alert-info'), createCalItem("", 'normal border-left-right alert-info'), createCalItem("", 'normal border-left-right alert-info'), createCalItem("", 'normal border-left alert-info'), createCalItem("装修", ' small border-left-right alert-success'), createCalItem("", 'normal border-left alert-success'), createCalItem("主材", 'small border-left-right alert-danger'), createCalItem("", 'normal border-left-right alert-danger'), createCalItem("", 'normal border-left-right alert-danger'), createCalItem("", 'normal noborder'));
        divItem1.appendTo(table);

        var divItem2 = $('<div></div>').addClass('fl-quo-cal-item');
        divItem2.append(createCalItem("版本", 'normal'), createCalItem("折前总价", 'normal'), createCalItem("打折项总额", 'normal'), createCalItem("非打折项总额", 'normal'), createCalItem("管理费", 'normal'), createCalItem("折扣", 'small'), createCalItem("折后总价", 'normal'), createCalItem("配比", 'small'), createCalItem("主材额", 'normal'), createCalItem("服务费", 'normal'), createCalItem("总额", ' normal alert-warning'));
        divItem2.appendTo(table);

        var partDiv = $('<div></div>').addClass('fl-quo-cal-item');
        partDiv.append(createCalItem("半包", 'normal'), createCalItem(partTotal, 'normal'), createCalItem(partCanDiscount, 'normal'), createCalItem(utils.changeTwoDecimal(utils.accAdd(partNotDiscount, transfee)), 'normal'), createCalItem(managefee, 'normal'), createCalItem(discount, 'small'), createCalItem(discountTotal, 'normal'), createCalItem("-", 'small'), createCalItem("-", 'normal'), createCalItem("-", 'normal'), createCalItem(utils.changeTwoDecimal(discountTotal), 'normal alert-warning'));
        partDiv.appendTo(table);

        $.each(machingType, function (i, v) {
            var projectPrice = quotationUtils.quotationCalculator(v["dd"], v["dt"], v["db"]); // 半价折后总价
            var materialPrice = quotationUtils.quotationMaterial(v["mm"]);//半价主材总额
            var servicePrice = utils.changeTwoDecimal(utils.accMul(materialPrice, parseFloat(serviceRates)));//半价服务费
            var total = utils.changeTwoDecimal(utils.accAdd(projectPrice, utils.accAdd(materialPrice, servicePrice)));  //半价总额

            var holonomyDiv = $('<div></div>').addClass('fl-quo-cal-item');

            if (i == Math.ceil(machingType.length / 2) - 1) {
                holonomyDiv.append(createCalItem(v["n"], 'normal border-top'), createCalItem(partTotal, 'normal border-top'), createCalItem(utils.accAdd(utils.accAdd(holonomyCanDiscount, holonomyNotDiscount), transfee), 'normal border-top'), createCalItem("-", 'normal border-top'), createCalItem(managefee, 'normal border-top'), createCalItem(v["dd"], 'small'), createCalItem(projectPrice, 'normal'), createCalItem(utils.accMul(v["mm"], 100) + "%", 'small'), createCalItem(materialPrice, 'normal'), createCalItem(servicePrice, 'normal'), createCalItem((total), 'normal alert-warning'));
            }else {
                holonomyDiv.append(createCalItem(v["n"], 'normal'), createCalItem(partTotal, 'normal'), createCalItem(utils.accAdd(utils.accAdd(holonomyCanDiscount, holonomyNotDiscount), transfee), 'normal'), createCalItem("-", 'normal'), createCalItem(managefee, 'normal'), createCalItem(v["dd"], 'small'), createCalItem(projectPrice, 'normal'), createCalItem(utils.accMul(v["mm"], 100) + "%", 'small'), createCalItem(materialPrice, 'normal'), createCalItem(servicePrice, 'normal'), createCalItem((total), 'normal alert-warning'));
            }
            holonomyDiv.appendTo(table);
        });

        var inputMainDiv = $("<div></div>").addClass("fl-quo-cal-item");
        var input = $("<input>").attr("type", "text").addClass("cell").css({"width": "17.8%"}).attr("id", "calDiscount").attr("maxlength", "4").val(discount);
        var accountButton = $("<button></button>").addClass("btn btn-primary cell normal btn-warning").attr({"type": "button", "name": "makeAccount"}).text("生成决算");
        var inputButton = $("<button></button>").addClass("btn btn-primary cell normal").attr("type", "button").text("计算").off('click').on('click', function () {
            discount = com.focusPage("#calDiscount").val();
            com.focusPage(".fl-quo-cal").remove();

            drawTable(discount,decorationDetail.undisPrice, decorationDetail.totalPrice);
        });
        inputMainDiv.append(createCalItem("输入折扣", 'normal'), input,inputButton, accountButton, createCalItem(" ", 'normal  border-top').css({"border-width": "1px 0px 0px 0px"}), createCalItem(" ", 'small border-top').css({"border-width": "1px 0px 0px 0px"}), createCalItem(" ", 'normal border-top').css({"border-width": "1px 0px 0px 0px"}), createCalItem(" ", 'small border-top').css({"border-width": "1px 0px 0px 0px"}), createCalItem(" ", 'normal border-top').css({"border-width": "1px 0px 0px 0px"}), createCalItem(" ", 'normal').css({"border-width": "1px 0px 0px 0px"}), createCalItem("", 'normal border-top ').css({"border-width": "1px 0px 0px 0px"})).appendTo(table);
        table.appendTo(com.focusPage('#step3'));

        if (params.status == 6) {
            accountButton.addClass("hide");
        } else {
            accountButton.bindClick(function () {
                com.focusPage("#applyDecorationAccount").modal("show");
            });
        }
        function createCalItem(text, inclass) {
            return $('<div></div>').html(text).addClass('cell').addClass(inclass);
        }
    }

    com.focusPage("#submitDecorationAccountBtn").click(function () {
        saveDecorationAccount();
    });

    //画基础
    function drawBase(divid, decorationDetail) {
        // decorationDetail.type[decorationDetail.orderType] == 满减
        com.focusPage('#' + divid).append(deployAccount("accountPayment",decorationDetail.type[decorationDetail.orderType] + "款项信息", [
            ["col-md-4", "折前总价", "quotationPrice", true],
            ["col-md-4", "工程总额", "projectPrice", true],
            ["col-md-4", "管理费", "managePrice", false],
            ["col-md-4", "主材总额", "materialPrice", true],
            ["col-md-4", "实收主材额", "materialPaidup", true],
            ["col-md-4", "主材额百分比", "materialPercent", false],
            ["col-md-4", "服务费", "servicePrice", true],
            ["col-md-4", "实收服务费", "servicePaidup", true],
            ["col-md-4", "服务费百分比", "servicePercent", false]
        ]));

        com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decoration.orderId": decorationDetail.decorationOrderId}, function (res) {

            serviceRates = res.decorationHolonomy.serviceRate;

            if(res.decorationHolonomy.dhid != null) {
                showPaymentInfo(res.decorationHolonomy, decorationDetail.accountFlag);
            }

        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);

        if (params.status == 6) {
            showDecorationAccount();
        }
    }

    //创建完整
    function createDivForHolonomy(inclass, string, id, isleft) {

        return $("<div></div>").addClass(inclass).css(isleft ? {"border-left": "solid 1px #e3e3e3", "margin-top": "15px"} : {
            "border-left": "solid 1px #e3e3e3", "border-right": "solid 1px #e3e3e3", "margin-top": "15px"
        }).append($("<h5></h5>").addClass('bigger-110 center').html(string)).append($("<h2></h2>").addClass('oid bigger  center').append($('<b></b>').addClass('blue').attr('id', id).html(0)));
    }

    //配置
    function deployAccount(id, title, content) {
        var holonomyDiv = $("<div id="+ id +"></div>").addClass('row');
        var holonomyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html(title)));
        var holonomyBody = $("<div></div>").addClass('widget-body');
        var holonomyTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});
        holonomyBody.append($("<div></div>").addClass('widget-body-inner').append(holonomyTable));

        $.each(content, function (i, v) {
            createDivForHolonomy(v[0], v[1], v[2], v[3]).appendTo(holonomyTable);
        });

        holonomyDiv.append($("<div></div>").addClass('widget-container-span col-md-12').append($("<div></div>").addClass('widget-box transparent').append(holonomyHeader, holonomyBody)));

        $('<div></div>').addClass('hr col-md-12').appendTo(holonomyDiv);
        $('<div></div>').addClass('hr col-md-12').prependTo(holonomyDiv);

        return holonomyDiv;
    }


    function saveDecorationAccount() {
        if (com.validate()) {
            return;
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
            showDecorationAccount();
        });
    }

    function showPaymentInfo(res,accountFlag){
        var managePrice = com.checkNull(res.managePrice,0); //管理费 0
        var decorationDetail = quotationUtils.quotationDetail; //报价中信息
        var quotation = decorationDetail.quotation; // 订单中的信息
        var quoManagePrice = utils.changeTwoDecimal(quotation.managePrice);// 报价中管理费
        var materialPaidup =com.checkNull(res.materialPaidup,0);//实收主材额
        var servicePaidup = com.checkNull(res.servicePaidup,0);//实收服务额

        if(params.status !=6){
            com.focusPage('#projectPrice').html(utils.changeTwoDecimal(utils.accAdd(com.checkNull(res.projectPrice,0),com.checkNull(managePrice,accountFlag ==false  ? managePrice : quoManagePrice))));
            com.focusPage('#managePrice').html(com.checkNull(managePrice,accountFlag ==false ? managePrice : quoManagePrice));
            managePrice = com.checkNull(managePrice,accountFlag == false ? managePrice : quoManagePrice );
        }else{
            com.focusPage('#projectPrice').html(utils.changeTwoDecimal(utils.accAdd(com.checkNull(res.projectPrice,0),com.checkNull(managePrice,accountFlag ==false  ? quoManagePrice : managePrice))));
            com.focusPage('#managePrice').html(com.checkNull(managePrice,accountFlag ==false ? quoManagePrice : managePrice));
            managePrice = com.checkNull(managePrice,accountFlag == false ? quoManagePrice : managePrice );
        }

        com.focusPage('#materialPrice').html(com.checkNull(res.materialPrice,0));
        com.focusPage('#servicePrice').html(com.checkNull(res.servicePrice,0));
        com.focusPage('#servicePaidup').html(servicePaidup);
        com.focusPage('#materialPaidup').html(materialPaidup);

        com.focusPage('#quotationPrice').html(managePrice == null ? 0: utils.changeTwoDecimal(res.projectBase));

        com.focusPage('#materialPercent').html(res.materialPrice == null ? 0 :utils.accMul(utils.changeTwoDecimal(utils.accDiv(materialPaidup, res.materialPrice)), 100) > 100 ? 100 : utils.accMul(utils.changeTwoDecimal(utils.accDiv(materialPaidup, res.materialPrice)), 100)+"%");
        if(res.servicePrice != 0) {
            com.focusPage('#servicePercent').html(res.servicePrice == null ? 0 : utils.accMul(utils.changeTwoDecimal(utils.accDiv(servicePaidup, res.servicePrice)), 100) > 100 ? 100 : utils.accMul(utils.changeTwoDecimal(utils.accDiv(servicePaidup, res.servicePrice)), 100) + "%");
        }
    }
    var decorationOrderId = params.decorationOrderId;
    function showDecorationAccount() {
        com.post(api.decoration.queryDecorationAccount, {"decorationAccount.orderId": decorationOrderId}, function (res) {
            com.focusPage("#accountPayment").append(deployAccount("account","决算信息", [
                ["col-md-4", "主材配比", "maching", true],
                ["col-md-4", "折扣", "discount", true],
                ["col-md-4", "工程总额", "projectPrice_account", false],
                ["col-md-4", "主材总额", "materialPrice_account", true],
                ["col-md-4", "服务费比例", "serviceRate", true],
                ["col-md-4", "服务费", "servicePrice_account", false]
            ]));

            res = res.decorationAccount;

            com.focusPage('#maching').html((utils.changeTwoDecimal(com.checkNull(res.maching, 0) *100)+"%"));
            com.focusPage('#discount').html(com.checkNull(res.discount,0));
            com.focusPage('#projectPrice_account').html(com.checkNull(res.projectPrice,0));
            com.focusPage('#materialPrice_account').html(com.checkNull(res.materialPrice,0));
            com.focusPage('#serviceRate').html(utils.changeTwoDecimal(com.checkNull(res.serviceRate,0) *100)+"%");
            com.focusPage('#servicePrice_account').html(com.checkNull(res.servicePrice),0);
            
            showPaymentInfo(res, decorationDetail.accountFlag);

        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }

});