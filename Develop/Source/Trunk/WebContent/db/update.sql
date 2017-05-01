DROP TABLE IF EXISTS `workersalary`;
CREATE TABLE `workersalary` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT,
  `csid` int(11) DEFAULT NULL,
  `userId` varchar(15) NOT NULL,
  `createTime` timestamp NULL NOT NULL,
  `balanceTime` timestamp NULL NOT NULL,
  `salary` decimal(10,3) NOT NULL DEFAULT '0.000',
  `type` tinyint(4) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`wsid`),
  KEY `indexone` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工人工费';

DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `theme` varchar(64) NOT NULL,
  `type` tinyint(2) NOT NULL,
  `priority` tinyint(1) NOT NULL COMMENT '优先级',
  `startTime` date NOT NULL,
  `endTime` date NOT NULL,
  `createId` varchar(15) NOT NULL COMMENT '创建人编号',
  `createTime` timestamp NOT NULL,
  `isPublic` tinyint(1) NOT NULL,
  `contents` text NOT NULL,
  `texts` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `filePath` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公告表';

DROP TABLE IF EXISTS `noticedepartment`;
CREATE TABLE `noticedepartment` (
  `ndid` bigint(20) NOT NULL AUTO_INCREMENT,
  `nid` int(11) NOT NULL COMMENT '公告ID',
  `did` int(11) NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`ndid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公告部门表';

ALTER TABLE `platform`.`quotationversion` 
ADD COLUMN `trafficDiscount` TINYINT(1) NOT NULL DEFAULT 0 AFTER `trafficRate`,
ADD COLUMN `manageDiscount` TINYINT(1) NOT NULL DEFAULT 0 AFTER `manageRate`;

ALTER TABLE `platform`.`decorationpicture` 
ADD COLUMN `status` TINYINT(1) NOT NULL DEFAULT 0 AFTER `type`;
