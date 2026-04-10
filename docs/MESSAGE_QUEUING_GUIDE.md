# MessageQueuing 消息队列使用指南

> **版本**: v1.0
> **更新日期**: 2026-04-10
> **表名**: `information.messagequeuing`

---

## 目录

- [概述](#概述)
- [数据结构](#数据结构)
- [生成场景汇总](#生成场景汇总)
- [Event 事件类型](#event-事件类型)
- [Operation 操作类型](#operation-操作类型)
- [代码示例](#代码示例)
- [相关文件](#相关文件)

---

## 概述

### 功能说明

`MessageQueuing` 是系统内部的消息队列机制，用于**异步处理业务事件**。当重要业务操作发生时，系统会将事件信息写入消息队列表，后续由定时任务或消费者处理这些消息。

### 核心特性

| 特性 | 说明 |
|------|------|
| **异步处理** | 业务操作与消息处理解耦 |
| **事件追溯** | 记录所有关键业务事件 |
| **状态管理** | 支持 0=未处理，1=已处理 |
| **重试机制** | 未处理消息可重新消费 |

### 处理流程

```
业务操作 → 写入消息队列（status=0） → 定时任务扫描 → 执行处理 → 更新状态（status=1）
```

---

## 数据结构

### 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `mqid` | BIGINT | 消息队列ID（主键，自增） |
| `orderId` | VARCHAR | 关联的装修单编号 |
| `operation` | VARCHAR | 操作类型 |
| `args` | TEXT | 参数（JSON格式） |
| `status` | SMALLINT | 状态：0=未处理，1=已处理 |
| `createTime` | TIMESTAMP | 创建时间 |
| `finishTime` | TIMESTAMP | 完成时间 |

### 状态常量

```java
// MessageQueuingPO.java
public static final short STATUS_PENDING_INT = 0;    // 未处理
public static final short STATUS_PROCESSED_INT = 1;   // 已处理
```

### 初始化方法

```java
// MessageQueuingPO.java
public MessageQueuingPO init(String orderId, String operation, String args) {
    setOrderId(orderId);
    setOperation(operation);
    setArgs(args);
    setCreateTime(new java.sql.Timestamp(System.currentTimeMillis()));
    setStatus(STATUS_PENDING_INT);
    return this;
}
```

---

## 生成场景汇总

### 一、装饰订单模块 (6个场景)

| 序号 | 触发场景 | operation | event | 代码位置 |
|:----:|---------|-----------|-------|---------|
| 1 | 创建订单 | `makeDecoration` | `DECORATION_CREATED` | `DecorationServiceImpl:1132` |
| 2 | 修改方案设计师 | `changeDecorationForAdvance` | `TEAM_PLAN_DESIGNER_CHANGED` | `DecorationServiceImpl:1192` |
| 3 | 更新客户信息 | `changeDecorationForAdvance` | `CUSTOMER_INFO_UPDATED` | `DecorationServiceImpl:1215` |
| 4 | 订单状态变更 | `changeDecorationForStatus` | `CUSTOMER_STATUS_CHANGED` | `DecorationServiceImpl:1400` |
| 5 | 订单作废 | `obsoleteDecoration` | `CUSTOMER_STATUS_CHANGED` | `DecorationServiceImpl:1480` |
| 6 | 订单终止 | `terminalDecoration` | `CUSTOMER_STATUS_CHANGED` | `DecorationServiceImpl:1617` |

### 二、合同管理模块 (3个场景)

| 序号 | 触发场景 | operation | event | 代码位置 |
|:----:|---------|-----------|-------|---------|
| 1 | 签合同 | `signDecorationContract` | `CUSTOMER_SIGNED` | `DecorationContractServiceImpl:652` |
| 2 | 改签合同 | `resignDecorationContract` | `CUSTOMER_STATUS_CHANGED` | `DecorationContractServiceImpl:707` |
| 3 | 预签合同 | `presignDecorationContract` | `CUSTOMER_STATUS_CHANGED` | `DecorationContractServiceImpl:793` |

### 三、订单归属模块 (1个场景)

| 序号 | 触发场景 | operation | event | 代码位置 |
|:----:|---------|-----------|-------|---------|
| 1 | 归属转移 | `tranDecorationBelong` | `TEAM_DESIGNER_CHANGED` / `TEAM_SALESMAN_CHANGED` | `DecorationBelongServiceImpl:244` |

**说明**: 根据 `belongType` 区分：
- `BELONGTYPE_DESIGN_INT` → `TEAM_DESIGNER_CHANGED`
- 其他 → `TEAM_SALESMAN_CHANGED`

### 四、归属审批模块 (1个场景)

| 序号 | 触发场景 | operation | event | 代码位置 |
|:----:|---------|-----------|-------|---------|
| 1 | 归属审批通过 | `approveForDecorationBelong` | `TEAM_DESIGNER_CHANGED` / `TEAM_SALESMAN_CHANGED` | `ApprovalDecorationBelongServiceImpl:308` |

### 五、终端审批模块 (1个场景)

| 序号 | 触发场景 | operation | event | 代码位置 |
|:----:|---------|-----------|-------|---------|
| 1 | 提交终端审批 | `submitApprovalForDecorationTerminal` | `CUSTOMER_STATUS_CHANGED` | `ApprovalDecorationTerminalServiceImpl:155` |

### 六、收款模块 (2个场景)

| 序号 | 触发场景 | operation | event | 代码位置 |
|:----:|---------|-----------|-------|---------|
| 1 | 装饰收款 | `collectDecorationPayment` | `PAYMENT_COLLECTED` | `DecorationPaymentServiceImpl:544` |
| 2 | 通用收款 | `collectPayment` | `PAYMENT_COLLECTED` | `PaymentServiceImpl:256` |

### 七、客户资源模块 (1个场景)

| 序号 | 触发场景 | operation | 说明 | 代码位置 |
|:----:|---------|-----------|------|---------|
| 1 | 转装修单 | `changeCustomerChance` | 转装饰订单 | `CustomerChanceServiceImpl:691` |

### 八、施工节点模块 (3个场景)

| 序号 | 触发场景 | operation | event | 代码位置 |
|:----:|---------|-----------|-------|---------|
| 1 | 新增节点 | `addConstructionNode` | `NODE_CREATED` | `ConstructionNodeServiceImpl:133` |
| 2 | 更新节点 | `updateConstructionNode` | `NODE_UPDATED` | `ConstructionNodeServiceImpl:179` |
| 3 | 节点状态变更 | `updateConstructionNodeForStatus` | `NODE_UPDATED` | `ConstructionNodeServiceImpl:197` |

### 九、结算入账模块 (1个场景)

| 序号 | 触发场景 | operation | event | 代码位置 |
|:----:|---------|-----------|-------|---------|
| 1 | 生成入账 | `makeDecorationAccount` | `CUSTOMER_STATUS_CHANGED` | `DecorationAccountServiceImpl:145` |

---

## Event 事件类型

| Event 类型 | 说明 | 触发模块 |
|-----------|------|---------|
| `DECORATION_CREATED` | 装饰订单创建 | 装饰订单 |
| `CUSTOMER_STATUS_CHANGED` | 客户状态变更 | 装饰订单、合同、审批、结算 |
| `CUSTOMER_SIGNED` | 客户签约 | 合同管理 |
| `CUSTOMER_INFO_UPDATED` | 客户信息更新 | 装饰订单 |
| `TEAM_PLAN_DESIGNER_CHANGED` | 方案设计师变更 | 装饰订单 |
| `TEAM_DESIGNER_CHANGED` | 设计师变更 | 订单归属、归属审批 |
| `TEAM_SALESMAN_CHANGED` | 销售变更 | 订单归属、归属审批 |
| `PAYMENT_COLLECTED` | 收款 | 收款模块 |
| `NODE_CREATED` | 施工节点创建 | 施工节点 |
| `NODE_UPDATED` | 施工节点更新 | 施工节点 |

---

## Operation 操作类型

| Operation | 说明 | 关键方法 |
|-----------|------|---------|
| `makeDecoration` | 创建订单 | `DecorationServiceImpl.makeDecoration()` |
| `changeDecorationForAdvance` | 修改订单（提前量） | `DecorationServiceImpl.changeDecorationForAdvance()` |
| `changeDecorationForStatus` | 修改订单状态 | `DecorationServiceImpl.changeDecorationForStatus()` |
| `obsoleteDecoration` | 订单作废 | `DecorationServiceImpl.obsoleteDecoration()` |
| `terminalDecoration` | 订单终止 | `DecorationServiceImpl.terminalDecoration()` |
| `signDecorationContract` | 签合同 | `DecorationContractServiceImpl.signDecorationContract()` |
| `resignDecorationContract` | 改签合同 | `DecorationContractServiceImpl.resignDecorationContract()` |
| `presignDecorationContract` | 预签合同 | `DecorationContractServiceImpl.presignDecorationContract()` |
| `tranDecorationBelong` | 归属转移 | `DecorationBelongServiceImpl.tranDecorationBelong()` |
| `approveForDecorationBelong` | 归属审批通过 | `ApprovalDecorationBelongServiceImpl.approve()` |
| `submitApprovalForDecorationTerminal` | 提交终端审批 | `ApprovalDecorationTerminalServiceImpl.submit()` |
| `collectDecorationPayment` | 装饰收款 | `DecorationPaymentServiceImpl.collect()` |
| `collectPayment` | 通用收款 | `PaymentServiceImpl.collect()` |
| `changeCustomerChance` | 转装修单 | `CustomerChanceServiceImpl.change()` |
| `addConstructionNode` | 新增施工节点 | `ConstructionNodeServiceImpl.add()` |
| `updateConstructionNode` | 更新施工节点 | `ConstructionNodeServiceImpl.update()` |
| `updateConstructionNodeForStatus` | 更新节点状态 | `ConstructionNodeServiceImpl.updateStatus()` |
| `makeDecorationAccount` | 生成入账 | `DecorationAccountServiceImpl.make()` |

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
    "{\"orderId\":\"" + orderId + "\"," // 参数JSON
    + "\"userId\":\"" + userId + "\","
    + "\"event\":\"DECORATION_CREATED\"}"
));
```

### 完整示例：创建订单时发送消息

```java
// DecorationServiceImpl.java:1132
@Override
public DecorationVO makeDecoration(DecorationVO decorationVO, String userId) throws FLException {
    // ... 业务逻辑 ...

    // 创建订单后写入消息队列
    messageQueuingDao.save(new MessageQueuingPO().init(
        orderId,
        "makeDecoration",
        "{\"orderId\":\"" + orderId + "\","
        + "\"userId\":\"" + userId + "\","
        + "\"event\":\"DECORATION_CREATED\""
        + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "")
        + "}"
    ));

    return decorationVO;
}
```

### 带业务类型的消息

```java
// 大多数消息会携带 busiTypeName（业务类型名称）
messageQueuingDao.save(new MessageQueuingPO().init(
    orderId,
    "changeDecorationForStatus",
    "{\"orderId\":\"" + orderId + "\","
    + "\"status\":" + status + ","
    + "\"userId\":\"" + userId + "\","
    + "\"event\":\"CUSTOMER_STATUS_CHANGED\""
    + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "")
    + "}"
));
```

### 查询待处理消息

```java
// MessageQueuingDao.java
// 查询所有待处理消息
List<MessageQueuingPO> pendingMessages = messageQueuingDao.queryPendingMessageQueuing();

// 按操作类型查询待处理消息
List<MessageQueuingPO> pendingByOperation = messageQueuingDao.queryPendingMessageQueuingByOperation("makeDecoration");
```

### 更新消息状态

```java
// 标记为已处理
messageQueuingDao.updateMessageQueuingStatusProcessed(mqid);
```

---

## 相关文件

### 核心文件

| 文件路径 | 说明 |
|---------|------|
| `src/com/fanglin/information/po/MessageQueuingPO.java` | 消息队列实体类 |
| `src/com/fanglin/information/dao/MessageQueuingDao.java` | 消息队列DAO接口 |
| `src/com/fanglin/information/dao/impl/MessageQueuingDaoImpl.java` | 消息队列DAO实现 |
| `src/com/fanglin/information/vo/MessageQueuingVO.java` | 消息队列VO |

### 使用模块

| 模块 | 文件 |
|------|------|
| 装饰订单 | `decoration/service/impl/DecorationServiceImpl.java` |
| 合同管理 | `decoration/service/impl/DecorationContractServiceImpl.java` |
| 订单归属 | `decoration/service/impl/DecorationBelongServiceImpl.java` |
| 收款 | `payment/service/impl/DecorationPaymentServiceImpl.java` |
| 施工节点 | `data/common/service/impl/ConstructionNodeServiceImpl.java` |
| 结算入账 | `decoration/service/impl/DecorationAccountServiceImpl.java` |
| 客户资源 | `customer/service/impl/CustomerChanceServiceImpl.java` |
| 归属审批 | `approval/service/impl/ApprovalDecorationBelongServiceImpl.java` |
| 终端审批 | `approval/service/impl/ApprovalDecorationTerminalServiceImpl.java` |

---

## 统计信息

| 模块 | 场景数量 | 占比 |
|------|---------|------|
| 装饰订单 | 6 | 31.6% |
| 合同管理 | 3 | 15.8% |
| 施工节点 | 3 | 15.8% |
| 收款 | 2 | 10.5% |
| 订单归属 | 1 | 5.3% |
| 归属审批 | 1 | 5.3% |
| 终端审批 | 1 | 5.3% |
| 客户资源 | 1 | 5.3% |
| 结算入账 | 1 | 5.3% |
| **合计** | **19** | **100%** |

---

## 注意事项

### 1. 双写模式

代码中发现部分场景有**双写**操作（可能是历史遗留）：

```java
// 部分场景会同时写入 MessageQueuingPO 和 MessageCueuingPO
messageQueuingDao.save(new MessageQueuingPO().init(...));
messageQueuingDao.save(new MessageCueuingPO().init(...));  // 注意拼写 Cueuing vs Queuing
```

**建议**: 确认 `MessageCueuingPO` 的用途，避免重复写入。

### 2. 业务类型携带

大多数消息会携带 `busiTypeName` 字段（业务类型名称）：

```java
(decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "")
```

### 3. 状态管理

- 新消息默认 `status = 0`（未处理）
- 处理完成后需调用 `updateMessageQueuingStatusProcessed()` 更新状态

### 4. 异步处理

消息队列主要用于**异步通知**，不应影响主业务流程的执行结果。

---

## 变更记录

### v1.0 (2026-04-10)

- 初始版本
- 汇总 19 个消息队列生成场景
- 整理 Event 事件类型和 Operation 操作类型
- 添加代码示例
- 补充相关文件清单
