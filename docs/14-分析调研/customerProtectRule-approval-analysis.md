# customerChance 保护规则审批流程分析报告

> 分析时间: 2026-04-13
> 分析范围: customerChance.js + CustomerProtectRule + 审批流程
> 分析人: AI Code Analyst

---

## 一、概述

`customerChance`（客户机会）模块是方林 ERP 系统中客户从"线索"到"签约"的核心流转模块。`CustomerProtectRule`（客户保护规则）在客户机会"转换"（即将客户机会转为装修订单）时发挥作用，用于判断该客户/房产是否存在正在被其他设计师/业务员保护的情况，并据此决定是直接转单、需要审批、还是无需保护直接创建新装修单。

---

## 二、核心实体状态机

### 2.1 CustomerChancePO 状态流转

```
INIT(0) ──初审──> APPROVE(2) ──确认──> CONFIRM(3) ──转换──> COMPLETE(4)
                                   │                    │
                                   │                    └──> FINISH(5) [关联已有装修单]
                                   │
                                   └──不匹配审批──> DISABLE(1)
```

| 状态值 | 常量名 | 含义 |
|--------|--------|------|
| 0 | STATUS_INIT_INT | 初始状态 |
| 1 | STATUS_DISABLE_INT | 已作废/不匹配 |
| 2 | STATUS_APPROVE_INT | 已初审 |
| 3 | STATUS_CONFIRM_INT | 已确认（可执行转换操作） |
| 4 | STATUS_COMPLETE_INT | 已完成（已转装修单） |
| 5 | STATUS_FINISH_INT | 已完成（关联已有装修单） |

### 2.2 CustomerSourcePO 关联状态

| 状态值 | 常量名 | 含义 |
|--------|--------|------|
| 2 | STATUS_APPROVE_ONE_INT | 初审通过 |
| 3 | STATUS_APPROVE_TWO_INT | 二审中（提交审批） |
| 4 | STATUS_CONFIRM_INT | 已确认 |
| 5 | STATUS_TRAN_INT | 已转单 |

---

## 三、CustomerProtectRule 保护规则详解

### 3.1 保护规则类型

| 类型值 | 常量名 | 含义 | 判定依据 | 时间基准 |
|--------|--------|------|----------|----------|
| 0 | TYPE_AREA_INT | 面积保护 | 房屋套内面积(innerArea) | 量房时间(measureTime) |
| 1 | TYPE_PAYMENT_ADVANCE_INT | 预付款保护 | 预付款金额 | 定金时间(depositTime) |
| 2 | TYPE_PAYMENT_DESIGN_INT | 设计费保护 | 设计费金额 | 定金时间(depositTime) |
| 3 | TYPE_DEPOSIT_INT | 定金保护 | 预付款+设计费 | 定金时间(depositTime) |
| 4 | TYPE_DUTY_INT | 岗位保护 | 业务员岗位匹配 | 装修单创建时间(createTime) |

### 3.2 保护规则实体结构（CustomerProtectRulePO）

```
customer.customerProtectRule 表
├── cprid        (PK, 规则ID)
├── title        (规则标题)
├── type         (类型: 0面积/1预付/2设计费/3定金/4岗位)
├── uppval       (上限值)
├── lowval       (下限值)
├── did          (FK, 关联岗位, 仅TYPE_DUTY时使用)
├── days         (保护天数, 面积规则×10000000, 金额规则×1000000)
├── cuid         (FK, 创建人)
├── createTime   (创建时间)
├── status       (0有效/1失效)
└── company      (所属公司)
```

### 3.3 保护规则匹配逻辑

`checkCustomerProtectRule` 方法（CustomerProtectRuleServiceImpl 第107-227行）的核心流程:

```
输入: hid(房产ID), cid(客户ID), duty.did(岗位ID)
                    │
                    ▼
        ┌── 查找已有装修单 ──┐
        │  1. 先按 hid 查找    │
        │  2. 未找到则按 cid   │
        └────────┬────────────┘
                 │
                 ▼
        ┌── 装修单不存在? ──> 返回空VO（无保护）──┐
        └────────┬────────────────────────────────┘
                 │ 存在
                 ▼
        ┌── 逐项检查5类规则 ──────────────────────┐
        │                                         │
        │  ① 面积规则: innerArea 匹配 lowval~uppval│
        │     保护期 = days/10000000 天            │
        │     起算 = measureTime                   │
        │                                         │
        │  ② 预付款规则: advanceAmount 匹配        │
        │     保护期 = days/1000000 天             │
        │     起算 = depositTime                   │
        │                                         │
        │  ③ 设计费规则: designAmount 匹配         │
        │     保护期 = days/1000000 天             │
        │     起算 = depositTime                   │
        │                                         │
        │  ④ 定金规则: (预付款+设计费) 匹配        │
        │     保护期 = days/1000000 天             │
        │     起算 = depositTime                   │
        │                                         │
        │  ⑤ 岗位规则: 当前用户岗位 vs 装修单业务员 │
        │     岗位相同 → 直接返回空（不触发保护）   │
        │     岗位不同 → 检查保护期                │
        └────────┬────────────────────────────────┘
                 │
                 ▼
        ┌── 取最大剩余天数的规则 ──> 返回匹配规则VO ──┐
        │   (包含 cprid, orderId, 剩余天数等)         │
        └─────────────────────────────────────────────┘
```

---

## 四、转换按钮完整流程分析

### 4.1 前端触发入口

转换按钮定义在 `customerChance.js` 第760行，仅当 `status == 3`（已确认）时显示:

```javascript
show: function(v) {
    return v.status == 3 && customerChance.depage != "source" && customerChance.detype == null;
}
```

### 4.2 完整流转图

```
用户点击"转换"按钮
        │
        ▼
┌── 前端验证 ──────────────┐
│  house.hid 不存在 → 报错  │
│  customer.cid 不存在 → 报错 │
└────────┬──────────────────┘
         │
         ▼
  调用 api.customer.checkCustomerProtectRule
  参数: hid, cid, duty.did
         │
         ▼
  ┌── 后端返回 rule ──────────────────────────────────────┐
  │                                                        │
  ├─ 情况A: rule.cprid 存在 && rule.orderId 存在           │
  │   含义: 触发保护规则，存在匹配的保护规则和关联装修单    │
  │   动作: 弹出 belongApproveModal（归属审批弹窗）        │
  │         → 提交装修单归属审批                           │
  │         → 审批通过后调用 finishCustomerChance           │
  │                                                        │
  ├─ 情况B: !rule.cprid && rule.orderId 存在               │
  │   含义: 未触发保护规则，但存在已有装修单                │
  │   动作: 1. 直接调用 tranDecorationBelong（转移归属）    │
  │         2. 调用 finishCustomerChance（关联已有装修单）  │
  │                                                        │
  └─ 情况C: rule.cprid 不存在 && rule.orderId 不存在       │
      含义: 无保护、无已有装修单，全新转单                  │
      动作: 弹出 changeModal → 调用 changeCustomerChance    │
            → 创建新装修单                                   │
  └────────────────────────────────────────────────────────┘
```

### 4.3 情况A：保护规则触发时的审批流程

```
belongApproveModal 弹窗
        │
        ▼
  选择审批人 (approvalUtils.initqueryApprovalUser type=3)
  填写审批批注
        │
        ▼
  belongApproval() 函数执行:
        │
        ▼
  调用 api.approval.submitApprovalForDecorationBelong
  参数:
    approval.receiver.userId  → 审批人
    approval.comment          → 批注
    approvalDecorationBelong.orderId   → 已有装修单号
    approvalDecorationBelong.belongType → 0 (设计归属)
    approvalDecorationBelongItems[0]:
      orderId, userId(belonger), did(部门), brid(分区)
      rate=1, defaultFlag=1
        │
        ▼
  提交成功后立即调用:
  api.customer.finishCustomerChance
  参数: ccid, orderId
  (将客户机会状态改为 COMPLETE，关联已有装修单)
        │
        ▼
  后端审批通过回调 (ApprovalDecorationBelongServiceImpl):
    → 更新装修单归属人信息
    → 将设计归属转移给当前客户机会的 belonger
```

### 4.4 情况B：无保护但有已有装修单

```
前端直接调用:
  1. api.decoration.tranDecorationBelong（同步）
     → 将装修单归属转移给 belonger(设计师) 和 creater(业务员)
  2. api.customer.finishCustomerChance
     → 客户机会关联已有装修单，状态改为 COMPLETE
```

### 4.5 情况C：全新转单（无保护、无已有装修单）

```
changeModal 弹窗
        │
        ▼
  选择装修单类型、房屋类型、房源类型等
        │
        ▼
  调用 api.customer.changeCustomerChance
  后端处理:
    1. 验证状态为 STATUS_CONFIRM_INT
    2. 构建 DecorationVO
    3. 如果 isCheck == CHECK → checkOverDecoration 检查重复
    4. 调用 decorationService.tranDecoration 创建新装修单
    5. 状态改为 STATUS_COMPLETE_INT
    6. 更新 customerProfile
    7. 发送消息通知
```

---

## 五、相关审批类型汇总

### 5.1 客户机会涉及的所有审批场景

| 审批场景 | 前端入口 | 后端方法 | 审批类型常量 |
|---------|---------|---------|-------------|
| 初审（提交审批） | approveModal | ApprovalCustomerSourceServiceImpl | APPROVAL_TYPE_CUSTOMER_SOURCE_INT |
| 直接初审 | directApproveModal | approveCustomerChance | 无审批流程，直接通过 |
| 一次审批 | firstApproveModal | ApprovalCustomerSourceServiceImpl | 审批类型 9 |
| 直接一次审批 | directFirstApproveModal | approveCustomerChance 变体 | 无审批流程 |
| **保护规则归属审批** | **belongApproveModal** | **ApprovalDecorationBelongServiceImpl** | **APPROVAL_TYPE_DECORATION_BELONG_INT (3)** |
| 转换审批 | changeModal | ApprovalCustomerChanceServiceImpl.submitApprovalForCustomerChance | APPROVAL_TYPE_CUSTOMER_CHANCE_INT |
| 不匹配审批 | disableModal | ApprovalCustomerChanceServiceImpl.submitApprovalForCustomerChanceToDisabled | APPROVAL_TYPE_CUSTOMER_CHANCE_DISABLED_INT |

---

## 六、问题分析

### 问题1: finishCustomerChance 在审批提交后立即调用（严重）

**位置**: customerChance.js 第1432-1435行

```javascript
com.post(api.approval.submitApprovalForDecorationBelong, options, function(res) {
    com.showAlert(com.info, "操作成功");
    com.post(api.customer.finishCustomerChance, { ... }); // ← 审批提交后立即执行
});
```

**问题描述**: 在保护规则触发后，用户提交了装修单归属审批。但 `finishCustomerChance`（将客户机会标记为已完成）是在审批**提交成功**后立即调用的，而不是在审批**通过**后调用。

**影响**:
- 客户机会状态立即变为 COMPLETE(4)，但实际上归属审批可能还未通过
- 如果审批被拒绝，客户机会已经标记为完成，无法回退
- 审批拒绝后，客户机会和装修单的状态不一致

**根本原因**: `finishCustomerChance` 应该放在 `ApprovalDecorationBelongServiceImpl.approveForDecorationBelong`（审批通过回调）中执行，而不是在前端提交成功后立即调用。

---

### 问题2: protect() 方法与 checkCustomerProtectRule() 逻辑不一致

**位置**: CustomerProtectRuleServiceImpl

**问题描述**: 存在两个功能类似但行为不同的方法:

| 方法 | 返回值 | 触发审批 | 直接转归属 |
|------|--------|---------|-----------|
| checkCustomerProtectRule() | 返回匹配规则信息 | 不触发 | 不触发 |
| protect() | 返回 boolean | 触发 | 触发 |

`protect()` 方法（第269-376行）在检测到保护时直接调用 `approvalDecorationBelongService.tranApprovalForDecorationBelong` 提交审批，而 `checkCustomerProtectRule()` 仅返回检查结果，由前端决定后续动作。

**影响**:
- 两条代码路径实现相同业务逻辑，维护困难
- 规则检查逻辑被复制了两次，如果修改一处容易遗漏另一处
- `protect()` 方法中的 days 除数（面积10000000、金额1000000）与 `checkCustomerProtectRule()` 中相同，但两处独立维护

---

### 问题3: Arith.div 除法魔数不一致

**位置**: CustomerProtectRuleServiceImpl 第140行 vs 第155行

```java
// 面积规则
int protectDays = Arith.div(areaRule.getDays(), 10000000);  // 除以 10000000

// 预付款规则
int protectDays = Arith.div(advanceRule.getDays(), 1000000); // 除以 1000000

// 设计费规则
int protectDays = Arith.div(designRule.getDays(), 1000000);  // 除以 1000000

// 定金规则
int protectDays = Arith.div(depositRule.getDays(), 1000000); // 除以 1000000

// 岗位规则
int protectDays = dutyRule.getDays();                         // 直接使用，不除
```

**问题描述**: `days` 字段存储时使用了不同的乘数编码（面积规则×10000000，金额规则×1000000），岗位规则不乘。这种"魔数编码"方式:
- 数据库中 days 值的含义不直观
- 不同规则类型的解码逻辑分散在代码中
- 如果数据库直接修改了 days 值，容易搞混乘数

---

### 问题4: tranCustomerChance 方法中存在重复的 checkOverDecoration 调用

**位置**: CustomerChanceServiceImpl 第859-862行

```java
if (customerChancePO.getIsCheck() == CustomerChancePO.ISCHECK_CHECK_INT) {
    decorationService.checkOverDecoration(customerSourcePO.getCustomer().getCid(), customerSourcePO.getHouse().getHid());
}
decorationService.checkOverDecoration(customerSourcePO.getCustomer().getCid(), customerSourcePO.getHouse().getHid(), company);
```

**问题描述**: 无论 `isCheck` 状态如何，带 company 参数的 `checkOverDecoration` 都会执行。`isCheck` 条件检查只控制了不带 company 参数的版本。这意味着:
- 当 `isCheck == IGNORE` 时，仍会执行带 company 的重复检查
- 两个重载方法的检查范围不同（一个无公司限制，一个有公司限制），语义不清晰

---

### 问题5: 审批提交时 customerChanceDao.update(customerSourcePO) 类型错误

**位置**: ApprovalCustomerChanceServiceImpl 第161行

```java
customerSourcePO.setStatus(CustomerSourcePO.STATUS_APPROVE_TWO_INT);
customerChanceDao.update(customerSourcePO);  // ← 用 customerChanceDao 更新 customerSourcePO
```

**问题描述**: 使用 `customerChanceDao` 来更新 `CustomerSourcePO` 对象。虽然在 Hibernate 中由于 Session 缓存，传入已经持久化的 PO 对象时 `update()` 调用可能不会出错（Hibernate 会根据对象的 class 自动路由），但这违反了 DAO 层的职责划分原则:
- 代码可读性差
- 如果 DAO 实现变更（例如改为 JDBC 模板），将直接报错
- 应该使用 `customerSourceDao.update(customerSourcePO)`

---

### 问题6: 前端转换按钮的异步竞态条件

**位置**: customerChance.js 第796-820行

```javascript
if (!rule.cprid && rule.orderId) {
    var flag = false;
    com.post(api.decoration.tranDecorationBelong, {...}, function(res) {
        flag = true;
    }, null, false);  // false = 同步AJAX

    if (!flag) return false;

    com.post(api.customer.finishCustomerChance, {...});
}
```

**问题描述**: 代码使用 `false` 参数强制 AJAX 同步执行以确保时序，但同步 AJAX:
- 在现代浏览器中已被标记为 deprecated
- 会导致浏览器 UI 冻结
- 应改为 Promise/async-await 模式或嵌套回调

---

### 问题7: protect() 方法中装修单状态检查不完整

**位置**: CustomerProtectRuleServiceImpl 第290-294行

```java
if (Arrays.asList(STATUS_PROSIGN_INT, STATUS_SIGNED_INT, STATUS_RESIGNED_INT, STATUS_COMPLETED_INT).contains(decorationPO.getStatus())) {
    throw new FLException(140004, "装修单状态不可操作");
}
```

**问题描述**: 这里抛出异常阻止了保护检查，但 `checkCustomerProtectRule()` 方法中没有对装修单状态进行同样的检查。这意味着:
- `checkCustomerProtectRule()` 可能对一个状态不可操作的装修单返回保护规则
- 前端基于此结果弹出了审批弹窗，但审批提交后后端会因为装修单状态不可操作而失败
- 两个方法对同一装修单的行为不一致

---

### 问题8: 审批拒绝后客户机会状态无法恢复

**位置**: ApprovalCustomerChanceServiceImpl.refuseForCustomerChance

当审批类型为"客户机会转装修单"的审批被拒绝时:
- `customerSourcePO` 状态从 `STATUS_APPROVE_TWO_INT` 恢复到 `STATUS_CONFIRM_INT`
- 但 `customerChancePO` 的状态未做任何恢复

而在"保护规则归属审批"（belongApproval）被拒绝时:
- 仅装修单归属不变
- 但客户机会已经在前端提交时被 `finishCustomerChance` 标记为 COMPLETE
- **完全无法恢复**

---

### 问题9: 岗位规则中直接分配归属的逻辑遗漏

**位置**: CustomerProtectRuleServiceImpl 第356-359行

```java
if (decorationPO.getSalesman().getDuty().getDid() == userPO.getDuty().getDid()) {
    decorationBelongService.tranDecorationBelong(...);  // 岗位匹配 → 直接分配
    return false;
}
```

**问题描述**: 在 `protect()` 方法中，当业务员岗位匹配时直接调用 `tranDecorationBelong` 转移归属。但这个操作:
- 没有事务保护（方法级别没有 `@Transactional`）
- 没有记录操作日志
- 直接修改了装修单归属，用户无感知

在 `checkCustomerProtectRule()` 中（第202-204行），相同判断直接返回空 VO（不触发保护），但**不做归属转移**。这意味着:
- 调用 `checkCustomerProtectRule` 路径时，岗位匹配的客户不会自动获得归属
- 调用 `protect()` 路径时，岗位匹配的客户会自动获得归属
- 两条路径行为不一致

---

### 问题10: 消息通知格式字符串参数不匹配

**位置**: CustomerChanceServiceImpl.approveCustomerChance 第962行

```java
String content = String.format("客户机会直接初审通过,客户名:%s,楼盘:%s %s %s",
    customerSourcePO.getName(),
    villagePO.getCityProper().getCity().getName(),
    villagePO.getCityProper().getName(),
    villagePO.getName(),
    housePO.getHouseNumber());  // ← 5个参数但只有4个 %s
```

**问题描述**: 格式字符串有4个 `%s` 占位符，但传入了5个参数。`housePO.getHouseNumber()` 的值会被忽略，导致消息中缺少房号信息。

---

## 七、架构层面问题总结

### 7.1 职责划分不清

| 组件 | 当前职责 | 建议职责 |
|------|---------|---------|
| checkCustomerProtectRule() | 仅查询规则，不做业务操作 | ✓ 正确 |
| protect() | 查询规则 + 提交审批 + 转移归属 | 应拆分为: 查询、执行 |
| 前端 belongApproval() | 提交审批 + 立即完成机会 | 应仅提交审批 |
| finishCustomerChance() | 被前端在不当时机调用 | 应由审批回调触发 |

### 7.2 代码重复

`checkCustomerProtectRule()` 和 `protect()` 中的5类规则检查逻辑几乎完全相同，应抽取为公共方法。

### 7.3 状态一致性风险

客户机会的状态转换部分由前端驱动，部分由后端审批回调驱动。特别是保护规则场景下，前端在审批提交时就修改了客户机会状态，但审批可能被拒绝。

---

## 八、改进建议

### 建议1: 将 finishCustomerChance 移入审批回调（高优先级）

将 `finishCustomerChance` 的调用从前端 `belongApproval()` 中移除，放入 `ApprovalDecorationBelongServiceImpl.approveForDecorationBelong`（审批通过回调）中执行。同时在 `refuseForDecorationBelong`（审批拒绝回调）中添加客户机会状态恢复逻辑。

### 建议2: 统一保护规则检查入口

将 `checkCustomerProtectRule()` 和 `protect()` 的规则匹配逻辑抽取为私有方法 `matchProtectRules(decorationPO, dutyId)`，两个方法复用同一逻辑。

### 建议3: 消除 days 魔数编码

在 CustomerProtectRulePO 中增加 `getProtectDays()` 方法，根据 type 自动应用正确的除数，外部调用统一使用该方法。

### 建议4: 修复 customerChanceDao.update(customerSourcePO) 类型错误

将第161行改为 `customerSourceDao.update(customerSourcePO)`。

### 建议5: 修复 String.format 参数不匹配

第962行增加第5个 `%s`，或使用5个参数的格式字符串。

### 建议6: 增加装修单状态前置检查

在 `checkCustomerProtectRule()` 方法中增加与 `protect()` 一致的装修单状态检查，避免返回不可操作的装修单信息。

---

## 九、涉及文件清单

| 文件路径 | 行数 | 作用 |
|---------|------|------|
| Rhadamanthus/WebContent/js/customer/customerChance.js | 1603 | 前端主模块 |
| Rhadamanthus/src/com/fanglin/customer/po/CustomerChancePO.java | - | 客户机会实体 |
| Rhadamanthus/src/com/fanglin/customer/po/CustomerProtectRulePO.java | 208 | 保护规则实体 |
| Rhadamanthus/src/com/fanglin/customer/service/impl/CustomerChanceServiceImpl.java | 971 | 客户机会服务实现 |
| Rhadamanthus/src/com/fanglin/customer/service/impl/CustomerProtectRuleServiceImpl.java | 378 | 保护规则服务实现 |
| Rhadamanthus/src/com/fanglin/approval/service/impl/ApprovalCustomerChanceServiceImpl.java | 351 | 客户机会审批服务 |
| Rhadamanthus/src/com/fanglin/customer/dao/CustomerProtectRuleDao.java | - | 保护规则DAO接口 |
| Rhadamanthus/src/com/fanglin/customer/dao/CustomerProtectRuleDaoImpl.java | - | 保护规则DAO实现 |

---

## 十、流程总结图

```
                          客户机会生命周期
                              
  创建(INIT) → 发放 → 初审(APPROVE) → 确认(CONFIRM) → 转换
                                                       │
                                          ┌────────────┼────────────┐
                                          │            │            │
                                     保护规则检查  无保护有装修单  无保护无装修单
                                          │            │            │
                                    ┌─────┼─────┐  直接转移归属  创建新装修单
                                    │           │  finishChance   changeChance
                               触发保护     未触发保护
                                    │           │
                              归属审批弹窗   直接转移归属
                                    │        finishChance
                              提交审批
                              finishChance ← ⚠️ 应在审批通过后执行
                                    │
                              ┌─────┼─────┐
                              │           │
                          审批通过     审批拒绝
                              │           │
                          归属生效     归属不变
                          finishChance  chance状态未变
```

---

## 十一、修复记录

> 修复时间: 2026-04-13
> 修复人: AI Code Analyst

### 修复1: finishCustomerChance 从审批提交回调移到审批通过回调 (严重)

**问题**: `finishCustomerChance` 在前端 `belongApproval()` 的审批提交成功回调中调用，导致审批尚未通过时客户机会已被标记为 COMPLETE，审批拒绝后状态不可恢复。

**修改文件**:

| 文件 | 修改内容 |
|------|---------|
| `customerChance.js` 第1428-1435行 | 移除 `com.post(api.customer.finishCustomerChance, ...)` 调用，提示改为"操作成功, 等待审批通过" |
| `ApprovalDecorationBelongServiceImpl.java` 第323-329行 | 在 `approveForDecorationBelong` 方法中新增 finishCustomerChance 逻辑：通过 `customerChanceDao.queryCustomerChance(orderId)` 查找关联客户机会，确认状态为 CONFIRM(3) 后更新为 COMPLETE(4)，并记录操作日志 |

**修复后流程**:
```
提交审批 → 审批通过回调 → finishCustomerChance → 状态改为 COMPLETE
提交审批 → 审批拒绝 → 客户机会状态不变（仍为 CONFIRM）
```

---

### 修复2: checkCustomerProtectRule 增加装修单状态检查 (高)

**问题**: `checkCustomerProtectRule()` 不检查装修单状态，可能对不可操作的装修单返回保护规则，导致前端弹出审批弹窗后后端审批失败。

**修改文件**:

| 文件 | 修改内容 |
|------|---------|
| `CustomerProtectRuleServiceImpl.java` 第128-136行 | 在 `checkCustomerProtectRule()` 中查找装修单后增加两段状态检查：(1) PROSIGN/SIGNED/RESIGNED/COMPLETED 状态返回空VO；(2) WASTE/TERMINATION/FINAL 状态或已决算状态返回空VO。与 `protect()` 方法行为对齐 |

---

### 修复3: tranCustomerChance 重复 checkOverDecoration 调用 (中)

**问题**: `tranCustomerChance` 中 `checkOverDecoration` 被调用两次（条件调用无 company 参数版 + 无条件调用有 company 参数版），前者被后者完全覆盖。

**修改文件**:

| 文件 | 修改内容 |
|------|---------|
| `CustomerChanceServiceImpl.java` 第859-862行 | 移除有条件的 `checkOverDecoration(cid, hid)` 调用，仅保留 `checkOverDecoration(cid, hid, company)` |

---

### 修复4: customerChanceDao.update(customerSourcePO) 类型错误 (高)

**问题**: 使用 `customerChanceDao` 更新 `CustomerSourcePO` 对象，违反 DAO 职责划分。

**修改文件**:

| 文件 | 修改内容 |
|------|---------|
| `ApprovalCustomerChanceServiceImpl.java` 第161行 | 将 `customerChanceDao.update(customerSourcePO)` 改为 `customerSourceDao.update(customerSourcePO)` |

---

### 修复5: 前端同步 AJAX 改为异步回调 (低)

**问题**: 情况B（无保护但有已有装修单）中使用同步 AJAX (`com.post(..., null, false)`)，在现代浏览器中已 deprecated 且会阻塞 UI。

**修改文件**:

| 文件 | 修改内容 |
|------|---------|
| `customerChance.js` 第796-814行 | 将同步 AJAX + flag 变量模式改为异步嵌套回调模式：`tranDecorationBelong` 回调中直接调用 `finishCustomerChance` |

---

### 修复6: String.format 参数数量不匹配 (低)

**问题**: `approveCustomerChance` 方法中消息格式字符串有4个 `%s` 但传入5个参数，`housePO.getHouseNumber()` 被丢弃。

**修改文件**:

| 文件 | 修改内容 |
|------|---------|
| `CustomerChanceServiceImpl.java` 第959行 | 格式字符串从 `"%s %s %s"` 改为 `"%s %s %s %s"`，匹配5个参数 |

---

### 修改文件汇总

| 文件路径 | 修改类型 |
|---------|---------|
| `Rhadamanthus/WebContent/js/customer/customerChance.js` | 前端修复 (f1+f6) |
| `Rhadamanthus/src/com/fanglin/approval/service/impl/ApprovalDecorationBelongServiceImpl.java` | 后端新增逻辑 (f1) |
| `Rhadamanthus/src/com/fanglin/customer/service/impl/CustomerChanceServiceImpl.java` | 后端修复 (f4+f10) |
| `Rhadamanthus/src/com/fanglin/approval/service/impl/ApprovalCustomerChanceServiceImpl.java` | 后端修复 (f5) |
| `Rhadamanthus/src/com/fanglin/customer/service/impl/CustomerProtectRuleServiceImpl.java` | 后端修复 (f2) |
