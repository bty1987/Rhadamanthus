jQuery(function($) {

    var userFunction = {
        modal: {
            apiModal : com.focusPage("#apiModal", "#user")
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn", "#user")
        },
        items: {
            apiData: com.focusPage("#apiData", "#user"),
            condArrData: com.focusPage("#condArrData", "#user"),
            fieldData: com.focusPage("#fieldData", "#user"),
            functionData: com.focusPage("#functionData", "#user")
        },
        
        name: "",
        ufids : []
    };

    com.post(api.personel.queryUserFunction, {"userFunction.type": 0}, function (res) {

        $.each(res.userFunctions, function (i, v) {
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

        userFunction.name = value.key;
        userFunction.ufids = [];

        com.post(api.right.queryUserFunctionRight, {"userFunctionRight.name" : userFunction.name}, function (res) {
            $.each(res.userFunctionRights, function (i, va) {
                userFunction.ufids.push(va.userFunction.ufid);
            });
        }, null, false);
        
        com.post(api.personel.queryUserFunction, {"userFunction.type": ""}, function (res) {

            userFunction.items.apiData.empty();
            userFunction.items.condArrData.empty();
            userFunction.items.fieldData.empty();
            userFunction.items.functionData.empty();
            var userFunctionArr = res.userFunctions;

            $.each(userFunctionArr.sort(function (x, y) { return x['sort'] - y['sort']}), function (i, v) {

                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                var $label = $('<label></label>');
                var $input = $('<input>').attr({"type": "checkbox", "name": "ufids", "class": "ace"}).val(v.ufid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.name + (v.type ==  0 ? "" : com.checkNull(v.comment, "")));

                $label.append($input).append($span).appendTo($div);

                if(v.type == constant.personel().userFunction.TYPE_API_INT){
                    $input.attr("type", "radio");
                    $div.appendTo(userFunction.items.apiData);
                }

                if(v.type == constant.personel().userFunction.TYPE_CONDITION_INT){
                    $div.appendTo(userFunction.items.condArrData);
                }

                if(v.type == constant.personel().userFunction.TYPE_FIELD_INT){
                    $div.appendTo(userFunction.items.fieldData);
                }

                if(v.type == constant.personel().userFunction.TYPE_FUNCTION_INT){
                    $div.appendTo(userFunction.items.functionData);
                }

                if(userFunction.ufids.indexOf(v.ufid)!= -1){
                    $input.attr("checked",true);
                }
            });
        });

        userFunction.modal.apiModal.modal("show");
    }

    //配置完成确定按钮
    userFunction.btn.apiBtn.click(function () {
        var $inputs = com.focusPage('input[name="ufids"]:checked');

        var options = {};

        $.each($inputs,function (i, v) {
            options["userFunctionRight.name"] = userFunction.name;
            options["ufids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updateUserFunctionRight, options, function (res) {
            com.showAlert(com.info, "配置成功");
            userFunction.modal.apiModal.modal("hide");
        })
    });

});