jQuery(function($) {

    var customerFunction = {
        modal: {
            apiModal : com.focusPage("#apiModal", "#customerOrigine"),
            syncModal: com.focusPage("#syncModal", "#customerOrigine")
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn", "#customerOrigine"),
            syncConfirmBtn: com.focusPage("#syncConfirmBtn", "#customerOrigine")
        },
        items: {
            apiData: com.focusPage("#apiData", "#customerOrigine"),
            condArrData: com.focusPage("#condArrData", "#customerOrigine"),
            fieldData: com.focusPage("#fieldData", "#customerOrigine"),
            functionData: com.focusPage("#functionData", "#customerOrigine"),
            typeData: com.focusPage("#typeData", "#customerOrigine"),
            statusData: com.focusPage("#statusData", "#customerOrigine"),
            syncFunctionName: com.focusPage("#syncFunctionName", "#customerOrigine"),
            companyList: com.focusPage("#companyList", "#customerOrigine")
        },

        name: {},
        cfids : [],
        currentSyncKey: {},
        companys: []
    };

    com.post(api.customer.queryCustomerFunction, {"customerFunction.type": 0}, function (res) {

        $.each(res.customerFunctions, function (i, v) {
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            var $li = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('配置');
            var $btnSync = $('<a></a>').addClass('btn btn-minier btn-info').html('同步').css('margin-left', '5px');

            $divBtnWrap.append($btnView).append($btnSync).appendTo($h3);

            $h3.appendTo($li.appendTo($ul));

            $btnView.on('click', function () {
                apiConfig(v);
            });

            $btnSync.on('click', function () {
                syncConfig(v.key, v.name);
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

    // ==================== 同步功能配置 ====================

    // 同步配置: 打开弹窗并加载公司列表
    function syncConfig(key, name) {
        customerFunction.currentSyncKey = key;
        customerFunction.items.syncFunctionName.html(name);
        customerFunction.items.companyList.html('<div class="text-center"><i class="ace-icon fa fa-spinner fa-spin fa-2x"></i><p>正在加载公司列表...</p></div>');
        customerFunction.modal.syncModal.modal("show");
        loadCompanyList();
    }

    // 加载公司列表
    function loadCompanyList() {
        com.post(api.system.queryCompany, {}, function (res) {
            customerFunction.companys = res.companys || [];
            renderCompanyList();
        }, function () {
            customerFunction.items.companyList.html('<div class="text-center text-danger">加载公司列表失败</div>');
        });
    }

    // 渲染公司列表
    function renderCompanyList() {
        if (!customerFunction.companys || customerFunction.companys.length === 0) {
            customerFunction.items.companyList.html('<div class="text-center text-muted">暂无可选公司</div>');
            return;
        }

        customerFunction.items.companyList.html("");

        customerFunction.companys.forEach(function (company) {
            var item = $('<div class="company-item"></div>').appendTo(customerFunction.items.companyList);
            var label = $('<label class="checkbox-inline"></label>').appendTo(item);
            var input = $('<input type="checkbox" class="ace company-checkbox" value="' + company.cid + '"></input>').appendTo(label);
            var span = $('<span class="lbl">' + company.name + '</span>').appendTo(label);

            label.click(function (e) {
                $(this).find("input").prop("checked", "checked");
                e.stopPropagation();
                return false;
            });
        });
    }

    // 同步确认按钮点击事件
    customerFunction.btn.syncConfirmBtn.click(function () {
        var selectedCompanies = [];
        com.focusPage('.company-checkbox:checked', "#customerOrigine").each(function () {
            selectedCompanies.push($(this).val());
        });

        if (selectedCompanies.length === 0) {
            com.showAlert(com.warning, "请至少选择一个目标公司");
            return;
        }

        performSync(customerFunction.currentSyncKey, selectedCompanies);
    });

    // 执行同步操作
    function performSync(functionName, companys) {
        var params = {
            "customerFunctionRight.name": functionName
        };

        $.each(companys, function (i, v) {
            params["companys[" + i + "]"] = v;
        });

        com.post(api.right.syncCustomerFunctionRight, params, function (res) {
            if (res.errorCode === 0) {
                com.showAlert(com.info, "同步成功！");
                customerFunction.modal.syncModal.modal("hide");
            } else {
                com.showAlert(com.error, "同步失败：" + (res.errorMsg || "未知错误"));
            }
        }, function (res) {
            com.showAlert(com.error, "同步请求失败：" + (res.errorMsg || "网络错误"));
        });
    }

});