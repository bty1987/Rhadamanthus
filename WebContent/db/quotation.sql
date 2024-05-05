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
  `basePrice` int(10) NOT NULL DEFAULT '0' COMMENT '基数, 满减类型计算参数',
  `undisPrice` int(10) DEFAULT '0' COMMENT '不打折项总额',
  `disPrice` int(10) DEFAULT '0' COMMENT '打折项总额',
  `discount` int(10) DEFAULT '10000' COMMENT '折扣',
  `totalPrice` int(10) DEFAULT '0' COMMENT '报价总额',
  `content` varchar(64) DEFAULT NULL COMMENT '说明',
  `managePrice` int(10) DEFAULT '0' COMMENT '管理费',
  `manageRate` int(5) DEFAULT '0' COMMENT '管理费比例',
  `trafficPrice` int(10) DEFAULT '0' COMMENT '车运费',
  `trafficRate` int(5) DEFAULT '0' COMMENT '车运费比例',
  PRIMARY KEY (`qid`),
  KEY `indexone` (`cuid`),
  KEY `indextwo` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价表';

DROP TABLE IF EXISTS `quotetionfunctionarea`;
CREATE TABLE `quotetionfunctionarea` (
  `qfaid` int(11) NOT NULL AUTO_INCREMENT,
  `qid` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `functionAreaOrder` int(11) DEFAULT NULL COMMENT '功能区排序',
  `type` tinyint(1) DEFAULT NULL COMMENT '0管理 1工程量 2功能区总额 3不计算',
  `index` tinyint(3) NOT NULL DEFAULT '0' COMMENT '索引',
  PRIMARY KEY (`qfaid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区';

DROP TABLE IF EXISTS `quotetionfunctionareaitem0`;
CREATE TABLE `quotetionfunctionareaitem0` (
  `qfaiid` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT '0' COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` int(8) NOT NULL DEFAULT '0' COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiid`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表0';

DROP TABLE IF EXISTS `quotetionfunctionareaitem1`;
CREATE TABLE `quotetionfunctionareaitem1` (
  `qfaiid` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT '0' COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` int(8) NOT NULL DEFAULT '0' COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiid`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表1';

DROP TABLE IF EXISTS `quotetionfunctionareaitem2`;
CREATE TABLE `quotetionfunctionareaitem2` (
  `qfaiid` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT '0' COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` int(8) NOT NULL DEFAULT '0' COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiid`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表2';

DROP TABLE IF EXISTS `quotetionfunctionareaitem3`;
CREATE TABLE `quotetionfunctionareaitem3` (
  `qfaiid` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT '0' COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` int(8) NOT NULL DEFAULT '0' COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiid`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表3';

DROP TABLE IF EXISTS `quotetionfunctionareaitem4`;
CREATE TABLE `quotetionfunctionareaitem4` (
  `qfaiid` int(11) NOT NULL AUTO_INCREMENT,
  `qfaid` int(11) NOT NULL COMMENT '所属功能区ID',
  `qiid` int(11) DEFAULT NULL COMMENT '引用报价项ID',
  `name` varchar(128) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT '0' COMMENT '单价',
  `index` int(11) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0' COMMENT '公式',
  `num` int(8) NOT NULL DEFAULT '0' COMMENT '工程量',
  `type` tinyint(1) NOT NULL COMMENT '0普通1自定义2车运费3管理费4不计入总额',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0工程,1主材',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `workType` varchar(15) NOT NULL COMMENT '工种',
  `discount` tinyint(1) NOT NULL DEFAULT '1' COMMENT '折扣',
  `content` varchar(256) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`qfaiid`),
  KEY `indexone` (`qfaid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='新报价功能区报价表4';

CREATE DATABASE  IF NOT EXISTS `quotation`;
USE `quotation`;

DROP TABLE IF EXISTS `addreduce`;
CREATE TABLE `addreduce` (
  `arid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `dpId` int(11) DEFAULT NULL COMMENT '对应收款编号',
  `type` tinyint(1) NOT NULL COMMENT '0 增项 1 减项 2 漏项',
  `paytype` tinyint(1) NOT NULL DEFAULT '0',
  `atttype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '业务类型 , 0: 工程 , 1: 主材/销售',
  `managePrice` int(10) NOT NULL DEFAULT '0' COMMENT '管理费',
  `manageRate` int(5) NOT NULL DEFAULT '0' COMMENT '管理费比例',
  `manageDiscount` tinyint(1) DEFAULT '0' COMMENT '管理费折扣',
  `taxRate` int(8) DEFAULT '0' COMMENT '税金比例',
  `taxDiscount` tinyint(1) DEFAULT '0' COMMENT '税金折扣',
  `taxPrice` int(10) DEFAULT '0' COMMENT '税金',
  `discount` int(10) NOT NULL DEFAULT '0',
  `schedule` tinyint(1) DEFAULT '3' COMMENT '进度 , 对应装修单状态',
  `total` int(10) NOT NULL,
  `undisPrice` intint(10) NOT NULL DEFAULT '0',
  `disPrice` int(10) NOT NULL DEFAULT '0',
  `uncalPrice` int(10) NOT NULL DEFAULT '0',
  `calPrice` int(10) NOT NULL DEFAULT '0',
  `consPrice` int(10) NOT NULL DEFAULT '0' COMMENT '工程总额',
  `status` tinyint(1) NOT NULL COMMENT '0 未提交 1、已提交/未付款 2、已付款 3、已确认  ',
  `isAffirm` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未确认 1客户确认',
  `cuid` int(11) DEFAULT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmTime` timestamp NULL DEFAULT NULL COMMENT '确认时间',
  `sendTime` timestamp NULL DEFAULT NULL COMMENT '推送时间',
  `affirmTime` timestamp NULL DEFAULT NULL COMMENT '确认时间',
  `content` varchar(256) NOT NULL,
  PRIMARY KEY (`arid`),
  KEY `indexone` (`orderId`,`type`,`status`),
  KEY `indextwo` (`dpId`),
  KEY `indexthr` (`createTime`),
  KEY `indexfor` (`sendTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='增减项表';

DROP TABLE IF EXISTS `addreduceitem`;
CREATE TABLE `addreduceitem` (
  `ariid` int(11) NOT NULL AUTO_INCREMENT,
  `arid` int(11) NOT NULL COMMENT '增减项编号',
  `itemName` varchar(128) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0报价项 , 1自定义报价项目',
  `subtype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1工程,2主材',
  `itemtype` tinyint(1) DEFAULT '0',
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `addPrice` int(8) NOT NULL DEFAULT '0',
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `subPrice` int(8) NOT NULL DEFAULT '0',
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  `initnum` int(8) NOT NULL DEFAULT '0' COMMENT '初始量',
  `num` int(8) NOT NULL DEFAULT '0',
  `quotationFunctionAreaId` int(11) NOT NULL COMMENT '所属报价功能区编号',
  `quoteItemId` int(11) DEFAULT '0',
  `qiid` int(11) NOT NULL DEFAULT '0' COMMENT '关联数据报价项',
  `content` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`ariid`),
  KEY `indexone` (`arid`),
  KEY `indextwo` (`quotationFunctionAreaId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='增减项目';

DROP TABLE IF EXISTS `extension`;
CREATE TABLE `extension` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `atttype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '业务类型, 0: 通用, 1: 置换',
  `undisPrice` int(10) NOT NULL DEFAULT '0',
  `disPrice` int(10) NOT NULL DEFAULT '0',
  `manageRate` int(8) DEFAULT '0' COMMENT '管理费比例',
  `manageDiscount` tinyint(1) DEFAULT '0' COMMENT '管理费折扣, 0: 不打折, 1: 打折',
  `managePrice` int(8) DEFAULT '0' COMMENT '管理费',
  `total` int(10) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `cuid` int(11) DEFAULT NULL COMMENT '创建人ID',
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
  `addPrice` int(8) NOT NULL DEFAULT '0',
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `subPrice` int(8) NOT NULL DEFAULT '0',
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  `initnum` int(8) NOT NULL DEFAULT '0' COMMENT '初始量',
  `num` int(8) NOT NULL DEFAULT '0',
  `quotationFunctionAreaId` int(11) NOT NULL,
  `quoteItemId` int(11) NOT NULL,
  `qiid` int(11) NOT NULL DEFAULT '0' COMMENT '关联数据报价项',
  `content` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`eiid`),
  KEY `indexone` (`eid`),
  KEY `indextwo` (`quotationFunctionAreaId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='拓展项目';

DROP TABLE IF EXISTS `functionarea`;
CREATE TABLE `functionarea` (
  `faid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `versionId` varchar(11) NOT NULL,
  `functionAreaOrder` int(11) NOT NULL,
  `functionAreaType` varchar(10) NOT NULL DEFAULT '普通' COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `total` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`faId`),
  KEY `indexone` (`no`,`versionId`,`functionAreaType`,`functionAreaOrder`),
  KEY `indextwo` (`versionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='功能区表';

DROP TABLE IF EXISTS `functionareaquoteitem`;
CREATE TABLE `functionareaquoteitem` (
  `faiid` int(11) NOT NULL AUTO_INCREMENT,
  `functionAreaId` int(11) NOT NULL,
  `quoteItemId` int(11) NOT NULL,
  `formula` varchar(64) DEFAULT '',
  PRIMARY KEY (`faiid`),
  KEY `indexone` (`functionAreaId`,`quoteItemId`),
  KEY `indextwo` (`quoteItemId`,`functionAreaId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='功能区报价项关联表';

DROP TABLE IF EXISTS `normooditem`;
CREATE TABLE `normooditem` (
  `ngiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '定额材料ID',
  `qid` int(11) NOT NULL COMMENT '报价ID',
  `sid` int(11) NOT NULL COMMENT '引用ID, 包括报价/拓展/增减',
  `areald` int(11) NOT NULL COMMENT '功能区ID',
  `quoteld` int(11) NOT NULL COMMENT '引用项ID',
  `qiid` int(11) NOT NULL COMMENT '报价项ID',
  `nid` int(11) DEFAULT NULL COMMENT '定材id',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0:报价,1:拓展,2:增减',
  `normtype` tinyint(1) NOT NULL COMMENT '定额类型, 0:材料, 1:打包',
  `atttype` tinyint(1) NOT NULL COMMENT '业务类型, 0:收款, 1:出款',
  `gid` int(11) DEFAULT NULL COMMENT '商品类型',
  `normunit` varchar(10) NOT NULL DEFAULT '' COMMENT '定额单位',
  `normnum` int(8) NOT NULL DEFAULT '0' COMMENT '定额数量',
  `storeunit` varchar(10) NOT NULL DEFAULT '' COMMENT '库房单位',
  `storenum` int(8) NOT NULL DEFAULT '0' COMMENT '库房数量',
  PRIMARY KEY (`ngiid`),
  KEY `indexone` (`qid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价定额项表';
DROP TABLE IF EXISTS `normriceitem`;
CREATE TABLE `normriceitem` (
  `npiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '定额工费ID',
  `qid` int(11) NOT NULL COMMENT '报价ID',
  `sid` int(11) NOT NULL COMMENT '引用ID , 包括报价/拓展/增减',
  `areald` int(11) DEFAULT NULL COMMENT '功能区ID',
  `quoteld` int(11) DEFAULT NULL COMMENT '引用项ID',
  `qiid` int(11) DEFAULT NULL COMMENT '报价项ID',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0:报价,1:拓展,2:增减',
  `normtype` tinyint(1) NOT NULL COMMENT '定额类型, 0:工费,1:附加',
  `atttype` tinyint(1) NOT NULL COMMENT '业务类型, 0:收款,1:出款',
  `cnid` int(11) NOT NULL COMMENT '施工节点, 类型',
  `name` varchar(64) DEFAULT '',
  `unit` varchar(15) NOT NULL DEFAULT '' COMMENT '单位',
  `num` int(8) NOT NULL DEFAULT '0' COMMENT '数量',
  `trannum` int(11) NOT NULL DEFAULT '0' COMMENT '转换量',
  `salary` int(11) NOT NULL DEFAULT '0' COMMENT '薪资',
  PRIMARY KEY (`npiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价定额工费项表';
DROP TABLE IF EXISTS `normtion`;
CREATE TABLE `normtion` (
  `nid` int(11) NOT NULL AUTO_INCREMENT COMMENT '报价定额id',
  `orderId` varchar(15) NOT NULL,
  `qid` int(11) NOT NULL COMMENT '报价id',
  `moodTotal` int(11) NOT NULL COMMENT '材料总额',
  `mriceTotal` int(11) NOT NULL COMMENT '工费总额',
  `moodPrintNum` int(11) NOT NULL COMMENT '材料打印次数',
  `mricePriceNum` int(11) NOT NULL COMMENT '工费打印次数',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价定额打印表';
DROP TABLE IF EXISTS `presigncost`;
CREATE TABLE `presigncost` (
  `pcid` int(11) NOT NULL AUTO_INCREMENT COMMENT '成本ID',
  `ppid` int(11) NOT NULL COMMENT '预签ID',
  `toplimit` int(8) DEFAULT '0' COMMENT '上限面积',
  `lowlimit` int(8) DEFAULT '0' COMMENT '下限面积',
  `costPrice` int(8) DEFAULT '0' COMMENT '成本单价',
  PRIMARY KEY (`pcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预签成本';
DROP TABLE IF EXISTS `presignitem`;
CREATE TABLE `presignitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT COMMENT '预签项ID',
  `ppid` int(11) NOT NULL COMMENT '预签产品ID',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '名称',
  `basicNum` int(8) NOT NULL DEFAULT '0' COMMENT '基础量',
  `cost` int(8) NOT NULL DEFAULT '0',
  `price` int(10) NOT NULL DEFAULT '0' COMMENT '价格',
  `addPrice` int(11) DEFAULT '0' COMMENT '增补价',
  `subPrice` int(11) DEFAULT '0' COMMENT '退减价',
  `achePrice` int(11) DEFAULT '0' COMMENT '业绩',
  `areaCale` tinyint(1) DEFAULT '0' COMMENT '面积规则 , 0: 数量 , 1: 面积',
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 基础 , 1: 工程 , 2: 主材',
  `onetype` tinyint(1) NOT NULL COMMENT '状态, 0: 普通 , 1: 标配',
  `atttype` tinyint(1) DEFAULT '0' COMMENT '业务类型 , 0: 通用 , 1: 工程 , 2: 主材',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 启用 , 1: 禁用',
  `content` varchar(512) DEFAULT '' COMMENT '说明',
  PRIMARY KEY (`piid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预签项表';

DROP TABLE IF EXISTS `presignprice`;
CREATE TABLE `presignprice` (
  `pspid` int(11) NOT NULL AUTO_INCREMENT,
  `ppid` int(11) NOT NULL COMMENT '预签产品ID',
  `name` varchar(64) DEFAULT '' COMMENT '名称',
  `upperArea` int(8) DEFAULT '0' COMMENT '起始面积',
  `lowerArea` int(8) DEFAULT '0' COMMENT '终止面积',
  `price` int(8) DEFAULT '0' COMMENT '价格',
  `costPrice` int(11) DEFAULT '0' COMMENT '工程成本',
  `mostPrice` int(11) DEFAULT '0' COMMENT '主材成本',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`pspid`),
  KEY `indexone` (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预签产品价格';
DROP TABLE IF EXISTS `presignproduce`;
CREATE TABLE `presignproduce` (
  `ppid` int(11) NOT NULL AUTO_INCREMENT COMMENT '预签产品ID',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '名称',
  `quotePrice` int(10) NOT NULL DEFAULT '0' COMMENT '起报价',
  `quoteArea` int(8) NOT NULL DEFAULT '0' COMMENT '起报面积',
  `preferPrice` int(10) NOT NULL DEFAULT '0' COMMENT '优惠金额',
  `mostPrice` int(10) NOT NULL DEFAULT '0' COMMENT '主材成本',
  `costRate` int(8) NOT NULL DEFAULT '0' COMMENT '工程增项成本比例',
  `mostRate` int(8) NOT NULL DEFAULT '0' COMMENT '主材增项成本比例',
  `unitPrice` int(10) NOT NULL DEFAULT '0' COMMENT '面积单价',
  `discount` int(8) DEFAULT '1000' COMMENT '折扣',
  `manageRate` int(8) DEFAULT '0' COMMENT '管理费比例',
  `manageFormula` varchar(64) DEFAULT '' COMMENT '管理费公式',
  `costPrice` int(10) NOT NULL DEFAULT '0' COMMENT '成本单价',
  `profitRate` int(8) NOT NULL DEFAULT '0' COMMENT '利润率',
  `offset` int(10) NOT NULL DEFAULT '0' COMMENT '偏移量',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0: 初始 , 1: 发布',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预签产品表';

DROP TABLE IF EXISTS `protation`;
CREATE TABLE `protation` (
  `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '预签单ID',
  `ppid` int(11) NOT NULL COMMENT '预签产品ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `product` varchar(32) DEFAULT '' COMMENT '预签产品名称',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `quotePrice` int(10) NOT NULL DEFAULT '0' COMMENT '起报价',
  `quoteArea` int(8) NOT NULL DEFAULT '0' COMMENT '起报面积',
  `preferPrice` int(10) NOT NULL DEFAULT '0' COMMENT '优惠金额',
  `manageFormula` varchar(64) DEFAULT '' COMMENT '管理费公式',
  `managePrice` int(11) NOT NULL DEFAULT '0' COMMENT '管理费',
  `costPrice` int(10) NOT NULL DEFAULT '0' COMMENT '成本单价',
  `mostPrice` int(8) NOT NULL DEFAULT '0' COMMENT '主材成本',
  `costRate` int(8) NOT NULL DEFAULT '0' COMMENT '工程增项成本比例',
  `mostRate` int(8) NOT NULL DEFAULT '0' COMMENT '主材增项成本比例',
  `totalCost` int(10) DEFAULT '0' COMMENT '成本总额',
  `totalProfit` int(10) NOT NULL DEFAULT '0' COMMENT '利润总额',
  `discount` int(8) DEFAULT '1000' COMMENT '折扣',
  `manageRate` int(8) DEFAULT '0' COMMENT '管理费比例',
  `unitPrice` int(10) NOT NULL DEFAULT '0' COMMENT '平米单价',
  `profitRate` int(10) NOT NULL DEFAULT '0' COMMENT '利润率',
  `basicPrice` int(10) DEFAULT '0' COMMENT '基础额',
  `comdPrice` int(10) DEFAULT '0' COMMENT '工程额',
  `commPrice` int(10) DEFAULT '0' COMMENT '主材额',
  `adddPrice` int(10) DEFAULT '0' COMMENT '增工额',
  `addmPrice` int(10) DEFAULT '0' COMMENT '增主额',
  `subdPrice` int(10) DEFAULT '0' COMMENT '减工额',
  `submPrice` int(10) DEFAULT '0' COMMENT '减主额',
  `accdPrice` int(10) DEFAULT '0',
  `accmPrice` int(10) DEFAULT '0',
  `totalPrice` int(10) NOT NULL DEFAULT '0' COMMENT '总额',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态,0:初始',
  `defaults` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态, 0:非默认,1:默认',
  `comment` varchar(64) DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`pid`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预签单表';

DROP TABLE IF EXISTS `protationcost`;
CREATE TABLE `protationcost` (
  `pcid` int(11) NOT NULL AUTO_INCREMENT COMMENT '成本ID',
  `pid` int(11) NOT NULL COMMENT '预签ID',
  `toplimit` int(8) NOT NULL DEFAULT '0' COMMENT '上限面积',
  `lowlimit` int(8) NOT NULL DEFAULT '0' COMMENT '下限面积',
  `costPrice` int(10) NOT NULL DEFAULT '0' COMMENT '成本单价',
  PRIMARY KEY (`pcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预签成本';
DROP TABLE IF EXISTS `protationitem`;
CREATE TABLE `protationitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT COMMENT '预签项ID',
  `pid` int(11) NOT NULL COMMENT '预签单ID',
  `ppiid` int(11) DEFAULT NULL COMMENT '产品项ID',
  `name` varchar(36) NOT NULL COMMENT '名称',
  `basicNum` int(8) NOT NULL DEFAULT '0' COMMENT '基础量',
  `num` int(8) NOT NULL DEFAULT '0' COMMENT '数量',
  `addPrice` int(10) DEFAULT '0' COMMENT '增补价',
  `price` int(10) NOT NULL DEFAULT '0' COMMENT '价格',
  `subPrice` int(10) DEFAULT '0' COMMENT '退减价',
  `cost` int(8) NOT NULL DEFAULT '0',
  `achePrice` int(10) DEFAULT '0' COMMENT '业绩',
  `areaCale` tinyint(1) DEFAULT '0' COMMENT '面积规则 , 0: 数量 , 1: 面积',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型, 0:基础,1:工程,2:主材,3:增工,4:增主,5:减工,6:减主',
  `onetype` tinyint(1) NOT NULL DEFAULT '0' COMMENT ' 一类, 0: 标准, 1: 标配',
  `atttype` tinyint(1) NOT NULL DEFAULT '0' COMMENT '业务类型, 0: 通用, 1: 工程, 2: 主材',
  PRIMARY KEY (`piid`),
  KEY `indexone` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预签项表';

DROP TABLE IF EXISTS `quotation`;
CREATE TABLE `quotation` (
  `qid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(64) NOT NULL,
  `style` varchar(16) DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `basePrice` int(8) NOT NULL DEFAULT '0' COMMENT '基数, 满减类型计算参数',
  `costPrice` int(8) NOT NULL DEFAULT '0' COMMENT '成本费用,项目类型为5(成本)',
  `unachePrice` int(10) DEFAULT '0' COMMENT '非业绩总额',
  `undisPrice` int(8) NOT NULL DEFAULT '0' COMMENT '折前总价',
  `disPrice` int(8) NOT NULL DEFAULT '0' COMMENT '折前折扣总价',
  `discount` int(8) NOT NULL DEFAULT '10000',
  `totalPrice` int(10) DEFAULT '0',
  `managePrice` int(10) DEFAULT '0',
  `manageRate` int(5) DEFAULT '0',
  `manageDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `trafficPrice` int(10) DEFAULT '0',
  `trafficRate` int(5) NOT NULL DEFAULT '0' COMMENT '车运费比例',
  `trafficDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `taxPrice` int(10) NOT NULL DEFAULT '0' COMMENT '税金',
  `taxRate` int(8) NOT NULL DEFAULT '0' COMMENT '税金比例',
  `taxDiscount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '税金折扣',
  `defaults` tinyint(1) NOT NULL DEFAULT '0' COMMENT '默认, 0 非默认 ,1 默认',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0 启用, 1 禁用',
  `createTime` timestamp NULL DEFAULT NULL,
  `content` varchar(64) DEFAULT '',
  PRIMARY KEY (`qid`),
  KEY `indexone` (`orderId`,`createTime`,`defaults`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价表';

DROP TABLE IF EXISTS `quotationctem`;
CREATE TABLE `quotationctem` (
  `qcid` int(11) NOT NULL AUTO_INCREMENT COMMENT '公共项ID',
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT '名称',
  `pinyin` varchar(256) DEFAULT '' COMMENT '拼音',
  `quotationTypeId` int(11) DEFAULT NULL COMMENT '类型',
  `quotationClassificationId` int(11) DEFAULT NULL COMMENT '类别',
  `quotationBigCategoryId` int(11) DEFAULT NULL COMMENT '大类',
  `quotationSmallCategoryId` int(11) DEFAULT NULL COMMENT '小类',
  `measurementUnitId` int(11) DEFAULT NULL COMMENT '单位',
  `workTypeId` int(11) DEFAULT NULL COMMENT '工种',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '业务',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0: 启用 , 1: 禁用',
  PRIMARY KEY (`qcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公共项';
DROP TABLE IF EXISTS `quotationformat`;
CREATE TABLE `quotationformat` (
  `qfid` int(11) NOT NULL AUTO_INCREMENT COMMENT '规格ID',
  `qcid` int(11) NOT NULL COMMENT '项目ID',
  `name` varchar(64) DEFAULT '' COMMENT '名称',
  `format` varchar(64) DEFAULT '' COMMENT '规格',
  `pinyin` varchar(64) DEFAULT '' COMMENT '拼音',
  `price` int(8) DEFAULT '0' COMMENT '价格',
  `unit` int(11) DEFAULT NULL COMMENT '单位',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 启用 , 1: 禁用',
  PRIMARY KEY (`qfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='规格';
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
  `comment` varchar(255) DEFAULT '',
  PRIMARY KEY (`qfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价功能配置表';
DROP TABLE IF EXISTS `quotationfunctionarea`;
CREATE TABLE `quotationfunctionarea` (
  `qfaid` int(11) NOT NULL AUTO_INCREMENT,
  `quotationId` int(11) NOT NULL,
  `functionAreaName` varchar(10) NOT NULL,
  `functionAreaOrder` int(11) DEFAULT NULL,
  `functionAreaType` varchar(10) DEFAULT NULL COMMENT ' 包括普通 , 一次性包死 , 综合项目 , 管理费 . ',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `total` int(10) NOT NULL DEFAULT '0',
  `index` tinyint(3) NOT NULL DEFAULT '0' COMMENT '索引',
  PRIMARY KEY (`qfaid`),
  KEY `indexone` (`quotationId`,`functionAreaOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价功能区';

DROP TABLE IF EXISTS `quotationfunctionareaitem0`;
CREATE TABLE `quotationfunctionareaitem0` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT '0',
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
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT '0' COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT '0',
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
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT '0' COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT '0',
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
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT '0' COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT '0',
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
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `index` tinyint(1) NOT NULL DEFAULT '0' COMMENT '索引',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT '0' COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT '0',
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

DROP TABLE IF EXISTS `quotationfunctionareaparam`;
CREATE TABLE `quotationfunctionareaparam` (
  `qfapid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `qfaid` int(11) NOT NULL COMMENT '功能区ID',
  `girth` int(8) NOT NULL DEFAULT '0' COMMENT '周长',
  `area` int(8) NOT NULL DEFAULT '0' COMMENT '面积',
  `height` int(8) NOT NULL DEFAULT '0' COMMENT '举架',
  `holeLength` int(8) NOT NULL DEFAULT '0' COMMENT '洞长',
  `holeHeight` int(8) NOT NULL DEFAULT '0' COMMENT '洞高',
  `windowLength` int(8) NOT NULL DEFAULT '0' COMMENT '窗长',
  `windowHeight` int(8) NOT NULL DEFAULT '0' COMMENT '窗高',
  `beamLength` int(8) NOT NULL DEFAULT '0' COMMENT '梁长',
  `beamHeight` int(8) NOT NULL DEFAULT '0' COMMENT '梁高',
  PRIMARY KEY (`qfapid`),
  KEY `indexone` (`qfaid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程区参数';

DROP TABLE IF EXISTS `quotationitem`;
CREATE TABLE `quotationitem` (
  `qiid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) DEFAULT '',
  `name` varchar(128) NOT NULL,
  `alias` varchar(128) DEFAULT '' COMMENT '别名',
  `qvid` int(11) DEFAULT NULL COMMENT '版本id',
  `versionId` varchar(11) NOT NULL,
  `quotationTypeId` int(11) NOT NULL,
  `quotationClassificationId` int(11) NOT NULL,
  `quotationBigCategoryId` int(11) NOT NULL,
  `quotationSmallCategoryId` int(11) NOT NULL,
  `measurementUnitId` int(11) NOT NULL,
  `workTypeId` int(11) NOT NULL,
  `quotationCtemId` int(11) DEFAULT NULL COMMENT '公共项',
  `addPrice` int(8) DEFAULT '0',
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `subPrice` int(8) DEFAULT '0',
  `cost` int(8) DEFAULT '0' COMMENT '成本',
  `achePrice` int(8) DEFAULT '0' COMMENT '业绩额',
  `formula` varchar(64) DEFAULT '' COMMENT '公式',
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(512) NOT NULL,
  PRIMARY KEY (`qiid`),
  KEY `indexone` (`no`,`versionId`),
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
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `type` tinyint(1) NOT NULL DEFAULT '-1',
  `comment` varchar(64) DEFAULT '',
  `trafficRate` int(5) NOT NULL DEFAULT '0',
  `trafficDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `manageRate` int(5) NOT NULL DEFAULT '0',
  `manageDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `taxRate` int(8) NOT NULL DEFAULT '0' COMMENT '税金比例',
  `taxDiscount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '税金折扣',
  `company` int(11) NOT NULL DEFAULT '0',
  `offset` int(11) NOT NULL DEFAULT '0' COMMENT '偏移量',
  PRIMARY KEY (`qvId`),
  UNIQUE KEY `uniqueone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价版本表';

DROP TABLE IF EXISTS `selection`;
CREATE TABLE `selection` (
  `sid` int(11) NOT NULL AUTO_INCREMENT COMMENT '选材单ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `qid` int(11) NOT NULL COMMENT '报价ID',
  `total` bigint(10) NOT NULL DEFAULT '0' COMMENT '总额',
  `quotationTotal` bigint(10) DEFAULT '0' COMMENT '报价总额',
  `extensionAddTotal` bigint(10) DEFAULT '0' COMMENT '拓展增总额',
  `extensionReduceTotal` bigint(10) DEFAULT '0' COMMENT '拓展减总额',
  `addReduceAddTotal` bigint(10) DEFAULT '0' COMMENT '增减增总额',
  `addReduceMinusTotal` bigint(10) DEFAULT '0' COMMENT '增减减总额',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `suid` int(11) DEFAULT NULL COMMENT '拆单员ID',
  `tuid` int(11) DEFAULT NULL COMMENT '下单员ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `affirmTime` timestamp NULL DEFAULT NULL COMMENT '确认时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态: 0, 初始  1, 锁定',
  `isAffirm` tinyint(1) DEFAULT '0' COMMENT '是否确认 , 0: 未确认 , 1: 客户确认',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`sid`),
  UNIQUE KEY `uniqueone` (`qid`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='选材单';

DROP TABLE IF EXISTS `selectionitem`;
CREATE TABLE `selectionitem` (
  `siid` int(11) NOT NULL AUTO_INCREMENT COMMENT '选材项ID',
  `sid` int(11) NOT NULL COMMENT '选材单ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `areaId` int(11) NOT NULL COMMENT '装修单号',
  `areaName` varchar(10) NOT NULL COMMENT '功能区名字',
  `quoteId` int(11) NOT NULL COMMENT '引用项ID',
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 报价项 , 1: 拓展增项 , 2: 拓展减项, 3: 增项, 4: 减项',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `num` int(8) NOT NULL COMMENT '数量',
  `initnum` int(8) NOT NULL DEFAULT '0' COMMENT '工程量',
  `refnum` int(8) DEFAULT '0' COMMENT '退数量',
  `preprice` int(8) DEFAULT '0' COMMENT '预算金额',
  `postprice` int(8) DEFAULT '0' COMMENT '结算价',
  `cuid` int(11) DEFAULT NULL,
  `suid` int(11) NOT NULL COMMENT '厂商ID',
  `qiid` int(11) DEFAULT '0' COMMENT '报价引用项ID',
  `sgid` int(11) DEFAULT '0' COMMENT '选材ID',
  `tuid` int(11) DEFAULT NULL COMMENT '配送人',
  `chuid` int(11) DEFAULT NULL COMMENT '审核人',
  `couid` int(11) DEFAULT NULL COMMENT '确认人',
  `ruid` int(11) DEFAULT NULL,
  `buid` int(11) DEFAULT NULL COMMENT '结算人',
  `fuid` int(11) DEFAULT NULL COMMENT '完结人',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `tranTime` timestamp NULL DEFAULT NULL COMMENT '配送时间',
  `checkTime` timestamp NULL DEFAULT NULL COMMENT '审核时间',
  `confirmTime` timestamp NULL DEFAULT NULL COMMENT '确认时间',
  `reviewTime` timestamp NULL DEFAULT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL COMMENT '结算时间',
  `finishTime` timestamp NULL DEFAULT NULL COMMENT '完结时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态  0: 初始, 1: 配送, 2: 审核, 3: 确认, 4: 结算',
  `comment` varchar(128) DEFAULT NULL COMMENT '注释',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`siid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`orderId`),
  KEY `indexthr` (`createTime`,`company`),
  KEY `indexfor` (`balanceTime`,`company`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='选材项';

DROP TABLE IF EXISTS `systemdefineitem`;
CREATE TABLE `systemdefineitem` (
  `sdiid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(128) NOT NULL,
  `quotationBigCategoryId` int(11) NOT NULL,
  `measurementUnitId` int(11) NOT NULL,
  `workTypeId` int(11) NOT NULL,
  `addPrice` int(8) NOT NULL DEFAULT '0',
  `unitPrice` int(8) NOT NULL DEFAULT '0',
  `subPrice` int(8) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL DEFAULT '0',
  `discount` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(512) NOT NULL,
  PRIMARY KEY (`sdiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='系统定义报项目表';
