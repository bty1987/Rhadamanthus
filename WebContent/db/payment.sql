CREATE DATABASE  IF NOT EXISTS `payment`;
USE `payment`;

DROP TABLE IF EXISTS `activitypayment`;
CREATE TABLE `activitypayment` (
  `apid` int(11) NOT NULL AUTO_INCREMENT,
  `mno` varchar(15) NOT NULL,
  `orderId` varchar(32) DEFAULT NULL COMMENT '票号',
  `createrId` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(2) NOT NULL,
  `category` varchar(32) DEFAULT '',
  `brand` varchar(32) DEFAULT NULL COMMENT '品牌',
  `money` bigint(10) NOT NULL DEFAULT '0',
  `arid` int(11) DEFAULT NULL,
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '状态',
  `expire` tinyint(1) NOT NULL,
  `vaid` int(11) DEFAULT '0',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`apid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动款';

DROP TABLE IF EXISTS `activityreceipt`;
CREATE TABLE `activityreceipt` (
  `arid` int(11) NOT NULL AUTO_INCREMENT COMMENT '活动收据ID',
  `cluid` int(11) NOT NULL COMMENT '收款人ID',
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款时间',
  `cash` bigint(10) NOT NULL DEFAULT '0' COMMENT '现金',
  `bank` bigint(10) NOT NULL DEFAULT '0' COMMENT '刷卡',
  `bankInfo` varchar(255) NOT NULL COMMENT '刷卡信息',
  `coupon` bigint(10) NOT NULL DEFAULT '0' COMMENT '券值',
  `couponInfo` varchar(255) NOT NULL COMMENT '券信息',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`arid`),
  KEY `indexone` (`collectTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动款收据';

DROP TABLE IF EXISTS `advancepayment`;
CREATE TABLE `advancepayment` (
  `apId` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` int(11) DEFAULT NULL,
  `orderId` varchar(15) NOT NULL,
  `balance` bigint(10) DEFAULT '0',
  `projectBalance` bigint(10) DEFAULT '0',
  `materialBalance` bigint(10) DEFAULT '0',
  `zhenglinBalance` bigint(10) DEFAULT '0',
  `checked` tinyint(1) DEFAULT '0',
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`apId`),
  UNIQUE KEY `uniquetwo` (`orderId`),
  KEY `indexone` (`orderId`)
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
  `realMoney` bigicimal(10) NOT NULL DEFAULT '0.000',
  `cash` bigint(10) NOT NULL DEFAULT '0',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` bigint(10) NOT NULL DEFAULT '0',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT '0',
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT '0',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT '0',
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
  `ptid` int(11) DEFAULT '0',
  `paymentType` varchar(10) NOT NULL COMMENT '预付款、设计费、定金、首付款、首付二期款、二期款、尾款、增项款、减项款、退款、违约金',
  `paymentStatus` tinyint(1) NOT NULL COMMENT '0: 未付款, 1: 已付款, 2: 已确认, 3: 审批中, 4: 历史',
  `cuid` int(11) DEFAULT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `referMoney` bigint(10) NOT NULL DEFAULT '0',
  `realMoney` bigint(10) NOT NULL DEFAULT '0.000',
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
  `cash` bigint(10) NOT NULL DEFAULT '0',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` bigint(10) NOT NULL DEFAULT '0',
  `bankInfo` varchar(512) DEFAULT NULL,
  `checkv` bigint(10) NOT NULL DEFAULT '0',
  `checkvBank` varchar(512) DEFAULT NULL,
  `installment` bigint(10) NOT NULL DEFAULT '0',
  `installmentBank` varchar(20) DEFAULT NULL,
  `accounts` bigint(10) NOT NULL DEFAULT '0',
  `accountsBank` varchar(20) DEFAULT NULL,
  `coupon` bigint(10) NOT NULL DEFAULT '0',
  `couponInfo` varchar(512) DEFAULT NULL,
  `advance` bigint(10) NOT NULL DEFAULT '0',
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
  `referMoney` bigint(10) NOT NULL DEFAULT '0',
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
  `cash` bigint(10) NOT NULL DEFAULT '0',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` bigint(10) NOT NULL DEFAULT '0',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT '0',
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT '0',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT '0',
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `advance` bigint(10) NOT NULL DEFAULT '0',
  `advanceType` tinyint(4) NOT NULL DEFAULT '0',
  `coupon` bigint(10) NOT NULL DEFAULT '0',
  `couponType` tinyint(4) NOT NULL DEFAULT '0',
  `couponInfo` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `type` tinyint(4) NOT NULL,
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`mrId`),
  KEY `indexone` (`collectTime`)
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
  `balance` bigint(10) NOT NULL,
  `recharge` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0:提现, 1:收款, 2:付款',
  `paymentType` tinyint(1) NOT NULL COMMENT '0:合同, 1:工程, 2:主材, 3:正林',
  `status` tinyint(1) NOT NULL COMMENT '1: 已付款, 2:已确认',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`pid`),
  UNIQUE KEY `uniqueone` (`uniqueid`),
  KEY `indexone` (`arId`),
  KEY `indextwo` (`customerId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='预付款表';

DROP TABLE IF EXISTS `paymentcontract`;
CREATE TABLE `paymentcontract` (
  `pcid` int(11) NOT NULL AUTO_INCREMENT,
  `rtid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `paymentType` tinyint(1) NOT NULL,
  `download` varchar(256) DEFAULT NULL,
  `viewpdf` varchar(256) DEFAULT NULL,
  `path` varchar(256) DEFAULT NULL,
  `cuid` int(11) DEFAULT NULL,
  `suid` int(11) DEFAULT NULL,
  `fuid` int(11) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `comsignTime` timestamp NULL DEFAULT NULL,
  `cussignTime` timestamp NULL DEFAULT NULL,
  `filingTime` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pcid`),
  UNIQUE KEY `uniqueone` (`rtid`,`paymentType`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项合同表';

DROP TABLE IF EXISTS `paymentfunction`;
CREATE TABLE `paymentfunction` (
  `pfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `group` tinyint(2) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项功能配置表';

DROP TABLE IF EXISTS `pointofsales`;
CREATE TABLE `pointofsales` (
  `posid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `no` varchar(32) NOT NULL,
  `sn` varchar(32) NOT NULL,
  `msgId` varchar(32) NOT NULL,
  `outOrderNo` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `money` bigint(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cuid` int(11) NOT NULL,
  `rstcode` varchar(16) DEFAULT NULL,
  `rstmsg` varchar(64) DEFAULT NULL,
  `rid` int(11) NOT NULL COMMENT '收据ID',
  PRIMARY KEY (`posid`),
  KEY `indexone` (`pid`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售点信息表';

DROP TABLE IF EXISTS `receipt`;
CREATE TABLE `receipt` (
  `rid` int(11) NOT NULL AUTO_INCREMENT COMMENT '收据ID',
  `prid` int(11) NOT NULL COMMENT '款项收据ID',
  `rtid` int(11) NOT NULL,
  `no` varchar(32) NOT NULL COMMENT '收据编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `orderId` varchar(15) DEFAULT NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 收款, 1: 退款',
  `paymentType` tinyint(1) NOT NULL COMMENT '款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款',
  `paymentName` varchar(32) DEFAULT NULL,
  `receiptType` tinyint(1) NOT NULL COMMENT '收据类型 , 0: 现金 , 1: 银行 , 2: 转账 , 3: 对公 , 4: 分期 , 5: 优惠',
  `money` bigint(10) NOT NULL COMMENT '金额',
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款时间',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`rid`),
  KEY `indexone` (`prid`),
  KEY `indextwo` (`orderId`),
  KEY `indexthr` (`collectTime`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='收据';

DROP TABLE IF EXISTS `salespayment`;
CREATE TABLE `salespayment` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `srid` int(11) DEFAULT NULL COMMENT '收据ID',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `referMoney` bigint(10) NOT NULL DEFAULT '0',
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
  `cash` bigint(10) NOT NULL DEFAULT '0',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` bigint(10) NOT NULL DEFAULT '0',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT '0',
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT '0',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT '0',
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `advance` bigint(10) NOT NULL DEFAULT '0',
  `advanceType` tinyint(4) NOT NULL DEFAULT '0',
  `coupon` bigint(10) NOT NULL DEFAULT '0',
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
  `serviceMoney` bigint(10) NOT NULL DEFAULT '0',
  `advanceMoney` bigint(10) NOT NULL DEFAULT '0',
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
  `type` tinyint(1) DEFAULT '0',
  `realMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cash` bigint(10) NOT NULL DEFAULT '0',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` bigint(10) NOT NULL DEFAULT '0',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT '0',
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT '0',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT '0',
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`srid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务收据';
