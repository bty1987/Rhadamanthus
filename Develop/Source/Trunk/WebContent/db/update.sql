ALTER TABLE `platform`.`decorationorder` DROP COLUMN `orderType`;

ALTER TABLE `platform`.`decorationorder` ADD COLUMN `type` TINYINT NOT NULL DEFAULT 0 AFTER `status`;

ALTER TABLE `platform`.`quotation` ADD COLUMN `type` TINYINT NOT NULL DEFAULT 0 AFTER `status`;
ALTER TABLE `platform`.`quotation` ADD COLUMN `basicPrice` DECIMAL(10,3) NOT NULL DEFAULT 0.000;
ALTER TABLE `platform`.`quotation` ADD COLUMN `setpackage` DECIMAL(10,3) NOT NULL DEFAULT 0.000;
ALTER TABLE `platform`.`quotation` ADD COLUMN `qdiff` DECIMAL(10,3) NOT NULL DEFAULT 0.000;
ALTER TABLE `platform`.`quotation` ADD COLUMN `mdiff` DECIMAL(10,3) NOT NULL DEFAULT 0.000;

ALTER TABLE `platform`.`functionarea` ADD COLUMN `type` TINYINT NOT NULL DEFAULT 0;
ALTER TABLE `platform`.`functionarea` ADD COLUMN `total` DECIMAL(10,3) NOT NULL DEFAULT 0.000;

ALTER TABLE `platform`.`quotationfunctionarea` ADD COLUMN `type` TINYINT NOT NULL DEFAULT 0;
ALTER TABLE `platform`.`quotationfunctionarea` ADD COLUMN `total` DECIMAL(10,3) NOT NULL DEFAULT 0.000;

DROP TABLE IF EXISTS `quotationmaterialitem`;
CREATE TABLE `quotationmaterialitem` (
  `qmiId` int(11) NOT NULL AUTO_INCREMENT,
  `qid` bigint(20) NOT NULL,
  `no` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  `category` varchar(32) NOT NULL,
  `brand` varchar(32) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `price` decimal(10,3) NOT NULL,
  `diff` decimal(10,3) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `des` varchar(128),
  PRIMARY KEY (`qmiId`),
  KEY `indexone` (`qid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='报价主材项';

DROP TABLE IF EXISTS `decorationoperate`;
CREATE TABLE `decorationoperate` (
  `doId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `targerId` varchar(15),
  `operaterId` varchar(15),
  `operateTime` timestamp NULL DEFAULT NULL,
  `value` float NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `des` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`doId`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`operateTime`, `type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='装修订单操作';













update functionarea set type = 1;
update quotationfunctionarea set type = 1;
update quotationfunctionarea set type = 0 where functionAreaType = '0';


/*------------------------------------------------------------------------------------------------------------*/

ALTER TABLE `platform`.`decorationoperate` ADD COLUMN `sourcerId` VARCHAR(15) NULL AFTER `orderId`;