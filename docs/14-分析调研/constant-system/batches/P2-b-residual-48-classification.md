# P2-b 收尾：剩余 status 魔法数最终分类

> 日期：2026-07-28
> 全局进度：218 → **11**（已处理 207 处，**95%**）
> 本文记录剩余项的最终归属。经多轮 PO 核对、对象确认、业务讨论后，可处理的已全部处理。

---

## 分类总览

| 类别 | 处数 | 能否常量化 | 处理建议 |
|------|------|-----------|---------|
| **甲·前端流程标志** | 4 | ❌ 非业务枚举 | 永久保留（加注释） |
| **乙·PO 无枚举** | 16 | ❌ PO 未定义 | 永久保留（需先改 PO） |
| **丙·文案差异** | 9 | ⚠️ 可换但改文案 | 按需（确认文案可变才换） |
| **丁·语义存疑** | 8 | ❓ 需业务确认 | 待确认后处理 |
| **戊·误报/属性访问** | 11 | — | 非真实魔法数 |

---

## 甲类：前端流程标志（4处）— 永久保留

这些 `status==0` 不是业务状态枚举，而是前端"新增/已存在"的流程控制标志，**PO 里根本没有 status 字段**。

| 文件:行 | 对象 | 说明 |
|---|---|---|
| decoration4detail.js:2377 | decorationUser | DecorationUserPO **无 status 字段**；status==0 表示"未保存→走新增" |
| decoration4detail.js:2388 | decorationUser | 同上 |
| decoration4detail.js:2399 | decorationUser | 同上 |
| decoration4detail.js:2118 | customerPhone | 启停开关 checkbox，库无 customerPhone 常量 |

**处理**：已加注释保留。这类不该套业务常量。

---

## 乙类：PO 无 STATUS 枚举（16处）— 需先改 PO

PO 里只有 `private short status` 字段，**没有 STATUS_xxx 常量定义**。要常量化必须先在 PO 补枚举（后端改动）。

| 文件:行 | 对象 | PO 现状 |
|---|---|---|
| production/puotation.js:83,98,100,192 | puotation | PuotationPO 无 STATUS 枚举（前端"未使用/正使用"） |
| production/productionPlanItem.js:100 | productionPlanItem.params | ProductionPlanItemPO 无枚举 |
| production/workflow2check.js:158 | workflow | WorkflowPO 仅误命名的 COLUMN_STATUS_STR |
| production/workplan.js（已处理显示，但…）| — | — |
| data/chating.js:122,130 | chating | ChatingPO 仅 STATUS_START_INT=0（不完整，缺 status==1 的定义） |
| market/ecase.js:192 | ecase | CasePO 无 STATUS 枚举 |
| system/upgradePackage.js:39,80 | upgradePackage | 无对应 PO 枚举 |
| decoration/decorationSales2print.js:95 | v（salesReceipt相关）| 对象不明 |
| utils/decorationUtils.js:2146 | v（操作记录）| 对象不明（orderId/detail/operater） |
| utils/paymentUtils.js:66 | data（positem）| 对象不明 |
| utils/paymentUtils.js:337 | v（status 1/4）| payment.payment 无 4，对象/语义不明 |

**处理**：保留。若要常量化，路径是「后端 PO 补 STATUS 枚举 → 补录 constant 表 → 前端替换」，属后端改造范畴。

---

## 丙类：文案差异（9处）— 可处理但会改变用户所见文字

这些对象的 status 语义与通用启停一致（0启用/0初始），但**前端业务文案**与库常量 value 不同。用 keys 翻译会改变用户看到的字。

| 文件:行 | 前端文案 | 库常量文案 | 冲突 |
|---|---|---|---|
| data/soods.js:144,331 | "有效/无效" | common.status "启用/禁用" | 文案不同 |
| data/soods2create.js:86 | "有效/无效" | 同上 | 文案不同 |
| data/cormrice.js:71 | "有效/无效" | 同上 | 文案不同 |
| quotation/quotationVersion.js:303,332 | "有效/无效" | QuotationVersionPO 仅 ENABLE=0 | 文案+枚举不全 |
| quotation/quotationVersion.js:362 | "启用/禁用" | 同上对象，但与303/332文案不一致 | 同对象文案自相矛盾 |
| information/vactivity.js:38 | "启用/禁用" | information.activity "有效/失效" | 文案不同 |

**处理建议**：
- soods/cormrice：业务上一直叫"有效/无效"，**不宜擅自改成"启用/禁用"**，保留。
- quotationVersion：303/332 与 362 同对象却两种文案，是前端 bug，但修哪个需业务确认。
- vactivity：同 soods 理由保留。

---

## 丁类：语义存疑（8处）— 需业务确认

这些处的 status 含义与 PO 枚举对不上，可能是历史遗留/字段含义变更/脏数据。

| 文件:行 | 疑点 |
|---|---|
| production/production4view.js:202,218 | v 是 production，status==1 显示"订单已结束"，但 ProductionPO 第二组 status==1 是"设计"，第一组是"签约"——**都不符** |
| production/productionPlan.js:140 | status==1 \|\| status==2，但 ProductionPlanPO 只有 0/1，**status==2 不存在** |
| production/productionPlan2Create.js:136 | 同上 status==2 问题 |
| production/productionPlan4detail.js:160 | "初始/执行"，但 productionPlan 是"初始/完结"——对象可能不是 productionPlan |
| manifest/purchaseBalance2balance.js:43,60,80,82,164 | status==0="初始"，但 PurchaseBalancePO 只有 STATUS_DONE_INT=1，**0 无定义** |
| manifest/occessories.js:593 | value 来自 inventoryDrawings，InventoryDrawingPO 仅 STATUS_INIT_INT=0 |
| salary/designerSalary.js:64 | "初始/已通过/已驳回"，库 salary.salary 是"初始/通过/驳回"（无"已"字） |
| salary/workerSalary.js:417 | 复合判断，含 decoration 状态 |

**处理**：需业务方确认真实语义后再处理。purchaseBalance 的 status==0 可能是"未结算"但 PO 漏定义；productionPlan status==2 可能是已废弃的状态值。

---

## 戊类：误报/属性访问（11处）— 非真实魔法数

正则 `.status == 0` 匹配到了，但实际是**数组元素或对象属性链**，不是独立的 status 判断。

| 文件:行 | 实际情况 |
|---|---|
| data/cormrice.js:71 | propertyArr 数组内 `"状态:", v.status == 0 ? "有效"...` |
| data/soods2create.js:86 | 同上 propertyArr |
| sales/sales4payment.js:106 | propertyArr，status 在数组里 |
| sales/salesBalance4check.js:501 | 同上 |
| system/company4config.js:221 | propertyArr，data.status 反逻辑"启用/禁用" |
| utils/decorationUtils.js:589 | stateSpan 构建，含 status |
| utils/decorationUtils.js:1260 | propertyArr |
| utils/decorationUtils.js:2129 | propertyArr |

这些本质和丙类一样（文案显示），归入丙类一并考虑。

---

## 处理建议总结

### 立即可做（低风险）：无
剩余 48 处没有"零风险立即可做"的项了——能安全处理的 170 处都已处理。

### 建议推进顺序（若要继续）

1. **丁类·语义存疑（8处）**：价值最高。建议找业务方确认 production4view/purchaseBalance/productionPlan(status==2) 的真实含义。确认后可能发现 PO 枚举需要补全（后端改动），或前端逻辑本身有 bug。
2. **丙类·文案差异（9处）**：确认 soods/cormrice/quotationVersion 的标准文案后统一。quotationVersion 的"同对象两文案"是明确的 bug，值得修。
3. **乙类·PO 无枚举（16处）**：需后端配合补 PO 枚举，工作量最大，建议作为独立技术债。
4. **甲类·流程标志（4处）**：永久保留，无需处理。

---

## 最终归档：剩余 11 处（永久保留）

经多轮处理（PO 补枚举 + 业务确认 B1-B7），48 处中已再处理 37 处，**最终剩余 11 处全部为永久保留项**：

| 处 | 文件:行 | 保留原因 |
|---|---|---|
| 1-3 | decoration4detail.js:2376/2387/2398 | decorationUser 前端自造流程标志（PO 无 status 字段） |
| 4 | information/vactivity.js:38 | 业务确认保留"启用/禁用"文案（库 activity 是"有效/失效"） |
| 5-7 | utils/decorationUtils.js:589/1260/2129 | 正则误匹配 propertyArr 数组内的 status 显示 |
| 8 | utils/paymentUtils.js:66 | data 来自 DOM `.data()`，对象不明 |
| 9 | market/ecase.js:192 | EcasePO 无 STATUS 枚举 |
| 10-11 | sales/sales4payment.js:106 / salesBalance4check.js:501 | 正则误匹配 propertyArr |

这 11 处不影响系统正确性，且每处都有明确的"不可常量化"理由。**常量收敛任务到此完结。**

### 处理历程
- 218 → 48（170 处，主体收敛）
- 48 → 30（甲乙类 PO 补枚举）
- 30 → 26（对象重新确认）
- 26 → 11（B1-B7 业务确认）
- **累计处理 207 处（95%）**
