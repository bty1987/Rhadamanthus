CREATE DATABASE  IF NOT EXISTS `sales` ;
USE `sales`;

DROP TABLE IF EXISTS `refunds`;
CREATE TABLE `refunds` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `spid` int(11) NOT NULL COMMENT '款项ID',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL COMMENT '结算时间',
  `comment` varchar(128) NOT NULL,
  `status` tinyint(2) DEFAULT '0',
  PRIMARY KEY (`rid`),
  KEY `indexone` (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='退货单';

DROP TABLE IF EXISTS `refundsitem`;
CREATE TABLE `refundsitem` (
  `riid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `rid` int(11) NOT NULL COMMENT '退货单ID',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`riid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='退货单';

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL,
  `orderId` varchar(15) NOT NULL,
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
  `bid` int(11) NOT NULL COMMENT '商品ID',
  `brand` varchar(32) NOT NULL,
  `activityId` int(11) DEFAULT '0' COMMENT '活动ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL,
  `fullpayTime` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `depositpay` decimal(10,3) NOT NULL DEFAULT '0.000',
  `depositpayStatus` tinyint(1) NOT NULL DEFAULT '-1',
  `fullpay` decimal(10,3) NOT NULL DEFAULT '0.000',
  `fullpayStatus` tinyint(1) NOT NULL DEFAULT '-1',
  `balanceStatus` tinyint(1) DEFAULT '0',
  `otherStatus` tinyint(1) NOT NULL DEFAULT '0',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '总数',
  `amount` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '总数',
  `maling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `venderMaling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `coupon` decimal(10,3) NOT NULL DEFAULT '0.000',
  `couponInfo` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(128) DEFAULT '',
  PRIMARY KEY (`sid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`orderId`)
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
  `num` int(11) NOT NULL,
  `money` decimal(10,3) NOT NULL,
  `content` varchar(64) DEFAULT NULL,
  `receiveUserId` int(11) DEFAULT NULL,
  `receiveUserName` varchar(15) NOT NULL,
  `receiveTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`saiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售活动';

DROP TABLE IF EXISTS `salesbalance`;
CREATE TABLE `salesbalance` (
  `sbid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单',
  `rid` int(11) DEFAULT NULL COMMENT '退货单',
  `cuid` varchar(32) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `puid` varchar(32) DEFAULT NULL COMMENT '结算人',
  `postTime` timestamp NULL DEFAULT NULL COMMENT '结算时间',
  `venderTime` timestamp NULL DEFAULT NULL COMMENT '厂商结算时间',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '总额',
  `balance` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '预结算值',
  `difference` decimal(10,3) DEFAULT '0.000' COMMENT '差值',
  `vbalance` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '厂商结算',
  `pbalance` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '结算值',
  `type` tinyint(2) NOT NULL COMMENT '类型,0:购货,1:预结算退货,2:结算退货',
  `status` tinyint(2) NOT NULL COMMENT '状态,0:预结算,1:厂商结算,2:结算',
  `comment` varchar(128) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`sbid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售结算';

DROP TABLE IF EXISTS `salesbalanceitem`;
CREATE TABLE `salesbalanceitem` (
  `sbiid` int(11) NOT NULL AUTO_INCREMENT,
  `sbid` int(11) NOT NULL COMMENT '销售结算ID',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `rawCtype` tinyint(1) NOT NULL COMMENT '原结算方式, 0:底价,1:结算',
  `rawCvalue` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原结算值',
  `ctype` tinyint(1) NOT NULL COMMENT '结算方式',
  `cvalue` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '结算值',
  `num` decimal(10,3) NOT NULL COMMENT '数量',
  `total` decimal(10,3) NOT NULL COMMENT '总价',
  PRIMARY KEY (`sbiid`),
  KEY `indexone` (`sbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售结算项';

DROP TABLE IF EXISTS `salesitem`;
CREATE TABLE `salesitem` (
  `siid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `purchase` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '进价',
  `selling` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '售价',
  `discount` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折扣',
  `disPrice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折扣价',
  `postDis` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折让',
  `price` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折让价',
  `priceType` tinyint(1) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `comment` varchar(128) DEFAULT NULL,
  `rawCtype` tinyint(2) NOT NULL COMMENT '原结算方式',
  `rawCvalue` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原结算值',
  `ctype` tinyint(1) NOT NULL COMMENT '结算方式',
  `cvalue` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '结算值',
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

DROP TABLE IF EXISTS `salespurchase`;
CREATE TABLE `salespurchase` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  PRIMARY KEY (`spid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售采购单';
