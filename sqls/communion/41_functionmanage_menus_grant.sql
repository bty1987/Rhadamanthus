-- =============================================================================
-- 五模块「功能维护」菜单 rolemodule 授权补齐
-- 日期: 2026-11-14
--
-- 用途: 2026-10-09 功能字典批次(50d9094c1/a618a45e5 等)只插入了 communion.module
--       菜单行, rolemodule 授权段从未执行 → 五张「功能维护」菜单生产全网零授权,
--       任何角色菜单树均不可见(仅能 URL 直连)。本脚本照各模块「功能配置」菜单的
--       授权范围逐行复制(link/access/company 原样保留, DISTINCT 去重):
--         933 装修功能维护 ← 373 装修功能配置   (源 324 行)
--         934 客户功能维护 ← 571 客户功能配置   (源 291 行, customerOrigineFunction)
--         935 款项功能维护 ← 556 款项功能配置   (源 287 行)
--         936 报价功能维护 ← 752 报价功能配置   (源 225 行)
--         937 工程功能维护 ← 923 工程功能配置   (源 100 行)
--
-- 执行前置条件(2026-11-14 生产只读库已核实):
--   1) module 表 933-937 五行存在, system=1/level=2 ✔
--   2) rolemodule 中 mid 933-937 现存 0 行 ✔
--   3) communion.user uid=34 (白添宇) 存在(RoleModulePO.creater EAGER 关联) ✔
--   4) 测试库已按同款逻辑执行(测试菜单号为 940←410/941←617/942←598/943←752,
--      测试库工程模块无功能配置源菜单故 944 未授)
--
-- 回滚方式:
--   DELETE FROM communion.rolemodule WHERE mid IN (933,934,935,936,937);
--
-- 幂等性: NOT EXISTS(mid+rid+company) 守卫, 可重复执行
-- =============================================================================

-- 1. 装修 933 ← 373
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT DISTINCT s.rid, 933, s.link, s.access, 34, NOW(), s.company
FROM communion.rolemodule s
WHERE s.mid = 373
  AND NOT EXISTS (
    SELECT 1 FROM communion.rolemodule t
    WHERE t.mid = 933 AND t.rid = s.rid AND t.company = s.company
  );

-- 2. 客户 934 ← 571
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT DISTINCT s.rid, 934, s.link, s.access, 34, NOW(), s.company
FROM communion.rolemodule s
WHERE s.mid = 571
  AND NOT EXISTS (
    SELECT 1 FROM communion.rolemodule t
    WHERE t.mid = 934 AND t.rid = s.rid AND t.company = s.company
  );

-- 3. 款项 935 ← 556
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT DISTINCT s.rid, 935, s.link, s.access, 34, NOW(), s.company
FROM communion.rolemodule s
WHERE s.mid = 556
  AND NOT EXISTS (
    SELECT 1 FROM communion.rolemodule t
    WHERE t.mid = 935 AND t.rid = s.rid AND t.company = s.company
  );

-- 4. 报价 936 ← 752
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT DISTINCT s.rid, 936, s.link, s.access, 34, NOW(), s.company
FROM communion.rolemodule s
WHERE s.mid = 752
  AND NOT EXISTS (
    SELECT 1 FROM communion.rolemodule t
    WHERE t.mid = 936 AND t.rid = s.rid AND t.company = s.company
  );

-- 5. 工程 937 ← 923
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT DISTINCT s.rid, 937, s.link, s.access, 34, NOW(), s.company
FROM communion.rolemodule s
WHERE s.mid = 923
  AND NOT EXISTS (
    SELECT 1 FROM communion.rolemodule t
    WHERE t.mid = 937 AND t.rid = s.rid AND t.company = s.company
  );

-- =============================================================================
-- 执行后核验(五组行数应与源菜单 DISTINCT 后行数一致, 预期约 324/291/287/225/100)
-- =============================================================================
-- SELECT mid, COUNT(*) cnt, COUNT(DISTINCT rid) rids FROM communion.rolemodule
--  WHERE mid IN (933,934,935,936,937) GROUP BY mid;
--
-- 源对照:
-- SELECT mid, COUNT(*) cnt FROM communion.rolemodule
--  WHERE mid IN (373,571,556,752,923) GROUP BY mid;
