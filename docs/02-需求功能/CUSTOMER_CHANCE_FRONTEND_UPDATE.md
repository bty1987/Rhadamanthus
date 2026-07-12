# CustomerChance 前端页面功能更新说明

## 更新时间
2025-12-31

## 更新内容

### 1. 添加"是否校验"列表字段显示

在客户机会列表中新增了"是否校验"列，用于显示客户机会的校验状态。

#### 字段配置
```javascript
{
    field: "isCheck",
    name: "是否校验",
    prop: "isCheck",
    clazz: "red",
    dataset: constant.customer().customerChance.isCheck.keys,
    show: function(v) {
        return customerChance.depage == null;
    }
}
```

#### 显示逻辑
- **显示条件**: `customerChance.depage == null`（depage 为 null 时显示）
- **字段值**:
  - `0` = 验证中（ISCHECK_CHECK_INT）
  - `1` = 已忽略（ISCHECK_IGNORE_INT）
- **显示颜色**: 红色（clazz: "red"）

---

### 2. 添加"不校验"操作按钮

在操作按钮中新增了"不校验"按钮，用于将客户机会设置为忽略状态。

#### 按钮配置
```javascript
{
    name: "不校验",
    clazz: "btn-info",
    handle: function(v) {
        uncheckCustomerChance(v.ccid);
    },
    show: function(v) {
        return customerChance.depage == null
            && v.isCheck == constant.customer().customerChance.ISCHECK_CHECK_INT
            && customerChance.detype == null;
    }
}
```

#### 按钮显示条件
1. `customerChance.depage == null` - depage 为 null 时显示
2. `v.isCheck == constant.customer().customerChance.ISCHECK_CHECK_INT` - 当前状态为验证中（isCheck = 0）
3. `customerChance.detype == null` - detype 为 null 时显示

#### 按钮样式
- **样式类**: `btn-info`（蓝色按钮）
- **按钮文本**: "不校验"

---

### 3. 添加不校验功能函数

```javascript
function uncheckCustomerChance(ccid) {
    var options = {
        'customerChance.ccid': ccid
    };

    com.showConfirm("确认要设置为不校验状态吗？", function() {
        com.post(api.customer.uncheckCustomerChance, options, function(res) {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功!");
        });
    });
}
```

#### 功能说明
1. 弹出确认对话框，询问用户是否确认操作
2. 调用后端接口 `api.customer.uncheckCustomerChance`
3. 刷新列表数据
4. 显示成功提示

---

## 使用场景

### 场景 1: 客户机会列表查看

**访问路径**: `/views/customer/customerChance.html`

**列表显示字段**:
- 预派单号
- 客户姓名
- 客户电话
- 楼盘
- 楼号
- 派尺面积
- 业务类型
- 三方标识
- 创建人
- 分配时间
- 归属人
- 归属部门
- 归属分区
- 类型
- 状态
- 已读标识
- 建群
- 电话交接
- 是否见面
- 真实地址
- **是否罚款**
- **是否校验** ⭐ 新增
- 罚款时间
- 罚款人
- 已读时间
- 来源方
- 对接人
- 推荐单号
- 房屋属性
- 备注

### 场景 2: 操作按钮

**操作按钮列表**:
1. **已读** - depage 为 user/designer 时显示
2. **分配** - depage 不为 source 时显示
3. **是否建群** - detype 为 null 时显示
4. **是否电话交接** - detype 为 null 时显示
5. **是否见面** - detype 为 null 时显示
6. **真实地址** - depage 为 null 时显示
7. **罚款** - depage 为 manage 且未罚款时显示
8. **不校验** - depage 为 null 且 isCheck = 0 且 detype 为 null 时显示 ⭐ 新增
9. **不匹配** - depage 不为 source 时显示
10. **推送** - depage 不为 source 时显示
11. **确认** - depage 为 manage 时显示
12. **转换** - status = 3 时显示
13. **编辑** - depage 为 user/designer 时显示
14. **初审** - depage 为 user/designer 时显示
15. **审批** - detype 为 null 时显示
16. **记录** - depage 为 manage 时显示
17. **画像** - detype 为 null 时显示
18. **折扣** - detype 为 null 时显示

---

## depage 参数说明

### depage 的可能值
- `"user"` - 用户视图
- `"designer"` - 设计师视图
- `"dept"` - 部门视图
- `"region"` - 区域视图
- `"source"` - 来源视图
- `"manage"` - 管理视图
- `null` - 默认视图（无过滤）

### depage 为 null 的含义
- 显示所有客户机会
- 不过滤归属人、部门、区域或来源
- 管理员或全局视图
- 显示"是否校验"字段和"不校验"按钮

---

## 完整使用流程

### 1. 查看客户机会列表

```
1. 访问客户机会页面
   ↓
2. 系统判断 depage 是否为 null
   ↓
3. 如果为 null，显示"是否校验"列
   ↓
4. 列表中显示校验状态（验证中/已忽略）
```

### 2. 设置为不校验

```
1. 在列表中找到需要操作的客户机会
   ↓
2. 确认该客户机会的"是否校验"状态为"验证中"（isCheck = 0）
   ↓
3. 点击操作列的"不校验"按钮
   ↓
4. 系统弹出确认对话框
   ↓
5. 确认后调用后端接口
   ↓
6. 刷新列表，更新状态
   ↓
7. "是否校验"列显示为"已忽略"
   ↓
8. "不校验"按钮消失（因为状态已改变）
```

---

## 按钮状态变化

### 初始状态（isCheck = 0）
- **"是否校验"列**: 显示"验证中"
- **"不校验"按钮**: 显示

### 点击"不校验"后（isCheck = 1）
- **"是否校验"列**: 显示"已忽略"
- **"不校验"按钮**: 隐藏（因为 `v.isCheck != 0`）

---

## 注意事项

1. **depage 判断**:
   - `depage == null` 时才显示"是否校验"字段和"不校验"按钮
   - 如果 depage 有值（user/designer/dept/region/source/manage），则不显示

2. **detype 判断**:
   - `detype == null` 时才显示按钮
   - 如果 detype 有值，则隐藏按钮

3. **isCheck 状态**:
   - 只有 `isCheck == 0`（验证中）时才显示"不校验"按钮
   - `isCheck == 1`（已忽略）时不显示按钮

4. **常量依赖**:
   - 依赖于 `constant.customer().customerChance.isCheck.keys`
   - 需要在数据字典中定义 isCheck 字段

---

## 数据字典配置

需要在数据字典中添加 isCheck 字段定义：

**位置**: `ds/customer.json` 或后端常量配置

```json
"isCheck": [
    {"key": "0", "value": "验证中"},
    {"key": "1", "value": "已忽略"}
]
```

---

## 样式说明

### 字段样式
- **颜色**: 红色（clazz: "red"）
- **位置**: 在"是否罚款"字段之后，"罚款时间"字段之前

### 按钮样式
- **颜色**: 蓝色（btn-info）
- **位置**: 在"罚款"按钮之后，"不匹配"按钮之前

---

## 相关文件

### 前端文件
- **主文件**: `WebContent/js/customer/customerChance.js`
- **API配置**: `WebContent/js/api/customer.js`
- **数据字典**: `ds/customer.json`（可能需要添加）

### 后端文件
- **Action**: `src/com/fanglin/customer/action/CustomerChanceAction.java`
- **Service**: `src/com/fanglin/customer/service/CustomerChanceService.java`
- **ServiceImpl**: `src/com/fanglin/customer/service/impl/CustomerChanceServiceImpl.java`
- **PO**: `src/com/fanglin/customer/po/CustomerChancePO.java`
- **VO**: `src/com/fanglin/customer/vo/CustomerChanceVO.java`

---

## 测试建议

### 1. 功能测试
- [ ] depage = null 时，列表显示"是否校验"列
- [ ] depage != null 时，列表不显示"是否校验"列
- [ ] isCheck = 0 时，显示"不校验"按钮
- [ ] isCheck = 1 时，不显示"不校验"按钮
- [ ] 点击"不校验"按钮，状态更新为 1
- [ ] 更新后，按钮消失

### 2. 权限测试
- [ ] 不同 depage 值下的显示控制
- [ ] 不同 detype 值下的按钮控制

### 3. 交互测试
- [ ] 确认对话框显示正确
- [ ] 操作成功后提示正确
- [ ] 刷新列表后状态正确

---

## 常见问题

### Q1: 为什么"是否校验"列不显示？
**A**: 检查 depage 参数是否为 null。如果 depage 有值，该列会被隐藏。

### Q2: 为什么"不校验"按钮不显示？
**A**: 可能的原因：
1. depage 不为 null
2. detype 不为 null
3. isCheck 不等于 0（已经是已忽略状态）
4. 常量未定义

### Q3: 如何查看 depage 的值？
**A**: 在浏览器控制台输入：
```javascript
console.log(customerChance.depage);
```

---

**维护者**: AI Assistant
**最后更新**: 2025-12-31
