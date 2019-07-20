CREATE DATABASE  IF NOT EXISTS `decoration`;
USE `decoration`;

DROP TABLE IF EXISTS `audit`;
CREATE TABLE `audit` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `auid` int(11) DEFAULT NULL COMMENT '审核人ID',
  `auditTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
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
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `buid` int(11) NOT NULL COMMENT '归属人ID',
  `bdid` int(11) NOT NULL COMMENT '归属人部门',
  `money` decimal(10,3) NOT NULL COMMENT '金额',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`asid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审核比例表';

DROP TABLE IF EXISTS `backvisit`;
CREATE TABLE `backvisit` (
  `bvid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `suid` int(11) NOT NULL COMMENT '发送人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `content` varchar(128) NOT NULL,
  `receiverIds` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`bvid`),
  KEY `indexone` (`orderId`,`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='设计师回访记录表';

DROP TABLE IF EXISTS `decoration`;
CREATE TABLE `decoration` (
  `doid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL DEFAULT '',
  `customerId` int(11) NOT NULL COMMENT '客户编号',
  `villageId` varchar(10) DEFAULT NULL COMMENT '楼盘编号',
  `houseNumber` varchar(30) DEFAULT NULL COMMENT '门牌号',
  `hid` int(11) NOT NULL DEFAULT '0' COMMENT '房产ID',
  `grade` varchar(1) NOT NULL DEFAULT 'B' COMMENT '等级',
  `houseType` varchar(15) NOT NULL DEFAULT ' 现房' COMMENT '期房 , 现房 . ',
  `houseClass` varchar(10) DEFAULT NULL COMMENT '清水 , 二手 , 别墅 , 阁楼 , 地下 . ',
  `apartmentType` varchar(45) DEFAULT NULL COMMENT '举例:一室一厅,两室一厅,三室两厅,三室一厅,阁楼,别墅',
  `salesmanType` varchar(10) NOT NULL DEFAULT '守园',
  `resourceType` tinyint(1) DEFAULT '0' COMMENT '资源类型',
  `houseArea` decimal(10,2) DEFAULT '0.00' COMMENT '建筑面积',
  `cuid` int(11) DEFAULT NULL COMMENT '创建人ID',
  `dsuid` int(11) DEFAULT NULL COMMENT '设计师ID',
  `smuid` int(11) DEFAULT NULL COMMENT '业务员ID',
  `svuid` int(11) DEFAULT NULL COMMENT '监理ID',
  `quid` int(11) DEFAULT NULL COMMENT '报价员ID',
  `euid` int(11) DEFAULT NULL COMMENT '跟单员ID',
  `ctuid` int(11) DEFAULT NULL COMMENT '签约人ID',
  `notSalesmanRate` decimal(10,3) NOT NULL DEFAULT '0.000',
  `contractCode` varchar(25) DEFAULT NULL COMMENT '合同号',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `measureTime` timestamp NULL DEFAULT NULL COMMENT '量尺时间',
  `depositTime` timestamp NULL DEFAULT NULL COMMENT '定金时间',
  `precontractTime` timestamp NULL DEFAULT NULL COMMENT '预签时间',
  `contractTime` timestamp NULL DEFAULT NULL COMMENT '签约时间',
  `accountTime` timestamp NULL DEFAULT NULL COMMENT '决算时间',
  `status` tinyint(1) DEFAULT NULL COMMENT '0:初始 1:定金 2:签约 3:重签 4:废单 5:终止 6:决算 7:完工',
  `projectStatus` tinyint(1) DEFAULT NULL COMMENT '0:初始  1:开工  2:完工',
  `quotationStatus` tinyint(1) DEFAULT '0' COMMENT '报价状态',
  `otherStatus` tinyint(1) DEFAULT '0' COMMENT '1合尺, 2设计费',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '半包0, 全包1, 半价2, 满减3',
  `orderType` tinyint(1) DEFAULT '1' COMMENT '1 装修订单 2 主材订单',
  `versionId` varchar(11) NOT NULL COMMENT '订单使用报价版本号',
  `precontractPrice` decimal(10,3) DEFAULT '0.000' COMMENT '预签额',
  `orderTotalPrice` decimal(10,3) DEFAULT '0.000' COMMENT '折后合同额',
  `quotationPrice` decimal(10,3) DEFAULT '0.000',
   `factPrice` decimal(10,3) DEFAULT '0.000' COMMENT '实收额',
  `paySacle` tinyint(1) unsigned DEFAULT '0' COMMENT '付款比例',
  `discount` float DEFAULT '0',
  `couponCut` decimal(10,3) DEFAULT '0.000',
  `thingCut` decimal(10,3) DEFAULT '0.000',
  `netperfor` decimal(10,3) DEFAULT '0.000',
  `comperfor` decimal(10,3) DEFAULT '0.000',
  `company` int(11) NOT NULL COMMENT '所属公司',
  `quotationTimeLimit` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`doid`),
  KEY `indexone` (`orderId`),
  KEY `indexthr` (`houseArea`),
  KEY `indexfou` (`customerId`),
  KEY `indexsix` (`dsuid`),
  KEY `indexsev` (`smuid`),
  KEY `indexeig` (`status`),
  KEY `indexnig` (`company`),
  KEY `indextwo` (`hid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单';
DROP TABLE IF EXISTS `decorationaccount`;
CREATE TABLE `decorationaccount` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `type` tinyint(1) NOT NULL COMMENT '类型:0:半包,1:套餐,2:半价,3:满减,4:捡捡',
  `maching` decimal(10,3) NOT NULL COMMENT '主材配比',
  `discount` decimal(10,3) NOT NULL COMMENT '订单折扣',
  `projectBase` decimal(10,3) NOT NULL,
  `projectPrice` decimal(10,3) NOT NULL COMMENT '工程总额',
  `materialPrice` decimal(10,3) NOT NULL COMMENT '主材总额',
  `servicePrice` decimal(10,3) NOT NULL COMMENT '服务费',
  `serviceRate` decimal(10,3) NOT NULL COMMENT '服务费比例',
  PRIMARY KEY (`daid`),
  UNIQUE KEY `uniqueone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='决算表';

DROP TABLE IF EXISTS `decorationactivity`;
CREATE TABLE `decorationactivity` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `aid` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`daId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修活动表';

DROP TABLE IF EXISTS `decorationactivityitem`;
CREATE TABLE `decorationactivityitem` (
  `daiId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  `activityItemName` varchar(32) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `state` tinyint(4) NOT NULL,
  `num` int(11) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT '0.000',
  `content` varchar(32) NOT NULL DEFAULT '',
  `ruid` int(11) DEFAULT NULL COMMENT '接收人ID',
  `receiveUserName` varchar(15) NOT NULL DEFAULT '',
  `receiveTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `asid` int(11) NOT NULL,
  `stateType` tinyint(1) NOT NULL COMMENT '状态类型(0到店/1定金/2签单/3抽奖/4特批/5购买/6其他)',
  `isStock` tinyint(1) NOT NULL COMMENT '库存标识:0计算,1不计算',
  `isPrefor` tinyint(1) NOT NULL COMMENT '业绩标识:0计算,1不计算',
  `isPayment` tinyint(1) NOT NULL,
  PRIMARY KEY (`daiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单活动物品表';
DROP TABLE IF EXISTS `decorationaddition`;
CREATE TABLE `decorationaddition` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `designer` varchar(64) NOT NULL COMMENT '设计师',
  `designDepartment` varchar(64) NOT NULL COMMENT '设计部',
  `designRegion` varchar(64) DEFAULT NULL COMMENT '设计大区',
  `salesman` varchar(64) NOT NULL COMMENT '业务员',
  `salesDepartment` varchar(64) NOT NULL COMMENT '业务部',
  `salesRegion` varchar(64) DEFAULT NULL COMMENT '业务大区',
  PRIMARY KEY (`daid`),
  UNIQUE KEY `uniqueone` (`orderId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='附加表';

DROP TABLE IF EXISTS `decorationbalance`;
CREATE TABLE `decorationbalance` (
  `dbid` int(11) NOT NULL AUTO_INCREMENT,
  `doid` int(11) NOT NULL,
  `balance` decimal(10,3) DEFAULT '0.000',
  `uid` int(11) NOT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`dbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修结算';

DROP TABLE IF EXISTS `decorationbelong`;
CREATE TABLE `decorationbelong` (
  `dbid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL COMMENT '订单编号',
  `type` tinyint(1) NOT NULL COMMENT '0: 设计, 1: 业务',
  `buid` int(11) NOT NULL COMMENT '归属人',
  `did` int(11) NOT NULL COMMENT '归属部门',
  `rid` int(11) DEFAULT NULL COMMENT '归属中心',
  `rate` decimal(5,3) NOT NULL DEFAULT '1.000' COMMENT '归属比例',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NULL DEFAULT NULL COMMENT '最后编辑时间',
  `status` tinyint(1) NOT NULL COMMENT '0: 无效 , 1: 有效',
  `defaultFlag` tinyint(1) NOT NULL COMMENT '0: 非归属, 1: 归属',
  PRIMARY KEY (`dbid`),
  KEY `indexone` (`orderId`,`type`,`buid`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单归属';

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

DROP TABLE IF EXISTS `decorationholonomy`;
CREATE TABLE `decorationholonomy` (
  `dhid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `name` varchar(32) DEFAULT NULL COMMENT '名称',
  `maching` decimal(10,3) NOT NULL COMMENT '主材配比',
  `discount` decimal(10,3) NOT NULL COMMENT '订单折扣',
  `discountBase` decimal(10,3) NOT NULL COMMENT '折扣基础',
  `projectBase` decimal(10,3) NOT NULL COMMENT '工程基础',
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
  `diid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `contractPrice` decimal(10,3) NOT NULL COMMENT '合同额',
  `projectPrice` decimal(10,3) NOT NULL COMMENT '工程总额',
  `cdiff` decimal(10,3) DEFAULT '0.000' COMMENT '工程增项',
  `mdiff` decimal(10,3) DEFAULT '0.000' COMMENT '主材增项',
  `managePrice` decimal(10,3) NOT NULL COMMENT '管理费',
  `manageRate` decimal(10,3) NOT NULL COMMENT '管理费比例',
  `materialPaidup` decimal(10,3) DEFAULT '0.000' COMMENT '实收主材额',
  PRIMARY KEY (`diid`),
  UNIQUE KEY `uniqueone` (`orderId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单套餐信息';

DROP TABLE IF EXISTS `decorationinfo`;
CREATE TABLE `decorationinfo` (
  `diid` int(11) NOT NULL AUTO_INCREMENT COMMENT '信息ID',
  `orderId` varchar(15) DEFAULT NULL COMMENT '订单编号',
  `notSalesmanName` varchar(20) DEFAULT NULL COMMENT '非业务员名',
  `notSalesmanPhone` varchar(45) DEFAULT NULL COMMENT '非业务员电话',
  `notSalesmanContent` varchar(100) DEFAULT NULL COMMENT '非业务员备注',
  `backOrderName` varchar(20) DEFAULT NULL COMMENT '返单人员名',
  `backOrderPhone` varchar(45) DEFAULT NULL COMMENT '返单人员电话',
  `backOrderContent` varchar(100) DEFAULT NULL COMMENT '返单人员备注',
  PRIMARY KEY (`diid`),
  UNIQUE KEY `uniqueone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单信息表';

DROP TABLE IF EXISTS `decorationoperate`;
CREATE TABLE `decorationoperate` (
  `doid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `ouid` int(11) DEFAULT NULL COMMENT '操作人ID',
  `operateTime` timestamp NULL DEFAULT NULL,
  `value` float NOT NULL DEFAULT '0',
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `comment` varchar(256) NOT NULL DEFAULT '' COMMENT '备注',
  `dsuid` int(11) DEFAULT NULL COMMENT '设计师ID',
  `smuid` int(11) DEFAULT NULL COMMENT '业务员ID',
  `dsdid` int(11) DEFAULT NULL COMMENT '设计部ID',
  `dsrid` int(11) DEFAULT NULL COMMENT '设计分区ID',
  `smdid` int(11) DEFAULT NULL COMMENT '业务部ID',
  `smrid` int(11) DEFAULT NULL COMMENT '业务分区ID',
  `drate` decimal(5,3) DEFAULT '0.000' COMMENT '设计师比例',
  `srate` decimal(5,3) DEFAULT '0.000' COMMENT '业务员比例',
  PRIMARY KEY (`doid`),
  KEY `indextwo` (`operateTime`,`type`),
  KEY `indexone` (`orderId`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单操作';


DROP TABLE IF EXISTS `decorationpicture`;
CREATE TABLE `decorationpicture` (
  `dpId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(32) NOT NULL,
  `path` varchar(256) NOT NULL,
  `addpath` varchar(256) DEFAULT '',
  `uploadTime` timestamp NULL DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `type` int(11) NOT NULL COMMENT '1 设计效果图 2、工程制图CAD',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`dpId`),
  KEY `indexone` (`orderId`,`uploadTime`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='设计图纸';

DROP TABLE IF EXISTS `decorationservice`;
CREATE TABLE `decorationservice` (
  `dsid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `detail` varchar(64) NOT NULL COMMENT '详述',
  `dsuid` int(11) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL COMMENT '状态,0:初始,1:完成',
  `comment` varchar(128) NOT NULL COMMENT '备注',
  PRIMARY KEY (`dsid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单服务表';

DROP TABLE IF EXISTS `decorationservice`;

DROP TABLE IF EXISTS `decorationuser`;
CREATE TABLE `decorationuser` (
  `duid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `uid` int(11) NOT NULL COMMENT '人员',
  `content` varchar(64) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`duid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单人员表';