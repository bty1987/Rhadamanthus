# customer - 客户管理模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com.fanglin](../) > **customer**

> 最后更新：2025-12-01 15:28:48

---

## 模块职责

客户管理模块是方林装饰 ERP 系统的**核心业务模块**，负责客户全生命周期管理，从潜在客户、线索跟踪、意向管理到签约客户的售后服务。该模块是装饰订单、报价、施工等业务的源头。

**核心功能**
- 客户档案管理（潜在客户、签约客户）
- 客户来源与渠道跟踪
- 客户意向与等级管理
- 客户分配与保护规则
- 客户回访与调研
- 客户投诉与反馈处理
- 客户积分与会员管理
- 维修售后服务管理

---

## 入口与启动

### 主要 Action 控制器
| Action 类 | 职责 | 关键功能 |
|----------|------|----------|
| `CustomerOriginAction.java` | 客户来源管理 | 客户线索录入、来源渠道跟踪、客户分配 |
| `CustomerProfileAction.java` | 客户档案管理 | 客户信息完善、档案查询、客户保护 |
| `CustomerChanceAction.java` | 客户机会管理 | 意向客户跟进、商机管理 |
| `RevisitAction.java` | 客户回访 | 定期回访记录、满意度调查 |
| `SurveyAction.java` | 客户调研 | 问卷调查、市场调研 |
| `FeedbackAction.java` | 客户反馈 | 意见反馈、建议收集 |
| `ComplaintAction.java` | 客户投诉 | 投诉处理、质量问题跟踪 |
| `RepairAction.java` | 维修服务 | 售后维修、保修管理 |
| `MemberAction.java` | 会员管理 | 会员等级、积分管理 |
| `GroupAction.java` | 客户分组 | 客户标签、分组管理 |

### 前端页面路径
```
WebContent/views/customer/
├── customerorigin.html         - 客户来源管理
├── customerprofile.html        - 客户档案
├── customerchance.html         - 客户机会
├── revisit.html                - 回访管理
├── survey.html                 - 客户调研
├── feedback.html               - 客户反馈
├── complaint.html              - 投诉管理
├── repair.html                 - 维修服务
└── member.html                 - 会员管理
```

---

## 对外接口

### REST API 接口

#### 客户来源管理
```
GET  /pageCustomerOrigin.do          - 分页查询客户来源列表
POST /addCustomerOrigin.do           - 添加客户来源（线索录入）
POST /updateCustomerOrigin.do        - 更新客户信息
POST /assignCustomerOrigin.do        - 分配客户给业务员
POST /approveCustomerOrigin.do       - 审批客户信息
POST /bindCustomerOrigin.do          - 绑定客户到订单
GET  /queryCustomerOriginById.do     - 查询客户详情
POST /deleteCustomerOrigin.do        - 删除客户线索
```

#### 客户档案管理
```
GET  /pageCustomerProfile.do         - 分页查询客户档案
POST /addCustomerProfile.do          - 创建客户档案
POST /updateCustomerProfile.do       - 更新客户档案
GET  /queryCustomerProfileById.do    - 查询档案详情
GET  /queryCustomerByPhone.do        - 根据手机号查询客户
POST /protectCustomer.do             - 客户保护设置
POST /releaseCustomer.do             - 释放客户保护
```

#### 客户回访
```
GET  /pageRevisit.do                 - 查询回访记录
POST /addRevisit.do                  - 创建回访记录
POST /updateRevisit.do               - 更新回访记录
GET  /queryRevisitPlan.do            - 查询回访计划
```

#### 客户反馈与投诉
```
GET  /pageFeedback.do                - 查询客户反馈
POST /addFeedback.do                 - 添加反馈
POST /handleFeedback.do              - 处理反馈
GET  /pageComplaint.do               - 查询投诉列表
POST /addComplaint.do                - 创建投诉
POST /handleComplaint.do             - 处理投诉
GET  /queryComplaintProblem.do       - 查询投诉问题分类
```

#### 维修服务
```
GET  /pageRepair.do                  - 查询维修单列表
POST /addRepair.do                   - 创建维修单
POST /updateRepair.do                - 更新维修状态
POST /assignRepair.do                - 分配维修人员
POST /finishRepair.do                - 完成维修
GET  /queryRepairPay.do              - 查询维修费用
```

---

## 关键依赖与配置

### 服务层依赖
- `CustomerOriginService` - 客户来源核心服务
- `CustomerProfileService` - 客户档案服务
- `CustomerChanceService` - 客户机会服务
- `RevisitService` - 回访服务
- `SurveyService` - 调研服务
- `FeedbackService` - 反馈服务
- `ComplaintService` - 投诉服务
- `RepairService` - 维修服务
- `MemberService` - 会员服务
- `CustomerSourceService` - 客户来源渠道服务
- `CustomerUserRuleService` - 客户分配规则服务
- `CustomerProtectRuleService` - 客户保护规则服务

### 外部模块依赖
| 依赖模块 | 用途 |
|---------|------|
| `communion` | 使用小区、村落、房屋等基础数据 |
| `building` | 关联楼盘和房屋信息 |
| `decoration` | 客户签约后创建装饰订单 |
| `personel` | 获取业务员、设计师等人员信息 |
| `approval` | 客户审批流程（客户信息审核、投诉审批） |
| `information` | 客户消息通知、回访提醒 |
| `data.common` | 使用客户来源类型、客户等级等数据字典 |

### 配置参数
客户管理模块的配置存储在系统配置表和数据字典中，包括：
- 客户来源渠道配置（广告、转介绍、网络等）
- 客户等级配置（A/B/C/D级）
- 客户意向配置（强、中、弱）
- 客户保护期限配置
- 客户自动分配规则
- 回访周期配置

---

## 数据模型

### 核心实体 (PO)

#### CustomerOriginPO - 客户来源（线索）
```java
@Entity
@Table(name = "customerorigin", catalog = "customer")
public class CustomerOriginPO {
    private long csid;                   // 客户来源 ID
    private String name;                 // 客户姓名
    private String gender;               // 性别
    private String phone;                // 手机号
    private String purpose;              // 装修目的
    private String intention;            // 意向程度（强/中/弱）
    private String price;                // 预算价格
    private String grade;                // 客户等级（A/B/C/D）
    private String referOrderId;         // 转介绍订单ID
    private String source;               // 来源渠道（广告/转介绍/网络等）
    private String contact;              // 联系方式
    private VillagePO village;           // 小区
    private String houseNumber;          // 房号
    private int buildArea;               // 建筑面积
    private int freeArea;                // 套内面积
    private int totalArea;               // 总面积
    private int innerArea;               // 使用面积
    private UserPO creater;              // 创建人
    private Timestamp createTime;        // 创建时间
    private UserPO belonger;             // 归属人（业务员）
    private DepartmentPO department;     // 所属部门
    private DepartmentPO region;         // 所属区域
    private short status;                // 状态（0:初始, 1:初审, 2:提交, 3:确认, 4:审批, 5:绑定, 6:拒绝）
    private String comment;              // 备注
}
```

#### CustomerProfilePO - 客户档案
```java
@Entity
@Table(name = "customerprofile")
public class CustomerProfilePO {
    private long cpid;                   // 档案 ID
    private CustomerOriginPO origin;     // 关联客户来源
    private String name;                 // 姓名
    private String gender;               // 性别
    private String phone;                // 手机号
    private String idCard;               // 身份证号
    private String address;              // 地址
    private String profession;           // 职业
    private String income;               // 收入水平
    private String family;               // 家庭成员
    private String hobby;                // 爱好
    private Timestamp birthday;          // 生日
    private String wechat;               // 微信号
    private String qq;                   // QQ号
    private String email;                // 邮箱
    private Timestamp createTime;        // 创建时间
    private Timestamp updateTime;        // 更新时间
}
```

#### CustomerChancePO - 客户机会
```java
@Entity
@Table(name = "customerchance")
public class CustomerChancePO {
    private long ccid;                   // 机会 ID
    private CustomerOriginPO customer;   // 关联客户
    private String title;                // 标题
    private String content;              // 内容
    private String stage;                // 阶段（接触、意向、报价、谈判、签约）
    private int probability;             // 成功概率（0-100）
    private long estimatedAmount;        // 预计金额
    private Timestamp expectedTime;      // 预计签约时间
    private UserPO follower;             // 跟进人
    private Timestamp createTime;        // 创建时间
    private short status;                // 状态（进行中/已签约/已流失）
}
```

#### RevisitPO - 客户回访
```java
@Entity
@Table(name = "revisit")
public class RevisitPO {
    private long rid;                    // 回访 ID
    private String orderId;              // 关联订单 ID
    private CustomerPO customer;         // 关联客户
    private String type;                 // 回访类型（施工中/竣工后/质保期）
    private Timestamp revisitTime;       // 回访时间
    private UserPO visitor;              // 回访人
    private String content;              // 回访内容
    private String satisfaction;         // 满意度（非常满意/满意/一般/不满意）
    private String problem;              // 存在问题
    private String solution;             // 解决方案
    private Timestamp createTime;        // 创建时间
}
```

#### SurveyPO - 客户调研
```java
@Entity
@Table(name = "survey")
public class SurveyPO {
    private long sid;                    // 调研 ID
    private String title;                // 调研标题
    private String description;          // 调研说明
    private Timestamp startTime;         // 开始时间
    private Timestamp endTime;           // 结束时间
    private UserPO creater;              // 创建人
    private short status;                // 状态（草稿/进行中/已结束）
}
```

#### SurveyItemPO - 调研问题
```java
@Entity
@Table(name = "survey_item")
public class SurveyItemPO {
    private long siid;                   // 问题 ID
    private SurveyPO survey;             // 关联调研
    private String question;             // 问题内容
    private String type;                 // 问题类型（单选/多选/填空）
    private String options;              // 选项（JSON格式）
    private short required;              // 是否必填
    private short index;                 // 排序
}
```

#### FeedbackPO - 客户反馈
```java
@Entity
@Table(name = "feedback")
public class FeedbackPO {
    private long fid;                    // 反馈 ID
    private String orderId;              // 关联订单 ID
    private CustomerPO customer;         // 关联客户
    private String type;                 // 反馈类型（建议/表扬/投诉）
    private String content;              // 反馈内容
    private String contact;              // 联系方式
    private Timestamp createTime;        // 反馈时间
    private UserPO handler;              // 处理人
    private String handleResult;         // 处理结果
    private Timestamp handleTime;        // 处理时间
    private short status;                // 状态（待处理/处理中/已完成）
}
```

#### ComplaintPO - 客户投诉
```java
@Entity
@Table(name = "complaint")
public class ComplaintPO {
    private long cid;                    // 投诉 ID
    private String orderId;              // 关联订单 ID
    private CustomerPO customer;         // 关联客户
    private String type;                 // 投诉类型（质量/服务/进度/其他）
    private String content;              // 投诉内容
    private String evidence;             // 证据（图片、视频）
    private short urgent;                // 紧急程度（1-5级）
    private Timestamp createTime;        // 投诉时间
    private DepartmentPO responseDept;   // 责任部门
    private UserPO handler;              // 处理人
    private String handleResult;         // 处理结果
    private Timestamp handleTime;        // 处理时间
    private short satisfaction;          // 客户满意度（1-5星）
    private short status;                // 状态（待分配/处理中/已完成/已关闭）
}
```

#### RepairPO - 维修服务
```java
@Entity
@Table(name = "repair")
public class RepairPO {
    private long rid;                    // 维修 ID
    private String orderId;              // 关联订单 ID
    private CustomerPO customer;         // 关联客户
    private String type;                 // 维修类型（保修/收费维修）
    private String problem;              // 问题描述
    private String position;             // 位置（客厅/卧室等）
    private Timestamp applyTime;         // 申请时间
    private Timestamp appointTime;       // 预约时间
    private UserPO repairer;             // 维修人员
    private Timestamp finishTime;        // 完成时间
    private String repairContent;        // 维修内容
    private long cost;                   // 费用
    private String remark;               // 备注
    private short status;                // 状态（待分配/已预约/维修中/已完成）
}
```

#### MemberPO - 会员管理
```java
@Entity
@Table(name = "member")
public class MemberPO {
    private long mid;                    // 会员 ID
    private CustomerPO customer;         // 关联客户
    private String memberNo;             // 会员号
    private String level;                // 会员等级（普通/银卡/金卡/钻石）
    private int points;                  // 积分
    private Timestamp joinTime;          // 加入时间
    private Timestamp expireTime;        // 到期时间
    private short status;                // 状态（正常/冻结/过期）
}
```

#### CustomerSourcePO - 客户来源渠道
```java
@Entity
@Table(name = "customersource")
public class CustomerSourcePO {
    private long csid;                   // 来源 ID
    private String name;                 // 来源名称（电视广告/报纸/微信/转介绍等）
    private String category;             // 类别（线上/线下）
    private long cost;                   // 投入成本
    private int customerCount;           // 客户数量
    private int conversionCount;         // 转化数量
    private double conversionRate;       // 转化率
    private short status;                // 状态（启用/禁用）
}
```

#### CustomerUserRulePO - 客户分配规则
```java
@Entity
@Table(name = "customeruserrule")
public class CustomerUserRulePO {
    private long curid;                  // 规则 ID
    private DepartmentPO department;     // 部门
    private String source;               // 来源渠道
    private String region;               // 区域
    private UserPO user;                 // 分配给用户
    private short priority;              // 优先级
    private short status;                // 状态（启用/禁用）
}
```

#### CustomerProtectRulePO - 客户保护规则
```java
@Entity
@Table(name = "customerprotectrule")
public class CustomerProtectRulePO {
    private long cprid;                  // 规则 ID
    private String condition;            // 保护条件（有效跟进/已签约等）
    private int protectDays;             // 保护天数
    private String description;          // 说明
    private short status;                // 状态（启用/禁用）
}
```

### 数据库关系
```
customerorigin (客户来源) 1:1
├── customerprofile (客户档案)
└── customerchance (客户机会) 1:N

customer (客户) 1:N
├── revisit (回访记录)
├── feedback (客户反馈)
├── complaint (投诉)
├── repair (维修服务)
└── member (会员信息) 1:1

survey (调研) 1:N
└── survey_item (调研问题)

customersource (来源渠道)
customeruserrule (分配规则)
customerprotectrule (保护规则)
```

---

## 测试与质量

### 当前测试状态
- **单元测试**: 无
- **集成测试**: 无
- **测试覆盖率**: 0%

### 建议测试策略
1. **客户分配规则测试**
   - 测试自动分配算法
   - 测试客户保护期逻辑
   - 测试客户释放逻辑

2. **业务流程测试**
   - 客户线索录入 → 分配 → 跟进 → 签约流程
   - 投诉处理流程
   - 维修服务流程

3. **数据一致性测试**
   - 客户来源与客户档案的一致性
   - 客户与订单的关联一致性

---

## 常见问题 (FAQ)

### Q1: 客户来源与客户档案的区别？
**A**:
- `CustomerOriginPO`：客户线索，包含基本信息和来源渠道，是客户的初始状态
- `CustomerProfilePO`：客户档案，包含完整的客户信息，是客户的详细资料
- 一个来源对应一个档案（1:1关系）

### Q2: 客户如何分配？
**A**:
1. 手动分配：管理员手动指定归属人
2. 自动分配：根据 `CustomerUserRulePO` 规则自动分配（按来源、区域、部门等）
3. 客户保护：分配后在保护期内其他人无法抢单

### Q3: 客户状态流转？
**A**:
- `status = 0 (初始)`: 新录入的线索
- `status = 1 (初审)`: 初步审核通过
- `status = 2 (提交)`: 提交给部门主管审批
- `status = 3 (确认)`: 部门主管确认
- `status = 4 (审批)`: 最终审批通过
- `status = 5 (绑定)`: 已绑定到装饰订单
- `status = 6 (拒绝)`: 审批拒绝

### Q4: 如何处理客户投诉？
**A**:
1. 客户提交投诉 (`ComplaintAction.addComplaint`)
2. 系统自动分配给责任部门或手动分配
3. 处理人员跟进处理，记录处理结果
4. 客户确认满意度
5. 投诉关闭

### Q5: 维修服务如何管理？
**A**:
- 保修期内的维修免费（`type = 保修`）
- 保修期外的维修收费（`type = 收费维修`）
- 维修记录关联订单 ID，用于质量追溯

### Q6: 客户积分如何计算？
**A**: 积分规则通常配置在系统配置中，常见规则：
- 签约获得积分
- 转介绍获得积分
- 参与活动获得积分
- 积分可用于兑换礼品或抵扣费用

---

## 相关文件清单

### Action 控制器 (约 40 个)
```
action/
├── CustomerOriginAction.java           - 客户来源管理
├── CustomerOriginFunctionAction.java   - 客户来源功能
├── CustomerOriginRecordAction.java     - 客户来源记录
├── CustomerProfileAction.java          - 客户档案
├── CustomerProfileItemAction.java      - 档案明细
├── CustomerChanceAction.java           - 客户机会
├── CustomerSourceAction.java           - 来源渠道
├── CustomerSourceRecordAction.java     - 来源记录
├── CustomerUserRuleAction.java         - 分配规则
├── CustomerProtectRuleAction.java      - 保护规则
├── RevisitAction.java                  - 回访管理
├── SurveyAction.java                   - 客户调研
├── SurveyItemAction.java               - 调研问题
├── FeedbackAction.java                 - 客户反馈
├── FeedbackRecordAction.java           - 反馈记录
├── FeedbackComplaintAction.java        - 投诉（旧版）
├── ComplaintAction.java                - 投诉管理
├── ComplainPO.java                     - 投诉处理
├── RepairAction.java                   - 维修服务
├── RepairpayAction.java                - 维修费用
├── MemberAction.java                   - 会员管理
├── GroupAction.java                    - 客户分组
├── VustomerAction.java                 - 客户主控制器
├── VustomerNetAction.java              - 客户网络
├── VrecordAction.java                  - 客户记录
└── VscoreAction.java                   - 客户评分
```

### 实体类 (51 个)
```
po/
├── CustomerOriginPO.java               - 客户来源
├── CustomerOriginFunctionPO.java       - 客户来源功能
├── CustomerOriginRecordPO.java         - 客户来源记录
├── CustomerProfilePO.java              - 客户档案
├── CustomerProfileItemPO.java          - 档案明细
├── CustomerProfileOptionPO.java        - 档案选项
├── CustomerChancePO.java               - 客户机会
├── CustomerSourcePO.java               - 来源渠道
├── CustomerSourceRecordPO.java         - 来源记录
├── CustomerUserRulePO.java             - 分配规则
├── CustomerUserRuleItemPO.java         - 分配规则明细
├── CustomerProtectRulePO.java          - 保护规则
├── CustomerCompanyRulePO.java          - 公司规则
├── CustomerConfigRulePO.java           - 配置规则
├── CustomerDeptRulePO.java             - 部门规则
├── CustomerNoticePO.java               - 客户通知
├── RevisitPO.java                      - 回访记录
├── SurveyPO.java                       - 客户调研
├── SurveyItemPO.java                   - 调研问题
├── SurveyOptionPO.java                 - 调研选项
├── FeedbackPO.java                     - 客户反馈
├── FeedbackRecordPO.java               - 反馈记录
├── FeedbackBackVisitPO.java            - 反馈回访
├── FeedbackGuaranteePO.java            - 反馈保修
├── FeedbackDrawingPO.java              - 反馈图片
├── FeedbackComplaintPO.java            - 投诉（旧版）
├── FeedbackComplaintProblemPO.java     - 投诉问题
├── FeedbackComplaintDeptPO.java        - 投诉部门
├── ComplaintPO.java                    - 投诉
├── ComplainPO.java                     - 投诉处理
├── ComplackPO.java                     - 投诉跟踪
├── RepairPO.java                       - 维修服务
├── RepairpayPO.java                    - 维修费用
├── AepairPO.java                       - 维修记录
├── EmemberPO.java                      - 会员
├── GroupPO.java                        - 客户分组
├── DroupPO.java                        - 分组详情
├── VustomerPO.java                     - 客户主表
├── VustomerNetPO.java                  - 客户网络
├── VrecordPO.java                      - 客户记录
├── VscorePO.java                       - 客户评分
├── VscoreRecordPO.java                 - 评分记录
├── CppointPO.java                      - 客户积分
├── CppointRecordPO.java                - 积分记录
├── CppointPaymentPO.java               - 积分支付
├── CirclePO.java                       - 客户圈子
├── CircleDrawingPO.java                - 圈子图片
├── ConsultionPO.java                   - 咨询
├── ConversationPO.java                 - 对话
├── BackgroundPO.java                   - 背景信息
└── DecorationPO.java                   - 关联装饰订单
```

---

## 变更记录 (Changelog)

### 2025-12-01 15:28:48
- 初始化模块文档
- 完成客户管理模块架构分析
- 记录 51 个核心实体、约 40 个 Action 控制器
- 待补充：Service 层详细分析、前端交互流程、客户分配算法详解
