CREATE DATABASE IF NOT EXISTS `construction`;
USE `construction`;

-- Generated at 2026-01-06 08:11:02
-- Total tables: 20

DROP TABLE IF EXISTS `acceptance`;
CREATE TABLE `acceptance` (
  `actId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `acceptanceTime` date NOT NULL,
  `waterwayQuality` tinyint(1) NULL,
  `waterwayServer` tinyint(1) NULL,
  `waterwayHygiene` tinyint(1) NULL,
  `waterwayDes` varchar(256) NULL,
  `circuitQuality` tinyint(1) NULL,
  `circuitServer` tinyint(1) NULL,
  `circuitHygiene` tinyint(1) NULL,
  `circuitDes` varchar(256) NULL,
  `bricklayQuality` tinyint(1) NULL,
  `bricklayServer` tinyint(1) NULL,
  `bricklayHygiene` tinyint(1) NULL,
  `bricklayDes` varchar(256) NULL,
  `carpentQuality` tinyint(1) NULL,
  `carpentServer` tinyint(1) NULL,
  `carpentHygiene` tinyint(1) NULL,
  `carpentDes` varchar(256) NULL,
  `oilQuality` tinyint(1) NULL,
  `oilServer` tinyint(1) NULL,
  `oilHygiene` tinyint(1) NULL,
  `oilDes` varchar(256) NULL,
  `supervisQuality` tinyint(1) NULL,
  `supervisServer` tinyint(1) NULL,
  `supervisHygiene` tinyint(1) NULL,
  `supervisDes` varchar(256) NULL,
  `materialQuality` tinyint(1) NULL,
  `materialServer` tinyint(1) NULL,
  `materialDes` varchar(256) NULL,
  `question` varchar(256) NULL,
  `propose` varchar(256) NULL,
  `multiple` tinyint(1) NULL,
  `internal` tinyint(1) NULL,
  PRIMARY KEY (`actId`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程验收表';

DROP TABLE IF EXISTS `constructer`;
CREATE TABLE `constructer` (
  `crid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL,
  `cid` int(11) NOT NULL,
  `csid` int(11) NULL,
  `cnid` int(11) NULL,
  `userId` varchar(15) NULL COMMENT '施工人员编号',
  `schedule` int(11) NOT NULL COMMENT '施工进度',
  `rate` tinyint(1) NOT NULL DEFAULT 0 COMMENT '评分',
  `rate1` tinyint(1) NOT NULL DEFAULT 0,
  `rate2` tinyint(1) NOT NULL DEFAULT 0,
  `assessment` varchar(128) NULL COMMENT '评价',
  `createrId` varchar(15) NULL COMMENT '创建人编号',
  `cuid` int(1) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sendTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `finishTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `wuid` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`crid`),
  KEY `indexone` (`orderId`, `status`, `schedule`) USING BTREE,
  KEY `indextwo` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=27190 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='施工人员表';

DROP TABLE IF EXISTS `construction`;
CREATE TABLE `construction` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL DEFAULT '',
  `cnid` int(11) NULL DEFAULT 0,
  `schedule` tinyint(1) NULL DEFAULT 0,
  `process` tinyint(1) NULL DEFAULT 0,
  `period` int(8) NULL DEFAULT 0,
  `startTime` timestamp NULL,
  `endTime` timestamp NULL,
  `accessory` tinyint(1) NULL DEFAULT 0,
  `suid` int(11) NULL,
  `luid` int(11) NULL,
  `buid` int(11) NULL,
  `accessoryLimit` bigint(10) NULL DEFAULT 0,
  `accessoryTotal` bigint(10) NULL DEFAULT 0,
  `salaryLimit` bigint(10) NULL DEFAULT 0,
  `salaryLimitTotal` int(8) NULL DEFAULT 0,
  `salaryTotal` bigint(10) NULL DEFAULT 0,
  `createTime` timestamp NULL,
  `preStartTime` timestamp NULL,
  `preEndTime` timestamp NULL,
  `finishTime` timestamp NULL,
  `processTime` timestamp NULL,
  `lockTime` timestamp NULL,
  `balanceTime` timestamp NULL,
  `workStatus` tinyint(1) NULL DEFAULT 0,
  `scheduleStatus` tinyint(1) NULL DEFAULT 0,
  `balanceStatus` tinyint(1) NULL DEFAULT 0,
  `terminalStatus` tinyint(1) NULL COMMENT '终止状态',
  PRIMARY KEY (`cid`),
  KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexthr` (`schedule`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1801 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程进度表';

DROP TABLE IF EXISTS `constructionaccessory`;
CREATE TABLE `constructionaccessory` (
  `caid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `aid` int(11) NULL,
  `checkup` tinyint(1) NULL DEFAULT 0,
  `numLimit` bigint(10) NULL DEFAULT 0,
  `total` bigint(10) NULL DEFAULT 0,
  `num` int(8) NULL DEFAULT 0,
  PRIMARY KEY (`caid`)
) ENGINE=InnoDB AUTO_INCREMENT=4572 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `constructioncost`;
CREATE TABLE `constructioncost` (
  `ccid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `areaLeft` int(8) NOT NULL DEFAULT 0,
  `areaRight` int(8) NOT NULL DEFAULT 0,
  `accessory` bigint(10) NOT NULL DEFAULT 0,
  `salary` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 启用, 1: 禁用',
  `sort` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ccid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `constructiondiary`;
CREATE TABLE `constructiondiary` (
  `cdid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单ID',
  `csid` int(11) NOT NULL COMMENT '工程进度ID',
  `cnid` int(11) NOT NULL COMMENT '工程节点ID',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `atttype` tinyint(1) NULL DEFAULT 0 COMMENT '1: 进场 , 2: 离场',
  `isUpload` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否上传图片，0:否，1:是',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(255) NULL DEFAULT '' COMMENT '记录信息',
  PRIMARY KEY (`cdid`),
  KEY `indexone` (`cid`) USING BTREE,
  KEY `indextwo` (`csid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程日记表';

DROP TABLE IF EXISTS `constructiondiarydrawing`;
CREATE TABLE `constructiondiarydrawing` (
  `cddid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `csid` int(11) NOT NULL COMMENT '工程进度ID',
  `cdid` int(11) NOT NULL COMMENT '工程日记ID',
  `cnid` int(11) NOT NULL COMMENT '数据中工程节点ID',
  `drawingName` varchar(15) NULL COMMENT '图片名',
  `drawingUrl` varchar(256) NOT NULL COMMENT '图片路径',
  `drawingAddUrl` varchar(256) NULL COMMENT '图片路径,保留字段',
  `filesize` int(10) NULL DEFAULT 0,
  `cuid` int(11) NULL COMMENT '创建人ID',
  `createTime` timestamp NULL COMMENT '创建时间',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型, 0: 本地, 1: 钉钉',
  `schedule` tinyint(1) NOT NULL COMMENT '工程进度',
  PRIMARY KEY (`cddid`),
  KEY `indexone` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程日记表';

DROP TABLE IF EXISTS `constructiondrawing`;
CREATE TABLE `constructiondrawing` (
  `cdid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `csid` int(11) NULL,
  `cnid` int(11) NULL,
  `drawingName` varchar(15) NULL COMMENT '图片名',
  `drawingUrl` varchar(256) NOT NULL COMMENT '图片路径',
  `drawingAddUrl` varchar(256) NULL COMMENT ' 图片路径,保留字段',
  `filesize` int(10) NULL DEFAULT 0,
  `createrId` varchar(15) NULL COMMENT '创建人',
  `cuid` int(11) NULL,
  `createTime` timestamp NULL COMMENT '创建时间',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型',
  `schedule` tinyint(1) NOT NULL COMMENT '工程进度',
  PRIMARY KEY (`cdid`),
  KEY `indexone` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4456 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程图纸表';

DROP TABLE IF EXISTS `constructioninfo`;
CREATE TABLE `constructioninfo` (
  `ciid` int(11) NOT NULL AUTO_INCREMENT COMMENT '信息ID',
  `cid` int(11) NULL COMMENT '工程ID',
  `orderId` varchar(15) NULL,
  `timeLimit` int(8) NULL DEFAULT 0 COMMENT '工期',
  `ishovel` tinyint(1) NOT NULL COMMENT '铲大白',
  `iskey` tinyint(1) NOT NULL COMMENT '钥匙',
  `isCeremony` tinyint(1) NOT NULL COMMENT '备注说明',
  `isIssue` tinyint(1) NULL DEFAULT 0,
  `isCheck` tinyint(1) NULL DEFAULT 0,
  `finishTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `keyTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `drawlineTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `designTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `checkTime` timestamp NULL,
  `actuaTime` int(10) NULL DEFAULT 0,
  `comment` varchar(255) NULL,
  `designPeriod` int(8) NULL DEFAULT 0 COMMENT '设计周期（天）',
  PRIMARY KEY (`ciid`),
  KEY `indexone` (`cid`) USING BTREE,
  KEY `indexthr` (`actuaTime`) USING BTREE,
  KEY `indextwo` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1246 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程信息';

DROP TABLE IF EXISTS `constructionplan`;
CREATE TABLE `constructionplan` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '计划ID',
  `cid` int(11) NULL COMMENT '工程单ID',
  `orderId` varchar(15) NULL COMMENT '装修单号',
  `name` varchar(32) NULL COMMENT '名称',
  `cpnid` int(11) NULL COMMENT '计划ID',
  `cnid` int(11) NULL COMMENT '工程节点',
  `connum` int(8) NOT NULL DEFAULT 0 COMMENT '工程量',
  `comnum` int(8) NOT NULL DEFAULT 0 COMMENT '主材量',
  `prenum` int(11) NOT NULL DEFAULT 0 COMMENT '前期工程量',
  `postnum` int(11) NOT NULL DEFAULT 0 COMMENT '后期工程量',
  `phase` varchar(64) NULL,
  `material` varchar(64) NULL,
  `period` varchar(64) NULL,
  `createTime` timestamp NULL COMMENT '创建时间',
  `starttime` timestamp NULL,
  `endtime` timestamp NULL,
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `content` varchar(512) NULL COMMENT '说明',
  `comment` varchar(512) NULL COMMENT '说明',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=388 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `constructionrecord`;
CREATE TABLE `constructionrecord` (
  `crid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `cid` int(11) NULL COMMENT '工程单ID',
  `ouid` int(11) NOT NULL COMMENT '操作人ID',
  `operateTime` timestamp NULL COMMENT '操作时间',
  `type` tinyint(1) NULL DEFAULT 0 COMMENT '类型 , 0: 通用',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`crid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程记录';

DROP TABLE IF EXISTS `constructionschedule`;
CREATE TABLE `constructionschedule` (
  `csid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '工程ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单ID',
  `name` varchar(32) NULL,
  `cnid` int(11) NOT NULL,
  `period` int(8) NULL DEFAULT 0,
  `prenum` int(11) NOT NULL DEFAULT 0 COMMENT '前期工程量',
  `postnum` int(11) NOT NULL DEFAULT 0 COMMENT '后期工程量',
  `preStartTime` timestamp NULL,
  `preEndTime` timestamp NULL,
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开工时间',
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '完工时间',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '工程进度状态',
  `schedule` tinyint(1) NOT NULL COMMENT '工程进度',
  `checkout` tinyint(1) NULL DEFAULT 0,
  `scheduleStatus` tinyint(1) NULL DEFAULT 0,
  `enterTime` timestamp NULL COMMENT '进场时间',
  `leaveTime` timestamp NULL COMMENT '离场时间',
  `workStatus` tinyint(1) NOT NULL DEFAULT 0 COMMENT ' 工作状态 , 0: 初始 , 1: 入场 , 2: 出场',
  `isUpload` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否上传图片，0:否，1:是',
  `accessoryLimit` int(8) NULL DEFAULT 0 COMMENT '辅料总额限制',
  `accessoryTotal` int(8) NULL DEFAULT 0 COMMENT '辅料总额',
  `salaryLimit` int(8) NULL DEFAULT 0 COMMENT '工费总额限制',
  `salaryLimitTotal` int(8) NULL DEFAULT 0,
  `salaryTotal` int(8) NULL DEFAULT 0 COMMENT '工费总额',
  `precheck` int(8) NULL DEFAULT 0,
  `postcheck` int(8) NULL DEFAULT 0,
  `stacheck` int(8) NULL DEFAULT 0,
  `fincheck` int(8) NULL DEFAULT 0,
  PRIMARY KEY (`csid`),
  KEY `indexone` (`orderId`) USING BTREE,
  KEY `indextwo` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24884 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程进度表';

DROP TABLE IF EXISTS `customerservicebackvisit`;
CREATE TABLE `customerservicebackvisit` (
  `csbvId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `orderAddr` varchar(128) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `backVisitTime` date NOT NULL,
  `backVisitType` tinyint(1) NOT NULL DEFAULT 0,
  `backVisitDes` varchar(256) NOT NULL,
  PRIMARY KEY (`csbvId`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=325 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客服回访表';

DROP TABLE IF EXISTS `customerservicecomplaint`;
CREATE TABLE `customerservicecomplaint` (
  `cscId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `createrId` varchar(15) NULL,
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
  `cuid` int(11) NOT NULL,
  PRIMARY KEY (`cscId`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=519 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客服投诉表';

DROP TABLE IF EXISTS `customerserviceguarantee`;
CREATE TABLE `customerserviceguarantee` (
  `csgId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `guaranteeTime` date NOT NULL,
  `guaranteeDes` varchar(256) NOT NULL,
  PRIMARY KEY (`csgId`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客服保修表';

DROP TABLE IF EXISTS `drawline`;
CREATE TABLE `drawline` (
  `dlId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `applayTime` timestamp NULL,
  `content` varchar(100) NULL,
  `actualTime` int(8) NULL DEFAULT 0,
  `startTime` timestamp NULL,
  `endTime` timestamp NULL,
  `status` tinyint(1) NULL COMMENT '排队,申请放线,放线失败,放线成功',
  `count` int(11) NULL DEFAULT 1,
  `company` int(11) NOT NULL,
  `auid` int(11) NULL,
  `dluid` int(11) NULL,
  `dgid` int(11) NULL,
  PRIMARY KEY (`dlId`),
  KEY `indexfour` (`dgid`) USING BTREE,
  KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexthr` (`status`, `startTime`, `endTime`) USING BTREE,
  KEY `indextwo` (`status`, `applayTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2353 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单放线表';

DROP TABLE IF EXISTS `inspectionrecord`;
CREATE TABLE `inspectionrecord` (
  `irId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `orderAddr` varchar(128) NOT NULL,
  `operaterId` varchar(15) NULL,
  `operaterName` varchar(32) NOT NULL,
  `startTime` timestamp NULL,
  `recordDes` varchar(256) NOT NULL,
  `endTime` timestamp NULL,
  `ouid` int(11) NOT NULL,
  PRIMARY KEY (`irId`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='巡检记录表';

DROP TABLE IF EXISTS `qualiter`;
CREATE TABLE `qualiter` (
  `qid` int(11) NOT NULL AUTO_INCREMENT COMMENT '质检ID',
  `cid` int(11) NOT NULL COMMENT '工程单ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `wuid` int(11) NOT NULL COMMENT '施工人员',
  `schedule` int(11) NULL COMMENT '施工进度',
  `rate` tinyint(1) NULL DEFAULT 0 COMMENT '评分',
  `assessment` varchar(128) NULL COMMENT '评价',
  `cuid` int(1) NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态',
  PRIMARY KEY (`qid`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `rework`;
CREATE TABLE `rework` (
  `rwId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `createrId` varchar(15) NULL,
  `createrName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `reworkDes` varchar(256) NOT NULL,
  `cuid` int(11) NOT NULL,
  PRIMARY KEY (`rwId`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=349 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='返工表';

DROP TABLE IF EXISTS `reworkdrawing`;
CREATE TABLE `reworkdrawing` (
  `rwdId` int(11) NOT NULL AUTO_INCREMENT,
  `rwId` int(11) NOT NULL,
  `rwdName` varchar(15) NOT NULL,
  `rwdUrl` varchar(256) NOT NULL,
  `rwdAddUrl` varchar(256) NOT NULL,
  `operatorName` varchar(32) NOT NULL DEFAULT '',
  `operateTime` timestamp NULL,
  PRIMARY KEY (`rwdId`),
  KEY `indexone` (`rwId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=627 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='返工图片表';
