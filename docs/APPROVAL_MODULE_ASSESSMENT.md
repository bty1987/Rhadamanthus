# Approval 审批模块前后台评估报告

> 评估日期：2026-06-22
> 评估范围：`src/com/fanglin/approval`（后端）+ `WebContent/{views,js,db}` 中的 approval 相关文件（前端）
> 评估方式：静态代码审查（自动 + 人工），关键结论已用脚本/源码复核
> 数据库表数：28 张（`WebContent/db/approval.sql`）

---

## 0. 执行摘要（TL;DR）

| 维度 | 评级 | 简评 |
|---|---|---|
| 分层架构 | 🟢 良好 | Action / Service / DAO / PO / VO 五层清晰，命名前缀统一 |
| 数据访问 | 🟢 良好 | Hibernate Criteria + 命名参数绑定，无 SQL 注入 |
| 异常处理 | 🟡 中等 | 统一 `FLException`，但错误码大量复用、多处空指针风险 |
| 事务管理 | 🔴 较差 | 存在 1 处事务遗漏 Bug、2 处只读方法误加写事务、2 个 Service 类级注解缺失 |
| 安全 | 🔴 较差 | 审批无身份校验（水平越权）、3 处 PII 加密查询失效、回调无签名、前端 XSS 风险普遍、整模块零审计日志 |
| 可维护性 | 🟡 中等 | 27 个 Action 大量样板代码、4 处严重命名/拼写错误、1 处源码含隐藏 Unicode |
| 前端工程化 | 🟡 中等 | API 注册规范、配置驱动渲染有亮点；但同步请求、调试残留、`.html()` XSS 隐患多 |
| 业务能力 | 🟢 良好 | 覆盖 26 类业务审批，含钉钉集成、多租户、客户确认链路 |

**P0 必须立即修复的问题（共 4 项，详见 §3.1）**：
1. `ApprovalServiceImpl.refuse(ApprovalPO)` 缺失 `@Transactional` → 部分提交数据不一致
2. 审批操作无 receiver 身份校验 → 水平越权审批他人单据
3. 3 个 DAO 电话字段未做加密查询 → PII 查询永久失效
4. `ApprovalPO` 常量 `APPROVAL_TYPE_QUOTATION_PREFER‌_INT` 名称含隐藏中文字符

---

## 1. 模块概览

### 1.1 后端规模

| 层 | 文件数 | 说明 |
|---|---|---|
| Action | 28 | 1 个通用 `ApprovalAction` + 24 个业务子 Action + 3 个配置类 |
| Service / Impl | 27 / 27 | 含钉钉提交、审批通过/拒绝、客户确认、流程表单配置 |
| DAO / Impl | 33 / 33 | 主表 `ApprovalDao` + 各业务子表 DAO |
| PO | 37 | 1 个主表 `ApprovalPO` + 26 个子业务 PO + 4 个流程/审批人/功能 PO |
| VO | 31 | 与 PO 一一对应（无 AO/DTO 拆分） |
| SQL 表 | 28 | `approval` 主表 + 26 张子表 + `process` / `processitem` / `processrefer` / `approvalfunction` |

### 1.2 前端规模

| 类型 | 文件数 | 主要文件 |
|---|---|---|
| HTML 页面 | 7 | `approval4common/track/user` + `approvalFunction` + `process` + `process2create` + 报表 |
| 业务 JS | 6 | 同上对应，`process2create.js` 最复杂（443 行） |
| API 注册 | 1 | `js/api/approval.js`（约 60 个 API，332 行） |
| 条件组件 | 1 | `js/condition/approval.js` |
| 工具脚本 | 1 | `js/utils/approvalUtils.js`（含重复函数） |
| 报表 JS | 1 | `js/report/approval7Achievement.js` |

### 1.3 业务能力

审批模块覆盖 **26 类业务审批**（`ApprovalPO` 行 29-77 的常量枚举），按域分组：

- **客户域**：客源初审(17)、客源转装修(14)、客户资源(20)、客户机会(21/25)
- **装修域**：归属变更(3)、楼盘修改(2)、活动审批(8)、合同审批(24)、合同终止(19)、满减(16)、退款(5)
- **报价域**：报价折扣(4)、报价优惠(22)、预签优惠(23)
- **销售/主材域**：销售退货(10)、销售补款(12)、销售不退定金(18)、主材退货(6)、主材补款(9)、商品调拨(11)
- **财务域**：预付款提现(26，最新增)

审批状态机：`0 初始 → 1 审批中 → {3 通过 / 2 拒绝}`、`3 通过 → 5 待客户确认 → {6 客户确认 / 7 客户拒绝}`。集成钉钉工作流（通过 `piid` 回写 + 回调驱动）。

---

## 2. 架构分析

### 2.1 后端分层

```
ApprovalAction (通用入口: 分页/查询/审批动作/钉钉回调)
    │
    ├─► ApprovalService ──► ApprovalDao ──► ApprovalPO (主表)
    │         │
    │         └─ switch(type) 分发 ──► ApprovalXxxService ──► ApprovalXxxDao ──► ApprovalXxxPO (子表, aid 外键)
    │
    └─► ApprovalXxxAction (业务提交: submitApprovalForXxx)
              └─► ApprovalXxxService ──► ApprovalPO.init() + 主表 save + 子表 save + 钉钉发起
```

**关键设计**：
- **主表 + 伴生子表**模式：所有子 PO 通过 `aid` 字段外键关联主表 `ApprovalPO.aid`，**不使用 ORM 继承**。扩展新审批类型只需新增表，对历史代码零侵入 — 这是模块最大的设计亮点。
- **审批驱动靠巨型 switch**：`ApprovalServiceImpl.approve(ApprovalPO)`（`ApprovalServiceImpl.java:223`）按 `type` 字段 switch 分发到 20+ 子 Service 的 `approveForXxx` 方法。**没有真正的流程引擎**。
- **`Process / ProcessItem / ProcessRefer / ApprovalFunction` 不是流程引擎**，而是**钉钉审批表单设计器的元数据层**（前端 `process2create.html` 用）。命名严重误导，建议改名 `DingTalkForm*`。

### 2.2 前端架构

- **未使用 require.js**，依赖 `com.*` 全局命名空间（`js/com/*.js` 共 22 个核心文件）+ `$.loadScript` 显式声明依赖。
- **两种渲染范式并存**：
  - 旧：`approval4track.js` 用 `Searcher.base().condition().line()` 链式 API + 硬编码字段映射
  - 新：`approval4common.js` 用 `Searcher.init()` + `getConfig()` 从后端 `queryApprovalFunctionRight` 拉取列/按钮/API 配置，**配置驱动渲染**
- 新旧风格不统一，是迁移过程中的技术债。

### 2.3 前后端契约

- API 路径统一 `.do` 后缀，参数采用 `entity.field` 命名空间（`"approval.aid"`、`"processItems[0].name"`），与 Struts2 对象绑定一致。
- 前端 `js/api/approval.js` 中 **60 个 API 与后端 Action 方法一一对应，无悬空定义**。
- `api.approval` 大量使用 `tranargs` 声明金额/面积字段单位换算（如 `["num","total"]`），把数值转换集中到接口层 — 设计良好。

---

## 3. 严重问题（P0/P1）

### 3.1 P0：必须立即修复

#### P0-1 事务遗漏导致部分提交 🔴

**位置**：`src/com/fanglin/approval/service/impl/ApprovalServiceImpl.java:312`

```java
// 223 行：approve 有事务
@Transactional(rollbackFor = Exception.class)
public ApprovalPO approve(ApprovalPO approvalPO) throws FLException { ... }

// 312 行：refuse 缺事务！
public ApprovalPO refuse(ApprovalPO approvalPO) throws FLException {
    switch (approvalPO.getType()) {
        ...  // 调用 12 个子 Service.refuseForXxx()
    }
    approvalPO.setStatus(...);
    approvalDao.update(approvalPO);   // 主表更新
    return approvalPO;
}
```

**已验证**：grep 确认 312 行上方无 `@Transactional`，而同类方法 223 行有。

**影响**：拒绝审批时若任一子 Service 抛异常，主表状态仍会被提交，导致主子表数据不一致（主表显示已拒绝，但子业务数据未回滚）。审批涉及钱款（退款、提现、补款），**资金风险高**。

**修复**：312 行上方添加 `@Transactional(rollbackFor = Exception.class)`。

---

#### P0-2 审批操作无身份校验（水平越权）🔴

**位置**：`ApprovalServiceImpl.java:371` `approve(ApprovalVO)` / `:401` `refuse(ApprovalVO)`

```java
@Transactional(rollbackFor = Exception.class)
public int approve(ApprovalVO approvalVO) throws FLException {
    ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
    // 仅校验状态，不校验当前用户是否是 approval.receiver
    if (approvalPO.getStatus() != STATUS_INIT_INT && ...) {
        throw new FLException(240009, "审批状态不可操作");
    }
    return approve(approvalPO).getStatus();
}
```

**影响**：任何登录用户知道 `aid` 即可调用 `approveApproval.do` 审批他人单据。审批权限完全失守。

**修复**：在 `approve(ApprovalVO)` / `refuse(ApprovalVO)` 入口校验 `approvalPO.getReceiver().getUid() == authentication().queryUserId()`，不符抛 `FLException(240010, "无权审批此工单")`。

---

#### P0-3 电话字段加密查询失效 🔴

**位置**：
- `src/com/fanglin/approval/dao/impl/ApprovalCustomerSourceDaoImpl.java:55-56`
- `src/com/fanglin/approval/dao/impl/ApprovalCustomerOriginTDecorationDaoImpl.java:54-55`
- `src/com/fanglin/approval/dao/impl/ApprovalSalesRefundDaoImpl.java:55-57`

**对比已验证**：

```java
// ✅ ApprovalCustomerOriginDaoImpl.java:65-66 （正确）
query.add(Restrictions.in("customerOrigin.phone",
    SensitiveDataHelper.getAllEncryptedForms(filter.getData())));

// ❌ ApprovalCustomerSourceDaoImpl.java:55-56 （错误）
} else if ("phone".equals(field)) {
    query.add(query.getCriterion("customerSource.phone", filter));  // 明文查密文
}
```

**根因**：`DaoImpl.getCriterion` 内部直接走 `Restrictions.eq/ilike`（`src/com/fanglin/core/dao/impl/DaoImpl.java` 确认），不做加密转换。手机号在数据库是 AES 密文存储，明文查询**永远返回空结果**。

**git 历史**：`a24dba77a fix: 敏感数据查询统一改用getAllEncryptedForms` 已修复了 `ApprovalCustomerOriginDaoImpl`，但漏改了这 3 个 DAO。

**影响**：审批列表按手机号搜索客源/客源装修/销售退货审批时，**永远查不到结果**，功能失效且违反 PII 合规要求。

**修复**：3 处统一改为 `Restrictions.in("xxx.phone", SensitiveDataHelper.getAllEncryptedForms(filter.getData()))`。

---

#### P0-4 源码常量名含隐藏 Unicode 字符 🔴

**位置**：`src/com/fanglin/approval/po/ApprovalPO.java:69`

**已用 PowerShell 验证**：第 69 行包含 2 个非 ASCII 字符（U+9225 鈥、U+5B8A 宊），肉眼不可见但影响搜索/重构。

```java
public static final short APPROVAL_TYPE_QUOTATION_PREFER‌_INT = 22;
//                                      ^
//                      此处 PREFER 与 _INT 之间嵌入了不可见中文
```

**影响**：
- `grep "QUOTATION_PREFER_INT"` 搜不到该常量定义（搜不到引用也是同理）
- IDE 自动补全失效
- code review 肉眼看不出
- 一旦有人"修正"为纯 ASCII 名，所有引用处（`ApprovalServiceImpl.java:293/348`、`ApprovalQuotationPreferServiceImpl.java:96/112`）会编译失败

**修复**：全模块统一替换常量名（定义 + 所有引用）为纯 ASCII。

---

### 3.2 P1：高优先级

#### P1-1 整个模块零审计日志

`src/com/fanglin/approval/` 下 grep `Logger|log\.|LogUtils` **0 命中**。审批涉及资金（退款、提现、补款）、归属变更、合同终止等敏感操作，**完全无法追溯谁在何时审批了什么**。`BaseAction` 定义了 `logObjs` 字段但本模块从未调用 `LogUtils.log()`。

**建议**：在 `approve(ApprovalVO)` / `refuse(ApprovalVO)` / `submitApprovalForXxx` 入口统一记录：操作人、aid、type、前后状态、批注。

#### P1-2 `ApprovalCommonAction` 可能绕过登录

**位置**：`src/com/fanglin/approval/action/ApprovalCommonAction.java:15`

```java
@ParentPackage("common")   // 其他 Action 都是 "base"
@Namespace("/")
```

`common` 包在 `conf/struts.xml` 中通常不挂登录拦截器。该 Action 暴露 `submitApprovalForDing`（钉钉提交）、`confirmApproval`（客户确认）、`rejectApproval`（客户拒绝），若确实无拦截，**外部可直接调用**。需核实 struts 配置确认。

#### P1-3 钉钉回调无签名校验

**位置**：`ApprovalAction.java:124-134` `callbackApproval`

`piid` 来自请求参数，无钉钉签名校验，攻击者构造请求即可伪造审批通过/拒绝。

**修复**：校验钉钉 `X-DingTalk-Signature` 头（基于 timestamp + secret 的 HMAC-SHA256）。

#### P1-4 前端 `.html()` XSS 普遍

**位置**（已 grep 验证）：
- `js/approval/approval4common.js:62` — `$('<b></b>').html(value[1])`，`value[1]` 来自 `v.approval.contents/comment/annotate`、`v.source.name`、`v.customerOrigin.phone`
- `js/approval/approval4user.js:65,80,81`
- `js/approval/approvalFunction.js:28`、`js/approval/process.js:32`、`js/approval/process2create.js:241,434,436`

后端 `ApprovalPO.contents/comment/annotate` 无 XSS 过滤（直接存库直接返回），前端又用 `.html()` 注入 → **存储型 XSS**。

**修复**：所有注入后端字符串的 `.html()` 改 `.text()`；或后端入库前用 `org.apache.commons.text.StringEscapeUtils.escapeHtml4()` 转义。

#### P1-5 两个 Service 类级 `@Transactional` 缺失

- `ApprovalCommonServiceImpl.java:28-29`：只有 `@Service`，无类级 `@Transactional(readOnly=true)`；其 `submitApprovalForDing` 方法也无方法级事务，但会调用钉钉发起并写库。
- `ApprovalFunctionServiceImpl` 等部分配置类 Service 也未严格遵循。

---

## 4. 后端代码质量

### 4.1 事务管理（详细）

| 问题 | 位置 | 影响 |
|---|---|---|
| `refuse(ApprovalPO)` 缺 `@Transactional` | `ApprovalServiceImpl.java:312` | **P0**，部分提交 |
| `countApprovalForReceive/Send` 只读方法误加写事务 | `:199, :211` | 浪费连接，覆盖类级 readOnly |
| `ApprovalCommonServiceImpl` 类级无 `@Transactional` | `:28-29` | 副作用无法回滚 |
| `ProcessServiceImpl.updateProcessItem` 跨 DAO 更新 | `:160-169` | 用 `processDao.update(processItemPO)`，依赖 dirty checking，可读性差 |

### 4.2 异常处理

**规范点**：全模块统一 `FLException` + 错误码，无 `try/catch` 吞异常（仅 `BaseAction.authentication()` 一处），无 `printStackTrace`。

**问题**：
- **错误码 240009 大量复用**：在 `ApprovalServiceImpl.java` 出现 11 次（行 192/227/315/377/381/385/389/407/411/415/419），混用"审批信息不存在"和"审批状态不可操作"，前端无法区分。
- **NPE 风险**：`affirm`（行 430+）`approvalDao.get(...)` 后未判空直接 `.getStatus()`；`countApprovalForReceive`（行 200+）`userPO.getUid()` 未判空。

### 4.3 DAO 查询

- **分页查询规范**：`ApprovalDaoImpl.java:34-101` 用 `pagingQuery + Restrictions.eq + queryFilterExcute + desc`，无注入。
- **原生 SQL 安全**：`ApprovalDaoImpl.java:118-152` 4 个 count 方法用 `createSQLQuery` + 命名参数绑定，无字符串拼接。
- **硬编码 schema**：`"approval.approval"` 在 4 处硬编码，跨库部署会出错。
- **拼写错误固化**：`queryFilterExcute`（应为 Execute）被多个子 DAO 复制粘贴。

### 4.4 PO 设计

- `ApprovalPO.init()`（行 267-285）工厂方法集中了子 Service 的样板代码，**设计亮点**。
- 子表关联用 `aid` 外键（伴生表模式），扩展性强。
- **死字段**：`ApprovalPaymentWithdrawPO.status`（行 31）从未被 Service 维护。
- **命名冲突**：`ApproverPO.aid`（行 33）与主表 `ApprovalPO.aid` 主键同名但语义不同，易混淆。

### 4.5 代码风格

#### 🔴 拼写错误已固化到 API 契约

| 错误 | 位置 | 应为 |
|---|---|---|
| `ApprovalSalesDaymentService` / `SalesDayment` | 多文件 | `SalesPayment` |
| `APPROVAL_TYPE_SALES_DIACOUNT_INT` | `ApprovalPO.java:51` | `DISCOUNT` |
| `APPROVAL_TYPE_PROTATION_PREFER_INT` | `ApprovalPO.java:71` | 业务含义不明（Protection? PreRotation?） |
| `ApprovalDecorationnActivityItemDao`（多 n） | 文件名 | `DecorationActivityItemDao` |
| `ApprovalSalesRefundAO`（AO 后缀） | 文件名 | 应为 PO |
| `queryFilterExcute` | 多个 DAO | `Execute` |
| `@Service("ApprovalDecorationTerminalService")` | `:37` | 应小驼峰 `approvalDecorationTerminalService` |
| `@Service("approverSercie")` | `ApproverServiceImpl.java:33` | `approverService` |
| `@Service("ApprovalFunctionService")` | `:16` | 应小驼峰 |

#### 🟡 重复代码

| 重复点 | 位置 | 建议 |
|---|---|---|
| 4 个 `pageApproval*` 方法体几乎相同 | `ApprovalServiceImpl.java:132-184` | 抽 `toVOs(List<ApprovalPO>)` |
| `approve(VO)` 与 `refuse(VO)` 状态校验重复 | `:379-389` vs `:409-419` | 抽 `checkStatus(ApprovalPO, int...)` |
| 27 个子 Action 90% 样板 | 全模块 | 抽 `AbstractApprovalAction<T>` |
| 24 个子 Service 的 `submitApprovalForXxx` 流程一致 | 全模块 | 模板方法模式 |
| `serialVersionUID` 多文件相同 | `ApprovalAction.java:31` 等 | 复制粘贴残留 |

#### 🟡 超长方法

| 方法 | 行数 |
|---|---|
| `ApprovalDecorationBelongServiceImpl.submitApprovalForDecorationBelong` | ~120 |
| `ApprovalServiceImpl.approve(ApprovalPO)` | ~85（含 20+ case switch） |
| `ApprovalPaymentWithdrawServiceImpl.approveForPaymentWithdraw` | ~78 |
| `ApprovalSalesRefundServiceImpl.submitApprovalForSalesRefund` | ~105 |

---

## 5. 前端代码质量

### 5.1 API 注册（亮点）

`js/api/approval.js`：
- 60 个 API 分组清晰，**无重复定义**
- 命名约定一致：`page*` / `query*` / `submitApprovalFor*` / `approve/refuse/affirm`
- 大量 `tranargs` 声明字段单位换算（`approval.js:43-58,65-72,133`），把数值转换提到接口层

**小问题**：`submitApprovalForDecorationContract`（`:121`）末尾多余逗号；9 处 `demo: true` 标记（`:22-34`）含义不明，疑似演示环境过滤但无消费方。

### 5.2 重复代码

| 重复点 | 位置 |
|---|---|
| `approval4common.js` 与 `approval4track.js` 的 `proapprove/approve` 提交逻辑几乎逐字相同 | `approval4common.js:202-227` vs `approval4track.js:205-230` |
| **`approvalUtils.js` 内部两函数完全相同** | `initqueryApprovalUser`（行 3-32）≡ `initApprover`（行 33-62） |
| 行渲染样板（`creatLine` → `$liLine/$h3/$ulProperty/$divBtnWrap` + `$.each`）复制 4 遍 | `approval4common.js:47-108`、`approval4user.js:61-94`、`process.js:29-95`、`process2create.js:233-292` |
| 拼写错误 `creatLine`（应为 `createLine`）复制 5 处 | 同上 |

### 5.3 超长函数 / 嵌套

- `approval4common.js:229-405` `getPropertyArr()` 单函数 **176 行、约 50 个 case**，应拆为字段元数据映射表
- IIFE 嵌套达 4 层（displayFunc → creatLine → click handler → post callback）

### 5.4 硬编码

- `approval4track.js:10-11`：`type: ["劵","物品","红包"]`、`stateType: ["到店","定金","签单","抽奖","特批","购买","其他","升级"]` 应下沉到 `constant.approval()`
- `approval4track.js:28-62`：`approvalItemInfo.args` 含魔法数字 type key（6/8/10/14/17）
- `process.js:42`：`v.status == 0 ? "启用" : "禁用"` 硬编码文案

### 5.5 同步 AJAX 反模式

`com.post(url, opts, success, fail, false)` 中第 5 个参数 `asyncFlag=false` 在本模块大量使用（`approval4common.js:218`、`approval4track.js:221,237,261`、`approval4user.js:142,160` 等），**会阻塞 UI 线程**。应改为异步 + 回调/Promise。

### 5.6 错误处理回调缺失

`com.post` 第 4 参数 `failCallback` 在本模块几乎所有调用都被传 `null` 或省略。审批失败时用户无明确反馈。

### 5.7 调试残留

`approvalFunction.js` 残留 3 处 `console.log`（行 47,50,102）+ 2 处注释掉的 `console.dir`（行 83,88,93）。

### 5.8 注释与命名

- `approval4user.js` 注释最完整；`approval4common.js / approval4track.js / process.js / process2create.js / approvalUtils.js` 几乎无注释
- `process2create.js` 用 `"'id'"`、`"'name'"` 字符串包裹的 key（行 62-70,218-226）是为了规避 jQuery `.data()` 解析，但无注释，极易误改

---

## 6. 前后端一致性

### 6.1 一致性良好的方面

- 60 个前端 API 与后端 Action 方法一一对应，无悬空
- 参数命名 `entity.field` 与 Struts2 对象绑定一致
- `constant.approval().approval` 状态常量前后端取值一致（0/1/2/3/5/6/7）
- 多租户字段 `company` 贯穿全链

### 6.2 不一致点

| 问题 | 前端 | 后端 |
|---|---|---|
| 类型 22 常量名 | 无法正常引用（隐藏 Unicode） | `ApprovalPO.java:69` |
| 子 Action `submitApproval` 方法名 | `submitApprovalForDecorationContract.do` | `ApprovalPaymentWithdrawAction.java:35` 方法名是 `submitApprovalForQuotationPrefer`（复制粘贴残留，与 Action value 不一致） |
| 加密查询 | 前端传明文 phone | 后端 3 个 DAO 不做加密 → 查询失效 |
| 状态文案 | `process.js:42` 硬编码 `"启用/禁用"` | `ProcessPO` 无对应常量 |
| `ApprovalCommonAction` 包名 | 前端通过钉钉 H5 调用 | 后端 `@ParentPackage("common")` 可能绕过登录，与前端假设不一致 |

---

## 7. 改进建议（按优先级）

### 7.1 立即修复（P0，1-2 天）

1. **`ApprovalServiceImpl.refuse(ApprovalPO)` 加 `@Transactional`**（`ApprovalServiceImpl.java:312`）
2. **审批身份校验**：`approve(ApprovalVO)` / `refuse(ApprovalVO)` 校验 `receiver.uid == 当前用户`
3. **修复 3 个 DAO 的 phone 加密查询**（统一用 `SensitiveDataHelper.getAllEncryptedForms`）
4. **清理 `ApprovalPO.java:69` 的隐藏 Unicode 字符**（定义 + 所有引用处一起改）

### 7.2 短期（P1，1-2 周）

5. **接入审计日志**：审批通过/拒绝/提交入口统一 `LogUtils.log()`
6. **核实并加固 `ApprovalCommonAction`**：确认 `common` 包是否绕过登录，必要时加签名/Token
7. **钉钉回调签名校验**：`callbackApproval` 校验 `X-DingTalk-Signature`
8. **前端 XSS 修复**：所有注入后端字符串的 `.html()` 改 `.text()`
9. **补全 `ApprovalCommonServiceImpl` 类级 `@Transactional`**
10. **错误码去重复用**：240009 拆分为"不存在"/"状态不可操作"/"无权操作"等多个

### 7.3 中期（P2，1-2 月）

11. **抽取 `AbstractApprovalAction<T>` 泛型基类**，消除 27 个 Action 的样板
12. **抽取 `ApprovalServiceImpl` 的 `pageApproval*` / `approve(VO)` / `refuse(VO)` 重复代码**
13. **重命名误导类**：`Process*` → `DingTalkForm*`（配合数据库表名迁移）
14. **修正固化拼写**：`SalesDayment` → `SalesPayment`、`DIACOUNT` → `DISCOUNT`、`queryFilterExcute` → `Execute`（注意保持 bean name 向后兼容，建议分两步：先加正确名别名，下个大版本删旧名）
15. **前端抽取 `approvalUtils.js` 公共提交逻辑**，删除重复函数
16. **`getPropertyArr` 176 行 switch 重构为字段元数据表**
7. **同步 AJAX 改异步**：去掉 `com.post(..., false)`

### 7.4 长期（P3）

18. **引入方法级权限注解**（自定义 `@RequiresPermission` 或 Spring Security），替代仅靠 cookie 的粗粒度校验
19. **`company` 字段加索引**（approval.sql 主表无 company 单列索引）
20. **`Process` 表单设计器与"审批流程"概念解耦**，命名/文档澄清
21. **金额字段统一用 `long`（分）**：当前已部分遵守，全面检查浮点 `double` 残留

---

## 8. 附录

### 8.1 关键文件速查

| 关注点 | 文件 |
|---|---|
| 审批引擎核心 | `src/com/fanglin/approval/service/impl/ApprovalServiceImpl.java`（473 行） |
| 审批主实体 | `src/com/fanglin/approval/po/ApprovalPO.java` |
| 通用 Action | `src/com/fanglin/approval/action/ApprovalAction.java` |
| 钉钉集成入口 | `src/com/fanglin/approval/action/ApprovalCommonAction.java` |
| 数据库表结构 | `WebContent/db/approval.sql`（28 张表） |
| 前端 API 注册 | `WebContent/js/api/approval.js`（60 个 API） |
| 前端通用审批引擎 | `WebContent/js/approval/approval4common.js`（407 行） |
| 前端审批跟踪 | `WebContent/js/approval/approval4track.js`（313 行） |
| 前端流程设计器 | `WebContent/js/approval/process2create.js`（443 行） |

### 8.2 验证脚本（已执行）

```powershell
# 1. 验证 ApprovalPO.java:69 隐藏 Unicode
$line = (Get-Content 'src\com\fanglin\approval\po\ApprovalPO.java')[68]
$line.ToCharArray() | %{ if ([int]$_ -gt 127) { Write-Host ('U+' + ('{0:X4}' -f [int]$_)) } }
# 输出：U+9225 U+5B8A

# 2. 验证 refuse(ApprovalPO) 缺 @Transactional
Select-String -Path 'ApprovalServiceImpl.java' -Pattern 'refuse\(ApprovalPO|@Transactional'

# 3. 验证 3 个 DAO phone 加密缺失
Select-String -Path 'Approval*DaoImpl.java' -Pattern 'phone|SensitiveData'
```

### 8.3 评分汇总

| 维度 | 评分 | 关键依据 |
|---|---|---|
| 功能完整性 | 8.5/10 | 26 类审批 + 钉钉集成 + 客户确认链路 |
| 架构设计 | 7.5/10 | 主+伴生子表模式优秀；switch 引擎待重构 |
| 代码质量 | 5.5/10 | 大量重复、拼写错误、隐藏字符、超长方法 |
| 安全性 | 4.0/10 | 越权、加密失效、回调伪造、XSS、零审计 |
| 事务正确性 | 6.0/10 | 1 处 P0 遗漏 + 多处范围不当 |
| 可维护性 | 5.5/10 | 样板多、注释少、新旧风格并存 |
| 前端工程化 | 6.5/10 | API 规范、配置驱动有亮点；同步请求、XSS 扣分 |
| **综合** | **6.2/10** | **功能完备但安全隐患严重，需优先处理 P0** |

---

*报告生成 by ZCode 自动化评估，关键结论均经源码/脚本复核。*
