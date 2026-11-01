-- ============================================================================
-- 文件: SALES_ORDER_2607190721_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2607190721(sid=1484051, 箭牌卫浴, 装修单2606070676, 客户778469)
--   撤款事故——一刀切还原(总验收补漏单)。T=2026-10-31 15:31:46(撤款翻转)。
--
-- 时间线与处置:
--   07-20 09:08  正常收款18,600,000(收据1474298,advance渠道,fullpayTime秒级锚定)  [保留]
--   10-31 14:11  新建2610310511(15,800,000)——T前建单                            [单据保留]
--   10-31 15:30  退货单427716"异品牌换货"创建                                   [T后确认→作废]
--   10-31 15:31  撤款翻转(+18,600,000,收据1540631/流水SA2156508R/预付收据2918031) [还原]
--   10-31 15:31  退货单427716确认→退款行2236230(未执行)+退货结算单1774966         [T后作废]
--   10-31 15:34  2610310511落款(-15,800,000,被翻转资金资助)                     [落款回退,单据保留]
--
-- 资金效果: 钱包 3,976,000 → 1,176,000
--   = -18,600,000(撤还原) +15,800,000(作废落款); 复算= 撤款前底数(19,776,000-18,600,000) ✓ 分毫不差
--   2610310511回到待落款, 店里重新收款时自然再扣。
--
-- 前置条件: V1~V4 逐条核对; 2610310511未发货(已佐证0行);【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2967846,2967860);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid IN (2156508,2236230,2235961);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1474298,1540631,1540639);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId IN (2918031,2918044);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_salesrefunds   AS SELECT * FROM sales.salesrefunds     WHERE rid=427716;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_refundsitem    AS SELECT * FROM sales.salesrefundsitem WHERE rid=427716;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid=1774966;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_balanceitem    AS SELECT * FROM sales.salesbalanceitem WHERE sbid=1774966;
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_sales          AS SELECT * FROM sales.sales            WHERE sid IN (1484051,1543523);
CREATE TABLE IF NOT EXISTS tempbase.bak_2607190721_salesitem      AS SELECT * FROM sales.salesitem        WHERE sid=1484051;
-- 备份行数自检(预期: 2/3/3/2/1/7/1/7/2/7, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_salesrefunds;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_refundsitem;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_salesbalance;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_balanceitem;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_sales;
-- SELECT COUNT(*) FROM tempbase.bak_2607190721_salesitem;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期3,976,000
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2606070676';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2156508 AND type=5 AND status=2 AND srid=1540631;
-- V3 预期1行: T后退款行原样(未执行)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2236230 AND type=4 AND status=0;
-- V4 预期1行: 落款项行原样
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE spid=2235961 AND type=3 AND status=2 AND srid=1540639;

START TRANSACTION;

-- ── A. 撤款翻转还原 ──
-- A1 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2967846 AND uniqueid = 'SA2156508R' AND recharge = 18600000 AND type = 3;
-- A2 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2918031 AND transfer = 18600000 AND collectTime = '2026-10-31 15:31:46';
-- A3 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540631 AND type = 1 AND realMoney = 18600000
   AND comment = '销售单:2607190721,款项撤款,退回主材预付款余额18600000';
-- A4 补款行还原(5→3, 收据回原始收款1474298) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1474298
 WHERE spid = 2156508 AND sid = 1484051 AND type = 5 AND status = 2 AND srid = 1540631;

-- ── B. T后退货链作废 ──
-- B1 删退款行/退货明细/退货单/退货结算单明细/退货结算单 —— 预期1行/7行/1行/7行/1行
DELETE FROM payment.salespayment   WHERE spid = 2236230 AND sid = 1484051 AND type = 4 AND status = 0 AND rid = 427716;
DELETE FROM sales.salesrefundsitem WHERE rid = 427716;
DELETE FROM sales.salesrefunds     WHERE rid = 427716 AND sid = 1484051 AND status = 0;
DELETE FROM sales.salesbalanceitem WHERE sbid = 1774966;
DELETE FROM sales.salesbalance     WHERE sbid = 1774966 AND rid = 427716;

-- ── C. 商品行回填(按退货明细逆向) —— 预期各影响1行, 共7行, Σ=18,600,000
UPDATE sales.salesitem SET num = 1000, total = 8500000 WHERE siid = 3274881 AND num = 0;
UPDATE sales.salesitem SET num = 1000, total = 1600000 WHERE siid = 3274882 AND num = 0;
UPDATE sales.salesitem SET num = 1000, total = 1899000 WHERE siid = 3274883 AND num = 0;
UPDATE sales.salesitem SET num = 3000, total = 4200000 WHERE siid = 3274884 AND num = 0;
UPDATE sales.salesitem SET num = 1000, total = 450000  WHERE siid = 3274885 AND num = 0;
UPDATE sales.salesitem SET num = 2000, total = 1700000 WHERE siid = 3274886 AND num = 0;
UPDATE sales.salesitem SET num = 1000, total = 251000  WHERE siid = 3274887 AND num = 0;

-- ── D. 单头复原(amount=Σitems=18,600,000; status全退→正常) —— 预期影响1行
UPDATE sales.sales
   SET amount = 18600000, status = 0
 WHERE sid = 1484051 AND amount = 0 AND status = 2;

-- ── E. T后落款作废(2610310511, T前建单→落款回退单据保留) —— 预期各1行
DELETE FROM payment.payment        WHERE pid = 2967860 AND uniqueid = 'SA2235961' AND recharge = 15800000;
DELETE FROM payment.advancereceipt WHERE arId = 2918044 AND transfer = 15800000;
DELETE FROM payment.salesreceipt   WHERE srid = 1540639 AND type = 0;
UPDATE payment.salespayment SET status = 0, srid = NULL
 WHERE spid = 2235961 AND sid = 1543523 AND type = 3 AND status = 2;
UPDATE sales.sales SET fullpayStatus = 0, fullpayTime = NULL
 WHERE sid = 1543523 AND fullpayStatus = 2;

-- ── F. 钱包(-18,600,000 +15,800,000 = -2,800,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 2800000
 WHERE orderId = '2606070676' AND materialBalance = 3976000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期1,176,000 且 = 客户末笔流水余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2606070676';
-- SELECT balance FROM payment.payment WHERE customerId=778469 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1474298
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1484051 ORDER BY spid;
-- W3 预期均0行: 翻转/T后退货链/落款已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid IN ('SA2156508R','SA2235961');
-- SELECT COUNT(*) FROM payment.salesreceipt WHERE srid IN (1540631,1540639);
-- SELECT COUNT(*) FROM payment.salespayment WHERE spid=2236230;
-- SELECT COUNT(*) FROM sales.salesrefunds   WHERE rid=427716;
-- SELECT COUNT(*) FROM sales.salesbalance   WHERE sbid=1774966;
-- W4 预期: 商品行7行回填Σ=18,600,000; 单头amount=18,600,000/status=0
-- SELECT SUM(total) FROM sales.salesitem WHERE sid=1484051;
-- SELECT no,status,amount,total FROM sales.sales WHERE sid=1484051;
-- W5 预期: 2610310511 落款回退(status=0/fullpayStatus=0/款项行status=0)
-- SELECT spid,status,srid FROM payment.salespayment WHERE spid=2235961;
-- SELECT no,status,fullpayStatus,fullpayTime FROM sales.sales WHERE sid=1543523;
-- W6 预期1行: T前正常厂结单仍在
-- SELECT sbid,total,status FROM sales.salesbalance WHERE sid=1484051 AND rid IS NULL;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 补款行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2607190721_salespayment WHERE spid=2156508;
-- R2 退货链/收据/预付收据: 从对应 bak 表回插
-- R3 商品行/单头: 从 tempbase.bak_2607190721_salesitem / bak_2607190721_sales 回插
-- R4 落款: 从 bak 表回插 2235961/1540639/2918044/2967860; 单头1543523 fullpayStatus=2/fullpayTime回填
-- R5 钱包回退: UPDATE payment.advancepayment SET materialBalance=3976000 WHERE orderId='2606070676';
