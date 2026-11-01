-- ============================================================================
-- 文件: SALES_ORDER_2607120490_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2607120490(sid=1479942, 装修单2512130126, 客户722167)
--   撤款事故——一刀切还原(第一阶段: 撤款翻转还原)。T=2026-10-31 12:14:20。
--
-- 事故时间线:
--   07-12 15:07  正常收款51,300,000(收据1469559,advance渠道,fullpayTime秒级锚定)  [保留]
--   10-16        退货退款10,735,000执行(退货单425694"退剩余",T前)                [保留]
--   10-31 11:27  退货单427632"退剩余"1,238,000确认→12:01退款行2235677            [T前真业务,保留]
--   10-31 12:14  撤款翻转(+51,300,000,收据1540172/流水SA2151021R/预付收据2917227)  [还原]
--   10-31 12:14  退款行2235677执行(+1,238,000,收据1540173/流水SA2235677R)         [保留:T前退款行的执行]
--   10-31 13:04  新建换购单2610310355(39,325,785,不同商品)→13:54落款→当天发货确认  [保留:实物已交付]
--   10-31 13:51  退货单427677(39,325,000,"同品牌换货",未确认,spid=0)             [店方页面确认走正常流程]
--
-- 资金效果(本脚本): 钱包 13,223,000 → -38,077,000(中间态!)
--   店方页面确认427677→生成退款行→执行(+39,325,000)后: 1,248,000
--   = 撤款前底数10,000 + T前退款1,238,000, 分毫不差; 换购单39,325,785已交付,由退货款对冲。
--
-- ⚠ 中间态为负(-38,077,000)属预期: 427677确认+执行前账面透支, 完成后归正。
--    427677确认后请立即联系出最终执行脚本或页面执行退款行。
--
-- 前置条件: V1~V3 逐条核对;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2967007,2967008);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid=2151021;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1469559,1540172);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId=2917227;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_sales          AS SELECT * FROM sales.sales            WHERE sid=1479942;
-- 备份行数自检(预期: 2/1/2/1/1, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期13,223,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2512130126';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2151021 AND type=5 AND status=2 AND srid=1540172;
-- V3 预期1行: T前退款执行流水在位(保留项)
-- SELECT pid,balance FROM payment.payment WHERE uniqueid='SA2235677R';

START TRANSACTION;

-- ① 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2967007 AND uniqueid = 'SA2151021R' AND recharge = 51300000 AND type = 3;
-- ② 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2917227 AND transfer = 51300000 AND collectTime = '2026-10-31 12:14:20';
-- ③ 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540172 AND type = 1 AND realMoney = 51300000
   AND comment = '销售单:2607120490,款项撤款,退回主材预付款余额51300000';
-- ④ 补款行还原(5→3, 收据回原始收款1469559) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1469559
 WHERE spid = 2151021 AND sid = 1479942 AND type = 5 AND status = 2 AND srid = 1540172;
-- ⑤ T前退款执行流水快照同步 —— 预期影响1行
UPDATE payment.payment
   SET balance = 1248000
 WHERE pid = 2967008 AND uniqueid = 'SA2235677R' AND balance = 52548000;
-- ⑥ 钱包扣回翻转金额(-51,300,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 51300000
 WHERE orderId = '2512130126' AND materialBalance = 13223000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期-38,077,000(中间态) 且 = 末笔流水(SA2235677R)余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2512130126';
-- SELECT balance FROM payment.payment WHERE customerId=722167 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1469559
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE spid=2151021;
-- W3 预期均0行: 翻转三件套已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid='SA2151021R';
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId=2917227;
-- SELECT COUNT(*) FROM payment.salesreceipt   WHERE srid=1540172;
-- W4 预期1行: T前退款执行链完好(保留项)
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2235677;
-- SELECT rid,status FROM sales.salesrefunds WHERE rid=427632;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2607120490_salespayment;
-- R2 收据/预付收据: 同法从 tempbase.bak_2607120490_salesreceipt / bak_2607120490_advancereceipt 回插
-- R3 流水:
-- INSERT INTO payment.payment (pid,arId,uniqueid,customerId,orderId,company,cuid,createTime,balance,recharge,type,paymentType,status,comment,aid)
-- VALUES (2967007,2917227,'SA2151021R',722167,'2512130126',1,0,'2026-10-31 12:14:20',51310000,51300000,3,2,2,'',0);
--    (cuid/aid 以 tempbase.bak_2607120490_payment 实查为准)
-- R4 快照回退: UPDATE payment.payment SET balance=52548000 WHERE pid=2967008;
-- R5 钱包回退: UPDATE payment.advancepayment SET materialBalance=13223000 WHERE orderId='2512130126';
