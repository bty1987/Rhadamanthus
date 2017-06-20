CREATE DATABASE  IF NOT EXISTS `report`;
USE `report`;

DROP TABLE IF EXISTS `checkwork`;
CREATE TABLE `checkwork` (
  `cwId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `workDate` date NOT NULL,
  `checkType` tinyint(4) NOT NULL COMMENT '1: OnDuty 上班 , 2: OffDuty 下班',
  `sourceType` tinyint(4) NOT NULL COMMENT '1: ATM 考勤机 , 2: USER 用户打卡 , 3: BOSS 老板改签 , 4: APPROVE 审批 , 5: RECHECK 重新计算 , 6: SYSTEM 考勤系统',
  `result` tinyint(4) NOT NULL COMMENT '1: Normal 正常 , 2: Early 早退 , 3: Late 迟到 , 4: SeriousLate 严重迟到 , 5: NotSigned 未打卡',
  `location` tinyint(4) NOT NULL COMMENT '1: Normal 范围内 , 2: Outside 范围外, 3: NotSigned 未打卡',
  `baseTime` timestamp NULL DEFAULT NULL COMMENT '基准时间 , 计算迟到和早退',
  `checkTime` timestamp NULL DEFAULT NULL COMMENT '打卡时间',
  PRIMARY KEY (`cwId`),
  KEY `indexone` (`userId`,`workDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='考勤记录';

DROP TABLE IF EXISTS `citycountdetail`;
CREATE TABLE `citycountdetail` (
  `ccdId` int(11) NOT NULL AUTO_INCREMENT,
  `cId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT '0',
  `amount` int(11) NOT NULL DEFAULT '0',
  `quotation` int(11) NOT NULL DEFAULT '0',
  `deposit` int(11) NOT NULL DEFAULT '0',
  `resigned` int(11) NOT NULL DEFAULT '0',
  `signed` int(11) NOT NULL DEFAULT '0',
  `waste` int(11) NOT NULL DEFAULT '0',
  `completed` int(11) NOT NULL DEFAULT '0',
  `termination` int(11) NOT NULL DEFAULT '0',
  `contractPrice` decimal(13,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`ccdId`),
  UNIQUE KEY `uniqueone` (`cId`,`createDate`),
  KEY `indexone` (`cId`,`createDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='城市统计详细';

DROP TABLE IF EXISTS `citypropercountdetail`;
CREATE TABLE `citypropercountdetail` (
  `cpcdId` int(11) NOT NULL AUTO_INCREMENT,
  `cpId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT '0',
  `amount` int(11) NOT NULL DEFAULT '0',
  `quotation` int(11) NOT NULL DEFAULT '0',
  `deposit` int(11) NOT NULL DEFAULT '0',
  `resigned` int(11) NOT NULL DEFAULT '0',
  `signed` int(11) NOT NULL DEFAULT '0',
  `waste` int(11) NOT NULL DEFAULT '0',
  `completed` int(11) NOT NULL DEFAULT '0',
  `termination` int(11) NOT NULL DEFAULT '0',
  `contractPrice` decimal(12,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`cpcdId`),
  UNIQUE KEY `uniqueone` (`cpId`,`createDate`),
  KEY `indexone` (`cpId`,`createDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='城区统计详细';

DROP TABLE IF EXISTS `ddepartmentcountdetail`;
CREATE TABLE `ddepartmentcountdetail` (
  `ddcdId` int(11) NOT NULL AUTO_INCREMENT,
  `ddId` int(11) NOT NULL COMMENT '设计部ID',
  `sdId` int(11) NOT NULL COMMENT '业务部ID',
  `createNum` decimal(10,3) NOT NULL DEFAULT '0.000',
  `signNum` decimal(10,3) NOT NULL DEFAULT '0.000',
  `contractPrice` decimal(10,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`ddcdId`),
  UNIQUE KEY `uniqueone` (`ddId`,`sdId`,`createDate`),
  KEY `indexone` (`ddId`,`createDate`),
  KEY `indextwo` (`sdId`,`createDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='尺源部门统计详细';

DROP TABLE IF EXISTS `dregioncountdetail`;
CREATE TABLE `dregioncountdetail` (
  `drcdId` int(11) NOT NULL AUTO_INCREMENT,
  `ddId` int(11) NOT NULL COMMENT '设计分区ID',
  `sdId` int(11) NOT NULL COMMENT '业务分区ID',
  `createNum` decimal(10,3) NOT NULL DEFAULT '0.000',
  `signNum` decimal(10,3) NOT NULL DEFAULT '0.000',
  `contractPrice` decimal(10,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`drcdId`),
  UNIQUE KEY `uniqueone` (`ddId`,`sdId`,`createDate`),
  KEY `indexone` (`ddId`,`createDate`),
  KEY `indextwo` (`sdId`,`createDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='尺源分区统计详细';

DROP TABLE IF EXISTS `dusercountdetail`;
CREATE TABLE `dusercountdetail` (
  `ducdId` int(11) NOT NULL AUTO_INCREMENT,
  `duId` int(11) NOT NULL COMMENT '设计师ID',
  `suId` int(11) NOT NULL COMMENT '业务员ID',
  `createNum` decimal(10,3) NOT NULL DEFAULT '0.000',
  `signNum` decimal(10,3) NOT NULL DEFAULT '0.000',
  `contractPrice` decimal(10,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`ducdId`),
  UNIQUE KEY `uniqueone` (`duId`,`suId`,`createDate`),
  KEY `indexone` (`duId`,`createDate`),
  KEY `indextwo` (`suId`,`createDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='尺源人员统计详细';

DROP TABLE IF EXISTS `regioncountdetail`;
CREATE TABLE `regioncountdetail` (
  `rcdId` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT '0',
  `amount` int(11) NOT NULL DEFAULT '0',
  `quotation` int(11) NOT NULL DEFAULT '0',
  `deposit` int(11) NOT NULL DEFAULT '0',
  `resigned` int(11) NOT NULL DEFAULT '0',
  `signed` int(11) NOT NULL DEFAULT '0',
  `waste` int(11) NOT NULL DEFAULT '0',
  `completed` int(11) NOT NULL DEFAULT '0',
  `termination` int(11) NOT NULL DEFAULT '0',
  `contractPrice` decimal(13,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`rcdId`),
  UNIQUE KEY `uniqueone` (`rId`,`createDate`),
  KEY `indexone` (`rId`,`createDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大区统计详细';

DROP TABLE IF EXISTS `villagecount`;
CREATE TABLE `villagecount` (
  `vcId` int(11) NOT NULL AUTO_INCREMENT,
  `vId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT '0',
  `amount` int(11) NOT NULL DEFAULT '0',
  `quotation` int(11) NOT NULL DEFAULT '0',
  `deposit` int(11) NOT NULL DEFAULT '0',
  `resigned` int(11) NOT NULL DEFAULT '0',
  `signed` int(11) NOT NULL DEFAULT '0',
  `waste` int(11) NOT NULL DEFAULT '0',
  `completed` int(11) NOT NULL DEFAULT '0',
  `termination` int(11) NOT NULL DEFAULT '0',
  `contractPrice` decimal(12,3) DEFAULT '0.000',
  PRIMARY KEY (`vcId`),
  UNIQUE KEY `uniqueone` (`vId`),
  KEY `indexone` (`vId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='楼盘统计';

DROP TABLE IF EXISTS `villagecountdetail`;
CREATE TABLE `villagecountdetail` (
  `vcdId` int(11) NOT NULL AUTO_INCREMENT,
  `vId` int(11) NOT NULL,
  `consult` int(11) NOT NULL DEFAULT '0',
  `amount` int(11) NOT NULL DEFAULT '0',
  `quotation` int(11) NOT NULL DEFAULT '0',
  `deposit` int(11) NOT NULL DEFAULT '0',
  `resigned` int(11) NOT NULL DEFAULT '0',
  `signed` int(11) NOT NULL DEFAULT '0',
  `waste` int(11) NOT NULL DEFAULT '0',
  `completed` int(11) NOT NULL DEFAULT '0',
  `termination` int(11) NOT NULL DEFAULT '0',
  `contractPrice` decimal(12,3) DEFAULT '0.000',
  `createDate` date NOT NULL,
  PRIMARY KEY (`vcdId`),
  UNIQUE KEY `uniqueone` (`vId`,`createDate`),
  KEY `indexone` (`vId`,`createDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='楼盘统计详细';