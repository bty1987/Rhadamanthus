-- =====================================================================
-- 用途: 生产配送字段改名迁移——delivery → deliveryFlag/deliveryStatus【辅料单配送标识批次 v1.1 定名】
--   背景: 生产已执行旧列名版 DDL(sqls/data/33号 + sqls/inventory/90号的 delivery 形态),
--   代码已定名(v1.1, 提交 d8ee5ab5d)并按新名部署 test-erp, 本脚本把生产三列改成新名:
--     data.aoods.delivery              → deliveryFlag   (配送标识, 是否需要配送)
--     inventory.accessories.delivery   → deliveryStatus (配送状态, 主单 0自配 1配送)
--     inventory.accessoriesitem.delivery → deliveryFlag (配送标识, 项级快照)
--   数据零变更: CHANGE COLUMN 纯改名, 类型/默认值不变, 存量行(全默认0=自配)原样保留
-- 执行前置条件:
--   1. 🔴 先于 fanglin-data/fanglin-inventory 双 jar 生产部署(新 jar 映射新列名,
--      旧列名+新 jar 会报 Unknown column); 前端与 34 号 operation SQL 与本脚本无先后约束
--   2. 🔴 accessoriesitem 生产约 1768 万行, MySQL 5.6 CHANGE COLUMN 走在线 DDL
--      (允许并发 DML 但重建表, 耗时与数据量正相关), 必须低峰执行
--   3. 执行前先跑"执行前核查", 确认三列确为 delivery 形态(防旧 DDL 漏执行/防重复改名)
-- 回滚方式:
--   ALTER TABLE `data`.`aoods` CHANGE COLUMN `deliveryFlag` `delivery` TINYINT NOT NULL DEFAULT 0 COMMENT '是否需要配送: 0自配 1配送';
--   ALTER TABLE `inventory`.`accessories` CHANGE COLUMN `deliveryStatus` `delivery` TINYINT NOT NULL DEFAULT 0 COMMENT '配送标识: 0自配 1配送';
--   ALTER TABLE `inventory`.`accessoriesitem` CHANGE COLUMN `deliveryFlag` `delivery` TINYINT NOT NULL DEFAULT 0 COMMENT '是否需要配送(创建时按caid快照data.aoods)';
--   (回滚后需同步回退双 jar 至旧版, 否则同样 Unknown column)
-- 验证语句:
--   执行前核查(期望 3 行 COLUMN_NAME 全部 = delivery):
--     SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, COLUMN_TYPE
--     FROM information_schema.COLUMNS
--     WHERE TABLE_NAME IN ('aoods','accessories','accessoriesitem')
--       AND COLUMN_NAME IN ('delivery','deliveryFlag','deliveryStatus')
--     ORDER BY TABLE_SCHEMA, TABLE_NAME;
--   执行后核查(期望 aoods→deliveryFlag / accessories→deliveryStatus / accessoriesitem→deliveryFlag):
--     同上语句
-- 幂等性: 非幂等, 重跑报 Unknown column 'delivery' 无害(说明已改过, 先跑执行前核查确认)
-- =====================================================================

ALTER TABLE `data`.`aoods`
  CHANGE COLUMN `delivery` `deliveryFlag` TINYINT NOT NULL DEFAULT 0 COMMENT '配送标识(是否需要配送): 0自配 1配送';

ALTER TABLE `inventory`.`accessories`
  CHANGE COLUMN `delivery` `deliveryStatus` TINYINT NOT NULL DEFAULT 0 COMMENT '配送状态: 0自配 1配送';

ALTER TABLE `inventory`.`accessoriesitem`
  CHANGE COLUMN `delivery` `deliveryFlag` TINYINT NOT NULL DEFAULT 0 COMMENT '配送标识(创建时按caid快照data.aoods.deliveryFlag)';
