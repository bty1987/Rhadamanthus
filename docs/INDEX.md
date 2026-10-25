# R项目 文档索引

> 按「类型」分类汇总 docs 目录下全部文档，重建于 2026-07-12
> 目录结构：16 类分类目录（`01-` ~ `16-`）+ `mover/` 前端迁移文档集

---

## 一、方案/设计 · `01-方案设计/`

| 文件 | 说明 |
|------|------|
| DESIGN_quotation_budget_assignment_v1.5.md | 报价单预算员自动分配功能设计方案 |
| DESIGN_wallet_withdraw_approval.md | 预付款提现审批流程设计文档 |
| FRONTEND_INTEGRATION_GUIDE.md | 报价单预算员自动分配功能 - 前端集成指南 |
| INTEGRATION_GUIDE.md | 报价单预算员自动分配功能 - 集成指南 |
| decoration_searcher_migration_plan.md | Decoration 模块 displayFunc → Searcher 标准化迁移计划 |
| goodspackage套餐功能按钮修改方案.md | 套餐功能按钮修改方案 |
| 前端模板样式切换调整计划.md | 前端页面模板样式切换调整计划 |
| 方案-报价版本报价项维护功能优化.md | 报价版本/报价项 维护功能优化方案 |
| 电子签扩展方案.md | 电子签扩展支持 e签宝（含多公司路由）方案 |
| 税金折扣独立化调整方案.md | 税金折扣独立化调整方案 |
| 工程节点集团版与分子公司关联方案.md | 数据-工程节点集团主数据+分公司 pcnid 关联归集（无快照全字段自由、创建须先关联集团、存量归纳一次挂接，对齐 noods pnid 先例） |
| 报价项集团共享项与关联字段方案.md | 数据-共享项（共用项/规格）字段扩展+报价项关联 v2.1【已实施未提交/待编译】：规格加 13 列镜像报价项、三定额挂 qfid（cormrice 迁移挂点+company 落 0、cormtime/cormood 新建、集团数据无 company）、quotationItem 加 qfid 预留、规格页 modal 维护三定额+整页保留复用 |

## 二、需求/功能 · `02-需求功能/`

| 文件 | 说明 |
|------|------|
| AOODS_ACCESSORIES_FEE_DEVELOPMENT.md | 辅材与辅料费用开发文档 |
| BUILDING_NAME_RULE_5GROUPS_IMPLEMENTATION.md | 楼盘命名规则管理功能实现报告（五组输入+连接符） |
| CUSTOMER_CHANCE_FRONTEND_UPDATE.md | CustomerChance 前端页面功能更新说明 |
| CUSTOMER_CHANCE_ISCHECK_MODIFICATION.md | CustomerChancePO 添加 isCheck 字段修改总结 |
| CUSTOMER_CITY_RULE_IMPLEMENTATION.md | 客户城区分配规则 - 实施完成报告 |
| CUSTOMER_PROTECT_RULE.md | 客户保护规则业务说明文档 |
| FEATURE_DECORATION_ACTIVITY_ITEM_CONSUME.md | 装修活动物品核销功能 |
| FEATURE_MEMBER_ACTIVITY_RECOMMENDATION.md | 会员活动推荐信息功能文档 |
| OALES_RECORD_使用指南.md | 外销单操作记录功能 - 完整交付文档 |
| OalesItem_使用指南.md | OalesItem 外销单项目明细使用指南 |
| REGEX_IMPLEMENTATION_SUMMARY.md | 楼盘命名规则 - 正则表达式版本实现总结 |
| decorationuser_type_field_summary.md | DecorationUser 表添加 Type 字段修改总结 |
| makeMemberOrder_业务逻辑分析.md | makeMemberOrder 方法业务逻辑分析 |
| normtime_implementation_summary.md | Normtime 模块开发完成总结 |
| quotationassigntalk.md | QuotationAssignTalk 报价分配沟通消息模块 |

## 三、API 文档 · `03-API文档/`

### 3.1 接口文档（散落）

| 文件 | 说明 |
|------|------|
| A20251113Action_SSO_API.md | A20251113Action SSO 单点登录接口说明文档（第三方接入） |
| A20251208Action_API.md | A20251208Action 平台项目对接接口文档 |
| A20260103Action_API.md | A20260103Action 客户线索接入接口文档 |
| A20260324Action_API_DOC.md | A20260324Action 接口说明文档 |
| A20260404Action_API_DOC.md | A20260404Action 供应商/驻店员同步接口文档（syncSupplier/syncInstorer） |
| A20260904Action_API_DOC.md | A20260904Action 库存数据同步接口文档（辅材/仓库/出入库） |
| A20261025Action_API_DOC.md | A20261025Action NERP 预签/签约/款项同步接口文档（凭空预签 syncProsignForNerp + 凭空签约 syncSignContractForNerp + 款项计划 syncDecorationPaymentForNerp；v2.0 原 A20261024Action 预签文档并入） |
| ADD_CUSTOMER_CHANCE_EXCEPTIONS.md | addCustomerChance 异常场景汇总文档 |
| ADD_CUSTOMER_LEAD_EXCEPTIONS.md | addCustomerLead 异常场景汇总文档 |
| API.md | Rhadamanthus ERP API 接口总览文档 |
| API_ADD_CUSTOMER_CHANCE.md | 客户机会创建接口文档 |
| API_MAKE_MEMBER_ORDER.md | makeMemberOrder 接口说明文档 |
| API_MemberAction.md | MemberAction 接口文档 |
| API_OCESSORIES_CHARGE.md | 外辅费用管理接口文档（微信小程序集成） |
| MemberAction-API.md | MemberAction 接口说明文档 |
| UNCHECK_CUSTOMER_CHANCE_API.md | uncheckCustomerChance 接口文档 |

### 3.2 API 规范工程 (Sphinx) · `03-API文档/API/`

| 文件 | 说明 |
|------|------|
| API/index.md | FOP API 定义首页 |
| API/format.md | API 通讯格式说明 |
| API/error.md | API 错误编号大全 |
| API/log.md | API 变更记录 |
| API/check_rule.md | API 参数校验规则通用说明 |
| API/standard.md | 编码规范 (Java 编码规范) |
| API/tools.md | API 工具说明 |
| API/modules/*.md | 各业务模块 API（approval/balance/building/common/construction/customer/data/decoration/dingtalk/finance/information/inventory/market/material/payment/production/quotation/report/right/salary/sales/system/user，共 23 个模块） |

## 四、问题/修复 · `04-问题修复/`

| 文件 | 说明 |
|------|------|
| FRONTEND_MEMORY_LEAK_FIX.md | 前端内存泄漏修复指南 |
| MEMORY_LEAK_DIAGNOSIS.md | Rhadamanthus 内存泄漏诊断报告 |
| QUOTATION_ASSIGN_REQUEST_FIX.md | pageQuotationAssignRequest JSONException 修复 |
| SEARCHER_FIX.md | Searcher 兼容性问题修复指南 |
| SESSION_FIX_DLOGIN.md | Session 一致性问题修复说明 |

## 五、优化/性能 · `05-优化性能/`

| 文件 | 说明 |
|------|------|
| LAYOUT_OPTIMIZATION.md | 表单布局优化总结 |
| PERFORMANCE_OPTIMIZATION.md | 全局变量性能优化指南 |
| Village_查询条件优化_完整参考.md | 楼盘查询条件优化报告 |
| decoration_order_export_optimization.md | 装饰订单快速导出方案（完整版） |
| queryMemberForInfo_优化方案.md | queryMemberForInfo 方法优化方案 |
| quotationPart_incremental_optimization.md | quotationPart.js 逐步微调优化方案 |
| quotationPart_js_optimization_plan.md | quotationPart.js 优化方案 |
| quotation_ab_switching_guide.md | quotationPart.js A/B 切换优化方案 |
| searcher_view_mode_adjustment_summary.md | Searcher 视图切换与 DisplayFunc 兼容调整总结 |

## 六、重构/改造 · `06-重构改造/`

| 文件 | 说明 |
|------|------|
| REFACTOR-constructionSchedule-schedule-field.md | ConstructionSchedule 废弃 schedule 数值，引入独立 sort 字段 |
| data-json数据化迁移方案.md | data.json 常量数据化迁移方案 |
| makeMemberOrder_重构总结.md | makeMemberOrder 方法重构总结 |
| production_refactoring_safety_plan.md | 生产环境代码优化安全保障方案 |
| 密钥管理改造方案.md | Rhadamanthus 密钥管理改造方案（类 Jasypt） |

## 七、总结/报告 · `07-总结报告/`

| 文件 | 说明 |
|------|------|
| APPROVAL_MODULE_ASSESSMENT.md | Approval 审批模块前后台评估报告 |
| MODIFICATION_REPORT.md | 微信手机号集成 Action 层修改完成报告 |
| total总额计算说明.md | 预签单 Total 总额计算说明 |
| 前端功能迁移进度报告_20260519.md | R项目前端功能迁移进度报告 |

## 八、安全/加密 · `08-安全加密/`

| 文件 | 说明 |
|------|------|
| CUSTOMER_PHONE_SECURITY_ASSESSMENT.md | Customer 模块 Phone 字段安全风险评估报告 |
| DATABASE_SECURITY_EXECUTION_GUIDE.md | 数据库安全加固执行指南 |
| DATABASE_SECURITY_SUMMARY.md | 数据库安全加固总结报告 |
| PASSWORD_SECURITY_IMPLEMENTATION.md | 密码安全优化实施完成报告 |
| RDS_SQL_AUDIT_GUIDE.md | RDS SQL 洞察（审计）配置指南 |
| 敏感数据加密方案.md | R项目敏感数据加密方案（调整版） |

## 九、SQL 脚本 · `09-SQL脚本/`

| 文件 | 说明 |
|------|------|
| SQL_COPY_CONSTRUCTIONNODE_DATA.md | 复制 constructionnode 数据 SQL 语句 |
| crond_broker_report_check.md | 经纪人报备保护检查脚本（定时任务） |

> 注：纯 `.sql` 数据脚本（quotationassign_constant_data.sql、北京分公司数据创建SQL.sql）已移至项目根 `sqls/` 目录。

## 十、指南/手册 · `10-指南手册/`

| 文件 | 说明 |
|------|------|
| CentOS6_yum_source_guide.md | CentOS 6.x Yum 源配置指南 |
| FRONTEND_UNCHECK_CUSTOMER_CHANCE_USAGE.md | 前端调用 uncheckCustomerChance 接口使用指南 |
| MESSAGE_QUEUING_GUIDE.md | MessageQueuing 消息队列使用指南 |
| MYSQL_MCP_SERVER_SETUP.md | MySQL MCP 服务器配置指南 |
| OSS_IMAGE_SIMPLIFIED.md | OSS 图片显示简化版使用指南 |
| PAYMENT_VIEWS_GUIDE.md | Payment 数据库视图说明文档 |
| QUERY_CONDITION_GUIDE.md | 查询条件配置指南（condition规则库/Searcher条件区/DAO filters白名单三层） |
| UPLOAD_GUIDE.md | 文件上传功能使用指南 |
| aliyun-sls-integration.md | 阿里云 SLS 日志服务接入配置手册 |

## 十一、构建/部署 · `11-构建部署/`

| 文件 | 说明 |
|------|------|
| BUILD_SCRIPTS_README.md | Rhadamanthus 模块打包脚本使用说明 |
| CHANGELOG_20260429.md | 2026-04-29 变更记录 |
| MODULE_PACKAGING_GUIDE.md | Maven 按模块打包配置指南 |
| Maven编译指南.md | Maven 构建快速开始指南 |
| 本地JAR包使用指南.md | 本地 JAR 包使用指南 |

## 十二、规范/标准 · `12-规范标准/`

| 文件 | 说明 |
|------|------|
| CONSTANTS.md | 系统常量定义文档 |
| MODULE_DEVELOPMENT_STANDARDS.md | Rhadamanthus 模块开发前后台规范说明 |
| NAMING_CONVENTIONS.md | 前端命名规范调整说明 |
| constants.json | 常量 JSON 数据（与 CONSTANTS.md 配套） |

## 十三、集成/同步 · `13-集成同步/`

| 文件 | 说明 |
|------|------|
| API_A20260324_TEST.md | A20260324Action 接口测试文档 |
| SEIYA_DEPARTMENT_SYNC_API.md | 部门同步接口 - 新增功能说明 |
| SEIYA_DUTY_SYNC_API.md | 职位同步接口文档 |
| SEIYA_SYNC_API.md | Seiya 模块同步接口 API 文档 |
| nginx_fastdfs_config.txt | Nginx + FastDFS upstream 配置片段 |
| 企业微信扫码登录跳转控制实现方案.md | 企业微信扫码登录页面跳转控制实现方案 |

## 十四、分析/调研 · `14-分析调研/`

| 文件 | 说明 |
|------|------|
| customerProtectRule-approval-analysis.md | customerChance 保护规则审批流程分析报告 |

## 十五、知识库/工具 · `15-知识库工具/`

（暂无文件；知识库相关元文件 `知识库_使用指南.md`、`Skills_快速使用卡片.md` 留在 docs/ 根目录）

## 十六、杂项 · `16-杂项/`

（暂无文件）

---

## 专题文档集 · `mover/`（前端迁移）

> jQuery/Bootstrap → Vue 3 + TypeScript + Arco Design 前端迁移完整文档集，11 篇文档内部交叉引用，保持独立目录不拆散。

| 文件 | 说明 |
|------|------|
| migration-guide-roadmap.md | 全局迁移路线图 |
| migration-guide-shared.md | 跨模块共享架构迁移指南 |
| migration-guide-api-contract.md | API 契约文档 (P1) |
| migration-guide-components.md | 组件拆分手册 (P0) |
| migration-guide-patterns.md | 模式映射手册：jQuery/Bootstrap → Vue 3/Arco Design |
| migration-guide-testing.md | 测试指南 (P2) |
| migration-decoration.md | 装饰(Decoration)模块迁移文档 |
| migration-payment.md | 付款(Payment)模块迁移文档 |
| migration-quotation.md | 报价(Quotation)模块迁移文档 |
| migration-sales.md | 销售(Sales)模块迁移文档 |
| migration-audit-report.md | 迁移文档审计报告 v2.0 |

---

## 根目录元文件

| 文件 | 说明 |
|------|------|
| INDEX.md | 本索引文件 |
| 知识库_使用指南.md | 知识库集成完成说明 |
| Skills_快速使用卡片.md | Skills 能力插件部署说明 |

---

> 统计：方案 10 | 需求 15 | API 12+Sphinx | 问题 5 | 优化 9 | 重构 5 | 总结 4 | 安全 6 | SQL 2 | 指南 8 | 构建 5 | 规范 4 | 集成 6 | 分析 1 | 知识库 0 | 杂项 0 | mover 11 | 根 3
