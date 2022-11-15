jQuery(function ($) {

    var salesFunction = {
        modal: {
            apiModal: com.focusPage("#apiModal"),
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn"),
        },
        items: {
            apiData: com.focusPage("#apiData"),
            condArrData: com.focusPage("#condArrData"),
            fieldData: com.focusPage("#fieldData"),
            functionData: com.focusPage("#functionData"),
            statusData: com.focusPage("#statusData"),
        },

        name: {},
        sfids : [],
    };

    com.post(api.sales.querySalesFunction, {"salesFunction.type": 0}, function (res) {

        res.salesFunctions = res.salesFunctions.sort(function (a, b) {return (a.sort - b.sort);});
        $.each(res.salesFunctions, function (i, v) {
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            var $li = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name + " " + (v.comment ? v.comment : "")));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('配置');

            $divBtnWrap.append($btnView).appendTo($h3);
            $h3.appendTo($li.appendTo($ul));

            $btnView.on('click', function () {
                apiConfig(v.key, v.group);
            });

            $ul.appendTo(com.focusPage("#resultList"));
        });
    });

    //显示所有api进行配置
    function apiConfig(key, group) {

        salesFunction.name = key;
        salesFunction.sfids = [];

        com.post(api.right.querySalesFunctionRightByName, {"salesFunctionRight.name" : salesFunction.name}, function (res) {
                $.each(res.salesFunctionRights, function (i, va) {
                    salesFunction.sfids.push(va.salesFunction.sfid);
                });
            }, null, false);

        com.post(api.sales.querySalesFunction, {"salesFunction.type": ""}, function (res) {

            salesFunction.items.apiData.empty();
            salesFunction.items.condArrData.empty();
            salesFunction.items.fieldData.empty();
            salesFunction.items.functionData.empty();
            salesFunction.items.statusData.empty();

            res.salesFunctions = res.salesFunctions.sort(function (a, b) {
                return (a.sort - b.sort);
            });
            $.each(res.salesFunctions, function (i, v) {

                if ((v.group & group) == 0) return true;

                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                var $label = $('<label></label>');
                var $input = $('<input>').attr({"type": "checkbox", "name": "sfids", "class": "ace"}).val(v.sfid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.name);
                $label.append($input).append($span).appendTo($div);

                if (v.type == constant.sales().salesFunction.TYPE_API_INT) {
                    $input.attr("type", "radio");
                    $div.appendTo(salesFunction.items.apiData);
                }

                if (v.type == constant.sales().salesFunction.TYPE_CONDITION_INT) {
                    $div.appendTo(salesFunction.items.condArrData);
                }

                if (v.type == constant.sales().salesFunction.TYPE_FILID_INT) {
                    $div.appendTo(salesFunction.items.fieldData);
                }

                if (v.type == constant.sales().salesFunction.TYPE_FUNCTION_INT) {
                    $div.appendTo(salesFunction.items.functionData);
                }

                if (v.type == constant.sales().salesFunction.TYPE_STATUS_INT) {
                    $div.appendTo(salesFunction.items.statusData);
                }

                if (salesFunction.sfids.indexOf(v.sfid) != -1) {
                    $input.attr("checked", true);
                }
            });
        });

        salesFunction.modal.apiModal.modal("show");
    }

    //配置完成确定按钮
    salesFunction.btn.apiBtn.click(function () {
        var $inputs = com.focusPage('input[name="sfids"]:checked');

        var options = {};

        $.each($inputs, function (i, v) {
            options["salesFunctionRight.name"] = salesFunction.name;
            options["sfids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updateSalesFunctionRight, options, function (res) {
            com.showAlert(com.info, "配置成功");
            salesFunction.modal.apiModal.modal("hide");
        })
    });

});