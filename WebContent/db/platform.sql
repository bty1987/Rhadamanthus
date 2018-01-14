CREATE DATABASE  IF NOT EXISTS `platform`;
USE `platform`;

DROP TABLE IF EXISTS `audit`;
CREATE TABLE `audit` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `auid` int(11) COMMENT '审核人ID',
  `auditTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审核表';

DROP TABLE IF EXISTS `auditrecord`;
CREATE TABLE `auditrecord` (
  `arid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `unitprice` decimal(10,3) NOT NULL COMMENT '单价',
  `num` decimal(10,3) NOT NULL COMMENT '数量',
  `discount` decimal(5,2) NOT NULL COMMENT '折扣',
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(255) NOT NULL COMMENT '说明',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`arid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审核记录表';

DROP TABLE IF EXISTS `auditscale`;
CREATE TABLE `auditscale` (
  `asid` int(11) NOT NULL AUTO_INCREMENT,
  `arid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL,
  `buid` int(11) NOT NULL COMMENT '归属人ID',
  `bdid` int(11) NOT NULL COMMENT '归属人部门',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `money` decimal(10,3) NOT NULL COMMENT '金额',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`asid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审核比例表';

DROP TABLE IF EXISTS `backvisit`;
CREATE TABLE `backvisit` (
  `bvid` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `senderId` varchar(15) NOT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `content` varchar(128) NOT NULL,
  `receiverIds` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`bvid`),
  KEY `indexone` (`orderId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='设计师回访记录表';

DROP TABLE IF EXISTS `chainpage`;
CREATE TABLE `platform`.`chainpage` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `url` varchar(512) NOT NULL,
  `comment` varchar(256) NOT NULL,
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外链';

DROP TABLE IF EXISTS `decorationactivity`;
CREATE TABLE `decorationactivity` (
  `daId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `aId` int(11) NOT NULL,
  PRIMARY KEY (`daId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单活动表';

DROP TABLE IF EXISTS `decorationactivityitem`;
CREATE TABLE `decorationactivityitem` (
  `daiId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  `activityItemName` varchar(32) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `state` tinyint(4) NOT NULL,
  `total` int(11) NOT NULL,
  `num` int(11) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT '0.000',
  `content` varchar(32) NOT NULL DEFAULT '',
  `receiveUserId` varchar(15) NOT NULL DEFAULT '',
  `receiveUserName` varchar(15) NOT NULL DEFAULT '',
  `receiveTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`daiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单活动物品表';

DROP TABLE IF EXISTS `decorationcontract`;
CREATE TABLE `decorationcontract` (
  `autoId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `additionalInfo` varchar(2048) DEFAULT NULL COMMENT '附加条款信息',
  `templateHtml` varchar(100) DEFAULT NULL COMMENT '合同模板路径',
  `signTime` timestamp NULL DEFAULT NULL COMMENT '签订时间',
  `workingDuration` int(11) DEFAULT NULL COMMENT '工期',
  `startTime` timestamp NULL DEFAULT NULL COMMENT '开工时间',
  `endTime` timestamp NULL DEFAULT NULL COMMENT '竣工时间',
  `contractCode` varchar(45) DEFAULT NULL COMMENT '合同编号',
  `orderTotalPrice` decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (`autoId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修合同表';

DROP TABLE IF EXISTS `decorationdesignerdepartmentrank`;
CREATE TABLE `decorationdesignerdepartmentrank` (
  `dddrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dddrId`),
  KEY `indexone` (`designerDeptId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程设计部门业绩排名';

DROP TABLE IF EXISTS `decorationdesignerrank`;
CREATE TABLE `decorationdesignerrank` (
  `ddrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerId` varchar(15) NOT NULL,
  `designerName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ddrId`),
  KEY `indexone` (`designerId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程设计师业绩排名';

DROP TABLE IF EXISTS `decorationdesignerregionrank`;
CREATE TABLE `decorationdesignerregionrank` (
  `ddrrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ddrrId`),
  KEY `indexone` (`designerRegionId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程设计分区业绩排名';

DROP TABLE IF EXISTS `decorationholonomy`;
CREATE TABLE `decorationholonomy` (
  `dhid` int(11) NOT NULL AUTO_INCREMENT COMMENT '半价ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `name` varchar(32) DEFAULT NULL COMMENT '名称',
  `maching` decimal(10,3) NOT NULL COMMENT '主材配比',
  `discount` decimal(10,3) NOT NULL COMMENT '订单折扣',
  `projectPrice` decimal(10,3) NOT NULL COMMENT '工程总额',
  `managePrice` decimal(10,3) NOT NULL COMMENT '管理费',
  `manageRate` decimal(10,3) NOT NULL COMMENT '管理费比例',
  `materialPrice` decimal(10,3) NOT NULL COMMENT '主材总额',
  `servicePrice` decimal(10,3) NOT NULL COMMENT '服务费',
  `serviceRate` decimal(10,3) NOT NULL COMMENT '服务费比例',
  `materialPaidup` decimal(10,3) DEFAULT '0.000' COMMENT '实收主材额',
  `servicePaidup` decimal(10,3) DEFAULT '0.000' COMMENT '实收服务费',
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`dhid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单半价信息';

DROP TABLE IF EXISTS `decorationinclusive`;
CREATE TABLE `decorationinclusive` (
  `diid` int(11) NOT NULL AUTO_INCREMENT COMMENT '半价ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `contractPrice` decimal(10,3) NOT NULL COMMENT '合同额',
  `projectPrice` decimal(10,3) NOT NULL COMMENT '工程总额',
  `cdiff` decimal(10,3) DEFAULT '0.000' COMMENT '工程增项',
  `mdiff` decimal(10,3) DEFAULT '0.000' COMMENT '主材增项',
  `managePrice` decimal(10,3) NOT NULL COMMENT '管理费',
  `manageRate` decimal(10,3) NOT NULL COMMENT '管理费比例',
  `materialPaidup` decimal(10,3) DEFAULT '0.000' COMMENT '实收主材额',
  PRIMARY KEY (`diid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单套餐信息';

DROP TABLE IF EXISTS `decorationoperate`;
CREATE TABLE `decorationoperate` (
  `doId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `sourcerId` varchar(15) DEFAULT NULL,
  `targerId` varchar(15) DEFAULT NULL,
  `operaterId` varchar(15) DEFAULT NULL,
  `operateTime` timestamp NULL DEFAULT NULL,
  `value` float NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `des` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`doId`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`operateTime`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单操作';

DROP TABLE IF EXISTS `decorationorder`;
CREATE TABLE `decorationorder` (
  `autoId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL DEFAULT '',
  `customerId` bigint(20) NOT NULL COMMENT '客户编号',
  `villageId` varchar(10) NOT NULL COMMENT '楼盘编号',
  `houseNumber` varchar(30) NOT NULL COMMENT '门牌号',
  `houseType` varchar(15) NOT NULL DEFAULT ' 现房' COMMENT '期房 , 现房 . ',
  `houseClass` varchar(10) DEFAULT NULL COMMENT '清水 , 二手 , 别墅 , 阁楼 , 地下 . ',
  `apartmentType` varchar(45) DEFAULT NULL COMMENT '举例：一室一厅,两室一厅,三室两厅,三室一厅,阁楼,别墅',
  `houseArea` decimal(10,2) DEFAULT '0.00' COMMENT '建筑面积',
  `freeArea` decimal(10,2) DEFAULT '0.00' COMMENT '赠送面积',
  `designerId` varchar(15) DEFAULT NULL COMMENT '设计师编号',
  `salesmanId` varchar(15) DEFAULT NULL COMMENT '业务员编号',
  `supervisorId` varchar(15) DEFAULT NULL COMMENT '监理编号',
  `inspectionId` varchar(15) DEFAULT NULL COMMENT '巡检编号',
  `notSalesmanName` varchar(10) DEFAULT NULL COMMENT '非业务信息',
  `notSalesmanPhone` varchar(15) DEFAULT NULL,
  `notSalesmanContent` varchar(100) DEFAULT NULL,
  `backOrderName` varchar(20) DEFAULT NULL COMMENT '返单信息',
  `backOrderPhone` varchar(45) DEFAULT NULL,
  `backOrderContent` varchar(128) DEFAULT NULL,
  `contractCode` varchar(25) DEFAULT NULL COMMENT '合同号',
  `contractUserId` varchar(15) DEFAULT NULL COMMENT '签约操作人',
  `contractTime` timestamp NULL DEFAULT NULL COMMENT '签订合同时间',
  `depositTime` timestamp NULL DEFAULT NULL COMMENT '定金时间',
  `measureTime` timestamp NULL DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT NULL COMMENT '订单创建时间',
  `createUser` varchar(15) DEFAULT NULL COMMENT '订单创建人',
  `status` varchar(10) DEFAULT NULL COMMENT '咨询,量房,已报价,定金,已签约,废单,已完工,合同终止',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '半包 , 全包',
  `projectStatus` varchar(10) DEFAULT NULL COMMENT '等待施工,放线申请,放线失败,放线成功,水电申请,水电,水电验收,瓦工申请,瓦工,瓦工验收,木工申请,木工,木工验收,油工申请,油工,油工验收,保洁申请,保洁,保洁验收,',
  `paymentStatus` varchar(10) DEFAULT NULL COMMENT '预付款,设计费,定金,首付款,首付二期款,二期款,尾款',
  `versionId` varchar(11) NOT NULL COMMENT '订单使用报价版本号',
  `orderTotalPrice` decimal(10,3) DEFAULT '0.000' COMMENT '折后合同额',
  `notSalesmanRate` decimal(10,3) NOT NULL DEFAULT '0.000',
  `salesmanType` varchar(10) NOT NULL DEFAULT '守园',
  `otherStatus` tinyint(4) DEFAULT '0' COMMENT '1合尺, 2设计费',
  `company` tinyint(4) NOT NULL COMMENT '订单所属公司',
  `quotationTimeLimit` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`autoId`),
  UNIQUE KEY `uniqueone` (`orderId`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`houseNumber`),
  KEY `indexthr` (`houseArea`),
  KEY `indexfou` (`customerId`),
  KEY `indexfiv` (`villageId`),
  KEY `indexsix` (`designerId`),
  KEY `indexsev` (`salesmanId`),
  KEY `indexeig` (`status`),
  KEY `indexnig` (`company`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单表';

DROP TABLE IF EXISTS `decorationorderdesigndepartmentright`;
CREATE TABLE `decorationorderdesigndepartmentright` (
  `doddrId` int(20) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `dId` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`doddrId`),
  KEY `indexone` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单设计部权限';

DROP TABLE IF EXISTS `decorationorderdrawline`;
CREATE TABLE `decorationorderdrawline` (
  `autoId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `applayTime` timestamp NULL DEFAULT NULL,
  `applayDes` varchar(100) DEFAULT NULL,
  `actualStartTime` timestamp NULL DEFAULT NULL,
  `actualEndTime` timestamp NULL DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL COMMENT '排队,申请放线,分配工人,放线失败,放线成功',
  `applayCount` int(11) DEFAULT '1',
  `applayUserId` varchar(15) DEFAULT NULL,
  `drawLineGroup` varchar(45) DEFAULT NULL,
  `drawLineUserId` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`autoId`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`drawLineGroup`,`status`,`applayTime`),
  KEY `indexthr` (`status`,`actualStartTime`,`actualEndTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单放线表';

DROP TABLE IF EXISTS `decorationordersalesmandepartmentright`;
CREATE TABLE `decorationordersalesmandepartmentright` (
  `dosdrId` int(20) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `dId` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dosdrId`),
  KEY `indexone` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单业务部权限';

DROP TABLE IF EXISTS `decorationorderstatusright`;
CREATE TABLE `decorationorderstatusright` (
  `dosrId` int(20) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `status` varchar(10) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dosrId`),
  KEY `indexone` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单状态权限';

DROP TABLE IF EXISTS `decorationpicture`;
CREATE TABLE `decorationpicture` (
  `dpId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(32) NOT NULL,
  `path` varchar(256) NOT NULL,
  `uploadTime` timestamp NULL DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `userId` varchar(15) NOT NULL,
  `type` int(11) NOT NULL COMMENT '1 设计效果图 2,工程制图CAD',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`dpId`),
  KEY `indexone` (`orderId`,`uploadTime`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='设计图纸';

DROP TABLE IF EXISTS `drawlinegroup`;
CREATE TABLE `drawlinegroup` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `content` varchar(128),
  `company` int(11) NOT NULL,
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='放线小组表';

DROP TABLE IF EXISTS `materialbrand`;
CREATE TABLE `materialbrand` (
  `mbId` int(11) NOT NULL AUTO_INCREMENT,
  `materialBrandId` varchar(10) NOT NULL,
  `materialBrandName` varchar(30) NOT NULL,
  `materialBrandNamePinyin` varchar(216) NOT NULL,
  `materialTypeId` int(11) NOT NULL,
  PRIMARY KEY (`mbId`),
  KEY `indexone` (`materialTypeId`),
  KEY `indextwo` (`materialBrandName`,`materialBrandNamePinyin`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌表';

DROP TABLE IF EXISTS `materialbrandcount`;
CREATE TABLE `materialbrandcount` (
  `mbcId` int(11) NOT NULL AUTO_INCREMENT,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`mbcId`),
  KEY `indexone` (`materialBrand`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材品牌业绩统计';

DROP TABLE IF EXISTS `materialbrandright`;
CREATE TABLE `materialbrandright` (
  `mbrId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `brandId` varchar(128) NOT NULL,
  PRIMARY KEY (`mbrId`),
  KEY `indexone` (`userId`,`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌权限表';

DROP TABLE IF EXISTS `materialdepartmentcount`;
CREATE TABLE `materialdepartmentcount` (
  `mdcId` int(11) NOT NULL AUTO_INCREMENT,
  `materialDeptId` varchar(10) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`mdcId`),
  UNIQUE KEY `uniqueone` (`materialDeptId`,`createTime`),
  KEY `indexone` (`materialDeptId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材部门业绩统计';

DROP TABLE IF EXISTS `materialdesignercount`;
CREATE TABLE `materialdesignercount` (
  `mdcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerId` varchar(15) NOT NULL,
  `designerName` varchar(32) NOT NULL,
  `designerDepartmentId` varchar(15) NOT NULL,
  `designerDepartmentName` varchar(32) NOT NULL,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`mdcId`),
  UNIQUE KEY `uniqueone` (`designerId`,`createTime`),
  KEY `indexone` (`designerId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材设计师业绩统计';

DROP TABLE IF EXISTS `materialdesignerdepartmentcount`;
CREATE TABLE `materialdesignerdepartmentcount` (
  `mddcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`mddcId`),
  UNIQUE KEY `uniqueone` (`designerDeptId`,`designerRegionId`,`createTime`),
  KEY `indexone` (`designerDeptId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材设计部门业绩统计';

DROP TABLE IF EXISTS `materialdesignerdepartmentrank`;
CREATE TABLE `materialdesignerdepartmentrank` (
  `mddrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mddrId`),
  KEY `indexone` (`designerDeptId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材设计部门排名';

DROP TABLE IF EXISTS `materialdesignerrank`;
CREATE TABLE `materialdesignerrank` (
  `mdrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerId` varchar(15) NOT NULL,
  `designerName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mdrId`),
  KEY `indexone` (`designerId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材设计师排名';

DROP TABLE IF EXISTS `materialdesignerregioncount`;
CREATE TABLE `materialdesignerregioncount` (
  `mdrcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`mdrcId`),
  UNIQUE KEY `uniqueone` (`designerRegionId`,`createTime`),
  KEY `indexone` (`designerRegionId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材设计分区业绩统计';

DROP TABLE IF EXISTS `materialdesignerregionrank`;
CREATE TABLE `materialdesignerregionrank` (
  `mdrrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mdrrId`),
  KEY `indexone` (`designerRegionId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材设计中心排名';

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
  `calcType` tinyint(4) NOT NULL DEFAULT '0',
  `point` decimal(10,3) NOT NULL,
  `base` decimal(10,3) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mmId`),
  KEY `indexone` (`materialModelName`),
  KEY `indextwo` (`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='型号表';

DROP TABLE IF EXISTS `materialtype`;
CREATE TABLE `materialtype` (
  `mtId` int(11) NOT NULL AUTO_INCREMENT,
  `materialTypeId` varchar(10) NOT NULL,
  `materialTypeName` varchar(32) NOT NULL,
  PRIMARY KEY (`mtId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品类表';

DROP TABLE IF EXISTS `materialtypecount`;
CREATE TABLE `materialtypecount` (
  `mtcId` int(11) NOT NULL AUTO_INCREMENT,
  `materialType` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`mtcId`),
  KEY `indexone` (`materialType`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材品类业绩统计';

DROP TABLE IF EXISTS `measurementunit`;
CREATE TABLE `measurementunit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `unitDes` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计量单位表';

DROP TABLE IF EXISTS `orderbelonginfo`;
CREATE TABLE `orderbelonginfo` (
  `autoId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL COMMENT '订单编号',
  `belongType` varchar(10) NOT NULL DEFAULT '设计' COMMENT '设计,业务',
  `belongUserId` varchar(15) NOT NULL COMMENT '归属人',
  `belongDeptId` varchar(10) NOT NULL COMMENT '归属部门',
  `belongRegionId` varchar(10) DEFAULT NULL COMMENT '归属中心',
  `belongRate` decimal(10,3) NOT NULL DEFAULT '1.000' COMMENT '归属比例',
  `operateUserId` varchar(15) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NULL DEFAULT NULL COMMENT '最后编辑时间',
  `status` varchar(10) DEFAULT '申请审批' COMMENT '申请审批，审批通过,审批未通过,替换',
  `changeReason` varchar(100) DEFAULT NULL,
  `approvalUserId` varchar(15) DEFAULT NULL,
  `approvalTime` timestamp NULL DEFAULT NULL,
  `defaultFlag` varchar(5) NOT NULL DEFAULT '否' COMMENT '是 否',
  PRIMARY KEY (`autoId`),
  KEY `indexone` (`orderId`,`belongType`,`belongUserId`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单归属信息';

DROP TABLE IF EXISTS `paymentscale`;
CREATE TABLE `platform`.`paymentscale` (
  `psid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `comment` varchar(128),
  PRIMARY KEY (`psid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项比例';

DROP TABLE IF EXISTS `paymentscaleitem`;
CREATE TABLE `platform`.`paymentscaleitem` (
  `psiid` int(11) NOT NULL AUTO_INCREMENT,
  `psid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `scale` int(3) NOT NULL,
  PRIMARY KEY (`psiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项比例项';

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
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `des` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`qmiId`),
  KEY `indexone` (`qid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价主材项';

DROP TABLE IF EXISTS `rolechainpage`;
CREATE TABLE `rolechainpage` (
  `rcpid` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `cpid` int(11) NOT NULL,
  PRIMARY KEY (`rcpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色-外链';

DROP TABLE IF EXISTS `servicerecord`;
CREATE TABLE `servicerecord` (
  `srId` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) NOT NULL,
  `operateUserId` varchar(15) NOT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `info` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`srId`),
  KEY `indexone` (`operateUserId`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务记录';

DROP TABLE IF EXISTS `venderbalance`;
CREATE TABLE `venderbalance` (
  `vbId` int(11) NOT NULL AUTO_INCREMENT,
  `materialBrandId` int(11) NOT NULL,
  `materialBrandName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `balance` decimal(10,3) NOT NULL DEFAULT '0.000',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`vbId`),
  KEY `indexone` (`materialBrandId`,`status`),
  KEY `indextwo` (`materialBrandName`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='厂商结算';

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
  `postBalance` decimal(10,3) NOT NULL DEFAULT '0.000',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`vpbId`),
  KEY `indexone` (`vbId`,`status`),
  KEY `indextwo` (`msoId`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='厂商结算';

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
  `preBalance` decimal(10,3) NOT NULL DEFAULT '0.000',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`vpbId`),
  KEY `indexone` (`vbId`,`status`),
  KEY `indextwo` (`msoId`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='厂商预结算';

DROP TABLE IF EXISTS `zaterialdesignercount`;
CREATE TABLE `zaterialdesignercount` (
  `zdcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerId` varchar(15) NOT NULL,
  `designerName` varchar(32) NOT NULL,
  `designerDepartmentId` varchar(15) NOT NULL,
  `designerDepartmentName` varchar(32) NOT NULL,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`zdcId`),
  UNIQUE KEY `uniqueone` (`designerId`,`materialBrand`,`createTime`),
  KEY `indexone` (`designerId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='正林设计师业绩统计';

DROP TABLE IF EXISTS `zaterialdesignerdepartmentcount`;
CREATE TABLE `zaterialdesignerdepartmentcount` (
  `zddcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`zddcId`),
  UNIQUE KEY `uniqueone` (`designerDeptId`,`materialBrand`,`createTime`),
  KEY `indexone` (`designerDeptId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='正林设计部门业绩统计';

DROP TABLE IF EXISTS `zaterialdesignerdepartmentrank`;
CREATE TABLE `zaterialdesignerdepartmentrank` (
  `zddrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`zddrId`),
  KEY `indexone` (`designerDeptId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='正林设计部门排名';

DROP TABLE IF EXISTS `zaterialdesignerrank`;
CREATE TABLE `zaterialdesignerrank` (
  `zdrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerId` varchar(15) NOT NULL,
  `designerName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`zdrId`),
  KEY `indexone` (`designerId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='正林设计师排名';

DROP TABLE IF EXISTS `zaterialdesignerregioncount`;
CREATE TABLE `zaterialdesignerregioncount` (
  `zdrcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`zdrcId`),
  UNIQUE KEY `uniqueone` (`designerRegionId`,`materialBrand`,`createTime`),
  KEY `indexone` (`designerRegionId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='正林设计分区业绩统计';

DROP TABLE IF EXISTS `zaterialdesignerregionrank`;
CREATE TABLE `zaterialdesignerregionrank` (
  `zdrrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`zdrrId`),
  KEY `indexone` (`designerRegionId`,`status`,`createTime`,`endTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='正林设计中心排名';
