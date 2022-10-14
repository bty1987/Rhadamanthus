CREATE DATABASE  IF NOT EXISTS `sales` ;
USE `sales`;

DROP TABLE IF EXISTS `oales`;
CREATE TABLE `oales` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `hid` int(11) NOT NULL DEFAULT '0',
  `cid` int(11) NOT NULL DEFAULT '0',
  `cuid` int(11) NOT NULL,
  `suid` int(11) DEFAULT NULL,
  `svuid` int(11) DEFAULT NULL,
  `mauid` int(11) DEFAULT NULL COMMENT '主材员',
  `chuid` int(11) DEFAULT NULL,
  `bid` int(11) NOT NULL,
  `category` varchar(32) NOT NULL,
  `brand` varchar(32) NOT NULL,
  `threshold` int(11) NOT NULL DEFAULT '0' COMMENT '系数',
  `profit` bigint(10) NOT NULL DEFAULT '0',
  `award` bigint(10) NOT NULL DEFAULT '0',
  `cost` int(11) NOT NULL DEFAULT '0' COMMENT '成本',
  `total` bigint(10) NOT NULL DEFAULT '0',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmTime` timestamp NULL DEFAULT NULL COMMENT '确认时间',
  `checkTime` timestamp NULL DEFAULT NULL COMMENT '复核时间',
  `finishTime` timestamp NULL DEFAULT NULL COMMENT '完结时间',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `atttype` tinyint(1) NOT NULL DEFAULT '0',
  `awardType` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(128) DEFAULT '',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`oid`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`suid`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8 COMMENT='外销单表';

DROP TABLE IF EXISTS `refunds`;
CREATE TABLE `refunds` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `spid` int(11) NOT NULL COMMENT '款项ID',
  `total` bigint(10) NOT NULL DEFAULT '0',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL COMMENT '结算时间',
  `comment` varchar(128) NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  PRIMARY KEY (`rid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='退货单';

DROP TABLE IF EXISTS `refundsitem`;
CREATE TABLE `refundsitem` (
  `riid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `rid` int(11) NOT NULL COMMENT '退货单ID',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `num` bigint(10) NOT NULL DEFAULT '0',
  `total` bigint(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`riid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='退货单';

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `ocuid` int(11) DEFAULT NULL,
  `company` int(11) NOT NULL DEFAULT '0',
  `dompany` int(11) NOT NULL,
  `pompany` int(11) NOT NULL,
  `grade` varchar(1) DEFAULT '',
  `hid` int(11) NOT NULL,
  `cid` int(11) DEFAULT NULL COMMENT '客户ID',
  `suid` int(11) NOT NULL COMMENT '业务员ID',
  `did` int(11) NOT NULL COMMENT '业务部门ID',
  `rid` int(11) NOT NULL COMMENT '业务分区ID',
  `guid` int(11) DEFAULT NULL COMMENT '导购员ID',
  `gdid` int(11) DEFAULT NULL COMMENT '导购部门ID',
  `iuid` int(11) NOT NULL COMMENT '驻店员ID',
  `category` varchar(32) NOT NULL,
  `fuid` int(11) DEFAULT NULL,
  `bid` int(11) NOT NULL,
  `brand` varchar(32) NOT NULL,
  `activityId` int(11) DEFAULT NULL,
  `ctype` tinyint(1) NOT NULL DEFAULT '2',
  `cvalue` int(11) NOT NULL DEFAULT '0',
  `createTime` timestamp NULL DEFAULT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL,
  `fullpayTime` timestamp NULL DEFAULT NULL,
  `finishTime` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `depositpay` bigint(10) NOT NULL DEFAULT '0',
  `depositpayStatus` tinyint(1) NOT NULL DEFAULT '-1',
  `fullpay` bigint(10) NOT NULL DEFAULT '0',
  `fullpayStatus` tinyint(1) NOT NULL DEFAULT '-1',
  `balanceStatus` tinyint(1) DEFAULT '0',
  `otherStatus` tinyint(1) NOT NULL DEFAULT '0',
  `total` bigint(10) NOT NULL DEFAULT '0',
  `amount` bigint(10) NOT NULL,
  `maling` int(8) NOT NULL DEFAULT '0',
  `venderMaling` int(8) NOT NULL DEFAULT '0',
  `coupon` int(8) NOT NULL DEFAULT '0',
  `couponInfo` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(128) DEFAULT '',
  PRIMARY KEY (`sid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`orderId`,`company`),
  KEY `indextwo` (`orderId`,`dompany`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售单';

DROP TABLE IF EXISTS `salesactivityitem`;
CREATE TABLE `salesactivityitem` (
  `saiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `asid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activity` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `state` tinyint(1) NOT NULL,
  `isStock` tinyint(1) NOT NULL,
  `isAffirm` tinyint(1) NOT NULL COMMENT '0: 未确认, 1: 客户确认',
  `num` int(8) NOT NULL,
  `money` int(8) NOT NULL,
  `integral` int(11) NOT NULL DEFAULT '0' COMMENT '积分',
  `cuid` int(11) NOT NULL,
  `ouid` int(11) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `operateTime` timestamp NULL DEFAULT NULL,
  `integral` int(11) NOT NULL DEFAULT '0' COMMENT '积分',
  `content` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`saiid`),
  KEY `indexone` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售活动';

DROP TABLE IF EXISTS `salesbalance`;
CREATE TABLE `salesbalance` (
  `sbid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单',
  `rid` int(11) DEFAULT NULL COMMENT '退货单',
  `cuid` varchar(32) NOT NULL COMMENT '创建人',
  `suid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  `drid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `puid` varchar(32) DEFAULT NULL COMMENT '结算人',
  `postTime` timestamp NULL DEFAULT NULL COMMENT '结算时间',
  `vuid` int(11) DEFAULT NULL COMMENT '厂商结算人',
  `venderTime` timestamp NULL DEFAULT NULL COMMENT '厂商结算时间',
  `chuid` varchar(32) DEFAULT NULL COMMENT '对账人',
  `checkTime` timestamp NULL DEFAULT NULL COMMENT '对账时间',
  `allowance` bigint(10) NOT NULL,
  `total` bigint(10) NOT NULL DEFAULT '0' COMMENT '总额',
  `balance` bigint(10) NOT NULL DEFAULT '0' COMMENT '预结算值',
  `difference` bigint(10) DEFAULT '0' COMMENT '差值',
  `vbalance` bigint(10) NOT NULL DEFAULT '0' COMMENT '厂商结算',
  `pbalance` bigint(10) NOT NULL DEFAULT '0' COMMENT '结算值',
  `type` tinyint(1) NOT NULL COMMENT '类型,0:购货,1:预结算退货,2:结算退货',
  `onetype` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL COMMENT '状态,0:预结算,1:厂商结算,2:结算',
  `checkStatus` tinyint(1) DEFAULT '0' COMMENT '对账状态',
  `comment` varchar(128) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`sbid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`createTime`),
  KEY `uniqueone` (`sid`,`rid`),
  KEY `indexthr` (`rid`),
  KEY `indexfor` (`postTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售结算';

DROP TABLE IF EXISTS `salesbalanceitem`;
CREATE TABLE `salesbalanceitem` (
  `sbiid` int(11) NOT NULL AUTO_INCREMENT,
  `sbid` int(11) NOT NULL COMMENT '销售结算ID',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `rawCtype` tinyint(1) NOT NULL COMMENT '原结算方式, 0:底价,1:结算',
  `rawCvalue` int(8) NOT NULL DEFAULT '0' COMMENT '原结算值',
  `ctype` tinyint(1) NOT NULL COMMENT '结算方式',
  `cvalue` int(8) NOT NULL DEFAULT '0' COMMENT '结算值',
  `num` bigint(10) NOT NULL DEFAULT '0' COMMENT '数量',
  `total` bigint(10) NOT NULL DEFAULT '0' COMMENT '总价',
  PRIMARY KEY (`sbiid`),
  KEY `indexone` (`sbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售结算项';

DROP TABLE IF EXISTS `salesdeliveryitem`;
CREATE TABLE `salesdeliveryitem` (
  `sdiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '配送项ID',
  `sid` int(11) NOT NULL COMMENT '销售单',
  `siid` int(11) NOT NULL COMMENT '销售项',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `createtime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `protranTime` timestamp NULL DEFAULT NULL,
  `trantime` timestamp NULL DEFAULT NULL COMMENT '配送时间',
  `checktime` timestamp NULL DEFAULT NULL COMMENT '审核时间',
  `confirmtime` timestamp NULL DEFAULT NULL COMMENT '确认时间',
  `finishtime` timestamp NULL DEFAULT NULL COMMENT '完结时间',
  `cruid` int(11) DEFAULT NULL COMMENT '创建人',
  `tuid` int(11) DEFAULT NULL COMMENT '配送人',
  `chuid` int(11) DEFAULT NULL COMMENT '审核人',
  `couid` int(11) DEFAULT NULL COMMENT '确认人',
  `fuid` int(11) DEFAULT NULL COMMENT '完结人',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`sdiid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`siid`),
  KEY `indexthr` (`createtime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售配送项表';

DROP TABLE IF EXISTS `salesfunction`;
CREATE TABLE `salesfunction` (
  `sfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `group` tinyint(2) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`sfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售功能表';

DROP TABLE IF EXISTS `salesitem`;
CREATE TABLE `salesitem` (
  `siid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `purchase` int(8) NOT NULL DEFAULT '0' COMMENT '进价',
  `selling` int(8) NOT NULL DEFAULT '0' COMMENT '售价',
  `discount` int(8) NOT NULL DEFAULT '0' COMMENT '折扣',
  `disPrice` int(8) NOT NULL DEFAULT '0' COMMENT '折扣价',
  `postDis` int(8) NOT NULL DEFAULT '0' COMMENT '折让',
  `price` int(8) NOT NULL DEFAULT '0' COMMENT '折让价',
  `num` bigint(10) NOT NULL DEFAULT '0',
  `initnum` bigint(10) NOT NULL COMMENT '初始数量',
  `punum` bigint(10) NOT NULL,
  `xgnum` bigint(10) NOT NULL,
  `total` bigint(10) NOT NULL DEFAULT '0',
  `priceType` tinyint(1) NOT NULL,
  `comment` varchar(128) DEFAULT NULL,
  `rawCtype` tinyint(1) NOT NULL COMMENT '原结算方式',
  `rawCvalue` int(8) NOT NULL DEFAULT '0' COMMENT '原结算值',
  `ctype` tinyint(1) NOT NULL COMMENT '结算方式',
  `cvalue` int(8) NOT NULL DEFAULT '0' COMMENT '结算值',
  PRIMARY KEY (`siid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售项';

DROP TABLE IF EXISTS `salesmanifest`;
CREATE TABLE `salesmanifest` (
  `smid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  PRIMARY KEY (`smid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售货单';

DROP TABLE IF EXISTS `salespicture`;
CREATE TABLE `salespicture` (
  `spid` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `siid` int(11) DEFAULT NULL COMMENT '销售项ID',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `path` varchar(255) NOT NULL COMMENT '路径',
  `filesize` int(10) DEFAULT '0',
  `type` tinyint(1) NOT NULL COMMENT '类型 1.配送',
  `cuid` int(11) NOT NULL COMMENT '创建人id',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`spid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`siid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售图片表';

DROP TABLE IF EXISTS `salespurchase`;
CREATE TABLE `salespurchase` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  PRIMARY KEY (`spid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售采购单';
