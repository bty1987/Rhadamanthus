$(function() {
    var DEPT_TYPE_DESIGN_INT = 2;

    // ==================== 页面作用域 ====================
    // 本页同时支持两种入口：
    //   1) 菜单直接进入（作为 .flpage.tab-pane.active 加载）
    //   2) 由主页面"项目"按钮弹窗进入（内容被 load 进 #layerPopUp，并非 .flpage.tab-pane）
    // com.focusPage 默认只在 .flpage.tab-pane.active 内查找，弹窗模式下可能取不到本页元素，
    // 这里用页面根节点 #quotationAssignUserRuleItemPage 作为作用域兜底，确保两种模式下都能命中。
    var $pageRoot = $('#quotationAssignUserRuleItemPage');
    var _focusPage = function(selecter, container) {

        var $set = com.focusPage(selecter, container);
        if ($set && $set.length) return $set;

        // 兜底：在页面根节点内查找
        return container ? $pageRoot.find(container).find(selecter) : $pageRoot.find(selecter);
    };

	    // ==================== 页面元素声明 ====================
    var config = {
        modals: {
            itemModal: _focusPage('#itemModal'),
            taskModal: _focusPage('#taskModal')
        },
        items: {
            qauriid: _focusPage('#qauriid'),
            qaurid: _focusPage('#qaurid'),
            company: _focusPage('#company'),
            department: _focusPage('#department'),
            supportedType: _focusPage('input[name="supportedType"]'),
            budgetUser: _focusPage('#budgetUser'),
            userGroup: _focusPage('#userGroup'),
            companyGroup: _focusPage('#companyGroup')
        },
        btns: {
            addBtn: null,
            saveBtn: _focusPage('#saveBtn')
        },
        status: {
            isNew: true
        },
        data: {
            parentQaurid: null, // 从父页面传入的规则ID
            selectedUserId: null, // typeahead 选中的预算员 userId
            isStandalone: false  // 是否独立页面模式
        }
    };

    // 获取父页面传入的规则ID
    if (params.quotationAssignUserRule && params.quotationAssignUserRule.qaurid) {
        config.data.parentQaurid = params.quotationAssignUserRule.qaurid;
    }

    // 判断模式：有 parentQaurid = 子页面模式（从 UserRule 页面打开），无 = 独立页面模式
    config.data.isStandalone = !config.data.parentQaurid;

    // 初始化 Searcher
    var searcher = new Searcher();

    // 基础配置
    searcher.base("condList1", "pagenation1", "resultList1", api.quotation.pageQuotationAssignUserRuleItem);

    // 查询条件：公司 + 支持类型 + 预算员姓名
    searcher.condition([
        "quotation-assign-user-rule-item-company",
        "quotation-assign-user-rule-item-supportedType",
        "quotation-assign-user-rule-item-userName"
    ]);

    // 固定筛选参数：子页面模式只查询当前规则下的明细；独立页面模式不过滤 qaurid
    if (!config.data.isStandalone) {
        searcher.param({
            "quotationAssignUserRuleItem.qaurid": config.data.parentQaurid
        });
    }

    // 顶部按钮
    searcher.button(function() {
        var $addBtn = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addItemBtn').css('margin', '0px 3px');
        $('<I></I>').addClass('icon-plus bigger-110').appendTo($addBtn);
        $('<span></span>').text('新增').appendTo($addBtn);
        config.btns.addBtn = $addBtn;
        return [$addBtn];
    });

    // 列表行配置
    var lineprops = [{
        field: "qauriid",
        name: "多选",
        type: "checkbox",
        prop: "qauriid"
    }, {
        field: "user",
        name: "预算员",
        prop: "user.currentName",
        clazz: "blue"
    }, {
        field: "userRule",
        name: "状态",
        prop: function(v) {
            return constant.quotation().quotationAssignUserRule.status.keys[v.userRule.status];
        },
        clazz: "red"
    }, {
        field: "company",
        name: "公司",
        prop: "company.name",
        clazz: "grey"
    }, {
        field: "department",
        name: "部门",
        prop: function(v) {
            return v.department ? v.department.name : "所有部门";
        },
        clazz: "grey"
    }, {
        field: "supportedType",
        name: "支持类型",
        prop: function(v) {
            var type = v.supportedType;
            return constant.quotation().quotationAssignUserRule.supportedType.keys[type] || "未设置";
        },
        clazz: "red"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }];

    // 行按钮
    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {
            editItem(v);
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {
            deleteItem(v);
            return false;
        }
    }, {
        // 查看任务按钮：弹窗显示该预算员负责的所有 request
        name: "查看任务",
        clazz: "btn-purple",
        handle: function(v) {

            viewUserTasks(v);
            return false;
        }
    }];

    // 配置行（按公司名称排序）
    searcher.line("company.name", lineprops, linebtns);

    // 渲染列表
    searcher.render();

    // ==================== Modal 表单操作 ====================

	    // 初始化公司下拉框
	    function initCompanySelect() {
	        com.post(api.system.queryCompany, {}, function(res) {
	            config.items.company.bindData(res.companys, "cid", "name", false);
	        }, null, false);
	    }

	    // 初始化支持类型单选框
	    function initSupportedTypeRadios() {
	        var $group = _focusPage('#supportedTypeGroup').empty();
	        $.each(constant.quotation().quotationAssignUserRule.supportedType.datas, function(i, data) {
	            var $label = $('<label></label>').addClass('radio-inline');
	            $('<input>').attr('type', 'radio').attr('name', 'supportedType').val(data.key).appendTo($label);
	            $label.append(' ' + data.value).appendTo($group);
	        });
	        config.items.supportedType = _focusPage('input[name="supportedType"]');
	    }

	    // 初始化部门下拉框（固定为设计部类型，dept.type.dtid=2）
    function initDepartmentSelect(companyId) {
        if (!companyId) {
            config.items.department.empty().append('<option value="">全部部门</option>');
            return;
        }
        com.post(api.communion.queryDepartment, {
            "department.company.cid": companyId,
            "dept.type.dtid": DEPT_TYPE_DESIGN_INT
        }, function(res) {
            if (res.deptList && res.deptList.length > 0) {
                config.items.department.bindData(res.deptList, "did", "name", true);
            } else {
                config.items.department.empty().append('<option value="">无设计部数据</option>');
            }
        }, null, false);
    }

    // 初始化预算员输入框（typeahead，仅独立页面模式使用）
    function initBudgetUserInput() {
        com.initTypeahead(config.items.budgetUser,
            api.personel.queryUserByPinyin,
            "pinyinName",
            {
                "user.status": 0
            },
            "autoFillKeyValue",
            "key",
            "value",
            function(list, key, value) {
                return value;
            });
    }

	    // 页面加载时初始化
	    initCompanySelect();
	    initSupportedTypeRadios();

    // 独立页面模式初始化
    if (config.data.isStandalone) {
        initBudgetUserInput();
    }

    // 监听公司变化，联动部门
    config.items.company.on('change', function() {
        initDepartmentSelect($(this).val());
    });

    // 点击新增按钮
    $(document).on('click', '#addItemBtn', function() {
        resetForm();
        config.status.isNew = true;
        _focusPage('#modalTitle').text('新增规则项目');

        // 独立页面模式：显示预算员输入，隐藏公司选择
        if (config.data.isStandalone) {
            config.items.userGroup.show();
            config.items.companyGroup.hide();
            // 公司使用当前操作公司，并级联加载部门
            config.items.company.val(params.company.cid);
            initDepartmentSelect(params.company.cid);
        } else {
            config.items.userGroup.hide();
            config.items.companyGroup.show();
        }

        config.modals.itemModal.modal('show');
    });

    // 重置表单
    function resetForm() {
        config.items.qauriid.val('');
        config.items.qaurid.val(config.data.parentQaurid);
        config.items.company.val('');
        config.items.department.empty().append('<option value="">全部部门</option>');
        config.items.supportedType.filter('[value="' + constant.quotation().quotationAssignUserRule.SUPPORTED_TYPE_ALL_INT + '"]').prop('checked', true);

        // 独立页面模式额外清理
        if (config.data.isStandalone) {
            com.cleanTypeahead(config.items.budgetUser);
            config.data.selectedUserId = null;
        }
    }

    // 编辑
    function editItem(row) {
        resetForm();
        config.status.isNew = false;
        config.items.qauriid.val(row.qauriid);
        config.items.company.val(row.company.cid);
        initDepartmentSelect(row.company.cid);
        if (row.department) {
            setTimeout(function() {
                config.items.department.val(row.department.did);
            }, 100);
        }
        if (row.supportedType !== undefined && row.supportedType !== null) {
            config.items.supportedType.filter('[value="' + row.supportedType + '"]').prop('checked', true);
        } else {
            config.items.supportedType.filter('[value="' + constant.quotation().quotationAssignUserRule.SUPPORTED_TYPE_ALL_INT + '"]').prop('checked', true);
        }
        _focusPage('#modalTitle').text('编辑规则项目');

        // 编辑模式下：隐藏预算员选择（已有的 Item 不需要改预算员），显示公司（只读）
        if (config.data.isStandalone) {
            config.items.userGroup.hide();
            config.items.companyGroup.show();
        } else {
            config.items.userGroup.hide();
            config.items.companyGroup.show();
        }

        config.modals.itemModal.modal('show');
    }

    // 保存
    function saveItem() {
        if (com.validate('itemModal')) {
            return false;
        }

        var qauriid = config.items.qauriid.val();
        var isNew = !qauriid;

        // 独立页面模式 + 新增：使用 createQuotationAssignUserRuleItemWithRule 接口
        if (config.data.isStandalone && isNew) {

            // 使用 com.typeahead 获取选中的 userId
            var userId = com.typeahead(config.items.budgetUser, null, false);
            if (!userId) {
                com.showAlert(com.warning, '请选择预算员');
                return false;
            }

            var data = {
                "quotationAssignUserRuleItem.user.userId": userId,
                "quotationAssignUserRuleItem.company.cid": params.company.cid,
                "quotationAssignUserRuleItem.department.did": config.items.department.val() || null,
                "quotationAssignUserRuleItem.supportedType": parseInt(config.items.supportedType.filter(':checked').val())
            };

            com.post(api.quotation.createQuotationAssignUserRuleItemWithRule, data, function(res) {
                config.modals.itemModal.modal('hide');
                com.showAlert(com.info, '新增成功');
                searcher.doSearch();
            });
            return;
        }

        // 子页面模式 或 编辑模式：使用原有接口
        var data = {
            "quotationAssignUserRuleItem.qauriid": qauriid,
            "quotationAssignUserRuleItem.userRule.qaurid": config.data.parentQaurid,
            "quotationAssignUserRuleItem.company.cid": config.items.company.val(),
            "quotationAssignUserRuleItem.department.did": config.items.department.val() || null,
            "quotationAssignUserRuleItem.supportedType": parseInt(config.items.supportedType.filter(':checked').val())
        };

        var apiMethod = isNew ? api.quotation.createQuotationAssignUserRuleItem : api.quotation.updateQuotationAssignUserRuleItem;

        com.post(apiMethod, data, function(res) {
            config.modals.itemModal.modal('hide');
            com.showAlert(com.info, isNew ? '新增成功' : '更新成功');
            searcher.doSearch();
        });
    }

    // 删除
    function deleteItem(row) {
        com.showConfirm('确认删除该规则项目吗？', function() {
            com.post(api.quotation.deleteQuotationAssignUserRuleItem, {
                "quotationAssignUserRuleItem.qauriid": row.qauriid
            }, function(res) {
                com.showAlert(com.info, '删除成功');
                searcher.doSearch();
            });
        });
    }

    // ==================== 查看任务功能 ====================

    // 查看预算员当前负责的所有任务（已分配且未完成，与主页面"查看任务"口径一致）
    function viewUserTasks(row) {

        var userName = row.user ? row.user.currentName : "未知";
        var uid = row.user ? row.user.uid : null;

        if (!uid) {
            com.showAlert(com.warning, '无法获取预算员信息');
            return;
        }

        // 设置弹窗标题
        _focusPage('#taskUserName').text(userName);

        // 清空列表
        _focusPage('#taskListBody').empty();
        _focusPage('#taskEmptyMsg').hide();

        // 构造分页参数（查全部，每页100条，第一页）
        // 只查已分配且未完成任务(status=2)：与 currentTaskCount 统计口径一致
        // company=0 表示不过滤公司（跨公司查看）
        var postData = {
            "paging.page": 1,
            "paging.rows": 100,
            "company": 0,
            "filters[0].field": "uid",
            "filters[0].data": uid,
            "filters[0].op": "eq",
            "filters[1].field": "status",
            "filters[1].data": String(constant.quotation().quotationAssignRequest.STATUS_ASSIGNED_INT),
            "filters[1].op": "eq"
        };

        com.post(api.quotation.pageQuotationAssignRequest, postData, function(res) {

            var rows = res.paging.data || [];

            if (rows.length == 0) {
                _focusPage('#taskEmptyMsg').show();
            } else {
                var $body = _focusPage('#taskListBody');
                $.each(rows, function(i, item) {

                    var statusText = constant.quotation().quotationAssignRequest.status.keys[item.status] || "未知";
                    var priorityText = constant.quotation().quotationAssignRequest.priority.keys[item.priority] || "普通";
                    var companyName = item.company ? item.company.name : "-";
                    var decorationType = constant.quotation().quotationAssignRequest.decorationType.keys[item.decorationType] || "-";
                    var requestUserName = item.requestUser && item.requestUser.currentName ? item.requestUser.currentName : "-";

                    var $tr = $('<tr></tr>');
                    $('<td></td>').text(item.orderId || '-').appendTo($tr);
                    $('<td></td>').text(companyName).appendTo($tr);
                    $('<td></td>').text(decorationType).appendTo($tr);
                    $('<td></td>').text(statusText).appendTo($tr);
                    $('<td></td>').text(priorityText).appendTo($tr);
                    $('<td></td>').text(requestUserName).appendTo($tr);
                    $('<td></td>').text(item.assignTime || '-').appendTo($tr);

                    $tr.appendTo($body);
                });
            }

            // 显示弹窗
            config.modals.taskModal.modal('show');
        });
    }

    // 弹窗（popup4page / layui-layer）内嵌 Bootstrap Modal 会叠加蒙版：
    // layui 已自带一层蒙版，Bootstrap 再追加 .modal-backdrop，反复开关会导致蒙版层层叠加、页面变黑。
    // 这里在每次 show 前清掉残留的 Bootstrap 蒙版，并在 hidden 时只处理本 modal 自身产生的蒙版，
    // 不动 layui 的蒙版，避免误删导致弹窗底层穿透。
    // itemModal 与 taskModal 共用同一套清理逻辑。
    $.each([config.modals.itemModal, config.modals.taskModal], function(i, $modal) {

        $modal.on('show.bs.modal', function() {

            // 清掉上一次残留的 Bootstrap 蒙版（仅 .in 状态的为当前活动，其余皆为残留）
            $('body > .modal-backdrop').not('.in').remove();
        });

        $modal.on('hidden.bs.modal', function() {

            // Bootstrap 关闭后通常会自行移除当前 .modal-backdrop，这里只兜底清理可能残留的副本，
            // 且仅在没有其它可见 Bootstrap modal 时再恢复 body 状态。
            if ($('.modal:visible').length === 0) {
                $('body > .modal-backdrop').remove();
                $('body').removeClass('modal-open').css('padding-right', '');
            }
        });
    });

    // 绑定保存按钮事件
    config.btns.saveBtn.on('click', saveItem);

})
