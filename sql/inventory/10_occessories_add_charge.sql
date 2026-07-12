-- 为外辅单表和外辅明细表添加费用总额和定材关联字段
-- 执行日期: 2026-03-22
-- 说明:
--   - charge 字段存储外辅费用总额，单位为分，计算公式：charge = ∑((price + surplus) * num)
--   - nid 字段关联定材表（normtion.nid），用于汇总某个定材关联辅料项的总数量

USE `inventory`;

-- 为外辅单主表添加 charge 字段
ALTER TABLE `inventory`.`occessories`
ADD COLUMN `charge` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '外辅费用总额（分）'
AFTER `total`;

-- 为外辅单明细表添加 charge 字段
ALTER TABLE `inventory`.`occessoriesItem`
ADD COLUMN `charge` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '外辅项费用总额（分）'
AFTER `vbalance`;

-- 为外辅单明细表添加 nid 字段（关联定材表）
ALTER TABLE `inventory`.`occessoriesItem`
ADD COLUMN `nid` INT(11) DEFAULT 0 COMMENT '定材ID'
AFTER `charge`;
