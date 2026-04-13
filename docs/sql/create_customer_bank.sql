-- 客户银行账户表
-- 从 communion.customer 的 company* 字段拆分而来，支持一个客户多个银行账户
CREATE TABLE `customer_bank` (
  `cbid` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cid` BIGINT NOT NULL COMMENT '客户ID, 关联 customer.cid',
  `type` TINYINT NOT NULL DEFAULT 0 COMMENT '账户类型: 0-对私(个人), 1-对公(企业)',
  `no` VARCHAR(64) DEFAULT NULL COMMENT '证件号/统一社会信用代码',
  `name` VARCHAR(128) NOT NULL COMMENT '户名',
  `phone` VARCHAR(64) DEFAULT NULL COMMENT '联系电话',
  `address` VARCHAR(256) DEFAULT NULL COMMENT '地址',
  `bank` VARCHAR(128) NOT NULL COMMENT '开户银行',
  `bankno` VARCHAR(64) NOT NULL COMMENT '银行账号',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-启用, 1-停用',
  `defaults` TINYINT NOT NULL DEFAULT 0 COMMENT '是否默认账户: 0-否, 1-是',
  `createTime` DATETIME DEFAULT NULL COMMENT '创建时间',
  `updateTime` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`cbid`),
  KEY `idx_cid` (`cid`),
  KEY `idx_bankno` (`bankno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客户银行账户';
