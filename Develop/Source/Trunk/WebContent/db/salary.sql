CREATE DATABASE  IF NOT EXISTS `salary`;
USE `platform`;

DROP TABLE IF EXISTS `designersalary`;
CREATE TABLE `designersalary` (
  `dsid` int(11) NOT NULL AUTO_INCREMENT,
  `duid` int(11) NOT NULL COMMENT '设计师ID',
  `cuid` varchar(15) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL COMMENT '创建时间',
  `auid` varchar(15) COMMENT '审批人',
  `approveTime` timestamp NULL NOT NULL COMMENT '审批时间',
  `salary` decimal (10,3) NOT NULL,
  `balanceTime` timestamp NULL NOT NULL COMMENT '结算时间',
  `status` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`dsid`),
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='设计师工资';

DROP TABLE IF EXISTS `workersalary`;
CREATE TABLE `workersalary` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `csid` int(11) DEFAULT NULL,
  `userId` varchar(15) NOT NULL,
  `createrId` varchar(15) NOT NULL,
  `createTime` timestamp NULL NOT NULL,
  `approverId` varchar(15) NOT NULL,
  `approveTime` timestamp NULL NOT NULL,
  `balanceTime` timestamp NULL NOT NULL,
  `salary` decimal(10,3) NOT NULL DEFAULT '0.000',
  `type` tinyint(2) NOT NULL DEFAULT '0',
  `status` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`wsid`),
  KEY `indexone` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工人工费';