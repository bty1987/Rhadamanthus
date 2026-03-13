-- ============================================================================
-- 为 decorationuser 表添加 type 字段
-- 目的：区分员工在订单中的具体作用类型
-- 作者：AI
-- 日期：2026-03-12
-- ============================================================================

-- 添加 type 字段
ALTER TABLE decoration.decorationuser
ADD COLUMN type TINYINT(1) DEFAULT 0
COMMENT '人员类型: 0-业务, 1-装饰, 2-服务, 3-合同, 4-销售, 99-其他'
AFTER isPay;

-- 添加索引便于查询
CREATE INDEX idx_type ON decoration.decorationuser(type);

-- 为现有数据设置默认值（可选，根据实际业务需求调整）
UPDATE decoration.decorationuser SET type = 99 WHERE type IS NULL;

-- 查看修改结果
SELECT
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'decoration'
  AND TABLE_NAME = 'decorationuser'
ORDER BY ORDINAL_POSITION;

-- ============================================================================
-- 字段说明：
-- type = 0  : 业务人员 (TYPE_BUSI_INT)
-- type = 1  : 装饰人员 (TYPE_DECO_INT)
-- type = 2  : 服务人员 (TYPE_SERV_INT)
-- type = 3  : 合同人员 (TYPE_CONT_INT)
-- type = 4  : 销售人员 (TYPE_SALES_INT)
-- type = 99 : 其他人员 (TYPE_OTHER_INT)
-- ============================================================================
