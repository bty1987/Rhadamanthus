# 预付款提现审批流程 - 设计文档

> 创建时间：2026-04-12
> 状态：设计方案（待实施）
> 模块：11.Payment / 09.Approval
> 作者：AI Agent 设计分析

---

## 一、背景与目标

当前 Payment 模块中的 **预付款提现功能**（`PaymentServiceImpl.withdrawPayment`）直接扣减预付款余额并创建退款单，没有审批环节。需要新增审批流程，在用户发起预付款提现时先提交审批，审批通过后再执行实际扣款。

### 现状问题
- `withdrawPayment` 方法直接扣减 AdvancePayment 余额，立即创建 PaymentPO 和 AdvanceReceiptPO
- 无审批环节，无法控制预付款提现风险
- 需要对接钉钉审批通知

### 现有 `withdrawPayment` 流程分析

```
1. 校验客户 -> 校验装修订单 -> 查询预付款(AdvancePaymentPO)
2. 根据 paymentType 获取对应类型余额（合同/主材/工程/正林）
3. 校验余额是否 >= 提现金额
4. 直接扣减 AdvancePayment 余额
5. 创建 AdvanceReceiptPO（预付款收据）
6. 创建 PaymentPO（type=EXTRACT=0, status=PAID=1）
7. 更新 AdvancePaymentPO
8. 发送消息通知
```

---

## 二、现有架构分析

### 2.1 关键表结构

**advancepayment 表**（预付款，catalog=payment）：

| 字段 | 类型 | 说明 |
|------|------|------|
| apId | int | 主键 |
| orderId | String | FK -> decoration.orderId（关联装修订单）|
| balance | long | 合同预付款余额 |
| projectBalance | long | 工程预付款余额 |
| materialBalance | long | 主材预付款余额 |
| zhenglinBalance | long | 正林预付款余额 |

**payment 表**（支付流水，catalog=payment）：

| 字段 | 类型 | 说明 |
|------|------|------|
| pid | long | 主键 |
| arId | long | FK -> AdvanceReceiptPO（预付款收据）|
| orderId | String | 关联订单号 |
| customerId | long | FK -> customer.cid |
| balance | long | 余额 |
| recharge | long | 金额 |
| type | short | 类型：EXTRACT=0, COLLECTION=1, PAYMENT=2, RETURN=3 |
| paymentType | short | 款项类型：BALANCE=0, PROJECT=1, MATERIAL=2, ZATERIAL=3 |
| status | short | 状态：INIT=0, PAID=1, CONFIRMED=2, CANCELED=3 |
| company | int | 所属公司 |
| cuid | long | FK -> user.uid（创建人）|
| createTime | Timestamp | 创建时间 |
| uniqueid | String | 唯一标识 |

**advancereceipt 表**（预付款收据，catalog=payment）：

| 字段 | 类型 | 说明 |
|------|------|------|
| arId | long | 主键 |
| orderId | String | 关联订单号 |
| collecter | long | FK -> user.uid（收款人）|
| realMoney | long | 实际金额 |
| ... | ... | 其他收据字段 |

### 2.2 余额类型映射

`paymentType` 与 `advancepayment` 余额字段的对应关系（通过 `AdvancePaymentServiceImpl.getCustomerBalanceByType`）：

| paymentType | 常量 | advancepayment 字段 | 含义 |
|-------------|------|---------------------|------|
| 0 | BALANCE_TYPE_BALANCE_INT | balance | 合同预付款 |
| 1 | BALANCE_TYPE_PROJECT_INT | projectBalance | 工程预付款 |
| 2 | BALANCE_TYPE_MATERIAL_INT | materialBalance | 主材预付款 |
| 3 | BALANCE_TYPE_ZHENGLIN_INT | zhenglinBalance | 正林预付款 |

### 2.3 现有审批模块

审批模块（09.Approval）已有 **25种审批类型**（APPROVAL_TYPE_1 ~ 25），统一使用 **主表+子表** 模式。

**ApprovalPO**（审批主表）审批状态流转：

```
INIT(0) -> APPROVAL(1) -> APPROVE(3) -> CONFIRM(5) -> CONFIRMED(6)
                              |                          |
                           REFUSE(2)                 REJECT(7)
```

**参考实现**：`ApprovalDecorationRefundServiceImpl`（装修退款审批，type=5）

---

## 三、设计方案

### 3.1 新增审批类型

在 `ApprovalPO` 中新增常量：

```java
public static final short APPROVAL_TYPE_PAYMENT_WITHDRAW_INT = 26;
```

### 3.2 新增子表：approvalpaymentwithdraw

| 字段 | 类型 | 说明 |
|------|------|------|
| apwId | Long | 主键 |
| aid | Long | FK -> ApprovalPO.aid（审批主表ID）|
| orderId | String | 关联装修订单号 |
| paymentType | Short | 款项类型（0=合同/1=工程/2=主材/3=正林）|
| amount | Long | 提现金额 |
| comment | String | 提现说明 |
| status | Integer | 状态（预留扩展）|

对应建表 SQL：

```sql
CREATE TABLE `approvalpaymentwithdraw` (
  `apwId` bigint(20) NOT NULL AUTO_INCREMENT,
  `aid` bigint(20) DEFAULT NULL COMMENT '审批主表ID',
  `orderId` varchar(50) DEFAULT NULL COMMENT '装修订单号',
  `paymentType` smallint(6) DEFAULT NULL COMMENT '款项类型:0合同/1工程/2主材/3正林',
  `amount` bigint(20) DEFAULT NULL COMMENT '提现金额',
  `comment` varchar(200) DEFAULT NULL COMMENT '提现说明',
  `status` int(11) DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`apwId`),
  KEY `idx_aid` (`aid`),
  KEY `idx_orderId` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批-预付款提现子表';
```

### 3.3 新增后端文件

按照现有审批模块的分层规范，在 `09.Approval` 中新增：

| 层次 | 文件 | 说明 |
|------|------|------|
| Action | `ApprovalPaymentWithdrawAction.java` | API入口：submit/approve/refuse |
| Service | `ApprovalPaymentWithdrawService.java` | 接口定义 |
| ServiceImpl | `ApprovalPaymentWithdrawServiceImpl.java` | 核心逻辑实现 |
| DAO | `ApprovalPaymentWithdrawDAO.java` | 数据访问 |
| DAO Impl | `ApprovalPaymentWithdrawDAOImpl.java` | 数据访问实现 |
| PO | `ApprovalPaymentWithdrawPO.java` | 子表实体 |
| VO | `ApprovalPaymentWithdrawVO.java` | 视图传输对象 |

### 3.4 核心流程

#### 提交审批（submitApprovalForPaymentWithdraw）

```
1. 防重校验 —— 同一订单+同一款项类型，存在审批中的记录不可重复提交
2. 校验客户信息、装修订单、预付款记录是否存在
3. 根据 paymentType 获取对应类型的预付款余额
4. 校验余额是否 >= 提现金额
5. 预扣余额（冻结）—— 调用 setCustomerBalanceByType 扣减对应类型余额
6. 更新 AdvancePaymentPO
7. 创建审批主记录（ApprovalPO，type=26，status=INIT）
8. 创建审批子记录（ApprovalPaymentWithdrawPO，记录 orderId、paymentType、amount）
9. 发送钉钉/站内通知
```

> 注意：提交审批阶段 **立即预扣余额**，防止审批期间余额被其他操作重复使用。审批通过后创建正式的 PaymentPO 和 AdvanceReceiptPO；审批拒绝则回退余额。

#### 审批通过回调（approveForPaymentWithdraw）

```
1. 更新审批状态 -> APPROVE
2. 创建 AdvanceReceiptPO（预付款收据）
3. 创建 PaymentPO（type=EXTRACT=0, status=PAID=1）
4. 如果是主材预付款提现，更新装修单销售比例
5. 发送通过通知
```

> 注意：余额已在提交时预扣，审批通过时无需再次操作余额。

#### 审批拒绝回调（refuseForPaymentWithdraw）

```
1. 更新审批状态 -> REFUSE
2. 回退预扣余额 —— 调用 setCustomerBalanceByType 将金额加回对应类型余额
3. 更新 AdvancePaymentPO
4. 发送拒绝通知
```

### 3.5 前端改造

**payment.js**（`WebContent/js/payment/payment.js`）：

- **保留**原有直接提现功能（`withdrawPayment`），入口不变
- **新增**带审批的提现功能入口，调用 `submitApprovalForPaymentWithdraw`
- 两个提现功能在页面上并存，用户自行选择
- 新增"审批中"状态的UI展示（禁用重复提交按钮，展示审批状态）
- 新增审批记录查看入口

**payment.js API**（`WebContent/js/api/payment.js`）中新增：

```javascript
// 提交预付款提现审批
submitApprovalForPaymentWithdraw: {
    url: "submitApprovalForPaymentWithdraw.do",
    type: "update",
    tranargs: {
        args: ["payment.realMoney", "payment.cash", "payment.bank", "payment.checkv"]
    }
}

// 查询预付款提现审批详情
queryApprovalPaymentWithdraw: {
    url: "queryApprovalPaymentWithdraw.do",
    type: "query"
}
```

### 3.6 钉钉集成

与现有审批类型一致，通过 `code`/`forms` 参数支持钉钉微应用审批：

- 审批表单字段：装修订单号、款项类型（合同/主材/工程/正林）、提现金额、提现说明
- 审批链接跳转到方林办公系统内对应页面

---

## 四、关键文件清单

### 后端需要新增的文件

| 文件路径 | 说明 |
|---------|------|
| `src/com/fanglin/approval/action/ApprovalPaymentWithdrawAction.java` | API入口 |
| `src/com/fanglin/approval/service/ApprovalPaymentWithdrawService.java` | 接口定义 |
| `src/com/fanglin/approval/service/impl/ApprovalPaymentWithdrawServiceImpl.java` | 核心逻辑实现 |
| `src/com/fanglin/approval/dao/ApprovalPaymentWithdrawDAO.java` | 数据访问接口 |
| `src/com/fanglin/approval/dao/impl/ApprovalPaymentWithdrawDAOImpl.java` | 数据访问实现 |
| `src/com/fanglin/approval/po/ApprovalPaymentWithdrawPO.java` | 子表实体 |
| `src/com/fanglin/approval/vo/ApprovalPaymentWithdrawVO.java` | 视图传输对象 |

### 后端需要修改的文件

| 文件路径 | 修改内容 |
|---------|---------|
| `src/com/fanglin/approval/po/ApprovalPO.java` | 新增 APPROVAL_TYPE_PAYMENT_WITHDRAW_INT = 26 |

### 前端需要修改的文件

| 文件路径 | 修改内容 |
|---------|---------|
| `WebContent/js/payment/payment.js` | 提现流程（typeUpdate==0）改为提交审批 |
| `WebContent/js/api/payment.js` | 新增提现审批相关 API |

### 数据库变更

| 操作 | 内容 |
|------|------|
| 新建表 | `approvalpaymentwithdraw` |
| 数据迁移 | ApprovalPO 新增 type=26 的常量定义（代码层面，无需SQL）|

---

## 五、注意事项

1. **两套功能并存**：原有 `withdrawPayment`（直接提现）保留不动，新增带审批的提现为独立入口。页面上两个功能并存，用户自行选择
2. **余额预扣与回退**：提交审批时立即预扣余额（冻结），审批拒绝时需回退余额。需确保事务一致性，防止预扣成功但审批记录创建失败，或审批拒绝但余额回退失败
3. **实际打款**：提现审批通过后的实际打款操作（银行卡转账）仍需对接银行接口
4. **代码风格**：建议参考 `ApprovalDecorationRefundServiceImpl` 的完整实现模式，保持代码风格一致
5. **事务管理**：Service 层方法必须添加 `@Transactional(rollbackFor = Exception.class)`
6. **安全性**：提现金额需要二次校验，防止前端篡改
7. **防重提交**：同一订单同一款项类型，存在审批中的提现记录时，应阻止重复提交
8. **paymentType 兼容**：需支持全部4种款项类型（合同/工程/主材/正林），与现有 withdrawPayment 保持一致

---

## 六、实施计划建议

| 阶段 | 内容 | 预估工作量 |
|------|------|-----------:|
| P1 | 数据库建表 + PO/VO/DAO 层 | 0.5天 |
| P2 | Service 层核心逻辑（提交/通过/拒绝）| 1天 |
| P3 | Action 层 API + Struts 配置 | 0.5天 |
| P4 | 前端 payment.js 改造 + payment.js API | 1天 |
| P5 | 钉钉通知集成 | 0.5天 |
| P6 | 联调测试 | 1天 |
| **合计** | | **4.5天** |

---

## 七、参考资料

- 审批模块文档：`src/com/fanglin/approval/CLAUDE.md`
- 支付模块文档：`src/com/fanglin/payment/CLAUDE.md`
- 参考实现：`ApprovalDecorationRefundServiceImpl`（装修退款审批，type=5）
- 提现原始实现：`PaymentServiceImpl.withdrawPayment`（payment 模块）
- 余额操作工具：`AdvancePaymentServiceImpl.getCustomerBalanceByType` / `setCustomerBalanceByType`
- 项目开发规范：`AGENTS.md`
