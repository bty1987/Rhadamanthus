-- =====================================================================
-- 文件: 23_signet_sandbox_link_reset.sql
-- 用途: 重发正式认证链接前, 将上次沙箱批量占用的"认证中"状态退回——
--       147把章(provider=2, status=2, signno空)重置为status=1(已注册待认证),
--       清空沙箱authFlowId(token)/authurl(旧流作废, 不影响e签宝侧任何档案)
-- 前置条件: 21号切换SQL已执行(正式凭证); 22号回填已执行(已实名3把status=3不受本SQL影响,
--           其signno非空被WHERE排除)
-- 执行时机: 21/22号之后、重跑esign_signet_auth_batch.py之前
-- 回滚方式: 无需回滚(旧沙箱链接本已作废; 重跑batch出新正式链接即推进status=2)
-- 验证语句: SELECT COUNT(*) FROM data.signet WHERE provider = 2 AND status IN (0,1,2) AND (signno IS NULL OR signno = '');
--           -- 期望=0(全部退回status=1后被batch重新推进)
-- 幂等性: 幂等(status=2条件限定, 重复执行无变化)
-- =====================================================================

UPDATE data.signet
   SET status = 1,
       token = NULL,
       authurl = NULL
 WHERE provider = 2
   AND status = 2
   AND (signno IS NULL OR signno = '');

-- 验证:
-- SELECT status, COUNT(*) FROM data.signet WHERE provider = 2 GROUP BY status;
-- 期望: status=1 约147把(待正式链接), status=3 3把(22号已实名回填)
