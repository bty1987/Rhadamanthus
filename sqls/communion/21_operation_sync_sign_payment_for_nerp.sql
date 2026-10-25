-- ============================================================================
-- 21_operation_sync_sign_payment_for_nerp.sql
-- NERP签约/款项同步接口(syncSignContractForNerp/syncDecorationPaymentForNerp)所需 operation 注册
-- ============================================================================
-- 背景：
--   seiya 模块 A20261025Action（2026-10-25 新增）对外提供两个 NERP 迁移同步接口：
--     syncSignContractForNerp        匹配 signDecorationContract: 订单无默认报价时凭空
--                                    创建无明细报价单并锁单, 装修单推进签约状态(3),
--                                    归属提成挂账; 相对原版放宽款项交付/工程信息前置
--     syncDecorationPaymentForNerp   匹配 makeDecorationPayment: 按款项比例方案(psid)将
--                                    提交额(money)拆分为未收装修款项, 支撑后续 ERP 正常收款
--
--   接口走 AccessInterceptor 统一鉴权，through=2（免登通用）放行：
--   调用方必传 authentication（ERP 分配的认证串），无需 ERP 登录态。
--   签约人/报价创建人/款项创建人取认证串对应账号。
--
-- ⚠️ 注意：
--   1. moduleId=6 与 presignDecorationContract/signDecorationContract 同模块（装修域）。
--   2. operation 名与 Action @Action value 同名。
--   3. 重复执行安全（NOT EXISTS 防重）。
--   4. 零 DDL，仅 INSERT 两行；与 20 号(syncProsignForNerp)同属 NERP 迁移批次。
--
-- 回滚：
--   DELETE FROM communion.operation
--   WHERE operation IN ('syncSignContractForNerp', 'syncDecorationPaymentForNerp');
--
-- 验证：
--   SELECT operation, moduleId, through, status FROM communion.operation
--   WHERE operation IN ('syncSignContractForNerp', 'syncDecorationPaymentForNerp');
--   预期 2 行，moduleId=6，through=2。
-- ============================================================================

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncSignContractForNerp', 'syncSignContractForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncSignContractForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncDecorationPaymentForNerp', 'syncDecorationPaymentForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncDecorationPaymentForNerp');
