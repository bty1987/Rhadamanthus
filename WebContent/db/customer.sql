CREATE DATABASE IF NOT EXISTS `customer`;
USE `customer`;

DROP TABLE IF EXISTS `background`;
CREATE TABLE `background` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(64) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`bid`),
  UNIQUE KEY `oneindex` (`unionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务圈背景图片';

DROP TABLE IF EXISTS `circle`;
CREATE TABLE `circle` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `cuid` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `praise` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cid`),
  KEY `oneindex` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务圈';

DROP TABLE IF EXISTS `circledrawing`;
CREATE TABLE `circledrawing` (
  `cdid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`cdid`),
  KEY `oneindex` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务圈图片';

DROP TABLE IF EXISTS `customerorigin`;
CREATE TABLE `customerorigin` (
  `coid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客源ID',
  `name` varchar(32) NOT NULL,
  `gender` varchar(2) DEFAULT NULL,
  `phone` varchar(32) NOT NULL COMMENT '电话',
  `purpose` varchar(128) DEFAULT NULL COMMENT '目的',
  `intention` varchar(128) DEFAULT NULL COMMENT '意向',
  `price` varchar(64) DEFAULT NULL COMMENT '需求价格',
  `grade` varchar(32) DEFAULT NULL COMMENT '客户等级',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `buid` int(11) DEFAULT NULL COMMENT '归属人',
  `did` int(11) DEFAULT NULL COMMENT '归属部门',
  `rdid` int(11) DEFAULT NULL COMMENT '归属分区',
  `vid` int(11) DEFAULT NULL COMMENT '楼盘ID',
  `houseNumber` varchar(32) NOT NULL COMMENT '楼号',
  `buildArea` decimal(10,2) NOT NULL COMMENT '面积',
  `cid` int(11) DEFAULT NULL COMMENT '客户ID',
  `hid` int(11) DEFAULT NULL COMMENT '绑定房产ID',
  `duid` int(11) DEFAULT NULL COMMENT '设计师',
  `orderId` varchar(15) DEFAULT NULL COMMENT '生成装修单',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0(初始) , 1(审批) , 2(绑定装修单) , 3(失效)',
  `comment` varchar(128) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`coid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客源表';

DROP TABLE IF EXISTS `customerrecord`;
CREATE TABLE `customerrecord` (
  `crid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客户记录ID',
  `coid` int(11) NOT NULL COMMENT '客源ID',
  `comment` varchar(255) NOT NULL COMMENT '记录信息',
  `type` tinyint(1) NOT NULL COMMENT '记录类型',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operatTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`crid`),
  KEY `indexone` (`coid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客源记录';

DROP TABLE IF EXISTS `decoration`;
CREATE TABLE `decoration`  (
  `doId` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `address` varchar(128) NOT NULL,
  `defaultFlag` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`doId`),
  UNIQUE KEY `uniqueone` (`unionId`,`orderId`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户订单信息';

DROP TABLE IF EXISTS `emember`;
CREATE TABLE `emember`  (
  `emid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `name` varchar(64) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(128) NOT NULL,
  `unionId` varchar(32) NOT NULL,
  `ticket` varchar(32) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `activity` int(11) DEFAULT '1',
  PRIMARY KEY (`emid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='电子会员';

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback`  (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `content` varchar(512) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型 , 0:微信',
  `picture` varchar(255) NOT NULL DEFAULT '',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='反馈信息表';

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group`  (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `opengid` varchar(32) NOT NULL,
  `orderId` varchar(15) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `content` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`gid`),
  UNIQUE KEY `uniqueone` (`opengid`),
  KEY `indexone` (`opengid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='群信息';

DROP TABLE IF EXISTS `groupuser`;
CREATE TABLE `groupuser`  (
  `guid` int(11) NOT NULL AUTO_INCREMENT,
  `openGid` varchar(32) NOT NULL,
  `uid` varchar(15) NOT NULL,
  PRIMARY KEY (`guid`),
  KEY `indexone` (`openGid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='群用户信息';

DROP TABLE IF EXISTS `vrecord`;
CREATE TABLE `vrecord` (
  `vrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `vid` int(11) NOT NULL COMMENT '返单ID',
  `cuid` int(11) NOT NULL COMMENT '操作人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`vrid`),
  KEY `indexone` (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大客户记录';

DROP TABLE IF EXISTS `vscore`;
CREATE TABLE `vscore` (
  `vsid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  PRIMARY KEY (`vsid`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 CHARSET=utf8;

DROP TABLE IF EXISTS `vscorerecord`;
CREATE TABLE `vscorerecord` (
  `vsrid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `orderId` varchar(15) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `ouid` int(11) DEFAULT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(1) NOT NULL COMMENT ' 类型 , 0: 新增 , 1: 提取',
  `status` tinyint(1) DEFAULT NULL COMMENT '状态 , 0: 初始 , 1: 通过',
  `comment` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`vsrid`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 CHARSET=utf8;

DROP TABLE IF EXISTS `vustomer`;
CREATE TABLE `vustomer` (
  `vid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `unionId` varchar(32) NOT NULL COMMENT '微信ID',
  `buid` int(11) DEFAULT NULL,
  `referrer` varchar(32) NOT NULL,
  `referphone` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `phone` varchar(32) NOT NULL COMMENT '电话',
  `address` varchar(255) NOT NULL COMMENT '地址',
  `orderId` varchar(32) DEFAULT NULL COMMENT '订单ID',
  `contractPrice` decimal(10,2) DEFAULT NULL COMMENT '合同额',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`vid`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大客户';

DROP TABLE IF EXISTS `vustomernet`;
CREATE TABLE `vustomernet` (
  `vnid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `netunionId` varchar(32) NOT NULL,
  PRIMARY KEY (`vnid`),
  KEY `indexone` (`unionId`,`netunionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 CHARSET=utf8;
