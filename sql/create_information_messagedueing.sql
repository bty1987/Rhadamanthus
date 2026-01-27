-- 创建消息到期表
-- 功能：后台异步消息到期处理
-- 创建时间：2026-01-27
-- 作者：AI Assistant

-- 创建 messagedueing 表
CREATE TABLE IF NOT EXISTS information.messagedueing (
    mdid BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '消息到期ID',
    operation VARCHAR(100) NOT NULL COMMENT '操作类型',
    args TEXT COMMENT '参数(JSON格式)',
    createtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    finishtime TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
    status SMALLINT NOT NULL DEFAULT 0 COMMENT '状态(0:未处理, 1:已处理)',
    orderid VARCHAR(50) NULL DEFAULT NULL COMMENT '订单ID',
    INDEX idx_status (status),
    INDEX idx_operation (operation),
    INDEX idx_createtime (createtime),
    INDEX idx_orderid (orderid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息到期表';

-- 验证表创建
SELECT
    TABLE_NAME,
    ENGINE,
    TABLE_COLLATION,
    TABLE_COMMENT
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'information'
  AND TABLE_NAME = 'messagedueing';

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
  AND TABLE_NAME = 'messagedueing'
ORDER BY ORDINAL_POSITION;
