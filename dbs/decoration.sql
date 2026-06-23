CREATE DATABASE IF NOT EXISTS `decoration`;
USE `decoration`;

-- Generated at 2026-01-06 08:11:02
-- Total tables: 29

DROP TABLE IF EXISTS `audit`;
CREATE TABLE `audit` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `auid` int(11) NULL COMMENT '审核人ID',
  `auditTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
  PRIMARY KEY (`aid`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3930 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='审核表';

DROP TABLE IF EXISTS `auditrecord`;
CREATE TABLE `auditrecord` (
  `arid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `unitprice` bigint(10) NULL DEFAULT 0,
  `num` bigint(10) NULL DEFAULT 0,
  `discount` bigint(10) NULL DEFAULT 0,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(255) NOT NULL COMMENT '说明',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`arid`),
  KEY `indexone` (`aid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='审核记录表';

DROP TABLE IF EXISTS `auditscale`;
CREATE TABLE `auditscale` (
  `asid` int(11) NOT NULL AUTO_INCREMENT,
  `arid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `buid` int(11) NOT NULL COMMENT '归属人ID',
  `bdid` int(11) NOT NULL COMMENT '归属人部门',
  `money` bigint(10) NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`asid`),
  KEY `indexone` (`arid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=427 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='审核比例表';

DROP TABLE IF EXISTS `backvisit`;
CREATE TABLE `backvisit` (
  `bvId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `suid` int(11) NOT NULL COMMENT '发送人ID',
  `createTime` timestamp NULL,
  `content` varchar(128) NOT NULL,
  `receiverIds` varchar(128) NULL,
  PRIMARY KEY (`bvId`),
  KEY `indexone` (`orderId`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=335 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='设计师回访记录表';

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(16) NOT NULL,
  `code` varchar(10) NULL DEFAULT '',
  `name` varchar(16) NOT NULL,
  `shortname` varchar(8) NULL DEFAULT '',
  `fullname` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `corporation` varchar(8) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `doid` int(11) NULL,
  `soid` int(11) NULL,
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 集团 , 1: 装修 , 2: 家居 , 3: 工程 , 4: 建材 , 5: 房产 , 6: 科技 , 7: 其他',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='公司表';

DROP TABLE IF EXISTS `decoration`;
CREATE TABLE `decoration` (
  `doid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL DEFAULT '',
  `customerId` int(11) NOT NULL COMMENT '客户编号',
  `villageId` varchar(10) NULL COMMENT '楼盘编号',
  `houseNumber` varchar(30) NULL COMMENT '门牌号',
  `hid` int(11) NOT NULL COMMENT '房产ID',
  `grade` varchar(1) NOT NULL DEFAULT 'B' COMMENT '等级',
  `houseType` varchar(15) NOT NULL DEFAULT ' 现房' COMMENT '期房 , 现房 . ',
  `houseClass` varchar(10) NULL COMMENT '清水 , 二手 , 别墅 , 阁楼 , 地下 . ',
  `apartmentType` varchar(45) NULL COMMENT '举例:一室一厅,两室一厅,三室两厅,三室一厅,阁楼,别墅',
  `salesmanType` varchar(10) NOT NULL DEFAULT '守园',
  `busitype` int(11) NULL DEFAULT 0 COMMENT '业务类型ID',
  `resourceType` tinyint(1) NULL DEFAULT 0 COMMENT '资源类型',
  `paySacle` int(2) unsigned NULL DEFAULT 0 COMMENT '付款比例',
  `saleScale` int(2) unsigned NULL DEFAULT 0 COMMENT '销售比例',
  `houseArea` decimal(10,2) NULL DEFAULT 0.00 COMMENT '建筑面积',
  `cuid` int(11) unsigned NULL COMMENT '创建人ID',
  `dsuid` int(11) unsigned NULL COMMENT '设计师ID',
  `smuid` int(11) unsigned NULL COMMENT '业务员ID',
  `svuid` int(11) unsigned NULL COMMENT '监理ID',
  `quid` int(11) unsigned NULL COMMENT '报价员ID',
  `euid` int(11) unsigned NULL COMMENT '跟单员ID',
  `ctuid` int(11) unsigned NULL COMMENT '签约人ID',
  `msuid` int(11) unsigned NULL,
  `ddid` int(11) NULL DEFAULT 0 COMMENT '设计部',
  `sdid` int(11) NULL DEFAULT 0 COMMENT '业务部',
  `createTime` timestamp NULL COMMENT '订单创建时间',
  `measureTime` timestamp NULL COMMENT '量尺时间',
  `depositTime` timestamp NULL COMMENT '定金时间',
  `sdesignTime` timestamp NULL COMMENT '开始设计时间',
  `edesignTime` timestamp NULL COMMENT '结束设计时间',
  `precontractTime` timestamp NULL COMMENT '预签时间',
  `contractTime` timestamp NULL COMMENT '签约时间',
  `recontractTime` timestamp NULL,
  `balanceTime` timestamp NULL COMMENT '内决时间',
  `accountTime` timestamp NULL COMMENT '决算时间',
  `terminalTime` timestamp NULL COMMENT '终止时间',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '0:初始 1:定金 2:已签约 3:重签合同 4:废单 5:合
同终止 6:决算 7:已完工 (0:初始, 1:定金, 2:预签, 3:签约, 4:重签, 5:废单, 6:终止, 7:决算, 8:完工, 20:待审中)',
  `designStatus` tinyint(1) NULL DEFAULT 0 COMMENT '设计状态 , 0(待设计), 1(设计中), 2(完成)',
  `projectStatus` int(11) NULL DEFAULT 0 COMMENT '工程状态, 包括: 0(初始), 1(开工), 2(完工), 其他状态关联 constructionNode',
  `sourceStatus` tinyint(1) NULL DEFAULT 0 COMMENT '0(待确认) , 1(合同确认) , 2(放线确认)',
  `repairStatus` tinyint(1) NULL DEFAULT 0 COMMENT '0(初始) , 1(终身) , 2(转卖) , 3(免责) , 4(欠款)',
  `balanceStatus` tinyint(1) NOT NULL DEFAULT 0 COMMENT '内决状态 , 0: 初始 , 1: 内决',
  `quotationStatus` tinyint(1) NULL DEFAULT 0,
  `otherStatus` tinyint(1) NULL DEFAULT 0 COMMENT '1:合尺, 2:设计费',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0:半包, 1:全包, 2:半价 (1918:销售比例默认值1918)',
  `typeness` tinyint(1) NOT NULL,
  `orderType` tinyint(1) NULL DEFAULT 1 COMMENT '1:装修订单, 2:主材订单',
  `versionId` varchar(11) NOT NULL COMMENT '订单使用报价版本号',
  `orderTotalPrice` bigint(10) NULL DEFAULT 0 COMMENT '折后合同额',
  `quotationPrice` bigint(10) NULL DEFAULT 0,
  `notSalesmanRate` int(8) NOT NULL DEFAULT 0,
  `couponCut` bigint(10) NULL DEFAULT 0,
  `thingCut` bigint(10) NULL DEFAULT 0,
  `factPrice` bigint(10) NULL DEFAULT 0 COMMENT '实收额',
  `precontractPrice` bigint(10) NULL DEFAULT 0 COMMENT '预签额',
  `discount` int(5) NULL DEFAULT 0 COMMENT '报价折扣',
  `quotationTimeLimit` tinyint(1) NOT NULL DEFAULT 0,
  `conpany` int(11) NOT NULL DEFAULT 0 COMMENT '工程公司',
  `company` int(11) NOT NULL COMMENT '订单所属公司',
  `bompany` int(11) NULL,
  PRIMARY KEY (`doid`),
  KEY `indexeig` (`status`) USING BTREE,
  KEY `indexelv` (`contractTime`) USING BTREE,
  KEY `indexfot` (`balanceTime`) USING BTREE,
  KEY `indexfou` (`customerId`) USING BTREE,
  KEY `indexnig` (`company`) USING BTREE,
  UNIQUE KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexsev` (`smuid`) USING BTREE,
  KEY `indexsix` (`dsuid`) USING BTREE,
  KEY `indexten` (`createTime`) USING BTREE,
  KEY `indextev` (`sdesignTime`, `edesignTime`) USING BTREE,
  KEY `indexthr` (`houseArea`) USING BTREE,
  KEY `indextht` (`accountTime`) USING BTREE,
  KEY `indextwo` (`hid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4082 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单';

DROP TABLE IF EXISTS `decoration0`;
CREATE TABLE `decoration0` (
  `doid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL DEFAULT '',
  `customerId` int(11) NOT NULL COMMENT '客户编号',
  `villageId` varchar(10) NULL COMMENT '楼盘编号',
  `houseNumber` varchar(30) NULL COMMENT '门牌号',
  `hid` int(11) NOT NULL COMMENT '房产ID',
  `grade` varchar(1) NOT NULL DEFAULT 'B' COMMENT '等级',
  `houseType` varchar(15) NOT NULL DEFAULT ' 现房' COMMENT '期房 , 现房 . ',
  `houseClass` varchar(10) NULL COMMENT '清水 , 二手 , 别墅 , 阁楼 , 地下 . ',
  `apartmentType` varchar(45) NULL COMMENT '举例:一室一厅,两室一厅,三室两厅,三室一厅,阁楼,别墅',
  `salesmanType` varchar(10) NOT NULL DEFAULT '守园',
  `busitype` int(11) NULL DEFAULT 0 COMMENT '业务类型ID',
  `resourceType` tinyint(1) NULL DEFAULT 0 COMMENT '资源类型',
  `paySacle` int(2) unsigned NULL DEFAULT 0 COMMENT '付款比例',
  `saleScale` int(2) unsigned NULL DEFAULT 1918 COMMENT '销售比例',
  `houseArea` decimal(10,2) NULL DEFAULT 0.00 COMMENT '建筑面积',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `dsuid` int(11) NULL COMMENT '设计师ID',
  `smuid` int(11) NULL COMMENT '业务员ID',
  `svuid` int(11) NULL COMMENT '监理ID',
  `quid` int(11) NULL COMMENT '报价员ID',
  `euid` int(11) NULL COMMENT '跟单员ID',
  `ctuid` int(11) NULL COMMENT '签约人ID',
  `createTime` timestamp NULL COMMENT '订单创建时间',
  `measureTime` timestamp NULL,
  `depositTime` timestamp NULL COMMENT '定金时间',
  `sdesignTime` timestamp NULL COMMENT '开始设计时间',
  `edesignTime` timestamp NULL COMMENT '结束设计时间',
  `precontractTime` timestamp NULL COMMENT '预签时间',
  `contractTime` timestamp NULL COMMENT '签约时间',
  `balanceTime` timestamp NULL COMMENT '内决时间',
  `accountTime` timestamp NULL COMMENT '决算时间',
  `status` tinyint(1) NULL COMMENT '0:初始 1:定金 2:签约 3:重签 4:废单 5:终止 6:决算 7:完工',
  `designStatus` tinyint(1) NULL DEFAULT 0 COMMENT '设计状态 , 0(待设计), 1(设计中), 2(完成)',
  `projectStatus` tinyint(1) NULL COMMENT '0:初始  1:开工  2:完工',
  `sourceStatus` tinyint(1) NULL DEFAULT 0 COMMENT ' 0(待确认) , 1(合同确认) , 2(放线确认)',
  `repairStatus` tinyint(1) NULL DEFAULT 0 COMMENT '0(初始) , 1(终身) , 2(转卖) , 3(免责) , 4(欠款)',
  `balanceStatus` tinyint(1) NOT NULL DEFAULT 0 COMMENT '内决状态 , 0: 初始 , 1: 内决',
  `quotationStatus` tinyint(1) NULL DEFAULT 0,
  `otherStatus` tinyint(1) NULL DEFAULT 0 COMMENT '1合尺, 2设计费',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '半包0, 全包1, 半价2',
  `typeness` tinyint(1) NOT NULL,
  `orderType` tinyint(1) NULL DEFAULT 1 COMMENT '1 装修订单 2 主材订单',
  `versionId` varchar(11) NOT NULL COMMENT '订单使用报价版本号',
  `orderTotalPrice` bigint(10) NULL DEFAULT 0 COMMENT '折后合同额',
  `quotationPrice` bigint(10) NULL DEFAULT 0,
  `notSalesmanRate` int(5) NOT NULL DEFAULT 0,
  `couponCut` bigint(10) NULL DEFAULT 0,
  `thingCut` bigint(10) NULL DEFAULT 0,
  `factPrice` bigint(10) NULL DEFAULT 0 COMMENT '实收额',
  `precontractPrice` bigint(10) NULL DEFAULT 0 COMMENT '预签额',
  `discount` int(5) NULL DEFAULT 0 COMMENT '报价折扣',
  `quotationTimeLimit` tinyint(1) NOT NULL DEFAULT 0,
  `conpany` int(11) NOT NULL DEFAULT 0 COMMENT '工程公司',
  `company` int(11) NOT NULL COMMENT '订单所属公司',
  PRIMARY KEY (`doid`),
  KEY `indexeig` (`status`) USING BTREE,
  KEY `indexelv` (`contractTime`) USING BTREE,
  KEY `indexfot` (`balanceTime`) USING BTREE,
  KEY `indexfou` (`customerId`) USING BTREE,
  KEY `indexnig` (`company`) USING BTREE,
  UNIQUE KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexsev` (`smuid`) USING BTREE,
  KEY `indexsix` (`dsuid`) USING BTREE,
  KEY `indexten` (`createTime`) USING BTREE,
  KEY `indextev` (`sdesignTime`, `edesignTime`) USING BTREE,
  KEY `indexthr` (`houseArea`) USING BTREE,
  KEY `indextht` (`accountTime`) USING BTREE,
  KEY `indextwo` (`hid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3632 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单0';

DROP TABLE IF EXISTS `decoration1`;
CREATE TABLE `decoration1` (
  `doid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL DEFAULT '',
  `customerId` int(11) NOT NULL COMMENT '客户编号',
  `villageId` varchar(10) NULL COMMENT '楼盘编号',
  `houseNumber` varchar(30) NULL COMMENT '门牌号',
  `hid` int(11) NOT NULL COMMENT '房产ID',
  `grade` varchar(1) NOT NULL DEFAULT 'B' COMMENT '等级',
  `houseType` varchar(15) NOT NULL DEFAULT ' 现房' COMMENT '期房 , 现房 . ',
  `houseClass` varchar(10) NULL COMMENT '清水 , 二手 , 别墅 , 阁楼 , 地下 . ',
  `apartmentType` varchar(45) NULL COMMENT '举例:一室一厅,两室一厅,三室两厅,三室一厅,阁楼,别墅',
  `salesmanType` varchar(10) NOT NULL DEFAULT '守园',
  `busitype` int(11) NULL DEFAULT 0 COMMENT '业务类型ID',
  `resourceType` tinyint(1) NULL DEFAULT 0 COMMENT '资源类型',
  `paySacle` int(2) unsigned NULL DEFAULT 0 COMMENT '付款比例',
  `saleScale` int(2) unsigned NULL DEFAULT 1918 COMMENT '销售比例',
  `houseArea` decimal(10,2) NULL DEFAULT 0.00 COMMENT '建筑面积',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `dsuid` int(11) NULL COMMENT '设计师ID',
  `smuid` int(11) NULL COMMENT '业务员ID',
  `svuid` int(11) NULL COMMENT '监理ID',
  `quid` int(11) NULL COMMENT '报价员ID',
  `euid` int(11) NULL COMMENT '跟单员ID',
  `ctuid` int(11) NULL COMMENT '签约人ID',
  `createTime` timestamp NULL COMMENT '订单创建时间',
  `measureTime` timestamp NULL,
  `depositTime` timestamp NULL COMMENT '定金时间',
  `sdesignTime` timestamp NULL COMMENT '开始设计时间',
  `edesignTime` timestamp NULL COMMENT '结束设计时间',
  `precontractTime` timestamp NULL COMMENT '预签时间',
  `contractTime` timestamp NULL COMMENT '签约时间',
  `balanceTime` timestamp NULL COMMENT '内决时间',
  `accountTime` timestamp NULL COMMENT '决算时间',
  `status` tinyint(1) NULL COMMENT '0:初始 1:定金 2:签约 3:重签 4:废单 5:终止 6:决算 7:完工',
  `designStatus` tinyint(1) NULL DEFAULT 0 COMMENT '设计状态 , 0(待设计), 1(设计中), 2(完成)',
  `projectStatus` tinyint(1) NULL COMMENT '0:初始  1:开工  2:完工',
  `sourceStatus` tinyint(1) NULL DEFAULT 0 COMMENT ' 0(待确认) , 1(合同确认) , 2(放线确认)',
  `repairStatus` tinyint(1) NULL DEFAULT 0 COMMENT '0(初始) , 1(终身) , 2(转卖) , 3(免责) , 4(欠款)',
  `balanceStatus` tinyint(1) NOT NULL DEFAULT 0 COMMENT '内决状态 , 0: 初始 , 1: 内决',
  `quotationStatus` tinyint(1) NULL DEFAULT 0,
  `otherStatus` tinyint(1) NULL DEFAULT 0 COMMENT '1合尺, 2设计费',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '半包0, 全包1, 半价2',
  `typeness` tinyint(1) NOT NULL,
  `orderType` tinyint(1) NULL DEFAULT 1 COMMENT '1 装修订单 2 主材订单',
  `versionId` varchar(11) NOT NULL COMMENT '订单使用报价版本号',
  `orderTotalPrice` bigint(10) NULL DEFAULT 0 COMMENT '折后合同额',
  `quotationPrice` bigint(10) NULL DEFAULT 0,
  `notSalesmanRate` int(5) NOT NULL DEFAULT 0,
  `couponCut` bigint(10) NULL DEFAULT 0,
  `thingCut` bigint(10) NULL DEFAULT 0,
  `factPrice` bigint(10) NULL DEFAULT 0 COMMENT '实收额',
  `precontractPrice` bigint(10) NULL DEFAULT 0 COMMENT '预签额',
  `discount` int(5) NULL DEFAULT 0 COMMENT '报价折扣',
  `quotationTimeLimit` tinyint(1) NOT NULL DEFAULT 0,
  `conpany` int(11) NOT NULL DEFAULT 0 COMMENT '工程公司',
  `company` int(11) NOT NULL COMMENT '订单所属公司',
  PRIMARY KEY (`doid`),
  KEY `indexeig` (`status`) USING BTREE,
  KEY `indexelv` (`contractTime`) USING BTREE,
  KEY `indexfot` (`balanceTime`) USING BTREE,
  KEY `indexfou` (`customerId`) USING BTREE,
  KEY `indexnig` (`company`) USING BTREE,
  UNIQUE KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexsev` (`smuid`) USING BTREE,
  KEY `indexsix` (`dsuid`) USING BTREE,
  KEY `indexten` (`createTime`) USING BTREE,
  KEY `indextev` (`sdesignTime`, `edesignTime`) USING BTREE,
  KEY `indexthr` (`houseArea`) USING BTREE,
  KEY `indextht` (`accountTime`) USING BTREE,
  KEY `indextwo` (`hid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单1';

DROP TABLE IF EXISTS `decorationaccount`;
CREATE TABLE `decorationaccount` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `type` tinyint(1) NOT NULL COMMENT '类型:0:半包,1:套餐,2:半价',
  `typeness` tinyint(1) NOT NULL,
  `arcal` tinyint(1) NOT NULL COMMENT '0: 计算配比 , 1: 不计算配比',
  `matching` int(5) NOT NULL COMMENT '主材配比',
  `discount` int(5) NOT NULL COMMENT '订单折扣',
  `name` varchar(32) NULL DEFAULT '',
  `discountBase` bigint(10) NOT NULL DEFAULT 0 COMMENT '折扣基数',
  `serviceRate` bigint(10) NOT NULL COMMENT '服务费比例',
  `paidupMatching` int(5) NOT NULL DEFAULT 0 COMMENT '实花配比',
  `difference` bigint(10) NOT NULL,
  `materialPrice` bigint(10) NOT NULL COMMENT '主材总额',
  `servicePrice` bigint(10) NOT NULL COMMENT '服务费',
  `projectPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '工程总额',
  `projectBase` bigint(10) NOT NULL DEFAULT 0,
  `coupon` bigint(10) NOT NULL DEFAULT 0,
  `fulldel` bigint(10) NOT NULL DEFAULT 0,
  `cashback` bigint(10) NOT NULL DEFAULT 0,
  `internal` bigint(10) NULL DEFAULT 0,
  `isAffirm` tinyint(1) NULL DEFAULT 0 COMMENT '是否确认 , 0: 初始 , 1: 确认',
  `affirmTime` timestamp NULL COMMENT '确认时间',
  `comment` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`daid`),
  UNIQUE KEY `uniqueone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='决算表';

DROP TABLE IF EXISTS `decorationaccountitem`;
CREATE TABLE `decorationaccountitem` (
  `daiid` int(11) NOT NULL AUTO_INCREMENT,
  `daid` int(11) NOT NULL DEFAULT 0 COMMENT '决算ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `type` tinyint(2) NOT NULL DEFAULT 0 COMMENT '类型: 0预签,1报价,2扩展,3合同,4主材,5外销,6增减,7预付款,8决算',
  `subtype` tinyint(2) NOT NULL DEFAULT 0 COMMENT '子类型',
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT '明细名称',
  `sourceType` tinyint(2) NOT NULL DEFAULT 0 COMMENT '来源类型',
  `sourceId` bigint(20) NOT NULL DEFAULT 0 COMMENT '来源ID',
  `money` bigint(10) NOT NULL DEFAULT 0 COMMENT '金额',
  `rate` int(8) NOT NULL DEFAULT 0 COMMENT '比例/折扣/配比',
  `sort` int(5) NOT NULL DEFAULT 0 COMMENT '排序',
  `content` varchar(512) NOT NULL DEFAULT '' COMMENT '内容快照',
  `comment` varchar(128) NOT NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`daiid`),
  KEY `indexone` (`daid`) USING BTREE,
  KEY `indextwo` (`orderId`) USING BTREE,
  KEY `indexthree` (`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='决算明细';

DROP TABLE IF EXISTS `decorationactivity`;
CREATE TABLE `decorationactivity` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `aid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NULL,
  `status` tinyint(1) NOT NULL COMMENT '0:初始',
  PRIMARY KEY (`daid`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2456 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修活动表';

DROP TABLE IF EXISTS `decorationactivityitem`;
CREATE TABLE `decorationactivityitem` (
  `daiId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `asid` int(11) NOT NULL,
  `no` varchar(128) NULL COMMENT '编号',
  `activityName` varchar(128) NOT NULL,
  `activityItemName` varchar(64) NOT NULL,
  `num` int(8) NOT NULL DEFAULT 0,
  `money` int(8) NOT NULL DEFAULT 0,
  `expendPrice` int(8) NULL DEFAULT 0,
  `discountPrice` int(8) NULL DEFAULT 0,
  `cuid` int(11) NULL,
  `ruid` int(11) NULL COMMENT '接收人ID',
  `rfuid` int(11) NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `receiveTime` timestamp NULL,
  `refundTime` timestamp NULL,
  `affirmTime` timestamp NULL,
  `checkTime` timestamp NULL,
  `type` tinyint(1) NOT NULL,
  `stateType` tinyint(1) NOT NULL COMMENT '状态类型(0到店/1定金/2签单/3抽奖/4特批/5购买/6其他)',
  `isStock` tinyint(1) NULL DEFAULT 0 COMMENT '库存标识:0计算,1不计算',
  `isPrefor` tinyint(1) NULL DEFAULT 0 COMMENT '业绩标识:0计算,1不计算',
  `isPayment` tinyint(1) NULL DEFAULT 0,
  `isAffirm` tinyint(1) NULL DEFAULT 0 COMMENT '0、 未确认 1、客户确认',
  `state` tinyint(1) NOT NULL,
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0、 线下 1、线上 (0:线下, 1:线上)',
  `content` varchar(128) NULL DEFAULT '',
  `comment` varchar(128) NULL DEFAULT '',
  PRIMARY KEY (`daiId`),
  KEY `indexone` (`orderId`) USING BTREE,
  KEY `indextwo` (`asid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3552 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单活动物品表';

DROP TABLE IF EXISTS `decorationactivityrecord`;
CREATE TABLE `decorationactivityrecord` (
  `darid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `daid` int(11) NULL COMMENT '客户',
  `daiid` int(11) NULL DEFAULT 0,
  `ouid` int(11) NULL COMMENT '操作人',
  `operateTime` timestamp NULL COMMENT '操作时间',
  `type` tinyint(1) NULL COMMENT '类型',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`darid`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修活动记录';

DROP TABLE IF EXISTS `decorationaddition`;
CREATE TABLE `decorationaddition` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `designer` varchar(64) NOT NULL COMMENT '设计师',
  `designDepartment` varchar(64) NOT NULL COMMENT '设计部',
  `designRegion` varchar(64) NULL COMMENT '设计大区',
  `salesman` varchar(64) NOT NULL COMMENT '业务员',
  `salesDepartment` varchar(64) NOT NULL COMMENT '业务部',
  `salesRegion` varchar(64) NULL COMMENT '业务大区',
  `designProtectTime` timestamp NULL,
  `salesProtectTime` timestamp NULL,
  `issueTime` timestamp NULL,
  `meetTime` timestamp NULL,
  `belongTime` timestamp NULL,
  PRIMARY KEY (`daid`),
  KEY `indexone` (`orderId`) USING BTREE,
  UNIQUE KEY `uniqueone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3945 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='附加表';

DROP TABLE IF EXISTS `decorationbalance`;
CREATE TABLE `decorationbalance` (
  `dbid` int(11) NOT NULL AUTO_INCREMENT,
  `doid` int(11) NOT NULL,
  `balance` bigint(10) NULL DEFAULT 0,
  `uid` int(11) NOT NULL,
  `balanceTime` timestamp NULL,
  PRIMARY KEY (`dbid`),
  KEY `indexone` (`doid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修结算';

DROP TABLE IF EXISTS `decorationbelong`;
CREATE TABLE `decorationbelong` (
  `dbid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL COMMENT '订单编号',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 设计, 1: 业务',
  `buid` int(11) NOT NULL COMMENT '归属人',
  `did` int(11) NOT NULL COMMENT '归属部门',
  `rid` int(11) NULL COMMENT '归属中心',
  `rate` int(5) NOT NULL DEFAULT 1000 COMMENT '归属比例',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NULL COMMENT '最后编辑时间',
  `updateTime` timestamp NULL,
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '0: 无效 , 1: 有效',
  `defaultFlag` tinyint(1) NOT NULL DEFAULT 1 COMMENT ' 0: 非归属, 1: 归属',
  PRIMARY KEY (`dbid`),
  KEY `indexone` (`orderId`, `status`, `type`, `buid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9155 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单归属';

DROP TABLE IF EXISTS `decorationcontract`;
CREATE TABLE `decorationcontract` (
  `dcid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(30) NOT NULL,
  `cid` int(11) NOT NULL DEFAULT 0 COMMENT '合同ID',
  `no` varchar(255) NOT NULL COMMENT '合同编号 合同编号',
  `name` varchar(50) NOT NULL COMMENT '名称 名称',
  `title` varchar(50) NOT NULL COMMENT '标题 标题',
  `download` varchar(256) NULL,
  `viewpdf` varchar(256) NULL,
  `path` varchar(256) NULL,
  `filesize` int(10) NULL DEFAULT 0 COMMENT '文件大小',
  `cuid` int(11) NULL,
  `suid` int(11) NULL,
  `fuid` int(11) NULL,
  `createTime` timestamp NULL,
  `comsignTime` timestamp NULL,
  `cussignTime` timestamp NULL,
  `filingTime` timestamp NULL,
  `status` tinyint(1) NULL DEFAULT 0,
  `noticeStatus` tinyint(1) NULL DEFAULT 1 COMMENT '客户须知确认状态:0-已确认,1-未确认',
  `ishow` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`dcid`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2644 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修合同表';

DROP TABLE IF EXISTS `decorationcontract1`;
CREATE TABLE `decorationcontract1` (
  `autoId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `additionalInfo` varchar(2048) NULL COMMENT '附加条款信息',
  `templateHtml` varchar(100) NULL COMMENT '合同模板路径',
  `signTime` timestamp NULL COMMENT '签订时间',
  `workingDuration` int(11) NULL COMMENT '工期',
  `startTime` timestamp NULL COMMENT '开工时间',
  `endTime` timestamp NULL COMMENT '竣工时间',
  `contractCode` varchar(45) NULL COMMENT '合同编号',
  `orderTotalPrice` bigint(10) NULL DEFAULT 0,
  PRIMARY KEY (`autoId`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=432 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修合同表';

DROP TABLE IF EXISTS `decorationfunction`;
CREATE TABLE `decorationfunction` (
  `dfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL DEFAULT 0,
  `comment` varchar(255) NULL,
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dfid`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=gbk_chinese_ci ROW_FORMAT=Compact COMMENT='装修功能';

DROP TABLE IF EXISTS `decorationholonomy`;
CREATE TABLE `decorationholonomy` (
  `dhid` int(11) NOT NULL AUTO_INCREMENT COMMENT '半价ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `name` varchar(32) NULL COMMENT '名称',
  `maching` int(5) NOT NULL COMMENT '主材配比',
  `discount` int(5) NOT NULL COMMENT '订单折扣',
  `discountBase` bigint(10) NOT NULL DEFAULT 0,
  `projectBase` bigint(10) NOT NULL DEFAULT 0,
  `projectPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '工程总额',
  `originMaterialPrice` decimal(10,0) NOT NULL DEFAULT 0 COMMENT '原主材总额',
  `trafficRate` int(10) NOT NULL DEFAULT 0 COMMENT '车运费比例',
  `trafficDiscount` tinyint(1) NOT NULL DEFAULT 0 COMMENT '车运费折扣, 0: 不打折, 1: 打折',
  `managePrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '管理费',
  `manageRate` int(5) NOT NULL DEFAULT 0 COMMENT '管理费比例',
  `manageDiscount` tinyint(1) NOT NULL DEFAULT 0 COMMENT '管理费折扣',
  `taxRate` int(10) NOT NULL DEFAULT 0 COMMENT '税金比例',
  `taxDiscount` tinyint(1) NOT NULL DEFAULT 0 COMMENT '税金折扣, 0: 管理税金, 1: 总额税金',
  `materialPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '主材总额',
  `materialPaidup` bigint(10) NULL DEFAULT 0 COMMENT '实收主材额',
  `servicePrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '服务费',
  `serviceRate` int(5) NOT NULL DEFAULT 0 COMMENT '服务费比例',
  `servicePaidup` bigint(10) NULL DEFAULT 0 COMMENT '实收服务费',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`dhid`),
  UNIQUE KEY `uniqueone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=772 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单半价信息';

DROP TABLE IF EXISTS `decorationinclusive`;
CREATE TABLE `decorationinclusive` (
  `diid` int(11) NOT NULL AUTO_INCREMENT COMMENT '半价ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `contractPrice` bigint(10) NOT NULL COMMENT '合同额',
  `projectPrice` bigint(10) NOT NULL COMMENT '工程总额',
  `cdiff` bigint(10) NULL DEFAULT 0 COMMENT '工程增项',
  `mdiff` bigint(10) NULL DEFAULT 0 COMMENT '主材增项',
  `managePrice` bigint(10) NOT NULL COMMENT '管理费',
  `manageRate` int(5) NOT NULL COMMENT '管理费比例',
  `materialPaidup` bigint(10) NULL DEFAULT 0 COMMENT '实收主材额',
  PRIMARY KEY (`diid`),
  KEY `indexone` (`orderId`) USING BTREE,
  UNIQUE KEY `uniqueone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单套餐信息';

DROP TABLE IF EXISTS `decorationinfo`;
CREATE TABLE `decorationinfo` (
  `diid` int(11) NOT NULL AUTO_INCREMENT COMMENT '信息ID',
  `orderId` varchar(15) NULL COMMENT '订单编号',
  `referOrderId` varchar(15) NULL,
  `notSalesmanName` varchar(20) NULL COMMENT '非业务员名',
  `notSalesmanPhone` varchar(45) NULL COMMENT '非业务员电话',
  `notSalesmanContent` varchar(100) NULL COMMENT '非业务员备注',
  `backOrderName` varchar(20) NULL COMMENT '返单人员名',
  `backOrderPhone` varchar(45) NULL COMMENT '返单人员电话',
  `backOrderContent` varchar(100) NULL COMMENT '返单人员备注',
  PRIMARY KEY (`diid`),
  UNIQUE KEY `uniqueone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4285 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单信息表';

DROP TABLE IF EXISTS `decorationmeasure`;
CREATE TABLE `decorationmeasure` (
  `dmid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL DEFAULT '',
  `applayTime` timestamp NULL COMMENT '申请时间',
  `content` varchar(255) NOT NULL COMMENT '说明',
  `actualTime` int(11) NULL COMMENT '量房时间',
  `startTime` timestamp NULL COMMENT '开始时间',
  `endTime` timestamp NULL COMMENT '结束时间',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '0: 排队, 1: 申请, 2: 成功, 3: 失败',
  `count` tinyint(1) NULL DEFAULT 0 COMMENT '申请次数',
  `apuid` int(11) unsigned NOT NULL COMMENT '申请人',
  `meuid` int(11) unsigned NOT NULL COMMENT '量尺人',
  `company` int(11) NOT NULL DEFAULT 0 COMMENT '公司ID',
  PRIMARY KEY (`dmid`),
  KEY `indexfou` (`apuid`) USING BTREE,
  UNIQUE KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexsix` (`meuid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修量尺信息';

DROP TABLE IF EXISTS `decorationmidpack`;
CREATE TABLE `decorationmidpack` (
  `dmid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(32) NULL DEFAULT '',
  `materialRate` int(5) NOT NULL DEFAULT 0 COMMENT '主材配比',
  `materialOrigin` bigint(10) NOT NULL DEFAULT 0 COMMENT '原主材额',
  `materialPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '主材额',
  `materialPaidup` bigint(10) NOT NULL DEFAULT 0 COMMENT '主材实付额',
  `serviceRate` int(5) NOT NULL DEFAULT 0 COMMENT '服务费配比',
  `servicePrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '服务费',
  `servicePaidup` bigint(10) NOT NULL DEFAULT 0 COMMENT '服务实付费',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`dmid`),
  UNIQUE KEY `uniqueone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=gbk_chinese_ci ROW_FORMAT=Compact COMMENT='装修半包信息表';

DROP TABLE IF EXISTS `decorationoperate`;
CREATE TABLE `decorationoperate` (
  `doid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `ouid` int(11) NULL COMMENT '操作人ID',
  `operateTime` timestamp NULL,
  `value` bigint(10) NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL COMMENT '12:预签',
  `status` tinyint(1) NOT NULL,
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '业务类型 (0:通用, 1:设计, 2:业务)',
  `buid` int(11) NULL COMMENT '归属人id 归属人id',
  `bdid` int(11) NULL COMMENT '归属部门id 归属部门id',
  `brid` int(11) NULL COMMENT '归属分区id 归属分区id',
  `rate` int(5) NOT NULL DEFAULT 1000 COMMENT '比例 比例',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`doid`),
  KEY `indexone` (`orderId`, `type`) USING BTREE,
  KEY `indextwo` (`operateTime`, `type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10211 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单操作';

DROP TABLE IF EXISTS `decorationpicture`;
CREATE TABLE `decorationpicture` (
  `dpId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(32) NOT NULL,
  `path` varchar(256) NOT NULL,
  `addpath` varchar(256) NULL DEFAULT '',
  `filesize` int(10) NULL DEFAULT 0 COMMENT '文件大小',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `uploadTime` timestamp NULL,
  `type` int(11) NOT NULL COMMENT '1 设计效果图 2、工程制图CAD',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `content` varchar(45) NULL,
  PRIMARY KEY (`dpId`),
  KEY `indexone` (`orderId`, `uploadTime`, `type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1702 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='设计图纸';

DROP TABLE IF EXISTS `decorationpicturerecord`;
CREATE TABLE `decorationpicturerecord` (
  `dprid` int(11) NOT NULL AUTO_INCREMENT,
  `dpid` int(11) NOT NULL COMMENT '合同文件ID',
  `ouid` int(11) NOT NULL COMMENT '操作人ID',
  `operateTime` timestamp NULL COMMENT '当前操作时间',
  PRIMARY KEY (`dprid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修合同文件操作记录表';

DROP TABLE IF EXISTS `decorationservice`;
CREATE TABLE `decorationservice` (
  `dsid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '订单编号',
  `name` varchar(32) NULL COMMENT '名称',
  `detail` varchar(64) NULL COMMENT '详述',
  `dsuid` int(11) NULL COMMENT '操作人',
  `fuid` int(11) NULL COMMENT '完成人ID',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `finishTime` timestamp NULL COMMENT '完成时间',
  `operateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `planTime` timestamp NULL COMMENT '计划时间',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态,0:初始,1:完成',
  `comment` varchar(128) NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`dsid`)
) ENGINE=InnoDB AUTO_INCREMENT=23128 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单服务表';

DROP TABLE IF EXISTS `decorationuser`;
CREATE TABLE `decorationuser` (
  `duid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `user` int(11) NOT NULL COMMENT '人员',
  `isShow` tinyint(1) NOT NULL DEFAULT 0 COMMENT '显示标识 , 0: 显示 , 1: 隐藏',
  `isPay` tinyint(1) NOT NULL DEFAULT 0 COMMENT '薪资标识 , 0: 无薪 , 1: 有薪',
  `content` varchar(64) NULL COMMENT '说明',
  PRIMARY KEY (`duid`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单人员表';
