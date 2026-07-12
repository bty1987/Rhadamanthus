# SQL 脚本目录

本目录存放项目开发过程中产生的数据库变更脚本（建表、改表、种子数据、数据迁移等）。
这些脚本均为**手工执行**，无自动迁移框架（如 Flyway/Liquibase），请在部署时按需手动运行。

> 建表脚本（全库 DDL）请见 `dbs/` 目录（由 `script/sync_db_schema.py` 自动生成）。
> 本目录仅存放**增量变更**和**一次性数据脚本**。

---

## 📁 目录结构

| 目录 | 说明 | 文件数 |
|------|------|--------|
| `security/` | 数据库安全加固（脱敏视图、权限、用户、IP 限制） | 6 |
| `customer/` | 客户模块（客户机会、保护规则、银行账户） | 13 |
| `quotation/` | 报价模块（预算分配、工期、名称规则） | 13 |
| `decoration/` | 装修模块（合同、归属、决算、服务） | 9 |
| `construction/` | 施工模块（交接状态、功能权限、画像） | 5 |
| `sales/` | 销售模块（外销单、发货、退款） | 4 |
| `inventory/` | 仓储/外辅（费用字段、辅材关联） | 6 |
| `material/` | 辅材（费用表、导入任务、常量） | 4 |
| `elecsign/` | 电子签（多厂商路由初始化） | 2 |
| `dingtalk/` | 钉钉审批集成 | 2 |
| `information/` | 消息队列 | 2 |
| `village/` | 楼盘模块 | 2 |
| `migrate-constants/` | 常量数据化迁移（data.json → communion.constant） | 5 |
| `misc/` | 零散单文件模块（审批、支付、企业微信、用户偏好、分公司种子） | 6 |
| `reports/` | 非迁移脚本（报表查询、视图、示例数据） | 3 |

---

## ⚠️ 有执行顺序依赖的脚本序列

以下脚本**必须按编号顺序执行**，文件名前缀数字代表执行先后：

### security/ — 数据库安全加固
```
01_masked_views.sql                    → 创建脱敏视图
02_sensitive_table_permissions.sql     → 回收敏感表权限
03_create_users.sql                    → 创建只读用户
04_ip_restriction.sql                  → 绑定 IP 限制
05_fix_communion_permissions.sql       → 修正 communion 权限
database_security_implementation.sql   → 综合加固脚本（4阶段，可独立执行）
```

### customer/ — 客户保护规则 V2.3
```
10_customer_protect_rule_extend_v2.3_20260407.sql  → 扩展表结构
20_customer_protect_rule_add_duty.sql              → 添加岗位ID列
30_customer_protect_rule_add_deposit_type.sql      → 添加定金类型常量
40_customer_protect_rule_config_v2.3_20260407.sql  → 规则种子数据（依赖岗位ID，最后执行）
```

### quotation/ — 报价预算分配功能
```
10_add_quotation_budget_assignment.sql  → 创建 5 张分配表
20_add_quotation_assign_menus.sql       → 菜单种子
30_add_uid_to_quotationassignrequest.sql → 加 uid 列
40_create_quotationassigntalk.sql       → 创建沟通消息表
50_quotationassign_constant_data.sql    → 常量种子
```

### inventory/ — 外辅费用字段
```
10_occessories_add_charge.sql   → 添加 charge 列
20_occessories_add_rcharge.sql  → 添加 rcharge 列（AFTER charge，依赖前者）
```

### material/ — 辅材费用
```
10_aoodscharge.sql                   → 建表
20_aoodsCharge_constants.sql         → 常量种子
30_add_aoodscharge_import_task.sql   → 注册导入任务
```

### elecsign/ — 电子签多厂商
```
10_init_elecsign_systemconfig.sql       → 初始化厂商配置（法大大）
11_add_provider_to_business_tables.sql  → 业务表加 provider 列
```

### dingtalk/ — 钉钉审批
```
10_dingtalk_approval_config.sql        → 建表 + 专用审批种子
20_dingtalk_approval_config_add_type.sql → 加 type 列 + 通用审批种子（增量迁移）
```

### information/ — 消息队列
```
10_create_information_messagequeuing.sql → 建表
20_add_messagequeuing_orderid.sql        → 加 orderId 列
```

### migrate-constants/ — 常量数据化迁移
```
migrate_buildingjson_constants.sql       → 楼盘常量迁移
migrate_datajson_constants_phase2.sql    → 第二阶段（关系类型/标签）
migrate_datajson_constants_phase3.sql    → 第三阶段（服务节点/任务参数）
migrate_datajson_constants_phase4.sql    → 第四阶段（印章/图表/聊天等）
profile_constant.sql                     → 画像共享常量
```

> ⚠️ **phase1 缺失**：phase2/3 内部引用"阶段1已处理 data.common.status"，
> 但 `migrate_datajson_constants_phase1.sql` 不在本目录。如需完整迁移请确认 phase1 是否已在别处执行。

---

## 📊 reports/ — 非迁移脚本

这些脚本**不是数据库变更**，不会修改表结构或业务数据：

| 文件 | 性质 |
|------|------|
| `decoration_full_report.sql` | 装修单综合查询报表（60+ 字段跨库 SELECT，只读） |
| `order_comprehensive_view.sql` | 订单综合信息视图（CREATE VIEW） |
| `insert_messagequeuing_decoration_operations.sql` | 示例/测试数据插入（含假 orderId，非生产数据） |

---

## 🔧 使用说明

1. **确认目标环境**：脚本涉及多个数据库 schema（platform/decoration/quotation/construction/payment/customer/communion/data/information/inventory/hades 等），执行前确认连接的实例和账号权限。

2. **按顺序执行有编号的脚本**：同一目录下带数字前缀（`01_`、`10_`、`20_`…）的脚本存在依赖关系，务必按编号顺序执行。

3. **无编号脚本可独立执行**：未加数字前缀的脚本一般为独立的建表或种子脚本，可单独运行。

4. **幂等性不保证**：大多数 ALTER/INSERT 脚本不可重复执行，请在执行前检查目标表/列是否已存在。

5. **生产环境**：在生产执行前务必先在测试环境验证，并备份相关数据。
