-- ============================================================================
-- 38_noods_pnid_group_link.sql
-- ============================================================================
-- 用途: data.noods 公司自建定材行补挂集团引用 —— 无公司维度特殊处理的定材(pnid)关联统一:
--   company!=0 且 pnid 未挂(pnid IS NULL 或 0)的行, 按名称匹配集团行(company=0, status=0),
--   将 pnid 更新为集团行 nid。pnid 语义=上级定材引用(0=集团/自建, >0=引用行, 名称等取集团
--   快照仅浮动量可编辑)。
-- 注: 需求口径中的"fnid"实为 pnid(noods 表无 fnid 列)。
-- 范围实测(2026-11-26 生产只读库): 集团行 27 条(名称无重名, status 全 0 除 nid=0"无"占位行);
--   未关联公司行 906 条, 其中 175 条可按名称匹配 16 个启用集团行(水泥49/沙子43/红砖33/陶粒13/
--   河石6/胶泥6/刚性防水剂4/2.5平方线3/4分阀门3/瓷砖背胶3/3芯6平方电缆2/4平方线2/柔性防水2/
--   石膏2/石膏板2/6分阀门1/乳胶漆1), 其余 731 条无同名集团行保持自建态不动;
--   同一公司同名多行(如 company=1 两行"沙子")允许一对多引用同一集团行, 均挂接;
--   公司行 status 不区分(挂引用关系不动启用状态)。
-- 执行前置条件:
--   ① 段0 备份先建并核对行数(应=175)
--   ② 执行时机随意(量小行级更新, 无锁表风险)
-- 幂等性: 守卫含 pnid IS NULL OR pnid=0, 已挂接行重跑不命中, 整文件可重复执行
-- 回滚方式(按备份表):
--   UPDATE data.noods n
--   JOIN data.noods_bak_38_20261126 bak ON bak.nid = n.nid
--   SET n.pnid = bak.pnid;
-- 验证语句(见文件末尾段2): 残留计数应 = 0
-- ============================================================================

-- ---------- 段0: 备份(先建后跑) ----------
CREATE TABLE data.noods_bak_38_20261126 AS
SELECT n.nid, n.pnid, n.name, n.company
FROM data.noods n
JOIN data.noods g ON g.name = n.name AND g.company = 0 AND g.status = 0
WHERE n.company != 0
  AND (n.pnid IS NULL OR n.pnid = 0);
-- 验证备份: SELECT COUNT(*) FROM data.noods_bak_38_20261126;
--          -- 应 = 175(2026-11-26 只读库实测)

-- ---------- 段1: 补挂集团引用 ----------
UPDATE data.noods n
JOIN data.noods g ON g.name = n.name AND g.company = 0 AND g.status = 0
SET n.pnid = g.nid
WHERE n.company != 0
  AND (n.pnid IS NULL OR n.pnid = 0);
-- 预期影响行数 = 175

-- ---------- 段2: 验证(执行后应全部 = 0) ----------
-- 同名启用集团行存在但公司行仍未挂接的残留:
SELECT COUNT(*) AS residue
FROM data.noods n
JOIN data.noods g ON g.name = n.name AND g.company = 0 AND g.status = 0
WHERE n.company != 0 AND (n.pnid IS NULL OR n.pnid = 0);

-- 总验证: 175 行应全部 pnid 指向集团行(company=0):
SELECT COUNT(*) AS bad_ref
FROM data.noods n
JOIN data.noods_bak_38_20261126 bak ON bak.nid = n.nid
WHERE n.pnid != 0 AND NOT EXISTS (SELECT 1 FROM data.noods g WHERE g.nid = n.pnid AND g.company = 0);
