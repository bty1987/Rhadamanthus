-- ============================================================================
-- 文件: SALES_ORDER_2609120785_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2609120785(sid=1514238, 装修单2604180717, 客户756938)
--   撤款事故——一刀切还原。T=2026-10-31 11:46:46(撤款翻转)。
--   本单纯还原: T后客户钱包仅翻转自身一行, 无消费/无新单——无废单。
--
-- 时间线与处置:
--   09-12 18:12  正常收款10,300,000(收据1508000,advance渠道,fullpayTime秒级锚定)  [保留]
--   09-13 14:15  退货单420889(3,801,000,"同品牌换货")确认→退款行2198317(未执行)   [T前真业务,保留待执行]
--   10-31 11:46  撤款翻转(+10,300,000,收据1540138/流水SA2197064R/预付收据2917168)  [还原]
--
-- 资金效果: 钱包 10,300,000 → 0 (= 撤款前底数, 分毫不差)
--   待执行退款行3,801,000由店方后续执行: 0+3,801,000=3,801,000, 无风险。
--
-- 前置条件: V1~V3 逐条核对;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2609120785_payment        AS SELECT * FROM payment.payment        WHERE pid=2966940;
CREATE TABLE IF NOT EXISTS tempbase.bak_2609120785_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid=2197064;
CREATE TABLE IF NOT EXISTS tempbase.bak_2609120785_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1508000,1540138);
CREATE TABLE IF NOT EXISTS tempbase.bak_2609120785_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId=2917168;
CREATE TABLE IF NOT EXISTS tempbase.bak_2609120785_sales          AS SELECT * FROM sales.sales            WHERE sid=1514238;
-- 备份行数自检(预期: 1/1/2/1/1, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2609120785_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2609120785_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2609120785_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2609120785_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2609120785_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期10,300,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2604180717';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2197064 AND type=5 AND status=2 AND srid=1540138;
-- V3 预期1行: 待执行退款行在位(保留项)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2198317 AND status=0;

START TRANSACTION;

-- ① 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2966940 AND uniqueid = 'SA2197064R' AND recharge = 10300000 AND type = 3;
-- ② 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2917168 AND transfer = 10300000 AND collectTime = '2026-10-31 11:46:46';
-- ③ 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540138 AND type = 1 AND realMoney = 10300000
   AND comment = '销售单:2609120785,款项撤款,退回主材预付款余额10300000';
-- ④ 补款行还原(5→3, 收据回原始收款1508000) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1508000
 WHERE spid = 2197064 AND sid = 1514238 AND type = 5 AND status = 2 AND srid = 1540138;
-- ⑤ 钱包扣回翻转金额(-10,300,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 10300000
 WHERE orderId = '2604180717' AND materialBalance = 10300000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期0 且 = 客户末笔流水余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2604180717';
-- SELECT balance FROM payment.payment WHERE customerId=756938 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1508000
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1514238 ORDER BY spid;
-- W3 预期均0行: 翻转三件套已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid='SA2197064R';
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId=2917168;
-- SELECT COUNT(*) FROM payment.salesreceipt   WHERE srid=1540138;
-- W4 预期1行: 待执行退款行仍在(保留项)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2198317;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2609120785_salespayment;
-- R2 收据/预付收据: 从 tempbase.bak_2609120785_salesreceipt / bak_2609120785_advancereceipt 回插 1540138/2917168
-- R3 流水: 从 tempbase.bak_2609120785_payment 回插(cuid/aid 以实查为准)
-- R4 钱包回退: UPDATE payment.advancepayment SET materialBalance=10300000 WHERE orderId='2604180717';
