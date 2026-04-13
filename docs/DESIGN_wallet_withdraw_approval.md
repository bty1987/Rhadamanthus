# 预付款提现审批流程 - 设计文档

> 创建时间：2026-04-12
> 状态：设计方案（待实施）
> 模块：11.Payment / 09.Approval
> 作者：AI Agent 设计分析

---

## 一、背景与目标

当前 AdvancePayment/Payment 模块中的 **提现功能**（`WalletServiceImpl.withdrawWallet`）直接扣减余额，没有审批环节。需要新增审批流程，在用户发起提现时先提交审批，审批通过后再执行实际扣款。

### 现状问题
- `withdrawWallet` 方法直接扣减余额，仅有一个 TODO 标记的银行卡操作占位
- 无审批环节，无法控制提现风险
- 需要对接钉钉审批通知

---

## 二、现有架构分析

### 2.1 关键表结构

**wallet 表**（钱包主表）：

| 字段 | 类型 | 说明 |
|------|------|------|
| wid | Long | 主键 |
| belonger | Long | FK -> buid（归属用户）|
| no | String | 钱包编号 |
| phone | String | 手机号 |
| identity | String | 身份标识 |
| balance | BigDecimal | 余额 |
| type | Integer | 类型：COMPANY/SUPPLIER/USER |
| status | Integer | 状态：INIT/BIND/FROZEN/CLOSE |

**walletran 表**（钱包流水）：

| 字段 | 类型 | 说明 |
|------|------|------|
| wtid | Long | 主键 |
| wallet | Long | FK -> wallet |
| type | Integer | 类型：RECHARGE=0, WITHDRAW=1, CONSUME=2, TRANSFER=3, REFUND=4 |
| amount | BigDecimal | 金额 |
| status | Integer | 状态 |

**advancepayment 表**（预付款）：

| 字段 | 类型 | 说明 |
|------|------|------|
| apId | Long | 主键 |
| decoration | Long | FK -> orderId |
| balance | BigDecimal | 余额 |
| projectBalance | BigDecimal | 工程余额 |
| materialBalance | BigDecimal | 主材余额 |
| zhenglinBalance | BigDecimal | 正林余额 |

### 2.2 现有审批模块

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
public static final int APPROVAL_TYPE_WITHDRAW_INT = 26;
```

### 3.2 新增子表：approvalwithdraw

| 字段 | 类型 | 说明 |
|------|------|------|
| awId | Long | 主键 |
| aid | Long | FK -> ApprovalPO.aid |
| withdrawId | Long | FK -> WalletranPO（提现流水ID）|
| amount | BigDecimal | 提现金额 |
| bankInfo | String | 银行卡信息 |
| status | Integer | 状态（预留扩展）|

对应建表 SQL：

```sql
CREATE TABLE `approvalwithdraw` (
  `awId` bigint(20) NOT NULL AUTO_INCREMENT,
  `aid` bigint(20) DEFAULT NULL COMMENT '审批主表ID',
  `withdrawId` bigint(20) DEFAULT NULL COMMENT '提现流水ID',
  `amount` decimal(10,2) DEFAULT NULL COMMENT '提现金额',
  `bankInfo` varchar(200) DEFAULT NULL COMMENT '银行卡信息',
  `status` int(11) DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`awId`),
  KEY `idx_aid` (`aid`),
  KEY `idx_withdrawId` (`withdrawId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批-提现子表';
```

### 3.3 新增后端文件

按照现有审批模块的分层规范，在 `09.Approval` 中新增：

| 层次 | 文件 | 说明 |
|------|------|------|
| Action | `ApprovalWithdrawAction.java` | API入口：submit/approve/refuse |
| Service | `ApprovalWithdrawService.java` | 接口定义 |
| ServiceImpl | `ApprovalWithdrawServiceImpl.java` | 核心逻辑实现 |
| DAO | `ApprovalWithdrawDAO.java` | 数据访问 |
| DAO Impl | `ApprovalWithdrawDAOImpl.java` | 数据访问实现 |
| PO | `ApprovalWithdrawPO.java` | 子表实体 |
| VO | `ApprovalWithdrawVO.java` | 视图传输对象 |

### 3.4 核心流程

#### 提交审批（submitApprovalForWithdraw）

```
1. 防重校验 —— 同一提现不可重复提交
2. 验证提现金额和钱包状态（余额是否充足、钱包是否正常）
3. 创建提现流水（walletran，type=WITHDRAW，状态设为"审批中"）
4. 创建审批主记录（ApprovalPO，type=26）
5. 创建审批子记录（ApprovalWithdrawPO）
6. 发送钉钉/站内通知
```

#### 审批通过回调（approveForWithdraw）

```
1. 更新审批状态 -> APPROVE
2. 执行实际余额扣减（调用 withdrawWallet 完成扣款）
3. 更新提现流水状态为"已完成"
4. 发送通过通知
```

#### 审批拒绝回调（refuseForWithdraw）

```
1. 更新审批状态 -> REFUSE
2. 回退提现流水状态（标记为"已拒绝"）
3. 发送拒绝通知
```

### 3.5 前端改造

**wallet.js**（`D:\GIT\Athena\11.Payment\Foreground\js\payment\wallet.js`）：

- 提现按钮点击后，由原来的直接调用 `withdrawWallet` 改为调用 `submitApprovalForWithdraw`
- 新增"审批中"状态的UI展示（禁用重复提交按钮）
- 新增审批记录查看入口

**approval.js** 中新增 API：

```javascript
// 提交提现审批
submitApprovalForWithdraw: function(params, callback) { ... }

// 查询提现审批详情
queryApprovalWithdraw: function(params, callback) { ... }
```

### 3.6 钉钉集成

与现有审批类型一致，通过 `code`/`forms` 参数支持钉钉微应用审批：

- 审批表单字段：提现金额、钱包类型、银行卡信息
- 审批链接跳转到方林办公系统内对应页面

---

## 四、关键文件清单

### 后端需要修改的文件

| 文件路径 | 修改内容 |
|---------|---------|
| `src/com/fanglin/approval/po/ApprovalPO.java` | 新增 APPROVAL_TYPE_WITHDRAW_INT = 26 |
| `src/com/fanglin/approval/action/ApprovalWithdrawAction.java` | **新增** |
| `src/com/fanglin/approval/service/ApprovalWithdrawService.java` | **新增** |
| `src/com/fanglin/approval/service/impl/ApprovalWithdrawServiceImpl.java` | **新增** |
| `src/com/fanglin/approval/dao/ApprovalWithdrawDAO.java` | **新增** |
| `src/com/fanglin/approval/dao/impl/ApprovalWithdrawDAOImpl.java` | **新增** |
| `src/com/fanglin/approval/po/ApprovalWithdrawPO.java` | **新增** |
| `src/com/fanglin/approval/vo/ApprovalWithdrawVO.java` | **新增** |

### 前端需要修改的文件

| 文件路径 | 修改内容 |
|---------|---------|
| `11.Payment/Foreground/js/payment/wallet.js` | 提现流程改为提交审批 |
| `11.Payment/Foreground/js/api/approval.js` | 新增提现审批 API |

### 数据库变更

| 操作 | 内容 |
|------|------|
| 新建表 | `approvalwithdraw` |
| 数据迁移 | ApprovalPO 新增 type=26 的常量定义（代码层面，无需SQL）|

---

## 五、注意事项

1. **现有 TODO**：`withdrawWallet` 方法中有多个 TODO（银行卡操作、`sn` 生成、`confirmWallet` 逻辑），实施时需一并处理
2. **实际打款**：提现审批通过后的实际打款操作（银行卡转账）需要对接银行接口，当前代码中为 TODO 状态
3. **并发控制**：需考虑同一钱包同时提交多笔提现审批时的余额校验，建议使用数据库行锁或乐观锁
4. **代码风格**：建议参考 `ApprovalDecorationRefundServiceImpl` 的完整实现模式，保持代码风格一致
5. **事务管理**：Service 层方法必须添加 `@Transactional(rollbackFor = Exception.class)`
6. **安全性**：提现金额需要二次校验，防止前端篡改

---

## 六、实施计划建议

| 阶段 | 内容 | 预估工作量 |
|------|------|-----------|
| P1 | 数据库建表 + PO/VO/DAO 层 | 0.5天 |
| P2 | Service 层核心逻辑（提交/通过/拒绝）| 1天 |
| P3 | Action 层 API + Struts 配置 | 0.5天 |
| P4 | 前端 wallet.js 改造 + approval.js API | 1天 |
| P5 | 钉钉通知集成 | 0.5天 |
| P6 | 联调测试 | 1天 |
| **合计** | | **4.5天** |

---

## 七、参考资料

- 审批模块文档：`src/com/fanglin/approval/CLAUDE.md`
- 支付模块文档：`src/com/fanglin/payment/CLAUDE.md`
- 参考实现：`ApprovalDecorationRefundServiceImpl`（装修退款审批）
- 项目开发规范：`AGENTS.md`
