-- ============================================================================
-- 61_advancepayment_balance_fix.sql
-- ============================================================================
-- 用途: advancepayment 余额列清零态修复(流水重算口径, 排除 checked=16 无法找平批次)
--   排案背景: 流水重算对账(IFNULL(status,1)!=0 过滤作废流水38,843条)发现 89 行余额列
--   与流水净额不符。分层处理(2026-11-24 拍板):
--     A. 本文件修复 38 行: 标准单号 + checked=0 + 列=0/近零(清零态) + 流水净额>=0
--        → 逐行 UPDATE 列 = 流水净额, 每行带列旧值守卫(段1)
--     B. 15 行"列>流水"(刷列=削减方向, 含数万~百万级削减)不自动修, 清单见段0.5, 待业务逐单核对
--     C. 排除 36 行: checked=16(31行, 历史直改库批次, 拍板无法找平保持现状) +
--        非标准单号 4 行(30017198x2/30017761/31702090006) + 负净额 1 行(2607090226)
-- 执行前置条件:
--   ① 段0 备份先建并核对行数(应=38)
--   ② 低峰执行
--   ③ 建议 customer 防重守卫 jar(e9bed3431)已部署(同批治理止增)
-- 幂等性: 每行带列旧值守卫, 重复执行第二遍0行
-- 回滚方式(按备份表):
--   UPDATE payment.advancepayment ap
--   JOIN payment.advancepayment_bak_61_20261124 bak ON bak.apId = ap.apId
--   SET ap.balance = bak.balance, ap.projectBalance = bak.projectBalance,
--       ap.materialBalance = bak.materialBalance, ap.zhenglinBalance = bak.zhenglinBalance;
-- 验证语句(见文件末尾段2)
-- ============================================================================

-- ---------- 段0: 备份(先建后跑) ----------
CREATE TABLE payment.advancepayment_bak_61_20261124 AS
SELECT ap.* FROM payment.advancepayment ap
WHERE ap.apId IN (
    SELECT ap2.apId FROM payment.advancepayment ap2
    JOIN (
        SELECT orderId, paymentType, SUM(CASE WHEN type IN (1,3) THEN recharge ELSE -recharge END) bal
        FROM payment.payment WHERE IFNULL(status,1) != 0
        GROUP BY orderId, paymentType
    ) m ON m.orderId = ap2.orderId
    WHERE ((m.paymentType = 0 AND m.bal <> ap2.balance)
        OR (m.paymentType = 1 AND m.bal <> ap2.projectBalance)
        OR (m.paymentType = 2 AND m.bal <> ap2.materialBalance)
        OR (m.paymentType = 3 AND m.bal <> ap2.zhenglinBalance))
      AND ap2.checked = 0 AND m.bal >= 0
      AND ap2.orderId REGEXP '^[0-9]{10}$'
      AND (CASE m.paymentType WHEN 0 THEN ap2.balance WHEN 1 THEN ap2.projectBalance WHEN 2 THEN ap2.materialBalance ELSE ap2.zhenglinBalance END) <= 1000
);
-- 验证备份: SELECT COUNT(*) FROM payment.advancepayment_bak_61_20261124;
--          -- 应 = 38(2026-11-24 实测)

-- ---------- 段0.5: 削减方向待核对清单(15行, 仅留痕不修) ----------
-- 业务核对要点: 列值高于流水净额, 多出部分来源(转移/合并/无流水加款)需逐单确认;
--   若确认列正确 → 流水缺账, 补调整流水; 若确认流水正确 → 手工按流水刷列
--   1712010064 pt0 流水净额=10000000 列现值=1000000 (差=9000.00元)
--   1812120025 pt0 流水净额=500000 列现值=2000000 (差=-1500.00元)
--   1812120134 pt0 流水净额=2000000 列现值=500000 (差=1500.00元)
--   2505170116 pt0 流水净额=33426000 列现值=26000 (差=33400.00元)
--   2506140214 pt0 流水净额=8402000 列现值=2000 (差=8400.00元)
--   2508090090 pt2 流水净额=96777000 列现值=98477000 (差=-1700.00元)
--   2508260078 pt2 流水净额=30239000 列现值=239000 (差=30000.00元)
--   2510120275 pt0 流水净额=21856000 列现值=1956000 (差=19900.00元)
--   2510170061 pt0 流水净额=30517000 列现值=517000 (差=30000.00元)
--   2511020203 pt2 流水净额=9678000 列现值=9048000 (差=630.00元)
--   2512060122 pt2 流水净额=177701700 列现值=80025000 (差=97676.70元)
--   2512140430 pt2 流水净额=91935500 列现值=16922000 (差=75013.50元)
--   2604020060 pt0 流水净额=1110000 列现值=1108000 (差=2.00元)
--   2605040065 pt2 流水净额=158360000 列现值=8360000 (差=150000.00元)
--   2605290181 pt2 流水净额=3465000 列现值=8265000 (差=-4800.00元)

-- ---------- 段1: 清零态修复(逐行带旧值守卫) ----------
UPDATE payment.advancepayment SET materialBalance = 10 WHERE orderId = '1907080014' AND materialBalance = 0;
UPDATE payment.advancepayment SET balance = 19600000 WHERE orderId = '2107100127' AND balance = 0;
UPDATE payment.advancepayment SET balance = 30000000 WHERE orderId = '2211060025' AND balance = 0;
UPDATE payment.advancepayment SET balance = 339900000 WHERE orderId = '2302040467' AND balance = 0;
UPDATE payment.advancepayment SET materialBalance = 35000000 WHERE orderId = '2303070239' AND materialBalance = 0;
UPDATE payment.advancepayment SET materialBalance = 70000000 WHERE orderId = '2303140115' AND materialBalance = 0;
UPDATE payment.advancepayment SET balance = 2116000 WHERE orderId = '2303170054' AND balance = 0;
UPDATE payment.advancepayment SET materialBalance = 30000000 WHERE orderId = '2306140145' AND materialBalance = 0;
UPDATE payment.advancepayment SET balance = 24000000 WHERE orderId = '2307290200' AND balance = 0;
UPDATE payment.advancepayment SET balance = 9060000 WHERE orderId = '2404230028' AND balance = 0;
UPDATE payment.advancepayment SET balance = 749000 WHERE orderId = '2409010114' AND balance = 0;
UPDATE payment.advancepayment SET projectBalance = 5937000 WHERE orderId = '2409070323' AND projectBalance = 0;
UPDATE payment.advancepayment SET balance = 1355000 WHERE orderId = '2412220021' AND balance = 0;
UPDATE payment.advancepayment SET balance = 3587600 WHERE orderId = '2501190022' AND balance = 800;
UPDATE payment.advancepayment SET balance = 2359000 WHERE orderId = '2503110032' AND balance = 0;
UPDATE payment.advancepayment SET balance = 3421000 WHERE orderId = '2503220311' AND balance = 0;
UPDATE payment.advancepayment SET balance = 34691000 WHERE orderId = '2505170028' AND balance = 0;
UPDATE payment.advancepayment SET balance = 10436000 WHERE orderId = '2505230034' AND balance = 1000;
UPDATE payment.advancepayment SET balance = 118000 WHERE orderId = '2505250054' AND balance = 0;
UPDATE payment.advancepayment SET balance = 1300000 WHERE orderId = '2506060133' AND balance = 0;
UPDATE payment.advancepayment SET balance = 2200000 WHERE orderId = '2506200161' AND balance = 0;
UPDATE payment.advancepayment SET projectBalance = 4840000 WHERE orderId = '2506300217' AND projectBalance = 0;
UPDATE payment.advancepayment SET balance = 3436000 WHERE orderId = '2507090134' AND balance = 0;
UPDATE payment.advancepayment SET balance = 21500000 WHERE orderId = '2507200290' AND balance = 0;
UPDATE payment.advancepayment SET balance = 2379000 WHERE orderId = '2508090211' AND balance = 1000;
UPDATE payment.advancepayment SET balance = 1479000 WHERE orderId = '2508160077' AND balance = 0;
UPDATE payment.advancepayment SET balance = 3172000 WHERE orderId = '2509110071' AND balance = 0;
UPDATE payment.advancepayment SET balance = 150000 WHERE orderId = '2509210426' AND balance = 0;
UPDATE payment.advancepayment SET balance = 2413000 WHERE orderId = '2509300158' AND balance = 0;
UPDATE payment.advancepayment SET balance = 31700000 WHERE orderId = '2510070128' AND balance = 0;
UPDATE payment.advancepayment SET balance = 1889000 WHERE orderId = '2510070279' AND balance = 1000;
UPDATE payment.advancepayment SET balance = 87000000 WHERE orderId = '2510250071' AND balance = 0;
UPDATE payment.advancepayment SET balance = 26000000 WHERE orderId = '2510300092' AND balance = 0;
UPDATE payment.advancepayment SET materialBalance = 109953000 WHERE orderId = '2511300483' AND materialBalance = 0;
UPDATE payment.advancepayment SET balance = 5503000 WHERE orderId = '2512170058' AND balance = 0;
UPDATE payment.advancepayment SET projectBalance = 1532000 WHERE orderId = '2512310163' AND projectBalance = 0;
UPDATE payment.advancepayment SET materialBalance = 224010 WHERE orderId = '2603040132' AND materialBalance = 10;
UPDATE payment.advancepayment SET materialBalance = 143985000 WHERE orderId = '2609060600' AND materialBalance = 0;

-- ---------- 段2: 验证 ----------
-- ① 全量重对账(应仅剩 15行削减方向 + 36行排除行 = 51):
--   SELECT COUNT(*) FROM (
--     SELECT m.orderId, m.paymentType, m.bal,
--       CASE m.paymentType WHEN 0 THEN ap.balance WHEN 1 THEN ap.projectBalance
--         WHEN 2 THEN ap.materialBalance ELSE ap.zhenglinBalance END dbval
--     FROM (SELECT orderId, paymentType,
--         SUM(CASE WHEN type IN (1,3) THEN recharge ELSE -recharge END) bal
--       FROM payment.payment WHERE IFNULL(status,1) != 0
--       GROUP BY orderId, paymentType) m
--     JOIN payment.advancepayment ap ON ap.orderId = m.orderId
--     WHERE (m.paymentType = 0 AND m.bal <> ap.balance)
--        OR (m.paymentType = 1 AND m.bal <> ap.projectBalance)
--        OR (m.paymentType = 2 AND m.bal <> ap.materialBalance)
--        OR (m.paymentType = 3 AND m.bal <> ap.zhenglinBalance)) t
--   JOIN payment.advancepayment ap2 ON ap2.orderId = t.orderId AND ap2.checked = 0
--     AND t.dbval <= 1000;
-- ② 抽查(应等于流水净额):
--   SELECT balance FROM payment.advancepayment WHERE orderId = '1907080014';
