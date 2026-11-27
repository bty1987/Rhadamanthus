-- =====================================================================
-- 62: operation 登记合同场景专用客户信息查询接口 queryCustomerForContract
-- =====================================================================
-- 用途:
--   1. communion.operation 登记 oid=2310 `queryCustomerForContract`
--      (moduleId=240, through=0 强权限, 照 77 `queryCustomerForPhone` 同型)
--   2. 背景: 合同页( WebContent/js/contract/C-*.js 共 23 个)已由 77 切换至
--      本新接口; 77 将由管理员另行整体收权停用(非合同场景明文口随之关闭)
--   3. 客户实名认证闸已生效: 客户状态 < STATUS_AUTH_INT(1) 时新接口抛 130189
--      (实现: CustomerServiceImpl.checkCustomerAuthForPhone, 34/77/2310 三口同闸)
-- 执行前置条件:
--   - 后端 jar(communion 模块)与前端( 23 合同页 + api/data.js)已部署或同批部署
--   - 生产 operation 无 2310/同名占用(脚本内 NOT EXISTS 守卫, 重复执行幂等)
-- 回滚方式:
--   DELETE FROM communion.roleoperation WHERE oid = 2310;  -- 如已配权先清配权
--   DELETE FROM communion.operation WHERE oid = 2310 AND operation = 'queryCustomerForContract';
-- 验证语句:
--   SELECT oid, moduleId, name, operation, through, status
--   FROM communion.operation WHERE oid = 2310;
--   SELECT rid, company FROM communion.roleoperation WHERE oid = 2310;  -- 配权后核对
-- =====================================================================

-- 登记接口( 幂等; oid 取当前 MAX+1 动态值, 预期 2310)
INSERT INTO communion.operation (oid, moduleId, name, operation, through, type, status, system, logFlag)
SELECT @oid := MAX(oid) + 1, 240, '查询客户电话(合同)', 'queryCustomerForContract', 0, 0, 0, 1, 2
FROM communion.operation
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'queryCustomerForContract');

-- =====================================================================
-- 配权模板( 角色范围待拍板后放开执行; company=0 全局生效)
-- ⚠️ 不配权则合同页查客户电话全部报无权限( through=0 强权限, 未登记放行仅对
--    through 缺失行成立, 此处已显式登记 0) — 部署窗口内须完成配权
-- =====================================================================
-- INSERT INTO communion.roleoperation (rid, oid, cuid, createTime, company)
-- SELECT r.rid, @oid, <操作人uid>, NOW(), 0
-- FROM communion.role r
-- WHERE r.rid IN ( /* 合同经办角色 rid 清单, 待拍板 */ )
--   AND NOT EXISTS (SELECT 1 FROM communion.roleoperation ro
--                   WHERE ro.rid = r.rid AND ro.oid = @oid AND ro.company = 0);
