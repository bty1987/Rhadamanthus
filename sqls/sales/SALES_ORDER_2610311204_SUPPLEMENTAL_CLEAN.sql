-- ============================================================================
-- 文件: SALES_ORDER_2610311204_SUPPLEMENTAL_CLEAN.sql
-- 库: 生产(sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   全库终验补漏: 废单 2610311204(sid=1544219, company=1, 装修单2608220444, 客户807905)
--   名下残留厂结单 1776463(total=3,000,000, 2条明细, status=0未流转, 2026-11-01 16:24:55
--   随其落款收据确认创建)。该单在 2610240246 案一刀切处置中已废单+款项/收据/流水全删,
--   厂结单为漏网残件(误建单伴生品, 货未发厂商无履约), 补删。
--   (同性质先例: 2610240246 案曾补删 2610300625 的厂结单 1774734)
--
-- 资金效果: 零(纯单据残件清理)。
--
-- 回滚: 从 tempbase.bak_2610311204sup_* 回插。
-- ============================================================================

-- ─────────────────────────── 备份(留痕) ───────────────────────────
CREATE TABLE IF NOT EXISTS tempbase.bak_2610311204sup_salesbalance AS SELECT * FROM sales.salesbalance     WHERE sbid=1776463;
CREATE TABLE IF NOT EXISTS tempbase.bak_2610311204sup_balanceitem  AS SELECT * FROM sales.salesbalanceitem WHERE sbid=1776463;
-- 行数自检(预期: 1/2)
-- SELECT COUNT(*) FROM tempbase.bak_2610311204sup_salesbalance;
-- SELECT COUNT(*) FROM tempbase.bak_2610311204sup_balanceitem;

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期1行: 厂结单原样(未流转)
-- SELECT sbid,sid,rid,total,vbalance,status FROM sales.salesbalance WHERE sbid=1776463 AND sid=1544219 AND status=0;

START TRANSACTION;

DELETE FROM sales.salesbalanceitem WHERE sbid = 1776463;
DELETE FROM sales.salesbalance     WHERE sbid = 1776463 AND sid = 1544219 AND status = 0;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期0
-- SELECT COUNT(*) FROM sales.salesbalance WHERE sid=1544219;
