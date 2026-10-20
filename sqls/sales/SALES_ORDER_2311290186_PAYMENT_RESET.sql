-- ============================================================================
-- 文件: SALES_ORDER_2311290186_PAYMENT_RESET.sql
-- 库表: sales.sales / payment.salespayment
-- 用途: 销售单 2311290186(sid=996049, company=8, orderId=2307080152)款项死局复位。
--       现状: depositpayStatus=0(提交中) + fullpayStatus=0(提交中),款项弹窗(sales.js
--       initLabel)无该组合分支 → 定金/补款金额与标签不显示、两个撤销按钮不渲染。
--       成因: 2023-11-29 定金11:24提交(流水1463598)后,补款折扣审批(aid=1433929)
--       11:40通过,approveForSalesDiscount 建补款流水(1463643)时不校验定金状态,
--       绕过常规 addSalesPaymentForFullpay 的150041守卫。
--       本脚本模拟 cancelSalesPaymentForFullpay + cancelSalesPaymentForDeposit
--       两个撤销动作的落库效果:删两条初始流水 + 销售单款项字段回初始,
--       单据回到 (-1,-1) 后按正确顺序重走 定金→补款(审批)。
-- 执行时机: 款项弹窗修复代码上线【之前】执行(现网老前端在(-1,-1)分支功能完好,
--           数据先复位即可立即恢复该单可操作性,无需等发版)。
-- 执行前置条件(执行前逐条核对, 任一不满足则中止):
--   ① SELECT COUNT(*) FROM payment.salespayment
--      WHERE sid=996049 AND status=0 AND type IN (2,3) AND rid IS NULL AND srid IS NULL;
--      期望 = 2(两笔均未收款,无收款单关联)
--   ② SELECT depositpayStatus, fullpayStatus, status, balanceStatus
--      FROM sales.sales WHERE sid=996049;
--      期望 = 0, 0, 0, 0(单据未完结未结算)
-- 回滚方式:
--   流水: INSERT INTO payment.salespayment SELECT * FROM payment.salespayment_bak_996049_20261020 b
--         WHERE NOT EXISTS (SELECT 1 FROM payment.salespayment t WHERE t.spid = b.spid);
--   销售单: UPDATE sales.sales SET depositpay=26516000, depositpayStatus=0,
--         fullpay=814000, fullpayStatus=0 WHERE sid=996049;
-- 幂等性: 全部语句可重复执行(条件守卫,重复执行0行受影响)。
-- ============================================================================

-- ① 备份该单全部流水(幂等:表已存在则跳过)
CREATE TABLE IF NOT EXISTS payment.salespayment_bak_996049_20261020 AS
SELECT * FROM payment.salespayment WHERE sid = 996049;

-- ② 删除两条"提交中"流水(定金type=2 + 补款type=3,仅限从未收款行)
DELETE FROM payment.salespayment
WHERE sid = 996049
  AND status = 0
  AND type IN (2, 3)
  AND rid IS NULL
  AND srid IS NULL;

-- ③ 销售单款项字段复位到初始(-1,-1),等价于两次撤销落库
--    (depositpay/fullpay清零; ctype=2即SalesPO.CTYPE_PASS_INT与撤销接口重置值一致; cvalue清零)
UPDATE sales.sales
SET depositpay = 0,
    depositpayStatus = -1,
    fullpay = 0,
    fullpayStatus = -1,
    ctype = 2,
    cvalue = 0
WHERE sid = 996049
  AND depositpayStatus = 0
  AND fullpayStatus = 0
  AND status = 0
  AND balanceStatus = 0;

-- ============================================================================
-- 验证语句(执行后核对):
--   SELECT depositpay, depositpayStatus, fullpay, fullpayStatus, ctype, cvalue
--   FROM sales.sales WHERE sid = 996049;
--   期望: 0 | -1 | 0 | -1 | 2 | 0
--   SELECT COUNT(*) FROM payment.salespayment WHERE sid = 996049;
--   期望: 0
-- ============================================================================

-- ============================================================================
-- 附: 同成因存量单盘点(其余30单待业务逐单确认后另行处理,本脚本不涉及)。
-- 近年6单(otherStatus=1且有初始态补款流水,与本案同成因)可用同模板按 sid 替换执行:
--   SELECT s.sid, s.no, s.orderId, s.company, s.otherStatus,
--          (SELECT COUNT(*) FROM payment.salespayment sp
--           WHERE sp.sid = s.sid AND sp.type = 3 AND sp.status = 0) AS fp_initial
--   FROM sales.sales s
--   WHERE s.depositpayStatus = 0 AND s.fullpayStatus = 0
--   ORDER BY s.createTime DESC;
-- ============================================================================
