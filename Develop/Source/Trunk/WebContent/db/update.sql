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

ALTER TABLE `platform`.`quotationversion` 
ADD COLUMN `trafficDiscount` TINYINT(1) NOT NULL DEFAULT 0 AFTER `trafficRate`,
ADD COLUMN `manageDiscount` TINYINT(1) NOT NULL DEFAULT 0 AFTER `manageRate`;

ALTER TABLE `platform`.`decorationpicture` 
ADD COLUMN `status` TINYINT(1) NOT NULL DEFAULT 0 AFTER `type`;
