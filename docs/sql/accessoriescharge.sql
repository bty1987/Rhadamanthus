-- 外辅费用表
CREATE TABLE `inventory`.`occessoriescharge` (
  `acid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `oid` BIGINT(20) NOT NULL COMMENT '外辅单ID（外键，关联inventory.occessories.oid）',
  `oiid` BIGINT(20) DEFAULT NULL COMMENT '外辅项ID（外键，关联inventory.occessoriesItem.oiid）',
  `name` VARCHAR(100) NOT NULL COMMENT '费用名称',
  `price` INT(11) NOT NULL DEFAULT 0 COMMENT '价格（分）',
  `surplus` INT(11) NOT NULL DEFAULT 0 COMMENT '浮动额（分）',
  `num` INT(11) NOT NULL DEFAULT 0 COMMENT '数量',
  PRIMARY KEY (`acid`),
  KEY `idx_oid` (`oid`),
  KEY `idx_oiid` (`oiid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='外辅费用';
