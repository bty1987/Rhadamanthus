-- =====================================================================
-- 用途: 辅料单费用明细表 + 分配标记列【费用明细/结算公式化/分配标记/出库闸 四需求, DDL 先于 jar】
--   ① inventory.accessoriescharge 费用明细表: 照外辅 occcessoriescharge(sqls/inventory/accessoriescharge.sql)
--      平移, 口径统一为厘(×1000, 与 data.aoodscharge 模板及 accessories.charge 一致, 外辅表为分勿混抄);
--   ② accessories.assignFlag 分配标记列: 标记需分配的单才开放分配厂商(bindAccessories 守卫),
--      标记未分配不可出库(deliveAccessories 守卫), 厂商视角仅见已标记单;
-- 执行前置条件:
--   1. 先于 fanglin-inventory jar(新 PO 映射新表/新列, 老库+新 jar 报错)
--   2. accessories 为生产大表, ADD COLUMN 低峰执行
-- 回滚方式:
--   不回滚(只加表/加列, 带 DEFAULT/NULL, 老 jar 不读零影响; 代码可独立回退)
-- 验证语句:
--   SHOW TABLES FROM `inventory` LIKE 'accessoriescharge';
--   SHOW COLUMNS FROM `inventory`.`accessories` LIKE 'assignFlag';
-- 幂等性: 建表幂等(CREATE IF NOT EXISTS); 加列非幂等(裸 ALTER, 50号先例, 重跑报 Duplicate column 无害)
-- =====================================================================

CREATE TABLE IF NOT EXISTS `inventory`.`accessoriescharge` (
  `acid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `aid` BIGINT(20) NOT NULL COMMENT '辅料单ID（外键，关联inventory.accessories.aid）',
  `aiid` BIGINT(20) DEFAULT NULL COMMENT '辅料项ID（外键，关联inventory.accessoriesItem.aiid）',
  `name` VARCHAR(100) NOT NULL COMMENT '费用名称',
  `price` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '单价（厘）',
  `surplus` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '浮动额（厘）',
  `num` INT(11) NOT NULL DEFAULT 0 COMMENT '数量',
  PRIMARY KEY (`acid`),
  KEY `idx_aid` (`aid`),
  KEY `idx_aiid` (`aiid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='辅料单费用明细';

ALTER TABLE `inventory`.`accessories`
  ADD COLUMN `assignFlag` TINYINT NOT NULL DEFAULT 0 COMMENT '分配标记: 0未标记 1需分配(分配厂商/出库闸依据)' AFTER `supplier`;
