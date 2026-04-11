-- ============================================
-- 用户创建脚本
-- ============================================
-- 功能：创建只读用户，授予除敏感表外所有表的查询权限
-- 版本：v1.2
-- 日期：2026-04-11
-- ============================================

-- 用户清单：
-- BI     - 商业智能/报表
-- PM     - 项目管理
-- CRM    - 客户关系管理
-- MEM    - 会员管理
-- zhanglt - 个人用户
-- zhouhh  - 个人用户
-- zhous   - 个人用户

-- 权限说明：
-- 1. 所有用户只读权限 (SELECT)
-- 2. 敏感表只能访问脱敏视图，不能访问原表

-- ============================================
-- 步骤1：创建用户
-- ============================================

-- 注意：MySQL 5.6 不支持 CREATE USER IF NOT EXISTS
-- 如用户已存在，请先执行 DROP USER '用户名'@'%';

CREATE USER 'BI'@'%' IDENTIFIED BY 'bS86YCLQiHv3cIzoI7MThQ==';
CREATE USER 'PM'@'%' IDENTIFIED BY 'joBBT+C/mZorJIG5UE5A9A==';
CREATE USER 'CRM'@'%' IDENTIFIED BY 'hY+Kv2RjhnykoTm9/zAKsg==';
CREATE USER 'MEM'@'%' IDENTIFIED BY 'Wb3I4VFcteLJoLizC1nEvg==';
CREATE USER 'zhanglt'@'%' IDENTIFIED BY '71bEgvNTAwu5CHsTMpqpVQ==';
CREATE USER 'zhouhh'@'%' IDENTIFIED BY 'rfbGz5BrzYcuoPhxlNWb8g==';
CREATE USER 'zhous'@'%' IDENTIFIED BY 'BRfrcBWSbxQZXw4NJWHt/g==';

FLUSH PRIVILEGES;

-- 验证用户创建
SELECT user, host FROM mysql.user WHERE user IN ('BI', 'PM', 'CRM', 'MEM', 'zhanglt', 'zhouhh', 'zhous');

-- ============================================
-- 步骤2：授予权限
-- ============================================

-- 说明：先授予整个库的权限，然后收回敏感表权限
-- 敏感表：customer, user, customerphone, house (只能访问脱敏视图)

-- ============================================
-- 2.1 BI 用户权限
-- ============================================

-- 业务库权限
GRANT SELECT ON decoration.* TO 'BI'@'%';
GRANT SELECT ON quotation.* TO 'BI'@'%';
GRANT SELECT ON construction.* TO 'BI'@'%';
GRANT SELECT ON balance.* TO 'BI'@'%';
GRANT SELECT ON sales.* TO 'BI'@'%';
GRANT SELECT ON material.* TO 'BI'@'%';
GRANT SELECT ON building.* TO 'BI'@'%';
GRANT SELECT ON payment.* TO 'BI'@'%';
GRANT SELECT ON production.* TO 'BI'@'%';
GRANT SELECT ON personel.* TO 'BI'@'%';
GRANT SELECT ON salary.* TO 'BI'@'%';
GRANT SELECT ON information.* TO 'BI'@'%';
GRANT SELECT ON inventory.* TO 'BI'@'%';
GRANT SELECT ON factory.* TO 'BI'@'%';
GRANT SELECT ON market.* TO 'BI'@'%';
GRANT SELECT ON store.* TO 'BI'@'%';
GRANT SELECT ON report.* TO 'BI'@'%';
GRANT SELECT ON quotetion.* TO 'BI'@'%';
GRANT SELECT ON approval.* TO 'BI'@'%';
GRANT SELECT ON platform.* TO 'BI'@'%';
GRANT SELECT ON data.* TO 'BI'@'%';

-- communion 库：先授予全部，再收回敏感表
GRANT SELECT ON communion.* TO 'BI'@'%';
REVOKE SELECT ON communion.`customer` FROM 'BI'@'%';
REVOKE SELECT ON communion.`user` FROM 'BI'@'%';
REVOKE SELECT ON communion.`customerphone` FROM 'BI'@'%';
REVOKE SELECT ON communion.`house` FROM 'BI'@'%';

-- ============================================
-- 2.2 PM 用户权限
-- ============================================

GRANT SELECT ON decoration.* TO 'PM'@'%';
GRANT SELECT ON quotation.* TO 'PM'@'%';
GRANT SELECT ON construction.* TO 'PM'@'%';
GRANT SELECT ON balance.* TO 'PM'@'%';
GRANT SELECT ON sales.* TO 'PM'@'%';
GRANT SELECT ON material.* TO 'PM'@'%';
GRANT SELECT ON building.* TO 'PM'@'%';
GRANT SELECT ON payment.* TO 'PM'@'%';
GRANT SELECT ON production.* TO 'PM'@'%';
GRANT SELECT ON personel.* TO 'PM'@'%';
GRANT SELECT ON salary.* TO 'PM'@'%';
GRANT SELECT ON information.* TO 'PM'@'%';
GRANT SELECT ON inventory.* TO 'PM'@'%';
GRANT SELECT ON factory.* TO 'PM'@'%';
GRANT SELECT ON market.* TO 'PM'@'%';
GRANT SELECT ON store.* TO 'PM'@'%';
GRANT SELECT ON report.* TO 'PM'@'%';
GRANT SELECT ON quotetion.* TO 'PM'@'%';
GRANT SELECT ON approval.* TO 'PM'@'%';
GRANT SELECT ON platform.* TO 'PM'@'%';
GRANT SELECT ON data.* TO 'PM'@'%';

GRANT SELECT ON communion.* TO 'PM'@'%';
REVOKE SELECT ON communion.`customer` FROM 'PM'@'%';
REVOKE SELECT ON communion.`user` FROM 'PM'@'%';
REVOKE SELECT ON communion.`customerphone` FROM 'PM'@'%';
REVOKE SELECT ON communion.`house` FROM 'PM'@'%';

-- ============================================
-- 2.3 CRM 用户权限
-- ============================================

GRANT SELECT ON decoration.* TO 'CRM'@'%';
GRANT SELECT ON quotation.* TO 'CRM'@'%';
GRANT SELECT ON construction.* TO 'CRM'@'%';
GRANT SELECT ON balance.* TO 'CRM'@'%';
GRANT SELECT ON sales.* TO 'CRM'@'%';
GRANT SELECT ON material.* TO 'CRM'@'%';
GRANT SELECT ON building.* TO 'CRM'@'%';
GRANT SELECT ON payment.* TO 'CRM'@'%';
GRANT SELECT ON production.* TO 'CRM'@'%';
GRANT SELECT ON personel.* TO 'CRM'@'%';
GRANT SELECT ON salary.* TO 'CRM'@'%';
GRANT SELECT ON information.* TO 'CRM'@'%';
GRANT SELECT ON inventory.* TO 'CRM'@'%';
GRANT SELECT ON factory.* TO 'CRM'@'%';
GRANT SELECT ON market.* TO 'CRM'@'%';
GRANT SELECT ON store.* TO 'CRM'@'%';
GRANT SELECT ON report.* TO 'CRM'@'%';
GRANT SELECT ON quotetion.* TO 'CRM'@'%';
GRANT SELECT ON approval.* TO 'CRM'@'%';
GRANT SELECT ON platform.* TO 'CRM'@'%';
GRANT SELECT ON data.* TO 'CRM'@'%';

GRANT SELECT ON communion.* TO 'CRM'@'%';
REVOKE SELECT ON communion.`customer` FROM 'CRM'@'%';
REVOKE SELECT ON communion.`user` FROM 'CRM'@'%';
REVOKE SELECT ON communion.`customerphone` FROM 'CRM'@'%';
REVOKE SELECT ON communion.`house` FROM 'CRM'@'%';

-- ============================================
-- 2.4 MEM 用户权限
-- ============================================

GRANT SELECT ON decoration.* TO 'MEM'@'%';
GRANT SELECT ON quotation.* TO 'MEM'@'%';
GRANT SELECT ON construction.* TO 'MEM'@'%';
GRANT SELECT ON balance.* TO 'MEM'@'%';
GRANT SELECT ON sales.* TO 'MEM'@'%';
GRANT SELECT ON material.* TO 'MEM'@'%';
GRANT SELECT ON building.* TO 'MEM'@'%';
GRANT SELECT ON payment.* TO 'MEM'@'%';
GRANT SELECT ON production.* TO 'MEM'@'%';
GRANT SELECT ON personel.* TO 'MEM'@'%';
GRANT SELECT ON salary.* TO 'MEM'@'%';
GRANT SELECT ON information.* TO 'MEM'@'%';
GRANT SELECT ON inventory.* TO 'MEM'@'%';
GRANT SELECT ON factory.* TO 'MEM'@'%';
GRANT SELECT ON market.* TO 'MEM'@'%';
GRANT SELECT ON store.* TO 'MEM'@'%';
GRANT SELECT ON report.* TO 'MEM'@'%';
GRANT SELECT ON quotetion.* TO 'MEM'@'%';
GRANT SELECT ON approval.* TO 'MEM'@'%';
GRANT SELECT ON platform.* TO 'MEM'@'%';
GRANT SELECT ON data.* TO 'MEM'@'%';

GRANT SELECT ON communion.* TO 'MEM'@'%';
REVOKE SELECT ON communion.`customer` FROM 'MEM'@'%';
REVOKE SELECT ON communion.`user` FROM 'MEM'@'%';
REVOKE SELECT ON communion.`customerphone` FROM 'MEM'@'%';
REVOKE SELECT ON communion.`house` FROM 'MEM'@'%';

-- ============================================
-- 2.5 zhanglt 用户权限
-- ============================================

GRANT SELECT ON decoration.* TO 'zhanglt'@'%';
GRANT SELECT ON quotation.* TO 'zhanglt'@'%';
GRANT SELECT ON construction.* TO 'zhanglt'@'%';
GRANT SELECT ON balance.* TO 'zhanglt'@'%';
GRANT SELECT ON sales.* TO 'zhanglt'@'%';
GRANT SELECT ON material.* TO 'zhanglt'@'%';
GRANT SELECT ON building.* TO 'zhanglt'@'%';
GRANT SELECT ON payment.* TO 'zhanglt'@'%';
GRANT SELECT ON production.* TO 'zhanglt'@'%';
GRANT SELECT ON personel.* TO 'zhanglt'@'%';
GRANT SELECT ON salary.* TO 'zhanglt'@'%';
GRANT SELECT ON information.* TO 'zhanglt'@'%';
GRANT SELECT ON inventory.* TO 'zhanglt'@'%';
GRANT SELECT ON factory.* TO 'zhanglt'@'%';
GRANT SELECT ON market.* TO 'zhanglt'@'%';
GRANT SELECT ON store.* TO 'zhanglt'@'%';
GRANT SELECT ON report.* TO 'zhanglt'@'%';
GRANT SELECT ON quotetion.* TO 'zhanglt'@'%';
GRANT SELECT ON approval.* TO 'zhanglt'@'%';
GRANT SELECT ON platform.* TO 'zhanglt'@'%';
GRANT SELECT ON data.* TO 'zhanglt'@'%';

GRANT SELECT ON communion.* TO 'zhanglt'@'%';
REVOKE SELECT ON communion.`customer` FROM 'zhanglt'@'%';
REVOKE SELECT ON communion.`user` FROM 'zhanglt'@'%';
REVOKE SELECT ON communion.`customerphone` FROM 'zhanglt'@'%';
REVOKE SELECT ON communion.`house` FROM 'zhanglt'@'%';

-- ============================================
-- 2.6 zhouhh 用户权限
-- ============================================

GRANT SELECT ON decoration.* TO 'zhouhh'@'%';
GRANT SELECT ON quotation.* TO 'zhouhh'@'%';
GRANT SELECT ON construction.* TO 'zhouhh'@'%';
GRANT SELECT ON balance.* TO 'zhouhh'@'%';
GRANT SELECT ON sales.* TO 'zhouhh'@'%';
GRANT SELECT ON material.* TO 'zhouhh'@'%';
GRANT SELECT ON building.* TO 'zhouhh'@'%';
GRANT SELECT ON payment.* TO 'zhouhh'@'%';
GRANT SELECT ON production.* TO 'zhouhh'@'%';
GRANT SELECT ON personel.* TO 'zhouhh'@'%';
GRANT SELECT ON salary.* TO 'zhouhh'@'%';
GRANT SELECT ON information.* TO 'zhouhh'@'%';
GRANT SELECT ON inventory.* TO 'zhouhh'@'%';
GRANT SELECT ON factory.* TO 'zhouhh'@'%';
GRANT SELECT ON market.* TO 'zhouhh'@'%';
GRANT SELECT ON store.* TO 'zhouhh'@'%';
GRANT SELECT ON report.* TO 'zhouhh'@'%';
GRANT SELECT ON quotetion.* TO 'zhouhh'@'%';
GRANT SELECT ON approval.* TO 'zhouhh'@'%';
GRANT SELECT ON platform.* TO 'zhouhh'@'%';
GRANT SELECT ON data.* TO 'zhouhh'@'%';

GRANT SELECT ON communion.* TO 'zhouhh'@'%';
REVOKE SELECT ON communion.`customer` FROM 'zhouhh'@'%';
REVOKE SELECT ON communion.`user` FROM 'zhouhh'@'%';
REVOKE SELECT ON communion.`customerphone` FROM 'zhouhh'@'%';
REVOKE SELECT ON communion.`house` FROM 'zhouhh'@'%';

-- ============================================
-- 2.7 zhous 用户权限
-- ============================================

GRANT SELECT ON decoration.* TO 'zhous'@'%';
GRANT SELECT ON quotation.* TO 'zhous'@'%';
GRANT SELECT ON construction.* TO 'zhous'@'%';
GRANT SELECT ON balance.* TO 'zhous'@'%';
GRANT SELECT ON sales.* TO 'zhous'@'%';
GRANT SELECT ON material.* TO 'zhous'@'%';
GRANT SELECT ON building.* TO 'zhous'@'%';
GRANT SELECT ON payment.* TO 'zhous'@'%';
GRANT SELECT ON production.* TO 'zhous'@'%';
GRANT SELECT ON personel.* TO 'zhous'@'%';
GRANT SELECT ON salary.* TO 'zhous'@'%';
GRANT SELECT ON information.* TO 'zhous'@'%';
GRANT SELECT ON inventory.* TO 'zhous'@'%';
GRANT SELECT ON factory.* TO 'zhous'@'%';
GRANT SELECT ON market.* TO 'zhous'@'%';
GRANT SELECT ON store.* TO 'zhous'@'%';
GRANT SELECT ON report.* TO 'zhous'@'%';
GRANT SELECT ON quotetion.* TO 'zhous'@'%';
GRANT SELECT ON approval.* TO 'zhous'@'%';
GRANT SELECT ON platform.* TO 'zhous'@'%';
GRANT SELECT ON data.* TO 'zhous'@'%';

GRANT SELECT ON communion.* TO 'zhous'@'%';
REVOKE SELECT ON communion.`customer` FROM 'zhous'@'%';
REVOKE SELECT ON communion.`user` FROM 'zhous'@'%';
REVOKE SELECT ON communion.`customerphone` FROM 'zhous'@'%';
REVOKE SELECT ON communion.`house` FROM 'zhous'@'%';

FLUSH PRIVILEGES;

-- ============================================
-- 步骤3：验证权限
-- ============================================

-- 查看用户权限
SHOW GRANTS FOR 'BI'@'%';
SHOW GRANTS FOR 'PM'@'%';
SHOW GRANTS FOR 'CRM'@'%';
SHOW GRANTS FOR 'MEM'@'%';
SHOW GRANTS FOR 'zhanglt'@'%';
SHOW GRANTS FOR 'zhouhh'@'%';
SHOW GRANTS FOR 'zhous'@'%';

-- ============================================
-- 回滚脚本
-- ============================================

/*
DROP USER IF EXISTS 'BI'@'%';
DROP USER IF EXISTS 'PM'@'%';
DROP USER IF EXISTS 'CRM'@'%';
DROP USER IF EXISTS 'MEM'@'%';
DROP USER IF EXISTS 'zhanglt'@'%';
DROP USER IF EXISTS 'zhouhh'@'%';
DROP USER IF EXISTS 'zhous'@'%';
FLUSH PRIVILEGES;
*/
