CREATE DATABASE  IF NOT EXISTS `platform`;
USE `platform`;

CREATE TABLE `approvalfunctionright` (
  `pid` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL COMMENT '名称',
  `cfid` INT(11) NOT NULL COMMENT '',
  `company` INT(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审批-功能权限';

DROP TABLE IF EXISTS `customerfunctionright`;
CREATE TABLE `customerfunctionright` (
  `cfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `cfid` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客源-功能权限';

DROP TABLE IF EXISTS `customersourceright`;
CREATE TABLE `customersourceright` (
  `csdrid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`csdrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户源权限';

DROP TABLE IF EXISTS `decorationdesigndepartmentright`;
CREATE TABLE `decorationdesigndepartmentright` (
  `doddrId` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `dId` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`doddrId`),
  KEY `indexone` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单设计部权限';

DROP TABLE IF EXISTS `decorationfunctionright`;
CREATE TABLE `decorationfunctionright` (
  `dfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `dfid` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修功能-功能';
DROP TABLE IF EXISTS `decorationsalesmandepartmentright`;
CREATE TABLE `decorationsalesmandepartmentright` (
  `dsdrid` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `dId` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dsdrid`),
  KEY `indexone` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单业务部权限';

DROP TABLE IF EXISTS `decorationstatusright`;
CREATE TABLE `decorationstatusright` (
  `dsrid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dsrid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单状态权限';


DROP TABLE IF EXISTS `paymentfunctionright`;
CREATE TABLE `paymentfunctionright` (
  `pfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `pfid` int(11) DEFAULT NULL,
  `type` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项-功能权限';

DROP TABLE IF EXISTS `fdfsfile`;
CREATE TABLE `fdfsfile` (
  `ffid` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NULL DEFAULT '',
  `module` VARCHAR(32) NULL,
  `type` TINYINT(1) NULL,
  `atttype` TINYINT(1) NULL,
  `pid` INT(11) NULL,
  `path` VARCHAR(128) NULL DEFAULT '',
  `group` VARCHAR(32) NULL DEFAULT '',
  `group1` VARCHAR(32) NULL,
  `group2` VARCHAR(32) NULL DEFAULT '',
  `file` VARCHAR(128) NULL DEFAULT '',
  `postfix` VARCHAR(16) NULL DEFAULT '',
  `size` INT(10) NULL DEFAULT 0,
  PRIMARY KEY (`ffid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARACTER=utf8 COMMENT='资源表';

DROP TABLE IF EXISTS `productionfunctionright`;
CREATE TABLE `productionfunctionright` (
  `pfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `pfid` int(11) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='生产功能-功能';

DROP TABLE IF EXISTS `rolechainpage`;
CREATE TABLE `rolechainpage` (
  `rcpid` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `cpid` int(11) NOT NULL,
  PRIMARY KEY (`rcpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色-外链';

DROP TABLE IF EXISTS `salesfunctionright`;
CREATE TABLE `salesfunctionright` (
  `sfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `sfid` int(11) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`sfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售-功能权限';

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

DROP TABLE IF EXISTS `taskuserright`;
CREATE TABLE `taskuserright` (
  `tuid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`tuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员-任务权限表';
