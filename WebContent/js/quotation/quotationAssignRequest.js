$(function() {
	    // ==================== 模式检测 ====================
    // 通过框架 params.urlLoadParams 判断模式
    var urlParams = params["urlLoadParams"] || {};
    var isSelfMode = urlParams.mode === 'self';
    var typeParam = urlParams.type || 'budget';
    var isDesignMode = typeParam === 'design';

    // ==================== 模式标签配置 ====================
    var modeLabels = {
        userLabel: isDesignMode ? '设计师' : '预算员',
        manualAssignTitle: isDesignMode ? '手动分配设计师' : '手动分配预算员',
        replaceTitle: isDesignMode ? '替换设计师' : '替换预算员',
        currentUserLabel: isDesignMode ? '当前设计师' : '当前预算员',
        newUserLabel: isDesignMode ? '新设计师' : '新预算员',
        userSearchPlaceholder: isDesignMode ? '请输入设计师姓名或拼音进行搜索' : '请输入预算员姓名或拼音进行搜索',
        newUserSearchPlaceholder: isDesignMode ? '请输入新设计师姓名或拼音进行搜索' : '请输入新预算员姓名或拼音进行搜索'
    };

    // ==================== 页面元素声明 ====================
    var config = {
        modals: {
            requestModal: com.focusPage('#requestModal'),
            manualAssignModal: com.focusPage('#manualAssignModal'),
            autoAssignModal: com.focusPage('#autoAssignModal'),
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
            autoAssignOrderId: com.focusPage('#autoAssignOrderId')
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

    // 查询条件：自助模式去掉公司条件，设计模式用设计师条件
    var userConditionName = isDesignMode ? "quotation-assign-request-user-designer" : "quotation-assign-request-user";
    var conditions = isSelfMode
        ? ["quotation-assign-request-status", "quotation-assign-request-orderId", "quotation-assign-request-requestTime", "quotation-assign-request-assignTime", "quotation-assign-request-finishTime"]
        : ["quotation-assign-request-company", "quotation-assign-request-status", "quotation-assign-request-orderId", userConditionName, "quotation-assign-request-requestUser", "quotation-assign-request-requestTime", "quotation-assign-request-assignTime", "quotation-assign-request-finishTime"];
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
	            return constant.quotation().quotationAssignRequest.decorationType.keys[v.decorationType] || "未知";
	        },
        clazz: "red"
    }, {
        field: "priority",
        name: "优先级",
	        prop: function(v) {
	            return constant.quotation().quotationAssignRequest.priority.keys[v.priority] || "未知";
	        },
        clazz: "red"
    }, {
        field: "status",
        name: "状态",
	        prop: function(v) {
	            return constant.quotation().quotationAssignRequest.status.keys[v.status] || "未知";
	        },
        clazz: "red"
    }, {
        field: "uid",
        name: modeLabels.userLabel,
        prop: function(v) {
            if (v.user && v.user.currentName) {
                return v.user.currentName;
            }
            return v.uid ? v.uid : "-";
        },
        clazz: "blue",
        show: function() { return !isSelfMode; } // 自助模式不显示（就是自己）
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
            return v.status == constant.quotation().quotationAssignRequest.STATUS_PENDING_INT;
        }
    }, {
        name: "手动分配",
        clazz: "btn-purple",
        handle: function(v) {
            openManualAssignModal(v);
            return false;
        },
        show: function(v) {
            return v.status == constant.quotation().quotationAssignRequest.STATUS_PENDING_INT;
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
            return v.status == constant.quotation().quotationAssignRequest.STATUS_PENDING_INT;
        }
    }, {
        name: "替换",
        clazz: "btn-inverse",
        handle: function(v) {
            openReplaceModal(v);
            return false;
        },
        show: function(v) {
            return v.status == constant.quotation().quotationAssignRequest.STATUS_ASSIGNED_INT;
        }
    }, {
        name: "交付",
        clazz: "btn-success",
        handle: function(v) {
            finishRequest(v);
            return false;
        },
        show: function(v) {
            return v.status == constant.quotation().quotationAssignRequest.STATUS_ASSIGNED_INT;
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

    // ==================== 设计模式动态标签切换 ====================
    if (isDesignMode) {
        // 手动分配弹窗
        com.focusPage('#manualAssignModal .modal-title').text(modeLabels.manualAssignTitle);
        com.focusPage('label[for="manualAssignBudgeter"]').html(modeLabels.userLabel + ' <span class="required">*</span>');
        com.focusPage('#manualAssignModal .help-block').text(modeLabels.userSearchPlaceholder);

        // 替换弹窗
        com.focusPage('#replaceModal .modal-title').text(modeLabels.replaceTitle);
        var replaceLabels = com.focusPage('#replaceModal .modal-body label.control-label');
        if (replaceLabels.length > 3) replaceLabels.eq(3).text(modeLabels.currentUserLabel);
        com.focusPage('label[for="replaceBudgeter"]').html(modeLabels.newUserLabel + ' <span class="required">*</span>');
        com.focusPage('#replaceModal .help-block').text(modeLabels.newUserSearchPlaceholder);

        // 自动分配弹窗 - 替换"预算员"文本
        com.focusPage('#autoAssignModal li').each(function(i, el) {
            var $el = $(el);
            $el.text($el.text().replace(/预算员/g, modeLabels.userLabel));
        });
    }

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

	    config.items.priority.bindData(constant.quotation().quotationAssignRequest.priority.datas, "key", "value");

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

    // 保存按钮点击事件
    com.focusPage('#saveBtn').on('click', saveRequest);

    // 手动分配确认按钮点击事件
    com.focusPage('#confirmManualAssignBtn').on('click', confirmManualAssign);

    // 替换预算员确认按钮点击事件
    com.focusPage('#confirmReplaceBtn').on('click', confirmReplace);

    // 正向自动分配确认按钮点击事件
    com.focusPage('#confirmAutoAssignBtn').on('click', confirmAutoAssign);

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
	    config.items.decorationType.val(constant.quotation().quotationAssignRequest.DECORATION_TYPE_HALF_INT);
	    config.items.priority.val(constant.quotation().quotationAssignRequest.PRIORITY_NORMAL_INT);
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

    // 自动分配：先入队（PENDING），再尝试立即消费
    function autoAssign(row) {
        com.showConfirm('确认自动分配该装修单吗？系统将自动查找可用' + modeLabels.userLabel + '进行分配。', function() {

            // 第一步：入待分配队列（独立事务，写 PENDING 记录）
            com.post(api.quotation.addQuotationAssignRequestForAuto, {
                "quotationAssign.orderId": row.orderId
            }, function(res) {

                // 第二步：尝试自动分配（消费队列中该订单的 PENDING 记录）
                com.post(api.quotation.autoQuotationAssign, {
                    "quotationAssign.orderId": row.orderId
                }, function(res2) {
                    com.showAlert(com.info, '分配成功！已自动分配给' + modeLabels.userLabel);
                    searcher.doSearch();
                }, function(err) {
                    // 无可用预算员(200114)等：已入队，等待反向分配消费
                    com.showAlert(com.warning, (err.errorMsg || '分配失败') + '，已加入待分配队列，' + modeLabels.userLabel + '释放后将自动分配');
                    searcher.doSearch();
                });
            }, function(err) {
                // 入队失败（手动模式 200113、未启用配置 200101、CAD 缺失等）
                com.showAlert(com.error, err.errorMsg || '入队失败，请稍后重试或联系管理员');
            });
        });
    }

    // 打开手动分配Modal
    function openManualAssignModal(row) {
        com.focusPage('#manualAssignOrderIdDisplay').text(row.orderId);
        com.focusPage('#manualAssignOrderIdDisplay').attr('data-order-id', row.orderId);

        var companyName = row.company && row.company.name ? row.company.name : '未知';
        com.focusPage('#manualAssignCompanyDisplay').text(companyName);

	        var decorationTypeText = constant.quotation().quotationAssignRequest.decorationType.keys[row.decorationType] || '未知';
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
            com.showAlert(com.warning, '请选择' + modeLabels.userLabel);
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

	        var decorationTypeText = constant.quotation().quotationAssignRequest.decorationType.keys[row.decorationType] || '未知';
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
            com.showAlert(com.warning, '请选择' + modeLabels.userLabel);
            return false;
        }

        com.post(api.quotation.reassignQuotationAssign, {
            "quotationAssign.orderId": orderId,
            "quotationAssign.quoter.userId": newUid
        }, function(res) {
            com.showAlert(com.info, '替换成功！已更新' + modeLabels.userLabel + '和装修单报价员信息');
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

        // 第一步：入待分配队列（独立事务，写 PENDING 记录）
        com.post(api.quotation.addQuotationAssignRequestForAuto, {
            "quotationAssign.orderId": orderId.trim()
        }, function(res) {

            // 第二步：尝试自动分配（消费队列中该订单的 PENDING 记录）
            com.post(api.quotation.autoQuotationAssign, {
                "quotationAssign.orderId": orderId.trim()
            }, function(res2) {
                com.hideLoading();
                com.showAlert(com.info, '分配成功！已自动分配给' + modeLabels.userLabel);
                config.modals.autoAssignModal.modal('hide');
                searcher.doSearch();
            }, function(err) {
                com.hideLoading();
                com.showAlert(com.warning, (err.errorMsg || '分配失败') + '，已加入待分配队列，' + modeLabels.userLabel + '释放后将自动分配');
                config.modals.autoAssignModal.modal('hide');
                searcher.doSearch();
            });
        }, function(err) {
            com.hideLoading();
            com.showAlert(com.error, err.errorMsg || '入队失败，请稍后重试或联系管理员');
        });
    }

    // ==================== 交付功能（行内，仅已分配状态） ====================

    // 行内交付：直接用当前行的装修单号触发完成并反向自动分配，无需弹窗输入
    function finishRequest(row) {
        com.showConfirm('确认交付装修单 <strong>' + row.orderId + '</strong> 吗？<br/>系统将更新' + modeLabels.userLabel + '完成时间，并自动分配下一个待分配任务。', function() {
            com.showLoading('正在处理...');

            com.post(api.quotation.finishQuotationAssign, {
                "quotationAssign.orderId": row.orderId
            }, function(res) {
                com.hideLoading();
                if (res.errorCode == 0) {
                    com.showAlert(com.info, '交付成功！' + modeLabels.userLabel + '最后完成时间已更新，系统已自动分配下一个任务');
                } else {
                    com.showAlert(com.warning, res.errorMsg || '操作完成，但无可用任务可分配');
                }
                searcher.doSearch();
            }, function(res) {
                com.hideLoading();
                com.showAlert(com.error, res.errorMsg || '操作失败');
            });
        });
    }

})
