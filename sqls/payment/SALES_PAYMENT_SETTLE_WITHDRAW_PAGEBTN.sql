-- 销售单落款/撤款 上线配置SQL（✅已在生产执行——2026-10-15核验 pfrid=4300(pfid=91,type=8,company=1) 在产,
--                             本文件留存作历史记录; 现行总控=sqls/sales/SALES_PAGE_BTN_SETTLE_WITHDRAW_BALANCE.sql）
-- 背景：销售收款页(salesPayment, type=8)行操作"落款/撤款"由 platform.paymentfunctionright 行门控
--       (前端 paymentUtils.getConfig(pageType, 8) 按 name+type 拉取, pageBtn 值进 pageConfig.pageBtn)。
-- 现状(2026-10-05 生产核验)：
--   落款 pfid=179: paymentfunction(pageBtn=settle) 已有, right 行 (name='common', type=8, company=1) 已存在 → 按钮已可见
--   撤款 pfid=91 : paymentfunction(pageBtn=withdraw) 已有, right 行仅 type=1(服务收款管理页payment.js), 缺 type=8 → 销售收款页按钮不可见
-- 说明：queryPaymentFunctionRight 不按 company 过滤(全删重插维护), company 列仅登记来源不作门控;
--       operation 表 settleSalesPayment 已注册(through=1); withdrawSalesPayment 未注册——未注册自动收集放行, 功能不受阻, 注册后获得名字与关闸能力(可选)。
-- 幂等性：本脚本可重复执行(NOT EXISTS 防重)。

INSERT INTO platform.paymentfunctionright (company, pfid, name, type)
SELECT 1, 91, 'common', 8
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM platform.paymentfunctionright WHERE name = 'common' AND type = 8 AND pfid = 91
);

-- 可选(拍板项)：登记撤款接口名, 使其与落款一致具备命名与后续关闸能力
-- INSERT INTO communion.operation (operation, name, through, status, type)
-- SELECT 'withdrawSalesPayment', '撤销销售款', 1, 0, 0 FROM DUAL
-- WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'withdrawSalesPayment');
