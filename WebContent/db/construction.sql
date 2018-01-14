CREATE DATABASE  IF NOT EXISTS `construction`;
USE `construction`;

DROP TABLE IF EXISTS `acceptance`;
CREATE TABLE `acceptance` (
  `actId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `acceptanceTime` date NOT NULL,
  `waterwayQuality` tinyint(1) DEFAULT NULL,
  `waterwayServer` tinyint(1) DEFAULT NULL,
  `waterwayHygiene` tinyint(1) DEFAULT NULL,
  `waterwayDes` varchar(256) DEFAULT NULL,
  `circuitQuality` tinyint(1) DEFAULT NULL,
  `circuitServer` tinyint(1) DEFAULT NULL,
  `circuitHygiene` tinyint(1) DEFAULT NULL,
  `circuitDes` varchar(256) DEFAULT NULL,
  `bricklayQuality` tinyint(1) DEFAULT NULL,
  `bricklayServer` tinyint(1) DEFAULT NULL,
  `bricklayHygiene` tinyint(1) DEFAULT NULL,
  `bricklayDes` varchar(256) DEFAULT NULL,
  `carpentQuality` tinyint(1) DEFAULT NULL,
  `carpentServer` tinyint(1) DEFAULT NULL,
  `carpentHygiene` tinyint(1) DEFAULT NULL,
  `carpentDes` varchar(256) DEFAULT NULL,
  `oilQuality` tinyint(1) DEFAULT NULL,
  `oilServer` tinyint(1) DEFAULT NULL,
  `oilHygiene` tinyint(1) DEFAULT NULL,
  `oilDes` varchar(256) DEFAULT NULL,
  `supervisQuality` tinyint(1) DEFAULT NULL,
  `supervisServer` tinyint(1) DEFAULT NULL,
  `supervisHygiene` tinyint(1) DEFAULT NULL,
  `supervisDes` varchar(256) DEFAULT NULL,
  `materialQuality` tinyint(1) DEFAULT NULL,
  `materialServer` tinyint(1) DEFAULT NULL,
  `materialDes` varchar(256) DEFAULT NULL,
  `question` varchar(256) DEFAULT NULL,
  `propose` varchar(256) DEFAULT NULL,
  `multiple` tinyint(1) DEFAULT NULL,
  `internal` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`actId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程验收表';

DROP TABLE IF EXISTS `constructer`;
CREATE TABLE `constructer` (
  `crid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `orderId` varchar(15) DEFAULT NULL,
  `userId` varchar(15) NOT NULL COMMENT '施工人员编号',
  `schedule` int(11) NOT NULL COMMENT '施工进度',
  `rate` tinyint(1) DEFAULT '0' COMMENT '评分',
  `assessment` varchar(128) DEFAULT NULL COMMENT '评价',
  `createrId` varchar(15) DEFAULT NULL COMMENT '创建人编号',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`crid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='施工人员表';

DROP TABLE IF EXISTS `construction`;
CREATE TABLE `construction` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) DEFAULT '',
  `supervisorQualityId` varchar(15) DEFAULT '',
  `schedule` tinyint(1) DEFAULT '0',
  `chanStatus` tinyint(1) DEFAULT '0',
  `allocationWorkerFlag` int(11) DEFAULT '0',
  PRIMARY KEY (`cid`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`supervisorQualityId`),
  KEY `indexthr` (`schedule`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程进度表';

DROP TABLE IF EXISTS `constructiondrawing`;
CREATE TABLE `constructiondrawing` (
  `cdid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `drawingName` varchar(15) DEFAULT NULL COMMENT '图片名',
  `drawingUrl` varchar(256) NOT NULL COMMENT '图片路径',
  `drawingAddUrl` varchar(256) DEFAULT NULL COMMENT ' 图片路径,保留字段',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型',
  `createrId` varchar(15) DEFAULT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `schedule` tinyint(1) NOT NULL COMMENT '工程进度',
  PRIMARY KEY (`cdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程图纸表';
DROP TABLE IF EXISTS `constructionschedule`;
CREATE TABLE `constructionschedule` (
  `csid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单ID',
  `startTime` date NOT NULL COMMENT '开工时间',
  `endTime` date NOT NULL COMMENT '完工时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '工程进度状态',
  `schedule` tinyint(1) NOT NULL COMMENT '工程进度',
  PRIMARY KEY (`csid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程进度表';


DROP TABLE IF EXISTS `customerservicebackvisit`;
CREATE TABLE `customerservicebackvisit` (
  `csbvId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `orderAddr` varchar(128) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `backVisitTime` date NOT NULL,
  `backVisitType` tinyint(1) NOT NULL DEFAULT '0',
  `backVisitDes` varchar(256) NOT NULL,
  PRIMARY KEY (`csbvId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服回访表';

DROP TABLE IF EXISTS `customerservicecomplaint`;
CREATE TABLE `customerservicecomplaint` (
  `cscId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `createrId` varchar(15) NOT NULL,
  `createrName` varchar(32) NOT NULL,
  `operaterId` varchar(15) NOT NULL,
  `operaterName` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `level` tinyint(1) NOT NULL,
  `createTime` date NOT NULL,
  `status` tinyint(1) NOT NULL,
  `handle` varchar(256) NOT NULL,
  `handleTime` date NOT NULL,
  `des` varchar(256) NOT NULL,
  PRIMARY KEY (`cscId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服投诉表';

DROP TABLE IF EXISTS `customerserviceguarantee`;
CREATE TABLE `customerserviceguarantee` (
  `csgId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `guaranteeTime` date NOT NULL,
  `guaranteeDes` varchar(256) NOT NULL,
  PRIMARY KEY (`csgId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客服保修表';

DROP TABLE IF EXISTS `drawline`;
CREATE TABLE `drawline` (
  `dlId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `applayTime` timestamp NULL DEFAULT NULL,
  `applayDes` varchar(100) DEFAULT NULL,
  `actualStartTime` timestamp NULL DEFAULT NULL,
  `actualEndTime` timestamp NULL DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL COMMENT '排队,申请放线,放线失败,放线成功',
  `applayCount` int(11) DEFAULT '1',
  `applayUserId` varchar(15) DEFAULT NULL,
  `drawLineGroup` varchar(45) DEFAULT NULL,
  `drawLineUserId` varchar(15) DEFAULT NULL,
  `dgid` int(11) DEFAULT NULL,
  PRIMARY KEY (`dlId`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`drawLineGroup`,`status`,`applayTime`),
  KEY `indexthr` (`status`,`actualStartTime`,`actualEndTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单放线表';

DROP TABLE IF EXISTS `inspectiondeduction`;
CREATE TABLE `inspectiondeduction` (
  `idId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `orderAddr` varchar(128) NOT NULL,
  `deductionMoney` decimal(10,3) NOT NULL,
  `deductionTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deductionDes` varchar(256) NOT NULL,
  PRIMARY KEY (`idId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='巡检扣款表';

DROP TABLE IF EXISTS `inspectionrecord`;
CREATE TABLE `inspectionrecord` (
  `irId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `orderAddr` varchar(128) NOT NULL,
  `operaterId` varchar(15) NOT NULL,
  `operaterName` varchar(32) NOT NULL,
  `startTime` timestamp NULL DEFAULT NULL,
  `recordDes` varchar(256) NOT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`irId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='巡检记录表';

DROP TABLE IF EXISTS `qualitytestingrecord`;
CREATE TABLE `qualitytestingrecord` (
  `qtrId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `orderAddr` varchar(128) NOT NULL,
  `operaterId` varchar(15) NOT NULL,
  `operaterName` varchar(32) NOT NULL,
  `recordTime` timestamp NULL DEFAULT NULL,
  `recordDes` varchar(256) NOT NULL,
  PRIMARY KEY (`qtrId`),
  KEY `indexone` (`operaterId`,`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='质检记录表';

DROP TABLE IF EXISTS `rework`;
CREATE TABLE `rework` (
  `rwId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `createrId` varchar(15) NOT NULL,
  `createrName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `reworkDes` varchar(256) NOT NULL,
  PRIMARY KEY (`rwId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='返工表';

DROP TABLE IF EXISTS `reworkdrawing`;
CREATE TABLE `reworkdrawing` (
  `rwdId` int(11) NOT NULL AUTO_INCREMENT,
  `rwId` int(11) NOT NULL,
  `rwdName` varchar(15) NOT NULL,
  `rwdUrl` varchar(256) NOT NULL,
  `rwdAddUrl` varchar(256) NOT NULL,
  `operatorName` varchar(32) NOT NULL DEFAULT '',
  `operateTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`rwdId`),
  KEY `indexone` (`rwId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='返工图片表';
