-- ============================================================================
-- 60_customerchance_orderid_mismatch_fix.sql
-- ============================================================================
-- 用途: customer.customerchance.orderId 与 customer.customerchanceorder(权威绑定表)
--   不一致校正 —— 机会确认回填无"已绑定校验", 并发/重复转正把后建的新单号覆盖进
--   chance.orderId, 而绑定表保留报备时的预占号(权威)。245 对全部 chanceStatus=4(已转正)。
-- 背景(2026-11-24 排案 2611140144/2611140479):
--   报备时预占订单号并写入绑定表(customerchanceorder, 11:21) → 转正落库用预占号 →
--   1秒后重复请求穿透(入口无幂等无锁) → tranDecoration 检测预占号已存在改生成新号 →
--   chance.orderId 被新号覆盖 → 同一机会两单、belong.ccid 同值、双表 orderId 矛盾。
--   代码守卫已落(锁定读+COMPLETE幂等330125+覆盖守卫, customer jar)。
-- 处理口径:
--   ① chance.orderId 校正回绑定表值(52号同款权威表口径) —— 本文件段1
--   ② "新号单"=重复单候选(chance.orderId 被覆盖前的值), 业务核对后走废单流程,
--      本文件只提供清单查询(段2③), 不直接改单据状态
--   ③ belong.ccid 随单归属, 废单流程自然失效, 不单独修
-- 范围实测(2026-11-24 只读库): 245 对, 全部 chanceStatus=4
-- 执行前置条件:
--   ① 段0 备份先建并核对行数(应=245)
--   ② 低峰执行
--   ③ 建议先部署 customer jar(守卫), 避免校正窗口期再产生新覆盖
-- 幂等性: JOIN 条件 orderId<>bindOrderId, 重复执行第二遍0行
-- 回滚方式(按备份表):
--   UPDATE customer.customerchance cc
--   JOIN customer.customerchance_bak_60_20261124 bak ON bak.ccid = cc.ccid
--   SET cc.orderId = bak.orderId;
-- 验证语句(见文件末尾段2)
-- ============================================================================

-- ---------- 段0: 备份(先建后跑) ----------
CREATE TABLE customer.customerchance_bak_60_20261124 AS
SELECT cc.*
FROM customer.customerchance cc
JOIN customer.customerchanceorder cco ON cco.ccid = cc.ccid
WHERE cc.orderId <> cco.orderId;
-- 验证备份: SELECT COUNT(*) FROM customer.customerchance_bak_60_20261124;
--          -- 应 = 245(2026-11-24 实测)

-- ---------- 段0.5: 重复单候选清单留痕(业务核对废单用) ----------
-- chance.orderId(被覆盖写入的新号)即重复单候选, 修数前先留档:
CREATE TABLE customer.customerchance_duporder_list_60_20261124 AS
SELECT cc.ccid, cc.orderId AS dupOrderId, cco.orderId AS bindOrderId, cc.company, cc.status, cc.confirmTime
FROM customer.customerchance cc
JOIN customer.customerchanceorder cco ON cco.ccid = cc.ccid
WHERE cc.orderId <> cco.orderId;
-- 验证: SELECT COUNT(*) FROM customer.customerchance_duporder_list_60_20261124; -- 应=245
-- 业务核对视图(重复单的归属/客户/状态):
--   SELECT d.dupOrderId, u.currentName 归属人, d.company, d.status,
--          deco.createTime, deco.status 单状态
--   FROM customer.customerchance_duporder_list_60_20261124 d
--   LEFT JOIN decoration.decoration deco ON deco.orderId = d.dupOrderId
--   LEFT JOIN communion.user u ON u.uid = (SELECT buid FROM customer.customerchance c WHERE c.ccid = d.ccid);

-- ---------- 段1: chance.orderId 校正回绑定表权威值 ----------
UPDATE customer.customerchance cc
JOIN customer.customerchanceorder cco ON cco.ccid = cc.ccid
SET cc.orderId = cco.orderId
WHERE cc.orderId <> cco.orderId;
-- 预期影响行数 = 245; 若不符立即 STOP

-- ---------- 段2: 验证 ----------
-- ① 矛盾清零(应=0):
--   SELECT COUNT(*) FROM customer.customerchance cc
--   JOIN customer.customerchanceorder cco ON cco.ccid = cc.ccid
--   WHERE cc.orderId <> cco.orderId;
-- ② 抽查报障机会 211015(应 orderId=2611140144):
--   SELECT ccid, orderId, status FROM customer.customerchance WHERE ccid = 211015;
-- ③ 重复单候选仍留痕(应=245):
--   SELECT COUNT(*) FROM customer.customerchance_duporder_list_60_20261124;
