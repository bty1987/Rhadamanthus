jQuery(function($) {

    var decorationFunction = {
        modal: {
            apiModal: com.focusPage("#apiModal"),
            syncModal: com.focusPage("#syncModal"),
        },
        btn: {
            apiBtn: com.focusPage("#apiBtn"),
            syncConfirmBtn: com.focusPage("#syncConfirmBtn"),
        },
        items: {
            apiData: com.focusPage("#apiData"),
            condArrData: com.focusPage("#condArrData"),
            fieldData: com.focusPage("#fieldData"),
            functionData: com.focusPage("#functionData"),
            nodeData: com.focusPage("#nodeData"),
            statusData: com.focusPage("#statusData"),
            companyData: com.focusPage("#companyData"),
            syncFunctionName: com.focusPage("#syncFunctionName"),
            companyList: com.focusPage("#companyList"),
        },

        name: {},
        dfids: [],
        currentSyncKey: {},
        companys: [],
    };

    com.post(api.decoration.queryDecorationFunction, {
        "decorationFunction.type": 0
    }, function(res) {

        $.each(res.decorationFunctions, function(i, v) {

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            var $li = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name + " " + (v.comment ? v.comment : "")));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('配置');
            var $btnSync = $('<a></a>').addClass('btn btn-minier btn-info').html('同步').css('margin-left', '5px');

            $divBtnWrap.append($btnView).append($btnSync).appendTo($h3);

            $h3.appendTo($li.appendTo($ul));

            $btnView.on('click', function() {

                apiConfig(v.key);
            });

            $btnSync.on('click', function() {

                syncConfig(v.key, v.name);
            });

            $ul.appendTo(com.focusPage("#resultList"));
        });
    });

    // 同步配置功能
    function syncConfig(key, name) {
        decorationFunction.currentSyncKey = key;
        decorationFunction.items.syncFunctionName.html(name);
        decorationFunction.items.companyList.html('<div class="text-center"><i class="ace-icon fa fa-spinner fa-spin fa-2x"></i><p>正在加载公司列表...</p></div>');

        // 显示同步模态框
        decorationFunction.modal.syncModal.modal("show");

        // 加载公司信息
        loadCompanyList();
    }

    // 加载公司列表
    function loadCompanyList() {
        com.post(api.system.queryCompany, {}, function(res) {
            decorationFunction.companys = res.companys || [];
            renderCompanyList();
        }, function() {
            decorationFunction.items.companyList.html('<div class="text-center text-danger">加载公司列表失败</div>');
        });
    }

    // 渲染公司列表
    function renderCompanyList() {
        if (!decorationFunction.companys || decorationFunction.companys.length === 0) {
            decorationFunction.items.companyList.html('<div class="text-center text-muted">暂无可选公司</div>');
            return;
        }
        
        decorationFunction.items.companyList.html("");

        decorationFunction.companys.forEach(function(company) {
            
            var item = $('<div class="company-item"></div>').appendTo(decorationFunction.items.companyList);
            var label = $('<label class="checkbox-inline"></label>').appendTo(item);
            var input = $('<input type="checkbox" class="ace company-checkbox" value="' + company.cid + '"></input>').appendTo(label);
            var span = $('<span class="lbl">' + company.name + '</span>').appendTo(label);
            
            label.click(function(e){
                
                $(this).find("input").prop("checked", "checked");
                
                e.stopPropagation();
                
                return false;
            });
        });
    }

    // 显示所有api进行配置
    function apiConfig(key) {

        decorationFunction.name = key;
        decorationFunction.dfids = [];

        com.post(api.right.queryDecorationFunctionRightByName, {
            "decorationFunctionRight.name": decorationFunction.name
        }, function(res) {

            $.each(res.decorationFunctionRights, function(i, va) {

                decorationFunction.dfids.push(va.decorationFunction.dfid);
            });
        }, null, false);

        com.post(api.decoration.queryDecorationFunction, {
            "decorationFunction.type": ""
        }, function(res) {

            decorationFunction.items.apiData.empty();
            decorationFunction.items.condArrData.empty();
            decorationFunction.items.fieldData.empty();
            decorationFunction.items.functionData.empty();
            decorationFunction.items.nodeData.empty();
            decorationFunction.items.statusData.empty();
            decorationFunction.items.companyData.empty();
            var decorationFunctionArr = res.decorationFunctions;

            $.each(decorationFunctionArr.sort(function(x, y) {

                return x['sort'] - y['sort'];
            }), function(i, v) {

                var $div = $('<div></div>').addClass('col-sm-4').attr("name", "function");
                var $label = $('<label></label>');
                var $input = $('<input>').attr({
                    "type": "checkbox",
                    "name": "dfids",
                    "class": "ace"
                }).val(v.dfid);

                var $span = $('<span></span>').addClass('lbl blue').text(v.name + (v.type == 1 ? v.comment : ""));

                $label.append($input).append($span).appendTo($div);

                if (v.type == 1) {
                    $input.attr("type", "radio");
                    $div.appendTo(decorationFunction.items.apiData);
                }

                if (v.type == 2) {
                    $div.appendTo(decorationFunction.items.condArrData);
                }

                if (v.type == 3) {
                    $div.appendTo(decorationFunction.items.fieldData);
                }

                if (v.type == 4) {
                    $div.appendTo(decorationFunction.items.functionData);
                }

                if (v.type == 5) {
                    $div.appendTo(decorationFunction.items.nodeData);
                }

                if (v.type == 6) {
                    $div.appendTo(decorationFunction.items.statusData);
                }

                if (v.type == 7) {
                    $input.attr("type", "radio").attr("name", "comDfids");
                    $div.appendTo(decorationFunction.items.companyData);
                }

                if (decorationFunction.dfids.indexOf(v.dfid) != -1) {
                    $input.attr("checked", true);
                }
            });
        });

        decorationFunction.modal.apiModal.modal("show");
    }

    // 配置完成确定按钮
    decorationFunction.btn.apiBtn.click(function() {

        var $inputs = com.focusPage('input[name="dfids"]:checked');
        var $comInput = com.focusPage('input[name="comDfids"]:checked');

        var options = {};

        $.each($inputs, function(i, v) {

            options["decorationFunctionRight.name"] = decorationFunction.name;
            options["dfids[" + i + "]"] = $(v).val();

        });
        options["dfids[" + $inputs.length + "]"] = $comInput.val();

        com.post(api.right.updateDecorationFunctionRight, options, function(res) {

            com.showAlert(com.info, "配置成功");
            decorationFunction.modal.apiModal.modal("hide");
        });
    });

    // 同步确认按钮点击事件
    decorationFunction.btn.syncConfirmBtn.click(function() {
        var selectedCompanies = [];
        com.focusPage('.company-checkbox:checked').each(function() {
            var company = {
                cid: $(this).val(),
                name: $(this).data('name')
            };
            selectedCompanies.push(company);
        });

        if (selectedCompanies.length === 0) {
            com.showAlert(com.warning, "请至少选择一个目标公司");
            return;
        }

        // 调用同步接口
        performSync(decorationFunction.currentSyncKey, selectedCompanies);
    });

    // 执行同步操作
    function performSync(functionName, companys) {
        com.showLoading('正在同步装饰功能配置...');

        // 准备同步参数
        var params = {
            "decorationFunctionRight.name": functionName
        };

        $.each(companys, function(i, v){
            params["companys[" + i + "]"] = v.cid;
        })

        // 调用同步接口
        com.post(api.right.syncDecorationFunctionRight, params, function(res) {
            com.hideLoading();
            if (res.errorCode === 0) {
                com.showAlert(com.info, "同步成功！");
                decorationFunction.modal.syncModal.modal("hide");
            } else {
                com.showAlert(com.error, "同步失败：" + (res.errorMsg || "未知错误"));
            }
        }, function(res) {
            com.hideLoading();
            com.showAlert(com.error, "同步请求失败：" + (res.errorMsg || "网络错误"));
        });
    }

});