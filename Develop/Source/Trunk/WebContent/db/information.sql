CREATE DATABASE  IF NOT EXISTS information;
USE information;

CREATE TABLE `activity` (
  `aId` int(11) NOT NULL AUTO_INCREMENT,
  `activityName` varchar(32) NOT NULL,
  `createUserId` varchar(15) NOT NULL,
  `createUserName` varchar(32) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`aId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动表';

CREATE TABLE `activityitem` (
  `aiId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  `activityItemName` varchar(32) NOT NULL,
  `num` int(11) NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`aiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动物品表';

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

CREATE TABLE `events` (
  `eId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL, 
  `content` varchar(256) NOT NULL DEFAULT '',
  `createrId` varchar(15) DEFAULT NULL,
  `holderId` varchar(15) NOT NULL, 
 `createTime` timestamp NULL DEFAULT NULL, 
 `deptId` varchar(10) DEFAULT NULL,
 `regionId` varchar(10) DEFAULT NULL,
 `showDate` date NOT NULL,
 `type` tinyint(4) NOT NULL,
 PRIMARY KEY (`eId`),
KEY `indexone` (`holderId`,`showDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='事件表';

DROP TABLE IF EXISTS `membercard`;
CREATE TABLE `membercard` (
  `mcid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `credits` float NOT NULL DEFAULT '0',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='会员卡表';

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
  `createTime` int(11) NOT NULL,
  `comment` varchar(128),
  PRIMARY KEY (`mdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='会员积分明细表';

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `messageId` int(11) NOT NULL AUTO_INCREMENT,
  `receiverId` varchar(15) NOT NULL,
  `senderId` varchar(15) NOT NULL,
  `type` varchar(10) NOT NULL COMMENT '类别',
  `contents` varchar(256) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(10) NOT NULL COMMENT '未读,已读',
  `args` varchar(1024) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`messageId`),
  KEY `indexone` (`receiverId`,`status`,`type`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='信息';

DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
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

CREATE TABLE `noticedepartment` (
  `ndid` int(11) NOT NULL AUTO_INCREMENT,
  `nid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  PRIMARY KEY (`ndid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公告部门表';

CREATE TABLE `upgrade` (
  `ugid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `trialno` varchar(64) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `filesize` int(11) NOT NULL,
  PRIMARY KEY (`ugid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='升级表'; 