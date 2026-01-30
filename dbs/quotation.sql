CREATE DATABASE IF NOT EXISTS `quotation`;
USE `quotation`;

-- Generated at 2026-01-06 08:11:04
-- Total tables: 43

DROP TABLE IF EXISTS `addreduce`;
CREATE TABLE `addreduce` (
  `arId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `dpId` int(11) NULL COMMENT '对应收款编号',
  `cnid` int(11) NOT NULL DEFAULT 0 COMMENT '施工节点 , 包括: 0(初始) , 1(开工) , 2(完工)',
  `type` tinyint(1) NOT NULL COMMENT '0 增项 1 减项 2 漏项',
  `atttype` tinyint(1) NOT NULL DEFAULT 0,
  `paytype` tinyint(1) NOT NULL DEFAULT 0,
  `total` bigint(10) NOT NULL,
  `undisPrice` bigint(10) NOT NULL DEFAULT 0,
  `disPrice` bigint(10) NOT NULL DEFAULT 0,
  `uncalPrice` bigint(10) NOT NULL DEFAULT 0,
  `calPrice` bigint(10) NOT NULL DEFAULT 0,
  `managePrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '管理费',
  `manageRate` int(5) NOT NULL DEFAULT 0 COMMENT '管理费比例',
  `manageDiscount` tinyint(1) NOT NULL DEFAULT 0 COMMENT '管理费折扣',
  `taxRate` int(11) NOT NULL DEFAULT 0 COMMENT '税金比例',
  `taxDiscount` tinyint(11) NOT NULL DEFAULT 0 COMMENT '税金折扣',
  `taxPrice` bigint(20) NOT NULL DEFAULT 0 COMMENT '税金',
  `consPrice` int(10) NOT NULL DEFAULT 0,
  `comsPrice` bigint(10) NULL DEFAULT 0 COMMENT '主材总额',
  `discount` int(8) NOT NULL DEFAULT 0,
  `accountDiscount` int(8) NULL DEFAULT 0 COMMENT '决算折扣',
  `accountManageDiscount` int(8) NULL DEFAULT 0,
  `accountTaxDiscount` int(8) NULL DEFAULT 0,
  `schedule` tinyint(1) NOT NULL COMMENT '进度 , 对应装修单状态',
  `status` tinyint(1) NOT NULL COMMENT '0 未提交 1、已提交/未付款 2、已付款 3、已确认  ',
  `isAffirm` tinyint(1) NOT NULL COMMENT '0、 未确认 1、客户确认',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(256) NOT NULL,
  `confirmTime` timestamp NULL COMMENT '确认时间',
  `sendTime` timestamp NULL COMMENT '推送时间',
  `affirmTime` timestamp NULL COMMENT '确认时间',
  PRIMARY KEY (`arId`),
  KEY `indexfor` (`sendTime`) USING BTREE,
  KEY `indexone` (`orderId`, `type`, `status`) USING BTREE,
  KEY `indextwo` (`dpId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2918 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='增减项表';

DROP TABLE IF EXISTS `addreduceitem`;
CREATE TABLE `addreduceitem` (
  `ariId` bigint(20) NOT NULL AUTO_INCREMENT,
  `arId` int(11) NOT NULL COMMENT '增减项编号',
  `itemName` varchar(128) NOT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0报价项 , 1自定义报价项目',
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1工程,2主材',
  `itemtype` tinyint(4) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `addPrice` int(8) NOT NULL DEFAULT 0,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `subPrice` int(8) NOT NULL DEFAULT 0,
  `discount` tinyint(1) NOT NULL DEFAULT 0,
  `initnum` int(8) NOT NULL DEFAULT 0 COMMENT '初始量',
  `num` int(8) NOT NULL DEFAULT 0,
  `quotationFunctionAreaId` bigint(20) NOT NULL COMMENT '所属报价功能区编号',
  `quoteItemId` bigint(20) NULL DEFAULT 0,
  `qiid` int(11) NULL DEFAULT 0,
  `content` varchar(512) NULL,
  `index` int(11) NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`ariId`),
  KEY `indexone` (`arId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6222 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='增减项目';

DROP TABLE IF EXISTS `extension`;
CREATE TABLE `extension` (
  `eId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `qid` int(11) NOT NULL DEFAULT 0 COMMENT '报价单ID',
  `type` tinyint(1) NOT NULL,
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '业务类型 , 0: 通用, 1: 置换',
  `undisPrice` bigint(10) NOT NULL DEFAULT 0,
  `disPrice` bigint(10) NOT NULL DEFAULT 0,
  `manageRate` bigint(10) NOT NULL DEFAULT 0 COMMENT '管理费比例',
  `manageDiscount` tinyint(1) NOT NULL DEFAULT 0 COMMENT '管理费折扣 , 0: 不打折 , 1: 打折',
  `managePrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '管理费',
  `taxRate` int(11) NULL DEFAULT 0 COMMENT '税金比例',
  `taxPrice` int(11) NULL DEFAULT 0 COMMENT '税金',
  `consPrice` bigint(20) NULL DEFAULT 0 COMMENT '工程总额',
  `comsPrice` bigint(10) NULL DEFAULT 0 COMMENT '主材总额',
  `total` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `cuid` int(11) NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `content` varchar(256) NOT NULL,
  PRIMARY KEY (`eId`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1253 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='拓展项';

DROP TABLE IF EXISTS `extensionitem`;
CREATE TABLE `extensionitem` (
  `eiId` int(11) NOT NULL AUTO_INCREMENT,
  `eId` int(11) NOT NULL,
  `itemName` varchar(128) NOT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0扩展项增项,1增项自定义,2扩展项减项,3减项自定义',
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1工程,2主材',
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `discount` tinyint(1) NOT NULL DEFAULT 0,
  `addPrice` int(8) NOT NULL DEFAULT 0,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `subPrice` int(8) NOT NULL DEFAULT 0,
  `initnum` int(8) NOT NULL DEFAULT 0 COMMENT '初始量',
  `num` int(8) NOT NULL DEFAULT 0,
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quoteItemId` int(11) NOT NULL,
  `qiid` int(11) NULL,
  `content` varchar(512) NULL,
  PRIMARY KEY (`eiId`),
  KEY `indexone` (`eId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2630 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='拓展项目';

DROP TABLE IF EXISTS `functionarea`;
CREATE TABLE `functionarea` (
  `faId` bigint(20) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `versionId` varchar(11) NOT NULL,
  `functionAreaOrder` int(11) NOT NULL,
  `functionAreaType` varchar(10) NOT NULL DEFAULT '普通' COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态, 0(启用)/1(禁用)',
  PRIMARY KEY (`faId`),
  KEY `indexone` (`no`, `versionId`, `functionAreaType`, `functionAreaOrder`) USING BTREE,
  KEY `indextwo` (`versionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=386 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='功能区表';

DROP TABLE IF EXISTS `functionareaquoteitem`;
CREATE TABLE `functionareaquoteitem` (
  `faiId` int(11) NOT NULL AUTO_INCREMENT,
  `functionAreaId` int(11) NOT NULL,
  `quoteItemId` int(11) NOT NULL,
  `formula` varchar(64) NULL DEFAULT '',
  `sort` int(11) NULL DEFAULT 1,
  PRIMARY KEY (`faiId`),
  KEY `indexone` (`functionAreaId`, `quoteItemId`) USING BTREE,
  KEY `indextwo` (`quoteItemId`, `functionAreaId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1687 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='功能区报价项关联表';

DROP TABLE IF EXISTS `newtable`;
CREATE TABLE `newtable` (
  `qfapid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `qfaid` int(11) NOT NULL COMMENT '功能区ID',
  `girth` int(8) NULL COMMENT '周长',
  `area` int(8) NULL COMMENT '面积',
  `height` int(8) NULL COMMENT '举架',
  `holeLength` int(8) NULL COMMENT '洞长',
  `holeHeight` int(8) NULL COMMENT '洞高',
  `windowLength` int(8) NULL COMMENT '窗长',
  `windowHeight` int(8) NULL COMMENT '窗高',
  `beamLength` int(8) NULL COMMENT '梁长',
  `beamHeight` int(8) NULL COMMENT '梁高',
  PRIMARY KEY (`qfapid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程区参数';

DROP TABLE IF EXISTS `normooditem`;
CREATE TABLE `normooditem` (
  `ngiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '定额材料ID',
  `qid` int(11) NOT NULL COMMENT '报价ID',
  `sid` int(11) NULL COMMENT '引用ID, 包括报价/拓展/增减',
  `areald` int(11) NULL COMMENT '功能区ID',
  `quoteld` int(11) NULL COMMENT '引用项ID',
  `qiid` int(11) NULL COMMENT '报价项ID',
  `ngid` int(11) NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL COMMENT '类型, 0:报价,1:拓展,2:增减',
  `normtype` tinyint(1) NOT NULL COMMENT '定额类型, 0:材料, 1:打包',
  `atttype` tinyint(1) NOT NULL COMMENT '业务类型, 0:收款, 1:出款',
  `gid` int(11) NULL COMMENT '商品类型',
  `nid` int(11) NULL COMMENT '定材id',
  `normunit` varchar(15) NOT NULL COMMENT '定额单位',
  `normnum` int(11) NOT NULL COMMENT '定额数量',
  `storeunit` varchar(11) NOT NULL COMMENT '库房单位',
  `storenum` int(11) NOT NULL COMMENT '库房数量',
  `status` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`ngiid`)
) ENGINE=InnoDB AUTO_INCREMENT=2016 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `normriceitem`;
CREATE TABLE `normriceitem` (
  `npiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '定额工费ID',
  `qid` int(11) NOT NULL COMMENT '报价ID',
  `sid` int(11) NULL COMMENT '引用ID , 包括报价/拓展/增减',
  `areald` int(11) NULL COMMENT '功能区ID',
  `quoteld` int(11) NULL COMMENT '引用项ID',
  `qiid` int(11) NULL COMMENT '报价项ID',
  `npid` int(11) NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型, 0:报价,1:拓展,2:增减',
  `normtype` tinyint(1) NOT NULL COMMENT '定额类型, 0:工费,1:附加',
  `atttype` tinyint(1) NOT NULL COMMENT '业务类型, 0:收款,1:出款',
  `cnid` int(11) NOT NULL COMMENT '施工节点, 类型',
  `name` varchar(64) NULL DEFAULT '',
  `unit` varchar(15) NULL COMMENT '单位',
  `trannum` int(11) NOT NULL COMMENT '转换量',
  `salary` int(11) NOT NULL COMMENT '薪资',
  `num` int(11) NULL COMMENT '数量',
  `status` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`npiid`)
) ENGINE=InnoDB AUTO_INCREMENT=2716 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `normtion`;
CREATE TABLE `normtion` (
  `nid` int(11) NOT NULL AUTO_INCREMENT COMMENT '报价定额id',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `qid` int(11) NOT NULL COMMENT '报价id',
  `moodTotal` int(11) NOT NULL DEFAULT 0 COMMENT '材料总额',
  `mriceTotal` int(11) NOT NULL DEFAULT 0 COMMENT '工费总额',
  `moodPrintNum` int(11) NOT NULL DEFAULT 0 COMMENT '材料打印次数',
  `mricePriceNum` int(11) NOT NULL DEFAULT 0 COMMENT '工费打印次数',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `createTime` timestamp NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  PRIMARY KEY (`nid`)
) ENGINE=InnoDB AUTO_INCREMENT=752 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `presigncost`;
CREATE TABLE `presigncost` (
  `pcid` int(11) NOT NULL AUTO_INCREMENT COMMENT '成本ID',
  `ppid` int(11) NULL COMMENT '预签ID',
  `toplimit` int(10) NOT NULL COMMENT '上限面积',
  `lowlimit` int(10) NOT NULL COMMENT '下限面积',
  `costPrice` int(11) NOT NULL COMMENT '成本单价',
  PRIMARY KEY (`pcid`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `presignitem`;
CREATE TABLE `presignitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT,
  `ppid` int(11) NOT NULL COMMENT '预签产品ID',
  `name` varchar(256) NOT NULL COMMENT '名称',
  `basicNum` int(11) NOT NULL,
  `cost` int(10) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0 COMMENT '价格',
  `addPrice` int(11) NOT NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(11) NOT NULL DEFAULT 0 COMMENT '退减价',
  `achePrice` int(11) NOT NULL DEFAULT 0 COMMENT '业绩',
  `areaCale` int(11) NULL DEFAULT 0 COMMENT '面积规则 , 0: 数量 , 1: 面积',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '类型 , 0: 基础 , 1: 工程 , 2: 主材',
  `onetype` int(11) NOT NULL COMMENT '状态, 0: 普通 , 1: 标配',
  `atttype` int(11) NULL DEFAULT 0 COMMENT '业务类型 , 0: 通用 , 1: 工程 , 2: 主材',
  `status` int(11) NOT NULL COMMENT '状态 , 0: 启用 , 1: 禁用',
  `content` varchar(512) NULL COMMENT '说明',
  PRIMARY KEY (`piid`)
) ENGINE=InnoDB AUTO_INCREMENT=458 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `presignprice`;
CREATE TABLE `presignprice` (
  `pspid` int(11) NOT NULL AUTO_INCREMENT,
  `ppid` int(11) NULL COMMENT '预签产品ID',
  `name` varchar(256) NULL COMMENT '名称',
  `upperArea` int(11) NULL COMMENT '起始面积',
  `lowerArea` int(11) NULL COMMENT '终止面积',
  `price` int(11) NULL COMMENT '价格',
  `costPrice` int(11) NULL DEFAULT 0 COMMENT '工程成本',
  `mostPrice` int(11) NULL DEFAULT 0 COMMENT '主材成本',
  `activityPrice` int(11) NULL DEFAULT 0 COMMENT '浮动额(活动额)',
  `status` int(11) NULL DEFAULT 0 COMMENT '状态',
  PRIMARY KEY (`pspid`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `presignproduce`;
CREATE TABLE `presignproduce` (
  `ppid` int(11) NOT NULL AUTO_INCREMENT COMMENT '预签产品ID',
  `qvid` int(11) NULL COMMENT '报价版本ID',
  `name` varchar(256) NULL COMMENT '名称',
  `quotePrice` int(11) NULL COMMENT '起报价',
  `quoteArea` int(11) NULL COMMENT '起报面积',
  `unitPrice` int(10) NULL,
  `discount` int(11) NULL DEFAULT 1000 COMMENT '折扣',
  `discountt` int(10) NULL DEFAULT 0 COMMENT '二级折扣',
  `manageRate` int(11) NULL DEFAULT 0 COMMENT '管理费比例',
  `manageFormula` varchar(64) NULL COMMENT '管理费公式',
  `manageDiscount` int(8) NULL DEFAULT 0 COMMENT '管理费折扣',
  `manageDiscountt` int(10) NULL DEFAULT 0 COMMENT '二级管理费折扣',
  `taxRate` int(11) NULL DEFAULT 0 COMMENT '税金比例',
  `taxFormula` varchar(64) NULL COMMENT '税金公式',
  `costPrice` int(11) NULL COMMENT '成本单价',
  `profitRate` int(11) NULL COMMENT '利润率',
  `offset` int(11) NULL COMMENT '偏移量',
  `status` int(11) NULL COMMENT '状态 , 0: 初始 , 1: 发布',
  `company` int(11) NULL COMMENT '公司',
  `preferPrice` int(11) NULL COMMENT '优惠金额',
  `mostPrice` int(11) NULL COMMENT '主材成本',
  `costRate` int(11) NULL COMMENT '工程增项成本比例',
  `mostRate` int(11) NULL COMMENT '主材增项成本比例',
  `activityPrice` int(11) NULL DEFAULT 0 COMMENT '浮动额(活动额)',
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `protation`;
CREATE TABLE `protation` (
  `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '预签ID',
  `ppid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(36) NOT NULL COMMENT '名称',
  `product` varchar(255) NULL DEFAULT '' COMMENT '预签产品名称',
  `qvid` int(11) NULL COMMENT '报价版本ID',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `quotePrice` int(10) NOT NULL DEFAULT 0 COMMENT '起报价',
  `quoteArea` int(8) NOT NULL DEFAULT 0 COMMENT '起报面积',
  `preferPrice` int(11) NULL DEFAULT 0 COMMENT '优惠金额',
  `manageFormula` varchar(64) NULL COMMENT '管理费公式',
  `manageDiscount` int(8) NULL DEFAULT 0 COMMENT '管理费折扣',
  `manageRate` int(11) NULL DEFAULT 0 COMMENT '管理费比例',
  `managePrice` int(11) NULL COMMENT '管理费',
  `taxFormula` varchar(64) NULL COMMENT '税金公式',
  `taxRate` int(11) NULL DEFAULT 0 COMMENT '税金比例',
  `taxPrice` int(11) NULL DEFAULT 0 COMMENT '税金',
  `mostPrice` int(11) NULL COMMENT '主材成本',
  `costRate` int(11) NULL COMMENT '工程增项成本比例',
  `mostRate` int(11) NULL COMMENT '主材增项成本比例',
  `totalCost` int(11) NULL COMMENT '成本总额',
  `totalProfit` int(11) NULL COMMENT '利润总额',
  `manageProfit` int(11) NULL DEFAULT 0 COMMENT '管理优惠',
  `advanceProfit` int(11) NULL DEFAULT 0 COMMENT '特殊优惠',
  `activityPrice` int(11) NULL DEFAULT 0 COMMENT '浮动额(活动额)',
  `activityProfit` int(11) NULL DEFAULT 0 COMMENT '活动优惠',
  `discount` int(11) NULL DEFAULT 1000 COMMENT '折扣',
  `costPrice` int(10) NOT NULL DEFAULT 0 COMMENT '成本单价',
  `unitPrice` int(10) NOT NULL DEFAULT 0,
  `profitRate` int(10) NOT NULL DEFAULT 0 COMMENT '利润率',
  `basicPrice` int(10) NOT NULL DEFAULT 0 COMMENT '基础额',
  `comdPrice` int(10) NOT NULL DEFAULT 0 COMMENT '工程额',
  `commPrice` int(10) NOT NULL DEFAULT 0 COMMENT '主材额',
  `adddPrice` int(10) NOT NULL DEFAULT 0 COMMENT '增工额',
  `addmPrice` int(10) NOT NULL DEFAULT 0 COMMENT '增主额',
  `subdPrice` int(10) NOT NULL DEFAULT 0 COMMENT '减工额',
  `submPrice` int(10) NOT NULL DEFAULT 0 COMMENT '减主额',
  `subcPrice` int(10) NOT NULL DEFAULT 0 COMMENT '减通额',
  `accdPrice` int(11) NULL DEFAULT 0 COMMENT '赋工额',
  `accmPrice` int(11) NULL DEFAULT 0 COMMENT '赋主额',
  `totalPrice` int(10) NOT NULL DEFAULT 0 COMMENT '总额',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态,0:初始',
  `defaults` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态,0:非默认, 1:默认',
  `comment` varchar(36) NULL COMMENT '备注',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1674 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='预签单表';

DROP TABLE IF EXISTS `protationcost`;
CREATE TABLE `protationcost` (
  `pcid` int(11) NOT NULL AUTO_INCREMENT COMMENT '成本ID',
  `pid` int(11) NULL COMMENT '预签ID',
  `toplimit` int(10) NOT NULL COMMENT '上限面积',
  `lowlimit` int(10) NOT NULL COMMENT '下限面积',
  `costPrice` int(11) NOT NULL COMMENT '成本单价',
  PRIMARY KEY (`pcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1115 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `protationitem`;
CREATE TABLE `protationitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT COMMENT '预签项ID',
  `pid` int(11) NOT NULL,
  `ppiid` int(11) NULL DEFAULT 0 COMMENT '产品项ID',
  `name` varchar(36) NOT NULL COMMENT '名称',
  `basicNum` int(8) NOT NULL DEFAULT 0 COMMENT '起报价',
  `cost` int(10) NOT NULL DEFAULT 0,
  `price` int(10) NOT NULL DEFAULT 0 COMMENT '起报面积',
  `num` int(8) NOT NULL DEFAULT 0 COMMENT '成本单价',
  `addPrice` int(11) NOT NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(11) NOT NULL DEFAULT 0 COMMENT '退减价',
  `achePrice` int(11) NOT NULL DEFAULT 0 COMMENT '业绩',
  `areaCale` int(11) NULL DEFAULT 0 COMMENT '面积规则 , 0: 数量 , 1: 面积',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型, 0: 础,1:工程,2:主材,3:增工,4:增主,5:减工,6:减主',
  `onetype` tinyint(1) NOT NULL DEFAULT 0 COMMENT ' 一类 , 0: 标准 , 1: 标配',
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '业务类型 , 0: 通用 , 1: 工程 , 2: 主材',
  PRIMARY KEY (`piid`)
) ENGINE=InnoDB AUTO_INCREMENT=13060 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='预签项表';

DROP TABLE IF EXISTS `quotation`;
CREATE TABLE `quotation` (
  `qId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(64) NOT NULL,
  `style` varchar(10) NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `qvid` int(11) NULL COMMENT '版本ID',
  `basePrice` int(8) NOT NULL DEFAULT 0 COMMENT '基数, 满减类型计算参数',
  `undisPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '折前总价',
  `disPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '折前折扣总价',
  `discount` bigint(10) NOT NULL DEFAULT 10000,
  `totalPrice` bigint(10) NULL DEFAULT 0,
  `costPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '成本费用,项目类型为5(成本)',
  `unachePrice` bigint(10) NULL DEFAULT 0 COMMENT '非业绩总额',
  `consPrice` bigint(10) NULL DEFAULT 0 COMMENT '工程总额',
  `comsPrice` bigint(10) NULL DEFAULT 0 COMMENT '主材总额',
  `undisComPrice` bigint(20) NULL DEFAULT 0 COMMENT '综合不打折总额',
  `disComPrice` bigint(20) NULL DEFAULT 0 COMMENT '综合打折总额',
  `managePrice` bigint(10) NULL DEFAULT 0,
  `manageRate` int(5) NULL DEFAULT 0,
  `manageDiscount` tinyint(10) NOT NULL DEFAULT 0,
  `trafficPrice` bigint(10) NULL DEFAULT 0,
  `trafficRate` int(5) NOT NULL DEFAULT 0 COMMENT '车运费比例',
  `trafficDiscount` tinyint(10) NOT NULL DEFAULT 0,
  `taxPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '税金',
  `taxRate` int(10) NOT NULL DEFAULT 0 COMMENT '税金比例',
  `taxDiscount` tinyint(10) NOT NULL DEFAULT 0 COMMENT '税金折扣',
  `defaults` tinyint(1) NOT NULL DEFAULT 0 COMMENT '默认, 0 非默认 ,1 默认',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0 启用, 1 禁用',
  `attstatus` tinyint(1) NULL DEFAULT 0 COMMENT '业务状态：0初始，1制作，2审批，3完成',
  `createTime` timestamp NULL,
  `updateTime` timestamp NULL COMMENT '更新时间',
  `lockTime` timestamp NULL COMMENT '锁定时间',
  `finishTime` timestamp NULL COMMENT '完成时间',
  `workTime` int(10) NULL DEFAULT 0 COMMENT '制作记时',
  `auditTime` int(10) NULL DEFAULT 0 COMMENT '审核记时',
  `content` varchar(45) NULL,
  `index` tinyint(10) NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qId`),
  KEY `indexone` (`orderId`, `createTime`, `defaults`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5423 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价表';

DROP TABLE IF EXISTS `quotationctem`;
CREATE TABLE `quotationctem` (
  `qcid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '公共项ID',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `pinyin` varchar(32) NULL DEFAULT '' COMMENT '拼音',
  `quotationTypeId` int(11) NULL COMMENT '类型',
  `quotationClassificationId` int(11) NULL COMMENT '类别',
  `quotationBigCategoryId` int(11) NULL COMMENT '大类',
  `quotationSmallCategoryId` int(11) NULL COMMENT '小类',
  `measurementUnitId` int(11) NULL COMMENT '单位',
  `workTypeId` int(11) NULL COMMENT '工种',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '业务',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 启用 , 1: 禁用',
  PRIMARY KEY (`qcid`)
) ENGINE=InnoDB AUTO_INCREMENT=557 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='公共项';

DROP TABLE IF EXISTS `quotationformat`;
CREATE TABLE `quotationformat` (
  `qfid` int(11) NOT NULL AUTO_INCREMENT COMMENT '规格ID',
  `qcid` int(11) NOT NULL COMMENT '项目ID',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `format` varchar(64) NOT NULL COMMENT '规格',
  `pinyin` varchar(64) NOT NULL COMMENT '拼音',
  `price` int(11) NULL COMMENT '价格',
  `unit` int(11) NULL COMMENT '单位',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 启用 , 1: 禁用',
  PRIMARY KEY (`qfid`)
) ENGINE=InnoDB AUTO_INCREMENT=915 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `quotationfunction`;
CREATE TABLE `quotationfunction` (
  `qfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `group` tinyint(1) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) NULL,
  PRIMARY KEY (`qfid`)
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `quotationfunctionarea`;
CREATE TABLE `quotationfunctionarea` (
  `qfaId` bigint(20) NOT NULL AUTO_INCREMENT,
  `quotationId` bigint(20) NOT NULL,
  `functionAreaName` varchar(10) NOT NULL,
  `functionAreaOrder` int(11) NULL,
  `functionAreaType` varchar(10) NULL COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `index` tinyint(3) NOT NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qfaId`),
  KEY `indexone` (`quotationId`, `functionAreaOrder`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19542 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区';

DROP TABLE IF EXISTS `quotationfunctionarea0`;
CREATE TABLE `quotationfunctionarea0` (
  `qfaId` bigint(20) NOT NULL AUTO_INCREMENT,
  `quotationId` bigint(20) NOT NULL,
  `functionAreaName` varchar(10) NOT NULL,
  `functionAreaOrder` int(11) NULL,
  `functionAreaType` varchar(10) NULL COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `index` tinyint(3) NOT NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qfaId`),
  KEY `indexone` (`quotationId`, `functionAreaOrder`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16011 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区表';

DROP TABLE IF EXISTS `quotationfunctionareaitem`;
CREATE TABLE `quotationfunctionareaitem` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `addPrice` int(8) NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(8) NULL DEFAULT 0 COMMENT '退减价',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `num` int(8) NOT NULL DEFAULT 0,
  `discount` tinyint(4) NOT NULL DEFAULT 1,
  `type` tinyint(4) NOT NULL,
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` bigint(20) NOT NULL,
  `quotationItemId` bigint(20) NULL,
  `content` varchar(256) NULL,
  `index` int(11) NOT NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`) USING BTREE,
  KEY `indextwo` (`quotationItemId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17542 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem0`;
CREATE TABLE `quotationfunctionareaitem0` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `index` int(11) NOT NULL DEFAULT 0 COMMENT '索引',
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `addPrice` int(8) NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(8) NULL DEFAULT 0 COMMENT '退减价',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT 0,
  `discount` tinyint(4) NOT NULL DEFAULT 1,
  `type` tinyint(4) NOT NULL,
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` bigint(20) NOT NULL,
  `quotationItemId` bigint(20) NULL,
  `content` varchar(256) NULL,
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`) USING BTREE,
  KEY `indextwo` (`quotationItemId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=42750 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem1`;
CREATE TABLE `quotationfunctionareaitem1` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `addPrice` int(8) NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(8) NULL DEFAULT 0 COMMENT '退减价',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT 0 COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT 0,
  `discount` tinyint(4) NOT NULL DEFAULT 1,
  `type` tinyint(4) NOT NULL,
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` bigint(20) NOT NULL,
  `quotationItemId` bigint(20) NULL,
  `content` varchar(256) NULL,
  `index` int(11) NOT NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`) USING BTREE,
  KEY `indextwo` (`quotationItemId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14778 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem2`;
CREATE TABLE `quotationfunctionareaitem2` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `addPrice` int(8) NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(8) NULL DEFAULT 0 COMMENT '退减价',
  `formula` varchar(128) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT 0 COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT 0,
  `discount` tinyint(4) NOT NULL DEFAULT 1,
  `type` tinyint(4) NOT NULL,
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` bigint(20) NOT NULL,
  `quotationItemId` bigint(20) NULL,
  `quotationRtemId` varchar(255) NULL COMMENT '关联项ID',
  `content` varchar(256) NULL,
  `index` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`) USING BTREE,
  KEY `indextwo` (`quotationItemId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20015 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem3`;
CREATE TABLE `quotationfunctionareaitem3` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `addPrice` int(8) NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(8) NULL DEFAULT 0 COMMENT '退减价',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT 0 COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT 0,
  `discount` tinyint(4) NOT NULL DEFAULT 1,
  `type` tinyint(4) NOT NULL,
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` bigint(20) NOT NULL,
  `quotationItemId` bigint(20) NULL,
  `content` varchar(256) NULL,
  `index` int(11) NOT NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`) USING BTREE,
  KEY `indextwo` (`quotationItemId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaitem4`;
CREATE TABLE `quotationfunctionareaitem4` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `addPrice` int(8) NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(8) NULL DEFAULT 0 COMMENT '退减价',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT 0 COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT 0,
  `discount` tinyint(4) NOT NULL DEFAULT 1,
  `type` tinyint(4) NOT NULL,
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` bigint(20) NOT NULL,
  `quotationItemId` bigint(20) NULL,
  `content` varchar(256) NULL,
  `index` int(11) NOT NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`) USING BTREE,
  KEY `indextwo` (`quotationItemId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationfunctionareaparam`;
CREATE TABLE `quotationfunctionareaparam` (
  `qfapid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `qfaid` int(11) NOT NULL COMMENT '功能区ID',
  `girth` int(8) NULL COMMENT '周长',
  `area` int(8) NULL COMMENT '面积',
  `height` int(8) NULL COMMENT '举架',
  `holeLength` int(8) NULL COMMENT '洞长',
  `holeHeight` int(8) NULL COMMENT '洞高',
  `windowLength` int(8) NULL COMMENT '窗长',
  `windowHeight` int(8) NULL COMMENT '窗高',
  `beamLength` int(8) NULL COMMENT '梁长',
  `beamHeight` int(8) NULL COMMENT '梁高',
  PRIMARY KEY (`qfapid`)
) ENGINE=InnoDB AUTO_INCREMENT=868 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程区参数';

DROP TABLE IF EXISTS `quotationitem`;
CREATE TABLE `quotationitem` (
  `qiid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NULL DEFAULT '',
  `name` varchar(128) NOT NULL,
  `alias` varchar(128) NOT NULL DEFAULT '' COMMENT '别名',
  `qvid` int(11) NULL DEFAULT 0 COMMENT '版本id',
  `versionId` varchar(11) NOT NULL,
  `quotationTypeId` int(11) NOT NULL,
  `quotationClassificationId` int(11) NOT NULL,
  `quotationBigCategoryId` int(11) NOT NULL,
  `quotationSmallCategoryId` int(11) NOT NULL,
  `measurementUnitId` int(11) NOT NULL,
  `workTypeId` int(11) NOT NULL,
  `quotationCtemId` int(11) NULL COMMENT '公共项',
  `formula` varchar(64) NULL COMMENT '公式',
  `addPrice` int(8) NULL DEFAULT 0,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `subPrice` int(8) NULL DEFAULT 0,
  `cost` int(8) NOT NULL DEFAULT 0 COMMENT '成本',
  `achePrice` int(8) NOT NULL DEFAULT 0 COMMENT '业绩额',
  `discount` tinyint(4) NOT NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `isrtem` tinyint(1) NULL DEFAULT 0,
  `rtemFlag` varchar(128) NULL DEFAULT '',
  `comment` varchar(512) NOT NULL,
  PRIMARY KEY (`qiid`),
  KEY `indexone` (`no`, `versionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12072 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价项目表';

DROP TABLE IF EXISTS `quotationlabel`;
CREATE TABLE `quotationlabel` (
  `qlid` int(11) NOT NULL AUTO_INCREMENT COMMENT '报价标签ID',
  `name` varchar(32) NOT NULL COMMENT '名称',
  PRIMARY KEY (`qlid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价标签表';

DROP TABLE IF EXISTS `quotationpicture`;
CREATE TABLE `quotationpicture` (
  `qpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `qid` int(11) NULL COMMENT '报价单ID',
  `areaId` int(11) NULL DEFAULT 0 COMMENT '功能区id',
  `areaName` varchar(10) NULL COMMENT '功能区名字',
  `bid` int(11) NULL COMMENT '品牌ID',
  `qiid` int(11) NULL COMMENT '报价项ID',
  `name` varchar(64) NULL COMMENT '名称',
  `path` varchar(255) NOT NULL COMMENT '路径',
  `filesize` int(10) NULL DEFAULT 0 COMMENT '大小',
  `type` tinyint(1) NOT NULL COMMENT '类型 1.选材',
  `atttype` tinyint(1) NULL DEFAULT 0,
  `cuid` int(11) NOT NULL COMMENT '创建人id',
  `createTime` timestamp NULL COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  PRIMARY KEY (`qpid`),
  KEY `indexone` (`qid`) USING BTREE,
  KEY `indextwo` (`qiid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价图片';

DROP TABLE IF EXISTS `quotationprefer`;
CREATE TABLE `quotationprefer` (
  `qpid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `qid` int(11) NOT NULL COMMENT '报价ID',
  `ppid` int(11) NULL DEFAULT 0 COMMENT '预签产品ID',
  `preferPrice` int(11) NULL DEFAULT 0 COMMENT '优惠',
  `managePrefer` int(11) NULL DEFAULT 0 COMMENT '管理优惠',
  `advancePrefer` int(11) NULL DEFAULT 0 COMMENT '特殊优惠',
  `discount` int(11) NULL DEFAULT 0 COMMENT '折扣',
  `manageDiscount` int(11) NULL DEFAULT 0 COMMENT '管理折扣',
  `quotePrice` int(11) NULL DEFAULT 0 COMMENT '起报价',
  `quoteArea` int(11) NULL DEFAULT 0 COMMENT '计价面积',
  `redo` tinyint(1) NULL DEFAULT 0 COMMENT '重做：0.未换设计1.换设计',
  `urgent` tinyint(1) NULL DEFAULT 0 COMMENT '加急：0.客户在店1.提前完成',
  `drawing` tinyint(1) NULL DEFAULT 0 COMMENT '图纸',
  PRIMARY KEY (`qpid`)
) ENGINE=InnoDB AUTO_INCREMENT=457 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价优惠表';

DROP TABLE IF EXISTS `quotationprice`;
CREATE TABLE `quotationprice` (
  `qpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '价格ID',
  `qiid` int(11) NOT NULL COMMENT '报价项ID',
  `addPrice` int(11) NOT NULL COMMENT '增补价',
  `unitPrice` int(11) NOT NULL COMMENT '单价',
  `subPrice` int(11) NOT NULL COMMENT '退减价',
  `createTime` timestamp NULL COMMENT '创建时间',
  `updateTime` timestamp NULL COMMENT '更新时间',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 启用 , 1: 禁用',
  PRIMARY KEY (`qpid`)
) ENGINE=InnoDB AUTO_INCREMENT=8483 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='价格';

DROP TABLE IF EXISTS `quotationrecord`;
CREATE TABLE `quotationrecord` (
  `qrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `sid` int(11) NOT NULL COMMENT '预签单ID/报价单ID/扩展单ID/增减单ID',
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0(预签) , 1(报价) , 2(扩展) , 3(增减)',
  `comment` varchar(45) NULL COMMENT '说明',
  PRIMARY KEY (`qrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `quotationrefund`;
CREATE TABLE `quotationrefund` (
  `qrid` int(10) NOT NULL AUTO_INCREMENT COMMENT '报退单ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单ID',
  `qid` int(10) NOT NULL COMMENT '报价单ID',
  `qvid` int(10) NOT NULL COMMENT '报价版本ID',
  `cuid` int(10) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `totalPrice` bigint(20) NOT NULL COMMENT '总价',
  `content` varchar(45) NOT NULL COMMENT '说明',
  PRIMARY KEY (`qrid`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报退单';

DROP TABLE IF EXISTS `quotationrefunditem`;
CREATE TABLE `quotationrefunditem` (
  `qriid` int(10) NOT NULL AUTO_INCREMENT COMMENT '报退项ID',
  `qrid` int(10) NOT NULL COMMENT '报退单ID',
  `qfaid` int(10) NOT NULL COMMENT '报价功能区ID',
  `qiid` int(10) NULL COMMENT '数据报价项ID',
  `itemName` varchar(200) NOT NULL COMMENT '名称',
  `measurementUnit` varchar(15) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `unitPrice` bigint(20) NOT NULL COMMENT '单价',
  `addPrice` bigint(20) NOT NULL COMMENT '增补价',
  `subPrice` bigint(20) NOT NULL COMMENT '退减价',
  `formula` varchar(15) NOT NULL COMMENT '报退项公式',
  `initNum` int(10) NOT NULL COMMENT '默认工程量',
  `num` int(10) NOT NULL COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `subtype` tinyint(1) NOT NULL COMMENT '子类型',
  `content` varchar(45) NOT NULL COMMENT '说明',
  `index` int(10) NOT NULL COMMENT '索引',
  PRIMARY KEY (`qriid`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报退项';

DROP TABLE IF EXISTS `quotationrtem`;
CREATE TABLE `quotationrtem` (
  `qrid` int(10) NOT NULL AUTO_INCREMENT COMMENT '报价项关系表ID',
  `sqiid` int(10) NULL COMMENT '来源报价项ID',
  `tqiid` int(10) NULL COMMENT '目标报价项ID',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型',
  `formula` varchar(64) NULL COMMENT '公式',
  `comment` varchar(512) NULL COMMENT '说明',
  PRIMARY KEY (`qrid`)
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价项关系表';

DROP TABLE IF EXISTS `quotationversion`;
CREATE TABLE `quotationversion` (
  `qvId` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `trafficRate` int(5) NOT NULL DEFAULT 0,
  `trafficDiscount` tinyint(1) NOT NULL DEFAULT 0,
  `manageRate` int(5) NOT NULL DEFAULT 0,
  `manageDiscount` tinyint(1) NOT NULL DEFAULT 0,
  `taxRate` int(11) NOT NULL DEFAULT 0 COMMENT '税金比例',
  `taxDiscount` tinyint(11) NOT NULL DEFAULT 0 COMMENT '税金折扣',
  `offset` int(11) NOT NULL DEFAULT 0,
  `defaultFlag` int(11) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL DEFAULT 0,
  `comment` varchar(100) NULL,
  PRIMARY KEY (`qvId`),
  UNIQUE KEY `uniqueone` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价版本表';

DROP TABLE IF EXISTS `selection`;
CREATE TABLE `selection` (
  `sid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '选材单ID 选材单ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `qid` bigint(20) NOT NULL COMMENT '报价ID 报价ID',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态: 0, 初始  1, 锁定 (0:状态, 初始)',
  `isAffirm` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否确认 , 0: 未确认 , 1: 客户确认',
  `company` int(11) NOT NULL COMMENT '公司',
  `total` bigint(10) NOT NULL DEFAULT 0 COMMENT '总额 总额',
  `quotationTotal` bigint(10) NULL DEFAULT 0 COMMENT '报价总额',
  `extensionAddTotal` bigint(10) NULL DEFAULT 0 COMMENT '拓展增总额',
  `extensionReduceTotal` bigint(10) NULL DEFAULT 0 COMMENT '拓展减总额',
  `addReduceAddTotal` bigint(10) NULL DEFAULT 0 COMMENT '增减增总额',
  `addReduceMinusTotal` bigint(10) NULL DEFAULT 0 COMMENT '增减减总额',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `suid` int(11) NULL COMMENT '拆单员ID',
  `tuid` int(11) NULL COMMENT '下单员ID',
  `createTime` timestamp NULL,
  `affirmTime` timestamp NULL COMMENT '确认时间',
  `sendTime` timestamp NULL COMMENT '推送时间',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=2711 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `selectionitem`;
CREATE TABLE `selectionitem` (
  `siid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '选材项ID 选材项ID',
  `sid` bigint(20) NOT NULL COMMENT '选材单ID 选材单ID',
  `quoteId` bigint(20) NULL DEFAULT 0 COMMENT '引用项ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `areaId` bigint(20) NULL DEFAULT 0 COMMENT '功能区id',
  `areaName` varchar(10) NOT NULL COMMENT '功能区名字',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `suid` int(8) NOT NULL COMMENT '厂商ID 厂商id',
  `qiid` int(11) NULL DEFAULT 0 COMMENT '报价引用项ID',
  `sgid` int(11) NULL DEFAULT 0 COMMENT '选材ID',
  `offset` varchar(256) NULL COMMENT '偏移量',
  `initnum` int(8) NOT NULL DEFAULT 0 COMMENT '工程量',
  `num` int(8) NOT NULL COMMENT '数量 数量',
  `refnum` int(8) NULL DEFAULT 0 COMMENT '退数量 退数量',
  `postprice` int(8) NULL DEFAULT 0 COMMENT '结算价 售价',
  `preprice` int(8) NULL DEFAULT 0 COMMENT '预算金额 预算金额',
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 报价项 , 1: 拓展增项 , 2: 拓展减项, 3: 增项, 4: 减项 类型 , 0: 报价项 , 1: 拓展增项 , 2: 拓展减项 , 3: 增项, 4: 减项',
  `accountStatus` tinyint(1) NOT NULL DEFAULT 0 COMMENT '对账状态 , 0: 初始 , 1: 对账',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态  0: 初始 , 1: 配送 , 2: 审核 , 3: 确认 , 4: 结算 (0:状态, 初始)',
  `createTime` timestamp NULL COMMENT '创建时间',
  `tranTime` timestamp NULL COMMENT '配送时间',
  `checkTime` timestamp NULL COMMENT '审核时间',
  `confirmTime` timestamp NULL COMMENT '确认时间',
  `reviewTime` timestamp NULL,
  `balanceTime` timestamp NULL COMMENT '结算时间',
  `accountTime` timestamp NULL COMMENT '对账时间',
  `finishTime` timestamp NULL COMMENT '完结时间',
  `cuid` int(11) NULL,
  `tuid` int(11) NULL COMMENT '配送人',
  `chuid` int(11) NULL COMMENT '审核人',
  `couid` int(11) NULL COMMENT '确认人',
  `ruid` int(11) NULL,
  `buid` int(11) NULL COMMENT '结算人',
  `auid` int(11) NULL COMMENT '对账人',
  `fuid` int(11) NULL COMMENT '完结人',
  `comment` varchar(128) NULL COMMENT '注释 注释',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`siid`)
) ENGINE=InnoDB AUTO_INCREMENT=3692 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `systemdefineitem`;
CREATE TABLE `systemdefineitem` (
  `sdiid` bigint(20) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(128) NOT NULL,
  `quotationBigCategoryId` int(11) NOT NULL,
  `measurementUnitId` int(11) NOT NULL,
  `workTypeId` int(11) NOT NULL,
  `addPrice` int(8) NOT NULL DEFAULT 0,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `subPrice` int(8) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL DEFAULT 0,
  `discount` tinyint(4) NOT NULL DEFAULT 0,
  `comment` varchar(512) NOT NULL,
  PRIMARY KEY (`sdiid`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='系统定义报项目表';
