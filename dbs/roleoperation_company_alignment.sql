-- ============================================================
-- roleoperation 公司维度对齐补全（company 验证上线前置）
--
-- 口径（2026-09 定稿）:
--   role=岗位,授权应全公司一致。取角色在任意公司的授权并集,
--   展开到该角色成员(user主角色+userrole附加角色)有身份的所有公司(usercompany)。
--   补全后:现有使用不炸;后续新场景(角色从未授权过的接口)报无权限=预期,
--   由运维在角色管理页配置 roleoperation 后生效。
--
-- 执行顺序: 严格按 步骤1→2A→2B→3→4,单线程执行,可重复执行(幂等)
-- 预期数字(2026-09-29 实测): 去重 1916 组;补全 229,741 条(2A+2B合计);补全后总量约 30 万
-- ============================================================

-- ------------------------------------------------------------
-- 步骤1: 清理存量重复(收集期并发竞态产生),每组保留 roid 最小的一条
-- ------------------------------------------------------------
DELETE ro1 FROM communion.roleoperation ro1
INNER JOIN communion.roleoperation ro2
    ON ro1.rid = ro2.rid
   AND ro1.oid = ro2.oid
   AND ro1.company = ro2.company
   AND ro1.roid > ro2.roid;

-- ------------------------------------------------------------
-- 步骤2: 公司维度对齐补全(拆两段执行,先2A后2B,顺序可互换)
--   cuid=34 操作人uid; 第二段的差集会实时看见第一段的插入结果,
--   天然去重,等价于 UNION,不会插重
-- ------------------------------------------------------------

-- 步骤2A: 主角色腿 —— 用户主角色的授权并集 → 用户有身份的所有公司
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT t.rid, t.oid, 34, t.cid, NOW()
FROM (
    SELECT DISTINCT u.roleId AS rid, h.oid, uc.cid
    FROM communion.usercompany uc
    INNER JOIN communion.user u ON u.uid = uc.uid
    INNER JOIN communion.roleoperation h ON h.rid = u.roleId
    LEFT JOIN communion.roleoperation e
        ON e.rid = u.roleId AND e.oid = h.oid AND e.company = uc.cid
    WHERE e.roid IS NULL
) t;

-- 步骤2B: 附加角色腿 —— 用户附加角色的授权并集 → 用户有身份的所有公司
INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT t.rid, t.oid, 34, t.cid, NOW()
FROM (
    SELECT DISTINCT ur.rid, h.oid, uc.cid
    FROM communion.usercompany uc
    INNER JOIN communion.userrole ur ON ur.uid = uc.uid
    INNER JOIN communion.roleoperation h ON h.rid = ur.rid
    LEFT JOIN communion.roleoperation e
        ON e.rid = ur.rid AND e.oid = h.oid AND e.company = uc.cid
    WHERE e.roid IS NULL
) t;

-- ------------------------------------------------------------
-- 步骤3: 唯一索引根治重复(替代原普通索引,两者列完全相同)
--   此后 fillRoleOperationByOperation 收集的并发重复插入会被数据库拒绝,
--   冲突异常沿拦截器抛出 → 请求返回 110000"操作失败" —— 属预期行为,
--   有问题报出来;该 (rid,oid,company) 实际已由并发请求补全,重试即可
-- ------------------------------------------------------------
ALTER TABLE communion.roleoperation ADD UNIQUE KEY uk_rid_oid_company (rid, oid, company);
ALTER TABLE communion.roleoperation DROP INDEX idx_rid_oid_company;

-- ------------------------------------------------------------
-- 步骤4: 验证
-- ------------------------------------------------------------
-- 4.1 总量(预期约 30 万)
SELECT COUNT(*) AS total FROM communion.roleoperation;

-- 4.2 重复应为 0
SELECT COUNT(*) AS dup_groups FROM (
    SELECT rid, oid, company FROM communion.roleoperation
    GROUP BY rid, oid, company HAVING COUNT(*) > 1
) t;

-- 4.3 缺口应为 0(重跑推算子查询,覆盖 2A+2B 两腿合计)
SELECT COUNT(*) AS gap FROM (
    SELECT DISTINCT u.roleId AS rid, h.oid, uc.cid
    FROM communion.usercompany uc
    INNER JOIN communion.user u ON u.uid = uc.uid
    INNER JOIN communion.roleoperation h ON h.rid = u.roleId
    LEFT JOIN communion.roleoperation e
        ON e.rid = u.roleId AND e.oid = h.oid AND e.company = uc.cid
    WHERE e.roid IS NULL
    UNION
    SELECT DISTINCT ur.rid, h.oid, uc.cid
    FROM communion.usercompany uc
    INNER JOIN communion.userrole ur ON ur.uid = uc.uid
    INNER JOIN communion.roleoperation h ON h.rid = ur.rid
    LEFT JOIN communion.roleoperation e
        ON e.rid = ur.rid AND e.oid = h.oid AND e.company = uc.cid
    WHERE e.roid IS NULL
) t;
