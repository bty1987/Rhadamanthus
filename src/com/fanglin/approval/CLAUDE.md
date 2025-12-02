# 审批流程模块 (approval)

[根目录](../../../../CLAUDE.md) > [src/com/fanglin](../../) > **approval**

> 最后更新：2025-12-01 14:58:35

---

## 模块职责

**审批流程模块**是 Rhadamanthus ERP 系统的工作流引擎,负责管理所有业务流程的审批、流转、抄送等功能,为装饰订单、报价、退款、合同等业务提供流程化管理能力。

**核心价值**
- 可配置的审批流程定义
- 多级审批与会签支持
- 审批记录全程跟踪
- 审批超时预警
- 流程归档与查询

---

## 入口与启动

### 主入口 Action
- **ApprovalAction.java** - 审批主控制器
- **ProcessAction.java** - 流程定义管理
- **ApproverAction.java** - 审批人管理
- **ProcessReferAction.java** - 流程抄送管理

### 业务审批 Action (按业务模块分类)
- **ApprovalDecorationContractAction.java** - 装饰合同审批
- **ApprovalDecorationRefundAction.java** - 装饰退款审批
- **ApprovalDecorationActivityAction.java** - 装饰活动审批
- **ApprovalQuotationPreferAction.java** - 报价优惠审批
- **ApprovalQuotationDiscountAction.java** - 报价折扣审批
- **ApprovalMaterialRefundAction.java** - 主材退款审批
- **ApprovalSalesRefundAction.java** - 销售退款审批
- **ApprovalCustomerOriginAction.java** - 客户来源审批
- **ApprovalCustomerChanceAction.java** - 客户机会审批

### 访问路径
```
前端页面: WebContent/views/approval/
API 端点: *.do
示例: pageApproval.do, submitApproval.do, agreeApproval.do
```

---

## 对外接口

### 核心 API 端点

| 接口名称 | 请求方式 | 路径 | 功能描述 |
|---------|---------|------|---------|
| pageApproval | POST | /pageApproval.do | 分页查询审批列表 |
| pageApprovalByReceiveId | POST | /pageApprovalByReceiveId.do | 查询我收到的审批 |
| submitApproval | POST | /submitApproval.do | 提交审批 |
| agreeApproval | POST | /agreeApproval.do | 同意审批 |
| rejectApproval | POST | /rejectApproval.do | 拒绝审批 |
| recallApproval | POST | /recallApproval.do | 撤回审批 |
| transferApproval | POST | /transferApproval.do | 转交审批 |
| pageProcess | POST | /pageProcess.do | 查询流程定义列表 |
| createProcess | POST | /createProcess.do | 创建流程定义 |
| updateProcess | POST | /updateProcess.do | 更新流程定义 |
| deleteProcess | POST | /deleteProcess.do | 删除流程定义 |
| queryProcessDetail | POST | /queryProcessDetail.do | 查询流程详情 |
| pageApprover | POST | /pageApprover.do | 查询审批人列表 |
| updateApprover | POST | /updateApprover.do | 更新审批人 |

### 请求参数示例
```json
{
  "approvalId": "APR202512010001",
  "action": "agree",
  "comment": "同意通过",
  "userId": "U00001"
}
```

### 响应格式
```json
{
  "code": 200,
  "message": "审批成功",
  "data": {
    "approvalId": "APR202512010001",
    "status": 2,
    "nextApproverId": "U00002"
  }
}
```

---

## 关键依赖与配置

### 依赖的模块
- **system** - 用户与组织信息
- **personel** - 人员信息
- 被所有业务模块依赖 (decoration, quotation, sales 等)

### 配置文件
无独立配置文件,使用全局配置:
- `conf/ApplicationContext.xml` - Spring 配置
- `conf/struts.xml` - Struts2 路由配置

### 关键常量
- 审批状态: 0-草稿, 1-待审批, 2-已同意, 3-已拒绝, 4-已撤回, 5-已转交
- 流程类型: 参见下方"流程类型清单"
- 审批节点类型: 1-串行审批, 2-并行审批(会签), 3-或签(一人通过即可)

---

## 数据模型

### 核心实体 (PO)

#### ApprovalPO - 审批主表 (泛化设计)
```java
@Entity
@Table(name = "approval")
public class ApprovalPO {
    @Id private String approvalId;               // 审批ID (主键)
    private Short approvalType;                  // 审批类型
    private String businessId;                   // 业务ID (关联业务表主键)
    private String processId;                    // 流程定义ID
    private String submitUserId;                 // 提交人ID
    private String submitUserName;               // 提交人姓名
    private String currentApproverId;            // 当前审批人ID
    private String currentApproverName;          // 当前审批人姓名
    private Short currentNode;                   // 当前审批节点
    private Short status;                        // 审批状态
    private Timestamp submitTime;                // 提交时间
    private Timestamp approvalTime;              // 审批时间
    private String approvalComment;              // 审批意见
    // ...
}
```

#### ProcessPO - 流程定义表
```java
@Entity
@Table(name = "process")
public class ProcessPO {
    @Id private String processId;                // 流程ID
    private String processName;                  // 流程名称
    private String processCode;                  // 流程编码
    private Short processType;                   // 流程类型
    private String processDesc;                  // 流程描述
    private Short nodeCount;                     // 审批节点数
    private Short status;                        // 状态 (0-禁用,1-启用)
    private Timestamp createTime;                // 创建时间
}
```

#### ProcessItemPO - 流程节点表
```java
@Entity
@Table(name = "process_item")
public class ProcessItemPO {
    @Id private String itemId;                   // 节点ID
    private String processId;                    // 流程ID
    private Short nodeSeq;                       // 节点顺序
    private String nodeName;                     // 节点名称
    private Short nodeType;                      // 节点类型 (1-串行,2-并行,3-或签)
    private String approverId;                   // 审批人ID (可为空,动态获取)
    private String approverRule;                 // 审批人规则 (如:直属上级)
    private Short timeout;                       // 超时时间(小时)
    private Short autoAgree;                     // 超时自动通过 (0-否,1-是)
}
```

#### ApproverPO - 审批人配置表
```java
@Entity
@Table(name = "approver")
public class ApproverPO {
    @Id private String approverId;               // 配置ID
    private Short approvalType;                  // 审批类型
    private String userId;                       // 用户ID
    private String userName;                     // 用户姓名
    private Short nodeSeq;                       // 审批节点
    private String departmentId;                 // 部门ID (可选)
    private String companyId;                    // 公司ID (可选)
    private Short status;                        // 状态
}
```

#### ProcessReferPO - 流程抄送表
```java
@Entity
@Table(name = "process_refer")
public class ProcessReferPO {
    @Id private String referId;                  // 抄送ID
    private String approvalId;                   // 审批ID
    private String userId;                       // 抄送人ID
    private String userName;                     // 抄送人姓名
    private Timestamp referTime;                 // 抄送时间
    private Short isRead;                        // 是否已读 (0-未读,1-已读)
}
```

### 业务审批实体 (按业务类型)
- **ApprovalDecorationContractPO** - 装饰合同审批
- **ApprovalDecorationRefundPO** - 装饰退款审批
- **ApprovalQuotationPreferPO** - 报价优惠审批
- **ApprovalMaterialRefundPO** - 主材退款审批
- **ApprovalSalesRefundPO** - 销售退款审批
- **ApprovalCustomerOriginPO** - 客户来源审批

> 说明: 各业务审批表继承审批主表的基本字段,并添加业务特定字段。

---

## 流程类型清单

| 类型代码 | 流程名称 | 适用业务 | 典型节点 |
|---------|---------|---------|---------|
| 1 | 装饰合同审批 | 装饰订单签约 | 设计师主管 → 运营经理 → 总经理 |
| 2 | 装饰退款审批 | 装饰订单退款 | 财务主管 → 总经理 |
| 3 | 装饰活动审批 | 活动价格审批 | 营销经理 → 总经理 |
| 4 | 报价优惠审批 | 报价折扣优惠 | 设计师主管 → 运营经理 |
| 5 | 报价折扣审批 | 报价整体折扣 | 设计师主管 → 运营经理 → 总经理 |
| 6 | 主材退款审批 | 主材订单退款 | 主材主管 → 财务主管 |
| 7 | 销售退款审批 | 销售订单退款 | 销售主管 → 财务主管 |
| 8 | 客户来源审批 | 客户来源变更 | 销售主管 |
| 9 | 客户机会审批 | 客户机会分配 | 销售主管 |
| 10 | 功能权限审批 | 特殊权限申请 | 系统管理员 |

---

## 审批流程示例

### 装饰合同审批流程
```
1. 设计师提交合同审批
   ↓
2. 设计师主管审批
   ↓ (同意)
3. 运营经理审批
   ↓ (同意)
4. 总经理审批
   ↓ (同意)
5. 审批完成,合同生效
```

### 报价优惠审批流程
```
1. 设计师申请优惠
   ↓
2. 设计师主管审批
   ↓ (同意且优惠率 < 5%)
3. 审批完成
   ↓ (同意且优惠率 >= 5%)
4. 运营经理审批
   ↓ (同意)
5. 审批完成
```

---

## 测试与质量

### 当前状态
- ❌ 未发现单元测试
- ❌ 未发现集成测试
- ⚠️ 主要依赖手工测试

### 建议测试用例
1. **流程流转测试**
   - 测试单级审批流程
   - 测试多级审批流程
   - 测试并行审批(会签)
   - 测试或签审批

2. **审批操作测试**
   - 测试同意审批
   - 测试拒绝审批
   - 测试撤回审批
   - 测试转交审批

3. **超时处理测试**
   - 测试审批超时预警
   - 测试超时自动通过

4. **权限控制测试**
   - 测试只有当前审批人可操作
   - 测试提交人可撤回
   - 测试抄送人只读权限

---

## 常见问题 (FAQ)

### Q1: 审批流程如何定义?
A: 在 `process` 表定义流程基本信息,在 `process_item` 表定义各审批节点。节点可配置审批人、超时时间、自动通过规则等。

### Q2: 审批人如何确定?
A: 审批人可以静态配置(在 `approver` 表),也可以动态获取(如"直属上级"、"部门经理"等规则)。系统根据 `approverRule` 字段动态查询。

### Q3: 如何撤回已提交的审批?
A: 调用 `recallApproval.do` 接口,只有提交人可以撤回,且只能撤回未开始审批或第一节点未通过的审批。

### Q4: 审批记录如何查询?
A: 通过 `pageApproval.do` 可查询所有审批记录,通过 `pageApprovalByReceiveId.do` 可查询当前用户待审批的记录。

### Q5: 审批流程是否支持跳过某个节点?
A: 当前不支持跳过节点,但可以在节点配置中设置"自动通过"或配置"或签"模式(一人通过即可)。

---

## 相关文件清单

### Action 层
```
ApprovalAction.java                      - 审批主控制器
ApprovalCommonAction.java                - 公共方法
ProcessAction.java                       - 流程定义管理
ProcessReferAction.java                  - 流程抄送管理
ApproverAction.java                      - 审批人管理
ApprovalFunctionAction.java              - 功能权限审批

[业务审批 Action]
ApprovalDecorationContractAction.java    - 装饰合同审批
ApprovalDecorationRefundAction.java      - 装饰退款审批
ApprovalDecorationActivityAction.java    - 装饰活动审批
ApprovalDecorationBelongAction.java      - 装饰归属审批
ApprovalQuotationPreferAction.java       - 报价优惠审批
ApprovalQuotationDiscountAction.java     - 报价折扣审批
ApprovalMaterialRefundAction.java        - 主材退款审批
ApprovalMaterialFullPaymentAction.java   - 主材全款审批
ApprovalSalesRefundAction.java           - 销售退款审批
ApprovalSalesDiscountAction.java         - 销售折扣审批
ApprovalCustomerOriginAction.java        - 客户来源审批
ApprovalCustomerChanceAction.java        - 客户机会审批
(共20+个 Action)
```

### Service 层
```
service/ApprovalService.java
service/impl/ApprovalServiceImpl.java
service/ProcessService.java
service/impl/ProcessServiceImpl.java
(其他对应 Service 类...)
```

### DAO 层
```
dao/ApprovalDao.java
dao/impl/ApprovalDaoImpl.java
(其他对应 DAO 类...)
```

### PO 层
```
ApprovalPO.java                          - 审批主表
ProcessPO.java                           - 流程定义
ProcessItemPO.java                       - 流程节点
ApproverPO.java                          - 审批人配置
ProcessReferPO.java                      - 流程抄送
[业务审批 PO 20+ 个]
```

---

## 变更记录

### 2025-12-01 14:58:35
- 初始化审批流程模块文档
- 记录核心 API 接口与数据模型
- 添加流程类型清单与流程示例
- 添加常见问题解答
