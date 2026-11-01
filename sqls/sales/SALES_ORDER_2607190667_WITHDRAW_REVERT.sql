-- ============================================================================
-- 文件: SALES_ORDER_2607190667_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2607190667(sid=1483997, 装修单2607120169, 客户792463)
--   撤款事故——一刀切还原。T=2026-10-31 16:44:10(定金翻转)。
--
-- 事故时间线:
--   07-19 17:20  定金收款32,557,000(收据1474101,流水SA1474101)                    [保留]
--   10-16 11:29  退货退款4,228,000执行(退款行2222394/退货单T前,收据1529007)      [保留]
--   10-31 15:20  退货单427709"客观原因-退剩余"确认→退款行2236468(1,268,000,未执行) [T前真业务,保留待执行]
--   10-31 16:44  撤款翻转(+32,557,000,收据1540840/流水SA2156450R/预付收据2918387)  [还原]
--   10-31 16:45  邻单2607190863退款执行+1,305,000(退款行2236473为T前16:37所建)    [保留:邻单T前真业务]
--
-- 资金效果: 钱包 33,991,000 → 1,434,000
--   = 撤款前底数129,000 + 邻单合法退款1,305,000, 分毫不差(本客户T后无消费,翻转资金未被花掉)。
--
-- 处置动作(仅撤款还原,无废单):
--   补款定金行2156450 type 7→2/收据→1474101; 删收据1540840/流水SA2156450R/预付收据2918387;
--   邻单退款流水快照同步; 钱包扣回。
--   保留: 退款行2236468(1,268,000,待执行)+退货单427709+其结算单 —— 店方后续决定是否执行,
--         执行则钱包 1,434,000+1,268,000=2,702,000。
--
-- 前置条件: V1~V3 逐条核对;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190667_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2968214,2968223);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190667_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid=2156450;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190667_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1474101,1540840);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190667_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId=2918387;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190667_sales          AS SELECT * FROM sales.sales            WHERE sid=1483997;
-- 备份行数自检(预期: 2/1/2/1/1, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2607190667_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2607190667_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2607190667_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607190667_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607190667_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期33,991,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2607120169';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2156450 AND type=7 AND status=2 AND srid=1540840;
-- V3 预期1行: 邻单退款流水在位(保留项)
-- SELECT pid,balance FROM payment.payment WHERE uniqueid='SA2236473R';

START TRANSACTION;

-- ① 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2968214 AND uniqueid = 'SA2156450R' AND recharge = 32557000 AND type = 3;
-- ② 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2918387 AND transfer = 32557000 AND collectTime = '2026-10-31 16:44:11';
-- ③ 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540840 AND type = 1 AND realMoney = 32557000
   AND comment = '销售单:2607190667,款项撤款,退回主材预付款余额32557000';
-- ④ 定金行还原(7→2, 收据回原始收款) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 2, srid = 1474101
 WHERE spid = 2156450 AND sid = 1483997 AND type = 7 AND status = 2 AND srid = 1540840;
-- ⑤ 邻单退款流水快照同步 —— 预期影响1行
UPDATE payment.payment
   SET balance = 1434000
 WHERE pid = 2968223 AND uniqueid = 'SA2236473R' AND balance = 33991000;
-- ⑥ 钱包扣回翻转金额(-32,557,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 32557000
 WHERE orderId = '2607120169' AND materialBalance = 33991000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期1,434,000 且 = 末笔流水(SA2236473R)余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2607120169';
-- SELECT balance FROM payment.payment WHERE customerId=792463 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 定金行 type=2, srid=1474101
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1483997 ORDER BY spid;
-- W3 预期均0行: 翻转三件套已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid='SA2156450R';
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId=2918387;
-- SELECT COUNT(*) FROM payment.salesreceipt   WHERE srid=1540840;
-- W4 预期1行: 待执行退款行仍在(保留项)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2236468;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 定金行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2607190667_salespayment;
-- R2 收据/预付收据: 同法从 tempbase.bak_2607190667_salesreceipt / bak_2607190667_advancereceipt 回插
-- R3 流水:
-- INSERT INTO payment.payment (pid,arId,uniqueid,customerId,orderId,company,cuid,createTime,balance,recharge,type,paymentType,status,comment,aid)
-- VALUES (2968214,2918387,'SA2156450R',792463,'2607120169',1,0,'2026-10-31 16:44:11',32686000,32557000,3,2,2,'',0);
--    (cuid/aid 以 tempbase.bak_2607190667_payment 实查为准)
-- R4 快照回退: UPDATE payment.payment SET balance=33991000 WHERE pid=2968223;
-- R5 钱包回退: UPDATE payment.advancepayment SET materialBalance=33991000 WHERE orderId='2607120169';
