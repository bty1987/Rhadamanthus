-- =====================================================================
-- 用途: 辅材档案(data.aoods)加"配送标识"列【辅料单配送标识方案, DDL 先于 jar】
--   deliveryFlag: 0自配 1配送; 档案级标记, 创建辅料项时按 caid 快照到
--   inventory.accessoriesitem.deliveryFlag, 创建辅料单时汇总为 accessories.deliveryStatus 主单配送状态
-- 配套方案: docs/01-方案设计/辅料单配送标识方案.md
-- 执行前置条件:
--   1. 先于 fanglin-data jar(新 PO 映射新列, 老库+新 jar 报错)
--   2. 与 sqls/inventory/90 号同批
-- 回滚方式:
--   不回滚(只加列, 带 DEFAULT, 老 jar 不读零影响; 代码可独立回退)
-- 验证语句:
--   SHOW COLUMNS FROM `data`.`aoods` LIKE 'deliveryFlag';
-- 幂等性: 非幂等(裸 ALTER, 50/80 号先例), 重跑报 Duplicate column 无害
-- =====================================================================

ALTER TABLE `data`.`aoods`
  ADD COLUMN `deliveryFlag` TINYINT NOT NULL DEFAULT 0 COMMENT '配送标识(是否需要配送): 0自配 1配送';
