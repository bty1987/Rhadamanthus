-- 外辅配送钉钉消息跳转地址模板
-- 使用 %s 占位外辅单 oid, 如: ...?oid=12345
INSERT INTO communion.systemconfig (`group`, `key`, `value`, `cuid`, `company`, `comment`)
SELECT 'dingtalk', 'occessoriesDeliveMessageUrl', 'https://service-erp.fanglin.vip/dingding/vue/index.html?agent=4921021#/manifest/occessories-detail?oid=%s', 0, 0, '外辅配送钉钉消息点击跳转地址模板'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.systemconfig WHERE `key` = 'occessoriesDeliveMessageUrl' AND `company` = 0
);
