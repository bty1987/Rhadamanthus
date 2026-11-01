-- ============================================================================
-- 文件: SALES_ORDER_2610210593_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2610210593(sid=1536914, 装修单2610130151, 客户828586)
--   撤款事故——一刀切还原。T=2026-11-01 13:57:23(撤款翻转)。
--   本单为"翻转+T后全额退货单"型(与2609260335同款): 退货单427839系T后56分钟补建
--   ("同品牌换货"退整单22,500,000), 按一刀切原则作废, 商品行按退货明细回填, 单头复原。
--
-- 时间线与处置:
--   10-24 10:21  正常收款22,500,000(收据1534288,advance渠道,fullpayTime秒级锚定)  [保留]
--   10-25 10:56  厂结单1769817(20,250,000)                                     [T前,保留]
--   11-01 13:57  撤款翻转(+22,500,000,收据1541785/流水SA2226854R/预付收据2920587) [还原]
--   11-01 14:53  退货单427839(全额22,500,000,"同品牌换货")确认→退款行2237541(未执行) [T后作废]
--     └ 含: 退货明细7行(720162~720168)/退货结算单1776370(-22,500,000)
--
-- 资金效果: 钱包 22,500,000 → 0 (= 撤款前底数, 分毫不差; T后无其他消费)
--
-- 前置条件: V1~V3 逐条核对;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_payment        AS SELECT * FROM payment.payment        WHERE pid=2970572;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid IN (2226854,2237541);
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1534288,1541785);
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId=2920587;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_salesrefunds   AS SELECT * FROM sales.salesrefunds     WHERE rid=427839;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_refundsitem    AS SELECT * FROM sales.salesrefundsitem WHERE rid=427839;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid=1776370;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_balanceitem    AS SELECT * FROM sales.salesbalanceitem WHERE sbid=1776370;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_sales          AS SELECT * FROM sales.sales            WHERE sid=1536914;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610210593_salesitem      AS SELECT * FROM sales.salesitem        WHERE sid=1536914;
-- 备份行数自检(预期: 1/2/2/1/1/7/1/2/1/7, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_salesrefunds;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_refundsitem;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_salesbalance;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_balanceitem;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_sales;
-- SELECT COUNT(*) FROM tempbase.bak_2610210593_salesitem;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期22,500,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2610130151';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2226854 AND type=5 AND status=2 AND srid=1541785;
-- V3 预期1行: T后退款行原样(未执行)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2237541 AND type=4 AND status=0 AND srid IS NULL;

START TRANSACTION;

-- ── A. 撤款翻转还原 ──
-- A1 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2970572 AND uniqueid = 'SA2226854R' AND recharge = 22500000 AND type = 3;
-- A2 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2920587 AND transfer = 22500000 AND collectTime = '2026-11-01 13:57:23';
-- A3 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1541785 AND type = 1 AND realMoney = 22500000
   AND comment = '销售单:2610210593,款项撤款,退回主材预付款余额22500000';
-- A4 补款行还原(5→3, 收据回原始收款1534288) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1534288
 WHERE spid = 2226854 AND sid = 1536914 AND type = 5 AND status = 2 AND srid = 1541785;

-- ── B. T后退货链作废 ──
-- B1 删退款行/退货明细/退货单/退货结算单明细/退货结算单 —— 预期各1行/7行/1行/2行/1行
DELETE FROM payment.salespayment   WHERE spid = 2237541 AND sid = 1536914 AND type = 4 AND rid = 427839;
DELETE FROM sales.salesrefundsitem WHERE rid = 427839;
DELETE FROM sales.salesrefunds     WHERE rid = 427839 AND sid = 1536914 AND status = 0;
DELETE FROM sales.salesbalanceitem WHERE sbid = 1776370;
DELETE FROM sales.salesbalance     WHERE sbid = 1776370 AND rid = 427839;

-- ── C. 商品行回填(按退货明细逆向: num/total恢复) —— 预期各影响1行, 共7行
UPDATE sales.salesitem SET num = 1000, total = 2652000 WHERE siid = 3402354 AND num = 0;
UPDATE sales.salesitem SET num = 2000, total = 4336000 WHERE siid = 3402355 AND num = 0;
UPDATE sales.salesitem SET num = 1000, total = 2210000 WHERE siid = 3402356 AND num = 0;
UPDATE sales.salesitem SET num = 4000, total = 960000  WHERE siid = 3402357 AND num = 0;
UPDATE sales.salesitem SET num = 1000, total = 7235000 WHERE siid = 3402358 AND num = 0;
UPDATE sales.salesitem SET num = 2000, total = 3600000 WHERE siid = 3402359 AND num = 0;
UPDATE sales.salesitem SET num = 1000, total = 1507000 WHERE siid = 3402360 AND num = 0;

-- ── D. 单头复原(amount=Σitems=22,500,000; status全退→正常) —— 预期影响1行
UPDATE sales.sales
   SET amount = 22500000, status = 0
 WHERE sid = 1536914 AND amount = 0 AND status = 2;

-- ── E. 钱包扣回翻转金额(-22,500,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 22500000
 WHERE orderId = '2610130151' AND materialBalance = 22500000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期0 且 = 客户末笔流水余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2610130151';
-- SELECT balance FROM payment.payment WHERE customerId=828586 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1534288
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1536914 ORDER BY spid;
-- W3 预期均0行: 翻转/T后退货链已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid='SA2226854R';
-- SELECT COUNT(*) FROM payment.salesreceipt WHERE srid=1541785;
-- SELECT COUNT(*) FROM payment.salespayment WHERE spid=2237541;
-- SELECT COUNT(*) FROM sales.salesrefunds   WHERE rid=427839;
-- SELECT COUNT(*) FROM sales.salesbalance   WHERE sbid=1776370;
-- W4 预期: 商品行7行num/total回填, Σtotal=22,500,000; 单头 amount=22,500,000/status=0
-- SELECT siid,num,total FROM sales.salesitem WHERE sid=1536914;
-- SELECT no,status,amount,total,fullpay,fullpayStatus FROM sales.sales WHERE sid=1536914;
-- W5 预期1行: T前厂结单仍在
-- SELECT sbid,total,vbalance,status FROM sales.salesbalance WHERE sid=1536914 AND rid IS NULL;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2610210593_salespayment WHERE spid=2226854;
-- R2 收据/预付收据/退货单/退货明细/退货结算单/退货结算明细: 从对应 bak 表回插
-- R3 流水: 从 tempbase.bak_2610210593_payment 回插(cuid/aid 以实查为准)
-- R4 商品行/单头: 从 tempbase.bak_2610210593_salesitem / bak_2610210593_sales 回插
-- R5 钱包回退: UPDATE payment.advancepayment SET materialBalance=22500000 WHERE orderId='2610130151';
