-- ============================================================================
-- 文件: 54_operation_logflag_management_audit.sql
-- 库表: communion.operation
-- 用途: management.html(内部数据修复/运营工具页)写操作接口的操作记录审计整改
-- 排查结论(2026-11-21 生产实测):
--   23 个写操作接口(改单号/时间/状态/等级/归属/密钥/隐藏/退款等)中:
--   - 仅 changeDecorationForStatus 有双层记录(业务侧 ActionLogContext.bind 强制 actionlog,
--     实录 1633 条) + updateDecorationForGrade 有业务留痕(serviceRecord 原等级/现等级)
--   - 其余 21 个接口: operation.logFlag 全部=2(AUTO,拦截器默认不记) + 无显式 LogUtils 埋点
--     + 无业务留痕 = 完全零记录
--   - 其中 3 个接口连 operation 都未登记(updateDecorationForGrade/updateKey/updateSales):
--     未登记=拦截器放行 = 无权限校验(任何登录用户可调, updateKey 为改支付渠道密钥, 高危)
-- 整改方案(分阶段, 规避"登记强权限即断业务"风险):
--   第一阶段(本脚本): 20 个已登记接口 logFlag 2→1(ALWAYS, 拦截器自动记
--     actionlog: 谁/何时/IP/请求参数JSON(脱敏)/耗时); 3 个未登记接口补登记为
--     through=1 + logFlag=1(免检但开始记录, 不破坏现有使用)
--   第二阶段(后续单独脚本, 需拍板授权角色): 上述 3 个接口 through 1→0 收紧为强权限,
--     并配套 roleoperation 授权(rid×oid×company); 建议连带评估 updateKey 的密钥变更告警
--   附带: 导出类 3 接口(exportMaterialPayment/exportDecorationByContractTime/exportDecorationPayment,
--     数据外发)logFlag 同步 2→1, 记录 EXPORT 类操作
-- 生效: 即插即生效免重启(recorder 每次 finally 现查 logFlag); actionlog 写入 log.actionlog 总表
-- 执行前置条件: 无
-- 回滚方式:
--   UPDATE communion.operation SET logFlag = 2 WHERE operation IN (
--     'changeDecorationForOrderId','changeDecorationForTime','changeDecorationForVersionId',
--     'changeDecorationPaymentForTime','refundDecorationPayment','changeMaterialForOrderId',
--     'amountDecorationActivityItem','updateDecorationHolonomy','updateDecorationMidpack',
--     'changeDecorationForStatus','changeMaterialPaymentForTime','subDecorationForQuotationTime',
--     'updateQuotationFunctionAreaItemByQuotationIdAType','updateQuotationForStatus',
--     'addQuotationFunctionArea','updateSalesForAdvance','checkoutConstructionSchedule',
--     'changeDecorationForPayScale','hiddenDecoration','resetDecorationFordesignStatus',
--     'exportMaterialPayment','exportDecorationByContractTime','exportDecorationPayment');
--   DELETE FROM communion.operation WHERE operation IN ('updateDecorationForGrade','updateKey','updateSales');
-- 幂等性: UPDATE 重复执行结果一致; INSERT NOT EXISTS 防重
-- ============================================================================

-- ============ 一、已登记接口: logFlag 2→1 开启拦截器统一记录(23行) ============

UPDATE communion.operation SET logFlag = 1 WHERE operation IN (
  'changeDecorationForOrderId',        -- 改装修单号
  'changeDecorationForTime',           -- 改装修单时间(录入/签单/预签)
  'changeDecorationForVersionId',      -- 改报价版本
  'changeDecorationPaymentForTime',    -- 改装修款项时间
  'changeMaterialForOrderId',          -- 改销售单归属装修单
  'amountDecorationActivityItem',      -- 重算活动物品
  'updateDecorationHolonomy',          -- 改整装主材价
  'updateDecorationMidpack',           -- 改中间包主材价
  'changeDecorationForStatus',         -- 改装修单状态(已有bind双层, logFlag=1后免bind也记)
  'changeMaterialPaymentForTime',      -- 改主材款项时间
  'subDecorationForQuotationTime',     -- 改报价时间
  'updateQuotationFunctionAreaItemByQuotationIdAType', -- 改报价管理费率
  'updateQuotationForStatus',          -- 改报价单状态
  'updateSalesForAdvance',             -- 改销售单(状态/信息)
  'checkoutConstructionSchedule',      -- 改施工节点验收
  'changeDecorationForPayScale',       -- 改业务员提成比例
  'hiddenDecoration',                  -- 切换装修单隐藏
  'addQuotationFunctionArea',          -- 加报价功能区
  'refundDecorationPayment',           -- 装修款项退款
  'resetDecorationFordesignStatus',    -- 重置设计状态
  'exportMaterialPayment',             -- 导出主材收款(数据外发)
  'exportDecorationByContractTime',    -- 导出签约装修单(数据外发)
  'exportDecorationPayment'            -- 导出装修款项(数据外发)
) AND logFlag = 2;

-- ============ 二、未登记接口补登记: through=1(免检不断业务) + logFlag=1(开始记录) ============
-- ⚠️ 第二阶段收紧时: UPDATE through=0 + roleoperation 授权(rid×oid×company, 需拍板管理页使用角色)

INSERT INTO communion.operation (operation, through, logFlag, status, system)
SELECT 'updateDecorationForGrade', 1, 1, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'updateDecorationForGrade');

INSERT INTO communion.operation (operation, through, logFlag, status, system)
SELECT 'updateKey', 1, 1, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'updateKey');

INSERT INTO communion.operation (operation, through, logFlag, status, system)
SELECT 'updateSales', 1, 1, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'updateSales');

-- ============ 三、验证段 ============

-- 1. 26 个接口档位核对(期望: 23个logFlag=1 + 3个新增through=1且logFlag=1)
SELECT operation, through, logFlag, status FROM communion.operation
WHERE operation IN (
  'changeDecorationForOrderId','changeDecorationForTime','changeDecorationForVersionId',
  'changeDecorationPaymentForTime','refundDecorationPayment','changeMaterialForOrderId',
  'updateDecorationForGrade','amountDecorationActivityItem','updateDecorationHolonomy',
  'updateDecorationMidpack','changeDecorationForStatus','changeMaterialPaymentForTime',
  'subDecorationForQuotationTime','updateQuotationFunctionAreaItemByQuotationIdAType',
  'updateQuotationForStatus','addQuotationFunctionArea','updateSales','updateSalesForAdvance',
  'checkoutConstructionSchedule','changeDecorationForPayScale','updateKey',
  'hiddenDecoration','resetDecorationFordesignStatus',
  'exportMaterialPayment','exportDecorationByContractTime','exportDecorationPayment')
ORDER BY logFlag, operation;

-- 2. 残留核对(期望0行: 本批接口不允许 logFlag=2 或未登记)
SELECT operation FROM communion.operation
WHERE operation IN (
  'changeDecorationForOrderId','changeDecorationForTime','changeDecorationForVersionId',
  'changeDecorationPaymentForTime','refundDecorationPayment','changeMaterialForOrderId',
  'updateDecorationForGrade','amountDecorationActivityItem','updateDecorationHolonomy',
  'updateDecorationMidpack','changeDecorationForStatus','changeMaterialPaymentForTime',
  'subDecorationForQuotationTime','updateQuotationFunctionAreaItemByQuotationIdAType',
  'updateQuotationForStatus','addQuotationFunctionArea','updateSales','updateSalesForAdvance',
  'checkoutConstructionSchedule','changeDecorationForPayScale','updateKey',
  'hiddenDecoration','resetDecorationFordesignStatus',
  'exportMaterialPayment','exportDecorationByContractTime','exportDecorationPayment')
AND (logFlag IS NULL OR logFlag != 1);
