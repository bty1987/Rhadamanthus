CREATE DATABASE IF NOT EXISTS `balance`;
USE `balance`;

-- Generated at 2026-01-06 08:11:03
-- Total tables: 15

DROP TABLE IF EXISTS `apportdetail`;
CREATE TABLE `apportdetail` (
  `adid` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) NULL,
  `cuid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `money` bigint(10) NOT NULL DEFAULT 0,
  `comment` varchar(128) NULL,
  PRIMARY KEY (`adid`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `balance`;
CREATE TABLE `balance` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(128) NULL,
  `cuid` int(11) NULL,
  `buid` int(11) NULL,
  `bluid` int(11) NULL,
  `pyuid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startTime` timestamp NULL,
  `endTime` timestamp NULL,
  `balanceTime` timestamp NULL,
  `payedTime` timestamp NULL,
  `amount` int(10) NOT NULL DEFAULT 0,
  `surplus` int(10) NOT NULL DEFAULT 0,
  `cutpay` int(10) NOT NULL DEFAULT 0 COMMENT '总额',
  `isPay` tinyint(1) NOT NULL DEFAULT 0 COMMENT '付款标识 , 0: 未付 , 1: 已付',
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0:初始',
  `company` int(11) NULL,
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `balanceaccount`;
CREATE TABLE `balanceaccount` (
  `baid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `no` varchar(64) NULL,
  `address` varchar(64) NULL,
  `phone` varchar(32) NULL,
  `bank` varchar(64) NULL,
  `bankno` varchar(64) NULL,
  `buid` int(11) NULL,
  `cuid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `referMoney` int(11) NOT NULL,
  `realMoney` int(11) NOT NULL,
  `surplus` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NULL,
  PRIMARY KEY (`baid`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `balancecutpay`;
CREATE TABLE `balancecutpay` (
  `bcid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `bid` int(11) NULL,
  `bdid` int(11) NULL,
  `bccid` int(11) NULL,
  `money` bigint(10) NULL DEFAULT 0,
  `total` bigint(10) NULL DEFAULT 0 COMMENT '总额',
  `buid` int(11) NULL,
  `ouid` int(11) NOT NULL,
  `bluid` int(11) NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 , 0: 扣款 , 1: 返款',
  `atttype` tinyint(1) NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 初始 , 1: 绑定 (0:初始)',
  `comment` varchar(128) NULL,
  PRIMARY KEY (`bcid`)
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `balancedccount`;
CREATE TABLE `balancedccount` (
  `bdid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) NULL,
  `buid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startTime` timestamp NULL,
  `endTime` timestamp NULL,
  `cutpay` int(11) NOT NULL COMMENT '总额',
  `surplus` int(11) NOT NULL COMMENT '余额',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 , 0: 扣款 , 1: 返款',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 有效 , 1: 失效',
  `comment` varchar(128) NULL COMMENT '说明',
  PRIMARY KEY (`bdid`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `balancedetail`;
CREATE TABLE `balancedetail` (
  `bdid` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) NULL,
  `baid` int(11) NULL,
  `ouid` int(11) NOT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `money` bigint(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`bdid`)
) ENGINE=InnoDB AUTO_INCREMENT=300 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `balanceoales`;
CREATE TABLE `balanceoales` (
  `boid` int(11) NOT NULL AUTO_INCREMENT COMMENT '结算外销ID',
  `bid` int(11) NULL DEFAULT 0 COMMENT '结算单ID',
  `name` varchar(36) NOT NULL COMMENT '名称',
  `grade` varchar(36) NULL DEFAULT 'A' COMMENT '等级',
  `profit` int(10) NULL DEFAULT 0 COMMENT '利润',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态,0:初始,1:结算,2:完结 (0:初始)',
  `cuid` int(11) NULL COMMENT '创建人',
  `buid` int(11) NULL COMMENT '结算人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `balanceTime` timestamp NULL COMMENT '结算时间',
  `lockTime` timestamp NULL COMMENT '锁定时间',
  `company` int(11) NULL DEFAULT 1 COMMENT '公司',
  PRIMARY KEY (`boid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='结算外销';

DROP TABLE IF EXISTS `balanceoalesitem`;
CREATE TABLE `balanceoalesitem` (
  `boiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '结算外销明细ID',
  `boid` int(11) NOT NULL COMMENT '结算外销ID',
  `oid` int(11) NOT NULL COMMENT '外销单ID',
  PRIMARY KEY (`boiid`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='结算外销明细';

DROP TABLE IF EXISTS `balancepicture`;
CREATE TABLE `balancepicture` (
  `bpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `bid` int(11) NULL COMMENT '结算单ID',
  `pid` int(11) NULL COMMENT '关联项ID, 0: 扣款ID',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `path` varchar(255) NOT NULL COMMENT '路径',
  `filesize` int(10) NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL COMMENT '类型 0: 扣款ID',
  `cuid` int(11) NOT NULL COMMENT '创建人id',
  `createTime` timestamp NULL COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`bpid`),
  KEY `indexone` (`bid`) USING BTREE,
  KEY `indextwo` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='结算图片';

DROP TABLE IF EXISTS `balancesales`;
CREATE TABLE `balancesales` (
  `bsid` int(11) NOT NULL AUTO_INCREMENT COMMENT '结算销售ID',
  `bid` int(11) NULL DEFAULT 0 COMMENT '结算单ID',
  `name` varchar(36) NOT NULL COMMENT '名称',
  `brid` int(11) NULL COMMENT '品牌ID',
  `grade` varchar(36) NULL DEFAULT 'A' COMMENT '等级',
  `income` bigint(10) NULL DEFAULT 0 COMMENT '收入',
  `cost` bigint(10) NULL DEFAULT 0 COMMENT '成本',
  `payment` bigint(10) NULL DEFAULT 0 COMMENT '应付',
  `profit` bigint(10) NULL DEFAULT 0 COMMENT '利润',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态,0:初始,1:结算,2:完结 (0:初始)',
  `atttype` tinyint(1) NULL DEFAULT 0 COMMENT '业务类型 0: 通用 , 1: 补贴',
  `company` int(11) NULL DEFAULT 1 COMMENT '公司',
  `cuid` int(11) NULL COMMENT '创建人',
  `suid` int(11) NULL,
  `buid` int(11) NULL COMMENT '结算人',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `balancetime` timestamp NULL COMMENT '结算时间',
  `locktime` timestamp NULL COMMENT '锁定时间',
  PRIMARY KEY (`bsid`)
) ENGINE=InnoDB AUTO_INCREMENT=268 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='结算销售';

DROP TABLE IF EXISTS `balancesalesbalance`;
CREATE TABLE `balancesalesbalance` (
  `bsbid` int(11) NOT NULL AUTO_INCREMENT COMMENT '销售结算ID',
  `bsid` int(11) NOT NULL COMMENT '结算结算ID',
  `sbid` int(11) NOT NULL,
  PRIMARY KEY (`bsbid`)
) ENGINE=InnoDB AUTO_INCREMENT=920 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售结算';

DROP TABLE IF EXISTS `balanceselection`;
CREATE TABLE `balanceselection` (
  `bsid` int(11) NOT NULL AUTO_INCREMENT COMMENT '结算选材ID',
  `bid` int(11) NULL DEFAULT 0 COMMENT '结算单ID',
  `name` varchar(36) NOT NULL COMMENT '名称',
  `brid` int(11) NULL COMMENT '品牌ID',
  `grade` varchar(36) NULL DEFAULT 'A' COMMENT '等级',
  `income` bigint(10) NULL DEFAULT 0 COMMENT '收入',
  `cost` bigint(10) NULL DEFAULT 0 COMMENT '成本',
  `payment` bigint(10) NULL DEFAULT 0 COMMENT '应付',
  `profit` bigint(10) NULL DEFAULT 0 COMMENT '利润',
  `discount` int(8) NULL DEFAULT 0,
  `cuid` int(11) NULL COMMENT '创建人',
  `auid` int(11) NULL,
  `buid` int(11) NULL COMMENT '结算人',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `locktime` timestamp NULL COMMENT '锁定时间',
  `auditTime` timestamp NULL,
  `balancetime` timestamp NULL COMMENT '结算时间',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态,0:初始,1:锁定,2:审核/待审,3:结算/审核,4:完结 (0:初始)',
  `atttype` tinyint(1) NULL DEFAULT 0 COMMENT '业务类型 0: 通用 , 1: 补贴',
  `company` int(11) NULL DEFAULT 1 COMMENT '公司',
  PRIMARY KEY (`bsid`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `balanceselectionitem`;
CREATE TABLE `balanceselectionitem` (
  `bsiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '结算选材ID',
  `bsid` int(11) NOT NULL COMMENT '结算选材ID',
  `siid` int(11) NOT NULL,
  PRIMARY KEY (`bsiid`)
) ENGINE=InnoDB AUTO_INCREMENT=579 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `balanceselectionrecord`;
CREATE TABLE `balanceselectionrecord` (
  `bsrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `bsid` int(11) NULL COMMENT '客户',
  `ouid` int(11) NULL COMMENT '操作人',
  `operateTime` timestamp NULL COMMENT '操作时间',
  `type` tinyint(1) NULL COMMENT '类型',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`bsrid`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='结算选材记录';

DROP TABLE IF EXISTS `comcost`;
CREATE TABLE `comcost` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `orderId` varchar(128) NULL,
  `ident` int(11) NULL,
  `money` int(11) NOT NULL,
  `cuid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(11) NOT NULL DEFAULT 0,
  `comment` varchar(11) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;
