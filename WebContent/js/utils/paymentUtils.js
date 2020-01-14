var paymentUtils = {
    addBankUtil : function (index, divName, divGroup, bankArray, bankUtil, payment){
        var d = new Date();
        var name;
        var bankUtilName;

        bankArray.push(index);

        if (divName == "checkvDiv"){
            name = "checkv";
            bankUtilName = "checkvName_";
        }

        var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

        var bankDiv = $('<div></div>').attr("id", payment.htmlName + divName + index).appendTo(com.focusPage(divGroup));

        var bankNameDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankNameDiv_);
        var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankNameDiv_);
        var bankNameSelect = $('<input/>').addClass('col-xs-10 col-sm-6 v_typeahead v_required').attr({'type': 'text', 'id': payment.htmlName + name + "Name_" + index, 'data-toggle': 'popover', 'data-trigger': 'manual', 'data-placement': 'bottom'}).appendTo(bankNameDiv);
        var bankDelDiv = $('<div></div>').addClass('col-sm-1').appendTo(bankNameDiv_);
        var bankDelBtn = $('<button></button>').addClass('btn btn-minier btn-danger pull-right inline').text("删除").attr("id", payment.htmlName + name + "Del_" + index).attr("index", index).appendTo(bankDelDiv).click(function(){

            var removeNo = bankArray.indexOf(parseInt($(this).attr("index")));
            if (removeNo != -1) {
                bankArray.splice(removeNo, 1);
            }

            com.focusPage("#"+ payment.htmlName + divName + $(this).attr("index")).remove();
            var bankAdd = com.focusPage("#" + payment.htmlName + name + "Add");
            var num = bankAdd.attr("num");
            bankAdd.attr("num", parseInt(num)-1);

            return false;
        });

        var bankMoneyDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankMoneyDiv_);
        var bankMoneyDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankMoneyDiv_);
        var bankMoneyInput = $('<input/>').addClass("col-sm-6 v_required v_float_3").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", payment.htmlName + name + "_"+index).appendTo(bankMoneyDiv);

        var bankDateDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDateDiv_);
        var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDateDiv_);
        var bankDateInput = $('<input/>').addClass("date-picker-date col-sm-6 v_required").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", payment.htmlName + name + "Date_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).appendTo(bankDateDiv);
        com.datetime(bankDateInput);

        var bankTimeDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankTimeDiv_);
        var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankTimeDiv_);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput = $('<input/>').addClass('timepicker col-sm-6 v_required').attr("type", "text").attr("id", payment.htmlName + name + "Time_"+index).appendTo(bankTimePicker);
        com.datetime(bankTimeInput, "time");

        com.selectTypeahead(payment.htmlName + bankUtilName +index, bankUtil, "key", "value", null);
    },

    addBankPosUtil: function(divGroup, bankUtil, payment){
        var bankDiv = $('<div></div>').attr("id", payment.htmlName + "bankPosDiv").appendTo(com.focusPage(divGroup));

        var bankNameDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankNameDiv_);
        var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankNameDiv_);
        var bankNameSelect = $('<input/>').addClass('col-xs-10 col-sm-6 v_typeahead v_required').attr({'type': 'text', 'id':payment.htmlName + "bankName", 'data-toggle': 'popover', 'data-trigger': 'manual', 'data-placement': 'bottom', 'autocomplete' : 'off'}).appendTo(bankNameDiv);

        var bankMoneyDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankMoneyDiv_);
        var bankMoneyDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankMoneyDiv_);
        var bankMoneyInput = $('<input/>').addClass("col-sm-6 v_required v_float_3").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank").appendTo(bankMoneyDiv);

        var bankPosDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankPosLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('方式').appendTo(bankPosDiv_);
        var bankPosDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankPosDiv_);
        var poswayDiv = $('<select></select>').addClass("col-sm-6 inline").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("id", "posway").appendTo(bankPosDiv);
        poswayDiv.bindData(payment._posway, "key", "value");

        var posSendBtn = $('<button></button>').addClass('btn btn-minier btn-orange pull-right inline').text("POS推送").attr("id", "posSend").appendTo(bankNameDiv).click(function () {
            var _index = $(this).attr("index");

            paymentUtils.bankIsChecked(payment.htmlName, true);
            if(com.validate(payment.htmlName + "bankDivGroup")) return false;

            //为了防止销售点信息中无pid, 再更新可以选择删除也可以保留
            if(payment.mno == null || payment.mno == undefined){
                com.showAlert(com.warning, "无装修单号信息!!!");
                return;
            }

            var options = {
                "pointofsales.pid": payment.mno,
                "pointofsales.type": payment.pointofsalesType,
                "pointofsales.no": com.typeahead(payment.htmlName + "bankName"),
                "pointofsales.sn": payment.posValues[com.typeahead(payment.htmlName + "bankName")].value, //收据类型中pos的value值
                "pointofsales.money": com.focusPage("#bank").val(),
                "pointofsales.way": com.focusPage("#posway").val()
            };

            com.post(api.payment.addPointofsales, options, function(res){
                res.pointofsales.status = 0;
                paymentUtils.addPos(res.pointofsales, payment.htmlName);
            });

            return false;
        });

        com.selectTypeahead(payment.htmlName + "bankName", bankUtil, "key", "value", null);
    },

    addPos: function(v, htmlName){

        if(v.status == 2 || v.status == 3) return false;

        var posDivGroup = com.focusPage("#" + htmlName + "posDivGroup");

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

        ul.attr({"data-posid": v.posid, "data-type": v.type, "data-no": v.no, "data-money": v.money, "data-createTime": v.createTime, "data-status": v.status});

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

                posul.attr({"data-status": pointofsales.status, "data-createTime": pointofsales.createTime});

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

    getBankInfoParams:  function(nameData, htmlName, checkvNums, couponCount, typeUpdate, couponUpdate){//1.decorationPayment.paymentModelNameData, 2."material"装修的是空"" 3. decorationPayment.checkvNums 5、couponCount 6. decorationPayment.typeUpdate 7. decorationPayment.couponUpdate
        var realPayment = 0;
        var args = {};

        for(var i=0;i<nameData.length;i++){
            var _paymentName = nameData[i];
            var _checkboxId = "#" + _paymentName + "Checkbox";
            var _inputId = _paymentName;
            var _selectId = "";

            if(_paymentName == "advance"){
                _selectId = _paymentName + "Type";
            }

            if(com.focusPage(_checkboxId).prop("checked")){
                var _payment = 0;

                if(_paymentName == "cash"){
                    args["cash"] = com.focusPage("#cash").val();
                    args["cashInfo"] = com.typeahead(htmlName + "cashInfo");

                    _payment = com.focusPage("#cash").val();
                }else if(_paymentName == "bank"){
                    var _bankPos = 0;
                    var _bankInfoPos = "#";
                    var posids = {};

                    var positems = com.focusPage(".positem");

                    if(positems.length > 0){
                        $.each(positems, function(i, v){
                            var data = $(v).data();

                            _bankInfoPos += data.no + "|" + data.money + "|" + data.createtime + "#";

                            _bankPos = utils.accAdd(parseFloat(data.money), _bankPos);

                            posids["posids[" + i + "]"] = data.posid;
                        });
                    }

                    args["bank"] = _bankPos;
                    args["bankInfo"] = _bankInfoPos;

                    _payment = _bankPos;
                }else if(_paymentName == "checkv"){
                    var name = htmlName + "checkv";
                    var numArray = checkvNums;
                    var bankFlag = "checkv";
                    var flagInfo = "checkvBank";

                    var returnBankParam = paymentUtils.returnBankParams(numArray, name);

                    args[bankFlag] = returnBankParam[0];
                    args[flagInfo] = returnBankParam[1];

                    _payment = returnBankParam[0];
                }else if(_paymentName == "coupon"){
                    var _coupon = 0;
                    var _couponInfo = "#";

                    com.focusPage("#couponUl>li").each(function(i, e){
                        _couponVal = com.focusPage(e).children('span').attr('money');
                        _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
                        _couponInfo += com.focusPage(e).children('span').attr('typeName') + ":" + _couponVal +"#";

                        couponCount++;
                    });

                    if(typeUpdate == 1){
                        args["coupon"] = _coupon;
                        _payment = _coupon;
                    }else{
                        args["coupon"] = couponUpdate;
                        _payment = couponUpdate;
                    }
                    args["couponInfo"] = _couponInfo;
                }else{
                    args[_inputId] = com.focusPage("#"+_inputId).val();
                    _payment = com.focusPage("#"+_inputId).val();
                }

                if(com.focusPage(_checkboxId).attr("select") == "1" && _paymentName == "advance"){
                    args[_selectId] = com.focusPage("#"+_selectId).val();
                }

                realPayment = utils.accAdd(realPayment, parseFloat(_payment));

            }
        }

        return [realPayment, args, posids];
    },

    returnBankParams: function (nameNums, name){
        var _bank = 0;
        var _bankInfo = "#";

        $.each(nameNums, function(i,v){
            var bankName = com.typeahead(name + "Name_"+v);
            var bankMoney = com.focusPage("#" + name + "_"+v).val();
            var bankDate = com.focusPage("#" + name + "Date_"+v).val();
            var bankTime = com.focusPage("#" + name + "Time_"+v).val();

            _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

            _bank = utils.accAdd(parseFloat(bankMoney), _bank);
        });

        return [_bank, _bankInfo];
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

    //通过grade筛选符合条件的参数
    getValueForGrade: function(bank, checkBank, gradeParam){
        var bankUtilForGrade = [], checkBankUtilForGrade = [];
        $.each(bank, function(i, v){
            if (v.grade == gradeParam) {
                bankUtilForGrade.push({"key": v.no, "value": v.name});
            }
        });

        $.each(checkBank, function(i, v){
            if (v.grade == gradeParam) {
                checkBankUtilForGrade.push({"key": v.no, "value": v.name});
            }
        });
        return [bankUtilForGrade, checkBankUtilForGrade];
    },

    //装修款初始化模态框
    initBaseModal: function(payment, decorationPayment){
        for(var i=0;i<decorationPayment.paymentModelNameData.length;i++){
            var _name = decorationPayment.paymentModelNameData[i];
            var _checkboxId = "#" + _name + "Checkbox";

            com.focusPage(_checkboxId).removeAttr("checked").removeAttr("disabled");

            if(_name == "checkv"){
                com.focusPage("#"  + decorationPayment.htmlName + "checkvDivGroup").html("");
                com.focusPage("#"  + decorationPayment.htmlName + "checkvAdd").attr("num", 0).attr("maxnum",0);
            }
        }

        com.focusPage("#collectDes").val("");

        com.cleanTypeahead('cashInfo');

        decorationPayment.checkvNums = [];

        //根据装修单等级获取收据类型等级
        var gradeParam;
        if(payment.decoration.grade == "A" || payment.decoration.grade == "C"){
            gradeParam = "A";
        }else{
            gradeParam = "";
        }

        // 根据等级在数组中筛选出符合要求的用于显示
        var returnGradeParams = paymentUtils.getValueForGrade(decorationPayment.bank, decorationPayment.checkBank, gradeParam);
        decorationPayment.bankUtilForGrade = returnGradeParams[0];
        decorationPayment.checkBankUtilForGrade = returnGradeParams[1];

        decorationPayment.modals.baseModal.modal("show");
    },

    //装修款更新
    dialogPaymentUpdate: function (payment, decorationPayment){
        paymentInfo = payment;
        orderId = payment.decoration.orderId;
        customerId = payment.decoration.customer.cid;

        com.cleanItems(decorationPayment.items);

        com.focusPage("#historyUpdate").removeClass("hide");
        com.focusPage("#saveRefundBtn").addClass("hide");
        com.focusPage("#collectBtn").removeClass("hide");
        com.cleanTypeahead('cashInfo');

        paymentUtils.initBaseModal(payment,  decorationPayment);
        com.focusPage("#bankCheckbox").attr("disabled","disabled");
        com.focusPage("#advanceCheckbox").attr("disabled","disabled");
        com.focusPage("#couponCheckbox").attr("disabled","disabled");

        com.focusPage("#myModalPayLabel").text("付款信息");
        com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');

        if(payment.advance!="" && payment.advance!=null && payment.advance!=0){
            com.focusPage("#advanceCheckbox").removeAttr("disabled");
            com.focusPage("#advanceCheckbox").trigger("click");
        }

        if(payment.coupon!="" && payment.coupon!=null && payment.coupon!=0){
            com.focusPage("#couponCheckbox").removeAttr("disabled");
            com.focusPage("#couponCheckbox").trigger("click");
        }

        com.focusPage("#advanceCheckbox").attr("disabled","disabled");
        com.focusPage("#couponCheckbox").attr("disabled","disabled");
        com.focusPage("#advanceType").attr("disabled","disabled");

        com.focusPage("#referMoney").val(payment.referMoney);
        com.focusPage("#collectDes").val(payment.comment);
        com.focusPage("#collectDes").attr("disabled","disabled");

        //历史收款信息
        com.focusPage("#cashHistory").text("现金: "+com.checkNull(decorationPayment.cashInfo[payment.cashInfo],"")+" "+com.checkNull(payment.cash,"无"));
        com.focusPage("#bankHistory").text("刷卡: " + (payment.bank == 0 ? "无" : paymentUtils.splitBankInfo(payment.bank, payment.bankInfo, decorationPayment.bankInfo)));
        com.focusPage("#checkvHistory").text("银行: " + (payment.checkv == 0 ? "无" : paymentUtils.splitBankInfo(payment.checkv, payment.checkvBank, decorationPayment.checkBankInfo)));
        com.focusPage("#installmentHistory").text("分期: "+com.checkNull(decorationPayment.bankInfo[payment.installmentBank],"")+" "+com.checkNull(payment.installment,"无"));
        com.focusPage("#accountsHistory").text("对公账户: "+com.checkNull(decorationPayment.accountsInfo[payment.accountsBank],"")+" "+com.checkNull(payment.accounts,"无"));

        //预付款
        com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": payment.decoration.orderId},function(res){
            com.focusPage("#balanceAdvance").val(res.balanceAdvance).attr("readonly", "readonly");
            com.focusPage("#projectAdvance").val(res.projectAdvance).attr("readonly", "readonly");
        });
        com.focusPage("#advance").val(payment.advance);
        com.focusPage("#advance").attr("readonly","readonly");
        com.focusPage("#advanceType").val(payment.advanceType);

        //券信息
        var couponInfoList = {};
        var couponInfoAll = "";
        couponInfoAll = payment.couponInfo.substring(1,payment.couponInfo.length-1);
        couponInfoList = couponInfoAll.split("#");
        com.focusPage('.couponBlue').remove();

        com.focusPage("#couponDiv div.form-group").addClass("hide");

        couponUpdate = payment.coupon;

        $.each(couponInfoList,function (i,v) {
            var $couponSpan = $('<span></span>').addClass('blue couponBlue').text(v).css({"font-size":"14px","margin-left":"20px"});
            com.focusPage("#couponDiv").append($couponSpan);
        });

        com.focusPage("#saveRefundBtn").addClass("hide");

        return [paymentInfo, orderId, customerId, couponUpdate];
    },

    //装修款收款
    payment: function(decorationPayment, decorationPaymentPostData, searcher, hsearcher){
        //收款是不验证银行下的输入框
        paymentUtils.bankIsChecked(decorationPayment.htmlName, false);

        if(com.validate(decorationPayment.modelId)){
            return;
        }

        var url = "";
        var options = {};
        var args = {};
        var referPayment = com.focusPage("#referMoney").val();
        var realPayment = 0;
        var dpids = "";
        var orderId = "";
        var couponCount = 0;

        //验证是否存在未处理的POS收款
        if(com.focusPage('.positem[data-status=0]').length != 0){
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        var returnParams = paymentUtils.getBankInfoParams(decorationPayment.paymentModelNameData, decorationPayment.htmlName, decorationPayment.checkvNums, couponCount, decorationPayment.typeUpdate, decorationPayment.couponUpdate);

        //在原有基础上增加pos的金额
        realPayment = returnParams[0];
        args = returnParams[1];

        if(referPayment != realPayment){
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if(com.focusPage("#advanceCheckbox").prop("checked")){
            var _advance = 0;
            var advanceType = com.focusPage("#advanceType").val();

            if(advanceType == 1){
                _advance = parseFloat(com.focusPage("#balanceAdvance").val());
            }else if(advanceType == 2){
                _advance = parseFloat(com.focusPage("#projectAdvance").val());
            }

            if(_advance > 0 && _advance < parseFloat(com.focusPage("#advance").val())){
                com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
                return false;
            }
        }

        if($.isEmptyObject(args)){
            com.showAlert(com.warning, "无收款方式信息");
            return false;
        }

        var _info = decorationPaymentPostData.paymentInfo;

        if(decorationPayment.typeUpdate == 1){
            url = api.payment.collectDecorationPayment;
            options["decorationPayment.comment"] = com.focusPage("#collectDes").val();
            $.extend(options, {}, returnParams[2]);
        }else{
            url = api.payment.updateDecorationPayment;
        }

        for(var arg in args){
            options["decorationPayment."+arg] = args[arg];
        }

        orderId = _info.decoration.orderId;
        dpids += "&paymentIds["+0+"]="+_info.dpid;

        options["decorationPayment.dpid"] = _info.dpid;

        com.post(url, options, function(result){
            searcher != null && searcher != undefined ? searcher.doSearch() : "";
            hsearcher != null && hsearcher != undefined ? hsearcher.doSearch() : "";
            decorationPayment.modals.baseModal.modal("hide");

            var argsDrId = result.decorationPayment.drId;

            decorationPaymentPostData.paymentInfo = null;

            if(decorationPayment.typeUpdate == 1){
            	com.showConfirm("是否需要打印当前收款对应的收据信息?", function(result) {
                    params.decorationOrderOrderId = orderId;
                    params.decorationPaymentOrderId = orderId;
                    params.decorationReceiptDrId = argsDrId;
                    com.popup("专用收款收据__装修单号:" + orderId  ,api.index.decorationPaymentReceiptIndex.url,function () {
                        parent.layer.getFrameIndex(window.name);
                    },null,true);
                });
            }
        });
    },

    //主材初始化模态框
    materialInitBaseModal: function(grade, materialPayment){
        com.focusPage("#couponDiv div.form-group").removeClass("hide");
        com.focusPage('.couponBlue').remove();

        materialPayment.checkvNums = [];

        for(var i=0;i<materialPayment.paymentModelNameData.length;i++){
            var _name = materialPayment.paymentModelNameData[i];
            var _checkboxId = "#" + _name + "Checkbox";
            var _divId = "#" + _name + "Div";
            var _inputId = "#" + _name;
            var _selectId = "";
            if(_name != "bank"){
                _selectId = "#"+ _name + "Bank";
            }else{
                _selectId = "#" + _name + "Name";
            }

            com.focusPage(_checkboxId).removeAttr("checked").removeAttr("disabled");
            com.focusPage("#advanceType").removeAttr("disabled");

            com.focusPage(_inputId).val("");
            com.focusPage(_selectId).val("");

            if(_name == "checkv"){
                com.focusPage("#" + materialPayment.htmlName + "checkvDivGroup").html("");
                com.focusPage("#" + materialPayment.htmlName + "checkvAdd").attr("num", 0).attr("maxnum", 0);
            }
        }

        com.focusPage("des").val("");

        com.cleanTypeahead(materialPayment.htmlName + 'cashInfo');

        var gradeParam;
        if(grade == "B"){
            gradeParam = "B";
        }else{
            gradeParam = "";
        }

        // 根据等级在数组中筛选出符合要求的用于显示
        var returnGradeParams = paymentUtils.getValueForGrade(materialPayment.bank, materialPayment.checkBank, gradeParam);
        materialPayment.bankUtilForGrade = returnGradeParams[0];
        materialPayment.checkBankUtilForGrade = returnGradeParams[1];

        materialPayment.modals.baseModal.modal("show");
    },

    //主材更新
    materialDialogPaymentUpdate: function(payment, materialPayment){
        orderId = payment.material.orderId;
        customerId = payment.material.customer.cid;

        com.cleanItems(materialPayment.items);

        com.focusPage("#historyUpdateM").removeClass("hide");
        com.focusPage("#saveRefundBtn").addClass("hide");
        com.focusPage("#saveBtn").removeClass("hide");
        paymentUtils.materialInitBaseModal(payment.material.grade, materialPayment);
        com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
        com.focusPage("#advanceCheckbox").attr("disabled","disabled");
        com.focusPage("#couponCheckbox").attr("disabled","disabled");

        if(payment.advance!="" && payment.advance!=null && payment.advance!=0){
            com.focusPage("#advanceCheckbox").removeAttr("disabled");
            com.focusPage("#advanceCheckbox").trigger("click");
        }

        if(payment.coupon!="" && payment.coupon!=null && payment.coupon!=0){
            com.focusPage("#couponCheckbox").removeAttr("disabled");
            com.focusPage("#couponCheckbox").trigger("click");
        }

        com.focusPage("#advanceCheckbox").attr("disabled","disabled");
        com.focusPage("#couponCheckbox").attr("disabled","disabled");
        com.focusPage("#advanceType").attr("disabled","disabled");
        com.focusPage("#referMoney").attr("disabled","disabled");

        com.focusPage("#des").val(payment.comment);
        com.focusPage("#des").attr("disabled","disabled");

        //历史收款信息
        com.focusPage("#cashHistoryM").text("现金: "+com.checkNull(materialPayment.cashInfo[payment.cashInfo],"")+" "+com.checkNull(payment.cash,"无"));
        com.focusPage("#bankHistoryM").text("刷卡: "+ (payment.bank == 0 ? "无" : paymentUtils.splitBankInfo(payment.bank, payment.bankInfo, materialPayment.bankInfo)));
        com.focusPage("#checkvHistoryM").text("银行: "+ (payment.checkv == 0 ? "无" : paymentUtils.splitBankInfo(payment.checkv, payment.checkvBank, materialPayment.checkBankInfo)));
        com.focusPage("#installmentHistoryM").text("分期: "+com.checkNull(materialPayment.bankInfo[payment.installmentBank],"")+" "+com.checkNull(payment.installment,"无"));
        com.focusPage("#accountsHistoryM").text("对公账户: "+com.checkNull(materialPayment.accountsInfo[payment.accountsBank],"")+" "+com.checkNull(payment.accounts,"无"));

        materialPayment.historyMaterialPayment = utils.accAdd(utils.accAdd(utils.accAdd(payment.cash, payment.bank), utils.accAdd(payment.checkv,payment.coupon)), payment.advance);

        com.focusPage("#referMoney").val(materialPayment.historyMaterialPayment);

        //预付款
        com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": orderId},function(res){
            com.focusPage("#materialAdvance").val(res.materialAdvance).attr("readonly", "readonly");
            com.focusPage("#zaterialAdvance").val(res.zaterialAdvance).attr("readonly", "readonly");
        },null,false);

        paymentInfo = [payment];
        com.focusPage("#advance").val(payment.advance);
        com.focusPage("#advance").attr("readonly","readonly");
        com.focusPage("#advanceType").val(payment.advanceType);

        //券信息
        var couponInfoList = {};
        var couponInfoAll = "";
        couponInfoAll = payment.couponInfo.substring(1,payment.couponInfo.length-1);
        couponInfoList = couponInfoAll.split("#");
        com.focusPage('.couponBlue').remove();

        com.focusPage("#couponDiv div.form-group").addClass("hide");
        couponUpdate = payment.coupon;

        $.each(couponInfoList,function (i,v) {
            var $couponSpan = $('<span></span>').addClass('blue couponBlue').text(v).css({"font-size":"14px","margin-left":"20px"});
            com.focusPage("#couponDiv").append($couponSpan);
        });

        return [orderId, customerId, paymentInfo, couponUpdate]
    },

    //主材支付
    materialPayment: function(materialPayment, materialPaymentPostData, searcher, hsearcher){
        //收款是不验证银行下的输入框
        paymentUtils.bankIsChecked(materialPayment.htmlName, false);

        if(com.validate(materialPayment.modelId)){
            return;
        }

        var url = "";
        var options = {};
        var args = {};
        var referPayment = com.focusPage("#referMoney").val();
        var realPayment = 0;
        var couponCount = 0;

        var resMrIdIndex = "";

        var mpIds = "";

        var _bankPos = 0;
        var _bankInfoPos = "";

        //验证是否存在未处理的POS收款
        if(com.focusPage('.positem[data-status=0]').length != 0){
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        var returnParams = paymentUtils.getBankInfoParams(materialPayment.paymentModelNameData, materialPayment.htmlName, materialPayment.checkvNums, couponCount, materialPayment.typeUpdate, materialPayment.couponUpdate);

        var realPayment = returnParams[0];
        var args = returnParams[1];

        if(referPayment != realPayment){
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if(com.focusPage("#advanceCheckbox").prop("checked")){
            var _advance = 0;
            var advanceType = com.focusPage("#advanceType").val();

            if(advanceType == 1){
                _advance = parseFloat(com.focusPage("#materialAdvance").val());
            }else if(advanceType == 2){
                _advance = parseFloat(com.focusPage("#zaterialAdvance").val());
            }

            if(_advance > 0 && _advance < parseFloat(com.focusPage("#advance").val())){
                com.showAlert(com.warning, "预付款金额大于当前客户预付款余额!");
                return false;
            }
        }

        if($.isEmptyObject(args)){
            com.showAlert(com.warning, "无收款方式信息");
            return false;
        }

        if(materialPayment.typeUpdate == 1){
            url = api.payment.collectMaterialPayments;
            $.each(materialPaymentPostData.paymentInfo, function(i, v){
                options["materialPayments["+i+"].mpId"] = v.mpId;
            });
            options["materialReceipt.comment"] = com.focusPage("#des").val();
            $.extend(options, {}, returnParams[2]);
        }else{
            url = api.payment.updateMaterialPayment;
            $.each(materialPaymentPostData.paymentInfo, function(i, v){
                options["materialPayment.mpId"] = v.mpId;
            });
        }

        for(var arg in args){
            options["materialReceipt."+arg] = args[arg];
        }

        resMrIdIndex = "materialReceipt";

        options["material.orderId"] = materialPaymentPostData.orderId;

        com.post(url, options, function(result){
            searcher != null && searcher != undefined ? searcher.doSearch() : "";
            hsearcher != null && hsearcher != undefined ? hsearcher.doSearch() : "";
            materialPayment.historyFlag = false;

            if(materialPayment.typeUpdate == 1){
                var mrId = result.materialReceipt.mrId;
                com.showConfirm("是否需要打印当前收款对应的收据信息?", function(result) {
                    params.mrId = mrId;
                    params.decorationOrderMOrderId = materialPaymentPostData.orderId;
                    com.popup("专用收款收据__装修单号:" + materialPaymentPostData.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
                        parent.layer.getFrameIndex(window.name);
                    },null,true)
                });
            }
        });

        materialPayment.modals.baseModal.modal("hide");

        materialPaymentPostData.paymentInfo = []
    },

    //销售更新
    salesPaymentUpdate: function(payment, salesPayment){
        salesPayment.myModalLabel.html("更新款项信息");
        salesPayment.collectOrRefundFalg = 4;
        var $layerrAdd = salesPayment.modals.layerAdd;
        salesPayment.modals.layerAdd.attr('orderId', payment.sales.orderId);
        salesPayment.modals.layerAdd.attr('spid', payment.spid);
        com.focusPage('#collectDes').val(payment.salesReceipt.comment).attr("readonly", "readonly");
        com.focusPage("#historyUpdateSA").removeClass("hide");

        com.focusPage("#bankCheckbox").attr("disabled","disabled");
        com.focusPage('#advanceCheckbox').parents('.inline').removeClass('hidden');
        com.focusPage('#advanceCheckbox').parents('.inline').css('cssText','display:inline-block!important');
        com.focusPage('#advanceCheckbox').parents('.inline').addClass('show');
        com.focusPage('#couponCheckbox').parents('.inline').removeClass('hidden');
        com.focusPage('#couponCheckbox').parents('.inline').addClass('show');

        var spid = $layerrAdd.attr('spid', payment.spid);
        var sid = $layerrAdd.attr('sid', payment.sales.sid);

        if(com.focusPage('#advanceCheckbox').attr("disabled")){
            com.focusPage('#advanceCheckbox').removeAttr('disabled');
        }
        if(com.focusPage('#couponCheckbox').attr("disabled")){
            com.focusPage('#couponCheckbox').removeAttr('disabled');
        }

        //预付款
        if(payment.salesReceipt.advance!="" && payment.salesReceipt.advance!=null && payment.salesReceipt.advance!=0){
            com.focusPage("#advanceCheckbox").trigger("click");
            com.focusPage("#advanceDiv").removeClass("hide");
            com.focusPage("#advanceType").val(3).attr("disabled", "disabled");

            com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": payment.sales.orderId},function(res){
                com.focusPage("#advance").val(res.materialAdvance);
                com.focusPage("#payAdvance").val(payment.salesReceipt.advance).attr("readonly", "readonly");
            });
        }

        //券信息
        if(payment.salesReceipt.coupon!="" && payment.salesReceipt.coupon!=null && payment.salesReceipt.coupon!=0){
            com.focusPage("#couponCheckbox").trigger("click");

            var couponInfoList = {};
            var couponInfoAll = "";
            couponInfoAll = payment.salesReceipt.couponInfo.substring(1, payment.salesReceipt.couponInfo.length-1);
            couponInfoList = couponInfoAll.split("#");

            com.focusPage("#couponDiv").removeClass("hide");
            com.focusPage('.couponBlue').remove();
            com.focusPage("#couponDiv div.form-group").addClass("hide");

            $.each(couponInfoList,function (i,v) {
                var $couponSpan = $('<span></span>').addClass('blue couponBlue').text(v).css({"font-size":"14px","margin-left":"20px"});
                com.focusPage("#couponDiv").append($couponSpan);
            });
        }

        com.focusPage('#advanceCheckbox').attr('disabled', 'disabled');
        com.focusPage('#couponCheckbox').attr('disabled', 'disabled');

        //历史收款信息
        com.focusPage("#cashHistorySA").text("现金: "+com.checkNull(salesPayment.cashInfo[payment.salesReceipt.cashInfo],"")+" "+com.checkNull(payment.salesReceipt.cash,"无"));
        com.focusPage("#bankHistorySA").text("刷卡: " + (payment.salesReceipt.bank == 0 ? "无" : paymentUtils.splitBankInfo(payment.salesReceipt.bank, payment.salesReceipt.bankInfo, salesPayment.bankInfo)));
        com.focusPage("#checkvHistorySA").text("银行: " + (payment.salesReceipt.checkv == 0 ? "无" : paymentUtils.splitBankInfo(payment.salesReceipt.checkv, payment.salesReceipt.checkvBank, salesPayment.checkBankInfo)));
        com.focusPage("#installmentHistorySA").text("分期: "+com.checkNull(salesPayment.bankInfo[payment.salesReceipt.installmentBank],"")+" "+com.checkNull(payment.salesReceipt.installment,"无"));
        com.focusPage("#accountsHistorySA").text("对公账户: "+com.checkNull(salesPayment.accountsInfo[payment.salesReceipt.accountsBank],"")+" "+com.checkNull(payment.salesReceipt.accounts,"无"));

        salesPayment.coupon = payment.salesReceipt.coupon;
        salesPayment.couponInfo = payment.salesReceipt.couponInfo;

        var cashAndBank = utils.accAdd(payment.salesReceipt.cash, payment.salesReceipt.bank);
        var checkvAndCoupon = utils.accAdd(payment.salesReceipt.checkv, payment.salesReceipt.coupon);

        var historyReferMoney = utils.accAdd(utils.accAdd(cashAndBank, checkvAndCoupon), payment.salesReceipt.advance);
        com.focusPage('#referMoney').val(historyReferMoney);

        var gradeParam;
        if(payment.sales.grade == "B"){
            gradeParam = "B";
        }else{
            gradeParam = "";
        }

        // 根据等级在数组中筛选出符合要求的用于显示
        var returnGradeParams = paymentUtils.getValueForGrade(salesPayment.bank, salesPayment.checkBank, gradeParam);
        salesPayment.bankUtilForGrade = returnGradeParams[0];
        salesPayment.checkBankUtilForGrade = returnGradeParams[1];

        //查询是否有pos推送数据
        com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": payment.sales.orderId, "pointofsales.rid": payment.salesReceipt.srId}, function(res){
            $.each(res.pointofsaleses, function(i, value){
                if(value.status == 4) {
                    paymentUtils.addPos(value, salesPayment.htmlName);
                    com.focusPage("#bankCheckbox").prop("checked", true);
                    com.focusPage("#posDiv").prop("style", "display: block");
                    com.focusPage("#bankDiv").prop("style", "display: block");
                }
            });
        });

        salesPayment.modals.layerAdd.modal("show");
    },

    //销售收款
    aboutcollectAndRefundMoney: function(sid, spid, spids, referMoney, coupon, couponInfo, singleFlag, url, collectOrRefund, salesPayment){
        //收款是不验证银行下的输入框
        paymentUtils.bankIsChecked(salesPayment.htmlName, false);

        if(com.validate(salesPayment.modelId)){
            return;
        }

        //验证是否存在未处理的POS收款
        if(com.focusPage('.positem[data-status=0]').length != 0){
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        var layerAdd = salesPayment.modals.layerAdd;
        var des = com.focusPage('#collectDes').val();

        if(singleFlag == "single"){
            if(collectOrRefund != "update"){
                if (com.focusPage('#couponDiv').hasClass('hide')) {
                    coupon = 0;
                    couponInfo = "#";
                }
            }
        }

        var referMoney = parseFloat(referMoney);

        paymentUtils.checkPaymentHideFlag();

        var cash = 0;
        var cashInfo = "";
        var bank = 0;
        var bankInfo = "#";
        var checkv = 0;
        var checkvBank = "";
        var payAdvance = 0;
        var advanceType;
        var posids = {};

        var option = {
            "salesReceipt.comment": des
        };

        if(com.focusPage("#cashCheckbox").prop("checked")){
            cash = layerAdd.find('#cash').val() != "" ? layerAdd.find('#cash').val() : 0;
            cashInfo = com.typeahead(salesPayment.htmlName + 'cashInfo');
            option["salesReceipt.cash"] = cash;
            option["salesReceipt.cashInfo"] = cashInfo;
        }

        if(com.focusPage("#bankCheckbox").prop("checked")){
            var aboutBankParams = paymentUtils.getPosValue();
            bank = aboutBankParams[0];
            bankInfo = aboutBankParams[1];
            posids = aboutBankParams[2];

            option["salesReceipt.bank"] = bank;
            option["salesReceipt.bankInfo"] = bankInfo;
        }

        if(com.focusPage("#checkvCheckbox").prop("checked")){
            var aboutCheckvParams = paymentUtils.returnBankParams(salesPayment.checkvNums, salesPayment.htmlName + "checkv");
            checkv = aboutCheckvParams[0];
            checkvBank = aboutCheckvParams[1];
            if (checkv == 0) {
                checkvBank = "";
            }
            option["salesReceipt.checkv"] = checkv;
            option["salesReceipt.checkvBank"] = checkvBank;
        }

        var realMoney = utils.accAdd(utils.accAdd(cash, bank), checkv);

        if (collectOrRefund != "refund") {
            if(com.focusPage("#advanceCheckbox").prop("checked")) {
                var advance = layerAdd.find('#advance').val() != "" ? layerAdd.find('#advance').val() : 0;
                advanceType = layerAdd.find('#advanceType option:selected').val();
                payAdvance = layerAdd.find('#payAdvance').val();

                if(collectOrRefund == "collect"){
                    if (parseFloat(payAdvance) > parseFloat(advance)) {
                        com.showAlert(com.warning, "当前实收款项总数大于预付款项,请核实再进行提交!");
                        return false;
                    }
                }

                realMoney = realMoney + parseFloat(payAdvance != "" ? payAdvance : 0);

            }
        }

        if (singleFlag == "single") {
            if(com.focusPage("#couponCheckbox").prop("checked")){
                realMoney = realMoney + parseFloat(coupon != "" ? coupon : 0);
            }
        }

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if(collectOrRefund != "update"){
            option["salesPayment.sales.sid"] = sid;
        }

        if(collectOrRefund != "refund"){
            var couponFlag = true;
            if(singleFlag == "single" && collectOrRefund != "update"){
                option["sales.sid"] = sid;
            }

            if(collectOrRefund == "collect"){
                if (com.focusPage('#advanceDiv').hasClass('hide')) {
                    couponFlag = false;
                }
                //option增加pos相关的posids
                $.extend(option, {}, posids);
            }

            if(couponFlag){
                option["salesReceipt.advance"] = payAdvance;
                option["salesReceipt.advanceType"] = advanceType;
            }

        }

        if(spid != null){
            option["salesPayment.spid"] = spid;
            if(coupon != 0 && couponInfo != null){
                option["salesReceipt.coupon"] = coupon;
                option["salesReceipt.couponInfo"] = couponInfo;
            }
        }

        if(spids != null && spids.length > 0){
            $.each(spids, function (i, v) {
                option["spids[" + i + "]"] = v;
            });
        }

        com.post(url, option, function () {
            if(collectOrRefund == "collect"){
                com.showAlert(com.info, singleFlag == "single" ? '收款成功' : "批量收款成功")
            }else if(collectOrRefund == "refund"){
                com.showAlert(com.info, '退款成功')
            }else if(collectOrRefund == "update"){
                com.showAlert(com.info, '更新成功')
            }

            salesPayment.salesPaymentSearcher != null && salesPayment.salesPaymentSearcher != undefined  ? salesPayment.salesPaymentSearcher.doSearch() : "";
            salesPayment.hsearcher != null && salesPayment.hsearcher !=  undefined ? salesPayment.hsearcher.doSearch() : "";
            salesPayment.modals.layerAdd.modal("hide");
        });
    },

    checkPaymentHideFlag: function() {
        if (com.focusPage('#cashDiv').hasClass('hide')) {
            com.focusPage('#cash').val("");
        }

        if (com.focusPage('#bankDiv').hasClass('hide')) {
            com.focusPage('#salesbankAdd').attr("num", 0).attr("maxnum", 0);
            com.focusPage('#salesbankDivGroup').empty();
        }

        if (com.focusPage('#checkvDiv').hasClass('hide')) {
            com.focusPage('#salescheckvAdd').attr("num", 0).attr("maxnum", 0);
            com.focusPage('#salescheckvDivGroup').empty();
        }

        if (com.focusPage('#advanceDiv').hasClass('hide')) {
            com.focusPage('#payAdvance').val("");
        }

        if (com.focusPage('#couponDiv').hasClass('hide')) {
            com.focusPage('.search-choice').find('input').val("")
        }
    },

    //预付款更新
    paymentDialogPaymentUpdate: function (v, payment) {
    	payment.checkvNums=[];

        com.focusPage("#bankCheckbox").attr("disabled","disabled");

    	// 根据等级在数组中筛选出符合要求的用于显示
        var gradeParam;
        if(v.grade == "allGrade"){
            payment.bankUtilForGrade = payment.bankUtil;
            payment.checkBankUtilForGrade = payment.checkBankUtil;
        }else{
            if(v.paymentType == 0){
                if(v.grade == "A" || v.grade == "C"){
                    gradeParam = "A";
                }else{
                    gradeParam = "";
                }
            }else if(v.paymentType  == 2){
                if(v.grade == "C"){
                    gradeParam = "B";
                }else{
                    gradeParam = "";
                }
            }

            var returnGradeParams = paymentUtils.getValueForGrade(payment.bank, payment.checkBank, gradeParam);
            payment.bankUtilForGrade = returnGradeParams[0];
            payment.checkBankUtilForGrade = returnGradeParams[1];
        }

    	com.focusPage("#myModalLabel").text("收款信息");
    	com.focusPage("#paymentMethod").text("付款方式");
    	com.focusPage("#historyUpdateP").removeClass("hide");
    	com.focusPage("#collectBtn").text("收款");
    	com.focusPage("#refundSumBalanceDiv").addClass("hide");
    	com.focusPage("#refundSumWithdrawDiv").addClass("hide");

    	params.orderId = v.orderId;
    	payment.paymentTypes = null;

    	com.focusPage("#" + payment.htmlName + "bankDivGroup").html("");
    	com.focusPage("#" + payment.htmlName + "bankAdd").attr("num", 0).attr("maxnum",0);

    	com.focusPage("#" + payment.htmlName + "checkvDivGroup").html("");
    	com.focusPage("#" + payment.htmlName + "checkvAdd").attr("num", 0).attr("maxnum",0);

    	com.cleanItems(payment.items);

    	com.cleanTypeahead(payment.htmlName + 'cashInfo');

        payment.modals.modal.modal("show");

    	com.focusPage("#paymentTypeDiv").css("display", "inline");
    	com.focusPage("#des").val(v.comment);
    	com.focusPage("#des").attr("disabled","disabled");
    	com.focusPage("#paymentTypeSel").attr("disabled","disabled");
    	com.focusPage("#paymentTypeSel").val(v.paymentType);

    	//历史收款信息
    	com.focusPage("#cashHistoryP").text("现金: "+com.checkNull(payment.cashInfo[v.cashInfo],"")+" "+com.checkNull(v.cash,"无"));
    	com.focusPage("#bankHistoryP").text("刷卡: " + (v.bank == 0 ? "无" : paymentUtils.splitBankInfo(v.bank, v.bankInfo, payment.bankInfo)));
    	com.focusPage("#checkvHistoryP").text("银行: " + (v.checkv == 0 ? "无" : paymentUtils.splitBankInfo(v.checkv, v.checkvBank, payment.checkBankInfo)));
    	com.focusPage("#installmentHistoryP").text("分期: "+com.checkNull(payment.bankInfo[v.installmentBank],"")+" "+com.checkNull(v.installment,"无"));
    	com.focusPage("#accountsHistoryP").text("对公账户: "+com.checkNull(payment.accountsInfo[v.accountsBank],"")+" "+com.checkNull(v.accounts,"无"));

    	payment.temp = v;
    	payment.historyPayment = utils.accAdd(utils.accAdd(v.cash,v.bank),v.checkv);
    },

    //预付款付款
    paymentSaveData: function(payment, searcher, hsearcher){
        com.focusPage('.payWayError').hide();

        //收款是不验证银行下的输入框
        paymentUtils.bankIsChecked(payment.htmlName, false);

        if(com.validate(payment.modelId)){
            return;
        }

        if(com.focusPage(".pay_way input:checkbox:checked").length == 0){
            com.focusPage('.payWayError').show();
            return;
        }

        //验证是否存在未处理的POS收款
        if(com.focusPage('.positem[data-status=0]').length != 0){
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        var url = "";
        var total = 0;
        var options = {};
        var posids = {};

        options["payment.customer.cid"] = payment.temp.customer.cid;
        options["payment.paymentType"] = com.focusPage("#paymentTypeSel").val();
        options["payment.orderId"] = params.orderId;

        if(com.focusPage("#cashCheckbox").prop("checked")){
            options["payment.cash"] = com.focusPage("#cash").val().trim();
            options["payment.cashInfo"] = com.typeahead(payment.htmlName + "cashInfo").trim();

            total = utils.accAdd(parseFloat(com.focusPage("#cash").val()), total);
        }

        if(com.focusPage("#bankCheckbox").prop("checked")){
            var bankParams = paymentUtils.getPosValue();

            options["payment.bank"] = bankParams[0];
            options["payment.bankInfo"] = bankParams[1];
            posids = bankParams[2];

            total = utils.accAdd(bankParams[0], total);
        }

        if(com.focusPage("#checkvCheckbox").prop("checked")){
            var checkvParams = paymentUtils.returnBankParams(payment.checkvNums, payment.htmlName + "checkv");

            total = utils.accAdd(checkvParams[0], total);

            options["payment.checkv"] = checkvParams[0];
            options["payment.checkvBank"] = checkvParams[1];
        }

        if(payment.typeUpdate == 1 && payment.paymentTypes == "收款"){
            url = api.payment.collectPayment;
            options["payment.type"] = 1; //收款
            options["payment.comment"] = com.focusPage("#des").val().trim();
            options["payment.uniqueid"] = new Date().getTime();
            $.extend(options, {}, posids);

            if(parseFloat(total) <= 0){
                com.showAlert(com.warning, "收款金额需要大于零!");
                return false;
            }
        }else if(payment.typeUpdate == 2){
            var refund = com.focusPage("#refund").val();
            var refundSum = com.focusPage("#refundSum").val();

            if(parseFloat(refund) <= 0){
                com.showAlert(com.warning, "提款金额需要大于零!");
                return false;
            }

            if(parseFloat(refundSum) < parseFloat(refund)){
                com.showAlert(com.warning, "提款金额不能大于余额!");
                return false;
            }

            if(parseFloat(total)!=parseFloat(refund)){
                com.showAlert(com.warning, "当前提款项总数与提款金额不等,请核实再进行提交!");
                return false;
            }

            url = api.payment.withdrawPayment;
            options["payment.type"] = 0;
            options["payment.comment"] = com.focusPage("#des").val().trim();
            options["payment.uniqueid"] = new Date().getTime();

        }else if(payment.typeUpdate == 3){
            if(parseFloat(total) != parseFloat(payment.historyPayment)){
                com.showAlert(com.warning, "当前更新款项金额与原收款金额不等,请核实再进行提交!");
                return false;
            }

            url = api.payment.updatePayment;
            options["payment.pid"] = payment.temp.pid;
        }

        com.post(url, options, function(res){
            searcher != null && searcher != undefined ? searcher.doSearch() : "";
            hsearcher != null && hsearcher != undefined ? hsearcher.doSearch() : "";

            if(payment.paymentTypes != null){
                if(payment.paymentTypes.search('收款') != -1 || payment.paymentTypes == "收款" && payment.typeUpdate == 1){
                	com.showConfirm("是否需要打印当前收款对应的收据信息?", function(result) {
                        params.paymentPaymentId = res.payment.pid;
                        com.popup("专用收款收据__装修单号:" + res.payment.orderId  ,api.index.paymentReceiptIndex.url,function () {
                            parent.layer.getFrameIndex(window.name);
                        },null,true)
                    });
                }
            }
        });

        payment.modals.modal.modal("hide");
    },

    paymentBalance: function($ulProperty,key,value,cls,id) {
        var $liProperty = $('<li></li>');
        $('<strong></strong>').html(key).appendTo($liProperty);
        $('<b></b>').html(value).attr("id",id).addClass(cls).appendTo($liProperty);
        $liProperty.appendTo($ulProperty);
    },

    //服务款初始窗口
    serviceInitBaseModal: function(v, servicePayment){
        com.focusPage("#historyUpdateS").addClass("hide");
        for(var i = 0; i<servicePayment.paymentModelNameData.length; i++){
            var _name = servicePayment.paymentModelNameData[i];
            var _checkboxId = "#" + _name + "Checkbox";
            var _divId = "#" + _name + "Div";
            var _inputId = "#" + _name;
            var _selectId = "";
            if(_name != "bank"){
                _selectId = "#"+ _name + "BankName";
            }else{
                _selectId = "#" + _name + "Name";
            }

            com.focusPage(_checkboxId).removeAttr("checked").removeAttr("disabled");

            com.focusPage(_inputId).val("");

            if(_name == "bank"){
                com.focusPage("#" + servicePayment.htmlName + "bankDivGroup").html("");
                com.focusPage("#" + servicePayment.htmlName + "bankAdd").attr("num", 0).attr("maxnum",0);
            }

            if(_name == "checkv"){
                com.focusPage("#" + servicePayment.htmlName + "checkvDivGroup").html("");
                com.focusPage("#" + servicePayment.htmlName + "checkvAdd").attr("num", 0).attr("maxnum",0);
            }
        }

        servicePayment.checkvNums=[];

        com.focusPage("#collectDes").val("").removeAttr("readonly");
        com.focusPage("#referMoney").removeAttr("readonly");

        com.cleanTypeahead(servicePayment.htmlName + 'cashInfo');

        //根据装修单等级获取收据类型等级
        var gradeParam;
        if(v.decoration.grade == "A" || v.decoration.grade == "C"){
            gradeParam = "A";
        }else{
            gradeParam = "";
        }

        // 根据等级在数组中筛选出符合要求的用于显示
        var returnGradeParams = paymentUtils.getValueForGrade(servicePayment.bank, servicePayment.checkBank, gradeParam);
        servicePayment.bankUtilForGrade = returnGradeParams[0];
        servicePayment.checkBankUtilForGrade = returnGradeParams[1];
    },

    //服务款更新
    serviceDialogPayment: function(v, servicePayment){
        com.cleanItems(servicePayment.items);

        paymentUtils.serviceInitBaseModal(v, servicePayment);
        if(servicePayment.modals.baseModal.attr("ChargeType")==1){
            com.focusPage("#myModalLabel").text("付款信息");
            com.focusPage("#collectBtn").text("收款");
            com.focusPage("#serviceMoney").css("display","none");
            com.focusPage("#referMoney").val("");
            com.focusPage("#collectDes").val("");
        }else if(servicePayment.modals.baseModal.attr("ChargeType")==2){
            com.focusPage("#myModalLabel").text("付款信息");
            com.focusPage("#collectBtn").text("收款");
            com.focusPage("#serviceMoney").css("display","block");
            com.focusPage("#sMoney").val(utils.accSub(v.servicePrice, v.servicePaidup));
            com.focusPage("#sMoney").attr("readonly","readonly");
            com.focusPage("#referMoney").val("");
            com.focusPage("#collectDes").val("");
        }else if(servicePayment.modals.baseModal.attr("ChargeType")==3){
            com.focusPage("#myModalLabel").text("退款信息");
            com.focusPage("#collectBtn").text("退款");
            com.focusPage("#serviceMoney").css("display","none");
            com.focusPage("#referMoney").val(v.servicePaidup);
            com.focusPage("#referMoney").attr("readonly","readonly");
            com.focusPage("#collectDes").val("");
            com.focusPage("#bankCheckbox").attr("disabled","disabled");
        }else if(servicePayment.modals.baseModal.attr("ChargeType")==4){
            com.focusPage("#historyUpdateS").removeClass("hide");
            com.focusPage("#myModalLabel").text("更新付款信息");
            com.focusPage("#collectBtn").text("收款");
            com.focusPage("#serviceMoney").css("display","none");
            com.focusPage("#referMoney").val(v.serviceMoney+ v.advanceMoney).attr("readonly", "readonly");
            com.focusPage("#collectDes").val(v.comment).attr("readonly", "readonly");
            com.focusPage("#bankCheckbox").attr("disabled","disabled");

            //历史收款信息
            com.focusPage("#cashHistoryS").text("现金: "+com.checkNull(servicePayment.cashInfo[v.serviceReceipt.cashInfo],"")+" "+com.checkNull(v.serviceReceipt.cash,"无"));
            com.focusPage("#bankHistoryS").text("刷卡: " + (v.serviceReceipt.bank == 0 ? "无" : paymentUtils.splitBankInfo(v.serviceReceipt.bank, v.serviceReceipt.bankInfo, servicePayment.bankInfo)));
            com.focusPage("#checkvHistoryS").text("银行: " + (v.serviceReceipt.checkv == 0 ? "无" : paymentUtils.splitBankInfo(v.serviceReceipt.checkv, v.serviceReceipt.checkvBank, servicePayment.checkBankInfo)));
            com.focusPage("#installmentHistoryS").text("分期: "+com.checkNull(servicePayment.bankInfo[v.serviceReceipt.installmentBank],"")+" "+com.checkNull(v.serviceReceipt.installment,"无"));
            com.focusPage("#accountsHistoryS").text("对公账户: "+com.checkNull(servicePayment.accountsInfo[v.serviceReceipt.accountsBank],"")+" "+com.checkNull(v.serviceReceipt.accounts,"无"));

        }

        servicePayment.mno = v.decoration.orderId;
        servicePayment.modals.baseModal.modal("show");

        servicePayment.moreMsg[0]=$.extend({},v);
    },

    //服务款交款
    servicePaymentCollect: function(servicePayment, searcher, hsearcher){
        //收款是不验证银行下的输入框
        paymentUtils.bankIsChecked(servicePayment.htmlName, false);

        if(com.validate(servicePayment.modelId)){
            return;
        }

        //验证是否存在未处理的POS收款
        if(com.focusPage('.positem[data-status=0]').length != 0){
            com.showAlert(com.warning, "存在未处理POS收款");
            return false;
        }

        var v = servicePayment.moreMsg[0];
        var referMoney = com.focusPage("#referMoney").val();
        var des = com.focusPage("#collectDes").val();

        var cash = 0;
        var cashbInfo = "";
        var bank = 0;
        var bankInfo = "#";
        var checkv = 0;
        var checkvBank = "";
        var posids = {};

        if(com.focusPage("#cashCheckbox").prop("checked")){
            cash = com.focusPage("#cash").val();
            cashbInfo = com.typeahead(servicePayment.htmlName + "cashInfo");
        }

        if(com.focusPage("#bankCheckbox").prop("checked")){
            var aboutBankParams = paymentUtils.getPosValue();
            bank = aboutBankParams[0];
            bankInfo = aboutBankParams[1];
            posids = aboutBankParams[2];
        }

        if(com.focusPage("#checkvCheckbox").prop("checked")){
            var aboutChenckvParams = paymentUtils.returnBankParams(servicePayment.checkvNums, servicePayment.htmlName + "checkv");
            checkv = aboutChenckvParams[0];
            checkvBank = aboutChenckvParams[1];
        }

        var realMoney = utils.accAdd(utils.accAdd(cash, bank), checkv);

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if(servicePayment.modals.baseModal.attr("ChargeType")==2) {
            var sMoney = com.focusPage("#sMoney").val();
            if (realMoney > sMoney) {
                com.showAlert(com.error, "当前所收服务费多于剩余服务费,不能收款!");
                return false;
            }
        }

        var option = {
            "servicePayment.decoration.orderId" : v.decoration.orderId,
            "servicePayment.referMoney" : referMoney,
            "servicePayment.comment" : des,

            "serviceReceipt.cash" : cash,
            "serviceReceipt.cashInfo" : cashbInfo,
            "serviceReceipt.bank" : bank,
            "serviceReceipt.bankInfo" : bankInfo,
            "serviceReceipt.checkv" : checkv,
            "serviceReceipt.checkvBank" : checkvBank,
            "serviceReceipt.comment" : des
        };

        var reg = /^[0-9]*$/;
        if(reg.test(com.focusPage("#referMoney").val()) != true){
            com.showAlert(com.error, "应收款只能为数字");
            return false;
        }
        if(com.focusPage("#referMoney").val() == null || com.focusPage("#referMoney").val() == ""){
            com.showAlert(com.error, "应收款不能为空");
            return false;
        }

        var currentUrl;
        var currentOption;
        var successMessage;
        var failMessage;

        if(servicePayment.modals.baseModal.attr("ChargeType")==1){
            currentUrl = api.payment.collectServicePayment;
            currentOption = option;
            $.extend(currentOption, {}, posids);
            successMessage = "收款成功";
            failMessage = "收款失败";
        }else if(servicePayment.modals.baseModal.attr("ChargeType")==2){
            currentUrl = api.payment.collectServicePaymentForService;
            currentOption = option;
            $.extend(currentOption, {}, posids);
            successMessage = "收款成功";
            failMessage = "收款失败";
        }else if(servicePayment.modals.baseModal.attr("ChargeType")==3){
            currentUrl = api.payment.refundServicePaymentForService;
            currentOption = option;
            successMessage = "退款成功";
            failMessage = "退款失败";
        }else if(servicePayment.modals.baseModal.attr("ChargeType")==4){
            currentUrl = api.payment.updateServicePayment;
            currentOption = option;
            currentOption["servicePayment.spid"] = servicePayment.spid;
            currentOption["servicePayment.pid"] = servicePayment.pid;
            successMessage = "更新成功";
            failMessage = "更新失败";
        }

        com.post(currentUrl, currentOption, function () {
            searcher != null && searcher != undefined ? searcher.doSearch() : "";
            if(servicePayment.modals.baseModal.attr("ChargeType")==4) {
                hsearcher != null && hsearcher != undefined ? hsearcher.doSearch() : "";
            }
            com.showAlert(com.info, successMessage);
            servicePayment.modals.baseModal.modal("hide");
        }, function () {
            searcher != null && searcher != undefined ? searcher.doSearch() : "";
            com.showAlert(com.error, failMessage);
            servicePayment.modals.baseModal.modal("hide");
        });
    },

    //获取收款类型的基础信息 info信息是分页显示信息的, util和cash,bank,checkBank是下拉框信息(下拉框不显示禁用)
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
                        payment.checkBank.push(v);
                        payment.checkBankUtil.push({"key": v.no, "value": v.name});
                    }
                    payment.checkBankInfo[v.no] = v.name;
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
            com.focusPage("#type").html(decorationType[decorationInfo.type].value);
            com.focusPage("#grade").html(decorationInfo.grade);
            com.focusPage("#decorationInfo").modal("show");
        });
    },

    //创建优惠券
    createCounpon: function(){
        var $li = $("<li></li>").css({"background-color":"#91b8d0", "margin-bottom":"5px", "margin-right":"5px"}).appendTo(com.focusPage("#couponUl"));
        var typeVal = com.focusPage("#couponType").attr("data-typeahead-key");
        var couponMoney = com.focusPage("#couponVal").val();
        var $span = $("<span></span>").css({'color':'#fff'}).attr('typeName', typeVal).attr('money', couponMoney).html(typeVal).appendTo($li);
        var $spanTwo = $("<span></span>").css({'font-size':'16px', 'color':'#fff', 'margin':'0 5px'}).html(couponMoney).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({'color':'#d15b47'}).appendTo($li);
        $a.click(function () {
            $li.remove();
        });
    },

    //银行卡输入框 是否验证
    bankIsChecked: function(htmlName, flag){
        if(flag){
            com.focusPage("#" + htmlName + "bankName").addClass("v_required v_typeahead");
            com.focusPage("#bank").addClass("v_required v_float_3");
        } else {
            com.focusPage("#" + htmlName + "bankName").removeClass("v_required v_typeahead");
            com.focusPage("#bank").removeClass("v_required v_float_3");
        }
    },

    //刷卡方式是选中时, 获取pos金额
    getPosValue: function(){
        var bank = 0;
        var bankInfo = "#";
        var posids = {};

        var positems = com.focusPage(".positem");

        if(positems.length > 0){
            $.each(positems, function(i, v){
                var data = $(v).data();

                bankInfo += data.no + "|" + data.money + "|" + data.createtime + "#";

                bank = utils.accAdd(parseFloat(data.money), bank);

                posids["posids[" + i + "]"] = data.posid;
            });
        }

        if (bank == 0) {
            bankInfo = "";
        }

        return [bank, bankInfo, posids];
    }
};