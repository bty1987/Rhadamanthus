-- =============================================================================
-- 电子签多厂商支持：systemconfig 配置初始化
-- 阶段4：配置隔离与多公司路由（复用 communion.systemconfig，不建新表）
--
-- 配置约定（group=elecsign）：
--   elecsign.default.provider  全局默认厂商，company=0，值 fadada/esign
--   elecsign.provider          公司级厂商，company=公司cid，值 fadada/esign
--   elecsign.appId             公司级厂商 appId（e签宝接入时用）
--   elecsign.appSecret         公司级厂商密钥（加密存储）
--   elecsign.host              公司级 openapi 地址（可选）
--
-- 路由优先级（ElecsignRouter.resolveProvider）：
--   1. 查 elecsign.provider（该公司）→ 有则用
--   2. 查 elecsign.default.provider（company=0）→ 有则用
--   3. 都没有 → 硬兜底法大大
-- =============================================================================

-- 全局默认厂商：法大大（company=0 表全局）
-- 若已存在则跳过（IGNORE 避免重复执行报错）
INSERT IGNORE INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`)
VALUES ('elecsign', 'elecsign.default.provider', 'fadada', 0, '电子签全局默认厂商：fadada/esign');

-- =============================================================================
-- 示例：让某公司（假设 cid=10）走 e签宝，需插入以下配置
-- =============================================================================
-- INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`) VALUES
--   ('elecsign', 'elecsign.provider',    'esign',                10, '该公司电子签厂商'),
--   ('elecsign', 'elecsign.appId',       'e签宝appId',           10, 'e签宝应用ID'),
--   ('elecsign', 'elecsign.appSecret',   '加密后的secret',       10, 'e签宝应用密钥（建议加密）'),
--   ('elecsign', 'elecsign.host',        'https://open.esign.cn', 10, 'e签宝openapi地址');

-- =============================================================================
-- 说明：
-- 1. 本脚本只插一条全局默认配置，不改任何表结构。
-- 2. 不插这条也能跑——ElecsignRouter 硬兜底法大大。插入仅为显式声明。
-- 3. 公司切换厂商：加该公司的一组 elecsign.* 配置即可，零代码改动。
-- 4. 凭证加密：appSecret 建议用项目既有的 EncryptConfigLoader 体系加密后存 value。
-- =============================================================================
