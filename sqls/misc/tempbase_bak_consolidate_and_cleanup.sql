-- =============================================================
-- 用途: tempbase.bak_* 备份表整合+清理(2026-11-15)
--       102张bak_表全部产生于2026-11-01撤款事故批次窗口(17:37~19:35),
--       按订单前缀分组含 2610250688fc / 2610311204sup / 2609260335redo 变体
-- 方案: ①有数据备份(54张/约156行)按源表归并进10张整合表
--         tempbase.bak_20261101_<源表>, 加 bak_source 列标注来源备份表,
--         多轮备份(fc/sup/redo变体)各自带label共存=时点快照不互斥
--       ②零行备份(48张)无回滚价值, 直接随原表一并删除
--       ③验证通过后 DROP 全部102张原表
-- 前置: 撤款事故已收官终验(2026-11-02); 整合表与原表逐表行数对账一致后才执行删除段
-- 回滚: 删除段执行前可随时 DROP 整合表回退(原表未动);
--       删除段执行后如需还原单表: 从 bak_20261101_<源表> WHERE bak_source='<原表>' 回插
-- 验证: 第三段对账查询, consolidated=sources 两侧一致才执行第四段
-- 注意: ①整合段重跑需先 DROP 10张整合表(ADD COLUMN 重跑会报列重复, bak_source NOT EXISTS 仅防INSERT重)
--       ②DROP 段表名为2026-11-15静态清单, 若此后新产生 bak_ 表不在清单内不受影响
-- =============================================================


-- ===== 源表: advancereceipt (备份13张, 合计18行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_advancereceipt LIKE tempbase.bak_2603180193_advancereceipt;
ALTER TABLE tempbase.bak_20261101_advancereceipt ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_advancereceipt SELECT t.*, 'bak_2603180193_advancereceipt' FROM tempbase.bak_2603180193_advancereceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_advancereceipt x WHERE x.bak_source = 'bak_2603180193_advancereceipt');
INSERT INTO tempbase.bak_20261101_advancereceipt SELECT t.*, 'bak_2607120490_advancereceipt' FROM tempbase.bak_2607120490_advancereceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_advancereceipt x WHERE x.bak_source = 'bak_2607120490_advancereceipt');
INSERT INTO tempbase.bak_20261101_advancereceipt SELECT t.*, 'bak_2607170196_advancereceipt' FROM tempbase.bak_2607170196_advancereceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_advancereceipt x WHERE x.bak_source = 'bak_2607170196_advancereceipt');
INSERT INTO tempbase.bak_20261101_advancereceipt SELECT t.*, 'bak_2607190721_advancereceipt' FROM tempbase.bak_2607190721_advancereceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_advancereceipt x WHERE x.bak_source = 'bak_2607190721_advancereceipt');
INSERT INTO tempbase.bak_20261101_advancereceipt SELECT t.*, 'bak_2609020304_advancereceipt' FROM tempbase.bak_2609020304_advancereceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_advancereceipt x WHERE x.bak_source = 'bak_2609020304_advancereceipt');
INSERT INTO tempbase.bak_20261101_advancereceipt SELECT t.*, 'bak_2610240246_advancereceipt' FROM tempbase.bak_2610240246_advancereceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_advancereceipt x WHERE x.bak_source = 'bak_2610240246_advancereceipt');
INSERT INTO tempbase.bak_20261101_advancereceipt SELECT t.*, 'bak_2610250688fc_advancereceipt' FROM tempbase.bak_2610250688fc_advancereceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_advancereceipt x WHERE x.bak_source = 'bak_2610250688fc_advancereceipt');

-- ===== 源表: balanceitem (备份10张, 合计31行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_balanceitem LIKE tempbase.bak_2603180193_balanceitem;
ALTER TABLE tempbase.bak_20261101_balanceitem ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_balanceitem SELECT t.*, 'bak_2603180193_balanceitem' FROM tempbase.bak_2603180193_balanceitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_balanceitem x WHERE x.bak_source = 'bak_2603180193_balanceitem');
INSERT INTO tempbase.bak_20261101_balanceitem SELECT t.*, 'bak_2607170196_balanceitem' FROM tempbase.bak_2607170196_balanceitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_balanceitem x WHERE x.bak_source = 'bak_2607170196_balanceitem');
INSERT INTO tempbase.bak_20261101_balanceitem SELECT t.*, 'bak_2607190721_balanceitem' FROM tempbase.bak_2607190721_balanceitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_balanceitem x WHERE x.bak_source = 'bak_2607190721_balanceitem');
INSERT INTO tempbase.bak_20261101_balanceitem SELECT t.*, 'bak_2610210593_balanceitem' FROM tempbase.bak_2610210593_balanceitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_balanceitem x WHERE x.bak_source = 'bak_2610210593_balanceitem');
INSERT INTO tempbase.bak_20261101_balanceitem SELECT t.*, 'bak_2610240246_balanceitem' FROM tempbase.bak_2610240246_balanceitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_balanceitem x WHERE x.bak_source = 'bak_2610240246_balanceitem');
INSERT INTO tempbase.bak_20261101_balanceitem SELECT t.*, 'bak_2610311204sup_balanceitem' FROM tempbase.bak_2610311204sup_balanceitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_balanceitem x WHERE x.bak_source = 'bak_2610311204sup_balanceitem');
INSERT INTO tempbase.bak_20261101_balanceitem SELECT t.*, 'bak_2609260335_redo_balanceitem' FROM tempbase.bak_2609260335_redo_balanceitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_balanceitem x WHERE x.bak_source = 'bak_2609260335_redo_balanceitem');

-- ===== 源表: payment (备份13张, 合计26行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_payment LIKE tempbase.bak_2603180193_payment;
ALTER TABLE tempbase.bak_20261101_payment ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2603180193_payment' FROM tempbase.bak_2603180193_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2603180193_payment');
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2607120490_payment' FROM tempbase.bak_2607120490_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2607120490_payment');
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2607170196_payment' FROM tempbase.bak_2607170196_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2607170196_payment');
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2607190667_payment' FROM tempbase.bak_2607190667_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2607190667_payment');
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2607190721_payment' FROM tempbase.bak_2607190721_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2607190721_payment');
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2609020304_payment' FROM tempbase.bak_2609020304_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2609020304_payment');
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2610240246_payment' FROM tempbase.bak_2610240246_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2610240246_payment');
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2610250688fc_payment' FROM tempbase.bak_2610250688fc_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2610250688fc_payment');
INSERT INTO tempbase.bak_20261101_payment SELECT t.*, 'bak_2609260335_redo_payment' FROM tempbase.bak_2609260335_redo_payment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_payment x WHERE x.bak_source = 'bak_2609260335_redo_payment');

-- ===== 源表: sales (备份14张, 合计15行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_sales LIKE tempbase.bak_2603180193_sales;
ALTER TABLE tempbase.bak_20261101_sales ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_sales SELECT t.*, 'bak_2603180193_sales' FROM tempbase.bak_2603180193_sales t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_sales x WHERE x.bak_source = 'bak_2603180193_sales');
INSERT INTO tempbase.bak_20261101_sales SELECT t.*, 'bak_2607120490_sales' FROM tempbase.bak_2607120490_sales t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_sales x WHERE x.bak_source = 'bak_2607120490_sales');
INSERT INTO tempbase.bak_20261101_sales SELECT t.*, 'bak_2607170196_sales' FROM tempbase.bak_2607170196_sales t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_sales x WHERE x.bak_source = 'bak_2607170196_sales');
INSERT INTO tempbase.bak_20261101_sales SELECT t.*, 'bak_2607190721_sales' FROM tempbase.bak_2607190721_sales t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_sales x WHERE x.bak_source = 'bak_2607190721_sales');
INSERT INTO tempbase.bak_20261101_sales SELECT t.*, 'bak_2609020304_sales' FROM tempbase.bak_2609020304_sales t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_sales x WHERE x.bak_source = 'bak_2609020304_sales');
INSERT INTO tempbase.bak_20261101_sales SELECT t.*, 'bak_2610240246_sales' FROM tempbase.bak_2610240246_sales t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_sales x WHERE x.bak_source = 'bak_2610240246_sales');

-- ===== 源表: salesbalance (备份11张, 合计6行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_salesbalance LIKE tempbase.bak_2603180193_salesbalance;
ALTER TABLE tempbase.bak_20261101_salesbalance ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_salesbalance SELECT t.*, 'bak_2603180193_salesbalance' FROM tempbase.bak_2603180193_salesbalance t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesbalance x WHERE x.bak_source = 'bak_2603180193_salesbalance');
INSERT INTO tempbase.bak_20261101_salesbalance SELECT t.*, 'bak_2607170196_salesbalance' FROM tempbase.bak_2607170196_salesbalance t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesbalance x WHERE x.bak_source = 'bak_2607170196_salesbalance');
INSERT INTO tempbase.bak_20261101_salesbalance SELECT t.*, 'bak_2610240246_salesbalance' FROM tempbase.bak_2610240246_salesbalance t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesbalance x WHERE x.bak_source = 'bak_2610240246_salesbalance');

-- ===== 源表: salespayment (备份14张, 合计19行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_salespayment LIKE tempbase.bak_2603180193_salespayment;
ALTER TABLE tempbase.bak_20261101_salespayment ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_salespayment SELECT t.*, 'bak_2603180193_salespayment' FROM tempbase.bak_2603180193_salespayment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salespayment x WHERE x.bak_source = 'bak_2603180193_salespayment');
INSERT INTO tempbase.bak_20261101_salespayment SELECT t.*, 'bak_2607120490_salespayment' FROM tempbase.bak_2607120490_salespayment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salespayment x WHERE x.bak_source = 'bak_2607120490_salespayment');
INSERT INTO tempbase.bak_20261101_salespayment SELECT t.*, 'bak_2607170196_salespayment' FROM tempbase.bak_2607170196_salespayment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salespayment x WHERE x.bak_source = 'bak_2607170196_salespayment');
INSERT INTO tempbase.bak_20261101_salespayment SELECT t.*, 'bak_2607190721_salespayment' FROM tempbase.bak_2607190721_salespayment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salespayment x WHERE x.bak_source = 'bak_2607190721_salespayment');
INSERT INTO tempbase.bak_20261101_salespayment SELECT t.*, 'bak_2609020304_salespayment' FROM tempbase.bak_2609020304_salespayment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salespayment x WHERE x.bak_source = 'bak_2609020304_salespayment');
INSERT INTO tempbase.bak_20261101_salespayment SELECT t.*, 'bak_2610210593_salespayment' FROM tempbase.bak_2610210593_salespayment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salespayment x WHERE x.bak_source = 'bak_2610210593_salespayment');
INSERT INTO tempbase.bak_20261101_salespayment SELECT t.*, 'bak_2610240246_salespayment' FROM tempbase.bak_2610240246_salespayment t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salespayment x WHERE x.bak_source = 'bak_2610240246_salespayment');

-- ===== 源表: salesreceipt (备份13张, 合计33行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_salesreceipt LIKE tempbase.bak_2603180193_salesreceipt;
ALTER TABLE tempbase.bak_20261101_salesreceipt ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2603180193_salesreceipt' FROM tempbase.bak_2603180193_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2603180193_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2607120490_salesreceipt' FROM tempbase.bak_2607120490_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2607120490_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2607170196_salesreceipt' FROM tempbase.bak_2607170196_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2607170196_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2607190667_salesreceipt' FROM tempbase.bak_2607190667_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2607190667_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2607190721_salesreceipt' FROM tempbase.bak_2607190721_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2607190721_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2607260626_salesreceipt' FROM tempbase.bak_2607260626_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2607260626_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2609020304_salesreceipt' FROM tempbase.bak_2609020304_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2609020304_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2609120785_salesreceipt' FROM tempbase.bak_2609120785_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2609120785_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2610210593_salesreceipt' FROM tempbase.bak_2610210593_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2610210593_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2610240246_salesreceipt' FROM tempbase.bak_2610240246_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2610240246_salesreceipt');
INSERT INTO tempbase.bak_20261101_salesreceipt SELECT t.*, 'bak_2611010312_salesreceipt' FROM tempbase.bak_2611010312_salesreceipt t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesreceipt x WHERE x.bak_source = 'bak_2611010312_salesreceipt');

-- ===== 源表: salesrefunds (备份5张, 合计0行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_salesrefunds LIKE tempbase.bak_2607120490_salesrefunds;
ALTER TABLE tempbase.bak_20261101_salesrefunds ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';

-- ===== 源表: refundsitem (备份4张, 合计14行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_refundsitem LIKE tempbase.bak_2607190721_refundsitem;
ALTER TABLE tempbase.bak_20261101_refundsitem ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_refundsitem SELECT t.*, 'bak_2607190721_refundsitem' FROM tempbase.bak_2607190721_refundsitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_refundsitem x WHERE x.bak_source = 'bak_2607190721_refundsitem');
INSERT INTO tempbase.bak_20261101_refundsitem SELECT t.*, 'bak_2610210593_refundsitem' FROM tempbase.bak_2610210593_refundsitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_refundsitem x WHERE x.bak_source = 'bak_2610210593_refundsitem');

-- ===== 源表: salesitem (备份5张, 合计14行) =====
CREATE TABLE IF NOT EXISTS tempbase.bak_20261101_salesitem LIKE tempbase.bak_2607190721_salesitem;
ALTER TABLE tempbase.bak_20261101_salesitem ADD COLUMN bak_source varchar(64) NOT NULL DEFAULT '';
INSERT INTO tempbase.bak_20261101_salesitem SELECT t.*, 'bak_2607190721_salesitem' FROM tempbase.bak_2607190721_salesitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesitem x WHERE x.bak_source = 'bak_2607190721_salesitem');
INSERT INTO tempbase.bak_20261101_salesitem SELECT t.*, 'bak_2610210593_salesitem' FROM tempbase.bak_2610210593_salesitem t WHERE NOT EXISTS (SELECT 1 FROM tempbase.bak_20261101_salesitem x WHERE x.bak_source = 'bak_2610210593_salesitem');

-- ===== 验证段: 两侧必须一致, 一致才执行删除段 =====
SELECT 'advancereceipt' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_advancereceipt) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2603180193_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607120490_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607170196_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607190667_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607190721_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607260626_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2609020304_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2609120785_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2610250688fc_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2611010312_advancereceipt) + (SELECT COUNT(*) FROM tempbase.bak_2609260335_redo_advancereceipt)) AS sources;
SELECT 'balanceitem' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_balanceitem) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2603180193_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2607170196_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2607190721_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2609020304_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2610250688_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2610250688fc_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2610311204sup_balanceitem) + (SELECT COUNT(*) FROM tempbase.bak_2609260335_redo_balanceitem)) AS sources;
SELECT 'payment' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_payment) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2603180193_payment) + (SELECT COUNT(*) FROM tempbase.bak_2607120490_payment) + (SELECT COUNT(*) FROM tempbase.bak_2607170196_payment) + (SELECT COUNT(*) FROM tempbase.bak_2607190667_payment) + (SELECT COUNT(*) FROM tempbase.bak_2607190721_payment) + (SELECT COUNT(*) FROM tempbase.bak_2607260626_payment) + (SELECT COUNT(*) FROM tempbase.bak_2609020304_payment) + (SELECT COUNT(*) FROM tempbase.bak_2609120785_payment) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_payment) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_payment) + (SELECT COUNT(*) FROM tempbase.bak_2610250688fc_payment) + (SELECT COUNT(*) FROM tempbase.bak_2611010312_payment) + (SELECT COUNT(*) FROM tempbase.bak_2609260335_redo_payment)) AS sources;
SELECT 'sales' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_sales) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2603180193_sales) + (SELECT COUNT(*) FROM tempbase.bak_2607120490_sales) + (SELECT COUNT(*) FROM tempbase.bak_2607170196_sales) + (SELECT COUNT(*) FROM tempbase.bak_2607190667_sales) + (SELECT COUNT(*) FROM tempbase.bak_2607190721_sales) + (SELECT COUNT(*) FROM tempbase.bak_2607260626_sales) + (SELECT COUNT(*) FROM tempbase.bak_2609020304_sales) + (SELECT COUNT(*) FROM tempbase.bak_2609120785_sales) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_sales) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_sales) + (SELECT COUNT(*) FROM tempbase.bak_2610250688_sales) + (SELECT COUNT(*) FROM tempbase.bak_2610250688fc_sales) + (SELECT COUNT(*) FROM tempbase.bak_2611010312_sales) + (SELECT COUNT(*) FROM tempbase.bak_2609260335_redo_sales)) AS sources;
SELECT 'salesbalance' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_salesbalance) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2603180193_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2607120490_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2607170196_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2607190721_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2609020304_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2610250688_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2610250688fc_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2610311204sup_salesbalance) + (SELECT COUNT(*) FROM tempbase.bak_2609260335_redo_salesbalance)) AS sources;
SELECT 'salespayment' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_salespayment) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2603180193_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2607120490_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2607170196_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2607190667_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2607190721_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2607260626_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2609020304_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2609120785_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2610250688_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2610250688fc_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2611010312_salespayment) + (SELECT COUNT(*) FROM tempbase.bak_2609260335_redo_salespayment)) AS sources;
SELECT 'salesreceipt' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_salesreceipt) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2603180193_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607120490_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607170196_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607190667_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607190721_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2607260626_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2609020304_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2609120785_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2610250688fc_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2611010312_salesreceipt) + (SELECT COUNT(*) FROM tempbase.bak_2609260335_redo_salesreceipt)) AS sources;
SELECT 'salesrefunds' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_salesrefunds) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2607120490_salesrefunds) + (SELECT COUNT(*) FROM tempbase.bak_2607190721_salesrefunds) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_salesrefunds) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_salesrefunds) + (SELECT COUNT(*) FROM tempbase.bak_2610250688_salesrefunds)) AS sources;
SELECT 'refundsitem' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_refundsitem) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2607190721_refundsitem) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_refundsitem) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_refundsitem) + (SELECT COUNT(*) FROM tempbase.bak_2610250688_refundsitem)) AS sources;
SELECT 'salesitem' AS src, (SELECT COUNT(*) FROM tempbase.bak_20261101_salesitem) AS consolidated, ((SELECT COUNT(*) FROM tempbase.bak_2607190721_salesitem) + (SELECT COUNT(*) FROM tempbase.bak_2610210593_salesitem) + (SELECT COUNT(*) FROM tempbase.bak_2610240246_salesitem) + (SELECT COUNT(*) FROM tempbase.bak_2610250688_salesitem) + (SELECT COUNT(*) FROM tempbase.bak_2610250688fc_salesitem)) AS sources;

-- ===== 删除段: 验证段全部一致后执行, 共102张 =====
DROP TABLE IF EXISTS tempbase.bak_2603180193_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2603180193_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2603180193_payment;
DROP TABLE IF EXISTS tempbase.bak_2603180193_sales;
DROP TABLE IF EXISTS tempbase.bak_2603180193_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2603180193_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2603180193_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2607120490_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2607120490_payment;
DROP TABLE IF EXISTS tempbase.bak_2607120490_sales;
DROP TABLE IF EXISTS tempbase.bak_2607120490_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2607120490_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2607120490_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2607120490_salesrefunds;
DROP TABLE IF EXISTS tempbase.bak_2607170196_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2607170196_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2607170196_payment;
DROP TABLE IF EXISTS tempbase.bak_2607170196_sales;
DROP TABLE IF EXISTS tempbase.bak_2607170196_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2607170196_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2607170196_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2607190667_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2607190667_payment;
DROP TABLE IF EXISTS tempbase.bak_2607190667_sales;
DROP TABLE IF EXISTS tempbase.bak_2607190667_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2607190667_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2607190721_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2607190721_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2607190721_payment;
DROP TABLE IF EXISTS tempbase.bak_2607190721_refundsitem;
DROP TABLE IF EXISTS tempbase.bak_2607190721_sales;
DROP TABLE IF EXISTS tempbase.bak_2607190721_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2607190721_salesitem;
DROP TABLE IF EXISTS tempbase.bak_2607190721_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2607190721_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2607190721_salesrefunds;
DROP TABLE IF EXISTS tempbase.bak_2607260626_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2607260626_payment;
DROP TABLE IF EXISTS tempbase.bak_2607260626_sales;
DROP TABLE IF EXISTS tempbase.bak_2607260626_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2607260626_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2609020304_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2609020304_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2609020304_payment;
DROP TABLE IF EXISTS tempbase.bak_2609020304_sales;
DROP TABLE IF EXISTS tempbase.bak_2609020304_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2609020304_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2609020304_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2609120785_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2609120785_payment;
DROP TABLE IF EXISTS tempbase.bak_2609120785_sales;
DROP TABLE IF EXISTS tempbase.bak_2609120785_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2609120785_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2609260335_redo_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2609260335_redo_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2609260335_redo_payment;
DROP TABLE IF EXISTS tempbase.bak_2609260335_redo_sales;
DROP TABLE IF EXISTS tempbase.bak_2609260335_redo_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2609260335_redo_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2609260335_redo_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2610210593_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2610210593_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2610210593_payment;
DROP TABLE IF EXISTS tempbase.bak_2610210593_refundsitem;
DROP TABLE IF EXISTS tempbase.bak_2610210593_sales;
DROP TABLE IF EXISTS tempbase.bak_2610210593_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2610210593_salesitem;
DROP TABLE IF EXISTS tempbase.bak_2610210593_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2610210593_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2610210593_salesrefunds;
DROP TABLE IF EXISTS tempbase.bak_2610240246_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2610240246_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2610240246_payment;
DROP TABLE IF EXISTS tempbase.bak_2610240246_refundsitem;
DROP TABLE IF EXISTS tempbase.bak_2610240246_sales;
DROP TABLE IF EXISTS tempbase.bak_2610240246_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2610240246_salesitem;
DROP TABLE IF EXISTS tempbase.bak_2610240246_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2610240246_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2610240246_salesrefunds;
DROP TABLE IF EXISTS tempbase.bak_2610250688_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2610250688_refundsitem;
DROP TABLE IF EXISTS tempbase.bak_2610250688_sales;
DROP TABLE IF EXISTS tempbase.bak_2610250688_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2610250688_salesitem;
DROP TABLE IF EXISTS tempbase.bak_2610250688_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2610250688_salesrefunds;
DROP TABLE IF EXISTS tempbase.bak_2610250688fc_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2610250688fc_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2610250688fc_payment;
DROP TABLE IF EXISTS tempbase.bak_2610250688fc_sales;
DROP TABLE IF EXISTS tempbase.bak_2610250688fc_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2610250688fc_salesitem;
DROP TABLE IF EXISTS tempbase.bak_2610250688fc_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2610250688fc_salesreceipt;
DROP TABLE IF EXISTS tempbase.bak_2610311204sup_balanceitem;
DROP TABLE IF EXISTS tempbase.bak_2610311204sup_salesbalance;
DROP TABLE IF EXISTS tempbase.bak_2611010312_advancereceipt;
DROP TABLE IF EXISTS tempbase.bak_2611010312_payment;
DROP TABLE IF EXISTS tempbase.bak_2611010312_sales;
DROP TABLE IF EXISTS tempbase.bak_2611010312_salespayment;
DROP TABLE IF EXISTS tempbase.bak_2611010312_salesreceipt;