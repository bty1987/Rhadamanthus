-- =====================================================================
-- 设计确认残留数据清理（微改/大改标记归一 + 未闭环确认记录收账）
-- =====================================================================
-- 背景：
--   confirmDecorationInfo 的微改/大改分支(DecorationInfoServiceImpl)只改
--   designStatus=11/21 并生成"设计方案确认"服务记录(type=1,status=0)，从不
--   回收；且旧闸门用数值比较(sourceStatus>=incoming)，11/21数值大天然绕过，
--   客户在完成确认(1)/放线确认(2)之后仍可选微改/大改，designStatus 残留
--   11/21 形成脏轮次。
--
--   状态机定案（2026-10-14 拍板）：0 --确认完成--> 1 --放线确认--> 2；
--   0 时可选微改/大改(11/21,不改sourceStatus)；1/2 之后一律不可再确认。
--   代码侧修复(fanglin-decoration-8.3.034.000)：新增"11/21仅限sourceStatus=0
--   选择"拦截，封死 1/2→11/21 写入口；完成确认时批量完结该单未闭环记录。
--
--   本脚本清理代码封口前的存量：凡 sourceStatus 已到 1/2（设计阶段确认流
--   已终结）而 designStatus 仍停 11/21 的单，一律行政收口归 2；其未闭环
--   确认记录同步收账。其中 7 单(1+11/21)即"客户确认不了"的卡死单——代码
--   已无放行路径，只能 SQL 收口，代价为无客户对修改后方案的确认动作。
--
-- 范围口径（生产实证 2026-10-14）：
--   【A】标记归一：sourceStatus IN (1,2) 且 designStatus IN (11,21) 的
--        47 单 → designStatus 归 2(已完成)。
--        分布：(1,11)=2 / (1,21)=5 / (2,11)=31 / (2,21)=9。
--   【B】记录收账：sourceStatus IN (1,2) 订单的未闭环确认记录 → status=1
--        +finishTime，共 2020 条 / 1542 单。
--        分布：s=1:11条(7单,即A中卡死单) / s=1他态:331条(236单) /
--              s=2:56+1622=1678条(1299单)。
--
-- 刻意不碰：
--   sourceStatus=0（设计阶段在途）的 275 条记录/214 单——由 jar 完成确认
--   时的新收账逻辑自然闭环，勿动。
--
-- 执行顺序与依赖：
--   建议先发 jar 后跑本脚本（jar 先封死 1/2→11/21 写入口，避免清理后旧
--   jar 再写脏）；若先跑 SQL，发版后将 A/B 重复执行一遍即可（幂等）。
--   纯数据脚本，无需重启服务。
-- 幂等性：A/B 重复执行均命中 0 行，安全。
-- 预计行数：A=47，B=2020。
-- =====================================================================

-- ---------- ① 备份（执行前跑一次；若已按旧版建过同名表,先改名或跳过） ----------
CREATE TABLE decoration.decoration_dsgflag_bak_20261014 AS
SELECT orderId, sourceStatus, designStatus, status
FROM decoration.decoration
WHERE sourceStatus IN (1, 2) AND designStatus IN (11, 21);

CREATE TABLE decoration.decorationservice_dsgfix_bak_20261014 AS
SELECT ds.dsid, ds.orderId, ds.status, ds.finishTime
FROM decoration.decorationService ds
JOIN decoration.decoration d ON d.orderId = ds.orderId
WHERE ds.type = 1 AND ds.status = 0 AND d.sourceStatus IN (1, 2);

-- ---------- ② 标记归一（预计 47 行） ----------
UPDATE decoration.decoration
SET designStatus = 2
WHERE sourceStatus IN (1, 2) AND designStatus IN (11, 21);

-- ---------- ③ 未闭环确认记录收账（预计 2020 行） ----------
UPDATE decoration.decorationService ds
JOIN decoration.decoration d ON d.orderId = ds.orderId
SET ds.status = 1,
    ds.finishTime = COALESCE(ds.finishTime, NOW())
WHERE ds.type = 1
  AND ds.status = 0
  AND d.sourceStatus IN (1, 2);

-- ---------- ④ 核验 ----------
-- 4.1 A 核验：应为 0
SELECT COUNT(*) AS should_be_0
FROM decoration.decoration
WHERE sourceStatus IN (1, 2) AND designStatus IN (11, 21);

-- 4.2 B 核验：仅剩设计在途(0)的未闭环记录，应为 275 条/214 单
SELECT COUNT(*) AS open_records, COUNT(DISTINCT ds.orderId) AS orders
FROM decoration.decorationService ds
JOIN decoration.decoration d ON d.orderId = ds.orderId
WHERE ds.type = 1 AND ds.status = 0;

-- 4.3 抽查：原7条卡死单应已归位(sourceStatus=1, designStatus=2)
SELECT orderId, sourceStatus, designStatus, status, sdesignTime
FROM decoration.decoration
WHERE orderId IN ('2608250196','2608210129','2608070022','2607220042','2605030419','2606180082','2603060211');
