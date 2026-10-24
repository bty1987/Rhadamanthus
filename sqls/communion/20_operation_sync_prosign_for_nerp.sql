-- ============================================================================
-- 20_operation_sync_prosign_for_nerp.sql
-- NERP凭空预签接口(syncProsignForNerp)所需 operation 注册
-- ============================================================================
-- 背景：
--   seiya 模块 A20261024Action（2026-10-24 新增）对外提供 NERP 凭空预签接口：
--     syncProsignForNerp  不依赖 ERP 预签报价流程，凭空创建一张无明细的锁定
--                         预签单(protation)，并将装修单推进到预签状态(2)
--
--   接口走 AccessInterceptor 统一鉴权，through=2（免登通用）放行：
--   调用方必传 authentication（ERP 分配的认证串），无需 ERP 登录态。
--   through=2 下认证串两种形态均支持：
--     1) 纯账号加密串（AES(userId)，推荐，最简）
--     2) 完整登录态加密串
--   protation.creater / decorationoperate.operater 取认证串对应账号。
--
-- ⚠️ 注意：
--   1. moduleId=6 与 presignDecorationContract 同模块（装修域）。
--   2. operation 名与 Action @Action value 同名。
--   3. 重复执行安全（NOT EXISTS 防重）。
--   4. 零 DDL，仅 INSERT 一行；执行前置条件：无（operation 表结构已含所需列）。
--
-- 回滚：
--   DELETE FROM communion.operation WHERE operation = 'syncProsignForNerp';
--
-- 验证：
--   SELECT operation, moduleId, through, status FROM communion.operation
--   WHERE operation = 'syncProsignForNerp';
--   预期 1 行，moduleId=6，through=2。
-- ============================================================================

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncProsignForNerp', 'syncProsignForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncProsignForNerp');
