$(function() {

    // ==================== 页面元素声明 ====================
    var config = {
        modals: {
            requestModal: com.focusPage('#requestModal'),
            manualAssignModal: com.focusPage('#manualAssignModal'),
            autoAssignModal: com.focusPage('#autoAssignModal'),
            finishAndAssignModal: com.focusPage('#finishAndAssignModal')
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
            selectedManualAssignUid: null // 手动分配选中的预算员UID
        }
    };

    // 初始化 Searcher
    var searcher = new Searcher();

    // 基础配置
    searcher.base("condList", // 条件容器
    "pagenation", // 分页容器
    "resultList", // 结果容器
    api.quotation.pageQuotationAssignRequest // API 接口
    );

    // 查询条件
    searcher.condition(["quotation-assign-request-company", "quotation-assign-request-status", "quotation-assign-request-orderId"]);

    // 顶部按钮（使用配置对象方式）
    searcher.button([{
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
    }]);

    // 列表行配置
    var lineprops = [{
        field: "qarid",
        name: "多选",
        type: "checkbox",
        prop: "qarid"
    }, {
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue"
    }, {
        field: "company",
        name: "公司",
        prop: function(v) {

            // 从公司ID获取公司名称
            return v.company ? v.company.name : "未知";
        },
        clazz: "grey"
    }, {
        field: "department",
        name: "部门",
        prop: function(v) {

            // 部门ID为NULL表示该公司所有部门
            return v.department ? v.department.name : "所有部门";
        },
        clazz: "grey"
    }, {
        field: "decorationType",
        name: "装修类型",
        prop: function(v) {

            // 1-半包，2-整装
            return v.decorationType == 1 ? "半包" : "整装";
        },
        clazz: "red"  // 类型/状态使用 red
    }, {
        field: "priority",
        name: "优先级",
        prop: function(v) {

            // 1-最高，3-高，5-普通，7-低，9-最低
            var priorityMap = {
                1: "最高",
                3: "高",
                5: "普通",
                7: "低",
                9: "最低"
            };
            return priorityMap[v.priority] || "未知";
        },
        clazz: "red"  // 类型/状态使用 red
    }, {
        field: "status",
        name: "状态",
        prop: function(v) {

            // 1-待分配，2-已分配，3-已完成
            var statusMap = { 1: "待分配", 2: "已分配", 3: "已完成" };
            return statusMap[v.status] || "未知";
        },
        clazz: "red"  // 类型/状态使用 red
    }, {
        field: "uid",
        name: "预算员",
        prop: function(v) {

            // uid 为预算员用户ID(Integer)，待分配时为 null
            // 优先取 user 对象(currentName)，否则显示 uid 数字
            if (v.user && v.user.currentName) {
                return v.user.currentName;
            }
            return v.uid ? v.uid : "-";
        },
        clazz: "blue"
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
        clazz: "green"  // 时间类型使用 green
    }, {
        field: "assignTime",
        name: "分配时间",
        prop: function(v) {

            return v.assignTime || "-";
        },
        clazz: "green"  // 时间类型使用 green
    }];

    // 行按钮
    var linebtns = [{
        name: "自动分配",
        clazz: "btn-info",
        handle: function(v) {

            autoAssign(v);
            return false;
        },
        show: function(v) {
            // 仅待分配状态可以自动分配
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
            // 仅待分配状态可以手动分配
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
            // 仅待分配状态可以取消
            return v.status == 1;
        }
    }];

    // 渲染列表
    searcher.line("orderId", lineprops, linebtns).render();

    // ==================== 初始化Select数据 ====================

    // 初始化装修类型下拉框（使用constant）
    config.items.decorationType.bindData(constant.quotation().quotationAssignRequest.decorationType.datas, "key", "value");

    // 初始化优先级下拉框（手动定义）
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

    // 初始化公司下拉框（从API加载）
    com.post(api.system.queryCompany, {}, function(res) {

        config.items.company.bindData(res.companys, "cid", "name", false);
    }, null, false);

    // 初始化部门下拉框（公司选择后加载）
    function initDepartmentSelect(companyId) {
        if (!companyId) {
            config.items.department.empty().append('<option value="">所有部门</option>');
            return;
        }

        // 使用正确的接口：api.communion.queryDepartment
        com.post(api.communion.queryDepartment, {
            "department.company.cid": companyId
        }, function(res) {
            config.items.department.bindData(res.deptList, "did", "name", true);
        }, null, false);
    }

    // 初始化请求人输入框（typeahead）
    function initRequestUserInput() {
        com.initTypeahead(
            config.items.requestUser, // 容器元素
            api.personel.queryUserByPinyin, // 请求地址
            "pinyinName", // 参数名称（后端Action接收的字段名）
            { "user.status": 0 }, // 额外参数：仅在职员工（0=在职）
            "autoFillKeyValue", // 返回结果路径
            "key", // key路径
            "value", // value路径
            function(list, key, value) { // 选中回调
                // typeahead 组件会自动设置 data-typeahead-key 和 data-typeahead-value
                // key 就是 uid，value 就是显示名称
                config.data.selectedRequestUid = key;
                return value; // 返回显示值
            }
        );
    }

    // 页面加载时初始化
    initRequestUserInput();
    initManualAssignBudgeterInput(); // 初始化手动分配预算员输入框

    // 监听公司变化，联动部门
    config.items.company.on('change', function() {
        var companyId = $(this).val();
        initDepartmentSelect(companyId);
    });

    // ==================== 手动分配相关初始化 ====================

    // 初始化手动分配预算员输入框（typeahead）
    function initManualAssignBudgeterInput() {
        com.initTypeahead(
            config.items.manualAssignBudgeter, // 容器元素
            api.personel.queryUserByPinyin, // 请求地址
            "pinyinName", // 参数名称
            { "user.status": 0 }, // 额外参数：仅在职员工
            "autoFillKeyValue", // 返回结果路径
            "key", // key路径
            "value", // value路径
            function(list, key, value) { // 选中回调
                config.data.selectedManualAssignUid = key;
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

        // 重置表单
        config.items.orderId.val('');
        config.items.company.val('');
        config.items.department.empty().append('<option value="">所有部门</option>');
        config.items.decorationType.val('1'); // 默认半包
        config.items.priority.val('5'); // 默认普通
        com.cleanTypeahead(config.items.requestUser);
        config.data.selectedRequestUid = null;
        config.items.remark.val('');

        config.modals.requestModal.modal('show');
    }

    // 打开Modal（编辑模式）
    function editRequest(row) {

        config.data.currentRow = row;

        // 填充表单数据
        config.items.qarid.val(row.qarid);
        config.items.orderId.val(row.orderId);

        // 设置公司（从对象中提取ID）
        config.items.company.val(row.company.cid);

        // 初始化部门并选中（先加载部门列表，再设置值）
        initDepartmentSelect(row.company.cid);
        if (row.department && row.department.did) {
            setTimeout(function() {
                config.items.department.val(row.department.did);
            }, 100);
        }

        config.items.decorationType.val(row.decorationType);
        config.items.priority.val(row.priority);

        // 设置请求人
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

        // 表单验证
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

        // 设置请求人（如果选择了）
        if (config.data.selectedRequestUid) {
            params["quotationAssignRequest.requestUser.uid"] = config.data.selectedRequestUid;
        }

        var apiMethod = isNew ? api.quotation.createQuotationAssignRequest : api.quotation.updateQuotationAssignRequest;

        com.post(apiMethod, params, function(res) {

            config.modals.requestModal.modal('hide');

            searcher.doSearch(); // 刷新列表
        });
    }

    // 删除请求
    function deleteRequest(row) {

        com.showConfirm('确认删除该分配请求吗？', function() {

            com.post(api.quotation.deleteQuotationAssignRequest, {
                "quotationAssignRequest.qarid": row.qarid
            }, function(res) {

                com.showAlert(com.info, '删除成功');
                searcher.doSearch(); // 刷新列表
            });
        });
    }

    // 取消请求（仅待分配状态）
    function cancelRequest(row) {

        com.showConfirm('确认取消该分配请求吗？', function() {

            // 取消请求即删除
            com.post(api.quotation.deleteQuotationAssignRequest, {
                "quotationAssignRequest.qarid": row.qarid
            }, function(res) {

                com.showAlert(com.info, '取消成功');
                searcher.doSearch(); // 刷新列表
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

                // 判断响应结果
                if (res.errorCode == 0) {
                    // 成功
                    com.showAlert(com.info, '分配成功！已自动分配给预算员');
                } else {
                    // 失败或入队
                    com.showAlert(com.warning, res.errorMsg || '分配失败，请查看分配记录了解详情');
                }

                searcher.doSearch(); // 刷新列表
            }, function(res) {
                // 异常回调
                com.showAlert(com.error, res.errorMsg || '分配失败');
            });
        });
    }

    // 打开手动分配Modal
    function openManualAssignModal(row) {

        // 填充装修单信息
        com.focusPage('#manualAssignOrderIdDisplay').text(row.orderId);
        com.focusPage('#manualAssignOrderIdDisplay').attr('data-order-id', row.orderId);

        // 显示公司名称
        var companyName = row.company && row.company.name ? row.company.name : '未知';
        com.focusPage('#manualAssignCompanyDisplay').text(companyName);

        // 显示装修类型
        var decorationTypeText = row.decorationType == 1 ? '半包' : '整装';
        com.focusPage('#manualAssignDecorationTypeDisplay').text(decorationTypeText);

        // 清空预算员输入框
        com.cleanTypeahead(config.items.manualAssignBudgeter);
        config.data.selectedManualAssignUid = null;

        // 显示Modal
        config.modals.manualAssignModal.modal('show');
    }

    // 确认手动分配
    function confirmManualAssign() {

        // 表单验证
        if (com.validate('manualAssignModal')) {
            return false;
        }

        // 获取装修单号
        var orderId = com.focusPage('#manualAssignOrderIdDisplay').attr('data-order-id');
        if (!orderId) {
            com.showAlert(com.warning, '装修单号不能为空');
            return false;
        }

        // 获取预算员UID
        var budgetUid = config.data.selectedManualAssignUid;
        if (!budgetUid) {
            com.showAlert(com.warning, '请选择预算员');
            return false;
        }

        // 调用手动分配接口
        com.post(api.quotation.manualQuotationAssign, {
            "quotationAssign.orderId": orderId,
            "quotationAssign.quoter.userId": budgetUid
        }, function(res) {

            com.showAlert(com.info, '分配成功！');
            config.modals.manualAssignModal.modal('hide');
            searcher.doSearch(); // 刷新列表
        }, function(res) {
            // 异常回调
            com.showAlert(com.error, res.errorMsg || '分配失败');
        });
    }

    // ==================== 正向自动分配功能 ====================

    // 打开正向自动分配Modal
    function openAutoAssignModal() {

        // 清空输入框
        config.items.autoAssignOrderId.val('');

        // 显示Modal
        config.modals.autoAssignModal.modal('show');
    }

    // 确认正向自动分配
    function confirmAutoAssign() {

        // 表单验证
        if (com.validate('autoAssignModal')) {
            return false;
        }

        // 获取装修单号
        var orderId = config.items.autoAssignOrderId.val();
        if (!orderId || orderId.trim() === '') {
            com.showAlert(com.warning, '请输入装修单号');
            return false;
        }

        // 显示加载提示
        com.showLoading('正在自动分配...');

        // 调用正向自动分配接口
        com.post(api.quotation.autoQuotationAssign, {
            "quotationAssign.orderId": orderId.trim()
        }, function(res) {

            com.hideLoading();

            // 判断响应结果
            if (res.errorCode == 0) {
                // 成功
                com.showAlert(com.info, '分配成功！已自动分配给预算员');
            } else {
                // 失败或入队
                com.showAlert(com.warning, res.errorMsg || '分配失败，请查看分配记录了解详情');
            }

            config.modals.autoAssignModal.modal('hide');
            searcher.doSearch(); // 刷新列表
        }, function(res) {
            // 异常回调
            com.hideLoading();
            com.showAlert(com.error, res.errorMsg || '分配失败');
        });
    }

    // ==================== 完成并分配功能 ====================

    // 打开完成并分配Modal
    function openFinishAndAssignModal() {

        // 清空输入框
        config.items.finishOrderId.val('');

        // 显示Modal
        config.modals.finishAndAssignModal.modal('show');
    }

    // 确认完成并分配
    function confirmFinishAndAssign() {

        // 表单验证
        if (com.validate('finishAndAssignModal')) {
            return false;
        }

        // 获取装修单号
        var orderId = config.items.finishOrderId.val();
        if (!orderId || orderId.trim() === '') {
            com.showAlert(com.warning, '请输入装修单号');
            return false;
        }

        // 显示加载提示
        com.showLoading('正在处理...');

        // 调用完成并分配接口
        com.post(api.quotation.finishQuotationAssign, {
            "quotationAssign.orderId": orderId.trim()
        }, function(res) {

            com.hideLoading();

            // 判断响应结果
            if (res.errorCode == 0) {
                // 成功
                com.showAlert(com.info, '操作成功！预算员最后完成时间已更新，系统已自动分配下一个任务');
            } else {
                // 失败或无任务可分配
                com.showAlert(com.warning, res.errorMsg || '操作完成，但无可用任务可分配');
            }

            config.modals.finishAndAssignModal.modal('hide');
            searcher.doSearch(); // 刷新列表
        }, function(res) {
            // 异常回调
            com.hideLoading();
            com.showAlert(com.error, res.errorMsg || '操作失败');
        });
    }

})
