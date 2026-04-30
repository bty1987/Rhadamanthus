$(function() {

    // ==================== 页面元素声明 ====================
    var config = {
        modals: {
            userRuleModal: com.focusPage('#userRuleModal')
        },
        items: {
            qaurid: com.focusPage('#qaurid'),
            user: com.focusPage('#user'),
            status: com.focusPage('#status'),
            lastFinishTime: com.focusPage('#lastFinishTime')
        },
        btns: {
            addBtn: null, // 动态创建
            saveBtn: com.focusPage('#saveBtn')
        },
        plugins: {
            userTypeahead: null
        },
        lists: {},
        status: {
            isNew: true
        },
        data: {
            keyword: null,
            currentRow: null,
            selectedUid: null
        }
    };

    // 初始化 Searcher
    var searcher = new Searcher();

    // 基础配置
    searcher.base("condList", // 条件容器
    "pagenation", // 分页容器
    "resultList", // 结果容器
    api.quotation.pageQuotationAssignUserRule // API 接口
    );

    // 查询条件
    searcher.condition(["quotation-assign-user-rule-status", "quotation-assign-user-rule-userName"]);

    // 顶部按钮
    searcher.button(function() {

        var $addBtn = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addUserRuleBtn').css('margin', '0px 3px');

        $('<i></i>').addClass('icon-plus bigger-110').appendTo($addBtn);
        $('<span></span>').text('新增').appendTo($addBtn);

        config.btns.addBtn = $addBtn; // 缓存按钮引用

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
        field: "status",
        name: "状态",
        prop: function(v) {

            // 使用 constant 进行枚举转换
            return constant.quotation().quotationAssignUserRule.status.keys[v.status];
        },
        clazz: "red" // 类型/状态使用 red
    }, {
        field: "currentTaskCount",
        name: "当前任务",
        prop: function(v) {

            return v.currentTaskCount || 0;
        },
        clazz: "blue" // 数值类型使用 blue
    }, {
        field: "lastFinishTime",
        name: "最后完成时间",
        prop: "lastFinishTime",
        clazz: "green" // 时间类型使用 green
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green" // 时间类型使用 green
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
        // 启用按钮：仅在状态不为1（可用）时显示
        name: "启用",
        clazz: "btn-success",
        handle: function(v) {

            enableUserRule(v);
            return false;
        },
        show: function(v) {

            return v.status != 1;
        }
    }, {
        // 禁用按钮：仅在状态为1（可用）时显示
        name: "禁用",
        clazz: "btn-grey",
        handle: function(v) {

            disableUserRule(v);
            return false;
        },
        show: function(v) {

            return v.status == 1;
        }
    }, {
        // 项目按钮：打开规则明细子页面
        name: "项目",
        clazz: "btn-info",
        handle: function(v) {

            params["quotationAssignUserRule"] = {};
            params.quotationAssignUserRule["qaurid"] = v.qaurid;

            com.popup4page("#layerPopUp", api.index.quotationAssignUserRuleItemIndex.url, "规则项目");

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

    // 配置行
    searcher.line("user.currentName", lineprops, linebtns);

    // 渲染列表
    searcher.render();

    // ==================== Modal 表单操作 ====================

    // 初始化下拉框
    function initSelectOptions() {

        // 状态下拉框
        config.items.status.bindData(constant.quotation().quotationAssignUserRule.status.datas, "key", // value: 1, 2, 3
        "value" // text: 可用, 制作中, 停止
        );
    }

    // 初始化预算员输入框（typeahead）
    function initUserInput() {

        com.initTypeahead(config.items.user, // 容器元素
        api.personel.queryUserByPinyin, // 请求地址
        "pinyinName", // 参数名称（后端Action接收的字段名）
        {
            "user.status": 0
        }, // 额外参数：仅在职员工（0=在职）
        "autoFillKeyValue", // 返回结果路径
        "key", // key路径
        "value", // value路径
        function(list, key, value) { // 选中回调
            return value; // 返回显示值
        });
    }

    // 初始化最后完成时间日期选择器
    function initLastFinishTimePicker() {
        com.datetime(config.items.lastFinishTime)
    }

    // 页面加载时初始化
    initSelectOptions();
    initUserInput();
    initLastFinishTimePicker();

    // 点击新增按钮
    $(document).on('click', '#addUserRuleBtn', function() {

        resetForm();
        config.status.isNew = true;
        com.focusPage('#modalTitle').text('新增预算员规则');
        config.modals.userRuleModal.modal('show');
    });

    // 重置表单
    function resetForm() {

        config.items.qaurid.val('');
        // 使用 com.cleanTypeahead 清除 typeahead 的值和属性
        com.cleanTypeahead(config.items.user);
        config.data.selectedUid = null;
        config.items.user.prop('disabled', false); // 启用预算员输入框（新增模式）
        config.items.status.val('1'); // 默认可用
        config.items.lastFinishTime.val(''); // 清空最后完成时间
    }

    // 编辑配置
    function editUserRule(row) {

        // 先重置表单
        resetForm();

        // 保存当前行数据
        config.data.currentRow = row;
        config.status.isNew = false;

        // 填充表单数据
        config.items.qaurid.val(row.qaurid);
        config.items.user.val(row.user.currentName);
        // 使用 typeahead 的 data 属性保存 uid
        config.items.user.attr('data-typeahead-key', row.user.uid);
        config.items.user.attr('data-typeahead-value', row.user.currentName);
        config.data.selectedUid = row.user.uid; // 保留兼容性
        config.items.user.prop('disabled', true); // 禁用预算员输入框（编辑模式不可修改人员）
        config.items.status.val(row.status);

        // 设置最后完成时间
        config.items.lastFinishTime.val(row.lastFinishTime || '');

        com.focusPage('#modalTitle').text('编辑预算员规则');
        config.modals.userRuleModal.modal('show');
    }

    // 保存配置
    function saveUserRule() {

        // 表单验证
        if (com.validate('userRuleModal')) {
            return false;
        }

        var qaurid = config.items.qaurid.val();
        var isNew = !qaurid;

        // 使用 com.typeahead 方法获取选中的 uid
        // 第三个参数 false 表示获取 key（即 uid）
        var uid = com.typeahead(config.items.user, null, false);

        // 验证是否选择了用户
        if (!uid) {
            com.showAlert(com.warning, '请选择预算员');
            return false;
        }

        var params = {
            "quotationAssignUserRule.qaurid": qaurid,
            "quotationAssignUserRule.user.userId": uid,
            "quotationAssignUserRule.status": parseInt(config.items.status.val()),
            "quotationAssignUserRule.lastFinishTime": config.items.lastFinishTime.val() || null
        };

        var apiMethod = isNew ? api.quotation.createQuotationAssignUserRule : api.quotation.updateQuotationAssignUserRule;

        com.post(apiMethod, params, function(res) {

            com.showAlert(com.info, isNew ? '新增成功' : '更新成功');
            config.modals.userRuleModal.modal('hide');
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

    // 快捷启用预算员
    function enableUserRule(row) {

        com.showConfirm('确认要启用该预算员吗？', function() {

            com.post(api.quotation.updateQuotationAssignUserRuleForStatus, {
                "quotationAssignUserRule.qaurid": row.qaurid,
                "quotationAssignUserRule.status": 1
            // 1-可用
            }, function(res) {

                com.showAlert(com.info, '启用成功');
                searcher.doSearch(); // 刷新列表
            });
        });
    }

    // 快捷禁用预算员
    function disableUserRule(row) {

        com.showConfirm('确认要禁用该预算员吗？', function() {

            com.post(api.quotation.updateQuotationAssignUserRuleForStatus, {
                "quotationAssignUserRule.qaurid": row.qaurid,
                "quotationAssignUserRule.status": 3
            // 3-停止
            }, function(res) {

                com.showAlert(com.info, '禁用成功');
                searcher.doSearch(); // 刷新列表
            });
        });
    }

    // 绑定保存按钮事件
    config.btns.saveBtn.on('click', saveUserRule);

    // ==================== 查看任务功能 ====================

    // 状态映射
    var statusMap = { 0: "待分配", 1: "已分配", 2: "已完成", 3: "已取消" };

    // 查看预算员当前负责的所有任务
    function viewUserTasks(row) {

        var userName = row.user ? row.user.currentName : "未知";
        var uid = row.user ? row.user.uid : null;

        if (!uid) {
            com.showAlert(com.warning, '无法获取预算员信息');
            return;
        }

        // 设置弹窗标题
        com.focusPage('#taskUserName').text(userName);

        // 清空列表
        com.focusPage('#taskListBody').empty();
        com.focusPage('#taskEmptyMsg').hide();

        // 构造分页参数（查全部，每页100条，第一页）
        var postData = {
            "paging.page": 1,
            "paging.rows": 100,
            "filters[0].field": "uid",
            "filters[0].data": uid,
            "filters[0].op": "eq"
        };

        com.post(api.quotation.pageQuotationAssignRequest, postData, function(res) {

            var rows = res.paging.data || [];

            if (rows.length == 0) {
                com.focusPage('#taskEmptyMsg').show();
            } else {
                var $body = com.focusPage('#taskListBody');
                $.each(rows, function(i, item) {

                    var statusText = statusMap[item.status] || "未知";
                    var priorityText = { 1: "最高", 3: "高", 5: "普通", 7: "低", 9: "最低" }[item.priority] || "普通";
                    var companyName = item.company ? item.company.name : "-";
                    var decorationType = item.decorationType == 1 ? "半包" : (item.decorationType == 2 ? "整装" : "-");
                    var requestUserName = item.requestUser ? item.requestUser.currentName : "-";

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
            com.focusPage('#taskModal').modal('show');
        });
    }

})
