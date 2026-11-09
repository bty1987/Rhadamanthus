-- ============================================================
-- 05_salespayment_suspended_batch_confirm.sql 补贴单悬挂款项批量确认 (payment.salespayment + sales.sales)
-- 用途: sales.sales.type=1(补贴)单的款项悬挂status=0修复(根因=sales变体缺unpay结算按钮配置,
--      正确入口unpaySales不可达, 业务走款项登记留下待收态行无人确认, 2024-10起积1097笔)。
--      修法=复刻unpaySales终态: 款项0→2(已确认) + 主表fullpayStatus(-1)→2(已确认) + 补fullpayTime;
--      不动金额/不生成流水/不动收据——纯状态对齐, 数据面与unpaySales产物一致。
-- 修复范围(安全分层, 2026-11-09 实证):
--      ① 活单(status=0, 50笔): 全修——真实补贴消费, 确认后随时厂商结算进配比基数
--      ② 完结单(status=5, 4笔): 修(无害, 口径归一)
--      ③ 废单(status=4, 1027笔): 不修——聚合SQL的balanceStatus=3条件排除废单, 修了无效果
--      ④ 全退单(status=2, 16笔): 不修——钱已退, 保留原始悬挂痕迹(如需清理由财务另行拍板)
--      窗口内(11-01后)活单2611080317已由02号SQL单独处理, 本脚本NOT EXISTS自然跳过
-- 前置: 备份段先行; 预期修复行数以执行日实查为准(2026-11-09实证54笔=50活单+4完结)
-- 安全性验证(已实证): 0笔配比明细冲突(dsd关联零行); 每笔确认语义=补贴到账已消费, 无资损方向
-- 回滚: bak表按sid/spid还原 salespayment.status 与 sales.fullpayStatus/fullpayTime 两表字段
-- 验证: 段3; 幂等: status/fullpayStatus守卫, 重跑零影响
-- ============================================================

-- ---------- 0. 备份段(先行, 回报行数后才跑修复段) ----------
CREATE TABLE IF NOT EXISTS bak_salespayment_suspended_20261109 AS
SELECT sp.spid, sp.sid, sp.status AS pay_status, s.status AS sales_status,
       s.fullpayStatus, s.fullpayTime, s.company, s.no, NOW() AS bak_time
FROM payment.salespayment sp JOIN sales.sales s ON s.sid = sp.sid
WHERE s.type = 1 AND sp.status = 0 AND sp.type = 3 AND s.status IN (0, 5);
-- 期望 ≈ 54 行(50活单+4完结); SELECT COUNT(*) FROM bak_salespayment_suspended_20261109; 核对后继续

-- ---------- 段0: 预检(执行前后行数对比用) ----------
SELECT COUNT(*) before_confirm FROM payment.salespayment
WHERE status = 0 AND type = 3 AND sid IN (SELECT sid FROM sales.sales WHERE type = 1 AND status IN (0, 5));

-- ---------- 1. 款项确认(0→2, 守卫: type=1活单/完结 + status=0) ----------
UPDATE payment.salespayment sp
JOIN sales.sales s ON s.sid = sp.sid
SET sp.status = 2
WHERE s.type = 1 AND sp.status = 0 AND sp.type = 3 AND s.status IN (0, 5);

-- ---------- 2. 主表补款状态对齐(-1初始→2已确认 + 补fullpayTime) ----------
UPDATE sales.sales s
JOIN payment.salespayment sp ON sp.sid = s.sid AND sp.status = 2 AND sp.type = 3
SET s.fullpayStatus = 2,
    s.fullpayTime = COALESCE(s.fullpayTime, CURRENT_TIMESTAMP)
WHERE s.type = 1 AND s.status IN (0, 5) AND s.fullpayStatus = -1;

-- ---------- 3. 验证 ----------
-- ① 补贴单悬挂清零(废单/全退除外): 期望0
SELECT COUNT(*) remaining FROM payment.salespayment
WHERE status = 0 AND type = 3 AND sid IN (SELECT sid FROM sales.sales WHERE type = 1 AND status IN (0, 5));
-- ② 修复总数核对: 期望≈备份行数
SELECT COUNT(*) confirmed_rows FROM bak_salespayment_suspended_20261109 b
JOIN payment.salespayment sp ON sp.spid = b.spid AND sp.status = 2;
-- ③ 抽样(沈阳方林50): 期望 status=2/fullpayStatus=2
SELECT s.no, sp.status AS pay_status, s.fullpayStatus, s.balanceStatus
FROM payment.salespayment sp JOIN sales.sales s ON s.sid = sp.sid
WHERE s.type = 1 AND s.company = 50 AND sp.status = 2 AND sp.type = 3;
