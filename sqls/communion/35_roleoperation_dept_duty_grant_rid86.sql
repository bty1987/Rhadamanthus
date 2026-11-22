-- ============================================================================
-- 35_roleoperation_dept_duty_grant_rid86.sql
-- ============================================================================
-- 用途: duty(职务)/department(部门) 相关 operation 授权给角色 rid=86(系统管理员),
--       按纯三元组 (rid, oid, company) 逐在营公司落 roleoperation 显式行(不用 company=0 通配),
--       模式与 30号(用户管理四操作授权rid86) 完全一致。
-- 接口清单(2026-11-08 生产实查, duty/department 域全部 through=0 强权限操作, 共 6 个):
--   部门: addDepartment(1451) 新增部门 / updateDepartment(1289) 更新部门 /
--         updateDepartmentForStatus(1420) 更新部门状态
--   职务: addDuty(1718) 新增职务 / updateDuty(1542) 修改职务 /
--         updateDutyForStatus(1719) 更新职务状态
--   说明: 该域其余 operation(queryDuty/pageDepartment/syncDepartment/syncDuty 等)均
--         through=1/2, 拦截器不要求显式授权行, 不在本批; 现状 rid=86 全公司均无此 6 行
--         (2026-11-08 实查 has6=0), 即系统管理员当前无法做部门/职务维护
-- 执行前置条件:
--   ① 段0 自检应返回 0 行(oid 清单全部存在且启用)
--   ② rid=86 角色存在: SELECT rid,name FROM communion.role WHERE rid=86;  -- 系统管理员
-- 幂等性: NOT EXISTS 按 (rid,oid,company) 防重, 可重复执行
-- 回滚方式:
--   DELETE FROM communion.roleoperation WHERE rid=86 AND company<>0 AND oid IN (1451,1718,1289,1420,1542,1719);
--   -- (如需保留执行前已存在的显式行, 按 createTime >= 本次执行时间收窄)
-- 验证语句(执行后核对):
--   SELECT COUNT(*) FROM communion.roleoperation WHERE rid=86 AND company<>0 AND oid IN (1451,1718,1289,1420,1542,1719);
--   -- 期望 ≈ 6 × 103 = 618(少出的行=该公司本就有部分显式行, NOT EXISTS 防重所致)
--   -- 抽验: 任一公司应有全部 6 行
--   SELECT company, COUNT(*) FROM communion.roleoperation WHERE rid=86 AND oid IN (1451,1718,1289,1420,1542,1719) GROUP BY company ORDER BY company LIMIT 5;
-- ============================================================================

-- ---------- 段0: 前置自检(期望0行) ----------
SELECT o.oid, o.operation, o.name
FROM communion.operation o
WHERE o.oid IN (1451, 1718, 1289, 1420, 1542, 1719) AND (o.status <> 0);

-- ---------- 段1: 授权落库(rid=86 × 6接口 × 在营公司) ----------
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT 86, o.oid, 34, c.cid, NOW()
FROM communion.operation o
CROSS JOIN communion.company c
WHERE o.oid IN (
    1451,  -- addDepartment 新增部门
    1289,  -- updateDepartment 更新部门
    1420,  -- updateDepartmentForStatus 更新部门状态
    1718,  -- addDuty 新增职务
    1542,  -- updateDuty 修改职务
    1719   -- updateDutyForStatus 更新职务状态
  )
  AND o.status = 0
  AND c.status = 0
  AND NOT EXISTS (
      SELECT 1 FROM communion.roleoperation x
      WHERE x.rid = 86 AND x.oid = o.oid AND x.company = c.cid
  );

-- ---------- 验证 ----------
-- 授权行总数(期望 ≈ 618)
SELECT COUNT(*) granted_rows FROM communion.roleoperation
WHERE rid = 86 AND company<>0 AND oid IN (1451, 1718, 1289, 1420, 1542, 1719);
-- 抽查: 系统管理员在任一公司的 addDepartment 授权
SELECT ro.rid, ro.oid, ro.company, ro.createTime FROM communion.roleoperation ro
WHERE ro.rid = 86 AND ro.oid = 1451 ORDER BY ro.company LIMIT 5;
