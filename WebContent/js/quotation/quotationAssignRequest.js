$(function() {

    // ==================== 模式检测 ====================
    // 通过框架 params.urlLoadParams 判断是否为预算员自助模式
    var isSelfMode = (params["urlLoadParams"] && params["urlLoadParams"].mode === 'self');

    // ==================== 页面元素声明 ====================
    var config = {
        modals: {
            requestModal: com.focusPage('#requestModal'),
            manualAssignModal: com.focusPage('#manualAssignModal'),
            autoAssignModal: com.focusPage('#autoAssignModal'),
            finishAndAssignModal: com.focusPage('#finishAndAssignModal'),
            replaceModal: com.focusPage('#replaceModal')
        },
        items: {
            qarid: com.focusPage('#qarid'),
            orderId: com.focusPage('#orderId'),
            company: com.focusPage('#company'),
            department: com.focusPage('#department'),
            decorationType: com.focusPage('#decorationType'),
            priority: com.focusPage('#priority'),
            requestUser: com.focusPage('#requestUser'),
            remark: com.focusPage('#remark'),
            // 手动分配相关
            manualAssignOrderId: com.focusPage('#manualAssignOrderId'),
            manualAssignBudgeter: com.focusPage('#manualAssignBudgeter'),
            // 替换预算员相关
            replaceBudgeter: com.focusPage('#replaceBudgeter'),
            // 正向自动分配相关
            autoAssignOrderId: com.focusPage('#autoAssignOrderId'),
            // 完成并分配相关
            finishOrderId: com.focusPage('#finishOrderId')
        },
        plugins: {},
        lists: {},

        data: {
            keyword: null,
            currentRow: null,
            selectedRequestUid: null,
            selectedManualAssignUid: null, // 手动分配选中的预算员UID
            selectedReplaceUid: null // 替换选中的新预算员UID
        }
    };

    // 初始化 Searcher
    var searcher = new Searcher();

    // ==================== 基础配置（按模式切换） ====================

    // API 接口：自助模式用 ByUserId，管理模式用默认
    var baseApi = isSelfMode
        ? api.quotation.pageQuotationAssignRequestByUserId
        : api.quotation.pageQuotationAssignRequest;

    searcher.base("condList", "pagenation", "resultList", baseApi);

    // 查询条件：自助模式去掉公司条件
    var conditions = isSelfMode
        ? ["quotation-assign-request-status", "quotation-assign-request-orderId", "quotation-assign-request-requestTime", "quotation-assign-request-assignTime", "quotation-assign-request-finishTime"]
        : ["quotation-assign-request-company", "quotation-assign-request-status", "quotation-assign-request-orderId", "quotation-assign-request-user", "quotation-assign-request-requestUser", "quotation-assign-request-requestTime", "quotation-assign-request-assignTime", "quotation-assign-request-finishTime"];
    searcher.condition(conditions);

    // 顶部按钮：自助模式无按钮
    var buttons = isSelfMode ? [] : [{
        id: 'addRequestBtn',
        name: '新增',
        clazz: 'btn-yellow',
        icon: 'icon-plus'
    }, {
        id: 'autoAssignBtn',
        name: '正向自动分配',
        clazz: 'btn-info',
        icon: 'icon-magic'
    }, {
        id: 'finishAndAssignBtn',
        name: '交付',
        clazz: 'btn-success',
        icon: 'icon-ok-circle'
    }];
    searcher.button(buttons);

    // ==================== 列表行配置 ====================

    var lineprops = [{
        field: "qarid",
        name: "多选",
        type: "checkbox",
        prop: "qarid",
        show: function() { return !isSelfMode; } // 自助模式不显示多选
    }, {
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue"
    }, {
        field: "company",
        name: "公司",
        prop: function(v) {
            return v.company ? v.company.name : "未知";
        },
        clazz: "grey"
    }, {
        field: "department",
        name: "部门",
        prop: function(v) {
            return v.department ? v.department.name : "所有部门";
        },
        clazz: "grey"
    }, {
        field: "decorationType",
        name: "装修类型",
        prop: function(v) {
            return v.decorationType == 1 ? "半包" : "整装";
        },
        clazz: "red"
    }, {
        field: "priority",
        name: "优先级",
        prop: function(v) {
            var priorityMap = {
                1: "最高",
                3: "高",
                5: "普通",
                7: "低",
                9: "最低"
            };
            return priorityMap[v.priority] || "未知";
        },
        clazz: "red"
    }, {
        field: "status",
        name: "状态",
        prop: function(v) {
            var statusMap = { 1: "待分配", 2: "已分配", 3: "已完成" };
            return statusMap[v.status] || "未知";
        },
        clazz: "red"
    }, {
        field: "uid",
        name: "预算员",
        prop: function(v) {
            if (v.user && v.user.currentName) {
                return v.user.currentName;
            }
            return v.uid ? v.uid : "-";
        },
        clazz: "blue",
        show: function() { return !isSelfMode; } // 自助模式不显示（预算员就是自己）
    }, {
        field: "requestUser",
        name: "请求人",
        prop: function(v) {
            return v.requestUser ? v.requestUser.currentName : "未知";
        },
        clazz: "grey"
    }, {
        field: "requestTime",
        name: "请求时间",
        prop: "requestTime",
        clazz: "green"
    }, {
        field: "assignTime",
        name: "分配时间",
        prop: function(v) {
            return v.assignTime || "-";
        },
        clazz: "green"
    }];

    // 行按钮：自助模式无按钮
    var linebtns = isSelfMode ? [] : [{
        name: "自动分配",
        clazz: "btn-info",
        handle: function(v) {
            autoAssign(v);
            return false;
        },
        show: function(v) {
            return v.status == 1;
        }
    }, {
        name: "手动分配",
        clazz: "btn-purple",
        handle: function(v) {
            openManualAssignModal(v);
            return false;
        },
        show: function(v) {
            return v.status == 1;
        }
    }, {
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {
            editRequest(v);
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {
            deleteRequest(v);
            return false;
        }
    }, {
        name: "取消请求",
        clazz: "btn-warning",
        handle: function(v) {
            cancelRequest(v);
            return false;
        },
        show: function(v) {
            return v.status == 1;
        }
    }, {
        name: "替换",
        clazz: "btn-inverse",
        handle: function(v) {
            openReplaceModal(v);
            return false;
        },
        show: function(v) {
            return v.status == 2;
        }
    }, {
        name: "沟通",
        clazz: "btn-primary",
        handle: function(v) {
            openTalkModal(v.orderId);
            return false;
        }
    }];

    // 渲染列表
    searcher.line("orderId", lineprops, linebtns).render();

    // ==================== 沟通功能（popup4page加载独立页面） ====================

    function openTalkModal(orderId) {
        params.quotationAssignTalk = { orderId: orderId };
        com.popup4page("#layerPopUp4talkAssign", api.index.quotationAssignTalkIndex.url, "分配沟通");
    }

    // ==================== 自助模式：跳过管理功能初始化 ====================
    if (isSelfMode) return;

    // ==================== 以下为管理模式专用逻辑 ====================

    // 初始化Select数据
    config.items.decorationType.bindData(constant.quotation().quotationAssignRequest.decorationType.datas, "key", "value");

    var priorityData = [{
        key: 1,
        value: "最高"
    }, {
        key: 3,
        value: "高"
    }, {
        key: 5,
        value: "普通"
    }, {
        key: 7,
        value: "低"
    }, {
        key: 9,
        value: "最低"
    }];
    config.items.priority.bindData(priorityData, "key", "value");

    // 初始化公司下拉框
    com.post(api.system.queryCompany, {}, function(res) {
        config.items.company.bindData(res.companys, "cid", "name", false);
    }, null, false);

    // 初始化部门下拉框
    function initDepartmentSelect(companyId) {
        if (!companyId) {
            config.items.department.empty().append('<option value="">所有部门</option>');
            return;
        }

        com.post(api.communion.queryDepartment, {
            "department.company.cid": companyId
        }, function(res) {
            config.items.department.bindData(res.deptList, "did", "name", true);
        }, null, false);
    }

    // 初始化请求人输入框（typeahead）
    function initRequestUserInput() {
        com.initTypeahead(
            config.items.requestUser,
            api.personel.queryUserByPinyin,
            "pinyinName",
            { "user.status": 0 },
            "autoFillKeyValue",
            "key",
            "value",
            function(list, key, value) {
                config.data.selectedRequestUid = key;
                return value;
            }
        );
    }

    // 页面加载时初始化
    initRequestUserInput();
    initManualAssignBudgeterInput();
    initReplaceBudgeterInput();

    // 监听公司变化，联动部门
    config.items.company.on('change', function() {
        var companyId = $(this).val();
        initDepartmentSelect(companyId);
    });

    // ==================== 手动分配相关初始化 ====================

    function initManualAssignBudgeterInput() {
        com.initTypeahead(
            config.items.manualAssignBudgeter,
            api.personel.queryUserByPinyin,
            "pinyinName",
            { "user.status": 0 },
            "autoFillKeyValue",
            "key",
            "value",
            function(list, key, value) {
                config.data.selectedManualAssignUid = key;
                return value;
            }
        );
    }

    // ==================== 替换预算员相关初始化 ====================

    function initReplaceBudgeterInput() {
        com.initTypeahead(
            config.items.replaceBudgeter,
            api.personel.queryUserByPinyin,
            "pinyinName",
            { "user.status": 0 },
            "autoFillKeyValue",
            "key",
            "value",
            function(list, key, value) {
                config.data.selectedReplaceUid = key;
                return value;
            }
        );
    }

    // ==================== Modal 操作 ====================

    // 新增按钮点击事件
    com.focusPage('#addRequestBtn', '#pagenation').on('click', function() {
        openModal();
    });

    // 正向自动分配按钮点击事件
    com.focusPage('#autoAssignBtn', '#pagenation').on('click', function() {
        openAutoAssignModal();
    });

    // 完成并分配按钮点击事件
    com.focusPage('#finishAndAssignBtn', '#pagenation').on('click', function() {
        openFinishAndAssignModal();
    });

    // 保存按钮点击事件
    com.focusPage('#saveBtn').on('click', saveRequest);

    // 手动分配确认按钮点击事件
    com.focusPage('#confirmManualAssignBtn').on('click', confirmManualAssign);

    // 替换预算员确认按钮点击事件
    com.focusPage('#confirmReplaceBtn').on('click', confirmReplace);

    // 正向自动分配确认按钮点击事件
    com.focusPage('#confirmAutoAssignBtn').on('click', confirmAutoAssign);

    // 完成并分配确认按钮点击事件
    com.focusPage('#confirmFinishAndAssignBtn').on('click', confirmFinishAndAssign);

    // Modal关闭时清理表单
    config.modals.requestModal.on('hide.bs.modal', function() {
        com.clearValidator();
        com.cleanItems({
            orderId: config.items.orderId,
            company: config.items.company,
            department: config.items.department,
            decorationType: config.items.decorationType,
            priority: config.items.priority,
            requestUser: config.items.requestUser,
            remark: config.items.remark
        });
        com.cleanTypeahead(config.items.requestUser);
        config.data.selectedRequestUid = null;
    });

    // 打开Modal（新增模式）
    function openModal() {
        com.focusPage('#modalTitle').text('新增分配请求');
        config.data.currentRow = null;

        config.items.orderId.val('');
        config.items.company.val('');
        config.items.department.empty().append('<option value="">所有部门</option>');
        config.items.decorationType.val('1');
        config.items.priority.val('5');
        com.cleanTypeahead(config.items.requestUser);
        config.data.selectedRequestUid = null;
        config.items.remark.val('');

        config.modals.requestModal.modal('show');
    }

    // 打开Modal（编辑模式）
    function editRequest(row) {
        config.data.currentRow = row;

        config.items.qarid.val(row.qarid);
        config.items.orderId.val(row.orderId);
        config.items.company.val(row.company.cid);

        initDepartmentSelect(row.company.cid);
        if (row.department && row.department.did) {
            setTimeout(function() {
                config.items.department.val(row.department.did);
            }, 100);
        }

        config.items.decorationType.val(row.decorationType);
        config.items.priority.val(row.priority);

        if (row.requestUser) {
            config.items.requestUser.val(row.requestUser.currentName);
            config.items.requestUser.attr('data-typeahead-key', row.requestUser.uid);
            config.items.requestUser.attr('data-typeahead-value', row.requestUser.currentName);
            config.data.selectedRequestUid = row.requestUser.uid;
        }

        config.items.remark.val(row.remark || '');

        com.focusPage('#modalTitle').text('编辑分配请求');
        config.modals.requestModal.modal('show');
    }

    // 保存请求
    function saveRequest() {
        if (com.validate('requestModal')) {
            return false;
        }

        var isNew = !config.items.qarid.val();

        var params = {
            "quotationAssignRequest.qarid": config.items.qarid.val(),
            "quotationAssignRequest.orderId": config.items.orderId.val(),
            "quotationAssignRequest.company.cid": config.items.company.val(),
            "quotationAssignRequest.department.did": config.items.department.val() ? parseInt(config.items.department.val()) : null,
            "quotationAssignRequest.decorationType": parseInt(config.items.decorationType.val()),
            "quotationAssignRequest.priority": parseInt(config.items.priority.val()),
            "quotationAssignRequest.remark": config.items.remark.val()
        };

        if (config.data.selectedRequestUid) {
            params["quotationAssignRequest.requestUser.uid"] = config.data.selectedRequestUid;
        }

        var apiMethod = isNew ? api.quotation.createQuotationAssignRequest : api.quotation.updateQuotationAssignRequest;

        com.post(apiMethod, params, function(res) {
            config.modals.requestModal.modal('hide');
            searcher.doSearch();
        });
    }

    // 删除请求
    function deleteRequest(row) {
        com.showConfirm('确认删除该分配请求吗？', function() {
            com.post(api.quotation.deleteQuotationAssignRequest, {
                "quotationAssignRequest.qarid": row.qarid
            }, function(res) {
                com.showAlert(com.info, '删除成功');
                searcher.doSearch();
            });
        });
    }

    // 取消请求
    function cancelRequest(row) {
        com.showConfirm('确认取消该分配请求吗？', function() {
            com.post(api.quotation.deleteQuotationAssignRequest, {
                "quotationAssignRequest.qarid": row.qarid
            }, function(res) {
                com.showAlert(com.info, '取消成功');
                searcher.doSearch();
            });
        });
    }

    // ==================== 分配功能 ====================

    // 自动分配
    function autoAssign(row) {
        com.showConfirm('确认自动分配该装修单吗？系统将自动查找可用预算员进行分配。', function() {
            com.post(api.quotation.autoQuotationAssign, {
                "quotationAssign.orderId": row.orderId
            }, function(res) {
                if (res.errorCode == 0) {
                    com.showAlert(com.info, '分配成功！已自动分配给预算员');
                } else {
                    com.showAlert(com.warning, res.errorMsg || '分配失败，请查看分配记录了解详情');
                }
                searcher.doSearch();
            }, function(res) {
                com.showAlert(com.error, res.errorMsg || '分配失败');
            });
        });
    }

    // 打开手动分配Modal
    function openManualAssignModal(row) {
        com.focusPage('#manualAssignOrderIdDisplay').text(row.orderId);
        com.focusPage('#manualAssignOrderIdDisplay').attr('data-order-id', row.orderId);

        var companyName = row.company && row.company.name ? row.company.name : '未知';
        com.focusPage('#manualAssignCompanyDisplay').text(companyName);

        var decorationTypeText = row.decorationType == 1 ? '半包' : '整装';
        com.focusPage('#manualAssignDecorationTypeDisplay').text(decorationTypeText);

        com.cleanTypeahead(config.items.manualAssignBudgeter);
        config.data.selectedManualAssignUid = null;

        config.modals.manualAssignModal.modal('show');
    }

    // 确认手动分配
    function confirmManualAssign() {
        if (com.validate('manualAssignModal')) {
            return false;
        }

        var orderId = com.focusPage('#manualAssignOrderIdDisplay').attr('data-order-id');
        if (!orderId) {
            com.showAlert(com.warning, '装修单号不能为空');
            return false;
        }

        var budgetUid = config.data.selectedManualAssignUid;
        if (!budgetUid) {
            com.showAlert(com.warning, '请选择预算员');
            return false;
        }

        com.post(api.quotation.manualQuotationAssign, {
            "quotationAssign.orderId": orderId,
            "quotationAssign.quoter.userId": budgetUid
        }, function(res) {
            com.showAlert(com.info, '分配成功！');
            config.modals.manualAssignModal.modal('hide');
            searcher.doSearch();
        }, function(res) {
            com.showAlert(com.error, res.errorMsg || '分配失败');
        });
    }

    // ==================== 替换预算员功能 ====================

    // 打开替换Modal
    function openReplaceModal(row) {
        com.focusPage('#replaceOrderIdDisplay').text(row.orderId);
        com.focusPage('#replaceOrderId').val(row.orderId);

        var companyName = row.company && row.company.name ? row.company.name : '未知';
        com.focusPage('#replaceCompanyDisplay').text(companyName);

        var decorationTypeText = row.decorationType == 1 ? '半包' : '整装';
        com.focusPage('#replaceDecorationTypeDisplay').text(decorationTypeText);

        // 显示当前预算员
        var currentBudgeter = '-';
        if (row.user && row.user.currentName) {
            currentBudgeter = row.user.currentName;
        } else if (row.uid) {
            currentBudgeter = row.uid;
        }
        com.focusPage('#replaceCurrentBudgeterDisplay').text(currentBudgeter);

        com.cleanTypeahead(config.items.replaceBudgeter);
        config.data.selectedReplaceUid = null;

        config.modals.replaceModal.modal('show');
    }

    // 确认替换
    function confirmReplace() {
        if (com.validate('replaceModal')) {
            return false;
        }

        var orderId = com.focusPage('#replaceOrderId').val();
        if (!orderId) {
            com.showAlert(com.warning, '装修单号不能为空');
            return false;
        }

        var newUid = config.data.selectedReplaceUid;
        if (!newUid) {
            com.showAlert(com.warning, '请选择新预算员');
            return false;
        }

        com.post(api.quotation.reassignQuotationAssign, {
            "quotationAssign.orderId": orderId,
            "quotationAssign.quoter.userId": newUid
        }, function(res) {
            com.showAlert(com.info, '替换成功！已更新预算员和装修单报价员信息');
            config.modals.replaceModal.modal('hide');
            searcher.doSearch();
        }, function(res) {
            com.showAlert(com.error, res.errorMsg || '替换失败');
        });
    }

    // ==================== 正向自动分配功能 ====================

    function openAutoAssignModal() {
        config.items.autoAssignOrderId.val('');
        config.modals.autoAssignModal.modal('show');
    }

    function confirmAutoAssign() {
        if (com.validate('autoAssignModal')) {
            return false;
        }

        var orderId = config.items.autoAssignOrderId.val();
        if (!orderId || orderId.trim() === '') {
            com.showAlert(com.warning, '请输入装修单号');
            return false;
        }

        com.showLoading('正在自动分配...');

        com.post(api.quotation.autoQuotationAssign, {
            "quotationAssign.orderId": orderId.trim()
        }, function(res) {
            com.hideLoading();
            if (res.errorCode == 0) {
                com.showAlert(com.info, '分配成功！已自动分配给预算员');
            } else {
                com.showAlert(com.warning, res.errorMsg || '分配失败，请查看分配记录了解详情');
            }
            config.modals.autoAssignModal.modal('hide');
            searcher.doSearch();
        }, function(res) {
            com.hideLoading();
            com.showAlert(com.error, res.errorMsg || '分配失败');
        });
    }

    // ==================== 完成并分配功能 ====================

    function openFinishAndAssignModal() {
        config.items.finishOrderId.val('');
        config.modals.finishAndAssignModal.modal('show');
    }

    function confirmFinishAndAssign() {
        if (com.validate('finishAndAssignModal')) {
            return false;
        }

        var orderId = config.items.finishOrderId.val();
        if (!orderId || orderId.trim() === '') {
            com.showAlert(com.warning, '请输入装修单号');
            return false;
        }

        com.showLoading('正在处理...');

        com.post(api.quotation.finishQuotationAssign, {
            "quotationAssign.orderId": orderId.trim()
        }, function(res) {
            com.hideLoading();
            if (res.errorCode == 0) {
                com.showAlert(com.info, '操作成功！预算员最后完成时间已更新，系统已自动分配下一个任务');
            } else {
                com.showAlert(com.warning, res.errorMsg || '操作完成，但无可用任务可分配');
            }
            config.modals.finishAndAssignModal.modal('hide');
            searcher.doSearch();
        }, function(res) {
            com.hideLoading();
            com.showAlert(com.error, res.errorMsg || '操作失败');
        });
    }

})
