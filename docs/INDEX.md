# R项目 文档索引

> 按「类型」分类汇总 docs 目录下全部文档，生成于 2026-04-17

---

## 一、方案/设计 (4)

| 文件 | 说明 |
|------|------|
| DESIGN_wallet_withdraw_approval.md | 预付款提现审批流程设计方案 |
| DESIGN_quotation_budget_assignment_v1.5.md | 报价单预算员自动分配功能设计方案 v2.0 |
| OALES_RECORD_IMPLEMENTATION.md | 外销单操作记录功能实现说明 |
| total总额计算说明.md | 预签单 Total 总额计算逻辑说明 (protationPart.js) |

## 二、需求/功能 (6)

| 文件 | 说明 |
|------|------|
| FEATURE_DECORATION_ACTIVITY_ITEM_CONSUME.md | 装修活动物品核销 (consume) 功能开发 |
| AOODS_ACCESSORIES_FEE_DEVELOPMENT.md | 辅材与辅料费用开发文档 |
| features/CUSTOMER_CHANCE_ISCHECK_MODIFICATION.md | CustomerChancePO 添加 isCheck 字段 |
| features/CUSTOMER_CHANCE_FRONTEND_UPDATE.md | CustomerChance 前端页面功能更新 |
| CUSTOMER_CITY_RULE_DESIGN.md | 客户城市规则设计 |
| CUSTOMER_CITY_RULE_IMPLEMENTATION.md | 客户城市规则实现 |

## 三、API 文档 (35)

### 3.1 接口文档

| 文件 | 说明 |
|------|------|
| API_ADD_CUSTOMER_CHANCE.md | 客户机会创建接口 (addCustomerChance) |
| API_A20260324_TEST.md | A20260324Action seiya 人事同步接口测试 |
| API_MAKE_MEMBER_ORDER.md | 会员下单 API |
| API_MemberAction.md | 会员操作 API |
| API_OCESSORIES_CHARGE.md | 辅材收费 API |
| SEIYA_SYNC_API.md | Seiya 模块同步接口 API 总览 |
| SEIYA_DUTY_SYNC_API.md | 职位同步接口 (syncDuty) |
| SEIYA_DEPARTMENT_SYNC_API.md | 部门同步接口 (syncDepartment) |
| SEIYA_CUSTOMER_LEAD_API.md | Seiya 客户线索接入接口 |
| features/UNCHECK_CUSTOMER_CHANCE_API.md | uncheckCustomerChance 接口 |
| technical/API.md | API 接口总览文档 (v8.3.x) |

### 3.2 API 规范工程 (Sphinx)

| 文件 | 说明 |
|------|------|
| API/index.md | FOP API 定义首页 |
| API/format.md | API 通讯格式说明 |
| API/error.md | API 错误编号大全 |
| API/log.md | API 变更记录 |
| API/check_rule.md | API 参数校验规则通用说明 |
| API/standard.md | 编码规范 (Java 编码规范) |
| API/modules/approval.md | 审批模块 API |
| API/modules/balance.md | 结算模块 API |
| API/modules/building.md | 房产模块 API |
| API/modules/common.md | 通用模块 API (登录等) |
| API/modules/construction.md | 工程模块 API |
| API/modules/customer.md | 客户模块 API |
| API/modules/data.md | 数据模块 API (楼盘等) |
| API/modules/decoration.md | 装修模块 API |
| API/modules/dingtalk.md | 钉钉模块 API |
| API/modules/finance.md | 财务模块 API |
| API/modules/information.md | 信息模块 API |
| API/modules/inventory.md | 仓储模块 API |
| API/modules/market.md | 营销模块 API |
| API/modules/material.md | 主材模块 API |
| API/modules/payment.md | 款项模块 API |
| API/modules/production.md | 生产模块 API |
| API/modules/quotation.md | 报价模块 API |
| API/modules/report.md | 报表模块 API |
| API/modules/right.md | 权限模块 API |
| API/modules/salary.md | 薪资模块 API |
| API/modules/sales.md | 销售模块 API |
| API/modules/system.md | 系统模块 API |
| API/modules/user.md | 人资模块 API |

## 四、问题/修复 (9)

| 文件 | 说明 |
|------|------|
| SESSION_FIX_DLOGIN.md | dlogin 桌面登录 Session 不一致问题修复 |
| ADD_CUSTOMER_CHANCE_EXCEPTIONS.md | 客户机会新增异常处理 |
| ADD_CUSTOMER_LEAD_EXCEPTIONS.md | 客户线索新增异常处理 |
| exception_record_info.txt | Hibernate IllegalArgumentException 异常堆栈 |
| optimization/QUICK_FIX_STATIC_FILES.md | 静态文件请求被拦截问题修复 |
| optimization/TYPEAHEAD_COMPATIBILITY_FIX.md | Typeahead 兼容性冲突问题修复 |
| optimization/SELECT_WIDTH_FIX.md | Select 宽度修复 |
| optimization/SEARCHER_FIX.md | Searcher 兼容性问题修复 (性能补丁导致) |
| optimization/SEARCHER_CONSTANT_FIX.md | Searcher 常量获取失败问题修复 |
| optimization/DOM_STRUCTURE_FIX_SUMMARY.md | 模块配置 DOM 结构修复 (菜单串位问题) |
| QUOTATION_ASSIGN_REQUEST_FIX.md | pageQuotationAssignRequest JSONException 修复 |

## 五、优化/性能 (11)

| 文件 | 说明 |
|------|------|
| queryMemberForInfo_优化方案.md | queryMemberForInfo 方法优化方案 v1.3 |
| Village_查询条件优化报告.md | 楼盘查询条件优化报告 (communion.village) |
| optimization/PERFORMANCE_OPTIMIZATION.md | 全局变量 (api/params/constant) 性能优化 |
| optimization/CONSTANT_OPTIMIZATION_GUIDE.md | 常量加载优化实施指南 |
| optimization/CONSTANT_PERFORMANCE_ANALYSIS.md | constant.js 性能分析与优化方案 |
| optimization/MERGED_CONSTANT_GUIDE.md | 合并版常量优化部署指南 |
| optimization/QUICK_MEMORY_FIX.md | 前端内存泄漏快速修复指南 (3步解决) |
| optimization/ZERO_MODIFICATION_FIX.md | 零修改内存泄漏修复方案 (无需改业务代码) |
| optimization/LAYOUT_OPTIMIZATION.md | 表单布局优化 |
| optimization/OSS_IMAGE_SIMPLIFIED.md | OSS 图片显示简化版使用指南 v3.0 |
| optimization/quotationPart_js_optimization_plan.md | quotationPart.js 优化方案 (5173行大文件) |
| optimization/quotationPart_incremental_optimization.md | quotationPart.js 逐步微调优化方案 v2.0 |

## 六、重构/改造 (4)

| 文件 | 说明 |
|------|------|
| 密钥管理改造方案.md | Rhadamanthus 密钥管理改造方案 (类 Jasypt) |
| makeMemberOrder_重构总结.md | makeMemberOrder 方法重构总结 |
| optimization/production_refactoring_safety_plan.md | 生产环境代码优化安全保障方案 |
| CUSTOMER_CITY_PROPER_RULE_REFACTOR.md | 客户城市规则重构 |

## 七、总结/报告 (8)

| 文件 | 说明 |
|------|------|
| OALES_RECORD_SUMMARY.md | 外销单操作记录功能完整交付文档 |
| normtime_implementation_summary.md | Normtime 模块开发完成总结 |
| makeMemberOrder_业务逻辑分析.md | makeMemberOrder 方法业务逻辑分析 |
| Village_查询条件前端配置总结.md | 楼盘查询条件前端配置总结 |
| optimization/MEMORY_LEAK_DIAGNOSIS.md | 前端内存泄漏诊断报告 |
| analysis/MODIFICATION_REPORT.md | 修改报告 |
| analysis/REGEX_IMPLEMENTATION_SUMMARY.md | 正则实现总结 |
| FINAL_SUMMARY.md | 最终总结 |

## 八、安全/加密 (12)

| 文件 | 说明 |
|------|------|
| 敏感数据加密方案.md | 客户敏感数据加密方案 (影子表迁移) |
| PASSWORD_SECURITY_IMPLEMENTATION.md | 密码安全优化实施 (挑战-响应认证) |
| DATABASE_SECURITY_EXECUTION_GUIDE.md | 数据库安全执行指南 |
| DATABASE_SECURITY_SUMMARY.md | 数据库安全总结 |
| RDS_SQL_AUDIT_GUIDE.md | RDS SQL 审计配置指南 |
| features/CUSTOMER_PHONE_SECURITY_ASSESSMENT.md | Customer 模块 Phone 字段安全风险评估 |
| sql/01_masked_views.sql | 脱敏视图创建脚本 |
| sql/02_sensitive_table_permissions.sql | 敏感表权限控制脚本 |
| sql/03_create_users.sql | 创建只读用户并授权 |
| sql/04_ip_restriction.sql | 用户 IP 限制脚本 |
| sql/05_fix_communion_permissions.sql | 修正 communion 权限配置 |
| sql/database_security_implementation.sql | 数据库安全加固实施脚本 |
| test-password-security.html | 密码安全测试页面 |

## 九、SQL 脚本 (11)

| 文件 | 说明 |
|------|------|
| sql/create_customeraccount.sql | 创建客户银行账户表 |
| sql/migrate_customeraccount.sql | 迁移客户账户数据 |
| sql/alter_customeraccount_contenthash.sql | customeraccount 增加 contentHash 字段 |
| sql/V_merge_decoration_belong.sql | 装修归属表增加 mergeFlag 字段 |
| sql/accessoriescharge.sql | 创建外辅费用表 |
| sql/aoodscharge.sql | 创建辅材费用表 |
| sql/aoodsCharge_constants.sql | 辅材费用常量定义 |
| sql/occessoriesitem_add_aid.sql | 辅材项表添加 aid 字段 |
| sql/add_uid_to_quotationassignrequest.sql | 报价分配请求表增加 uid |
| quotationassign_constant_data.sql | 报价分配常量数据 |
| 北京分公司数据创建SQL.sql | 北京分公司数据创建 |
| SQL_COPY_CONSTRUCTIONNODE_DATA.md | 复制施工节点数据 SQL |

## 十、指南/手册 (10)

| 文件 | 说明 |
|------|------|
| MESSAGE_QUEUING_GUIDE.md | MessageQueuing 消息队列使用指南 |
| PAYMENT_VIEWS_GUIDE.md | Payment 数据库视图说明 |
| MYSQL_MCP_SERVER_SETUP.md | MySQL MCP 服务器配置指南 |
| OalesItem_使用指南.md | 外销单项目明细使用指南 |
| OALES_RECORD_QUICKSTART.md | 外销单操作记录快速开始部署指南 |
| OALES_RECORD_CONSTANT_USAGE.md | 外销单操作记录前端常量使用说明 |
| user-guide/UPLOAD_GUIDE.md | 文件上传功能使用指南 (兼容 OSS) |
| features/FRONTEND_UNCHECK_CUSTOMER_CHANCE_USAGE.md | 前端调用 uncheckCustomerChance 使用指南 |
| Village_查询条件优化_快速参考.md | 楼盘查询条件优化快速参考 |
| optimization/quotation_ab_switching_guide.md | quotationPart.js A/B 切换指南 |

## 十一、构建/部署 (11)

| 文件 | 说明 |
|------|------|
| OALES_RECORD_DEPLOYMENT.md | 外销单操作记录部署清单 |
| build/BUILD_SCRIPTS_README.md | 构建脚本说明 |
| build/MAVEN_QUICK_START.md | Maven 快速开始 |
| build/Maven编译指南.md | Maven 编译指南 |
| build/MODULE_PACKAGING_GUIDE.md | 模块打包指南 |
| build/QUICK_START_MODULE_PACKAGING.md | 模块打包快速开始 |
| build/本地JAR包使用指南.md | 本地 JAR 包使用指南 |
| build/编译结果总结.md | 编译结果总结 |
| build/编译问题解决总结.md | 编译问题解决总结 |
| build/编译状态报告.md | 编译状态报告 |
| build/缺失JAR包分析报告.md | 缺失 JAR 包分析报告 |

## 十二、规范/标准 (3)

| 文件 | 说明 |
|------|------|
| MODULE_DEVELOPMENT_STANDARDS.md | 模块开发前后台规范 |
| NAMING_CONVENTIONS.md | 前端命名规范 |
| CONSTANTS.md | 常量定义文档 |

## 十三、集成/同步 (4)

| 文件 | 说明 |
|------|------|
| INTEGRATION_GUIDE.md | 报价单预算员自动分配功能集成指南 |
| aliyun-sls-integration.md | 阿里云 SLS 日志集成 |
| integration/企业微信扫码登录跳转控制实现方案.md | 企业微信扫码登录 |
| CUSTOMER_PROTECT_RULE.md | 客户保护规则 (跨系统) |

## 十四、分析/调研 (5)

| 文件 | 说明 |
|------|------|
| analysis/BUILDING_NAME_RULE_IMPLEMENTATION.md | 楼盘命名规则实现 |
| analysis/BUILDING_NAME_RULE_5GROUPS_IMPLEMENTATION.md | 楼盘命名规则 (5组) 实现 |
| analysis/customerProtectRule-approval-analysis.md | 客户保护规则审批分析 |
| decoration_order_export_optimization.md | 装修单导出优化分析 |
| decorationuser_type_field_summary.md | 装修用户类型字段汇总 |

## 十五、知识库/工具 (5)

| 文件 | 说明 |
|------|------|
| KNOWLEDGE_BASE.md | 项目知识库核心文件 (AI 对话参考) |
| KNOWLEDGE_BASE_使用指南.md | 知识库使用指南 |
| 知识库_快速参考.md | 知识库快速参考卡片 |
| Skills_使用指南.md | Skills 能力插件系统使用指南 |
| Skills_快速使用卡片.md | Skills 能力快速使用卡片 |

## 十六、杂项 (5)

| 文件 | 说明 |
|------|------|
| constants.json | 常量 JSON 数据 |
| request_infor.txt | HttpExecutor 请求信息日志 |
| IMPLEMENTATION_STATUS.md | 实现状态追踪 |
| IMPLEMENTATION_SUMMARY.md | 实现总结 |
| customerProtectRule-merge-changes.md | 客户保护规则合并变更记录 |

---

> 统计: 方案 4 | 需求 6 | API 35 | 问题 9 | 优化 11 | 重构 4 | 总结 8 | 安全 12 | SQL 11 | 指南 10 | 构建 11 | 规范 3 | 集成 4 | 分析 5 | 知识库 5 | 杂项 5 | **合计 ~143 文件**
