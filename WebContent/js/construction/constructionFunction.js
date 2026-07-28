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
            syncFunctionName: com.focusPage("#syncFunctionName"),
            companyList: com.focusPage("#companyList"),
        },

        name: {},
        cfids: [],
        currentSyncKey: {},
        companys: [],
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
            var $btnSync = $('<a></a>').addClass('btn btn-minier btn-info').html('同步').css('margin-left', '5px');

            $divBtnWrap.append($btnView).append($btnSync).appendTo($h3);
            $h3.appendTo($li.appendTo($ul));

            $btnView.on('click', function () {
                apiConfig(v.name);
            });

            $btnSync.on('click', function () {
                syncConfig(v.name, v.value);
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

    // ==================== 同步功能配置 ====================

    // 同步配置: 打开弹窗并加载公司列表
    function syncConfig(name, displayName) {
        constructionFunction.currentSyncKey = name;
        constructionFunction.items.syncFunctionName.html(displayName || name);
        constructionFunction.items.companyList.html('<div class="text-center"><i class="ace-icon fa fa-spinner fa-spin fa-2x"></i><p>正在加载公司列表...</p></div>');
        constructionFunction.modal.syncModal.modal("show");
        loadCompanyList();
    }

    // 加载公司列表
    function loadCompanyList() {
        com.post(api.system.queryCompany, {}, function (res) {
            constructionFunction.companys = res.companys || [];
            renderCompanyList();
        }, function () {
            constructionFunction.items.companyList.html('<div class="text-center text-danger">加载公司列表失败</div>');
        });
    }

    // 渲染公司列表
    function renderCompanyList() {
        if (!constructionFunction.companys || constructionFunction.companys.length === 0) {
            constructionFunction.items.companyList.html('<div class="text-center text-muted">暂无可选公司</div>');
            return;
        }

        constructionFunction.items.companyList.html("");

        constructionFunction.companys.forEach(function (company) {
            var item = $('<div class="company-item"></div>').appendTo(constructionFunction.items.companyList);
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
    constructionFunction.btn.syncConfirmBtn.click(function () {
        var selectedCompanies = [];
        com.focusPage('.company-checkbox:checked').each(function () {
            selectedCompanies.push($(this).val());
        });

        if (selectedCompanies.length === 0) {
            com.showAlert(com.warning, "请至少选择一个目标公司");
            return;
        }

        performSync(constructionFunction.currentSyncKey, selectedCompanies);
    });

    // 执行同步操作
    function performSync(functionName, companys) {
        var params = {
            "constructionFunctionRight.name": functionName
        };

        $.each(companys, function (i, v) {
            params["companys[" + i + "]"] = v;
        });

        com.post(api.right.syncConstructionFunctionRight, params, function (res) {
            if (res.errorCode === 0) {
                com.showAlert(com.info, "同步成功！");
                constructionFunction.modal.syncModal.modal("hide");
            } else {
                com.showAlert(com.error, "同步失败：" + (res.errorMsg || "未知错误"));
            }
        }, function (res) {
            com.showAlert(com.error, "同步请求失败：" + (res.errorMsg || "网络错误"));
        });
    }

});
