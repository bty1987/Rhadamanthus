-- =============================================================================
-- e签宝试点配置：盘锦宜家装饰（cid=43）——沙箱联调期
-- =============================================================================
-- 背景：e签宝 v3 沙箱全链路联调已打通（appId 7439144015，smlopenapi.esign.cn）。
-- 本脚本让盘锦宜家的装修合同场景在生产系统中走 e签宝沙箱，其余公司/场景不受影响。
--
-- 前置（执行本脚本前必须完成）：
--   1. 部署 jar（缺任一则路由类不存在，装修合同会报错）：
--      fanglin-esign / fanglin-elecsign / fanglin-decoration / fanglin-data / fanglin-communion
--   2. e签宝沙箱应用 IP 白名单加入【生产服务器出口IP】
--      （当前白名单仅 223.100.27.233=办公网，生产服务器出口IP另行确认后加）
--
-- 回滚：DELETE 本脚本插入的全部行（按 company=43 AND `group`='elecsign' 精确删除），
--       或 UPDATE systemconfig SET value='fadada' WHERE `key`='elecsign.provider.decoration' AND company=43。
--       删改后立即生效（路由实时读库），无需重启。
-- =============================================================================

-- 1. 电子签厂商凭证与网关（沙箱联调期；转生产时换正式appId/secret/host并重置secret）
INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`)
SELECT 'elecsign', 'elecsign.appId', '7439144015', 43, 'e签宝沙箱appId(联调期)'
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM communion.systemconfig WHERE `group`='elecsign' AND `key`='elecsign.appId' AND company=43);

INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`)
SELECT 'elecsign', 'elecsign.appSecret', '93f1ec459de3e4cf8b160741f6f78731', 43, 'e签宝沙箱secret(联调期明文,转生产前必须重置并加密)'
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM communion.systemconfig WHERE `group`='elecsign' AND `key`='elecsign.appSecret' AND company=43);

INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`)
SELECT 'elecsign', 'elecsign.host', 'https://smlopenapi.esign.cn', 43, 'e签宝沙箱网关(转生产改 https://openapi.esign.cn)'
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM communion.systemconfig WHERE `group`='elecsign' AND `key`='elecsign.host' AND company=43);

-- 2. 路由开关：仅装修合同+认证两个场景走 e签宝（员工/供应商/付款合同继续法大大）
INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`)
SELECT 'elecsign', 'elecsign.provider.decoration', 'esign', 43, '装修合同场景走e签宝(试点)'
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM communion.systemconfig WHERE `group`='elecsign' AND `key`='elecsign.provider.decoration' AND company=43);

INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`)
SELECT 'elecsign', 'elecsign.provider.auth', 'esign', 43, '注册认证场景走e签宝(拿orgId/psnId必须)'
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM communion.systemconfig WHERE `group`='elecsign' AND `key`='elecsign.provider.auth' AND company=43);

-- 3. e签宝装修合同模板行（docTemplateId=6d844bd45d854050b90d0c4f28c4dde2，64控件已就位）
--    注意：name 加【e签宝】前缀，员工生成合同时选这行；误选其他模板行会报"模板不存在"
INSERT INTO data.contract (no, name, title, page, path, atttype, status, company)
SELECT '6d844bd45d854050b90d0c4f28c4dde2', '【e签宝】2026.4.16工程合同-对个人', '【e签宝】2026.4.16工程合同-对个人',
       '/views/contract/C-001-D-0-0001.html', 'esign://docTemplate', 0, 0, 43
FROM DUAL WHERE NOT EXISTS (
  SELECT 1 FROM data.contract WHERE no='6d844bd45d854050b90d0c4f28c4dde2' AND company=43);

-- =============================================================================
-- 验证：
--   SELECT `key`, value FROM communion.systemconfig WHERE company=43 AND `group`='elecsign';
--   → 应返回 5 行
--   SELECT cid, no, name FROM data.contract WHERE company=43;
--   → 应返回 1 行【e签宝】模板
--
-- ⚠ 试点期操作约束（告知盘锦宜家）：
--   生成合同时必须选「【e签宝】」开头的模板行；误选其他模板行走 e签宝 会报模板不存在。
--
-- 转生产清单（试点通过后）：
--   a. e签宝正式版开通（CA/出证）
--   b. 正式 appId/secret 配置（重置沙箱secret）
--   c. elecsign.host 改 https://openapi.esign.cn
--   d. appSecret 加密存储（EncryptConfigLoader 体系）
--   e. 正式环境重建模板（沙箱模板不互通），data.contract.no 更新为正式 docTemplateId
-- =============================================================================
