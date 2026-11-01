-- ============================================================================
-- 文件: SALES_ORDER_2609260335_REDO_BLANKET.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2609260335(sid=1521938, 恒洁卫浴, 装修单2412140212, 客户630174)
--   撤款事故——按"一刀切还原"原则收尾(前两段修复已执行: 撤款翻转已还原+320万退款行已执行)。
--   以撤款时刻 T=2026-10-31 18:29:03 为界:
--     T 前: 退货单427753(18:26创建,真业务)及其退款行 —— 保留,退款已执行 ✓
--     T 前: 木门单2610311196建单(18:10) —— 保留(同2610300625逻辑:T前建单不废单)
--     T 后: 木门单落款(18:33,-11,000,000) → 收据确认(21:33) → 厂结单1775675(21:33) —— 全部作废
--
-- 资金效果: 钱包 -3,441,000 → 7,559,000
--   = 撤款前底数4,359,000 + T前退货退款3,200,000, 分毫不差; 木门单回到待落款, 重新收款时再扣。
--
-- 前置条件:
--   1. V1~V4 逐条核对。
--   2. 店方确认 2610311196 未发货(发货表0行已佐证)。
--   3. 【必须先执行备份段并核对行数, 再跑事务块】
--
-- 留痕: 备份表 bak_2609260335_redo_*(7张) + 文件尾回滚段;
--       更早两段修复(撤款还原/退款执行)的留痕见同目录两个脚本的回滚段。
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS bak_2609260335_redo_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2968852,2971100);
CREATE TABLE IF NOT EXISTS bak_2609260335_redo_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid=2236794;
CREATE TABLE IF NOT EXISTS bak_2609260335_redo_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid=1541121;
CREATE TABLE IF NOT EXISTS bak_2609260335_redo_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId=2918970;
CREATE TABLE IF NOT EXISTS bak_2609260335_redo_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid=1775675;
CREATE TABLE IF NOT EXISTS bak_2609260335_redo_balanceitem    AS SELECT * FROM sales.salesbalanceitem WHERE sbid=1775675;
CREATE TABLE IF NOT EXISTS bak_2609260335_redo_sales          AS SELECT * FROM sales.sales            WHERE sid=1544211;
-- 备份行数自检(执行后逐条跑, 预期: 2/1/1/1/1/5/1, 不符即停)
-- SELECT COUNT(*) FROM bak_2609260335_redo_payment;
-- SELECT COUNT(*) FROM bak_2609260335_redo_salespayment;
-- SELECT COUNT(*) FROM bak_2609260335_redo_salesreceipt;
-- SELECT COUNT(*) FROM bak_2609260335_redo_advancereceipt;
-- SELECT COUNT(*) FROM bak_2609260335_redo_salesbalance;
-- SELECT COUNT(*) FROM bak_2609260335_redo_balanceitem;
-- SELECT COUNT(*) FROM bak_2609260335_redo_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期-3,441,000
-- SELECT materialBalance FROM payment.advancepayment WHERE apId=454060;
-- V2 预期1行: 木门落款项行原样
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE spid=2236794 AND type=3 AND status=2 AND srid=1541121;
-- V3 预期1行: 退货退款流水在位(保留项)
-- SELECT pid,balance FROM payment.payment WHERE uniqueid='SA2236839R';
-- V4 预期0行: 未发货
-- SELECT COUNT(*) FROM sales.salesdelivery WHERE sid=1544211;

START TRANSACTION;

-- ① 删木门落款流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2968852 AND uniqueid = 'SA2236794' AND recharge = 11000000 AND type = 2;
-- ② 删木门落款预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2918970 AND transfer = 11000000 AND collectTime = '2026-10-31 18:33:46';
-- ③ 删木门落款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1541121 AND type = 0 AND realMoney = 11000000;
-- ④ 款项行回未落款 —— 预期影响1行
UPDATE payment.salespayment
   SET status = 0, srid = NULL
 WHERE spid = 2236794 AND sid = 1544211 AND type = 3 AND status = 2 AND srid = 1541121;
-- ⑤ 木门单头回待落款(fullpayTime为落款所置, 回NULL) —— 预期影响1行
UPDATE sales.sales
   SET fullpayStatus = 0, fullpayTime = NULL
 WHERE sid = 1544211 AND fullpayStatus = 2;
-- ⑥ 删T后厂结单及其明细 —— 预期影响5行/1行
DELETE FROM sales.salesbalanceitem WHERE sbid = 1775675;
DELETE FROM sales.salesbalance     WHERE sbid = 1775675 AND sid = 1544211;
-- ⑦ 退货退款流水快照同步 —— 预期影响1行
UPDATE payment.payment
   SET balance = 7559000
 WHERE pid = 2971100 AND uniqueid = 'SA2236839R' AND balance = -3441000;
-- ⑧ 钱包加回木门消费(+11,000,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance + 11000000
 WHERE apId = 454060 AND materialBalance = -3441000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期7,559,000 且 = 末笔流水(SA2236839R)余额
-- SELECT materialBalance FROM payment.advancepayment WHERE apId=454060;
-- SELECT balance FROM payment.payment WHERE customerId=630174 ORDER BY pid DESC LIMIT 1;
-- W2 预期: 款项行2236794 status=0/srid=NULL; 单头 fullpayStatus=0/fullpayTime=NULL/status=0
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE spid=2236794;
-- SELECT no,status,fullpay,fullpayStatus,fullpayTime FROM sales.sales WHERE sid=1544211;
-- W3 预期均0行: 厂结单1775675/落款收据1541121/预付收据2918970/流水SA2236794 已清
-- SELECT COUNT(*) FROM sales.salesbalance     WHERE sbid=1775675;
-- SELECT COUNT(*) FROM payment.salesreceipt   WHERE srid=1541121;
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId=2918970;
-- SELECT COUNT(*) FROM payment.payment        WHERE uniqueid='SA2236794';

-- ═══════════════════════════ 回滚(从bak表回插+状态还原) ═══════════════════════════
-- R1 款项行: INSERT INTO payment.salespayment SELECT * FROM bak_2609260335_redo_salespayment;
--    (如spid自增冲突则按列显式回插)
-- R2 收据/预付收据/厂结单/厂结明细/单头: 同法从 bak_2609260335_redo_* 回插
-- R3 流水两行:
-- INSERT INTO payment.payment (pid,arId,uniqueid,customerId,orderId,company,cuid,createTime,balance,recharge,type,paymentType,status,comment,aid)
-- VALUES (2968852,2918970,'SA2236794',630174,'2412140212',1,15505,'2026-10-31 18:33:46',-6641000,11000000,2,2,2,'',3462);
-- UPDATE payment.payment SET balance=-3441000 WHERE pid=2971100;
-- R4 钱包回退: UPDATE payment.advancepayment SET materialBalance=-3441000 WHERE apId=454060;
