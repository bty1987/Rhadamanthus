# 前端调用 uncheckCustomerChance 接口使用指南

## 接口配置位置

**文件**: `WebContent/js/api/customer.js`

**配置代码**:
```javascript
uncheckCustomerChance: {
    url: "uncheckCustomerChance.do"
}
```

---

## 使用方式

### 方式 1: 使用 com.post() 方法（推荐）

```javascript
/**
 * 设置客户机会为忽略状态
 * @param {Number} ccid - 客户机会ID
 */
function uncheckCustomerChance(ccid) {
    com.post(api.customer.uncheckCustomerChance, {
        "customerChance.ccid": ccid
    }, function(res) {
        if (res.errorCode == 0) {
            // 成功
            com.showAlert(com.info, '设置成功');

            // 刷新列表
            loadCustomerChanceList();

            // 或者更新当前行的状态
            updateRowStatus(ccid, 1);
        } else {
            // 失败
            com.showAlert(com.error, res.errorMsg || '设置失败');
        }
    });
}
```

### 方式 2: 在列表页的操作按钮中使用

```javascript
// 绑定"忽略"按钮点击事件
$(document).on('click', '.uncheck-btn', function() {
    var ccid = $(this).data('ccid');

    com.confirm('确认要忽略该客户机会吗？', function() {
        com.post(api.customer.uncheckCustomerChance, {
            "customerChance.ccid": ccid
        }, function(res) {
            if (res.errorCode == 0) {
                com.showAlert(com.info, '已设置为忽略状态');

                // 重新加载列表
                loadList();
            } else {
                com.showAlert(com.error, res.errorMsg);
            }
        });
    });
});
```

### 方式 3: 批量操作

```javascript
/**
 * 批量设置客户机会为忽略状态
 */
function batchUncheckCustomerChance() {
    // 获取选中的客户机会ID
    var ccids = [];
    $('.data-table input[type="checkbox"]:checked').each(function() {
        ccids.push($(this).data('ccid'));
    });

    if (ccids.length === 0) {
        com.showAlert(com.warning, '请至少选择一项');
        return;
    }

    com.confirm('确认要忽略选中的 ' + ccids.length + ' 个客户机会吗？', function() {
        // 逐个调用接口
        var successCount = 0;
        var failCount = 0;

        $.each(ccids, function(i, ccid) {
            com.post(api.customer.uncheckCustomerChance, {
                "customerChance.ccid": ccid
            }, function(res) {
                if (res.errorCode == 0) {
                    successCount++;
                } else {
                    failCount++;
                }

                // 全部处理完毕
                if (successCount + failCount === ccids.length) {
                    com.showAlert(com.info,
                        '批量操作完成！成功 ' + successCount + ' 个，失败 ' + failCount + ' 个');

                    // 刷新列表
                    loadList();
                }
            });
        });
    });
}
```

---

## HTML 按钮示例

### 在表格操作列中添加按钮

```html
<table id="customerChanceTable" class="table table-striped table-bordered">
    <thead>
        <tr>
            <th>客户姓名</th>
            <th>手机号</th>
            <th>状态</th>
            <th>验证状态</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody id="customerChanceBody">
        <!-- 数据行将通过 JavaScript 动态生成 -->
    </tbody>
</table>

<script id="rowTemplate" type="text/template">
    <tr data-ccid="{{ccid}}">
        <td>{{customerName}}</td>
        <td>{{phone}}</td>
        <td>{{statusText}}</td>
        <td>
            <span class="label {{isCheckClass}}">
                {{isCheckText}}
            </span>
        </td>
        <td>
            <!-- 忽略按钮 -->
            <button class="btn btn-xs btn-warning uncheck-btn"
                    data-ccid="{{ccid}}"
                    {{#if isCheck}}disabled{{/if}}>
                <i class="icon-minus"></i> 忽略
            </button>

            <!-- 其他操作按钮 -->
            <button class="btn btn-xs btn-info view-btn"
                    data-ccid="{{ccid}}">
                <i class="icon-eye-open"></i> 查看
            </button>
        </td>
    </tr>
</script>
```

---

## 完整页面示例

```javascript
$(function() {
    // 页面初始化
    initPage();
});

/**
 * 初始化页面
 */
function initPage() {
    // 加载列表
    loadCustomerChanceList();

    // 绑定事件
    bindEvents();
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 忽略按钮
    $(document).on('click', '.uncheck-btn', function() {
        var ccid = $(this).data('ccid');
        var $row = $(this).closest('tr');

        com.confirm('确认要忽略该客户机会吗？', function() {
            com.post(api.customer.uncheckCustomerChance, {
                "customerChance.ccid": ccid
            }, function(res) {
                if (res.errorCode == 0) {
                    com.showAlert(com.info, '已设置为忽略状态');

                    // 更新当前行的显示
                    $row.find('.is-check-label')
                        .removeClass('label-success')
                        .addClass('label-warning')
                        .text('已忽略');

                    // 禁用忽略按钮
                    $row.find('.uncheck-btn').prop('disabled', true);
                } else {
                    com.showAlert(com.error, res.errorMsg);
                }
            });
        });
    });

    // 刷新按钮
    $('#refreshBtn').on('click', function() {
        loadCustomerChanceList();
    });
}

/**
 * 加载客户机会列表
 */
function loadCustomerChanceList() {
    com.post(api.customer.pageCustomerChance, {
        "page.pageNo": 1,
        "page.pageSize": 20
    }, function(res) {
        if (res.errorCode == 0) {
            renderList(res.paging.data);
        } else {
            com.showAlert(com.error, res.errorMsg);
        }
    });
}

/**
 * 渲染列表
 */
function renderList(list) {
    var html = '';

    $.each(list, function(i, item) {
        var isCheckClass = item.isCheck == 1 ? 'label-warning' : 'label-success';
        var isCheckText = item.isCheck == 1 ? '已忽略' : '验证中';
        var btnDisabled = item.isCheck == 1 ? 'disabled' : '';

        html += '<tr>';
        html += '  <td>' + item.source.customer.name + '</td>';
        html += '  <td>' + item.source.customer.phone + '</td>';
        html += '  <td>' + item.statusText + '</td>';
        html += '  <td>';
        html += '    <span class="label ' + isCheckClass + ' is-check-label">';
        html += isCheckText;
        html += '    </span>';
        html += '  </td>';
        html += '  <td>';
        html += '    <button class="btn btn-xs btn-warning uncheck-btn" ' +
                    'data-ccid="' + item.ccid + '" ' + btnDisabled + '>';
        html += '      <i class="icon-minus"></i> 忽略';
        html += '    </button>';
        html += '  </td>';
        html += '</tr>';
    });

    $('#customerChanceBody').html(html);
}
```

---

## 响应数据格式

### 成功响应
```json
{
  "errorCode": 0,
  "errorMsg": "",
  "customerChance": {
    "ccid": 12345,
    "isCheck": 1
  }
}
```

### 失败响应
```json
{
  "errorCode": 330075,
  "errorMsg": "客户机会不存在"
}
```

---

## 状态显示优化

### 根据 isCheck 值显示不同的标签

```javascript
/**
 * 获取验证状态的标签 HTML
 */
function getIsCheckLabel(isCheck) {
    if (isCheck == 1) {
        // 已忽略
        return '<span class="label label-warning">已忽略</span>';
    } else {
        // 验证中
        return '<span class="label label-success">验证中</span>';
    }
}

/**
 * 获取验证状态的文本
 */
function getIsCheckText(isCheck) {
    return isCheck == 1 ? '已忽略' : '验证中';
}

/**
 * 检查是否可以忽略
 */
function canUncheck(isCheck) {
    return isCheck == 0; // 只有验证中的可以忽略
}
```

---

## 筛选功能

### 添加验证状态筛选

```html
<!-- 筛选条件 -->
<div class="row search-row">
    <div class="col-xs-12">
        <div class="form-inline">
            <label>验证状态:</label>
            <select id="isCheckSelect">
                <option value="">全部</option>
                <option value="0">验证中</option>
                <option value="1">已忽略</option>
            </select>

            <button id="searchBtn" class="btn btn-sm btn-primary">
                <i class="icon-search"></i> 查询
            </button>
        </div>
    </div>
</div>

<script>
// 查询按钮点击事件
$('#searchBtn').on('click', function() {
    var isCheck = $('#isCheckSelect').val();

    var params = {
        "page.pageNo": 1,
        "page.pageSize": 20
    };

    // 如果选择了验证状态，添加到查询条件
    if (isCheck !== '') {
        params['customerChance.isCheck'] = isCheck;
    }

    com.post(api.customer.pageCustomerChance, params, function(res) {
        if (res.errorCode == 0) {
            renderList(res.paging.data);
        } else {
            com.showAlert(com.error, res.errorMsg);
        }
    });
});
</script>
```

---

## 错误处理

### 完整的错误处理示例

```javascript
function uncheckCustomerChance(ccid) {
    // 参数验证
    if (!ccid) {
        com.showAlert(com.warning, '客户机会ID不能为空');
        return;
    }

    // 显示加载提示
    com.showLoading('正在处理...');

    com.post(api.customer.uncheckCustomerChance, {
        "customerChance.ccid": ccid
    }, function(res) {
        // 隐藏加载提示
        com.hideLoading();

        switch(res.errorCode) {
            case 0:
                // 成功
                com.showAlert(com.info, '设置成功');
                loadList();
                break;

            case 330075:
                // 客户机会不存在
                com.showAlert(com.error, '客户机会不存在，请刷新列表重试');
                break;

            default:
                // 其他错误
                com.showAlert(com.error, res.errorMsg || '操作失败，请稍后重试');
                break;
        }
    }, function(res) {
        // 网络错误或服务器错误
        com.hideLoading();
        com.showAlert(com.error, '网络错误，请检查网络连接');
    });
}
```

---

## 注意事项

1. **参数格式**: 必须使用 `customerChance.ccid` 格式传递参数
2. **错误处理**: 建议添加完整的错误处理逻辑
3. **用户体验**: 操作前建议显示确认对话框
4. **状态刷新**: 操作成功后需要刷新列表或更新当前行状态
5. **权限控制**: 根据用户权限控制按钮的显示/隐藏

---

## 相关文件

- **后端 Action**: `src/com/fanglin/customer/action/CustomerChanceAction.java`
- **后端 Service**: `src/com/fanglin/customer/service/CustomerChanceService.java`
- **API 配置**: `WebContent/js/api/customer.js`
- **接口文档**: `UNCHECK_CUSTOMER_CHANCE_API.md`

---

**维护者**: AI Assistant
**最后更新**: 2025-12-31
