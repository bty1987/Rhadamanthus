# quotationAssign 条件配置使用 constant 常量说明

## 📋 概述

目前 `WebContent/js/condition/quotation.js` 中的 quotationAssign 相关配置使用了硬编码数据。可以通过使用 `constant` 对象从数据库读取常量配置，实现统一管理。

## 🔄 修改方式

### 方式一：硬编码（当前实现）

```javascript
"quotation-assignConfig-enabled": {
    label: "启用状态",
    type: "select",
    submitConfig: {
        name: "enabled",
        op: "eq",
        alone: true,
        validate: null
    },
    dataSource: {
        url: null,
        postData: null,
        listPath: [{
            key: "",
            value: "全部"
        }, {
            key: "1",
            value: "已启用"
        }, {
            key: "0",
            value: "已禁用"
        }],
        keyPath: "key",
        valuePath: "value"
    }
}
```

### 方式二：使用 constant（推荐）

```javascript
"quotation-assignConfig-enabled": {
    label: "启用状态",
    type: "select",
    submitConfig: {
        name: "enabled",
        op: "eq",
        alone: true,
        validate: null
    },
    dataSource: {
        url: null,
        postData: null,
        listPath: constant.quotation().quotationAssignConfig.enabled.datas,
        keyPath: "key",
        valuePath: "value"
    }
}
```

## 📦 constant 对象使用说明

### ⚠️ 重要规范

**前台使用 constant 的标准格式：**

```javascript
constant.<module>().<clazz>.<field/常量名>.<datas/keys>
```

**规则说明：**
- `module()` - 模块名，注意是**函数调用**（有括号）
- `clazz` - 类名（实体类名）
- `field` - 字段名或常量名
- `datas` - 获取数据列表（返回 `[{key, value}, ...]`）
- `keys` - 获取键列表（返回 `[key1, key2, ...]`）

### 语法格式

### quotationAssign 相关的 constant 路径

| 配置项 | constant 路径 | 说明 |
|--------|----------------|------|
| 启用状态 | `constant.quotation().quotationAssignConfig.enabled.datas` | 预算配置启用状态 |
| 分配方式 | `constant.quotation().quotationAssignConfig.autoAssign.datas` | 预算配置分配方式 |
| 预算员状态 | `constant.quotation().quotationAssignUserRule.status.datas` | 预算员规则状态 |
| 请求状态 | `constant.quotation().quotationAssignRequest.status.datas` | 分配请求状态 |
| 优先级 | `constant.quotation().quotationAssignRequest.priority.datas` | 分配请求优先级 |
| 分配类型 | `constant.quotation().quotationAssignRecord.assignType.datas` | 分配记录类型 |
| 分配结果 | `constant.quotation().quotationAssignRecord.assignResult.datas` | 分配记录结果 |
| 装修类型 | `constant.quotation().quotationAssignUserRuleType.type.datas` | 预算员支持类型 |

## 📝 完整修改示例

### 1. 预算配置 - 启用状态

```javascript
"quotation-assignConfig-enabled": {
    label: "启用状态",
    type: "select",
    submitConfig: {
        name: "enabled",
        op: "eq",
        alone: true,
        validate: null
    },
    dataSource: {
        url: null,
        postData: null,
        listPath: constant.quotation().quotationAssignConfig.enabled.datas,
        keyPath: "key",
        valuePath: "value"
    }
}
```

### 2. 预算配置 - 分配方式

```javascript
"quotation-assignConfig-autoAssign": {
    label: "分配方式",
    type: "select",
    submitConfig: {
        name: "autoAssign",
        op: "eq",
        alone: true,
        validate: null
    },
    dataSource: {
        url: null,
        postData: null,
        listPath: constant.quotation().quotationAssignConfig.autoAssign.datas,
        keyPath: "key",
        valuePath: "value"
    }
}
```

### 3. 预算员规则 - 状态

```javascript
"quotation-assignUserRule-status": {
    label: "状态",
    type: "select",
    submitConfig: {
        name: "status",
        op: "eq",
        alone: true,
        validate: null
    },
    dataSource: {
        url: null,
        postData: null,
        listPath: constant.quotation().quotationAssignUserRule.status.datas,
        keyPath: "key",
        valuePath: "value"
    }
}
```

### 4. 待分配队列 - 状态

```javascript
"quotation-assignRequest-status": {
    label: "状态",
    type: "select",
    submitConfig: {
        name: "quotationAssignRequest.status",
        op: "eq",
        validate: null
    },
    dataSource: {
        url: null,
        postData: null,
        listPath: constant.quotation().quotationAssignRequest.status.datas,
        keyPath: "key",
        valuePath: "value"
    }
}
```

### 5. 待分配队列 - 优先级

```javascript
"quotation-assignRequest-priority": {
    label: "优先级",
    type: "select",
    submitConfig: {
        name: "quotationAssignRequest.priority",
        op: "eq",
        validate: null
    },
    dataSource: {
        url: null,
        postData: null,
        listPath: constant.quotation().quotationAssignRequest.priority.datas,
        keyPath: "key",
        valuePath: "value"
    }
}
```

## ⚙️ 实施步骤

### 步骤1：导入常量数据到数据库

执行 SQL 脚本：
```bash
mysql -u root -p < sql/add_quotationassign_constant.sql
```

### 步骤2：修改 condition 配置文件

编辑 `WebContent/js/condition/quotation.js`，将硬编码的 `listPath` 替换为 `constant` 引用。

### 步骤3：验证功能

1. 刷新页面
2. 打开预算员分配相关页面
3. 检查查询条件下拉框是否正常显示数据
4. 测试筛选功能是否正常

## ✅ 优势

使用 constant 常量的优势：

1. **统一管理**：所有下拉选项数据集中在数据库管理
2. **易于维护**：修改数据不需要改代码，只需更新数据库
3. **一致性**：确保前后端使用相同的数据源
4. **灵活性**：可以根据环境（生产/测试）配置不同的数据
5. **可扩展**：新增选项只需插入数据库记录

## ⚠️ 注意事项

1. **constant 对象加载**：确保 constant 对象在页面加载时已初始化
2. **数据格式**：constant 返回的数据格式必须是数组 `[{key: "1", value: "已启用"}, ...]`
3. **字段映射**：确保 `keyPath` 和 `valuePath` 与数据库字段对应
4. **缓存刷新**：修改数据库后可能需要刷新系统缓存

## 📚 参考资料

- constant 表结构：`communion.constant`
- 示例配置：`WebContent/js/condition/decoration.js`
- 常量管理：系统管理 > 常量配置（如有）

## 🔄 回退方案

如果使用 constant 遇到问题，可以随时回退到硬编码方式（当前实现）。

---

**文档创建日期**: 2026-03-19
**维护者**: Claude AI
