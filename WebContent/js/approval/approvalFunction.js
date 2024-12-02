jQuery(function($) {

    var approvalFunctionData = {
        modal: {
            apiModal : com.focusPage("#apiModal", "#approvalMoadl")
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn", "#approvalMoadl")
        },
        items: {
            apiData: com.focusPage("#apiData", "#approvalMoadl"),
            condArrData: com.focusPage("#condArrData", "#approvalMoadl"),
            fieldData: com.focusPage("#fieldData", "#approvalMoadl"),
            functionData: com.focusPage("#functionData", "#approvalMoadl"),
            typeData: com.focusPage("#typeData", "#approvalMoadl"),
            statusData: com.focusPage("#statusData", "#approvalMoadl")
        },
        
        name: {},
        cfids : []
    };

    com.post(api.approval.queryApprovalFunction, {"approvalFunction.type": 0}, function (res) {

        $.each(res.approvalFunctions, function (i, v) {
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
        console.log(value);
        approvalFunctionData.name = value.key;  
        approvalFunctionData.cfids = [];
        console.log(value.key);
    
        com.post(api.right.queryApprovalFunctionRight, {"approvalFunctionRight.name" : approvalFunctionData.name}, function (res) {
            $.each(res.approvalFunctionRights, function (i, va) {
            	approvalFunctionData.cfids.push(va.approvalFunction.cfid);//通过 参数获取页面对应的记录ID
            });
        }, null, false);
        
        com.post(api.approval.queryApprovalFunction, {"approvalFunction.type": "","approvalFunction.fieldType":approvalFunctionData.name}, function (res) {

        	approvalFunctionData.items.apiData.empty();
        	approvalFunctionData.items.condArrData.empty();
        	approvalFunctionData.items.fieldData.empty();
        	approvalFunctionData.items.functionData.empty();
        	approvalFunctionData.items.typeData.empty();
        	approvalFunctionData.items.statusData.empty();
            var customerOriginFunctionArr = res.approvalFunctions;

            $.each(customerOriginFunctionArr.sort(function (x, y) { return x['sort'] - y['sort']}), function (i, v) {

                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                var $label = $('<label></label>');
                var $input = $('<input>').attr({"type": "checkbox", "name": "cfids", "class": "ace"}).val(v.cfid);
                var $span = $('<span></span>').addClass('lbl blue').text(v.name + (v.type ==  0 ? "" : com.checkNull(v.comment, "")));

                $label.append($input).append($span).appendTo($div);

                if(v.type == 1){
                    $input.attr("type", "radio");
                    $div.appendTo(approvalFunctionData.items.apiData);
                }

                if(v.type == 2){
                	//console.dir(approvalFunctionData.items.condArrData);
                    $div.appendTo(approvalFunctionData.items.condArrData);
                }

                if(v.type == 3){
                	//console.dir(customerOrigineFunction.items.fieldData);
                    $div.appendTo(approvalFunctionData.items.fieldData);
                }

                if(v.type == 4){
                	//console.dir(customerOrigineFunction.items.functionData);
                    $div.appendTo(approvalFunctionData.items.functionData);
                }

                if(approvalFunctionData.cfids.indexOf(v.cfid)!= -1){
                    $input.attr("checked",true);
                }
            });
        });
        console.log(approvalFunctionData.cfids);
        
        approvalFunctionData.modal.apiModal.modal("show");
    }

    //配置完成确定按钮
    approvalFunctionData.btn.apiBtn.click(function () {
        var $inputs = com.focusPage('input[name="cfids"]:checked');

        var options = {};

        $.each($inputs,function (i, v) {
            options["approvalFunctionRight.name"] = approvalFunctionData.name;
            options["cfids[" + i + "]"] = $(v).val();

        });
        com.post(api.right.updateApprovalFunctionRight, options, function (res) {
            com.showAlert(com.info, "配置成功");
            approvalFunctionData.modal.apiModal.modal("hide");
        })
    });

});