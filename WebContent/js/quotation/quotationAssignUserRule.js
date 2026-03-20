$(function() {

    var config = {
        qaurid: null
    };

    // 初始化 Searcher
    var searcher = new Searcher();

    // 基础配置
    searcher.base(
        "condList",                                   // 条件容器
        "pagenation",                                 // 分页容器
        "resultList",                                 // 结果容器
        api.quotation.pageQuotationAssignUserRule     // API 接口
    );

    // 查询条件
    searcher.condition([
        "assign-user-rule-company",
        "assign-user-rule-status",
        "assign-user-rule-userName"
    ]);

    // 顶部按钮
    searcher.button(function() {
        var $addBtn = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left')
            .attr('id', 'addUserRuleBtn')
            .css('margin', '0px 3px');

        $('<i></i>').addClass('icon-plus bigger-110').appendTo($addBtn);
        $('<span></span>').text('新增').appendTo($addBtn);

        return [$addBtn];
    });

    // 列表行配置
    var lineprops = [{
        field: "qaurid",
        name: "多选",
        type: "checkbox",
        prop: "qaurid"
    }, {
        field: "user",
        name: "预算员",
        prop: "user.currentName",
        clazz: "blue"
    }, {
        field: "company",
        name: "公司",
        prop: "company.name",
        clazz: "grey"
    }, {
        field: "department",
        name: "部门",
        prop: function(v) {
            // 部门ID为NULL表示该公司所有部门
            return v.department ? (v.departmentVO ? v.departmentVO.name : "未知部门") : "所有部门";
        },
        clazz: "grey"
    }, {
        field: "status",
        name: "状态",
        prop: function(v) {
            // 使用 constant 进行枚举转换
            return constant.quotation().quotationAssignUserRule.status.datas[v.status];
        },
        clazz: function(v) {
            if (v.status == 1) return "green";  // 可用
            if (v.status == 2) return "orange"; // 制作中
            return "red";                       // 停止
        }
    }, {
        field: "supportedType",
        name: "支持类型",
        prop: function(v) {
            // 使用 constant 进行枚举转换
            var type = v.supportedType;
            return constant.quotation().quotationAssignUserRule.supportedType.datas[type] || "未设置";
        },
        clazz: "blue"
    }, {
        field: "currentTaskCount",
        name: "当前任务",
        prop: function(v) {
            return v.currentTaskCount || 0;
        },
        clazz: "grey"
    }, {
        field: "lastFinishTime",
        name: "最后完成时间",
        prop: "lastFinishTime",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "grey"
    }];

    // 行按钮
    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {
            editUserRule(v);
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {
            deleteUserRule(v);
            return false;
        }
    }, {
        name: function(v) {
            return v.status == 1 ? "停止" : "启用";
        },
        clazz: function(v) {
            return v.status == 1 ? "btn-warning" : "btn-success";
        },
        handle: function(v) {
            toggleStatus(v);
            return false;
        }
    }];

    // 配置行
    searcher.line(lineprops, linebtns);

    // 渲染列表
    searcher.render();

    // ==================== Modal 表单操作 ====================

    var $modal = com.focusPage('#userRuleModal');
    var $qaurid = com.focusPage('#qaurid');
    var $user = com.focusPage('#user');
    var $company = com.focusPage('#company');
    var $department = com.focusPage('#department');
    var $status = com.focusPage('#status');
    var $saveBtn = com.focusPage('#saveBtn');
    var $supportedType = com.focusPage('input[name="supportedType"]');

    // 初始化下拉框
    function initSelectOptions() {
        // 状态下拉框
        $status.bindData(
            constant.quotation().quotationAssignUserRule.status.datas,
            "key",   // value: 1, 2, 3
            "value"  // text: 可用, 制作中, 停止
        );
    }

    // 初始化公司下拉框
    function initCompanySelect() {
        com.post(api.system.queryCompany, {}, function(res) {
            $company.bindData(res.companys, "cid", "name", false);
        }, null, false);
    }

    // 初始化部门下拉框（公司选择后加载）
    function initDepartmentSelect(companyId) {
        if (!companyId) {
            $department.empty().append('<option value="">全部部门</option>');
            return;
        }

        com.post(api.system.queryDepartmentByCompany, {
            "company.cid": companyId
        }, function(res) {
            $department.bindData(res.departments, "did", "name", true);
        }, null, false);
    }

    // 初始化预算员输入框（autofill）
    function initUserInput() {
        $user.autofill({
            url: api.personel.queryUserByPinyin,
            postData: {
                "user.status": 3  // 仅在职员工
            },
            listPath: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value",
            onSelect: function(item) {
                // 选中用户后，可以自动填充其他信息
                console.log('Selected user:', item);
            }
        });
    }

    // 页面加载时初始化
    initSelectOptions();
    initCompanySelect();
    initUserInput();

    // 监听公司变化，联动部门
    $company.on('change', function() {
        var companyId = $(this).val();
        initDepartmentSelect(companyId);
    });

    // 点击新增按钮
    $(document).on('click', '#addUserRuleBtn', function() {
        resetForm();
        com.focusPage('#modalTitle').text('新增预算员规则');
        $modal.modal('show');
    });

    // 重置表单
    function resetForm() {
        $qaurid.val('');
        $user.val('');
        $user.removeData('uid');  // 清除保存的UID
        $company.val('');
        $department.empty().append('<option value="">全部部门</option>');
        $status.val('1');  // 默认可用
        $supportedType.filter('[value="-1"]').prop('checked', true);  // 默认通用
    }

    // 编辑配置
    function editUserRule(row) {
        // 先重置表单
        resetForm();

        // 填充表单数据
        $qaurid.val(row.qaurid);
        $user.val(row.user.currentName);
        $user.data('uid', row.user.uid);  // 保存UID
        $company.val(row.company.cid);

        // 初始化部门并选中
        initDepartmentSelect(row.company.cid);
        if (row.department) {
            setTimeout(function() {
                $department.val(row.department.did);
            }, 100);
        }

        $status.val(row.status);

        // 设置支持类型选中
        if (row.supportedType !== undefined && row.supportedType !== null) {
            $supportedType.filter('[value="' + row.supportedType + '"]').prop('checked', true);
        } else {
            $supportedType.filter('[value="-1"]').prop('checked', true);  // 默认通用
        }

        com.focusPage('#modalTitle').text('编辑预算员规则');
        $modal.modal('show');
    }

    // 保存配置
    function saveUserRule() {
        // 表单验证
        if (com.validate('userRuleModal')) {
            return false;
        }

        var qaurid = $qaurid.val();
        var isNew = !qaurid;
        var uid = $user.data('uid');

        // 验证是否选择了用户
        if (!uid) {
            com.showAlert(com.warning, '请选择预算员');
            return false;
        }

        var params = {
            "quotationAssignUserRule.qaurid": qaurid,
            "quotationAssignUserRule.user.uid": uid,
            "quotationAssignUserRule.company.cid": $company.val(),
            "quotationAssignUserRule.department.did": $department.val() || null,
            "quotationAssignUserRule.status": parseInt($status.val()),
            "quotationAssignUserRule.supportedType": parseInt($supportedType.filter(':checked').val())
        };

        var apiMethod = isNew
            ? api.quotation.createQuotationAssignUserRule
            : api.quotation.updateQuotationAssignUserRule;

        com.post(apiMethod, params, function(res) {
            com.showAlert(com.info, isNew ? '新增成功' : '更新成功');
            $modal.modal('hide');
            searcher.doSearch(); // 刷新列表
        });
    }

    // 删除配置
    function deleteUserRule(row) {
        com.showConfirm('确认删除该预算员规则吗？', function() {
            com.post(api.quotation.deleteQuotationAssignUserRule, {
                "quotationAssignUserRule.qaurid": row.qaurid
            }, function(res) {
                com.showAlert(com.info, '删除成功');
                searcher.doSearch(); // 刷新列表
            });
        });
    }

    // 快捷切换状态（启用/停止）
    function toggleStatus(row) {
        var newStatus = row.status == 1 ? 3 : 1;  // 1(可用) <-> 3(停止)
        var statusText = newStatus == 1 ? "启用" : "停止";

        com.showConfirm('确认要将该预算员' + statusText + '吗？', function() {
            com.post(api.quotation.updateQuotationAssignUserRuleForStatus, {
                "quotationAssignUserRule.qaurid": row.qaurid,
                "quotationAssignUserRule.status": newStatus
            }, function(res) {
                com.showAlert(com.info, statusText + '成功');
                searcher.doSearch(); // 刷新列表
            });
        });
    }

    // 绑定保存按钮事件
    $saveBtn.on('click', saveUserRule);

})
