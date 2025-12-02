# store - 在线商城模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **store**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

store 模块负责**在线商城功能**，提供商品管理、购物车、订单处理、优惠券、用户管理等电商核心功能，支持 C 端用户在线购物场景。

**核心功能**
- 商品管理（品牌、品类、规格、价格）
- 购物车
- 订单管理
- 支付处理
- 优惠券管理
- 用户管理
- 收货地址
- 商品评价
- 轮播图

---

## 入口与启动

### 控制器入口
- `MgoodsAction` - 商品管理
- `McategoryAction` - 商品分类
- `MbrandAction` - 商品品牌
- `McolorAction` - 商品颜色
- `MformatAction` - 商品规格
- `MpriceAction` - 商品价格
- `CartAction` - 购物车
- `MorderAction` - 订单管理
- `MorderItemAction` - 订单明细
- `MpaymentAction` - 支付管理
- `CouponAction` - 优惠券
- `MuserAction` - 商城用户
- `MuserCouponAction` - 用户优惠券
- `AddressAction` - 收货地址
- `EvaluateAction` - 商品评价
- `SlideAction` - 轮播图
- `PictureAction` - 商品图片

### 前端页面
- 小程序/H5 商城页面（未在 WebContent 中）

---

## 对外接口

### 商品管理
```java
// 分页查询商品
GET/POST /pageMgoods.do
Request: Paging + Filters
Response: { goods: [...] }

// 查询商品详情
GET/POST /queryMgoodsByGid.do
Request: { gid }
Response: { goods: {...} }

// 新增商品
POST /addMgoods.do
Request: { name, category, brand, price, stock, ... }
Response: success

// 更新商品
POST /updateMgoods.do
Request: { gid, ... }
Response: success
```

### 购物车
```java
// 查询购物车
GET/POST /queryCart.do
Request: { unionId }
Response: { cartItems: [...] }

// 添加到购物车
POST /addCart.do
Request: { unionId, gid, quantity }
Response: success

// 更新购物车
POST /updateCart.do
Request: { cid, quantity }
Response: success

// 删除购物车项
POST /deleteCart.do
Request: { cid }
Response: success
```

### 订单管理
```java
// 分页查询订单
GET/POST /pageMorder.do
Request: Paging + Filters
Response: { orders: [...] }

// 创建订单
POST /addMorder.do
Request: {
  unionId,
  items: [...],
  addressId,
  couponId
}
Response: { oid, no }

// 取消订单
POST /deleteMorder.do
Request: { oid }
Response: success
```

### 支付
```java
// 创建支付
POST /addMpayment.do
Request: {
  oid,
  payType,    // 支付方式
  amount
}
Response: { paymentInfo: {...} }

// 支付回调（由支付平台调用）
POST /callbackMpayment.do
Request: 支付结果
Response: success
```

### 优惠券
```java
// 分页查询优惠券
GET/POST /pageCoupon.do
Request: Paging + Filters
Response: { coupons: [...] }

// 领取优惠券
POST /receiveCoupon.do
Request: { unionId, couponId }
Response: success

// 查询用户优惠券
GET/POST /queryMuserCoupon.do
Request: { unionId }
Response: { coupons: [...] }
```

### 收货地址
```java
// 查询收货地址
GET/POST /queryAddress.do
Request: { unionId }
Response: { addresses: [...] }

// 新增地址
POST /addAddress.do
Request: {
  unionId,
  name, mobile, province, city, district, address, isDefault
}
Response: success

// 更新地址
POST /updateAddress.do
Request: { aid, ... }
Response: success

// 删除地址
POST /deleteAddress.do
Request: { aid }
Response: success
```

### 商品评价
```java
// 分页查询评价
GET/POST /pageEvaluate.do
Request: Paging + Filters + gid
Response: { evaluates: [...] }

// 新增评价
POST /addEvaluate.do
Request: {
  unionId, oid, gid, score, content, pictures
}
Response: success
```

---

## 关键依赖与配置

### 核心依赖
- `com.fanglin.payment` - 支付管理
- `com.fanglin.swiftpass` / `com.fanglin.yspay` - 支付接口

---

## 数据模型

### 核心实体（PO）

#### MgoodsPO - 商品
```java
@Entity
@Table(name = "mgoods", catalog = "store")
- gid: long                     // 商品ID
- name: String                  // 商品名称
- category: McategoryPO         // 分类
- brand: MbrandPO               // 品牌
- price: long                   // 价格（分）
- stock: int                    // 库存
- sales: int                    // 销量
- description: String           // 描述
- status: short                 // 状态（上架/下架）
```

#### MorderPO - 订单
```java
@Entity
@Table(name = "morder", catalog = "store")
- oid: long                     // 订单ID
- no: String                    // 订单号
- unionId: String               // 用户UnionID
- rmunionId: String             // 推荐人UnionID
- coupon: CouponPO              // 优惠券
- total: long                   // 总金额
- createTime: Timestamp         // 创建时间
- paymentTime: Timestamp        // 支付时间
- address: String               // 收货地址
- status: short                 // 状态
  - 0: 待支付
  - 1: 待发货
  - 2: 已发货
  - 3: 待评价
  - 5: 已取消
  - 6: 已完成
```

#### MorderItemPO - 订单明细
```java
@Entity
- oiid: long                    // 明细ID
- order: MorderPO               // 订单
- goods: MgoodsPO               // 商品
- quantity: int                 // 数量
- price: long                   // 单价
- total: long                   // 小计
```

#### CartPO - 购物车
```java
@Entity
- cid: long                     // 购物车ID
- unionId: String               // 用户UnionID
- goods: MgoodsPO               // 商品
- quantity: int                 // 数量
- createTime: Timestamp         // 加入时间
```

#### CouponPO - 优惠券
```java
@Entity
- cid: long                     // 优惠券ID
- name: String                  // 名称
- type: short                   // 类型（满减/折扣）
- condition: long               // 使用条件（满多少）
- discount: long                // 优惠金额/折扣
- startTime: String             // 开始时间
- endTime: String               // 结束时间
- total: int                    // 总量
- received: int                 // 已领取
- status: short                 // 状态
```

#### MuserCouponPO - 用户优惠券
```java
@Entity
- ucid: long                    // 用户优惠券ID
- unionId: String               // 用户UnionID
- coupon: CouponPO              // 优惠券
- receiveTime: Timestamp        // 领取时间
- useTime: Timestamp            // 使用时间
- status: short                 // 状态（未使用/已使用/已过期）
```

#### AddressPO - 收货地址
```java
@Entity
- aid: long                     // 地址ID
- unionId: String               // 用户UnionID
- name: String                  // 收货人
- mobile: String                // 手机号
- province: String              // 省
- city: String                  // 市
- district: String              // 区
- address: String               // 详细地址
- isDefault: boolean            // 是否默认
```

#### EvaluatePO - 评价
```java
@Entity
- eid: long                     // 评价ID
- unionId: String               // 用户UnionID
- order: MorderPO               // 订单
- goods: MgoodsPO               // 商品
- score: int                    // 评分（1-5）
- content: String               // 评价内容
- pictures: String              // 评价图片（逗号分隔）
- createTime: Timestamp         // 评价时间
```

---

## 订单状态流转

```
待支付(0) → 待发货(1) → 已发货(2) → 待评价(3) → 已完成(6)
   ↓
已取消(5)
```

---

## 常见问题 (FAQ)

**Q: 商城支持哪些支付方式？**
A: 支持微信支付、支付宝支付（通过威富通/银盛）。

**Q: 优惠券如何使用？**
A:
1. 用户领取优惠券
2. 下单时选择可用优惠券
3. 系统自动计算优惠金额
4. 支付时抵扣

**Q: 库存如何扣减？**
A:
1. 下单时锁定库存
2. 支付成功后扣减库存
3. 取消订单时释放库存

**Q: 如何处理退货？**
A: 订单管理模块需添加退货功能，包括：
- 申请退货
- 审批
- 退款
- 恢复库存

---

## 相关文件清单

```
src/com/fanglin/store/
├── action/
│   ├── MgoodsAction.java                 - 商品管理
│   ├── McategoryAction.java              - 分类管理
│   ├── MbrandAction.java                 - 品牌管理
│   ├── McolorAction.java                 - 颜色管理
│   ├── MformatAction.java                - 规格管理
│   ├── MpriceAction.java                 - 价格管理
│   ├── CartAction.java                   - 购物车 ★
│   ├── MorderAction.java                 - 订单管理 ★
│   ├── MorderItemAction.java             - 订单明细
│   ├── MpaymentAction.java               - 支付管理
│   ├── CouponAction.java                 - 优惠券
│   ├── MuserAction.java                  - 用户管理
│   ├── MuserCouponAction.java            - 用户优惠券
│   ├── AddressAction.java                - 收货地址
│   ├── EvaluateAction.java               - 评价管理
│   ├── SlideAction.java                  - 轮播图
│   └── PictureAction.java                - 商品图片
├── service/
│   ├── MgoodsService.java                - 商品服务
│   ├── CartService.java                  - 购物车服务
│   ├── MorderService.java                - 订单服务
│   ├── CouponService.java                - 优惠券服务
│   └── AddressService.java               - 地址服务
├── dao/
│   ├── MgoodsDao.java                    - 商品DAO
│   ├── CartDao.java                      - 购物车DAO
│   ├── MorderDao.java                    - 订单DAO
│   └── CouponDao.java                    - 优惠券DAO
├── po/
│   ├── MgoodsPO.java                     - 商品实体
│   ├── McategoryPO.java                  - 分类实体
│   ├── MbrandPO.java                     - 品牌实体
│   ├── MorderPO.java                     - 订单实体 ★
│   ├── MorderItemPO.java                 - 订单明细实体
│   ├── CartPO.java                       - 购物车实体
│   ├── CouponPO.java                     - 优惠券实体
│   ├── MuserCouponPO.java                - 用户优惠券实体
│   ├── AddressPO.java                    - 地址实体
│   └── EvaluatePO.java                   - 评价实体
└── vo/
    ├── MgoodsVO.java                     - 商品VO
    ├── MorderVO.java                     - 订单VO
    ├── CartVO.java                       - 购物车VO
    └── CouponVO.java                     - 优惠券VO
```

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化在线商城模块 AI 上下文文档
- 记录商品、订单、购物车、优惠券等功能
- 补充订单状态流转说明
- 添加常见问题解答
