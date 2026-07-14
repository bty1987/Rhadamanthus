# 方法命名规范（Action / Service / DAO）

> 本规范从项目 **2963 个去重 Action 方法名**统计归纳而来，是项目内既成的事实标准。
> 新增代码、AI 生成代码均须遵守，保证命名风格统一、可检索、可预期。

---

## 一、核心骨架

```
[动词] + [对象] + [By条件] + [For目的/范围]
```

- **动词**：表示做什么（CRUD 或业务动作）。
- **对象**：操作的实体或业务对象，驼峰，不带模块前缀（`queryDecorationByOrderId` 而非 `queryDecorationDecorationByOrderId`，因为 Action 已在 decoration 模块下）。
- **By条件**（可选）：查询/删除的过滤条件，取字段名（带 Id 后缀），如 `ByOrderId`、`ByUnionId`、`ByAId`。
- **For目的**（可选）：范围 / 场景 / 角色 / 状态，如 `ForBalance`、`ForDeposit`、`ForPlatforPm`、`ForEnable`。

**全四段示例**：
```
queryDecorationForCommonByOrderId      // 查装修单(通用视角)按订单号
pageSalesForBalanceByDompany           // 分页查销售(结算用)按公司
queryCustomerDeptRuleByDbidForSF       // 查客户部门规则按dbid(销售用)
```

**最简形态**（仅动词+对象）：
```
queryDecoration      // 查装修单
addApproval          // 新增审批
deleteQuotation      // 删除报价
```

> 规则：条件少则省略 By/For；条件明确才补全。**不要硬凑 By/For**。统计上 71% 的方法是最简形态（纯动词+对象），有 By 或 For 的各占 15% 左右。

---

## 二、动词清单（按频次分级）

### A. CRUD 通用动词（最高频，必须用这些）

| 动词 | 统计数 | 语义 | 返回 |
|------|--------|------|------|
| `query` | 752 | 查询单条或列表（**不分页**） | 单个对象或 List |
| `page` | 356 | **分页**查询 | Paging 对象 |
| `update` | 454 | 修改 | 受影响行数 / 状态码 |
| `add` | 334 | 新增 | 新生成的 id / 状态码 |
| `delete` | 201 | 删除 | 状态码 |
| `get` | 129 | 取值 / 简单获取（常用于单字段或配置） | 值 |
| `count` | 21 | 计数（返回数值） | int / long |
| `amount` | 25 | 求和 / 汇总金额（返回数值） | BigDecimal / 数值 |

### B. 🔴 `page` 与 `query` 的硬性区分（最容易错）

| 动词 | 何时用 | 返回结构 | DAO 层 |
|------|--------|---------|--------|
| `page` | 需要分页（前端列表、Paging 组件） | `Paging<XxxVO>` | 调 `pageXxx(paging, filters)` |
| `query` | 不分页（下拉、详情、单条、全量小列表） | `XxxVO` 或 `List<XxxVO>` | 调 `queryXxx(...)` |

**禁止**：返回分页结构的方法起名 `queryXxx`，或不分页的方法起名 `pageXxx`。前端按方法名约定解析返回，混用会导致解析失败。

### C. 业务动作动词（领域动词，按场景选用）

非 CRUD 的业务操作，**同样遵守 `动词+对象+By+For` 骨架**：

| 动词 | 数 | 语义 | 示例 |
|------|----|------|------|
| `submit` | 30 | 提交（提交审批、提交结算） | `submitApproval` |
| `confirm` | 27 | 确认（确认订单、确认收款） | `confirmDecorationPayment` |
| `cancel` | 21 | 取消 | `cancelMaterialPaymentForDeposit` |
| `sign` | 13 | 签订（签合同） | `signDecorationContract` |
| `affirm` | 10 | 认定（认定业绩、认定金额） | `affirmSales` |
| `bind` / `unbind` | 9 / 7 | 绑定 / 解绑 | `bindCustomer` |
| `lock` / `unlock` | 8 / 7 | 锁定 / 解锁 | `lockDecoration` |
| `reset` | 8 | 重置 | `resetPassword` |
| `approve` | 5 | 审批通过 | `approveApprovalTask` |
| `enable` / `disable` | — | 启用 / 禁用 | `disableCustomerUserRuleByCurid` |
| `begin` / `end` | 3 / — | 开始 / 结束（流程、施工） | `beginConstructionForPlatforPm` |
| `adopt` | 2 | 采纳（采纳薪资方案） | `adoptWorkerSalary` |
| `affix` | 4 | 附加（附件关联） | `affixDecorationContract` |
| `abate` | 4 | 衰减 / 扣减（活动扣减） | `abateSalesActivityItem` |
| `agree` | 1 | 同意（审批同意） | `agreeApprovalTask` |
| `send` / `receive` | 34 / 6 | 发送 / 接收（消息、物料） | `sendMaterialForCR` |

> 选用原则：**能用 CRUD 动词就用 CRUD**；只有 CRUD 表达不了业务语义时才用领域动词。例如"取消定金"是 `cancelMaterialPaymentForDeposit`（cancel），不是 `updateMaterialPaymentForCancel`。

### D. 数据交换动词（低频）

| 动词 | 数 | 语义 |
|------|----|------|
| `export` | 3 | 导出（Excel / 文件） |
| `import` | 10 | 导入 |

---

## 三、By 条件的写法

### 规则：取**字段名**，带 Id 后缀，驼峰，复数用 `Ids`

```
ByOrderId          // 单个 orderId
ByOrderIds         // 多个 orderId（List/数组）
ByAId              // approval 的 id（缩写 A=Approval，见缩写表）
ByUnionId          // unionId
ByPinyin           // 拼音（非 id 字段也可以）
ByContractTime     // 时间字段也可作条件
```

### 禁止

- ❌ 自然语言条件：`ByOrderNumber`（如果字段叫 `orderId` 就别写 `OrderNumber`）
- ❌ 多个条件拼接成一句话：`ByOrderAndCompany`（用 For 或拆方法，而非 And）

### 多条件

项目里**极少**用 `And`。多条件通常通过 VO 传参，方法名只体现主键条件：
```
✅ queryDecorationByOrderId(OrderVO vo)        // vo 里可带其他字段,方法名只标主条件
❌ queryDecorationByOrderIdAndCompanyIdAndStatus(...)
```

---

## 四、For 目的的写法

`For` 表达**范围 / 场景 / 角色 / 状态**，不是查询条件。统计上有三类：

### 1. 范围 / 场景（最常见）

```
ForBalance         // 结算用
ForDeposit         // 定金场景
ForFullpay         // 全款场景
ForCommon          // 通用视角
ForRefer           // 引用场景
```

### 2. 角色 / 视角

```
ForPlatforPm       // 平台项目经理视角
ForReceive         // 接收方
ForSend            // 发送方
ForSF              // 销售(Sales)用 —— 见缩写表
ForAR / ForAS / ForCG / ForCR / ForPU / ForXB / ForXG   // 货物流向角色代码
```

### 3. 状态

```
ForEnable          // 启用态
ForSeen            // 已读
ForNotInit         // 非初始化
ForPayed           // 已支付
```

---

## 五、缩写对照表（高频，必须沿用）

项目内固定缩写，新代码沿用这些、不要自创：

| 缩写 | 全称 | 出现处 |
|------|------|--------|
| `AId` | Approval Id | `queryApprovalByAId` |
| `Oid`/`BId`/`CId`/`DId` | 各模块主键 Id | `deleteBrandByBIds` |
| `ForCR/AR/AS/CG/PU/XB/XG` | 货物 / 单据流向角色代码 | `addManifestForCR` |
| `ForSF` | Sales（销售） | `queryCustomerDeptRuleByDbidForSF` |
| `Pm` | Project Manager | `ForPlatforPm` |
| `Dompany`/`Pompany` | Company 的历史拼写变体（疑似公司分库标识，**新代码用 Company**，旧代码保留） | `pageSalesForBalanceByDompany` |

> ⚠️ `Dompany`/`Pompany` 是历史遗留变体（C 被 D/P 替换），**新代码不要沿用**，统一用 `Company`。统计到约几十处旧代码用此变体。

---

## 六、分层一致性（Action / Service / DAO 同名）

同一业务操作在三层**方法名保持一致**，只是参数和返回不同：

```
Action:   queryDecorationByOrderId(DecorationVO vo)           → JSON
Service:  queryDecorationByOrderId(DecorationVO vo)           → DecorationVO
DAO:      queryDecorationByOrderId(...) 或 queryDecoration(...) → DecorationPO
```

> DAO 层偶尔省略 By（因 HQL 内部已含条件），但**动词和对象必须一致**。三层方法名不一样会让排查极其困难。

---

## 七、检查清单（写完方法名自检）

- [ ] 动词在第二节清单内？（CRUD 优先，业务动作次之）
- [ ] `page` / `query` 用对了？（分页 vs 非分页）
- [ ] 对象没带冗余模块前缀？（`queryDecoration` 非 `queryDecorationDecoration`）
- [ ] By 条件取的是字段名且带 Id 后缀？
- [ ] For 表达的是范围 / 角色 / 状态，而非查询条件？（条件用 By）
- [ ] 三层（Action/Service/DAO）方法名一致？
- [ ] 没有用 And 拼接多条件？（用 VO 传参）
- [ ] 沿用了既有缩写，没自创？

---

## 附：统计数据来源

本规范基于以下统计（截至本文档生成时）：
- 558 个 `*Action.java` 文件
- 2963 个去重 `public String` 方法名
- 动词前缀分布、By/For 模式分布均来自真实代码 grep 统计

如发现规则有未覆盖的命名模式，更新本文档第二节动词清单。
