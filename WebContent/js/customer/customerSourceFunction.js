jQuery(function($) {

    var customerSourceFunction = {
        modal: {
            apiModal : com.focusPage("#apiModal", "#customerSource")
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn", "#customerSource")
        },
        items: {
            apiData: com.focusPage("#apiData", "#customerSource"),
            condArrData: com.focusPage("#condArrData", "#customerSource"),
            fieldData: com.focusPage("#fieldData", "#customerSource"),
            functionData: com.focusPage("#functionData", "#customerSource"),
            typeData: com.focusPage("#typeData", "#customerSource"),
            statusData: com.focusPage("#statusData", "#customerSource")
        },
        
        name: {},
        cfids : []
    };

    com.post(api.customer.queryCustomerOriginFunction, {"customerOriginFunction.type": 0}, function (res) {

        $.each(res.customerOriginFunctions, function (i, v) {
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

        customerSourceFunction.name = value.key;
        customerSourceFunction.group = value.group;
        customerSourceFunction.cfids = [];

        com.post(api.right.queryCustomerOriginFunctionRight, {"customerOriginFunctionRight.name" : customerSourceFunction.name}, function (res) {
            $.each(res.customerOriginFunctionRights, function (i, va) {
                customerSourceFunction.cfids.push(va.customerOriginFunction.cfid);
            });
        }, null, false);
        
        com.post(api.customer.queryCustomerOriginFunction, {"customerOriginFunction.type": ""}, function (res) {

            customerSourceFunction.items.apiData.empty();
            customerSourceFunction.items.condArrData.empty();
            customerSourceFunction.items.fieldData.empty();
            customerSourceFunction.items.functionData.empty();
            customerSourceFunction.items.typeData.empty();
            customerSourceFunction.items.statusData.empty();
            var customerOriginFunctionArr = res.customerOriginFunctions;

            $.each(customerOriginFunctionArr.sort(function (x, y) { return x['sort'] - y['sort']}), function (i, v) {

                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                var $label = $('<label></label>');
                var $input = $('<input>').attr({"type": "checkbox", "name": "cfids", "class": "ace"}).val(v.cfid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.name + (v.type ==  0 ? "" : com.checkNull(v.comment, "")));

                $label.append($input).append($span).appendTo($div);

                if(v.type == 1){
                    $input.attr("type", "radio");
                    $div.appendTo(customerSourceFunction.items.apiData);
                }

                if(v.type == 2){
                    $div.appendTo(customerSourceFunction.items.condArrData);
                }

                if(v.type == 3){
                    $div.appendTo(customerSourceFunction.items.fieldData);
                }

                if(v.type == 4){
                    $div.appendTo(customerSourceFunction.items.functionData);
                }

                if(customerSourceFunction.cfids.indexOf(v.cfid)!= -1){
                    $input.attr("checked",true);
                }
            });
        });

        customerSourceFunction.modal.apiModal.modal("show");
    }

    //配置完成确定按钮
    customerSourceFunction.btn.apiBtn.click(function () {
        var $inputs = com.focusPage('input[name="cfids"]:checked');

        var options = {};

        $.each($inputs,function (i, v) {
            options["customerOriginFunctionRight.name"] = customerSourceFunction.name;
            options["cfids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updateCustomerOriginFunctionRight, options, function (res) {
            com.showAlert(com.info, "配置成功");
            customerSourceFunction.modal.apiModal.modal("hide");
        })
    });

});