jQuery(function($) {

    var customerFunction = {
        modal: {
            apiModal : com.focusPage("#apiModal", "#customerOrigine")
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn", "#customerOrigine")
        },
        items: {
            apiData: com.focusPage("#apiData", "#customerOrigine"),
            condArrData: com.focusPage("#condArrData", "#customerOrigine"),
            fieldData: com.focusPage("#fieldData", "#customerOrigine"),
            functionData: com.focusPage("#functionData", "#customerOrigine"),
            typeData: com.focusPage("#typeData", "#customerOrigine"),
            statusData: com.focusPage("#statusData", "#customerOrigine")
        },
        
        name: {},
        cfids : []
    };

    com.post(api.customer.queryCustomerFunction, {"customerFunction.type": 0}, function (res) {

        $.each(res.customerFunctions, function (i, v) {
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

        customerFunction.name = value.key;
        customerFunction.group = value.group;
        customerFunction.cfids = [];

        com.post(api.right.queryCustomerFunctionRight, {"customerFunctionRight.name" : customerFunction.name}, function (res) {
            $.each(res.customerFunctionRights, function (i, va) {
                customerFunction.cfids.push(va.customerFunction.cfid);
            });
        }, null, false);
        
        com.post(api.customer.queryCustomerFunction, {"customerFunction.type": ""}, function (res) {

            customerFunction.items.apiData.empty();
            customerFunction.items.condArrData.empty();
            customerFunction.items.fieldData.empty();
            customerFunction.items.functionData.empty();
            customerFunction.items.typeData.empty();
            customerFunction.items.statusData.empty();
            var customerFunctionArr = res.customerFunctions;

            $.each(customerFunctionArr.sort(function (x, y) { return x['sort'] - y['sort']}), function (i, v) {

                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                var $label = $('<label></label>');
                var $input = $('<input>').attr({"type": "checkbox", "name": "cfids", "class": "ace"}).val(v.cfid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.name + (v.type ==  0 ? "" : com.checkNull(v.comment, "")));

                $label.append($input).append($span).appendTo($div);

                if(v.type == 1){
                    $input.attr("type", "radio");
                    $div.appendTo(customerFunction.items.apiData);
                }

                if(v.type == 2){
                    $div.appendTo(customerFunction.items.condArrData);
                }

                if(v.type == 3){
                    $div.appendTo(customerFunction.items.fieldData);
                }

                if(v.type == 4){
                    $div.appendTo(customerFunction.items.functionData);
                }

                if(customerFunction.cfids.indexOf(v.cfid)!= -1){
                    $input.attr("checked",true);
                }
            });
        });

        customerFunction.modal.apiModal.modal("show");
    }

    //配置完成确定按钮
    customerFunction.btn.apiBtn.click(function () {
        var $inputs = com.focusPage('input[name="cfids"]:checked');

        var options = {};

        $.each($inputs,function (i, v) {
            options["customerFunctionRight.name"] = customerFunction.name;
            options["cfids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updateCustomerFunctionRight, options, function (res) {
            com.showAlert(com.info, "配置成功");
            customerFunction.modal.apiModal.modal("hide");
        })
    });

});