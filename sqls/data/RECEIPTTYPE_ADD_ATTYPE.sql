-- =====================================================================
-- data.receipttype 收据类型增加业务类型字段 atttype
-- =====================================================================
-- 需求: 收据类型挂业务类型(对应 decoration.typeness), payment 模块前台按
--       业务类型过滤收据类型时带出"通用 + 对应业务类型"的数据。
-- 取值: atttype SMALLINT, -1 = 通用(默认)。
--       🔴通用取 -1 不取 0——typeness 真实值域 0~15(生产实证 typeness=0
--       有 45.8 万单为最大业务群), 默认 0 会撞真实业务值。
-- 配套: fanglin-data-8.3.030.jar(PO/VO/Dao/Service/Action)。
--       接口 queryReceiptType / queryReceiptTypeByType 增加可选参数
--       receiptType.atttype: 传值 → WHERE atttype IN (值, -1);
--       不传 → 不加条件(存量页面行为零变化)。
--       pageReceiptType 管理页过滤白名单同步加 atttype。
-- ⚠️ ADD COLUMN 不幂等(重复执行报 Duplicate column), 执行前先查:
--   SELECT COLUMN_NAME FROM information_schema.COLUMNS
--    WHERE TABLE_SCHEMA='data' AND TABLE_NAME='receipttype' AND COLUMN_NAME='atttype';
-- 存量行: ADD COLUMN ... NOT NULL DEFAULT -1 会让全部现存行自动落 -1(通用),
--         无需单独刷数。
-- =====================================================================

ALTER TABLE `data`.`receipttype` ADD COLUMN `atttype` SMALLINT NOT NULL DEFAULT -1 COMMENT '业务类型(对应decoration.typeness, -1=通用)';

-- 核验: 现存行应全部为 -1
-- SELECT atttype, COUNT(*) FROM `data`.`receipttype` GROUP BY atttype;
