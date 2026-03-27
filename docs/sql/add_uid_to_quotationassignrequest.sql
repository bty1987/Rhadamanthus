-- ====================================================================
-- 数据库表结构修改脚本
-- 表名: quotationassignrequest (装修单预算分配请求表)
-- 修改内容: 增加 uid 字段（分配给的预算员用户ID）
-- 日期: 2026-03-27
-- ====================================================================

-- 查看当前表结构
DESC quotation.quotationassignrequest;

-- 增加 uid 字段
ALTER TABLE quotation.quotationassignrequest
ADD COLUMN uid INT(11)) NULL COMMENT '分配给的预算员用户ID（status=2时有值，status=1时为NULL）'
AFTER status;

-- 为已有数据设置默认值（已分配的请求需要找到对应的预算员）
-- 注意：这部分需要根据实际的业务数据来执行，这里仅作为示例
-- UPDATE quotation.quotationassignrequest r
-- INNER JOIN (
--     SELECT orderId, uid
--     FROM quotation.quotationassignrecord
--     WHERE assignResult = 1  -- 成功分配
--     GROUP BY orderId
--     ORDER BY assignTime DESC
-- ) rec ON r.orderId = rec.orderId
-- SET r.uid = rec.uid
-- WHERE r.status = 2;  -- 已分配状态

-- 为 uid 字段添加索引（优化查询性能）
CREATE INDEX idx_quotationassignrequest_uid_status
ON quotation.quotationassignrequest(uid, status);

-- 验证修改结果
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'quotation'
  AND TABLE_NAME = 'quotationassignrequest'
  AND COLUMN_NAME = 'uid';

-- 查看表结构（确认修改成功）
DESC quotation.quotationassignrequest;
