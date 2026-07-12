-- =============================================================================
-- 企业微信(WeCom)消息推送接入 - 数据库初始化脚本
-- 创建时间: 2026-07-05
-- 说明:
--   1. 新建 hades.eaccesstoken 表(e=enterprise 企业微信), 与公众号 waccesstoken /
--      钉钉 daccesstoken 隔离, 避免污染。
--   2. SystemConfig 配置项需运维在 communion.systemconfig 表中按公司写入,
--      与现有 DINGTALK_* 系列保持相同模式。
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. 企业微信 access_token 缓存表
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hades`.`eaccesstoken` (
  `eatId`        INT(11)   NOT NULL AUTO_INCREMENT COMMENT '主键',
  `access_token` VARCHAR(255) NOT NULL             COMMENT '企业微信 access_token',
  `expiresIn`    INT(11)   DEFAULT NULL            COMMENT '有效期(秒), 官方 7200',
  `operateTime`  BIGINT(20) DEFAULT NULL           COMMENT '落库毫秒时间戳',
  `company`      TINYINT(4) NOT NULL               COMMENT '公司标识',
  PRIMARY KEY (`eatId`),
  KEY `idx_company_operateTime` (`company`, `operateTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='企业微信 access_token 缓存表';


-- =============================================================================
-- 2. SystemConfig 配置项样例 (按需修改公司编号/实际值后执行)
--    公司编号: 0=总部, 1+=分公司 (与 FormatUtil.decodeCompany 对应)
-- =============================================================================

-- 全局 API 域名 (company=0)
INSERT INTO `communion`.`systemconfig` (`key`, `value`, `company`, `comment`)
VALUES ('WECOM_OAPI_URL_STR', 'https://qyapi.weixin.qq.com', 0, '企业微信 API 基础域名');

-- 按公司: 替换 <COMPANY> 为实际公司编号, CorpID/Secret/AgentID 填企业微信后台自建应用值
INSERT INTO `communion`.`systemconfig` (`key`, `value`, `company`, `comment`)
VALUES ('WECOM_CORPID_STR',  'wwXXXXXXXXXXXXXXXX', <COMPANY>, '企业微信 CorpID');

INSERT INTO `communion`.`systemconfig` (`key`, `value`, `company`, `comment`)
VALUES ('WECOM_SECRET_STR',  '你的自建应用 Secret',  <COMPANY>, '企业微信自建应用 Secret');

INSERT INTO `communion`.`systemconfig` (`key`, `value`, `company`, `comment`)
VALUES ('WECOM_AGENTID_STR', '1000002',            <COMPANY>, '企业微信自建应用 AgentID');

-- 群机器人 webhook key 样例 (每个业务群一个, key 取自 webhook URL 的 key 参数)
-- INSERT INTO `communion`.`systemconfig` (`key`, `value`, `company`, `comment`)
-- VALUES ('MESSAGE_WECOM_GROUP_ADDREDUCE', 'xxxxxxxx-xxxx-xxxx', 0, '增减项收款业务群机器人');
