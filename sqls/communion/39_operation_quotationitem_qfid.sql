-- =====================================================================
-- 用途: 变更记录受控接口 operation 登记【报价定额变更记录体系, 方案=docs/01-方案设计/工费材料验证变更记录体系设计.md】
--   updateQuotationItemForQfid(报价项关联规格换绑) 登记为 through=0 强权限:
--   未授权=接口被 AccessInterceptor 拦截(110005), 管理员按公司授权后才可调用(61号SQL只开通道, roleoperation 授权行另行按需插入)
--   其余变更记录埋点接口全部复用既有端点(已有 operation 行), 零登记
-- 执行前置条件:
--   与 60号(normchanerecord建表)同批, 先于 fanglin-data jar 发版
-- 回滚方式:
--   DELETE FROM communion.operation WHERE operation = 'updateQuotationItemForQfid';
-- 验证语句:
--   SELECT oid, operation, through FROM communion.operation WHERE operation = 'updateQuotationItemForQfid';  -- 应 1 行 through=0
-- 幂等性: 幂等(NOT EXISTS 守卫)
-- =====================================================================

INSERT INTO communion.operation (module, operation, name, `type`, status, system, logFlag, through)
SELECT 'data', 'updateQuotationItemForQfid', '报价项关联规格换绑(变更记录受控)', 0, 0, 1, 2, 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.operation WHERE operation = 'updateQuotationItemForQfid'
);
