-- ============================================================
-- 预付款主材余额不平修复: 双击重复收款流水作废 (payment.payment)
-- 用途: 2026-09~11 预付款审计(payment-advance-audit, 21453单)发现2单主材余额不平,
--      均为同秒双击重复收款(payment 明细两行, advancepayment 只累计一次, 账面比明细少差额):
--        ① 2512300255 沈阳方林装饰: pid 2953440/2953441 连号, recharge=216000毫, 同秒 2026-10-23 10:26:41, uniqueid=SA2227833×2 → 账面少 216元
--        ② 2607120450 恩林房翻新:  pid 2976333/2976334 连号, recharge=142000毫, 同秒 2026-11-05 16:55:38, uniqueid=SA2202533×2 → 账面少 142元
--      判定: pid连号+同秒+同金额+同uniqueid = 同一次操作双击重复提交(真实双收不可能同秒同流水号),
--      修复方向=作废后一行流水(方向1); 若财务核实为真实双收则改走方向2(见文末注释段)
-- 前置: ①财务核实两笔到账金额(各只到账一笔) ②执行前备份段先行且行数=4
-- 回滚: UPDATE payment.payment SET status=2 WHERE pid IN (2953441, 2976334);
--      (或从备份表 bak_advance_dup_payment_20261108 恢复该两 pid 的全字段)
-- 验证: 文末对账查询, 期望两单主材账/实差额均=0
-- 幂等: status=0 守卫, 重跑零影响
-- ============================================================

-- ---------- 0. 备份段(先行, 回报行数后才跑修复段) ----------
CREATE TABLE IF NOT EXISTS bak_advance_dup_payment_20261108 AS
SELECT * FROM payment.payment WHERE pid IN (2953440, 2953441, 2976333, 2976334);
-- 期望 4 行; SELECT COUNT(*) FROM bak_advance_dup_payment_20261108; 核对后方可继续

-- ---------- 1. 修复段: 作废重复流水(每对保留首行, 作废连号第二行) ----------
-- 值级守卫: pid + orderId + uniqueid + recharge + createTime + status 全等, 任一不符即 0 行不落库
UPDATE payment.payment
SET status = 0
WHERE pid = 2953441 AND orderId = '2512300255' AND paymentType = 2
  AND recharge = 216000 AND uniqueid = 'SA2227833'
  AND createTime = '2026-10-23 10:26:41' AND status IN (1, 2);

UPDATE payment.payment
SET status = 0
WHERE pid = 2976334 AND orderId = '2607120450' AND paymentType = 2
  AND recharge = 142000 AND uniqueid = 'SA2202533'
  AND createTime = '2026-11-05 16:55:38' AND status IN (1, 2);

-- 期望各影响 1 行; advancepayment 账面(36536.00/7860.00)不动

-- ---------- 2. 修复后对账 ----------
-- 期望: 两单主材位 账面=实算, 差额 0
SELECT p.orderId,
       a.materialBalance / 1000 AS 主材账,
       SUM(CASE WHEN p.type IN (1, 3) THEN p.recharge ELSE -p.recharge END) / 1000 AS 主材实,
       (a.materialBalance - SUM(CASE WHEN p.type IN (1, 3) THEN p.recharge ELSE -p.recharge END)) / 1000 AS 差额
FROM payment.payment p
JOIN payment.advancepayment a ON a.orderId = p.orderId
WHERE p.orderId IN ('2512300255', '2607120450') AND p.paymentType = 2 AND p.status IN (1, 2)
GROUP BY p.orderId, a.materialBalance;

-- ============================================================
-- 方向2(备选, 真实双收时改为补账面, 与方向1二选一, 须财务拍板):
-- UPDATE payment.advancepayment SET materialBalance = materialBalance + 216000 WHERE orderId = '2512300255';
-- UPDATE payment.advancepayment SET materialBalance = materialBalance + 142000 WHERE orderId = '2607120450';
-- ============================================================
