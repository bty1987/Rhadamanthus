-- 为 customerchance 表添加 isCheck 字段
-- 功能：标记客户机会是否需要验证（0:验证, 1:忽略）
-- 创建时间：2025-12-31
-- 作者：AI Assistant

-- 添加 isCheck 字段
ALTER TABLE customer.customerchance
ADD COLUMN isCheck TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否验证(0:验证, 1:忽略)'
AFTER isFine;

-- 更新现有数据，设置默认值为 0（验证）
UPDATE customer.customerchance
SET isCheck = 0
WHERE isCheck IS NULL;

-- 为 isCheck 字段添加索引（可选，如果经常按此字段查询）
CREATE INDEX idx_ischeck ON customer.customerchance(isCheck);

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
  AND COLUMN_NAME = 'isCheck';
