-- =====================================================================
-- 35号SQL: 生产 communion.systemconfig 补配额度校验两键 (cost.validate.url / cost.app.secret)
-- =====================================================================
-- 用途:
--   生产补配 DecorationActivityCostServiceImpl 额度校验两配置。
--   缺配置行为=创建链静默跳过校验放行(tryValidate log.warn 后 return null,
--   不落 decorationactivitycost 缓存行)+手动刷新链抛 140110。
--   生产实查(2026-11-07 只读库): 两键 0 行; 额度类物品 type=10 仅 2 行且失效,
--   11/12 零行 = 当前无业务影响, 本配置为启用额度类奖品的前置。
--   值来源=用户提供(2026-11-07): 生产网关 gateway + 生产密钥。
--   形态照抄测试库(dev/test-erp 2026-10-29 版, scid 295/296): group=cost,
--   cuid=0, company=0; querySystemConfig(key) 不分公司取第一条。
--   生效机制: 每次调用实时查库, 改库即生效免重启。
-- 执行前置条件:
--   段0自检应返回 0 行(两键未配置); 若已存在行先人工核对值再决定是否更新
-- 回滚方式:
--   DELETE FROM communion.systemconfig WHERE `key` IN
--     ('cost.validate.url','cost.app.secret') AND comment LIKE '%生产%';
-- 验证语句:
--   段2执行后应返回 2 行, value 与本文件一致
-- 幂等性: NOT EXISTS 守卫, 重跑零新增
-- =====================================================================

-- ---------- 段0: 前置自检 (应返回 0 行) ----------
SELECT scid, `group`, `key`, value, comment, company
FROM communion.systemconfig
WHERE `key` IN ('cost.validate.url', 'cost.app.secret');

-- ---------- 段1: 幂等插入 (NOT EXISTS 守卫) ----------
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, comment, company)
SELECT * FROM (
    SELECT 'cost' AS grp, 'cost.validate.url' AS k,
           'https://gateway.fanglin.vip/open-api/sync/cycx/discount-quota/validate' AS v,
           0 AS cuid, '优惠额度校验接口地址(生产=gateway)' AS cmt, 0 AS company
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM communion.systemconfig WHERE `key` = 'cost.validate.url'
);

INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, comment, company)
SELECT * FROM (
    SELECT 'cost' AS grp, 'cost.app.secret' AS k,
           'lmMjkeuvxs+FPImG3V10DP/V528Hu6/q' AS v,
           0 AS cuid, '优惠额度签名密钥(erp_project_sync生产环境)' AS cmt, 0 AS company
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM communion.systemconfig WHERE `key` = 'cost.app.secret'
);

-- ---------- 段2: 验证 (应返回 2 行, 值与本文件一致) ----------
SELECT scid, `group`, `key`, value, comment, company
FROM communion.systemconfig
WHERE `key` IN ('cost.validate.url', 'cost.app.secret');
