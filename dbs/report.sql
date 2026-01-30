CREATE DATABASE IF NOT EXISTS `report`;
USE `report`;

-- Generated at 2026-01-06 08:11:03
-- Total tables: 27

DROP TABLE IF EXISTS `approval7achievement`;
CREATE TABLE `approval7achievement` (
  `aaid` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(5) NOT NULL DEFAULT 0 COMMENT '年份',
  `month` int(5) NOT NULL DEFAULT 0 COMMENT '月份',
  `type` tinyint(4) NOT NULL DEFAULT 0 COMMENT '类型',
  `cs0` bigint(10) NOT NULL DEFAULT 0 COMMENT '总数',
  `cs1` bigint(10) NOT NULL DEFAULT 0 COMMENT '创建数量',
  `cs2` bigint(10) NOT NULL DEFAULT 0 COMMENT '未处理数量',
  `cs3` bigint(10) NOT NULL DEFAULT 0 COMMENT '通过数量',
  `cs4` bigint(10) NOT NULL DEFAULT 0 COMMENT '驳回数量',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`aaid`)
) ENGINE=InnoDB AUTO_INCREMENT=457 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `checkwork`;
CREATE TABLE `checkwork` (
  `cwId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `workDate` date NOT NULL,
  `checkType` tinyint(4) NOT NULL COMMENT '1: OnDuty 上班 , 2: OffDuty 下班',
  `sourceType` tinyint(4) NOT NULL COMMENT '1: ATM 考勤机 , 2: USER 用户打卡 , 3: BOSS 老板改签 , 4: APPROVE 审批 , 5: RECHECK 重新计算 , 6: SYSTEM 考勤系统',
  `result` tinyint(4) NOT NULL COMMENT '1: Normal 正常 , 2: Early 早退 , 3: Late 迟到 , 4: SeriousLate 严重迟到 , 5: NotSigned 未打卡',
  `location` tinyint(4) NOT NULL COMMENT '1: Normal 范围内 , 2: Outside 范围外',
  `baseTime` timestamp NULL COMMENT '基准时间 , 计算迟到和早退',
  `checkTime` timestamp NULL COMMENT '打卡时间',
  PRIMARY KEY (`cwId`),
  KEY `indexone` (`userId`, `workDate`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='考勤记录';

DROP TABLE IF EXISTS `construction7achievement`;
CREATE TABLE `construction7achievement` (
  `caid` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(5) NOT NULL DEFAULT 0 COMMENT '年份',
  `month` int(5) NOT NULL DEFAULT 0 COMMENT '月份',
  `cs0` bigint(10) NOT NULL DEFAULT 0 COMMENT '未开工数',
  `cs1` bigint(10) NOT NULL DEFAULT 0 COMMENT '开工数',
  `cs2` bigint(10) NOT NULL DEFAULT 0 COMMENT '完工数',
  `cs3` bigint(10) NOT NULL DEFAULT 0 COMMENT '砌墙',
  `cs4` bigint(10) NOT NULL DEFAULT 0 COMMENT '铲大白',
  `cs5` bigint(10) NOT NULL DEFAULT 0 COMMENT '放线',
  `cs6` bigint(10) NOT NULL DEFAULT 0 COMMENT '水暖',
  `cs7` bigint(10) NOT NULL DEFAULT 0 COMMENT '力工',
  `cs8` bigint(10) NOT NULL DEFAULT 0 COMMENT '电工',
  `cs9` bigint(10) NOT NULL DEFAULT 0 COMMENT '瓦工',
  `cs10` bigint(10) NOT NULL DEFAULT 0 COMMENT '地面找平',
  `cs11` bigint(10) NOT NULL DEFAULT 0 COMMENT '木工',
  `cs12` bigint(10) NOT NULL DEFAULT 0 COMMENT '油工',
  `cs13` bigint(10) NOT NULL DEFAULT 0 COMMENT '水电验收',
  `cs14` bigint(10) NOT NULL DEFAULT 0 COMMENT '保洁',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`caid`),
  UNIQUE KEY `year` (`year`, `month`, `company`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程状态统计';

DROP TABLE IF EXISTS `ddepartmentcountdetail`;
CREATE TABLE `ddepartmentcountdetail` (
  `ddcdId` int(11) NOT NULL AUTO_INCREMENT,
  `ddId` int(11) NOT NULL COMMENT '设计部ID',
  `sdId` int(11) NOT NULL COMMENT '业务部ID',
  `createNum` decimal(10,3) NOT NULL DEFAULT 0.000,
  `signNum` decimal(10,3) NOT NULL DEFAULT 0.000,
  `contractPrice` decimal(10,3) NULL DEFAULT 0.000,
  `createDate` date NOT NULL,
  PRIMARY KEY (`ddcdId`),
  KEY `indexone` (`ddId`, `createDate`) USING BTREE,
  KEY `indextwo` (`sdId`, `createDate`) USING BTREE,
  UNIQUE KEY `uniqueone` (`ddId`, `sdId`, `createDate`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='尺源部门统计详细';

DROP TABLE IF EXISTS `decoration4construction`;
CREATE TABLE `decoration4construction` (
  `dcid` int(11) NOT NULL AUTO_INCREMENT,
  `cdid` int(11) NOT NULL,
  `cs0` int(8) NOT NULL DEFAULT 0 COMMENT '未开工',
  `cs1` int(8) NOT NULL DEFAULT 0 COMMENT '已开工',
  `cs2` int(8) NOT NULL DEFAULT 0 COMMENT '已完工',
  `cs3` int(8) NOT NULL DEFAULT 0 COMMENT '铲大白',
  `cs4` int(8) NOT NULL DEFAULT 0 COMMENT '放线',
  `cs5` int(8) NOT NULL DEFAULT 0 COMMENT '水暖',
  `cs6` int(8) NOT NULL DEFAULT 0 COMMENT '力工',
  `cs7` int(8) NOT NULL DEFAULT 0 COMMENT '电工',
  `cs8` int(8) NOT NULL DEFAULT 0 COMMENT '瓦工',
  `cs9` int(8) NOT NULL DEFAULT 0 COMMENT '地面找平',
  `cs10` int(8) NOT NULL DEFAULT 0 COMMENT '木工',
  `cs11` int(8) NOT NULL DEFAULT 0 COMMENT '油工',
  `cs12` int(8) NOT NULL DEFAULT 0 COMMENT '水电验收',
  `cs13` int(8) NOT NULL DEFAULT 0 COMMENT '保洁',
  `cs14` int(8) NOT NULL,
  `cs15` int(8) NOT NULL,
  `cs16` int(8) NOT NULL,
  `cs17` int(8) NOT NULL,
  `cs18` int(8) NOT NULL,
  `cs19` int(8) NOT NULL,
  `cs20` int(8) NOT NULL,
  `cs21` int(8) NOT NULL,
  `cs22` int(8) NOT NULL,
  `cs23` int(8) NOT NULL,
  `cs24` int(8) NOT NULL,
  `cs25` int(8) NOT NULL,
  `cs26` int(8) NOT NULL,
  PRIMARY KEY (`dcid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修进度统计表';

DROP TABLE IF EXISTS `decoration7achievement`;
CREATE TABLE `decoration7achievement` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `did` int(11) NULL COMMENT '部门',
  `year` int(5) NULL DEFAULT 0 COMMENT '年份',
  `month` int(5) NULL DEFAULT 0 COMMENT '月份',
  `typeness` tinyint(4) NOT NULL DEFAULT 0 COMMENT '类型 , 0: 半包 , 1: 整装 , 2: 半价 , 3: 满减 , 4: 减上捡, 5: 达额减',
  `cs0` bigint(10) NOT NULL DEFAULT 0 COMMENT '签单数',
  `cs1` bigint(10) NOT NULL DEFAULT 0 COMMENT '设计数',
  `cs2` bigint(10) NOT NULL DEFAULT 0 COMMENT '签单额',
  `cs3` bigint(10) NOT NULL DEFAULT 0 COMMENT '净业绩',
  `cs4` bigint(10) NOT NULL DEFAULT 0 COMMENT '设计额',
  `cs5` bigint(10) NOT NULL DEFAULT 0 COMMENT '服务费',
  `cs6` bigint(10) NOT NULL DEFAULT 0 COMMENT '未签设计数',
  `cs7` bigint(10) NOT NULL DEFAULT 0 COMMENT '未签单设计费',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`daid`),
  UNIQUE KEY `did` (`did`, `year`, `month`, `company`, `typeness`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3560 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `decoration7operation`;
CREATE TABLE `decoration7operation` (
  `doid` int(11) NOT NULL AUTO_INCREMENT,
  `s0` varchar(15) NOT NULL COMMENT '装修单号',
  `s1` timestamp NULL COMMENT '预签时间',
  `s2` timestamp NULL COMMENT '签单时间',
  `s3` timestamp NULL COMMENT '决算时间',
  `s4` int(5) NULL COMMENT '订单类型',
  `s5` varchar(15) NULL COMMENT '房屋类别',
  `s6` int(5) NULL COMMENT '非业务提成',
  `s7` int(5) NULL COMMENT '非业务比例',
  `s8` int(11) NULL COMMENT '预签额',
  `s9` int(11) NULL COMMENT '签单额',
  `s10` int(11) NULL COMMENT '实收额',
  `s11` int(11) NULL COMMENT '计业绩券',
  `s12` int(11) NULL COMMENT '计金额券',
  `s13` int(11) NULL COMMENT '特批券',
  `s14` int(11) NULL COMMENT '物品',
  `s15` int(11) NULL COMMENT '服务费',
  `s16` int(11) NULL COMMENT '主材总额',
  `s17` int(11) NULL COMMENT '最终签单额',
  `s18` int(11) NULL COMMENT '设计费',
  `s19` int(11) NULL COMMENT '报价总额',
  `s20` int(11) NULL COMMENT '折前总价',
  `s21` int(11) NULL COMMENT '不打折总额',
  `s22` int(11) NULL COMMENT '打折总额',
  `s23` int(11) NULL COMMENT '车运费',
  `s24` int(11) NULL COMMENT '管理费',
  `s25` int(5) NULL COMMENT '管理费提点',
  `s26` int(11) NULL COMMENT '运输费',
  `s27` varchar(36) NULL COMMENT '业务类型',
  `s28` int(5) NULL COMMENT '工程状态',
  `s29` varchar(32) NULL COMMENT '监理ID',
  `s30` int(5) NULL COMMENT '付款比例',
  `s31` varchar(1) NULL COMMENT '订单等级',
  `s32` varchar(32) NULL COMMENT '报价员ID',
  `s33` varchar(10) NULL COMMENT '房屋类型',
  `s34` int(11) NULL COMMENT '首付款',
  `s35` timestamp NULL COMMENT '收款时间',
  `s36` int(11) NULL COMMENT '券值',
  `s37` varchar(512) NULL COMMENT '券信息',
  `s38` int(11) NULL COMMENT '首付二期款',
  `s39` timestamp NULL COMMENT '收款时间',
  `s40` int(11) NULL COMMENT '券值',
  `s41` varchar(512) NULL COMMENT '券信息',
  `s42` int(11) NULL COMMENT '二期款',
  `s43` timestamp NULL COMMENT '收款时间',
  `s44` int(11) NULL COMMENT '券值',
  `s45` varchar(512) NULL COMMENT '券信息',
  `s46` int(11) NULL COMMENT '尾款',
  `s47` timestamp NULL COMMENT '尾款时间',
  `s48` int(11) NULL COMMENT '券值',
  `s49` varchar(512) NULL COMMENT '券信息',
  `s50` int(11) NULL COMMENT '违约金',
  `s51` int(11) NULL COMMENT '预付款余额',
  `s52` int(11) NULL COMMENT '未付款金额',
  `s53` int(11) NULL COMMENT '满减金额',
  `s54` int(5) NULL COMMENT '业绩归属月份',
  `s55` int(5) NULL COMMENT '发生月',
  `s56` int(5) NULL COMMENT '操作业务类型',
  `s57` int(11) NULL COMMENT '归属人ID',
  `s58` int(11) NULL COMMENT '归属人部门ID',
  `s59` int(11) NULL COMMENT '归属人分区ID',
  `s60` int(5) NULL COMMENT '当前操作类型',
  `s61` timestamp NULL COMMENT '当前操作时间',
  `s62` int(5) NULL COMMENT '比例',
  PRIMARY KEY (`doid`)
) ENGINE=InnoDB AUTO_INCREMENT=1965 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修单信息统计';

DROP TABLE IF EXISTS `decorationdepartmentrank`;
CREATE TABLE `decorationdepartmentrank` (
  `dddrid` int(11) NOT NULL AUTO_INCREMENT,
  `ddid` int(11) NOT NULL,
  `drid` int(11) NOT NULL COMMENT '分区',
  `month` int(11) NOT NULL,
  `rank` bigint(10) NOT NULL DEFAULT 0,
  `rank1` int(5) NULL DEFAULT 0 COMMENT '全部门排名',
  `rank2` int(5) NULL DEFAULT 0 COMMENT '分区排名',
  `sachi` bigint(10) NOT NULL DEFAULT 0 COMMENT '主材业绩',
  `srankd` int(5) NOT NULL DEFAULT 0 COMMENT '主材部门排名',
  `srankr` int(5) NOT NULL DEFAULT 0 COMMENT '主材分区排名',
  `tachi` bigint(10) NOT NULL DEFAULT 0 COMMENT '总业绩',
  `trankd` int(5) NOT NULL DEFAULT 0 COMMENT '总业绩部门排名',
  `trankr` int(5) NOT NULL DEFAULT 0 COMMENT '总业绩分区排名',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0:设计, 1:业务',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dddrid`),
  UNIQUE KEY `indexone` (`ddid`, `month`, `company`, `type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2272 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程设计部门业绩排名';

DROP TABLE IF EXISTS `decorationrank`;
CREATE TABLE `decorationrank` (
  `ddrid` int(11) NOT NULL AUTO_INCREMENT,
  `duid` int(11) NOT NULL,
  `ddid` int(11) NOT NULL COMMENT '设计部门',
  `drid` int(11) NOT NULL COMMENT '设计分区',
  `month` int(11) NOT NULL,
  `rank` bigint(10) NOT NULL DEFAULT 0 COMMENT '计算值',
  `rank1` int(5) NOT NULL DEFAULT 0 COMMENT '全员排名',
  `rank2` int(5) NOT NULL DEFAULT 0 COMMENT '部门排名',
  `rank3` int(5) NOT NULL DEFAULT 0 COMMENT '分区排名',
  `sachi` bigint(10) NOT NULL DEFAULT 0 COMMENT '主材业绩',
  `sranku` int(5) NOT NULL DEFAULT 0 COMMENT '主材人员排名',
  `srankd` int(5) NOT NULL DEFAULT 0 COMMENT '主材部门排名',
  `srankr` int(5) NOT NULL DEFAULT 0 COMMENT '主材分区排名',
  `tachi` bigint(10) NOT NULL DEFAULT 0 COMMENT '总业绩',
  `tranku` int(5) NOT NULL DEFAULT 0 COMMENT '总业绩人员排名',
  `trankd` int(5) NOT NULL DEFAULT 0 COMMENT '总业绩部门排名',
  `trankr` int(5) NOT NULL DEFAULT 0 COMMENT '总业绩分区排名',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0:设计, 1:业务',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ddrid`),
  UNIQUE KEY `indexone` (`duid`, `month`, `company`, `ddid`, `drid`, `type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4023 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程设计师业绩排名';

DROP TABLE IF EXISTS `decorationregionrank`;
CREATE TABLE `decorationregionrank` (
  `ddrrid` int(11) NOT NULL AUTO_INCREMENT,
  `drid` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `rank` bigint(10) NOT NULL DEFAULT 0,
  `rank1` int(5) NULL DEFAULT 0 COMMENT '全分区排名',
  `sachi` bigint(10) NOT NULL COMMENT '主材业绩',
  `srankr` int(5) NOT NULL DEFAULT 0 COMMENT '主材分区排名',
  `tachi` bigint(10) NOT NULL DEFAULT 0 COMMENT '总业绩',
  `trankr` int(5) NOT NULL DEFAULT 0 COMMENT '总业绩分区排名',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0:设计, 1:业务',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ddrrid`),
  UNIQUE KEY `indexone` (`drid`, `month`, `company`, `type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1332 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程设计分区业绩排名';

DROP TABLE IF EXISTS `dregioncountdetail`;
CREATE TABLE `dregioncountdetail` (
  `drcdId` int(11) NOT NULL AUTO_INCREMENT,
  `ddId` int(11) NOT NULL COMMENT '设计分区ID',
  `sdId` int(11) NOT NULL COMMENT '业务分区ID',
  `createNum` decimal(10,3) NOT NULL DEFAULT 0.000,
  `signNum` decimal(10,3) NOT NULL DEFAULT 0.000,
  `contractPrice` decimal(10,3) NULL DEFAULT 0.000,
  `createDate` date NOT NULL,
  PRIMARY KEY (`drcdId`),
  KEY `indexone` (`ddId`, `createDate`) USING BTREE,
  KEY `indextwo` (`sdId`, `createDate`) USING BTREE,
  UNIQUE KEY `uniqueone` (`ddId`, `sdId`, `createDate`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='尺源分区统计详细';

DROP TABLE IF EXISTS `dusercountdetail`;
CREATE TABLE `dusercountdetail` (
  `ducdId` int(11) NOT NULL AUTO_INCREMENT,
  `duId` int(11) NOT NULL COMMENT '设计师ID',
  `suId` int(11) NOT NULL COMMENT '业务员ID',
  `createNum` decimal(10,3) NOT NULL DEFAULT 0.000,
  `signNum` decimal(10,3) NOT NULL DEFAULT 0.000,
  `contractPrice` decimal(10,3) NULL DEFAULT 0.000,
  `createDate` date NOT NULL,
  PRIMARY KEY (`ducdId`),
  KEY `indexone` (`duId`, `createDate`) USING BTREE,
  KEY `indextwo` (`suId`, `createDate`) USING BTREE,
  UNIQUE KEY `uniqueone` (`duId`, `suId`, `createDate`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='尺源人员统计详细';

DROP TABLE IF EXISTS `materialdepartmentcount`;
CREATE TABLE `materialdepartmentcount` (
  `mdcId` int(11) NOT NULL AUTO_INCREMENT,
  `materialDeptId` varchar(10) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`mdcId`),
  KEY `indexone` (`materialDeptId`, `createTime`) USING BTREE,
  UNIQUE KEY `uniqueone` (`materialDeptId`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材部门业绩统计';

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
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`mdcId`),
  KEY `indexone` (`designerId`, `createTime`) USING BTREE,
  UNIQUE KEY `uniqueone` (`designerId`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材设计师业绩统计';

DROP TABLE IF EXISTS `materialdesignerdepartmentcount`;
CREATE TABLE `materialdesignerdepartmentcount` (
  `mddcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`mddcId`),
  KEY `indexone` (`designerDeptId`, `createTime`) USING BTREE,
  UNIQUE KEY `uniqueone` (`designerDeptId`, `designerRegionId`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材设计部门业绩统计';

DROP TABLE IF EXISTS `materialdesignerdepartmentrank`;
CREATE TABLE `materialdesignerdepartmentrank` (
  `mddrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mddrId`),
  KEY `indexone` (`designerDeptId`, `status`, `createTime`, `endTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材设计部门排名';

DROP TABLE IF EXISTS `materialdesignerrank`;
CREATE TABLE `materialdesignerrank` (
  `mdrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerId` varchar(15) NOT NULL,
  `designerName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mdrId`),
  KEY `indexone` (`designerId`, `status`, `createTime`, `endTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材设计师排名';

DROP TABLE IF EXISTS `materialdesignerregioncount`;
CREATE TABLE `materialdesignerregioncount` (
  `mdrcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`mdrcId`),
  KEY `indexone` (`designerRegionId`, `createTime`) USING BTREE,
  UNIQUE KEY `uniqueone` (`designerRegionId`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材设计分区业绩统计';

DROP TABLE IF EXISTS `materialdesignerregionrank`;
CREATE TABLE `materialdesignerregionrank` (
  `mdrrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mdrrId`),
  KEY `indexone` (`designerRegionId`, `status`, `createTime`, `endTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材设计中心排名';

DROP TABLE IF EXISTS `sales7achievement`;
CREATE TABLE `sales7achievement` (
  `said` int(11) NOT NULL AUTO_INCREMENT,
  `did` int(11) NULL COMMENT '部门',
  `year` int(5) NOT NULL DEFAULT 0 COMMENT '年份',
  `month` int(5) NOT NULL DEFAULT 0 COMMENT '月份',
  `cs0` bigint(10) NOT NULL DEFAULT 0 COMMENT '销售单数',
  `cs1` bigint(10) NOT NULL DEFAULT 0 COMMENT '定金总额',
  `cs2` bigint(10) NOT NULL DEFAULT 0 COMMENT '补款总额',
  `cs3` bigint(10) NOT NULL DEFAULT 0 COMMENT '补款数',
  `cs4` bigint(10) NOT NULL DEFAULT 0 COMMENT '退货单数',
  `cs5` bigint(10) NOT NULL DEFAULT 0 COMMENT '退货总额',
  `cs6` bigint(10) NOT NULL DEFAULT 0 COMMENT '结算单数',
  `cs7` bigint(10) NOT NULL DEFAULT 0 COMMENT '结算总额',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`said`),
  UNIQUE KEY `did` (`did`, `year`, `month`, `company`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4929 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售业绩统计表';

DROP TABLE IF EXISTS `user7achievement`;
CREATE TABLE `user7achievement` (
  `uaid` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(5) NOT NULL DEFAULT 0 COMMENT '年份',
  `month` int(5) NOT NULL DEFAULT 0 COMMENT '月份',
  `cs0` bigint(10) NOT NULL DEFAULT 0 COMMENT '总数',
  `cs1` bigint(10) NOT NULL DEFAULT 0 COMMENT '在职总数',
  `cs2` bigint(10) NOT NULL DEFAULT 0 COMMENT '离职总数',
  `cs3` bigint(10) NOT NULL DEFAULT 0 COMMENT '入职人数',
  `cs4` bigint(10) NOT NULL DEFAULT 0 COMMENT '离职人数',
  `cs5` bigint(10) NOT NULL DEFAULT 0 COMMENT '调职人数',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`uaid`),
  UNIQUE KEY `year` (`year`, `month`, `company`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2928 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='人资状态统计表';

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
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`zdcId`),
  KEY `indexone` (`designerId`, `createTime`) USING BTREE,
  UNIQUE KEY `uniqueone` (`designerId`, `materialBrand`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='正林设计师业绩统计';

DROP TABLE IF EXISTS `zaterialdesignerdepartmentcount`;
CREATE TABLE `zaterialdesignerdepartmentcount` (
  `zddcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`zddcId`),
  KEY `indexone` (`designerDeptId`, `createTime`) USING BTREE,
  UNIQUE KEY `uniqueone` (`designerDeptId`, `materialBrand`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='正林设计部门业绩统计';

DROP TABLE IF EXISTS `zaterialdesignerdepartmentrank`;
CREATE TABLE `zaterialdesignerdepartmentrank` (
  `zddrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerDeptId` varchar(15) NOT NULL,
  `designerDeptName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`zddrId`),
  KEY `indexone` (`designerDeptId`, `status`, `createTime`, `endTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='正林设计部门排名';

DROP TABLE IF EXISTS `zaterialdesignerrank`;
CREATE TABLE `zaterialdesignerrank` (
  `zdrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerId` varchar(15) NOT NULL,
  `designerName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`zdrId`),
  KEY `indexone` (`designerId`, `status`, `createTime`, `endTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='正林设计师排名';

DROP TABLE IF EXISTS `zaterialdesignerregioncount`;
CREATE TABLE `zaterialdesignerregioncount` (
  `zdrcId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`zdrcId`),
  KEY `indexone` (`designerRegionId`, `createTime`) USING BTREE,
  UNIQUE KEY `uniqueone` (`designerRegionId`, `materialBrand`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='正林设计分区业绩统计';

DROP TABLE IF EXISTS `zaterialdesignerregionrank`;
CREATE TABLE `zaterialdesignerregionrank` (
  `zdrrId` int(11) NOT NULL AUTO_INCREMENT,
  `designerRegionId` varchar(15) NOT NULL,
  `designerRegionName` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `endTime` date NOT NULL,
  `rank` double NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`zdrrId`),
  KEY `indexone` (`designerRegionId`, `status`, `createTime`, `endTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='正林设计中心排名';
