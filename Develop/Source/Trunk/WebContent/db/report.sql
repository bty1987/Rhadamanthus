CREATE DATABASE  IF NOT EXISTS `report`;
USE `report`;

DROP TABLE IF EXISTS `regioncountdetail`;
CREATE TABLE `regioncountdetail` (
  `rcdId` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `quotation` int(11) NOT NULL DEFAULT 0,
  `deposit` int(11) NOT NULL DEFAULT 0,
  `resigned` int(11) NOT NULL DEFAULT 0,
  `signed` int(11) NOT NULL DEFAULT 0,
  `waste` int(11) NOT NULL DEFAULT 0,
  `completed` int(11) NOT NULL DEFAULT 0,
  `termination` int(11) NOT NULL DEFAULT 0,
  `contractPrice` decimal(12,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`rcdId`),
  KEY `indexone` (`rId`, `createDate`),
  UNIQUE INDEX `uniqueone` (`rId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='大区统计详细';

DROP TABLE IF EXISTS `citycountdetail`;
CREATE TABLE `citycountdetail` (
  `ccdId` int(11) NOT NULL AUTO_INCREMENT,
  `cId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `quotation` int(11) NOT NULL DEFAULT 0,
  `deposit` int(11) NOT NULL DEFAULT 0,
  `resigned` int(11) NOT NULL DEFAULT 0,
  `signed` int(11) NOT NULL DEFAULT 0,
  `waste` int(11) NOT NULL DEFAULT 0,
  `completed` int(11) NOT NULL DEFAULT 0,
  `termination` int(11) NOT NULL DEFAULT 0,
  `contractPrice` decimal(12,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`ccdId`),
  KEY `indexone` (`cId`, `createDate`),
  UNIQUE INDEX `uniqueone` (`cId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='城市统计详细';

DROP TABLE IF EXISTS `citypropercountdetail`;
CREATE TABLE `citypropercountdetail` (
  `cpcdId` int(11) NOT NULL AUTO_INCREMENT,
  `cpId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `quotation` int(11) NOT NULL DEFAULT 0,
  `deposit` int(11) NOT NULL DEFAULT 0,
  `resigned` int(11) NOT NULL DEFAULT 0,
  `signed` int(11) NOT NULL DEFAULT 0,
  `waste` int(11) NOT NULL DEFAULT 0,
  `completed` int(11) NOT NULL DEFAULT 0,
  `termination` int(11) NOT NULL DEFAULT 0,
  `contractPrice` decimal(12,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`cpcdId`),
  KEY `indexone` (`cpId`, `createDate`),
  UNIQUE INDEX `uniqueone` (`cpId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='城区统计详细';

DROP TABLE IF EXISTS `villagecount`;
CREATE TABLE `villagecount` (
  `vcId` int(11) NOT NULL AUTO_INCREMENT,
  `vId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `quotation` int(11) NOT NULL DEFAULT 0,
  `deposit` int(11) NOT NULL DEFAULT 0,
  `resigned` int(11) NOT NULL DEFAULT 0,
  `signed` int(11) NOT NULL DEFAULT 0,
  `waste` int(11) NOT NULL DEFAULT 0,
  `completed` int(11) NOT NULL DEFAULT 0,
  `termination` int(11) NOT NULL DEFAULT 0,
  `contractPrice` decimal(12,3) DEFAULT '0.000',
  PRIMARY KEY (`vcId`),
  KEY `indexone` (`vId`),
  UNIQUE INDEX `uniqueone` (`vId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='楼盘统计';

DROP TABLE IF EXISTS `villagecountdetail`;
CREATE TABLE `villagecountdetail` (
  `vcdId` int(11) NOT NULL AUTO_INCREMENT,
  `vId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `quotation` int(11) NOT NULL DEFAULT 0,
  `deposit` int(11) NOT NULL DEFAULT 0,
  `resigned` int(11) NOT NULL DEFAULT 0,
  `signed` int(11) NOT NULL DEFAULT 0,
  `waste` int(11) NOT NULL DEFAULT 0,
  `completed` int(11) NOT NULL DEFAULT 0,
  `termination` int(11) NOT NULL DEFAULT 0,
  `contractPrice` decimal(12,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`vcdId`),
  KEY `indexone` (`vId`, `createDate`),
  UNIQUE INDEX `uniqueone` (`vId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='楼盘统计详细';

DROP TABLE IF EXISTS `dusercountdetail`;
CREATE TABLE `dusercountdetail` (
  `ducdId` int(11) NOT NULL AUTO_INCREMENT,
  `duId` int(11) NOT NULL COMMENT '设计师ID',
  `suId` int(11) NOT NULL COMMENT '业务员ID',
  `createNum` decimal(10, 3) NOT NULL DEFAULT '0.000',
  `signNum` decimal(10, 3) NOT NULL DEFAULT '0.000',
  `contractPrice` decimal(10, 3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`ducdId`),
  KEY `indexone` (`duId`, `createDate`),
  KEY `indextwo` (`suId`, `createDate`),
  UNIQUE INDEX `uniqueone` (`duId`, `suId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='尺源人员统计详细';

DROP TABLE IF EXISTS `ddepartmentcountdetail`;
CREATE TABLE `ddepartmentcountdetail` (
  `ddcdId` int(11) NOT NULL AUTO_INCREMENT,
  `ddId` int(11) NOT NULL COMMENT '设计部ID',
  `sdId` int(11) NOT NULL COMMENT '业务部ID',
  `createNum` decimal(10, 3) NOT NULL DEFAULT '0.000',
  `signNum` decimal(10, 3) NOT NULL DEFAULT '0.000',
  `contractPrice` decimal(10, 3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`ddcdId`),
  KEY `indexone` (`ddId`, `createDate`),
  KEY `indextwo` (`sdId`, `createDate`),
  UNIQUE INDEX `uniqueone` (`ddId`, `sdId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='尺源部门统计详细';

DROP TABLE IF EXISTS `dregioncountdetail`;
CREATE TABLE `dregioncountdetail` (
  `drcdId` int(11) NOT NULL AUTO_INCREMENT,
  `ddId` int(11) NOT NULL COMMENT '设计分区ID',
  `sdId` int(11) NOT NULL COMMENT '业务分区ID',
  `createNum` decimal(10, 3) NOT NULL DEFAULT '0.000',
  `signNum` decimal(10, 3) NOT NULL DEFAULT '0.000',
  `contractPrice` decimal(10, 3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`drcdId`),
  KEY `indexone` (`ddId`, `createDate`),
  KEY `indextwo` (`sdId`, `createDate`),
  UNIQUE INDEX `uniqueone` (`ddId`, `sdId`, `createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='尺源分区统计详细';
