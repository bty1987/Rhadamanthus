# 前端命名规范调整说明

> 调整日期: 2026-03-13
> 调整原因: 统一命名规范

---

## 调整原则

1. **所有文件默认带有 `quotation` 前缀**
2. **`budget` → `assign`** （预算员 → 分配）

---

## 文件重命名对照表

### HTML 页面文件

| 原文件名 | 新文件名 | 说明 |
|---------|---------|------|
| `assignUserRule.html` | `quotationAssignUserRule.html` | 预算员规则管理页面 |
| `quotationAssignRequest.html` | `quotationAssignRequest.html` | 待分配队列管理页面（保持不变） |
| `quotationConfig.html` | `quotationAssignConfig.html` | 预算配置管理页面 |

### JavaScript 文件

| 原文件名 | 新文件名 | 说明 |
|---------|---------|------|
| `budgetUserRule.js` | `quotationAssignUserRule.js` | 预算员规则管理逻辑 |
| `quotationAssignRequest.js` | `quotationAssignRequest.js` | 待分配队列管理逻辑（保持不变） |
| `quotationBudgetConfig.js` | `quotationAssignConfig.js` | 预算配置管理逻辑 |

---

## API 路由调整

### 路由名称更新

| 原路由名称 | 新路由名称 | URL 路径 |
|-----------|-----------|---------|
| `budgetUserRuleIndex` | `quotationAssignUserRuleIndex` | `/views/quotation/quotationAssignUserRule.html` |
| `quotationAssignRequestIndex` | `quotationAssignRequestIndex` | `/views/quotation/quotationAssignRequest.html` |
| `quotationConfigIndex` | `quotationAssignConfigIndex` | `/views/quotation/quotationAssignConfig.html` |

### API 定义（WebContent/js/api/quotation.js）

```javascript
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

---

## 文件引用更新

### HTML 页面中的 JS 引用

#### quotationAssignUserRule.html

```html
<script type="text/javascript">
    $.loadScript(['js/quotation/quotationAssignUserRule.js']);
</script>
```

#### quotationAssignConfig.html

```html
<script type="text/javascript">
    $.loadScript(['js/quotation/quotationAssignConfig.js']);
</script>
```

---

## 命名规范总结

### 页面文件命名

**格式**: `quotation[功能模块].html`

**示例**:
- `quotationAssignUserRule.html` - 预算员规则管理
- `quotationAssignRequest.html` - 待分配队列管理
- `quotationAssignConfig.html` - 预算配置管理

### JavaScript 文件命名

**格式**: `quotation[功能模块].js`

**示例**:
- `quotationAssignUserRule.js` - 预算员规则管理逻辑
- `quotationAssignRequest.js` - 待分配队列管理逻辑
- `quotationAssignConfig.js` - 预算配置管理逻辑

### API 路由命名

**格式**: `quotation[功能模块]Index`

**示例**:
- `quotationAssignUserRuleIndex` - 预算员规则管理页面路由
- `quotationAssignRequestIndex` - 待分配队列管理页面路由
- `quotationAssignConfigIndex` - 预算配置管理页面路由

---

## 已更新的文件

1. ✅ `WebContent/views/quotation/quotationAssignUserRule.html` (重命名 + JS 引用更新)
2. ✅ `WebContent/views/quotation/quotationAssignConfig.html` (重命名 + JS 引用更新)
3. ✅ `WebContent/js/quotation/quotationAssignUserRule.js` (重命名)
4. ✅ `WebContent/js/quotation/quotationAssignConfig.js` (重命名)
5. ✅ `WebContent/js/api/quotation.js` (API 路由更新)
6. ✅ `docs/FRONTEND_INTEGRATION_GUIDE.md` (文档更新)
7. ✅ `docs/FINAL_SUMMARY.md` (文档更新)

---

## 验证清单

- [x] 所有 HTML 文件已重命名
- [x] 所有 JavaScript 文件已重命名
- [x] HTML 文件中的 JS 引用已更新
- [x] API 定义中的路由已更新
- [x] 文档中的引用已更新
- [x] 所有文件名符合新的命名规范

---

**维护者**: AI Assistant
**最后更新**: 2026-03-13
