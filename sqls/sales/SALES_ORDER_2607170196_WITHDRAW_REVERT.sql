-- ============================================================================
-- 文件: SALES_ORDER_2607170196_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2607170196(sid=1482125, 箭牌卫浴, 装修单2604180735, 客户756881)
--   撤款事故——一刀切还原。T=2026-10-31 15:32:16(撤款翻转)。
--
-- 事故时间线:
--   07-18 11:26  正常收款5,397,000(收据1472844,advance渠道,fullpayTime秒级锚定)   [保留]
--   10-31 13:51  退货单427676(2,998,000,"异品牌换货")确认→退款行2236103(未执行)    [T前真业务,保留待执行]
--   10-31 15:07  退货单427706(2,399,000,"异品牌换货")确认→退款行2236245(未执行)    [T前真业务,保留待执行]
--   10-31 15:32  撤款翻转(+5,397,000,收据1540633/流水SA2154124R/预付收据2918032)   [还原]
--   10-31 13:23  新建2610310381(6,300,000)→落款                                   [作废→废单]
--   10-31 13:56  新建2610310471(15,500,000)→落款                                  [作废→废单]
--
-- 资金效果: 钱包 1,815,000 → 18,218,000
--   = -5,397,000(撤还原) +6,300,000(作废落款) +15,500,000(作废落款)
--   复算: = 撤款前底数18,218,000 ✓ 分毫不差(本客户T后无其他行为)
--   两笔T前退款行(合计5,397,000)保留待执行——店方执行后钱包 18,218,000-5,397,000=12,821,000。
--
-- 前置条件: V1~V3 逐条核对; 两笔T后单未发货(已佐证0行);【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2607170196_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2967847,2967906,2968488);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607170196_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid IN (2154124,2235921,2235807);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607170196_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1472844,1540633,1540671,1540963);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607170196_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId IN (2918032,2918088,2918640);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607170196_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid IN (1775651,1775235);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607170196_balanceitem    AS SELECT * FROM sales.salesbalanceitem WHERE sbid IN (1775651,1775235);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607170196_sales          AS SELECT * FROM sales.sales            WHERE sid IN (1482125,1543483,1543393);
-- 备份行数自检(预期: 3/3/4/3/2/5/3, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2607170196_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2607170196_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2607170196_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607170196_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607170196_salesbalance;
-- SELECT COUNT(*) FROM tempbase.bak_2607170196_balanceitem;
-- SELECT COUNT(*) FROM tempbase.bak_2607170196_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期1,815,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2604180735';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2154124 AND type=5 AND status=2 AND srid=1540633;
-- V3 预期各1行: 两笔落款项行原样
-- SELECT spid,status,srid FROM payment.salespayment WHERE spid IN (2235921,2235807);

START TRANSACTION;

-- ── A. 撤款翻转还原 ──
-- A1 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2967847 AND uniqueid = 'SA2154124R' AND recharge = 5397000 AND type = 3;
-- A2 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2918032 AND transfer = 5397000 AND collectTime = '2026-10-31 15:32:16';
-- A3 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540633 AND type = 1 AND realMoney = 5397000
   AND comment = '销售单:2607170196,款项撤款,退回主材预付款余额5397000';
-- A4 补款行还原(5→3, 收据回原始收款1472844) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1472844
 WHERE spid = 2154124 AND sid = 1482125 AND type = 5 AND status = 2 AND srid = 1540633;

-- ── B. T后两单作废(均为T后新建→废单) ──
-- B1 2610310381(6,300,000) —— 预期各1行(厂结明细3行)
DELETE FROM payment.payment        WHERE pid = 2968488 AND uniqueid = 'SA2235807' AND recharge = 6300000;
DELETE FROM payment.advancereceipt WHERE arId = 2918640 AND transfer = 6300000;
DELETE FROM payment.salesreceipt   WHERE srid = 1540963 AND type = 0;
DELETE FROM payment.salespayment   WHERE spid = 2235807 AND sid = 1543393 AND type = 3 AND status = 2;
DELETE FROM sales.salesbalanceitem WHERE sbid = 1775651;
DELETE FROM sales.salesbalance     WHERE sbid = 1775651 AND sid = 1543393;
UPDATE sales.sales SET status = 4, fullpay = 0, fullpayStatus = -1
 WHERE sid = 1543393 AND status = 0;
-- B2 2610310471(15,500,000) —— 预期各1行(厂结明细2行)
DELETE FROM payment.payment        WHERE pid = 2967906 AND uniqueid = 'SA2235921' AND recharge = 15500000;
DELETE FROM payment.advancereceipt WHERE arId = 2918088 AND transfer = 15500000;
DELETE FROM payment.salesreceipt   WHERE srid = 1540671 AND type = 0;
DELETE FROM payment.salespayment   WHERE spid = 2235921 AND sid = 1543483 AND type = 3 AND status = 2;
DELETE FROM sales.salesbalanceitem WHERE sbid = 1775235;
DELETE FROM sales.salesbalance     WHERE sbid = 1775235 AND sid = 1543483;
UPDATE sales.sales SET status = 4, fullpay = 0, fullpayStatus = -1
 WHERE sid = 1543483 AND status = 0;

-- ── C. 钱包(-5,397,000 +6,300,000 +15,500,000 = +16,403,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance + 16403000
 WHERE orderId = '2604180735' AND materialBalance = 1815000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期18,218,000 且 = 末笔流水余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2604180735';
-- SELECT balance FROM payment.payment WHERE customerId=756881 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1472844
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1482125 ORDER BY spid;
-- W3 预期: 两笔T后单均 status=4
-- SELECT sid,no,status,fullpay,fullpayStatus FROM sales.sales WHERE sid IN (1543483,1543393);
-- W4 预期均0行: 翻转/落款全部清除
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid IN ('SA2154124R','SA2235807','SA2235921');
-- SELECT COUNT(*) FROM payment.salesreceipt WHERE srid IN (1540633,1540671,1540963);
-- SELECT COUNT(*) FROM payment.salespayment WHERE spid IN (2235921,2235807);
-- SELECT COUNT(*) FROM sales.salesbalance   WHERE sbid IN (1775651,1775235);
-- W5 预期2行: 两笔T前待执行退款行仍在(保留项)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid IN (2236103,2236245);

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2607170196_salespayment WHERE spid=2154124;
--    两单头复活: UPDATE sales.sales SET status=0, fullpay=原值, fullpayStatus=2 WHERE sid IN (1543483,1543393);
--    落款项行: 从 bak_2607170196_salespayment 回插 2235921/2235807
-- R2 收据/预付收据/厂结单/厂结明细: 从对应 bak 表回插
-- R3 流水三行: 从 tempbase.bak_2607170196_payment 回插(cuid/aid 以实查为准)
-- R4 钱包回退: UPDATE payment.advancepayment SET materialBalance=1815000 WHERE orderId='2604180735';
