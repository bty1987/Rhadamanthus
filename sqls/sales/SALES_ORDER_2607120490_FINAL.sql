-- ============================================================================
-- 文件: SALES_ORDER_2607120490_FINAL.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2607120490(sid=1479942, 装修单2512130126, 客户722167)——合并脚本一次到位:
--   ①撤款翻转还原(T=10-31 12:14:20) ②执行店方已确认的退货单427677的退款行2237907。
--   (本脚本取代 SALES_ORDER_2607120490_WITHDRAW_REVERT.sql——后者【不要再执行】)
--
-- 时间线与处置:
--   07-12 15:07  正常收款51,300,000(收据1469559)                          [保留]
--   10-16        退货退款10,735,000执行(退货单425694,T前)                  [保留]
--   10-31 11:27  退货单427632"退剩余"1,238,000确认→12:01退款行2235677      [T前真业务,保留]
--   10-31 12:14  撤款翻转(+51,300,000,收据1540172/流水SA2151021R/预付收据2917227,操作人圣象地板) [还原]
--   10-31 12:14  退款行2235677执行(+1,238,000,收据1540173/流水SA2235677R)   [保留:T前退款行的执行]
--   10-31 13:04  换购单2610310355(39,325,785)→13:54落款→当天发货确认        [保留:实物已交付]
--   10-31 13:51  退货单427677(39,325,000)→11-01 18:21 店方页面确认          [保留]
--     └ 系统已生成: 退款行2237907(type=4,status=0) + 退货结算单1776621(vbalance=-34,719,000)  [本脚本执行该退款行]
--
-- 资金效果: 钱包 13,223,000 → 1,248,000 (净-11,975,000 = -51,300,000翻转 +39,325,000退货执行)
--   复算: 撤款前底数10,000 + T前退款1,238,000 = 1,248,000 ✓ (换购单39,325,785已由退货款对冲)
--   无中间负态: 翻转还原与退款执行同一事务内完成。
--
-- 前置条件: V1~V4 逐条核对;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2967007,2967008,2967311);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid IN (2151021,2237907);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1469559,1540172,1540320);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId IN (2917227,2917513);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_salesrefunds   AS SELECT * FROM sales.salesrefunds     WHERE rid=427677;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid=1776621;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607120490_sales          AS SELECT * FROM sales.sales            WHERE sid IN (1479942,1543367);
-- 备份行数自检(预期: 3/2/3/2/1/1/2, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_salesrefunds;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_salesbalance;
-- SELECT COUNT(*) FROM tempbase.bak_2607120490_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期13,223,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2512130126';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2151021 AND type=5 AND status=2 AND srid=1540172;
-- V3 预期1行: 待执行退款行原样
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE spid=2237907 AND type=4 AND status=0 AND srid IS NULL;
-- V4 预期1行: 原始收款收据在位
-- SELECT srid FROM payment.salesreceipt WHERE srid=1469559;

START TRANSACTION;

-- ── A. 撤款翻转还原 ──
-- A1 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2967007 AND uniqueid = 'SA2151021R' AND recharge = 51300000 AND type = 3;
-- A2 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2917227 AND transfer = 51300000 AND collectTime = '2026-10-31 12:14:20';
-- A3 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540172 AND type = 1 AND realMoney = 51300000
   AND comment = '销售单:2607120490,款项撤款,退回主材预付款余额51300000';
-- A4 补款行还原(5→3, 收据回原始收款1469559) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1469559
 WHERE spid = 2151021 AND sid = 1479942 AND type = 5 AND status = 2 AND srid = 1540172;

-- ── B. 快照重写(删行后的在保流水) —— 预期各影响1行
UPDATE payment.payment SET balance = 1248000
 WHERE pid = 2967008 AND uniqueid = 'SA2235677R' AND balance = 52548000;
UPDATE payment.payment SET balance = -38077000
 WHERE pid = 2967311 AND uniqueid = 'SA2235780' AND balance = 13223000;

-- ── C. 退款行2237907执行(四件套, 形态对齐六月先例/2609260335先例) ——
-- C1 退款收据 —— 生成@srid
INSERT INTO payment.salesreceipt
  (cluid, collecterName, collectTime, type, realMoney, cash, cashInfo, bank, bankInfo,
   checkv, checkvBank, installment, installmentBank, accounts, accountsBank,
   advance, advanceType, coupon, couponInfo, comment)
VALUES
  (2966, '圣象地板', NOW(), 1, 39325000, 0, '', 0, '', 0, '', 0, '', 0, '',
   39325000, 3, 0, '', '.');
SET @srid = LAST_INSERT_ID();
-- C2 预付款收据 —— 生成@arid
INSERT INTO payment.advancereceipt
  (type, cluid, collecterName, collectTime, cfuid, confirmerName, status, realMoney,
   cash, cashInfo, bank, bankInfo, checkv, checkvBank, installment, installmentBank,
   accounts, accountsBank, transfer, comment)
VALUES
  (0, 2966, '圣象地板', NOW(), NULL, '', 2, 0,
   0, '', 0, '', 0, '', 0, '',
   0, '', 39325000, '装修单号:2512130126,销售单:2607120490,主材预付款');
SET @arid = LAST_INSERT_ID();
-- C3 退款行闭环(终态status=2对齐先例) —— 预期影响1行
UPDATE payment.salespayment
   SET status = 2, srid = @srid
 WHERE spid = 2237907 AND sid = 1479942 AND type = 4 AND status = 0 AND srid IS NULL;
-- C4 退货单闭环 —— 预期影响1行
UPDATE sales.salesrefunds
   SET status = 1
 WHERE rid = 427677 AND sid = 1479942 AND status = 0;
-- C5 退回主材预付款流水 —— 预期影响1行
INSERT INTO payment.payment
  (arId, uniqueid, customerId, orderId, company, cuid, createTime, balance, recharge,
   type, paymentType, status, comment, aid)
VALUES
  (@arid, 'SA2237907R', 722167, '2512130126', 1, 2966, NOW(), 1248000, 39325000,
   3, 2, 2, '', 3462);

-- ── D. 钱包(-51,300,000 +39,325,000 = -11,975,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 11975000
 WHERE orderId = '2512130126' AND materialBalance = 13223000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期1,248,000 且 = 末笔流水(SA2237907R)余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2512130126';
-- SELECT balance FROM payment.payment WHERE customerId=722167 ORDER BY pid DESC LIMIT 1;
-- W2 预期: 补款行 type=3/srid=1469559; 退款行2237907 status=2/srid=@srid
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1479942 ORDER BY spid;
-- W3 预期均0行: 翻转三件套已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid='SA2151021R';
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId=2917227;
-- SELECT COUNT(*) FROM payment.salesreceipt   WHERE srid=1540172;
-- W4 预期1行: 退货单427677 status=1
-- SELECT rid,status FROM sales.salesrefunds WHERE rid=427677;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2607120490_salespayment WHERE spid=2151021;
--    退款行状态回退: UPDATE payment.salespayment SET status=0, srid=NULL WHERE spid=2237907;
--    退货单回退: UPDATE sales.salesrefunds SET status=0 WHERE rid=427677;
-- R2 收据/预付收据: 从 tempbase.bak_2607120490_salesreceipt / bak_2607120490_advancereceipt 回插1540172/2917227;
--    新建两张收据按 W2 实查的 @srid/@arid 删除
-- R3 流水: 从 tempbase.bak_2607120490_payment 回插 2967007; DELETE FROM payment.payment WHERE uniqueid='SA2237907R';
-- R4 快照回退: UPDATE payment.payment SET balance=52548000 WHERE pid=2967008;
--             UPDATE payment.payment SET balance=13223000 WHERE pid=2967311;
-- R5 钱包回退: UPDATE payment.advancepayment SET materialBalance=13223000 WHERE orderId='2512130126';
