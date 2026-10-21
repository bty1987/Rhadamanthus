-- =============================================================================
-- e签宝全局兜底凭证（company=0）——合同链路按记录路由依赖
-- =============================================================================
-- 背景：合同 PO 无 company 列，routeForRecord（签署/查看/归档按记录厂商路由）
--       的 e签宝单例按全局配置（company=0）读凭证。不配则合同链路报
--       "e签宝配置缺失(elecsign.appId/appSecret)"。
--
-- 试点期（沙箱）：全局=沙箱凭证，与盘锦宜家(company=43)同套。
-- 转生产：全局改为正式凭证；多公司各自凭证时全局作为兜底/过渡。
--
-- 回滚：DELETE FROM communion.systemconfig WHERE company=0 AND `group`='elecsign'
--       AND `key` IN ('elecsign.appId','elecsign.appSecret','elecsign.host');
-- =============================================================================

INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `cuid`, `comment`)
SELECT 'elecsign', 'elecsign.appId', '7439144015', 0, 34, 'e签宝沙箱appId(全局兜底,合同按记录路由用)'
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM communion.systemconfig WHERE `group`='elecsign' AND `key`='elecsign.appId' AND company=0);

INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `cuid`, `comment`)
SELECT 'elecsign', 'elecsign.appSecret', '***ESIGN_SANDBOX_SECRET_REMOVED***', 0, 34, 'e签宝沙箱secret(全局兜底,联调期明文)'
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM communion.systemconfig WHERE `group`='elecsign' AND `key`='elecsign.appSecret' AND company=0);

INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `cuid`, `comment`)
SELECT 'elecsign', 'elecsign.host', 'https://smlopenapi.esign.cn', 0, 34, 'e签宝沙箱网关(全局兜底)'
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM communion.systemconfig WHERE `group`='elecsign' AND `key`='elecsign.host' AND company=0);

-- 验证：应返回 3 行
-- SELECT `key`, value FROM communion.systemconfig WHERE company=0 AND `group`='elecsign';
