# Customer 通用客户售后管理功能规划

> 目标: review 现有 `customer` 模块中反馈、投诉、维修、回访、调研等售后相关能力, 在尽量不扰动生产运行逻辑的前提下, 给出一套较为完整、通用、可渐进落地的客户售后管理功能方案。

---

## 1. Review 范围

本次重点查看以下现有对象和实现:

| 方向 | 现有对象 | 说明 |
| --- | --- | --- |
| 统一反馈入口 | `Feedback`、`FeedbackRecord`、`FeedbackDrawing` | 客户反馈主单、处理记录、附件 |
| 新版投诉 | `FeedbackComplaint`、`FeedbackComplaintDept`、`FeedbackComplaintProblem` | 投诉信息、责任部门、问题分类 |
| 新版维修 | `FeedbackGuarantee` | 报修/维修登记, 包含来源、客户类型、工种、品牌、维修结果 |
| 新版回访 | `FeedbackBackVisit` | 维修结果、满意度、回访问题、表扬记录 |
| 旧版报修 | `Aepair`、`Repair`、`Repairpay` | 报修主单、维修执行、维修费用 |
| 旧版投诉 | `Complain`、`Complaint`、`Complack` | 投诉主单、投诉内容、跟踪记录 |
| 通用回访 | `Revisit` | 按订单和业务类型记录满意度与回访内容 |
| 调研问卷 | `Survey`、`SurveyItem`、`SurveyOption` | 基于模板的问卷发送、填写、完成 |

核心结论: 现有 customer 售后能力不是空白, 但不是一套统一的通用售后管理平台。它更像两组并行链路叠加: 一组是较新的 `feedback*` 反馈/投诉/维修/回访模型, 一组是较老的 `consultion -> aepair/complain -> repair/complaint` 咨询转售后模型。建议不要直接拆改生产表, 而是在 customer 内新增通用售后壳层, 通过适配现有对象逐步统一。

---

## 2. 现有售后链路复盘

### 2.1 `feedback*` 链路

推荐理解为“新版售后入口链路”。

```text
Feedback 客户反馈入口
    -> FeedbackRecord 处理记录
    -> FeedbackComplaint 投诉信息
        -> FeedbackComplaintDept 责任部门/责任人/问题分类
        -> FeedbackComplaintProblem 问题分类字典
    -> FeedbackGuarantee 维修/质保登记
    -> FeedbackBackVisit 完工后回访/满意度/表扬
    -> FeedbackDrawing 附件图片
```

能力特点:

| 能力 | 当前表现 | 判断 |
| --- | --- | --- |
| 入口 | `feedback` 可记录微信/反馈内容、订单、电话、公司、接收人、处理人、完成人 | 可作为统一入口基础 |
| 状态 | `feedback.status`: 初始、接收、处理、完成 | 状态较轻, 缺少取消、关闭、驳回、重开、升级、挂起 |
| 处理记录 | `feedbackrecord` 可记录处理人、时间、备注 | 可用, 但不是完整时间线/操作日志 |
| 附件 | `feedbackdrawing` 支持图片关联反馈和子对象 | 可用 |
| 投诉 | `feedbackcomplaint` 支持渠道、升级渠道、紧急度、诉求、处理结果 | 字段较完整, 但流程状态不清晰 |
| 责任归因 | `feedbackcomplaintdept` 支持部门、职务、责任人、三级问题分类 | 投诉归因较强 |
| 维修登记 | `feedbackguarantee` 支持渠道、客户类型、部门类型、工种、品牌、监理、维修结果 | 登记字段丰富, 但缺派工、执行、费用、SLA |
| 回访 | `feedbackbackvisit` 支持满意度、是否联系、是否按时上门、是否解决、周期、表扬 | 回访问项细, 适合维修闭环 |

### 2.2 `aepair/repair/repairpay` 链路

推荐理解为“旧版报修执行链路”。

```text
Consultion 咨询单
    -> Aepair 报修主单
        -> Repair 维修执行任务
        -> Repairpay 维修费用
    -> Revisit 回访
```

能力特点:

| 能力 | 当前表现 | 判断 |
| --- | --- | --- |
| 报修主单 | `aepair` 记录订单、创建人、维修人、预计完成时间、费用、满意度、工种状态 | 维修执行能力比 `feedbackguarantee` 更强 |
| 派工 | `receiveAepair` 当前人接单, `deliveAepair` 指派维修人, `tranAepair` 转交 | 有基本派工/转交 |
| 工种进度 | 水/电/瓦/木/油五类状态 | 装修行业强绑定, 通用性弱 |
| 执行任务 | `repair` 可新增多条维修任务, 记录维修人、转交人、状态、内容 | 有任务雏形 |
| 费用 | `repairpay` 支持款项、扣款、成本等费用记录 | 费用能力存在但未与新版反馈维修打通 |
| 关闭 | 报修可维修、完工、关闭 | 有基本闭环 |

### 2.3 `complain/complaint/complack` 链路

推荐理解为“旧版投诉处理链路”。

```text
Consultion 咨询单
    -> Complain 投诉主单
        -> Complaint 投诉内容/责任部门/责任人/品牌
            -> Complack 跟踪记录
    -> Revisit 回访
```

能力特点:

| 能力 | 当前表现 | 判断 |
| --- | --- | --- |
| 投诉主单 | `complain` 记录订单、等级、状态、满意度 | 有主单, 字段较轻 |
| 投诉明细 | `complaint` 记录类型、部门、员工、品牌、内容、状态 | 可拆分多责任对象 |
| 跟踪 | `complack` 记录投诉内容跟踪备注 | 有跟踪能力 |
| 状态 | 初始、处理、完结、关闭 | 比新版 `feedbackcomplaint.results` 更像流程状态 |
| 通用性 | 与咨询单、装修单、品牌/部门关系强 | 生产可用, 跨行业复用有限 |

### 2.4 `revisit/survey` 能力

| 能力 | 当前表现 | 判断 |
| --- | --- | --- |
| `Revisit` | 按订单记录回访类型、业务 ID、满意度、内容 | 轻量可用, 但问题项不结构化 |
| `Survey` | 可从模板生成问卷、推送、填写、完成 | 结构化强, 但和订单绑定明显 |
| `CustomerProfile` | 可由调研沉淀画像 | 可作为客户画像来源, 不应被售后直接覆盖 |

---

## 3. 现有能力完整度评估

| 售后能力 | 完整度 | 现有支撑 | 主要缺口 |
| --- | --- | --- | --- |
| 多渠道受理 | 中 | `feedback.source/type`、`feedbackcomplaint.source`、`feedbackguarantee.source` | 渠道枚举分散, 缺统一来源、入口、外部单号、联系人快照 |
| 统一工单 | 弱 | `feedback` 可作入口 | 投诉、维修、回访、费用分散, 缺统一售后单号和生命周期 |
| 分类体系 | 中 | `feedbackcomplaintproblem`、投诉部门分类 | 投诉分类强, 维修/咨询/建议/表扬分类弱 |
| 派工处理 | 中 | `aepair/repair` 支持接单、指派、转交 | `feedbackguarantee` 缺派工执行; 缺统一协同任务 |
| SLA 时效 | 弱 | `aepair.targetTime` 有预计完成时间 | 缺响应 SLA、处理 SLA、升级 SLA、超时升级 |
| 过程记录 | 中 | `feedbackrecord`、`complack` | 日志分散, 缺标准操作类型、前后状态、附件、客户可见性 |
| 投诉升级 | 中 | `feedbackcomplaint.upgrade/upgradeSource/urgency/results` | 升级不是流程状态, 缺升级审批/法务/补偿闭环 |
| 维修执行 | 中 | `aepair/repair` 有执行任务; `feedbackguarantee` 有登记字段 | 两套维修未打通, 工种强装修, 缺备件、预约、上门签到、完工验收 |
| 费用补偿 | 中 | `repairpay` 支持维修费用 | 缺退款、赔付、优惠补偿、费用审批和与财务联动 |
| 回访满意度 | 中 | `feedbackbackvisit`、`revisit` | 回访结构分散, 缺统一 NPS/CSAT/CES 指标和差评重开 |
| 质保权益 | 弱 | `feedbackguarantee.cutomerType`、装修单保修状态 | 缺保修期限、保修范围、权益校验、过保收费规则 |
| 客户通知 | 中 | 可复用现有消息、钉钉、小程序推送 | 缺售后节点模板、客户订阅、服务进度通知 |
| 报表分析 | 弱 | 可从状态/时间字段统计 | 缺按渠道、责任部门、问题类型、SLA、满意度、复发率聚合 |

结论: 现有 customer 售后能力“生产可用, 但通用平台化不足”。如果要建设较通用的售后管理, 不建议直接替换现有链路, 应新增统一售后壳层, 以 `feedback` 为入口参考, 以 `aepair/repair/repairpay` 补执行和费用, 以 `feedbackcomplaintdept/problem` 补责任归因, 以 `feedbackbackvisit/survey` 补满意度闭环。

---

## 4. 需要关注的实现风险

| 风险点 | 现象 | 建议 |
| --- | --- | --- |
| 售后对象重复 | `feedbackcomplaint` 与 `complain/complaint`, `feedbackguarantee` 与 `aepair/repair` 均覆盖投诉/维修 | 新功能不要继续新增第三套孤立模型, 应建统一售后主单和适配映射 |
| 状态语义不统一 | `feedback.status` 是接收/处理/完成, `aepair.status` 是初始/维修/完工/关闭, `feedbackcomplaint.results` 是处理结果 | 建统一标准状态, 旧表状态通过适配转换 |
| 新版投诉完成逻辑可疑 | `FeedbackComplaintServiceImpl.finishFeedbackComplaint` 中默认完成值和完成校验语义容易冲突 | 正式改代码前先做兼容测试, 不在本方案阶段直接修生产逻辑 |
| 子维修与主报修状态耦合 | `RepairServiceImpl.finishRepair` 完成子维修时会修改 `Aepair` 工种状态和主状态 | 通用维修应区分主单状态、任务状态、工项状态, 避免互相覆盖 |
| 敏感信息 | 电话在多张表中明文或不同长度保存 | 新售后壳层应使用加密/脱敏/索引字段, 旧表只读或适配 |
| 装修行业字段较多 | 工种水电瓦木油、装修年份、监理、品牌等字段较多 | 通用模型用分类/属性扩展, 装修字段作为行业扩展项 |
| SLA 缺失 | 只有部分目标时间和状态时间 | 新模型补响应、预约、到场、完工、关闭、回访等 SLA 节点 |

---

## 5. 通用客户售后业务功能地图

建议将售后管理拆为 10 个业务域:

| 业务域 | 目标 | 核心对象 |
| --- | --- | --- |
| 售后入口 | 统一承接客户问题 | 工单、渠道、联系人、订单/客户引用、附件 |
| 分类分级 | 判断问题类型和优先级 | 服务类型、问题分类、严重等级、影响范围 |
| SLA 与升级 | 控制响应和解决时效 | SLA 规则、超时记录、升级规则、预警任务 |
| 派工协同 | 把问题分给正确的人处理 | 处理任务、协同人、转交、接单、预约 |
| 投诉处理 | 管理客户不满和责任归因 | 投诉单、责任部门、责任人、问题分类、处理方案 |
| 维修服务 | 管理报修、上门、完工 | 维修单、工项、备件、预约、签到、验收 |
| 费用补偿 | 管理售后成本和赔付 | 费用、退款、赔付、优惠补偿、审批 |
| 回访评价 | 形成闭环和满意度 | 回访、满意度、NPS、未解决重开、表扬 |
| 知识与质检 | 降低重复问题 | 知识库、质检抽查、复盘、整改任务 |
| 报表看板 | 经营分析和改进 | SLA、满意度、投诉率、复发率、成本、责任分析 |

---

## 6. 推荐通用对象设计

考虑 customer 生产环境正在运行, 推荐新增通用售后对象, 不直接改现有 `feedback/aepair/complain` 表。旧对象通过引用和适配接入。

### 6.1 售后主单

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `CustomerAfterSales` | `customer_aftersales` | 通用售后主单, 统一承接反馈、投诉、报修、咨询、建议、表扬 |
| `CustomerAfterSalesItem` | `customer_aftersales_item` | 问题明细/工项/投诉明细, 支持一单多问题 |
| `CustomerAfterSalesRecord` | `customer_aftersales_record` | 标准时间线, 记录接收、派工、处理、转交、升级、关闭、回访 |
| `CustomerAfterSalesAttachment` | `customer_aftersales_attachment` | 图片、视频、文件、录音等附件 |
| `CustomerAfterSalesRef` | `customer_aftersales_ref` | 关联旧表 `fid/fcid/fgid/aid/rid/cid/ctid/sid` |

主单建议字段:

| 字段 | 说明 |
| --- | --- |
| `asid` | 售后单 ID |
| `asNo` | 售后单编号 |
| `type` | 类型: 咨询、反馈、投诉、报修、维修、退款、建议、表扬 |
| `source` | 来源: 电话、微信、小程序、门店、客服录入、平台、调研、内部上报 |
| `customerId` | 客户 ID, 可为空 |
| `csid` | CustomerSource ID, 可为空 |
| `orderId` | 订单/装修单号, 可为空 |
| `contactName` | 联系人 |
| `phone` | 加密手机号 |
| `phoneHash` | 手机号脱敏索引 |
| `content` | 问题描述 |
| `priority` | 优先级: 普通、紧急、重大、舆情、法务 |
| `status` | 标准状态 |
| `ownerUid` | 当前负责人 |
| `deptId` | 当前责任部门 |
| `appointmentTime` | 预约时间 |
| `responseDeadline` | 响应截止时间 |
| `finishDeadline` | 完成截止时间 |
| `finishTime` | 完成时间 |
| `closeTime` | 关闭时间 |
| `company` | 公司 |

标准状态建议:

| status | 含义 | 说明 |
| --- | --- | --- |
| `0` | 初始 | 已创建, 未接收 |
| `1` | 已接收 | 客服/售后已接单 |
| `2` | 待派工 | 需要分配责任人或维修人 |
| `3` | 处理中 | 正在处理或维修 |
| `4` | 待客户确认 | 已给方案或已完工, 等客户确认 |
| `5` | 已完成 | 内部处理完成 |
| `6` | 已关闭 | 客户确认或超期关闭 |
| `7` | 已取消 | 重复、误报、客户撤销 |
| `8` | 已挂起 | 等材料、等客户、等第三方 |
| `9` | 已升级 | 投诉升级、舆情、法务或管理层介入 |
| `10` | 已重开 | 回访不满意或问题复发 |

### 6.2 分类、SLA 和升级

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `CustomerAfterSalesCategory` | `customer_aftersales_category` | 通用问题分类, 支持多级 |
| `CustomerAfterSalesSla` | `customer_aftersales_sla` | SLA 规则, 按类型、级别、来源、客户等级配置 |
| `CustomerAfterSalesOvertime` | `customer_aftersales_overtime` | 超时记录, 响应超时、处理超时、回访超时 |
| `CustomerAfterSalesEscalation` | `customer_aftersales_escalation` | 升级记录, 管理层/法务/舆情/消协工商等 |

分类建议:

| 一级 | 二级示例 | 通用适配 |
| --- | --- | --- |
| 服务态度 | 态度差、响应慢、承诺未兑现 | 通用行业 |
| 产品质量 | 质量缺陷、损坏、规格不符 | 零售/制造/装修 |
| 交付问题 | 延期、漏项、返工、未完成 | 装修/项目交付/SaaS 实施 |
| 费用问题 | 收费争议、退款、赔偿 | 通用行业 |
| 维修问题 | 预约、上门、备件、复修 | 本地服务/装修/家电 |
| 系统问题 | 账号、功能、数据、权限 | SaaS/互联网 |
| 表扬建议 | 表扬、建议、功能需求 | 通用行业 |

### 6.3 派工和协同任务

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `CustomerAfterSalesTask` | `customer_aftersales_task` | 售后处理任务, 可派给客服、维修、设计、财务、法务等 |
| `CustomerAfterSalesTaskRecord` | `customer_aftersales_task_record` | 任务处理记录 |
| `CustomerAfterSalesAppointment` | `customer_aftersales_appointment` | 上门/电话/远程预约 |
| `CustomerAfterSalesTransfer` | `customer_aftersales_transfer` | 转交记录 |

任务状态建议:

| status | 含义 |
| --- | --- |
| `0` | 待接单 |
| `1` | 已接单 |
| `2` | 处理中 |
| `3` | 已完成 |
| `4` | 已退回 |
| `5` | 已转交 |
| `6` | 已取消 |

### 6.4 投诉与责任归因

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `CustomerComplaint` | `customer_complaint` | 通用投诉对象, 可由售后主单派生 |
| `CustomerComplaintDuty` | `customer_complaint_duty` | 责任部门、责任人、责任比例、问题分类 |
| `CustomerComplaintSolution` | `customer_complaint_solution` | 处理方案、客户诉求、协商结果 |
| `CustomerComplaintLegal` | `customer_complaint_legal` | 法务、工商、消协、媒体舆情记录 |

这里可复用现有 `feedbackcomplaintdept/problem` 的思想, 但建议从装修强字段里抽象出通用字段: 责任部门、责任人、问题分类、责任等级、责任比例、整改要求、完成时间。

### 6.5 维修与质保

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `CustomerRepair` | `customer_repair` | 通用维修主对象, 可由售后主单派生 |
| `CustomerRepairItem` | `customer_repair_item` | 维修工项, 不再固定水电瓦木油 |
| `CustomerRepairMaterial` | `customer_repair_material` | 备件/材料/耗材 |
| `CustomerRepairVisit` | `customer_repair_visit` | 上门记录、签到、完工、客户签收 |
| `CustomerWarranty` | `customer_warranty` | 质保权益、保修范围、期限、过保规则 |

维修主流程建议:

```text
报修受理
    -> 校验客户/订单/质保权益
    -> 问题分类与优先级
    -> 预约上门/远程处理
    -> 派工到人员或外包商
    -> 到场签到/开始维修
    -> 添加工项、材料、费用
    -> 完工提交图片/说明
    -> 客户确认
    -> 回访满意度
    -> 关闭或重开
```

### 6.6 费用、退款和补偿

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `CustomerAfterSalesCost` | `customer_aftersales_cost` | 售后成本, 人工、材料、外包、物流 |
| `CustomerAfterSalesCompensation` | `customer_aftersales_compensation` | 赔偿、退款、优惠券、积分、补发、重做 |
| `CustomerAfterSalesApproval` | `customer_aftersales_approval` | 费用/赔付审批 |

现有 `repairpay` 可作为维修费用能力来源, 但通用售后还需要覆盖退款、赔偿、优惠补偿、积分补偿和审批。

### 6.7 回访和满意度

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `CustomerAfterSalesVisit` | `customer_aftersales_visit` | 售后回访记录 |
| `CustomerAfterSalesEvaluation` | `customer_aftersales_evaluation` | 客户评价、满意度、NPS、标签 |
| `CustomerAfterSalesReopen` | `customer_aftersales_reopen` | 不满意、未解决、复发后的重开记录 |

指标建议:

| 指标 | 说明 |
| --- | --- |
| `CSAT` | 满意度, 如非常满意/满意/一般/不满意/非常不满意 |
| `NPS` | 推荐意愿, 0-10 分 |
| `CES` | 解决费力度, 衡量处理体验 |
| `firstResponseMinutes` | 首次响应耗时 |
| `resolveHours` | 解决耗时 |
| `reopenRate` | 重开率 |
| `repeatIssueRate` | 重复问题率 |

---

## 7. 与现有对象的衔接策略

### 7.1 不直接替换生产链路

| 原则 | 说明 |
| --- | --- |
| 保留现有入口 | `Feedback/Aepair/Complain` 继续服务当前生产页面和接口 |
| 新增统一壳层 | 新建 `CustomerAfterSales` 等通用对象, 不直接 ALTER 旧表 |
| 适配映射 | 通过 `CustomerAfterSalesRef` 保存旧表主键引用 |
| 状态转换 | 旧状态通过适配层转换为统一状态, 不回写覆盖旧状态 |
| 渐进迁移 | 新入口先进通用售后, 老入口可通过定时任务或操作时同步生成通用售后引用 |

### 7.2 适配层建议

建议新增 `CustomerAfterSalesBridgeService`, 作为统一售后与旧对象之间的适配层。

| 方法 | 说明 |
| --- | --- |
| `createAfterSalesFromFeedback` | 从 `Feedback` 创建通用售后单 |
| `createAfterSalesFromAepair` | 从 `Aepair` 创建通用维修售后单 |
| `createAfterSalesFromComplain` | 从 `Complain` 创建通用投诉售后单 |
| `syncAfterSalesStatusByFeedback` | 按 feedback 状态同步通用状态 |
| `queryAfterSalesRefsByAsid` | 查询通用售后关联的旧对象 |
| `addAfterSalesRecordForLegacy` | 旧链路动作同步写通用时间线 |

### 7.3 旧对象映射建议

| 通用对象 | 可映射旧对象 | 说明 |
| --- | --- | --- |
| `CustomerAfterSales` | `feedback`、`aepair`、`complain` | 统一主单 |
| `CustomerAfterSalesItem` | `feedbackguarantee`、`feedbackcomplaint`、`repair`、`complaint` | 问题/投诉/维修明细 |
| `CustomerAfterSalesRecord` | `feedbackrecord`、`complack`、`revisit` | 时间线/跟踪/回访 |
| `CustomerAfterSalesAttachment` | `feedbackdrawing`、`conversation` | 图片/文件/沟通附件 |
| `CustomerComplaintDuty` | `feedbackcomplaintdept`、`complaint` | 责任归因 |
| `CustomerAfterSalesCost` | `repairpay` | 费用/成本 |
| `CustomerAfterSalesVisit` | `feedbackbackvisit`、`revisit`、`survey` | 回访和评价 |

---

## 8. 推荐第一版 MVP

考虑生产风险, 第一版不建议推翻现有售后。推荐先做“统一查询 + 新入口 + 时间线 + SLA 看板”。

### P0: 售后统一视图和入口

| 功能 | 说明 |
| --- | --- |
| 售后主单 `CustomerAfterSales` | 新增通用主单, 支持反馈、投诉、报修、建议、表扬 |
| 旧表引用 `CustomerAfterSalesRef` | 关联 `fid/fgid/fcid/aid/rid/cid/ctid` |
| 统一列表 `pageCustomerAfterSales` | 同屏查看新旧售后, 展示统一状态和来源 |
| 新增售后 `addCustomerAfterSales` | 新入口写通用主单, 必要时适配生成 `Feedback` |
| 时间线 `CustomerAfterSalesRecord` | 记录接收、处理、派工、转交、完成、关闭 |
| 附件 `CustomerAfterSalesAttachment` | 复用上传能力保存图片/文件 |

### P1: SLA、派工和回访闭环

| 功能 | 说明 |
| --- | --- |
| SLA 规则 | 按类型、优先级、来源、客户等级配置响应/完成时限 |
| 售后任务 | 派工、接单、转交、退回、完成 |
| 回访评价 | 满意度、NPS、未解决重开 |
| 预警任务 | 即将超时、已超时、升级提醒 |
| 客户通知 | 受理、预约、派工、完工、回访节点消息 |

### P2: 投诉、维修、费用专项增强

| 功能 | 说明 |
| --- | --- |
| 投诉责任归因 | 多部门、多责任人、多问题分类、责任比例 |
| 维修工项 | 通用工项、材料、备件、上门、签到、验收 |
| 费用补偿 | 成本、退款、赔偿、优惠补偿、审批 |
| 质保权益 | 保修期、范围、过保收费、客户权益校验 |
| 法务舆情升级 | 工商、消协、媒体、平台投诉专项流程 |

### P3: 质检、知识库和分析

| 功能 | 说明 |
| --- | --- |
| 质检抽查 | 对关闭工单抽查, 记录质检结果 |
| 整改任务 | 对高频问题生成整改, 追踪责任部门 |
| 知识库 | FAQ、处理 SOP、维修方案沉淀 |
| 报表看板 | SLA 达成率、满意度、投诉率、重开率、售后成本、责任部门排行 |
| 客户生命周期联动 | 将售后满意度和风险标签输出给 CustomerProfile/Market 旁路读取 |

---

## 9. 推荐接口清单

P0/P1 建议接口:

| 接口 | 说明 |
| --- | --- |
| `pageCustomerAfterSales` | 分页售后主单 |
| `queryCustomerAfterSalesByAsid` | 查询售后详情 |
| `queryCustomerAfterSalesByOrderId` | 按订单查询售后 |
| `queryCustomerAfterSalesByCustomerId` | 按客户查询售后 |
| `addCustomerAfterSales` | 新增售后主单 |
| `receiveCustomerAfterSales` | 接收售后 |
| `assignCustomerAfterSales` | 派工/分配负责人 |
| `transferCustomerAfterSales` | 转交售后 |
| `handleCustomerAfterSales` | 添加处理记录并进入处理中 |
| `finishCustomerAfterSales` | 完成处理 |
| `closeCustomerAfterSales` | 关闭售后 |
| `cancelCustomerAfterSales` | 取消售后 |
| `reopenCustomerAfterSales` | 重开售后 |
| `addCustomerAfterSalesRecord` | 添加时间线记录 |
| `addCustomerAfterSalesAttachment` | 添加附件 |
| `visitCustomerAfterSales` | 回访评价 |
| `countCustomerAfterSalesForSla` | SLA 看板统计 |
| `countCustomerAfterSalesForCategory` | 问题分类统计 |

方法命名遵守现有规范: `page` 必须分页, `query` 不分页, 状态动作使用 `receive/assign/transfer/handle/finish/close/cancel/reopen`。

---

## 10. 数据安全与权限

| 项 | 建议 |
| --- | --- |
| 手机号 | 新表保存加密值和 hash/脱敏索引, 不新增明文扩散 |
| 订单/客户引用 | 只保存必要 ID, 详情通过现有 Decoration/Customer 查询 |
| 附件 | 区分客户可见/内部可见 |
| 操作权限 | 接收、派工、费用、关闭、重开、删除附件分别控权 |
| 数据隔离 | 所有主单带 `company`, 查询必须带公司或权限范围 |
| 操作审计 | 所有状态变化写 `CustomerAfterSalesRecord` |
| 敏感投诉 | 法务/舆情/重大投诉支持单独权限 |

---

## 11. 开发注意事项

1. 第一阶段不要直接删除或改造 `feedback/aepair/complain/repair` 等生产表。
2. 不在普通查询中同时扫多张大表实时拼装报表; P1 后建议做售后聚合表或定时同步。
3. 新增通用售后对象时, 旧对象同步逻辑必须幂等, 通过 `CustomerAfterSalesRef` 防止重复生成。
4. 状态同步只做映射, 不自动覆盖旧链路状态。
5. `FeedbackComplaintServiceImpl.finishFeedbackComplaint` 等现有可疑逻辑应单独提修复任务, 先补测试和回归场景。
6. 维修工项不要继续固定为水电瓦木油, 应使用通用分类 + 行业扩展字段。
7. 回访不满意或未解决时, 应支持重开售后主单, 而不是只记录一条满意度。
8. 费用、赔付、退款等必须接审批和权限, 不应只作为普通备注字段。
9. API 文档、错误码、前端 api 映射、数据库脚本需要同步。
10. 如果要和 Market 联动, Market 只读取售后结果做营销排除、客户风险和满意度分群, 不直接改售后状态。

---

## 12. 结论

Customer 现有售后已经覆盖反馈、投诉、维修、费用、回访、调研等关键能力, 但能力分散在新旧两套模型中, 状态、分类、责任、SLA 和满意度闭环没有统一。较稳的建设路径是: 保留生产链路, 新增 `CustomerAfterSales` 通用售后壳层和 `CustomerAfterSalesBridgeService` 适配层, 先做统一视图、统一入口、时间线和 SLA, 再逐步增强投诉责任归因、维修执行、费用补偿、质保权益、回访重开和数据分析。这样既能保护当前 customer 生产稳定性, 也能把售后能力推进到更通用的平台化结构。
