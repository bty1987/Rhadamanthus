# MemberAction 接口文档

**类路径**: `com.fanglin.customer.action.MemberAction`
**Controller 名称**: `CusMemberAction`
**继承**: `BaseListAction` → `BaseAction`
**命名空间**: `/`
**最后更新**: 2026-04-02

---

## 接口总览

| # | 接口名称 | URL | 方法 | 功能说明 |
|---|---------|-----|------|---------|
| 1 | queryMemberByPhone | `/queryMemberByPhone.do` | POST | 根据手机号查询会员信息 |
| 2 | queryMemberPoint | `/queryMemberPoint.do` | POST | 查询会员积分 |
| 3 | addMemberActivity | `/addMemberActivity.do` | POST | 添加会员活动 |
| 4 | makeMemberOrder | `/makeMemberOrder.do` | POST | 创建积分兑换订单（批量商品） |
| 5 | cancelMemberOrder | `/cancelMemberOrder.do` | POST | 取消积分兑换订单 |
| 6 | makeMemberOrderItem | `/makeMemberOrderItem.do` | POST | 兑换单个商品（追加到订单） |
| 7 | cancelMemberOrderItem | `/cancelMemberOrderItem.do` | POST | 取消单个兑换商品 |
| 8 | updateMemberGoods | `/updateMemberGoods.do` | POST | 更新/新增会员商品 |
| 9 | queryMemberForInfo | `/queryMemberForInfo.do` | POST | 查询会员详情(按公司，仅返回关联订单) |

---

## 数据模型

### MemberVO — 会员信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `uniqueId` | String | 唯一标识。主订单: `doid`；关联订单: `parentDoid-doid` |
| `orderId` | String | 装修订单号 |
| `referOrderId` | String | 主订单号（关联订单指向主订单） |
| `phone` | String | 手机号 |
| `designerPhone` | String | 设计师电话 |
| `supervisorPhone` | String | 督导电话 |
| `desigerId` | String | 设计师 ID |
| `designer` | String | 设计师姓名 |
| `supervisorId` | String | 督导 ID |
| `supervisor` | String | 督导姓名 |
| `storeTime` | Timestamp | 到店时间 (`yyyy-MM-dd HH:mm:ss`) |
| `contractTime` | Timestamp | 签约时间 (`yyyy-MM-dd HH:mm:ss`) |
| `paySacle` | Short | 付款比例 |
| `status` | Short | 状态 |
| `company` | String | 所属公司 |
| `activityItemCount` | Integer | 活动项目数量 |

### MemberPointVO — 会员积分

| 字段 | 类型 | 说明 |
|------|------|------|
| `orderId` | String | 装修订单号 |
| `decorationPoint` | Long | 装修积分（可用） |
| `freezeDecorationPoint` | Long | 冻结装修积分 |
| `materialPoint` | Long | 主材积分（可用） |
| `freezeMaterialPoint` | Long | 冻结主材积分 |
| `operatePoint` | Long | 运营积分 = 装修积分 + 主材积分 |

### MemberActivityVO — 会员活动

| 字段 | 类型 | 说明 |
|------|------|------|
| `orderId` | String | 关联装修订单号 |
| `name` | String | 活动名称 |
| `startTime` | String | 活动开始时间 |
| `endTime` | String | 活动结束时间 |
| `type` | Short | 活动类型（0=装修, 1=主材, 2=装修+主材） |
| `rate` | Integer | 积分倍率 |
| `multiple` | Integer | 积分倍数 |

### MemberOrderVO — 积分兑换订单

| 字段 | 类型 | 说明 |
|------|------|------|
| `orderId` | String | 关联装修订单号 |
| `pointOrderId` | String | 积分订单号 |
| `decorationPoint` | Integer | 扣除装修积分 |
| `materialPoint` | Integer | 扣除主材积分 |
| `operatePoint` | Integer | 扣除运营积分 |
| `surplusPoint` | Integer | 剩余运营积分 |
| `point` | Integer | 扣除总积分（装修+主材） |
| `uniqueId` | String | 唯一标识（区分推荐关系） |

### MemberOrderItemVO — 兑换商品明细

| 字段 | 类型 | 说明 |
|------|------|------|
| `no` | String | 商品编号 |
| `name` | String | 商品名称 |
| `point` | Integer | 商品所需积分 |
| `num` | Integer | 兑换数量 |

### MemberGoodsVO — 会员商品

| 字段 | 类型 | 说明 |
|------|------|------|
| `no` | String | 商品编号 |
| `name` | String | 商品名称 |
| `category` | String | 商品分类 |
| `point` | Integer | 所需积分 |
| `isPrefor` | Short | 是否计算业绩（0=计算, 1=不计算） |
| `isPayment` | Short | 是否计入金额（0=计入, 1=不计入） |

---

## 接口详情

### 1. queryMemberByPhone — 按手机号查询会员

**URL**: `POST /queryMemberByPhone.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `members[0].phone` | String | 是 | 手机号码 |

最多支持 10 个手机号同时查询。

**请求示例**:
```json
{
  "members": [
    { "phone": "13800138000" },
    { "phone": "13900139000" }
  ]
}
```

**响应数据**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| `resultMap` | `Map<String, List<MemberVO>>` | key 为手机号，value 为该手机号对应的会员列表 |

**业务逻辑**:
1. 校验手机号列表不为空，最多取前 10 个
2. 手机号加密后查询客户信息（`Customer` + `CustomerPhone`）
3. 根据客户 ID 批量查询装修订单（`Decoration`）
4. 批量查询公司信息填充 `company` 字段
5. 返回 手机号 → 会员列表 的映射

---

### 2. queryMemberPoint — 查询会员积分

**URL**: `POST /queryMemberPoint.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `memberPoints[0].orderId` | String | 是 | 装修订单号 |

**请求示例**:
```json
{
  "memberPoints": [
    { "orderId": "160001" }
  ]
}
```

**响应数据**: `List<MemberPointVO>`

**业务逻辑**:
1. 根据订单号查询装修订单
2. 计算积分扣减量（`Cppoint.amount`）
3. 计算装修积分（`decorationPoint = 总装修积分 - 已扣减`）
4. 计算主材积分（`materialPoint = 总主材积分`）
5. 冻结积分 = 预付款余额 + 已产生但未发放的积分
6. 运营积分 = 可用装修积分 + 可用主材积分

---

### 3. addMemberActivity — 添加会员活动

**URL**: `POST /addMemberActivity.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `memberActivity.name` | String | 是 | 活动名称 |
| `memberActivity.startTime` | String | 是 | 活动开始时间 |
| `memberActivity.endTime` | String | 是 | 活动结束时间 |
| `memberActivity.type` | Short | 是 | 活动类型（0=装修, 1=主材, 2=装修+主材） |
| `memberActivity.rate` | Integer | 否 | 积分倍率 |
| `memberActivity.multiple` | Integer | 否 | 积分倍数 |
| `companys` | `List<String>` | 否 | 适用公司列表（默认总部） |

**请求示例**:
```json
{
  "memberActivity": {
    "name": "春季积分翻倍活动",
    "startTime": "2026-04-01 00:00:00",
    "endTime": "2026-04-30 23:59:59",
    "type": 2,
    "rate": 2,
    "multiple": 1
  },
  "companys": ["company1", "company2"]
}
```

**业务逻辑**:
- `type=0`（装修）: 创建装修类型活动
- `type=1`（主材）: 创建主材类型活动
- `type=2`（装修+主材）: 同时创建两种活动
- 按公司列表循环，每个公司分别创建
- 活动默认在线类型（`ATTTYPE_ONLINE`）

---

### 4. makeMemberOrder — 创建积分兑换订单（批量商品）

**URL**: `POST /makeMemberOrder.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `memberOrder.orderId` | String | 是 | 关联装修订单号 |
| `memberOrder.pointOrderId` | String | 否 | 积分订单号 |
| `memberOrder.decorationPoint` | Integer | 否 | 扣除装修积分 |
| `memberOrder.materialPoint` | Integer | 否 | 扣除主材积分 |
| `memberOrder.operatePoint` | Integer | 否 | 扣除运营积分 |
| `memberOrder.surplusPoint` | Integer | 否 | 剩余运营积分 |
| `memberOrder.point` | Integer | 是 | 扣除总积分（装修+主材） |
| `memberOrder.uniqueId` | String | 否 | 唯一标识（区分推荐关系） |
| `memberOrderItems[0].no` | String | 是 | 商品编号 |
| `memberOrderItems[0].name` | String | 是 | 商品名称 |
| `memberOrderItems[0].point` | Integer | 是 | 商品所需积分 |
| `memberOrderItems[0].num` | Integer | 是 | 兑换数量 |

**请求示例**:
```json
{
  "memberOrder": {
    "orderId": "160001",
    "uniqueId": "12345",
    "decorationPoint": 100,
    "materialPoint": 50,
    "operatePoint": 30,
    "point": 150,
    "surplusPoint": 20
  },
  "memberOrderItems": [
    { "no": "G001", "name": "电饭煲", "point": 100, "num": 1 },
    { "no": "G002", "name": "毛巾套装", "point": 50, "num": 2 }
  ]
}
```

**业务逻辑**:
1. 校验订单存在性
2. 校验积分充足性（可用装修积分 + 可用主材积分 >= 扣除积分）
3. 校验活动信息存在性
4. 批量创建 `DecorationActivityItem`（活动奖品兑换记录）
5. 更新/创建 `Cppoint`（积分余额）
6. 创建 `CppointPayment`（积分支付明细，按付款时间顺序扣减）
7. 记录 `CppointRecord`（积分变动记录，装修积分和运营积分各一条）

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 140013 | 订单不存在 |
| 160011 | 活动信息不存在 |
| 330049 | 积分不足 |
| 130006 | 客户支付记录不存在 |

---

### 5. cancelMemberOrder — 取消积分兑换订单

**URL**: `POST /cancelMemberOrder.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `memberOrder.orderId` | String | 是 | 关联装修订单号 |
| `memberOrder.pointOrderId` | String | 是 | 要取消的积分订单号 |
| `memberOrder.point` | Integer | 是 | 退还积分数 |
| `memberOrder.operatePoint` | Integer | 否 | 退还运营积分数 |
| `memberOrder.surplusPoint` | Integer | 否 | 剩余运营积分 |

**请求示例**:
```json
{
  "memberOrder": {
    "orderId": "160001",
    "pointOrderId": "PO20260401001",
    "point": 150,
    "operatePoint": 30,
    "surplusPoint": 200
  }
}
```

**业务逻辑**:
1. 校验订单和积分记录存在性
2. 将对应活动奖品状态设为 `STATUS_UNVALID`（失效）
3. 积分加回 `Cppoint`
4. 取消 `CppointPayment`（更新状态）
5. 取消 `CppointRecord`（更新状态）
6. 记录两条 `CppointRecord`（退还装修积分和运营积分）

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 140013 | 订单不存在 |
| 330047 | 积分不存在 |

---

### 6. makeMemberOrderItem — 兑换单个商品

**URL**: `POST /makeMemberOrderItem.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `memberOrder.orderId` | String | 是 | 关联装修订单号 |
| `memberOrder.pointOrderId` | String | 否 | 积分订单号 |
| `memberOrder.uniqueId` | String | 否 | 唯一标识（区分推荐关系） |
| `memberOrderItem.no` | String | 是 | 商品编号 |
| `memberOrderItem.name` | String | 是 | 商品名称 |
| `memberOrderItem.point` | Integer | 是 | 商品所需积分 |
| `memberOrderItem.num` | Integer | 是 | 兑换数量 |

**请求示例**:
```json
{
  "memberOrder": {
    "orderId": "160001",
    "uniqueId": "12345"
  },
  "memberOrderItem": {
    "no": "G001",
    "name": "电饭煲",
    "point": 100,
    "num": 1
  }
}
```

**业务逻辑**:
1. 校验订单存在性
2. 校验活动信息存在性
3. 创建单条 `DecorationActivityItem`（活动奖品兑换记录）
4. 设置奖品状态为 `STATUS_DELIVERY`（配送）
5. **不扣减积分**，仅新增兑换记录（积分由 `makeMemberOrder` 统一结算）

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 140013 | 订单不存在 |
| 160011 | 活动信息不存在 |

---

### 7. cancelMemberOrderItem — 取消单个兑换商品

**URL**: `POST /cancelMemberOrderItem.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `memberOrder.orderId` | String | 是 | 关联装修订单号 |
| `memberOrderItem.no` | String | 是 | 要取消的商品编号（对应积分订单号/奖品编号） |

**请求示例**:
```json
{
  "memberOrder": {
    "orderId": "160001"
  },
  "memberOrderItem": {
    "no": "PO20260401001"
  }
}
```

**业务逻辑**:
1. 校验订单存在性
2. 查询该订单下匹配编号的活动奖品
3. **仅允许取消状态为 `STATUS_INIT`（初始）的奖品**
4. 将奖品状态设为 `STATUS_UNVALID`（失效）
5. **不退还积分**（积分由 `cancelMemberOrder` 统一退还）

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 140013 | 订单不存在 |
| 140057 | 装修活动奖品不可操作（状态非初始） |

---

### 8. updateMemberGoods — 更新/新增会员商品

**URL**: `POST /updateMemberGoods.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `memberGoods.no` | String | 是 | 商品编号 |
| `memberGoods.name` | String | 是 | 商品名称 |
| `memberGoods.category` | String | 否 | 商品分类 |
| `memberGoods.point` | Integer | 是 | 所需积分 |
| `memberGoods.isPrefor` | Short | 否 | 是否计算业绩（0=计算, 1=不计算，默认1） |
| `memberGoods.isPayment` | Short | 否 | 是否计入金额（0=计入, 1=不计入，默认1） |

**请求示例**:
```json
{
  "memberGoods": {
    "no": "G001",
    "name": "高级电饭煲",
    "category": "家电",
    "point": 200,
    "isPrefor": 0,
    "isPayment": 1
  }
}
```

**业务逻辑**:
1. 根据 `no` 查找已有商品（`AwardStock`）
2. **存在则更新**，**不存在则新建**
3. 积分值内部乘以 1000000 存储（精度处理）
4. 商品状态设为 `STATUS_ABLE`（启用）

---

### 9. queryMemberForInfo — 查询会员详情(按公司)

**URL**: `POST /queryMemberForInfo.do`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `members[0].phone` | String | 是 | 手机号码 |

**请求示例**:
```json
{
  "members": [
    { "phone": "13800138000" }
  ]
}
```

**响应数据**: 同 `queryMemberByPhone`，返回 `resultMap`（`Map<String, List<MemberVO>>`）

**与 queryMemberByPhone 的区别**:
1. 自动注入当前用户所属公司（`queryCompany()`），仅返回当前公司下的数据
2. **仅返回关联订单（推荐信息）**，不返回主订单数据
3. 关联订单来源：`chanceRefer`、`originRefer`、`orderRefer` 三种推荐关系
4. `referOrderId` 字段会指向主订单号
5. `activityItemCount` 只统计有效状态的活动项目

**有效活动项目状态**:
| 状态 | 值 | 说明 |
|------|-----|------|
| 初始 | 0 | STATUS_INIT |
| 已领 | 2 | STATUS_RECEIVE |
| 配送 | 4 | STATUS_DELIVERY |
| 未退 | 5 | STATUS_WAIT |
| 升级 | 6 | STATUS_UPGRADE |
| 消耗 | 7 | STATUS_CONSUME |
| 抵现 | 8 | STATUS_DISCOUNT |

排除状态：失效(1)、退货(3)、采购(9)

---

## 通用说明

### 继承参数（来自 BaseListAction）

所有接口均继承以下可选参数，用于分页查询场景：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| `paging.page` | int | 当前页码 |
| `paging.rows` | int | 每页行数 |

### 认证要求

所有接口均需携带认证信息，通过以下方式之一：
- Cookie 中携带 `authentication` 字段
- 请求参数中携带 `authentication` 字段

### 错误码汇总

| 错误码 | 说明 | 涉及接口 |
|--------|------|---------|
| 130006 | 客户信息不存在 / 客户支付记录不存在 | queryMemberByPhone, makeMemberOrder |
| 130021 | 客户电话不存在 | queryMemberByPhone, queryMemberForInfo |
| 140013 | 订单不存在 | makeMemberOrder, cancelMemberOrder, makeMemberOrderItem, cancelMemberOrderItem |
| 140057 | 装修活动奖品不可操作 | cancelMemberOrderItem |
| 160011 | 活动信息不存在 | makeMemberOrder, makeMemberOrderItem |
| 330047 | 积分不存在 | cancelMemberOrder |
| 330049 | 积分不足 | makeMemberOrder |

### 典型业务流程

#### 积分兑换流程
```
queryMemberByPhone  →  查询客户会员信息
        ↓
queryMemberPoint    →  查询可用积分
        ↓
makeMemberOrderItem →  逐个添加兑换商品（可选，可多次调用）
        ↓
makeMemberOrder     →  统一结算积分，创建兑换订单
```

#### 取消兑换流程
```
cancelMemberOrderItem  →  取消单个初始状态的商品（可选）
          ↓
cancelMemberOrder      →  取消整个兑换订单，退还积分
```

#### 商品管理流程
```
updateMemberGoods  →  新增或更新商品信息（自动判断）
```
