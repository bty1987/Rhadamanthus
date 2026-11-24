-- ============================================================================
-- 52_activity_cuid_semantic_reset.sql
-- ============================================================================
-- 用途: information.activity 创建人(id=34, 系统人员)变更为各公司合理人员
--   口径(拍板): 每公司取"已存在的最新活动(cuid<>34, MAX(aid))的创建人"作为该公司
--   uid=34 行的新创建人 —— 即该公司实际在管理活动的人。
-- 背景: 2026-11-01 "双人海外玩翻天"活动上线时由 uid=34 批量创建 70 家公司各1条,
--   创建人无业务语义; 另含 aid=0 "无"占位行(company=0, 2016年)。
-- 范围实测(2026-11-24 只读库干跑):
--   uid=34 共 70 行; 可映射 63 行(该公司存在他人活动);
--   无兜底 7 公司(company 13/18/77/81/93/102/103, 除34外无任何活动)→保留不动;
--   映射校验: MAX(aid) 口径与 createTime DESC 口径 0 差异(取 MAX(aid) 确定性实现)。
-- 执行前置条件:
--   ① 段0 备份先建并核对行数(应=70)
--   ② 低峰执行
-- 幂等性: cuid=34 守卫, 重复执行第二遍0行
-- 回滚方式(按备份表):
--   UPDATE information.activity a
--   JOIN information.activity_bak_52_20261124 bak ON bak.aid = a.aid
--   SET a.cuid = bak.cuid;
-- 验证语句(见文件末尾段2)
-- ============================================================================

-- ---------- 段0: 备份(先建后跑) ----------
CREATE TABLE information.activity_bak_52_20261124 AS
SELECT * FROM information.activity WHERE cuid = 34;
-- 验证备份: SELECT COUNT(*) FROM information.activity_bak_52_20261124;
--          -- 应 = 70(2026-11-24 实测)

-- ---------- 段1: 变更为各公司最新活动创建人 ----------
UPDATE information.activity a
JOIN (
    SELECT m.company AS comp, b.cuid AS newCuid
    FROM (
        SELECT company, MAX(aid) AS maxaid
        FROM information.activity
        WHERE cuid <> 34 AND cuid IS NOT NULL
        GROUP BY company
    ) m
    JOIN information.activity b ON b.aid = m.maxaid
    WHERE b.cuid <> 34 AND b.cuid IS NOT NULL
) mp ON mp.comp = a.company
SET a.cuid = mp.newCuid
WHERE a.cuid = 34;
-- 预期影响行数 = 63; 若明显不符立即 STOP 并核对
-- (7家公司除34外无活动, 无映射来源, 按口径保留 cuid=34 不动)

-- ---------- 段2: 验证 ----------
-- ① 剩余 cuid=34 行数(应=7, 即无兜底的7公司):
--   SELECT aid, company, name FROM information.activity WHERE cuid = 34;
-- ② 抽查映射结果(对比段1前干跑清单):
--   SELECT a.aid, a.company, a.name, a.cuid, u.currentName
--   FROM information.activity a LEFT JOIN communion.user u ON u.uid = a.cuid
--   WHERE a.name = '双人海外玩翻天' ORDER BY a.company;
-- ③ 抽查 company=1(应=2990 申志)/company=3(应=20401 邢倩):
--   SELECT aid, cuid FROM information.activity WHERE company IN (1, 3) AND name = '双人海外玩翻天';
