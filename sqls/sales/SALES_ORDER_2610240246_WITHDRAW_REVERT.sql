-- ============================================================================
-- 文件: SALES_ORDER_2610240246_WITHDRAW_REVERT.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2610240246(sid=1538398, 沃伦门窗, company=91, 装修单2608220444, 客户807905)
--   撤款事故——按"一刀切还原"原则处理: 以撤款时刻 T=2026-10-31 10:42:09 为界,
--   T 之后该客户钱包上的全部行为作废, 还原到撤款前状态。
--
-- 事故时间线:
--   10-24 12:49  正常收款3,000(收据1534497/流水SA2228949)                    [保留]
--   10-24 12:49  厂结单1769110(+2,520,000)                                   [保留]
--   10-30 17:06  新建销售单2610300625(暖通6,200,款项行2235092)                [T前建单→保留,落款回退]
--   10-31 10:42  撤款翻转(+3,000,收据1540010/流水SA2228949R/预付收据2916941)  [还原]
--   10-31 12:28  退货单427650(同品牌换货)→13:03确认                          [作废]
--   10-31 13:39  2610300625 落款(-6,200,收据1540266/流水SA2235092)           [作废,单据回到未落款]
--   10-31 18:16  退款行2235779执行(+3,000,收据1541097/流水SA2235779R)        [作废]
--   10-31 18:14  新建销售单2610311204(门窗3,000,款项行2236813)                [作废→废单]
--   11-01 09:54  2610311204 落款(-3,000,收据1541601/流水SA2236813)           [作废]
--
-- 资金效果: 钱包 65,600,000 → 68,800,000(=撤款前一刻余额,分毫不差)
--   = -3,000(撤还原) +6,200(作废暖通落款) +3,000(作废门窗落款) -3,000(作废退款执行)
--
-- 处置动作:
--   A. 撤款还原: 补款行2228949 type 5→3/收据→1534497; 删收据1540010/流水SA2228949R/预付收据2916941
--   B. T后落款作废: 2610300625(款项行回status=0待重收) / 2610311204(款项行删除+销售单废单status=4)
--   C. T后退款作废: 删退货单427650+明细+退货结算单1774672+退款行2235779+其收据/流水/预付收据
--   D. 单体还原: 商品行3405950 num/total回填, 单头 amount=3,000,000/status 2→0
--
-- 执行前置条件:
--   1. V1~V5 逐条核对; 任一不符立即停止。
--   2. 店方确认: 退货单427650对应产品未实际出库退回(发货表0行已佐证), 2610311204未发货(0行已佐证)。
--
-- 留痕: 备份表 bak_2610240246_*(10张, 只读留痕) + 文件尾全字段回滚段。
-- ============================================================================

-- ─────────────────────────── 备份(留痕) ───────────────────────────
CREATE TABLE IF NOT EXISTS bak_2610240246_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2955295,2966709,2967239,2968758,2970148);
CREATE TABLE IF NOT EXISTS bak_2610240246_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid IN (2228949,2235779,2235092,2236813);
CREATE TABLE IF NOT EXISTS bak_2610240246_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1534497,1540010,1541097,1540266,1541601);
CREATE TABLE IF NOT EXISTS bak_2610240246_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId IN (2916941,2917442,2920192,2918889);
CREATE TABLE IF NOT EXISTS bak_2610240246_salesrefunds   AS SELECT * FROM sales.salesrefunds     WHERE rid=427650;
CREATE TABLE IF NOT EXISTS bak_2610240246_refundsitem    AS SELECT * FROM sales.salesrefundsitem WHERE rid=427650;
CREATE TABLE IF NOT EXISTS bak_2610240246_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid IN (1769110,1774672);
CREATE TABLE IF NOT EXISTS bak_2610240246_balanceitem    AS SELECT * FROM sales.salesbalanceitem WHERE sbid IN (1769110,1774672);
CREATE TABLE IF NOT EXISTS bak_2610240246_sales          AS SELECT * FROM sales.sales            WHERE sid IN (1538398,1542852,1544219);
CREATE TABLE IF NOT EXISTS bak_2610240246_salesitem      AS SELECT * FROM sales.salesitem        WHERE sid IN (1538398);

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期65,600,000
-- SELECT materialBalance FROM payment.advancepayment WHERE apId=598797;
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2228949 AND type=5 AND status=2 AND srid=1540010;
-- V3 预期各1行: 两笔落款行原样
-- SELECT spid,status,srid FROM payment.salespayment WHERE spid IN (2235092,2236813);
-- V4 预期1行: 退货单原样
-- SELECT rid,status FROM sales.salesrefunds WHERE rid=427650 AND status=1;
-- V5 预期0行: 未处理过(还原后本脚本不可重入)
-- SELECT COUNT(*) FROM payment.payment WHERE uniqueid='SA2228949R';

START TRANSACTION;

-- ── A. 撤款还原 ──
-- A1 删翻转入账流水 —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2966709 AND uniqueid = 'SA2228949R' AND recharge = 3000000 AND type = 3;
-- A2 删翻转预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2916941 AND transfer = 3000000 AND collectTime = '2026-10-31 10:42:09';
-- A3 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540010 AND type = 1 AND realMoney = 3000000
   AND comment = '销售单:2610240246,款项撤款,退回主材预付款余额3000000';
-- A4 补款行还原(5→3, 收据回原始收款) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1534497
 WHERE spid = 2228949 AND sid = 1538398 AND type = 5 AND status = 2 AND srid = 1540010;

-- ── B. T后落款作废 ──
-- B1 2610300625(T前建单): 删流水/收据/预付收据, 款项行回未落款 —— 预期各1行
DELETE FROM payment.payment        WHERE pid = 2967239 AND uniqueid = 'SA2235092' AND recharge = 6200000;
DELETE FROM payment.advancereceipt WHERE arId = 2917442 AND transfer = 6200000;
DELETE FROM payment.salesreceipt   WHERE srid = 1540266 AND type = 0;
UPDATE payment.salespayment SET status = 0, srid = NULL
 WHERE spid = 2235092 AND sid = 1542852 AND status = 2;
UPDATE sales.sales SET fullpayStatus = 0
 WHERE sid = 1542852 AND fullpayStatus = 2;
-- B2 2610311204(T后建单): 删流水/收据/预付收据/款项行, 销售单废单 —— 预期各1行
DELETE FROM payment.payment        WHERE pid = 2970148 AND uniqueid = 'SA2236813' AND recharge = 3000000;
DELETE FROM payment.advancereceipt WHERE arId = 2920192 AND transfer = 3000000;
DELETE FROM payment.salesreceipt   WHERE srid = 1541601 AND type = 0;
DELETE FROM payment.salespayment   WHERE spid = 2236813 AND sid = 1544219 AND type = 3 AND status = 2;
UPDATE sales.sales SET status = 4, fullpay = 0, fullpayStatus = -1
 WHERE sid = 1544219 AND status = 0;

-- ── C. T后退款作废 ──
-- C1 删退款执行流水/预付收据/收据 —— 预期各1行
DELETE FROM payment.payment        WHERE pid = 2968758 AND uniqueid = 'SA2235779R' AND recharge = 3000000;
DELETE FROM payment.advancereceipt WHERE arId = 2918889 AND transfer = 3000000;
DELETE FROM payment.salesreceipt   WHERE srid = 1541097 AND type = 1;
-- C2 删退款行/退货单/退货结算单 —— 预期各1行
DELETE FROM payment.salespayment   WHERE spid = 2235779 AND sid = 1538398 AND type = 4 AND rid = 427650;
DELETE FROM sales.salesrefundsitem WHERE rid = 427650 AND siid = 3405950;
DELETE FROM sales.salesrefunds     WHERE rid = 427650 AND sid = 1538398 AND status = 1;
DELETE FROM sales.salesbalanceitem WHERE sbid = 1774672;
DELETE FROM sales.salesbalance     WHERE sbid = 1774672 AND rid = 427650;

-- ── D. 单体还原(退货单作废→商品/单头回填) ──
-- D1 商品行回填 —— 预期影响1行
UPDATE sales.salesitem
   SET num = 1000, total = 3000000
 WHERE siid = 3405950 AND sid = 1538398 AND num = 0 AND total = 0;
-- D2 单头回填(amount=Σitems; status全退→正常, 与退货单作废联动) —— 预期影响1行
UPDATE sales.sales
   SET amount = 3000000, status = 0
 WHERE sid = 1538398 AND amount = 0 AND status = 2;

-- ── E. 钱包(-3,000 +6,200 +3,000 -3,000 = +3,200) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance + 3200000
 WHERE apId = 598797 AND materialBalance = 65600000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期68,800,000 且 = 客户末笔流水余额
-- SELECT materialBalance FROM payment.advancepayment WHERE apId=598797;
-- SELECT balance FROM payment.payment WHERE customerId=807905 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 补款行 type=3, srid=1534497
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1538398;
-- W3 预期: 2610300625 status=0(正常,待重收) / 2610311204 status=4(废单)
-- SELECT sid,no,status,fullpay,fullpayStatus FROM sales.sales WHERE sid IN (1542852,1544219);
-- W4 预期: 2610240246 amount=3,000,000/status=0, 商品行 num=1000/total=3,000,000
-- SELECT no,status,amount,total,fullpay,fullpayStatus FROM sales.sales WHERE sid=1538398;
-- SELECT siid,num,total FROM sales.salesitem WHERE sid=1538398;
-- W5 预期0行: 退货单/退款行/全部T后收据流水已清
-- SELECT COUNT(*) FROM sales.salesrefunds WHERE rid=427650;
-- SELECT COUNT(*) FROM payment.salespayment WHERE spid=2235779;
-- SELECT COUNT(*) FROM payment.payment WHERE uniqueid IN ('SA2228949R','SA2235092','SA2236813','SA2235779R');
