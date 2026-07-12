-- 为外辅单表添加结算费用字段
-- 执行日期: 2026-04-05
-- 说明:
--   - rcharge 字段存储结算费用，单位为分

USE `inventory`;

-- 为外辅单主表添加 rcharge 字段
ALTER TABLE `inventory`.`occessories`
ADD COLUMN `rcharge` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '结算费用（分）'
AFTER `charge`;
