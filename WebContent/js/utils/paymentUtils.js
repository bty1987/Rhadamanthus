var paymentUtils = {
    dynamicChosen: function (modelId ,id, data,key,value) {
        var $e = com.focusPage('#' + id);
        $e.html("");
        $e.val("");
        $('<option value="">&nbsp;</option>').appendTo($e);
        $.each(data, function (i, v) {
            $('<option value="' +v[key]+ '">' + v[value]+ '</option>').appendTo($e);
        });

        $e.chosen({allow_single_deselect: true});
        com.focusPage('#' + id + '_chosen input').bind("input", function () {
            var val = $(this).val();
            if (val != "") {
                deployChosen(val);
            } else {
                deployChosen();
            }
        });

        com.focusPage('#' + id + '_chosen').bind('click', function () {
            var val = $('#' + id + '_chosen a span').html();
            if ('' + val + '' == '&nbsp;') {
                deployChosen();
            }
        });
        var deployChosen = function (val) {
            var html = '<option value="">&nbsp;</option>';
            var kv = data;
            var length = kv.length;
            for (var i = 0; i < length; i++) {

                var _ = kv[i];
                if (val) {
                    if (_[value].match(val)) {
                        html += '<option value="'+_[key]+ '">' + _[value] + '</option>';
                    }
                } else {
                    html += '<option value="'+_[key]+'">' + _[value]+ '</option>';
                }
            }
            $e.html(html).trigger("chosen:updated");
        };

        com.focusPage('#' + id + '_chosen').css('min-width','50%').css('width','170px');

        com.focusPage('#' +modelId+' input').css('min-width','50%').css('width','170px');
    },

    EmptyChosen : function(id){
        com.focusPage('#' + id).val("");
        com.focusPage('#' + id + '_chosen a span').html("");
    },

    addBankUtil : function (index, divName, divGroup, bankArray, bankUtil, pageName, baseItemModal){
        var d = new Date();
        var name;
        var bankUtilName;

        bankArray.push(index);

        if(divName == "bankDiv"){
            name = "bank";
            bankUtilName = "bankName_";
        } else if (divName == "checkvDiv"){
            name = "checkv";
            bankUtilName = "checkvName_";
        }

        var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

        var bankDiv = $('<div></div>').attr("id", pageName + divName + index).appendTo(com.focusPage(divGroup));

        var bankNameDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankNameDiv_);
        var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankNameDiv_);
        var bankNameSelect = $('<select></select>').addClass('chosen-select col-sm-6 v_required').attr("id", pageName + name + "Name_" + index).attr("data-toggle", "popover").attr("data-trigger", "manual").appendTo(bankNameDiv);
        var bankDelDiv = $('<div></div>').addClass('col-sm-1').appendTo(bankNameDiv_);
        var bankDelBtn = $('<button></button>').addClass('btn btn-minier btn-danger pull-right inline').text("删除").attr("id", pageName + name + "Del_" + index).attr("index", index).appendTo(bankDelDiv).click(function(){

            var removeNo = bankArray.indexOf(parseInt($(this).attr("index")));
            if (removeNo != -1) {
                bankArray.splice(removeNo, 1);
            }

            com.focusPage("#"+ pageName + divName + $(this).attr("index")).remove();
            var bankAdd = com.focusPage("#" + pageName + name + "Add");
            var num = bankAdd.attr("num");
            bankAdd.attr("num", parseInt(num)-1);

            return false;
        });

        var bankMoneyDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankMoneyDiv_);
        var bankMoneyDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankMoneyDiv_);
        var bankMoneyInput = $('<input/>').addClass("col-sm-6 v_required v_float").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", pageName + name + "_"+index).appendTo(bankMoneyDiv);

        var bankDateDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDateDiv_);
        var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDateDiv_);
        var bankDateInput = $('<input/>').addClass("date-picker-date col-sm-6 v_required").attr("readonly", "readonly").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", pageName + name + "Date_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);

        var bankTimeDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankTimeDiv_);
        var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankTimeDiv_);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput =  $('<input/>').addClass('col-sm-6 v_time v_required').attr("type", "text").attr("id", pageName + name + "Time_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);

        paymentUtils.dynamicChosen(baseItemModal, pageName + bankUtilName +index, bankUtil, "key", "value");
    },

    getBankInfoParams:  function(nameData, htmlName, bankNums, checkvNums, couponCount, typeUpdate, couponUpdate, _paymentInfo){//1.decorationPayment.paymentModelNameData, 2."material"装修的是空"" 3.decorationPayment.bankNums, 4 decorationPayment.checkvNums 5、couponCount 6. decorationPayment.typeUpdate 7. decorationPayment.couponUpdate 8: 收款还是退款 payment/refund
        var realPayment = 0;
        var args = [];

        for(var i=0;i<nameData.length;i++){
            var _paymentName = nameData[i];
            var _checkboxId = "#" + _paymentName + "Checkbox";
            var _inputId = _paymentName;
            var _selectId = "";

            if(_paymentName == "coupon" || _paymentName == "advance"){
                _selectId = _paymentName + "Type";
                com.focusPage("#" + _selectId).on("change", function(){
                    com.focusPage(_paymentInfo).text("");
                });
            }

            com.focusPage("#"+ _paymentName + "Checkbox").on("change", function(){
                com.focusPage(_paymentInfo).text("");
            });

            com.focusPage("#"+_paymentName).on("keydown", function(){
                com.focusPage(_paymentInfo).text("");
            });

            if(com.focusPage(_checkboxId).prop("checked")){
                var _payment = 0;

                if(_paymentName == "cash"){
                    args["cash"] = com.focusPage("#cash").val();
                    args["cashInfo"] = com.focusPage("#" + htmlName + "cashInfo").val();

                    _payment = com.focusPage("#cash").val();
                }else if(_paymentName == "bank" || _paymentName == "checkv"){
                    var _bank = 0;
                    var _bankInfo = "#";

                    var name;
                    var numArray;
                    var bankFlag;
                    var flagInfo;

                    if(_paymentName == "bank"){
                        name = htmlName + "bank";
                        numArray = bankNums;
                        bankFlag = "bank";
                        flagInfo = "bankInfo";
                    }else if(_paymentName == "checkv"){
                        name = htmlName + "checkv";
                        numArray = checkvNums;
                        bankFlag = "checkv";
                        flagInfo = "checkvBank";
                    }

                    var returnBankParam = paymentUtils.returnBankParams(numArray, name);

                    args[bankFlag] = returnBankParam[0];
                    args[flagInfo] = returnBankParam[1];

                    _payment = returnBankParam[0];
                }else if(_paymentName == "coupon"){
                    var _coupon = 0;
                    var _couponInfo = "#";

                    com.focusPage("[class='search-choice']", "#couponType_chosen").each(function(i,e){
                        _couponVal = com.focusPage(e).children('span').children('input').val();
                        _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
                        _couponInfo += com.focusPage(e).children('span').text()+":"+_couponVal+"#";

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

                if(com.focusPage(_checkboxId).attr("select") == "1" && (_paymentName == "coupon" || _paymentName == "advance")){
                    args[_selectId] = com.focusPage("#"+_selectId).val();
                }

                realPayment = utils.accAdd(realPayment, parseFloat(_payment));

            }
        }

        return [realPayment, args];
    },

    returnBankParams: function (nameNums, name){
        var _bank = 0;
        var _bankInfo = "#";

        $.each(nameNums, function(i,v){
            var bankName = com.focusPage("#" + name + "Name_"+v).val();
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
            for(var i=1;i<_s.length-1;i++){
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

            if(_name == "bank"){
                com.focusPage("#"  + decorationPayment.htmlName + "bankDivGroup").html("");
                com.focusPage("#"  + decorationPayment.htmlName + "bankAdd").attr("num", 0).attr("maxnum",0);
            }else if(_name == "checkv"){
                com.focusPage("#"  + decorationPayment.htmlName + "checkvDivGroup").html("");
                com.focusPage("#"  + decorationPayment.htmlName + "checkvAdd").attr("num", 0).attr("maxnum",0);
            }
        }

        com.focusPage("#collectDes").val("");

        paymentUtils.EmptyChosen('cashInfo');

        decorationPayment.bankNums = [];
        decorationPayment.checkvNums = [];

        decorationPayment.items.couponType.chosen("destroy");
        decorationPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
        decorationPayment.items.couponType.bindData(decorationPayment.couponType, 'no', 'name');
        decorationPayment.items.couponType.trigger("chosen:updated");

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

        decorationPayment.baseModal.modal("show");
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
        paymentUtils.EmptyChosen('cashInfo');

        paymentUtils.initBaseModal(payment,  decorationPayment);
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

        com.focusPage("#referMoney").val(payment.referMoney);
        com.focusPage("#collectDes").val(payment.comment);
        com.focusPage("#collectDes").attr("disabled","disabled");

        //历史收款信息
        com.focusPage("#cashHistory").text("现金: "+com.checkNull(decorationPayment.cashInfo[payment.cashInfo],"")+" "+com.checkNull(payment.cash,"无"));
        com.focusPage("#bankHistory").text("银行卡: " + (payment.bank == 0 ? "无" : paymentUtils.splitBankInfo(payment.bank, payment.bankInfo, decorationPayment.bankInfo)));
        com.focusPage("#checkvHistory").text("转账: " + (payment.checkv == 0 ? "无" : paymentUtils.splitBankInfo(payment.checkv, payment.checkvBank, decorationPayment.checkBankInfo)));
        com.focusPage("#installmentHistory").text("分期: "+com.checkNull(decorationPayment.bankInfo[payment.installmentBank],"")+" "+com.checkNull(payment.installment,"无"));
        com.focusPage("#accountsHistory").text("对公账户: "+com.checkNull(decorationPayment.accountsInfo[payment.accountsBank],"")+" "+com.checkNull(payment.accounts,"无"));

        //预付款
        com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": payment.decoration.customer.cid},function(res){
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
        if(com.validate()){
            return;
        }

        var url = "";
        var options = {};
        var args = {};
        var referPayment = com.focusPage("#referMoney").val();
        var realPayment = 0;
        var dpids = "";
        var orderId = "";
        var _paymentInfo = "#paymentInfo";
        var couponCount = 0;

        com.focusPage(_paymentInfo).text("");

        var returnParams = paymentUtils.getBankInfoParams(decorationPayment.paymentModelNameData, decorationPayment.htmlName, decorationPayment.bankNums, decorationPayment.checkvNums, couponCount, decorationPayment.typeUpdate, decorationPayment.couponUpdate,  _paymentInfo);

        var realPayment = returnParams[0];
        var args = returnParams[1];

        if(referPayment != realPayment){
            com.focusPage("#paymentInfo").text("当前实收款项总数与应收款项不等,请核实再进行提交!");
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
                com.focusPage("#paymentInfo").text("预付款金额大于当前客户预付款余额!");
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
            searcher.doSearch();
            hsearcher.doSearch();
            decorationPayment.baseModal.modal("hide");

            var argsDrId = result.decorationPayment.drId;

            decorationPaymentPostData.paymentInfo = null;

            if(decorationPayment.typeUpdate == 1){
                bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
                    if(result){
                        params.decorationOrderOrderId = orderId;
                        params.decorationPaymentOrderId = orderId;
                        params.decorationReceiptDrId = argsDrId;
                        com.popup("专用收款收据__装修单号:" + orderId  ,api.index.decorationPaymentReceiptIndex.url,function () {
                            parent.layer.getFrameIndex(window.name);
                        },null,true);
                    }
                });
            }
        });
    },

    //主材初始化模态框（刚粘贴过来，参数还没有修改）
    materialInitBaseModal: function(grade, materialPayment){
        com.focusPage("#couponDiv div.form-group").removeClass("hide");
        com.focusPage('.couponBlue').remove();

        materialPayment.bankNums = [];
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

            if(_name == "coupon"){
                com.focusPage("#couponType").chosen("destroy");
                com.focusPage("#couponType").chosen({width: "216px", multi_type: "input"});
                com.focusPage("#couponType").bindData(materialPayment.couponType, 'no', 'name');
                com.focusPage("#couponType").trigger("chosen:updated");
            }else if(_name == "bank"){
                com.focusPage("#" + materialPayment.htmlName + "bankDivGroup").html("");
                com.focusPage("#" + materialPayment.htmlName + "bankAdd").attr("num", 0).attr("maxnum", 0);
            }else if(_name == "checkv"){
                com.focusPage("#" + materialPayment.htmlName + "checkvDivGroup").html("");
                com.focusPage("#" + materialPayment.htmlName + "checkvAdd").attr("num", 0).attr("maxnum", 0);
            }
        }

        com.focusPage("des").val("");

        paymentUtils.EmptyChosen(materialPayment.htmlName + 'cashInfo');

        materialPayment.items.couponType.chosen("destroy");
        materialPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
        materialPayment.items.couponType.bindData(materialPayment.couponType, 'no', 'name');
        materialPayment.items.couponType.trigger("chosen:updated");

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

        materialPayment.baseModal.modal("show");
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
        com.focusPage("#bankHistoryM").text("银行卡: "+ (payment.bank == 0 ? "无" : paymentUtils.splitBankInfo(payment.bank, payment.bankInfo, materialPayment.bankInfo)));
        com.focusPage("#checkvHistoryM").text("转账: "+ (payment.checkv == 0 ? "无" : paymentUtils.splitBankInfo(payment.checkv, payment.checkvBank, materialPayment.checkBankInfo)));
        com.focusPage("#installmentHistoryM").text("分期: "+com.checkNull(materialPayment.bankInfo[payment.installmentBank],"")+" "+com.checkNull(payment.installment,"无"));
        com.focusPage("#accountsHistoryM").text("对公账户: "+com.checkNull(materialPayment.accountsInfo[payment.accountsBank],"")+" "+com.checkNull(payment.accounts,"无"));

        materialPayment.historyMaterialPayment = utils.accAdd(utils.accAdd(utils.accAdd(payment.cash, payment.bank), utils.accAdd(payment.checkv,payment.coupon)), payment.advance);

        com.focusPage("#referMoney").val(materialPayment.historyMaterialPayment);

        //预付款
        com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": customerId},function(res){
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
        if(com.validate()){
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

        var _paymentInfo = "#paymentInfo";

        com.focusPage(_paymentInfo).text("");

        var returnParams = paymentUtils.getBankInfoParams(materialPayment.paymentModelNameData, materialPayment.htmlName, materialPayment.bankNums, materialPayment.checkvNums, couponCount, materialPayment.typeUpdate,  materialPayment.couponUpdate, _paymentInfo);

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
            searcher.doSearch();
            hsearcher.doSearch();
            materialPayment.historyFlag = false;

            if(materialPayment.typeUpdate == 1){
                var mrId = result.materialReceipt.mrId;
                bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
                    if(result){
                        params.mrId = mrId;
                        params.decorationOrderMOrderId = materialPaymentPostData.orderId;
                        com.popup("专用收款收据__装修单号:" + materialPaymentPostData.orderId  ,api.index.materialPaymentReceiptIndex.url ,function () {
                            parent.layer.getFrameIndex(window.name);
                        },null,true)
                    }
                });
            }
        });

        materialPayment.baseModal.modal("hide");

        materialPaymentPostData.paymentInfo = []
    },

    //销售更新
    salesPaymentUpdate: function(payment, salesPayment){
        salesPayment.myModalLabel.html("更新款项信息");
        salesPayment.collectOrRefundFalg = 4;
        var $layerrAdd = salesPayment.layerAdd;
        salesPayment.layerAdd.attr('orderId', payment.sales.orderId);
        salesPayment.layerAdd.attr('spid', payment.spid);
        com.focusPage('#collectDes').val(payment.salesReceipt.comment).attr("readonly", "readonly");
        com.focusPage("#historyUpdateSA").removeClass("hide");

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

            com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": payment.sales.customer.cid},function(res){
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
        com.focusPage("#bankHistorySA").text("银行卡: " + (payment.salesReceipt.bank == 0 ? "无" : paymentUtils.splitBankInfo(payment.salesReceipt.bank, payment.salesReceipt.bankInfo, salesPayment.bankInfo)));
        com.focusPage("#checkvHistorySA").text("转账: " + (payment.salesReceipt.checkv == 0 ? "无" : paymentUtils.splitBankInfo(payment.salesReceipt.checkv, payment.salesReceipt.checkvBank, salesPayment.checkBankInfo)));
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

        salesPayment.layerAdd.modal("show");
    },

    //销售收款
    aboutcollectAndRefundMoney: function(sid, spid, spids, referMoney, coupon, couponInfo, singleFlag, url, collectOrRefund, salesPayment){
        if(com.validate()){
            return;
        }

        var layerAdd = salesPayment.layerAdd;
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
        var bankInfo = "";
        var checkv = 0;
        var checkvBank = "";
        var payAdvance = 0;
        var advanceType;


        if(com.focusPage("#cashCheckbox").prop("checked")){
            cash = layerAdd.find('#cash').val() != "" ? layerAdd.find('#cash').val() : 0;
            cashInfo = layerAdd.find('#' + salesPayment.htmlName + 'cashInfo').val();
        }

        if(com.focusPage("#bankCheckbox").prop("checked")){
            var aboutBankParams = paymentUtils.returnBankParams(salesPayment.bankNums, salesPayment.htmlName + "bank");
            bank = aboutBankParams[0];
            bankInfo = aboutBankParams[1];
            if (bank == 0) {
                bankInfo = "";
            }
        }

        if(com.focusPage("#checkvCheckbox").prop("checked")){
            var aboutCheckvParams = paymentUtils.returnBankParams(salesPayment.checkvNums, salesPayment.htmlName + "checkv");
            checkv = aboutCheckvParams[0];
            checkvBank = aboutCheckvParams[1];
            if (checkv == 0) {
                checkvBank = "";
            }
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

        var option = {
            "salesReceipt.cash": cash,
            "salesReceipt.cashInfo": cashInfo,
            "salesReceipt.bank": bank,
            "salesReceipt.bankInfo": bankInfo,
            "salesReceipt.checkv": checkv,
            "salesReceipt.checkvBank": checkvBank,
            "salesReceipt.comment": des
        };

        if(collectOrRefund != "update"){
            option["salesPayment.sales.sid"] = sid;
        }

        if(collectOrRefund != "refund"){
            if(singleFlag == "single" && collectOrRefund != "update"){
                option["sales.sid"] = sid;
            }

            option["salesReceipt.advance"] = payAdvance;
            option["salesReceipt.advanceType"] = advanceType;
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

        if(collectOrRefund == "collect"){
            if (!com.focusPage('#advanceDiv').hasClass('hide')) {
                option["salesPayment.advanceType"] = advanceType;
                option["salesPayment.advance"] = parseFloat(payAdvance).toFixed(2);
            }
        }

        com.post(url, option, function () {
            if(collectOrRefund == "collect"){
                com.showAlert(com.info, singleFlag == "single" ? '收款成功' : "批量收款成功")
            }else if(collectOrRefund == "refund"){
                com.showAlert(com.info, '退款成功')
            }else if(collectOrRefund == "update"){
                com.showAlert(com.info, '更新成功')
            }

            if(singleFlag == "single" && collectOrRefund != "refund"){
                salesPayment.items.couponType.chosen("destroy");
                salesPayment.items.couponType.chosen({width: "100%", multi_type: "input"});
                salesPayment.items.couponType.bindData(salesPayment.couponType, 'no', 'name');
                salesPayment.items.couponType.trigger("chosen:updated");
            }
            salesPayment.layerAdd.modal("hide");
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
    	payment.bankNums=[];
    	payment.checkvNums=[];

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

    	paymentUtils.EmptyChosen(payment.htmlName + 'cashInfo');

        payment.modal.modal("show");

    	com.focusPage("#paymentTypeDiv").css("display", "inline");
    	com.focusPage("#des").val(v.comment);
    	com.focusPage("#des").attr("disabled","disabled");
    	com.focusPage("#paymentTypeSel").attr("disabled","disabled");
    	com.focusPage("#paymentTypeSel").val(v.paymentType);

    	//历史收款信息
    	com.focusPage("#cashHistoryP").text("现金: "+com.checkNull(payment.cashInfo[v.cashInfo],"")+" "+com.checkNull(v.cash,"无"));
    	com.focusPage("#bankHistoryP").text("银行卡: " + (v.bank == 0 ? "无" : paymentUtils.splitBankInfo(v.bank, v.bankInfo, payment.bankInfo)));
    	com.focusPage("#checkvHistoryP").text("转账: " + (v.checkv == 0 ? "无" : paymentUtils.splitBankInfo(v.checkv, v.checkvBank, payment.checkBankInfo)));
    	com.focusPage("#installmentHistoryP").text("分期: "+com.checkNull(payment.bankInfo[v.installmentBank],"")+" "+com.checkNull(v.installment,"无"));
    	com.focusPage("#accountsHistoryP").text("对公账户: "+com.checkNull(payment.accountsInfo[v.accountsBank],"")+" "+com.checkNull(v.accounts,"无"));

    	payment.temp = v;
    	payment.historyPayment = utils.accAdd(utils.accAdd(v.cash,v.bank),v.checkv);
    },

    //预付款付款
    paymentSaveData: function(payment, hsearcher){
        com.focusPage('.payWayError').hide();

        if(com.validate()){
            return;
        }

        if(com.focusPage(".pay_way input:checkbox:checked").length == 0){
            com.focusPage('.payWayError').show();
            return;
        }

        var url = "";
        var total = 0;
        var options = {};

        options["payment.customer.cid"] = payment.temp.customer.cid;
        options["payment.balance"] = payment.temp.balance;
        options["payment.paymentType"] = com.focusPage("#paymentTypeSel").val();
        options["payment.orderId"] = params.orderId;

        if(com.focusPage("#cashCheckbox").prop("checked")){
            options["payment.cash"] = com.focusPage("#cash").val().trim();
            options["payment.cashInfo"] = com.focusPage("#" + payment.htmlName + "cashInfo").val().trim();

            total = utils.accAdd(parseFloat(com.focusPage("#cash").val()), total);
        }

        if(com.focusPage("#bankCheckbox").prop("checked")){
            var bankParams = paymentUtils.returnBankParams(payment.bankNums, payment.htmlName + "bank");

            total = utils.accAdd(bankParams[0], total);

            options["payment.bank"] = bankParams[0];
            options["payment.bankInfo"] = bankParams[1];
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
            if(parseFloat(total) <= 0){
                com.showAlert(com.warning, "收款金额需要大于零!");
                return false;
            }
        }else if(payment.typeUpdate == 2){
            var refund = com.focusPage("#refund").val();
            var refundSum = com.focusPage("#refundSum").val();

            if(parseFloat(refund) <= 0){
                com.focusPage("#paymentInfo").text("提款金额需要大于零!");
                return false;
            }

            if(parseFloat(refundSum) < parseFloat(refund)){
                com.focusPage("#paymentInfo").text("提款金额不能大于余额!");
                return false;
            }

            if(parseFloat(total)!=parseFloat(refund)){
                com.focusPage("#paymentInfo").text("当前提款项总数与提款金额不等,请核实再进行提交!!");
                return false;
            }

            url = api.payment.withdrawPayment;
            options["payment.type"] = 0;
            options["payment.comment"] = com.focusPage("#des").val().trim();
            options["payment.uniqueid"] = new Date().getTime();

        }else if(payment.typeUpdate == 3){
            if(parseFloat(total) <= 0){
                com.focusPage("#paymentInfo").text("提款金额需要大于零!");
                return false;
            }

            if(parseFloat(total) != parseFloat(payment.historyPayment)){
                com.focusPage("#paymentInfo").text("当前更新款项金额与原收款金额不等,请核实再进行提交!!");
                return false;
            }

            url = api.payment.updatePayment;
            options["payment.pid"] = payment.temp.pid;
        }

        com.post(url, options, function(res){
            //searcher.doSearch();
            hsearcher.doSearch();

            com.post(api.payment.queryAdvancePaymentByCustomerId, {"customer.cid": res.payment.customer.cid}, function(resBalance){
                if(com.focusPage("#"+params.orderId+"contractBalance").length>0){
                    com.focusPage("#"+params.orderId+"contractBalance").html(resBalance.balanceAdvance);
                    com.focusPage("#"+params.orderId+"projectBalance").html(resBalance.projectAdvance);
                    com.focusPage("#"+params.orderId+"materialBalance").html(resBalance.materialAdvance);
                    com.focusPage("#"+params.orderId+"zaterialBalance").html(resBalance.zaterialAdvance);
                }else{
                    paymentUtils.paymentUl(params, resBalance);
                }
            });

            if(payment.paymentTypes != null){
                if(payment.paymentTypes.search('收款') != -1 || payment.paymentTypes == "收款" && payment.typeUpdate == 1){
                    bootbox.confirm("是否需要打印当前收款对应的收据信息?", function(result) {
                        if(result){
                            params.paymentPaymentId = res.payment.pid;
                            com.popup("专用收款收据__装修单号:" + res.payment.orderId  ,api.index.paymentReceiptIndex.url,function () {
                                parent.layer.getFrameIndex(window.name);
                            },null,true)
                        }
                    });
                }
            }
        });

        payment.modal.modal("hide");
    },

    paymentUl: function(v,res) {
        ul = com.focusPage("#"+v.orderId+"ul");
        paymentUtils.paymentBalance(ul,"合同预付款 ",res.balanceAdvance,"blue",v.orderId+"contractBalance");
        paymentUtils.paymentBalance(ul,"工程预付款 ",res.projectAdvance,"blue",v.orderId+"projectBalance");
        paymentUtils.paymentBalance(ul,"主材预付款 ",res.materialAdvance,"blue",v.orderId+"materialBalance");
        paymentUtils.paymentBalance(ul,"正林预付款 ",res.zaterialAdvance,"blue",v.orderId+"zaterialBalance");
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

        servicePayment.bankNums=[];
        servicePayment.checkvNums=[];

        com.focusPage("#collectDes").val("").removeAttr("readonly");
        com.focusPage("#referMoney").removeAttr("readonly");

        paymentUtils.EmptyChosen(servicePayment.htmlName + 'cashInfo');

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
        if(servicePayment.baseModal.attr("ChargeType")==1){
            com.focusPage("#myModalLabel").text("付款信息");
            com.focusPage("#collectBtn").text("收款");
            com.focusPage("#serviceMoney").css("display","none");
            com.focusPage("#referMoney").val("");
            com.focusPage("#collectDes").val("");
        }else if(servicePayment.baseModal.attr("ChargeType")==2){
            com.focusPage("#myModalLabel").text("付款信息");
            com.focusPage("#collectBtn").text("收款");
            com.focusPage("#serviceMoney").css("display","block");
            com.focusPage("#sMoney").val(v.servicePrice - v.servicePaidup);
            com.focusPage("#sMoney").attr("readonly","readonly");
            com.focusPage("#referMoney").val("");
            com.focusPage("#collectDes").val("");
        }else if(servicePayment.baseModal.attr("ChargeType")==3){
            com.focusPage("#myModalLabel").text("退款信息");
            com.focusPage("#collectBtn").text("退款");
            com.focusPage("#serviceMoney").css("display","none");
            com.focusPage("#referMoney").val(v.servicePaidup);
            com.focusPage("#referMoney").attr("readonly","readonly");
            com.focusPage("#collectDes").val("");
        }else if(servicePayment.baseModal.attr("ChargeType")==4){
            com.focusPage("#historyUpdateS").removeClass("hide");
            com.focusPage("#myModalLabel").text("更新付款信息");
            com.focusPage("#collectBtn").text("收款");
            com.focusPage("#serviceMoney").css("display","none");
            com.focusPage("#referMoney").val(v.serviceMoney+ v.advanceMoney).attr("readonly", "readonly");
            com.focusPage("#collectDes").val(v.comment).attr("readonly", "readonly");

            //历史收款信息
            com.focusPage("#cashHistoryS").text("现金: "+com.checkNull(servicePayment.cashInfo[v.serviceReceipt.cashInfo],"")+" "+com.checkNull(v.serviceReceipt.cash,"无"));
            com.focusPage("#bankHistoryS").text("银行卡: " + (v.serviceReceipt.bank == 0 ? "无" : paymentUtils.splitBankInfo(v.serviceReceipt.bank, v.serviceReceipt.bankInfo, servicePayment.bankInfo)));
            com.focusPage("#checkvHistoryS").text("转账: " + (v.serviceReceipt.checkv == 0 ? "无" : paymentUtils.splitBankInfo(v.serviceReceipt.checkv, v.serviceReceipt.checkvBank, servicePayment.checkBankInfo)));
            com.focusPage("#installmentHistoryS").text("分期: "+com.checkNull(servicePayment.bankInfo[v.serviceReceipt.installmentBank],"")+" "+com.checkNull(v.serviceReceipt.installment,"无"));
            com.focusPage("#accountsHistoryS").text("对公账户: "+com.checkNull(servicePayment.accountsInfo[v.serviceReceipt.accountsBank],"")+" "+com.checkNull(v.serviceReceipt.accounts,"无"));

        }

        servicePayment.baseModal.modal("show");

        servicePayment.moreMsg[0]=$.extend({},v);
    },

    //服务款交款
    servicePaymentCollect: function(servicePayment, searcher, hsearcher){
        if(com.validate()){
            return;
        }

        var v = servicePayment.moreMsg[0];
        var referMoney = com.focusPage("#referMoney").val();
        var des = com.focusPage("#collectDes").val();

        var cash = 0;
        var cashbInfo = "";
        var bank = 0;
        var bankInfo = "";
        var checkv = 0;
        var checkvBank = "";

        if(com.focusPage("#cashCheckbox").prop("checked")){
            cash = com.focusPage("#cash").val();
            cashbInfo = com.focusPage("#" + servicePayment.htmlName + "cashInfo").val();
        }

        if(com.focusPage("#bankCheckbox").prop("checked")){
            var aboutBankParams = paymentUtils.returnBankParams(servicePayment.bankNums, servicePayment.htmlName + "bank");
            bank = aboutBankParams[0];
            bankInfo = aboutBankParams[1];
        }

        if(com.focusPage("#checkvCheckbox").prop("checked")){
            var aboutChenckvParams = paymentUtils.returnBankParams(servicePayment.checkvNums, servicePayment.htmlName + "checkv");
            checkv = aboutChenckvParams[0];
            checkvBank = aboutChenckvParams[1];
        }

        var realMoney = utils.accAdd(utils.accAdd(cash, bank), checkv);

        if (referMoney != realMoney) {
            com.showAlert(com.error, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        if(servicePayment.baseModal.attr("ChargeType")==2) {
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

        if(servicePayment.baseModal.attr("ChargeType")==1){
            currentUrl = api.payment.collectServicePayment;
            currentOption = option;
            successMessage = "收款成功";
            failMessage = "收款失败";
        }else if(servicePayment.baseModal.attr("ChargeType")==2){
            currentUrl = api.payment.collectServicePaymentForService;
            currentOption = option;
            successMessage = "收款成功";
            failMessage = "收款失败";
        }else if(servicePayment.baseModal.attr("ChargeType")==3){
            currentUrl = api.payment.refundServicePaymentForService;
            currentOption = option;
            successMessage = "退款成功";
            failMessage = "退款失败";
        }else if(servicePayment.baseModal.attr("ChargeType")==4){
            currentUrl = api.payment.updateServicePayment;
            currentOption = option;
            currentOption["servicePayment.spid"] = servicePayment.spid;
            currentOption["servicePayment.pid"] = servicePayment.pid;
            successMessage = "更新成功";
            failMessage = "更新失败";
        }

        com.post(currentUrl, currentOption, function () {
            searcher.doSearch();
            if(servicePayment.baseModal.attr("ChargeType")==4) {
                hsearcher.doSearch();
            }
            com.showAlert(com.info, successMessage);
            servicePayment.baseModal.modal("hide");
        }, function () {
            searcher.doSearch();
            com.showAlert(com.error, failMessage);
            servicePayment.baseModal.modal("hide");
        });
    },

    //获取收款类型的基础信息 info信息是分页显示信息的, util和cash,bank,checkBank是下拉框信息(下拉框不显示禁用)
    getReceiptType: function(payment){
        var notCouponPageName = ["payment", "paymentCheck", "service", "serviceCheck"];
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
    }
};