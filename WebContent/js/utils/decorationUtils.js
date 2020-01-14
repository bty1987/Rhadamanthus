var decorationUtils = {
    initMaterial: function (decorationDetail) {
    	var dataPage = params.urlLoadParams.depage;
        var $fanglinMaterial = com.focusPage('#fanglinMaterialPayments' + dataPage).html("");
        var $salesMaterialPayment = com.focusPage('#salesMaterialPayments' + dataPage).html("");
        var $brand = com.focusPage('#materialPaymentBrands' + dataPage).html("");
        
        var $ulfanglin = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($fanglinMaterial);
        var $ulsales = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesMaterialPayment);
        var $ulbrand = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($brand);

        var $total = 0;
        var $coupon = 0;

        var materialPayments = null;
        var salesPayments = null;

        com.post(api.payment.queryMaterialPaymentByOrderId, {"materialPayment.material.orderId": decorationDetail.decorationOrderId}, function (res) {
            materialPayments = res.materialPayments;
        }, null, false);

        if (materialPayments && materialPayments.length) {
            $.each(materialPayments, function (i, v) {

                if (v.paymentStatus == 0) return true;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.material.no + " " + materialUtils.materialPaymentTypeData[v.paymentType]));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [
                    ["品类:", v.category, "grey"],
                    ["品牌:", v.brand, "grey"],
                    ["应收额:", v.referMoney, "grey"],
                    ["实收额:", v.referMoney, "grey"],
                    ["收款时间:", v.collectTime, "grey"],
                    ["状态:", materialUtils.paymentStatusInit(v.paymentStatus), "red"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var styleArr = [];

                v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
                v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for (var i = 1; i < _s.length - 1; i++) {
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

                $.each(styleArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulStyle);
                });

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock).appendTo($ulfanglin);

                var $materialBrands = com.focusPage("[name='" + v.brand + "']");

                if ($materialBrands.length > 0) {

                    var $materialBrand = com.focusPage($materialBrands[0]);
                    var $brandTotal = com.focusPage($materialBrand.find("[name='total']")[0]);

                    var _value = parseFloat($brandTotal.attr('value'));
                    var _refer = [2, 3].contains(v.paymentType) ? v.referMoney : -v.referMoney;
                    var _total = utils.changeThrDecimal(_value + _refer);
                    var _coupon = [2, 3].contains(v.paymentType) ? v.coupon : -v.coupon;

                    $brandTotal.attr("value", _total);
                    $brandTotal.html(_total);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);

                } else {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix').attr("name", v.brand);
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.brand));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var _refer = [2, 3].contains(v.paymentType) ? v.referMoney : -v.referMoney;
                    var _coupon = [2, 3].contains(v.paymentType) ? v.coupon : -v.coupon;

                    $('<b></b>').html(v.category).addClass("grey").appendTo($('<strong></strong>').html("品类:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').html(v.brand).addClass("grey").appendTo($('<strong></strong>').html("品牌:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').attr("name", "total").attr("value", _refer).html(_refer).addClass("grey").appendTo($('<strong></strong>').html("金额:").appendTo($('<li></li>').appendTo($ulProperty)));

                    $liLine.append($h4).append($ulProperty).appendTo($ulbrand);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                }
            });
        }

        com.post(api.payment.querySalesPaymentByOrderId, {"sales.orderId": decorationDetail.decorationOrderId}, function (res) {
            salesPayments = res.salesPayments;
        }, null, false);

        if (salesPayments && salesPayments.length) {
            $.each(salesPayments, function (i, v) {
                var salesReceipt = v.salesReceipt;
                if (v.status == 0) return true;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.sales.no + " " + materialUtils.materialPaymentTypeData[v.type]));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [
                    ["品类:", v.sales.category, "grey"],
                    ["品牌:", v.sales.brand, "grey"],
                    ["应收额:", v.referMoney, "grey"],
                    ["实收额:", v.referMoney, "grey"],
                    ["收款时间:", salesReceipt.collectTime, "grey"],
                    ["状态:", materialUtils.paymentStatusInit(v.status), "red"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var styleArr = [];

                salesReceipt.cash != null && salesReceipt.cash != "0" ? styleArr.push(["现金:", salesReceipt.cash, "grey"]) : true;
                salesReceipt.bank != null && salesReceipt.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for (var i = 1; i < _s.length - 1; i++) {
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

                $.each(styleArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulStyle);
                });

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock).appendTo($ulsales);

                var $salesBrands = com.focusPage("[name='" + v.sales.brand + "']");

                if ($salesBrands.length > 0) {

                    var $salesBrand = com.focusPage($salesBrands[0]);
                    var $brandTotal = com.focusPage($salesBrand.find("[name='total']")[0]);

                    var _value = parseFloat($brandTotal.attr('value'));
                    var _refer = [2, 3].contains(v.type) ? v.referMoney : -v.referMoney;
                    var _total = utils.changeThrDecimal(_value + _refer);
                    var _coupon = [2, 3].contains(v.type) ? salesReceipt.coupon : -salesReceipt.coupon;

                    $brandTotal.attr("value", _total);
                    $brandTotal.html(_total);

                    $total = utils.changeThrDecimal($total + _refer);

                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                } else {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix').attr("name", v.sales.brand);
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.sales.brand));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var _refer = [2, 3].contains(v.type) ? v.referMoney : -v.referMoney;
                    var _coupon = [2, 3].contains(v.type) ? salesReceipt.coupon : -salesReceipt.coupon;

                    $('<b></b>').html(v.sales.category).addClass("grey").appendTo($('<strong></strong>').html("品类:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').html(v.sales.brand).addClass("grey").appendTo($('<strong></strong>').html("品牌:").appendTo($('<li></li>').appendTo($ulProperty)));
                    $('<b></b>').attr("name", "total").attr("value", _refer).html(_refer).addClass("grey").appendTo($('<strong></strong>').html("金额:").appendTo($('<li></li>').appendTo($ulProperty)));

                    $liLine.append($h4).append($ulProperty).appendTo($ulbrand);

                    $total = utils.changeThrDecimal($total + _refer);
                    $coupon = utils.changeThrDecimal($coupon + _coupon);
                }
            });
        }
        var material = {"total": $total, "coupon": $coupon};

        if ($ulfanglin.children("li").length == 0 && $ulsales.children("li").length == 0) {
            noData("fanglinMaterialPayments" + dataPage);
            noData("salesMaterialPayments" + dataPage);
            noData("materialPaymentBrands" + dataPage);
        } else if ($ulfanglin.children("li").length != 0 && $ulsales.children("li").length == 0) {
            noData("salesMaterialPayments" + dataPage);
            totalData();
        } else if ($ulfanglin.children("li").length == 0 && $ulsales.children("li").length != 0) {
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

            $liLine.append($h4).append($couponPrice).append($TotalPrice).appendTo($ulbrand);
        }
        return material
    }, addDecorationActivityForDiv: function (_activitys, _decorationActivity, uiBtnMethod, couponCut, thingCut) {
    	
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
        	if(uiBtnMethod == "activityBtnMethod"){
    		   var deleteBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("删除").css("margin", "0px 3px").attr("id", "delete_" + _decorationActivity.daId).appendTo(uiPgDiv);

               deleteBtn.on("click", function () {
                   if(com.focusPage("#dactivity_" + _decorationActivity.daId).attr("status") == 0){
                       com.post(api.decoration.deleteDecorationActivity, {"decorationActivity.daId": _decorationActivity.daId}, function (res) {
                           com.focusPage("#dactivity_" + res.decorationActivity.daId).remove();
                       });
                   }
               });
        	}else{
        		uiBtnMethod(uiPgDiv, _decorationActivity);
        	}
         
        }

    }, decorationActivityInfo: function (activitys, uiBtnMethod, orderId) {

        var options = {
            "decorationActivity.orderId": orderId,
        };

        activitys.html('');

        com.post(api.decoration.queryDecorationActivityByOrderId, options, function (res) {
            var decorationActivitys = res.decorationActivitys;
            for (var i = 0; i < decorationActivitys.length; i++) {
                decorationUtils.addDecorationActivityForDiv(activitys, decorationActivitys[i], uiBtnMethod);
            }
        });

    }, decorationActivityItemInfo: function (activityPriceInfo, activityItems, uiBtnMethod, orderId) {

        var options = {
            "decoration.orderId": orderId
        };

        activityItems.html("");

        com.post(api.decoration.queryDecorationActivityItem, options, function (res) {
            var decorationActivityItems = res.decorationActivityItems;

            var couponCut = 0;
            var thingCut = 0;

            for (var i = 0; i < decorationActivityItems.length; i++) {//0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗
                if (decorationActivityItems[i].type == 0 && [0, 2, 4, 5, 6].indexOf(decorationActivityItems[i].state) != -1) {//0卷
                    couponCut = utils.accAdd(couponCut, utils.accMul(decorationActivityItems[i].money, decorationActivityItems[i].num));
                } else if (decorationActivityItems[i].type == 1 && [0, 2, 4, 5, 6].indexOf(decorationActivityItems[i].state) != -1) {//物品
                    thingCut = utils.accAdd(thingCut, utils.accMul(decorationActivityItems[i].money, decorationActivityItems[i].num));
                }

                activityPriceInfo.html("");
                var couponCutSpan = $("<div></div>").attr("id", "_couponCut").addClass("col-sm-4").append($("<h4></h4>").html("券优惠:").append($('<strong></strong>').addClass("red").html(couponCut))).appendTo(activityPriceInfo);
                var thingCutSpan = $("<div></div>").attr("id", "_thingCut").addClass("col-sm-4").append($("<h4></h4>").html("物品优惠:").append($('<strong></strong>').addClass("red").html(thingCut))).appendTo(activityPriceInfo);
                var detailSpan = $("<div></div>").attr("id", "_detail").addClass("col-sm-4").append($("<h4></h4>").html("优惠总额:").append($('<strong></strong>').addClass("red").html(utils.accAdd(couponCut, thingCut)))).appendTo(activityPriceInfo);
                decorationUtils.addActivityItemForDiv(activityItems, decorationActivityItems[i], uiBtnMethod);
            }

        });
    }, addActivityItemForDiv: function (_activityItems, _activityItem, uiBtnMethod) {
    	
        var types= {};
        var states={};

        com.post(api.ds.information, {}, function (res) {
            $.each(res.activityItemType, function (i, v) {
                types[v.key] = v.value;
            });
        }, null, false);

        com.post(api.ds.decoration, {}, function (res) {
            $.each(res.activityItemType, function (i, v) {
                states[v.key] = v.value;
            });
        }, null, false);

        var pricingSpan = $("<div></div>").addClass("col-md-6").css("margin", "5px 0px").attr("id", "pricing_" + _activityItem.daiId).prependTo(_activityItems);
        var widgetBox = $("<div></div>").appendTo(pricingSpan);
        var total = [0, 2, 4, 5, 6].indexOf(_activityItem.state) != -1 ? utils.accMul(_activityItem.money, _activityItem.num) : 0;

        var widgetBody = $("<div class='module_activity_border'></div>").attr("data-type", _activityItem.type).attr("data-total", total).appendTo(widgetBox);
        var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);

        var widgetHeader = $("<div></div>").addClass("").attr("id", "widgetHeader_" + _activityItem.daiId).appendTo(widgetMain);
        var widgetHeaderH5 = $("<h4></h4>").addClass("bigger lighter").css("padding-left", "12px").appendTo(widgetHeader).text(_activityItem.activityItemName);

        var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);

        var nameLi = $("<li></li>").appendTo(ul);
        var typeLi = $("<strong></strong>").text("类型:").appendTo(nameLi);
        var typeSpan = $("<span></span>").attr("id", "type_" + _activityItem.daiId).text(types[_activityItem.type]).appendTo(nameLi);
        var stateLi = $("<li></li>").appendTo(ul);
        var stateState = $("<strong></strong>").text("状态:").appendTo(stateLi);
        var stateSpan = $("<span></span>").addClass("red").attr("id", "state_" + _activityItem.daiId).text(states[_activityItem.state]).appendTo(stateLi);
        var moneyLi = $("<li></li>").appendTo(ul);
        var moneyState = $("<strong></strong>").text("金额:").appendTo(moneyLi);
        var moneySpan = $("<span></span>").addClass("blue").attr("id", "money_" + _activityItem.daiId).text(_activityItem.money).appendTo(moneyLi);
        var numLi = $("<li></li>").appendTo(ul);
        var numState = $("<strong></strong>").text("数量:").appendTo(numLi);
        var numSpan = $("<span></span>").addClass("blue").attr("id", "money_" + _activityItem.daiId).text(_activityItem.num).appendTo(numLi);
        var totalLi = $("<li></li>").appendTo(ul);
        var totalState = $("<strong></strong>").text("合计:").appendTo(totalLi);
        var totalSpan = $("<span></span>").addClass("blue").attr("id", "total_" + _activityItem.daiId).text(utils.accMul(_activityItem.money, _activityItem.num)).appendTo(totalLi);

        var uiPgDiv = $("<div></div>").addClass("ui-pg-div").css("padding-left", "8px").css("padding-bottom", "10px").appendTo(widgetBody);

        if (uiBtnMethod != null) {
            if(uiBtnMethod == "uiBtnMethod"){
                var abateBtn = $("<a></a>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "0px 3px").attr("id", "abate_" + _activityItem.daiId).appendTo(uiPgDiv);

                abateBtn.on("click", function () {
                    
                    com.showConfirm("是否确认失效" + _activityItem.activityItemName + "活动物品?", function () {

                        com.post(api.decoration.abateDecorationActivityItem, {"decorationActivityItem.daiId": _activityItem.daiId}, function (res) {

                            com.showAlert(com.info, "操作成功");

                            decorationUtils.countTatol(res.decorationActivityItem.daiId);

                            com.focusPage("#widgetHeader_" + res.decorationActivityItem.daiId);
                            com.focusPage("#state_" + res.decorationActivityItem.daiId).html("失效");
                        });
                    });
                });
            }else{
            	uiBtnMethod(uiPgDiv, _activityItem);
            }
        
        }

    }, initPayment: function (decorationDetail, isDesign) {

        var totalMoney = 0;
        var receiveMoney = 0;
        var addMoney = 0;
        var reduceMoney = 0;
        var paymentStatusArray= ["未付款", "已付款", "已确认", "审批中", "历史"];

        var $base = com.focusPage("#basePaymentDiv").html("");
        var $other = com.focusPage("#otherPaymentDiv").html("");
        var $mainDiv = com.focusPage("#basePaymentDiv").parent().parent().parent().parent('.row');

        var $baseul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($base);
        var $otherul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($other);

        var decorationPayments = null;
        //通过装修单号获取预付款金额
        com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": decorationDetail.decorationOrderId}, function (res) {
            com.focusPage("#balanceAdvance").text(res.balanceAdvance);
            com.focusPage("#projectAdvance").text(res.projectAdvance);
            com.focusPage("#materialAdvance").text(res.materialAdvance);
            com.focusPage("#zaterialAdvance").text(res.zaterialAdvance);
        });
        //通过装修单号获取装修款项信息
        com.post(api.payment.queryDecorationPaymentByOrderId, {"decorationPayment.decoration.orderId": decorationDetail.decorationOrderId}, function (res) {
            decorationPayments = res.decorationPayments;
        }, null, false);

        if (decorationPayments && decorationPayments.length) {

                var sortPayments = decorationPayments.sort(function(a, b){
                	return a.sort - b.sort;
                });

                $.each(sortPayments, function(i,v){
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.paymentType));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var propertyArr = [
                        ["应收额:", v.referMoney, "grey"],
                        ["收款时间:", v.collectTime, "grey"],
                        ["状态:", paymentStatusArray[v.paymentStatus], "red"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    var styleArr = [];

                    v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "grey"]) : true;
                    v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
                        var info = bank + ", ";
                        var _s = bankInfo.split('#');
                        for (var i = 1; i < _s.length - 1; i++) {
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

                    $.each(styleArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulStyle);
                    });

                    var $paymentType = v.paymentType;
                    var $paymentStatus = v.paymentStatus;

                    var $refundBtn = $('<a></a>').addClass('btn btn-minier btn-danger').html('退款');

                    $refundBtn.click(function () {
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

        var paymentDiv = $("<div></div>").addClass('row').attr('id', 'payedMoney');
        var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("已收款项信息")));
        var paymentBody = $("<div></div>").addClass('widget-body');
        var paymentTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

        paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "已收工程款总额", "projectTotal", true)).append(this.createDivForHolonomy("col-md-3", "已收工程款百分比", "projectPercent", true)).append(this.createDivForHolonomy("col-md-3", "增项款总额", "addTotal", true)).append(this.createDivForHolonomy("col-md-3", "减项款总额", "reduceTotal", false))));
        paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
        $('<div></div>').addClass('hr col-md-12').prependTo(paymentDiv);
        $('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
        if (com.focusPage('#payedMoney')) {
            com.focusPage('#payedMoney').remove();
        }
        $mainDiv.after(paymentDiv);

        com.focusPage('#projectTotal').html(receiveMoney);
        var projectPercent = totalMoney == 0 ? 0 : utils.accMul(utils.changeThrDecimal(utils.accDiv(receiveMoney, totalMoney)), 100);
        com.focusPage('#projectPercent').html(projectPercent > 100 ? 100 : projectPercent + "%");
        com.focusPage('#addTotal').html(addMoney);
        com.focusPage('#reduceTotal').html(reduceMoney);

    }, initDecorationInclusive: function (orederId) {
        var mainDiv = com.focusPage('#preparePayment').parent();
        com.focusPage('#preparePayment').remove();

        var paymentDiv = $("<div></div>").addClass('row');
        var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("预付款项信息")));
        var paymentBody = $("<div></div>").addClass('widget-body');
        var paymentTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

        var inclusiveDiv = $("<div></div>").addClass('row');
        var inclusiveHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("全包-款项信息")));
        var inclusiveBody = $("<div></div>").addClass('widget-body');
        var inclusiveTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

        var serviceMoneyBody = $("<div></div>").addClass('widget-body');

        paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "合同预付款", "balanceAdvance", true)).append(this.createDivForHolonomy("col-md-3", "工程预付款", "projectAdvance", true)).append(this.createDivForHolonomy("col-md-3", "主材预付款", "materialAdvance", true)).append(this.createDivForHolonomy("col-md-3", "正林预付款", "zaterialAdvance", false))));
        paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
        paymentDiv.prependTo(mainDiv);

        inclusiveBody.append($("<div></div>").addClass('widget-body-inner').append(inclusiveTable.append(this.createDivForHolonomy("col-md-2", "合同金额", "contractPrice", true), this.createDivForHolonomy("col-md-2", "工程总额", "projectPrice", true), this.createDivForHolonomy("col-md-2", "工程增项", "cdiff", true),
            this.createDivForHolonomy("col-md-2", "主材增项", "mdiff", true), this.createDivForHolonomy("col-md-2", "管理费", "managePrice", false), this.createDivForHolonomy("col-md-2", "实收主材额", "materialPaidup", true))));
        serviceMoneyBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
        inclusiveDiv.append($("<div></div>").addClass('widget-container-span col-md-12').append($("<div></div>").addClass('widget-box transparent').append(inclusiveHeader, inclusiveBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceMoneyBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(inclusiveDiv);
        $('<div></div>').addClass('hr col-md-12').prependTo(inclusiveDiv);
        inclusiveDiv.appendTo(mainDiv);

        com.post(api.decoration.queryDecorationInclusive, {"decorationInclusive.decoration.orderId": orederId}, function (res) {

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

    }, initDecorationBelong: function (orderId) {

        var $design = com.focusPage("#belongDesignInfo").html('');
        var $salesman = com.focusPage("#belongSalesmanInfo").html('');

        var $designul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($design);
        var $salesmanul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($salesman);

        var decorationBelongs = null;

        com.post(api.decoration.queryDecorationBelongByOrderId, {"decorationBelong.orderId": orderId}, function (res) {
            decorationBelongs = res.decorationBelongs;
        }, null, false);

        if (decorationBelongs && decorationBelongs.length) {
            $.each(decorationBelongs, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.belonger.currentName));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var propertyArr = [
                    ["员工号:", v.belonger.userId, "grey"],
                    ["所属部门:", v.department.name, "grey"],
                    ["所属大区:", v.region.name, "grey"],
                    ["分配比例:", v.rate, "grey"],
                    ["默认:", v.defaultFlag == 1 ? '是' : '否', "grey"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

                v.type == 0 ? $liLine.appendTo($designul) : $liLine.appendTo($salesmanul);
            });
        }
    }, loadHuploadify: function (eId, ename, fileType, multi, callback, btnstyle) {

        com.focusPage("#" + eId).Huploadify({
            'debug': false, // 开启调试
            'auto': true, // 是否自动上传
            'successTimeout': 150, // 超时时间
            'formData': { // 附带值
                'uploadType': 2
            },
            'buttonClass': 'btn ' + btnstyle ? btnstyle : "btn-success",
            'buttonText': ename,
            'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
            'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
            'width': '100', // 浏览按钮的宽度
            'height': '32', // 浏览按钮的高度
            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
            'fileTypeExts': fileType, // 允许上传的文件后缀
            'fileSizeLimit': '5MB', // 上传文件的大小限制
            'multi': multi,
            'queueSizeLimit': 5, // 上传数量
            'onUploadSuccess': function (file, data, response) { // 上传到服务器,服务器返回相应信息到data里
                callback(data);
            }
        });

    }, addDecorationPicture: function (data, type, eId) {

        var dateObj = eval("(" + data + ")");

        if (dateObj.errorCode == 0) {

            var options = {
                "decorationPicture.path": dateObj.resUrl,
                "decorationPicture.name": dateObj.strutsUploadsFileName,
                "decorationPicture.content": "",
                "decorationPicture.orderId": params.decorationOrderId,
                "decorationPicture.type": type
            };

            com.post(api.decoration.addDecorationPicture, options, function (res) {
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
            com.showAlert(com.error, dateObj.errorMsg);
        }
    }, initDecorationPicture: function (designId, pictureId, cadId, contractId,originalId, orderId) {

        var $desgin = com.focusPage("#" + designId).html("");
        var $picture = com.focusPage("#" + pictureId).html("");
        var $contract = com.focusPage("#" + contractId).html("");
        var $cad = com.focusPage("#" + cadId).html("");
        var $original =  com.focusPage("#" + originalId).html("");

        com.post(api.decoration.queryDecorationPictureByOrderId, {"decorationPicture.orderId": orderId}, function (res) {
            var decorationPictures = res.decorationPictures;
            var decorationPictureLength = decorationPictures.length;

            for (var i = 0; i < decorationPictureLength; i++) {
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

            com.focusPage('.ace-thumbnails [data-rel="colorbox"]').colorbox({
                reposition: true,
                scalePhotos: true,
                scrolling: false,
                previous: '<i class="icon-arrow-left"></i>',
                next: '<i class="icon-arrow-right"></i>',
                close: '&times;',
                current: '{current} of {total}',
                maxWidth: '100%',
                maxHeight: '100%'
            });
        });
    }, addPicture: function (e, i) {
        var $li = $('<li></li>').attr("id", "imgLi_" + i.dpId).appendTo(e);
        var $img = $('<img></img>').attr('width', 200).attr('height', 200);
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg($img, i.path, 200, 200, '200x200')).attr('target', '_blank').append($img).appendTo($li);

        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(i.name).appendTo($nameHolder);
        var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(i.uploadTime).appendTo($timeHolder);

        var $tools = $('<div></div>').addClass('tools tools-top').appendTo($li);
        var $toolLabel = $('<label></label>').appendTo($tools);
        var $downA = $('<a></a>').addClass("icon-download-alt").appendTo($tools);

            var $delA = $('<a></a>').addClass("icon-remove").appendTo($tools);

            $delA.click(function () {
                com.post(api.decoration.deleteDecorationPicture, {"decorationPicture.dpId": i.dpId}, function (res) {
                    com.focusPage("#imgLi_" + res.decorationPicture.dpId).remove();
                });
            });

        com.downloadFile($downA, i.path, i.name);

    }, addCAD: function (e, i) {

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

            $delA.click(function () {
                com.post(api.decoration.deleteDecorationPicture, {"decorationPicture.dpId": i.dpId}, function (res) {
                    com.focusPage("#cad_" + res.decorationPicture.dpId).remove();
                });
            });
    }, initConstructionScheduleInfo: function () {

        var options = {};
        options["constructionSchedule.orderId"] = params.decorationOrderId;

        com.post(api.construction.queryConstructionScheduleForWorkerNameByOrderId, options, function (res) {
            for (var qualityName in decorationUtils.qualityIds) {
                com.focusPage("#" + qualityName + "QualityId").val(res.constructionSchedule[qualityName + "QualityName"]);
            }

            com.focusPage("#schedule").val(decorationUtils.scheduleInfos[parseInt(res.constructionSchedule.schedule)]);
        });
    }, initBaseInfo: function (orderId, $api, callback) {

        com.post($api, {"decoration.orderId": orderId}, function (res) {
            callback(res.decoration);
        }, null, false);

    }, initDecorationHolonomy: function (orederId) {
        var mainDiv = com.focusPage('#preparePayment').parent();
        com.focusPage('#preparePayment').remove();

        var paymentDiv = $("<div></div>").addClass('row');
        var paymentHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("预付款项信息")));
        var paymentBody = $("<div></div>").addClass('widget-body');
        var paymentTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

        var holonomyDiv = $("<div></div>").addClass('row');
        var holonomyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("半价/满减款项信息")));
        var holonomyBody = $("<div></div>").addClass('widget-body');
        var holonomyTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

        var serviceMoneyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("服务款项信息")));
        var serviceMoneyBody = $("<div></div>").addClass('widget-body');

        paymentBody.append($("<div></div>").addClass('widget-body-inner').append(paymentTable.append(this.createDivForHolonomy("col-md-3", "合同预付款", "balanceAdvance", true)).append(this.createDivForHolonomy("col-md-3", "工程预付款", "projectAdvance", true)).append(this.createDivForHolonomy("col-md-3", "主材预付款", "materialAdvance", true)).append(this.createDivForHolonomy("col-md-3", "正林预付款", "zaterialAdvance", false))));
        paymentDiv.append($("<div></div>").addClass('widget-container-span').append($("<div></div>").addClass('widget-box transparent').append(paymentHeader, paymentBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(paymentDiv);
        paymentDiv.prependTo(mainDiv);

        holonomyBody.append($("<div></div>").addClass('widget-body-inner').append(holonomyTable.append(this.createDivForHolonomy("col-md-4", "折前总价", "quotationPrice", true), this.createDivForHolonomy("col-md-4", "工程总额", "projectPrice", true), this.createDivForHolonomy("col-md-4", "管理费", "managePrice", false),
            this.createDivForHolonomy("col-md-4", "主材总额", "materialPrice", true), this.createDivForHolonomy("col-md-4", "实收主材额", "materialPaidup", true), this.createDivForHolonomy("col-md-4", "主材额百分比", "materialPercent", false),
            this.createDivForHolonomy("col-md-4", "服务费", "servicePrice", true), this.createDivForHolonomy("col-md-4", "实收服务费", "servicePaidup", true), this.createDivForHolonomy("col-md-4", "服务费百分比", "servicePercent", false))));
        serviceMoneyBody.append($("<div></div>").addClass('widget-body-inner').attr('id', 'hoServiceMoney'));
        holonomyDiv.append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(holonomyHeader, holonomyBody))).append($("<div></div>").addClass('widget-container-span col-md-6').append($("<div></div>").addClass('widget-box transparent').append(serviceMoneyHeader, serviceMoneyBody)));
        $('<div></div>').addClass('hr col-md-12').appendTo(holonomyDiv);
        $('<div></div>').addClass('hr col-md-12').prependTo(holonomyDiv);
        holonomyDiv.appendTo(mainDiv);

        com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decoration.orderId": orederId}, function (res) {

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

        com.post(api.payment.queryServicePaymentByOrderId, {"servicePayment.decoration.orderId": orederId}, function (res) {
            drawList(res.servicePayments);
        });

        function drawList(data) {
            var $tableWrap = com.focusPage('#hoServiceMoney');
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            $.each(data, function (i, v) {
                var serviceReceipt = v.serviceReceipt;

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.type == 0 ? "收款" : "退款"));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');


                var propertyArr = [
                    ["预付款金额:", v.advanceMoney, "grey"],
                    ["服务费:", v.serviceMoney, "grey"],
                    ["收款时间:", v.createTime, "grey"],
                    ["状态:", v.status == 0 ? "初始" : (v.status == 1 ? "已收款" : "已确认"), "red"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                var styleArr = [];

                serviceReceipt.cash != null && serviceReceipt.cash != "0" ? styleArr.push(["现金:", serviceReceipt.cash, "grey"]) : true;
                serviceReceipt.bank != null && serviceReceipt.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
                    var info = bank + ", ";
                    var _s = bankInfo.split('#');
                    for (var i = 1; i < _s.length - 1; i++) {
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

                $.each(styleArr, function (index, value) {
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
    }, initAccount: function (orderId, accountFlg) {

        var $metaData = com.focusPage('#accountPayment').html('');

        com.post(api.decoration.queryDecorationAccount, {"decorationAccount.orderId": orderId}, function (res) {

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

                    $.each(content, function (i, v) {
                        createDivForAccount(v[0], v[1], v[2], v[3]).appendTo(accountTable);
                    });

                    accountDiv.append($("<div></div>").addClass('widget-container-span col-md-12').append($("<div></div>").addClass('widget-box transparent').append(accountHeader, accountBody)));

                    $('<div></div>').addClass('hr col-md-12').appendTo(accountDiv);
                    $('<div></div>').addClass('hr col-md-12').prependTo(accountDiv);

                    return accountDiv;
                }

                com.focusPage("#accountPayment").append(deployAccount("account", "决算信息", [

                    ["col-md-4", "主材配比", "maching", true],
                    ["col-md-4", "折扣", "discount", true],
                    ["col-md-4", "工程总额", "projectPrice_account", false],
                    ["col-md-4", "主材总额", "materialPrice_account", true],
                    ["col-md-4", "服务费比例", "serviceRate", true],
                    ["col-md-4", "服务费", "servicePrice_account", false]
                ]));

                com.focusPage('#maching').html((utils.changeTwoDecimal(com.checkNull(res.maching * 100, 0)) + "%"));
                com.focusPage('#discount').html(com.checkNull(res.discount, 0));
                com.focusPage('#projectPrice_account').html(com.checkNull(res.projectPrice, 0));
                com.focusPage('#materialPrice_account').html(com.checkNull(res.materialPrice, 0));
                com.focusPage('#serviceRate').html(utils.changeTwoDecimal(com.checkNull(res.serviceRate * 100, 0)) + "%");
                com.focusPage('#servicePrice_account').html(com.checkNull(res.servicePrice), 0);
            }

        });

    }, initService: function (decorationDetail, orderId) {

        var $service = com.focusPage("#serviceInfo").html('');

        var $serviceul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($service);

        var serviceInfo = null;

        com.post(api.decoration.queryDecorationServiceByOrderId, {"decorationService.orderId": orderId}, function (res) {
            decorationServices = res.decorationServices;
        }, null, false);

        if (decorationServices && decorationServices.length) {
            $.each(decorationServices, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').addClass('blue').html(v.name));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                var $updateBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').html('完成');

                var propertyArr = [
                    ["装修单号:", v.orderId, "grey"],
                    ["详述:", v.detail, "grey"],
                    ["操作人:", v.operater.currentName, "grey"],
                    ["操作时间:", v.operateTime, "green"],
                    ["状态:", v.status == 0 ? '初始' : '完成', "red"],
                    ["备注:", v.comment, "grey"]
                ];

                $updateBtn.click(function () {
                    decorationDetail.dsid = v.dsid;
                    com.cleanItems(decorationDetail.serviceItems);
                    decorationDetail.serviceModal.modal("show");
                });

                $.each(propertyArr, function (index, value) {
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
    }, initAddreduce: function (orderId, type) {

        var $resList = com.focusPage('#resLists').html('');
        var $table = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').css('padding-top', '30px');
        var $div = $('<div></div>').addClass('col-md-11');
        var $ai = $('<button id="print"><i class="icon-print bigger-120"></i>打印</button>').addClass('btn btn-info');
        
        $resList.append($div).append($ai).append($table);
        var discount = null;
        var qid = null;
        var versionid = null;

        com.post(api.addReduce.queryAddReduceByOrderId, {'addReduce.orderId': orderId}, function (data) {
            com.post(api.quotation.queryQuotationForDefaultByOrderId,
                {
                    "quotation.orderId": orderId,
                    "quotation.type": type
                }, function (res) {
                    discount = res.quotation.discount;
                    qid = res.quotation.qid;
                    versionid = res.quotation.versionId;
                }, null, false);

            if (data.addReduces && data.addReduces.length) {
                $.each(data.addReduces, function (i, v) {
                    var typeDict = {"0": "增项", "1": "减项", "2": "漏项"};
                    var statusDict = {"0": "未提交", "1": "未付款", "2": "已付款", "3": "已确认"};
                    var type = {"0": "普通", "1": "系统", "2": "自定义", "3": "报价中", "4": "增项"};
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
                    
                    var propertyArr = [
                        ["总价:", v.total, "red"],
                        ["类别:", typeDict[v.type + ''], "red"],
                        ["状态:", statusDict[v.status], "red"],
                        ["添加时间:", v.createTime, "red"],
                        ["折扣:", discount, "red"],
                    ];

                    $.each(propertyArr, function (index, value) {
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

                    com.post(api.addReduce.queryAddReduceItemByAddReduceId, {"addReduce.arId": v.arId}, function (ress) {

                        if (ress.addReduceItems && ress.addReduceItems.length) {
                            $.each(ress.addReduceItems, function (j, r) {
                                var index = j + 1;
                                var $tr = $('<tr><th scope="row">' + index + '</th><th>' + r.num + '</th><th>' + r.itemName + '</th><th>' + (type[r.type]) + '</th>' +
                                    '<th>' + r.workType + '</th><th>' + (r.quotationFunctionAreaName ? r.quotationFunctionAreaName : "---") + '</th>' +
                                    '<th>' + r.measurementUnit + '</th><th>' + r.unitPrice + '</th><th>' + (r.unitPrice + '</th><th>'+ r.discount == 0 ? "不打折(配比)" : r.discount == 1 ? "打折(配比)" : r.discount == 2 ? "不打折(非配比)" : "打折(非配比)") +'</th><th>'
                                    + (Math.round((r.unitPrice) * (r.num))) + '</th></tr>');

                                $tbody.append($tr);
                            });
                        }
                    });
                    $divBtnWrap.append($a).appendTo($h3);

                    $li.append($h3).append($ulProperty).append($wbody);

                    $table.append($li);
                });
                
            	//打印按钮
            	com.focusPage('#print').click(function(){
            		var $inputs = com.focusPage('input[name="arids"]:checked');
            		var url = api.index.addReduceOutputIndex.url ;
            		var _addReduceIds = [];
            		if(!$inputs.length) return;
            		$.each($inputs, function(i, v){
            			_addReduceIds.push(parseInt($(v).val()));
            		});
            		params.addReduceIds = _addReduceIds;
            		com.popup("增减项打印",url,null,null,true);
            	});
                
            } else {
                $resList.html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resList);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                $mesg.append($('<span></span>').text('无可用数据提供'));
            }
        });
    }, createDivForHolonomy: function (inclass, string, id, isleft) {
        return $("<div></div>").addClass(inclass).css(isleft ? {
            "border-left": "solid 1px #e3e3e3",
            "margin-top": "15px"
        } : {
            "border-left": "solid 1px #e3e3e3",
            "border-right": "solid 1px #e3e3e3",
            "margin-top": "15px"
        }).append($("<h5></h5>").addClass('bigger-110 center').html(string)).append($("<h2></h2>").addClass('oid bigger  center').append($('<b></b>').addClass('blue').attr('id', id).html(0)));
    }, init: function () {

        com.post(api.common.queryReceiptType, {}, function (res) {

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

            $.each(res.receiptTypes, function (i, v) {
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
    },  createCounpon: function(ulId, typeId, valId){
        var $li = $("<li></li>").css({"background-color":"#91b8d0", "margin-bottom":"5px", "margin-right":"5px"}).appendTo(com.focusPage("#" + ulId));
        var $type = com.focusPage("#" + typeId).val();
        var $coupon = com.focusPage("#" + valId).val();
        var $span = $("<span></span>").css({'color':'#fff'}).attr('typeName', $type).attr('num', $coupon).attr('asid', com.focusPage("#" + typeId).attr('data-typeahead-key')).html($type).appendTo($li);
        var $spanTwo = $("<span></span>").css({'color':'#fff', 'margin':'0 5px'}).html("数量:"+$coupon).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({'color':'#d15b47'}).appendTo($li);
        $a.click(function () {
            $li.remove();
        });
    },
    countTatol: function (daiId) {

        com.focusPage("#pricing_" + daiId + " .module_activity_border").data("total", 0);
        var coupon = 0;
        var thing = 0;

        $.each(com.focusPage(".module_activity_border"), function (i, e) {
            var _ = $(e);
            if(_.data().type == 0){
                coupon += _.data().total;
            }else if(_.data().type == 1){
                thing += _.data().total
            }

        });
        com.focusPage("#_couponCut strong").html(coupon);
        com.focusPage("#_thingCut strong").html(thing);
        com.focusPage("#_detail strong").html(utils.accAdd(coupon, thing));

    }
};