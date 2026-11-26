-- ============================================================================
-- 61_operation_quotationitem_cost.sql
-- ============================================================================
-- 用途: 补登记 updateQuotationItemForCost(报价项成本修改) communion.operation。
--   报价项族既有接口全部登记(oid 575-1321, 全 through=1), 仅 ForCost 漏登(未登记=放行,
--   前端成本按钮在用, 功能不受影响); 补齐规范化。
--   注意: updateQuotationItemForQfid(换绑规格)不走本文件——已有 39 号 SQL 专用设计
--   (through=0 强权限, 落盘待执行), 两者勿混。
-- 执行前置: communion 库; 无表结构依赖
-- 回滚方式: DELETE FROM communion.operation WHERE operation = 'updateQuotationItemForCost';
-- 验证语句: SELECT oid, operation, through FROM communion.operation WHERE operation = 'updateQuotationItemForCost'; -- 期望1行 through=1
-- 幂等: NOT EXISTS 守卫
-- ============================================================================

INSERT INTO communion.operation (module, operation, name, `type`, status, system, logFlag, through)
SELECT 'data', 'updateQuotationItemForCost', '更新报价项成本', 0, 0, 1, 2, 1
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.operation WHERE operation = 'updateQuotationItemForCost'
);
