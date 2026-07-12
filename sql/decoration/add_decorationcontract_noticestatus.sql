-- ============================================
-- 装饰合同表增加客户需求确认状态字段
-- 表名: decoration.decorationcontract
-- 字段名: noticeStatus (客户需求确认状态)
-- 创建时间: 2025-12-30
-- ============================================

USE decoration;

-- 添加 noticeStatus 字段，默认值为 1(未确认)
ALTER TABLE `decorationcontract`
ADD COLUMN `noticeStatus` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '客户需求确认状态:0-已确认,1-未确认'
AFTER `filesize`;

-- 验证字段是否添加成功
DESC `decorationcontract`;

-- 说明:
-- 1. noticeStatus 字段类型为 TINYINT(1)，对应 Java 的 short 类型
-- 2. 默认值为 1（未确认），创建合同时默认为未确认状态
-- 3. 取值范围：
--    - 0: 已确认
--    - 1: 未确认
-- 4. NOT NULL 约束确保数据完整性
-- 5. 位置在 filesize 字段之后

-- 回滚脚本 (如需删除字段):
-- ALTER TABLE `decorationcontract` DROP COLUMN `noticeStatus`;
