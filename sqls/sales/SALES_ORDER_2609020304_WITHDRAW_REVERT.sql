-- ============================================================================
-- 文件: SALES_ORDER_2609020304_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2609020304(sid=1508539, 箭牌卫浴, 装修单2606240133, 客户785063)
--   撤款事故——一刀切还原。T=2026-10-31 13:16:45(撤款翻转)。
--
-- 时间线与处置:
--   09-02 15:35  正常收款8,800,000(收据1501619,advance渠道,fullpayTime秒级锚定)  [保留]
--   10-31 12:38  退货单427715(2,590,000,"异品牌换货")确认→退款行2235744(未执行)  [T前真业务,保留待执行]
--   10-31 13:16  撤款翻转(+8,800,000,收据1540225/流水SA2189282R/预付收据2917372)  [还原]
--   10-31 17:15  新建2610311047(2,700,000)→17:27落款                            [作废→废单]
--
-- 资金效果: 钱包 7,505,000 → 1,405,000
--   = -8,800,000(撤还原) +2,700,000(作废落款); 复算= 撤款前底数1,405,000 ✓ 分毫不差
--   待执行退款行2,590,000由店方后续执行: 1,405,000+2,590,000=3,995,000, 无风险。
--
-- 前置条件: V1~V3 逐条核对; 2610311047未发货(已佐证0行);【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2609020304_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2967164,2968466);
CREATE TABLE IF NOT EXISTS tempbase.bak_2609020304_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid IN (2189282,2236627);
CREATE TABLE IF NOT EXISTS tempbase.bak_2609020304_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1501619,1540225,1540951);
CREATE TABLE IF NOT EXISTS tempbase.bak_2609020304_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId IN (2917372,2918618);
CREATE TABLE IF NOT EXISTS tempbase.bak_2609020304_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid=1775648;
CREATE TABLE IF NOT EXISTS tempbase.bak_2609020304_balanceitem    AS SELECT * FROM sales.salesbalanceitem WHERE sbid=1775648;
CREATE TABLE IF NOT EXISTS tempbase.bak_2609020304_sales          AS SELECT * FROM sales.sales            WHERE sid IN (1508539,1544061);
-- 备份行数自检(预期: 2/2/3/2/1/1/2, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2609020304_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2609020304_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2609020304_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2609020304_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2609020304_salesbalance;
-- SELECT COUNT(*) FROM tempbase.bak_2609020304_balanceitem;
-- SELECT COUNT(*) FROM tempbase.bak_2609020304_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期7,505,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2606240133';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2189282 AND type=5 AND status=2 AND srid=1540225;
-- V3 预期1行: 待执行退款行在位(保留项)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2235744 AND status=0;

START TRANSACTION;

-- ── A. 撤款翻转还原 ──
-- A1 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2967164 AND uniqueid = 'SA2189282R' AND recharge = 8800000 AND type = 3;
-- A2 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2917372 AND transfer = 8800000 AND collectTime = '2026-10-31 13:16:45';
-- A3 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540225 AND type = 1 AND realMoney = 8800000
   AND comment = '销售单:2609020304,款项撤款,退回主材预付款余额8800000';
-- A4 补款行还原(5→3, 收据回原始收款1501619) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1501619
 WHERE spid = 2189282 AND sid = 1508539 AND type = 5 AND status = 2 AND srid = 1540225;

-- ── B. T后单作废(2610311047, T后新建→废单) —— 预期各1行
DELETE FROM payment.payment        WHERE pid = 2968466 AND uniqueid = 'SA2236627' AND recharge = 2700000;
DELETE FROM payment.advancereceipt WHERE arId = 2918618 AND transfer = 2700000;
DELETE FROM payment.salesreceipt   WHERE srid = 1540951 AND type = 0;
DELETE FROM payment.salespayment   WHERE spid = 2236627 AND sid = 1544061 AND type = 3 AND status = 2;
DELETE FROM sales.salesbalanceitem WHERE sbid = 1775648;
DELETE FROM sales.salesbalance     WHERE sbid = 1775648 AND sid = 1544061;
UPDATE sales.sales SET status = 4, fullpay = 0, fullpayStatus = -1
 WHERE sid = 1544061 AND status = 0;

-- ── C. 钱包(-8,800,000 +2,700,000 = -6,100,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 6100000
 WHERE orderId = '2606240133' AND materialBalance = 7505000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期1,405,000 且 = 客户末笔流水余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2606240133';
-- SELECT balance FROM payment.payment WHERE customerId=785063 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1501619
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1508539 ORDER BY spid;
-- W3 预期: 2610311047 status=4
-- SELECT sid,no,status,fullpay,fullpayStatus FROM sales.sales WHERE sid=1544061;
-- W4 预期均0行: 翻转/落款全部清除
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid IN ('SA2189282R','SA2236627');
-- SELECT COUNT(*) FROM payment.salesreceipt WHERE srid IN (1540225,1540951);
-- SELECT COUNT(*) FROM payment.salespayment WHERE spid=2236627;
-- SELECT COUNT(*) FROM sales.salesbalance   WHERE sbid=1775648;
-- W5 预期1行: 待执行退款行仍在(保留项)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2235744;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2609020304_salespayment WHERE spid=2189282;
--    单头复活: UPDATE sales.sales SET status=0, fullpay=2700000, fullpayStatus=2 WHERE sid=1544061;
--    落款项行: 从 bak_2609020304_salespayment 回插 2236627
-- R2 收据/预付收据/厂结单/厂结明细: 从对应 bak 表回插
-- R3 流水两行: 从 tempbase.bak_2609020304_payment 回插(cuid/aid 以实查为准)
-- R4 钱包回退: UPDATE payment.advancepayment SET materialBalance=7505000 WHERE orderId='2606240133';
