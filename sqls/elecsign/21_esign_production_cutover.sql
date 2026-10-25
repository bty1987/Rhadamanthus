-- =====================================================================
-- 文件: 21_esign_production_cutover.sql
-- 用途: e签宝沙箱→正式环境切换——appId/appSecret/host 三键换正式凭证
--       (正式应用 appId=5112065795, 商务已开通配额并交付凭证 2026-10-25)
-- 前置条件: 🔴新 esign jar(orgInfo配置化版, md5 921981c3b38f0e9cace3772a221dcdfc)必须
--           已部署——老jar无条件传沙箱硬编码测试信用号, 正式环境认证必E比对失败;
--           communion hotfix jar(da549bf3)同窗口部署(客户签炸点修复);
--           🔴正式应用控制台须已配置生产出口IP白名单(与沙箱应用独立配置)
-- 执行时机: jar部署重启完成后执行, 即时生效(systemconfig实时读)
-- 回滚方式: 回沙箱三键(见下方注释块, 秒级回切)
-- 验证语句: SELECT company, `key`, `value` FROM communion.systemconfig
--           WHERE `key` LIKE 'elecsign.app%' OR `key` = 'elecsign.host' ORDER BY company;
--           之后跑 scripts/esign_signet_auth_batch.py 出正式链接(先--company 43单公司验证)
-- 幂等性: 幂等(同值重复UPDATE无变化)
-- =====================================================================

-- 全局兜底凭证(company=0)
UPDATE communion.systemconfig SET `value` = '5112065795' WHERE `key` = 'elecsign.appId' AND company = 0 AND `value` != '5112065795';
UPDATE communion.systemconfig SET `value` = '***ESIGN_PROD_SECRET_REMOVED***' WHERE `key` = 'elecsign.appSecret' AND company = 0 AND `value` != '***ESIGN_PROD_SECRET_REMOVED***';
UPDATE communion.systemconfig SET `value` = 'https://openapi.esign.cn' WHERE `key` = 'elecsign.host' AND company = 0 AND `value` != 'https://openapi.esign.cn';

-- 试点公司43(盘锦宜家)
UPDATE communion.systemconfig SET `value` = '5112065795' WHERE `key` = 'elecsign.appId' AND company = 43 AND `value` != '5112065795';
UPDATE communion.systemconfig SET `value` = '***ESIGN_PROD_SECRET_REMOVED***' WHERE `key` = 'elecsign.appSecret' AND company = 43 AND `value` != '***ESIGN_PROD_SECRET_REMOVED***';
UPDATE communion.systemconfig SET `value` = 'https://openapi.esign.cn' WHERE `key` = 'elecsign.host' AND company = 43 AND `value` != 'https://openapi.esign.cn';

-- 验证(期望6行全部为正式值, provider两行不变仍为esign):
-- SELECT company, `key`, `value` FROM communion.systemconfig
--  WHERE `key` IN ('elecsign.appId','elecsign.appSecret','elecsign.host','elecsign.provider.auth','elecsign.provider.decoration')
--  ORDER BY company, `key`;

-- =====================================================================
-- 回滚(切回沙箱, 秒级):
-- UPDATE communion.systemconfig SET `value` = '7439144015' WHERE `key` = 'elecsign.appId' AND company IN (0, 43);
-- UPDATE communion.systemconfig SET `value` = '***ESIGN_SANDBOX_SECRET_REMOVED***' WHERE `key` = 'elecsign.appSecret' AND company IN (0, 43);
-- UPDATE communion.systemconfig SET `value` = 'https://smlopenapi.esign.cn' WHERE `key` = 'elecsign.host' AND company IN (0, 43);
-- =====================================================================
