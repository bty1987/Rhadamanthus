CREATE DATABASE IF NOT EXISTS `platform`;
USE `platform`;

-- Generated at 2026-01-06 08:11:03
-- Total tables: 37

DROP TABLE IF EXISTS `actionlog`;
CREATE TABLE `actionlog` (
  `alId` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(32) NULL COMMENT '主键',
  `actionName` varchar(128) NOT NULL,
  `createUserId` varchar(15) NULL COMMENT '操作人',
  `createTime` timestamp NULL COMMENT '创建时间',
  `runTime` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`alId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='操作日志表';

DROP TABLE IF EXISTS `approvalfunctionright`;
CREATE TABLE `approvalfunctionright` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL COMMENT '名称',
  `cfid` int(11) NOT NULL,
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1823 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='审批-功能权限';

DROP TABLE IF EXISTS `chainpage`;
CREATE TABLE `chainpage` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `url` varchar(512) NOT NULL,
  `comment` varchar(256) NOT NULL,
  `companymark` tinyint(1) NOT NULL,
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `customeroriginfunctionright`;
CREATE TABLE `customeroriginfunctionright` (
  `cfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `cfid` int(11) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=6785 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客源-功能权限';

DROP TABLE IF EXISTS `customersourceright`;
CREATE TABLE `customersourceright` (
  `csdrid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  `company` int(5) NOT NULL,
  PRIMARY KEY (`csdrid`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `decorationdesigndepartmentright`;
CREATE TABLE `decorationdesigndepartmentright` (
  `doddrId` int(20) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `dId` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`doddrId`),
  KEY `indexone` (`uId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2369 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单设计部权限';

DROP TABLE IF EXISTS `decorationfunctionright`;
CREATE TABLE `decorationfunctionright` (
  `dfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `dfid` int(11) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=118187 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `decorationorderdrawline`;
CREATE TABLE `decorationorderdrawline` (
  `autoId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `applayTime` timestamp NULL,
  `applayDes` varchar(100) NULL,
  `actualStartTime` timestamp NULL,
  `actualEndTime` timestamp NULL,
  `status` varchar(45) NULL COMMENT '排队、申请放线、分配工人、放线失败、放线成功',
  `applayCount` int(11) NULL DEFAULT 1,
  `applayUserId` varchar(15) NULL,
  `drawLineGroup` varchar(45) NULL,
  `drawLineUserId` varchar(15) NULL,
  PRIMARY KEY (`autoId`),
  KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexthr` (`status`, `actualStartTime`, `actualEndTime`) USING BTREE,
  KEY `indextwo` (`drawLineGroup`, `status`, `applayTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单放线表';

DROP TABLE IF EXISTS `decorationorderoperatehistory`;
CREATE TABLE `decorationorderoperatehistory` (
  `doophId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `operateTime` varchar(20) NULL,
  `des` varchar(256) NULL DEFAULT '',
  PRIMARY KEY (`doophId`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修订单操作信息历史记录';

DROP TABLE IF EXISTS `decorationsalesmandepartmentright`;
CREATE TABLE `decorationsalesmandepartmentright` (
  `dosdrId` int(20) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `dId` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dosdrId`),
  KEY `indexone` (`uId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=841 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单业务部权限';

DROP TABLE IF EXISTS `decorationstatusright`;
CREATE TABLE `decorationstatusright` (
  `dosrId` int(20) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `status` tinyint(2) NULL DEFAULT 0 COMMENT '-1全部,0初始,1定金,2已签约,3重签合同,4废单,5合
同终止,6就算,7已完工',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dosrId`),
  KEY `indexone` (`uId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1181 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单状态权限';

DROP TABLE IF EXISTS `drawlinegroup`;
CREATE TABLE `drawlinegroup` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `content` varchar(128) NULL,
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='放线小组表';

DROP TABLE IF EXISTS `housesourcedepartmentright`;
CREATE TABLE `housesourcedepartmentright` (
  `hsdrid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`hsdrid`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `kingdeerecord`;
CREATE TABLE `kingdeerecord` (
  `krid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `rtid` int(11) NOT NULL,
  `type` varchar(64) NULL,
  `atttype` tinyint(1) NULL DEFAULT 0,
  `message` varchar(512) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`krid`)
) ENGINE=InnoDB AUTO_INCREMENT=3665 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='金蝶记录';

DROP TABLE IF EXISTS `materialbrand`;
CREATE TABLE `materialbrand` (
  `mbId` int(11) NOT NULL AUTO_INCREMENT,
  `materialBrandId` varchar(10) NOT NULL,
  `materialBrandName` varchar(30) NOT NULL,
  `materialBrandNamePinyin` varchar(216) NOT NULL,
  `materialTypeId` int(11) NOT NULL,
  PRIMARY KEY (`mbId`),
  KEY `indexone` (`materialTypeId`) USING BTREE,
  KEY `indextwo` (`materialBrandName`, `materialBrandNamePinyin`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌表';

DROP TABLE IF EXISTS `materialbrandcount`;
CREATE TABLE `materialbrandcount` (
  `mbcId` int(11) NOT NULL AUTO_INCREMENT,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`mbcId`),
  KEY `indexone` (`materialBrand`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材品牌业绩统计';

DROP TABLE IF EXISTS `materialbrandright`;
CREATE TABLE `materialbrandright` (
  `mbrId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `brandId` varchar(128) NOT NULL,
  PRIMARY KEY (`mbrId`),
  KEY `indexone` (`userId`, `brandId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌权限表';

DROP TABLE IF EXISTS `materialmodel`;
CREATE TABLE `materialmodel` (
  `mmId` int(11) NOT NULL AUTO_INCREMENT,
  `materialModelNo` varchar(64) NOT NULL,
  `materialModelName` varchar(64) NOT NULL,
  `brandId` int(11) NOT NULL,
  `materialTypeName` varchar(30) NOT NULL DEFAULT '',
  `materialBrandName` varchar(30) NOT NULL DEFAULT '',
  `measurementUnitId` int(11) NOT NULL,
  `measurementUnitName` varchar(10) NOT NULL DEFAULT '',
  `materialUnitPrice` decimal(10,3) NOT NULL,
  `materialPurchasePrice` decimal(10,3) NOT NULL,
  `discount` decimal(10,3) NOT NULL,
  `calcType` tinyint(4) NOT NULL DEFAULT 0,
  `point` decimal(10,3) NOT NULL,
  `base` decimal(10,3) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`mmId`),
  KEY `indexone` (`materialModelName`) USING BTREE,
  KEY `indextwo` (`brandId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=606 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='型号表';

DROP TABLE IF EXISTS `materialtype`;
CREATE TABLE `materialtype` (
  `mtId` int(11) NOT NULL AUTO_INCREMENT,
  `materialTypeId` varchar(10) NOT NULL,
  `materialTypeName` varchar(32) NOT NULL,
  PRIMARY KEY (`mtId`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品类表';

DROP TABLE IF EXISTS `materialtypecount`;
CREATE TABLE `materialtypecount` (
  `mtcId` int(11) NOT NULL AUTO_INCREMENT,
  `materialType` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`mtcId`),
  KEY `indexone` (`materialType`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材品类业绩统计';

DROP TABLE IF EXISTS `measurementunit`;
CREATE TABLE `measurementunit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `unitDes` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='计量单位表';

DROP TABLE IF EXISTS `paymentfunctionright`;
CREATE TABLE `paymentfunctionright` (
  `pfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `pfid` int(11) NULL,
  `type` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=9231 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='款项-功能权限';

DROP TABLE IF EXISTS `paymentscale`;
CREATE TABLE `paymentscale` (
  `psid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `comment` varchar(128) NULL,
  PRIMARY KEY (`psid`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='款项比例';

DROP TABLE IF EXISTS `paymentscaleitem`;
CREATE TABLE `paymentscaleitem` (
  `psiid` int(11) NOT NULL AUTO_INCREMENT,
  `psid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `scale` int(3) NOT NULL,
  PRIMARY KEY (`psiid`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=latin1_swedish_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `productionfunctionright`;
CREATE TABLE `productionfunctionright` (
  `pfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `pfid` int(11) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=3499 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `quotationfunctionright`;
CREATE TABLE `quotationfunctionright` (
  `qfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `qfid` int(11) NULL,
  `type` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`qfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=15100 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `rolechainpage`;
CREATE TABLE `rolechainpage` (
  `rcpid` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `cpid` int(11) NOT NULL,
  PRIMARY KEY (`rcpid`)
) ENGINE=InnoDB AUTO_INCREMENT=444 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesdeliverystatusright`;
CREATE TABLE `salesdeliverystatusright` (
  `sdsrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `bid` int(11) NULL,
  `crate` int(8) NULL DEFAULT 0,
  `status` tinyint(1) NULL,
  `checked` tinyint(1) NULL DEFAULT 0,
  `company` int(11) NULL,
  PRIMARY KEY (`sdsrid`)
) ENGINE=InnoDB AUTO_INCREMENT=689 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesfunctionright`;
CREATE TABLE `salesfunctionright` (
  `sfrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `sfid` int(11) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`sfrid`)
) ENGINE=InnoDB AUTO_INCREMENT=29946 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `selectionitemstatusright`;
CREATE TABLE `selectionitemstatusright` (
  `sdsrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `bid` int(11) NULL,
  `status` tinyint(1) NULL,
  `company` int(11) NULL,
  PRIMARY KEY (`sdsrid`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `servicerecord`;
CREATE TABLE `servicerecord` (
  `srId` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) NOT NULL,
  `orderId` varchar(15) NULL,
  `operateUserId` varchar(15) NOT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `info` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`srId`),
  KEY `indexone` (`operateUserId`, `type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3290 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='服务记录';

DROP TABLE IF EXISTS `taskuserright`;
CREATE TABLE `taskuserright` (
  `tuid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`tuid`)
) ENGINE=InnoDB AUTO_INCREMENT=3327 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `usercheck`;
CREATE TABLE `usercheck` (
  `ucId` bigint(32) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `checkTime` timestamp NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  PRIMARY KEY (`ucId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='用户考勤表';

DROP TABLE IF EXISTS `userfunctionright`;
CREATE TABLE `userfunctionright` (
  `ufrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `ufid` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ufrid`)
) ENGINE=InnoDB AUTO_INCREMENT=896 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='人员-功能权限';

DROP TABLE IF EXISTS `venderbalance`;
CREATE TABLE `venderbalance` (
  `vbId` int(11) NOT NULL AUTO_INCREMENT,
  `materialBrandId` int(11) NOT NULL,
  `materialBrandName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `balance` decimal(10,3) NOT NULL DEFAULT 0.000,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`vbId`),
  KEY `indexone` (`materialBrandId`, `status`) USING BTREE,
  KEY `indextwo` (`materialBrandName`, `status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商结算';

DROP TABLE IF EXISTS `venderpostbalance`;
CREATE TABLE `venderpostbalance` (
  `vpbId` int(11) NOT NULL AUTO_INCREMENT,
  `vbId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `msoId` int(11) NOT NULL,
  `msoNo` varchar(15) NOT NULL,
  `materialBrandId` int(11) NOT NULL,
  `materialBrandName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `postBalance` decimal(10,3) NOT NULL DEFAULT 0.000,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`vpbId`),
  KEY `indexone` (`vbId`, `status`) USING BTREE,
  KEY `indextwo` (`msoId`, `status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商结算';

DROP TABLE IF EXISTS `venderprebalance`;
CREATE TABLE `venderprebalance` (
  `vpbId` int(11) NOT NULL AUTO_INCREMENT,
  `vbId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `msoId` int(11) NOT NULL,
  `msoNo` varchar(15) NOT NULL,
  `materialBrandId` int(11) NOT NULL,
  `materialBrandName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `preBalance` decimal(10,3) NOT NULL DEFAULT 0.000,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`vpbId`),
  KEY `indexone` (`vbId`, `status`) USING BTREE,
  KEY `indextwo` (`msoId`, `status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商预结算';
