CREATE DATABASE  IF NOT EXISTS `platform`;
USE `platform`;

DROP TABLE IF EXISTS `decorationdesigndepartmentright`;
CREATE TABLE `decorationdesigndepartmentright` (
  `doddrId` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `dId` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`doddrId`),
  KEY `indexone` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单设计部权限';

DROP TABLE IF EXISTS `decorationsalesmandepartmentright`;
CREATE TABLE `decorationsalesmandepartmentright` (
  `dsdrId` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `dId` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dsdrId`),
  KEY `indexone` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单业务部权限';

DROP TABLE IF EXISTS `decorationstatusright`;
CREATE TABLE `decorationstatusright` (
  `dsrId` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dsrId`),
  KEY `indexone` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单状态权限';


DROP TABLE IF EXISTS `rolechainpage`;
CREATE TABLE `rolechainpage` (
  `rcpid` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `cpid` int(11) NOT NULL,
  PRIMARY KEY (`rcpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色-外链';

DROP TABLE IF EXISTS `servicerecord`;
CREATE TABLE `servicerecord` (
  `srId` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) NOT NULL,
  `operateUserId` varchar(15) NOT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `info` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`srId`),
  KEY `indexone` (`operateUserId`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务记录';

DROP TABLE IF EXISTS `customersourceright`;
CREATE TABLE `customersourceright` (
  `csdrid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`csdrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户源权限';








