# 外辅费用管理接口文档（微信小程序集成）

> 文档版本：v1.0
> 创建时间：2026-03-29
> 适用对象：移动端（微信小程序）开发者

---

## 📋 目录

1. [功能概述](#功能概述)
2. [数据模型](#数据模型)
3. [业务流程](#业务流程)
4. [接口列表](#接口列表)
5. [调用示例](#调用示例)
6. [注意事项](#注意事项)

---

## 功能概述

外辅费用管理是库存管理模块的子功能，用于管理装饰工程中外协加工费用的明细记录。

### 核心实体关系

```
Occessories（外辅单）
├── charge: 外辅费用总额
├── decoration: 关联装饰订单
└── OccessoriesItem[]（外辅项列表）
    ├── charge: 外辅项费用总额
    ├── goods: 关联商品
    └── OccessoriesCharge[]（费用明细列表）
        ├── name: 费用名称
        ├── price: 单价（分）
        ├── surplus: 浮动额（分）
        └── num: 数量
```

### 字段精度说明

| 字段类型 | 前端显示单位 | 后端存储单位 | 转换比例 |
|---------|------------|------------|---------|
| 金额 | 元 | 厘 | × 1000 |
| 数量 | 实际数量 | 实际数量 | 1:1 |

**示例**：
- 前端显示：`1.500 元`
- 后端存储：`1500`（厘）

---

## 数据模型

### 1. Occessories（外辅单）

| 字段 | 类型 | 说明 | 示例 |
|-----|------|------|-----|
| `oid` | Long | 外辅单ID | `1001` |
| `no` | String | 外辅单号 | `"WL20260329001"` |
| `charge` | Long | 外辅费用总额（厘） | `15000`（15元） |
| `total` | Long | 总金额（厘） | `180000`（180元） |
| `decoration` | Object | 关联装饰订单 | `{orderId: "xxx"}` |
| `status` | Short | 状态（0-5） | `2`（已配送） |
| `isExceed` | Short | ⭐ 超阶标识（关键字段） | `0` |
| `isEnter` | Short | 是否可进园区 | `1` |
| `isLift` | Short | 是否有电梯 | `1` |
| `isAttic` | Short | 是否有阁楼 | `0` |
| `createTime` | Timestamp | 创建时间 | `"2026-03-29 10:00:00"` |

**状态枚举**：
- `0`: 初始
- `1`: 已绑定
- `2`: 已配送
- `3`: 已接收
- `4`: 已结算
- `5`: 已完成

**⭐ isExceed 超阶标识（重要）**：
- `0`: 超阶（楼层较高，需要额外费用）
- `1`: 不超阶（正常楼层）

**isExceed 对费用计算的影响**：
- 当 `isExceed == 0`（超阶）时，`surplus` 参与费用计算
- 当 `isExceed != 0`（不超阶）时，`surplus` 不参与费用计算

### 2. OccessoriesItem（外辅项）

| 字段 | 类型 | 说明 | 示例 |
|-----|------|------|-----|
| `oiid` | Long | 外辅项ID | `10001` |
| `oid` | Long | 外辅单ID | `1001` |
| `charge` | Long | 外辅项费用总额（厘） | `5000`（5元） |
| `goods` | Object | 关联商品 | `{gid: 101, name: "地板"}` |
| `num` | Integer | 订单数量 | `100` |
| `sennum` | Integer | 送货数量 | `100` |
| `recnum` | Integer | 到货数量 | `98` |

### 3. OccessoriesCharge（费用明细）

| 字段 | 类型 | 说明 | 示例 |
|-----|------|------|-----|
| `acid` | Long | 费用明细ID | `100001` |
| `oid` | Long | 外辅单ID（可选） | `1001` |
| `oiid` | Long | 外辅项ID（可选） | `10001` |
| `name` | String | 费用名称 | `"搬运费"` |
| `price` | Integer | 单价（分） | `500`（0.5元） |
| `surplus` | Integer | 浮动额（分） | `100`（0.1元） |
| `num` | Integer | 数量 | `10` |

---

## 业务流程

### ⭐ 费用计算规则（重要）

**核心业务逻辑**：费用明细的计算需要根据外辅单的 `isExceed` 字段判断是否使用 `surplus`（浮动额）。

#### 计算公式

| isExceed 值 | 含义 | 计算公式 | 说明 |
|------------|------|---------|------|
| `0` | 超阶 | `小计 = (price + surplus) × num` | surplus 参与运算 |
| `≠ 0` | 不超阶 | `小计 = price × num` | surplus 不参与运算 |

#### 示例对比

假设有一条费用明细：
- `price = 500`（0.5元/件）
- `surplus = 100`（0.1元/件）
- `num = 10`（件）

**场景1：isExceed = 0（超阶）**
```
小计 = (500 + 100) × 10 = 6000（厘）= 6.000 元
```

**场景2：isExceed = 1（不超阶）**
```
小计 = 500 × 10 = 5000（厘）= 5.000 元
```

**差异说明**：超阶情况下，需要额外支付 `0.1 × 10 = 1.000 元` 的浮动费用。

#### 后端实现逻辑

```java
// OccessoriesServiceImpl.java 第238-253行
long chargeAmount;
if (occessoriesPO.getIsExceed() == 0) {
    // 超阶：surplus 参与运算
    chargeAmount = ((long) price + surplus) * num;
} else {
    // 不超阶：surplus 不参与运算
    chargeAmount = (long) price * num;
}
```

#### 前端实现逻辑

```javascript
// 费用查看弹窗（occessories4view.js）
var subtotal;
if (isExceed == 0) {
    // 超阶：price + surplus
    subtotal = (price + surplus) * num;
} else {
    // 不超阶：仅 price
    subtotal = price * num;
}
```

---

### 费用明细查询流程

```
1. 用户选择外辅单或外辅项
   ↓
2. 调用 queryOccessoriesCharge 接口
   ↓
3. 返回费用明细列表（包含 isExceed 字段）
   ↓
4. 前端根据 isExceed 判断计算费用
   ↓
5. 展示费用详情（API 自动处理金额转换）
```

### 费用明细保存流程

```
1. 用户编辑费用明细
   ↓
2. 调用 batchOccessoriesCharge 接口
   ↓
3. 后端删除旧费用 + 批量插入新费用
   ↓
4. 后端根据 isExceed 自动计算费用总额
   ↓
5. 返回操作结果
```

---

## 接口列表

### 1. 查询费用明细

**接口地址**: `queryOccessoriesCharge.do`

**请求方式**: `POST`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|-----|
| `occessoriesCharge.occessories.oid` | Long | 否 | 外辅单ID | `1001` |
| `occessoriesCharge.occessoriesItem.oiid` | Long | 否 | 外辅项ID | `10001` |

**说明**：
- `oid` 和 `oiid` 至少传一个
- 优先使用 `oiid` 查询（更精确）
- 如果传 `oid`，返回该外辅单下所有费用明细

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "occessoriesCharges": [
    {
      "acid": 100001,
      "name": "搬运费",
      "price": 500,      // 单价：0.5元（前端显示需除以1000）
      "surplus": 100,    // 浮动额：0.1元
      "num": 10,         // 数量：10
      "occessories": {
        "oid": 1001,
        "no": "WL20260329001"
      },
      "occessoriesItem": {
        "oiid": 10001,
        "goods": {
          "gid": 101,
          "name": "实木地板"
        }
      }
    },
    {
      "acid": 100002,
      "name": "安装费",
      "price": 1000,     // 单价：1元
      "surplus": 0,
      "num": 10,
      "occessoriesItem": {
        "oiid": 10001
      }
    }
  ]
}
```

**前端计算示例**:

```javascript
// 费用小计 = (price + surplus) × num
// 注意：price 和 surplus 单位是分，需除以 1000 转换为元

function calculateCharge(charge) {
  const price = charge.price / 1000;      // 转换为元
  const surplus = charge.surplus / 1000;  // 转换为元
  const num = charge.num;

  const subtotal = (price + surplus) * num;
  return subtotal.toFixed(3); // 保留3位小数
}

// 示例：
// 搬运费小计 = (0.5 + 0.1) × 10 = 6.000 元
// 安装费小计 = (1.0 + 0) × 10 = 10.000 元
```

---

### 2. 添加费用明细

**接口地址**: `addOccessoriesCharge.do`

**请求方式**: `POST`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|-----|
| `occessoriesCharge.occessories.oid` | Long | 条件必填 | 外辅单ID | `1001` |
| `occessoriesCharge.occessoriesItem.oiid` | Long | 条件必填 | 外辅项ID | `10001` |
| `occessoriesCharge.name` | String | 是 | 费用名称 | `"搬运费"` |
| `occessoriesCharge.price` | Integer | 是 | 单价（分） | `500` |
| `occessoriesCharge.surplus` | Integer | 是 | 浮动额（分） | `100` |
| `occessoriesCharge.num` | Integer | 是 | 数量 | `10` |

**说明**：
- `oid` 和 `oiid` 至少传一个
- `price` 和 `surplus` 单位是分（前端需将元×1000）

**请求示例**:

```json
{
  "occessoriesCharge": {
    "occessoriesItem": {
      "oiid": 10001
    },
    "name": "搬运费",
    "price": 500,      // 0.5元 × 1000
    "surplus": 100,    // 0.1元 × 1000
    "num": 10
  }
}
```

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "添加成功"
}
```

---

### 3. 更新费用明细

**接口地址**: `updateOccessoriesCharge.do`

**请求方式**: `POST`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|-----|
| `occessoriesCharge.acid` | Long | 是 | 费用明细ID | `100001` |
| `occessoriesCharge.name` | String | 否 | 费用名称 | `"搬运费"` |
| `occessoriesCharge.price` | Integer | 否 | 单价（分） | `600` |
| `occessoriesCharge.surplus` | Integer | 否 | 浮动额（分） | `150` |
| `occessoriesCharge.num` | Integer | 否 | 数量 | `12` |

**请求示例**:

```json
{
  "occessoriesCharge": {
    "acid": 100001,
    "name": "搬运费",
    "price": 600,      // 更新为 0.6元
    "surplus": 150,    // 更新为 0.15元
    "num": 12          // 更新为 12件
  }
}
```

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "更新成功"
}
```

---

### 4. 删除费用明细

**接口地址**: `deleteOccessoriesCharge.do`

**请求方式**: `POST`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|-----|
| `occessoriesCharge.acid` | Long | 是 | 费用明细ID | `100001` |

**请求示例**:

```json
{
  "occessoriesCharge": {
    "acid": 100001
  }
}
```

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "删除成功"
}
```

---

### 5. 批量保存费用明细 ⭐

**接口地址**: `batchOccessoriesCharge.do`

**请求方式**: `POST`

**功能说明**：
- 删除指定外辅单的所有旧费用
- 批量插入新的费用列表
- 用于一键保存外辅单的所有费用明细

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|-----|
| `occessoriesCharge.occessories.oid` | Long | 是 | 外辅单ID | `1001` |
| `occessoriesCharges` | Array | 是 | 费用明细列表 | 见下方 |

**费用明细数组项结构**:

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `name` | String | 是 | 费用名称 |
| `price` | Integer | 是 | 单价（分） |
| `surplus` | Integer | 是 | 浮动额（分） |
| `num` | Integer | 是 | 数量 |
| `occessoriesItem.oiid` | Long | 否 | 外辅项ID（可选） |

**请求示例**:

```json
{
  "occessoriesCharge": {
    "occessories": {
      "oid": 1001
    }
  },
  "occessoriesCharges": [
    {
      "name": "搬运费",
      "price": 500,
      "surplus": 100,
      "num": 10,
      "occessoriesItem": {
        "oiid": 10001
      }
    },
    {
      "name": "安装费",
      "price": 1000,
      "surplus": 0,
      "num": 10,
      "occessoriesItem": {
        "oiid": 10001
      }
    },
    {
      "name": "上楼费",
      "price": 200,
      "surplus": 50,
      "num": 5
    }
  ]
}
```

**响应示例**:

```json
{
  "errorCode": 0,
  "errorMsg": "批量保存成功"
}
```

---

## 调用示例

### 示例1：查询并展示费用明细

**场景**：用户点击外辅项，查看费用明细

```javascript
// 1. 调用查询接口
wx.request({
  url: 'https://your-domain.com/queryOccessoriesCharge.do',
  method: 'POST',
  data: {
    'occessoriesCharge.occessoriesItem.oiid': 10001
  },
  header: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  success(res) {
    if (res.data.errorCode === 0) {
      const charges = res.data.occessoriesCharges || [];

      // 2. 格式化费用数据（厘→元）
      const formattedCharges = charges.map(charge => ({
        name: charge.name,
        price: (charge.price / 1000).toFixed(3),      // 转换单价
        surplus: (charge.surplus / 1000).toFixed(3),  // 转换浮动额
        num: charge.num,
        subtotal: ((charge.price + charge.surplus) * charge.num / 1000).toFixed(3)
      }));

      // 3. 计算总金额
      const total = formattedCharges.reduce((sum, item) => {
        return sum + parseFloat(item.subtotal);
      }, 0);

      // 4. 渲染页面
      this.setData({
        chargeList: formattedCharges,
        totalAmount: total.toFixed(3)
      });
    }
  }
});
```

**页面渲染示例**:

```html
<!-- 费用明细列表 -->
<view wx:for="{{chargeList}}" wx:key="acid">
  <view class="charge-name">{{item.name}}</view>
  <view class="charge-detail">
    单价：{{item.price}}元 × {{item.num}} =
    <text class="subtotal">{{item.subtotal}}元</text>
  </view>
</view>

<!-- 总金额 -->
<view class="total">
  费用总计：{{totalAmount}}元
</view>
```

---

### 示例2：批量保存费用明细

**场景**：用户编辑完所有费用后，一键保存

```javascript
// 1. 收集表单数据（前端单位：元）
const formData = [
  { name: '搬运费', price: 0.5, surplus: 0.1, num: 10, oiid: 10001 },
  { name: '安装费', price: 1.0, surplus: 0, num: 10, oiid: 10001 },
  { name: '上楼费', price: 0.2, surplus: 0.05, num: 5 }
];

// 2. 转换数据格式（元→厘）
const charges = formData.map(item => ({
  name: item.name,
  price: Math.round(item.price * 1000),      // 转换为分
  surplus: Math.round(item.surplus * 1000),  // 转换为分
  num: item.num,
  occessoriesItem: item.oiid ? { oiid: item.oiid } : null
}));

// 3. 调用批量保存接口
wx.request({
  url: 'https://your-domain.com/batchOccessoriesCharge.do',
  method: 'POST',
  data: {
    'occessoriesCharge.occessories.oid': 1001,
    'occessoriesCharges': charges
  },
  header: {
    'content-type': 'application/json'
  },
  success(res) {
    if (res.data.errorCode === 0) {
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: res.data.errorMsg || '保存失败',
        icon: 'none'
      });
    }
  }
});
```

---

### 示例3：金额计算工具函数

```javascript
/**
 * 金额转换工具类（含 isExceed 判断）
 */
const MoneyUtils = {
  /**
   * 元转厘（用于发送到后端）
   * @param {number} yuan 金额（元）
   * @returns {number} 金额（厘）
   */
  yuanToLi: function(yuan) {
    return Math.round(yuan * 1000);
  },

  /**
   * 厘转元（用于显示）
   * @param {number} li 金额（厘）
   * @param {number} precision 小数位数，默认3位
   * @returns {string} 金额（元）
   */
  liToYuan: function(li, precision = 3) {
    return (li / 1000).toFixed(precision);
  },

  /**
   * ⭐ 计算费用小计（根据 isExceed 判断）
   * @param {object} charge 费用对象（单位：厘）
   * @param {number} isExceed 超阶标识（0-超阶，1-不超阶）
   * @returns {string} 小计金额（元）
   */
  calculateSubtotal: function(charge, isExceed) {
    const price = charge.price || 0;      // 单价（厘）
    const surplus = charge.surplus || 0;  // 浮动额（厘）
    const num = charge.num || 0;          // 数量

    let subtotal;
    if (isExceed == 0) {
      // 超阶：surplus 参与运算
      subtotal = (price + surplus) * num;
    } else {
      // 不超阶：仅 price
      subtotal = price * num;
    }

    return (subtotal / 1000).toFixed(3);
  },

  /**
   * ⭐ 计算费用总计（根据 isExceed 判断）
   * @param {array} charges 费用数组
   * @param {number} isExceed 超阶标识（0-超阶，1-不超阶）
   * @returns {string} 总计金额（元）
   */
  calculateTotal: function(charges, isExceed) {
    let total = 0;
    charges.forEach(charge => {
      total += parseFloat(this.calculateSubtotal(charge, isExceed));
    });
    return total.toFixed(3);
  }
};

// 使用示例
const charge = {
  name: '搬运费',
  price: 500,    // 0.5元（厘）
  surplus: 100,  // 0.1元（厘）
  num: 10
};

// 场景1：超阶（isExceed = 0）
const subtotal1 = MoneyUtils.calculateSubtotal(charge, 0);
console.log('超阶小计：' + subtotal1 + '元');  // 输出：超阶小计：6.000元

// 场景2：不超阶（isExceed = 1）
const subtotal2 = MoneyUtils.calculateSubtotal(charge, 1);
console.log('不超阶小计：' + subtotal2 + '元');  // 输出：不超阶小计：5.000元

// 计算总计（假设有多个费用项）
const charges = [charge, {...charge, name: '安装费'}];
const total1 = MoneyUtils.calculateTotal(charges, 0);
console.log('超阶总计：' + total1 + '元');  // 输出：超阶总计：12.000元

const total2 = MoneyUtils.calculateTotal(charges, 1);
console.log('不超阶总计：' + total2 + '元');  // 输出：不超阶总计：10.000元
```

---

## 注意事项

### 1. 认证参数

所有接口都需要携带认证参数（根据实际项目配置）：

```javascript
// 示例：在请求头中添加认证信息
header: {
  'content-type': 'application/json',
  'authentication': wx.getStorageSync('authentication') || ''
}
```

### 2. 数值精度

⚠️ **重要**：所有金额字段在前端和后端之间的转换

| 操作 | 前端 | 后端 | 转换方法 |
|-----|------|------|---------|
| 发送请求 | 元（0.5） | 厘（500） | `Math.round(值 × 1000)` |
| 接收响应 | 厘（500） | 元（0.500） | `(值 / 1000).toFixed(3)` |

**注意**：本项目已配置 API 自动转换，前端无需手动处理 ×1000 或 ÷1000 的转换。

### 3. ⭐ isExceed 超阶标识（关键业务规则）

⚠️ **最重要**：`surplus`（浮动额）是否参与计算，取决于外辅单的 `isExceed` 字段。

#### 业务规则

| isExceed 值 | 楼层类型 | surplus 参与计算 | 实际影响 |
|------------|---------|-----------------|---------|
| `0` | 超阶（高楼层） | ✅ 是 | 需要额外支付浮动费用 |
| `≠ 0` | 不超阶（正常楼层） | ❌ 否 | 不需要支付浮动费用 |

#### 微信小程序集成要点

**1. 查询外辅单时，必须获取 `isExceed` 字段**

```javascript
// ✅ 正确：查询时包含 isExceed
wx.request({
  url: api.queryOccessoriesByOid,
  data: {
    'occessories.oid': oid
  },
  success(res) {
    const isExceed = res.data.occessories.isExceed; // 保存此字段
    // 后续计算费用时需要使用
  }
});
```

**2. 计算费用时，必须根据 `isExceed` 判断**

```javascript
// ✅ 正确的计算方式
function calculateCharge(charge, isExceed) {
  const { price, surplus, num } = charge;

  if (isExceed == 0) {
    // 超阶：surplus 参与运算
    return (price + surplus) * num;
  } else {
    // 不超阶：仅 price
    return price * num;
  }
}

// ❌ 错误：直接使用 price + surplus
// 这样会导致不超阶时多算费用
return (price + surplus) * num; // 错误！
```

**3. 显示费用时，需要提示用户楼层类型**

```javascript
// 建议在页面显示楼层类型信息
const floorTypeText = isExceed == 0 ? '超阶（高楼层）' : '正常楼层';
console.log('楼层类型：', floorTypeText);
console.log('浮动额是否参与：', isExceed == 0 ? '是' : '否');
```

#### 常见错误

| 错误场景 | 错误代码 | 后果 |
|---------|---------|------|
| 不判断 `isExceed`，直接使用 `price + surplus` | `subtotal = (price + surplus) * num` | 不超阶时多算费用 |
| 前端未获取 `isExceed` 字段 | `const isExceed = 0;`（硬编码） | 所有订单都按超阶计算 |
| 后端未判断 `isExceed` | `chargeAmount = (price + surplus) * num` | 数据库中费用总额错误 |

### 4. 接口调用顺序

建议的调用顺序：

```
1. 查询外辅单列表（获取 oid）
   ↓
2. 查询外辅项列表（获取 oiid）
   ↓
3. 查询费用明细（queryOccessoriesCharge）
   ↓
4. 编辑费用明细
   ↓
5. 批量保存费用（batchOccessoriesCharge）
```

### 4. 错误码说明

| 错误码 | 说明 | 处理建议 |
|-------|------|---------|
| `0` | 成功 | - |
| `260023` | 外辅单不存在 | 检查 oid 是否正确 |
| `260024` | 外辅项不存在 | 检查 oiid 是否正确 |
| `260070` | 费用ID不能为空 | 检查是否传了 acid |
| `260071` | 外辅费用不存在 | 检查 acid 是否正确 |

### 5. 性能优化建议

- ✅ 使用 `batchOccessoriesCharge` 批量保存，避免循环调用 `addOccessoriesCharge`
- ✅ 查询时优先使用 `oiid`，减少不必要的数据返回
- ✅ 前端缓存已查询的费用数据，避免重复请求
- ❌ 避免在循环中调用接口

---

## 附录

### A. 完整的错误处理示例

```javascript
function queryChargeDetails(oiid) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.apiBaseUrl + 'queryOccessoriesCharge.do',
      method: 'POST',
      data: {
        'occessoriesCharge.occessoriesItem.oiid': oiid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'authentication': wx.getStorageSync('authentication')
      },
      success(res) {
        if (res.data.errorCode === 0) {
          resolve(res.data.occessoriesCharges || []);
        } else {
          // 根据错误码显示提示
          let errorMsg = '查询失败';
          switch (res.data.errorCode) {
            case 260024:
              errorMsg = '外辅项不存在';
              break;
            default:
              errorMsg = res.data.errorMsg || '查询失败';
          }
          wx.showToast({
            title: errorMsg,
            icon: 'none'
          });
          reject(res.data);
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

// 使用示例
queryChargeDetails(10001)
  .then(charges => {
    console.log('费用明细：', charges);
    // 处理费用数据...
  })
  .catch(err => {
    console.error('查询失败：', err);
  });
```

### B. 相关接口文档

- [外辅单管理接口](./API_OCESSORIES.md)
- [库存管理接口总览](./API_INVENTORY.md)
- [通用API调用规范](../docs/API.md)

---

**文档维护者**: AI 助手
**最后更新**: 2026-03-29
