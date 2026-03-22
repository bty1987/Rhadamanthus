-- 为 inventory.occessoriesitem 表添加 aid 字段
-- 用途：关联 data.aoods.aid（辅材ID）
-- 创建时间：2026-03-22
-- 说明：保留现有的 gid 字段（关联 data.goods.gid），新增 aid 字段实现辅材关联

-- 添加 aid 字段
ALTER TABLE `inventory`.`occessoriesitem`
ADD COLUMN `aid` BIGINT(20) DEFAULT NULL COMMENT '辅材ID（外键，关联data.aoods.aid）'
AFTER `gid`;

-- 添加外键索引
ALTER TABLE `inventory`.`occessoriesitem`
ADD KEY `idx_aid` (`aid`);

-- 添加外键约束（可选，根据实际需要决定是否启用）
-- ALTER TABLE `inventory`.`occessoriesitem`
-- ADD CONSTRAINT `fk_occessoriesitem_aid`
-- FOREIGN KEY (`aid`) REFERENCES `data`.`aoods` (`aid`)
-- ON DELETE RESTRICT
-- ON UPDATE CASCADE;
