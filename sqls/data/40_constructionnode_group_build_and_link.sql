-- ============================================================================
-- 40_constructionnode_group_build_and_link.sql
-- ============================================================================
-- 用途: constructionNode 集团合集补建 + 分公司行关联更新 pcnid, 两步走。
--   背景: 系统"集团工程节点选择器"已上线(constructionNode.js 引用入口+queryConstructionNodeForGroup
--   接口, 选中仅记录 pcnid 不动公司行字段), 但 company=0 合集只有 3 条锚点(初始/开工/完工),
--   引用功能无数据可用。本文件第一步上收通用节点为集团行补齐合集, 第二步按名称把公司行挂接。
--   注: 39 号(锚点合集版)为前置调研稿, 被本文件取代作废。
-- 范围实测(2026-11-26 生产只读库, 口径=有一家公司用即上收, 不设阈值):
--   第一步合集 = 公司行全部去重名称 31 个上收(≥30家23个 + 低频8个: 水电验收23家/镂空回填11/
--   回填防水11/保护6/验收6/清运6/拆除4/精工画线3), 属性取各公司众数(sort 众数间存在少量重复
--   如美缝/镂空回填同12, 仅影响显示排序非功能, timeLimit 全众数=0), kino=''不带工费映射
--   (照31号先例), status=0 启用, INSERT 预期 31 行;
--   第二步挂接 = 公司行 pcnid=0 按名称挂集团行, 干跑 1463 行(公司行全量挂接)。
-- 隔离性: queryConstructionNode eq 当前公司, 集团行不会混入公司节点下拉(锚点同款隔离);
--   挂接仅写 pcnid 血缘标注(parentName 回填用), 公司行 name/sort/timeLimit 等字段全部不动。
-- 执行前置条件:
--   ① 段1 基准表建立并核对(应=23行)
--   ② 段3 INSERT 后核对(应=23行), 段5 备份核对(应=1393行)
--   ③ 低峰执行; 全程行级操作无长锁
-- 幂等性: INSERT 带 NOT EXISTS 同名守卫; UPDATE 带 pcnid=0 守卫; 整文件可重复执行
--   (重跑时 INSERT 0行, UPDATE 仅挂接新增同名行)
-- 回滚方式:
--   ① 恢复公司行: UPDATE data.constructionnode n
--      JOIN data.constructionnode_bak_40_20261126 bak ON bak.cnid = n.cnid
--      SET n.pcnid = bak.pcnid;
--   ② 删除新建集团行(仅本文件新建, 锚点不在基准表不受影响):
--      DELETE FROM data.constructionnode WHERE company = 0 AND status = 0
--        AND cnid IN (SELECT cnid FROM data.constructionnode_group_base_40 WHERE cnid > 0);
--   ③ 删基准/备份表: DROP TABLE IF EXISTS data.constructionnode_group_base_40,
--      data.constructionnode_bak_40_20261126;
-- 验证语句(见文件末尾段7)
-- ============================================================================

-- ---------- 段1: 合集基准表(筛选≥30家公司同名, 众数属性) ----------
DROP TABLE IF EXISTS data.constructionnode_group_base_40;
CREATE TABLE data.constructionnode_group_base_40 AS
SELECT n.name,
       COUNT(DISTINCT n.company) AS companys,
       (SELECT t.sort FROM data.constructionnode t WHERE t.name = n.name AND t.company != 0 GROUP BY t.sort ORDER BY COUNT(*) DESC LIMIT 1) AS mode_sort,
       (SELECT t.timeLimit FROM data.constructionnode t WHERE t.name = n.name AND t.company != 0 GROUP BY t.timeLimit ORDER BY COUNT(*) DESC LIMIT 1) AS mode_timeLimit,
       0 AS cnid
FROM data.constructionnode n
WHERE n.company != 0
GROUP BY n.name;
-- 验证: SELECT COUNT(*) FROM data.constructionnode_group_base_40; -- 应 = 31
-- 核对: SELECT * FROM data.constructionnode_group_base_40 ORDER BY companys DESC;

-- ---------- 段2: INSERT 集团行(上收合集, NOT EXISTS 幂等) ----------
INSERT INTO data.constructionnode
  (name, pcnid, startalk, endtalk, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, mark, account, status, company, salaryFloor)
SELECT b.name, 0, '', '', b.mode_timeLimit, 99999000, 99999000, 0, b.mode_sort, 0, '', 0, 0, 0, 0, 0
FROM data.constructionnode_group_base_40 b
WHERE NOT EXISTS (SELECT 1 FROM data.constructionnode g WHERE g.name = b.name AND g.company = 0);
-- 预期影响 = 31

-- ---------- 段3: 基准表回填 cnid ----------
UPDATE data.constructionnode_group_base_40 b
JOIN data.constructionnode g ON g.name = b.name AND g.company = 0
SET b.cnid = g.cnid
WHERE b.cnid = 0;
-- 验证: SELECT COUNT(*) FROM data.constructionnode_group_base_40 WHERE cnid = 0; -- 应 = 0

-- ---------- 段4: 挂接备份(先建后跑) ----------
CREATE TABLE data.constructionnode_bak_40_20261126 AS
SELECT n.cnid, n.pcnid, n.name, n.company
FROM data.constructionnode n
JOIN data.constructionnode_group_base_40 b ON b.name = n.name
WHERE n.company != 0
  AND n.pcnid = 0;
-- 验证: SELECT COUNT(*) FROM data.constructionnode_bak_40_20261126; -- 应 = 1463

-- ---------- 段5: 分公司行关联更新 pcnid ----------
UPDATE data.constructionnode n
JOIN data.constructionnode_group_base_40 b ON b.name = n.name
SET n.pcnid = b.cnid
WHERE n.company != 0
  AND n.pcnid = 0;
-- 预期影响 = 1463(2026-11-26 只读库干跑)

-- ---------- 段6: 验证(执行后应全部 = 0) ----------
-- ① 合集节点同名公司行未挂接残留:
SELECT COUNT(*) AS residue
FROM data.constructionnode n
JOIN data.constructionnode_group_base_40 b ON b.name = n.name
WHERE n.company != 0 AND n.pcnid = 0;

-- ② 挂接正确性: 本批挂接行 pcnid 应全部指向 company=0 行:
SELECT COUNT(*) AS bad_ref
FROM data.constructionnode n
JOIN data.constructionnode_bak_40_20261126 bak ON bak.cnid = n.cnid
WHERE n.pcnid != 0 AND NOT EXISTS (SELECT 1 FROM data.constructionnode g WHERE g.cnid = n.pcnid AND g.company = 0);

-- 总核对: 合集规模(31集团新行+2锚点有效行) 与 挂接分布
SELECT COUNT(*) AS group_total FROM data.constructionnode WHERE company = 0;
SELECT b.name, b.companys, COUNT(n.cnid) AS linked_rows
FROM data.constructionnode_group_base_40 b
LEFT JOIN data.constructionnode n ON n.pcnid = b.cnid AND n.company != 0
GROUP BY b.name, b.companys ORDER BY linked_rows DESC;
