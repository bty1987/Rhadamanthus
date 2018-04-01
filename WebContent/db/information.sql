CREATE DATABASE  IF NOT EXISTS `information` ;
USE `information`;

DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(32) NOT NULL DEFAULT '',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动表';

DROP TABLE IF EXISTS `activityitem`;
CREATE TABLE `activityitem` (
  `aiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `num` int(11) NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`aiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动物品表';

DROP TABLE IF EXISTS `assassin`;
CREATE TABLE `assassin` (
  `asId` int(11) NOT NULL AUTO_INCREMENT,
  `api` varchar(64) NOT NULL,
  `params` varchar(512) NOT NULL,
  `server` varchar(32) NOT NULL,
  `errorcode` int(11) NOT NULL,
  `errormes` varchar(255) NOT NULL,
  `ouid` int(11) NOT NULL DEFAULT '0',
  `operateTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`asId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='代理表';

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL, 
  `content` varchar(256) NOT NULL DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `huid` int(11) NOT NULL COMMENT '持有人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `did` int(11) DEFAULT NULL COMMENT '归属部门ID',
  `rid` int(11) DEFAULT NULL COMMENT '归属分区ID',
  `showDate` date NOT NULL,
  `type` tinyint(4) NOT NULL,
  PRIMARY KEY (`eid`),
  KEY `indexone` (`huid`,`showDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='事件表';

DROP TABLE IF EXISTS `membercard`;
CREATE TABLE `membercard` (
  `mcid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `credits` float NOT NULL DEFAULT '0',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mcid`),
  UNIQUE KEY `uniqueone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='会员卡表';

DROP TABLE IF EXISTS `memberdetail`;
CREATE TABLE `memberdetail` (
  `mdid` int(11) NOT NULL AUTO_INCREMENT,
  `mcid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1:主材, 2:装修',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: +, 1: -',
  `credit` float NOT NULL DEFAULT '0',
  `balance` int(11) NOT NULL DEFAULT '0' COMMENT '余额',
  `multiple` int(11) NOT NULL DEFAULT '0' COMMENT '倍数, 积分倍数',
  `divider` int(11) NOT NULL DEFAULT '0' COMMENT '除数,金额/除数=积分',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` bigint(20) NOT NULL,
  `comment` varchar(128),
  PRIMARY KEY (`mdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='会员积分明细表';

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `ruid` int(11) NOT NULL COMMENT '接收人ID',
  `suid` int(11) DEFAULT NULL COMMENT '发送人ID',
  `type` tinyint(1) NOT NULL COMMENT '类别',
  `contents` varchar(256) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL COMMENT '未读,已读',
  `args` varchar(1024) DEFAULT NULL,
  `company` int(11) NOT NULL,
  `dresult` tinyint(1) NOT NULL,
  PRIMARY KEY (`mid`),
  KEY `indexone` (`ruid`,`status`,`type`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='信息';

DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `deptId` varchar(10) NOT NULL DEFAULT '',
  `theme` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '1: 通知, 2: 活动',
  `priority` tinyint(1) NOT NULL COMMENT '优先级 , 0: 普通, 1: 重要, 2: 紧急',
  `startTime` date NOT NULL,
  `endTime` date NOT NULL,
  `publishTime` date NOT NULL,
  `isPublic` tinyint(1) NOT NULL COMMENT '公开, 0: 公开, 1: 非公开',
  `contents` varchar(4096) NOT NULL,
  `contentsText` varchar(1024) NOT NULL,
  `filePath` varchar(128) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`nid`),
  KEY `indexone` (`type`,`deptId`,`isPublic`,`startTime`,`endTime`,`publishTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公告';

DROP TABLE IF EXISTS `noticedepartment`;
CREATE TABLE `noticedepartment` (
  `ndid` int(11) NOT NULL AUTO_INCREMENT,
  `nid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  PRIMARY KEY (`ndid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公告部门表';

DROP TABLE IF EXISTS `phonecall`;
CREATE TABLE `phonecall` (
  `pcid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) DEFAULT NULL COMMENT '订单编号',
  `operater` varchar(15) NOT NULL COMMENT '操作人',
  `ouid` int(11) NOT NULL COMMENT '操作人ID',
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `callbackId` varchar(32) DEFAULT NULL COMMENT '通话信息id',
  `caller` varchar(32) NOT NULL COMMENT '主叫号码',
  `callee` varchar(32) NOT NULL COMMENT '被叫号码',
  `startTime` bigint(20) DEFAULT '0',
  `endTime` bigint(20) DEFAULT '0',
  `stopReason` int(11) DEFAULT NULL COMMENT '挂断原因',
  `duration` int(11) DEFAULT NULL COMMENT '时长',
  PRIMARY KEY (`pcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='电话回拨';

DROP TABLE IF EXISTS `phonecallrecord`;
CREATE TABLE `phonecallrecord` (
  `pcrid` int(11) NOT NULL AUTO_INCREMENT,
  `pcid` int(11) NOT NULL,
  `recordType` int(11) NOT NULL COMMENT '录音类型 0:初始,1:本地,2:线上,3:失败',
  `recordUrl` varchar(255) DEFAULT NULL COMMENT '录音地址',
  PRIMARY KEY (`pcrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='电话回拨记录表';

DROP TABLE IF EXISTS `upgrade`;
CREATE TABLE `upgrade` (
  `ugid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `trialno` varchar(64) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `filesize` bigint(64) NOT NULL,
  PRIMARY KEY (`ugid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='升级表'; 