-- ============================================================================
-- 文件: SALES_ORDER_2611010312_WITHDRAW_REVERT.sql
-- 库: 生产(payment)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2611010312(sid=1544824, company=9(流水口径)/11(单头口径), 装修单2609180142, 客户820798)
--   撤款事故——一刀切还原(纯翻转还原型, 同2607190667/2607260626/2609120785)。
--   用户拍板: 不等店方表态, 直接还原。T=2026-11-01 17:46:37(撤款翻转)。
--
-- 时间线与处置:
--   11-01 14:30  建单893(收据1542077,advance渠道,17:27落款,fullpayTime秒级锚定)   [保留]
--   11-01 17:27  落款消费-893(流水SA2237509)                                    [T前,保留]
--   11-01 17:46  撤款翻转(+893,000,收据1542124/流水SA2237509R/预付收据2921249,操作人齐辉) [还原]
--
-- 本单特征: 翻转发生在落款之后(19分钟)——单据已付状态与资金回退矛盾, 翻转=误操作。
--   T后无任何流水(无快照同步)、无退货单(无回填)、钱包为正(纯扣回)。
--
-- 资金效果: 钱包 23,721,000 → 22,828,000
--   = 撤款前余额(=流水SA2237509快照22,828,000), 分毫不差; 单头fullpayStatus=2在补款行还原后重新为真。
--
-- 前置条件: V1~V3 逐条核对;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2611010312_payment        AS SELECT * FROM payment.payment        WHERE pid=2971253;
CREATE TABLE IF NOT EXISTS tempbase.bak_2611010312_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid=2237509;
CREATE TABLE IF NOT EXISTS tempbase.bak_2611010312_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1542077,1542124);
CREATE TABLE IF NOT EXISTS tempbase.bak_2611010312_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId=2921249;
CREATE TABLE IF NOT EXISTS tempbase.bak_2611010312_sales          AS SELECT * FROM sales.sales            WHERE sid=1544824;
-- 备份行数自检(预期: 1/1/2/1/1, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2611010312_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2611010312_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2611010312_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2611010312_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2611010312_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期23,721,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2609180142';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2237509 AND type=5 AND status=2 AND srid=1542124;
-- V3 预期0行: 翻转后无新流水(有则停下核实)
-- SELECT COUNT(*) FROM payment.payment WHERE customerId=820798 AND pid>2971253;

START TRANSACTION;

-- ① 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2971253 AND uniqueid = 'SA2237509R' AND recharge = 893000 AND type = 3;
-- ② 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2921249 AND transfer = 893000 AND collectTime = '2026-11-01 17:46:37';
-- ③ 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1542124 AND type = 1 AND realMoney = 893000
   AND comment = '销售单:2611010312,款项撤款,退回主材预付款余额893000';
-- ④ 补款行还原(5→3, 收据回原始收款1542077) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1542077
 WHERE spid = 2237509 AND sid = 1544824 AND type = 5 AND status = 2 AND srid = 1542124;
-- ⑤ 钱包扣回翻转金额(-893,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 893000
 WHERE orderId = '2609180142' AND materialBalance = 23721000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期22,828,000 且 = 有效流水末笔(SA2237509)余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2609180142';
-- SELECT balance FROM payment.payment WHERE customerId=820798 AND status=2 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1542077
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1544824;
-- W3 预期均0行: 翻转三件套已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid='SA2237509R';
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId=2921249;
-- SELECT COUNT(*) FROM payment.salesreceipt   WHERE srid=1542124;
-- W4 预期1行: 原始收据在位
-- SELECT srid,collectTime,advance FROM payment.salesreceipt WHERE srid=1542077;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2611010312_salespayment;
-- R2 收据/预付收据: 从 tempbase.bak_2611010312_salesreceipt 回插1542124 / bak_2611010312_advancereceipt 回插2921249
-- R3 流水: INSERT INTO payment.payment SELECT * FROM tempbase.bak_2611010312_payment;
-- R4 钱包回退: UPDATE payment.advancepayment SET materialBalance=23721000 WHERE orderId='2609180142';
