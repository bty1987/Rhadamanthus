jQuery(function ($) {

    // type 约定(与 payment/sales/decoration 一致):
    // 0 类型(页面分组) 1 api 2 条件 3 字段 4 功能
    var TYPE_TYPE_INT = 0;
    var TYPE_API_INT = 1;
    var TYPE_CONDITION_INT = 2;
    var TYPE_FIELD_INT = 3;
    var TYPE_FUNCTION_INT = 4;

    var constructionFunction = {
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
        },

        name: {},
        cfids: [],
    };

    // 页面分组列表(type=0)
    com.post(api.construction.queryConstructionFunction, { "constructionFunction.type": TYPE_TYPE_INT }, function (res) {

        res.constructionFunctions = res.constructionFunctions.sort(function (a, b) { return (a.sort - b.sort); });
        $.each(res.constructionFunctions, function (i, v) {

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            var $li = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.value + (v.comment ? " " + v.comment : "")));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('配置');

            $divBtnWrap.append($btnView).appendTo($h3);
            $h3.appendTo($li.appendTo($ul));

            $btnView.on('click', function () {
                apiConfig(v.name);
            });

            $ul.appendTo(com.focusPage("#resultList"));
        });
    });

    // 显示某页面下所有功能项进行配置
    function apiConfig(name) {

        constructionFunction.name = name;
        constructionFunction.cfids = [];

        // 当前公司已配置的功能项
        com.post(api.right.queryConstructionFunctionRightByName, { "constructionFunctionRight.name": constructionFunction.name }, function (res) {

            $.each(res.constructionFunctionRights, function (i, va) {
                constructionFunction.cfids.push(va.constructionFunction.cfid);
            });
        }, null, false);

        // 取该页面下全部可选功能项(非 type=0 的均纳入候选)
        com.post(api.construction.queryConstructionFunction, { "constructionFunction.type": "" }, function (res) {

            constructionFunction.items.apiData.empty();
            constructionFunction.items.condArrData.empty();
            constructionFunction.items.fieldData.empty();
            constructionFunction.items.functionData.empty();

            res.constructionFunctions = res.constructionFunctions.sort(function (a, b) {
                return (a.sort - b.sort);
            });

            $.each(res.constructionFunctions, function (i, v) {

                // 跳过页面分组本身, 仅展示功能项
                if (v.type == TYPE_TYPE_INT) return true;
                // 仅展示属于当前页面的功能项
                if (v.name != constructionFunction.name) return true;

                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                var $label = $('<label></label>');
                var $input = $('<input>').attr({ "type": "checkbox", "name": "cfids", "class": "ace" }).val(v.cfid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.comment ? v.comment : v.value);
                $label.append($input).append($span).appendTo($div);

                if (v.type == TYPE_API_INT) {
                    $input.attr("type", "radio");
                    $div.appendTo(constructionFunction.items.apiData);
                }

                if (v.type == TYPE_CONDITION_INT) {
                    $div.appendTo(constructionFunction.items.condArrData);
                }

                if (v.type == TYPE_FIELD_INT) {
                    $div.appendTo(constructionFunction.items.fieldData);
                }

                if (v.type == TYPE_FUNCTION_INT) {
                    $div.appendTo(constructionFunction.items.functionData);
                }

                if (constructionFunction.cfids.indexOf(v.cfid) != -1) {
                    $input.attr("checked", true);
                }
            });
        });

        constructionFunction.modal.apiModal.modal("show");
    }

    // 配置完成确定按钮
    constructionFunction.btn.apiBtn.click(function () {

        var $inputs = com.focusPage('input[name="cfids"]:checked');

        var options = {
            "constructionFunctionRight.name": constructionFunction.name
        };

        $.each($inputs, function (i, v) {
            options["cfids[" + i + "]"] = $(v).val();
        });

        // 未勾选任何项时显式传空标记, 保证后端能清空
        if ($inputs.length == 0) {
            options["cfids[0]"] = "";
        }

        com.post(api.right.updateConstructionFunctionRight, options, function (res) {

            com.showAlert(com.info, "配置成功");
            constructionFunction.modal.apiModal.modal("hide");
        });
    });

});
