-- ============================================================================
-- 文件: SALES_ORDER_2610250688_WRONG_CUSTOMER_FULLCLEAN.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2610250688(sid=1539657, 大连志邦家居, company=41, 装修单2606160037, 客户781867)
--   "收错客户"误建单——彻底作废清理(取代之前的保留型处置, 用户拍板不留隐患)。
--
-- 完整故事:
--   10-25 16:20  志邦衣柜8,426,000收错客户(收据1535823"志邦衣柜8426", 销售单/商品/厂结单
--                随收款一同误建于错误客户名下; 零发货已佐证——货从未发出)
--   10-31 11:19  撤款翻转退回钱包(+8,426,000, 收据1540093/流水SA2230574R/预付收据2917071)
--   10-31 11:47  财务手工调整转出(-8,426,000, 流水2966942/预付收据2917169, checkv渠道,
--                "志邦单号告知错误8426"——钱经线下转给正确去向, 凭证财务留存)
--   10-31 11:35  退货单427637"收错客户了"+退款行2235620+退货结算单1774577  [前次处置已删]
--
-- 终态设计(误建单整体作废, 全库翻转特征彻底清零):
--   ① 款项行2230574还原: type 5→3, 收据→1535823(真实收款凭证恢复)
--   ② 删翻转三件套: 退款收据1540093/翻转流水SA2230574R(pid=2966845)/预付收据2917071
--   ③ 删财务调整对(与翻转配对进出, 同删后钱包链稳定): 流水2966942/预付收据2917169
--      ——钱线下转出的凭证由财务留存, 系统内不再保留手工调整残件
--   ④ 销售单作废: status 0→4, amount→0(对齐废单先例2512300338; total/fullpay收款事实保留)
--   ⑤ 商品行清零: 3409012 num/total→0(货未发, 对齐先例; riid明细已在前次删除)
--   ⑥ 删厂结单1770295+明细1行(误建单伴生品, 从未流转status=0; 货未发厂商无履约)
--   钱包: 不动(终态0; 删翻转进/调整出配对后钱包链= 消费SA2230574(balance 0) → 稳定0)
--
-- 隐患清零核验: 全库type=5/7翻转特征 → 仅剩2610300515(干净翻转,单据完整无残件);
--   本单系统内不再有任何"撤款/调整"痕迹, 审计链=收款收据1535823+消费流水+废单状态+财务线下凭证。
--
-- 前置条件: V1~V4 逐条核对; 零发货已佐证;【先执行备份段并核对行数】
-- ============================================================================

-- ─────────────────────────── 备份(留痕, 必须先执行) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688fc_payment        AS SELECT * FROM payment.payment        WHERE pid IN (2966845,2966942);
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688fc_salespayment   AS SELECT * FROM payment.salespayment   WHERE spid=2230574;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688fc_salesreceipt   AS SELECT * FROM payment.salesreceipt   WHERE srid IN (1540093);
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688fc_advancereceipt AS SELECT * FROM payment.advancereceipt WHERE arId IN (2917071,2917169);
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688fc_salesbalance   AS SELECT * FROM sales.salesbalance     WHERE sbid=1770295;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688fc_balanceitem    AS SELECT * FROM sales.salesbalanceitem WHERE sbid=1770295;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688fc_salesitem      AS SELECT * FROM sales.salesitem        WHERE siid=3409012;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610250688fc_sales          AS SELECT * FROM sales.sales            WHERE sid=1539657;
-- 备份行数自检(预期: 2/1/1/2/1/1/1/1, 不符即停)
-- SELECT COUNT(*) FROM tempbase.bak_2610250688fc_payment;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688fc_salespayment;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688fc_salesreceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688fc_advancereceipt;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688fc_salesbalance;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688fc_balanceitem;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688fc_salesitem;
-- SELECT COUNT(*) FROM tempbase.bak_2610250688fc_sales;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期0(本脚本不动钱包)
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2606160037';
-- V2 预期1行: 翻转行原样
-- SELECT spid,type,status,srid FROM payment.salespayment WHERE spid=2230574 AND type=5 AND status=2 AND srid=1540093;
-- V3 预期0行: 前次删除的退货链仍在(已完成)
-- SELECT COUNT(*) FROM sales.salesrefunds WHERE rid=427637;
-- V4 预期0行: 未发货
-- SELECT COUNT(*) FROM sales.salesdelivery WHERE sid=1539657;

START TRANSACTION;

-- ① 删翻转流水/调整流水(配对进出) —— 预期各影响1行
DELETE FROM payment.payment WHERE pid = 2966845 AND uniqueid = 'SA2230574R' AND recharge = 8426000 AND type = 3;
DELETE FROM payment.payment WHERE pid = 2966942 AND uniqueid = '1793418456884' AND recharge = 8426000 AND type = 0;
-- ② 删翻转预付收据/调整预付收据 —— 预期各影响1行
DELETE FROM payment.advancereceipt WHERE arId = 2917071 AND transfer = 8426000 AND collectTime = '2026-10-31 11:19:31';
DELETE FROM payment.advancereceipt WHERE arId = 2917169 AND transfer = 8426000;
-- ③ 删翻转退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1540093 AND type = 1 AND realMoney = 8426000
   AND comment = '销售单:2610250688,款项撤款,退回主材预付款余额8426000';
-- ④ 款项行还原(5→3, 收据回原始收款1535823) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1535823
 WHERE spid = 2230574 AND sid = 1539657 AND type = 5 AND status = 2 AND srid = 1540093;
-- ⑤ 商品行清零(货未发, 废单对齐先例) —— 预期影响1行
UPDATE sales.salesitem
   SET num = 0, total = 0
 WHERE siid = 3409012 AND sid = 1539657 AND num = 84260;
-- ⑥ 销售单作废(status→4; amount→0=Σitems; total/fullpay收款事实保留) —— 预期影响1行
UPDATE sales.sales
   SET status = 4, amount = 0
 WHERE sid = 1539657 AND status = 0 AND amount = 8426000;
-- ⑦ 删厂结单明细/厂结单(误建单伴生, 未流转) —— 预期各影响1行
DELETE FROM sales.salesbalanceitem WHERE sbid = 1770295;
DELETE FROM sales.salesbalance     WHERE sbid = 1770295 AND sid = 1539657 AND rid IS NULL;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期仍为0(未动) 且 = 有效末笔(SA2230574)余额
-- SELECT materialBalance FROM payment.advancepayment WHERE orderId='2606160037';
-- SELECT balance FROM payment.payment WHERE customerId=781867 AND status=2 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 款项行 type=3, srid=1535823
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE sid=1539657;
-- W3 预期均0行: 翻转/调整/厂结全部清除
-- SELECT COUNT(*) FROM payment.payment      WHERE pid IN (2966845,2966942);
-- SELECT COUNT(*) FROM payment.salesreceipt WHERE srid=1540093;
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId IN (2917071,2917169);
-- SELECT COUNT(*) FROM sales.salesbalance   WHERE sid=1539657;
-- W4 预期: 单头 status=4/amount=0; 商品行 num=0/total=0
-- SELECT no,status,amount,total,fullpay,fullpayStatus FROM sales.sales WHERE sid=1539657;
-- SELECT siid,num,total FROM sales.salesitem WHERE sid=1539657;

-- ═══════════════════════════ 回滚(从tempbase.bak表回插+状态还原) ═══════════════════════════
-- R1 款项行: INSERT INTO payment.salespayment SELECT * FROM tempbase.bak_2610250688fc_salespayment;
-- R2 流水/收据/预付收据/厂结单/厂结明细: 从对应 bak_2610250688fc_* 表回插
-- R3 商品行: 从 tempbase.bak_2610250688fc_salesitem 回插
-- R4 单头: UPDATE sales.sales SET status=0, amount=8426000 WHERE sid=1539657;
