# 客户保护规则 — 岗位规则合尺改造说明文档

> 日期: 2026-04-14
> 涉及仓库: Rhadamanthus(后端), Green/Office(小程序前端)

---

## 一、背景与目标

### 1.1 问题描述

Office 微信小程序在转单流程中调用 `checkCustomerProtectRule.do` 时，`duty.did` 参数缺失（后端 `CustomerChancePO.ptv()` 中 belonger 使用无参构造导致 duty 为 null），导致岗位保护规则（type=4）完全失效。

### 1.2 需求变更

岗位规则触发后，将原有的"替换"逻辑改为"合尺"逻辑（新旧业务员同时生效，各占 500‰）。

### 1.3 合尺三场景

| 场景 | 条件 | 合尺方式 | mergeFlag |
|------|------|----------|-----------|
| 场景1 | 原业务员岗位 == 新业务员岗位 | 直接合尺，不走审批 | 1 |
| 场景2 | 原业务员岗位 != 新业务员岗位 + 保护期内 | 审批通过后合尺 | 1 |
| 场景3 | 原业务员岗位 != 新业务员岗位 + 过保护期/无规则 | 待客户确认后合尺 | 2 |

---

## 二、Bug 修复

### Bug1: belonger.duty 为 null

**根因**: `CustomerChanceServiceImpl.java` 第208行，`belonger` 使用 `new UserBaseVO()` 无参构造，duty 为 null，导致前端传给 `checkCustomerProtectRule.do` 的 `duty.did` 为空。

**后端修复** (`CustomerChanceServiceImpl.java`):
```java
// 修改前
belonger = new UserBaseVO()

// 修改后
belonger = new UserBaseVO(new DutyVO())
```

**前端修复** (`detail.js`): option 对象增加 `duty.did` 参数:
```javascript
"customerProtectRule.duty.did": that.data.customerChance.belonger.duty.did
```

### Bug2: tranDecorationBelong 缺少 salesman 归属

**根因**: 前端分支2调 `tranDecorationBelong.do` 时只传了 designer(type=0)，缺少 salesman(type=1)。

**修复** (`detail.js`): 补传 `decorationBelongs[1]`:
```javascript
"decorationBelongs[1].belonger.userId": that.data.customerChance.creater.userId,
"decorationBelongs[1].type": 1
```

---

## 三、后端改动（7个文件）

### 3.1 新增 VO 字段

| 文件 | 改动 |
|------|------|
| `CustomerProtectRuleVO.java` | 新增 `mergeFlag`(Short) 字段 + getter/setter |
| `ApprovalDecorationBelongVO.java` | 新增 `mergeFlag`(Short) 字段 + getter/setter |

### 3.2 新增 PO 字段

| 文件 | 改动 |
|------|------|
| `ApprovalDecorationBelongPO.java` | 新增 `mergeFlag`(short) 字段 + getter/setter |

### 3.3 Service 层

| 文件 | 改动 |
|------|------|
| `DecorationBelongService.java` | 接口新增 `mergeDecorationBelong()` 和 `confirmMergeDecorationBelong()` |
| `DecorationBelongServiceImpl.java` | 实现两个合尺方法：原归属 rate 1000→500，新归属 rate=500 status=0(直接有效) 或 status=2(待确认) |
| `ApprovalDecorationBelongService.java` | 新增带 mergeFlag 参数的 `tranApprovalForDecorationBelong` 重载 |
| `ApprovalDecorationBelongServiceImpl.java` | 审批通过时 mergeFlag=1 走合尺逻辑(改rate不失效，新归属rate=500，不清Addition，不覆盖主归属) |

### 3.4 业务逻辑改动

**`CustomerProtectRuleServiceImpl.java`** — checkCustomerProtectRule 方法岗位规则部分：

```
原逻辑:
  同岗位 → 返回空VO(不触发保护)
  保护期内 → maxRuleVO(有cprid) → 走审批替换
  过保护期 → customerProtectRuleVO(无cprid有orderId) → 直接替换

新逻辑:
  同岗位 → mergeFlag=1, 返回customerProtectRuleVO(有orderId无cprid) → 直接合尺
  保护期内 → mergeFlag=1, maxRuleVO(有cprid) → 审批后合尺
  过保护期 → mergeFlag=2, customerProtectRuleVO(有orderId无cprid) → 待确认合尺
```

### 3.5 Action 层

**`DecorationBelongAction.java`** — 新增两个接口:

| Action URL | 说明 |
|------------|------|
| `mergeDecorationBelong.do` | 直接合尺（同岗位场景），循环处理 decorationBelongs |
| `confirmMergeDecorationBelong.do` | 待确认合尺（过保护期场景），循环处理 decorationBelongs |

---

## 四、前端改动（2个文件）

### 4.1 detail.js — 转单入口

checkCustomerProtectRule 返回后的三分支逻辑改造:

| 分支 | 原条件 | 新条件 | 改动 |
|------|--------|--------|------|
| 分支1 | 有cprid+orderId → transition审批 | 有cprid+orderId → transition审批 | URL增加 mergeFlag 参数 |
| 分支2 | 无cprid+orderId → tranDecorationBelong(替换) | 无cprid+orderId → 按 mergeFlag 区分: mergeFlag=1调mergeDecorationBelong, mergeFlag=2调confirmMergeDecorationBelong, mergeFlag=0调原tranDecorationBelong |
| 分支3 | 都没有 → 正常转单 | 不变 | 无 |

### 4.2 transition.js — 审批页面

| 改动点 | 说明 |
|--------|------|
| onLoad | 接收 `options.mergeFlag` 存入 page data |
| approval() | 提交审批时传 `approvalDecorationBelong.mergeFlag` 给后端 |

---

## 五、数据库变更

```sql
-- 审批归属表增加合尺标记
ALTER TABLE approval.approvaldecorationbelong 
  ADD COLUMN mergeFlag smallint DEFAULT 0 COMMENT '合尺标记: 0=替换, 1=合尺';
```

SQL 文件位置: `docs/sql/V_merge_decoration_belong.sql`

---

## 六、合尺调用链路

```
用户点击转单
  │
  ├─ detail.js 调用 checkCustomerProtectRule.do
  │
  ├─ 同岗位 (mergeFlag=1, 无cprid, 有orderId)
  │   └─ mergeDecorationBelong.do
  │       └─ 原归属rate 1000→500
  │       └─ 新增归属 rate=500, status=0(有效)
  │
  ├─ 异岗位+保护期内 (mergeFlag=1, 有cprid, 有orderId)
  │   └─ transition审批页
  │       └─ submitApprovalForDecorationBelong.do (带mergeFlag=1)
  │           └─ 审批通过时走合尺逻辑
  │               └─ 原归属rate→500, 不失效
  │               └─ 新归属rate=500
  │               └─ 不清Addition, 不覆盖主归属
  │
  ├─ 异岗位+过保护期 (mergeFlag=2, 无cprid, 有orderId)
  │   └─ confirmMergeDecorationBelong.do
  │       └─ 原归属rate 1000→500
  │       └─ 新增归属 rate=500, status=2(待确认)
  │
  └─ 非岗位规则触发 (mergeFlag=0)
      └─ tranDecorationBelong.do (原有替换逻辑不变)
```

---

## 七、注意事项

1. **枚举命名误导**: `DecorationBelongPO.STATUS_INVALID_INT=0` 实际是"有效"，`STATUS_EFFCTIVE_INT=1` 实际是"失效"，全项目引用不改名。

2. **合尺比例**: 默认 500:500，后续可通过其他功能调整。

3. **合尺不修改主归属**: 合尺模式下不修改 `decorationPO` 的 `designer`/`salesman` 字段，不清空 `DecorationAddition`。

4. **salesman 取值**: PC 端用 `v.creater.userId`，小程序用 `customerChance.creater.userId`。

5. **protect() 方法未被外部调用**: 不在 `CustomerProtectRuleService` 接口上暴露，前端走自己的分支逻辑，所以合尺逻辑需要在 checkCustomerProtectRule 返回值和前端两处同时实现。

---

## 八、修改文件清单

### 后端 (Rhadamanthus) — 12个文件

| # | 文件路径 | 改动类型 |
|---|----------|----------|
| 1 | `src/com/fanglin/customer/vo/CustomerProtectRuleVO.java` | 新增 mergeFlag 字段 |
| 2 | `src/com/fanglin/customer/service/impl/CustomerProtectRuleServiceImpl.java` | checkCustomerProtectRule 岗位规则合尺 |
| 3 | `src/com/fanglin/customer/service/impl/CustomerChanceServiceImpl.java` | Bug1: belonger 改为带 DutyVO 构造 |
| 4 | `src/com/fanglin/approval/po/ApprovalDecorationBelongPO.java` | 新增 mergeFlag 字段 |
| 5 | `src/com/fanglin/approval/vo/ApprovalDecorationBelongVO.java` | 新增 mergeFlag 字段 |
| 6 | `src/com/fanglin/approval/service/ApprovalDecorationBelongService.java` | 新增重载方法 |
| 7 | `src/com/fanglin/approval/service/impl/ApprovalDecorationBelongServiceImpl.java` | 审批通过时合尺逻辑 |
| 8 | `src/com/fanglin/decoration/service/DecorationBelongService.java` | 新增合尺接口 |
| 9 | `src/com/fanglin/decoration/service/impl/DecorationBelongServiceImpl.java` | 合尺方法实现 |
| 10 | `src/com/fanglin/decoration/action/DecorationBelongAction.java` | 新增 mergeDecorationBelong + confirmMergeDecorationBelong |
| 11 | `WebContent/js/customer/customerChance.js` | PC端配合改动 |
| 12 | `docs/sql/V_merge_decoration_belong.sql` | 数据库变更脚本 |

### 前端 (Office) — 2个文件

| # | 文件路径 | 改动类型 |
|---|----------|----------|
| 1 | `pages/customer/chance/detail/detail.js` | Bug修复 + 合尺分支适配 |
| 2 | `pages/customer/chance/transition/transition.js` | 接收并传递 mergeFlag |
