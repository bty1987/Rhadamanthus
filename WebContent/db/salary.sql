CREATE DATABASE  IF NOT EXISTS `salary`;
USE `salary`;

DROP TABLE IF EXISTS `workersalary`;
CREATE TABLE `workersalary` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) DEFAULT NULL,
  `cid` int(11) NOT NULL,
  `userId` varchar(15) NOT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL,
  `salary` decimal(10,3) NOT NULL DEFAULT '0.000',
  `type` tinyint(4) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `subtype` tinyint(4) DEFAULT '0' COMMENT '子类型',
  `comment` varchar(64) DEFAULT NULL,
  `createrId` varchar(15) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approverId` varchar(15) DEFAULT NULL COMMENT '审批人',
  `approveTime` timestamp NULL DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`wsid`),
  KEY `indexone` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工人工费';