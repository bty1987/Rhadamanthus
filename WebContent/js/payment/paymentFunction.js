jQuery(function($) {

    var paymentFunction = {
        modal: {
            apiModal : com.focusPage("#apiModal", "#payment")
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn", "#payment")
        },
        items: {
            apiData: com.focusPage("#apiData", "#payment"),
            condArrData: com.focusPage("#condArrData", "#payment"),
            fieldData: com.focusPage("#fieldData", "#payment"),
            functionData: com.focusPage("#functionData", "#payment"),
            typeData: com.focusPage("#typeData", "#payment"),
            statusData: com.focusPage("#statusData", "#payment"),
            payData: com.focusPage("#payData", "#payment")
        },
        
        name: {},
        group: null,
        pfids : []
    };

    com.post(api.payment.queryPaymentFunction, {"paymentFunction.type": 0}, function (res) {

        $.each(res.paymentFunctions, function (i, v) {
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            var $li = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('配置');

            $divBtnWrap.append($btnView).appendTo($h3);

            $h3.appendTo($li.appendTo($ul));

            $btnView.on('click', function () {
                apiConfig(v);
            });
            
            $ul.appendTo(com.focusPage("#resultList"));
        });
    });

    //显示所有api进行配置
    function apiConfig(value) {

        paymentFunction.name = value.key;
        paymentFunction.group = value.group;
        paymentFunction.pfids = [];

        com.post(api.right.queryPaymentFunctionRight, {"paymentFunctionRight.name" : paymentFunction.name, "paymentFunctionRight.type" : paymentFunction.group}, function (res) {
            $.each(res.paymentFunctionRights, function (i, va) {
                paymentFunction.pfids.push(va.paymentFunction.pfid);
            });
        }, null, false);
        
        com.post(api.payment.queryPaymentFunction, {"paymentFunction.type": ""}, function (res) {
            
            paymentFunction.items.apiData.empty();
            paymentFunction.items.condArrData.empty();
            paymentFunction.items.fieldData.empty();
            paymentFunction.items.functionData.empty();
            paymentFunction.items.typeData.empty();
            paymentFunction.items.statusData.empty();
            paymentFunction.items.payData.empty();
            var paymentFunctionArr = res.paymentFunctions;

            $.each(paymentFunctionArr.sort(function (x, y) { return x['sort'] - y['sort']}), function (i, v) {
                if((v.group&value.group)==0) return;

                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                var $label = $('<label></label>');
                var $input = $('<input>').attr({"type": "checkbox", "name": "pfids", "class": "ace"}).val(v.pfid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.name + (v.type ==  0 ? "" : com.checkNull(v.comment, "")));

                $label.append($input).append($span).appendTo($div);

                if(v.type == constant.payment().paymentFunction.TYPE_API_INT){
                    $input.attr("type", "radio");
                    $div.appendTo(paymentFunction.items.apiData);
                }

                if(v.type == constant.payment().paymentFunction.TYPE_CONDITION_INT){
                    $div.appendTo(paymentFunction.items.condArrData);
                }

                if(v.type == constant.payment().paymentFunction.TYPE_FIELD_INT){
                    $div.appendTo(paymentFunction.items.fieldData);
                }

                if(v.type == constant.payment().paymentFunction.TYPE_FUNCTION_INT){
                    $div.appendTo(paymentFunction.items.functionData);
                }

                if(v.type == constant.payment().paymentFunction.TYPE_NODE_INT){
                    $div.appendTo(paymentFunction.items.typeData);
                }

                if(v.type == constant.payment().paymentFunction.TYPE_STATUS_INT){
                    $div.appendTo(paymentFunction.items.statusData);
                }

                if(v.type == constant.payment().paymentFunction.TYPE_PAYTYPE_INT){
                    $div.appendTo(paymentFunction.items.payData);
                }

                if(paymentFunction.pfids.indexOf(v.pfid)!= -1){
                    $input.attr("checked",true);
                }
            });
        });
        
        paymentFunction.modal.apiModal.modal("show");
    }

    //配置完成确定按钮
    paymentFunction.btn.apiBtn.click(function () {
        var $inputs = com.focusPage('input[name="pfids"]:checked');

        var options = {};

        $.each($inputs,function (i, v) {
            options["paymentFunctionRight.name"] = paymentFunction.name;
            options["paymentFunctionRight.type"] = paymentFunction.group;
            options["pfids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updatePaymentFunctionRight, options, function (res) {
            com.showAlert(com.info, "配置成功");
            paymentFunction.modal.apiModal.modal("hide");
        })
    });

});