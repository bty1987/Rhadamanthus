-- ============================================
-- 销售项表增加到货量字段
-- 表名: sales.salesitem
-- 字段名: trnum (到货量)
-- 创建时间: 2025-12-07
-- ============================================

USE sales;

-- 添加 trnum 字段 (到货量)，默认值为 0
ALTER TABLE `salesitem`
ADD COLUMN `trnum` BIGINT NOT NULL DEFAULT 0 COMMENT '到货量'
AFTER `xgnum`;

-- 验证字段是否添加成功
DESC `salesitem`;

-- 说明:
-- 1. trnum 字段类型为 BIGINT，与其他数量字段 (num, initnum, punum, xgnum) 保持一致
-- 2. 默认值为 0，确保现有数据不受影响
-- 3. NOT NULL 约束确保数据完整性
-- 4. 位置在 xgnum 字段之后，与代码中的字段顺序保持一致
-- 5. 目前不需要接口支持，仅作为数据存储使用

-- 回滚脚本 (如需删除字段):
-- ALTER TABLE `salesitem` DROP COLUMN `trnum`;
