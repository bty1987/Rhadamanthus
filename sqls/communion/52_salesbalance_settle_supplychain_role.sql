-- ============================================================================
-- 文件: 52_salesbalance_settle_supplychain_role.sql
-- 库表: communion.roleoperation
-- 用途: 销售结算的"结算"操作(销售-结算, 行操作"结算"按钮+批量结算)增加两个角色可操作:
--       方林采购专员(319) / 供应链专员(439), 两角色均 company=0 通用角色, 已存在无需新建
-- 覆盖接口: 仅 postSalesBalance(销售结算, oid=268, moduleId=457, through=0 强权限) —— 页面"结算"按钮
--   其余结算族接口(VIP结算1092/预结算1226/驳回1172/P结算1114/V结算1177 均through=1免检)不涉及
-- 排查结论(生产只读库实测 2026-11-21): 319/439 对 268 当前均为零授权(50号排查时曾有74/59行,
--   期间已被清理); 268 现存授权=游客82/主材财务294/295/296/资金组350/351 六角色;
--   授权面=company=0集团行+在营(status=0)公司共103行/角色, 两角色合计期望206行,
--   与50号SQL(oid=268收权至5财务角色)执行后目标态同构
-- ⚠️ 执行顺序强约束: 必须先执行50号再执行本文件!
--   50号DELETE段(WHERE oid=268 AND rid NOT IN (40,42,294,295,296))会连带删除本文件新增的
--   319/439授权行; 顺序颠倒则本文件授权被清, 需重跑本文件即可恢复(NOT EXISTS幂等)
-- 生效: 即插即生效免重启(拦截器checkOperation每次现查); 无授权角色点"结算"返回-2无操作权限(前端按钮不隐藏)
-- 执行前置条件: 无(若50号已先执行完, 本文件直接执行即为终态)
-- 回滚方式: DELETE FROM communion.roleoperation WHERE oid = 268 AND rid IN (319, 439);
-- 幂等性: 授权NOT EXISTS防重, 可重复执行
-- ============================================================================

-- ============ 一、授权: 方林采购专员(319)/供应链专员(439) × postSalesBalance(268) × (company=0集团+在营公司) ============
-- 期望新增206行(2角色×[1集团+102在营])

INSERT INTO communion.roleoperation (rid, oid, cuid, company)
SELECT t.rid, 268, 0, c.cid
FROM (SELECT 319 AS rid UNION SELECT 439) t
JOIN communion.company c ON (c.cid = 0 OR (c.cid > 0 AND c.status = 0))
WHERE NOT EXISTS (
    SELECT 1 FROM communion.roleoperation ro
    WHERE ro.oid = 268 AND ro.rid = t.rid AND ro.company = c.cid
  );

-- ============ 二、验证段 ============

-- 1. 两角色授权行数核对(期望各103行, 覆盖103个company值)
SELECT ro.rid, r.name, COUNT(*) rows_cnt, COUNT(DISTINCT ro.company) company_cnt
FROM communion.roleoperation ro
JOIN communion.role r ON r.rid = ro.rid
WHERE ro.oid = 268 AND ro.rid IN (319, 439)
GROUP BY ro.rid, r.name;

-- 2. oid=268全量角色面核对(50号执行后期望8角色: 40/42/294/295/296/319/439/82游客残留按50号执行与否而定)
SELECT DISTINCT ro.rid, r.name FROM communion.roleoperation ro
JOIN communion.role r ON r.rid = ro.rid
WHERE ro.oid = 268 ORDER BY ro.rid;
