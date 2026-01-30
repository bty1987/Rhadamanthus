CREATE DATABASE IF NOT EXISTS `log`;
USE `log`;

-- Generated at 2026-01-06 08:06:23
-- Total tables: 2

DROP TABLE IF EXISTS `actionlog`;
CREATE TABLE `actionlog` (
  `alId` int(11) NOT NULL AUTO_INCREMENT,
  `actionName` varchar(128) NOT NULL,
  `createUserId` varchar(15) NULL COMMENT '操作人',
  `createTime` timestamp NULL COMMENT '创建时间',
  `runTime` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`alId`)
) ENGINE=InnoDB AUTO_INCREMENT=429 DEFAULT CHARSET=utf8-general-ci ROW_FORMAT=Compact COMMENT='操作日志表';

DROP TABLE IF EXISTS `loginlog`;
CREATE TABLE `loginlog` (
  `id` varchar(32) NOT NULL,
  `loginId` varchar(32) NOT NULL DEFAULT '0',
  `loginTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sourceIp` varchar(45) NOT NULL,
  `successFlag` smallint(5) unsigned NOT NULL DEFAULT 0,
  `llId` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`llId`),
  KEY `indexone` (`loginId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=106615 DEFAULT CHARSET=utf8-general-ci ROW_FORMAT=Compact;
