-- ============================================
-- 数据库安全加固实施脚本
-- ============================================
-- 版本：v1.0
-- 创建日期：2026-04-11
-- 适用环境：生产环境 (rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com)
--
-- 执行说明：
-- 1. 本脚本分为四个阶段，按顺序执行
-- 2. 执行前请务必备份数据库
-- 3. 替换脚本中的 '请替换为实际密码' 为真实密码
-- 4. 每个阶段执行后请验证结果
-- ============================================

-- ============================================
-- 阶段一：创建审计基础设施
-- ============================================

-- 1.1 创建安全审计数据库
CREATE DATABASE IF NOT EXISTS security DEFAULT CHARSET utf8mb4;

USE security;

-- 1.2 创建数据访问审计表
CREATE TABLE IF NOT EXISTS data_access_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
    operate_user VARCHAR(50) NOT NULL COMMENT '操作用户',
    operate_table VARCHAR(100) COMMENT '操作表名',
    operate_type VARCHAR(20) COMMENT '操作类型:SELECT/INSERT/UPDATE/DELETE',
    operate_ip VARCHAR(50) COMMENT '操作IP',
    sensitive_fields VARCHAR(500) COMMENT '涉及的敏感字段',
    affect_rows INT DEFAULT 0 COMMENT '影响行数',
    execute_time INT COMMENT '执行耗时(ms)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    INDEX idx_user_time (operate_user, create_time),
    INDEX idx_table_time (operate_table, create_time),
    INDEX idx_type_time (operate_type, create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据访问审计日志';

-- 1.3 创建敏感数据访问记录表
CREATE TABLE IF NOT EXISTS sensitive_data_access (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    access_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(50),
    access_type VARCHAR(20) COMMENT 'VIEW/EXPORT/MODIFY',
    ip_address VARCHAR(50),
    result VARCHAR(20) COMMENT 'SUCCESS/BLOCKED/MASKED'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='敏感数据访问记录';

-- ============================================
-- 阶段二：创建应用专用用户
-- ============================================

-- 2.1 创建装饰订单模块用户
-- 注意：请替换以下密码为实际强密码（16位以上，包含大小写、数字、特殊字符）
CREATE USER IF NOT EXISTS 'app_decoration'@'%' IDENTIFIED BY '请替换为实际密码_Deco@2026!';

-- 2.2 创建施工管理模块用户
CREATE USER IF NOT EXISTS 'app_construction'@'%' IDENTIFIED BY '请替换为实际密码_Cons@2026!';

-- 2.3 创建财务结算模块用户
CREATE USER IF NOT EXISTS 'app_balance'@'%' IDENTIFIED BY '请替换为实际密码_Bal@2026!';

-- 2.4 创建主材销售模块用户
CREATE USER IF NOT EXISTS 'app_sales'@'%' IDENTIFIED BY '请替换为实际密码_Sales@2026!';

-- 2.5 创建报表查询用户（erpreder已存在，后续升级权限）
-- CREATE USER IF NOT EXISTS 'app_report'@'%' IDENTIFIED BY '请替换为实际密码';

-- 2.6 创建受限主账户（IP绑定到指定IP）
-- 注意：此用户只能从 223.100.27.233 访问
CREATE USER IF NOT EXISTS 'fanglin_admin'@'223.100.27.233' IDENTIFIED BY '请替换为实际密码_Admin@2026!';

-- 刷新权限
FLUSH PRIVILEGES;

-- 验证用户创建
SELECT user, host FROM mysql.user WHERE user LIKE 'app_%' OR user = 'fanglin_admin';

-- ============================================
-- 阶段三：配置用户权限
-- ============================================

-- 3.1 装饰订单模块权限 (app_decoration)
-- ============================================
-- 核心业务库：可读写
GRANT SELECT, INSERT, UPDATE ON decoration.* TO 'app_decoration'@'%';
GRANT SELECT, INSERT, UPDATE ON quotation.* TO 'app_decoration'@'%';
-- 客户信息：只可查询和更新，不可新增和删除
GRANT SELECT, UPDATE ON customer.* TO 'app_decoration'@'%';
GRANT SELECT ON building.* TO 'app_decoration'@'%';

-- 只读权限：关联库
GRANT SELECT ON communion.* TO 'app_decoration'@'%';
GRANT SELECT ON approval.* TO 'app_decoration'@'%';
GRANT SELECT ON platform.* TO 'app_decoration'@'%';

-- 3.2 施工管理模块权限 (app_construction)
-- ============================================
GRANT SELECT, INSERT, UPDATE ON construction.* TO 'app_construction'@'%';
GRANT SELECT ON decoration.* TO 'app_construction'@'%';
GRANT SELECT, UPDATE ON customer.* TO 'app_construction'@'%';
GRANT SELECT ON building.* TO 'app_construction'@'%';
GRANT SELECT ON quotation.* TO 'app_construction'@'%';
GRANT SELECT ON communion.* TO 'app_construction'@'%';
GRANT SELECT ON approval.* TO 'app_construction'@'%';

-- 3.3 财务结算模块权限 (app_balance)
-- ============================================
GRANT SELECT, INSERT, UPDATE ON balance.* TO 'app_balance'@'%';
GRANT SELECT, INSERT, UPDATE ON payment.* TO 'app_balance'@'%';
GRANT SELECT ON decoration.* TO 'app_balance'@'%';
GRANT SELECT ON sales.* TO 'app_balance'@'%';
GRANT SELECT ON customer.* TO 'app_balance'@'%';
GRANT SELECT ON salary.* TO 'app_balance'@'%';
GRANT SELECT ON communion.* TO 'app_balance'@'%';

-- 3.4 主材销售模块权限 (app_sales)
-- ============================================
GRANT SELECT, INSERT, UPDATE ON sales.* TO 'app_sales'@'%';
GRANT SELECT, INSERT, UPDATE ON material.* TO 'app_sales'@'%';
GRANT SELECT, INSERT, UPDATE ON inventory.* TO 'app_sales'@'%';
GRANT SELECT ON customer.* TO 'app_sales'@'%';
GRANT SELECT ON quotation.* TO 'app_sales'@'%';
GRANT SELECT ON communion.* TO 'app_sales'@'%';

-- 3.5 报表查询用户权限升级 (erpreder)
-- ============================================
-- erpreder 现有权限保持，新增审计日志写入权限
GRANT SELECT, INSERT ON security.data_access_log TO 'erpreder'@'%';
GRANT SELECT, INSERT ON security.sensitive_data_access TO 'erpreder'@'%';

-- 3.6 受限主账户权限 (fanglin_admin)
-- ============================================
-- 管理员权限（不含GRANT OPTION，防止继续授权）
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD,
    PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES,
    CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE,
    REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW,
    CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER
ON *.* TO 'fanglin_admin'@'223.100.27.233';

-- 授予审计日志权限
GRANT SELECT, INSERT, UPDATE ON security.* TO 'fanglin_admin'@'223.100.27.233';

FLUSH PRIVILEGES;

-- ============================================
-- 阶段四：创建敏感数据脱敏视图
-- ============================================

USE communion;

-- 4.1 客户表脱敏视图
-- ============================================
DROP VIEW IF EXISTS customer_v;
CREATE VIEW customer_v AS
SELECT
    cid, no, name, pinyinAB, pinyinAll, gender,
    CASE
        WHEN phone IS NULL THEN NULL
        WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
        ELSE phone
    END as phone,
    qq, wechat, email, career, address, relationshipType,
    officer, passport, passhkm,
    CASE
        WHEN identity IS NULL THEN NULL
        WHEN LENGTH(identity) >= 10 THEN CONCAT(LEFT(identity, 6), '********', RIGHT(identity, 4))
        ELSE identity
    END as identity,
    company, token, signno, status, photoPath, signPath,
    identityPathF, identityPathB, authurl, type, companyNo,
    companyName, companyAddr, companyPhone, companyBank, companyBankno
FROM customer;

-- 4.2 用户表脱敏视图
-- ============================================
DROP VIEW IF EXISTS user_v;
CREATE VIEW user_v AS
SELECT
    uid, userId, oldUserId, type, roleId, deptId, company,
    loginId, password, userName, pinyin, currentName, did,
    gender,
    CASE
        WHEN identity IS NULL THEN NULL
        WHEN LENGTH(identity) >= 10 THEN CONCAT(LEFT(identity, 6), '********', RIGHT(identity, 4))
        ELSE identity
    END as identity,
    CASE
        WHEN phone IS NULL THEN NULL
        WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
        ELSE phone
    END as phone,
    userPhoto, identityPathF, identityPathB, status,
    isLogin, extranet, freedom, isUpdate, authStatus,
    authUrl, signNo, token
FROM user;

-- 4.3 客户电话表脱敏视图
-- ============================================
DROP VIEW IF EXISTS customerphone_v;
CREATE VIEW customerphone_v AS
SELECT
    cpid, cid,
    CASE
        WHEN phone IS NULL THEN NULL
        WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
        ELSE phone
    END as phone,
    status, defaults
FROM customerphone;

-- 4.4 授予普通用户视图访问权限
-- ============================================
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

-- ============================================
-- 阶段五：权限回收（谨慎执行）
-- ============================================
-- 警告：以下操作需要在新用户稳定运行后才能执行
-- 请勿在生产环境直接执行，需分步验证

-- 5.1 回收 fanglin1918 的 GRANT OPTION
-- ============================================
-- REVOKE GRANT OPTION ON *.* FROM 'fanglin1918'@'%';

-- 5.2 回收 fanglin1918 的危险权限
-- ============================================
-- REVOKE DROP, CREATE USER ON *.* FROM 'fanglin1918'@'%';

-- 5.3 验证 fanglin1918 剩余权限
-- ============================================
-- SHOW GRANTS FOR 'fanglin1918'@'%';

-- ============================================
-- 验证脚本
-- ============================================

-- 验证1：检查新用户是否创建成功
SELECT
    user as '用户名',
    host as '访问主机',
    authentication_string as '密码状态(空表示未设置)'
FROM mysql.user
WHERE user LIKE 'app_%' OR user = 'fanglin_admin'
ORDER BY user;

-- 验证2：检查各用户权限概要
SELECT
    grantee as '用户',
    table_schema as '数据库',
    COUNT(*) as '权限数量'
FROM information_schema.schema_privileges
WHERE grantee LIKE '%app_%' OR grantee LIKE '%fanglin_admin%'
GROUP BY grantee, table_schema
ORDER BY grantee, table_schema;

-- 验证3：检查视图是否创建成功
SELECT
    table_name as '视图名称',
    table_type as '类型'
FROM information_schema.views
WHERE table_schema = 'communion'
  AND table_name LIKE '%_v'
ORDER BY table_name;

-- 验证4：检查审计表是否创建成功
SELECT
    table_name as '表名',
    table_comment as '说明'
FROM information_schema.tables
WHERE table_schema = 'security'
ORDER BY table_name;

-- ============================================
-- 回滚脚本（如需回滚请执行）
-- ============================================

/*
-- 回滚1：删除新创建的用户
DROP USER IF EXISTS 'app_decoration'@'%';
DROP USER IF EXISTS 'app_construction'@'%';
DROP USER IF EXISTS 'app_balance'@'%';
DROP USER IF EXISTS 'app_sales'@'%';
DROP USER IF EXISTS 'fanglin_admin'@'223.100.27.233';

-- 回滚2：删除脱敏视图
DROP VIEW IF EXISTS communion.customer_v;
DROP VIEW IF EXISTS communion.user_v;
DROP VIEW IF EXISTS communion.customerphone_v;

-- 回滚3：删除审计数据库（谨慎操作）
DROP DATABASE IF EXISTS security;

FLUSH PRIVILEGES;
*/

-- ============================================
-- 脚本执行完成
-- ============================================
-- 请检查上述验证结果，确保所有步骤执行成功
-- 如有错误，请记录并根据实际情况调整
