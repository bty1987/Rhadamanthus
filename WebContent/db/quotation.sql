CREATE DATABASE  IF NOT EXISTS `quotation`;
USE `quotation`;

DROP TABLE IF EXISTS `addreduce`;
CREATE TABLE `addreduce` (
  `arid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0 增项 1 减项 2 漏项',
  `managePrice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '管理费',
  `total` decimal(10,3) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0 未提交 1、已提交/未付款 2、已付款 3、已确认  ',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(256) NOT NULL,
  `dpId` int(11) DEFAULT NULL COMMENT '对应收款编号',
  PRIMARY KEY (`arid`),
  KEY `indexone` (`orderId`,`type`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='增减项表';

DROP TABLE IF EXISTS `addreduceitem`;
CREATE TABLE `addreduceitem` (
  `ariid` int(11) NOT NULL AUTO_INCREMENT,
  `arid` int(11) NOT NULL COMMENT '增减项编号',
  `itemName` varchar(128) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0报价项 , 1自定义报价项目',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1工程,2主材',
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `quotationFunctionAreaId` int(11) NOT NULL COMMENT '所属报价功能区编号',
  `quoteItemId` int(11) DEFAULT '0',
  `content` varchar(512) DEFAULT NULL,
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ariid`),
  KEY `indexone` (`arid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='增减项目';

DROP TABLE IF EXISTS `extension`;
CREATE TABLE `extension` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(256) NOT NULL,
  PRIMARY KEY (`eid`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='拓展项';

DROP TABLE IF EXISTS `extensionitem`;
CREATE TABLE `extensionitem` (
  `eiid` int(11) NOT NULL AUTO_INCREMENT,
  `eid` int(11) NOT NULL,
  `itemName` varchar(128) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0扩展项增项,1增项自定义,2扩展项减项,3减项自定义',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1工程,2主材',
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `num` decimal(10,3) NOT NULL,
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quoteItemId` int(11) NOT NULL,
  `content` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`eiid`),
  KEY `indexone` (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='拓展项目';

DROP TABLE IF EXISTS `functionarea`;
CREATE TABLE `functionarea` (
  `faid` int(11) NOT NULL AUTO_INCREMENT,
  `functionAreaId` varchar(10) NOT NULL,
  `functionAreaName` varchar(20) NOT NULL,
  `versionId` varchar(11) NOT NULL,
  `functionAreaOrder` int(11) NOT NULL,
  `functionAreaType` varchar(10) NOT NULL DEFAULT '普通' COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`faId`),
  KEY `indexone` (`functionAreaId`,`versionId`,`functionAreaType`,`functionAreaOrder`),
  KEY `indextwo` (`versionId`) 
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='功能区表';

DROP TABLE IF EXISTS `functionareaquoteitem`;
CREATE TABLE `functionareaquoteitem` (
  `faiid` int(11) NOT NULL AUTO_INCREMENT,
  `functionAreaId` int(11) NOT NULL,
  `quoteItemId` int(11) NOT NULL,
  PRIMARY KEY (`faiid`),
  KEY `indexone` (`functionAreaId`,`quoteItemId`),
  KEY `indextwo` (`quoteItemId`,`functionAreaId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='功能区报价项关联表';

DROP TABLE IF EXISTS `quotation`;
CREATE TABLE `quotation` (
  `qid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `quotationName` varchar(64) NOT NULL,
  `decorationStyle` varchar(10) DEFAULT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `undisPrice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折前总价',
  `disPrice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折前折扣总价',
  `discount` decimal(10,3) NOT NULL DEFAULT '10.000',
  `totalPrice` decimal(10,3) DEFAULT NULL,
  `defaults` tinyint(1) NOT NULL DEFAULT '0' COMMENT '默认, 0 非默认 ,1 默认',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0 启用, 1 禁用',
  `managePrice` decimal(10,3) DEFAULT '0.000',
  `manageRate` decimal(10,3) DEFAULT '0.000',
  `trafficPrice` decimal(10,3) DEFAULT '0.000',
  `trafficRate` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '车运费比例',
  PRIMARY KEY (`qid`),
  KEY `indexone` (`orderId`,`createTime`,`defaults`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价表';

DROP TABLE IF EXISTS `quotationfunctionarea`;
CREATE TABLE `quotationfunctionarea` (
  `qfaId` int(11) NOT NULL AUTO_INCREMENT,
  `quotationId` int(11) NOT NULL,
  `functionAreaName` varchar(10) NOT NULL,
  `functionAreaOrder` int(11) DEFAULT NULL,
  `functionAreaType` varchar(10) DEFAULT NULL COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`qfaId`),
  KEY `indexone` (`quotationId`,`functionAreaOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价功能区';

DROP TABLE IF EXISTS `quotationfunctionareaitem0`;
CREATE TABLE `quotationfunctionareaitem0` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原数',
  `num` decimal(10,3) NOT NULL,
  `discount` tinyint(1) NOT NULL DEFAULT '1',
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quotationItemId` int(11) DEFAULT NULL,
  `content` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`),
  KEY `indextwo` (`quotationItemId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem1`;
CREATE TABLE `quotationfunctionareaitem1` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原数',
  `num` decimal(10,3) NOT NULL,
  `discount` tinyint(1) NOT NULL DEFAULT '1',
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quotationItemId` int(11) DEFAULT NULL,
  `content` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`),
  KEY `indextwo` (`quotationItemId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem2`;
CREATE TABLE `quotationfunctionareaitem2` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原数',
  `num` decimal(10,3) NOT NULL,
  `discount` tinyint(1) NOT NULL DEFAULT '1',
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quotationItemId` int(11) DEFAULT NULL,
  `content` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`),
  KEY `indextwo` (`quotationItemId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem3`;
CREATE TABLE `quotationfunctionareaitem3` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原数',
  `num` decimal(10,3) NOT NULL,
  `discount` tinyint(1) NOT NULL DEFAULT '1',
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quotationItemId` int(11) DEFAULT NULL,
  `content` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`),
  KEY `indextwo` (`quotationItemId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem4`;
CREATE TABLE `quotationfunctionareaitem4` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原数',
  `num` decimal(10,3) NOT NULL,
  `discount` tinyint(1) NOT NULL DEFAULT '1',
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quotationItemId` int(11) DEFAULT NULL,
  `content` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`),
  KEY `indextwo` (`quotationItemId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationitem`;
CREATE TABLE `quotationitem` (
  `qiId` bigint(20) NOT NULL AUTO_INCREMENT,
  `itemId` varchar(10) NOT NULL,
  `versionId` varchar(11) NOT NULL,
  `quotationTypeId` int(11) NOT NULL,
  `quotationClassificationId` int(11) NOT NULL,
  `quotationBigCategoryId` int(11) NOT NULL,
  `quotationSmallCategoryId` int(11) NOT NULL,
  `itemName` varchar(128) NOT NULL,
  `measurementUnitId` int(11) NOT NULL,
  `itemWorkTypeId` int(11) NOT NULL,
  `quotationItemDes` varchar(512) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`qiId`),
  KEY `indexone` (`itemId`,`versionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项目表';
DROP TABLE IF EXISTS `quotationlaborcost`;
CREATE TABLE `quotationlaborcost` (
  `qlcid` int(11) NOT NULL AUTO_INCREMENT,
  `qiid` int(11) NOT NULL,
  `laborCost` decimal(10,3) NOT NULL,
  `worktype` varchar(8) DEFAULT '',
  `comment` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`qlcid`),
  KEY `indexone` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价人工成本';
DROP TABLE IF EXISTS `quotationstuffcost`;
CREATE TABLE `quotationstuffcost` (
  `qscid` int(11) NOT NULL AUTO_INCREMENT,
  `qiid` int(11) NOT NULL,
  `no` varchar(16) NOT NULL,
  `name` varchar(32) NOT NULL,
  `unitPrice` decimal(10,4) NOT NULL,
  `num` float NOT NULL DEFAULT '0',
  `stuffCost` decimal(10,4) NOT NULL,
  `comment` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`qscid`),
  KEY `indexone` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价材料成本';

DROP TABLE IF EXISTS `quotationversion`;
CREATE TABLE `quotationversion` (
  `qvId` int(11) NOT NULL AUTO_INCREMENT,
  `versionId` varchar(11) NOT NULL,
  `versionName` varchar(32) NOT NULL,
  `defaultFlag` int(11) NOT NULL DEFAULT '0',
  `versionDes` varchar(100) DEFAULT NULL,
  `trafficRate` float NOT NULL,
  `trafficDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `manageRate` float NOT NULL,
  `manageDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`qvId`),
  UNIQUE KEY `uniqueone` (`versionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价版本表';

DROP TABLE IF EXISTS `systemdefineitem`;
CREATE TABLE `systemdefineitem` (
  `sdiid` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` varchar(10) NOT NULL,
  `quotationBigCategoryId` int(11) NOT NULL,
  `itemName` varchar(128) NOT NULL,
  `measurementUnitId` int(11) NOT NULL,
  `itemWorkTypeId` int(11) NOT NULL,
  `quotationItemDes` varchar(512) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL DEFAULT '0',
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`sdiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='系统定义报项目表';
