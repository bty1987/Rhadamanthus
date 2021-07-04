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
  `scale` int(3) NOT NULL,
  `sort` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`psiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项比例项';

DROP TABLE IF EXISTS `constructionnode`;
CREATE TABLE `constructionnode` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `precheck` int(8) DEFAULT '0',
  `postcheck` int(8) DEFAULT '0',
  `stacheck` int(8) DEFAULT '0',
  `fincheck` int(8) DEFAULT '0',
  `startalk` varchar(128) NOT NULL COMMENT '开工话术',
  `endtalk` varchar(128) NOT NULL COMMENT '完工话术',
  `timeLimit` int(6) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: 启用, 1: 禁用',
  `sort` tinyint(2) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cnid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程节点表';
