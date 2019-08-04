jQuery(function($) {

    var decorationFunction = {
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
        dfids : [],
    };

    com.post(api.decoration.queryDecorationFunction, {"decorationFunction.type": 0}, function (res) {

        $.each(res.decorationFunctions, function (i, v) {
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
        
        decorationFunction.name = key;
        decorationFunction.dfids = [];

        com.post(api.right.queryDecorationFunctionRightByName, {"decorationFunctionRight.name" : decorationFunction.name}, function (res) {
            $.each(res.decorationFunctionRights, function (i, va) {
                decorationFunction.dfids.push(va.decorationFunction.dfid);
            });
        }, null, false);
        
        com.post(api.decoration.queryDecorationFunction, {"decorationFunction.type": ""}, function (res) {
            
            decorationFunction.items.apiData.empty();
            decorationFunction.items.condArrData.empty();
            decorationFunction.items.fieldData.empty();
            decorationFunction.items.functionData.empty();
            decorationFunction.items.nodeData.empty();

            $.each(res.decorationFunctions, function (i, v) {
                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");

                var $label = $('<label></label>');
                var $input = $('<input>').attr({"type": "checkbox", "name": "dfids", "class": "ace"}).val(v.dfid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.name);

                $label.append($input).append($span).appendTo($div);

                if(v.type == 1){
                    $input.attr("type", "radio");
                    $div.appendTo(decorationFunction.items.apiData);
                }

                if(v.type == 2){
                    $div.appendTo(decorationFunction.items.condArrData);
                }

                if(v.type == 3){
                    $div.appendTo(decorationFunction.items.fieldData);
                }

                if(v.type == 4){
                    $div.appendTo(decorationFunction.items.functionData);
                }

                if(v.type == 5){
                    $div.appendTo(decorationFunction.items.nodeData);
                }

                if(decorationFunction.dfids.indexOf(v.dfid)!= -1){
                    $input.attr("checked",true);
                }
            });
        });
        
        decorationFunction.modal.apiModal.modal("show");
    }

    //配置完成确定按钮
    decorationFunction.btn.apiBtn.click(function () {
        var $inputs = com.focusPage('input[name="dfids"]:checked');

        var options = {};

        $.each($inputs,function (i, v) {
            options["decorationFunctionRight.name"] = decorationFunction.name;
            options["dfids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updateDecorationFunctionRight, options, function (res) {
            com.showAlert(com.info, "配置成功");
            decorationFunction.modal.apiModal.modal("hide");
        })
    });

});