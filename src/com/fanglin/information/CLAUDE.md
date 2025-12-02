# information - 信息管理模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **information**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

information 模块负责系统的**信息发布与通知管理**，涵盖公告通知、消息推送、活动管理、奖品管理、工单管理、电话呼叫记录等功能，是系统内部沟通与信息传递的核心模块。

**核心功能**
- 公告通知发布
- 站内消息推送
- 活动管理
- 奖品库存与兑换
- 工单管理
- 电话呼叫记录
- 事件管理
- 计划任务管理
- 虚拟活动/奖品/支付管理

---

## 入口与启动

### 控制器入口
- `NoticeAction` - 公告通知管理
- `MessageAction` - 消息管理
- `ActivityAction` - 活动管理
- `AwardStockAction` - 奖品库存
- `AwardRecordAction` - 奖品兑换记录
- `AwardPurchaseAction` - 奖品采购
- `WorksheetAction` - 工单管理
- `PhoneCallAction` - 电话呼叫
- `EventsAction` - 事件管理
- `PlanAction` - 计划任务
- `VactivityAction` - 虚拟活动
- `VawardAction` - 虚拟奖品
- `VpaymentAction` - 虚拟支付
- `VprizeAction` - 虚拟奖品池
- `VticketAction` - 虚拟票券

### 前端页面
- `WebContent/views/information/notice.html` - 公告列表（缺失，需在其他目录）
- `WebContent/views/information/message.html` - 消息中心
- `WebContent/views/information/activity.html` - 活动管理

---

## 对外接口

### 公告通知
```java
// 分页查询公告
GET/POST /pageNotice.do
Request: Paging + Filters + authentication
Response: { data: [...], total, pages }

// 分页查询已读公告（按类型）
GET/POST /pageNoticeForSeenByType.do
Request: Paging + Filters + notice + authentication
Response: { data: [...] }

// 根据ID查询公告
GET/POST /queryNoticeByNid.do
Request: { nid }
Response: { notice: {...} }

// 查询公告发布的部门
GET/POST /queryNoticeDepartment.do
Request: { nid }
Response: { noticeDepartments: [...] }

// 新增公告
POST /addNotice.do
Request: {
  theme: String,       // 主题
  type: short,         // 类型（通知/活动）
  priority: short,     // 优先级（普通/重要/紧急）
  startTime: String,   // 开始时间
  endTime: String,     // 结束时间
  publishTime: String, // 发布时间
  isPublic: short,     // 是否公开（公开/部门公开）
  exPublic: short,     // 过期是否公开
  contents: String,    // 内容
  filePath: String,    // 附件路径
  fileName: String     // 附件名称
}
Response: success

// 更新公告
POST /updateNotice.do
Request: { nid, ... }
Response: success

// 更新公告发布部门
POST /updateNoticeDepartment.do
Request: { nid, dids: [...] }
Response: success

// 删除公告
POST /deleteNotice.do
Request: { nid }
Response: success
```

### 消息管理
```java
// 分页查询消息
GET/POST /pageMessage.do
Request: Paging + Filters + userId
Response: { messages: [...] }

// 发送消息
POST /addMessage.do
Request: {
  receiver: UserPO,    // 接收人
  title: String,       // 标题
  content: String,     // 内容
  type: short          // 类型
}
Response: success

// 标记已读
POST /markMessageAsRead.do
Request: { mid }
Response: success
```

### 活动管理
```java
// 分页查询活动
GET/POST /pageActivity.do
Request: Paging + Filters
Response: { activities: [...] }

// 新增活动
POST /addActivity.do
Request: {
  name: String,        // 活动名称
  startTime: String,   // 开始时间
  endTime: String,     // 结束时间
  description: String, // 活动描述
  items: [...]         // 活动项目
}
Response: success

// 更新活动
POST /updateActivity.do
Request: { aid, ... }
Response: success
```

### 奖品管理
```java
// 分页查询奖品库存
GET/POST /pageAwardStock.do
Request: Paging + Filters
Response: { stocks: [...] }

// 新增奖品库存
POST /addAwardStock.do
Request: {
  name: String,        // 奖品名称
  type: short,         // 奖品类型
  stock: int,          // 库存数量
  value: long          // 价值
}
Response: success

// 更新库存
POST /updateAwardStock.do
Request: { asid, stock }
Response: success
```

### 奖品兑换
```java
// 分页查询兑换记录
GET/POST /pageAwardRecord.do
Request: Paging + Filters
Response: { records: [...] }

// 兑换奖品
POST /exchangeAward.do
Request: {
  user: UserPO,        // 兑换人
  award: AwardStockPO, // 奖品
  quantity: int        // 数量
}
Response: success
```

### 工单管理
```java
// 分页查询工单
GET/POST /pageWorksheet.do
Request: Paging + Filters
Response: { worksheets: [...] }

// 新增工单
POST /addWorksheet.do
Request: {
  type: short,         // 工单类型
  title: String,       // 标题
  content: String,     // 内容
  assignee: UserPO     // 处理人
}
Response: success

// 处理工单
POST /handleWorksheet.do
Request: { wsid, result }
Response: success
```

### 电话呼叫
```java
// 分页查询呼叫记录
GET/POST /pagePhoneCall.do
Request: Paging + Filters
Response: { calls: [...] }

// 新增呼叫记录
POST /addPhoneCall.do
Request: {
  caller: UserPO,      // 呼叫人
  callee: String,      // 被叫号码
  duration: int,       // 通话时长
  type: short          // 呼叫类型
}
Response: success
```

---

## 关键依赖与配置

### 核心依赖
- `com.fanglin.personel` - 用户信息
- `com.fanglin.system` - 部门信息
- `com.fanglin.wechat` - 微信消息推送

### 导航配置
- `ds/information.json` - 信息管理菜单配置
  - 公告通知
  - 消息中心
  - 活动管理
  - 奖品管理
  - 工单管理

---

## 数据模型

### 核心实体（PO）

#### NoticePO - 公告通知
```java
@Entity
@Table(name = "notice", catalog = "information")
- nid: long                     // 公告ID
- creater: UserPO               // 创建人
- theme: String                 // 主题
- type: short                   // 类型
  - 1: 通知
  - 2: 活动
- priority: short               // 优先级
  - 0: 普通
  - 1: 重要
  - 2: 紧急
- startTime: String             // 开始时间
- endTime: String               // 结束时间
- publishTime: String           // 发布时间
- isPublic: short               // 是否公开
  - 0: 全部公开
  - 1: 部门公开
- exPublic: short               // 过期是否公开
  - 0: 公开
  - 1: 隐藏
- contents: String              // 内容（富文本）
- depts: String                 // 部门列表（逗号分隔）
- filePath: String              // 附件路径
- fileName: String              // 附件名称
- company: int                  // 公司
```

#### NoticeDepartmentPO - 公告部门关联
```java
@Entity
- ndid: long                    // 关联ID
- notice: NoticePO              // 公告
- department: DepartmentPO      // 部门
```

#### MessagePO - 消息
```java
@Entity
- mid: long                     // 消息ID
- sender: UserPO                // 发送人
- receiver: UserPO              // 接收人
- title: String                 // 标题
- content: String               // 内容
- type: short                   // 类型
- isRead: boolean               // 是否已读
- sendTime: Timestamp           // 发送时间
- readTime: Timestamp           // 阅读时间
```

#### ActivityPO - 活动
```java
@Entity
- aid: long                     // 活动ID
- name: String                  // 活动名称
- startTime: String             // 开始时间
- endTime: String               // 结束时间
- description: String           // 活动描述
- status: short                 // 状态
- createTime: Timestamp         // 创建时间
```

#### ActivityItemPO - 活动项目
```java
@Entity
- aiid: long                    // 项目ID
- activity: ActivityPO          // 活动
- name: String                  // 项目名称
- description: String           // 项目描述
- sort: int                     // 排序
```

#### AwardStockPO - 奖品库存
```java
@Entity
- asid: long                    // 库存ID
- name: String                  // 奖品名称
- type: short                   // 奖品类型
- stock: int                    // 库存数量
- value: long                   // 价值（积分/金额）
- image: String                 // 图片
- status: short                 // 状态
```

#### AwardRecordPO - 奖品兑换记录
```java
@Entity
- arid: long                    // 记录ID
- user: UserPO                  // 兑换人
- award: AwardStockPO           // 奖品
- quantity: int                 // 数量
- totalValue: long              // 总价值
- exchangeTime: Timestamp       // 兑换时间
- status: short                 // 状态
```

#### AwardPurchasePO - 奖品采购
```java
@Entity
- apid: long                    // 采购ID
- award: AwardStockPO           // 奖品
- quantity: int                 // 采购数量
- unitPrice: long               // 单价
- totalPrice: long              // 总价
- purchaseTime: Timestamp       // 采购时间
- purchaser: UserPO             // 采购人
```

#### WorksheetPO - 工单
```java
@Entity
- wsid: long                    // 工单ID
- type: short                   // 工单类型
- title: String                 // 标题
- content: String               // 内容
- creater: UserPO               // 创建人
- assignee: UserPO              // 处理人
- createTime: Timestamp         // 创建时间
- finishTime: Timestamp         // 完成时间
- status: short                 // 状态（待处理/处理中/已完成）
- result: String                // 处理结果
```

#### PhoneCallPO - 电话呼叫记录
```java
@Entity
- pcid: long                    // 记录ID
- caller: UserPO                // 呼叫人
- callee: String                // 被叫号码
- startTime: Timestamp          // 开始时间
- endTime: Timestamp            // 结束时间
- duration: int                 // 通话时长（秒）
- type: short                   // 呼叫类型（呼出/呼入）
- status: short                 // 状态（接通/未接通）
```

#### EventsPO - 事件
```java
@Entity
- eid: long                     // 事件ID
- title: String                 // 标题
- content: String               // 内容
- type: short                   // 事件类型
- relatedId: long               // 关联业务ID
- createTime: Timestamp         // 创建时间
- handler: UserPO               // 处理人
```

#### PlanPO - 计划任务
```java
@Entity
- pid: long                     // 计划ID
- name: String                  // 计划名称
- type: short                   // 计划类型
- cron: String                  // 定时表达式
- status: short                 // 状态（启用/停用）
- lastRunTime: Timestamp        // 上次执行时间
```

### 值对象（VO）
- `NoticeVO` - 公告视图对象
- `MessageVO` - 消息视图
- `ActivityVO` - 活动视图
- `AwardStockVO` - 奖品库存视图
- `AwardRecordVO` - 兑换记录视图
- `WorksheetVO` - 工单视图
- `PhoneCallVO` - 呼叫记录视图

---

## 公告优先级与类型

### 优先级
- **普通（0）**: 常规通知
- **重要（1）**: 重要事项，需要关注
- **紧急（2）**: 紧急通知，需立即处理

### 类型
- **通知（1）**: 一般性通知公告
- **活动（2）**: 活动信息发布

### 公开范围
- **全部公开（0）**: 所有员工可见
- **部门公开（1）**: 指定部门可见

---

## 测试与质量

### 当前测试覆盖
- 未发现独立的测试文件
- 依赖手工测试

### 建议增强
1. 为消息推送逻辑添加单元测试
2. 测试公告发布范围的准确性
3. 验证奖品兑换的库存扣减
4. 测试工单流转流程

---

## 常见问题 (FAQ)

**Q: 如何发布公告？**
A:
1. 填写公告主题、内容
2. 选择类型与优先级
3. 设置发布时间与有效期
4. 选择公开范围（全部/部门）
5. 可上传附件
6. 发布后指定部门可见

**Q: 公告过期后如何处理？**
A: 根据 `exPublic` 设置：
- 0: 过期后仍然公开可见
- 1: 过期后自动隐藏

**Q: 消息与公告的区别是什么？**
A:
- **公告**: 面向多人/部门的广播式通知
- **消息**: 点对点的站内信

**Q: 奖品如何兑换？**
A:
1. 用户查看奖品库存
2. 选择奖品与数量
3. 提交兑换申请
4. 系统扣减库存
5. 管理员发放奖品

**Q: 工单处理流程是什么？**
A:
1. 用户创建工单
2. 指定处理人
3. 处理人接收并处理
4. 填写处理结果
5. 完成工单

**Q: 电话呼叫记录有什么用？**
A:
- 记录客户沟通历史
- 统计员工通话数据
- 跟踪回访记录
- 分析沟通效果

---

## 相关文件清单

### 核心代码
```
src/com/fanglin/information/
├── action/
│   ├── NoticeAction.java                 - 公告通知管理 ★
│   ├── MessageAction.java                - 消息管理
│   ├── ActivityAction.java               - 活动管理
│   ├── AwardStockAction.java             - 奖品库存
│   ├── AwardRecordAction.java            - 兑换记录
│   ├── AwardPurchaseAction.java          - 奖品采购
│   ├── WorksheetAction.java              - 工单管理
│   ├── PhoneCallAction.java              - 电话呼叫
│   ├── EventsAction.java                 - 事件管理
│   ├── PlanAction.java                   - 计划任务
│   ├── VactivityAction.java              - 虚拟活动
│   ├── VawardAction.java                 - 虚拟奖品
│   ├── VpaymentAction.java               - 虚拟支付
│   ├── VprizeAction.java                 - 虚拟奖品池
│   └── VticketAction.java                - 虚拟票券
├── service/
│   ├── NoticeService.java                - 公告服务
│   ├── MessageService.java               - 消息服务
│   ├── ActivityService.java              - 活动服务
│   ├── AwardStockService.java            - 奖品库存服务
│   ├── WorksheetService.java             - 工单服务
│   └── PhoneCallService.java             - 呼叫记录服务
├── dao/
│   ├── NoticeDao.java                    - 公告DAO
│   ├── NoticeDepartmentDao.java          - 公告部门DAO
│   ├── MessageDao.java                   - 消息DAO
│   ├── ActivityDao.java                  - 活动DAO
│   ├── AwardStockDao.java                - 奖品库存DAO
│   └── WorksheetDao.java                 - 工单DAO
├── po/
│   ├── NoticePO.java                     - 公告实体 ★
│   ├── NoticeDepartmentPO.java           - 公告部门实体
│   ├── MessagePO.java                    - 消息实体
│   ├── ActivityPO.java                   - 活动实体
│   ├── ActivityItemPO.java               - 活动项目实体
│   ├── AwardStockPO.java                 - 奖品库存实体
│   ├── AwardRecordPO.java                - 兑换记录实体
│   ├── AwardPurchasePO.java              - 奖品采购实体
│   ├── WorksheetPO.java                  - 工单实体
│   ├── PhoneCallPO.java                  - 呼叫记录实体
│   ├── EventsPO.java                     - 事件实体
│   └── PlanPO.java                       - 计划任务实体
└── vo/
    ├── NoticeVO.java                     - 公告VO
    ├── MessageVO.java                    - 消息VO
    ├── ActivityVO.java                   - 活动VO
    ├── AwardStockVO.java                 - 奖品库存VO
    └── WorksheetVO.java                  - 工单VO
```

**★ 标注的是最常用的核心功能**

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化信息管理模块 AI 上下文文档
- 记录公告通知、消息推送、活动管理等功能
- 补充奖品管理与工单管理说明
- 添加公告优先级与类型说明
- 添加常见问题解答
