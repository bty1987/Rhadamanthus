CREATE DATABASE IF NOT EXISTS `balance`;
USE `balance`;

DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `buid` int(11) DEFAULT NULL,
  `cuid` int(11) DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `referMoney` int(11) NOT NULL,
  `realMoney` int(11) NOT NULL,
  `surplus` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`aid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='账户表';

DROP TABLE IF EXISTS `apportdetail`;
CREATE TABLE `apportdetail` (
  `adid` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) DEFAULT NULL,
  `cuid` int(11) DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `money` bigint(10) NOT NULL DEFAULT '0',
  `comment` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`adid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='分摊明细表';

DROP TABLE IF EXISTS `balance`;
CREATE TABLE `balance` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(128) DEFAULT NULL,
  `buid` int(11) DEFAULT NULL,
  `cuid` int(11) DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startTime` timestamp NULL DEFAULT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  `amount` int(8) NOT NULL DEFAULT '0',
  `surplus` int(8) NOT NULL DEFAULT '0',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='结算单表';

DROP TABLE IF EXISTS `balancedetail`;
CREATE TABLE `balancedetail` (
  `bdid` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) DEFAULT NULL,
  `aid` int(11) DEFAULT NULL,
  `ouid` int(11) NOT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `money` bigint(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`bdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='结算明细表';

DROP TABLE IF EXISTS `balancesales`;
CREATE TABLE `balancesales` (
  `bsid` int(11) NOT NULL AUTO_INCREMENT COMMENT '结算销售ID',
  `bid` int(11) DEFAULT NULL COMMENT '结算单ID',
  `name` varchar(36) NOT NULL COMMENT '名称',
  `brid` int(11) NOT NULL COMMENT '品牌ID',
  `grade` varchar(1) DEFAULT '' COMMENT '等级',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createtime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `income` bigint(10) DEFAULT '0' COMMENT '收入',
  `cost` bigint(10) DEFAULT '0' COMMENT '成本',
  `payment` bigint(10) DEFAULT '0' COMMENT '应付',
  `profit` bigint(10) DEFAULT '0' COMMENT '利润',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态,0:初始,1:结算,2:完结',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`bsid`),
  KEY `indexone` (`name`),
  KEY `indextwo` (`createtime`),
  KEY `indexthr` (`cuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='结算销售表';

DROP TABLE IF EXISTS `balancesalesbalance`;
CREATE TABLE `balancesalesbalance` (
  `bsbid` int(11) NOT NULL AUTO_INCREMENT COMMENT '销售结算ID',
  `bsid` int(11) NOT NULL COMMENT '结算销售ID',
  `sbid` int(11) NOT NULL COMMENT '销售结算ID',
  PRIMARY KEY (`bsbid`),
  KEY `indexone` (`bsid`),
  KEY `indextwo` (`sbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='结算销售结算表';

DROP TABLE IF EXISTS `comcost`;
CREATE TABLE `comcost` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `orderId` varchar(128) DEFAULT NULL,
  `ident` int(11) DEFAULT NULL,
  `money` int(11) NOT NULL,
  `cuid` int(11) DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(11) NOT NULL DEFAULT '0',
  `comment` varchar(11) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='成本表';

