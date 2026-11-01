-- ============================================================================
-- 文件: SALES_ORDER_2610250688_WRONG_CUSTOMER.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2610250688(sid=1539657, 大连志邦家居, company=41, 装修单2606160037, 客户781867)
--   【作废型处置——12单中唯一的反方向】: 翻转是正确操作("收错客户了"), 退货链才是多余残件。
--
-- 完整故事:
--   10-25 16:20  志邦衣柜收款8,426,000, 店员把装修单号告知错, 钱收到了客户781867头上
--                (收据1535823,comment"志邦衣柜8426")                              [正常业务]
--   10-31 11:19  撤款翻转(+8,426,000回该客户钱包)——把收错的钱退回钱包,正确操作      [保留]
--   10-31 11:29  退货单427637"收错客户了"确认→退款行2235620(未执行)               [多余的第二条腿,作废]
--   10-31 11:47  财务南红雪手工预付款调整, 把钱从错误客户钱包转走(comment"志邦单号告知
--                错误8426", 转账渠道) → 钱包归0                                  [保留,正确的资金去向]
--
-- 处置(钱包零改动, 终态0=正确):
--   删: 退款行2235620/退货单427637/退货明细719852/退货结算单1774577及其明细
--   回填: 商品行3409012(num=84260,total=8426000)/单头amount=8,426,000,status 2→0
--   保留: 翻转行2230574(type=5,表达"此单款项已退")/其收据1540093/流水SA2230574R/预付收据2917071/
--         财务调整流水2966942/2917169/正常厂结单1770295/原始收据1535823
--   自洽性: 销售单收款8,426+款项行退款8,426=净0, 真实收款在正确客户单上; 审计痕迹
--           (翻转收据"款项撤款"+财务调整"志邦单号告知错误8426")完整保留。
--
-- 前置条件: V1~V3 逐条核对;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688_salespayment AS SELECT * FROM payment.salespayment   WHERE spid=2235620;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688_salesrefunds AS SELECT * FROM sales.salesrefunds     WHERE rid=427637;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688_refundsitem  AS SELECT * FROM sales.salesrefundsitem WHERE rid=427637;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688_salesbalance AS SELECT * FROM sales.salesbalance     WHERE sbid=1774577;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688_balanceitem  AS SELECT * FROM sales.salesbalanceitem WHERE sbid=1774577;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688_salesitem    AS SELECT * FROM sales.salesitem        WHERE siid=3409012;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688_sales        AS SELECT * FROM sales.sales            WHERE sid=1539657;
-- 备份行数自检(预期: 1/1/1/1/1/1/1, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2610250688_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688_salesrefunds;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688_refundsitem;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688_salesbalance;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688_balanceitem;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688_salesitem;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期0(正确终态,本脚本不动钱包)
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2606160037';
-- V2 预期1行: 翻转行原样(保留项,校验存在)
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2230574 AND type=5 AND status=2 AND srid=1540093;
-- V3 预期1行: 退款行未执行(作废对象)
-- SELECT spid,type,status,referMoney FROM payment.salespayment WHERE spid=2235620 AND type=4 AND status=0 AND srid IS NULL;

START TRANSACTION;

-- ① 删退款行 —— 预期影响1行
DELETE FROM payment.salespayment
 WHERE spid = 2235620 AND sid = 1539657 AND type = 4 AND status = 0 AND rid = 427637;
-- ② 删退货明细/退货单 —— 预期各影响1行
DELETE FROM sales.salesrefundsitem WHERE rid = 427637;
DELETE FROM sales.salesrefunds     WHERE rid = 427637 AND sid = 1539657 AND status = 0;
-- ③ 删退货结算单明细/退货结算单 —— 预期各影响1行
DELETE FROM sales.salesbalanceitem WHERE sbid = 1774577;
DELETE FROM sales.salesbalance     WHERE sbid = 1774577 AND rid = 427637;
-- ④ 商品行回填 —— 预期影响1行
UPDATE sales.salesitem
   SET num = 84260, total = 8426000
 WHERE siid = 3409012 AND sid = 1539657 AND num = 0 AND total = 0;
-- ⑤ 单头复原(amount=Σitems; status全退→正常) —— 预期影响1行
UPDATE sales.sales
   SET amount = 8426000, status = 0
 WHERE sid = 1539657 AND amount = 0 AND status = 2;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期仍为0(未动)
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2606160037';
-- W2 预期均0行: 退货链已清
-- SELECT COUNT(*) FROM payment.salespayment   WHERE spid=2235620;
-- SELECT COUNT(*) FROM sales.salesrefunds     WHERE rid=427637;
-- SELECT COUNT(*) FROM sales.salesbalance     WHERE sbid=1774577;
-- W3 预期: 商品行num=84260/total=8,426,000; 单头amount=8,426,000/status=0
-- SELECT siid,num,total FROM sales.salesitem WHERE sid=1539657;
-- SELECT no,status,amount,total,fullpay,fullpayStatus FROM sales.sales WHERE sid=1539657;
-- W4 预期2行: 翻转行(保留)+无退款行; 正常厂结单仍在
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1539657;
-- SELECT sbid,total,vbalance,status FROM sales.salesbalance WHERE sid=1539657;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 退款行/退货单/退货明细/退货结算单/退货结算明细: 从 tempbase.bak_2610250688_* 对应表回插
-- R2 商品行/单头: UPDATE sales.salesitem SET num=0, total=0 WHERE siid=3409012;
--               UPDATE sales.sales SET amount=0, status=2 WHERE sid=1539657;
