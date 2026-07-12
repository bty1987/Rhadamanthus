# MessageQueuing 消息队列使用指南

> **版本**: v2.3
> **更新日期**: 2026-07-03
> **表名**: `information.messagequeuing` / `information.messagecueing` / `information.messagedueuing`

---

## 目录

- [概述](#概述)
- [三表架构](#三表架构)
- [数据结构](#数据结构)
- [生成场景汇总](#生成场景汇总)
- [Event 事件类型](#event-事件类型)
- [Operation 操作类型](#operation-操作类型)
- [代码示例](#代码示例)
- [相关文件](#相关文件)
- [统计信息](#统计信息)
- [变更记录](#变更记录)

---

## 概述

### 功能说明

`MessageQueuing` / `MessageCueuing` / `MessageDueuing` 是系统内部的消息队列机制，用于**异步处理业务事件**。当重要业务操作发生时，系统会将事件信息写入消息队列表，后续由定时任务或消费者处理这些消息。

### 核心特性

| 特性 | 说明 |
|------|------|
| **异步处理** | 业务操作与消息处理解耦 |
| **事件追溯** | 记录所有关键业务事件 |
| **状态管理** | 支持 0=未处理，1=已处理 |
| **重试机制** | 未处理消息可重新消费 |
| **双写模式** | Queuing + Cueing 双表写入，分别服务不同消费端 |
| **扩展预留** | Dueuing 表已建表，预留到期/延时场景，当前无调用 |

### 处理流程

```
业务操作 → 写入消息队列（status=0） → 定时任务扫描 → 执行处理 → 更新状态（status=1）
```

---

## 三表架构

系统使用三张表存储消息，结构和接口完全一致，`MessageQueuingDao` 同时负责多张表的写入：

| 表/类 | 说明 | 消费端 | 使用状态 |
|-------|------|--------|--------|
| `MessageQueuingPO` → `information.messagequeuing` | 主消息队列（主键 `mqid`） | 内部定时任务/数据同步 | ✅ 启用 |
| `MessageCueingPO` → `information.messagecueing` | 消息提示队列（主键 `mcid`） | SF/外部系统通知 | ✅ 启用 |
| `MessageDueuingPO` → `information.messagedueuing` | 消息到期队列（主键 `mdid`） | 预留：到期/延时通知 | ⚪ 预留，当前无代码调用 |

> **注意**:
> - 三个 PO 的 `init()` 方法均各自引用自身的 `STATUS_PENDING_INT`（非 `MessageQueuingPO`）。
> - `MessageQueuingDao` 接口与实现当前仅声明了对 `MessageQueuingPO` 的泛型与查询方法；`MessageCueuingPO` / `MessageDueuingPO` 通过同一个 `messageQueuingDao.save()` 写入（Hibernate 按 `@Entity` 路由到对应表）。

### 双写标记

以下场景同时写入两张表（Queuing + Cueing）：

| 场景 | Queuing Event | Cueing Event |
|------|--------------|--------------|
| 订单作废 | `CUSTOMER_STATUS_CHANGED` | `CUSTOMER_STATUS_CHANGED` |
| 订单终止 | `CUSTOMER_STATUS_CHANGED` | `CUSTOMER_STATUS_CHANGED` |
| 签合同 | `CUSTOMER_SIGNED` | `CUSTOMER_SIGNED` |
| 改签合同 | `CUSTOMER_STATUS_CHANGED` | `CUSTOMER_STATUS_CHANGED` |
| 预签合同 | `CUSTOMER_STATUS_CHANGED` | `CUSTOMER_STATUS_CHANGED` |
| 归属审批通过 | `TEAM_DESIGNER_CHANGED`/`TEAM_SALESMAN_CHANGED` | `TEAM_DESIGNER_CHANGED`/`TEAM_SALESMAN_CHANGED` |
| 转装修单 | `TRAN_DECORATION_ORDER_CHANGED` | `TRAN_DECORATION` |
| 验收通过 | `PROJECT_STATUS_CHANGED` | `PROJECT_STATUS_CHANGED` |
| 装饰收款 | — | `PAYMENT_COLLECTED`（仅Cueing） |
| 通用收款 | — | `PAYMENT_COLLECTED`（仅Cueing） |

---

## 数据结构

### 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `mqid` | BIGINT | 消息队列ID（主键，自增） |
| `orderId` | VARCHAR | 关联的装修单编号（部分场景为 null 或空字符串） |
| `operation` | VARCHAR | 操作类型 |
| `args` | TEXT | 参数（JSON格式） |
| `status` | SMALLINT | 状态：0=未处理，1=已处理 |
| `createTime` | TIMESTAMP | 创建时间 |
| `finishTime` | TIMESTAMP | 完成时间 |

### 状态常量

```java
// MessageQueuingPO.java / MessageCueuingPO.java
public static final short STATUS_PENDING_INT = 0;    // 未处理
public static final short STATUS_PROCESSED_INT = 1;   // 已处理
```

### 初始化方法

```java
// 两个PO类均有相同签名
public MessageQueuingPO init(String orderId, String operation, String args) { ... }
public MessageCueuingPO init(String orderId, String operation, String args) { ... }
```

---

## 生成场景汇总

### 一、装饰订单模块 (6个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 创建订单 | `makeDecoration` | `DECORATION_CREATED` | Queuing | `DecorationServiceImpl:1137` |
| 2 | 修改方案设计师 | `changeDecorationForAdvance` | `TEAM_PLAN_DESIGNER_CHANGED` | Queuing | `DecorationServiceImpl:1197` |
| 3 | 更新客户信息 | `changeDecorationForAdvance` | `CUSTOMER_INFO_UPDATED` | Queuing | `DecorationServiceImpl:1220` |
| 4 | 订单状态变更 | `changeDecorationForStatus` | `CUSTOMER_STATUS_CHANGED` | Queuing | `DecorationServiceImpl:1405` |
| 5 | 订单作废 | `obsoleteDecoration` | `CUSTOMER_STATUS_CHANGED` | **双写** | `DecorationServiceImpl:1485/1487` |
| 6 | 订单终止 | `terminalDecoration` | `CUSTOMER_STATUS_CHANGED` | **双写** | `DecorationServiceImpl:1622/1624` |

> 📌 v2.2 核对：6 处行号均与当前源码一致，无漂移。

### 二、合同管理模块 (3个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 签合同 | `signDecorationContract` | `CUSTOMER_SIGNED` | **双写** | `DecorationContractServiceImpl:652/654` |
| 2 | 改签合同 | `resignDecorationContract` | `CUSTOMER_STATUS_CHANGED` | **双写** | `DecorationContractServiceImpl:707/709` |
| 3 | 预签合同 | `presignDecorationContract` | `CUSTOMER_STATUS_CHANGED` | **双写** | `DecorationContractServiceImpl:793/795` |

### 三、订单归属模块 (3个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 归属转移 | `tranDecorationBelong` | `TEAM_DESIGNER_CHANGED` / `TEAM_SALESMAN_CHANGED` | Cueing | `DecorationBelongServiceImpl:252` |
| 2 | 合并归属 | `mergeDecorationBelong` | `TEAM_DESIGNER_CHANGED` / `TEAM_SALESMAN_CHANGED` | Cueing | `DecorationBelongServiceImpl:338` |
| 3 | 确认合并归属 | `confirmMergeDecorationBelong` | `TEAM_DESIGNER_CHANGED` / `TEAM_SALESMAN_CHANGED` | Cueing | `DecorationBelongServiceImpl:420` |

> 根据 `belongType` 区分：`BELONGTYPE_DESIGN_INT` → `TEAM_DESIGNER_CHANGED`，其他 → `TEAM_SALESMAN_CHANGED`
> 📌 v2.2 行号修正：328→338, 381→420

### 四、归属审批模块 (1个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 归属审批通过 | `approveForDecorationBelong` | `TEAM_DESIGNER_CHANGED` / `TEAM_SALESMAN_CHANGED` | **双写+额外** | `ApprovalDecorationBelongServiceImpl:344/345/347` |

> 审批通过写3条：2条 Queuing（1条根据belongType动态 + 1条固定TEAM_SALESMAN_CHANGED）+ 1条 Cueing（根据belongType动态）
> 📌 v2.2 行号修正：338/339/341 → 344/345/347

### 五、终端审批模块 (1个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 提交终端审批 | `submitApprovalForDecorationTerminal` | `CUSTOMER_STATUS_CHANGED` | Queuing | `ApprovalDecorationTerminalServiceImpl:155` |

### 六、收款模块 (2个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 装饰收款 | `collectDecorationPayment` | `PAYMENT_COLLECTED` | Cueing | `DecorationPaymentServiceImpl:563/570` |
| 2 | 通用收款 | `collectPayment` | `PAYMENT_COLLECTED` | Cueing | `PaymentServiceImpl:285` |

> **注意**: 原有的 `CUSTOMER_STATUS_CHANGED` 事件已被注释掉（见 `DecorationPaymentServiceImpl:692`、`PaymentServiceImpl:324`）。
> 📌 v2.2 行号修正：DecorationPayment 545/552→563/570，注释行 674→692；Payment 269→285，注释行 308→324。

### 七、客户机会模块 (5个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------:|
| 1 | 转装修单 | `changeCustomerChance` | `TRAN_DECORATION_ORDER_CHANGED` | **双写** | `CustomerChanceServiceImpl:676/679` |
| 2 | 到店确认(meet) | `meetCustomerChance` | `CUSTOMER_CHANCE_MEET` | Cueing | `CustomerChanceServiceImpl:735` |
| 3 | 客户机会下发 | `issueCustomerChance` | `CUSTOMER_CHANCE_ISSUED` | Cueing | `CustomerChanceServiceImpl:589` |
| 4 | 直转装修单 🆕 | `tranCustomerChance` | `CUSTOMER_CHANCE_ISSUED` | Cueing | `CustomerChanceServiceImpl:900` |
| 5 | 审批通过转装修单 🆕 | `tranCustomerChance` | `CUSTOMER_CHANCE_ISSUED` | Cueing | `ApprovalCustomerChanceServiceImpl:239` |

> 转装修单：Queuing 写 `TRAN_DECORATION_ORDER_CHANGED`，Cueing 写 `TRAN_DECORATION`
> 📌 v2.3 变更：
> - 新增序号 4、5（`tranCustomerChance`，Cueing，`CUSTOMER_CHANCE_ISSUED`），分别在 `CustomerChanceServiceImpl#tranCustomerChance` 和 `ApprovalCustomerChanceServiceImpl#tranCustomerChance` 末尾写入。
> - `changeCustomerChance` 双写的 args 中字段名 `originalOrderId` → **`originOrderId`**（与其他场景统一）。
> - 行号修正：701/704→676/679，760→735，614→589。

#### 🔑 customerNo 字段（customerno 映射）

本模块各场景的 args JSON 中均会包含 `customerNo` 字段，来源于 `customerchance.customerno`：

| 场景 | `customerNo` 来源 | 拼接方式 |
|------|------------------|---------|
| `changeCustomerChance`（双写） | `buildLeadnoArgs()` | `customerno` 为 null/空串时**不出现**该字段 |
| `meetCustomerChance` | `buildLeadnoArgs()` | 同上 |
| `issueCustomerChance` | `buildLeadnoArgs()` | 同上 |
| `tranCustomerChance`（直转） | `buildLeadnoArgs()` | 同上 |
| `tranCustomerChance`（审批通过转） 🆕 | **直接拼接** | 无 null 判断，**始终出现**该字段（即使值为空串） |

`buildLeadnoArgs`（`CustomerChanceServiceImpl`）实现：

```java
private String buildLeadnoArgs(CustomerChancePO customerChancePO) {
    String customerno = customerChancePO.getCustomerno();
    return (customerno != null && !customerno.isEmpty()) ? ",\"customerNo\":\"" + customerno + "\"" : "";
}
```

| 条件 | args 中的表现 |
|------|--------------|
| `customerno` 非空且非空串 | 追加 `,"customerNo":"<customerno值>"` |
| `customerno` 为 null 或空串 | **不出现** `customerNo` 字段（仅 `buildLeadnoArgs` 路径） |

**args 示例**（以 `issueCustomerChance` 为例）：

```json
{
  "ccid": 12345,
  "csid": 67890,
  "event": "CUSTOMER_CHANCE_ISSUED",
  "customerNo": "CUST20260630001"
}
```

**args 示例**（`tranCustomerChance` 直转 / 审批通过转，包含订单变更前/后编号）：

```json
{
  "ccid": 12345,
  "csid": 67890,
  "originOrderId": "DD20260630001",
  "orderId": "DD20260701001",
  "event": "CUSTOMER_CHANCE_ISSUED",
  "customerNo": "CUST20260630001"
}
```

> ⚠️ **字段命名差异**：数据库列名为 `customerno`（全小写无分隔），args JSON 中为 `customerNo`（驼峰），消费端解析时需注意此映射。
> ⚠️ **`originOrderId` vs `originalOrderId`**：v2.3 起 `changeCustomerChance` 双写场景的 args 中字段已由 `originalOrderId` 统一为 `originOrderId`，与 `tranCustomerChance` 场景一致。消费端应按 `originOrderId` 解析。
> ⚠️ **覆盖范围**：仅客户机会模块的消息携带 `customerNo`（含本模块 5 个场景的全部 6 处写入）；客户资源分配（`addCustomerLead`）、收款、施工等其他模块的 args **不含**此字段。
> ⚠️ **拼接方式差异**：`tranCustomerChance`（审批通过转，`ApprovalCustomerChanceServiceImpl:239`）采用直接拼接 `customerNo`，**不做 null/空串判断**，该字段恒出现（可能为空串）。其余 5 处走 `buildLeadnoArgs`，customerno 为空时该字段缺失。

### 八、客户资源分配模块 (4个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------:|
| 1 | 自动分配 | `addCustomerLead` | `CUSTOMER_CHANCE_AUTO_ASSIGNED` | Cueing | `CustomerSourceServiceImpl:696` |
| 2 | 分区分配 | `addCustomerLead` | `CUSTOMER_CHANCE_REGION_ASSIGNED` | Cueing | `CustomerSourceServiceImpl:741` |
| 3 | 部门分配 | `addCustomerLead` | `CUSTOMER_CHANCE_DEPT_ASSIGNED` | Cueing | `CustomerSourceServiceImpl:794` |
| 4 | 设计师分配 | `addCustomerLead` | `CUSTOMER_CHANCE_USER_ASSIGNED` | Cueing | `CustomerSourceServiceImpl:851` |

> 📌 v2.2 行号修正：669/714/767/824 → 696/741/794/851（整体后移约27行）

### 九、客户管理模块 (2个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 新增客户 | `addCustomer` | `CUSTOMER_CREATED` | Queuing | `CustomerServiceImpl:248` |
| 2 | 更新客户 | `updateCustomer` | `CUSTOMER_UPDATED` | Queuing | `CustomerServiceImpl:391` |

> orderId 为 `null`（客户不直接关联订单）

### 十、楼盘管理模块 (3个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 新增楼盘 | `addVillage` | `ESTATE_CREATED` | Queuing | `VillageServiceImpl:153` |
| 2 | 更新楼盘(含公司) | `updateVillage` | `ESTATE_UPDATED` | Queuing | `VillageServiceImpl:196` |
| 3 | 更新楼盘(不含公司) | `updateVillage` | `ESTATE_UPDATED` | Queuing | `VillageServiceImpl:308` |

> orderId 字段使用 `villagePO.getNo()`（楼盘编号）

### 十一、楼盘规则模块 (1个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 新增楼盘规则 | `addVillageRule` | `BUILDING_RULE_CREATED` / `BUILDING_RULE_DELETED` | Queuing | `VillageRuleServiceImpl:117/132` |

> orderId 为空字符串 `""`

### 十二、施工节点模块 (3个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 新增节点 | `addConstructionNode` | `NODE_CREATED` | Queuing | `ConstructionNodeServiceImpl:133` |
| 2 | 更新节点 | `updateConstructionNode` | `NODE_UPDATED` | Queuing | `ConstructionNodeServiceImpl:179` |
| 3 | 节点状态变更 | `updateConstructionNodeForStatus` | `NODE_UPDATED` | Queuing | `ConstructionNodeServiceImpl:197` |

### 十三、施工进度模块 (3个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 开工节点 | `beginConstructionSchedule` | `PROJECT_NODE_STATUS_CHANGED` | Queuing | `ConstructionScheduleServiceImpl:262` |
| 2 | 开工节点 | `beginConstructionSchedule` | `PROJECT_STATUS_CHANGED` | Queuing | `ConstructionScheduleServiceImpl:263` |
| 3 | 完工节点 | `finishConstructionSchedule` | `PROJECT_NODE_STATUS_CHANGED` | Queuing | `ConstructionScheduleServiceImpl:343` |

> 开工时同时写入两条（`PROJECT_NODE_STATUS_CHANGED` + `PROJECT_STATUS_CHANGED`）

### 十四、验收模块 (1个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------:|
| 1 | 验收通过 | `updateAcceptance` | `PROJECT_STATUS_CHANGED` | **双写** | `AcceptanceServiceImpl:156/157` |

> 验收通过同时写入 Queuing + Cueing 两条消息，event 均为 `PROJECT_STATUS_CHANGED`

### 十五、施工管理模块 (1个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 监理更换 | `updateConstruction` | `TEAM_SUPERVISOR_CHANGED` | Queuing | `ConstructionServiceImpl:233` |

### 十六、放线模块 (4个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 预处理(派监理) | `pretreatDrawLine` | `SUPERVISOR_PRE_ASSIGNED` | Queuing | `DrawLineServiceImpl:357` |
| 2 | 预处理(派监理) | `pretreatDrawLine` | `TEAM_SUPERVISOR_CHANGED` | Queuing | `DrawLineServiceImpl:358` |
| 3 | 放线成功 | `successDrawLine` | `SNAPLINE_DONE` | Queuing | `DrawLineServiceImpl:606` |
| 4 | 放线完成 | `finishDrawLine` | `DRAWLINE_FINISHED` | Queuing | `DrawLineServiceImpl:762` |

> 预处理同时写入两条（`SUPERVISOR_PRE_ASSIGNED` + `TEAM_SUPERVISOR_CHANGED`）

### 十七、施工人员模块 (2个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 添加施工人员 | `addConstructer` | `PROJECT_NODE_WORKER_ADDED` | Queuing | `ConstructerServiceImpl:177` |
| 2 | 删除施工人员 | `deleteConstructer` | `PROJECT_NODE_WORKER_REMOVED` | Queuing | `ConstructerServiceImpl:306` |

### 十八、结算入账模块 (1个场景)

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 生成入账 | `makeDecorationAccount` | `CUSTOMER_STATUS_CHANGED` | Queuing | `DecorationAccountServiceImpl:186` |

> 📌 v2.2 行号修正：146→186

### 十九、活动项模块 (1个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 活动项核销 | `consumeDecorationActivityItem` | `ACTIVITY_ITEM_VERIFIED` | Cueing | `DecorationActivityItemServiceImpl:525` |

> 📌 v2.2 行号修正：520→525

### 二十、转介绍模块 (2个场景) 🆕

| 序号 | 触发场景 | operation | event | PO类型 | 代码位置 |
|:----:|---------|-----------|-------|--------|---------|
| 1 | 添加转介绍 | `referDecorationInfo` | `REFER_ADDED` | Cueing | `DecorationInfoServiceImpl:361/383/402` |
| 2 | 删除转介绍 | `deleteReferDecorationInfo` | `REFER_DELETED` | Cueing | `DecorationInfoServiceImpl:439/459/480/501/518/534` |

> 转介绍场景区分 source（`customerSource`/`customerOrigin`/`decorationInfo`），删除转介绍最多写6条 Cueing

---

## Event 事件类型

### 全量事件列表（33种）

| Event 类型 | 说明 | PO类型 | 触发模块 |
|-----------|------|--------|---------|
| `DECORATION_CREATED` | 装饰订单创建 | Queuing | 装饰订单 |
| `CUSTOMER_STATUS_CHANGED` | 客户状态变更 | Queuing/Cueing | 装饰订单、合同、审批、结算 |
| `CUSTOMER_SIGNED` | 客户签约 | Queuing/Cueing | 合同管理 |
| `CUSTOMER_INFO_UPDATED` | 客户信息更新 | Queuing | 装饰订单 |
| `CUSTOMER_CREATED` | 客户创建 | Queuing | 客户管理 🆕 |
| `CUSTOMER_UPDATED` | 客户更新 | Queuing | 客户管理 🆕 |
| `CUSTOMER_CHANCE_MEET` | 客户机会到店确认 | Cueing | 客户机会 🆕 |
| `CUSTOMER_CHANCE_ISSUED` | 客户机会下发 | Cueing | 客户机会、客户机会审批 🆕 |
| `CUSTOMER_CHANCE_AUTO_ASSIGNED` | 客户机会自动分配 | Cueing | 客户资源 |
| `CUSTOMER_CHANCE_REGION_ASSIGNED` | 客户机会分区分配 | Cueing | 客户资源 |
| `CUSTOMER_CHANCE_DEPT_ASSIGNED` | 客户机会部门分配 | Cueing | 客户资源 |
| `CUSTOMER_CHANCE_USER_ASSIGNED` | 客户机会设计师分配 | Cueing | 客户资源 |
| `TEAM_PLAN_DESIGNER_CHANGED` | 方案设计师变更 | Queuing | 装饰订单 |
| `TEAM_DESIGNER_CHANGED` | 设计师变更 | Queuing/Cueing | 订单归属、归属审批 |
| `TEAM_SALESMAN_CHANGED` | 销售变更 | Queuing/Cueing | 订单归属、归属审批 |
| `TEAM_SUPERVISOR_CHANGED` | 监理变更 | Queuing | 施工管理、放线 🆕 |
| `SUPERVISOR_PRE_ASSIGNED` | 监理预派 | Queuing | 放线 🆕 |
| `PAYMENT_COLLECTED` | 收款 | Cueing | 收款模块 |
| `TRAN_DECORATION_ORDER_CHANGED` | 转装修单(数据同步) | Queuing | 客户机会 |
| `TRAN_DECORATION` | 转装修单(通知) | Cueing | 客户机会 🆕 |
| `ESTATE_CREATED` | 楼盘创建 | Queuing | 楼盘管理 🆕 |
| `ESTATE_UPDATED` | 楼盘更新 | Queuing | 楼盘管理 🆕 |
| `BUILDING_RULE_CREATED` | 楼盘规则创建 | Queuing | 楼盘规则 🆕 |
| `BUILDING_RULE_DELETED` | 楼盘规则删除 | Queuing | 楼盘规则 🆕 |
| `NODE_CREATED` | 施工节点创建 | Queuing | 施工节点 |
| `NODE_UPDATED` | 施工节点更新 | Queuing | 施工节点 |
| `PROJECT_NODE_STATUS_CHANGED` | 项目节点状态变更 | Queuing | 施工进度、验收 🆕 |
| `PROJECT_STATUS_CHANGED` | 项目状态变更 | Queuing/Cueing | 施工进度、验收 🆕 |
| `PROJECT_NODE_WORKER_ADDED` | 施工人员添加 | Queuing | 施工人员 🆕 |
| `PROJECT_NODE_WORKER_REMOVED` | 施工人员移除 | Queuing | 施工人员 🆕 |
| `SNAPLINE_DONE` | 放线完成 | Queuing | 放线 🆕 |
| `DRAWLINE_FINISHED` | 放线结束 | Queuing | 放线 🆕 |
| `ACTIVITY_ITEM_VERIFIED` | 活动项核销 | Cueing | 活动项 🆕 |
| `REFER_ADDED` | 添加转介绍 | Cueing | 转介绍 🆕 |
| `REFER_DELETED` | 删除转介绍 | Cueing | 转介绍 🆕 |

---

## Operation 操作类型

| Operation | 说明 | PO类型 |
|-----------|------|--------|
| `makeDecoration` | 创建订单 | Queuing |
| `changeDecorationForAdvance` | 修改订单（提前量） | Queuing |
| `changeDecorationForStatus` | 修改订单状态 | Queuing |
| `obsoleteDecoration` | 订单作废 | 双写 |
| `terminalDecoration` | 订单终止 | 双写 |
| `signDecorationContract` | 签合同 | 双写 |
| `resignDecorationContract` | 改签合同 | 双写 |
| `presignDecorationContract` | 预签合同 | 双写 |
| `tranDecorationBelong` | 归属转移 | Cueing |
| `mergeDecorationBelong` | 合并归属 | Cueing |
| `confirmMergeDecorationBelong` | 确认合并归属 | Cueing |
| `approveForDecorationBelong` | 归属审批通过 | 双写+额外 |
| `submitApprovalForDecorationTerminal` | 提交终端审批 | Queuing |
| `collectDecorationPayment` | 装饰收款 | Cueing |
| `collectPayment` | 通用收款 | Cueing |
| `changeCustomerChance` | 转装修单 | 双写 |
| `meetCustomerChance` | 到店确认 | Cueing |
| `issueCustomerChance` | 客户机会下发 | Cueing |
| `tranCustomerChance` | 直转/审批通过转装修单 | Cueing 🆕 |
| `addCustomerLead` | 客户线索分配 | Cueing |
| `addCustomer` | 新增客户 | Queuing |
| `updateCustomer` | 更新客户 | Queuing |
| `addVillage` | 新增楼盘 | Queuing |
| `updateVillage` | 更新楼盘 | Queuing |
| `addVillageRule` | 新增楼盘规则 | Queuing |
| `addConstructionNode` | 新增施工节点 | Queuing |
| `updateConstructionNode` | 更新施工节点 | Queuing |
| `updateConstructionNodeForStatus` | 更新节点状态 | Queuing |
| `beginConstructionSchedule` | 开工节点 | Queuing |
| `finishConstructionSchedule` | 完工节点 | Queuing |
| `updateAcceptance` | 验收通过 | 双写 |
| `updateConstruction` | 监理更换 | Queuing |
| `pretreatDrawLine` | 放线预处理 | Queuing |
| `successDrawLine` | 放线成功 | Queuing |
| `finishDrawLine` | 放线结束 | Queuing |
| `addConstructer` | 添加施工人员 | Queuing |
| `deleteConstructer` | 删除施工人员 | Queuing |
| `makeDecorationAccount` | 生成入账 | Queuing |
| `consumeDecorationActivityItem` | 活动项核销 | Cueing |
| `referDecorationInfo` | 添加转介绍 | Cueing |
| `deleteReferDecorationInfo` | 删除转介绍 | Cueing |

---

## 代码示例

### 基础用法

```java
// 注入 DAO
@Autowired
private MessageQueuingDao messageQueuingDao;

// 创建消息队列记录
messageQueuingDao.save(new MessageQueuingPO().init(
    orderId,                           // 订单ID
    "makeDecoration",                  // 操作类型
    "{\"orderId\":\"" + orderId + "\","
    + "\"userId\":\"" + userId + "\","
    + "\"event\":\"DECORATION_CREATED\"}"
));
```

### 双写示例

```java
// 同时写入 Queuing + Cueing
messageQueuingDao.save(new MessageQueuingPO().init(orderId, "obsoleteDecoration",
    "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"}"));
messageQueuingDao.save(new MessageCueuingPO().init(orderId, "obsoleteDecoration",
    "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"}"));
```

### 查询待处理消息

```java
// 查询所有未处理消息（status=0 且 finishTime 为空）
List<MessageQueuingPO> pendingMessages = messageQueuingDao.queryMessageQueuing();

// 按操作类型查询未处理消息
List<MessageQueuingPO> pendingByOp = messageQueuingDao.queryMessageQueuingByOperation("makeDecoration");

// 标记为已处理（status=1，写入 finishTime）
messageQueuingDao.updateMessageQueuing(mqid);
```

> 📌 v2.2 修正：原示例中的 `queryPendingMessageQueuing` / `queryPendingMessageQueuingByOperation` 方法名有误，实际 DAO 接口（`MessageQueuingDao`）方法为 `queryMessageQueuing` / `queryMessageQueuingByOperation` / `updateMessageQueuing`。`queryMessageQueuing()` 的过滤条件为 `status = STATUS_PENDING_INT(0)` 且 `finishTime is null`。

### Dueuing 表（预留）

`MessageDueuingPO`（`information.messagedueuing`，主键 `mdid`）已建表，结构与 Queuing/Cueing 一致，语义为"消息到期"。**当前全代码库无任何调用**，预留给到期/延时类通知场景。后续若启用，写入方式与 Cueing 相同：

```java
messageQueuingDao.save(new MessageDueuingPO().init(orderId, "operation", "{...\"event\":\"...\"}"));
```

---

## 相关文件

### 核心文件

| 文件路径 | 说明 |
|---------|------|
| `information/po/MessageQueuingPO.java` | 消息队列实体类（主键 `mqid`，表 `messagequeuing`） |
| `information/po/MessageCueuingPO.java` | 消息提示实体类（主键 `mcid`，表 `messagecueing`） |
| `information/po/MessageDueuingPO.java` | 消息到期实体类（主键 `mdid`，表 `messagedueuing`，预留未用） |
| `information/dao/MessageQueuingDao.java` | 消息DAO接口（多表共用，泛型为 `MessageQueuingPO`） |
| `information/dao/impl/MessageQueuingDaoImpl.java` | 消息DAO实现（含 `queryMessageQueuing` / `queryMessageQueuingByOperation` / `updateMessageQueuing`） |

### 使用模块

| 模块 | 文件 |
|------|------|
| 装饰订单 | `decoration/service/impl/DecorationServiceImpl.java` |
| 合同管理 | `decoration/service/impl/DecorationContractServiceImpl.java` |
| 订单归属 | `decoration/service/impl/DecorationBelongServiceImpl.java` |
| 装修信息 | `decoration/service/impl/DecorationInfoServiceImpl.java` |
| 活动项 | `decoration/service/impl/DecorationActivityItemServiceImpl.java` |
| 收款 | `payment/service/impl/DecorationPaymentServiceImpl.java` |
| 通用收款 | `payment/service/impl/PaymentServiceImpl.java` |
| 客户机会 | `customer/service/impl/CustomerChanceServiceImpl.java` |
| 客户机会审批 | `approval/service/impl/ApprovalCustomerChanceServiceImpl.java` 🆕 |
| 客户资源 | `customer/service/impl/CustomerSourceServiceImpl.java` |
| 客户管理 | `communion/service/impl/CustomerServiceImpl.java` |
| 楼盘管理 | `communion/service/impl/VillageServiceImpl.java` |
| 楼盘规则 | `communion/service/impl/VillageRuleServiceImpl.java` |
| 施工节点 | `data/common/service/impl/ConstructionNodeServiceImpl.java` |
| 施工进度 | `construction/service/impl/ConstructionScheduleServiceImpl.java` |
| 验收 | `construction/service/impl/AcceptanceServiceImpl.java` |
| 施工管理 | `construction/service/impl/ConstructionServiceImpl.java` |
| 放线 | `construction/service/impl/DrawLineServiceImpl.java` |
| 施工人员 | `construction/service/impl/ConstructerServiceImpl.java` |
| 结算入账 | `decoration/service/impl/DecorationAccountServiceImpl.java` |
| 归属审批 | `approval/service/impl/ApprovalDecorationBelongServiceImpl.java` |
| 终端审批 | `approval/service/impl/ApprovalDecorationTerminalServiceImpl.java` |

---

## 统计信息

### 按模块统计

| 模块 | 场景数量 | 占比 |
|------|---------|------|
| 装饰订单 | 6 | 12.0% |
| 合同管理 | 3 | 6.0% |
| 订单归属 | 3 | 6.0% |
| 归属审批 | 1 | 2.0% |
| 终端审批 | 1 | 2.0% |
| 收款 | 2 | 4.0% |
| 客户机会 | 5 | 10.0% |
| 客户资源分配 | 4 | 8.0% |
| 客户管理 | 2 | 4.0% |
| 楼盘管理 | 3 | 6.0% |
| 楼盘规则 | 1 | 2.0% |
| 施工节点 | 3 | 6.0% |
| 施工进度 | 3 | 6.0% |
| 验收 | 1 | 2.0% |
| 施工管理 | 1 | 2.0% |
| 放线 | 4 | 8.0% |
| 施工人员 | 2 | 4.0% |
| 结算入账 | 1 | 2.0% |
| 活动项 | 1 | 2.0% |
| 转介绍 | 2 | 4.0% |
| **合计** | **50** | **100%** |

### 按 PO 类型统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 仅 Queuing | ~28 | 主消息队列 |
| 仅 Cueing | ~15 | 消息提示（含 v2.3 新增 2 处 `tranCustomerChance`） |
| 双写 | ~7 | 同时写两张表 |

---

## 注意事项

### 1. 双写模式

部分场景同时写入 `MessageQueuingPO` 和 `MessageCueuingPO`，两张表结构一致但服务不同消费端。注意双写场景的 event 可能不同（如转装修单：Queuing 用 `TRAN_DECORATION_ORDER_CHANGED`，Cueing 用 `TRAN_DECORATION`）。

### 1.1 三表架构（v2.2 新增）

系统实际存在第三张表 `messagedueuing`（`MessageDueuingPO`），与 Queuing/Cueing 结构完全一致，语义为"消息到期"。**当前代码库无任何 `new MessageDueuingPO()` 调用**，属预留扩展点。`messageQueuingDao.save()` 在运行时由 Hibernate 根据传入 PO 的 `@Entity` 注解决定写入哪张表，因此三类 PO 共用一个 DAO 即可。

### 2. orderId 的多样性

- 大多数场景使用装修单编号
- 客户管理使用 `null`（客户不关联订单）
- 楼盘管理使用楼盘编号 `villagePO.getNo()`
- 楼盘规则使用空字符串 `""`

### 2.1 args 中 customerNo 字段的来源与覆盖范围（v2.2 补充）

args JSON 中的 `customerNo` 字段映射自数据库列 `customerchance.customerno`，由 `CustomerChanceServiceImpl#buildLeadnoArgs`（`CustomerChanceServiceImpl:985-988`）动态拼接：

- **仅客户机会模块**的消息会携带该字段，覆盖本模块 5 个场景共 6 处写入：`issueCustomerChance`（Cueing）、`changeCustomerChance` 双写（Queuing + Cueing）、`meetCustomerChance`（Cueing）、`tranCustomerChance` 直转（Cueing）、`tranCustomerChance` 审批通过转（Cueing）。
- 其中 5 处走 `buildLeadnoArgs`，`customerno` 为 null/空串时该字段**不出现**（消费端需按"字段可能缺失"处理）；`tranCustomerChance` 审批通过转（`ApprovalCustomerChanceServiceImpl:239`）采用直接拼接，**恒出现**该字段（可能为空串）。
- **命名差异**：DB 列 `customerno` ↔ args `customerNo`，请勿混淆。
- **字段统一**（v2.3）：`changeCustomerChance` 双写的 args 中 `originalOrderId` 已重命名为 `originOrderId`，与 `tranCustomerChance` 一致。
- 客户资源分配（`addCustomerLead` 的 4 个 ASSIGNED 事件）、收款、施工等其他模块的 args **不含** `customerNo`。

### 3. 已注释的消息

部分原有的 `CUSTOMER_STATUS_CHANGED` 消息已被注释掉（见 `DecorationPaymentServiceImpl:692`、`PaymentServiceImpl:324`），收款场景改为仅写 `PAYMENT_COLLECTED`（Cueing）。

### 4. 异步处理

消息队列主要用于**异步通知**，不应影响主业务流程的执行结果。

---

## 变更记录

### v2.3 (2026-07-03)

**新增场景（`tranCustomerChance` operation）：**
- 客户机会模块新增 2 处 Cueing 写入，event 均为 `CUSTOMER_CHANCE_ISSUED`：
  - `CustomerChanceServiceImpl:900`（`tranCustomerChance` 方法：客户机会直接转装修单）
  - `ApprovalCustomerChanceServiceImpl:239`（审批通过后转装修单）
- 两处 args 中均携带 `originOrderId`（变更前订单号）、`orderId`（变更后订单号）、`ccid`、`csid`、`event`、`customerNo`。
- 区别：前者通过 `buildLeadnoArgs` 拼接 `customerNo`（customerno 为空时缺失）；后者直接拼接，**恒出现** `customerNo`（可能为空串）。
- 新增"客户机会审批"模块到「使用模块」清单（`ApprovalCustomerChanceServiceImpl.java`）。

**字段重命名：**
- `changeCustomerChance` 双写（Queuing + Cueing）的 args 中，`originalOrderId` → **`originOrderId`**，与 `tranCustomerChance` 场景统一。消费端需相应调整解析键名。

**行号同步：**
- 客户机会模块（CustomerChanceServiceImpl）：671/674→676/679，730→735，584→589。

**统计更新：** 场景数 48 → 50（客户机会 3→5），事件类型维持 33 种（`CUSTOMER_CHANCE_ISSUED` 触发点扩展到客户机会审批模块），Cueing 写入 13→15。

### v2.2.1 (2026-06-30)

**字段重命名：**
- `customerchance` 表列名 `leadno` 重命名为 `customerno`，对应 Java 字段 / getter / setter 一并更新（`CustomerChancePO`、`CustomerChanceVO`、`A20260103Action` 调用处）。
- 消息队列 `customerNo` 字段的来源由 `customerchance.leadno` 改为 `customerchance.customerno`（args JSON 中的 `customerNo` 键名不变）。
- 前端 `WebContent/js/customer/customerChance.js` 列定义 `leadno` 改为 `customerno`。
- 同步执行 SQL 脚本：`sql/rename_customerchance_leadno_to_customerno.sql`。
- `buildLeadnoArgs` 私有方法名作为内部实现细节保留，未改名。

### v2.2 (2026-06-30)

**架构变更：**
- 新增第三张表 `information.messagedueuing`（`MessageDueuingPO`，主键 `mdid`，语义"消息到期"）的说明。当前全代码库无调用，属预留扩展。
- "双表架构"章节升级为"三表架构"，标注各表使用状态（Queuing/Cueing 启用、Dueuing 预留）。
- 补充说明：`MessageQueuingDao` 接口泛型为 `MessageQueuingPO`，Cueing/Dueuing 通过同一 `messageQueuingDao.save()` 经 Hibernate `@Entity` 路由写入。

**代码示例修正：**
- 修正查询示例中的错误方法名：`queryPendingMessageQueuing` → `queryMessageQueuing`，`queryPendingMessageQueuingByOperation` → `queryMessageQueuingByOperation`，新增 `updateMessageQueuing` 示例。
- 补充 `queryMessageQueuing()` 的实际过滤条件说明（`status=0` 且 `finishTime is null`）。
- 新增 Dueuing 表的预留写入示例。

**行号同步（基于当前源码核对）：**
- 订单归属模块（DecorationBelongServiceImpl）：328→338，381→420
- 归属审批模块（ApprovalDecorationBelongServiceImpl）：338/339/341 → 344/345/347
- 收款模块（DecorationPaymentServiceImpl）：545/552→563/570，注释行 674→692
- 收款模块（PaymentServiceImpl）：269→285，注释行 308→324
- 客户机会模块（CustomerChanceServiceImpl）：701/704→671/674，760→730，614→584
- 客户资源分配模块（CustomerSourceServiceImpl）：669/714/767/824 → 696/741/794/851
- 结算入账模块（DecorationAccountServiceImpl）：146→186
- 活动项模块（DecorationActivityItemServiceImpl）：520→525
- 装饰订单 / 合同 / 客户管理 / 楼盘 / 楼盘规则 / 施工节点 / 施工进度 / 验收 / 施工管理 / 放线 / 施工人员 / 转介绍：行号无变化，已逐一核对一致。

**统计：** 场景数维持 48 个，事件类型维持 33 种（本次仅同步行号与架构说明，未发现新增/删除调用点）。

**customerNo 字段说明补充：**
- 在「七、客户机会模块」新增 `customerNo 字段（leadno 映射）` 小节，说明 `buildLeadnoArgs`（`CustomerChanceServiceImpl:985-988`）的拼接逻辑、null/空串时不出现该字段的规则、args 示例。
- 在「注意事项」新增 2.1 条，标注该字段的覆盖范围（仅客户机会模块 4 处消息）、命名差异（DB `leadno` ↔ args `customerNo`）、其他模块不含此字段。
- 顺带修正注意事项 3 中遗留的旧行号（`DecorationPaymentServiceImpl:674`→692、`PaymentServiceImpl:308`→324）。

### v2.1 (2026-05-08)

**新增场景：**
- 客户机会模块：新增 `issueCustomerChance`（CUSTOMER_CHANCE_ISSUED），Cueing 类型，位于 `CustomerChanceServiceImpl:614`

**PO 类型修正：**
- 客户资源分配模块：4个场景全部从 Queuing 修正为 Cueing（实际使用 `MessageCueuingPO`）
- 验收模块：从 Queuing 修正为双写（Queuing + Cueing），event 统一为 `PROJECT_STATUS_CHANGED`
- Event 列表：CUSTOMER_CHANCE_AUTO/REGION/DEPT/USER_ASSIGNED 从 Queuing 修正为 Cueing
- Operation 列表：`addCustomerLead` 从 Queuing 修正为 Cueing，`updateAcceptance` 从 Queuing 修正为双写

**行号修正：**
- 装饰订单模块（DecorationServiceImpl）：1133→1137, 1193→1197, 1216→1220, 1401→1405, 1481/1483→1485/1487, 1618/1620→1622/1624
- 订单归属模块（DecorationBelongServiceImpl）：246→252, 322→328, 375→381
- 归属审批模块（ApprovalDecorationBelongServiceImpl）：331/332/334→338/339/341
- 客户机会模块（CustomerChanceServiceImpl）：更新为 701/704, 760, 新增 614
- 客户管理模块（CustomerServiceImpl）：246→248, 387→391
- 验收模块（AcceptanceServiceImpl）：155/156→156/157

**双写标记更新：**
- 新增「验收通过」双写标记（PROJECT_STATUS_CHANGED）

**统计更新：** 47 → 48 个场景，32 → 33 种事件

### v2.0 (2026-05-02)

**架构变更：**
- 新增双表架构说明（Queuing + Cueing）
- 新增双写标记（标识同时写入两张表的场景）
- 明确 Cueing 表用于 SF/外部系统通知

**新增模块（11个）：**
- 客户管理（CUSTOMER_CREATED/UPDATED）
- 楼盘管理（ESTATE_CREATED/UPDATED）
- 楼盘规则（BUILDING_RULE_CREATED/DELETED）
- 施工进度（PROJECT_NODE_STATUS_CHANGED/PROJECT_STATUS_CHANGED）
- 验收（PROJECT_STATUS_CHANGED）
- 施工管理（TEAM_SUPERVISOR_CHANGED）
- 放线（SUPERVISOR_PRE_ASSIGNED/SNAPLINE_DONE/DRAWLINE_FINISHED）
- 施工人员（PROJECT_NODE_WORKER_ADDED/REMOVED）
- 活动项（ACTIVITY_ITEM_VERIFIED）
- 转介绍（REFER_ADDED/REFER_DELETED）
- 客户资源分配（CUSTOMER_CHANCE_AUTO/REGION/DEPT/USER_ASSIGNED）

**变更模块：**
- 收款模块：原有 Queuing CUSTOMER_STATUS_CHANGED 已注释，改为仅 Cueing PAYMENT_COLLECTED
- 客户机会：新增 meetCustomerChance（CUSTOMER_CHANCE_MEET），changeCustomerChance 改为双写
- 订单归属：从 Queuing 改为 Cueing，新增 mergeDecorationBelong/confirmMergeDecorationBelong
- 合同管理：所有场景改为双写
- 装饰订单：作废/终止改为双写
- 归属审批：改为双写+额外（写3条）

**新增事件类型（22种）：**
CUSTOMER_CREATED, CUSTOMER_UPDATED, CUSTOMER_CHANCE_MEET, CUSTOMER_CHANCE_AUTO_ASSIGNED, CUSTOMER_CHANCE_REGION_ASSIGNED, CUSTOMER_CHANCE_DEPT_ASSIGNED, CUSTOMER_CHANCE_USER_ASSIGNED, TEAM_SUPERVISOR_CHANGED, SUPERVISOR_PRE_ASSIGNED, TRAN_DECORATION_ORDER_CHANGED, TRAN_DECORATION, ESTATE_CREATED, ESTATE_UPDATED, BUILDING_RULE_CREATED, BUILDING_RULE_DELETED, PROJECT_NODE_STATUS_CHANGED, PROJECT_STATUS_CHANGED, PROJECT_NODE_WORKER_ADDED, PROJECT_NODE_WORKER_REMOVED, SNAPLINE_DONE, DRAWLINE_FINISHED, ACTIVITY_ITEM_VERIFIED, REFER_ADDED, REFER_DELETED

**统计：** 从 19 个场景 → 47 个场景，从 10 种事件 → 32 种事件，从 9 个模块 → 20 个模块

> v2.1 更新后：48 个场景，33 种事件（新增 CUSTOMER_CHANCE_ISSUED）

### v1.0 (2026-04-10)

- 初始版本
- 汇总 19 个消息队列生成场景
- 整理 Event 事件类型和 Operation 操作类型
