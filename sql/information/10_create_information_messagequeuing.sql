-- 创建消息队列表
-- 功能：后台异步消息队列处理
-- 创建时间：2025-01-17
-- 作者：AI Assistant

-- 创建 messagequeuing 表
CREATE TABLE IF NOT EXISTS information.messagequeuing (
    mqid BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '消息队列ID',
    operation VARCHAR(100) NOT NULL COMMENT '操作类型',
    args TEXT COMMENT '参数(JSON格式)',
    createtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    finishtime TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
    status SMALLINT NOT NULL DEFAULT 0 COMMENT '状态(0:未处理, 1:已处理)',
    INDEX idx_status (status),
    INDEX idx_operation (operation),
    INDEX idx_createtime (createtime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息队列表';

-- 验证表创建
SELECT
    TABLE_NAME,
    ENGINE,
    TABLE_COLLATION,
    TABLE_COMMENT
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'information'
  AND TABLE_NAME = 'messagequeuing';

-- 验证字段创建
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    COLUMN_DEFAULT,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'information'
  AND TABLE_NAME = 'messagequeuing'
ORDER BY ORDINAL_POSITION;
