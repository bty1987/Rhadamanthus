jQuery(function($) {

    var quotationFunction = {
        modal: {
            apiModal: com.focusPage("#apiModal", "#quotationFunction")
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn", "#quotationFunction")
        },
        items: {
            apiData: com.focusPage("#apiData", "#quotationFunction"),
            condArrData: com.focusPage("#condArrData", "#quotationFunction"),
            fieldData: com.focusPage("#fieldData", "#quotationFunction"),
            functionData: com.focusPage("#functionData", "#quotationFunction"),
            typeData: com.focusPage("#typeData", "#quotationFunction"),
            statusData: com.focusPage("#statusData", "#quotationFunction")
        },

        name: {},
        group: null,
        qfids: []
    };

    com.post(api.quotation.queryQuotationFunction, {
        "quotationFunction.type": 0
    }, function(res) {

        $.each(res.quotationFunctions, function(i, v) {

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            var $li = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('配置');

            $divBtnWrap.append($btnView).appendTo($h3);

            $h3.appendTo($li.appendTo($ul));

            $btnView.on('click', function() {

                apiConfig(v);
            });

            $ul.appendTo(com.focusPage("#resultList"));
        });
    });

    // 显示所有api进行配置
    function apiConfig(value) {

        quotationFunction.name = value.key;
        quotationFunction.group = value.group;
        quotationFunction.qfids = [];

        com.post(api.right.queryQuotationFunctionRight, {
            "quotationFunctionRight.name": quotationFunction.name,
            "quotationFunctionRight.type": quotationFunction.group
        }, function(res) {

            $.each(res.quotationFunctionRights, function(i, va) {

                quotationFunction.qfids.push(va.quotationFunction.qfid);
            });
        }, null, false);

        com.post(api.quotation.queryQuotationFunction, {
            "quotationFunction.type": ""
        }, function(res) {

            quotationFunction.items.apiData.empty();
            quotationFunction.items.condArrData.empty();
            quotationFunction.items.fieldData.empty();
            quotationFunction.items.functionData.empty();
            quotationFunction.items.typeData.empty();
            quotationFunction.items.statusData.empty();
            var quotationFunctionArr = res.quotationFunctions;

            $.each(quotationFunctionArr.sort(function(x, y) {

                return x['sort'] - y['sort'];
            }), function(i, v) {

                if (v.group == value.group || v.group == 0) {

                    var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                    var $label = $('<label></label>');
                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "qfids",
                        "class": "ace"
                    }).val(v.qfid);
                    var $span = $('<span></span>').addClass('lbl blue').text(v.name + (v.type == 0 ? "" : com.checkNull(v.comment, "")));

                    $label.append($input).append($span).appendTo($div);

                    if (v.type == 1) {
                        $input.attr("type", "radio");
                        $div.appendTo(quotationFunction.items.apiData);
                    }

                    if (v.type == 2) {
                        $div.appendTo(quotationFunction.items.condArrData);
                    }

                    if (v.type == 3) {
                        $div.appendTo(quotationFunction.items.fieldData);
                    }

                    if (v.type == 4) {
                        $div.appendTo(quotationFunction.items.functionData);
                    }

                    if (quotationFunction.qfids.indexOf(v.qfid) != -1) {
                        $input.attr("checked", true);
                    }
                }
            });
        });

        quotationFunction.modal.apiModal.modal("show");
    }

    // 配置完成确定按钮
    quotationFunction.btn.apiBtn.click(function() {

        var $inputs = com.focusPage('input[name="qfids"]:checked');

        var options = {};

        $.each($inputs, function(i, v) {

            options["quotationFunctionRight.name"] = quotationFunction.name;
            options["quotationFunctionRight.type"] = quotationFunction.group;
            options["qfids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updateQuotationFunctionRight, options, function(res) {

            com.showAlert(com.info, "配置成功");
            quotationFunction.modal.apiModal.modal("hide");
        })
    });

});