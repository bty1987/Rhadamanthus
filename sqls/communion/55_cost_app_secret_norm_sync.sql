-- =============================================================================
-- 55_cost_app_secret_norm_sync.sql
-- cost.app.secret 环境密钥配置（三方定额补数 norm.sync 通道 + 优惠额度校验共用）
-- =============================================================================
-- 背景：
--   fl-sync 统一验签（appId=erp_project_sync）按环境发放密钥（2026-11-22 上方答复）：
--     测试环境: af7nPP/AzXXBDArwOYtLZdui
--     正式环境: tb+nNhgG7Y6utZfVObwoImUq
--   消费方两处（同 appId 同验签规则，密钥共用一键，禁止重复配键）：
--     1. 三方定额补数（A20261117ServiceImpl, key 读 cost.app.secret company=0）
--     2. 优惠额度校验（DecorationActivityCostServiceImpl, 同键）
--
-- ⚠️ 注意：
--   1. 🔴 cost.app.secret company=0 上可能已有旧值（优惠额度校验先期接入若已配置）。
--      本脚本 INSERT NOT EXISTS 守卫：已有值时【不自动覆盖】（防打断在途验签），
--      核对段会输出现值——若现值与本环境新密钥不一致，需人工确认"同平台统一密钥"
--      后再执行文件尾的备用 UPDATE。
--   2. 按环境执行对应段：T(daily) 执行测试段；生产执行正式段。
--   3. 改库即生效免重启（systemconfig 每次调用实时读）。
--
-- 回滚：
--   DELETE FROM communion.systemconfig WHERE `key` = 'cost.app.secret' AND company = 0;
--   （若原值被 UPDATE 覆盖，回滚=从核对段输出的旧值 UPDATE 回去）
--
-- 验证：
--   SELECT `key`, `value`, company FROM communion.systemconfig
--   WHERE `key` = 'cost.app.secret' AND company = 0;  -- 预期 1 行, 值=本环境密钥
-- =============================================================================

-- ============ 测试环境段（T/daily 执行） ============
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company, comment)
SELECT 'normsync', 'cost.app.secret', 'af7nPP/AzXXBDArwOYtLZdui', 34, 0, 'fl-sync统一验签密钥(测试环境, 2026-11-22上方发放; 定额补数/优惠额度校验共用)'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'cost.app.secret' AND company = 0);

-- 核对段（已有旧值时输出比对，不自动覆盖）：
-- SELECT '现值' AS tag, `value` FROM communion.systemconfig WHERE `key` = 'cost.app.secret' AND company = 0;
-- 预期值: af7nPP/AzXXBDArwOYtLZdui；不一致时确认后执行:
-- UPDATE communion.systemconfig SET value = 'af7nPP/AzXXBDArwOYtLZdui', comment = 'fl-sync统一验签密钥(测试环境, 2026-11-22更新)' WHERE `key` = 'cost.app.secret' AND company = 0;

-- ============ 正式环境段（生产执行） ============
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company, comment)
SELECT 'normsync', 'cost.app.secret', 'tb+nNhgG7Y6utZfVObwoImUq', 34, 0, 'fl-sync统一验签密钥(正式环境, 2026-11-22上方发放; 定额补数/优惠额度校验共用)'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'cost.app.secret' AND company = 0);

-- 核对段（🔴生产必做：已有旧值时输出比对，不自动覆盖）：
-- SELECT '现值' AS tag, `value` FROM communion.systemconfig WHERE `key` = 'cost.app.secret' AND company = 0;
-- 预期值: tb+nNhgG7Y6utZfVObwoImUq；不一致时确认"优惠额度校验同平台同钥"后执行:
-- UPDATE communion.systemconfig SET value = 'tb+nNhgG7Y6utZfVObwoImUq', comment = 'fl-sync统一验签密钥(正式环境, 2026-11-22更新)' WHERE `key` = 'cost.app.secret' AND company = 0;
-- 🔴 该 UPDATE 同时切换优惠额度校验的验签密钥——执行前确认上方正式环境已全量切换到新密钥，否则在途优惠额度校验请求将 400 签名不正确（fail-open 放行不阻断业务，但校验暂时失效）。
