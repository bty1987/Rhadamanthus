-- ============================================================================
-- 文件: 49_designer_picture_delete_revoke.sql
-- 库表: communion.roleoperation (+ tempbase 备份)
-- 用途: 收紧装修资源删除权限(装修单图纸/CAD图)——设计师私自删除CAD图纸事故(2026-11-18)管控
-- 排查结论(生产只读库实测 2026-11-19):
--   接口=deleteDecorationPicture(DecorationPictureAction:66, oid=29 name=装修资源删除 moduleId=6,
--        through=0 强权限配置本身正确, Service=status置0软删无业务校验, CAD图纸=decorationpicture type=0);
--   根因=授权面过宽: 设计师类角色持有oid=29授权行, 其中 rid=144 设计师通用 4行(company 2/16/29/50 全在营);
--   附带发现: rid=162 设计总监通用 51行(含company=0集团) / rid=431 设计总监分配客源 2行(1/41) /
--             rid=82 游客 5行(1/16/29/31/50, 游客有删除权明显异常);
--   前端=decorationUtils图库红×按钮无确认弹窗直接post(纯配置管控后无授权角色点击返回-2无操作权限)
-- 方案: 纯roleoperation管控(用户拍板不改代码)——DELETE设计师通用(rid=144)的oid=29授权行;
--   设计总监(162/431)/游客(82)为可选段(③/④/⑤, 默认注释不执行), 是否收紧待用户拍板
-- 执行前置条件: 无依赖(即插即生效免重启, 拦截器checkOperation每次现查roleoperation)
-- 回滚方式: 从备份表回插 INSERT INTO communion.roleoperation (rid, oid, cuid, company) SELECT rid, oid, cuid, company FROM tempbase.bak_20261119_oid29_designer WHERE rid=<rid>;
-- 幂等性: 备份段CREATE TABLE IF NOT EXISTS+INSERT ... NOT EXISTS防重; DELETE按rid+oid值级守卫可重复执行(重复执行0行)
-- ============================================================================

-- ============ 一、备份(先建备份表并回报行数, 拟删范围=oid=29四个候选角色全部行, 预期59行) ============

CREATE TABLE IF NOT EXISTS tempbase.bak_20261119_oid29_designer AS
SELECT rid, oid, cuid, company FROM communion.roleoperation WHERE 1 = 0;

INSERT INTO tempbase.bak_20261119_oid29_designer (rid, oid, cuid, company)
SELECT ro.rid, ro.oid, ro.cuid, ro.company
FROM communion.roleoperation ro
WHERE ro.oid = 29 AND ro.rid IN (144, 162, 431, 82)
  AND NOT EXISTS (
    SELECT 1 FROM tempbase.bak_20261119_oid29_designer b
    WHERE b.rid = ro.rid AND b.oid = ro.oid AND b.company = ro.company
  );

-- ============ 二、删除 设计师通用(rid=144)的装修资源删除授权(期望影响4行: company 2/16/29/50) ============

DELETE FROM communion.roleoperation
WHERE oid = 29 AND rid = 144;

-- ============ 三、验证段 ============

-- 1. 设计师通用残留授权(期望0行)
SELECT ro.rid, r.name, ro.company FROM communion.roleoperation ro
JOIN communion.role r ON r.rid = ro.rid
WHERE ro.oid = 29 AND ro.rid = 144;

-- 2. oid=29 剩余授权总览(角色×公司数, 供复核)
SELECT ro.rid, r.name AS role_name, COUNT(*) AS rows_cnt,
       SUM(CASE WHEN c.status = 0 THEN 1 ELSE 0 END) AS active_rows
FROM communion.roleoperation ro
JOIN communion.role r ON r.rid = ro.rid
LEFT JOIN communion.company c ON c.cid = ro.company
WHERE ro.oid = 29
GROUP BY ro.rid, r.name ORDER BY rows_cnt DESC;

-- ============================================================================
-- 可选段(默认不执行, 待拍板, 执行前确认备份段已落):
-- ④ 设计总监通用(rid=162, 52行含company=0集团行)——管理岗是否保留删除权由用户定:
-- DELETE FROM communion.roleoperation WHERE oid = 29 AND rid = 162;
-- ⑤ 设计总监分配客源(rid=431, 2行: company 1/41):
-- DELETE FROM communion.roleoperation WHERE oid = 29 AND rid = 431;
-- ⑥ 游客(rid=82, 5行: company 1/16/29/31/50)——游客角色持删除权明显异常, 建议执行:
-- DELETE FROM communion.roleoperation WHERE oid = 29 AND rid = 82;
-- ============================================================================
