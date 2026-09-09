-- =====================================================================
-- 合肥两分公司收银台公钥配置 3 行(生产执行)
-- 日期: 2026-09-06
--
-- 内容:
--   communion.systemconfig 注册 3 个收银台商户公钥
--   (方林家居合肥分公司 x2 + 辽宁爱林合肥分公司 x1)
--
-- 字段口径(对齐存量 scid 2220~2222, 2026-07-12 北京朝阳/长春批次):
--   group='payment'
--   key=收银台商户号(syfh-xxx), 与 communion.custype.no 对应,
--     支付回调链路 custype.no -> systemconfig.key 取公钥验签
--   value=收银台公钥(124字符 SM2 SPKI, base64)
--   cuid=34(白添宇 FL-00479, 与存量批次一致)
--   company=0(平台全局, 与全部存量 syfh-* 行一致)
--   comment=客户名称-商户号(商户号为该渠道的单号, 无渠道前缀)
--   createTime 不写, 走列默认 CURRENT_TIMESTAMP
--
-- 幂等: 按 key 判重 NOT EXISTS, 可重复执行
-- (querySystemConfig(key) 仅按 key 查, key 全局唯一, 判重不加 company)
--
-- 执行后验证:
--   SELECT scid, `key`, comment, company FROM communion.systemconfig
--   WHERE `key` IN ('syfh-fljjzsyxgshffgs','syfh-fljjzsyxgshffgs-2','syfh-lnalzszxyxgshffgs');
--   预期 3 行
--
-- 备注: 本脚本只配公钥; 各公司收银台商户号绑定(communion.custype,
--   company -> no, 按 atttype/platform 分支付方式)属业务配置, 另行处理
-- =====================================================================

-- 1. 方林家居装饰有限公司合肥分公司 新一代收单 99942202208ZKKK
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, comment, company)
SELECT 'payment', 'syfh-fljjzsyxgshffgs',
       'MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAE5LQdeguC/ouaoOKR9aDcXMTLdXuoSzrkENlvc8NLeVHwWTeOmUt5C0I7OQpfnOM7mMzgnzQAOLrS516nvx722A==',
       34, '方林家居装饰有限公司合肥分公司-99942202208ZKKK', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'syfh-fljjzsyxgshffgs');

-- 2. 方林家居装饰有限公司合肥分公司 兴E付 99942202208WYBB
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, comment, company)
SELECT 'payment', 'syfh-fljjzsyxgshffgs-2',
       'MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAEzULU9P8Stua/4o+cKshZYo5INltBQp2FzOSR2pQ2kTy9EVyh7NhKz9jwG1v6PchyfxGZqGj95sM3J46HUE8Now==',
       34, '方林家居装饰有限公司合肥分公司-99942202208WYBB', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'syfh-fljjzsyxgshffgs-2');

-- 3. 辽宁爱林装饰装修有限公司合肥分公司 兴E付 99942202208ZNJ6
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, comment, company)
SELECT 'payment', 'syfh-lnalzszxyxgshffgs',
       'MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAEQJi0DEvubiw+R/0rsGum9D7DjrMOw+z01Gi8EyKIm2ikBw8GARVb9sBAMOUVyGtuTyepkcCr/tGtoZc9WI5hJg==',
       34, '辽宁爱林装饰装修有限公司合肥分公司-99942202208ZNJ6', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'syfh-lnalzszxyxgshffgs');
