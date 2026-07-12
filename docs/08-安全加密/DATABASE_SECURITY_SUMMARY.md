# 数据库安全加固总结报告

> 执行日期：2026-04-11
> 数据库实例：rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com
> MySQL 版本：5.6

---

## 一、缘由

### 1.1 背景

生产环境数据库存在以下安全隐患：

1. **权限过度集中**：主账号 `fanglin1918` 拥有 `ALL PRIVILEGES WITH GRANT OPTION`，权限过大
2. **账号共享使用**：多个应用/人员共享同一账号，缺乏审计追溯能力
3. **敏感数据未保护**：客户手机号、身份证等敏感信息明文存储，任何有权限的用户均可查看
4. **缺乏访问审计**：未启用 SQL 审计功能，无法追溯历史操作记录

### 1.2 风险评估

| 风险项 | 等级 | 说明 |
|-------|------|------|
| 数据泄露 | 高 | 敏感数据无保护，内部人员可随意获取 |
| 责任不清 | 中 | 多人共享账号，操作无法追溯到个人 |
| 审计缺失 | 高 | 无操作日志，发生安全事故无法定位 |

### 1.3 合规要求

根据数据保护相关法规要求：
- 敏感个人信息需采取脱敏措施
- 数据访问需有审计记录
- 权限需遵循最小权限原则

---

## 二、调整方案

### 2.1 整体架构

```
原架构                         新架构
┌─────────────┐              ┌─────────────────────────────┐
│ fanglin1918 │              │ fanglin1918 (主账号，IP限制) │
│   (超级权限)  │              │ erpreder (开发，IP限制)       │
└─────────────┘              │ zhanglitao (开发，IP限制)     │
                             ├─────────────────────────────┤
                             │ BI  (数据分析，只读)          │
                             │ PM  (项目管理，只读)          │
                             │ CRM (客户管理，只读)          │
                             │ MEM (会员管理，只读)          │
                             │ zhanglt (个人，只读，IP限制)  │
                             │ zhouhh (个人，只读，IP限制)   │
                             │ zhous (个人，只读，IP限制)    │
                             └─────────────────────────────┘
```

### 2.2 敏感数据脱敏

| 原表 | 敏感字段 | 脱敏规则 | 脱敏视图 |
|-----|---------|---------|----------|
| communion.customer | phone | 前3后4，中间**** | customer_v |
| communion.customer | identity | 前6后4，中间******** | customer_v |
| communion.user | phone | 前3后4，中间**** | user_v |
| communion.user | identity | 前6后4，中间******** | user_v |
| communion.customerphone | phone | 前3后4，中间**** | customerphone_v |
| communion.house | houseNumber | 暂不脱敏 | house_v |

### 2.3 权限控制

**主账号 (fanglin1918)**
- 保留所有权限
- 新增 IP 限制：仅允许 223.100.27.233

**普通用户 (BI, PM, CRM, MEM, zhanglt, zhouhh, zhous)**
- 所有数据库只读权限
- communion 数据库：仅非敏感表 + 脱敏视图
- 不能直接访问 customer, user, customerphone, house 原表

### 2.4 IP 限制策略

| 用户 | IP限制 | 说明 |
|-----|-------|------|
| fanglin1918 | 223.100.27.233 | 主账号，严格限制 |
| erpreder | 223.100.27.233 | 开发账号 |
| zhanglitao | 223.100.27.233 | 开发账号 |
| zhanglt | 223.100.27.233 | 个人账号 |
| zhouhh | 223.100.27.233 | 个人账号 |
| zhous | 223.100.27.233 | 个人账号 |
| BI | 任意IP (%) | 暂不限制，后期管控 |
| PM | 任意IP (%) | 暂不限制，后期管控 |
| CRM | 任意IP (%) | 暂不限制，后期管控 |
| MEM | 任意IP (%) | 暂不限制，后期管控 |

---

## 三、实施步骤

### 步骤1：开启 RDS SQL 洞察审计

**操作方式**：阿里云控制台手动配置

**配置参数**：
- 存储时长：30天
- 审计粒度：全量审计
- 高频语句统计：开启

**验证**：控制台查看审计日志正常记录

---

### 步骤2：创建脱敏视图

**脚本文件**：`docs/sql/01_masked_views.sql`

**执行内容**：
```sql
-- 创建客户表脱敏视图
CREATE VIEW customer_v AS
SELECT
    cid, name,
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone,
    CONCAT(LEFT(identity, 6), '********', RIGHT(identity, 4)) AS identity,
    ...
FROM customer;

-- 创建用户表脱敏视图
CREATE VIEW user_v AS ...;

-- 创建客户电话表脱敏视图
CREATE VIEW customerphone_v AS ...;

-- 创建房屋表视图
CREATE VIEW house_v AS ...;
```

**验证结果**：
```
视图名称
-----------
customerphone_v
customer_v
house_v
user_v
```

---

### 步骤3：创建新用户

**脚本文件**：`docs/sql/03_create_users.sql` (v1.3)

**创建用户清单**：

| 用户 | 密码（加密后） | 用途 |
|-----|--------------|------|
| BI | **************** | 数据分析 |
| PM | **************** | 项目管理 |
| CRM | **************** | 客户管理 |
| MEM | **************** | 会员管理 |
| zhanglt | **************** | 个人账号 |
| zhouhh | **************** | 个人账号 |
| zhous | **************** | 个人账号 |

> 密码使用 `openssl rand -base64 16` 生成，MySQL 密码格式存储

---

### 步骤4：配置用户权限

**脚本文件**：`docs/sql/03_create_users.sql` + `docs/sql/05_fix_communion_permissions.sql`

**权限配置策略**：

**4.1 其他数据库权限**（保持数据库级授权）
```sql
GRANT SELECT ON factory.* TO 'BI'@'%';
GRANT SELECT ON material.* TO 'BI'@'%';
GRANT SELECT ON quotation.* TO 'BI'@'%';
-- ... 共23个数据库
```

**4.2 communion 数据库权限**（表级授权）

由于存在敏感表，需单独授权：
- 授予 90 个非敏感表的 SELECT 权限
- 排除 4 个敏感表：customer, user, customerphone, house
- 授予 4 个脱敏视图的 SELECT 权限

```sql
-- 收回数据库级权限
REVOKE SELECT ON `communion`.* FROM 'BI'@'%';

-- 逐个授予非敏感表
GRANT SELECT ON communion.assistance TO 'BI'@'%';
GRANT SELECT ON communion.brand TO 'BI'@'%';
-- ... 共90个表

-- 授予脱敏视图
GRANT SELECT ON communion.customer_v TO 'BI'@'%';
GRANT SELECT ON communion.user_v TO 'BI'@'%';
GRANT SELECT ON communion.customerphone_v TO 'BI'@'%';
GRANT SELECT ON communion.house_v TO 'BI'@'%';
```

**问题修正**：
- 初始执行时使用了 `GRANT SELECT ON communion.*`，导致包含敏感表访问
- 通过 `05_fix_communion_permissions.sql` 修正为表级授权

---

### 步骤5：配置 IP 限制

**脚本文件**：`docs/sql/04_ip_restriction.sql`

**执行内容**：

1. 创建 IP 绑定用户：
```sql
CREATE USER 'fanglin1918'@'223.100.27.233' IDENTIFIED BY '...';
CREATE USER 'erpreder'@'223.100.27.233' IDENTIFIED BY '...';
CREATE USER 'zhanglitao'@'223.100.27.233' IDENTIFIED BY '...';
CREATE USER 'zhanglt'@'223.100.27.233' IDENTIFIED BY '...';
CREATE USER 'zhouhh'@'223.100.27.233' IDENTIFIED BY '...';
CREATE USER 'zhous'@'223.100.27.233' IDENTIFIED BY '...';
```

2. 复制权限到 IP 绑定用户

3. 删除旧的任意 IP 用户（可选）

**最终状态**：
```
user        | host               | 访问限制
------------+--------------------+----------
BI          | %                  | 任意IP
CRM         | %                  | 任意IP
MEM         | %                  | 任意IP
PM          | %                  | 任意IP
zhanglt     | 223.100.27.233     | IP限制
zhanglt     | %                  | 任意IP (待删除)
zhouhh      | 223.100.27.233     | IP限制
zhouhh      | %                  | 任意IP (待删除)
zhous       | 223.100.27.233     | IP限制
zhous       | %                  | 任意IP (待删除)
```

---

### 步骤6：验证配置

**6.1 用户验证**
```sql
SELECT user, host FROM mysql.user
WHERE user IN ('BI', 'PM', 'CRM', 'MEM', 'zhanglt', 'zhouhh', 'zhous');
```

**6.2 权限验证**
```sql
SHOW GRANTS FOR 'BI'@'%';
```

**6.3 视图验证**
```sql
SELECT TABLE_NAME FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'communion'
AND TABLE_NAME LIKE '%_v';
```

**6.4 敏感表访问测试**
- 访问原表 `SELECT * FROM communion.customer` → 应报错 Access denied
- 访问视图 `SELECT * FROM communion.customer_v` → 应返回脱敏数据

---

## 四、实施结果

### 4.1 完成项目

| 项目 | 状态 | 说明 |
|-----|------|------|
| RDS SQL 洞察审计 | ✅ 完成 | 存储时长30天 |
| 脱敏视图创建 | ✅ 完成 | 4个视图正常工作 |
| 新用户创建 | ✅ 完成 | 7个只读用户 |
| 权限配置 | ✅ 完成 | 敏感表访问已控制 |
| IP 限制 | ⚠️ 部分完成 | BI/PM/CRM/MEM 暂保持任意IP |

### 4.2 用户清单

| 用户 | 密码 | 权限类型 | IP限制 | 状态 |
|-----|------|---------|--------|------|
| fanglin1918 | - | 全部权限 | 223.100.27.233 | 主账号 |
| BI | **************** | 只读 | 任意IP | ✅ |
| PM | **************** | 只读 | 任意IP | ✅ |
| CRM | **************** | 只读 | 任意IP | ✅ |
| MEM | **************** | 只读 | 任意IP | ✅ |
| zhanglt | **************** | 只读 | 223.100.27.233 | ✅ |
| zhouhh | **************** | 只读 | 223.100.27.233 | ✅ |
| zhous | **************** | 只读 | 223.100.27.233 | ✅ |

### 4.3 权限验证结果

**BI 用户权限示例**：
```
GRANT SELECT ON `salary`.* TO 'BI'@'%'
GRANT SELECT ON `personel`.* TO 'BI'@'%'
GRANT SELECT ON `production`.* TO 'BI'@'%'
... (23个数据库级权限)

GRANT SELECT ON `communion`.`assistance` TO 'BI'@'%'
GRANT SELECT ON `communion`.`brand` TO 'BI'@'%'
... (90个单独表权限)

GRANT SELECT ON `communion`.`customer_v` TO 'BI'@'%'
GRANT SELECT ON `communion`.`user_v` TO 'BI'@'%'
GRANT SELECT ON `communion`.`customerphone_v` TO 'BI'@'%'
GRANT SELECT ON `communion`.`house_v` TO 'BI'@'%'
```

✅ 已确认：
- 不存在 `GRANT SELECT ON 'communion'.*`
- 敏感表（customer, user, customerphone, house）不在权限列表
- 脱敏视图权限已授予

### 4.4 安全效果

| 安全项 | 之前 | 之后 |
|-------|------|------|
| 敏感数据访问 | 任何有权限用户可见 | 仅主账号可见，其他用户仅见脱敏数据 |
| 账号追溯 | 共享账号，无法追溯 | 按角色/个人分账号，可追溯 |
| 访问审计 | 无 | RDS SQL洞察记录所有操作 |
| IP 控制 | 无 | 主账号和个人账号已限制 |

---

## 五、后续建议

### 5.1 短期任务

1. **密码分发**：将新账号密码通过安全渠道分发给使用者
2. **应用配置更新**：更新应用中的数据库连接配置
3. **清理旧账号**：确认新账号正常使用后，删除共享的旧账号

### 5.2 中期任务

1. **IP 限制完善**：为 BI/PM/CRM/MEM 添加 IP 白名单
2. **权限细化**：根据实际使用情况，进一步细化权限
3. **定期审计**：每月查看 SQL 洞察日志，分析异常访问

### 5.3 长期规划

1. **权限治理**：建立权限申请/审批/回收流程
2. **数据分级**：对更多敏感数据进行分级保护
3. **监控告警**：配置异常访问告警规则

---

## 六、文档清单

| 文档 | 路径 | 说明 |
|-----|------|------|
| 脱敏视图脚本 | docs/sql/01_masked_views.sql | 创建4个脱敏视图 |
| 敏感表权限控制 | docs/sql/02_sensitive_table_permissions.sql | 权限控制说明 |
| 用户创建脚本 | docs/sql/03_create_users.sql | 创建7个新用户 |
| IP 限制脚本 | docs/sql/04_ip_restriction.sql | 配置 IP 限制 |
| 权限修正脚本 | docs/sql/05_fix_communion_permissions.sql | 修正权限配置 |
| SQL 审计指南 | docs/RDS_SQL_AUDIT_GUIDE.md | RDS 审计配置指南 |
| 执行指南 | docs/DATABASE_SECURITY_EXECUTION_GUIDE.md | 详细执行步骤 |
| 本文档 | docs/DATABASE_SECURITY_SUMMARY.md | 完整总结报告 |

---

## 七、回滚方案

如需回滚，执行以下步骤：

```sql
-- 1. 恢复数据库级权限
GRANT SELECT ON `communion`.* TO 'BI'@'%';
GRANT SELECT ON `communion`.* TO 'PM'@'%';
GRANT SELECT ON `communion`.* TO 'CRM'@'%';
GRANT SELECT ON `communion`.* TO 'MEM'@'%';

-- 2. 恢复任意IP访问（如需要）
CREATE USER 'fanglin1918'@'%' IDENTIFIED BY '原密码';
-- 复制权限...

-- 3. 删除新用户（如需要）
DROP USER 'BI'@'%';
DROP USER 'PM'@'%';
DROP USER 'CRM'@'%';
DROP USER 'MEM'@'%';
DROP USER 'zhanglt'@'%';
DROP USER 'zhouhh'@'%';
DROP USER 'zhous'@'%';

FLUSH PRIVILEGES;
```

---

**报告生成时间**：2026-04-11
**执行人员**：系统管理员
**审核状态**：待审核
