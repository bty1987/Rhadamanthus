var paymentBank = {
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
        var bankDateInput = $('<input/>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", pageName + name + "Date_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);

        var bankTimeDiv_ = $('<div></div>').addClass('form-group').appendTo(bankDiv);
        var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankTimeDiv_);
        var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankTimeDiv_);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput =  $('<input/>').addClass('col-sm-6 v_time v_required').attr("type", "text").attr("id", pageName + name + "Time_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);

        paymentUtils.dynamicChosen('baseItemModal', pageName + bankUtilName +index, bankUtil, "key", "value");
    }
};
