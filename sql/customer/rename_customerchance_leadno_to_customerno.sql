-- 将 customerchance 表的 leadno 字段重命名为 customerno
-- 功能：统一命名（原 leadno 存储客户编号，重命名为 customerno）
-- 创建时间：2026-06-30
-- 作者：AI Assistant

-- 重命名列（MySQL 5.x 支持 CHANGE 语法，保留列定义）
ALTER TABLE customer.customerchance
CHANGE COLUMN leadno customerno VARCHAR(32) NULL COMMENT '客户编号';

-- 验证修改
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_DEFAULT,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'customer'
  AND TABLE_NAME = 'customerchance'
  AND COLUMN_NAME = 'customerno';
