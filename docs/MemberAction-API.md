# MemberAction 接口说明文档

> 控制器: `com.fanglin.customer.action.MemberAction`
> Spring Bean: `CusMemberAction`
> 基类: `BaseListAction`
> 路由前缀: `/`
> 返回格式: JSON (ignoreHierarchy=false)
> 依赖服务: `MemberService`

---

## 一、接口总览

| # | 接口名称 | Action 值 | HTTP方法 | 功能简述 |
|---|---------|-----------|---------|---------|
| 1 | 按手机号查询会员 | `queryMemberByPhone` | POST | 根据手机号批量查询会员信息，按公司分组返回 |
| 2 | 查询会员积分 | `queryMemberPoint` | POST | 查询订单的装修/主材/运营积分明细 |
| 3 | 新增会员活动 | `addMemberActivity` | POST | 创建积分活动并关联到指定公司 |
| 4 | 创建积分兑换订单 | `makeMemberOrder` | POST | 创建积分兑换订单（含多个商品项） |
| 5 | 取消积分兑换订单 | `cancelMemberOrder` | POST | 取消已有积分兑换订单，退还积分 |
| 6 | 订单追加商品项 | `makeMemberOrderItem` | POST | 向已有兑换订单追加单个商品项 |
| 7 | 订单移除商品项 | `cancelMemberOrderItem` | POST | 从已有兑换订单移除单个商品项 |
| 8 | 更新积分商品 | `updateMemberGoods` | POST | 更新积分商城商品信息 |
| 9 | 按信息查询会员 | `queryMemberForInfo` | POST | 根据会员信息批量查询，按当前用户所属公司分组 |

---

## 二、接口详细说明

### 1. queryMemberByPhone -- 按手机号查询会员

**URL**: `POST /queryMemberByPhone.do`

**描述**: 传入一组会员信息（含手机号），批量查询匹配的会员，结果按公司分组返回。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| members | List\<MemberVO\> | 是 | 会员列表，每项需包含 phone 字段 |

MemberVO 输入字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| phone | String | 手机号（查询条件） |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| resultMap | Map\<String, List\<MemberVO\>\> | Key=公司名称, Value=该公司下的会员列表 |

MemberVO 返回字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| uniqueId | String | 记录唯一标识（主订单: doid，关联订单: parentDoid-doid） |
| orderId | String | 装修订单号 |
| referOrderId | String | 主订单号（关联订单时指向主订单 orderId） |
| phone | String | 客户手机号 |
| designer | String | 设计师姓名 |
| designerPhone | String | 设计师手机号 |
| desigerId | String | 设计师用户ID |
| supervisor | String | 监理姓名 |
| supervisorPhone | String | 监理手机号 |
| supervisorId | String | 监理用户ID |
| storeTime | Timestamp | 到店时间 (yyyy-MM-dd HH:mm:ss) |
| contractTime | Timestamp | 签约时间 (yyyy-MM-dd HH:mm:ss) |
| paySacle | Short | 付款比例 |
| status | Short | 状态 |
| company | String | 公司名称 |
| companyId | Integer | 公司ID |
| activityItemCount | Integer | 活动项目数量 |

---

### 2. queryMemberPoint -- 查询会员积分

**URL**: `POST /queryMemberPoint.do`

**描述**: 根据订单号查询对应会员的各类积分（装修积分、主材积分、运营积分）及冻结情况。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| memberPoints | List\<MemberPointVO\> | 是 | 积分查询列表，每项需包含 orderId |

MemberPointVO 输入字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| orderId | String | 装修订单号 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| memberPoints | List\<MemberPointVO\> | 积分列表 |

MemberPointVO 返回字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| orderId | String | 装修订单号 |
| decorationPoint | Long | 装修积分（可用） |
| freezeDecorationPoint | Long | 冻结装修积分 |
| materialPoint | Long | 主材积分（可用） |
| freezeMaterialPoint | Long | 冻结主材积分 |
| operatePoint | Long | 运营积分 |

---

### 3. addMemberActivity -- 新增会员活动

**URL**: `POST /addMemberActivity.do`

**描述**: 创建积分活动，绑定到指定公司列表。操作需登录，自动获取当前用户ID。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| memberActivity | MemberActivityVO | 是 | 活动信息 |
| companys | List\<String\> | 是 | 活动关联的公司ID列表 |

MemberActivityVO 字段:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderId | String | 否 | 关联订单号 |
| name | String | 是 | 活动名称 |
| startTime | String | 是 | 活动开始时间 |
| endTime | String | 是 | 活动结束时间 |
| type | Short | 是 | 活动类型 |
| rate | Integer | 否 | 积分比率 |
| multiple | Integer | 否 | 积分倍数 |

**响应参数**:

返回 HTTP 200 (SUCCESS)，无额外数据。

**备注**: 接口内部通过 `queryUserId()` 获取当前登录用户ID作为操作人。

---

### 4. makeMemberOrder -- 创建积分兑换订单

**URL**: `POST /makeMemberOrder.do`

**描述**: 创建积分兑换订单，同时提交多个兑换商品项。积分将被冻结扣除。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| memberOrder | MemberOrderVO | 是 | 订单信息 |
| memberOrderItems | List\<MemberOrderItemVO\> | 是 | 兑换商品项列表 |

MemberOrderVO 输入字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| orderId | String | 装修订单号（积分归属订单） |
| uniqueId | String | 唯一标识（区分主订单/关联订单） |
| decorationPoint | Integer | 扣除装修积分 |
| materialPoint | Integer | 扣除主材积分 |
| operatePoint | Integer | 扣除运营积分 |
| point | Integer | 总扣除积分（装修+主材） |

MemberOrderItemVO 字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| no | String | 商品编号 |
| name | String | 商品名称 |
| point | Integer | 单项积分 |
| num | Integer | 兑换数量 |

**响应参数**:

返回 HTTP 200 (SUCCESS)，无额外数据。

---

### 5. cancelMemberOrder -- 取消积分兑换订单

**URL**: `POST /cancelMemberOrder.do`

**描述**: 取消已有积分兑换订单，已扣除积分将退还。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| memberOrder | MemberOrderVO | 是 | 需包含 pointOrderId |

MemberOrderVO 输入字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| pointOrderId | String | 积分订单号（要取消的订单） |

**响应参数**:

返回 HTTP 200 (SUCCESS)，无额外数据。

---

### 6. makeMemberOrderItem -- 订单追加商品项

**URL**: `POST /makeMemberOrderItem.do`

**描述**: 向已有的积分兑换订单追加一个商品项。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| memberOrder | MemberOrderVO | 是 | 目标订单信息 |
| memberOrderItem | MemberOrderItemVO | 是 | 追加的商品项 |

MemberOrderVO 关键字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| pointOrderId | String | 目标积分订单号 |
| uniqueId | String | 唯一标识 |

MemberOrderItemVO 字段:

| 字段 | 类型 | 说明 |
|------|------|------|
| no | String | 商品编号 |
| name | String | 商品名称 |
| point | Integer | 单项积分 |
| num | Integer | 兑换数量 |

**响应参数**:

返回 HTTP 200 (SUCCESS)，无额外数据。

---

### 7. cancelMemberOrderItem -- 订单移除商品项

**URL**: `POST /cancelMemberOrderItem.do`

**描述**: 从已有的积分兑换订单中移除一个商品项。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| memberOrder | MemberOrderVO | 是 | 目标订单信息 |
| memberOrderItem | MemberOrderItemVO | 是 | 要移除的商品项 |

字段同接口6。

**响应参数**:

返回 HTTP 200 (SUCCESS)，无额外数据。

---

### 8. updateMemberGoods -- 更新积分商品

**URL**: `POST /updateMemberGoods.do`

**描述**: 更新积分商城中的商品信息（名称、分类、积分值、业绩/金额计算标记）。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| memberGoods | MemberGoodsVO | 是 | 商品信息 |

MemberGoodsVO 字段:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| no | String | 是 | 商品编号（定位条件） |
| name | String | 否 | 商品名称 |
| category | String | 否 | 商品分类 |
| point | Integer | 否 | 所需积分 |
| isPrefor | Short | 否 | 是否计算业绩（0=计算, 1=不计算） |
| isPayment | Short | 否 | 是否计入金额（0=计入, 1=不计入） |

**响应参数**:

返回 HTTP 200 (SUCCESS)，无额外数据。

---

### 9. queryMemberForInfo -- 按信息查询会员

**URL**: `POST /queryMemberForInfo.do`

**描述**: 根据会员信息批量查询，自动按当前登录用户所属公司进行筛选，结果按公司分组返回。

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| members | List\<MemberVO\> | 是 | 会员查询条件列表 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| resultMap | Map\<String, List\<MemberVO\>\> | Key=公司名称, Value=该公司下的会员列表 |

返回字段与 queryMemberByPhone 相同。

**备注**: 与 queryMemberByPhone 的区别在于，本接口额外使用 `queryCompany()` 获取当前用户所属公司进行权限过滤。

---

## 三、通用说明

### 认证
所有接口需要用户登录状态。以下接口使用当前登录用户信息：
- `addMemberActivity` -- 使用 `queryUserId()`
- `makeMemberOrder` -- 使用 `queryUserId()`
- `cancelMemberOrder` -- 使用 `queryUserId()`
- `makeMemberOrderItem` -- 使用 `queryUserId()`
- `cancelMemberOrderItem` -- 使用 `queryUserId()`
- `queryMemberForInfo` -- 使用 `queryCompany()` 过滤公司权限

### 异常处理
所有接口均可抛出 `FLException`，返回 JSON 格式错误信息，包含错误码和错误描述。

### 积分类型说明
| 积分类型 | 说明 |
|---------|------|
| decorationPoint | 装修积分 -- 通过装修订单获得 |
| materialPoint | 主材积分 -- 通过主材消费获得 |
| operatePoint | 运营积分 -- 通过运营活动获得 |
| freezeXxxPoint | 冻结积分 -- 已提交兑换但尚未确认的积分 |

### uniqueId 说明
MemberVO 中的 uniqueId 用于区分主订单和关联订单：
- 主订单：直接使用 doid（如 `"12345"`）
- 关联订单：使用 `parentDoid-doid` 格式（如 `"12345-67890"`），表示该订单是通过转介绍关联到主订单 12345 的订单 67890

---

## 四、数据模型关系

```
MemberVO (会员/订单视图)
 ├── orderId ── 装修订单号
 ├── referOrderId ── 转介绍主订单号
 ├── uniqueId ── 唯一标识
 └── activityItemCount ── 活动项数

MemberPointVO (积分视图)
 ├── orderId ── 装修订单号
 ├── decorationPoint / freezeDecorationPoint ── 装修积分
 ├── materialPoint / freezeMaterialPoint ── 主材积分
 └── operatePoint ── 运营积分

MemberActivityVO (活动)
 ├── orderId ── 关联订单
 ├── name ── 活动名称
 ├── startTime / endTime ── 活动时间
 ├── type ── 活动类型
 ├── rate ── 积分比率
 └── multiple ── 积分倍数

MemberOrderVO (积分兑换订单)
 ├── orderId ── 装修订单号
 ├── pointOrderId ── 积分订单号
 ├── uniqueId ── 唯一标识
 ├── decorationPoint / materialPoint / operatePoint ── 扣除积分
 ├── surplusPoint ── 剩余运营积分
 └── point ── 总扣除积分(装修+主材)

MemberOrderItemVO (兑换商品项)
 ├── no ── 商品编号
 ├── name ── 商品名称
 ├── point ── 单项积分
 └── num ── 兑换数量

MemberGoodsVO (积分商品)
 ├── no ── 商品编号
 ├── name ── 商品名称
 ├── category ── 商品分类
 ├── point ── 所需积分
 ├── isPrefor ── 是否计算业绩
 └── isPayment ── 是否计入金额
```
