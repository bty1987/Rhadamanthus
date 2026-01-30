CREATE DATABASE IF NOT EXISTS `salary`;
USE `salary`;

-- Generated at 2026-01-06 08:11:04
-- Total tables: 8

DROP TABLE IF EXISTS `decorationsalary`;
CREATE TABLE `decorationsalary` (
  `dsid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL COMMENT '装修单号',
  `buid` int(11) NOT NULL COMMENT '归属人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `period` int(5) NOT NULL COMMENT '账期',
  `money` bigint(10) NOT NULL COMMENT '金额',
  `rate` int(5) NOT NULL COMMENT '比例',
  `type` tinyint(1) NOT NULL COMMENT '0: 设计, 1: 业务',
  `atttype` tinyint(1) NOT NULL COMMENT '0: 设计费, 1: 业绩',
  `stage` tinyint(1) NOT NULL COMMENT '阶段, 0: 全部, 1: 首提, 2: 中提, 3: 尾提',
  `level` tinyint(1) NOT NULL COMMENT '等级',
  `status` tinyint(1) NOT NULL COMMENT '0: 有效, 1: 无效',
  `comment` varchar(64) NULL COMMENT '备注',
  PRIMARY KEY (`dsid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='设计提成';

DROP TABLE IF EXISTS `materialsalary`;
CREATE TABLE `materialsalary` (
  `msid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL,
  `sid` int(11) NULL,
  `sbid` int(11) NULL,
  `buid` int(11) NULL,
  `createTime` timestamp NULL,
  `period` varchar(15) NULL,
  `money` bigint(10) NULL,
  `rate` bigint(10) NULL,
  `stage` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(32) NULL,
  PRIMARY KEY (`msid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salary`;
CREATE TABLE `salary` (
  `sid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键Id',
  `uid` int(11) NOT NULL COMMENT '员工编号',
  `type` tinyint(4) NOT NULL COMMENT '类型',
  `onetype` tinyint(4) NOT NULL COMMENT '一类',
  `twotype` tinyint(4) NOT NULL COMMENT '二类',
  `thrtype` tinyint(4) NOT NULL COMMENT '三类',
  `money` bigint(10) NOT NULL DEFAULT 0 COMMENT '操作金额',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '状态',
  `ouid` varchar(15) NULL COMMENT '操作人',
  `operateTime` timestamp NULL COMMENT '操作时间',
  `comment` varchar(128) NULL COMMENT '说明',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='通用薪资';

DROP TABLE IF EXISTS `salarydrawing`;
CREATE TABLE `salarydrawing` (
  `sdid` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `sid` int(11) NOT NULL COMMENT '关联ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `drawingUrl` varchar(255) NOT NULL COMMENT '图片路径',
  `drawingType` int(11) NOT NULL COMMENT '图片类型 , 0: 本地 , 1: 钉钉',
  `type` int(11) NOT NULL COMMENT ' 类型 , 0: 工费',
  `filesize` int(10) NULL DEFAULT 0,
  `creater` int(11) NULL COMMENT '创建人 , 类型 user',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` int(11) NULL DEFAULT 0 COMMENT ' 0: 有效 , 1: 无效',
  PRIMARY KEY (`sdid`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salaryrecording`;
CREATE TABLE `salaryrecording` (
  `srid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(2) NOT NULL,
  `comment` varchar(255) NULL,
  PRIMARY KEY (`srid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `withhold`;
CREATE TABLE `withhold` (
  `wid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `orderId` varchar(15) NOT NULL,
  `ident` int(11) NOT NULL,
  `money` bigint(10) NOT NULL DEFAULT 0,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `ouid` int(11) NOT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`wid`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `workerbalance`;
CREATE TABLE `workerbalance` (
  `wbid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `deposit` bigint(10) NOT NULL DEFAULT 0,
  `salary` bigint(10) NOT NULL DEFAULT 0,
  `toplimit` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`wbid`),
  KEY `oneindex` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=400 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工人账户';

DROP TABLE IF EXISTS `workersalary`;
CREATE TABLE `workersalary` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL,
  `cid` int(11) NOT NULL,
  `csid` int(11) NOT NULL,
  `cwsid` int(11) NOT NULL DEFAULT 0,
  `cnid` int(11) NULL DEFAULT 0,
  `schedule` tinyint(4) NULL DEFAULT 0,
  `money` bigint(10) NOT NULL DEFAULT 0,
  `deposit` bigint(10) NOT NULL DEFAULT 0,
  `salary` bigint(10) NOT NULL DEFAULT 0,
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `onetype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0:工费, 1:扣/罚, 2:转额, 3:其他',
  `twotype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1:工费, 2:增项, 3:油工一级奖励, 4:维修款, 5:罚款, 6:工程质保金, 7:工具押金, 8:借款, 9:工人家属保险, 11:预支',
  `subtype` tinyint(4) NULL DEFAULT 0 COMMENT '子类型',
  `isSend` tinyint(1) NULL DEFAULT 0,
  `isAppr` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0:初始',
  `wuid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL,
  `auid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approveTime` timestamp NULL,
  `balanceTime` timestamp NULL,
  `company` int(11) NOT NULL,
  `comment` varchar(64) NULL,
  `count` int(11) NULL DEFAULT 0,
  `ruid` int(11) NULL,
  `checkTime` timestamp NULL,
  `isCheck` tinyint(1) NULL DEFAULT 0,
  `annotate` varchar(64) NULL,
  PRIMARY KEY (`wsid`),
  KEY `indexone` (`createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5830 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工人工费';
