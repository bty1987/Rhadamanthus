-- ============================================================================
-- 文件: 38_roleoperation_belong_tran_grant.sql
-- 库表: communion.roleoperation (授权) 关联 communion.operation (oid 定位)
-- 用途: 离职归属移交 BelongTran 4端点(61号SQL登记的 through=0 强权限)授权投放——
--       🔴 61号执行后若本脚本不跑, 所有角色调这4个接口一律被拦, 功能等于不可用;
--       通过=0的接口必须配授权行(rid,oid,company 三元组, 参照纯三元组模式)
-- 授权面(默认草案, 🔴执行前由业务圈定后替换 rid 名单):
--       86=系统管理员 / 168=超级管理员 / 117=人事总监 / 272=方林人力主管
--       (移交=批量高危写, 建议仅管理员系+人资经办; 各公司负责人是否放开按需加 rid)
-- 公司面: 全部在营公司(communion.company status=0, 现网=103家)× 4 oid 全矩阵
-- 执行前置条件:
--       ① sqls/approval/61_belong_tran_operation.sql 已执行(4 operation 行存在);
--       ② 干跑段核对 oid 数=4、将插行数=角色数×4×在营公司数
-- 回滚方式: DELETE FROM communion.roleoperation WHERE oid IN (SELECT oid FROM communion.operation WHERE operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger','submitApprovalForBelongTran','queryApprovalBelongTranByAId')) AND rid IN (86,168,117,272) AND createTime >= '<本次执行时间>';
--       —— 或直接按页面删角色授权(系统管理-角色权限配置页同效, 优先页面操作)
-- 验证语句: SELECT o.operation, COUNT(*) FROM communion.roleoperation ro
--           JOIN communion.operation o ON o.oid=ro.oid
--           WHERE o.operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger','submitApprovalForBelongTran','queryApprovalBelongTranByAId')
--           GROUP BY o.operation;  -- 期望每行 = 名单角色数×在营公司数
-- 幂等性: NOT EXISTS 按(rid,oid,company)防重, 可重复执行
-- ============================================================================

-- ============ 干跑段(执行前先跑核对) ============

-- 1. 四个新端点的 oid(应恰好4行)
SELECT oid, operation, name, `through` FROM communion.operation
WHERE operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger','submitApprovalForBelongTran','queryApprovalBelongTranByAId');

-- 2. 默认名单角色存在性核对(4行, 替换名单后重跑)
SELECT rid, name FROM communion.role WHERE rid IN (86, 168, 117, 272);

-- 3. 将插入行数 = 角色数 × oid数 × 在营公司数
SELECT (SELECT COUNT(*) FROM communion.role WHERE rid IN (86, 168, 117, 272))
     * (SELECT COUNT(*) FROM communion.operation WHERE operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger','submitApprovalForBelongTran','queryApprovalBelongTranByAId'))
     * (SELECT COUNT(*) FROM communion.company WHERE status = 0) AS willInsertRows;

-- ============ 授权插入(🔴 rid 名单为参数, 业务圈定后替换) ============

INSERT INTO communion.roleoperation (rid, oid, cuid, company, createTime)
SELECT r.rid, o.oid, 34, c.cid, NOW()
FROM communion.role r
JOIN communion.operation o ON o.operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger','submitApprovalForBelongTran','queryApprovalBelongTranByAId')
JOIN communion.company c ON c.status = 0
WHERE r.rid IN (86, 168, 117, 272)
  AND NOT EXISTS (
      SELECT 1 FROM communion.roleoperation x
      WHERE x.rid = r.rid AND x.oid = o.oid AND x.company = c.cid
  );

-- ============ 验证段 ============

SELECT o.operation, COUNT(*) AS grantRows, COUNT(DISTINCT ro.company) AS companies
FROM communion.roleoperation ro
JOIN communion.operation o ON o.oid = ro.oid
WHERE o.operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger','submitApprovalForBelongTran','queryApprovalBelongTranByAId')
GROUP BY o.operation;
