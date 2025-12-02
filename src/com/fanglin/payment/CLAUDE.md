# payment - 支付管理模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com.fanglin](../) > **payment**

> 最后更新：2025-12-01 15:28:48

---

## 模块职责

支付管理模块负责整个 ERP 系统的收款、付款、退款等资金流管理，是财务核心模块之一。该模块集成了多种支付渠道（银盛支付、威富通、微信支付等），并提供了完整的账户管理和资金对账功能。

**核心功能**
- 装饰订单收款管理
- 主材订单收款管理
- 收款单与收据管理
- 退款管理
- 代收代付管理
- 电子钱包管理
- 对账单管理
- 支付活动管理

---

## 入口与启动

### 主要 Action 控制器
| Action 类 | 职责 | 关键功能 |
|----------|------|----------|
| `PaymentAction.java` | 支付主控制器 | 支付订单创建、支付状态查询 |
| `DecorationPaymentAction.java` | 装饰订单收款 | 装饰订单的收款管理 |
| `SalesPaymentAction.java` | 主材订单收款 | 主材订单的收款管理 |
| `ReceiptAction.java` | 收据管理 | 收据打印、收据查询 |
| `WalletAction.java` | 电子钱包 | 钱包充值、余额查询、消费记录 |
| `StatementAction.java` | 对账单 | 生成对账单、对账确认 |
| `ProxyPaymentAction.java` | 代收代付 | 代收代付业务管理 |
| `PaymentActivityAction.java` | 支付活动 | 支付优惠活动、满减活动 |

### 前端页面路径
```
WebContent/views/payment/
├── payment.html                - 支付管理
├── decoration_payment.html     - 装饰订单收款
├── sales_payment.html          - 主材订单收款
├── receipt.html                - 收据管理
├── wallet.html                 - 电子钱包
├── statement.html              - 对账单
└── refund.html                 - 退款管理
```

---

## 对外接口

### REST API 接口

#### 支付管理
```
POST /createPayment.do          - 创建支付订单
GET  /queryPaymentStatus.do     - 查询支付状态
POST /cancelPayment.do          - 取消支付
GET  /pagePayment.do            - 分页查询支付记录
```

#### 装饰订单收款
```
GET  /pageDecorationPayment.do  - 查询装饰订单收款列表
POST /addDecorationPayment.do   - 添加收款记录
POST /updateDecorationPayment.do - 更新收款状态
POST /confirmDecorationPayment.do - 确认收款
```

#### 主材订单收款
```
GET  /pageSalesPayment.do       - 查询主材订单收款列表
POST /addSalesPayment.do        - 添加收款记录
POST /updateSalesPayment.do     - 更新收款状态
```

#### 收据管理
```
GET  /pageReceipt.do            - 查询收据列表
POST /generateReceipt.do        - 生成收据
POST /printReceipt.do           - 打印收据
POST /invalidReceipt.do         - 作废收据
```

#### 电子钱包
```
GET  /queryWallet.do            - 查询钱包余额
POST /rechargeWallet.do         - 钱包充值
POST /withdrawWallet.do         - 钱包提现
GET  /queryWalletTransaction.do - 查询钱包交易记录
```

#### 对账单
```
GET  /pageStatement.do          - 查询对账单列表
POST /generateStatement.do      - 生成对账单
POST /confirmStatement.do       - 确认对账
POST /exportStatement.do        - 导出对账单
```

#### 退款管理
```
GET  /pageRefund.do             - 查询退款列表
POST /applyRefund.do            - 申请退款
POST /approveRefund.do          - 审批退款
POST /executeRefund.do          - 执行退款
```

---

## 关键依赖与配置

### 服务层依赖
- `PaymentService` - 支付核心服务
- `DecorationPaymentService` - 装饰订单收款服务
- `SalesPaymentService` - 主材订单收款服务
- `ReceiptService` - 收据服务
- `WalletService` - 电子钱包服务
- `StatementService` - 对账单服务
- `ProxyPaymentService` - 代收代付服务
- `PaymentActivityService` - 支付活动服务

### 外部模块依赖
| 依赖模块 | 用途 |
|---------|------|
| `decoration` | 关联装饰订单的收款 |
| `sales` | 关联主材订单的收款 |
| `balance` | 与财务结算模块集成 |
| `yspay` | 银盛支付接口 |
| `swiftpass` | 威富通支付接口 |
| `wechat` | 微信支付接口 |
| `approval` | 退款审批流程 |
| `customer` | 客户钱包关联 |

### 配置参数
支付管理模块的配置存储在系统配置和支付渠道配置中，包括：
- 支付渠道配置（银盛、威富通、微信等）
- 支付超时时间配置
- 退款审批流程配置
- 对账周期配置

---

## 数据模型

### 核心实体 (PO)

#### PaymentPO - 支付订单
```java
@Entity
@Table(name = "payment")
public class PaymentPO {
    private long pid;                    // 支付 ID
    private String paymentNo;            // 支付单号
    private String orderId;              // 关联订单 ID
    private String orderType;            // 订单类型（装饰/主材）
    private long amount;                 // 支付金额
    private String paymentMethod;        // 支付方式（现金/转账/微信/支付宝等）
    private String paymentChannel;       // 支付渠道（银盛/威富通）
    private String transactionNo;        // 第三方交易号
    private Timestamp paymentTime;       // 支付时间
    private Timestamp createTime;        // 创建时间
    private UserPO collector;            // 收款人
    private short status;                // 状态（待支付/已支付/已取消/已退款）
    private String remark;               // 备注
}
```

#### DecorationPaymentPO - 装饰订单收款
```java
@Entity
@Table(name = "decoration_payment")
public class DecorationPaymentPO {
    private long dpid;                   // 收款 ID
    private String orderId;              // 关联装饰订单 ID
    private String paymentNo;            // 收款单号
    private long amount;                 // 收款金额
    private String paymentType;          // 收款类型（定金/首款/进度款/尾款）
    private String paymentMethod;        // 支付方式
    private Timestamp paymentTime;       // 收款时间
    private UserPO collector;            // 收款人
    private String receiptNo;            // 收据号
    private short confirmed;             // 是否确认（0:未确认, 1:已确认）
    private String remark;               // 备注
}
```

#### SalesPaymentPO - 主材订单收款
```java
@Entity
@Table(name = "sales_payment")
public class SalesPaymentPO {
    private long spid;                   // 收款 ID
    private String salesId;              // 关联主材订单 ID
    private String paymentNo;            // 收款单号
    private long amount;                 // 收款金额
    private String paymentMethod;        // 支付方式
    private Timestamp paymentTime;       // 收款时间
    private UserPO collector;            // 收款人
    private String receiptNo;            // 收据号
    private short confirmed;             // 是否确认
}
```

#### ReceiptPO - 收据
```java
@Entity
@Table(name = "receipt")
public class ReceiptPO {
    private long rid;                    // 收据 ID
    private String receiptNo;            // 收据号
    private String paymentNo;            // 关联收款单号
    private CustomerPO customer;         // 客户
    private long amount;                 // 金额
    private String purpose;              // 用途
    private Timestamp issueTime;         // 开具时间
    private UserPO issuer;               // 开具人
    private short status;                // 状态（有效/作废）
    private String remark;               // 备注
}
```

#### WalletPO - 电子钱包
```java
@Entity
@Table(name = "wallet")
public class WalletPO {
    private long wid;                    // 钱包 ID
    private CustomerPO customer;         // 关联客户
    private String walletNo;             // 钱包号
    private long balance;                // 余额
    private long totalRecharge;          // 累计充值
    private long totalConsume;           // 累计消费
    private Timestamp createTime;        // 创建时间
    private short status;                // 状态（正常/冻结）
}
```

#### WalletranPO - 钱包交易记录
```java
@Entity
@Table(name = "walletran")
public class WalletranPO {
    private long wtid;                   // 交易 ID
    private WalletPO wallet;             // 关联钱包
    private String transactionNo;        // 交易号
    private String type;                 // 交易类型（充值/消费/提现/退款）
    private long amount;                 // 金额
    private long balanceBefore;          // 交易前余额
    private long balanceAfter;           // 交易后余额
    private Timestamp transactionTime;   // 交易时间
    private String remark;               // 备注
}
```

#### StatementPO - 对账单
```java
@Entity
@Table(name = "statement")
public class StatementPO {
    private long sid;                    // 对账单 ID
    private String statementNo;          // 对账单号
    private String period;               // 对账周期（月度/季度）
    private Timestamp startTime;         // 开始时间
    private Timestamp endTime;           // 结束时间
    private long totalIncome;            // 总收入
    private long totalExpense;           // 总支出
    private long balance;                // 余额
    private Timestamp generateTime;      // 生成时间
    private UserPO generator;            // 生成人
    private short confirmed;             // 是否确认
    private Timestamp confirmTime;       // 确认时间
}
```

#### ProxyPaymentPO - 代收代付
```java
@Entity
@Table(name = "proxy_payment")
public class ProxyPaymentPO {
    private long ppid;                   // 代收代付 ID
    private String proxyNo;              // 代收代付单号
    private String type;                 // 类型（代收/代付）
    private String orderId;              // 关联订单 ID
    private long amount;                 // 金额
    private String payee;                // 收款方
    private String payer;                // 付款方
    private Timestamp transactionTime;   // 交易时间
    private short status;                // 状态（待处理/已完成）
}
```

#### PaymentActivityPO - 支付活动
```java
@Entity
@Table(name = "payment_activity")
public class PaymentActivityPO {
    private long paid;                   // 活动 ID
    private String activityName;         // 活动名称
    private String activityType;         // 活动类型（满减/立减/折扣）
    private long threshold;              // 门槛金额
    private long discount;               // 优惠金额/折扣
    private Timestamp startTime;         // 开始时间
    private Timestamp endTime;           // 结束时间
    private short status;                // 状态（进行中/已结束）
}
```

### 数据库关系
```
payment (支付订单)
decoration_payment (装饰订单收款) 1:1
  └── receipt (收据)
sales_payment (主材订单收款) 1:1
  └── receipt (收据)
wallet (电子钱包) 1:N
  └── walletran (钱包交易记录)
statement (对账单)
proxy_payment (代收代付)
payment_activity (支付活动)
```

---

## 测试与质量

### 当前测试状态
- **单元测试**: 无
- **集成测试**: 无
- **测试覆盖率**: 0%

### 建议测试策略
1. **支付流程测试**: 支付创建 → 支付 → 确认流程
2. **退款流程测试**: 退款申请 → 审批 → 退款执行
3. **钱包余额测试**: 充值、消费、余额一致性测试
4. **对账逻辑测试**: 对账单生成、金额汇总准确性

---

## 常见问题 (FAQ)

### Q1: 支付订单与收款记录的区别？
**A**:
- `PaymentPO`：通用的支付订单，记录支付行为
- `DecorationPaymentPO` / `SalesPaymentPO`：具体业务的收款记录，关联到具体订单
- 支付订单是底层抽象，收款记录是业务层实现

### Q2: 支付状态流转？
**A**:
- 待支付 → 已支付 → 已确认
- 可能的异常流转：待支付 → 已取消、已支付 → 已退款

### Q3: 收据如何管理？
**A**: 收据与收款记录关联，一次收款可以开具一张或多张收据。收据可以作废，但不能删除（保持财务凭证完整性）。

### Q4: 电子钱包如何使用？
**A**:
1. 客户充值到钱包
2. 支付时可选择使用钱包余额
3. 钱包交易记录完整记录所有资金流动

### Q5: 代收代付是什么？
**A**: 代收代付用于处理第三方代收代付业务，如代收客户款项后转付给供应商。

---

## 相关文件清单

### Action 控制器 (约 20 个)
```
action/
├── PaymentAction.java                  - 支付主控制器
├── DecorationPaymentAction.java        - 装饰订单收款
├── MaterialPaymentAction.java          - 材料订单收款
├── SalesPaymentAction.java             - 主材订单收款
├── ServicePaymentAction.java           - 服务订单收款
├── ReceiptAction.java                  - 收据管理
├── SalesReceiptAction.java             - 主材收据
├── WalletAction.java                   - 电子钱包
├── WalletardAction.java                - 钱包卡
├── WalletranAction.java                - 钱包交易
├── WalletresAction.java                - 钱包资源
├── StatementAction.java                - 对账单
├── ProxyPaymentAction.java             - 代收代付
├── PaymentActivityAction.java          - 支付活动
├── PaymentCommonAction.java            - 支付公共方法
├── PaymentContractAction.java          - 支付合同
├── PaymentFunctionAction.java          - 支付功能
├── PaytranAction.java                  - 支付交易
├── AdvancePaymentAction.java           - 预付款
└── ActivityPaymentAction.java          - 活动支付
```

### 实体类 (约 15 个)
```
po/
├── PaymentPO.java                      - 支付订单
├── DecorationPaymentPO.java            - 装饰订单收款
├── MaterialPaymentPO.java              - 材料订单收款
├── SalesPaymentPO.java                 - 主材订单收款
├── ServicePaymentPO.java               - 服务订单收款
├── ReceiptPO.java                      - 收据
├── SalesReceiptPO.java                 - 主材收据
├── ServiceReceiptPO.java               - 服务收据
├── WalletPO.java                       - 电子钱包
├── WalletardPO.java                    - 钱包卡
├── WalletranPO.java                    - 钱包交易
├── WalletresPO.java                    - 钱包资源
├── StatementPO.java                    - 对账单
├── ProxyPaymentPO.java                 - 代收代付
└── ProxyReceiptPO.java                 - 代收收据
```

---

## 变更记录 (Changelog)

### 2025-12-01 15:28:48
- 初始化模块文档
- 完成支付管理模块架构分析
- 记录 15 个核心实体、约 20 个 Action 控制器
- 待补充：支付渠道集成详解、退款流程详解
