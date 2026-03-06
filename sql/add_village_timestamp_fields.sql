-- 为communion.village表添加createTime和updateTime字段
-- 执行时间: 2025-12-16

ALTER TABLE `communion`.`village`
ADD COLUMN `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间' AFTER `company`,
ADD COLUMN `updateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间' AFTER `createTime`;

-- 为updateTime字段添加索引，提高查询性能
CREATE INDEX `idx_village_updateTime` ON `communion`.`village` (`updateTime`);