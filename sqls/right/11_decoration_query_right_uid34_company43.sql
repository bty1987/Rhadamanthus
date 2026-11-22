-- ============================================================================
-- 文件: 11_decoration_query_right_uid34_company43.sql
-- 库表: platform.decorationdesigndepartmentright / platform.decorationsalesmandepartmentright / platform.decorationstatusright
-- 用途: 给 uid=34(白添宇) 开通 盘锦宜家装饰(company=43) 的装修单查询范围。
--       装修单三个查询页(通用/设计/业务)的取数逻辑(DecorationServiceImpl
--       pageDecorationForCommon/ForDesigner/ForSalesman):对应权限表无行=查不到任何单,
--       行值 -1=全部(dId=-1全部门 / status=-1全状态)。
--       uid=34在其余53个公司均已是"dId=-1 + status=-1(部分公司另有salesman -1)"的同款
--       全范围配置,本脚本仅为 company=43 补齐同款三行。
-- 执行前置条件:
--   SELECT COUNT(*) FROM platform.decorationdesigndepartmentright WHERE uId=34 AND company=43;  期望 = 0
--   SELECT COUNT(*) FROM platform.decorationsalesmandepartmentright WHERE uId=34 AND company=43; 期望 = 0
--   SELECT COUNT(*) FROM platform.decorationstatusright WHERE uId=34 AND company=43;            期望 = 0
-- 回滚方式:
--   DELETE FROM platform.decorationdesigndepartmentright WHERE uId=34 AND dId=-1 AND company=43;
--   DELETE FROM platform.decorationsalesmandepartmentright WHERE uId=34 AND dId=-1 AND company=43;
--   DELETE FROM platform.decorationstatusright WHERE uId=34 AND status=-1 AND company=43;
-- 幂等性: NOT EXISTS 守卫,可重复执行。
-- ============================================================================

INSERT INTO platform.decorationdesigndepartmentright (uId, dId, company)
SELECT 34, -1, 43
WHERE NOT EXISTS (SELECT 1 FROM platform.decorationdesigndepartmentright WHERE uId = 34 AND dId = -1 AND company = 43);

INSERT INTO platform.decorationsalesmandepartmentright (uId, dId, company)
SELECT 34, -1, 43
WHERE NOT EXISTS (SELECT 1 FROM platform.decorationsalesmandepartmentright WHERE uId = 34 AND dId = -1 AND company = 43);

INSERT INTO platform.decorationstatusright (uId, status, company)
SELECT 34, -1, 43
WHERE NOT EXISTS (SELECT 1 FROM platform.decorationstatusright WHERE uId = 34 AND status = -1 AND company = 43);

-- ============================================================================
-- 验证语句(执行后核对,三行均应为 1):
--   SELECT COUNT(*) FROM platform.decorationdesigndepartmentright WHERE uId=34 AND dId=-1 AND company=43;
--   SELECT COUNT(*) FROM platform.decorationsalesmandepartmentright WHERE uId=34 AND dId=-1 AND company=43;
--   SELECT COUNT(*) FROM platform.decorationstatusright WHERE uId=34 AND status=-1 AND company=43;
-- 生效方式: 纯数据行,免发版免重启,执行后刷新装修单页面即可查询。
-- ============================================================================
