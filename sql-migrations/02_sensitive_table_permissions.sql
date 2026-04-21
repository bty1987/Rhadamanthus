-- ============================================
-- 敏感表权限控制脚本
-- ============================================
-- 功能：确保普通用户只能访问脱敏视图，不能访问原表
-- 版本：v1.0
-- 日期：2026-04-11
-- ============================================

-- ============================================
-- 说明
-- ============================================
-- 主账号 (fanglin1918)：可访问原表和视图
-- 普通用户 (app_*, erpreder, zhanglitao)：只能访问视图，不能访问原表
--
-- 敏感表清单：
--   communion.customer     (phone, identity)
--   communion.user          (phone, identity)
--   communion.customerphone (phone)
--   communion.house         (housenumber - 暂不脱敏，仅控制权限)

-- ============================================
-- 步骤1：收回所有普通用户对敏感表的直接访问权限
-- ============================================

-- 收回 erpreder 对 communion 的权限
REVOKE SELECT, LOCK TABLES, SHOW VIEW ON `communion`.* FROM 'erpreder'@'%';
-- 只授予视图访问权限
GRANT SELECT ON communion.customer_v TO 'erpreder'@'%';
GRANT SELECT ON communion.user_v TO 'erpreder'@'%';
GRANT SELECT ON communion.customerphone_v TO 'erpreder'@'%';
GRANT SELECT ON communion.house_v TO 'erpreder'@'%';

-- 收回 zhanglitao 对敏感表的权限（逐个表回收）
REVOKE SELECT, INSERT, UPDATE, DELETE ON `communion`.`customer` FROM 'zhanglitao'@'%';
REVOKE SELECT, INSERT, UPDATE, DELETE ON `communion`.`user` FROM 'zhanglitao'@'%';
REVOKE SELECT, INSERT, UPDATE, DELETE ON `communion`.`customerphone` FROM 'zhanglitao'@'%';
REVOKE SELECT, INSERT, UPDATE, DELETE ON `communion`.`house` FROM 'zhanglitao'@'%';
-- 授予视图访问权限
GRANT SELECT ON communion.customer_v TO 'zhanglitao'@'%';
GRANT SELECT ON communion.user_v TO 'zhanglitao'@'%';
GRANT SELECT ON communion.customerphone_v TO 'zhanglitao'@'%';
GRANT SELECT ON communion.house_v TO 'zhanglitao'@'%';

FLUSH PRIVILEGES;

-- ============================================
-- 步骤2：未来创建的普通用户权限模板
-- ============================================
-- 创建新用户时，使用以下权限模板：

/*
-- 装饰订单模块用户权限模板
CREATE USER 'app_decoration'@'%' IDENTIFIED BY '密码';
-- 授予业务表权限
GRANT SELECT, INSERT, UPDATE ON decoration.* TO 'app_decoration'@'%';
GRANT SELECT, INSERT, UPDATE ON quotation.* TO 'app_decoration'@'%';
GRANT SELECT ON building.* TO 'app_decoration'@'%';
GRANT SELECT ON approval.* TO 'app_decoration'@'%';
GRANT SELECT ON platform.* TO 'app_decoration'@'%';
-- 敏感表：只能访问视图
GRANT SELECT ON communion.customer_v TO 'app_decoration'@'%';
GRANT SELECT ON communion.user_v TO 'app_decoration'@'%';
GRANT SELECT ON communion.customerphone_v TO 'app_decoration'@'%';
GRANT SELECT ON communion.house_v TO 'app_decoration'@'%';
-- communion 其他非敏感表
GRANT SELECT ON communion.department TO 'app_decoration'@'%';
GRANT SELECT ON communion.duties TO 'app_decoration'@'%';
GRANT SELECT ON communion.brand TO 'app_decoration'@'%';
-- ... 其他非敏感表
FLUSH PRIVILEGES;
*/

-- ============================================
-- 步骤3：验证配置
-- ============================================

-- 3.1 验证视图是否存在
SELECT
    TABLE_NAME as '视图名称'
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'communion'
  AND TABLE_NAME IN ('customer_v', 'user_v', 'customerphone_v', 'house_v');

-- 3.2 验证普通用户对原表无权限
-- 以 erpreder 为例
SHOW GRANTS FOR 'erpreder'@'%';

-- 3.3 测试视图数据（手动测试用）
-- USE communion;
-- SELECT cid, name, phone, identity FROM customer_v LIMIT 5;
-- 应显示脱敏后的数据

-- ============================================
-- 回滚脚本（如需恢复原状）
-- ============================================

/*
-- 恢复 erpreder 原有权限
GRANT SELECT, LOCK TABLES, SHOW VIEW ON `communion`.* TO 'erpreder'@'%';
REVOKE SELECT ON communion.customer_v FROM 'erpreder'@'%';
REVOKE SELECT ON communion.user_v FROM 'erpreder'@'%';
REVOKE SELECT ON communion.customerphone_v FROM 'erpreder'@'%';
REVOKE SELECT ON communion.house_v FROM 'erpreder'@'%';

-- 恢复 zhanglitao 原有权限
GRANT ALL PRIVILEGES ON `communion`.`customer` TO 'zhanglitao'@'%';
GRANT ALL PRIVILEGES ON `communion`.`user` TO 'zhanglitao'@'%';
GRANT ALL PRIVILEGES ON `communion`.`customerphone` TO 'zhanglitao'@'%';
GRANT ALL PRIVILEGES ON `communion`.`house` TO 'zhanglitao'@'%';
REVOKE SELECT ON communion.customer_v FROM 'zhanglitao'@'%';
REVOKE SELECT ON communion.user_v FROM 'zhanglitao'@'%';
REVOKE SELECT ON communion.customerphone_v FROM 'zhanglitao'@'%';
REVOKE SELECT ON communion.house_v FROM 'zhanglitao'@'%';

FLUSH PRIVILEGES;
*/
