-- 为 messagequeuing 表添加 orderId 字段
-- 功能：关联装修单号
-- 创建时间：2025-01-17
-- 作者：AI Assistant

-- 添加 orderId 字段
ALTER TABLE information.messagequeuing
ADD COLUMN orderId VARCHAR(50) NULL COMMENT '装修单号'
AFTER status;

-- 为 orderId 字段添加索引
CREATE INDEX idx_orderid ON information.messagequeuing(orderId);

-- 验证字段添加
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'information'
  AND TABLE_NAME = 'messagequeuing'
  AND COLUMN_NAME = 'orderId';
