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

    addBankUtil : function (index, divName, divGroup, bankArray, bankUtil, htmlFlag){
        var d = new Date();
        var name;
        var bankUtilName;
        var pageName;

        bankArray.push(index);

        if(divName == "bankDiv"){
            name = "bank";
            bankUtilName = "bankName_";
        } else if (divName == "checkvDiv"){
            name = "checkv";
            bankUtilName = "checkvName_";
        }

        switch(htmlFlag)
        {
            case "decoration":
                pageName = "";
                break;
            case "material":
                pageName = "material";
                break;
            case "payment":
                pageName = "payment";
                break;
            case "service":
                pageName = "service";
                break;
            case "sales":
                pageName = "sales";
                break;
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

        paymentUtils.dynamicChosen('baseItemModal', pageName + bankUtilName +index, bankUtil, "key", "value");
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

        return [_bank, _bankInfo]
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
    }
};