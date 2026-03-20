$(function() {

    // ==================== 页面元素声明 ====================
    var config = {
        modals: {
            configModal: com.focusPage('#configModal')
        },
        items: {
            qacid: com.focusPage('#qacid'),
            company: com.focusPage('#company'),
            department: com.focusPage('#department'),
            enabled: com.focusPage('#enabled'),
            autoAssign: com.focusPage('#autoAssign')
        },
        btns: {
            addBtn: null, // 动态创建
            saveBtn: com.focusPage('#saveBtn')
        },
        plugins: {},
        lists: {},
        
        config: null,
        
        data: {
            keyword: null,
            currentRow: null
        }
    };

    // 初始化 Searcher
    var searcher = new Searcher();

    // 基础配置
    searcher.base("condList", // 条件容器
    "pagenation", // 分页容器
    "resultList", // 结果容器
    api.quotation.pageQuotationAssignConfig // API 接口
    );

    // 查询条件
    searcher.condition(["assign-config-company", "assign-config-enabled"]);

    // 顶部按钮
    searcher.button(function() {

        var $addBtn = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addConfigBtn').css('margin', '0px 3px');

        $('<i></i>').addClass('icon-plus bigger-110').appendTo($addBtn);
        $('<span></span>').text('新增').appendTo($addBtn);

        config.btns.addBtn = $addBtn; // 缓存按钮引用

        return [$addBtn];
    });

    // 列表行配置
    var lineprops = [{
        field: "qacid",
        name: "多选",
        type: "checkbox",
        prop: "qacid"
    }, {
        field: "company",
        name: "公司",
        prop: "company.name",
        clazz: "blue"
    }, {
        field: "department",
        name: "部门",
        prop: function(v) {

            // 部门ID为NULL表示该公司所有部门
            return v.department ? v.department.name : "所有部门";
        },
        clazz: "grey"
    }, {
        field: "enabled",
        name: "状态",
        prop: function(v) {

            // 使用 constant 进行枚举转换
            return constant.quotation().quotationAssignConfig.enabled.keys[v.enabled];
        },
        clazz: function(v) {

            return v.enabled == 1 ? "green" : "red";
        }
    }, {
        field: "autoAssign",
        name: "分配方式",
        prop: function(v) {

            // 使用 constant 进行枚举转换
            return constant.quotation().quotationAssignConfig.autoAssign.keys[v.autoAssign];
        },
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "grey"
    }, {
        field: "updateTime",
        name: "更新时间",
        prop: "updateTime",
        clazz: "grey"
    }];

    // 行按钮
    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            editConfig(v);
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            deleteConfig(v);
            return false;
        }
    }, {
        name: function(v) {

            // 动态显示按钮文本
            return v.enabled == 1 ? "禁用" : "启用";
        },
        clazz: function(v) {

            // 动态显示按钮样式
            return v.enabled == 1 ? "btn-warning" : "btn-success";
        },
        handle: function(v) {

            toggleStatus(v);
            return false;
        }
    }, {
        name: function(v) {

            // 动态显示按钮文本
            return v.autoAssign == 1 ? "切手动" : "切自动";
        },
        clazz: "btn-info",
        handle: function(v) {

            toggleAssign(v);
            return false;
        }
    }];

    // 渲染列表
    searcher.line("company.name", lineprops, linebtns).render();

    // ==================== 初始化Select数据 ====================

    // 初始化状态下拉框（使用constant）
    config.items.enabled.bindData(constant.quotation().quotationAssignConfig.enabled.datas, "key", "value");

    // 初始化分配方式下拉框（使用constant）
    config.items.autoAssign.bindData(constant.quotation().quotationAssignConfig.autoAssign.datas, "key", "value");

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

        com.post(api.system.queryDepartmentByCompany, {
            "company.cid": companyId
        }, function(res) {
            config.items.department.bindData(res.departments, "did", "name", true);
        }, null, false);
    }

    // 监听公司变化，联动部门
    config.items.company.on('change', function() {
        var companyId = $(this).val();
        initDepartmentSelect(companyId);
    });

    // ==================== Modal 操作 ====================

    // 新增按钮点击事件
    com.focusPage('#addConfigBtn', '#pagenation').on('click', function() {

        openModal();
    });

    // 保存按钮点击事件
    config.btns.saveBtn.on('click', saveConfig);

    // Modal关闭时清理表单
    config.modals.configModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems({
            company: config.items.company,
            department: config.items.department,
            enabled: config.items.enabled,
            autoAssign: config.items.autoAssign
        });
    });

    // 打开Modal（新增模式）
    function openModal() {

        com.focusPage('#modalTitle').text('新增预算员分配配置');

        config.data.currentRow = null;

        // 重置表单
        config.items.company.val('');
        config.items.department.empty().append('<option value="">所有部门</option>');
        config.items.enabled.val('1');
        config.items.autoAssign.val('1');

        config.modals.configModal.modal('show');
    }

    // 打开Modal（编辑模式）
    function editConfig(row) {

        config.data.currentRow = row;

        // 设置公司（从对象中提取ID）
        config.items.company.val(row.company.cid);

        // 初始化部门并选中（先加载部门列表，再设置值）
        initDepartmentSelect(row.company.cid);
        if (row.department && row.department.did) {
            setTimeout(function() {
                config.items.department.val(row.department.did);
            }, 100);
        }

        config.items.enabled.val(row.enabled);
        config.items.autoAssign.val(row.autoAssign);

        config.config = row;

        com.focusPage('#modalTitle').text('编辑预算员分配配置');
        config.modals.configModal.modal('show');
    }

    // 保存配置
    function saveConfig() {

        // 表单验证
        if (com.validate('configModal')) {
            return false;
        }

        var params = {
            "quotationAssignConfig.company.cid": config.items.company.val(),
            "quotationAssignConfig.department.did": config.items.department.val() ? parseInt(config.items.department.val()) : null,
            "quotationAssignConfig.enabled": parseInt(config.items.enabled.val()),
            "quotationAssignConfig.autoAssign": parseInt(config.items.autoAssign.val())
        };

        var apiMethod = api.quotation.createQuotationAssignConfig;
        
        if(config.data.currentRow){
            apiMethod = api.quotation.updateQuotationAssignConfig;
            params["quotationAssignConfig.qacid"] = config.data.currentRow.qacid;
        }

        com.post(apiMethod, params, function(res) {

            config.modals.configModal.modal('hide');
            
            searcher.doSearch(); // 刷新列表
        });
    }

    // 删除配置
    function deleteConfig(row) {

        com.showConfirm('确认删除该配置吗？', function() {

            com.post(api.quotation.deleteQuotationAssignConfig, {
                "quotationAssignConfig.qacid": row.qacid
            }, function(res) {

                com.showAlert(com.info, '删除成功');
                searcher.doSearch(); // 刷新列表
            });
        });
    }

    // 快捷切换状态（启用/禁用）
    function toggleStatus(row) {

        var newStatus = row.enabled == 1 ? 0 : 1;
        var statusText = newStatus == 1 ? "启用" : "禁用";

        com.showConfirm('确认要将该配置' + statusText + '吗？', function() {

            com.post(api.quotation.updateQuotationAssignConfigForStatus, {
                "quotationAssignConfig.qacid": row.qacid,
                "quotationAssignConfig.enabled": newStatus
            }, function(res) {

                com.showAlert(com.info, statusText + '成功');
                searcher.doSearch(); // 刷新列表
            });
        });
    }

    // 快捷切换分配方式（手动/自动）
    function toggleAssign(row) {

        var newAssign = row.autoAssign == 1 ? 0 : 1;
        var assignText = newAssign == 1 ? "自动分配" : "手动分配";

        com.showConfirm('确认要将该配置切换为' + assignText + '吗？', function() {

            com.post(api.quotation.updateQuotationAssignConfigForAssign, {
                "quotationAssignConfig.qacid": row.qacid,
                "quotationAssignConfig.autoAssign": newAssign
            }, function(res) {

                com.showAlert(com.info, '切换成功');
                searcher.doSearch(); // 刷新列表
            });
        });
    }

})
