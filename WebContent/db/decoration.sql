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
  `unitprice` bigint(10) DEFAULT '0',
  `num` bigint(10) DEFAULT '0',
  `discount` bigint(10) DEFAULT '0',
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
  `money` bigint(10) DEFAULT '0',
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
  `hid` int(11) NOT NULL COMMENT '房产ID',
  `grade` varchar(1) NOT NULL DEFAULT 'B' COMMENT '等级',
  `houseType` varchar(15) NOT NULL DEFAULT ' 现房' COMMENT '期房 , 现房 . ',
  `houseClass` varchar(10) DEFAULT NULL COMMENT '清水 , 二手 , 别墅 , 阁楼 , 地下 . ',
  `apartmentType` varchar(45) DEFAULT NULL COMMENT '举例:一室一厅,两室一厅,三室两厅,三室一厅,阁楼,别墅',
  `salesmanType` varchar(10) NOT NULL DEFAULT '守园',
  `busitype` int(11) DEFAULT '0' COMMENT '业务类型ID',
  `resourceType` tinyint(1) DEFAULT '0' COMMENT '资源类型',
  `paySacle` int(2) unsigned DEFAULT '0' COMMENT '付款比例',
  `saleScale` int(2) unsigned DEFAULT '1918' COMMENT '销售比例',
  `houseArea` decimal(10,2) DEFAULT '0.00' COMMENT '建筑面积',
  `cuid` int(11) DEFAULT NULL COMMENT '创建人ID',
  `dsuid` int(11) DEFAULT NULL COMMENT '设计师ID',
  `smuid` int(11) DEFAULT NULL COMMENT '业务员ID',
  `svuid` int(11) DEFAULT NULL COMMENT '监理ID',
  `quid` int(11) DEFAULT NULL COMMENT '报价员ID',
  `euid` int(11) DEFAULT NULL COMMENT '跟单员ID',
  `ctuid` int(11) DEFAULT NULL COMMENT '签约人ID',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '订单创建时间',
  `measureTime` timestamp NULL DEFAULT NULL,
  `depositTime` timestamp NULL DEFAULT NULL COMMENT '定金时间',
  `sdesignTime` timestamp NULL DEFAULT NULL COMMENT '开始设计时间',
  `edesignTime` timestamp NULL DEFAULT NULL COMMENT '结束设计时间',
  `precontractTime` timestamp NULL DEFAULT NULL COMMENT '预签时间',
  `contractTime` timestamp NULL DEFAULT NULL COMMENT '签约时间',
  `balanceTime` timestamp NULL DEFAULT NULL COMMENT '内决时间',
  `accountTime` timestamp NULL DEFAULT NULL COMMENT '决算时间',
  `status` tinyint(1) DEFAULT NULL COMMENT '0:初始 1:定金 2:签约 3:重签 4:废单 5:终止 6:决算 7:完工',
  `designStatus` tinyint(1) DEFAULT '0' COMMENT '设计状态 , 0(待设计), 1(设计中), 2(完成)',
  `projectStatus` tinyint(1) DEFAULT NULL COMMENT '0:初始  1:开工  2:完工',
  `sourceStatus` tinyint(1) DEFAULT '0' COMMENT ' 0(待确认) , 1(合同确认) , 2(放线确认)',
  `repairStatus` tinyint(1) DEFAULT '0' COMMENT '0(初始) , 1(终身) , 2(转卖) , 3(免责) , 4(欠款)',
  `balanceStatus` tinyint(1) NOT NULL DEFAULT '0' COMMENT '内决状态 , 0: 初始 , 1: 内决',
  `quotationStatus` tinyint(1) DEFAULT '0',
  `otherStatus` tinyint(1) DEFAULT '0' COMMENT '1合尺, 2设计费',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '半包0, 全包1, 半价2',
  `typeness` tinyint(1) NOT NULL,
  `orderType` tinyint(1) DEFAULT '1' COMMENT '1 装修订单 2 主材订单',
  `versionId` varchar(11) NOT NULL COMMENT '订单使用报价版本号',
  `orderTotalPrice` bigint(10) DEFAULT '0' COMMENT '折后合同额',
  `quotationPrice` bigint(10) DEFAULT '0',
  `notSalesmanRate` int(5) NOT NULL DEFAULT '0',
  `couponCut` bigint(10) DEFAULT '0',
  `thingCut` bigint(10) DEFAULT '0',
  `factPrice` bigint(10) DEFAULT '0' COMMENT '实收额',
  `precontractPrice` bigint(10) DEFAULT '0' COMMENT '预签额',
  `discount` int(5) DEFAULT '0' COMMENT '报价折扣',
  `quotationTimeLimit` tinyint(1) NOT NULL DEFAULT '0',
  `conpany` int(11) NOT NULL DEFAULT '0' COMMENT '工程公司',
  `company` int(11) NOT NULL COMMENT '订单所属公司',
  PRIMARY KEY (`doid`),
  UNIQUE KEY `indexone` (`orderId`),
  KEY `indexthr` (`houseArea`),
  KEY `indexfou` (`customerId`),
  KEY `indexsix` (`dsuid`),
  KEY `indexsev` (`smuid`),
  KEY `indexeig` (`status`),
  KEY `indexnig` (`company`),
  KEY `indextwo` (`hid`),
  KEY `indexten` (`createTime`),
  KEY `indexelv` (`contractTime`),
  KEY `indextev` (`sdesignTime`,`edesignTime`),
  KEY `indexfot` (`balanceTime`),
  KEY `indextht` (`accountTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单';

DROP TABLE IF EXISTS `decorationaccount`;
CREATE TABLE `decorationaccount` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `type` tinyint(1) NOT NULL COMMENT '类型:0:半包,1:套餐,2:半价',
  `typeness` tinyint(1) NOT NULL,
  `arcal` tinyint(1) NOT NULL DEFAULT '1',
  `matching` int(5) NOT NULL COMMENT '主材配比',
  `discount` int(5) NOT NULL COMMENT '订单折扣',
  `name` varchar(32) NOT NULL DEFAULT '',
  `discountBase` bigint(10) NOT NULL DEFAULT '0',
  `serviceRate` bigint(10) NOT NULL COMMENT '服务费比例',
  `difference` bigint(10) NOT NULL,
  `materialPrice` bigint(10) NOT NULL COMMENT '主材总额',
  `servicePrice` bigint(10) NOT NULL COMMENT '服务费',
  `projectPrice` bigint(10) NOT NULL DEFAULT '0' COMMENT '工程总额',
  `projectBase` bigint(10) NOT NULL DEFAULT '0',
  `coupon` bigint(10) NOT NULL DEFAULT '0',
  `internal` bigint(10) DEFAULT '0',
  `fulldel` bigint(10) NOT NULL DEFAULT '0',
  `cashback` bigint(10) NOT NULL DEFAULT '0',
  `comment` varchar(128) NOT NULL DEFAULT '',
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
  `asid` int(11) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  `activityItemName` varchar(32) NOT NULL,
  `num` int(8) NOT NULL DEFAULT '0',
  `money` int(8) NOT NULL DEFAULT '0',
  `ruid` int(11) DEFAULT NULL COMMENT '接收人ID',
  `receiveUserName` varchar(15) NOT NULL DEFAULT '',
  `receiveTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(1) NOT NULL,
  `stateType` tinyint(1) NOT NULL COMMENT '状态类型(0到店/1定金/2签单/3抽奖/4特批/5购买/6其他)',
  `isStock` tinyint(1) NOT NULL COMMENT '库存标识:0计算,1不计算',
  `isPrefor` tinyint(1) NOT NULL COMMENT '业绩标识:0计算,1不计算',
  `isPayment` tinyint(1) NOT NULL,
  `isAffirm` tinyint(1) NOT NULL DEFAULT '0',
  `state` tinyint(1) NOT NULL,
  `content` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`daiId`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`asid`)
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
  `designProtectTime` timestamp NULL DEFAULT NULL,
  `salesProtectTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`daid`),
  UNIQUE KEY `uniqueone` (`orderId`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='附加表';

DROP TABLE IF EXISTS `decorationbalance`;
CREATE TABLE `decorationbalance` (
  `dbid` int(11) NOT NULL AUTO_INCREMENT,
  `doid` int(11) NOT NULL,
  `balance` bigint(10) DEFAULT '0',
  `uid` int(11) NOT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`dbid`),
  KEY `indexone` (`doid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修结算';

DROP TABLE IF EXISTS `decorationbelong`;
CREATE TABLE `decorationbelong` (
  `dbid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL COMMENT '订单编号',
  `type` tinyint(1) NOT NULL COMMENT '0: 设计, 1: 业务',
  `buid` int(11) NOT NULL COMMENT '归属人',
  `did` int(11) NOT NULL COMMENT '归属部门',
  `rid` int(11) DEFAULT NULL COMMENT '归属中心',
  `rate` int(5) NOT NULL DEFAULT '1000' COMMENT '归属比例',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NULL DEFAULT NULL COMMENT '最后编辑时间',
  `status` tinyint(1) NOT NULL COMMENT '0: 无效 , 1: 有效',
  `defaultFlag` tinyint(1) NOT NULL COMMENT '0: 非归属, 1: 归属',
  PRIMARY KEY (`dbid`),
  KEY `indexone` (`orderId`,`type`,`buid`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单归属';

DROP TABLE IF EXISTS `decorationcontract`;
CREATE TABLE `decorationcontract` (
  `dcid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(30) NOT NULL,
  `cid` int(11) DEFAULT NULL,
  `download` varchar(256) DEFAULT '',
  `viewpdf` varchar(256) DEFAULT '',
  `path` varchar(256) DEFAULT NULL,
  `filesize` int(10) DEFAULT '0',
  `cuid` int(11) DEFAULT NULL,
  `suid` int(11) DEFAULT NULL,
  `fuid` int(11) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `comsignTime` timestamp NULL DEFAULT NULL,
  `cussignTime` timestamp NULL DEFAULT NULL,
  `filingTime` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `ishow` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`dcid`) USING BTREE,
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修合同表';

DROP TABLE IF EXISTS `decorationfunction`;
CREATE TABLE `decorationfunction` (
  `dfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `sort` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修功能';

DROP TABLE IF EXISTS `decorationholonomy`;
CREATE TABLE `decorationholonomy` (
  `dhid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `name` varchar(32) DEFAULT NULL COMMENT '名称',
  `maching` int(5) NOT NULL COMMENT '主材配比',
  `discount` int(5) NOT NULL COMMENT '订单折扣',
  `discountBase` bigint(10) NOT NULL DEFAULT '0',
  `projectBase` bigint(10) NOT NULL DEFAULT '0',
  `projectPrice` bigint(10) NOT NULL DEFAULT '0' COMMENT '工程总额',
  `originMaterialPrice` bigint(10) NOT NULL DEFAULT '0' COMMENT '原主材总额',
  `managePrice` bigint(10) NOT NULL DEFAULT '0' COMMENT '管理费',
  `manageRate` int(5) NOT NULL DEFAULT '0' COMMENT '管理费比例',
  `manageDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `materialPrice` bigint(10) NOT NULL DEFAULT '0' COMMENT '主材总额',
  `materialPaidup` bigint(10) DEFAULT '0' COMMENT '实收主材额',
  `servicePrice` bigint(10) NOT NULL DEFAULT '0' COMMENT '服务费',
  `serviceRate` int(5) NOT NULL DEFAULT '0' COMMENT '服务费比例',
  `servicePaidup` bigint(10) DEFAULT '0' COMMENT '实收服务费',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`dhid`),
  UNIQUE KEY `uniqueone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单半价信息';

DROP TABLE IF EXISTS `decorationinclusive`;
CREATE TABLE `decorationinclusive` (
  `diid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `contractPrice` bigint(10) NOT NULL COMMENT '合同额',
  `projectPrice` bigint(10) NOT NULL COMMENT '工程总额',
  `cdiff` bigint(10) DEFAULT '0' COMMENT '工程增项',
  `mdiff` bigint(10) DEFAULT '0' COMMENT '主材增项',
  `managePrice` bigint(10) NOT NULL COMMENT '管理费',
  `manageRate` int(5) NOT NULL COMMENT '管理费比例',
  `materialPaidup` bigint(10) DEFAULT '0' COMMENT '实收主材额',
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


DROP TABLE IF EXISTS `decorationmidpack`;
CREATE TABLE `decorationmidpack` (
  `dmid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(32) DEFAULT '',
  `materialPrice` bigint(10) NOT NULL DEFAULT '0',
  `servicePrice` bigint(10) NOT NULL DEFAULT '0',
  `materialPaidup` bigint(10) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`dmid`),
  UNIQUE KEY `uniqueone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修半包信息表';

DROP TABLE IF EXISTS `decorationoperate`;
CREATE TABLE `decorationoperate` (
  `doid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `ouid` int(11) DEFAULT NULL COMMENT '操作人ID',
  `operateTime` timestamp NULL DEFAULT NULL,
  `value` bigint(10) DEFAULT '0',
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `comment` varchar(256) NOT NULL DEFAULT '' COMMENT '备注',
  `dsuid` int(11) DEFAULT NULL COMMENT '设计师ID',
  `smuid` int(11) DEFAULT NULL COMMENT '业务员ID',
  `dsdid` int(11) DEFAULT NULL COMMENT '设计部ID',
  `dsrid` int(11) DEFAULT NULL COMMENT '设计分区ID',
  `smdid` int(11) DEFAULT NULL COMMENT '业务部ID',
  `smrid` int(11) DEFAULT NULL COMMENT '业务分区ID',
  `drate` bigint(10) DEFAULT '0',
  `srate` bigint(10) DEFAULT '0',
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
  `filesize` int(10) DEFAULT '0',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `uploadTime` timestamp NULL DEFAULT NULL,
  `type` int(11) NOT NULL COMMENT '1 设计效果图 2、工程制图CAD',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `content` varchar(45) DEFAULT NULL,
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
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态,0:初始,1:完成',
  `comment` varchar(128) NOT NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`dsid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单服务表';

DROP TABLE IF EXISTS `decorationuser`;
CREATE TABLE `decorationuser` (
  `duid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `uid` int(11) NOT NULL COMMENT '人员',
  `content` varchar(64) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`duid`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单人员表';