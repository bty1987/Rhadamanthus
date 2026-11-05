-- =====================================================================
-- 用途: 辅料单(inventory.accessories / inventory.accessoriesitem)加配送标识列
--   【辅料单配送标识方案, DDL 先于 jar】
--   accessories.delivery: 主单配送标识 0自配 1配送(创建弹窗确认/列表改配送改自配切换)
--   accessoriesitem.delivery: 项级快照, 创建项时按 caid 服务端抓取 data.aoods.delivery
-- 配套方案: docs/01-方案设计/辅料单配送标识方案.md
-- 执行前置条件:
--   1. 先于 fanglin-inventory jar(新 PO 映射新列, 老库+新 jar 报错)
--   2. 🔴 accessoriesitem 为千万级大表(生产约1768万行), ADD COLUMN 必须低峰执行
--   3. 🔴 MySQL 5.x 无 ADD COLUMN IF NOT EXISTS, 裸 ALTER 照 50/80 号先例
-- 回滚方式:
--   不回滚(只加列, 带 DEFAULT, 老 jar 不读零影响; 代码可独立回退)
-- 验证语句:
--   SHOW COLUMNS FROM `inventory`.`accessories` LIKE 'delivery';
--   SHOW COLUMNS FROM `inventory`.`accessoriesitem` LIKE 'delivery';
-- 幂等性: 非幂等(裸 ALTER), 重跑报 Duplicate column 无害
-- 存量兼容: 存量行全部落默认 0(自配)不回填; 出库闸(260094)对 delivery=0 单豁免,
--   存量单出库行为与加列前完全一致
-- =====================================================================

ALTER TABLE `inventory`.`accessories`
  ADD COLUMN `delivery` TINYINT NOT NULL DEFAULT 0 COMMENT '配送标识: 0自配 1配送';

ALTER TABLE `inventory`.`accessoriesitem`
  ADD COLUMN `delivery` TINYINT NOT NULL DEFAULT 0 COMMENT '是否需要配送(创建时按caid快照data.aoods)';
