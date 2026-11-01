-- ============================================================================
-- 文件: SALES_ORDER_2603180193_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2603180193(sid=1406647, 装修单2602010028, 客户731941, 3M净水器/舒达床垫门店操作)
--   撤款事故——一刀切还原。T=2026-10-31 12:00:10(撤款翻转)。
--
-- 事故时间线:
--   03-18 16:19  正常收款970(收据1392992,advance渠道,fullpayTime秒级锚定)     [保留]
--   10-31 11:27  退货单427631(客户原因-7天无理由)→11:55确认生成退款行2235664   [T前真业务,保留]
--   10-31 12:00  撤款翻转(+970,收据1540150/流水SA2054995R/预付收据2917196)     [还原]
--   10-31 12:14  退款行2235664执行(+970,收据1540171/流水SA2235664R)           [保留:T前退款行的执行]
--   10-31 16:50  新建2610310987(7,400)→16:55落款                             [作废→废单]
--   10-31 17:36  新建2610311115(4,799)→20:15落款                             [作废→废单]
--   10-31 20:11  客户充值+144(PT332123)                                      [客户自有资金,保留]
--
-- 资金效果: 钱包 0 → 11,229,000
--   = -970,000(撤还原) +7,400,000(作废落款) +4,799,000(作废落款)
--   复算: 撤款前底数10,115,000 + T前退款执行970,000 + 充值144,000 = 11,229,000 ✓
--   注: 原收款为预付款渠道; 退款执行以余额形式返回(系统口径), 若业务需现金退客户另行提现流程。
--
-- 处置动作:
--   A. 撤款还原: 补款行2054995 type 5→3/收据→1392992; 删收据1540150/流水SA2054995R/预付收据2917196
--   B. T后两单作废: 款项行删除/收据/预付收据/流水删除/销售单废单status=4/厂结单1775347+1775697删除
--   C. 保留: 退货单427631/退款行2235664(已执行)/其收据1540171/流水SA2235664R/充值PT332123
--
-- 前置条件:
--   1. V1~V5 逐条核对。2. 两笔T后单未发货(已佐证0行)。3. 【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS bak_2603180193_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2966973,2967006,2968284,2968792,2969481);
CREATE TABLE IF NOT EXISTS bak_2603180193_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid IN (2054995,2236533,2236708);
CREATE TABLE IF NOT EXISTS bak_2603180193_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1392992,1540150,1540171,1540871,1541392);
CREATE TABLE IF NOT EXISTS bak_2603180193_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId IN (2917196,2918446,2919567);
CREATE TABLE IF NOT EXISTS bak_2603180193_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid IN (1775347,1775697);
CREATE TABLE IF NOT EXISTS bak_2603180193_balanceitem    AS SELECT * FROM sales.salesbalanceitem WHERE sbid IN (1775347,1775697);
CREATE TABLE IF NOT EXISTS bak_2603180193_sales          AS SELECT * FROM sales.sales            WHERE sid IN (1406647,1544001,1544130);
-- 备份行数自检(预期: 5/3/5/3/2/3/3, 不符即停)
-- SELECT COUNT(*) FROM bak_2603180193_payment;
-- SELECT COUNT(*) FROM bak_2603180193_salespayment;
-- SELECT COUNT(*) FROM bak_2603180193_salesreceipt;
-- SELECT COUNT(*) FROM bak_2603180193_advancereceipt;
-- SELECT COUNT(*) FROM bak_2603180193_salesbalance;
-- SELECT COUNT(*) FROM bak_2603180193_balanceitem;
-- SELECT COUNT(*) FROM bak_2603180193_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期0
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2602010028';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2054995 AND type=5 AND status=2 AND srid=1540150;
-- V3 预期各1行: 两笔落款项行原样
-- SELECT spid,status,srid FROM payment.salespayment WHERE spid IN (2236533,2236708);
-- V4 预期1行: 退款执行流水在位(保留项)
-- SELECT pid,balance FROM payment.payment WHERE uniqueid='SA2235664R';
-- V5 预期0行: 未发货
-- SELECT COUNT(*) FROM sales.salesdelivery WHERE sid IN (1544001,1544130);

START TRANSACTION;

-- ── A. 撤款还原 ──
-- A1 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2966973 AND uniqueid = 'SA2054995R' AND recharge = 970000 AND type = 3;
-- A2 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2917196 AND transfer = 970000 AND collectTime = '2026-10-31 12:00:10';
-- A3 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540150 AND type = 1 AND realMoney = 970000
   AND comment = '销售单:2603180193,款项撤款,退回主材预付款余额970000';
-- A4 补款行还原(5→3, 收据回原始收款) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1392992
 WHERE spid = 2054995 AND sid = 1406647 AND type = 5 AND status = 2 AND srid = 1540150;

-- ── B. T后两单作废(均为T后新建→废单) ──
-- B1 2610310987(7,400) —— 预期各1行
DELETE FROM payment.payment        WHERE pid = 2968284 AND uniqueid = 'SA2236533' AND recharge = 7400000;
DELETE FROM payment.advancereceipt WHERE arId = 2918446 AND transfer = 7400000;
DELETE FROM payment.salesreceipt   WHERE srid = 1540871 AND type = 0;
DELETE FROM payment.salespayment   WHERE spid = 2236533 AND sid = 1544001 AND type = 3 AND status = 2;
DELETE FROM sales.salesbalanceitem WHERE sbid = 1775347;
DELETE FROM sales.salesbalance     WHERE sbid = 1775347 AND sid = 1544001;
UPDATE sales.sales SET status = 4, fullpay = 0, fullpayStatus = -1
 WHERE sid = 1544001 AND status = 0;
-- B2 2610311115(4,799) —— 预期各1行(厂结明细1行)
DELETE FROM payment.payment        WHERE pid = 2969481 AND uniqueid = 'SA2236708' AND recharge = 4799000;
DELETE FROM payment.advancereceipt WHERE arId = 2919567 AND transfer = 4799000;
DELETE FROM payment.salesreceipt   WHERE srid = 1541392 AND type = 0;
DELETE FROM payment.salespayment   WHERE spid = 2236708 AND sid = 1544130 AND type = 3 AND status = 2;
DELETE FROM sales.salesbalanceitem WHERE sbid = 1775697;
DELETE FROM sales.salesbalance     WHERE sbid = 1775697 AND sid = 1544130;
UPDATE sales.sales SET status = 4, fullpay = 0, fullpayStatus = -1
 WHERE sid = 1544130 AND status = 0;

-- ── C. 保留项快照同步(删3行后重算: 10,115,000+970,000 → +144,000) —— 预期各影响1行
UPDATE payment.payment SET balance = 11085000
 WHERE pid = 2967006 AND uniqueid = 'SA2235664R' AND balance = 12055000;
UPDATE payment.payment SET balance = 11229000
 WHERE pid = 2968792 AND uniqueid = 'PT332123' AND balance = 4799000;

-- ── D. 钱包(-970,000 +7,400,000 +4,799,000 = +11,229,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance + 11229000
 WHERE orderId = '2602010028' AND materialBalance = 0;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期11,229,000 且 = 末笔流水(PT332123)余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2602010028';
-- SELECT balance FROM payment.payment WHERE customerId=731941 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1392992
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1406647;
-- W3 预期: 两笔T后单均 status=4
-- SELECT sid,no,status,fullpay,fullpayStatus FROM sales.sales WHERE sid IN (1544001,1544130);
-- W4 预期均0行: 翻转/落款全部清除
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid IN ('SA2054995R','SA2236533','SA2236708');
-- SELECT COUNT(*) FROM payment.salesreceipt WHERE srid IN (1540150,1540871,1541392);
-- SELECT COUNT(*) FROM payment.salespayment WHERE spid IN (2236533,2236708);
-- SELECT COUNT(*) FROM sales.salesbalance   WHERE sbid IN (1775347,1775697);
-- W5 预期1行: 退款执行链完好(保留项)
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2235664;
-- SELECT rid,status FROM sales.salesrefunds WHERE rid=427631;

-- ═══════════════════════════ 回滚(从bak表回插+状态还原) ═══════════════════════════
-- R1 款项行/收据/预付收据/厂结单: INSERT INTO 原表 SELECT * FROM bak_2603180193_* 对应表;
-- R2 流水三行:
-- INSERT INTO payment.payment (pid,arId,uniqueid,customerId,orderId,company,cuid,createTime,balance,recharge,type,paymentType,status,comment,aid)
-- VALUES (2966973,2917196,'SA2054995R',731941,'2602010028',1,0,'2026-10-31 12:00:10',11085000,970000,3,2,2,'',0);
-- INSERT INTO payment.payment (pid,arId,uniqueid,customerId,orderId,company,cuid,createTime,balance,recharge,type,paymentType,status,comment,aid)
-- VALUES (2968284,2918446,'SA2236533',731941,'2602010028',1,0,'2026-10-31 16:55:16',4655000,7400000,2,2,2,'',0);
-- INSERT INTO payment.payment (pid,arId,uniqueid,customerId,orderId,company,cuid,createTime,balance,recharge,type,paymentType,status,comment,aid)
-- VALUES (2969481,2919567,'SA2236708',731941,'2602010028',1,0,'2026-10-31 20:15:26',0,4799000,2,2,2,'',0);
--    (cuid/aid 以 bak_2603180193_payment 实查为准)
-- R3 快照回退: UPDATE payment.payment SET balance=12055000 WHERE pid=2967006;
--             UPDATE payment.payment SET balance=4799000  WHERE pid=2968792;
-- R4 两单头复活+款项行回插后: UPDATE sales.sales SET status=0, fullpay=原值, fullpayStatus=2 WHERE sid IN (1544001,1544130);
-- R5 钱包回退: UPDATE payment.advancepayment SET materialBalance=0 WHERE orderId='2602010028';
