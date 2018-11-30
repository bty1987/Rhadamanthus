CREATE DATABASE  IF NOT EXISTS `salary`;
USE `salary`;

DROP TABLE IF EXISTS `workersalary`;
CREATE TABLE `workersalary` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) DEFAULT NULL,
  `cid` int(11) NOT NULL,
  `csid` int(11) NOT NULL,
  `wuid` int(11) NOT NULL COMMENT '工人ID',
  `balanceTime` timestamp NULL DEFAULT NULL,
  `salary` decimal(10,3) NOT NULL DEFAULT '0.000',
  `type` tinyint(4) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `subtype` tinyint(4) DEFAULT '0' COMMENT '子类型',
  `comment` varchar(64) DEFAULT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `auid` int(11) DEFAULT NULL COMMENT '审批人ID',
  `approveTime` timestamp NULL DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`wsid`),
  KEY `indexone` (`cid`,`wuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工人工费';



DROP TABLE IF EXISTS `workerbalance`;
CREATE TABLE `workerbalance` (
  `wbid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `deposit` decimal(10,3) NOT NULL DEFAULT '0.000',
  `salary` decimal(10,3) NOT NULL DEFAULT '0.000',
  `toplimit` decimal(10,3) NOT NULL DEFAULT '0.000',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`wbid`),
  KEY `oneindex` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工人账户';