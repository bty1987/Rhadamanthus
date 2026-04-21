-- ============================================
-- 用户IP限制脚本
-- ============================================
-- 功能：将指定用户绑定到 223.100.27.233
-- 版本：v1.1
-- 日期：2026-04-11
-- ============================================

-- IP限制策略：
-- - BI, PM, CRM, MEM: 暂不限制，使用 % (任意IP)
-- - zhanglt, zhouhh, zhous: 限制为 223.100.27.233
-- - fanglin1918, erpreder, zhanglitao: 限制为 223.100.27.233

-- ============================================
-- 步骤1：创建新用户
-- ============================================

-- 1.1 已有用户：创建IP绑定版本
-- ⚠️ fanglin1918 使用生成的新密码
CREATE USER IF NOT EXISTS 'fanglin1918'@'223.100.27.233' IDENTIFIED BY 'eTcw5qUazpylfmpDuDj5Qg==';

-- erpreder 保持原密码
CREATE USER IF NOT EXISTS 'erpreder'@'223.100.27.233' IDENTIFIED BY '*A2ED98C3B55F8B53B26B960997EB69DFB1774D7D';

-- zhanglitao 保持原密码
CREATE USER IF NOT EXISTS 'zhanglitao'@'223.100.27.233' IDENTIFIED BY '*60403FAA4D188B759A622D9727BBE09958A9920B';

-- 1.2 新用户：IP绑定的个人用户
CREATE USER IF NOT EXISTS 'zhanglt'@'223.100.27.233' IDENTIFIED BY '71bEgvNTAwu5CHsTMpqpVQ==';
CREATE USER IF NOT EXISTS 'zhouhh'@'223.100.27.233' IDENTIFIED BY 'rfbGz5BrzYcuoPhxlNWb8g==';
CREATE USER IF NOT EXISTS 'zhous'@'223.100.27.233' IDENTIFIED BY 'BRfrcBWSbxQZXw4NJWHt/g==';

-- 1.3 新用户：暂不IP限制（任意IP访问）
CREATE USER IF NOT EXISTS 'BI'@'%' IDENTIFIED BY 'bS86YCLQiHv3cIzoI7MThQ==';
CREATE USER IF NOT EXISTS 'PM'@'%' IDENTIFIED BY 'joBBT+C/mZorJIG5UE5A9A==';
CREATE USER IF NOT EXISTS 'CRM'@'%' IDENTIFIED BY 'hY+Kv2RjhnykoTm9/zAKsg==';
CREATE USER IF NOT EXISTS 'MEM'@'%' IDENTIFIED BY 'Wb3I4VFcteLJoLizC1nEvg==';

FLUSH PRIVILEGES;

-- 验证用户创建
SELECT user, host, CASE WHEN host = '%' THEN '任意IP' WHEN host = '223.100.27.233' THEN 'IP限制' ELSE host END as '访问限制'
FROM mysql.user
WHERE user IN ('fanglin1918', 'erpreder', 'zhanglitao', 'BI', 'PM', 'CRM', 'MEM', 'zhanglt', 'zhouhh', 'zhous')
ORDER BY user, host;

-- ============================================
-- 步骤2：复制权限到IP绑定用户
-- ============================================

-- 2.1 fanglin1918 权限复制
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS,
    REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES,
    LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT,
    CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER,
    EVENT, TRIGGER
ON *.* TO 'fanglin1918'@'223.100.27.233' WITH GRANT OPTION;

-- 2.2 erpreder 权限复制
GRANT PROCESS, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `store`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `sales`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `decoration`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `data`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `customer`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `construction`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `communion`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `building`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `balance`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `approval`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `factory`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `information`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `inventory`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `salary`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `report`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `quotetion`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `quotation`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `production`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `platform`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `payment`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `material`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `market`.* TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`proc` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`help_category` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`func` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`help_keyword` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`general_log` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone_name` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`event` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone_transition` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`slow_log` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`help_relation` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone_transition_type` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone_leap_second` TO 'erpreder'@'223.100.27.233';
GRANT SELECT ON `mysql`.`help_topic` TO 'erpreder'@'223.100.27.233';

-- 2.3 zhanglitao 权限复制
GRANT PROCESS, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `tempbase`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `information`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `hades`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `factory`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `decoration`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `data`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `customer`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `construction`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `communion`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `building`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `balance`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `inventory`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `log`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `market`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `store`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `sales`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `salary`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `report`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `quotetion`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `quotation`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `production`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `platform`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `payment`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `material`.* TO 'zhanglitao'@'223.100.27.233';
GRANT ALL PRIVILEGES ON `approval`.* TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`func` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`slow_log` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`help_category` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`help_relation` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`proc` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone_transition` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone_name` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone_leap_second` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`event` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`help_keyword` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`help_topic` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`time_zone_transition_type` TO 'zhanglitao'@'223.100.27.233';
GRANT SELECT ON `mysql`.`general_log` TO 'zhanglitao'@'223.100.27.233';

FLUSH PRIVILEGES;

-- ============================================
-- 步骤3：删除旧用户（谨慎执行！）
-- ============================================
-- ⚠️ 警告：执行前请确认：
--   1. IP绑定用户已创建成功
--   2. 权限已正确复制
--   3. 从指定IP测试连接成功
--   4. 应用配置已更新

-- 取消下面注释以执行删除
/*
-- 删除旧的任意IP访问用户
DROP USER IF EXISTS 'fanglin1918'@'%';
DROP USER IF EXISTS 'erpreder'@'%';
DROP USER IF EXISTS 'zhanglitao'@'%';
DROP USER IF EXISTS 'zhanglt'@'%';
DROP USER IF EXISTS 'zhouhh'@'%';
DROP USER IF EXISTS 'zhous'@'%';

FLUSH PRIVILEGES;
*/

-- ============================================
-- 步骤4：验证
-- ============================================

-- 查看所有用户
SELECT user, host,
    CASE
        WHEN host = '%' THEN '任意IP'
        WHEN host = '223.100.27.233' THEN 'IP限制'
        ELSE host
    END as '访问限制'
FROM mysql.user
WHERE user IN ('fanglin1918', 'erpreder', 'zhanglitao', 'BI', 'PM', 'CRM', 'MEM', 'zhanglt', 'zhouhh', 'zhous')
ORDER BY
    CASE
        WHEN host = '%' THEN 1
        WHEN host = '223.100.27.233' THEN 2
        ELSE 3
    END,
    user;

-- ============================================
-- 回滚脚本（如需恢复原状）
-- ============================================

/*
-- 恢复旧的任意IP访问用户
CREATE USER IF NOT EXISTS 'fanglin1918'@'%' IDENTIFIED BY 'eTcw5qUazpylfmpDuDj5Qg==';
CREATE USER IF NOT EXISTS 'erpreder'@'%' IDENTIFIED BY PASSWORD '*A2ED98C3B55F8B53B26B960997EB69DFB1774D7D';
CREATE USER IF NOT EXISTS 'zhanglitao'@'%' IDENTIFIED BY PASSWORD '*60403FAA4D188B759A622D9727BBE09958A9920B';
CREATE USER IF NOT EXISTS 'zhanglt'@'%' IDENTIFIED BY '71bEgvNTAwu5CHsTMpqpVQ==';
CREATE USER IF NOT EXISTS 'zhouhh'@'%' IDENTIFIED BY 'rfbGz5BrzYcuoPhxlNWb8g==';
CREATE USER IF NOT EXISTS 'zhous'@'%' IDENTIFIED BY 'BRfrcBWSbxQZXw4NJWHt/g==';

-- 删除IP绑定用户
DROP USER IF EXISTS 'fanglin1918'@'223.100.27.233';
DROP USER IF EXISTS 'erpreder'@'223.100.27.233';
DROP USER IF EXISTS 'zhanglitao'@'223.100.27.233';
DROP USER IF EXISTS 'zhanglt'@'223.100.27.233';
DROP USER IF EXISTS 'zhouhh'@'223.100.27.233';
DROP USER IF EXISTS 'zhous'@'223.100.27.233';

FLUSH PRIVILEGES;
*/
