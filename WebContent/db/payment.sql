CREATE DATABASE  IF NOT EXISTS `payment`;
USE `payment`;

DROP TABLE IF EXISTS `advancepayment`;
CREATE TABLE `advancepayment` (
  `apId` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` int(11) NOT NULL,
  `balance` decimal(10,3) DEFAULT NULL,
  `materialBalance` decimal(10,3) DEFAULT '0.000',
  `zhenglinBalance` decimal(10,3) DEFAULT '0.000',
  `projectBalance` decimal(10,3) DEFAULT '0.000',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`apId`),
  UNIQUE KEY `uniqueone` (`customerId`,`company`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预付款余额表';

DROP TABLE IF EXISTS `advancereceipt`;
CREATE TABLE `advancereceipt` (
  `arId` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) NOT NULL,
  `cluid` int(11) DEFAULT NULL COMMENT '收款人ID',
  `collecterName` varchar(32) NOT NULL DEFAULT '',
  `collectTime` timestamp NULL DEFAULT NULL,
  `cfuid` int(11) DEFAULT NULL COMMENT '确认人ID',
  `confirmerName` varchar(32) NOT NULL DEFAULT '',
  `confirmTime` timestamp NULL DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `realMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `transfer` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` decimal(10,3) NOT NULL DEFAULT '0.000',
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` decimal(10,3) NOT NULL DEFAULT '0.000',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` decimal(10,3) NOT NULL DEFAULT '0.000',
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`arId`),
  KEY `indexone` (`collectTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预付款收据表';

DROP TABLE IF EXISTS `decorationpayment`;
CREATE TABLE `decorationpayment` (
  `dpid` int(11) NOT NULL AUTO_INCREMENT,
  `drid` int(11) DEFAULT NULL,
  `orderId` varchar(15) NOT NULL,
  `onetype` tinyint(1) NOT NULL,
  `twotype` tinyint(1) NOT NULL,
  `paymentType` varchar(10) NOT NULL COMMENT '预付款、设计费、定金、首付款、首付二期款、二期款、尾款、增项款、减项款、退款、违约金',
  `paymentStatus` tinyint(1) NOT NULL COMMENT '0: 未付款, 1: 已付款, 2: 已确认, 3: 审批中, 4: 历史',
  `cuid` int(11) DEFAULT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `referMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `realMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `sort` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`dpid`),
  KEY `indexone` (`orderId`),
  KEY `indexfor` (`orderId`,`paymentType`,`paymentStatus`),
  KEY `indexthr` (`drId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修款表';

DROP TABLE IF EXISTS `decorationreceipt`;
CREATE TABLE `decorationreceipt` (
  `drId` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `cluid` int(11) DEFAULT NULL COMMENT '收款人ID',
  `collecterName` varchar(32) DEFAULT NULL,
  `collectTime` timestamp NULL DEFAULT NULL,
  `cfuid` int(11) DEFAULT NULL COMMENT '确认人ID',
  `confirmerName` varchar(32) DEFAULT NULL,
  `confirmTime` timestamp NULL DEFAULT NULL,
  `cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `bankInfo` varchar(512) DEFAULT NULL,
  `checkv` decimal(10,3) NOT NULL DEFAULT '0.000',
  `checkvBank` varchar(512) DEFAULT NULL,
  `installment` decimal(10,3) NOT NULL DEFAULT '0.000',
  `installmentBank` varchar(20) DEFAULT NULL,
  `accounts` decimal(10,3) NOT NULL DEFAULT '0.000',
  `accountsBank` varchar(20) DEFAULT NULL,
  `coupon` decimal(10,3) NOT NULL DEFAULT '0.000',
  `couponInfo` varchar(512) DEFAULT NULL,
  `advance` decimal(10,3) NOT NULL DEFAULT '0.000',
  `advanceType` tinyint(4) NOT NULL DEFAULT '0',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`drId`),
  KEY `indexone` (`collectTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修款收据表';

DROP TABLE IF EXISTS `materialpayment`;
CREATE TABLE `materialpayment` (
  `mpid` int(11) NOT NULL AUTO_INCREMENT,
  `mrid` int(11) DEFAULT NULL,
  `mid` int(11) NOT NULL,
  `paymentType` tinyint(1) NOT NULL DEFAULT '0',
  `paymentStatus` tinyint(1) NOT NULL DEFAULT '0',
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `referMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`mpid`),
  KEY `indexone` (`mid`,`paymentStatus`),
  KEY `indextwo` (`mrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材款表';

DROP TABLE IF EXISTS `materialreceipt`;
CREATE TABLE `materialreceipt` (
  `mrId` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) NOT NULL COMMENT '收款人ID',
  `collecterName` varchar(32) NOT NULL DEFAULT '',
  `collectTime` timestamp NULL DEFAULT NULL,
  `cfuid` int(11) DEFAULT NULL COMMENT '确认人ID',
  `confirmerName` varchar(32) NOT NULL DEFAULT '',
  `confirmTime` timestamp NULL DEFAULT NULL,
  `realMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` decimal(10,3) NOT NULL DEFAULT '0.000',
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` decimal(10,3) NOT NULL DEFAULT '0.000',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` decimal(10,3) NOT NULL DEFAULT '0.000',
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `advance` decimal(10,3) NOT NULL DEFAULT '0.000',
  `advanceType` tinyint(4) NOT NULL DEFAULT '0',
  `coupon` decimal(10,3) NOT NULL DEFAULT '0.000',
  `couponType` tinyint(4) NOT NULL DEFAULT '0',
  `couponInfo` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`mrId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材款收据表';

DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `arid` int(11) DEFAULT NULL,
  `uniqueid` varchar(32) NOT NULL,
  `customerId` int(11) NOT NULL,
  `orderId` varchar(15) DEFAULT NULL,
  `company` int(11) NOT NULL,
  `cuid` int(11) DEFAULT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `balance` decimal(10,3) NOT NULL,
  `recharge` decimal(10,3) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0:提现, 1:收款, 2:付款',
  `paymentType` tinyint(1) NOT NULL COMMENT '0:合同, 1:工程, 2:主材, 3:正林',
  `status` tinyint(1) NOT NULL COMMENT '1: 已付款, 2:已确认',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`pid`),
  UNIQUE KEY `uniqueone` (`uniqueid`),
  KEY `indexone` (`arId`),
  KEY `indextwo` (`customerId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预付款表';

DROP TABLE IF EXISTS `receipt`;
CREATE TABLE `receipt` (
  `rid` int(11) NOT NULL AUTO_INCREMENT COMMENT '收据ID',
  `prid` int(11) NOT NULL COMMENT '款项收据ID',
  `no` varchar(32) NOT NULL COMMENT '收据编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 收款, 1: 退款',
  `paymentType` tinyint(1) NOT NULL COMMENT '款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款',
  `receiptType` tinyint(1) NOT NULL COMMENT '收据类型 , 0: 现金 , 1: 银行 , 2: 转账 , 3: 对公 , 4: 分期 , 5: 优惠',
  `money` decimal(10,3) NOT NULL COMMENT '金额',
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '收款时间',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='收据';

DROP TABLE IF EXISTS `salespayment`;
CREATE TABLE `salespayment` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `srid` int(11) COMMENT '收据ID',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `referMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`spid`),
  KEY `indexone` (`srid`),
  KEY `indextwo` (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售款项表';

DROP TABLE IF EXISTS `salesreceipt`;
CREATE TABLE `salesreceipt` (
  `srid` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) DEFAULT NULL COMMENT '收款人ID',
  `cfuid` int(11) DEFAULT NULL COMMENT '确认人ID',
  `collecterName` varchar(32) DEFAULT NULL COMMENT '收款人名',
  `confirmerName` varchar(32) DEFAULT NULL COMMENT '确认人名',
  `collectTime` timestamp NULL DEFAULT NULL,
  `confirmTime` timestamp NULL DEFAULT NULL,
  `type` tinyint(4) DEFAULT '0',
  `realMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` decimal(10,3) NOT NULL DEFAULT '0.000',
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` decimal(10,3) NOT NULL DEFAULT '0.000',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` decimal(10,3) NOT NULL DEFAULT '0.000',
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `advance` decimal(10,3) NOT NULL DEFAULT '0.000',
  `advanceType` tinyint(4) NOT NULL DEFAULT '0',
  `coupon` decimal(10,3) NOT NULL DEFAULT '0.000',
  `couponInfo` text NOT NULL,
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`srid`),
  KEY `indexone` (`collectTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售收据表';

DROP TABLE IF EXISTS `servicepayment`;
CREATE TABLE `servicepayment` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `srid` int(11) DEFAULT NULL,
  `orderId` varchar(15) NOT NULL,
  `pid` int(11) NOT NULL COMMENT '预付款款项ID',
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `serviceMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `advanceMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `comment` varchar(256) DEFAULT '',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`spid`),
  KEY `indexone` (`srid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务款项';

DROP TABLE IF EXISTS `servicereceipt`;
CREATE TABLE `servicereceipt` (
  `srid` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) DEFAULT NULL COMMENT '收款人ID',
  `cfuid` int(11) DEFAULT NULL COMMENT '确认人ID',
  `collecterName` varchar(32) DEFAULT NULL COMMENT '收款人姓名',
  `confirmerName` varchar(32) DEFAULT NULL COMMENT '确认人姓名',
  `collectTime` timestamp NULL DEFAULT NULL,
  `confirmTime` timestamp NULL DEFAULT NULL,
  `type` tinyint(1) NOT NULL,
  `realMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` decimal(10,3) NOT NULL DEFAULT '0.000',
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` decimal(10,3) NOT NULL DEFAULT '0.000',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` decimal(10,3) NOT NULL DEFAULT '0.000',
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`srid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务收据';
