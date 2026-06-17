$(function() {

	    var QAUR = constant.quotation().quotationAssignUserRule;
	    var DEPT_TYPE_DESIGN_INT = 2;

	    // ==================== 页面元素声明 ====================
    var config = {
        modals: {
            itemModal: com.focusPage('#itemModal')
        },
        items: {
            qauriid: com.focusPage('#qauriid'),
            qaurid: com.focusPage('#qaurid'),
            company: com.focusPage('#company'),
            department: com.focusPage('#department'),
            supportedType: com.focusPage('input[name="supportedType"]'),
            budgetUser: com.focusPage('#budgetUser'),
            userGroup: com.focusPage('#userGroup'),
            companyGroup: com.focusPage('#companyGroup')
        },
        btns: {
            addBtn: null,
            saveBtn: com.focusPage('#saveBtn')
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
            return QAUR.status.keys[v.userRule.status];
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
            return QAUR.supportedType.keys[type] || "未设置";
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
	        var $group = com.focusPage('#supportedTypeGroup').empty();
	        $.each(QAUR.supportedType.datas, function(i, data) {
	            var $label = $('<label></label>').addClass('radio-inline');
	            $('<input>').attr('type', 'radio').attr('name', 'supportedType').val(data.key).appendTo($label);
	            $label.append(' ' + data.value).appendTo($group);
	        });
	        config.items.supportedType = com.focusPage('input[name="supportedType"]');
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
        com.focusPage('#modalTitle').text('新增规则项目');

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
        config.items.supportedType.filter('[value="' + QAUR.SUPPORTED_TYPE_ALL_INT + '"]').prop('checked', true);

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
            config.items.supportedType.filter('[value="' + QAUR.SUPPORTED_TYPE_ALL_INT + '"]').prop('checked', true);
        }
        com.focusPage('#modalTitle').text('编辑规则项目');

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

    // Modal 关闭时清理残留蒙版（解决 popup4page 内 Bootstrap Modal 蒙版层叠问题）
    config.modals.itemModal.on('hidden.bs.modal', function() {
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open').css('padding-right', '');
    });

    // 绑定保存按钮事件
    config.btns.saveBtn.on('click', saveItem);

})
