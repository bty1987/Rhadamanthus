-- =====================================================
-- 设计图片多次确认功能 - 数据库升级脚本
-- 创建时间: 2025-12-31
-- 说明: 复用 decorationservice 表，扩展 decorationpicture 状态
-- =====================================================

-- 1. 为 decorationService 表添加 args 字段
ALTER TABLE decoration.decorationService
ADD COLUMN args TEXT COMMENT '扩展参数(JSON格式),存储确认相关的数据' AFTER detail;

-- 2. 添加索引以优化查询性能
CREATE INDEX idx_design_confirm ON decoration.decorationService(orderId, type);

-- 3. 验证字段是否添加成功
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    COLUMN_COMMENT
FROM
    information_schema.COLUMNS
WHERE
    TABLE_SCHEMA = 'decoration'
    AND TABLE_NAME = 'decorationService'
    AND COLUMN_NAME IN ('args', 'type', 'orderId');

-- =====================================================
-- args 字段 JSON 格式说明:
-- {
--   "dpids": [1001, 1002, 1003],    // 确认关联的图片ID列表
--   "result": 2,                      // 确认结果: 2=完成, 4=微改, 6=大改
--   "pictureCount": 3,                // 图片数量
--   "remark": "客户意见"               // 修改意见(可选)
-- }
-- =====================================================

-- =====================================================
-- decorationpicture.status 状态说明:
-- 0 - 隐藏 (STATUS_DISABLE_INT)
-- 1 - 正常显示 (STATUS_ENABLE_INT)
-- 4 - 本次确认展示 (STATUS_CONFIRM_SHOW_INT)
-- =====================================================
