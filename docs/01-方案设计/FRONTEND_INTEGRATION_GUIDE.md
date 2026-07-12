# 报价单预算员自动分配功能 - 前端集成指南

> 版本: 1.0
> 最后更新: 2026-03-13

---

## 目录

1. [概述](#概述)
2. [API 接口清单](#api-接口清单)
3. [页面路由配置](#页面路由配置)
4. [前端开发指南](#前端开发指南)
5. [完整示例代码](#完整示例代码)
6. [测试步骤](#测试步骤)

---

## 概述

本指南提供了报价单预算员自动分配功能的前端集成说明。该功能包含 **36 个 API 接口**，分为 4 个主要模块：

- **核心分配接口** (5 个): 自动分配、手动分配、重新分配、完成报价、启用检查
- **预算员规则管理** (12 个): CRUD 操作、状态管理、类型配置
- **待分配队列管理** (8 个): 分页查询、优先级调整、取消分配
- **预算配置管理** (11 个): 配置查询、保存、启用/禁用功能

### 前置条件

确保已在 `WebContent/js/api/quotation.js` 中添加了所有 API 定义（已在之前实现中完成）。

---

## API 接口清单

### 1. 核心分配接口 (api.quotationAssign)

| 接口方法 | 功能说明 | 请求参数 | 返回数据 |
|---------|---------|---------|---------|
| `autoAssignBudgetUser` | 自动分配预算员 | `orderId`, `companyId`, `decorationType` | `success`, `budgetUid`, `message` |
| `manualAssignBudgetUser` | 手动分配预算员 | `orderId`, `companyId`, `decorationType`, `budgetUid` | `success`, `message` |
| `reassignBudgetUser` | 重新分配预算员 | `orderId`, `newBudgetUid` | `success`, `message` |
| `finishQuotation` | 完成报价(触发反向自动分配) | `orderId`, `companyId`, `department` | `success`, `message`, `nextOrderId` |
| `isQuotationAssignEnabled` | 检查是否启用预算分配功能 | `company`, `department` | `enabled` |

### 2. 预算员规则管理接口

| 接口方法 | 功能说明 | 请求参数 | 返回数据 |
|---------|---------|---------|---------|
| `pageBudgetUserRule` | 分页查询预算员规则 | 分页参数 + 查询条件 | `budgetUserRules`, `page` |
| `getBudgetUserRule` | 根据ID查询预算员规则 | `burid` | `budgetUserRule` |
| `saveBudgetUserRule` | 保存预算员规则 | `budgetUserRule` 对象 | `success`, `message` |
| `deleteBudgetUserRule` | 删除预算员规则 | `burid` | `success`, `message` |
| `enableBudgetUser` | 启用预算员 | `burid` | `success`, `message` |
| `disableBudgetUser` | 禁用预算员 | `burid` | `success`, `message` |
| `pageAvailableBudgetUsers` | 查询可用预算员列表 | `company`, `department`, 分页参数 | `budgetUsers`, `page` |
| `getBudgetUserStatistics` | 获取预算员统计信息 | `burid` | `statistics` |
| `assignBudgetUserTypes` | 分配预算员支持的类型 | `burid`, `types[]` | `success`, `message` |
| `getBudgetUserTypes` | 查询预算员支持的类型 | `burid` | `types` |
| `batchImportBudgetUsers` | 批量导入预算员 | `budgetUsers[]` | `success`, `message`, `importedCount` |
| `getBudgetUserWorkload` | 查询预算员工作负载 | `company`, `department` | `workloads` |

### 3. 待分配队列管理接口

| 接口方法 | 功能说明 | 请求参数 | 返回数据 |
|---------|---------|---------|---------|
| `pageAssignRequest` | 分页查询待分配队列 | 分页参数 + 查询条件 | `requests`, `page` |
| `getAssignRequest` | 根据ID查询分配请求 | `barid` | `request` |
| `updateAssignRequestPriority` | 更新分配请求优先级 | `barid`, `priority` | `success`, `message` |
| `cancelAssignRequest` | 取消分配请求 | `barid` | `success`, `message` |
| `manualProcessPendingRequest` | 手动处理待处理请求 | `barid`, `budgetUid` | `success`, `message` |
| `batchCancelAssignRequests` | 批量取消分配请求 | `barids[]` | `success`, `message` |
| `getAssignRequestStatistics` | 获取分配请求统计信息 | `company`, `department` | `statistics` |
| `clearCompletedRequests` | 清除已完成请求 | `company`, `department`, `days` | `success`, `message` |

### 4. 预算配置管理接口

| 接口方法 | 功能说明 | 请求参数 | 返回数据 |
|---------|---------|---------|---------|
| `getQuotationConfig` | 查询预算配置 | `company`, `department` | `quotationConfig` |
| `getQuotationConfigsByCompany` | 根据公司查询所有配置 | `company` | `quotationConfigs` |
| `saveQuotationConfig` | 保存预算配置 | `quotationConfig` 对象 | `success`, `message` |
| `updateQuotationConfig` | 更新预算配置 | `quotationConfig` 对象 | `success`, `message` |
| `deleteQuotationConfig` | 删除预算配置 | `qcid` | `success`, `message` |
| `enableQuotationAssign` | 启用预算分配功能 | `company`, `department` | `success`, `message` |
| `disableQuotationAssign` | 禁用预算分配功能 | `company`, `department` | `success`, `message` |
| `enableAutoAssign` | 启用自动分配模式 | `company`, `department` | `success`, `message` |
| `disableAutoAssign` | 禁用自动分配模式 | `company`, `department` | `success`, `message` |

---

## 页面路由配置

### 1. 已添加的路由 (在 `api.index` 中)

```javascript
// WebContent/js/api/quotation.js

$.extend(api.index, {
    // 预算员规则管理页面
    quotationAssignUserRuleIndex: {
        url: "/views/quotation/quotationAssignUserRule.html"
    },

    // 待分配队列管理页面
    quotationAssignRequestIndex: {
        url: "/views/quotation/quotationAssignRequest.html"
    },

    // 预算配置管理页面
    quotationAssignConfigIndex: {
        url: "/views/quotation/quotationAssignConfig.html"
    }
});
```

### 2. 在系统菜单中添加入口

在系统管理菜单配置中添加以下菜单项（通过后端数据库配置）：

```sql
-- 示例 SQL（需要在系统菜单管理表中配置）
INSERT INTO system_module (mid, name, url, icon, parent_id)
VALUES
('quotationAssignUserRule', '预算员规则管理', '/views/quotation/quotationAssignUserRule.html', 'icon-user', NULL),
('quotationAssignRequest', '待分配队列管理', '/views/quotation/quotationAssignRequest.html', 'icon-list', NULL),
('quotationAssignConfig', '预算配置管理', '/views/quotation/quotationAssignConfig.html', 'icon-cog', NULL);
```

---

## 前端开发指南

### 1. 核心分配功能调用

#### 1.1 自动分配预算员

```javascript
// 场景：设计师发起预算时自动分配预算员
function initiateBudget(orderId, companyId, decorationType) {
    com.post(api.quotationAssign.autoAssignBudgetUser, {
        "orderId": orderId,
        "companyId": companyId,
        "decorationType": decorationType  // 1=半包, 2=整装
    }, function(res) {
        if (res.success) {
            com.showAlert(com.info, '预算员分配成功: ' + res.budgetUid);
            // 刷新页面或更新UI
            refreshBudgetInfo(orderId);
        } else {
            com.showAlert(com.warning, res.message);
        }
    }, function(err) {
        com.showAlert(com.error, '分配失败: ' + (err.errorMsg || '网络错误'));
    });
}
```

#### 1.2 手动分配预算员

```javascript
// 场景：管理员手动指定预算员
function manualAssignBudgetUser(orderId, budgetUid) {
    com.post(api.quotationAssign.manualAssignBudgetUser, {
        "orderId": orderId,
        "companyId": params.userInfo.company.cid,
        "decorationType": getDecorationType(orderId),
        "budgetUid": budgetUid
    }, function(res) {
        if (res.success) {
            com.showAlert(com.info, '手动分配成功');
            com.closePopup();
            refreshList();
        } else {
            com.showAlert(com.error, res.message);
        }
    });
}
```

#### 1.3 完成报价触发反向分配

```javascript
// 场景：预算员完成报价后，自动从队列中获取下一个任务
function completeQuotation(orderId) {
    com.post(api.quotationAssign.finishQuotation, {
        "orderId": orderId,
        "companyId": params.userInfo.company.cid,
        "department": params.userInfo.user.department
    }, function(res) {
        if (res.success) {
            var msg = '报价已完成';
            if (res.nextOrderId) {
                msg += '，已自动分配新任务: ' + res.nextOrderId;
            }
            com.showAlert(com.info, msg);
            refreshWorkload();
        } else {
            com.showAlert(com.error, res.message);
        }
    });
}
```

### 2. 预算员规则管理

#### 2.1 页面结构示例

```html
<!-- WebContent/views/quotation/quotationAssignUserRule.html -->
<div class="page-content">
    <!-- 工具栏 -->
    <div class="row">
        <div class="col-xs-12">
            <button id="addBtn" class="btn btn-sm btn-success">
                <i class="icon-plus"></i> 新增预算员
            </button>
            <button id="batchImportBtn" class="btn btn-sm btn-info">
                <i class="icon-upload"></i> 批量导入
            </button>
            <button id="refreshBtn" class="btn btn-sm btn-primary">
                <i class="icon-refresh"></i> 刷新
            </button>
        </div>
    </div>

    <!-- 查询条件 -->
    <div class="row search-row">
        <div class="col-xs-12">
            <div class="form-inline">
                <label>状态:</label>
                <select id="statusSelect">
                    <option value="">全部</option>
                    <option value="1">可用</option>
                    <option value="2">忙碌</option>
                    <option value="3">已停用</option>
                </select>

                <label>姓名:</label>
                <input type="text" id="userName" placeholder="请输入姓名">

                <button id="searchBtn" class="btn btn-sm btn-primary">
                    <i class="icon-search"></i> 查询
                </button>
            </div>
        </div>
    </div>

    <!-- 数据表格 -->
    <div class="row">
        <div class="col-xs-12">
            <table id="dataTable" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll"></th>
                        <th>工号</th>
                        <th>姓名</th>
                        <th>部门</th>
                        <th>状态</th>
                        <th>当前任务数</th>
                        <th>支持类型</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="dataBody"></tbody>
            </table>
        </div>
    </div>

    <!-- 分页 -->
    <div class="row">
        <div class="col-xs-12">
            <div id="pagination"></div>
        </div>
    </div>
</div>

<!-- 编辑模态框 -->
<div class="modal fade" id="editModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
                <h4 class="modal-title" id="modalTitle">编辑预算员</h4>
            </div>
            <div class="modal-body">
                <form id="editForm" class="form-horizontal">
                    <input type="hidden" id="burid">

                    <div class="form-group">
                        <label class="col-sm-3 control-label">用户<span class="required">*</span></label>
                        <div class="col-sm-9">
                            <select id="userId" class="form-control chosen-select" required>
                                <!-- 动态加载用户列表 -->
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">最大任务数</label>
                        <div class="col-sm-9">
                            <input type="number" id="maxTasks" class="form-control" value="5" min="1">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">支持类型<span class="required">*</span></label>
                        <div class="col-sm-9">
                            <label>
                                <input type="checkbox" name="supportType" value="1"> 半包
                            </label>
                            <label>
                                <input type="checkbox" name="supportType" value="2"> 整装
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" id="saveBtn">保存</button>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    $.loadScript(['js/quotation/quotationAssignUserRule.js']);
</script>
```

#### 2.2 JavaScript 实现示例

```javascript
// WebContent/js/quotation/quotationAssignUserRule.js

jQuery(function($) {

    // 初始化分页
    var page = {
        pageNo: 1,
        pageSize: 20,
        total: 0
    };

    // 加载列表
    function loadList() {
        com.post(api.quotationAssign.pageBudgetUserRule, {
            "budgetUserRule.company": params.userInfo.company.cid,
            "budgetUserRule.status": $('#statusSelect').val(),
            "budgetUserRule.userName": $('#userName').val(),
            "page.pageNo": page.pageNo,
            "page.pageSize": page.pageSize
        }, function(res) {
            renderList(res.budgetUserRules || []);
            page.total = res.page ? res.page.total : 0;
            renderPagination();
        });
    }

    // 渲染列表
    function renderList(list) {
        var html = '';

        if (list.length === 0) {
            html = '<tr><td colspan="8" class="text-center">暂无数据</td></tr>';
        } else {
            $.each(list, function(i, item) {
                var statusMap = {
                    1: '<span class="label label-success">可用</span>',
                    2: '<span class="label label-warning">忙碌</span>',
                    3: '<span class="label label-default">已停用</span>'
                };

                html += '<tr>';
                html += '<td><input type="checkbox" class="row-checkbox" data-id="' + item.burid + '"></td>';
                html += '<td>' + (item.userNo || '-') + '</td>';
                html += '<td>' + (item.userName || '-') + '</td>';
                html += '<td>' + (item.departmentName || '-') + '</td>';
                html += '<td>' + (statusMap[item.status] || '-') + '</td>';
                html += '<td>' + (item.currentTaskCount || 0) + ' / ' + (item.maxTasks || 5) + '</td>';
                html += '<td>' + (item.supportedTypes || '-') + '</td>';
                html += '<td>';
                html += '  <button class="btn btn-xs btn-info edit-btn" data-id="' + item.burid + '">编辑</button> ';
                html += '  <button class="btn btn-xs btn-warning disable-btn" data-id="' + item.burid + '">停用</button> ';
                html += '  <button class="btn btn-xs btn-danger delete-btn" data-id="' + item.burid + '">删除</button>';
                html += '</td>';
                html += '</tr>';
            });
        }

        com.focusPage('#dataBody').html(html);
    }

    // 渲染分页
    function renderPagination() {
        var totalPages = Math.ceil(page.total / page.pageSize);
        var html = '';

        if (totalPages > 0) {
            html += '<div class="pagination-info">';
            html += '共 ' + page.total + ' 条记录，当前第 ' + page.pageNo + '/' + totalPages + ' 页';
            html += '</div>';

            html += '<ul class="pagination">';
            html += '<li class="' + (page.pageNo === 1 ? 'disabled' : '') + '">';
            html += '<a href="#" data-page="' + (page.pageNo - 1) + '">&laquo; 上一页</a>';
            html += '</li>';

            for (var i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= page.pageNo - 2 && i <= page.pageNo + 2)) {
                    html += '<li class="' + (i === page.pageNo ? 'active' : '') + '">';
                    html += '<a href="#" data-page="' + i + '">' + i + '</a>';
                    html += '</li>';
                } else if (i === page.pageNo - 3 || i === page.pageNo + 3) {
                    html += '<li class="disabled"><a href="#">...</a></li>';
                }
            }

            html += '<li class="' + (page.pageNo === totalPages ? 'disabled' : '') + '">';
            html += '<a href="#" data-page="' + (page.pageNo + 1) + '">下一页 &raquo;</a>';
            html += '</li>';
            html += '</ul>';
        }

        com.focusPage('#pagination').html(html);
    }

    // 加载用户列表
    function loadUserOptions() {
        com.post(api.personel.queryUserForOption, {
            "user.company": params.userInfo.company.cid,
            "user.status": 1
        }, function(res) {
            var html = '<option value="">请选择用户</option>';
            $.each(res.users || [], function(i, user) {
                html += '<option value="' + user.uid + '">' + user.currentName + ' (工号:' + user.userNo + ')</option>';
            });
            $('#userId').html(html);
            $('#userId').chosen({ allow_single_deselect: true });
        });
    }

    // 打开编辑对话框
    function openEditModal(burid) {
        $('#editForm')[0].reset();
        $('#burid').val('');

        if (burid) {
            $('#modalTitle').text('编辑预算员');

            // 查询详情
            com.post(api.quotationAssign.getBudgetUserRule, {
                "burid": burid
            }, function(res) {
                var rule = res.budgetUserRule;
                $('#burid').val(rule.burid);
                $('#userId').val(rule.userId).trigger('chosen:updated');
                $('#maxTasks').val(rule.maxTasks || 5);

                // 加载支持类型
                com.post(api.quotationAssign.getBudgetUserTypes, {
                    "burid": burid
                }, function(typeRes) {
                    $('input[name="supportType"]').each(function() {
                        $(this).prop('checked', $.inArray(parseInt($(this).val()), typeRes.types || []) !== -1);
                    });
                });
            });
        } else {
            $('#modalTitle').text('新增预算员');
        }

        $('#editModal').modal('show');
    }

    // 保存
    function save() {
        if (!com.validateForm($('#editForm'))) {
            return false;
        }

        var burid = $('#burid').val();
        var userId = $('#userId').val();

        if (!userId) {
            com.showAlert(com.warning, '请选择用户');
            return false;
        }

        // 收集支持类型
        var types = [];
        $('input[name="supportType"]:checked').each(function() {
            types.push(parseInt($(this).val()));
        });

        if (types.length === 0) {
            com.showAlert(com.warning, '请至少选择一种支持类型');
            return false;
        }

        var params = {
            "budgetUserRule.burid": burid || null,
            "budgetUserRule.userId": userId,
            "budgetUserRule.company": params.userInfo.company.cid,
            "budgetUserRule.department": params.userInfo.user.department,
            "budgetUserRule.maxTasks": parseInt($('#maxTasks').val()) || 5,
            "budgetUserRule.status": burid ? undefined : 1  // 新增时默认可用
        };

        com.post(api.quotationAssign.saveBudgetUserRule, params, function(res) {
            if (res.success) {
                com.showAlert(com.info, '保存成功');

                // 保存支持类型
                var newBurid = burid || res.burid;
                com.post(api.quotationAssign.assignBudgetUserTypes, {
                    "burid": newBurid,
                    "types": types
                }, function() {
                    $('#editModal').modal('hide');
                    loadList();
                });
            } else {
                com.showAlert(com.error, res.message);
            }
        });
    }

    // 删除
    function deleteRule(burid) {
        com.showConfirm('确认删除该预算员规则？', function() {
            com.post(api.quotationAssign.deleteBudgetUserRule, {
                "burid": burid
            }, function(res) {
                if (res.success) {
                    com.showAlert(com.info, '删除成功');
                    loadList();
                } else {
                    com.showAlert(com.error, res.message);
                }
            });
        });
    }

    // 启用/停用
    function toggleStatus(burid, enabled) {
        var apiMethod = enabled ? api.quotationAssign.enableBudgetUser : api.quotationAssign.disableBudgetUser;

        com.post(apiMethod, {
            "burid": burid
        }, function(res) {
            if (res.success) {
                com.showAlert(com.info, enabled ? '已启用' : '已停用');
                loadList();
            } else {
                com.showAlert(com.error, res.message);
            }
        });
    }

    // 事件绑定
    com.focusPage('#searchBtn').on('click', function() {
        page.pageNo = 1;
        loadList();
    });

    com.focusPage('#addBtn').on('click', function() {
        openEditModal(null);
    });

    com.focusPage('#refreshBtn').on('click', function() {
        loadList();
    });

    com.focusPage('#dataBody').on('click', '.edit-btn', function() {
        openEditModal($(this).data('id'));
    });

    com.focusPage('#dataBody').on('click', '.delete-btn', function() {
        deleteRule($(this).data('id'));
    });

    com.focusPage('#dataBody').on('click', '.disable-btn', function() {
        toggleStatus($(this).data('id'), false);
    });

    com.focusPage('#saveBtn').on('click', save);

    com.focusPage('#pagination').on('click', 'a[data-page]', function() {
        var targetPage = parseInt($(this).data('page'));
        if (targetPage > 0 && targetPage <= Math.ceil(page.total / page.pageSize)) {
            page.pageNo = targetPage;
            loadList();
        }
        return false;
    });

    // 初始化
    loadUserOptions();
    loadList();
});
```

### 3. 在装饰订单页面中集成"启动预算"按钮

在装饰订单详情页面 (`decorationPicture.html` 或相关页面) 中添加"启动预算"按钮：

```javascript
// 在 decorationPicture.js 或相关 JS 文件中添加

// 添加"启动预算"按钮
function addInitiateBudgetButton() {
    var $toolbar = com.focusPage('#pagenationas');

    var $btn = $('<a class="btn btn-minier btn-purple pull-left" id="initiateBudget" style="margin: 0px 3px;">')
        .html('<i class="icon-dollar bigger-110"></i><span>启动预算</span>');

    $toolbar.append($btn);
}

// 启动预算按钮点击事件
com.focusPage('#initiateBudget').on('click', function() {
    // 获取当前选中的订单ID
    var orderId = getCurrentOrderId();  // 需要实现获取当前订单ID的方法

    if (!orderId) {
        com.showAlert(com.warning, '请先选择订单');
        return false;
    }

    // 检查是否启用预算分配功能
    com.post(api.quotationAssign.isQuotationAssignEnabled, {
        "company": params.userInfo.company.cid,
        "department": params.userInfo.user.department
    }, function(res) {
        if (!res.enabled) {
            com.showAlert(com.warning, '预算分配功能未启用，请联系管理员');
            return false;
        }

        // 获取装修类型
        var decorationType = getDecorationType(orderId);  // 1=半包, 2=整装

        // 调用自动分配接口
        com.post(api.quotationAssign.autoAssignBudgetUser, {
            "orderId": orderId,
            "companyId": params.userInfo.company.cid,
            "decorationType": decorationType
        }, function(assignRes) {
            if (assignRes.success) {
                com.showAlert(com.info, '预算员分配成功！预算员: ' + assignRes.budgetUserName);
                // 刷新页面显示预算员信息
                refreshBudgetInfo(orderId);
            } else {
                com.showAlert(com.error, assignRes.message);
            }
        });
    });
});

// 获取当前订单ID（示例实现，需要根据实际页面调整）
function getCurrentOrderId() {
    // 从页面元素或全局变量中获取
    // 这里仅作示例，实际实现需要根据具体页面逻辑
    var $selectedRow = com.focusPage('#resultListas .selected');
    if ($selectedRow.length > 0) {
        return $selectedRow.data('orderid');
    }
    return null;
}

// 获取装修类型（示例实现）
function getDecorationType(orderId) {
    // 从订单数据中获取装修类型
    // 1 = 半包，2 = 整装
    // 这里需要根据实际业务逻辑获取
    return 2;  // 默认返回整装
}

// 刷新预算员信息
function refreshBudgetInfo(orderId) {
    // 重新加载订单数据，更新UI显示预算员信息
    // 实际实现需要根据具体页面逻辑
    com.post(api.decoration.queryDecorationByOrderId, {
        "decoration.orderId": orderId
    }, function(res) {
        // 更新UI显示预算员信息
        var budgetUserName = res.decoration.budgetUserName || '-';
        // 更新页面元素...
    });
}
```

---

## 完整示例代码

### 示例 1: 待分配队列管理页面

**HTML 文件**: `WebContent/views/quotation/quotationAssignRequest.html`

```html
<div class="page-content">
    <!-- 统计卡片 -->
    <div class="row">
        <div class="col-xs-12">
            <div class="alert alert-info">
                <i class="icon-info-sign"></i>
                <strong>队列统计：</strong>
                待处理 <span id="pendingCount" class="badge">0</span> |
                处理中 <span id="processingCount" class="badge">0</span> |
                今日已分配 <span id="todayAssignedCount" class="badge">0</span>
            </div>
        </div>
    </div>

    <!-- 工具栏 -->
    <div class="row">
        <div class="col-xs-12">
            <button id="refreshBtn" class="btn btn-sm btn-primary">
                <i class="icon-refresh"></i> 刷新
            </button>
            <button id="batchProcessBtn" class="btn btn-sm btn-success">
                <i class="icon-check"></i> 批量处理
            </button>
            <button id="batchCancelBtn" class="btn btn-sm btn-danger">
                <i class="icon-remove"></i> 批量取消
            </button>
            <button id="clearCompletedBtn" class="btn btn-sm btn-default">
                <i class="icon-trash"></i> 清除已完成(7天前)
            </button>
        </div>
    </div>

    <!-- 查询条件 -->
    <div class="row search-row">
        <div class="col-xs-12">
            <div class="form-inline">
                <label>状态:</label>
                <select id="statusSelect">
                    <option value="">全部</option>
                    <option value="1">待处理</option>
                    <option value="2">处理中</option>
                    <option value="3">已完成</option>
                    <option value="4">已取消</option>
                </select>

                <label>优先级:</label>
                <select id="prioritySelect">
                    <option value="">全部</option>
                    <option value="1">最高</option>
                    <option value="2">高</option>
                    <option value="3">普通</option>
                    <option value="4">低</option>
                </select>

                <label>订单编号:</label>
                <input type="text" id="orderId" placeholder="请输入订单编号">

                <button id="searchBtn" class="btn btn-sm btn-primary">
                    <i class="icon-search"></i> 查询
                </button>
            </div>
        </div>
    </div>

    <!-- 数据表格 -->
    <div class="row">
        <div class="col-xs-12">
            <table id="dataTable" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll"></th>
                        <th>订单编号</th>
                        <th>客户姓名</th>
                        <th>装修类型</th>
                        <th>优先级</th>
                        <th>状态</th>
                        <th>请求时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="dataBody"></tbody>
            </table>
        </div>
    </div>

    <!-- 分页 -->
    <div class="row">
        <div class="col-xs-12">
            <div id="pagination"></div>
        </div>
    </div>
</div>

<!-- 手动处理对话框 -->
<div class="modal fade" id="processModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
                <h4 class="modal-title">手动分配预算员</h4>
            </div>
            <div class="modal-body">
                <form id="processForm" class="form-horizontal">
                    <input type="hidden" id="processBarid">
                    <input type="hidden" id="processOrderId">

                    <div class="form-group">
                        <label class="col-sm-3 control-label">订单编号</label>
                        <div class="col-sm-9">
                            <p class="form-control-static" id="displayOrderId"></p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">预算员<span class="required">*</span></label>
                        <div class="col-sm-9">
                            <select id="budgetUserId" class="form-control chosen-select" required>
                                <!-- 动态加载 -->
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" id="confirmProcessBtn">确认分配</button>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    $.loadScript(['js/quotation/quotationAssignRequest.js']);
</script>
```

**JavaScript 文件**: `WebContent/js/quotation/quotationAssignRequest.js`

```javascript
jQuery(function($) {

    var page = {
        pageNo: 1,
        pageSize: 20,
        total: 0
    };

    // 加载统计信息
    function loadStatistics() {
        com.post(api.quotationAssign.getAssignRequestStatistics, {
            "company": params.userInfo.company.cid,
            "department": params.userInfo.user.department
        }, function(res) {
            var stats = res.statistics || {};
            com.focusPage('#pendingCount').text(stats.pendingCount || 0);
            com.focusPage('#processingCount').text(stats.processingCount || 0);
            com.focusPage('#todayAssignedCount').text(stats.todayAssignedCount || 0);
        });
    }

    // 加载列表
    function loadList() {
        com.post(api.quotationAssign.pageAssignRequest, {
            "assignRequest.company": params.userInfo.company.cid,
            "assignRequest.department": params.userInfo.user.department,
            "assignRequest.status": $('#statusSelect').val(),
            "assignRequest.priority": $('#prioritySelect').val(),
            "assignRequest.orderId": $('#orderId').val(),
            "page.pageNo": page.pageNo,
            "page.pageSize": page.pageSize
        }, function(res) {
            renderList(res.requests || []);
            page.total = res.page ? res.page.total : 0;
            renderPagination();
            loadStatistics();
        });
    }

    // 渲染列表
    function renderList(list) {
        var html = '';

        if (list.length === 0) {
            html = '<tr><td colspan="8" class="text-center">暂无数据</td></tr>';
        } else {
            $.each(list, function(i, item) {
                var statusMap = {
                    1: '<span class="label label-warning">待处理</span>',
                    2: '<span class="label label-info">处理中</span>',
                    3: '<span class="label label-success">已完成</span>',
                    4: '<span class="label label-default">已取消</span>'
                };

                var priorityMap = {
                    1: '<span class="badge badge-red">最高</span>',
                    2: '<span class="badge badge-orange">高</span>',
                    3: '<span class="badge badge-grey">普通</span>',
                    4: '<span class="badge badge-light">低</span>'
                };

                var typeMap = { 1: '半包', 2: '整装' };

                html += '<tr>';
                html += '<td><input type="checkbox" class="row-checkbox" data-id="' + item.barid + '"></td>';
                html += '<td>' + item.orderId + '</td>';
                html += '<td>' + (item.customerName || '-') + '</td>';
                html += '<td>' + (typeMap[item.decorationType] || '-') + '</td>';
                html += '<td>' + (priorityMap[item.priority] || '-') + '</td>';
                html += '<td>' + (statusMap[item.status] || '-') + '</td>';
                html += '<td>' + com.formatDate(item.requestTime, 'yyyy-MM-dd HH:mm') + '</td>';
                html += '<td>';
                html += '  <button class="btn btn-xs btn-primary process-btn" ';
                html += '    data-id="' + item.barid + '" ';
                html += '    data-order-id="' + item.orderId + '" ';
                html += '    data-status="' + item.status + '">手动分配</button> ';
                html += '  <button class="btn btn-xs btn-info priority-btn" data-id="' + item.barid + '">调整优先级</button> ';
                html += '  <button class="btn btn-xs btn-danger cancel-btn" data-id="' + item.barid + '">取消</button>';
                html += '</td>';
                html += '</tr>';
            });
        }

        com.focusPage('#dataBody').html(html);
    }

    // 渲染分页
    function renderPagination() {
        // ... 与 budgetUserRule.js 中的实现相同 ...
    }

    // 加载可用预算员
    function loadAvailableBudgetUsers() {
        com.post(api.quotationAssign.pageAvailableBudgetUsers, {
            "company": params.userInfo.company.cid,
            "department": params.userInfo.user.department,
            "page.pageNo": 1,
            "page.pageSize": 1000
        }, function(res) {
            var html = '<option value="">请选择预算员</option>';
            $.each(res.budgetUsers || [], function(i, user) {
                html += '<option value="' + user.budgetUid + '">';
                html += user.userName + ' (当前任务: ' + user.currentTaskCount + ')';
                html += '</option>';
            });
            $('#budgetUserId').html(html);
            $('#budgetUserId').chosen({ allow_single_deselect: true });
        });
    }

    // 打开手动分配对话框
    function openProcessModal(barid, orderId) {
        $('#processBarid').val(barid);
        $('#processOrderId').val(orderId);
        $('#displayOrderId').text(orderId);
        $('#budgetUserId').val('').trigger('chosen:updated');

        loadAvailableBudgetUsers();
        $('#processModal').modal('show');
    }

    // 手动处理
    function manualProcess() {
        var barid = $('#processBarid').val();
        var budgetUid = $('#budgetUserId').val();

        if (!budgetUid) {
            com.showAlert(com.warning, '请选择预算员');
            return false;
        }

        com.post(api.quotationAssign.manualProcessPendingRequest, {
            "barid": barid,
            "budgetUid": budgetUid
        }, function(res) {
            if (res.success) {
                com.showAlert(com.info, '分配成功');
                $('#processModal').modal('hide');
                loadList();
            } else {
                com.showAlert(com.error, res.message);
            }
        });
    }

    // 取消请求
    function cancelRequest(barid) {
        com.showConfirm('确认取消该分配请求？', function() {
            com.post(api.quotationAssign.cancelAssignRequest, {
                "barid": barid
            }, function(res) {
                if (res.success) {
                    com.showAlert(com.info, '已取消');
                    loadList();
                } else {
                    com.showAlert(com.error, res.message);
                }
            });
        });
    }

    // 调整优先级
    function updatePriority(barid) {
        var priorities = {
            1: '最高',
            2: '高',
            3: '普通',
            4: '低'
        };

        var options = '';
        $.each(priorities, function(key, value) {
            options += '<option value="' + key + '">' + value + '</option>';
        });

        com.showConfirm('选择优先级:<br><select id="prioritySelect" class="form-control">' + options + '</select>', function() {
            var priority = parseInt($('#prioritySelect').val());
            com.post(api.quotationAssign.updateAssignRequestPriority, {
                "barid": barid,
                "priority": priority
            }, function(res) {
                if (res.success) {
                    com.showAlert(com.info, '优先级已调整');
                    loadList();
                } else {
                    com.showAlert(com.error, res.message);
                }
            });
        });
    }

    // 事件绑定
    com.focusPage('#searchBtn').on('click', function() {
        page.pageNo = 1;
        loadList();
    });

    com.focusPage('#refreshBtn').on('click', function() {
        loadList();
    });

    com.focusPage('#dataBody').on('click', '.process-btn', function() {
        var $btn = $(this);
        if ($btn.data('status') != 1) {
            com.showAlert(com.warning, '只能处理待状态的请求');
            return false;
        }
        openProcessModal($btn.data('id'), $btn.data('order-id'));
    });

    com.focusPage('#dataBody').on('click', '.cancel-btn', function() {
        cancelRequest($(this).data('id'));
    });

    com.focusPage('#dataBody').on('click', '.priority-btn', function() {
        updatePriority($(this).data('id'));
    });

    com.focusPage('#confirmProcessBtn').on('click', manualProcess);

    com.focusPage('#clearCompletedBtn').on('click', function() {
        com.showConfirm('确认清除7天前的已完成请求？', function() {
            com.post(api.quotationAssign.clearCompletedRequests, {
                "company": params.userInfo.company.cid,
                "department": params.userInfo.user.department,
                "days": 7
            }, function(res) {
                if (res.success) {
                    com.showAlert(com.info, '已清除 ' + res.clearedCount + ' 条记录');
                    loadList();
                } else {
                    com.showAlert(com.error, res.message);
                }
            });
        });
    });

    com.focusPage('#pagination').on('click', 'a[data-page]', function() {
        var targetPage = parseInt($(this).data('page'));
        if (targetPage > 0 && targetPage <= Math.ceil(page.total / page.pageSize)) {
            page.pageNo = targetPage;
            loadList();
        }
        return false;
    });

    // 初始化
    loadList();
});
```

---

## 测试步骤

### 1. 功能启用测试

1. 访问"预算配置管理"页面
2. 确认预算分配功能已启用
3. 确认自动分配模式已启用

### 2. 预算员配置测试

1. 访问"预算员规则管理"页面
2. 添加预算员，设置支持类型（半包/整装）
3. 设置最大任务数
4. 启用预算员

### 3. 自动分配测试

1. 在装饰订单页面点击"启动预算"按钮
2. 验证：
   - 如果有可用预算员且类型匹配 → 自动分配成功
   - 如果无可用预算员 → 进入待分配队列
   - 如果类型不匹配 → 显示错误提示

### 4. 待分配队列测试

1. 访问"待分配队列管理"页面
2. 查看待处理请求
3. 手动分配预算员
4. 调整优先级
5. 取消请求

### 5. 反向自动分配测试

1. 预算员完成当前报价
2. 调用"完成报价"接口
3. 验证：系统自动从队列中获取下一个任务

### 6. 状态流转测试

1. 观察预算员状态变化（可用 → 忙碌 → 可用）
2. 观察任务数量统计
3. 验证统计信息准确性

---

## 常见问题

### Q1: 如何调试 API 请求失败？

**A**:
1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 标签页
3. 查看 API 请求的参数和响应
4. 检查响应中的 `errorCode` 和 `errorMsg` 字段

### Q2: 如何验证类型匹配逻辑？

**A**:
1. 在预算员规则中配置不同支持类型
2. 创建不同装修类型的订单
3. 观察分配结果是否符合预期

### Q3: 如何查看详细的分配记录？

**A**: 查询 `quotationassignrecord` 表，该表记录了所有分配操作：
```javascript
com.post(api.quotationAssign.queryAssignRecord, {
    "assignRecord.orderId": "2024010001"
}, function(res) {
    console.log('分配记录:', res.records);
});
```

---

## 附录

### A. 状态码对照表

| 状态 | 值 | 说明 |
|------|---|------|
| 预算员状态 | 1 | 可用 |
| 预算员状态 | 2 | 忙碌 |
| 预算员状态 | 3 | 已停用 |
| 装修类型 | 1 | 半包 |
| 装修类型 | 2 | 整装 |
| 分配请求状态 | 1 | 待处理 |
| 分配请求状态 | 2 | 处理中 |
| 分配请求状态 | 3 | 已完成 |
| 分配请求状态 | 4 | 已取消 |
| 优先级 | 1 | 最高 |
| 优先级 | 2 | 高 |
| 优先级 | 3 | 普通 |
| 优先级 | 4 | 低 |

### B. 相关文档

- [功能设计文档](DESIGN_quotation_budget_assignment.md)
- [实施状态文档](IMPLEMENTATION_STATUS.md)
- [后端集成指南](INTEGRATION_GUIDE.md)
- [API 完整列表](API_REFERENCE.md)

---

**维护者**: AI 自动生成
**最后更新**: 2026-03-13
