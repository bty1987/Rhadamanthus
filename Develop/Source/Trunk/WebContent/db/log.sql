CREATE DATABASE  IF NOT EXISTS `log`;
USE `log`;

DROP TABLE IF EXISTS `actionlog`;
CREATE TABLE `actionlog` (
  `alId` int(11) NOT NULL AUTO_INCREMENT,
  `actionName` varchar(128) NOT NULL,
  `createUserId` varchar(15) DEFAULT NULL COMMENT '操作人',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `runTime` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`alId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='操作日志表';

DROP TABLE IF EXISTS `loginlog`;
CREATE TABLE `loginlog` (
  `id` varchar(32) NOT NULL,
  `loginId` varchar(32) NOT NULL DEFAULT '0',
  `loginTime` timestamp NULL NOT NULL,
  `sourceIp` varchar(45) NOT NULL,
  `successFlag` smallint(5) unsigned NOT NULL DEFAULT '0',
  `llId` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`llId`),
  KEY `indexone` (`loginId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;