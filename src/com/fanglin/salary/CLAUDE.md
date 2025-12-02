# salary - 薪资管理模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **salary**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

salary 模块负责系统的**薪资核算与发放管理**，涵盖基本工资、提成、奖金、扣款、工资条生成、设计师薪资、工人结算等功能，支持多种薪资计算规则与审批流程。

**核心功能**
- 薪资方案管理
- 工资核算与审批
- 工资条生成与发放
- 设计师薪资（装饰订单提成）
- 主材销售提成
- 工人结算（施工队结算）
- 扣款管理
- 预支工资管理
- 薪资报表

---

## 入口与启动

### 控制器入口
- `SalaryAction` - 薪资核心管理
- `DesignerSalaryAction` - 设计师薪资
- `DecorationSalaryAction` - 装饰订单提成
- `MaterialSalaryAction` - 主材销售提成
- `WorkerSalaryAction` - 工人薪资
- `WorkerBalanceAction` - 工人结算
- `SalaryDrawingAction` - 预支工资
- `WithholdAction` - 扣款管理

### 前端页面
- `WebContent/views/salary/salary.html` - 薪资列表（缺失，需在其他目录）
- `WebContent/views/salary/designerSalary.html` - 设计师薪资
- `WebContent/views/salary/workerSalary.html` - 工人薪资

---

## 对外接口

### 薪资管理
```java
// 分页查询薪资
GET/POST /pageSalary.do
Request: Paging + Filters + salary
Response: { data: [...], total, pages }

// 新增薪资
POST /addSalary.do
Request: {
  user: UserPO,
  type: short,        // 薪资类型
  onetype: short,     // 一级类型
  twotype: short,     // 二级类型
  thrtype: short,     // 三级类型
  money: long,        // 金额（分）
  comment: String     // 备注
}
Response: success

// 通过薪资
POST /passSalary.do
Request: { sid, userId }
Response: success

// 驳回薪资
POST /rejectSalary.do
Request: { sid, userId, comment }
Response: success

// 撤销薪资
POST /cancelSalary.do
Request: { sid, userId }
Response: success
```

### 设计师薪资
```java
// 分页查询设计师薪资
GET/POST /pageDesignerSalary.do
Request: Paging + Filters
Response: { salaries: [...] }

// 计算设计师提成
POST /calculateDesignerSalary.do
Request: { orderId, userId }
Response: { salary: {...} }
```

### 装饰订单薪资
```java
// 分页查询装饰薪资
GET/POST /pageDecorationSalary.do
Request: Paging + Filters
Response: { salaries: [...] }

// 生成装饰提成
POST /generateDecorationSalary.do
Request: { orderId }
Response: success
```

### 主材销售薪资
```java
// 分页查询主材薪资
GET/POST /pageMaterialSalary.do
Request: Paging + Filters
Response: { salaries: [...] }

// 生成主材提成
POST /generateMaterialSalary.do
Request: { salesOrderId }
Response: success
```

### 工人薪资
```java
// 分页查询工人薪资
GET/POST /pageWorkerSalary.do
Request: Paging + Filters
Response: { salaries: [...] }

// 新增工人薪资
POST /addWorkerSalary.do
Request: { worker, money, ... }
Response: success
```

### 工人结算
```java
// 分页查询工人结算
GET/POST /pageWorkerBalance.do
Request: Paging + Filters
Response: { balances: [...] }

// 新增结算
POST /addWorkerBalance.do
Request: { worker, orderId, money, ... }
Response: success

// 结算审批
POST /approveWorkerBalance.do
Request: { wbid, approve }
Response: success
```

### 预支工资
```java
// 分页查询预支
GET/POST /pageSalaryDrawing.do
Request: Paging + Filters
Response: { drawings: [...] }

// 申请预支
POST /addSalaryDrawing.do
Request: { user, money, reason }
Response: success

// 审批预支
POST /approveSalaryDrawing.do
Request: { sdid, approve }
Response: success
```

### 扣款管理
```java
// 分页查询扣款
GET/POST /pageWithhold.do
Request: Paging + Filters
Response: { withholds: [...] }

// 新增扣款
POST /addWithhold.do
Request: { user, money, reason, type }
Response: success

// 审批扣款
POST /approveWithhold.do
Request: { wid, approve }
Response: success
```

---

## 关键依赖与配置

### 核心依赖
- `com.fanglin.personel` - 员工信息
- `com.fanglin.decoration` - 装饰订单（提成来源）
- `com.fanglin.sales` - 主材销售（提成来源）
- `com.fanglin.construction` - 施工管理（工人结算依据）
- `com.fanglin.approval` - 审批流程
- `com.fanglin.payment` - 支付管理（发放工资）

### 导航配置
- `ds/salary.json` - 薪资管理菜单配置
  - 薪资管理
  - 设计师薪资
  - 工人薪资
  - 预支管理
  - 扣款管理
  - 薪资报表

---

## 数据模型

### 核心实体（PO）

#### SalaryPO - 薪资记录
```java
@Entity
@Table(name = "salary", catalog = "salary")
- sid: long                     // 薪资ID
- user: UserPO                  // 员工
- createTime: Timestamp         // 创建时间
- type: short                   // 薪资类型
- onetype: short                // 一级类型
- twotype: short                // 二级类型
- thrtype: short                // 三级类型
- money: long                   // 金额（分）
- status: short                 // 状态
  - 0: 待审批
  - 1: 已通过
  - 2: 已驳回
  - 3: 已撤销
- operater: UserPO              // 审批人
- operateTime: Timestamp        // 审批时间
- comment: String               // 备注
```

#### DesignerSalaryPO - 设计师薪资
```java
@Entity
- dsid: long                    // 薪资ID
- user: UserPO                  // 设计师
- order: DecorationPO           // 关联订单
- signAmount: long              // 签单金额
- commissionRate: int           // 提成比例（百分比*100）
- commissionAmount: long        // 提成金额
- createTime: Timestamp         // 创建时间
- status: short                 // 状态
```

#### DecorationSalaryPO - 装饰订单薪资
```java
@Entity
- dsid: long                    // 薪资ID
- order: DecorationPO           // 装饰订单
- user: UserPO                  // 受益人
- type: short                   // 薪资类型（设计师/销售/项目经理）
- money: long                   // 金额
- createTime: Timestamp         // 创建时间
```

#### MaterialSalaryPO - 主材销售薪资
```java
@Entity
- msid: long                    // 薪资ID
- salesOrder: SalesOrderPO      // 主材订单
- user: UserPO                  // 销售员
- saleAmount: long              // 销售金额
- commissionAmount: long        // 提成金额
- createTime: Timestamp         // 创建时间
```

#### WorkerSalaryPO - 工人薪资
```java
@Entity
- wsid: long                    // 薪资ID
- worker: UserPO                // 工人
- order: DecorationPO           // 关联订单
- workType: String              // 工种
- money: long                   // 金额
- createTime: Timestamp         // 创建时间
- status: short                 // 状态
```

#### WorkerBalancePO - 工人结算
```java
@Entity
- wbid: long                    // 结算ID
- worker: UserPO                // 工人
- order: DecorationPO           // 订单
- workDays: int                 // 工作天数
- unitPrice: long               // 单价
- total: long                   // 总金额
- paid: long                    // 已付金额
- unpaid: long                  // 未付金额
- createTime: Timestamp         // 创建时间
- status: short                 // 状态
```

#### SalaryDrawingPO - 预支工资
```java
@Entity
- sdid: long                    // 预支ID
- user: UserPO                  // 申请人
- money: long                   // 预支金额
- reason: String                // 预支原因
- applyTime: Timestamp          // 申请时间
- approver: UserPO              // 审批人
- approveTime: Timestamp        // 审批时间
- status: short                 // 状态（待审批/已批准/已拒绝）
```

#### WithholdPO - 扣款
```java
@Entity
- wid: long                     // 扣款ID
- user: UserPO                  // 扣款对象
- money: long                   // 扣款金额
- type: short                   // 扣款类型（罚款/赔偿/其他）
- reason: String                // 扣款原因
- createTime: Timestamp         // 创建时间
- approver: UserPO              // 审批人
- approveTime: Timestamp        // 审批时间
- status: short                 // 状态
```

### 值对象（VO）
- `SalaryVO` - 薪资视图对象
- `DesignerSalaryVO` - 设计师薪资视图
- `DecorationSalaryVO` - 装饰薪资视图
- `MaterialSalaryVO` - 主材薪资视图
- `WorkerSalaryVO` - 工人薪资视图
- `WorkerBalanceVO` - 工人结算视图
- `SalaryDrawingVO` - 预支视图
- `WithholdVO` - 扣款视图

---

## 薪资计算规则

### 设计师薪资
1. **签单提成**
   - 基于签单金额按比例计算
   - 不同金额区间不同提成比例
   - 阶梯式提成机制

2. **回款提成**
   - 基于实际回款金额
   - 分阶段结算

3. **增项提成**
   - 增项金额单独提成

### 主材销售提成
- 基于销售金额
- 按品类不同提成比例
- 考虑销售目标达成率

### 工人结算
1. **按天结算**
   - 工作天数 × 日工资

2. **按项结算**
   - 根据完成的工程项计算

3. **计件工资**
   - 完成数量 × 单价

---

## 薪资审批流程

```
发起申请 → 一级审批 → 二级审批 → 财务审核 → 发放
   ↓
驳回 → 重新申请
```

---

## 测试与质量

### 当前测试覆盖
- 未发现独立的测试文件
- 依赖手工测试与财务对账

### 建议增强
1. 为薪资计算逻辑添加单元测试
2. 测试提成比例计算的准确性
3. 验证审批流程的完整性
4. 测试薪资汇总与报表生成

---

## 常见问题 (FAQ)

**Q: 设计师提成如何计算？**
A: 基于以下规则：
1. 签单提成：签单金额 × 提成比例
2. 回款提成：回款金额 × 提成比例
3. 增项提成：增项金额 × 提成比例
4. 具体比例根据薪资方案配置

**Q: 工人结算流程是什么？**
A:
1. 项目经理确认工作量
2. 生成结算单
3. 提交审批
4. 财务审核
5. 发放工资

**Q: 预支工资有什么限制？**
A:
- 预支金额不超过当月应发工资
- 需要审批
- 在正式发工资时扣除

**Q: 扣款如何处理？**
A:
1. 创建扣款记录
2. 说明扣款原因
3. 提交审批
4. 审批通过后从工资中扣除

**Q: 薪资发放流程是什么？**
A:
1. 财务部门核算工资
2. 生成工资条
3. 提交审批
4. 审批通过后发放
5. 员工可在系统中查看工资条

**Q: 如何处理薪资计算错误？**
A:
- 未审批：直接修改或撤销
- 已审批：需要财务撤销后重新计算

---

## 相关文件清单

### 核心代码
```
src/com/fanglin/salary/
├── action/
│   ├── SalaryAction.java                 - 薪资核心管理 ★
│   ├── DesignerSalaryAction.java         - 设计师薪资
│   ├── DecorationSalaryAction.java       - 装饰订单提成
│   ├── MaterialSalaryAction.java         - 主材销售提成
│   ├── WorkerSalaryAction.java           - 工人薪资
│   ├── WorkerBalanceAction.java          - 工人结算
│   ├── SalaryDrawingAction.java          - 预支工资
│   └── WithholdAction.java               - 扣款管理
├── service/
│   ├── SalaryService.java                - 薪资服务
│   ├── DesignerSalaryService.java        - 设计师薪资服务
│   ├── WorkerSalaryService.java          - 工人薪资服务
│   ├── WorkerBalanceService.java         - 工人结算服务
│   ├── SalaryDrawingService.java         - 预支服务
│   └── WithholdService.java              - 扣款服务
├── dao/
│   ├── SalaryDao.java                    - 薪资DAO
│   ├── DesignerSalaryDao.java            - 设计师薪资DAO
│   ├── WorkerSalaryDao.java              - 工人薪资DAO
│   └── WorkerBalanceDao.java             - 工人结算DAO
├── po/
│   ├── SalaryPO.java                     - 薪资实体 ★
│   ├── DesignerSalaryPO.java             - 设计师薪资实体
│   ├── DecorationSalaryPO.java           - 装饰薪资实体
│   ├── MaterialSalaryPO.java             - 主材薪资实体
│   ├── WorkerSalaryPO.java               - 工人薪资实体
│   ├── WorkerBalancePO.java              - 工人结算实体
│   ├── SalaryDrawingPO.java              - 预支实体
│   └── WithholdPO.java                   - 扣款实体
└── vo/
    ├── SalaryVO.java                     - 薪资VO
    ├── DesignerSalaryVO.java             - 设计师薪资VO
    ├── WorkerSalaryVO.java               - 工人薪资VO
    ├── WorkerBalanceVO.java              - 工人结算VO
    ├── SalaryDrawingVO.java              - 预支VO
    └── WithholdVO.java                   - 扣款VO
```

**★ 标注的是最常用的核心功能**

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化薪资管理模块 AI 上下文文档
- 记录工资核算、提成计算、工人结算等功能
- 补充薪资计算规则与审批流程说明
- 添加常见问题解答
