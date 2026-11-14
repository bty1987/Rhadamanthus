-- =====================================================================
-- 用途: 变更记录受控接口 operation 登记【报价明细行换绑报价项(换规格), 方案=docs/01-方案设计/报价明细规格更换方案.md】
--   updateQuotationFunctionAreaItemForFormat 登记为 through=0 强权限(复刻39号口径):
--   未授权=接口被 AccessInterceptor 拦截(110005), 管理员按公司授权后才可调用(本SQL只开通道, roleoperation 授权行另行按需插入)
--   配套: error.md 200073/200074/200075 + normchanerecord TYPE=9(TYPE_QUOTATIONFUNCTIONAREAITEM_QIID_INT)
--   查询端点 queryQuotationItemForFormatByQiid 不登记(查询放行)
-- 执行前置条件:
--   先于 fanglin-quotation jar + fanglin-data jar 发版
-- 回滚方式:
--   DELETE FROM communion.operation WHERE operation = 'updateQuotationFunctionAreaItemForFormat';
-- 验证语句:
--   SELECT oid, operation, through FROM communion.operation WHERE operation = 'updateQuotationFunctionAreaItemForFormat';  -- 应 1 行 through=0
-- 幂等性: 幂等(NOT EXISTS 守卫)
-- =====================================================================

INSERT INTO communion.operation (module, operation, name, `type`, status, system, logFlag, through)
SELECT 'quotation', 'updateQuotationFunctionAreaItemForFormat', '报价明细行更换规格(变更记录受控)', 0, 0, 1, 2, 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.operation WHERE operation = 'updateQuotationFunctionAreaItemForFormat'
);
