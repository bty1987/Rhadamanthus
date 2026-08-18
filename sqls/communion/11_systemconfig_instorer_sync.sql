-- ============================================================================
-- 11_systemconfig_instorer_sync.sql
-- 驻店人员同步接口(syncInstorer)所需 systemconfig 四键
-- ============================================================================
-- 背景：
--   seiya 模块 A20260404Action.syncInstorer 接口（2026-08-18 新增）创建驻店员用户
--   （communion.user type=4）时，需要以下配置键：
--     instorer       驻店员角色ID（对应 platform.role.rid）
--     instorerDept   驻店员默认部门ID（对应 communion.department.did）
--     instorerDuty   驻店员默认职位ID（对应 communion.duty.did）
--     instorerlimit  驻店员数量上限（每公司，缺省 100）
--
--   初始值取自既有供应商同步配置（supplier=16 / supplierDept=1128 / supplierDuty=19），
--   即驻店员与供应商同属供应链外部人员，共用组织归属；后续如需独立调整，直接改
--   systemconfig 对应行 value 即可，不影响供应商同步。
--
--   生产库现状（2026-08-18 核实）：communion.user 中 type=4 为 0 条，
--   brandInstorer 表为 0 条，驻店员功能冷启动，无存量兼容问题。
--
-- ⚠️ 注意：
--   1. company=0 表示全局配置（与 supplier 系列一致，systemConfigDao 查询不传公司维度）。
--   2. instorerlimit 与 supplierlimit 不同，是按 company 维度读取的
--      （systemConfigDao.querySystemConfig("instorerlimit", company)），
--      故本脚本为 company=1（方林主体）插入；其他租户启用时按需补插。
--   3. 重复执行安全（NOT EXISTS 防重）。
--
-- 验证：
--   SELECT `key`, value, company FROM communion.systemconfig
--   WHERE `key` IN ('instorer', 'instorerDept', 'instorerDuty', 'instorerlimit');
--   预期 4 行。
-- ============================================================================

-- 1. 驻店员角色ID（初始复用厂商角色 16）
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company, comment)
SELECT 'personel', 'instorer', '16', 34, 0, '驻店员角色ID'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'instorer' AND company = 0);

-- 2. 驻店员默认部门ID（初始复用供应商部门 1128）
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company, comment)
SELECT 'personel', 'instorerDept', '1128', 34, 0, '驻店员部门ID'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'instorerDept' AND company = 0);

-- 3. 驻店员默认职位ID（初始复用供应商职位 19）
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company, comment)
SELECT 'personel', 'instorerDuty', '19', 34, 0, '驻店员职位ID'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'instorerDuty' AND company = 0);

-- 4. 驻店员数量上限（company=1 方林主体）
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company, comment)
SELECT 'personel', 'instorerlimit', '500', 34, 1, '驻店员数量限制'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'instorerlimit' AND company = 1);
