CREATE DATABASE  IF NOT EXISTS `quotetion`;
USE `quotetion`;

DROP TABLE IF EXISTS `quotetion`;
CREATE TABLE `quotetion` (
  `qid` int(11) NOT NULL AUTO_INCREMENT COMMENT '报价ID',
  `no` varchar(15) NOT NULL COMMENT '编号唯一',
  `name` varchar(32) NOT NULL COMMENT '报价名称',
  `version` varchar(10) NOT NULL COMMENT '报价版本编号',
  `cuid` int(11) DEFAULT NULL COMMENT '创建人',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `basePrice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '基数 , 满减类型计算参数',
  `undisPrice` decimal(10,3) DEFAULT '0.000' COMMENT '不打折项总额',
  `disPrice` decimal(10,3) DEFAULT '0.000' COMMENT '打折项总额',
  `discount` decimal(10,3) DEFAULT '10.000' COMMENT '折扣',
  `totalPrice` decimal(10,3) DEFAULT '0.000' COMMENT '报价总额',
  `content` varchar(64) DEFAULT NULL COMMENT '说明',
  `managePrice` decimal(10,3) DEFAULT '0.000' COMMENT '管理费',
  `manageRate` decimal(10,3) DEFAULT '0.000' COMMENT '管理费比例',
  `trafficPrice` decimal(10,3) DEFAULT '0.000' COMMENT '车运费',
  `trafficRate` decimal(10,3) DEFAULT '0.000' COMMENT '车运费比例',
  PRIMARY KEY (`qid`),
  KEY `indexone` (`cuid`),
  KEY `indextwo` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价表';

DROP TABLE IF EXISTS `quotetionfunctionarea`;
CREATE TABLE `quotetionfunctionarea` (
  `qfaid` int(11) NOT NULL AUTO_INCREMENT,
  `qid` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `index` int(11) DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL COMMENT '0管理 1工程量 2功能区总额 3不计算',
  PRIMARY KEY (`qfaid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区';

DROP TABLE IF EXISTS `quotetionfunctionareaitem0`;
CREATE TABLE `quotetionfunctionareaitem0` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` decimal(10,3) NOT NULL COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表0';

DROP TABLE IF EXISTS `quotetionfunctionareaitem1`;
CREATE TABLE `quotetionfunctionareaitem1` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` decimal(10,3) NOT NULL COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表1';

DROP TABLE IF EXISTS `quotetionfunctionareaitem2`;
CREATE TABLE `quotetionfunctionareaitem2` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` decimal(10,3) NOT NULL COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表2';

DROP TABLE IF EXISTS `quotetionfunctionareaitem3`;
CREATE TABLE `quotetionfunctionareaitem3` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` decimal(10,3) NOT NULL COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表3';

DROP TABLE IF EXISTS `quotetionfunctionareaitem4`;
CREATE TABLE `quotetionfunctionareaitem4` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` decimal(10,3) NOT NULL COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表4';

CREATE DATABASE  IF NOT EXISTS `quotation`;
USE `quotation`;

DROP TABLE IF EXISTS `addreduce`;
CREATE TABLE `addreduce` (
  `arid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0 增项 1 减项 2 漏项',
  `manageRate` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '管理费比例',
  `managePrice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '管理费',
  `total` decimal(10,3) NOT NULL,
  `undisPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `disPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `uncalPrice` varchar(45) NOT NULL DEFAULT '0.000',
  `calPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
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
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  `addPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `unitPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `subPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `quotationFunctionAreaId` int(11) NOT NULL COMMENT '所属报价功能区编号',
  `quoteItemId` int(11) DEFAULT '0',
  `content` varchar(512) DEFAULT NULL,
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
  `addPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `unitPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `subPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `num` decimal(10,3) NOT NULL,
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quoteItemId` int(11) NOT NULL,
  `content` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`eiid`),
  KEY `indexone` (`eid`),
  KEY `indextwo` (`quotationFunctionAreaId`)
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
  `basePrice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '基数 , 满减类型计算参数',
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
  `addPrice` decimal(10,3) DEFAULT '0.000',
  `unitPrice` decimal(10,3) NOT NULL,
  `subPrice` decimal(10,3) DEFAULT '0.000',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`qiId`),
  KEY `indexone` (`itemId`,`versionId`),
  KEY `indextwo` (`versionId`)
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
  `no` varchar(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `defaultFlag` int(11) NOT NULL DEFAULT '0',
  `comment` varchar(64) DEFAULT '',
  `trafficRate` float NOT NULL,
  `trafficDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `manageRate` float NOT NULL,
  `manageDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`qvId`),
  UNIQUE KEY `uniqueone` (`no`)
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
  `addPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `unitPrice` decimal(10,3) NOT NULL,
  `subPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL DEFAULT '0',
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`sdiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='系统定义报项目表';
