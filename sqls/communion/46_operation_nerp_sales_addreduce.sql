-- ============================================================================
-- 46_operation_nerp_sales_addreduce.sql
-- NERP 销售款项/增减款同步接口 operation 登记
-- ============================================================================
-- 背景：
--   seiya 模块 A20261025Action 新增两个 NERP 同步接口：
--     syncSalesPaymentForNerp  销售款项同步（sales.sales 判断补充 + salespayment 终态落行,
--                              type=2 定金/3 补款/4 退款, 退款凭空生成 salesRefunds）
--     syncAddreduceForNerp     增减款同步（quotation.addreduce 判断补充 + 经提交链落
--                              decorationpayment 增减款, dpId 回写）
--   沿 NERP 迁移系列（20/21 号）惯例：through=2 免登通用, moduleId=6 装修域,
--   调用方必传 authentication（ERP 分配认证串）, 操作账号取认证串。
--
-- ⚠️ 注意：
--   1. 重复执行安全（NOT EXISTS 防重）。
--   2. 先于 seiya jar 发版执行（接口未注册时调用被拦截器拒绝）。
--
-- 验证：
--   SELECT operation, through, moduleId FROM communion.operation
--   WHERE operation IN ('syncSalesPaymentForNerp', 'syncAddreduceForNerp');
--   预期 2 行, through=2。
-- ============================================================================

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'NERP销售款项同步', 'syncSalesPaymentForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncSalesPaymentForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'NERP增减款同步', 'syncAddreduceForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncAddreduceForNerp');
