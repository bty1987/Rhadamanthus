# MessageCueuing / MessageDueing 事件类型

> 创建时间：2026-01-28
> 用途：记录消息提示/消息到期数据生成的事件类型

---

## 一、MessageCueuing（消息提示）事件类型

### 事件类型清单

| event 类型 | 说明 | 触发场景 |
|-----------|------|----------|
| `CUSTOMER_SIGNED` | 客户签约 | 签约 |
| `CUSTOMER_STATUS_CHANGED` | 客户状态变更 | 重签、预签、退单、废单 |
| `PAYMENT_COLLECTED` | 款项已收取 | 定金收款、预付款收款、设计费收款 |
| `TEAM_DESIGNER_CHANGED` | 设计师变更 | 订单归属审批通过/转移 (设计师) |
| `TEAM_SALESMAN_CHANGED` | 业务员变更 | 订单归属审批通过/转移 (业务员) |

### 按操作分类

| 操作 | event | 代码位置 |
|------|-------|---------|
| 签约 | `CUSTOMER_SIGNED` | DecorationContractServiceImpl.signDecorationContract |
| 重签 | `CUSTOMER_STATUS_CHANGED` | DecorationContractServiceImpl.resignDecorationContract |
| 预签 | `CUSTOMER_STATUS_CHANGED` | DecorationContractServiceImpl.presignDecorationContract |
| 退单 | `CUSTOMER_STATUS_CHANGED` | DecorationServiceImpl.terminalDecoration |
| 废单 | `CUSTOMER_STATUS_CHANGED` | DecorationServiceImpl.obsoleteDecoration |
| 定金收款 | `PAYMENT_COLLECTED` | DecorationPaymentServiceImpl.collectDecorationPayment (status INIT→DEPOSIT) |
| 预付款收款 | `PAYMENT_COLLECTED` | PaymentServiceImpl.collectPayment (status INIT→DEPOSIT) |
| 设计费收款 | `PAYMENT_COLLECTED` | DecorationPaymentServiceImpl.collectDecorationPayment (paymentType=设计费) |
| 归属审批通过 | `TEAM_DESIGNER_CHANGED` / `TEAM_SALESMAN_CHANGED` | ApprovalDecorationBelongServiceImpl.approveForDecorationBelong |
| 归属转移 | `TEAM_DESIGNER_CHANGED` / `TEAM_SALESMAN_CHANGED` | DecorationBelongServiceImpl.tranDecorationBelong |

---

## 二、MessageDueing（消息到期）事件类型

### 事件类型清单

| operation 类型 | 说明 | 触发场景 |
|---------------|------|----------|
| `addVillage` | 创建楼盘 | 创建楼盘时 |
| `updateVillage` | 更新楼盘 | 更新楼盘时 |

### 代码位置

| 操作 | operation | 代码位置 |
|------|-----------|---------|
| 创建楼盘 | `addVillage` | VillageServiceImpl.addVillage |
| 更新楼盘 | `updateVillage` | VillageServiceImpl.updateVillage |

---

## 三、数据格式

### MessageCueuing 数据示例

```json
{
  "orderId": "D202512010001",
  "userId": "U00001",
  "event": "CUSTOMER_SIGNED",
  "busiTypeName": "整装"
}
```

### MessageDueing 数据示例

```json
{
  "no": "P-00001",
  "name": "测试楼盘",
  "vid": 12345,
  "company": 1
}
```

---

## 四、创建代码模板

### MessageCueuing 创建模板

```java
// 生成消息提示数据
messageQueuingDao.save(new MessageCueuingPO().init(
    orderId,                              // 订单ID
    "operationName",                      // 操作名称
    "{\"orderId\":\"" + orderId + "\","   // JSON格式参数
    "\"userId\":\"" + userId + "\","
    "\"event\":\"EVENT_TYPE\"" +
    (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") +
    "}"
));
```

### MessageDueing 创建模板

```java
// 生成消息到期数据
messageQueuingDao.save(new MessageDueingPO().init(
    villageNo,                            // 楼盘编号
    "operationName",                      // 操作名称
    "{\"no\":\"" + villageNo + "\","      // JSON格式参数
    "\"name\":\"" + villageName + "\","
    "\"vid\":" + villageId + ","
    "\"company\":" + company +
    "}"
));
```

---

## 五、相关文件

| 文件 | 路径 |
|------|------|
| MessageCueuingPO.java | `src/com/fanglin/information/po/MessageCueuingPO.java` |
| MessageCueuingVO.java | `src/com/fanglin/information/vo/MessageCueuingVO.java` |
| MessageDueingPO.java | `src/com/fanglin/information/po/MessageDueingPO.java` |
| MessageDueingVO.java | `src/com/fanglin/information/vo/MessageDueingVO.java` |
| 建表语句 | `sql/create_information_messagecueuing.sql` |
| 建表语句 | `sql/create_information_messagedueuing.sql` |
| MessageQueuingDao | `src/com/fanglin/information/dao/MessageQueuingDao.java` |

---

## 六、变更记录

| 日期 | 提交 | 说明 |
|------|------|------|
| 2026-01-28 | xxxxxxxx | 重构款项收款事件类型为 PAYMENT_COLLECTED |
| 2026-01-28 | b7a2288a | 订单归属转移时生成消息提示数据 |
| 2026-01-28 | 7c161925 | 订单归属审批通过时生成消息提示数据 |
| 2026-01-28 | e3fdfd4a | 创建/更新楼盘时生成消息到期数据 |
| 2026-01-28 | f071199a | 预付款收款时订单状态变更为定金生成消息提示 |
| 2026-01-28 | 6d7097d2 | 设计费收款时生成消息提示 |
| 2026-01-28 | 3769209d | 添加订单状态变更消息提示数据生成 |
