-- =============================================================================
-- decorationinfo 落客源三方字段(来源方/对接人)
-- 日期: 2026-10-09
-- 背景: 客源(customer.customersource)的来源方(source)/对接人(contact)在客源转装修单
--       时未随单落库,装修单侧无法追溯三方渠道信息;本 DDL 为 decoration.decorationinfo
--       加同名列,客源转单链路(tranCustomerChance/客源转单审批/机会转单)写前带出。
-- 列型: 与 customersource.source/contact 同为 varchar(64)(生产实测值:物业/中介/海卓地产等
--       短渠道名+对接人姓名,181858 行全量分布最长值远小于 64)
-- 上线序: 🔴 本 SQL 先于 decoration/customer/approval 三 jar(PO 映射新列,先 jar 后 SQL =
--         Unknown column,参照 CONSTRUCTIONNODE_ADD_PCNID 测试环境踩坑先例)
-- 幂等性: ALTER 前判断列存在,重复执行安全
-- =============================================================================

-- ---------- 1. 加 source/contact 两列 ----------
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'decoration' AND TABLE_NAME = 'decorationinfo' AND COLUMN_NAME = 'source');
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE `decoration`.`decorationinfo` ADD COLUMN `source` VARCHAR(64) NULL DEFAULT NULL COMMENT ''来源方(客源三方)'' AFTER `referOrderId`, ADD COLUMN `contact` VARCHAR(64) NULL DEFAULT NULL COMMENT ''对接人(客源三方)'' AFTER `source`',
    'SELECT ''source already exists'' AS msg');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------- 2. 执行后核验 ----------
-- SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='decoration' AND TABLE_NAME='decorationinfo' AND COLUMN_NAME IN ('source','contact');  应=2行
