jQuery(function($) {

    var productionFunction = {
        modal: {
            apiModal : com.focusPage("#apiModal"),
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn"),
        },
        items: {
            apiData: com.focusPage("#apiData"),
            condArrData: com.focusPage("#condArrData"),
            fieldData: com.focusPage("#fieldData"),
            functionData: com.focusPage("#functionData"),
            nodeData: com.focusPage("#nodeData"),
        },

        name: {},
        pfids : [],
        pageName : []
    };

    var pageAction = params.urlLoadParams.action;

    com.post(api.production.queryProductionFunction, {"productionFunction.type": 0}, function (res) {

        var productionFunctionName = res.productionFunctions;

        $.each(productionFunctionName,function (i,v){
            switch (pageAction) {
                case "production":
                    if(v.funtype == 1)
                        productionFunction.pageName.push(v);
                    break;
                case "hardware":
                    if(v.funtype == 2)
                        productionFunction.pageName.push(v);
                    break;
                case "outsource":
                    if(v.funtype == 3)
                        productionFunction.pageName.push(v);
                    break;
                case "productionPlan":
                    if(v.funtype == 4)
                        productionFunction.pageName.push(v);
                    break;
                case "tranpack":
                    if(v.funtype == 5)
                        productionFunction.pageName.push(v);
                    break;
            }
        })

        $.each(productionFunction.pageName, function (i, v) {
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            var $li = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name + " " + (v.comment ? v.comment : "")));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('配置');

            $divBtnWrap.append($btnView).appendTo($h3);

            $h3.appendTo($li.appendTo($ul));

            $btnView.on('click', function () {
                apiConfig(v.key);
            });

            $ul.appendTo(com.focusPage("#resultList"));
        });
    });

    //显示所有api进行配置
    function apiConfig(key) {

        productionFunction.name = key;
        productionFunction.pfids = [];

        com.post(api.right.queryProductionFunctionRightByName, {"productionFunctionRight.name" : productionFunction.name}, function (res) {

            $.each(res.productionFunctionRights, function (i, va) {
                productionFunction.pfids.push(va.productionFunction.pfid);
            });
        }, null, false);

        com.post(api.production.queryProductionFunction, {"productionFunction.type": ""}, function (res) {

            productionFunction.items.apiData.empty();
            productionFunction.items.condArrData.empty();
            productionFunction.items.fieldData.empty();
            productionFunction.items.functionData.empty();
            productionFunction.items.nodeData.empty();

            var productionFunctions = res.productionFunctions;
            var pageData = [];

            $.each(productionFunctions,function (i,v){
                switch (pageAction) {
                    case "production":
                        if(v.funtype == 1)
                            pageData.push(v);
                        break;
                    case "hardware":
                        if(v.funtype == 2)
                            pageData.push(v);
                        break;
                    case "outsource":
                        if(v.funtype == 3)
                            pageData.push(v);
                        break;
                    case "productionPlan":
                        if(v.funtype == 4)
                            pageData.push(v);
                        break;
                    case "tranpack":
                        if(v.funtype == 5)
                           pageData.push(v);
                        break;
                }
                if (v.funtype == 0){
                    pageData.push(v);
                }
            });

            $.each(pageData, function (i, v) {
                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");

                var $label = $('<label></label>');
                var $input = $('<input>').attr({"type": "checkbox", "name": "pfids", "class": "ace"}).val(v.pfid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.name);

                $label.append($input).append($span).appendTo($div);

                if(v.type == 1){
                    $input.attr("type", "radio");
                    $div.appendTo(productionFunction.items.apiData);
                }

                if(v.type == 2){
                    $div.appendTo(productionFunction.items.condArrData);
                }

                if(v.type == 3){
                    $div.appendTo(productionFunction.items.fieldData);
                }

                if(v.type == 4){
                    $div.appendTo(productionFunction.items.functionData);
                }

                if(v.type == 5){
                    $div.appendTo(productionFunction.items.nodeData);
                }

                if(productionFunction.pfids.indexOf(v.pfid)!= -1){
                    $input.attr("checked",true);
                }
            });
        });

        productionFunction.modal.apiModal.modal("show");
    }

    //配置完成确定按钮
    productionFunction.btn.apiBtn.click(function () {
        var $inputs = com.focusPage('input[name="pfids"]:checked');

        var options = {};

        $.each($inputs,function (i, v) {
            options["productionFunctionRight.name"] = productionFunction.name;
            options["pfids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updateProductionFunctionRight, options, function (res) {
            com.showAlert(com.info, "配置成功");
            productionFunction.modal.apiModal.modal("hide");
        })
    });

});