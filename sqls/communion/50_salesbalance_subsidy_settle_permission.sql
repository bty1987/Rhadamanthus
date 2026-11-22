-- ============================================================================
-- 文件: 50_salesbalance_subsidy_settle_permission.sql
-- 库表: communion.roleoperation (+ tempbase 备份)
-- 用途: 【销售-结算-结算-补贴-装修(mid844)】与【销售-结算-结算-补贴-销售(mid869)】两页面
--       (同页 salesBalance.html 不同type参数)的"结算"操作收权至 5 个财务角色:
--       方林主材财务主管(295) / 方林主材财务经理(294) / 方林主材会计(296) /
--       自营财务会计(42) / 自营财务经理(40)
-- 覆盖接口: 仅 postSalesBalance(销售结算, oid=268, moduleId=457, through=0 本就强权限) —— 页面行操作"结算"按钮
--   ⚠️ 其余结算族接口(VIP结算1092/预结算1226/驳回1172/P结算1114/V结算1177, 均through=1免检)按用户拍板不动
-- 排查结论(生产只读库实测 2026-11-19): 268 现有授权 9 角色 666 行, 含游客(82, 97行, 异常)/
--   供应链专员(439, 74)/供应链经理(438, 64)/方林资金组审批员(350, 74)/方林资金组收款员(351, 62)/
--   方林采购专员(319, 59); 目标5角色中 294/295/296 已有授权(含company=0集团行),
--   自营财务经理(40)/自营财务会计(42) 完全没有授权(需新增); App 端(Ding/Wechat)零调用纯 PC
-- 方案: 纯 roleoperation 收权——备份 → 删除非目标角色行 → 补授权 5角色×(company=0集团+在营1-103)
-- 生效: 即插即生效免重启(拦截器checkOperation每次现查); 无授权角色点"结算"返回-2无操作权限(前端按钮不隐藏)
-- 执行前置条件: 无
-- 回滚方式: ①DELETE FROM communion.roleoperation WHERE oid = 268;
--           ②INSERT INTO communion.roleoperation (rid,oid,cuid,company) SELECT rid,oid,cuid,company FROM tempbase.bak_20261119_salesbalance_settle;
-- 幂等性: 备份NOT EXISTS防重 / DELETE按rid+oid守卫可重复执行 / 补授权NOT EXISTS防重
-- ============================================================================

-- ============ 一、备份(先建备份表并回报行数, 预期≈666行) ============

CREATE TABLE IF NOT EXISTS tempbase.bak_20261119_salesbalance_settle AS
SELECT rid, oid, cuid, company FROM communion.roleoperation WHERE 1 = 0;

INSERT INTO tempbase.bak_20261119_salesbalance_settle (rid, oid, cuid, company)
SELECT ro.rid, ro.oid, ro.cuid, ro.company
FROM communion.roleoperation ro
WHERE ro.oid = 268
  AND NOT EXISTS (
    SELECT 1 FROM tempbase.bak_20261119_salesbalance_settle b
    WHERE b.rid = ro.rid AND b.oid = ro.oid AND b.company = ro.company
  );

-- ============ 二、删除非目标角色授权行(游客/供应链/资金组/采购等, 期望影响约430行) ============

DELETE FROM communion.roleoperation
WHERE oid = 268
  AND rid NOT IN (40, 42, 294, 295, 296);

-- ============ 三、补授权: 5角色 × (company=0集团 + 在营1-103) NOT EXISTS幂等(期望新增约200行) ============

INSERT INTO communion.roleoperation (rid, oid, cuid, company)
SELECT t.rid, 268, 0, c.cid
FROM (SELECT 40 AS rid UNION SELECT 42 UNION SELECT 294 UNION SELECT 295 UNION SELECT 296) t
JOIN communion.company c ON (c.cid = 0 OR (c.cid > 0 AND c.status = 0))
WHERE NOT EXISTS (
    SELECT 1 FROM communion.roleoperation ro
    WHERE ro.oid = 268 AND ro.rid = t.rid AND ro.company = c.cid
  );

-- ============ 四、验证段 ============

-- 1. 授权角色集合核对(期望仅5角色, rid IN 40/42/294/295/296)
SELECT DISTINCT ro.rid, r.name FROM communion.roleoperation ro
JOIN communion.role r ON r.rid = ro.rid
WHERE ro.oid = 268 ORDER BY ro.rid;

-- 2. 行数对账(期望=5×(1集团+102在营)=515行上下, 294/295/296历史行含停用公司company可能略多)
SELECT ro.oid, COUNT(*) rows_cnt, COUNT(DISTINCT ro.rid) role_cnt, COUNT(DISTINCT ro.company) company_cnt
FROM communion.roleoperation ro
WHERE ro.oid = 268
GROUP BY ro.oid;

-- 3. 游客等已收权角色残留核对(期望0行)
SELECT ro.rid, ro.company FROM communion.roleoperation ro
WHERE ro.oid = 268 AND ro.rid NOT IN (40, 42, 294, 295, 296);
