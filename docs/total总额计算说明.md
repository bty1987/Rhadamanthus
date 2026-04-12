# 预签单 Total 总额计算说明

> 文件位置：`WebContent/js/quotation/protationPart.js` → `calculateQuoFees` 方法（第158-323行）

---

## 一、计算公式

```
总额 = 报价单价 + 管理费 + 税费 - 优惠价格 - 管理费优惠 - 特殊优惠 - 活动优惠
     + 基础项合计 + 增工程项合计 + 增主材项合计
     - 减工程项合计 - 减主材项合计 - 减现项合计
     + 赋能主材合计 + 赋能工程合计
```

---

## 二、各组成部分详解

### 1. 报价单价
- 公式：`quotePrice + activityPrice`
- quotePrice：基础报价单价
- activityPrice：活动加价部分

### 2. 管理费（_managePrice）
- 由 `manageFormula` 模板动态计算
- 模板中可使用以下变量：

| 变量 | 含义 |
|------|------|
| {a} | 报价单价（quotePrice） |
| {b} | 优惠价格（preferPrice） |
| {c} | 基础项合计（basic） |
| {d} | 增工程项 + 增主材项（addd + addm） |
| {e} | 减工程项 + 减主材项 + 减现项（subd + subm + subc） |
| {f} | 赋能主材 + 赋能工程（accm + accd） |
| {g} | 管理费（managePrice） |
| {h} | 特殊优惠（advanceProfit） |
| {i} | 管理费优惠（manageProfit） |
| {j} | 活动优惠（activityProfit） |

### 3. 税费（_taxPrice）
- 由 `taxFormula` 模板动态计算
- 支持的变量与 manageFormula 相同

### 4. 优惠扣减项

| 项目 | 变量名 | 说明 |
|------|--------|------|
| 优惠价格 | preferPrice | 普通优惠金额 |
| 管理费优惠 | manageProfit | 针对管理费的优惠 |
| 特殊优惠 | advanceProfit | 特批优惠，需审核（type=0） |
| 活动优惠 | activityProfit | 活动优惠，需审核（type=1） |

### 5. 增减项

| 项目 | 变量名 | 加减 | 说明 |
|------|--------|------|------|
| 基础项合计 | basic | + | 基础施工项目金额 |
| 增工程项合计 | addd | + | 增加的工程项目金额 |
| 增主材项合计 | addm | + | 增加的主材项目金额 |
| 减工程项合计 | subd | - | 减少的工程项目金额 |
| 减主材项合计 | subm | - | 减少的主材项目金额 |
| 减现项合计 | subc | - | 减少的现成项目金额 |
| 赋能主材合计 | accm | + | 赋能主材项目金额 |
| 赋能工程合计 | accd | + | 赋能工程项目金额 |

---

## 三、取整规则

- 当装修类型为**包工包料**（TYPE_INCLUSIVE_INT）时，总额通过 `Math.round()` 四舍五入取整
- 其他类型不取整

---

## 四、利润率计算

```
利润率 = 1.0 - 总成本(totalCost) / (总额 - 活动金额(activityAmount))
```

---

## 五、审核触发条件

| 审核类型 | 触发条件 | 审核人类型 |
|----------|----------|------------|
| 特批优惠（type=0） | 仅当 advanceProfit 增加时触发 | 22 |
| 活动优惠（type=1） | 始终需要审核 | 26 |

---

## 六、相关文件

| 文件 | 说明 |
|------|------|
| `protationPart.js` | 详情页，主计算逻辑（calculateQuoFees） |
| `protationIndex.js` | 列表页，包含相同的总额计算公式（第185-186行） |

> 注意：两个文件中存在重复的总额计算逻辑，修改时需同步更新。
