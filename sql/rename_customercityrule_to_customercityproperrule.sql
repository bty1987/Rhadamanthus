-- ================================================
-- 重命名数据库表：customercityrule → customercityproperrule
-- 日期：2026-03-15
-- 说明：将客户城区规则表重命名为更准确的命名
-- ================================================

USE customer;

-- 1. 重命名表
RENAME TABLE customercityrule TO customercityproperrule;

-- 2. 验证重命名结果
SELECT
    TABLE_NAME AS '新表名',
    TABLE_COMMENT AS '表注释'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'customer'
  AND TABLE_NAME = 'customercityproperrule';

-- 3. 查看表结构确认
DESCRIBE customercityproperrule;

-- 说明：
-- - 表名从 customercityrule 改为 customercityproperrule
-- - 所有字段保持不变
-- - cpid 字段已经正确指向 cityproper.cpid（城区ID）
-- - type 字段：0=城区→公司, 1=城区→部门, 2=城区→设计师
