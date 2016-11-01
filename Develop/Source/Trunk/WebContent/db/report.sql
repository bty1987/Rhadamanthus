CREATE DATABASE  IF NOT EXISTS `report`;
USE `report`;

DROP TABLE IF EXISTS `regioncount`;
CREATE TABLE `regioncount` (
  `rcId` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `newOrderNum` int(11) NOT NULL DEFAULT 0,
  `signOrderNum` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`rcId`),
  KEY `indexone` (`rId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='大区统计';

DROP TABLE IF EXISTS `regioncountdetail`;
CREATE TABLE `regioncountdetail` (
  `rcdId` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `newOrderNum` int(11) NOT NULL DEFAULT 0,
  `signOrderNum` int(11) NOT NULL DEFAULT 0,
  `createDate` date NOT NULL,
  PRIMARY KEY (`rcdId`),
  KEY `indexone` (`rId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='大区统计详细';

DROP TABLE IF EXISTS `citycount`;
CREATE TABLE `citycount` (
  `ccId` int(11) NOT NULL AUTO_INCREMENT,
  `cId` int(11) NOT NULL,
  `newOrderNum` int(11) NOT NULL DEFAULT 0,
  `signOrderNum` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ccId`),
  KEY `indexone` (`cId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='城市统计';

DROP TABLE IF EXISTS `citycountdetail`;
CREATE TABLE `citycountdetail` (
  `ccdId` int(11) NOT NULL AUTO_INCREMENT,
  `cId` int(11) NOT NULL,
  `newOrderNum` int(11) NOT NULL DEFAULT 0,
  `signOrderNum` int(11) NOT NULL DEFAULT 0,
  `createDate` date NOT NULL,
  PRIMARY KEY (`ccdId`),
  KEY `indexone` (`cId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='城市统计详细';

DROP TABLE IF EXISTS `citypropercount`;
CREATE TABLE `citypropercount` (
  `cpcId` int(11) NOT NULL AUTO_INCREMENT,
  `cpId` int(11) NOT NULL,
  `newOrderNum` int(11) NOT NULL DEFAULT 0,
  `signOrderNum` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cpcId`),
  KEY `indexone` (`cpId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='城区统计';

DROP TABLE IF EXISTS `citypropercountdetail`;
CREATE TABLE `citypropercountdetail` (
  `cpcdId` int(11) NOT NULL AUTO_INCREMENT,
  `cpId` int(11) NOT NULL,
  `newOrderNum` int(11) NOT NULL DEFAULT 0,
  `signOrderNum` int(11) NOT NULL DEFAULT 0,
  `createDate` date NOT NULL,
  PRIMARY KEY (`cpcdId`),
  KEY `indexone` (`cpId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='城区统计详细';

DROP TABLE IF EXISTS `villagecount`;
CREATE TABLE `villagecount` (
  `vcId` int(11) NOT NULL AUTO_INCREMENT,
  `vId` int(11) NOT NULL,
  `newOrderNum` int(11) NOT NULL DEFAULT 0,
  `signOrderNum` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`vcId`),
  KEY `indexone` (`vId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='楼盘统计';

DROP TABLE IF EXISTS `villagecountdetail`;
CREATE TABLE `villagecountdetail` (
  `vcdId` int(11) NOT NULL AUTO_INCREMENT,
  `vId` int(11) NOT NULL,
  `newOrderNum` int(11) NOT NULL DEFAULT 0,
  `signOrderNum` int(11) NOT NULL DEFAULT 0,
  `createDate` date NOT NULL,
  PRIMARY KEY (`vcdId`),
  KEY `indexone` (`vId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='楼盘统计详细';
