# 审批流程模块 (approval)

[根目录](../../../../CLAUDE.md) > [src/com/fanglin](../../) > **approval**

> 最后更新：2026-07-12

---

## 模块职责

**审批流程模块**是 Rhadamanthus ERP 系统的工作流引擎,负责管理所有业务流程的审批、流转、抄送等功能,为装饰订单、报价、退款、合同等业务提供流程化管理能力。

**当前存在两套并存的审批链路**:

| 链路 | 引入时间 | 模型 | 状态 |
|------|---------|------|------|
| **老链路:逐级指派式** | 2015 | `ApprovalPO.receiver` 单点模型,业务代码手工串联多级 | 仍服务于大部分业务类型 |
| **钉钉链路:钉钉托管** | 2018 | 钉钉后台配流程,ERP 仅存结果记录 + 反射回调 | 主力渠道,强依赖钉钉 |
| **新引擎:配置化流程** | 2026 | `approvalFlow`/`approvalFlowNode`/`approvalTask` 三表驱动,支持或签/并签/会签 | 试运行,装饰合同(type=24)已接入 |

> 三套链路互不干扰:业务提交时通过 `hasFlow(businessType, company)` 判断是否走新引擎,未配置则保持原行为。

---

## 双轨/三轨架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    业务提交 submitApproval                       │
│                                                                 │
│  hasFlow(type, company)?                                        │
│    ├─ YES → 新引擎:startFlow(不推钉钉,纯本地流转)            │
│    └─ NO  → 老逻辑:单 receiver 指派 + 推钉钉(双写)           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────── 新引擎链路(2026) ──────────────────────────────┐
│ ApprovalTaskAction.agreeApprovalTask (Web端)                    │
│   → ApprovalFlowEngineService.agreeTask                         │
│ 钉钉APP审批 → DingTalkCallbackServiceImpl (钉钉端,经 agreeByAssignee)│
│   → agreeByAssignee 匹配 task → agreeTask                       │
│                                                                 │
│   → NodeCompletionStrategy 判定(串行/或签/并签/会签)            │
│   → 节点通过则推进下一节点 / 末节点则 finalizeApproval           │
│     → ApprovalNodeHandler SPI(编码) 或                          │
│     → PostHandlerInvoker 反射(配置 beanClass#method)            │
│                                                                 │
│   ※ Web端与钉钉端审批同一实例,双端互认                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────── 老链路(2015) ───────────────┐
│ ApprovalAction.approveApproval                │
│   → ApprovalServiceImpl.approve(VO, userId)   │
│     → checkReceiver(单点校验)                 │
│     → hasTask 守卫(有task则拒绝,防止冲突)   │
│     → approve(PO) 巨型 switch(23 case 分发)  │
│       → 各业务Service.approveForXxx(PO)       │
└───────────────────────────────────────────────┘

┌─────────────── 钉钉链路(2018,仅服务未配 flow 的老业务) ───────┐
│ 钉钉APP审批 → 钉钉服务端回调                  │
│   → DingTalkCallbackServiceImpl.callback      │
│     ├─ type=1 专用:反射 invokeHandler         │
│     └─ type=0 通用:                            │
│         hasTask? ┬─ YES → agreeByAssignee(驱动引擎,双端互认) │
│                    └─ NO  → approvalService.approve/refuse(老逻辑)│
└─────────────────────────────────────────────────────────────────┘
```

> **提交互斥原则**:配了 flow 的业务提交时**不推钉钉**(走纯本地引擎),避免同一单据在钉钉端和本地引擎同时流转产生状态混乱。钉钉仅作为"未配 flow 的老业务"的渠道。但对于已配 flow 的单据,如果历史数据已带 piid,钉钉回调仍能通过 `agreeByAssignee` 安全驱动本地引擎(兼容存量)。

---

## 数据模型

### 老链路核心表(2015,未改动)

#### `approval` - 审批主表(`ApprovalPO`)
单 receiver 模型:一次审批记录只指向一个审批人(`receiver: UserPO`),多级审批靠业务代码在每级通过后再 new 一条记录串联。

| 字段 | 类型 | 说明 |
|------|------|------|
| aid | long(PK) | 审批ID(自增) |
| orderId | String | 业务订单号 |
| receiver | UserPO | 当前审批人(`ruid → UserPO.uid`) |
| sender | UserPO | 提交人(`suid → UserPO.uid`) |
| type | short | 审批类型(`APPROVAL_TYPE_*`,共26种) |
| status | short | 状态:0草稿/1通过/2拒绝/3通过/5确认/6已确认/7驳回 |
| piid | String | 钉钉流程实例ID(走钉钉时回写) |
| company | int | 公司ID |

#### `process` / `processItem` / `processRefer` - 钉钉表单字段定义
⚠️ **这些表不是"审批节点流转模型"**,而是钉钉表单字段的本地镜像,供前端配置钉钉表单组件用。`processItem` 字段是 `form/validate/data/sort`(表单组件定义),不是 `nodeSeq/nodeType`。

#### `approver` - 默认审批人映射(`ApproverPO`)
扁平的"审批类型 → 默认接收人"映射:`aid/user/type/company/comment`,无节点序号概念。

#### `dingtalkapprovalconfig` - 钉钉回调配置(后置业务影响配置)
**这是现有代码里最接近"配置化后置处理"的资产**,新引擎的 `PostHandlerInvoker` 就是复用它的设计思路。

| 字段 | 说明 |
|------|------|
| processCode | 钉钉模板code |
| fieldId | 表单字段ID(用于从钉钉表单提取 orderId) |
| beanClass/methodName/voClass | 反射三件套(专用审批) |
| type | 0=通用审批(approve/refuse) 1=专用审批(反射) |
| handleAgreeOnly | 1=只处理agree |

### 新引擎表(2026,驼峰命名,catalog=approval)

建表脚本:`sqls/approval/10_approval_flow_engine.sql`

#### `approvalFlow` - 流程定义(`ApprovalFlowPO`)
| 字段 | 说明 |
|------|------|
| flowId(PK) | 流程定义ID |
| code | 流程编码(业务唯一键) |
| businessType | 业务审批类型(对应 `ApprovalPO.APPROVAL_TYPE_*`) |
| version | 版本号 |
| status | 0=启用 1=禁用 |
| company | 公司ID(0=全公司通用) |

#### `approvalFlowNode` - 流程节点定义(`ApprovalFlowNodePO`)
| 字段 | 说明 |
|------|------|
| nodeId(PK) | 节点ID |
| flowId | 所属流程 |
| nodeSeq | 节点顺序(从1开始) |
| nodeType | **1=串行 2=并签(全通过) 3=或签(任一通过) 4=会签(按比例)** |
| approverRule | 0=指定人 1=直属上级 2=部门负责人 3=角色 4=自选 5=表达式 |
| approverData | 规则数据(JSON) |
| passRatio | 会签通过比例(0~1,仅 nodeType=4) |
| timeoutHours | 超时小时数 |
| autoAction | 超时动作:0无 1自动通过 2自动拒绝 |
| preHandler | 前置处理器(`beanClass#methodName`) |
| postHandler | **后置业务处理器(`beanClass#methodName`,审批通过后触发)** |
| rejectStrategy | 驳回策略:0整体驳回 1回退上一节点 2回退发起人 |

#### `approvalTask` - 审批任务运行时(`ApprovalTaskPO`)
每个节点的每个审批人一条记录,并签/或签/会签通过同 nodeId 多任务判定。

| 字段 | 说明 |
|------|------|
| taskId(PK) | 任务ID |
| aid | 关联审批主表 `approval.aid` |
| flowId/nodeId | 流程/节点(冗余) |
| nodeSeq/nodeType | 节点顺序/类型(冗余,判定时用) |
| assigneeId | 审批人 userId |
| status | 0待办 1通过 2拒绝 3转交 4已失效 5超时 |
| action | agree/refuse/transfer/timeout |
| transferTo | 转交目标 userId |

### 表单层(P3,2026新增,EAV 纵向结构)

建表脚本:`sqls/approval/30_approval_form.sql`。全新结构,**不复用** `process`/`processItem`(后者保留给钉钉表单)。MySQL 5.6 友好:全部标量列,无 JSON/TEXT。

#### `approvalForm` - 表单定义(`ApprovalFormPO`)
通过 `flowId` 桥接 `approvalFlow`,一个流程关联一个表单。

| 字段 | 说明 |
|------|------|
| formId(PK) | 表单ID |
| code | 表单编码(业务唯一键) |
| flowId | 关联流程定义 `approvalFlow.flowId` |
| status/company | 启用禁用 / 公司 |

#### `approvalFormField` - 表单字段定义(`ApprovalFormFieldPO`)
EAV 纵向,每字段一行。控件类型常量定义在 PO 里(`CONTROL_*_INT`)。

| 字段 | 说明 |
|------|------|
| fieldId(PK) | 字段ID |
| formId | 所属表单 |
| fieldKey | 字段键(英文标识,如 `discountRate`) |
| fieldLabel | 字段标签(中文显示,如 `降点比例`) |
| controlType | 控件类型:1文本 2文本域 3数字 4下拉 5日期 6用户选择 7部门选择 8附件 |
| required | 是否必填 0否 1是 |
| dataSource | 下拉数据源(逗号分隔值 或 `beanClass#method` 动态获取) |
| validateRule | 验证规则(逗号分隔:`require,integer,float,phone`) |
| sortOrder | 排序 |

#### `approvalFormData` - 表单填写数据运行时(`ApprovalFormDataPO`)
每值一行,`(aid, fieldId)` 联合索引支持按字段精确查询。

| 字段 | 说明 |
|------|------|
| dataId(PK) | 数据ID |
| aid | 关联审批主表 `approval.aid` |
| fieldId | 字段定义ID |
| fieldValue | 填写的值(varchar(2000)) |
| taskId | 关联任务(可选,区分提交时填/审批时填) |

> **为什么 EAV 而非 JSON**:MySQL 5.6 无 JSON 类型(5.7 才有),存 TEXT 无法字段级查询/校验。EAV 全标量列,可索引,是 5.6 时代最稳的动态字段方案。

---

## 审批类型清单(`ApprovalPO.APPROVAL_TYPE_*`)

| 常量 | 值 | 业务 |
|------|---|------|
| CUSTOMER_INT | 1 | 客户信息 |
| VILLAGE_INT | 2 | 小区 |
| DECORATION_BELONG_INT | 3 | 装修归属 |
| QUOTATION_DISCOUNT_INT | 4 | 报价折扣 |
| DECORATION_REFUND_INT | 5 | 装修退款 |
| MATERIAL_REFUND_INT | 6 | 主材退款 |
| MATERIAL_OUTSIDE_REFUND_INT | 7 | 主材外部退款 |
| DECORATION_ACTIVITY_INT | 8 | 装修活动 |
| MATERIAL_FULL_PAYMENT_INT | 9 | 主材全款 |
| SALESREFUND_PAYMENT_INT | 10 | 销售退款 |
| MANIFESTDB_INT | 11 | 清单DB |
| SALES_DIACOUNT_INT | 12 | 销售折扣 |
| HR_INT | 13 | 人事 |
| CUSTOMER_ORIGIN_T_DECORATION_INT | 14 | 客户来源-装修 |
| DECORATION_HOLONOMY_INT | 16 | 装修整装 |
| CUSTOMER_ORIGIN_INT | 17 | 客户来源 |
| SALESDAYMENT_INT | 18 | 销售收款 |
| DECORATION_TERMINAL_INT | 19 | 装修终审 |
| CUSTOMER_SOURCE_INT | 20 | 客户来源变更 |
| CUSTOMER_CHANCE_INT | 21 | 客户机会 |
| QUOTATION_PREFER_INT | 22 | 报价优惠 |
| PROTATION_PREFER_INT | 23 | 优惠 |
| **DECORATION_CONTRACT_INT** | **24** | **装饰合同(新引擎试点)** |
| CUSTOMER_CHANCE_DISABLED_INT | 25 | 客户机会停用 |
| PAYMENT_WITHDRAW_INT | 26 | 预付款提现 |

---

## 对外接口

### 老链路接口(`ApprovalAction`)

| 端点 | 功能 |
|------|------|
| pageApproval / pageApprovalForReceive / pageApprovalForSend | 审批列表查询 |
| queryApprovalByAId | 查审批详情 |
| countApprovalForReceive / countApprovalForSend | 待办计数 |
| approveApproval / refuseApproval | 单 receiver 审批/拒绝 |
| affirmApproval | 确认 |
| callbackApproval | 钉钉回调入口 |

### 新引擎接口(2026新增)

**流程定义管理 `ApprovalFlowAction`**

| 端点 | 功能 |
|------|------|
| pageApprovalFlow | 分页查流程定义 |
| queryApprovalFlowByFlowId | 查流程详情 |
| queryApprovalFlowNode | 查流程节点列表 |
| addApprovalFlow | 新建流程(含节点) |
| updateApprovalFlow | 更新流程(节点先删后建) |
| updateApprovalFlowForStatus | 启用/禁用 |
| deleteApprovalFlow | 删除流程 |

**任务操作 `ApprovalTaskAction`**

| 端点 | 功能 |
|------|------|
| agreeApprovalTask | 审批通过(参数:taskId, comment) |
| refuseApprovalTask | 审批拒绝 |
| transferApprovalTask | 转交(参数:taskId, transferTo, comment) |
| queryApprovalTaskTrace | 查审批轨迹(参数:task.aid) |
| queryApprovalTodoTask | 查我的待办 |

**表单管理 `ApprovalFormAction`(P3 新增)**

| 端点 | 功能 |
|------|------|
| pageApprovalForm | 分页查表单定义 |
| queryApprovalFormByFormId | 查表单详情 |
| queryApprovalFormByFlowId | 按流程ID查关联表单 |
| queryApprovalFormField | 查表单字段列表 |
| addApprovalForm | 新建表单(含字段) |
| updateApprovalForm | 更新表单(字段先删后建) |
| updateApprovalFormForStatus | 启用/禁用 |
| deleteApprovalForm | 删除表单 |
| queryApprovalFormData | 查审批单的表单填写数据(参数:aid) |

---

## 新引擎扩展点(SPI)

### `ApprovalNodeHandler` - 后置业务处理器(编码方式)

业务 Service 实现此接口 + 用 `@Component` 注册,Spring 自动按 `businessType()` 建索引,替代 `ApprovalServiceImpl` 里的 switch-case。

```java
@Component
public class ApprovalDecorationContractHandler implements ApprovalNodeHandler {
    @Override public short businessType() { return ApprovalPO.APPROVAL_TYPE_DECORATION_CONTRACT_INT; }
    @Override public void onApprove(ApprovalPO approvalPO) throws FLException { /* 后置业务 */ }
    @Override public void onRefuse(ApprovalPO approvalPO) throws FLException { /* 回滚逻辑 */ }
}
```

### `PostHandlerInvoker` - 后置业务处理器(配置方式)

节点 `postHandler` 字段配 `beanClass#methodName`,引擎反射调用,与 `dingtalkapprovalconfig` 反射思路一致。方法签名约定:`void methodName(ApprovalPO) throws FLException`。

### `ApproverResolver` - 审批人解析器

把节点的 `approverRule + approverData` 解析成 userId 列表。当前实现支持"指定人/自选",部门负责人/角色规则留扩展点。

---

## 关键文件清单

### 引擎层(`engine/` 包,2026新增)
```
ApprovalNodeHandler.java          - 后置业务 SPI 接口
ApprovalHandlerRegistry.java      - 处理器注册中心(businessType → handler)
ApproverResolver.java             - 审批人解析接口
DefaultApproverResolver.java      - 审批人解析默认实现
NodeCompletionStrategy.java       - 节点完成判定(串行/或签/并签/会签)
NodeCompletionResult.java         - 判定结果
PostHandlerInvoker.java           - 后置业务反射调用器
```

### Service 层
```
ApprovalService / ApprovalServiceImpl          - 老链路核心(23-case switch + 守卫)
ApprovalFlowEngineService / Impl               - 新引擎核心(startFlow/agreeTask/refuseTask)
ApprovalFlowService / Impl                     - 流程定义管理 CRUD
ApprovalDecorationContractService / Impl       - 装饰合同审批(已接入新引擎)
[其他 20+ 个业务审批 Service]
```

### Action 层
```
ApprovalAction.java                - 老链路控制器
ApprovalFlowAction.java            - 流程定义管理(新增)
ApprovalTaskAction.java            - 任务操作(新增)
ApprovalDecorationContractAction.java - 装饰合同
[其他 20+ 个业务审批 Action]
```

### SQL
```
sqls/approval/10_approval_flow_engine.sql              - 新引擎三张表建表
sqls/approval/20_sample_decoration_contract_flow.sql   - 装饰合同试点配置示例
sqls/dingtalk/10_dingtalk_approval_config.sql          - 钉钉回调配置表
```

---

## 如何接入新引擎(给业务开发者的指引)

1. **配置流程定义**:执行 SQL 向 `approvalFlow` + `approvalFlowNode` 插入流程和节点定义(参考 `20_sample_decoration_contract_flow.sql`)
2. **配置表单(可选)**:若审批需填写业务表之外的字段(如降点比例),向 `approvalForm` + `approvalFormField` 插入表单和字段定义,`approvalForm.flowId` 指向流程定义
3. **提交时接入**:在业务审批 Service 的 `submitApprovalForXxx` 方法末尾加:
   ```java
   if (approvalFlowEngineService != null
       && approvalFlowEngineService.hasFlow(ApprovalPO.APPROVAL_TYPE_XXX_INT, company)) {
       approvalFlowEngineService.startFlow(approvalPO);
   }
   ```
3. **后置业务**:二选一
   - 编码方式:业务 Service 实现 `ApprovalNodeHandler`
   - 配置方式:节点 `postHandler` 填 `beanClass#methodName`
4. **前端审批**:改调 `ApprovalTaskAction` 的 `agreeApprovalTask/refuseApprovalTask`

> **兼容性**:未执行第1步(不配 flow)的业务类型,100% 保持老行为,零影响。

---

## 常见问题

### Q1: 老的 `approveApproval` 接口对已接入新引擎的审批单会怎样?
A: 抛 `FLException(240060, "该审批单已接入流程引擎,请通过任务接口审批")`。这是 `ApprovalServiceImpl` 里的 `hasTask` 守卫,防止首节点就误触发后置业务。

### Q2: 钉钉回调对已接入新引擎的审批单会怎样?
A: 钉钉通用审批(type=0)回调里,先用 `hasTask` 判断该单是否走新引擎:
- **有 task**:调 `agreeByAssignee/refuseByAssignee`,按 `staffId`(=ERP userId)匹配待办 task,推进节点流转——实现"钉钉端审批 → 本地引擎流转"的双端互认
- **无 task**:走老逻辑 `approvalService.approve/refuse(PO)`

对于配了 flow 的业务,提交时已不推钉钉(互斥),但存量带 piid 的单据仍能被钉钉回调安全驱动。

### Q3: 或签/并签如何判定?
A: `NodeCompletionStrategy.judge()` 按 nodeType 判定:
- 或签(3):任一 agree 即 `NODE_PASSED`,其余待办失效
- 并签(2):统计 agree 数 == 总人数 才 `NODE_PASSED`
- 会签(4):agree 比例 >= passRatio 才 `NODE_PASSED`
- 任何类型出现 refuse 即 `NODE_REJECTED`

### Q4: 审批人如何确定?
A: `ApproverResolver.resolve(node, senderId)`,按 `approverRule` 解析 `approverData`(JSON)。指定人规则:`["U001","U002"]`。部门负责人/角色规则需扩展 `DefaultApproverResolver`。

---

## 变更记录

### 2026-07-12 (P3 表单层)
- 新增全新表单结构(EAV 纵向):`approvalForm`/`approvalFormField`/`approvalFormData` 三表
- MySQL 5.6 友好:全部标量列,无 JSON,`(aid, fieldId)` 联合索引
- `ApprovalNodeHandler` SPI 加 `onPreSubmit(approvalPO, formData)` 前置校验扩展点
- `startFlow` 增加 `formData` 重载,提交时自动存表单数据
- 复用决策:不复用 `process`/`processItem`(它们是钉钉表单,语义不同)

### 2026-07-12 (P5 钉钉解耦)
- 钉钉回调支持驱动本地引擎:`agreeByAssignee/refuseByAssignee` 按 staffId 匹配 task 推进节点
- 实现钉钉端/Web端双端互认:同一审批单可在钉钉APP或Web页任一端审批
- 提交互斥:配了 flow 的业务不推钉钉,避免双引擎并行状态混乱
- 新增 `ApprovalTaskDao.queryPendingTask` / `ApprovalFlowEngineService.agreeByAssignee|refuseByAssignee`

### 2026-07-12 (P0-P4 引擎落地)
- 新增配置化流程引擎(engine 包 + approvalFlow/Node/Task 三表)
- 支持串行/或签/并签/会签四种节点类型
- `ApprovalServiceImpl` 加 SPI 短路 + hasTask 守卫,兼容老链路
- 装饰合同(type=24)作为首个试点接入新引擎
- 修正本文档:原文档将 `processItem` 误描述为"审批节点",实际是钉钉表单字段定义

### 2025-12-01
- 初始化审批流程模块文档(⚠️ 部分描述与代码不符,已在 2026-07-12 修正)
