CREATE DATABASE IF NOT EXISTS `data`;
USE `data`;

DROP TABLE IF EXISTS `chainpage`;
CREATE TABLE `chainpage` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `url` varchar(512) NOT NULL,
  `comment` varchar(256) NOT NULL,
  `companymark` tinyint(1) NOT NULL,
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外链';

DROP TABLE IF EXISTS `drawlinegroup`;
CREATE TABLE `drawlinegroup` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `content` varchar(128) DEFAULT NULL,
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='放线小组表';

DROP TABLE IF EXISTS `materialmodel`;
CREATE TABLE `materialmodel` (
  `mmid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `brandId` int(11) NOT NULL,
  `category` varchar(30) NOT NULL DEFAULT '',
  `brand` varchar(30) NOT NULL DEFAULT '',
  `measurementunit` int(11) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `purchasePrice` decimal(10,3) NOT NULL,
  `discount` decimal(5,3) NOT NULL,
  `calcType` tinyint(`) NOT NULL DEFAULT '0',
  `point` decimal(5,3) NOT NULL,
  `base` decimal(5,3) NOT NULL,
  `status` tinyint(`) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`mmid`),
  KEY `indexone` (`name`),
  KEY `indextwo` (`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='型号表';

DROP TABLE IF EXISTS `paymentscale`;
CREATE TABLE `paymentscale` (
  `psid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `comment` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`psid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项比例';

DROP TABLE IF EXISTS `paymentscaleitem`;
CREATE TABLE `paymentscaleitem` (
  `psiid` int(11) NOT NULL AUTO_INCREMENT,
  `psid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `scale` tinyint(1) NOT NULL,
  PRIMARY KEY (`psiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项比例项';

