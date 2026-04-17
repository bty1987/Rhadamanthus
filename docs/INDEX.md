# R项目 文档索引

> 自动生成于 2026-04-17，按模块分类汇总 docs 目录下所有文档。

---

## 一、客户模块 (Customer)

| 文档 | 说明 |
|------|------|
| ADD_CUSTOMER_CHANCE_EXCEPTIONS.md | 客户机会新增异常处理 |
| ADD_CUSTOMER_LEAD_EXCEPTIONS.md | 客户线索新增异常处理 |
| API_ADD_CUSTOMER_CHANCE.md | 客户机会 API 接口文档 |
| CUSTOMER_CITY_PROPER_RULE_REFACTOR.md | 客户城市规则重构 |
| CUSTOMER_CITY_RULE_DESIGN.md | 客户城市规则设计 |
| CUSTOMER_CITY_RULE_IMPLEMENTATION.md | 客户城市规则实现 |
| CUSTOMER_PROTECT_RULE.md | 客户保护规则 |
| customer_protect_rule_adjustment.md | 客户保护规则调整 |
| customerProtectRule-merge-changes.md | 客户保护规则合并变更 |
| analysis/customerProtectRule-approval-analysis.md | 客户保护规则审批分析 |
| SEIYA_CUSTOMER_LEAD_API.md | 星涯客户线索同步 API |
| features/CUSTOMER_PHONE_SECURITY_ASSESSMENT.md | 客户电话安全评估 |
| features/CUSTOMER_CHANCE_FRONTEND_UPDATE.md | 客户机会前端更新 |
| features/CUSTOMER_CHANCE_ISCHECK_MODIFICATION.md | 客户机会 isCheck 字段修改 |
| features/FRONTEND_UNCHECK_CUSTOMER_CHANCE_USAGE.md | 前端未勾选客户机会用法 |
| features/UNCHECK_CUSTOMER_CHANCE_API.md | 未勾选客户机会 API |

## 二、会员模块 (Member)

| 文档 | 说明 |
|------|------|
| API_MAKE_MEMBER_ORDER.md | 会员下单 API |
| API_MemberAction.md | 会员操作 API |
| FEATURE_MEMBER_ACTIVITY_RECOMMENDATION.md | 会员活动推荐功能 |
| makeMemberOrder_业务逻辑分析.md | 会员下单业务逻辑分析 |
| makeMemberOrder_重构总结.md | 会员下单重构总结 |
| queryMemberForInfo_优化方案.md | 会员信息查询优化 |

## 三、报价模块 (Quotation)

| 文档 | 说明 |
|------|------|
| DESIGN_quotation_budget_assignment.md | 报价预算分配设计 |
| DESIGN_quotation_budget_assignment_v1.5.md | 报价预算分配设计 v1.5 |
| quotationassign_constant_data.sql | 报价分配常量数据 SQL |
| optimization/quotation_ab_switching_guide.md | 报价 AB 切换指南 |
| optimization/quotationPart_incremental_optimization.md | 报价部分增量优化 |
| optimization/quotationPart_js_optimization_plan.md | 报价部分 JS 优化方案 |

## 四、装修模块 (Decoration)

| 文档 | 说明 |
|------|------|
| FEATURE_DECORATION_ACTIVITY_ITEM_CONSUME.md | 装修活动项消耗功能 |
| decoration_order_export_optimization.md | 装修单导出优化 |
| decorationuser_type_field_summary.md | 装修用户类型字段汇总 |
| sql/V_merge_decoration_belong.sql | 装修归属合并 SQL |
| sql/add_uid_to_quotationassignrequest.sql | 报价分配请求加 uid |

## 五、付款/财务模块 (Payment)

| 文档 | 说明 |
|------|------|
| DESIGN_wallet_withdraw_approval.md | 钱包提现审批设计 |
| AOODS_ACCESSORIES_FEE_DEVELOPMENT.md | 辅材费用开发 |
| API_OCESSORIES_CHARGE.md | 辅材收费 API |
| PAYMENT_VIEWS_GUIDE.md | 付款视图指南 |
| sql/accessoriescharge.sql | 辅材收费 SQL |
| sql/aoodscharge.sql | 辅材收费 SQL |
| sql/aoodsCharge_constants.sql | 辅材收费常量 SQL |
| sql/occessoriesitem_add_aid.sql | 辅材项加 aid |

## 六、销售模块 (Sales)

| 文档 | 说明 |
|------|------|
| total总额计算说明.md | 总额计算说明 |
| goodspackage套餐功能按钮修改方案.md | 套餐功能按钮修改 |

## 七、OALES / 薪资模块

| 文档 | 说明 |
|------|------|
| OALES_RECORD_CONSTANT_USAGE.md | OALES 记录常量使用 |
| OALES_RECORD_DEPLOYMENT.md | OALES 记录部署 |
| OALES_RECORD_IMPLEMENTATION.md | OALES 记录实现 |
| OALES_RECORD_QUICKSTART.md | OALES 记录快速开始 |
| OALES_RECORD_SUMMARY.md | OALES 记录总结 |
| OalesItem_使用指南.md | OALES 项使用指南 |
| normtime_implementation_summary.md | 标准工时实现总结 |

## 八、第三方集成 (Integration)

| 文档 | 说明 |
|------|------|
| SEIYA_SYNC_API.md | 星涯同步 API 总览 |
| SEIYA_DEPARTMENT_SYNC_API.md | 星涯部门同步 API |
| SEIYA_DUTY_SYNC_API.md | 星涯职务同步 API |
| integration/企业微信扫码登录跳转控制实现方案.md | 企业微信扫码登录 |
| SESSION_FIX_DLOGIN.md | DLogin Session 修复 |
| aliyun-sls-integration.md | 阿里云 SLS 日志集成 |

## 九、安全与加密 (Security)

| 文档 | 说明 |
|------|------|
| 敏感数据加密方案.md | 客户敏感数据加密方案 (影子表迁移) |
| 密钥管理改造方案.md | 密钥管理改造方案 |
| DATABASE_SECURITY_EXECUTION_GUIDE.md | 数据库安全执行指南 |
| DATABASE_SECURITY_SUMMARY.md | 数据库安全总结 |
| PASSWORD_SECURITY_IMPLEMENTATION.md | 密码安全实现 |
| RDS_SQL_AUDIT_GUIDE.md | RDS SQL 审计指南 |
| sql/database_security_implementation.sql | 数据库安全实现 SQL |
| sql/01_masked_views.sql | 脱敏视图 SQL |
| sql/02_sensitive_table_permissions.sql | 敏感表权限 SQL |
| sql/03_create_users.sql | 创建数据库用户 SQL |
| sql/04_ip_restriction.sql | IP 限制 SQL |
| sql/05_fix_communion_permissions.sql | 修正 communion 权限 |
| test-password-security.html | 密码安全测试页面 |

## 十、API 规范 (API Standard)

| 文档 | 说明 |
|------|------|
| API/ (目录) | API 规范文档集合 (格式/错误/日志/模块接口) |
| API_A20260324_TEST.md | API 测试记录 2026-03-24 |
| technical/API.md | API 技术文档 |

## 十一、前端/性能优化 (Frontend & Performance)

| 文档 | 说明 |
|------|------|
| FRONTEND_INTEGRATION_GUIDE.md | 前端集成指南 |
| FRONTEND_MEMORY_LEAK_FIX.md | 前端内存泄漏修复 |
| optimization/PERFORMANCE_OPTIMIZATION.md | 性能优化 |
| optimization/MEMORY_LEAK_DIAGNOSIS.md | 内存泄漏诊断 |
| optimization/QUICK_MEMORY_FIX.md | 快速内存修复 |
| optimization/LAYOUT_OPTIMIZATION.md | 布局优化 |
| optimization/DOM_STRUCTURE_FIX_SUMMARY.md | DOM 结构修复 |
| optimization/QUICK_FIX_STATIC_FILES.md | 静态文件快速修复 |
| optimization/SELECT_WIDTH_FIX.md | 下拉框宽度修复 |
| optimization/TYPEAHEAD_COMPATIBILITY_FIX.md | Typeahead 兼容性修复 |
| user-guide/UPLOAD_GUIDE.md | 上传指南 |
| Village_查询条件前端配置总结.md | Village 查询条件前端配置 |
| Village_查询条件优化_快速参考.md | Village 查询条件优化快速参考 |
| Village_查询条件优化报告.md | Village 查询条件优化报告 |

## 十二、常量/代码规范 (Standards)

| 文档 | 说明 |
|------|------|
| CONSTANTS.md | 常量定义文档 |
| constants.json | 常量 JSON 数据 |
| MODULE_DEVELOPMENT_STANDARDS.md | 模块开发规范 |
| NAMING_CONVENTIONS.md | 命名规范 |
| MESSAGE_QUEUING_GUIDE.md | 消息队列使用指南 |
| optimization/CONSTANT_OPTIMIZATION_GUIDE.md | 常量优化指南 |
| optimization/CONSTANT_PERFORMANCE_ANALYSIS.md | 常量性能分析 |
| optimization/MERGED_CONSTANT_GUIDE.md | 合并常量指南 |
| optimization/SEARCHER_CONSTANT_FIX.md | 搜索器常量修复 |
| optimization/SEARCHER_FIX.md | 搜索器修复 |

## 十三、编译/构建 (Build)

| 文档 | 说明 |
|------|------|
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
| MYSQL_MCP_SERVER_SETUP.md | MySQL MCP 服务器配置 |

## 十四、基础设施 (Infrastructure)

| 文档 | 说明 |
|------|------|
| HttpHelper_合并报告.md | HttpHelper 合并报告 |
| HttpHelper迁移指南.md | HttpHelper 迁移指南 |
| OSS_IMAGE_SIMPLIFIED.md | OSS 图片简化方案 |
| optimization/production_refactoring_safety_plan.md | 生产环境重构安全计划 |
| optimization/ZERO_MODIFICATION_FIX.md | 零修改修复 |

## 十五、数据迁移/SQL (Data Migration)

| 文档 | 说明 |
|------|------|
| sql/create_customeraccount.sql | 创建客户账户表 |
| sql/migrate_customeraccount.sql | 迁移客户账户数据 |
| sql/alter_customeraccount_contenthash.sql | 客户账户 contentHash 字段变更 |
| sql/SQL_COPY_CONSTRUCTIONNODE_DATA.md | 施工节点数据复制 SQL |
| 北京分公司数据创建SQL.sql | 北京分公司数据创建 |

## 十六、分析/总结 (Analysis & Summary)

| 文档 | 说明 |
|------|------|
| FINAL_SUMMARY.md | 最终总结 |
| IMPLEMENTATION_STATUS.md | 实现状态 |
| IMPLEMENTATION_SUMMARY.md | 实现总结 |
| analysis/MODIFICATION_REPORT.md | 修改报告 |
| analysis/BUILDING_NAME_RULE_IMPLEMENTATION.md | 楼盘命名规则实现 |
| analysis/BUILDING_NAME_RULE_5GROUPS_IMPLEMENTATION.md | 楼盘命名规则(5组)实现 |
| analysis/REGEX_IMPLEMENTATION_SUMMARY.md | 正则实现总结 |
| exception_record_info.txt | 异常记录信息 |
| request_infor.txt | 请求信息 |

## 十七、知识库/工具 (Knowledge & Tools)

| 文档 | 说明 |
|------|------|
| KNOWLEDGE_BASE.md | 知识库 |
| KNOWLEDGE_BASE_使用指南.md | 知识库使用指南 |
| 知识库_快速参考.md | 知识库快速参考 |
| Skills_使用指南.md | Skills 使用指南 |
| Skills_快速使用卡片.md | Skills 快速使用卡片 |
| INTEGRATION_GUIDE.md | 集成指南 |
