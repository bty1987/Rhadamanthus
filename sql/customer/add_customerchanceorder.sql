-- 客户机会与装修单关系表
-- 维护 customerchance.ccid 和 customerchance.orderId 之间的映射关系
CREATE TABLE IF NOT EXISTS `customer`.`customerchanceorder` (
  `ccoid` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `ccid` BIGINT NOT NULL COMMENT '客户机会ID',
  `orderId` VARCHAR(64) NOT NULL COMMENT '装修单号',
  `createTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`ccoid`),
  KEY `idx_ccid` (`ccid`),
  KEY `idx_orderId` (`orderId`),
  UNIQUE KEY `uk_ccid_orderId` (`ccid`, `orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户机会与装修单关系表';
