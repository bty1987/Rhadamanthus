-- =====================================================================
-- 用途: 辅料单(inventory.accessories)加厂商/费用/结算 5 列【辅料单厂商配送与费用结算方案 v1.1,DDL 先于 jar】
--   supplier 厂商 / charge 费用额(自动算) / balance 结算额(单列) / buid 结算人 / balanceTime 结算时间
--   配套方案: docs/01-方案设计/辅料单厂商配送与费用结算方案.md
-- 执行前置条件:
--   1. 低峰执行(accessories 为生产大表, ADD COLUMN 走在线 DDL 但需重建表)
--   2. 与 60 号(状态字典)同批, 均先于 fanglin-inventory jar(新 PO 映射新列, 老库+新jar会报错)
--   3. 🔴 MySQL 5.x 无 ADD COLUMN IF NOT EXISTS, 本脚本为裸 ALTER 与仓内
--      10/20 号外辅加列先例同款; 重跑报 Duplicate column 无害, 重跑前先用验证语句核对
-- 回滚方式:
--   不回滚(只加列, 带 DEFAULT/NULL, 老 jar 不读新列零影响; 代码可独立回退)
-- 验证语句:
--   SHOW COLUMNS FROM `inventory`.`accessories` LIKE 'supplier';
--   SHOW COLUMNS FROM `inventory`.`accessories` LIKE 'charge';
--   SHOW COLUMNS FROM `inventory`.`accessories` LIKE 'balance';
--   SHOW COLUMNS FROM `inventory`.`accessories` LIKE 'buid';
--   SHOW COLUMNS FROM `inventory`.`accessories` LIKE 'balanceTime';
-- 幂等性: 非幂等(裸 ALTER), 首次执行后勿重跑
-- =====================================================================

-- 结构备份(空表, 记录加列前形态)
CREATE TABLE IF NOT EXISTS `inventory`.`accessories_bak_50` AS
SELECT aid, no, status, total FROM `inventory`.`accessories` LIMIT 0;

ALTER TABLE `inventory`.`accessories`
  ADD COLUMN `supplier` INT NULL COMMENT '厂商uid（personel.user，bindAccessories分配/改派）' AFTER `auid`,
  ADD COLUMN `charge` BIGINT NOT NULL DEFAULT 0 COMMENT '费用额（厘，按data.aoodscharge模板自动算）' AFTER `total`,
  ADD COLUMN `balance` INT NOT NULL DEFAULT 0 COMMENT '结算额（厘，balanceAccessories写入）' AFTER `charge`,
  ADD COLUMN `buid` INT NULL COMMENT '结算人uid（personel.user）' AFTER `balance`,
  ADD COLUMN `balanceTime` datetime NULL COMMENT '结算时间' AFTER `deliverTime`;
