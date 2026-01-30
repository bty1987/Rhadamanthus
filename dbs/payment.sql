CREATE DATABASE IF NOT EXISTS `payment`;
USE `payment`;

-- Generated at 2026-01-06 08:11:03
-- Total tables: 30

DROP TABLE IF EXISTS `activitypayment`;
CREATE TABLE `activitypayment` (
  `apid` int(11) NOT NULL AUTO_INCREMENT,
  `mno` varchar(15) NOT NULL COMMENT '会员号',
  `orderId` varchar(32) NULL COMMENT '票号',
  `createrId` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(2) NOT NULL COMMENT '类型 , 0: 装修款 , 1: 主材款',
  `category` varchar(32) NULL DEFAULT '' COMMENT '品类',
  `brand` varchar(32) NULL COMMENT '品牌 品牌',
  `money` bigint(10) NOT NULL DEFAULT 0 COMMENT '金额',
  `arid` int(11) NULL,
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态 状态 , 0: 未付款 , 1: 已付款',
  `expire` tinyint(1) NOT NULL COMMENT '到期标识 , 0: 有效 , 1: 到期',
  `vaid` int(11) NULL DEFAULT 0 COMMENT '活动',
  `comment` varchar(255) NULL COMMENT '备注',
  PRIMARY KEY (`apid`)
) ENGINE=InnoDB AUTO_INCREMENT=449 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='活动款';

DROP TABLE IF EXISTS `activityreceipt`;
CREATE TABLE `activityreceipt` (
  `arid` int(11) NOT NULL AUTO_INCREMENT COMMENT '活动收据ID 活动收据ID',
  `cluid` int(11) NOT NULL COMMENT '收款人ID',
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款时间',
  `cash` bigint(10) NOT NULL DEFAULT 0 COMMENT '现金 现金',
  `bank` bigint(10) NOT NULL DEFAULT 0 COMMENT '刷卡 刷卡',
  `bankInfo` varchar(255) NOT NULL COMMENT '刷卡信息',
  `coupon` bigint(10) NOT NULL DEFAULT 0 COMMENT '券值 券值',
  `couponInfo` varchar(255) NOT NULL COMMENT '券信息',
  `comment` varchar(255) NULL COMMENT '说明 说明',
  PRIMARY KEY (`arid`),
  KEY `indexone` (`collectTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=501 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='活动款收据';

DROP TABLE IF EXISTS `advancepayment`;
CREATE TABLE `advancepayment` (
  `apId` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` int(11) NULL,
  `orderId` varchar(15) NOT NULL,
  `balance` bigint(10) NULL DEFAULT 0,
  `projectBalance` bigint(10) NULL DEFAULT 0,
  `materialBalance` bigint(10) NULL DEFAULT 0,
  `zhenglinBalance` bigint(10) NULL DEFAULT 0,
  `checked` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NULL,
  PRIMARY KEY (`apId`),
  KEY `indexone` (`orderId`) USING BTREE,
  UNIQUE KEY `uniquetwo` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2045 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户预付款';

DROP TABLE IF EXISTS `advancereceipt`;
CREATE TABLE `advancereceipt` (
  `arId` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) NOT NULL,
  `cluid` int(11) NULL COMMENT '收款人ID',
  `collecterName` varchar(32) NOT NULL DEFAULT '',
  `collectTime` timestamp NULL,
  `cfuid` int(11) NULL COMMENT '确认人ID',
  `confirmerName` varchar(32) NOT NULL DEFAULT '',
  `confirmTime` timestamp NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `realMoney` bigint(10) NOT NULL DEFAULT 0,
  `cash` bigint(10) NOT NULL DEFAULT 0,
  `cashInfo` varchar(20) NULL,
  `bank` bigint(10) NOT NULL DEFAULT 0,
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT 0,
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT 0,
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT 0,
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `transfer` bigint(10) NOT NULL DEFAULT 0,
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`arId`),
  KEY `indexone` (`collectTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17047 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='预付款项收据表';

DROP TABLE IF EXISTS `bill`;
CREATE TABLE `bill` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `rtid` int(11) NOT NULL,
  `money` bigint(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='收款单';

DROP TABLE IF EXISTS `billitem`;
CREATE TABLE `billitem` (
  `biid` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `pid` int(11) NOT NULL,
  `money` bigint(10) NOT NULL,
  PRIMARY KEY (`biid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='收款项';

DROP TABLE IF EXISTS `decorationpayment`;
CREATE TABLE `decorationpayment` (
  `dpid` int(11) NOT NULL AUTO_INCREMENT,
  `drid` int(11) NULL,
  `orderId` varchar(15) NOT NULL,
  `onetype` tinyint(1) NOT NULL,
  `twotype` tinyint(1) NOT NULL,
  `ptid` int(11) NOT NULL DEFAULT 0,
  `paymentType` varchar(10) NOT NULL COMMENT '预付款、设计费、定金、首付款、首付二期款、二期款、尾款、增项款、减项款、退款、违约金',
  `paymentStatus` tinyint(1) NOT NULL COMMENT '0: 未付款, 1: 已付款, 2: 已确认, 3: 审批中, 4: 历史',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `referMoney` bigint(10) NOT NULL DEFAULT 0,
  `realMoney` bigint(10) NOT NULL DEFAULT 0,
  `sort` tinyint(1) NOT NULL,
  `isAffirm` tinyint(1) NOT NULL COMMENT '客户确认状态',
  `affirmTime` timestamp NULL COMMENT '客户确认时间',
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`dpid`),
  KEY `indexfiv` (`createTime`) USING BTREE,
  KEY `indexfor` (`orderId`, `paymentType`, `paymentStatus`) USING BTREE,
  KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexthr` (`drid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19463 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `decorationreceipt`;
CREATE TABLE `decorationreceipt` (
  `drId` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `cluid` int(11) NULL COMMENT '收款人ID',
  `collecterName` varchar(32) NULL,
  `collectTime` timestamp NULL,
  `cfuid` int(11) NULL COMMENT '确认人ID',
  `confirmerName` varchar(32) NULL,
  `confirmTime` timestamp NULL,
  `cash` bigint(10) NOT NULL DEFAULT 0,
  `cashInfo` varchar(20) NULL,
  `bank` bigint(10) NOT NULL DEFAULT 0,
  `bankInfo` varchar(512) NULL,
  `checkv` bigint(10) NOT NULL DEFAULT 0,
  `checkvBank` varchar(512) NULL,
  `installment` bigint(10) NOT NULL DEFAULT 0,
  `installmentBank` varchar(20) NULL,
  `accounts` bigint(10) NOT NULL DEFAULT 0,
  `accountsBank` varchar(20) NULL,
  `coupon` bigint(10) NOT NULL DEFAULT 0,
  `couponInfo` varchar(512) NULL,
  `advance` bigint(10) NOT NULL DEFAULT 0,
  `advanceType` tinyint(4) NOT NULL DEFAULT 0,
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`drId`),
  KEY `indexone` (`collectTime`) USING BTREE,
  KEY `indextwo` (`confirmTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6452 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修款项收据表';

DROP TABLE IF EXISTS `materialpayment`;
CREATE TABLE `materialpayment` (
  `mpid` int(11) NOT NULL AUTO_INCREMENT,
  `mrid` int(11) NULL,
  `mid` int(11) NOT NULL,
  `paymentType` tinyint(1) NOT NULL DEFAULT 0,
  `paymentStatus` tinyint(1) NOT NULL DEFAULT 0,
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `referMoney` bigint(10) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`mpid`),
  KEY `indexone` (`mid`, `paymentStatus`) USING BTREE,
  KEY `indextwo` (`mrid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3848 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材子订单款项表';

DROP TABLE IF EXISTS `materialreceipt`;
CREATE TABLE `materialreceipt` (
  `mrId` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) NOT NULL COMMENT '收款人ID',
  `collecterName` varchar(32) NOT NULL DEFAULT '',
  `collectTime` timestamp NULL,
  `cfuid` int(11) NULL COMMENT '确认人ID',
  `confirmerName` varchar(32) NOT NULL DEFAULT '',
  `confirmTime` timestamp NULL,
  `realMoney` bigint(10) NOT NULL DEFAULT 0,
  `cash` bigint(10) NOT NULL DEFAULT 0,
  `cashInfo` varchar(20) NULL,
  `bank` bigint(10) NOT NULL DEFAULT 0,
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT 0,
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT 0,
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT 0,
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `advance` bigint(10) NOT NULL DEFAULT 0,
  `advanceType` tinyint(4) NOT NULL DEFAULT 0,
  `coupon` bigint(10) NOT NULL DEFAULT 0,
  `couponType` tinyint(4) NOT NULL DEFAULT 0,
  `couponInfo` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `type` tinyint(4) NOT NULL,
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`mrId`),
  KEY `indexone` (`collectTime`) USING BTREE,
  KEY `indextwo` (`confirmTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2805 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材款项收据表';

DROP TABLE IF EXISTS `oalespayment`;
CREATE TABLE `oalespayment` (
  `opid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL COMMENT '销售单ID',
  `orid` int(11) NULL,
  `osid` int(11) NULL,
  `orderId` varchar(15) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `referMoney` bigint(10) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`opid`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8_bin ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `oalesreceipt`;
CREATE TABLE `oalesreceipt` (
  `orid` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) NULL COMMENT '收款人ID',
  `cfuid` int(11) NULL COMMENT '确认人ID',
  `collecterName` varchar(32) NULL COMMENT '收款人名',
  `confirmerName` varchar(32) NULL COMMENT '确认人名',
  `collectTime` timestamp NULL,
  `confirmTime` timestamp NULL,
  `type` tinyint(4) NULL DEFAULT 0,
  `realMoney` bigint(10) NOT NULL DEFAULT 0,
  `cash` bigint(10) NOT NULL DEFAULT 0,
  `cashInfo` varchar(20) NULL,
  `bank` bigint(10) NOT NULL DEFAULT 0,
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT 0,
  `checkvBank` varchar(512) NOT NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT 0,
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT 0,
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`orid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8_bin ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `arid` int(11) NULL,
  `uniqueid` varchar(32) NOT NULL,
  `customerId` int(11) NOT NULL,
  `orderId` varchar(15) NULL,
  `company` int(11) NOT NULL,
  `cuid` int(11) NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `balance` bigint(10) NOT NULL,
  `recharge` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0:提现, 1:收款, 2:付款, 3:预付款转入, 4:预付款转出',
  `paymentType` tinyint(1) NOT NULL COMMENT '0:合同, 1:工程, 2:主材, 3:正林',
  `status` tinyint(1) NOT NULL COMMENT '0: 初始 , 1: 已付款, 2:已确认, 3:已撤销',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`pid`),
  KEY `indexone` (`arid`) USING BTREE,
  KEY `indexthr` (`orderId`) USING BTREE,
  KEY `indextwo` (`customerId`) USING BTREE,
  UNIQUE KEY `uniqueone` (`uniqueid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17303 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `paymentactivity`;
CREATE TABLE `paymentactivity` (
  `paid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `pid` int(11) NOT NULL COMMENT '款项ID',
  `rid` int(11) NOT NULL COMMENT '收款ID',
  `aid` int(11) NOT NULL COMMENT '活动ID',
  `realMoney` bigint(10) NOT NULL COMMENT '实付额',
  `multiple` int(6) NOT NULL COMMENT '倍数',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `comment` varchar(128) NULL COMMENT '说明',
  PRIMARY KEY (`paid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='款项活动表';

DROP TABLE IF EXISTS `paymentcontract`;
CREATE TABLE `paymentcontract` (
  `pcid` int(11) NOT NULL AUTO_INCREMENT,
  `rtid` int(11) NOT NULL,
  `orderId` varchar(30) NOT NULL,
  `paymentType` tinyint(1) NOT NULL,
  `download` varchar(256) NULL,
  `viewpdf` varchar(256) NULL,
  `path` varchar(256) NULL,
  `cuid` int(11) NULL,
  `suid` int(11) NULL,
  `fuid` int(11) NULL,
  `createTime` timestamp NULL,
  `comsignTime` timestamp NULL,
  `cussignTime` timestamp NULL,
  `filingTime` timestamp NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `ishow` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`pcid`),
  UNIQUE KEY `uniqueone` (`rtid`, `paymentType`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=570 DEFAULT CHARSET=utf8_bin ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `paymentfunction`;
CREATE TABLE `paymentfunction` (
  `pfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `group` int(4) NOT NULL,
  `type` tinyint(2) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) NULL,
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pfid`)
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='款项功能配置表';

DROP TABLE IF EXISTS `paytran`;
CREATE TABLE `paytran` (
  `ptid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NULL,
  `pid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `ctid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `atttype` tinyint(1) NOT NULL COMMENT '0:装修, 1:主材',
  `no` varchar(32) NOT NULL,
  `sn` varchar(32) NULL,
  `msgId` varchar(32) NULL,
  `outOrderNo` varchar(64) NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0:初始',
  `money` bigint(10) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pushTime` timestamp NULL,
  `collectTime` timestamp NULL,
  `rstcode` varchar(16) NULL,
  `rstmsg` varchar(64) NULL,
  `way` tinyint(1) NOT NULL COMMENT '0:pos机, 1:微信小程序, 2:支付宝, 3:pos扫码',
  PRIMARY KEY (`ptid`),
  KEY `indexone` (`orderId`, `type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2651 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售点信息表';

DROP TABLE IF EXISTS `pointofsales_norid`;
CREATE TABLE `pointofsales_norid` (
  `posid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `no` varchar(32) NOT NULL,
  `sn` varchar(32) NOT NULL,
  `msgId` varchar(32) NOT NULL,
  `outOrderNo` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `money` bigint(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cuid` int(11) NOT NULL,
  `rstcode` varchar(16) NULL,
  `rstmsg` varchar(64) NULL,
  PRIMARY KEY (`posid`)
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售点信息表';

DROP TABLE IF EXISTS `proxypayment`;
CREATE TABLE `proxypayment` (
  `ppid` int(11) NOT NULL AUTO_INCREMENT,
  `prid` int(11) NULL,
  `title` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `phone` varchar(64) NOT NULL,
  `address` varchar(128) NOT NULL,
  `unionId` varchar(32) NULL,
  `orderId` varchar(15) NULL,
  `referMoney` bigint(10) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `did` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `isexpire` tinyint(1) NOT NULL COMMENT '过期标识 过期标识',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='代收款';

DROP TABLE IF EXISTS `proxyreceipt`;
CREATE TABLE `proxyreceipt` (
  `prid` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) NULL,
  `collectTime` timestamp NULL,
  `cfuid` int(11) NULL,
  `confirmTime` timestamp NULL,
  `realMoney` bigint(10) NOT NULL,
  `cash` bigint(10) NOT NULL,
  `cashInfo` varchar(20) NULL,
  `bank` bigint(10) NOT NULL,
  `bankInfo` varchar(512) NULL,
  `checkv` bigint(10) NOT NULL,
  `checkvBank` varchar(512) NULL,
  `comment` varchar(256) NULL,
  PRIMARY KEY (`prid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='代收款收据';

DROP TABLE IF EXISTS `receipt`;
CREATE TABLE `receipt` (
  `rid` int(11) NOT NULL AUTO_INCREMENT COMMENT '收据ID',
  `prid` int(11) NOT NULL COMMENT '款项收据ID',
  `rtid` int(11) NOT NULL,
  `no` varchar(32) NOT NULL COMMENT '收据编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `orderId` varchar(15) NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 收款, 1: 退款',
  `paymentType` tinyint(1) NOT NULL COMMENT '款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款',
  `paymentName` varchar(32) NULL,
  `receiptType` tinyint(1) NOT NULL COMMENT '收据类型 , 0: 现金 , 1: 银行 , 2: 转账 , 3: 对公 , 4: 分期 , 5: 优惠',
  `money` bigint(10) NOT NULL,
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款时间',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`rid`),
  KEY `indexone` (`prid`) USING BTREE,
  KEY `indexthr` (`collectTime`) USING BTREE,
  KEY `indextwo` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5369 DEFAULT CHARSET=utf8_bin ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salespayment`;
CREATE TABLE `salespayment` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `rid` int(11) NULL,
  `srid` int(11) NULL,
  `orderId` varchar(15) NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `referMoney` bigint(10) NOT NULL DEFAULT 0,
  `isAffirm` tinyint(1) NOT NULL COMMENT '客户确认状态',
  `affirmTime` timestamp NULL COMMENT '客户确认时间',
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`spid`),
  KEY `indexone` (`srid`) USING BTREE,
  KEY `indextwo` (`sid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11141 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售款项表';

DROP TABLE IF EXISTS `salesreceipt`;
CREATE TABLE `salesreceipt` (
  `srid` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) NULL COMMENT '收款人ID',
  `cfuid` int(11) NULL COMMENT '确认人ID',
  `collecterName` varchar(32) NULL COMMENT '收款人名',
  `confirmerName` varchar(32) NULL COMMENT '确认人名',
  `collectTime` timestamp NULL,
  `confirmTime` timestamp NULL,
  `type` tinyint(4) NULL DEFAULT 0,
  `realMoney` bigint(10) NOT NULL DEFAULT 0,
  `cash` bigint(10) NOT NULL DEFAULT 0,
  `cashInfo` varchar(20) NULL,
  `bank` bigint(10) NOT NULL DEFAULT 0,
  `bankInfo` varchar(512) NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT 0,
  `checkvBank` varchar(512) NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT 0,
  `installmentBank` varchar(20) NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT 0,
  `accountsBank` varchar(20) NULL DEFAULT '',
  `advance` bigint(10) NOT NULL DEFAULT 0,
  `advanceType` tinyint(1) NOT NULL DEFAULT 0,
  `coupon` bigint(10) NOT NULL DEFAULT 0,
  `couponInfo` text NULL,
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`srid`),
  KEY `indexone` (`collectTime`) USING BTREE,
  KEY `indextwo` (`confirmTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5074 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售收据表';

DROP TABLE IF EXISTS `servicepayment`;
CREATE TABLE `servicepayment` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `srid` int(11) NULL,
  `orderId` varchar(15) NOT NULL,
  `pid` int(11) NOT NULL COMMENT '预付款款项ID',
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NULL DEFAULT 0,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `serviceMoney` bigint(10) NOT NULL DEFAULT 0,
  `advanceMoney` bigint(10) NOT NULL DEFAULT 0,
  `comment` varchar(256) NULL DEFAULT '',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`spid`),
  KEY `indexone` (`srid`) USING BTREE,
  KEY `indextwo` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=971 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='服务款项';

DROP TABLE IF EXISTS `servicereceipt`;
CREATE TABLE `servicereceipt` (
  `srid` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) NULL COMMENT '收款人ID',
  `cfuid` int(11) NULL COMMENT '确认人ID',
  `collecterName` varchar(32) NULL COMMENT '收款人姓名',
  `confirmerName` varchar(32) NULL COMMENT '确认人姓名',
  `collectTime` timestamp NULL,
  `confirmTime` timestamp NULL,
  `type` tinyint(1) NULL DEFAULT 0,
  `realMoney` bigint(10) NOT NULL DEFAULT 0,
  `cash` bigint(10) NOT NULL DEFAULT 0,
  `cashInfo` varchar(20) NULL,
  `bank` bigint(10) NOT NULL DEFAULT 0,
  `bankInfo` varchar(512) NULL DEFAULT '',
  `checkv` bigint(10) NOT NULL DEFAULT 0,
  `checkvBank` varchar(512) NULL DEFAULT '',
  `installment` bigint(10) NOT NULL DEFAULT 0,
  `installmentBank` varchar(20) NULL DEFAULT '',
  `accounts` bigint(10) NOT NULL DEFAULT 0,
  `accountsBank` varchar(20) NULL DEFAULT '',
  `advance` int(10) NOT NULL DEFAULT 0,
  `advanceType` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(256) NULL DEFAULT '',
  PRIMARY KEY (`srid`),
  KEY `indexone` (`collectTime`) USING BTREE,
  KEY `indextwo` (`confirmTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=911 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='服务收据';

DROP TABLE IF EXISTS `statement`;
CREATE TABLE `statement` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `custNo` varchar(64) NOT NULL,
  `orderNo` varchar(64) NOT NULL,
  `price` bigint(10) NOT NULL,
  `fee` int(10) NOT NULL,
  `rate` int(6) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payTime` timestamp NULL,
  `type` int(1) NOT NULL,
  `status` int(1) NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='流水';

DROP TABLE IF EXISTS `wallet`;
CREATE TABLE `wallet` (
  `wid` int(11) NOT NULL AUTO_INCREMENT,
  `buid` int(11) NOT NULL,
  `no` varchar(32) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `identity` varchar(32) NOT NULL,
  `balance` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0:初始',
  PRIMARY KEY (`wid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='钱包';

DROP TABLE IF EXISTS `walletard`;
CREATE TABLE `walletard` (
  `wcid` int(11) NOT NULL AUTO_INCREMENT,
  `wid` int(11) NOT NULL,
  `bankNo` varchar(32) NOT NULL,
  `bankName` varchar(32) NOT NULL,
  `validTime` varchar(16) NOT NULL,
  `cvv` varchar(16) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0:初始',
  `mobile` varchar(16) NOT NULL,
  `bindTime` timestamp NULL,
  `token` varchar(16) NOT NULL,
  PRIMARY KEY (`wcid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='银行卡';

DROP TABLE IF EXISTS `walletran`;
CREATE TABLE `walletran` (
  `wtid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(32) NOT NULL,
  `wid` int(11) NOT NULL,
  `tid` int(11) NULL,
  `amount` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `comment` varchar(256) NULL,
  PRIMARY KEY (`wtid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='交易';

DROP TABLE IF EXISTS `walletres`;
CREATE TABLE `walletres` (
  `wrid` int(11) NOT NULL AUTO_INCREMENT,
  `wid` int(11) NOT NULL,
  `picid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `type` varchar(4) NOT NULL,
  `path` varchar(128) NOT NULL,
  `comment` varchar(256) NULL,
  PRIMARY KEY (`wrid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='资源';
