-- ============================================================================
-- 39_constructionnode_pcnid_group_link.sql
-- ============================================================================
-- 🔴 已作废(2026-11-26): 被同日 40_constructionnode_group_build_and_link.sql 取代——
--   本文件仅按既有 3 锚点合集(初始/开工/完工)做挂接模板, 实测 0 行可更;
--   40 号先上收 23 个通用节点为集团行再挂接(1393 行), 两步走为终版。本文件留档勿执行。
-- ============================================================================
-- 用途: constructionNode 集团合集整理 + 分公司行补挂集团引用(pcnid), 两部分。
--   pcnid 语义=上级节点引用(0=集团/自建, >0=引用行)。
-- 🔴 现状(2026-11-26 生产只读库): 集团合集仅 3 条锚点节点(初始cnid=0/开工cnid=1/完工cnid=2);
--   公司行 1463 条全部 pcnid=0(零挂接), 但名称体系为实际工序(电工/水暖/瓦工/木工/油工/
--   铲大白/放线/保洁…), 与集团合集"初始/开工/完工"**名称零交集**——段2 当前执行影响 = 0 行。
--   本文件保留标准更新语句(名称精确匹配, 与 38 号 noods 同款), 集团合集日后扩充节点后
--   重跑即生效; 扩充前执行无害(0行)。
-- 执行前置条件:
--   ① 段1 基准表建立(合集快照, 供核对与更新源)
--   ② 段2 当前预期影响 = 0 行(名称零交集, 如执行结果非 0 须先核对集团合集是否已扩充)
-- 幂等性: 守卫含 pcnid=0, 已挂接行重跑不命中; 段1 基准表 DROP+CREATE 可重复执行
-- 回滚方式(按备份表, 仅当段2 影响>0 时适用):
--   UPDATE data.constructionnode n
--   JOIN data.constructionnode_bak_39_20261126 bak ON bak.cnid = n.cnid
--   SET n.pcnid = bak.pcnid;
-- 验证语句(见文件末尾段3)
-- ============================================================================

-- ---------- 段1: company=0 集团合集(基准快照) ----------
DROP TABLE IF EXISTS data.constructionnode_group_base_39;
CREATE TABLE data.constructionnode_group_base_39 AS
SELECT cnid, pcnid, name, sort, kino, kiname, status
FROM data.constructionnode
WHERE company = 0
  AND cnid > 0;           -- 排除 cnid=0"初始"占位行: 挂 pcnid=0 无法与未挂接区分, 不可作目标
-- 合集核对: SELECT * FROM data.constructionnode_group_base_39;
--          -- 2026-11-26 实测 2 行: cnid=1 开工 / cnid=2 完工(均 status=0)

-- ---------- 段2: 分公司行补挂集团引用 ----------
-- 🔴 2026-11-26 实测预期影响 = 0 行(公司1463行名称与合集零交集), 执行安全;
--    集团合集扩充实际工序节点后重跑本段即生效。
CREATE TABLE data.constructionnode_bak_39_20261126 AS
SELECT n.cnid, n.pcnid, n.name, n.company
FROM data.constructionnode n
JOIN data.constructionnode_group_base_39 g ON g.name = n.name AND g.status = 0
WHERE n.company != 0
  AND n.pcnid = 0;

UPDATE data.constructionnode n
JOIN data.constructionnode_group_base_39 g ON g.name = n.name AND g.status = 0
SET n.pcnid = g.cnid
WHERE n.company != 0
  AND n.pcnid = 0;
-- 预期影响行数 = 0(2026-11-26 实测; 集团扩充后重跑以实际为准)

-- ---------- 段3: 验证 ----------
-- 同名启用集团行存在但公司行仍未挂接的残留(扩充后执行应为 0):
SELECT COUNT(*) AS residue
FROM data.constructionnode n
JOIN data.constructionnode_group_base_39 g ON g.name = n.name AND g.status = 0
WHERE n.company != 0 AND n.pcnid = 0;

-- 挂接正确性: 本批挂接行的 pcnid 应全部指向 company=0 行(影响>0 时核对):
SELECT COUNT(*) AS bad_ref
FROM data.constructionnode n
JOIN data.constructionnode_bak_39_20261126 bak ON bak.cnid = n.cnid
WHERE n.pcnid != 0 AND NOT EXISTS (SELECT 1 FROM data.constructionnode g WHERE g.cnid = n.pcnid AND g.company = 0);
