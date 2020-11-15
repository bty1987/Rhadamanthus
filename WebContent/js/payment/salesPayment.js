
$(function () {
    var salesPayment = {
        htmlName: "sales",
        depage: params['urlLoadParams'].depage,
        type: params['urlLoadParams'].paytype,
        pageConfig: params['urlLoadParams'].depage+params['urlLoadParams'].paytype,
        paytypes: [],
        payment: null,

        items: {
            cashCheckbox: com.focusPage("#cashCheckbox", "#salesPayment"),
            bankCheckbox: com.focusPage("#bankCheckbox", "#salesPayment"),
            checkvCheckbox: com.focusPage("#checkvCheckbox", "#salesPayment"),
            advanceCheckbox: com.focusPage("#advanceCheckbox", "#salesPayment"),
            couponCheckbox: com.focusPage("#couponCheckbox", "#salesPayment"),

            historyDiv: com.focusPage("#historyDiv", "#salesPayment"),
            historyData: com.focusPage("#historyData", "#salesPayment"),
            cashDiv: com.focusPage("#cashDiv", "#salesPayment"),
            checkvDiv: com.focusPage("#checkvDiv", "#salesPayment"),
            advanceDiv: com.focusPage("#advanceDiv", "#salesPayment"),

            cash: com.focusPage("#cash", "#salesPayment"),
            cashInfo: com.focusPage("#cashInfo", "#salesPayment"),

            bankName: com.focusPage("#bankName", "#salesPayment"),
            bank: com.focusPage("#bank", "#salesPayment"),
            posway: com.focusPage("#posway", "#salesPayment"),

            recharge: com.focusPage("#recharge", "#salesPayment"),
            advance: com.focusPage("#advance", "#salesPayment"),
            advanceType: com.focusPage("#advanceType", "#salesPayment"),

            couponType: com.focusPage("#couponType", "#salesPayment"),
            couponVal: com.focusPage("#couponVal", "#salesPayment"),

            posDiv: com.focusPage("#posDiv", "#salesPayment"),
            posGroup: com.focusPage("#posGroup", "#salesPayment"),
            bankDiv: com.focusPage("#bankDiv", "#salesPayment"),
            bankGroup: com.focusPage("#bankGroup", "#salesPayment"),
            checkvGroup: com.focusPage("#checkvGroup", "#salesPayment"),
            couponDiv: com.focusPage("#couponDiv", "#salesPayment"),
            couponInputs: com.focusPage("#couponInputs", "#salesPayment"),
            couponGroup: com.focusPage("#couponGroup", "#salesPayment"),

            referMoney: com.focusPage("#referMoney", "#salesPayment"),
            comment: com.focusPage("#collectDes", "#salesPayment"),

            myModalLabel: com.focusPage("#myModalLabel", "#salesPayment")
        },

        btns: {
            collectBtn: com.focusPage("#collectBtn", "#salesPayment"),
            refundBtn: com.focusPage("#refundBtn", "#salesPayment"),

            checkvAdd: com.focusPage("#checkvAdd", "#salesPayment"),
            couponAdd: com.focusPage("#couponAdd", "#salesPayment"),
            posPush: com.focusPage("#posSend", "#salesPayment")
        },

        modals: {
            collectModal: com.focusPage("#collectModal", "#salesPayment")
        },

        cash: [],
        bank: [],
        checkv: [],
        accounts: [],
        couponType: [],
        posValues: {},

        cashUtil: [],
        bankUtil: [],
        checkvUtil: [],

        cashInfo: {},
        bankInfo: {},
        checkvInfo: {},
        accountsInfo: {},
        couponTypeData: {},

        bankGrade: [],
        checkvGrade: [],

        conditions: [],
        extraParams: {},
        functions: [],
        spids: [],
        isCollects: false,
        salesPaymentTypeData: {},
        decorationType: []
    };

    //隐藏触发
    salesPayment.modals.collectModal.on('hide.bs.modal', function () {

        salesPayment.bankGrade = [];
        salesPayment.checkvGrade = [];
        salesPayment.spids = [];

        salesPayment.items.posGroup.html("");
        salesPayment.items.bankGroup.removeClass('hide');
        salesPayment.items.checkvGroup.html("");
        salesPayment.items.couponGroup.html("");
        salesPayment.items.historyData.html("");
        salesPayment.items.comment.removeAttr("disabled");

        salesPayment.items.bankName.removeClass("v_required v_typeahead");
        salesPayment.items.bank.removeClass("v_required v_float_3");

        salesPayment.isCollects = false;
        salesPayment.payment = null;

        com.closeTip();
        com.cleanItems(salesPayment.items);
    });

    com.post(api.ds.payment, {}, function (res) {
        for (var i = 0; i < res.materialPaymentType.length; i++) {
            var paymentType = res.materialPaymentType[i];
            salesPayment.salesPaymentTypeData[paymentType.key] = paymentType.value;
        }

        salesPayment.items.posway.bindData(res.posway, "key", "value");
    }, null, false);

    com.post(api.ds.decoration, {}, function(res){
        salesPayment.decorationType = res.typeness;
    }, null, false);

    //checkbox选中时联动
    com.focusPage("#collectModal :checkbox", "#salesPayment").on("change", function(){
        var that = $(this);
        var checked = that.prop("checked");
        var id = that.attr("id");

        var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#salesPayment");

        checked ? boxdiv.show() : boxdiv.hide();
    });

    //绑定收款单位的基础信息
    paymentUtils.getReceiptType(salesPayment);

    //现金方式
    com.selectTypeahead("cashInfo", salesPayment.cashUtil, "key", "value", null);

    //转账方式(银行)
    salesPayment.btns.checkvAdd.click(function(){
        paymentUtils.addBank(salesPayment);
        return false;
    });

    //优惠券
    com.selectTypeahead("couponType", salesPayment.couponType, 'no', 'name');

    salesPayment.items.advanceType.bindData([{"key": "3", "value": "主材预付款"}], 'key', 'value');

    salesPayment.btns.collectBtn.bindClick(collect);

    salesPayment.btns.refundBtn.bindClick(collect);

    salesPayment.btns.posPush.unbind().click(function(){
        paymentUtils.pushPos(salesPayment, 3, salesPayment.payment.sales.orderId);
        return false;
    });

    salesPayment.btns.couponAdd.unbind().click(function(){

        if(com.validate("couponInputs", "#salesPayment")) return false;

        paymentUtils.addCounpon();
    });

    //不同页面的不同参数
    switch (salesPayment.type) {
        case "common":
            salesPayment.conditions = ["payment-orderId", "payment-sales-no", "payment-designer", "payment-village"];
            salesPayment.functions = ["decorationInfo", "collect", "batchCollect", "count"];
            salesPayment.extraParams = {"companyType": salesPayment.depage, "salesPayment.status": 0};

            salesPayment.paytypes = ["cash", "bank", "checkv", "advance", "coupon"];
            break;

        case "pos":
            salesPayment.conditions = ["payment-orderId", "payment-sales-no"];
            salesPayment.functions = ["decorationInfo", "collect", "batchCollect", "count"];
            salesPayment.extraParams = {"companyType": salesPayment.depage, "salesPayment.status": 0, "salesPayment.types": "[2, 3, 8]"};
            salesPayment.paytypes = ["bank", "advance"];
            break;

        case "history":
            salesPayment.conditions = ["payment-orderId", "payment-sales-no", "payment-designer", "payment-village", "payment-collectTime"];
            salesPayment.functions = ["decorationInfo", "payway", "print", "update", "export"];
            salesPayment.extraParams = {"companyType": salesPayment.depage};
            salesPayment.paytypes = ["cash", "bank", "checkv", "advance", "coupon"];
            break;

        case "collect":
            salesPayment.conditions = ["payment-orderId", "payment-sales-no", "payment-designer", "payment-village", "payment-collectTime"];
            salesPayment.functions = ["payway", "print", "update", "selectall", "confirms", "export"];
            salesPayment.extraParams = {"companyType": salesPayment.depage, "salesPayment.status": 1, "salesPayment.companys": params.company.cid};
            salesPayment.paytypes = ["cash", "bank", "checkv", "advance", "coupon"];
            break;

        case "confirm":
            salesPayment.conditions = ["payment-orderId", "payment-sales-no", "payment-designer", "payment-village", "payment-confirmTime"];
            salesPayment.functions = ["payway", "print", "export"];
            salesPayment.extraParams = {"companyType": salesPayment.depage, "salesPayment.status": 2, "salesPayment.companys": params.company.cid};
            salesPayment.paytypes = ["cash", "bank", "checkv", "advance", "coupon"];
            break;
    }

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDecorationInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html('装修单信息');
            var $btnCollect = $('<a></a>').addClass('btn btn-minier').html('收款');
            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

            var propertyArr = [
                ["订单号:", v.sales.orderId, "blue"],
                ["销售单号:", v.sales.no, "blue"],
                ["销售单等级:", v.sales.grade, "blue"],
                ["楼盘地址:", v.sales.house.village.cityProper.city.name + ' ' + v.sales.house.village.cityProper.name + ' ' + v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
                ["客户:", v.sales.customer.name, "grey"],
                ["品牌:", v.sales.brand, "grey"],
                ["操作人:", v.creater.currentName, "grey"],
                ["应收金额:", v.referMoney, "blue"],
            ];

            if(v.status == 2){
                propertyArr.push(
                    ["确认人:", v.salesReceipt.confirmer.currentName, "grey"],
                    ["确认时间:", v.salesReceipt.confirmTime, "green"]
                );
            }

            if(v.status != 0){
                propertyArr.push(
                    ["收款人:", v.salesReceipt.collecter.currentName, "grey"],
                    ["收款时间:", v.salesReceipt.collectTime, "green"],
                    ["状态:", v.status == 1 ? '已付款' : '已确认', "red"],
                    ["备注:", v.salesReceipt.comment, "grey"]
                );
            }

            var _label = $('<label></label>');
            var $input = $('<input>').attr({"type": "checkbox", "name": "spids"}).addClass('ace ace-checkbox-2');
            $input.attr({"data-sid": v.sales.sid, "data-spid": v.spid, "data-orderid": v.sales.orderId, "data-refermoney": v.referMoney, "data-type": v.type, "data-grade": v.sales.grade, "data-status": v.status});

            if(salesPayment.functions.contains("batchCollect") || salesPayment.functions.contains("selectall")) $input.appendTo(_label);

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(salesPayment.salesPaymentTypeData[v.type]);

            _label.append(_span).appendTo($h3);

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            if ([2, 3, 8].indexOf(v.type) != -1) $btnCollect.text('收款').addClass("btn-info");
            if ([4, 5, 6, 7].indexOf(v.type) != -1) $btnCollect.text('退款').addClass("btn-danger");

            if(salesPayment.functions.contains("payway")) paymentUtils.drawHistoryData(salesPayment, v.salesReceipt, $liLine, "");

            if (salesPayment.functions.contains("decorationInfo")) $divBtnWrap.append($btnDecorationInfo);
            if(salesPayment.functions.contains("collect")) $divBtnWrap.append($btnCollect);
            if(v.status != 0 && salesPayment.functions.contains("print")) $divBtnWrap.append($btnPrint);
            if(v.status == 1 && salesPayment.functions.contains("update")) $divBtnWrap.append($btnUpdate);

            //收款弹窗
            $btnCollect.click(function () {

                if([2, 3, 8].contains(v.type)) paymentUtils.showPos(salesPayment, {"pointofsales.pid": v.sales.orderId}, [0, 1]);

                initCollect(v, false);

                salesPayment.modals.collectModal.attr({'spid': v.spid, 'sid': v.sales.sid});
            });

            //查看装修单
            $btnDecorationInfo.click(function(){
                paymentUtils.decorationInfoShow(v.sales.orderId, salesPayment.decorationType);
            });

            //打印
            $btnPrint.click(function () {
                printPayment(v.sales.orderId, v.salesReceipt.srId, v);
            });

            //更新
            $btnUpdate.click(function(){

                //应对批量收款的情况
                var referMoney = utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(v.salesReceipt.cash, v.salesReceipt.bank), v.salesReceipt.checkv), v.salesReceipt.coupon), v.salesReceipt.advance);
                v.referMoney = referMoney;

                initUpdate(v);

            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(salesPayment.conditions, 'condList', api.payment.pageSalesPayment, function (data) {
        displayFunc.init('resultList', data);
    }, 'pagenation', 'salesPaymentPostData'+salesPayment.pageConfig, salesPayment.extraParams, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量收款').appendTo($adda);

        var $showa = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'showTotal').css("margin", "0px 3px");
        var $showi = $('<i></i>').addClass('icon-calculator bigger-110').appendTo($showa);
        var $showspan = $('<span></span>').text('合计').appendTo($showa);

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
        var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        var $checkspan = $('<span></span>').text('全选').appendTo($checka);

        var $confirma = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
        var $confirmi = $('<i></i>').addClass('icon-money bigger-110').appendTo($confirma);
        var $confirmspan = $('<span></span>').text('批量确认').appendTo($confirma);

        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        var btnParams = [];

        if(salesPayment.functions.contains("batchCollect")) btnParams.push($adda);
        if(salesPayment.functions.contains("count")) btnParams.push($showa);
        if(salesPayment.functions.contains("selectall")) btnParams.push($checka);
        if(salesPayment.functions.contains("confirms")) btnParams.push($confirma);
        if(salesPayment.functions.contains("export")) btnParams.push($impa);

        return btnParams;

    }, 'resultList');

    //初始化模态框
    function initCollect(payment, isCollects){

        com.cleanItems(salesPayment.items);

        salesPayment.items.historyDiv.hide();

        salesPayment.payment = payment;

        salesPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
        salesPayment.items.comment.removeAttr("disabled");

        var type = [4, 5, 6, 7].contains(payment.type) ? 1 : 0; // 0: 收款类型 , 1: 退款类型

        if(salesPayment.paytypes.contains("cash")) paymentUtils.initCash(salesPayment);
        if(salesPayment.paytypes.contains("bank")) paymentUtils.initBank(salesPayment, type);
        if(salesPayment.paytypes.contains("checkv")) paymentUtils.initCheckv(salesPayment);
        if(salesPayment.paytypes.contains("advance")) paymentUtils.initAdvance(salesPayment, type, {"advancePayment.decoration.orderId": payment.sales.orderId}, "materialAdvance");
        if(salesPayment.paytypes.contains("coupon")) paymentUtils.initCoupon(salesPayment, 0);
        if (isCollects) salesPayment.items.couponCheckbox.parent().addClass("hide");

        //根据装修单等级获取收据类型等级
        var grade = payment.sales.grade == "B" ? "B" : "";

        // 根据等级在数组中筛选出符合要求的用于显示
        paymentUtils.initBankGrade(salesPayment, grade);

        if(type == 1){// 退款

            com.focusPage("#myModalLabel").text("退款信息");

            salesPayment.btns.collectBtn.addClass("hide");
            salesPayment.btns.refundBtn.removeClass("hide");
        }else{

            isCollects ? com.focusPage("#myModalLabel").html("批量付款信息") : com.focusPage("#myModalLabel").html("付款信息");

            salesPayment.btns.collectBtn.removeClass("hide");
            salesPayment.btns.refundBtn.addClass("hide");
        }

        salesPayment.modals.collectModal.modal("show");

        //是批量收款
        salesPayment.isCollects = isCollects;
    }

    //更新
    function initUpdate(payment){

        com.cleanItems(salesPayment.items);

        com.focusPage("#myModalLabel").text("更新款项信息");

        salesPayment.items.historyDiv.show();

        salesPayment.payment = payment;

        salesPayment.items.referMoney.val(payment.referMoney).attr("disabled", "disabled");
        salesPayment.items.comment.val(payment.salesReceipt.comment).attr("disabled", "disabled");

        if(salesPayment.paytypes.contains("cash")) paymentUtils.initCash(salesPayment);
        if(salesPayment.paytypes.contains("bank")) paymentUtils.initBank(salesPayment, 1);
        if(salesPayment.paytypes.contains("checkv")) paymentUtils.initCheckv(salesPayment);
        if(salesPayment.paytypes.contains("advance")) paymentUtils.initAdvance(salesPayment, 2, {"advancePayment.decoration.orderId": payment.sales.orderId}, "materialAdvance");
        if(salesPayment.paytypes.contains("coupon")) paymentUtils.initCoupon(salesPayment, 1);

        var grade = payment.sales.grade == "B" ? "B" : "";

        paymentUtils.initBankGrade(salesPayment, grade);

        //历史收款信息
        paymentUtils.drawHistoryData(salesPayment, payment.salesReceipt, salesPayment.items.historyData, "update");

        salesPayment.btns.refundBtn.addClass("hide");

        salesPayment.modals.collectModal.modal("show");
    }

    //收款
    function collect(){

        if (com.validate("collectModal", "#salesPayment")) return false;

        var url = "";
        var options = {
            "salesReceipt.comment": salesPayment.items.comment.val()
        };

        var realPayment = 0;
        var referPayment = salesPayment.items.referMoney.val();
        var type = 0;

        var payment = salesPayment.payment;

        if([2, 3, 8].contains(payment.type) && payment.status == 0){
            url =  api.payment.collectSalesPayment;

            //批量收款参数
            if (salesPayment.isCollects)  {
                url =  api.payment.collectSalesPayments;

                if(salesPayment.spids.length > 0){
                    $.each(salesPayment.spids, function (i, v) {
                        options["spids[" + i + "]"] = v;
                    });
                }

                options["salesPayment.sales.sid"] = payment.sales.sid;
            }

        }else if([4, 5, 6, 7].contains(payment.type) && payment.status == 0){
            url = api.payment.refundSalesPayment;
            type = 1;
        }else if(payment.status == 1){
            url = api.payment.updateSalesPayment;
            type = 2;
        }

        var cash = paymentUtils.paramCash(salesPayment, "salesReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(cash));

        var bank = paymentUtils.paramBank(salesPayment, salesPayment.payment.salesReceipt, "salesReceipt", options, type);

        if(bank < 0){
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(bank));

        var checkv = paymentUtils.paramCheckv(salesPayment, "salesReceipt", options);

        realPayment = utils.accAdd(realPayment, parseFloat(checkv));

        var advance = paymentUtils.paramAdvance(salesPayment, salesPayment.payment.salesReceipt, "salesReceipt", options, "advance", type);

        if(advance < 0){
            com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
            return false;
        }

        realPayment = utils.accAdd(realPayment, parseFloat(advance));

        var coupon = paymentUtils.paramCoupon(salesPayment, salesPayment.payment.salesReceipt, "salesReceipt", options, type);

        realPayment = utils.accAdd(realPayment, parseFloat(coupon));

        if(referPayment != realPayment){
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if($.isEmptyObject(options)){
            com.showAlert(com.warning, "无收款方式信息");
            return false;
        }

        options["salesPayment.spid"] = payment.spid;

        com.post(url, options, function(res){
            searcher.doSearch();
            salesPayment.modals.collectModal.modal("hide");
            com.showAlert(com.info, "操作成功")
        });
    }

    //批量收款
    com.focusPage('a[name="collects"]', '#pagenation').click(function () {

        var $inputs = com.focusPage('input[name="spids"]:checked', '#resultList');

        if (!$inputs.length) return;

        var _orderId = "";
        var _grade = "";
        var sumMoney = 0;
        var flag = false;

        $.each($inputs, function (i, v) {
            var $input = $(v);

            if (i == 0) {
                _orderId = $input.attr("data-orderid");
                _grade = $input.attr("data-grade");
            }

            if ([4, 5, 6, 7].contains(parseInt($input.attr("data-type")))) {
                flag = true;
                com.showAlert(com.warning, "批量收款不支持退款");
                return false;
            }

            if ($input.attr("data-orderid") != _orderId) {
                flag = true;
                com.showAlert(com.warning, "批量收款不支持不同订单间的操作.");
                return false;
            }

            if($input.attr('data-grade') != _grade){
                flag = true;
                com.showAlert(com.warning, "批量收款不支持不同销售单类型之间的操作.");
                return false;
            }

            sumMoney = utils.accAdd(sumMoney, parseFloat($input.attr("data-refermoney")));
            salesPayment.spids.push($input.attr("data-spid"));
        });

        if (flag) return;

        var payment = $($inputs[0]).data();
        salesPayment.payment = {"spid": payment.spid, "referMoney": sumMoney, "type": payment.type, "status": payment.status};
        salesPayment.payment.sales = {"sid": payment.sid,  "orderId": payment.orderid, "grade": payment.grade};

        if([2, 3, 8].contains(payment.type)) paymentUtils.showPos(salesPayment, {"pointofsales.pid": payment.orderid}, [0, 1]);

        initCollect(salesPayment.payment, true);
    });

    //合计
    com.focusPage('a[name="showTotal"]', '#pagenation').click(function () {
        var $total = 0;
        var $inputs = com.focusPage('input[name="spids"]:checked');

        $inputs.length && ($.each($inputs, function (i, v) {

            var $that = $(v);
            var $type = parseInt($that.attr('data-type'));
            var $referMoney = $that.attr('data-refermoney');

            if ([4, 5, 6, 7].indexOf($type) != -1) {
                $total = utils.accSub($total, $referMoney);
            } else {
                $total = utils.accAdd($total, $referMoney);
            }
        }), com.showAlert(com.info, '<h3>合计金额: ' + $total + '</h3>'));
    });

    //全选
    com.focusPage('a[name="checks"]', '#pagenation').click(function(){
        paymentUtils.checkAll();
    });

    //批量确认
    com.focusPage('a[name="confirms"]', '#pagenation').click(function () {
        var $inputs = com.focusPage('input[name="spids"]:checked', '#resultList');

        if (!$inputs.length) return;

        var option = {};

        $.each($inputs, function (index, value) {
            option["spids[" + index + "]"] = $(value).attr("data-spid");
        });

        com.showConfirm('确定要将符合条件的所有收款项目,置为已确认状态吗?', function (index, layero) {
            com.post(api.payment.confirmSalesPayment, option, function (res) {
                searcher.doSearch();
                com.showAlert(com.info, '确认成功');
            })
        }, null);
    });

    //导出
    com.focusPage('a[name="import"]', '#pagenation').click(function () {
        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 3000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.payment.pageSalesPayment,  $.extend({}, params["salesPaymentPostData"+salesPayment.pageConfig], {"paging.noPage": 1}), function (res) {
            $.exceler({
                column: [
                    ["订单号", "sales.orderId"],
                    ["销售单号", "sales.no"],
                    ['楼盘地址', ['sales.house.village.cityProper.city.name', 'sales.house.village.cityProper.name', 'sales.house.village.name', 'sales.house.houseNumber']],
                    ['品牌', 'sales.brand'],
                    ['应收金额', 'referMoney'],
                    ['收款人', 'salesReceipt.collecter.currentName'],
                    ['收款时间', 'salesReceipt.collectTime'],
                    ['类型', 'type'],
                    ['状态', 'status'],
                    ['备注', 'salesReceipt.comment'],
                    ['现金', 'salesReceipt.cash'],
                    ['刷卡', ['salesReceipt.bank', 'salesReceipt.bankInfo']],
                    ['银行', ['salesReceipt.checkv', 'salesReceipt.checkvBank']],
                    ['分期', ['salesReceipt.installment', 'salesReceipt.installBank']],
                    ['对公', ['salesReceipt.accounts', 'salesReceipt.accountsBank']],
                    ['预付款', 'salesReceipt.advance'],
                    ['券', ['salesReceipt.coupon', 'salesReceipt.couponInfo']]
                ],
                list: res.paging.data
            }, function (v) {
                v.salesReceipt.collecter = v.salesReceipt.collecter == null ? {"salesReceipt.collecter": ""} : v.salesReceipt.collecter;
                if (v.salesReceipt.bank != null && v.salesReceipt.bank != 0) {
                    var $info = ' ';
                    var _s = v.salesReceipt.bankInfo.split('#');
                    for (var i = 1; i < _s.length - 1; i++) {
                        var _i = _s[i].split('|');
                        $info += salesPayment.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
                    }

                    v.salesReceipt.bankInfo = $info;
                }

                if (v.salesReceipt.checkv!= null && v.salesReceipt.checkv != 0) {
                    var checkBankInfoStr = v.salesReceipt.checkvBank;
                    if(checkBankInfoStr.indexOf("#") != -1){
                        var $checkvInfo = ' ';
                        var _c = v.salesReceipt.checkvBank.split('#');
                        for(var i=1;i<_c.length-1;i++){
                            var _i = _c[i].split('|');
                            $checkvInfo += salesPayment.checkvInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
                        }

                        v.salesReceipt.checkvBank = $checkvInfo;
                    }else{
                        v.salesReceipt.checkvBank = v.salesReceipt.checkv != null && v.salesReceipt.checkv != "0" ? salesPayment.checkvInfo[v.salesReceipt.checkvBank] : '';
                    }
                }

                v.salesReceipt.installBank = v.salesReceipt.installment != null && v.salesReceipt.installment != "0" ? salesPayment.bankInfo[v.salesReceipt.installBank] : '';
                v.salesReceipt.accountsBank = v.salesReceipt.accounts != null && v.salesReceipt.accounts != "0" ? salesPayment.accountsInfo[v.salesReceipt.accountsBank] : '';

                v.type = salesPayment.salesPaymentTypeData[v.type];
                v.status = v.status == 1 ? '已付款' : '已确认';
            });
        });
    });

    //打印
    function printPayment(orderId, srId) {
    	params.salesReceiptSrId = srId;
        com.popup("专用收款收据__装修单号: " + orderId, api.index.salesPaymentReceiptIndex.url, function () {
            parent.layer.getFrameIndex(window.name);
        }, null, true);
    }
});
