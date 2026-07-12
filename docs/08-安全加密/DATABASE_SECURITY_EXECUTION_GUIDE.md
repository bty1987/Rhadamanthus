# 数据库安全加固执行指南

> 版本：v1.0
> 创建日期：2026-04-11
> SQL脚本：`sqls/security/database_security_implementation.sql`

---

## 一、执行前准备

### 1.1 检查清单

- [ ] 已申请维护窗口
- [ ] 已通知相关人员
- [ ] 已准备回滚方案
- [ ] 已确认密码策略
- [ ] 已检查服务器IP：`223.100.27.233`

### 1.2 密码准备

请在执行前准备以下密码（建议16位以上）：

| 用户 | 用途 | 密码（执行前填写） |
|-----|------|------------------|
| `app_decoration` | 装饰订单模块 | __________________ |
| `app_construction` | 施工管理模块 | __________________ |
| `app_balance` | 财务结算模块 | __________________ |
| `app_sales` | 主材销售模块 | __________________ |
| `fanglin_admin` | 受限主账户 | __________________ |

---

## 二、执行步骤

### 步骤1：登录生产数据库

```bash
# 使用主账户登录
mysql -h rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com -u fanglin1918 -p
```

### 步骤2：执行SQL脚本

```bash
# 方式A：在MySQL命令行中执行
source D:/GIT/Rhadamanthus/sqls/security/database_security_implementation.sql

# 方式B：使用管道执行
mysql -h rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com -u fanglin1918 -p < D:/GIT/Rhadamanthus/sqls/security/database_security_implementation.sql

# 方式C：分阶段执行（推荐）
```

### 步骤3：分阶段执行（推荐）

#### 阶段一：创建审计基础设施

```sql
-- 1.1 创建安全审计数据库
CREATE DATABASE IF NOT EXISTS security DEFAULT CHARSET utf8mb4;

USE security;

-- 1.2 创建审计表
CREATE TABLE IF NOT EXISTS data_access_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    operate_user VARCHAR(50) NOT NULL,
    operate_table VARCHAR(100),
    operate_type VARCHAR(20),
    operate_ip VARCHAR(50),
    sensitive_fields VARCHAR(500),
    affect_rows INT DEFAULT 0,
    execute_time INT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_time (operate_user, create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**验证**：
```sql
SHOW TABLES FROM security;
-- 应看到: data_access_log
```

---

#### 阶段二：创建应用用户

```sql
-- ⚠️ 执行前请替换密码！
CREATE USER IF NOT EXISTS 'app_decoration'@'%' IDENTIFIED BY '您的密码_Deco@2026!';
CREATE USER IF NOT EXISTS 'app_construction'@'%' IDENTIFIED BY '您的密码_Cons@2026!';
CREATE USER IF NOT EXISTS 'app_balance'@'%' IDENTIFIED BY '您的密码_Bal@2026!';
CREATE USER IF NOT EXISTS 'app_sales'@'%' IDENTIFIED BY '您的密码_Sales@2026!';
CREATE USER IF NOT EXISTS 'fanglin_admin'@'223.100.27.233' IDENTIFIED BY '您的密码_Admin@2026!';

FLUSH PRIVILEGES;
```

**验证**：
```sql
SELECT user, host FROM mysql.user WHERE user LIKE 'app_%' OR user = 'fanglin_admin';
```

---

#### 阶段三：配置权限

```sql
-- 3.1 装饰订单模块权限
GRANT SELECT, INSERT, UPDATE ON decoration.* TO 'app_decoration'@'%';
GRANT SELECT, INSERT, UPDATE ON quotation.* TO 'app_decoration'@'%';
GRANT SELECT, UPDATE ON customer.* TO 'app_decoration'@'%';
GRANT SELECT ON building.* TO 'app_decoration'@'%';
GRANT SELECT ON communion.* TO 'app_decoration'@'%';
GRANT SELECT ON approval.* TO 'app_decoration'@'%';
GRANT SELECT ON platform.* TO 'app_decoration'@'%';

-- 3.2 施工管理模块权限
GRANT SELECT, INSERT, UPDATE ON construction.* TO 'app_construction'@'%';
GRANT SELECT ON decoration.* TO 'app_construction'@'%';
GRANT SELECT, UPDATE ON customer.* TO 'app_construction'@'%';
GRANT SELECT ON building.* TO 'app_construction'@'%';
GRANT SELECT ON quotation.* TO 'app_construction'@'%';
GRANT SELECT ON communion.* TO 'app_construction'@'%';
GRANT SELECT ON approval.* TO 'app_construction'@'%';

-- 3.3 财务结算模块权限
GRANT SELECT, INSERT, UPDATE ON balance.* TO 'app_balance'@'%';
GRANT SELECT, INSERT, UPDATE ON payment.* TO 'app_balance'@'%';
GRANT SELECT ON decoration.* TO 'app_balance'@'%';
GRANT SELECT ON sales.* TO 'app_balance'@'%';
GRANT SELECT ON customer.* TO 'app_balance'@'%';
GRANT SELECT ON salary.* TO 'app_balance'@'%';
GRANT SELECT ON communion.* TO 'app_balance'@'%';

-- 3.4 主材销售模块权限
GRANT SELECT, INSERT, UPDATE ON sales.* TO 'app_sales'@'%';
GRANT SELECT, INSERT, UPDATE ON material.* TO 'app_sales'@'%';
GRANT SELECT, INSERT, UPDATE ON inventory.* TO 'app_sales'@'%';
GRANT SELECT ON customer.* TO 'app_sales'@'%';
GRANT SELECT ON quotation.* TO 'app_sales'@'%';
GRANT SELECT ON communion.* TO 'app_sales'@'%';

-- 3.5 受限主账户权限
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD,
    PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES,
    CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE,
    REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW,
    CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER
ON *.* TO 'fanglin_admin'@'223.100.27.233';

FLUSH PRIVILEGES;
```

**验证**：
```sql
-- 查看各用户权限
SHOW GRANTS FOR 'app_decoration';
SHOW GRANTS FOR 'app_construction';
SHOW GRANTS FOR 'app_balance';
SHOW GRANTS FOR 'app_sales';
SHOW GRANTS FOR 'fanglin_admin';
```

---

#### 阶段四：创建脱敏视图

```sql
USE communion;

-- 4.1 客户表脱敏视图
CREATE VIEW customer_v AS
SELECT cid, no, name, pinyinAB, pinyinAll, gender,
    CASE WHEN phone IS NULL THEN NULL
         WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
         ELSE phone END as phone,
    qq, wechat, email, career, address, relationshipType,
    officer, passport, passhkm,
    CASE WHEN identity IS NULL THEN NULL
         WHEN LENGTH(identity) >= 10 THEN CONCAT(LEFT(identity, 6), '********', RIGHT(identity, 4))
         ELSE identity END as identity,
    company, token, signno, status, photoPath, signPath,
    identityPathF, identityPathB, authurl, type, companyNo,
    companyName, companyAddr, companyPhone, companyBank, companyBankno
FROM customer;

-- 4.2 用户表脱敏视图
CREATE VIEW user_v AS
SELECT uid, userId, oldUserId, type, roleId, deptId, company,
    loginId, password, userName, pinyin, currentName, did, gender,
    CASE WHEN identity IS NULL THEN NULL
         WHEN LENGTH(identity) >= 10 THEN CONCAT(LEFT(identity, 6), '********', RIGHT(identity, 4))
         ELSE identity END as identity,
    CASE WHEN phone IS NULL THEN NULL
         WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
         ELSE phone END as phone,
    userPhoto, identityPathF, identityPathB, status,
    isLogin, extranet, freedom, isUpdate, authStatus, authUrl, signNo, token
FROM user;

-- 4.3 客户电话表脱敏视图
CREATE VIEW customerphone_v AS
SELECT cpid, cid,
    CASE WHEN phone IS NULL THEN NULL
         WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
         ELSE phone END as phone,
    status, defaults
FROM customerphone;

-- 4.4 授予权限
GRANT SELECT ON communion.customer_v TO 'app_decoration';
GRANT SELECT ON communion.user_v TO 'app_decoration';
GRANT SELECT ON communion.customerphone_v TO 'app_decoration';

GRANT SELECT ON communion.customer_v TO 'app_construction';
GRANT SELECT ON communion.user_v TO 'app_construction';
GRANT SELECT ON communion.customerphone_v TO 'app_construction';

GRANT SELECT ON communion.customer_v TO 'app_balance';
GRANT SELECT ON communion.user_v TO 'app_balance';
GRANT SELECT ON communion.customerphone_v TO 'app_balance';

GRANT SELECT ON communion.customer_v TO 'app_sales';
GRANT SELECT ON communion.user_v TO 'app_sales';
GRANT SELECT ON communion.customerphone_v TO 'app_sales';

FLUSH PRIVILEGES;
```

**验证**：
```sql
-- 查看视图
SELECT table_name FROM information_schema.views
WHERE table_schema = 'communion' AND table_name LIKE '%_v';
-- 应看到: customer_v, user_v, customerphone_v

-- 测试脱敏效果
SELECT phone FROM communion.customer_v LIMIT 5;
-- 应看到: 138****1234 格式
```

---

#### 阶段五：权限回收（谨慎执行，新用户稳定后再执行）

```sql
-- ⚠️ 以下操作需要在新用户稳定运行后执行

-- 5.1 回收 GRANT OPTION
REVOKE GRANT OPTION ON *.* FROM 'fanglin1918'@'%';

-- 5.2 回收危险权限
REVOKE DROP, CREATE USER ON *.* FROM 'fanglin1918'@'%';

-- 5.3 验证剩余权限
SHOW GRANTS FOR 'fanglin1918'@'%';
```

---

## 三、应用配置修改

### 3.1 配置文件更新

修改 `conf/jdbc-prod.properties`（或根据实际环境配置文件名）：

```properties
# ============================================
# 生产环境数据库连接配置
# ============================================

# 主数据库连接（装饰订单模块）
main.url=jdbc:mysql://rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com:3306/?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
main.username=app_decoration
main.password=【填写实际密码】
main.driverClassName=com.mysql.jdbc.Driver

# 施工管理模块连接（如需独立数据源）
construction.url=jdbc:mysql://rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com:3306/?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
construction.username=app_construction
construction.password=【填写实际密码】

# 财务结算模块连接
balance.url=jdbc:mysql://rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com:3306/?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
balance.username=app_balance
balance.password=【填写实际密码】

# 主材销售模块连接
sales.url=jdbc:mysql://rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com:3306/?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
sales.username=app_sales
sales.password=【填写实际密码】

# 管理员连接（紧急使用）
admin.url=jdbc:mysql://rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com:3306/?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
admin.username=fanglin_admin
admin.password=【填写实际密码】
```

### 3.2 Spring配置更新

修改 `conf/ApplicationContext.xml`：

```xml
<!-- 原有数据源配置 -->
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource" destroy-method="close">
    <property name="driverClass" value="${main.driverClassName}"/>
    <property name="jdbcUrl" value="${main.url}"/>
    <property name="user" value="${main.username}"/>
    <property name="password" value="${main.password}"/>
    <!-- 其他配置保持不变 -->
</bean>
```

---

## 四、验收测试

### 4.1 数据库连接测试

```bash
# 测试装饰订单模块用户
mysql -h rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com -u app_decoration -p

# 登录后执行
USE decoration;
SHOW TABLES;
SELECT COUNT(*) FROM customer;
-- 应该成功

# 测试无权限操作（应该失败）
DROP TABLE customer;
-- 应该报错: Access denied
```

### 4.2 脱敏视图测试

```sql
-- 使用 app_decoration 用户登录后执行
USE communion;

-- 查询脱敏视图
SELECT cid, name, phone, identity FROM customer_v LIMIT 5;
-- phone 和 identity 应该显示脱敏格式

-- 尝试查询原表（应该有权限但看到明文）
SELECT cid, name, phone, identity FROM customer LIMIT 5;
-- 这是正常的，因为 app_decoration 有 SELECT 权限
-- 脱敏需要在应用层调用视图实现
```

### 4.3 IP限制测试

```bash
# 从指定IP (223.100.27.233) 测试
mysql -h rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com -u fanglin_admin -p
# 应该连接成功

# 从其他IP测试
mysql -h rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com -u fanglin_admin -p
# 应该连接失败
```

---

## 五、回滚方案

### 5.1 删除新创建的用户

```sql
DROP USER IF EXISTS 'app_decoration'@'%';
DROP USER IF EXISTS 'app_construction'@'%';
DROP USER IF EXISTS 'app_balance'@'%';
DROP USER IF EXISTS 'app_sales'@'%';
DROP USER IF EXISTS 'fanglin_admin'@'223.100.27.233';
FLUSH PRIVILEGES;
```

### 5.2 删除脱敏视图

```sql
DROP VIEW IF EXISTS communion.customer_v;
DROP VIEW IF EXISTS communion.user_v;
DROP VIEW IF EXISTS communion.customerphone_v;
```

### 5.3 恢复应用配置

将 `conf/jdbc-prod.properties` 中的用户名改回 `fanglin1918`

---

## 六、验收检查清单

### 数据库层面

- [ ] 新用户创建成功（app_decoration, app_construction, app_balance, app_sales）
- [ ] 受限主账户创建成功（fanglin_admin@223.100.27.233）
- [ ] 各用户权限配置正确
- [ ] 脱敏视图创建成功（customer_v, user_v, customerphone_v）
- [ ] 审计表创建成功（security.data_access_log）

### 应用层面

- [ ] 应用配置文件已更新
- [ ] 应用使用新账户可以正常启动
- [ ] 核心功能测试通过

### 安全层面

- [ ] RDS IP白名单已配置（223.100.27.233）
- [ ] SQL审计已开启
- [ ] 非白名单IP无法访问

---

## 七、注意事项

1. **密码安全**：执行脚本前务必替换所有占位符密码
2. **分阶段执行**：建议按阶段分批执行，每阶段验证后再继续
3. **维护窗口**：建议在业务低峰期执行
4. **备份确认**：执行前确认数据库备份已完成
5. **回滚准备**：准备好回滚脚本，遇问题立即执行
6. **IP限制**：fanglin_admin 只能从指定IP访问，请确认IP正确

---

## 八、联系人

| 角色 | 姓名 | 联系方式 |
|-----|------|---------|
| 执行人 | - | - |
| 审核人 | - | - |
| 批准人 | - | - |

---

**执行记录**

| 阶段 | 执行时间 | 执行人 | 结果 | 备注 |
|-----|---------|-------|------|------|
| 阶段一 |  |  |  |  |
| 阶段二 |  |  |  |  |
| 阶段三 |  |  |  |  |
| 阶段四 |  |  |  |  |
| 阶段五 |  |  |  |  |
