-- =====================================================================
-- 文件: 18_elecsignauth_create.sql
-- 用途: 电子签客户认证信息表(按厂商各一份)——signno 双厂商命名空间结构化落地
--       一客户一厂商一行(UNIQUE cid+provider), 法大大 customerId 与 e签宝 psnId
--       各存各的, 切换签约方式互不覆盖; 客户基础资料仍归 communion.customer
-- 前置条件: communion 库存在; 无同名表
-- 执行时机: 先于 elecsign/communion/esign/decoration 四 jar 同批部署
-- 回滚方式: DROP TABLE communion.elecsignauth (新表无存量依赖, 读路径有
--           customer.signno 回退兼容, 删表即回旧行为零风险)
-- 验证语句: SHOW CREATE TABLE communion.elecsignauth;
--           SHOW INDEX FROM communion.elecsignauth;  -- 确认 uk_cid_provider
-- 幂等性: CREATE TABLE IF NOT EXISTS
-- =====================================================================

CREATE TABLE IF NOT EXISTS `communion`.`elecsignauth` (
  `eaid` INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cid` INT NOT NULL COMMENT '客户ID communion.customer.cid',
  `provider` SMALLINT NOT NULL COMMENT '电子签厂商(1法大大/2e签宝)',
  `signno` VARCHAR(128) DEFAULT NULL COMMENT '厂商账号(法大大customerId/e签宝psnId)',
  `authurl` VARCHAR(2048) DEFAULT NULL COMMENT '认证链接(对齐decorationcontract列加长口径)',
  `token` VARCHAR(128) DEFAULT NULL COMMENT '认证流凭证(法大大transactionNo/e签宝authFlowId)',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0初始(已注册未实名)/1已实名/2已签署',
  PRIMARY KEY (`eaid`),
  UNIQUE KEY `uk_cid_provider` (`cid`, `provider`),
  KEY `idx_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='电子签客户认证信息(按厂商各一份)';

-- 验证:
-- SELECT COUNT(*) FROM communion.elecsignauth;  -- 建表后 0 行, 存量认证按需懒建行
