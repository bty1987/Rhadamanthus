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
  UNIQUE KEY `uniqueone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程验收表';

DROP TABLE IF EXISTS `constructer`;
CREATE TABLE `constructer` (
  `crid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `orderId` varchar(15) DEFAULT NULL,
  `wuid` int(11) NOT NULL COMMENT '工人ID',
  `schedule` int(11) NOT NULL COMMENT '施工进度',
  `rate` tinyint(1) DEFAULT '0' COMMENT '评分',
  `assessment` varchar(128) DEFAULT NULL COMMENT '评价',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`crid`),
  KEY `indexone` (`cid`,`wuid`),
  KEY `indextwo` (`orderId`),
  KEY `indexthr` (`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='施工人员表';

DROP TABLE IF EXISTS `construction`;
CREATE TABLE `construction` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) DEFAULT '',
  `suid` int(11) DEFAULT NULL,
  `luid` int(11) DEFAULT NULL,
  `schedule` tinyint(1) DEFAULT '0',
  `createTime` timestamp NULL DEFAULT NULL,
  `finishTime` timestamp NULL DEFAULT NULL,
  `startTime` timestamp NULL DEFAULT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  `accessory` tinyint(1) DEFAULT '0',
  `lockTime` timestamp NULL DEFAULT NULL,
  `accessoryLimit` bigint(10) NOT NULL DEFAULT '0' COMMENT '辅料上限',
  `salaryLimit` bigint(10) NOT NULL DEFAULT '0' COMMENT '工费上限',
  `accessoryTotal` bigint(10) NOT NULL DEFAULT '0' COMMENT '辅料总额',
  `salaryTotal` bigint(10) NOT NULL DEFAULT '0' COMMENT '工费总额',
  PRIMARY KEY (`cid`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`suid`),
  KEY `indexthr` (`schedule`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程进度表';

DROP TABLE IF EXISTS `constructionaccessory`;
CREATE TABLE `constructionaccessory` (
  `caid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程单ID',
  `aid` int(11) NOT NULL COMMENT '辅材ID',
  `checkup` tinyint(1) NOT NULL DEFAULT '0' COMMENT '验证标识',
  `numLimit` bigint(10) NOT NULL DEFAULT '0' COMMENT '数量上限',
  `num` bigint(10) NOT NULL DEFAULT '0' COMMENT '数量',
  `total` bigint(10) NOT NULL DEFAULT '0' COMMENT '总额',
  PRIMARY KEY (`caid`),
  KEY `indexone` (`cid`,`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程辅料';

DROP TABLE IF EXISTS `constructioncost`;
CREATE TABLE `constructioncost` (
  `ccid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `areaLeft` int(8) NOT NULL DEFAULT '0' COMMENT '起始面积',
  `areaRight` int(8) NOT NULL DEFAULT '0' COMMENT '终止面积',
  `accessory` bigint(10) NOT NULL DEFAULT '0' COMMENT '辅料上限',
  `salary` bigint(10) NOT NULL DEFAULT '0' COMMENT '工费上限',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: 启用, 1: 禁用',
  `sort` tinyint(1) NOT NULL DEFAULT '0' COMMENT '排序',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ccid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程成本';

DROP TABLE IF EXISTS `constructiondrawing`;
CREATE TABLE `constructiondrawing` (
  `cdid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `drawingName` varchar(15) DEFAULT NULL COMMENT '图片名',
  `drawingUrl` varchar(256) NOT NULL COMMENT '图片路径',
  `drawingAddUrl` varchar(256) DEFAULT NULL COMMENT ' 图片路径,保留字段',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `schedule` tinyint(1) NOT NULL COMMENT '工程进度',
  PRIMARY KEY (`cdid`),
  KEY `indexone` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程图纸表';

DROP TABLE IF EXISTS `constructioninfo`;
CREATE TABLE `constructioninfo` (
  `ciid` int(11) NOT NULL AUTO_INCREMENT COMMENT '信息ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `ishovel` tinyint(1) NOT NULL DEFAULT '0' COMMENT '铲大白',
  `iskey` tinyint(1) NOT NULL DEFAULT '0' COMMENT '钥匙',
  `isCeremony` tinyint(1) NOT NULL DEFAULT '0' COMMENT '备注说明',
  `timeLimit` int(8) NOT NULL DEFAULT '0' COMMENT '工期',
  `finishTime` timestamp NULL DEFAULT NULL COMMENT '预计完工时间',
  `keyTime` timestamp NULL DEFAULT NULL COMMENT '预计领钥匙时间',
  `drawlineTime` timestamp NULL DEFAULT NULL COMMENT '预计放线时间',
  `designTime` timestamp NULL DEFAULT NULL,
  `comment` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`ciid`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`cid`),
  KEY `indexthr` (`drawlineTime`),
  KEY `indexfor` (`finishTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程信息';
DROP TABLE IF EXISTS `constructionschedule`;
CREATE TABLE `constructionschedule` (
  `csid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单ID',
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开工时间',
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '完工时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '工程进度状态',
  `schedule` tinyint(1) NOT NULL COMMENT '工程进度',
  `checkout` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`csid`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`cid`)
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
  `cuid` int(11) NOT NULL,
  `createrId` varchar(15) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服保修表';

DROP TABLE IF EXISTS `drawline`;
CREATE TABLE `drawline` (
  `dlId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `applayTime` timestamp NULL DEFAULT NULL,
  `actualTime` int(8) DEFAULT '0',
  `startTime` timestamp NULL DEFAULT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL COMMENT '状态, 1:放线成功 , 2:放线失败',
  `count` int(11) DEFAULT '1',
  `auid` int(11) DEFAULT NULL COMMENT '操作人ID',
  `dluid` int(11) DEFAULT NULL COMMENT '放线人ID',
  `dgid` int(11) DEFAULT NULL,
  `content` varchar(128) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dlId`),
  KEY `indexone` (`orderId`),
  KEY `indexthr` (`status`,`startTime`,`endTime`),
  KEY `indextwo` (`applayTime`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='放线表';

DROP TABLE IF EXISTS `inspectiondeduction`;
CREATE TABLE `inspectiondeduction` (
  `idid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `ouid` int(11) NOT NULL COMMENT '操作人ID',
  `chargebacks` decimal(10,3) NOT NULL,
  `deductionTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(256) NOT NULL,
  PRIMARY KEY (`idid`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='巡检扣款表';

DROP TABLE IF EXISTS `inspectionrecord`;
CREATE TABLE `inspectionrecord` (
  `irid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `ouid` int(11) NOT NULL COMMENT '操作人ID',
  `startTime` timestamp NULL DEFAULT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  `comment` varchar(256) NOT NULL,
  PRIMARY KEY (`irid`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='巡检记录表';

DROP TABLE IF EXISTS `qualitytestingrecord`;
CREATE TABLE `qualitytestingrecord` (
  `qtrid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `ouid` int(11) NOT NULL COMMENT '操作人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `comment` varchar(256) NOT NULL,
  PRIMARY KEY (`qtrid`),
  KEY `indexone` (`ouid`,`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='质检记录表';

DROP TABLE IF EXISTS `rework`;
CREATE TABLE `rework` (
  `rwId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` date NOT NULL,
  `comment` varchar(256) NOT NULL,
  PRIMARY KEY (`rwId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='返工表';

DROP TABLE IF EXISTS `reworkdrawing`;
CREATE TABLE `reworkdrawing` (
  `rwdid` int(11) NOT NULL AUTO_INCREMENT,
  `rwId` int(11) NOT NULL,
  `rwdName` varchar(15) NOT NULL,
  `rwdUrl` varchar(256) NOT NULL,
  `rwdAddUrl` varchar(256) NOT NULL,
  `ouid` int(11) NOT NULL COMMENT '操作人ID',
  `operateTime` timestamp,
  PRIMARY KEY (`rwdid`),
  KEY `indexone` (`rwid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='返工图片表';
