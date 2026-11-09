-- ============================================================
-- 04_salesfunction_unpay_btn.sql 补齐补贴单"结算"按钮配置 (sales.salesfunction + platform.salesfunctionright)
-- 用途: 补贴单(type=1)的免收款确认接口=unpaySales("结算"按钮, show条件type==TYPE_SUB_INT补贴单专属),
--      但有"款项"按钮(money, 登记status=0款项行的入口)的4个变体(sales/advance/dompany/pompany)
--      均未配置unpay键 → 补贴单确认入口不可达 → 款项悬挂status=0(实证1097笔, 配比聚合漏算;
--      案例=2606270870/2611080317)。本脚本给4变体补unpay按钮(right按该变体现存(公司)组合镜像)
-- 前置: salesfunction已存在unpay行(sfid=291, 结算/pageBtn/unpay); 配套jar=fanglin-payment-8.3.031
--      (collect自动确认对国补单放开+260097登记守卫)
-- 回滚: DELETE FROM platform.salesfunctionright WHERE sfid = 291 AND name IN ('sales','advance','dompany','pompany');
--      (advance变体原有unpay行不在删除范围——按name IN排除前先核对该变体原状)
-- 验证: SELECT r.name, COUNT(*) FROM platform.salesfunctionright r
--      JOIN sales.salesfunction f ON f.sfid = r.sfid WHERE f.value='unpay' GROUP BY r.name; -- 4变体均有行
-- 幂等: NOT EXISTS 防重, 可重复执行
-- ============================================================

-- ---------- 1. unpay按钮right铺开: 有"款项"按钮的4变体 × 该变体现存(公司)组合 ----------
INSERT INTO platform.salesfunctionright (name, sfid, company)
SELECT DISTINCT r.name, 291, r.company
FROM platform.salesfunctionright r
WHERE r.name IN (SELECT DISTINCT rr.name FROM platform.salesfunctionright rr
                 JOIN sales.salesfunction ff ON ff.sfid = rr.sfid
                 WHERE ff.value = 'money')
  AND NOT EXISTS (
      SELECT 1 FROM platform.salesfunctionright x
      WHERE x.name = r.name AND x.company = r.company AND x.sfid = 291
  );
-- advance变体原有unpay授权行由NOT EXISTS防重保留

-- ---------- 2. 验证 ----------
SELECT r.name, COUNT(*) AS unpay_rights FROM platform.salesfunctionright r
JOIN sales.salesfunction f ON f.sfid = r.sfid WHERE f.value = 'unpay' GROUP BY r.name;
-- 期望: sales/advance/dompany/pompany 各有行
