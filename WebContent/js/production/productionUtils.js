var productionUtils = {
    //initBindData: function bindPdata(thi, d, k, v, o) {
    //    if (thi[0] != undefined && thi[0].nodeName.toLowerCase() == "select" && d != undefined) {
    //        thi.empty();
    //        var optionHTML = "";
    //
    //        for (var i = 0; i < d.length; i++) {
    //            if (typeof d[i] == 'object') {
    //                if (k == undefined || v == undefined || k == "" || v == "") {
    //                    console.log("该控件无法绑定列表数据");
    //                }
    //                optionHTML = optionHTML + "<option value='" + d[i][o][k] + "'>" + d[i][o][v] + "</option>";
    //
    //            } else {
    //                optionHTML = optionHTML + "<option value='" + d[i] + "' multikey='multikey'>" + d[i] + "</option>";
    //            }
    //        }
    //        $(optionHTML).appendTo(thi);
    //
    //    } else {
    //        console.log("该控件无法绑定列表数据");
    //    }
    //},
    clearForm: function (formId) {
        var $form = com.focusPage("#" + formId);
        $('.control-group').removeClass("success").removeClass("error");
        $(".ok").remove();
        $(".help-inline").remove();
        $("span.checked", $form).removeClass("checked");
        $("tr.edit-on").removeClass("edit-on");
        $form.removeClass("edit-item");
        $(".extra-wrap .control-group:not(.hide)").remove();//去掉辅助项
        $('input[type="hidden"]', $form).val('');
        document.getElementById(formId).reset();
    },
    hideBtnByPStatus:function(){

    },

};
