-- =====================================================================
-- 选材项对账状态(accountStatus)与结算选材明细(balanceselectionitem)修复
-- 日期: 2026-09-06
--
-- 背景(2026-09-06 生产实测):
--   正向孤儿(si.accountStatus=1 但无 bsi 行, 用户已修): 修复后 0 条,
--     生成源=unbind/pending 在 PD 代理上赋值致回置丢失, 修复 ca535f1e6
--     (2026-05-17)已随 balance-8.3.027 上线, 不再新增
--   反向孤儿(bsi 行存在但 si.accountStatus=0): 89 条, 全部挂在 3 张
--     status=3(已结算)结算单里(company 22/52/57 各 30/30/29 条, 合计
--     约 6.4 万), accountTime 全 NULL, UI 流程已不可操作只能 SQL 修
--   重复行(同一 siid 多条 bsi): 102 对, 全部生于 2024-06-29~09-18 的
--     7 张结算单(4 张 status=1 / 3 张 status=3), company 20 占 100 条
--     多余行约 51082 元被双算(amountBalaceSelection 按 bsi 行 SUM)
--
-- ⚠️ 两处业务拍板点(执行前确认):
--   1. 89 条反向孤儿按"认账"处理(方案A, 与已付款一致)还是反结算
--      (方案B, 删 bsi 行+重算, 动历史结算金额须财务确认)。本脚本按
--      方案A出SQL, 方案B见文末注释
--   2. 102 对中跨结算单的 10 对(同一选材项进了两笔结算)须先人工判定
--      保留哪笔, Part2 默认排除它们, 判定后放开注释语句
--
-- 幂等: 全部语句可重复执行(UPDATE 幂等, DELETE 幂等, 索引加 IF 判断)
-- 执行顺序: Part0 巡检 -> Part1 -> Part2 -> Part3 -> Part4 索引
-- =====================================================================

-- ---------- Part0 巡检(只读, 随时可跑) ----------

-- 0.1 正向孤儿(修复 ca535f1e6 上线后应恒为 0; 若 >0 立即反馈)
SELECT COUNT(*) AS forward_orphan
FROM quotation.selectionitem si
LEFT JOIN balance.balanceselectionitem bsi ON bsi.siid = si.siid
WHERE si.accountStatus = 1 AND bsi.bsiid IS NULL;

-- 0.2 反向孤儿(本脚本 Part1 修复后应为 0)
SELECT COUNT(*) AS reverse_orphan
FROM balance.balanceselectionitem bsi
JOIN quotation.selectionitem si ON si.siid = bsi.siid
WHERE si.accountStatus = 0;

-- 0.3 重复行(Part2 修复后应为 0)
SELECT siid, COUNT(*) AS cnt, COUNT(DISTINCT bsid) AS bsid_cnt
FROM balance.balanceselectionitem
GROUP BY siid HAVING COUNT(*) > 1;

-- ---------- Part1 反向孤儿 89 条认账(方案A) ----------
-- 语义: 该项已在已结算单内且货款已付, 补齐对账标记与对账时间(取结算时间)
-- accounter 保持 NULL(系统内 unbind 先例也置空, 如需落结算人可加
--   si.accounter = bs.balancer)

UPDATE quotation.selectionitem si
JOIN balance.balanceselectionitem bsi ON bsi.siid = si.siid
JOIN balance.balanceselection bs ON bs.bsid = bsi.bsid
SET si.accountStatus = 1,
    si.accountTime = IFNULL(bs.balanceTime, bs.createTime)
WHERE si.accountStatus = 0;

-- ---------- Part2 重复 bsi 行去重 ----------

-- 2.1 先看跨结算单的 10 对(人工判定保留哪笔, 判定结论替换 2.3 的排除集)
SELECT siid, GROUP_CONCAT(bsid ORDER BY bsiid) AS bsids, COUNT(*) AS cnt
FROM balance.balanceselectionitem
GROUP BY siid HAVING cnt > 1 AND COUNT(DISTINCT bsid) > 1;

-- 2.2 删除多余 bsi 行: 同一 siid 保留最早 bsiid, 默认排除跨单 10 对
DELETE bsi
FROM balance.balanceselectionitem bsi
JOIN (
    SELECT siid, MIN(bsiid) AS keep_bsiid
    FROM balance.balanceselectionitem
    GROUP BY siid HAVING COUNT(*) > 1 AND COUNT(DISTINCT bsid) = 1
) d ON bsi.siid = d.siid AND bsi.bsiid <> d.keep_bsiid;
-- 预期删除 92 行(92 对同单重复各删 1 行)

-- 2.3 [跨单 10 对人工判定后执行] 把上面 d 子查询的
--     `AND COUNT(DISTINCT bsid) = 1` 条件去掉后重跑 2.2
--     (如判定保留的不是最早行, 改 keep 条件, 如 MAX(bsiid))

-- 2.4 重算受影响结算单金额偏差核对(只读): 存储 payment 与重算值
SELECT bs.bsid, bs.status, bs.payment AS stored_payment,
       COALESCE(SUM(IF(si.type IN (2,4,14), -(si.num-si.refnum), (si.num-si.refnum)) * si.postprice), 0) DIV 1000000 AS recomputed
FROM balance.balanceselection bs
JOIN balance.balanceselectionitem bsi ON bsi.bsid = bs.bsid
JOIN quotation.selectionitem si ON si.siid = bsi.siid
WHERE bs.bsid IN (
    SELECT DISTINCT bsid FROM balance.balanceselectionitem
    WHERE siid IN (SELECT siid FROM balance.balanceselectionitem GROUP BY siid HAVING COUNT(*) > 1)
    UNION
    SELECT DISTINCT bsi2.bsid FROM balance.balanceselectionitem bsi2
    JOIN quotation.selectionitem si2 ON si2.siid = bsi2.siid AND si2.accountStatus = 0
)
GROUP BY bs.bsid, bs.status, bs.payment
HAVING stored_payment <> recomputed;

-- 2.5 [status=1 锁定单金额回填] 按上面核对结果逐单执行(确认数值后放开):
-- UPDATE balance.balanceselection
-- SET cost = (SELECT amt FROM (...重算子查询...) t), payment = 同值
-- WHERE bsid = <2.4 列出的 status=1 bsid>;
-- status=3 已结算单不动, 差异交财务对账

-- ---------- Part3 防重根治(须 Part2 完成后执行, 否则建索引失败) ----------
-- 业务规则: 一个选材项同时最多在一张结算单内(submit/batch 只选
-- accountStatus=0 的项), 唯一索引使并发双提交第二个事务直接回滚

-- MySQL 5.6 无 ADD INDEX IF NOT EXISTS, 先查后加:
SELECT COUNT(*) AS index_exists FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'balance' AND TABLE_NAME = 'balanceselectionitem'
  AND INDEX_NAME = 'uni_siid';

-- 若 index_exists = 0 执行:
-- ALTER TABLE balance.balanceselectionitem ADD UNIQUE KEY uni_siid (siid);

-- ---------- Part4 上线后验证 ----------
SELECT COUNT(*) AS forward_orphan FROM quotation.selectionitem si
LEFT JOIN balance.balanceselectionitem bsi ON bsi.siid = si.siid
WHERE si.accountStatus = 1 AND bsi.bsiid IS NULL;              -- 预期 0

SELECT COUNT(*) AS reverse_orphan FROM balance.balanceselectionitem bsi
JOIN quotation.selectionitem si ON si.siid = bsi.siid
WHERE si.accountStatus = 0;                                    -- 预期 0

SELECT COUNT(*) AS dup_siid FROM (
  SELECT siid FROM balance.balanceselectionitem GROUP BY siid HAVING COUNT(*) > 1
) t;                                                           -- 预期 0

-- ---------- 附: 方案B(反结算, 未采用) ----------
-- DELETE bsi FROM balance.balanceselectionitem bsi
-- JOIN quotation.selectionitem si ON si.siid = bsi.siid
-- WHERE si.accountStatus = 0;
-- (再按 2.5 重算 3 张单金额, 动已结算历史, 须财务确认)
