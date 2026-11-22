-- ============================================================================
-- 31_roleoperation_coverage_backfill.sql
-- ============================================================================
-- 用途: roleoperation 覆盖率补齐(两条可审计推导规则, 均幂等, 低峰执行)
--   规则A(主杠杆) 同角色同功能全公司铺平:
--     凡 (rid,oid) 在任一公司有显式授权行 → 铺到全部在营公司。
--     业务语义: 角色是职能定义, 同一职能不应因公司而断。
--     量化(2026-11-03实查): 覆盖极薄——6081个(rid,oid)对仅覆盖1家公司,
--     2048对仅2家, 1207对仅3家; 铺平预计新增 ~80-90万行。
--   规则B(辅助) 菜单权限推导:
--     角色在某公司拥有菜单(operation.moduleId=mid) → 该菜单下全部登记接口授权。
--     业务语义: 看得见页面 = 能调页面背后的接口。
--     范围: 19个mid有接口登记(1362接口), rolemodule 95万行做驱动; 新增量执行时见真章。
-- 与上次翻车补数据的区别: 规则透明可审计(两条推导式) / 闸已修复且有82+接口生产实证 /
--   关闸仍分批带48h观察窗。
-- 执行前置条件:
--   ① 低峰时段(避开白天生单高峰)
--   ② 段0 备份先行(生产修数铁律)
--   ③ 收集引擎运行中(fill与本次补数并行无冲突, NOT EXISTS防重; 无唯一键,
--      极小概率并发重复行, 功能无害)
-- 幂等性: 两段均 NOT EXISTS 防重, 可重复执行
-- 回滚方式(按备份表):
--   DELETE ro FROM communion.roleoperation ro
--   LEFT JOIN communion.roleoperation_bak_31_20261103 bak
--     ON bak.rid=ro.rid AND bak.oid=ro.oid AND bak.company=ro.company
--   WHERE ro.createTime >= '<本次执行时间>' AND ro.company<>0 AND bak.rid IS NULL;
-- 验证语句(执行后核对):
--   ① 总行数: SELECT COUNT(*) FROM communion.roleoperation;
--   ② 覆盖直方图复跑(1公司覆盖的对数应大幅下降):
--     SELECT companies_covered, COUNT(*) FROM (SELECT rid, oid,
--       COUNT(DISTINCT company) companies_covered FROM communion.roleoperation
--       WHERE company<>0 GROUP BY rid,oid) t GROUP BY companies_covered
--       ORDER BY companies_covered LIMIT 12;
-- ============================================================================

-- ---------- 段0: 备份(先建后跑) ----------
CREATE TABLE communion.roleoperation_bak_31_20261103 AS
SELECT * FROM communion.roleoperation;
-- 验证备份: SELECT COUNT(*) FROM communion.roleoperation_bak_31_20261103;
--          -- 应 = 主表当时行数

-- ---------- 段1: 规则A 同角色同功能全公司铺平 ----------
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT a.rid, a.oid, 34, c.cid, NOW()
FROM (
    SELECT DISTINCT rid, oid FROM communion.roleoperation WHERE company <> 0
) a
CROSS JOIN communion.company c
WHERE c.status = 0
  AND NOT EXISTS (
      SELECT 1 FROM communion.roleoperation x
      WHERE x.rid = a.rid AND x.oid = a.oid AND x.company = c.cid
  );

-- ---------- 段2: 规则B 菜单权限推导 ----------
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT DISTINCT rm.rid, o.oid, 34, rm.company, NOW()
FROM communion.rolemodule rm
JOIN communion.operation o ON o.moduleId = rm.mid
WHERE o.status = 0
  AND rm.company <> 0
  AND NOT EXISTS (
      SELECT 1 FROM communion.roleoperation x
      WHERE x.rid = rm.rid AND x.oid = o.oid AND x.company = rm.company
  );

-- ---------- 验证 ----------
-- ① 新增行数: SELECT COUNT(*) FROM communion.roleoperation
--    WHERE createTime >= '<本次执行日期>' AND cuid=34 AND company<>0;
--    (仅本次补数粗口径, 当日另有收集fill自然增量)
-- ② 覆盖直方图复跑(见文件头)
-- ③ 抽查一个原"仅1公司"的(rid,oid)对, 确认已铺平:
--    SELECT rid, oid, COUNT(*) companies FROM communion.roleoperation
--    WHERE company<>0 GROUP BY rid,oid HAVING companies>=100 LIMIT 5;
