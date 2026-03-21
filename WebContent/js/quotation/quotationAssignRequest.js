$(function() {

    // ==================== 页面元素声明 ====================
    var config = {
        modals: {
            requestModal: com.focusPage('#requestModal')
        },
        items: {
            qarid: com.focusPage('#qarid'),
            orderId: com.focusPage('#orderId'),
            company: com.focusPage('#company'),
            department: com.focusPage('#department'),
            decorationType: com.focusPage('#decorationType'),
            priority: com.focusPage('#priority'),
            requestUser: com.focusPage('#requestUser'),
            remark: com.focusPage('#remark')
        },
        btns: {
            addBtn: null, // 动态创建
            saveBtn: com.focusPage('#saveBtn')
        },
        plugins: {},
        lists: {},

        data: {
            keyword: null,
            currentRow: null,
            selectedRequestUid: null
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
    searcher.condition(["assign-request-company", "assign-request-status", "assign-request-orderId"]);

    // 顶部按钮
    searcher.button(function() {

        var $addBtn = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addRequestBtn').css('margin', '0px 3px');

        $('<i></i>').addClass('icon-plus bigger-110').appendTo($addBtn);
        $('<span></span>').text('新增').appendTo($addBtn);

        config.btns.addBtn = $addBtn; // 缓存按钮引用

        return [$addBtn];
    });

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

            // 1-待分配，2-已分配
            return v.status == 1 ? "待分配" : "已分配";
        },
        clazz: "red"  // 类型/状态使用 red
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
            config.items.department.bindData(res.departments, "did", "name", true);
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

    // 监听公司变化，联动部门
    config.items.company.on('change', function() {
        var companyId = $(this).val();
        initDepartmentSelect(companyId);
    });

    // ==================== Modal 操作 ====================

    // 新增按钮点击事件
    com.focusPage('#addRequestBtn', '#pagenation').on('click', function() {

        openModal();
    });

    // 保存按钮点击事件
    config.btns.saveBtn.on('click', saveRequest);

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
        config.items.company.val(row.company);

        // 初始化部门并选中（先加载部门列表，再设置值）
        initDepartmentSelect(row.company);
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

})
