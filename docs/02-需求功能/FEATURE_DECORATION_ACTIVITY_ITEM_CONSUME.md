# 装修活动物品核销功能

## 功能概述

为 `decorationActivityItem` 新增核销（consume）功能，支持将初始状态的活动物品直接核销。

## 状态流转

```
初始(0) ──consume──→ 核销(10)
```

## 接口说明

### 端点

`POST /consumeDecorationActivityItem.do`

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| decorationActivityItem.daiId | long | 是 | 活动物品ID |

### 请求示例

```json
{
  "decorationActivityItem": {
    "daiId": 12345
  }
}
```

### 响应

标准 JSON 响应：

```json
{
  "code": 200,
  "message": "操作成功"
}
```

### 错误码

| 错误码 | 错误信息 | 说明 |
|--------|---------|------|
| 140030 | 装修活动物品不存在 | daiId 对应的记录不存在 |
| 140057 | 装修活动奖品不可操作 | 当前状态不是初始(0) |
| 140013 | 订单不存在 | 关联的装修订单不存在 |

## 业务逻辑

1. 根据 `daiId` 通过 `dao.get()` 获取活动物品 PO
2. 校验当前状态必须为 **初始(0)**，否则抛出异常
3. 查询关联的装修订单，校验订单存在
4. 更新状态为 **核销(10)**
5. 记录操作人（receiver）和操作时间（receiveTime）
6. 创建活动记录（DecorationActivityRecordPO）
7. 调用 `subDecorationForCut()` 重算订单活动金额

## 代码改动

### PO 层

**文件**: `src/com/fanglin/decoration/po/DecorationActivityItemPO.java`

新增常量：

```java
public static final short STATUS_VERIFY_INT = 10; // 核销
```

### Service 接口层

**文件**: `src/com/fanglin/decoration/service/DecorationActivityItemService.java`

新增方法：

```java
public int consumeDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;
```

### Service 实现层

**文件**: `src/com/fanglin/decoration/service/impl/DecorationActivityItemServiceImpl.java`

新增 `consumeDecorationActivityItem` 方法实现，参照 `discountDecorationActivityItem` 模式。

### Action 层

**文件**: `src/com/fanglin/decoration/action/DecorationActivityItemAction.java`

新增方法：

```java
@Action(value = "consumeDecorationActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
public String consumeDecorationActivityItem() throws FLException {
    decorationActivityItemService.consumeDecorationActivityItem(decorationActivityItem, queryUserId());
    return SUCCESS;
}
```

## 数据库变更

在 `communion.constant` 表插入核销状态常量：

```sql
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, `value`, status)
VALUES ('核销(装修活动状态)', 'decoration', 'decorationActivityItem', 'status', 'STATUS_VERIFY_INT', 10, '核销', 0);
```

> 注意：需要在生产环境和测试环境分别执行此 SQL。
