-- ============================================================
-- 02_salespayment_profit_confirm_fix.sql 国补单悬挂款项最小修复 (payment.salespayment + sales.sales)
-- 用途: type=1国补单款项"登记后未确认"悬挂(status=0, 收据已收确同秒)致配比聚合
--      (amountSalesPayment 要求 sp.status!=0)漏算。2026-11-09 排查: 全库1097笔(2024-10起),
--      配比活动窗口内(11-01后)仅2笔活单有效, 本脚本修复:
--        ① 2611080317 (sid=1548805, 沈阳方林cid=50, 16354元, spid=2242803, 窗口内活单):
--           款项0→2 + 主表fullpayStatus(-1)→2 + 补fullpayTime; 基数进位=待厂商结算
--           (balanceStatus 0→3, 业务页面操作)后由下次收款/提现触发重算时生效(既有口径)
--        ② 2606270870 (sid=1471241, 同公司, 16354元): 款项status已由用户2026-11-09手动
--           UPDATE为2(无备份无守卫), 本脚本补齐其主表状态对齐(fullpayStatus -1→2+fullpayTime)
--      窗口内另3笔(2611020014/2611020016/2611060450, 公司44)销售单本身已废单(status=4),
--      聚合条件((type=1 AND balanceStatus=3) OR type=0)排除废单, 修复无配比意义, 不处理;
--      其余1093笔历史悬挂(窗口外)按财务评估另行批量, 不在本脚本
-- 前置: 备份段先行(2行); 段0自检应各返回1行且status=0/-1
-- 回滚: 从备份表恢复 salespayment.spid=2242803 与 sales.sid=1548805,1471241 的原始字段值
-- 验证: 文末段3
-- 幂等: status/fullpayStatus 值守卫, 重跑零影响
-- ============================================================

-- ---------- 0. 备份段(先行) ----------
CREATE TABLE IF NOT EXISTS bak_salespayment_profit_fix_20261109 AS
SELECT sp.spid, sp.sid, sp.type, sp.status, sp.referMoney, sp.createTime,
       s.fullpayStatus, s.depositpayStatus, s.fullpay, s.fullpayTime
FROM payment.salespayment sp JOIN sales.sales s ON s.sid = sp.sid
WHERE sp.spid = 2242803 OR s.sid IN (1548805, 1471241);
-- 期望 3 行; SELECT COUNT(*) FROM bak_salespayment_profit_fix_20261109; 核对后继续

-- ---------- 段0: 前置自检(期望各1行) ----------
SELECT spid, status FROM payment.salespayment WHERE spid = 2242803 AND status = 0;
SELECT sid, fullpayStatus FROM sales.sales WHERE sid IN (1548805, 1471241) AND fullpayStatus = -1;

-- ---------- 1. 2611080317: 款项确认(0→2, 值级守卫) ----------
UPDATE payment.salespayment
SET status = 2
WHERE spid = 2242803 AND sid = 1548805 AND type = 3
  AND referMoney = 16354000 AND status = 0;

-- 2. 主表补款状态对齐(免收款确认语义: -1初始→2已确认; fullpay已有值不动)
UPDATE sales.sales
SET fullpayStatus = 2,
    fullpayTime = COALESCE(fullpayTime, CURRENT_TIMESTAMP)
WHERE sid = 1548805 AND fullpayStatus = -1 AND status = 0 AND balanceStatus = 0;

UPDATE sales.sales
SET fullpayStatus = 2,
    fullpayTime = COALESCE(fullpayTime, CURRENT_TIMESTAMP)
WHERE sid = 1471241 AND fullpayStatus = -1;

-- 期望各影响 1 行; 2611080317 修复后仍需业务侧走厂商结算(balanceStatus 0→3)方进配比基数

-- ---------- 3. 验证 ----------
SELECT sp.spid, s.no, sp.status AS pay_status, s.fullpayStatus, s.balanceStatus
FROM payment.salespayment sp JOIN sales.sales s ON s.sid = sp.sid
WHERE sp.spid = 2242803 OR s.sid = 1471241;
-- 期望: 两行 pay_status=2, fullpayStatus=2; 2611080317 balanceStatus=0(待业务结算)
