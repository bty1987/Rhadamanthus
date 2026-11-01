-- ============================================================================
-- 文件: SALES_ORDER_2607260626_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2607260626(sid=1488614, 装修单2605240311, 客户772026)
--   撤款事故——一刀切还原。T=2026-11-01 10:26:27(撤款翻转)。
--   本单最简: T后客户钱包仅翻转自身一行, 无消费/无新单——纯还原, 无废单。
--
-- 时间线与处置:
--   07-26 15:47  正常收款5,899,000(收据1478755,advance渠道,fullpayTime秒级锚定)  [保留]
--   11-01 10:23  退货单427785(1,400,000,"异品牌换货")确认→退款行2237202(未执行)   [T前真业务,保留待执行]
--   11-01 10:26  撤款翻转(+5,899,000,收据1541616/流水SA2162437R/预付收据2920233)  [还原]
--
-- 资金效果: 钱包 36,715,000 → 30,816,000 (= 撤款前底数, 分毫不差)
--   待执行退款行1,400,000由店方后续执行: 30,816,000+1,400,000=32,216,000, 无风险。
--
-- 前置条件: V1~V3 逐条核对;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2607260626_payment        AS SELECT * FROM payment.payment        WHERE pid=2970189;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607260626_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid=2162437;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607260626_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1478755,1541616);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607260626_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId=2920233;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607260626_sales          AS SELECT * FROM sales.sales            WHERE sid=1488614;
-- 备份行数自检(预期: 1/1/2/1/1, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2607260626_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2607260626_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2607260626_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607260626_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607260626_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期36,715,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2605240311';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2162437 AND type=5 AND status=2 AND srid=1541616;
-- V3 预期1行: 待执行退款行在位(保留项)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2237202 AND status=0;

START TRANSACTION;

-- ① 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2970189 AND uniqueid = 'SA2162437R' AND recharge = 5899000 AND type = 3;
-- ② 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2920233 AND transfer = 5899000 AND collectTime = '2026-11-01 10:26:27';
-- ③ 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1541616 AND type = 1 AND realMoney = 5899000
   AND comment = '销售单:2607260626,款项撤款,退回主材预付款余额5899000';
-- ④ 补款行还原(5→3, 收据回原始收款1478755) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1478755
 WHERE spid = 2162437 AND sid = 1488614 AND type = 5 AND status = 2 AND srid = 1541616;
-- ⑤ 钱包扣回翻转金额(-5,899,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 5899000
 WHERE orderId = '2605240311' AND materialBalance = 36715000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期30,816,000 且 = 客户末笔流水余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2605240311';
-- SELECT balance FROM payment.payment WHERE customerId=772026 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1478755
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1488614 ORDER BY spid;
-- W3 预期均0行: 翻转三件套已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid='SA2162437R';
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId=2920233;
-- SELECT COUNT(*) FROM payment.salesreceipt   WHERE srid=1541616;
-- W4 预期1行: 待执行退款行仍在(保留项)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2237202;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2607260626_salespayment;
-- R2 收据/预付收据: 从 tempbase.bak_2607260626_salesreceipt / bak_2607260626_advancereceipt 回插 1541616/2920233
-- R3 流水: 从 tempbase.bak_2607260626_payment 回插(cuid/aid 以实查为准)
-- R4 钱包回退: UPDATE payment.advancepayment SET materialBalance=36715000 WHERE orderId='2605240311';
