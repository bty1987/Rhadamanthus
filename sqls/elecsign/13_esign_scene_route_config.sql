-- =============================================================================
-- 电子签多厂商支持：场景路由与 e签宝凭证配置（示例脚本，按需执行）
--
-- 路由规则（ElecsignRouter，两级维度：公司 × 合同场景）：
--   优先级1 公司×场景：elecsign.provider.<scene>   company=公司cid
--   优先级2 公司级    ：elecsign.provider           company=公司cid
--   优先级3 全局默认  ：elecsign.default.provider   company=0
--   兜底    ：法大大（等价现状，不配置则全部走法大大，行为与改造前一致）
--
-- 场景 key（ElecsignScene）：decoration 装修合同 / payment 付款合同 /
--                            supplier 供应商合同 / user 员工合同 / auth 实名认证与印章
--
-- ⚠️ 合同场景的公司级路由说明：4 张合同表无公司列，合同的「公司×场景」路由在创建时
--   由业务上下文解析（装修合同取合同模板公司，其余场景默认全局），并固化到合同 provider
--   字段；合同创建后全链路按 provider 路由，配置切换仅影响新合同。
--   → 实际效果：**公司级/场景级配置对合同的生效点在"生成/上传"时**，签署/查看按记录路由。
--
-- ⚠️ e签宝启用前置：
--   1. e签宝 openapi 应用（appId/appSecret）已开通，企业主体已完成实名与静默签授权
--   2. 法大大场景的合同模板，若切换 e签宝需在 e签宝控制台重建同名模板（模板不互通），
--      模板ID（templateCode）需同步维护
--   3. 首次启用建议先用一个测试公司/低风险场景灰度
-- =============================================================================

-- 0.（可选）显式声明全局默认厂商：法大大。不插也生效（路由器硬兜底）
INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`)
SELECT 'elecsign', 'elecsign.default.provider', 'fadada', 0, '电子签全局默认厂商：fadada/esign' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'elecsign.default.provider' AND company = 0);

-- =============================================================================
-- 示例A：全局所有业务切 e签宝（法大大停用）
-- =============================================================================
-- INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`) VALUES
--   ('elecsign', 'elecsign.default.provider', 'esign', 0, '全局默认厂商切e签宝');

-- =============================================================================
-- 示例B：仅装修合同场景用 e签宝（其余场景保持法大大），公司cid=1
-- =============================================================================
-- INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`) VALUES
--   ('elecsign', 'elecsign.provider.decoration', 'esign', 1, '公司1装修合同用e签宝');

-- =============================================================================
-- 示例C：某公司整体切 e签宝（全部场景），公司cid=10
-- =============================================================================
-- INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`) VALUES
--   ('elecsign', 'elecsign.provider', 'esign', 10, '公司10全部电子签走e签宝');

-- =============================================================================
-- e签宝凭证（启用 e签宝必配；company=0 全局 / company=cid 公司级——公司级优先）
-- ⚠️ appSecret 建议用项目 EncryptConfigLoader/jasypt 体系加密后存
-- =============================================================================
-- INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`) VALUES
--   ('elecsign', 'elecsign.appId',     'e签宝appId',            0, 'e签宝应用ID'),
--   ('elecsign', 'elecsign.appSecret', '加密后的appSecret',     0, 'e签宝应用密钥（加密存储）'),
--   ('elecsign', 'elecsign.host',      'https://openapi.esign.cn', 0, 'e签宝openapi地址（缺省即此值）');

-- =============================================================================
-- 验证：
--   SELECT `key`, `value`, `company` FROM communion.systemconfig WHERE `group` = 'elecsign';
--   路由口径自查：某公司某场景的生效厂商 = elecsign.provider.<scene>@cid
--                 → elecsign.provider@cid → elecsign.default.provider@0 → fadada
-- =============================================================================
