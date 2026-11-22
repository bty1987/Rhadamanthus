-- =====================================================================
-- 58号SQL: 人员规则口径转换接口operation登记(updateCustomerUserRuleForAdvance)
-- =====================================================================
-- 用途:
--   customerUserRule 口径不流通改造(2026-11-22拍板)配套: 原 updateCustomerUserRuleForStatus
--   不再提供管理(5/6)↔个人(0/1)跨族转换, 新增专用转换接口 updateCustomerUserRuleForAdvance
--   (6管理启用↔0个人启用、5管理禁用↔1个人停用四条边), 仅人员规则-管理页面提供入口。
--   本SQL登记新接口 operation(照同族 updateCustomerUserRuleForStatus oid=1076 形态:
--   moduleId=240 customer域, through=1 免检仅需登录, type=0)。
--
-- 执行前置条件:
--   1) 下述 operation 未登记(预检应返回空)
--   2) 代码侧新端点已随 customer jar 部署(插行即生效, 无需重启; 未部署jar时该operation
--      调用报无Action, 先部署jar再执行本SQL亦可)
--
-- 回滚方式:
--   DELETE FROM communion.operation WHERE operation='updateCustomerUserRuleForAdvance';
--
-- 验证语句:
--   SELECT oid,operation,name,moduleId,through FROM communion.operation
--   WHERE operation='updateCustomerUserRuleForAdvance';  -- 应返回1行
-- =====================================================================

-- ---------- 预检: 期望空 ----------
SELECT oid FROM communion.operation WHERE operation='updateCustomerUserRuleForAdvance';

-- ---------- 登记: NOT EXISTS 幂等 ----------
INSERT INTO communion.operation (operation, name, moduleId, type, through, status)
SELECT 'updateCustomerUserRuleForAdvance', '转换客户人员规则口径', 240, 0, 1, 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation='updateCustomerUserRuleForAdvance');

-- ---------- 终验: 应1行 ----------
SELECT oid,operation,name,moduleId,through,status FROM communion.operation WHERE operation='updateCustomerUserRuleForAdvance';
