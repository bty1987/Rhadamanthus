-- ============================================
-- 合同模板表增加客户需求文件路径字段
-- 表名: data.contract
-- 字段名: noticePath (客户需求文件路径)
-- 创建时间: 2025-12-30
-- ============================================

USE data;

-- 添加 noticePath 字段，用于保存客户需求上传的文件路径
ALTER TABLE `contract`
ADD COLUMN `noticePath` VARCHAR(500) NULL COMMENT '客户需求文件路径'
AFTER `videopath`;

-- 验证字段是否添加成功
DESC `contract`;

-- 说明:
-- 1. noticePath 字段类型为 VARCHAR(500)，与现有 path 字段保持一致
-- 2. 允许为 NULL，确保现有数据不受影响
-- 3. 位置在 videopath 字段之后，与代码中的字段顺序保持一致
-- 4. 用途：保存客户需求上传的文件路径

-- 回滚脚本 (如需删除字段):
-- ALTER TABLE `contract` DROP COLUMN `noticePath`;
