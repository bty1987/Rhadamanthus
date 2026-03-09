-- 为施工信息表添加交接状态字段
-- 执行日期: 2025-12-31
-- 说明: 0-未交接, 1-已交接, 2-不验证

USE `construction`;

-- 添加交接状态字段
ALTER TABLE `constructioninfo`
ADD COLUMN `handoverStatus` tinyint(1) NOT NULL DEFAULT '0' COMMENT '交接状态: 0-未交接, 1-已交接, 2-不验证' AFTER `comment`;

-- 添加索引以提高查询性能
ALTER TABLE `constructioninfo`
ADD INDEX `index_handoverStatus` (`handoverStatus`);
