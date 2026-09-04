-- ============================================================================
-- 12_operation_inventory_sync.sql
-- 库存同步接口(syncAoods/syncStorehouse/syncStorehouseStock)所需 operation 注册
-- ============================================================================
-- 背景：
--   seiya 模块 A20260904Action（2026-09-04 新增）对外提供三个库存同步接口：
--     syncAoods          辅材档案同步（存在更新/不存在创建）
--     syncStorehouse     仓库档案同步（存在更新/不存在创建）
--     syncStorehouseStock 出入库同步（in 入库/out 出库，生成 manifest 单据）
--
--   接口走 AccessInterceptor 统一鉴权，through=2（免登通用）放行：
--   调用方必传 authentication（ERP 分配的认证串），无需 ERP 登录态。
--   through=2 下认证串两种形态均支持：
--     1) 纯账号加密串（AES(userId)，推荐，最简）
--     2) 完整登录态加密串
--   manifest.creater 取认证串对应账号。
--
-- ⚠️ 注意：
--   1. moduleId=4 与 syncSupplier/syncInstorer 同模块（供应链对接）。
--   2. operation 名与 Action @Action value 同名。
--   3. 重复执行安全（NOT EXISTS 防重）。
--
-- 验证：
--   SELECT operation, through, status FROM communion.operation
--   WHERE operation IN ('syncAoods', 'syncStorehouse', 'syncStorehouseStock');
--   预期 3 行，through=2。
-- ============================================================================

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 4, 'syncAoods', 'syncAoods', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncAoods');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 4, 'syncStorehouse', 'syncStorehouse', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncStorehouse');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 4, 'syncStorehouseStock', 'syncStorehouseStock', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncStorehouseStock');
