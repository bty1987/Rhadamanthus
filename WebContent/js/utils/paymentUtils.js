var paymentUtils = {
        
    initCash: function(payment){

        payment.items.cashCheckbox.parent().removeClass("hide");
        
        com.cleanTypeahead(payment.items.cashInfo);
        
    },
    paramCash: function(payment, name, options){
        
        var flag = payment.items.cashCheckbox.prop("checked");
        
        if(!flag) return 0;
        
        var cash = payment.items.cash.val();

        options[name + ".cash"] = cash;
        options[name + ".cashInfo"] = com.typeahead(payment.items.cashInfo);

        return cash;
    },
    initBank: function(payment, type){
        
        payment.items.bankCheckbox.parent().removeClass("hide").children(':first').removeAttr("disabled");
        
        if(type == 1) payment.items.bankCheckbox.attr("disabled", "disabled");
        
        if(type == 2) payment.items.bankCheckbox.attr("disabled", "disabled");
        
    },
    paramBank: function(payment, receipt, name, options, type){

        if(type == 1) return 0; // 0: 收款 , 1: 退款 , 2: 更新
        
        if(type == 2) {

            options[name + ".bank"] = receipt.bank;

            return receipt.bank;
        }
        
        var flag = payment.items.bankCheckbox.prop("checked");
        
        if(!flag) return 0;
        
        var positems = com.focusPage(".positem", payment.items.posGroup);
        
        if(positems.length == 0) return 0;
        
        var bank = 0;
        var bankInfo = "#";
        
        for(var i=0;i<positems.length;i++){
            
            var data = $(positems[i]).data();
            
            if(data.status == 0) return -1;

            bankInfo += data.no + "|" + data.money + "|" + data.createtime + "#";

            bank = utils.accAdd(parseFloat(data.money), bank);

            options["posids[" + i + "]"] = data.posid;
        }
        
        options[name + ".bank"] = bank;
        options[name + ".bankInfo"] = bankInfo;
        
        return bank;
    },
    initCheckv: function(payment){
        
        payment.items.checkvCheckbox.parent().removeClass("hide");
        
    },
    paramCheckv: function(payment, name, options){
        
        var flag = payment.items.checkvCheckbox.prop("checked");
        
        if(!flag) return 0;
        
        var banks = com.focusPage(".checkvDiv", payment.items.checkvGroup);
        
        if(banks.length == 0) return 0;
        
        var bank = 0;
        var bankInfo = "#";
        
        $.each(banks, function(i, e){
            
            var info = $(e);
            
            var name = com.typeahead(info.find(".bank"));
            var money = info.find(".money").val();
            var date = info.find(".date").val();
            var time = info.find(".time").val();
            
            bankInfo += name + "|" + money + "|" + date + " " + time + "#";
            
            bank = utils.accAdd(parseFloat(money), bank);
        });
        
        options[name + ".checkv"] = bank;
        options[name + ".checkvBank"] = bankInfo;
        
        return bank;
    },
    initAdvance: function(payment, type, options, balanceType){

        payment.items.advanceCheckbox.parent().removeClass("hide").children(':first').removeAttr("disabled");

        //款项历史时
        if (type == 2) {
            payment.items.advanceCheckbox.attr("disabled", "disabled");
            return false;
        }

        com.post(api.payment.queryAdvancePaymentByOrderId, options, function(res){
            payment.items.recharge.val(res[balanceType]).attr("readonly", "readonly");
        });

    },
    paramAdvance: function(payment, receipt, name, options, advanceType, type){
        
        //if(type == 1) return 0; // 0: 收款 , 1: 退款 , 2: 更新
        
        if(type == 2) {
            
            options[name + ".advance"] = receipt.advance;
            
            return receipt.advance;
        }
        
        var flag = payment.items.advanceCheckbox.prop("checked");
        
        if(!flag) return 0;
        
        var recharge = parseFloat(payment.items.recharge.val());
        var advance = parseFloat(payment.items.advance.val());
        var advanceType = payment.items.advanceType.val();
        
        if(type == 0 && recharge > 0 && recharge < advance) return -1;
        
        options[name + ".advanceType"] = advanceType;
        options[name + ".advance"] = advance;
        
        return advance;
    },
    initCoupon: function(payment, type){

        payment.items.couponCheckbox.parent().removeClass("hide").children(':first').removeAttr("disabled");

        payment.items.couponGroup.html("");
        
        if(type == 1) payment.items.couponCheckbox.attr("disabled", "disabled");
        
        if(type == 2) payment.items.couponCheckbox.attr("disabled", "disabled");

    },
    paramCoupon: function(payment, receipt, name, options, type){

        // 0: 收款 , 1: 退款 , 2: 更新
        if(type == 2) {
            
            options[name + ".coupon"] = receipt.coupon;
            
            return receipt.coupon;
        }
        
        var flag = payment.items.couponCheckbox.prop("checked");
        
        if(!flag) return 0;
        
        var coupon = 0;
        var couponInfo = "#";
        
        var coupons = com.focusPage("li", payment.items.couponGroup);
        
        if(coupons.length == 0) return 0;
        
        $.each(coupons, function(i, e){
            
            var info = $(e).children("span");
            
            var name = info.attr("typeName");
            var money = info.attr("money");
            
            coupon = utils.accAdd(coupon, parseFloat(money));
            couponInfo += name + ":" + money +"#";
        });
        
        options[name + ".coupon"] = coupon;
        options[name + ".couponInfo"] = couponInfo;
        
        return coupon;
    },

    addBank : function (payment){
        
        var d = new Date();

        var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

        var bankDiv = $('<div></div>').addClass("checkvDiv").appendTo(payment.items.checkvGroup);

        var bankNameDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankNameDiv_);
        var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankNameDiv_);
        var bankNameSelect = $('<input/>').addClass('col-xs-10 col-sm-6 v_typeahead v_required bank').attr({'type': 'text', 'data-toggle': 'popover', 'data-trigger': 'manual', 'data-placement': 'bottom'}).appendTo(bankNameDiv);
        var bankDelDiv = $('<div></div>').addClass('col-sm-1').appendTo(bankNameDiv_);
        var bankDelBtn = $('<button></button>').addClass('btn btn-minier btn-danger pull-right inline').text("删除").appendTo(bankDelDiv).click(function(){
            $(this).parents(".checkvDiv").remove();
            return false;
        });

        var bankMoneyDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankMoneyDiv_);
        var bankMoneyDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankMoneyDiv_);
        var bankMoneyInput = $('<input/>').addClass("col-sm-6 v_required v_float_3 money").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").appendTo(bankMoneyDiv);

        var bankDateDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDateDiv_);
        var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDateDiv_);
        var bankDateInput = $('<input/>').addClass("date-picker-date col-sm-6 v_required date").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("data-date-format", "yyyy-mm-dd").val(currentData).appendTo(bankDateDiv);
        com.datetime(bankDateInput);

        var bankTimeDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankTimeDiv_);
        var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankTimeDiv_);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput = $('<input/>').addClass('timepicker col-sm-6 v_required time').attr("type", "text").appendTo(bankTimePicker);
        com.datetime(bankTimeInput, "time");

        com.selectTypeahead(bankNameSelect, payment.checkvGrade, "key", "value", null);
    },
    
    showPos: function(payment, options, status){
        com.post(api.payment.queryPointofsales, options, function(res){
            $.each(res.pointofsaleses, function(i, v){
                
                if(status.indexOf(v.status) < 0) return true;
                
                paymentUtils.addPos(payment, v);
            });
        });
    },
    pushPos: function(payment, type, orderId){

        payment.items.bankName.addClass("v_required v_typeahead");
        payment.items.bank.addClass("v_required v_float_3");

        if(com.validate("bankGroup")) return false;

        if(!orderId){
            com.showAlert(com.warning, "无款项信息");
            return false;
        }

        var options = {
            "pointofsales.pid": orderId,
            "pointofsales.type": type,
            "pointofsales.no": com.typeahead(payment.items.bankName),
            "pointofsales.sn": payment.posValues[com.typeahead(payment.items.bankName)].value, //收据类型中pos的value值
            "pointofsales.money": payment.items.bank.val(),
            "pointofsales.way": payment.items.posway.val()
        };

        com.post(api.payment.addPointofsales, options, function(res){
            res.pointofsales.status = 0;
            paymentUtils.addPos(payment, res.pointofsales);
        });
        
        payment.items.bankName.removeClass("v_required v_typeahead");
        payment.items.bank.removeClass("v_required v_float_3");
    },

    addPos: function(payment, v){

        if(v.status == 2 || v.status == 3) return false;

        var posDivGroup = payment.items.posGroup;

        var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix positem").attr("id", "pos" + v.posid).appendTo(posDivGroup);
        var liname = $("<li></li>").append($("<strong></strong>").text("名称:")).append($("<b></b>").addClass("grey").text(v.no)).appendTo(ul);
        var limoney = $("<li></li>").append($("<strong></strong>").text("金额:")).append($("<b></b>").addClass("blue").text(v.money)).appendTo(ul);

        ul.attr({"data-posid": v.posid, "data-type": v.type, "data-no": v.no, "data-money": v.money, "data-createTime": v.createTime, "data-status": v.status});

        if(v.status == 1 || v.status == 4){
            $("<li></li>").append($("<strong></strong>").text("时间:")).append($("<b></b>").addClass("blue").text(v.createTime)).appendTo(ul);
            $("<li></li>").append($("<strong></strong>").text("状态:")).append($("<b></b>").addClass("red").text("已付款")).appendTo(ul);
            return false;
        }

        var btns = $("<li></li>").attr("id", "posbtns" + v.posid).appendTo(ul);
        var check = $("<button></button>").addClass("btn btn-minier btn-orange pull-right inline").text("验证").attr("id", "poscheck" + v.posid).appendTo(btns);
        var cancel = $("<button></button>").addClass("btn btn-minier btn-danger pull-right inline hide").text("撤销").attr("id", "poscancel" + v.posid).appendTo(btns);

        check.click(function(){

            com.post(api.payment.checkPointofsales, {"pointofsales.posid": v.posid}, function(res){

                var pointofsales = res.pointofsales;

                var posid = pointofsales.posid;
                var posul = com.focusPage("#pos" + posid);

                if(pointofsales.status == 0) return false;

                if(pointofsales.status != 1) {
                    posul.remove();
                    com.showAlert(com.error, "POS支付失败");
                }

                posul.data().status = pointofsales.status;
                posul.data().createtime = pointofsales.createTime;
                posul.attr({"data-status": pointofsales.status, "data-createtime": pointofsales.createTime});

                $("<li></li>").append($("<strong></strong>").text("时间:")).append($("<b></b>").addClass("blue").text(pointofsales.createTime)).appendTo(posul);
                $("<li></li>").append($("<strong></strong>").text("状态:")).append($("<b></b>").addClass("red").text("已付款")).appendTo(posul);

                com.focusPage("#posbtns" + posid).remove();
            });

            return false;
        });

        cancel.click(function(){

            com.post(api.payment.cancelPointofsales, {"pointofsales.posid": v.posid}, function(res){
                com.focusPage("#pos" + res.pointofsales.posid).remove();
            });

            return false;
        });
    },
    
    // 创建优惠券
    addCounpon: function(){
        var $li = $("<li></li>").css({"background-color":"#91b8d0", "margin-bottom":"5px", "margin-right":"5px"}).appendTo(com.focusPage("#couponGroup"));
        var typeVal = com.focusPage("#couponType").attr("data-typeahead-key");
        var couponMoney = com.focusPage("#couponVal").val();
        var $span = $("<span></span>").css({'color':'#fff'}).attr('typeName', typeVal).attr('money', couponMoney).html(typeVal).appendTo($li);
        var $spanTwo = $("<span></span>").css({'font-size':'16px', 'color':'#fff', 'margin':'0 5px'}).html(couponMoney).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({'color':'#d15b47'}).appendTo($li);
        $a.click(function () {
            $li.remove();
        });
    },

    splitBankInfo: function(bank, bankInfo, bankArray){
        var info = bank + ", ";
        if(bankInfo.indexOf("#") != -1){
            var _s = bankInfo.split('#');
            for(var i=1;i<utils.accSub(_s.length, 1);i++){
                var _i = _s[i].split('|');
                info += bankArray[_i[0]] + " " + _i[1] + ", ";
            }
        }else{
            info += bankArray[bankInfo] + " " + bank;
        }
        return info;
    },
    
    splitCoupon: function(coupon, couponInfo){
        couponInfo = coupon + couponInfo.split('#').join(' ');
        return couponInfo;
    },

    //通过grade筛选符合条件的参数
    initBankGrade: function(payment, grade){
        
        payment.bankGrade = [];
        payment.checkvGrade = [];
        
        $.each(payment.bank, function(i, v){
            if (v.grade != grade) return true;
            payment.bankGrade.push({"key": v.no, "value": v.name});
        });

        $.each(payment.checkv, function(i, v){
            if (v.grade != grade) return true;
            payment.checkvGrade.push({"key": v.no, "value": v.name});
        });

        com.selectTypeahead(payment.items.bankName, payment.bankGrade, "key", "value", null);
    },

    //获取收款类型的基础信息 info信息是分页显示信息的, util和cash,bank,checkv是下拉框信息(下拉框不显示禁用)
    getReceiptType: function(payment){
        var notCouponPageName = ["payment", "paymentCheck", "service", "serviceCheck", "paymentPos", "servicePos"];
        com.post(api.common.queryReceiptType, {}, function(res){
            $.each(res.receiptTypes, function(i, v){
                if(v.type == 1){
                    if(v.status == 1){
                        payment.cash.push(v);
                        payment.cashUtil.push({"key": v.no, "value": v.name});
                    }
                    payment.cashInfo[v.no] = v.name;
                }else if(v.type == 2){
                    if(v.status == 1){
                        payment.bank.push(v);
                        payment.posValues[v.no] = v;
                        payment.bankUtil.push({"key": v.no, "value": v.name});
                    }
                    payment.bankInfo[v.no] = v.name;
                }else if(v.type == 3){
                    if(v.status == 1) {
                        payment.checkv.push(v);
                        payment.checkvUtil.push({"key": v.no, "value": v.name});
                    }
                    payment.checkvInfo[v.no] = v.name;
                }else if(v.type == 4){
                    payment.accounts.push(v);
                    payment.accountsInfo[v.no] = v.name;
                }

                if(!(notCouponPageName.contains(payment.htmlName))){
                    if(v.type == 5){
                        payment.couponType.push(v);
                        payment.couponTypeData[v.no] = [v.no, v.name];
                    }
                }
            });
        }, null, false);
    },

    //显示装修单信息
    decorationInfoShow: function(orderId, decorationType){
        com.focusPage("text").css("line-height", "27px");
        com.post(api.decoration.queryDecorationByOrderId, {"decorationOrderId" : orderId}, function(res){
            var decorationInfo = res.decoration;
            com.focusPage("#orderId").html(decorationInfo.orderId);
            com.focusPage("#address").html(decorationInfo.house.village.cityProper.city.name + ' ' + decorationInfo.house.village.cityProper.name + ' ' + decorationInfo.house.village.name +' '+ decorationInfo.house.houseNumber);
            com.focusPage("#type").html(decorationType[decorationInfo.typeness].value);
            com.focusPage("#grade").html(decorationInfo.grade);
            com.focusPage("#decorationInfo").modal("show");
        });
    },

    //全选
    checkAll: function(){
        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    },

    emptyData: function(pagenation){
        var $resultList = pagenation.html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    },

    drawHistoryData: function(paymentPageData, payment, div, type){

        var styleArr = [];

        payment.cash != null && payment.cash != "0" ? styleArr.push(["现金:", payment.cash + " " + (paymentPageData.cashInfo ? paymentPageData.cashInfo[payment.cashInfo] : ""), "blue"]) : true;
        payment.bank != null && payment.bank != "0" ? styleArr.push(["刷卡:", paymentUtils.splitBankInfo(payment.bank, payment.bankInfo, paymentPageData.bankInfo), "blue"]) : true;
        payment.checkv != null && payment.checkv != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(payment.checkv, payment.checkvBank, paymentPageData.checkvInfo), "blue"]) : true;
        payment.installment != null && payment.installment != "0" ? styleArr.push(["分期:", payment.installment, "blue"]) : true;
        payment.accounts != null && payment.accounts != "0" ? styleArr.push(["对公帐户:", payment.accounts, "blue"]) : true;
        payment.advance != null && payment.advance != "0" ? styleArr.push(["预付款:", payment.advance, "blue"]) : true;
        payment.coupon != null && payment.coupon != "0" ? styleArr.push(["优惠券:", paymentUtils.splitCoupon(payment.coupon, payment.couponInfo), "blue"]) : true;
        payment.transfer != null && payment.transfer != "0" ? styleArr.push(["预付款转换:", payment.transfer, "blue"]) : true;

        var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo(div);

        if (type == "update") $ulStyle.removeClass("fl-inline-list");

        $.each(styleArr, function (index, value) {
            var $liProperty = $('<li></li>');
            var $strong = $('<strong></strong>').html(value[0]).appendTo($liProperty);
            if (type == "update") $strong.addClass(value[2]);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulStyle);
        });

    },

    getConfig: function (page, type) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subtype){

            var prop = props.shift();
            if(props.length != 0){
                if(!o[prop]) o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }

            if(subtype == 0){
                o[prop] = value;
            } else if(subtype == 1 && !o[prop]){
                o[prop] = [value];
            } else if(subtype == 1 && o[prop]){
                o[prop].push(value);
            }
        }

        function getApi(o, props){

            var prop = props.shift();

            if(props.length == 0){
                return o[prop];
            } else if(o[prop]){
                return getApi(o[prop], props);
            }
            return "";
        }

        com.post(api.right.queryPaymentFunctionRight, {"paymentFunctionRight.name": page, "paymentFunctionRight.type": type}, function (res) {

            var rights = res.paymentFunctionRights.sort(function(a, b){return a.paymentFunction.sort - b.paymentFunction.sort;});

            $.each(rights, function (i, v) {

                var data = v.paymentFunction;

                if(data.type == 1) data.value = getApi({"api": api}, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
            });
        }, null, false);

        return pageConfig;
    },

    getPropertyArr: function (payment, v, decoration, statusArr) {
        var propertyArr = [];
        $.each(payment.pageConfig.propertyArr, function (pi, pv) {
            switch (pv) {
                case "mno":
                    propertyArr.push(["会员号:", v.mno, "grey"]);
                    break;
                case "orderId":
                    propertyArr.push(["装修单号:", decoration.orderId, "blue"]);
                    break;
                case "materialNo":
                    propertyArr.push(["主材号:", decoration.no, "blue"]);
                    break;
                case "salesNo":
                    propertyArr.push(["销售单号:", decoration.no, "blue"]);
                    break;
                case "customerName":
                    propertyArr.push(["客户:", decoration.customer.name, "grey"]);
                    break;
                case "address":
                    propertyArr.push(["楼盘地址:", decoration.house.village.cityProper.city.name + ' ' + decoration.house.village.cityProper.name + ' ' + decoration.house.village.name + " " + decoration.house.houseNumber, "grey"]);
                    break;
                case "designerName":
                    propertyArr.push(["设计师:", decoration.designer.currentName, "grey"]);
                    break;
                case "designDepartment":
                    propertyArr.push(["设计部:", decoration.designer.dept.name, "grey"]);
                    break;
                case "grade":
                    propertyArr.push(["等级:", decoration.grade, "red"]);
                    break;
                case "salesGrade":
                    propertyArr.push(["销售单等级:", decoration.grade, "red"]);
                    break;
                case "creater":
                    propertyArr.push(["创建人:", v.creater.currentName, "grey"]);
                    break;
                case "createTime":
                    propertyArr.push(["创建时间:", v.createTime, "blue"]);
                    break;
                case "type":
                    propertyArr.push(["类型:", payment.paymentType[v.type], "red"]);
                    break;
                case "category":
                    propertyArr.push(["品类:", v.category == null || v.category == "" ? "---" : v.category, "grey"]);
                    break;
                case "brand":
                    var brand = payment.htmlName == "sales" ? decoration.brand : v.brand;
                    propertyArr.push(["品牌:", brand == null || brand == "" ? "---" : brand, "grey"]);
                    break;
                case "operator":
                    propertyArr.push(["操作人:", v.creater.currentName, "grey"]);
                    break;
                case "referMoney":
                    var referMoney = payment.htmlName == "activity" ? v.money : v.referMoney;
                    propertyArr.push(["应收金额:", referMoney, "blue"]);
                    break;
                case "contractBalance":
                    propertyArr.push(["合同预付款:", v.balance, "blue"]);
                    break;
                case "projectBalance":
                    propertyArr.push(["工程预付款:", v.projectBalance, "blue"]);
                    break;
                case "materialBalance":
                    propertyArr.push(["主材预付款:", v.materialBalance, "blue"]);
                    break;
                case "zhenglinBalance":
                    propertyArr.push(["正林预付款:", v.zhenglinBalance, "blue"]);
                    break;
                case "collectType":
                    propertyArr.push(["收款类型:", payment.typeData[v.type], "red"]);
                    break;
                case "paymentTypeData":
                    propertyArr.push(["预付款类型:", payment.paymentTypeData[v.paymentType], "red"]);
                    break;
                case "recharge":
                    propertyArr.push(["操作金额:", v.recharge, "blue"]);
                    break;
                case "balance":
                    propertyArr.push(["余额:", v.balance, "blue"]);
                    break;
                case "materialPrice":
                    propertyArr.push(["主材金额:", v.materialPrice, "blue"]);
                    break;
                case "advanceMoney":
                    propertyArr.push(["预付款金额:", v.advanceMoney, "blue"]);
                    break;
                case "servicePrice":
                    var servicePrice = ["common", "pos"].contains(payment.type) ? v.servicePrice : v.serviceMoney;
                    propertyArr.push(["服务费:", servicePrice, "blue"]);
                    break;
                case "projectPrice":
                    propertyArr.push(["工程造价:", v.projectPrice, "blue"]);
                    break;
                case "managePrice":
                    propertyArr.push(["管理费:", v.managePrice, "blue"]);
                    break;
                case "collectUser":
                    var obj = ["sales", "service"].contains(payment.htmlName) ? v[payment.htmlName+"Receipt"] : v;
                    var collecter = ["payment"].contains(payment.htmlName) ? obj.collectUser : obj.collecter;
                    propertyArr.push(["收款人:", collecter != null ? collecter.currentName : "暂无", "grey"]);
                    break;
                case "collectTime":
                    var obj = ["sales", "service"].contains(payment.htmlName) ? v[payment.htmlName+"Receipt"] : v;
                    propertyArr.push(["收款时间:",  obj.collectTime, "green"]);
                    break;
                case "confirmUser":
                    var obj = ["sales", "service"].contains(payment.htmlName) ? v[payment.htmlName+"Receipt"] : v;
                    var confirmer = ["payment"].contains(payment.htmlName) ? obj.confirmUser : obj.confirmer;
                    propertyArr.push(["确认人:", confirmer != null && confirmer.currentName != null ? confirmer.currentName : "暂无", "grey"]);
                    break;
                case "confirmTime":
                    var obj = ["sales", "service"].contains(payment.htmlName) ? v[payment.htmlName+"Receipt"] : v;
                    propertyArr.push(["确认时间:", obj.confirmTime, "green"]);
                    break;
                case "status":
                    var status = ["payment", "sales", "service", "activity"].contains(payment.htmlName) ? statusArr[v.status] : statusArr[v.paymentStatus];
                    propertyArr.push(["状态:", status, "red"]);
                    break;
                case "comment":
                    var obj = payment.htmlName == "sales" ? v.salesReceipt : v;
                    propertyArr.push(["备注:", obj.comment, "grey"]);
                    break;
                case "salesDept":
                    propertyArr.push(["渠道部门:", decoration.dept.name, "grey"]);
                    break;
            }
        });
        return propertyArr;
    },


    //获取验证码
    getCode: function ($id, wallet, phone) {
        paymentUtils.setTime($id, wallet.countdown);
        $.ajax({
            url: 'https://www.fanglinserver.com/queryVode + phone=' + phone,
            type: "POST",
            dataType: "json",
            success: function (data) {
                console.log(data);
                wallet.phoneCode = data;
            }
        });
    },

    //倒计时
    setTime: function ($id, countdown) {
        if (countdown == 0) {
            com.focusPage($id).removeAttr("disabled");
            com.focusPage($id).html("获取验证码");
            countdown = 60;
        } else {
            com.focusPage($id).attr("disabled", true);
            com.focusPage($id).html("重新发送(" + countdown + ")");
            countdown--;
            setTimeout(function() {
                paymentUtils.setTime($id, countdown)
            }, 1000)
        }
    },

    //收据页面生成pdf文件
    makeContract: function(target, rtid, orderId, paymentType, direction) {

        target.style.background = "#FFFFFF";  //避免生成的PDF页面底部出现黑色背景
        
        var paymentContract = null;

        html2canvas(target, {
            onrendered:function(canvas) {
                var contentWidth = canvas.width;
                var contentHeight = canvas.height;

                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 595.28 * 841.89 ;

                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28;
                var imgHeight = 595.28/contentWidth * contentHeight;

                var pageData = canvas.toDataURL('image/jpeg', 1.0);
                //l表示横版，p：纵向 （默认纵向）
                if (direction != undefined) {
                    direction = 'l';
                    pageHeight = contentWidth / 841.89 * 595.28 ;
                }
                var pdf = new jsPDF(direction, 'pt', [imgWidth, imgHeight]);

                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                } else {
                    while(leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                        leftHeight -= pageHeight;
                        position = direction == 'l' ? position-595.28 : position-841.89;
                        //避免添加空白页
                        if(leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }

                var file = paymentUtils.dataURLtoFile(pdf.output("datauristring"), "1.pdf");

                var formData = new FormData();
                formData.append("strutsUploads", file);

                $.ajax({
                    url : config.communion + "uploadOther.do",
                    type : "POST",
                    data : formData,
                    processData: false,
                    contentType: false
                }).success(function(result) {
                    var options = {
                        "paymentContract.rtid": rtid,
                        "paymentContract.orderId": orderId,
                        "paymentContract.paymentType": paymentType,
                        "paymentContract.viewpdf": "http://www.fanglinserver.com/" + result.resUrl
                    };

                    com.post(api.payment.addPaymentContract, options, function(res){

                        com.showAlert(com.info, "已完成");

                        paymentContract = paymentUtils.showContractBtn(rtid, paymentType, orderId);

                        $("#decorationPaymentReceipt center").removeAttr("style");
                        $("#decorationPaymentReceipt center div").first().removeAttr("style");
                        $("#decorationPaymentReceipt tr").removeAttr("style");
                    })
                });
            }
        });
        
        return paymentContract;
    },

    dataURLtoFile: function(dataUrl, fileName){
        var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, {type:mime});
    },

    showContractBtn: function(rtid, paymentType, orderId) {
        
        var options = {
            "paymentContract.rtid": rtid,
            "paymentContract.paymentType": paymentType
        };
        var paymentContract = null;
        
        $("#signBtns button").hide();

        com.post(api.payment.queryPaymentContract, options, function(res){
            paymentContract = res.paymentContract;
        }, function(){}, false);
        
        if(!paymentContract){
            $("#createSign").show().click(function(){
                var target = $("#decorationPaymentReceipt center")[0]; //避免生成的PDF页面底部出现黑色背景
                $("#decorationPaymentReceipt center div").first().css({"padding-top": "30px", "padding-bottom": "30px"});
                $("#decorationPaymentReceipt center").css({"width": "30%", "margin": "0 auto"});
                $("#decorationPaymentReceipt tr").css({"height": "60px"});
                paymentContract = paymentUtils.makeContract(target, params.decorationReceiptDrId, orderId, 1);
            });
        }else if(paymentContract && paymentContract.status == 0){
            $("#customerSign").show().click(function(){
                paymentUtils.customerSign(paymentContract, params.cid);
            });
            $("#companySign").show().click(function(){
                $("#paymentContractModal").modal("show");
            });
            $("#customerSignCode").show().click(function(){
                paymentUtils.customerSignCode(paymentContract);
            });
            $("#customerSignSend").show().click(function(){
                paymentUtils.customerSignSend(paymentContract);
            });
            
            $("#companySignBtn").click(function () {
                paymentUtils.companySign(paymentContract, $("#signets").val());
                $("#paymentContractModal").modal("hide");
            });
        }
        
        return paymentContract;
    },
    
    customerSign: function(paymentContract, customerId){
        
        com.post(api.payment.signPaymentContractForCustomer, {"paymentContract.pcid" : paymentContract.pcid, "customer.cid": customerId}, function (res) {
            com.closePopup();
            com.popup4frame("客户签", res.redirect, null, function(){
                com.popup("专用收款收据__装修单号:", api.index.decorationPaymentReceiptIndex.url, function () {
                    parent.layer.getFrameIndex(window.name);
                }, null, true);
            });
        });
    },
    
    companySign: function(paymentContract, signId){
        com.post(api.payment.signPaymentContractForCompany, {"paymentContract.pcid" : paymentContract.pcid, "signet.sid": signId});
        $("#decorationReceiptContractModal").modal("hide");
    },
    
    customerSignCode: function(paymentContract){
        paymentUtils.showQRCode("qrcode", "http://www.fanglinserver.com/platform/" + "/views/contract/redirect.html?dcid=" + paymentContract.pcid + "&type=2&module=payment", "paymentContractQrcodeModal");
    },
    
    customerSignSend: function(paymentContract){
        com.showConfirm("是否发送签订通知", function () {
            com.post(api.payment.sendPaymentContract, {"paymentContract.pcid": paymentContract.pcid, "paymentContract.paymentType" : 2}, function(res){
                com.showAlert(com.info, "发送成功");
            });
        });
    },
    
    bindSignet: function (id) {
        com.post(api.data.querySignet, {}, function (res) {
            var signets = res.signets;

            if (signets.length == 0) return;

            for (var i = 0; i < signets.length; i++) {
                var item = signets[i];
                $("<option value=" + item["sid"] + ">" + item["name"] + "</option>").appendTo(id);
            }
        });
    },

    showQRCode: function (id, url, modal){

        $("#"+id).html("").qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: url
        });
        $("#"+id).css({"text-align": "center", "padding-top": "10px"});
        $("#"+modal).modal('show');
    },
    getReceiptRowspan: function(receipt, i, receiptRowspan){
        var receiptSubRowspan = utils.accSub(receipt.receiptsNum, utils.accMul(receipt.onePageCount, i));
        receiptRowspan = receiptSubRowspan > receipt.onePageCount ? receipt.onePageCount : receiptSubRowspan;
        return receiptRowspan;
    },
    getBankRowspan: function (receipt, i, start, bankRowspan) {

        var paymentWay = receipt.receipts[start].paymentWay;

        var cashAndCheck = 0;
        cashAndCheck = parseFloat(receipt.cash) > 0 ? utils.accAdd(cashAndCheck, 1) : cashAndCheck;
        cashAndCheck = paymentWay == "银行" && receipt.checkBankInfoNum > 0 ? utils.accAdd(cashAndCheck, receipt.checkBankInfoNum) : cashAndCheck;
        var surplusCheckvCount = utils.accSub(cashAndCheck, utils.accMul(i, receipt.onePageCount));//剩下要画的刷卡数

        if (surplusCheckvCount > 0) {
            var currentDrawBankCount = utils.accSub(receipt.onePageCount, surplusCheckvCount); //当前页剩余的可以画银行的条数
            bankRowspan = receipt.receipts[start].bankInfoNum > currentDrawBankCount ? currentDrawBankCount : receipt.receipts[start].bankInfoNum;
        } else {
            var amount = utils.accMul(i, receipt.onePageCount);
            var drawBankCount = Math.abs(utils.accSub(amount, cashAndCheck)); //已经画过的银行条数

            var bankSubRowspan = utils.accSub(receipt.receipts[start].bankInfoNum, drawBankCount); //要画的当前页条数
            bankRowspan = bankSubRowspan > receipt.onePageCount ? receipt.onePageCount : bankSubRowspan;
        }

        return bankRowspan;
    }
};
