# 装饰订单管理模块 (decoration)

[根目录](../../../../CLAUDE.md) > [src/com/fanglin](../../) > **decoration**

> 最后更新：2025-12-01 14:58:35

---

## 模块职责

**装饰订单管理模块**是 Rhadamanthus ERP 系统的核心业务模块,负责管理装饰整装订单的全生命周期,从客户签约、合同管理、付款跟踪到订单归属与结算的完整流程。

**核心价值**
- 订单全生命周期管理 (新建 → 设计 → 施工 → 验收 → 结算)
- 多套餐类型支持 (整装、半包、大包)
- 合同与付款节点管理
- 订单归属与业绩分配
- 增项减项与变更管理

---

## 入口与启动

### 主入口 Action
- **DecorationAction.java** - 装饰订单主控制器
  - `pageDecoration()` - 分页查询订单列表
  - `pageDecorationForGeneral()` - 综合查询
  - `pageDecorationForDesigner()` - 按设计师查询
  - `pageDecorationForCustomer()` - 按客户查询
  - `createDecoration()` - 创建新订单
  - `updateDecoration()` - 更新订单信息
  - `deleteDecoration()` - 删除订单

### 其他关键 Action
- **DecorationContractAction.java** - 合同管理
- **DecorationBalanceAction.java** - 订单结算
- **DecorationBelongAction.java** - 订单归属管理
- **DecorationPictureAction.java** - 订单图片管理
- **DecorationActivityAction.java** - 活动订单管理
- **BackVisitAction.java** - 订单回访管理

### 访问路径
```
前端页面: WebContent/views/decoration/
API 端点: *.do (Struts2 路由)
示例: pageDecoration.do, createDecoration.do
```

---

## 对外接口

### 核心 API 端点

| 接口名称 | 请求方式 | 路径 | 功能描述 |
|---------|---------|------|---------|
| pageDecoration | POST | /pageDecoration.do | 分页查询装饰订单列表 |
| pageDecorationForGeneral | POST | /pageDecorationForGeneral.do | 综合查询订单(支持多条件筛选) |
| pageDecorationForDesigner | POST | /pageDecorationForDesigner.do | 按设计师查询订单 |
| pageDecorationForCustomer | POST | /pageDecorationForCustomer.do | 按客户查询订单 |
| createDecoration | POST | /createDecoration.do | 创建新装饰订单 |
| updateDecoration | POST | /updateDecoration.do | 更新订单信息 |
| deleteDecoration | POST | /deleteDecoration.do | 删除订单 |
| queryDecoration | POST | /queryDecoration.do | 查询单个订单详情 |
| pageDecorationContract | POST | /pageDecorationContract.do | 查询合同列表 |
| createDecorationContract | POST | /createDecorationContract.do | 创建装饰合同 |
| updateDecorationBelong | POST | /updateDecorationBelong.do | 更新订单归属关系 |

### 请求参数示例
```json
{
  "paging": {
    "page": 1,
    "rows": 20
  },
  "filters": [
    {"field": "customerName", "operator": "like", "value": "张三"},
    {"field": "status", "operator": "eq", "value": 2}
  ],
  "statuses": [1, 2, 3],
  "companyType": 1
}
```

### 响应格式
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 150,
    "rows": [
      {
        "decorationOrderId": "D202512010001",
        "customerName": "张三",
        "customerPhone": "13800138000",
        "decorationType": 1,
        "totalAmount": 180000.00,
        "status": 2,
        "createTime": "2025-11-20 10:30:00"
      }
    ]
  }
}
```

---

## 关键依赖与配置

### 依赖的模块
- **customer** - 客户信息模块
- **quotation** - 报价管理模块
- **building** - 楼盘管理模块
- **communion** - 公共基础数据
- **approval** - 审批流程模块
- **payment** - 支付管理模块

### 配置文件
无独立配置文件,使用全局配置:
- `conf/ApplicationContext.xml` - Spring 配置
- `conf/struts.xml` - Struts2 路由配置

### 关键常量
- 订单状态: 0-草稿, 1-待审核, 2-已签约, 3-施工中, 4-已验收, 5-已结算, 9-已取消
- 装饰类型: 1-整装, 2-半包, 3-大包, 4-局改
- 付款方式: 0-现金, 1-刷卡, 2-转账, 3-支付宝, 4-微信

---

## 数据模型

### 核心实体 (PO)

#### DecorationPO - 装饰订单主表
```java
@Entity
@Table(name = "decoration")
public class DecorationPO {
    @Id private String decorationOrderId;        // 订单编号 (主键)
    private String customerId;                   // 客户ID
    private String customerName;                 // 客户姓名
    private String customerPhone;                // 客户电话
    private String villageName;                  // 小区名称
    private String houseId;                      // 房屋ID
    private Short decorationType;                // 装饰类型
    private Short decorationGrade;               // 装饰等级
    private Double totalAmount;                  // 订单总额
    private Double paidAmount;                   // 已付金额
    private Double unpaidAmount;                 // 未付金额
    private Short status;                        // 订单状态
    private String designerId;                   // 设计师ID
    private String designerName;                 // 设计师姓名
    private String salesmanId;                   // 业务员ID
    private String salesmanName;                 // 业务员姓名
    private Timestamp contractTime;              // 签约时间
    private Timestamp createTime;                // 创建时间
    private Timestamp updateTime;                // 更新时间
    // ... 更多字段
}
```

#### DecorationContractPO - 装饰合同
```java
@Entity
@Table(name = "decoration_contract")
public class DecorationContractPO {
    @Id private String contractId;               // 合同编号
    private String decorationOrderId;            // 关联订单ID
    private String contractNo;                   // 合同编号
    private String contractType;                 // 合同类型
    private Double contractAmount;               // 合同金额
    private String contractContent;              // 合同内容
    private Timestamp signTime;                  // 签约时间
    private Short status;                        // 合同状态
    // ...
}
```

#### DecorationBalancePO - 订单结算
```java
@Entity
@Table(name = "decoration_balance")
public class DecorationBalancePO {
    @Id private String balanceId;                // 结算ID
    private String decorationOrderId;            // 关联订单ID
    private Double balanceAmount;                // 结算金额
    private Double discountAmount;               // 优惠金额
    private Double finalAmount;                  // 最终金额
    private Timestamp balanceTime;               // 结算时间
    // ...
}
```

#### DecorationBelongPO - 订单归属
```java
@Entity
@Table(name = "decoration_belong")
public class DecorationBelongPO {
    @Id private String belongId;                 // 归属ID
    private String decorationOrderId;            // 关联订单ID
    private String userId;                       // 用户ID
    private String userName;                     // 用户姓名
    private String dutyId;                       // 岗位ID
    private Double percentage;                   // 业绩占比
    private Double amount;                       // 业绩金额
    // ...
}
```

### 其他重要实体

#### DecorationAdditionPO - 业务人员冗余快照
```java
@Entity @Table(name = "decorationaddition", catalog = "decoration")
public class DecorationAdditionPO {
    @Id private long daid;                       // 主键
    private String orderId;                      // 关联订单号
    private String designer;                     // 设计师姓名(冗余)
    private String designDepartment;             // 设计部门(冗余)
    private String designRegion;                 // 设计大区(冗余)
    private String salesman;                     // 销售员姓名(冗余)
    private String salesDepartment;              // 销售部门(冗余)
    private String salesRegion;                  // 销售大区(冗余)
    private Timestamp designProtectTime;         // 设计保护时间
    private Timestamp salesProtectTime;          // 销售保护时间
    private Timestamp issueTime;                 // 发布时间
    private Timestamp meetTime;                  // 见面时间
    private Timestamp belongTime;                // 归属时间
    private short brokerFlag;                    // 经纪人标识 0-否 1-是
    // ptv() 回填到 DecorationVO
}
```

#### DecorationInfoPO - 非业务人员与推荐信息
```java
@Entity @Table(name = "decorationInfo", catalog = "decoration")
public class DecorationInfoPO {
    @Id private long diid;                       // 主键
    private String orderId;                      // 关联订单号
    private String referOrderId;                 // 推荐订单号
    private String notSalesmanName;              // 非业务人员姓名
    private String notSalesmanPhone;             // 非业务人员电话
    private String notSalesmanContent;           // 非业务人员备注
    private String backOrderName;                // 返单人员姓名
    private String backOrderPhone;               // 返单人员电话
    private String backOrderContent;             // 返单人员备注
}
```

#### 表关联关系
```
DecorationPO (decoration)
  ├── @ManyToOne → DecorationAdditionPO (decorationaddition)  [Hibernate FK关联]
  ├── orderId ──→ DecorationInfoPO (decorationInfo)           [逻辑关联,无Hibernate FK]
  ├── @ManyToOne → CustomerPO, HousePO, UserPO(designer/salesman/...)
  └── orderId ──→ DecorationUserPO (decorationUser)           [逻辑关联,type区分人员类型]

DecorationUserPO 人员类型常量:
  TYPE_BUSI=0(业务), TYPE_DECO=1(装饰), TYPE_SERV=2(服务),
  TYPE_CONT=3(合同), TYPE_SALES=4(销售), TYPE_OTHER=99(其他)
```

- **DecorationPicturePO** - 订单图片
- **DecorationActivityPO** - 活动订单
- **DecorationMeasurePO** - 测量记录
- **BackVisitPO** - 回访记录
- **AuditRecordPO** - 审计记录

---

## 测试与质量

### 当前状态
- ❌ 未发现单元测试
- ❌ 未发现集成测试
- ⚠️ 主要依赖手工测试

### 建议测试用例
1. **订单创建流程测试**
   - 测试正常创建订单
   - 测试必填字段校验
   - 测试订单编号生成规则

2. **订单状态流转测试**
   - 测试草稿 → 待审核 → 已签约流程
   - 测试状态回退场景
   - 测试非法状态跳转拦截

3. **付款计算测试**
   - 测试首付款计算
   - 测试分期付款累计
   - 测试尾款自动计算

4. **归属分配测试**
   - 测试业绩百分比总和校验
   - 测试归属金额计算准确性

---

## 常见问题 (FAQ)

### Q1: 订单编号生成规则是什么?
A: 订单编号格式为 `D + YYYYMMDD + 4位流水号`,例如 `D202512010001`。流水号每天从 0001 开始,由系统自动生成。

### Q2: 订单状态如何流转?
A: 正常流程: 草稿(0) → 待审核(1) → 已签约(2) → 施工中(3) → 已验收(4) → 已结算(5)。可以在任意阶段取消订单(状态变为9)。

### Q3: 如何处理订单的增项减项?
A: 通过 `DecorationAdditionPO` 记录增减项,增项为正数,减项为负数。最终订单金额 = 原始金额 + 增项金额 - 减项金额。

### Q4: 订单归属如何分配?
A: 一个订单可以有多个归属人(设计师、业务员、项目经理等),每个归属人有一个业绩占比(percentage),所有占比之和必须等于 100%。

### Q5: 如何查询某个客户的所有订单?
A: 调用 `pageDecorationForCustomer.do` 接口,传入客户手机号 `customerPhone` 参数即可查询。

---

## 相关文件清单

### Action 层 (18个文件)
```
DecorationAction.java                    - 订单主控制器
DecorationContractAction.java            - 合同管理
DecorationBalanceAction.java             - 订单结算
DecorationBelongAction.java              - 订单归属
DecorationPictureAction.java             - 图片管理
DecorationActivityAction.java            - 活动订单
DecorationMeasureAction.java             - 测量记录
DecorationAdditionAction.java            - 增项管理
DecorationHolonomyAction.java            - 整体订单
DecorationInclusiveAction.java           - 全包订单
DecorationMidpackAction.java             - 半包订单
DecorationFunctionAction.java            - 功能模块
DecorationUserAction.java                - 用户关联
DecorationServiceAction.java             - 服务管理
BackVisitAction.java                     - 回访管理
AuditRecordAction.java                   - 审计记录
AuditScaleAction.java                    - 审计标准
DecorationCommonAction.java              - 公共方法
```

### Service 层
```
service/DecorationService.java
service/impl/DecorationServiceImpl.java
(其他对应 Service 类...)
```

### DAO 层
```
dao/DecorationDao.java
dao/impl/DecorationDaoImpl.java
(其他对应 DAO 类...)
```

### PO 层 (25个实体)
```
DecorationPO.java                        - 订单主表
DecorationContractPO.java                - 合同表
DecorationBalancePO.java                 - 结算表
DecorationBelongPO.java                  - 归属表
DecorationPicturePO.java                 - 图片表
DecorationActivityPO.java                - 活动订单
DecorationMeasurePO.java                 - 测量记录
DecorationAdditionPO.java                - 增项记录
BackVisitPO.java                         - 回访记录
AuditRecordPO.java                       - 审计记录
(其他 PO 类...)
```

### VO 层
```
vo/DecorationVO.java                     - 订单视图对象
vo/DecorationInfoVO.java                 - 订单详情
vo/DecorationContractVO.java             - 合同视图
(其他 VO 类...)
```

### 前端页面 (位于 WebContent/views/decoration/)
```
decoration.html                          - 订单列表页
decoration4create.html                   - 创建订单页
decoration4detail.html                   - 订单详情页
decorationContract.html                  - 合同管理页
decorationBalance.html                   - 结算管理页
decorationBelong.html                    - 归属管理页
(其他页面...)
```

---

## 变更记录

### 2025-12-01 14:58:35
- 初始化装饰订单模块文档
- 记录核心 API 接口与数据模型
- 添加常见问题解答
