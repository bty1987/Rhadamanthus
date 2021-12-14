CREATE DATABASE  IF NOT EXISTS `salary`;
USE `salary`;

DROP TABLE IF EXISTS `salary`;
CREATE TABLE `salary` (
  `sid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Id',
  `uid` int(11) NOT NULL COMMENT '员工编号',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `onetype` tinyint(1) NOT NULL COMMENT '一类',
  `twotype` tinyint(1) NOT NULL COMMENT '二类',
  `thrtype` tinyint(1) NOT NULL COMMENT '三类',
  `money` bigint(10) NOT NULL DEFAULT '0' COMMENT '操作金额',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `ouid` int(11) DEFAULT NULL COMMENT '操作人',
  `operateTime` timestamp NULL DEFAULT NULL COMMENT '操作时间',
  `comment` varchar(128) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='通用薪资';

DROP TABLE IF EXISTS `withhold`;
CREATE TABLE `withhold` (
  `wid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `orderId` varchar(15) NOT NULL,
  `ident` int(10) NOT NULL,
  `money` int(10) NOT NULL DEFAULT '0',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `ouid` int(11) NOT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`wid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='薪资扣款表';

DROP TABLE IF EXISTS `workerbalance`;
CREATE TABLE `workerbalance` (
  `wbid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `deposit` bigint(10) NOT NULL DEFAULT '0',
  `salary` bigint(10) NOT NULL DEFAULT '0',
  `toplimit` bigint(10) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`wbid`),
  KEY `oneindex` (`uid`),
  KEY `uniqueone` (`uid`,`company`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工人账户';

DROP TABLE IF EXISTS `workersalary`;
CREATE TABLE `workersalary` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) DEFAULT NULL,
  `cid` int(11) NOT NULL,
  `csid` int(11) NOT NULL,
  `cwsid` int(11) DEFAULT NULL,
  `schedule` tinyint(1) DEFAULT '0',
  `count` int(11) DEFAULT '0',
  `money` bigint(10) NOT NULL DEFAULT '0',
  `deposit` bigint(10) NOT NULL DEFAULT '0',
  `salary` bigint(10) NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL DEFAULT '0',
  `onetype` tinyint(1) NOT NULL,
  `twotype` tinyint(1) NOT NULL,
  `subtype` tinyint(4) DEFAULT '0' COMMENT '子类型',
  `isSend` tinyint(1) DEFAULT '0',
  `isAppr` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `wuid` int(11) NOT NULL COMMENT '工人ID',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `auid` int(11) DEFAULT NULL COMMENT '审批人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approveTime` timestamp NULL DEFAULT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL,
  `company` int(11) NOT NULL,
  `comment` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`wsid`),
  KEY `indexone` (`cid`,`wuid`),
  KEY `indextwo` (`createTime`),
  KEY `indexthr` (`orderId`),
  KEY `indexfor` (`isSend`),
  KEY `indexfiv` (`isAppr`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工人工费';
