CREATE DATABASE  IF NOT EXISTS `information` ;
USE `information`;

DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
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
  PRIMARY KEY (`aiid`)
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
  `theme` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '1: 通知, 2: 活动',
  `priority` tinyint(1) NOT NULL COMMENT '优先级 , 0: 普通, 1: 重要, 2: 紧急',
  `startTime` date NOT NULL,
  `endTime` date NOT NULL,
  `publishTime` date NOT NULL,
  `isPublic` tinyint(1) NOT NULL COMMENT '公开, 0: 公开, 1: 非公开',
  `contents` varchar(256) NOT NULL,
  `filePath` varchar(128) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`nid`),
  KEY `indexone` (`type`,`isPublic`,`startTime`,`endTime`,`publishTime`)
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
  `type` int(11) NOT NULL COMMENT '录音类型 0:初始,1:本地,2:线上,3:失败',
  `url` varchar(255) DEFAULT NULL COMMENT '录音地址',
  PRIMARY KEY (`pcrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='电话回拨记录表';
DROP TABLE IF EXISTS `plan`;

CREATE TABLE `plan` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `args` varchar(128) DEFAULT NULL COMMENT '参数',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON COMMENT '创建时间',
  `executetime` varchar(10) DEFAULT NULL COMMENT '执行时间',
  `resultfilepath` varchar(128) COMMENT '结果文件路径',
  `infofilepath` varchar(128) COMMENT '信息文件路径',
  `schedule` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态,0:初始,1:取消,2:成功,3:失败,4:执行',
  `info` varchar(20) DEFAULT NULL COMMENT '结果信息',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pid`),
  KEY `indexone` (`cuid`),
  KEY `indextwo` (`executetime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划表';
DROP TABLE IF EXISTS `task`;

CREATE TABLE `task` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8 NOT NULL,
  `filepath` varchar(128) CHARACTER SET utf8 NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '命令类型 , 0: PYTHON, 1: SHELL',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 启用, 1: 禁用',
  `keyword` varchar(32) COMMENT '任务关键字',
  `handle` tinyint(1) NOT NULL,
  `plugins` varchar(16) DEFAULT '' COMMENT '插件信息,A: 日期, B: 日期范围, C: 上传控件, D: 参数',
  PRIMARY KEY (`tid`)
)  ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='任务表';

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



















DROP TABLE IF EXISTS `vpayment`;
CREATE TABLE `vpayment` (
  `vpid` int(11) NOT NULL AUTO_INCREMENT,
  `vrid` int(11),
  `mno` varchar(15) NOT NULL,
  `orderId` varchar(32),
  `createrId` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(1) NOT NULL,
  `brand` varchar(32),
  `money` decimal(10,3) NOT NULL,
  `status` tinyint(2) NOT NULL,
  `expire` tinyint(1) DEFAULT '0' COMMENT '到期标识 , 0: 有效 , 1: 到期',
  `comment` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`vpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动款';
DROP TABLE IF EXISTS `vreceipt`;
CREATE TABLE `vreceipt` (
  `vrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '活动收据ID',
  `cluid` int(11) NOT NULL COMMENT '收款人ID',
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款时间',
  `cash` decimal(11,3) NOT NULL COMMENT '现金',
  `bank` decimal(11,3) NOT NULL COMMENT '刷卡',
  `bankInfo` varchar(255) NOT NULL COMMENT '刷卡信息',
  `coupon` decimal(10,2) NOT NULL COMMENT '券值',
  `couponInfo` varchar(255) NOT NULL COMMENT '券信息',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`vrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动收据';
DROP TABLE IF EXISTS `vticket`;
CREATE TABLE `vticket` (
  `vtid` int(11) NOT NULL AUTO_INCREMENT COMMENT '活动票ID',
  `tno` varchar(15) CHARACTER SET utf8 NOT NULL COMMENT '活动票号',
  `cuid` int(11) DEFAULT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `buid` int(11) DEFAULT NULL COMMENT '归属人',
  `did` int(11) DEFAULT NULL COMMENT '归属部门',
  `rid` int(11) DEFAULT NULL COMMENT '归属分区',
  `orderId` varchar(15) CHARACTER SET utf8 DEFAULT NULL COMMENT '装修单号',
  `name` varchar(15) CHARACTER SET utf8 DEFAULT NULL COMMENT '姓名',
  `phone` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '电话',
  `address` varchar(128) CHARACTER SET utf8 DEFAULT NULL COMMENT '地址',
  `isregist` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否注册',
  `iscome` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否到场',
  `expire` tinyint(1) DEFAULT '0' COMMENT '到期标识 , 0: 有效 , 1: 到期',
  PRIMARY KEY (`vtid`),
  UNIQUE KEY `indexone` (`tno`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动票表';